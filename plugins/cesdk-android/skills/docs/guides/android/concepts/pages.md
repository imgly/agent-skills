> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Pages](./pages.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-concepts-pages/Pages.kt reference-only
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.SceneLayout
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

suspend fun pages(engine: Engine): PagesGuideSummary = withContext(engine.dispatcher) {
    // Create a scene with VerticalStack layout for multi-page designs.
    val scene = engine.scene.create(sceneLayout = SceneLayout.VERTICAL_STACK)

    val stack = engine.block.findByType(DesignBlockType.Stack).first()
    engine.block.setFloat(block = stack, property = "stack/spacing", value = 20F)
    engine.block.setBoolean(
        block = stack,
        property = "stack/spacingInScreenspace",
        value = true,
    )

    // Set page dimensions at the scene level so new pages share the same size.
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/width",
        value = 800F,
    )
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/height",
        value = 600F,
    )

    val firstPage = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = firstPage, value = 800F)
    engine.block.setHeight(block = firstPage, value = 600F)
    engine.block.appendChild(parent = stack, child = firstPage)

    val secondPage = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = secondPage, value = 800F)
    engine.block.setHeight(block = secondPage, value = 600F)
    engine.block.appendChild(parent = stack, child = secondPage)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.appendChild(parent = firstPage, child = imageBlock)

    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = imageBlock, shape = rectShape)
    engine.block.setWidth(block = imageBlock, value = 400F)
    engine.block.setHeight(block = imageBlock, value = 300F)
    engine.block.setPositionX(block = imageBlock, value = 200F)
    engine.block.setPositionY(block = imageBlock, value = 150F)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)

    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = secondPage, child = textBlock)
    engine.block.replaceText(textBlock, text = "Page 2")
    engine.block.setTextFontSize(block = textBlock, fontSize = 48F)
    engine.block.setTextColor(
        block = textBlock,
        color = Color.fromRGBA(r = 0.2F, g = 0.2F, b = 0.2F, a = 1F),
    )
    engine.block.setWidthMode(block = textBlock, mode = SizeMode.AUTO)
    engine.block.setHeightMode(block = textBlock, mode = SizeMode.AUTO)

    val textWidth = engine.block.getFrameWidth(textBlock)
    val textHeight = engine.block.getFrameHeight(textBlock)
    engine.block.setPositionX(block = textBlock, value = (800F - textWidth) / 2F)
    engine.block.setPositionY(block = textBlock, value = (600F - textHeight) / 2F)

    engine.block.setBoolean(
        block = firstPage,
        property = "page/marginEnabled",
        value = true,
    )
    engine.block.setFloat(block = firstPage, property = "page/margin/top", value = 10F)
    engine.block.setFloat(block = firstPage, property = "page/margin/bottom", value = 10F)
    engine.block.setFloat(block = firstPage, property = "page/margin/left", value = 10F)
    engine.block.setFloat(block = firstPage, property = "page/margin/right", value = 10F)

    engine.block.setString(
        block = firstPage,
        property = "page/titleTemplate",
        value = "Cover",
    )
    engine.block.setString(
        block = secondPage,
        property = "page/titleTemplate",
        value = "Content",
    )

    engine.block.setFillSolidColor(
        block = secondPage,
        color = Color.fromRGBA(r = 0.95F, g = 0.95F, b = 1F, a = 1F),
    )

    val allPages = engine.scene.getPages()
    val currentPage = engine.scene.getCurrentPage()
    val pagesByType = engine.block.findByType(DesignBlockType.Page)
    val nearestPages = engine.scene.findNearestToViewPortCenterByType(DesignBlockType.Page)

    engine.block.forceLoadResources(listOf(imageBlock, textBlock))

    PagesGuideSummary(
        pageCount = allPages.size,
        currentPageTitle = currentPage?.let {
            engine.block.getString(block = it, property = "page/titleTemplate")
        },
        pageTitles = pagesByType.map {
            engine.block.getString(block = it, property = "page/titleTemplate")
        },
        nearestPageCount = nearestPages.size,
    )
}
```

Pages define the format of your designs. Every graphic block, text element, and media asset lives inside a page. This guide shows how pages fit into the Android scene hierarchy, how stacked layouts keep page sizes aligned, and which page-level properties you can configure in Kotlin.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/engine-guides-concepts-pages)

<EngineReferenceNote {...props} />

Pages provide the canvas and frame for your designs. Whether you're building a multi-page document, a carousel, or a video composition, understanding how pages work helps you structure content correctly.

This guide covers:

- Understanding the scene hierarchy: Scene → Pages → Blocks
- Creating and managing multiple pages
- Setting shared page dimensions at the scene level
- Configuring margins, title templates, and page backgrounds
- Finding pages programmatically

## Pages in the Scene Hierarchy

In CE.SDK, content follows a strict hierarchy: a **scene** contains **pages**, and pages contain **content blocks**. Only blocks attached to a page are rendered on the canvas.

```kotlin highlight-android-pages-create-scene
    // Create a scene with VerticalStack layout for multi-page designs.
    val scene = engine.scene.create(sceneLayout = SceneLayout.VERTICAL_STACK)

    val stack = engine.block.findByType(DesignBlockType.Stack).first()
    engine.block.setFloat(block = stack, property = "stack/spacing", value = 20F)
    engine.block.setBoolean(
        block = stack,
        property = "stack/spacingInScreenspace",
        value = true,
    )
