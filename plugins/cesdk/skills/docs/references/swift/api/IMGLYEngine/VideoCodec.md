# VideoCodec

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VideoCodec`

The codec of a video export. [`MIMEType.mp4`](mimetype/mp4.md) holds `.h264` and `.hevc`, and [`MIMEType.webm`](mimetype/webm.md) holds `.vp8`, `.vp9` and `.av1`.

```swift
@objc enum VideoCodec
```

## Members

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```

### VideoCodec.auto

```swift
case auto
```

H.264 for [`MIMEType.mp4`](../mimetype/mp4.md), VP9 for [`MIMEType.webm`](../mimetype/webm.md).

### VideoCodec.av1

```swift
case av1
```

AV1, bundled with the engine.

### VideoCodec.h264

```swift
case h264
```

H.264 / AVC.

### VideoCodec.hevc

```swift
case hevc
```

H.265 / HEVC.

### VideoCodec.vp8

```swift
case vp8
```

VP8, bundled with the engine.

### VideoCodec.vp9

```swift
case vp9
```

VP9, bundled with the engine.
