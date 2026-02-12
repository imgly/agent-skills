> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To JPEG](./export-save-publish/export/to-jpeg.md)

---

Export CE.SDK designs to JPEG format—ideal for photographs, social media, and web content where file size matters more than transparency.

![Export to JPEG](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-to-jpeg-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-to-jpeg-browser)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-export-to-jpeg-browser/)

JPEG uses lossy compression optimized for photographs and smooth color gradients. Unlike PNG, JPEG does not support transparency—transparent areas render with a solid background.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-jpeg-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) throw new Error('CE.SDK instance is required');

    const engine = cesdk.engine;

    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage()!;

    // Zoom to fit page in view
    await engine.scene.zoomToBlock(page);

    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            await cesdk.actions.run('exportDesign', {
              mimeType: 'image/jpeg',
              jpegQuality: 0.9
            });
          },
          key: 'export-action',
          label: 'Export',
          icon: '@imgly/Download',
        },

        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            const currentPage = engine.scene.getCurrentPage()!;
            const exported = await engine.block.export(currentPage, {
              mimeType: 'image/jpeg',
              jpegQuality: 0.9
            });
            await cesdk.utils.downloadFile(exported, 'image/jpeg');
            cesdk.ui.showNotification({
              message: `Standard (${(exported.size / 1024).toFixed(0)} KB)`,
              type: 'success'
            });
          },
          key: 'export-standard',
          label: 'Standard',
          icon: '@imgly/Save'
        },
        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            const currentPage = engine.scene.getCurrentPage()!;
            const exported = await engine.block.export(currentPage, {
              mimeType: 'image/jpeg',
              jpegQuality: 1.0
            });
            await cesdk.utils.downloadFile(exported, 'image/jpeg');
            cesdk.ui.showNotification({
              message: `High Quality (${(exported.size / 1024).toFixed(0)} KB)`,
              type: 'success'
            });
          },
          key: 'export-high',
          label: 'High Quality',
          icon: '@imgly/Save'
        },
        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            const currentPage = engine.scene.getCurrentPage()!;
            const exported = await engine.block.export(currentPage, {
              mimeType: 'image/jpeg',
              targetWidth: 1920,
              targetHeight: 1080
            });
            await cesdk.utils.downloadFile(exported, 'image/jpeg');
            cesdk.ui.showNotification({
              message: `1920×1080 (${(exported.size / 1024).toFixed(0)} KB)`,
              type: 'success'
            });
          },
          key: 'export-hd',
          label: '1920×1080',
          icon: '@imgly/Save'
        }
      ]
    });

    cesdk.actions.register('exportDesign', async () => {
      const currentPage = engine.scene.getCurrentPage()!;
      const jpeg = await engine.block.export(currentPage, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.9
      });
      await cesdk.utils.downloadFile(jpeg, 'image/jpeg');
    });
  }
}

export default Example;
```

This guide covers exporting to JPEG, configuring quality and dimensions, and integrating CE.SDK's built-in export action.

## Export to JPEG

Export a design block to JPEG by calling `engine.block.export()` with `mimeType: 'image/jpeg'`. Use `cesdk.utils.downloadFile()` to trigger a browser download.

```typescript highlight=highlight-export-jpeg
const exported = await engine.block.export(currentPage, {
  mimeType: 'image/jpeg',
  jpegQuality: 0.9
});
await cesdk.utils.downloadFile(exported, 'image/jpeg');
```

The `jpegQuality` parameter accepts values from greater than 0 to 1. Higher values produce better quality at larger file sizes. The default is 0.9.

## Export Options

JPEG export supports these configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mimeType` | `string` | `'image/png'` | Set to `'image/jpeg'` for JPEG |
| `jpegQuality` | `number` | `0.9` | Quality from >0 to 1 |
| `targetWidth` | `number` | — | Output width in pixels |
| `targetHeight` | `number` | — | Output height in pixels |

### Quality Control

Set `jpegQuality` to 1.0 for maximum quality with minimal compression artifacts. This is useful for archival or print preparation.

```typescript highlight=highlight-export-quality
const exported = await engine.block.export(currentPage, {
  mimeType: 'image/jpeg',
  jpegQuality: 1.0
});
await cesdk.utils.downloadFile(exported, 'image/jpeg');
```

For web delivery, values around 0.8 balance quality and file size effectively.

### Target Dimensions

Specify `targetWidth` and `targetHeight` to export at exact dimensions. The output fills the target size while maintaining aspect ratio.

```typescript highlight=highlight-export-size
const exported = await engine.block.export(currentPage, {
  mimeType: 'image/jpeg',
  targetWidth: 1920,
  targetHeight: 1080
});
await cesdk.utils.downloadFile(exported, 'image/jpeg');
```

## Built-in Export Action

CE.SDK includes a built-in export button you can add to the navigation bar. This provides a familiar export experience without additional code.

```typescript highlight=highlight-builtin-action
{
  id: 'ly.img.action.navigationBar',
  onClick: async () => {
    await cesdk.actions.run('exportDesign', {
      mimeType: 'image/jpeg',
      jpegQuality: 0.9
    });
  },
  key: 'export-action',
  label: 'Export',
  icon: '@imgly/Download',
},
```

The button triggers the `exportDesign` action when clicked. You can customize what happens by registering your own handler.

### Customize Export Behavior

Override the `exportDesign` action to control the export format, quality, and download behavior.

```typescript highlight=highlight-custom-action
cesdk.actions.register('exportDesign', async () => {
  const currentPage = engine.scene.getCurrentPage()!;
  const jpeg = await engine.block.export(currentPage, {
    mimeType: 'image/jpeg',
    jpegQuality: 0.9
  });
  await cesdk.utils.downloadFile(jpeg, 'image/jpeg');
});
```

When you register `exportDesign`, the built-in export button uses your custom handler instead of the default.

## When to Use JPEG

JPEG works well for:

- Photographs and images with gradual color transitions
- Social media posts and web content
- Scenarios where file size matters more than perfect quality

> **Note:** For graphics with sharp edges, text, or transparency, use PNG instead. For modern web delivery with better compression, consider WebP.

## Troubleshooting

**Output looks blurry** — Increase `jpegQuality` toward 1.0, or use PNG for graphics with hard edges.

**File size too large** — Decrease `jpegQuality` to 0.7–0.8, or reduce dimensions with `targetWidth` and `targetHeight`.

**Unexpected background** — JPEG does not support transparency. Use PNG or WebP for transparent content.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.export(block, options)` | Export a block to the specified format |
| `cesdk.utils.downloadFile(blob, mimeType)` | Trigger browser download |
| `cesdk.actions.register(name, handler)` | Register or override an action |
| `cesdk.ui.insertOrderComponent()` | Add components to navigation bar |
| `engine.scene.zoomToBlock(block)` | Zoom camera to fit a block |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) — Compare all available export formats
- [Export to PDF](./export-save-publish/export/to-pdf.md) — Export for print and document workflows
- [Partial Export](./export-save-publish/export/partial-export.md) — Export specific regions or elements
- [Size Limits](./export-save-publish/export/size-limits.md) — Handle large exports and memory constraints



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support