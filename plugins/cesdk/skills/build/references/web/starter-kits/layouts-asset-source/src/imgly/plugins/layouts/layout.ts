/**
 * Layouts Asset Source Plugin
 *
 * This plugin provides a custom layouts asset source that allows users to:
 * - Choose from pre-designed layout templates
 * - Apply layouts to existing pages while preserving content
 * - Swap between different layouts dynamically
 *
 * @see https://img.ly/docs/cesdk/js/import-media/asset-panel/customize-c9a4de/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import { applyLayoutToPage } from './applyLayout';

// Import the layouts JSON content
import LAYOUT_ASSETS from './custom-layouts.json';
import { DEMO_ASSETS_BASE_URL } from '../../demo-assets';
export { DEMO_ASSETS_BASE_URL };

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
const DEFAULT_BASE_URL = `${DEMO_ASSETS_BASE_URL}/assets`;

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
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: LAYOUTS_SOURCE_ID,
        label: 'libraries.ly.img.layouts.label',
        icon: ({ iconSize }) =>
          iconSize === 'normal'
            ? `${DEMO_ASSETS_BASE_URL}/assets/collage-small.svg`
            : `${DEMO_ASSETS_BASE_URL}/assets/collage-large.svg`,
        entries: [LAYOUTS_SOURCE_ID]
      },
      'ly.img.separator',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
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
