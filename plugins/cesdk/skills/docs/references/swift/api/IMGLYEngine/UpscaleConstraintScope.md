# UpscaleConstraintScope

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/UpscaleConstraintScope`

Identifies which blocks an upscale constraint rule applies to.

```swift
enum UpscaleConstraintScope
```

## Members

### UpscaleConstraintScope.block(_:)

```swift
case block(DesignBlockID)
```

A specific block. A rule on a page limits the fill of that page, not the blocks on it.

### UpscaleConstraintScope.scene

```swift
case scene
```

Scene-wide default for every block without a rule of its own.
