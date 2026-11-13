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

If true, the audio block plays like the source video. It has the same duration and trim, and it copies the playback speed, looping, volume, mute state and audio fades. Above 3x, the audio is force muted like the video. If false, the full audio track is extracted with the default playback settings. The default value is true.

### muteOriginalVideo

```kotlin
val muteOriginalVideo: Boolean = false
```

If true, mutes the audio of the original video fill block. The default value is false.
