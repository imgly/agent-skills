# AssetPayload

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetPayload`

Structured information about the contained asset.

```swift
@objcMembers final class AssetPayload
```

## Members

### color

```swift
let color: AssetColor?
```

### init(color:sourceSet:typeface:transformPreset:properties:stylePreset:)

```swift
init(color: AssetColor? = nil, sourceSet: [Source]? = nil, typeface: Typeface? = nil, transformPreset: AssetTransformPreset? = nil, properties: [AssetProperty]? = nil, stylePreset: String? = nil)
```

### init(from:)

```swift
convenience init(from decoder: any Decoder) throws
```

Custom decoder so that `stylePreset` — a JSON object in `content.json` — is captured opaquely and re-serialized to a `String`, while all other fields decode normally.

### isEqual(_:)

```swift
override func isEqual(_ object: Any?) -> Bool
```

### properties

```swift
let properties: [AssetProperty]?
```

### sourceSet

```swift
let sourceSet: [Source]?
```

### stylePreset

```swift
let stylePreset: String?
```

A declarative style preset carried as an opaque JSON document string. The engine parses and applies it; bindings pass it straight through without interpreting its contents.

### transformPreset

```swift
let transformPreset: AssetTransformPreset?
```

### typeface

```swift
let typeface: Typeface?
```
