> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Fade In and Out](./fade.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-audio-audio-fade/Fade.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func fadeAudio(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 30)

  let baseURL = try engine.guidesBaseURL
  let audioURL = baseURL.appendingPathComponent("ly.img.audio/audios/dance_harder.m4a")
  let videoURL = baseURL.appendingPathComponent("ly.img.video/videos/pexels-kampus-production-8154913.mp4")

  // Create an audio block, load its resource, and give it a duration on the timeline.
  let audioBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: audioBlock)
  try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioURL)
  try await engine.block.forceLoadAVResource(audioBlock)

  try engine.block.setTimeOffset(audioBlock, offset: 0)
  try engine.block.setDuration(audioBlock, duration: 12)
  try engine.block.setVolume(audioBlock, volume: 0.8)

  // Ramp up from silence over the first 3 seconds of the clip.
  try engine.block.setAudioFadeIn(audioBlock, duration: 3.0)

  // Ramp down to silence over the last 2 seconds of the clip.
  try engine.block.setAudioFadeOut(audioBlock, duration: 2.0)

  // A second clip that eases in and out instead of ramping linearly.
  let easedAudio = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: easedAudio)
  try engine.block.setTimeOffset(easedAudio, offset: 14)
  try engine.block.setDuration(easedAudio, duration: 12)
  try engine.block.setAudioFadeIn(easedAudio, duration: 3.0, easing: .easeInOut)
  try engine.block.setAudioFadeOut(easedAudio, duration: 3.0, easing: .easeOut)

  // Build a video block whose fill carries the embedded audio.
  let videoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(videoBlock, shape: engine.block.createShape(.rect))
  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(videoBlock, fill: videoFill)
  try engine.block.appendChild(to: page, child: videoBlock)
  try engine.block.fillParent(videoBlock)
  try await engine.block.forceLoadAVResource(videoFill)
  try engine.block.setDuration(videoBlock, duration: 10)

  // Video audio lives on the video fill, so resolve the fill first — exactly as with `setVolume`.
  let fill = try engine.block.getFill(videoBlock)
  try engine.block.setAudioFadeIn(fill, duration: 1.5)
  try engine.block.setAudioFadeOut(fill, duration: 1.5, easing: .easeOut)

  // Read the configuration back through the block properties to drive UI controls.
  let fadeInDuration = try engine.block.getDouble(audioBlock, property: "playback/fadeIn/duration")
  let fadeInEasing = try engine.block.getEnum(audioBlock, property: "playback/fadeIn/easing")
  let fadeOutDuration = try engine.block.getDouble(audioBlock, property: "playback/fadeOut/duration")
  let fadeOutEasing = try engine.block.getEnum(audioBlock, property: "playback/fadeOut/easing")

  print("Fade in: \(fadeInDuration)s (\(fadeInEasing))")
  print("Fade out: \(fadeOutDuration)s (\(fadeOutEasing))")

  // A duration of 0 removes a fade again.
  try engine.block.setAudioFadeOut(audioBlock, duration: 0)
  let removedFadeOut = try engine.block.getDouble(audioBlock, property: "playback/fadeOut/duration")
  print("Fade out after removal: \(removedFadeOut)s")
}
```

Ramp audio up at the start of a clip and down at the end using CE.SDK's Engine
API for Swift, with a duration in seconds and an optional easing curve.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1/engine-guides-create-audio-audio-fade)

<EngineReferenceNote {...props} />

An audio fade ramps the volume of a clip between silence and its configured volume over a fixed duration. Use `setAudioFadeIn(_:duration:easing:)` for the start of a clip and `setAudioFadeOut(_:duration:easing:)` for the end. Both take a duration in seconds and an optional easing curve, and a duration of `0` — the default — means no fade.

## Understanding Audio Fades

### How the Fade Gain Is Applied

The fade produces a gain between `0.0` and `1.0` that is multiplied with the block's volume. A fade-in on a block at 50% volume therefore ramps from silence to 50%, not to 100%. Fades combine with page volume, muting, and clip transitions the same way.

### Fades Are Anchored to the Timeline

The fade-in window starts at the beginning of the block and the fade-out window ends at the end of the block, measured against the block's timeline duration. Trimming or resizing a clip keeps the fade-in at the audible start and the fade-out at the audible end.

## Setting Up an Audio Clip

Create an audio block, load its resource, and place it on the timeline. The `forceLoadAVResource(_:)` call ensures the audio file and its metadata are available before the block is configured.

```swift highlight-fadeAudio-create-audio
  // Create an audio block, load its resource, and give it a duration on the timeline.
  let audioBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: audioBlock)
  try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioURL)
  try await engine.block.forceLoadAVResource(audioBlock)

  try engine.block.setTimeOffset(audioBlock, offset: 0)
  try engine.block.setDuration(audioBlock, duration: 12)
  try engine.block.setVolume(audioBlock, volume: 0.8)
