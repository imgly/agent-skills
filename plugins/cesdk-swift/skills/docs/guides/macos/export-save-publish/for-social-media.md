> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Export Media Assets](./export.md) > [For Social Media](./for-social-media.md)

---

Export vertical video designs for social media platforms with the correct dimensions, formats, and quality settings.
Configure video exports with appropriate resolution, framerate, and bitrate optimized for Instagram Reels, TikTok, and YouTube Shorts.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-export-for-social-media)

Short-form vertical video has become the dominant format for social media. Instagram Reels, TikTok, and YouTube Shorts all use the 9:16 aspect ratio at 1080×1920 pixels. This guide demonstrates how to create and export vertical video content with the correct settings for these platforms.

```swift file=@cesdk_swift_examples/engine-guides-export-for-social-media/ForSocialMedia.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func forSocialMedia(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  try engine.scene.setDesignUnit(.px)
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1080)
  try engine.block.setHeight(page, value: 1920)

  let baseURL = try engine.guidesBaseURL

  let videoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(videoBlock, shape: engine.block.createShape(.rect))
  let videoFill = try engine.block.createFill(.video)
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(videoBlock, fill: videoFill)
  try engine.block.appendChild(to: page, child: videoBlock)
  try engine.block.fillParent(videoBlock)
  try await engine.block.forceLoadAVResource(videoFill)

  let options = VideoExportOptions(
    videoBitrate: 8_000_000, // 8 Mbps
    framerate: 30,
    targetWidth: 1080,
    targetHeight: 1920,
  )

  var exportedVideo: Blob?
  for try await event in try await engine.block.exportVideo(
    page,
    mimeType: .mp4,
    options: options,
  ) {
    switch event {
    case let .progress(renderedFrames, encodedFrames, totalFrames):
      let percent = totalFrames == 0 ? 0 : Int((Double(encodedFrames) / Double(totalFrames)) * 100)
      print("Export \(percent)% – rendered \(renderedFrames), encoded \(encodedFrames) of \(totalFrames)")
    case let .finished(video: blob):
      exportedVideo = blob
    }
  }
  guard let videoData = exportedVideo else { return }

  let outputURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("vertical-video-1080x1920.mp4")
  try videoData.write(to: outputURL)
}
```

This guide covers creating a vertical video scene, exporting with resolution, framerate, and bitrate settings, and tracking export progress.

## Creating a Scene

Create a video scene and pin its design unit to pixels so the page dimensions you set match the platform requirements exactly. Add a page sized 1080×1920 (9:16), the standard resolution for Instagram Reels, TikTok, and YouTube Shorts.

```swift highlight-forSocialMedia-createScene
let scene = try engine.scene.createVideo()
try engine.scene.setDesignUnit(.px)
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setWidth(page, value: 1080)
try engine.block.setHeight(page, value: 1920)
```

`engine.scene.createVideo()` returns the new scene block and switches the engine into video mode. `setDesignUnit(.px)` makes subsequent `setWidth`/`setHeight` calls operate in pixels regardless of the scene's previous unit.

## Adding a Video

Fill the page with a video clip so the export has visible content. Create a graphic block with a rectangle shape, attach a video fill backed by a remote URL, append the block to the page, and call `fillParent` so it covers the full 1080×1920 frame.

```swift highlight-forSocialMedia-addVideo
let videoBlock = try engine.block.create(.graphic)
try engine.block.setShape(videoBlock, shape: engine.block.createShape(.rect))
let videoFill = try engine.block.createFill(.video)
let videoURL = baseURL.appendingPathComponent(
  "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
)
try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
try engine.block.setFill(videoBlock, fill: videoFill)
try engine.block.appendChild(to: page, child: videoBlock)
try engine.block.fillParent(videoBlock)
try await engine.block.forceLoadAVResource(videoFill)
```

`forceLoadAVResource(videoFill)` blocks until the remote video is downloaded and parsed. Calling it before export keeps the export pipeline from waiting on resource I/O while frames are being encoded.

## Configuring Export Options

`VideoExportOptions` controls resolution, framerate, and bitrate. For Instagram Reels, TikTok, and YouTube Shorts, render to 1080×1920 at 30 frames per second with an 8 Mbps video bitrate.

```swift highlight-forSocialMedia-exportOptions
let options = VideoExportOptions(
  videoBitrate: 8_000_000, // 8 Mbps
  framerate: 30,
  targetWidth: 1080,
  targetHeight: 1920,
)
```

