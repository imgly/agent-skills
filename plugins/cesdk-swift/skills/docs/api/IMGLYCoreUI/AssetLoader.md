# AssetLoader

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLoader`

A loader that fetches asset data from asset sources.

```swift
@MainActor struct AssetLoader
```

## Members

### AssetLoader.QueryData

```swift
struct QueryData
```

A wrapper for `IMGLYEngine.AssetQueryData` without explicit page handling.

### AssetLoader.SourceData

```swift
struct SourceData
```

An asset source definition.

### SourceData.config

```swift
let config: AssetLoader.QueryData
```

The configuration query to limit the results of this asset source.

### QueryData.excludedGroups

```swift
let excludedGroups: Groups?
```

Filter out assets with this groups.

### QueryData.groups

```swift
let groups: Groups?
```

Query only these groups.

### SourceData.id

```swift
let id: String
```

The asset source ID.

### SourceData.init(defaultSource:config:)

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. \
    Use 'init(id:config:)' with a raw v5 asset source ID string instead.
    

```swift
init(defaultSource: Engine.DefaultAssetSource, config: AssetLoader.QueryData = .init())
```

Creates an asset source definition for default asset sources. `defaultSource`

### SourceData.init(demoSource:config:)

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. \
    Use 'init(id:config:)' with a raw asset source ID string instead.
    

```swift
init(demoSource: Engine.DemoAssetSource, config: AssetLoader.QueryData = .init())
```

Creates an asset source definition for demo asset sources. `demoSource`

### SourceData.init(id:config:)

```swift
init(id: String, config: AssetLoader.QueryData = .init())
```

Creates an asset source definition. `id`

### QueryData.init(query:tags:groups:excludedGroups:locale:sortingOrder:sortKey:sortActiveFirst:)

```swift
init(query: String? = nil, tags: [String]? = nil, groups: Groups? = nil, excludedGroups: Groups? = nil, locale: Locale? = Locale.currentLanguageCode, sortingOrder: SortingOrder = .none, sortKey: SortKey? = nil, sortActiveFirst: Bool = false)
```

Initializes a request for querying assets. `query`

### QueryData.locale

```swift
let locale: Locale?
```

Choose the locale of the label and tags for localized search and filtering.

### QueryData.query

```swift
let query: String?
```

A query string used for (fuzzy) searching of labels and tags.

### QueryData.sortActiveFirst

```swift
let sortActiveFirst: Bool
```

Sort assets that are marked as active first.

### QueryData.sortingOrder

```swift
let sortingOrder: SortingOrder
```

The order to sort by if the asset source supports sorting. If set to None, the order is the same as the assets were added to the source.

### QueryData.sortKey

```swift
let sortKey: SortKey?
```

The key that identifies the meta data value to sort by or ‘id’ to sort by the asset ID. If empty, the assets are sorted by the index.

### QueryData.tags

```swift
let tags: [String]?
```

Tags are searched with the query parameter, but this search is fuzzy. If one needs to get assets with exactly the tag (from a tag cloud or filter) this query parameter should be used.
