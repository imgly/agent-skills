# ly.img.camera.core

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`
- **Module catalog:** [`ly.img:camera-core`](<../../indexes/camera-core.md>)

## Top-level declarations

### supports

```kotlin
fun CameraMode.supports(captureType: CaptureType): Boolean
```

Returns whether this CameraMode can be combined with the given captureType. Only CameraMode.Standard supports photo / mixed capture. CameraMode.Reaction's pixelstream pipeline cannot host an additional ImageCapture use case, so any combination involving CaptureType.Photo or CaptureType.Mixed is rejected.

### videos

```kotlin
val List<Capture>.videos: List<Recording>
```

Extracts video recordings from a heterogeneous capture stack. Migration shortcut for hosts that previously consumed CameraResult.Record's recordings: List<Recording>.
