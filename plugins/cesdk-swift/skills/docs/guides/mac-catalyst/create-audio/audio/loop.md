> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Loop](./loop.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-audio-loop/CreateAudioLoop.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createAudioLoop(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setDuration(page, duration: 30)

  let baseURL = try engine.guidesBaseURL
  let audioURL = baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a")

  // Create an audio block and set the audio source
  let audioBlock = try engine.block.create(.audio)
  try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioURL)

  // Load the audio resource to access metadata
  try await engine.block.forceLoadAVResource(audioBlock)

  // Get the total audio duration from the loaded resource
  let audioDuration = try engine.block.getDouble(audioBlock, property: "audio/totalDuration")
  print("Audio duration: \(String(format: "%.2f", audioDuration)) seconds")

  // Enable looping: a 5-second audio with a 15-second duration loops three times
  let loopingAudio = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: loopingAudio)
  try engine.block.setTimeOffset(loopingAudio, offset: 0)
  try engine.block.setLooping(loopingAudio, looping: true)
  try engine.block.setDuration(loopingAudio, duration: 15)

  // Check whether looping is enabled on the block
  let isLooping = try engine.block.isLooping(loopingAudio)
  print("Is looping: \(isLooping)")

  // Disable looping: the audio plays once and leaves silence for the remaining duration
  let nonLoopingAudio = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: nonLoopingAudio)
  try engine.block.setTimeOffset(nonLoopingAudio, offset: 16)
  try engine.block.setLooping(nonLoopingAudio, looping: false)
  try engine.block.setDuration(nonLoopingAudio, duration: 12)

  // Combine trim settings with looping to repeat a short segment
  // A 2-second segment (1.0s–3.0s) with an 8-second duration loops four times
  let trimmedLoopAudio = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: trimmedLoopAudio)
  try engine.block.setTimeOffset(trimmedLoopAudio, offset: 29)
  try engine.block.setTrimOffset(trimmedLoopAudio, offset: 1.0)
  try engine.block.setTrimLength(trimmedLoopAudio, length: 2.0)
  try engine.block.setLooping(trimmedLoopAudio, looping: true)
  try engine.block.setDuration(trimmedLoopAudio, duration: 8.0)

  // Remove the original unparented audio block
  try engine.block.destroy(audioBlock)

  // Save the scene to a string for storage or later rendering
  let sceneString = try await engine.scene.saveToString()
  print("Scene saved (\(sceneString.count) characters)")

  _ = audioDuration
  _ = isLooping
  _ = nonLoopingAudio
  _ = trimmedLoopAudio
  _ = sceneString
}
```

Control audio looping behavior programmatically using CE.SDK's headless Swift
engine for audio processing and automated content workflows.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260829/engine-guides-create-audio-loop)

Audio looping allows media to play continuously by restarting from the beginning when it reaches the end. When you set a block's duration longer than the audio length and enable looping, CE.SDK automatically repeats the audio to fill the entire duration.

This guide covers how to enable and disable audio looping, control looping behavior with duration settings, and loop trimmed audio segments using the headless Swift engine.

## Setting Up the Scene

We create a video scene with a page that acts as the timeline container. Setting a page duration reserves space for multiple audio blocks arranged over time.

```swift highlight-createAudioLoop-setup
let scene = try engine.scene.createVideo()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setDuration(page, duration: 30)
```

All audio blocks must be children of the page to appear on the timeline.

## Understanding Audio Looping

When looping is enabled on an audio block, CE.SDK repeats the audio content from the beginning each time it reaches the end. This continues until the block's duration is filled. For example, a 5-second audio clip with looping enabled and a 15-second duration plays three complete times.

The loop transitions are seamless — CE.SDK jumps immediately from the end back to the beginning without gaps or clicks. The audio content itself determines how smooth the loop sounds. Audio files designed for looping (with matching start and end points) create perfectly seamless loops.

## Creating Audio Blocks

### Adding Audio Content

Audio blocks use file URIs to reference audio sources. We create the block and set the audio source using the `audio/fileURI` property.

```swift highlight-createAudioLoop-createAudioBlock
// Create an audio block and set the audio source
let audioBlock = try engine.block.create(.audio)
try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioURL)
```

CE.SDK supports common audio formats including MP3, M4A, WAV, and AAC.

## Enabling Audio Looping

### Loading Audio Resources

Before working with audio properties like duration or trim, we load the audio resource to ensure metadata is available.

```swift highlight-createAudioLoop-loadAudioResource
  // Load the audio resource to access metadata
  try await engine.block.forceLoadAVResource(audioBlock)

  // Get the total audio duration from the loaded resource
  let audioDuration = try engine.block.getDouble(audioBlock, property: "audio/totalDuration")
  print("Audio duration: \(String(format: "%.2f", audioDuration)) seconds")
