> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Zoom](./zoom.md)

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

The IMGLY Camera supports pinch-to-zoom out of the box. While the camera is open, your users pinch the live preview to zoom in and out, and the captured photo or video reflects the zoom level. Zoom is built into the camera UI, so there is no extra code or configuration to enable it.

> **Reading time:** 3 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260830/camera-guides-quickstart)

## What You’ll Learn

- How the built-in pinch-to-zoom gesture works while capturing.
- How the zoom range is clamped to the device’s hardware limits.
- Why there is no programmatic or initial-zoom API today.

## Permission

The camera runs a live capture session, which requires camera access. Add `NSCameraUsageDescription` to your app’s `Info.plist` with a user-facing description, or the system terminates the app the first time the camera opens:

```xml
<key>NSCameraUsageDescription</key>
<string>Capture a photo or video to edit in the editor.</string>
```

The IMGLY Camera requests camera authorization at runtime and shows a denial alert if access is refused — you only need to provide the usage-description key.

## Pinch to Zoom

Import `IMGLYCamera` and launch the camera as usual — pinch-to-zoom is part of the live preview, so the standard launch is all you need:

```swift highlight-import
import IMGLYCamera
```

```swift highlight-initialization
Camera(.init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
             userID: "<your unique user id>")) { result in
```

`secrets.licenseKey` comes from a small [`Secrets.swift`](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260830/secrets/Secrets.swift) shim the iOS guides repository ships — substitute your own license key. See [Integrate Mobile Camera](./integrate.md) for the full launch and result handling.

Once the camera is open, your users:

- **Pinch** the live preview with two fingers to zoom in and out. The active zoom level applies to whatever they capture next.
- **Double-tap** the live preview to flip between the front and back cameras — the related built-in gesture on the same preview.

The zoom level is clamped to the device’s supported range. This range varies by device and lens — multi-lens devices reach further than single-lens models — and the camera never zooms beyond what the hardware supports.

## No Programmatic Zoom

Zoom is gesture-driven only. There is currently no field on `CameraConfiguration` to set an initial zoom level, change the limits, or disable the gesture, and no API to set the zoom programmatically while the camera is open. The user controls zoom directly through the pinch gesture.

## Troubleshooting

**The zoom feels limited** — the zoom range is the device’s hardware range. Single-lens devices have a narrower range than multi-lens models, so the maximum zoom differs across devices.

**Pinching does nothing** — the gesture works on the live camera preview, which is only available on a physical device. The iOS Simulator has no camera feed.

**I need to set the zoom in code** — there is no public API for this. Pinch-to-zoom is the only zoom path on the IMGLY Camera today.

## Next Steps

- Learn how to [integrate the IMGLY Camera](./integrate.md) into your project.
- [Configure](./camera-configuration.md) the camera’s capture type, UI, and other properties.
- Learn how to [retrieve and manage](./recordings.md) recordings.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support