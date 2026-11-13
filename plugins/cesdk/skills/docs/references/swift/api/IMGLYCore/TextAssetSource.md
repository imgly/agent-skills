# TextAssetSource

- **Module:** `IMGLYCore`
- **DocC identifier:** `/documentation/IMGLYCore/TextAssetSource`

> **Deprecated:** Use the default text sources: ly.img.text, .styles, .curves, .components.

A legacy custom asset source that applies a fixed font weight and size (Title / Headline / Body) when applied to a text block. The default text library now uses the split text sources (`ly.img.text` for plain-text presets, plus `ly.img.text.styles`, `ly.img.text.curves`, and `ly.img.text.components`) and no longer references this source. It is retained only for integrations that still register it explicitly; new integrations should use the split text sources instead.

```swift
final class TextAssetSource
```

## Members

### apply(asset:)

> **Deprecated:** Use the default text sources: ly.img.text, .styles, .curves, .components.

```swift
@MainActor func apply(asset: AssetResult) async throws -> NSNumber?
```

### credits

> **Deprecated:** Use the default text sources: ly.img.text, .styles, .curves, .components.

```swift
var credits: AssetCredits? { get }
```

### fetchAsset(id:options:)

> **Deprecated:** Use the default text sources: ly.img.text, .styles, .curves, .components.

```swift
func fetchAsset(id: String, options _: FetchAssetOptions) async throws -> AssetResult?
```

### findAssets(queryData:)

> **Deprecated:** Use the default text sources: ly.img.text, .styles, .curves, .components.

```swift
func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult
```

### id-swift.property

```swift
var id: String { get }
```

### id-swift.type.property

```swift
static let id: String
```

### init(engine:typeface:)

> **Deprecated:** Use the default text sources: ly.img.text, .styles, .curves, .components.

```swift
init(engine: Engine, typeface: Typeface) throws
```

Creates a text asset source with a typeface. `engine`

### init(engine:typefaceName:typefaceSourceID:)

> **Deprecated:** Use the default text sources: ly.img.text, .styles, .curves, .components.

```swift
@MainActor convenience init(engine: Engine, typefaceName: String = "Roboto", typefaceSourceID: String = "ly.img.typeface") async throws
```

Creates a text asset source and fetches the used typeface from another asset source. `engine`

### license

> **Deprecated:** Use the default text sources: ly.img.text, .styles, .curves, .components.

```swift
var license: AssetLicense? { get }
```

### supportedMIMETypes

> **Deprecated:** Use the default text sources: ly.img.text, .styles, .curves, .components.

```swift
var supportedMIMETypes: [String]? { get }
```
