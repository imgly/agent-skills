/**
 * CE.SDK Force Crop Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the force crop editor.
 * Import and call `initForceCropEditor()` to configure a CE.SDK instance for
 * photo editing with force crop functionality.
 *
 * The force crop feature allows you to enforce specific aspect ratios on images,
 * such as Instagram Portrait (4:5), LinkedIn Profile (1:1), or Facebook Shared (1.91:1).
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/force-crop-c2854e/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
  ColorPaletteAssetSource,
  EffectsAssetSource,
  FiltersAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration and plugins
import { PhotoEditorConfig } from './config/plugin';

// Re-export for external use
export { PhotoEditorConfig } from './config/plugin';

// ============================================================================
// Types
// ============================================================================

/**
 * Configuration for a crop preset.
 */
export interface CropPreset {
  id: string;
  label: {
    en: string;
  };
  meta: {
    thumbUri: string;
    icon: string;
    thumbAlt: string;
  };
  payload: {
    transformPreset: {
      type: 'FixedAspectRatio';
      width: number;
      height: number;
      designUnit: 'Pixel';
    };
  };
  groups: string[];
}

/**
 * Crop mode options.
 * - 'always': Always opens crop mode when force crop is applied
 * - 'ifNeeded': Opens crop mode only if the image doesn't match the aspect ratio
 * - 'silent': Applies cropping silently without user interaction
 */
export type CropModeId = 'always' | 'ifNeeded' | 'silent';

/**
 * Image configuration for force crop.
 */
export interface ImageConfig {
  full: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
}

// ============================================================================
// Initialize Force Crop Editor
// ============================================================================

/**
 * Initialize the CE.SDK Force Crop Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Photo editor UI configuration
 * - Background removal plugin
 * - Asset source plugins (filters, stickers, shapes, etc.)
 * - Force crop functionality with customizable presets and modes
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param options - Configuration options for force crop
 * @param options.preset - The crop preset to apply
 * @param options.image - The image configuration to load
 * @param options.mode - The crop mode: 'always', 'ifNeeded', or 'silent' (default: 'always')
 */
export async function initForceCropEditor(
  cesdk: CreativeEditorSDK,
  options: {
    preset: CropPreset;
    image: ImageConfig;
    mode?: CropModeId;
  }
) {
  const { preset, image, mode = 'always' } = options;

  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the photo editor configuration plugin
  // This sets up the UI, features, settings, and i18n for photo editing
  await cesdk.addPlugin(new PhotoEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // highlight-asset-sources
  // Asset source plugins provide built-in asset libraries
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  // highlight-asset-sources

  // ============================================================================
  // Setup Photo Editing Scene
  // ============================================================================

  // highlight-scene-setup
  const engine = cesdk.engine;

  await cesdk.createFromImage(image.full);
  const page = engine.scene.getCurrentPage();

  if (page == null) return;

  // Configure page behavior
  engine.block.setContentFillMode(page, 'Cover');
  engine.block.setScopeEnabled(page, 'fill/change', false);
  engine.block.setScopeEnabled(page, 'fill/changeType', false);
  engine.block.setScopeEnabled(page, 'stroke/change', false);
  engine.editor.setSetting('page/moveChildrenWhenCroppingFill', true);
  engine.block.setClipped(page, true);

  // Initially select the page
  engine.block.select(page);
  // highlight-scene-setup

  // ============================================================================
  // Force Crop Configuration
  // ============================================================================

  // highlight-force-crop
  // Remove all existing crop presets and add our custom one
  engine.asset.addLocalSource('ly.img.page.presets');
  engine.asset.addAssetToSource(
    'ly.img.page.presets',
    preset as Parameters<typeof engine.asset.addAssetToSource>[1]
  );

  // Apply force crop with the selected preset and mode
  await cesdk.ui.applyForceCrop(page, {
    mode: mode,
    presetId: preset.id,
    sourceId: 'ly.img.page.presets'
  });
  // highlight-force-crop
}
