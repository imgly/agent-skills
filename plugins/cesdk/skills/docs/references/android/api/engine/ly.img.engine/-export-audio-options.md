# ExportAudioOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The options of BlockApi.exportAudio.

```kotlin
data class ExportAudioOptions(val timeOffset: Double = 0.0, val duration: Double? = null, val sampleRate: Int = 48000, val numberOfChannels: Int = 2, val skipEncoding: Boolean = false, val audioCodec: AudioCodec = AudioCodec.AUTO)
```


## Members

### ExportAudioOptions

```kotlin
constructor(timeOffset: Double = 0.0, duration: Double? = null, sampleRate: Int = 48000, numberOfChannels: Int = 2, skipEncoding: Boolean = false, audioCodec: AudioCodec = AudioCodec.AUTO)
```

### audioCodec

```kotlin
val audioCodec: AudioCodec
```

The codec of a MimeType.AUDIO_MP4 or MimeType.AUDIO_WEBM export. AudioCodec.AUTO picks AAC for MP4, and Opus, then Vorbis, for WebM. A codec that the file type cannot hold fails the export. A WAV export ignores it.

### duration

```kotlin
val duration: Double? = null
```

The duration in seconds of the final audio. Null exports the whole duration of the block. A WAV file holds at most 11,184.81 seconds of audio, so a longer MimeType.AUDIO_WAV export fails.

### numberOfChannels

```kotlin
val numberOfChannels: Int = 2
```

The number of audio channels. The engine exports stereo only, so another value than 2 fails the export.

### sampleRate

```kotlin
val sampleRate: Int = 48000
```

The audio sample rate in Hz. The engine exports 48000 Hz only, so another value fails the export.

### skipEncoding

```kotlin
val skipEncoding: Boolean = false
```

Copy the raw 48 kHz stereo float samples of a buffer into a WAV file without encoding them. The copy starts at the first sample, and the block duration limits its length. It ignores timeOffset, duration and the trim. Any other export runs as it does without this option. The default value is false.

### timeOffset

```kotlin
val timeOffset: Double = 0.0
```

The time offset in seconds relative to the exported block. Must be finite. The default value is 0.
