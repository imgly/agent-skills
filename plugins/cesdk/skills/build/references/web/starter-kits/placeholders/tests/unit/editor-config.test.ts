import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setupActions as setupAdvancedActions } from '../../src/imgly/config/advanced-design-editor/actions';
import { AdvancedEditorConfig } from '../../src/imgly/config/advanced-design-editor/plugin';
import { setupTranslations as setupAdvancedTranslations } from '../../src/imgly/config/advanced-design-editor/i18n';
import { setupKeyboardShortcuts as setupAdvancedShortcuts } from '../../src/imgly/config/advanced-design-editor/keyboard/keyboard';
import { setupSettings as setupAdvancedSettings } from '../../src/imgly/config/advanced-design-editor/settings';
import { setupUI as setupAdvancedUI } from '../../src/imgly/config/advanced-design-editor/ui';
import { setupVideoTimeline as setupAdvancedVideoTimeline } from '../../src/imgly/config/advanced-design-editor/ui/videoTimeline';
import { setupComponents as setupAdvancedComponents } from '../../src/imgly/config/advanced-design-editor/ui/components';
import { setupActions as setupDesignActions } from '../../src/imgly/config/design-editor/actions';
import { DesignEditorConfig } from '../../src/imgly/config/design-editor/plugin';
import { setupTranslations as setupDesignTranslations } from '../../src/imgly/config/design-editor/i18n';
import { setupKeyboardShortcuts as setupDesignShortcuts } from '../../src/imgly/config/design-editor/keyboard/keyboard';
import { setupSettings as setupDesignSettings } from '../../src/imgly/config/design-editor/settings';
import { setupUI as setupDesignUI } from '../../src/imgly/config/design-editor/ui';
import { setupVideoTimeline as setupDesignVideoTimeline } from '../../src/imgly/config/design-editor/ui/videoTimeline';
import { setupComponents as setupDesignComponents } from '../../src/imgly/config/design-editor/ui/components';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: '0.0.0-test' } }));

type Spy = ReturnType<typeof createApiSpy<CreativeEditorSDK>>;
type ComponentOrder = [{ in: string; at?: string }, unknown[]];

function ordersOf(spy: Spy): ComponentOrder[] {
  return spy.callsTo('ui.setComponentOrder').map(({ args }) => args as never);
}

function orderFor(orders: ComponentOrder[], slot: string): unknown[] {
  const match = orders.find(([target]) => target.in === slot);
  if (match == null) {
    throw new Error(`No component order was set for ${slot}`);
  }
  return match[1];
}

function settingsOf(setup: (engine: CreativeEngine) => void) {
  const spy = createApiSpy<CreativeEngine>();
  setup(spy.api);
  return new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );
}

describe.each([
  ['the design editor', setupDesignUI, 'left'],
  ['the advanced editor', setupAdvancedUI, 'right']
])('PLC-U10 setupUI for %s', (_name, setupUI, inspectorSide) => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupUI(spy.api);
  const orders = ordersOf(spy);

  it(`docks the inspector on the ${inspectorSide} and the library on the left`, () => {
    const positions = new Map(
      spy
        .callsTo('ui.setPanelPosition')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(positions.get('//ly.img.panel/inspector')).toBe(inspectorSide);
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
    expect(
      spy.callsTo('ui.setPanelFloating').map(({ args }) => args[1])
    ).toEqual([false, false]);
  });

  it('places the panels before any bar, so the bars lay out against them', () => {
    const paths = spy.calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('puts the canvas bar at the bottom', () => {
    expect(
      orders.find(([target]) => target.in === 'ly.img.canvas.bar')?.[0]
    ).toMatchObject({ at: 'bottom' });
  });

  it('gives the transform, text and vector edit modes their own canvas menu', () => {
    const modes = orders
      .filter(([target]) => target.in === 'ly.img.canvas.menu')
      .map(
        ([target]) =>
          (target as { when?: { editMode?: string } }).when?.editMode
      );
    expect(modes).toEqual(
      expect.arrayContaining(['Transform', 'Text', 'Vector'])
    );
  });

  it('ends the transform inspector bar with the inspector toggle', () => {
    const transform = orders.find(
      ([target]) =>
        target.in === 'ly.img.inspector.bar' &&
        (target as { when?: { editMode?: string } }).when?.editMode ===
          'Transform'
    );
    expect(transform?.[1]).toContain('ly.img.fill.inspectorBar');
    expect(transform?.[1].at(-1)).toBe('ly.img.inspectorToggle.inspectorBar');
  });

  it('lists the design asset libraries in the dock', () => {
    const keys = (orderFor(orders, 'ly.img.dock') as { key?: string }[]).map(
      (entry) => entry.key
    );
    expect(keys).toContain('ly.img.templates');
    expect(keys).toContain('ly.img.text');
    expect(keys).toContain('ly.img.upload');
  });
});

describe('PLC-U11 the two configurations differ only where the kit means them to', () => {
  it('registers no custom component in either configuration', () => {
    for (const setupComponents of [
      setupDesignComponents,
      setupAdvancedComponents
    ]) {
      const spy = createApiSpy<CreativeEditorSDK>();
      setupComponents(spy.api);
      expect(spy.calls).toEqual([]);
    }
  });

  it('adds no translation in either configuration, so every label is a CE.SDK default', () => {
    for (const setupTranslations of [
      setupDesignTranslations,
      setupAdvancedTranslations
    ]) {
      const spy = createApiSpy<CreativeEditorSDK>();
      setupTranslations(spy.api);
      expect(spy.calls).toEqual([]);
    }
  });

  // The shared `@cesdk/core-configs-web` preset ships this module with its
  // import commented out, so both trees carry it unused.
  it('configures no video timeline in either configuration, as neither edits video', () => {
    for (const setupVideoTimeline of [
      setupDesignVideoTimeline,
      setupAdvancedVideoTimeline
    ]) {
      const spy = createApiSpy<CreativeEditorSDK>();
      setupVideoTimeline(spy.api);
      expect(spy.calls).toEqual([]);
    }
  });

  it('installs one shortcut catalog in either configuration', () => {
    for (const setupShortcuts of [
      setupDesignShortcuts,
      setupAdvancedShortcuts
    ]) {
      const spy = createApiSpy<CreativeEditorSDK>();
      setupShortcuts(spy.api);
      expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    }
  });

  it('turns the placeholder controls on in both configurations', () => {
    for (const settings of [
      settingsOf(setupDesignSettings),
      settingsOf(setupAdvancedSettings)
    ]) {
      expect(settings.get('placeholderControls/showOverlay')).toBe(true);
      expect(settings.get('placeholderControls/showButton')).toBe(true);
      expect(settings.get('page/allowCropInteraction')).toBe(true);
      expect(settings.get('page/selectWhenNoBlocksSelected')).toBe(false);
    }
  });
});

describe.each([
  ['DesignEditorConfig', DesignEditorConfig, undefined],
  ['AdvancedEditorConfig', AdvancedEditorConfig, 'advanced']
])('PLC-U12 %s.initialize', (_name, Config, view) => {
  it('resets the editor before it configures anything', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    await new Config().initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as never);

    const paths = cesdk.calls.map(({ path }) => path);
    expect(paths[0]).toBe('resetEditor');
    expect(paths[1]).toBe('setEditorCompatibilityVersion');
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual([
      new Config().version
    ]);
    expect(paths).toContain('feature.enable');
    expect(paths).toContain('ui.setComponentOrder');
    expect(paths).toContain('actions.register');
    expect(paths).toContain('shortcuts.set');
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
  });

  it(
    view == null ? 'keeps the default view' : `switches to the ${view} view`,
    async () => {
      const cesdk = createApiSpy<CreativeEditorSDK>();
      const engine = createApiSpy<CreativeEngine>();
      await new Config().initialize({
        cesdk: cesdk.api,
        engine: engine.api
      } as never);
      expect(cesdk.callsTo('ui.setView').map(({ args }) => args[0])).toEqual(
        view == null ? [] : [view]
      );
    }
  );

  it('does nothing without a cesdk instance', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new Config().initialize({
      cesdk: undefined,
      engine: engine.api
    } as never);
    expect(engine.calls).toEqual([]);
  });
});

