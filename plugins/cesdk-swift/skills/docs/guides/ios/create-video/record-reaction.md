> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Record Reaction](./record-reaction.md)

---

```swift file=@cesdk_swift_examples/editor-guides-record-reaction/RecordReactionSolution.swift reference-only
import IMGLYCamera
import IMGLYEditor
import IMGLYEngine
import SwiftUI

struct RecordReactionSolution: View {
  // The video the user will react to. In a real app this is supplied by the caller.
  static let baseVideoURL: URL = {
    let host = "https://cdn.img.ly/packages/imgly/cesdk-swift/1.75.0"
    let path = "/assets/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4"
    return URL(string: host + path)!
  }()

  struct ReactionResult: Identifiable {
    let id = UUID()
    let result: CameraResult
  }

  @State private var isCameraPresented = false
  @State private var reactionResult: ReactionResult?

  var body: some View {
    Button("Record a Reaction") {
      isCameraPresented = true
    }
    .fullScreenCover(isPresented: $isCameraPresented) {
      Camera(
        EngineSettings(license: secrets.licenseKey, userID: "<your unique user id>"),
        config: CameraConfiguration(allowModeSwitching: false),
        mode: .reaction(.vertical, video: Self.baseVideoURL, positionsSwapped: false),
      ) { cameraResult in
        switch cameraResult {
        case let .success(value):
          reactionResult = ReactionResult(result: value)
          isCameraPresented = false

        case let .failure(error) where error == .cancelled:
          isCameraPresented = false

        case let .failure(error):
          print(error.localizedDescription)
          isCameraPresented = false
        }
      }
    }
    .fullScreenCover(item: $reactionResult) { reactionResult in
      ModalEditor {
        Editor(EngineSettings(license: secrets.licenseKey, userID: "<your unique user id>"))
          .imgly.configuration {
            VideoEditorConfiguration { builder in
              builder.onCreate { engine, _ in
                try await engine.createScene(from: reactionResult.result)
                try await VideoEditorConfiguration.defaultLoadAssetSources(engine)
              }
            }
          }
      }
    }
  }
}

// Customization path: build the scene manually instead of calling
// `engine.createScene(from:)`. Copy these helpers when you need to tweak
// the layout, durations, or block hierarchy the default integration produces.

@MainActor
private func buildReactionSceneManually(engine: Engine, result: CameraResult) async throws {
  guard
    case let .reaction(video, reaction) = result,
    let baseVideo = video.videos.first,
    let firstReactionVideo = reaction.first?.videos.first
  else {
    return
  }

  try await engine.scene.create(fromVideo: baseVideo.url)

  guard let page = try engine.scene.getCurrentPage() else { return }
  let sceneFrame = baseVideo.rect.union(firstReactionVideo.rect)
  setFrame(engine: engine, designBlock: page, rect: sceneFrame)

  guard let baseVideoBlock = try engine.block.find(byType: .graphic).first else { return }
  setFrame(engine: engine, designBlock: baseVideoBlock, rect: baseVideo.rect)

  let reactionTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: reactionTrack)

  let baseFill = try engine.block.getFill(baseVideoBlock)
  try await engine.block.forceLoadAVResource(baseFill)
  let baseDurationSeconds = try engine.block.getAVResourceTotalDuration(baseFill)

  var reactionOffsetSeconds = 0.0
  for recording in reaction {
    let remainingSeconds = baseDurationSeconds - reactionOffsetSeconds
    if remainingSeconds <= 0.0 {
      break
    }

    guard let reactionVideo = recording.videos.first else { continue }
    let reactionBlock = try addReactionRecording(
      engine: engine,
      recording: recording,
      reactionVideo: reactionVideo,
      parent: reactionTrack,
    )

    let recordingDurationSeconds = recording.duration.seconds
    let clipDurationSeconds = min(recordingDurationSeconds, remainingSeconds)
    if clipDurationSeconds < recordingDurationSeconds {
      try engine.block.setDuration(reactionBlock, duration: clipDurationSeconds)
    }
    reactionOffsetSeconds += clipDurationSeconds
  }

  let finalDurationSeconds = min(reactionOffsetSeconds, baseDurationSeconds)
  try engine.block.setTrimOffset(baseFill, offset: 0.0)
  try engine.block.setTrimLength(baseFill, length: finalDurationSeconds)
  try engine.block.setDuration(baseVideoBlock, duration: finalDurationSeconds)
}

@MainActor
@discardableResult
private func addReactionRecording(
  engine: Engine,
  recording: Recording,
  reactionVideo: Recording.Video,
  parent: DesignBlockID,
) throws -> DesignBlockID {
  let reactionBlock = try engine.block.create(.graphic)
  let shape = try engine.block.createShape(.rect)
  try engine.block.setShape(reactionBlock, shape: shape)
  setFrame(engine: engine, designBlock: reactionBlock, rect: reactionVideo.rect)

  let fill = try engine.block.createFill(.video)
  try engine.block.setURL(fill, property: "fill/video/fileURI", value: reactionVideo.url)
  try engine.block.setFill(reactionBlock, fill: fill)

  try engine.block.setDuration(reactionBlock, duration: recording.duration.seconds)
  try engine.block.appendChild(to: parent, child: reactionBlock)
  return reactionBlock
}

@MainActor
private func setFrame(engine: Engine, designBlock: DesignBlockID, rect: CGRect) {
  try? engine.block.setWidth(designBlock, value: Float(rect.width))
  try? engine.block.setHeight(designBlock, value: Float(rect.height))
  try? engine.block.setPositionX(designBlock, value: Float(rect.minX))
  try? engine.block.setPositionY(designBlock, value: Float(rect.minY))
}

```

