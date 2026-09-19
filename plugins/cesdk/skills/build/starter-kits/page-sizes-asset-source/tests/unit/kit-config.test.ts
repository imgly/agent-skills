import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupSettings } from '../../src/imgly/config/settings';

const RESIZE_PANEL = '//ly.img.panel/inspector/pageResize';

describe('PGS-U1 setupDock', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupDock(spy.api);
  const settings = new Map(
    spy
      .callsTo('engine.editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );
  const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
    { in: string },
    ({ key: string } | string)[]
  ];

  it('shows labels and large icons', () => {
    expect(settings.get('dock/hideLabels')).toBe(false);
    expect(settings.get('dock/iconSize')).toBe('large');
  });

  it('puts the page resize button first, followed by a separator', () => {
    expect(target).toEqual({ in: 'ly.img.dock' });
    expect(
      order.map((entry) => (typeof entry === 'string' ? entry : entry.key))
    ).toEqual([
      'ly.img.page.resize.dock',
      'ly.img.separator',
      'ly.img.templates',
      'ly.img.separator',
      'ly.img.elements',
      'ly.img.upload',
      'ly.img.image',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker',
      'ly.img.spacer',
      'ly.img.separator.layers',
      'ly.img.layerList'
    ]);
  });
});

describe('PGS-U2 setupSettings', () => {
  const spy = createApiSpy<CreativeEngine>();
  setupSettings(spy.api);
  const written = spy.callsTo('editor.setSetting');
  const settings = new Map(
    written.map(({ args }) => [args[0] as string, args[1]])
  );

  it.each([
    ['doubleClickToCropEnabled', true],
    ['doubleClickSelectionMode', 'Hierarchical'],
    ['dragToSwapFills/enabled', true],
    ['page/allowCropInteraction', true],
    ['page/dimOutOfPageAreas', true],
    ['page/moveChildrenWhenCroppingFill', false],
    ['page/selectWhenNoBlocksSelected', false],
    ['page/title/show', false],
    ['page/title/showOnSinglePage', true],
    ['page/title/showPageTitleTemplate', true],
    ['page/title/appendPageName', true],
    ['page/title/separator', '-'],
    ['page/title/canEdit', true],
    ['placeholderControls/showOverlay', true],
    ['placeholderControls/showButton', true],
    ['colorPicker/colorMode', 'Any']
  ])('sets %s to %s', (key, value) => {
    expect(settings.get(key as string)).toBe(value);
  });

  it('writes nothing else', () => {
    expect(written).toHaveLength(16);
  });
});

interface ButtonOptions {
  label: string;
  icon: () => string;
  isSelected: boolean;
  onClick: () => void;
}

/** Records panel calls and answers `isPanelOpen` with a value the test picks. */
function fakeEditor(isPanelOpen: boolean) {
  const calls: { path: string; args: unknown[] }[] = [];
  const record =
    (path: string) =>
    (...args: unknown[]) => {
      calls.push({ path, args });
    };
  return {
    calls,
    cesdk: {
      ui: {
        registerComponent: record('ui.registerComponent'),
        isPanelOpen: () => isPanelOpen,
        openPanel: record('ui.openPanel'),
        closePanel: record('ui.closePanel')
      }
    } as unknown as CreativeEditorSDK
  };
}

function renderDockButton(isPanelOpen: boolean) {
  const editor = fakeEditor(isPanelOpen);
  setupComponents(editor.cesdk);
  const [id, render] = editor.calls.find(
    ({ path }) => path === 'ui.registerComponent'
  )!.args as [string, (context: unknown) => void];

  let options: ButtonOptions | undefined;
  render({
    builder: {
      Button: (_buttonId: string, buttonOptions: ButtonOptions) => {
        options = buttonOptions;
      }
    }
  });
  return { id, options: options!, calls: editor.calls };
}

describe('PGS-U3 the resize dock component', () => {
  it('registers ly.img.page.resize.dock with the kit icon', () => {
    const { id, options } = renderDockButton(false);

    expect(id).toBe('ly.img.page.resize.dock');
    expect(options.label).toBe('Page Sizes');
    expect(options.icon()).toContain('assets/page-sizes-large.svg');
  });

  it('opens the resize panel while it is closed', () => {
    const { options, calls } = renderDockButton(false);

    expect(options.isSelected).toBe(false);
    options.onClick();
    expect(calls.filter(({ path }) => path === 'ui.openPanel')).toEqual([
      { path: 'ui.openPanel', args: [RESIZE_PANEL] }
    ]);
  });

  it('closes the resize panel while it is open and marks the button selected', () => {
    const { options, calls } = renderDockButton(true);

    expect(options.isSelected).toBe(true);
    options.onClick();
    expect(calls.filter(({ path }) => path === 'ui.closePanel')).toEqual([
      { path: 'ui.closePanel', args: [RESIZE_PANEL] }
    ]);
  });
});

describe('PGS-U5 setupActions', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupActions(spy.api);
  const registered = spy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it('registers the actions the kit UI reaches', () => {
    expect(registered).toEqual(
      expect.arrayContaining([
        'saveScene',
        'exportDesign',
        'importScene',
        'exportScene',
        'uploadFile'
      ])
    );
  });
});
