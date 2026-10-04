# Photo

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

A still photo capture written to the app's files directory.

```kotlin
data class Photo(val uri: Uri, val clipDuration: Duration) : Capture
```


## Members

### Photo

```kotlin
constructor(uri: Uri, clipDuration: Duration)
```

### clipDuration

```kotlin
val clipDuration: Duration
```

### uri

```kotlin
val uri: Uri
```

### writeToParcel

```kotlin
open override fun writeToParcel(dest: Parcel, flags: Int)
```
