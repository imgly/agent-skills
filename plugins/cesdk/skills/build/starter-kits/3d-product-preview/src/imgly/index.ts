/**
 * CE.SDK Mockup Utilities
 *
 * Reusable utilities for building mockup editors with CE.SDK.
 *
 * @example
 * ```typescript
 * import { renderMockup, initHeadlessEngine, CLEAR_IMAGE } from './imgly';
 *
 * // Initialize engine
 * const engine = await initHeadlessEngine({ license: 'YOUR_LICENSE' });
 *
 * // Render mockup with placeholders
 * const result = await renderMockup(engine, 'mockup.scene', {
 *   'Image 1': designBlob,
 *   'Image 2': CLEAR_IMAGE
 * });
 * ```
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

// ============================================================================
// Re-exports
// ============================================================================

export { renderMockup, disposeMockupRenderer, CLEAR_IMAGE } from './mockup';

export type {
  HeadlessEngineConfig,
  Placeholders,
  RenderMockupOptions,
  RenderResult,
  SceneSource
} from './types';

// ============================================================================
// Editor Initialization
// ============================================================================

/**
 * Initializes CE.SDK for the main design editor (Creator role).
 */
export async function init3dProductPreviewEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  await cesdk.addPlugin(new DesignEditorConfig());

  // Asset sources
  await Promise.all([
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    ),
    cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    )
  ]);

  cesdk.ui.setTheme('light');
  cesdk.engine.editor.setRole('Creator');
}
