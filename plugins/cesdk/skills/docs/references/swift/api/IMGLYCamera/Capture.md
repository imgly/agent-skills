# Capture

- **Module:** `IMGLYCamera`
- **DocC identifier:** `/documentation/IMGLYCamera/Capture`

A single item produced by the camera.

```swift
enum Capture
```

## Members

### Capture.photo(_:)

```swift
case photo(Photo)
```

A still photo. `Photo.images` is 1-element in single-camera mode and 2-element in dual-camera mode.

### Capture.video(_:)

```swift
case video(Recording)
```

A video clip.
