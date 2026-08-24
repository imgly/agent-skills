> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Audio](./audio.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-audio-audio/Audio.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func audio(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1080)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.setDuration(page, duration: 30.0)

  let baseURL = try engine.guidesBaseURL

  let audioBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: audioBlock)
  try engine.block.setURL(
    audioBlock,
    property: "audio/fileURI",
    value: baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a"),
  )
  try await engine.block.forceLoadAVResource(audioBlock)
  let sourceDuration = try engine.block.getAVResourceTotalDuration(audioBlock)
  print("Audio source duration: \(sourceDuration) seconds")

  let videoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(videoBlock, shape: try engine.block.createShape(.rect))
  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(
    videoFill,
    property: "fill/video/fileURI",
    value: baseURL.appendingPathComponent("ly.img.video/videos/pexels-kampus-production-8154913.mp4"),
  )
  try engine.block.setFill(videoBlock, fill: videoFill)
  try engine.block.appendChild(to: page, child: videoBlock)
  try await engine.block.forceLoadAVResource(videoFill)

  let extractedAudio = try engine.block.createAudioFromVideo(
    videoFill,
    trackIndex: 0,
    options: AudioFromVideoOptions(keepTrimSettings: true, muteOriginalVideo: true),
  )
  try engine.block.appendChild(to: page, child: extractedAudio)

  let allExtractedAudio = try engine.block.createAudiosFromVideo(
    videoFill,
    options: AudioFromVideoOptions(keepTrimSettings: true, muteOriginalVideo: false),
  )
  print("Extracted \(allExtractedAudio.count) audio track(s) from video")
  // Append each extracted block to the scene hierarchy in your app where you want it to play.

  let trackCount = try engine.block.getAudioTrackCountFromVideo(videoFill)
  print("Video contains \(trackCount) audio track(s)")
  let tracks = try engine.block.getAudioInfoFromVideo(videoFill)
  for (listPosition, info) in tracks.enumerated() {
    print("Track at list position \(listPosition):")
    print("  codec: \(info.audioCodec)")
    print("  channels: \(info.channels)")
    print("  sample rate: \(info.sampleRate) Hz")
    print("  duration: \(info.audioDuration) s")
    print("  language: \(info.language)")
    print("  trackName: \(info.trackName)")
    print("  container trackIndex: \(info.trackIndex)")
  }

  try engine.block.setPlaying(page, enabled: true)
  let isScenePlaying = try engine.block.isPlaying(page)
  print("Scene playing: \(isScenePlaying)")
  try engine.block.setPlaybackTime(page, time: 3.0)

  try engine.block.setVolume(audioBlock, volume: 0.8)
  try engine.block.setMuted(audioBlock, muted: false)
  try engine.block.setPlaybackSpeed(audioBlock, speed: 1.0)
  try engine.block.setPlaying(page, enabled: false)

  try engine.block.setSoloPlaybackEnabled(audioBlock, enabled: true)
  try engine.block.setPlaying(page, enabled: true)
  // ... preview the audio block in isolation ...
  try engine.block.setPlaying(page, enabled: false)
  try engine.block.setSoloPlaybackEnabled(audioBlock, enabled: false)

  try engine.block.setTimeOffset(audioBlock, offset: 2.0)
  try engine.block.setDuration(audioBlock, duration: 10.0)

  let waveformStream = engine.block.generateAudioThumbnailSequence(
    audioBlock,
    samplesPerChunk: 3,
    timeRange: 0.0 ... 10.0,
    numberOfSamples: 9,
    numberOfChannels: 2,
  )
  for try await thumbnail in waveformStream {
    print("Chunk \(thumbnail.chunkIndex) → \(thumbnail.samples.count) samples")
  }

  try engine.block.setTrimOffset(audioBlock, offset: 5.0)
  try engine.block.setTrimLength(audioBlock, length: 4.0)
  try engine.block.setLooping(audioBlock, looping: true)

  let exportBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: exportBlock)
  let audioBuffer = engine.editor.createBuffer()
  try engine.editor.setBufferLength(url: audioBuffer, length: 96000)
  try engine.block.setURL(exportBlock, property: "audio/fileURI", value: audioBuffer)

  let exportStream = try await engine.block.exportAudio(
    exportBlock,
    mimeType: .wav,
    options: AudioExportOptions(skipEncoding: true),
  )
  for try await event in exportStream {
    switch event {
    case let .progress(rendered, encoded, total):
      print("Export progress: \(rendered)/\(total) rendered, \(encoded) encoded")
    case let .finished(audio):
      print("Exported \(audio.count) bytes of audio data")
    }
  }
}
```

Add audio to your CE.SDK scenes with the Swift Engine API: create audio blocks
from external files, extract tracks from video fills, control playback, manage
timeline placement, generate waveform samples, and export audio data.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260824/engine-guides-create-audio-audio)

<EngineReferenceNote {...props} />

Audio blocks let you add background music, voice-overs, sound effects, and other standalone sound to scenes. CE.SDK also exposes video audio track counts, playback controls, trim controls, waveform generation, and audio-only export through the Engine block API.

Playback examples require an `Engine` instance created with `audioContext: .auto`, which is the default. Engines created with `audioContext: .none` can still edit and export scenes, but they do not drive real-time audio playback.

## Use Cases

Use the CE.SDK audio APIs when you need to add or manage:

- Background music
- Voice-overs
- Sound effects
- Podcast or narration tracks

## How Audio Works in CE.SDK

CE.SDK represents standalone audio as `.audio` design blocks. Audio blocks attach to a page, reference their media through the `audio/fileURI` property, and use the same timeline properties as other time-based blocks.

Each audio block can have:

- A source URI for an external audio file.
- Playback properties such as volume, mute state, playback time, and speed.
- Timeline properties such as offset, duration, trim offset, and trim length.
- Waveform sample data for a custom timeline UI.

Extraction APIs create separate audio blocks from video fill tracks instead of modifying an existing audio block's source.

### Time-Based Properties

Audio timing is expressed in seconds:

- **Offset**: when the audio block starts relative to its parent.
- **Duration**: how long the block stays active on the timeline.
- **Trim offset**: where playback starts inside the source audio.
- **Trim length**: how much of the source audio plays before it loops or stops. Use the looping APIs to choose that behavior.

### Waveforms

Waveforms are sampled audio amplitudes you can render in your own UI. `generateAudioThumbnailSequence(_:samplesPerChunk:timeRange:numberOfSamples:numberOfChannels:)` returns an `AsyncThrowingStream<AudioThumbnail, Error>` of chunks. Each chunk's `samples` array holds normalized amplitudes in the range `0` to `1`. Stereo requests interleave left and right samples.

### When to Create vs. Extract Audio

Create an audio block when the source is an external file such as background music or a voice-over. Extract audio when the sound already lives inside a video fill and you need a separate audio block for trimming, muting the original video, or independent volume control.

## Examples

The snippets below work against a scene with a page that has a timeline duration. Audio APIs run on the main thread through the same `Engine` instance as the rest of your scene edits.

### Create Audio

Create a standalone audio block, attach it to the page, set its source URI, then load the resource before reading metadata such as the source duration.

```swift highlight-audio-create
let audioBlock = try engine.block.create(.audio)
try engine.block.appendChild(to: page, child: audioBlock)
try engine.block.setURL(
  audioBlock,
  property: "audio/fileURI",
  value: baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a"),
)
try await engine.block.forceLoadAVResource(audioBlock)
let sourceDuration = try engine.block.getAVResourceTotalDuration(audioBlock)
print("Audio source duration: \(sourceDuration) seconds")
```

`forceLoadAVResource(_:)` is asynchronous; await it before calling `getAVResourceTotalDuration(_:)` so the engine has parsed the source.

### Extract or Count Video Audio

Build a video fill block and wait for `forceLoadAVResource(_:)` to complete before extracting or counting video audio. The tabs below reuse the loaded `videoFill` created in this snippet.

```swift highlight-audio-videoFillSetup
let videoBlock = try engine.block.create(.graphic)
try engine.block.setShape(videoBlock, shape: try engine.block.createShape(.rect))
let videoFill = try engine.block.createFill(.video)
try engine.block.setURL(
  videoFill,
  property: "fill/video/fileURI",
  value: baseURL.appendingPathComponent("ly.img.video/videos/pexels-kampus-production-8154913.mp4"),
)
try engine.block.setFill(videoBlock, fill: videoFill)
try engine.block.appendChild(to: page, child: videoBlock)
try await engine.block.forceLoadAVResource(videoFill)
```

<Tabs>
  <TabItem label="Extract Audio From Video">
    Extract one audio track from the video fill into a new audio block. `AudioFromVideoOptions(keepTrimSettings: true, muteOriginalVideo: true)` mirrors the source video's trim onto the extracted block and silences the original fill so the audio plays from the extracted block alone.

    ```swift highlight-audio-extract
    let extractedAudio = try engine.block.createAudioFromVideo(
      videoFill,
      trackIndex: 0,
      options: AudioFromVideoOptions(keepTrimSettings: true, muteOriginalVideo: true),
    )
    try engine.block.appendChild(to: page, child: extractedAudio)
    ```
  </TabItem>

  <TabItem label="Extract All Tracks">
    Use `createAudiosFromVideo(_:options:)` when the source may contain multiple audio tracks and you want each track to become its own audio block.

    ```swift highlight-audio-extractAll
    let allExtractedAudio = try engine.block.createAudiosFromVideo(
      videoFill,
      options: AudioFromVideoOptions(keepTrimSettings: true, muteOriginalVideo: false),
    )
    print("Extracted \(allExtractedAudio.count) audio track(s) from video")
    // Append each extracted block to the scene hierarchy in your app where you want it to play.
    ```
  </TabItem>

  <TabItem label="Count Tracks">
    Use `getAudioTrackCountFromVideo(_:)` before extraction when the source may be silent or carry multiple audio tracks. To choose a track by metadata, call `getAudioInfoFromVideo(_:)` after the same load step to read each track's `AudioTrackInfo`, which includes the codec string, channel count, sample rate, audio duration, packet and frame counts, track name, container track index, and ISO 639-2T language. Pass the returned list position to `createAudioFromVideo(_:trackIndex:options:)`; that parameter is the zero-based audio-track ordinal. Do not pass `AudioTrackInfo.trackIndex` directly, because that value is the original container track index and may not match the list position.

    ```swift highlight-audio-trackInfo
    let trackCount = try engine.block.getAudioTrackCountFromVideo(videoFill)
    print("Video contains \(trackCount) audio track(s)")
    let tracks = try engine.block.getAudioInfoFromVideo(videoFill)
    for (listPosition, info) in tracks.enumerated() {
      print("Track at list position \(listPosition):")
      print("  codec: \(info.audioCodec)")
      print("  channels: \(info.channels)")
      print("  sample rate: \(info.sampleRate) Hz")
      print("  duration: \(info.audioDuration) s")
      print("  language: \(info.language)")
      print("  trackName: \(info.trackName)")
      print("  container trackIndex: \(info.trackIndex)")
    }
    ```
  </TabItem>
</Tabs>

### Control Audio Playback

Set play and pause state on the page so all time-based blocks stay synchronized. Set volume, mute state, playback speed, and per-block playback time on the audio block itself.

```swift highlight-audio-playback
  try engine.block.setPlaying(page, enabled: true)
  let isScenePlaying = try engine.block.isPlaying(page)
  print("Scene playing: \(isScenePlaying)")
  try engine.block.setPlaybackTime(page, time: 3.0)

  try engine.block.setVolume(audioBlock, volume: 0.8)
  try engine.block.setMuted(audioBlock, muted: false)
  try engine.block.setPlaybackSpeed(audioBlock, speed: 1.0)
  try engine.block.setPlaying(page, enabled: false)
