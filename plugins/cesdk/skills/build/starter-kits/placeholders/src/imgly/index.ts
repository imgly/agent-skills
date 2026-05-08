/**
 * CE.SDK Placeholders Editor - Initialization Module
 *
 * This module demonstrates the CE.SDK placeholder feature for design editing:
 * - Enable placeholder creation for template designers (Creator role)
 * - Placeholder regions can be defined for images, text, and other elements
 * - Adopters can fill placeholders with their own content
 *
 * @see https://img.ly/docs/cesdk/js/features/placeholders/
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
  PremiumTemplatesAssetSource,
  StickerAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  UploadAssetSources
} from '@cesdk/cesdk-js/plugins';

import { AdvancedEditorConfig } from './config/advanced-design-editor/plugin';
import { DesignEditorConfig } from './config/design-editor/plugin';

// ============================================================================
// Creator Editor Initialization
// ============================================================================

/**
 * Initialize the CE.SDK Placeholders Editor for Creator role.
 *
 * Creator mode enables:
 * - Advanced design editor configuration with full editing control
 * - Dark theme for professional editing environment
 * - Placeholder creation features for defining template regions
 * - Inspector panel for detailed block properties
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initPlaceholdersCreatorEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin (Advanced Design Editor)
  // ============================================================================

  await cesdk.addPlugin(new AdvancedEditorConfig());

  // ============================================================================
  // Theme Configuration (Runtime API)
  // ============================================================================

  cesdk.ui.setTheme('dark');

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());

  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());

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
        'ly.img.page.presets.din.*',
        'ly.img.page.presets.us.*'
      ]
    })
  );

  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );

  cesdk.engine.editor.setRole('Creator');
}

// ============================================================================
// Adopter Editor Initialization
// ============================================================================

/**
 * Initialize the CE.SDK Placeholders Editor for Adopter role.
 *
 * Adopter mode enables:
 * - Standard design editor configuration with simplified interface
 * - Light theme for content editing environment
 * - Placeholder content filling (placeholders created by Creator)
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initPlaceholdersAdopterEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin (Design Editor)
  // ============================================================================

  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Theme Configuration (Runtime API)
  // ============================================================================

  cesdk.ui.setTheme('light');

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());

  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());

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
        'ly.img.page.presets.din.*',
        'ly.img.page.presets.us.*'
      ]
    })
  );

  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );

  cesdk.engine.editor.setRole('Adopter');
}
