import { describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: '0.0.0-test' } }));

vi.mock('@cesdk/cesdk-js/plugins', async () => {
  const { assetSourceStubs } = await import('./plugin-stubs');
  return assetSourceStubs();
});

import { initStartWithImageEditor } from '../../src/imgly';
import type { AssetSourceStub } from './plugin-stubs';

/**
 * `createApiSpy` cannot serve here: the init module reads the page the
 * scene reports and selects it.
 */
function createEditorStub(page: number | null = 7) {
  const plugins: AssetSourceStub[] = [];
  const calls: { name: string; args: unknown[] }[] = [];
  const record =
    (name: string) =>
    (...args: unknown[]) => {
      calls.push({ name, args });
    };
  return {
    plugins,
    calls,
    cesdk: {
      addPlugin: async (plugin: AssetSourceStub) => {
        plugins.push(plugin);
      },
      createFromImage: async (url: string) => {
        calls.push({ name: 'createFromImage', args: [url] });
      },
      engine: {
        scene: { getCurrentPage: () => page },
        block: { setSelected: record('setSelected') }
      }
    }
  };
}

async function run(imageUrl?: string, page: number | null = 7) {
  const stub = createEditorStub(page);
  await initStartWithImageEditor(stub.cesdk as never, imageUrl);
  return stub;
}

describe('initStartWithImageEditor', () => {
  it('SWI-U10 adds the photo editor configuration before the asset sources', async () => {
    const { plugins } = await run();

    expect(plugins[0].constructor.name).toBe('PhotoEditorConfig');
    expect(plugins.slice(1).map((plugin) => plugin.pluginName)).toEqual([
      'BlurAssetSource',
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
      'VectorShapeAssetSource',
      'PremiumTemplatesAssetSource'
    ]);
  });

  it('SWI-U10 starts every asset source before the first one finishes', async () => {
    const started: string[] = [];
    let release!: () => void;
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    const cesdk = {
      addPlugin: async (plugin: AssetSourceStub) => {
        started.push(plugin.pluginName ?? plugin.constructor.name);
        if (started.length > 1) await blocked;
      },
      createFromImage: async () => {},
      engine: {
        scene: { getCurrentPage: () => null },
        block: { setSelected: () => {} }
      }
    };

    const init = initStartWithImageEditor(cesdk as never);
    await vi.waitFor(() => expect(started).toHaveLength(16));
    release();
    await init;
  });

  it('SWI-U10 limits the upload and demo sources to images', async () => {
    const { plugins } = await run();
    const options = (name: string) =>
      plugins.find((plugin) => plugin.pluginName === name)?.options;

    expect(options('UploadAssetSources')).toEqual({
      include: ['ly.img.image.upload']
    });
    expect(options('DemoAssetSources')).toEqual({
      include: ['ly.img.image.*']
    });
  });

  it('SWI-U10 creates the scene from the picture it was given', async () => {
    const { calls } = await run('https://example.test/photo.jpg');

    expect(calls[0]).toEqual({
      name: 'createFromImage',
      args: ['https://example.test/photo.jpg']
    });
  });

  it('SWI-U10 falls back to the bundled mountain picture', async () => {
    const { calls } = await run();
    const [url] = calls[0].args as [string];

    expect(url.endsWith('/assets/images/mountain-1200.jpg')).toBe(true);
  });

  it('SWI-U10 selects the page so the inspector opens on the image', async () => {
    expect((await run()).calls).toEqual([
      { name: 'createFromImage', args: [expect.any(String)] },
      { name: 'setSelected', args: [7, true] }
    ]);
    expect((await run(undefined, null)).calls.map((call) => call.name)).toEqual(
      ['createFromImage']
    );
  });
});
