# VideoBitrate

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VideoBitrate`

Selects how the video bitrate of a [`VideoExportOptions`](videoexportoptions.md) is determined.

```swift
enum VideoBitrate
```

## Members

### VideoBitrate.auto

```swift
case auto
```

A bounded default derived from the output resolution and framerate, consistent across platforms.

### VideoBitrate.custom(_:)

```swift
case custom(Int32)
```

An explicit bitrate in bits per second. Must be greater than 0; the maximum is determined by the H.264 profile and level.

### VideoBitrate.system

```swift
case system
```

Let the platform encoder choose the bitrate (the default). On iOS/macOS VideoToolbox uses its internal default.
