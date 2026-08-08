> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To PDF](./to-pdf.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-underlayer/Underlayer.kt reference-only
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.io.File
import java.nio.ByteBuffer

suspend fun underlayer(engine: Engine): List<File> {
    // Demo scaffolding: create renderable content for the export snippets. In
    // an app, start from the scene already loaded in the editor.
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Star))
    engine.block.setPositionX(block, value = 350F)
    engine.block.setPositionY(block, value = 250F)
    engine.block.setWidth(block, value = 100F)
    engine.block.setHeight(block, value = 100F)

    val fill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block, fill = fill)
    engine.block.setFillSolidColor(block, color = Color.fromRGBA(r = 0F, g = 0F, b = 1F, a = 1F))
    engine.block.appendChild(parent = page, child = block)

    val pdfData = engine.block.export(
        block = scene,
        mimeType = MimeType.PDF,
    )
    val defaultPdf = writePdfExport(fileName = "design-pages.pdf", buffer = pdfData)

    val highCompatibilityOptions = ExportOptions(exportPdfWithHighCompatibility = true)
    val highCompatibilityData = engine.block.export(
        block = page,
        mimeType = MimeType.PDF,
        options = highCompatibilityOptions,
    )
    val highCompatibilityPdf = writePdfExport(
        fileName = "design-high-compatibility.pdf",
        buffer = highCompatibilityData,
    )

    engine.editor.setSpotColor(
        name = "UnderlayerWhite",
        Color.fromRGBA(r = 0.8F, g = 0.8F, b = 0.8F),
    )

    val underlayerOptions = ExportOptions(
        exportPdfWithHighCompatibility = true,
        exportPdfWithUnderlayer = true,
        underlayerSpotColorName = "UnderlayerWhite",
        underlayerOffset = -2.0F,
    )
    val underlayerData = engine.block.export(
        block = page,
        mimeType = MimeType.PDF,
        options = underlayerOptions,
    )
    val underlayerPdf = writePdfExport(fileName = "design-with-underlayer.pdf", buffer = underlayerData)

    val a4Options = ExportOptions(targetWidth = 2480F, targetHeight = 3508F)
    val a4Data = engine.block.export(
        block = page,
        mimeType = MimeType.PDF,
        options = a4Options,
    )
    val a4Pdf = writePdfExport(fileName = "design-a4.pdf", buffer = a4Data)

    return listOf(defaultPdf, highCompatibilityPdf, underlayerPdf, a4Pdf)
}

