import { vi } from 'vitest';

// The configuration plugin imports `@cesdk/cesdk-js` for its version, and that
// package reads `window` at module scope.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { VideoEditorConfig } from '../../src/imgly/config/plugin';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

describe('VEO-U12 setupActions', () => {
  it('registers exportDesign only', () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    setupActions(spy.api);

    expect(spy.callsTo('actions.register').map(({ args }) => args[0])).toEqual([
      'exportDesign'
    ]);
  });

  it('exports with a bounded bitrate by default and downloads the result', async () => {
    const downloadFile = vi.fn(async () => undefined);
    const exportVideo = vi.fn(async () => ({
      blobs: [new Blob(['video'])],
      options: { mimeType: 'video/mp4' }
    }));
    let handler: ((options: unknown) => Promise<void>) | undefined;
    const cesdk = {
      actions: {
        register: (_id: string, fn: (options: unknown) => Promise<void>) => {
          handler = fn;
        }
      },
      utils: { export: exportVideo, downloadFile }
    };

    setupActions(cesdk as unknown as CreativeEditorSDK);
    await handler!({ mimeType: 'video/mp4', frameRate: 30 });

    expect(exportVideo).toHaveBeenCalledWith({
      videoBitrate: 'Auto',
      mimeType: 'video/mp4',
      frameRate: 30
    });
    expect(downloadFile).toHaveBeenCalledWith(expect.any(Blob), 'video/mp4');
  });

  it('lets the caller override the bitrate', async () => {
    const exportVideo = vi.fn(async () => ({
      blobs: [new Blob(['video'])],
      options: { mimeType: 'video/mp4' }
    }));
    let handler: ((options: unknown) => Promise<void>) | undefined;
    const cesdk = {
      actions: {
        register: (_id: string, fn: (options: unknown) => Promise<void>) => {
          handler = fn;
        }
      },
      utils: { export: exportVideo, downloadFile: vi.fn(async () => undefined) }
    };

    setupActions(cesdk as unknown as CreativeEditorSDK);
    await handler!({ videoBitrate: 4_000_000 });

    expect(exportVideo).toHaveBeenCalledWith({ videoBitrate: 4_000_000 });
  });
});

describe('VEO-U13 VideoEditorConfig', () => {
  const cesdk = createApiSpy<CreativeEditorSDK>();
  const engine = createApiSpy<CreativeEngine>();
  const plugin = new VideoEditorConfig();

  it('is named and versioned', () => {
    expect(plugin.name).toEqual(expect.any(String));
    expect(plugin.version).toEqual(expect.any(String));
  });

  it('applies features, UI, actions, shortcuts and settings', async () => {
    await plugin.initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as unknown as EditorPluginContext);

    const paths = cesdk.calls.map(({ path }) => path);
    expect(paths[0]).toBe('resetEditor');
    expect(paths[1]).toBe('setEditorCompatibilityVersion');
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual([
      plugin.version
    ]);
    expect(cesdk.callsTo('actions.register').length).toBeGreaterThan(0);
    expect(cesdk.callsTo('shortcuts.set')).toHaveLength(1);
    expect(cesdk.callsTo('ui.setComponentOrder').length).toBeGreaterThan(0);
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
  });

  it('configures nothing when the plugin runs without an editor', async () => {
    const headless = createApiSpy<CreativeEngine>();

    await plugin.initialize({
      cesdk: undefined,
      engine: headless.api
    } as unknown as EditorPluginContext);

    expect(headless.calls).toEqual([]);
  });
});

describe('VEO-U14 setupVideoTimeline', () => {
  it('orders the timeline controls bar', () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    setupVideoTimeline(spy.api);

    expect(spy.calls.length).toBeGreaterThan(0);
  });
});

describe('VEO-U17 setupFeatures', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(spy.api);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it.each([
    'ly.img.video.timeline.clips',
    'ly.img.video.timeline.controls.playback',
    'ly.img.animations',
    'ly.img.transitions'
  ])('enables %s', (feature) => {
    expect(enabled).toContain(feature);
  });

  it('leaves the timeline ruler off, since only the active track is shown', () => {
    expect(enabled).not.toContain('ly.img.video.timeline.ruler');
  });

  it('names every feature on its own, enabling no umbrella group', () => {
    const umbrellas = enabled.filter((feature) =>
      enabled.some((other) => other.startsWith(`${feature}.`))
    );
    expect(umbrellas).toEqual([]);
  });
});
