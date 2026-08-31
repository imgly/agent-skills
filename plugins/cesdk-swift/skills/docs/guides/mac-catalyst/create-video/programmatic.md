> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Programmatic Creation](./programmatic.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-video-programmatic/CreateVideoProgrammatic.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createVideoProgrammatic(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.appendChild(to: scene, child: page)

  let baseURL = try engine.guidesBaseURL

  let introURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )
  let detailURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-kampus-production-8154913.mp4",
  )

  let introClip = try makeVideoClip(engine: engine, videoURL: introURL)
  let detailClip = try makeVideoClip(engine: engine, videoURL: detailURL)

  let track = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: track)
  try engine.block.appendChild(to: track, child: introClip.block)
  try engine.block.appendChild(to: track, child: detailClip.block)
  try engine.block.fillParent(track)

  // Keep the guide export short; use the clip length your app needs.
  let sampleClipDurationSeconds = 2.0

  try await engine.block.forceLoadAVResource(introClip.fill)
  let introSource = try engine.block.getAVResourceTotalDuration(introClip.fill)
  let introDuration = min(sampleClipDurationSeconds, introSource)
  try engine.block.setDuration(introClip.block, duration: introDuration)

  try await engine.block.forceLoadAVResource(detailClip.fill)
  let detailSource = try engine.block.getAVResourceTotalDuration(detailClip.fill)
  let detailDuration = min(sampleClipDurationSeconds, detailSource)
  try engine.block.setDuration(detailClip.block, duration: detailDuration)

  let pageDuration = introDuration + detailDuration
  try engine.block.setDuration(page, duration: pageDuration)

  // Export a compact preview file; use your delivery size and frame rate in production.
  // videoBitrate: .auto derives a bounded bitrate from the resolution/framerate. It is
  // recommended over the default .system mode. Pass .custom(bitsPerSecond) instead
  // for an explicit bitrate.
  let exportOptions = VideoExportOptions(
    videoBitrate: .auto,
    framerate: 15,
    targetWidth: 640,
    targetHeight: 360,
  )
  let exportStream = try await engine.block.exportVideo(
    page,
    mimeType: .mp4,
    options: exportOptions,
  )
  var videoData: Blob?
  for try await event in exportStream {
    switch event {
    case let .progress(rendered, encoded, total):
      let percent = total > 0 ? Int(Double(encoded) / Double(total) * 100) : 0
      print("Export \(percent)% — encoded \(encoded)/\(total) (rendered \(rendered))")
    case let .finished(video: blob):
      videoData = blob
    }
  }
  guard let videoBytes = videoData else {
    throw NSError(
      domain: "ly.img.guide",
      code: 0,
      userInfo: [NSLocalizedDescriptionKey: "exportVideo finished without a video blob."],
    )
  }

  let outputURL = FileManager.default.temporaryDirectory.appendingPathComponent("programmatic-video.mp4")
  try videoBytes.write(to: outputURL)

  assert(!videoBytes.isEmpty)
  let writtenSize = try outputURL.resourceValues(forKeys: [.fileSizeKey]).fileSize ?? 0
  assert(writtenSize > 0)
}

private struct VideoClip {
  let block: DesignBlockID
  let fill: DesignBlockID
}

@MainActor
private func makeVideoClip(
  engine: Engine,
  videoURL: URL,
) throws -> VideoClip {
  let clip = try engine.block.create(.graphic)
  try engine.block.setShape(clip, shape: engine.block.createShape(.rect))

  let videoFill = try engine.block.createFill(.video)
  // Video fills read their media source from this Engine property key.
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(clip, fill: videoFill)

  return VideoClip(block: clip, fill: videoFill)
}

@MainActor
func createSingleSourceVideoScene(engine: Engine) async throws -> DesignBlockID {
  let videoURL = try engine.guidesBaseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )
  return try await engine.scene.create(fromVideo: videoURL)
}

```

Create a video scene entirely through code, add clips to a track, set
durations, and export the result as an MP4 file.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-create-video-programmatic)

<EngineReferenceNote {...props} />

CE.SDK video scenes can be built without opening the editor UI. This is useful
for automation, template-driven rendering, and app flows that create media from
known inputs.

This guide uses the Swift Engine API to create a video scene, arrange clips on
a track, load media metadata, set durations, and export the page as MP4.
Use [Join and Arrange Video Clips](../edit-video/join-and-arrange.md) when you need
multi-clip reordering, time offsets, or overlay tracks after the initial scene
is created.

## Create a Video Scene

Create a timeline-enabled scene with `engine.scene.createVideo()`. A page holds
the video composition and defines the canvas dimensions.

```swift highlight-createVideoProgrammatic-create-scene
  let scene = try engine.scene.createVideo()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.appendChild(to: scene, child: page)
