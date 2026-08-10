> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To PDF](./to-pdf.md)

---

```swift file=@cesdk_swift_examples/engine-guides-export-to-pdf/ExportToPdf.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func exportToPdf(engine: Engine) async throws {
  // Demo scaffolding: build a small scene with renderable content so every
  // highlighted snippet has something to export. In your app you would start
  // from a scene already loaded into the editor instead.
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let star = try engine.block.create(.graphic)
  try engine.block.setShape(star, shape: engine.block.createShape(.star))
  try engine.block.setPositionX(star, value: 350)
  try engine.block.setPositionY(star, value: 250)
  try engine.block.setWidth(star, value: 100)
  try engine.block.setHeight(star, value: 100)
  let starFill = try engine.block.createFill(.color)
  try engine.block.setColor(starFill, property: "fill/color/value", color: .rgba(r: 0, g: 0, b: 1, a: 1))
  try engine.block.setFill(star, fill: starFill)
  try engine.block.appendChild(to: page, child: star)

  let exportsDirectory = FileManager.default.temporaryDirectory

  let pdfBlob = try await engine.block.export(scene, mimeType: .pdf)
  try pdfBlob.write(to: exportsDirectory.appendingPathComponent("design.pdf"))

  let highCompatibilityOptions = ExportOptions(exportPdfWithHighCompatibility: true)
  let highCompatibilityBlob = try await engine.block.export(
    page,
    mimeType: .pdf,
    options: highCompatibilityOptions,
  )
  try highCompatibilityBlob.write(to: exportsDirectory.appendingPathComponent("design-high-compatibility.pdf"))

  engine.editor.setSpotColor(name: "RDG_WHITE", r: 0.8, g: 0.8, b: 0.8)

  let underlayerOptions = ExportOptions(
    exportPdfWithHighCompatibility: true,
    exportPdfWithUnderlayer: true,
    underlayerSpotColorName: "RDG_WHITE",
    underlayerOffset: -2.0,
  )
  let underlayerBlob = try await engine.block.export(page, mimeType: .pdf, options: underlayerOptions)
  try underlayerBlob.write(to: exportsDirectory.appendingPathComponent("design-with-underlayer.pdf"))

  let a4Options = ExportOptions(targetWidth: 2480, targetHeight: 3508)
  let a4Blob = try await engine.block.export(page, mimeType: .pdf, options: a4Options)
  try a4Blob.write(to: exportsDirectory.appendingPathComponent("design-a4.pdf"))
}
```

Export your designs as PDF documents with high compatibility mode and underlayer support for special media printing.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260810/engine-guides-export-to-pdf)

PDF provides a universal document format for sharing and printing designs. CE.SDK exports PDF files that preserve vector graphics, support multi-page documents, and include options for print compatibility. You can configure high compatibility mode to ensure consistent rendering across different PDF viewers, and generate underlayers for special media printing like fabric, glass, or DTF transfers.

This guide covers exporting designs to PDF, configuring high compatibility mode, generating underlayers with spot colors, and controlling output dimensions.

## Export to PDF

