> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Create Thumbnail](./export-save-publish/create-thumbnail.md)

---

Generate thumbnail preview images from CE.SDK scenes by exporting with target dimensions for galleries and design management.

![Create Thumbnail hero image](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-create-thumbnail-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-create-thumbnail-browser)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-create-thumbnail-browser/)

Thumbnails provide visual previews of designs without loading the full editor. Use `engine.block.export()` with `targetWidth` and `targetHeight` options to scale content while maintaining aspect ratio. Supported formats include PNG, JPEG, and WebP.

```typescript file=@cesdk_web_examples/guides-export-save-publish-create-thumbnail-browser/browser.ts reference-only
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
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

    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');
    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Setup thumbnail export functionality
    await this.setupThumbnailActions(cesdk, page);
  }

  private async setupThumbnailActions(
    cesdk: CreativeEditorSDK,
    page: number
  ): Promise<void> {
    const engine = cesdk.engine;

    // Add thumbnail export buttons to navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-thumbnail-small',
          label: 'Small Thumbnail',
          icon: '@imgly/Save',
          onClick: async () => {
            const blob = await engine.block.export(page, {
              mimeType: 'image/jpeg',
              targetWidth: 150,
              targetHeight: 150,
              jpegQuality: 0.8
            });

            await cesdk.utils.downloadFile(blob, 'image/jpeg');
            console.log(
              `✓ Small thumbnail: ${(blob.size / 1024).toFixed(1)} KB`
            );
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-thumbnail-medium',
          label: 'Medium Thumbnail',
          icon: '@imgly/Save',
          onClick: async () => {
            const blob = await engine.block.export(page, {
              mimeType: 'image/jpeg',
              targetWidth: 400,
              targetHeight: 300,
              jpegQuality: 0.85
            });

            await cesdk.utils.downloadFile(blob, 'image/jpeg');
            console.log(
              `✓ Medium thumbnail: ${(blob.size / 1024).toFixed(1)} KB`
            );
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-thumbnail-png',
          label: 'PNG Thumbnail',
          icon: '@imgly/Save',
          onClick: async () => {
            const blob = await engine.block.export(page, {
              mimeType: 'image/png',
              targetWidth: 400,
              targetHeight: 300,
              pngCompressionLevel: 6
            });

            await cesdk.utils.downloadFile(blob, 'image/png');
            console.log(`✓ PNG thumbnail: ${(blob.size / 1024).toFixed(1)} KB`);
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-thumbnail-webp',
          label: 'WebP Thumbnail',
          icon: '@imgly/Save',
          onClick: async () => {
            const blob = await engine.block.export(page, {
              mimeType: 'image/webp',
              targetWidth: 400,
              targetHeight: 300,
              webpQuality: 0.8
            });

            await cesdk.utils.downloadFile(blob, 'image/webp');
            console.log(
              `✓ WebP thumbnail: ${(blob.size / 1024).toFixed(1)} KB`
            );
          }
        }
      ]
    });
  }
}

export default Example;
```

This guide covers exporting thumbnails at specific dimensions, choosing formats, optimizing quality and file size, and generating multiple thumbnail sizes.

## Export a Thumbnail

Call `engine.block.export()` with target dimensions to create a scaled thumbnail. Both `targetWidth` and `targetHeight` must be set together for scaling to work.

```typescript highlight=highlight-thumbnail-small
const blob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  targetWidth: 150,
  targetHeight: 150,
  jpegQuality: 0.8
});
```

The block renders large enough to fill the target size while maintaining aspect ratio. If aspect ratios differ, the output extends beyond the target on one axis.

## Choose Thumbnail Format

Select the format via the `mimeType` option based on your needs:

- **`'image/jpeg'`** — Smaller files, good for photos, no transparency
- **`'image/png'`** — Lossless quality, supports transparency
- **`'image/webp'`** — Best compression, modern browsers only

### JPEG Thumbnails

JPEG works well for photographic content. Control file size with `jpegQuality` (0-1, default 0.9). Values between 0.75-0.85 balance quality and size for thumbnails.

```typescript highlight=highlight-thumbnail-medium
const blob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  targetWidth: 400,
  targetHeight: 300,
  jpegQuality: 0.85
});
```

### PNG Thumbnails

PNG provides lossless quality with transparency support. Control encoding speed vs. file size with `pngCompressionLevel` (0-9, default 5).

```typescript highlight=highlight-thumbnail-png
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 400,
  targetHeight: 300,
  pngCompressionLevel: 6
});
```

### WebP Thumbnails

WebP offers the best compression for modern browsers. Control quality with `webpQuality` (0-1, default 1.0 for lossless).

```typescript highlight=highlight-thumbnail-webp
const blob = await engine.block.export(page, {
  mimeType: 'image/webp',
  targetWidth: 400,
  targetHeight: 300,
  webpQuality: 0.8
});
```

## Common Thumbnail Sizes

Standard sizes for different use cases:

| Size | Dimensions | Use Case |
| ---- | ---------- | -------- |
| Small | 150×150 | Grid galleries, file browsers |
| Medium | 400×300 | Preview panels, cards |
| Large | 800×600 | Full previews, detail views |

## Optimize Thumbnail Quality

Balance quality with file size using format-specific options:

| Format | Option | Range | Default | Notes |
| ------ | ------ | ----- | ------- | ----- |
| JPEG | `jpegQuality` | 0-1 | 0.9 | Lower = smaller files, visible artifacts |
| PNG | `pngCompressionLevel` | 0-9 | 5 | Higher = smaller files, slower encoding |
| WebP | `webpQuality` | 0-1 | 1.0 | 1.0 = lossless, lower = lossy compression |

For thumbnails, JPEG quality of 0.8 or WebP quality of 0.75-0.85 typically provides good results with small file sizes.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(blockId, options)` | Export a block as image with format and dimension options |
| `engine.scene.getCurrentPage()` | Get the current page block ID |
| `cesdk.utils.downloadFile(blob, mimeType)` | Download a blob to the user's device |



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support