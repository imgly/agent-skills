# Rect

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

A rect used to determine video dimensions on the canvas.

```dart
class Rect
```

## Members

### Rect

- **Kind:** Constructor

```dart
const Rect({required this.x, required this.y, required this.width, required this.height})
```

Creates a new instance of `Rect`.

### x

- **Kind:** Property

```dart
final double x
```

The x coordinate of the top-left corner.

### y

- **Kind:** Property

```dart
final double y
```

The y coordinate of the top-left corner.

### width

- **Kind:** Property

```dart
final double width
```

The width.

### height

- **Kind:** Property

```dart
final double height
```

The height.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### Rect.fromJson

- **Kind:** Constructor

```dart
factory Rect.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
