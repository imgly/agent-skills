import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';
import { setupDock } from '../../src/imgly/config/photo-editor/ui/dock';
import { setupVideoTimeline as setupDesignTimeline } from '../../src/imgly/config/design-editor/ui/videoTimeline';
import { setupVideoTimeline as setupPhotoTimeline } from '../../src/imgly/config/photo-editor/ui/videoTimeline';

interface ButtonOptions {
  label: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

interface DockSpy {
  calls: { path: string; args: unknown[] }[];
  components: Map<string, (context: BuilderContext) => void>;
  callsTo(path: string): { path: string; args: unknown[] }[];
  lastArgsOf(path: string): unknown[] | undefined;
}

interface BuilderContext {
  builder: { Button: (key: string, options: ButtonOptions) => void };
}

/**
 * A `CreativeEditorSDK` stand-in with the three answers the dock branches on.
 * Everything the dock writes is recorded instead.
 */
function setup({
  editMode = 'Transform',
  openPanel = false,
  currentPage = 7 as number | null
} = {}): DockSpy {
  const calls: { path: string; args: unknown[] }[] = [];
  const components = new Map<string, (context: BuilderContext) => void>();
  const record =
    (path: string) =>
    (...args: unknown[]) => {
      calls.push({ path, args });
    };
  const cesdk = {
    engine: {
      editor: {
        setSetting: record('engine.editor.setSetting'),
        getEditMode: () => editMode,
        setEditMode: record('engine.editor.setEditMode')
      },
      scene: { getCurrentPage: () => currentPage },
      block: { select: record('engine.block.select') }
    },
    ui: {
      registerComponent: (id: string, render: (c: BuilderContext) => void) => {
        calls.push({ path: 'ui.registerComponent', args: [id, render] });
        components.set(id, render);
      },
      isPanelOpen: () => openPanel,
      openPanel: record('ui.openPanel'),
      closePanel: record('ui.closePanel'),
      setComponentOrder: record('ui.setComponentOrder')
    }
  };
  setupDock(cesdk as unknown as CreativeEditorSDK);
  return {
    calls,
    components,
    callsTo: (path) => calls.filter((call) => call.path === path),
    lastArgsOf: (path) =>
      calls.filter((call) => call.path === path).at(-1)?.args
  };
}

/**
 * The dock components are builder callbacks. Rendering one records the button
 * it declares so the test can read its state and press it.
 */
function renderComponent(spy: DockSpy, id: string): ButtonOptions {
  const render = spy.components.get(id);
  if (render == null) throw new Error(`${id} was never registered`);
  let options: ButtonOptions | undefined;
  render({
    builder: {
      Button: (_key, given) => {
        options = given;
      }
    }
  });
  if (options == null) throw new Error(`${id} declared no button`);
  return options;
}

describe('AIE-U19 the photo dock', () => {
  it('AIE-U19 shows large labelled icons and the photo tools in order', () => {
    const spy = setup();

    expect(
      spy.callsTo('engine.editor.setSetting').map(({ args }) => args)
    ).toEqual(
      expect.arrayContaining([
        ['dock/hideLabels', false],
        ['dock/iconSize', 'large']
      ])
    );
    expect(
      spy.callsTo('ui.registerComponent').map(({ args }) => args[0])
    ).toEqual([
      'ly.img.crop.dock',
      'ly.img.adjustment.dock',
      'ly.img.filter.dock',
      'ly.img.effects.dock'
    ]);
    const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
      { in: string },
      (string | { key: string })[]
    ];
    expect(target).toEqual({ in: 'ly.img.dock' });
    expect(
      order.map((entry) => (typeof entry === 'string' ? entry : entry.key))
    ).toEqual([
      'ly.img.spacer',
      'ly.img.crop.dock',
      'ly.img.adjustment.dock',
      'ly.img.filter.dock',
      'ly.img.effects.dock',
      'ly.img.separator',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker',
      'ly.img.spacer'
    ]);
  });

  it('AIE-U19 enters crop mode on the current page', () => {
    const spy = setup();

    const crop = renderComponent(spy, 'ly.img.crop.dock');
    expect(crop.isSelected).toBe(false);
    crop.onClick();

    expect(spy.lastArgsOf('ui.closePanel')).toEqual(['*']);
    expect(spy.lastArgsOf('engine.block.select')).toEqual([7]);
    expect(spy.lastArgsOf('engine.editor.setEditMode')).toEqual(['Crop']);
  });

  it('AIE-U19 leaves crop mode when it is already on', () => {
    const spy = setup({ editMode: 'Crop' });

    const crop = renderComponent(spy, 'ly.img.crop.dock');
    expect(crop.isSelected).toBe(true);
    crop.onClick();

    expect(spy.lastArgsOf('engine.editor.setEditMode')).toEqual(['Transform']);
    expect(spy.callsTo('engine.block.select')).toHaveLength(0);
  });

  it('AIE-U19 does nothing while the scene has no current page', () => {
    const spy = setup({ currentPage: null });

    renderComponent(spy, 'ly.img.crop.dock').onClick();

    expect(spy.callsTo('engine.editor.setEditMode')).toHaveLength(0);
  });

  it.each([
    ['ly.img.adjustment.dock', '//ly.img.panel/inspector/adjustments'],
    ['ly.img.filter.dock', '//ly.img.panel/inspector/filters'],
    ['ly.img.effects.dock', '//ly.img.panel/inspector/effects']
  ])('AIE-U19 %s opens its inspector panel', (id, panelId) => {
    const spy = setup();

    const button = renderComponent(spy, id);
    expect(button.isSelected).toBe(false);
    button.onClick();

    expect(spy.lastArgsOf('engine.editor.setEditMode')).toEqual(['Transform']);
    expect(spy.lastArgsOf('engine.block.select')).toEqual([7]);
    expect(spy.lastArgsOf('ui.openPanel')).toEqual([
      panelId,
      { floating: true }
    ]);
  });

  it.each([
    ['ly.img.adjustment.dock', '//ly.img.panel/inspector/adjustments'],
    ['ly.img.filter.dock', '//ly.img.panel/inspector/filters'],
    ['ly.img.effects.dock', '//ly.img.panel/inspector/effects']
  ])('AIE-U19 %s closes its panel when it is open', (id, panelId) => {
    const spy = setup({ openPanel: true });

    const button = renderComponent(spy, id);
    expect(button.isSelected).toBe(true);
    button.onClick();

    expect(spy.lastArgsOf('ui.closePanel')).toEqual([panelId]);
    expect(spy.callsTo('ui.openPanel')).toHaveLength(0);
  });

  it.each([
    'ly.img.adjustment.dock',
    'ly.img.filter.dock',
    'ly.img.effects.dock'
  ])('AIE-U19 %s does nothing without a current page', (id) => {
    const spy = setup({ currentPage: null });

    renderComponent(spy, id).onClick();

    expect(spy.callsTo('ui.openPanel')).toHaveLength(0);
  });
});

describe('AIE-U20 the timeline setup the design and photo editors ship unused', () => {
  it.each([
    ['the design editor', setupDesignTimeline],
    ['the photo editor', setupPhotoTimeline]
  ])('AIE-U20 %s leaves the timeline alone', (_tree, setupVideoTimeline) => {
    const spy = createApiSpy<CreativeEditorSDK>();

    setupVideoTimeline(spy.api);

    expect(spy.calls).toEqual([]);
  });
});

describe('AIE-U21 the dock guards the builder contract', () => {
  it('AIE-U21 declares one button per component', () => {
    const spy = setup();
    const declared = vi.fn();
    for (const render of spy.components.values()) {
      render({
        builder: {
          Button: declared as unknown as BuilderContext['builder']['Button']
        }
      });
    }

    expect(declared).toHaveBeenCalledTimes(4);
  });
});
