> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Export Media Assets](./export.md) > [Thumbnail Previews](./thumbnail-previews.md)

---

```swift file=@cesdk_swift_examples/engine-guides-thumbnail-previews/ThumbnailPreviews.swift reference-only
import CoreGraphics
import Foundation
import IMGLYEngine
import SwiftUI

#if canImport(UIKit)
  import UIKit
#endif

@MainActor
func thumbnailPreviews(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )
  let audioURL = baseURL.appendingPathComponent("ly.img.audio/audios/far_from_home.m4a")

  // Demo scaffolding: a ten-second video page carrying one video clip and one
  // audio clip, so every sequence below previews real media. In your app you
  // start from a scene the user is already editing.
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 10)

  let videoTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: videoTrack)

  let clip = try engine.block.create(.graphic)
  try engine.block.setShape(clip, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(clip, value: 1280)
  try engine.block.setHeight(clip, value: 720)

  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(clip, fill: videoFill)
  try engine.block.appendChild(to: videoTrack, child: clip)

  let audioTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: audioTrack)

  let audioClip = try engine.block.create(.audio)
  try engine.block.setURL(audioClip, property: "audio/fileURI", value: audioURL)
  try engine.block.appendChild(to: audioTrack, child: audioClip)

  // Loading the media up front stops the first request from returning before
  // the resource is ready.
  try await engine.block.forceLoadAVResource(videoFill)
  try await engine.block.forceLoadAVResource(audioClip)
  try engine.block.setDuration(clip, duration: 8)
  try engine.block.setDuration(audioClip, duration: 10)

  let frameCount = 8
  var filmstrip = [CGImage?](repeating: nil, count: frameCount)

  for try await frame in engine.block.generateVideoThumbnailSequence(
    videoFill,
    thumbnailHeight: 72,
    timeRange: 0 ... 8,
    numberOfFrames: frameCount,
  ) {
    // Frames arrive one at a time and carry their own position, so write each
    // one to the slot it reports instead of appending in arrival order.
    guard filmstrip.indices.contains(frame.frameIndex) else { continue }
    filmstrip[frame.frameIndex] = frame.image
  }

  guard let firstFrame = filmstrip[0] else {
    fatalError("Expected the filmstrip to start at frame 0.")
  }
  // `VideoThumbnail` carries no size of its own — read it off the `CGImage`.
  print("Frame 0 is \(firstFrame.width)x\(firstFrame.height) pixels")

  // SwiftUI renders a `CGImage` directly, on every Apple platform.
  let preview = Image(decorative: firstFrame, scale: 1)

  #if canImport(UIKit)
    // A UIKit view takes the same `CGImage` wrapped in a `UIImage`.
    let uiPreview = UIImage(cgImage: firstFrame)
    print("UIKit preview size: \(uiPreview.size)")
  #endif
  _ = preview

  var storyboard = [Int: CGImage]()

  for try await frame in engine.block.generateVideoThumbnailSequence(
    page,
    thumbnailHeight: 108,
    timeRange: 0 ... 10,
    numberOfFrames: 5,
  ) {
    storyboard[frame.frameIndex] = frame.image
  }
  print("Storyboard holds \(storyboard.count) composed frames")

  let samplesPerChunk = 64
  let numberOfSamples = 200
  let numberOfChannels = 2
  var waveform = [Float]()
  var receivedChunks = 0

  for try await chunk in engine.block.generateAudioThumbnailSequence(
    audioClip,
    samplesPerChunk: samplesPerChunk,
    timeRange: 0 ... 10,
    numberOfSamples: numberOfSamples,
    numberOfChannels: numberOfChannels,
  ) {
    receivedChunks += 1
    // Stereo samples are interleaved, left channel first. Step by the channel
    // count to read one channel; the values are already a 0...1 envelope.
    for index in stride(from: 0, to: chunk.samples.count, by: numberOfChannels) {
      waveform.append(chunk.samples[index])
    }
  }

  // The engine sends exactly this many chunks, and the last one may be short.
  let expectedChunks = Int(ceil(Double(numberOfSamples) / Double(samplesPerChunk)))
  print("Waveform: \(waveform.count) bars in \(receivedChunks) of \(expectedChunks) chunks")

  var posterFrame: CGImage?

  for try await frame in engine.block.generateVideoThumbnailSequence(
    page,
    thumbnailHeight: 256,
    timeRange: 2 ... 2,
    numberOfFrames: 1,
  ) {
    posterFrame = frame.image
  }
  print("Poster frame: \(posterFrame?.width ?? 0)x\(posterFrame?.height ?? 0)")

  // There is no cancel method. Leaving the loop drops the stream's iterator,
  // which cancels the request on the engine's next tick.
  var scrubbed = [CGImage]()

  for try await frame in engine.block.generateVideoThumbnailSequence(
    videoFill,
    thumbnailHeight: 72,
    timeRange: 0 ... 8,
    numberOfFrames: 64,
  ) {
    scrubbed.append(frame.image)
    if scrubbed.count == 4 {
      break
    }
  }

  // In a view, own the iteration in a `Task` — SwiftUI's `.task(id:)` does this
  // for you — so replacing or dismissing the view cancels the request it made.
  let storyboardTask = Task { @MainActor in
    var received = 0
    for try await _ in engine.block.generateVideoThumbnailSequence(
      page,
      thumbnailHeight: 108,
      timeRange: 0 ... 10,
      numberOfFrames: 40,
    ) {
      try Task.checkCancellation()
      received += 1
    }
    return received
  }
  storyboardTask.cancel()

  let deliveredBeforeCancel = (try? await storyboardTask.value) ?? 0
  print("Stopped after \(scrubbed.count) frames; cancelled task saw \(deliveredBeforeCancel)")
}
```

