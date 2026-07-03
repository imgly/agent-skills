/**
 * CE.SDK Video Captions - Initialization Module
 *
 * This module provides video captioning with multiple modes:
 * - autocaption: AI-powered caption generation
 * - blank: Empty video editor
 * - import: SRT file import
 * - pre-captioned: Edit existing captions
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ImageColorsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  UploadAssetSources
} from '@cesdk/cesdk-js/plugins';

import { VideoEditorConfig } from './config/plugin';
import { createAutocaptionPlugin } from './plugins/auto-caption';

// Export types
export type CaptionMode = 'autocaption' | 'blank' | 'import' | 'pre-captioned';

// Export configuration plugin
export { VideoEditorConfig } from './config/plugin';

// Export autocaption plugin factory
export { createAutocaptionPlugin } from './plugins/auto-caption';

/**
 * Initialize the CE.SDK Video Editor in autocaption mode.
 *
 * This function configures a CE.SDK instance for AI-powered caption generation:
 * - Adds the autocaption plugin with ElevenLabsScribeV2 provider
 * - Loads a sample video for captioning
 * - Configures the video editor UI
 * - Opens the caption inspector panel
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
// highlight-autocaption
export async function initVideoCaptionsAutocaptionEditor(
  cesdk: CreativeEditorSDK
) {
  // Add configuration plugin
  await cesdk.addPlugin(new VideoEditorConfig());

  // Add asset source plugins
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Add the autocaption plugin
  await cesdk.addPlugin(createAutocaptionPlugin());
}
// highlight-autocaption

/**
 * Initialize the CE.SDK Video Editor in blank mode.
 *
 * This function configures a CE.SDK instance for creating videos from scratch:
 * - Creates a new blank video scene
 * - Configures the video editor UI
 * - Opens the caption inspector panel
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
// highlight-blank
export async function initVideoCaptionsBlankEditor(cesdk: CreativeEditorSDK) {
  // Add configuration plugin
  await cesdk.addPlugin(new VideoEditorConfig());

  // Add asset source plugins
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
}
// highlight-blank

/**
 * Initialize the CE.SDK Video Editor in import mode.
 *
 * This function configures a CE.SDK instance for importing SRT caption files:
 * - Loads a sample video for caption import demonstration
 * - Configures the video editor UI
 * - Opens the caption inspector panel
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
// highlight-import
export async function initVideoCaptionsImportEditor(cesdk: CreativeEditorSDK) {
  // Add configuration plugin
  await cesdk.addPlugin(new VideoEditorConfig());

  // Add asset source plugins
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
}
// highlight-import

/**
 * Initialize the CE.SDK Video Editor in pre-captioned mode.
 *
 * This function configures a CE.SDK instance for editing existing captions:
 * - Loads a video with pre-embedded captions
 * - Automatically selects the first caption for editing
 * - Configures the video editor UI
 * - Opens the caption inspector panel
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
// highlight-pre-captioned
export async function initVideoCaptionsPreCaptionedEditor(
  cesdk: CreativeEditorSDK
) {
  // Add configuration plugin
  await cesdk.addPlugin(new VideoEditorConfig());

  // Add asset source plugins
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
}
// highlight-pre-captioned
