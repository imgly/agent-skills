/**
 * CE.SDK Content Moderation Editor - Initialization Module
 *
 * This module configures CE.SDK for content moderation workflows:
 * - Design editor with standard creative capabilities
 * - Asset sources for images, text, shapes, and effects
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  PremiumTemplatesAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import { DesignEditorConfig } from './config/plugin';

// Re-export configuration plugin
export { DesignEditorConfig } from './config/plugin';

/**
 * Initialize the CE.SDK Content Moderation Editor.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initContentModerationEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // Configuration Plugin (handles features, UI, settings)
  await cesdk.addPlugin(new DesignEditorConfig());

  // Asset Source Plugins
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Upload sources
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Demo assets
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );
}
