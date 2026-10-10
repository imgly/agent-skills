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
4. Use the Flutter guides on the docs site for integration steps and project setup.
5. Cross-check the resolved package version in `pubspec.lock` when it differs
   from this bundle, and use pretrained knowledge only when nothing above
   answers.

## Lookup Workflow

1. Confirm the project is Flutter (`pubspec.yaml`) and which packages it
   uses: `imgly_editor`, `imgly_camera`, or both.
2. Search `flutter.md` in this folder and fetch the pages as described in
   Remote Documentation below.
3. For the Dart API, read `api/<package>/<Type>.md`, for example
   `api/imgly_editor/EditorSettings.md` or
   `api/imgly_camera/CameraConfiguration.md`.
4. For anything the Dart API does not expose, read `native-mapping.md`, then
   the matching Swift digest under `../swift/api/` and Kotlin digest under
   `../android/api/`. Answer with both native sides unless the user targets
   one.

## Remote Documentation

The guides are on the CE.SDK docs site, not in this bundle. The index files in
this folder list them:

- `flutter.md` lists every page of https://img.ly/docs/cesdk/dev/flutter/ with its title and link.

The links point to the docs of CE.SDK `1.85.0-nightly.20261010`, the version of this bundle,
under `https://img.ly/docs/cesdk/dev/`. The docs site keeps one copy per version, with the same
page paths:

| CE.SDK version | Docs root |
| --- | --- |
| Latest stable release | `https://img.ly/docs/cesdk/` |
| A stable release since 1.60 | `https://img.ly/docs/cesdk/archive/v<major>.<minor>/` |
| Latest release candidate | `https://img.ly/docs/cesdk/next/` |
| Latest nightly | `https://img.ly/docs/cesdk/dev/` |

1. **Check the version.** Read the CE.SDK version the project uses. If it is not
   `1.85.0-nightly.20261010`, replace `https://img.ly/docs/cesdk/dev/` in each link with the root of that
   version.
2. **Read the index** in this folder and pick the pages that match the query.
3. **Fetch each page as Markdown**: remove the trailing `/` from the link and add
   `.md`. For example, `https://img.ly/docs/cesdk/dev/flutter/<path>-<id>/` becomes
   `https://img.ly/docs/cesdk/dev/flutter/<path>-<id>.md`. Use WebFetch. If WebFetch is not
   available (for example in Codex), use `curl -sL --compressed <url>`. If a
   page returns 404, it does not exist in that version: read that version's
   index, `<root>flutter.md`, instead.
4. **Answer from the fetched pages**, and cite their URLs. If neither a page nor
   the bundled API digests cover the request, say so instead of filling the gap
   with pre-trained knowledge.
5. **Full text, last resort**: `https://img.ly/docs/cesdk/flutter/llms-full.txt` holds all pages
   of the latest stable release in one file of several MB. Search it with
   `curl -sL --compressed <url> | grep -n "<keyword>"`. Do not read it in full.

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
