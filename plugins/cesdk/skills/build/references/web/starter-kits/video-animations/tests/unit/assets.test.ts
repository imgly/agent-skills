import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { initVideoAnimationsEditor } from '../../src/imgly/index';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));
vi.mock('@cesdk/cesdk-js/plugins', () => {
  const names = [
    'BlurAssetSource',
    'CaptionPresetsAssetSource',
    'ImageColorsAssetSource',
    'ColorPaletteAssetSource',
    'CropPresetsAssetSource',
    'DemoAssetSources',
    'EffectsAssetSource',
    'FiltersAssetSource',
    'PagePresetsAssetSource',
    'StickerAssetSource',
    'TextComponentAssetSource',
    'TypefaceAssetSource',
    'TextAssetSource',
    'VectorShapeAssetSource',
    'UploadAssetSources'
  ];
  return Object.fromEntries(
    names.map((name) => [
      name,
      class {
        plugin = name;
        constructor(public config?: { include?: string[] }) {}
      }
    ])
  );
});

import { DEMO_ASSETS_BASE_URL as BASE_URL } from '../../src/imgly/demo-assets';

interface StubPlugin {
  plugin?: string;
  name?: string;
  config?: { include?: string[] };
}

let spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;
let plugins: StubPlugin[];

// A timer callback runs after every queued microtask, so the pending `await`
// chain inside the kit has run by the time this resolves.
function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function pluginConfig(name: string): { include?: string[] } | undefined {
  return plugins.find((entry) => entry.plugin === name)?.config;
}

beforeAll(async () => {
  spy = createApiSpy<CreativeEditorSDK>();
  await initVideoAnimationsEditor(spy.api);
  plugins = spy.callsTo('addPlugin').map(({ args }) => args[0] as StubPlugin);
});

describe('VAN-U1 scene assets get their base URL substituted', () => {
  it('adds both example scenes with resolved uris', () => {
    const added = spy
      .callsTo('engine.asset.addAssetToSource')
      .map(
        ({ args }) =>
          args as [string, { id: string; meta: Record<string, string> }]
      );

    expect(added).toHaveLength(2);
    expect(added.map(([sourceId]) => sourceId)).toEqual([
      'ly.img.video.scene',
      'ly.img.video.scene'
    ]);
    expect(added.map(([, asset]) => asset.id)).toEqual([
      'lunar-cosmetics',
      'surf-school'
    ]);
    added.forEach(([, asset]) => {
      expect(asset.meta.blockType).toBe('//ly.img.ubq/scene');
      expect(asset.meta.uri).toBe(
        `${BASE_URL}/assets/templates/${asset.id}.scene`
      );
      expect(asset.meta.thumbUri).toBe(
        `${BASE_URL}/assets/templates/${asset.id}.png`
      );
    });
  });

  it('leaves no placeholder behind', () => {
    const serialized = JSON.stringify(
      spy.callsTo('engine.asset.addAssetToSource').map(({ args }) => args)
    );
    expect(serialized).not.toContain('{{base_url}}');
  });
});

describe('VAN-U2 audio assets are handed to the engine loader with a base path', () => {
  it('registers seven tracks under ly.img.audio', () => {
    const calls = spy.callsTo('engine.asset.addLocalAssetSourceFromJSONString');
    expect(calls).toHaveLength(1);

    const [json, basePath] = calls[0].args as [string, string];
    const content = JSON.parse(json) as {
      id: string;
      assets: { meta: Record<string, string> }[];
    };

    expect(content.id).toBe('ly.img.audio');
    expect(content.assets).toHaveLength(7);
    expect(basePath).toBe(`${BASE_URL}/assets/audio`);
  });

  it('leaves the placeholders for the engine to substitute', () => {
    const [json] = spy.lastArgsOf(
      'engine.asset.addLocalAssetSourceFromJSONString'
    ) as [string];
    expect(json).toContain('{{base_url}}');
  });
});

