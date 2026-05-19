/**
 * CE.SDK Unsplash Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the Unsplash editor.
 * Import and call `initUnsplashEditor()` to configure a CE.SDK instance with
 * Unsplash image integration.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://unsplash.com/documentation
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
import {
  UnsplashAssetSourcePlugin,
  UnsplashAssetSourcePluginOptions
} from './plugins/unsplash';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export {
  UnsplashAssetSourcePlugin,
  unsplashAssetSource,
  createUnsplashAssetSource
} from './plugins/unsplash';
export type { UnsplashAssetSourcePluginOptions } from './plugins/unsplash';

/**
 * Configuration options for the Unsplash Editor.
 */
export interface UnsplashEditorOptions {
  /**
   * Unsplash API proxy URL.
   *
   * IMPORTANT: Never expose your Unsplash API key in frontend code.
   * Use a proxy server to add the API key server-side.
   *
   * If not provided, falls back to the demo proxy URL for development.
   * For production, set up your own proxy server.
   *
   * @example 'https://your-api.example.com/unsplash'
   */
  unsplashApiUrl?: string;
}

/**
 * Initialize the CE.SDK Unsplash Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Unsplash image integration (replaces default image library)
 * - Design editor UI configuration (features, settings, navigation bar via plugin)
 * - Asset source plugins (templates, shapes, text, etc.)
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param options - Configuration options for the editor
 *
 * @example
 * ```typescript
 * // Using environment variables (recommended for new projects)
 * await initUnsplashEditor(cesdk, {
 *   unsplashApiUrl: import.meta.env.VITE_UNSPLASH_API_URL
 * });
 *
 * // Using direct configuration (for existing projects)
 * await initUnsplashEditor(cesdk, {
 *   unsplashApiUrl: 'https://your-proxy.example.com/unsplash'
 * });
 *
 * // Using demo proxy (development only)
 * await initUnsplashEditor(cesdk);
 * ```
 */
export async function initUnsplashEditor(
  cesdk: CreativeEditorSDK,
  options: UnsplashEditorOptions = {}
) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the Unsplash editor configuration plugin
  // This sets up the UI, features, settings, and i18n for the Unsplash editor
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
  // Unsplash Asset Source Plugin
  // ============================================================================

  // highlight-unsplash-setup
  // Add Unsplash image library integration
  // Requires: npm install unsplash-js
  // Configure: Pass unsplashApiUrl option or set VITE_UNSPLASH_API_URL env var
  const unsplashPluginOptions: UnsplashAssetSourcePluginOptions = {};
  if (options.unsplashApiUrl) {
    unsplashPluginOptions.apiUrl = options.unsplashApiUrl;
  }
  await cesdk.addPlugin(new UnsplashAssetSourcePlugin(unsplashPluginOptions));
  // highlight-unsplash-setup

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

  // Demo assets (templates only - images replaced by Unsplash)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
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

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );
  // highlight-asset-sources
}
