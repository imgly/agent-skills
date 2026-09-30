import { describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: '0.0.0-test' } }));

vi.mock('@cesdk/cesdk-js/plugins', async () => {
  const { assetSourceStubs } = await import('./plugin-stubs');
  return assetSourceStubs();
});

import { initStartWithVideoEditor } from '../../src/imgly';
import type { AssetSourceStub } from './plugin-stubs';

// A timer callback runs after every queued microtask, so the pending `await`
// chain inside the kit has run by the time this resolves.
function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

async function run(videoUrl = 'https://example.test/clip.mp4') {
  const plugins: AssetSourceStub[] = [];
  const calls: { name: string; args: unknown[] }[] = [];
  const cesdk = {
    addPlugin: async (plugin: AssetSourceStub) => {
      plugins.push(plugin);
    },
    engine: {
      scene: {
        createFromVideo: async (url: string) => {
          calls.push({ name: 'createFromVideo', args: [url] });
        }
      }
    },
    actions: {
      run: (name: string, options: unknown) => {
        calls.push({ name: `actions.run ${name}`, args: [options] });
      }
    }
  };

  await initStartWithVideoEditor(cesdk as never, videoUrl);
  return { plugins, calls };
}

describe('initStartWithVideoEditor', () => {
  it('SWV-U2 adds the video editor configuration before the asset sources', async () => {
    const { plugins } = await run();

    expect(plugins[0].constructor.name).toBe('VideoEditorConfig');
    expect(plugins.slice(1).map((plugin) => plugin.pluginName)).toEqual([
      'BlurAssetSource',
      'CaptionPresetsAssetSource',
      'ImageColorsAssetSource',
      'ColorPaletteAssetSource',
      'CropPresetsAssetSource',
      'UploadAssetSources',
      'DemoAssetSources',
      'EffectsAssetSource',
      'FiltersAssetSource',
      'PagePresetsAssetSource',
      'StickerAssetSource',
      'TextAssetSource',
      'TextComponentAssetSource',
      'TypefaceAssetSource',
      'VectorShapeAssetSource'
    ]);
  });

  it('SWV-U3 includes the image, video and audio upload sources', async () => {
    const { plugins } = await run();
    const options = (name: string) =>
      plugins.find((plugin) => plugin.pluginName === name)?.options;

    expect(options('UploadAssetSources')).toEqual({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    });
  });

  it('SWV-U3 includes the video templates and the media demo sources', async () => {
    const { plugins } = await run();
    const demo = plugins.find(
      (plugin) => plugin.pluginName === 'DemoAssetSources'
    );

    expect(demo?.options).toEqual({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    });
  });

  it('SWV-U3 limits the page presets to the eight social and video groups', async () => {
    const { plugins } = await run();
    const presets = plugins.find(
      (plugin) => plugin.pluginName === 'PagePresetsAssetSource'
    );

    expect(presets?.options?.include).toEqual([
      'ly.img.page.presets.instagram.*',
      'ly.img.page.presets.facebook.*',
      'ly.img.page.presets.x.*',
      'ly.img.page.presets.linkedin.*',
      'ly.img.page.presets.pinterest.*',
      'ly.img.page.presets.tiktok.*',
      'ly.img.page.presets.youtube.*',
      'ly.img.page.presets.video.*'
    ]);
  });

  it('SWV-U15 registers the asset sources concurrently', async () => {
    const plugins: AssetSourceStub[] = [];
    const pending: (() => void)[] = [];
    const cesdk = {
      // Resolves only when the test says so, so a sequential registration
      // would stall after the first asset source.
      addPlugin: (plugin: AssetSourceStub) => {
        plugins.push(plugin);
        return new Promise<void>((resolve) => pending.push(resolve));
      },
      engine: { scene: { createFromVideo: async () => undefined } },
      actions: { run: () => undefined }
    };

    void initStartWithVideoEditor(cesdk as never, 'https://example.test/a.mp4');
    await flushMicrotasks();
    expect(plugins).toHaveLength(1);

    pending[0]();
    await flushMicrotasks();
    expect(plugins).toHaveLength(16);
  });

  it('SWV-U2 creates the scene from the video and fits the page', async () => {
    const { calls } = await run('https://example.test/clip.mp4');

    expect(calls).toEqual([
      { name: 'createFromVideo', args: ['https://example.test/clip.mp4'] },
      { name: 'actions.run zoom.toPage', args: [{ autoFit: true }] }
    ]);
  });
});