describe('VAN-U3 the custom scene source is local and has an apply callback', () => {
  it('registers ly.img.video.scene with no application id', () => {
    const calls = spy.callsTo('engine.asset.addLocalSource');
    expect(calls).toHaveLength(1);

    const [sourceId, applicationId, applyAsset] = calls[0].args;
    expect(sourceId).toBe('ly.img.video.scene');
    expect(applicationId).toBeUndefined();
    expect(typeof applyAsset).toBe('function');
  });
});

describe('VAN-U4 plugin list and include globs', () => {
  it('adds the configuration plugin before the asset sources', () => {
    expect(plugins).toHaveLength(16);
    expect(plugins[0].name).toBe('cesdk-video-editor');
    expect(plugins.slice(1).map((entry) => entry.plugin)).toEqual([
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

  it('leaves audio out of the demo sources, because the kit ships its own', () => {
    expect(pluginConfig('DemoAssetSources')?.include).toEqual([
      'ly.img.templates.video.*',
      'ly.img.image.*',
      'ly.img.video.*'
    ]);
  });

  it('offers image, video and audio uploads', () => {
    expect(pluginConfig('UploadAssetSources')?.include).toEqual([
      'ly.img.image.upload',
      'ly.img.video.upload',
      'ly.img.audio.upload'
    ]);
  });

  it('offers the eight platform page presets', () => {
    expect(pluginConfig('PagePresetsAssetSource')?.include).toEqual([
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

  it('adds neither premium templates nor background removal', () => {
    const names = plugins.map((entry) => entry.plugin ?? entry.name);
    expect(names).not.toContain('PremiumTemplatesAssetSource');
    expect(
      names.filter((name) => /BackgroundRemoval/i.test(name ?? ''))
    ).toEqual([]);
  });
});

describe('VAN-U17 applying an example template', () => {
  const pushState = vi.fn();

  function apply(asset: unknown): Promise<unknown> {
    const applyAsset = spy.callsTo('engine.asset.addLocalSource')[0]
      .args[2] as (asset: unknown) => Promise<unknown>;
    return applyAsset(asset);
  }

  beforeAll(() => {
    vi.stubGlobal('window', {
      location: { href: 'http://localhost:5173/?foo=bar' },
      history: { pushState }
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('stops the running page, loads the scene and fits the camera to it', async () => {
    pushState.mockClear();
    await apply({ id: 'surf-school', meta: { uri: `${BASE_URL}/surf.scene` } });

    expect(spy.lastArgsOf('engine.block.setPlaying')).toEqual([
      expect.anything(),
      false
    ]);
    expect(spy.lastArgsOf('engine.scene.load')).toEqual([
      `${BASE_URL}/surf.scene`
    ]);
    expect(spy.lastArgsOf('actions.run')).toEqual([
      'zoom.toPage',
      { autoFit: true }
    ]);
  });

  it('records the applied template in the URL and keeps the other parameters', () => {
    expect(pushState).toHaveBeenCalledTimes(1);
    expect(String(pushState.mock.calls[0][2])).toBe(
      'http://localhost:5173/?foo=bar&template=surf-school'
    );
  });

  it('rejects an asset without a uri instead of loading an empty scene', async () => {
    await expect(apply({ id: 'broken', meta: {} })).rejects.toThrow(
      'Asset does not have a uri'
    );
    await expect(apply({ id: 'broken' })).rejects.toThrow(
      'Asset does not have a uri'
    );
  });
});

describe('VAN-U19 asset source registration is concurrent', () => {
  it('issues every asset-source plugin at once instead of one after another', async () => {
    const concurrent = createApiSpy<CreativeEditorSDK>();
    const pending: (() => void)[] = [];
    // `addPlugin` resolves only when the test says so, so a sequential
    // registration would stall after the first asset source.
    const api = new Proxy(concurrent.api as object, {
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

    void initVideoAnimationsEditor(api);
    await flushMicrotasks();
    expect(concurrent.callsTo('addPlugin')).toHaveLength(1);

    pending[0]();
    await flushMicrotasks();
    expect(concurrent.callsTo('addPlugin')).toHaveLength(16);
  });
});
