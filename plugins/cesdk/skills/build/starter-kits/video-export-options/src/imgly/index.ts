/**
 * CE.SDK Video Export Options - Initialization Module
 *
 * This module provides a video editor with custom export options panel
 * allowing users to select resolution and FPS for video export.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ImageColorsAssetSource,
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

// Configuration and plugins
import { VideoEditorConfig } from './config/plugin';
import { ExportVideoPanelPlugin } from './plugins/export-video-panel';

// Re-export for external use
export { VideoEditorConfig } from './config/plugin';
export { ExportVideoPanelPlugin } from './plugins/export-video-panel';

/**
 * Initialize the CE.SDK Video Editor with export options panel.
 *
 * This function configures a CE.SDK instance with:
 * - Video editor UI configuration
 * - Background removal plugin
 * - Custom export options panel with resolution/FPS selection
 * - Asset source plugins (videos, audio, images, effects, etc.)
 * - Custom navigation bar with export button
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initVideoExportOptionsEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the video editor configuration plugin
  // This sets up the UI, features, settings, and i18n for video editing
  await cesdk.addPlugin(new VideoEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Caption presets for video captions
  await cesdk.addPlugin(new CaptionPresetsAssetSource());

  // Color palettes for design
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images, videos, audio)
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );

  // Demo assets (images, videos, audio, stickers, templates)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Page format presets (social media video sizes)
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );

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

  // ============================================================================
  // Export Options Panel Plugin
  // ============================================================================

  // highlight-export-panel
  // Add custom export panel with resolution and FPS selection
  await cesdk.addPlugin(ExportVideoPanelPlugin());
  // highlight-export-panel
}
