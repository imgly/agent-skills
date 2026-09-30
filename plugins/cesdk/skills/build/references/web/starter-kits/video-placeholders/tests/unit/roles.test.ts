import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  initVideoPlaceholdersAdopterEditor,
  initVideoPlaceholdersCreatorEditor
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

interface StubPlugin {
  plugin?: string;
  name?: string;
  config?: { include?: string[] };
}

type Spy = ReturnType<typeof createApiSpy<CreativeEditorSDK>>;

let creator: Spy;
let adopter: Spy;

function plugins(spy: Spy): StubPlugin[] {
  return spy.callsTo('addPlugin').map(({ args }) => args[0] as StubPlugin);
}

function assetSources(spy: Spy): StubPlugin[] {
  return plugins(spy).filter((entry) => entry.plugin != null);
}

beforeAll(async () => {
  creator = createApiSpy<CreativeEditorSDK>();
  await initVideoPlaceholdersCreatorEditor(creator.api);

  adopter = createApiSpy<CreativeEditorSDK>();
  await initVideoPlaceholdersAdopterEditor(adopter.api);
});

describe('VPL-U1 Creator wiring', () => {
  it('adds the advanced configuration first', () => {
    expect(plugins(creator)[0].name).toBe('cesdk-advanced-video-editor');
  });

  it('uses the dark theme', () => {
    expect(creator.lastArgsOf('ui.setTheme')).toEqual(['dark']);
  });

  it('sets the Creator role after every plugin has registered', () => {
    expect(creator.lastArgsOf('engine.editor.setRole')).toEqual(['Creator']);
    expect(creator.calls.at(-1)?.path).toBe('engine.editor.setRole');
  });
});

describe('VPL-U2 Adopter wiring', () => {
  it('adds the plain video configuration first', () => {
    expect(plugins(adopter)[0].name).toBe('cesdk-video-editor');
  });

  it('uses the light theme', () => {
    expect(adopter.lastArgsOf('ui.setTheme')).toEqual(['light']);
  });

  it('sets the Adopter role after every plugin has registered', () => {
    expect(adopter.lastArgsOf('engine.editor.setRole')).toEqual(['Adopter']);
    expect(adopter.calls.at(-1)?.path).toBe('engine.editor.setRole');
  });
});

describe('VPL-U3 the two roles differ in exactly three things', () => {
  it('adds the same asset sources with the same options in the same order', () => {
    const shape = (spy: Spy) =>
      assetSources(spy).map((entry) => [entry.plugin, entry.config]);
    expect(shape(creator)).toEqual(shape(adopter));
    expect(assetSources(creator)).toHaveLength(15);
  });

  it('makes the same calls apart from the configuration, the theme and the role', () => {
    const shape = (spy: Spy) =>
      spy.calls
        .filter(
          (call) =>
            !['ui.setTheme', 'engine.editor.setRole'].includes(call.path)
        )
        .map((call) => call.path);
    expect(shape(creator)).toEqual(shape(adopter));
  });
});

describe('VPL-U4 include globs', () => {
  it.each([
    ['creator', () => creator],
    ['adopter', () => adopter]
  ])('%s offers image, video and audio uploads', (_role, spy) => {
    const uploads = assetSources(spy()).find(
      (entry) => entry.plugin === 'UploadAssetSources'
    );
    expect(uploads?.config?.include).toEqual([
      'ly.img.image.upload',
      'ly.img.video.upload',
      'ly.img.audio.upload'
    ]);
  });

  it('includes the video demo sources', () => {
    const demo = assetSources(creator).find(
      (entry) => entry.plugin === 'DemoAssetSources'
    );
    expect(demo?.config?.include).toEqual([
      'ly.img.templates.video.*',
      'ly.img.image.*',
      'ly.img.audio.*',
      'ly.img.video.*'
    ]);
  });

  it('offers the eight platform page presets', () => {
    const presets = assetSources(creator).find(
      (entry) => entry.plugin === 'PagePresetsAssetSource'
    );
    expect(presets?.config?.include).toEqual([
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

  it('adds neither premium templates nor background removal in either role', () => {
    [creator, adopter].forEach((spy) => {
      const names = plugins(spy).map((entry) => entry.plugin ?? entry.name);
      expect(names).not.toContain('PremiumTemplatesAssetSource');
      expect(
        names.filter((name) => /BackgroundRemoval/i.test(name ?? ''))
      ).toEqual([]);
    });
  });
});

describe('VPL-U16 asset source registration is concurrent', () => {
  // A timer callback runs after every queued microtask, so the pending `await`
  // chain inside the kit has run by the time this resolves.
  function flushMicrotasks(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }

  it.each([
    ['Creator', initVideoPlaceholdersCreatorEditor],
    ['Adopter', initVideoPlaceholdersAdopterEditor]
  ])(
    '%s issues every asset-source plugin at once instead of one after another',
    async (_role, init) => {
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

      void init(api);
      await flushMicrotasks();
      expect(spy.callsTo('addPlugin')).toHaveLength(1);

      pending[0]();
      await flushMicrotasks();
      expect(spy.callsTo('addPlugin')).toHaveLength(16);
    }
  );
});
