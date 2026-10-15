# PhotoImage

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

A single image inside a photo capture.

```dart
class PhotoImage
```

## Members

### PhotoImage

- **Kind:** Constructor

```dart
const PhotoImage({required this.uri, required this.rect})
```

Creates a new instance of `PhotoImage`.

### uri

- **Kind:** Property

```dart
final String uri
```

A url to the photo file that is stored in a temporary location.

### rect

- **Kind:** Property

```dart
final Rect rect
```

The position and size of the image inside the dual-camera layout.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### PhotoImage.fromJson

- **Kind:** Constructor

```dart
factory PhotoImage.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
