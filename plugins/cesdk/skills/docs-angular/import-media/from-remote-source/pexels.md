> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Import From Remote Source](./import-media/from-remote-source.md) > [From Pexels](./import-media/from-remote-source/pexels.md)

---

Connect CE.SDK to Pexels API to search and add royalty-free stock photos
directly to your designs.

![Pexels integration showing search and curated image browsing](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-from-remote-source-pexels-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-from-remote-source-pexels-browser)
>
> - [Live demo](https://img.ly/examples/guides-import-media-from-remote-source-pexels-browser/)

Pexels provides a vast library of high-quality, royalty-free stock photos through their public API. We integrate Pexels directly into CE.SDK so users can search, preview, and add photos without leaving the editor.

```typescript file=@cesdk_web_examples/guides-import-media-from-remote-source-pexels-browser/browser.ts reference-only
import type {
  EditorPlugin,
  EditorPluginContext,
  AssetSource,
  AssetQueryData,
  AssetResult,
  AssetsQueryResult
} from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

// Pexels API wrapper using native fetch
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  page: number;
  per_page: number;
  total_results: number;
}

interface PexelsApiResponse {
  data: PexelsResponse;
  status: number;
}

const fetchFromPexels = async (
  url: string,
  apiKey: string
): Promise<PexelsApiResponse> => {
  const response = await fetch(`https://api.pexels.com/v1/${url}`, {
    mode: 'cors',
    headers: {
      Authorization: apiKey
    }
  });
  const json = await response.json();
  const status = response.status;
  return { data: json, status };
};

const createPexelsApi = (apiKey: string) => {
  return {
    photos: {
      search: async ({
        query,
        per_page,
        page
      }: {
        query: string;
        per_page?: number;
        page?: number;
      }) => {
        const params = new URLSearchParams();
        params.append('query', query);
        if (per_page) params.append('per_page', per_page.toString());
        if (page) params.append('page', page.toString());
        return await fetchFromPexels(`search?${params}`, apiKey);
      },
      curated: async ({
        per_page,
        page
      }: {
        per_page?: number;
        page?: number;
      }) => {
        const params = new URLSearchParams();
        if (per_page) params.append('per_page', per_page.toString());
        if (page) params.append('page', page.toString());
        return await fetchFromPexels(`curated?${params}`, apiKey);
      }
    }
  };
};

