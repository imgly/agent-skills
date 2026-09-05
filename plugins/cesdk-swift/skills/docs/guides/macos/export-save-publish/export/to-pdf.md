> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To PDF](./to-pdf.md)

---

```swift file=@cesdk_swift_examples/engine-guides-export-to-pdf/ExportToPdf.swift reference-only
import Foundation
import IMGLYEngine

/// Stand-in for a destination that is not a plain file, for example a multipart
/// upload. A real implementation sends the bytes on and drops them; collecting
/// them would put the whole document back in memory, which is what a streamed
/// export exists to avoid.
private func upload(_ chunk: Data) throws {
  print("Sending \(chunk.count) bytes")
}

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

  // Report per-page progress as the PDF is written. The closure runs once per
  // page; only PDF exports invoke it.
  let progressBlob = try await engine.block.export(
    scene,
    mimeType: .pdf,
    onProgress: { exportedPages, totalPages in
      print("Exported \(exportedPages) of \(totalPages) pages")
    },
  )
  try progressBlob.write(to: exportsDirectory.appendingPathComponent("design-with-progress.pdf"))

  // Write the document straight into a file as it is encoded. Nothing buffers
  // the finished PDF, so peak memory stays bounded by a single page rather than
  // growing with the page count.
  try await engine.block.export(
    scene,
    to: exportsDirectory.appendingPathComponent("design-streamed.pdf"),
    mimeType: .pdf,
    onProgress: { exportedPages, totalPages in
      print("Streamed \(exportedPages) of \(totalPages) pages")
    },
  )

  // Hand the chunks to a destination that is not a plain file. The closure runs
  // while the encoder does, so a slow destination throttles the encoder instead
  // of letting chunks queue up.
  try await engine.block.export(scene) { chunk in
    try upload(chunk)
  }

  // Choose how large a chunk may get. This is the memory held for one chunk, so
  // lower it for a memory-tight destination and raise it when the per-chunk work
  // is expensive, for example one request per chunk.
  try await engine.block.export(scene, options: ExportOptions(pdfChunkSize: 64 * 1024)) { chunk in
    try upload(chunk)
  }

  // Cancelling the task that runs the export stops the export itself. Keep the
  // task in your view model and cancel it from your Cancel button.
  let exportTask = Task {
    try await engine.block.export(scene, mimeType: .pdf)
  }
  exportTask.cancel()
  do {
    _ = try await exportTask.value
  } catch {
    // A cancelled export produces no data.
    print("Export cancelled: \(error)")
  }

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
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260905/engine-guides-export-to-pdf)

PDF provides a universal document format for sharing and printing designs. CE.SDK exports PDF files that preserve vector graphics, support multi-page documents, and include options for print compatibility. You can configure high compatibility mode to ensure consistent rendering across different PDF viewers, and generate underlayers for special media printing like fabric, glass, or DTF transfers.

This guide covers exporting designs to PDF, configuring high compatibility mode, controlling the quality of rasterized images, generating underlayers with spot colors, and controlling output dimensions.

## Export to PDF

Call `engine.block.export(_:mimeType:options:)` with `MIMEType.pdf` to export a block as a PDF document. The method returns a `Blob` (the engine's `Data` typealias) containing the PDF data, which you can write to disk with `write(to:)`.

```swift highlight-exportToPdf-export
let pdfBlob = try await engine.block.export(scene, mimeType: .pdf)
try pdfBlob.write(to: exportsDirectory.appendingPathComponent("design.pdf"))
```

Pass the scene ID from `engine.scene.get()` to export every page as a multi-page PDF, or pass a single page ID from `engine.scene.getCurrentPage()` to export just that page.

## Track Export Progress

Large multi-page PDFs take time to write. Pass an `onProgress` closure to `export(_:mimeType:options:onProgress:)` to report how far the export has advanced.

```swift highlight-exportToPdf-progress
// Report per-page progress as the PDF is written. The closure runs once per
// page; only PDF exports invoke it.
let progressBlob = try await engine.block.export(
  scene,
  mimeType: .pdf,
  onProgress: { exportedPages, totalPages in
    print("Exported \(exportedPages) of \(totalPages) pages")
  },
)
try progressBlob.write(to: exportsDirectory.appendingPathComponent("design-with-progress.pdf"))
```

The closure runs once after each page is serialized into the document, receiving the number of pages exported so far and the total page count. It is PDF-specific: raster exports like PNG or JPEG never invoke it. The closure runs on the main actor, so you can update your UI state directly.

## Stream Large Documents to a File

`engine.block.export(_:mimeType:options:)` builds the whole PDF in memory before handing it back as a `Blob`. For large multi-page documents such as photo books and magazines, that buffer becomes the peak allocation and can exhaust memory on everyday devices. The `engine.block.export(_:to:mimeType:options:onProgress:)` overload writes the bytes into a file as they are encoded, so peak memory is bounded by the working set of a single page instead of the size of the finished document.

```swift highlight-exportToPdf-stream
// Write the document straight into a file as it is encoded. Nothing buffers
// the finished PDF, so peak memory stays bounded by a single page rather than
// growing with the page count.
try await engine.block.export(
  scene,
  to: exportsDirectory.appendingPathComponent("design-streamed.pdf"),
  mimeType: .pdf,
  onProgress: { exportedPages, totalPages in
    print("Streamed \(exportedPages) of \(totalPages) pages")
  },
)
```

Streamed export only supports `MIMEType.pdf`; any other mime type throws. The chunks are handed over synchronously while the encoder runs, so a slow destination throttles the encoder rather than letting chunks pile up in memory. The bytes go into a staging file and replace the destination only once the document is complete, so a failed or cancelled export leaves a file that is already at that location untouched and never puts a truncated document in its place.

When the destination is not a plain file, for example when you upload the document while it is still being encoded, use the overload that takes a chunk closure:

```swift highlight-exportToPdf-chunks
// Hand the chunks to a destination that is not a plain file. The closure runs
// while the encoder does, so a slow destination throttles the encoder instead
// of letting chunks queue up.
try await engine.block.export(scene) { chunk in
  try upload(chunk)
}
```

The closure receives the chunks in order. Throwing from it cancels the export and rethrows your error to the caller.

Set `pdfChunkSize` on `ExportOptions` to choose how large a chunk may get. It is the memory you hold for one chunk, so lower it when the destination is memory-tight and raise it when the per-chunk work is expensive, for example one network request per chunk.

```swift highlight-exportToPdf-chunkSize
// Choose how large a chunk may get. This is the memory held for one chunk, so
// lower it for a memory-tight destination and raise it when the per-chunk work
// is expensive, for example one request per chunk.
try await engine.block.export(scene, options: ExportOptions(pdfChunkSize: 64 * 1024)) { chunk in
  try upload(chunk)
}
```

The default is an engine-chosen bound of 512 KiB. Any other value is clamped to the range 4 KiB to 64 MiB, so a value outside it makes the trade worse but never fails the export. It is a bound and not a fixed size: the encoder also flushes after each page, so the last chunk of a page is usually smaller.

## Cancel a Running Export

`export` follows Swift task cancellation. Cancel the task that runs it, and the export stops. The call throws and returns no data.

```swift highlight-exportToPdf-cancel
// Cancelling the task that runs the export stops the export itself. Keep the
// task in your view model and cancel it from your Cancel button.
let exportTask = Task {
  try await engine.block.export(scene, mimeType: .pdf)
}
exportTask.cancel()
do {
  _ = try await exportTask.value
} catch {
  // A cancelled export produces no data.
  print("Export cancelled: \(error)")
}
```

Keep the task in your view model rather than discarding it, because cancelling it is the only way to stop the export. For a multi-page PDF the engine stops at the next page boundary, so the pages that are still queued are never rendered. Every other export finishes its current work before the result is dropped, because there is no boundary to stop at.

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

## Control the Size of Rasterized Images

When `exportPdfWithHighCompatibility` is `false`, CE.SDK embeds the original data of unmodified JPEG images directly into the PDF. This keeps exports of photo-heavy documents such as photo books fast and small, because the photos are not decoded and encoded again.

CE.SDK must rasterize images that it cannot embed directly, for example images with effects or blurs applied, or every bitmap image when high compatibility mode is enabled. By default these images are encoded losslessly. Set `pdfImageQuality` on `ExportOptions` to a value below `1.0` to encode them as lossy JPEG instead, which produces much smaller files.

```swift
let imageQualityOptions = ExportOptions(
  exportPdfWithHighCompatibility: false,
  pdfImageQuality: 0.85,
)
let pdfBlob = try await engine.block.export(page, mimeType: .pdf, options: imageQualityOptions)
```

Valid values are greater than `0` and at most `1.0`. The default of `1.0` keeps the lossless encoding, in the same way as `webpQuality`. Images that are embedded as their original JPEG data are never encoded again, so this option does not change them.

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
| `pdfImageQuality` | Encoding quality for images that CE.SDK has to rasterize. Values below the default of `1.0` encode them as lossy JPEG. |
| `exportPdfWithUnderlayer` | Generate an underlayer from design contours. Defaults to `false`. |
| `underlayerSpotColorName` | Spot color name for the underlayer ink. Required when `exportPdfWithUnderlayer` is `true`. |
| `underlayerOffset` | Size adjustment in design units. Negative values shrink the underlayer inward. |
| `targetWidth` | Target output width in pixels. Must be used with `targetHeight`. |
| `targetHeight` | Target output height in pixels. Must be used with `targetWidth`. |
| `pdfChunkSize` | Upper bound in bytes for a single chunk of a streamed PDF export. Defaults to `0`, which uses the engine bound of 512 KiB. Other values are clamped to 4 KiB to 64 MiB. |

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(_:mimeType:options:onProgress:)` | Export a block as PDF with format and compatibility options, optionally reporting per-page progress through the `onProgress` closure |
| `engine.block.export(_:to:mimeType:options:onProgress:)` | Export a block as PDF straight into a file, without holding the document in memory |
| `engine.block.export(_:mimeType:options:onProgress:onData:)` | Export a block as PDF, delivering the bytes chunk by chunk to a closure |
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