/**
 * CE.SDK Placeholders Video Editor - Initialization Module
 *
 * This module demonstrates the CE.SDK placeholder feature for video editing:
 * - Enable placeholder creation for template designers (Creator role)
 * - Placeholder regions can be defined for video clips, images, and other elements
 * - Adopters can fill placeholders with their own content
 *
 * @see https://img.ly/docs/cesdk/js/create-templates/add-dynamic-content/placeholders-d9ba8a/
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
  TextComponentAssetSource,
  TypefaceAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  UploadAssetSources
} from '@cesdk/cesdk-js/plugins';

import { AdvancedVideoEditorConfig } from './config/advanced-video-editor/plugin';
import { VideoEditorConfig } from './config/video-editor/plugin';

// ============================================================================
// Creator Editor Initialization
// ============================================================================

/**
 * Initialize the CE.SDK Placeholders Video Editor for Creator role.
 *
 * Creator mode enables:
 * - Advanced video editor configuration with full timeline control
 * - Dark theme for professional editing environment
 * - Placeholder creation features for defining template regions
 * - Inspector panel for detailed block properties
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initVideoPlaceholdersCreatorEditor(
  cesdk: CreativeEditorSDK
) {
  // ============================================================================
  // Configuration Plugin (Advanced Video Editor)
  // ============================================================================

  await cesdk.addPlugin(new AdvancedVideoEditorConfig());

  // ============================================================================
  // Theme Configuration (Runtime API)
  // ============================================================================

  cesdk.ui.setTheme('dark');

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await Promise.all([
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new CaptionPresetsAssetSource()),
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource()),

    cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
      })
    ),

    cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    ),

    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),

    cesdk.addPlugin(
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
    ),

    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource())
  ]);

  cesdk.engine.editor.setRole('Creator');
}

// ============================================================================
// Adopter Editor Initialization
// ============================================================================

/**
 * Initialize the CE.SDK Placeholders Video Editor for Adopter role.
 *
 * Adopter mode enables:
 * - Standard video editor configuration with simplified interface
 * - Light theme for content editing environment
 * - Placeholder content filling (placeholders created by Creator)
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initVideoPlaceholdersAdopterEditor(
  cesdk: CreativeEditorSDK
) {
  // ============================================================================
  // Configuration Plugin (Video Editor)
  // ============================================================================

  await cesdk.addPlugin(new VideoEditorConfig());

  // ============================================================================
  // Theme Configuration (Runtime API)
  // ============================================================================

  cesdk.ui.setTheme('light');

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await Promise.all([
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new CaptionPresetsAssetSource()),
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource()),

    cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
      })
    ),

    cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    ),

    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),

    cesdk.addPlugin(
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
    ),

    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource())
  ]);

  cesdk.engine.editor.setRole('Adopter');
}
