> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Position and Align](./position-and-align.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-position-and-align/PositionAndAlign.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.HorizontalBlockAlignment
import ly.img.engine.PositionMode
import ly.img.engine.RGBAColor
import ly.img.engine.ShapeType
import ly.img.engine.VerticalBlockAlignment

fun positionAndAlign(
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

    val primaryBlock = createShapeBlock(
        engine = engine,
        parent = page,
        color = Color.fromRGBA(r = 0.18F, g = 0.38F, b = 0.85F),
        x = 0F,
        y = 0F,
        width = 150F,
        height = 100F,
    )

    engine.block.setPositionX(primaryBlock, value = 50F)
    engine.block.setPositionY(primaryBlock, value = 50F)

    val currentX = engine.block.getPositionX(primaryBlock)
    val currentY = engine.block.getPositionY(primaryBlock)

    val percentBlock = createShapeBlock(
        engine = engine,
        parent = page,
        color = Color.fromRGBA(r = 0.04F, g = 0.64F, b = 0.43F),
        x = 0F,
        y = 0F,
        width = 150F,
        height = 100F,
    )

    engine.block.setPositionXMode(percentBlock, mode = PositionMode.PERCENT)
    engine.block.setPositionYMode(percentBlock, mode = PositionMode.PERCENT)
    engine.block.setPositionX(percentBlock, value = 0.5F)
    engine.block.setPositionY(percentBlock, value = 0.5F)

    val currentXMode = engine.block.getPositionXMode(percentBlock)
    val currentYMode = engine.block.getPositionYMode(percentBlock)

    val alignmentBlocks = listOf(
        100F to 100F,
        250F to 150F,
        180F to 250F,
        350F to 200F,
    ).map { (positionX, positionY) ->
        createShapeBlock(
            engine = engine,
            parent = page,
            color = Color.fromRGBA(r = 0.18F, g = 0.38F, b = 0.85F),
            x = positionX,
            y = positionY,
            width = 100F,
            height = 80F,
        )
    }

    if (engine.block.isAlignable(alignmentBlocks)) {
        // Blocks can be aligned inside their combined bounding box.
    }

    if (engine.block.isAlignable(alignmentBlocks)) {
        engine.block.alignHorizontally(alignmentBlocks, alignment = HorizontalBlockAlignment.LEFT)
        engine.block.alignVertically(alignmentBlocks, alignment = VerticalBlockAlignment.TOP)
    }

    val headline = createShapeBlock(
        engine = engine,
        parent = page,
        color = Color.fromRGBA(r = 0.84F, g = 0.13F, b = 0.47F),
        x = 500F,
        y = 300F,
    )

    if (engine.block.isAlignable(listOf(headline))) {
        engine.block.alignHorizontally(listOf(headline), alignment = HorizontalBlockAlignment.CENTER)
        engine.block.alignVertically(listOf(headline), alignment = VerticalBlockAlignment.CENTER)
    }

    val horizontalDistributionBlocks = listOf(50F, 180F, 400F, 650F).map { positionX ->
        createShapeBlock(
            engine = engine,
            parent = page,
            color = Color.fromRGBA(r = 0.96F, g = 0.56F, b = 0.18F),
            x = positionX,
            y = 430F,
            width = 100F,
            height = 80F,
        )
    }

    val canDistributeHorizontally = engine.block.isDistributable(horizontalDistributionBlocks)
    if (canDistributeHorizontally) {
        // Blocks can be distributed with equal spacing.
    }

    if (canDistributeHorizontally) {
        engine.block.distributeHorizontally(horizontalDistributionBlocks)
    }

    val verticalDistributionBlocks = listOf(50F, 150F, 350F, 500F).map { positionY ->
        createShapeBlock(
            engine = engine,
            parent = page,
            color = Color.fromRGBA(r = 0.84F, g = 0.13F, b = 0.47F),
            x = 600F,
            y = positionY,
            width = 100F,
            height = 80F,
        )
    }

    if (engine.block.isDistributable(verticalDistributionBlocks)) {
        engine.block.distributeVertically(verticalDistributionBlocks)
    }

    engine.editor.setSettingFloat(keypath = "positionSnappingThreshold", value = 8F)
    engine.editor.setSettingFloat(keypath = "rotationSnappingThreshold", value = 0.26F)

    engine.editor.setSettingColor(
        keypath = "snappingGuideColor",
        value = Color.fromRGBA(r = 0.18F, g = 0.38F, b = 0.85F),
    )
    engine.editor.setSettingColor(
        keypath = "rotationSnappingGuideColor",
        value = Color.fromRGBA(r = 0.96F, g = 0.56F, b = 0.18F),
    )

    engine.stop()
}

fun createShapeBlock(
    engine: Engine,
    parent: DesignBlock,
    color: RGBAColor,
    x: Float,
    y: Float,
    width: Float = 120F,
    height: Float = 120F,
): DesignBlock {
    val block = engine.block.create(DesignBlockType.Graphic)
    val fill = engine.block.createFill(FillType.Color)
    engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(block, fill = fill)
    engine.block.setFillSolidColor(block, color = color)
    engine.block.setWidth(block, value = width)
    engine.block.setHeight(block, value = height)
    engine.block.setPositionX(block, value = x)
    engine.block.setPositionY(block, value = y)
    engine.block.appendChild(parent = parent, child = block)
    return block
}
```

Position, align, and distribute design elements precisely using CE.SDK's
layout APIs and snapping system.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/engine-guides-position-and-align)

<EngineReferenceNote {...props} />

CE.SDK positions blocks relative to their parent container with the origin at the top left. You can set positions using absolute values in design units or as percentages of the parent's dimensions. For multi-element layouts, alignment and distribution APIs arrange blocks without manual spacing calculations. Snapping settings tune the visual guides shown during interactive editing.

This guide covers how to set block positions using different modes, align blocks horizontally and vertically, distribute blocks with even spacing, and configure snapping for interactive editing.

## Setup

We start with a scene and a page that we use as the parent for every block created in this guide.

```kotlin highlight-android-setup
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)
```

The sample uses this helper to create each colored graphic block while keeping the later snippets focused on layout APIs.

```kotlin highlight-android-create-helper
fun createShapeBlock(
    engine: Engine,
    parent: DesignBlock,
    color: RGBAColor,
    x: Float,
    y: Float,
    width: Float = 120F,
    height: Float = 120F,
): DesignBlock {
    val block = engine.block.create(DesignBlockType.Graphic)
    val fill = engine.block.createFill(FillType.Color)
    engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(block, fill = fill)
    engine.block.setFillSolidColor(block, color = color)
    engine.block.setWidth(block, value = width)
    engine.block.setHeight(block, value = height)
    engine.block.setPositionX(block, value = x)
    engine.block.setPositionY(block, value = y)
    engine.block.appendChild(parent = parent, child = block)
    return block
}
```

## Coordinate System

CE.SDK uses a coordinate system where the origin (`0`, `0`) is at the top-left corner of the parent container. The X axis extends to the right and the Y axis extends downward. All block positions are relative to the block's parent.

## Setting Block Positions

### Absolute Positioning

We can position blocks using absolute coordinates in design units. This is useful when you need precise control over element placement.

```kotlin highlight-android-absolute-position
    val primaryBlock = createShapeBlock(
        engine = engine,
        parent = page,
        color = Color.fromRGBA(r = 0.18F, g = 0.38F, b = 0.85F),
        x = 0F,
        y = 0F,
        width = 150F,
        height = 100F,
    )

    engine.block.setPositionX(primaryBlock, value = 50F)
    engine.block.setPositionY(primaryBlock, value = 50F)

    val currentX = engine.block.getPositionX(primaryBlock)
    val currentY = engine.block.getPositionY(primaryBlock)
