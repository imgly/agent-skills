> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Integrate Mobile Camera](./integrate.md)

---

```swift file=@cesdk_swift_examples/camera-guides-quickstart/CameraSwiftUI.swift reference-only
import IMGLYCamera

import SwiftUI

struct CameraSwiftUI: View {
  @State private var isPresented = false

  var body: some View {
    Button("Use the Camera") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      Camera(.init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                   userID: "<your unique user id>")) { result in
        switch result {
        case let .success(.capture(captures)):
          for capture in captures {
            switch capture {
            case let .photo(photo):
              if let url = photo.images.first?.url {
                print("Captured photo: \(url)")
              }
            case let .video(recording):
              print("Recorded videos: \(recording.videos.map(\.url))")
            }
          }

        case .success(.reaction):
          print("Reaction case not handled here")

        case let .failure(error):
          print(error.localizedDescription)
        }
        isPresented = false
      }
    }
  }
}
```

```swift file=@cesdk_swift_examples/camera-guides-quickstart/CameraUIKit.swift reference-only
import IMGLYCamera

import SwiftUI

class CameraUIKit: UIViewController {
  private var camera: UIViewController {
    UIHostingController(rootView:
      Camera(.init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                   userID: "<your unique user id>")) { result in
        switch result {
        case let .success(.capture(captures)):
          for capture in captures {
            switch capture {
            case let .photo(photo):
              if let url = photo.images.first?.url {
                print("Captured photo: \(url)")
              }
            case let .video(recording):
              print("Recorded videos: \(recording.videos.map(\.url))")
            }
          }

        case .success(.reaction):
          print("Reaction case not handled here")

        case let .failure(error):
          print(error.localizedDescription)
        }
        self.presentedViewController?.dismiss(animated: true)
      })
  }

  private lazy var button = UIButton(
    type: .system,
    primaryAction: UIAction(title: "Use the Camera") { [unowned self] _ in
      let camera = camera
      camera.modalPresentationStyle = .fullScreen
      present(camera, animated: true)
    },
  )

  override func viewDidLoad() {
    super.viewDidLoad()

    view.addSubview(button)
    button.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
      button.centerYAnchor.constraint(equalTo: view.centerYAnchor),
    ])
  }
}
```

Add the IMGLY Mobile Camera to your iOS app to shoot photos and videos, then hand the captured media off to the editor or your own storage. This guide covers the full integration: adding the Swift package, requesting the required permissions, presenting the camera, and handling the result from both SwiftUI and UIKit.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260823/camera-guides-quickstart)

The camera is a self-contained view that captures media and returns it to your app. For the full set of capture options, see [Mobile Camera Configuration](./camera-configuration.md). For task-specific flows, see [Capture a Photo](./take-photo.md) and [Access Recordings](./recordings.md).

## Add the Swift Package

