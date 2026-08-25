> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Export Media Assets](./export.md) > [For Printing](./for-printing.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-export-for-printing/ExportForPrinting.kt reference-only
import kotlinx.coroutines.delay
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.nio.ByteBuffer

suspend fun exportForPrinting(
    engine: Engine,
    synchronizeHeadlessSmokeExport: Boolean = false,
): Map<String, ByteBuffer> {
    // Demo scaffolding: build a small scene with one renderable graphic so the
    // PDF exports below produce a non-empty page. In your app you would start
    // from a scene that the editor has already loaded.
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 1131.6F)
    engine.block.appendChild(parent = scene, child = page)

    val star = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(star, shape = engine.block.createShape(ShapeType.Star))
    engine.block.setPositionX(star, value = 250F)
    engine.block.setPositionY(star, value = 415.8F)
    engine.block.setWidth(star, value = 300F)
    engine.block.setHeight(star, value = 300F)
    engine.block.setFill(star, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = star,
        color = Color.fromRGBA(r = 0F, g = 0F, b = 1F, a = 1F),
    )
    engine.block.appendChild(parent = page, child = star)

    // 300 DPI is standard for high-quality print output.
    engine.block.setFloat(scene, property = "scene/dpi", value = 300F)

    if (synchronizeHeadlessSmokeExport) synchronizeHeadlessExport()
    val highCompatibilityPdf = exportHighCompatibilityPdf(
        engine = engine,
        page = page,
    )
    if (synchronizeHeadlessSmokeExport) synchronizeHeadlessExport()

    if (synchronizeHeadlessSmokeExport) synchronizeHeadlessExport()
    val standardPdf = exportStandardPdf(
        engine = engine,
        page = page,
    )
    if (synchronizeHeadlessSmokeExport) synchronizeHeadlessExport()

    // Define the spot color that represents the underlayer ink before export.
    // The RGB values are a preview; print software uses the spot color name.
    val underlayerSpotColorName = "UnderlayerWhite"
    engine.editor.setSpotColor(
        name = underlayerSpotColorName,
        color = Color.fromRGBA(r = 0.8F, g = 0.8F, b = 0.8F, a = 1F),
    )
    // Keep the settings stream synchronized before the headless PDF exports.
    engine.editor.getSpotColorRGB(underlayerSpotColorName)

    if (synchronizeHeadlessSmokeExport) synchronizeHeadlessExport()
    val underlayerPdf = exportUnderlayerPdf(
        engine = engine,
        page = page,
        underlayerSpotColorName = underlayerSpotColorName,
    )
    if (synchronizeHeadlessSmokeExport) synchronizeHeadlessExport()

    if (synchronizeHeadlessSmokeExport) synchronizeHeadlessExport()
    val sizedPdf = exportTargetSizePdf(
        engine = engine,
        page = page,
    )
    if (synchronizeHeadlessSmokeExport) synchronizeHeadlessExport()

    return mapOf(
        "highCompatibility" to highCompatibilityPdf,
        "standard" to standardPdf,
        "underlayer" to underlayerPdf,
        "targetSize" to sizedPdf,
    )
}

private suspend fun exportHighCompatibilityPdf(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    // High compatibility mode rasterizes complex elements like gradients with
    // transparency at the scene's DPI so they render consistently across PDF
    // viewers and print RIPs.
    val highCompatibilityOptions = ExportOptions(exportPdfWithHighCompatibility = true)
    val highCompatibilityPdf = engine.block.export(
        block = page,
        mimeType = MimeType.PDF,
        options = highCompatibilityOptions,
    ).also { highCompatibilityPdf ->
        check(highCompatibilityPdf.hasRemaining()) { "High compatibility PDF export is empty" }
    }

    check(highCompatibilityPdf.hasRemaining()) { "High compatibility PDF export is empty" }
    return highCompatibilityPdf
}

private suspend fun exportStandardPdf(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    // Disabling high compatibility keeps complex elements as vectors. The export
    // is faster and the PDF is smaller, but rendering may differ across viewers.
    val standardOptions = ExportOptions(exportPdfWithHighCompatibility = false)
    val standardPdf = engine.block.export(
        block = page,
        mimeType = MimeType.PDF,
        options = standardOptions,
    ).also { standardPdf ->
        check(standardPdf.hasRemaining()) { "Standard PDF export is empty" }
    }

    check(standardPdf.hasRemaining()) { "Standard PDF export is empty" }
    return standardPdf
}

