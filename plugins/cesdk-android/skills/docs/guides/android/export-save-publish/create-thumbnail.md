> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Export Media Assets](./export.md) > [Create Thumbnail](./create-thumbnail.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-thumbnail/CreateThumbnail.kt reference-only
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlock
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.MimeType
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer

data class ThumbnailSize(
    val label: String,
    val width: Float,
    val height: Float,
)

data class ThumbnailExportResult(
    val smallJpeg: ByteBuffer,
    val mediumJpeg: ByteBuffer,
    val pngPreview: ByteBuffer,
    val savedMediumJpeg: File,
    val savedPngPreview: File,
)

suspend fun createThumbnail(
    engine: Engine,
    outputDir: File,
): ThumbnailExportResult {
    val page = engine.scene.getCurrentPage()
        ?: engine.scene.getPages().firstOrNull()
        ?: error("Load a scene with at least one page before exporting thumbnails.")

    val smallSize = ThumbnailSize(label = "small", width = 150F, height = 150F)
    val mediumSize = ThumbnailSize(label = "medium", width = 400F, height = 300F)

    val smallJpeg = exportJpegThumbnail(engine, page, smallSize)
    val mediumJpeg = exportJpegThumbnail(engine, page, mediumSize)
    val pngPreview = exportPngThumbnail(engine, page)
    val savedMediumJpeg = saveThumbnailToFile(
        buffer = mediumJpeg.asReadOnlyBuffer(),
        outputFile = File(outputDir, "thumbnail-medium.jpg"),
    )
    val savedPngPreview = saveThumbnailToFile(
        buffer = pngPreview.asReadOnlyBuffer(),
        outputFile = File(outputDir, "thumbnail-preview.png"),
    )

    return ThumbnailExportResult(
        smallJpeg = smallJpeg,
        mediumJpeg = mediumJpeg,
        pngPreview = pngPreview,
        savedMediumJpeg = savedMediumJpeg,
        savedPngPreview = savedPngPreview,
    )
}

suspend fun exportJpegThumbnail(
    engine: Engine,
    page: DesignBlock,
    size: ThumbnailSize,
): ByteBuffer {
    val options = ExportOptions(
        targetWidth = size.width,
        targetHeight = size.height,
        jpegQuality = 0.8F,
    )

    val thumbnail = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(thumbnail.hasRemaining()) { "${size.label} thumbnail is empty" }
    return thumbnail
}

suspend fun exportPngThumbnail(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val options = ExportOptions(
        targetWidth = 400F,
        targetHeight = 300F,
        pngCompressionLevel = 6,
    )

    val thumbnail = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = options,
    )

    check(thumbnail.hasRemaining()) { "PNG thumbnail is empty" }
    return thumbnail
}

suspend fun exportThumbnailSet(
    engine: Engine,
    page: DesignBlock,
): Map<String, ByteBuffer> {
    val sizes = listOf(
        ThumbnailSize(label = "small", width = 150F, height = 150F),
        ThumbnailSize(label = "medium", width = 400F, height = 300F),
        ThumbnailSize(label = "large", width = 800F, height = 600F),
    )

    return sizes.associate { size ->
        size.label to exportJpegThumbnail(engine, page, size)
    }
}

suspend fun saveThumbnailToFile(
    buffer: ByteBuffer,
    outputFile: File,
): File = withContext(Dispatchers.IO) {
    outputFile.parentFile?.mkdirs()

    val readableBuffer = buffer.asReadOnlyBuffer()
    FileOutputStream(outputFile).channel.use { channel ->
        while (readableBuffer.hasRemaining()) {
            channel.write(readableBuffer)
        }
    }

    check(outputFile.length() > 0L) { "Saved thumbnail is empty" }
    outputFile
}
```

Generate small preview images from CE.SDK scenes and pages for galleries, file browsers, and design management interfaces.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260808/engine-guides-create-thumbnail)

<EngineReferenceNote {...props} />

Thumbnails use the same block export API as full-size image exports. Pass a page or scene block to `engine.block.export(...)`, choose an image MIME type, and set target dimensions in `ExportOptions`.

This guide focuses on static image thumbnails. It does not cover audio waveforms or multi-frame scrubber previews.

## Export a Thumbnail

Start from the current page when you want the thumbnail to match the visible canvas. If no page is selected, use the first page in the loaded scene.

```kotlin highlight-android-select-page
val page = engine.scene.getCurrentPage()
    ?: engine.scene.getPages().firstOrNull()
    ?: error("Load a scene with at least one page before exporting thumbnails.")
