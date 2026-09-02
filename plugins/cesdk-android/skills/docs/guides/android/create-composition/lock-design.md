> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Lock Design](./lock-design.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-lock-design/LockDesign.kt reference-only
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GlobalScope
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

suspend fun lockDesign(
    engine: Engine,
    restoreGlobalScopes: Boolean = false,
) = withContext(engine.dispatcher) {
    val previousGlobalScopes = if (restoreGlobalScopes) {
        engine.editor.findAllScopes().associateWith { scope ->
            engine.editor.getGlobalScope(key = scope)
        }
    } else {
        emptyMap()
    }

    try {
        val scene = engine.scene.create()

        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(page, value = 800F)
        engine.block.setHeight(page, value = 600F)
        engine.block.appendChild(parent = scene, child = page)

        val textBlock = engine.block.create(DesignBlockType.Text)
        engine.block.appendChild(parent = page, child = textBlock)
        engine.block.setWidthMode(textBlock, mode = SizeMode.AUTO)
        engine.block.setHeightMode(textBlock, mode = SizeMode.AUTO)
        engine.block.replaceText(textBlock, text = "Editable headline")

        val imageBlock = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionY(imageBlock, value = 160F)
        engine.block.setWidth(imageBlock, value = 300F)
        engine.block.setHeight(imageBlock, value = 200F)
        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setString(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = "https://img.ly/static/ubq_samples/sample_1.jpg",
        )
        engine.block.setFill(imageBlock, fill = imageFill)
        engine.block.appendChild(parent = page, child = imageBlock)
        engine.block.forceLoadResources(listOf(textBlock, imageBlock))

        val scopes = engine.editor.findAllScopes()
        scopes.forEach { scope ->
            engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DENY)
        }

        engine.editor.setGlobalScope(key = "editor/select", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(textBlock, key = "editor/select", enabled = true)
        engine.block.setScopeEnabled(imageBlock, key = "editor/select", enabled = true)

        engine.editor.setGlobalScope(key = "text/edit", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "text/character", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(textBlock, key = "text/edit", enabled = true)
        engine.block.setScopeEnabled(textBlock, key = "text/character", enabled = true)
        engine.block.setScopeEnabled(textBlock, key = "fill/change", enabled = true)

        engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(imageBlock, key = "fill/change", enabled = true)

        engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "layer/rotate", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(imageBlock, key = "layer/move", enabled = true)
        engine.block.setScopeEnabled(imageBlock, key = "layer/resize", enabled = true)
        engine.block.setScopeEnabled(imageBlock, key = "layer/rotate", enabled = true)

        val canEditText = engine.block.isAllowedByScope(textBlock, key = "text/edit")
        val canChangeTextColor = engine.block.isAllowedByScope(textBlock, key = "fill/change")
        val canMoveText = engine.block.isAllowedByScope(textBlock, key = "layer/move")
        val canMoveImage = engine.block.isAllowedByScope(imageBlock, key = "layer/move")
        val canResizeImage = engine.block.isAllowedByScope(imageBlock, key = "layer/resize")
        val canRotateImage = engine.block.isAllowedByScope(imageBlock, key = "layer/rotate")
        val textEditScopeEnabled = engine.block.isScopeEnabled(textBlock, key = "text/edit")
        val textEditGlobalScope = engine.editor.getGlobalScope(key = "text/edit")
        require(canEditText)
        require(canChangeTextColor)
        require(!canMoveText)
        require(canMoveImage)
        require(canResizeImage)
        require(canRotateImage)
        require(textEditScopeEnabled)
        require(textEditGlobalScope == GlobalScope.DEFER)

        val availableScopes = engine.editor.findAllScopes()
        val currentScopeSettings = availableScopes.associateWith { scope ->
            engine.editor.getGlobalScope(key = scope)
        }
        require("text/edit" in availableScopes)
        require(currentScopeSettings["text/edit"] == GlobalScope.DEFER)
    } finally {
        previousGlobalScopes.forEach { (scope, globalScope) ->
            engine.editor.setGlobalScope(key = scope, globalScope = globalScope)
        }
    }
}
```

Protect design elements from unwanted modifications using CE.SDK's scope-based permission system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/engine-guides-lock-design)

<EngineReferenceNote {...props} />

CE.SDK uses a two-layer scope system to control editing permissions. Global scopes set defaults for the entire scene, while block-level scopes override when the global setting is `GlobalScope.DEFER`. This enables flexible permission models from fully locked to selectively editable designs.

This guide covers how to lock entire designs, selectively enable specific editing capabilities, and check permissions programmatically.

## Understanding the Scope Permission Model

Scopes control what operations users can perform on design elements. CE.SDK combines global scope settings with block-level settings to determine the final permission.

| Global Scope        | Block Scope | Result    |
| ------------------- | ----------- | --------- |
| `GlobalScope.ALLOW` | any         | Permitted |
| `GlobalScope.DENY`  | any         | Blocked   |
| `GlobalScope.DEFER` | enabled     | Permitted |
| `GlobalScope.DEFER` | disabled    | Blocked   |

Global scopes have three possible values:

- **`GlobalScope.ALLOW`**: The operation is always permitted, regardless of block-level settings
- **`GlobalScope.DENY`**: The operation is always blocked, regardless of block-level settings
- **`GlobalScope.DEFER`**: The permission depends on the block-level scope setting

Block-level scopes are binary: enabled or disabled. They only take effect when the global scope is set to `GlobalScope.DEFER`.

## Locking an Entire Design

To lock all editing operations, iterate through all available scopes and set each to `GlobalScope.DENY`. We use `engine.editor.findAllScopes()` to discover all scope names dynamically.

```kotlin highlight-android-lock-entire-design
val scopes = engine.editor.findAllScopes()
scopes.forEach { scope ->
    engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DENY)
}
```

When all scopes are set to `GlobalScope.DENY`, users cannot modify any aspect of the design. This includes selecting, moving, editing text, or changing any visual properties.

## Enabling Selection for Interactive Blocks

Before users can interact with any block, you must enable the `editor/select` scope. Without selection, users cannot click on or access any blocks, even if other editing capabilities are enabled.

```kotlin highlight-android-enable-selection
engine.editor.setGlobalScope(key = "editor/select", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(textBlock, key = "editor/select", enabled = true)
engine.block.setScopeEnabled(imageBlock, key = "editor/select", enabled = true)
```

Setting the global `editor/select` scope to `GlobalScope.DEFER` delegates the decision to each block. We then enable selection only on the specific blocks users should be able to interact with.

## Selective Locking Patterns

Lock everything first, then selectively enable specific capabilities on chosen blocks. This pattern provides fine-grained control over what users can modify.

### Text-Only Editing

To allow users to edit text content while protecting everything else, enable the `text/edit` scope. For text styling changes like font and size, also enable `text/character`; for text color changes, enable `fill/change`.

```kotlin highlight-android-text-editing
engine.editor.setGlobalScope(key = "text/edit", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "text/character", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(textBlock, key = "text/edit", enabled = true)
engine.block.setScopeEnabled(textBlock, key = "text/character", enabled = true)
engine.block.setScopeEnabled(textBlock, key = "fill/change", enabled = true)
```

Users can now type new text content in the designated text block but cannot move, resize, or delete it.

### Image Replacement

To allow users to swap images while protecting layout and position, enable the `fill/change` scope on placeholder blocks.

```kotlin highlight-android-image-replacement
engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(imageBlock, key = "fill/change", enabled = true)
```

Users can replace the image content but the block's position, dimensions, and other properties remain locked.

### Position Adjustments

To allow repositioning of specific elements, enable `layer/move` and then opt selected blocks into that scope. Add `layer/resize` and `layer/rotate` when users should also change dimensions or rotation.

```kotlin highlight-android-position-adjustments
engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "layer/rotate", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(imageBlock, key = "layer/move", enabled = true)
engine.block.setScopeEnabled(imageBlock, key = "layer/resize", enabled = true)
engine.block.setScopeEnabled(imageBlock, key = "layer/rotate", enabled = true)
```

Users can now move, resize, and rotate the selected image block while the text block remains locked for those operations.

## Checking Permissions

Verify whether operations are permitted using `engine.block.isAllowedByScope()`. This method evaluates both global and block-level settings to return the effective permission state.

```kotlin highlight-android-check-permissions
val canEditText = engine.block.isAllowedByScope(textBlock, key = "text/edit")
val canChangeTextColor = engine.block.isAllowedByScope(textBlock, key = "fill/change")
val canMoveText = engine.block.isAllowedByScope(textBlock, key = "layer/move")
val canMoveImage = engine.block.isAllowedByScope(imageBlock, key = "layer/move")
val canResizeImage = engine.block.isAllowedByScope(imageBlock, key = "layer/resize")
val canRotateImage = engine.block.isAllowedByScope(imageBlock, key = "layer/rotate")
val textEditScopeEnabled = engine.block.isScopeEnabled(textBlock, key = "text/edit")
val textEditGlobalScope = engine.editor.getGlobalScope(key = "text/edit")
require(canEditText)
require(canChangeTextColor)
require(!canMoveText)
require(canMoveImage)
require(canResizeImage)
require(canRotateImage)
require(textEditScopeEnabled)
require(textEditGlobalScope == GlobalScope.DEFER)
```

The distinction between checking methods is:

- `isAllowedByScope()` returns the **effective permission** after evaluating all scope levels
- `isScopeEnabled()` returns only the **block-level setting**
- `getGlobalScope()` returns only the **global setting**

## Discovering Available Scopes

To work with scopes programmatically, you can discover all available scope names and check their current settings.

```kotlin highlight-android-get-scopes
val availableScopes = engine.editor.findAllScopes()
val currentScopeSettings = availableScopes.associateWith { scope ->
    engine.editor.getGlobalScope(key = scope)
}
require("text/edit" in availableScopes)
require(currentScopeSettings["text/edit"] == GlobalScope.DEFER)
```

## Available Scopes Reference

| Scope                    | Description                              |
| ------------------------ | ---------------------------------------- |
| `layer/move`             | Move block position                      |
| `layer/resize`           | Resize block dimensions                  |
| `layer/rotate`           | Rotate block                             |
| `layer/flip`             | Flip block horizontally or vertically    |
| `layer/crop`             | Crop block content                       |
| `layer/opacity`          | Change block opacity                     |
| `layer/blendMode`        | Change blend mode                        |
| `layer/visibility`       | Toggle block visibility                  |
| `layer/clipping`         | Change clipping behavior                 |
| `fill/change`            | Change fill content or text color        |
| `fill/changeType`        | Change fill type                         |
| `stroke/change`          | Change stroke properties                 |
| `shape/change`           | Change shape type                        |
| `text/edit`              | Edit text content                        |
| `text/character`         | Change text styling such as font or size |
| `appearance/adjustments` | Change color adjustments                 |
| `appearance/filter`      | Apply or change filters                  |
| `appearance/effect`      | Apply or change effects                  |
| `appearance/blur`        | Apply or change blur                     |
| `appearance/shadow`      | Apply or change shadows                  |
| `appearance/animation`   | Apply or change animations               |
| `lifecycle/destroy`      | Delete the block                         |
| `lifecycle/duplicate`    | Duplicate the block                      |
| `editor/add`             | Add new blocks                           |
| `editor/select`          | Select blocks                            |

## Troubleshooting

| Issue                              | Cause                                | Solution                                                    |
| ---------------------------------- | ------------------------------------ | ----------------------------------------------------------- |
| Block is still editable            | The global scope is `GlobalScope.ALLOW` | Set the global scope to `GlobalScope.DENY` or `GlobalScope.DEFER` |
| Block is unexpectedly locked       | The global scope is `GlobalScope.DENY`  | Set the global scope to `GlobalScope.DEFER` and enable the block-level scope |
| Users cannot interact with a block | `editor/select` is still locked      | Enable `editor/select` for blocks users should select       |
| Permission check returns `false`   | The code checks the wrong scope level | Use `isAllowedByScope()` for the effective permission       |

## API Reference

| Method | Purpose |
| ------ | ------- |
| `engine.editor.findAllScopes()` | Get all available scope names |
| `engine.editor.setGlobalScope(key=_, globalScope=_)` | Set a global scope to `GlobalScope.ALLOW`, `GlobalScope.DENY`, or `GlobalScope.DEFER` |
| `engine.editor.getGlobalScope(key=_)` | Get the current global setting for one scope |
| `engine.block.setScopeEnabled(block=_, key=_, enabled=_)` | Enable or disable a scope on one block |
| `engine.block.isScopeEnabled(block=_, key=_)` | Check only the block-level scope setting |
| `engine.block.isAllowedByScope(block=_, key=_)` | Check the effective permission after global and block-level scopes are evaluated |

## Next Steps

- [Lock Content](../rules/lock-content.md) - Lock design elements to prevent unwanted modifications using CE.SDK's scope-based permission system
- [Lock Templates](../create-templates/lock.md) - Lock templates for consistent reuse
- [Rules Overview](../rules/overview.md) - Understand the broader rules system



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support