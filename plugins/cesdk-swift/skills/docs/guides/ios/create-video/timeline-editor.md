> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Timeline Editor](./timeline-editor.md)

---

```swift file=@cesdk_swift_examples/engine-guides-timeline-editor/TimelineEditor.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func timelineEditor(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  let primaryURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )
  let overlayURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-kampus-production-8154913.mp4",
  )
  let audioURL = baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a")

  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 10)

  let primaryTrack = try engine.block.create(.track)
  let overlayTrack = try engine.block.create(.track)
  let audioTrack = try engine.block.create(.track)

  try engine.block.appendChild(to: page, child: primaryTrack)
  try engine.block.appendChild(to: page, child: overlayTrack)
  try engine.block.appendChild(to: page, child: audioTrack)

  try engine.block.setBool(overlayTrack, property: "track/automaticallyManageBlockOffsets", value: false)

  let primaryClip = try engine.block.create(.graphic)
  try engine.block.setShape(primaryClip, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(primaryClip, value: 0)
  try engine.block.setPositionY(primaryClip, value: 0)
  try engine.block.setWidth(primaryClip, value: 1280)
  try engine.block.setHeight(primaryClip, value: 720)

  let primaryFill = try engine.block.createFill(.video)
  try engine.block.setURL(primaryFill, property: "fill/video/fileURI", value: primaryURL)
  try engine.block.setFill(primaryClip, fill: primaryFill)
  try engine.block.appendChild(to: primaryTrack, child: primaryClip)

  let overlayClip = try engine.block.create(.graphic)
  try engine.block.setShape(overlayClip, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(overlayClip, value: 820)
  try engine.block.setPositionY(overlayClip, value: 80)
  try engine.block.setWidth(overlayClip, value: 360)
  try engine.block.setHeight(overlayClip, value: 220)

  let overlayFill = try engine.block.createFill(.video)
  try engine.block.setURL(overlayFill, property: "fill/video/fileURI", value: overlayURL)
  try engine.block.setFill(overlayClip, fill: overlayFill)
  try engine.block.appendChild(to: overlayTrack, child: overlayClip)

  let audioClip = try engine.block.create(.audio)
  try engine.block.setURL(audioClip, property: "audio/fileURI", value: audioURL)
  try engine.block.appendChild(to: audioTrack, child: audioClip)

  try await engine.block.forceLoadAVResource(primaryFill)
  try await engine.block.forceLoadAVResource(overlayFill)
  try await engine.block.forceLoadAVResource(audioClip)

  try engine.block.setDuration(primaryClip, duration: 8)
  try engine.block.setTrimOffset(primaryFill, offset: 2)
  try engine.block.setTrimLength(primaryFill, length: 8)
  try engine.block.setLooping(primaryFill, looping: false)
  try engine.block.setMuted(primaryFill, muted: true)

  try engine.block.setTimeOffset(overlayClip, offset: 3)
  try engine.block.setDuration(overlayClip, duration: 4)
  try engine.block.setTimeOffset(audioClip, offset: 0)
  try engine.block.setDuration(audioClip, duration: 10)

  try engine.block.setPlaybackTime(page, time: 3.5)
  let overlayVisible = try engine.block.isVisibleAtCurrentPlaybackTime(overlayClip)
  print("Overlay visible at 3.5s:", overlayVisible)

  try engine.block.setPlaying(page, enabled: true)
  print("Page is playing:", try engine.block.isPlaying(page))
  try engine.block.setPlaying(page, enabled: false)

  var videoThumbnails: [VideoThumbnail] = []
  for try await thumbnail in engine.block.generateVideoThumbnailSequence(
    primaryFill,
    thumbnailHeight: 72,
    timeRange: 0.0 ... 8.0,
    numberOfFrames: 4,
  ) {
    videoThumbnails.append(thumbnail)
  }

  var audioChunks: [AudioThumbnail] = []
  for try await chunk in engine.block.generateAudioThumbnailSequence(
    audioClip,
    samplesPerChunk: 40,
    timeRange: 0.0 ... 10.0,
    numberOfSamples: 160,
    numberOfChannels: 2,
  ) {
    audioChunks.append(chunk)
  }
  print("Received \(videoThumbnails.count) video frames and \(audioChunks.count) waveform chunks")

  let exportsDirectory = FileManager.default.temporaryDirectory
  let exportStream = try await engine.block.exportVideo(page, mimeType: .mp4)
  for try await event in exportStream {
    switch event {
    case let .progress(renderedFrames, encodedFrames, totalFrames):
      print("Rendered \(renderedFrames) / encoded \(encodedFrames) of \(totalFrames) frames")
    case let .finished(video: blob):
      try blob.write(to: exportsDirectory.appendingPathComponent("timeline.mp4"))
    }
  }
}
```

