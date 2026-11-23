# AudioCodec

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AudioCodec`

The audio codec of a video export, or of an MP4, WebM or MP3 audio export. An MP4 file holds `.aac` and `.opus`, a WebM file holds `.opus` and `.vorbis`, and an MP3 file holds `.mp3`.

```swift
@objc enum AudioCodec
```

## Members

### AudioCodec.aac

```swift
case aac
```

AAC-LC.

### AudioCodec.auto

```swift
case auto
```

AAC for an MP4 file, Opus for a WebM file, MP3 for an MP3 file.

### AudioCodec.mp3

```swift
case mp3
```

MPEG-1 Audio Layer III, which the engine encodes on every platform.

### AudioCodec.opus

```swift
case opus
```

Opus, bundled with the engine.

### AudioCodec.vorbis

```swift
case vorbis
```

Vorbis, bundled with the engine.

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```
