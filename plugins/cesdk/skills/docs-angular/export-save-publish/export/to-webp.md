> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To WebP](./export-save-publish/export/to-webp.md)

---

Export designs to WebP format for optimized web delivery with smaller file sizes than PNG or JPEG.

![Export to WebP showing the editor with export options](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-to-webp-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-to-webp-browser)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-export-to-webp-browser/)

WebP delivers smaller file sizes than PNG and JPEG while preserving image quality and transparency support.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-webp-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Export to WebP Guide
 *
 * Demonstrates exporting designs to WebP format with:
 * - Built-in export action triggered programmatically
 * - Three export buttons showcasing different quality presets
 * - Lossy, lossless, and social media export options
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required');
    }

    const engine = cesdk.engine;

    // Load template and zoom to fit
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');

    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Three export buttons with different WebP settings
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'webp-lossy',
          label: 'Lossy',
          icon: '@imgly/Download',
          onClick: async () => {
            const p = engine.scene.getCurrentPage()!;
            // Export with lossy compression
            const blob = await engine.block.export(p, {
              mimeType: 'image/webp',
              webpQuality: 0.8
            });
            // Download using CE.SDK utils
            await cesdk.utils.downloadFile(blob, 'image/webp');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'webp-lossless',
          label: 'Lossless',
          icon: '@imgly/Download',
          onClick: async () => {
            const p = engine.scene.getCurrentPage()!;
            const blob = await engine.block.export(p, {
              mimeType: 'image/webp',
              webpQuality: 1.0
            });
            await cesdk.utils.downloadFile(blob, 'image/webp');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'webp-social',
          label: 'Social',
          icon: '@imgly/Download',
          onClick: async () => {
            const p = engine.scene.getCurrentPage()!;
            // Export with target dimensions for social media
            const blob = await engine.block.export(p, {
              mimeType: 'image/webp',
              webpQuality: 0.9,
              targetWidth: 1200,
              targetHeight: 630
            });
            await cesdk.utils.downloadFile(blob, 'image/webp');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-action',
          label: 'Export',
          icon: '@imgly/Download',
          onClick: () => {
            // Run built-in export with WebP format
            cesdk.actions.run('exportDesign', { mimeType: 'image/webp' });
          }
        }
      ]
    });
  }
}

export default Example;
```

This guide covers exporting to WebP, configuring quality settings, and triggering downloads.

## Export to WebP

Call `engine.block.export()` with `mimeType: 'image/webp'` and a `webpQuality` value between 0 and 1.

```typescript highlight=highlight-export-webp
// Export with lossy compression
const blob = await engine.block.export(p, {
  mimeType: 'image/webp',
  webpQuality: 0.8
});
```

The `webpQuality` parameter controls compression. A value of 0.8 provides a good balance between file size and visual quality for most use cases.

## Export Options

WebP export supports these options:

| Option | Type | Description |
|--------|------|-------------|
| `mimeType` | `'image/webp'` | Required. Specifies WebP format |
| `webpQuality` | `number` | Quality from 0 to 1. Default 1.0 (lossless) |
| `targetWidth` | `number` | Optional resize width |
| `targetHeight` | `number` | Optional resize height |

Combine `targetWidth` and `targetHeight` to resize the output, useful for social media or thumbnail generation.

```typescript highlight=highlight-export-options
// Export with target dimensions for social media
const blob = await engine.block.export(p, {
  mimeType: 'image/webp',
  webpQuality: 0.9,
  targetWidth: 1200,
  targetHeight: 630
});
```

Set `webpQuality` to 1.0 for lossless compression when pixel-perfect output is required.

## Built-in Export Action

Run the `exportDesign` action to execute the default export flow programmatically.

```typescript highlight=highlight-trigger-export
// Run built-in export with WebP format
cesdk.actions.run('exportDesign', { mimeType: 'image/webp' });
```

This executes the registered export action, which handles the complete export process including format selection and file download.

## Download Export

Use `cesdk.utils.downloadFile()` to trigger the browser's download dialog for the exported blob.

```typescript highlight=highlight-download
// Download using CE.SDK utils
await cesdk.utils.downloadFile(blob, 'image/webp');
```

Pass the blob and MIME type to prompt the user to save the file locally.

> **Note:** WebP is supported in all modern browsers. For older browsers, consider PNG or JPEG as fallback formats.

## API Reference

| API | Description |
|-----|-------------|
| `engine.block.export()` | Exports a block to an image blob with format and quality options |
| `cesdk.actions.run()` | Runs a built-in action like `exportDesign` |
| `cesdk.utils.downloadFile()` | Triggers browser download dialog for a blob |

## Next Steps

[Export Overview](./export-save-publish/export/overview.md) - Learn about all supported export formats and their options.

[Export to PDF](./export-save-publish/export/to-pdf.md) - Generate print-ready PDF documents from your designs.

[Size Limits](./export-save-publish/export/size-limits.md) - Understand export size constraints and optimization strategies.

[Partial Export](./export-save-publish/export/partial-export.md) - Export specific blocks or regions instead of the full design.



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support