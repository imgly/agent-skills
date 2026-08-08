> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Dual Camera](./dual-camera.md)

---

```swift file=@cesdk_swift_examples/editor-guides-dual-camera/DualCameraSolution.swift reference-only
import IMGLYCamera
import IMGLYEditor
import IMGLYEngine
import SwiftUI

struct DualCameraSolution: View {
  struct DualCameraResult: Identifiable {
    let id = UUID()
    let result: CameraResult
  }

  @State private var isCameraPresented = false
  @State private var dualCameraResult: DualCameraResult?

  var body: some View {
    Group {
      if Camera.isModeSupported(.dualCamera()) {
        Button("Record with Dual Camera") {
          isCameraPresented = true
        }
      } else {
        Text("Dual Camera isn't supported on this device.")
      }
    }
    .fullScreenCover(isPresented: $isCameraPresented) {
      Camera(
        EngineSettings(license: secrets.licenseKey, userID: "<your unique user id>"),
        config: CameraConfiguration(allowModeSwitching: false),
        mode: .dualCamera(.vertical),
      ) { cameraResult in
        switch cameraResult {
        case let .success(value):
          dualCameraResult = DualCameraResult(result: value)
          isCameraPresented = false

        case let .failure(error) where error == .cancelled:
          isCameraPresented = false

        case let .failure(error):
          print(error.localizedDescription)
          isCameraPresented = false
        }
      }
    }
    .fullScreenCover(item: $dualCameraResult) { dualCameraResult in
      ModalEditor {
        Editor(EngineSettings(license: secrets.licenseKey, userID: "<your unique user id>"))
          .imgly.configuration {
            VideoEditorConfiguration { builder in
              builder.onCreate { engine, _ in
                try await engine.createScene(from: dualCameraResult.result)
                try await VideoEditorConfiguration.defaultLoadAssetSources(engine)
              }
            }
          }
      }
    }
  }
}

// Customization path: build the scene manually instead of calling
// `engine.createScene(from:)`. Copy this when you need a custom composition
// (picture-in-picture, animated split, etc.) — change the `rect` of a feed
// before passing it to `setFrame`.

@MainActor
private func buildDualCameraSceneManually(engine: Engine, result: CameraResult) async throws {
  guard case let .capture(captures) = result else { return }
  let recordings = captures.videos
  guard
    let firstRecording = recordings.first,
    let firstVideo = firstRecording.videos.first
  else {
    return
  }

  try await engine.scene.create(fromVideo: firstVideo.url)

  guard let page = try engine.scene.getCurrentPage() else { return }
  let sceneFrame = firstRecording.videos
    .map(\.rect)
    .reduce(CGRect.null) { $0.union($1) }
  try setFrame(engine: engine, designBlock: page, rect: sceneFrame)

  guard let firstBlock = try engine.block.find(byType: .graphic).first else { return }
  try setFrame(engine: engine, designBlock: firstBlock, rect: firstVideo.rect)
  try engine.block.setDuration(firstBlock, duration: firstRecording.duration.seconds)

  for video in firstRecording.videos.dropFirst() {
    let block = try engine.block.create(.graphic)
    let shape = try engine.block.createShape(.rect)
    try engine.block.setShape(block, shape: shape)
    try setFrame(engine: engine, designBlock: block, rect: video.rect)

    let fill = try engine.block.createFill(.video)
    try engine.block.setURL(fill, property: "fill/video/fileURI", value: video.url)
    try engine.block.setFill(block, fill: fill)

    try engine.block.setDuration(block, duration: firstRecording.duration.seconds)
    try engine.block.appendChild(to: page, child: block)
  }
}

@MainActor
private func setFrame(engine: Engine, designBlock: DesignBlockID, rect: CGRect) throws {
  try engine.block.setWidth(designBlock, value: Float(rect.width))
  try engine.block.setHeight(designBlock, value: Float(rect.height))
  try engine.block.setPositionX(designBlock, value: Float(rect.minX))
  try engine.block.setPositionY(designBlock, value: Float(rect.minY))
}

```

Dual Camera mode records the front and back cameras at the same time into two synchronized clips. Capture the subject and the person filming in one session, then arrange the clips in the editor as a split screen, picture-in-picture, or any custom layout.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/editor-guides-dual-camera)

Dual Camera mode is a camera workflow. For adding the camera to your app, presenting it, and the `Info.plist` permission keys it requires, see [Integrate Mobile Camera](./integrate.md); for the full set of camera options, see [Mobile Camera Configuration](./camera-configuration.md).

