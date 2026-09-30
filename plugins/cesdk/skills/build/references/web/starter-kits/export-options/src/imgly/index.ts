/**
 * CE.SDK Export Options Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the design editor
 * with advanced export options. Import and call `initExportOptionsEditor()`
 * to configure a CE.SDK instance with format selection, quality settings,
 * resolution control, and page range selection for exports.
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

// Configuration and plugins
import { DesignEditorConfig } from './config/plugin';
import { setupExportDesignPanel } from './plugins/export-design-panel';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export { setupExportDesignPanel } from './plugins/export-design-panel';

/**
 * Initialize the CE.SDK Export Options Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Export design panel plugin with format, quality, and resolution options
 * - Asset source plugins (images, shapes, text, etc.)
 * - Multi-page design support with page range export
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
// highlight-init-function
export async function initExportOptionsEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the export options editor configuration plugin
  // This sets up the UI, features, settings, and i18n for export-focused editing
  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Theme and Locale
  // ============================================================================

  // highlight-theme
  // Configure appearance: 'light' | 'dark' | 'system'
  // cesdk.setTheme('dark');
  // cesdk.setLocale('en');
  // highlight-theme

  // ============================================================================
  // Export Design Panel Plugin
  // ============================================================================

  // highlight-export-panel
  // Setup the export design panel with format, quality, and resolution options
  setupExportDesignPanel(cesdk);
  // highlight-export-panel

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

    // Demo assets (templates, images, stickers, shapes, text)
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

  // open panel
  cesdk.ui.openPanel('//ly.img.panel/export');
}
// highlight-init-function
