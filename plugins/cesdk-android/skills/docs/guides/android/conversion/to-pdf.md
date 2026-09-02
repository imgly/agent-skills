> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Conversion](../conversion.md) > [To PDF](./to-pdf.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-conversion-to-pdf/ConversionToPdf.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.SceneLayout
import java.io.File
import java.nio.ByteBuffer

data class ConversionToPdfResult(
    val singleImagePdf: File,
    val multiPagePdf: File,
    val highCompatibilityPdf: File,
    val underlayerPdf: File,
    val configuredPdf: File,
    val pageCount: Int,
)

suspend fun conversionToPdf(
    engine: Engine,
    imageUris: List<Uri>,
    outputDirectory: File,
): ConversionToPdfResult = withContext(engine.dispatcher) {
    require(imageUris.isNotEmpty()) { "Provide at least one image URI." }

    engine.scene.createFromImage(imageUri = imageUris.first())

    val singleImagePage = checkNotNull(engine.scene.getCurrentPage())
    val singleImageData = engine.block.export(
        block = singleImagePage,
        mimeType = MimeType.PDF,
    )
    val singleImagePdf = saveConversionPdf(
        outputDirectory = outputDirectory,
        fileName = "single-image.pdf",
        buffer = singleImageData,
    )

    val stackedScene = engine.scene.create(sceneLayout = SceneLayout.VERTICAL_STACK)
    val stack = engine.block.findByType(DesignBlockType.Stack).first()

    imageUris.forEach { imageUri ->
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = stack, child = page)

        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setUri(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = imageUri,
        )
        engine.block.setFill(block = page, fill = imageFill)
    }

    val multiPageData = engine.block.export(
        block = stackedScene,
        mimeType = MimeType.PDF,
    )
    val multiPagePdf = saveConversionPdf(
        outputDirectory = outputDirectory,
        fileName = "multi-page.pdf",
        buffer = multiPageData,
    )

    engine.block.setFloat(block = stackedScene, property = "scene/dpi", value = 150F)

    val compatibilityOptions = ExportOptions(exportPdfWithHighCompatibility = true)
    val highCompatibilityData = engine.block.export(
        block = stackedScene,
        mimeType = MimeType.PDF,
        options = compatibilityOptions,
    )
    val highCompatibilityPdf = saveConversionPdf(
        outputDirectory = outputDirectory,
        fileName = "high-compatibility.pdf",
        buffer = highCompatibilityData,
    )

    engine.editor.setSpotColor(
        name = "BrandUnderlay",
        color = Color.fromRGBA(r = 0.8F, g = 0.8F, b = 0.8F, a = 1F),
    )

    val underlayerOptions = ExportOptions(
        exportPdfWithHighCompatibility = true,
        exportPdfWithUnderlayer = true,
        underlayerSpotColorName = "BrandUnderlay",
        underlayerOffset = -2F,
    )
    val underlayerData = engine.block.export(
        block = stackedScene,
        mimeType = MimeType.PDF,
        options = underlayerOptions,
    )
    val underlayerPdf = saveConversionPdf(
        outputDirectory = outputDirectory,
        fileName = "with-underlayer.pdf",
        buffer = underlayerData,
    )

    engine.block.setFloat(block = stackedScene, property = "scene/dpi", value = 300F)
    val combinedOptions = ExportOptions(
        targetWidth = 2480F,
        targetHeight = 3508F,
        exportPdfWithHighCompatibility = true,
        exportPdfWithUnderlayer = true,
        underlayerSpotColorName = "BrandUnderlay",
        underlayerOffset = -2F,
    )
    val configuredData = engine.block.export(
        block = stackedScene,
        mimeType = MimeType.PDF,
        options = combinedOptions,
    )
    val configuredPdf = saveConversionPdf(
        outputDirectory = outputDirectory,
        fileName = "configured.pdf",
        buffer = configuredData,
    )

    ConversionToPdfResult(
        singleImagePdf = singleImagePdf,
        multiPagePdf = multiPagePdf,
        highCompatibilityPdf = highCompatibilityPdf,
        underlayerPdf = underlayerPdf,
        configuredPdf = configuredPdf,
        pageCount = engine.scene.getPages().size,
    )
}

