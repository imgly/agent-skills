/**
 * Unsplash Asset Source Plugin
 *
 * This plugin integrates Unsplash's free image library into CE.SDK.
 * It uses the official unsplash-js client with a proxy server for API key security.
 *
 * ## Setup Requirements
 *
 * 1. Create an Unsplash developer account: https://unsplash.com/developers
 * 2. Set up a proxy server to handle API requests (keeps API key secure)
 * 3. Pass the proxy URL via plugin options or environment variable
 *
 * ## Unsplash API Guidelines
 *
 * - Always include attribution (credits with artist name and URL)
 * - Include UTM parameters for referral tracking
 * - Follow Unsplash's API guidelines: https://unsplash.com/documentation#guidelines--crediting
 *
 * @see https://github.com/unsplash/unsplash-js
 * @see https://unsplash.com/documentation
 */

import type {
  AssetSource,
  AssetQueryData,
  AssetResult,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { createApi, OrderBy } from 'unsplash-js';

// ============================================================================
// Configuration
// ============================================================================

let DEFAULT_UNSPLASH_API_URL = '';

//START_HIDDEN_BLOCK
if (!DEFAULT_UNSPLASH_API_URL)
  DEFAULT_UNSPLASH_API_URL = 'https://api.img.ly/unsplashProxy';
//END_HIDDEN_BLOCK

/**
 * Configuration options for the Unsplash Asset Source Plugin.
 */
export interface UnsplashAssetSourcePluginOptions {
  /**
   * Unsplash API proxy URL.
   *
   * IMPORTANT: Never expose your Unsplash API key in frontend code.
   * Use a proxy server to add the API key server-side.
   *
   * If not provided, falls back to the demo proxy URL for development.
   */
  apiUrl?: string;
}

// ============================================================================
// Asset Source Implementation
// ============================================================================

/**
 * Interface for Unsplash photo data returned by the API.
 */
interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  width: number;
  height: number;
  urls: {
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  tags?: Array<{ title: string }>;
}

/**
 * Translate Unsplash photo data to CE.SDK AssetResult format.
 *
 * @param image - The Unsplash photo object
 * @returns CE.SDK compatible asset result
 */
function translateToAssetResult(image: UnsplashPhoto): AssetResult {
  const artistName = image?.user?.name;
  const artistUrl = image?.user?.links?.html;

  return {
    id: image.id,
    locale: 'en',
    label: image.description ?? image.alt_description ?? undefined,
    tags: image.tags ? image.tags.map((tag) => tag.title) : undefined,

    meta: {
      mimeType: 'image/jpeg',
      uri: image.urls.full,
      thumbUri: image.urls.thumb,
      width: image.width,
      height: image.height
    },

    // Attribution credits (required by Unsplash guidelines)
    credits: artistName
      ? {
          name: artistName,
          url: artistUrl
        }
      : undefined,

    // UTM parameters for Unsplash referral tracking
    utm: {
      source: 'CE.SDK Demo',
      medium: 'referral'
    }
  };
}

/**
 * Create a findAssets function for the Unsplash asset source.
 *
 * @param apiUrl - The Unsplash API proxy URL
 * @returns The findAssets function
 */
// highlight-find-assets
function createFindUnsplashAssets(apiUrl: string) {
  const unsplashApi = createApi({ apiUrl });

  return async function findUnsplashAssets(queryData: AssetQueryData) {
    const page = queryData.page ?? 1;
    const perPage = queryData.perPage ?? 20;

    if (queryData.query) {
      // Search for photos matching query
      const response = await unsplashApi.search.getPhotos({
        query: queryData.query,
        page,
        perPage
      });

      if (response.type === 'success') {
        const { results, total, total_pages } = response.response;

        return {
          assets: results.map((photo) =>
            translateToAssetResult(photo as unknown as UnsplashPhoto)
          ),
          total,
          currentPage: page,
          nextPage: page + 1 <= total_pages ? page + 1 : undefined
        };
      } else if (response.type === 'error') {
        throw new Error(response.errors[0]);
      }
    } else {
      // List popular photos (default view)
      const response = await unsplashApi.photos.list({
        orderBy: OrderBy.POPULAR,
        page,
        perPage
      });

      if (response.type === 'success') {
        const { results, total } = response.response;
        const totalFetched = (page - 1) * perPage + results.length;
        const nextPage = totalFetched < total ? page + 1 : undefined;

        return {
          assets: results.map((photo) =>
            translateToAssetResult(photo as unknown as UnsplashPhoto)
          ),
          total,
          currentPage: page,
          nextPage
        };
      } else if (response.type === 'error') {
        throw new Error(response.errors[0]);
      }
    }

    return undefined;
  };
}
// highlight-find-assets

/**
 * Create an Unsplash asset source with the given API URL.
 *
 * @param apiUrl - The Unsplash API proxy URL
 * @returns The configured asset source
 */
// highlight-asset-source
export function createUnsplashAssetSource(apiUrl: string): AssetSource {
  return {
    id: 'unsplash',
    findAssets: createFindUnsplashAssets(apiUrl),

    // Service-level credits (shown in asset library footer)
    credits: {
      name: 'Unsplash',
      url: 'https://unsplash.com/'
    },

    // License information
    license: {
      name: 'Unsplash license (free)',
      url: 'https://unsplash.com/license'
    }
  };
}
// highlight-asset-source

/**
 * Default Unsplash asset source using the demo proxy.
 * For production, use createUnsplashAssetSource() with your proxy URL.
 */
export const unsplashAssetSource: AssetSource = createUnsplashAssetSource(
  DEFAULT_UNSPLASH_API_URL
);

// ============================================================================
// Plugin Class
// ============================================================================

/**
 * Unsplash Asset Source Plugin
 *
 * This plugin adds the Unsplash image library to CE.SDK, replacing the default
 * image library with millions of free high-quality photos.
 *
 * @example
 * ```typescript
 * import { UnsplashAssetSourcePlugin } from './plugins/unsplash';
 *
 * // Using default demo proxy (development only)
 * await cesdk.addPlugin(new UnsplashAssetSourcePlugin());
 *
 * // Using custom proxy URL (recommended for production)
 * await cesdk.addPlugin(new UnsplashAssetSourcePlugin({
 *   apiUrl: 'https://your-proxy.example.com/unsplash'
 * }));
 * ```
 */
// highlight-plugin-class
export class UnsplashAssetSourcePlugin implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   */
  name = 'cesdk-unsplash-asset-source';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Plugin configuration options.
   */
  private options: UnsplashAssetSourcePluginOptions;

  /**
   * Create a new UnsplashAssetSourcePlugin instance.
   *
   * @param options - Configuration options
   * @param options.apiUrl - Unsplash API proxy URL (defaults to demo proxy)
   */
  constructor(options: UnsplashAssetSourcePluginOptions = {}) {
    this.options = options;
  }

  /**
   * Initialize the Unsplash asset source plugin.
   *
   * This method:
   * 1. Adds the Unsplash asset source to the engine
   * 2. Creates a dock entry for Unsplash images
   * 3. Configures replace behavior to use Unsplash for image fills
   * 4. Sets up translations for the panel label
   *
   * @param ctx - The editor plugin context
   */
  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) return;

    // Determine the API URL to use
    const apiUrl = this.options.apiUrl || DEFAULT_UNSPLASH_API_URL;

    // Add translation for the panel label
    cesdk.i18n.setTranslations({
      en: {
        'libraries.unsplash.label': 'Unsplash'
      }
    });

    // Create and add the asset source with the configured API URL
    const assetSource = createUnsplashAssetSource(apiUrl);
    cesdk.engine.asset.addSource(assetSource);

    // Add asset library entry for the panel
    cesdk.ui.addAssetLibraryEntry({
      id: 'unsplash',
      sourceIds: ['unsplash'],
      previewLength: 3,
      gridItemHeight: 'auto',
      gridBackgroundType: 'cover',
      gridColumns: 2
    });

    // Configure dock to show Unsplash instead of default images
    // Uses updateOrderComponent to replace the ly.img.image dock entry with Unsplash
    cesdk.ui.updateOrderComponent(
      { in: 'ly.img.dock', match: { key: 'ly.img.image' } },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'unsplash',
        label: 'libraries.unsplash.label',
        entries: ['unsplash']
      }
    );

    // Configure replace behavior to use Unsplash for image fills
    cesdk.ui.setReplaceAssetLibraryEntries(
      ({ selectedBlocks, defaultEntryIds, replaceIntent }) => {
        if (
          replaceIntent === 'fill' &&
          selectedBlocks.length === 1 &&
          selectedBlocks[0].fillType === '//ly.img.ubq/fill/image'
        ) {
          return ['unsplash'];
        }
        return defaultEntryIds;
      }
    );
  }
}
// highlight-plugin-class