```

Loading the resource provides access to the total audio duration via the `audio/totalDuration` property, which helps calculate how many times the audio will loop given a specific block duration.

### Setting Looping State

We enable looping by calling `setLooping(_:looping:)` with `true`. When combined with a block duration longer than the audio length, the audio repeats to fill the full duration.

```swift highlight-createAudioLoop-enableLooping
// Enable looping: a 5-second audio with a 15-second duration loops three times
let loopingAudio = try engine.block.duplicate(audioBlock)
try engine.block.appendChild(to: page, child: loopingAudio)
try engine.block.setTimeOffset(loopingAudio, offset: 0)
try engine.block.setLooping(loopingAudio, looping: true)
try engine.block.setDuration(loopingAudio, duration: 15)
```

In this example, if the audio is 5 seconds long and the block duration is 15 seconds, the audio loops three times (5 seconds × 3 = 15 seconds total).

## Querying and Controlling Looping

### Checking Looping State

We can check whether an audio block has looping enabled at any time using `isLooping(_:)`.

```swift highlight-createAudioLoop-queryLoopingState
// Check whether looping is enabled on the block
let isLooping = try engine.block.isLooping(loopingAudio)
print("Is looping: \(isLooping)")
```

This is useful when managing multiple audio tracks, allowing you to query and update looping states dynamically.

### Disabling Looping

To play audio once without repeating, set looping to `false`.

```swift highlight-createAudioLoop-nonLoopingAudio
// Disable looping: the audio plays once and leaves silence for the remaining duration
let nonLoopingAudio = try engine.block.duplicate(audioBlock)
try engine.block.appendChild(to: page, child: nonLoopingAudio)
try engine.block.setTimeOffset(nonLoopingAudio, offset: 16)
try engine.block.setLooping(nonLoopingAudio, looping: false)
try engine.block.setDuration(nonLoopingAudio, duration: 12)
```

With looping disabled and a duration longer than the audio length, the audio plays once and then stops, leaving silence for the remaining duration.

## Looping with Trim Settings

### Trimming Looped Audio

We can combine trimming with looping to create short repeating segments from longer audio files.

```swift highlight-createAudioLoop-loopingWithTrim
// Combine trim settings with looping to repeat a short segment
// A 2-second segment (1.0s–3.0s) with an 8-second duration loops four times
let trimmedLoopAudio = try engine.block.duplicate(audioBlock)
try engine.block.appendChild(to: page, child: trimmedLoopAudio)
try engine.block.setTimeOffset(trimmedLoopAudio, offset: 29)
try engine.block.setTrimOffset(trimmedLoopAudio, offset: 1.0)
try engine.block.setTrimLength(trimmedLoopAudio, length: 2.0)
try engine.block.setLooping(trimmedLoopAudio, looping: true)
try engine.block.setDuration(trimmedLoopAudio, duration: 8.0)
```

This trims the audio to a 2-second segment (from 1.0s to 3.0s of the source), then loops that segment four times to fill an 8-second duration. This technique is useful for creating rhythmic loops or extracting repeatable portions from longer audio files.

### Choosing Loop Points

For seamless loops, choose trim points where the audio content flows naturally from end to beginning. Audio with consistent rhythm, tone, and volume at trim boundaries creates the smoothest loops. Abrupt changes in content or volume at loop boundaries create noticeable transitions.

## Exporting the Scene

After configuring audio looping, we save the scene for later use or rendering. The scene file preserves all looping settings and can be loaded in any CE.SDK environment.

```swift highlight-createAudioLoop-export
// Save the scene to a string for storage or later rendering
let sceneString = try await engine.scene.saveToString()
print("Scene saved (\(sceneString.count) characters)")
```

The exported scene string contains all audio blocks with their looping configurations, ready for rendering with CE.SDK Renderer or further editing.

## Troubleshooting

**Audio not looping**: Verify looping is enabled with `isLooping(_:)` and that the block duration exceeds the audio length. Looping only takes effect when the duration allows multiple repetitions.

**Audible gaps at loop points**: Choose trim points where the audio naturally transitions from end to beginning. Audio with matching start and end volume levels creates smoother loops.

**Resource not loaded**: Always call `forceLoadAVResource(_:)` before accessing duration properties. Without loading the resource first, metadata like total duration won't be available.

## API Reference

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `engine.block.create(.audio)` | Create an audio block | `.audio` type | `DesignBlockID` |
| `engine.block.setString(_:property:value:)` | Set audio source URI | block ID, property, value | `Void` |
| `engine.block.setLooping(_:looping:)` | Enable or disable audio looping | block ID, enabled | `Void` |
| `engine.block.isLooping(_:)` | Check if audio is set to loop | block ID | `Bool` |
| `engine.block.setDuration(_:duration:)` | Set block playback duration | block ID, duration | `Void` |
| `engine.block.getDuration(_:)` | Get block duration | block ID | `Double` |
| `engine.block.setTrimOffset(_:offset:)` | Set trim start point | block ID, offset | `Void` |
| `engine.block.setTrimLength(_:length:)` | Set trim length | block ID, length | `Void` |
| `engine.block.forceLoadAVResource(_:)` | Load audio resource with metadata | block ID | `Void` |
| `engine.block.getDouble(_:property:)` | Get audio property value | block ID, property | `Double` |
| `engine.scene.saveToString()` | Export scene as string | none | `String` |

## Next Steps

- [Add Music](./add-music.md) — Add background music and audio tracks to video projects using CE.SDK's audio block system.
- [Adjust Audio Volume](./adjust-volume.md) — Control audio playback levels and balance multiple audio sources.
- [Adjust Audio Playback Speed](./adjust-speed.md) — Create slow-motion, time-stretched, and fast-forward audio effects.
- [Add Sound Effects](./add-sound-effects.md) — Generate sound effects programmatically from raw PCM data using audio buffers.
- Record Voiceover — On iOS, let users capture voiceover clips directly in the editor UI.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support