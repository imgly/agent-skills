# Explain CE.SDK for Flutter

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

Explain from first principles, then connect the concept to the Dart calls the
app makes and to the native code behind them. Say which layer a concept lives
in: the Dart plugin opens the editor and returns a result; the native editors
own configuration, assets, callbacks, and the engine.

```dart
import 'package:imgly_editor/imgly_editor.dart';

final result = await IMGLYEditor.openEditor(
  settings: EditorSettings(license: null), // Evaluation mode with a watermark.
  preset: EditorPreset.design,
);
```

For a native concept, ground the explanation in `../swift/README.md` and
`../android/README.md` and state that the customization is written in Swift
and Kotlin. Use the sibling `docs`
skill for exact reference lookup and the sibling `build` skill when the user
wants runnable implementation.
