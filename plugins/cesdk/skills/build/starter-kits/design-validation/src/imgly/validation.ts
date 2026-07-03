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

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { BlockValidationResult, ValidationState } from './types';
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
  cesdk: CreativeEditorSDK
): BlockValidationResult[] {
  return getOutsideBlocks(cesdk).map((blockId) => ({
    blockId,
    state: 'failed' as const,
    blockType: cesdk.engine.block.getKind(blockId)
  }));
}

/**
 * Validates blocks that partially protrude from the page.
 */
export function validateProtrudingBlocks(
  cesdk: CreativeEditorSDK
): BlockValidationResult[] {
  return getProtrudingBlocks(cesdk).map((blockId) => ({
    blockId,
    state: 'warning' as const,
    blockType: cesdk.engine.block.getKind(blockId)
  }));
}

/**
 * Validates text blocks that may be obstructed by other blocks.
 */
export function validatePartiallyHiddenTexts(
  cesdk: CreativeEditorSDK
): BlockValidationResult[] {
  return getPartiallyHiddenTexts(cesdk).map((blockId) => ({
    blockId,
    state: 'warning' as const,
    blockType: cesdk.engine.block.getKind(blockId)
  }));
}

/**
 * Validates image blocks for resolution quality.
 */
export async function validateLowResolution(
  cesdk: CreativeEditorSDK
): Promise<BlockValidationResult[]> {
  const allImageBlocks = cesdk.engine.block.findByKind('image');
  const results = await Promise.all(
    allImageBlocks.map(async (blockId) => {
      const quality = await getImageBlockQuality(cesdk.engine, blockId);
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
        blockType: cesdk.engine.block.getKind(blockId)
      };
    })
  );
  return results;
}
