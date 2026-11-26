# JoinVideosProgress

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class JoinVideosProgress(val copiedSamples: Int, val totalSamples: Int)
```


## Members

### JoinVideosProgress

```kotlin
constructor(copiedSamples: Int, totalSamples: Int)
```

### copiedSamples

```kotlin
val copiedSamples: Int
```

The number of video and audio samples copied so far.

### totalSamples

```kotlin
val totalSamples: Int
```

The number of all video and audio samples.
