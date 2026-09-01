> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Access Recordings](./recordings.md)

---

```swift file=@cesdk_swift_examples/camera-guides-recordings/RecordingsCameraSolution.swift reference-only
import IMGLYCamera
import SwiftUI

struct RecordingsCameraSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                                userID: "<your unique user id>")

  @State private var isPresented = false
  @State private var persistedVideoURLs: [URL] = []

  var body: some View {
    Button("Use the Camera") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      Camera(settings) { result in
        defer { isPresented = false }
        switch result {
        case let .success(.capture(captures)):
          for recording in captures.videos {
            print(recording.duration)
            for video in recording.videos {
              print(video.url)
              print(video.rect)
            }
          }
          persistedVideoURLs = captures.videos.flatMap(\.videos).compactMap { video in
            try? persistFile(from: video.url, fileName: video.url.lastPathComponent)
          }

        case let .success(.reaction(video: baseVideo, reaction: reactions)):
          print(baseVideo.duration)
          for recording in reactions {
            print(recording.duration)
            for video in recording.videos {
              print(video.url)
              print(video.rect)
            }
          }
          persistedVideoURLs = reactions.flatMap(\.videos).compactMap { video in
            try? persistFile(from: video.url, fileName: video.url.lastPathComponent)
          }

        case let .failure(error):
          switch error {
          case .cancelled:
            break
          case .permissionsMissing, .failedToLoadVideo:
            print(error.localizedDescription) // Surface these in your UI.
          }
        }
      }
    }
  }

  /// Copies a captured file from the temporary directory to the app's Documents directory.
  private func persistFile(from sourceURL: URL, fileName: String) throws -> URL {
    let documentsURL = try FileManager.default.url(
      for: .documentDirectory,
      in: .userDomainMask,
      appropriateFor: nil,
      create: true,
    )
    let destinationURL = documentsURL.appendingPathComponent(fileName)
    if FileManager.default.fileExists(atPath: destinationURL.path) {
      try FileManager.default.removeItem(at: destinationURL)
    }
    try FileManager.default.copyItem(at: sourceURL, to: destinationURL)
    return destinationURL
  }
}
```

Access the photos, videos, and reactions the IMGLY Mobile Camera returns when it's dismissed, and persist the temporary capture files so your app can play, edit, or upload them later.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/camera-guides-recordings)

This guide reads the results of a standalone camera session — Standard, Dual Camera, or Reaction. For adding the camera to your app and presenting it, see [Integrate Mobile Camera](./integrate.md); for the full set of camera options, see [Mobile Camera Configuration](./camera-configuration.md).

> **Note:** This guide covers the standalone camera. The camera built into the [Video Editor](../../starterkits/video-editor.md) adds captures to the editor session through its upload asset sources, where dual and segmented captures arrive as multiple assets — see [From User Upload](../from-local-source/user-upload.md).

## Get the Camera Result

The camera hands its result to the trailing `onDismiss` closure as a `Result<CameraResult, CameraError>` when it's dismissed — every path through this guide starts from that value. The camera presents its own permission prompts; declare `NSCameraUsageDescription` and `NSMicrophoneUsageDescription` in your app's `Info.plist`, because non-photo capture types, including `.video` and `.mixed`, request microphone access.

```swift highlight-recordings-present
  let settings = EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                                userID: "<your unique user id>")

  @State private var isPresented = false
  @State private var persistedVideoURLs: [URL] = []

  var body: some View {
    Button("Use the Camera") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      Camera(settings) { result in
        defer { isPresented = false }
        switch result {
```

The `mode` parameter defaults to `.standard`; pass `.dualCamera()` or `.reaction(video:)` for dual-camera or reaction sessions, and check `Camera.isModeSupported(_:)` before launching `.dualCamera` — devices that don't support it fall back to `.standard`. The example resets the presentation binding in a `defer`, so the cover dismisses however the session ends.

## Success

On success, `CameraResult` has two cases: `.capture([Capture])` for standard and dual-camera sessions of any capture type, and `.reaction(video:reaction:)` for reaction mode. To compose the returned captures into an editable video scene instead of reading the files yourself, use `engine.createScene(from:)` — see [Record Reaction](../../create-video/record-reaction.md).

### Standard Camera

A `.capture([Capture])` result preserves the user's capture order. Each entry is either a `.video(Recording)` or — in the `.photo` and `.mixed` capture types — a `.photo(Photo)`. Use the `captures.videos` extension to extract only the `[Recording]` values when your app works with video alone.

```swift highlight-recordings-standard
case let .success(.capture(captures)):
  for recording in captures.videos {
    print(recording.duration)
    for video in recording.videos {
      print(video.url)
      print(video.rect)
    }
  }
  persistedVideoURLs = captures.videos.flatMap(\.videos).compactMap { video in
    try? persistFile(from: video.url, fileName: video.url.lastPathComponent)
  }
```

The user can tap the record button repeatedly to capture several segments in one session. The camera shows the segments as arcs around the record button and returns one `Recording` per shutter press.

