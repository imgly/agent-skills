/**
 * Layout Application Logic
 *
 * Runs against any CE.SDK engine and needs no editor UI.
 *
 * @see https://img.ly/docs/cesdk/js/import-media/asset-panel/customize-c9a4de/
 */

import type { AssetResult, CreativeEngine } from '@cesdk/cesdk-js';

/**
 * Applies a layout asset to the current page, preserving existing content.
 *
 * This function:
 * 1. Loads the layout scene from the asset URI
 * 2. Replaces the current page's structure with the layout
 * 3. Copies text and image content from the old page to the new layout
 */
// highlight-apply-layout
export async function applyLayoutToPage(
  engine: CreativeEngine,
  asset: AssetResult,
  addUndoStep: boolean
): Promise<number> {
  const page = engine.scene.getCurrentPage();
  if (!page) {
    throw new Error('No current page found');
  }

  const scopeBefore = engine.editor.getGlobalScope('lifecycle/destroy');
  engine.editor.setGlobalScope('lifecycle/destroy', 'Allow');

  let oldPage: number | undefined;
  let layoutPage: number | undefined;
  try {
    // Deselect all blocks
    engine.block
      .findAllSelected()
      .forEach((block) => engine.block.setSelected(block, false));

    // Load the layout scene
    const sceneString = await fetch(asset.meta.uri as string).then((response) =>
      response.text()
    );
    const blocks = await engine.block.loadFromString(sceneString);
    layoutPage = blocks[0];
    if (layoutPage == null) {
      throw new Error('The layout scene holds no page');
    }
    oldPage = engine.block.duplicate(page);

    // Delete all children from the current page
    engine.block.getChildren(page).forEach((child) => {
      engine.block.destroy(child);
    });

    // Copy all children from layout page to current page
    engine.block.getChildren(layoutPage).forEach((child) => {
      engine.block.insertChild(
        page,
        child,
        engine.block.getChildren(page).length
      );
    });

    // Copy content (images/text) from old page to new layout
    copyAssets(engine, oldPage, page);
  } finally {
    // Cleanup on every exit, so a layout that fails half way leaves neither a
    // stray page behind nor destruction switched on for the whole scene.
    for (const block of [oldPage, layoutPage]) {
      if (block != null) {
        engine.block.destroy(block);
      }
    }
    engine.editor.setGlobalScope('lifecycle/destroy', scopeBefore);
  }

  if (addUndoStep) {
    engine.editor.addUndoStep();
  }

  return page;
}
// highlight-apply-layout

/**
 * Copies image files and text block contents from one page to another.
 */
function copyAssets(
  engine: CreativeEngine,
  fromPageId: number,
  toPageId: number
): void {
  const fromChildren = visuallySortBlocks(
    engine,
    getChildrenTree(engine, fromPageId).flat()
  );
  const textsOnFromPage = fromChildren.filter((childId) =>
    engine.block.getType(childId).includes('text')
  );
  const imagesOnFromPage = fromChildren.filter(
    (childId) => engine.block.getKind(childId) === 'image'
  );

  const toChildren = visuallySortBlocks(
    engine,
    getChildrenTree(engine, toPageId).flat()
  );
  const textsOnToPage = toChildren.filter((childId) =>
    engine.block.getType(childId).includes('text')
  );
  const imagesOnToPage = toChildren.filter(
    (childId) => engine.block.getKind(childId) === 'image'
  );

  // Copy text content
  for (
    let index = 0;
    index < textsOnToPage.length && index < textsOnFromPage.length;
    index++
  ) {
    const fromBlock = textsOnFromPage[index];
    const toBlock = textsOnToPage[index];
    const fromText = engine.block.getString(fromBlock, 'text/text');
    const fromFontFileUri = engine.block.getString(
      fromBlock,
      'text/fontFileUri'
    );

    try {
      const fromTypeface = engine.block.getTypeface(fromBlock);
      engine.block.setFont(toBlock, fromFontFileUri, fromTypeface);
    } catch {
      // Ignore font errors
    }

    const fromTextFillColor = engine.block.getColor(
      fromBlock,
      'fill/solid/color'
    );
    engine.block.setString(toBlock, 'text/text', fromText);
    engine.block.setColor(toBlock, 'fill/solid/color', fromTextFillColor);
  }

  // Copy image content
  for (
    let index = 0;
    index < imagesOnToPage.length && index < imagesOnFromPage.length;
    index++
  ) {
    const fromBlock = imagesOnFromPage[index];
    const toBlock = imagesOnToPage[index];
    const fromImageFill = engine.block.getFill(fromBlock);
    const toImageFill = engine.block.getFill(toBlock);
    const fromImageFileUri = engine.block.getString(
      fromImageFill,
      'fill/image/imageFileURI'
    );
    engine.block.setString(
      toImageFill,
      'fill/image/imageFileURI',
      fromImageFileUri
    );

    // Copy image source sets
    const fromImageSourceSets = engine.block.getSourceSet(
      fromImageFill,
      'fill/image/sourceSet'
    );
    engine.block.setSourceSet(
      toImageFill,
      'fill/image/sourceSet',
      fromImageSourceSets
    );

    // The placeholder state of an image lives on its fill, not on the block.
    if (engine.block.supportsPlaceholderBehavior(fromImageFill)) {
      engine.block.setPlaceholderBehaviorEnabled(
        toImageFill,
        engine.block.isPlaceholderBehaviorEnabled(fromImageFill)
      );
    }

    engine.block.resetCrop(toBlock);
  }
}

function getChildrenTree(engine: CreativeEngine, block: number): number[] {
  const children = engine.block.getChildren(block);
  return [
    ...children,
    ...children.map((childBlock) => getChildrenTree(engine, childBlock)).flat()
  ];
}

/**
 * Sorts blocks from top to bottom, left to right based on coordinates.
 */
export function visuallySortBlocks(
  engine: CreativeEngine,
  blocks: number[]
): number[] {
  const blocksWithCoordinates = blocks
    .map((block) => ({
      block,
      coordinates: [
        Math.round(engine.block.getPositionX(block)),
        Math.round(engine.block.getPositionY(block))
      ] as [number, number]
    }))
    .sort(({ coordinates: [X1, Y1] }, { coordinates: [X2, Y2] }) => {
      if (Y1 === Y2) return X1 - X2;
      return Y1 - Y2;
    });
  return blocksWithCoordinates.map(({ block }) => block);
}
