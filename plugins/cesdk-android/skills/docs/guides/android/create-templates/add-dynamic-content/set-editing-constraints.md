> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Use Templates](../../create-templates.md) > [Dynamic Content](../add-dynamic-content.md) > [Set Editing Constraints](./set-editing-constraints.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-set-editing-constraints/SetEditingConstraints.kt reference-only
import android.util.Log
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GlobalScope
import ly.img.engine.ShapeType

private const val MOVE_SCOPE = "layer/move"
private const val RESIZE_SCOPE = "layer/resize"
private const val DESTROY_SCOPE = "lifecycle/destroy"
private const val DUPLICATE_SCOPE = "lifecycle/duplicate"

suspend fun setEditingConstraints(engine: Engine): SetEditingConstraintsResult {
    // Demo scaffolding: a scene and page to hold the constrained blocks.
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1200F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    // Keep these scopes deferred so the returned scene uses block-level constraints.
    engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "lifecycle/destroy", globalScope = GlobalScope.DEFER)
    engine.editor.setGlobalScope(key = "lifecycle/duplicate", globalScope = GlobalScope.DEFER)

    // Demo scaffolding: two renderable graphic blocks, constrained independently.
    val positionLocked = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(positionLocked, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(positionLocked, fill = engine.block.createFill(FillType.Color))
    engine.block.setWidth(positionLocked, value = 200F)
    engine.block.setHeight(positionLocked, value = 200F)
    engine.block.appendChild(parent = page, child = positionLocked)

    val deletionLocked = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(deletionLocked, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(deletionLocked, fill = engine.block.createFill(FillType.Color))
    engine.block.setWidth(deletionLocked, value = 200F)
    engine.block.setHeight(deletionLocked, value = 200F)
    engine.block.appendChild(parent = page, child = deletionLocked)

    engine.block.setScopeEnabled(positionLocked, key = "lifecycle/destroy", enabled = true)
    engine.block.setScopeEnabled(positionLocked, key = "lifecycle/duplicate", enabled = true)

    engine.block.setScopeEnabled(positionLocked, key = "layer/resize", enabled = true)
    engine.block.setScopeEnabled(positionLocked, key = "layer/move", enabled = false)

    engine.block.setScopeEnabled(deletionLocked, key = "layer/move", enabled = true)
    engine.block.setScopeEnabled(deletionLocked, key = "layer/resize", enabled = true)
    engine.block.setScopeEnabled(deletionLocked, key = "lifecycle/destroy", enabled = false)
    engine.block.setScopeEnabled(deletionLocked, key = "lifecycle/duplicate", enabled = false)

    val moveScopeEnabled = engine.block.isScopeEnabled(positionLocked, key = "layer/move")
    Log.i("SetEditingConstraints", "layer/move enabled at block level: $moveScopeEnabled")

    val moveAllowed = engine.block.isAllowedByScope(positionLocked, key = "layer/move")
    Log.i("SetEditingConstraints", "layer/move allowed: $moveAllowed")

    val resizeAllowed = engine.block.isAllowedByScope(positionLocked, key = RESIZE_SCOPE)
    val positionLockedDestroyAllowed = engine.block.isAllowedByScope(positionLocked, key = DESTROY_SCOPE)
    val positionLockedDuplicateAllowed = engine.block.isAllowedByScope(positionLocked, key = DUPLICATE_SCOPE)
    val destroyAllowed = engine.block.isAllowedByScope(deletionLocked, key = DESTROY_SCOPE)
    val duplicateAllowed = engine.block.isAllowedByScope(deletionLocked, key = DUPLICATE_SCOPE)
    val deletionLockedMoveAllowed = engine.block.isAllowedByScope(deletionLocked, key = MOVE_SCOPE)

    return SetEditingConstraintsResult(
        availableScopes = engine.editor.findAllScopes(),
        moveScopeEnabled = moveScopeEnabled,
        moveAllowed = moveAllowed,
        resizeAllowed = resizeAllowed,
        positionLockedDestroyAllowed = positionLockedDestroyAllowed,
        positionLockedDuplicateAllowed = positionLockedDuplicateAllowed,
        destroyAllowed = destroyAllowed,
        duplicateAllowed = duplicateAllowed,
        deletionLockedMoveAllowed = deletionLockedMoveAllowed,
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-set-editing-constraints/SetEditingConstraintsResult.kt reference-only
data class SetEditingConstraintsResult(
    val availableScopes: List<String>,
    val moveScopeEnabled: Boolean,
    val moveAllowed: Boolean,
    val resizeAllowed: Boolean,
    val positionLockedDestroyAllowed: Boolean,
    val positionLockedDuplicateAllowed: Boolean,
    val destroyAllowed: Boolean,
    val duplicateAllowed: Boolean,
    val deletionLockedMoveAllowed: Boolean,
)
```

Control what users can edit in templates by setting fine-grained permissions
on individual blocks or globally across the scene with the CE.SDK Scope
system.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260830/engine-guides-set-editing-constraints)

<EngineReferenceNote {...props} />

Editing constraints let you lock specific properties of design elements while keeping others editable. Scopes cover movement, resizing, rotation, fill changes, text editing, lifecycle operations, and other editor capabilities. Use them to protect brand templates, guide template adoption, and build form-based workflows where users can personalize only selected fields.

## Understanding Scopes

### What Are Scopes?

A scope is a permission key that controls one editing capability. Each scope represents a distinct action, such as moving blocks (`"layer/move"`), changing fills (`"fill/change"`), or editing text content (`"text/edit"`).

Scopes exist at two levels:

- **Block-level scopes**: Per-block permissions set with `engine.block.setScopeEnabled(...)`.
- **Global scopes**: Scene-wide defaults set with `engine.editor.setGlobalScope(...)`.

Global scope defaults depend on the editor role. Under the default Creator role, global scopes are allowed, so block-level restrictions are not consulted. To make a block-level setting take effect, set the matching global scope to `GlobalScope.DEFER`, either through your editor role setup or with `engine.editor.setGlobalScope(...)`.

### Available Scope Categories

CE.SDK groups scopes into logical categories. Retrieve the full list at runtime with `engine.editor.findAllScopes()`.

| Category | Purpose | Example Scopes |
| --- | --- | --- |
| **Text Editing** | Control text content and formatting | `text/edit`, `text/character` |
| **Fill & Stroke** | Manage colors, fills, and strokes | `fill/change`, `fill/changeType`, `stroke/change` |
| **Shape** | Modify shape properties | `shape/change` |
| **Layer Transform** | Control position and dimensions | `layer/move`, `layer/resize`, `layer/rotate`, `layer/flip`, `layer/crop` |
| **Layer Appearance** | Manage visual properties | `layer/opacity`, `layer/blendMode`, `layer/visibility`, `layer/clipping` |
| **Effects & Filters** | Apply visual effects | `appearance/adjustments`, `appearance/filter`, `appearance/effect`, `appearance/blur`, `appearance/shadow` |
| **Lifecycle** | Control deletion and duplication | `lifecycle/destroy`, `lifecycle/duplicate` |
| **Editor** | Manage scene-level actions | `editor/add`, `editor/select` |

## Scope Configuration

### Global Scope Modes

Global scopes set the default behavior for all blocks in the scene. They have three modes:

| Mode | Behavior |
| --- | --- |
| `GlobalScope.ALLOW` | Always allow the action, overriding block-level settings |
| `GlobalScope.DENY` | Always deny the action, overriding block-level settings |
| `GlobalScope.DEFER` | Use the block-level setting for each block |

To make block-level constraints take effect, defer the relevant global scopes to the block level:

```kotlin highlight-android-global-scopes
// Keep these scopes deferred so the returned scene uses block-level constraints.
engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "lifecycle/destroy", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "lifecycle/duplicate", globalScope = GlobalScope.DEFER)
```

Defer only the scopes that your app controls at the block level. When a block should keep a deferred capability,
explicitly enable that scope on the block.

### Scope Resolution Priority

When both global and block-level scopes apply, CE.SDK resolves permissions in this order:

1. **Global `GlobalScope.DENY`** blocks the action.
2. **Global `GlobalScope.ALLOW`** permits the action.
3. **Global `GlobalScope.DEFER`** uses the block-level setting for each block.

## Setting Block-Level Constraints

### Locking Position

Prevent users from moving a block while keeping resizing available:

```kotlin highlight-android-lock-position
engine.block.setScopeEnabled(positionLocked, key = "layer/resize", enabled = true)
engine.block.setScopeEnabled(positionLocked, key = "layer/move", enabled = false)
```

Disabling `layer/move` locks the block position. Because the full sample also defers resizing and lifecycle scopes,
the block can still resize, delete, and duplicate when those block-level scopes remain enabled.

### Preventing Deletion

Protect a block from being deleted or duplicated while keeping transform edits available:

```kotlin highlight-android-prevent-deletion
engine.block.setScopeEnabled(deletionLocked, key = "layer/move", enabled = true)
engine.block.setScopeEnabled(deletionLocked, key = "layer/resize", enabled = true)
engine.block.setScopeEnabled(deletionLocked, key = "lifecycle/destroy", enabled = false)
engine.block.setScopeEnabled(deletionLocked, key = "lifecycle/duplicate", enabled = false)
```

Use this for essential template elements that must remain present. Movement and resizing can remain enabled independently because lifecycle scopes are separate permissions.

### Checking Scope State

Query the block-level setting for any scope:

```kotlin highlight-android-check-scope
val moveScopeEnabled = engine.block.isScopeEnabled(positionLocked, key = "layer/move")
Log.i("SetEditingConstraints", "layer/move enabled at block level: $moveScopeEnabled")
```

`engine.block.isScopeEnabled(...)` returns only the block-level flag. It does not consider the current global scope mode.

### Checking Effective Permissions

Check the effective permission after global and block-level settings resolve:

```kotlin highlight-android-check-allowed
val moveAllowed = engine.block.isAllowedByScope(positionLocked, key = "layer/move")
Log.i("SetEditingConstraints", "layer/move allowed: $moveAllowed")
```

Use `engine.block.isAllowedByScope(...)` when your app needs to know whether an action is actually permitted.

## API Reference

| Method | Description |
| --- | --- |
| `engine.editor.findAllScopes()` | List all available scope keys |
| `engine.editor.setGlobalScope(key=_, globalScope=_)` | Set a scope to `GlobalScope.ALLOW`, `GlobalScope.DENY`, or `GlobalScope.DEFER` |
| `engine.editor.getGlobalScope(key=_)` | Read the global setting for one scope |
| `engine.block.setScopeEnabled(block=_, key=_, enabled=_)` | Enable or disable a block-level scope |
| `engine.block.isScopeEnabled(block=_, key=_)` | Check whether a scope is enabled at the block level |
| `engine.block.isAllowedByScope(block=_, key=_)` | Check the resolved permission after global and block-level settings are evaluated |

## Troubleshooting

- **A disabled block scope still appears editable**: Check the matching global scope. `GlobalScope.ALLOW` overrides block-level restrictions, so set that scope to `GlobalScope.DEFER` when the block setting should decide the result.
- **All blocks lose the same editing capability**: Check for `GlobalScope.DENY`. A denied global scope disables that action for every block, even when individual blocks have the scope enabled.
- **Constraints seem to reset after reloading**: Scope settings are stored with the scene. If a reloaded scene behaves differently, verify that your app saved the constrained scene after calling `engine.block.setScopeEnabled(...)`.
- **The editor UI shows unavailable controls**: The CE.SDK editor UI reflects denied scopes by disabling or hiding controls depending on the surface. Use `engine.block.isAllowedByScope(...)` to confirm the resolved permission that the UI should follow.

## Next Steps

- [Text Variables](./text-variables.md) - Define dynamic text elements that can be populated with custom values.
- [Placeholders](./placeholders.md) - Mark editable image, video, or text areas within a locked template layout.
- [Lock the Template](../lock.md) - Restrict editing access to specific elements or properties in a template.
- [Create From Scratch](../from-scratch.md) - Build reusable design templates programmatically using CE.SDK APIs.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support