```

Audio block speed accepts values from `0.25` to `3.0`. Changing the speed also changes how long a non-looping block takes on the timeline; looping blocks keep their authored duration regardless of speed.

### Solo Playback

Preview a single audio block while the rest of the scene stays paused. Solo mode is useful for waveform pickers and trim editors that need to audition one source at a time.

```swift highlight-audio-soloPlayback
try engine.block.setSoloPlaybackEnabled(audioBlock, enabled: true)
try engine.block.setPlaying(page, enabled: true)
// ... preview the audio block in isolation ...
try engine.block.setPlaying(page, enabled: false)
try engine.block.setSoloPlaybackEnabled(audioBlock, enabled: false)
```

Read the current state with `isSoloPlaybackEnabled(_:)`.

### Manage Audio Timing

Use offset and duration to place the audio block on the scene timeline. Use trim offset and trim length to choose which part of the source file plays.

```swift highlight-audio-timing
try engine.block.setTimeOffset(audioBlock, offset: 2.0)
try engine.block.setDuration(audioBlock, duration: 10.0)
```

Trim the source range and enable looping when the trimmed source should repeat for as long as the block stays active.

```swift highlight-audio-trim
try engine.block.setTrimOffset(audioBlock, offset: 5.0)
try engine.block.setTrimLength(audioBlock, length: 4.0)
try engine.block.setLooping(audioBlock, looping: true)
```

Load the audio resource with `forceLoadAVResource(_:)` before trimming so CE.SDK can read the source duration. Trim values are silently clamped to the available range, so loading first lets you compute and pass values the user expects to see.

### Generate Audio Thumbnails

Waveform generation returns an `AsyncThrowingStream<AudioThumbnail, Error>`. Choose `samplesPerChunk`, a `timeRange`, the total number of samples, and the number of channels. Iterate the stream with `for try await` and render each chunk's `samples` in your own timeline component.

```swift highlight-audio-waveform
let waveformStream = engine.block.generateAudioThumbnailSequence(
  audioBlock,
  samplesPerChunk: 3,
  timeRange: 0.0 ... 10.0,
  numberOfSamples: 9,
  numberOfChannels: 2,
)
for try await thumbnail in waveformStream {
  print("Chunk \(thumbnail.chunkIndex) → \(thumbnail.samples.count) samples")
}
```

Cancel an in-flight stream by terminating the consuming `Task`; the binding cancels the underlying thumbnail generation automatically.

### Export Audio

Export an audio block to bytes with `exportAudio(_:mimeType:options:)`. The call returns an `AsyncThrowingStream<AudioExport, Error>` that yields `.progress(renderedFrames:encodedFrames:totalFrames:)` events during render and a final `.finished(audio:)` event carrying the exported `Blob`.

The example below backs the export block with an in-memory buffer so the snippet runs without a network request: `engine.editor.createBuffer()` returns a `buffer://` URL the audio block reads from, and `setBufferLength(url:length:)` reserves capacity in bytes. `skipEncoding: true` returns the audio data without running the encoder; set it to `false` (the default) to receive a fully encoded WAV file. Pass `MIMEType.mp4` instead of `.wav` for an MP4 container.