Build video timelines with CE.SDK by arranging tracks, clips, trim ranges, playback controls, thumbnails, and MP4 export from Swift.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260823/engine-guides-timeline-editor)

<EngineReferenceNote {...props} />

Use the Engine APIs in this guide when you need to prepare a video scene programmatically, build a custom timeline surface, or automate timeline edits before opening or exporting the scene. On iOS, the [Video Editor Starter Kit](../starterkits/video-editor.md) already renders a built-in timeline component in its bottom panel.

## Timeline Hierarchy

CE.SDK represents video timelines through the same block hierarchy that any video-editing surface renders:

```text
Scene
└── Page
    ├── Track
    │   ├── Clip
    │   └── Clip
    ├── Overlay track
    └── Audio track
```

A page defines the composition duration, tracks group parallel lanes, and each clip controls its own duration, trim range, and time offset.

## Create a Scene

Start with `engine.scene.createVideo()`, then add a page with the final frame size and duration. The page is the block you play, scrub, and export.

```swift highlight-timelineEditor-create-video-scene
let scene = try engine.scene.createVideo()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setWidth(page, value: 1280)
try engine.block.setHeight(page, value: 720)
try engine.block.setDuration(page, duration: 10)
```

## Create Tracks

Tracks organize clips into timeline lanes. The primary track can keep automatic offset management so clips play one after another, while overlay tracks often disable automatic offsets so you can position clips freely in time.

```swift highlight-timelineEditor-create-tracks
  let primaryTrack = try engine.block.create(.track)
  let overlayTrack = try engine.block.create(.track)
  let audioTrack = try engine.block.create(.track)

  try engine.block.appendChild(to: page, child: primaryTrack)
  try engine.block.appendChild(to: page, child: overlayTrack)
  try engine.block.appendChild(to: page, child: audioTrack)

  try engine.block.setBool(overlayTrack, property: "track/automaticallyManageBlockOffsets", value: false)
```

## Add Video and Audio Clips

Video clips are graphic blocks with a video fill. Audio clips use the `.audio` block type and can live on their own track so a timeline UI can present them as an audio lane.

```swift highlight-timelineEditor-add-clips
  let primaryClip = try engine.block.create(.graphic)
  try engine.block.setShape(primaryClip, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(primaryClip, value: 0)
  try engine.block.setPositionY(primaryClip, value: 0)
  try engine.block.setWidth(primaryClip, value: 1280)
  try engine.block.setHeight(primaryClip, value: 720)

  let primaryFill = try engine.block.createFill(.video)
  try engine.block.setURL(primaryFill, property: "fill/video/fileURI", value: primaryURL)
  try engine.block.setFill(primaryClip, fill: primaryFill)
  try engine.block.appendChild(to: primaryTrack, child: primaryClip)

  let overlayClip = try engine.block.create(.graphic)
  try engine.block.setShape(overlayClip, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(overlayClip, value: 820)
  try engine.block.setPositionY(overlayClip, value: 80)
  try engine.block.setWidth(overlayClip, value: 360)
  try engine.block.setHeight(overlayClip, value: 220)

  let overlayFill = try engine.block.createFill(.video)
  try engine.block.setURL(overlayFill, property: "fill/video/fileURI", value: overlayURL)
  try engine.block.setFill(overlayClip, fill: overlayFill)
  try engine.block.appendChild(to: overlayTrack, child: overlayClip)

  let audioClip = try engine.block.create(.audio)
  try engine.block.setURL(audioClip, property: "audio/fileURI", value: audioURL)
  try engine.block.appendChild(to: audioTrack, child: audioClip)
```