private suspend fun writePdfExport(
    fileName: String,
    buffer: ByteBuffer,
): File = withContext(Dispatchers.IO) {
    val prefix = fileName.substringBeforeLast(".pdf")
    val source = buffer.asReadOnlyBuffer()
    File.createTempFile(prefix, ".pdf").apply {
        outputStream().use { output ->
            while (source.hasRemaining()) {
                output.channel.write(source)
            }
        }
        check(length() > 0L) { "PDF export was empty." }
    }
}
```

Export your designs as PDF documents with high compatibility mode and
underlayer support for special media printing.

![Rendered PDF export preview](https://img.ly/docs/cesdk/android/export-save-publish/export/to-pdf-95e04b/assets/pdf-export-android-preview.png)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260808/engine-guides-underlayer)

<EngineReferenceNote {...props} />

PDF provides a document format for sharing and printing designs. CE.SDK exports PDF files that preserve vector graphics, support multi-page scenes, and include options for print compatibility. You can configure high compatibility mode for consistent rendering across PDF viewers, and generate underlayers for printing on transparent or non-white materials.

This guide covers exporting designs to PDF, configuring high compatibility mode, generating underlayers with spot colors, and controlling output dimensions.

## Export to PDF

Call `engine.block.export()` with `MimeType.PDF` to export a block as a PDF document. Pass the scene block from `engine.scene.get()` to include every page in a multi-page PDF, or pass one page from `engine.scene.getCurrentPage()` to export a single page.

```kotlin highlight-android-export-pdf
val pdfData = engine.block.export(
    block = scene,
    mimeType = MimeType.PDF,
)
val defaultPdf = writePdfExport(fileName = "design-pages.pdf", buffer = pdfData)
```

The Android API returns a `ByteBuffer` containing the PDF data. Write that buffer to app-specific storage, or hand the file to your app's share or upload flow.

```kotlin highlight-android-save-pdf
private suspend fun writePdfExport(
    fileName: String,
    buffer: ByteBuffer,
): File = withContext(Dispatchers.IO) {
    val prefix = fileName.substringBeforeLast(".pdf")
    val source = buffer.asReadOnlyBuffer()
    File.createTempFile(prefix, ".pdf").apply {
        outputStream().use { output ->
            while (source.hasRemaining()) {
                output.channel.write(source)
            }
        }
        check(length() > 0L) { "PDF export was empty." }
    }
}
```

## Configure High Compatibility Mode

Set `exportPdfWithHighCompatibility` on `ExportOptions` to rasterize complex elements like gradients with transparency at the scene's DPI. This produces more consistent output across PDF viewers, but it can increase file size because complex elements are converted to raster images.

```kotlin highlight-android-high-compatibility
val highCompatibilityOptions = ExportOptions(exportPdfWithHighCompatibility = true)
val highCompatibilityData = engine.block.export(
    block = page,
    mimeType = MimeType.PDF,
    options = highCompatibilityOptions,
)
val highCompatibilityPdf = writePdfExport(
    fileName = "design-high-compatibility.pdf",
    buffer = highCompatibilityData,
)
```

Use high compatibility mode when:

- Designs contain gradients with transparency
- Effects or blend modes render inconsistently across viewers
- Compatibility matters more than keeping every element vector-based

The flag defaults to `true`; set it explicitly when you want the export configuration to be visible in your code.

## Generate Underlayers for Special Media

Underlayers provide a base ink layer, typically white, for printing on transparent or non-white substrates like fabric, glass, or acrylic. The underlayer sits behind your design elements and gives the print opacity on the target material.

> **Note:** Do not flatten the resulting PDF file when you need the underlayer separation.
> Flattening removes the separate underlayer shape behind your design.

### Define the Underlayer Spot Color

Before exporting, define a spot color that represents the underlayer ink. The RGB values provide a preview representation in PDF viewers; the spot color name must match the name expected by your print workflow.

```kotlin highlight-android-spot-color
engine.editor.setSpotColor(
    name = "UnderlayerWhite",
    Color.fromRGBA(r = 0.8F, g = 0.8F, b = 0.8F),
)
```

### Export with Underlayer Options

Enable `exportPdfWithUnderlayer`, then pass the same spot color name in `underlayerSpotColorName`. Use `underlayerOffset` to adjust the underlayer size in design units. Negative values shrink the underlayer inward, which helps prevent visible edges from print misalignment.

```kotlin highlight-android-underlayer
val underlayerOptions = ExportOptions(
    exportPdfWithHighCompatibility = true,
    exportPdfWithUnderlayer = true,
    underlayerSpotColorName = "UnderlayerWhite",
    underlayerOffset = -2.0F,
)
val underlayerData = engine.block.export(
    block = page,
    mimeType = MimeType.PDF,
    options = underlayerOptions,
)
val underlayerPdf = writePdfExport(fileName = "design-with-underlayer.pdf", buffer = underlayerData)
```

The underlayer is generated from the contours of visible design elements on the exported page. Elements with transparency produce a proportionally lighter underlayer.

## Export at Target Dimensions

Use `targetWidth` and `targetHeight` on `ExportOptions` to control the exported PDF dimensions in pixels. The block renders large enough to fill the target size while maintaining its aspect ratio.

```kotlin highlight-android-target-size
val a4Options = ExportOptions(targetWidth = 2480F, targetHeight = 3508F)
val a4Data = engine.block.export(
    block = page,
    mimeType = MimeType.PDF,
    options = a4Options,
)
val a4Pdf = writePdfExport(fileName = "design-a4.pdf", buffer = a4Data)
```

For print output, calculate the target dimensions from your desired DPI:

- A4 at 300 DPI: 2480 x 3508 pixels
- Letter at 300 DPI: 2550 x 3300 pixels

## PDF Export Options

`mimeType` is the second argument to `engine.block.export()`. The remaining fields below are the PDF-related `ExportOptions` properties used by this guide and the underlayer controls available on Android.

| Option                           | Description                                                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mimeType`                       | Output format. Pass `MimeType.PDF`.                                                                                                                                |
| `exportPdfWithHighCompatibility` | Rasterize complex elements at scene DPI for consistent rendering. Defaults to `true`.                                                                              |
| `exportPdfWithUnderlayer`        | Generate an underlayer from design contours. Defaults to `false`.                                                                                                  |
| `underlayerSpotColorName`        | Spot color name for the underlayer ink. Required when `exportPdfWithUnderlayer` is `true`.                                                                         |
| `underlayerOffset`               | Size adjustment in design units. Negative values shrink the underlayer inward.                                                                                     |
| `underlayerRenderRatio`          | Resolution multiplier for the raster pass that extracts the underlayer contour. Higher values can preserve small details at higher memory cost. Defaults to `1.0`. |
| `underlayerMaxError`             | Maximum curve-fit error in pixels when vectorizing the underlayer contour. Smaller values fit tighter outlines with more path complexity. Defaults to `2.0`.       |
| `targetWidth`                    | Target output width in pixels. Must be used with `targetHeight`.                                                                                                   |
| `targetHeight`                   | Target output height in pixels. Must be used with `targetWidth`.                                                                                                   |

## API Reference

| Method                                                                         | Description                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `engine.block.export(block=_, mimeType=MimeType.PDF, options=_)`               | Export a block as PDF with format and compatibility options. |
| `engine.editor.setSpotColor(name=_, color=Color.fromRGBA(r=_, g=_, b=_, a=_))` | Define or update the RGB approximation of a spot color.      |
| `Color.fromRGBA(r=_, g=_, b=_, a=_)`                                           | Create the RGB preview color for the underlayer spot color.  |
| `engine.scene.get()`                                                           | Get the scene block for a multi-page PDF export.             |
| `engine.scene.getCurrentPage()`                                                | Get the current page for a single-page PDF export.           |

## Next Steps

- [Export Overview](./overview.md) — Compare all supported export formats
- [Export for Printing](../for-printing.md) — Export designs from CE.SDK as print-ready
  PDFs with professional output options including high compatibility mode, underlayers
  for special media, and scene DPI configuration.
- [Spot Colors](../../colors/for-print/spot.md) — Define and use spot colors in designs
- [Size Limits](./size-limits.md) — Understand and configure limits on exported
  file dimensions or data size.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support