The example also uses two small helpers the iOS guides repository ships: [`ModalEditor.swift`](https://github.com/imgly/cesdk-swift-examples/blob/v1.81.0-nightly.20260808/editor-guides-quickstart/ModalEditor.swift) — a wrapper around `fullScreenCover` — and [`Secrets.swift`](https://github.com/imgly/cesdk-swift-examples/blob/v1.81.0-nightly.20260808/secrets/Secrets.swift), which supplies `secrets.licenseKey`. Substitute your own presentation and license-key plumbing — neither is part of the CE.SDK shipped to customers.

## When to Use It

Choose Dual Camera mode when both perspectives are part of the story:

- Interviews, podcasts, and conversations where both participants should be visible
- Reaction content during live events, like filming a concert while capturing the audience
- Vlogs and narrated tutorials that show both the subject and the presenter

It is not the right fit when:

- A single selfie or back-camera clip is enough — use the default Standard mode
- A base video should play back while the user records — use [Record Reaction](./record-reaction.md) mode
- You expect one pre-composited side-by-side file — Dual Camera returns two clips, and you compose them in the editor

## Check Device Support

Simultaneous front-and-back capture requires multi-camera hardware. Older iPhones and the iOS Simulator don't support it — launching the camera with `.dualCamera` on such a device prints a console warning and falls back to `.standard` mode. Check `Camera.isModeSupported(_:)` before presenting the camera so your UI can branch on the result. The example hides the dual-camera entry point on unsupported devices instead of letting the session silently downgrade:

```swift highlight-dualCamera-modeCheck
if Camera.isModeSupported(.dualCamera()) {
  Button("Record with Dual Camera") {
    isCameraPresented = true
  }
} else {
  Text("Dual Camera isn't supported on this device.")
}
```

## Launch the Camera

Initialize `Camera` with `mode: .dualCamera(.vertical)` to stack the two preview windows on top of each other, or `.dualCamera(.horizontal)` to place them side by side. The example also passes `CameraConfiguration(allowModeSwitching: false)` to lock the camera into the launched mode — users can still switch between the vertical and horizontal layouts from the camera's features menu, but can't exit to Standard mode. With the default `true`, the features menu also offers mode switching.

```swift highlight-dualCamera-launch
Camera(
  EngineSettings(license: secrets.licenseKey, userID: "<your unique user id>"),
  config: CameraConfiguration(allowModeSwitching: false),
  mode: .dualCamera(.vertical),
) { cameraResult in
```

The two preview rectangles aren't permanently bound to the front or back camera. Tapping the flip button swaps the feeds shown in each rectangle, but the rectangles keep their identity — a flip during recording is part of the resulting clip.

## Handle the Result

When the user finishes, the `onDismiss` closure receives a `Result<CameraResult, CameraError>`. On success, a dual-camera session returns `.capture([Capture])` with one `Capture` per shutter press. Store the `CameraResult` and hand it to the editor in the next step; handle `.cancelled` and other failures separately.

```swift highlight-dualCamera-handleResult
        switch cameraResult {
        case let .success(value):
          dualCameraResult = DualCameraResult(result: value)
          isCameraPresented = false

        case let .failure(error) where error == .cancelled:
          isCameraPresented = false

        case let .failure(error):
          print(error.localizedDescription)
          isCameraPresented = false
        }
```

Dual Camera records video, so each `Capture` is a `.video(Recording)` — the `[Capture].videos` helper extracts them as `[Recording]`. Each `Recording` carries two `Recording.Video` entries, one per camera feed, each with the clip's file `url` and the `rect` it occupied in the camera's 1080×1920 canvas. The preview windows crop each feed to fit the on-screen layout, while the recorded clips contain the full camera frames, time-synced so they align in the editor.

The returned URLs point at temporary files, so copy them to an app-managed location if you keep them beyond the current workflow — see [Access Recordings](./recordings.md). To capture stills instead, set `captureType: .photo` in the `CameraConfiguration`; dual-camera photos arrive as `.photo(Photo)` captures whose `Photo.images` array holds one image per feed, as covered in [Access Photos](./photos.md).

## Open the Recordings in the Editor

`engine.createScene(from:)` — an `IMGLYCamera` extension on `Engine` — takes the stored `CameraResult` and builds an editable video scene from it. It places the first feed of each recording on the scene's background track and the second feed on a parallel track, positions every clip using the `rect` of its `Recording.Video`, and chains multiple recordings end to end. A vertical capture lands as a top/bottom layout, a horizontal capture side by side. Call it from your editor configuration's `onCreate` callback:

```swift highlight-dualCamera-openInEditor
try await engine.createScene(from: dualCameraResult.result)
```

## Custom Scene Construction

When you need a different composition — picture-in-picture, an overlaid feed, an animated split — build the scene yourself with `IMGLYEngine` APIs instead of calling `engine.createScene(from:)`. The helper below extracts the recordings with `captures.videos`, seeds the scene with the first feed, sizes the page to the union of both feed rects, and adds the remaining feed as a `.graphic` block with a video fill on top. Change the `rect` you pass to `setFrame` to position a feed anywhere — for picture-in-picture, scale and offset the second feed's `rect` into a corner.

```swift highlight-dualCamera-customBuildScene
@MainActor
private func buildDualCameraSceneManually(engine: Engine, result: CameraResult) async throws {
  guard case let .capture(captures) = result else { return }
  let recordings = captures.videos
  guard
    let firstRecording = recordings.first,
    let firstVideo = firstRecording.videos.first
  else {
    return
  }

  try await engine.scene.create(fromVideo: firstVideo.url)

  guard let page = try engine.scene.getCurrentPage() else { return }
  let sceneFrame = firstRecording.videos
    .map(\.rect)
    .reduce(CGRect.null) { $0.union($1) }
  try setFrame(engine: engine, designBlock: page, rect: sceneFrame)

  guard let firstBlock = try engine.block.find(byType: .graphic).first else { return }
  try setFrame(engine: engine, designBlock: firstBlock, rect: firstVideo.rect)
  try engine.block.setDuration(firstBlock, duration: firstRecording.duration.seconds)

  for video in firstRecording.videos.dropFirst() {
    let block = try engine.block.create(.graphic)
    let shape = try engine.block.createShape(.rect)
    try engine.block.setShape(block, shape: shape)
    try setFrame(engine: engine, designBlock: block, rect: video.rect)

    let fill = try engine.block.createFill(.video)
    try engine.block.setURL(fill, property: "fill/video/fileURI", value: video.url)
    try engine.block.setFill(block, fill: fill)

    try engine.block.setDuration(block, duration: firstRecording.duration.seconds)
    try engine.block.appendChild(to: page, child: block)
  }
}
```

The `setFrame` helper maps a `rect` the camera returns to CE.SDK block size and position. `engine.block.setWidth(_:value:)`, `setHeight(_:value:)`, `setPositionX(_:value:)`, and `setPositionY(_:value:)` accept `Float` values, so cast each `CGFloat` before passing it in.

```swift highlight-dualCamera-customRectFrame
@MainActor
private func setFrame(engine: Engine, designBlock: DesignBlockID, rect: CGRect) throws {
  try engine.block.setWidth(designBlock, value: Float(rect.width))
  try engine.block.setHeight(designBlock, value: Float(rect.height))
  try engine.block.setPositionX(designBlock, value: Float(rect.minX))
  try engine.block.setPositionY(designBlock, value: Float(rect.minY))
}
```

The helper lays out a single recording. For multi-segment sessions, or when each feed should sit on its own timeline track for independent trimming, `engine.createScene(from:)` already handles both.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `Camera.isModeSupported(_:)` | Returns `true` if the current device supports the given `CameraMode`; `.dualCamera` requires multi-camera hardware |
| `Camera(_:config:mode:onDismiss:)` | Present the Mobile Camera; pass `mode: .dualCamera(.vertical)` or `.dualCamera(.horizontal)` to record both feeds |
| `CameraConfiguration(allowModeSwitching:captureType:)` | Camera options; `allowModeSwitching: false` locks the camera into the launched mode and `captureType: .photo` switches to still capture |
| `Engine.createScene(from:)` | `IMGLYCamera` extension on `Engine` that builds a video scene from a `CameraResult`, laying out clips using each `Recording.Video`'s `rect` |
| `engine.scene.create(fromVideo:)` | Creates a video scene seeded with a single clip; the custom construction path starts from it |

### Result Types

| Type | Description |
| --- | --- |
| `CameraResult.capture([Capture])` | The captures a session produces, one per shutter press |
| `Capture.video(Recording)` | A video capture; the `[Capture].videos` helper extracts all of them as `[Recording]` |
| `Recording` | One recorded segment; holds its `duration` and, in Dual Camera mode, two `Recording.Video` entries |
| `Recording.Video` | One camera feed's clip; holds the file `url` and the `rect` it occupies in the 1080×1920 canvas |

## Next Steps

- [Access Recordings](./recordings.md) — Inspect recorded durations, URLs, and preview rects, and persist the files.
- [Record Reaction](./record-reaction.md) — Record the user while a base video plays back.
- [Integrate Mobile Camera](./integrate.md) — Add the Mobile Camera to your app and present it.
- [Mobile Camera Configuration](./camera-configuration.md) — Configure capture modes, duration limits, and appearance.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support