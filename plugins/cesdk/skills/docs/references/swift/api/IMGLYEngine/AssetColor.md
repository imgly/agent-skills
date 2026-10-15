# AssetColor

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetColor`

```swift
enum AssetColor
```

## Members

### AssetColor.cmyk(c:m:y:k:)

```swift
case cmyk(c: Float, m: Float, y: Float, k: Float)
```

### AssetColor.rgb(r:g:b:)

```swift
case rgb(r: Float, g: Float, b: Float)
```

### AssetColor.spot(name:externalReference:representation:)

```swift
case spot(name: String, externalReference: String = "", representation: AssetSpotColorRepresentation)
```

### init(from:)

```swift
init(from decoder: any Decoder) throws
```
