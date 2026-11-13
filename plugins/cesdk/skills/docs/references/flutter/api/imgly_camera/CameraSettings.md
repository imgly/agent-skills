# CameraSettings

- **Package:** `imgly_camera` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_camera/imgly_camera.dart';`

A class containing all necessary settings to setup the camera.

```dart
class CameraSettings
```

## Members

### CameraSettings

- **Kind:** Constructor

```dart
const CameraSettings({this.license, this.userId, this.configuration})
```

Creates a new instance of `CameraSettings`.

### license

- **Kind:** Property

```dart
final String? license
```

The license of the editor. Pass `null` to run the SDK in evaluation mode with a watermark.

### userId

- **Kind:** Property

```dart
final String? userId
```

Unique ID tied to your application's user.
This helps us accurately calculate monthly active users (MAU).

### configuration

- **Kind:** Property

```dart
final CameraConfiguration? configuration
```

Optional `CameraConfiguration` controlling how the camera captures media.
When `null`, the native defaults apply (video, multi, 5s photo clips,
mode switching allowed).

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts this instance to a JSON map.

### CameraSettings.fromJson

- **Kind:** Constructor

```dart
factory CameraSettings.fromJson(Map<String, dynamic> json)
```

Creates a new instance from a JSON map.
