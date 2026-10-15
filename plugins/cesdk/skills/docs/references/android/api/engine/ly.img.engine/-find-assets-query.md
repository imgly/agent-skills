# FindAssetsQuery

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Search parameters for find asset query.

```kotlin
data class FindAssetsQuery(val perPage: Int, val page: Int, val query: String? = null, val locale: String? = null, val sortingOrder: SortingOrder = SortingOrder.NONE, val sortKey: String? = null, val sortActiveFirst: Boolean = false, val tags: List<String>? = null, val groups: List<String>? = null, val excludeGroups: List<String>? = null, val filter: List<AssetFilter>? = null, val facets: List<String>? = null)
```


## Members

### FindAssetsQuery

```kotlin
constructor(perPage: Int, page: Int, query: String? = null, locale: String? = null, sortingOrder: SortingOrder = SortingOrder.NONE, sortKey: String? = null, sortActiveFirst: Boolean = false, tags: List<String>? = null, groups: List<String>? = null, excludeGroups: List<String>? = null, filter: List<AssetFilter>? = null, facets: List<String>? = null)
```

### excludeGroups

```kotlin
val excludeGroups: List<String>? = null
```

Filter out results which are in these groups.

### facets

```kotlin
val facets: List<String>? = null
```

Facet distributions to compute over the matched (pre-pagination) set, e.g. "groups", "tags" or "meta.language". "label" and "id" are not facetable and fail the query. The computed distributions are returned in FindAssetsResult.facets. Combine with perPage = 0 to enumerate available values without fetching assets.

### filter

```kotlin
val filter: List<AssetFilter>? = null
```

Optional structured filter, AND-combined with the result of the query, tags, groups and excludeGroups fields. The list is an implicit AND of its entries. See AssetFilter for the matching semantics.

### groups

```kotlin
val groups: List<String>? = null
```

Filter by groups.

### locale

```kotlin
val locale: String? = null
```

Controls the locale of the label and tags for localized search. For local asset sources, labels and tags are resolved using a fallback chain: requested locale → "en" → first available entry → empty default.

### page

```kotlin
val page: Int
```

Controls which page to return results for. Indexing starts at 0.

### perPage

```kotlin
val perPage: Int
```

Controls how many results should be returned for the given page.

### query

```kotlin
val query: String? = null
```

If the query string is not empty, it is split into words. Results are filtered by those words appearing in its label and tags.

### sortActiveFirst

```kotlin
val sortActiveFirst: Boolean = false
```

Sort assets that are marked as active first.

### sortKey

```kotlin
val sortKey: String? = null
```

The key that identifies the meta data value to sort by or 'id' to sort by the asset ID. If empty, the assets are sorted by the index.

### sortingOrder

```kotlin
val sortingOrder: SortingOrder
```

The order to sort by if the asset source supports sorting. If set to NONE, the order is the same as the assets were added to the source.

### tags

```kotlin
val tags: List<String>? = null
```

Tags are searched by the query string fuzzily. For exact matches of tags use this parameter.
