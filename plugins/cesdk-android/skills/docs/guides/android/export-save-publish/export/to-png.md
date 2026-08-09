> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To PNG](./to-png.md) > [Conversion](../../conversion.md) > [To PNG](./to-png.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-export-to-png/ToPng.kt reference-only
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

data class ToPngResult(
    val pngData: ByteBuffer,
    val compressedPngData: ByteBuffer,
    val sizedPngData: ByteBuffer,
    val savedPngFile: File,
)

suspend fun toPng(
    engine: Engine,
    outputFile: File,
): ToPngResult {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.appendChild(parent = scene, child = page)

    val accent = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(accent, "PNG export sample")
    engine.block.setShape(accent, shape = engine.block.createShape(ShapeType.Ellipse))
    engine.block.setWidth(accent, value = 520F)
    engine.block.setHeight(accent, value = 520F)
    engine.block.setPositionX(accent, value = 380F)
    engine.block.setPositionY(accent, value = 70F)
    engine.block.setFill(accent, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = accent,
        color = Color.fromRGBA(r = 0.14F, g = 0.34F, b = 0.84F, a = 0.86F),
    )
    engine.block.appendChild(parent = page, child = accent)

    val overlay = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(overlay, "PNG export overlay")
    engine.block.setShape(overlay, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(overlay, value = 360F)
    engine.block.setHeight(overlay, value = 260F)
    engine.block.setPositionX(overlay, value = 500F)
    engine.block.setPositionY(overlay, value = 230F)
    engine.block.setFill(overlay, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = overlay,
        color = Color.fromRGBA(r = 0.96F, g = 0.36F, b = 0.18F, a = 0.78F),
    )
    engine.block.appendChild(parent = page, child = overlay)

    val highlight = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(highlight, "PNG export highlight")
    engine.block.setShape(highlight, shape = engine.block.createShape(ShapeType.Ellipse))
    engine.block.setWidth(highlight, value = 180F)
    engine.block.setHeight(highlight, value = 180F)
    engine.block.setPositionX(highlight, value = 418F)
    engine.block.setPositionY(highlight, value = 182F)
    engine.block.setFill(highlight, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = highlight,
        color = Color.fromRGBA(r = 1F, g = 1F, b = 1F, a = 0.9F),
    )
    engine.block.appendChild(parent = page, child = highlight)

    val pngData = exportToPngImage(
        engine = engine,
        page = page,
        onPreExport = { waitForExportEngineStartup() },
    )
    val compressedPngData = exportPngWithCompression(
        engine = engine,
        page = page,
        onPreExport = { waitForExportEngineStartup() },
    )
    val sizedPngData = exportPngWithTargetDimensions(
        engine = engine,
        page = page,
        onPreExport = { waitForExportEngineStartup() },
    )
    val savedPngFile = savePngExportToFile(pngData, outputFile)

    return ToPngResult(
        pngData = pngData.asReadOnlyBuffer(),
        compressedPngData = compressedPngData.asReadOnlyBuffer(),
        sizedPngData = sizedPngData.asReadOnlyBuffer(),
        savedPngFile = savedPngFile,
    )
}

suspend fun exportToPngImage(
    engine: Engine,
    page: DesignBlock,
    onPreExport: (suspend Engine.() -> Unit)? = null,
): ByteBuffer {
    val pngData = if (onPreExport == null) {
        val pngData = engine.block.export(
            block = page,
            mimeType = MimeType.PNG,
        )
        pngData
    } else {
        engine.block.export(
            block = page,
            mimeType = MimeType.PNG,
            onPreExport = onPreExport,
        )
    }

    check(pngData.hasRemaining()) { "PNG export is empty" }
    return pngData
}

suspend fun exportPngWithCompression(
    engine: Engine,
    page: DesignBlock,
    onPreExport: (suspend Engine.() -> Unit)? = null,
): ByteBuffer {
    val pngData = if (onPreExport == null) {
        val options = ExportOptions(pngCompressionLevel = 9)
        val compressedPngData = engine.block.export(
            block = page,
            mimeType = MimeType.PNG,
            options = options,
        )
        compressedPngData
    } else {
        val options = ExportOptions(pngCompressionLevel = 9)
        engine.block.export(
            block = page,
            mimeType = MimeType.PNG,
            options = options,
            onPreExport = onPreExport,
        )
    }

    check(pngData.hasRemaining()) { "compressed PNG export is empty" }
    return pngData
}

suspend fun exportPngWithTargetDimensions(
    engine: Engine,
    page: DesignBlock,
    onPreExport: (suspend Engine.() -> Unit)? = null,
): ByteBuffer {
    val pngData = if (onPreExport == null) {
        val options = ExportOptions(
            targetWidth = 1920F,
            targetHeight = 1080F,
        )
        val sizedPngData = engine.block.export(
            block = page,
            mimeType = MimeType.PNG,
            options = options,
        )
        sizedPngData
    } else {
        val options = ExportOptions(
            targetWidth = 1920F,
            targetHeight = 1080F,
        )
        engine.block.export(
            block = page,
            mimeType = MimeType.PNG,
            options = options,
            onPreExport = onPreExport,
        )
    }

    check(pngData.hasRemaining()) { "target-size PNG export is empty" }
    return pngData
}

// Source-only smoke-test synchronization for Android export worker startup.
// The rendered snippets hide this hook; the runtime gate uses it so the export
// worker settings observer cannot race its background Engine.stop().
private suspend fun waitForExportEngineStartup() {
    yield()
}

suspend fun savePngExportToFile(
    pngData: ByteBuffer,
    outputFile: File,
): File = withContext(Dispatchers.IO) {
    outputFile.parentFile?.mkdirs()

    FileOutputStream(outputFile).channel.use { channel ->
        val readableData = pngData.asReadOnlyBuffer()
        while (readableData.hasRemaining()) {
            channel.write(readableData)
        }
    }

    check(outputFile.length() > 0L) { "saved PNG file is empty" }
    outputFile
}
```

Export CE.SDK designs as PNG images with lossless compression, alpha support,
and configurable output dimensions.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260809/engine-guides-export-to-png)

<EngineReferenceNote {...props} />

PNG (Portable Network Graphics) preserves transparency and uses lossless compression. It works well for graphics, UI elements, icons, logos, and other designs that need crisp edges or alpha channels.

This guide covers exporting a block to PNG, configuring compression, controlling output dimensions, and writing the exported bytes to app storage.

## Export to PNG

Use `engine.block.export(...)` with `MimeType.PNG` to export a page, scene, group, or any other design block. The method returns a `ByteBuffer` containing the encoded PNG data.

```kotlin highlight-android-export-png
val pngData = engine.block.export(
    block = page,
    mimeType = MimeType.PNG,
)
```

Pass the page block when you want to export the current page, or pass another block ID to export a specific element.

## Export Options

PNG export supports options for compression, dimensions, and text rendering. Pass an `ExportOptions` instance when you need behavior other than the defaults.

### Compression Level

Set `pngCompressionLevel` from `0` to `9` to control the file size versus encoding speed trade-off. Higher values usually produce smaller files but take longer to encode. PNG remains lossless, so compression level does not change image quality.

```kotlin highlight-android-compression-level
val options = ExportOptions(pngCompressionLevel = 9)
val compressedPngData = engine.block.export(
    block = page,
    mimeType = MimeType.PNG,
    options = options,
)
```

- `0` - No compression, fastest encoding
- `5` - Balanced default
- `9` - Maximum compression, slowest encoding

### Target Dimensions

Set `targetWidth` and `targetHeight` together to request a target size. CE.SDK preserves the block's aspect ratio, scales the block until it fills the requested target, and derives the PNG dimensions from that scaled block. If the target aspect ratio differs from the block aspect ratio, one exported dimension can be larger than the requested value.

```kotlin highlight-android-target-dimensions
val options = ExportOptions(
    targetWidth = 1920F,
    targetHeight = 1080F,
)
val sizedPngData = engine.block.export(
    block = page,
    mimeType = MimeType.PNG,
    options = options,
)
```

Leave both values unset when you want to export the block at its native size.

### All PNG Export Options

| Option                | Description                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pngCompressionLevel` | Compression level from `0` to `9`. Higher values produce smaller files but take longer. Defaults to `5`.       |
| `targetWidth`         | Target output width in pixels. Use it together with `targetHeight`.                                            |
| `targetHeight`        | Target output height in pixels. Use it together with `targetWidth`.                                            |
| `allowTextOverhang`   | When `true`, text blocks export with glyphs that extend beyond their frame still visible. Defaults to `false`. |

## Save to App Storage

After export, write the returned `ByteBuffer` to a file in your app-specific storage or pass it to your upload pipeline. The sample duplicates the buffer before writing so the original export data remains readable.

```kotlin highlight-android-save-file
suspend fun savePngExportToFile(
    pngData: ByteBuffer,
    outputFile: File,
): File = withContext(Dispatchers.IO) {
    outputFile.parentFile?.mkdirs()

    FileOutputStream(outputFile).channel.use { channel ->
        val readableData = pngData.asReadOnlyBuffer()
        while (readableData.hasRemaining()) {
            channel.write(readableData)
        }
    }

    check(outputFile.length() > 0L) { "saved PNG file is empty" }
    outputFile
}
```

Use an Android app-owned directory such as `context.cacheDir` or `context.filesDir` for local exports, then share or upload the file according to your app's storage policy.

## When to Use PNG

PNG is a good fit for:

- Graphics with sharp edges, text, and UI elements
- Designs that require transparent areas
- Logos, icons, and illustrations where lossless output matters

For photographs or images with smooth gradients, JPEG usually produces smaller files.

## Troubleshooting

| Issue                            | Fix                                                                                                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File size is too large           | Increase `pngCompressionLevel` toward `9`, or reduce dimensions with `targetWidth` and `targetHeight`.                                                                                               |
| Encoding feels slow              | Lower `pngCompressionLevel` toward `0`. The default `5` balances size and encoding speed.                                                                                                            |
| Output dimensions are unexpected | Check the block aspect ratio against `targetWidth` and `targetHeight`. CE.SDK preserves the block aspect ratio and can export one dimension larger than the requested target when the ratios differ. |
| Transparent areas appear filled  | Check the exported page or block background. PNG preserves alpha only when the source content is transparent.                                                                                        |

## API Reference

| API                                                                                        | Description                                                               |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `engine.block.export(block=_, mimeType=MimeType.PNG, options=_)`                           | Export a block as PNG and return the encoded data as a `ByteBuffer`.      |
| `ExportOptions(pngCompressionLevel=_, targetWidth=_, targetHeight=_, allowTextOverhang=_)` | Configure PNG compression, output dimensions, and text-overhang handling. |

## Next Steps

- [Export Overview](./overview.md) - Compare all supported export formats
- [Size Limits](./size-limits.md) - Understand and configure limits on exported
  file dimensions or data size.
- [With a Color Mask](./with-color-mask.md) - Learn how to export design blocks
  with color masking to remove specific colors and generate alpha masks for print
  workflows and compositing.
- [Partial Export](./partial-export.md) - Learn how to export specific blocks,
  groups, and page elements instead of entire scenes using CE.SDK's programmatic
  export API.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support