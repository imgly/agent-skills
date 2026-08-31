> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Record Video](./record-video.md)

---

```swift file=@cesdk_swift_examples/engine-guides-using-camera/UsingCamera.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func usingCamera(engine: Engine) async throws {
  try engine.scene.createVideo()
  let stack = try engine.block.find(byType: .stack).first!
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: stack, child: page)

  let pixelStreamFill = try engine.block.createFill(.pixelStream)
  try engine.block.setFill(page, fill: pixelStreamFill)

  try engine.block.appendEffect(page, effectID: try engine.block.createEffect(.halfTone))

  try engine.block.setEnum(
    pixelStreamFill,
    property: "fill/pixelStream/orientation",
    value: "UpMirrored",
  )

  let camera = try Camera()

  Task {
    try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)
    for try await event in camera.captureVideo() {
      switch event {
      case let .frame(buffer):
        try engine.block.setNativePixelBuffer(pixelStreamFill, buffer: buffer)
      case let .videoCaptured(url):
        // Use a `VideoFill` for the recorded video file.
        let videoFill = try engine.block.createFill(.video)
        try engine.block.setFill(page, fill: videoFill)
        try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: url)
      }
    }
  }

  // Stop capturing after 5 seconds.
  Task {
    try? await Task.sleep(nanoseconds: NSEC_PER_SEC * 5)
    camera.stopCapturing()
  }
}
```

```swift file=@cesdk_swift_examples/engine-guides-using-camera/Camera.swift reference-only
import AVFoundation
import Foundation

enum VideoCapture: @unchecked Sendable {
  case frame(CVImageBuffer)
  case videoCaptured(URL)
}

final class Camera: NSObject, @unchecked Sendable {
  private lazy var queue = DispatchQueue(label: "ly.img.camera", qos: .userInteractive)

  private var videoContinuation: AsyncThrowingStream<VideoCapture, Error>.Continuation?

  private let videoInput: AVCaptureDeviceInput
  private let audioInput: AVCaptureDeviceInput

  private var captureSession: AVCaptureSession!
  private var movieOutput: AVCaptureMovieFileOutput

  init(
    videoDevice: AVCaptureDevice = .default(for: .video)!,
    audioDevice: AVCaptureDevice = .default(for: .audio)!,
  ) throws {
    videoInput = try AVCaptureDeviceInput(device: videoDevice)
    audioInput = try AVCaptureDeviceInput(device: audioDevice)
    movieOutput = AVCaptureMovieFileOutput()
  }

  func captureVideo(toURL fileURL: URL = .init(fileURLWithPath: NSTemporaryDirectory() + UUID().uuidString + ".mp4"))
    -> AsyncThrowingStream<VideoCapture, Error> {
    .init { continuation in
      videoContinuation = continuation

      captureSession = AVCaptureSession()
      captureSession.addInput(videoInput)
      captureSession.addInput(audioInput)

      let videoOutput = AVCaptureVideoDataOutput()
      videoOutput.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
      videoOutput.setSampleBufferDelegate(self, queue: queue)

      captureSession.addOutput(videoOutput)

      captureSession.addOutput(movieOutput)

      queue.async {
        self.captureSession.startRunning()
        self.movieOutput.startRecording(to: fileURL, recordingDelegate: self)
      }

      continuation.onTermination = { _ in
        self.queue.async {
          self.movieOutput.stopRecording()
          self.captureSession.stopRunning()
        }
      }
    }
  }

  func stopCapturing() {
    queue.async {
      self.movieOutput.stopRecording()
      self.captureSession?.stopRunning()
    }
  }
}

extension Camera: AVCaptureVideoDataOutputSampleBufferDelegate {
  func captureOutput(
    _: AVCaptureOutput,
    didOutput sampleBuffer: CMSampleBuffer,
    from _: AVCaptureConnection,
  ) {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
    videoContinuation?.yield(.frame(pixelBuffer))
  }
}

extension Camera: AVCaptureFileOutputRecordingDelegate {
  func fileOutput(
    _: AVCaptureFileOutput,
    didStartRecordingTo _: URL,
    from _: [AVCaptureConnection],
  ) {}
  func fileOutput(
    _: AVCaptureFileOutput,
    didFinishRecordingTo url: URL,
    from _: [AVCaptureConnection],
    error: Error?,
  ) {
    if let error {
      videoContinuation?.finish(throwing: error)
    } else {
      videoContinuation?.yield(.videoCaptured(url))
      videoContinuation?.finish()
    }
  }
}

```

