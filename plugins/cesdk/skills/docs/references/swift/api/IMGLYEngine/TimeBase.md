# TimeBase

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/TimeBase`

The clock that the keyframes of a block run over.

```swift
@objc(KeyframeTimeBase) enum TimeBase
```

## Members

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```

### TimeBase.block

```swift
case block
```

Keyframe times are normalized over the block’s playback duration.

### TimeBase.media

```swift
case media
```

Keyframe times are normalized over the total duration of the video that the block shows.
