> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Conversion](../conversion.md) > [To PDF](./to-pdf.md)

---

```swift file=@cesdk_swift_examples/engine-guides-conversion-to-pdf/ConversionToPdf.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func conversionToPdf(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  let exportsDirectory = FileManager.default.temporaryDirectory

  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
  try await engine.scene.create(fromImage: imageURL)

  guard let page = try engine.scene.getCurrentPage() else { return }
  let singleImagePdf = try await engine.block.export(page, mimeType: .pdf)
  try singleImagePdf.write(to: exportsDirectory.appendingPathComponent("single-image.pdf"))

  let imageURLs = [
    baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
    baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
    baseURL.appendingPathComponent("ly.img.image/images/sample_3.jpg"),
  ]
  let stackedScene = try engine.scene.create(sceneLayout: .verticalStack)
  let stack = try engine.block.find(byType: .stack)[0]

  for url in imageURLs {
    let stackedPage = try engine.block.create(.page)
    try engine.block.appendChild(to: stack, child: stackedPage)

    let imageFill = try engine.block.createFill(.image)
    try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: url)
    try engine.block.setFill(stackedPage, fill: imageFill)
  }

  let multiPagePdf = try await engine.block.export(stackedScene, mimeType: .pdf)
  try multiPagePdf.write(to: exportsDirectory.appendingPathComponent("multi-page.pdf"))

  try engine.block.setFloat(stackedScene, property: "scene/dpi", value: 150)

  let compatOptions = ExportOptions(exportPdfWithHighCompatibility: true)
  let compatPdf = try await engine.block.export(stackedScene, mimeType: .pdf, options: compatOptions)
  try compatPdf.write(to: exportsDirectory.appendingPathComponent("high-compatibility.pdf"))

  engine.editor.setSpotColor(name: "BrandUnderlay", r: 0.8, g: 0.8, b: 0.8)

  let underlayerOptions = ExportOptions(
    exportPdfWithHighCompatibility: true,
    exportPdfWithUnderlayer: true,
    underlayerSpotColorName: "BrandUnderlay",
    underlayerOffset: -2.0,
  )
  let underlayerPdf = try await engine.block.export(stackedScene, mimeType: .pdf, options: underlayerOptions)
  try underlayerPdf.write(to: exportsDirectory.appendingPathComponent("with-underlayer.pdf"))

  try engine.block.setFloat(stackedScene, property: "scene/dpi", value: 300)
  let combinedOptions = ExportOptions(
    targetWidth: 2480,
    targetHeight: 3508,
    exportPdfWithHighCompatibility: true,
    exportPdfWithUnderlayer: true,
    underlayerSpotColorName: "BrandUnderlay",
    underlayerOffset: -2.0,
  )
  let combinedPdf = try await engine.block.export(stackedScene, mimeType: .pdf, options: combinedOptions)
  try combinedPdf.write(to: exportsDirectory.appendingPathComponent("configured.pdf"))
}
```

Convert images and multi-page designs to PDF programmatically. Load one or more image files, build a scene, and export the result as a print-ready PDF — all without presenting the editor UI.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0/engine-guides-conversion-to-pdf)

<EngineReferenceNote {...props} />

CE.SDK supports converting single or multiple images to PDF while allowing transformations such as cropping, rotating, and adding text before exporting. You can customize PDF output settings including resolution, compatibility, and underlayer for specialty printing.

This guide covers converting a single image to PDF, combining multiple images into one multi-page PDF, and configuring output options such as DPI, high-compatibility mode, and underlayers.

## Convert to PDF Programmatically

Use `engine.block.export(_:mimeType:options:)` with `MIMEType.pdf` to convert a scene or a single page to PDF. The method returns `Data` containing the PDF bytes, which you can write to disk with `Data.write(to:)`.

### Convert a Single Image to PDF

Load an image into a fresh scene with `engine.scene.create(fromImage:)` and export the current page.

```swift highlight-conversionToPdf-singleImage
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
  try await engine.scene.create(fromImage: imageURL)

  guard let page = try engine.scene.getCurrentPage() else { return }
  let singleImagePdf = try await engine.block.export(page, mimeType: .pdf)
  try singleImagePdf.write(to: exportsDirectory.appendingPathComponent("single-image.pdf"))
```

