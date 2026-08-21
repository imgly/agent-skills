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

### duration

```swift
let duration: Double
```

### framerate

```swift
let framerate: Float
```

### h264Level

```swift
let h264Level: Int32
```

### h264Profile

```swift
let h264Profile: H264Profile
```

### init(h264Profile:h264Level:videoBitrate:audioBitrate:timeOffset:duration:framerate:targetWidth:targetHeight:allowTextOverhang:)-1eafc

```swift
convenience init(h264Profile: H264Profile = .main, h264Level: Int32 = 52, videoBitrate: VideoBitrate, audioBitrate: Int32 = 0, timeOffset: Double = 0, duration: Double = 0, framerate: Float = 30, targetWidth: Float = 0, targetHeight: Float = 0, allowTextOverhang: Bool = false)
```

The video export options. `h264Profile`

### init(h264Profile:h264Level:videoBitrate:audioBitrate:timeOffset:duration:framerate:targetWidth:targetHeight:allowTextOverhang:)-3kxnu

```swift
init(h264Profile: H264Profile = .main, h264Level: Int32 = 52, videoBitrate: Int32 = 0, audioBitrate: Int32 = 0, timeOffset: Double = 0, duration: Double = 0, framerate: Float = 30, targetWidth: Float = 0, targetHeight: Float = 0, allowTextOverhang: Bool = false)
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
