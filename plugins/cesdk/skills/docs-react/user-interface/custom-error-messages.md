> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Custom Error Messages](./user-interface/custom-error-messages.md)

---

When an engine operation fails—an unsupported file, an asset that can't be
applied, or an export—CE.SDK shows the error in a dialog. This guide shows you how to replace
that text with your own localized, brand-appropriate copy through the I18n API.

CE.SDK's engine emits **structured errors**. Every recoverable failure carries a stable `code` (for example `SCENE.NOT_VALID`), an English developer-facing message and hint, and typed arguments. The editor renders these in its error dialogs, and you override the customer-facing text by adding translations keyed off the error code. When you don't provide a translation, the editor falls back to the engine's English message—so a dialog is never blank.

This builds directly on the I18n API covered in [Localization](./user-interface/localization.md); if you haven't set up `cesdk.i18n` yet, start there.

## How CE.SDK Resolves Error Text

When the editor surfaces an engine error, it looks up an i18n key derived from the error's `code`. It tries your translation first and falls back to the engine's own English string:

1. `error.<code>` — your custom **headline**. Falls back to the engine's English `message`.
2. `error.<code>.description` — your custom **body**. Falls back to the engine's English `hint`.

Because the lookup always ends at the engine string, you only author copy for the errors you care about; everything else keeps a sensible default.

> **Note:** The headline and body fall back independently. If you override only `error.<code>` and leave `error.<code>.description` unset, the dialog pairs your headline with the engine's English hint as the body. To control the body, author `error.<code>.description` with your own copy. An empty string does **not** suppress it—CE.SDK treats an empty value as missing and falls back to the engine hint—so use non-empty text (even a single space) if you want no body.

## Deriving the Translation Key

The key is the error `code`, camel-cased into a single token prefixed with `error.`. Split the code on `.` and `_`, capitalize each segment, join them, then lowercase the first letter:

| Engine code | Headline key | Description key |
| --- | --- | --- |
| `SCENE.NOT_VALID` | `error.sceneNotValid` | `error.sceneNotValid.description` |
| `ASSET.UNSUPPORTED_MIME_TYPE_FOR_BLOCK` | `error.assetUnsupportedMimeTypeForBlock` | `error.assetUnsupportedMimeTypeForBlock.description` |
| `BLOCK.TEXT_INVALID_FONT_SIZE` | `error.blockTextInvalidFontSize` | `error.blockTextInvalidFontSize.description` |

For the complete list of error codes you can override, see the [Error Catalog](./concepts/error-catalog.md).

## Adding Custom Error Copy

Use `cesdk.i18n.setTranslations()` to register your copy. Error keys are flat, dotted strings—provide them exactly as shown, grouped by locale. You only need the keys you want to change; all other text keeps CE.SDK's defaults.

```typescript
cesdk.i18n.setTranslations({
  en: {
    'error.assetUnsupportedMimeTypeForBlock': 'Unsupported file type',
    'error.assetUnsupportedMimeTypeForBlock.description':
      "This file type isn't supported. Try a JPG, PNG, or MP4.",
    'error.assetCannotApplyColorNoTarget': 'Can’t apply color',
    'error.assetCannotApplyColorNoTarget.description':
      'Select an element with a fill, stroke, or text color first.'
  },
  de: {
    'error.assetUnsupportedMimeTypeForBlock': 'Nicht unterstützter Dateityp',
    'error.assetUnsupportedMimeTypeForBlock.description':
      'Dieser Dateityp wird nicht unterstützt. Versuchen Sie JPG, PNG oder MP4.',
    'error.assetCannotApplyColorNoTarget': 'Farbe kann nicht angewendet werden',
    'error.assetCannotApplyColorNoTarget.description':
      'Wählen Sie zuerst ein Element mit Füll-, Kontur- oder Textfarbe aus.'
  }
});
```

These translations live in the `custom` namespace and override the built-in defaults for the same keys. Register them once, right after you create the editor, so they're in place before any error can occur.

