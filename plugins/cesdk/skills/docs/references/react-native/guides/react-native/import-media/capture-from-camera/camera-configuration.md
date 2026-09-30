> This is one page of the CE.SDK React Native documentation. For a complete overview, see the [React Native Documentation Index](https://img.ly/docs/cesdk/react-native/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/react-native/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/react-native/guides-8d8b00/) > [Import Media Assets](https://img.ly/docs/cesdk/react-native/import-media-4e3703/) > [Capture From Camera](https://img.ly/docs/cesdk/react-native/import-media/capture-from-camera-92f388/) > [Camera Configuration](./camera-configuration.md)

---

```typescript file=@cesdk_react_native_examples/camera-guides-configuration/configured_camera_solution.ts reference-only
import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const recordings_reaction_camera_solution = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY', // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
    userId: 'YOUR_USER_ID'
  };

  const result = await IMGLYCamera.openCamera(
    settings,
    require('MY_VIDEO_SOURCE')
  );
};
```

The `@imgly/camera-react-native` React Native module is built on top of the native Android and iOS UI implementation and has no dedicated React Native UI.
However, you still have access to [the same customization options as for iOS](./camera-configuration.md#platform=ios) and an interface for Android.
To use them you need to configure them [natively for both platforms](#native-customization).
Further, the most important settings can be set from React Native directly.

## React Native Customization

From within React Native directly, you can modify the most important camera behavior settings.

### CameraSettings

All the basic configuration settings are part of the `EngineSettings` which are required to initialize the camera.

- `license` – the license to activate the [Engine](../../get-started/overview.md) with.
- `userID` – an optional unique ID tied to your application's user. This helps us accurately calculate monthly active users (MAU). Especially useful when one person uses the app on multiple devices with a sign-in feature, ensuring they're counted once. Providing this aids in better data accuracy. The default value is `nil`.

```typescript highlight-settings
const settings: CameraSettings = {
  license: 'YOUR_LICENSE_KEY', // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
  userId: 'YOUR_USER_ID'
};
```

### Capture Type and Count

The `configuration` field on `CameraSettings` lets you opt the camera into photo or mixed capture sessions:

- `captureType`: `'video'` (default), `'photo'`, or `'mixed'`. In `'mixed'` mode the camera shows a photo/video toggle.
- `captureCount`: `'multi'` (default) lets the user stack multiple captures into one session; `'single'` returns after a single capture.
- `photoClipDuration`: the duration in seconds stamped on each captured photo. Defaults to `5`.

```typescript
const settings: CameraSettings = {
  license: 'YOUR_LICENSE_KEY',
  configuration: {
    captureType: 'photo',
    captureCount: 'single',
  },
};

const result = await IMGLYCamera.openCamera(settings);
// result.captures: Capture[] (each wraps a `photo` or `video`).
```

### Reactions

You can optionally provide a `video` parameter which lets the user react to that video.

```typescript highlight-reactions
const result = await IMGLYCamera.openCamera(
  settings,
  require('MY_VIDEO_SOURCE')
);
```

## Native Customization

In order to fully utilize the natively available customizations, the module comes with native interfaces for both iOS and Android.

### iOS

The customization layer for iOS is written in **Swift** and available via the `IMGLYCameraModuleSwiftAdapter.shared` instance.
The camera that is opened via the `IMGLYCameraModuleSwiftAdapter.openCamera()` function can be completely customized and exchanged.
For this to work you can use the `IMGLYCameraModuleSwiftAdapter.cameraBuilderClosure` which provides optional `metadata`
with which you can provide any prebuilt or custom camera view. The `metadata` parameter of the `openCamera` function can be utilized
to provide customization details from the React Native side of your app to the native side:

You can either use the `CameraBuilder.default` implementation or in case you want a completely custom UI, you can use the `CameraBuilder.custom` function that allows you to return a custom `View` based on a given `CameraSettings`, `URL`, `metadata` and an `CameraBuilderResult`:

```swift
IMGLYCameraModuleSwiftAdapter.shared.cameraBuilderClosure = { metadata in
  // Make decisions based on your own metadata.
  if metadata?["use_custom_camera"] as? Bool == true {
    // Return your custom camera.
    CameraBuilder.custom { settings, url, metadata, result in
      CustomCamera(settings: settings, url: url, metadata: metadata, result: result)
    }
  } else {
    // Return a custom or prebuilt camera.
    CameraBuilder.default()
  }
}
```

### Android

On Android, the module comes with two interfaces for modifications:

#### CameraInputClosure

The `CameraInputClosure` can be used to provide a custom `CaptureMedia.Input` based on given `metadata`.
It is accessible via the `IMGLYCameraModule.configurationClosure`.

```kotlin
// Configure the [CaptureMedia.Input].
IMGLYCameraModule.configurationClosure = { metadata ->
    val engineConfiguration = EngineConfiguration("MY_LICENSE")
    CaptureMedia.Input(engineConfiguration)
}
```

#### CameraResultClosure

The `CameraResultClosure` can be used to return a custom `CameraResult` based on the result returned by the camera.
It is accessible via the `IMGLYCameraModule.resultClosure`.

```kotlin
// Modify the [CameraResult].
IMGLYCameraModule.resultClosure = { result ->
    CameraResult(result?.capture, mapOf("MY_CUSTOM_KEY" to "MY_CUSTOM_VALUE"))
}
```

## Full Code

Here's the full code for all files.

### configured\_camera\_solution.ts

```typescript
import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const recordings_reaction_camera_solution = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY',
    userId: 'YOUR_USER_ID',
  };

  const result = await IMGLYCamera.openCamera(
    settings,
    require('MY_VIDEO_SOURCE'),
  );
};
```

### ConfigurationGuide.swift

```swift
IMGLYCameraModuleSwiftAdapter.shared.cameraBuilderClosure = { metadata in
  // Make decisions based on your own metadata.
  if metadata?["use_custom_camera"] as? Bool == true {
    // Return your custom camera.
    CameraBuilder.custom { settings, url, metadata, result in
      CustomCamera(settings: settings, url: url, metadata: metadata, result: result)
    }
  } else {
    // Return a custom or prebuilt camera.
    CameraBuilder.default()
  }
}
```

### ConfigurationGuide.kt

```kotlin
// Configure the [CaptureMedia.Input].
IMGLYCameraModule.configurationClosure = { metadata ->
    val engineConfiguration = EngineConfiguration("MY_LICENSE")
    CaptureMedia.Input(engineConfiguration)
}

// Modify the [CameraResult].
IMGLYCameraModule.resultClosure = { result ->
    CameraResult(result?.capture, mapOf("MY_CUSTOM_KEY" to "MY_CUSTOM_VALUE"))
}
```



---

## More Resources

- **[React Native Documentation Index](https://img.ly/docs/cesdk/react-native/)** - Browse all React Native documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/react-native/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/react-native/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support