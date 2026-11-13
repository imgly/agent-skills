# AssetSourceType

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library.data`

A class that wraps the asset source id and is used in ly.img.editor.core.library.LibraryContent. Note that you should register an asset source or local asset source with the same id as sourceId before using the asset source: ly.img.engine.AssetApi.addSource / ly.img.engine.AssetApi.addLocalSource.

```kotlin
open class AssetSourceType(val sourceId: String)
```


## Members

### AssetSourceType

```kotlin
constructor(sourceId: String)
```

### sourceId

```kotlin
val sourceId: String
```
