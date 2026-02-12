> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Retrieve Mimetype](./import-media/retrieve-mimetype.md)

---

Detect the MIME type of resources loaded in the engine and relocate them to external URLs using `engine.editor.getMimeType()` and `engine.editor.relocateResource()`.

![Retrieve MIME Type example showing a loaded scene with embedded images](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-retrieve-mimetype-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-retrieve-mimetype-browser)
>
> - [Live demo](https://img.ly/examples/guides-import-media-retrieve-mimetype-browser/)

When loading scene archives in CE.SDK, embedded media resources are stored with internal `buffer://` URIs rather than their original URLs. These resources include both images and fonts used in the scene. To process these resources correctly—for instance when uploading to a CDN, displaying previews, or exporting a clean scene file—you need to determine their MIME type and relocate them to external URLs.

```typescript file=@cesdk_web_examples/guides-import-media-retrieve-mimetype-browser/browser.ts reference-only
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
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Load an archive that contains embedded resources (images and fonts)
    const archiveUrl =
      'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';
    await engine.scene.loadFromArchiveURL(archiveUrl);

    // Find all transient resources (embedded media with buffer:// URIs)
    // This includes both images and fonts embedded in the archive
    const transientResources = engine.editor.findAllTransientResources();
    console.log(`Found ${transientResources.length} transient resources`);

    if (transientResources.length === 0) {
      console.log('No transient resources found in the loaded archive');
      return;
    }

    // Get MIME types for all resources to see what's included
    const resourcesByType: Record<string, number> = {};
    for (const resource of transientResources) {
      const mimeType = await engine.editor.getMimeType(resource.URL);
      resourcesByType[mimeType] = (resourcesByType[mimeType] || 0) + 1;
    }
    console.log('Resources by type:', resourcesByType);

    // Filter to find only image resources
    const imageResources = [];
    for (const resource of transientResources) {
      const mimeType = await engine.editor.getMimeType(resource.URL);
      if (mimeType.startsWith('image/')) {
        imageResources.push({ ...resource, mimeType });
      }
    }
    console.log(`Found ${imageResources.length} image resources`);

    // Relocate all transient resources from buffer:// URIs to blob: URLs
    // This is useful for displaying previews or preparing for upload
    for (const resource of transientResources) {
      const bufferUri = resource.URL;
      // Skip internal bundle resources
      if (bufferUri.includes('bundle://ly.img.cesdk/')) continue;

      const mimeType = await engine.editor.getMimeType(bufferUri);
      const length = engine.editor.getBufferLength(bufferUri);
      const data = engine.editor.getBufferData(bufferUri, 0, length);

      // Create a blob URL from the buffer data
      const blob = new Blob([new Uint8Array(data)], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      // Update the scene to use the new URL instead of buffer://
      engine.editor.relocateResource(bufferUri, blobUrl);
    }
    console.log('Relocated all transient resources to blob URLs');

    // After relocation, the scene references blob: URLs instead of buffer:// URIs
    // Note: blob: URLs are still considered transient (runtime) resources
    // For permanent storage, upload to a CDN and relocate to https:// URLs
    console.log(`Relocated ${transientResources.length} buffer:// URIs to blob: URLs`);

    // Zoom to fit the scene
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      await cesdk.engine.scene.zoomToBlock(pages[0], { padding: 40 });
    }

    console.log('Retrieve MIME Type example loaded successfully');
  }
}

export default Example;
```

This guide covers loading a scene archive, finding transient resources, retrieving MIME types, filtering by resource type, and relocating resources to external URLs for a clean scene export.

## Loading a Scene Archive

Scene archives package a complete scene along with its embedded assets. When loaded, images, fonts, and other media are stored in memory and referenced via buffer URIs.

```typescript highlight=highlight-load-archive
// Load an archive that contains embedded resources (images and fonts)
const archiveUrl =
  'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';
await engine.scene.loadFromArchiveURL(archiveUrl);
```

After loading an archive, you can find all embedded resources using the `findAllTransientResources()` method.

## Finding Transient Resources

Transient resources are embedded media files stored in memory with `buffer://` URIs. Use `findAllTransientResources()` to get a list of all such resources in the current scene. This includes both images and fonts.

```typescript highlight=highlight-find-transient-resources
// Find all transient resources (embedded media with buffer:// URIs)
// This includes both images and fonts embedded in the archive
const transientResources = engine.editor.findAllTransientResources();
console.log(`Found ${transientResources.length} transient resources`);
```

Each resource object contains a `URL` property with the buffer URI and a `size` property indicating the resource size in bytes.

## Retrieving the MIME Type

