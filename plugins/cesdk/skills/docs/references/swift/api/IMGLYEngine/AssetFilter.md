# AssetFilter

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetFilter`

A structured filter expression evaluated against the assets of a source. Filters are passed via [`filter`](assetquerydata/filter.md) as an array whose entries are implicitly AND-combined, and the combined filter is AND-combined with the query’s `query`, `tags`, `groups`, and `excludedGroups` fields.

```swift
indirect enum AssetFilter
```

## Members

### AssetFilter.and(_:)

```swift
case and([AssetFilter])
```

Matches assets that match every one of the given filters. Must not be empty.

### AssetFilter.contains(property:value:)

```swift
case contains(property: String, value: String)
```

Matches assets whose `property` contains `value` (ASCII-case-insensitive substring match).

### AssetFilter.equals(property:value:)

```swift
case equals(property: String, value: String)
```

Matches assets whose `property` equals `value` (ASCII-case-insensitive exact match).

### AssetFilter.not(_:)

```swift
case not(AssetFilter)
```

Matches assets that do not match the given filter.

### AssetFilter.or(_:)

```swift
case or([AssetFilter])
```

Matches assets that match at least one of the given filters. Must not be empty.

### encode(to:)

```swift
func encode(to encoder: any Encoder) throws
```

### init(from:)

```swift
init(from decoder: any Decoder) throws
```
