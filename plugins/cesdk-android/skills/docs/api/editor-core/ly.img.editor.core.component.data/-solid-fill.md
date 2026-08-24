# SolidFill

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

A type of Fill that is one or more flat colors.

```kotlin
@Stable
data class SolidFill(val colors: List<Color>) : Fill
```


## Members

### SolidFill

```kotlin
constructor(mainColor: Color)
```

```kotlin
constructor(colors: List<Color>)
```

### colors

```kotlin
val colors: List<Color>
```

The colors of the fill.

### mainColor

```kotlin
open override val mainColor: Color
```

The main color of the fill. It returns the first color in the colors list.
