/**
 * Airtable Asset Source Plugin
 *
 * This plugin integrates Airtable as a custom image asset source in CE.SDK.
 * It allows you to browse and search images stored in your Airtable database.
 *
 * ## Setup Requirements
 *
 * ### Production (Recommended)
 * 1. Set up a proxy server that handles Airtable API authentication
 * 2. Pass the proxy URL via plugin options
 *
 * ### Development Only
 * 1. Get your API key from your Airtable account settings
 * 2. Pass the API key directly (NOT recommended for production)
 *
 * ## Security Warning
 *
 * NEVER expose your Airtable API key in production frontend code.
 * Always use a proxy server to keep your API key secure.
 *
 * @see https://airtable.com/developers/web/api
 * @see https://img.ly/docs/cesdk/js/custom-asset-sources/
 */

import type {
  AssetSource,
  AssetQueryData,
  AssetResult,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

// ============================================================================
// Types
// ============================================================================

/**
 * Airtable image attachment structure.
 */
interface AirtableImageAttachment {
  id: string;
  width: number;
  height: number;
  url: string;
  thumbnails: {
    small: { url: string; width: number; height: number };
    large: { url: string; width: number; height: number };
    full: { url: string; width: number; height: number };
  };
}

/**
 * Airtable asset record structure.
 */
interface AirtableAssetRecord {
  name: string;
  image: AirtableImageAttachment;
}

/**
 * Response format from proxy server.
 */
interface AirtableProxyResponse {
  results: AirtableAssetRecord[];
}

/**
 * Configuration options for the Airtable Asset Source Plugin.
 */
export interface AirtableAssetSourcePluginOptions {
  /**
   * Airtable API proxy URL.
   *
   * IMPORTANT: Never expose your Airtable API key in frontend code.
   * Use a proxy server to add the API key server-side.
   *
   * The proxy should accept:
   * - GET /?query=...&perPage=...
   *
   * And return: { results: [{ name: string, image: { id, url, width, height, thumbnails } }] }
   *
   * If not provided, falls back to the demo proxy URL for development.
   */
  proxyUrl?: string;

  /**
   * @deprecated Use proxyUrl instead for production.
   *
   * Your Airtable API key (DEVELOPMENT ONLY).
   *
   * WARNING: Using this in production exposes your API key to all users.
   * Only use this for local development and testing.
   */
  apiKey?: string;

  /**
   * The Airtable database ID to use with direct API key mode.
   * Only used when apiKey is provided.
   *
   * Defaults to the demo database 'appHAZoD6Qj3teOmr'.
   */
  databaseId?: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default Airtable database ID for the demo database.
 */
const DEFAULT_DATABASE_ID = 'appHAZoD6Qj3teOmr';

// ============================================================================
// Proxy-based Query (Recommended for Production)
// ============================================================================

/**
 * Query Airtable assets via proxy server.
 *
 * @param proxyUrl - The proxy server URL
 * @param options - Query options
 * @returns Promise resolving to array of asset records
 */
async function queryAirtableViaProxy(
  proxyUrl: string,
  options: { query?: string; perPage?: number }
): Promise<AirtableProxyResponse> {
  const params = new URLSearchParams();
  if (options.query) params.set('query', options.query);
  if (options.perPage) params.set('perPage', String(options.perPage));

  const url = `${proxyUrl}${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Airtable proxy error: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// Direct SDK Query (Development Only)
// ============================================================================

/**
 * Query Airtable directly using SDK (DEVELOPMENT ONLY).
 *
 * WARNING: This exposes your API key in client-side code.
 * Only use for local development and testing.
 *
 * @param apiKey - The Airtable API key
 * @param databaseId - The Airtable database ID
 * @param options - Query options
 * @returns Promise resolving to array of asset records
 */
async function queryAirtableDirect(
  apiKey: string,
  databaseId: string,
  options: { query?: string; perPage?: number }
): Promise<AirtableProxyResponse> {
  // Dynamic import to avoid bundling Airtable SDK when using proxy
  const Airtable = (await import('airtable')).default;
  const records: AirtableAssetRecord[] = [];

  return new Promise((resolve, reject) => {
    const base = new Airtable({ apiKey }).base(databaseId);

    base('Asset sources')
      .select({
        maxRecords: options.perPage || 100,
        view: 'Grid view',
        filterByFormula: options.query
          ? `AND({Name} != '', SEARCH(LOWER('${options.query}'), LOWER({Name})))`
          : "{Name} != ''"
      })
      .eachPage(
        function page(pageRecords, fetchNextPage) {
          pageRecords.forEach(function (record) {
            const imageField = record.get(
              'Image'
            ) as unknown as AirtableImageAttachment[];
            if (imageField && imageField.length > 0) {
              records.push({
                name: record.get('Name') as string,
                image: imageField[0]
              });
            }
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ results: records });
        }
      );
  });
}

// ============================================================================
// Asset Source Helpers
// ============================================================================

/**
 * Transform an Airtable record to CE.SDK AssetResult format.
 */
function translateToAssetResult(record: AirtableAssetRecord): AssetResult {
  const { image } = record;
  return {
    id: image.id,
    locale: 'en',
    label: record.name,
    meta: {
      thumbUri: image.thumbnails.large.url,
      width: image.width,
      height: image.height,
      mimeType: 'image/jpeg',
      uri: image.url
    }
  };
}

// ============================================================================
// Asset Source Factory
// ============================================================================

// Track whether we've shown warnings
let hasShownApiKeyWarning = false;
let hasShownDevModeWarning = false;

/**
 * Create an Airtable asset source with the given configuration.
 *
 * @param config - Configuration object
 * @returns AssetSource configuration for CE.SDK
 */
// highlight-asset-source
function createAirtableAssetSource(config: {
  proxyUrl?: string;
  apiKey?: string;
  databaseId?: string;
}): AssetSource {
  const proxyUrl = config.proxyUrl;
  const apiKey = config.apiKey ?? '';
  const databaseId = config.databaseId ?? DEFAULT_DATABASE_ID;

  // Warn about development mode usage
  if (!proxyUrl && apiKey && !hasShownDevModeWarning) {
    hasShownDevModeWarning = true;
    console.warn(
      '⚠️ Airtable Asset Source: Using direct API key mode.\n' +
        'This exposes your API key in client-side code.\n' +
        'For production, use proxyUrl instead to keep your API key secure.'
    );
  }

  /**
   * Find Airtable assets based on query parameters.
   */
  async function findAirtableAssets(queryData: AssetQueryData) {
    try {
      let response: AirtableProxyResponse;

      if (proxyUrl) {
        // Production mode: use proxy
        response = await queryAirtableViaProxy(proxyUrl, {
          query: queryData.query,
          perPage: queryData.perPage
        });
      } else if (apiKey) {
        // Development mode: direct SDK
        response = await queryAirtableDirect(apiKey, databaseId, {
          query: queryData.query,
          perPage: queryData.perPage
        });
      } else {
        // No configuration provided - show error
        if (!hasShownApiKeyWarning) {
          hasShownApiKeyWarning = true;
          console.error(
            '❌ Airtable Asset Source: No configuration provided.\n\n' +
              'Please provide either:\n' +
              '  - proxyUrl: Your proxy server URL (recommended for production)\n' +
              '  - apiKey: Your Airtable API key (development only)\n\n' +
              'Example:\n' +
              '  new AirtableAssetSourcePlugin({ apiKey: "your-api-key" })\n\n' +
              'Get your API key from: https://airtable.com/create/tokens'
          );
        }
        return {
          assets: [],
          total: 0,
          currentPage: 1,
          nextPage: undefined
        };
      }

      const { results } = response;
      const assets = results.map(translateToAssetResult);

      return {
        assets,
        total: 99999, // Airtable doesn't return total
        currentPage: 1,
        nextPage: undefined
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching Airtable assets:', error);
      return {
        assets: [],
        total: 0,
        currentPage: 1,
        nextPage: undefined
      };
    }
  }

  return {
    id: 'airtable',
    findAssets: findAirtableAssets,
    credits: {
      name: 'Airtable',
      url: 'https://airtable.com/'
    },
    license: {
      name: 'Airtable Terms of Service',
      url: 'https://www.airtable.com/company/tos'
    }
  };
}
// highlight-asset-source

// ============================================================================
// Plugin Class
// ============================================================================

/**
 * Airtable Asset Source Plugin
 *
 * This plugin adds Airtable as an image asset source in CE.SDK, allowing you
 * to browse and search images stored in your Airtable database.
 *
 * @example
 * ```typescript
 * import { AirtableAssetSourcePlugin } from './plugins/airtable';
 *
 * // Production: Use proxy URL (recommended)
 * await cesdk.addPlugin(new AirtableAssetSourcePlugin({
 *   proxyUrl: 'https://your-server.com/api/airtable'
 * }));
 *
 * // Development only: Direct API key (NOT for production)
 * await cesdk.addPlugin(new AirtableAssetSourcePlugin({
 *   apiKey: 'YOUR_AIRTABLE_API_KEY'
 * }));
 * ```
 */
// highlight-plugin-class
export class AirtableAssetSourcePlugin implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   */
  name = 'cesdk-airtable-asset-source';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Plugin options.
   */
  private options: AirtableAssetSourcePluginOptions;

  /**
   * Create a new Airtable Asset Source Plugin.
   *
   * @param options - Plugin configuration options
   */
  constructor(options: AirtableAssetSourcePluginOptions = {}) {
    this.options = options;
  }

  /**
   * Initialize the Airtable asset source plugin.
   *
   * This method:
   * 1. Creates the Airtable asset source (using proxy or direct SDK)
   * 2. Adds the asset source to the engine
   * 3. Creates a dock entry for Airtable images
   * 4. Configures replace behavior to use Airtable for image fills
   * 5. Sets up translations for the panel label
   *
   * @param ctx - The editor plugin context
   */
  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) return;

    // Add translation for the panel label
    cesdk.i18n.setTranslations({
      en: {
        'libraries.airtable.label': 'Airtable'
      }
    });

    // Create and add the asset source
    const airtableAssetSource = createAirtableAssetSource({
      proxyUrl: this.options.proxyUrl,
      apiKey: this.options.apiKey,
      databaseId: this.options.databaseId
    });
    cesdk.engine.asset.addSource(airtableAssetSource);

    // Add asset library entry for the panel
    cesdk.ui.addAssetLibraryEntry({
      id: 'airtable',
      sourceIds: ['airtable'],
      previewLength: 3,
      gridItemHeight: 'auto',
      gridBackgroundType: 'cover',
      gridColumns: 2
    });

    // Configure dock to show Airtable instead of default images
    const currentDockOrder = cesdk.ui.getDockOrder();
    cesdk.ui.setDockOrder(
      currentDockOrder.map((component) => {
        // Replace the default image dock entry with Airtable
        if (component.key === 'ly.img.image') {
          return {
            id: 'ly.img.assetLibrary.dock',
            key: 'airtable',
            label: 'libraries.airtable.label',
            entries: ['airtable']
          };
        }
        return component;
      })
    );

    // Configure replace behavior to use Airtable for image fills
    cesdk.ui.setReplaceAssetLibraryEntries(
      ({ selectedBlocks, defaultEntryIds, replaceIntent }) => {
        if (
          replaceIntent === 'fill' &&
          selectedBlocks.length === 1 &&
          selectedBlocks[0].fillType === '//ly.img.ubq/fill/image'
        ) {
          return ['airtable'];
        }
        return defaultEntryIds;
      }
    );
  }
}
// highlight-plugin-class
