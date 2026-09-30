# ly.img.editor.core

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core`
- **Module catalog:** [`ly.img:editor-core`](<../../indexes/editor-core.md>)

## Top-level declarations

### LocalEditorScope

```kotlin
val LocalEditorScope: ProvidableCompositionLocal<EditorScope>
```

Composition local containing currently active EditorScope. Avoid using this composition local at all cost.

### currentLanguageCode

```kotlin
val EditorContext.currentLanguageCode: String
```

The current language code derived from the Activity's configuration (e.g., "en", "de").

### getDisplayDescription

```kotlin
fun EngineException.getDisplayDescription(context: Context): String?
```

Resolves this structured engine error to the customer-facing body copy to display below getDisplayMessage, or null when there is nothing to show. The longer-form companion to getDisplayMessage, mirroring the description half of the Web resolver and the engine's own message/hint split. Looks up the authored ly_img_engine_error_<code>_description string resource, interpolating any {{name}} placeholders with the matching args, and falling back to the engine's English hint when no copy is authored. Returns null when no copy is authored and the catalog declares no hint, so a surface can omit the line instead of showing a blank.

### getDisplayMessage

```kotlin
fun EngineException.getDisplayMessage(context: Context): String
```

Resolves this structured engine error to the customer-facing message to display. Looks up the authored ly_img_engine_error_<code> string resource for this exception's code, interpolating any {{name}} placeholders with the matching args, and falling back to the engine's English message when no copy is authored — so a surface never shows a blank or a raw code.
