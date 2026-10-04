# Capture

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

A single entry in a heterogeneous capture stack. Returned inside CameraResult.Captures for any CaptureType: video-only sessions yield Capture.Video entries, photo sessions yield Capture.Photo entries, and mixed sessions yield a stack of both.

```kotlin
interface Capture : Parcelable
```


## Members

### describeContents

```kotlin
open override fun describeContents(): Int
```

### writeToParcel

```kotlin
abstract override fun writeToParcel(dest: Parcel, flags: Int)
```
