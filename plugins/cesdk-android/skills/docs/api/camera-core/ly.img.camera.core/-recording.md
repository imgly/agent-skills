# Recording

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

A camera recording.

```kotlin
data class Recording(val videos: List<Video>, val duration: Duration) : Parcelable
```


## Members

### Recording

```kotlin
constructor(parcel: Parcel)
```

```kotlin
constructor(videos: List<Video>, duration: Duration)
```

### describeContents

```kotlin
open override fun describeContents(): Int
```

### duration

```kotlin
val duration: Duration
```

### videos

```kotlin
val videos: List<Video>
```

### writeToParcel

```kotlin
open override fun writeToParcel(parcel: Parcel, flags: Int)
```
