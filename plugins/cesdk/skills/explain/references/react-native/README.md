# Explain CE.SDK for React Native

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

Explain from first principles, then connect the concept to the TypeScript
calls the app makes and to the native code behind them. Say which layer a
concept lives in: the module opens the editor and returns a result; the native
editors own configuration, assets, callbacks, and the engine.

```typescript
import IMGLYEditor, { EditorPreset, EditorSettingsModel } from '@imgly/editor-react-native';

const settings = new EditorSettingsModel({ license: undefined }); // Evaluation mode with a watermark.
const result = await IMGLYEditor.openEditor(settings, undefined, EditorPreset.DESIGN);
```

For a native concept, ground the explanation in `../swift/README.md` and
`../android/README.md` and state that the customization is written in Swift
and Kotlin. Use the sibling `docs`
skill for exact reference lookup and the sibling `build` skill when the user
wants runnable implementation.
