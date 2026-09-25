# AssetApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
interface AssetApi
```


## Members

### addAsset

```kotlin
abstract fun addAsset(sourceId: String, asset: AssetDefinition)
```

Adds the given asset to a local asset source.

### addLocalSourceFromJSON

```kotlin
abstract fun addLocalSourceFromJSON(contentJSON: String, basePath: String? = null, matcher: List<String>? = null): String
```

```kotlin
abstract suspend fun addLocalSourceFromJSON(contentUri: Uri, matcher: List<String>? = null): String
```

Creates a new local asset source from a JSON string containing asset definitions. The JSON structure should contain a version field, an id field specifying the asset source identifier, and an assets array with asset definitions. Each asset should have an id, localized label object, and a meta object containing asset-specific properties like uri, thumbUri, blockType, etc.

### addLocalSource

```kotlin
abstract fun addLocalSource(sourceId: String, supportedMimeTypes: List<String>, applyAsset: (suspend (Asset) -> DesignBlock?)? = null, applyAssetToBlock: (suspend (Asset, DesignBlock) -> Unit)? = null)
```

Adds a local asset source. Its ID has to be unique.

### addSource

```kotlin
abstract fun addSource(source: AssetSource)
```

Adds a custom asset source. Its ID has to be unique.

### applyAssetSourceAsset

```kotlin
abstract suspend fun applyAssetSourceAsset(sourceId: String, asset: Asset): DesignBlock?
```

```kotlin
abstract suspend fun applyAssetSourceAsset(sourceId: String, asset: Asset, block: DesignBlock)
```

Applies an asset to the active scene using custom AssetSource.applyAsset function.

### applyAssetSourceProperty

```kotlin
abstract suspend fun applyAssetSourceProperty(sourceId: String, asset: Asset, property: AssetProperty)
```

Apply an asset property.

### assetSourceContentsChanged

```kotlin
abstract fun assetSourceContentsChanged(sourceId: String)
```

Notifies the engine that the contents of an asset source changed.

### defaultApplyAsset

```kotlin
abstract suspend fun defaultApplyAsset(asset: Asset): DesignBlock?
```

```kotlin
abstract suspend fun defaultApplyAsset(asset: Asset, block: DesignBlock)
```

This is the default implementation of applying asset to the active scene. This means a design block is instantiated and configured according to the Asset.meta properties.

### fetchAsset

```kotlin
abstract suspend fun fetchAsset(sourceId: String, assetId: String, options: FetchAssetOptions = FetchAssetOptions()): Asset?
```

Fetch a specific asset by ID from an asset source.

### findAllSources

```kotlin
abstract fun findAllSources(): List<String>
```

Finds all registered asset sources.

### findAssets

```kotlin
abstract suspend fun findAssets(sourceId: String, query: FindAssetsQuery): FindAssetsResult
```

Finds assets of a given type in a specific asset source.

### getCredits

```kotlin
abstract fun getCredits(sourceId: String): AssetCredits?
```

Queries the asset source's credits info.

### getGroups

```kotlin
abstract suspend fun getGroups(sourceId: String): List<String>?
```

Queries the asset source's groups for a certain asset type.

### getLicense

```kotlin
abstract fun getLicense(sourceId: String): AssetLicense?
```

Queries the asset source's license info.

### getSourceSupportedMimeTypes

```kotlin
abstract fun getSourceSupportedMimeTypes(sourceId: String): List<String>
```

Get the asset source's list of supported mime types.

### onAssetSourceAdded

```kotlin
abstract fun onAssetSourceAdded(): Flow<String>
```

Subscribe to asset source addition events.

### onAssetSourceRemoved

```kotlin
abstract fun onAssetSourceRemoved(): Flow<String>
```

Subscribe to asset source removal events.

### onAssetSourceUpdated

```kotlin
abstract fun onAssetSourceUpdated(): Flow<String>
```

Subscribe to asset source's content update events.

### removeAsset

```kotlin
abstract fun removeAsset(sourceId: String, assetId: String)
```

Removes the specified asset from its local asset source.

### removeSource

```kotlin
abstract fun removeSource(sourceId: String)
```

Removes an asset source with the given ID.