```

`setPositionX()` and `setPositionY()` set the block's position relative to its parent. Use `getPositionX()` and `getPositionY()` to query the current position.

### Percentage-Based Positioning

Positions can also be set as percentages of the parent's dimensions. This approach is useful for layouts that should adapt to different container sizes.

```kotlin highlight-android-percent-position
    val percentBlock = createShapeBlock(
        engine = engine,
        parent = page,
        color = Color.fromRGBA(r = 0.04F, g = 0.64F, b = 0.43F),
        x = 0F,
        y = 0F,
        width = 150F,
        height = 100F,
    )

    engine.block.setPositionXMode(percentBlock, mode = PositionMode.PERCENT)
    engine.block.setPositionYMode(percentBlock, mode = PositionMode.PERCENT)
    engine.block.setPositionX(percentBlock, value = 0.5F)
    engine.block.setPositionY(percentBlock, value = 0.5F)

    val currentXMode = engine.block.getPositionXMode(percentBlock)
    val currentYMode = engine.block.getPositionYMode(percentBlock)
```

Position modes are set with `setPositionXMode()` and `setPositionYMode()`. When set to `PositionMode.PERCENT`, position values represent a fraction of the parent's size (`0.5F` = 50%). Query the current mode with `getPositionXMode()` and `getPositionYMode()`. The third mode, `PositionMode.AUTO`, lets the engine determine the position automatically.

## Aligning Blocks

### Aligning Multiple Blocks

Multiple blocks can be aligned within their combined bounding box. This is useful for creating visually organized layouts.

```kotlin highlight-android-check-alignable
    val alignmentBlocks = listOf(
        100F to 100F,
        250F to 150F,
        180F to 250F,
        350F to 200F,
    ).map { (positionX, positionY) ->
        createShapeBlock(
            engine = engine,
            parent = page,
            color = Color.fromRGBA(r = 0.18F, g = 0.38F, b = 0.85F),
            x = positionX,
            y = positionY,
            width = 100F,
            height = 80F,
        )
    }

    if (engine.block.isAlignable(alignmentBlocks)) {
        // Blocks can be aligned inside their combined bounding box.
    }
