# FindAssetsResult

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Return type of a findAssets query.

```kotlin
data class FindAssetsResult(val assets: List<Asset>, val currentPage: Int, val nextPage: Int = -1, val total: Int, val facets: Map<String, List<AssetFacetValue>>? = null)
```


## Members

### FindAssetsResult

```kotlin
constructor(assets: List<Asset>, currentPage: Int, nextPage: Int = -1, total: Int, facets: Map<String, List<AssetFacetValue>>? = null)
```

### assets

```kotlin
val assets: List<Asset>
```

The assets for the requested page.

### currentPage

```kotlin
val currentPage: Int
```

The current, requested page.

### facets

```kotlin
val facets: Map<String, List<AssetFacetValue>>? = null
```

Distributions for the requested facet paths (FindAssetsQuery.facets), keyed by the exact requested path string. A missing key signals the source did not compute that facet. Null when no facets were requested or none were computed.

### nextPage

```kotlin
val nextPage: Int
```

The next page that can be queried, -1 if there's no such page.

### total

```kotlin
val total: Int
```

How many assets there are in total for the given query independent of any pages.
