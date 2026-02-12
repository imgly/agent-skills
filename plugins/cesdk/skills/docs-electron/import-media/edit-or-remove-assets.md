> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Edit or Remove Assets](./import-media/edit-or-remove-assets.md)

---

Manage assets in local asset sources by updating metadata, removing individual assets, or deleting entire sources.

![Edit or Remove Assets](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-edit-or-remove-assets-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-edit-or-remove-assets-browser)
>
> - [Live demo](https://img.ly/examples/guides-import-media-edit-or-remove-assets-browser/)

Assets in local sources can be modified or removed after they have been added. CE.SDK provides two levels of removal: individual assets within a source and entire asset sources. This guide covers how to query, update, and remove assets programmatically, as well as how to notify the UI when changes occur.

```typescript file=@cesdk_web_examples/guides-import-media-edit-or-remove-assets-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: false
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // ===== Section 1: Create a Local Asset Source =====
    // Create a local asset source to manage images
    engine.asset.addLocalSource('my-uploads');

    // Add some sample assets to the source
    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-1',
      label: { en: 'Mountain Landscape' },
      tags: { en: ['nature', 'mountain'] },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-2',
      label: { en: 'Ocean Waves' },
      tags: { en: ['nature', 'water'] },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-3',
      label: { en: 'Forest Path' },
      tags: { en: ['nature', 'forest'] },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    // ===== Section 2: Find Assets in a Source =====
    // Query assets from the source to find specific assets
    const result = await engine.asset.findAssets('my-uploads', {
      query: 'nature',
      page: 0,
      perPage: 100
    });

    console.log('Found assets:', result.assets.length);
    const assetToModify = result.assets.find((a) => a.id === 'image-1');
    console.log('Asset to modify:', assetToModify?.label);

    // ===== Section 3: Update Asset Metadata =====
    // To update an asset's metadata, remove it and add an updated version
    // This pattern ensures the asset library reflects the latest data
    engine.asset.removeAssetFromSource('my-uploads', 'image-1');

    // Add the updated version with new metadata
    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-1',
      label: { en: 'Updated Mountain Photo' }, // New label
      tags: { en: ['nature', 'mountain', 'updated'] }, // New tags
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    // ===== Section 4: Remove an Asset from a Source =====
    // Remove a single asset from the source
    // Blocks already using this asset on the canvas remain unaffected
    engine.asset.removeAssetFromSource('my-uploads', 'image-2');
    console.log('Removed image-2 from my-uploads');

    // ===== Section 5: Notify UI of Changes =====
    // After modifying assets, notify the UI to refresh
    // This triggers update events for components like the asset library panel
    engine.asset.assetSourceContentsChanged('my-uploads');

    // ===== Section 6: Create a Second Source for Removal Demo =====
    // Create a temporary source to demonstrate source removal
    engine.asset.addLocalSource('temporary-uploads');

    engine.asset.addAssetToSource('temporary-uploads', {
      id: 'temp-1',
      label: { en: 'Temporary Image' },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_4.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_4.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    // ===== Section 7: Remove an Entire Asset Source =====
    // Remove a complete asset source and all its assets
    // Any UI panels displaying this source will stop showing content
    engine.asset.removeSource('temporary-uploads');
    console.log('Removed temporary-uploads source');

    // ===== Section 8: Listen to Asset Source Events =====
    // Subscribe to lifecycle events for asset sources
    const unsubscribeAdded = engine.asset.onAssetSourceAdded((sourceId) => {
      console.log(`Source added: ${sourceId}`);
    });

    const unsubscribeRemoved = engine.asset.onAssetSourceRemoved((sourceId) => {
      console.log(`Source removed: ${sourceId}`);
    });

    const unsubscribeUpdated = engine.asset.onAssetSourceUpdated((sourceId) => {
      console.log(`Source updated: ${sourceId}`);
    });

    // Demonstrate events by creating and removing a source
    engine.asset.addLocalSource('event-demo-source');
    engine.asset.assetSourceContentsChanged('event-demo-source');
    engine.asset.removeSource('event-demo-source');

    // Clean up subscriptions when no longer needed
    unsubscribeAdded();
    unsubscribeRemoved();
    unsubscribeUpdated();

    // ===== Configure Asset Library Display =====
    // Configure the asset library to show our custom source
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ['my-uploads'],
      gridBackgroundType: 'cover',
      previewBackgroundType: 'contain'
    });

    // Open the asset library to show the custom uploads
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.image']
      }
    });
  }
}

export default Example;
```

## Setup

Initialize CE.SDK and create a local asset source with sample assets. The example creates a design scene and populates a local source with images.

```typescript highlight=highlight-setup
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: false
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
```

## Creating a Local Asset Source

Before editing or removing assets, you need a local source with assets. Use `engine.asset.addLocalSource()` to create a source, then `engine.asset.addAssetToSource()` to populate it.

```typescript highlight=highlight-create-source
    // Create a local asset source to manage images
    engine.asset.addLocalSource('my-uploads');

    // Add some sample assets to the source
    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-1',
      label: { en: 'Mountain Landscape' },
      tags: { en: ['nature', 'mountain'] },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-2',
      label: { en: 'Ocean Waves' },
      tags: { en: ['nature', 'water'] },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-3',
      label: { en: 'Forest Path' },
      tags: { en: ['nature', 'forest'] },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });
```

Each asset has a unique `id`, descriptive `label` and `tags` for searchability, and `meta` properties including the `uri` for the asset file.

## Finding Assets in a Source

Use `engine.asset.findAssets()` to query assets from a source. You can search by query string to match labels and tags, and paginate results for large sources.

```typescript highlight=highlight-find-assets
    // Query assets from the source to find specific assets
    const result = await engine.asset.findAssets('my-uploads', {
      query: 'nature',
      page: 0,
      perPage: 100
    });

    console.log('Found assets:', result.assets.length);
    const assetToModify = result.assets.find((a) => a.id === 'image-1');
    console.log('Asset to modify:', assetToModify?.label);
```

The `findAssets()` method returns an object containing the `assets` array, `total` count, `currentPage`, and optionally `nextPage` for pagination.

## Updating Asset Metadata

CE.SDK does not provide a direct update method for assets. To modify an asset's metadata (labels, tags, URIs), remove the existing asset and add an updated version with the same ID.

```typescript highlight=highlight-update-metadata
    // To update an asset's metadata, remove it and add an updated version
    // This pattern ensures the asset library reflects the latest data
    engine.asset.removeAssetFromSource('my-uploads', 'image-1');

    // Add the updated version with new metadata
    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-1',
      label: { en: 'Updated Mountain Photo' }, // New label
      tags: { en: ['nature', 'mountain', 'updated'] }, // New tags
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });
```

This pattern ensures the asset library reflects the latest metadata. The asset ID remains the same, so any references to the asset continue to work.

## Removing an Asset from a Source

Remove individual assets using `engine.asset.removeAssetFromSource()`. The asset is permanently deleted from the source, but blocks already using that asset on the canvas remain unaffected.

```typescript highlight=highlight-remove-asset
// Remove a single asset from the source
// Blocks already using this asset on the canvas remain unaffected
engine.asset.removeAssetFromSource('my-uploads', 'image-2');
console.log('Removed image-2 from my-uploads');
```

Removing an asset only affects the asset library—it does not modify or delete any blocks that were created using that asset.

## Notifying the UI of Changes

After modifying assets in a source, call `engine.asset.assetSourceContentsChanged()` to notify UI components. This triggers update events for the asset library panel and any other components displaying the source.

```typescript highlight=highlight-notify-ui
// After modifying assets, notify the UI to refresh
// This triggers update events for components like the asset library panel
engine.asset.assetSourceContentsChanged('my-uploads');
```

Without this notification, UI components may show stale data until the user navigates away and returns.

## Creating a Temporary Source

You can create additional sources for temporary or session-specific assets. These sources can be removed entirely when no longer needed.

```typescript highlight=highlight-create-temp-source
    // Create a temporary source to demonstrate source removal
    engine.asset.addLocalSource('temporary-uploads');

    engine.asset.addAssetToSource('temporary-uploads', {
      id: 'temp-1',
      label: { en: 'Temporary Image' },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_4.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_4.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });
```

## Removing an Entire Asset Source

Remove a complete asset source and all its assets using `engine.asset.removeSource()`. Any UI panels displaying this source will stop showing content for that source.

```typescript highlight=highlight-remove-source
// Remove a complete asset source and all its assets
// Any UI panels displaying this source will stop showing content
engine.asset.removeSource('temporary-uploads');
console.log('Removed temporary-uploads source');
```

Use this when cleaning up temporary sources or when a user explicitly deletes an entire category of assets.

## Listening to Asset Source Events

Subscribe to lifecycle events to react when sources are added, removed, or updated. These events are useful for analytics, cleanup tasks, or syncing with external systems.

```typescript highlight=highlight-events
    // Subscribe to lifecycle events for asset sources
    const unsubscribeAdded = engine.asset.onAssetSourceAdded((sourceId) => {
      console.log(`Source added: ${sourceId}`);
    });

    const unsubscribeRemoved = engine.asset.onAssetSourceRemoved((sourceId) => {
      console.log(`Source removed: ${sourceId}`);
    });

    const unsubscribeUpdated = engine.asset.onAssetSourceUpdated((sourceId) => {
      console.log(`Source updated: ${sourceId}`);
    });

    // Demonstrate events by creating and removing a source
    engine.asset.addLocalSource('event-demo-source');
    engine.asset.assetSourceContentsChanged('event-demo-source');
    engine.asset.removeSource('event-demo-source');

    // Clean up subscriptions when no longer needed
    unsubscribeAdded();
    unsubscribeRemoved();
    unsubscribeUpdated();
```

Each subscription returns an unsubscribe function. Call it when you no longer need to receive events to prevent memory leaks.

## Best Practices

- **Query before modifying**: Use `findAssets()` to verify the asset exists before attempting removal
- **Notify UI after changes**: Always call `assetSourceContentsChanged()` after modifying a source
- **Clean up subscriptions**: Store unsubscribe functions and call them when the component unmounts or the source is removed
- **Handle missing assets gracefully**: Check if `findAssets()` returns the expected asset before operating on it
- **Use descriptive IDs**: Choose asset IDs that are unique and meaningful for easier debugging

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Asset not found | ID mismatch or asset already removed | Use `findAssets()` to list available assets |
| UI not updating | Missing notification | Call `assetSourceContentsChanged()` after modifications |
| Cannot remove asset | Source is not a local source | Only local sources support `removeAssetFromSource()` |
| Events not firing | Subscription not active | Verify the subscription was created before the operation |

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `engine.asset.findAssets()` | Asset Discovery | Query assets from a source with filtering and pagination |
| `engine.asset.addAssetToSource()` | Asset Lifecycle | Add or update an asset in a local source |
| `engine.asset.removeAssetFromSource()` | Asset Lifecycle | Remove a single asset from a local source |
| `engine.asset.removeSource()` | Source Management | Remove an entire asset source and all its assets |
| `engine.asset.assetSourceContentsChanged()` | UI Notification | Notify UI that source contents changed |
| `engine.asset.onAssetSourceAdded()` | Event Subscriptions | Subscribe to source addition events |
| `engine.asset.onAssetSourceRemoved()` | Event Subscriptions | Subscribe to source removal events |
| `engine.asset.onAssetSourceUpdated()` | Event Subscriptions | Subscribe to source content change events |



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support