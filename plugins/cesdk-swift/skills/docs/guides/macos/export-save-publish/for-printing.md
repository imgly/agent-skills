> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Export Media Assets](./export.md) > [For Printing](./for-printing.md)

---

Export print-ready PDFs from CE.SDK with options for high compatibility mode,
underlayers for special media like fabric or glass, and configurable output
resolution.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-rc.0/engine-guides-export-for-printing)

CE.SDK exports designs as PDFs, but professional print workflows require specific configurations beyond standard export. This guide covers PDF export options for print, including high compatibility mode for complex designs, underlayers for printing on special media, and output resolution settings.

```swift file=@cesdk_swift_examples/engine-guides-export-for-printing/ExportForPrinting.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func exportForPrinting(engine: Engine) async throws {
  // Demo scaffolding: build a small scene with one renderable graphic so the
  // PDF exports below produce a non-empty page. In your app you would start
  // from a scene that the editor has already loaded.
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let star = try engine.block.create(.graphic)
  try engine.block.setShape(star, shape: engine.block.createShape(.star))
  try engine.block.setPositionX(star, value: 250)
  try engine.block.setPositionY(star, value: 150)
  try engine.block.setWidth(star, value: 300)
  try engine.block.setHeight(star, value: 300)
  let starFill = try engine.block.createFill(.color)
  try engine.block.setColor(starFill, property: "fill/color/value", color: .rgba(r: 0, g: 0, b: 1, a: 1))
  try engine.block.setFill(star, fill: starFill)

  let exportsDirectory = FileManager.default.temporaryDirectory

  // 300 DPI is standard for high-quality print output.
  try engine.block.setFloat(scene, property: "scene/dpi", value: 300)

  // High compatibility mode rasterizes complex elements like gradients with
  // transparency at the scene's DPI so they render consistently across PDF
  // viewers and print RIPs.
  let highCompatibilityOptions = ExportOptions(exportPdfWithHighCompatibility: true)
  let highCompatibilityPdf = try await engine.block.export(
    page,
    mimeType: .pdf,
    options: highCompatibilityOptions,
  )
  try highCompatibilityPdf.write(to: exportsDirectory.appendingPathComponent("design.high-compat.pdf"))

  // Disabling high compatibility keeps complex elements as vectors. The export
  // is faster and the PDF is smaller, but rendering may differ across viewers.
  let standardOptions = ExportOptions(exportPdfWithHighCompatibility: false)
  let standardPdf = try await engine.block.export(page, mimeType: .pdf, options: standardOptions)
  try standardPdf.write(to: exportsDirectory.appendingPathComponent("design.standard.pdf"))

  // Define the spot color that represents the underlayer ink before exporting.
  // The RGB values are a preview; the underlayer is rendered as a separation
  // referencing the spot color name in print software.
  engine.editor.setSpotColor(name: "RDG_WHITE", r: 0.8, g: 0.8, b: 0.8)

  // Generate an underlayer from the design contours filled with the spot color.
  // A negative `underlayerOffset` shrinks the underlayer inward so misaligned
  // print layers do not show visible white edges around design elements.
  let underlayerOptions = ExportOptions(
    exportPdfWithHighCompatibility: true,
    exportPdfWithUnderlayer: true,
    underlayerSpotColorName: "RDG_WHITE",
    underlayerOffset: -2.0,
  )
  let underlayerPdf = try await engine.block.export(page, mimeType: .pdf, options: underlayerOptions)
  try underlayerPdf.write(to: exportsDirectory.appendingPathComponent("design.underlayer.pdf"))

  // `targetWidth` / `targetHeight` are pixel dimensions. Combined with the
  // scene DPI set above, they determine the physical print size — 2480×3508
  // pixels at 300 DPI is A4 (210×297 mm).
  let sizedOptions = ExportOptions(
    targetWidth: 2480,
    targetHeight: 3508,
    exportPdfWithHighCompatibility: true,
  )
  let sizedPdf = try await engine.block.export(page, mimeType: .pdf, options: sizedOptions)
  try sizedPdf.write(to: exportsDirectory.appendingPathComponent("design.a4.pdf"))
}
```

## Default PDF Color Behavior

CE.SDK exports PDFs in RGB color space. CMYK or spot colors defined in your design convert to RGB during standard export. For CMYK output with embedded ICC profiles, use the **Print Ready PDF plugin** described below — the plugin is a JavaScript package, so CMYK post-processing runs in a Node.js or browser pipeline that consumes the PDF emitted from your Swift app.

