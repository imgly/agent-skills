> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Overview](./export-save-publish/export/overview.md)

---

Export your designs to multiple formats including PNG, JPEG, WebP, PDF, and MP4. CE.SDK handles all export processing entirely on the client side, giving you fine-grained control over format-specific options like compression, quality, and target dimensions.

![Export overview showing different export format options](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-export-overview-browser/)

Whether you're building a design tool, photo editor, or content automation workflow, understanding export options helps you deliver the right output for each use case. This guide covers supported formats, their options, and how to export programmatically or via the UI.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-overview-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Export Overview Guide
 *
 * This example demonstrates:
 * - Exporting designs to different formats (PNG, JPEG, WebP, PDF)
 * - Configuring export options (compression, quality, target size)
 * - Exporting with color masks for print workflows
 * - Downloading exported files to user device
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load a template scene from a remote URL
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Get the page
    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Helper function to download blob
    const downloadBlob = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    };

    // Export to PNG with compression
    const exportToPng = async () => {
      const pngBlob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 5 // 0-9, higher = smaller file, slower
      });
      downloadBlob(pngBlob, 'design.png');
      cesdk.ui.showNotification({
        message: `PNG exported (${(pngBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export to JPEG with quality setting
    const exportToJpeg = async () => {
      const jpegBlob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.9 // 0-1, higher = better quality, larger file
      });
      downloadBlob(jpegBlob, 'design.jpg');
      cesdk.ui.showNotification({
        message: `JPEG exported (${(jpegBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export to WebP with lossless quality
    const exportToWebp = async () => {
      const webpBlob = await engine.block.export(page, {
        mimeType: 'image/webp',
        webpQuality: 1.0 // 1.0 = lossless, smaller files than PNG
      });
      downloadBlob(webpBlob, 'design.webp');
      cesdk.ui.showNotification({
        message: `WebP exported (${(webpBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export to PDF
    const exportToPdf = async () => {
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: true // Rasterize for broader viewer support
      });
      downloadBlob(pdfBlob, 'design.pdf');
      cesdk.ui.showNotification({
        message: `PDF exported (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export with target size
    const exportWithTargetSize = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      downloadBlob(blob, 'design-hd.png');
      cesdk.ui.showNotification({
        message: `HD export complete (${(blob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export with color mask - removes specified RGB color and creates alpha mask
    const exportWithColorMask = async () => {
      // Export with color mask - RGB values are in 0.0-1.0 range
      // Pure magenta (1.0, 0.0, 1.0) is commonly used for registration marks
      const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
        page,
        1.0, // maskColorR - red component
        0.0, // maskColorG - green component
        1.0, // maskColorB - blue component (RGB: pure magenta)
        { mimeType: 'image/png' }
      );
      downloadBlob(maskedImage, 'design-masked.png');
      downloadBlob(alphaMask, 'design-alpha-mask.png');
      cesdk.ui.showNotification({
        message: `Color mask export: image (${(maskedImage.size / 1024).toFixed(1)} KB) + mask (${(alphaMask.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Configure navigation bar with export buttons
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportToPng,
        key: 'export-png',
        label: 'PNG',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportToJpeg,
        key: 'export-jpeg',
        label: 'JPEG',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportToWebp,
        key: 'export-webp',
        label: 'WebP',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportToPdf,
        key: 'export-pdf',
        label: 'PDF',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithTargetSize,
        key: 'export-hd',
        label: 'HD',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithColorMask,
        key: 'export-mask',
        label: 'Mask',
        icon: '@imgly/Save',
        variant: 'plain',
        color: 'accent'
      }
    ]);

    cesdk.ui.showNotification({
      message: 'Use the export buttons to export in different formats',
      type: 'info',
      duration: 'infinite'
    });
  }
}

export default Example;
```

This guide covers how to export designs in different formats, configure format-specific options, check device limits, and download exports to the user's device.

## Supported Export Formats

CE.SDK supports exporting scenes, pages, groups, or individual blocks in these formats:

| Format | MIME Type | Transparency | Best For |
| ------ | --------- | ------------ | -------- |
| PNG | `image/png` | Yes | Web graphics, UI elements, logos |
| JPEG | `image/jpeg` | No | Photographs, web images |
| WebP | `image/webp` | Yes (lossless) | Web delivery, smaller files |
| PDF | `application/pdf` | Partial | Print, documents |
| MP4 | `video/mp4` | No | Video content |
| Binary | `application/octet-stream` | Yes | Raw data processing |

Each format serves different purposes. PNG preserves transparency and works well for graphics with sharp edges or text. JPEG compresses photographs efficiently but drops transparency. WebP provides excellent compression with optional lossless mode. PDF preserves vector information for print workflows. MP4 exports animated content as video.

## Export Images

### Export to PNG

PNG export uses lossless compression with a configurable compression level. Higher compression produces smaller files but takes longer to encode. Quality is not affected.

```typescript highlight-export-png
const pngBlob = await engine.block.export(page, {
  mimeType: 'image/png',
  pngCompressionLevel: 5 // 0-9, higher = smaller file, slower
});
```

The `pngCompressionLevel` ranges from 0 (no compression, fastest) to 9 (maximum compression, slowest). The default is 5, which balances file size and encoding speed.

### Export to JPEG

JPEG export uses lossy compression controlled by the quality setting. Lower quality produces smaller files but introduces visible artifacts.

```typescript highlight-export-jpeg
const jpegBlob = await engine.block.export(page, {
  mimeType: 'image/jpeg',
  jpegQuality: 0.9 // 0-1, higher = better quality, larger file
});
```

The `jpegQuality` ranges from 0 to 1. Values above 0.9 provide excellent quality for most use cases. The default is 0.9.

> **Caution:** JPEG drops transparency from exports. Transparent areas render with a solid background, which may produce unexpected results for designs relying on alpha channels.

### Export to WebP

WebP provides better compression than PNG or JPEG for web delivery. A quality of 1.0 enables lossless mode.

```typescript highlight-export-webp
const webpBlob = await engine.block.export(page, {
  mimeType: 'image/webp',
  webpQuality: 1.0 // 1.0 = lossless, smaller files than PNG
});
```

The `webpQuality` ranges from 0 to 1. At 1.0, WebP uses lossless compression that typically produces smaller files than equivalent PNG exports.

### Image Export Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mimeType` | `string` | - | Output format: `'image/png'`, `'image/jpeg'`, or `'image/webp'` |
| `pngCompressionLevel` | `number` | `5` | PNG compression level (0-9). Higher = smaller file, slower encoding |
| `jpegQuality` | `number` | `0.9` | JPEG quality (0-1). Higher = better quality, larger file |
| `webpQuality` | `number` | `0.8` | WebP quality (0-1). Set to 1.0 for lossless compression |
| `targetWidth` | `number` | - | Target output width in pixels |
| `targetHeight` | `number` | - | Target output height in pixels |

## Export PDF

PDF export preserves vector information and supports print workflows. The high compatibility option rasterizes content for broader viewer support.

```typescript highlight-export-pdf
const pdfBlob = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true // Rasterize for broader viewer support
});
```

When `exportPdfWithHighCompatibility` is `true` (the default), images and effects are rasterized according to the scene's DPI setting. Set it to `false` for faster exports, though gradients with transparency may not render correctly in Safari or macOS Preview.

The underlayer options are useful for print workflows where you need a solid base layer (often white ink) beneath the design elements. The `underlayerSpotColorName` should match a spot color defined in your print workflow.

### PDF Export Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mimeType` | `string` | - | Must be `'application/pdf'` |
| `exportPdfWithHighCompatibility` | `boolean` | `true` | Rasterize images and effects (like gradients) according to the scene's DPI setting for broader viewer support |
| `exportPdfWithUnderlayer` | `boolean` | `false` | Add an underlayer behind existing elements matching the shape of page content |
| `underlayerSpotColorName` | `string` | `''` | Spot color name for the underlayer fill (used with print workflows) |
| `underlayerOffset` | `number` | `0` | Size adjustment for the underlayer shape in design units |
| `targetWidth` | `number` | - | Target output width in pixels |
| `targetHeight` | `number` | - | Target output height in pixels |

## Export with Color Mask

Color mask export removes pixels matching a specific RGB color and generates two output files: the masked image with transparency applied, and an alpha mask showing which pixels were removed.

```typescript highlight-export-color-mask
// Export with color mask - RGB values are in 0.0-1.0 range
// Pure magenta (1.0, 0.0, 1.0) is commonly used for registration marks
const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
  page,
  1.0, // maskColorR - red component
  0.0, // maskColorG - green component
  1.0, // maskColorB - blue component (RGB: pure magenta)
  { mimeType: 'image/png' }
);
```

The `exportWithColorMask()` method accepts the block to export, three RGB color components (0.0-1.0 range), and optional export options. RGB values use floating-point notation where 1.0 equals 255 in standard color notation.

Common mask colors for print workflows:

- Pure red: `(1.0, 0.0, 0.0)` — Registration marks
- Pure magenta: `(1.0, 0.0, 1.0)` — Distinctive marker color
- Pure cyan: `(0.0, 1.0, 1.0)` — Alternative marker color

The method returns a Promise resolving to an array of two Blobs: the masked image (with matched pixels made transparent) and the alpha mask (black pixels for removed areas, white for retained areas).

> **Note:** Color matching is exact. Only pixels with RGB values precisely matching the specified color are removed. Anti-aliased edges or color variations will not be affected.

### Color Mask Export Options

The `exportWithColorMask()` method accepts the same options as image export:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mimeType` | `string` | `'image/png'` | Output format: `'image/png'`, `'image/jpeg'`, or `'image/webp'` |
| `pngCompressionLevel` | `number` | `5` | PNG compression level (0-9) |
| `jpegQuality` | `number` | `0.9` | JPEG quality (0-1) |
| `webpQuality` | `number` | `0.8` | WebP quality (0-1) |
| `targetWidth` | `number` | - | Target output width in pixels |
| `targetHeight` | `number` | - | Target output height in pixels |

## Export Video

Video export uses the H.264 codec and outputs MP4 or QuickTime files. Unlike image exports, video exports accept a progress callback to track encoding status.

```typescript
const page = engine.scene.getCurrentPage();

const videoBlob = await engine.block.exportVideo(page, {
  mimeType: 'video/mp4',
  onProgress: (rendered, encoded, total) => {
    console.log(`Progress: ${Math.round((encoded / total) * 100)}%`);
  }
});
```

### Video Export Options

Configure video encoding with these options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mimeType` | `'video/mp4'` | `'video/quicktime'` | `'video/mp4'` | Output video format |
| `h264Profile` | `number` | `77` (Main) | H.264 profile: 66=Baseline, 77=Main, 100=High |
| `h264Level` | `number` | `52` | Encoding level (multiply desired level by 10, e.g., 52 = level 5.2) |
| `videoBitrate` | `number` | `0` (auto) | Video bitrate in bits/second. Maximum determined by profile and level |
| `audioBitrate` | `number` | `0` (auto) | Audio bitrate in bits/second. Default auto-selects 128kbps for stereo AAC |
| `framerate` | `number` | `30` | Target framerate in Hz |
| `targetWidth` | `number` | - | Output width in pixels |
| `targetHeight` | `number` | - | Output height in pixels |
| `timeOffset` | `number` | `0` | Start time offset in seconds |
| `duration` | `number` | scene duration | Video duration in seconds |
| `allowTextOverhang` | `boolean` | `false` | Include text bounding boxes that account for glyph overhangs |
| `abortSignal` | `AbortSignal` | - | Signal to cancel export |

The `h264Profile` determines encoder quality and compatibility:

- **Baseline (66)**: Broadest device compatibility, lowest quality
- **Main (77)**: Good balance of quality and compatibility (default)
- **High (100)**: Best quality, may not play on older devices

> **Caution:** H.264 does not support transparency. Transparent areas render with a black background.

## Export Audio

Export audio tracks from pages or audio blocks. Supported formats are WAV (uncompressed) and MP4 (AAC encoded).

```typescript
const page = engine.scene.getCurrentPage();

const audioBlob = await engine.block.exportAudio(page, {
  mimeType: 'audio/mp4', // or 'audio/wav'
  onProgress: (rendered, encoded, total) => {
    console.log(`Progress: ${Math.round((encoded / total) * 100)}%`);
  }
});
```

### Audio Export Options

Configure audio export with these options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mimeType` | `'audio/wav'` | `'audio/mp4'` | `'audio/wav'` | Output audio format |
| `sampleRate` | `number` | `48000` | Sample rate in Hz |
| `numberOfChannels` | `number` | `2` | Number of audio channels (1=mono, 2=stereo) |
| `timeOffset` | `number` | `0` | Start time offset in seconds |
| `duration` | `number` | block duration | Audio duration in seconds |
| `skipEncoding` | `boolean` | `false` | Return raw audio data without encoding |
| `abortSignal` | `AbortSignal` | - | Signal to cancel export |

Use `audio/wav` for lossless quality when file size is not a concern. Use `audio/mp4` (AAC) for compressed output suitable for web delivery.

> **Note:** Audio export extracts and processes audio from all audio-capable blocks within the target block, including video fills with audio tracks and standalone audio blocks.

## Target Size Control

You can export at specific dimensions regardless of the block's actual size. The `targetWidth` and `targetHeight` options render the block large enough to fill the target size while maintaining aspect ratio.

```typescript highlight-export-target-size
const blob = await engine.block.export(page, {
  mimeType: 'image/png',
  targetWidth: 1920,
  targetHeight: 1080
});
```

If the target aspect ratio differs from the block's aspect ratio, the output fills the target dimensions completely. The output may extend beyond the target size on one axis to preserve correct proportions.

## Device Export Limits

Before exporting large designs, check the device's export capabilities. Memory constraints or GPU limitations may prevent exports that exceed certain dimensions.

```typescript
const maxExportSize = engine.editor.getMaxExportSize();
const availableMemory = engine.editor.getAvailableMemory();

console.log(`Max dimension: ${maxExportSize}px`);
console.log(`Available memory: ${availableMemory / 1024 / 1024} MB`);
```

`getMaxExportSize()` returns the maximum width or height in pixels. Both dimensions must stay below this limit. `getAvailableMemory()` returns available memory in bytes, helping you assess whether large exports are feasible.

> **Note:** The max export size is an upper bound. Exports may still fail due to memory constraints even when within size limits. For high-resolution exports, consider checking available memory first.

## Built-in Export Action

CE.SDK provides a built-in `exportDesign` action that handles export with progress dialogs and error handling. Use `cesdk.utils.export()` to export and `cesdk.utils.downloadFile()` to download the result.

Export an image:

```typescript
const { blobs, options } = await cesdk.utils.export({
  mimeType: 'image/png'
});
await cesdk.utils.downloadFile(blobs[0], options.mimeType);
```

Export a PDF:

```typescript
const { blobs, options } = await cesdk.utils.export({
  mimeType: 'application/pdf'
});
await cesdk.utils.downloadFile(blobs[0], options.mimeType);
```

Export a video:

```typescript
const { blobs, options } = await cesdk.utils.export({
  mimeType: 'video/mp4'
});
await cesdk.utils.downloadFile(blobs[0], options.mimeType);
```

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export()` | Export a block with format and quality options |
| `engine.block.exportWithColorMask()` | Export a block with specific RGB color removed, returning masked image and alpha mask |
| `engine.block.exportVideo()` | Export a page as video with encoding options |
| `engine.block.exportAudio()` | Export audio from a page or audio block |
| `engine.editor.getMaxExportSize()` | Get maximum export dimension in pixels |
| `engine.editor.getAvailableMemory()` | Get available memory in bytes |
| `cesdk.utils.export()` | Export with progress dialog and error handling |
| `cesdk.utils.downloadFile()` | Download a blob or string to the user's device |



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support