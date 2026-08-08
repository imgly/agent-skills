> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [Overview](./overview.md)

---

Export your designs to multiple formats including PNG, JPEG, WebP, SVG, PDF,
MP4, and WAV. CE.SDK handles all export processing on-device, giving you
fine-grained control over format-specific options like compression, quality,
and target dimensions.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/engine-guides-export-overview)

Whether you're building a design tool, photo editor, or batch rendering pipeline, understanding export options helps you deliver the right output for each use case. This guide covers the supported formats, their options, and how to export programmatically.

```swift file=@cesdk_swift_examples/engine-guides-export-overview/ExportOverview.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func exportOverview(engine: Engine) async throws {
  // Demo scaffolding: build a two-page scene with renderable content so every
  // highlighted snippet has something to export. In your app you would start
  // from a scene already loaded into the editor instead.
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.setDuration(page, duration: 1.0)
  try engine.block.appendChild(to: scene, child: page)

  let rectangle = try engine.block.create(.graphic)
  try engine.block.setShape(rectangle, shape: engine.block.createShape(.rect))
  let rectangleFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    rectangleFill,
    property: "fill/color/value",
    color: .rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0),
  )
  try engine.block.setFill(rectangle, fill: rectangleFill)
  try engine.block.setPositionX(rectangle, value: 100)
  try engine.block.setPositionY(rectangle, value: 100)
  try engine.block.setWidth(rectangle, value: 600)
  try engine.block.setHeight(rectangle, value: 400)
  try engine.block.appendChild(to: page, child: rectangle)

  let secondPage = try engine.block.create(.page)
  try engine.block.setWidth(secondPage, value: 800)
  try engine.block.setHeight(secondPage, value: 600)
  try engine.block.setDuration(secondPage, duration: 1.0)
  try engine.block.appendChild(to: scene, child: secondPage)

  let ellipse = try engine.block.create(.graphic)
  try engine.block.setShape(ellipse, shape: engine.block.createShape(.ellipse))
  let ellipseFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    ellipseFill,
    property: "fill/color/value",
    color: .rgba(r: 0.95, g: 0.2, b: 0.2, a: 1.0),
  )
  try engine.block.setFill(ellipse, fill: ellipseFill)
  try engine.block.setPositionX(ellipse, value: 100)
  try engine.block.setPositionY(ellipse, value: 100)
  try engine.block.setWidth(ellipse, value: 600)
  try engine.block.setHeight(ellipse, value: 400)
  try engine.block.appendChild(to: secondPage, child: ellipse)

  // Audio block backed by an in-memory buffer so the audio export below has
  // something to read without making a network request.
  let audioBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: audioBlock)
  let audioBuffer = engine.editor.createBuffer()
  try engine.editor.setBufferLength(url: audioBuffer, length: 96000)
  try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioBuffer)

  let exportsDirectory = FileManager.default.temporaryDirectory

  let pngOptions = ExportOptions(pngCompressionLevel: 9)
  let pngBlob = try await engine.block.export(page, mimeType: .png, options: pngOptions)
  try pngBlob.write(to: exportsDirectory.appendingPathComponent("design.png"))

  let jpegOptions = ExportOptions(jpegQuality: 0.9)
  let jpegBlob = try await engine.block.export(page, mimeType: .jpeg, options: jpegOptions)
  try jpegBlob.write(to: exportsDirectory.appendingPathComponent("design.jpg"))

  let webpOptions = ExportOptions(webpQuality: 1.0)
  let webpBlob = try await engine.block.export(page, mimeType: .webp, options: webpOptions)
  try webpBlob.write(to: exportsDirectory.appendingPathComponent("design.webp"))

  let svgBlob = try await engine.block.export(page, mimeType: .svg)
  try svgBlob.write(to: exportsDirectory.appendingPathComponent("design.svg"))

  let pdfOptions = ExportOptions(exportPdfWithHighCompatibility: true)
  let pdfBlob = try await engine.block.export(page, mimeType: .pdf, options: pdfOptions)
  try pdfBlob.write(to: exportsDirectory.appendingPathComponent("design.pdf"))

  let maskedBlobs = try await engine.block.exportWithColorMask(
    page,
    mimeType: .png,
    maskColorR: 1.0,
    maskColorG: 0.0,
    maskColorB: 0.0,
  )
  try maskedBlobs[0].write(to: exportsDirectory.appendingPathComponent("design.masked.png"))
  try maskedBlobs[1].write(to: exportsDirectory.appendingPathComponent("design.alpha.png"))

  let videoOptions = VideoExportOptions(
    h264Profile: .main,
    framerate: 30,
    targetWidth: 1280,
    targetHeight: 720,
  )
  let videoStream = try await engine.block.exportVideo(page, mimeType: .mp4, options: videoOptions)
  for try await event in videoStream {
    switch event {
    case let .progress(rendered, encoded, total):
      print("Video export: \(encoded)/\(total) frames encoded (\(rendered) rendered)")
    case let .finished(video):
      try video.write(to: exportsDirectory.appendingPathComponent("design.mp4"))
    }
  }

  let audioOptions = AudioExportOptions(skipEncoding: true)
  let audioStream = try await engine.block.exportAudio(audioBlock, mimeType: .wav, options: audioOptions)
  for try await event in audioStream {
    if case let .finished(audio) = event {
      try audio.write(to: exportsDirectory.appendingPathComponent("design.wav"))
    }
  }

  let resizedOptions = ExportOptions(targetWidth: 1080, targetHeight: 1080)
  let resizedBlob = try await engine.block.export(page, mimeType: .png, options: resizedOptions)
  try resizedBlob.write(to: exportsDirectory.appendingPathComponent("design.1080.png"))

  let maxExportSize = try engine.editor.getMaxExportSize()
  let availableMemory = try? engine.editor.getAvailableMemory()
  print("Max export size: \(maxExportSize)px")
  if let availableMemory {
    print("Available memory: \(availableMemory) bytes")
  }
}
```

