# CharacterInkBox

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CharacterInkBox`

Tight ink-paint bounding box of a single grapheme, in global scene coordinates (Y-down).

```swift
struct CharacterInkBox
```

## Members

### baselineY

```swift
let baselineY: Float
```

Global Y of the glyph baseline.

### height

```swift
let height: Float
```

Height of the tight ink rect.

### init(x:y:width:height:baselineY:)

```swift
init(x: Float, y: Float, width: Float, height: Float, baselineY: Float)
```

### width

```swift
let width: Float
```

Width of the tight ink rect.

### x

```swift
let x: Float
```

Global X of the left edge of the tight ink rect.

### y

```swift
let y: Float
```

Global Y of the top edge of the tight ink rect.
