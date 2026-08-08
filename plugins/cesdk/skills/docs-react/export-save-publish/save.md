> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Save](./export-save-publish/save.md)

---

Save and serialize designs in CE.SDK for later retrieval, sharing, or storage using string or archive formats.

![Save designs showing different save format options](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.81.0-nightly.20260808/examples/guides-export-save-publish-save-browser/index.html)

CE.SDK provides two formats for persisting designs. Choose the format based on your storage and portability requirements.

```typescript file=@cesdk_web_examples/guides-export-save-publish-save-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ImageColorsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
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

    await cesdk.addPlugin(new DesignEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    const engine = cesdk.engine;

    await engine.scene.load(
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
      await cesdk.utils.downloadFile(sceneBlob, 'text/plain;charset=UTF-8');
      cesdk.ui.showNotification({
        message: `Scene downloaded (${(sceneString.length / 1024).toFixed(
          1
        )} KB)`,
        type: 'success'
      });
    };

    // Button: Save to Archive & Download
    const handleSaveToArchive = async () => {
      const archiveBlob = await engine.scene.saveToArchive();
      await cesdk.utils.downloadFile(archiveBlob, 'application/zip');
      cesdk.ui.showNotification({
        message: `Archive downloaded (${(archiveBlob.size / 1024).toFixed(
          1
        )} KB)`,
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

    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
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
      }
    );
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

Both formats are saved as `.imgly` files — use this extension when persisting them. Either kind loads back through the same `engine.scene.load()` call, which detects the format automatically; `.scene` and `.zip` files also load.

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

## Compression Options

Saved scenes are compressed with Zstd by default, which makes them much smaller and
speeds up both saving and loading. Pass a format explicitly to change the level, or to turn
compression off.

```typescript
import { CompressionFormat, CompressionLevel } from '@cesdk/cesdk-js';

// Save a scene string with Zstd compression
const compressed = await cesdk.engine.scene.saveToString({
  compression: {
    format: CompressionFormat.Zstd,
    level: CompressionLevel.Default
  }
});

// Save an archive whose scene is compressed
const archive = await cesdk.engine.scene.saveToArchive({
  compression: {
    format: CompressionFormat.Zstd,
    level: CompressionLevel.Default
  }
});
```

**Compression Formats:**

- `CompressionFormat.Zstd` - Zstandard compression (default)
- `CompressionFormat.None` - No compression

**Compression Levels:**

- `CompressionLevel.Fastest` - Fastest compression, larger output
- `CompressionLevel.Default` - Balanced speed and size (recommended)
- `CompressionLevel.Best` - Best compression, noticeably slower

A compressed scene string stays a plain string, so you can still store it in a text column or send it as JSON. It carries a `UBQ2` prefix instead of `UBQ1`; `load` accepts both.

In an archive, compression applies to the scene only. Bundled images, video and fonts are stored as they are, because they already are compressed formats — so the saving depends on how much of your archive is scene rather than media.

## Download to User Device

Use `cesdk.utils.downloadFile()` to trigger a browser download with the correct MIME type.

For scene strings, convert to a Blob first:

```typescript highlight=highlight-download-scene
const sceneBlob = new Blob([sceneString], {
  type: 'application/octet-stream'
});
await cesdk.utils.downloadFile(sceneBlob, 'text/plain;charset=UTF-8');
```

For archive blobs, pass directly to the download utility:

```typescript highlight=highlight-download-archive
await cesdk.utils.downloadFile(archiveBlob, 'application/zip');
```

This utility handles creating and revoking object URLs automatically.

## Load Scene from File

Use the built-in `importScene` action to open a file picker for scene files (`.imgly` or `.scene`). This restores a previously saved design from its serialized string format.

```typescript highlight=highlight-load-scene
const handleLoadScene = async () => {
  await cesdk.actions.run('importScene', { format: 'scene' });
};
```

Scene files are lightweight but require the original asset URLs to remain accessible.

## Load Archive from File

Load a self-contained `.imgly` archive (the `.zip` extension also works) that includes all embedded assets.

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

This executes the registered handler for `saveScene`, which by default downloads the scene file named with the `.imgly` extension.

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
| `engine.scene.load()` | Load scene or archive from URL or string |
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

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support