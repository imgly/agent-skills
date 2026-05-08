/**
 * Pexels Asset Source Plugin
 *
 * This plugin integrates Pexels stock photos as an asset source in CE.SDK.
 * It provides free, high-quality photos that can be searched and browsed.
 *
 * ## Setup Requirements
 *
 * 1. Get a free Pexels API key at https://www.pexels.com/api/
 * 2. Set the API key via plugin options or VITE_PEXELS_API_KEY environment variable
 *
 * @see https://www.pexels.com/
 * @see https://www.pexels.com/api/documentation/
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
 * Configuration options for the Pexels Asset Source Plugin.
 */
export interface PexelsAssetSourcePluginOptions {
  /**
   * Your Pexels API key.
   *
   * Get a free API key at https://www.pexels.com/api/
   *
   * Can also be set via VITE_PEXELS_API_KEY environment variable.
   *
   * Note: For production, consider using a server-side proxy to keep
   * your API key secure and not exposed in browser network requests.
   */
  apiKey?: string;
}

/**
 * Pexels API photo response structure.
 */
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

/**
 * Pexels API response structure.
 */
interface PexelsApiResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
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
// Pexels API Client
// ============================================================================

// highlight-pexels-api
/**
 * Fetch data from the Pexels API.
 *
 * @param endpoint - The API endpoint (e.g., 'search', 'curated')
 * @param params - URL search parameters
 * @param apiKey - The Pexels API key
 * @returns The API response data
 */
