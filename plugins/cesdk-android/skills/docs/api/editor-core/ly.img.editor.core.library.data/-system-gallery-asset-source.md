# SystemGalleryAssetSource

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library.data`

Asset source that exposes media from the user's device gallery.

```kotlin
class SystemGalleryAssetSource(context: Context, type: SystemGalleryAssetSourceType) : AssetSource
```


## Members

### SystemGalleryAssetSource

```kotlin
constructor(context: Context, type: SystemGalleryAssetSourceType)
```

### findAssets

```kotlin
open suspend override fun findAssets(query: FindAssetsQuery): FindAssetsResult
```

### getGroups

```kotlin
open suspend override fun getGroups(): List<String>?
```

### supportedMimeTypes

```kotlin
open override val supportedMimeTypes: List<String>
```
