# AV1EncodingMode

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AV1EncodingMode`

How an AV1 export trades speed for quality. Other codecs ignore it.

```swift
@objc enum AV1EncodingMode
```

## Members

### AV1EncodingMode.quality

```swift
case quality
```

A sharper video at the same bitrate, but the export takes about ten times as long and about three times the memory.

### AV1EncodingMode.realtime

```swift
case realtime
```

The fast mode.

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```
