# TextDecorationConfig

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/TextDecorationConfig`

Configuration for text decorations on a text range.

```swift
struct TextDecorationConfig
```

## Members

### init(line:style:underlineColor:underlineThickness:underlineOffset:skipInk:)

```swift
init(line: TextDecorationLine = .none, style: TextDecorationStyle = .solid, underlineColor: Color? = nil, underlineThickness: Float = 1.0, underlineOffset: Float = 0.0, skipInk: Bool = true)
```

### line

```swift
var line: TextDecorationLine
```

The active decoration line types.

### skipInk

```swift
var skipInk: Bool
```

When true, underlines skip over glyph descenders (skip-ink). Defaults to true.

### style

```swift
var style: TextDecorationStyle
```

The visual style of the decoration lines.

### underlineColor

```swift
var underlineColor: Color?
```

Optional color override for underlines only. Uses the text color if nil. Overline and strikethrough always use the text color.

### underlineOffset

```swift
var underlineOffset: Float
```

Relative offset applied to the underline position as a multiplier on the font-default distance. The actual position is computed as `fontDefault * (1 + underlineOffset)`. 0 = font default, positive = proportionally further from baseline, negative = proportionally closer.

### underlineThickness

```swift
var underlineThickness: Float
```

Multiplier for the underline thickness.
