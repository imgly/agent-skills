# AddCameraRecordingsToScene

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event for adding camera recordings to the scene. In addition, the recordings will be transformed into ly.img.engine.AssetDefinitions and will be added to the asset source represented by uploadAssetSourceType.

```kotlin
class AddCameraRecordingsToScene(val uploadAssetSourceType: UploadAssetSourceType, val recordings: List<Pair<Uri, Duration>>) : EditorEvent
```
> **Deprecated:** Use AddCameraCapturesToScene, which supports a heterogeneous photo + video capture stack. Replace with `AddCameraCapturesToScene`.


## Members

### AddCameraRecordingsToScene

```kotlin
constructor(uploadAssetSourceType: UploadAssetSourceType, recordings: List<Pair<Uri, Duration>>)
```

### recordings

```kotlin
val recordings: List<Pair<Uri, Duration>>
```

### uploadAssetSourceType

```kotlin
val uploadAssetSourceType: UploadAssetSourceType
```
