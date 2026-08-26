> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To MP4](./to-mp4.md)

---

Export your video compositions as MP4 files with H.264 encoding, progress events, and configurable quality and resolution.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1/engine-guides-export-to-mp4)

MP4 is the most widely supported video format, using H.264 encoding for efficient compression. CE.SDK renders frames, encodes them with H.264, and muxes audio into an MP4 container. The export runs on the engine's background worker so the main thread stays responsive.

```swift file=@cesdk_swift_examples/engine-guides-export-to-mp4/ExportToMp4.swift reference-only
import Foundation
import IMGLYEngine

// swiftlint:disable cyclomatic_complexity

@MainActor
func exportToMp4(engine: Engine) async throws {
  // Demo scaffolding: build a video scene with a single page and a video fill so
  // the exportVideo calls below have something to encode. In your app you would
  // start from a scene already loaded into the editor instead.
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 5)

  let baseURL = try engine.guidesBaseURL

  let video = try engine.block.create(.graphic)
  try engine.block.setShape(video, shape: engine.block.createShape(.rect))
  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(
    videoFill,
    property: "fill/video/fileURI",
    value: baseURL.appendingPathComponent(
      "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    ),
  )
  try engine.block.setFill(video, fill: videoFill)
  try engine.block.appendChild(to: page, child: video)
  try engine.block.fillParent(video)

  let exportsDirectory = FileManager.default.temporaryDirectory

  let videoStream = try await engine.block.exportVideo(page, mimeType: .mp4)
  for try await event in videoStream {
    if case let .finished(video: blob) = event {
      try blob.write(to: exportsDirectory.appendingPathComponent("video.mp4"))
    }
  }

  let progressStream = try await engine.block.exportVideo(page, mimeType: .mp4)
  for try await event in progressStream {
    switch event {
    case let .progress(rendered, encoded, total):
      let percent = total > 0 ? Int(Double(encoded) / Double(total) * 100) : 0
      print("Export \(percent)% — encoded \(encoded)/\(total) (rendered \(rendered))")
    case let .finished(video: blob):
      try blob.write(to: exportsDirectory.appendingPathComponent("progress.mp4"))
    }
  }

  let exportTask = Task { () -> Blob in
    let stream = try await engine.block.exportVideo(page, mimeType: .mp4)
    for try await event in stream {
      try Task.checkCancellation()
      if case let .finished(video: blob) = event {
        return blob
      }
    }
    throw CancellationError()
  }
  // Call exportTask.cancel() from another task to abort the export.
  let exportedBlob = try await exportTask.value
  try exportedBlob.write(to: exportsDirectory.appendingPathComponent("cancellable.mp4"))

  let resolutionOptions = VideoExportOptions(
    framerate: 30,
    targetWidth: 1920,
    targetHeight: 1080,
  )
  let resolutionStream = try await engine.block.exportVideo(page, mimeType: .mp4, options: resolutionOptions)
  for try await event in resolutionStream {
    if case let .finished(video: blob) = event {
      try blob.write(to: exportsDirectory.appendingPathComponent("video-1080p.mp4"))
    }
  }

  let qualityOptions = VideoExportOptions(
    h264Profile: .high,
    h264Level: 52,
    videoBitrate: 8_000_000,
  )
  let qualityStream = try await engine.block.exportVideo(page, mimeType: .mp4, options: qualityOptions)
  for try await event in qualityStream {
    if case let .finished(video: blob) = event {
      try blob.write(to: exportsDirectory.appendingPathComponent("video-high.mp4"))
    }
  }

  let partialOptions = VideoExportOptions(
    timeOffset: 1,
    duration: 2,
  )
  let partialStream = try await engine.block.exportVideo(page, mimeType: .mp4, options: partialOptions)
  for try await event in partialStream {
    if case let .finished(video: blob) = event {
      try blob.write(to: exportsDirectory.appendingPathComponent("video-clip.mp4"))
    }
  }
}

// swiftlint:enable cyclomatic_complexity
```

This guide covers exporting a page to MP4, observing progress, cancelling an in-flight export, configuring resolution and quality, and exporting a partial timeline range.