`engine.scene.create(fromImage:)` builds a scene with a single page whose fill is the loaded image. Passing that page ID to `engine.block.export(_:mimeType:)` produces a single-page PDF.

To edit the image before exporting — cropping, rotating, adding text, and so on — you can query and mutate the page's fill and any additional blocks with the standard `engine.block` APIs.

### Combine Multiple Images into a Single PDF

Create an empty scene with a vertical stack layout, add one page per image, and export the scene to produce a multi-page PDF.

```swift highlight-conversionToPdf-multiImage
  let imageURLs = [
    baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
    baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
    baseURL.appendingPathComponent("ly.img.image/images/sample_3.jpg"),
  ]
  let stackedScene = try engine.scene.create(sceneLayout: .verticalStack)
  let stack = try engine.block.find(byType: .stack)[0]

  for url in imageURLs {
    let stackedPage = try engine.block.create(.page)
    try engine.block.appendChild(to: stack, child: stackedPage)

    let imageFill = try engine.block.createFill(.image)
    try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: url)
    try engine.block.setFill(stackedPage, fill: imageFill)
  }

  let multiPagePdf = try await engine.block.export(stackedScene, mimeType: .pdf)
  try multiPagePdf.write(to: exportsDirectory.appendingPathComponent("multi-page.pdf"))
```

Exporting the scene (rather than an individual page) includes every page block that hangs off the stack. The pages share the same width; the stack manages their vertical arrangement.

## Configure PDF Output Settings

Several `ExportOptions` fields shape the PDF output. Set them individually or combine them in one export call.

### Adjust DPI for Print Quality

The scene's `scene/dpi` property controls the resolution at which bitmap images and rasterized effects are embedded in the PDF. It does not change the page size.

```swift highlight-conversionToPdf-dpi
try engine.block.setFloat(stackedScene, property: "scene/dpi", value: 150)
```

Higher DPI values produce sharper output at the cost of larger files. The default is 300 DPI, which suits most print workflows.

### Enable High Compatibility Mode

Set `exportPdfWithHighCompatibility` on `ExportOptions` to rasterize complex elements — bitmap images, gradients with transparency, and some effects — at the scene's DPI. This ensures consistent rendering across PDF viewers.

```swift highlight-conversionToPdf-highCompatibility
let compatOptions = ExportOptions(exportPdfWithHighCompatibility: true)
let compatPdf = try await engine.block.export(stackedScene, mimeType: .pdf, options: compatOptions)
try compatPdf.write(to: exportsDirectory.appendingPathComponent("high-compatibility.pdf"))
```

The flag defaults to `true`. Disable it when you need vectors preserved and can verify that your target viewers render your gradients and effects correctly. Rasterizing at high DPI produces larger files but the tradeoff is more predictable output.

### Add an Underlayer for Specialty Printing

Underlayers provide a base ink layer (typically white) for printing on transparent or non-white substrates like fabric, glass, or acrylic. The underlayer sits behind the design elements and is generated automatically from their contours.

> **Caution:** Do not flatten the resulting PDF file or you will lose the underlayer shape, which sits behind your design.

First define a spot color that represents the underlayer ink. The name must match what your print provider expects; the RGB values only provide a preview.

```swift highlight-conversionToPdf-spotColor
engine.editor.setSpotColor(name: "BrandUnderlay", r: 0.8, g: 0.8, b: 0.8)
```

Then export with the underlayer options set. `underlayerOffset` adjusts the underlayer's size in design units — negative values shrink it inward to prevent visible edges from print misalignment.

```swift highlight-conversionToPdf-underlayer
let underlayerOptions = ExportOptions(
  exportPdfWithHighCompatibility: true,
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: "BrandUnderlay",
  underlayerOffset: -2.0,
)
let underlayerPdf = try await engine.block.export(stackedScene, mimeType: .pdf, options: underlayerOptions)
try underlayerPdf.write(to: exportsDirectory.appendingPathComponent("with-underlayer.pdf"))
```

### Combine All Options

