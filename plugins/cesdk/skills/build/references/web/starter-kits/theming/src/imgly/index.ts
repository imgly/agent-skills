/**
 * CE.SDK Theming Editor - Initialization Module
 *
 * This module demonstrates CE.SDK theme customization capabilities:
 * - Built-in themes (light, dark, system)
 * - UI scaling (normal, large)
 * - Runtime theme switching
 *
 * @see https://img.ly/docs/cesdk/js/configuration-2c1c3d/
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

// Configuration plugin for theming editor
import { DesignEditorConfig } from './config/plugin';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';

// Re-export color utilities
export {
  generateColorAbstractionTokensAccent,
  generateColorAbstractionTokensActive,
  generateColorAbstractionTokensCanvas,
  generateColorAbstractionTokensSurface,
  generateStaticTokens
} from './color';

/**
 * Initialize the CE.SDK Theming Editor.
 *
 * This function demonstrates theme configuration:
 * - The initial theme is set in the config (src/index.ts)
 * - Theme can be changed at runtime via cesdk.setTheme()
 * - UI scale can also be configured
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initThemingEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the theming editor configuration plugin
  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Theme Configuration Examples
  // ============================================================================

  // highlight-theme
  cesdk.engine.editor.setRole('Creator');

  // Set the initial theme (replaces config.theme)
  // Built-in themes: 'light' | 'dark' | 'system'
  cesdk.ui.setTheme('dark');

  // Set the UI scale (replaces config.ui.scale)
  // Available scales: 'normal' | 'large'
  cesdk.ui.setScale('normal');
  // highlight-theme

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Blur presets for blur effects
  await Promise.all([
    cesdk.addPlugin(new BlurAssetSource()),

    // Color palettes for design
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),

    // Crop presets (aspect ratios)
    cesdk.addPlugin(new CropPresetsAssetSource()),

    // Local upload sources (images)
    cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    ),

    // Demo assets (templates, images)
    cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    ),

    // Visual effects (adjustments, vignette, etc.)
    cesdk.addPlugin(new EffectsAssetSource()),

    // Photo filters (LUT, duotone)
    cesdk.addPlugin(new FiltersAssetSource()),

    // Page format presets (A4, Letter, social media sizes)
    cesdk.addPlugin(new PagePresetsAssetSource()),

    // Sticker assets
    cesdk.addPlugin(new StickerAssetSource()),

    // Text presets (headlines, body text styles)
    cesdk.addPlugin(new TextAssetSource()),

    // Text components (pre-designed text layouts)
    cesdk.addPlugin(new TextComponentAssetSource()),

    // Typeface/font assets
    cesdk.addPlugin(new TypefaceAssetSource()),

    // Vector shapes (rectangles, circles, arrows, etc.)
    cesdk.addPlugin(new VectorShapeAssetSource()),

    // Premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);
}
