> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Add Music](./add-music.md)

---

Add background music and audio tracks to video projects programmatically using
CE.SDK's Engine API for Swift.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/engine-guides-create-audio-add-music)

Audio blocks are standalone time-based blocks that play alongside video content, independent of video fills. Create audio blocks for background music, voiceovers, and sound effects with separate control over each track. Audio blocks support M4A, MP3, and WAV formats.

```swift file=@cesdk_swift_examples/engine-guides-create-audio-add-music/AddMusic.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func addMusic(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 30)

  let baseURL = try engine.guidesBaseURL

  // Create an audio block and point it at an audio file.
  let audioBlock = try engine.block.create(.audio)
  try engine.block.setURL(
    audioBlock,
    property: "audio/fileURI",
    value: baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a"),
  )
  try engine.block.appendChild(to: page, child: audioBlock)

  // Wait for the audio resource to load before reading metadata such as duration.
  try await engine.block.forceLoadAVResource(audioBlock)

  // Read the total audio file length and offset playback to start three seconds in.
  let totalDuration = try engine.block.getAVResourceTotalDuration(audioBlock)
  try engine.block.setTimeOffset(audioBlock, offset: 3)
  try engine.block.setDuration(audioBlock, duration: min(totalDuration, 15))

  // Set the block to 50% volume. Values range from 0.0 (silent) to 1.0 (full volume).
  try engine.block.setVolume(audioBlock, volume: 0.5)

  let currentVolume = try engine.block.getVolume(audioBlock)
  print(String(format: "Background music volume: %.0f%%", currentVolume * 100))

  // Register the audio asset source by loading its content.json. The returned ID
  // matches the `id` field in the JSON (here, `ly.img.audio`).
  let audioSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent("ly.img.audio/content.json"),
  )

  // Query the first page of audio assets from the source.
  let results = try await engine.asset.findAssets(
    sourceID: audioSourceID,
    query: .init(query: nil, page: 0, perPage: 10),
  )
  print("Available audio assets: \(results.total)")

  // Apply an asset result to add a new audio block configured from the asset's metadata.
  if let firstAsset = results.assets.first {
    let appliedBlock = try await engine.asset.apply(
      sourceID: audioSourceID,
      assetResult: firstAsset,
    )
    print("Created audio block from asset: \(appliedBlock.map(String.init) ?? "nil")")
  }

  // Layer a second track from a different source on top of the first audio block.
  // The two blocks play simultaneously while their time ranges overlap.
  let backgroundAudio = try engine.block.create(.audio)
  try engine.block.setURL(
    backgroundAudio,
    property: "audio/fileURI",
    value: baseURL.appendingPathComponent("ly.img.audio/audios/dance_harder.m4a"),
  )
  try engine.block.appendChild(to: page, child: backgroundAudio)
  try engine.block.setTimeOffset(backgroundAudio, offset: 10)
  try engine.block.setDuration(backgroundAudio, duration: 8)
  try engine.block.setVolume(backgroundAudio, volume: 0.2)

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

  // Destroy an audio block to remove it from the scene and free its resources.
  try engine.block.destroy(backgroundAudio)
}
```

This guide covers how to create and configure audio blocks using the Block API, query audio from the built-in asset library, layer multiple tracks, and manage audio blocks in a scene.

## Programmatic Audio Creation

### Create Audio Block

Create an audio block with `create(_:)`, assign the source file with `setString(_:property:value:)` using the `audio/fileURI` property, and append it to a page with `appendChild(to:child:)`. Audio blocks must be children of a page to participate in the timeline.

```swift highlight-addMusic-createAudioBlock
// Create an audio block and point it at an audio file.
let audioBlock = try engine.block.create(.audio)
try engine.block.setURL(
  audioBlock,
  property: "audio/fileURI",
  value: baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a"),
)
try engine.block.appendChild(to: page, child: audioBlock)
```

The source URI can point to any accessible URL or local file. CE.SDK supports M4A, MP3, and WAV formats.

### Configure Time Position

Use `setTimeOffset(_:offset:)` to control when audio starts and `setDuration(_:duration:)` to control how long it plays. Call `forceLoadAVResource(_:)` first to ensure the audio file is loaded before reading metadata such as total duration.

```swift highlight-addMusic-configureTimeline
  // Wait for the audio resource to load before reading metadata such as duration.
  try await engine.block.forceLoadAVResource(audioBlock)

  // Read the total audio file length and offset playback to start three seconds in.
  let totalDuration = try engine.block.getAVResourceTotalDuration(audioBlock)
  try engine.block.setTimeOffset(audioBlock, offset: 3)
  try engine.block.setDuration(audioBlock, duration: min(totalDuration, 15))
```

`getAVResourceTotalDuration(_:)` returns the length of the source audio file in seconds. Use it to clamp the playback duration to the available content or compute timing relative to the file length.

### Configure Volume

Set volume using `setVolume(_:volume:)` with a `Float` value between `0.0` (silent) and `1.0` (full volume). Volume applies during playback and export.

```swift highlight-addMusic-configureVolume
  // Set the block to 50% volume. Values range from 0.0 (silent) to 1.0 (full volume).
  try engine.block.setVolume(audioBlock, volume: 0.5)

  let currentVolume = try engine.block.getVolume(audioBlock)
  print(String(format: "Background music volume: %.0f%%", currentVolume * 100))
```

Read the current level back with `getVolume(_:)`. For a deeper dive into mixing, muting, and force-mute states, see [Adjust Audio Volume](./adjust-volume.md).

## Working with Audio Assets

### Query Audio Library

Register the audio asset source from its `content.json` manifest using `addLocalAssetSourceFromJSON(_:matcher:)`. The call returns the source ID declared inside the JSON, which you then pass to `findAssets(sourceID:query:)` to list tracks.

