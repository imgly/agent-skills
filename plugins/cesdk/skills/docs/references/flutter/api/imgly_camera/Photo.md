# Photo

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

A captured still photo. Contains one image in standard mode or two stacked images in dual camera mode.

```dart
class Photo
```

## Members

### Photo

- **Kind:** Constructor

```dart
const Photo({required this.images, required this.duration})
```

Creates a new instance of `Photo`.

### images

- **Kind:** Property

```dart
final List<PhotoImage> images
```

The individual image(s) of the photo capture.

### duration

- **Kind:** Property

```dart
final double duration
```

The duration stamped on the photo, in milliseconds.
Note: the React Native bridge passes this value in seconds instead.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### Photo.fromJson

- **Kind:** Constructor

```dart
factory Photo.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
