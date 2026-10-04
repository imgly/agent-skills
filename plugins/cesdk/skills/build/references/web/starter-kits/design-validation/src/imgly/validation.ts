/**
 * Design Validation Functions
 *
 * Provides validation checks for design elements using CE.SDK engine APIs:
 * - Outside page detection
 * - Protruding elements
 * - Hidden text detection
 * - Image resolution quality
 *
 * This module handles only CESDK validation logic.
 * Presentation (display names, icons) is handled at the app level.
 */

import type { CreativeEngine } from '@cesdk/cesdk-js';

import type {
  BlockValidationResult,
  MeasureImage,
  ValidationState
} from './types';
import {
  getOutsideBlocks,
  getProtrudingBlocks,
  getPartiallyHiddenTexts,
  getImageBlockQuality
} from './utils';

/**
 * Validates blocks that are completely outside the page.
 */
export function validateOutsideBlocks(
  engine: CreativeEngine
): BlockValidationResult[] {
  return getOutsideBlocks(engine).map((blockId) => ({
    blockId,
    state: 'failed' as const,
    blockType: engine.block.getKind(blockId)
  }));
}

/**
 * Validates blocks that partially protrude from the page.
 */
export function validateProtrudingBlocks(
  engine: CreativeEngine
): BlockValidationResult[] {
  return getProtrudingBlocks(engine).map((blockId) => ({
    blockId,
    state: 'warning' as const,
    blockType: engine.block.getKind(blockId)
  }));
}

/**
 * Validates text blocks that may be obstructed by other blocks.
 */
export function validatePartiallyHiddenTexts(
  engine: CreativeEngine
): BlockValidationResult[] {
  return getPartiallyHiddenTexts(engine).map((blockId) => ({
    blockId,
    state: 'warning' as const,
    blockType: engine.block.getKind(blockId)
  }));
}

/**
 * Validates image blocks for resolution quality.
 * Pass `measureImage` to read image resolutions outside a browser.
 */
export async function validateLowResolution(
  engine: CreativeEngine,
  measureImage?: MeasureImage
): Promise<BlockValidationResult[]> {
  const allImageBlocks = engine.block.findByKind('image');
  const results = await Promise.all(
    allImageBlocks.map(async (blockId) => {
      const quality = await getImageBlockQuality(engine, blockId, measureImage);
      let state: ValidationState;
      if (quality < 0.7) {
        state = 'failed';
      } else if (quality >= 0.7 && quality < 1) {
        state = 'warning';
      } else {
        state = 'success';
      }
      return {
        blockId,
        state,
        blockType: engine.block.getKind(blockId)
      };
    })
  );
  return results;
}
