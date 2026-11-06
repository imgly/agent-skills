# TextLayoutDiagnostics

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Planar text layout before strokes, effects, animations, and block transforms.

```kotlin
data class TextLayoutDiagnostics(val overshoot: TextOvershoot, val totalLineCount: Int, val visibleLineCount: Int, val clippedLineCount: Int, val requiredHeight: Float, val fontScale: Float)
```


## Members

### TextLayoutDiagnostics

```kotlin
constructor(overshoot: TextOvershoot, totalLineCount: Int, visibleLineCount: Int, clippedLineCount: Int, requiredHeight: Float, fontScale: Float)
```

### clippedLineCount

```kotlin
val clippedLineCount: Int
```

Lines hidden by the authored clipping setting, independent of text editing.

### fontScale

```kotlin
val fontScale: Float
```

Common automatic font-size multiplier; 1 when automatic sizing did not scale the text.

### overshoot

```kotlin
val overshoot: TextOvershoot
```

Nonnegative ink outside each frame edge, including ink of clipped lines.

### requiredHeight

```kotlin
val requiredHeight: Float
```

Full layout height at the current wrap width and fitted sizes, in scene design units.

### totalLineCount

```kotlin
val totalLineCount: Int
```

All laid-out lines, including lines hidden by the frame.

### visibleLineCount

```kotlin
val visibleLineCount: Int
```

Lines visible with the authored clipping setting, independent of text editing.