suspend fun saveConversionPdf(
    outputDirectory: File,
    fileName: String,
    buffer: ByteBuffer,
): File = withContext(Dispatchers.IO) {
    check(outputDirectory.isDirectory || outputDirectory.mkdirs()) {
        "Could not create the PDF output directory."
    }

    val source = buffer.asReadOnlyBuffer()
    File(outputDirectory, fileName).apply {
        outputStream().channel.use { channel ->
            while (source.hasRemaining()) {
                channel.write(source)
            }
        }
        check(length() > 0L) { "PDF export was empty." }
    }
}
```

Convert images and multi-page designs to PDF programmatically. Load one or
more image files, build a scene, and export the result without presenting the
editor UI.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/engine-guides-conversion-to-pdf)

<EngineReferenceNote {...props} />

CE.SDK converts single or multiple images to PDF while letting you crop,
rotate, or add content before export. You can also configure resolution,
compatibility, target dimensions, and an underlayer for specialty printing.

This guide covers single-image conversion, combining multiple images into one
multi-page PDF, and configuring the resulting document.

## Convert to PDF Programmatically

Use `engine.block.export()` with `MimeType.PDF` to export a scene or page. The
method returns a `ByteBuffer`; this sample writes a read-only view to an
app-managed output directory so the original buffer remains available to other
consumers.

```kotlin highlight-android-conversion-to-pdf-save
suspend fun saveConversionPdf(
    outputDirectory: File,
    fileName: String,
    buffer: ByteBuffer,
): File = withContext(Dispatchers.IO) {
    check(outputDirectory.isDirectory || outputDirectory.mkdirs()) {
        "Could not create the PDF output directory."
    }

    val source = buffer.asReadOnlyBuffer()
    File(outputDirectory, fileName).apply {
        outputStream().channel.use { channel ->
            while (source.hasRemaining()) {
                channel.write(source)
            }
        }
        check(length() > 0L) { "PDF export was empty." }
    }
}
```

### Convert a Single Image to PDF

Load the first input image into a fresh scene with
`engine.scene.createFromImage()`, then export the current page.

```kotlin highlight-android-conversion-to-pdf-single-image
    engine.scene.createFromImage(imageUri = imageUris.first())

    val singleImagePage = checkNotNull(engine.scene.getCurrentPage())
    val singleImageData = engine.block.export(
        block = singleImagePage,
        mimeType = MimeType.PDF,
    )
    val singleImagePdf = saveConversionPdf(
        outputDirectory = outputDirectory,
        fileName = "single-image.pdf",
        buffer = singleImageData,
    )
```

`engine.scene.createFromImage()` creates a scene with one page whose fill is
the loaded image. Exporting that page produces a single-page PDF. You can query
and mutate its fill or add blocks before export when the image needs edits.

### Combine Multiple Images into a Single PDF

Create a scene with a vertical stack layout, append one page per image, and
export the scene to produce a multi-page PDF.

```kotlin highlight-android-conversion-to-pdf-multi-image
    val stackedScene = engine.scene.create(sceneLayout = SceneLayout.VERTICAL_STACK)
    val stack = engine.block.findByType(DesignBlockType.Stack).first()

    imageUris.forEach { imageUri ->
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = stack, child = page)

        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setUri(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = imageUri,
        )
        engine.block.setFill(block = page, fill = imageFill)
    }

    val multiPageData = engine.block.export(
        block = stackedScene,
        mimeType = MimeType.PDF,
    )
    val multiPagePdf = saveConversionPdf(
        outputDirectory = outputDirectory,
        fileName = "multi-page.pdf",
        buffer = multiPageData,
    )