## Trim and Position Clips

Load media resources before reading source durations or setting trim ranges. `setTrimOffset(_:offset:)` chooses where playback starts inside the source file, `setTrimLength(_:length:)` chooses how much source media is used, and `setTimeOffset(_:offset:)` places the clip on the page timeline.

```swift highlight-timelineEditor-trim-and-position
  try await engine.block.forceLoadAVResource(primaryFill)
  try await engine.block.forceLoadAVResource(overlayFill)
  try await engine.block.forceLoadAVResource(audioClip)

  try engine.block.setDuration(primaryClip, duration: 8)
  try engine.block.setTrimOffset(primaryFill, offset: 2)
  try engine.block.setTrimLength(primaryFill, length: 8)
  try engine.block.setLooping(primaryFill, looping: false)
  try engine.block.setMuted(primaryFill, muted: true)

  try engine.block.setTimeOffset(overlayClip, offset: 3)
  try engine.block.setDuration(overlayClip, duration: 4)
  try engine.block.setTimeOffset(audioClip, offset: 0)
  try engine.block.setDuration(audioClip, duration: 10)
```

In this sample, the primary video skips the first two seconds, uses an eight-second source range, and does not loop after that range. It also mutes the primary video fill so the source audio does not compete with the dedicated audio track. The overlay clip starts three seconds into the page timeline.

## Control Playback

Use page playback time for scrubbing and `setPlaying(_:enabled:)` for preview playback. After seeking, `isVisibleAtCurrentPlaybackTime(_:)` lets a custom timeline or preview surface confirm whether a clip is active at the playhead, while `isPlaying(_:)` reports whether the page is currently in active playback.

```swift highlight-timelineEditor-playback
  try engine.block.setPlaybackTime(page, time: 3.5)
  let overlayVisible = try engine.block.isVisibleAtCurrentPlaybackTime(overlayClip)
  print("Overlay visible at 3.5s:", overlayVisible)

  try engine.block.setPlaying(page, enabled: true)
  print("Page is playing:", try engine.block.isPlaying(page))
  try engine.block.setPlaying(page, enabled: false)
```

## Generate Timeline Thumbnails

Generate video thumbnails from a video fill or block and waveform data from an audio block. `generateVideoThumbnailSequence(_:thumbnailHeight:timeRange:numberOfFrames:)` returns an `AsyncThrowingStream<VideoThumbnail, Error>` — each `VideoThumbnail` exposes a `CGImage` you can render directly. `generateAudioThumbnailSequence(_:samplesPerChunk:timeRange:numberOfSamples:numberOfChannels:)` returns an `AsyncThrowingStream<AudioThumbnail, Error>` of channel-interleaved sample chunks that you can plot as a waveform.

```swift highlight-timelineEditor-thumbnails
  var videoThumbnails: [VideoThumbnail] = []
  for try await thumbnail in engine.block.generateVideoThumbnailSequence(
    primaryFill,
    thumbnailHeight: 72,
    timeRange: 0.0 ... 8.0,
    numberOfFrames: 4,
  ) {
    videoThumbnails.append(thumbnail)
  }

  var audioChunks: [AudioThumbnail] = []
  for try await chunk in engine.block.generateAudioThumbnailSequence(
    audioClip,
    samplesPerChunk: 40,
    timeRange: 0.0 ... 10.0,
    numberOfSamples: 160,
    numberOfChannels: 2,
  ) {
    audioChunks.append(chunk)
  }
  print("Received \(videoThumbnails.count) video frames and \(audioChunks.count) waveform chunks")
```

Use the emitted frame and chunk indices as stable positions in your custom timeline cache. Start a new request when the zoom range, clip trim, or visible time window changes.

## Export the Timeline

Export the page with `engine.block.exportVideo(_:mimeType:options:onPreExport:uriResolver:)`. The call returns an `AsyncThrowingStream<VideoExport, Error>` that yields `.progress(renderedFrames:encodedFrames:totalFrames:)` while the encoder runs and `.finished(video:)` with the encoded `Data` when the export completes. Pass `MIMEType.mp4` for H.264/MP4 output and use `VideoExportOptions` to tune the H.264 profile, level, bitrate, framerate, or target dimensions.

