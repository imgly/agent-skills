/**
 * CE.SDK Batch Image Generation - Initialization Module
 *
 * This module provides the main entry points for initializing CE.SDK editors
 * for template editing (Creator role) and instance editing (Adopter role).
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

// Configuration plugins
import { AdvancedEditorConfig } from './config/advanced-editor/plugin';
import { DesignEditorConfig } from './config/design-editor/plugin';

// Batch Rendering
export { batchRender } from './batch-renderer';
export type {
  BatchItem,
  BatchRenderOptions,
  BatchResult,
  MimeType
} from './batch-renderer';

// Plugins
export { AdvancedEditorConfig } from './config/advanced-editor/plugin';
export { DesignEditorConfig } from './config/design-editor/plugin';

// ============================================================================
// Template Editor Initialization (Creator Role)
// ============================================================================

/**
 * Initialize a CE.SDK instance as a Template Editor (Creator role).
 *
 * This function configures the editor for template creation with full
 * editing capabilities using AdvancedEditorConfig. After calling this function,
 * the application should set any variables and load the scene.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 *
 * @example
 * ```typescript
 * const cesdk = await CreativeEditorSDK.create('#editor', {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,});
 * await initBatchImageGenerationTemplateEditor(cesdk);
 * // Set placeholder variables
 * cesdk.engine.variable.setString('FirstName', 'Firstname');
 * // Load scene
 * await cesdk.loadFromString(sceneString);
 * ```
 */
export async function initBatchImageGenerationTemplateEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // ============================================================================
  // Role and Theme
  // ============================================================================

  cesdk.engine.editor.setRole('Creator');
  cesdk.ui.setTheme('dark');

  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new AdvancedEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await cesdk.addPlugin(new ImageColorsAssetSource());
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

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );
}

// ============================================================================
// Instance Editor Initialization (Adopter Role)
// ============================================================================

/**
 * Initialize a CE.SDK instance as an Instance Editor (Adopter role).
 *
 * This function configures the editor for editing individual instances
 * with limited editing capabilities using DesignEditorConfig. After calling
 * this function, the application should set any variables and load the scene.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 *
 * @example
 * ```typescript
 * const cesdk = await CreativeEditorSDK.create('#editor', {});
 * await initBatchImageGenerationInstanceEditor(cesdk);
 * // Set variables from employee data
 * cesdk.engine.variable.setString('FirstName', employee.firstName);
 * // Load scene
 * await cesdk.loadFromString(sceneString);
 * ```
 */
export async function initBatchImageGenerationInstanceEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // ============================================================================
  // Role
  // ============================================================================

  cesdk.engine.editor.setRole('Adopter');

  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
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

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );
}
