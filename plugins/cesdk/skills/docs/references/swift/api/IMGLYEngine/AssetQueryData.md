# AssetQueryData

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetQueryData`

Defines a request for querying assets

```swift
@objcMembers final class AssetQueryData
```

## Members

### excludedGroups

```swift
let excludedGroups: Groups?
```

Filter out assets with this groups.

### facets

```swift
let facets: [AssetFacetPath]?
```

Facet distributions to compute over the matched (pre-pagination) set, e.g. to populate filter dropdowns. Local sources compute facets automatically; custom sources may fulfill any subset of the request. Combine with `perPage: 0` to enumerate values without fetching assets. See [`facets`](../assetqueryresult/facets.md).

### filter

```swift
let filter: [AssetFilter]?
```

Structured filter, AND-combined with the `query`, `tags`, `groups`, and `excludedGroups` fields. The entries of the array are implicitly AND-combined. See [`AssetFilter`](../assetfilter.md) for the matching semantics.

### filterJSON

```swift
var filterJSON: String? { get }
```

Engine bridge form of [`filter`](filter.md): the JSON array consumed by the engine’s filter parser. Not intended for app use.

### groups

```swift
let groups: Groups?
```

Query only these groups.

### init(query:page:tags:groups:excludedGroups:locale:perPage:sortingOrder:sortKey:sortActiveFirst:filter:facets:)

```swift
init(query: String?, page: Int, tags: [String]? = nil, groups: Groups? = nil, excludedGroups: Groups? = nil, locale: Locale? = nil, perPage: Int, sortingOrder: SortingOrder = .none, sortKey: SortKey? = nil, sortActiveFirst: Bool = false, filter: [AssetFilter]? = nil, facets: [AssetFacetPath]? = nil)
```

Initializes a request for querying assets. `query`

### init(query:page:tags:groups:excludedGroups:locale:perPage:sortingOrder:sortKey:sortActiveFirst:filterJSON:facets:)

```swift
convenience init?(query: String?, page: Int, tags: [String]?, groups: Groups?, excludedGroups: Groups?, locale: Locale?, perPage: Int, sortingOrder: SortingOrder, sortKey: SortKey?, sortActiveFirst: Bool, filterJSON: String?, facets: [AssetFacetPath]?)
```

Engine bridge initializer. `filterJSON` is the JSON array wire form of [`filter`](filter.md). Fails when `filterJSON` cannot be decoded, so that a malformed filter fails the query instead of being silently dropped. Not intended for app use.

### locale

```swift
let locale: Locale?
```

Choose the locale of the label and tags for localized search and filtering. For local asset sources, labels and tags are resolved using a fallback chain: requested locale → “en” → first available entry → empty default.

### page

```swift
let page: Int
```

The current page queried for paginated views.

### perPage

```swift
let perPage: Int
```

The number of results queried. How many assets shall be returned regardless of the total number of assets available. Together with `page` this can be used for pagination.

### query

```swift
let query: String?
```

A query string used for (fuzzy) searching of labels and tags.

### sortActiveFirst

```swift
let sortActiveFirst: Bool
```

Sort assets that are marked as active first.

### sortingOrder

```swift
let sortingOrder: SortingOrder
```

The order to sort by if the asset source supports sorting. If set to None, the order is the same as the assets were added to the source.

### sortKey

```swift
let sortKey: SortKey?
```

The key that identifies the meta data value to sort by or ‘id’ to sort by the asset ID. If empty, the assets are sorted by the index.

### tags

```swift
let tags: [String]?
```

Tags are searched with the query parameter, but this search is fuzzy. If one needs to get assets with exactly the tag (from a tag cloud or filter) this query parameter should be used.
