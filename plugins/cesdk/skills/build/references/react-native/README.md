# Build with CE.SDK React Native

## Platform and Package Scope

Target React Native and Expo projects that use the
`@imgly/editor-react-native` and `@imgly/camera-react-native` npm packages.
Detect the project from `react-native` in `package.json` dependencies, an
`app.json`, or `metro.config.js`. A React Native project also lists
`react` and holds `android/` and `ios/` folders; those belong to it. Do not
route it to the Web React reference or to a standalone Android or Swift app.

The TypeScript API is thin by design. `IMGLYEditor.openEditor` and
`IMGLYCamera.openCamera` present the native CE.SDK editor and camera and
return a result. Everything the editor shows and does is configured in Swift
and Kotlin. Read `skills/docs/references/react-native/native-mapping.md` before answering a customization
question; it says what the TypeScript layer exposes, what stays native, and
how the two connect.

| Surface | Where it lives |
|---|---|
| Open the editor or camera, presets, source, settings, results | TypeScript (`@imgly/editor-react-native`, `@imgly/camera-react-native`) |
| Editor configuration, dock and inspector, asset sources, callbacks, theming | Swift and Kotlin through the module's builder closures |
| Engine API (`IMGLYEngine`, `ly.img.engine`) | Swift and Kotlin, from the same closures |

## Source Priority

1. Use the bundled TypeScript API digests under `skills/docs/references/react-native/api/` for the exact
   package surface: `@imgly/editor-react-native` and
   `@imgly/camera-react-native`.
2. Use the native mapping to decide whether a request is a TypeScript call or
   a native customization.
3. For native code, use the bundled Swift references in `skills/docs/references/swift/` and
   the Android references in `skills/docs/references/android/` as the source of truth.
4. Use the bundled React Native guides for integration steps, Expo config
   plugins, and project setup.
5. Cross-check the installed package version in `package.json` when it
   differs from this bundle, and use pretrained knowledge only when nothing
   above answers.

## Workflow

1. Inspect `package.json`, `app.json`, and the platform folders. For a
   new app, run `npx create-expo-app` or `npx @react-native-community/cli init`
   first; there is no React Native starter kit to copy.
2. Install `@imgly/editor-react-native` and, when the app captures media,
   `@imgly/camera-react-native` at the CE.SDK version of this bundle.
3. Apply the platform setup from the bundled get-started guides: on Expo the
   `expo-build-properties` plugin in `app.json` (Android `minSdkVersion`,
   the IMG.LY Maven repository, Kotlin version; iOS deployment target and
   dynamic frameworks); on a bare project the same values in `android/` and
   `ios/`, then `pod install`.
4. Consult the sibling `docs` skill for the exact TypeScript API, then copy
   the closest bundled example below and adapt it. Leave the license
   undefined for evaluation mode with a watermark and never commit a license
   value.
5. For a customization the TypeScript API does not expose, read
   `skills/docs/references/react-native/native-mapping.md` and implement it
   in Swift and Kotlin with the bundled Swift and Android references.
6. Type-check with `npx tsc --noEmit` and build for one platform, for example
   `npx expo run:android` or `npx react-native run-ios`.

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

Each example is one TypeScript file from the React Native showcases app, plus
the Expo `app.json` config where the guide needs it. Copy the call into your
own component or service; the examples are not standalone projects.

```typescript
import IMGLYEditor, { EditorPreset, EditorSettingsModel } from '@imgly/editor-react-native';

export async function openDesignEditor(): Promise<void> {
  const settings = new EditorSettingsModel({
    license: undefined, // Evaluation mode; inject a secure value in production.
    userId: 'user-id'
  });
  const result = await IMGLYEditor.openEditor(settings, undefined, EditorPreset.DESIGN);
  if (result != null) {
    // result.scene, result.artifact, result.thumbnail, result.metadata
  }
}
```

Use the sibling `explain` skill for architecture and the sibling `docs`
skill for reference lookup.
