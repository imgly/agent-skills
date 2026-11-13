# OnUpload

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/OnUpload`

A namespace for `onUpload` callbacks.

```swift
enum OnUpload
```

## Members

### default

```swift
static let `default`: OnUpload.Callback
```

The default callback which forwards the unmodified `AssetDefinition`.

### OnUpload.Callback

```swift
typealias Callback = @MainActor @Sendable (Engine, String, AssetDefinition) async throws -> AssetDefinition
```

The callback type.

### OnUpload.Handler

```swift
typealias Handler = @MainActor @Sendable (Engine, String, AssetDefinition, (AssetDefinition) async throws -> AssetDefinition) async throws -> AssetDefinition
```

The handler type that receives an `existing` closure for chaining. Call `existing` with the (potentially modified) asset to continue the chain.
