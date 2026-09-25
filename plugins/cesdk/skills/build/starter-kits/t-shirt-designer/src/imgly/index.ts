/**
 * CE.SDK T-Shirt Designer - Initialization Module
 *
 * This module provides the main entry point for initializing the t-shirt designer.
 * Import and call `initTShirtDesigner()` to configure a CE.SDK instance for t-shirt design.
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

// Configuration
import { ProductEditorConfig } from './config/plugin';
import { ProductBackdrop } from './plugins/product-backdrop';

// Exports for external use
export { ProductEditorConfig } from './config/plugin';
export { ProductBackdrop } from './plugins/product-backdrop';

// Export types
export type { ProductMetadata, DesignUnit, Source } from './types';

/**
 * Initialize the CE.SDK T-Shirt Designer with a complete configuration.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initTShirtDesigner(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new ProductEditorConfig());
  await cesdk.addPlugin(new ProductBackdrop());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await Promise.all([
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),

    cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    ),

    cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    )
  ]);
}
