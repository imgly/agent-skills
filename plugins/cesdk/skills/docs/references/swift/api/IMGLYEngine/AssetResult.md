# AssetResult

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetResult`

Single asset result of a query from the engine.

```swift
@objcMembers final class AssetResult
```

## Members

### active

```swift
let active: Bool
```

If the asset is marked as active, i.e., used in a currently selected element.

### context

```swift
let context: AssetContext
```

Context how an asset was added or shall be used in the future. This is added to all assets coming from the engine.

### credits

```swift
let credits: AssetCredits?
```

Credits for the artist of the asset.

### init(id:locale:label:tags:active:meta:payload:context:groups:credits:license:utm:)

```swift
init(id: String, locale: Locale? = nil, label: String? = nil, tags: [String]? = nil, active: Bool = false, meta: [String : String]? = nil, payload: AssetPayload? = nil, context: AssetContext, groups: Groups? = nil, credits: AssetCredits? = nil, license: AssetLicense? = nil, utm: AssetUTM? = nil)
```

Initializes single asset result of a query from the engine. `id`

### isEqual(_:)

```swift
override func isEqual(_ object: Any?) -> Bool
```

### label

```swift
let label: String?
```

The label of the result. Used for description and tooltips.

### license

```swift
let license: AssetLicense?
```

License for this asset. Overwrites the source license if present.

### locale

```swift
let locale: Locale?
```

The locale of the label and tags.

### tags

```swift
let tags: [String]?
```

The tags of this asset. Used for filtering and free-text searching.

### utm

```swift
let utm: AssetUTM?
```

UTM parameters for the links inside the credits.
