> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Design a Layout](./layout.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-layout/Layout.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.SceneLayout
import ly.img.engine.ShapeType

fun layout(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example.layout")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)

    // Create a scene with VerticalStack layout. Pages appended to the stack
    // container arrange top-to-bottom automatically.
    engine.scene.create(sceneLayout = SceneLayout.VERTICAL_STACK)

    // Get the stack container that was created with the scene.
    val stack = engine.block.findByType(DesignBlockType.Stack).first()

    // Create two pages that will stack vertically.
    val page1 = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page1, value = 400F)
    engine.block.setHeight(page1, value = 300F)
    engine.block.appendChild(parent = stack, child = page1)

    val page2 = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page2, value = 400F)
    engine.block.setHeight(page2, value = 300F)
    engine.block.appendChild(parent = stack, child = page2)

    // Configure spacing between stacked pages.
    engine.block.setFloat(stack, property = "stack/spacing", value = 20F)
    engine.block.setBoolean(stack, property = "stack/spacingInScreenspace", value = true)

    // Add an image block to the first page.
    val block1 = engine.block.create(DesignBlockType.Graphic)
    val shape1 = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block1, shape = shape1)
    engine.block.setWidth(block1, value = 350F)
    engine.block.setHeight(block1, value = 250F)
    engine.block.setPositionX(block1, value = 25F)
    engine.block.setPositionY(block1, value = 25F)
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(block1, fill = imageFill)
    engine.block.appendChild(parent = page1, child = block1)

    // Add a colored rectangle to the second page.
    val block2 = engine.block.create(DesignBlockType.Graphic)
    val shape2 = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block2, shape = shape2)
    engine.block.setWidth(block2, value = 350F)
    engine.block.setHeight(block2, value = 250F)
    engine.block.setPositionX(block2, value = 25F)
    engine.block.setPositionY(block2, value = 25F)
    engine.block.setFill(block2, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = block2,
        color = Color.fromRGBA(r = 0.3F, g = 0.6F, b = 0.9F, a = 1F),
    )
    engine.block.appendChild(parent = page2, child = block2)

    // Switch to a horizontal stack. Existing pages reposition left-to-right.
    engine.scene.setLayout(SceneLayout.HORIZONTAL_STACK)

    // Verify the layout type.
    val currentLayout = engine.scene.getLayout()
    println("Current layout: $currentLayout")

    // Append a new page to the existing stack. It snaps to the end with the
    // configured spacing.
    val page3 = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page3, value = 400F)
    engine.block.setHeight(page3, value = 300F)
    engine.block.appendChild(parent = stack, child = page3)

    // Add content to the new page.
    val block3 = engine.block.create(DesignBlockType.Graphic)
    val shape3 = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block3, shape = shape3)
    engine.block.setWidth(block3, value = 350F)
    engine.block.setHeight(block3, value = 250F)
    engine.block.setPositionX(block3, value = 25F)
    engine.block.setPositionY(block3, value = 25F)
    engine.block.setFill(block3, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = block3,
        color = Color.fromRGBA(r = 0.9F, g = 0.5F, b = 0.3F, a = 1F),
    )
    engine.block.appendChild(parent = page3, child = block3)

    // Move page3 to the first position using insertChild.
    engine.block.insertChild(parent = stack, child = page3, index = 0)

    // Verify the new order.
    val pageOrder = engine.block.getChildren(stack)
    println("Page order after reordering: $pageOrder")

    // Update the spacing between stacked pages.
    engine.block.setFloat(stack, property = "stack/spacing", value = 40F)

    // Verify the spacing value.
    val updatedSpacing = engine.block.getFloat(stack, property = "stack/spacing")
    println("Updated spacing: $updatedSpacing")

    // Switch back to a free layout to position pages manually.
    engine.scene.setLayout(SceneLayout.FREE)

    // Position a page directly; stacks no longer manage placement.
    val page = engine.block.findByType(DesignBlockType.Page).first()
    engine.block.setPositionX(page, value = 100F)
    engine.block.setPositionY(page, value = 200F)

    engine.stop()
}
```

Create structured compositions using stack layouts that automatically arrange pages vertically or horizontally with consistent spacing.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260809/engine-guides-layout)

<EngineReferenceNote {...props} />

Stack layouts arrange pages automatically with consistent spacing. Vertical stacks arrange pages top-to-bottom, while horizontal stacks arrange them left-to-right. This eliminates manual positioning for compositions like photo collages, product catalogs, or social media carousels.

This guide covers how to:

- Create vertical and horizontal stack layouts
- Add pages and blocks to stacks
- Configure spacing between stacked pages
- Reorder pages within a stack
- Switch between stack and free layouts

## Create a Vertical Stack Layout

Vertical stacks arrange pages from top to bottom. Create a scene with `SceneLayout.VERTICAL_STACK`, then append pages to the stack container.

```kotlin highlight-android-vertical-stack
    // Create a scene with VerticalStack layout. Pages appended to the stack
    // container arrange top-to-bottom automatically.
    engine.scene.create(sceneLayout = SceneLayout.VERTICAL_STACK)

    // Get the stack container that was created with the scene.
    val stack = engine.block.findByType(DesignBlockType.Stack).first()

    // Create two pages that will stack vertically.
    val page1 = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page1, value = 400F)
    engine.block.setHeight(page1, value = 300F)
    engine.block.appendChild(parent = stack, child = page1)

    val page2 = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page2, value = 400F)
    engine.block.setHeight(page2, value = 300F)
    engine.block.appendChild(parent = stack, child = page2)

    // Configure spacing between stacked pages.
    engine.block.setFloat(stack, property = "stack/spacing", value = 20F)
    engine.block.setBoolean(stack, property = "stack/spacingInScreenspace", value = true)
