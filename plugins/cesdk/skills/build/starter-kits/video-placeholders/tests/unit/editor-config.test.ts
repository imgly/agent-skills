import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setupActions as setupAdvancedActions } from '../../src/imgly/config/advanced-video-editor/actions';
import { setupTranslations as setupAdvancedTranslations } from '../../src/imgly/config/advanced-video-editor/i18n';
import { setupKeyboardShortcuts as setupAdvancedShortcuts } from '../../src/imgly/config/advanced-video-editor/keyboard/keyboard';
import { AdvancedVideoEditorConfig } from '../../src/imgly/config/advanced-video-editor/plugin';
import { setupUI as setupAdvancedUI } from '../../src/imgly/config/advanced-video-editor/ui';
import { setupComponents as setupAdvancedComponents } from '../../src/imgly/config/advanced-video-editor/ui/components';
import { setupActions as setupVideoActions } from '../../src/imgly/config/video-editor/actions';
import { setupTranslations as setupVideoTranslations } from '../../src/imgly/config/video-editor/i18n';
import { setupKeyboardShortcuts as setupVideoShortcuts } from '../../src/imgly/config/video-editor/keyboard/keyboard';
import { VideoEditorConfig } from '../../src/imgly/config/video-editor/plugin';
import { setupSettings as setupVideoSettings } from '../../src/imgly/config/video-editor/settings';
import { setupUI as setupVideoUI } from '../../src/imgly/config/video-editor/ui';
import { setupComponents as setupVideoComponents } from '../../src/imgly/config/video-editor/ui/components';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

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

describe.each([
  ['the video editor', setupVideoUI, 'left'],
  ['the advanced video editor', setupAdvancedUI, 'right']
])('VPL-U10 setupUI for %s', (_name, setupUI, inspectorSide) => {
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
  });

  it('places the panels before any bar, so the bars lay out against them', () => {
    const paths = spy.calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('offers split and loop in the video timeline controls', () => {
    const timeline = orderFor(orders, 'ly.img.video.timeline.controls.bar');
    expect(timeline).toContain('ly.img.video.timeline.split');
    expect(timeline).toContain('ly.img.video.timeline.loop');
  });

  it('offers trim in the transform inspector bar', () => {
    const transform = orders.find(
      ([target]) =>
        target.in === 'ly.img.inspector.bar' &&
        (target as { when?: { editMode?: string } }).when?.editMode ===
          'Transform'
    );
    expect(transform?.[1]).toContain('ly.img.trim.inspectorBar');
  });

  it('puts the canvas bar at the bottom', () => {
    expect(
      orders.find(([target]) => target.in === 'ly.img.canvas.bar')?.[0]
    ).toMatchObject({ at: 'bottom' });
  });

  it('lists the video asset libraries in the dock', () => {
    const keys = (orderFor(orders, 'ly.img.dock') as { key?: string }[]).map(
      (entry) => entry.key
    );
    expect(keys).toContain('ly.img.video');
    expect(keys).toContain('ly.img.audio');
    expect(keys).toContain('ly.img.upload');
  });
});

