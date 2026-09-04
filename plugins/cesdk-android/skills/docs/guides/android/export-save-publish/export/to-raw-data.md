> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To Raw Data](./to-raw-data.md)

---

Export CE.SDK designs to raw RGBA pixel data when your Android app needs
direct access to bytes for custom image processing, GPU uploads, or advanced
graphics pipelines.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260904/engine-guides-export-to-raw-data)

<EngineReferenceNote {...props} />

```kotlin file=@cesdk_android_examples/engine-guides-export-to-raw-data/ToRawData.kt reference-only
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.yield
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
import kotlin.math.ceil
import kotlin.math.max

data class ToRawDataResult(
    val width: Int,
    val height: Int,
    val maxExportSize: Int,
    val rawByteCount: Int,
    val centerPixel: RgbaPixel,
    val rawFile: File,
    val thumbnailByteCount: Int,
)

suspend fun toRawData(
    engine: Engine,
    outputDir: File,
): ToRawDataResult {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 640F)
    engine.block.setHeight(page, value = 360F)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(background, "Raw data background")
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 640F)
    engine.block.setHeight(background, value = 360F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = background,
        color = Color.fromHex("#FF101827"),
    )
    engine.block.appendChild(parent = page, child = background)

    // The centered panel gives the smoke test a deterministic raw pixel value.
    val panel = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(panel, "Raw data sample panel")
    engine.block.setShape(panel, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(panel, value = 360F)
    engine.block.setHeight(panel, value = 200F)
    engine.block.setPositionX(panel, value = 140F)
    engine.block.setPositionY(panel, value = 80F)
    engine.block.setFill(panel, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = panel,
        color = Color.fromHex("#FFFF0000"),
    )
    engine.block.appendChild(parent = page, child = panel)

    val width = 1920
    val height = 1080
    val maxExportSize = ensureRawExportFits(engine, page, width, height)
    val rawData = exportRawData(
        engine = engine,
        page = page,
        width = width,
        height = height,
        onPreExport = {
            waitForBackgroundExportEngine()
        },
    )
    val centerPixel = readPixel(
        rawData = rawData,
        width = width,
        x = width / 2,
        y = height / 2,
    )
    val rawFile = saveRawDataFile(
        rawData = rawData,
        outputFile = File(outputDir, "design.rgba"),
    )
    val thumbnailData = exportRawThumbnail(
        engine = engine,
        page = page,
        onPreExport = {
            waitForBackgroundExportEngine()
        },
    )

    return ToRawDataResult(
        width = width,
        height = height,
        maxExportSize = maxExportSize,
        rawByteCount = rawData.remaining(),
        centerPixel = centerPixel,
        rawFile = rawFile,
        thumbnailByteCount = thumbnailData.remaining(),
    )
}

suspend fun exportRawData(
    engine: Engine,
    page: DesignBlock,
    width: Int,
    height: Int,
    onPreExport: suspend Engine.() -> Unit = {},
): ByteBuffer {
    val options = ExportOptions(
        targetWidth = width.toFloat(),
        targetHeight = height.toFloat(),
    )
    val rawData = engine.block.export(
        block = page,
        mimeType = MimeType.BINARY,
        options = options,
        onPreExport = onPreExport,
    )

    check(rawData.remaining() % 4 == 0) {
        "Expected complete RGBA pixels, got ${rawData.remaining()} bytes"
    }
    return rawData
}

data class RgbaPixel(
    val red: Int,
    val green: Int,
    val blue: Int,
    val alpha: Int,
)

fun readPixel(
    rawData: ByteBuffer,
    width: Int,
    x: Int,
    y: Int,
): RgbaPixel {
    check(width > 0) {
        "Raw data width must be greater than zero"
    }
    val bytesPerPixel = 4
    val rowByteCount = width * bytesPerPixel
    val byteCount = rawData.limit()
    check(byteCount % rowByteCount == 0) {
        "Raw data buffer does not contain complete rows for width $width"
    }
    val height = byteCount / rowByteCount
    check(x in 0 until width && y in 0 until height) {
        "Pixel coordinate ($x, $y) is outside the ${width}x$height raw data buffer"
    }
    val index = (y * width + x) * 4
    val buffer = rawData.asReadOnlyBuffer()

    return RgbaPixel(
        red = buffer.get(index).toInt() and 0xFF,
        green = buffer.get(index + 1).toInt() and 0xFF,
        blue = buffer.get(index + 2).toInt() and 0xFF,
        alpha = buffer.get(index + 3).toInt() and 0xFF,
    )
}

suspend fun saveRawDataFile(
    rawData: ByteBuffer,
    outputFile: File,
): File = withContext(Dispatchers.IO) {
    outputFile.parentFile?.mkdirs()
    val readableData = rawData.asReadOnlyBuffer()
    val expectedByteCount = readableData.remaining().toLong()

    FileOutputStream(outputFile).channel.use { channel ->
        while (readableData.hasRemaining()) {
            channel.write(readableData)
        }
    }

    check(outputFile.length() == expectedByteCount) {
        "Saved raw data file has ${outputFile.length()} bytes, expected $expectedByteCount"
    }
    outputFile
}

suspend fun exportRawThumbnail(
    engine: Engine,
    page: DesignBlock,
    onPreExport: suspend Engine.() -> Unit = {},
): ByteBuffer {
    val width = 960
    val height = 540
    val options = ExportOptions(
        targetWidth = width.toFloat(),
        targetHeight = height.toFloat(),
    )
    val rawData = engine.block.export(
        block = page,
        mimeType = MimeType.BINARY,
        options = options,
        onPreExport = onPreExport,
    )

    check(rawData.remaining() % 4 == 0) {
        "Expected complete RGBA pixels, got ${rawData.remaining()} bytes"
    }
    return rawData
}

fun ensureRawExportFits(
    engine: Engine,
    block: DesignBlock,
    width: Int,
    height: Int,
): Int {
    check(width > 0 && height > 0) {
        "Requested raw export size must be greater than zero"
    }
    val blockWidth = engine.block.getWidth(block)
    val blockHeight = engine.block.getHeight(block)
    check(blockWidth > 0F && blockHeight > 0F) {
        "Raw export block size must be greater than zero"
    }
    val scale = max(width.toFloat() / blockWidth, height.toFloat() / blockHeight)
    val filledWidth = ceil(blockWidth * scale).toInt()
    val filledHeight = ceil(blockHeight * scale).toInt()
    val maxExportSize = engine.editor.getMaxExportSize()
    check(filledWidth <= maxExportSize && filledHeight <= maxExportSize) {
        "Requested raw export size ${width}x$height fills to ${filledWidth}x$filledHeight, exceeding the $maxExportSize px limit"
    }
    return maxExportSize
}

private suspend fun waitForBackgroundExportEngine() {
    // Raw data exports finish quickly enough that the Android background export engine
    // can otherwise stop before its startup settings stream has registered.
    yield()
}
```

