# OnCreate

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/OnCreate`

A namespace for `onCreate` callbacks.

```swift
enum OnCreate
```

## Members

### applyBaseSettings

```swift
static let applyBaseSettings: OnCreate.Callback
```

Applies base engine settings that are common across all editor solutions. This includes role, editor settings, camera clamping, touch settings, and global scopes.

### default

```swift
static let `default`: OnCreate.Callback
```

The default callback which creates a new scene.

### loadScene(from:)

```swift
static func loadScene(from url: URL) -> OnCreate.Callback
```

Creates a callback that loads a scene. `url`

### OnCreate.Callback

```swift
typealias Callback = @MainActor @Sendable (Engine) async throws -> Void
```

The callback type.

### OnCreate.Handler

```swift
typealias Handler = @MainActor @Sendable (Engine, () async throws -> Void) async throws -> Void
```

The handler type that receives an `existing` closure for chaining.