```swift highlight-audio-export
  let exportBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: exportBlock)
  let audioBuffer = engine.editor.createBuffer()
  try engine.editor.setBufferLength(url: audioBuffer, length: 96000)
  try engine.block.setURL(exportBlock, property: "audio/fileURI", value: audioBuffer)

  let exportStream = try await engine.block.exportAudio(
    exportBlock,
    mimeType: .wav,
    options: AudioExportOptions(skipEncoding: true),
  )
  for try await event in exportStream {
    switch event {
    case let .progress(rendered, encoded, total):
      print("Export progress: \(rendered)/\(total) rendered, \(encoded) encoded")
    case let .finished(audio):
      print("Exported \(audio.count) bytes of audio data")
    }
  }
```

To persist the full scene including audio sources, see the scene persistence APIs covered in the export guides.

## API Reference

| Category | API | Purpose |
| --- | --- | --- |
| Engine audio context | `Engine(context:_, audioContext: .auto, license: _)` | Create an `Engine` that can drive a hardware audio device |
| Create blocks | `engine.block.create(.audio)` | Create a standalone audio block |
| Create blocks | `engine.block.create(.graphic)` | Create a block that can host the video fill |
| Create blocks | `engine.block.createShape(.rect)` | Create the shape for the video block |
| Create blocks | `engine.block.createFill(.video)` | Create a video fill the audio extraction APIs accept |
| Scene hierarchy | `engine.block.appendChild(to:child:)` | Attach audio, video, or extracted blocks to the scene hierarchy |
| Assign sources | `engine.block.setString(_:property: "audio/fileURI", value: _)` | Attach an audio file URI to an audio block |
| Assign sources | `engine.block.setString(_:property: "fill/video/fileURI", value: _)` | Attach a video file URI to a video fill |
| Video fill setup | `engine.block.setShape(_:shape:)` | Assign a shape to the video block |
| Video fill setup | `engine.block.setFill(_:fill:)` | Assign the loaded video fill to the video block |
| Extract video audio | `engine.block.createAudioFromVideo(_:trackIndex:options:)` | Extract one audio track by zero-based audio-track ordinal from a video fill |
| Extract video audio | `engine.block.createAudiosFromVideo(_:options:)` | Extract every audio track from a video fill |
| Extract video audio | `AudioFromVideoOptions(keepTrimSettings:muteOriginalVideo:)` | Configure trim mirroring and source muting |
| Count video audio | `engine.block.getAudioTrackCountFromVideo(_:)` | Count the audio tracks in a video fill |
| Inspect video audio | `engine.block.getAudioInfoFromVideo(_:)` | Read `AudioTrackInfo` metadata; use the returned list position for extraction because `AudioTrackInfo.trackIndex` is the container track index |
| Playback | `engine.block.setPlaying(_:enabled:)` | Start or stop playback for a page or playable block |
| Playback | `engine.block.isPlaying(_:)` | Read the current play or pause state |
| Playback | `engine.block.supportsPlaybackControl(_:)` | Check whether playback control APIs apply to a block |
| Playback | `engine.block.setPlaybackTime(_:time:)` | Move playback to a timeline position |
| Playback | `engine.block.getPlaybackTime(_:)` | Read the current playback time |
| Playback | `engine.block.supportsPlaybackTime(_:)` | Check whether a block exposes a playback time cursor |
| Playback | `engine.block.setVolume(_:volume:)` | Set volume from `0.0` to `1.0` |
| Playback | `engine.block.getVolume(_:)` | Read the current volume |
| Playback | `engine.block.setMuted(_:muted:)` | Mute or unmute audio |
| Playback | `engine.block.isMuted(_:)` | Read whether audio is muted |
| Playback | `engine.block.isForceMuted(_:)` | Read whether the engine is muting the block (for example a video fill played above 3.0x) |
| Playback | `engine.block.setPlaybackSpeed(_:speed:)` | Set audio speed from `0.25` to `3.0` |
| Playback | `engine.block.getPlaybackSpeed(_:)` | Read the current playback speed |
| Playback | `engine.block.setSoloPlaybackEnabled(_:enabled:)` | Preview one block while the rest of the scene stays paused |
| Playback | `engine.block.isSoloPlaybackEnabled(_:)` | Read whether solo playback is enabled |
| Timing | `engine.block.supportsTimeOffset(_:)` | Check whether a block can be positioned on its parent's timeline |
| Timing | `engine.block.setTimeOffset(_:offset:)` | Move the audio block on the timeline |
| Timing | `engine.block.getTimeOffset(_:)` | Read where the audio block starts on the timeline |
| Timing | `engine.block.supportsDuration(_:)` | Check whether a block exposes an active timeline duration |
| Timing | `engine.block.setDuration(_:duration:)` | Set the active block duration |
| Timing | `engine.block.getDuration(_:)` | Read the active block duration |
| Timing | `engine.block.supportsTrim(_:)` | Check whether a block or fill exposes trim controls |
| Timing | `engine.block.setTrimOffset(_:offset:)` | Start playback inside the source audio |
| Timing | `engine.block.getTrimOffset(_:)` | Read the source trim start |
| Timing | `engine.block.setTrimLength(_:length:)` | Limit the source range used for playback |
| Timing | `engine.block.getTrimLength(_:)` | Read the source trim length |
| Timing | `engine.block.setLooping(_:looping:)` | Loop the trimmed source while the block stays active |
| Timing | `engine.block.isLooping(_:)` | Read whether the source loops or stops |
| Resources | `engine.block.forceLoadAVResource(_:)` | Load audio or video metadata before querying it |
| Resources | `engine.block.getAVResourceTotalDuration(_:)` | Read the loaded audio or video source duration |
| Waveforms | `engine.block.generateAudioThumbnailSequence(_:samplesPerChunk:timeRange:numberOfSamples:numberOfChannels:)` | Generate waveform sample chunks as an `AsyncThrowingStream<AudioThumbnail, Error>` |
| Export | `engine.block.exportAudio(_:mimeType:options:)` | Export an audio block to bytes; returns an `AsyncThrowingStream<AudioExport, Error>` |
| Export | `AudioExportOptions(sampleRate:numberOfChannels:timeOffset:duration:skipEncoding:)` | Configure the audio export sample rate, channels, time range, and encoding |
| Export | `engine.editor.createBuffer()` | Create an in-memory `buffer://` URL that an audio block can read from |
| Export | `engine.editor.setBufferLength(url:length:)` | Reserve buffer capacity for the audio block to read |
| Export | `engine.block.setURL(_:property:value:)` | Bind a URL (including a `buffer://` URL) to a block property |

