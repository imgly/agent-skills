/**
 * CE.SDK Design Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the design editor.
 * Import and call `initDesignEditor()` to configure a CE.SDK instance for design editing.
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

import BackgroundRemovalPlugin from '@imgly/plugin-background-removal-web';

// Configuration and plugins
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';

// Re-export for external use
export { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';

/**
 * Initialize the CE.SDK Design Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Background removal plugin
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - Actions dropdown in navigation bar
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initDesignEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the design editor configuration plugin
  // This sets up the UI, features, settings, and i18n for design editing
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
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
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

  // ============================================================================
  // Navigation Bar Actions
  // ============================================================================

  // Configure the actions dropdown in the navigation bar
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar',
        'ly.img.exportScene.navigationBar',
        'ly.img.exportArchive.navigationBar',
        'ly.img.importScene.navigationBar'
      ]
    }
  );

  // ============================================================================
  // Background Removal Plugin
  // ============================================================================

  await cesdk.addPlugin(
    BackgroundRemovalPlugin({
      ui: { locations: ['canvasMenu'] },
      provider: {
        type: '@imgly/background-removal'
      }
    })
  );
}
