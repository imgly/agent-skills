> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Rules](../rules.md) > [Lock Content](./lock-content.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-lock-content/LockContent.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GlobalScope
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

private data class LockContentBlocks(
    val headline: DesignBlock,
    val mediaPlaceholder: DesignBlock,
    val movableBadge: DesignBlock,
)

data class LockContentResult(
    val canEditHeadline: Boolean,
    val canRestyleHeadline: Boolean,
    val canMoveHeadline: Boolean,
    val canResizeHeadline: Boolean,
    val canReplaceMedia: Boolean,
    val canChangeMediaFillType: Boolean,
    val canMoveMedia: Boolean,
    val canResizeMedia: Boolean,
    val canReplaceBadge: Boolean,
    val canChangeBadgeFillType: Boolean,
    val canMoveBadge: Boolean,
    val canResizeBadge: Boolean,
    val headlineTextScopeEnabled: Boolean,
    val textEditGlobalScope: GlobalScope,
)

data class TemporaryLockContentResult(
    val temporarilyLockedTextEditing: Boolean,
    val temporarilyEnabledSelection: Boolean,
    val globalScopesRestored: Boolean,
    val blockScopesRestored: Boolean,
)

suspend fun lockContent(
    engine: Engine,
    restoreGlobalScopes: Boolean = false,
): LockContentResult {
    val blocks = createLockContentScene(engine)

    val scopes = engine.editor.findAllScopes()
    check("editor/select" in scopes)
    check("text/edit" in scopes)
    check("fill/change" in scopes)
    check("fill/changeType" in scopes)
    check("layer/move" in scopes)

    val originalGlobalScopes = if (restoreGlobalScopes) {
        scopes.associateWith { scope -> engine.editor.getGlobalScope(key = scope) }
    } else {
        emptyMap()
    }

    try {
        scopes.forEach { scope ->
            engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DENY)
        }

        engine.editor.setGlobalScope(key = "editor/select", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(blocks.headline, key = "editor/select", enabled = true)
        engine.block.setScopeEnabled(blocks.mediaPlaceholder, key = "editor/select", enabled = true)
        engine.block.setScopeEnabled(blocks.movableBadge, key = "editor/select", enabled = true)

        engine.editor.setGlobalScope(key = "text/edit", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "text/character", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(blocks.headline, key = "text/edit", enabled = true)
        engine.block.setScopeEnabled(blocks.headline, key = "text/character", enabled = true)

        engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "fill/changeType", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(blocks.mediaPlaceholder, key = "fill/change", enabled = true)
        engine.block.setScopeEnabled(blocks.mediaPlaceholder, key = "fill/changeType", enabled = true)
        engine.block.setScopeEnabled(blocks.movableBadge, key = "fill/change", enabled = false)
        engine.block.setScopeEnabled(blocks.movableBadge, key = "fill/changeType", enabled = false)

        engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
        listOf(blocks.headline, blocks.mediaPlaceholder).forEach { block ->
            engine.block.setScopeEnabled(block, key = "layer/move", enabled = false)
            engine.block.setScopeEnabled(block, key = "layer/resize", enabled = false)
        }
        engine.block.setScopeEnabled(blocks.movableBadge, key = "layer/move", enabled = true)
        engine.block.setScopeEnabled(blocks.movableBadge, key = "layer/resize", enabled = true)

        val result = LockContentResult(
            canEditHeadline = engine.block.isAllowedByScope(blocks.headline, key = "text/edit"),
            canRestyleHeadline = engine.block.isAllowedByScope(blocks.headline, key = "text/character"),
            canMoveHeadline = engine.block.isAllowedByScope(blocks.headline, key = "layer/move"),
            canResizeHeadline = engine.block.isAllowedByScope(blocks.headline, key = "layer/resize"),
            canReplaceMedia = engine.block.isAllowedByScope(blocks.mediaPlaceholder, key = "fill/change"),
            canChangeMediaFillType = engine.block.isAllowedByScope(blocks.mediaPlaceholder, key = "fill/changeType"),
            canMoveMedia = engine.block.isAllowedByScope(blocks.mediaPlaceholder, key = "layer/move"),
            canResizeMedia = engine.block.isAllowedByScope(blocks.mediaPlaceholder, key = "layer/resize"),
            canReplaceBadge = engine.block.isAllowedByScope(blocks.movableBadge, key = "fill/change"),
            canChangeBadgeFillType = engine.block.isAllowedByScope(blocks.movableBadge, key = "fill/changeType"),
            canMoveBadge = engine.block.isAllowedByScope(blocks.movableBadge, key = "layer/move"),
            canResizeBadge = engine.block.isAllowedByScope(blocks.movableBadge, key = "layer/resize"),
            headlineTextScopeEnabled = engine.block.isScopeEnabled(blocks.headline, key = "text/edit"),
            textEditGlobalScope = engine.editor.getGlobalScope(key = "text/edit"),
        )

        check(result.canEditHeadline)
        check(result.canRestyleHeadline)
        check(!result.canMoveHeadline)
        check(!result.canResizeHeadline)
        check(result.canReplaceMedia)
        check(result.canChangeMediaFillType)
        check(!result.canMoveMedia)
        check(!result.canResizeMedia)
        check(!result.canReplaceBadge)
        check(!result.canChangeBadgeFillType)
        check(result.canMoveBadge)
        check(result.canResizeBadge)
        check(result.headlineTextScopeEnabled)
        check(result.textEditGlobalScope == GlobalScope.DEFER)

        return result
    } finally {
        originalGlobalScopes.forEach { (scope, globalScope) ->
            engine.editor.setGlobalScope(key = scope, globalScope = globalScope)
        }
    }
}

suspend fun temporarilyLockContent(engine: Engine): TemporaryLockContentResult {
    val blocks = createLockContentScene(engine)

    val blockScopesToRestore = listOf(
        blocks.headline to "editor/select",
        blocks.mediaPlaceholder to "editor/select",
        blocks.movableBadge to "editor/select",
        blocks.headline to "text/edit",
        blocks.headline to "text/character",
        blocks.mediaPlaceholder to "fill/change",
        blocks.mediaPlaceholder to "fill/changeType",
        blocks.movableBadge to "fill/change",
        blocks.movableBadge to "fill/changeType",
        blocks.headline to "layer/move",
        blocks.headline to "layer/resize",
        blocks.mediaPlaceholder to "layer/move",
        blocks.mediaPlaceholder to "layer/resize",
        blocks.movableBadge to "layer/move",
        blocks.movableBadge to "layer/resize",
    )

    val scopes = engine.editor.findAllScopes()
    val originalGlobalScopes = scopes.associateWith { scope ->
        engine.editor.getGlobalScope(key = scope)
    }
    val originalBlockScopes = blockScopesToRestore.map { (block, scope) ->
        Triple(
            first = block,
            second = scope,
            third = engine.block.isScopeEnabled(block, key = scope),
        )
    }

    val temporarilyLockedTextEditing: Boolean
    val temporarilyEnabledSelection: Boolean
    try {
        scopes.forEach { scope ->
            engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DENY)
        }
        engine.editor.setGlobalScope(key = "editor/select", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(blocks.headline, key = "editor/select", enabled = true)
        temporarilyLockedTextEditing = !engine.block.isAllowedByScope(blocks.headline, key = "text/edit")
        temporarilyEnabledSelection = engine.block.isAllowedByScope(blocks.headline, key = "editor/select")
    } finally {
        originalBlockScopes.forEach { (block, scope, enabled) ->
            engine.block.setScopeEnabled(block, key = scope, enabled = enabled)
        }
        originalGlobalScopes.forEach { (scope, globalScope) ->
            engine.editor.setGlobalScope(key = scope, globalScope = globalScope)
        }
    }

    return TemporaryLockContentResult(
        temporarilyLockedTextEditing = temporarilyLockedTextEditing,
        temporarilyEnabledSelection = temporarilyEnabledSelection,
        globalScopesRestored = originalGlobalScopes.all { (scope, globalScope) ->
            engine.editor.getGlobalScope(key = scope) == globalScope
        },
        blockScopesRestored = originalBlockScopes.all { (block, scope, enabled) ->
            engine.block.isScopeEnabled(block, key = scope) == enabled
        },
    )
}

private fun createLockContentScene(engine: Engine): LockContentBlocks {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val headline = engine.block.create(DesignBlockType.Text)
    engine.block.setName(headline, "Editable headline")
    engine.block.setWidthMode(headline, mode = SizeMode.AUTO)
    engine.block.setHeightMode(headline, mode = SizeMode.AUTO)
    engine.block.setPositionX(headline, value = 64F)
    engine.block.setPositionY(headline, value = 64F)
    engine.block.replaceText(headline, text = "Summer campaign")
    engine.block.setTextColor(headline, color = Color.fromHex("#FF182133"))
    engine.block.appendChild(parent = page, child = headline)

    val mediaPlaceholder = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(mediaPlaceholder, "Replaceable image placeholder")
    engine.block.setShape(mediaPlaceholder, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(mediaPlaceholder, value = 280F)
    engine.block.setHeight(mediaPlaceholder, value = 180F)
    engine.block.setPositionX(mediaPlaceholder, value = 64F)
    engine.block.setPositionY(mediaPlaceholder, value = 180F)
    engine.block.setFill(mediaPlaceholder, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(mediaPlaceholder, color = Color.fromHex("#FFE6EEF8"))
    engine.block.appendChild(parent = page, child = mediaPlaceholder)

    val movableBadge = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(movableBadge, "Movable badge")
    engine.block.setShape(movableBadge, shape = engine.block.createShape(ShapeType.Ellipse))
    engine.block.setWidth(movableBadge, value = 140F)
    engine.block.setHeight(movableBadge, value = 140F)
    engine.block.setPositionX(movableBadge, value = 420F)
    engine.block.setPositionY(movableBadge, value = 220F)
    engine.block.setFill(movableBadge, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(movableBadge, color = Color.fromHex("#FFFFC857"))
    engine.block.appendChild(parent = page, child = movableBadge)

    return LockContentBlocks(
        headline = headline,
        mediaPlaceholder = mediaPlaceholder,
        movableBadge = movableBadge,
    )
}
```

Lock design elements to prevent unwanted modifications using CE.SDK's
scope-based permission system.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-lock-content)

<EngineReferenceNote {...props} />

CE.SDK uses scopes to control what users can modify in a design. Each scope gates
a specific capability, such as moving, resizing, text editing, or image
replacement. The permission system has two layers: global scopes set defaults
for the whole scene, and block-level scopes override those defaults when the
global scope is set to `GlobalScope.DEFER`.

The snippets below use the Android Engine API directly. The same scope settings
are respected by the CE.SDK editor UI; the [Design Editor
Starter Kit](../starterkits/design-editor.md) is a complete Android UI surface you can configure around
these rules.

This guide covers how to discover available scopes, lock an entire design, and
selectively enable specific editing capabilities on individual blocks.

## Understanding the Scope Permission Model

Global and block-level scopes combine to determine whether an operation is
permitted. The global scope can be set to one of three values:

| Global Scope        | Block Scope | Result    |
| ------------------- | ----------- | --------- |
| `GlobalScope.ALLOW` | any         | Permitted |
| `GlobalScope.DENY`  | any         | Blocked   |
| `GlobalScope.DEFER` | enabled     | Permitted |
| `GlobalScope.DEFER` | disabled    | Blocked   |

When global is `GlobalScope.ALLOW`, the operation is always permitted. When
global is `GlobalScope.DENY`, it is always blocked. When global is
`GlobalScope.DEFER`, the block-level enabled state determines the outcome.

## Discovering Available Scopes

Retrieve every available scope name with `engine.editor.findAllScopes()`. Use
the returned identifiers with the global and block-level scope APIs.

```kotlin highlight-android-find-all-scopes
val scopes = engine.editor.findAllScopes()
```

## Locking an Entire Design

To lock every editing operation, iterate through all scopes and set each global
scope to `GlobalScope.DENY`. This keeps the code resilient when CE.SDK adds new
scopes.

```kotlin highlight-android-lock-all
scopes.forEach { scope ->
    engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DENY)
}
```

When all scopes are set to `GlobalScope.DENY`, the `editor/select` scope is
locked too. Users cannot interact with a block they cannot select, so enable
selection before enabling operation-specific scopes.

```kotlin highlight-android-enable-selection
engine.editor.setGlobalScope(key = "editor/select", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(blocks.headline, key = "editor/select", enabled = true)
engine.block.setScopeEnabled(blocks.mediaPlaceholder, key = "editor/select", enabled = true)
engine.block.setScopeEnabled(blocks.movableBadge, key = "editor/select", enabled = true)
```

## Selective Locking Patterns

Most integrations lock the full design first, then selectively enable the exact
operations users should perform on specific blocks.

### Allowing Text Editing

To let users edit text content and styling, set the `text/edit` and
`text/character` global scopes to `GlobalScope.DEFER`, then enable them on the
chosen text block.

```kotlin highlight-android-text-editing
engine.editor.setGlobalScope(key = "text/edit", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "text/character", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(blocks.headline, key = "text/edit", enabled = true)
engine.block.setScopeEnabled(blocks.headline, key = "text/character", enabled = true)
```

### Allowing Image Replacement

To let users replace media while protecting layout, set `fill/change` and
`fill/changeType` to `GlobalScope.DEFER`, then enable both scopes on the image
placeholder block.

```kotlin highlight-android-image-replacement
engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "fill/changeType", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(blocks.mediaPlaceholder, key = "fill/change", enabled = true)
engine.block.setScopeEnabled(blocks.mediaPlaceholder, key = "fill/changeType", enabled = true)
engine.block.setScopeEnabled(blocks.movableBadge, key = "fill/change", enabled = false)
engine.block.setScopeEnabled(blocks.movableBadge, key = "fill/changeType", enabled = false)
```

### Allowing Position Adjustments

To let users reposition selected elements, set `layer/move` and `layer/resize`
to `GlobalScope.DEFER`, then enable those scopes only on blocks that should be
movable.

```kotlin highlight-android-position-adjustments
engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
listOf(blocks.headline, blocks.mediaPlaceholder).forEach { block ->
    engine.block.setScopeEnabled(block, key = "layer/move", enabled = false)
    engine.block.setScopeEnabled(block, key = "layer/resize", enabled = false)
}
engine.block.setScopeEnabled(blocks.movableBadge, key = "layer/move", enabled = true)
engine.block.setScopeEnabled(blocks.movableBadge, key = "layer/resize", enabled = true)
```

## Checking Permissions

Use `engine.block.isAllowedByScope()` when you need the effective permission.
It evaluates the global scope and the block-level scope together.

```kotlin highlight-android-check-permissions
        val result = LockContentResult(
            canEditHeadline = engine.block.isAllowedByScope(blocks.headline, key = "text/edit"),
            canRestyleHeadline = engine.block.isAllowedByScope(blocks.headline, key = "text/character"),
            canMoveHeadline = engine.block.isAllowedByScope(blocks.headline, key = "layer/move"),
            canResizeHeadline = engine.block.isAllowedByScope(blocks.headline, key = "layer/resize"),
            canReplaceMedia = engine.block.isAllowedByScope(blocks.mediaPlaceholder, key = "fill/change"),
            canChangeMediaFillType = engine.block.isAllowedByScope(blocks.mediaPlaceholder, key = "fill/changeType"),
            canMoveMedia = engine.block.isAllowedByScope(blocks.mediaPlaceholder, key = "layer/move"),
            canResizeMedia = engine.block.isAllowedByScope(blocks.mediaPlaceholder, key = "layer/resize"),
            canReplaceBadge = engine.block.isAllowedByScope(blocks.movableBadge, key = "fill/change"),
            canChangeBadgeFillType = engine.block.isAllowedByScope(blocks.movableBadge, key = "fill/changeType"),
            canMoveBadge = engine.block.isAllowedByScope(blocks.movableBadge, key = "layer/move"),
            canResizeBadge = engine.block.isAllowedByScope(blocks.movableBadge, key = "layer/resize"),
            headlineTextScopeEnabled = engine.block.isScopeEnabled(blocks.headline, key = "text/edit"),
            textEditGlobalScope = engine.editor.getGlobalScope(key = "text/edit"),
        )

        check(result.canEditHeadline)
        check(result.canRestyleHeadline)
        check(!result.canMoveHeadline)
        check(!result.canResizeHeadline)
        check(result.canReplaceMedia)
        check(result.canChangeMediaFillType)
        check(!result.canMoveMedia)
        check(!result.canResizeMedia)
        check(!result.canReplaceBadge)
        check(!result.canChangeBadgeFillType)
        check(result.canMoveBadge)
        check(result.canResizeBadge)
        check(result.headlineTextScopeEnabled)
        check(result.textEditGlobalScope == GlobalScope.DEFER)
```

Use `engine.block.isScopeEnabled()` to read only the block-level setting, and
`engine.editor.getGlobalScope()` to read only the global setting.

## Saving and Restoring Scope State

If your code applies locks temporarily, store the previous global and
block-level scope values before changing them. Restore both layers when the
operation completes. Skip this restoration step when the scene should remain
locked after your function returns.

```kotlin highlight-android-save-scopes
    val blockScopesToRestore = listOf(
        blocks.headline to "editor/select",
        blocks.mediaPlaceholder to "editor/select",
        blocks.movableBadge to "editor/select",
        blocks.headline to "text/edit",
        blocks.headline to "text/character",
        blocks.mediaPlaceholder to "fill/change",
        blocks.mediaPlaceholder to "fill/changeType",
        blocks.movableBadge to "fill/change",
        blocks.movableBadge to "fill/changeType",
        blocks.headline to "layer/move",
        blocks.headline to "layer/resize",
        blocks.mediaPlaceholder to "layer/move",
        blocks.mediaPlaceholder to "layer/resize",
        blocks.movableBadge to "layer/move",
        blocks.movableBadge to "layer/resize",
    )

    val scopes = engine.editor.findAllScopes()
    val originalGlobalScopes = scopes.associateWith { scope ->
        engine.editor.getGlobalScope(key = scope)
    }
    val originalBlockScopes = blockScopesToRestore.map { (block, scope) ->
        Triple(
            first = block,
            second = scope,
            third = engine.block.isScopeEnabled(block, key = scope),
        )
    }
```

```kotlin highlight-android-restore-scopes
originalBlockScopes.forEach { (block, scope, enabled) ->
    engine.block.setScopeEnabled(block, key = scope, enabled = enabled)
}
originalGlobalScopes.forEach { (scope, globalScope) ->
    engine.editor.setGlobalScope(key = scope, globalScope = globalScope)
}
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

| Issue                              | Cause                                   | Solution                                                    |
| ---------------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| Block is still editable            | The global scope is `GlobalScope.ALLOW` | Set the global scope to `GlobalScope.DENY` or `GlobalScope.DEFER` |
| Block is unexpectedly locked       | The global scope is `GlobalScope.DENY`  | Set the global scope to `GlobalScope.DEFER` and enable the block-level scope |
| Users cannot select a block        | `editor/select` is still locked         | Enable `editor/select` for blocks users should select       |
| Permission check returns `false`   | The code checks the wrong scope level   | Use `isAllowedByScope()` for the effective permission       |
| New scopes are not locked          | The code uses a hardcoded scope list    | Use `findAllScopes()` to discover scopes dynamically        |

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

- [Rules Overview](./overview.md) - Understand the broader rules system in CE.SDK
- [Lock the Template](../create-templates/lock.md) - Configure template roles and editing permissions



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support