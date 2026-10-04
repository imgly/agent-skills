/**
 * CE.SDK Design Validation Editor - Initialization Module
 *
 * This module configures CE.SDK for design validation workflows:
 * - Design editor with standard creative capabilities
 * - Asset sources for images, text, shapes, and effects
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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

// Re-export types
export { type BlockValidationResult, type ValidationState } from './types';

// Re-export validation functions
export {
  validateOutsideBlocks,
  validateProtrudingBlocks,
  validatePartiallyHiddenTexts,
  validateLowResolution
} from './validation';

/**
 * Initialize the CE.SDK Design Validation Editor.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initDesignValidationEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // Configuration Plugin (handles features, UI, settings)
  await cesdk.addPlugin(new DesignEditorConfig());

  // Asset Source Plugins
  await Promise.all([
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),

    // Upload sources
    cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    ),

    // Demo assets
    cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    ),

    // Premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);
}
