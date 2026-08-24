> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Take Photo](./take-photo.md)

---

```swift file=@cesdk_swift_examples/camera-guides-take-photo/TakePhotoCameraSolution.swift reference-only
import IMGLYCamera
import SwiftUI

struct TakePhotoCameraSolution: View {
  @State private var isPresented = false
  @State private var capturedPhotoURLs: [URL] = []

  var body: some View {
    Button("Take a Photo") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      Camera(
        .init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
              userID: "<your unique user id>"),
        config: CameraConfiguration(captureType: .photo, captureCount: .single),
      ) { result in
        switch result {
        case let .success(.capture(captures)):
          // Each photo capture carries one or more still images; hand the URLs off to your app.
          capturedPhotoURLs = captures.compactMap { capture in
            if case let .photo(photo) = capture {
              return photo.images.first?.url
            }
            return nil
          }
        case .success(.reaction):
          break
        case let .failure(error):
          print(error.localizedDescription)
        }
        isPresented = false
      }
    }
  }
}
```

Capture a still photo with the IMGLY Mobile Camera. Configure the camera for photo mode, present it, and receive the captured photo so your app can edit, upload, or store it.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260824/camera-guides-take-photo)

This guide uses the IMGLY Mobile Camera in photo mode. For adding the camera to your app and presenting it, see [Integrate Mobile Camera](./integrate.md); for the full set of camera options, see [Mobile Camera Configuration](./camera-configuration.md).

## Permission

The camera requires a usage description. Add `NSCameraUsageDescription` to your app's `Info.plist`, or the system terminates the app the first time the camera opens.

```xml
<key>NSCameraUsageDescription</key>
<string>Capture a photo to edit in the editor.</string>
```

The camera presents its own permission prompt the first time it runs; granting and denying access is handled for you.

## Present the Camera in Photo Mode

Present the camera from a full-screen cover, configured for still photos. Pass a `CameraConfiguration` with `captureType: .photo` to switch the camera into still-photo mode, and `captureCount: .single` to capture one photo per session.

```swift highlight-takePhoto-present
Button("Take a Photo") {
  isPresented = true
}
.fullScreenCover(isPresented: $isPresented) {
  Camera(
    .init(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
          userID: "<your unique user id>"),
    config: CameraConfiguration(captureType: .photo, captureCount: .single),
  ) { result in
```

For a multi-shot session, use `captureCount: .multi` — the camera keeps capturing until the user finishes. Two more photo options are available: `showsPhotoPreview` (set to `false` to skip the per-shot confirmation preview) and `photoClipDuration` (the duration stamped on each captured photo).

## Handle the Result

When the user finishes, the camera calls the dismiss closure with a `Result`. On success, a photo session returns `.capture([Capture])`, where each `Capture.photo(Photo)` wraps the captured still. A `Photo` exposes its file in `images`, so reading `photo.images.first?.url` gives you the captured photo's URL to hand off to your app.

```swift highlight-takePhoto-result
switch result {
case let .success(.capture(captures)):
  // Each photo capture carries one or more still images; hand the URLs off to your app.
  capturedPhotoURLs = captures.compactMap { capture in
    if case let .photo(photo) = capture {
      return photo.images.first?.url
    }
    return nil
  }
case .success(.reaction):
  break
case let .failure(error):
  print(error.localizedDescription)
}
isPresented = false
```

The returned URL points at a temporary file. To keep the photo, copy it to an app-managed location — see [Access Recordings](./recordings.md) for accessing and persisting captured media.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `Camera(_:config:mode:onDismiss:)` | Present the Mobile Camera with the given engine settings and configuration (`mode` defaults to `.standard`) |
| `CameraConfiguration(captureType:captureCount:)` | Configure the capture type (`.photo` / `.video`) and count (`.single` / `.multi`) |

### Result Types

| Type | Description |
| --- | --- |
| `CameraResult.capture([Capture])` | The stills and videos produced by a capture session |
| `Capture.photo(Photo)` | A still-photo capture; `Photo.images` holds the captured image(s), each with a file `url` |

## Next Steps

- [Access Recordings](./recordings.md) — Access and persist the photos and videos a session produces.
- [Integrate Mobile Camera](./integrate.md) — Add the Mobile Camera to your app and present it.
- [Mobile Camera Configuration](./camera-configuration.md) — Configure capture modes, duration limits, and appearance.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support