Call `engine.block.export(_:mimeType:options:)` with `MIMEType.pdf` to export a block as a PDF document. The method returns a `Blob` (the engine's `Data` typealias) containing the PDF data, which you can write to disk with `write(to:)`.

```swift highlight-exportToPdf-export
let pdfBlob = try await engine.block.export(scene, mimeType: .pdf)
try pdfBlob.write(to: exportsDirectory.appendingPathComponent("design.pdf"))
```

Pass the scene ID from `engine.scene.get()` to export every page as a multi-page PDF, or pass a single page ID from `engine.scene.getCurrentPage()` to export just that page.

## Configure High Compatibility Mode

Set `exportPdfWithHighCompatibility` on `ExportOptions` to rasterize complex elements like gradients with transparency at the scene's DPI. This ensures consistent rendering across PDF viewers.

```swift highlight-exportToPdf-highCompatibility
let highCompatibilityOptions = ExportOptions(exportPdfWithHighCompatibility: true)
let highCompatibilityBlob = try await engine.block.export(
  page,
  mimeType: .pdf,
  options: highCompatibilityOptions,
)
try highCompatibilityBlob.write(to: exportsDirectory.appendingPathComponent("design-high-compatibility.pdf"))
```

Use high compatibility mode when:

- Designs contain gradients with transparency
- Effects or blend modes render inconsistently across viewers
- Maximum compatibility matters more than vector precision

High compatibility mode increases file size because complex elements are converted to raster images rather than remaining as vectors. The flag defaults to `true`, so you only need to set it explicitly when you want to disable it.

## Generate Underlayers for Special Media

Underlayers provide a base ink layer (typically white) for printing on transparent or non-white substrates like fabric, glass, or acrylic. The underlayer sits behind your design elements and provides opacity on transparent materials.

> **Note:** **Warning** Do not flatten the resulting PDF file or you will lose the
> underlayer shape, which sits behind your design.

### Define the Underlayer Spot Color

Before exporting, define a spot color that represents the underlayer ink. Call `engine.editor.setSpotColor(name:r:g:b:)` to register the color. The RGB values provide a preview representation in PDF viewers; the name must match what your print provider expects.

```swift highlight-exportToPdf-spotColor
engine.editor.setSpotColor(name: "RDG_WHITE", r: 0.8, g: 0.8, b: 0.8)
```

Common names include `RDG_WHITE` for Roland DG printers and `White` for other systems.

### Export with Underlayer Options

Configure the underlayer spot color name and optional offset. The `underlayerOffset` adjusts the underlayer size in design units — negative values shrink it inward to prevent visible edges from print misalignment (trapping).

```swift highlight-exportToPdf-underlayer
let underlayerOptions = ExportOptions(
  exportPdfWithHighCompatibility: true,
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: "RDG_WHITE",
  underlayerOffset: -2.0,
)
let underlayerBlob = try await engine.block.export(page, mimeType: .pdf, options: underlayerOptions)
try underlayerBlob.write(to: exportsDirectory.appendingPathComponent("design-with-underlayer.pdf"))
```

The underlayer is generated automatically from the contours of all design elements on the page. Elements with transparency will have proportionally reduced underlayer opacity.

## Export at Target Dimensions

Use `targetWidth` and `targetHeight` on `ExportOptions` to control the exported PDF dimensions in pixels. The block renders large enough to fill the target size while maintaining aspect ratio.

```swift highlight-exportToPdf-targetSize
let a4Options = ExportOptions(targetWidth: 2480, targetHeight: 3508)
let a4Blob = try await engine.block.export(page, mimeType: .pdf, options: a4Options)
try a4Blob.write(to: exportsDirectory.appendingPathComponent("design-a4.pdf"))
```

For print output, calculate the target dimensions from your desired DPI:

- A4 at 300 DPI: 2480 × 3508 pixels
- Letter at 300 DPI: 2550 × 3300 pixels

## PDF Export Options

`mimeType` is the second argument to `engine.block.export(_:mimeType:options:)`. The remaining fields below are properties on `ExportOptions`.

| Option | Description |
| ------ | ----------- |
| `mimeType` | Output format. Pass `MIMEType.pdf`. |
| `exportPdfWithHighCompatibility` | Rasterize complex elements at scene DPI for consistent rendering. Defaults to `true`. |
| `exportPdfWithUnderlayer` | Generate an underlayer from design contours. Defaults to `false`. |
| `underlayerSpotColorName` | Spot color name for the underlayer ink. Required when `exportPdfWithUnderlayer` is `true`. |
| `underlayerOffset` | Size adjustment in design units. Negative values shrink the underlayer inward. |
| `targetWidth` | Target output width in pixels. Must be used with `targetHeight`. |
| `targetHeight` | Target output height in pixels. Must be used with `targetWidth`. |

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(_:mimeType:options:)` | Export a block as PDF with format and compatibility options |
| `engine.editor.setSpotColor(name:r:g:b:)` | Define a spot color for underlayer ink |
| `engine.scene.get()` | Get the scene for multi-page PDF export |
| `engine.scene.getCurrentPage()` | Get the current page for single-page export |

## Next Steps

- [Export Overview](./overview.md) — Compare all supported export formats
- [Export for Printing](../for-printing.md) — Print workflows with DPI and color management
- [Spot Colors](../../colors/for-print/spot.md) — Define and use spot colors in designs
- [Export Size Limits](./size-limits.md) — Check device limits before exporting large designs



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support