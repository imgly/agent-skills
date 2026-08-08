# AudioThumbnailResult

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
class AudioThumbnailResult(val chunkIndex: Int, val samples: List<Float>)
```


## Members

### AudioThumbnailResult

```kotlin
constructor(chunkIndex: Int, samples: List<Float>)
```

### chunkIndex

```kotlin
val chunkIndex: Int
```

The chunk index in the requested sequence.

### samples

```kotlin
val samples: List<Float>
```

The thumbnail audio volume data as 32-bit float samples.
