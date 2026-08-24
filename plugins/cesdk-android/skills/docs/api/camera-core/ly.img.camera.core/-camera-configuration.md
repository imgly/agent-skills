# CameraConfiguration

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Configuration for the camera.

```kotlin
class CameraConfiguration(val recordingColor: Color = Color(0xFFDE6F62), val maxTotalDuration: Duration = Duration.INFINITE, val allowExceedingMaxDuration: Boolean = false, val captureType: CaptureType = CaptureType.Video, val captureCount: CaptureCount = CaptureCount.Multi, val photoClipDuration: Duration = 5.seconds, val showsPhotoPreview: Boolean = true) : Parcelable
```


## Members

### CameraConfiguration

```kotlin
constructor(parcel: Parcel)
```

```kotlin
constructor(recordingColor: Color = Color(0xFFDE6F62), maxTotalDuration: Duration = Duration.INFINITE, allowExceedingMaxDuration: Boolean = false, captureType: CaptureType = CaptureType.Video, captureCount: CaptureCount = CaptureCount.Multi, photoClipDuration: Duration = 5.seconds, showsPhotoPreview: Boolean = true)
```

### allowExceedingMaxDuration

```kotlin
val allowExceedingMaxDuration: Boolean = false
```

### captureCount

```kotlin
val captureCount: CaptureCount
```

### captureType

```kotlin
val captureType: CaptureType
```

### describeContents

```kotlin
open override fun describeContents(): Int
```

### maxTotalDuration

```kotlin
val maxTotalDuration: Duration
```

### photoClipDuration

```kotlin
val photoClipDuration: Duration
```

### recordingColor

```kotlin
val recordingColor: Color
```

### showsPhotoPreview

```kotlin
val showsPhotoPreview: Boolean = true
```

### videoSize

```kotlin
val videoSize: SizeF
```

Dimensions of the recorded video(s) / camera preview.

### writeToParcel

```kotlin
open override fun writeToParcel(parcel: Parcel, flags: Int)
```