Key video export settings:

- **targetWidth / targetHeight**: Output resolution (1080×1920 for vertical)
- **framerate**: 30 frames per second (standard for social media)
- **videoBitrate**: 8 Mbps balances quality and upload speed for short-form video

Higher bitrates produce better quality but larger files. For an automatic video bitrate, pass `VideoBitrate.auto` (`-1`) for a bounded, resolution-aware value, or the default `VideoBitrate.system` (`0`) to let the platform encoder choose. Pass `0` to `audioBitrate` to let the engine pick the audio bitrate automatically.

## Exporting Videos

`engine.block.exportVideo(_:mimeType:options:)` returns an `AsyncThrowingStream<VideoExport, Error>` that yields progress events while the export runs and a final `.finished(video:)` event carrying the encoded MP4 as a `Blob` (a typealias for `Data`). Use `MIMEType.mp4` for broad platform compatibility.

```swift highlight-forSocialMedia-exportVideo
var exportedVideo: Blob?
for try await event in try await engine.block.exportVideo(
  page,
  mimeType: .mp4,
  options: options,
) {
  switch event {
  case let .progress(renderedFrames, encodedFrames, totalFrames):
    let percent = totalFrames == 0 ? 0 : Int((Double(encodedFrames) / Double(totalFrames)) * 100)
    print("Export \(percent)% – rendered \(renderedFrames), encoded \(encodedFrames) of \(totalFrames)")
  case let .finished(video: blob):
    exportedVideo = blob
  }
}
guard let videoData = exportedVideo else { return }
```

The `for try await` loop drains the stream until the export completes. Capture the final blob in an optional and unwrap it before saving so an interrupted export doesn't write a zero-byte file.

## Tracking Export Progress

The `.progress` case fires repeatedly during the export and reports three frame counts:

- **renderedFrames** – Frames the engine has rendered so far.
- **encodedFrames** – Frames the encoder has written to the output stream.
- **totalFrames** – Total frames the export will produce.

```swift highlight-forSocialMedia-progress
case let .progress(renderedFrames, encodedFrames, totalFrames):
  let percent = totalFrames == 0 ? 0 : Int((Double(encodedFrames) / Double(totalFrames)) * 100)
  print("Export \(percent)% – rendered \(renderedFrames), encoded \(encodedFrames) of \(totalFrames)")
```

Encoding trails rendering slightly. Drive a progress indicator from `encodedFrames / totalFrames` for an accurate completion percentage. `totalFrames` can be `0` for the first event or two — guard against division by zero before computing a percentage.

## Saving the Exported Video

The `.finished` case yields a `Blob` containing the MP4 bytes. Write it to a file with `Data.write(to:)` to hand it off to a share sheet, an upload pipeline, or the photo library.

```swift highlight-forSocialMedia-saveFile
let outputURL = FileManager.default.temporaryDirectory
  .appendingPathComponent("vertical-video-1080x1920.mp4")
try videoData.write(to: outputURL)
```

For uploads, pass the `Blob` directly to your networking layer instead of writing it to disk first.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.scene.createVideo()` | Create a video scene |
| `engine.scene.setDesignUnit(_:)` | Pin the scene's design unit (`.px`, `.mm`, `.in`) |
| `engine.block.fillParent(_:)` | Resize a block to fill its parent |
| `engine.block.forceLoadAVResource(_:)` | Wait for a video fill's source to load |
| `engine.block.exportVideo(_:mimeType:options:)` | Export a block as a video stream |

### Export Options (Videos)

| Option | Type | Description |
|--------|------|-------------|
| `targetWidth` | `Float` | Output width in design units |
| `targetHeight` | `Float` | Output height in design units |
| `framerate` | `Float` | Frames per second (default `30`) |
| `videoBitrate` | `Int32` | Video bitrate in bits per second, or `VideoBitrate.system` (`0`, default) / `VideoBitrate.auto` (`-1`) |
| `audioBitrate` | `Int32` | Audio bitrate in bits per second (`0` = auto) |
| `h264Profile` | `H264Profile` | Encoder feature set: `.baseline`, `.extended`, `.main` (default), `.high` |
| `h264Level` | `Int32` | H.264 level × 10 (default `52` = level 5.2) |
| `timeOffset` | `Double` | Start time in seconds (default `0`) |
| `duration` | `Double` | Output duration in seconds (`0` = full scene) |

## Next Steps

- [Export Overview](./export/overview.md) - Complete export options including H.264 profiles and advanced settings



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support