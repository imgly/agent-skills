> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [User Interface](../user-interface.md) > [Custom Error Messages](./custom-error-messages.md)

---

When an engine operation fails—an unsupported file, an asset that can't be
applied, or an export—CE.SDK surfaces the error to the user. This guide shows you how to replace
that text with your own localized, brand-appropriate copy through Android string
resources, and how to reuse the same resolved copy in your own error handling.

CE.SDK's engine emits **structured errors**. Every recoverable failure carries a stable `code` (for example `SCENE.NOT_VALID`), an English developer-facing message and hint, and typed arguments. The editor surfaces these to the user—a fatal failure such as an invalid scene in a blocking dialog, a recoverable one such as an asset that can't be applied in a transient notice—and you override the customer-facing text by adding a string resource keyed off the error code. When you don't provide one, the editor falls back to the engine's English message—so the message is never blank.

## How CE.SDK Resolves Error Text

When the editor surfaces an engine error, it looks up a string resource derived from the error's `code`. It uses your resource when present and falls back to the engine's own English string otherwise:

1. `ly_img_engine_error_<code>` — your custom copy.
2. The engine's English `message` (or `hint`) — the fallback when no resource is authored.

Because the lookup always ends at the engine string, you only author copy for the errors you care about; everything else keeps a sensible default.

## Deriving the Resource Name

The resource name is the error `code`, lowercased, with each `.` replaced by `_` and prefixed with `ly_img_engine_error_`:

| Engine code | String resource name |
| --- | --- |
| `SCENE.NOT_VALID` | `ly_img_engine_error_scene_not_valid` |
| `ASSET.UNSUPPORTED_MIME_TYPE_FOR_BLOCK` | `ly_img_engine_error_asset_unsupported_mime_type_for_block` |
| `BLOCK.TEXT_INVALID_FONT_SIZE` | `ly_img_engine_error_block_text_invalid_font_size` |

Each code also has an optional **description** companion resource—the same name with a `_description` suffix—for the longer "what to do next" body copy that complements the short headline. It resolves the same way and falls back to the engine's English `hint`:

| Engine code | Description resource name |
| --- | --- |
| `SCENE.NOT_VALID` | `ly_img_engine_error_scene_not_valid_description` |
| `ASSET.UNSUPPORTED_MIME_TYPE_FOR_BLOCK` | `ly_img_engine_error_asset_unsupported_mime_type_for_block_description` |

For the complete list of error codes you can override, see the [Error Catalog](../concepts/error-catalog.md).

## Adding Custom Error Copy

Add the string resources to your app's own resource files. Provide a value for each locale you support; Android selects the right one based on the device language.

```xml

<resources>
    <string name="ly_img_engine_error_asset_unsupported_mime_type_for_block">Unsupported file type</string>
    <string name="ly_img_engine_error_asset_cannot_apply_color_no_target">Select an element with a color first</string>
</resources>
```

```xml

<resources>
    <string name="ly_img_engine_error_asset_unsupported_mime_type_for_block">Nicht unterstützter Dateityp</string>
    <string name="ly_img_engine_error_asset_cannot_apply_color_no_target">Wähle zuerst ein Element mit Farbe aus</string>
</resources>
```

You only need the resources you want to change; all other text keeps CE.SDK's defaults.

## Interpolating Error Details

Structured errors carry typed arguments—an unsupported MIME type, an invalid value, a block id. Reference them in your copy with `{{argument}}` placeholders, and the editor fills them in from the error's `args` when it surfaces the error:

```xml

<string name="ly_img_engine_error_asset_unsupported_mime_type_for_block">Unsupported file type ({{mimeType}})</string>
```

The available argument names for each code come from its catalog entry. Inspect `EngineException.args` on the thrown error to confirm which names are available; a placeholder with no matching argument is left untouched.

These placeholders use the `{{argName}}` i18next-style syntax, **not** Android's native positional format specifiers (`%1$s`, `%d`). The resolver reads the resource with the no-argument `Context.getString(resId)` and substitutes the `{{name}}` tokens itself—it never calls the `getString(resId, formatArgs)` overload or `getQuantityString`—so Android's native `String.format` arguments and `<plurals>` quantity strings do not apply to these resources. If you override a resource the Android-native way (`%1$s` plus format arguments), the user sees a literal `%1$s`. This is a deliberate split from the editor's other resources: the `ly_img_editor_*` strings (titles, labels, dialogs) use native `%s`/`%d` specifiers and are read with the `getString(resId, formatArgs)` overload, while the `ly_img_engine_*` error strings use `{{name}}` tokens and are read with no-argument `getString(resId)`. Both conventions live side by side in the same `strings.xml`, so apply `{{name}}` only to the `ly_img_engine_*` overrides.

## Reusing the Resolver in Custom Error Handling

When you handle errors yourself through the editor's `onError` callback, resolve the same copy the built-in dialogs show with the `EngineException.getDisplayMessage(context)` extension. Cast the thrown error to `EngineException` first; it returns your authored resource for a structured error, falling back to the engine's English message—so you never show a blank or a raw code. For errors that aren't an `EngineException`, keep your own fallback.

Pair it with `getDisplayDescription(context)` for the longer body copy. It resolves your authored `_description` resource, falls back to the engine's English `hint`, and is `null` when neither exists—so you can show a two-line message and omit the body when there's nothing to add.

`EditorConfiguration.remember` must be called inside the `Editor` composable's `configuration` lambda, and `LocalContext.current` only resolves in a composable. Read the context in your composable and pass it into the `onError` handler:

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import ly.img.editor.BasicConfigurationBuilder
import ly.img.editor.Editor
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.getDisplayDescription
import ly.img.editor.core.getDisplayMessage
import ly.img.engine.EngineException

@Composable
fun MyEditor(onClose: (Throwable?) -> Unit) {
    val context = LocalContext.current
    Editor(
        license = "YOUR_CESDK_LICENSE_KEY",
        configuration = {
            EditorConfiguration.remember(::BasicConfigurationBuilder) {
                onError = { error ->
                    val engineError = error as? EngineException
                    val message = engineError?.getDisplayMessage(context) ?: error.message
                    val description = engineError?.getDisplayDescription(context)
                    val docsUrl = engineError?.docsUrl
                    // Show your own snackbar or dialog with `message` and the optional
                    // `description`, optionally linking `docsUrl`.
                }
            }
        },
        onClose = onClose,
    )
}
```

## Handling Errors Programmatically

To branch on a specific failure rather than just display copy, cast to `EngineException` and switch on its stable `code`. Branching on the code rather than the message keeps your handling stable across releases.

```kotlin
import ly.img.engine.EngineErrorCode
import ly.img.engine.EngineException

onError = { error ->
    when ((error as? EngineException)?.code) {
        EngineErrorCode.SCENE_NOT_VALID ->
            showRecoveryPrompt()
        else ->
            showGenericError((error as? EngineException)?.getDisplayMessage(context) ?: error.message.orEmpty())
    }
}
```

`EngineException` also exposes `hint`, `args`, and `docsUrl` so you can enrich your own UI.

## Verify Your Implementation

1. Add a resource for a code you can trigger, such as `ly_img_engine_error_asset_unsupported_mime_type_for_block`.
2. Reproduce the failure—drag in an unsupported file.
3. Confirm the editor shows your copy.
4. Trigger an error you did **not** author and confirm it falls back to the engine's English message instead of going blank.

## Related

- [Error Catalog](../concepts/error-catalog.md) — Every engine error code, its message, and its hint.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support