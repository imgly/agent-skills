> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Programmatic Editing](./programmatic.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-video-edit-programmatic/EditVideoProgrammatically.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func editVideoProgrammatically(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 4.0)

  let baseURL = try engine.guidesBaseURL

  let track = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: track)
  try engine.block.fillParent(track)

  let firstClip = try engine.block.create(.graphic)
  try engine.block.setShape(firstClip, shape: engine.block.createShape(.rect))
  let firstVideoFill = try engine.block.createFill(.video)
  try engine.block.setURL(
    firstVideoFill,
    property: "fill/video/fileURI",
    value: baseURL.appendingPathComponent(
      "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    ),
  )
  try engine.block.setFill(firstClip, fill: firstVideoFill)
  try engine.block.setContentFillMode(firstClip, mode: .cover)

  let secondClipURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-kampus-production-8154913.mp4",
  )
  let secondClip = try engine.block.create(.graphic)
  try engine.block.setShape(secondClip, shape: engine.block.createShape(.rect))
  let secondVideoFill = try engine.block.createFill(.video)
  try engine.block.setURL(secondVideoFill, property: "fill/video/fileURI", value: secondClipURL)
  try engine.block.setFill(secondClip, fill: secondVideoFill)
  try engine.block.setContentFillMode(secondClip, mode: .cover)

  try engine.block.appendChild(to: track, child: firstClip)
  try engine.block.appendChild(to: track, child: secondClip)

  try await engine.block.forceLoadAVResource(firstVideoFill)
  try await engine.block.forceLoadAVResource(secondVideoFill)

  try engine.block.setDuration(firstClip, duration: 2.0)
  try engine.block.setDuration(secondClip, duration: 2.0)
  try engine.block.setTrimOffset(firstVideoFill, offset: 1.0)
  try engine.block.setTrimLength(firstVideoFill, length: 2.0)

  let secondSegment = try engine.block.split(
    secondClip,
    atTime: 1.0,
    options: SplitOptions(selectNewBlock: false),
  )

  let overlay = try engine.block.create(.graphic)
  try engine.block.setShape(overlay, shape: engine.block.createShape(.rect))
  let overlayFill = try engine.block.createFill(.color)
  try engine.block.setFill(overlay, fill: overlayFill)
  try engine.block.setColor(
    overlayFill,
    property: "fill/color/value",
    color: .rgba(r: 1.0, g: 0.82, b: 0.1, a: 0.85),
  )
  try engine.block.setWidth(overlay, value: 1280)
  try engine.block.setHeight(overlay, value: 72)
  try engine.block.setPositionY(overlay, value: 648)
  try engine.block.setTimeOffset(overlay, offset: 1.25)
  try engine.block.setDuration(overlay, duration: 1.5)
  try engine.block.appendChild(to: page, child: overlay)

  let mimeType: MIMEType = .mp4
  let options = VideoExportOptions(
    videoBitrate: 8_000_000,
    audioBitrate: 128_000,
    framerate: 30,
    targetWidth: 1280,
    targetHeight: 720,
  )
  let exportTask = Task {
    for try await export in try await engine.block.exportVideo(page, mimeType: mimeType, options: options) {
      switch export {
      case let .progress(renderedFrames, _, totalFrames):
        print("Rendered", renderedFrames, "of", totalFrames, "frames")
      case let .finished(video: videoData):
        return videoData
      }
    }
    return Blob()
  }
  let editedVideo = try await exportTask.value
  precondition(editedVideo.count > 0)

  // Keep references alive past their highlight blocks so SwiftLint doesn't
  // flag them — the rendered guide never shows these lines.
  _ = scene
  _ = secondSegment
}
```

Edit video scenes with CE.SDK Engine APIs when your app needs automation,
custom controls, or template-driven video output.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260821/engine-guides-create-video-edit-programmatic)

<EngineReferenceNote {...props} />

Programmatic editing works directly on the Engine scene graph rather than the
built-in timeline UI for iOS. The [Timeline Editor](../create-video/timeline-editor.md)
guide covers timeline-focused UI and Engine concepts. Use the programmatic
approach when your app needs to create or modify video timelines from code, for
example when generating variants, applying a known edit recipe, or exporting a
scene without opening the editor.

This guide builds a compact two-clip montage, trims the first clip, splits the second clip, adds a timed graphic overlay, and exports the edited page as MP4.

## Understand the Video Timeline

A video scene contains one or more pages. A page owns tracks and timed blocks, and each track arranges its child clips in sequence. In a typical video timeline:

- The scene is created in video mode with `engine.scene.createVideo()`.
- A page defines the canvas size and the exported playback duration.
- A track contains graphic clip blocks with video fills.
- Audio blocks or overlay blocks can sit on the page timeline beside the track.
- Audio-only media uses `DesignBlockType.audio`; video fills and audio blocks can both be muted or mixed with volume controls.

Timeline values are measured in seconds. `setDuration(_:duration:)` controls how long a block is active, `setTimeOffset(_:offset:)` controls when a block starts within its parent timeline, and trim values control which source-media segment plays.

## Create a Video Scene

Create a video scene, add a page, set the page size, and set the page duration. The page is the block exported later.

```swift highlight-editVideoProgrammatically-create-video-scene
let scene = try engine.scene.createVideo()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setWidth(page, value: 1280)
try engine.block.setHeight(page, value: 720)
try engine.block.setDuration(page, duration: 4.0)
```

`createVideo()` enables timeline behavior. The page duration here is `4.0` seconds, so the export renders the first four seconds of the edited page.

## Add and Arrange Clips

Create a track, attach it to the page, and append two graphic blocks with video fills. The track uses the child order to play clips sequentially.

```swift highlight-editVideoProgrammatically-add-clips
  let track = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: track)
  try engine.block.fillParent(track)

  let firstClip = try engine.block.create(.graphic)
  try engine.block.setShape(firstClip, shape: engine.block.createShape(.rect))
  let firstVideoFill = try engine.block.createFill(.video)
  try engine.block.setURL(
    firstVideoFill,
    property: "fill/video/fileURI",
    value: baseURL.appendingPathComponent(
      "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    ),
  )
  try engine.block.setFill(firstClip, fill: firstVideoFill)
  try engine.block.setContentFillMode(firstClip, mode: .cover)

  let secondClipURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-kampus-production-8154913.mp4",
  )
  let secondClip = try engine.block.create(.graphic)
  try engine.block.setShape(secondClip, shape: engine.block.createShape(.rect))
  let secondVideoFill = try engine.block.createFill(.video)
  try engine.block.setURL(secondVideoFill, property: "fill/video/fileURI", value: secondClipURL)
  try engine.block.setFill(secondClip, fill: secondVideoFill)
  try engine.block.setContentFillMode(secondClip, mode: .cover)

  try engine.block.appendChild(to: track, child: firstClip)
  try engine.block.appendChild(to: track, child: secondClip)
