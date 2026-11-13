# PathVertex

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

One vertex of a bezier path. Experimental: this API may change in a minor release.

```kotlin
data class PathVertex(val point: Vector2, val inTangent: Vector2 = Vector2(0F, 0F), val outTangent: Vector2 = Vector2(0F, 0F))
```


## Members

### PathVertex

```kotlin
constructor(point: Vector2, inTangent: Vector2 = Vector2(0F, 0F), outTangent: Vector2 = Vector2(0F, 0F))
```

### inTangent

```kotlin
val inTangent: Vector2
```

The incoming tangent, relative to point.

### outTangent

```kotlin
val outTangent: Vector2
```

The outgoing tangent, relative to point.

### point

```kotlin
val point: Vector2
```

The position of the vertex.
