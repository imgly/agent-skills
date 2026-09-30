/**
 * CE.SDK InDesign Template Import Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the InDesign template
 * import editor. Import and call `initInDesignTemplateImportEditor()` to configure
 * a CE.SDK instance for editing imported InDesign (IDML) templates.
 *
 * @see https://img.ly/docs/cesdk/js/key-capabilities-dbb5b1/
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

// Configuration plugin
import { AdvancedEditorConfig } from './config/plugin';

// Re-export for external use
export { AdvancedEditorConfig } from './config/plugin';

/**
 * Initialize the CE.SDK InDesign Template Import Editor.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Asset source plugins (templates, images, shapes, text, etc.)
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initInDesignTemplateImportEditor(
  cesdk: CreativeEditorSDK
) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the InDesign template import configuration plugin
  // This sets up the UI, features, settings, and i18n for design editing
  await cesdk.addPlugin(new AdvancedEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // highlight-asset-sources
  // Asset source plugins provide built-in asset libraries

  // Blur presets for blur effects
  await Promise.all([
    cesdk.addPlugin(new BlurAssetSource()),

    // Color palettes for design
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),

    // Crop presets (aspect ratios)
    cesdk.addPlugin(new CropPresetsAssetSource()),

    // Local upload sources (images)
    cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    ),

    // Demo assets (templates, images)
    cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    ),

    // Visual effects (adjustments, vignette, etc.)
    cesdk.addPlugin(new EffectsAssetSource()),

    // Photo filters (LUT, duotone)
    cesdk.addPlugin(new FiltersAssetSource()),

    // Page format presets (A4, Letter, social media sizes)
    cesdk.addPlugin(new PagePresetsAssetSource()),

    // Sticker assets
    cesdk.addPlugin(new StickerAssetSource()),

    // Text presets (headlines, body text styles)
    cesdk.addPlugin(new TextAssetSource()),

    // Text components (pre-designed text layouts)
    cesdk.addPlugin(new TextComponentAssetSource()),

    // Typeface/font assets
    cesdk.addPlugin(new TypefaceAssetSource()),

    // Vector shapes (rectangles, circles, arrows, etc.)
    cesdk.addPlugin(new VectorShapeAssetSource()),

    // Premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);
  // highlight-asset-sources
}
