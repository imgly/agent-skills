/**
 * Getty Images Asset Source Plugin
 *
 * This plugin integrates Getty Images stock photos as an asset source in CE.SDK.
 * It provides premium stock photos that can be searched and browsed.
 *
 * ## Setup Requirements
 *
 * 1. Set up a Getty Images API proxy server that:
 *    - Handles authentication with Getty Images API
 *    - Returns data in CE.SDK AssetResult format
 * 2. Set the proxy URL via plugin options or VITE_GETTY_IMAGES_PROXY_URL environment variable
 *
 * @see https://www.gettyimages.com/
 * @see https://developer.gettyimages.com/
 * @see https://img.ly/docs/cesdk/js/custom-asset-sources/
 */

import type {
  AssetSource,
  AssetQueryData,
  AssetResult,
  AssetsQueryResult,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

// ============================================================================
// Types
// ============================================================================

/**
 * Configuration options for the Getty Images Asset Source Plugin.
 */
export interface GettyImagesAssetSourcePluginOptions {
  /**
   * The URL of your Getty Images API proxy server.
   *
   * The proxy server should:
   * - Handle Getty Images API authentication
   * - Accept query parameters: query, page, perPage
   * - Return data in CE.SDK AssetsQueryResult format
   *
   * Can also be set via VITE_GETTY_IMAGES_PROXY_URL environment variable.
   */
  proxyUrl?: string;
}

/**
 * Empty result constant for error cases.
 */
const EMPTY_RESULT: AssetsQueryResult<AssetResult> = {
  assets: [],
  total: 0,
  currentPage: 0,
  nextPage: undefined
};

// ============================================================================
// Asset Source Factory
// ============================================================================

// Track whether we've shown the proxy URL warning
let hasShownProxyUrlWarning = false;

/**
 * Create a Getty Images asset source with the given proxy URL.
 *
 * @param proxyUrl - The Getty Images API proxy URL
 * @returns AssetSource configuration for CE.SDK
 */
// highlight-createAssetSource
/**
 * Create a Getty Images asset source with the given proxy URL.
 *
 * @param proxyUrl - The Getty Images API proxy URL
 * @returns AssetSource configuration for CE.SDK
 */
function createGettyImagesAssetSource(proxyUrl: string): AssetSource {
  /**
   * Find Getty Images assets based on query parameters.
   */
  async function findGettyImagesAssets(
    queryData: AssetQueryData
  ): Promise<AssetsQueryResult<AssetResult>> {
    // Show warning if proxy URL is not configured
    if (proxyUrl === '' && !hasShownProxyUrlWarning) {
      hasShownProxyUrlWarning = true;
      // eslint-disable-next-line no-alert
      alert(
        'Please provide your Getty Images API proxy URL.\n\n' +
          'Set up a proxy server to handle Getty Images API authentication and pass the URL to the GettyImagesAssetSourcePlugin options.'
      );
      return EMPTY_RESULT;
    }

    if (!proxyUrl) {
      // eslint-disable-next-line no-console
      console.error(
        'Getty Images proxy URL not configured. Please set VITE_GETTY_IMAGES_PROXY_URL environment variable.'
      );
      return EMPTY_RESULT;
    }

    try {
      // highlight-pagination
      // Getty Images uses 1-based page numbering
      // Convert from CE.SDK's 0-based pagination
      const gettyPage = queryData.page + 1;
      // highlight-pagination

      // highlight-proxy-request
      // Build query parameters for proxy request
      const params = new URLSearchParams({
        query: queryData.query || 'business',
        page: gettyPage.toString(),
        perPage: queryData.perPage.toString()
      });

      // Call the proxy server which handles Getty Images API authentication
      // and returns data already formatted for CE.SDK
      const response = await fetch(`${proxyUrl}?${params}`);
      // highlight-proxy-request

      // highlight-response-handling
      if (!response.ok) {
        throw new Error(`Getty API error: ${response.statusText}`);
      }

      // The proxy already returns data in CE.SDK format
      const data = (await response.json()) as AssetsQueryResult<AssetResult>;
      return data;
      // highlight-response-handling
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Getty Images API error:', error);
      return EMPTY_RESULT;
    }
  }

  return {
    id: 'gettyImagesImageAssets',
    findAssets: findGettyImagesAssets,
    // highlight-credits-license
    credits: {
      name: 'Getty Images',
      url: 'https://www.gettyimages.com/'
    },
    license: {
      name: 'Getty Images Content License Agreement',
      url: 'https://www.gettyimages.com/eula'
    }
    // highlight-credits-license
  };
}
// highlight-createAssetSource

// ============================================================================
// Plugin Class
// ============================================================================

/**
 * Getty Images Asset Source Plugin
 *
 * This plugin adds the Getty Images library to CE.SDK, replacing the default
 * image library with premium stock photos from Getty Images.
 *
 * @example
 * ```typescript
 * import { GettyImagesAssetSourcePlugin } from './plugins/getty-images';
 *
 * // Add the plugin to CE.SDK with proxy URL
 * await cesdk.addPlugin(new GettyImagesAssetSourcePlugin({
 *   proxyUrl: 'https://your-proxy-server.com/getty-api'
 * }));
 *
 * // Or use environment variable (VITE_GETTY_IMAGES_PROXY_URL)
 * await cesdk.addPlugin(new GettyImagesAssetSourcePlugin());
 * ```
 */
// highlight-plugin-class
export class GettyImagesAssetSourcePlugin implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   */
  name = 'cesdk-getty-images-asset-source';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Plugin options.
   */
  private options: GettyImagesAssetSourcePluginOptions;

  /**
   * Create a new Getty Images Asset Source Plugin.
   *
   * @param options - Plugin configuration options
   */
  constructor(options: GettyImagesAssetSourcePluginOptions = {}) {
    this.options = options;
  }

  /**
   * Initialize the Getty Images asset source plugin.
   *
   * This method:
   * 1. Resolves the proxy URL from options or environment variable
   * 2. Adds the Getty Images asset source to the engine
   * 3. Creates a dock entry for Getty Images
   * 4. Configures replace behavior to use Getty Images for image fills
   * 5. Sets up translations for the panel label
   *
   * @param ctx - The editor plugin context
   */
  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) return;

    // Use proxy URL from options (env vars should be read by the entry point)
    const proxyUrl = this.options.proxyUrl ?? '';

    // Add translation for the panel label
    cesdk.i18n.setTranslations({
      en: {
        'libraries.gettyImagesImageAssets.label': 'Getty Images'
      }
    });

    // Create and add the asset source
    const gettyImagesAssetSource = createGettyImagesAssetSource(proxyUrl);
    cesdk.engine.asset.addSource(gettyImagesAssetSource);

    // Add asset library entry for the panel
    cesdk.ui.addAssetLibraryEntry({
      id: 'gettyImagesImageAssets',
      sourceIds: ['gettyImagesImageAssets'],
      previewLength: 3,
      gridItemHeight: 'auto',
      gridBackgroundType: 'cover',
      gridColumns: 2
    });

    // Configure dock to show Getty Images instead of default images
    const currentDockOrder = cesdk.ui.getDockOrder();
    cesdk.ui.setDockOrder(
      currentDockOrder.map((component) => {
        // Replace the default image dock entry with Getty Images
        if (component.key === 'ly.img.image') {
          return {
            id: 'ly.img.assetLibrary.dock',
            key: 'gettyImagesImageAssets',
            label: 'libraries.gettyImagesImageAssets.label',
            entries: ['gettyImagesImageAssets']
          };
        }
        return component;
      })
    );

    // Configure replace behavior to use Getty Images for image fills
    cesdk.ui.setReplaceAssetLibraryEntries(
      ({ selectedBlocks, defaultEntryIds, replaceIntent }) => {
        if (
          replaceIntent === 'fill' &&
          selectedBlocks.length === 1 &&
          selectedBlocks[0].fillType === '//ly.img.ubq/fill/image'
        ) {
          return ['gettyImagesImageAssets'];
        }
        return defaultEntryIds;
      }
    );
  }
}
// highlight-plugin-class
