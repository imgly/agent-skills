import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { usAnsiCatalog } from '../../src/imgly/config/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { PhotoEditorConfig } from '../../src/imgly/config/plugin';
import { setupUI } from '../../src/imgly/config/ui';
import { setupCanvas } from '../../src/imgly/config/ui/canvas';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupInspectorBar } from '../../src/imgly/config/ui/inspectorBar';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

type OrderTarget = { in: string; at?: string; when?: { editMode?: string } };

function run(setup: (cesdk: CreativeEditorSDK) => void) {
  const spy = createApiSpy<CreativeEditorSDK>();
  setup(spy.api);
  return spy;
}

function barFor(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>,
  slot: string,
  editMode?: string
): unknown[] {
  const match = spy
    .callsTo('ui.setComponentOrder')
    .map(({ args }) => args as [OrderTarget, unknown[]])
    .find(
      ([target]) => target.in === slot && target.when?.editMode === editMode
    );
  if (match == null) {
    throw new Error(`No component order for ${slot} (editMode ${editMode})`);
  }
  return match[1];
}

describe('SWI-U12 setupUI', () => {
  const spy = run(setupUI);

  it('positions the panels before it orders any component', () => {
    const paths = spy.calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeGreaterThanOrEqual(0);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('orders the photo-editor bars and leaves the video timeline alone', () => {
    const slots = new Set(
      spy
        .callsTo('ui.setComponentOrder')
        .map(({ args }) => (args[0] as OrderTarget).in)
    );
    expect([...slots].sort()).toEqual([
      'ly.img.canvas.bar',
      'ly.img.canvas.menu',
      'ly.img.dock',
      'ly.img.inspector.bar',
      'ly.img.navigation.bar'
    ]);
  });
});

describe('SWI-U13 setupCanvas', () => {
  const spy = run(setupCanvas);

  it('keeps the page settings and the add-page button in a bottom canvas bar', () => {
    const [target, entries] = spy
      .callsTo('ui.setComponentOrder')
      .map(({ args }) => args as [OrderTarget, unknown[]])
      .find(([slot]) => slot.in === 'ly.img.canvas.bar') as [
      OrderTarget,
      unknown[]
    ];
    expect(target.at).toBe('bottom');
    expect(entries).toEqual([
      'ly.img.settings.canvasBar',
      'ly.img.spacer',
      'ly.img.page.add.canvasBar',
      'ly.img.spacer'
    ]);
  });

  it('offers the overlay controls in the Transform menu and formatting in Text', () => {
    expect(barFor(spy, 'ly.img.canvas.menu', 'Transform')).toContain(
      'ly.img.delete.canvasMenu'
    );
    expect(barFor(spy, 'ly.img.canvas.menu', 'Text')).toContain(
      'ly.img.text.bold.canvasMenu'
    );
  });

  it('leaves the Vector canvas menu at the editor default', () => {
    const modes = spy
      .callsTo('ui.setComponentOrder')
      .map(({ args }) => (args[0] as OrderTarget).when?.editMode);
    expect(modes).not.toContain('Vector');
  });
});

describe('SWI-U14 setupInspectorBar', () => {
  const spy = run(setupInspectorBar);

  it('offers the photo controls in the Transform bar', () => {
    const entries = barFor(spy, 'ly.img.inspector.bar', 'Transform');
    expect(entries).toContain('ly.img.crop.inspectorBar');
    expect(entries).toContain('ly.img.fill.inspectorBar');
    expect(entries).toContain('ly.img.inspectorToggle.inspectorBar');
  });

  it('replaces the bar with the mode controls while trimming or cropping', () => {
    expect(barFor(spy, 'ly.img.inspector.bar', 'Trim')).toEqual([
      'ly.img.trimControls.inspectorBar'
    ]);
    expect(barFor(spy, 'ly.img.inspector.bar', 'Crop')).toEqual([
      'ly.img.cropControls.inspectorBar'
    ]);
  });

  it('offers the vector edit modes in the Vector bar', () => {
    expect(barFor(spy, 'ly.img.inspector.bar', 'Vector')).toContain(
      'ly.img.vectorEdit.done.inspectorBar'
    );
  });
});

describe('SWI-U15 the setups this kit deliberately leaves empty', () => {
  it.each([
    ['setupComponents', setupComponents],
    ['setupVideoTimeline', setupVideoTimeline]
  ])('%s makes no call, so the editor keeps its defaults', (_name, setup) => {
    expect(run(setup).calls).toEqual([]);
  });

  it('installs the US ANSI shortcut catalog unchanged', () => {
    const spy = run(setupKeyboardShortcuts);
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(spy.lastArgsOf('shortcuts.set')?.[0]).toBe(usAnsiCatalog);
  });
});

describe('SWI-U16 setupActions', () => {
  const spy = run(setupActions);
  const [name, handler] = spy.lastArgsOf('actions.register') as [
    string,
    (options?: unknown) => Promise<void>
  ];

  it('overrides exactly one action, exportDesign', () => {
    expect(spy.callsTo('actions.register')).toHaveLength(1);
    expect(name).toBe('exportDesign');
  });

  it('forwards the caller options and downloads the first blob', async () => {
    await handler({ mimeType: 'image/png' });
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      mimeType: 'image/png'
    });
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });
});

describe('SWI-U17 PhotoEditorConfig', () => {
  it('is named for the kit and carries the SDK version', () => {
    const plugin = new PhotoEditorConfig();
    expect(plugin.name).toBe('cesdk-photo-editor');
    expect(plugin.version).toBe('test');
  });

  it('resets the editor before it configures anything', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    await new PhotoEditorConfig().initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as EditorPluginContext);

    expect(cesdk.calls[0].path).toBe('resetEditor');
    expect(cesdk.calls[1].path).toBe('setEditorCompatibilityVersion');
    expect(cesdk.callsTo('setEditorCompatibilityVersion')).toHaveLength(1);
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual(['test']);
    expect(cesdk.callsTo('feature.enable')).toHaveLength(1);
    expect(cesdk.callsTo('shortcuts.set')).toHaveLength(1);
    expect(cesdk.callsTo('actions.register')).toHaveLength(1);
    expect(cesdk.callsTo('onReset')).toHaveLength(1);
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
  });

  it('drops its subscriptions when the editor resets', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    await new PhotoEditorConfig().initialize({
      cesdk: cesdk.api,
      engine: createApiSpy<CreativeEngine>().api
    } as EditorPluginContext);

    const onReset = cesdk.lastArgsOf('onReset')?.[0] as () => void;
    expect(typeof onReset).toBe('function');
    expect(() => onReset()).not.toThrow();
  });

  it('does nothing without an editor, so the engine-only host stays untouched', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new PhotoEditorConfig().initialize({
      engine: engine.api
    } as EditorPluginContext);
    expect(engine.calls).toEqual([]);
  });
});
