# DominantColor

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/DominantColor`

```swift
@objcMembers final class DominantColor
```

## Members

### b

```swift
let b: Float
```

Blue component in sRGB, normalized to the range [0, 1].

### g

```swift
let g: Float
```

Green component in sRGB, normalized to the range [0, 1].

### init(r:g:b:weight:)

```swift
init(r: Float, g: Float, b: Float, weight: Float)
```

### r

```swift
let r: Float
```

Red component in sRGB, normalized to the range [0, 1].

### weight

```swift
let weight: Float
```

Share of analyzed pixels represented by this color, in [0, 1]. Higher values indicate a more prominent color. The sum of weights returned by a single `BlockAPI.getDominantColors` call is `1`.
