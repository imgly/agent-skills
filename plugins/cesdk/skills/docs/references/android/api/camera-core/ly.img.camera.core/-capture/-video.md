# Video

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

A video capture, wrapping an existing Recording.

```kotlin
data class Video(val recording: Recording) : Capture
```


## Members

### Video

```kotlin
constructor(recording: Recording)
```

### recording

```kotlin
val recording: Recording
```

### writeToParcel

```kotlin
open override fun writeToParcel(dest: Parcel, flags: Int)
```
