# MovementConstraintScope

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/MovementConstraintScope`

Identifies which blocks a movement constraint rule applies to. See [`setMovementConstraint(_:)`](editorapi/setmovementconstraint(_:)-9rhj7.md) for how each scope is resolved when a block is being interacted with.

```swift
enum MovementConstraintScope
```

## Members

### MovementConstraintScope.block(_:)

```swift
case block(DesignBlockID)
```

A specific block. Pages are blocks, so setting this on a page acts as the default for blocks inside that page.

### MovementConstraintScope.blockType(_:)

```swift
case blockType(String)
```

Every block of the given type, e.g. `"text"` or `"//ly.img.ubq/text"`.

### MovementConstraintScope.scene

```swift
case scene
```

Scene-wide default for every page in the scene.