## Supported Export Formats

CE.SDK supports exporting scenes, pages, groups, or individual blocks in these formats:

| Format | MIME Type                  | Transparency   | Best For                                          |
| ------ | -------------------------- | -------------- | ------------------------------------------------- |
| PNG    | `image/png`                | Yes            | Web graphics, UI elements, logos                  |
| JPEG   | `image/jpeg`               | No             | Photographs, web images                           |
| WebP   | `image/webp`               | Yes (lossless) | Smaller files than PNG with comparable fidelity   |
| SVG    | `image/svg+xml`            | Yes            | Scalable graphics, post-processing                |
| PDF    | `application/pdf`          | Partial        | Print, documents                                  |
| MP4    | `video/mp4`                | No             | Animated content                                  |
| WAV    | `audio/wav`                | —              | Lossless audio                                    |
| Binary | `application/octet-stream` | Yes            | Raw RGBA8888 data for further processing          |

Each format serves different purposes. PNG preserves transparency and works well for graphics with sharp edges or text. JPEG compresses photographs efficiently but drops transparency. WebP provides excellent compression with optional lossless mode. SVG produces scalable vector output ideal for post-processing with standard SVG tooling. PDF preserves vector information for print workflows. MP4 exports animated content as H.264 video, and WAV exports lossless audio tracks.

## Export Images

### Export to PNG

PNG export uses lossless compression with a configurable compression level. Higher compression produces smaller files but takes longer to encode. Quality is not affected.

```swift highlight-exportOverview-png
let pngOptions = ExportOptions(pngCompressionLevel: 9)
let pngBlob = try await engine.block.export(page, mimeType: .png, options: pngOptions)
try pngBlob.write(to: exportsDirectory.appendingPathComponent("design.png"))
```

The `pngCompressionLevel` ranges from 0 (no compression, fastest) to 9 (maximum compression, slowest). The default is 5, which balances file size and encoding speed.

### Export to JPEG

JPEG export uses lossy compression controlled by the quality setting. Lower quality produces smaller files but introduces visible artifacts.

```swift highlight-exportOverview-jpeg
let jpegOptions = ExportOptions(jpegQuality: 0.9)
let jpegBlob = try await engine.block.export(page, mimeType: .jpeg, options: jpegOptions)
try jpegBlob.write(to: exportsDirectory.appendingPathComponent("design.jpg"))
```

The `jpegQuality` ranges from 0 to 1. Values above 0.9 provide excellent quality for most use cases. The default is 0.9.

> **Caution:** JPEG drops transparency from exports. Transparent areas render with a solid background, which may produce unexpected results for designs that rely on alpha channels.

### Export to WebP

WebP provides better compression than PNG or JPEG. A quality of 1.0 enables lossless mode.

