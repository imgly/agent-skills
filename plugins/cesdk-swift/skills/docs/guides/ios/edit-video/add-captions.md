> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Add Captions](./add-captions.md)

---

```swift file=@cesdk_swift_examples/engine-guides-captions/Captions.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func addCaptions(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.editor.setSettingBool("features/videoCaptionsEnabled", value: true)

  try engine.block.setDuration(page, duration: 20)

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
  try engine.block.setDuration(video, duration: 20)

  let videoTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: videoTrack)
  try engine.block.appendChild(to: videoTrack, child: video)
  try engine.block.fillParent(videoTrack)

  // Decode at least one video frame before exporting page snapshots so the
  // hero capture shows real footage rather than the default black poster.
  try await engine.block.forceLoadAVResource(videoFill)

  let captionTrack = try engine.block.create(.captionTrack)
  try engine.block.appendChild(to: page, child: captionTrack)

  let manageOffsetsAutomatically = false
  try engine.block.setBool(
    captionTrack,
    property: "track/automaticallyManageBlockOffsets",
    value: manageOffsetsAutomatically,
  )

  let caption1 = try engine.block.create(.caption)
  try engine.block.setString(caption1, property: "caption/text", value: "Caption text 1")
  let caption2 = try engine.block.create(.caption)
  try engine.block.setString(caption2, property: "caption/text", value: "Caption text 2")
  try engine.block.appendChild(to: captionTrack, child: caption1)
  try engine.block.appendChild(to: captionTrack, child: caption2)

  try engine.block.setDuration(caption1, duration: 3)
  try engine.block.setDuration(caption2, duration: 5)

  try engine.block.setTimeOffset(caption1, offset: 0)
  try engine.block.setTimeOffset(caption2, offset: 3)

  // Captions can also be loaded from SRT or VTT files. The text and timing of
  // each caption are read from the file. Point the URL at your own subtitle
  // file; here we write a short SRT to a temporary file for demonstration.
  let srtContents = """
  1
  00:00:08,000 --> 00:00:11,000
  Imported from an SRT file

  2
  00:00:11,000 --> 00:00:14,000
  with its own text and timing.
  """
  let srtURL = FileManager.default.temporaryDirectory.appendingPathComponent("captions.srt")
  try srtContents.write(to: srtURL, atomically: true, encoding: .utf8)

  let captions = try await engine.block.createCaptionsFromURI(srtURL)
  for caption in captions {
    try engine.block.appendChild(to: captionTrack, child: caption)
  }

  // Position and size sync only with caption blocks under the same caption track,
  // so configure them once on a single caption.
  try engine.block.setPositionX(caption1, value: 0.05)
  try engine.block.setPositionXMode(caption1, mode: .percent)
  try engine.block.setPositionY(caption1, value: 0.8)
  try engine.block.setPositionYMode(caption1, mode: .percent)
  try engine.block.setHeight(caption1, value: 0.15)
  try engine.block.setHeightMode(caption1, mode: .percent)
  try engine.block.setWidth(caption1, value: 0.9)
  try engine.block.setWidthMode(caption1, mode: .percent)

  // Style properties also sync only with caption blocks under the same caption
  // track. Set text color, drop shadow, and background with dedicated styling
  // setters, then use property-keyed setters for automatic font sizing.
  try engine.block.setTextColor(caption1, color: Color.rgba(r: 0.9, g: 0.9, b: 0.0, a: 1.0))
  try engine.block.setDropShadowEnabled(caption1, enabled: true)
  try engine.block.setDropShadowColor(caption1, color: Color.rgba(r: 0.0, g: 0.0, b: 0.0, a: 0.8))
  try engine.block.setBackgroundColorEnabled(caption1, enabled: true)
  try engine.block.setBackgroundColor(caption1, r: 0.0, g: 0.0, b: 0.0, a: 0.7)
  try engine.block.setBool(caption1, property: "caption/automaticFontSizeEnabled", value: true)
  try engine.block.setFloat(caption1, property: "caption/minAutomaticFontSize", value: 24)
  try engine.block.setFloat(caption1, property: "caption/maxAutomaticFontSize", value: 72)

  try await engine.captureGuide(page, label: "hero")

  let fadeInAnimation = try engine.block.createAnimation(.fade)
  try engine.block.setDuration(fadeInAnimation, duration: 0.3)
  try engine.block.setInAnimation(caption1, animation: fadeInAnimation)

  let exportsDirectory = FileManager.default.temporaryDirectory

  // Exporting the page as MP4 burns the caption text into every rendered frame.
  let videoStream = try await engine.block.exportVideo(page, mimeType: .mp4)
  for try await event in videoStream {
    switch event {
    case let .progress(renderedFrames, encodedFrames, totalFrames):
      print("Rendered", renderedFrames, "frames and encoded", encodedFrames, "frames out of", totalFrames)
    case let .finished(video: blob):
      try blob.write(to: exportsDirectory.appendingPathComponent("captions.mp4"))
    }
  }
}
```

