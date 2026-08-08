# EditorEventHandler

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/EditorEventHandler`

An interface for sending [`EditorEvent`](editorevent.md)s.

```swift
@MainActor protocol EditorEventHandler
```

## Members

### send(_:)

```swift
@MainActor func send(_ event: any EditorEvent)
```

A function for sending [`EditorEvent`](../editorevent.md)s. `event`
