# VariableAPI

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VariableAPI`

```swift
@MainActor final class VariableAPI
```

## Members

### findAll()

```swift
@MainActor func findAll() -> [String]
```

Get all text variables currently stored in the engine. Return a list of variable names.

### get(key:)

```swift
@MainActor func get(key: String) throws -> String
```

Get a text variable. `key`

### remove(key:)

```swift
@MainActor func remove(key: String) throws
```

Destroy a text variable. `key`

### set(key:value:)

```swift
@MainActor func set(key: String, value: String) throws
```

Set a text variable. `key`
