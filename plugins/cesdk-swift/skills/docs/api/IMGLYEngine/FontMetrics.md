# FontMetrics

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/FontMetrics`

Font metrics extracted from a font file in raw font design units.

```swift
struct FontMetrics
```

## Members

### ascender

```swift
let ascender: Float
```

The ascender value in font design units.

### capHeight

```swift
let capHeight: Float
```

The OS/2 sCapHeight value in font design units.

### descender

```swift
let descender: Float
```

The descender value in font design units.

### init(ascender:descender:unitsPerEm:lineGap:capHeight:xHeight:underlineOffset:underlineSize:strikeoutOffset:strikeoutSize:)

```swift
init(ascender: Float, descender: Float, unitsPerEm: Float, lineGap: Float, capHeight: Float, xHeight: Float, underlineOffset: Float, underlineSize: Float, strikeoutOffset: Float, strikeoutSize: Float)
```

### lineGap

```swift
let lineGap: Float
```

The OS/2 sTypoLineGap value in font design units.

### strikeoutOffset

```swift
let strikeoutOffset: Float
```

The OS/2 yStrikeoutPosition value in font design units.

### strikeoutSize

```swift
let strikeoutSize: Float
```

The OS/2 yStrikeoutSize value in font design units.

### underlineOffset

```swift
let underlineOffset: Float
```

The post.underlinePosition value in font design units (typically negative).

### underlineSize

```swift
let underlineSize: Float
```

The post.underlineThickness value in font design units.

### unitsPerEm

```swift
let unitsPerEm: Float
```

The number of units per em square.

### xHeight

```swift
let xHeight: Float
```

The OS/2 sxHeight value in font design units.