## Next Steps

- [CE.SDK API Reference](https://img.ly/docs/cesdk/macos/api-reference/overview-8f24e1/) — Browse the complete IMGLYEngine API surface.
- [Add Music](./audio/add-music.md) — Add background music and audio tracks to video projects.
- [Add Sound Effects](./audio/add-sound-effects.md) — Generate sound effects programmatically from raw PCM data using audio buffers.
- [Adjust Audio Volume](./audio/adjust-volume.md) — Control playback levels, mute audio, and balance multiple audio sources.
- [Adjust Audio Playback Speed](./audio/adjust-speed.md) — Create slow-motion, time-stretched, and fast-forward audio effects.
- [Loop Audio](./audio/loop.md) — Create seamless repeating audio for background music and sound effects.
- Record Voiceover — On iOS, let users capture voiceover clips directly in the editor UI.



---

## Related Pages

- [Add Sound Effects](./audio/add-sound-effects.md) - Generate sound effects programmatically with CE.SDK audio buffers — create chimes, melodies, and alert tones from raw PCM data and place them on the timeline.
- [Add Music](./audio/add-music.md) - Add background music and audio tracks to video projects programmatically using CE.SDK's Engine API for Swift.
- [Adjust Audio Volume](./audio/adjust-volume.md) - Learn how to adjust audio volume in CE.SDK Engine for Swift to control playback levels, mute audio, and balance multiple audio sources in video projects.
- [Fade Audio In and Out](./audio/fade.md) - Learn how to fade audio in and out in CE.SDK Engine for Swift, choose an easing curve, read the fade configuration back, and fade the audio of video fills.
- [Adjust Audio Playback Speed](./audio/adjust-speed.md) - Control audio playback speed from quarter-speed (0.25x) to triple-speed (3.0x) using the CE.SDK engine API.
- [Loop Audio](./audio/loop.md) - Control audio looping behavior programmatically using CE.SDK's headless engine for Swift-based audio processing and automated content workflows.


---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support