```

Then call `engine.block.export(...)` with both `targetWidth` and `targetHeight`. The Android API returns a `ByteBuffer` that you can decode, cache, write to disk, or upload through your own storage layer.

```kotlin highlight-android-export-thumbnail
suspend fun exportJpegThumbnail(
    engine: Engine,
    page: DesignBlock,
    size: ThumbnailSize,
): ByteBuffer {
    val options = ExportOptions(
        targetWidth = size.width,
        targetHeight = size.height,
        jpegQuality = 0.8F,
    )

    val thumbnail = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(thumbnail.hasRemaining()) { "${size.label} thumbnail is empty" }
    return thumbnail
}
```

Both target dimensions should be set together. CE.SDK renders the block large enough to fill the target box while maintaining its aspect ratio.

## Choose Thumbnail Format

Use the MIME type that fits the UI surface where you display the thumbnail:

- **JPEG** - Smaller files for photographic content, controlled with `jpegQuality`.
- **PNG** - Lossless output with transparency support, controlled with `pngCompressionLevel`.

### JPEG Thumbnails

JPEG works well for most gallery and list previews. Values around `0.8F` usually balance image quality and file size for thumbnails.

### PNG Thumbnails

PNG preserves transparency and lossless quality. Increase `pngCompressionLevel` when smaller files matter more than encoding speed.

```kotlin highlight-android-export-png
suspend fun exportPngThumbnail(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val options = ExportOptions(
        targetWidth = 400F,
        targetHeight = 300F,
        pngCompressionLevel = 6,
    )

    val thumbnail = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = options,
    )

    check(thumbnail.hasRemaining()) { "PNG thumbnail is empty" }
    return thumbnail
}
```

## Common Thumbnail Sizes

Use target boxes that match the destination UI instead of exporting full-resolution artwork and scaling it later. `targetWidth` and `targetHeight` define the box CE.SDK fills, not guaranteed exact output dimensions. When the source aspect ratio differs, the thumbnail may exceed one axis while preserving the source aspect ratio.

| Size | Target box | Use case |
| ---- | ---------- | -------- |
| Small | 150 x 150 | Dense grids and file browsers |
| Medium | 400 x 300 | Preview cards and detail lists |
| Large | 800 x 600 | Larger preview panels |

## Generate Multiple Sizes

Create responsive thumbnail sets by exporting the same page with different dimensions. This keeps each asset close to the size your UI needs.

```kotlin highlight-android-export-multiple
suspend fun exportThumbnailSet(
    engine: Engine,
    page: DesignBlock,
): Map<String, ByteBuffer> {
    val sizes = listOf(
        ThumbnailSize(label = "small", width = 150F, height = 150F),
        ThumbnailSize(label = "medium", width = 400F, height = 300F),
        ThumbnailSize(label = "large", width = 800F, height = 600F),
    )

    return sizes.associate { size ->
        size.label to exportJpegThumbnail(engine, page, size)
    }
}
```

Batching several sizes in one helper also makes it easier to cache or upload them together in your app code.

## Save a Thumbnail

Exporting creates in-memory image data. To persist the thumbnail on Android, write the returned `ByteBuffer` to a file in your app's cache or files directory.

```kotlin highlight-android-save-file
suspend fun saveThumbnailToFile(
    buffer: ByteBuffer,
    outputFile: File,
): File = withContext(Dispatchers.IO) {
    outputFile.parentFile?.mkdirs()

    val readableBuffer = buffer.asReadOnlyBuffer()
    FileOutputStream(outputFile).channel.use { channel ->
        while (readableBuffer.hasRemaining()) {
            channel.write(readableBuffer)
        }
    }

    check(outputFile.length() > 0L) { "Saved thumbnail is empty" }
    outputFile
}
```

The example writes to a caller-provided file so your app controls storage lifetime, cleanup, and sharing behavior.

## Optimize Thumbnail Quality

Tune format-specific `ExportOptions` fields to balance file size, quality, and export time.

| Format | Option | Range | Default | Notes |
| ------ | ------ | ----- | ------- | ----- |
| JPEG | `jpegQuality` | `(0, 1]` | `0.9F` | Lower values reduce file size and may add visible artifacts. |
| PNG | `pngCompressionLevel` | `0-9` | `5` | Higher values reduce file size but can encode more slowly. |
| Target size | `targetWidth` / `targetHeight` | Positive values | `null` | Set both values to scale thumbnail output. |

For thumbnails, start with JPEG quality around `0.8F` or PNG compression around `6`, then adjust based on your UI and storage constraints.

## Headless and Background Thumbnail Generation

For occasional thumbnails, export from the existing `Engine` instance after the scene has loaded. This works well when a user saves a draft or opens a design detail screen.

For large batches, use a separate headless engine instance, load each saved scene, and call the same export helpers. Keep engine calls on the main thread and move only file I/O or uploads to background dispatchers.

## Thumbnails from Video Blocks

Exporting a paused video page produces a single static image of the current visual state. This can be useful for poster-frame previews, but it is not the same as generating a sequence of scrubber frames.

To control the captured frame, seek the video or page timeline to the desired time, pause playback, and export the page with the thumbnail options shown above.

## Troubleshooting

| Symptom | Likely cause | Solution |
| ------- | ------------ | -------- |
| Thumbnail only shows part of the design | A child block was exported instead of the page | Export the page block to capture the full visible canvas. |
| Thumbnail size looks wrong | One target dimension is missing or zero | Set both `targetWidth` and `targetHeight` to positive values. |
| Export is slow | Target dimensions or PNG compression are too high | Reduce dimensions or use a lower compression level. |
| File size is too large | Quality settings or dimensions are too high | Lower JPEG quality or reduce the target size. |
| Export fails | The scene has not loaded or no page is selected | Load a scene and get the current page before exporting. |

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(block=_, mimeType=_, options=_)` | Export a page, scene, group, or block as image data. |
| `engine.scene.getCurrentPage()` | Get the current page block to export as a thumbnail. |
| `engine.scene.getPages()` | Get available page blocks when no current page is selected. |
| `ExportOptions(targetWidth=_, targetHeight=_)` | Scale the exported output to thumbnail dimensions. |
| `ExportOptions(jpegQuality=_)` | Tune JPEG output quality and file size. |
| `ExportOptions(pngCompressionLevel=_)` | Tune PNG compression speed and file size. |

## Next Steps

- To learn more about exporting images and controlling output quality, see [Export designs to image formats](./export/overview.md).
- Reduce file size or tune quality for thumbnails and previews with [Compress exported images](./export/compress.md).
- If you need to generate thumbnails at scale or as part of automated workflows, take a look at [Batch processing designs](../automation/batch-processing.md).



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support