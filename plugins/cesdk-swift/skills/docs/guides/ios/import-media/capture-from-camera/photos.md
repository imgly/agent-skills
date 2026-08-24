> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Access Photos](./photos.md)

---

In this guide, you'll learn how to access the still photos produced by the IMGLY Camera when it's used as a standalone capture surface. This covers single-camera and dual-camera captures in the `.photo` and `.mixed` capture types.

> **Note:** This guide is for working with the standalone camera's result. To let users pick existing images from their device library inside the editor, see the [From Photo Roll](../from-local-source/photo-roll.md) guide. To handle the videos and reactions returned by the same camera session, see the [Access Recordings](./recordings.md) guide.

## What You'll Learn

- How to receive photos by configuring the camera's `captureType`.
- How to read the `onDismiss` result and extract the captured photos.
- How single-camera and dual-camera sessions populate `Photo.images`.
- How to persist the temporary photo files for later use.

## Camera Permission

Capturing photos requires camera access. iOS terminates the app on first use of the camera unless your `Info.plist` declares a usage description, so add the `NSCameraUsageDescription` key with a short explanation shown in the system permission prompt:

```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to capture photos.</string>
```

The IMGLY Camera presents the system permission request the first time it opens; your app only needs to supply this description string.

## Capture Photos

Photos are delivered only when the camera captures stills, so set the `captureType` to `.photo` (photos only) or `.mixed` (a user-toggleable photo/video mode) on a `CameraConfiguration`. See the [Mobile Camera Configuration](./camera-configuration.md) guide for the full set of options, and the [Integrate Mobile Camera](./integrate.md) guide for presenting the camera in your app.

```swift
let settings = EngineSettings(license: "<your license key>")
let photoConfig = CameraConfiguration(captureType: .photo)

Camera(settings, config: photoConfig) { result in
  // Read the captured photos from `result` here.
}
```

## Read the Result

The `Camera`'s `onDismiss` closure returns a `Result<CameraResult, CameraError>`. A non-reaction session delivers `CameraResult.capture([Capture])`, where each `Capture` is either a `.photo(Photo)` or a `.video(Recording)`. There's a `[Capture].videos` helper for pulling out recordings; photos have no equivalent helper, so filter them with `compactMap`:

```swift
Camera(settings, config: photoConfig) { result in
  switch result {
  case let .success(.capture(captures)):
    let photos = captures.compactMap { capture in
      if case let .photo(photo) = capture { return photo }
      return nil
    }

    for photo in photos {
      for image in photo.images {
        let url = image.url   // JPEG file in the temporary directory
        let rect = image.rect // Position within the camera's 1080×1920 canvas
        print(url, rect)
      }
    }

  case .success(.reaction):
    break // Reaction sessions return videos — see the Access Recordings guide.

  case let .failure(error):
    print(error.localizedDescription)
  }
}
```

Each `Photo` exposes its captured images in `photo.images`. Every `Photo.Image` carries the file `url` of the saved JPEG and a `rect` describing where the image sat within the camera's `1080×1920` canvas.

## Single and Dual Camera Photos

The number of entries in `photo.images` depends on the camera mode:

- **Single camera** captures one image, so `photo.images` has a single element whose `rect` covers the full canvas.
- **Dual camera** captures two stacked images — one per lens — so `photo.images` has two elements, each with its own `rect` marking the section of the layout it came from.

Use each image's `rect` to recreate the dual-camera layout in your own editing flow. For the layout modes that dual capture produces, see the [Dual Camera](./dual-camera.md) guide.

## Persist the Photos

The `url` on each `Photo.Image` points at a file in the app's temporary directory. Treat these URLs as transient: copy or move them to an app-managed location, such as the documents directory, before relying on them later.

```swift
func persistPhoto(at sourceURL: URL, fileName: String) throws -> URL {
  let documentsURL = try FileManager.default.url(
    for: .documentDirectory,
    in: .userDomainMask,
    appropriateFor: nil,
    create: true
  )
  let destinationURL = documentsURL.appendingPathComponent(fileName)

  if FileManager.default.fileExists(atPath: destinationURL.path) {
    try FileManager.default.removeItem(at: destinationURL)
  }

  try FileManager.default.copyItem(at: sourceURL, to: destinationURL)
  // Use `moveItem(at:to:)` instead if you don't need the original temp file.
  return destinationURL
}
```

## Handle Failures

The `.failure` case carries a `CameraError`. Two of its cases apply to a photo session:

- `.cancelled` — the user dismissed the camera without capturing. Handle this silently; don't show an error.
- `.permissionsMissing` — the user denied camera access. Guide them to enable it in Settings.

Switch over the error to handle them; `.failedToLoadVideo` only occurs in reaction sessions:

```swift
switch error {
case .cancelled:
  break // Dismiss the camera UI without an error.
case .permissionsMissing:
  break // Prompt the user to grant camera access.
case .failedToLoadVideo:
  break // Reaction sessions only.
}
```

## Next Steps

Captured photos are JPEG files, so they load directly into the engine's image APIs once you've persisted them. From here you can:

- [Take Photo](./take-photo.md) — Learn how to capture a photo with the Mobile Camera.
- [Import Local Asset](../from-local-source/local-asset.md) — Insert a captured photo into a scene from a local file.
- [From Photo Roll](../from-local-source/photo-roll.md) — Let users pick existing photos from their library inside the editor.
- [Access Recordings](./recordings.md) — Handle the videos and reactions returned by the same camera session.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support