/**
 * Design Validation Utilities
 *
 * Utility functions for design element validation using CE.SDK engine APIs.
 * These are internal helpers used by the validation functions.
 */

import type { CreativeEngine } from '@cesdk/cesdk-js';

import type { BoundingBox, ImageSize, MeasureImage } from './types';

/** The engine's error code for an intersection that comes out empty. */
const EMPTY_SHAPE_ERROR = 'BLOCK.RESULT_EMPTY_SHAPE';

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
  engine: CreativeEngine,
  blockId: number
): BoundingBox {
  const x = engine.block.getGlobalBoundingBoxX(blockId);
  const y = engine.block.getGlobalBoundingBoxY(blockId);
  const width = engine.block.getGlobalBoundingBoxWidth(blockId);
  const height = engine.block.getGlobalBoundingBoxHeight(blockId);
  return [x, y, x + width, y + height];
}

/**
 * Gets all relevant blocks for validation (text and graphics).
 */
function getRelevantBlocks(engine: CreativeEngine): number[] {
  return [
    ...engine.block.findByType('text'),
    ...engine.block.findByType('graphic')
  ];
}

/**
 * Finds the parent page of a block.
 */
function findParentPage(engine: CreativeEngine, blockId: number): number {
  const parent = engine.block.getParent(blockId);
  if (parent !== null && engine.block.getKind(parent) === 'page') {
    return parent;
  }
  return parent !== null ? findParentPage(engine, parent) : blockId;
}

/**
 * Returns the BlockIds of all blocks that lay "above" the block.
 */
function getBlockIdsAbove(engine: CreativeEngine, blockId: number): number[] {
  const page = engine.block.findByType('page')[0];
  if (!page) return [];
  const sortedBlockIds = engine.block.getChildren(page);
  return sortedBlockIds.slice(sortedBlockIds.indexOf(blockId) + 1);
}

// ============================================================================
// Block Detection Functions
// ============================================================================

/**
 * Returns blocks that are completely outside the page.
 */
export function getOutsideBlocks(engine: CreativeEngine): number[] {
  return getRelevantBlocks(engine).filter((elementBlockId) => {
    const parentPage = findParentPage(engine, elementBlockId);
    const overlapWithPage = getElementOverlap(
      getElementBoundingBox(engine, elementBlockId),
      getElementBoundingBox(engine, parentPage)
    );
    return overlapWithPage === 0;
  });
}

/**
 * Returns blocks that partially protrude from the page (0 < overlap < 99%).
 */
export function getProtrudingBlocks(engine: CreativeEngine): number[] {
  const page = engine.block.findByType('page')[0];
  if (!page) return [];

  return getRelevantBlocks(engine).filter((elementBlockId) => {
    const overlapWithPage = getElementOverlap(
      getElementBoundingBox(engine, elementBlockId),
      getElementBoundingBox(engine, page)
    );
    return overlapWithPage > 0 && overlapWithPage < 0.99;
  });
}

/**
 * Returns all text blocks that may be obstructed by other blocks.
 */
export function getPartiallyHiddenTexts(engine: CreativeEngine): number[] {
  return engine.block.findByType('text').filter((elementBlockId) => {
    const elementsLayingAbove = getBlockIdsAbove(engine, elementBlockId);
    const elementBBOverlapping = elementsLayingAbove.filter(
      (blockId) =>
        // Skip groups since text inside groups shouldn't be considered hidden
        engine.block.getType(blockId) !== '//ly.img.ubq/group' &&
        getElementOverlap(
          getElementBoundingBox(engine, elementBlockId),
          getElementBoundingBox(engine, blockId)
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
        // The engine reports "no overlap" as a catalog error. Match the code,
        // not the message, which differs between engine builds.
        if ((e as { code?: string }).code !== EMPTY_SHAPE_ERROR) {
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
const resolutionCache: Record<string, ImageSize> = {};

/**
 * Reads an image's own resolution by loading it in the browser.
 */
export const measureImageInBrowser: MeasureImage = (url) =>
  new Promise((resolve, reject) => {
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
    img.onerror = () => reject(new Error(`Could not load ${url}.`));
    img.src = url;
  });

/**
 * Gets the image quality for a block.
 * Returns a value where < 0.7 is failed, 0.7-1 is warning, >= 1 is success.
 * Pass `measureImage` to read image resolutions outside a browser.
 */
export async function getImageBlockQuality(
  engine: CreativeEngine,
  imageId: number,
  measureImage: MeasureImage = measureImageInBrowser
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
    const { width, height } = await measureImage(imageURI);
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