describe('VPL-U11 the two configurations share their plain parts', () => {
  it('registers no custom component in either configuration', () => {
    for (const setupComponents of [
      setupVideoComponents,
      setupAdvancedComponents
    ]) {
      const spy = createApiSpy<CreativeEditorSDK>();
      setupComponents(spy.api);
      expect(spy.calls).toEqual([]);
    }
  });

  it('adds no translation in either configuration, so every label is a CE.SDK default', () => {
    for (const setupTranslations of [
      setupVideoTranslations,
      setupAdvancedTranslations
    ]) {
      const spy = createApiSpy<CreativeEditorSDK>();
      setupTranslations(spy.api);
      expect(spy.calls).toEqual([]);
    }
  });

  it('installs one shortcut catalog in either configuration', () => {
    for (const setupShortcuts of [
      setupVideoShortcuts,
      setupAdvancedShortcuts
    ]) {
      const spy = createApiSpy<CreativeEditorSDK>();
      setupShortcuts(spy.api);
      expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    }
  });

  it('turns captions on and shows every timeline track', () => {
    const engine = createApiSpy<CreativeEngine>();
    setupVideoSettings(engine.api);
    const settings = new Map(
      engine
        .callsTo('editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('timeline/trackVisibility')).toBe('all');
  });
});

describe.each([
  ['VideoEditorConfig', VideoEditorConfig, undefined],
  ['AdvancedVideoEditorConfig', AdvancedVideoEditorConfig, 'advanced']
])('VPL-U12 %s.initialize', (_name, Config, view) => {
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
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual(['test']);
    expect(paths).toContain('feature.enable');
    expect(paths).toContain('ui.setComponentOrder');
    expect(paths).toContain('actions.register');
    expect(paths).toContain('shortcuts.set');
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
  });

  it('blocks on missing video decoding and only warns on missing encoding', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    await new Config().initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as never);
    expect(cesdk.lastArgsOf('actions.run')).toEqual([
      'editor.checkBrowserSupport',
      { videoDecode: 'block', videoEncode: 'warn' }
    ]);
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

describe('VPL-U13 the video editor actions', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupVideoActions(spy.api);
  const registered = spy.callsTo('actions.register');

  it('overrides only the video export action', () => {
    expect(registered.map(({ args }) => args[0])).toEqual(['exportDesign']);
  });

  it('exports with a bounded default bitrate the caller can override', async () => {
    const handler = registered[0].args[1] as (
      options: unknown
    ) => Promise<void>;
    await handler({ mimeType: 'video/mp4' });
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      videoBitrate: 'Auto',
      mimeType: 'video/mp4'
    });
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });
});

describe('VPL-U14 the advanced video editor actions', () => {
  let spy: Spy;
  let handlers: Map<string, (...args: never[]) => unknown>;

  beforeEach(() => {
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    spy = createApiSpy<CreativeEditorSDK>();
    setupAdvancedActions(spy.api);
    handlers = new Map(
      spy
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

  it('registers save, import, export and upload', () => {
    expect([...handlers.keys()].sort()).toEqual([
      'exportDesign',
      'exportScene',
      'exportVideo',
      'importScene',
      'saveScene',
      'uploadFile'
    ]);
  });

  it('saves the scene as plain text', async () => {
    await handlers.get('saveScene')!();
    expect(spy.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it.each([
    [undefined, '.imgly,.scene,.zip'],
    ['scene', '.imgly,.scene'],
    ['archive', '.imgly,.zip']
  ])('narrows the import picker for format %s', async (format, accept) => {
    await handlers.get('importScene')!({ format } as never);
    expect(spy.lastArgsOf('utils.loadFile')?.[0]).toEqual({
      accept,
      returnType: 'objectURL'
    });
  });

  it('releases the object URL and zooms to the first page after an import', async () => {
    await handlers.get('importScene')!();
    expect(spy.callsTo('engine.scene.load')).toHaveLength(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(spy.lastArgsOf('actions.run')).toEqual([
      'zoom.toPage',
      { page: 'first' }
    ]);
  });

  it('exports an archive as a zip and a scene as text', async () => {
    await handlers.get('exportScene')!({ format: 'archive' } as never);
    expect(spy.callsTo('engine.scene.saveToArchive')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe('application/zip');

    await handlers.get('exportScene')!({} as never);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it('pins the video export to MP4 with a bounded bitrate', async () => {
    await handlers.get('exportVideo')!();
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      mimeType: 'video/mp4',
      videoBitrate: 'Auto'
    });
  });

  it('lets the caller override the bounded bitrate on exportDesign', async () => {
    await handlers.get('exportDesign')!({ videoBitrate: 8_000_000 } as never);
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      videoBitrate: 8_000_000
    });
  });

  it('uploads through the SDK local upload helper', () => {
    handlers.get('uploadFile')!(
      'file' as never,
      undefined as never,
      'context' as never
    );
    expect(spy.lastArgsOf('utils.localUpload')).toEqual(['file', 'context']);
  });
});
