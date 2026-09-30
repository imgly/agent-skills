# Reaction

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Result representing the recordings done by the user using the reaction camera mode.

```kotlin
data class Reaction(val video: Video, val reaction: List<Recording>) : CameraResult
```


## Members

### Reaction

```kotlin
constructor(video: Video, reaction: List<Recording>)
```

### reaction

```kotlin
val reaction: List<Recording>
```

### video

```kotlin
val video: Video
```

### writeToParcel

```kotlin
open override fun writeToParcel(dest: Parcel, flags: Int)
```
