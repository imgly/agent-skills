> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Local Source](../from-local-source.md) > [From Photo Roll](./photo-roll.md)

---

```swift file=@cesdk_swift_examples/editor-guides-import-media-photo-roll/PhotoRollSolution.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

/// Demonstrates how to let users add media from their device's photo library
/// in CE.SDK iOS.
///
/// Photo Roll ships as a built-in asset source with two access modes:
/// - `photosPicker` (default): opens the system photos picker, no permissions.
/// - `fullLibraryAccess`: browses the library in an in-app sheet, requires
///   photo library permission.
struct PhotoRollSolution: View {
  var settings: EngineSettings {
    EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                   userID: "<your unique user id>")
  }

  /// Default photos-picker configuration. Presented in the showcase and shown
  /// as the primary lesson in the guide.
  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.onCreate { engine, _ in
            // GuideEditorConfiguration ships no scene, so build the page the
            // editor renders on. The default OnCreate would do this, but the
            // source registration below needs to run in the same callback.
            let scene = try engine.scene.create()
            let page = try engine.block.create(.page)
            try engine.block.appendChild(to: scene, child: page)
            try engine.block.setWidth(page, value: 1080)
            try engine.block.setHeight(page, value: 1080)

            try engine.asset.addSource(PhotoRollAssetSource(engine: engine))
          }
          builder.dock { dock in
            dock.items { _ in
              Dock.Buttons.photoRoll()
            }
          }
          builder.onUpload { _, sourceID, asset, existing in
            guard sourceID == PhotoRollAssetSource.id else { return try await existing(asset) }
            // AssetDefinition is immutable, so build a new one to tag the import.
            let tagged = AssetDefinition(
              id: asset.id,
              groups: asset.groups,
              meta: asset.meta,
              payload: asset.payload,
              label: asset.label,
              tags: ["en": ["photo-roll"]],
            )
            return try await existing(tagged)
          }
        }
      }
  }

  /// Full library access configuration. Registering the source with
  /// `.fullLibraryAccess` makes the same dock button open the in-app library.
  var fullLibraryEditor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.onCreate { engine, _ in
            let scene = try engine.scene.create()
            let page = try engine.block.create(.page)
            try engine.block.appendChild(to: scene, child: page)
            try engine.block.setWidth(page, value: 1080)
            try engine.block.setHeight(page, value: 1080)

            try engine.asset.addSource(PhotoRollAssetSource(engine: engine, mode: .fullLibraryAccess))
          }
          builder.dock { dock in
            dock.items { _ in
              Dock.Buttons.photoRoll()
            }
          }
        }
      }
  }

  @State private var isPresented = false

  var body: some View {
    Button("Use the Editor") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      ModalEditor {
        editor
      }
    }
  }
}

#Preview {
  PhotoRollSolution()
}
```

Let users pull photos and videos from their device's library into a design. CE.SDK iOS ships Photo Roll as a built-in asset source with two access modes: a privacy-friendly system picker (the default) or full in-app library browsing.

![Photo Roll button in the CE.SDK iOS editor dock](https://img.ly/docs/cesdk/ios/import-media/from-local-source/photo-roll-23820d/assets/ios.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/editor-guides-import-media-photo-roll)

Photo Roll connects the device's photo library to CE.SDK's asset system through the `PhotoRollAssetSource` and the `Dock.Buttons.photoRoll()` dock button. The button's behavior is determined by the mode you register the source with, so switching between the two experiences is a one-line change. The [Configuration](../../configuration.md) guide covers how `EditorConfiguration` and `EngineSettings` set up the editor as a whole.

| Mode | Experience | Permission |
| --- | --- | --- |
| **Photos Picker** (default) | System photos picker | None |
| **Full Library Access** | In-app library sheet | Photo library access |

## Photos Picker Mode (Default)

Register `PhotoRollAssetSource` without a mode argument to use the system photos picker. Tapping the dock button opens the picker out of process, so the user grants access per selection and no permission prompt appears.

```swift highlight-photoRoll-picker
try engine.asset.addSource(PhotoRollAssetSource(engine: engine))
```

Add the button to the dock. `dock.items` **sets** the dock's contents — it replaces the existing items rather than appending — so list every button your app needs. To add the photo roll button to an already-populated dock instead, use `dock.modify` to append it.

```swift highlight-photoRoll-dock
builder.dock { dock in
  dock.items { _ in
    Dock.Buttons.photoRoll()
  }
}
```

The button's default action adds media from the photo roll. Because the registered source is in photos picker mode, that action opens the system picker rather than an in-app sheet.

## Full Library Access Mode

Register the source with `.fullLibraryAccess` when users should browse their whole library inside the editor. The same dock button now loads the library into an in-app sheet and requests photo library permission on first use.

```swift highlight-photoRoll-fullLibrary
try engine.asset.addSource(PhotoRollAssetSource(engine: engine, mode: .fullLibraryAccess))
```

The dock button stays identical — only the source's mode changes. No custom asset library configuration is needed: the editor's default library already provides the photo roll tab that the button opens.

## Configure Photo Library Permissions

Full library access reads the device's photo library directly, so iOS requires a usage description. Add `NSPhotoLibraryUsageDescription` to your app's `Info.plist`, or iOS terminates the app the first time the library is accessed:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Grant access to your photo library to add photos and videos to your designs.</string>
```

The system presents this string in the permission prompt. Photos picker mode does not need this key — the system picker runs out of process and shows no prompt.

## Intercepting Imports with onUpload

Both modes insert the chosen photo into your design, but they bring it in through different paths — which decides whether you can hook in:

- **Photos picker mode** first **uploads** each selected photo into the photo roll source, then applies it to the scene. Because that upload step exists, the editor's `onUpload` callback fires for every selection — with `sourceID` equal to `PhotoRollAssetSource.id`.
- **Full library access mode** reads photos straight from the system photo library and applies the tapped photo to the scene directly. The asset already lives in the library, so there is no upload step and `onUpload` does **not** fire.

`onUpload` is therefore your interception point for picker imports. Use it to tag, validate, or persist a photo before it enters the asset source. Guard on the source id so your logic only runs for photo roll imports, and call `existing` to forward the (possibly modified) asset through any other configured handlers. `AssetDefinition` is immutable, so build a new one to change it:

```swift highlight-photoRoll-onUpload
builder.onUpload { _, sourceID, asset, existing in
  guard sourceID == PhotoRollAssetSource.id else { return try await existing(asset) }
  // AssetDefinition is immutable, so build a new one to tag the import.
  let tagged = AssetDefinition(
    id: asset.id,
    groups: asset.groups,
    meta: asset.meta,
    payload: asset.payload,
    label: asset.label,
    tags: ["en": ["photo-roll"]],
  )
  return try await existing(tagged)
}
```

Photo roll imports live in a temporary location by default. If you need them to survive relaunches, copy the file to your app's storage inside this callback (or upload it to your backend), point the asset's `uri` metadata at the new location, and re-register the saved definitions when the app launches.

## Next Steps

- [From User Upload](./user-upload.md) — Let users add files from the camera or Files app.
- [Capture from Camera](../capture-from-camera.md) — Record photos and video with the standalone camera.
- [From a Remote Source](../from-remote-source.md) — Bring in assets from a service or your backend.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support