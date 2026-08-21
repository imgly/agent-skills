# Color

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/Color`

```swift
enum Color
```

## Members

### cgColor

```swift
var cgColor: CGColor? { get }
```

### Color.cmyk(c:m:y:k:tint:)

```swift
case cmyk(c: Float, m: Float, y: Float, k: Float, tint: Float = 1)
```

### Color.rgba(r:g:b:a:)

```swift
case rgba(r: Float, g: Float, b: Float, a: Float = 1)
```

### Color.spot(name:tint:externalReference:)

```swift
case spot(name: String, tint: Float = 1, externalReference: String = "")
```

### colorSpace

```swift
var colorSpace: ColorSpace { get }
```

### init(cgColor:)

```swift
init?(cgColor: CGColor)
```

`cgColor` A `CGColor` in `sRGB` or `genericCMYK` color space. Any other color space will be converted to `sRGB`.

### init(from:)

```swift
init(from decoder: any Decoder) throws
```

### init(uiColor:)

```swift
init?(uiColor: UIColor)
```

`uiColor` An `UIColor` in `sRGB` or `genericCMYK` color space. Any other color space will be converted to `sRGB`.

### uiColor

```swift
var uiColor: UIColor? { get }
```