Use `getMimeType()` to detect the format of each embedded resource. This is useful for categorizing resources or determining how to process them.

```typescript highlight=highlight-get-mimetype
// Get MIME types for all resources to see what's included
const resourcesByType: Record<string, number> = {};
for (const resource of transientResources) {
  const mimeType = await engine.editor.getMimeType(resource.URL);
  resourcesByType[mimeType] = (resourcesByType[mimeType] || 0) + 1;
}
console.log('Resources by type:', resourcesByType);
```

The method returns standard MIME type strings:

**Image types:**

- `image/jpeg` for JPEG images
- `image/png` for PNG images
- `image/webp` for WebP images
- `image/gif` for GIF images

**Font types:**

- `font/ttf` for TrueType fonts
- `font/otf` for OpenType fonts
- `font/woff` for WOFF fonts
- `font/woff2` for WOFF2 fonts

## Filtering Resources by Type

Since transient resources include both images and fonts, you may want to filter them by MIME type prefix to process only specific resource types.

```typescript highlight=highlight-filter-images
// Filter to find only image resources
const imageResources = [];
for (const resource of transientResources) {
  const mimeType = await engine.editor.getMimeType(resource.URL);
  if (mimeType.startsWith('image/')) {
    imageResources.push({ ...resource, mimeType });
  }
}
console.log(`Found ${imageResources.length} image resources`);
```

This pattern allows you to separate image processing from font processing, or to handle each resource type differently.

## Relocating Resources

After extracting buffer data, use `relocateResource()` to update the scene to reference new URLs instead of `buffer://` URIs. This is essential when uploading resources to a CDN or storage service.

```typescript highlight=highlight-relocate-resources
    // Relocate all transient resources from buffer:// URIs to blob: URLs
    // This is useful for displaying previews or preparing for upload
    for (const resource of transientResources) {
      const bufferUri = resource.URL;
      // Skip internal bundle resources
      if (bufferUri.includes('bundle://ly.img.cesdk/')) continue;

      const mimeType = await engine.editor.getMimeType(bufferUri);
      const length = engine.editor.getBufferLength(bufferUri);
      const data = engine.editor.getBufferData(bufferUri, 0, length);

      // Create a blob URL from the buffer data
      const blob = new Blob([new Uint8Array(data)], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      // Update the scene to use the new URL instead of buffer://
      engine.editor.relocateResource(bufferUri, blobUrl);
    }
    console.log('Relocated all transient resources to blob URLs');
```

In the browser, you can create blob URLs for immediate use. For production workflows, you would upload the blob data to your storage service and use the returned CDN URL.

## Verifying Relocation

After relocating all resources, verify that no `buffer://` URIs remain. Note that `blob:` URLs are still considered transient resources by the engine—they are runtime URLs that exist only in the current browser session.

```typescript highlight=highlight-verify-relocation
// After relocation, the scene references blob: URLs instead of buffer:// URIs
// Note: blob: URLs are still considered transient (runtime) resources
// For permanent storage, upload to a CDN and relocate to https:// URLs
console.log(`Relocated ${transientResources.length} buffer:// URIs to blob: URLs`);
```

For production use, upload resources to a CDN and relocate to permanent `https://` URLs. This produces a scene file that can be stored and loaded in future sessions.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.editor.findAllTransientResources()` | Returns an array of transient resources with `URL` and `size` properties. Includes images, fonts, and other embedded media. |
| `engine.editor.getMimeType(uri)` | Returns the MIME type of the resource at the given URI. Downloads the resource if not already cached. |
| `engine.editor.getBufferLength(uri)` | Returns the byte length of the buffer at the given URI. |
| `engine.editor.getBufferData(uri, offset, length)` | Returns raw binary data from the buffer, starting at the specified offset for the given length. |
| `engine.editor.relocateResource(currentUrl, relocatedUrl)` | Updates all references to `currentUrl` in the scene to use `relocatedUrl` instead. |

## Troubleshooting

### MIME Type Returns Empty String

If `getMimeType()` returns an empty string, the resource format could not be determined. This may happen if:

- The buffer URI is invalid or the resource was not properly embedded
- The resource data is corrupted or in an unsupported format

### No Transient Resources Found

If `findAllTransientResources()` returns an empty array:

- Verify the archive was loaded successfully
- Check that the scene contains embedded resources rather than external URL references
- Some templates may use external CDN URLs instead of embedded resources

### Resources Not Relocated

If transient resources remain after calling `relocateResource()`:

- Ensure you're using the exact buffer URI from `findAllTransientResources()`
- Check that you're not skipping any resources in your loop
- Bundle resources (`bundle://ly.img.cesdk/`) are internal and cannot be relocated



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support