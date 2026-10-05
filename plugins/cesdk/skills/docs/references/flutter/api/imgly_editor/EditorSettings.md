# EditorSettings

- **Package:** `imgly_editor` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_editor/imgly_editor.dart';`

The `EditorSettings` are used to provide the
information needed by the editor to operate.

```dart
class EditorSettings
```

## Members

### license

- **Kind:** Property

```dart
final String? license
```

The license of the editor. Pass `null` to run the SDK in evaluation mode with a watermark.

### baseUri

- **Kind:** Property

```dart
final String baseUri
```

The base URI used by the engine for built-in assets like emoji and
fallback fonts, and by the editor for its default and demo asset
sources (stickers, filters, and more).

By default, assets are loaded from the IMG.LY CDN at
`https://cdn.img.ly/packages/imgly/cesdk-flutter/<version>/assets`.
For production use, we recommend downloading the assets from
`https://cdn.img.ly/packages/imgly/cesdk-flutter/<version>/imgly-assets.zip`,
hosting them on your own server, and setting `baseUri` to your
hosted location.

### userId

- **Kind:** Property

```dart
final String? userId
```

Unique ID tied to your application's user. This helps
us accurately calculate monthly active users (MAU).

### EditorSettings

- **Kind:** Constructor

```dart
EditorSettings({this.license, this.baseUri = "https://cdn.img.ly/packages/imgly/cesdk-flutter/1.84.0-rc.1/assets", this.userId})
```

Creates new `EditorSettings` from the given
properties.

The `license` is used to unlock the editor. Pass `null` to run the SDK in evaluation mode with a watermark.
The `baseUri` specifies where engine assets (emoji, fallback fonts)
and editor asset sources are loaded from. Defaults to the IMG.LY CDN.
The `userId` is the ID of the user that is associated with this
instance.

### toJson

- **Kind:** Method

```dart
Map<String, dynamic> toJson()
```

Converts the instance to a `Map<String, dynamic>`
for JSON encoding.
