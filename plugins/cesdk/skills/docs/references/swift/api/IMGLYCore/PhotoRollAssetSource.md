# PhotoRollAssetSource

- **Module:** `IMGLYCore`
- **DocC identifier:** `/documentation/IMGLYCore/PhotoRollAssetSource`

A custom asset source that provides access to the device’s photo library. This asset source allows users to browse and select images and videos from their photo library. `PhotoRollAssetSource` is automatically registered by each editor solution’s default `loadAssetSources` callback. By default, it operates in photos picker mode (no permissions required).

```swift
class PhotoRollAssetSource
```

## Members

### add(asset:)

```swift
func add(asset: AssetDefinition) throws
```

### apply(asset:)

```swift
func apply(asset: AssetResult) async throws -> NSNumber?
```

### applyToBlock(asset:block:)

```swift
func applyToBlock(asset: AssetResult, block: DesignBlockID) async throws
```

### credits

```swift
nonisolated var credits: AssetCredits? { get }
```

### findAssets(queryData:)

```swift
func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult
```

### getGroups()

```swift
func getGroups() async throws -> [String]
```

### id-swift.property

```swift
nonisolated var id: String { get }
```

### id-swift.type.property

```swift
static let id: String
```

### init(engine:mode:)

```swift
@MainActor init(engine: Engine, mode: PhotoRollAssetSourceMode = .photosPicker)
```

Creates a photo roll asset source. `engine`

### license

```swift
nonisolated var license: AssetLicense? { get }
```

### supportedMIMETypes

```swift
nonisolated var supportedMIMETypes: [String]? { get }
```
