/**
 * CE.SDK PDF Template Import Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the PDF template
 * import editor. Import and call `initPdfTemplateImportEditor()` to configure
 * a CE.SDK instance for editing imported PDF templates.
 *
 * @see https://img.ly/docs/cesdk/js/features/
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
 * Initialize the CE.SDK PDF Template Import Editor.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Asset source plugins (templates, images, shapes, text, etc.)
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initPdfTemplateImportEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the PDF template import configuration plugin
  // This sets up the UI, features, settings, and i18n for design editing
  await cesdk.addPlugin(new AdvancedEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // highlight-asset-sources
  // Asset source plugins provide built-in asset libraries

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Color palettes for design
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images)
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Demo assets (templates, images)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.templates.*', 'ly.img.image.*']
    })
  );

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Page format presets (A4, Letter, social media sizes)
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Text presets (headlines, body text styles)
  await cesdk.addPlugin(new TextAssetSource());

  // Text components (pre-designed text layouts)
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Vector shapes (rectangles, circles, arrows, etc.)
  await cesdk.addPlugin(new VectorShapeAssetSource());
  // highlight-asset-sources
}