Each `Recording` carries its `duration` (a `CMTime`) and a `videos` array holding one `Video` in single-camera mode or two in dual-camera mode, one per lens. Every `Video` has:

- A `url` pointing at the recorded file in the app's temporary directory. Copy or move the file before relying on it later — see [Persist Temporary Files](./recordings.md#persist-temporary-files).
- A `rect` describing where that lens's feed sat in the camera preview, so you can recreate dual-camera and reaction layouts.

Still photos arrive on the same stack as `Capture.photo(Photo)` entries, each wrapping one or two `Photo.Image` values with the same `url` and `rect` shape — see [Access Photos](./photos.md).

### Video Reaction

In reaction mode, the result arrives as `.reaction(video:reaction:)`: `video` is a `Recording` wrapping the URL your app passed to `CameraMode.reaction`, and `reaction` holds the user's recordings — again one `Recording` per segment.

```swift highlight-recordings-reaction
case let .success(.reaction(video: baseVideo, reaction: reactions)):
  print(baseVideo.duration)
  for recording in reactions {
    print(recording.duration)
    for video in recording.videos {
      print(video.url)
      print(video.rect)
    }
  }
  persistedVideoURLs = reactions.flatMap(\.videos).compactMap { video in
    try? persistFile(from: video.url, fileName: video.url.lastPathComponent)
  }
```

Only the reaction clips are camera-produced temporary files; the base video is the one you supplied.

## Failure

The dismiss closure receives `.failure(CameraError)` when the session produced nothing to read. The three cases:

- `.cancelled` — the user closed the camera (confirming the discard prompt if they had captured anything), or it was dismissed programmatically. The camera deletes any captures made during the session, so dismiss quietly without surfacing an error.
- `.permissionsMissing` — the user denied camera or microphone access.
- `.failedToLoadVideo` — reaction mode only: the video to react to failed to load.

```swift highlight-recordings-failure
case let .failure(error):
  switch error {
  case .cancelled:
    break
  case .permissionsMissing, .failedToLoadVideo:
    print(error.localizedDescription) // Surface these in your UI.
  }
```

## Persist Temporary Files

The camera writes captures to the app's temporary directory and hands you their URLs. The system periodically purges that directory, so copy or move each file to an app-managed location — the Documents directory, an app group container, or your upload queue — before you rely on it.

```swift highlight-recordings-persist
/// Copies a captured file from the temporary directory to the app's Documents directory.
private func persistFile(from sourceURL: URL, fileName: String) throws -> URL {
  let documentsURL = try FileManager.default.url(
    for: .documentDirectory,
    in: .userDomainMask,
    appropriateFor: nil,
    create: true,
  )
  let destinationURL = documentsURL.appendingPathComponent(fileName)
  if FileManager.default.fileExists(atPath: destinationURL.path) {
    try FileManager.default.removeItem(at: destinationURL)
  }
  try FileManager.default.copyItem(at: sourceURL, to: destinationURL)
  return destinationURL
}
```

The example calls this helper from both success paths to copy every camera-produced video — standard captures and reaction clips — into the Documents directory, skipping files that fail to copy. Switch to `moveItem(at:to:)` if you don't need to keep the temporary copy.

This copy stays within the app sandbox on the same volume, where APFS clones make it close to instantaneous — the synchronous call doesn't hold up dismissal. If you do heavier work with the captures instead — uploading, transcoding, or moving them to another volume — run it off the main actor so it doesn't block your UI.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `Camera(_:config:mode:onDismiss:)` | Present the Mobile Camera; `onDismiss` receives a `Result<CameraResult, CameraError>` |
| `Camera.isModeSupported(_:)` | Check whether the device supports a mode such as `.dualCamera` before launching |
| `[Capture].videos` | Extract the `[Recording]` values from a heterogeneous capture stack |
| `engine.createScene(from:)` | Compose a `CameraResult` into an editable scene (see [Record Reaction](../../create-video/record-reaction.md)) |

### Result Types

| Type | Description |
| --- | --- |
| `CameraResult.capture([Capture])` | The photos and videos of a non-reaction session, in capture order |
| `CameraResult.reaction(video:reaction:)` | The base `Recording` plus the user's reaction recordings |
| `Capture.photo(Photo)` / `Capture.video(Recording)` | The entries of the capture stack |
| `Recording` | One per shutter press; `duration` (`CMTime`) and one or two `Video`s |
| `Recording.Video` | The captured file's temporary `url` and its `rect` in the camera preview |
| `Photo.Image` | A still image's file `url` and its `rect` |
| `CameraError` | `.cancelled`, `.permissionsMissing`, or `.failedToLoadVideo` |

## Next Steps

- [Take Photo](./take-photo.md) — Capture a still photo with the IMGLY Mobile Camera in photo mode.
- [Access Photos](./photos.md) — Access the still photos captured with the Mobile Camera.
- [Dual Camera](./dual-camera.md) — Record with the front and back cameras at the same time.
- [Record Reaction](../../create-video/record-reaction.md) — Record reactions to a base video and compose them into an editable video scene.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support