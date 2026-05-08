/**
 * CE.SDK Getty Images Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the design editor
 * with Getty Images stock photos integration. Import and call `initGettyImagesEditor()`
 * to configure a CE.SDK instance with Getty Images as the primary image source.
 *
 * @see https://img.ly/docs/cesdk/js/custom-asset-sources/
 * @see https://developer.gettyimages.com/
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

// Getty Images plugin
import { GettyImagesAssetSourcePlugin } from './plugins/getty-images';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export { GettyImagesAssetSourcePlugin } from './plugins/getty-images';
export type { GettyImagesAssetSourcePluginOptions } from './plugins/getty-images';

/**
 * Initialize the CE.SDK Getty Images Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration (features, settings, navigation bar via plugin)
 * - Getty Images stock photos as the primary image source
 * - Asset source plugins (templates, images, shapes, text, etc.)
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param options - Optional configuration
 * @param options.gettyProxyUrl - Your Getty Images API proxy URL (can also be set via VITE_GETTY_IMAGES_PROXY_URL env var)
 */
export async function initGettyImagesEditor(
  cesdk: CreativeEditorSDK,
  options?: { gettyProxyUrl?: string }
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

  // Demo image assets
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
  // Getty Images Asset Source Plugin
  // ============================================================================

  // highlight-getty-setup
  // Setup Getty Images as the primary image source
  // This replaces the default image library with Getty Images stock photos
  await cesdk.addPlugin(
    new GettyImagesAssetSourcePlugin({ proxyUrl: options?.gettyProxyUrl })
  );
  // highlight-getty-setup
}
