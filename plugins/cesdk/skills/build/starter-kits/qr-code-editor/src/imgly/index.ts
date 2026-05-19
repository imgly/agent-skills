/**
 * CE.SDK QR Code Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the QR code editor.
 * Import and call `initQRCodeEditor()` to configure a CE.SDK instance
 * with QR code generation functionality prominently featured.
 *
 * @see https://img.ly/docs/cesdk/js/plugins/qr-code/
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

// Configuration plugin
import { DesignEditorConfig } from './config/plugin';

// QR code plugin
import { setupQRCodePlugin } from './plugins/qr-code';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export { setupQRCodePlugin } from './plugins/qr-code';

/**
 * Initialize the CE.SDK QR Code Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - QR code generation via official plugin (canvas menu + dock panel)
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - Actions dropdown in navigation bar
 * - Disabled placeholder and preview features
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initQRCodeEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the design editor configuration plugin
  // This sets up the UI, features, settings, and i18n for design editing
  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Runtime Configuration
  // ============================================================================

  // Set role (replaces deprecated config.role)
  cesdk.engine.editor.setRole('Creator');

  // Set theme (replaces deprecated config.theme)
  cesdk.ui.setTheme('light');

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Color palettes for design
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Text presets (headlines, body text styles)
  await cesdk.addPlugin(new TextAssetSource());

  // Text components (pre-designed text layouts)
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Vector shapes (rectangles, circles, arrows, etc.)
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Page format presets (A4, Letter, social media sizes)
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images) - replaces config.callbacks.onUpload
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

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );

  // ============================================================================
  // QR Code Plugin
  // ============================================================================

  // Setup QR code generation with canvas menu and dock panel
  // - Canvas menu: Adds "Generate QR Code" option in context menu
  // - Dock: Adds QR Code Generator button that opens the QR code panel
  await setupQRCodePlugin(cesdk);
}
