# Companion

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
object Companion
```


## Members

### BITRATE_AUTO

```kotlin
const val BITRATE_AUTO: Int
```

A bounded default video bitrate derived from the output resolution and framerate, consistent across platforms.

### BITRATE_SYSTEM

```kotlin
const val BITRATE_SYSTEM: Int = 0
```

Let the platform encoder choose the bitrate (the default). On Android there is no encoder-internal default, so this resolves to the same bounded resolution/framerate default as BITRATE_AUTO.
