# TextRunInfo

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/TextRunInfo`

Represents a single contiguous text run with uniform formatting. Each run covers a contiguous range of grapheme clusters `[from, to)` within a text block.

```swift
struct TextRunInfo
```

## Members

### color

```swift
var color: Color
```

The text color.

### fontSize

```swift
var fontSize: Float
```

The font size in points.

### fontStyle

```swift
var fontStyle: FontStyle
```

The font style.

### fontWeight

```swift
var fontWeight: FontWeight
```

The font weight.

### from

```swift
var from: Int
```

Start grapheme index (inclusive).

### init(from:to:text:color:fontWeight:fontStyle:fontSize:textCase:typeface:resolvedFontFileURL:textDecoration:kerning:)

```swift
init(from: Int, to: Int, text: String, color: Color, fontWeight: FontWeight, fontStyle: FontStyle, fontSize: Float, textCase: TextCase, typeface: Typeface, resolvedFontFileURL: URL, textDecoration: TextDecorationConfig = TextDecorationConfig(), kerning: Float = 0.0)
```

### kerning

```swift
var kerning: Float
```

Additional kerning offset in em units.

### resolvedFontFileURL

```swift
var resolvedFontFileURL: URL
```

The resolved font file URI.

### text

```swift
var text: String
```

The text content of this run.

### textCase

```swift
var textCase: TextCase
```

The text case transformation.

### textDecoration

```swift
var textDecoration: TextDecorationConfig
```

The text decoration configuration of this run.

### to

```swift
var to: Int
```

End grapheme index (exclusive).

### typeface

```swift
var typeface: Typeface
```

The typeface used by this run.
