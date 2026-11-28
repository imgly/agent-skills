# CameraZoomClamp

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CameraZoomClamp`

The camera zoom clamp of a scene.

```swift
struct CameraZoomClamp
```

## Members

### blocks

```swift
var blocks: [DesignBlockID]
```

The blocks whose bounding box sets the zoom level 1, where they fit the viewport. A single camera block makes the limits absolute zoom levels instead.

### init(blocks:minZoomLimit:maxZoomLimit:padding:)

```swift
init(blocks: [DesignBlockID], minZoomLimit: Float = -1, maxZoomLimit: Float = -1, padding: SafeAreaInsets = .zero)
```

Creates a camera zoom clamp.

### maxZoomLimit

```swift
var maxZoomLimit: Float
```

The largest zoom level, unlimited when negative.

### minZoomLimit

```swift
var minZoomLimit: Float
```

The smallest zoom level, unlimited when negative.

### padding

```swift
var padding: SafeAreaInsets
```

Padding in screen points around the blocks. Has no effect for a camera block.