```swift highlight-exportOverview-webp
let webpOptions = ExportOptions(webpQuality: 1.0)
let webpBlob = try await engine.block.export(page, mimeType: .webp, options: webpOptions)
try webpBlob.write(to: exportsDirectory.appendingPathComponent("design.webp"))
```

The `webpQuality` ranges from 0 to 1. At 1.0, WebP uses lossless compression that typically produces smaller files than equivalent PNG exports.

### Export to SVG

SVG export produces scalable vector graphics that integrate with standard SVG tooling and scale to any resolution without quality loss.

```swift highlight-exportOverview-svg
let svgBlob = try await engine.block.export(page, mimeType: .svg)
try svgBlob.write(to: exportsDirectory.appendingPathComponent("design.svg"))
```

Text is exported as vector paths to ensure consistent rendering without requiring the original fonts. Shapes, strokes, and gradients are exported as native SVG elements.

> **Note:** Drop shadows, blur, effects (filters, adjustments), and raster images cannot be represented as native SVG vector elements. These features are rasterized and embedded as PNG images within the SVG. This preserves visual fidelity but increases file size and means those parts of the output are not scalable.

> **Note:** SVG export renders a single page. To export a multi-page scene, export each page individually.

### Image Export Options

| Option                | Type    | Default | Description                                                          |
| --------------------- | ------- | ------- | -------------------------------------------------------------------- |
| `pngCompressionLevel` | `Int`   | `5`     | PNG compression level (0–9). Higher = smaller file, slower encoding. |
| `jpegQuality`         | `Float` | `0.9`   | JPEG quality (0–1). Higher = better quality, larger file.            |
| `webpQuality`         | `Float` | `1.0`   | WebP quality (0–1). Set to `1.0` for lossless compression.           |
| `targetWidth`         | `Float` | `0`     | Target output width in pixels. `0` keeps the block's natural width.  |
| `targetHeight`        | `Float` | `0`     | Target output height in pixels. `0` keeps the block's natural height.|
| `allowTextOverhang`   | `Bool`  | `false` | Include text bounding boxes that account for glyph overhangs.        |

## Export PDF

PDF export preserves vector information and supports print workflows. The high compatibility option rasterizes images and effects for broader viewer support.

```swift highlight-exportOverview-pdf
let pdfOptions = ExportOptions(exportPdfWithHighCompatibility: true)
let pdfBlob = try await engine.block.export(page, mimeType: .pdf, options: pdfOptions)
try pdfBlob.write(to: exportsDirectory.appendingPathComponent("design.pdf"))
```

When `exportPdfWithHighCompatibility` is `true` (the default), images and effects are rasterized according to the scene's DPI setting. Set it to `false` for faster exports, though gradients with transparency may not render correctly in some PDF viewers.

The underlayer options are useful for print workflows where you need a solid base layer (often white ink) beneath the design. The `underlayerSpotColorName` should match a spot color defined in your print workflow.

### PDF Export Options

| Option                           | Type     | Default | Description                                                                                                    |
| -------------------------------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `exportPdfWithHighCompatibility` | `Bool`   | `true`  | Rasterize images and effects (like gradients) according to the scene's DPI setting for broader viewer support. |
| `exportPdfWithUnderlayer`        | `Bool`   | `false` | Add an underlayer behind existing elements matching the shape of page content.                                 |
| `underlayerSpotColorName`        | `String` | `""`    | Spot color name for the underlayer fill (used with print workflows).                                           |
| `underlayerOffset`               | `Float`  | `0`     | Size adjustment for the underlayer shape in design units.                                                      |
| `underlayerRenderRatio`          | `Float`  | `1.0`   | Resolution multiplier for the raster pass that extracts the underlayer contour.                                |
| `underlayerMaxError`             | `Float`  | `2.0`   | Maximum acceptable curve-fit error, in pixels, when vectorising the underlayer contour. Smaller = tighter fit. |
| `targetWidth`                    | `Float`  | `0`     | Target output width in pixels.                                                                                 |
| `targetHeight`                   | `Float`  | `0`     | Target output height in pixels.                                                                                |

## Export with Color Mask

Color mask export removes pixels matching a specific RGB color and returns two outputs: the masked image with transparency applied, and an alpha mask showing which pixels were removed.

```swift highlight-exportOverview-colorMask
let maskedBlobs = try await engine.block.exportWithColorMask(
  page,
  mimeType: .png,
  maskColorR: 1.0,
  maskColorG: 0.0,
  maskColorB: 0.0,
)
try maskedBlobs[0].write(to: exportsDirectory.appendingPathComponent("design.masked.png"))
try maskedBlobs[1].write(to: exportsDirectory.appendingPathComponent("design.alpha.png"))
```

