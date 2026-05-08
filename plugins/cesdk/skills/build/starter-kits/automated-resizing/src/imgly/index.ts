/**
 * CE.SDK Automated Resizing Module
 *
 * This module provides a self-contained API for content-aware resizing
 * and editor initialization. Copy this folder to integrate automated
 * resizing into your own application.
 *
 * @example
 * ```typescript
 * import CreativeEditorSDK from '@cesdk/cesdk-js';
type CreativeEditorSDK = InstanceType<typeof CreativeEditorSDK>;
 * import {
 *   initAutomatedResizingDesignEditor,
 *   initAutomatedResizingAdvancedEditor,
 *   resize,
 *   DEFAULT_SIZES
 * } from './imgly';
 *
 * const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);
 *
 * // Generate variants from a template scene string.
 * const variants = await resize({
 *   engine: cesdk.engine,
 *   sizes: DEFAULT_SIZES,
 *   scene: templateScene
 * });
 *
 * // Initialize the design editor for variant editing (light theme).
 * await initAutomatedResizingDesignEditor(cesdk);
 *
 * // Or initialize the advanced editor for template editing (dark theme).
 * await initAutomatedResizingAdvancedEditor(cesdk);
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/block-layout/content-aware-resize-2eb7ee/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
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

import { AdvancedEditorConfig } from './advanced-editor-config/plugin';
import { DesignEditorConfig } from './design-editor-config/plugin';

// ============================================================================
// Re-exports
// ============================================================================

// Types
// Utilities (consolidated in app layer)
export {
  getPlatformIconFilename,
  getSizeById,
  getSizesByPlatform
} from '../app/utils';
// Configuration plugins (for advanced use cases)
export { AdvancedEditorConfig } from './advanced-editor-config/plugin';
export { DesignEditorConfig } from './design-editor-config/plugin';
// Resizing functions
export { resize } from './resizing';
export type {
  AppConfig,
  ResizeOptions,
  SizePreset,
  Template,
  VariantBlob,
  VariantImage
} from './types';

// ============================================================================
// Public API
// ============================================================================

/**
 * Initialize the CE.SDK Design Editor.
 *
 * Configures the editor with a light theme optimized for variant editing.
 * Use this when users are editing generated variants.
 *
 * @param cesdk - The CreativeEditorSDK instance
 */
export async function initAutomatedResizingDesignEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // Add design editor configuration plugin (handles resetEditor internally)
  await cesdk.addPlugin(new DesignEditorConfig());

  // Set light theme for design editor (after plugin to avoid being reset)
  cesdk.ui.setTheme('light');

  // Add asset source plugins
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
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
}

/**
 * Initialize the CE.SDK Advanced Editor.
 *
 * Configures the editor with a dark theme optimized for template editing.
 * Use this when users are editing the source template.
 *
 * @param cesdk - The CreativeEditorSDK instance
 */
export async function initAutomatedResizingAdvancedEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // Add advanced editor configuration plugin (handles resetEditor internally)
  await cesdk.addPlugin(new AdvancedEditorConfig());

  // Set dark theme for advanced editor (after plugin to avoid being reset)
  cesdk.ui.setTheme('dark');

  // Add asset source plugins
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
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
}
