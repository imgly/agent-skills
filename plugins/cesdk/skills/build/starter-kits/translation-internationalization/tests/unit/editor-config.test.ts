import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { usAnsiCatalog } from '../../src/imgly/config/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { DesignEditorConfig } from '../../src/imgly/config/plugin';
import { setupUI } from '../../src/imgly/config/ui';
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

describe('TI-U8 setupUI', () => {
  const spy = run(setupUI);

  it('positions the panels before it orders any component', () => {
    const paths = spy.calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeGreaterThanOrEqual(0);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('orders the design-editor bars and leaves the video timeline alone', () => {
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

describe('TI-U9 setupInspectorBar', () => {
  const spy = run(setupInspectorBar);

  it('offers the text controls a translated editor is judged by', () => {
    const entries = barFor(spy, 'ly.img.inspector.bar', 'Transform');
    expect(entries).toContain('ly.img.text.typeFace.inspectorBar');
    expect(entries).toContain('ly.img.text.fontSize.inspectorBar');
    expect(entries).toContain('ly.img.inspectorToggle.inspectorBar');
  });

  it('replaces the bar with the mode controls while cropping', () => {
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

describe('TI-U10 the setups this kit deliberately leaves empty', () => {
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

describe('TI-U11 DesignEditorConfig', () => {
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

describe('TI-U12 the action handlers the kit registers', () => {
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
