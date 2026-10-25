# AudioCodec

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AudioCodec`

The audio codec of a video export. An MP4 file holds `.aac` and `.opus`, and a WebM file holds `.opus` and `.vorbis`.

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

AAC for an MP4 file, Opus for a WebM file.

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
