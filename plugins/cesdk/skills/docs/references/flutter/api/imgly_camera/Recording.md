# Recording

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

A recording of the camera that can contain multiple videos.

```dart
class Recording
```

## Members

### Recording

- **Kind:** Constructor

```dart
const Recording({required this.videos, required this.duration})
```

Creates a new instance of `Recording`.

### videos

- **Kind:** Property

```dart
final List<Video> videos
```

The individual videos of the recording.

### duration

- **Kind:** Property

```dart
final double duration
```

The overall duration in milliseconds.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### Recording.fromJson

- **Kind:** Constructor

```dart
factory Recording.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
