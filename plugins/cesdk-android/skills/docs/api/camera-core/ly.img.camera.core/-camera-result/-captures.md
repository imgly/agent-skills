# Captures

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Result representing a heterogeneous stack of captures (photos and/or videos) produced by the camera when configured with CaptureType.Photo or CaptureType.Mixed. Named Captures (plural) rather than Capture so consumers can import Capture (the sealed interface for individual entries) and the result case side-by-side without naming collisions.

```kotlin
data class Captures(val captures: List<Capture>) : CameraResult
```


## Members

### Captures

```kotlin
constructor(captures: List<Capture>)
```

### captures

```kotlin
val captures: List<Capture>
```

### writeToParcel

```kotlin
open override fun writeToParcel(dest: Parcel, flags: Int)
```
