# AudioTrackInfo

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Information about a single audio track from a video. This data class provides comprehensive metadata about audio tracks, including codec information, technical specifications, and track details.

```kotlin
data class AudioTrackInfo(val audioCodec: String, val channels: Int, val sampleRate: Int, val audioDuration: Double, val numAudioPackets: Int, val numAudioFrames: Long, val trackName: String, val trackIndex: Int, val language: String)
```


## Members

### AudioTrackInfo

```kotlin
constructor(audioCodec: String, channels: Int, sampleRate: Int, audioDuration: Double, numAudioPackets: Int, numAudioFrames: Long, trackName: String, trackIndex: Int, language: String)
```

### audioCodec

```kotlin
val audioCodec: String
```

The codec string.

### audioDuration

```kotlin
val audioDuration: Double
```

Duration of the audio track in seconds.

### channels

```kotlin
val channels: Int
```

The number of audio channels.

### language

```kotlin
val language: String
```

Track language code (ISO 639-2T format: "und", "eng", "deu", etc.).

### numAudioFrames

```kotlin
val numAudioFrames: Long
```

The number of audio frames.

### numAudioPackets

```kotlin
val numAudioPackets: Int
```

The number of audio packets (matches the number of encoded chunks).

### sampleRate

```kotlin
val sampleRate: Int
```

The audio sample rate.

### trackIndex

```kotlin
val trackIndex: Int
```

Track index in the container.

### trackName

```kotlin
val trackName: String
```

Optional track name/label if available in metadata.
