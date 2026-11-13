# VariationAxisValue

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VariationAxisValue`

A value for one variation axis of a variable font, such as `wdth` or `opsz`.

```swift
struct VariationAxisValue
```

## Members

### init(tag:value:)

```swift
init(tag: String, value: Float)
```

### tag

```swift
let tag: String
```

The four-character OpenType axis tag, such as `wght`, `wdth` or `opsz`.

### value

```swift
let value: Float
```

The axis value in the units of the font’s `fvar` table. The font clamps it to the range of the axis.
