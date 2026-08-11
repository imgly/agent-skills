> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Conversion](../conversion.md) > [To Binary Data](./to-blob.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-to-blob/ToBlob.kt reference-only
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

data class ToBlobResult(
    val pngData: ByteBuffer,
    val jpegData: ByteBuffer,
    val pageExports: List<ByteBuffer>,
    val savedPngFile: File,
)

suspend fun toBlob(
    engine: Engine,
    outputDir: File,
): ToBlobResult = withContext(engine.dispatcher) {
    val pages = createExportScene(engine)
    val page = pages.first()
    val pngData = exportBlockToBinaryData(engine, page).copyForVerification()
    val jpegData = exportWithOptions(engine, page).copyForVerification()
    val pageExports = exportMultipleBlocks(engine).map(ByteBuffer::copyForVerification)
    val savedPngFile = saveByteBufferToFile(
        buffer = pngData,
        outputFile = File(outputDir, "to-blob-page.png"),
    )

    ToBlobResult(
        pngData = pngData,
        jpegData = jpegData,
        pageExports = pageExports,
        savedPngFile = savedPngFile,
    )
}

private fun ByteBuffer.copyForVerification(): ByteBuffer {
    val duplicate = asReadOnlyBuffer()
    val bytes = ByteArray(duplicate.remaining())
    duplicate.get(bytes)
    return ByteBuffer.wrap(bytes).asReadOnlyBuffer()
}

private fun createExportScene(engine: Engine): List<DesignBlock> {
    val scene = engine.scene.create()

    return List(2) { pageIndex ->
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(page, value = 1280F)
        engine.block.setHeight(page, value = 720F)
        engine.block.appendChild(parent = scene, child = page)

        addPageContent(engine, page, pageIndex)
        page
    }
}

private fun addPageContent(
    engine: Engine,
    page: DesignBlock,
    pageIndex: Int,
) {
    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(background, "To Blob background")
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 1280F)
    engine.block.setHeight(background, value = 720F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = background,
        color = Color.fromHex("#FFF8FAFC"),
    )
    engine.block.appendChild(parent = page, child = background)

    val panel = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(panel, "To Blob export panel")
    engine.block.setShape(panel, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(panel, value = 820F)
    engine.block.setHeight(panel, value = 420F)
    engine.block.setPositionX(panel, value = 230F)
    engine.block.setPositionY(panel, value = 150F)
    engine.block.setFill(panel, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = panel,
        color = if (pageIndex == 0) Color.fromHex("#FF1F6FEB") else Color.fromHex("#FFCF3E53"),
    )
    engine.block.appendChild(parent = page, child = panel)

    val stripe = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(stripe, "To Blob accent stripe")
    engine.block.setShape(stripe, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(stripe, value = 820F)
    engine.block.setHeight(stripe, value = 72F)
    engine.block.setPositionX(stripe, value = 230F)
    engine.block.setPositionY(stripe, value = 498F)
    engine.block.setFill(stripe, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = stripe,
        color = Color.fromHex("#FF111827"),
    )
    engine.block.appendChild(parent = page, child = stripe)
}

suspend fun exportBlockToBinaryData(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer = withContext(engine.dispatcher) {
    val pngData = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
    )

    check(pngData.hasRemaining()) { "PNG export is empty" }
    pngData
}

suspend fun exportWithOptions(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer = withContext(engine.dispatcher) {
    val options = ExportOptions(
        jpegQuality = 0.8F,
        targetWidth = 1920F,
        targetHeight = 1080F,
    )
    val jpegData = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(jpegData.hasRemaining()) { "JPEG export is empty" }
    jpegData
}

suspend fun exportMultipleBlocks(engine: Engine): List<ByteBuffer> = withContext(engine.dispatcher) {
    val pages = engine.scene.getPages()
    val pngBuffers = engine.block.export(
        blocks = pages,
        mimeType = MimeType.PNG,
    )

    check(pngBuffers.size == pages.size)
    pngBuffers.forEachIndexed { index, pngData ->
        check(pngData.hasRemaining()) { "PNG export ${index + 1} is empty" }
    }
    pngBuffers
}

suspend fun saveByteBufferToFile(
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

    check(outputFile.length() > 0L) { "Saved export is empty" }
    outputFile
}
```

Export design blocks to binary `ByteBuffer` data for saving to disk, uploading to a server, sharing, or converting to platform images.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260811/engine-guides-to-blob)

CE.SDK's `engine.block.export()` method renders a page, scene, or individual design block into binary data. Android returns a `ByteBuffer`, so your app can write the result to app-controlled storage, upload it, share it, or decode image exports with Android platform APIs.

<EngineReferenceNote {...props} />

## Export a Block to Binary Data

Call `engine.block.export(...)` with the block ID and target MIME type. This example exports an existing page to PNG and checks that the returned `ByteBuffer` contains data.

```kotlin highlight-android-export-png
suspend fun exportBlockToBinaryData(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer = withContext(engine.dispatcher) {
    val pngData = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
    )

    check(pngData.hasRemaining()) { "PNG export is empty" }
    pngData
}
```

Supported export MIME type constants include `MimeType.PNG`, `MimeType.JPEG`, `MimeType.TGA`, `MimeType.SVG`, `MimeType.PDF`, and `MimeType.BINARY`. Use `engine.block.exportVideo(...)` for MP4 video output.

## Configure Export Options

Pass `ExportOptions` when you need to control format-specific quality or output dimensions. This JPEG example uses `jpegQuality = 0.8F` and scales the rendered output to `1920 x 1080`.

```kotlin highlight-android-export-options
suspend fun exportWithOptions(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer = withContext(engine.dispatcher) {
    val options = ExportOptions(
        jpegQuality = 0.8F,
        targetWidth = 1920F,
        targetHeight = 1080F,
    )
    val jpegData = engine.block.export(
        block = page,
        mimeType = MimeType.JPEG,
        options = options,
    )

    check(jpegData.hasRemaining()) { "JPEG export is empty" }
    jpegData
}
```

Format-specific options are ignored by other formats. For example, `jpegQuality` only affects JPEG exports, while `targetWidth` and `targetHeight` resize image output when both dimensions are set.

## Export Multiple Blocks

Use the batch overload when you need one binary export per page or block. The returned list follows the input order and the export reuses one worker engine for the batch.

```kotlin highlight-android-export-multiple
suspend fun exportMultipleBlocks(engine: Engine): List<ByteBuffer> = withContext(engine.dispatcher) {
    val pages = engine.scene.getPages()
    val pngBuffers = engine.block.export(
        blocks = pages,
        mimeType = MimeType.PNG,
    )

    check(pngBuffers.size == pages.size)
    pngBuffers.forEachIndexed { index, pngData ->
        check(pngData.hasRemaining()) { "PNG export ${index + 1} is empty" }
    }
    pngBuffers
}
```

## Save to Disk

Use a duplicate or read-only view before writing a `ByteBuffer` if the same buffer is also needed for later validation, upload, or decoding.

```kotlin highlight-android-save-to-file
suspend fun saveByteBufferToFile(
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

    check(outputFile.length() > 0L) { "Saved export is empty" }
    outputFile
}
```

The sample writes into an app-controlled `File`. Use the same binary data with your own upload or share pipeline when the exported file should leave local storage.

## API Reference

| API | Purpose |
| --- | --- |
| `engine.block.export(block=_, mimeType=_, options=_)` | Export one block as a `ByteBuffer` |
| `engine.block.export(blocks=_, mimeType=_, options=_)` | Export several blocks as a `List<ByteBuffer>` |
| `ExportOptions(jpegQuality=_, targetWidth=_, targetHeight=_)` | Configure output quality and dimensions |
| `engine.scene.getPages()` | Get pages for batch export examples |

## Next Steps

- [To PDF](./to-pdf.md) — Convert your design or document into a high-quality, print-ready PDF format.
- [Conversion Overview](./overview.md) - See all supported export formats.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support