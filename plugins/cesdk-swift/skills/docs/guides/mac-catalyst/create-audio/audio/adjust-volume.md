> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Adjust Volume](./adjust-volume.md)

---

Control audio playback volume using CE.SDK's Engine API for Swift, from silent
(0.0) to full volume (1.0).

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260811/engine-guides-create-audio-audio-adjust-volume)

Volume control adjusts how loud or quiet audio plays during playback. CE.SDK uses a normalized 0.0–1.0 range where 0.0 is completely silent and 1.0 is full volume. This applies to both audio blocks and video fills with embedded audio. Volume settings are commonly used for balancing multiple audio sources, creating fade effects, and allowing users to adjust playback levels.

```swift file=@cesdk_swift_examples/engine-guides-create-audio-audio-adjust-volume/AdjustVolume.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func adjustVolume(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 20)

  let baseURL = try engine.guidesBaseURL
  let audioURL = baseURL.appendingPathComponent("ly.img.audio/audios/dance_harder.m4a")

  // Create an audio block and load the audio file.
  let audioBlock = try engine.block.create(.audio)
  try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioURL)

  // Wait for the audio resource to load before adjusting volume or querying state.
  try await engine.block.forceLoadAVResource(audioBlock)

  // Set volume to 80% (0.8 on a 0.0-1.0 scale).
  let fullVolumeAudio = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: fullVolumeAudio)
  try engine.block.setTimeOffset(fullVolumeAudio, offset: 0)
  try engine.block.setVolume(fullVolumeAudio, volume: 0.8)

  // Set volume to 30% for background music.
  let lowVolumeAudio = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: lowVolumeAudio)
  try engine.block.setTimeOffset(lowVolumeAudio, offset: 5)
  try engine.block.setVolume(lowVolumeAudio, volume: 0.3)

  // Mute an audio block. The volume setting is preserved so unmuting restores playback at the same level.
  let mutedAudio = try engine.block.duplicate(audioBlock)
  try engine.block.appendChild(to: page, child: mutedAudio)
  try engine.block.setTimeOffset(mutedAudio, offset: 10)
  try engine.block.setVolume(mutedAudio, volume: 1.0)
  try engine.block.setMuted(mutedAudio, muted: true)

  // Query current volume and mute states.
  let currentVolume = try engine.block.getVolume(fullVolumeAudio)
  let lowVolume = try engine.block.getVolume(lowVolumeAudio)
  let isMuted = try engine.block.isMuted(mutedAudio)
  let isForceMuted = try engine.block.isForceMuted(mutedAudio)

  print(String(format: "Full volume audio: %.0f%%", currentVolume * 100))
  print(String(format: "Low volume audio: %.0f%%", lowVolume * 100))
  print("Muted audio — isMuted: \(isMuted), isForceMuted: \(isForceMuted)")

  // Map a slider value (0-100) to the normalized 0.0-1.0 volume range.
  let sliderValue: Float = 75
  let volume = sliderValue / 100
  try engine.block.setVolume(fullVolumeAudio, volume: volume)

  // Toggle mute state and react to a force-muted block (e.g. video fill playing above 3.0x).
  let currentlyMuted = try engine.block.isMuted(mutedAudio)
  try engine.block.setMuted(mutedAudio, muted: !currentlyMuted)

  if try engine.block.isForceMuted(mutedAudio) {
    // Show a distinct "force muted" indicator in the UI.
  }

  // Remove the original audio block; only the duplicates are part of the scene.
  try engine.block.destroy(audioBlock)
}
```

This guide covers how to adjust audio volume programmatically using the Engine API, mute and unmute audio, and query volume and mute states.

## Understanding Volume Concepts

CE.SDK supports volume levels from **0.0** (silent) to **1.0** (full volume), with **1.0** as the default for new audio blocks. Values in between represent proportional volume levels — 0.5 is half volume, 0.25 is quarter volume.

**Volume vs muting**: Setting volume to 0.0 makes audio silent, but `setMuted(_:muted:)` is preferred when you want to temporarily silence audio without losing the volume setting. Unmuting restores the previous volume level.

**Common use cases**: background music mixing (0.3–0.5 under voiceover), user volume controls, audio balancing for multi-track projects, fade effects (gradually adjusting volume over time), and accessibility features.

## Setting Up Audio for Volume Control

### Loading Audio Files

Create an audio block and load an audio file by setting its `audio/fileURI` property.

```swift highlight-adjustVolume-create-audio
  // Create an audio block and load the audio file.
  let audioBlock = try engine.block.create(.audio)
  try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioURL)

  // Wait for the audio resource to load before adjusting volume or querying state.
  try await engine.block.forceLoadAVResource(audioBlock)
```

Unlike video or image blocks which use fills, audio blocks store the file URI directly on the block itself via the `audio/fileURI` property. The `forceLoadAVResource(_:)` call ensures CE.SDK has downloaded the audio file and loaded its metadata before the block is manipulated.

## Adjusting Volume

### Setting Volume

Set volume using `setVolume(_:volume:)` with a `Float` value between `0.0` and `1.0`.

```swift highlight-adjustVolume-set-volume
// Set volume to 80% (0.8 on a 0.0-1.0 scale).
let fullVolumeAudio = try engine.block.duplicate(audioBlock)
try engine.block.appendChild(to: page, child: fullVolumeAudio)
try engine.block.setTimeOffset(fullVolumeAudio, offset: 0)
try engine.block.setVolume(fullVolumeAudio, volume: 0.8)
```

Setting volume to 0.8 (80%) is useful when you want prominent audio that isn't at maximum level, leaving headroom for other audio sources or preventing distortion.

