# Source

- **Package:** `imgly_editor` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_editor/imgly_editor.dart';`

A source for the editor.

```dart
class Source
```

## Members

### source

- **Kind:** Property

```dart
final String source
```

The source.

### Source.fromImage

- **Kind:** Constructor

```dart
Source.fromImage(this.source)
```

Creates a new source from an image.
The `source` should be pointing to a valid image file.

### Source.fromVideo

- **Kind:** Constructor

```dart
Source.fromVideo(this.source)
```

Creates a new source from a video.
The `source` should be pointing to a valid video file.

### Source.fromScene

- **Kind:** Constructor

```dart
Source.fromScene(this.source)
```

Creates a new source from a scene.
The `source` should be pointing to a valid scene file.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts the instance to a `Map<String, dynamic>`
for JSON encoding.
