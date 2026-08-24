> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Camera Configuration](./camera-configuration.md)

---

```swift file=@cesdk_swift_examples/camera-guides-configuration/ConfiguredCameraSolution.swift reference-only
import IMGLYCamera
import SwiftUI

struct ConfiguredCameraSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey,
    userID: "<your unique user id>",
  )

  @State private var isRecordingVideo = false
  @State private var isTakingPhotos = false

  var body: some View {
    VStack(spacing: 16) {
      Button("Record Video") {
        isRecordingVideo = true
      }
      .fullScreenCover(isPresented: $isRecordingVideo) {
        let config = CameraConfiguration(
          recordingColor: .green,
          highlightColor: .purple,
          maxTotalDuration: 10,
          allowExceedingMaxDuration: false,
          allowModeSwitching: false,
        )

        Camera(
          settings,
          config: config,
          mode: .standard,
        ) { result in
          handle(result) { isRecordingVideo = false }
        }
      }

      Button("Take Photos") {
        isTakingPhotos = true
      }
      .fullScreenCover(isPresented: $isTakingPhotos) {
        let photoConfig = CameraConfiguration(
          captureType: .photo,
          captureCount: .single,
          photoClipDuration: 5,
          showsPhotoPreview: true,
        )

        Camera(settings, config: photoConfig) { result in
          handle(result) { isTakingPhotos = false }
        }
      }
    }
  }

  private func handle(
    _ result: Result<CameraResult, CameraError>,
    onDismiss: () -> Void,
  ) {
    switch result {
    case let .success(.capture(captures)):
      print(captures)
    case let .success(.reaction(video, reaction)):
      print(video, reaction)
    case let .failure(error):
      print(error.localizedDescription)
    }
    // The camera doesn't dismiss itself, so close the cover for every outcome.
    onDismiss()
  }
}
```

Apply a `CameraConfiguration` to the IMG.LY Camera to choose what it captures, tune its accent colors and recording limits, pick a camera mode, and localize the strings it shows to the user.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0/camera-guides-configuration)

This guide builds on the [Integrate Camera](./integrate.md) guide and customizes the `Camera` from `IMGLYCamera`. You configure the camera through three inputs you pass when you create it: `EngineSettings` initializes the underlying engine, an optional `CameraConfiguration` controls what the camera captures and how it looks, and the `mode` argument selects the capture mode.

## Engine Settings

`EngineSettings` initializes the underlying engine and is required to create a `Camera`.

```swift highlight-cameraConfiguration-engineSettings
let settings = EngineSettings(
  license: secrets.licenseKey,
  userID: "<your unique user id>",
)
```

- `license` – the license key you received from IMG.LY. Pass `nil` to evaluate the camera in watermark mode.

```swift highlight-cameraConfiguration-license
license: secrets.licenseKey,
```

- `userID` – an optional unique ID tied to your application's user. This helps us accurately calculate monthly active users (MAU), which is especially useful when one person uses the app on multiple devices with a sign-in feature, ensuring they're counted once. The default value is `nil`.

```swift highlight-cameraConfiguration-userID
userID: "<your unique user id>",
```

## Camera Configuration

Pass an optional `CameraConfiguration` to the `Camera` to customize its appearance and recording behavior. Every property has a default value, so you only set the ones you want to change.

```swift highlight-cameraConfiguration-config
let config = CameraConfiguration(
  recordingColor: .green,
  highlightColor: .purple,
  maxTotalDuration: 10,
  allowExceedingMaxDuration: false,
  allowModeSwitching: false,
)
```

- `recordingColor` – the color of the record button while recording, and of the other recording indicators. Defaults to `.pink`.

```swift highlight-cameraConfiguration-recordingColor
recordingColor: .green,
```

- `highlightColor` – the color used to highlight the camera buttons on tap. Defaults to `.pink`.

```swift highlight-cameraConfiguration-highlightColor
highlightColor: .purple,
```

- `maxTotalDuration` – the target duration of the recording in seconds. Defaults to no limit.

```swift highlight-cameraConfiguration-maxTotalDuration
maxTotalDuration: 10,
```

- `allowExceedingMaxDuration` – set to `true` to keep recording past `maxTotalDuration`. The segment visualization still uses the target duration, but the limit is not enforced. Defaults to `false`.

```swift highlight-cameraConfiguration-allowExceedingMaxDuration
allowExceedingMaxDuration: false,
```

- `allowModeSwitching` – set to `false` to lock the camera into the mode it launches in. Defaults to `true`.

```swift highlight-cameraConfiguration-allowModeSwitching
allowModeSwitching: false,
```

By default, the mode switcher is visible and there is no limit on the recording length.

### Capture Type and Count

These properties control what the camera captures, how many captures a session produces, and how photo captures are handled:

