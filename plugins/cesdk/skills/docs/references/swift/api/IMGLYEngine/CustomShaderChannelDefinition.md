# CustomShaderChannelDefinition

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CustomShaderChannelDefinition`

A channel referencing a named input, current pass or previous-frame pass.

```swift
@objcMembers final class CustomShaderChannelDefinition
```

## Members

### filter

```swift
let filter: CustomShaderFilter
```

### init(source:name:filter:wrap:)

```swift
init(source: CustomShaderChannelSource = .empty, name: String = "", filter: CustomShaderFilter = .linear, wrap: CustomShaderWrap = .clamp)
```

### isEqual(_:)

```swift
override func isEqual(_ object: Any?) -> Bool
```

### name

```swift
let name: String
```

### source

```swift
let source: CustomShaderChannelSource
```

### wrap

```swift
let wrap: CustomShaderWrap
```
