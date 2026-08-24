> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Record Reaction](./record-reaction.md)

---

```swift file=@cesdk_swift_examples/camera-guides-record-reaction/ReactionCameraSolution.swift reference-only
import IMGLYCamera
import SwiftUI

struct ReactionCameraSolution: View {
  // The video the user reacts to. In a real app your content supplies this URL.
  private let baseVideoURL = URL(string: "https://cdn.img.ly/packages/imgly/cesdk-swift/1.77.0" +
    "/assets/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4")!

  @State private var isPresented = false
  @State private var baseVideo: Recording?
  @State private var reactionClips: [Recording] = []
  @State private var reactionClipURLs: [URL] = []

  var body: some View {
    Button("Record a Reaction") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      Camera(
        .init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
              userID: "<your unique user id>"),
        mode: .reaction(.vertical, video: baseVideoURL, positionsSwapped: false),
      ) { result in
        switch result {
        case let .success(.reaction(video: base, reaction: clips)):
          baseVideo = base
          reactionClips = clips
          reactionClipURLs = clips.compactMap { $0.videos.first?.url }
        case .success(.capture):
          break
        case .failure(.cancelled):
          break // The user closed the camera without recording.
        case .failure(.failedToLoadVideo):
          print("The base video could not be loaded.")
        case let .failure(error):
          print(error.localizedDescription)
        }
        isPresented = false
      }
    }
  }
}
```

Record the user while a video plays with the IMGLY Mobile Camera in reaction mode. The base video plays in one half of the screen while the camera records the user's reaction, and the session returns the base video together with every recorded reaction clip.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260824/camera-guides-record-reaction)

This guide uses the IMGLY Mobile Camera in reaction mode. For adding the camera to your app, presenting it, and the `Info.plist` permission keys it requires, see [Integrate Mobile Camera](./integrate.md); for the full set of camera options, see [Mobile Camera Configuration](./camera-configuration.md). To compose the returned recordings into an editable picture-in-picture video scene, continue with [Record Reaction](../../create-video/record-reaction.md) in the video-creation guides.

## Launch the Camera in Reaction Mode

Present the camera from a full-screen cover and pass `mode: .reaction(_:video:positionsSwapped:)`. The `video:` argument is required — it takes the URL of the video the user reacts to, either a local file or a remote resource. `baseVideoURL` holds that video in the example and points at a sample video on the IMG.LY CDN.

```swift highlight-recordReaction-launch
Button("Record a Reaction") {
  isPresented = true
}
.fullScreenCover(isPresented: $isPresented) {
  Camera(
    .init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
          userID: "<your unique user id>"),
    mode: .reaction(.vertical, video: baseVideoURL, positionsSwapped: false),
  ) { result in
```

The other two arguments control the preview layout and are optional — `.reaction(video: baseVideoURL)` alone starts a vertical session with the base video on top.

The session starts on the front camera so the user's face is in frame right away; the flip button switches cameras at any time. Recording is capped at the base video's duration, so a reaction can never run longer than the video it responds to.

## Choose the Layout

The unlabeled first argument takes a `CameraLayoutMode`: `.vertical` stacks the two feeds on top of each other, `.horizontal` places them side by side. The base video plays in the top half (`.vertical`) or the left half (`.horizontal`), and the camera preview fills the other half. Pass `positionsSwapped: true` to start the session with the two positions exchanged.

The user can adjust both choices in the camera: the Reaction menu switches between the vertical and horizontal layouts until the first clip is recorded, and the swap button exchanges the two positions until recording starts. A reaction session stays in reaction mode — the in-camera menu offers layout choices only, so there is no need to lock the mode.

## Handle the Result

When the user closes the camera, the dismiss closure receives a `Result`. A successful reaction session delivers `CameraResult.reaction(video:reaction:)`; the `.capture` case belongs to the other camera modes.

```swift highlight-recordReaction-result
switch result {
case let .success(.reaction(video: base, reaction: clips)):
  baseVideo = base
  reactionClips = clips
  reactionClipURLs = clips.compactMap { $0.videos.first?.url }
case .success(.capture):
  break
case .failure(.cancelled):
  break // The user closed the camera without recording.
case .failure(.failedToLoadVideo):
  print("The base video could not be loaded.")
case let .failure(error):
  print(error.localizedDescription)
}
isPresented = false
```

The two associated values carry the whole session:

- `video` — a `Recording` that wraps the base video you passed in, together with its layout `rect` and playback duration.
- `reaction` — one `Recording` per shutter press. Stopping and starting the recording produces multiple entries, each covering one segment of the session.

Each `Recording` exposes its clip files in `videos` and the clip length in `duration`. In a reaction session every reaction `Recording` contains a single `Recording.Video`, whose `url` points at the recorded file and whose `rect` describes where the camera feed sat in the layout. The URLs are temporary files — copy them to an app-managed location to keep them, as shown in [Access Recordings](./recordings.md).

Two error cases deserve explicit handling: `.cancelled` reports that the user closed the camera without recording — dismiss silently rather than showing an error — and `.failedToLoadVideo` is specific to reaction sessions and reports that the base video could not be loaded. Denied camera or microphone access surfaces as `.permissionsMissing`.

To turn the result into an editable scene, hand the `CameraResult` to the editor and let it build the picture-in-picture composition — [Record Reaction](../../create-video/record-reaction.md) walks through that flow.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `Camera(_:config:mode:onDismiss:)` | Present the Mobile Camera with the given engine settings and configuration (`mode` defaults to `.standard`) |
| `CameraMode.reaction(_:video:positionsSwapped:)` | Play the given video while recording the user; the layout defaults to `.vertical` and `positionsSwapped` to `false` |

### Result Types

| Type | Description |
| --- | --- |
| `CameraResult.reaction(video:reaction:)` | The base video plus one `Recording` per reaction clip |
| `Recording` | A recorded clip; `videos` holds the recorded file(s) and `duration` the clip length |
| `Recording.Video` | One recorded file — `url` points at the video and `rect` at its position in the layout |
| `CameraError` | `.cancelled`, `.permissionsMissing` and `.failedToLoadVideo` — the last one only occurs in reaction sessions |

## Next Steps

- [Record Reaction](../../create-video/record-reaction.md) — Compose the base video and reaction clips into an editable picture-in-picture video scene.
- [Access Recordings](./recordings.md) — Access and persist the photos and videos a session produces.
- [Mobile Camera Configuration](./camera-configuration.md) — Configure capture modes, duration limits, and appearance.
- [Integrate Mobile Camera](./integrate.md) — Add the Mobile Camera to your app and present it.
- [Dual Camera](./dual-camera.md) — Record with the front and back cameras at the same time.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support