> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Control Audio and Video](./control.md)

---

Play, pause, seek, and preview audio and video content programmatically using CE.SDK's playback control APIs.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-create-video-control)

<EngineReferenceNote {...props} />

CE.SDK provides playback control for audio and video through the Block API. Playback state, seeking, and solo preview are controlled programmatically. Resources must be loaded before accessing metadata like duration and dimensions.

```swift file=@cesdk_swift_examples/engine-guides-create-video-control/ControlAVPlayback.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func controlAVPlayback(engine: Engine) async throws {
  // Demo scaffolding: a video scene with a single video block on a track.
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)

  let baseURL = try engine.guidesBaseURL

  let videoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(videoBlock, shape: engine.block.createShape(.rect))
  let videoFill = try engine.block.createFill(.video)
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(videoBlock, fill: videoFill)

  let track = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: track)
  try engine.block.appendChild(to: track, child: videoBlock)
  try engine.block.fillParent(track)
  try engine.block.setDuration(videoBlock, duration: 10)

  try await engine.block.forceLoadAVResource(videoFill)

  let videoWidth = try engine.block.getVideoWidth(videoFill)
  let videoHeight = try engine.block.getVideoHeight(videoFill)
  let totalDuration = try engine.block.getAVResourceTotalDuration(videoFill)
  _ = (videoWidth, videoHeight, totalDuration)

  if try engine.block.supportsPlaybackControl(page) {
    let isPlaying = try engine.block.isPlaying(page)
    try engine.block.setPlaying(page, enabled: !isPlaying)
  }

  var currentTime: Double = 0
  if try engine.block.supportsPlaybackTime(page) {
    try engine.block.setPlaybackTime(page, time: 3.0)
    currentTime = try engine.block.getPlaybackTime(page)
  }
  _ = currentTime

  let isVisible = try engine.block.isVisibleAtCurrentPlaybackTime(videoBlock)
  _ = isVisible

  try engine.block.setSoloPlaybackEnabled(videoFill, enabled: true)
  let soloEnabled = try engine.block.isSoloPlaybackEnabled(videoFill)
  try engine.block.setSoloPlaybackEnabled(videoFill, enabled: false)
  _ = soloEnabled
}
```

This guide covers how to play and pause media, seek to specific positions, preview individual blocks with solo mode, check visibility at playback time, and access video resource metadata.

## Force Loading Resources

Media resource metadata is unavailable until the resource is loaded. Call `forceLoadAVResource(_:)` on the video fill to ensure dimensions and duration are accessible. The method is `async throws` — the call suspends until the resource finishes loading.

```swift highlight-controlAV-forceLoad
try await engine.block.forceLoadAVResource(videoFill)
```

Without loading the resource first, accessing properties like duration or dimensions throws an error.

## Getting Video Metadata

Once the resource is loaded, query the video dimensions and total duration.

```swift highlight-controlAV-metadata
let videoWidth = try engine.block.getVideoWidth(videoFill)
let videoHeight = try engine.block.getVideoHeight(videoFill)
let totalDuration = try engine.block.getAVResourceTotalDuration(videoFill)
```

`getVideoWidth(_:)` and `getVideoHeight(_:)` return the original video dimensions in pixels as `Int`. `getAVResourceTotalDuration(_:)` returns the full duration of the source media in seconds as a `Double`.

## Playing and Pausing

Check if the block supports playback control with `supportsPlaybackControl(_:)`, then start or stop playback with `setPlaying(_:enabled:)`. `isPlaying(_:)` returns the current playback state.

```swift highlight-controlAV-playbackControl
if try engine.block.supportsPlaybackControl(page) {
  let isPlaying = try engine.block.isPlaying(page)
  try engine.block.setPlaying(page, enabled: !isPlaying)
}
```

Pass the page (or scene) to control timeline playback. Audio blocks and video fills also accept these calls when you want to drive a single clip independently.

## Seeking

Jump to a specific playback position with `setPlaybackTime(_:time:)`. Check `supportsPlaybackTime(_:)` first to confirm the block is on the timeline. `getPlaybackTime(_:)` returns the current position.

```swift highlight-controlAV-seeking
var currentTime: Double = 0
if try engine.block.supportsPlaybackTime(page) {
  try engine.block.setPlaybackTime(page, time: 3.0)
  currentTime = try engine.block.getPlaybackTime(page)
}
```

Playback time is measured in seconds from the start of the timeline.

## Visibility at Current Time

Use `isVisibleAtCurrentPlaybackTime(_:)` to check whether a block is visible on the canvas at the current playback position. This is useful when blocks have different time offsets or durations.

```swift highlight-controlAV-visibility
let isVisible = try engine.block.isVisibleAtCurrentPlaybackTime(videoBlock)
```

## Solo Playback

Solo playback previews an individual block while the rest of the scene stays frozen. Enable it on a video fill or audio block with `setSoloPlaybackEnabled(_:enabled:)`.

```swift highlight-controlAV-solo
try engine.block.setSoloPlaybackEnabled(videoFill, enabled: true)
let soloEnabled = try engine.block.isSoloPlaybackEnabled(videoFill)
try engine.block.setSoloPlaybackEnabled(videoFill, enabled: false)
```

Setting solo to `true` on one block automatically sets it to `false` on every other block. Query the current state with `isSoloPlaybackEnabled(_:)`.

## Troubleshooting

### Properties Unavailable Before Resource Load

**Symptom**: Accessing duration, dimensions, or trim values throws an error.

**Cause**: Media resource not yet loaded.

**Solution**: Always `await engine.block.forceLoadAVResource(_:)` before accessing these properties.

### Block Not Playing

**Symptom**: Calling `setPlaying(_:enabled:)` has no effect.

**Cause**: Block doesn't support playback control or scene not in playback mode.

**Solution**: Check `supportsPlaybackControl(_:)` returns `true`; ensure scene playback is active.

### Solo Playback Not Working

**Symptom**: Enabling solo doesn't isolate the block.

**Cause**: Solo applied to wrong block type or block not visible.

**Solution**: Apply solo to video fills or audio blocks; ensure the block is at the current playback time.

## API Reference

| Method | Purpose |
| --- | --- |
| `setPlaying(_:enabled:)` | Enable or disable block playback |
| `isPlaying(_:)` | Check whether the block is playing |
| `setSoloPlaybackEnabled(_:enabled:)` | Enable or disable solo playback mode |
| `isSoloPlaybackEnabled(_:)` | Check whether solo playback is enabled |
| `supportsPlaybackTime(_:)` | Check whether the block has a playback time property |
| `setPlaybackTime(_:time:)` | Set the current playback position in seconds |
| `getPlaybackTime(_:)` | Get the current playback position in seconds |
| `isVisibleAtCurrentPlaybackTime(_:)` | Check whether the block is visible at the current playback time |
| `supportsPlaybackControl(_:)` | Check whether the block supports playback control |
| `forceLoadAVResource(_:)` | Force load media resource metadata (async) |
| `getAVResourceTotalDuration(_:)` | Get the source media duration in seconds |
| `getVideoWidth(_:)` | Get the video width in pixels |
| `getVideoHeight(_:)` | Get the video height in pixels |

## Next Steps

- [Trim Video and Audio](../edit-video/trim.md) — Control which portion of source media plays
- [Loop Audio](../create-audio/audio/loop.md) — Enable repeating playback for audio blocks
- [Adjust Volume](../create-audio/audio/adjust-volume.md) — Control audio volume and muting
- [Adjust Speed](../create-audio/audio/adjust-speed.md) — Change playback speed for audio
- [Video Timeline Overview](./timeline-editor.md) — Timeline editing system



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support