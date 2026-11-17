# SizeConstraint

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SizeConstraint`

The smallest and the largest frame size that user interactions can give a block, in design units. A value that is `nil` has no limit on that side.

```swift
struct SizeConstraint
```

## Members

### init(minWidth:maxWidth:minHeight:maxHeight:)

```swift
init(minWidth: Float? = nil, maxWidth: Float? = nil, minHeight: Float? = nil, maxHeight: Float? = nil)
```

### maxHeight

```swift
var maxHeight: Float?
```

The largest height.

### maxWidth

```swift
var maxWidth: Float?
```

The largest width.

### minHeight

```swift
var minHeight: Float?
```

The smallest height.

### minWidth

```swift
var minWidth: Float?
```

The smallest width.