```

Exporting the scene includes every page owned by the stack. Export an
individual page instead when you need a separate PDF for each image.

## Configure PDF Output Settings

The PDF fields on `ExportOptions` control how CE.SDK renders and sizes the
document. Set them individually or combine them in one export call.

### Adjust DPI for Print Quality

The scene's `scene/dpi` property controls the resolution used for bitmap images
and rasterized effects. It does not change the page size.

```kotlin highlight-android-conversion-to-pdf-dpi
engine.block.setFloat(block = stackedScene, property = "scene/dpi", value = 150F)
```

Higher DPI values can produce sharper output at the cost of larger files. The
default is 300 DPI, which suits most print workflows.

### Enable High Compatibility Mode

Set `exportPdfWithHighCompatibility` to rasterize complex elements at the
scene's DPI for more consistent rendering across PDF viewers.

```kotlin highlight-android-conversion-to-pdf-high-compatibility
val compatibilityOptions = ExportOptions(exportPdfWithHighCompatibility = true)
val highCompatibilityData = engine.block.export(
    block = stackedScene,
    mimeType = MimeType.PDF,
    options = compatibilityOptions,
)
val highCompatibilityPdf = saveConversionPdf(
    outputDirectory = outputDirectory,
    fileName = "high-compatibility.pdf",
    buffer = highCompatibilityData,
)
```

The option defaults to `true`. Disable it when you need vectors preserved and
have verified that your target viewers render the document correctly.

### Add an Underlayer for Specialty Printing

Underlayers provide a base ink layer for printing on transparent or non-white
materials such as fabric, glass, or acrylic. CE.SDK generates the underlayer
from the design contours and places it behind the visible content.

> **Caution:** Do not flatten the resulting PDF file. Flattening removes the separate
> underlayer shape.

First, register the spot color that represents the underlayer ink. Its name
must match the name expected by your print provider; the RGB value provides a
preview.

```kotlin highlight-android-conversion-to-pdf-spot-color
engine.editor.setSpotColor(
    name = "BrandUnderlay",
    color = Color.fromRGBA(r = 0.8F, g = 0.8F, b = 0.8F, a = 1F),
)
```

Then enable the underlayer during export. A negative `underlayerOffset` shrinks
the shape inward to reduce visible edges from print misalignment.

```kotlin highlight-android-conversion-to-pdf-underlayer
val underlayerOptions = ExportOptions(
    exportPdfWithHighCompatibility = true,
    exportPdfWithUnderlayer = true,
    underlayerSpotColorName = "BrandUnderlay",
    underlayerOffset = -2F,
)
val underlayerData = engine.block.export(
    block = stackedScene,
    mimeType = MimeType.PDF,
    options = underlayerOptions,
)
val underlayerPdf = saveConversionPdf(
    outputDirectory = outputDirectory,
    fileName = "with-underlayer.pdf",
    buffer = underlayerData,
)
```

### Combine All Options

You can apply all PDF settings in one `ExportOptions` value. This example
resets the scene to 300 DPI, targets A4 dimensions at 300 DPI (2480 × 3508 px),
enables high compatibility, and generates an underlayer.

```kotlin highlight-android-conversion-to-pdf-combined
engine.block.setFloat(block = stackedScene, property = "scene/dpi", value = 300F)
val combinedOptions = ExportOptions(
    targetWidth = 2480F,
    targetHeight = 3508F,
    exportPdfWithHighCompatibility = true,
    exportPdfWithUnderlayer = true,
    underlayerSpotColorName = "BrandUnderlay",
    underlayerOffset = -2F,
)
val configuredData = engine.block.export(
    block = stackedScene,
    mimeType = MimeType.PDF,
    options = combinedOptions,
)
val configuredPdf = saveConversionPdf(
    outputDirectory = outputDirectory,
    fileName = "configured.pdf",
    buffer = configuredData,
)
```

Set `targetWidth` and `targetHeight` together. CE.SDK scales the scene to cover
the requested dimensions while preserving its aspect ratio.

## Troubleshooting

| Symptom | Resolution |
| --- | --- |
| PDF file size is too large | Reduce the scene DPI or disable `exportPdfWithHighCompatibility` when your target viewers support the original content. Set `pdfImageQuality` below `1.0` to encode the images that CE.SDK still has to rasterize as lossy JPEG. |
| Gradients or effects differ between viewers | Enable `exportPdfWithHighCompatibility` so CE.SDK rasterizes complex elements at the scene DPI. |
| Underlayer is missing from the printed result | Confirm that `underlayerSpotColorName` matches the print provider's configuration and that the PDF was not flattened. |

## PDF Export Options

Pass these fields to `ExportOptions` when calling `engine.block.export()`.

| Option | Description |
| --- | --- |
| `exportPdfWithHighCompatibility` | Rasterize complex elements at the scene DPI. Defaults to `true`. |
| `pdfImageQuality` | Encoding quality for images that CE.SDK has to rasterize. Values below the default of `1.0` encode them as lossy JPEG. |
| `exportPdfWithUnderlayer` | Generate an underlayer from the design contours. Defaults to `false`. |
| `underlayerSpotColorName` | Name of the spot color used for the underlayer ink. |
| `underlayerOffset` | Size adjustment in design units. Negative values shrink the underlayer inward. |
| `targetWidth` | Target output width in pixels. Set together with `targetHeight`. |
| `targetHeight` | Target output height in pixels. Set together with `targetWidth`. |

## API Reference

| API | Purpose |
| --- | --- |
| `engine.scene.createFromImage(imageUri=_)` | Create a scene with one page filled by an image. |
| `engine.scene.create(sceneLayout=SceneLayout.VERTICAL_STACK)` | Create an empty scene with vertically stacked pages. |
| `engine.scene.getCurrentPage()` | Return the current page. |
| `engine.scene.getPages()` | Return all pages in the current scene. |
| `engine.block.findByType(type=DesignBlockType.Stack)` | Find the stack that owns the scene's pages. |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create a page block. |
| `engine.block.appendChild(parent=_, child=_)` | Append a page to the stack. |
| `engine.block.createFill(fillType=FillType.Image)` | Create an image fill. |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Set the source URI of an image fill. |
| `engine.block.getUri(block=_, property="fill/image/imageFileURI")` | Read the source URI of an image fill. |
| `engine.block.setFill(block=_, fill=_)` | Apply the image fill to a page. |
| `engine.block.getFill(block=_)` | Return the fill applied to a page. |
| `engine.block.supportsFill(block=_)` | Check whether a block supports a fill. |
| `engine.block.export(block=_, mimeType=MimeType.PDF, options=_)` | Export a page or scene as a PDF `ByteBuffer`. |
| `engine.block.setFloat(block=_, property="scene/dpi", value=_)` | Set the scene DPI. |
| `engine.block.getFloat(block=_, property="scene/dpi")` | Return the scene DPI. |
| `engine.editor.setSpotColor(name=_, color=_)` | Register the spot color used by an underlayer. |
| `engine.editor.getSpotColorRGB(name=_)` | Return the preview color for a registered spot color. |
| `ExportOptions(targetWidth=_, targetHeight=_, exportPdfWithHighCompatibility=_, exportPdfWithUnderlayer=_, underlayerSpotColorName=_, underlayerOffset=_)` | Configure compatibility, underlayer, and target dimensions. |

## Next Steps

- [Export Overview](../export-save-publish/export/overview.md) — Compare all supported export formats.
- [Export for Printing](../export-save-publish/for-printing.md) — Learn about print workflows, DPI, and color management.
- [Spot Colors](../colors/for-print/spot.md) — Define and use spot colors in designs.
- [Export Size Limits](../export-save-publish/export/size-limits.md) — Check device limits before exporting large designs.
- [Convert to PNG](../export-save-publish/export/to-png.md) — Convert designs to PNG for web and screen.
- [Conversion Overview](./overview.md) — Explore the full conversion workflow.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support