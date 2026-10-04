> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Movement Constraints](./movement-constraints.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-movement-constraints/MovementConstraints.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.MovementConstraintRule
import ly.img.engine.MovementConstraintScope

fun movementConstraints(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)

    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.appendChild(parent = page, child = block)

    // Allow every block in the scene to overshoot by 20% of its own size.
    engine.editor.setMovementConstraint(MovementConstraintRule(overshoot = 0.2F))

    // Pin all text and caption blocks fully inside the page.
    engine.editor.setMovementConstraint(
        listOf(
            MovementConstraintRule(overshoot = 0F, scope = MovementConstraintScope.BlockType("text")),
            MovementConstraintRule(overshoot = 0F, scope = MovementConstraintScope.BlockType("caption")),
        ),
    )

    // Override the scene-wide default for blocks on this page.
    engine.editor.setMovementConstraint(
        MovementConstraintRule(overshoot = 0.1F, scope = MovementConstraintScope.Block(page)),
    )

    // Override every other level for one specific block.
    engine.editor.setMovementConstraint(
        MovementConstraintRule(overshoot = 0F, scope = MovementConstraintScope.Block(block)),
    )

    // Read the resolved constraint, walking the priority chain:
    // block > parent page > blockType > scene-wide.
    val active = engine.editor.getMovementConstraint(block)

    // Clear a scope by passing the matching descriptor. Use no argument to remove
    // the scene-wide default.
    engine.editor.removeMovementConstraint(MovementConstraintScope.Block(block)) // per-block
    engine.editor.removeMovementConstraint(MovementConstraintScope.BlockType("text")) // per-type
    engine.editor.removeMovementConstraint(MovementConstraintScope.Block(page)) // per-page
    engine.editor.removeMovementConstraint() // scene-wide default

    engine.stop()
}

```

Limit how far a block may extend past its page during user interactions.
The constraints apply to mouse and touch gestures — moving, resizing, and
scaling. API calls bypass them.

`overshoot` is a non-negative fraction of the **block's own size**: `0f` pins the block fully inside, `0.2f` allows a 20% overshoot. Each rule's scope decides which blocks it applies to:

- `MovementConstraintScope.Scene` — scene-wide default.
- `MovementConstraintScope.Block(id)` — a specific block (pages count as blocks).
- `MovementConstraintScope.BlockType(name)` — every block of the given type.

## Scene-wide default

Apply a rule that affects every page in the scene:

```kotlin highlight-movement-constraint-scene-wide
// Allow every block in the scene to overshoot by 20% of its own size.
engine.editor.setMovementConstraint(MovementConstraintRule(overshoot = 0.2F))
```

## Per block type

Scope a rule with `BlockType` to restrict all blocks of that type. Call `setMovementConstraint` with a list to apply several rules in one call:

```kotlin highlight-movement-constraint-per-type
// Pin all text and caption blocks fully inside the page.
engine.editor.setMovementConstraint(
    listOf(
        MovementConstraintRule(overshoot = 0F, scope = MovementConstraintScope.BlockType("text")),
        MovementConstraintRule(overshoot = 0F, scope = MovementConstraintScope.BlockType("caption")),
    ),
)
```

## Per page

Pages are blocks, so you can target a page block to set a default for its children:

```kotlin highlight-movement-constraint-per-page
// Override the scene-wide default for blocks on this page.
engine.editor.setMovementConstraint(
    MovementConstraintRule(overshoot = 0.1F, scope = MovementConstraintScope.Block(page)),
)
```

## Per block

Target a specific block ID to override every other level:

```kotlin highlight-movement-constraint-per-block
// Override every other level for one specific block.
engine.editor.setMovementConstraint(
    MovementConstraintRule(overshoot = 0F, scope = MovementConstraintScope.Block(block)),
)
```

## Read the active value

Read the resolved constraint for a block. The lookup walks the priority chain: block, parent page, blockType, then scene-wide. It returns `null` when the block is unconstrained.

```kotlin highlight-movement-constraint-read
// Read the resolved constraint, walking the priority chain:
// block > parent page > blockType > scene-wide.
val active = engine.editor.getMovementConstraint(block)
```

## Remove a constraint

Pass the matching `MovementConstraintScope` to clear any level of the priority chain, or call `removeMovementConstraint()` with no argument to clear the scene-wide default:

```kotlin highlight-movement-constraint-remove
// Clear a scope by passing the matching descriptor. Use no argument to remove
// the scene-wide default.
engine.editor.removeMovementConstraint(MovementConstraintScope.Block(block)) // per-block
engine.editor.removeMovementConstraint(MovementConstraintScope.BlockType("text")) // per-type
engine.editor.removeMovementConstraint(MovementConstraintScope.Block(page)) // per-page
engine.editor.removeMovementConstraint() // scene-wide default
```

## Full code

Here's the full code:

```kotlin highlight-movement-constraints
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.MovementConstraintRule
import ly.img.engine.MovementConstraintScope

fun movementConstraints(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)

    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.appendChild(parent = page, child = block)

    // Allow every block in the scene to overshoot by 20% of its own size.
    engine.editor.setMovementConstraint(MovementConstraintRule(overshoot = 0.2F))

    // Pin all text and caption blocks fully inside the page.
    engine.editor.setMovementConstraint(
        listOf(
            MovementConstraintRule(overshoot = 0F, scope = MovementConstraintScope.BlockType("text")),
            MovementConstraintRule(overshoot = 0F, scope = MovementConstraintScope.BlockType("caption")),
        ),
    )

    // Override the scene-wide default for blocks on this page.
    engine.editor.setMovementConstraint(
        MovementConstraintRule(overshoot = 0.1F, scope = MovementConstraintScope.Block(page)),
    )

    // Override every other level for one specific block.
    engine.editor.setMovementConstraint(
        MovementConstraintRule(overshoot = 0F, scope = MovementConstraintScope.Block(block)),
    )

    // Read the resolved constraint, walking the priority chain:
    // block > parent page > blockType > scene-wide.
    val active = engine.editor.getMovementConstraint(block)

    // Clear a scope by passing the matching descriptor. Use no argument to remove
    // the scene-wide default.
    engine.editor.removeMovementConstraint(MovementConstraintScope.Block(block)) // per-block
    engine.editor.removeMovementConstraint(MovementConstraintScope.BlockType("text")) // per-type
    engine.editor.removeMovementConstraint(MovementConstraintScope.Block(page)) // per-page
    engine.editor.removeMovementConstraint() // scene-wide default

    engine.stop()
}
```



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support