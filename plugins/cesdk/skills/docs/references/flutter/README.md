# CE.SDK Flutter Documentation

## Platform and Package Scope

Target Flutter projects that use the `imgly_editor` and `imgly_camera`
packages from pub.dev. Detect the project from `pubspec.yaml` and
`lib/main.dart`. The `android/` and `ios/` folders inside a Flutter
project belong to it: do not treat them as a standalone Android or Swift app.

The Dart API is thin by design. `IMGLYEditor.openEditor` and
`IMGLYCamera.openCamera` present the native CE.SDK editor and camera and
return a result. Everything the editor shows and does is configured in Swift
and Kotlin. Read `native-mapping.md` in this folder before answering a customization
question; it says what the Dart layer exposes, what stays native, and how the
two connect.

| Surface | Where it lives |
|---|---|
| Open the editor or camera, presets, source, settings, results | Dart (`imgly_editor`, `imgly_camera`) |
| Editor configuration, dock and inspector, asset sources, callbacks, theming | Swift and Kotlin through the wrapper's builder closures |
| Engine API (`IMGLYEngine`, `ly.img.engine`) | Swift and Kotlin, from the same closures |

## Source Priority

1. Use the bundled Dart API digests under `api/` for the exact
   package surface: `imgly_editor` and `imgly_camera`.
2. Use the native mapping to decide whether a request is a Dart call or a
   native customization.
3. For native code, use the bundled Swift references in `../swift/` and
   the Android references in `../android/` as the source of truth.
4. Use the bundled Flutter guides for integration steps and project setup.
5. Cross-check the resolved package version in `pubspec.lock` when it differs
   from this bundle, and use pretrained knowledge only when nothing above
   answers.

## Lookup Workflow

1. Confirm the project is Flutter (`pubspec.yaml`) and which packages it
   uses: `imgly_editor`, `imgly_camera`, or both.
2. Search the Flutter guide index below and read files under
   `guides/flutter/`.
3. For the Dart API, read `api/<package>/<Type>.md`, for example
   `api/imgly_editor/EditorSettings.md` or
   `api/imgly_camera/CameraConfiguration.md`.
4. For anything the Dart API does not expose, read `native-mapping.md`, then
   the matching Swift digest under `../swift/api/` and Kotlin digest under
   `../android/api/`. Answer with both native sides unless the user targets
   one.

## Guide Indexes

### Flutter (Dart)

<-- IMGLY-AGENTS-MD-START -->[CE.SDK Flutter (Dart) Docs Index]|root: ./guides/flutter|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any CE.SDK tasks. Consult the local docs directory before using pre-trained knowledge.|animation:{overview.md}|automation:{overview.md}|capabilities.md|colors:{overview.md}|compatibility.md|concepts:{error-catalog.md,import-export.md}|configuration.md|conversion:{overview.md}|create-composition:{overview.md}|create-templates:{overview.md}|edit-image:{transform}|edit-image/transform:{move.md}|edit-video:{transform}|edit-video/transform:{flip.md,move.md,resize.md}|engine-interface.md|export-counting.md|export-save-publish:{export}|export-save-publish/export:{audio.md}|file-format-support.md|filters-and-effects:{overview.md}|get-started:{agent-skills.md,build-with-ai.md,flutter,mcp-server.md,overview.md}|get-started/flutter:{clone-github.md,existing-project.md,new-project.md}|import-media:{capture-from-camera,file-format-support.md,overview.md,size-limits.md}|import-media/capture-from-camera:{camera-configuration.md,integrate.md,recordings.md}|insert-media:{overview.md}|key-capabilities.md|key-concepts.md|licensing.md|llms-txt.md|open-the-editor:{overview.md}|outlines:{overview.md}|prebuilt-solutions:{camera-editor.md,design-editor.md,photo-editor.md,postcard-editor.md,t-shirt-designer.md,video-editor.md}|rules:{overview.md}|security.md|settings.md|text:{overview.md,text-designs.md}|to-v1-73.md|to-v1-77.md|use-templates:{overview.md}|user-interface:{custom-error-messages.md,customization.md}|what-is-cesdk.md|<-- IMGLY-AGENTS-MD-END -->

## API Index

<-- IMGLY-TYPES-MD-START -->
[CE.SDK Flutter API Index]|root: ./api|

imgly_editor:{EditorPreset,EditorPresetStringValue,EditorResult,EditorSettings,IMGLYEditor,Source}|platforms:{flutter}
imgly_camera:{CameraCapture,CameraConfiguration,CameraReaction,CameraResult,CameraSettings,Capture,CaptureCount,CaptureType,IMGLYCamera,Photo,PhotoImage,Recording,Rect,Video}|platforms:{flutter}
<-- IMGLY-TYPES-MD-END -->

## Native Mapping

`native-mapping.md` in this folder lists what the Flutter
packages expose, what stays native, and the closures that connect the two.
The native editor and engine APIs are the bundled Swift references in
`../swift/` and the Android references in `../android/`.

## Related Skills

- Use the sibling `build` skill to implement or scaffold Flutter code.
- Use the sibling `explain` skill for a conceptual walkthrough.
