> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Adjust Speed](./adjust-speed.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-audio-adjust-speed/CreateAudioAdjustSpeed.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createAudioAdjustSpeed(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)

  let baseURL = try engine.guidesBaseURL

  let audioBlock = try engine.block.create(.audio)
  try engine.block.setURL(
    audioBlock,
    property: "audio/fileURI",
    value: baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a"),
  )
  // Wait for the audio resource to load so duration and speed APIs work correctly.
  try await engine.block.forceLoadAVResource(audioBlock)

  // Slow Motion Audio (0.5x — half speed, doubles duration).
  let slowAudioBlock = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: slowAudioBlock)
  try engine.block.setTimeOffset(slowAudioBlock, offset: 0)
  try engine.block.setPlaybackSpeed(slowAudioBlock, speed: 0.5)

  // Normal Speed Audio (1.0x — original playback rate).
  let normalAudioBlock = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: normalAudioBlock)
  try engine.block.setTimeOffset(normalAudioBlock, offset: 5)
  try engine.block.setPlaybackSpeed(normalAudioBlock, speed: 1.0)

  // Query current speed to verify the change.
  let currentSpeed = try engine.block.getPlaybackSpeed(normalAudioBlock)
  print("Normal speed block set to: \(currentSpeed)x")

  // Maximum Speed Audio (3.0x — triple speed, reduces duration to 1/3).
  let maxSpeedAudioBlock = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: maxSpeedAudioBlock)
  try engine.block.setTimeOffset(maxSpeedAudioBlock, offset: 10)
  try engine.block.setPlaybackSpeed(maxSpeedAudioBlock, speed: 3.0)

  // Log duration changes to demonstrate the speed-duration relationship.
  let slowDuration = try engine.block.getDuration(slowAudioBlock)
  let normalDuration = try engine.block.getDuration(normalAudioBlock)
  let maxDuration = try engine.block.getDuration(maxSpeedAudioBlock)

  print(String(format: "Slow motion (0.5x) duration: %.2fs", slowDuration))
  print(String(format: "Normal speed (1.0x) duration: %.2fs", normalDuration))
  print(String(format: "Maximum speed (3.0x) duration: %.2fs", maxDuration))

  // Remove the original audio block (we only need the duplicates).
  try engine.block.destroy(audioBlock)

  let sceneContent = try await engine.scene.saveToString()

  _ = sceneContent
}
```

Control audio playback speed programmatically using CE.SDK's headless engine,
from quarter-speed (0.25x) to triple-speed (3.0x).

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-create-audio-adjust-speed)

Playback speed adjustment changes how fast or slow audio plays. A speed multiplier of 1.0 represents normal speed, values below 1.0 slow down playback, and values above 1.0 speed it up. This technique is commonly used for podcast speed controls, time-compressed narration, slow-motion audio effects, and accessibility features.

This guide covers how to adjust audio playback speed programmatically using the Engine API, understand speed constraints, and manage how speed changes affect block duration.

## Understanding Speed Concepts

CE.SDK supports playback speeds from **0.25x** (quarter speed) to **3.0x** (triple speed), with **1.0x** as the default normal speed. Values below 1.0 slow down playback, values above 1.0 speed it up.

**Speed and Duration**: Adjusting speed automatically changes the block's duration following an inverse relationship: `perceived_duration = original_duration / speed_multiplier`. A 10-second clip at 2.0x speed plays in 5 seconds; at 0.5x speed it takes 20 seconds. This automatic adjustment maintains synchronization when coordinating audio with other elements.

**Common use cases**: Podcast playback controls (1.5x–2.0x), accessibility features (0.75x for easier comprehension), time-compressed narration, dramatic slow-motion effects (0.25x–0.5x), transcription work, and music tempo adjustments.

## Setting Up the Engine

Audio blocks require a scene with timeline support. Create a video scene and add a page to host the audio blocks.

```swift highlight-createAudioAdjustSpeed-setup
let scene = try engine.scene.createVideo()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setWidth(page, value: 1920)
try engine.block.setHeight(page, value: 1080)
```

## Setting Up Audio for Speed Adjustment

### Loading Audio Files

Create an audio block and load an audio file by setting its `audio/fileURI` property.

```swift highlight-createAudioAdjustSpeed-createAudio
let audioBlock = try engine.block.create(.audio)
try engine.block.setURL(
  audioBlock,
  property: "audio/fileURI",
  value: baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a"),
)
// Wait for the audio resource to load so duration and speed APIs work correctly.
try await engine.block.forceLoadAVResource(audioBlock)
```

Unlike video or image blocks that use fills, audio blocks store the file URI directly on the block itself via the `audio/fileURI` property. Awaiting `forceLoadAVResource` ensures CE.SDK has downloaded the audio file and loaded its metadata, which is essential for accurate duration information and playback speed control.

## Adjusting Playback Speed

### Setting Normal Speed

By default, audio plays at normal speed (1.0x). Set it explicitly to ensure consistent baseline behavior, and call `getPlaybackSpeed` to read the current multiplier.

```swift highlight-createAudioAdjustSpeed-setNormalSpeed
  // Normal Speed Audio (1.0x — original playback rate).
  let normalAudioBlock = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: normalAudioBlock)
  try engine.block.setTimeOffset(normalAudioBlock, offset: 5)
  try engine.block.setPlaybackSpeed(normalAudioBlock, speed: 1.0)

  // Query current speed to verify the change.
  let currentSpeed = try engine.block.getPlaybackSpeed(normalAudioBlock)
  print("Normal speed block set to: \(currentSpeed)x")
