/**
 * CE.SDK Translation & Internationalization Editor - Initialization Module
 *
 * This module demonstrates dynamic language/locale switching in the editor.
 * Import and call `initTranslationInternationalizationEditor()` to configure a CE.SDK instance with
 * localization support.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/localization-508e20/
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

// Configuration
import { DesignEditorConfig } from './config/plugin';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';

/**
 * Initialize the CE.SDK Translation & Internationalization Editor with localization support.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Asset source plugins
 * - Actions dropdown in navigation bar
 * - Default English locale (can be switched dynamically)
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initTranslationInternationalizationEditor(
  cesdk: CreativeEditorSDK
) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the design editor configuration plugin
  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Theme and Locale
  // ============================================================================

  // highlight-locale-setup
  // Set default locale to English
  // Use cesdk.i18n.setLocale('de') to switch to German
  cesdk.i18n.setLocale('en');
  // highlight-locale-setup

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

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
