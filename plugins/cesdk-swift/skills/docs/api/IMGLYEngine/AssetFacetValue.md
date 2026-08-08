# AssetFacetValue

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetFacetValue`

One bucket of a facet distribution: a property value and how many matched assets carry it.

```swift
@objcMembers final class AssetFacetValue
```

## Members

### count

```swift
let count: Int?
```

Number of matched assets carrying this value. Always set by local sources; custom sources may omit it when counting is expensive.

### countNumber

```swift
var countNumber: NSNumber? { get }
```

Engine bridge form of [`count`](count.md). Not intended for app use.

### hash

```swift
override var hash: Int { get }
```

### init(value:count:)

```swift
init(value: String, count: Int? = nil)
```

Initializes one bucket of a facet distribution. `value`

### init(value:countNumber:)

```swift
convenience init(value: String, countNumber: NSNumber?)
```

Engine bridge initializer. Not intended for app use.

### isEqual(_:)

```swift
override func isEqual(_ object: Any?) -> Bool
```

### value

```swift
let value: String
```

Raw value exactly as stored on the assets (no casing or locale normalization).
