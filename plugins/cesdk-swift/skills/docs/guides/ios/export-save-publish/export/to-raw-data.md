> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To Raw Data](./to-raw-data.md)

---

Export CE.SDK designs to raw RGBA pixel data—ideal when you need direct pixel access for custom processing, Core Graphics rendering, or integration with imaging pipelines that bypass standard image encoders.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260903/engine-guides-export-to-raw-data)

```swift file=@cesdk_swift_examples/engine-guides-export-to-raw-data/ToRawData.swift reference-only
import CoreGraphics
import Foundation
import IMGLYEngine

@MainActor
func toRawData(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)

  let page = try engine.scene.getPages().first!
  let exportsDirectory = FileManager.default.temporaryDirectory

  let width = 1920
  let height = 1080
  let pixelData: Blob = try await engine.block.export(
    page,
    mimeType: .binary,
    options: ExportOptions(targetWidth: Float(width), targetHeight: Float(height)),
  )
  try pixelData.write(to: exportsDirectory.appendingPathComponent("design.rgba"))

  let centerX = width / 2
  let centerY = height / 2
  let centerIndex = (centerY * width + centerX) * 4
  let red = pixelData[centerIndex]
  let green = pixelData[centerIndex + 1]
  let blue = pixelData[centerIndex + 2]
  let alpha = pixelData[centerIndex + 3]
  print("Center pixel RGBA: \(red), \(green), \(blue), \(alpha)")

  let colorSpace = CGColorSpaceCreateDeviceRGB()
  let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue)
  let provider = CGDataProvider(data: pixelData as NSData)!
  let cgImage = CGImage(
    width: width,
    height: height,
    bitsPerComponent: 8,
    bitsPerPixel: 32,
    bytesPerRow: width * 4,
    space: colorSpace,
    bitmapInfo: bitmapInfo,
    provider: provider,
    decode: nil,
    shouldInterpolate: false,
    intent: .defaultIntent,
  )!

  let resizedOptions = ExportOptions(targetWidth: 960, targetHeight: 540)
  let resizedPixelData = try await engine.block.export(page, mimeType: .binary, options: resizedOptions)
  try resizedPixelData.write(to: exportsDirectory.appendingPathComponent("design.thumbnail.rgba"))

  let maxExportSize = try engine.editor.getMaxExportSize()
  print("Maximum export dimension: \(maxExportSize)px")

  _ = cgImage
}
```

This guide covers exporting to raw RGBA bytes, reading individual pixels, converting the data to a `CGImage`, and controlling the output resolution.

## When to Use Raw Data Export

Raw pixel data export gives you direct access to uncompressed RGBA bytes, with complete control over individual pixels for custom processing.

Reach for raw data when you need pixel-level access for custom algorithms or integrations. For standard image delivery, use PNG or JPEG instead—they apply compression and are ready to display or persist without additional work.

## Understanding Raw Data Format

When you export with `MIMEType.binary`, CE.SDK returns a `Blob` (a typealias for `Data`) containing uncompressed RGBA pixel data:

- **4 bytes per pixel** representing Red, Green, Blue, and Alpha channels
- **Values from 0–255** for each channel (8-bit unsigned integers)
- **Row-major order** with pixels arranged left-to-right, top-to-bottom
- **Total size** equals width × height × 4 bytes

## How to Export Raw Data

Export a block as raw pixel data by calling `engine.block.export(_:mimeType:options:)` with `.binary` as the MIME type. To make the returned buffer's dimensions deterministic, pair the call with `targetWidth` and `targetHeight` on `ExportOptions`—those values define the output pixel size exactly, so the `width × height × 4` formula always describes the buffer.

The example below targets 1920×1080. Pick whatever pixel size your downstream pipeline expects.

```swift highlight-toRawData-export
let width = 1920
let height = 1080
let pixelData: Blob = try await engine.block.export(
  page,
  mimeType: .binary,
  options: ExportOptions(targetWidth: Float(width), targetHeight: Float(height)),
)
try pixelData.write(to: exportsDirectory.appendingPathComponent("design.rgba"))
```

The returned `Blob` is a `Data` value containing the RGBA buffer; the rest of this guide reads, transforms, and re-encodes it.

## Download Exported Data

Once you have the raw bytes, you can inspect them directly, hand them to Core Graphics, or re-encode them to a standard image format. Because `Blob` is just `Data`, all of Swift's existing data-handling APIs work without an intermediate decode step.

