import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { usAnsiCatalog } from '../../src/imgly/config/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { DesignEditorConfig } from '../../src/imgly/config/plugin';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupUI } from '../../src/imgly/config/ui';
import { setupCanvas } from '../../src/imgly/config/ui/canvas';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupInspectorBar } from '../../src/imgly/config/ui/inspectorBar';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { setupPanels } from '../../src/imgly/config/ui/panel';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

type OrderTarget = { in: string; at?: string; when?: { editMode?: string } };

function run<T>(setup: (api: T) => void) {
  const spy = createApiSpy<T>();
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

describe('PEX-U20 setupPanels and setupUI', () => {
  it('docks the inspector and the asset library on the left', () => {
    const spy = run<CreativeEditorSDK>(setupPanels);
    const positions = new Map(
      spy
        .callsTo('ui.setPanelPosition')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    const floating = new Map(
      spy
        .callsTo('ui.setPanelFloating')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(positions.get('//ly.img.panel/inspector')).toBe('left');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
    expect(floating.get('//ly.img.panel/inspector')).toBe(false);
    expect(floating.get('//ly.img.panel/assetLibrary')).toBe(false);
  });

  it('positions the panels before it orders any component', () => {
    const paths = run<CreativeEditorSDK>(setupUI).calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeGreaterThanOrEqual(0);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('orders the design-editor bars and leaves the video timeline alone', () => {
    const slots = new Set(
      run<CreativeEditorSDK>(setupUI)
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

describe('PEX-U21 setupCanvas and setupInspectorBar', () => {
  const canvas = run<CreativeEditorSDK>(setupCanvas);
  const inspector = run<CreativeEditorSDK>(setupInspectorBar);

  it('keeps the add-page button in a bottom canvas bar', () => {
    const [target, entries] = canvas
      .callsTo('ui.setComponentOrder')
      .map(({ args }) => args as [OrderTarget, unknown[]])
      .find(([slot]) => slot.in === 'ly.img.canvas.bar') as [
      OrderTarget,
      unknown[]
    ];
    expect(target.at).toBe('bottom');
    expect(entries).toContain('ly.img.page.add.canvasBar');
  });

  it('offers duplicate and delete in the Transform canvas menu', () => {
    const entries = barFor(canvas, 'ly.img.canvas.menu', 'Transform');
    expect(entries).toContain('ly.img.duplicate.canvasMenu');
    expect(entries).toContain('ly.img.delete.canvasMenu');
  });

  it('offers text formatting in the Text canvas menu and nothing in Vector', () => {
    expect(barFor(canvas, 'ly.img.canvas.menu', 'Text')).toContain(
      'ly.img.text.bold.canvasMenu'
    );
    expect(barFor(canvas, 'ly.img.canvas.menu', 'Vector')).toEqual([]);
  });

  it('offers the image controls in the Transform inspector bar', () => {
    const entries = barFor(inspector, 'ly.img.inspector.bar', 'Transform');
    expect(entries).toContain('ly.img.crop.inspectorBar');
    expect(entries).toContain('ly.img.fill.inspectorBar');
    expect(entries).toContain('ly.img.inspectorToggle.inspectorBar');
  });

  it('replaces the inspector bar with the mode controls while cropping', () => {
    expect(barFor(inspector, 'ly.img.inspector.bar', 'Crop')).toEqual([
      'ly.img.cropControls.inspectorBar'
    ]);
    expect(barFor(inspector, 'ly.img.inspector.bar', 'Vector')).toContain(
      'ly.img.vectorEdit.done.inspectorBar'
    );
  });
});

describe('PEX-U22 setupNavigationBar and setupSettings', () => {
  it('offers image and PDF export from the navigation bar', () => {
    const entries = barFor(
      run<CreativeEditorSDK>(setupNavigationBar),
      'ly.img.navigation.bar'
    );
    expect(entries).toContainEqual({
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar'
      ]
    });
  });

  it('writes the page and crop settings the kit relies on', () => {
    const settings = new Map(
      run<CreativeEngine>(setupSettings)
        .callsTo('editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('doubleClickToCropEnabled')).toBe(true);
    expect(settings.get('doubleClickSelectionMode')).toBe('Hierarchical');
    expect(settings.get('page/allowCropInteraction')).toBe(true);
    expect(settings.get('page/dimOutOfPageAreas')).toBe(true);
    expect(settings.get('page/moveChildrenWhenCroppingFill')).toBe(false);
    expect(settings.get('page/selectWhenNoBlocksSelected')).toBe(false);
    expect(settings.get('page/title/show')).toBe(false);
  });
});

describe('PEX-U23 the setups this kit leaves empty', () => {
  it.each([
    ['setupComponents', setupComponents],
    ['setupVideoTimeline', setupVideoTimeline]
  ])('%s makes no call, so the editor keeps its defaults', (_name, setup) => {
    expect(run<CreativeEditorSDK>(setup).calls).toEqual([]);
  });

  it('installs the US ANSI shortcut catalog unchanged', () => {
    const spy = run<CreativeEditorSDK>(setupKeyboardShortcuts);
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(spy.lastArgsOf('shortcuts.set')?.[0]).toBe(usAnsiCatalog);
  });
});

describe('PEX-U24 DesignEditorConfig', () => {
  it('is named for the kit and carries the SDK version', () => {
    const plugin = new DesignEditorConfig();
    expect(plugin.name).toBe('cesdk-design-editor');
    expect(plugin.version).toBe('test');
  });

  it('resets the editor before it configures anything', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    await new DesignEditorConfig().initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as EditorPluginContext);

    expect(cesdk.calls[0].path).toBe('resetEditor');
    expect(cesdk.calls[1]).toEqual({
      path: 'setEditorCompatibilityVersion',
      args: ['test']
    });
    expect(cesdk.callsTo('feature.enable')).toHaveLength(1);
    expect(cesdk.callsTo('shortcuts.set')).toHaveLength(1);
    expect(cesdk.callsTo('actions.register').length).toBeGreaterThan(0);
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
  });

  it('does nothing without an editor, so the engine-only host stays untouched', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new DesignEditorConfig().initialize({
      engine: engine.api
    } as EditorPluginContext);
    expect(engine.calls).toEqual([]);
  });
});

describe('PEX-U25 the action handlers the kit registers', () => {
  function handlers() {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupActions(spy.api);
    const byName = new Map(
      spy
        .callsTo('actions.register')
        .map(({ args }) => [
          args[0] as string,
          args[1] as (...params: never[]) => unknown
        ])
    );
    return { spy, byName };
  }

  it('saves the scene as plain text', async () => {
    const { spy, byName } = handlers();
    await byName.get('saveScene')?.();
    expect(spy.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it('passes the caller export options straight through', async () => {
    const { spy, byName } = handlers();
    await (byName.get('exportDesign') as (o: unknown) => Promise<void>)({
      mimeType: 'image/png'
    });
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      mimeType: 'image/png'
    });
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });

  it('imports a scene from a picked file and fits the first page', async () => {
    const { spy, byName } = handlers();
    const revoke = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined);
    await byName.get('importScene')?.();
    expect(spy.lastArgsOf('utils.loadFile')?.[0]).toEqual({
      accept: '.imgly,.scene,.zip',
      returnType: 'objectURL'
    });
    expect(spy.callsTo('engine.scene.load')).toHaveLength(1);
    expect(revoke).toHaveBeenCalledTimes(1);
    expect(spy.lastArgsOf('actions.run')).toEqual([
      'zoom.toPage',
      { page: 'first' }
    ]);
    revoke.mockRestore();
  });

  it('releases the object URL even when the scene fails to load', async () => {
    let importScene: (() => Promise<void>) | undefined;
    setupActions({
      actions: {
        register: (name: string, handler: () => Promise<void>) => {
          if (name === 'importScene') importScene = handler;
        },
        run: vi.fn()
      },
      utils: {
        loadFile: vi.fn().mockResolvedValue('blob:failing'),
        downloadFile: vi.fn(),
        localUpload: vi.fn()
      },
      engine: {
        scene: { load: vi.fn().mockRejectedValue(new Error('bad scene')) }
      }
    } as unknown as CreativeEditorSDK);

    const revoke = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined);
    await expect(importScene?.()).rejects.toThrow('bad scene');
    expect(revoke).toHaveBeenCalledWith('blob:failing');
    revoke.mockRestore();
  });

  it('exports the scene as text by default and as a zip archive on request', async () => {
    const { spy, byName } = handlers();
    const exportScene = byName.get('exportScene') as (o: {
      format?: string;
    }) => Promise<void>;

    await exportScene({});
    expect(spy.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );

    await exportScene({ format: 'archive' });
    expect(spy.callsTo('engine.scene.saveToArchive')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe('application/zip');
  });

  it('uploads through the editor local upload, dropping the progress callback', () => {
    const { spy, byName } = handlers();
    (
      byName.get('uploadFile') as (
        file: unknown,
        onProgress: unknown,
        context: unknown
      ) => unknown
    )('file', 'onProgress', 'context');
    expect(spy.lastArgsOf('utils.localUpload')).toEqual(['file', 'context']);
  });
});
