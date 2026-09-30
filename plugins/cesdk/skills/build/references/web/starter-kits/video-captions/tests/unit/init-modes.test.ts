import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  initVideoCaptionsAutocaptionEditor,
  initVideoCaptionsBlankEditor,
  initVideoCaptionsImportEditor,
  initVideoCaptionsPreCaptionedEditor
} from '../../src/imgly/index';

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
vi.mock('@imgly/plugin-autocaption-web', () => ({
  default: (config: unknown) => ({ plugin: 'autocaption', config })
}));
vi.mock('@imgly/plugin-autocaption-web/fal-ai', () => ({
  ElevenLabsScribeV2: (config: unknown) => ({ provider: 'scribe-v2', config })
}));

interface StubPlugin {
  plugin?: string;
  name?: string;
  config?: { include?: string[] };
}

type Spy = ReturnType<typeof createApiSpy<CreativeEditorSDK>>;

const MODES = ['autocaption', 'blank', 'import', 'pre-captioned'] as const;

const INIT = {
  autocaption: initVideoCaptionsAutocaptionEditor,
  blank: initVideoCaptionsBlankEditor,
  import: initVideoCaptionsImportEditor,
  'pre-captioned': initVideoCaptionsPreCaptionedEditor
};

const spies = {} as Record<(typeof MODES)[number], Spy>;

function plugins(mode: (typeof MODES)[number]): StubPlugin[] {
  return spies[mode]
    .callsTo('addPlugin')
    .map(({ args }) => args[0] as StubPlugin);
}

function assetSources(mode: (typeof MODES)[number]) {
  return plugins(mode)
    .filter((entry) => entry.plugin != null && entry.plugin !== 'autocaption')
    .map((entry) => [entry.plugin, entry.config]);
}

beforeAll(async () => {
  for (const mode of MODES) {
    const spy = createApiSpy<CreativeEditorSDK>();
    await INIT[mode](spy.api);
    spies[mode] = spy;
  }
});

describe('VCA-U1 each mode adds the same fifteen asset sources after the config plugin', () => {
  it.each(MODES)('%s starts with the video editor configuration', (mode) => {
    expect(plugins(mode)[0].name).toBe('cesdk-video-editor');
  });

  it('registers the same asset sources with the same options in the same order', () => {
    const reference = assetSources('autocaption');
    expect(reference).toHaveLength(15);
    MODES.slice(1).forEach((mode) => {
      expect(assetSources(mode)).toEqual(reference);
    });
  });
});

describe('VCA-U2 only the autocaption mode adds the autocaption plugin', () => {
  it('adds it last in the autocaption mode', () => {
    expect(plugins('autocaption').at(-1)?.plugin).toBe('autocaption');
  });

  it.each(['blank', 'import', 'pre-captioned'] as const)(
    'does not add it in the %s mode',
    (mode) => {
      expect(plugins(mode).map((entry) => entry.plugin)).not.toContain(
        'autocaption'
      );
    }
  );
});

describe('VCA-U3 include globs', () => {
  const configOf = (name: string) =>
    plugins('autocaption').find((entry) => entry.plugin === name)?.config;

  it('offers image, video and audio uploads', () => {
    expect(configOf('UploadAssetSources')?.include).toEqual([
      'ly.img.image.upload',
      'ly.img.video.upload',
      'ly.img.audio.upload'
    ]);
  });

  it('includes the video demo sources', () => {
    expect(configOf('DemoAssetSources')?.include).toEqual([
      'ly.img.templates.video.*',
      'ly.img.image.*',
      'ly.img.audio.*',
      'ly.img.video.*'
    ]);
  });

  it('offers the eight platform page presets', () => {
    expect(configOf('PagePresetsAssetSource')?.include).toEqual([
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
    const names = plugins('autocaption').map(
      (entry) => entry.plugin ?? entry.name
    );
    expect(names).not.toContain('PremiumTemplatesAssetSource');
    expect(
      names.filter((name) => /BackgroundRemoval/i.test(name ?? ''))
    ).toEqual([]);
  });
});

describe('VCA-U16 asset source registration is concurrent', () => {
  // A timer callback runs after every queued microtask, so the pending `await`
  // chain inside the kit has run by the time this resolves.
  function flushMicrotasks(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }

  it.each(MODES)(
    '%s issues every asset-source plugin at once instead of one after another',
    async (mode) => {
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

      void INIT[mode](api);
      await flushMicrotasks();
      expect(spy.callsTo('addPlugin')).toHaveLength(1);

      pending[0]();
      await flushMicrotasks();
      expect(spy.callsTo('addPlugin')).toHaveLength(16);
    }
  );
});
