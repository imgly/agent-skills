> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Import a Design](./open-the-editor/import-design.md) > [From Archive](./open-the-editor/import-design/from-archive.md)

---

Load archived CE.SDK scenes that bundle design structure with all fonts, images, and assets in a single portable file.

![Import Design from Archive example showing archive loading workflow](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-import-design-from-archive-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-import-design-from-archive-browser)
>
> - [Live demo](https://img.ly/examples/guides-open-the-editor-import-design-from-archive-browser/)

Archives solve the portability problem inherent in scene files. While scene files reference assets by URL, archives package everything together in a single `.zip` file. If asset URLs become unavailable, scene files fail to load properly. Archives avoid this issue by bundling all fonts, images, videos, and other resources directly within the archive, making them self-contained and reliable across different environments.

```typescript file=@cesdk_web_examples/guides-open-the-editor-import-design-from-archive-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import { calculateGridLayout } from './utils';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Start with a blank design scene
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // ===== Method 1: Load Archive from URL =====
    // Archives are self-contained ZIP files containing both the scene
    // structure and all referenced assets (images, fonts, videos, etc.)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _archiveUrl = 'https://example.com/designs/project-bundle.zip';

    // Load the archive using loadFromArchiveURL
    // await engine.scene.loadFromArchiveURL(_archiveUrl);

    // The scene is now loaded with all bundled assets

    // ===== Method 2: Load Archive from User Upload =====
    // For user-uploaded archive files, create an object URL from the File

    // Pattern for handling user uploads (attach to a button in your UI):
    const handleFileUpload = async (file: File) => {
      const userArchiveUrl = URL.createObjectURL(file);

      try {
        await engine.scene.loadFromArchiveURL(userArchiveUrl);
        console.log('User archive loaded successfully');
      } catch (error) {
        console.error('Failed to load user archive:', error);
      } finally {
        URL.revokeObjectURL(userArchiveUrl);
      }
    };

    // Example: Create file input for user uploads
    // In production, attach this to your UI button
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.zip';
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
    };

    // ===== Method 3: Load Archive from Blob =====
    // When you have an archive as a Blob (from fetch, API, or database),
    // create an object URL and load it

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _loadArchiveFromBlob = async (archiveBlob: Blob): Promise<void> => {
      const blobUrl = URL.createObjectURL(archiveBlob);

      try {
        await engine.scene.loadFromArchiveURL(blobUrl);
        console.log('Archive loaded from blob successfully');
      } catch (error) {
        console.error('Failed to load archive from blob:', error);
        throw error;
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    };

    // In production, this blob would come from your API or storage
    // await _loadArchiveFromBlob(archiveBlob);

    // ===== Method 4: Modify Loaded Archive =====
    // After loading an archive, the scene is immediately editable
    // All blocks and assets from the archive are available

    // const textBlocks = engine.block.findByType('text');
    // if (textBlocks.length > 0) {
    //   engine.block.setString(textBlocks[0], 'text/text', 'Loaded from Archive');
    //   // Archive loads can be undone: engine.editor.undo();
    // }

    // ===== Understanding Archive Contents =====
    // Archives contain:
    // 1. scene.json - The scene structure and properties
    // 2. Asset directories (images/, fonts/, videos/, audio/)
    // 3. Relative asset references like "./images/photo-123.jpg"

    // This self-contained structure makes archives portable:
    // - No external URL dependencies
    // - All assets bundled together
    // - Works offline or across different environments

    // Create a visual demonstration showing the archive loading workflow
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);

    const layout = calculateGridLayout(1920, 1080, 3, {
      spacing: 40,
      margin: 80
    });

    // Create visual elements showing the workflow
    const step1Block = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      {
        ...layout.getPosition(0),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const step2Block = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      {
        ...layout.getPosition(1),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const step3Block = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        ...layout.getPosition(2),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    engine.block.appendChild(page, step1Block);
    engine.block.appendChild(page, step2Block);
    engine.block.appendChild(page, step3Block);

    // Add labels
    const labels = ['1. Create Archive', '2. Store Archive', '3. Load Archive'];

    const blocks = [step1Block, step2Block, step3Block];
    blocks.forEach((block, index) => {
      engine.block.appendChild(page, block);

      const label = engine.block.create('text');
      const pos = layout.getPosition(index);

      engine.block.setString(label, 'text/text', labels[index]);
      engine.block.setWidth(label, layout.blockWidth);
      engine.block.setPositionX(label, pos.x);
      engine.block.setPositionY(label, pos.y + layout.blockHeight + 20);
      engine.block.setFloat(label, 'text/fontSize', 32);
      engine.block.setColor(label, 'fill/solid/color', {
        r: 0.2,
        g: 0.2,
        b: 0.2,
        a: 1.0
      });

      engine.block.appendChild(page, label);
    });

    // Zoom to show full canvas
    await engine.scene.zoomToBlock(page, {
      padding: 40
    });
  }
}

export default Example;
```

This guide covers how to load archived scenes from URLs, handle user-uploaded archive files, and work with loaded archive content.

## Understanding CE.SDK Archives

CE.SDK archives are `.zip` files created with `engine.scene.saveToArchive()` that contain both the scene structure and all referenced assets. The scene file uses relative paths to reference bundled assets, eliminating the need for external URLs to remain accessible.

Archives contain a predictable directory structure:

- `scene.json` - Scene structure, layout, and element properties
- `images/` - Image assets referenced in the scene
- `fonts/` - Font files used by text blocks
- `videos/` - Video content referenced in the scene
- `audio/` - Audio tracks and sound effects

The scene file references these assets with relative URIs like `./images/photo-abc123.jpg`, ensuring they're always accessible from within the archive.

## Load Archive from URL

Use `engine.scene.loadFromArchiveURL()` to load a CE.SDK archive from a remote or local URL. The engine fetches the archive, extracts its contents, and loads the scene with all bundled assets.

```typescript highlight-load-from-archive-url
    // Archives are self-contained ZIP files containing both the scene
    // structure and all referenced assets (images, fonts, videos, etc.)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _archiveUrl = 'https://example.com/designs/project-bundle.zip';

    // Load the archive using loadFromArchiveURL
    // await engine.scene.loadFromArchiveURL(_archiveUrl);

    // The scene is now loaded with all bundled assets
```

The method is asynchronous and returns a Promise that resolves when the archive finishes loading. The loaded scene replaces the current scene in the editor and becomes immediately editable.

Always wrap archive loading in try-catch blocks to handle potential failures gracefully. Common failure scenarios include network errors, corrupted archive files, or unsupported archive formats. The error object provides details about what went wrong.

For production usage, archive URLs typically point to cloud storage or CDN locations where archives are permanently stored. The example above demonstrates loading after creating a demo archive, but in real applications you would use existing archive URLs directly from your storage system.

> **Note:** **Unified API**: Both browser and Node.js environments use `engine.scene.loadFromArchiveURL(url)` to load archives. In browsers, use HTTP/HTTPS URLs or object URLs created from Blobs. In Node.js, convert local file paths to `file://` URLs.

## Load User-Uploaded Archives

For user-uploaded archive files, create an object URL from the File blob and load it using `loadFromArchiveURL()`. This pattern works for file inputs, drag-and-drop uploads, or any scenario where users provide archive files.

```typescript highlight-load-from-user-upload
    // For user-uploaded archive files, create an object URL from the File

    // Pattern for handling user uploads (attach to a button in your UI):
    const handleFileUpload = async (file: File) => {
      const userArchiveUrl = URL.createObjectURL(file);

      try {
        await engine.scene.loadFromArchiveURL(userArchiveUrl);
        console.log('User archive loaded successfully');
      } catch (error) {
        console.error('Failed to load user archive:', error);
      } finally {
        URL.revokeObjectURL(userArchiveUrl);
      }
    };

    // Example: Create file input for user uploads
    // In production, attach this to your UI button
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.zip';
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
    };
```

The example shows a complete file upload handler that creates an input element, handles the file selection, and loads the archive with proper error handling. Object URLs are temporary references to blob data. Always revoke them with `URL.revokeObjectURL()` after loading completes to free memory. The archive content remains loaded in the scene even after the object URL is revoked.

## Load Archive from Blob

When you have an archive as a Blob from API responses, fetch operations, or database storage, create an object URL and load it. The example shows a reusable function that handles blob loading with proper error handling and cleanup.

```typescript highlight-load-from-blob
    // When you have an archive as a Blob (from fetch, API, or database),
    // create an object URL and load it

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _loadArchiveFromBlob = async (archiveBlob: Blob): Promise<void> => {
      const blobUrl = URL.createObjectURL(archiveBlob);

      try {
        await engine.scene.loadFromArchiveURL(blobUrl);
        console.log('Archive loaded from blob successfully');
      } catch (error) {
        console.error('Failed to load archive from blob:', error);
        throw error;
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    };

    // In production, this blob would come from your API or storage
    // await _loadArchiveFromBlob(archiveBlob);
```

This pattern is useful for:

- **Authenticated APIs** - Download archives from endpoints requiring authentication tokens
- **Local storage** - Retrieve archives from IndexedDB or browser local storage
- **Server responses** - Process archives from fetch() or XMLHttpRequest responses
- **Data conversion** - Handle archives from various sources (base64, ArrayBuffer, etc.)

The function encapsulates the object URL lifecycle, ensuring proper cleanup even if loading fails.

## Modify Loaded Archives

After loading an archive, the scene is immediately editable. All blocks, properties, and assets from the archive are restored and accessible through the standard block API.

```typescript highlight-modify-loaded-archive
    // After loading an archive, the scene is immediately editable
    // All blocks and assets from the archive are available

    // const textBlocks = engine.block.findByType('text');
    // if (textBlocks.length > 0) {
    //   engine.block.setString(textBlocks[0], 'text/text', 'Loaded from Archive');
    //   // Archive loads can be undone: engine.editor.undo();
    // }
```

Archive loads can be reverted using `engine.editor.undo()`, which removes the loaded scene and restores the previous state. This is useful for implementing undo/redo functionality in your application.

## Archive Contents and Structure

Archives use standard ZIP compression with a specific internal structure that makes them self-contained. The scene file references assets using relative paths instead of absolute URLs.

```typescript highlight-archive-contents
    // Archives contain:
    // 1. scene.json - The scene structure and properties
    // 2. Asset directories (images/, fonts/, videos/, audio/)
    // 3. Relative asset references like "./images/photo-123.jpg"

    // This self-contained structure makes archives portable:
    // - No external URL dependencies
    // - All assets bundled together
    // - Works offline or across different environments
```

This self-contained structure provides several benefits:

- **No external dependencies** - All assets are bundled, so external URLs don't need to remain accessible
- **Portable across environments** - Archives work identically whether loaded in development, staging, or production
- **Offline support** - Archives can be loaded without network connectivity
- **Version control friendly** - Entire designs can be versioned as single files
- **Simplified sharing** - Send one file instead of coordinating multiple asset URLs

The relative URI pattern (`./images/photo-123.jpg`) ensures assets are resolved from within the archive regardless of where the archive is hosted or stored.

## Archives vs Scene Files

CE.SDK provides two save formats that handle assets differently:

**Scene Files** (`.scene`) are lightweight JSON-based files that store design structure, layout, and properties. When you save a scene, it stores the design structure, all block properties, and URL references to images, fonts, and other resources. Assets are referenced by their original URLs.

Use scene files when:

- Assets remain accessible at their original URLs
- You want minimal file sizes for faster transfers
- Assets are managed separately (CDN, asset management system)
- You're working in a stable environment with reliable asset URLs

**Archives** (`.zip`) bundle the scene file with all referenced assets into a single package. When you create an archive, CE.SDK packages the scene structure along with all images, fonts, videos, and other resources. Assets in archived scenes use relative paths (like `./images/photo-123.jpg`) instead of external URLs, making them portable across different environments.

Use archives when:

- You need to share designs with others who don't have access to your asset URLs
- Assets might become unavailable at their original locations
- You're moving designs between environments (development → production)
- You need offline support or long-term storage
- Portability and self-containment are priorities

> **Note:** **Key Trade-off**: Scene files are lightweight but depend on external asset URLs. Archives are larger but self-contained and portable. Choose based on your reliability and portability requirements.

For more details on creating archives, see the [Save a Scene](./export-save-publish/save.md) guide.

## Asset Availability and Portability

Archives solve the fundamental asset availability problem that affects scene files. When you load a scene file, all referenced assets must remain accessible at their original URLs. If an image was located at `https://example.com/image.jpg` when the scene was saved, it must still be accessible there when loaded later.

This creates several challenges:

- **URL changes** - Moving assets to different servers or CDNs breaks scene file references
- **Authentication** - Scenes referencing authenticated URLs won't load for other users
- **Network dependencies** - Scene files require network access to fetch assets
- **Long-term storage** - Asset URLs may become unavailable over time

Archives solve these problems by bundling assets inside the `.zip` file with relative references. This makes them:

- **Environment-independent** - Work identically in development, staging, and production
- **Offline-capable** - Load without network connectivity
- **Shareable** - Send complete designs without coordinating asset access
- **Reliable** - No external dependencies that might fail

> **Note:** If you're building a cloud-based editor where asset URLs might change or become unavailable, consider using archives for long-term storage and portability. For real-time collaborative editing where assets are always available, scene files provide faster saves and transfers.

## Troubleshooting

### Archive Fails to Load

If `loadFromArchiveURL()` throws an error or fails silently:

- **Verify the archive was created with `scene.saveToArchive()`** - CE.SDK archives use a specific internal structure that standard ZIP files don't have
- **Check the file is a valid ZIP** - Corrupted archives or renamed files will fail validation
- **Ensure the archive URL is accessible** - Test the URL in a browser to confirm it returns the file
- **Verify CORS headers** - Remote archive URLs must allow cross-origin requests if loaded from a different domain
- **Check URL authentication** - Signed URLs must remain valid during the load operation
- **Check browser console for errors** - Specific error messages often indicate the root cause

### Archive Loads But Assets Are Missing

If the scene loads but images, fonts, or other assets don't appear:

- **Verify the archive wasn't manually edited** - Modifying archive contents or structure breaks internal references
- **Check that fonts are properly embedded** - Some font licenses may prevent embedding in archives
- **Ensure asset formats are supported** - Unsupported codecs or formats may not render properly
- **Look for console warnings** - Missing asset warnings often provide specific file names

### Object URL Issues

If object URLs cause problems:

- **Don't revoke URLs too early** - Wait for `loadFromArchiveURL()` to complete before revoking
- **Handle async properly** - Use `await` to ensure loading finishes before cleanup
- **Check memory usage** - Create and revoke object URLs promptly to avoid memory leaks

### Large Archive Performance

For archives over 50-100MB:

- **Show loading indicators** - Archive extraction is asynchronous and may take time
- **Consider streaming** - For very large archives, load assets progressively if possible
- **Optimize source assets** - Compress images and videos before creating archives
- **Test upload limits** - Some hosting providers limit file upload sizes

## API Reference

| Method                              | Purpose                                           |
| ----------------------------------- | ------------------------------------------------- |
| `engine.scene.loadFromArchiveURL()` | Load archived scene with bundled assets from URL  |
| `engine.scene.saveToArchive()`      | Create archive blob bundling scene with assets    |
| `engine.scene.loadFromURL()`        | Load scene file (without bundled assets)          |
| `engine.block.findByType()`         | Find blocks by type in loaded scene               |
| `engine.editor.undo()`              | Revert scene load operation                       |
| `URL.createObjectURL()`             | Create URL for local blob                         |
| `URL.revokeObjectURL()`             | Clean up object URL                               |



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support