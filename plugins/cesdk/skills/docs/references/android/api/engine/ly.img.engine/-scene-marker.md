# SceneMarker

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A named point or span on the scene timeline. Experimental: this API may change in a minor release.

```kotlin
data class SceneMarker(val name: String, val time: Double, val duration: Double)
```


## Members

### SceneMarker

```kotlin
constructor(name: String, time: Double, duration: Double)
```

### duration

```kotlin
val duration: Double
```

The length of the marker in seconds. 0 marks a single point in time.

### name

```kotlin
val name: String
```

The name of the marker. Several markers may share a name.

### time

```kotlin
val time: Double
```

The start of the marker in seconds.
