# Flutter to Native Mapping

The Flutter packages wrap the native CE.SDK editor and camera for iOS
and Android. The wrapper opens a native screen and returns its result. It does
not expose the editor configuration. Use this document to decide where a
request is implemented before you answer or write code.

## What the wrapper exposes

| Dart or TypeScript surface | What it does |
|---|---|
| `IMGLYEditor.openEditor({source, preset, settings, metadata})` | Presents the native editor and resolves with `EditorResult` or `null` when the user cancels. |
| `EditorPreset` | Selects the prebuilt native editor: design, photo, postcard, apparel, video. |
| `Source.fromImage`, `Source.fromVideo`, `Source.fromScene` | The file the editor opens. A scene is `.imgly` or the legacy `.scene`. |
| `EditorSettings` | License, `baseUri` for assets, `userId`. Nothing else about the editor is set from Dart. |
| `EditorResult` | `scene`, `artifact`, `thumbnail`, and the `metadata` map the native export callback filled. |
| `IMGLYCamera.openCamera(settings, {video, metadata})` | Presents the native camera and resolves with `CameraResult` or `null`. |
| `CameraSettings`, `CameraConfiguration` | License, `userId`, capture type, capture count, photo clip duration. |

## What stays native

None of these have a Flutter API. They are set in Swift and Kotlin
inside the closures below, with the same native APIs a native app uses:

- Editor configuration: which features are on, dock and inspector bar items,
  navigation bar, canvas menu, and theming
- Asset sources and asset libraries, including custom sources and uploads
- Editor callbacks: `onCreate`, `onExport`, `onUpload`, `onClose`, and
  error handling
- Engine access: scene and block APIs, variables, templates, and the
  `setUriResolver` and `onUpload` hooks that make `content://` and custom
  URIs resolvable
- Camera configuration beyond capture type, count, and photo clip duration

Answer a question about any of these from the bundled native references:
`../swift/README.md` and `../swift/api/` for iOS, `../android/README.md`
and `../android/api/` for Android. Write the code in Swift and Kotlin, not in
Flutter.

## How the wrapper reaches native code

You set these closures in Swift and Kotlin. The wrapper reads them on every
`openEditor` and `openCamera` call.

- **Editor:** one builder closure per platform. The wrapper calls it with the
  `preset` and the `metadata` map from the Flutter call and shows the
  editor it returns. When it is not set, the wrapper shows the prebuilt editor
  for the preset, or the design editor when there is no preset.
- **Camera on iOS:** one builder closure. It receives only the `metadata`
  map, because the camera has no preset, and returns the camera to show.
- **Camera on Android:** two closures and no builder. `configurationClosure`
  returns the `CaptureMedia.Input` for the session, and `resultClosure`
  adjusts the result before it reaches Flutter.

On both platforms the closures are static properties of the plugin classes:
`IMGLYEditorPlugin` in `imgly_editor` and `IMGLYCameraPlugin` in
`imgly_camera`.

### iOS

```swift
// ios/Runner/AppDelegate.swift
import imgly_editor

IMGLYEditorPlugin.builderClosure = { preset, metadata in
  if metadata?["use_custom_editor"] as? Bool == true {
    return EditorBuilder.custom { settings, _, _, result in
      // Any SwiftUI view. Build it with IMGLYEditor and IMGLYEngine
      // (see ../swift/), and call result(.success(EditorResult)) on export.
      CustomEditor(settings: settings, result: result)
    }
  }
  return EditorBuilder.design() // or .photo(), .video(), .apparel(), .postcard()
}
```

```swift
// ios/Runner/AppDelegate.swift
import imgly_camera

IMGLYCameraPlugin.builderClosure = { metadata in
  CameraBuilder.custom { settings, url, metadata, result in
    CustomCamera(settings: settings, url: url, metadata: metadata, result: result)
  }
}
```

### Android