```

For a one-source video scene, call `engine.scene.create(fromVideo:)` with the
video URL. The main sample uses `createVideo()` because it shows tracks,
multiple clips, and export timing.

```swift highlight-createVideoProgrammatic-create-from-video
@MainActor
func createSingleSourceVideoScene(engine: Engine) async throws -> DesignBlockID {
  let videoURL = try engine.guidesBaseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )
  return try await engine.scene.create(fromVideo: videoURL)
}
```

## Add Video Clips

Each clip is a graphic block with a rectangular shape and a video fill. The
helper returns both handles because later timing APIs operate on the graphic
block, while media metadata APIs operate on the video fill.

```swift highlight-createVideoProgrammatic-create-video-clip-helper
private struct VideoClip {
  let block: DesignBlockID
  let fill: DesignBlockID
}

@MainActor
private func makeVideoClip(
  engine: Engine,
  videoURL: URL,
) throws -> VideoClip {
  let clip = try engine.block.create(.graphic)
  try engine.block.setShape(clip, shape: engine.block.createShape(.rect))

  let videoFill = try engine.block.createFill(.video)
  // Video fills read their media source from this Engine property key.
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(clip, fill: videoFill)

  return VideoClip(block: clip, fill: videoFill)
}
```

Create the clips from source URLs:

```swift highlight-createVideoProgrammatic-add-video-clips
let introClip = try makeVideoClip(engine: engine, videoURL: introURL)
let detailClip = try makeVideoClip(engine: engine, videoURL: detailURL)
```

## Arrange Clips on a Track

Append the clips to a `.track` block in playback order. The track sequences its
children from their durations, and `fillParent(track)` sizes the track block
to its parent page. For groups and tracks, `fillParent(...)` also fills child
blocks against the nearest parent that is not a group or track, so the unsized
clip graphics in this sample fill the page frame before the track is sized.

```swift highlight-createVideoProgrammatic-arrange-track
let track = try engine.block.create(.track)
try engine.block.appendChild(to: page, child: track)
try engine.block.appendChild(to: track, child: introClip.block)
try engine.block.appendChild(to: track, child: detailClip.block)
try engine.block.fillParent(track)
```

## Load Media and Set Durations

Load each video resource before reading metadata. Duration values use seconds.

```swift highlight-createVideoProgrammatic-load-media-and-timing
  // Keep the guide export short; use the clip length your app needs.
  let sampleClipDurationSeconds = 2.0

  try await engine.block.forceLoadAVResource(introClip.fill)
  let introSource = try engine.block.getAVResourceTotalDuration(introClip.fill)
  let introDuration = min(sampleClipDurationSeconds, introSource)
  try engine.block.setDuration(introClip.block, duration: introDuration)

  try await engine.block.forceLoadAVResource(detailClip.fill)
  let detailSource = try engine.block.getAVResourceTotalDuration(detailClip.fill)
  let detailDuration = min(sampleClipDurationSeconds, detailSource)
  try engine.block.setDuration(detailClip.block, duration: detailDuration)

  let pageDuration = introDuration + detailDuration
  try engine.block.setDuration(page, duration: pageDuration)
