> This is one page of the CE.SDK React Native documentation. For a complete overview, see the [React Native Documentation Index](https://img.ly/docs/cesdk/react-native/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/react-native/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/react-native/guides-8d8b00/) > [Import Media Assets](https://img.ly/docs/cesdk/react-native/import-media-4e3703/) > [Capture From Camera](https://img.ly/docs/cesdk/react-native/import-media/capture-from-camera-92f388/) > [Integrate Mobile Camera](./integrate.md)

---

In this example, we will show you how to initialize the [Camera SDK](https://img.ly/products/camera-sdk)'s mobile editor in your React Native app.
We also prepared a dedicated example application which you can checkout on [GitHub](https://github.com/imgly/cesdk-react-native-examples/tree/v1.85.0-nightly.20261006).

## Requirements

For this version, the minimum requirements are:

- React Native: 0.73
- iOS: 16
- Swift: 6.3.1 (Xcode 26.4.1)
- Android: 7

## Add from npmjs.com

Add the `@imgly/camera-react-native` module to your projects via your favorite package manager.

## Android Setup

In order to integrate the camera for Android, make some adjustments to your `app.json` file=

1. Add the [`expo-build-properties`](https://www.npmjs.com/package/expo-build-properties) config plugin to your app.

2. Add the following options:

## iOS Setup

In order to integrate the camera for iOS, make some adjustments to your `app.json` file as well:

## Usage

In this example, we'll demonstrate the basic usage of the camera.

In order to launch the camera, an instance of `CameraSettings` needs to be provided. For this, you only need to provide the `license` key that you received from IMG.LY.
Optionally, you can provide a unique ID tied to your application's user. This helps us accurately calculate monthly active users (MAU) and it is especially useful when one person uses the app on multiple devices with a sign-in feature, ensuring they're counted once.

```typescript
const settings: CameraSettings = {
  license: 'YOUR_LICENSE_KEY',
};
```

Next, you can open the editor using the `openCamera` method.

```typescript
const result = await IMGLYCamera.openCamera(settings);
```

That is all. For more than basic configuration, check out all the available [configurations](../../user-interface/customization.md).

## Full Code

Here's the full code for both `app.json` and `camera_react_native.ts`.

### app.json

```json title="app.json"
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "extraMavenRepos": ["https://maven.img.ly/maven"],
            "minSdkVersion": 24,
            "kotlinVersion": "1.9.10"
          },
          "ios": {
            "deploymentTarget": "16.0",
            "useFrameworks": "dynamic"
          }
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera for demonstration purposes.",
        "NSMicrophoneUsageDescription": "This app uses the camera for demonstration purposes."
      }
    }
  }
}
```

### camera\_react\_native.ts

```typescript title="camera_react_native.ts"
import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const camera = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY',
  };
  const result = await IMGLYCamera.openCamera(settings);
};
```



---

## More Resources

- **[React Native Documentation Index](https://img.ly/docs/cesdk/react-native/)** - Browse all React Native documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/react-native/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/react-native/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support