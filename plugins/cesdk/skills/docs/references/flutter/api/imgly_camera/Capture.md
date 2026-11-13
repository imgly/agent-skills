# Capture

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

A single capture from the camera. Either a still `Photo` or a video `Recording`.

```dart
class Capture
```

## Members

### Capture

- **Kind:** Constructor

```dart
const Capture({this.photo, this.video})
```

Creates a new instance of `Capture`.

### photo

- **Kind:** Property

```dart
final Photo? photo
```

The captured still photo, when this is a photo capture.

### video

- **Kind:** Property

```dart
final Recording? video
```

The video recording, when this is a video capture.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### Capture.fromJson

- **Kind:** Constructor

```dart
factory Capture.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
