> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [Partial Export](./partial-export.md)

---

Export individual design elements, grouped blocks, or specific pages from your
scene instead of exporting everything at once using CE.SDK's flexible export
API.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-partial-export)

Partial export gives you fine-grained control over what leaves the scene. Instead of rendering the entire composition, you can target a single graphic, a logical group of blocks, or one page out of a multi-page document. This is the foundation for asset-library generation, "export selection" features, page-by-page previews, and per-element output pipelines.

```swift file=@cesdk_swift_examples/engine-guides-partial-export/PartialExport.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func partialExport(engine: Engine) async throws {
  // Demo scaffolding: a two-page scene with three colored graphics on page 1
  // and one graphic on page 2, so each highlighted snippet has real exportable
  // content. The rendered guide does not show this setup; readers start from a
  // scene already loaded into their app.
  let scene = try engine.scene.create()

  let page1 = try engine.block.create(.page)
  try engine.block.setWidth(page1, value: 800)
  try engine.block.setHeight(page1, value: 600)
  try engine.block.appendChild(to: scene, child: page1)

  let rectangle = try engine.block.create(.graphic)
  try engine.block.setShape(rectangle, shape: engine.block.createShape(.rect))
  let rectangleFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    rectangleFill,
    property: "fill/color/value",
    color: .rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0),
  )
  try engine.block.setFill(rectangle, fill: rectangleFill)
  try engine.block.setPositionX(rectangle, value: 80)
  try engine.block.setPositionY(rectangle, value: 100)
  try engine.block.setWidth(rectangle, value: 220)
  try engine.block.setHeight(rectangle, value: 220)
  try engine.block.setName(rectangle, name: "background-rect")
  try engine.block.appendChild(to: page1, child: rectangle)

  let ellipse = try engine.block.create(.graphic)
  try engine.block.setShape(ellipse, shape: engine.block.createShape(.ellipse))
  let ellipseFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    ellipseFill,
    property: "fill/color/value",
    color: .rgba(r: 0.95, g: 0.85, b: 0.2, a: 1.0),
  )
  try engine.block.setFill(ellipse, fill: ellipseFill)
  try engine.block.setPositionX(ellipse, value: 340)
  try engine.block.setPositionY(ellipse, value: 100)
  try engine.block.setWidth(ellipse, value: 220)
  try engine.block.setHeight(ellipse, value: 220)
  try engine.block.appendChild(to: page1, child: ellipse)

  let star = try engine.block.create(.graphic)
  try engine.block.setShape(star, shape: engine.block.createShape(.star))
  let starFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    starFill,
    property: "fill/color/value",
    color: .rgba(r: 0.9, g: 0.2, b: 0.2, a: 1.0),
  )
  try engine.block.setFill(star, fill: starFill)
  try engine.block.setPositionX(star, value: 210)
  try engine.block.setPositionY(star, value: 350)
  try engine.block.setWidth(star, value: 220)
  try engine.block.setHeight(star, value: 220)
  try engine.block.appendChild(to: page1, child: star)

  let page2 = try engine.block.create(.page)
  try engine.block.setWidth(page2, value: 800)
  try engine.block.setHeight(page2, value: 600)
  try engine.block.appendChild(to: scene, child: page2)
  let page2Graphic = try engine.block.create(.graphic)
  try engine.block.setShape(page2Graphic, shape: engine.block.createShape(.rect))
  let page2Fill = try engine.block.createFill(.color)
  try engine.block.setColor(
    page2Fill,
    property: "fill/color/value",
    color: .rgba(r: 0.2, g: 0.7, b: 0.4, a: 1.0),
  )
  try engine.block.setFill(page2Graphic, fill: page2Fill)
  try engine.block.setPositionX(page2Graphic, value: 200)
  try engine.block.setPositionY(page2Graphic, value: 150)
  try engine.block.setWidth(page2Graphic, value: 400)
  try engine.block.setHeight(page2Graphic, value: 300)
  try engine.block.appendChild(to: page2, child: page2Graphic)

  let exportsDirectory = FileManager.default.temporaryDirectory

  let graphicBlocks = try engine.block.find(byType: .graphic)
  let namedBlocks = engine.block.find(byName: "background-rect")
  _ = namedBlocks

  guard let firstGraphic = graphicBlocks.first else { return }
  let pngOptions = ExportOptions(pngCompressionLevel: 5)
  let blockData = try await engine.block.export(firstGraphic, mimeType: .png, options: pngOptions)
  try blockData.write(to: exportsDirectory.appendingPathComponent("graphic.png"))

  let group = try engine.block.group([rectangle, ellipse])
  let groupData = try await engine.block.export(group, mimeType: .png)
  try groupData.write(to: exportsDirectory.appendingPathComponent("group.png"))

  // In a real app the user makes the selection in the editor UI; here we set
  // it programmatically so findAllSelected returns a deterministic value.
  try engine.block.setSelected(star, selected: true)

  let selectedBlocks = engine.block.findAllSelected()
  if selectedBlocks.count == 1 {
    let selectionData = try await engine.block.export(selectedBlocks[0], mimeType: .png)
    try selectionData.write(to: exportsDirectory.appendingPathComponent("selection.png"))
  } else if selectedBlocks.count > 1 {
    let selectionGroup = try engine.block.group(selectedBlocks)
    let selectionData = try await engine.block.export(selectionGroup, mimeType: .png)
    try selectionData.write(to: exportsDirectory.appendingPathComponent("selection.png"))
  }

  if let currentPage = try engine.scene.getCurrentPage() {
    let pageData = try await engine.block.export(currentPage, mimeType: .png)
    try pageData.write(to: exportsDirectory.appendingPathComponent("current-page.png"))
  }

  let pages = try engine.scene.getPages()
  let pageStream = try await engine.block.export(pages, mimeType: .png)
  var pageIndex = 1
  for try await data in pageStream {
    try data.write(to: exportsDirectory.appendingPathComponent("page-\(pageIndex).png"))
    pageIndex += 1
  }

  let resizedOptions = ExportOptions(targetWidth: 1080, targetHeight: 1080)
  let resizedData = try await engine.block.export(page1, mimeType: .png, options: resizedOptions)
  try resizedData.write(to: exportsDirectory.appendingPathComponent("page-1080.png"))

  let jpegOptions = ExportOptions(jpegQuality: 0.8)
  let jpegData = try await engine.block.export(page1, mimeType: .jpeg, options: jpegOptions)
  try jpegData.write(to: exportsDirectory.appendingPathComponent("page.jpg"))

  let webpOptions = ExportOptions(webpQuality: 0.85)
  let webpData = try await engine.block.export(page1, mimeType: .webp, options: webpOptions)
  try webpData.write(to: exportsDirectory.appendingPathComponent("page.webp"))

  let maxExportSize = try engine.editor.getMaxExportSize()
  let availableMemory = try? engine.editor.getAvailableMemory()
  _ = maxExportSize
  _ = availableMemory

  let pdfOptions = ExportOptions(exportPdfWithHighCompatibility: true)
  let pdfData = try await engine.block.export(page1, mimeType: .pdf, options: pdfOptions)
  try pdfData.write(to: exportsDirectory.appendingPathComponent("page.pdf"))
}
```