Record the user while a base video plays, then compose the base video and the
reaction clips into an editable picture-in-picture video scene.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/editor-guides-record-reaction)

Reaction mode is a camera workflow. Before launching it, integrate `IMGLYCamera` into your app as shown in [Integrate Mobile Camera](../import-media/capture-from-camera/integrate.md).

CE.SDK returns the base video and the recorded reaction segments wrapped in `CameraResult.reaction(video:reaction:)`. Pass that result to the editor and use the `IMGLYCamera` extension on `Engine` to compose the picture-in-picture scene in one call.

The example also uses two small helpers the iOS guides repository ships: [`ModalEditor.swift`](https://github.com/imgly/cesdk-swift-examples/blob/v1.82.0-nightly.20260825/editor-guides-quickstart/ModalEditor.swift) — a wrapper around `fullScreenCover` — and [`Secrets.swift`](https://github.com/imgly/cesdk-swift-examples/blob/v1.82.0-nightly.20260825/secrets/Secrets.swift), which supplies `secrets.licenseKey`. Substitute your own presentation and license-key plumbing — neither is part of the CE.SDK shipped to customers.

| Swift type | Purpose |
| --- | --- |
| `CameraMode.reaction` | Opens the camera while playing the video the user reacts to. |
| `CameraResult.reaction` | Returns the base `Recording` and one or more reaction `Recording` segments. |
| `Recording` | Stores segment `duration` (a `CMTime`) and its recorded `Video` entries. |
| `Recording.Video` | Stores the recorded `url` and the preview `rect` used by the camera layout. |
| `engine.createScene(from:)` | `IMGLYCamera` extension on `Engine` that builds a picture-in-picture scene from a `CameraResult`. |

## Camera and Microphone Permissions

Reaction mode uses both the device camera and the microphone. Add `NSCameraUsageDescription` and `NSMicrophoneUsageDescription` to your app's `Info.plist` with user-facing descriptions. iOS terminates the app the first time CE.SDK requests either capability if these keys are missing.

```xml
<key>NSCameraUsageDescription</key>
<string>We use the camera to record your reaction to the video.</string>
<key>NSMicrophoneUsageDescription</key>
<string>We use the microphone to capture audio while you react to the video.</string>
```

The camera surface handles the permission prompts itself and surfaces a Settings shortcut if the user denies access.

## Launch Reaction Mode

Present the `Camera` view in a `fullScreenCover`. The sample starts the camera in `CameraMode.reaction` with a vertical preview layout and the base video URL the user reacts to.

```swift highlight-record-reaction-launch
Camera(
  EngineSettings(license: secrets.licenseKey, userID: "<your unique user id>"),
  config: CameraConfiguration(allowModeSwitching: false),
  mode: .reaction(.vertical, video: Self.baseVideoURL, positionsSwapped: false),
) { cameraResult in
```

Use the first parameter of `CameraMode.reaction` to switch between `.vertical` and `.horizontal` preview layouts. Set `positionsSwapped` to `true` when the reaction camera should take the base video's preview position.

## Handle the Reaction Result

When the user finishes recording, the `onDismiss` closure receives a `Result<CameraResult, CameraError>`. Store the `CameraResult` on success and pass it to the editor; handle `.cancelled` and other failures separately.

```swift highlight-record-reaction-handle-result
        switch cameraResult {
        case let .success(value):
          reactionResult = ReactionResult(result: value)
          isCameraPresented = false

        case let .failure(error) where error == .cancelled:
          isCameraPresented = false

        case let .failure(error):
          print(error.localizedDescription)
          isCameraPresented = false
        }
```

`CameraResult.reaction` is the case Reaction mode returns. It wraps the base `Recording` the user reacted to (its URL is the one the camera received) and a list of recorded reaction segments. A segment list can contain multiple entries when the user pauses and resumes recording.

## Build the Scene

From the editor's `onCreate` callback, call `engine.createScene(from:)` with the stored `CameraResult`. The `IMGLYCamera` extension dispatches on the result case and builds the picture-in-picture scene — base video on the background track, reaction clips on a separate track, durations synchronized to the base video's length.

```swift highlight-record-reaction-default-build
try await engine.createScene(from: reactionResult.result)
```

This is the recommended integration. Skip ahead to [Persist Reaction Files](./record-reaction.md#persist-reaction-files) unless you need to customize the scene layout, durations, or block hierarchy.

## Custom Scene Construction

To tweak the scene the default integration produces — different layouts, block hierarchies, or timing rules — build the scene yourself with `IMGLYEngine` APIs instead of calling `engine.createScene(from:)`.

The three helpers below — `setFrame`, `addReactionRecording`, and `buildReactionSceneManually` — together replace the default `engine.createScene(from:)` call. Copy all three into your project, then call `buildReactionSceneManually(engine:result:)` from `onCreate` in place of `engine.createScene(from:)` and adjust the helpers to your needs.

### Preserve Preview Rects

The camera stores each preview position as a `CGRect`. Pass the engine, target block, and rect to the `setFrame` helper below, which maps the rect to CE.SDK block size and position to preserve the camera preview layout in the editor.

```swift highlight-record-reaction-custom-rect-frame
@MainActor
private func setFrame(engine: Engine, designBlock: DesignBlockID, rect: CGRect) {
  try? engine.block.setWidth(designBlock, value: Float(rect.width))
  try? engine.block.setHeight(designBlock, value: Float(rect.height))
  try? engine.block.setPositionX(designBlock, value: Float(rect.minX))
  try? engine.block.setPositionY(designBlock, value: Float(rect.minY))
}
```

`engine.block.setWidth(_:value:)`, `setHeight(_:value:)`, `setPositionX(_:value:)`, and `setPositionY(_:value:)` accept `Float` values, so cast each `CGFloat` from the rect before passing it in.

### Build the Editable Video Scene

Use the editor `Engine` to create a video scene from the base video URL. The sample reads the first reaction video used for the page bounds, sizes the page to include both preview rectangles, positions the base video block at its recorded rect, and creates a separate track for reaction clips.

```swift highlight-record-reaction-custom-build-scene
@MainActor
private func buildReactionSceneManually(engine: Engine, result: CameraResult) async throws {
  guard
    case let .reaction(video, reaction) = result,
    let baseVideo = video.videos.first,
    let firstReactionVideo = reaction.first?.videos.first
  else {
    return
  }

  try await engine.scene.create(fromVideo: baseVideo.url)

  guard let page = try engine.scene.getCurrentPage() else { return }
  let sceneFrame = baseVideo.rect.union(firstReactionVideo.rect)
  setFrame(engine: engine, designBlock: page, rect: sceneFrame)

  guard let baseVideoBlock = try engine.block.find(byType: .graphic).first else { return }
  setFrame(engine: engine, designBlock: baseVideoBlock, rect: baseVideo.rect)

  let reactionTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: reactionTrack)
```

### Add Reaction Clips

Each reaction segment becomes a `.graphic` block with a rectangle shape and a video fill. The helper receives the engine, `Recording`, reaction `Video`, and parent track explicitly so copied code has all required inputs.

```swift highlight-record-reaction-custom-add-clips
@MainActor
@discardableResult
private func addReactionRecording(
  engine: Engine,
  recording: Recording,
  reactionVideo: Recording.Video,
  parent: DesignBlockID,
) throws -> DesignBlockID {
  let reactionBlock = try engine.block.create(.graphic)
  let shape = try engine.block.createShape(.rect)
  try engine.block.setShape(reactionBlock, shape: shape)
  setFrame(engine: engine, designBlock: reactionBlock, rect: reactionVideo.rect)

  let fill = try engine.block.createFill(.video)
  try engine.block.setURL(fill, property: "fill/video/fileURI", value: reactionVideo.url)
  try engine.block.setFill(reactionBlock, fill: fill)

  try engine.block.setDuration(reactionBlock, duration: recording.duration.seconds)
  try engine.block.appendChild(to: parent, child: reactionBlock)
  return reactionBlock
}
```

Set the video fill source via `engine.block.setURL(_:property:value:)` with the `"fill/video/fileURI"` property key, passing the recorded `URL` directly.

### Keep Timing Synchronized

Force-load the base video fill before reading its duration. The sample trims any reaction segment that would exceed the base video, then applies the final duration to the base fill and base video block.

```swift highlight-record-reaction-custom-sync-duration
  let baseFill = try engine.block.getFill(baseVideoBlock)
  try await engine.block.forceLoadAVResource(baseFill)
  let baseDurationSeconds = try engine.block.getAVResourceTotalDuration(baseFill)

  var reactionOffsetSeconds = 0.0
  for recording in reaction {
    let remainingSeconds = baseDurationSeconds - reactionOffsetSeconds
    if remainingSeconds <= 0.0 {
      break
    }

    guard let reactionVideo = recording.videos.first else { continue }
    let reactionBlock = try addReactionRecording(
      engine: engine,
      recording: recording,
      reactionVideo: reactionVideo,
      parent: reactionTrack,
    )

    let recordingDurationSeconds = recording.duration.seconds
    let clipDurationSeconds = min(recordingDurationSeconds, remainingSeconds)
    if clipDurationSeconds < recordingDurationSeconds {
      try engine.block.setDuration(reactionBlock, duration: clipDurationSeconds)
    }
    reactionOffsetSeconds += clipDurationSeconds
  }

  let finalDurationSeconds = min(reactionOffsetSeconds, baseDurationSeconds)
  try engine.block.setTrimOffset(baseFill, offset: 0.0)
  try engine.block.setTrimLength(baseFill, length: finalDurationSeconds)
  try engine.block.setDuration(baseVideoBlock, duration: finalDurationSeconds)
}
```

This keeps the final composition no longer than the video the user reacted to. Tracks place the reaction segments one after another based on the block durations.

## Persist Reaction Files

The base video URL is the URL your app passed into Reaction mode. Reaction clip URLs are files created by the camera in the app's caches directory, so copy those reaction files to your app's long-term storage if you need them after the current editing workflow.

For lower-level access to durations, URLs, and rects, see the [Access Recordings](../import-media/capture-from-camera/recordings.md) guide.

## Next Steps

- [Integrate Mobile Camera](../import-media/capture-from-camera/integrate.md) - Add CE.SDK camera capture to your iOS app.
- [Mobile Camera Configuration](../import-media/capture-from-camera/camera-configuration.md) - Lock camera modes and configure capture behavior.
- [Access Recordings](../import-media/capture-from-camera/recordings.md) - Inspect recorded durations, URLs, and preview rects.
- [Trim](../edit-video/trim.md) - Control which portion of source media plays
- [Timeline Editor](./timeline-editor.md) - Arrange video clips, audio, and timeline content in the editor.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support