- `captureType` – `.video` (default) records videos, `.photo` takes still photos, and `.mixed` shows an in-camera toggle so the user can switch between photo and video during the session.
- `captureCount` – `.multi` (default) lets the user stack several captures into one session; `.single` returns after a single capture.
- `photoClipDuration` – the duration in seconds stamped on each captured photo when it is later treated as a clip. Defaults to `5`.
- `showsPhotoPreview` – when `false`, photo captures are committed immediately instead of showing a full-screen confirm/discard preview. Defaults to `true`.

```swift highlight-cameraConfiguration-captureType
let photoConfig = CameraConfiguration(
  captureType: .photo,
  captureCount: .single,
  photoClipDuration: 5,
  showsPhotoPreview: true,
)
```

## Camera Mode

The mode is not part of `CameraConfiguration` — it is a separate argument passed when you create the `Camera`. Each mode has its own guide that explores it in more detail.

```swift highlight-cameraConfiguration-mode
mode: .standard,
```

### Available Modes

- `.standard` – the regular camera. This is the default.
- `.dualCamera(_:)` – records with the front and back camera at the same time into the given `CameraLayoutMode`. See the [Dual Camera](./dual-camera.md) guide.
- `.reaction(_:video:positionsSwapped:)` – records with the camera while playing back a video. See the [Record Reaction](./record-reaction.md) guide.

Use `Camera.isModeSupported(_:)` to check whether a mode is available before launching — devices that don't support `.dualCamera` fall back to `.standard`.

## Launching the Camera

Present the `Camera` as a full-screen cover and read its result in the `onDismiss` closure. The closure receives a `Result<CameraResult, CameraError>`:

- `.success(.capture(captures))` is emitted for any non-reaction session. Each `Capture` is a `.photo(Photo)` or a `.video(Recording)`. The example keeps the whole array because the same handler serves both the video and photo sessions; when you only need videos, the `captures.videos` extension returns just the `Recording`s.
- `.success(.reaction(video, reaction))` is emitted in reaction mode, pairing the host video with the user's recordings.
- `.failure(error)` is emitted when the user dismisses the camera without capturing, for example `CameraError.cancelled`.

```swift highlight-cameraConfiguration-result
private func handle(
  _ result: Result<CameraResult, CameraError>,
  onDismiss: () -> Void,
) {
  switch result {
  case let .success(.capture(captures)):
    print(captures)
  case let .success(.reaction(video, reaction)):
    print(video, reaction)
  case let .failure(error):
    print(error.localizedDescription)
  }
  // The camera doesn't dismiss itself, so close the cover for every outcome.
  onDismiss()
}
```

## Required iOS Permissions

The camera captures from the device camera and microphone, so iOS requires usage-description keys in your app's `Info.plist`. Without them, the system terminates the app the first time the camera or microphone is accessed.

```xml
<key>NSCameraUsageDescription</key>
<string>Allow access to the camera to capture photos and videos.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Allow access to the microphone to record audio with your videos.</string>
```

The camera presents the system permission prompts the first time it needs each capability; you only need to provide the descriptions.

## Localization

The IMG.LY camera ships with English and German on iOS, and exposes its strings through Apple's String Catalogs so you can override existing values or add new languages. When the camera renders a label, it resolves each key against three catalogs in order and the first match wins: (1) `Localizable.xcstrings` in your app's main bundle, (2) `IMGLYCamera.xcstrings` in your app's main bundle, if you ship one, then (3) the `IMGLYCamera.xcstrings` bundled inside the SDK.

All camera keys live in [https://github.com/imgly/IMGLYUI-swift/blob/1.81.0/Sources/IMGLYCamera/IMGLYCamera.xcstrings](https://github.com/imgly/IMGLYUI-swift/blob/1.81.0/Sources/IMGLYCamera/IMGLYCamera.xcstrings) and follow a strict naming convention that makes locating them self-explanatory. For example, `ly_img_camera_timer_option_off` is the timer-off button, and `ly_img_camera_dialog_delete_last_recording_title` is the title of the alert shown when deleting the last recording.

### Replacing Existing Keys

To change any existing string, add its key to your app's `Localizable.xcstrings` and set your value. Because `Localizable.xcstrings` takes precedence over `IMGLYCamera.xcstrings`, your value wins.

### Supporting New Languages

To support a language the camera doesn't ship with, add that language to your `Localizable.xcstrings` (or to a copy of `IMGLYCamera.xcstrings` in your app) and provide the translated values.

## Next Steps

- [Integrate Camera](./integrate.md) — Add the camera to your app and present it.
- [Dual Camera](./dual-camera.md) — Record with the front and back camera at the same time.
- [Record Reaction](./record-reaction.md) — Record a reaction while playing back a video.
- [Recordings](./recordings.md) — Send the captured media into the video editor.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support