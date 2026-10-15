# CharacterInkBox

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Tight ink-paint bounding box of a single grapheme, in global scene coordinates.

```kotlin
data class CharacterInkBox(val x: Float, val y: Float, val width: Float, val height: Float, val baselineY: Float)
```


## Members

### CharacterInkBox

```kotlin
constructor(x: Float, y: Float, width: Float, height: Float, baselineY: Float)
```

### baselineY

```kotlin
val baselineY: Float
```

Global Y of the glyph baseline (needed for underline/cursor overlays).

### height

```kotlin
val height: Float
```

Height of the tight ink rect.

### width

```kotlin
val width: Float
```

Width of the tight ink rect.

### x

```kotlin
val x: Float
```

Global X of the tight ink rect (left edge, Y-down scene space).

### y

```kotlin
val y: Float
```

Global Y of the tight ink rect (top edge, Y-down scene space).
