# VideoExportOptions

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VideoExportOptions`

```swift
@objcMembers final class VideoExportOptions
```

## Members

### allowTextOverhang

```swift
let allowTextOverhang: Bool
```

### audioBitrate

```swift
let audioBitrate: Int32
```

### coverTimeOffset

```swift
@nonobjc let coverTimeOffset: Double?
```

Cover time in seconds from the beginning of the exported video. Nil uses the page playback position at export start, clamped to the exported frames. An explicit value must be finite and within [0, duration). The frame containing that time becomes a PNG cover. The image preserves the export aspect ratio, with both dimensions at most 512 pixels.

### coverTimeOffsetNumber

```swift
var coverTimeOffsetNumber: NSNumber? { get }
```

Engine bridge form of [`coverTimeOffset`](covertimeoffset.md).

### duration

```swift
let duration: Double
```

### framerate

```swift
let framerate: Float?
```

### h264Level

```swift
let h264Level: Int32
```

### h264Profile

```swift
let h264Profile: H264Profile
```

### init(h264Profile:h264Level:videoBitrate:audioBitrate:timeOffset:duration:framerate:targetWidth:targetHeight:allowTextOverhang:)

```swift
convenience init(h264Profile: H264Profile, h264Level: Int32, videoBitrate: Int32, audioBitrate: Int32, timeOffset: Double, duration: Double, framerate: Float, targetWidth: Float, targetHeight: Float, allowTextOverhang: Bool)
```

Objective-C-compatible initializer retaining the existing construction selector.

### init(h264Profile:h264Level:videoBitrate:audioBitrate:timeOffset:duration:framerate:targetWidth:targetHeight:allowTextOverhang:coverTimeOffset:)-2ulbp

```swift
@nonobjc init(h264Profile: H264Profile = .main, h264Level: Int32 = 52, videoBitrate: Int32 = 0, audioBitrate: Int32 = 0, timeOffset: Double = 0, duration: Double = 0, framerate: Float? = nil, targetWidth: Float = 0, targetHeight: Float = 0, allowTextOverhang: Bool = false, coverTimeOffset: Double? = nil)
```

The video export options. `h264Profile`

### init(h264Profile:h264Level:videoBitrate:audioBitrate:timeOffset:duration:framerate:targetWidth:targetHeight:allowTextOverhang:coverTimeOffset:)-7blhx

```swift
@nonobjc convenience init(h264Profile: H264Profile = .main, h264Level: Int32 = 52, videoBitrate: VideoBitrate, audioBitrate: Int32 = 0, timeOffset: Double = 0, duration: Double = 0, framerate: Float? = nil, targetWidth: Float = 0, targetHeight: Float = 0, allowTextOverhang: Bool = false, coverTimeOffset: Double? = nil)
```

The video export options. `h264Profile`

### targetHeight

```swift
let targetHeight: Float
```

### targetWidth

```swift
let targetWidth: Float
```

### timeOffset

```swift
let timeOffset: Double
```

### videoBitrate

```swift
let videoBitrate: Int32
```
