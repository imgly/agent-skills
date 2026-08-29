> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Images](../../edit-image.md) > [Transform](../transform.md) > [Resize](./resize.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-edit-image-transform-resize/ResizeImages.kt reference-only
import android.net.Uri
import kotlinx.coroutines.yield
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.HandleVisibility
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import ly.img.engine.getResizeHandlesVisibility
import ly.img.engine.setResizeHandlesVisibility

data class ResizeImages(
    val absoluteWidth: Float,
    val absoluteHeight: Float,
    val percentWidth: Float,
    val percentHeight: Float,
    val percentWidthMode: SizeMode,
    val percentHeightMode: SizeMode,
    val frameWidth: Float,
    val frameHeight: Float,
    val cropModeAfterResize: ContentFillMode,
    val groupWidth: Float,
    val pageWidthAfterContentAwareResize: Float,
    val resizeHandlesVisibility: HandleVisibility,
    val resizeScopeEnabled: Boolean,
    val transformLocked: Boolean,
)

suspend fun resizeImages(engine: Engine): ResizeImages {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageBlock = createImageBlock(engine, page)

    engine.editor.setResizeHandlesVisibility(HandleVisibility.ALWAYS)

    val resizeHandlesVisibility = engine.editor.getResizeHandlesVisibility()

    engine.block.setWidthMode(imageBlock, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(imageBlock, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(imageBlock, value = 400F)
    engine.block.setHeight(imageBlock, value = 300F)

    val absoluteWidth = engine.block.getWidth(imageBlock)
    val absoluteHeight = engine.block.getHeight(imageBlock)

    engine.block.setWidthMode(imageBlock, mode = SizeMode.PERCENT)
    engine.block.setHeightMode(imageBlock, mode = SizeMode.PERCENT)
    engine.block.setWidth(imageBlock, value = 0.5F)
    engine.block.setHeight(imageBlock, value = 0.5F)

    val percentWidth = engine.block.getWidth(imageBlock)
    val percentHeight = engine.block.getHeight(imageBlock)
    val percentWidthMode = engine.block.getWidthMode(imageBlock)
    val percentHeightMode = engine.block.getHeightMode(imageBlock)

    // Let the offscreen engine resolve one layout pass before reading frame dimensions.
    yield()

    val frameWidth = engine.block.getFrameWidth(imageBlock)
    val frameHeight = engine.block.getFrameHeight(imageBlock)

    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.CROP)
    engine.block.setWidthMode(imageBlock, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(imageBlock, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(imageBlock, value = 520F, maintainCrop = true)
    engine.block.setHeight(imageBlock, value = 320F, maintainCrop = true)

    val cropModeAfterResize = engine.block.getContentFillMode(imageBlock)

    val secondImageBlock = createImageBlock(engine, page).also { block ->
        engine.block.setPositionX(block, value = 460F)
    }

    val group = engine.block.group(listOf(imageBlock, secondImageBlock))
    engine.block.setWidth(group, value = 600F)

    val groupWidth = engine.block.getWidth(group)

    engine.block.resizeContentAware(blocks = listOf(page), width = 1080F, height = 1080F)

    val pageWidthAfterContentAwareResize = engine.block.getWidth(page)

    engine.block.setScopeEnabled(block = group, key = "layer/resize", enabled = false)
    val resizeScopeEnabled = engine.block.isScopeEnabled(block = group, key = "layer/resize")

    engine.block.setTransformLocked(block = group, locked = true)
    val transformLocked = engine.block.isTransformLocked(group)

    return ResizeImages(
        absoluteWidth = absoluteWidth,
        absoluteHeight = absoluteHeight,
        percentWidth = percentWidth,
        percentHeight = percentHeight,
        percentWidthMode = percentWidthMode,
        percentHeightMode = percentHeightMode,
        frameWidth = frameWidth,
        frameHeight = frameHeight,
        cropModeAfterResize = cropModeAfterResize,
        groupWidth = groupWidth,
        pageWidthAfterContentAwareResize = pageWidthAfterContentAwareResize,
        resizeHandlesVisibility = resizeHandlesVisibility,
        resizeScopeEnabled = resizeScopeEnabled,
        transformLocked = transformLocked,
    )
}

private fun createImageBlock(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock, value = 320F)
    engine.block.setHeight(imageBlock, value = 240F)
    engine.block.setPositionX(imageBlock, value = 120F)
    engine.block.setPositionY(imageBlock, value = 120F)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.appendChild(parent = page, child = imageBlock)

    return imageBlock
}
```

Change image dimensions by setting exact width and height values, switching
size modes, or resizing grouped blocks together.

![Android resize guide result showing two image blocks resized and grouped on a page](https://img.ly/docs/cesdk/android/edit-image/transform/resize-407242/assets/android.hero.webp)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-edit-image-transform-resize)

<EngineReferenceNote {...props} />

Image resizing changes a block's dimensions rather than applying a scale multiplier. Use `engine.block.setWidth()` and `engine.block.setHeight()` for individual dimensions, and choose a `SizeMode` to control how each value is interpreted.

This guide covers resizing image blocks with absolute or percentage sizing, preserving crop state during resize, and locking resize permissions for templates.

## Create an Image Block

Create a graphic block with an image fill before applying resize operations:

```kotlin highlight-android-create-image-block
private fun createImageBlock(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock, value = 320F)
    engine.block.setHeight(imageBlock, value = 240F)
    engine.block.setPositionX(imageBlock, value = 120F)
    engine.block.setPositionY(imageBlock, value = 120F)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.appendChild(parent = page, child = imageBlock)

    return imageBlock
}
```

The resize APIs operate on the block frame. The image fill remains attached to the graphic block and follows the crop and fill mode settings.

## Understanding Size Modes

Size values are interpreted in three modes. `SizeMode.ABSOLUTE` uses fixed design units, `SizeMode.PERCENT` uses parent-relative values from `0.0F` to `1.0F`, and `SizeMode.AUTO` lets CE.SDK calculate the size from content where supported.

Use `engine.block.getWidth()` and `engine.block.getHeight()` to read configured values. Use `engine.block.getFrameWidth()` and `engine.block.getFrameHeight()` when you need the calculated layout dimensions after CE.SDK resolves the block.

## Using the Built-In Resize UI

The CE.SDK editor UI shows resize handles when a selectable block supports resize operations. You can hide, show, or defer the non-proportional edge handles with the typed resize-handle visibility API:

```kotlin highlight-android-resize-handles
    engine.editor.setResizeHandlesVisibility(HandleVisibility.ALWAYS)

    val resizeHandlesVisibility = engine.editor.getResizeHandlesVisibility()
```

This API controls handle visibility only. Programmatic resize APIs and other transform controls still follow the block's scopes and transform lock state.

For a complete photo editing surface, see the [Photo Editor Starter Kit](../../starterkits/photo-editor.md).

## Setting Absolute Dimensions

Set explicit dimensions by switching both axes to `SizeMode.ABSOLUTE`, then writing width and height values:

```kotlin highlight-android-absolute-size
    engine.block.setWidthMode(imageBlock, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(imageBlock, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(imageBlock, value = 400F)
    engine.block.setHeight(imageBlock, value = 300F)

    val absoluteWidth = engine.block.getWidth(imageBlock)
    val absoluteHeight = engine.block.getHeight(imageBlock)
```

Absolute sizing is the most direct option for fixed layouts, templates, and exports where the target design units are known.

## Percentage Sizing

Use percentage mode for responsive sizing. A value of `1.0F` means 100 percent of the parent on that axis:

```kotlin highlight-android-percent-size
    engine.block.setWidthMode(imageBlock, mode = SizeMode.PERCENT)
    engine.block.setHeightMode(imageBlock, mode = SizeMode.PERCENT)
    engine.block.setWidth(imageBlock, value = 0.5F)
    engine.block.setHeight(imageBlock, value = 0.5F)

    val percentWidth = engine.block.getWidth(imageBlock)
    val percentHeight = engine.block.getHeight(imageBlock)
    val percentWidthMode = engine.block.getWidthMode(imageBlock)
    val percentHeightMode = engine.block.getHeightMode(imageBlock)
```

Percentage sizing adapts when the parent dimensions change, which makes it useful for reusable templates and generated layouts.

## Getting Frame Dimensions

Configured width and height can differ from the rendered frame in percentage and auto modes. Read the frame dimensions when you need the final layout size:

```kotlin highlight-android-frame-dimensions
val frameWidth = engine.block.getFrameWidth(imageBlock)
val frameHeight = engine.block.getFrameHeight(imageBlock)
```

Frame dimensions are only available after CE.SDK has resolved layout for the block. In an offscreen sample, let the engine process one layout or update pass after changing percentage or auto sizes before calling these getters; the complete source does that immediately before the highlighted read.

## Maintaining Crop During Resize

When you resize an image block, you change the image frame. The fill and crop state control how the image content remains framed inside that new size.

For reusable code that may receive other block types, call `engine.block.supportsContentFillMode()` before reading or setting content fill mode.

Pass `maintainCrop = true` when the current crop should stay visually stable while the frame changes:

```kotlin highlight-android-maintain-crop
    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.CROP)
    engine.block.setWidthMode(imageBlock, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(imageBlock, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(imageBlock, value = 520F, maintainCrop = true)
    engine.block.setHeight(imageBlock, value = 320F, maintainCrop = true)

    val cropModeAfterResize = engine.block.getContentFillMode(imageBlock)
```

Use this for user-adjusted images or layout changes where visual continuity matters. Leave `maintainCrop` at its default when crop values should stay unadjusted and the visible framing can change according to the current fill and crop state.

## Resizing Groups

Group multiple blocks, then resize the group block to keep the members together:

```kotlin highlight-android-group-resize
    val group = engine.block.group(listOf(imageBlock, secondImageBlock))
    engine.block.setWidth(group, value = 600F)

    val groupWidth = engine.block.getWidth(group)
```

When a group is resized, CE.SDK keeps the group aspect ratio and updates both dimensions proportionally.

## Content-Aware Resizing

Use `resizeContentAware()` when changing page dimensions for another output format:

```kotlin highlight-android-content-aware-resize
    engine.block.resizeContentAware(blocks = listOf(page), width = 1080F, height = 1080F)

    val pageWidthAfterContentAwareResize = engine.block.getWidth(page)
```

This keeps full-page blocks attached to the page and scales other content proportionally.

## Locking Resize Operations

Disable the `layer/resize` scope when a template block should stay at its configured size. Use a transform lock when users should not move, rotate, or resize the block at all:

```kotlin highlight-android-lock-resize
    engine.block.setScopeEnabled(block = group, key = "layer/resize", enabled = false)
    val resizeScopeEnabled = engine.block.isScopeEnabled(block = group, key = "layer/resize")

    engine.block.setTransformLocked(block = group, locked = true)
    val transformLocked = engine.block.isTransformLocked(group)
```

## Troubleshooting

### Image Not Resizing

Check whether `layer/resize` is disabled or the block is transform-locked. Then verify that the block exists and that the width and height modes match the values you write.

### Unexpected Size Values

Read `getWidthMode()` and `getHeightMode()` before interpreting numeric values. In percentage mode, `0.5F` means 50 percent of the parent, not 0.5 design units.

### Image Appears Cropped

Resize changes the frame around the image content. Use `maintainCrop = true` to preserve the existing crop framing, or adjust the crop after resize when you want a different composition.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.create(blockType=_)` | Create a graphic or page block |
| `engine.block.createShape(type=_)` | Create the shape used by a graphic block |
| `engine.block.setShape(block=_, shape=_)` | Attach a shape to a graphic block |
| `engine.block.setPositionX(block=_, value=_)` | Set a block's x position |
| `engine.block.setPositionY(block=_, value=_)` | Set a block's y position |
| `engine.block.createFill(fillType=_)` | Create an image fill |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Set the image URI on the fill |
| `engine.block.setFill(block=_, fill=_)` | Attach a fill to a block |
| `engine.block.appendChild(parent=_, child=_)` | Add the image block to the page |
| `engine.editor.setResizeHandlesVisibility(value=_)` | Set when editor resize handles are shown |
| `engine.editor.getResizeHandlesVisibility()` | Read when editor resize handles are shown |
| `engine.block.setWidthMode(block=_, mode=_)` | Set how CE.SDK interprets the width value |
| `engine.block.setHeightMode(block=_, mode=_)` | Set how CE.SDK interprets the height value |
| `engine.block.setWidth(block=_, value=_, maintainCrop=_)` | Set a block width and optionally preserve crop state |
| `engine.block.setHeight(block=_, value=_, maintainCrop=_)` | Set a block height and optionally preserve crop state |
| `engine.block.getWidth(block=_)` | Read the configured width value |
| `engine.block.getHeight(block=_)` | Read the configured height value |
| `engine.block.getWidthMode(block=_)` | Read the width mode |
| `engine.block.getHeightMode(block=_)` | Read the height mode |
| `engine.block.getFrameWidth(block=_)` | Read the resolved frame width after layout |
| `engine.block.getFrameHeight(block=_)` | Read the resolved frame height after layout |
| `engine.block.supportsContentFillMode(block=_)` | Check whether a block exposes content fill mode |
| `engine.block.setContentFillMode(block=_, mode=_)` | Set how image content fills its frame |
| `engine.block.getContentFillMode(block=_)` | Read how image content fills its frame |
| `engine.block.group(blocks=_)` | Group blocks before resizing them together |
| `engine.block.resizeContentAware(blocks=_, width=_, height=_)` | Resize blocks while adjusting contained content |
| `engine.block.setScopeEnabled(block=_, key="layer/resize", enabled=_)` | Enable or disable resize permission for a block |
| `engine.block.isScopeEnabled(block=_, key="layer/resize")` | Read whether resize permission is enabled |
| `engine.block.setTransformLocked(block=_, locked=_)` | Lock or unlock all transforms on a block |
| `engine.block.isTransformLocked(block=_)` | Read the transform lock state |

## Next Steps

- Resize images proportionally with [Scale](./scale.md).
- Control image framing and visible content with [Crop](./crop.md).
- Apply resizing across complete designs with [Auto-Resize](../../automation/auto-resize.md).



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support