private suspend fun exportUnderlayerPdf(
    engine: Engine,
    page: DesignBlock,
    underlayerSpotColorName: String,
): ByteBuffer {
    // Generate an underlayer from the design contours filled with the spot color.
    // A negative `underlayerOffset` shrinks the underlayer inward so misaligned
    // print layers do not show visible white edges around design elements.
    val underlayerOptions = ExportOptions(
        exportPdfWithHighCompatibility = true,
        exportPdfWithUnderlayer = true,
        underlayerSpotColorName = underlayerSpotColorName,
        underlayerOffset = -2F,
    )
    val underlayerPdf = engine.block.export(
        block = page,
        mimeType = MimeType.PDF,
        options = underlayerOptions,
    ).also { underlayerPdf ->
        check(underlayerPdf.hasRemaining()) { "Underlayer PDF export is empty" }
    }

    check(underlayerPdf.hasRemaining()) { "Underlayer PDF export is empty" }
    return underlayerPdf
}

private suspend fun exportTargetSizePdf(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    // `targetWidth` / `targetHeight` are pixel dimensions. Combined with the
    // scene DPI set above, they determine the physical print size: 2480 x 3508
    // pixels at 300 DPI is A4 (210 x 297 mm).
    val sizedOptions = ExportOptions(
        targetWidth = 2480F,
        targetHeight = 3508F,
        exportPdfWithHighCompatibility = true,
    )
    val sizedPdf = engine.block.export(
        block = page,
        mimeType = MimeType.PDF,
        options = sizedOptions,
    ).also { sizedPdf ->
        check(sizedPdf.hasRemaining()) { "Target-size PDF export is empty" }
    }

    check(sizedPdf.hasRemaining()) { "Target-size PDF export is empty" }
    return sizedPdf
}

