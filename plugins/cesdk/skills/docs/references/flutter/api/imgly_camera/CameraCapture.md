# CameraCapture

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

The result for a camera capture session producing photos, videos, or both.

```dart
class CameraCapture
```

## Members

### CameraCapture

- **Kind:** Constructor

```dart
const CameraCapture({required this.captures})
```

Creates a new instance of `CameraCapture`.

### captures

- **Kind:** Property

```dart
final List<Capture> captures
```

The individual captures from the session.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### CameraCapture.fromJson

- **Kind:** Constructor

```dart
factory CameraCapture.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
