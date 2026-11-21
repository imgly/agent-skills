# CustomShaderProgramDefinition

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CustomShaderProgramDefinition`

Shared GLSL ES source and ordered mainImage passes; excludes GPU resources and feedback.

```swift
@objcMembers final class CustomShaderProgramDefinition
```

## Members

### commonSource

```swift
let commonSource: String
```

### init(commonSource:passes:)

```swift
init(commonSource: String = "", passes: [CustomShaderPassDefinition] = [])
```

### isEqual(_:)

```swift
override func isEqual(_ object: Any?) -> Bool
```

### passes

```swift
let passes: [CustomShaderPassDefinition]
```
