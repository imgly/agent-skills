> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [User Interface](../user-interface.md) > [Custom Error Messages](./custom-error-messages.md)

---

When an engine operation fails—an unsupported file, an asset that can't be
applied, or an export—CE.SDK surfaces the error to the user. This guide shows you how to replace
that text with your own localized, brand-appropriate copy through a string
catalog, and how to reuse the same resolved copy in your own error handling.

CE.SDK's engine emits **structured errors**. Every recoverable failure carries a stable `code` (for example `SCENE.NOT_VALID`), an English developer-facing message and hint, and typed arguments. The editor surfaces these to the user—a fatal failure such as an invalid scene in a blocking dialog, a recoverable one such as an asset that can't be applied in a transient notice—and you override the customer-facing text by adding a localized string keyed off the error code. When you don't provide one, the editor falls back to the engine's English message—so the message is never blank.

## How CE.SDK Resolves Error Text

When the editor surfaces an engine error, it derives a key from the error's `code` and resolves it through the same localization cascade as every other editor string—checking your app first, so your copy always wins, then the SDK's own bundle, and finally falling back to the engine's English string:

1. `ly_img_engine_error_<code>` in **your** app's default `Localizable` catalog — your custom copy.
2. The same key in **your** app's `IMGLYEngine` catalog — your custom copy.
3. The same key in the SDK's `IMGLYEngine` catalog, then the engine's English `message` — the fallbacks.

Both your `Localizable` and `IMGLYEngine` entries take precedence over the SDK default, so you can override error copy with whichever catalog you already use for the rest of the editor. A dedicated `IMGLYEngine` catalog keeps error copy separate from your other strings, so the rest of this guide uses it. Because the lookup always ends at the engine string, you only author copy for the errors you care about; everything else keeps a sensible default.

## Deriving the Key

The key is the error `code`, lowercased, with each `.` replaced by `_` and prefixed with `ly_img_engine_error_`:

| Engine code | String catalog key |
| --- | --- |
| `SCENE.NOT_VALID` | `ly_img_engine_error_scene_not_valid` |
| `ASSET.UNSUPPORTED_MIME_TYPE_FOR_BLOCK` | `ly_img_engine_error_asset_unsupported_mime_type_for_block` |
| `BLOCK.TEXT_INVALID_FONT_SIZE` | `ly_img_engine_error_block_text_invalid_font_size` |

Each code also has an optional **description** companion key—the same key with a `_description` suffix—for the longer "what to do next" body copy. The editor's built-in dialog shows only the headline (`displayMessage`); read this body copy yourself with `displayDescription` (see below) when you present your own alert. It resolves through the same cascade and falls back to the engine's English `hint`, and is `nil` when neither is authored:

| Engine code | Description key |
| --- | --- |
| `SCENE.NOT_VALID` | `ly_img_engine_error_scene_not_valid_description` |
| `ASSET.UNSUPPORTED_MIME_TYPE_FOR_BLOCK` | `ly_img_engine_error_asset_unsupported_mime_type_for_block_description` |

For the complete list of error codes you can override, see the [Error Catalog](../concepts/error-catalog.md).

## Adding Custom Error Copy

Add a **String Catalog** named `IMGLYEngine` (`IMGLYEngine.xcstrings`) to your app target, then add an entry for each key you want to override and fill in the value for every language you support. Because CE.SDK checks your main bundle first, your entries take precedence over the defaults. If you'd rather keep all your copy in one place, add the same keys to your default `Localizable.xcstrings` instead—the editor honors them first.

```swift
// IMGLYEngine.xcstrings (your app target), shown as key → value:
// "ly_img_engine_error_asset_unsupported_mime_type_for_block"
//     en → "Unsupported file type"
//     de → "Nicht unterstützter Dateityp"
// "ly_img_engine_error_asset_cannot_apply_color_no_target"
//     en → "Select an element with a color first"
//     de → "Wähle zuerst ein Element mit Farbe aus"
```

You only need the keys you want to change; all other text keeps CE.SDK's defaults.

## Interpolating Error Details

Structured errors carry typed arguments—an unsupported MIME type, an invalid value, a block id. Reference them in your copy with `{{argument}}` placeholders, and the editor fills them in from the error's `args` when it surfaces the error:

```swift
// IMGLYEngine.xcstrings (your app target), shown as key → value:
// "ly_img_engine_error_asset_unsupported_mime_type_for_block"
//     en → "Unsupported file type ({{mimeType}})"
//     de → "Nicht unterstützter Dateityp ({{mimeType}})"
```

The available argument names for each code come from its catalog entry. Inspect `EngineError.args` on the thrown error to confirm which names are available; a placeholder with no matching argument is left untouched.

These placeholders use the `{{argName}}` i18next-style syntax, **not** Apple's native `%@`/`%lld` format specifiers. The resolver reads the raw catalog string and substitutes the `{{name}}` tokens itself—it never calls `String(format:)`—so the String Catalog's native substitutions and plural variations do not apply to these keys. If you override a key the Apple-native way (`%@` plus arguments), the user sees a literal `%@`. This diverges from the sibling `IMGLYEditor.xcstrings` catalog, which uses native `%@`/`%lld` specifiers.

## Reusing the Resolver in Custom Error Handling

When you handle errors yourself through the editor's `onError` callback, resolve the same copy the built-in dialogs show with `EngineError(error)?.displayMessage`. It returns your authored string for a structured error, falling back to the engine's English message—so you never show a blank or a raw code. `EngineError(_:)` is `nil` for errors from other domains, so keep your own fallback for those.

Pair it with `displayDescription` for the longer body copy. It resolves your authored `_description` key, falls back to the engine's English `hint`, and is `nil` when neither exists—so you can present a two-line alert and omit the body when there's nothing to add.

```swift
import IMGLYEditor
import IMGLYEngine

Editor(settings)
  .imgly.configuration {
    DesignEditorConfiguration { builder in
      builder.onError { error, eventHandler, _ in
        let title = EngineError(error)?.displayMessage
          ?? error.localizedDescription
        let body = EngineError(error)?.displayDescription
        // Present your own alert with `title` and the optional `body`, or send
        // `.showErrorAlert(error)` through the `eventHandler` to keep the built-in dialog.
      }
    }
  }
```

## Handling Errors Programmatically

To branch on a specific failure rather than just display copy, wrap the error with `EngineError` and switch on its stable `catalogCode`. Branching on the code rather than `localizedDescription` keeps your handling stable across releases.

```swift
import IMGLYEngine

if let engineError = EngineError(error) {
  switch engineError.catalogCode {
  case .sceneNotValid:
    showRecoveryPrompt()
  default:
    showGenericError(engineError.displayMessage)
  }
  // engineError.docsURL links the relevant documentation page.
}
```

`EngineError` also exposes `hint`, `args`, and `docsURL` so you can enrich your own UI.

## Verify Your Implementation

1. Add an `IMGLYEngine` entry for a code you can trigger, such as `ly_img_engine_error_asset_unsupported_mime_type_for_block`.
2. Reproduce the failure—drag in an unsupported file.
3. Confirm the editor shows your copy.
4. Trigger an error you did **not** author and confirm it falls back to the engine's English message instead of going blank.

## Related

- [Error Catalog](../concepts/error-catalog.md) — Every engine error code, its message, and its hint.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support