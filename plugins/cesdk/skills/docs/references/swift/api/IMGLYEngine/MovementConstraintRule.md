# MovementConstraintRule

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/MovementConstraintRule`

A movement constraint rule. The `scope` determines which blocks the rule applies to; `overshoot` is a non-negative fraction of the moved block’s own size.

```swift
struct MovementConstraintRule
```

## Members

### init(overshoot:scope:)

```swift
init(overshoot: Float, scope: MovementConstraintScope = .scene)
```

### overshoot

```swift
let overshoot: Float
```

The fraction of the block’s own size that it is allowed to extend past the page bounds during user interactions.

### scope

```swift
let scope: MovementConstraintScope
```

The scope this rule applies to.
