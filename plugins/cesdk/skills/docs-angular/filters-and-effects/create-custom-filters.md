> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Filters and Effects](./filters-and-effects.md) > [Create Custom Filters](./filters-and-effects/create-custom-filters.md)

---

Extend CE.SDK with your own LUT filters by creating and registering custom filter asset sources for brand-specific color grading.

![Create Custom Filters example showing images with custom filters applied](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-filters-and-effects-add-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-filters-and-effects-add-browser)
>
> - [Live demo](https://img.ly/examples/guides-filters-and-effects-add-browser/)

CE.SDK provides built-in LUT filters, but many applications need brand-specific color grading or custom filter collections. Custom filter asset sources let you register your own LUT filters that appear alongside or replace the defaults. Once registered, custom filters integrate seamlessly with the built-in UI and can be applied programmatically.

```typescript file=@cesdk_web_examples/guides-filters-and-effects-add-browser/browser.ts reference-only
import type {
  EditorPlugin,
  EditorPluginContext,
  AssetSource,
  AssetQueryData,
  AssetsQueryResult,
  AssetResult
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Create Custom Filters Guide
 *
 * Demonstrates creating and registering custom LUT filter asset sources:
 * - Creating a filter source with addSource()
 * - Defining filter assets with LUT metadata
 * - Loading filters from JSON configuration
 * - Querying custom filters
 * - Applying filters from custom sources
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load default assets
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Enable filters in the inspector panel using the Feature API
    cesdk.feature.enable('ly.img.filter');

    // Add a custom filter to the built-in LUT filter source
    // The ID must follow the format //ly.img.cesdk.filters.lut/{name}
    // for the UI to display the label correctly
    engine.asset.addAssetToSource('ly.img.filter.lut', {
      id: '//ly.img.cesdk.filters.lut/mycustomfilter',
      label: { en: 'MY CUSTOM FILTER' },
      tags: { en: ['custom', 'brand'] },
      meta: {
        uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    });

    // Add translation for the custom filter label
    cesdk.i18n.setTranslations({
      en: {
        'property.lutFilter.mycustomfilter': 'MY CUSTOM FILTER'
      }
    });

    // Create a custom filter asset source for organizing multiple filters
    const customFilterSource: AssetSource = {
      id: 'my-custom-filters',

      async findAssets(
        queryData: AssetQueryData
      ): Promise<AssetsQueryResult | undefined> {
        // Define custom LUT filter assets
        const filters: AssetResult[] = [
          {
            id: 'vintage-warm',
            label: 'Vintage Warm',
            tags: ['vintage', 'warm', 'retro'],
            meta: {
              uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              thumbUri:
                'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              horizontalTileCount: '5',
              verticalTileCount: '5',
              blockType: '//ly.img.ubq/effect/lut_filter'
            }
          },
          {
            id: 'cool-cinema',
            label: 'Cool Cinema',
            tags: ['cinema', 'cool', 'film'],
            meta: {
              uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              thumbUri:
                'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              horizontalTileCount: '5',
              verticalTileCount: '5',
              blockType: '//ly.img.ubq/effect/lut_filter'
            }
          },
          {
            id: 'bw-classic',
            label: 'B&W Classic',
            tags: ['black and white', 'classic', 'monochrome'],
            meta: {
              uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              thumbUri:
                'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              horizontalTileCount: '5',
              verticalTileCount: '5',
              blockType: '//ly.img.ubq/effect/lut_filter'
            }
          }
        ];

        // Filter by query if provided
        let filteredAssets = filters;
        if (queryData.query) {
          const searchTerm = queryData.query.toLowerCase();
          filteredAssets = filters.filter(
            (asset) =>
              asset.label?.toLowerCase().includes(searchTerm) ||
              asset.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        }

        // Filter by groups if provided
        if (queryData.groups && queryData.groups.length > 0) {
          filteredAssets = filteredAssets.filter((asset) =>
            asset.tags?.some((tag) => queryData.groups?.includes(tag))
          );
        }

        // Handle pagination
        const page = queryData.page ?? 0;
        const perPage = queryData.perPage ?? 10;
        const startIndex = page * perPage;
        const paginatedAssets = filteredAssets.slice(
          startIndex,
          startIndex + perPage
        );

        return {
          assets: paginatedAssets,
          total: filteredAssets.length,
          currentPage: page,
          nextPage:
            startIndex + perPage < filteredAssets.length ? page + 1 : undefined
        };
      },

      // Return available filter categories
      async getGroups(): Promise<string[]> {
        return ['vintage', 'cinema', 'black and white'];
      }
    };

    // Register the custom filter source for programmatic access
    engine.asset.addSource(customFilterSource);

    // Load filters from a JSON configuration string
    const filterConfigJSON = JSON.stringify({
      version: '2.0.0',
      id: 'my-json-filters',
      assets: [
        {
          id: 'sunset-glow',
          label: { en: 'Sunset Glow' },
          tags: { en: ['warm', 'sunset', 'golden'] },
          groups: ['Warm Tones'],
          meta: {
            uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            thumbUri:
              'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            horizontalTileCount: '5',
            verticalTileCount: '5',
            blockType: '//ly.img.ubq/effect/lut_filter'
          }
        },
        {
          id: 'ocean-breeze',
          label: { en: 'Ocean Breeze' },
          tags: { en: ['cool', 'blue', 'ocean'] },
          groups: ['Cool Tones'],
          meta: {
            uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            thumbUri:
              'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            horizontalTileCount: '5',
            verticalTileCount: '5',
            blockType: '//ly.img.ubq/effect/lut_filter'
          }
        }
      ]
    });

    // Create asset source from JSON string
    const jsonSourceId =
      await engine.asset.addLocalAssetSourceFromJSONString(filterConfigJSON);
    // eslint-disable-next-line no-console
    console.log('Created JSON-based filter source:', jsonSourceId);

    // Query filters from our custom source for programmatic use
    const customFilterResults = await engine.asset.findAssets(
      'my-custom-filters',
      {
        page: 0,
        perPage: 10
      }
    );

    // Create an image block to demonstrate applying a custom filter
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      x: 50,
      y: 150,
      size: { width: 300, height: 200 }
    });
    engine.block.appendChild(page, imageBlock);

    // Get a filter from our custom source
    const filterAsset = customFilterResults.assets[0];
    if (filterAsset && filterAsset.meta) {
      // Create and configure the LUT filter effect
      const lutEffect = engine.block.createEffect(
        '//ly.img.ubq/effect/lut_filter'
      );

      // Set LUT file URI from asset metadata
      engine.block.setString(
        lutEffect,
        'effect/lut_filter/lutFileURI',
        filterAsset.meta.uri as string
      );

      // Configure LUT grid dimensions
      engine.block.setInt(
        lutEffect,
        'effect/lut_filter/horizontalTileCount',
        parseInt(filterAsset.meta.horizontalTileCount as string, 10)
      );
      engine.block.setInt(
        lutEffect,
        'effect/lut_filter/verticalTileCount',
        parseInt(filterAsset.meta.verticalTileCount as string, 10)
      );

      // Set filter intensity (0.0 to 1.0)
      engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.85);

      // Apply the effect to the image block
      engine.block.appendEffect(imageBlock, lutEffect);
    }

    // Create a second image without a filter for comparison
    const imageBlock2 = await engine.block.addImage(imageUri, {
      x: 450,
      y: 150,
      size: { width: 300, height: 200 }
    });
    engine.block.appendChild(page, imageBlock2);

    // Select the filtered image to show the filter in the inspector
    engine.block.select(imageBlock);

    // eslint-disable-next-line no-console
    console.log(
      'Custom filters guide initialized. Select an image to see filters in the inspector panel.'
    );
  }
}

export default Example;
```

This guide covers how to create filter asset sources, define filter metadata, load filters from JSON configuration, and apply custom filters to design elements.

## Filter Asset Metadata

LUT filters need these properties in the `meta` object:

- **`uri`** - URL to the LUT image file (PNG format)
- **`thumbUri`** - URL to the thumbnail preview image
- **`horizontalTileCount`** - Number of horizontal tiles in the LUT grid (typically 5 or 8)
- **`verticalTileCount`** - Number of vertical tiles in the LUT grid (typically 5 or 8)
- **`blockType`** - Must be `//ly.img.ubq/effect/lut_filter` for LUT filters

## Adding a Custom Filter

We register a custom filter source using `engine.asset.addSource()` with a `findAssets` callback. This callback returns filter assets matching the query parameters. After registering the source, we use `cesdk.ui.updateAssetLibraryEntry()` to add our custom source to the filter inspector panel.

```typescript highlight-create-custom-source
    // Add a custom filter to the built-in LUT filter source
    // The ID must follow the format //ly.img.cesdk.filters.lut/{name}
    // for the UI to display the label correctly
    engine.asset.addAssetToSource('ly.img.filter.lut', {
      id: '//ly.img.cesdk.filters.lut/mycustomfilter',
      label: { en: 'MY CUSTOM FILTER' },
      tags: { en: ['custom', 'brand'] },
      meta: {
        uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    });

    // Add translation for the custom filter label
    cesdk.i18n.setTranslations({
      en: {
        'property.lutFilter.mycustomfilter': 'MY CUSTOM FILTER'
      }
    });

    // Create a custom filter asset source for organizing multiple filters
    const customFilterSource: AssetSource = {
      id: 'my-custom-filters',

      async findAssets(
        queryData: AssetQueryData
      ): Promise<AssetsQueryResult | undefined> {
        // Define custom LUT filter assets
        const filters: AssetResult[] = [
          {
            id: 'vintage-warm',
            label: 'Vintage Warm',
            tags: ['vintage', 'warm', 'retro'],
            meta: {
              uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              thumbUri:
                'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              horizontalTileCount: '5',
              verticalTileCount: '5',
              blockType: '//ly.img.ubq/effect/lut_filter'
            }
          },
          {
            id: 'cool-cinema',
            label: 'Cool Cinema',
            tags: ['cinema', 'cool', 'film'],
            meta: {
              uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              thumbUri:
                'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              horizontalTileCount: '5',
              verticalTileCount: '5',
              blockType: '//ly.img.ubq/effect/lut_filter'
            }
          },
          {
            id: 'bw-classic',
            label: 'B&W Classic',
            tags: ['black and white', 'classic', 'monochrome'],
            meta: {
              uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              thumbUri:
                'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              horizontalTileCount: '5',
              verticalTileCount: '5',
              blockType: '//ly.img.ubq/effect/lut_filter'
            }
          }
        ];

        // Filter by query if provided
        let filteredAssets = filters;
        if (queryData.query) {
          const searchTerm = queryData.query.toLowerCase();
          filteredAssets = filters.filter(
            (asset) =>
              asset.label?.toLowerCase().includes(searchTerm) ||
              asset.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        }

        // Filter by groups if provided
        if (queryData.groups && queryData.groups.length > 0) {
          filteredAssets = filteredAssets.filter((asset) =>
            asset.tags?.some((tag) => queryData.groups?.includes(tag))
          );
        }

        // Handle pagination
        const page = queryData.page ?? 0;
        const perPage = queryData.perPage ?? 10;
        const startIndex = page * perPage;
        const paginatedAssets = filteredAssets.slice(
          startIndex,
          startIndex + perPage
        );

        return {
          assets: paginatedAssets,
          total: filteredAssets.length,
          currentPage: page,
          nextPage:
            startIndex + perPage < filteredAssets.length ? page + 1 : undefined
        };
      },

      // Return available filter categories
      async getGroups(): Promise<string[]> {
        return ['vintage', 'cinema', 'black and white'];
      }
    };

    // Register the custom filter source for programmatic access
    engine.asset.addSource(customFilterSource);
```

The `findAssets` callback receives query parameters including pagination (`page`, `perPage`), search terms (`query`), and category filters (`groups`). We filter and paginate the results accordingly.

The `updateAssetLibraryEntry()` call connects our custom source to the `ly.img.filter.lut` panel, making our filters appear alongside the built-in LUT filters when a user selects an image.

### Filter Asset Structure

Each filter asset returned by `findAssets` needs:

- **`id`** - Unique identifier for the filter
- **`label`** - Display name shown in the UI
- **`tags`** - Keywords for search filtering
- **`meta`** - Object containing LUT configuration (uri, thumbUri, tile counts, blockType)

The optional `getGroups()` method returns available filter categories for the UI.

## Loading Filters from JSON Configuration

For larger filter collections, we load definitions from JSON using `engine.asset.addLocalAssetSourceFromJSONString()`. This approach simplifies management of filter libraries.

```typescript highlight-load-from-json-string
    // Load filters from a JSON configuration string
    const filterConfigJSON = JSON.stringify({
      version: '2.0.0',
      id: 'my-json-filters',
      assets: [
        {
          id: 'sunset-glow',
          label: { en: 'Sunset Glow' },
          tags: { en: ['warm', 'sunset', 'golden'] },
          groups: ['Warm Tones'],
          meta: {
            uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            thumbUri:
              'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            horizontalTileCount: '5',
            verticalTileCount: '5',
            blockType: '//ly.img.ubq/effect/lut_filter'
          }
        },
        {
          id: 'ocean-breeze',
          label: { en: 'Ocean Breeze' },
          tags: { en: ['cool', 'blue', 'ocean'] },
          groups: ['Cool Tones'],
          meta: {
            uri: 'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            thumbUri:
              'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            horizontalTileCount: '5',
            verticalTileCount: '5',
            blockType: '//ly.img.ubq/effect/lut_filter'
          }
        }
      ]
    });

    // Create asset source from JSON string
    const jsonSourceId =
      await engine.asset.addLocalAssetSourceFromJSONString(filterConfigJSON);
    // eslint-disable-next-line no-console
    console.log('Created JSON-based filter source:', jsonSourceId);
```

### JSON Structure for Filter Assets

The JSON format includes:

- **`version`** - Schema version (use "2.0.0")
- **`id`** - Unique source identifier
- **`assets`** - Array of filter definitions

Each asset in the array contains:

- **`id`** - Unique filter identifier
- **`label`** - Localized label object (e.g., `{ "en": "Filter Name" }`)
- **`tags`** - Localized tags for search
- **`groups`** - Category assignments for UI organization
- **`meta`** - LUT configuration properties

For filters hosted on a CDN, use `engine.asset.addLocalAssetSourceFromJSONURI()` instead, which resolves relative URLs against the JSON file's parent directory.

## Troubleshooting

### Filters Not Appearing in UI

- Verify the asset source is registered before loading the scene
- Check that filter metadata includes all required fields (`uri`, `thumbUri`, tile counts)
- Ensure the `blockType` is set to `//ly.img.ubq/effect/lut_filter`
- Confirm thumbnails are accessible URLs

### LUT Not Rendering Correctly

- Verify tile count values match the actual LUT image grid dimensions
- Check that the LUT image URL is CORS-enabled for cross-origin requests
- Confirm the LUT image uses PNG format

### Filter Thumbnails Missing

- Verify `thumbUri` points to an accessible image
- Check that thumbnail URLs don't have CORS restrictions
- Ensure thumbnail dimensions are appropriate for UI display (typically 100-200px)

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addSource(source)` | Register a custom asset source with findAssets callback |
| `engine.asset.addLocalAssetSourceFromJSONString(json, basePath)` | Create asset source from inline JSON configuration |
| `engine.asset.addLocalAssetSourceFromJSONURI(uri)` | Load asset source from remote JSON file |
| `engine.asset.findAssets(sourceId, query)` | Query assets from a registered source |
| `engine.asset.findAllSources()` | Get all registered asset source IDs |
| `engine.asset.removeSource(id)` | Remove a registered asset source |
| `cesdk.ui.updateAssetLibraryEntry(entryId, config)` | Add custom sources to filter inspector panel |
| `engine.block.createEffect(type)` | Create effect instance (use `//ly.img.ubq/effect/lut_filter` for LUT filters) |
| `engine.block.setString(effect, property, value)` | Set string property (LUT file URI) |
| `engine.block.setInt(effect, property, value)` | Set integer property (tile counts) |
| `engine.block.setFloat(effect, property, value)` | Set float property (intensity) |
| `engine.block.appendEffect(block, effect)` | Add effect to block's effect stack |

## Next Steps

Now that you understand how to create and register custom filter sources, explore related topics:

- [Apply Filters and Effects](./filters-and-effects/apply.md) - Learn to apply filters to design elements and manage effect stacks
- [Create a Custom LUT Filter](./filters-and-effects/create-custom-lut-filter.md) - Understand LUT image format and create your own color grading filters
- [Blur Effects](./filters-and-effects/blur.md) - Add blur effects to images and videos



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support