The base `engine.block.export(_:mimeType:options:)` call provides the print compatibility options covered here, while full CMYK conversion is handled by the plugin.

## Setting Up for Print Export

Configure the scene DPI before exporting. The DPI controls how complex elements are rasterized when high compatibility mode is enabled, and 300 DPI is the standard for high-quality print output.

```swift highlight-exportForPrinting-dpi
// 300 DPI is standard for high-quality print output.
try engine.block.setFloat(scene, property: "scene/dpi", value: 300)
```

Set the DPI on the scene block — not on the page — using the `scene/dpi` property. Every export from that scene then uses this resolution as the rasterization target.

## PDF Export Options for Print

Export a page as PDF with `engine.block.export(_:mimeType:options:)`, passing `MIMEType.pdf` and an `ExportOptions` value. The PDF-specific fields on `ExportOptions` control how complex artwork is rendered.

### High Compatibility Mode

`exportPdfWithHighCompatibility` defaults to `true` and rasterizes complex elements like gradients with transparency at the scene's DPI. Enable high compatibility when:

- Designs use gradients with transparency
- Effects or blend modes render inconsistently across PDF viewers
- Maximum compatibility across print RIPs matters more than vector precision

```swift highlight-exportForPrinting-highCompatibility
// High compatibility mode rasterizes complex elements like gradients with
// transparency at the scene's DPI so they render consistently across PDF
// viewers and print RIPs.
let highCompatibilityOptions = ExportOptions(exportPdfWithHighCompatibility: true)
let highCompatibilityPdf = try await engine.block.export(
  page,
  mimeType: .pdf,
  options: highCompatibilityOptions,
)
try highCompatibilityPdf.write(to: exportsDirectory.appendingPathComponent("design.high-compat.pdf"))
```

The returned `Data` is a PDF blob you can write to disk, upload to a print service, or hand to a share sheet for the user to save.

### Standard PDF Export

Disabling high compatibility keeps complex elements as vectors. The export is faster and the resulting PDF is smaller, but rendering may differ across viewers — useful when you target modern PDF viewers and prefer file size and speed over universal compatibility.

```swift highlight-exportForPrinting-standard
// Disabling high compatibility keeps complex elements as vectors. The export
// is faster and the PDF is smaller, but rendering may differ across viewers.
let standardOptions = ExportOptions(exportPdfWithHighCompatibility: false)
let standardPdf = try await engine.block.export(page, mimeType: .pdf, options: standardOptions)
try standardPdf.write(to: exportsDirectory.appendingPathComponent("design.standard.pdf"))
```

In this mode CE.SDK embeds unmodified JPEG images with their original data instead of rasterizing them, which strongly reduces export time and file size for photo-heavy documents such as photo books.

Print jobs usually keep the default `pdfImageQuality` of `1.0`, which encodes the images that still have to be rasterized losslessly. Lower the value only when a smaller file matters more than print fidelity.

## Underlayers for Special Media

Underlayers provide a base ink layer (typically white) for printing on:

- Transparent or non-white substrates
- DTF (Direct-to-Film) transfers
- Fabric, glass, or dark materials

The underlayer is generated from the design's contours and filled with a named spot color. Print software then renders the underlayer as a separate ink separation that the press lays down before the design colors.

### Define the Underlayer Spot Color

Before exporting with an underlayer, define the spot color that represents the underlayer ink. Use `engine.editor.setSpotColor(name:r:g:b:)` to create a named spot color with RGB preview values — the RGB triplet is only a screen approximation; the value the print process uses is the spot color name.

```swift highlight-exportForPrinting-defineSpotColor
// Define the spot color that represents the underlayer ink before exporting.
// The RGB values are a preview; the underlayer is rendered as a separation
// referencing the spot color name in print software.
engine.editor.setSpotColor(name: "RDG_WHITE", r: 0.8, g: 0.8, b: 0.8)
```

### Export with Underlayer

Set `exportPdfWithUnderlayer: true` and pass the spot color name as `underlayerSpotColorName`. The underlayer is generated from the design's contours and rendered as a fill of the named spot color.

```swift highlight-exportForPrinting-exportWithUnderlayer
// Generate an underlayer from the design contours filled with the spot color.
// A negative `underlayerOffset` shrinks the underlayer inward so misaligned
// print layers do not show visible white edges around design elements.
let underlayerOptions = ExportOptions(
  exportPdfWithHighCompatibility: true,
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: "RDG_WHITE",
  underlayerOffset: -2.0,
)
let underlayerPdf = try await engine.block.export(page, mimeType: .pdf, options: underlayerOptions)
try underlayerPdf.write(to: exportsDirectory.appendingPathComponent("design.underlayer.pdf"))
```