Build timeline filmstrips, page storyboards, and waveform lanes in Swift by streaming lightweight previews out of CE.SDK as each frame or sample chunk becomes ready.

> **Reading time:** 9 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-thumbnail-previews)

<EngineReferenceNote {...props} />

CE.SDK exposes two preview APIs on `BlockAPI`. `generateVideoThumbnailSequence(_:thumbnailHeight:timeRange:numberOfFrames:)` streams image frames sampled across a time range, and `generateAudioThumbnailSequence(_:samplesPerChunk:timeRange:numberOfSamples:numberOfChannels:)` streams a waveform as chunks of `Float` samples. Both return an `AsyncThrowingStream` you consume with `for try await`.

Both are built for previews, so they render at most 512 px per side. Ask for a taller thumbnail and you still get the size you asked for, but the extra pixels are stretched, not sharper.

For full-resolution still images, see [Create Thumbnail](./create-thumbnail.md) instead.

## Generate a Video Filmstrip

Pass a video fill, the pixel height you want, the time range, and how many frames to sample. The engine derives each frame's width from the video's aspect ratio, so you only ever specify height.

```swift highlight-tpios-filmstrip
  let frameCount = 8
  var filmstrip = [CGImage?](repeating: nil, count: frameCount)

  for try await frame in engine.block.generateVideoThumbnailSequence(
    videoFill,
    thumbnailHeight: 72,
    timeRange: 0 ... 8,
    numberOfFrames: frameCount,
  ) {
    // Frames arrive one at a time and carry their own position, so write each
    // one to the slot it reports instead of appending in arrival order.
    guard filmstrip.indices.contains(frame.frameIndex) else { continue }
    filmstrip[frame.frameIndex] = frame.image
  }
```

Because the stream is created eagerly, the engine begins working the moment you call the method — before you start iterating. Neither method is `async` or `throws`; errors surface when you consume the stream.

### Choosing the Block: Video Fill or Design Block

The same method behaves differently depending on what you pass, and picking the wrong one is the most common source of surprising frame times.

