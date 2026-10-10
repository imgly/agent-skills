# React Native to Native Mapping

The React Native packages wrap the native CE.SDK editor and camera for iOS
and Android. The wrapper opens a native screen and returns its result. It does
not expose the editor configuration. Use this document to decide where a
request is implemented before you answer or write code.

## What the wrapper exposes

| Dart or TypeScript surface | What it does |
|---|---|
| `IMGLYEditor.openEditor(settings, source?, preset?, metadata?)` | Presents the native editor and resolves with `EditorResult` or `null` when the user cancels. |
| `EditorPreset` | Selects the prebuilt native editor: `DESIGN`, `PHOTO`, `POSTCARD`, `APPAREL`, `VIDEO`. |
| `Source` with `SourceType` | The file the editor opens: image, video, or scene (`.imgly` or the legacy `.scene`). A `require()` asset is resolved for you. |
| `EditorSettings`, `EditorSettingsModel` | License, `baseUri` for assets, `userId`. Nothing else about the editor is set from TypeScript. |
| `EditorResult` | `scene`, `artifact`, `thumbnail`, and the `metadata` map the native export callback filled. |
| `IMGLYCamera.openCamera(settings, video?, metadata?)` | Presents the native camera and resolves with `CameraCaptureResult`, `CameraReactionResult`, or `null`. |
| `CameraSettings`, `CameraConfiguration` | License, `userId`, capture type, capture count, photo clip duration. |

## What stays native

None of these have a React Native API. They are set in Swift and Kotlin
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
React Native.

## How the wrapper reaches native code

You set these closures in Swift and Kotlin. The wrapper reads them on every
`openEditor` and `openCamera` call.

- **Editor:** one builder closure per platform. The wrapper calls it with the
  `preset` and the `metadata` map from the React Native call and shows the
  editor it returns. When it is not set, the wrapper shows the prebuilt editor
  for the preset, or the design editor when there is no preset.
- **Camera on iOS:** one builder closure. It receives only the `metadata`
  map, because the camera has no preset, and returns the camera to show.
- **Camera on Android:** two closures and no builder. `configurationClosure`
  returns the `CaptureMedia.Input` for the session, and `resultClosure`
  adjusts the result before it reaches React Native.

On iOS the closures are properties of the shared adapters,
`IMGLYEditorModuleSwiftAdapter.shared` in the `IMGLYEditorModule` Swift
module and `IMGLYCameraModuleSwiftAdapter.shared` in `IMGLYCameraModule`.
On Android they are static properties of `IMGLYEditorModule` and
`IMGLYCameraModule`.

### iOS

```swift
// ios/<App>/Customizations.swift (called from AppDelegate at launch)
import IMGLYEditor
import IMGLYEditorModule

IMGLYEditorModuleSwiftAdapter.shared.builderClosure = { preset, metadata in
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
// ios/<App>/Customizations.swift (called from AppDelegate at launch)
import IMGLYCameraModule

IMGLYCameraModuleSwiftAdapter.shared.cameraBuilderClosure = { metadata in
  CameraBuilder.custom { settings, url, metadata, result in
    CustomCamera(settings: settings, url: url, metadata: metadata, result: result)
  }
}
```

### Android

```kotlin
// android/app/src/main/java/.../MainActivity.kt
import ly.img.editor.reactnative.module.IMGLYEditorModule
import ly.img.editor.reactnative.module.builder.EditorBuilder

IMGLYEditorModule.builderClosure = { preset, metadata ->
    if (metadata?.get("use_custom_editor") == true) {
        EditorBuilder.custom {
            // CustomBuilderScope exposes settings, preset, metadata, result, and
            // onClose. Any composable; build it with ly.img.editor and
            // ly.img.engine (see ../android/), and call
            // result(Result.success(EditorResult(...))) on export.
            CustomEditor(settings, result, onClose)
        }
    } else {
        EditorBuilder.design() // or .photo(), .video(), .apparel(), .postcard()
    }
}
```

