# OnLoaded

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/OnLoaded`

A namespace for `onLoaded` callbacks.

```swift
enum OnLoaded
```

## Members

### Context.assetLibrary

```swift
@MainActor let assetLibrary: any AssetLibrary
```

The configured [`AssetLibrary`](../../../imglycoreui/assetlibrary.md).

### default

```swift
static let `default`: OnLoaded.Callback
```

The default empty callback.

### Context.engine

```swift
@MainActor let engine: Engine
```

The engine of the current editor.

### Context.eventHandler

```swift
@MainActor let eventHandler: any EditorEventHandler
```

The event handler of the current editor.

### OnLoaded.Callback

```swift
typealias Callback = @MainActor @Sendable (OnLoaded.Context) async throws -> Void
```

The callback type.

### OnLoaded.Context

```swift
@MainActor struct Context
```

The context of the [`OnLoaded.Callback`](callback.md).

### OnLoaded.Handler

```swift
typealias Handler = @MainActor @Sendable (OnLoaded.Context, () async throws -> Void) async throws -> Void
```

The handler type that receives an `existing` closure for chaining.

### Context.setVideoDurationConstraints(minimumVideoDuration:maximumVideoDuration:)

```swift
@MainActor func setVideoDurationConstraints(minimumVideoDuration: TimeInterval?, maximumVideoDuration: TimeInterval?)
```

Updates the minimum and maximum video duration constraints at runtime. `minimumVideoDuration`

### Context.task(_:)

```swift
@MainActor func task(_ operation: @escaping @MainActor @Sendable () async throws -> Void)
```

Registers async work that runs for the editor’s lifetime. `operation`
