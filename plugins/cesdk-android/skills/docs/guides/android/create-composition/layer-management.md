> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Layers](./layer-management.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-layer-management/LayerManagement.kt reference-only
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.RGBAColor
import ly.img.engine.ShapeType

suspend fun layerManagement(engine: Engine) = withContext(engine.dispatcher) {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val backBlock = createLayerBlock(
        engine = engine,
        x = 120F,
        y = 120F,
        color = Color.fromRGBA(r = 0.10F, g = 0.40F, b = 0.95F, a = 1F),
    )
    val middleBlock = createLayerBlock(
        engine = engine,
        x = 190F,
        y = 190F,
        color = Color.fromRGBA(r = 0.20F, g = 0.75F, b = 0.45F, a = 1F),
    )
    val frontBlock = createLayerBlock(
        engine = engine,
        x = 260F,
        y = 260F,
        color = Color.fromRGBA(r = 0.95F, g = 0.30F, b = 0.25F, a = 1F),
    )

    engine.block.appendChild(parent = page, child = backBlock)
    engine.block.appendChild(parent = page, child = middleBlock)
    engine.block.appendChild(parent = page, child = frontBlock)

    val parent = engine.block.getParent(middleBlock)

    val children = engine.block.getChildren(page)

    val insertedBlock = createLayerBlock(
        engine = engine,
        x = 330F,
        y = 330F,
        color = Color.fromRGBA(r = 0.98F, g = 0.78F, b = 0.20F, a = 1F),
    )
    engine.block.insertChild(parent = page, child = insertedBlock, index = 0)

    engine.block.bringToFront(backBlock)

    engine.block.sendToBack(frontBlock)

    engine.block.bringForward(insertedBlock)

    engine.block.sendBackward(middleBlock)

    val isVisible = engine.block.isVisible(insertedBlock)
    engine.block.setVisible(block = insertedBlock, visible = !isVisible)
    engine.block.setVisible(block = insertedBlock, visible = true)

    val duplicate = engine.block.duplicate(middleBlock)
    engine.block.setPositionX(duplicate, value = 430F)
    engine.block.setPositionY(duplicate, value = 140F)

    val duplicateIsValid = engine.block.isValid(duplicate)

    engine.block.destroy(frontBlock)
    val frontBlockIsValid = engine.block.isValid(frontBlock)

    // Keep values live for the compiled guide sample.
    check(parent == page)
    check(children.containsAll(listOf(backBlock, middleBlock, frontBlock)))
    check(duplicateIsValid)
    check(!frontBlockIsValid)

    engine.scene.zoomToBlock(
        page,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )
}

private fun createLayerBlock(
    engine: Engine,
    x: Float,
    y: Float,
    color: RGBAColor,
): DesignBlock {
    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = block, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block, value = 180F)
    engine.block.setHeight(block, value = 180F)
    engine.block.setPositionX(block, value = x)
    engine.block.setPositionY(block, value = y)
    engine.block.setFill(block = block, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(block = block, color = color)
    return block
}
```

Organize design elements in CE.SDK using a hierarchical layer stack to control
stacking order, visibility, and element relationships.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260824/engine-guides-layer-management)

<EngineReferenceNote {...props} />

Design elements in CE.SDK are organized in a hierarchical parent-child
structure. Children of a block render in order, with the last child appearing on
top. This guide covers how to navigate the block hierarchy, reorder elements,
toggle visibility, duplicate blocks, and remove blocks.

## Using the Built-in Layer Panel UI

The Android editor exposes layer controls for the selected block in the layer
sheet. The sheet includes z-order actions, duplicate, delete, opacity, and blend
mode controls when the selected block supports them.

For a custom layer panel or automation workflow, use the CreativeEngine block
APIs shown below. They operate on the same scene hierarchy that the editor UI
manipulates.

## Creating Visual Blocks

To demonstrate layer ordering, we create colored rectangle blocks that overlap
on the page. Each block is a graphic with a rectangle shape, color fill, size,
and position.

```kotlin highlight-android-create-block
val backBlock = createLayerBlock(
    engine = engine,
    x = 120F,
    y = 120F,
    color = Color.fromRGBA(r = 0.10F, g = 0.40F, b = 0.95F, a = 1F),
)
val middleBlock = createLayerBlock(
    engine = engine,
    x = 190F,
    y = 190F,
    color = Color.fromRGBA(r = 0.20F, g = 0.75F, b = 0.45F, a = 1F),
)
val frontBlock = createLayerBlock(
    engine = engine,
    x = 260F,
    y = 260F,
    color = Color.fromRGBA(r = 0.95F, g = 0.30F, b = 0.25F, a = 1F),
)
```

The sample uses one helper to keep block creation consistent:

```kotlin highlight-android-create-helper
private fun createLayerBlock(
    engine: Engine,
    x: Float,
    y: Float,
    color: RGBAColor,
): DesignBlock {
    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = block, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block, value = 180F)
    engine.block.setHeight(block, value = 180F)
    engine.block.setPositionX(block, value = x)
    engine.block.setPositionY(block, value = y)
    engine.block.setFill(block = block, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(block = block, color = color)
    return block
}
```

## Navigating the Block Hierarchy Programmatically

CE.SDK organizes blocks in a parent-child tree. Every block can have one parent
and multiple children.

### Getting a Block's Parent

Retrieve the parent of any block using `engine.block.getParent()`. This returns
the parent's block ID, or `null` if the block has no parent.

```kotlin highlight-android-get-parent
val parent = engine.block.getParent(middleBlock)
```

### Listing Child Blocks

Get all direct children of a block using `engine.block.getChildren()`. Children
are returned sorted in rendering order, where the last child renders in front of
other children.

```kotlin highlight-android-get-children
val children = engine.block.getChildren(page)
```

This is useful when iterating over all elements on a page or within a group.

## Adding and Positioning Blocks

When you create a new block, it exists independently until you add it to the
hierarchy. Attach blocks by appending them to the end or inserting them at a
specific index.

### Appending a Block

Add a block as the last child of a parent using `engine.block.appendChild()`.
Since the last child renders on top, the appended block becomes the topmost
element.

```kotlin highlight-android-append-child
engine.block.appendChild(parent = page, child = backBlock)
engine.block.appendChild(parent = page, child = middleBlock)
engine.block.appendChild(parent = page, child = frontBlock)
```

### Inserting at a Specific Position

Insert a block at a specific index in the layer stack using
`engine.block.insertChild()`. Index `0` places the block at the back, behind all
other children.

```kotlin highlight-android-insert-child
val insertedBlock = createLayerBlock(
    engine = engine,
    x = 330F,
    y = 330F,
    color = Color.fromRGBA(r = 0.98F, g = 0.78F, b = 0.20F, a = 1F),
)
engine.block.insertChild(parent = page, child = insertedBlock, index = 0)
```

### Reparenting Blocks

When you add a block to a new parent with `appendChild()` or `insertChild()`, it
is automatically removed from its previous parent.

## Changing Z-Order

Once blocks are in the hierarchy, you can change their stacking order without
removing and re-adding them. CE.SDK provides four methods for z-order
manipulation.

### Bring to Front

Move an element to the top of its siblings using
`engine.block.bringToFront()`. This gives the block the highest stacking order
among its siblings.

```kotlin highlight-android-bring-to-front
engine.block.bringToFront(backBlock)
```

### Send to Back

Move an element behind all its siblings using `engine.block.sendToBack()`. This
gives the block the lowest stacking order among its siblings.

```kotlin highlight-android-send-to-back
engine.block.sendToBack(frontBlock)
```

### Move Forward One Layer

Move an element one position forward using `engine.block.bringForward()`. This
swaps the block with its immediate sibling in front.

```kotlin highlight-android-bring-forward
engine.block.bringForward(insertedBlock)
```

### Move Backward One Layer

Move an element one position backward using `engine.block.sendBackward()`. This
swaps the block with its immediate sibling behind.

```kotlin highlight-android-send-backward
engine.block.sendBackward(middleBlock)
```

These incremental operations are useful for fine-tuning the layer order without
jumping to extremes.

## Controlling Visibility

Visibility lets you hide elements without removing them from the scene. Hidden
elements remain in the hierarchy and preserve their properties, but they are not
rendered.

```kotlin highlight-android-visibility
val isVisible = engine.block.isVisible(insertedBlock)
engine.block.setVisible(block = insertedBlock, visible = !isVisible)
engine.block.setVisible(block = insertedBlock, visible = true)
```

## Managing Block Lifecycle

CE.SDK provides methods for duplicating blocks to create copies and destroying
blocks to remove them permanently.

### Duplicating Blocks

Create a copy of a block and its children using `engine.block.duplicate()`. By
default, the duplicate is attached to the same parent as the original.

```kotlin highlight-android-duplicate
val duplicate = engine.block.duplicate(middleBlock)
engine.block.setPositionX(duplicate, value = 430F)
engine.block.setPositionY(duplicate, value = 140F)
```

The duplicated block starts at the same position as the original. Reposition it
to make it visible as a separate element.

### Checking Block Validity

Before performing operations on a block, verify it still exists using
`engine.block.isValid()`. A block becomes invalid after it has been destroyed.

```kotlin highlight-android-is-valid
val duplicateIsValid = engine.block.isValid(duplicate)
```

### Removing Blocks

Permanently remove a block and all its children from the scene using
`engine.block.destroy()`.

```kotlin highlight-android-destroy
engine.block.destroy(frontBlock)
val frontBlockIsValid = engine.block.isValid(frontBlock)
```

After destruction, any reference to the block becomes invalid. Attempting to use
an invalid block ID results in errors.

## Framing the Result

After making layer changes, zoom to fit the page in the viewport so the
composition is clearly visible.

```kotlin highlight-android-zoom
engine.scene.zoomToBlock(
    page,
    paddingLeft = 40F,
    paddingTop = 40F,
    paddingRight = 40F,
    paddingBottom = 40F,
)
```

## Troubleshooting

**Block not visible after appendChild**: The block may be behind other elements.
Use `engine.block.bringToFront()` or adjust the insert index.

**getParent returns null**: The block is not attached to any parent. Attach it
with `engine.block.appendChild()` or `engine.block.insertChild()`.

**Changes not reflected**: The block handle may be invalid. Check with
`engine.block.isValid()` before operations.

**Duplicate not appearing**: If `attachToParent` is `false`, the duplicate is not
attached automatically. Set it to `true` or manually attach the duplicate.

## API Reference

| Method | Category | Description |
| --- | --- | --- |
| `engine.block.getParent(block=_)` | Hierarchy | Get the parent block of a block |
| `engine.block.getChildren(block=_)` | Hierarchy | Get all child blocks in rendering order |
| `engine.block.appendChild(parent=_, child=_)` | Hierarchy | Append a block as the last child |
| `engine.block.insertChild(parent=_, child=_, index=_)` | Hierarchy | Insert a block at a specific position |
| `engine.block.bringToFront(block=_)` | Z-Order | Bring a block to the front of its siblings |
| `engine.block.sendToBack(block=_)` | Z-Order | Send a block to the back of its siblings |
| `engine.block.bringForward(block=_)` | Z-Order | Move a block one position forward |
| `engine.block.sendBackward(block=_)` | Z-Order | Move a block one position backward |
| `engine.block.isVisible(block=_)` | Visibility | Check if a block is visible |
| `engine.block.setVisible(block=_, visible=_)` | Visibility | Set the visibility of a block |
| `engine.block.duplicate(block=_, attachToParent=_)` | Lifecycle | Duplicate a block and its children |
| `engine.block.destroy(block=_)` | Lifecycle | Remove a block and its children |
| `engine.block.isValid(block=_)` | Lifecycle | Check if a block handle is valid |

## Next Steps

- [Grouping](./group-and-ungroup.md) — Group multiple blocks to move or transform them together
- [Position and Align](./position-and-align.md) — Precisely position elements on the canvas
- [Multi-Page Layouts](./multi-page.md) — Create and manage multi-page designs in CE.SDK for documents like brochures, presentations, and catalogs with multiple pages in a single scene.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support