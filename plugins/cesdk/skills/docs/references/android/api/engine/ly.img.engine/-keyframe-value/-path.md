# Path

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A bezier path value, for example a morphing vector path.

```kotlin
data class Path(val vertices: List<PathVertex>, val closed: Boolean) : KeyframeValue
```


## Members

### Path

```kotlin
constructor(vertices: List<PathVertex>, closed: Boolean)
```

### closed

```kotlin
val closed: Boolean
```

### vertices

```kotlin
val vertices: List<PathVertex>
```