| | Video fill | Page or design block |
| --- | --- | --- |
| What it renders | Decoded frames from the media file | The composed scene, re-rendered |
| Frame times | Evenly spaced, including the first and last moment of the range | Spread across the range, but never exactly the first or last moment |
| Time base | Media time in the source file — trim offset, trim length, time offset, speed, and looping are all ignored | Relative to the block's own time offset on the page timeline |
| Speed | Slower, because each frame is decoded on its own | Faster, because several frames render together |
| Animations | Not applicable | Suppressed; blocks render un-animated |

With `numberOfFrames: 1`, a video fill returns the frame at `timeRange.lowerBound`. A page or design block never lands exactly on the ends of the range, so one frame over `0 ... 10` gives you the frame at 5 seconds.

Pass a page to build a storyboard of the composition over time:

```swift highlight-tpios-storyboard
  var storyboard = [Int: CGImage]()

  for try await frame in engine.block.generateVideoThumbnailSequence(
    page,
    thumbnailHeight: 108,
    timeRange: 0 ... 10,
    numberOfFrames: 5,
  ) {
    storyboard[frame.frameIndex] = frame.image
  }
  print("Storyboard holds \(storyboard.count) composed frames")
```

The block must be a page or sit on one. A block you have not added to a page yet, or the scene itself, fails with `MEDIA.BLOCK_NOT_PAGE_OR_CHILD`. Video inside the composition comes from a small set of cached frames rather than a fresh decode, so a storyboard shows video content only approximately. When you need accurate frames from a clip, ask its video fill instead.

Video fills and design blocks — pages, graphics, text, groups, and tracks — are accepted. Every other kind of block is rejected with `MEDIA.OPERATION_UNSUPPORTED_FOR_BLOCK`: image fills, color fills, gradient fills, shapes, effects, and animations.

### Handling Frames as They Stream In

Each `VideoThumbnail` carries a `frameIndex` and a `CGImage`. Frames are not guaranteed to arrive in index order, so key off the reported index rather than appending in arrival order.

There is no completion callback in the engine. The Swift stream finishes for you once the final index arrives, so `for try await` ends on its own — but do not write your own completion test against `frameIndex == numberOfFrames - 1`. When a request fails, the reported index is always `0`, whichever frame actually failed. Count arrivals instead.

An error is terminal for the whole sequence: no further frames arrive after one, and the stream throws out of your loop.

`VideoThumbnail` has no width or height properties. Read the dimensions from the `CGImage`, and hand that same image to whichever view layer you render with.

```swift highlight-tpios-image
  guard let firstFrame = filmstrip[0] else {
    fatalError("Expected the filmstrip to start at frame 0.")
  }
  // `VideoThumbnail` carries no size of its own — read it off the `CGImage`.
  print("Frame 0 is \(firstFrame.width)x\(firstFrame.height) pixels")

  // SwiftUI renders a `CGImage` directly, on every Apple platform.
  let preview = Image(decorative: firstFrame, scale: 1)

  #if canImport(UIKit)
    // A UIKit view takes the same `CGImage` wrapped in a `UIImage`.
    let uiPreview = UIImage(cgImage: firstFrame)
    print("UIKit preview size: \(uiPreview.size)")
  #endif
```

## Draw an Audio Waveform

Pass an audio block or a video fill. `numberOfSamples` is the number of samples **per channel**, and `samplesPerChunk` controls how many arrive at a time. The stream yields `numberOfSamples / samplesPerChunk` chunks, rounded up, and the last one can be shorter than the rest.

```swift highlight-tpios-waveform
  let samplesPerChunk = 64
  let numberOfSamples = 200
  let numberOfChannels = 2
  var waveform = [Float]()
  var receivedChunks = 0

  for try await chunk in engine.block.generateAudioThumbnailSequence(
    audioClip,
    samplesPerChunk: samplesPerChunk,
    timeRange: 0 ... 10,
    numberOfSamples: numberOfSamples,
    numberOfChannels: numberOfChannels,
  ) {
    receivedChunks += 1
    // Stereo samples are interleaved, left channel first. Step by the channel
    // count to read one channel; the values are already a 0...1 envelope.
    for index in stride(from: 0, to: chunk.samples.count, by: numberOfChannels) {
      waveform.append(chunk.samples[index])
    }
  }

  // The engine sends exactly this many chunks, and the last one may be short.
  let expectedChunks = Int(ceil(Double(numberOfSamples) / Double(samplesPerChunk)))
  print("Waveform: \(waveform.count) bars in \(receivedChunks) of \(expectedChunks) chunks")
```

