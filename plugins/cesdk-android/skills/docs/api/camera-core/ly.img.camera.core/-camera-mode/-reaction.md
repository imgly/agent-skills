# Reaction

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Records with one camera while playing the video.

```kotlin
class Reaction(val video: Uri, val cameraLayoutMode: CameraLayoutMode = CameraLayoutMode.Vertical, val positionsSwapped: Boolean = false) : CameraMode
```


## Members

### Reaction

```kotlin
constructor(video: Uri, cameraLayoutMode: CameraLayoutMode = CameraLayoutMode.Vertical, positionsSwapped: Boolean = false)
```

### cameraLayoutMode

```kotlin
val cameraLayoutMode: CameraLayoutMode
```

### positionsSwapped

```kotlin
val positionsSwapped: Boolean = false
```

### video

```kotlin
val video: Uri
```

### writeToParcel

```kotlin
open override fun writeToParcel(dest: Parcel, flags: Int)
```
