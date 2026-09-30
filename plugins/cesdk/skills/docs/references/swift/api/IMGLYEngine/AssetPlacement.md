# AssetPlacement

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetPlacement`

Where the block created from an asset is placed.

```swift
struct AssetPlacement
```

## Members

### center

```swift
var center: CGPoint?
```

The center of the new block, in design units relative to [`parent`](parent.md). Both coordinates must be finite. `nil` places the block automatically.

### init(parent:center:)

```swift
init(parent: DesignBlockID? = nil, center: CGPoint? = nil)
```

Creates a placement for a block created from an asset. `parent`

### parent

```swift
var parent: DesignBlockID?
```

The block that the new block is added to. `nil` adds it to the current page.
