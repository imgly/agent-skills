> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

---

```swift file=@cesdk_swift_examples/engine-guides-conversion-to-png/ConversionToPng.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func conversionToPng(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)

  let page = try engine.scene.getCurrentPage()!
  let pngData = try await engine.block.export(page, mimeType: .png)

  let pages = try engine.scene.getPages()
  var exportedPages: [Data] = []
  for try await data in try await engine.block.export(pages, mimeType: .png) {
    exportedPages.append(data)
  }

  let compressedOptions = ExportOptions(pngCompressionLevel: 9)
  let compressedData = try await engine.block.export(page, mimeType: .png, options: compressedOptions)

  let resizedOptions = ExportOptions(targetWidth: 1920, targetHeight: 1080)
  let resizedData = try await engine.block.export(page, mimeType: .png, options: resizedOptions)

  let overhangOptions = ExportOptions(allowTextOverhang: true)
  let overhangData = try await engine.block.export(page, mimeType: .png, options: overhangOptions)
}
```

Export designs to PNG format with lossless quality and optional transparency support.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260810/engine-guides-conversion-to-png)

<EngineReferenceNote {...props} />

PNG is a lossless image format that preserves image quality and supports transparency. It's ideal for designs requiring pixel-perfect fidelity, logos, graphics with transparent backgrounds, and any content where quality cannot be compromised.

This guide covers how to export designs to PNG and configure export options using the Engine API.

## Export to PNG

Use `engine.block.export(_:mimeType:)` to export a design block to PNG. The method returns `Data` containing the image.

```swift highlight-conversionToPng-exportSinglePage
let page = try engine.scene.getCurrentPage()!
let pngData = try await engine.block.export(page, mimeType: .png)
```

## Export All Pages

Export all pages in a scene using the batch export API. Pass the full array of page IDs to `engine.block.export(_:mimeType:)`, which returns an `AsyncThrowingStream` of blobs.

```swift highlight-conversionToPng-exportAllPages
let pages = try engine.scene.getPages()
var exportedPages: [Data] = []
for try await data in try await engine.block.export(pages, mimeType: .png) {
  exportedPages.append(data)
}
```

The batch API reuses a single worker engine for all exports, making it more memory efficient than exporting pages individually.

## Compression Level

Control the file size versus export speed tradeoff using `pngCompressionLevel` in `ExportOptions`. Valid values are 0-9, where higher values produce smaller files but take longer to export. Since PNG is lossless, image quality remains unchanged.

```swift highlight-conversionToPng-compressionLevel
let compressedOptions = ExportOptions(pngCompressionLevel: 9)
let compressedData = try await engine.block.export(page, mimeType: .png, options: compressedOptions)
```

The default compression level is 5, providing a good balance between file size and export speed.

## Target Dimensions

Resize the output by setting `targetWidth` and `targetHeight`. The block scales to fill the target dimensions while maintaining its aspect ratio.

```swift highlight-conversionToPng-targetDimensions
let resizedOptions = ExportOptions(targetWidth: 1920, targetHeight: 1080)
let resizedData = try await engine.block.export(page, mimeType: .png, options: resizedOptions)
```

Both values must be set together. A value of `0` (the default) uses the block's native size.

## Text Overhang

Decorative fonts sometimes have glyphs that extend beyond their frame. Set `allowTextOverhang` to `true` to prevent clipping these glyphs during export.

```swift highlight-conversionToPng-textOverhang
let overhangOptions = ExportOptions(allowTextOverhang: true)
let overhangData = try await engine.block.export(page, mimeType: .png, options: overhangOptions)
```

## API Reference

| API | Description |
| --- | --- |
| `engine.block.export(_:mimeType:options:)` | Exports a single block to `Data` with the specified options |
| `engine.block.export(_:mimeType:options:)` (batch) | Exports multiple blocks, returning an `AsyncThrowingStream` of `Data` |
| `engine.scene.getCurrentPage()` | Returns the current page block ID |
| `engine.scene.getPages()` | Returns all page block IDs in the scene |
| `ExportOptions(pngCompressionLevel:targetWidth:targetHeight:allowTextOverhang:)` | Configures PNG export options |

## Next Steps

- [Conversion Overview](./overview.md) - Learn about other export formats
- [To PDF](../export-save-publish/export/to-pdf.md) - Export designs to PDF format
- [Export Overview](../export-save-publish/export/overview.md) - Understand the full export workflow



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support