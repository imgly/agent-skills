> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Compress](./export-save-publish/export/compress.md)

---

Compression reduces file sizes during export while maintaining visual quality. With CE.SDK you can fine-tune compression settings for both images and videos, allowing your app to manage performance, quality, and storage efficiency.

![Compress example showing CE.SDK with export options](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-compress-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-compress-browser)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-export-compress-browser/)

Image compression reduces file sizes while maintaining acceptable visual quality. CE.SDK supports format-specific compression controls: lossless compression for PNG, lossy quality settings for JPEG, and both modes for WebP. The example includes a navigation bar dropdown menu with export options for comparing different formats and compression levels.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-compress-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
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
import { VideoEditorConfig } from './video-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Compress Guide
 *
 * Demonstrates compression during export:
 * - PNG lossless compression levels
 * - JPEG lossy quality settings
 * - WebP quality settings
 * - Target dimension scaling
 * - Video compression with bitrate control
 * - Navigation bar dropdown with export options
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load a video template scene for demonstration
    await cesdk.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/templates/milli-surf-school.scene'
    );

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    if (page == null) throw new Error('No page found');

    // Helper function to download blob
    const downloadBlob = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    };

    // PNG uses lossless compression - level 0-9
    // Higher levels = smaller files, slower encoding
    // Quality is identical at all levels
    const exportPngLevel9 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 9
      });
      downloadBlob(blob, 'export-png-level9.png');
      cesdk.ui.showNotification({
        message: `PNG Level 9: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    const exportPngLevel5 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 5
      });
      downloadBlob(blob, 'export-png-level5.png');
      cesdk.ui.showNotification({
        message: `PNG Level 5: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    // JPEG uses lossy compression - quality 0-1
    // Lower values = smaller files, more artifacts
    const exportJpeg90 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.9
      });
      downloadBlob(blob, 'export-jpeg-90.jpg');
      cesdk.ui.showNotification({
        message: `JPEG 90%: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    const exportJpeg60 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.6
      });
      downloadBlob(blob, 'export-jpeg-60.jpg');
      cesdk.ui.showNotification({
        message: `JPEG 60%: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    // WebP supports both lossless (1.0) and lossy (<1.0) modes
    // Typically 20-30% smaller than JPEG at equivalent quality
    const exportWebp90 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/webp',
        webpQuality: 0.9
      });
      downloadBlob(blob, 'export-webp-90.webp');
      cesdk.ui.showNotification({
        message: `WebP 90%: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    const exportWebp60 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/webp',
        webpQuality: 0.6
      });
      downloadBlob(blob, 'export-webp-60.webp');
      cesdk.ui.showNotification({
        message: `WebP 60%: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    // Combine compression with dimension scaling
    // Useful for creating thumbnails or social media previews
    const exportScaled = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 6,
        targetWidth: 1200,
        targetHeight: 630
      });
      downloadBlob(blob, 'export-scaled-1200x630.png');
      cesdk.ui.showNotification({
        message: `Scaled 1200×630: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    // Video export with web-optimized bitrate (720p, 2 Mbps)
    const exportVideoWeb = async () => {
      const blob = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4',
        videoBitrate: 2_000_000,
        audioBitrate: 128_000,
        framerate: 30,
        targetWidth: 1280,
        targetHeight: 720
      });
      downloadBlob(blob, 'export-web-720p.mp4');
      cesdk.ui.showNotification({
        message: `Video 720p: ${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'success'
      });
    };

    // Video export with HD bitrate (1080p, 8 Mbps)
    const exportVideoHD = async () => {
      const blob = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4',
        videoBitrate: 8_000_000,
        audioBitrate: 192_000,
        framerate: 30,
        targetWidth: 1920,
        targetHeight: 1080
      });
      downloadBlob(blob, 'export-hd-1080p.mp4');
      cesdk.ui.showNotification({
        message: `Video 1080p: ${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'success'
      });
    };

    // Configure navigation bar with export dropdown
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.back.navigationBar',
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      // Actions dropdown with all export options
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          // PNG exports
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-png-9',
            label: 'PNG (Level 9 - Smallest)',
            icon: '@imgly/Save',
            onClick: exportPngLevel9
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-png-5',
            label: 'PNG (Level 5 - Balanced)',
            icon: '@imgly/Save',
            onClick: exportPngLevel5
          },
          // JPEG exports
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-jpeg-90',
            label: 'JPEG (90% Quality)',
            icon: '@imgly/Save',
            onClick: exportJpeg90
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-jpeg-60',
            label: 'JPEG (60% Quality)',
            icon: '@imgly/Save',
            onClick: exportJpeg60
          },
          // WebP exports
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-webp-90',
            label: 'WebP (90% Quality)',
            icon: '@imgly/Save',
            onClick: exportWebp90
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-webp-60',
            label: 'WebP (60% Quality)',
            icon: '@imgly/Save',
            onClick: exportWebp60
          },
          // Scaled export
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-scaled',
            label: 'Scaled (1200×630)',
            icon: '@imgly/Save',
            onClick: exportScaled
          },
          // Video exports
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-video-web',
            label: 'Video 720p (2 Mbps)',
            icon: '@imgly/Video',
            onClick: exportVideoWeb
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-video-hd',
            label: 'Video 1080p (8 Mbps)',
            icon: '@imgly/Video',
            onClick: exportVideoHD
          }
        ]
      }
    ]);

    // eslint-disable-next-line no-console
    console.log('Compression guide initialized. Use the dropdown menu to export in different formats.');
  }
}

export default Example;
```

This guide covers exporting with compression settings, configuring quality levels, controlling output dimensions, and video compression options.

## Compression Options by Format

To compress assets, use `engine.block.export` with format-specific options. Each format supports different parameters for balancing speed, file size, and quality.

| Format | Parameter | Type | Effect | Default |
| ------ | --------- | ---- | ------ | ------- |
| PNG | `pngCompressionLevel` | 0–9 | Higher = smaller, slower (lossless) | 5 |
| JPEG | `jpegQuality` | 0.0–1.0 | Lower = smaller, lower quality | 0.9 |
| WebP | `webpQuality` | 0.0–1.0 | 1.0 = lossless, below 1.0 = lossy | 1.0 |
| MP4 | `videoBitrate`, `audioBitrate` | bits/sec | Higher = larger, higher quality | 0 (auto) |

## Export with Compression

Call `engine.block.export()` with format-specific compression options. Each format uses different parameters to control file size and quality.

### PNG Compression

PNG uses lossless compression controlled by `pngCompressionLevel` (0-9). Higher values produce smaller files but take longer to encode. Quality remains identical at all levels.

```typescript highlight=highlight-png-compression
// PNG uses lossless compression - level 0-9
// Higher levels = smaller files, slower encoding
// Quality is identical at all levels
const exportPngLevel9 = async () => {
  const blob = await engine.block.export(page, {
    mimeType: 'image/png',
    pngCompressionLevel: 9
  });
  downloadBlob(blob, 'export-png-level9.png');
  cesdk.ui.showNotification({
    message: `PNG Level 9: ${(blob.size / 1024).toFixed(0)} KB`,
    type: 'success'
  });
};
```

Use level 5-6 for balanced results, or level 9 when file size is critical and encoding time is acceptable.

### JPEG Quality

JPEG uses lossy compression controlled by `jpegQuality` (0-1). Lower values produce smaller files with more visible artifacts.

```typescript highlight=highlight-jpeg-quality
// JPEG uses lossy compression - quality 0-1
// Lower values = smaller files, more artifacts
const exportJpeg90 = async () => {
  const blob = await engine.block.export(page, {
    mimeType: 'image/jpeg',
    jpegQuality: 0.9
  });
  downloadBlob(blob, 'export-jpeg-90.jpg');
  cesdk.ui.showNotification({
    message: `JPEG 90%: ${(blob.size / 1024).toFixed(0)} KB`,
    type: 'success'
  });
};
```

Quality 0.8 provides a good balance for web delivery. Use 0.9+ for archival or print workflows.

### WebP Quality

WebP supports both lossless and lossy modes via `webpQuality` (0-1). At 1.0, WebP uses lossless encoding. Values below 1.0 enable lossy compression.

```typescript highlight=highlight-webp-quality
// WebP supports both lossless (1.0) and lossy (<1.0) modes
// Typically 20-30% smaller than JPEG at equivalent quality
const exportWebp90 = async () => {
  const blob = await engine.block.export(page, {
    mimeType: 'image/webp',
    webpQuality: 0.9
  });
  downloadBlob(blob, 'export-webp-90.webp');
  cesdk.ui.showNotification({
    message: `WebP 90%: ${(blob.size / 1024).toFixed(0)} KB`,
    type: 'success'
  });
};
```

WebP typically produces 20-30% smaller files than JPEG at equivalent quality, with optional transparency support.

## Target Dimensions

Use `targetWidth` and `targetHeight` together to export at specific dimensions. The block renders large enough to fill the target size while maintaining aspect ratio.

```typescript highlight=highlight-target-size
// Combine compression with dimension scaling
// Useful for creating thumbnails or social media previews
const exportScaled = async () => {
  const blob = await engine.block.export(page, {
    mimeType: 'image/png',
    pngCompressionLevel: 6,
    targetWidth: 1200,
    targetHeight: 630
  });
  downloadBlob(blob, 'export-scaled-1200x630.png');
  cesdk.ui.showNotification({
    message: `Scaled 1200×630: ${(blob.size / 1024).toFixed(0)} KB`,
    type: 'success'
  });
};
```

Combining dimension scaling with compression produces smaller files suitable for specific platforms like social media thumbnails.

## Navigation Bar Export Menu

The example demonstrates configuring the CE.SDK navigation bar with a dropdown menu containing all export options. This approach integrates naturally with the editor UI.

```typescript highlight=highlight-navigation-bar
// Configure navigation bar with export dropdown
cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
  'ly.img.back.navigationBar',
  'ly.img.undoRedo.navigationBar',
  'ly.img.spacer',
  'ly.img.zoom.navigationBar',
  // Actions dropdown with all export options
  {
    id: 'ly.img.actions.navigationBar',
    children: [
      // PNG exports
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-png-9',
        label: 'PNG (Level 9 - Smallest)',
        icon: '@imgly/Save',
        onClick: exportPngLevel9
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-png-5',
        label: 'PNG (Level 5 - Balanced)',
        icon: '@imgly/Save',
        onClick: exportPngLevel5
      },
      // JPEG exports
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-jpeg-90',
        label: 'JPEG (90% Quality)',
        icon: '@imgly/Save',
        onClick: exportJpeg90
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-jpeg-60',
        label: 'JPEG (60% Quality)',
        icon: '@imgly/Save',
        onClick: exportJpeg60
      },
      // WebP exports
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-webp-90',
        label: 'WebP (90% Quality)',
        icon: '@imgly/Save',
        onClick: exportWebp90
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-webp-60',
        label: 'WebP (60% Quality)',
        icon: '@imgly/Save',
        onClick: exportWebp60
      },
      // Scaled export
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-scaled',
        label: 'Scaled (1200×630)',
        icon: '@imgly/Save',
        onClick: exportScaled
      },
      // Video exports
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-video-web',
        label: 'Video 720p (2 Mbps)',
        icon: '@imgly/Video',
        onClick: exportVideoWeb
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-video-hd',
        label: 'Video 1080p (8 Mbps)',
        icon: '@imgly/Video',
        onClick: exportVideoHD
      }
    ]
  }
]);
```

Each menu item triggers an export with specific compression options and displays the resulting file size via a notification.

## Compress Videos

To compress video, use the `VideoExportOptions` structure in the export workflow. You can specify:

- **Bitrate**: Mbps for video, kbps for audio
- **Frame rate**: fps (frames per second)
- **H.264 profile**: Compatibility and feature level
- **Target resolution**: Output dimensions in pixels

The example includes video export options in the dropdown menu. CE.SDK automatically displays a progress modal during video encoding.

```typescript highlight=highlight-video-export
    // Video export with web-optimized bitrate (720p, 2 Mbps)
    const exportVideoWeb = async () => {
      const blob = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4',
        videoBitrate: 2_000_000,
        audioBitrate: 128_000,
        framerate: 30,
        targetWidth: 1280,
        targetHeight: 720
      });
      downloadBlob(blob, 'export-web-720p.mp4');
      cesdk.ui.showNotification({
        message: `Video 720p: ${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'success'
      });
    };

    // Video export with HD bitrate (1080p, 8 Mbps)
    const exportVideoHD = async () => {
      const blob = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4',
        videoBitrate: 8_000_000,
        audioBitrate: 192_000,
        framerate: 30,
        targetWidth: 1920,
        targetHeight: 1080
      });
      downloadBlob(blob, 'export-hd-1080p.mp4');
      cesdk.ui.showNotification({
        message: `Video 1080p: ${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'success'
      });
    };
```

### Choose Bitrate Values

Adjust bitrate according to your use case:

- **Web/social media clips**: 1–2 Mbps
- **Downloadable HD video**: 8–12 Mbps
- **Automatic optimization**: Set `videoBitrate` to `0` to let CE.SDK choose based on resolution and frame rate

### H.264 Profile Selection

The H.264 profile and level determine encoder compatibility and features:

- **Baseline**: Mobile-friendly playback
- **Main**: Standard HD
- **High**: Highest quality (desktop/professional workflows)

## Performance and Trade-Offs

Higher compression produces smaller files but has trade-offs:

- **Slower export speeds** with higher compression levels
- **JPEG and WebP** are faster but can introduce visible artifacts (blurring, color banding)
- **Video exports** are resource-consuming and depend on device CPU/GPU performance

### Check Export Limits

The EditorAPI provides options to check available export limits before encoding:

```typescript
const maxSize = engine.editor.getMaxExportSize();
const availableMemory = engine.editor.getAvailableMemory();
console.log("Max export size:", maxSize, "Memory:", availableMemory);
```

## Real-World Compression Comparison (1080×1080)

| Format | Setting | Avg. File Size | Encode Time | PSNR | Notes |
| ------ | ------- | -------------- | ----------- | ---- | ----- |
| **PNG** | Level 0 | ~1,450 KB | ~44 ms | ∞ (lossless) | Fastest, largest |
| **PNG** | Level 5 | ~1,260 KB | ~61 ms | ∞ | Balanced speed and size |
| **PNG** | Level 9 | ~1,080 KB | ~88 ms | ∞ | Smallest, slowest |
| **JPEG** | Quality 95 | ~640 KB | ~24 ms | 43 dB | Near-lossless |
| **JPEG** | Quality 80 | ~420 KB | ~20 ms | 39 dB | Good default for photos |
| **JPEG** | Quality 60 | ~290 KB | ~17 ms | 35 dB | Some artifacts visible |
| **WebP** | Quality 95 | ~510 KB | ~27 ms | 44 dB | Smaller than JPEG |
| **WebP** | Quality 80 | ~350 KB | ~23 ms | 39 dB | Good web balance |
| **WebP** | Lossless | ~830 KB | ~33 ms | ∞ | Smaller than PNG, keeps alpha |

*PSNR > 40 dB ≈ visually lossless; 30–35 dB shows mild artifacts.*

**Key Takeaways**:

- **WebP** achieves 70–85% smaller files than PNG with high quality around 0.8
- **JPEG** performs well for photographs; use 0.8–0.9 for web/print, 0.6 for compact exports
- **PNG** is essential for transparency; higher levels reduce size modestly at the cost of speed

## Practical Presets

| Use Case | Format | Settings | Notes |
| -------- | ------ | -------- | ----- |
| **Web/Social Sharing** | JPEG/WebP | `jpegQuality: 0.8` | Balanced quality and size |
| **Transparent Assets** | PNG/WebP | `pngCompressionLevel: 6` | Maintains transparency |
| **Print/Archival** | PNG | `pngCompressionLevel: 9` | Best fidelity, large files |
| **Video for Web** | MP4 | `videoBitrate: 2_000_000` | Smooth playback, small file |
| **Video HD Download** | MP4 | `videoBitrate: 8_000_000` | Full HD quality |

> **Note:** Consider showing users an **estimated file size** before export. It helps them make informed choices about quality vs. performance.

## Troubleshooting

| Issue | Solution |
| ----- | -------- |
| File size not reduced | Use the correct option name (`jpegQuality`, `webpQuality`) |
| JPEG quality too low | Raise quality to 0.9 or switch to PNG/WebP lossless |
| Slow export | Lower the compression level—PNG level 5–6 is a good target |
| Video not compressing | Set `videoBitrate` to a reasonable non-zero value |

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(blockId, options)` | Export a block with compression and format options |
| `engine.block.exportVideo(blockId, options)` | Export a video with compression settings |
| `engine.editor.getMaxExportSize()` | Get maximum export dimensions |
| `engine.editor.getAvailableMemory()` | Get available memory for export |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Compare all supported export formats
- [Export to PNG](./export-save-publish/export/to-png.md) - Full PNG export options and transparency handling
- [Export to JPEG](./export-save-publish/export/to-jpeg.md) - JPEG-specific options for photographs
- [Export to WebP](./export-save-publish/export/to-webp.md) - WebP format with lossless and lossy modes
- [Batch Processing](./automation/batch-processing.md) - Apply compression consistently in automated exports



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support