```

Setting speed to 1.0 ensures the audio plays at its original recorded rate. This is useful after experimenting with different speeds and wanting to return to normal, or when initializing audio blocks programmatically to ensure consistent starting states. Reading back the current speed is handy for populating UI controls or validating relative adjustments.

## Common Speed Presets

### Slow Motion Audio (0.5x)

Slowing audio to half speed creates a slow-motion effect that's useful for careful listening or transcription.

```swift highlight-createAudioAdjustSpeed-setSlowMotion
// Slow Motion Audio (0.5x — half speed, doubles duration).
let slowAudioBlock = try engine.block.duplicate(audioBlock)
try engine.block.appendChild(to: page, child: slowAudioBlock)
try engine.block.setTimeOffset(slowAudioBlock, offset: 0)
try engine.block.setPlaybackSpeed(slowAudioBlock, speed: 0.5)
```

At 0.5x speed, a 10-second audio clip will take 20 seconds to play. This slower pace makes it easier to catch details, transcribe speech accurately, or create dramatic slow-motion audio effects in creative projects.

### Maximum Speed (3.0x)

The maximum supported speed is 3.0x, three times normal playback rate.

```swift highlight-createAudioAdjustSpeed-setMaximumSpeed
// Maximum Speed Audio (3.0x — triple speed, reduces duration to 1/3).
let maxSpeedAudioBlock = try engine.block.duplicate(audioBlock)
try engine.block.appendChild(to: page, child: maxSpeedAudioBlock)
try engine.block.setTimeOffset(maxSpeedAudioBlock, offset: 10)
try engine.block.setPlaybackSpeed(maxSpeedAudioBlock, speed: 3.0)
```

At maximum speed, audio plays very quickly — a 10-second clip finishes in just 3.33 seconds. This extreme speed is useful for rapidly skimming through content to find specific moments, though comprehension becomes challenging at this rate.

## Speed and Block Duration

### Understanding Duration Changes

When you change playback speed, CE.SDK automatically adjusts the block's duration to reflect the new playback time.

```swift highlight-createAudioAdjustSpeed-speedAndDuration
  // Log duration changes to demonstrate the speed-duration relationship.
  let slowDuration = try engine.block.getDuration(slowAudioBlock)
  let normalDuration = try engine.block.getDuration(normalAudioBlock)
  let maxDuration = try engine.block.getDuration(maxSpeedAudioBlock)

  print(String(format: "Slow motion (0.5x) duration: %.2fs", slowDuration))
  print(String(format: "Normal speed (1.0x) duration: %.2fs", normalDuration))
  print(String(format: "Maximum speed (3.0x) duration: %.2fs", maxDuration))
```

The logged durations illustrate the inverse relationship: the 0.5x block reports roughly double the source duration, the 1.0x block reports the source duration, and the 3.0x block reports about one-third. The audio content is identical across all three blocks — only the playback rate differs, and CE.SDK shrinks or extends the block's duration accordingly so the timeline stays synchronized.

## Exporting Results

After adjusting audio speeds, serialize the scene to preserve your work. `engine.scene.saveToString()` captures the entire scene, including every audio block with its speed setting.

```swift highlight-createAudioAdjustSpeed-export
let sceneContent = try await engine.scene.saveToString()
```

The returned `.scene` string can be loaded later for further editing or used as a template for batch processing workflows.

## API Reference

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `engine.block.create(.audio)` | Creates a new audio block | — | `DesignBlockID` |
| `engine.block.setString(_:property:value:)` | Sets a string property on a block | `id: DesignBlockID, property: String, value: String` | `Void` |
| `engine.block.forceLoadAVResource(_:)` | Forces loading of audio resource metadata | `id: DesignBlockID` | `async throws` |
| `engine.block.duplicate(_:attachToParent:)` | Duplicates a block including its children | `id: DesignBlockID, attachToParent: Bool = true` | `DesignBlockID` |
| `engine.block.setTimeOffset(_:offset:)` | Sets the block's time offset on the timeline | `id: DesignBlockID, offset: Double` | `Void` |
| `engine.block.setPlaybackSpeed(_:speed:)` | Sets the playback speed multiplier. Valid range is \[0.25, 3.0] for audio blocks. Also adjusts duration | `id: DesignBlockID, speed: Float` | `Void` |
| `engine.block.getPlaybackSpeed(_:)` | Gets the current playback speed multiplier | `id: DesignBlockID` | `Float` |
| `engine.block.getDuration(_:)` | Gets the playback duration of a block in seconds | `id: DesignBlockID` | `Double` |
| `engine.block.destroy(_:)` | Destroys a block | `id: DesignBlockID` | `Void` |
| `engine.scene.saveToString()` | Serializes the current scene into a string | — | `async throws -> String` |

## Next Steps

- [Add Music](./add-music.md) — Add background music and audio tracks to video projects
- [Adjust Audio Volume](./adjust-volume.md) — Control audio playback levels and balance multiple audio sources
- [Add Sound Effects](./add-sound-effects.md) — Generate sound effects programmatically from raw PCM data using audio buffers
- [Loop Audio](./loop.md) — Loop audio tracks for continuous playback
- [Record Voiceover](./record-voiceover.md) — On iOS, let users capture voiceover clips directly in the editor UI



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support