# ExportVideoProgress

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class ExportVideoProgress(val renderedFrames: Int, val encodedFrames: Int, val totalFrames: Int)
```


## Members

### ExportVideoProgress

```kotlin
constructor(renderedFrames: Int, encodedFrames: Int, totalFrames: Int)
```

### encodedFrames

```kotlin
val encodedFrames: Int
```

The number of encoded frames.

### renderedFrames

```kotlin
val renderedFrames: Int
```

The number of frames rendered by the engine.

### totalFrames

```kotlin
val totalFrames: Int
```

The total number of frames to encode.