Beyond pre-recorded video, you can pipe a live camera feed into the engine with a
`PixelStreamFill`. The feed composes with the rest of your scene, so the engine's effects
apply to the live preview in real time. When recording finishes, swap the fill for a
`VideoFill` to play the captured file back.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-using-camera)

<EngineReferenceNote {...props} />

On iOS, if you want IMG.LY's ready-made camera UI instead of wiring your own capture pipeline,
see [Integrate Mobile Camera](./integrate.md). This guide takes the engine-level path.

A `PixelStreamFill` accepts raw pixel buffers frame by frame, so you can drive it from any
camera pipeline. Because the feed is a regular fill, engine features like
[strokes](../../outlines/strokes.md) and [drop shadows](../../outlines/shadows-and-glows.md) apply to the live
preview just as they would to any other block. This guide uses `AVFoundation`'s
`AVCaptureSession` — wrapped in a small `Camera` helper — to feed frames into a video scene,
applies an effect to the preview, and swaps in a `VideoFill` for playback once recording stops.

## Create a Video Scene with a Camera Fill

Create a video scene with a single page, assign a `PixelStreamFill` to the page, and append
an effect to confirm that the live preview composes with the engine's rendering.

```swift highlight-record-video-setup
  try engine.scene.createVideo()
  let stack = try engine.block.find(byType: .stack).first!
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: stack, child: page)

  let pixelStreamFill = try engine.block.createFill(.pixelStream)
  try engine.block.setFill(page, fill: pixelStreamFill)

  try engine.block.appendEffect(page, effectID: try engine.block.createEffect(.halfTone))
```

## Control Feed Orientation

Transforming every pixel buffer on the CPU is wasteful. Instead, the `PixelStreamFill`
exposes a `fill/pixelStream/orientation` property that the GPU applies during rendering — use
it to mirror a front-facing feed or rotate the image in 90° steps.

```swift highlight-record-video-orientation
try engine.block.setEnum(
  pixelStreamFill,
  property: "fill/pixelStream/orientation",
  value: "UpMirrored",
)
```

Available orientation values:

| Value | Effect |
| --- | --- |
| `Up` | No rotation (default) |
| `Down` | 180° rotation |
| `Left` | 90° counter-clockwise |
| `Right` | 90° clockwise |
| `UpMirrored` | Horizontal flip |
| `DownMirrored` | 180° + horizontal flip |
| `LeftMirrored` | 90° CCW + horizontal flip |
| `RightMirrored` | 90° CW + horizontal flip |

## Access the Camera

The `Camera` helper wraps an `AVCaptureSession` with video and audio inputs plus frame and
file outputs. `captureVideo()` starts the frame stream and file recording together. Bring the
page into view with `engine.scene.zoom`, then handle each event from the stream: feed
`.frame` buffers into the fill, and on `.videoCaptured` swap the `PixelStreamFill` for a
`VideoFill` to play back the recorded file.

```swift highlight-record-video-camera
  let camera = try Camera()

  Task {
    try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)
    for try await event in camera.captureVideo() {
```

## Update the Fill with Video Frames

On each `.frame` event, push the new buffer into the `PixelStreamFill` with
`setNativePixelBuffer`, which accepts a `CVPixelBuffer`.

```swift highlight-record-video-update-fill
case let .frame(buffer):
  try engine.block.setNativePixelBuffer(pixelStreamFill, buffer: buffer)
```

## Stop and Play Back the Recording

Call `camera.stopCapturing()` to end recording — here a timer stops it after five seconds; in a
real app you would wire it to a stop button.

```swift highlight-record-video-stop
// Stop capturing after 5 seconds.
Task {
  try? await Task.sleep(nanoseconds: NSEC_PER_SEC * 5)
  camera.stopCapturing()
}
```

Stopping finalizes the file and delivers a `.videoCaptured` event carrying its URL. Swap the
`PixelStreamFill` for a `VideoFill` that points at that URL to play the recording back in the
same scene.

```swift highlight-record-video-playback
case let .videoCaptured(url):
  // Use a `VideoFill` for the recorded video file.
  let videoFill = try engine.block.createFill(.video)
  try engine.block.setFill(page, fill: videoFill)
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: url)
```

## The Camera Helper

`Camera` is a self-contained `AVFoundation` wrapper that surfaces the capture session as an
`AsyncThrowingStream` of frame and file events. Drop it into your project alongside the engine
code above.

