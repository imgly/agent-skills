/**
 * CE.SDK Cutout Lines Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the cutout lines editor.
 * Import and call `initCutoutLinesEditor()` to configure a CE.SDK instance
 * with cutout line creation functionality prominently featured.
 *
 * @see https://img.ly/docs/cesdk/js/plugins/cutout-library/
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
import { DesignEditorConfig } from './config/plugin';

// Cutout library plugin
import { setupCutoutLibraryPlugin } from './plugins/cutout-library';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export { setupCutoutLibraryPlugin } from './plugins/cutout-library';

/**
 * Initialize the CE.SDK Cutout Lines Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Cutout line creation via official plugin (canvas menu + dock panel)
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - PDF export for print-ready cutout designs
 * - Disabled placeholder and preview features
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initCutoutLinesEditor(cesdk: CreativeEditorSDK) {
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
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Text presets (headlines, body text styles)
  await cesdk.addPlugin(new TextAssetSource());

  // Text components (pre-designed text layouts)
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Vector shapes (rectangles, circles, arrows, etc.)
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Page format presets (A4, Letter, social media sizes)
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images) - replaces config.callbacks.onUpload
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Demo assets (templates, images)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  // ============================================================================
  // Cutout Library Plugin
  // ============================================================================

  // Setup cutout library with canvas menu and dock panel
  // - Canvas menu: Right-click on shapes to create cutout lines
  // - Dock: Cutout library panel for managing saved cutouts
  await setupCutoutLibraryPlugin(cesdk);
}