Each chunk carries `samplesPerChunk * numberOfChannels` values, interleaved left channel first for stereo. Step the array by `numberOfChannels` to read a single channel.

Only audio blocks and video fills produce waveforms. Passing a page or a graphic block is rejected, unlike the video sequence API, which accepts both.

### What the Numbers Mean

The engine analyzes the audio for you. Every value is a loudness between `0` and `1`, never negative, and already smoothed — so these are numbers you can draw straight away, not raw audio data.

Draw them by mirroring each value around a center line. You do not need to find peaks or rescale anything, and very quiet audio reads as silence.

Requesting a range past the end of the media is not an error — you get zero-filled chunks. `numberOfChannels` must be `1` or `2`.

## Capture a Single Preview Frame

A one-frame request is the quickest way to get a single preview image. Pass the same time as both bounds of the range and ask for one frame.

```swift highlight-tpios-single-frame
  var posterFrame: CGImage?

  for try await frame in engine.block.generateVideoThumbnailSequence(
    page,
    thumbnailHeight: 256,
    timeRange: 2 ... 2,
    numberOfFrames: 1,
  ) {
    posterFrame = frame.image
  }
  print("Poster frame: \(posterFrame?.width ?? 0)x\(posterFrame?.height ?? 0)")
```

Keep `thumbnailHeight` at 512 or below. Above that, the engine upscales from a 512 px render, so you pay for the larger buffer without gaining detail.

## Cancel Generation

There is no cancel method on iOS or macOS. The stream is the handle: when its iterator goes away, the engine request is cancelled. That happens when you `break` out of the loop, when the `Task` that iterates is cancelled, or when a SwiftUI `.task` or `.task(id:)` modifier tears down.

```swift highlight-tpios-cancel
  // There is no cancel method. Leaving the loop drops the stream's iterator,
  // which cancels the request on the engine's next tick.
  var scrubbed = [CGImage]()

  for try await frame in engine.block.generateVideoThumbnailSequence(
    videoFill,
    thumbnailHeight: 72,
    timeRange: 0 ... 8,
    numberOfFrames: 64,
  ) {
    scrubbed.append(frame.image)
    if scrubbed.count == 4 {
      break
    }
  }

  // In a view, own the iteration in a `Task` — SwiftUI's `.task(id:)` does this
  // for you — so replacing or dismissing the view cancels the request it made.
  let storyboardTask = Task { @MainActor in
    var received = 0
    for try await _ in engine.block.generateVideoThumbnailSequence(
      page,
      thumbnailHeight: 108,
      timeRange: 0 ... 10,
      numberOfFrames: 40,
    ) {
      try Task.checkCancellation()
      received += 1
    }
    return received
  }
  storyboardTask.cancel()

  let deliveredBeforeCancel = (try? await storyboardTask.value) ?? 0
  print("Stopped after \(scrubbed.count) frames; cancelled task saw \(deliveredBeforeCancel)")
```

A cancel takes effect a moment later, so one or two frames can still arrive. Nothing arrives to tell you the cancel happened — the frames simply stop. Cancelling twice or cancelling a request that already finished is safe.

How much a cancel actually stops depends on which sequence you started:

| Sequence | Cancel before the first element | Cancel mid-flight |
| --- | --- | --- |
| Video fill | Stops it — nothing is yielded | **No effect.** The remaining frames are still produced |
| Page or design block | Stops it | Stops it |
| Audio waveform | Stops it | Stops it |

Plan around the first row. Once the engine starts decoding a video fill, a cancel no longer reaches it. Ending the stream does stop your loop from seeing those frames, so your UI stays correct — but the engine keeps working, and that work delays your next request. Keep video fill strips short, eight frames rather than a hundred, so an abandoned request finishes quickly.

