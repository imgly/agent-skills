/**
 * CE.SDK Engine Utilities
 */

import type { CreativeEngine } from '@cesdk/cesdk-js';

import type { ModerationState } from './types';

/**
 * Converts a confidence percentage to a moderation state.
 */
export function percentageToState(percentage: number): ModerationState {
  if (percentage > 0.8) {
    return 'failed';
  } else if (percentage > 0.4) {
    return 'warning';
  } else {
    return 'success';
  }
}

/**
 * Gets the image URL from a block's fill.
 */
export function getImageUrl(
  engine: CreativeEngine,
  blockId: number
): string | null {
  const imageFill = engine.block.getFill(blockId);
  const fillImageURI = engine.block.getString(
    imageFill,
    'fill/image/imageFileURI'
  );
  if (fillImageURI) {
    return fillImageURI;
  }

  // Check source set
  const sourceSet = engine.block.getSourceSet(
    imageFill,
    'fill/image/sourceSet'
  );
  if (sourceSet && sourceSet.length) {
    return sourceSet[0].uri;
  }
  return null;
}

/**
 * Selects blocks by their IDs.
 */
export function selectBlocks(
  engine: CreativeEngine,
  blockIds: number[]
): number[] {
  engine.block
    .findAllSelected()
    .forEach((block) => engine.block.setSelected(block, false));
  blockIds.forEach((block) => engine.block.setSelected(block, true));
  return blockIds;
}
