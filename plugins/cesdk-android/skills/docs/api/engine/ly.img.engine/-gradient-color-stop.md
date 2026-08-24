# GradientColorStop

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class GradientColorStop(@FloatRange(from = 0.0, to = 1.0)val stop: Float, val color: Color)
```


## Members

### GradientColorStop

```kotlin
constructor(@FloatRange(from = 0.0, to = 1.0)stop: Float, color: Color)
```

### color

```kotlin
val color: Color
```

The color to apply at stop.

### stop

```kotlin
val stop: Float
```

Where to add a color stop in the range 0 to 1.
