> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To JPEG](./to-jpeg.md)

---

Export CE.SDK designs to JPEG format—ideal for photographs, social media, and web content where file size matters more than transparency.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/engine-guides-export-to-jpeg)

JPEG uses lossy compression optimized for photographs and smooth color gradients. Unlike PNG, JPEG does not support transparency—transparent areas render with a solid background.

```swift file=@cesdk_swift_examples/engine-guides-export-to-jpeg/ToJpeg.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func toJpeg(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)

  let page = try engine.scene.getPages().first!

  let blob: Blob = try await engine.block.export(
    page,
    mimeType: .jpeg,
    options: ExportOptions(jpegQuality: 0.9),
  )

  let highQualityBlob = try await engine.block.export(
    page,
    mimeType: .jpeg,
    options: ExportOptions(jpegQuality: 1.0),
  )

  let sizedBlob = try await engine.block.export(
    page,
    mimeType: .jpeg,
    options: ExportOptions(
      jpegQuality: 0.85,
      targetWidth: 1920,
      targetHeight: 1080,
    ),
  )

  let outputURL = FileManager.default.temporaryDirectory.appendingPathComponent("export.jpg")
  try blob.write(to: outputURL)

  _ = highQualityBlob
  _ = sizedBlob
}
```

This guide covers exporting to JPEG, configuring quality and dimensions, and saving exports to disk.

## Export to JPEG

Export a design block by calling `engine.block.export(_:mimeType:options:)` with `.jpeg` as the MIME type. The call returns a `Blob` (a `Data` value) containing the encoded image.

```swift highlight-toJpeg-exportJpeg
let blob: Blob = try await engine.block.export(
  page,
  mimeType: .jpeg,
  options: ExportOptions(jpegQuality: 0.9),
)
```

The `jpegQuality` parameter accepts values from greater than 0 to 1. Higher values produce better quality at larger file sizes. The default is `0.9`.

## Export Options

JPEG export reads these fields from `ExportOptions`:

| Option         | Type    | Default | Description                                                                          |
| -------------- | ------- | ------- | ------------------------------------------------------------------------------------ |
| `jpegQuality`  | `Float` | `0.9`   | Quality from >0 to 1                                                                 |
| `targetWidth`  | `Float` | `0`     | Output width in pixels. Used together with `targetHeight`; `0` disables the override |
| `targetHeight` | `Float` | `0`     | Output height in pixels. Used together with `targetWidth`; `0` disables the override |

### Quality Control

Set `jpegQuality` to `1.0` for maximum quality with minimal compression artifacts. This is useful for archival or print preparation.

```swift highlight-toJpeg-exportQuality
let highQualityBlob = try await engine.block.export(
  page,
  mimeType: .jpeg,
  options: ExportOptions(jpegQuality: 1.0),
)
```

For web delivery, values around `0.8` balance quality and file size effectively.

### Target Dimensions

Specify `targetWidth` and `targetHeight` to export at exact dimensions. The output fills the target size while maintaining aspect ratio.

```swift highlight-toJpeg-exportSize
let sizedBlob = try await engine.block.export(
  page,
  mimeType: .jpeg,
  options: ExportOptions(
    jpegQuality: 0.85,
    targetWidth: 1920,
    targetHeight: 1080,
  ),
)
```

## Save to File System

The returned `Blob` is a `Data` value, so writing it to disk is a single call to `write(to:)`.

```swift highlight-toJpeg-saveFile
let outputURL = FileManager.default.temporaryDirectory.appendingPathComponent("export.jpg")
try blob.write(to: outputURL)
```

## When to Use JPEG

JPEG works well for:

- Photographs and images with gradual color transitions
- Social media posts and web content
- Scenarios where file size matters more than perfect quality

> **Note:** For graphics with sharp edges, text, or transparency, use PNG instead. For modern web delivery with better compression, consider WebP.

## Troubleshooting

**Output looks blurry** — Increase `jpegQuality` toward `1.0`, or use PNG for graphics with hard edges.

**File size too large** — Decrease `jpegQuality` to `0.7`–`0.8`, or reduce dimensions with `targetWidth` and `targetHeight`.

**Unexpected background** — JPEG does not support transparency. Use PNG or WebP for transparent content.

## API Reference

| Method                                     | Description                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `engine.block.export(_:mimeType:options:)` | Export a block to the specified format                                                   |
| `engine.scene.load(from:)`                 | Load a scene from a remote URL                                                           |
| `engine.scene.getPages()`                  | Return all pages in the current scene                                                    |
| `ExportOptions`                            | Format-specific export configuration; JPEG reads `jpegQuality`, `targetWidth`, `targetHeight` |

## Next Steps

- [Export Overview](./overview.md) — Compare all available export formats
- [Export to PDF](./to-pdf.md) — Export for print and document workflows
- [Partial Export](./partial-export.md) — Learn how to export specific blocks, groups, and page elements instead of entire scenes using CE.SDK's programmatic export API.
- [Size Limits](./size-limits.md) — Understand and configure limits on exported file dimensions or data size.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support