```

When you create a scene with `SceneLayout.VERTICAL_STACK`, CE.SDK inserts a stack container that arranges pages automatically. Configure the stack before adding pages if you need gaps between them.

```kotlin highlight-android-pages-create-pages
    val firstPage = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = firstPage, value = 800F)
    engine.block.setHeight(block = firstPage, value = 600F)
    engine.block.appendChild(parent = stack, child = firstPage)

    val secondPage = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = secondPage, value = 800F)
    engine.block.setHeight(block = secondPage, value = 600F)
    engine.block.appendChild(parent = stack, child = secondPage)
```

Create pages with `engine.block.create(DesignBlockType.Page)`. In stacked layouts, append pages to the stack container; for single-page or free layouts, you can append a page directly to the scene. Stacked pages should use the same dimensions to avoid normalization when the editor loads the scene.

```kotlin highlight-android-pages-add-content
    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.appendChild(parent = firstPage, child = imageBlock)

    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = imageBlock, shape = rectShape)
    engine.block.setWidth(block = imageBlock, value = 400F)
    engine.block.setHeight(block = imageBlock, value = 300F)
    engine.block.setPositionX(block = imageBlock, value = 200F)
    engine.block.setPositionY(block = imageBlock, value = 150F)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)

    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = secondPage, child = textBlock)
    engine.block.replaceText(textBlock, text = "Page 2")
    engine.block.setTextFontSize(block = textBlock, fontSize = 48F)
    engine.block.setTextColor(
        block = textBlock,
        color = Color.fromRGBA(r = 0.2F, g = 0.2F, b = 0.2F, a = 1F),
    )
    engine.block.setWidthMode(block = textBlock, mode = SizeMode.AUTO)
    engine.block.setHeightMode(block = textBlock, mode = SizeMode.AUTO)

    val textWidth = engine.block.getFrameWidth(textBlock)
    val textHeight = engine.block.getFrameHeight(textBlock)
    engine.block.setPositionX(block = textBlock, value = (800F - textWidth) / 2F)
    engine.block.setPositionY(block = textBlock, value = (600F - textHeight) / 2F)
