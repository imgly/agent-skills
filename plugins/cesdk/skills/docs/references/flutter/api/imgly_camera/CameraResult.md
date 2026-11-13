# CameraResult

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

The result of a camera session.

```dart
class CameraResult
```

## Members

### CameraResult

- **Kind:** Constructor

```dart
const CameraResult({this.reaction, this.capture, required this.metadata})
```

Creates a new instance of `CameraResult`.

### reaction

- **Kind:** Property

```dart
final CameraReaction? reaction
```

The reaction result for a reaction camera session.

### capture

- **Kind:** Property

```dart
final CameraCapture? capture
```

The capture result for a photo, video, or mixed camera session.

### metadata

- **Kind:** Property

```dart
final Map<String, dynamic> metadata
```

The associated metadata.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### CameraResult.fromJson

- **Kind:** Constructor

```dart
factory CameraResult.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
