# Build with CE.SDK Flutter

## Platform and Package Scope

Target Flutter projects that use the `imgly_editor` and `imgly_camera`
packages from pub.dev. Detect the project from `pubspec.yaml` and
`lib/main.dart`. The `android/` and `ios/` folders inside a Flutter
project belong to it: do not treat them as a standalone Android or Swift app.

The Dart API is thin by design. `IMGLYEditor.openEditor` and
`IMGLYCamera.openCamera` present the native CE.SDK editor and camera and
return a result. Everything the editor shows and does is configured in Swift
and Kotlin. Read `skills/docs/references/flutter/native-mapping.md` before answering a customization
question; it says what the Dart layer exposes, what stays native, and how the
two connect.

| Surface | Where it lives |
|---|---|
| Open the editor or camera, presets, source, settings, results | Dart (`imgly_editor`, `imgly_camera`) |
| Editor configuration, dock and inspector, asset sources, callbacks, theming | Swift and Kotlin through the wrapper's builder closures |
| Engine API (`IMGLYEngine`, `ly.img.engine`) | Swift and Kotlin, from the same closures |

## Source Priority

1. Use the bundled Dart API digests under `skills/docs/references/flutter/api/` for the exact
   package surface: `imgly_editor` and `imgly_camera`.
2. Use the native mapping to decide whether a request is a Dart call or a
   native customization.
3. For native code, use the bundled Swift references in `skills/docs/references/swift/` and
   the Android references in `skills/docs/references/android/` as the source of truth.
4. Use the bundled Flutter guides for integration steps and project setup.
5. Cross-check the resolved package version in `pubspec.lock` when it differs
   from this bundle, and use pretrained knowledge only when nothing above
   answers.

## Workflow

1. Inspect `pubspec.yaml`, `lib/main.dart`, and the platform folders.
   For a new app, run `flutter create <name>` first; there is no Flutter
   starter kit to copy.
2. Add `imgly_editor` and, when the app captures media, `imgly_camera` to
   `pubspec.yaml` at the CE.SDK version of this bundle, then run
   `flutter pub get`.
3. Apply the platform setup from the bundled get-started guides: Android
   `minSdkVersion`, the IMG.LY Maven repository, Kotlin version; iOS 16.0
   as the deployment target (`platform :ios, '16.0'` when the app still
   resolves plugins with CocoaPods instead of Swift Package Manager).
4. Consult the sibling `docs` skill for the exact Dart API, then copy the
   closest bundled example below and adapt it. `license: null` opens the
   editor in evaluation mode with a watermark. The Android camera rejects a
   null license with `INVALID_ARGUMENTS`, so pass a license to
   `IMGLYCamera.openCamera` there. Never commit a license value.
5. For a customization the Dart API does not expose, read
   `skills/docs/references/flutter/native-mapping.md` and implement it in
   Swift and Kotlin with the bundled Swift and Android references.
6. Run `flutter analyze` and build for one platform, for example
   `flutter build apk --debug` or `flutter build ios --simulator`.

## Bundled Examples

| Example | Path | Shows |
|---|---|---|
| editor-guides-quickstart | `examples/editor-guides-quickstart/` | Open the editor with a license and user id |
| editor-guides-configuration-basics | `examples/editor-guides-configuration-basics/` | Editor settings: license, user id, asset base URI |
| editor-guides-solutions-design-editor | `examples/editor-guides-solutions-design-editor/` | Open the design editor preset |
| editor-guides-solutions-photo-editor | `examples/editor-guides-solutions-photo-editor/` | Open the photo editor preset with an image source |
| editor-guides-solutions-video-editor | `examples/editor-guides-solutions-video-editor/` | Open the video editor preset |
| editor-guides-solutions-apparel-editor | `examples/editor-guides-solutions-apparel-editor/` | Open the apparel editor preset |
| editor-guides-solutions-postcard-editor | `examples/editor-guides-solutions-postcard-editor/` | Open the postcard editor preset |
| camera-guides-quickstart | `examples/camera-guides-quickstart/` | Open the camera and read its result |
| camera-guides-configuration | `examples/camera-guides-configuration/` | Camera settings: capture type, capture count, photo clip duration |
| camera-guides-recordings | `examples/camera-guides-recordings/` | Read recordings, reactions, and captures from the camera result |

Each example is one Dart file from the Flutter showcases app. Copy the call
into your own widget or service; the examples are not standalone projects.

```dart
import 'package:imgly_editor/imgly_editor.dart';

Future<void> openDesignEditor() async {
  final settings = EditorSettings(
    license: null, // Evaluation mode; inject a secure value in production.
    userId: 'user-id',
  );
  final result = await IMGLYEditor.openEditor(
    settings: settings,
    preset: EditorPreset.design,
  );
  if (result != null) {
    // result.scene, result.artifact, result.thumbnail, result.metadata
  }
}
```

Use the sibling `explain` skill for architecture and the sibling `docs`
skill for reference lookup.