```

Content blocks must be appended to a page before they render. In this example, the first page shows an image block with a rectangular image fill, and the second page centers a text block with auto-sized width and height.

## Page Dimensions and Consistency

The Creative Engine can store pages with different dimensions, but the editor UI is designed around consistent page sizes for stacked layouts such as `VERTICAL_STACK` and `HORIZONTAL_STACK`. If you load a stacked scene with mixed page sizes, the editor may normalize the scene to keep the layout predictable.

```kotlin highlight-android-pages-set-dimensions
// Set page dimensions at the scene level so new pages share the same size.
engine.block.setFloat(
    block = scene,
    property = "scene/pageDimensions/width",
    value = 800F,
)
engine.block.setFloat(
    block = scene,
    property = "scene/pageDimensions/height",
    value = 600F,
)
```

Use the scene-level properties `scene/pageDimensions/width` and `scene/pageDimensions/height` to define the shared default size for pages. The `scene/aspectRatioLock` property controls whether width and height stay linked when you change one dimension.

Individual pages can also be sized directly with `engine.block.setWidth()` and `engine.block.setHeight()`. Keep the scene-level dimensions as the shared default for stacked layouts, and use `SceneLayout.FREE` when different page sizes are intentional.

## Finding and Navigating Pages

CE.SDK provides several ways to inspect the pages in the current scene.

```kotlin highlight-android-pages-find-pages
val allPages = engine.scene.getPages()
val currentPage = engine.scene.getCurrentPage()
val pagesByType = engine.block.findByType(DesignBlockType.Page)
val nearestPages = engine.scene.findNearestToViewPortCenterByType(DesignBlockType.Page)
```

Use these APIs based on your workflow:

- `engine.scene.getPages()` returns all pages in scene order.
- `engine.scene.getCurrentPage()` returns the selected page or the page nearest to the viewport center.
- `engine.block.findByType(DesignBlockType.Page)` finds every page block regardless of selection state.
- `engine.scene.findNearestToViewPortCenterByType(DesignBlockType.Page)` sorts pages by distance to the viewport center.

## Page Properties

Page-specific properties live on the page block itself, not on the scene.

### Margins

Page margins are useful for print and bleed-safe layouts. Enable margins once, then set each side individually.

```kotlin highlight-android-pages-page-margins
engine.block.setBoolean(
    block = firstPage,
    property = "page/marginEnabled",
    value = true,
)
engine.block.setFloat(block = firstPage, property = "page/margin/top", value = 10F)
engine.block.setFloat(block = firstPage, property = "page/margin/bottom", value = 10F)
engine.block.setFloat(block = firstPage, property = "page/margin/left", value = 10F)
engine.block.setFloat(block = firstPage, property = "page/margin/right", value = 10F)
```

Set `page/marginEnabled` to `true`, then adjust `page/margin/top`, `page/margin/bottom`, `page/margin/left`, and `page/margin/right` in design units.

### Title Template

The `page/titleTemplate` property controls the label shown for a page. It supports template tokens such as `{{ubq.page_index}}` for numbered labels.

```kotlin highlight-android-pages-title-template
engine.block.setString(
    block = firstPage,
    property = "page/titleTemplate",
    value = "Cover",
)
engine.block.setString(
    block = secondPage,
    property = "page/titleTemplate",
    value = "Content",
)
```

The default template is `"Page {{ubq.page_index}}"`. Override it when you want labels such as `"Cover"` or `"Content"`.

### Fill and Background

Pages support fills through the standard fill API. This example applies a solid background color to a page.

```kotlin highlight-android-pages-page-background
engine.block.setFillSolidColor(
    block = secondPage,
    color = Color.fromRGBA(r = 0.95F, g = 0.95F, b = 1F, a = 1F),
)
```

Use `engine.block.setFillSolidColor(page, color)` for a solid page background.

## Page Layout Modes

The scene layout controls how multiple pages are arranged. Use `engine.scene.create(sceneLayout = ...)` when you create the scene or `engine.scene.setLayout(...)` later.

| Layout | Description |
| ------ | ----------- |
| `SceneLayout.VERTICAL_STACK` | Pages stack vertically from top to bottom. |
| `SceneLayout.HORIZONTAL_STACK` | Pages arrange side by side from left to right. |
| `SceneLayout.DEPTH_STACK` | Pages overlap in depth order, which is common for video scenes. |
| `SceneLayout.FREE` | Pages can be positioned freely and may use different dimensions. |

## Pages for Static Designs vs. Video Editing

Pages behave differently depending on the scene mode you choose.

### Static Designs

For static design scenes, pages act like artboards. Each page is a separate canvas for documents, carousels, social posts, or print layouts, and pages stay spatially arranged according to the scene layout.

### Video Editing

For video scenes, pages represent time-based compositions that play one after another. Page-level playback properties control timeline behavior:

- `playback/duration` determines how long each page is shown.
- `playback/time` tracks the current playback position.

## Troubleshooting

### Content Not Visible

If a block is not visible, check these common causes:

- Verify the block is attached to a page with `engine.block.appendChild(parent = page, child = block)`.
- For graphic blocks, ensure both a shape and a fill are set.
- Append blocks to the page before setting their size and position.

### Dimension Inconsistencies

If stacked pages show unexpected sizes in the editor, set the shared size on the scene first and keep page dimensions aligned. Use `SceneLayout.FREE` only when different page sizes are intentional.

### Page Not Found

If `engine.scene.getPages()` returns an empty list, make sure a scene exists and that you appended at least one page. In headless workflows, you must create both the scene and the pages yourself.

## API Reference

| API | Purpose |
| --- | ------- |
| `engine.scene.create(sceneLayout=SceneLayout.VERTICAL_STACK)` | Create a multi-page scene with automatic page stacking. |
| `engine.scene.setLayout(layout=SceneLayout.HORIZONTAL_STACK)` | Change how existing pages are arranged. |
| `engine.scene.getPages()` | Return all pages in scene order. |
| `engine.scene.getCurrentPage()` | Return the selected or nearest visible page. |
| `engine.scene.findNearestToViewPortCenterByType(type=DesignBlockType.Page)` | Sort pages by distance to the viewport center. |
| `engine.block.findByType(type=DesignBlockType.Page)` | Find all page blocks in the scene. |
| `engine.block.setFloat(block=_, property="scene/pageDimensions/width", value=_)` | Set the shared page width. |
| `engine.block.setFloat(block=_, property="scene/pageDimensions/height", value=_)` | Set the shared page height. |
| `engine.block.setString(block=_, property="page/titleTemplate", value=_)` | Override the displayed page label. |
| `engine.block.setFillSolidColor(block=_, color=Color.fromRGBA(r=_, g=_, b=_, a=_))` | Apply a solid background color to a page. |

## Next Steps

- [Scenes](./scenes.md) — Learn about scene structure and management
- [Blocks](./blocks.md) — Understand the building blocks that live inside pages
- [Page Format](../user-interface/customization/page-format.md) — Configure default page sizes in the UI
- [Design Units](./design-units.md) — Define layout in px, mm, or in—CE.SDK supports unit conversion and DPI scaling for consistent design.
- [Templating](./templating.md) — Templates enable dynamic, reusable designs with text variables and placeholder media. Learn to create, load, and personalize templates programmatically.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support