/**
 * Layouts Asset Source Plugin
 *
 * This plugin provides a custom layouts asset source that allows users to:
 * - Choose from pre-designed layout templates
 * - Apply layouts to existing pages while preserving content
 * - Swap between different layouts dynamically
 *
 * @see https://img.ly/docs/cesdk/js/custom-asset-sources/
 */

import type {
  AssetResult,
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

// Import the layouts JSON content
import LAYOUT_ASSETS from './CustomLayouts.json';

import { resolveAssetPath } from '../../resolveAssetPath';

// ============================================================================
// Types
// ============================================================================

/**
 * Configuration options for the Layouts Asset Source Plugin.
 */
export interface LayoutsAssetSourcePluginOptions {
  /**
   * Base URL for layout assets (scene files and thumbnails).
   * Defaults to IMG.LY's CDN for the layouts demo.
   */
  baseURL?: string;

  /**
   * Whether to add undo steps when applying layouts.
   * @default true
   */
  addUndoStep?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const LAYOUTS_SOURCE_ID = 'ly.img.layouts';
const DEFAULT_BASE_URL = resolveAssetPath('/assets');

// ============================================================================
// Layout Application Logic
// ============================================================================

/**
 * Applies a layout asset to the current page, preserving existing content.
 *
 * This function:
 * 1. Loads the layout scene from the asset URI
 * 2. Replaces the current page's structure with the layout
 * 3. Copies text and image content from the old page to the new layout
 */
// highlight-apply-layout
async function applyLayoutToPage(
  engine: CreativeEngine,
  asset: AssetResult,
  addUndoStep: boolean
): Promise<number> {
  const scopeBefore = engine.editor.getGlobalScope('lifecycle/destroy');
  engine.editor.setGlobalScope('lifecycle/destroy', 'Allow');

  const page = engine.scene.getCurrentPage();
  if (!page) {
    throw new Error('No current page found');
  }

  // Deselect all blocks
  engine.block
    .findAllSelected()
    .forEach((block) => engine.block.setSelected(block, false));

  // Load the layout scene
  const sceneString = await fetch(asset.meta.uri as string).then((response) =>
    response.text()
  );
  const blocks = await engine.block.loadFromString(sceneString);
  const layoutPage = blocks[0];
  const oldPage = engine.block.duplicate(page);

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

  // Cleanup
  engine.block.destroy(oldPage);
  engine.block.destroy(layoutPage);
  engine.editor.setGlobalScope('lifecycle/destroy', scopeBefore);

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

    if (engine.block.supportsPlaceholderBehavior(fromBlock)) {
      engine.block.setPlaceholderBehaviorEnabled(
        toBlock,
        engine.block.isPlaceholderBehaviorEnabled(fromBlock)
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
function visuallySortBlocks(
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

// ============================================================================
// Plugin Class
// ============================================================================

/**
 * Layouts Asset Source Plugin
 *
 * This plugin adds a custom layouts panel to CE.SDK, allowing users to
 * choose from pre-designed layout templates and apply them to pages.
 *
 * @example
 * ```typescript
 * import { LayoutsAssetSourcePlugin } from './plugins/layouts';
 *
 * await cesdk.addPlugin(new LayoutsAssetSourcePlugin());
 * ```
 */
// highlight-plugin-class
export class LayoutsAssetSourcePlugin implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   */
  name = 'cesdk-layouts-asset-source';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Plugin options.
   */
  private options: LayoutsAssetSourcePluginOptions;

  /**
   * Unsubscribe function for the apply middleware.
   */
  private unsubscribeMiddleware?: VoidFunction;

  /**
   * Create a new Layouts Asset Source Plugin.
   *
   * @param options - Plugin configuration options
   */
  constructor(options: LayoutsAssetSourcePluginOptions = {}) {
    this.options = options;
  }

  /**
   * Initialize the layouts asset source plugin.
   */
  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) return;

    const baseURL = this.options.baseURL ?? DEFAULT_BASE_URL;
    const addUndoStep = this.options.addUndoStep ?? true;

    // highlight-load-assets
    // Load the layouts asset source using the engine API
    // The API handles {{base_url}} replacement automatically
    await cesdk.engine.asset.addLocalAssetSourceFromJSONString(
      JSON.stringify(LAYOUT_ASSETS),
      baseURL
    );
    // highlight-load-assets

    // highlight-apply-middleware
    // Register middleware to intercept layout asset application
    this.unsubscribeMiddleware = cesdk.engine.asset.registerApplyMiddleware(
      async (sourceId, assetResult, apply) => {
        // Only handle layouts from this source
        if (sourceId !== LAYOUTS_SOURCE_ID) {
          return apply(sourceId, assetResult);
        }

        // Apply the layout to the current page
        return applyLayoutToPage(cesdk.engine, assetResult, addUndoStep);
      }
    );
    // highlight-apply-middleware

    // Add translation for the panel label
    cesdk.i18n.setTranslations({
      en: {
        'libraries.ly.img.layouts.label': 'Layouts'
      }
    });

    // Add asset library entry for the panel
    cesdk.ui.addAssetLibraryEntry({
      id: LAYOUTS_SOURCE_ID,
      sourceIds: [LAYOUTS_SOURCE_ID],
      previewLength: 2,
      gridColumns: 2,
      gridItemHeight: 'square',
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain'
    });

    // Configure dock order with Layouts as the first entry
    cesdk.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: LAYOUTS_SOURCE_ID,
        label: 'libraries.ly.img.layouts.label',
        icon: ({ iconSize }) =>
          iconSize === 'normal'
            ? resolveAssetPath('/assets/collage-small.svg')
            : resolveAssetPath('/assets/collage-large.svg'),
        entries: [LAYOUTS_SOURCE_ID]
      },
      'ly.img.separator',
      ...cesdk.ui
        .getDockOrder()
        .filter(({ key }) => !['ly.img.template'].includes(key as string))
    ]);
  }

  /**
   * Clean up when the plugin is removed.
   */
  dispose(): void {
    this.unsubscribeMiddleware?.();
  }
}
// highlight-plugin-class