## Export to MP4

Call `engine.block.exportVideo(_:mimeType:options:)` with a page block to export it as an MP4 video. The call returns an `AsyncThrowingStream<VideoExport, Error>` that yields `.progress` events while encoding and a final `.finished(video:)` event that carries the encoded `Blob`.

```swift highlight-exportToMp4-exportVideo
let videoStream = try await engine.block.exportVideo(page, mimeType: .mp4)
for try await event in videoStream {
  if case let .finished(video: blob) = event {
    try blob.write(to: exportsDirectory.appendingPathComponent("video.mp4"))
  }
}
```

`MIMEType.mp4` is the default — pass it explicitly to make the output format obvious to readers of the call site. Once the stream finishes, write the resulting `Blob` to disk with `Blob.write(to:)`.

> **Caution:** H.264 does not support transparency. Transparent areas in your scene render with a black background in the exported MP4.

## Tracking Export Progress

`.progress` events arrive throughout the export with three counters: rendered frames (frames pulled from the scene), encoded frames (frames already pushed through the H.264 encoder), and the total frame count. The encoded count is the most useful signal for a user-facing progress bar because it tracks the slower stage.

```swift highlight-exportToMp4-progress
let progressStream = try await engine.block.exportVideo(page, mimeType: .mp4)
for try await event in progressStream {
  switch event {
  case let .progress(rendered, encoded, total):
    let percent = total > 0 ? Int(Double(encoded) / Double(total) * 100) : 0
    print("Export \(percent)% — encoded \(encoded)/\(total) (rendered \(rendered))")
  case let .finished(video: blob):
    try blob.write(to: exportsDirectory.appendingPathComponent("progress.mp4"))
  }
}
```

> **Note:** On iPhone and iPad apps, the export process is automatically suspended when the app moves to the background and resumed when it returns to the foreground. You don't need to handle lifecycle events manually. This automatic handling does not apply to Mac Catalyst or macOS targets.

## Cancelling an Export

Wrap the export in a `Task` so a holder can call `cancel()` to abort it. Each loop iteration calls `try Task.checkCancellation()` first, so the loop exits as soon as cancellation is requested and the engine tears down the worker.

```swift highlight-exportToMp4-cancel
let exportTask = Task { () -> Blob in
  let stream = try await engine.block.exportVideo(page, mimeType: .mp4)
  for try await event in stream {
    try Task.checkCancellation()
    if case let .finished(video: blob) = event {
      return blob
    }
  }
  throw CancellationError()
}
// Call exportTask.cancel() from another task to abort the export.
let exportedBlob = try await exportTask.value
try exportedBlob.write(to: exportsDirectory.appendingPathComponent("cancellable.mp4"))
```

Hold a reference to the `Task` value and call `cancel()` from your UI (for example, when a user taps a Cancel button). The `try Task.checkCancellation()` call surfaces a `CancellationError` through `exportTask.value` instead of returning a partial result.

## Configure Video Encoding

Pass a `VideoExportOptions` value to control quality, file size, and device compatibility.

### Resolution and Framerate

Set `targetWidth`, `targetHeight`, and `framerate` to control output dimensions and smoothness.

```swift highlight-exportToMp4-resolution
let resolutionOptions = VideoExportOptions(
  framerate: 30,
  targetWidth: 1920,
  targetHeight: 1080,
)
let resolutionStream = try await engine.block.exportVideo(page, mimeType: .mp4, options: resolutionOptions)
for try await event in resolutionStream {
  if case let .finished(video: blob) = event {
    try blob.write(to: exportsDirectory.appendingPathComponent("video-1080p.mp4"))
  }
}
```

If only one of `targetWidth` or `targetHeight` is non-zero, the other is computed to preserve the source aspect ratio. The default framerate is 30 Hz.

### H.264 Profile and Quality

The `h264Profile` option controls encoding quality and device compatibility:

- **`.baseline` (66)**: Maximum compatibility, lower compression.
- **`.main` (77)**: Balanced quality and compatibility (default).
- **`.extended` (88)**: Extended feature set, less common.
- **`.high` (100)**: Best compression, supported on all modern iOS devices.

