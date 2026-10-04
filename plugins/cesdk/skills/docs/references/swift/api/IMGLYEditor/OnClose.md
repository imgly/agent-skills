# OnClose

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/OnClose`

A namespace for `onClose` callbacks.

```swift
enum OnClose
```

## Members

### default

```swift
static let `default`: OnClose.Callback
```

The default callback that displays the close confirmation alert if there are any unsaved changes, else closes the editor.

### OnClose.Callback

```swift
typealias Callback = @MainActor @Sendable (Engine, any EditorEventHandler) -> Void
```

The callback type.

### OnClose.Handler

```swift
typealias Handler = @MainActor @Sendable (Engine, any EditorEventHandler, () -> Void) -> Void
```

The handler type that receives an `existing` closure for chaining.