describe.each([
  ['the design editor', setupDesignActions],
  ['the advanced editor', setupAdvancedActions]
])('PLC-U13 the actions %s registers', (_name, setupActions) => {
  let cesdk: Spy;
  let handlers: Map<string, (...args: never[]) => unknown>;

  beforeEach(() => {
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    cesdk = createApiSpy<CreativeEditorSDK>();
    setupActions(cesdk.api);
    handlers = new Map(
      cesdk
        .callsTo('actions.register')
        .map(({ args }) => [
          args[0] as string,
          args[1] as (...rest: never[]) => unknown
        ])
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers save, export, import and upload', () => {
    expect([...handlers.keys()].sort()).toEqual([
      'exportDesign',
      'exportScene',
      'importScene',
      'saveScene',
      'uploadFile'
    ]);
  });

  it('saves the scene as plain text', async () => {
    await handlers.get('saveScene')!();
    expect(cesdk.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(cesdk.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it('passes the caller export options straight through', async () => {
    await handlers.get('exportDesign')!({ mimeType: 'image/png' } as never);
    expect(cesdk.lastArgsOf('utils.export')?.[0]).toEqual({
      mimeType: 'image/png'
    });
    expect(cesdk.callsTo('utils.downloadFile')).toHaveLength(1);
  });

  it('exports an archive as a zip and a scene as text', async () => {
    await handlers.get('exportScene')!({ format: 'archive' } as never);
    expect(cesdk.callsTo('engine.scene.saveToArchive')).toHaveLength(1);
    expect(cesdk.lastArgsOf('utils.downloadFile')?.[1]).toBe('application/zip');

    await handlers.get('exportScene')!({} as never);
    expect(cesdk.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(cesdk.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it('offers one picker for scenes and archives, then zooms to the first page', async () => {
    await handlers.get('importScene')!();
    expect(cesdk.lastArgsOf('utils.loadFile')?.[0]).toEqual({
      accept: '.imgly,.scene,.zip',
      returnType: 'objectURL'
    });
    expect(cesdk.callsTo('engine.scene.load')).toHaveLength(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(cesdk.lastArgsOf('actions.run')).toEqual([
      'zoom.toPage',
      { page: 'first' }
    ]);
  });

  it('releases the object URL even when the load fails', async () => {
    const failing = createApiSpy<CreativeEditorSDK>();
    const registered = new Map<string, (...args: never[]) => unknown>();
    setupActions({
      ...failing.api,
      actions: {
        register: (id: string, handler: (...args: never[]) => unknown) => {
          registered.set(id, handler);
        },
        run: failing.api.actions.run
      },
      utils: {
        ...failing.api.utils,
        loadFile: async () => 'blob:kit'
      },
      engine: {
        scene: {
          load: async () => {
            throw new Error('unreadable scene');
          }
        }
      }
    } as unknown as CreativeEditorSDK);

    await expect(registered.get('importScene')!()).rejects.toThrow(
      'unreadable scene'
    );
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:kit');
  });

  it('uploads through the SDK local upload helper', () => {
    handlers.get('uploadFile')!(
      'file' as never,
      undefined as never,
      'context' as never
    );
    expect(cesdk.lastArgsOf('utils.localUpload')).toEqual(['file', 'context']);
  });
});
