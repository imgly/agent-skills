# IMGLYEngine

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/IMGLYEngine`

## Members

### EngineError.displayDescription

```swift
var displayDescription: String? { get }
```

The customer-facing body copy to display below [`displayMessage`](displaymessage.md) for this engine error, or `nil` when there is nothing to show. The longer-form companion to [`displayMessage`](displaymessage.md), mirroring the web resolver’s `description` half and the engine’s own message/hint split. It looks up the authored `ly_img_engine_error_<code>_description` string in the `IMGLYEngine` catalog through the same localization cascade — your app’s main bundle first, so integrators can override — interpolating any `{{name}}` placeholders with the matching `args`, and falling back to the engine’s English `hint` when no copy is authored. Returns `nil` when no copy is authored and the cat…

### EngineError.displayMessage

```swift
var displayMessage: String { get }
```

The customer-facing message to display for this engine error. This resolves the same copy CE.SDK’s built-in error dialogs show, so you can reuse it in your own error handling without reimplementing the lookup. It looks up the authored `ly_img_engine_error_<code>` string in the `IMGLYEngine` string catalog through the same localization cascade as every other editor string (`LocalizationTable.localizedStringIfPresent(forKey:)`) — your app’s main bundle first, so integrators can override — interpolating any `{{name}}` placeholders with the matching `args`, and falling back to the engine’s English `message` when no copy is authored, so a surface never shows a blank or a raw `code`.

### EngineError

```swift
extension EngineError
```
