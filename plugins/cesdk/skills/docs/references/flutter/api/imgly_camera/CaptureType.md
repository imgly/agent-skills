# CaptureType

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** enum
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

The kind of media the camera captures.

```dart
enum CaptureType
```

## Values

### photo

```dart
photo
```

Captures still photos only.

### video

```dart
video
```

Records videos only.

### mixed

```dart
mixed
```

Switches between photo and video via an in-camera toggle.

## Members

### toJson

- **Kind:** Method

```dart
String toJson()
```

Converts this instance to a JSON-serializable value.

### fromJson

- **Kind:** Method

```dart
static CaptureType fromJson(String value)
```

Creates a new instance from a JSON value.