This guide covers exporting raw RGBA bytes, reading individual pixels, saving the byte stream, and controlling the output resolution.

## When to Use Raw Data Export

Raw pixel data export gives you direct access to uncompressed RGBA bytes from CE.SDK, with complete control over individual pixels for custom processing.

Reach for raw data when you need pixel-level access for custom algorithms, GPU texture uploads, machine-learning inputs, or intermediate processing. For standard image delivery, use PNG or JPEG instead because those formats are compressed and ready to display, store, or transfer.

## Understanding Raw Data Format

When you export with `MimeType.BINARY`, CE.SDK returns a `ByteBuffer` containing uncompressed RGBA8888 pixel data:

- **4 bytes per pixel** representing Red, Green, Blue, and Alpha channels
- **Values from 0-255** for each channel
- **Row-major order** with pixels arranged left-to-right, top-to-bottom
- **Total size** equal to width × height × 4 bytes

The RGB channels are premultiplied by alpha. For translucent pixels, unpremultiply each color channel before passing the bytes to APIs that expect straight RGBA values.

## How to Export Raw Data

Export a block as raw pixel data by calling `engine.block.export(...)` with `MimeType.BINARY`. Pair the call with `targetWidth` and `targetHeight` on `ExportOptions` when your downstream pipeline needs bounded output dimensions. The optional `onPreExport` hook is available when your app needs to configure the temporary export engine before rendering.

