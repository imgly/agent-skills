/**
 * CE.SDK Multi-Image Generation - Headless Asset Sources
 *
 * The asset libraries the headless engine offers. Separate from
 * `headless-engine.ts` because `addPlugin` is a browser capability: a
 * non-browser runtime such as `@cesdk/node` creates the engine without them.
 */

import type CreativeEngine from '@cesdk/engine';
import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  ImageColorsAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

/**
 * Register the standard asset sources on a headless engine.
 *
 * @param engine - The engine from `initMultiImageGenerationHeadlessEngine`
 */
export async function registerMultiImageGenerationAssetSources(
  engine: CreativeEngine
): Promise<void> {
  await engine.addPlugin(new ImageColorsAssetSource());
  await engine.addPlugin(new ColorPaletteAssetSource());
  await engine.addPlugin(new TypefaceAssetSource());
  await engine.addPlugin(new TextAssetSource());
  await engine.addPlugin(new TextComponentAssetSource());
  await engine.addPlugin(new VectorShapeAssetSource());
  await engine.addPlugin(new StickerAssetSource());
  await engine.addPlugin(new EffectsAssetSource());
  await engine.addPlugin(new FiltersAssetSource());
  await engine.addPlugin(new BlurAssetSource());
  await engine.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*'
      ]
    })
  );
  await engine.addPlugin(new CropPresetsAssetSource());
  await engine.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await engine.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );
}
