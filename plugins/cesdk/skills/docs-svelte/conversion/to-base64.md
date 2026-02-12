> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Conversion](./conversion.md) > [To Base64](./conversion/to-base64.md)

---

Convert CE.SDK exports to Base64-encoded strings for embedding in HTML, storing in databases, or transmitting via JSON APIs.

![To Base64](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-conversion-to-base64-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-conversion-to-base64-browser)
>
> - [Live demo](https://img.ly/examples/guides-conversion-to-base64-browser/)

Base64 encoding transforms binary image data into ASCII text, enabling you to embed images directly in HTML, store them in text-only databases, or transmit them through JSON APIs without binary handling.

```typescript file=@cesdk_web_examples/guides-conversion-to-base64-browser/browser.ts reference-only
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

    await engine.scene.zoomToBlock(page);

    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            const currentPage = engine.scene.getCurrentPage()!;
            const blob = await engine.block.export(currentPage, {
              mimeType: 'image/png'
            });
            const base64 = await this.blobToBase64(blob);
            await cesdk.utils.downloadFile(blob, 'image/png');
            cesdk.ui.showNotification({
              message: `Base64: ${(base64.length / 1024).toFixed(0)} KB`,
              type: 'success'
            });
          },
          key: 'export-base64',
          label: 'To Base64',
          icon: '@imgly/Save'
        }
      ]
    });

    cesdk.actions.register('exportDesign', async () => {
      const currentPage = engine.scene.getCurrentPage()!;
      const blob = await engine.block.export(currentPage, {
        mimeType: 'image/png'
      });
      const base64 = await this.blobToBase64(blob);
      await cesdk.utils.downloadFile(blob, 'image/png');
    });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }
}

export default Example;
```

## Export a Block to Base64

Use `engine.block.export()` to export a design block as a Blob, then convert it to a Base64 data URI.

```typescript
const currentPage = engine.scene.getCurrentPage()!;
const blob = await engine.block.export(currentPage, {
  mimeType: 'image/png'
});
const base64 = await blobToBase64(blob);
```

The export returns a Blob containing the rendered image. You then convert this Blob to a Base64 data URI using the browser's `FileReader` API. The resulting string includes the MIME type prefix (`data:image/png;base64,...`), making it ready for immediate use as an image source.

## Convert Blob to Base64

Convert the exported Blob into a Base64 data URI using the browser's `FileReader` API.

```typescript highlight=highlight-convert-base64
private blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
```

The `readAsDataURL()` method returns a complete data URI including the MIME type prefix (`data:image/png;base64,...`). This wrapper converts the callback-based FileReader into a Promise for cleaner async/await usage.

## Customize the Built-in Export Action

Override the default `exportDesign` action to integrate Base64 conversion into CE.SDK's built-in export flow.

```typescript highlight=highlight-custom-action
cesdk.actions.register('exportDesign', async () => {
  const currentPage = engine.scene.getCurrentPage()!;
  const blob = await engine.block.export(currentPage, {
    mimeType: 'image/png'
  });
  const base64 = await this.blobToBase64(blob);
  await cesdk.utils.downloadFile(blob, 'image/png');
});
```

When registered, this action replaces the default export behavior. Any UI component or keyboard shortcut that triggers `exportDesign` will use your custom handler instead.

## Download the Export

Use `cesdk.utils.downloadFile()` to save the exported Blob to the user's device. The method accepts a Blob and MIME type, triggering a browser download with the appropriate file extension.

## When to Use Base64

Base64 encoding works well for:

- Embedding images directly in HTML or CSS without additional HTTP requests
- Storing images in text-only databases like Redis or localStorage
- Transmitting images through JSON APIs that don't support binary data
- Generating data URIs for email templates

> **Note:** Base64 increases file size by approximately 33%. For images larger than 100KB, consider binary storage or direct URL references instead.

## Troubleshooting

**Base64 string too long** — Use JPEG or WebP formats with lower quality settings. Reduce dimensions with `targetWidth` and `targetHeight` export options.

**Image not displaying** — Verify the data URI includes the correct MIME type prefix. Check that the string wasn't truncated during storage or transmission.

**Performance issues** — FileReader operations are asynchronous but encoding large images can still block the UI. Consider Web Workers for images over 1MB.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.export(block, options)` | Export a block to a Blob with format options (`mimeType`, `jpegQuality`, `webpQuality`, `targetWidth`, `targetHeight`) |
| `engine.scene.getCurrentPage()` | Get the currently active page block |
| `FileReader.readAsDataURL(blob)` | Convert Blob to Base64 data URI (Browser API) |
| `cesdk.utils.downloadFile(blob, mimeType)` | Download a Blob as a file |
| `cesdk.actions.register(name, handler)` | Register or override an action |
| `cesdk.ui.showNotification(options)` | Display a notification to the user |

## Next Steps

- [Export Options](./export-save-publish/export/overview.md) — Explore all available export formats and configuration
- [Export to PDF](./export-save-publish/export/to-pdf.md) — Generate PDFs for print and document workflows
- [Partial Export](./export-save-publish/export/partial-export.md) — Export specific regions or individual elements
- [Size Limits](./export-save-publish/export/size-limits.md) — Handle large exports and memory constraints



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support