# EditorResult

- **Package:** `imgly_editor` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_editor/imgly_editor.dart';`

An editor result is returned from a successful editor
export and contains the relevant export information.

```dart
class EditorResult
```

## Members

### scene

- **Kind:** Property

```dart
final String? scene
```

The uri of the scene as `String`.

⚠️ On Android, this scene might contain blocks that reference
`content://` Uri(s) (e.g. when media is picked from gallery or camera).
These may not be resolvable when loading the scene again, especially
outside the original app context.

If you need to support reloading such scenes, consider using a custom
implementation with `EngineConfiguration.onUpload` and
`engine.editor.setUriResolver` to handle these Uri(s) appropriately.

### artifact

- **Kind:** Property

```dart
final String? artifact
```

The uri of the exported image/video/pdf as `String`.

### thumbnail

- **Kind:** Property

```dart
final String? thumbnail
```

The uri of the thumbnail of the artifact as `String`.

### metadata

- **Kind:** Property

```dart
final Map<String, dynamic> metadata
```

Metadata associated with the export.
Should be customizable by the customer using
the `onExport` interface.

### EditorResult

- **Kind:** Constructor

```dart
EditorResult({this.scene, this.artifact, this.thumbnail, this.metadata = const {}})
```

Creates a new `EditorResult` from the
given properties.
The `scene` is a string representation of the exported
scene which can be used to load into the editor again.
The `artifact` represents the exported file which can be
an image, a video or a document (e.g. PDF) depending on the UI.
The `thumbnail` is a preview of the artifact.
In case the scene contains multiple pages, the thumbnail always
represents a preview of the first page and for videos of the first
frame (if not modified natively).
The `metadata` can be used to process any `Map<String, dynamic>` and is
an empty map per default.

### EditorResult.fromJson

- **Kind:** Constructor

```dart
factory EditorResult.fromJson(Map<String, dynamic> json)
```

Creates a new `EditorResult` from the given `json`.
