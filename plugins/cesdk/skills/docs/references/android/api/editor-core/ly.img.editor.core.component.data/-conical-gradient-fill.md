# ConicalGradientFill

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

A type of Fill that is a conical gradient.

```kotlin
@Stable
data class ConicalGradientFill(val centerX: Float, val centerY: Float, val colorStops: List<GradientColorStop>) : GradientFill
```


## Members

### ConicalGradientFill

```kotlin
constructor(centerX: Float, centerY: Float, colorStops: List<GradientColorStop>)
```

### centerX

```kotlin
val centerX: Float
```

The x coordinate of the center.

### centerY

```kotlin
val centerY: Float
```

The y coordinate of the center.

### colorStops

```kotlin
open override val colorStops: List<GradientColorStop>
```

The list of all the color stops of the gradient. Check the documentation of GradientColorStop for more information.
