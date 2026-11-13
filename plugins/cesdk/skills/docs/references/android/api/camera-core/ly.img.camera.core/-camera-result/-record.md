# Record

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Recordings are now wrapped as Capture.Video inside Captures. when consumers must drop the is CameraResult.Record -> arm and add an is CameraResult.Captures -> arm. Use the videos extension on List<Capture> to extract List<Recording> from a heterogeneous capture stack.

```kotlin
data class Record(val recordings: List<Recording>) : CameraResult
```
> **Deprecated (with error):** Recordings are wrapped as Capture.Video. Use Captures and the .videos extension. Replace with `Captures`.


## Members

### Record

```kotlin
constructor(recordings: List<Recording>)
```

### recordings

```kotlin
val recordings: List<Recording>
```

### writeToParcel

```kotlin
open override fun writeToParcel(dest: Parcel, flags: Int)
```