```

Before aligning, check whether the blocks can be aligned with `isAlignable()`.

```kotlin highlight-android-align-horizontal
if (engine.block.isAlignable(alignmentBlocks)) {
    engine.block.alignHorizontally(alignmentBlocks, alignment = HorizontalBlockAlignment.LEFT)
    engine.block.alignVertically(alignmentBlocks, alignment = VerticalBlockAlignment.TOP)
}
```

`alignHorizontally()` accepts a list of blocks and a `HorizontalBlockAlignment` value: `LEFT`, `RIGHT`, or `CENTER`. Similarly, `alignVertically()` accepts `VerticalBlockAlignment.TOP`, `BOTTOM`, or `CENTER`.

### Aligning a Single Block to Parent

When you pass a single block to the alignment methods, it aligns within its parent container rather than a group bounding box.

```kotlin highlight-android-align-single-block
    val headline = createShapeBlock(
        engine = engine,
        parent = page,
        color = Color.fromRGBA(r = 0.84F, g = 0.13F, b = 0.47F),
        x = 500F,
        y = 300F,
    )

    if (engine.block.isAlignable(listOf(headline))) {
        engine.block.alignHorizontally(listOf(headline), alignment = HorizontalBlockAlignment.CENTER)
        engine.block.alignVertically(listOf(headline), alignment = VerticalBlockAlignment.CENTER)
    }
```

This approach is useful for centering elements on a page or positioning them at specific edges of the container.

## Distributing Blocks

Distribution spaces blocks evenly within their bounding box. This is useful for consistent spacing in grid layouts or navigation elements.

```kotlin highlight-android-check-distributable
    val horizontalDistributionBlocks = listOf(50F, 180F, 400F, 650F).map { positionX ->
        createShapeBlock(
            engine = engine,
            parent = page,
            color = Color.fromRGBA(r = 0.96F, g = 0.56F, b = 0.18F),
            x = positionX,
            y = 430F,
            width = 100F,
            height = 80F,
        )
    }

    val canDistributeHorizontally = engine.block.isDistributable(horizontalDistributionBlocks)
    if (canDistributeHorizontally) {
        // Blocks can be distributed with equal spacing.
    }
```

`isDistributable()` verifies that the blocks can be distributed.

```kotlin highlight-android-distribute-horizontal
if (canDistributeHorizontally) {
    engine.block.distributeHorizontally(horizontalDistributionBlocks)
}
```

`distributeHorizontally()` arranges blocks so the horizontal space between them is equal. When more than two blocks are distributed, the leftmost and rightmost blocks remain in place while the blocks between them are repositioned.

```kotlin highlight-android-distribute-vertical
    val verticalDistributionBlocks = listOf(50F, 150F, 350F, 500F).map { positionY ->
        createShapeBlock(
            engine = engine,
            parent = page,
            color = Color.fromRGBA(r = 0.84F, g = 0.13F, b = 0.47F),
            x = 600F,
            y = positionY,
            width = 100F,
            height = 80F,
        )
    }

    if (engine.block.isDistributable(verticalDistributionBlocks)) {
        engine.block.distributeVertically(verticalDistributionBlocks)
    }
