# GradientFill

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

A type of Fill that is a gradient.

```kotlin
@Stable
interface GradientFill : Fill
```


## Members

### colorStops

```kotlin
abstract val colorStops: List<GradientColorStop>
```

The list of all the color stops of the gradient. Check the documentation of GradientColorStop for more information.

### mainColor

```kotlin
open override val mainColor: Color
```

The main color of the fill. It returns the first color in the colorStops list.