```

The sample derives safe clip durations from the source media duration and sets
the page duration to the combined clip length.

## Export the Video

Export the page with `engine.block.exportVideo(_:mimeType:options:)`. The call
returns an `AsyncThrowingStream<VideoExport, Error>` that yields `.progress`
events during encoding and a final `.finished(video:)` event carrying the
encoded `Blob`. The sample exports MP4, reports progress, and passes a smaller
target resolution and frame rate to produce a compact verification file while
keeping the page at 1280x720. It also selects `VideoBitrate.auto`, a bounded
bitrate derived from the resolution and frame rate.

```swift highlight-createVideoProgrammatic-export-video
// Export a compact preview file; use your delivery size and frame rate in production.
// videoBitrate: .auto derives a bounded bitrate from the resolution/framerate. It is
// recommended over the default .system mode. Pass .custom(bitsPerSecond) instead
// for an explicit bitrate.
let exportOptions = VideoExportOptions(
  videoBitrate: .auto,
  framerate: 15,
  targetWidth: 640,
  targetHeight: 360,
)
let exportStream = try await engine.block.exportVideo(
  page,
  mimeType: .mp4,
  options: exportOptions,
)
var videoData: Blob?
for try await event in exportStream {
  switch event {
  case let .progress(rendered, encoded, total):
    let percent = total > 0 ? Int(Double(encoded) / Double(total) * 100) : 0
    print("Export \(percent)% — encoded \(encoded)/\(total) (rendered \(rendered))")
  case let .finished(video: blob):
    videoData = blob
  }
}
guard let videoBytes = videoData else {
  throw NSError(
    domain: "ly.img.guide",
    code: 0,
    userInfo: [NSLocalizedDescriptionKey: "exportVideo finished without a video blob."],
  )
}
```

Write the returned `Blob` to disk with `Blob.write(to:)`.

```swift highlight-createVideoProgrammatic-write-file
let outputURL = FileManager.default.temporaryDirectory.appendingPathComponent("programmatic-video.mp4")
try videoBytes.write(to: outputURL)
```

> **Note:** On iPhone and iPad apps, the export process is automatically suspended when the
> app moves to the background and resumed when it returns to the foreground. This
> automatic handling does not apply to Mac Catalyst or macOS targets.

## API Reference

| API | Category | Purpose |
| --- | --- | --- |
| `engine.scene.createVideo()` | Scene | Create an empty video scene with timeline support. |
| `engine.scene.create(fromVideo:)` | Scene | Create a one-source video scene from a URL. |
| `engine.block.create(_:)` | Block | Create pages, tracks, graphics, and other blocks. |
| `engine.block.createShape(_:)` | Shape | Create a shape for a graphic block. |
| `engine.block.setShape(_:shape:)` | Shape | Assign a shape to a graphic block. |
| `engine.block.createFill(_:)` | Fill | Create a video fill. |
| `engine.block.setFill(_:fill:)` | Fill | Assign a fill to a block. |
| `engine.block.setString(_:property:value:)` | Fill | Set the source URI on a video fill via the `fill/video/fileURI` property. |
| `engine.block.appendChild(to:child:)` | Hierarchy | Attach scene, page, track, and clip blocks. |
| `engine.block.fillParent(_:)` | Layout | Resize and position the passed block to fill its parent; for groups and tracks, fill child blocks against the nearest non-group/non-track parent first. |
| `engine.block.setWidth(_:value:)` / `setHeight(_:value:)` | Layout | Set the page's natural dimensions. |
| `engine.block.setDuration(_:duration:)` | Timing | Set clip or page duration in seconds. |
| `engine.block.getDuration(_:)` | Timing | Read a block's duration in seconds. |
| `engine.block.forceLoadAVResource(_:)` | Media | Load a video fill before reading metadata. |
| `engine.block.getAVResourceTotalDuration(_:)` | Media | Read the source media duration in seconds. |
| `engine.block.exportVideo(_:mimeType:options:)` | Export | Export a page timeline as an `AsyncThrowingStream<VideoExport, Error>` that yields progress events and a final encoded `Blob`. |
| `VideoExportOptions(framerate:targetWidth:targetHeight:videoBitrate:...)` | Export | Configure framerate, output dimensions, and bitrate for the export. |

## Troubleshooting

- **Engine reference is unavailable**: Initialize CE.SDK and obtain an `Engine`
  instance before running the scene creation code; the Engine reference note
  above links to the setup flow.
- **Clip not visible**: Verify that the graphic block has a shape and fill, and
  that it is appended to a track or page.
- **Source duration is zero**: Call `forceLoadAVResource(_:)` on the video
  fill before metadata APIs.
- **Export is empty**: Set a positive page duration and confirm each clip has a
  non-zero duration before exporting.
- **Remote media does not load**: Check that the URL is reachable and that the
  device runtime supports the media format.

## Next Steps

- [Create Videos Overview](./overview.md) - Understand video scenes and time-based editing
- [Join and Arrange Video Clips](../edit-video/join-and-arrange.md) - Combine multiple video clips into sequences and organize them on the timeline using tracks and time offsets in CE.SDK.&#x20;
- [Timeline Editor](./timeline-editor.md) - Build interactive video timelines
- [Trim](../edit-video/trim.md) - Control which portion of source media plays
- [Control Audio and Video](./control.md) - Configure playback, trim, and resource control
- [Export](../export-save-publish/export.md) - Export images, videos, and other output formats



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support