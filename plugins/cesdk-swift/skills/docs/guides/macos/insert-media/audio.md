> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Insert Media Assets](../insert-media.md) > [Insert Audio](./audio.md)

---

Add audio files to your CE.SDK scenes programmatically with the Swift Engine
API: create audio blocks, configure timeline position, and control playback
properties for background music, voiceovers, and sound effects.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/engine-guides-insert-media-audio)

<EngineReferenceNote {...props} />

Audio blocks are time-based blocks that play sound alongside the rest of a scene. They have no visual canvas representation — they live on the timeline with their own duration, offset, and volume controls, independent of the video fills attached to graphic blocks.

```swift file=@cesdk_swift_examples/engine-guides-insert-media-audio/InsertMediaAudio.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func insertMediaAudio(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.setDuration(page, duration: 30)

  let baseURL = try engine.guidesBaseURL

  // Create an audio block, point it at an audio file, and append it to a page.
  let audioBlock = try engine.block.create(.audio)
  try engine.block.setURL(
    audioBlock,
    property: "audio/fileURI",
    value: baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a"),
  )
  try engine.block.appendChild(to: page, child: audioBlock)

  // Wait for the audio resource to load before reading metadata such as duration.
  try await engine.block.forceLoadAVResource(audioBlock)

  // Start playback at the beginning of the timeline and clamp the duration to
  // the page length or the source file, whichever is shorter.
  let totalDuration = try engine.block.getAVResourceTotalDuration(audioBlock)
  try engine.block.setTimeOffset(audioBlock, offset: 0)
  try engine.block.setDuration(audioBlock, duration: min(totalDuration, 30))

  // Set the audio level. Volume is a Float ranging from 0.0 (silent) to 1.0 (full).
  try engine.block.setVolume(audioBlock, volume: 0.8)
  let currentVolume = try engine.block.getVolume(audioBlock)
  print(String(format: "Audio volume: %.0f%%", currentVolume * 100))

  // Silence the block without changing the configured volume, then read the state back.
  try engine.block.setMuted(audioBlock, muted: true)
  let muted = try engine.block.isMuted(audioBlock)
  print("Audio muted: \(muted)")

  // Enable looping so the source repeats until the block's timeline duration ends.
  try engine.block.setLooping(audioBlock, looping: true)
  let looping = try engine.block.isLooping(audioBlock)
  print("Audio looping: \(looping)")

  // Iterate every audio block in the scene and read its current configuration.
  let audioBlocks = try engine.block.find(byType: .audio)
  for block in audioBlocks {
    let uri = try engine.block.getString(block, property: "audio/fileURI")
    let offset = try engine.block.getTimeOffset(block)
    let duration = try engine.block.getDuration(block)
    let volume = try engine.block.getVolume(block)
    print(String(format: "Audio %u — offset %.1fs, duration %.1fs, volume %.0f%%, uri %@",
                 block, offset, duration, volume * 100, uri))
  }

  // Destroy the block to remove it from the scene and free its resources.
  try engine.block.destroy(audioBlock)
}
```

This guide covers creating audio blocks, configuring their time-based properties, controlling playback, and managing audio blocks in a scene.

For broader audio workflows, see the [Create and Edit Audio overview](../create-audio/audio.md). For catalog-based music selection and multiple background tracks, continue with [Add Music](../create-audio/audio/add-music.md).

## Insert an Audio File

Create an audio block with `create(_:)`, set its source file URL with `setURL(_:property:value:)` using the `audio/fileURI` property, then append it to a page with `appendChild(to:child:)`. Audio blocks must be children of a page to participate in the timeline.

```swift highlight-insertMediaAudio-createAudioBlock
// Create an audio block, point it at an audio file, and append it to a page.
let audioBlock = try engine.block.create(.audio)
try engine.block.setURL(
  audioBlock,
  property: "audio/fileURI",
  value: baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a"),
)
try engine.block.appendChild(to: page, child: audioBlock)
```

The sample resolves the demo track against the SDK's asset base URL, so it stays aligned with the packaged guide assets or your self-hosted assets. You can also pass a reachable remote URL or a local file URL resolved by your app. CE.SDK supports M4A, MP3, and WAV formats.

## Configuring Time Position

Audio blocks have time-based properties that control when and how long they play. Use `setTimeOffset(_:offset:)` for the start position and `setDuration(_:duration:)` for playback length. Call `forceLoadAVResource(_:)` first to ensure the audio file is loaded before reading metadata such as total duration.

```swift highlight-insertMediaAudio-configureTimeline
  // Wait for the audio resource to load before reading metadata such as duration.
  try await engine.block.forceLoadAVResource(audioBlock)

  // Start playback at the beginning of the timeline and clamp the duration to
  // the page length or the source file, whichever is shorter.
  let totalDuration = try engine.block.getAVResourceTotalDuration(audioBlock)
  try engine.block.setTimeOffset(audioBlock, offset: 0)
  try engine.block.setDuration(audioBlock, duration: min(totalDuration, 30))
```

