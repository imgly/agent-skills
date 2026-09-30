# FillRule

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/FillRule`

Fill rule for resolving self-intersecting or overlapping subpaths of a vector path shape. Use [`key`](fillrule/key.md) with [`setEnum(_:property:value:)`](blockapi/setenum(_:property:value:).md) on `shape/vector_path/fillRule`.

```swift
enum FillRule
```

## Members

### FillRule.evenOdd

```swift
case evenOdd
```

### FillRule.nonZero

```swift
case nonZero
```

### init(rawValue:)

```swift
init?(rawValue: String)
```

### key

```swift
var key: String { get }
```
