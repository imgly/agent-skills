/**
 * CE.SDK Start With Image Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the design editor
 * with an image as the starting point. Import and call `initStartWithImageEditor()`
 * to configure a CE.SDK instance for image-first design editing.
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
  PremiumTemplatesAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration and plugins
import { PhotoEditorConfig } from './config/plugin';

// Image catalog for sample images
import { IMAGE_CATALOG } from '../app/image-catalog';

// Re-export for external use
export { PhotoEditorConfig } from './config/plugin';
export { IMAGE_CATALOG } from '../app/image-catalog';
export type { ImageAsset } from '../app/image-catalog';

/**
 * Initialize the CE.SDK Start With Image Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration (features, settings, navigation bar via plugin)
 * - Asset source plugins (images, shapes, text, etc.)
 * - Image-first workflow using createFromImage()
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param imageUrl - Optional URL of the image to start with. If not provided, uses a sample image.
 */
export async function initStartWithImageEditor(
  cesdk: CreativeEditorSDK,
  imageUrl?: string
) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the start with image editor configuration plugin
  // This sets up the UI, features, settings, and i18n for image-first editing
  await cesdk.addPlugin(new PhotoEditorConfig());

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

  // Demo assets (images only for image-first workflow)
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
  // Create Design from Image
  // ============================================================================

  // highlight-create-from-image
  // Create a design scene from the provided image URL
  // This is the key feature of the start-with-image workflow
  const imageToLoad = imageUrl || IMAGE_CATALOG[0].full;
  await cesdk.createFromImage(imageToLoad);

  // Select the image block for immediate editing
  const imageBlocks = cesdk.engine.block.findByKind('image');
  if (imageBlocks.length > 0) {
    cesdk.engine.block.setSelected(imageBlocks[0], true);
  }
  // highlight-create-from-image
}
