/**
 * CE.SDK Batch Image Generation - Initialization Module
 *
 * This module provides the main entry points for initializing CE.SDK editors
 * for template editing (Creator role) and instance editing (Adopter role).
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
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
 * await cesdk.load(sceneString);
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

  await Promise.all([
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
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

    // Premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);
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
 * await cesdk.load(sceneString);
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

  await Promise.all([
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
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

    // Premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);
}
