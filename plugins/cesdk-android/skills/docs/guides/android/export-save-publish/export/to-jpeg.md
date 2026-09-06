> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To JPEG](./to-jpeg.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-export-to-jpeg/ToJpeg.kt reference-only
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer

data class JpegExport(
    val label: String,
    val jpegData: ByteBuffer,
)

data class ToJpegResult(
    val defaultQuality: JpegExport,
    val highQuality: JpegExport,
    val targetDimensions: JpegExport,
    val savedFile: File,
) {
    val allExports: List<JpegExport>
        get() = listOf(defaultQuality, highQuality, targetDimensions)
}

suspend fun toJpeg(
    engine: Engine,
    outputDir: File,
): ToJpegResult {
    val page = createJpegExportPage(engine)

    val defaultQualityData = exportToJpeg(engine, page)
    val highQualityData = exportJpegWithQuality(engine, page)
    val targetDimensionsData = exportJpegWithTargetDimensions(engine, page)
    val savedFile = saveJpegToFile(
        buffer = defaultQualityData,
        outputFile = File(outputDir, "to-jpeg-page.jpg"),
    )

    return ToJpegResult(
        defaultQuality = JpegExport("default quality", defaultQualityData),
        highQuality = JpegExport("high quality", highQualityData),
        targetDimensions = JpegExport("target dimensions", targetDimensionsData),
        savedFile = savedFile,
    )
}

suspend fun createJpegExportPage(engine: Engine): DesignBlock {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(background, "JPEG export background")
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 1280F)
    engine.block.setHeight(background, value = 720F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(background, color = Color.fromHex("#FFF4F0EA"))
    engine.block.appendChild(parent = page, child = background)

    val photoPanel = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(photoPanel, "JPEG export photo panel")
    engine.block.setShape(photoPanel, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(photoPanel, value = 820F)
    engine.block.setHeight(photoPanel, value = 460F)
    engine.block.setPositionX(photoPanel, value = 230F)
    engine.block.setPositionY(photoPanel, value = 130F)
    engine.block.setFill(photoPanel, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(photoPanel, color = Color.fromHex("#FF255C99"))
    engine.block.appendChild(parent = page, child = photoPanel)

    val highlight = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(highlight, "JPEG export highlight")
    engine.block.setShape(highlight, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(highlight, value = 520F)
    engine.block.setHeight(highlight, value = 160F)
    engine.block.setPositionX(highlight, value = 380F)
    engine.block.setPositionY(highlight, value = 270F)
    engine.block.setFill(highlight, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(highlight, color = Color.fromHex("#FFE7B65E"))
    engine.block.appendChild(parent = page, child = highlight)

    return page
}

suspend fun exportToJpeg(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val options = ExportOptions(jpegQuality = 0.9F)
    val jpegData = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(jpegData.hasRemaining()) { "JPEG export is empty" }
    return jpegData
}

suspend fun exportJpegWithQuality(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val options = ExportOptions(jpegQuality = 1.0F)
    val jpegData = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(jpegData.hasRemaining()) { "high-quality JPEG export is empty" }
    return jpegData
}

suspend fun exportJpegWithTargetDimensions(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val options = ExportOptions(
        jpegQuality = 0.85F,
        targetWidth = 1920F,
        targetHeight = 1080F,
    )
    val jpegData = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(jpegData.hasRemaining()) { "target-dimension JPEG export is empty" }
    return jpegData
}

suspend fun saveJpegToFile(
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

    check(outputFile.length() > 0L) { "Saved JPEG export is empty" }
    outputFile
}
```

Export CE.SDK designs to JPEG format when file size matters more than
transparency.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260906/engine-guides-export-to-jpeg)

JPEG uses lossy compression, which makes it a good fit for photographs, social media images, and web delivery. It does not preserve transparency, so transparent areas become opaque in the exported image.

<EngineReferenceNote {...props} />

This guide covers exporting a page to JPEG, tuning quality, resizing the output, and writing the returned `ByteBuffer` to a file.

## Export to JPEG

Call `engine.block.export(...)` with `MimeType.JPEG` to render a page, scene, group, or block as JPEG data. Pass `ExportOptions` when you want to set the quality explicitly.

```kotlin highlight-android-export-jpeg
suspend fun exportToJpeg(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val options = ExportOptions(jpegQuality = 0.9F)
    val jpegData = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(jpegData.hasRemaining()) { "JPEG export is empty" }
    return jpegData
}
```

The `jpegQuality` value accepts floats from greater than `0F` to `1F`. Higher values keep more visual detail and produce larger files; the default is `0.9F`.

## Export Options

JPEG export reads these fields from `ExportOptions`:

| Option         | Type     | Default | Description                                       |
| -------------- | -------- | ------- | ------------------------------------------------- |
| `jpegQuality`  | `Float`  | `0.9F`  | Quality from greater than `0F` to `1F`            |
| `targetWidth`  | `Float?` | `null`  | Output width in pixels, used together with height |
| `targetHeight` | `Float?` | `null`  | Output height in pixels, used together with width |

### Quality Control

Use `jpegQuality = 1.0F` when you need maximum quality and can accept the larger file. Values around `0.8F` to `0.85F` usually work well for web delivery or social media.

```kotlin highlight-android-quality-control
suspend fun exportJpegWithQuality(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val options = ExportOptions(jpegQuality = 1.0F)
    val jpegData = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(jpegData.hasRemaining()) { "high-quality JPEG export is empty" }
    return jpegData
}
```

Lower values reduce file size but can introduce visible compression artifacts, especially around text and hard edges.

### Target Dimensions

Set `targetWidth` and `targetHeight` together to export at a specific size. CE.SDK renders the block large enough to fill the target size while maintaining the block's aspect ratio.

```kotlin highlight-android-target-dimensions
suspend fun exportJpegWithTargetDimensions(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val options = ExportOptions(
        jpegQuality = 0.85F,
        targetWidth = 1920F,
        targetHeight = 1080F,
    )
    val jpegData = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(jpegData.hasRemaining()) { "target-dimension JPEG export is empty" }
    return jpegData
}
```

If the target aspect ratio differs from the block's aspect ratio, the exported image extends on one axis to preserve proportions.

## Save to File System

Android receives the export as a `ByteBuffer`. Write from a read-only duplicate when the same buffer is also needed for validation, upload, or decoding later in your flow.

```kotlin highlight-android-save-file
suspend fun saveJpegToFile(
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

    check(outputFile.length() > 0L) { "Saved JPEG export is empty" }
    outputFile
}
```

The sample writes into an app-controlled `File`. Use your app's own storage, upload, or sharing pipeline when the JPEG should leave local storage.

## When to Use JPEG

JPEG works well for:

- Photographs and images with gradual color transitions
- Social media posts and web content
- Exports where small file size matters more than perfect pixel fidelity

> **Note:** Use PNG instead when the design needs transparency, sharp text, crisp vector
> edges, or lossless output.

## Troubleshooting

**Output looks blurry** - Increase `jpegQuality` toward `1.0F`, or use PNG for graphics with hard edges.

**File size is too large** - Lower `jpegQuality` toward `0.7F` to `0.8F`, or reduce dimensions with `targetWidth` and `targetHeight`.

**Transparent areas look opaque** - JPEG does not support alpha. Export PNG when transparent pixels must stay transparent.

## API Reference

| API                                                           | Purpose                                      |
| ------------------------------------------------------------- | -------------------------------------------- |
| `engine.block.export(block=_, mimeType=_, options=_)`         | Export one block as JPEG `ByteBuffer` data   |
| `ExportOptions(jpegQuality=_, targetWidth=_, targetHeight=_)` | Configure JPEG quality and output dimensions |

## Next Steps

- [Export Overview](./overview.md) - Compare all available export formats
- [Export to PDF](./to-pdf.md) - Export for print and document workflows
- [Partial Export](./partial-export.md) - Export specific blocks, groups, and page
  elements instead of entire scenes using CE.SDK's programmatic export API.
- [Size Limits](./size-limits.md) - Understand and configure limits on exported
  file dimensions or data size.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support