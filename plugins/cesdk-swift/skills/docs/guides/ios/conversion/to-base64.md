> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Conversion](../conversion.md) > [To Base64](./to-base64.md)

---

```swift file=@cesdk_swift_examples/engine-guides-conversion-to-base64/ToBase64.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func toBase64(engine: Engine) async throws {
  let scene = try await engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)

  let graphic = try engine.block.create(.graphic)
  try engine.block.appendChild(to: page, child: graphic)
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(graphic, shape: rectShape)
  let colorFill = try engine.block.createFill(.color)
  try engine.block.setColor(colorFill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.4, b: 0.9, a: 1))
  try engine.block.setFill(graphic, fill: colorFill)
  try engine.block.setWidth(graphic, value: 400)
  try engine.block.setHeight(graphic, value: 300)
  try engine.block.setPositionX(graphic, value: 200)
  try engine.block.setPositionY(graphic, value: 150)

  let blob = try await engine.block.export(page, mimeType: .png)
  let base64String = blob.base64EncodedString()

  let mimeType: MIMEType = .png
  let dataURI = "data:\(mimeType.rawValue);base64,\(blob.base64EncodedString())"

  let pngBlob = try await engine.block.export(page, mimeType: .png)
  let pngBase64 = pngBlob.base64EncodedString()

  let jpegBlob = try await engine.block.export(
    page,
    mimeType: .jpeg,
    options: ExportOptions(jpegQuality: 0.8),
  )
  let jpegBase64 = jpegBlob.base64EncodedString()

  let webpBlob = try await engine.block.export(
    page,
    mimeType: .webp,
    options: ExportOptions(webpQuality: 0.9),
  )
  let webpBase64 = webpBlob.base64EncodedString()

  let pages = try engine.scene.getPages()
  var base64Results: [String] = []
  for try await pageBlob in try await engine.block.export(pages, mimeType: .png) {
    base64Results.append(pageBlob.base64EncodedString())
  }

  _ = base64String
  _ = dataURI
  _ = pngBase64
  _ = jpegBase64
  _ = webpBase64
  _ = base64Results
}
```

Convert CE.SDK exports to Base64-encoded strings for embedding in HTML, storing in databases, or transmitting via JSON APIs.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260903/engine-guides-conversion-to-base64)

<EngineReferenceNote {...props} />

Base64 encoding transforms binary image data into ASCII text. In Swift, CE.SDK's `engine.block.export()` returns a `Blob` (a typealias for `Data`), which you convert to Base64 using Foundation's built-in `base64EncodedString()` method.

## Export a Block to Base64

Export a design block as a PNG and convert the resulting `Data` to a Base64 string.

```swift highlight-toBase64-export
let blob = try await engine.block.export(page, mimeType: .png)
let base64String = blob.base64EncodedString()
```

The export returns a `Blob` (`Data`) containing the rendered image. Call `base64EncodedString()` to get the Base64 representation. This works with any `MIMEType` supported by the export method.

## Create a Data URI

Construct a data URI by combining the MIME type with the Base64 string. Data URIs embed image data directly in HTML or CSS without separate file references.

```swift highlight-toBase64-dataURI
let mimeType: MIMEType = .png
let dataURI = "data:\(mimeType.rawValue);base64,\(blob.base64EncodedString())"
```

The resulting string follows the format `data:image/png;base64,...` and can be used anywhere a URL is expected, such as in web views or HTML templates.

## Work with Different MIME Types

CE.SDK supports multiple image formats, each with format-specific quality options through `ExportOptions`.

```swift highlight-toBase64-mimeTypes
  let pngBlob = try await engine.block.export(page, mimeType: .png)
  let pngBase64 = pngBlob.base64EncodedString()

  let jpegBlob = try await engine.block.export(
    page,
    mimeType: .jpeg,
    options: ExportOptions(jpegQuality: 0.8),
  )
  let jpegBase64 = jpegBlob.base64EncodedString()

  let webpBlob = try await engine.block.export(
    page,
    mimeType: .webp,
    options: ExportOptions(webpQuality: 0.9),
  )
  let webpBase64 = webpBlob.base64EncodedString()
```

| Format | Option | Default | Notes |
|--------|--------|---------|-------|
| PNG | `pngCompressionLevel` | `5` | Lossless, supports transparency |
| JPEG | `jpegQuality` | `0.9` | Lossy, smaller file size, no transparency |
| WebP | `webpQuality` | `1.0` | Modern format, good compression |

> **Note:** Base64 increases data size by approximately 33%. For images larger than 100KB, consider storing the raw `Data` directly instead.

## Batch Process Multiple Pages

Export all pages in a scene to Base64 strings using the batch export API. Pass the full array of page IDs to `engine.block.export(_:mimeType:)`, which returns an `AsyncThrowingStream` of blobs.

```swift highlight-toBase64-batch
let pages = try engine.scene.getPages()
var base64Results: [String] = []
for try await pageBlob in try await engine.block.export(pages, mimeType: .png) {
  base64Results.append(pageBlob.base64EncodedString())
}
```

The batch API reuses a single worker engine for all exports, making it more memory efficient than exporting pages individually.

## When to Use Base64

Base64 encoding is useful for:

- Embedding images in HTML email templates or web views
- Storing image data in text-only databases or `UserDefaults`
- Transmitting images through JSON APIs that don't support binary data
- Creating inline data URIs for CSS backgrounds

For large images or file storage, write the `Data` directly to disk using `Data.write(to:)` instead.

## Next Steps

- [Conversion Overview](./overview.md) — Overview of all conversion formats and options
- [Export Overview](../export-save-publish/export/overview.md) — Explore all available export formats and configuration
- [To PDF](../export-save-publish/export/to-pdf.md) — Export designs to PDF format
- [Compress Exports](../export-save-publish/export/compress.md) — Optimize export file size and quality



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support