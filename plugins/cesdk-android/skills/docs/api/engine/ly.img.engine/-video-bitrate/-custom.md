# Custom

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

An explicit video bitrate in bits per second.

```kotlin
data class Custom(@IntRange(from = 1)val bitsPerSecond: Int) : VideoBitrate
```


## Members

### Custom

```kotlin
constructor(@IntRange(from = 1)bitsPerSecond: Int)
```

### bitsPerSecond

```kotlin
val bitsPerSecond: Int
```
