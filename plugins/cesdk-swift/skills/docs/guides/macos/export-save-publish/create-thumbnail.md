> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Export Media Assets](./export.md) > [Create Thumbnail](./create-thumbnail.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-thumbnail/CreateThumbnail.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createThumbnail(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  let outputDirectory = FileManager.default.temporaryDirectory

  // Demo scaffolding: build a design (a photo with a title banner) so the
  // exported thumbnails preview real content. In your app you start from a
  // scene the user is already editing.
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
  try await engine.scene.create(fromImage: imageURL)
  guard let designPage = try engine.scene.getCurrentPage() else {
    fatalError("Expected create(fromImage:) to create a page.")
  }
  // A design scene from an image keeps font sizes in points; pin them to pixels
  // so the title below is sized in the same unit as the page dimensions.
  try engine.scene.setFontSizeUnit(.px)
  let designWidth = try engine.block.getWidth(designPage)
  let designHeight = try engine.block.getHeight(designPage)

  let banner = try engine.block.create(.graphic)
  try engine.block.setShape(banner, shape: engine.block.createShape(.rect))
  let bannerFill = try engine.block.createFill(.color)
  try engine.block.setColor(bannerFill, property: "fill/color/value", color: .rgba(r: 0.05, g: 0.09, b: 0.16, a: 0.72))
  try engine.block.setFill(banner, fill: bannerFill)
  try engine.block.setWidth(banner, value: designWidth)
  try engine.block.setHeight(banner, value: designHeight * 0.22)
  try engine.block.setPositionX(banner, value: 0)
  try engine.block.setPositionY(banner, value: designHeight * 0.78)
  try engine.block.appendChild(to: designPage, child: banner)

  let title = try engine.block.create(.text)
  try engine.block.replaceText(title, text: "Coastal Escape")
  try engine.block.setTextColor(title, color: .rgba(r: 1, g: 1, b: 1, a: 1))
  try engine.block.setTextFontSize(title, fontSize: designHeight * 0.09)
  try engine.block.setHeightMode(title, mode: .auto)
  try engine.block.setWidth(title, value: designWidth * 0.86)
  try engine.block.setPositionX(title, value: designWidth * 0.07)
  try engine.block.setPositionY(title, value: designHeight * 0.84)
  try engine.block.appendChild(to: designPage, child: title)

  try await engine.captureGuide(designPage, label: "hero")

  let page = try engine.scene.getCurrentPage() ?? engine.scene.getPages().first
  guard let page else {
    fatalError("Load a scene with at least one page before exporting a thumbnail.")
  }

  let thumbnail = try await engine.block.export(
    page,
    mimeType: .jpeg,
    options: ExportOptions(targetWidth: 400, targetHeight: 300),
  )
  print("Thumbnail: \(thumbnail.count) bytes")

  let jpegThumbnail = try await engine.block.export(
    page,
    mimeType: .jpeg,
    options: ExportOptions(jpegQuality: 0.8, targetWidth: 400, targetHeight: 300),
  )
  print("JPEG thumbnail: \(jpegThumbnail.count) bytes")

  let pngThumbnail = try await engine.block.export(
    page,
    mimeType: .png,
    options: ExportOptions(pngCompressionLevel: 6, targetWidth: 400, targetHeight: 300),
  )
  print("PNG thumbnail: \(pngThumbnail.count) bytes")

  let webpThumbnail = try await engine.block.export(
    page,
    mimeType: .webp,
    options: ExportOptions(webpQuality: 0.85, targetWidth: 400, targetHeight: 300),
  )
  print("WebP thumbnail: \(webpThumbnail.count) bytes")

  let targetSizes: [(width: Float, height: Float)] = [(150, 150), (400, 300), (800, 600)]
  var responsiveSet: [Data] = []
  for size in targetSizes {
    let sized = try await engine.block.export(
      page,
      mimeType: .jpeg,
      options: ExportOptions(jpegQuality: 0.8, targetWidth: size.width, targetHeight: size.height),
    )
    responsiveSet.append(sized)
    print("\(Int(size.width))x\(Int(size.height)): \(sized.count) bytes")
  }

  let savedThumbnail = try await engine.block.export(
    page,
    mimeType: .jpeg,
    options: ExportOptions(jpegQuality: 0.8, targetWidth: 400, targetHeight: 300),
  )
  let fileURL = outputDirectory.appendingPathComponent("thumbnail.jpg")
  try savedThumbnail.write(to: fileURL)

  let videoScene = try engine.scene.createVideo()
  let videoPage = try engine.block.create(.page)
  try engine.block.appendChild(to: videoScene, child: videoPage)
  try engine.block.setWidth(videoPage, value: 1280)
  try engine.block.setHeight(videoPage, value: 720)
  try engine.block.setDuration(videoPage, duration: 10)

  let clip = try engine.block.create(.graphic)
  try engine.block.setShape(clip, shape: engine.block.createShape(.rect))
  let clipFill = try engine.block.createFill(.video)
  try engine.block.setURL(
    clipFill,
    property: "fill/video/fileURI",
    value: baseURL.appendingPathComponent(
      "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    ),
  )
  try engine.block.setFill(clip, fill: clipFill)
  try engine.block.setWidth(clip, value: 1280)
  try engine.block.setHeight(clip, value: 720)
  try engine.block.appendChild(to: videoPage, child: clip)

  try await engine.block.forceLoadAVResource(clipFill)
  if try engine.block.supportsPlaybackTime(videoPage) {
    try engine.block.setPlaybackTime(videoPage, time: 2.0)
  }

  let videoThumbnail = try await engine.block.export(
    videoPage,
    mimeType: .jpeg,
    options: ExportOptions(jpegQuality: 0.8, targetWidth: 400, targetHeight: 225),
  )
  try videoThumbnail.write(to: outputDirectory.appendingPathComponent("video-thumbnail.jpg"))
}
```

Generate small preview images from CE.SDK scenes for galleries, file browsers, and design management interfaces by exporting a page with target dimensions.

![An aerial coastal photo with a dark title banner and a white "Coastal Escape" heading — the source design that the thumbnails preview.](https://img.ly/docs/cesdk/macos/export-save-publish/create-thumbnail-749be1/assets/swift-based.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-rc.1/engine-guides-create-thumbnail)

<EngineReferenceNote {...props} />

Thumbnails use the same block export API as full-size image exports. Pass a page to `engine.block.export(_:mimeType:options:)`, choose an image `MIMEType`, and set target dimensions in `ExportOptions`. The call returns the image as `Data` that you can decode, cache, write to disk, or upload.

This guide focuses on static image thumbnails. It does not cover audio waveforms or multi-frame scrubber previews.

## Export a Thumbnail

Start from the current page so the thumbnail matches the visible canvas. When no page is selected, fall back to the first page in the loaded scene. Export the page block rather than an individual element to capture the full composited design.

```swift highlight-createThumbnail-selectPage
let page = try engine.scene.getCurrentPage() ?? engine.scene.getPages().first
guard let page else {
  fatalError("Load a scene with at least one page before exporting a thumbnail.")
}
```

Call `engine.block.export(_:mimeType:options:)` with `targetWidth` and `targetHeight` set together. CE.SDK renders the page large enough to fill the target box while preserving its aspect ratio, so the output may extend beyond one axis when the source aspect ratio differs.

```swift highlight-createThumbnail-export
let thumbnail = try await engine.block.export(
  page,
  mimeType: .jpeg,
  options: ExportOptions(targetWidth: 400, targetHeight: 300),
)
print("Thumbnail: \(thumbnail.count) bytes")
```

The returned `Data` is raw image bytes in the requested format — nothing is written to disk until you do so yourself.

## Choose a Thumbnail Format

Select the format with the `mimeType` argument, using the `MIMEType` case that fits the UI surface where you display the thumbnail:

- **`.jpeg`** — Smaller files for photographic content, tuned with `jpegQuality`.
- **`.png`** — Lossless output with transparency support, tuned with `pngCompressionLevel`.
- **`.webp`** — Efficient compression with both lossless and lossy modes, tuned with `webpQuality`.

### JPEG Thumbnails

JPEG works well for most gallery and list previews. Values around `0.8` usually balance image quality and file size for thumbnails.

```swift highlight-createThumbnail-jpeg
let jpegThumbnail = try await engine.block.export(
  page,
  mimeType: .jpeg,
  options: ExportOptions(jpegQuality: 0.8, targetWidth: 400, targetHeight: 300),
)
print("JPEG thumbnail: \(jpegThumbnail.count) bytes")
```

### PNG Thumbnails

PNG preserves transparency and lossless quality. Increase `pngCompressionLevel` when smaller files matter more than encoding speed — compression affects speed, not quality.

```swift highlight-createThumbnail-png
let pngThumbnail = try await engine.block.export(
  page,
  mimeType: .png,
  options: ExportOptions(pngCompressionLevel: 6, targetWidth: 400, targetHeight: 300),
)
print("PNG thumbnail: \(pngThumbnail.count) bytes")
```

### WebP Thumbnails

WebP offers efficient compression. A `webpQuality` of `1.0` produces lossless output; lower values enable lossy compression for smaller files.

```swift highlight-createThumbnail-webp
let webpThumbnail = try await engine.block.export(
  page,
  mimeType: .webp,
  options: ExportOptions(webpQuality: 0.85, targetWidth: 400, targetHeight: 300),
)
print("WebP thumbnail: \(webpThumbnail.count) bytes")
```

## Common Thumbnail Sizes

Use target boxes that match the destination UI instead of exporting full-resolution artwork and scaling it afterward. `targetWidth` and `targetHeight` define the box CE.SDK fills, not the guaranteed exact output dimensions — when the source aspect ratio differs, the thumbnail may exceed one axis while preserving that ratio.

| Size | Target box | Use case |
| ---- | ---------- | -------- |
| Small | 150 x 150 | Dense grids and file browsers |
| Medium | 400 x 300 | Preview cards and detail lists |
| Large | 800 x 600 | Larger preview panels |

## Generate Multiple Sizes

Create a responsive thumbnail set by exporting the same page with different dimensions. This keeps each asset close to the size your UI needs.

```swift highlight-createThumbnail-multiple
let targetSizes: [(width: Float, height: Float)] = [(150, 150), (400, 300), (800, 600)]
var responsiveSet: [Data] = []
for size in targetSizes {
  let sized = try await engine.block.export(
    page,
    mimeType: .jpeg,
    options: ExportOptions(jpegQuality: 0.8, targetWidth: size.width, targetHeight: size.height),
  )
  responsiveSet.append(sized)
  print("\(Int(size.width))x\(Int(size.height)): \(sized.count) bytes")
}
```

Batching several sizes together also makes it easier to cache or upload them as a group in your app code.

## Save a Thumbnail

Exporting produces in-memory image `Data`. To persist a thumbnail, write it to a file in your app's cache or documents directory with `Data`'s `write(to:)`.

```swift highlight-createThumbnail-save
let savedThumbnail = try await engine.block.export(
  page,
  mimeType: .jpeg,
  options: ExportOptions(jpegQuality: 0.8, targetWidth: 400, targetHeight: 300),
)
let fileURL = outputDirectory.appendingPathComponent("thumbnail.jpg")
try savedThumbnail.write(to: fileURL)
```

Writing to a caller-provided file keeps your app in control of storage lifetime, cleanup, and sharing.

## Optimize Thumbnail Quality

Tune the format-specific `ExportOptions` fields to balance file size, quality, and export time.

| Format | Option | Range | Default | Notes |
| ------ | ------ | ----- | ------- | ----- |
| JPEG | `jpegQuality` | `(0, 1]` | `0.9` | Lower values reduce file size and may add visible artifacts. |
| PNG | `pngCompressionLevel` | `0`–`9` | `5` | Higher values reduce file size but encode more slowly. |
| WebP | `webpQuality` | `(0, 1]` | `1.0` | `1.0` is lossless; lower values enable lossy compression. |

For thumbnails, start with JPEG quality around `0.8` or WebP quality around `0.75`–`0.85`, then adjust based on your UI and storage constraints.

## Thumbnails from Video Blocks

Exporting a page that contains a video fill captures the page's current frame as a single still image. Seek the timeline with `setPlaybackTime(_:time:)` before exporting to choose which frame becomes the thumbnail. Load the video first with `forceLoadAVResource(_:)` so the frame is available.

```swift highlight-createThumbnail-video
  let videoScene = try engine.scene.createVideo()
  let videoPage = try engine.block.create(.page)
  try engine.block.appendChild(to: videoScene, child: videoPage)
  try engine.block.setWidth(videoPage, value: 1280)
  try engine.block.setHeight(videoPage, value: 720)
  try engine.block.setDuration(videoPage, duration: 10)

  let clip = try engine.block.create(.graphic)
  try engine.block.setShape(clip, shape: engine.block.createShape(.rect))
  let clipFill = try engine.block.createFill(.video)
  try engine.block.setURL(
    clipFill,
    property: "fill/video/fileURI",
    value: baseURL.appendingPathComponent(
      "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    ),
  )
  try engine.block.setFill(clip, fill: clipFill)
  try engine.block.setWidth(clip, value: 1280)
  try engine.block.setHeight(clip, value: 720)
  try engine.block.appendChild(to: videoPage, child: clip)

  try await engine.block.forceLoadAVResource(clipFill)
  if try engine.block.supportsPlaybackTime(videoPage) {
    try engine.block.setPlaybackTime(videoPage, time: 2.0)
  }

  let videoThumbnail = try await engine.block.export(
    videoPage,
    mimeType: .jpeg,
    options: ExportOptions(jpegQuality: 0.8, targetWidth: 400, targetHeight: 225),
  )
  try videoThumbnail.write(to: outputDirectory.appendingPathComponent("video-thumbnail.jpg"))
```

This produces one static image, not a sequence of scrubber frames.

## API Reference

### Methods

| Method | Description |
| ------ | ----------- |
| `engine.scene.getCurrentPage()` | Get the current page block, or `nil` when none is selected. |
| `engine.scene.getPages()` | Get all page blocks in the current scene. |
| `engine.block.export(_:mimeType:options:)` | Export a page or block to image `Data` with format and dimension options. |
| `engine.block.forceLoadAVResource(_:)` | Load a video fill's resource before seeking or exporting a frame. |
| `engine.block.supportsPlaybackTime(_:)` | Check whether a block exposes a playback timeline. |
| `engine.block.setPlaybackTime(_:time:)` | Seek the timeline to a time in seconds before exporting a video frame. |

### Properties

| Property | Type | Description |
| -------- | ---- | ----------- |
| `targetWidth` / `targetHeight` | Float | Scale the export to fill this box while preserving aspect ratio. Set both together. |
| `jpegQuality` | Float | JPEG quality in `(0, 1]`. Default `0.9`. |
| `pngCompressionLevel` | Int | PNG compression from `0` to `9`. Default `5`. |
| `webpQuality` | Float | WebP quality in `(0, 1]`. Default `1.0`. |

## Next Steps

- [Export designs to image formats](./export/overview.md) — Export designs to image, PDF, and video formats.
- [Compress exported images](./export/compress.md) — Reduce file size and tune quality for thumbnails and previews.
- [Batch processing designs](../automation/batch-processing.md) — Generate thumbnails at scale as part of automated workflows.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support