```

The sample sets `.cover` so each clip fills the page frame. Pick the mode that matches how the source video should fit into the graphic block:

| Mode | Effect |
| --- | --- |
| `ContentFillMode.crop` | Uses manual crop positioning. |
| `ContentFillMode.cover` | Scales content to cover the full block frame and can crop the edges. |
| `ContentFillMode.contain` | Scales content to fit inside the block frame and can leave empty space. |

## Change Timing and Trim

Load AV metadata before changing trim values or reading duration metadata. `forceLoadAVResource(_:)` is `async` and must be awaited. Then set each clip's timeline duration and trim the first fill to start one second into its source media.

```swift highlight-editVideoProgrammatically-change-timing-trim
  try await engine.block.forceLoadAVResource(firstVideoFill)
  try await engine.block.forceLoadAVResource(secondVideoFill)

  try engine.block.setDuration(firstClip, duration: 2.0)
  try engine.block.setDuration(secondClip, duration: 2.0)
  try engine.block.setTrimOffset(firstVideoFill, offset: 1.0)
  try engine.block.setTrimLength(firstVideoFill, length: 2.0)
```

Use these APIs for different timing layers:

| API | Effect |
| --- | --- |
| `engine.block.setDuration(_:duration:)` | Sets how long the block is active on the timeline. |
| `engine.block.setTimeOffset(_:offset:)` | Sets when the block starts within its parent timeline. |
| `engine.block.setTrimOffset(_:offset:)` | Sets where source media playback starts. |
| `engine.block.setTrimLength(_:length:)` | Sets how much source media is used for playback. |

## Split a Clip

Split the second clip at one second. The original block becomes the first segment, and `split(_:atTime:options:)` returns the new second segment.

```swift highlight-editVideoProgrammatically-split-clip
let secondSegment = try engine.block.split(
  secondClip,
  atTime: 1.0,
  options: SplitOptions(selectNewBlock: false),
)
```

The sample passes `SplitOptions(selectNewBlock: false)` because a headless workflow does not need to change editor selection after the split.

`SplitOptions` controls how CE.SDK attaches and selects the new segment:

| Field | Default | Effect |
| --- | --- | --- |
| `attachToParent` | `true` | Attaches the returned segment to the same parent as the original block. |
| `createParentTrackIfNeeded` | `false` | Creates a parent track when the split block needs one and `attachToParent` is enabled. |
| `selectNewBlock` | `true` | Selects the returned segment after splitting. |

## Apply a Timed Overlay

Add a short graphic overlay directly to the page timeline. Its `timeOffset` and `duration` make it appear only for part of the exported video.

```swift highlight-editVideoProgrammatically-timed-overlay
let overlay = try engine.block.create(.graphic)
try engine.block.setShape(overlay, shape: engine.block.createShape(.rect))
let overlayFill = try engine.block.createFill(.color)
try engine.block.setFill(overlay, fill: overlayFill)
try engine.block.setColor(
  overlayFill,
  property: "fill/color/value",
  color: .rgba(r: 1.0, g: 0.82, b: 0.1, a: 0.85),
)
try engine.block.setWidth(overlay, value: 1280)
try engine.block.setHeight(overlay, value: 72)
try engine.block.setPositionY(overlay, value: 648)
try engine.block.setTimeOffset(overlay, offset: 1.25)
try engine.block.setDuration(overlay, duration: 1.5)
try engine.block.appendChild(to: page, child: overlay)
```

This same pattern works for other programmatic edits: create or find the target block, set its timing, then apply the specific block or fill properties your workflow needs.

## Export the Edited Video

Export the page as MP4 with `exportVideo(_:mimeType:options:)`. The call returns an `AsyncThrowingStream` that emits `.progress(...)` cases while rendering and a single `.finished(video:)` case with the encoded bytes. `VideoExportOptions` controls output size, frame rate, and bitrate.

```swift highlight-editVideoProgrammatically-export-video
let mimeType: MIMEType = .mp4
let options = VideoExportOptions(
  videoBitrate: 8_000_000,
  audioBitrate: 128_000,
  framerate: 30,
  targetWidth: 1280,
  targetHeight: 720,
)
let exportTask = Task {
  for try await export in try await engine.block.exportVideo(page, mimeType: mimeType, options: options) {
    switch export {
    case let .progress(renderedFrames, _, totalFrames):
      print("Rendered", renderedFrames, "of", totalFrames, "frames")
    case let .finished(video: videoData):
      return videoData
    }
  }
  return Blob()
}
let editedVideo = try await exportTask.value
precondition(editedVideo.count > 0)
```

The sample asserts that the returned `Blob` is non-empty so the automated check verifies a real export result.

`VideoExportOptions` exposes these public fields:

| Field | Purpose |
| --- | --- |
| `h264Profile` | Selects the H.264 encoder profile. |
| `h264Level` | Selects the H.264 encoder level — for example `52` for level 5.2. |
| `videoBitrate` | Sets video bitrate in bits per second, or a named mode: `VideoBitrate.system` (`0`, default) lets the platform encoder choose, `VideoBitrate.auto` (`-1`) uses a bounded, resolution-aware bitrate. |
| `audioBitrate` | Sets audio bitrate in bits per second, or `0` for automatic selection. |
| `timeOffset` | Time offset in seconds into the scene timeline where the export starts. |
| `duration` | Length of the exported video in seconds; `0` uses the page duration. |
| `framerate` | Sets the target export frame rate in Hz. |
| `targetWidth` | Sets the target output width when used with `targetHeight`. |
| `targetHeight` | Sets the target output height when used with `targetWidth`. |
| `allowTextOverhang` | Includes glyph overhang bounds to avoid clipping text during export. |

## API Reference

| Swift API | Purpose |
| --- | --- |
| `engine.scene.createVideo()` | Create a scene in video mode. |
| `engine.block.create(_:)` | Create pages, tracks, graphics, audio-only timeline blocks, and other blocks. |
| `engine.block.createFill(_:)` | Create video or color fills. |
| `engine.block.createShape(_:)` | Create a shape for a graphic block. |
| `engine.block.appendChild(to:child:)` | Add pages, tracks, clips, and overlays to the hierarchy. |
| `engine.block.setString(_:property:value:)` | Set the source URI on a video fill via `"fill/video/fileURI"`. |
| `engine.block.setContentFillMode(_:mode:)` | Control how video content fits inside the graphic block. |
| `engine.block.setDuration(_:duration:)` | Set page or block playback duration in seconds. |
| `engine.block.setTimeOffset(_:offset:)` | Set when a block starts in its parent timeline. |
| `engine.block.forceLoadAVResource(_:)` | Load audio or video metadata before trim and duration queries. |
| `engine.block.getAVResourceTotalDuration(_:)` | Read the loaded media duration. |
| `engine.block.setTrimOffset(_:offset:)` | Set the source media start offset. |
| `engine.block.setTrimLength(_:length:)` | Set the source media playback length. |
| `engine.block.split(_:atTime:options:)` | Split a timed block and return the second segment. |
| `engine.block.setMuted(_:muted:)` | Mute audio on a video fill or audio block. |
| `engine.block.setVolume(_:volume:)` | Set audio volume from `0` to `1` on a video fill or audio block. |
| `engine.block.exportVideo(_:mimeType:options:)` | Export one edited page as a stream of progress events and final video bytes. |

## Next Steps

- [Control Audio and Video](../create-video/control.md) — Learn to play, pause, seek, and preview audio and video content in CE.SDK using playback controls and solo mode.
- [Trim](./trim.md) — Control which portion of source media plays




---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support