# SystemGalleryAssetSourceType

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library.data`

Same as AssetSourceType but for assets from your devices gallery and that have mime types of mimeTypeFilter.

```kotlin
class SystemGalleryAssetSourceType(val sourceId: String, val mimeTypeFilter: List<String> = listOf("image/*", "video/*")) : AssetSourceType
```


## Members

### SystemGalleryAssetSourceType

```kotlin
constructor(sourceId: String, mimeTypeFilter: String)
```

```kotlin
constructor(sourceId: String, mimeTypeFilter: List<String> = listOf("image/*", "video/*"))
```

### hasPermission

```kotlin
fun hasPermission(context: Context): Boolean
```

### mimeTypeFilter

```kotlin
val mimeTypeFilter: List<String>
```
