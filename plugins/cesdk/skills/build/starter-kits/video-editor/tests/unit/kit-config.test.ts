import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface AddedPlugin {
  kind: string;
  options?: Record<string, unknown>;
}

/**
 * Every plugin the kit adds is replaced by a class that records its own name
 * and the options it was constructed with, so the kit's choices can be
 * asserted without an editor.
 */
function stubPlugin(kind: string) {
  return class {
    kind = kind;
    options?: Record<string, unknown>;

    constructor(options?: Record<string, unknown>) {
      this.options = options;
    }
  };
}

vi.mock('@cesdk/core-configs-web/video-editor', () => ({
  VideoEditorConfig: stubPlugin('VideoEditorConfig')
}));

vi.mock('@cesdk/cesdk-js/plugins', () => ({
  BlurAssetSource: stubPlugin('BlurAssetSource'),
  CaptionPresetsAssetSource: stubPlugin('CaptionPresetsAssetSource'),
  ImageColorsAssetSource: stubPlugin('ImageColorsAssetSource'),
  ColorPaletteAssetSource: stubPlugin('ColorPaletteAssetSource'),
  CropPresetsAssetSource: stubPlugin('CropPresetsAssetSource'),
  DemoAssetSources: stubPlugin('DemoAssetSources'),
  EffectsAssetSource: stubPlugin('EffectsAssetSource'),
  FiltersAssetSource: stubPlugin('FiltersAssetSource'),
  PagePresetsAssetSource: stubPlugin('PagePresetsAssetSource'),
  PremiumTemplatesAssetSource: stubPlugin('PremiumTemplatesAssetSource'),
  StickerAssetSource: stubPlugin('StickerAssetSource'),
  TextAssetSource: stubPlugin('TextAssetSource'),
  TextComponentAssetSource: stubPlugin('TextComponentAssetSource'),
  TypefaceAssetSource: stubPlugin('TypefaceAssetSource'),
  UploadAssetSources: stubPlugin('UploadAssetSources'),
  VectorShapeAssetSource: stubPlugin('VectorShapeAssetSource')
}));

vi.mock('@imgly/plugin-background-removal-web', () => ({
  default: (options: Record<string, unknown>) => ({
    kind: 'BackgroundRemovalPlugin',
    options
  })
}));

const { initVideoEditor } = await import('../../src/imgly');

const ASSET_SOURCE_PLUGINS = [
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
  'VectorShapeAssetSource',
  'PremiumTemplatesAssetSource'
];

const PAGE_PRESET_GLOBS = [
  'ly.img.page.presets.instagram.*',
  'ly.img.page.presets.facebook.*',
  'ly.img.page.presets.x.*',
  'ly.img.page.presets.linkedin.*',
  'ly.img.page.presets.pinterest.*',
  'ly.img.page.presets.tiktok.*',
  'ly.img.page.presets.youtube.*',
  'ly.img.page.presets.video.*'
];

describe('initVideoEditor', () => {
  let spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;
  let added: AddedPlugin[];

  beforeEach(async () => {
    spy = createApiSpy<CreativeEditorSDK>();
    await initVideoEditor(spy.api);
    added = spy.callsTo('addPlugin').map(({ args }) => args[0] as AddedPlugin);
  });

  function optionsOf(kind: string): Record<string, unknown> | undefined {
    return added.find((plugin) => plugin.kind === kind)?.options;
  }

  it('VED-U1 adds the configuration plugin first, then the asset sources, then background removal', () => {
    expect(added.map((plugin) => plugin.kind)).toEqual([
      'VideoEditorConfig',
      ...ASSET_SOURCE_PLUGINS,
      'BackgroundRemovalPlugin'
    ]);
  });

  it('VED-U1 registers the sixteen asset sources in one concurrent batch', async () => {
    const pending: Array<() => void> = [];
    const addPlugin = vi.fn(
      () => new Promise<void>((resolve) => pending.push(resolve))
    );
    const cesdk = {
      addPlugin,
      ui: { insertOrderComponent: vi.fn() }
    } as unknown as CreativeEditorSDK;

    const done = initVideoEditor(cesdk);
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(1));

    pending.shift()!();
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(17));

    while (pending.length > 0) {
      pending.shift()!();
    }
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(18));
    pending.shift()!();
    await done;
  });

  it('VED-U2 includes the three upload sources', () => {
    expect(optionsOf('UploadAssetSources')).toEqual({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    });
  });

  it('VED-U2 includes the video templates and the image, audio and video demo assets', () => {
    expect(optionsOf('DemoAssetSources')).toEqual({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    });
  });

  it('VED-U2 includes exactly the eight page-preset platforms', () => {
    expect(optionsOf('PagePresetsAssetSource')).toEqual({
      include: PAGE_PRESET_GLOBS
    });
  });

  it('VED-U2 includes only the premium templates', () => {
    expect(optionsOf('PremiumTemplatesAssetSource')).toEqual({
      include: ['ly.img.templates.premium.*']
    });
  });

  it('VED-U3 inserts the Export Video button at the end of the navigation bar', () => {
    expect(spy.callsTo('ui.insertOrderComponent')).toHaveLength(1);
    expect(spy.lastArgsOf('ui.insertOrderComponent')).toEqual([
      { in: 'ly.img.navigation.bar', position: 'end' },
      { id: 'ly.img.exportVideo.navigationBar', color: 'accent' }
    ]);
  });

  it('VED-U4 offers background removal in the canvas menu', () => {
    expect(optionsOf('BackgroundRemovalPlugin')).toEqual({
      ui: { locations: ['canvasMenu'] },
      provider: { type: '@imgly/background-removal' }
    });
  });

  it('VED-U5 configures nothing else: no theme, locale, feature or setting', () => {
    const configuring = spy.calls
      .map(({ path }) => path)
      .filter((path) => path !== 'addPlugin');

    expect(configuring).toEqual(['ui.insertOrderComponent']);
  });
});