```kotlin
// android/app/src/main/kotlin/.../MainActivity.kt
import ly.img.editor.flutter.plugin.IMGLYEditorPlugin
import ly.img.editor.flutter.plugin.builder.EditorBuilder

IMGLYEditorPlugin.builderClosure = { preset, metadata ->
    if (metadata?.get("use_custom_editor") == true) {
        EditorBuilder.custom { settings, _, _, result, onClose ->
            @Composable {
                // Any composable. Build it with ly.img.editor and ly.img.engine
                // (see ../android/), and call result(Result.success(EditorResult(...)))
                // on export.
                CustomEditor(settings, result, onClose)
            }
        }
    } else {
        EditorBuilder.design() // or .photo(), .video(), .apparel(), .postcard()
    }
}
```

```kotlin
// android/app/src/main/kotlin/.../MainActivity.kt
import ly.img.camera.flutter.plugin.IMGLYCameraPlugin

// Return a CaptureMedia.Input to replace the camera configuration, or null
// to keep the defaults. The payload holds cameraSettings, engineConfiguration,
// metadata, and videoUri.
IMGLYCameraPlugin.configurationClosure = { null }
// Add metadata to the CameraResult before it reaches Dart.
IMGLYCameraPlugin.resultClosure = { mapOf("handled_by" to "native") }
```

Set the closures before the first `openEditor` or `openCamera` call. On
iOS, set them in `AppDelegate.application(_:didFinishLaunchingWithOptions:)`.
On Android, set them in `MainActivity.onStart()` and set them back to
`null` in `onDestroy()`, as the Flutter showcases app does.

The prebuilt builders (`EditorBuilder.design()`,
`EditorBuilder.photo()`, `EditorBuilder.video()`, `EditorBuilder.apparel()`,
`EditorBuilder.postcard()`) are the same editors the wrapper shows by default,
so a closure can return one of them for some presets and a custom view for
others.

## Customize a prebuilt editor

To change one part of a prebuilt editor, such as the dock, and keep the rest:

1. Open the prebuilt builders in the bundled wrapper source:
   `native-bridge/imgly_editor/ios/Model/EditorBuilder.swift` for iOS and
   `native-bridge/imgly_editor/android/builder/EditorBuilder.kt` for Android. Each preset has one
   (`design()`, `photo()`, `video()`, `apparel()`, `postcard()`).
2. Copy the builder of the preset into your app, inside
   `EditorBuilder.custom`. Keep its `onCreate`, which loads the source
   from the Flutter call, and its `onExport`, which sends the
   `EditorResult` back to Flutter. On iOS, also keep
   `ModalEditorConfiguration(result:)`, which closes the editor and reports
   errors. On Android, the public `EditorBuilderDefaults.onCreateScene` and
   `EditorBuilderDefaults.getExportResult` do the same work.
3. On iOS, `engineSettings(for:)` is private, so build
   `EngineSettings(license:userID:baseURL:)` from the settings in your copy.
4. Change only the part you need, with the native editor API from
   `../swift/` and `../android/`: for the dock, the Swift dock builder and
   the Kotlin `Dock` component.
5. Compare your copy with the bundled source when you upgrade the package,
   because it copies that version's prebuilt editor.

The complete Swift and Kotlin sources of both packages are under
`native-bridge/<package>/ios/` and `native-bridge/<package>/android/`,
including the native `EditorSettings`, `EditorResult`, and the camera
sources. Read them instead of the installed package, which can sit outside
the project.

## The metadata passthrough

`metadata` is an opaque map. The wrapper does not read it. It arrives verbatim
in the native closure, so the Flutter code can tell the native side
which editor or configuration to use, and the native `onExport` callback can
return values in `EditorResult.metadata`. Use it for per-call choices; keep
the configuration itself native.

## When to drop to native

1. The request is one of the "What stays native" items: implement it in Swift
   and Kotlin. Both platforms need the change unless the user targets one.
2. The request only needs `openEditor` or `openCamera` with a preset, a
   source, or settings: stay in Flutter.
3. A scene exported on Android can reference `content://` URIs that do not
   resolve outside the app that created them. Reloading such scenes needs the
   native `EngineConfiguration.onUpload` and `engine.editor.setUriResolver`
   hooks.

The bundled Flutter guides that show the native customization end to
end:

- `guides/flutter/user-interface/customization.md`
- `guides/flutter/import-media/capture-from-camera/camera-configuration.md`

Reference folder: `skills/docs/references/flutter/`.
