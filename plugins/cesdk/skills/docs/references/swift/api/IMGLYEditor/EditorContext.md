# EditorContext

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/EditorContext`

A type for the context of [`EditorComponent`](editorcomponent.md)s.

```swift
protocol EditorContext
```

## Members

### EditorContext.SendableTo

> **Deprecated:** With Swift 6 @Sendable is inferred for global-actor-isolated functions and closures. Renamed to `To`.

```swift
typealias SendableTo<T> = Self.To<T>
```

A sendable closure that provides access to the context and returns a value.

### EditorContext.To

```swift
typealias To<T> = @MainActor @Sendable (Self) throws -> T
```

A closure that provides access to the context and returns a value.

### eventHandler

```swift
var eventHandler: any EditorEventHandler { get }
```

The event handler of the current editor.