```kotlin
// android/app/src/main/java/.../MainActivity.kt
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.EngineConfiguration
import ly.img.camera.reactnative.module.IMGLYCameraModule
import ly.img.camera.reactnative.module.model.CameraResult

// Return the CaptureMedia.Input for the session. Once this closure is set, the
// module ignores the license and configuration from JavaScript, so the closure
// passes the license itself. Inject it from secure config; never commit it.
// Keep host = "react-native": EngineConfiguration defaults it to "", and a
// license scoped to React Native does not validate without it.
IMGLYCameraModule.configurationClosure = { metadata ->
    CaptureMedia.Input(EngineConfiguration("YOUR_LICENSE", host = "react-native"))
}
// Change the CameraResult before it reaches JavaScript.
IMGLYCameraModule.resultClosure = { result ->
    CameraResult(result?.capture, mapOf("handled_by" to "native"))
}
```

Set the closures before the first `openEditor` or `openCamera` call.

- **iOS:** the closure types are Swift-only. The React Native template's
  `AppDelegate` is often Objective-C (`AppDelegate.mm`), and Objective-C
  cannot set them. Put the calls in a Swift file of the app target, inside an
  `@objc` class with a static method marked `@MainActor`, and call that
  method from `application:didFinishLaunchingWithOptions:`. The showcases
  app does this with `[Customizations apply]`. With a Swift `AppDelegate`,
  set them there directly.
- **Android:** set them in `MainActivity.onStart()` and set the editor
  closure back to `null` in `onDestroy()`, as the showcases app does.
- **Expo:** neither module ships an Expo config plugin. Run
  `npx expo prebuild` and edit the generated `ios/` and `android/`
  projects, or write your own config plugin that adds the code, because a
  later prebuild with `--clean` overwrites manual edits.

The prebuilt builders (`EditorBuilder.design()`,
`EditorBuilder.photo()`, `EditorBuilder.video()`, `EditorBuilder.apparel()`,
`EditorBuilder.postcard()`) are the same editors the wrapper shows by default,
so a closure can return one of them for some presets and a custom view for
others.

## Customize a prebuilt editor

To change one part of a prebuilt editor, such as the dock, and keep the rest:

1. Open the prebuilt builders in the bundled wrapper source:
   `native-bridge/editor-react-native/ios/Model/EditorBuilder.swift` for iOS and
   `native-bridge/editor-react-native/android/builder/EditorBuilder.kt` for Android. Each preset has one
   (`design()`, `photo()`, `video()`, `apparel()`, `postcard()`).
2. Copy the builder of the preset into your app, inside
   `EditorBuilder.custom`. Keep its `onCreate`, which loads the source
   from the React Native call, and its `onExport`, which sends the
   `EditorResult` back to React Native. On iOS, also keep
   `ModalEditorConfiguration(result:)`, which closes the editor and reports
   errors. On Android, the public `EditorBuilderDefaults.onCreateScene` and
   `EditorBuilderDefaults.getExportResult` do the same work.
3. On iOS, the private `engineSettings(for:)` also passes `host: "react-native"`,
   and on Android each prebuilt editor passes `host = "react-native"` to
   `Editor`. Keep the host in your copy, otherwise a license scoped to React
   Native does not validate.
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
in the native closure, so the React Native code can tell the native side
which editor or configuration to use, and the native `onExport` callback can
return values in `EditorResult.metadata`. Use it for per-call choices; keep
the configuration itself native.

## When to drop to native

1. The request is one of the "What stays native" items: implement it in Swift
   and Kotlin. Both platforms need the change unless the user targets one.
2. The request only needs `openEditor` or `openCamera` with a preset, a
   source, or settings: stay in React Native.
3. A scene exported on Android can reference `content://` URIs that do not
   resolve outside the app that created them. Reloading such scenes needs the
   native `EngineConfiguration.onUpload` and `engine.editor.setUriResolver`
   hooks.

The React Native guides on the docs site that show the native customization
end to end (fetch them with WebFetch, or `curl -sL --compressed <url>`):

- `https://img.ly/docs/cesdk/dev/react-native/user-interface/customization-72b2f8.md`
- `https://img.ly/docs/cesdk/dev/react-native/import-media/capture-from-camera/camera-configuration-46afd0.md`

Reference folder: `skills/docs/references/react-native/`.
