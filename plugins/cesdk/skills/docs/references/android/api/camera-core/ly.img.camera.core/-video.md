# Video

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

A video in a Recording.

```kotlin
data class Video(val uri: Uri, val rect: RectF) : Parcelable
```


## Members

### Video

```kotlin
constructor(parcel: Parcel)
```

```kotlin
constructor(uri: Uri, rect: RectF)
```

### describeContents

```kotlin
open override fun describeContents(): Int
```

### rect

```kotlin
val rect: RectF
```

### uri

```kotlin
val uri: Uri
```

### writeToParcel

```kotlin
open override fun writeToParcel(parcel: Parcel, flags: Int)
```