This guide covers exporting individual blocks, grouped elements, and pages with `engine.block.export(_:mimeType:options:)`, plus the format and sizing options that shape each output.

## Understanding Block Hierarchy and Export

### How Block Hierarchy Affects Exports

CE.SDK organizes content as a tree: Scene → Pages → Groups → Individual Blocks. When you export a block, the export automatically includes every descendant of that block.

Exporting a page exports every element on that page. Exporting a group exports the group and all of its children. Exporting an individual block (graphic, text, shape) exports only that block. The level of the hierarchy you target is what determines the scope of the output — choose the page for a complete layout, the group for a composite asset, or the block itself for a single element.

### Export Behavior

The export pipeline normalizes a few things automatically. If the exported block itself is rotated, it is exported without that rotation so the content appears upright in the file. Any margin set on the block is included in the export bounds. Outside strokes are included for most block types; pages handle strokes differently.

> **Note:** Only blocks that belong to the scene hierarchy can be exported. A block created with
> `engine.block.create(_:)` but never appended to a parent already attached to the scene
> cannot be exported until it is added to the tree.

## Exporting Individual Blocks

### Finding Blocks to Export

Before exporting, locate the block. The most common entry points are `find(byType:)`, which returns every block of a given `DesignBlockType` (for example `.graphic`, `.text`, or `.page`), and `find(byName:)`, which returns blocks you have tagged with `engine.block.setName(_:name:)`. If the caller already holds a `DesignBlockID` reference (from a creation call or a tap handler), you can pass it directly.