async function fetchFromPexels(
  endpoint: string,
  params: URLSearchParams,
  apiKey: string
): Promise<PexelsApiResponse> {
  const response = await fetch(
    `https://api.pexels.com/v1/${endpoint}?${params}`,
    {
      mode: 'cors',
      headers: {
        Authorization: apiKey
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Pexels API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
// highlight-pexels-api

// ============================================================================
// Asset Transformation
// ============================================================================

// highlight-transform-asset
/**
 * Transform a Pexels photo to CE.SDK AssetResult format.
 *
 * @param photo - The Pexels photo object
 * @returns CE.SDK compatible asset result
 */
function transformToAssetResult(photo: PexelsPhoto): AssetResult {
  return {
    id: photo.id.toString(),
    locale: 'en',
    meta: {
      thumbUri: photo.src.medium,
      width: photo.width,
      height: photo.height,
      blockType: '//ly.img.ubq/image',
      uri: photo.src.original
    },
    credits: {
      name: photo.photographer,
      url: photo.photographer_url
    },
    utm: {
      source: 'CE.SDK Demo',
      medium: 'referral'
    }
  };
}
// highlight-transform-asset

// ============================================================================
// Asset Source Factory
// ============================================================================

// Track whether we've shown the API key warning
let hasShownApiKeyWarning = false;

/**
 * Create a Pexels asset source with the given API key.
 *
 * This function is exported for advanced use cases where you need
 * to customize the asset source or integrate it differently.
 *
 * @param apiKey - The Pexels API key
 * @returns AssetSource configuration for CE.SDK
 */
// highlight-createAssetSource
function createPexelsAssetSource(apiKey: string): AssetSource {
  /**
   * Find Pexels assets based on query parameters.
   */
  async function findPexelsAssets(
    queryData: AssetQueryData
  ): Promise<AssetsQueryResult<AssetResult>> {
    // Show warning if API key is not configured
    if (!apiKey && !hasShownApiKeyWarning) {
      hasShownApiKeyWarning = true;
      // eslint-disable-next-line no-alert
      alert(
        'Please provide your Pexels API key.\n\n' +
          'Get a free API key at https://www.pexels.com/api/ and set it in your .env file as VITE_PEXELS_API_KEY.'
      );
      return EMPTY_RESULT;
    }

    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.error(
        'Pexels API key not configured. Please set VITE_PEXELS_API_KEY environment variable.'
      );
      return EMPTY_RESULT;
    }

    try {
      // highlight-pagination
      // Pexels uses 1-based page numbering
      // Convert from CE.SDK's 0-based pagination
      const pexelsPage = queryData.page + 1;
      // highlight-pagination

      // highlight-api-request
      // Build query parameters
      const params = new URLSearchParams({
        page: pexelsPage.toString(),
        per_page: queryData.perPage.toString()
      });

      // Choose endpoint based on whether there's a search query
      let response: PexelsApiResponse;
      if (queryData.query) {
        params.set('query', queryData.query);
        response = await fetchFromPexels('search', params, apiKey);
      } else {
        // Use curated photos when no search query
        response = await fetchFromPexels('curated', params, apiKey);
      }
      // highlight-api-request

      // highlight-response-handling
      // Transform Pexels response to CE.SDK format
      const assets = response.photos.map(transformToAssetResult);
      const hasMore = response.photos.length > 0 && response.next_page;

      return {
        assets,
        total: response.total_results,
        currentPage: queryData.page,
        nextPage: hasMore ? queryData.page + 1 : undefined
      };
      // highlight-response-handling
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Pexels API error:', error);
      return EMPTY_RESULT;
    }
  }

  return {
    id: 'pexels',
    findAssets: findPexelsAssets,
    // highlight-credits-license
    credits: {
      name: 'Pexels',
      url: 'https://www.pexels.com/'
    },
    license: {
      name: 'Pexels License (free)',
      url: 'https://www.pexels.com/license/'
    }
    // highlight-credits-license
  };
}
// highlight-createAssetSource

// ============================================================================
// Plugin Class
// ============================================================================

/**
 * Pexels Asset Source Plugin
 *
 * This plugin adds the Pexels image library to CE.SDK, replacing the default
 * image library with millions of free high-quality stock photos.
 *
 * @example
 * ```typescript
 * import { PexelsAssetSourcePlugin } from './plugins/pexels';
 *
 * // Add the plugin to CE.SDK with API key
 * await cesdk.addPlugin(new PexelsAssetSourcePlugin({
 *   apiKey: 'your-pexels-api-key'
 * }));
 *
 * // Or use environment variable (VITE_PEXELS_API_KEY)
 * await cesdk.addPlugin(new PexelsAssetSourcePlugin());
 * ```
 */
// highlight-plugin-class
export class PexelsAssetSourcePlugin implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   */
  name = 'cesdk-pexels-asset-source';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Plugin options.
   */
  private options: PexelsAssetSourcePluginOptions;

  /**
   * Create a new Pexels Asset Source Plugin.
   *
   * @param options - Plugin configuration options
   */
  constructor(options: PexelsAssetSourcePluginOptions = {}) {
    this.options = options;
  }

  /**
   * Initialize the Pexels asset source plugin.
   *
   * This method:
   * 1. Resolves the API key from options or environment variable
   * 2. Adds the Pexels asset source to the engine
   * 3. Creates a dock entry for Pexels images
   * 4. Configures replace behavior to use Pexels for image fills
   * 5. Sets up translations for the panel label
   *
   * @param ctx - The editor plugin context
   */
  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) return;

    // Use API key from options (env vars should be read by the entry point)
    const apiKey = this.options.apiKey ?? '';

    // Add translation for the panel label
    cesdk.i18n.setTranslations({
      en: {
        'libraries.pexels.label': 'Pexels'
      }
    });

    // Create and add the asset source
    const pexelsAssetSource = createPexelsAssetSource(apiKey);
    cesdk.engine.asset.addSource(pexelsAssetSource);

    // Add asset library entry for the panel
    cesdk.ui.addAssetLibraryEntry({
      id: 'pexels',
      sourceIds: ['pexels'],
      previewLength: 3,
      gridItemHeight: 'auto',
      gridBackgroundType: 'cover',
      gridColumns: 2
    });

    // Configure dock to show Pexels instead of default images
    const currentDockOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.dock' },
      currentDockOrder.map((component) => {
        // Replace the default image dock entry with Pexels
        if (component.key === 'ly.img.image') {
          return {
            id: 'ly.img.assetLibrary.dock',
            key: 'pexels',
            label: 'libraries.pexels.label',
            entries: ['pexels']
          };
        }
        return component;
      })
    );

    // Configure replace behavior to use Pexels for image fills
    cesdk.ui.setReplaceAssetLibraryEntries(
      ({ selectedBlocks, defaultEntryIds, replaceIntent }) => {
        if (
          replaceIntent === 'fill' &&
          selectedBlocks.length === 1 &&
          selectedBlocks[0].fillType === '//ly.img.ubq/fill/image'
        ) {
          return ['pexels'];
        }
        return defaultEntryIds;
      }
    );
  }
}
// highlight-plugin-class
