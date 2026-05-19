/**
 * CE.SDK Layouts Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the layouts editor.
 * Import and call `initLayoutsAssetSource()` to configure a CE.SDK instance for layout-based design editing.
 *
 * The layouts editor allows users to:
 * - Choose from pre-designed layout templates
 * - Apply layouts to existing pages while preserving content
 * - Swap between different layouts dynamically
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
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
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration plugin
import { DesignEditorConfig } from './config/plugin';
import { resolveAssetPath } from './resolveAssetPath';

// Layouts plugin
import { LayoutsAssetSourcePlugin } from './plugins/layouts/layout';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export { LayoutsAssetSourcePlugin } from './plugins/layouts/layout';
export type { LayoutsAssetSourcePluginOptions } from './plugins/layouts/layout';

/**
 * Initialize the CE.SDK Layouts Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Custom layouts asset source with 12 pre-designed layout templates
 * - Custom dock entry with Layouts icon
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - Actions dropdown in navigation bar
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initLayoutsAssetSource(cesdk: CreativeEditorSDK) {
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
  await cesdk.addPlugin(new BlurAssetSource());

  // Color palettes for design
  await cesdk.addPlugin(new ImageColorsAssetSource());
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
      include: ['ly.img.image.*', 'ly.img.templates.*']
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

  // ============================================================================
  // Layouts Plugin
  // ============================================================================

  // highlight-layouts
  // Add the layouts asset source plugin
  // This provides pre-designed layout templates that can be applied to pages
  await cesdk.addPlugin(
    new LayoutsAssetSourcePlugin({
      baseURL: resolveAssetPath('/assets')
    })
  );

  // highlight-layouts
}
