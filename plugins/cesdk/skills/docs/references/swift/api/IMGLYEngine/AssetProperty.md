# AssetProperty

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetProperty`

```swift
enum AssetProperty
```

## Members

### AssetProperty.boolean(property:value:defaultValue:)

```swift
case boolean(property: String, value: Bool, defaultValue: Bool)
```

### AssetProperty.color(property:value:defaultValue:)

```swift
case color(property: String, value: Color, defaultValue: Color)
```

### AssetProperty.double(property:value:defaultValue:min:max:step:)

```swift
case double(property: String, value: Double, defaultValue: Double, min: Double, max: Double, step: Double)
```

### AssetProperty.enum(property:value:defaultValue:options:)

```swift
case `enum`(property: String, value: String, defaultValue: String, options: [String])
```

### AssetProperty.float(property:value:defaultValue:min:max:step:)

```swift
case float(property: String, value: Float, defaultValue: Float, min: Float, max: Float, step: Float)
```

### AssetProperty.int(property:value:defaultValue:min:max:step:)

```swift
case int(property: String, value: Int32, defaultValue: Int32, min: Int32, max: Int32, step: Int32)
```

### AssetProperty.string(property:value:defaultValue:)

```swift
case string(property: String, value: String, defaultValue: String)
```

### init(from:)

```swift
init(from decoder: any Decoder) throws
```