/**
 * CE.SDK Plugin: Custom Asset Source with Pexels
 *
 * Demonstrates integrating custom asset sources into CE.SDK:
 * - Creating custom asset source definitions
 * - Implementing findAssets callback for Pexels API
 * - Mapping external API responses to CE.SDK asset format
 * - Handling pagination and search
 * - Adding credits and licenses
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load default assets and create a basic scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
    await cesdk.createDesignScene();

    const [page] = engine.block.findByType('page');

    // Set page dimensions for the canvas
    engine.block.setWidth(page, 1600);
    engine.block.setHeight(page, 1200);

    // Calculate grid layout for displaying images
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 3);

    // Create Pexels API client
    const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;

    if (!pexelsApiKey) {
      throw new Error('VITE_PEXELS_API_KEY environment variable is required');
    }

    const PexelsApi = createPexelsApi(pexelsApiKey);

    // Configure localization for the asset library
    cesdk.i18n.setTranslations({
      en: {
        'libraries.pexels.label': 'Pexels'
      }
    });

    // Main asset query function for Pexels
    const findPexelsAssets = async (
      queryData: AssetQueryData
    ): Promise<AssetsQueryResult<AssetResult>> => {
      // Pexels page indices are 1-based, but only pass if > 0
      const pexelsPage = queryData.page > 0 ? queryData.page : undefined;

      if (queryData.query) {
        // Search for images with a query string
        const response = await PexelsApi.photos.search({
          query: queryData.query,
          page: pexelsPage,
          per_page: queryData.perPage
        });

        if (response.status === 200) {
          const { photos, total_results, page } = response.data;
          const assets = photos.map((image) => translateToAssetResult(image));
          const nextPage = photos.length > 0 ? (page ?? 0) + 1 : undefined;

          return {
            assets,
            total: total_results,
            currentPage: page ?? 0,
            nextPage
          };
        } else {
          const error = new Error(
            `Received a response with code ${response.status} when trying to access Pexels`
          );
          console.error(error);
          throw error;
        }
      } else {
        // Show curated images when no query is provided
        const response = await PexelsApi.photos.curated({
          page: pexelsPage,
          per_page: queryData.perPage
        });

        if (response.status === 200) {
          const { photos, total_results, page } = response.data;
          const assets = photos.map((image) => translateToAssetResult(image));
          const nextPage = photos.length > 0 ? (page ?? 0) + 1 : undefined;

          return {
            assets,
            total: total_results,
            currentPage: page ?? 0,
            nextPage
          };
        } else {
          const error = new Error(
            `Received a response with code ${response.status} when trying to access Pexels`
          );
          console.error(error);
          throw error;
        }
      }
    };

    // Translate Pexels photo to CE.SDK AssetResult format
    const translateToAssetResult = (image: PexelsPhoto): AssetResult => {
      const artistName = image.photographer;
      const artistUrl = image.photographer_url;
      const thumbUri = image.src.medium;
      const id = image.id.toString();
      const credits = {
        name: artistName,
        url: artistUrl
      };

      return {
        id,
        locale: 'en',
        meta: {
          thumbUri,
          width: image.width,
          height: image.height,
          mimeType: 'image/jpeg',
          uri: image.src.original
        },
        utm: {
          source: 'CE.SDK Demo',
          medium: 'referral'
        },
        credits
      };
    };

    // Define the Pexels asset source
    const pexelsAssetSource: AssetSource = {
      id: 'pexels',
      findAssets: findPexelsAssets,
      credits: {
        name: 'Pexels',
        url: 'https://pexels.com/'
      },
      license: {
        name: 'Pexels license (free)',
        url: 'https://pexels.com/license'
      }
    };

    // Register the Pexels asset source
    engine.asset.addSource(pexelsAssetSource);

    // Configure the asset library UI with a dedicated Pexels dock entry
    cesdk.ui.addAssetLibraryEntry({
      id: 'pexels',
      sourceIds: ['pexels'],
      previewLength: 6,
      gridColumns: 3
    });

    // Add Pexels to the existing Images asset library
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ({ currentIds }) => [...currentIds, 'pexels']
    });

    // Add Pexels as the first button in the dock with a separator
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'pexels',
        label: 'libraries.pexels.label',
        entries: ['pexels']
      },
      { id: 'ly.img.separator' },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Query for assets and display them (only if scene was created successfully)
    const result = await engine.asset.findAssets(pexelsAssetSource.id, {
      page: 0,
      perPage: 4
    });

    // Add images from Pexels to the scene in a grid layout
    for (let i = 0; i < Math.min(result.assets.length, 4); i++) {
      const asset = result.assets[i];
      const position = layout.getPosition(i);

      const block = await engine.asset.apply(pexelsAssetSource.id, asset);
      engine.block.setPositionX(block, position.x);
      engine.block.setPositionY(block, position.y);
      engine.block.setWidth(block, layout.blockWidth);
      engine.block.setHeight(block, layout.blockHeight);
    }
  }
}

export default Example;
```

This guide covers creating a Pexels API wrapper, implementing the asset source, translating API responses to CE.SDK format, handling attribution requirements, and configuring the asset library UI.

## Prerequisites

Before starting, you need:

- A Pexels API key from the [Pexels API documentation](https://www.pexels.com/api/documentation/)
- Understanding of Pexels' API guidelines and rate limits
- No external packages required—we use the native `fetch` API

## Environment Configuration

We store the Pexels API key in an environment variable for security. Create a `.env` file in your project root:

```bash
VITE_PEXELS_API_KEY=YOUR_API_KEY_HERE
```

The API key is passed in the `Authorization` header for all Pexels API requests.

## Creating a Custom Pexels API Wrapper

We build a lightweight wrapper around the Pexels REST API using the native `fetch` API. The wrapper provides methods for searching and browsing curated photos.

```typescript highlight-fetch-wrapper
const fetchFromPexels = async (
  url: string,
  apiKey: string
): Promise<PexelsApiResponse> => {
  const response = await fetch(`https://api.pexels.com/v1/${url}`, {
    mode: 'cors',
    headers: {
      Authorization: apiKey
    }
  });
  const json = await response.json();
  const status = response.status;
  return { data: json, status };
};
```

The `fetchFromPexels` function sends requests to the Pexels API with proper CORS configuration and authentication headers. We return both the response data and status code for error handling.

We create a Pexels API client with two methods:

```typescript highlight-api-client
const createPexelsApi = (apiKey: string) => {
  return {
    photos: {
      search: async ({
        query,
        per_page,
        page
      }: {
        query: string;
        per_page?: number;
        page?: number;
      }) => {
        const params = new URLSearchParams();
        params.append('query', query);
        if (per_page) params.append('per_page', per_page.toString());
        if (page) params.append('page', page.toString());
        return await fetchFromPexels(`search?${params}`, apiKey);
      },
      curated: async ({
        per_page,
        page
      }: {
        per_page?: number;
        page?: number;
      }) => {
        const params = new URLSearchParams();
        if (per_page) params.append('per_page', per_page.toString());
        if (page) params.append('page', page.toString());
        return await fetchFromPexels(`curated?${params}`, apiKey);
      }
    }
  };
};
```

The `photos.search()` method queries Pexels with a search term, while `photos.curated()` fetches curated images. Both methods support pagination through `page` and `per_page` parameters.

## Creating the Pexels Asset Source Definition

We define a custom asset source with an `id`, `findAssets` callback, and source-level attribution information:

```typescript highlight-asset-source
    // Define the Pexels asset source
    const pexelsAssetSource: AssetSource = {
      id: 'pexels',
      findAssets: findPexelsAssets,
      credits: {
        name: 'Pexels',
        url: 'https://pexels.com/'
      },
      license: {
        name: 'Pexels license (free)',
        url: 'https://pexels.com/license'
      }
    };

    // Register the Pexels asset source
    engine.asset.addSource(pexelsAssetSource);
```

The `credits` field provides attribution to Pexels, while the `license` field links to their licensing terms. We register the source with `engine.asset.addSource()` to make it available throughout CE.SDK.

## Implementing the findAssets Callback

The `findAssets` callback receives query parameters and routes to the appropriate Pexels API endpoint:

```typescript highlight-find-assets
    // Main asset query function for Pexels
    const findPexelsAssets = async (
      queryData: AssetQueryData
    ): Promise<AssetsQueryResult<AssetResult>> => {
      // Pexels page indices are 1-based, but only pass if > 0
      const pexelsPage = queryData.page > 0 ? queryData.page : undefined;

      if (queryData.query) {
        // Search for images with a query string
        const response = await PexelsApi.photos.search({
          query: queryData.query,
          page: pexelsPage,
          per_page: queryData.perPage
        });

        if (response.status === 200) {
          const { photos, total_results, page } = response.data;
          const assets = photos.map((image) => translateToAssetResult(image));
          const nextPage = photos.length > 0 ? (page ?? 0) + 1 : undefined;

          return {
            assets,
            total: total_results,
            currentPage: page ?? 0,
            nextPage
          };
        } else {
          const error = new Error(
            `Received a response with code ${response.status} when trying to access Pexels`
          );
          console.error(error);
          throw error;
        }
      } else {
        // Show curated images when no query is provided
        const response = await PexelsApi.photos.curated({
          page: pexelsPage,
          per_page: queryData.perPage
        });

        if (response.status === 200) {
          const { photos, total_results, page } = response.data;
          const assets = photos.map((image) => translateToAssetResult(image));
          const nextPage = photos.length > 0 ? (page ?? 0) + 1 : undefined;

          return {
            assets,
            total: total_results,
            currentPage: page ?? 0,
            nextPage
          };
        } else {
          const error = new Error(
            `Received a response with code ${response.status} when trying to access Pexels`
          );
          console.error(error);
          throw error;
        }
      }
    };
```

When a query exists, we call `PexelsApi.photos.search()`. Without a query, we fetch curated images with `PexelsApi.photos.curated()`. CE.SDK uses 0-based page indexing, which we convert to 1-based indexing for Pexels.

We check the response status and throw errors for non-200 responses. The API response includes the total result count, current page number, and photo array.

## Translating Pexels Data to CE.SDK Format

We map each Pexels photo to CE.SDK's `AssetResult` interface:

```typescript highlight-translate
    // Translate Pexels photo to CE.SDK AssetResult format
    const translateToAssetResult = (image: PexelsPhoto): AssetResult => {
      const artistName = image.photographer;
      const artistUrl = image.photographer_url;
      const thumbUri = image.src.medium;
      const id = image.id.toString();
      const credits = {
        name: artistName,
        url: artistUrl
      };

      return {
        id,
        locale: 'en',
        meta: {
          thumbUri,
          width: image.width,
          height: image.height,
          mimeType: 'image/jpeg',
          uri: image.src.original
        },
        utm: {
          source: 'CE.SDK Demo',
          medium: 'referral'
        },
        credits
      };
    };
```

The `meta` object contains image dimensions, URLs, and MIME type. We use `image.src.medium` for thumbnails and `image.src.original` for the full-resolution image.

Per-asset `credits` include the photographer's name and profile URL from the API response. UTM parameters track usage analytics as recommended by Pexels.

## Handling Pexels Attribution Requirements

Pexels' licensing requires photographer attribution. We provide attribution at two levels:

**Source-level attribution** in the asset source definition (shown in "Creating the Pexels Asset Source Definition") credits Pexels as the provider.

**Per-asset attribution** in each `AssetResult` credits individual photographers with their name and profile URL.

UTM parameters (`source` and `medium`) track photo usage and provide attribution analytics.

## Configuring the Asset Library Dock

We add Pexels to the editor's dock by creating an asset library entry and then adding a dock button component:

```typescript
cesdk.ui.addAssetLibraryEntry({
  id: 'pexels',
  sourceIds: ['pexels'],
  previewLength: 6,
  gridColumns: 3,
  gridItemHeight: 'square'
});

// Add Pexels to the existing Images asset library
cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
  sourceIds: ({ currentIds }) => [...currentIds, 'pexels']
});

// Add Pexels as the first button in the dock with a separator
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  {
    id: 'ly.img.assetLibrary.dock',
    key: 'pexels',
    label: 'libraries.pexels.label',
    entries: ['pexels']
  },
  { id: 'ly.img.separator' },
  ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
]);
```

The `addAssetLibraryEntry()` call registers the Pexels asset library panel with display settings. The `setComponentOrder()` call creates an explicit dock button component by prepending a new `AssetLibraryDockComponent` to the existing dock order.

The dock component structure includes:

- `id`: Fixed identifier for asset library dock buttons (`'ly.img.assetLibrary.dock'`)
- `key`: Unique identifier for this specific button (`'pexels'`)
- `label`: Internationalization key for the button label (`'libraries.pexels.label'`)
- `entries`: Array of asset library entry IDs to display when clicked (`['pexels']`)

Additionally, we add Pexels to the existing Images asset library using `updateAssetLibraryEntry()`. This provides dual access: users can access Pexels photos both from the dedicated Pexels panel and from the Images library panel. The functional update pattern `({ currentIds }) => [...currentIds, 'pexels']` appends Pexels to the existing sources without replacing them.

The separator component `{ id: 'ly.img.separator' }` adds a visual divider between the Pexels button and the default dock buttons, improving UI organization and clarity.

## Testing the Integration

We test the integration by adding Pexels images to the scene programmatically:

```typescript highlight-test
    // Query for assets and display them (only if scene was created successfully)
    const result = await engine.asset.findAssets(pexelsAssetSource.id, {
      page: 0,
      perPage: 4
    });

    // Add images from Pexels to the scene in a grid layout
    for (let i = 0; i < Math.min(result.assets.length, 4); i++) {
      const asset = result.assets[i];
      const position = layout.getPosition(i);

      const block = await engine.asset.apply(pexelsAssetSource.id, asset);
      engine.block.setPositionX(block, position.x);
      engine.block.setPositionY(block, position.y);
      engine.block.setWidth(block, layout.blockWidth);
      engine.block.setHeight(block, layout.blockHeight);
    }
```

We query the Pexels source, retrieve the first three results, and add them to the scene using `engine.asset.apply()`. Each image is positioned in a grid layout using the `calculateGridLayout` utility.

## Troubleshooting

Common issues when integrating Pexels:

- **API rate limiting:** Pexels enforces rate limits per API key. Cache results and handle 429 responses gracefully.
- **Missing API key:** Verify the `VITE_PEXELS_API_KEY` environment variable is set and accessible.
- **Attribution not displaying:** Check that both source-level and per-asset `credits` are properly configured.
- **Image loading failures:** Verify Pexels CDN URLs are accessible from your application's domain.
- **Response status errors:** Handle non-200 responses by checking `response.status` and providing error messages.

## API Reference

| Method                     | Category | Purpose                                         |
| -------------------------- | -------- | ----------------------------------------------- |
| `engine.asset.addSource()` | Asset    | Register Pexels as a custom asset source        |
| `engine.asset.apply()`     | Asset    | Add Pexels image to the scene as a design block |

## Next Steps

- [Customize Asset Library](./import-media/asset-panel/customize.md) — Configure asset panels and
  UI
- [Asset Library Basics](./import-media/asset-panel/basics.md) — Understand asset sources
- [Integrate Unsplash Images](./import-media/from-remote-source/unsplash.md) — Add another stock image
  source
- [From Remote Source](./import-media/from-remote-source.md) — Explore other remote asset
  integrations
- [Import Media Concepts](./import-media/concepts.md) — Learn core import concepts



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support