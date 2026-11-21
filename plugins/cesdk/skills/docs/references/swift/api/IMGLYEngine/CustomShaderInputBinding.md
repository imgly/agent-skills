# CustomShaderInputBinding

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CustomShaderInputBinding`

An existing image fill, video fill or audio block bound to a named shader input.

```swift
@objcMembers final class CustomShaderInputBinding
```

## Members

### init(name:source:)

```swift
init(name: String = "", source: DesignBlockID = .max)
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
let source: DesignBlockID
```
