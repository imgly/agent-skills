> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Save](./export-save-publish/save.md)

---

Save and serialize designs in CE.SDK for later retrieval, sharing, or storage using string or archive formats.

![Save designs showing different save format options](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-save-browser/)

CE.SDK provides two formats for persisting designs. Choose the format based on your storage and portability requirements.

```typescript file=@cesdk_web_examples/guides-export-save-publish-save-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Save Designs Guide
 *
 * Demonstrates how to save and serialize designs in CE.SDK:
 * - Saving scenes to string format for database storage
 * - Saving scenes to archive format with embedded assets
 * - Using built-in save actions and customization
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
      throw new Error('CE.SDK instance is required');
    }

    const engine = cesdk.engine;

    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    const page = engine.scene.getCurrentPage();
    if (page == null) {
      throw new Error('No page found in scene');
    }
    engine.scene.zoomToBlock(page, { padding: 40 });

    cesdk.actions.register('saveScene', async () => {
      const sceneString = await engine.scene.saveToString();
      // Send to your backend API
      console.log('Custom save:', sceneString.length, 'bytes');
    });

    // Button: Save Scene & Download
    const handleSaveScene = async () => {
      const sceneString = await engine.scene.saveToString();
      const sceneBlob = new Blob([sceneString], {
        type: 'application/octet-stream'
      });
      await cesdk.utils.downloadFile(sceneBlob, 'application/octet-stream');
      cesdk.ui.showNotification({
        message: `Scene downloaded (${(sceneString.length / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Button: Save to Archive & Download
    const handleSaveToArchive = async () => {
      const archiveBlob = await engine.scene.saveToArchive();
      await cesdk.utils.downloadFile(archiveBlob, 'application/zip');
      cesdk.ui.showNotification({
        message: `Archive downloaded (${(archiveBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    const handleLoadScene = async () => {
      await cesdk.actions.run('importScene', { format: 'scene' });
    };

    const handleLoadArchive = async () => {
      await cesdk.actions.run('importScene', { format: 'archive' });
      const loadedPage = engine.scene.getCurrentPage();
      if (loadedPage != null) {
        engine.scene.zoomToBlock(loadedPage, { padding: 40 });
      }
    };

    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'save-scene',
          label: 'Save Scene',
          icon: '@imgly/Save',
          onClick: handleSaveScene
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'save-archive',
          label: 'Save Archive',
          icon: '@imgly/Download',
          onClick: handleSaveToArchive
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'load-scene',
          label: 'Load Scene',
          icon: '@imgly/Upload',
          onClick: handleLoadScene
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'load-archive',
          label: 'Load Archive',
          icon: '@imgly/Upload',
          onClick: handleLoadArchive
        }
      ]
    });
  }
}

export default Example;
```

## Save Format Comparison

| Format | Method | Assets | Best For |
| ------ | ------ | ------ | -------- |
| String | `saveToString()` | Referenced by URL | Database storage, cloud sync |
| Archive | `saveToArchive()` | Embedded in ZIP | Offline use, file sharing |

**String format** produces a lightweight Base64-encoded string where assets remain as URL references. Use this when asset URLs will remain accessible.

**Archive format** creates a self-contained ZIP with all assets embedded. Use this for portable designs that work offline.

## Save to String

Serialize the current scene to a Base64-encoded string suitable for database storage.

```typescript highlight=highlight-save-to-string
const sceneString = await engine.scene.saveToString();
```

The string contains the complete scene structure but references assets by their original URLs.

## Save to Archive

Create a self-contained ZIP file with the scene and all embedded assets.

```typescript highlight=highlight-save-to-archive
const archiveBlob = await engine.scene.saveToArchive();
```

The archive includes all pages, elements, and asset data in a single portable file.

## Download to User Device

Use `cesdk.utils.downloadFile()` to trigger a browser download with the correct MIME type.

For scene strings, convert to a Blob first:

```typescript highlight=highlight-download-scene
const sceneBlob = new Blob([sceneString], {
  type: 'application/octet-stream'
});
await cesdk.utils.downloadFile(sceneBlob, 'application/octet-stream');
```

For archive blobs, pass directly to the download utility:

```typescript highlight=highlight-download-archive
await cesdk.utils.downloadFile(archiveBlob, 'application/zip');
```

This utility handles creating and revoking object URLs automatically.

## Load Scene from File

Use the built-in `importScene` action to open a file picker for `.scene` files. This restores a previously saved design from its serialized string format.

```typescript highlight=highlight-load-scene
const handleLoadScene = async () => {
  await cesdk.actions.run('importScene', { format: 'scene' });
};
```

Scene files are lightweight but require the original asset URLs to remain accessible.

## Load Archive from File

Load a self-contained `.zip` archive that includes all embedded assets.

```typescript highlight=highlight-load-archive
const handleLoadArchive = async () => {
  await cesdk.actions.run('importScene', { format: 'archive' });
```

Archives are portable and work offline since all assets are bundled within the file.

## Built-in Save Action

CE.SDK includes a built-in `saveScene` action that integrates with the navigation bar.

### Running an Action

Trigger the default save behavior programmatically using `actions.run()`:

```typescript
await cesdk.actions.run('saveScene');
```

This executes the registered handler for `saveScene`, which by default downloads the scene file.

### Customizing an Action

Override the default behavior by registering a custom handler:

```typescript highlight=highlight-register-custom-action
cesdk.actions.register('saveScene', async () => {
  const sceneString = await engine.scene.saveToString();
  // Send to your backend API
  console.log('Custom save:', sceneString.length, 'bytes');
});
```

The registered handler runs when the built-in save button is clicked or when the action is triggered via `actions.run()`.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.scene.saveToString()` | Serialize scene to Base64 string |
| `engine.scene.saveToArchive()` | Save scene with assets as ZIP blob |
| `engine.scene.loadFromString()` | Load scene from serialized string |
| `engine.scene.loadFromURL()` | Load scene from remote URL |
| `engine.scene.loadFromArchiveURL()` | Load scene from URL (file://, http://, https://, or object URL) |
| `cesdk.utils.downloadFile()` | Download blob or string to user device |
| `cesdk.actions.run()` | Execute a registered action with parameters |
| `cesdk.actions.register()` | Register or override an action handler |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Export designs to image, PDF, and video formats
- [Load Scene](./open-the-editor/load-scene.md) - Load scenes from remote URLs and archives
- [Store Custom Metadata](./export-save-publish/store-custom-metadata.md) - Attach metadata like tags or version info to designs
- [Partial Export](./export-save-publish/export/partial-export.md) - Export individual blocks or selections



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support