The sample page uses the same 16:9 aspect ratio as its 1920x1080 export target, so the returned raw buffer is exactly `width × height × 4` bytes. For other aspect ratios, CE.SDK preserves the block aspect ratio while scaling enough to fill the requested target size; validate the returned buffer size before using fixed coordinates.

```kotlin highlight-android-export
suspend fun exportRawData(
    engine: Engine,
    page: DesignBlock,
    width: Int,
    height: Int,
    onPreExport: suspend Engine.() -> Unit = {},
): ByteBuffer {
    val options = ExportOptions(
        targetWidth = width.toFloat(),
        targetHeight = height.toFloat(),
    )
    val rawData = engine.block.export(
        block = page,
        mimeType = MimeType.BINARY,
        options = options,
        onPreExport = onPreExport,
    )

    check(rawData.remaining() % 4 == 0) {
        "Expected complete RGBA pixels, got ${rawData.remaining()} bytes"
    }
    return rawData
}
```

The returned `ByteBuffer` contains the RGBA bytes directly. The rest of this guide reads and stores that buffer without running it through PNG or JPEG encoding first.

## Download Exported Data

Once you have the raw bytes, you can inspect them directly, write them to app storage, or pass them to your own graphics pipeline.

### Read Individual Pixels

Index into the buffer at `(y * width + x) * 4`. The four bytes at that offset are Red, Green, Blue, and Alpha respectively, which is useful for color sampling, brightness analysis, custom filters, or passing pixels to another native layer.

```kotlin highlight-android-read-pixel
data class RgbaPixel(
    val red: Int,
    val green: Int,
    val blue: Int,
    val alpha: Int,
)

fun readPixel(
    rawData: ByteBuffer,
    width: Int,
    x: Int,
    y: Int,
): RgbaPixel {
    check(width > 0) {
        "Raw data width must be greater than zero"
    }
    val bytesPerPixel = 4
    val rowByteCount = width * bytesPerPixel
    val byteCount = rawData.limit()
    check(byteCount % rowByteCount == 0) {
        "Raw data buffer does not contain complete rows for width $width"
    }
    val height = byteCount / rowByteCount
    check(x in 0 until width && y in 0 until height) {
        "Pixel coordinate ($x, $y) is outside the ${width}x$height raw data buffer"
    }
    val index = (y * width + x) * 4
    val buffer = rawData.asReadOnlyBuffer()

    return RgbaPixel(
        red = buffer.get(index).toInt() and 0xFF,
        green = buffer.get(index + 1).toInt() and 0xFF,
        blue = buffer.get(index + 2).toInt() and 0xFF,
        alpha = buffer.get(index + 3).toInt() and 0xFF,
    )
}
```

### Write Raw Bytes

Write the `ByteBuffer` to a file when another Android component, native module, or backend upload expects the raw RGBA stream. Use a duplicate or read-only view before writing so the caller can still inspect the original buffer position afterward.

```kotlin highlight-android-save-file
suspend fun saveRawDataFile(
    rawData: ByteBuffer,
    outputFile: File,
): File = withContext(Dispatchers.IO) {
    outputFile.parentFile?.mkdirs()
    val readableData = rawData.asReadOnlyBuffer()
    val expectedByteCount = readableData.remaining().toLong()

    FileOutputStream(outputFile).channel.use { channel ->
        while (readableData.hasRemaining()) {
            channel.write(readableData)
        }
    }

    check(outputFile.length() == expectedByteCount) {
        "Saved raw data file has ${outputFile.length()} bytes, expected $expectedByteCount"
    }
    outputFile
}
```

## Performance Considerations

Raw RGBA data grows linearly with pixel count: a 1920x1080 export consumes about 8.3 MB, compared with a much smaller compressed PNG or JPEG for many designs. Two engine settings help keep memory usage bounded.

### Reduce the Export Resolution

Pass `targetWidth` and `targetHeight` on `ExportOptions` to reduce the export scale while preserving the block's aspect ratio. Both fields default to `null`, which leaves the block's own size in control.

