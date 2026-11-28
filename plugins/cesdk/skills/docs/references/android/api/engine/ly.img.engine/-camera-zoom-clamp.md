# CameraZoomClamp

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The camera zoom clamp of a scene.

```kotlin
data class CameraZoomClamp(val blocks: List<DesignBlock>, val minZoomLimit: Float = -1F, val maxZoomLimit: Float = -1F, val padding: CameraPadding = CameraPadding())
```


## Members

### CameraZoomClamp

```kotlin
constructor(blocks: List<DesignBlock>, minZoomLimit: Float = -1F, maxZoomLimit: Float = -1F, padding: CameraPadding = CameraPadding())
```

### blocks

```kotlin
val blocks: List<DesignBlock>
```

The blocks whose bounding box sets the zoom level 1, where they fit the viewport. A single camera block makes the limits absolute zoom levels instead.

### maxZoomLimit

```kotlin
val maxZoomLimit: Float
```

The largest zoom level, unlimited when negative.

### minZoomLimit

```kotlin
val minZoomLimit: Float
```

The smallest zoom level, unlimited when negative.

### padding

```kotlin
val padding: CameraPadding
```

Padding in screen pixels around the blocks. Has no effect for a camera block.