You can mix any of the PDF options in a single `ExportOptions` value. The example below resets `scene/dpi` to 300, sets target dimensions to A4 at 300 DPI (2480 × 3508 px), enables high compatibility, and generates an underlayer.

```swift highlight-conversionToPdf-combined
try engine.block.setFloat(stackedScene, property: "scene/dpi", value: 300)
let combinedOptions = ExportOptions(
  targetWidth: 2480,
  targetHeight: 3508,
  exportPdfWithHighCompatibility: true,
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: "BrandUnderlay",
  underlayerOffset: -2.0,
)
let combinedPdf = try await engine.block.export(stackedScene, mimeType: .pdf, options: combinedOptions)
try combinedPdf.write(to: exportsDirectory.appendingPathComponent("configured.pdf"))
```

`targetWidth` and `targetHeight` scale the block so it fills the requested size while preserving its aspect ratio, and both values are set together. Because the target-size scaling factors in the scene's DPI, resetting `scene/dpi` to 300 before this export keeps the output at the requested A4 dimensions.

## Troubleshooting

| Symptom | Resolution |
| --- | --- |
| PDF file size is too large | Reduce the scene DPI or disable `exportPdfWithHighCompatibility` so bitmap images stay embedded at their original resolution and gradients remain vector-drawn where possible. Set `pdfImageQuality` below `1.0` to encode the images that CE.SDK still has to rasterize as lossy JPEG. |
| Gradients or effects render inconsistently across viewers | Enable `exportPdfWithHighCompatibility` so complex elements are rasterized at the scene DPI, producing consistent output across PDF viewers. |
| Underlayer is missing from the printed result | Confirm the spot color name in `underlayerSpotColorName` matches the print provider's configuration exactly, and ensure the PDF was not flattened in post-processing (flattening removes the underlayer shape). |

## PDF Export Options

The fields below are properties on `ExportOptions` you pass to `engine.block.export(_:mimeType:options:)`.

| Option | Description |
| --- | --- |
| `exportPdfWithHighCompatibility` | Rasterize complex elements at scene DPI for consistent rendering across viewers. Defaults to `true`. |
| `pdfImageQuality` | Encoding quality for images that CE.SDK has to rasterize. Values below the default of `1.0` encode them as lossy JPEG. |
| `exportPdfWithUnderlayer` | Generate an underlayer from design contours. Defaults to `false`. |
| `underlayerSpotColorName` | Spot color name for the underlayer ink. Required when `exportPdfWithUnderlayer` is `true`. |
| `underlayerOffset` | Size adjustment in design units. Negative values shrink the underlayer inward. |
| `targetWidth` | Target output width in pixels. Set together with `targetHeight`. |
| `targetHeight` | Target output height in pixels. Set together with `targetWidth`. |

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.create(fromImage:)` | Create a scene with a single page filled with the loaded image |
| `engine.scene.create(sceneLayout:)` | Create an empty scene with the requested layout (for example `.verticalStack`) |
| `engine.scene.getCurrentPage()` | Return the current page block ID |
| `engine.block.find(byType:)` | Find all blocks of a given `DesignBlockType` (`.graphic`, `.stack`, `.page`, …) |
| `engine.block.export(_:mimeType:options:)` | Export a block as PDF with the supplied options |
| `engine.block.setFloat(_:property:value:)` | Set a `Float` property such as `scene/dpi` |
| `engine.editor.setSpotColor(name:r:g:b:)` | Register an sRGB spot color used for the underlayer ink |
| `ExportOptions(...)` | Configure export options including PDF-specific fields |

## Next Steps

- [Export Overview](../export-save-publish/export/overview.md) — Compare all supported export formats
- [Export for Printing](../export-save-publish/for-printing.md) — Print workflows with DPI and color management
- [Spot Colors](../colors/for-print/spot.md) — Define and use spot colors in designs
- [Export Size Limits](../export-save-publish/export/size-limits.md) — Check device limits before exporting large designs
- [Convert to PNG](../export-save-publish/export/to-png.md) — Convert designs to PNG for web and screen
- [Conversion Overview](./overview.md) — Explore the full conversion workflow



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support