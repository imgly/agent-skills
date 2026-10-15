# AssetQueryResult

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetQueryResult`

Return type of a `findAssets` query.

```swift
@objcMembers final class AssetQueryResult
```

## Members

### assets

```swift
let assets: [AssetResult]
```

The assets in the requested page.

### currentPage

```swift
let currentPage: Int
```

The current, requested page.

### facets

```swift
let facets: [String : [AssetFacetValue]]?
```

Distributions for the requested facet paths, keyed by the exact requested path string (`"groups"`, `"tags"`, `"meta.<key>"`). Each list is ordered by count descending, ties by value ascending. A missing key signals the source did not compute that facet; `nil` when no facets were requested or none were computed.

### init(assets:currentPage:nextPage:total:facets:)

```swift
init(assets: [AssetResult], currentPage: Int, nextPage: Int = -1, total: Int, facets: [String : [AssetFacetValue]]? = nil)
```

Initializes the return type of a `findAssets` query. `assets`

### isEqual(_:)

```swift
override func isEqual(_ object: Any?) -> Bool
```

### nextPage

```swift
let nextPage: Int
```

The next page to query if it exists.

### total

```swift
let total: Int
```

How many assets are there in total for the current query regardless of the page.
