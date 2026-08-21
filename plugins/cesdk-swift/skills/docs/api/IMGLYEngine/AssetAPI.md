# AssetAPI

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetAPI`

```swift
@MainActor final class AssetAPI
```

## Members

### addAsset(to:asset:)

```swift
@MainActor func addAsset(to sourceID: String, asset: AssetDefinition) throws
```

Adds the given asset to an asset source. `sourceID`

### addAsset(toSource:asset:)

> **Deprecated:** Use 'addAsset(to:asset:)' instead. Renamed to `addAsset(to:asset:)`.

```swift
@MainActor func addAsset(toSource sourceID: String, asset: AssetDefinition) throws
```

Adds the given asset to an asset source. `sourceID`

### addLocalAssetSourceFromJSON(_:basePath:matcher:)

```swift
@MainActor func addLocalAssetSourceFromJSON(_ contentJSON: String, basePath: String? = nil, matcher: [String]? = nil) throws -> String
```

Adds a local asset source from JSON content. `contentJSON`

### addLocalAssetSourceFromJSON(_:matcher:)

```swift
@MainActor func addLocalAssetSourceFromJSON(_ contentURL: URL, matcher: [String]? = nil) async throws -> String
```

Adds a local asset source from a JSON URL. `contentURL`

### addLocalAssetSourceFromJSONString(contentJSON:basePath:matcher:)

> **Deprecated:** Use 'addLocalAssetSourceFromJSON(_:basePath:matcher:)' instead. Renamed to `addLocalAssetSourceFromJSON(_:basePath:matcher:)`.

```swift
@MainActor func addLocalAssetSourceFromJSONString(contentJSON: String, basePath: String? = nil, matcher: [String]? = nil) throws -> String
```

Adds a local asset source from JSON content. `contentJSON`

### addLocalAssetSourceFromJSONURI(contentURI:matcher:)

> **Deprecated:** Use 'addLocalAssetSourceFromJSON(_:matcher:)' instead. Renamed to `addLocalAssetSourceFromJSON(_:matcher:)`.

```swift
@MainActor func addLocalAssetSourceFromJSONURI(contentURI: String, matcher: [String]? = nil) async throws -> String
```

Adds a local asset source from a JSON URI. `contentURI`

### addLocalSource(sourceID:supportedMimeTypes:applyAsset:applyAssetToBlock:)

```swift
@MainActor func addLocalSource(sourceID: String, supportedMimeTypes: [String]? = nil, applyAsset: (@Sendable (AssetResult) async throws -> DesignBlockID?)? = nil, applyAssetToBlock: (@Sendable (AssetResult, DesignBlockID) async throws -> Void)? = nil) throws
```

Adds a local asset source. Its ID has to be unique. `sourceID`

### addSource(_:)

```swift
@MainActor func addSource(_ source: any AssetSource) throws
```

Adds a custom asset source. Its ID has to be unique. `source`

### apply(sourceID:assetResult:)

```swift
@MainActor func apply(sourceID: String, assetResult: AssetResult) async throws -> DesignBlockID?
```

Apply an asset result to the active scene. The default behavior will instantiate a block and configure it according to the asset’s properties. `sourceID`

### applyAssetSourceProperty(sourceID:assetResult:property:)

```swift
@MainActor func applyAssetSourceProperty(sourceID: String, assetResult: AssetResult, property: AssetProperty) async throws
```

Apply a property change for an asset from the given source. `sourceID`

### applyToBlock(sourceID:assetResult:block:)

```swift
@MainActor func applyToBlock(sourceID: String, assetResult: AssetResult, block: DesignBlockID) async throws
```

Apply an asset result to the given block. `sourceID`

### assetSourceContentsChanged(sourceID:)

```swift
@MainActor func assetSourceContentsChanged(sourceID: String) throws
```

Notifies the engine that the contents of an asset source changed. `sourceID`

### canManageAssets(sourceID:)

```swift
@MainActor func canManageAssets(sourceID: String) -> Bool
```

### defaultApplyAsset(assetResult:)

```swift
@MainActor func defaultApplyAsset(assetResult: AssetResult) async throws -> DesignBlockID?
```

The default implementation for applying an asset to the scene. This implementation is used when no `applyAsset` function is provided to `addSource`. `assetResult`

### defaultApplyAssetToBlock(assetResult:block:)

```swift
@MainActor func defaultApplyAssetToBlock(assetResult: AssetResult, block: DesignBlockID) async throws
```

The default implementation for applying an asset to an existing block. This implementation is used when no `applyAssetToBlock` function is provided to `addSource`. `assetResult`

### fetchAsset(sourceID:assetID:options:)

```swift
@MainActor func fetchAsset(sourceID: String, assetID: String, options: FetchAssetOptions = .init()) async throws -> AssetResult?
```

Fetches an asset from the asset source. `sourceID`

### findAllSources()

```swift
@MainActor func findAllSources() -> [String]
```

Finds all registered asset sources. A list with the IDs of all registered asset sources.

### findAssets(sourceID:query:)

```swift
@MainActor func findAssets(sourceID: String, query: AssetQueryData) async throws -> AssetQueryResult
```

Finds assets of a given type in a specific asset source. `sourceID`

### getCredits(sourceID:)

```swift
@MainActor func getCredits(sourceID: String) -> AssetCredits?
```

Queries the asset source’s credits info. `sourceID`

### getGroups(sourceID:)

```swift
@MainActor func getGroups(sourceID: String) async throws -> [String]
```

Queries the asset source’s groups for a certain asset type. `sourceID`

### getLicense(sourceID:)

```swift
@MainActor func getLicense(sourceID: String) -> AssetLicense?
```

Queries the asset source’s license info. `sourceID`

### getSupportedMIMETypes(sourceID:)

```swift
@MainActor func getSupportedMIMETypes(sourceID: String) throws -> [String]
```

Queries the list of supported mime types of the specified asset source. `sourceID`

### onAssetSourceAdded

```swift
@MainActor var onAssetSourceAdded: AsyncStream<String> { get }
```

Subscribe to changes whenever an asset source is added.

### onAssetSourceAddedPublisher

```swift
@MainActor var onAssetSourceAddedPublisher: AnyPublisher<String, Never> { get }
```

Subscribe to changes whenever an asset source is added.

### onAssetSourceRemoved

```swift
@MainActor var onAssetSourceRemoved: AsyncStream<String> { get }
```

Subscribe to changes whenever an asset source is removed.

### onAssetSourceRemovedPublisher

```swift
@MainActor var onAssetSourceRemovedPublisher: AnyPublisher<String, Never> { get }
```

Subscribe to changes whenever an asset source is removed.

### onAssetSourceUpdated

```swift
@MainActor var onAssetSourceUpdated: AsyncStream<String> { get }
```

Subscribe to changes whenever asset source’s content is updated.

### onAssetSourceUpdatedPublisher

```swift
@MainActor var onAssetSourceUpdatedPublisher: AnyPublisher<String, Never> { get }
```

Subscribe to changes whenever asset source’s content is updated.

### removeAsset(from:assetID:)

```swift
@MainActor func removeAsset(from sourceID: String, assetID: String) throws
```

Removes the specified asset from its asset source. `sourceID`

### removeAsset(fromSource:assetID:)

> **Deprecated:** Use 'removeAsset(from:assetID:)' instead. Renamed to `removeAsset(from:assetID:)`.

```swift
@MainActor func removeAsset(fromSource sourceID: String, assetID: String) throws
```

Removes the specified asset from its asset source. `sourceID`

### removeSource(sourceID:)

```swift
@MainActor func removeSource(sourceID: String) throws
```

Removes an asset source with the given ID. `sourceID`