```

When you create a scene with `SceneLayout.VERTICAL_STACK`, CE.SDK automatically adds a stack container. Pages appended to this container position themselves with the configured spacing. The `stack/spacingInScreenspace` property keeps spacing visually consistent at any zoom level.

## Add Blocks to Pages

Each page can contain multiple blocks. Create blocks with a shape and fill, position them inside the page, then append them as children.

```kotlin highlight-android-add-blocks
    // Add an image block to the first page.
    val block1 = engine.block.create(DesignBlockType.Graphic)
    val shape1 = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block1, shape = shape1)
    engine.block.setWidth(block1, value = 350F)
    engine.block.setHeight(block1, value = 250F)
    engine.block.setPositionX(block1, value = 25F)
    engine.block.setPositionY(block1, value = 25F)
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(block1, fill = imageFill)
    engine.block.appendChild(parent = page1, child = block1)

    // Add a colored rectangle to the second page.
    val block2 = engine.block.create(DesignBlockType.Graphic)
    val shape2 = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block2, shape = shape2)
    engine.block.setWidth(block2, value = 350F)
    engine.block.setHeight(block2, value = 250F)
    engine.block.setPositionX(block2, value = 25F)
    engine.block.setPositionY(block2, value = 25F)
    engine.block.setFill(block2, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = block2,
        color = Color.fromRGBA(r = 0.3F, g = 0.6F, b = 0.9F, a = 1F),
    )
    engine.block.appendChild(parent = page2, child = block2)
```

Graphic blocks require both a shape and a fill to be visible. Use an image fill with `fill/image/imageFileURI` for image content, or a color fill for solid colors. Position blocks inside their parent page with `setPositionX` and `setPositionY`.

## Switch to Horizontal Layout

Change the layout direction at any time with `setLayout`. Horizontal stacks arrange pages left-to-right instead of top-to-bottom.

```kotlin highlight-android-horizontal-stack
    // Switch to a horizontal stack. Existing pages reposition left-to-right.
    engine.scene.setLayout(SceneLayout.HORIZONTAL_STACK)

    // Verify the layout type.
    val currentLayout = engine.scene.getLayout()
    println("Current layout: $currentLayout")
```

Horizontal layouts suit carousels, timelines, and horizontal galleries. Existing pages reposition automatically when you change the layout type.

## Add Pages to Existing Stacks

Append new pages to an existing stack at any time. Pages snap to the end of the stack with the configured spacing.

```kotlin highlight-android-add-page
    // Append a new page to the existing stack. It snaps to the end with the
    // configured spacing.
    val page3 = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page3, value = 400F)
    engine.block.setHeight(page3, value = 300F)
    engine.block.appendChild(parent = stack, child = page3)

    // Add content to the new page.
    val block3 = engine.block.create(DesignBlockType.Graphic)
    val shape3 = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block3, shape = shape3)
    engine.block.setWidth(block3, value = 350F)
    engine.block.setHeight(block3, value = 250F)
    engine.block.setPositionX(block3, value = 25F)
    engine.block.setPositionY(block3, value = 25F)
    engine.block.setFill(block3, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = block3,
        color = Color.fromRGBA(r = 0.9F, g = 0.5F, b = 0.3F, a = 1F),
    )
    engine.block.appendChild(parent = page3, child = block3)
