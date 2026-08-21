# AudioFromVideoOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class AudioFromVideoOptions(val keepTrimSettings: Boolean = true, val muteOriginalVideo: Boolean = false)
```


## Members

### AudioFromVideoOptions

```kotlin
constructor(keepTrimSettings: Boolean = true, muteOriginalVideo: Boolean = false)
```

### keepTrimSettings

```kotlin
val keepTrimSettings: Boolean = true
```

If true, the audio block will have the same duration, trim length, and trim offset as the source video. If false, the full audio track is extracted without trim settings. The default value is true.

### muteOriginalVideo

```kotlin
val muteOriginalVideo: Boolean = false
```

If true, mutes the audio of the original video fill block. The default value is false.
