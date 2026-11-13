# AudioTrackInfo

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AudioTrackInfo`

```swift
struct AudioTrackInfo
```

## Members

### audioCodec

```swift
let audioCodec: String
```

The codec string.

### audioDuration

```swift
let audioDuration: Double
```

Duration of the audio track in seconds.

### channels

```swift
let channels: Int
```

The number of audio channels.

### init(audioCodec:channels:sampleRate:audioDuration:numAudioPackets:numAudioFrames:trackName:trackIndex:language:)

```swift
init(audioCodec: String, channels: Int, sampleRate: Int, audioDuration: Double, numAudioPackets: Int, numAudioFrames: Int64, trackName: String, trackIndex: Int, language: String)
```

### language

```swift
let language: String
```

Track language code (ISO 639-2T format: “und”, “eng”, “deu”, etc.).

### numAudioFrames

```swift
let numAudioFrames: Int64
```

The number of audio frames.

### numAudioPackets

```swift
let numAudioPackets: Int
```

The number of audio packets (matches the number of encoded chunks).

### sampleRate

```swift
let sampleRate: Int
```

The audio sample rate.

### trackIndex

```swift
let trackIndex: Int
```

Track index in the container.

### trackName

```swift
let trackName: String
```

Optional track name/label if available in metadata.
