# AddUriToScene

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event for adding a uri to the scene. In addition, the uri will be transformed into an ly.img.engine.AssetDefinition and will be added to the asset source represented by uploadAssetSourceType.

```kotlin
class AddUriToScene(val uploadAssetSourceType: UploadAssetSourceType, val uri: Uri, val addToBackgroundTrack: Boolean = false) : EditorEvent
```


## Members

### AddUriToScene

```kotlin
constructor(uploadAssetSourceType: UploadAssetSourceType, uri: Uri, addToBackgroundTrack: Boolean = false)
```

### addToBackgroundTrack

```kotlin
val addToBackgroundTrack: Boolean = false
```

### uploadAssetSourceType

```kotlin
val uploadAssetSourceType: UploadAssetSourceType
```

### uri

```kotlin
val uri: Uri
```
