# OnError

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/OnError`

A namespace for `onError` callbacks.

```swift
enum OnError
```

## Members

### default

```swift
static let `default`: OnError.Callback
```

The default callback that displays the error alert.

### OnError.Callback

```swift
typealias Callback = @MainActor @Sendable (any Error, any EditorEventHandler) -> Void
```

The callback type.

### OnError.Handler

```swift
typealias Handler = @MainActor @Sendable (any Error, any EditorEventHandler, () -> Void) -> Void
```

The handler type that receives an `existing` closure for chaining.
