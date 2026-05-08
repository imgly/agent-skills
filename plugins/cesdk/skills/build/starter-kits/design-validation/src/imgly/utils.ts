/**
 * Design Validation Utilities
 *
 * Utility functions for design element validation using CE.SDK engine APIs.
 * These are internal helpers used by the validation functions.
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { BoundingBox } from './types';

// ============================================================================
// Bounding Box Utilities
// ============================================================================

/**
 * Calculates the overlap of two elements as percentage of the first element.
 */
function getElementOverlap(
  [aX1, aY1, aX2, aY2]: BoundingBox,
  [bX1, bY1, bX2, bY2]: BoundingBox
): number {
  const overlapWidth = Math.max(0, Math.min(aX2, bX2) - Math.max(aX1, bX1));
  const overlapHeight = Math.max(0, Math.min(aY2, bY2) - Math.max(aY1, bY1));
  const areaA = (aX2 - aX1) * (aY2 - aY1);
  return areaA > 0 ? (overlapWidth * overlapHeight) / areaA : 0;
}

/**
 * Gets the global bounding box of a block.
 */
function getElementBoundingBox(
  cesdk: CreativeEditorSDK,
  blockId: number
): BoundingBox {
  const x = cesdk.engine.block.getGlobalBoundingBoxX(blockId);
  const y = cesdk.engine.block.getGlobalBoundingBoxY(blockId);
  const width = cesdk.engine.block.getGlobalBoundingBoxWidth(blockId);
  const height = cesdk.engine.block.getGlobalBoundingBoxHeight(blockId);
  return [x, y, x + width, y + height];
}

/**
 * Gets all relevant blocks for validation (text and graphics).
 */
function getRelevantBlocks(cesdk: CreativeEditorSDK): number[] {
  return [
    ...cesdk.engine.block.findByType('text'),
    ...cesdk.engine.block.findByType('graphic')
  ];
}

/**
 * Finds the parent page of a block.
 */
function findParentPage(cesdk: CreativeEditorSDK, blockId: number): number {
  const parent = cesdk.engine.block.getParent(blockId);
  if (parent !== null && cesdk.engine.block.getKind(parent) === 'page') {
    return parent;
  }
  return parent !== null ? findParentPage(cesdk, parent) : blockId;
}

/**
 * Returns the BlockIds of all blocks that lay "above" the block.
 */
function getBlockIdsAbove(cesdk: CreativeEditorSDK, blockId: number): number[] {
  const page = cesdk.engine.block.findByType('page')[0];
  if (!page) return [];
  const sortedBlockIds = cesdk.engine.block.getChildren(page);
  return sortedBlockIds.slice(sortedBlockIds.indexOf(blockId) + 1);
}

// ============================================================================
// Block Detection Functions
// ============================================================================

/**
 * Returns blocks that are completely outside the page.
 */
export function getOutsideBlocks(cesdk: CreativeEditorSDK): number[] {
  return getRelevantBlocks(cesdk).filter((elementBlockId) => {
    const parentPage = findParentPage(cesdk, elementBlockId);
    const overlapWithPage = getElementOverlap(
      getElementBoundingBox(cesdk, elementBlockId),
      getElementBoundingBox(cesdk, parentPage)
    );
    return overlapWithPage === 0;
  });
}

/**
 * Returns blocks that partially protrude from the page (0 < overlap < 99%).
 */
export function getProtrudingBlocks(cesdk: CreativeEditorSDK): number[] {
  const page = cesdk.engine.block.findByType('page')[0];
  if (!page) return [];

  return getRelevantBlocks(cesdk).filter((elementBlockId) => {
    const overlapWithPage = getElementOverlap(
      getElementBoundingBox(cesdk, elementBlockId),
      getElementBoundingBox(cesdk, page)
    );
    return overlapWithPage > 0 && overlapWithPage < 0.99;
  });
}

/**
 * Returns all text blocks that may be obstructed by other blocks.
 */