## Interpolating Error Details

Structured errors carry typed arguments—an unsupported MIME type, an invalid value, a block id. Reference them in your copy with i18next's `{{argument}}` placeholders, and the editor fills them in when it renders the dialog:

```typescript
cesdk.i18n.setTranslations({
  en: {
    'error.assetColorSpaceUnknown':
      'The color space "{{colorSpace}}" is not supported.'
  }
});
```

The available argument names for each code come from its catalog entry. You can inspect them on the thrown error: a `EngineError` exposes `error.code`, `error.args`, `error.hint`, and a `error.docsUrl` link to the relevant documentation page.

## Reusing the Resolver in Custom Error Handling

When you run engine operations yourself and want to show the same copy the built-in dialogs do, call `cesdk.i18n.localizedEngineErrorMessage(error)`. It returns the resolved `{ message, description }`—your authored `error.<code>` override for a structured error, falling back to the engine's English message and hint—so you don't reimplement the lookup. Plain errors return only a `description`, so a surface is never blank.

```typescript
try {
  await cesdk.engine.scene.loadFromURL(sceneUrl);
} catch (error) {
  const copy = cesdk.i18n.localizedEngineErrorMessage(error);
  showToast(copy?.message ?? copy?.description ?? 'Something went wrong.');
}
```

## Handling Errors Programmatically

To branch on a specific failure rather than just display copy, catch the `EngineError`, branch on its stable `code`, and resolve your own copy:

```typescript
import { EngineError, type EngineErrorCode } from '@cesdk/cesdk-js';

// Your own copy, keyed by the stable error code. Typing the keys with
// `EngineErrorCode` makes a misspelled code a compile-time error.
const messagesByCode: Partial<Record<EngineErrorCode, string>> = {
  'SCENE.NOT_VALID': 'This design could not be opened.'
};

try {
  await cesdk.engine.scene.loadFromURL(sceneUrl);
} catch (error) {
  if (error instanceof EngineError) {
    showToast(messagesByCode[error.code as EngineErrorCode] ?? error.message);
  } else {
    throw error;
  }
}
```

Branching on `error.code` rather than the message string keeps your handling stable across releases. The `EngineError` also exposes `error.hint`, `error.args`, and `error.docsUrl`. For the full per-binding contract, see [Migrate to Structured Errors](./to-v1-77.md).

## Verify Your Implementation

1. Register a translation for a code you can trigger, such as `error.assetUnsupportedMimeTypeForBlock`.
2. Reproduce the failure—drag in an unsupported file.
3. Confirm the dialog shows your headline and description.
4. Trigger an error you did **not** translate and confirm the dialog falls back to the engine's English message instead of going blank.

## Troubleshooting

### My Translation Doesn't Appear

Check the key derivation against the [Error Catalog](./concepts/error-catalog.md)—the key is the camel-cased `code` (for example `error.sceneNotValid`), and the body uses the `.description` suffix. To confirm the exact key for a given error, log `error.code` from your error handler and camel-case it: a `code` of `SCENE.NOT_VALID` becomes the key `error.sceneNotValid`.

### Copy Shows for the Wrong Locale

Translations are scoped per locale. Register the key under every locale you support, and make sure `cesdk.i18n.setLocale()` matches. See [Localization](./user-interface/localization.md) for managing locales.

### Arguments Aren't Filled In

Use the `{{argument}}` (double-brace) syntax and the exact argument name from the error's catalog entry. Inspect `error.args` on the thrown `EngineError` to confirm which names are available.

## Related

- [Localization](./user-interface/localization.md) — Manage locales and translate the rest of the editor interface.
- [Migrate to Structured Errors](./to-v1-77.md) — Branch on stable error codes instead of matching message strings.
- [Error Catalog](./concepts/error-catalog.md) — Every engine error code, its message, and its hint.
- [Notifications and Dialogs](./user-interface/ui-extensions/notifications-and-dialogs.md) — Show your own notifications and dialogs from the editor.



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support