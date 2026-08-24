> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To WebP](./to-webp.md)

---

Export CE.SDK designs to WebP format for compact image files that preserve transparency, with a single quality knob spanning lossy and lossless modes.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0/engine-guides-export-to-webp)

WebP delivers smaller files than PNG while preserving transparency, and smaller files than JPEG at comparable quality. Use it when bandwidth or storage matters and the output stays inside a WebP-aware viewer.

```swift file=@cesdk_swift_examples/engine-guides-export-to-webp/ToWebp.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func toWebp(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)

  let page = try engine.scene.getPages().first!

  let blob: Blob = try await engine.block.export(
    page,
    mimeType: .webp,
    options: ExportOptions(webpQuality: 0.8),
  )

  let losslessBlob = try await engine.block.export(
    page,
    mimeType: .webp,
    options: ExportOptions(webpQuality: 1.0),
  )

  let sizedBlob = try await engine.block.export(
    page,
    mimeType: .webp,
    options: ExportOptions(
      webpQuality: 0.85,
      targetWidth: 1920,
      targetHeight: 1080,
    ),
  )

  let outputURL = FileManager.default.temporaryDirectory.appendingPathComponent("export.webp")
  try blob.write(to: outputURL)

  _ = losslessBlob
  _ = sizedBlob
}
```

This guide covers exporting to WebP, configuring quality, resizing the output, and saving the result to disk.

## Export to WebP

Export a design block by calling `engine.block.export(_:mimeType:options:)` with `.webp` as the MIME type. The call returns a `Blob` (a `Data` value) containing the encoded image. The `webpQuality` field on `ExportOptions` controls compression — `0.8` is a good starting point for web delivery.

```swift highlight-toWebp-exportWebp
let blob: Blob = try await engine.block.export(
  page,
  mimeType: .webp,
  options: ExportOptions(webpQuality: 0.8),
)
```

Pass a page returned by `engine.scene.getPages()`, or any other block ID, to export specific elements.

## Export Options

WebP export reads these fields from `ExportOptions`:

| Option         | Type    | Default | Description                                                                          |
| -------------- | ------- | ------- | ------------------------------------------------------------------------------------ |
| `webpQuality`  | `Float` | `1.0`   | Quality from just above `0` to `1.0`. `1.0` switches the encoder to lossless mode    |
| `targetWidth`  | `Float` | `0`     | Output width in pixels. Used together with `targetHeight`; `0` disables the override |
| `targetHeight` | `Float` | `0`     | Output height in pixels. Used together with `targetWidth`; `0` disables the override |

### Lossless Compression

Set `webpQuality` to `1.0` to switch the encoder to its lossless mode. WebP's lossless encoding usually produces smaller files than PNG while preserving every pixel.

```swift highlight-toWebp-lossless
let losslessBlob = try await engine.block.export(
  page,
  mimeType: .webp,
  options: ExportOptions(webpQuality: 1.0),
)
```

Values between `0.8` and `0.95` keep visual quality high while shrinking the file substantially. Lower values trade more visible quality for smaller files.

### Target Dimensions

Specify `targetWidth` and `targetHeight` together to export at exact dimensions. The output fills the target size while maintaining aspect ratio.

```swift highlight-toWebp-targetSize
let sizedBlob = try await engine.block.export(
  page,
  mimeType: .webp,
  options: ExportOptions(
    webpQuality: 0.85,
    targetWidth: 1920,
    targetHeight: 1080,
  ),
)
```

If the target aspect ratio differs from the block's aspect ratio, the output extends beyond the target on one axis to preserve proportions.

## Save to File System

The returned `Blob` is a `Data` value, so writing it to disk is a single call to `write(to:)`.

```swift highlight-toWebp-saveFile
let outputURL = FileManager.default.temporaryDirectory.appendingPathComponent("export.webp")
try blob.write(to: outputURL)
```

## Troubleshooting

**File still too large** — Lower `webpQuality` toward `0.5`–`0.7`, or reduce dimensions with `targetWidth` and `targetHeight`. Pure-photographic content compresses well at lower quality settings.

**Transparent areas appear opaque** — Verify the source page or block has a transparent background fill. WebP preserves alpha when the source block is transparent.

**Output looks degraded at high quality** — Switch to lossless by setting `webpQuality` to `1.0`. For graphics with sharp edges and text, lossless WebP avoids the smearing that lossy compression can introduce.

## API Reference

| Method                                     | Description                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| `engine.block.export(_:mimeType:options:)` | Export a block to the specified format                                     |
| `engine.scene.load(from:)`                 | Load a scene from a URL (local or remote)                                  |
| `engine.scene.getPages()`                  | Return all pages in the current scene                                      |
| `ExportOptions`                            | Format-specific export configuration; WebP reads `webpQuality`, `targetWidth`, `targetHeight` |

## Next Steps

- [Export Overview](./overview.md) — Compare all available export formats
- [Export to PDF](./to-pdf.md) — Generate print-ready PDF documents from your designs
- [Partial Export](./partial-export.md) — Export specific blocks, groups, or page elements instead of entire scenes
- [Export Size Limits](./size-limits.md) — Check device export limits before exporting large designs



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support