# Recording

- **Module:** `IMGLYCamera`
- **DocC identifier:** `/documentation/IMGLYCamera/Recording`

A camera recording.

```swift
struct Recording
```

## Members

### duration

```swift
let duration: CMTime
```

The duration of the recording.

### Recording.Video

```swift
struct Video
```

A video recording.

### Video.rect

```swift
let rect: CGRect
```

The position and size of the video.

### Video.url

```swift
let url: URL
```

The URL of the recorded video file.

### videos

```swift
let videos: [Recording.Video]
```

Contains one or two `Video`s, for single camera mode or video that was reacted to and dual camera mode respectively.
