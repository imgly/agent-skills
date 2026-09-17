import { createApiSpy, type ApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupComponents } from '../../src/imgly/config/ui/components';

interface BuilderCall {
  type: 'Button' | 'ButtonGroup' | 'Dropdown';
  id: string;
  options: Record<string, any>;
}

/** Records what the component asks the builder to render, children included. */
function createBuilder() {
  const calls: BuilderCall[] = [];
  const record = (type: BuilderCall['type']) => (id: string, options: any) => {
    calls.push({ type, id, options: options ?? {} });
    options?.children?.({
      close: () => calls.push({ type: 'Button', id: 'close', options: {} })
    });
  };
  return {
    calls,
    builder: {
      Button: record('Button'),
      ButtonGroup: record('ButtonGroup'),
      Dropdown: record('Dropdown')
    }
  };
}

function createEngine(
  pages: number[],
  currentPage: number | null,
  names: Record<number, string> = {}
) {
  return {
    scene: {
      getPages: () => pages,
      getCurrentPage: () => currentPage
    },
    block: {
      isValid: (id: number) => pages.includes(id),
      getName: (id: number) => names[id] ?? ''
    }
  };
}

/** Registers the kit's components and returns the `page-select` render function. */
function renderFunction(spy: ApiSpy<CreativeEditorSDK>) {
  setupComponents(spy.api);
  const registration = spy
    .callsTo('ui.registerComponent')
    .find(({ args }) => args[0] === 'page-select');
  expect(registration).toBeDefined();
  return registration!.args[1] as (context: {
    builder: ReturnType<typeof createBuilder>['builder'];
    engine: unknown;
  }) => void;
}

function render(
  spy: ApiSpy<CreativeEditorSDK>,
  renderPageSelect: ReturnType<typeof renderFunction>,
  engine: ReturnType<typeof createEngine>
) {
  const { builder, calls } = createBuilder();
  renderPageSelect({ builder, engine });
  return { calls, spy };
}

describe('SPE-U1 page-select with three pages or fewer', () => {
  it('renders one button per page and marks the current one active', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const { calls } = render(
      spy,
      renderFunction(spy),
      createEngine([10, 20], 10)
    );

    expect(calls[0]).toMatchObject({ type: 'ButtonGroup', id: 'pages' });
    expect(
      calls
        .slice(1)
        .map((call) => [call.id, call.options.label, call.options.isActive])
    ).toEqual([
      ['10', 'Page 1', true],
      ['20', 'Page 2', false]
    ]);
  });

  it('prefers the page name over the positional label', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const engine = createEngine([10, 20], 10, { 20: 'Back' });
    const { calls } = render(spy, renderFunction(spy), engine);

    expect(calls.map((call) => call.options.label)).toEqual([
      undefined,
      'Page 1',
      'Back'
    ]);
  });
});

describe('SPE-U2 page-select with four pages or more', () => {
  const pages = [10, 20, 30, 40];

  it('renders previous, a page dropdown and next', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const { calls } = render(spy, renderFunction(spy), createEngine(pages, 20));

    expect(calls.map((call) => [call.type, call.id])).toEqual([
      ['ButtonGroup', 'pagesControls'],
      ['Button', 'prevPage'],
      ['Dropdown', 'pageSelect'],
      ['Button', '10'],
      ['Button', '20'],
      ['Button', '30'],
      ['Button', '40'],
      ['Button', 'nextPage']
    ]);
    expect(calls[2].options.label).toBe('Page 2 / 4');
    expect(calls[1].options.isDisabled).toBe(false);
    expect(calls.at(-1)!.options.isDisabled).toBe(false);
  });

  it('disables previous on the first page and next on the last', () => {
    const first = createApiSpy<CreativeEditorSDK>();
    const firstCalls = render(
      first,
      renderFunction(first),
      createEngine(pages, 10)
    ).calls;
    expect(
      firstCalls.find((call) => call.id === 'prevPage')!.options.isDisabled
    ).toBe(true);
    expect(
      firstCalls.find((call) => call.id === 'nextPage')!.options.isDisabled
    ).toBe(false);

    const last = createApiSpy<CreativeEditorSDK>();
    const lastCalls = render(
      last,
      renderFunction(last),
      createEngine(pages, 40)
    ).calls;
    expect(
      lastCalls.find((call) => call.id === 'prevPage')!.options.isDisabled
    ).toBe(false);
    expect(
      lastCalls.find((call) => call.id === 'nextPage')!.options.isDisabled
    ).toBe(true);
  });

  it('switches and selects the page a dropdown entry names, then closes the dropdown', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const { calls } = render(spy, renderFunction(spy), createEngine(pages, 20));

    calls.find((call) => call.id === '30')!.options.onClick();

    expect(spy.lastArgsOf('unstable_switchPage')).toEqual([30]);
    expect(spy.lastArgsOf('engine.block.select')).toEqual([30]);
    expect(calls.at(-1)).toMatchObject({ id: 'close' });
  });

  it('moves one page forward and one page back', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const { calls } = render(spy, renderFunction(spy), createEngine(pages, 20));

    calls.find((call) => call.id === 'nextPage')!.options.onClick();
    expect(spy.lastArgsOf('unstable_switchPage')).toEqual([30]);

    calls.find((call) => call.id === 'prevPage')!.options.onClick();
    expect(spy.lastArgsOf('unstable_switchPage')).toEqual([10]);
  });
});

