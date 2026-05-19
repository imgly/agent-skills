/**
 * CE.SDK Version History - Initialization Module
 *
 * This module provides the main entry point for initializing the version history editor.
 * It configures CE.SDK with snapshot functionality, allowing users to save and load
 * previous versions of their designs.
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
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import { DesignEditorConfig } from './config/plugin';
import { Snapshot } from '../app/types';

// Re-export plugin for external use
export { DesignEditorConfig } from './config/plugin';

// Export snapshot creation function for use in App.tsx
export { createSnapshot } from './history';

// Export initial snapshots data
export { INITIAL_SNAPSHOTS, getInitialSceneUrl } from './snapshots';

// ============================================================================
// Main Initialization
// ============================================================================

/**
 * Initialize a CE.SDK instance with version history configuration.
 *
 * This function configures an already-created CE.SDK instance with:
 * - Design editor UI configuration
 * - Save action that calls the onSave callback
 * - Navigation bar with save button
 * - Asset source plugins
 * - i18n translations for "Save Snapshot" button
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initVersionHistoryEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the version history editor configuration plugin
  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Color palettes for design
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Text presets
  await cesdk.addPlugin(new TextAssetSource());

  // Text components
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Vector shapes
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Visual effects
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters
  await cesdk.addPlugin(new FiltersAssetSource());

  // Blur presets
  await cesdk.addPlugin(new BlurAssetSource());

  // Page format presets
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Crop presets
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Demo assets
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );
}

// ============================================================================
// Snapshot Loading
// ============================================================================

/**
 * Load a snapshot into the editor
 *
 * @param cesdk - The CreativeEditorSDK instance
 * @param snapshot - The snapshot to load
 */
export async function loadSnapshot(
  cesdk: CreativeEditorSDK,
  snapshot: Snapshot
): Promise<void> {
  await cesdk.loadFromURL(snapshot.sceneUrl);
  const page = cesdk.engine.scene.getPages()[0];
  if (page) {
    cesdk.engine.scene.enableZoomAutoFit(page, 'Both', 20.0, 20.0, 20.0, 20.0);
  }
}