export function getPartiallyHiddenTexts(cesdk: CreativeEditorSDK): number[] {
  const engine = cesdk.engine;
  return engine.block.findByType('text').filter((elementBlockId) => {
    const elementsLayingAbove = getBlockIdsAbove(cesdk, elementBlockId);
    const elementBBOverlapping = elementsLayingAbove.filter(
      (blockId) =>
        // Skip groups since text inside groups shouldn't be considered hidden
        cesdk.engine.block.getType(blockId) !== '//ly.img.ubq/group' &&
        getElementOverlap(
          getElementBoundingBox(cesdk, elementBlockId),
          getElementBoundingBox(cesdk, blockId)
        ) > 0
    );

    // Now check if they are really overlapping by using intersection
    return elementBBOverlapping.some((blockId) => {
      // Duplicate both elements
      const duplicatedText = engine.block.duplicate(elementBlockId);
      const duplicatedBlockId = engine.block.duplicate(blockId);

      // Force layouting using setRotation
      engine.block.setRotation(
        duplicatedText,
        engine.block.getRotation(duplicatedText)
      );

      let hasIntersection = false;
      try {
        const union = engine.block.combine(
          [duplicatedText, duplicatedBlockId],
          'Intersection'
        );
        if (union && engine.block.isValid(union)) {
          hasIntersection = true;
          engine.block.destroy(union);
        }
      } catch (e) {
        const message = (e as Error).message;
        if (!message.includes('Result is an empty shape.')) {
          throw e;
        }
      }

      if (engine.block.isValid(duplicatedBlockId)) {
        engine.block.destroy(duplicatedBlockId);
      }
      if (engine.block.isValid(duplicatedText)) {
        engine.block.destroy(duplicatedText);
      }

      return hasIntersection;
    });
  });
}

// ============================================================================
// Image Resolution Utilities
// ============================================================================

/**
 * Transform design units to pixels.
 */
function transformToPixel(
  fromUnit: string,
  fromValue: number,
  dpi: number
): number {
  if (fromUnit === 'Pixel') {
    return fromValue;
  }
  if (fromUnit === 'Millimeter') {
    return (fromValue * dpi) / 25.4;
  }
  // Inch
  return fromValue * dpi;
}

// Simple cache for image resolution
const resolutionCache: Record<string, { width: number; height: number }> = {};

/**
 * Fetches the original image resolution.
 */
function fetchImageResolution(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (resolutionCache[url]) {
      resolve(resolutionCache[url]);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const imageResolution = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      resolutionCache[url] = imageResolution;
      resolve(imageResolution);
    };
    img.onerror = () => reject();
    img.src = url;
  });
}

/**
 * Gets the image quality for a block.
 * Returns a value where < 0.7 is failed, 0.7-1 is warning, >= 1 is success.
 */
export async function getImageBlockQuality(
  engine: CreativeEditorSDK['engine'],
  imageId: number
): Promise<number> {
  const frameWidthDesignUnit = engine.block.getFrameWidth(imageId);
  const frameHeightDesignUnit = engine.block.getFrameHeight(imageId);

  const scene = engine.scene.get();
  if (!scene) return 1;

  const pageUnit = engine.block.getEnum(scene, 'scene/designUnit');
  const pageDPI = engine.block.getFloat(scene, 'scene/dpi');

  const frameWidth = transformToPixel(pageUnit, frameWidthDesignUnit, pageDPI);
  const frameHeight = transformToPixel(
    pageUnit,
    frameHeightDesignUnit,
    pageDPI
  );

  const fill = engine.block.getFill(imageId);
  const imageURI = engine.block.getString(fill, 'fill/image/imageFileURI');
  if (!imageURI) return 1;

  try {
    const { width, height } = await fetchImageResolution(imageURI);
    const scaleY = engine.block.getCropScaleY(imageId) || 1;

    // Calculate pixel density
    const originalRatios = {
      width: frameWidth / (width / scaleY),
      height: frameHeight / (height / scaleY)
    };
    const coverRatio = Math.max(originalRatios.width, originalRatios.height);
    return 1 / coverRatio;
  } catch {
    return 1;
  }
}
