> This is one page of the CE.SDK React Native documentation. For a complete overview, see the [React Native Documentation Index](https://img.ly/docs/cesdk/react-native/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/react-native/llms-full.txt).

**Navigation:** [Get Started](../overview.md) > [Quickstart Expo](./new-project-a1234y.md)

---

## Introduction

This guide provides step-by-step instructions for integrating the `@imgly/editor-react-native` module into your existing mobile Expo project. By the end of this guide, you will have a powerful creative editor running in your own Expo application.

> **Note:** Customizing the CreativeEditor SDK for React Native is handled exclusively through native code (Swift/Kotlin), as outlined in our [configuration overview section](../../user-interface/customization.md).

## Pre-requisites

Before you begin, make sure the following requirements are met:

- A properly configured Expo development environment
- Platform-specific development setup for your target (Android and/or iOS)
- Git CLI installed
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)), pass `null` to run in evaluation mode with watermark.

## Minimum Requirements

- React Native: 0.73
- iOS: 16
- Swift: 6.3.1 (Xcode 26.4.1)
- Android: 7.0 (Android SDK 24)

## Add Dependency

First, install the `@imgly/editor-react-native` module by running the following command:

```sh
npx expo install @imgly/editor-react-native
```

## Native Setup

If your application includes Android or iOS as a target platform, some manual configuration is required. Please complete the following steps to ensure proper integration. We suggest using the `expo-build-properties` plugin but you can also do all necessary steps manually.

First, add the `expo-build-properties` plugin to your application:

```sh
npx expo install expo-build-properties
```

### Android

If your application includes Android as a target platform, make the following changes in your `app.json` file:

- Increase the `minSdk` to at least 24
- Include the IMG.LY maven repository
- Increase the Kotlin version to at least `1.9.10`

```diff
"plugins": [
+  [
+    "expo-build-properties",
+    {
+      "android": {
+        "minSdkVersion": 24,
+        "extraMavenRepos": ["https://maven.img.ly/maven"],
+        "kotlinVersion": "1.9.10"
+      }
+    }
+  ]
]
```

### iOS

If your application includes iOS as a target platform, you'll need to:

- Adjust the `deploymentTarget` to at least `16.0` if needed
- Enable `useFrameworks` for Swift pod compatibility (use `dynamic` or `static`)
- Optionally: Add photo library permission if you plan to enable full photo library access (by default, CE.SDK uses the system photos picker which doesn't require permissions)

Update the `expo-build-properties` plugin to include iOS deployment target and framework configuration:

```diff
 "plugins": [
   [
     "expo-build-properties",
     {
+      "ios": {
+        "deploymentTarget": "16.0",
+        "useFrameworks": "dynamic"
+      }
     }
   ]
 ]
```

If you want to enable full photo library access (instead of the default photos picker), add the photo library permission to your `app.json` file:

```diff
+"ios": {
+  "infoPlist": {
+    "NSPhotoLibraryUsageDescription": "This app needs photo library access to import images for editing"
+  }
+}
```

Note: This permission is only required if you explicitly enable full photo library access using `PhotoRollAssetSource(engine: engine, mode: .fullLibraryAccess)` in your iOS code.

Finally, run the `prebuild` command to generate the needed native code.

```sh
npx expo prebuild
```

## Using the Creative Editor

To finally make use of the editor, call the `IMGLYEditor.openEditor` function with suitable `EditorSettings` and optionally your desired `EditorPreset` passed in:

```typescript
import IMGLYEditor, {
  EditorPreset,
  EditorSettingsModel,
  SourceType,
} from '@imgly/editor-react-native';

export const design_editor_solution = async (): Promise<void> => {
  const settings = new EditorSettingsModel({
    license: 'YOUR_LICENSE_KEY', // pass null for evaluation mode with watermark
    userId: 'UNIQUE_USER_ID',
  });
  const result = await IMGLYEditor?.openEditor(
    settings,
    {
      source: 'test_image.png',
      type: SourceType.IMAGE,
    },
    EditorPreset.DESIGN,
  );
};
```

Within a new file, define an asynchronous function named `design_editor_solution` where you will initialize the `EditorSettingsModel`. After providing your valid license key and an optional unique user ID, pass the configured settings to `IMGLYEditor.openEditor()`. At this point, you can also specify an optional `EditorPreset` to open one of our predefined editor variants.

Optionally provide a `Source` object containing an existing image, video, or scene alongside its corresponding `SourceType` to open the editor with that content; otherwise pass `undefined` and the editor will start blank.

Now, you can launch the editor by calling `design_editor_solution()` from wherever you want to open it from.

## Next Steps

- Explore the available presets tailored to different editor solutions.
- Set up a native interface to customize the editor according to your specific requirements.

## Common Errors

#### Dependency not found

```
Couldn't find any versions for "@imgly/editor-react-native" that matches "^x.xx.x"
```

**Solution** -> Ensure you are using an existing version of the IMG.LY editor.

#### Unintegrated Swift pods

```
[!] The following Swift pods cannot yet be integrated as static libraries:
The Swift pod `IMGLYEditorModule` depends upon `IMGLYUI`, which does not define modules.
```

**Solution** -> Ensure you have `useFrameworks` set in your `expo-build-properties` iOS configuration. Use `dynamic` (recommended) or `static`:

```json
{
  "ios": {
    "useFrameworks": "dynamic"
  }
}
```

#### Incompatible compose compiler

```
e: This version of the Compose Compiler requires Kotlin version x.x.xx but you appear to be using Kotlin version y.y.yy which is not known to be compatible.  Please fix your configuration (or `suppressKotlinVersionCompatibilityCheck` but don't say I didn't warn you!).
```

**Solution** -> Ensure you have the proper compose compiler version for your project. Check official mappings [here](https://developer.android.com/jetpack/androidx/releases/compose-kotlin)



---

## More Resources

- **[React Native Documentation Index](https://img.ly/docs/cesdk/react-native/)** - Browse all React Native documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/react-native/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/react-native/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support