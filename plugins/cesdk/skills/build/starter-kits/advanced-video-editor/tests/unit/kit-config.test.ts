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

vi.mock('@cesdk/core-configs-web/advanced-video-editor', () => ({
  AdvancedVideoEditorConfig: stubPlugin('AdvancedVideoEditorConfig')
}));

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

const { initAdvancedVideoEditor } = await import('../../src/imgly');

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

describe('initAdvancedVideoEditor', () => {
  let spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;
  let added: AddedPlugin[];

  beforeEach(async () => {
    spy = createApiSpy<CreativeEditorSDK>();
    await initAdvancedVideoEditor(spy.api);
    added = spy.callsTo('addPlugin').map(({ args }) => args[0] as AddedPlugin);
  });

  function optionsOf(kind: string): Record<string, unknown> | undefined {
    return added.find((plugin) => plugin.kind === kind)?.options;
  }

  it('AVE-U1 adds the configuration plugin first, then the asset sources, then background removal', () => {
    expect(added.map((plugin) => plugin.kind)).toEqual([
      'AdvancedVideoEditorConfig',
      ...ASSET_SOURCE_PLUGINS,
      'BackgroundRemovalPlugin'
    ]);
  });

  it('AVE-U1 registers the sixteen asset sources in one concurrent batch', async () => {
    const pending: Array<() => void> = [];
    const addPlugin = vi.fn(
      () => new Promise<void>((resolve) => pending.push(resolve))
    );
    const cesdk = {
      addPlugin,
      ui: { insertOrderComponent: vi.fn() }
    } as unknown as CreativeEditorSDK;

    const done = initAdvancedVideoEditor(cesdk);
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

  it('AVE-U2 includes the three upload sources', () => {
    expect(optionsOf('UploadAssetSources')).toEqual({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    });
  });

  it('AVE-U2 includes the video templates and the image, audio and video demo assets', () => {
    expect(optionsOf('DemoAssetSources')).toEqual({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    });
  });

  it('AVE-U2 includes exactly the eight page-preset platforms', () => {
    expect(optionsOf('PagePresetsAssetSource')).toEqual({
      include: PAGE_PRESET_GLOBS
    });
  });

  it('AVE-U2 includes only the premium templates', () => {
    expect(optionsOf('PremiumTemplatesAssetSource')).toEqual({
      include: ['ly.img.templates.premium.*']
    });
  });

  it('AVE-U3 inserts the actions dropdown at the end of the navigation bar', () => {
    expect(spy.callsTo('ui.insertOrderComponent')).toHaveLength(1);
    expect(spy.lastArgsOf('ui.insertOrderComponent')).toEqual([
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          'ly.img.saveScene.navigationBar',
          'ly.img.exportVideo.navigationBar',
          'ly.img.exportScene.navigationBar',
          'ly.img.exportArchive.navigationBar',
          'ly.img.importScene.navigationBar'
        ]
      }
    ]);
  });

  it('AVE-U4b offers background removal in the canvas menu', () => {
    expect(optionsOf('BackgroundRemovalPlugin')).toEqual({
      ui: { locations: ['canvasMenu'] },
      provider: { type: '@imgly/background-removal' }
    });
  });

  it('AVE-U4 configures nothing else: no theme, locale, feature or setting', () => {
    const configuring = spy.calls
      .map(({ path }) => path)
      .filter((path) => path !== 'addPlugin');

    expect(configuring).toEqual(['ui.insertOrderComponent']);
  });
});

/**
 * The two kits were copied from one another, so a drift in the plugin list is
 * invisible in review. This pins the diff at the two lines it is meant to be.
 */
describe('AVE-U5 the difference from starterkit-video-editor', () => {
  it('is the configuration plugin and the navigation-bar entry, and nothing else', async () => {
    const { initVideoEditor } =
      await import('../../../starterkit-video-editor/src/imgly');

    const plain = createApiSpy<CreativeEditorSDK>();
    await initVideoEditor(plain.api);
    const advanced = createApiSpy<CreativeEditorSDK>();
    await initAdvancedVideoEditor(advanced.api);

    const shape = (spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>) =>
      spy.calls.map(({ path, args }) => {
        const plugin = args[0] as AddedPlugin;
        return path === 'addPlugin'
          ? { path, kind: plugin.kind, options: plugin.options }
          : { path, args };
      });

    const plainShape = shape(plain);
    const advancedShape = shape(advanced);

    expect(advancedShape).toHaveLength(plainShape.length);
    const differing = advancedShape.filter(
      (entry, index) =>
        JSON.stringify(entry) !== JSON.stringify(plainShape[index])
    );
    expect(differing.map((entry) => entry.path)).toEqual([
      'addPlugin',
      'ui.insertOrderComponent'
    ]);
  });
});
