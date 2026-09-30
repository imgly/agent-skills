# Video

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

An individual video.

```dart
class Video
```

## Members

### Video

- **Kind:** Constructor

```dart
const Video({required this.uri, required this.rect})
```

Creates a new instance of `Video`.

### uri

- **Kind:** Property

```dart
final String uri
```

A url to the video file that is stored in a temporary location.

### rect

- **Kind:** Property

```dart
final Rect rect
```

A rect that contains the position of each video as it was shown in the
camera preview.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### Video.fromJson

- **Kind:** Constructor

```dart
factory Video.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
