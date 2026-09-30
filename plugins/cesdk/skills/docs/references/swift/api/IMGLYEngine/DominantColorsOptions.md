# DominantColorsOptions

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/DominantColorsOptions`

```swift
@objcMembers final class DominantColorsOptions
```

## Members

### count

```swift
let count: Int
```

Number of dominant colors to extract. The returned palette may contain fewer entries for images with very little variation, and is empty when `count` is `0`.

### ignoreWhite

```swift
let ignoreWhite: Bool
```

If `true`, near-white pixels are excluded from the analysis. Useful when analyzing images on white backgrounds to avoid the background dominating the result.

### init(count:ignoreWhite:)

```swift
init(count: Int = 5, ignoreWhite: Bool = false)
```