```

Fades apply only to audio blocks and video fills. Passing any other block — including a page or the graphic block that owns a video fill — throws.

## Fading Audio In

Set a fade-in with `setAudioFadeIn(_:duration:easing:)`. The audio ramps up from silence over the given number of seconds at the start of the block.

```swift highlight-fadeAudio-fade-in
// Ramp up from silence over the first 3 seconds of the clip.
try engine.block.setAudioFadeIn(audioBlock, duration: 3.0)
```

Negative and `NaN` durations are clamped to `0`, which disables the fade.

## Fading Audio Out

Set a fade-out with `setAudioFadeOut(_:duration:easing:)`. The audio ramps down to silence over the last seconds of the block.

```swift highlight-fadeAudio-fade-out
// Ramp down to silence over the last 2 seconds of the clip.
try engine.block.setAudioFadeOut(audioBlock, duration: 2.0)
```

If the fade-out is longer than the clip, the window is clamped to the block, so the clip starts partly faded out.

## Choosing an Easing Curve

Both methods take an optional `AnimationEasing` curve as their third argument, defaulting to `.linear`. `.linear` changes the gain at a constant rate, while `.easeIn`, `.easeOut`, and `.easeInOut` bias the ramp towards the start, the end, or both. The full set of curves is the same one used by block animations, including the quart, quint, back, and spring variants.

```swift highlight-fadeAudio-easing
// A second clip that eases in and out instead of ramping linearly.
let easedAudio = try engine.block.duplicate(audioBlock)
try engine.block.appendChild(to: page, child: easedAudio)
try engine.block.setTimeOffset(easedAudio, offset: 14)
try engine.block.setDuration(easedAudio, duration: 12)
try engine.block.setAudioFadeIn(easedAudio, duration: 3.0, easing: .easeInOut)
try engine.block.setAudioFadeOut(easedAudio, duration: 3.0, easing: .easeOut)
```

## Fading Video Audio

Video audio lives on the video fill, not on the graphic block. Resolve the fill with `getFill(_:)` and set the fade on it, exactly as with `setVolume(_:volume:)`. The fade window still follows the graphic block's position and duration on the timeline.

```swift highlight-fadeAudio-video-fill
// Video audio lives on the video fill, so resolve the fill first — exactly as with `setVolume`.
let fill = try engine.block.getFill(videoBlock)
try engine.block.setAudioFadeIn(fill, duration: 1.5)
try engine.block.setAudioFadeOut(fill, duration: 1.5, easing: .easeOut)
```

## Reading the Fade Configuration

Fades are exposed as block properties, so `getDouble(_:property:)` and `getEnum(_:property:)` read the current configuration back for UI controls.

```swift highlight-fadeAudio-read-fades
  // Read the configuration back through the block properties to drive UI controls.
  let fadeInDuration = try engine.block.getDouble(audioBlock, property: "playback/fadeIn/duration")
  let fadeInEasing = try engine.block.getEnum(audioBlock, property: "playback/fadeIn/easing")
  let fadeOutDuration = try engine.block.getDouble(audioBlock, property: "playback/fadeOut/duration")
  let fadeOutEasing = try engine.block.getEnum(audioBlock, property: "playback/fadeOut/easing")

  print("Fade in: \(fadeInDuration)s (\(fadeInEasing))")
  print("Fade out: \(fadeOutDuration)s (\(fadeOutEasing))")
```

| Property                    | Type   | Description                          |
| --------------------------- | ------ | ------------------------------------ |
| `playback/fadeIn/duration`  | Double | Fade-in duration in seconds          |
| `playback/fadeIn/easing`    | Enum   | Easing curve of the fade-in          |
| `playback/fadeOut/duration` | Double | Fade-out duration in seconds         |
| `playback/fadeOut/easing`   | Enum   | Easing curve of the fade-out         |

## Removing a Fade

Setting a duration of `0` removes a fade.

```swift highlight-fadeAudio-remove-fade
// A duration of 0 removes a fade again.
try engine.block.setAudioFadeOut(audioBlock, duration: 0)
let removedFadeOut = try engine.block.getDouble(audioBlock, property: "playback/fadeOut/duration")
print("Fade out after removal: \(removedFadeOut)s")
```

## Fades, Trimming, and Splitting

Because the windows are anchored to the block's timeline duration, shortening a clip moves the fade-out with the new end rather than leaving it stranded inside the clip. Splitting a clip keeps only the outer fades — the first half keeps its fade-in and the second half keeps its fade-out — so the audio does not dip at the cut.

## Troubleshooting

### Fade Is Not Audible

Check that the block is not muted with `isMuted(_:)` and that its volume is above `0`. The fade gain multiplies the block's volume, so a fade on a silent block stays silent.

### Setting a Fade Fails

Fades apply only to audio blocks and video fills. Pass the video fill returned by `getFill(_:)`, not the graphic block that owns it.

### Fade-Out Is Longer Than the Clip

The window is clamped to the block, so the clip starts partly faded out. Shorten the fade or lengthen the clip.

### Fade Disappeared After Splitting

Each half of a split keeps only the fade at its outer edge, so the fade-out of the first half and the fade-in of the second half are dropped.

## API Reference

### Methods

| Method                                        | Description                                        |
| --------------------------------------------- | -------------------------------------------------- |
| `block.setAudioFadeIn(_:duration:easing:)`    | Ramp audio up at the start of the block             |
| `block.setAudioFadeOut(_:duration:easing:)`   | Ramp audio down at the end of the block             |
| `block.getDouble(_:property:)`                | Read a fade duration                                |
| `block.getEnum(_:property:)`                  | Read a fade easing curve                            |
| `block.setVolume(_:volume:)`                  | Set the volume the fade ramps towards               |
| `block.getFill(_:)`                           | Resolve the video fill that carries the audio       |
| `block.forceLoadAVResource(_:)`               | Load the audio resource and its metadata            |

## Next Steps

- [Adjust Volume](./adjust-volume.md) — Set the level a fade ramps towards
- [Add Music](./add-music.md) — Add background music and audio tracks
- [Apply Transitions](../../create-video/apply-transitions.md) — Cross-fade between clips on a track
- [Split](../../edit-video/split.md) — Split clips on the timeline
- [Trim](../../edit-video/trim.md) — Trim clips without stranding their fades



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support