private suspend fun synchronizeHeadlessExport() {
    // The isolated offscreen smoke test tears down the engine immediately after
    // export, so give asynchronous export/settings callbacks time to drain.
    delay(100)
}
```

Export print-ready PDFs from CE.SDK with options for high compatibility mode,
underlayers for special media like fabric or glass, and configurable output
resolution.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260825/engine-guides-export-for-printing)

<EngineReferenceNote {...props} />

CE.SDK exports designs as PDFs, but professional print workflows require specific configurations beyond standard export. This guide covers PDF export options for print, including high compatibility mode for complex designs, underlayers for printing on special media, and output resolution settings.

## Default PDF Color Behavior

CE.SDK's Android PDF export writes process colors through the standard PDF export path. Android `ExportOptions` does not expose native DeviceCMYK export, so direct CMYK color values are emitted with DeviceRGB output unless you post-process the PDF.

Named spot colors are different: CE.SDK can keep the named color as a spot separation in the PDF and include a DeviceRGB alternate color for preview and fallback rendering. This is the same mechanism used by underlayers below, where the spot color name identifies the separation and the RGB value is only the alternate preview color.

For ICC-profiled CMYK, PDF/X, or full prepress conversion, use the **Print Ready PDF plugin** in a Node.js or browser pipeline that consumes the PDF emitted from your Android app. The base `engine.block.export()` call provides the print compatibility, spot-color underlayer, and target-size options covered here, while ICC-profiled CMYK conversion is handled by the plugin.

## Setting Up for Print Export

Configure the scene DPI before exporting. The DPI controls how complex elements are rasterized when high compatibility mode is enabled, and 300 DPI is the standard for high-quality print output.

```kotlin highlight-android-dpi
// 300 DPI is standard for high-quality print output.
engine.block.setFloat(scene, property = "scene/dpi", value = 300F)
```

Set the DPI on the scene block, not on the page. Every export from that scene then uses this resolution as the rasterization target.

## PDF Export Options for Print

Export a page as PDF with `engine.block.export()`, passing `MimeType.PDF` and an `ExportOptions` value. The PDF-specific fields on `ExportOptions` control how complex artwork is rendered.

### High Compatibility Mode

`exportPdfWithHighCompatibility` defaults to `true` and rasterizes complex elements like gradients with transparency at the scene's DPI. Enable high compatibility when:

- Designs use gradients with transparency
- Effects or blend modes render inconsistently across PDF viewers
- Maximum compatibility across print RIPs matters more than vector precision

```kotlin highlight-android-high-compatibility
// High compatibility mode rasterizes complex elements like gradients with
// transparency at the scene's DPI so they render consistently across PDF
// viewers and print RIPs.
val highCompatibilityOptions = ExportOptions(exportPdfWithHighCompatibility = true)
val highCompatibilityPdf = engine.block.export(
    block = page,
    mimeType = MimeType.PDF,
    options = highCompatibilityOptions,
).also { highCompatibilityPdf ->
    check(highCompatibilityPdf.hasRemaining()) { "High compatibility PDF export is empty" }
}
```

The returned `ByteBuffer` is a PDF blob you can write to disk, upload to a print service, or hand to Android's sharing or storage APIs.

### Standard PDF Export

Disabling high compatibility keeps complex elements as vectors. The export is faster and the resulting PDF is smaller, but rendering may differ across viewers. Use this path when you target modern PDF viewers and prefer file size and speed over universal compatibility.

```kotlin highlight-android-standard-pdf
// Disabling high compatibility keeps complex elements as vectors. The export
// is faster and the PDF is smaller, but rendering may differ across viewers.
val standardOptions = ExportOptions(exportPdfWithHighCompatibility = false)
val standardPdf = engine.block.export(
    block = page,
    mimeType = MimeType.PDF,
    options = standardOptions,
).also { standardPdf ->
    check(standardPdf.hasRemaining()) { "Standard PDF export is empty" }
}
```

In this mode CE.SDK embeds unmodified JPEG images with their original data instead of rasterizing them, which strongly reduces export time and file size for photo-heavy documents such as photo books.

Print jobs usually keep the default `pdfImageQuality` of `1.0`, which encodes the images that still have to be rasterized losslessly. Lower the value only when a smaller file matters more than print fidelity.

## Underlayers for Special Media

Underlayers provide a base ink layer, typically white, for printing on:

- Transparent or non-white substrates
- DTF (Direct-to-Film) transfers
- Fabric, glass, or dark materials

The underlayer is generated from the design's contours and filled with a named spot color. Print software then renders the underlayer as a separate ink separation that the press lays down before the design colors.

### Define the Underlayer Spot Color

Before exporting with an underlayer, define the spot color that represents the underlayer ink. Use `engine.editor.setSpotColor()` with `Color.fromRGBA()` to create a named spot color with RGB preview values. The RGB triplet is the DeviceRGB alternate preview; print software uses the spot color name for the separation.

```kotlin highlight-android-define-spot-color
// Define the spot color that represents the underlayer ink before export.
// The RGB values are a preview; print software uses the spot color name.
val underlayerSpotColorName = "UnderlayerWhite"
engine.editor.setSpotColor(
    name = underlayerSpotColorName,
    color = Color.fromRGBA(r = 0.8F, g = 0.8F, b = 0.8F, a = 1F),
)
```

### Export with Underlayer

Set `exportPdfWithUnderlayer = true` and pass the spot color name as `underlayerSpotColorName`. The underlayer is generated from the design's contours and rendered as a fill of that named spot separation.

```kotlin highlight-android-export-with-underlayer
// Generate an underlayer from the design contours filled with the spot color.
// A negative `underlayerOffset` shrinks the underlayer inward so misaligned
// print layers do not show visible white edges around design elements.
val underlayerOptions = ExportOptions(
    exportPdfWithHighCompatibility = true,
    exportPdfWithUnderlayer = true,
    underlayerSpotColorName = underlayerSpotColorName,
    underlayerOffset = -2F,
)
val underlayerPdf = engine.block.export(
    block = page,
    mimeType = MimeType.PDF,
    options = underlayerOptions,
).also { underlayerPdf ->
    check(underlayerPdf.hasRemaining()) { "Underlayer PDF export is empty" }
}
```

### Underlayer Offset

`underlayerOffset` adjusts the underlayer size in design units. Negative values shrink the underlayer inward, which prevents visible white edges when the print layers do not align perfectly. Start with values around `-1.0` to `-3.0` and tune based on your print equipment's alignment tolerance.

## Export with Target Size

Control the exported PDF dimensions with `targetWidth` and `targetHeight`. These values are in pixels and combine with the scene's DPI to determine the physical print size, for example 2480 x 3508 px at 300 DPI equals A4 (210 x 297 mm).

```kotlin highlight-android-target-size
// `targetWidth` / `targetHeight` are pixel dimensions. Combined with the
// scene DPI set above, they determine the physical print size: 2480 x 3508
// pixels at 300 DPI is A4 (210 x 297 mm).
val sizedOptions = ExportOptions(
    targetWidth = 2480F,
    targetHeight = 3508F,
    exportPdfWithHighCompatibility = true,
)
val sizedPdf = engine.block.export(
    block = page,
    mimeType = MimeType.PDF,
    options = sizedOptions,
).also { sizedPdf ->
    check(sizedPdf.hasRemaining()) { "Target-size PDF export is empty" }
}
```

When only one of `targetWidth` or `targetHeight` is non-null, the engine scales the other axis to preserve the block's aspect ratio. When both are non-null and the aspect ratios differ, the output fills the target dimensions completely and may exceed one of them on the longer axis.

## CMYK PDFs with ICC Profiles

For CMYK color space and embedded ICC profiles, use the **Print Ready PDF plugin**. The plugin post-processes the PDF emitted by `engine.block.export()` and converts RGB to CMYK with embedded ICC profiles. The plugin is a JavaScript package, so wire it into a Node.js post-processing step or a browser-side pipeline that consumes the PDF produced by your Android app.

See the Print Ready PDF Plugin for setup and usage.

## Troubleshooting

### PDF Not Opening Correctly in Print Software

Pass `exportPdfWithHighCompatibility = true` so complex elements are rasterized at the scene DPI. Some prepress tools are strict about gradients with transparency and rendering effects that the standard PDF path keeps as vectors.

### Underlayer Not Visible in PDF Viewer

Standard PDF viewers do not display spot color separations. Open the PDF in professional print software or your prepress tool to verify that the underlayer separation is present.

### Colors Look Different After Printing

Direct CMYK process colors use DeviceRGB output in Android's standard PDF export path. Run the exported PDF through the Print Ready PDF plugin with an appropriate ICC profile when accurate CMYK reproduction is required.

### White Edges on Special Media

Increase the negative `underlayerOffset` to shrink the underlayer further from design edges. Try values like `-2.0` or `-3.0` depending on your equipment's alignment tolerance.

## API Reference

| Method/Option | Purpose |
|---|---|
| `engine.block.export(block=_, mimeType=MimeType.PDF, options=_)` | Export a block as a PDF `ByteBuffer`; `MimeType.PDF` selects PDF output. |
| `ExportOptions(exportPdfWithHighCompatibility=_)` | Rasterize bitmap images and gradients at scene DPI; defaults to `true`. |
| `ExportOptions(pdfImageQuality=_)` | Encoding quality for rasterized images; values below `1.0` use lossy JPEG. Defaults to `1.0`. |
| `ExportOptions(exportPdfWithUnderlayer=_)` | Generate an underlayer from design contours; defaults to `false`. |
| `ExportOptions(underlayerSpotColorName=_)` | Spot color name for underlayer ink. |
| `ExportOptions(underlayerOffset=_)` | Size adjustment in design units; negative values shrink the underlayer. |
| `ExportOptions(targetWidth=_, targetHeight=_)` | Target dimensions for the exported PDF in pixels. |
| `engine.editor.setSpotColor(name=_, color=_)` | Define a named spot color with an alternate preview color. |
| `Color.fromRGBA(r=_, g=_, b=_, a=_)` | Create the DeviceRGB alternate preview value used for the underlayer spot color. |
| `engine.block.setFloat(block=_, property="scene/dpi", value=_)` | Set scene DPI for print resolution. |

## Next Steps

- [CMYK Colors](../colors/for-print/cmyk.md) - Configure CMYK colors
- [Spot Colors](../colors/for-print/spot.md) - Define and use spot colors
- [Export to PDF](./export/to-pdf.md) - General PDF export options



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support