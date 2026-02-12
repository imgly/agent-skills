> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Import From Remote Source](./import-media/from-remote-source.md) > [Versioning of Assets](./import-media/from-remote-source/asset-versioning.md)

---

Manage how CE.SDK stores and resolves asset URLs in saved designs, ensuring designs remain functional when assets are updated or moved.

![Asset versioning example showing CE.SDK editor with image blocks](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-from-remote-source-asset-versioning-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-from-remote-source-asset-versioning-browser)
>
> - [Live demo](https://img.ly/examples/guides-import-media-from-remote-source-asset-versioning-browser/)

CE.SDK references assets via URIs rather than embedding files directly into designs. When you save a design with `engine.scene.saveToString()`, asset URLs are stored as strings. On load, CE.SDK fetches assets from those URLs. This approach keeps saved designs small but means URL changes can break existing designs. This guide explains how CE.SDK stores asset references and strategies for managing asset URLs over time.

```typescript file=@cesdk_web_examples/guides-import-media-from-remote-source-asset-versioning-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Asset Versioning Guide
 *
 * Demonstrates how CE.SDK handles asset URLs in saved designs:
 * - How assets are stored as URL references
 * - Scene serialization vs archive export
 * - Inspecting and modifying asset URLs
 * - Strategies for versioned asset URLs
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create a design scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set up page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Create an image block with a remote URL
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    const imageBlock = await engine.block.addImage(imageUri, {
      x: 50,
      y: 50,
      size: { width: 300, height: 200 }
    });

    // Get the fill block that contains the image URI
    const fill = engine.block.getFill(imageBlock);

    // Inspect the stored URI - this is exactly what gets saved in the scene
    const storedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
    console.log('Stored image URI:', storedUri);

    // Save the scene to a string - URLs are preserved as references
    const sceneString = await engine.scene.saveToString();
    console.log('Scene saved to string, length:', sceneString.length);

    // The scene string contains the URL reference, not the image data itself
    // This keeps the saved scene small and loads quickly

    // Alternatively, save as an archive with embedded assets
    const archiveBlob = await engine.scene.saveToArchive();
    console.log('Archive created, size:', archiveBlob.size, 'bytes');

    // Archives are self-contained - they include all asset data
    // Use archives when designs need to work offline or across environments

    // Programmatically update an asset URL (e.g., for CDN migration)
    const newUri = 'https://img.ly/static/ubq_samples/sample_2.jpg';
    engine.block.setString(fill, 'fill/image/imageFileURI', newUri);

    // Verify the change
    const updatedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
    console.log('Updated image URI:', updatedUri);

    // Find all graphic blocks to batch update their asset URLs
    const graphicBlocks = engine.block.findByType('graphic');
    console.log('Found graphic blocks:', graphicBlocks.length);

    // Iterate through blocks to inspect or update their fills
    for (const blockId of graphicBlocks) {
      const blockFill = engine.block.getFill(blockId);
      const fillType = engine.block.getType(blockFill);

      if (fillType === '//ly.img.ubq/fill/image') {
        const uri = engine.block.getString(
          blockFill,
          'fill/image/imageFileURI'
        );
        console.log('Image block found with URI:', uri);

        // Example: migrate from old CDN to new CDN
        if (uri.includes('old-cdn.example.com')) {
          const migratedUri = uri.replace(
            'old-cdn.example.com',
            'new-cdn.example.com'
          );
          engine.block.setString(
            blockFill,
            'fill/image/imageFileURI',
            migratedUri
          );
        }
      }
    }

    // Demonstrate versioned URL patterns

    // Path-based versioning: include version in the URL path
    const pathVersionedUrl = 'https://cdn.example.com/assets/v2/logo.png';
    console.log('Path-versioned URL:', pathVersionedUrl);

    // Hash-based versioning: include content hash in filename
    const hashVersionedUrl = 'https://cdn.example.com/assets/logo-a1b2c3d4.png';
    console.log('Hash-versioned URL:', hashVersionedUrl);

    // Query parameter versioning: append version as query string
    const queryVersionedUrl = 'https://cdn.example.com/assets/logo.png?v=2';
    console.log('Query-versioned URL:', queryVersionedUrl);

    // Add a second image to make the scene more visually interesting
    const secondImageUri = 'https://img.ly/static/ubq_samples/sample_3.jpg';
    await engine.block.addImage(secondImageUri, {
      x: 400,
      y: 50,
      size: { width: 300, height: 200 }
    });

    // Select the first image block to show it in the canvas inspector
    engine.block.select(imageBlock);

    console.log(
      'Asset versioning guide initialized. Check console for URL inspection results.'
    );
  }
}

export default Example;
```

This guide covers how to inspect asset URLs stored in designs, the difference between scene serialization and archive export, how to programmatically update asset URLs, and strategies for versioned URL schemes.

## How Asset URLs Are Stored

Assets in a scene are blocks with fill properties containing URI strings. When you add an image or video to a design, CE.SDK creates a fill block that stores the source URL. We can use `engine.block.getFill()` to get the fill block and `engine.block.getString()` to inspect the stored URI.

```typescript highlight=highlight-how-urls-stored
    // Create an image block with a remote URL
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    const imageBlock = await engine.block.addImage(imageUri, {
      x: 50,
      y: 50,
      size: { width: 300, height: 200 }
    });

    // Get the fill block that contains the image URI
    const fill = engine.block.getFill(imageBlock);

    // Inspect the stored URI - this is exactly what gets saved in the scene
    const storedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
    console.log('Stored image URI:', storedUri);
```

The `fill/image/imageFileURI` property contains exactly what gets written to the saved scene. CE.SDK doesn't transform or normalize these URLs—they're stored and loaded as-is.

## Scene Serialization vs Archive Export

CE.SDK provides two approaches for saving designs, each with different trade-offs for asset handling.

### Saving as a Scene String

The `saveToString()` method serializes the scene structure while keeping asset references as URLs. This produces small files that load quickly, but requires the original assets to remain available at their URLs.

```typescript highlight=highlight-save-scene
    // Save the scene to a string - URLs are preserved as references
    const sceneString = await engine.scene.saveToString();
    console.log('Scene saved to string, length:', sceneString.length);

    // The scene string contains the URL reference, not the image data itself
    // This keeps the saved scene small and loads quickly
```

Use scene strings when:

- Assets are hosted on a stable CDN with reliable URLs
- You want to keep storage costs low
- Designs need to load quickly
- You can guarantee asset availability

### Saving as an Archive

The `saveToArchive()` method bundles the scene with all referenced assets into a ZIP file. This creates a self-contained package that works without network access.

```typescript highlight=highlight-save-archive
    // Alternatively, save as an archive with embedded assets
    const archiveBlob = await engine.scene.saveToArchive();
    console.log('Archive created, size:', archiveBlob.size, 'bytes');

    // Archives are self-contained - they include all asset data
    // Use archives when designs need to work offline or across environments
```

Use archives when:

- Designs need to work offline
- You're migrating designs between environments
- You can't guarantee long-term URL availability
- Portability is more important than file size

| Approach | Method | Assets | File Size | Portability |
|----------|--------|--------|-----------|-------------|
| Scene | `saveToString()` | Referenced by URL | Small | Requires URL availability |
| Archive | `saveToArchive()` | Embedded in ZIP | Larger | Self-contained |

## What Happens When URLs Change

When a design is loaded and an asset URL returns a 404 or is otherwise unavailable, the block appears empty or shows an error state. Browser caching may temporarily mask broken URLs—a user might see cached content while others see failures.

CE.SDK doesn't provide automatic fallbacks or retries for failed asset loads. If some assets fail while others succeed, the design loads partially. To prevent broken designs, ensure assets remain available at their original URLs or migrate designs when URLs change.

## Updating Asset URLs Programmatically

When you need to migrate assets to a new location, you can load existing scenes, update the URLs, and save the modified scene. We use `engine.block.setString()` to update the fill property.

```typescript highlight=highlight-update-url
    // Programmatically update an asset URL (e.g., for CDN migration)
    const newUri = 'https://img.ly/static/ubq_samples/sample_2.jpg';
    engine.block.setString(fill, 'fill/image/imageFileURI', newUri);

    // Verify the change
    const updatedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
    console.log('Updated image URI:', updatedUri);
```

For batch updates, iterate through all blocks of a given type and update their fills.

```typescript highlight=highlight-find-blocks
    // Find all graphic blocks to batch update their asset URLs
    const graphicBlocks = engine.block.findByType('graphic');
    console.log('Found graphic blocks:', graphicBlocks.length);

    // Iterate through blocks to inspect or update their fills
    for (const blockId of graphicBlocks) {
      const blockFill = engine.block.getFill(blockId);
      const fillType = engine.block.getType(blockFill);

      if (fillType === '//ly.img.ubq/fill/image') {
        const uri = engine.block.getString(
          blockFill,
          'fill/image/imageFileURI'
        );
        console.log('Image block found with URI:', uri);

        // Example: migrate from old CDN to new CDN
        if (uri.includes('old-cdn.example.com')) {
          const migratedUri = uri.replace(
            'old-cdn.example.com',
            'new-cdn.example.com'
          );
          engine.block.setString(
            blockFill,
            'fill/image/imageFileURI',
            migratedUri
          );
        }
      }
    }
```

This pattern is useful for CDN migrations or restructuring asset directories.

## Strategies for Versioned Asset URLs

Designing your URL scheme to support versioning prevents accidental overwrites and makes migrations easier. We recommend three approaches.

```typescript highlight=highlight-versioned-urls
    // Demonstrate versioned URL patterns

    // Path-based versioning: include version in the URL path
    const pathVersionedUrl = 'https://cdn.example.com/assets/v2/logo.png';
    console.log('Path-versioned URL:', pathVersionedUrl);

    // Hash-based versioning: include content hash in filename
    const hashVersionedUrl = 'https://cdn.example.com/assets/logo-a1b2c3d4.png';
    console.log('Hash-versioned URL:', hashVersionedUrl);

    // Query parameter versioning: append version as query string
    const queryVersionedUrl = 'https://cdn.example.com/assets/logo.png?v=2';
    console.log('Query-versioned URL:', queryVersionedUrl);
```

### Path-Based Versioning

Include version in the URL path: `https://cdn.example.com/assets/v2/logo.png`. When you update assets, increment the version directory. Old designs reference old paths while new designs use new paths. Both versions can coexist on the same CDN.

### Hash-Based Filenames

Use content hashes in filenames: `logo-a1b2c3d4.png`. The URL changes whenever content changes, ensuring automatic cache invalidation. Build tools like Webpack and Vite generate these automatically. This pattern works well for content-addressable storage.

### Query Parameter Versioning

Append version as query parameter: `logo.png?v=2`. The base URL stays the same but the version parameter forces cache invalidation. Note that some CDNs ignore query parameters for caching—verify your CDN configuration before relying on this approach.

## Best Practices

When managing asset URLs in production:

- **Use immutable URLs**: Content-addressed or versioned paths prevent accidental overwrites
- **Keep old assets available**: Don't delete assets that may be referenced by saved designs
- **Use archives for portability**: Export as archive when designs need to work offline or across environments
- **Plan CDN migrations carefully**: Update saved designs before decommissioning old URLs
- **Set appropriate cache headers**: Balance performance with freshness requirements
- **Document your URL scheme**: Make versioning strategy clear for your team

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Asset shows old version | Browser cache | Clear cache or use cache-busting URL |
| Asset not loading | URL changed or deleted | Verify URL accessibility, update scene |
| Design partially loads | Some assets unavailable | Check all asset URLs, consider archive export |
| Archive too large | Many/large embedded assets | Optimize assets before archiving |

## Next Steps

- [Save Designs](./export-save-publish/save.md) — Save and serialize designs
- [Export Overview](./export-save-publish/export/overview.md) — Export options including archives



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support