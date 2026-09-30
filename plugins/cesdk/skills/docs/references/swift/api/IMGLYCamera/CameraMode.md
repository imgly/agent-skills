# CameraMode

- **Module:** `IMGLYCamera`
- **DocC identifier:** `/documentation/IMGLYCamera/CameraMode`

Enumerates the different camera modes.

```swift
enum CameraMode
```

## Members

### CameraMode.dualCamera(_:)

```swift
case dualCamera(CameraLayoutMode = .vertical)
```

Records with two cameras at once into a given layout.

### CameraMode.reaction(_:video:positionsSwapped:)

```swift
case reaction(CameraLayoutMode = .vertical, video: URL, positionsSwapped: Bool = false)
```

Records with one camera while playing a video.

### CameraMode.standard

```swift
case standard
```

The standard, main, camera.
