# AddCameraCapturesToScene

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event for adding a heterogeneous capture stack (photos + videos in one camera session) to the scene. When appendToBackgroundTrack is true (default), each capture is appended to the background track — Capture.Photos become image-fill graphic blocks with duration Capture.Photo.clipDuration, and Capture.Videos become video clips. When appendToBackgroundTrack is false, each capture is placed on the current page centered like the gallery picker does — appropriate for design / photo / apparel / postcard editors that don't have a background track. Photos are uploaded to photoUploadAssetSourceType and videos to videoUploadAssetSourceType as ly.img.engine.AssetDefinitions.

```kotlin
class AddCameraCapturesToScene(val photoUploadAssetSourceType: UploadAssetSourceType, val videoUploadAssetSourceType: UploadAssetSourceType, val captures: List<Capture>, val appendToBackgroundTrack: Boolean = true) : EditorEvent
```


## Members

### AddCameraCapturesToScene

```kotlin
constructor(photoUploadAssetSourceType: UploadAssetSourceType, videoUploadAssetSourceType: UploadAssetSourceType, captures: List<Capture>, appendToBackgroundTrack: Boolean = true)
```

### appendToBackgroundTrack

```kotlin
val appendToBackgroundTrack: Boolean = true
```

### captures

```kotlin
val captures: List<Capture>
```

### photoUploadAssetSourceType

```kotlin
val photoUploadAssetSourceType: UploadAssetSourceType
```

### videoUploadAssetSourceType

```kotlin
val videoUploadAssetSourceType: UploadAssetSourceType
```
