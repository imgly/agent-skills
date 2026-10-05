> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/flutter/guides-8d8b00/) > [Import Media Assets](https://img.ly/docs/cesdk/flutter/import-media-4e3703/) > [Capture From Camera](https://img.ly/docs/cesdk/flutter/import-media/capture-from-camera-92f388/) > [Integrate Mobile Camera](./integrate.md)

---

```dart file=@cesdk_flutter_examples/camera-guides-quickstart/camera_quickstart_solution.dart reference-only
import 'package:imgly_camera/imgly_camera.dart';

class CameraQuickstartSolution {
  /// Opens the camera.
  void openCamera() async {
    const settings = CameraSettings(
      license:
          "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
      userId: "YOUR_USER_ID", // A unique string to identify your user/session
    );

    final result = await IMGLYCamera.openCamera(settings);
    print(result?.toJson());
  }
}
```

In this example, we will show you how to initialize the [Camera SDK](https://img.ly/products/camera-sdk)'s mobile editor in your Flutter app. We also prepared a dedicated example application which you can checkout on [GitHub](https://github.com/imgly/cesdk-flutter-examples/tree/v1.84.0-rc.1/showcases/guides/camera-guides-quickstart/camera_quickstart_solution.dart).

## Integration

The `openCamera` function allows for some further basic configuration of the camera.

### CameraSettings

All the basic configuration settings are part of the `EngineSettings` which are required to initialize the camera.

- `license` – the license to activate the Engine with.
- `userID` – an optional unique ID tied to your application's user. This helps us accurately calculate monthly active users (MAU). Especially useful when one person uses the app on multiple devices with a sign-in feature, ensuring they're counted once. Providing this aids in better data accuracy. The default value is `nil`.

```dart highlight-configuration
const settings = CameraSettings(
  license:
      "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
  userId: "YOUR_USER_ID", // A unique string to identify your user/session
);
```

### Reactions

You can optionally provide a `video` parameter which lets the user react to that video.

```dart highlight-camera-call
final result = await IMGLYCamera.openCamera(settings);
print(result?.toJson());
```

## Full Code

Here's the full code for the camera integration:

### camera\_quickstart\_solution.dart

```dart file=@cesdk_flutter_examples/camera-guides-quickstart/camera_quickstart_solution.dart
import 'package:imgly_camera/imgly_camera.dart';

class CameraQuickstartSolution {
  /// Opens the camera.
  void openCamera() async {
    const settings = CameraSettings(
      license:
          "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
      userId: "YOUR_USER_ID", // A unique string to identify your user/session
    );

    final result = await IMGLYCamera.openCamera(settings);
    print(result?.toJson());
  }
}
```

That is all. For more than basic configuration, check out all the available [configurations](../../configuration.md).



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support