Add synchronized captions to video scenes with CE.SDK's caption tracks, caption blocks, subtitle import, styling properties, and burned-in video export.

![A video page with a yellow caption rendered over surf footage at the bottom of the frame.](https://img.ly/docs/cesdk/ios/edit-video/add-captions-f67565/assets/swift-based.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260810/engine-guides-captions)

<EngineReferenceNote {...props} />

Captions in CE.SDK use the same block hierarchy as other video content: a page contains a video track and a caption track, and the caption track contains caption blocks. Each caption block stores text, a time offset, a duration, and styling properties.

This guide focuses on the Engine API. The example below builds a video page, overlays manually authored and SRT-imported captions, styles them, adds a fade-in animation, and exports the page as an MP4 with the captions burned into every frame.

## Creating a Video Scene

Create a video scene, append a page, set the page dimensions, and enable the video captions feature before adding caption blocks.

```swift highlight-addCaptions-setupScene
let scene = try engine.scene.createVideo()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setWidth(page, value: 1280)
try engine.block.setHeight(page, value: 720)
try engine.editor.setSettingBool("features/videoCaptionsEnabled", value: true)
```

`engine.scene.createVideo()` returns the scene's `DesignBlockID`. The `features/videoCaptionsEnabled` setting controls whether captions render and respond to caption-specific APIs — set it once after creating the scene.

## Setting Page Duration

The page duration defines the time range where captions can appear. This guide uses a 20-second page.

```swift highlight-addCaptions-setPageDuration
try engine.block.setDuration(page, duration: 20)
```

## Adding a Video Clip

Create a graphic block with a video fill, give it the page duration, place it on a regular video track, and size the track to fill the page. This gives the caption track real video frames to overlay during preview and export.

```swift highlight-addCaptions-addVideo
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
  try engine.block.setDuration(video, duration: 20)

  let videoTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: videoTrack)
  try engine.block.appendChild(to: videoTrack, child: video)
  try engine.block.fillParent(videoTrack)
```

`createFill(.video)` returns the video fill block, and `setURL(_:property:value:)` with the `fill/video/fileURI` property points it at the source file. The `track` parent acts as the timeline container; `fillParent(_:)` makes the track match the page size so the video covers the full frame.

## Creating a Caption Track

A caption track groups caption blocks under the page. Create it before adding manual or imported captions so every caption has the correct parent.

```swift highlight-addCaptions-createCaptionTrack
let captionTrack = try engine.block.create(.captionTrack)
try engine.block.appendChild(to: page, child: captionTrack)
```

Caption tracks can either keep each caption's explicit time offset or manage offsets automatically from child durations. Keep `track/automaticallyManageBlockOffsets` set to `false` when you import SRT or VTT captions, or whenever you want to set custom offsets yourself; set it to `true` when captions should play back sequentially without gaps.

```swift highlight-addCaptions-manageOffsets
let manageOffsetsAutomatically = false
try engine.block.setBool(
  captionTrack,
  property: "track/automaticallyManageBlockOffsets",
  value: manageOffsetsAutomatically,
)
```

## Adding Captions

### Creating Caption Blocks

Create caption blocks with `DesignBlockType.caption`, write their text with the `caption/text` property, and append them to the caption track.

```swift highlight-addCaptions-createCaptions
let caption1 = try engine.block.create(.caption)
try engine.block.setString(caption1, property: "caption/text", value: "Caption text 1")
let caption2 = try engine.block.create(.caption)
try engine.block.setString(caption2, property: "caption/text", value: "Caption text 2")
try engine.block.appendChild(to: captionTrack, child: caption1)
try engine.block.appendChild(to: captionTrack, child: caption2)
```

### Importing Captions from Subtitle Files

Use `createCaptionsFromURI(_:)` to parse SRT or VTT files. CE.SDK reads each cue's text and timing, returns the created caption block IDs, and you append them to the caption track.

```swift highlight-addCaptions-importCaptions
  // Captions can also be loaded from SRT or VTT files. The text and timing of
  // each caption are read from the file. Point the URL at your own subtitle
  // file; here we write a short SRT to a temporary file for demonstration.
  let srtContents = """
  1
  00:00:08,000 --> 00:00:11,000
  Imported from an SRT file

  2
  00:00:11,000 --> 00:00:14,000
  with its own text and timing.
  """
  let srtURL = FileManager.default.temporaryDirectory.appendingPathComponent("captions.srt")
  try srtContents.write(to: srtURL, atomically: true, encoding: .utf8)

  let captions = try await engine.block.createCaptionsFromURI(srtURL)
  for caption in captions {
    try engine.block.appendChild(to: captionTrack, child: caption)
  }
```

Imported captions are normal caption blocks, so you can style them with the same APIs as manually authored ones. Supported file formats are SRT and VTT.

## Modifying Captions

### Timing

With manual offsets, set the duration and time offset on each caption block. Time values are in seconds, so the second caption below starts where the first one ends.

```swift highlight-addCaptions-setTiming
  try engine.block.setDuration(caption1, duration: 3)
  try engine.block.setDuration(caption2, duration: 5)

  try engine.block.setTimeOffset(caption1, offset: 0)
  try engine.block.setTimeOffset(caption2, offset: 3)
```

### Position and Size

Caption position and size are synchronized between caption blocks that share the same caption track, so set the shared layout on one caption per track. Use percentage modes so the caption box stays proportional when the output resolution changes.

```swift highlight-addCaptions-positionSize
// Position and size sync only with caption blocks under the same caption track,
// so configure them once on a single caption.
try engine.block.setPositionX(caption1, value: 0.05)
try engine.block.setPositionXMode(caption1, mode: .percent)
try engine.block.setPositionY(caption1, value: 0.8)
try engine.block.setPositionYMode(caption1, mode: .percent)
try engine.block.setHeight(caption1, value: 0.15)
try engine.block.setHeightMode(caption1, mode: .percent)
try engine.block.setWidth(caption1, value: 0.9)
try engine.block.setWidthMode(caption1, mode: .percent)
```

### Styling

Caption styling properties also synchronize between caption blocks under the same caption track. The sample changes text color, drop shadow, and background with dedicated styling setters, then uses property-keyed setters for automatic font sizing.

```swift highlight-addCaptions-styleCaptions
// Style properties also sync only with caption blocks under the same caption
// track. Set text color, drop shadow, and background with dedicated styling
// setters, then use property-keyed setters for automatic font sizing.
try engine.block.setTextColor(caption1, color: Color.rgba(r: 0.9, g: 0.9, b: 0.0, a: 1.0))
try engine.block.setDropShadowEnabled(caption1, enabled: true)
try engine.block.setDropShadowColor(caption1, color: Color.rgba(r: 0.0, g: 0.0, b: 0.0, a: 0.8))
try engine.block.setBackgroundColorEnabled(caption1, enabled: true)
try engine.block.setBackgroundColor(caption1, r: 0.0, g: 0.0, b: 0.0, a: 0.7)
try engine.block.setBool(caption1, property: "caption/automaticFontSizeEnabled", value: true)
try engine.block.setFloat(caption1, property: "caption/minAutomaticFontSize", value: 24)
try engine.block.setFloat(caption1, property: "caption/maxAutomaticFontSize", value: 72)
```

If your app registers a caption-preset asset source, you can query it with `engine.asset.findAssets(sourceID:query:)` and apply a returned asset with `engine.asset.applyToBlock(sourceID:assetResult:block:)`. The example uses direct block properties so the guide does not depend on a particular preset source being registered.

## Caption Animations

Caption blocks support the same animation APIs as other animatable blocks. Create an animation, set its duration, and assign it as an in, loop, or out animation. Keep entry animations short — readability and timing matter more than motion for captions.

```swift highlight-addCaptions-addAnimation
let fadeInAnimation = try engine.block.createAnimation(.fade)
try engine.block.setDuration(fadeInAnimation, duration: 0.3)
try engine.block.setInAnimation(caption1, animation: fadeInAnimation)
```

Replace `setInAnimation(_:animation:)` with `setLoopAnimation(_:animation:)` for a continuous effect, or `setOutAnimation(_:animation:)` for an exit transition.

## Exporting Videos with Captions

Exporting the page as MP4 burns the captions into every rendered frame. The captions become part of the video and render on any platform without further configuration.

```swift highlight-addCaptions-exportVideo
// Exporting the page as MP4 burns the caption text into every rendered frame.
let videoStream = try await engine.block.exportVideo(page, mimeType: .mp4)
for try await event in videoStream {
  switch event {
  case let .progress(renderedFrames, encodedFrames, totalFrames):
    print("Rendered", renderedFrames, "frames and encoded", encodedFrames, "frames out of", totalFrames)
  case let .finished(video: blob):
    try blob.write(to: exportsDirectory.appendingPathComponent("captions.mp4"))
  }
}
```

`exportVideo(_:mimeType:)` returns an `AsyncThrowingStream<VideoExport, Error>` that emits `.progress(...)` events while encoding and a final `.finished(video:)` event with the encoded MP4 bytes as a `Data` value. Changes made to the scene after export starts do not appear in the exported file — the engine freezes the scene state for the export run.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Captions are not visible | The caption is not under a caption track on the page | Check the hierarchy: page → caption track → caption block |
| Caption appears at the wrong time | The time offset or duration is wrong, or automatic offset management is enabled when custom offsets are expected | Read back `getTimeOffset(_:)` and `getDuration(_:)`, then check `track/automaticallyManageBlockOffsets` on the caption track |
| Subtitle import fails | The URI does not resolve to a valid SRT or VTT file | Confirm the URI is reachable and the file is well-formed |
| Styling is not applied | The property key is not a caption or text property | Use caption properties such as `caption/text`, `caption/automaticFontSizeEnabled`, and text styling setters |

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.createVideo()` | Create a video scene |
| `engine.editor.setSettingBool("features/videoCaptionsEnabled", value: _)` | Enable caption editing features |
| `engine.block.create(.page)` | Create the page that holds the video and caption tracks |
| `engine.block.create(.graphic)` | Create a block for the video clip |
| `engine.block.createShape(.rect)` | Create a rectangular shape for the video block |
| `engine.block.setShape(_:shape:)` | Assign the shape to the video block |
| `engine.block.createFill(.video)` | Create a video fill |
| `engine.block.setURL(_:property:value:)` (`fill/video/fileURI`) | Set the video file URL |
| `engine.block.setFill(_:fill:)` | Assign the video fill to the video block |
| `engine.block.create(.track)` | Create a video track |
| `engine.block.create(.captionTrack)` | Create a caption track |
| `engine.block.setBool(_:property:value:)` (`track/automaticallyManageBlockOffsets`) | Enable or disable automatic caption offset management |
| `engine.block.create(.caption)` | Create a caption block |
| `engine.block.createCaptionsFromURI(_:)` | Import SRT or VTT captions |
| `engine.block.appendChild(to:child:)` | Add tracks and blocks to the hierarchy |
| `engine.block.fillParent(_:)` | Size a track to the page |
| `engine.block.setString(_:property:value:)` (`caption/text`) | Set caption text |
| `engine.block.setTimeOffset(_:offset:)` | Set when a caption appears |
| `engine.block.setDuration(_:duration:)` | Set page, video, caption, or animation duration |
| `engine.block.getTimeOffset(_:)` | Read when a caption appears |
| `engine.block.getDuration(_:)` | Read a page, video, caption, or animation duration |
| `engine.block.setPositionX(_:value:)` / `setPositionXMode(_:mode:)` | Set the caption box x position and mode |
| `engine.block.setPositionY(_:value:)` / `setPositionYMode(_:mode:)` | Set the caption box y position and mode |
| `engine.block.setWidth(_:value:maintainCrop:)` / `setWidthMode(_:mode:)` | Set the caption box width and mode |
| `engine.block.setHeight(_:value:maintainCrop:)` / `setHeightMode(_:mode:)` | Set the caption box height and mode |
| `engine.block.setTextColor(_:color:in:)` | Set caption text color |
| `engine.block.setDropShadowEnabled(_:enabled:)` | Enable the caption drop shadow |
| `engine.block.setDropShadowColor(_:color:)` | Set caption drop shadow color |
| `engine.block.setBackgroundColorEnabled(_:enabled:)` | Enable the caption background |
| `engine.block.setBackgroundColor(_:r:g:b:a:)` | Set caption background color |
| `engine.block.setBool(_:property:value:)` (`caption/automaticFontSizeEnabled`) | Enable automatic caption font sizing |
| `engine.block.setFloat(_:property:value:)` (`caption/minAutomaticFontSize`, `caption/maxAutomaticFontSize`) | Set the automatic font size bounds |
| `engine.asset.findAssets(sourceID:query:)` | Query registered caption preset assets |
| `engine.asset.applyToBlock(sourceID:assetResult:block:)` | Apply a preset asset to an existing caption block |
| `engine.block.createAnimation(_:)` | Create an animation block |
| `engine.block.setInAnimation(_:animation:)` | Assign an entry animation |
| `engine.block.setLoopAnimation(_:animation:)` | Assign a looping animation |
| `engine.block.setOutAnimation(_:animation:)` | Assign an exit animation |
| `engine.block.exportVideo(_:mimeType:)` | Export the page with burned-in captions |

## Next Steps

- [Trim Video Clips](./trim.md) — Control which portion of media plays back
- [Join and Arrange Clips](./join-and-arrange.md) — Combine multiple video clips into sequences and organize them on the timeline using tracks and time offsets.
- [Video Timeline Overview](../create-video/timeline-editor.md) — Use the timeline editor to arrange and edit video clips, audio, and animations frame by frame.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support