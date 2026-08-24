# CameraResult

- **Module:** `IMGLYCamera`
- **DocC identifier:** `/documentation/IMGLYCamera/CameraResult`

Wraps the result of the camera.

```swift
enum CameraResult
```

## Members

### CameraResult.capture(_:)

```swift
case capture([Capture])
```

Emitted for any non-reaction session. Preserves user-press order and may interleave `.photo(Photo)` and `.video(Recording)` for `.mixed` captures, or contain pure `.video` entries for `.video` sessions.

### CameraResult.reaction(video:reaction:)

```swift
case reaction(video: Recording, reaction: [Recording])
```

Emitted when `cameraMode == .reaction(...)`: the host-supplied video the user reacted to, paired with the user’s recordings (one `Recording` per shutter press).
