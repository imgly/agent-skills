/**
 * CE.SDK Export Using Renderer - Initialization Module
 *
 * This module provides the main entry point for initializing the export using renderer starterkit.
 * Import and call `initExportUsingRenderer()` to configure a CE.SDK instance for server-side rendering export.
 *
 * @see https://img.ly/docs/cesdk/renderer/overview/
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
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration and plugins
import { VideoEditorConfig } from './config/plugin';
import { setupRendererExport } from './renderer';

// Re-export for external use
export { VideoEditorConfig } from './config/plugin';
export {
  setupRendererExport,
  exportUsingRenderer,
  getRendererURL
} from './renderer';

/**
 * Initialize the CE.SDK Export Using Renderer with server-side rendering export.
 *
 * This function configures a CE.SDK instance with:
 * - Video editor UI configuration
 * - Server-side renderer export functionality
 * - Asset source plugins (videos, audio, images, effects, etc.)
 * - Custom navigation bar with Export using Renderer action
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initExportUsingRenderer(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new VideoEditorConfig());

  // ============================================================================
  // Feature Flags
  // ============================================================================

  // Disable placeholder and preview features (required for renderer export)
  cesdk.feature.set('ly.img.placeholder', false);
  cesdk.feature.set('ly.img.preview', false);

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // highlight-asset-sources
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());

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

  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());

  await cesdk.addPlugin(new PagePresetsAssetSource());

  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  // highlight-asset-sources

  // ============================================================================
  // Renderer Export Setup
  // ============================================================================

  // highlight-renderer-export
  // Setup server-side rendering export functionality
  // This adds:
  // - Export using CE.SDK Renderer action
  // - Custom navigation bar layout
  setupRendererExport(cesdk);
  // highlight-renderer-export
}
