/**
 * CE.SDK Vectorizer Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the vectorizer editor.
 * Import and call `initVectorizerEditor()` to configure a CE.SDK instance
 * with image vectorization functionality prominently featured.
 *
 * @see https://img.ly/docs/cesdk/js/edit-image/vectorize-2b4c7f/
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
import { DesignEditorConfig } from './config/plugin';

// Vectorizer plugin
import { setupVectorizerPlugin } from './plugins/vectorizer';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export { setupVectorizerPlugin } from './plugins/vectorizer';

/**
 * Initialize the CE.SDK Vectorizer Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Image vectorization via official plugin (canvas menu)
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - Actions dropdown in navigation bar
 * - Disabled placeholder and preview features
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initVectorizerEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the design editor configuration plugin
  // This sets up the UI, features, settings, and i18n for design editing
  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Runtime Configuration
  // ============================================================================

  // Set role (replaces deprecated config.role)
  cesdk.engine.editor.setRole('Creator');

  // Set theme (replaces deprecated config.theme)
  cesdk.ui.setTheme('light');

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Color palettes for design
  await Promise.all([
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),

    // Typeface/font assets
    cesdk.addPlugin(new TypefaceAssetSource()),

    // Text presets (headlines, body text styles)
    cesdk.addPlugin(new TextAssetSource()),

    // Text components (pre-designed text layouts)
    cesdk.addPlugin(new TextComponentAssetSource()),

    // Vector shapes (rectangles, circles, arrows, etc.)
    cesdk.addPlugin(new VectorShapeAssetSource()),

    // Sticker assets
    cesdk.addPlugin(new StickerAssetSource()),

    // Visual effects (adjustments, vignette, etc.)
    cesdk.addPlugin(new EffectsAssetSource()),

    // Photo filters (LUT, duotone)
    cesdk.addPlugin(new FiltersAssetSource()),

    // Blur presets for blur effects
    cesdk.addPlugin(new BlurAssetSource()),

    // Page format presets (A4, Letter, social media sizes)
    cesdk.addPlugin(new PagePresetsAssetSource()),

    // Crop presets (aspect ratios)
    cesdk.addPlugin(new CropPresetsAssetSource()),

    // Local upload sources (images) - replaces config.callbacks.onUpload
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

    // Premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);

  // ============================================================================
  // Vectorizer Plugin
  // ============================================================================

  // Setup image vectorization with canvas menu
  // - Canvas menu: Adds "Vectorize" option when an image is selected
  // The vectorizer converts raster images into scalable vector graphics
  await setupVectorizerPlugin(cesdk);
}