Always cancel before you request the same block again. A block handles one request at a time, and a second request waits instead of failing. Reusing a block without cancelling is what makes a scrubber feel stuck.

## Performance and Limits

- **512 px render cap.** `thumbnailHeight` above 512 produces a larger image upscaled from a 512 px render.
- **One request per block at a time.** A second request waits instead of failing.
- **Requests run one after another.** Several strips started at once wait for each other.
- **Video fills are slower than pages.** Each frame from a video file is decoded on its own, so a 100-frame filmstrip takes noticeably longer than a page storyboard of the same length.
- **Compressed audio takes longer.** A WAV file produces its waveform almost immediately; a long MP3 or AAC file arrives over several moments.
- Both methods are declared on `@MainActor` types — call them from the main actor. `VideoThumbnail` and `AudioThumbnail` are `Sendable`, so you can iterate anywhere.
- Calling `forceLoadAVResource(_:)` first is optional; both methods wait for the media on their own. It downloads the media before you ask for previews, so the first request does not spend that time waiting.

## Troubleshooting

- **The sequence never seems to complete.** You are testing `frameIndex == numberOfFrames - 1` as a completion signal. The reported index is always `0` on error, so that test can never fire. Count arrivals instead, and let the stream's own termination end the loop.
- **`MEDIA.OPERATION_UNSUPPORTED_FOR_BLOCK`.** You passed a render block that is not a video fill — an image fill, a shape, or an effect.
- **`MEDIA.BLOCK_NOT_PAGE_OR_CHILD`.** The design block is detached from the scene tree, or it is the scene block itself.
- **The waveform is flat.** The time range is past the end of the audio, or the audio is very quiet.
- **Thumbnails look soft above 512 px.** That is the render cap, not a decode problem. Request 512 or less.
- **A scrubber stops updating after a fast drag.** Each new request is waiting behind the previous one. Cancel the running request before you start the next.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.generateVideoThumbnailSequence(_:thumbnailHeight:timeRange:numberOfFrames:)` | Streams `numberOfFrames` image frames across `timeRange` from a video fill or design block. Returns `AsyncThrowingStream<VideoThumbnail, Error>`. |
| `engine.block.generateAudioThumbnailSequence(_:samplesPerChunk:timeRange:numberOfSamples:numberOfChannels:)` | Streams a waveform from an audio block or video fill. Returns `AsyncThrowingStream<AudioThumbnail, Error>`. |
| `engine.block.forceLoadAVResource(_:)` | Loads a video fill or audio block before requesting previews from it. |

The exact signatures:

```swift
public func generateVideoThumbnailSequence(
  _ id: DesignBlockID,
  thumbnailHeight: Int,
  timeRange: ClosedRange<Double>,
  numberOfFrames: Int,
) -> AsyncThrowingStream<VideoThumbnail, Error>

public func generateAudioThumbnailSequence(
  _ id: DesignBlockID,
  samplesPerChunk: Int,
  timeRange: ClosedRange<Double>,
  numberOfSamples: Int,
  numberOfChannels: Int,
) -> AsyncThrowingStream<AudioThumbnail, Error>
```

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `VideoThumbnail.frameIndex` | `Int` | Position of this frame in the requested sequence. Always `0` when the request failed. |
| `VideoThumbnail.image` | `CGImage` | The rendered frame. Read `image.width` and `image.height` for its size. |
| `AudioThumbnail.chunkIndex` | `Int` | Position of this chunk in the requested sequence. |
| `AudioThumbnail.samples` | `[Float]` | Channel-interleaved loudness values in `0...1`. The final chunk may be shorter than `samplesPerChunk * numberOfChannels`. |

## Next Steps

- [Create Thumbnail](./create-thumbnail.md) — Export a page to a static preview image with target dimensions.
- [Timeline Editor](../create-video/timeline-editor.md) — Arrange tracks and clips for the timeline surface these previews decorate.
- [Trim](../edit-video/trim.md) — Set trim offsets and lengths, which the video-fill preview path deliberately ignores.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support