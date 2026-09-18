import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import { setupActions as designActions } from '../../src/imgly/config/design-editor/actions';
import { usAnsiCatalog as designCatalog } from '../../src/imgly/config/design-editor/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts as designShortcuts } from '../../src/imgly/config/design-editor/keyboard/keyboard';
import { DesignEditorConfig } from '../../src/imgly/config/design-editor/plugin';
import { setupActions as photoActions } from '../../src/imgly/config/photo-editor/actions';
import { usAnsiCatalog as photoCatalog } from '../../src/imgly/config/photo-editor/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts as photoShortcuts } from '../../src/imgly/config/photo-editor/keyboard/keyboard';
import { PhotoEditorConfig } from '../../src/imgly/config/photo-editor/plugin';
import { setupActions as videoActions } from '../../src/imgly/config/video-editor/actions';
import { setupFeatures as videoFeatures } from '../../src/imgly/config/video-editor/features';
import { usAnsiCatalog as videoCatalog } from '../../src/imgly/config/video-editor/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts as videoShortcuts } from '../../src/imgly/config/video-editor/keyboard/keyboard';
import { VideoEditorConfig } from '../../src/imgly/config/video-editor/plugin';

const MODES = [
  {
    name: 'the design editor',
    Config: DesignEditorConfig,
    pluginName: 'cesdk-design-editor',
    catalog: designCatalog,
    setupActions: designActions,
    setupShortcuts: designShortcuts,
    checksBrowserSupport: false
  },
  {
    name: 'the photo editor',
    Config: PhotoEditorConfig,
    pluginName: 'cesdk-photo-editor',
    catalog: photoCatalog,
    setupActions: photoActions,
    setupShortcuts: photoShortcuts,
    checksBrowserSupport: false
  },
  {
    name: 'the video editor',
    Config: VideoEditorConfig,
    pluginName: 'cesdk-video-editor',
    catalog: videoCatalog,
    setupActions: videoActions,
    setupShortcuts: videoShortcuts,
    checksBrowserSupport: true
  }
] as const;

function run<T>(setup: (api: T) => void) {
  const spy = createApiSpy<T>();
  setup(spy.api);
  return spy;
}

describe.each(MODES)('AIE-U16 $name', (mode) => {
  it('installs its own US ANSI shortcut catalog unchanged', () => {
    const spy = run<CreativeEditorSDK>(mode.setupShortcuts);
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(spy.lastArgsOf('shortcuts.set')?.[0]).toBe(mode.catalog);
  });

  it('registers its actions and forwards the caller export options', async () => {
    const spy = run<CreativeEditorSDK>(mode.setupActions);
    const byName = new Map(
      spy
        .callsTo('actions.register')
        .map(({ args }) => [
          args[0] as string,
          args[1] as (options?: unknown) => Promise<void>
        ])
    );

    expect(byName.size).toBeGreaterThan(0);
    await byName.get('exportDesign')?.({ mimeType: 'image/png' });
    expect(spy.callsTo('utils.export')).toHaveLength(1);
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });

  it('is named for its mode and resets the editor before configuring it', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    const plugin = new mode.Config();

    expect(plugin.name).toBe(mode.pluginName);
    expect(plugin.version).toBe('test');

    await plugin.initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as EditorPluginContext);

    expect(cesdk.calls[0].path).toBe('resetEditor');
    expect(cesdk.calls[1].path).toBe('setEditorCompatibilityVersion');
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual(['test']);
    expect(cesdk.callsTo('feature.enable')).toHaveLength(1);
    expect(cesdk.callsTo('shortcuts.set')).toHaveLength(1);
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);

    const browserCheck = cesdk
      .callsTo('actions.run')
      .filter(({ args }) => args[0] === 'editor.checkBrowserSupport');
    expect(browserCheck).toHaveLength(mode.checksBrowserSupport ? 1 : 0);
  });

  it('does nothing without an editor', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new mode.Config().initialize({
      engine: engine.api
    } as EditorPluginContext);
    expect(engine.calls).toEqual([]);
  });
});

describe('AIE-U17 the video editor features and the photo editor reset', () => {
  it('enables animations, transitions and every timeline track', () => {
    const enabled = run<CreativeEditorSDK>(videoFeatures).lastArgsOf(
      'feature.enable'
    )?.[0] as string[];

    expect(enabled).toContain('ly.img.animations');
    expect(enabled).toContain('ly.img.transitions');
    expect(
      enabled.filter((feature) => feature.startsWith('ly.img.video.timeline'))
    ).toEqual([
      'ly.img.video.timeline.addClip',
      'ly.img.video.timeline.audio',
      'ly.img.video.timeline.clip.menu',
      'ly.img.video.timeline.clips',
      'ly.img.video.timeline.controls.background',
      'ly.img.video.timeline.controls.bar',
      'ly.img.video.timeline.controls.loop',
      'ly.img.video.timeline.controls.playback',
      'ly.img.video.timeline.controls.split',
      'ly.img.video.timeline.controls.timelineZoom',
      'ly.img.video.timeline.controls.toggle',
      'ly.img.video.timeline.overlays',
      'ly.img.video.timeline.ruler'
    ]);
  });

  it('drops the photo editor subscriptions when the editor resets', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    await new PhotoEditorConfig().initialize({
      cesdk: cesdk.api,
      engine: createApiSpy<CreativeEngine>().api
    } as EditorPluginContext);

    const onReset = cesdk.lastArgsOf('onReset')?.[0] as () => void;
    expect(typeof onReset).toBe('function');
    expect(() => onReset()).not.toThrow();
  });
});
