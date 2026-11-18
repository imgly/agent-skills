# Keyframe

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

One keyframe of a property track.

```kotlin
data class Keyframe(val time: Float, val value: KeyframeValue, val easing: KeyframeEasing = KeyframeEasing.Preset(), val spatialOut: Vector2? = null, val spatialIn: Vector2? = null)
```


## Members

### Keyframe

```kotlin
constructor(time: Float, value: KeyframeValue, easing: KeyframeEasing = KeyframeEasing.Preset(), spatialOut: Vector2? = null, spatialIn: Vector2? = null)
```

### easing

```kotlin
val easing: KeyframeEasing
```

The curve from this keyframe to the next.

### spatialIn

```kotlin
val spatialIn: Vector2? = null
```

The motion path tangent that enters the next keyframe's value, relative to that value. It sits on this keyframe, like spatialOut, so the last keyframe does not use it. Only keyframes with a KeyframeValue.Vec2 value accept it.

### spatialOut

```kotlin
val spatialOut: Vector2? = null
```

The motion path tangent that leaves this keyframe's value, relative to it. Only keyframes with a KeyframeValue.Vec2 value accept it.

### time

```kotlin
val time: Float
```

The normalized time over the clock of the block: 0 at its start, 1 at its end. After a split, a keyframe can lie before 0 or after 1, so the segment across the cut keeps its curve.

### value

```kotlin
val value: KeyframeValue
```

The value of the property at time.
