> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Template Library](./use-templates/library.md)

---

Configure and populate the Template Library in CE.SDK so users can browse and select predefined design templates.

![](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-use-templates-library-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-use-templates-library-browser)
>
> - [Live demo](https://img.ly/examples/guides-use-templates-library-browser/)

Templates in CE.SDK are pre-designed scenes stored as assets within asset sources. They contain complete scene definitions that users can load and customize. The Template Library provides a centralized way to organize, browse, and access these templates through both the built-in UI and programmatic APIs.

```typescript file=@cesdk_web_examples/guides-use-templates-library-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Template Library
 *
 * This example demonstrates how to configure and populate the Template Library:
 * 1. Creating custom template sources from JSON
 * 2. Handling template application with addLocalSource callback
 * 3. Querying and browsing templates programmatically
 * 4. Managing template sources
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load default asset sources (fonts, etc.)
    await cesdk.addDefaultAssetSources();

    // Create a design scene to work with
    await cesdk.createDesignScene();

    // Create a custom template source with an apply callback
    // The callback handles what happens when a user clicks a template
    engine.asset.addLocalSource('my.custom.templates', undefined, async (asset) => {
      const sceneUri = asset.meta?.uri;
      const scene = engine.scene.get();
      if (!sceneUri || scene == null) return undefined;

      const sceneUrl = new URL(sceneUri, window.location.href);
      await engine.scene.applyTemplateFromURL(sceneUrl.href);

      return scene;
    });

    // Add template assets to the source
    // Each asset needs meta.uri pointing to a .scene file
    engine.asset.addAssetToSource('my.custom.templates', {
      id: 'postcard-1',
      label: { en: 'Postcard Design' },
      tags: { en: ['postcard', 'card'] },
      groups: ['cards'],
      meta: {
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_1.jpg',
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene'
      }
    });

    engine.asset.addAssetToSource('my.custom.templates', {
      id: 'postcard-2',
      label: { en: 'Business Card' },
      tags: { en: ['business', 'card'] },
      groups: ['business'],
      meta: {
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_2.jpg',
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.scene'
      }
    });

    // Create an asset library entry for the custom templates
    cesdk.ui.addAssetLibraryEntry({
      id: 'custom-templates-entry',
      sourceIds: ['my.custom.templates'],
      title: 'Custom Templates',
      icon: '@imgly/Template',
      gridColumns: 2,
      gridItemHeight: 'square'
    });

    // Configure the dock to show ONLY the custom template library
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'custom-templates',
        icon: '@imgly/Template',
        label: 'Custom Templates',
        entries: ['custom-templates-entry']
      }
    ]);

    // Open the custom templates panel on startup (same as clicking dock button)
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['custom-templates-entry']
      }
    });

    // Query templates with filtering options
    const queryResult = await engine.asset.findAssets('my.custom.templates', {
      page: 0,
      perPage: 20,
      groups: ['cards']
    });
    console.log(
      'Templates in "cards" group:',
      queryResult.assets.map((t) => t.id)
    );

    // Query all templates from custom source
    const allCustomTemplates = await engine.asset.findAssets(
      'my.custom.templates',
      {
        page: 0,
        perPage: 100
      }
    );
    console.log('Total custom templates:', allCustomTemplates.total);

    // List all registered asset sources
    const allSources = engine.asset.findAllSources();
    const templateSources = allSources.filter(
      (id) => id.includes('template') || id === 'my.custom.templates'
    );
    console.log('Template sources:', templateSources);

    // Get available groups from a source
    const groups = await engine.asset.getGroups('my.custom.templates');
    console.log('Available groups:', groups);

    // Subscribe to source changes
    const unsubscribeAdd = engine.asset.onAssetSourceAdded((sourceId) => {
      console.log('Asset source added:', sourceId);
    });

    const unsubscribeRemove = engine.asset.onAssetSourceRemoved((sourceId) => {
      console.log('Asset source removed:', sourceId);
    });

    // Clean up subscriptions when done (for demonstration)
    setTimeout(() => {
      unsubscribeAdd();
      unsubscribeRemove();
    }, 10000);

    console.log('Template Library example loaded successfully!');
  }
}

export default Example;
```

This guide covers how to create custom template sources, handle template application, query templates programmatically, and manage template sources.

## Setup

Before creating custom template sources, load the default asset sources to ensure fonts and other base assets are available. Then create a design scene to work with.

```typescript highlight=highlight-setup
    // Load default asset sources (fonts, etc.)
    await cesdk.addDefaultAssetSources();

    // Create a design scene to work with
    await cesdk.createDesignScene();
```

## Using the Built-in Template UI

The CE.SDK editor UI includes a template panel where users can browse and select templates. The panel displays thumbnails organized by groups, allowing users to filter templates by category.

To access templates in the UI:

1. Open the asset library panel
2. Navigate to the Templates section
3. Browse templates with thumbnail previews
4. Click a template to apply it to the current design

The template panel automatically displays templates from all registered template sources.

## Creating Custom Template Sources

You can create custom template sources to provide your own branded templates. We use `engine.asset.addLocalSource()` to create a source with an apply callback, then `engine.asset.addAssetToSource()` to add template assets.

```typescript highlight=highlight-custom-source
    // Create a custom template source with an apply callback
    // The callback handles what happens when a user clicks a template
    engine.asset.addLocalSource('my.custom.templates', undefined, async (asset) => {
      const sceneUri = asset.meta?.uri;
      const scene = engine.scene.get();
      if (!sceneUri || scene == null) return undefined;

      const sceneUrl = new URL(sceneUri, window.location.href);
      await engine.scene.applyTemplateFromURL(sceneUrl.href);

      return scene;
    });

    // Add template assets to the source
    // Each asset needs meta.uri pointing to a .scene file
    engine.asset.addAssetToSource('my.custom.templates', {
      id: 'postcard-1',
      label: { en: 'Postcard Design' },
      tags: { en: ['postcard', 'card'] },
      groups: ['cards'],
      meta: {
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_1.jpg',
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene'
      }
    });

    engine.asset.addAssetToSource('my.custom.templates', {
      id: 'postcard-2',
      label: { en: 'Business Card' },
      tags: { en: ['business', 'card'] },
      groups: ['business'],
      meta: {
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_2.jpg',
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.scene'
      }
    });
```

The `addLocalSource()` method creates the source and registers a callback that handles template application when users click a template. The callback:

1. Extracts the scene URI from `asset.meta.uri`
2. Resolves the URI to an absolute URL
3. Applies the template using `engine.scene.applyTemplateFromURL()`
4. Returns the scene ID to indicate successful application

Each template asset added with `addAssetToSource()` can include:

- `id` - Unique identifier for the template
- `label` - Localized display name (e.g., `{ en: 'Business Card' }`)
- `tags` - Searchable keywords for filtering
- `groups` - Categories for organization
- `meta.uri` - URL to the `.scene` file (required for template application)
- `meta.thumbUri` - Thumbnail image URL

### From Remote URI

For production use, you can load templates from a hosted JSON file using `engine.asset.addLocalAssetSourceFromJSONURI()`. The parent directory of the JSON URI becomes the base path for resolving relative URLs within the JSON.

```typescript
const sourceId = await engine.asset.addLocalAssetSourceFromJSONURI(
  'https://cdn.example.com/templates/content.json'
);
```

## Querying Templates Programmatically

We use `engine.asset.findAssets()` to search and retrieve templates from a source. You can query by groups, tags, or search text to find specific templates.

```typescript highlight=highlight-query-templates
    // Query templates with filtering options
    const queryResult = await engine.asset.findAssets('my.custom.templates', {
      page: 0,
      perPage: 20,
      groups: ['cards']
    });
    console.log(
      'Templates in "cards" group:',
      queryResult.assets.map((t) => t.id)
    );

    // Query all templates from custom source
    const allCustomTemplates = await engine.asset.findAssets(
      'my.custom.templates',
      {
        page: 0,
        perPage: 100
      }
    );
    console.log('Total custom templates:', allCustomTemplates.total);
```

The query options include:

- `page` and `perPage` - Pagination controls
- `groups` - Filter by group names (e.g., `['business', 'cards']`)
- `tags` - Filter by tags
- `query` - Text search across labels and tags

The result object contains:

- `assets` - Array of template assets matching the query
- `total` - Total number of matching templates
- `currentPage` - Current page index
- `nextPage` - Next page index (if available)

## Managing Template Sources

CE.SDK provides APIs to manage the lifecycle of template sources, including listing, monitoring, and removing sources.

```typescript highlight=highlight-manage-sources
    // List all registered asset sources
    const allSources = engine.asset.findAllSources();
    const templateSources = allSources.filter(
      (id) => id.includes('template') || id === 'my.custom.templates'
    );
    console.log('Template sources:', templateSources);

    // Get available groups from a source
    const groups = await engine.asset.getGroups('my.custom.templates');
    console.log('Available groups:', groups);

    // Subscribe to source changes
    const unsubscribeAdd = engine.asset.onAssetSourceAdded((sourceId) => {
      console.log('Asset source added:', sourceId);
    });

    const unsubscribeRemove = engine.asset.onAssetSourceRemoved((sourceId) => {
      console.log('Asset source removed:', sourceId);
    });

    // Clean up subscriptions when done (for demonstration)
    setTimeout(() => {
      unsubscribeAdd();
      unsubscribeRemove();
    }, 10000);
```

Key management methods:

- `engine.asset.findAllSources()` - Lists all registered asset source IDs
- `engine.asset.getGroups(sourceId)` - Gets available groups from a source
- `engine.asset.removeSource(sourceId)` - Removes an asset source
- `engine.asset.onAssetSourceAdded(callback)` - Subscribe to source additions
- `engine.asset.onAssetSourceRemoved(callback)` - Subscribe to source removals

## Troubleshooting

Common issues when working with the Template Library:

- **Templates not appearing in UI**: Verify the source is registered by checking `engine.asset.findAllSources()`. Ensure the source ID matches what you expect.

- **Thumbnails not loading**: Check that `thumbUri` values are accessible URLs with proper CORS headers enabled.

- **Scene files not loading**: Ensure `meta.uri` values point to valid `.scene` files that are accessible from the browser.



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support