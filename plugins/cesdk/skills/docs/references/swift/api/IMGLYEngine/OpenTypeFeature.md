# OpenTypeFeature

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/OpenTypeFeature`

An OpenType feature setting for a text range, such as `tnum` for tabular figures.

```swift
struct OpenTypeFeature
```

## Members

### init(tag:value:)

```swift
init(tag: String, value: UInt32 = 1)
```

### tag

```swift
let tag: String
```

The four-character OpenType feature tag, such as `tnum`, `ss01` or `zero`.

### value

```swift
let value: UInt32
```

0 turns the feature off, 1 turns it on, and a larger value selects an alternate by its index.
