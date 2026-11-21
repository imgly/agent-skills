# CustomShaderPassDefinition

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CustomShaderPassDefinition`

One ordered pass. The last pass must be named Image. Use two zero dimensions for evaluation size. Supply up to four channels. Missing channels are empty; queries always return four channels. RGB-only mainImage output defaults to alpha 1. Explicit alpha writes are preserved.

```swift
@objcMembers final class CustomShaderPassDefinition
```

## Members

### channels

```swift
let channels: [CustomShaderChannelDefinition]
```

### format

```swift
let format: CustomShaderFormat
```

### height

```swift
let height: UInt32
```

### init(name:source:channels:format:width:height:)

```swift
init(name: String = "", source: String = "", channels: [CustomShaderChannelDefinition] = Array(repeating: CustomShaderChannelDefinition(), count: 4), format: CustomShaderFormat = .rgba16Float, width: UInt32 = 0, height: UInt32 = 0)
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
let source: String
```

### width

```swift
let width: UInt32
```
