/**
 * CE.SDK HTML5 Exporter - Initialization Module
 *
 * This module provides the main entry point for initializing the video editor
 * with HTML5 export capabilities. Import and call `initHtml5ExporterEditor()`
 * to configure a CE.SDK instance with the HTML5 export panel plugin.
 *
 * The HTML5 exporter uses a video editor configuration because HTML5 export
 * is primarily used for animated content (HTML5 banners, ads) that requires
 * timeline and animation support.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
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
  VectorShapeAssetSource,
  PremiumTemplatesAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration and plugins
import { VideoEditorConfig } from './config/plugin';
import { Html5ExportPanelPlugin } from './plugins/html5-export-panel';

// Re-export for external use
export { VideoEditorConfig } from './config/plugin';
export { Html5ExportPanelPlugin } from './plugins/html5-export-panel';

/**
 * Initialize the CE.SDK HTML5 Exporter Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Video editor UI configuration (timeline, animations)
 * - HTML5 export panel plugin with format and text mode options
 * - Asset source plugins (images, shapes, text, etc.)
 * - Preview in new tab and ZIP download capabilities
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
// highlight-init-function
export async function initHtml5ExporterEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the video editor configuration plugin
  // This sets up the UI with timeline, animations, features, settings, and i18n
  await cesdk.addPlugin(new VideoEditorConfig());

  // ============================================================================
  // Theme and Locale
  // ============================================================================

  // highlight-theme
  // Configure appearance: 'light' | 'dark' | 'system'
  // cesdk.setTheme('dark');
  // cesdk.setLocale('en');
  // highlight-theme

  // ============================================================================
  // HTML5 Export Panel Plugin
  // ============================================================================

  // highlight-html5-export-panel
  // Add the HTML5 export panel plugin with format and text mode options
  await cesdk.addPlugin(new Html5ExportPanelPlugin());
  // highlight-html5-export-panel

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

  // Demo assets (templates, images, stickers, shapes, text)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*', 'ly.img.audio.*', 'ly.img.video.*']
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

  // Premium templates (design templates from CDN)
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );
  // highlight-asset-sources
}
// highlight-init-function
