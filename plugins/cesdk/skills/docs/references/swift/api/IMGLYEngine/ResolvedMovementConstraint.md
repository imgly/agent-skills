# ResolvedMovementConstraint

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/ResolvedMovementConstraint`

The effective movement constraint for a block, or `nil` when no constraint applies.

```swift
struct ResolvedMovementConstraint
```

## Members

### init(overshoot:)

```swift
init(overshoot: Float)
```

### overshoot

```swift
let overshoot: Float
```

The fraction of the block’s own size that it may extend past the page bounds.
