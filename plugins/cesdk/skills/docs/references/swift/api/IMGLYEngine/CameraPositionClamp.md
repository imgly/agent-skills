# CameraPositionClamp

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CameraPositionClamp`

The camera position clamp of a scene: the camera stays inside the axis-aligned bounding box of the blocks.

```swift
struct CameraPositionClamp
```

## Members

### blocks

```swift
var blocks: [DesignBlockID]
```

The blocks whose bounding box limits the camera, e.g., a page or the scene. The engine reads their bounds on every update. A scene block counts every visible block in it, also blocks outside its pages.

### init(blocks:padding:scaledPadding:)

```swift
init(blocks: [DesignBlockID], padding: SafeAreaInsets = .zero, scaledPadding: SafeAreaInsets = .zero)
```

Creates a camera position clamp.

### padding

```swift
var padding: SafeAreaInsets
```

Padding in screen points around the blocks.

### scaledPadding

```swift
var scaledPadding: SafeAreaInsets
```

Padding in screen points that grows with the zoom level, up to five times its value.