```swift highlight-addMusic-queryAudioAssets
  // Register the audio asset source by loading its content.json. The returned ID
  // matches the `id` field in the JSON (here, `ly.img.audio`).
  let audioSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent("ly.img.audio/content.json"),
  )

  // Query the first page of audio assets from the source.
  let results = try await engine.asset.findAssets(
    sourceID: audioSourceID,
    query: .init(query: nil, page: 0, perPage: 10),
  )
  print("Available audio assets: \(results.total)")
```

Each `AssetResult` includes metadata such as duration, file URI, and a thumbnail URL, which you can use to build selection interfaces or filter tracks programmatically. For production use, self-host the JSON and assets and load them from your own URL rather than from the IMG.LY CDN.

Apply an asset result with `apply(sourceID:assetResult:)` to add a new audio block configured from the asset's metadata in a single call.

```swift highlight-addMusic-applyAsset
// Apply an asset result to add a new audio block configured from the asset's metadata.
if let firstAsset = results.assets.first {
  let appliedBlock = try await engine.asset.apply(
    sourceID: audioSourceID,
    assetResult: firstAsset,
  )
  print("Created audio block from asset: \(appliedBlock.map(String.init) ?? "nil")")
}
```

`apply(sourceID:assetResult:)` returns the new block's `DesignBlockID` (or `nil` if the asset source did not produce a block). The block is automatically appended to the scene with the source URI and duration prepared from the asset.

## Adding Multiple Audio Tracks

Add multiple audio blocks to a page to layer tracks. Each block carries its own offset, duration, and volume — a common pattern is to keep voiceover or dialogue at higher levels (0.8–1.0) and background music at lower levels (0.2–0.5) for a balanced mix.

```swift highlight-addMusic-multipleAudio
// Layer a second track from a different source on top of the first audio block.
// The two blocks play simultaneously while their time ranges overlap.
let backgroundAudio = try engine.block.create(.audio)
try engine.block.setURL(
  backgroundAudio,
  property: "audio/fileURI",
  value: baseURL.appendingPathComponent("ly.img.audio/audios/dance_harder.m4a"),
)
try engine.block.appendChild(to: page, child: backgroundAudio)
try engine.block.setTimeOffset(backgroundAudio, offset: 10)
try engine.block.setDuration(backgroundAudio, duration: 8)
try engine.block.setVolume(backgroundAudio, volume: 0.2)
```

Audio blocks play simultaneously when their time ranges overlap, so you can mix several tracks at the same point on the timeline.

## Managing Audio Blocks

### List Audio Blocks

Use `find(byType:)` with `DesignBlockType.audio` to retrieve every audio block in the scene. This is useful for building audio management interfaces or for batch operations.

```swift highlight-addMusic-listAudioBlocks
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

### Remove Audio

Call `destroy(_:)` to remove a block from the scene and free its resources. Destroying a block automatically detaches it from its parent.

```swift highlight-addMusic-removeAudio
// Destroy an audio block to remove it from the scene and free its resources.
try engine.block.destroy(backgroundAudio)
```

Destroy blocks that are no longer needed to keep the scene clean and prevent unused resources from accumulating, especially when working with many audio files.

## Troubleshooting

### Duration Returns Zero

Call `forceLoadAVResource(_:)` before reading `getAVResourceTotalDuration(_:)`. The audio metadata must be loaded before the resource size and duration are available.

### Audio Not Playing

Verify the audio block is appended to a page and the page has sufficient duration. Confirm the audio URI is reachable and uses a supported format (M4A, MP3, or WAV).

### Volume Changes Not Applied

Set volume before export — the value is captured into the rendered output. If a block sounds silent at a non-zero volume, check `isMuted(_:)` and `isForceMuted(_:)`. See [Adjust Audio Volume](./adjust-volume.md) for a full walkthrough of mute states.

## API Reference

| Method                                                | Category | Purpose                              |
| ----------------------------------------------------- | -------- | ------------------------------------ |
| `block.create(.audio)`                                | Block    | Create a new audio block             |
| `block.setString(_:property:value:)` (`audio/fileURI`)| Block    | Set the audio source file            |
| `block.appendChild(to:child:)`                        | Block    | Append audio to a page               |
| `block.forceLoadAVResource(_:)`                       | Block    | Load audio metadata                  |
| `block.getAVResourceTotalDuration(_:)`                | Block    | Get total audio file duration        |
| `block.setTimeOffset(_:offset:)`                      | Block    | Set when audio starts on the timeline|
| `block.setDuration(_:duration:)`                      | Block    | Set audio playback duration          |
| `block.setVolume(_:volume:)`                          | Block    | Set volume (0.0 to 1.0)              |
| `block.getVolume(_:)`                                 | Block    | Get current volume level             |
| `block.find(byType:)`                                 | Block    | Find blocks by type                  |
| `block.destroy(_:)`                                   | Block    | Destroy an audio block               |
| `asset.addLocalAssetSourceFromJSON(_:matcher:)`       | Asset    | Register an asset source from JSON   |
| `asset.findAssets(sourceID:query:)`                   | Asset    | Query assets from a source           |
| `asset.apply(sourceID:assetResult:)`                  | Asset    | Apply an asset to create a block     |

## Next Steps

- [Adjust Audio Volume](./adjust-volume.md) — Control audio playback levels and balance multiple sources
- [Adjust Audio Playback Speed](./adjust-speed.md) — Create slow-motion, time-stretched, and fast-forward audio effects
- [Add Sound Effects](./add-sound-effects.md) — Add sound effects at specific moments
- [Loop Audio](./loop.md) — Loop audio tracks for continuous playback
- [Record Voiceover](./record-voiceover.md) — On iOS, let users capture voiceover clips directly in the editor UI



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support