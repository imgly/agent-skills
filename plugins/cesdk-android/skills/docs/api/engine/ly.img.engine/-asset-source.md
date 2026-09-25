# AssetSource

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
abstract class AssetSource(val sourceId: String)
```


## Members

### AssetSource

```kotlin
constructor(sourceId: String)
```

### addAsset

```kotlin
open fun addAsset(asset: AssetDefinition)
```

Custom implementation of adding asset to asset source. This method will be invoked when ly.img.engine.AssetApi.addAsset is called for current sourceId.

### applyAssetProperty

```kotlin
open suspend fun applyAssetProperty(asset: Asset, property: AssetProperty)
```

Custom implementation of applying asset properties to the active scene. It is required to override this method only in case a property needs to be applied. Implementation can be invoked via ly.img.engine.AssetApi.applyAssetSourceProperty where sourceId should be the sourceId of this AssetSource.

### applyAsset

```kotlin
open suspend fun applyAsset(asset: Asset): DesignBlock?
```

```kotlin
open suspend fun applyAsset(asset: Asset, block: DesignBlock)
```

Custom implementation of applying asset to the active scene. It is required to override this method only in case the asset needs to be applied differently compared to ly.img.engine.AssetApi.defaultApplyAsset. Implementation can be invoked via ly.img.engine.AssetApi.applyAssetSourceAsset where sourceId should be the sourceId of this AssetSource. If no custom implementation is provided, ly.img.engine.AssetApi.applyAssetSourceAsset will invoke ly.img.engine.AssetApi.defaultApplyAsset instead.

### credits

```kotlin
open val credits: AssetCredits? = null
```

Returns the credits info of this asset source. By default it is null.

### fetchAsset

```kotlin
open suspend fun fetchAsset(id: String, options: FetchAssetOptions = FetchAssetOptions()): Asset?
```

Fetches an asset from the asset source. Implementation of this method is required to use ly.img.engine.AssetApi.fetchAsset. By default returns null.

### findAssets

```kotlin
abstract suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult
```

Searches assets based on the query. Implementations should apply FindAssetsQuery.filter in addition to the legacy query fields. If FindAssetsQuery.facets is non-empty, the implementation may additionally populate FindAssetsResult.facets with value distributions for any subset of the requested paths — ideally computed over the matched set, e.g. by mapping the request to the backend's native faceting (Algolia facets, Elasticsearch aggregations, SQL GROUP BY). Omitting a requested path signals that this source did not compute that facet; returned keys that were not requested are dropped.

### getGroups

```kotlin
abstract suspend fun getGroups(): List<String>?
```

Specifies all the available groups in this asset source.

### license

```kotlin
open val license: AssetLicense? = null
```

Returns the license info of this asset source. By default it is null.

### removeAsset

```kotlin
open fun removeAsset(assetId: String)
```

Custom implementation of removing asset from asset source. This method will be invoked when ly.img.engine.AssetApi.removeAsset is called for current sourceId.

### sourceId

```kotlin
val sourceId: String
```

### supportedMimeTypes

```kotlin
open val supportedMimeTypes: List<String>
```

Returns the list of supported mime types of the asset source.
