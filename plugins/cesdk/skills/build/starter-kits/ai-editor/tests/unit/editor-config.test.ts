import { createApiSpy, type ApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

// The asset-source plugins belong to `@cesdk/cesdk-js`; the kit decides which
// of them it adds and with which include lists, so record just that.
vi.mock('@cesdk/cesdk-js/plugins', () => {
  // Returns an object, so it records the same way whether the kit calls it
  // with `new` or without.
  const recorded = (pluginName: string) =>
    function RecordedAssetSource(options?: unknown) {
      return { pluginName, options };
    };
  return Object.fromEntries(
    [
      'BlurAssetSource',
      'ColorPaletteAssetSource',
      'CropPresetsAssetSource',
      'DemoAssetSources',
      'EffectsAssetSource',
      'FiltersAssetSource',
      'ImageColorsAssetSource',
      'PagePresetsAssetSource',
      'StickerAssetSource',
      'TextAssetSource',
      'TextComponentAssetSource',
      'TypefaceAssetSource',
      'UploadAssetSources',
      'VectorShapeAssetSource'
    ].map((name) => [name, recorded(name)])
  );
});

vi.mock('@imgly/plugin-ai-apps-web', () => ({ default: vi.fn(() => ({})) }));

import {
  initAiDesignEditor,
  initAiPhotoEditor,
  initAiVideoEditor,
  type AiProviderMap
} from '../../src/imgly';

const PROVIDERS: AiProviderMap = { image2image: ['provider' as never] };

interface AddedPlugin {
  pluginName?: string;
  options?: unknown;
  constructor: { name: string };
}

async function init(
  initializer: (
    cesdk: CreativeEditorSDK,
    providers: AiProviderMap
  ) => Promise<void>
): Promise<{ spy: ApiSpy<CreativeEditorSDK>; plugins: AddedPlugin[] }> {
  const spy = createApiSpy<CreativeEditorSDK>();
  await initializer(spy.api, PROVIDERS);
  return {
    spy,
    plugins: spy.callsTo('addPlugin').map(({ args }) => args[0] as AddedPlugin)
  };
}

function names(plugins: AddedPlugin[]): string[] {
  return plugins.map((plugin) => plugin.pluginName ?? plugin.constructor.name);
}

function include(plugins: AddedPlugin[], pluginName: string): string[] {
  const plugin = plugins.find((entry) => entry.pluginName === pluginName);
  return (plugin?.options as { include: string[] }).include;
}

const SHARED_ASSET_SOURCES = [
  'ImageColorsAssetSource',
  'ColorPaletteAssetSource',
  'TypefaceAssetSource',
  'TextAssetSource',
  'TextComponentAssetSource',
  'VectorShapeAssetSource',
  'StickerAssetSource',
  'EffectsAssetSource',
  'FiltersAssetSource',
  'BlurAssetSource',
  'PagePresetsAssetSource',
  'CropPresetsAssetSource'
];

describe('AIE-U12 initAiDesignEditor', () => {
  it('adds the design configuration first and the AI apps plugin last', async () => {
    const { plugins } = await init(initAiDesignEditor);
    expect(names(plugins)[0]).toBe('DesignEditorConfig');
    expect(names(plugins).at(-1)).toBe('AiAppsConfig');
    expect(names(plugins)).toEqual(
      expect.arrayContaining(SHARED_ASSET_SOURCES)
    );
  });

  it('uses the light theme', async () => {
    const { spy } = await init(initAiDesignEditor);
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['light']);
  });

  it('offers image uploads and the image demo sources only', async () => {
    const { plugins } = await init(initAiDesignEditor);
    expect(include(plugins, 'UploadAssetSources')).toEqual([
      'ly.img.image.upload'
    ]);
    expect(include(plugins, 'DemoAssetSources')).toEqual(['ly.img.image.*']);
  });
});

describe('AIE-U12 initAiPhotoEditor', () => {
  it('adds the photo configuration first and the in-place AI edit last', async () => {
    const { plugins } = await init(initAiPhotoEditor);
    expect(names(plugins)[0]).toBe('PhotoEditorConfig');
    expect(names(plugins).at(-1)).toBe('AiPhotoEditConfig');
    expect(names(plugins)).not.toContain('AiAppsConfig');
  });

  it('uses the dark theme', async () => {
    const { spy } = await init(initAiPhotoEditor);
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['dark']);
  });

  it('offers image uploads and the image demo sources only', async () => {
    const { plugins } = await init(initAiPhotoEditor);
    expect(include(plugins, 'UploadAssetSources')).toEqual([
      'ly.img.image.upload'
    ]);
    expect(include(plugins, 'DemoAssetSources')).toEqual(['ly.img.image.*']);
  });
});

describe('AIE-U12 initAiVideoEditor', () => {
  it('adds the video configuration first and the AI apps plugin last', async () => {
    const { plugins } = await init(initAiVideoEditor);
    expect(names(plugins)[0]).toBe('VideoEditorConfig');
    expect(names(plugins).at(-1)).toBe('AiAppsConfig');
  });

  it('uses the light theme', async () => {
    const { spy } = await init(initAiVideoEditor);
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['light']);
  });

  it('offers image, video and audio uploads and demo sources', async () => {
    const { plugins } = await init(initAiVideoEditor);
    expect(include(plugins, 'UploadAssetSources')).toEqual([
      'ly.img.image.upload',
      'ly.img.video.upload',
      'ly.img.audio.upload'
    ]);
    expect(include(plugins, 'DemoAssetSources')).toEqual([
      'ly.img.templates.video.*',
      'ly.img.image.*',
      'ly.img.video.*',
      'ly.img.audio.*'
    ]);
  });
});

describe('AIE-U30 asset source registration is concurrent', () => {
  // A timer callback runs after every queued microtask, so the pending `await`
  // chain inside the kit has run by the time this resolves.
  function flushMicrotasks(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }

  it.each([
    ['Design', initAiDesignEditor],
    ['Photo', initAiPhotoEditor],
    ['Video', initAiVideoEditor]
  ])(
    '%s issues each batch of asset sources at once instead of one after another',
    async (_mode, initializer) => {
      const spy = createApiSpy<CreativeEditorSDK>();
      const pending: (() => void)[] = [];
      // `addPlugin` resolves only when the test says so, so a sequential
      // registration would stall after the first asset source.
      const api = new Proxy(spy.api as object, {
        get(target, key) {
          if (key === 'addPlugin') {
            return (plugin: unknown) => {
              (target as { addPlugin: (value: unknown) => void }).addPlugin(
                plugin
              );
              return new Promise<void>((resolve) => pending.push(resolve));
            };
          }
          return Reflect.get(target, key);
        }
      }) as CreativeEditorSDK;

      const counts: number[] = [];
      void initializer(api, PROVIDERS);
      await flushMicrotasks();
      counts.push(spy.callsTo('addPlugin').length);

      while (pending.length > 0) {
        pending.splice(0).forEach((resolve) => {
          resolve();
        });
        await flushMicrotasks();
        counts.push(spy.callsTo('addPlugin').length);
      }

      // The configuration plugin, then the twelve shared sources together,
      // then upload and demo together, then the AI plugin.
      expect(counts).toEqual([1, 13, 15, 16, 16]);
    }
  );
});
