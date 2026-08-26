> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [With a Color Mask](./with-color-mask.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-export-with-color-mask/ExportWithColorMask.kt reference-only
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.RGBAColor
import ly.img.engine.ShapeType
import java.io.File
import java.nio.ByteBuffer

suspend fun exportWithColorMask(engine: Engine): Pair<ByteBuffer, ByteBuffer> {
    val page = createColorMaskScene(engine)
    return exportPageWithColorMask(engine, page)
}

suspend fun exportPageWithColorMask(
    engine: Engine,
    page: DesignBlock,
): Pair<ByteBuffer, ByteBuffer> {
    val maskColor = Color.fromRGBA(r = 1F, g = 0F, b = 0F)
    val options = ExportOptions(
        pngCompressionLevel = 9,
        targetWidth = 800F,
        targetHeight = 600F,
    )

    val (maskedImage, maskImage) = engine.block.exportWithColorMask(
        block = page,
        mimeType = MimeType.PNG,
        maskColor = maskColor,
        options = options,
    )

    check(maskedImage.hasRemaining()) { "Masked image export is empty" }
    check(maskImage.hasRemaining()) { "Mask image export is empty" }
    return maskedImage to maskImage
}

suspend fun saveColorMaskFiles(
    maskedImage: ByteBuffer,
    maskImage: ByteBuffer,
    outputDir: File,
): Pair<File, File> = withContext(Dispatchers.IO) {
    outputDir.mkdirs()

    val maskedImageFile = File(outputDir, "color-mask-image.png")
    val maskImageFile = File(outputDir, "color-mask-mask.png")

    fun writeBuffer(
        buffer: ByteBuffer,
        outputFile: File,
    ) {
        outputFile.outputStream().channel.use { channel ->
            val readableBuffer = buffer.asReadOnlyBuffer()
            while (readableBuffer.hasRemaining()) {
                channel.write(readableBuffer)
            }
        }
    }

    writeBuffer(maskedImage, maskedImageFile)
    writeBuffer(maskImage, maskImageFile)

    maskedImageFile to maskImageFile
}

private fun createColorMaskScene(engine: Engine): DesignBlock {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    fun addRectangle(
        name: String,
        x: Float,
        y: Float,
        width: Float,
        height: Float,
        color: RGBAColor,
    ) {
        val block = engine.block.create(DesignBlockType.Graphic)
        engine.block.setName(block, name = name)
        engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setFill(block, fill = engine.block.createFill(FillType.Color))
        engine.block.setFillSolidColor(block = block, color = color)
        engine.block.setPositionX(block, value = x)
        engine.block.setPositionY(block, value = y)
        engine.block.setWidth(block, value = width)
        engine.block.setHeight(block, value = height)
        engine.block.appendChild(parent = page, child = block)
    }

    addRectangle(
        name = "Color mask background",
        x = 0F,
        y = 0F,
        width = 800F,
        height = 600F,
        color = Color.fromHex("#FFF8FAFC"),
    )
    addRectangle(
        name = "Print content",
        x = 170F,
        y = 145F,
        width = 460F,
        height = 310F,
        color = Color.fromHex("#FF2457D6"),
    )

    val redMaskColor = Color.fromRGBA(r = 1F, g = 0F, b = 0F)
    listOf(
        48F to 48F,
        704F to 48F,
        48F to 504F,
        704F to 504F,
    ).forEachIndexed { index, (x, y) ->
        addRectangle(
            name = "Registration mark ${index + 1}",
            x = x,
            y = y,
            width = 48F,
            height = 48F,
            color = redMaskColor,
        )
    }

    return page
}
```

Isolate specific opaque colors from Android image exports and generate a
matching mask image for print and compositing workflows.

![Export with a color mask showing the Android sample image and mask outputs](https://img.ly/docs/cesdk/android/export-save-publish/export/with-color-mask-4f868f/assets/android.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260826/engine-guides-export-with-color-mask)

CE.SDK can render a second export pass for pixels that match a chosen opaque color. Android returns a `Pair<ByteBuffer, ByteBuffer>`: the first buffer contains the image result, and the second buffer contains the mask image.

<EngineReferenceNote {...props} />

## Exporting with Color Masks

Call `engine.block.exportWithColorMask(...)` with the page or block you want to export, the output MIME type, a mask color, and optional `ExportOptions`. This example isolates fully opaque red registration marks from a PNG export.

```kotlin highlight-android-export-with-color-mask
suspend fun exportPageWithColorMask(
    engine: Engine,
    page: DesignBlock,
): Pair<ByteBuffer, ByteBuffer> {
    val maskColor = Color.fromRGBA(r = 1F, g = 0F, b = 0F)
    val options = ExportOptions(
        pngCompressionLevel = 9,
        targetWidth = 800F,
        targetHeight = 600F,
    )

    val (maskedImage, maskImage) = engine.block.exportWithColorMask(
        block = page,
        mimeType = MimeType.PNG,
        maskColor = maskColor,
        options = options,
    )

    check(maskedImage.hasRemaining()) { "Masked image export is empty" }
    check(maskImage.hasRemaining()) { "Mask image export is empty" }
    return maskedImage to maskImage
}
```

Use `MimeType.PNG` for lossless image output and predictable mask pixels. The sample also sets `targetWidth` and `targetHeight` so the image result and mask image have predictable pixel dimensions.

> **Note:** Color matching is exact against the rendered RGBA value. Android uses a fully
> opaque mask color, so semi-transparent pixels with the same RGB components,
> anti-aliased edges, gradients, compressed source images, and near matches are
> not included in the mask.

### Specifying Color Values

`exportWithColorMask` takes an opaque `RGBAColor` as its mask color. Use the `Color.fromRGBA(...)` overload that matches the values your app already has:

- Normalized components: `Color.fromRGBA(r = 1F, g = 0F, b = 0F)`
- 8-bit components: `Color.fromRGBA(r = 255, g = 0, b = 0)`

When your scene uses CMYK process colors, create those source fills with `Color.fromCMYK(...)`. The mask color still needs the exact opaque RGB value the rendered export should match.

## Save the Export Files

Write each returned `ByteBuffer` separately on `Dispatchers.IO`. Use a read-only duplicate when writing if the same buffer will also be decoded, uploaded, or inspected later.

```kotlin highlight-android-save-color-mask-files
suspend fun saveColorMaskFiles(
    maskedImage: ByteBuffer,
    maskImage: ByteBuffer,
    outputDir: File,
): Pair<File, File> = withContext(Dispatchers.IO) {
    outputDir.mkdirs()

    val maskedImageFile = File(outputDir, "color-mask-image.png")
    val maskImageFile = File(outputDir, "color-mask-mask.png")

    fun writeBuffer(
        buffer: ByteBuffer,
        outputFile: File,
    ) {
        outputFile.outputStream().channel.use { channel ->
            val readableBuffer = buffer.asReadOnlyBuffer()
            while (readableBuffer.hasRemaining()) {
                channel.write(readableBuffer)
            }
        }
    }

    writeBuffer(maskedImage, maskedImageFile)
    writeBuffer(maskImage, maskImageFile)

    maskedImageFile to maskImageFile
}
```

The first file is the image result. The second file marks matching pixels with the mask color and non-matching pixels as white, which is useful for print-service checks or external compositing.

## API Reference

| Method                                                                          | Description                                                                        |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `engine.block.exportWithColorMask(block=_, mimeType=_, maskColor=_, options=_)` | Exports a block with exact opaque color masking, returning image and mask buffers. |
| `Color.fromRGBA(r=_, g=_, b=_)`                                                 | Creates the fully opaque `RGBAColor` passed as the mask color.                     |
| `Color.fromCMYK(c=_, m=_, y=_, k=_, tint=_)`                                    | Creates CMYK source fill colors when the design uses process colors.               |
| `ExportOptions(pngCompressionLevel=_, targetWidth=_, targetHeight=_)`           | Configures PNG compression and output dimensions for the export.                   |
| `engine.block.export(block=_, mimeType=_, options=_)`                           | Exports a block without color masking.                                             |

## Next Steps

- [Export Options](./overview.md) - Explore every supported export format
  and the options each one accepts.
- [Export to PDF](./to-pdf.md) - Produce print-ready PDFs with optional
  underlayers for spot-color workflows.
- [Partial Export](./partial-export.md) - Learn how to export specific blocks,
  groups, and page elements instead of entire scenes using CE.SDK's programmatic
  export API.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support