`getAVResourceTotalDuration(_:)` returns the length of the source audio file in seconds. Use it to clamp the playback duration to the available content or to compute timing relative to the file length.

## Adjusting Volume

Set the audio level with `setVolume(_:volume:)`. Volume is a `Float` between `0.0` (silent) and `1.0` (full volume) and applies to both preview playback and the exported output.

```swift highlight-insertMediaAudio-adjustVolume
// Set the audio level. Volume is a Float ranging from 0.0 (silent) to 1.0 (full).
try engine.block.setVolume(audioBlock, volume: 0.8)
let currentVolume = try engine.block.getVolume(audioBlock)
print(String(format: "Audio volume: %.0f%%", currentVolume * 100))
```

Read the current level back with `getVolume(_:)`. For a deeper look at mixing and force-mute behavior, see [Adjust Volume](../create-audio/audio/adjust-volume.md).

## Muting Audio

To silence a block without changing its configured volume, use `setMuted(_:muted:)`. Muting preserves the volume value so you can restore the previous level by setting `muted` back to `false`.

```swift highlight-insertMediaAudio-muteAudio
// Silence the block without changing the configured volume, then read the state back.
try engine.block.setMuted(audioBlock, muted: true)
let muted = try engine.block.isMuted(audioBlock)
print("Audio muted: \(muted)")
```

Read the current state with `isMuted(_:)`.

## Looping Audio

Enable continuous playback with `setLooping(_:looping:)`. When looping is enabled, the source repeats until the end of the block's timeline duration is reached.

```swift highlight-insertMediaAudio-loopAudio
// Enable looping so the source repeats until the block's timeline duration ends.
try engine.block.setLooping(audioBlock, looping: true)
let looping = try engine.block.isLooping(audioBlock)
print("Audio looping: \(looping)")
```

Read the current state with `isLooping(_:)`.

## Finding Audio Blocks

Use `find(byType:)` with `DesignBlockType.audio` to retrieve every audio block in the scene. This is useful for building audio management interfaces or for batch operations such as adjusting levels across all tracks at once.

```swift highlight-insertMediaAudio-findAudioBlocks
// Iterate every audio block in the scene and read its current configuration.
let audioBlocks = try engine.block.find(byType: .audio)
for block in audioBlocks {
  let uri = try engine.block.getString(block, property: "audio/fileURI")
  let offset = try engine.block.getTimeOffset(block)
  let duration = try engine.block.getDuration(block)
  let volume = try engine.block.getVolume(block)
  print(String(format: "Audio %u — offset %.1fs, duration %.1fs, volume %.0f%%, uri %@",
               block, offset, duration, volume * 100, uri))
}
```

For each block, read the source URI with `getString(_:property:)` and the timeline properties with `getTimeOffset(_:)`, `getDuration(_:)`, and `getVolume(_:)`.

## Removing Audio

Call `destroy(_:)` to remove a block from the scene and free its resources. Destroying a block automatically detaches it from its parent.

```swift highlight-insertMediaAudio-removeAudio
// Destroy the block to remove it from the scene and free its resources.
try engine.block.destroy(audioBlock)
```

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.create(.audio)` | Block | Create a new audio block |
| `engine.block.setURL(_:property:value:)` (`audio/fileURI`) | Block | Set the audio source file |
| `engine.block.getString(_:property:)` (`audio/fileURI`) | Block | Get the audio source file |
| `engine.block.appendChild(to:child:)` | Block | Add audio to a page |
| `engine.block.forceLoadAVResource(_:)` | Block | Load audio metadata |
| `engine.block.getAVResourceTotalDuration(_:)` | Block | Get total audio file duration in seconds |
| `engine.block.setTimeOffset(_:offset:)` | Block | Set timeline start position |
| `engine.block.getTimeOffset(_:)` | Block | Get timeline start position |
| `engine.block.setDuration(_:duration:)` | Block | Set playback duration |
| `engine.block.getDuration(_:)` | Block | Get playback duration |
| `engine.block.setVolume(_:volume:)` | Block | Set volume (`0.0`–`1.0`) |
| `engine.block.getVolume(_:)` | Block | Get current volume |
| `engine.block.setMuted(_:muted:)` | Block | Mute or unmute audio |
| `engine.block.isMuted(_:)` | Block | Check if audio is muted |
| `engine.block.setLooping(_:looping:)` | Block | Enable or disable looping |
| `engine.block.isLooping(_:)` | Block | Check if looping is enabled |
| `engine.block.find(byType:)` | Block | Find all audio blocks |
| `engine.block.destroy(_:)` | Block | Remove an audio block |

## Next Steps

- [Adjust Audio Volume](../create-audio/audio/adjust-volume.md) — Fine-tune audio levels and balance multiple sources
- [Loop Audio](../create-audio/audio/loop.md) — Repeat a source for the duration of its audio block
- [Add Sound Effects](../create-audio/audio/add-sound-effects.md) — Generate procedural sound effects from PCM-backed audio buffers
- [Add Music](../create-audio/audio/add-music.md) — Add background music tracks to video projects
- [Export Overview](../export-save-publish/export/overview.md) — Export scenes with audio to MP4



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support