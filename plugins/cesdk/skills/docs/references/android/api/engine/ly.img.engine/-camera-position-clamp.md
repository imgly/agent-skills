# CameraPositionClamp

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The camera position clamp of a scene: the camera stays inside the axis-aligned bounding box of the blocks.

```kotlin
data class CameraPositionClamp(val blocks: List<DesignBlock>, val padding: CameraPadding = CameraPadding(), val scaledPadding: CameraPadding = CameraPadding())
```


## Members

### CameraPositionClamp

```kotlin
constructor(blocks: List<DesignBlock>, padding: CameraPadding = CameraPadding(), scaledPadding: CameraPadding = CameraPadding())
```

### blocks

```kotlin
val blocks: List<DesignBlock>
```

The blocks whose bounding box limits the camera, e.g., a page or the scene. The engine reads their bounds on every update. A scene block counts every visible block in it, also blocks outside its pages.

### padding

```kotlin
val padding: CameraPadding
```

Padding in screen pixels around the blocks.

### scaledPadding

```kotlin
val scaledPadding: CameraPadding
```

Padding in screen pixels that grows with the zoom level, up to five times its value.