`exportWithColorMask` accepts the block to export, three RGB color components in the 0.0–1.0 range, and optional export options. RGB values use floating-point notation where 1.0 equals 255 in standard color notation.

Common mask colors for print workflows:

- Pure red: `(1.0, 0.0, 0.0)` — Registration marks
- Pure magenta: `(1.0, 0.0, 1.0)` — Distinctive marker color
- Pure cyan: `(0.0, 1.0, 1.0)` — Alternative marker color

The method returns an array of two `Blob` values: the masked image (with matched pixels made transparent) and the alpha mask (black pixels for removed areas, white for retained areas).

> **Note:** Color matching is exact. Only pixels with RGB values precisely matching the specified color are removed. Anti-aliased edges or color variations are not affected.

### Color Mask Export Options

`exportWithColorMask` accepts the same options as image export:

| Option                | Type    | Default | Description                                              |
| --------------------- | ------- | ------- | -------------------------------------------------------- |
| `pngCompressionLevel` | `Int`   | `5`     | PNG compression level (0–9).                             |
| `jpegQuality`         | `Float` | `0.9`   | JPEG quality (0–1).                                      |
| `webpQuality`         | `Float` | `1.0`   | WebP quality (0–1).                                      |
| `targetWidth`         | `Float` | `0`     | Target output width in pixels.                           |
| `targetHeight`        | `Float` | `0`     | Target output height in pixels.                          |

## Export Video

Video export uses the H.264 codec and outputs MP4 files. `exportVideo` returns an `AsyncThrowingStream<VideoExport, Error>` that yields `.progress` events while encoding and a final `.finished(video:)` event with the encoded data. On iOS the export is automatically suspended when the app moves to the background and resumed when it returns to the foreground.

```swift highlight-exportOverview-video
let videoOptions = VideoExportOptions(
  h264Profile: .main,
  framerate: 30,
  targetWidth: 1280,
  targetHeight: 720,
)
let videoStream = try await engine.block.exportVideo(page, mimeType: .mp4, options: videoOptions)
for try await event in videoStream {
  switch event {
  case let .progress(rendered, encoded, total):
    print("Video export: \(encoded)/\(total) frames encoded (\(rendered) rendered)")
  case let .finished(video):
    try video.write(to: exportsDirectory.appendingPathComponent("design.mp4"))
  }
}
```

### Video Export Options

| Option              | Type          | Default      | Description                                                                       |
| ------------------- | ------------- | ------------ | --------------------------------------------------------------------------------- |
| `h264Profile`       | `H264Profile` | `.main`      | Encoder profile: `.baseline` (66), `.main` (77), `.extended` (88), `.high` (100). |
| `h264Level`         | `Int32`       | `52`         | Encoding level (multiply desired level by 10, e.g., `52` for level 5.2).          |
| `videoBitrate`      | `Int32`       | `VideoBitrate.system` | Video bitrate in bits/second, or a named automatic mode. `VideoBitrate.system` (`0`, the default) lets VideoToolbox choose; `VideoBitrate.auto` (`-1`) picks a bounded, resolution-aware bitrate. A positive number sets an explicit bitrate (maximum determined by profile and level). |
| `audioBitrate`      | `Int32`       | `0` (auto)   | Audio bitrate in bits/second. `0` defaults to 128 kbps for stereo AAC.            |
| `framerate`         | `Float`       | `30`         | Target framerate in Hz.                                                           |
| `targetWidth`       | `Float`       | `0`          | Output width in pixels.                                                           |
| `targetHeight`      | `Float`       | `0`          | Output height in pixels.                                                          |
| `timeOffset`        | `Double`      | `0`          | Start time offset in seconds.                                                     |
| `duration`          | `Double`      | block length | Video duration in seconds. `0` defaults to the duration of the exported page.     |
| `allowTextOverhang` | `Bool`        | `false`      | Include text bounding boxes that account for glyph overhangs.                     |

The `h264Profile` determines encoder quality and compatibility:

- **Baseline (66)**: Broadest device compatibility, lowest quality.
- **Main (77)**: Good balance of quality and compatibility (default).
- **High (100)**: Best quality, may not play on older devices.