`h264Level` accepts the level multiplied by ten — pass `52` for level 5.2. `videoBitrate` accepts an explicit value in bits per second, or one of the named modes: `VideoBitrate.system` (`0`, the default) lets the platform encoder (VideoToolbox) choose, and `VideoBitrate.auto` (`-1`) picks a bounded value based on resolution and framerate.

```swift highlight-exportToMp4-quality
let qualityOptions = VideoExportOptions(
  h264Profile: .high,
  h264Level: 52,
  videoBitrate: 8_000_000,
)
let qualityStream = try await engine.block.exportVideo(page, mimeType: .mp4, options: qualityOptions)
for try await event in qualityStream {
  if case let .finished(video: blob) = event {
    try blob.write(to: exportsDirectory.appendingPathComponent("video-high.mp4"))
  }
}
```

The example above sets `videoBitrate: 8_000_000` (8 Mbps), a reasonable target for high-quality 1080p H.264 footage. As a rough guide, scale the bitrate with the pixel count and motion complexity: ~5 Mbps for 720p, 8–12 Mbps for 1080p, and 20–40 Mbps for 4K.

### Export a Partial Timeline

Use `timeOffset` and `duration` to export a specific segment without modifying the scene. Both values are in seconds, relative to the page's timeline.

```swift highlight-exportToMp4-partial
let partialOptions = VideoExportOptions(
  timeOffset: 1,
  duration: 2,
)
let partialStream = try await engine.block.exportVideo(page, mimeType: .mp4, options: partialOptions)
for try await event in partialStream {
  if case let .finished(video: blob) = event {
    try blob.write(to: exportsDirectory.appendingPathComponent("video-clip.mp4"))
  }
}
```

A `duration` of `0` defaults to the full duration of the exported page (the engine does not subtract `timeOffset`).

### All MP4 Export Options

| Option              | Type          | Default      | Description                                                                                          |
| ------------------- | ------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `h264Profile`       | `H264Profile` | `.main`      | Encoder profile: `.baseline` (66), `.main` (77), `.extended` (88), `.high` (100).                    |
| `h264Level`         | `Int32`       | `52`         | Encoding level (multiply desired level by 10, e.g., `52` for level 5.2).                             |
| `videoBitrate`      | `Int32`       | `VideoBitrate.system` | Video bitrate in bits/second, or a named mode. `VideoBitrate.system` (`0`, the default) lets VideoToolbox choose; `VideoBitrate.auto` (`-1`) picks a bounded, resolution-aware bitrate. A positive number sets an explicit bitrate (maximum determined by profile and level). |
| `audioBitrate`      | `Int32`       | `0` (auto)   | Audio bitrate in bits/second. `0` defaults to 128 kbps for stereo AAC.                               |
| `framerate`         | `Float`       | `30`         | Target framerate in Hz.                                                                              |
| `targetWidth`       | `Float`       | `0`          | Output width in pixels. `0` keeps the page's natural width.                                          |
| `targetHeight`      | `Float`       | `0`          | Output height in pixels. `0` keeps the page's natural height.                                        |
| `timeOffset`        | `Double`      | `0`          | Start time offset in seconds.                                                                        |
| `duration`          | `Double`      | page length  | Video duration in seconds. `0` defaults to the duration of the exported page.                        |
| `allowTextOverhang` | `Bool`        | `false`      | Include text bounding boxes that account for glyph overhangs.                                        |

## API Reference

| Method                                          | Description                                                                                  |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `engine.block.exportVideo(_:mimeType:options:)` | Export a page block as MP4 video. Returns an `AsyncThrowingStream<VideoExport, Error>`.      |

## Next Steps

- [Export Overview](./overview.md) - Compare all supported export formats
- [Export Size Limits](./size-limits.md) - Check device limits before exporting large videos
- [Export Audio](./audio.md) - Export audio tracks separately
- [Partial Export](./partial-export.md) - Export specific blocks or timeline segments



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support