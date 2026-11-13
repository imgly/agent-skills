# AssetDefinition

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetDefinition`

Definition of an assets used if an asset is added to an asset source.

```swift
@objcMembers final class AssetDefinition
```

## Members

### init(id:groups:meta:payload:label:tags:)

```swift
init(id: String, groups: Groups? = nil, meta: [String : String]? = nil, payload: AssetPayload? = nil, label: [Locale : String]? = nil, tags: [Locale : [String]]? = nil)
```

Initializes the definition of an asset. `id`

### isEqual(_:)

```swift
override func isEqual(_ object: Any?) -> Bool
```

### label

```swift
let label: [Locale : String]?
```

Label used to display in aria-label and as a tooltip. Will be also searched in a query and should be localized.

### tags

```swift
let tags: [Locale : [String]]?
```

Tags for this asset. Can be used for filtering, but is also useful for free-text search. Since the label is searched as well as used for tooltips you do not want to overdo it, but still add things which are searched. Thus, it should be localized similar to the `label`.
