# CE.SDK React Native Documentation

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
and Kotlin. Read `native-mapping.md` in this folder before answering a customization
question; it says what the TypeScript layer exposes, what stays native, and
how the two connect.

| Surface | Where it lives |
|---|---|
| Open the editor or camera, presets, source, settings, results | TypeScript (`@imgly/editor-react-native`, `@imgly/camera-react-native`) |
| Editor configuration, dock and inspector, asset sources, callbacks, theming | Swift and Kotlin through the module's builder closures |
| Engine API (`IMGLYEngine`, `ly.img.engine`) | Swift and Kotlin, from the same closures |

## Source Priority

1. Use the bundled TypeScript API digests under `api/` for the exact
   package surface: `@imgly/editor-react-native` and
   `@imgly/camera-react-native`.
2. Use the native mapping to decide whether a request is a TypeScript call or
   a native customization.
3. For native code, use the bundled Swift references in `../swift/` and
   the Android references in `../android/` as the source of truth.
4. Use the bundled React Native guides for integration steps, Expo config
   plugins, and project setup.
5. Cross-check the installed package version in `package.json` when it
   differs from this bundle, and use pretrained knowledge only when nothing
   above answers.

## Lookup Workflow

1. Confirm the project is React Native (`react-native` in `package.json`)
   and whether it uses Expo (`expo` dependency, `app.json` plugins).
2. Search the React Native guide index below and read files under
   `guides/react-native/`.
3. For the TypeScript API, read `api/<package>/<Type>.md`, for example
   `api/editor-react-native/EditorSettings.md` or
   `api/camera-react-native/CameraConfiguration.md`.
4. For anything the TypeScript API does not expose, read `native-mapping.md`,
   then the matching Swift digest under `../swift/api/` and Kotlin digest
   under `../android/api/`. Answer with both native sides unless the user
   targets one.

## Guide Indexes

### React Native

<-- IMGLY-AGENTS-MD-START -->[CE.SDK React Native Docs Index]|root: ./guides/react-native|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any CE.SDK tasks. Consult the local docs directory before using pre-trained knowledge.|animation:{overview.md}|automation:{overview.md}|capabilities.md|colors:{overview.md}|compatibility.md|concepts:{error-catalog.md,import-export.md}|configuration.md|conversion:{overview.md}|create-composition:{overview.md}|create-templates:{overview.md}|edit-image:{transform}|edit-image/transform:{move.md}|edit-video:{transform}|edit-video/transform:{flip.md,move.md,resize.md}|engine-interface.md|export-counting.md|export-save-publish:{export}|export-save-publish/export:{audio.md}|file-format-support.md|filters-and-effects:{overview.md}|get-started:{agent-skills.md,build-with-ai.md,mcp-server.md,overview.md,react-native}|get-started/react-native:{clone-github.md,existing-project-b4312d.md,existing-project-b9012y.md,new-project-a1234y.md,new-project-a5678y.md}|import-media:{capture-from-camera,file-format-support.md,overview.md,size-limits.md}|import-media/capture-from-camera:{camera-configuration.md,integrate.md,recordings.md}|insert-media:{overview.md}|key-capabilities.md|key-concepts.md|licensing.md|llms-txt.md|open-the-editor:{overview.md}|outlines:{overview.md}|prebuilt-solutions:{camera-editor.md,design-editor.md,photo-editor.md,postcard-editor.md,t-shirt-designer.md,video-editor.md}|rules:{overview.md}|security.md|settings.md|text:{overview.md,text-designs.md}|to-v1-73.md|to-v1-77.md|use-templates:{overview.md}|user-interface:{custom-error-messages.md,customization.md}|what-is-cesdk.md|<-- IMGLY-AGENTS-MD-END -->

## API Index

<-- IMGLY-TYPES-MD-START -->
[CE.SDK React Native API Index]|root: ./api|

@imgly/editor-react-native:{EditorPreset,EditorResult,EditorSettings,EditorSettingsModel,IMGLYEditor,Source,SourceType}|platforms:{react-native}
@imgly/camera-react-native:{CameraCaptureResult,CameraConfiguration,CameraReactionResult,CameraSettings,Capture,CaptureCount,CaptureType,IMGLYCamera,Photo,PhotoImage,Recording,Rect,Video}|platforms:{react-native}
<-- IMGLY-TYPES-MD-END -->

## Native Mapping

`native-mapping.md` in this folder lists what the React Native
packages expose, what stays native, and the closures that connect the two.
The native editor and engine APIs are the bundled Swift references in
`../swift/` and the Android references in `../android/`.

## Related Skills

- Use the sibling `build` skill to implement or scaffold React Native code.
- Use the sibling `explain` skill for a conceptual walkthrough.
