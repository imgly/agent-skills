# CaptureCount

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** enum
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

How many captures the camera session produces.

```dart
enum CaptureCount
```

## Values

### single

```dart
single
```

Produces a single capture and dismisses.

### multi

```dart
multi
```

Stacks multiple captures into the progress ring.

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
static CaptureCount fromJson(String value)
```

Creates a new instance from a JSON value.