Add the [IMGLYUI Swift Package](https://github.com/imgly/IMGLYUI-swift) to your project with [Swift Package Manager](https://github.com/apple/swift-package-manager), then add a library product to your app target: the default `IMGLYUI` library for every UI module, or only `IMGLYCamera` to keep your app size minimal when that is all you `import`.

For a step-by-step walkthrough of installing CE.SDK, see the get-started guides for [Existing Project with SwiftUI](../../get-started/ios/existing-project/swiftui.md) or [Existing Project with UIKit](../../get-started/ios/existing-project/uikit.md).

## Requirements

The Mobile Camera requires an app target with these settings:

| Requirement | Value |
| --- | --- |
| Minimum deployment target | iOS 16 or later |
| Swift toolchain | Swift $SWIFT\_VERSION$ (Xcode $XCODE\_VERSION$) or later |

## Permission

The camera's default configuration records video with audio, so it needs both camera and microphone access. Add these keys to your app's `Info.plist` with user-facing descriptions, or the system terminates the app the first time the camera opens:

```xml
<key>NSCameraUsageDescription</key>
<string>Capture a photo or video to edit in the editor.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Record audio together with your video.</string>
```

The IMGLY Camera requests camera and microphone authorization at runtime and shows a denial alert if access is refused — you only need to provide the usage-description keys.

## Configure the Camera

The camera runs its own engine instance, configured with `EngineSettings`. Set the **license key** you received from IMG.LY, or pass `nil` to run in evaluation mode with a watermark. Optionally set a **unique user ID** tied to your application's user, which helps accurately calculate monthly active users (MAU) when someone uses the app across multiple devices with a sign-in feature.

<Tabs syncKey="code-language">
  <TabItem label="SwiftUI">
    ```swift highlight-initialization
    Camera(.init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                 userID: "<your unique user id>")) { result in
    ```
  </TabItem>

  <TabItem label="UIKit">
    ```swift highlight-uikit-initialization
    Camera(.init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                 userID: "<your unique user id>")) { result in
    ```
  </TabItem>
</Tabs>

`secrets.licenseKey` comes from a small [`Secrets.swift`](https://github.com/imgly/cesdk-swift-examples/blob/v1.82.0-nightly.20260823/secrets/Secrets.swift) shim the iOS guides repository ships — substitute your own license key.

The camera opens in video mode by default. To capture photos, mix photos and videos, or set duration limits, pass a `CameraConfiguration` to the `Camera` initializer — see [Mobile Camera Configuration](./camera-configuration.md).

## Present the Camera

Present the configured camera from your own UI. In SwiftUI, a `@State` boolean that a [`fullScreenCover`](https://developer.apple.com/documentation/swiftui/view/fullscreencover/(ispresented:ondismiss:content:/)) watches shows the camera when a button flips it; in UIKit, wrap the `Camera` in a `UIHostingController` and present it from a button.

<Tabs syncKey="code-language">
  <TabItem label="SwiftUI">
    ```swift highlight-import
    import IMGLYCamera
    ```

    ```swift highlight-present
      @State private var isPresented = false

      var body: some View {
        Button("Use the Camera") {
          isPresented = true
        }
        .fullScreenCover(isPresented: $isPresented) {
          Camera(.init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                       userID: "<your unique user id>")) { result in
    ```
  </TabItem>

  <TabItem label="UIKit">
    ```swift highlight-uikit-import
    import IMGLYCamera
    ```

    ```swift highlight-uikit-hosting
        UIHostingController(rootView:
          Camera(.init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                       userID: "<your unique user id>")) { result in
            switch result {
            case let .success(.capture(captures)):
              for capture in captures {
                switch capture {
                case let .photo(photo):
                  if let url = photo.images.first?.url {
                    print("Captured photo: \(url)")
                  }
                case let .video(recording):
                  print("Recorded videos: \(recording.videos.map(\.url))")
                }
              }

            case .success(.reaction):
              print("Reaction case not handled here")

            case let .failure(error):
              print(error.localizedDescription)
            }
            self.presentedViewController?.dismiss(animated: true)
          })
    ```

    ```swift highlight-uikit-modal
    private lazy var button = UIButton(
      type: .system,
      primaryAction: UIAction(title: "Use the Camera") { [unowned self] _ in
        let camera = camera
        camera.modalPresentationStyle = .fullScreen
        present(camera, animated: true)
      },
    )
    ```
  </TabItem>
</Tabs>

## Handle the Result

When the camera is dismissed, it calls the `onDismiss` closure with a `Result<CameraResult, CameraError>`. On success, a session returns `.capture([Capture])` — an array that interleaves the photos and videos the user captured, in the order they were taken; a reaction session returns `.reaction`. Iterate the captures and switch on each one: `.photo(Photo)` exposes the still image in `images`, and `.video(Recording)` exposes the recorded tracks in `videos`.

<Tabs syncKey="code-language">
  <TabItem label="SwiftUI">
    ```swift highlight-result
            switch result {
            case let .success(.capture(captures)):
              for capture in captures {
                switch capture {
                case let .photo(photo):
                  if let url = photo.images.first?.url {
                    print("Captured photo: \(url)")
                  }
                case let .video(recording):
                  print("Recorded videos: \(recording.videos.map(\.url))")
                }
              }

            case .success(.reaction):
              print("Reaction case not handled here")

            case let .failure(error):
              print(error.localizedDescription)
            }
            isPresented = false
          }
        }
      }
    ```
  </TabItem>

  <TabItem label="UIKit">
    ```swift highlight-uikit-result
            switch result {
            case let .success(.capture(captures)):
              for capture in captures {
                switch capture {
                case let .photo(photo):
                  if let url = photo.images.first?.url {
                    print("Captured photo: \(url)")
                  }
                case let .video(recording):
                  print("Recorded videos: \(recording.videos.map(\.url))")
                }
              }

            case .success(.reaction):
              print("Reaction case not handled here")

            case let .failure(error):
              print(error.localizedDescription)
            }
            self.presentedViewController?.dismiss(animated: true)
    ```
  </TabItem>
</Tabs>

The camera does not dismiss itself, so the example closes the presentation once the session finishes — clearing `isPresented` in SwiftUI, or dismissing the presented controller in UIKit.

The captured URLs point at temporary files. To keep the media, copy it to an app-managed location — see [Access Recordings](./recordings.md).

The example logs the `.reaction` case without handling it. To launch the camera in reaction mode and handle `CameraResult.reaction`, see [Record Reaction](./record-reaction.md).

## Test on a Device

The iOS Simulator has no camera feed, so the live preview and capture only work on a physical device. Use the Simulator to confirm that the camera screen presents and the permission prompts appear, but test capture, focus, zoom, and orientation on real hardware.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `Camera(_:config:mode:onDismiss:)` | Present the Mobile Camera. `config` defaults to `.init()` (video capture, multiple clips), `mode` defaults to `.standard`, and `onDismiss` receives a `Result<CameraResult, CameraError>`. |
| `EngineSettings(license:userID:)` | Configure the engine with your license key and an optional user ID for MAU accounting. |

### Result Types

| Type | Description |
| --- | --- |
| `CameraResult.capture([Capture])` | The ordered stack of photos and videos from a standard session. |
| `Capture.photo(Photo)` | A still-photo capture; `Photo.images` holds the captured image(s), each with a file `url`. |
| `Capture.video(Recording)` | A video capture; `Recording.videos` holds the recorded track(s), each with a file `url`. |
| `CameraResult.reaction(video:reaction:)` | The host video and the user's recordings produced by a reaction session. |
| `CameraError` | The error delivered in the `.failure` case, for example when permissions are denied. |

## Next Steps

- [Mobile Camera Configuration](./camera-configuration.md) — Configure the capture type, duration limits, and camera appearance.
- [Capture a Photo](./take-photo.md) — Switch the camera to photo mode and receive the captured still.
- [Access Recordings](./recordings.md) — Access and persist the photos and videos a session produces.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support