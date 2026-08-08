> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Conversion](../conversion.md) > [To Binary Data](./to-blob.md)

---

```swift file=@cesdk_swift_examples/engine-guides-to-blob/ToBlob.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func toBlob(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)

  let scene = try engine.scene.get()!
  let page = try engine.scene.getPages().first!

  let pngBlob: Blob = try await engine.block.export(page, mimeType: .png)

  let options = ExportOptions(
    jpegQuality: 0.8,
    targetWidth: 1920,
    targetHeight: 1080,
  )
  let jpegBlob = try await engine.block.export(page, mimeType: .jpeg, options: options)

  let pages = try engine.scene.getPages()
  let stream = try await engine.block.export(pages, mimeType: .png)
  var blobs: [Blob] = []
  for try await blob in stream {
    blobs.append(blob)
  }

  let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("export.png")
  try pngBlob.write(to: tempURL)
}
```

Export design blocks to binary `Data` (aliased as `Blob`) for saving to disk, uploading to a server, or decoding for on-screen display.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/engine-guides-to-blob)

<EngineReferenceNote {...props} />

CE.SDK's `engine.block.export()` method renders any design block — a page, scene, or individual graphic block — into a `Blob`. In Swift, `Blob` is a typealias for `Data`, so the result integrates directly with Foundation APIs like `FileManager` and `URLSession`, and can be decoded straight into an image for display.

## Export a Block to PNG

Call `engine.block.export(_:mimeType:)` with a block ID and the desired format. The method returns a `Blob` containing the rendered output.

```swift highlight-toBlob-exportPng
let pngBlob: Blob = try await engine.block.export(page, mimeType: .png)
```

Supported image MIME types include `.png`, `.jpeg`, `.webp`, `.tga`, and `.pdf`.

## Configure Export Options

Pass an `ExportOptions` instance to control quality and dimensions. Options vary by format:

| Option | Formats | Default | Description |
| --- | --- | --- | --- |
| `pngCompressionLevel` | PNG | `5` | 0-9, higher = smaller file, same quality |
| `jpegQuality` | JPEG | `0.9` | 0-1, higher = better quality |
| `webpQuality` | WebP | `1.0` | 0-1, higher = better quality |
| `targetWidth` / `targetHeight` | All image | `0` | Scale to fill target size, keeping aspect ratio |

```swift highlight-toBlob-exportOptions
let options = ExportOptions(
  jpegQuality: 0.8,
  targetWidth: 1920,
  targetHeight: 1080,
)
let jpegBlob = try await engine.block.export(page, mimeType: .jpeg, options: options)
```

When both `targetWidth` and `targetHeight` are set, the block scales to fill the target rectangle while preserving its aspect ratio.

## Export Multiple Blocks

To export several blocks efficiently, pass an array of IDs. The method returns an `AsyncThrowingStream<Blob, Error>` that yields one blob per block in order, reusing a single background engine for all exports.

```swift highlight-toBlob-exportStream
let pages = try engine.scene.getPages()
let stream = try await engine.block.export(pages, mimeType: .png)
var blobs: [Blob] = []
for try await blob in stream {
  blobs.append(blob)
}
```

This is more memory-efficient than calling `export` in a loop because instead of creating an internal worker engine instance for each export only a single instance is created once and reused across all blocks.

## Save to Disk

Since `Blob` is `Data`, write it directly to a file URL with Foundation's `write(to:)`.

```swift highlight-toBlob-saveToFile
let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("export.png")
try pngBlob.write(to: tempURL)
```

You can also pass the blob to `URLSession` for uploading, or decode it as an image for display.

## Next Steps

- [To PDF](../export-save-publish/export/to-pdf.md) — Export scenes as single- or multi-page PDFs with print options.
- [Conversion Overview](./overview.md) — See all supported export formats.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support