### Read Individual Pixels

Index into the buffer at `(y * width + x) * 4`. The four bytes at that offset are Red, Green, Blue, and Alpha respectively—useful for color sampling, brightness analysis, custom filters, or feeding pixels into a machine-learning pipeline.

```swift highlight-toRawData-readPixels
let centerX = width / 2
let centerY = height / 2
let centerIndex = (centerY * width + centerX) * 4
let red = pixelData[centerIndex]
let green = pixelData[centerIndex + 1]
let blue = pixelData[centerIndex + 2]
let alpha = pixelData[centerIndex + 3]
print("Center pixel RGBA: \(red), \(green), \(blue), \(alpha)")
```

### Convert to a CGImage

To display the raw bytes or hand them to other Apple imaging APIs, wrap the buffer in a `CGDataProvider` and construct a `CGImage` directly. No PNG decode step is needed because the data is already pre-decoded RGBA.

The buffer's alpha is **premultiplied**—each color channel is already scaled by the alpha value—so pass `CGImageAlphaInfo.premultipliedLast` when constructing the `CGImage`. Using `.last` (straight alpha) would composite translucent pixels too dark.

```swift highlight-toRawData-toCGImage
let colorSpace = CGColorSpaceCreateDeviceRGB()
let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue)
let provider = CGDataProvider(data: pixelData as NSData)!
let cgImage = CGImage(
  width: width,
  height: height,
  bitsPerComponent: 8,
  bitsPerPixel: 32,
  bytesPerRow: width * 4,
  space: colorSpace,
  bitmapInfo: bitmapInfo,
  provider: provider,
  decode: nil,
  shouldInterpolate: false,
  intent: .defaultIntent,
)!
```

Pass `cgImage` to an image type to display the result, or to `CGImageDestination` to re-encode it as PNG, JPEG, or any other format supported by ImageIO.

## Performance Considerations

Raw RGBA data grows linearly with pixel count: a 1920×1080 export consumes about 8.3 MB, compared to 1–3 MB for the same scene exported as PNG. Two settings on the engine help keep memory usage bounded.

### Reduce the Export Resolution

Pass `targetWidth` and `targetHeight` on `ExportOptions` to render at a smaller resolution while preserving the block's aspect ratio. Both fields default to `0`, which disables the override—setting either field activates the target-size path.

```swift highlight-toRawData-targetSize
let resizedOptions = ExportOptions(targetWidth: 960, targetHeight: 540)
let resizedPixelData = try await engine.block.export(page, mimeType: .binary, options: resizedOptions)
try resizedPixelData.write(to: exportsDirectory.appendingPathComponent("design.thumbnail.rgba"))
```

### Check Export Size Limits

Before exporting very large blocks, query the engine for the maximum supported dimension. `getMaxExportSize()` returns the side length cap (in pixels) for either width or height. Use it to clamp `targetWidth`/`targetHeight` ahead of time and avoid failures during export.

```swift highlight-toRawData-checkLimits
let maxExportSize = try engine.editor.getMaxExportSize()
print("Maximum export dimension: \(maxExportSize)px")
```

### When to Use Raw vs. Compressed

- **Use raw data** when you need custom post-processing on CE.SDK exports before delivery
- **Use raw data** for intermediate steps in multi-stage pipelines, or for GPU uploads that would otherwise pay a PNG decode cost
- **Use PNG or JPEG** when the output is going straight to disk, the user, or a network—compressed formats are smaller and ready to display
- **Reach for `CGImage` and ImageIO** when you want a familiar Apple API surface; reach for raw RGBA when your code needs the bytes themselves

## API Reference

| API | Description |
| --- | --- |
| `engine.block.export(_:mimeType:options:)` | Export a block; pass `.binary` for raw RGBA data |
| `MIMEType.binary` | The `application/octet-stream` MIME type that selects the raw RGBA pipeline |
| `ExportOptions` | Configures `targetWidth` and `targetHeight` to control the output resolution |
| `engine.editor.getMaxExportSize()` | Returns the maximum supported export side length in pixels |

## Next Steps

- [Export Overview](./overview.md) — Compare all available export formats
- [Export to PNG](./to-png.md) — Compressed image export with transparency
- [Export to JPEG](./to-jpeg.md) — Lossy compression for photographs
- [Export to PDF](./to-pdf.md) — Vector export for print and document workflows
- [Partial Export](./partial-export.md) — Export specific blocks, groups, or pages instead of the whole scene



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support