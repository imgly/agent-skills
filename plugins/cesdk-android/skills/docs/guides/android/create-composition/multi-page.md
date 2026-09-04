> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Multi-Page Layouts](./multi-page.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-multi-page/MultiPage.kt reference-only
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.SceneLayout
import ly.img.engine.ShapeType

suspend fun multiPage(engine: Engine) = withContext(engine.dispatcher) {
    // Create a scene with HorizontalStack layout.
    engine.scene.create(sceneLayout = SceneLayout.HORIZONTAL_STACK)

    // Get the stack container that owns pages in stack layouts.
    val stack = engine.block.findByType(DesignBlockType.Stack).first()

    // Create the first page.
    val firstPage = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(firstPage, value = 800F)
    engine.block.setHeight(firstPage, value = 600F)
    engine.block.appendChild(parent = stack, child = firstPage)

    // Add spacing between pages (20 pixels in screen space).
    engine.block.setFloat(stack, property = "stack/spacing", value = 20F)
    engine.block.setBoolean(stack, property = "stack/spacingInScreenspace", value = true)

    // Add content to the first page.
    val imageBlock1 = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock1, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock1, value = 300F)
    engine.block.setHeight(imageBlock1, value = 200F)
    engine.block.setPositionX(imageBlock1, value = 250F)
    engine.block.setPositionY(imageBlock1, value = 200F)
    val imageFill1 = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill1,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(imageBlock1, fill = imageFill1)
    engine.block.appendChild(parent = firstPage, child = imageBlock1)

    // Create a second page with different content.
    val secondPage = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(secondPage, value = 800F)
    engine.block.setHeight(secondPage, value = 600F)
    engine.block.appendChild(parent = stack, child = secondPage)

    // Add a different image to the second page.
    val imageBlock2 = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock2, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock2, value = 300F)
    engine.block.setHeight(imageBlock2, value = 200F)
    engine.block.setPositionX(imageBlock2, value = 250F)
    engine.block.setPositionY(imageBlock2, value = 200F)
    val imageFill2 = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill2,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_2.jpg",
    )
    engine.block.setFill(imageBlock2, fill = imageFill2)
    engine.block.appendChild(parent = secondPage, child = imageBlock2)

    val pages = engine.scene.getPages()
    println("Pages: ${pages.size}")

    val currentPage = engine.scene.getCurrentPage()
    println("Current page: $currentPage")

    val duplicatedPage = engine.block.duplicate(firstPage)

    engine.block.insertChild(parent = stack, child = secondPage, index = 0)

    if (engine.scene.getPages().size > 1) {
        engine.block.destroy(duplicatedPage)
    }

    engine.scene.zoomToBlock(
        block = firstPage,
        paddingLeft = 20F,
        paddingTop = 20F,
        paddingRight = 20F,
        paddingBottom = 20F,
    )

    val nearestPage = engine.scene.findNearestToViewPortCenterByType(
        DesignBlockType.Page,
    ).firstOrNull()
    println("Nearest page: $nearestPage")

    engine.block.forceLoadResources(listOf(imageBlock1, imageBlock2))
}
```

Create multi-page designs in CE.SDK for brochures, presentations, catalogs,
and other documents requiring multiple pages within a single scene.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260904/engine-guides-multi-page)

<EngineReferenceNote {...props} />

Multi-page layouts allow you to create documents with multiple pages within a single scene. Each page is an independent canvas that can contain different content while sharing the same scene context. CE.SDK provides scene layout modes that arrange pages vertically, horizontally, or in a free-form canvas.

This guide covers how to create multi-page scenes, add and manage pages, configure spacing between pages, and focus the viewport on a page.

## Using the Built-in Page Management UI

The CE.SDK Android editor includes a pages mode that displays page thumbnails in a grid. Users can add pages, move the selected page up or down, duplicate supported pages, delete pages when more than one page remains, resize pages, and switch back to editing a selected page.

Page thumbnails make the document structure visible at a glance. Selecting a page updates the current page, and opening it in edit mode focuses the editor on that page.

## Creating Multi-Page Scenes Programmatically

We can create scenes with multiple pages using the engine API. The scene acts as the document container, and each page can hold independent content blocks.

### Creating a Scene with Pages

We create a new scene with `engine.scene.create(sceneLayout = SceneLayout.HORIZONTAL_STACK)`. Stack layouts create a stack block that owns the pages, so we append page blocks to that stack.

```kotlin highlight-android-create-scene
    // Create a scene with HorizontalStack layout.
    engine.scene.create(sceneLayout = SceneLayout.HORIZONTAL_STACK)

    // Get the stack container that owns pages in stack layouts.
    val stack = engine.block.findByType(DesignBlockType.Stack).first()

    // Create the first page.
    val firstPage = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(firstPage, value = 800F)
    engine.block.setHeight(firstPage, value = 600F)
    engine.block.appendChild(parent = stack, child = firstPage)
