# AudioExportOptions

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AudioExportOptions`

```swift
@objcMembers final class AudioExportOptions
```

## Members

### audioCodec

```swift
let audioCodec: AudioCodec
```

### duration

```swift
let duration: Double
```

### init(sampleRate:numberOfChannels:timeOffset:duration:skipEncoding:)

```swift
convenience init(sampleRate: Int32, numberOfChannels: Int32, timeOffset: Double, duration: Double, skipEncoding: Bool)
```

Objective-C-compatible initializer retaining the existing construction selector.

### init(sampleRate:numberOfChannels:timeOffset:duration:skipEncoding:audioCodec:)

```swift
@nonobjc init(sampleRate: Int32 = 48000, numberOfChannels: Int32 = 2, timeOffset: Double = 0, duration: Double = 0, skipEncoding: Bool = false, audioCodec: AudioCodec = .auto)
```

The audio export options. `sampleRate`

### numberOfChannels

```swift
let numberOfChannels: Int32
```

### sampleRate

```swift
let sampleRate: Int32
```

### skipEncoding

```swift
let skipEncoding: Bool
```

### timeOffset

```swift
let timeOffset: Double
```
