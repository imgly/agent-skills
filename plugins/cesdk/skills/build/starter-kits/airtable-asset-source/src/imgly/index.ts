/**
 * CE.SDK Airtable Image Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the design editor
 * with Airtable as a custom image asset source. Import and call `initAirtableImageEditor()`
 * to configure a CE.SDK instance with Airtable integration.
 *
 * @see https://img.ly/docs/cesdk/js/custom-asset-sources/
 * @see https://airtable.com/developers/web/api
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

// Configuration plugin
import { DesignEditorConfig } from './config/plugin';

// Airtable plugin
import { AirtableAssetSourcePlugin } from './plugins/airtable';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export { AirtableAssetSourcePlugin } from './plugins/airtable';
export type { AirtableAssetSourcePluginOptions } from './plugins/airtable';

/**
 * Configuration options for the Airtable Image Editor.
 */
export interface AirtableEditorOptions {
  /**
   * Airtable API proxy URL (recommended for production).
   *
   * IMPORTANT: Never expose your Airtable API key in frontend code.
   * Use a proxy server to add the API key server-side.
   *
   * The proxy should accept:
   * - GET /?query=...&perPage=...
   *
   * And return: { results: [{ name: string, image: { id, url, width, height, thumbnails } }] }
   *
   * Can be set via VITE_AIRTABLE_PROXY_URL environment variable.
   */
  proxyUrl?: string;

  /**
   * Airtable API key (for development/testing only).
   *
   * WARNING: Using this in production exposes your API key to all users.
   * Only use for local development and testing.
   *
   * Get your API key from: https://airtable.com/create/tokens
   * Can be set via VITE_AIRTABLE_API_KEY environment variable.
   */
  apiKey?: string;
}

/**
 * Initialize the CE.SDK Airtable Image Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration (features, settings, navigation bar via plugin)
 * - Airtable as the primary image source
 * - Asset source plugins (templates, images, shapes, text, etc.)
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param options - Optional configuration
 * @param options.proxyUrl - Airtable API proxy URL (can also be set via VITE_AIRTABLE_PROXY_URL env var)
 */
export async function initAirtableImageEditor(
  cesdk: CreativeEditorSDK,
  options?: AirtableEditorOptions
) {
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
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images)
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Demo assets (templates only - images will come from Airtable)
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

  // ============================================================================
  // Airtable Asset Source Plugin
  // ============================================================================

  // highlight-airtable-setup
  // Setup Airtable as the primary image source
  // This replaces the default image library with images from your Airtable database
  // Uses proxy URL for secure API access (never expose API keys in frontend code)
  await cesdk.addPlugin(
    new AirtableAssetSourcePlugin({
      proxyUrl: options?.proxyUrl,
      apiKey: options?.apiKey
    })
  );
  // highlight-airtable-setup
}