```

The scene uses `SceneLayout.HORIZONTAL_STACK`, so pages are arranged side by side from left to right. The first page is created with 800 x 600 dimensions and appended to the stack container.

### Configuring Page Spacing

We can add spacing between pages in a stack layout with the `stack/spacing` property. This creates visual separation between adjacent pages.

```kotlin highlight-android-stack-spacing
// Add spacing between pages (20 pixels in screen space).
engine.block.setFloat(stack, property = "stack/spacing", value = 20F)
engine.block.setBoolean(stack, property = "stack/spacingInScreenspace", value = true)
```

Setting `stack/spacingInScreenspace` to `true` interprets the spacing value as screen pixels, so the visual spacing stays consistent while zooming.

The distinction applies to the canvas preview only. Exports always interpret the spacing in design units, whatever the property is set to.

Switching the property never converts the number. A spacing of `40` stays `40` and is reinterpreted in the other space, which changes how far apart the pages appear.

### Adding More Pages

To add another page, we create a new page block, set its dimensions, and append it to the same stack container.

```kotlin highlight-android-add-page
    // Create a second page with different content.
    val secondPage = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(secondPage, value = 800F)
    engine.block.setHeight(secondPage, value = 600F)
    engine.block.appendChild(parent = stack, child = secondPage)

    // Add a different image to the second page.
    val imageBlock2 = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock2, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock2, value = 300F)
    engine.block.setHeight(imageBlock2, value = 200F)
    engine.block.setPositionX(imageBlock2, value = 250F)
    engine.block.setPositionY(imageBlock2, value = 200F)
    val imageFill2 = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill2,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_2.jpg",
    )
    engine.block.setFill(imageBlock2, fill = imageFill2)
    engine.block.appendChild(parent = secondPage, child = imageBlock2)
```

Each page can contain different content. Here the second page receives a separate image block, showing that page contents are independent.

### Managing Pages

Existing pages are available through `engine.scene.getPages()`. Use this list for page counts, page pickers, and operations that need a stable page order.

```kotlin highlight-android-list-pages
val pages = engine.scene.getPages()
println("Pages: ${pages.size}")
```

The current page comes from the selected content when that page is visible enough; otherwise CE.SDK returns the page nearest to the viewport center.

```kotlin highlight-android-current-page
val currentPage = engine.scene.getCurrentPage()
println("Current page: $currentPage")
```

`engine.block.duplicate()` copies a page and its children.

```kotlin highlight-android-duplicate-page
val duplicatedPage = engine.block.duplicate(firstPage)
```

`engine.block.insertChild()` moves a page to a specific index in the stack, and `engine.block.destroy()` removes a page. Keep at least one page in the scene.

```kotlin highlight-android-reorder-delete-pages
    engine.block.insertChild(parent = stack, child = secondPage, index = 0)

    if (engine.scene.getPages().size > 1) {
        engine.block.destroy(duplicatedPage)
    }
