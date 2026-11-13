# IMGLYEditor

- **Package:** `imgly_editor` (Flutter, Dart)
- **Kind:** class
- **Import:** `import 'package:imgly_editor/imgly_editor.dart';`

```dart
class IMGLYEditor
```

## Members

### openEditor

- **Kind:** Method

```dart
static Future<EditorResult?> openEditor({Source? source, EditorPreset? preset = EditorPreset.design, required EditorSettings settings, Map<String, dynamic>? metadata})
```

Opens the creative editor.

The editor will be opened with the given `source`
or the default asset if `null`. If desired, the editor
can be opened from a given UI `preset` which is
`EditorPreset.design` by default.
The `settings` include all the properties needed
for the editor to work, e.g. the license and the CDN for
assets. Optionally, `metadata` can also be specified
which is not used by the plugin other than with a custom
implementation.
