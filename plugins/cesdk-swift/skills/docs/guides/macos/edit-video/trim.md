> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Trim](./trim.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-video-trim/Trim.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func trim(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 60)

  let baseURL = try engine.guidesBaseURL

  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )

  func makeVideoBlock() async throws -> DesignBlockID {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    let fill = try engine.block.createFill(.video)
    try engine.block.setURL(fill, property: "fill/video/fileURI", value: videoURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try await engine.block.forceLoadAVResource(fill)
    try engine.block.setDuration(block, duration: 10)
    return block
  }

  let videoBlock = try await makeVideoBlock()
  let videoFill = try engine.block.getFill(videoBlock)
  let sourceDuration = try engine.block.getAVResourceTotalDuration(videoFill)
  print("Source media duration: \(sourceDuration)s")

  let canTrim = try engine.block.supportsTrim(videoFill)
  print("Video fill supports trimming: \(canTrim)")

  try engine.block.setTrimOffset(videoFill, offset: 2.0)
  try engine.block.setTrimLength(videoFill, length: 5.0)

  let trimOffset = try engine.block.getTrimOffset(videoFill)
  let trimLength = try engine.block.getTrimLength(videoFill)
  print("Playing \(trimLength)s starting at \(trimOffset)s into the source")

  let durationBlock = try await makeVideoBlock()
  let durationFill = try engine.block.getFill(durationBlock)
  try engine.block.setLooping(durationFill, looping: false)
  try engine.block.setTrimOffset(durationFill, offset: 3.0)
  try engine.block.setTrimLength(durationFill, length: 5.0)
  if try engine.block.supportsDuration(durationBlock) {
    try engine.block.setDuration(durationBlock, duration: 5.0)
  }

  let loopBlock = try await makeVideoBlock()
  let loopFill = try engine.block.getFill(loopBlock)
  try engine.block.setLooping(loopFill, looping: true)
  try engine.block.setTrimOffset(loopFill, offset: 5.0)
  try engine.block.setTrimLength(loopFill, length: 3.0)
  try engine.block.setDuration(loopBlock, duration: 9.0)
  print("Looping enabled: \(try engine.block.isLooping(loopFill))")

  let frameBlock = try await makeVideoBlock()
  let frameFill = try engine.block.getFill(frameBlock)
  // Supply the frame rate from your media pipeline; iOS does not expose
  // source frame rate through the Engine API.
  let knownFrameRate = 30.0
  let startFrame = 60
  let frameCount = 150
  try engine.block.setTrimOffset(frameFill, offset: Double(startFrame) / knownFrameRate)
  try engine.block.setTrimLength(frameFill, length: Double(frameCount) / knownFrameRate)

  let trimmableFills = try engine.block.find(byType: .graphic)
    .map { try engine.block.getFill($0) }
    .filter { try engine.block.supportsTrim($0) }
  for fill in trimmableFills {
    try await engine.block.forceLoadAVResource(fill)
    if try engine.block.getAVResourceTotalDuration(fill) >= 4.0 {
      try engine.block.setTrimOffset(fill, offset: 1.0)
      try engine.block.setTrimLength(fill, length: 3.0)
    }
  }

  let audioBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: audioBlock)
  let audioURL = baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a")
  try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioURL)
  try await engine.block.forceLoadAVResource(audioBlock)
  try engine.block.setTrimOffset(audioBlock, offset: 1.0)
  try engine.block.setTrimLength(audioBlock, length: 8.0)
  try engine.block.setTimeOffset(audioBlock, offset: 2.0)
  try engine.block.setDuration(audioBlock, duration: 8.0)
  try engine.block.setVolume(audioBlock, volume: 0.7)
}
```

Control which part of a video or audio source plays by setting trim offsets
and trim lengths, while leaving the original media file unchanged.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1-rc.0/engine-guides-create-video-trim)

<EngineReferenceNote {...props} />

Trimming works together with block timing. Fill-level trim values choose the
portion of the source media that plays, while block-level timing controls when
that block appears in the composition and how long it stays active. This guide
focuses on the Engine APIs for trimming video fills and audio blocks
programmatically. For UI-based timeline editing, see the
[Timeline Editor](../create-video/timeline-editor.md) guide.

## Setting Up the Scene

Create a video scene, add a page, and give the page a fixed size and total
duration so the trim demos below run against a stable timeline.

```swift highlight-trim-setupScene
let scene = try engine.scene.createVideo()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setWidth(page, value: 1280)
try engine.block.setHeight(page, value: 720)
try engine.block.setDuration(page, duration: 60)
```

## Creating a Video Block

The `makeVideoBlock` helper creates a `.graphic` block with a rectangular shape
and a video fill, appends it to the page, and assigns a 10-second block
duration. The helper awaits `forceLoadAVResource(_:)` before returning—loading
the media is mandatory because trim and duration properties rely on the
underlying clip's duration metadata.

```swift highlight-trim-makeVideoBlock
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )

  func makeVideoBlock() async throws -> DesignBlockID {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    let fill = try engine.block.createFill(.video)
    try engine.block.setURL(fill, property: "fill/video/fileURI", value: videoURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try await engine.block.forceLoadAVResource(fill)
    try engine.block.setDuration(block, duration: 10)
    return block
  }
```

## Understanding Trim Concepts

### Fill-Level Trimming

Fill-level trimming controls the source media range. Use `setTrimOffset(_:offset:)`
to choose where playback starts inside the media file and `setTrimLength(_:length:)`
to choose how much media plays from that point.

A trim offset of `2.0` skips the first two seconds of the source. A trim length
of `5.0` then plays five seconds from that offset, so the visible range runs from
second 2 to second 7 of the original media. Trimming is non-destructive—the
source file stays unchanged, so you can adjust the values at any time to show a
different portion of the same media.

### Block-Level Timing

Block-level timing controls placement in the composition. `setTimeOffset(_:offset:)`
moves a block relative to its parent timeline, while `setDuration(_:duration:)`
controls how long the block remains active.

Use trim values for source-media in and out points. Use time offset when you
need to arrange clips or audio blocks in the composition. For non-looping video
fills, changing the trim length updates the connected block duration; treat
`setDuration(_:duration:)` as timeline timing and set fill trim values explicitly
when you change source-media in or out points.

### Common Use Cases

- **Remove unwanted segments** - Skip intro or outro sections without changing the source file.
- **Extract key moments** - Use a short range from a longer video or audio clip.
- **Sync audio and video** - Trim related media independently while keeping their timeline offsets aligned.
- **Create loops** - Trim a short segment and repeat it through the block duration.

## Programmatic Video Trimming

### Checking Source Duration

Read the total duration of the loaded source with `getAVResourceTotalDuration(_:)`.
Use it to validate that a requested trim range fits within the available media
before applying it.

```swift highlight-trim-sourceDuration
let videoBlock = try await makeVideoBlock()
let videoFill = try engine.block.getFill(videoBlock)
let sourceDuration = try engine.block.getAVResourceTotalDuration(videoFill)
print("Source media duration: \(sourceDuration)s")
```

### Checking Trim Support

Check trim support before applying trim operations. Video fills and audio blocks
support trimming, but pages, scenes, and many graphic-only blocks do not. This
check keeps custom editing UI from offering trim controls on unsupported blocks.

```swift highlight-trim-checkSupport
let canTrim = try engine.block.supportsTrim(videoFill)
print("Video fill supports trimming: \(canTrim)")
```

### Trimming Video

Apply the trim offset and trim length to the video fill. The values are seconds
in the media timeline and are scaled by playback rate.

```swift highlight-trim-applyTrim
try engine.block.setTrimOffset(videoFill, offset: 2.0)
try engine.block.setTrimLength(videoFill, length: 5.0)
```

This example skips the first two seconds and plays the following five seconds.

### Getting Current Trim Values

Read trim values when you need to populate UI controls, verify a change, or make
relative adjustments. The getters return seconds, the same unit the setters take.

```swift highlight-trim-readTrimValues
let trimOffset = try engine.block.getTrimOffset(videoFill)
let trimLength = try engine.block.getTrimLength(videoFill)
print("Playing \(trimLength)s starting at \(trimOffset)s into the source")
```

## Additional Trimming Techniques

### Trimming with Block Duration

Trim length and block duration work together, but they are not interchangeable.
For non-looping video fills, call `setTrimLength(_:length:)` on the fill to choose
the source segment; the Engine updates the connected block duration from that trim
length. Use `setDuration(_:duration:)` on the block when you need to control how
long the block stays active in the composition.

```swift highlight-trim-withDuration
let durationBlock = try await makeVideoBlock()
let durationFill = try engine.block.getFill(durationBlock)
try engine.block.setLooping(durationFill, looping: false)
try engine.block.setTrimOffset(durationFill, offset: 3.0)
try engine.block.setTrimLength(durationFill, length: 5.0)
if try engine.block.supportsDuration(durationBlock) {
  try engine.block.setDuration(durationBlock, duration: 5.0)
}
```

Here the trim length and block duration are both five seconds, so the trimmed
segment plays once. To keep a block duration longer than the trim length, enable
looping before setting the longer duration.

### Trimming with Looping

Enable looping when a trimmed segment should repeat until the block duration is
filled. Check the current looping state with `isLooping(_:)`.

```swift highlight-trim-withLooping
let loopBlock = try await makeVideoBlock()
let loopFill = try engine.block.getFill(loopBlock)
try engine.block.setLooping(loopFill, looping: true)
try engine.block.setTrimOffset(loopFill, offset: 5.0)
try engine.block.setTrimLength(loopFill, length: 3.0)
try engine.block.setDuration(loopBlock, duration: 9.0)
print("Looping enabled: \(try engine.block.isLooping(loopFill))")
```

Here the three-second trimmed segment repeats to fill the nine-second block
duration. Without looping, playback stops when the trim length is reached and
the block holds the last frame for the remaining duration.

### Frame-Accurate Trimming

When your app works from known frame numbers, convert those frame values to
seconds before setting the trim APIs.

```swift highlight-trim-frameAccurate
let frameBlock = try await makeVideoBlock()
let frameFill = try engine.block.getFill(frameBlock)
// Supply the frame rate from your media pipeline; iOS does not expose
// source frame rate through the Engine API.
let knownFrameRate = 30.0
let startFrame = 60
let frameCount = 150
try engine.block.setTrimOffset(frameFill, offset: Double(startFrame) / knownFrameRate)
try engine.block.setTrimLength(frameFill, length: Double(frameCount) / knownFrameRate)
```

The trim APIs accept seconds. Keep the frame rate value tied to the source media
you are trimming.

### Batch Processing Multiple Videos

For repeated trim settings, collect the trimmable video fills, load each
resource, and apply the same range to every compatible fill once the durations
are known. Always load each fill before reading its duration—source media can
have different lengths.

```swift highlight-trim-batchVideos
let trimmableFills = try engine.block.find(byType: .graphic)
  .map { try engine.block.getFill($0) }
  .filter { try engine.block.supportsTrim($0) }
for fill in trimmableFills {
  try await engine.block.forceLoadAVResource(fill)
  if try engine.block.getAVResourceTotalDuration(fill) >= 4.0 {
    try engine.block.setTrimOffset(fill, offset: 1.0)
    try engine.block.setTrimLength(fill, length: 3.0)
  }
}
```

### Trimming Audio Blocks

Audio blocks use the same trim APIs as video fills. After loading the audio
resource, set its trim range, timeline placement, and active duration
separately.

```swift highlight-trim-audio
let audioBlock = try engine.block.create(.audio)
try engine.block.appendChild(to: page, child: audioBlock)
let audioURL = baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a")
try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioURL)
try await engine.block.forceLoadAVResource(audioBlock)
try engine.block.setTrimOffset(audioBlock, offset: 1.0)
try engine.block.setTrimLength(audioBlock, length: 8.0)
try engine.block.setTimeOffset(audioBlock, offset: 2.0)
try engine.block.setDuration(audioBlock, duration: 8.0)
try engine.block.setVolume(audioBlock, volume: 0.7)
```

Use `setTimeOffset(_:offset:)` when the audio should start later in the
composition. Match `setDuration(_:duration:)` to the trim length when the
selected audio range should play once, and use `setVolume(_:volume:)` when the
trimmed clip needs a different level.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Trim values have no visible effect | Await `forceLoadAVResource(_:)` before setting or reading trim properties. |
| Trim starts at the wrong point | Use `setTrimOffset(_:offset:)` for the source-media start point and `setTimeOffset(_:offset:)` for timeline placement. |
| Playback continues longer than expected | Check whether looping is enabled, then read back `getDuration(_:)` and `getTrimLength(_:)` after changing trim or duration controls. |
| Audio and video drift out of sync | Apply coordinated trim offsets and timeline offsets to both media blocks. |

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `find(byType:)` | Find all blocks of a `DesignBlockType` |
| `getFill(_:)` | Get the fill block attached to a graphic block |
| `setURL(_:property:value:)` | Set a URI property such as the video fill source (`fill/video/fileURI`) or audio source (`audio/fileURI`) |
| `forceLoadAVResource(_:)` | Load audio or video metadata before trim and duration access |
| `getAVResourceTotalDuration(_:)` | Return the source media duration in seconds |
| `supportsTrim(_:)` | Check whether a block or fill supports trim properties |
| `setTrimOffset(_:offset:)` | Set the source-media playback start in seconds |
| `getTrimOffset(_:)` | Read the current trim offset in seconds |
| `setTrimLength(_:length:)` | Set how much source media plays from the trim offset |
| `getTrimLength(_:)` | Read the current trim length in seconds |
| `supportsDuration(_:)` | Check whether a block supports playback duration |
| `setDuration(_:duration:)` | Set how long the block is active in the composition |
| `getDuration(_:)` | Read the block duration in seconds |
| `setTimeOffset(_:offset:)` | Set when the block becomes active in its parent timeline |
| `setLooping(_:looping:)` | Enable or disable looping for the media block or fill |
| `isLooping(_:)` | Read whether looping is enabled |
| `setVolume(_:volume:)` | Set audio volume from `0.0` to `1.0` |

## Next Steps

- [Split Video and Audio](./split.md) - Split video and audio clips at specific time points, creating two independent segments from a single clip.
- [Control Audio and Video](../create-video/control.md) - Master playback controls, volume, and muting.
- [Video Timeline Overview](../create-video/timeline-editor.md) - Understand the complete timeline editing model.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support