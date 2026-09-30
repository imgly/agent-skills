> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/flutter/guides-8d8b00/) > [User Interface](https://img.ly/docs/cesdk/flutter/user-interface-5a089a/) > [Custom Error Messages](./custom-error-messages.md)

---

When an engine operation fails—an unsupported file, an asset that can't be
applied, or an export—CE.SDK shows the error in a dialog. The Flutter editor renders this
dialog through the native iOS and Android editors, so you customize the copy by
overriding the native string resources in your app's platform projects.

CE.SDK's engine emits **structured errors**. Every recoverable failure carries a stable `code` (for example `SCENE.NOT_VALID`), and the native editor renders it in an error dialog. You override the customer-facing text by adding a localized string keyed off the error code in each platform project. When you don't provide one, the editor falls back to the engine's English message—so a dialog is never blank.

## Deriving the Key

The key is the error `code`, lowercased, with each `.` replaced by `_` and prefixed with `ly_img_engine_error_`. The same name is used on both platforms:

| Engine code | Resource key |
| --- | --- |
| `SCENE.NOT_VALID` | `ly_img_engine_error_scene_not_valid` |
| `ASSET.UNSUPPORTED_MIME_TYPE_FOR_BLOCK` | `ly_img_engine_error_asset_unsupported_mime_type_for_block` |
| `BLOCK.TEXT_INVALID_FONT_SIZE` | `ly_img_engine_error_block_text_invalid_font_size` |

For the complete list of error codes you can override, see the [Error Catalog](../concepts/error-catalog.md).

## Android

Add the string resources to your app's Android project. The native editor reads them from your app's resources, so your copy takes precedence over the defaults.

```xml

<resources>
    <string name="ly_img_engine_error_asset_unsupported_mime_type_for_block">Unsupported file type</string>
</resources>
```

```xml

<resources>
    <string name="ly_img_engine_error_asset_unsupported_mime_type_for_block">Nicht unterstützter Dateityp</string>
</resources>
```

## iOS

Add a **String Catalog** named `IMGLYEngine` (`IMGLYEngine.xcstrings`) to your `Runner` target in `ios/Runner`, then add an entry for each key and fill in the value for every language you support. The native editor checks your app's main bundle first, so your entries take precedence.

```swift
// ios/Runner/IMGLYEngine.xcstrings, shown as key → value:
// "ly_img_engine_error_asset_unsupported_mime_type_for_block"
//     en → "Unsupported file type"
//     de → "Nicht unterstützter Dateityp"
```

You only need the keys you want to change on each platform; all other text keeps CE.SDK's defaults.

## Interpolating Error Details

Structured errors carry typed arguments—an unsupported MIME type, an invalid value, a block id. Reference them in your copy with `{{argument}}` placeholders on either platform, and the native editor fills them in from the error's `args` when it renders the dialog:

```xml

<string name="ly_img_engine_error_asset_unsupported_mime_type_for_block">Unsupported file type ({{mimeType}})</string>
```

The available argument names for each code come from its catalog entry; see the [Error Catalog](../concepts/error-catalog.md). A placeholder with no matching argument is left untouched.

## Verify Your Implementation

1. Add a resource for a code you can trigger, such as `ly_img_engine_error_asset_unsupported_mime_type_for_block`, on the platform you're testing.
2. Reproduce the failure—drag in an unsupported file.
3. Confirm the dialog shows your copy.
4. Trigger an error you did **not** author and confirm the dialog falls back to the engine's English message instead of going blank.

## Related

- [Error Catalog](../concepts/error-catalog.md) — Every engine error code, its message, and its hint.



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support