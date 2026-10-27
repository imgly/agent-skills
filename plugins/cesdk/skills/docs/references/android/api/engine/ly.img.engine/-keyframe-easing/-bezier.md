# Bezier

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A cubic bezier curve with CSS cubic-bezier handles.

```kotlin
data class Bezier(val out: Vector2, val in: Vector2) : KeyframeEasing
```


## Members

### out

```kotlin
val out: Vector2
```

The handle that leaves this keyframe.

### Bezier

```kotlin
constructor(out: Vector2, in: Vector2)
```

### in

```kotlin
val in: Vector2
```

The handle that enters the next keyframe.