```swift highlight-partialExport-findBlocks
let graphicBlocks = try engine.block.find(byType: .graphic)
let namedBlocks = engine.block.find(byName: "background-rect")
```

`find(byType: .graphic)` returns every graphic block in the scene regardless of fill content — a graphic with a solid color fill, an image fill, and a gradient fill are all returned. Filter further by inspecting the block's fill or kind if you need a specific subset.

### Basic Block Export

`engine.block.export(_:mimeType:options:)` is `async throws` and returns `Blob`, which is a typealias for `Data`. Pass the block's `DesignBlockID`, the desired `MIMEType`, and an `ExportOptions` configured for that format. Persist the returned `Data` with `Data.write(to:)` against any writable URL — `FileManager.default.temporaryDirectory` works well for ephemeral output that is later uploaded or shared.

```swift highlight-partialExport-exportIndividualBlock
let pngOptions = ExportOptions(pngCompressionLevel: 5)
let blockData = try await engine.block.export(firstGraphic, mimeType: .png, options: pngOptions)
try blockData.write(to: exportsDirectory.appendingPathComponent("graphic.png"))
```

CE.SDK supports `MIMEType.png`, `.jpeg`, `.webp`, and `.pdf` for static partial exports. Each format reads a different option from `ExportOptions` — PNG uses `pngCompressionLevel`, JPEG uses `jpegQuality`, WEBP uses `webpQuality`, and PDF uses `exportPdfWithHighCompatibility`. The [Quality and Compression](./partial-export.md#quality-and-compression) section shows a JPEG/WEBP example and the [Export Limitations](./partial-export.md#export-limitations-and-considerations) section shows a PDF example; other fields are ignored for formats that do not consume them.

PNG is ideal for graphics that need transparency such as UI elements, logos, or illustrations with alpha channels. JPEG produces smaller files for photographs but drops transparency, replacing it with a solid background. WEBP delivers better compression than PNG or JPEG for web pipelines. PDF preserves vector information for print workflows.

## Exporting Grouped Elements

### Creating and Exporting Groups

Groups are useful when several blocks should leave the scene as a single output — a logo with multiple components, a composite illustration, or any layout section that should not be split. `engine.block.group(_:)` takes an array of `DesignBlockID` values, returns the new group's ID, and you export that ID like any other block.

```swift highlight-partialExport-createAndExportGroup
let group = try engine.block.group([rectangle, ellipse])
let groupData = try await engine.block.export(group, mimeType: .png)
try groupData.write(to: exportsDirectory.appendingPathComponent("group.png"))
```

When a group is exported, CE.SDK renders all children together into one file. The group's bounding box determines the export dimensions, and the relative positioning of children is preserved exactly as designed.

### Exporting Selected Elements

A common product workflow is to export whatever the user has selected. `engine.block.findAllSelected()` returns the currently selected `DesignBlockID`s; if there is exactly one, export it directly, and if there are several, group them temporarily and export the group. This lets a single "Export Selection" action handle both cases without branching in the UI layer.

```swift highlight-partialExport-exportSelected
let selectedBlocks = engine.block.findAllSelected()
if selectedBlocks.count == 1 {
  let selectionData = try await engine.block.export(selectedBlocks[0], mimeType: .png)
  try selectionData.write(to: exportsDirectory.appendingPathComponent("selection.png"))
} else if selectedBlocks.count > 1 {
  let selectionGroup = try engine.block.group(selectedBlocks)
  let selectionData = try await engine.block.export(selectionGroup, mimeType: .png)
  try selectionData.write(to: exportsDirectory.appendingPathComponent("selection.png"))
}
```

In an editor app the user provides the selection through the canvas. The Swift sample above sets the selection programmatically with `engine.block.setSelected(_:selected:)` so the snippet is reproducible in a test or on a freshly loaded scene.

## Exporting Pages

`engine.scene.getCurrentPage()` returns the active page as a `DesignBlockID?` — it is optional because the scene may not yet have a current page. Use `if let` to unwrap it before exporting. To produce previews for every page in a multi-page document, walk `engine.scene.getPages()` instead.

```swift highlight-partialExport-exportCurrentPage
if let currentPage = try engine.scene.getCurrentPage() {
  let pageData = try await engine.block.export(currentPage, mimeType: .png)
  try pageData.write(to: exportsDirectory.appendingPathComponent("current-page.png"))
}
```

Page exports include the page background, every element on the page, and any page-level effects. The page's own dimensions become the output dimensions unless `targetWidth`/`targetHeight` override them.

For multi-page documents, `engine.block.export(_:mimeType:options:)` accepts an array of IDs and returns an `AsyncThrowingStream<Blob, Error>` that yields one blob per page in input order. The streaming variant reuses a single background worker across the batch, so it is more memory-efficient than calling `export` in a loop.

```swift highlight-partialExport-exportAllPages
let pages = try engine.scene.getPages()
let pageStream = try await engine.block.export(pages, mimeType: .png)
var pageIndex = 1
for try await data in pageStream {
  try data.write(to: exportsDirectory.appendingPathComponent("page-\(pageIndex).png"))
  pageIndex += 1
}
```

Use sequential numbering when writing the blobs so files are easy to recombine. PDF is a good choice when downstream consumers expect one document with selectable text; PNG or WEBP suits image previews and per-page thumbnails.

## Export Options and Configuration

### Target Size Control

`ExportOptions(targetWidth:targetHeight:)` requests output at a specific size while preserving the block's aspect ratio. The block is rendered large enough to fill the target completely; if the requested size has a different aspect than the block, one axis may extend past the target so proportions stay correct. There is no stretching or distortion.

```swift highlight-partialExport-targetSize
let resizedOptions = ExportOptions(targetWidth: 1080, targetHeight: 1080)
let resizedData = try await engine.block.export(page1, mimeType: .png, options: resizedOptions)
try resizedData.write(to: exportsDirectory.appendingPathComponent("page-1080.png"))
```

`targetWidth` and `targetHeight` are pixel values regardless of the scene's design unit, which makes them well-suited for responsive thumbnails, social-media presets, and platform-imposed dimensions.

### Quality and Compression

Each lossy format exposes its own quality knob on `ExportOptions`. Use them to trade output size against visual fidelity.

```swift highlight-partialExport-qualityOptions
  let jpegOptions = ExportOptions(jpegQuality: 0.8)
  let jpegData = try await engine.block.export(page1, mimeType: .jpeg, options: jpegOptions)
  try jpegData.write(to: exportsDirectory.appendingPathComponent("page.jpg"))

  let webpOptions = ExportOptions(webpQuality: 0.85)
  let webpData = try await engine.block.export(page1, mimeType: .webp, options: webpOptions)
  try webpData.write(to: exportsDirectory.appendingPathComponent("page.webp"))
```

| Field | Range | Behavior |
| --- | --- | --- |
| `pngCompressionLevel` | `0`–`9` (default `5`) | Higher values produce smaller files at the cost of encoding time. PNG is lossless, so quality is unaffected. |
| `jpegQuality` | `(0, 1]` (default `0.9`) | Higher values produce larger, sharper files. Values above `0.9` are visually transparent for most content. |
| `webpQuality` | `(0, 1]` (default `1.0`) | A value of `1.0` triggers WEBP's lossless mode, which often beats PNG on file size for the same content. |

### Export Size Limits

Before requesting a very large export, query the device's reported limits. `getMaxExportSize()` returns the maximum dimension in pixels (returning `Int32.max` when the limit is unknown). Both width and height of the export must stay below or equal to this value. `getAvailableMemory()` returns free engine memory in bytes; an export that fits within `getMaxExportSize()` may still fail if memory is tight.

```swift highlight-partialExport-checkLimits
let maxExportSize = try engine.editor.getMaxExportSize()
let availableMemory = try? engine.editor.getAvailableMemory()
```

`getAvailableMemory()` is unavailable on the iOS Simulator and returns `nil` there. Call it with `try?` and treat `nil` as "unknown memory" rather than failing the workflow — on real devices it returns a byte count you can use to size exports.

Use the values to gate user-facing presets, warn on requests that exceed the device limit, or pick a smaller `targetWidth`/`targetHeight` automatically when memory is constrained.

## Export Limitations and Considerations

### Format-Specific Constraints

JPEG drops transparency from the output, replacing transparent pixels with a solid background. Designs that rely on alpha channels should export to PNG or WEBP instead.

PDF behavior depends on `ExportOptions.exportPdfWithHighCompatibility`. With `true` (the default), bitmap content and effects are rasterized at the scene DPI for broader viewer compatibility. With `false`, PDFs export faster by embedding images directly, but gradients with transparency may not render correctly in Safari or macOS Preview. See the [Export to PDF](./to-pdf.md) guide for detailed performance guidance.

```swift highlight-partialExport-exportPDF
let pdfOptions = ExportOptions(exportPdfWithHighCompatibility: true)
let pdfData = try await engine.block.export(page1, mimeType: .pdf, options: pdfOptions)
try pdfData.write(to: exportsDirectory.appendingPathComponent("page.pdf"))
```

### Performance Considerations

`engine.block.export(_:mimeType:options:)` runs on a background worker engine and is `async`, so it does not block the UI thread, but the call still takes time proportional to the rendered area. Show a progress indicator for large exports, and prefer the array-of-IDs overload when batching — it reuses a single worker across the batch instead of creating a new one per export.

On iOS, the worker is automatically suspended when the app moves to the background and resumed when it returns to the foreground. This affects long-running exports such as video, but static partial exports usually finish before suspension matters.

### Hierarchy Requirements

Only blocks attached to the scene can be exported. Always append blocks to a page (or to a parent that is itself in the tree) before calling `export`. Graphic blocks additionally need both a shape and a fill set — `engine.block.create(.graphic)` produces an empty placeholder until `setShape(_:shape:)` and `setFill(_:fill:)` are applied.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.export(_:mimeType:options:)` | Exports a single block as `Data`. `async throws`. |
| `engine.block.export(_:mimeType:options:)` (array) | Exports an array of blocks as an `AsyncThrowingStream<Blob, Error>` that yields one blob per ID. |
| `engine.block.find(byType:)` | Returns every block matching a `DesignBlockType`, `FillType`, `ShapeType`, `EffectType`, or `BlurType`. |
| `engine.block.find(byName:)` | Returns blocks tagged with `setName(_:name:)`. |
| `engine.block.findAllSelected()` | Returns the currently selected blocks. |
| `engine.block.group(_:)` | Groups multiple blocks under a single new parent and returns its ID. |
| `engine.scene.getCurrentPage()` | Returns the active page as `DesignBlockID?`. |
| `engine.scene.getPages()` | Returns every page in scene order. |
| `engine.editor.getMaxExportSize()` | Returns the device's maximum export dimension in pixels. |
| `engine.editor.getAvailableMemory()` | Returns free engine memory in bytes. Unavailable on the iOS Simulator — call with `try?` and treat `nil` as "unknown". |
| `ExportOptions` | Per-format options: `pngCompressionLevel`, `jpegQuality`, `webpQuality`, `targetWidth`, `targetHeight`, `exportPdfWithHighCompatibility`. |

## Next Steps

- [Export Overview](./overview.md) — Fundamentals of exporting from CE.SDK
- [Export to PDF](./to-pdf.md) — Multi-page PDF output and print-ready settings
- [Export to JPEG](./to-jpeg.md) — JPEG quality and color handling
- [Size Limits](./size-limits.md) — Tune `maxImageSize` and validate exports against device capabilities



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support