# UploadAssetSourceType

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library.data`

Same as AssetSourceType but for assets that should be uploaded from your device and that have mime type of mimeTypeFilter.

```kotlin
class UploadAssetSourceType(val sourceId: String, val mimeTypeFilter: String) : AssetSourceType
```


## Members

### UploadAssetSourceType

```kotlin
constructor(sourceId: String, mimeTypeFilter: String)
```

### mimeTypeFilter

```kotlin
val mimeTypeFilter: String
```