```swift highlight-record-video-camera-helper
import AVFoundation
import Foundation

enum VideoCapture: @unchecked Sendable {
  case frame(CVImageBuffer)
  case videoCaptured(URL)
}

final class Camera: NSObject, @unchecked Sendable {
  private lazy var queue = DispatchQueue(label: "ly.img.camera", qos: .userInteractive)

  private var videoContinuation: AsyncThrowingStream<VideoCapture, Error>.Continuation?

  private let videoInput: AVCaptureDeviceInput
  private let audioInput: AVCaptureDeviceInput

  private var captureSession: AVCaptureSession!
  private var movieOutput: AVCaptureMovieFileOutput

  init(
    videoDevice: AVCaptureDevice = .default(for: .video)!,
    audioDevice: AVCaptureDevice = .default(for: .audio)!,
  ) throws {
    videoInput = try AVCaptureDeviceInput(device: videoDevice)
    audioInput = try AVCaptureDeviceInput(device: audioDevice)
    movieOutput = AVCaptureMovieFileOutput()
  }

  func captureVideo(toURL fileURL: URL = .init(fileURLWithPath: NSTemporaryDirectory() + UUID().uuidString + ".mp4"))
    -> AsyncThrowingStream<VideoCapture, Error> {
    .init { continuation in
      videoContinuation = continuation

      captureSession = AVCaptureSession()
      captureSession.addInput(videoInput)
      captureSession.addInput(audioInput)

      let videoOutput = AVCaptureVideoDataOutput()
      videoOutput.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
      videoOutput.setSampleBufferDelegate(self, queue: queue)

      captureSession.addOutput(videoOutput)

      captureSession.addOutput(movieOutput)

      queue.async {
        self.captureSession.startRunning()
        self.movieOutput.startRecording(to: fileURL, recordingDelegate: self)
      }

      continuation.onTermination = { _ in
        self.queue.async {
          self.movieOutput.stopRecording()
          self.captureSession.stopRunning()
        }
      }
    }
  }

  func stopCapturing() {
    queue.async {
      self.movieOutput.stopRecording()
      self.captureSession?.stopRunning()
    }
  }
}

extension Camera: AVCaptureVideoDataOutputSampleBufferDelegate {
  func captureOutput(
    _: AVCaptureOutput,
    didOutput sampleBuffer: CMSampleBuffer,
    from _: AVCaptureConnection,
  ) {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
    videoContinuation?.yield(.frame(pixelBuffer))
  }
}

extension Camera: AVCaptureFileOutputRecordingDelegate {
  func fileOutput(
    _: AVCaptureFileOutput,
    didStartRecordingTo _: URL,
    from _: [AVCaptureConnection],
  ) {}
  func fileOutput(
    _: AVCaptureFileOutput,
    didFinishRecordingTo url: URL,
    from _: [AVCaptureConnection],
    error: Error?,
  ) {
    if let error {
      videoContinuation?.finish(throwing: error)
    } else {
      videoContinuation?.yield(.videoCaptured(url))
      videoContinuation?.finish()
    }
  }
}
```

## Permissions

Capturing video and audio requires usage-description keys in your app's `Info.plist`. Without
them the system terminates the app the first time the capture session starts.

```xml
<key>NSCameraUsageDescription</key>
<string>Show a live camera preview in the editor.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Record audio while capturing video.</string>
```

## Troubleshooting

**The camera doesn't start** — `AVCaptureDevice.default(for:)` is `nil` on the iOS Simulator
(no capture hardware), and the `Camera` helper force-unwraps it, so `Camera()` crashes there.
Run on a real device, and confirm the camera and microphone permission keys below are present
and granted.

**The feed is mirrored or rotated incorrectly** — adjust `fill/pixelStream/orientation`.
Front-facing cameras usually need `UpMirrored`.

**The effect doesn't render** — verify the effect was created with `createEffect(_:)` and
attached with `appendEffect(_:effectID:)`.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.createVideo()` | Create a video scene for the camera preview |
| `engine.block.createFill(.pixelStream)` | Create a fill that accepts live pixel data |
| `engine.block.setFill(_:fill:)` | Assign the pixel stream fill to a block |
| `engine.block.setNativePixelBuffer(_:buffer:)` | Send a `CVPixelBuffer` to the fill |
| `engine.block.setURL(_:property:value:)` | Point the playback `VideoFill` at the recorded file URL |
| `engine.block.setEnum(_:property:value:)` | Set the orientation for mirroring or rotation |
| `engine.block.createEffect(_:)` | Create an effect for real-time processing |
| `engine.block.appendEffect(_:effectID:)` | Apply an effect to the block |
| `engine.scene.zoom(to:paddingLeft:paddingTop:paddingRight:paddingBottom:)` | Fit the page in the viewport |



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support