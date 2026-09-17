/**
 * CE.SDK Multi-Image Generation - imgly Module
 *
 * This module provides the complete SDK integration for multi-image generation.
 * Customers can import everything they need from this single entry point.
 *
 * @example
 * ```typescript
 * import {
 *   // Engine
 *   initMultiImageGenerationHeadlessEngine,
 *   registerMultiImageGenerationAssetSources,
 *   renderSceneToImage,
 *
 *   // Editor Configuration Plugins
 *   DesignEditorConfig,        // Adopter mode (standard editing)
 *   AdvancedEditorConfig, // Creator mode (full template design)
 *
 *   // Generation
 *   fillTemplate,
 *   generateAssets,
 *   applyRestaurantColors
 * } from './imgly';
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/key-capabilities-dbb5b1/
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

import { DesignEditorConfig } from './config/design-editor/plugin';
import { AdvancedEditorConfig } from './config/advanced-design-editor/plugin';

// =============================================================================
// Utils (re-export from utils.ts)
// =============================================================================

export { hexToRgba, replaceImageByName, exportSceneAsImage } from './utils';
export type { Restaurant, Template, GeneratedAsset } from './types';

// =============================================================================
// Engine Utilities
// =============================================================================

export { initMultiImageGenerationHeadlessEngine } from './headless-engine';
export { registerMultiImageGenerationAssetSources } from './asset-sources';

// =============================================================================
// Editor Initialization
// =============================================================================

/**
 * Initialize the Design Editor configuration (Adopter mode).
 *
 * Sets up the editor with light theme and standard editing features
 * for brand-consistent editing.
 */
export async function initMultiImageGenerationDesignEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  await cesdk.addPlugin(new DesignEditorConfig());

  // Add asset source plugins
  await Promise.all([
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource()),
    cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    ),
    cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    ),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),

    // Premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);
}

/**
 * Initialize the Advanced Design Editor configuration (Creator mode).
 *
 * Sets up the editor with dark theme and advanced features
 * for template design.
 */
export async function initMultiImageGenerationAdvancedDesignEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  await cesdk.addPlugin(new AdvancedEditorConfig());

  // Add asset source plugins
  await Promise.all([
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource()),
    cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    ),
    cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    ),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),

    // Premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);
}

// =============================================================================
// Configuration Plugins (for direct use if needed)
// =============================================================================

export { DesignEditorConfig } from './config/design-editor/plugin';
export { AdvancedEditorConfig } from './config/advanced-design-editor/plugin';

// =============================================================================
// Generation Utilities
// =============================================================================

export {
  fillTemplate,
  applyRestaurantColors,
  generateAssets,
  renderSceneToImage
} from './generation';
