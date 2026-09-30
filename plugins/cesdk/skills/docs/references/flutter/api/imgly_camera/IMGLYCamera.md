# IMGLYCamera

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

The entry point for the IMGLY Camera plugin.

```dart
class IMGLYCamera
```

## Members

### openCamera

- **Kind:** Method

```dart
static Future<CameraResult?> openCamera(CameraSettings settings, {String? video, Map<String, dynamic>? metadata})
```

Opens the camera for recording or reaction mode.

- **settings**: Configuration settings for the camera.
- **video**: Optional video input to trigger reactions (iOS only).
- **metadata**: Optional metadata to pass to the native module.
