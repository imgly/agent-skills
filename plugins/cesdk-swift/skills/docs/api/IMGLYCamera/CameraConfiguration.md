# CameraConfiguration

- **Module:** `IMGLYCamera`
- **DocC identifier:** `/documentation/IMGLYCamera/CameraConfiguration`

Camera configuration options.

```swift
struct CameraConfiguration
```

## Members

### allowExceedingMaxDuration

```swift
let allowExceedingMaxDuration: Bool
```

Adjusts the segments visualization to use the max duration, but does not enforce the limit.

### allowModeSwitching

```swift
let allowModeSwitching: Bool
```

Set to `false` to lock the camera into the initial mode.

### captureCount

```swift
let captureCount: CaptureCount
```

How many captures the session produces.

### captureType

```swift
let captureType: CaptureType
```

The kind of media the camera captures.

### defaultVideoSize

```swift
static let defaultVideoSize: CGSize
```

The default frame size used by camera-produced video scenes.

### highlightColor

```swift
let highlightColor: Color
```

The color used to highlight the camera buttons on tap.

### init(recordingColor:highlightColor:maxTotalDuration:allowExceedingMaxDuration:allowModeSwitching:captureType:captureCount:photoClipDuration:showsPhotoPreview:)

```swift
init(recordingColor: Color = .pink, highlightColor: Color = .pink, maxTotalDuration: TimeInterval = .infinity, allowExceedingMaxDuration: Bool = false, allowModeSwitching: Bool = true, captureType: CaptureType = .video, captureCount: CaptureCount = .multi, photoClipDuration: TimeInterval = 5, showsPhotoPreview: Bool = true)
```

Creates a camera configuration. `recordingColor`

### maxTotalDuration

```swift
let maxTotalDuration: CMTime
```

The target duration for the recording.

### photoClipDuration

```swift
let photoClipDuration: CMTime
```

The duration stamped on each captured photo.

### recordingColor

```swift
let recordingColor: Color
```

The color of the record button while recording, and all the other recording indicators.

### showsPhotoPreview

```swift
let showsPhotoPreview: Bool
```

Whether to show a full-screen preview after each photo capture.

### videoSize

```swift
let videoSize: CGSize
```

The dimensions of the recorded video.