```kotlin highlight-android-target-size
suspend fun exportRawThumbnail(
    engine: Engine,
    page: DesignBlock,
    onPreExport: suspend Engine.() -> Unit = {},
): ByteBuffer {
    val width = 960
    val height = 540
    val options = ExportOptions(
        targetWidth = width.toFloat(),
        targetHeight = height.toFloat(),
    )
    val rawData = engine.block.export(
        block = page,
        mimeType = MimeType.BINARY,
        options = options,
        onPreExport = onPreExport,
    )

    check(rawData.remaining() % 4 == 0) {
        "Expected complete RGBA pixels, got ${rawData.remaining()} bytes"
    }
    return rawData
}
```

### Check Export Size Limits

Before exporting very large blocks, query the maximum supported export dimension. `getMaxExportSize()` returns the side-length cap in pixels for either width or height. When the target and block aspect ratios differ, check the filled output size that CE.SDK renders, not only the requested target box.

```kotlin highlight-android-check-limits
fun ensureRawExportFits(
    engine: Engine,
    block: DesignBlock,
    width: Int,
    height: Int,
): Int {
    check(width > 0 && height > 0) {
        "Requested raw export size must be greater than zero"
    }
    val blockWidth = engine.block.getWidth(block)
    val blockHeight = engine.block.getHeight(block)
    check(blockWidth > 0F && blockHeight > 0F) {
        "Raw export block size must be greater than zero"
    }
    val scale = max(width.toFloat() / blockWidth, height.toFloat() / blockHeight)
    val filledWidth = ceil(blockWidth * scale).toInt()
    val filledHeight = ceil(blockHeight * scale).toInt()
    val maxExportSize = engine.editor.getMaxExportSize()
    check(filledWidth <= maxExportSize && filledHeight <= maxExportSize) {
        "Requested raw export size ${width}x$height fills to ${filledWidth}x$filledHeight, exceeding the $maxExportSize px limit"
    }
    return maxExportSize
}
```

### When to Use Raw vs. Compressed

- **Use raw data** when you need custom post-processing on CE.SDK exports before delivery
- **Use raw data** for intermediate steps in multi-stage pipelines or GPU uploads that would otherwise require decoding a PNG first
- **Use PNG or JPEG** when the output goes straight to disk, a user, or a network transfer
- **Validate the returned byte count** when another system expects fixed buffer dimensions

## API Reference

| API                                                                                | Description                                                                                   |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `engine.block.export(block=_, mimeType=MimeType.BINARY, options=_, onPreExport=_)` | Exports a block as raw RGBA data in a `ByteBuffer`                                            |
| `engine.block.getWidth(block=_)`                                                   | Returns the block width used to predict filled raw export dimensions                          |
| `engine.block.getHeight(block=_)`                                                  | Returns the block height used to predict filled raw export dimensions                         |
| `ExportOptions(targetWidth=_, targetHeight=_)`                                     | Controls the rendered output dimensions for the raw buffer                                    |
| `engine.editor.getMaxExportSize()`                                                 | Returns the maximum supported export side length in pixels                                    |
| `ByteBuffer.remaining()`                                                           | Returns the number of bytes available from the current position to the limit                  |
| `ByteBuffer.get(index=_)`                                                          | Reads one byte at an absolute buffer index without changing the current position              |
| `ByteBuffer.limit()`                                                               | Returns the upper bound used for absolute index validation                                    |
| `ByteBuffer.asReadOnlyBuffer()`                                                    | Creates a duplicate view for reading or writing without mutating the original buffer position |

### Related Types

| Type              | Purpose                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `MimeType.BINARY` | Android enum value for `application/octet-stream` raw RGBA export                        |
| `RgbaPixel`       | Example value object that stores one pixel as Red, Green, Blue, and Alpha channel values |

## Next Steps

- [Export Overview](./overview.md) — Compare all available export formats
- [To PNG](./to-png.md) — Export your designs as PNG images with transparency
  support and configurable compression for web graphics, UI elements, and content
  requiring crisp edges.
- [To JPEG](./to-jpeg.md) — Export CE.SDK designs to JPEG format with configurable
  quality settings for photographs, web images, and social media content.
- [Export to PDF](./to-pdf.md) — Vector export for print and document workflows
- [Partial Export](./partial-export.md) — Learn how to export specific blocks,
  groups, and page elements instead of entire scenes using CE.SDK's programmatic
  export API.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support