```swift highlight-timelineEditor-export
let exportsDirectory = FileManager.default.temporaryDirectory
let exportStream = try await engine.block.exportVideo(page, mimeType: .mp4)
for try await event in exportStream {
  switch event {
  case let .progress(renderedFrames, encodedFrames, totalFrames):
    print("Rendered \(renderedFrames) / encoded \(encodedFrames) of \(totalFrames) frames")
  case let .finished(video: blob):
    try blob.write(to: exportsDirectory.appendingPathComponent("timeline.mp4"))
  }
}
```

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.createVideo()` | Creates a scene used for timeline compositions. |
| `engine.block.create(_:)` | Creates pages, tracks, graphics, and audio blocks. |
| `engine.block.createFill(_:)` | Creates a video fill for a graphic clip. |
| `engine.block.appendChild(to:child:)` | Adds pages, tracks, and clips to the timeline hierarchy. |
| `engine.block.setURL(_:property:value:)` | Sets a URL-valued property such as a fill or audio source URI. |
| `engine.block.setDuration(_:duration:)` | Sets how long a page or clip is active in seconds. |
| `engine.block.setTimeOffset(_:offset:)` | Places a clip on its parent timeline in seconds. |
| `engine.block.forceLoadAVResource(_:)` | Loads a video fill or audio block before duration, trim, or thumbnail queries. |
| `engine.block.setTrimOffset(_:offset:)` | Sets the source-media start position for playback. |
| `engine.block.setTrimLength(_:length:)` | Sets the length of source media used by the clip. |
| `engine.block.setLooping(_:looping:)` | Sets whether the block loops back to the beginning after reaching the end or stops. |
| `engine.block.setMuted(_:muted:)` | Mutes or unmutes the audio for a block or video fill. |
| `engine.block.setPlaybackTime(_:time:)` | Moves the playhead for a page or other playback-time block. |
| `engine.block.setPlaying(_:enabled:)` | Starts or pauses playback for a page or media block. |
| `engine.block.isVisibleAtCurrentPlaybackTime(_:)` | Returns whether a block should be visible at the current playhead position. |
| `engine.block.isPlaying(_:)` | Returns whether a page or media block is currently in active playback. |
| `engine.block.generateVideoThumbnailSequence(_:thumbnailHeight:timeRange:numberOfFrames:)` | Emits frame thumbnails as a `VideoThumbnail` stream for timeline strips. |
| `engine.block.generateAudioThumbnailSequence(_:samplesPerChunk:timeRange:numberOfSamples:numberOfChannels:)` | Emits waveform chunks as an `AudioThumbnail` stream for audio lanes. |
| `engine.block.exportVideo(_:mimeType:options:onPreExport:uriResolver:)` | Exports a page timeline as a `VideoExport` stream with optional encoder settings, background-engine setup, and URI rewriting. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `track/automaticallyManageBlockOffsets` | Bool | When `false`, each clip on the track keeps the time offset you assign instead of being packed after the previous clip. |
| `fill/video/fileURI` | String | Source URI of the video fill. |
| `audio/fileURI` | String | Source URI of the audio block. |

## Troubleshooting

- **Trim calls fail:** call `forceLoadAVResource(_:)` on the video fill or audio block before setting trim offset or length.
- **Clips ignore manual offsets:** set `track/automaticallyManageBlockOffsets` to `false` on tracks where clips need gaps or overlaps.
- **Export is blank near the end:** make sure the page duration does not exceed the end time of the visible clips unless blank frames are intentional.
- **Thumbnail generation stalls during playback:** pause playback before regenerating dense thumbnail or waveform ranges.

## Next Steps

- [Trim](../edit-video/trim.md) — Set trim offsets and trim lengths on video fills and audio blocks in more detail.
- [Control Audio and Video](./control.md) — Play, pause, seek, and preview audio and video content using playback controls and solo mode.
- [Disable or Enable Features](../user-interface/customization/disable-or-enable.md) — On iOS, control which editor features are available to users by enabling or disabling them.
- [Compress Exports for Smaller Files](../export-save-publish/export/compress.md) — Tune format-specific compression settings to reduce export file sizes.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support