The `videoBitrate` option accepts a positive number (explicit bits per second) or one of two named modes. `VideoBitrate.system` (`0`, the default) lets the platform encoder (VideoToolbox) choose. `VideoBitrate.auto` (`-1`) selects a bounded bitrate derived from the output resolution and framerate (for example 5 Mbps at 720p30, 8 Mbps at 1080p30, 12 Mbps at 1080p60, 40 Mbps at 4K30), consistent across platforms.

> **Caution:** H.264 does not support transparency. Transparent areas render with a black background.

## Export Audio

Export audio tracks from pages or audio blocks. Supported MIME types are `.wav` (uncompressed) and `.mp4` (AAC encoded). `exportAudio` returns an `AsyncThrowingStream<AudioExport, Error>` that yields `.progress` events while encoding and a final `.finished(audio:)` event with the encoded data.

The example below sets `skipEncoding: true` to return the raw PCM buffer directly; set it to `false` (the default) to receive a fully encoded WAV file.

```swift highlight-exportOverview-audio
let audioOptions = AudioExportOptions(skipEncoding: true)
let audioStream = try await engine.block.exportAudio(audioBlock, mimeType: .wav, options: audioOptions)
for try await event in audioStream {
  if case let .finished(audio) = event {
    try audio.write(to: exportsDirectory.appendingPathComponent("design.wav"))
  }
}
```

### Audio Export Options

| Option             | Type     | Default      | Description                                                                                  |
| ------------------ | -------- | ------------ | -------------------------------------------------------------------------------------------- |
| `sampleRate`       | `Int32`  | `48000`      | Sample rate in Hz.                                                                           |
| `numberOfChannels` | `Int32`  | `2`          | Number of audio channels (`1` mono, `2` stereo).                                             |
| `timeOffset`       | `Double` | `0`          | Start time offset in seconds, relative to the block.                                         |
| `duration`         | `Double` | block length | Audio duration in seconds. `0` defaults to the duration of the exported block.               |
| `skipEncoding`     | `Bool`   | `false`      | Return raw audio data without encoding to the target MIME type.                              |

Use `.wav` for lossless quality when file size is not a concern. Use `.mp4` (AAC) for compressed output.

> **Note:** Audio export extracts and processes audio from all audio-capable blocks within the target block, including video fills with audio tracks and standalone audio blocks.

## Target Size Control

You can export at specific dimensions regardless of the block's actual size. The `targetWidth` and `targetHeight` options render the block large enough to fill the target size while maintaining aspect ratio.

```swift highlight-exportOverview-targetSize
let resizedOptions = ExportOptions(targetWidth: 1080, targetHeight: 1080)
let resizedBlob = try await engine.block.export(page, mimeType: .png, options: resizedOptions)
try resizedBlob.write(to: exportsDirectory.appendingPathComponent("design.1080.png"))
```

If the target aspect ratio differs from the block's aspect ratio, the output fills the target dimensions completely. The output may extend beyond the target size on one axis to preserve correct proportions.

## Device Export Limits

Before exporting large designs, check the device's export capabilities. Memory constraints or GPU limitations may prevent exports that exceed certain dimensions.

```swift highlight-exportOverview-checkLimits
let maxExportSize = try engine.editor.getMaxExportSize()
let availableMemory = try? engine.editor.getAvailableMemory()
print("Max export size: \(maxExportSize)px")
if let availableMemory {
  print("Available memory: \(availableMemory) bytes")
}
```

`getMaxExportSize()` returns the maximum width or height in pixels. Both dimensions of every export must stay at or below this limit. `getAvailableMemory()` returns available memory in bytes, helping you assess whether large exports are feasible.

> **Note:** The max export size is an upper bound. Exports may still fail due to memory constraints even when within size limits. For high-resolution exports, consider checking available memory first. `getAvailableMemory()` is unavailable on the iOS Simulator — guard the call with `try?` and treat the result as optional.

## API Reference

| Method                               | Description                                                                                  |
| ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `engine.block.export()`              | Export a block with format and quality options.                                              |
| `engine.block.exportWithColorMask()` | Export a block with a specific RGB color removed, returning the masked image and alpha mask. |
| `engine.block.exportVideo()`         | Export a page as MP4 video with encoding options and progress events.                        |
| `engine.block.exportAudio()`         | Export audio from a page or audio block as WAV or AAC-encoded MP4.                           |
| `engine.editor.getMaxExportSize()`   | Get the maximum export dimension in pixels supported by the device.                          |
| `engine.editor.getAvailableMemory()` | Get the currently available memory in bytes.                                                 |



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support