```

Similarly, `distributeVertically()` distributes blocks with equal vertical spacing. The topmost and bottommost blocks define the vertical bounds while the blocks between them are repositioned.

## Configuring Snapping

Snapping provides visual guides when users drag elements in the editor, helping them align blocks precisely. Configure snapping sensitivity and guide appearance with editor settings.

### Setting Snapping Thresholds

```kotlin highlight-android-snapping-threshold
engine.editor.setSettingFloat(keypath = "positionSnappingThreshold", value = 8F)
engine.editor.setSettingFloat(keypath = "rotationSnappingThreshold", value = 0.26F)
```

`positionSnappingThreshold` controls how close, in pixels, a block must be to a snap target before snapping activates. `rotationSnappingThreshold` controls rotation snapping sensitivity in radians.

### Customizing Snapping Guide Colors

```kotlin highlight-android-snapping-colors
engine.editor.setSettingColor(
    keypath = "snappingGuideColor",
    value = Color.fromRGBA(r = 0.18F, g = 0.38F, b = 0.85F),
)
engine.editor.setSettingColor(
    keypath = "rotationSnappingGuideColor",
    value = Color.fromRGBA(r = 0.96F, g = 0.56F, b = 0.18F),
)
```

`snappingGuideColor` controls position snapping lines, and `rotationSnappingGuideColor` controls rotation guides.

## Troubleshooting

### Position Not Updating

If a block's position does not change after calling the setter methods:

- Verify the block's transform is not locked with `isTransformLocked()`
- Check that the block has the `"layer/move"` scope enabled
- Ensure you are using the correct `PositionMode` for your values

### Alignment Not Working

If `alignHorizontally()` or `alignVertically()` has no effect:

- Confirm `isAlignable()` returns `true` for the blocks
- Verify all blocks in the list are valid
- Check that blocks have the `"layer/move"` scope enabled

### Blocks Cannot Be Distributed

If `distributeHorizontally()` or `distributeVertically()` does not work:

- Verify `isDistributable()` returns `true`
- Confirm each block is valid and all blocks share the same parent
- Do not enforce a three-block minimum in app code; Android can distribute a two-block set when `isDistributable()` returns `true`

### Snapping Guides Do Not Appear

If snapping guides are missing during interactive editing:

- Verify the relevant snapping threshold is greater than zero
- Check that the editor is in a transform mode where blocks can be dragged
- Confirm the guide colors have visible alpha values

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.getPositionX(block=_)` | Get a block's X position |
| `engine.block.getPositionY(block=_)` | Get a block's Y position |
| `engine.block.setPositionX(block=_, value=_)` | Set a block's X position |
| `engine.block.setPositionY(block=_, value=_)` | Set a block's Y position |
| `engine.block.getPositionXMode(block=_)` | Get a block's X position mode |
| `engine.block.getPositionYMode(block=_)` | Get a block's Y position mode |
| `engine.block.setPositionXMode(block=_, mode=_)` | Set a block's X position mode |
| `engine.block.setPositionYMode(block=_, mode=_)` | Set a block's Y position mode |
| `engine.block.isAlignable(blocks=_)` | Check if blocks can be aligned |
| `engine.block.alignHorizontally(blocks=_, alignment=_)` | Align blocks horizontally |
| `engine.block.alignVertically(blocks=_, alignment=_)` | Align blocks vertically |
| `engine.block.isDistributable(blocks=_)` | Check if blocks can be distributed |
| `engine.block.distributeHorizontally(blocks=_)` | Distribute blocks horizontally with even spacing |
| `engine.block.distributeVertically(blocks=_)` | Distribute blocks vertically with even spacing |
| `engine.editor.setSettingFloat(keypath="positionSnappingThreshold", value=_)` | Set position snapping sensitivity in pixels |
| `engine.editor.setSettingFloat(keypath="rotationSnappingThreshold", value=_)` | Set rotation snapping sensitivity in radians |
| `engine.editor.setSettingColor(keypath="snappingGuideColor", value=_)` | Set position snapping guide color |
| `engine.editor.setSettingColor(keypath="rotationSnappingGuideColor", value=_)` | Set rotation snapping guide color |

## Next Steps

Now that you understand positioning and alignment, explore related layout features:

- [Layer Management](./layer-management.md) - Control the stacking order of elements
- [Grouping](./group-and-ungroup.md) - Group related elements together
- [Multi-Page Layouts](./multi-page.md) - Create and manage multi-page designs in CE.SDK for documents like brochures, presentations, and catalogs with multiple pages in a single scene.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support