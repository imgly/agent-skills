# CameraReaction

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

The result for a reaction camera recording session.

```dart
class CameraReaction
```

## Members

### CameraReaction

- **Kind:** Constructor

```dart
const CameraReaction({required this.video, required this.recordings})
```

Creates a new instance of `CameraReaction`.

### video

- **Kind:** Property

```dart
final Recording video
```

The video that was reacted to (iOS only).

### recordings

- **Kind:** Property

```dart
final List<Recording> recordings
```

The recorded videos.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### CameraReaction.fromJson

- **Kind:** Constructor

```dart
factory CameraReaction.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
