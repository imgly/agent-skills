# RadialGradientFill

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

A type of Fill that is a radial gradient.

```kotlin
@Stable
data class RadialGradientFill(val centerX: Float, val centerY: Float, val radius: Float, val colorStops: List<GradientColorStop>) : GradientFill
```


## Members

### RadialGradientFill

```kotlin
constructor(centerX: Float, centerY: Float, radius: Float, colorStops: List<GradientColorStop>)
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

### radius

```kotlin
val radius: Float
```

The radius of the gradient.
