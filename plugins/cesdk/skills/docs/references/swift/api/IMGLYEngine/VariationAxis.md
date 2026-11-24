# VariationAxis

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VariationAxis`

A variation axis of a variable font, read from its `fvar` table.

```swift
struct VariationAxis
```

## Members

### defaultValue

```swift
let defaultValue: Float
```

The value of the axis in the default instance of the font.

### init(tag:minValue:defaultValue:maxValue:)

```swift
init(tag: String, minValue: Float, defaultValue: Float, maxValue: Float)
```

### maxValue

```swift
let maxValue: Float
```

The largest value of the axis.

### minValue

```swift
let minValue: Float
```

The smallest value of the axis.

### tag

```swift
let tag: String
```

The four-letter OpenType axis tag, such as `wght`, `wdth` or `ital`.
