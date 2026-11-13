# LinearGradientFill

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

A type of Fill that is a linear gradient.

```kotlin
@Stable
data class LinearGradientFill(val startPointX: Float, val startPointY: Float, val endPointX: Float, val endPointY: Float, val colorStops: List<GradientColorStop>) : GradientFill
```


## Members

### LinearGradientFill

```kotlin
constructor(startPointX: Float, startPointY: Float, endPointX: Float, endPointY: Float, colorStops: List<GradientColorStop>)
```

### colorStops

```kotlin
open override val colorStops: List<GradientColorStop>
```

The list of all the color stops of the gradient. Check the documentation of GradientColorStop for more information.

### endPointX

```kotlin
val endPointX: Float
```

The x coordinate of the end point.

### endPointY

```kotlin
val endPointY: Float
```

The y coordinate of the end point.

### gradientRotation

```kotlin
val gradientRotation: Float
```

The angle of gradient in degrees.

### startPointX

```kotlin
val startPointX: Float
```

The x coordinate of the start point.

### startPointY

```kotlin
val startPointY: Float
```

The y coordinate of the start point.
