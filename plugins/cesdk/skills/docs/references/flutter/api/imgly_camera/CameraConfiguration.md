# CameraConfiguration

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

Configuration options that control how the camera captures media.

```dart
class CameraConfiguration
```

## Members

### CameraConfiguration

- **Kind:** Constructor

```dart
const CameraConfiguration({this.captureType = CaptureType.video, this.captureCount = CaptureCount.multi, this.photoClipDuration = 5.0})
```

Creates a new instance of `CameraConfiguration`.

### captureType

- **Kind:** Property

```dart
final CaptureType captureType
```

The kind of media the camera captures.

### captureCount

- **Kind:** Property

```dart
final CaptureCount captureCount
```

How many captures the camera session produces.

### photoClipDuration

- **Kind:** Property

```dart
final double photoClipDuration
```

The duration in seconds stamped on each captured photo.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### CameraConfiguration.fromJson

- **Kind:** Constructor

```dart
factory CameraConfiguration.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