describe('SPE-U3 page-select with one page', () => {
  it('renders nothing', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const { calls } = render(spy, renderFunction(spy), createEngine([10], 10));

    expect(calls).toEqual([]);
  });
});

describe('SPE-U4 page-select when the current page is deleted', () => {
  it('switches to the page that took the deleted index', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const renderPageSelect = renderFunction(spy);

    render(spy, renderPageSelect, createEngine([10, 20, 30, 40], 30));
    expect(spy.callsTo('unstable_switchPage')).toHaveLength(0);

    render(spy, renderPageSelect, createEngine([10, 20, 40], 30));

    expect(spy.lastArgsOf('unstable_switchPage')).toEqual([40]);
    expect(spy.lastArgsOf('engine.block.select')).toEqual([40]);
  });
});

describe('SPE-U9 the icon set', () => {
  it('defines the two arrows page-select uses', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupComponents(spy.api);

    const [id, markup] = spy.lastArgsOf('ui.addIconSet') as [string, string];
    expect(id).toBe('@imgly/custom');
    expect(markup).toContain('id="@imgly/custom/icon/ArrowLeft"');
    expect(markup).toContain('id="@imgly/custom/icon/ArrowRight"');
  });
});

describe('SPE-U14 page-select edge cases', () => {
  const pages = [10, 20, 30, 40];

  it('labels nothing for a page the engine no longer knows', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const { calls } = render(spy, renderFunction(spy), createEngine(pages, 99));

    expect(calls.find((call) => call.id === 'pageSelect')!.options.label).toBe(
      ' / 4'
    );
  });

  it('labels nothing for a valid block that is not a page', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const engine = {
      ...createEngine(pages, 99),
      block: { isValid: () => true, getName: () => '' }
    };
    const { calls } = render(spy, renderFunction(spy), engine);

    expect(calls.find((call) => call.id === 'pageSelect')!.options.label).toBe(
      ' / 4'
    );
  });

  it('falls back to the page before the deleted index, then to the first page', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const renderPageSelect = renderFunction(spy);

    render(spy, renderPageSelect, createEngine([10, 20, 30, 40], 40));
    render(spy, renderPageSelect, createEngine([10, 20, 30], 99));
    expect(spy.lastArgsOf('unstable_switchPage')).toEqual([30]);

    render(spy, renderPageSelect, createEngine([10, 20, 30, 40, 50], 50));
    render(spy, renderPageSelect, createEngine([10, 20, 30], 99));
    expect(spy.lastArgsOf('unstable_switchPage')).toEqual([10]);
  });

  it('switches no page when the scene has none left', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const { calls } = render(spy, renderFunction(spy), createEngine([], 99));

    expect(spy.callsTo('unstable_switchPage')).toHaveLength(0);
    expect(calls).toEqual([]);
  });

  it('renders the four-page controls when no page is current', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const { calls } = render(
      spy,
      renderFunction(spy),
      createEngine(pages, null)
    );

    expect(calls.find((call) => call.id === 'pageSelect')!.options.label).toBe(
      ' / 4'
    );
    expect(
      calls.find((call) => call.id === 'prevPage')!.options.isDisabled
    ).toBe(true);
  });

  it('switches from a page button, and stays put on the active one', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const { calls } = render(
      spy,
      renderFunction(spy),
      createEngine([10, 20], 10)
    );

    calls.find((call) => call.id === '10')!.options.onClick();
    expect(spy.callsTo('unstable_switchPage')).toHaveLength(0);

    calls.find((call) => call.id === '20')!.options.onClick();
    expect(spy.lastArgsOf('unstable_switchPage')).toEqual([20]);
    expect(spy.lastArgsOf('engine.block.select')).toEqual([20]);
  });
});
