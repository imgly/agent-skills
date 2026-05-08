/**
 * CE.SDK Form-Based Template Adoption - Initialization Module
 *
 * This module demonstrates form-based template editing where users
 * modify template content through structured forms instead of direct
 * canvas manipulation.
 *
 * @see https://img.ly/docs/cesdk/js/features/
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
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration plugin (using design-editor config)
import { DesignEditorConfig } from './config/plugin';

// Custom plugin for form-based editing
import { FormBasedTemplateAdoptionPlugin } from './plugins/form-based-template-adoption';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export { FormBasedTemplateAdoptionPlugin } from './plugins/form-based-template-adoption';

/**
 * Initialize the CE.SDK Form-Based Template Adoption editor.
 *
 * This function configures a CE.SDK instance for form-based template editing:
 * - Hides direct editing UI (dock, inspector, canvas bar)
 * - Registers a custom panel for form-based property editing
 * - Enables editing of images, text, and colors through form controls
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initFormBasedTemplateAdoption(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Role and Theme Configuration
  // ============================================================================

  // highlight-role-theme
  // Set Creator role for template editing
  cesdk.engine.editor.setRole('Creator');
  // Set light theme
  cesdk.ui.setTheme('light');
  // highlight-role-theme

  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the design editor configuration plugin
  await cesdk.addPlugin(new DesignEditorConfig());

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

  // Demo assets (templates, images)
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
  // highlight-asset-sources

  // ============================================================================
  // Form-Based Template Adoption Plugin
  // ============================================================================

  // highlight-form-plugin
  // Add the form-based template adoption plugin
  // This configures the UI for form-based editing and registers the custom panel
  await cesdk.addPlugin(FormBasedTemplateAdoptionPlugin());
  // highlight-form-plugin
}
