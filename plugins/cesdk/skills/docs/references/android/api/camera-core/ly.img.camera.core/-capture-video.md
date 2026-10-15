# CaptureVideo

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Legacy entry point for the IMG.LY Camera. Renamed to CaptureMedia, which supports photo, video, and mixed capture sessions and delivers the modern CameraResult.Captures result. The symbol is preserved so existing call sites surface a precise compile error pointing at CaptureMedia instead of an opaque "unresolved reference"; the class itself is unusable at compile time.

```kotlin
open class CaptureVideo : CaptureMedia
```
> **Deprecated (with error):** Renamed to CaptureMedia, which supports photo / video / mixed capture sessions and returns the modern CameraResult.Captures shape. Replace with `import ly.img.camera.core.CaptureMedia; CaptureMedia`.


## Members

### CaptureVideo

```kotlin
constructor()
```
