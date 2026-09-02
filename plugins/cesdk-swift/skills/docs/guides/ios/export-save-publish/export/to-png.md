> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To PNG](./to-png.md) > [Conversion](../../conversion.md) > [To PNG](./to-png.md)

---

Export CE.SDK designs to PNG format with full alpha support and lossless compression—ideal for graphics, UI elements, and any content where transparency or pixel-perfect edges matter.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260902/engine-guides-export-to-png)

PNG uses lossless compression and preserves transparency through an alpha channel. The encoder lets you trade encoding speed for file size without affecting image quality.

```swift file=@cesdk_swift_examples/engine-guides-export-to-png/ToPng.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func toPng(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)

  let page = try engine.scene.getPages().first!

  let blob: Blob = try await engine.block.export(page, mimeType: .png)

  let compressedBlob = try await engine.block.export(
    page,
    mimeType: .png,
    options: ExportOptions(pngCompressionLevel: 9),
  )

  let sizedBlob = try await engine.block.export(
    page,
    mimeType: .png,
    options: ExportOptions(targetWidth: 1920, targetHeight: 1080),
  )

  let outputURL = FileManager.default.temporaryDirectory.appendingPathComponent("export.png")
  try blob.write(to: outputURL)

  _ = compressedBlob
  _ = sizedBlob
}
```

This guide covers exporting to PNG, configuring compression and dimensions, and saving exports to disk.

## Export to PNG

Export a design block by calling `engine.block.export(_:mimeType:options:)` with `.png` as the MIME type. The call returns a `Blob` (a `Data` value) containing the encoded image.

```swift highlight-toPng-exportPng
let blob: Blob = try await engine.block.export(page, mimeType: .png)
```

Pass a page returned by `engine.scene.getPages()`, or any other block ID, to export specific elements.

## Export Options

PNG export reads these fields from `ExportOptions`:

| Option                | Type    | Default | Description                                                                          |
| --------------------- | ------- | ------- | ------------------------------------------------------------------------------------ |
| `pngCompressionLevel` | `Int`   | `5`     | Compression level from `0` (fastest) to `9` (smallest). Quality is unaffected        |
| `targetWidth`         | `Float` | `0`     | Output width in pixels. Used together with `targetHeight`; `0` disables the override |
| `targetHeight`        | `Float` | `0`     | Output height in pixels. Used together with `targetWidth`; `0` disables the override |
| `allowTextOverhang`   | `Bool`  | `false` | When `true`, text blocks export with the full glyph bounds visible                   |

### Compression Level

The `pngCompressionLevel` field (`0`–`9`) controls the trade-off between file size and encoding speed. Higher values produce smaller files but take longer to encode. PNG compression is lossless, so quality is never affected.

```swift highlight-toPng-compressionLevel
let compressedBlob = try await engine.block.export(
  page,
  mimeType: .png,
  options: ExportOptions(pngCompressionLevel: 9),
)
```

- `0` — No compression, fastest encoding
- `5` — Balanced (default)
- `9` — Maximum compression, slowest encoding

### Target Dimensions

Specify `targetWidth` and `targetHeight` together to export at exact dimensions. The output fills the target size while maintaining aspect ratio.

```swift highlight-toPng-targetSize
let sizedBlob = try await engine.block.export(
  page,
  mimeType: .png,
  options: ExportOptions(targetWidth: 1920, targetHeight: 1080),
)
```

If the target aspect ratio differs from the block's aspect ratio, the output extends beyond the target on one axis to preserve proportions.

## Save to File System

The returned `Blob` is a `Data` value, so writing it to disk is a single call to `write(to:)`.

```swift highlight-toPng-saveFile
let outputURL = FileManager.default.temporaryDirectory.appendingPathComponent("export.png")
try blob.write(to: outputURL)
```

## When to Use PNG

PNG works well for:

- Graphics with sharp edges, text, and UI elements
- Designs that require transparency
- Logos, icons, and illustrations where pixel-perfect output matters

> **Note:** For photographs and images with smooth color gradients, JPEG or WebP usually produces smaller files. See [Export to JPEG](./to-jpeg.md) for the photo-friendly alternative.

## Troubleshooting

**File too large** — Increase `pngCompressionLevel` toward `9`, or reduce dimensions with `targetWidth` and `targetHeight`. For photographic content, switch to JPEG or WebP.

**Encoding feels slow** — Lower `pngCompressionLevel` toward `0`. The default `5` is balanced; `0` disables compression entirely for the fastest encode.

**Transparent areas appear black** — Ensure the page or block has a transparent background fill. PNG preserves alpha when the source block is transparent.

## API Reference

| Method                                     | Description                                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `engine.block.export(_:mimeType:options:)` | Export a block to the specified format                                                     |
| `engine.scene.load(from:)`                 | Load a scene from a URL (local or remote)                                                   |
| `engine.scene.getPages()`                  | Return all pages in the current scene                                                       |
| `ExportOptions`                            | Format-specific export configuration; PNG reads `pngCompressionLevel`, `targetWidth`, `targetHeight`, `allowTextOverhang` |

## Next Steps

- [Export Overview](./overview.md) — Compare all available export formats
- [Export to JPEG](./to-jpeg.md) — Use the photo-friendly format when transparency isn't needed
- [Partial Export](./partial-export.md) — Export specific blocks, groups, or page elements instead of entire scenes
- [Export with a Color Mask](./with-color-mask.md) — Remove specific colors and generate alpha masks during PNG export



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support