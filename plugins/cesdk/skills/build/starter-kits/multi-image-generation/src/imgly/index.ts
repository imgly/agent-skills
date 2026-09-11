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
 * @see https://img.ly/docs/cesdk/js/features/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import CreativeEngine from '@cesdk/engine';

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

// =============================================================================
// Engine Utilities
// =============================================================================

/**
 * Initialize a headless CE.SDK engine with standard asset sources.
 */
export async function initMultiImageGenerationHeadlessEngine(
  options: { license?: string; baseURL?: string } = {}
): Promise<CreativeEngine> {
  const config = {
    baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
    ...(options.license != null && { license: options.license }),
    ...(options.baseURL != null && { baseURL: options.baseURL })
  };

  const engine = await CreativeEngine.init(config);

  // Add standard asset source plugins
  await engine.addPlugin(new ImageColorsAssetSource());
  await engine.addPlugin(new ColorPaletteAssetSource());
  await engine.addPlugin(new TypefaceAssetSource());
  await engine.addPlugin(new TextAssetSource());
  await engine.addPlugin(new TextComponentAssetSource());
  await engine.addPlugin(new VectorShapeAssetSource());
  await engine.addPlugin(new StickerAssetSource());
  await engine.addPlugin(new EffectsAssetSource());
  await engine.addPlugin(new FiltersAssetSource());
  await engine.addPlugin(new BlurAssetSource());
  await engine.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*'
      ]
    })
  );
  await engine.addPlugin(new CropPresetsAssetSource());
  await engine.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await engine.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  return engine;
}

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
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );
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
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );
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