```

The stack container handles positioning automatically. You can populate the new page with content before or after appending it.

## Reorder Pages

Change page order with `insertChild` to place a page at a specific index inside the stack.

```kotlin highlight-android-reorder
    // Move page3 to the first position using insertChild.
    engine.block.insertChild(parent = stack, child = page3, index = 0)

    // Verify the new order.
    val pageOrder = engine.block.getChildren(stack)
    println("Page order after reordering: $pageOrder")
```

Removing a page from its current slot and reinserting it at index 0 moves it to the first position. The remaining pages shift to make room.

## Change Stack Spacing

Adjust spacing between pages by setting the `stack/spacing` property on the stack block.

```kotlin highlight-android-spacing
    // Update the spacing between stacked pages.
    engine.block.setFloat(stack, property = "stack/spacing", value = 40F)

    // Verify the spacing value.
    val updatedSpacing = engine.block.getFloat(stack, property = "stack/spacing")
    println("Updated spacing: $updatedSpacing")
```

Spacing updates take effect immediately and pages reposition automatically. Read the current value back with `getFloat`.

## Switch to Free Layout

For manual positioning, switch to `SceneLayout.FREE`. Pages keep their current positions but stop auto-arranging.

```kotlin highlight-android-free-layout
    // Switch back to a free layout to position pages manually.
    engine.scene.setLayout(SceneLayout.FREE)

    // Position a page directly; stacks no longer manage placement.
    val page = engine.block.findByType(DesignBlockType.Page).first()
    engine.block.setPositionX(page, value = 100F)
    engine.block.setPositionY(page, value = 200F)
```

Free layout gives full control over page positions. Use this when you need precise placement that stack layouts cannot provide.

## Troubleshooting

**Pages not arranging automatically** — Verify the scene layout is `SceneLayout.VERTICAL_STACK` or `SceneLayout.HORIZONTAL_STACK` with `getLayout()`.

**Spacing not applying** — Set `stack/spacing` on the stack block, not the scene. Use `findByType(DesignBlockType.Stack)` to locate the container.

**Pages overlapping** — Ensure pages are direct children of the stack container. Nested pages do not auto-arrange.

**Can't position manually** — Stack layouts override manual positions. Switch to `SceneLayout.FREE` for manual control.

**Wrong stacking order** — Child order determines position. Use `insertChild(parent = ..., child = ..., index = ...)` to move pages to a specific slot.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.scene.create(sceneLayout=_)` | Create a scene with the specified layout (`SceneLayout.FREE`, `SceneLayout.VERTICAL_STACK`, `SceneLayout.HORIZONTAL_STACK`, `SceneLayout.DEPTH_STACK`). |
| `engine.scene.setLayout(layout=_)` | Change the layout of the current scene. |
| `engine.scene.getLayout()` | Get the current scene layout. |
| `engine.block.findByType(type=DesignBlockType.Stack)` | Find the stack container block. |
| `engine.block.setFloat(block=_, property="stack/spacing", value=_)` | Set spacing between stacked pages. |
| `engine.block.getFloat(block=_, property="stack/spacing")` | Get the current spacing value. |
| `engine.block.setBoolean(block=_, property="stack/spacingInScreenspace", value=_)` | Set whether spacing is measured in screen pixels. |
| `engine.block.appendChild(parent=_, child=_)` | Append a page to the stack. |
| `engine.block.insertChild(parent=_, child=_, index=_)` | Insert a page at a specific position. |
| `engine.block.getChildren(block=_)` | Get child blocks in order. |

## Next Steps

- [Auto-resize](../automation/auto-resize.md) — Make blocks fit parent containers
- [Position and Align](./position-and-align.md) — Position blocks in free layouts
- [Layer Hierarchies](./layer-management.md) — Organize blocks in hierarchical structures
- [Create a Collage](./collage.md) — Create collages by applying layout templates and transferring content between scenes.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support