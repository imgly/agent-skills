# ReplaceUriAtScene

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event for replacing the content of the designBlock with uri content. In addition, the uri will be transformed into an ly.img.engine.AssetDefinition and will be added to the asset source represented by uploadAssetSourceType.

```kotlin
class ReplaceUriAtScene(val uploadAssetSourceType: UploadAssetSourceType, val uri: Uri, val designBlock: DesignBlock) : EditorEvent
```


## Members

### ReplaceUriAtScene

```kotlin
constructor(uploadAssetSourceType: UploadAssetSourceType, uri: Uri, designBlock: DesignBlock)
```

### designBlock

```kotlin
val designBlock: DesignBlock
```

### uploadAssetSourceType

```kotlin
val uploadAssetSourceType: UploadAssetSourceType
```

### uri

```kotlin
val uri: Uri
```
