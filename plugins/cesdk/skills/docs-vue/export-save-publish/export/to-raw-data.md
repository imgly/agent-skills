> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To Raw Data](./export-save-publish/export/to-raw-data.md)

---

Exporting designs to raw pixel data gives you direct access to uncompressed
RGBA bytes, enabling custom image processing, GPU texture uploads, and
integration with advanced graphics pipelines. Unlike compressed formats like
PNG or JPEG, raw data export provides the pixel buffer without encoding
overhead, making it ideal for performance-critical applications and scenarios
where you need to manipulate individual pixels programmatically.

![Export to Raw Data example showing grayscale image processing with export button](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-export-to-raw-data-browser/)

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-raw-data-browser/src/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from '../package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set explicit page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create a single image block to demonstrate raw data export
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: 800, height: 600 }
    });
    engine.block.appendChild(page, imageBlock);
    engine.block.setPositionX(imageBlock, 0);
    engine.block.setPositionY(imageBlock, 0);

    // Add export button to navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: ['ly.img.exportImage.navigationBar']
    });

    // Override the built-in exportDesign action
    cesdk.actions.register('exportDesign', async () => {
      // Export to raw pixel data
      const width = Math.floor(engine.block.getWidth(imageBlock));
      const height = Math.floor(engine.block.getHeight(imageBlock));

      const blob = await engine.block.export(imageBlock, {
        mimeType: 'application/octet-stream',
        targetWidth: width,
        targetHeight: height
      });

      // Convert blob to raw pixel array
      const arrayBuffer = await blob.arrayBuffer();
      const pixelData = new Uint8Array(arrayBuffer);

      // Apply grayscale processing
      const processedData = this.toGrayscale(pixelData, width, height);

      // Download processed image
      await this.downloadProcessedImage(processedData, width, height);
    });
  }

  /**
   * Convert image to grayscale by averaging RGB channels
   */
  private toGrayscale(
    pixelData: Uint8Array,
    _width: number,
    _height: number
  ): Uint8Array {
    const result = new Uint8Array(pixelData);
    for (let i = 0; i < result.length; i += 4) {
      const avg = Math.round((result[i] + result[i + 1] + result[i + 2]) / 3);
      result[i] = avg; // R
      result[i + 1] = avg; // G
      result[i + 2] = avg; // B
      // Keep alpha unchanged: result[i + 3]
    }
    return result;
  }

  /**
   * Convert processed pixel data to PNG and trigger download
   */
  private async downloadProcessedImage(
    pixelData: Uint8Array,
    width: number,
    height: number
  ): Promise<void> {

    // Create canvas and render pixel data
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Create ImageData from pixel array
    const imageData = new ImageData(
      new Uint8ClampedArray(pixelData),
      width,
      height
    );
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/png',
        1.0
      );
    });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'processed-image.png';
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  }
}

export default Example;
```

## When to Use Raw Data Export

Raw pixel data export provides direct access to uncompressed RGBA bytes from CE.SDK, giving you complete control over individual pixels for custom processing workflows.

Use raw data export when you need pixel-level access to exported designs for custom algorithms or integrations. For standard image delivery, use PNG or JPEG exports instead, as they provide compression and are ready to use without additional processing.

## Understanding Raw Data Format

When you export with `mimeType: 'application/octet-stream'`, CE.SDK returns a Blob containing uncompressed RGBA pixel data. The format is straightforward:

- **4 bytes per pixel** representing Red, Green, Blue, and Alpha channels
- **Values from 0-255** for each channel (8-bit unsigned integers)
- **Row-major order** with pixels arranged left-to-right, top-to-bottom
- **Total size** equals width × height × 4 bytes

## How to Export Raw Data

To export a block as raw pixel data, use the `engine.block.export()` method with `mimeType: 'application/octet-stream'`:

```typescript highlight-basic-export
const blob = await engine.block.export(imageBlock, {
  mimeType: 'application/octet-stream',
  targetWidth: width,
  targetHeight: height
});
```

This returns a Blob containing uncompressed RGBA pixel data that you can process with custom algorithms.

## Download Exported Data

The example overrides the built-in `exportDesign` action to implement a custom workflow that exports to raw data, processes the pixels, and downloads the result:

```typescript highlight-export-action-body
      // Export to raw pixel data
      const width = Math.floor(engine.block.getWidth(imageBlock));
      const height = Math.floor(engine.block.getHeight(imageBlock));

      const blob = await engine.block.export(imageBlock, {
        mimeType: 'application/octet-stream',
        targetWidth: width,
        targetHeight: height
      });

      // Convert blob to raw pixel array
      const arrayBuffer = await blob.arrayBuffer();
      const pixelData = new Uint8Array(arrayBuffer);

      // Apply grayscale processing
      const processedData = this.toGrayscale(pixelData, width, height);

      // Download processed image
      await this.downloadProcessedImage(processedData, width, height);
```

This complete workflow demonstrates exporting to raw pixel data, applying grayscale processing, and downloading the processed image as PNG.

## Performance Considerations

Raw data export involves trade-offs between flexibility and efficiency:

**Memory Usage**: Raw RGBA data requires 4 bytes per pixel. A 1920×1080 CE.SDK export uses approximately 8.3 MB uncompressed, compared to 1-3 MB for PNG. Reduce memory usage with the `targetWidth` and `targetHeight` export options:

```typescript
const blob = await engine.block.export(blockId, {
  mimeType: 'application/octet-stream',
  targetWidth: 960,
  targetHeight: 540
});
```

**Processing Speed**: Operating directly on pixel data from CE.SDK exports is fast because there's no encoding/decoding overhead. However, processing millions of pixels can be time-consuming for complex algorithms. Consider using Web Workers for heavy processing to avoid blocking the main thread.

**When to Use Raw vs. Compressed for CE.SDK Exports**:

- Use raw data when you need custom post-processing before final delivery
- Use PNG or JPEG for direct downloads from CE.SDK
- Use raw data for intermediate processing steps in multi-stage pipelines
- Use compressed formats for final output or network transfer

## API Reference

| Method                                 | Description                                               |
| -------------------------------------- | --------------------------------------------------------- |
| `engine.block.export()`                | Exports a block with `mimeType: 'application/octet-stream'` for raw RGBA data |
| `engine.block.getWidth()`              | Returns the width of a block in pixels                    |
| `engine.block.getHeight()`             | Returns the height of a block in pixels                   |
| `Blob.arrayBuffer()`                   | Converts the blob to an ArrayBuffer for raw data access   |
| `ImageData()`                          | Creates an ImageData object from a Uint8ClampedArray      |
| `CanvasRenderingContext2D.putImageData()` | Paints pixel data onto a canvas                        |



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support