### Setting Low Volume for Background Audio

For background music that should be audible but not prominent, use lower volume levels.

```swift highlight-adjustVolume-set-low-volume
// Set volume to 30% for background music.
let lowVolumeAudio = try engine.block.duplicate(audioBlock)
try engine.block.appendChild(to: page, child: lowVolumeAudio)
try engine.block.setTimeOffset(lowVolumeAudio, offset: 5)
try engine.block.setVolume(lowVolumeAudio, volume: 0.3)
```

At 0.3 (30%) volume, the audio is clearly audible but stays in the background. This is a common level for background music under voiceover or dialogue.

## Muting Audio

### Mute and Unmute

Use `setMuted(_:muted:)` to mute audio without changing its volume setting. This is useful for toggle controls.

```swift highlight-adjustVolume-mute-audio
// Mute an audio block. The volume setting is preserved so unmuting restores playback at the same level.
let mutedAudio = try engine.block.duplicate(audioBlock)
try engine.block.appendChild(to: page, child: mutedAudio)
try engine.block.setTimeOffset(mutedAudio, offset: 10)
try engine.block.setVolume(mutedAudio, volume: 1.0)
try engine.block.setMuted(mutedAudio, muted: true)
```

When an audio block is muted, the volume setting (1.0 in this case) is preserved. Unmuting later with `setMuted(block, muted: false)` restores playback at the same volume level.

### Querying Volume and Mute States

Query current volume and mute states at any time.

```swift highlight-adjustVolume-query-volume
  // Query current volume and mute states.
  let currentVolume = try engine.block.getVolume(fullVolumeAudio)
  let lowVolume = try engine.block.getVolume(lowVolumeAudio)
  let isMuted = try engine.block.isMuted(mutedAudio)
  let isForceMuted = try engine.block.isForceMuted(mutedAudio)

  print(String(format: "Full volume audio: %.0f%%", currentVolume * 100))
  print(String(format: "Low volume audio: %.0f%%", lowVolume * 100))
  print("Muted audio — isMuted: \(isMuted), isForceMuted: \(isForceMuted)")
```

Use `getVolume(_:)` to read the current volume level, `isMuted(_:)` to check if the block is muted by the user, and `isForceMuted(_:)` to check if the engine has automatically muted the block due to playback rules.

## Mixing Multiple Audio Sources

### Balancing Tracks

When working with multiple audio sources, use different volume levels to create a balanced mix. A common approach is to keep voiceover or dialogue at higher levels (0.8–1.0) and background music at lower levels (0.3–0.5).

### Common Mixing Patterns

**Voiceover prominent**: set background music to 0.3 and voiceover to 1.0 for clear narration with musical accompaniment.

**Balanced dialogue and music**: set both to 0.6–0.7 when both elements are equally important.

**Sound effects as accents**: set sound effects to 0.5–0.8 depending on how prominent they should be in the mix.

## Building Volume Controls

### Volume Slider

When building a volume slider, map the slider value directly to the 0.0–1.0 range. Display percentages (0–100%) for user-friendly labels.

```swift highlight-adjustVolume-volume-slider
// Map a slider value (0-100) to the normalized 0.0-1.0 volume range.
let sliderValue: Float = 75
let volume = sliderValue / 100
try engine.block.setVolume(fullVolumeAudio, volume: volume)
```

### Mute Toggle

Implement mute buttons using `setMuted(_:muted:)` and indicate the current state using `isMuted(_:)`. Show a different icon when `isForceMuted(_:)` returns `true` to indicate the engine has automatically muted the audio.

```swift highlight-adjustVolume-mute-toggle
  // Toggle mute state and react to a force-muted block (e.g. video fill playing above 3.0x).
  let currentlyMuted = try engine.block.isMuted(mutedAudio)
  try engine.block.setMuted(mutedAudio, muted: !currentlyMuted)

  if try engine.block.isForceMuted(mutedAudio) {
    // Show a distinct "force muted" indicator in the UI.
  }
```

## Troubleshooting

### Volume Changes Not Audible

Check if the block is muted with `isMuted(_:)` or force muted with `isForceMuted(_:)`. Verify the audio resource has loaded successfully via `forceLoadAVResource(_:)`.

### Force Muted State

Video fills at playback speeds above 3.0x are automatically force muted by the engine. Reduce the playback speed to restore audio output.

### Volume Not Persisting

Ensure you're setting volume on the correct block ID. Volume settings are block-specific and don't propagate to duplicates or other instances.

## API Reference

| Method                       | Category | Purpose                                   |
| ---------------------------- | -------- | ----------------------------------------- |
| `block.setVolume(_:volume:)` | Block    | Set volume level (0.0 to 1.0)             |
| `block.getVolume(_:)`        | Block    | Get current volume level                  |
| `block.setMuted(_:muted:)`   | Block    | Mute or unmute audio                      |
| `block.isMuted(_:)`          | Block    | Check if audio is muted                   |
| `block.isForceMuted(_:)`     | Block    | Check if the engine has force muted audio |

## Next Steps

- [Add Music](./add-music.md) — Add background music and audio tracks
- [Add Sound Effects](./add-sound-effects.md) — Generate sound effects programmatically from raw PCM data using audio buffers
- [Adjust Audio Playback Speed](./adjust-speed.md) — Create slow-motion, time-stretched, and fast-forward audio effects
- [Loop Audio](./loop.md) — Loop audio tracks for continuous playback
- Record Voiceover — On iOS, let users capture voiceover clips directly in the editor UI



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support