/**
 * CE.SDK Multi-Image Generation - Utility Functions
 *
 * Common utility functions used across the imgly module.
 */

import type CreativeEngine from '@cesdk/engine';

import type { RgbaColor } from './types';

/**
 * Convert hex color string to RGBA object.
 */
export function hexToRgba(hex: string): RgbaColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: 1
  };
}

/**
 * Replace an image block's source by block name.
 */
export function replaceImageByName(
  engine: CreativeEngine,
  blockName: string,
  imageUrl: string
): void {
  const [block] = engine.block.findByName(blockName);
  if (block == null || !engine.block.supportsFill(block)) return;

  const fillBlock = engine.block.getFill(block);
  if (engine.block.getType(fillBlock) !== '//ly.img.ubq/fill/image') return;

  engine.block.setString(fillBlock, 'fill/image/imageFileURI', imageUrl);
  engine.block.resetCrop(block);
  if (engine.block.supportsContentFillMode(block)) {
    engine.block.setContentFillMode(block, 'Cover');
  }
}

/**
 * Export current scene as an image blob URL.
 */
export async function exportSceneAsImage(
  engine: CreativeEngine,
  mimeType: 'image/png' | 'image/jpeg' = 'image/jpeg'
): Promise<string | null> {
  const scene = engine.scene.get();
  if (scene == null) return null;

  const blob = await engine.block.export(scene, { mimeType });
  return URL.createObjectURL(blob);
}
