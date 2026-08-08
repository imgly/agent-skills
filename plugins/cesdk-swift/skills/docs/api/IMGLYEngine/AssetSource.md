# AssetSource

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetSource`

A source of assets.

```swift
@objc protocol AssetSource : NSObjectProtocol
```

## Members

### add(asset:)

```swift
@objc optional func add(asset: AssetDefinition) throws
```

Adds the given asset to this source.

### apply(asset:)

```swift
@objc optional func apply(asset: AssetResult) async throws -> NSNumber?
```

Apply the given asset result to the active scene. You can override this with custom behavior. the newly created block as `NSNumber` or `nil` if a new block was not created.

### applyAssetProperty(asset:property:)

```swift
@objc optional func applyAssetProperty(asset: AssetResult, property: _ObjCAssetProperty) async throws
```

Apply a property change to the given asset.

### applyToBlock(asset:block:)

```swift
@objc optional func applyToBlock(asset: AssetResult, block: DesignBlockID) async throws
```

Apply the given asset result to the given block. You can override this with custom behavior.

### credits

```swift
var credits: AssetCredits? { get }
```

Credits for the source/API.

### fetchAsset(id:options:)

```swift
@objc optional func fetchAsset(id: String, options: FetchAssetOptions) async throws -> AssetResult?
```

Fetch an asset from the asset source. Implementation of this method is required to use `AssetAPI.fetchAsset` method for this source. `id`

### findAssets(queryData:)

```swift
func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult
```

Find all asset for the given type and the provided query data. The query may carry a structured [`filter`](../assetquerydata/filter.md) and request facet distributions via [`facets`](../assetquerydata/facets.md). A source may fulfill any subset of the requested facets by setting [`facets`](../assetqueryresult/facets.md) on the result; leaving a requested path out (or returning no facets at all) signals that it was not computed. Facets should describe the set of assets matching the query, before pagination.

### getGroups()

```swift
@objc optional func getGroups() async throws -> [String]
```

Return every available group.

### id

```swift
var id: String { get }
```

The unique id of the API.

### license

```swift
var license: AssetLicense? { get }
```

General license for all asset from this source.

### remove(assetID:)

```swift
@objc optional func remove(assetID: String) throws
```

Removes the given asset from this source.

### supportedMIMETypes

```swift
var supportedMIMETypes: [String]? { get }
```

A list of the mime types should be supported by this source

### update(assetID:asset:)

```swift
@objc optional func update(assetID: String, asset: AssetDefinition) throws
```

Updates the asset of this source.