### Underlayer Offset

`underlayerOffset` adjusts the underlayer size in design units. Negative values shrink the underlayer inward, which prevents visible white edges when the print layers do not align perfectly. Start with values around `-1.0` to `-3.0` and tune based on your print equipment's alignment tolerance.

## Export with Target Size

Control the exported PDF dimensions with `targetWidth` and `targetHeight`. These values are in pixels and combine with the scene's DPI to determine the physical print size — for example, 2480×3508 px at 300 DPI equals A4 (210×297 mm).

```swift highlight-exportForPrinting-targetSize
// `targetWidth` / `targetHeight` are pixel dimensions. Combined with the
// scene DPI set above, they determine the physical print size — 2480×3508
// pixels at 300 DPI is A4 (210×297 mm).
let sizedOptions = ExportOptions(
  targetWidth: 2480,
  targetHeight: 3508,
  exportPdfWithHighCompatibility: true,
)
let sizedPdf = try await engine.block.export(page, mimeType: .pdf, options: sizedOptions)
try sizedPdf.write(to: exportsDirectory.appendingPathComponent("design.a4.pdf"))
```

When only one of `targetWidth` or `targetHeight` is non-zero, the engine scales the other axis to preserve the block's aspect ratio. When both are non-zero and the aspect ratios differ, the output fills the target dimensions completely and may exceed one of them on the longer axis.

## CMYK PDFs with ICC Profiles

For CMYK color space and embedded ICC profiles, use the **Print Ready PDF plugin**. The plugin post-processes the PDF emitted by `engine.block.export(_:mimeType:options:)` and converts RGB to CMYK with embedded ICC profiles. The plugin is a JavaScript package, so wire it into a Node.js post-processing step or a browser-side pipeline that consumes the PDF produced by your Swift app.

See the Print Ready PDF Plugin for setup and usage.

## Troubleshooting

### PDF Not Opening Correctly in Print Software

Pass `exportPdfWithHighCompatibility: true` so complex elements are rasterized at the scene DPI. Some prepress tools are strict about gradients with transparency and rendering effects that the standard PDF path keeps as vectors.

### Underlayer Not Visible in PDF Viewer

Standard PDF viewers do not display spot color separations. Open the PDF in professional print software like Adobe Acrobat Pro or your prepress tool to verify that the underlayer separation is present.

### Colors Look Different After Printing

Standard export uses RGB. Run the exported PDF through the Print Ready PDF plugin with an appropriate ICC profile when accurate CMYK reproduction is required.

### White Edges on Special Media

Increase the negative `underlayerOffset` to shrink the underlayer further from design edges. Try values like `-2.0` or `-3.0` depending on your equipment's alignment tolerance.

## API Reference

| Method/Option | Purpose |
|---|---|
| `engine.block.export(_:mimeType:options:)` | Export a block as PDF (or other format). |
| `MIMEType.pdf` | PDF MIME type for the `mimeType` argument. |
| `ExportOptions(targetWidth:)` | Target width for the exported PDF in pixels. |
| `ExportOptions(targetHeight:)` | Target height for the exported PDF in pixels. |
| `ExportOptions(exportPdfWithHighCompatibility:)` | Rasterize bitmap images and gradients at scene DPI (default: `true`). |
| `ExportOptions(pdfImageQuality:)` | Encoding quality for rasterized images; values below `1.0` use lossy JPEG (default: `1.0`). |
| `ExportOptions(exportPdfWithUnderlayer:)` | Generate underlayer from contours (default: `false`). |
| `ExportOptions(underlayerSpotColorName:)` | Spot color name for underlayer ink. |
| `ExportOptions(underlayerOffset:)` | Size adjustment in design units (negative shrinks). |
| `engine.editor.setSpotColor(name:r:g:b:)` | Define a spot color from RGB values. |
| `engine.block.setFloat(_:property:value:)` with `"scene/dpi"` | Set scene DPI for print resolution. |

## Next Steps

- [CMYK Colors](../colors/for-print/cmyk.md) — Configure CMYK colors
- [Spot Colors](../colors/for-print/spot.md) — Define and use spot colors
- [Export to PDF](./export/to-pdf.md) — General PDF export options



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support