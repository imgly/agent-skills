# TextLayoutDiagnostics

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/TextLayoutDiagnostics`

Planar text layout before strokes, effects, animations, and block transforms.

```swift
struct TextLayoutDiagnostics
```

## Members

### clippedLineCount

```swift
let clippedLineCount: Int
```

Lines hidden by the authored clipping setting, independent of text editing.

### fontScale

```swift
let fontScale: Float
```

Common automatic font-size multiplier; 1 when automatic sizing did not scale the text.

### init(overshoot:totalLineCount:visibleLineCount:clippedLineCount:requiredHeight:fontScale:)

```swift
init(overshoot: TextOvershoot, totalLineCount: Int, visibleLineCount: Int, clippedLineCount: Int, requiredHeight: Float, fontScale: Float)
```

### overshoot

```swift
let overshoot: TextOvershoot
```

Nonnegative ink outside each frame edge, including ink of clipped lines.

### requiredHeight

```swift
let requiredHeight: Float
```

Full layout height at the current wrap width and fitted sizes, in scene design units.

### totalLineCount

```swift
let totalLineCount: Int
```

All laid-out lines, including lines hidden by the frame.

### visibleLineCount

```swift
let visibleLineCount: Int
```

Lines visible with the authored clipping setting, independent of text editing.