```

## Scene Layout Types

CE.SDK supports different layout modes that control how pages are arranged on the canvas. You specify the layout type when creating the scene with `engine.scene.create(sceneLayout = ...)` or change it later with `engine.scene.setLayout(...)`.

**Free Layout** (`SceneLayout.FREE`) is the default where pages can be positioned anywhere on the canvas. This provides complete control over page placement.

**VerticalStack Layout** (`SceneLayout.VERTICAL_STACK`) arranges pages automatically in a vertical stack from top to bottom. This is useful for scroll-based document previews.

**HorizontalStack Layout** (`SceneLayout.HORIZONTAL_STACK`) arranges pages side by side from left to right. This is useful for carousel-style presentations or side-by-side comparisons.

## Navigating Between Pages

We can focus the viewport on a specific page with the suspending `engine.scene.zoomToBlock(...)` API. Padding values are interpreted in screen pixels.

```kotlin highlight-android-zoom-to-page
engine.scene.zoomToBlock(
    block = firstPage,
    paddingLeft = 20F,
    paddingTop = 20F,
    paddingRight = 20F,
    paddingBottom = 20F,
)
```

To derive navigation state from the viewport, find pages sorted by distance to the viewport center and use the first result.

```kotlin highlight-android-nearest-page
val nearestPage = engine.scene.findNearestToViewPortCenterByType(
    DesignBlockType.Page,
).firstOrNull()
println("Nearest page: $nearestPage")
```

## Troubleshooting

**Page not visible after creation**: Ensure the page is attached to the stack with `appendChild(...)` and has valid dimensions set with `setWidth(...)` and `setHeight(...)`.

**Cannot add content to page**: Verify you're appending blocks to the page block, not the scene directly. Content blocks should be children of pages.

**Pages overlapping**: When using stack layouts, make sure pages are appended to the stack container, found with `findByType(DesignBlockType.Stack)`, not directly to the scene.

**Spacing not visible**: Check that `stack/spacing` is set to a positive value and that you're using a stack layout (`SceneLayout.HORIZONTAL_STACK` or `SceneLayout.VERTICAL_STACK`).

## API Reference

| Method | Purpose |
| ------ | ------- |
| `engine.scene.create(sceneLayout=_)` | Create a scene with a free, vertical stack, or horizontal stack layout. |
| `engine.scene.setLayout(layout=_)` | Change the current scene layout. |
| `engine.scene.getPages()` | Return the sorted list of pages in the current scene. |
| `engine.scene.getCurrentPage()` | Return the selected or viewport-centered current page. |
| `engine.scene.zoomToBlock(block=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Focus the viewport on a page or another block. |
| `engine.scene.findNearestToViewPortCenterByType(blockType=DesignBlockType.Page)` | Find pages sorted by distance to the viewport center. |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create a page block. |
| `engine.block.appendChild(parent=_, child=_)` | Attach a page to the scene or stack container. |
| `engine.block.insertChild(parent=_, child=_, index=_)` | Move a page to a specific child index. |
| `engine.block.duplicate(block=_)` | Copy a page and its children. |
| `engine.block.destroy(block=_)` | Remove a page or block from the scene. |
| `engine.block.setWidth(block=_, value=_)` | Set a page width. |
| `engine.block.setHeight(block=_, value=_)` | Set a page height. |
| `engine.block.setFloat(block=_, property="stack/spacing", value=_)` | Configure spacing between pages in stack layouts. |
| `engine.block.setBoolean(block=_, property="stack/spacingInScreenspace", value=_)` | Keep stack spacing fixed in screen pixels. |

## Next Steps

- [Export Options](../export-save-publish/export/overview.md) - Explore export options, supported formats, and configuration features for sharing or rendering output.
- [Design a Layout](./layout.md) - Create structured compositions using scene layouts, positioning systems, and hierarchical block organization for collages, magazines, and multi-page documents.
- [Layer Management](./layer-management.md) - Organize design elements using a layer stack for precise control over stacking and visibility.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support