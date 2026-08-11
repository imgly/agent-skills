> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Start With Blank Canvas](./blank-canvas.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-open-the-editor-blank-canvas/BlankCanvas.kt reference-only
package ly.img.editor.showcase

import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.SceneLayout
import ly.img.engine.ShapeType
import ly.img.engine.ZoomAutoFitAxis

suspend fun blankCanvas(engine: Engine): BlankCanvasResult {
    val scene = engine.scene.create(sceneLayout = SceneLayout.FREE)

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = page, value = 800F)
    engine.block.setHeight(block = page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val pageFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block = page, fill = pageFill)
    engine.block.setFillSolidColor(
        block = page,
        color = Color.fromRGBA(r = 0.95F, g = 0.95F, b = 0.96F, a = 1F),
    )

    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = block, shape = engine.block.createShape(ShapeType.Star))
    val fill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block = block, fill = fill)
    engine.block.setFillSolidColor(
        block = block,
        color = Color.fromRGBA(r = 0.27F, g = 0.52F, b = 0.96F, a = 1F),
    )
    engine.block.setWidth(block = block, value = 300F)
    engine.block.setHeight(block = block, value = 300F)
    engine.block.setPositionX(block = block, value = 250F)
    engine.block.setPositionY(block = block, value = 150F)
    engine.block.appendChild(parent = page, child = block)

    engine.scene.enableZoomAutoFit(
        block = page,
        axis = ZoomAutoFitAxis.BOTH,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )

    val previewPng = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = ExportOptions(targetWidth = 800F, targetHeight = 600F),
    )

    return BlankCanvasResult(
        page = page,
        block = block,
        previewPng = previewPng,
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-open-the-editor-blank-canvas/BlankCanvasResult.kt reference-only
package ly.img.editor.showcase

import ly.img.engine.DesignBlock
import java.nio.ByteBuffer

data class BlankCanvasResult(
    val page: DesignBlock,
    val block: DesignBlock,
    val previewPng: ByteBuffer,
)
```

Create a new scene from scratch to build designs with complete control over canvas dimensions and initial content.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260811/engine-guides-open-the-editor-blank-canvas)

<EngineReferenceNote {...props} />

Starting from a blank canvas lets you build new designs without pre-existing content. `engine.scene.create()` creates an empty scene with its own camera, ready for pages and blocks. This differs from loading a template or an image, which start with existing content. See [Blocks](../concepts/blocks.md) for more on scene hierarchy.

> **Other Ways to Create Scenes:** You can also start with existing content:* [Create From Image](./from-image.md) — Start with an image as the base
> * [Load a Scene](./load-scene.md) — Resume editing a previously saved design

## Create an Empty Scene

Call `engine.scene.create(sceneLayout=_)` to create a new design scene with a camera attached. The scene itself has no dimensions, so you set the canvas size on each page.

```kotlin highlight-android-create-scene
val scene = engine.scene.create(sceneLayout = SceneLayout.FREE)
```

The `sceneLayout` parameter controls how pages are arranged. Use `SceneLayout.FREE` for independent positioning, `SceneLayout.VERTICAL_STACK` or `SceneLayout.HORIZONTAL_STACK` for aligned layouts, and `SceneLayout.DEPTH_STACK` for layered compositions.

## Configure Page Size

Create a page with `engine.block.create(blockType=_)`, set its dimensions with `setWidth()` and `setHeight()` in design units, then parent it to the scene with `appendChild()`.

```kotlin highlight-android-configure-page
val page = engine.block.create(DesignBlockType.Page)
engine.block.setWidth(block = page, value = 800F)
engine.block.setHeight(block = page, value = 600F)
engine.block.appendChild(parent = scene, child = page)
```

Width and height are separate values rather than a single size object. Repeat these calls to add as many pages as your design needs.

## Set a Background Color

Give the page a solid RGBA background by assigning it a color fill, then set the visible fill color with `setFillSolidColor()`.

```kotlin highlight-android-background
val pageFill = engine.block.createFill(FillType.Color)
engine.block.setFill(block = page, fill = pageFill)
engine.block.setFillSolidColor(
    block = page,
    color = Color.fromRGBA(r = 0.95F, g = 0.95F, b = 0.96F, a = 1F),
)
```

RGBA color components use values from `0` to `1`.

## Add Your First Block

Create a graphic block, assign it a shape and a fill so it has a visual representation, size and position it, then append it to the page. A graphic block needs both a shape and a fill to render.

```kotlin highlight-android-add-block
val block = engine.block.create(DesignBlockType.Graphic)
engine.block.setShape(block = block, shape = engine.block.createShape(ShapeType.Star))
val fill = engine.block.createFill(FillType.Color)
engine.block.setFill(block = block, fill = fill)
engine.block.setFillSolidColor(
    block = block,
    color = Color.fromRGBA(r = 0.27F, g = 0.52F, b = 0.96F, a = 1F),
)
engine.block.setWidth(block = block, value = 300F)
engine.block.setHeight(block = block, value = 300F)
engine.block.setPositionX(block = block, value = 250F)
engine.block.setPositionY(block = block, value = 150F)
engine.block.appendChild(parent = page, child = block)
```

`createShape(type=_)` accepts shapes such as `ShapeType.Star`, `ShapeType.Rect`, and `ShapeType.Ellipse`. `createFill(fillType=_)` accepts fills such as `FillType.Color`, `FillType.Image`, and gradient fill types.

## Enable Auto-Fit Zoom

For interactive editing, enable auto-fit zoom so the page stays framed when the viewport resizes.

```kotlin highlight-android-zoom
engine.scene.enableZoomAutoFit(
    block = page,
    axis = ZoomAutoFitAxis.BOTH,
    paddingLeft = 40F,
    paddingTop = 40F,
    paddingRight = 40F,
    paddingBottom = 40F,
)
```

`enableZoomAutoFit()` continuously adjusts the zoom level to fit a block. Use `ZoomAutoFitAxis.HORIZONTAL` to fit the width, `ZoomAutoFitAxis.VERTICAL` to fit the height, or `ZoomAutoFitAxis.BOTH` to fit both. The padding parameters add space around the content. Only one block per scene can use auto-fit at a time, and it has no effect while the editor UI controls the zoom level. For a one-time adjustment, use `zoomToBlock()`, and call `disableZoomAutoFit()` to stop the continuous fit.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.create(sceneLayout=_)` | Create a new empty scene with a camera |
| `engine.block.create(blockType=_)` | Create a block such as `DesignBlockType.Page` or `DesignBlockType.Graphic` |
| `engine.block.setWidth(block=_, value=_)` / `engine.block.setHeight(block=_, value=_)` | Set a block's dimensions in design units |
| `engine.block.setPositionX(block=_, value=_)` / `engine.block.setPositionY(block=_, value=_)` | Position a block on its parent |
| `engine.block.appendChild(parent=_, child=_)` | Add a block as a child of another block |
| `engine.block.createFill(fillType=_)` / `engine.block.setFill(block=_, fill=_)` | Create and assign a fill |
| `engine.block.setFillSolidColor(block=_, color=_)` | Set the RGBA color value on a solid color fill |
| `engine.block.createShape(type=_)` / `engine.block.setShape(block=_, shape=_)` | Create and assign a shape |
| `engine.scene.enableZoomAutoFit(block=_, axis=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Continuously fit a block in the viewport |
| `engine.scene.zoomToBlock(block=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Frame a block once |
| `engine.scene.disableZoomAutoFit(block=_)` | Stop auto-fit zoom |

## Next Steps

- [Save](../export-save-publish/save.md) — Persist your design to a file or backend service
- [Blocks](../concepts/blocks.md) — Learn about scene hierarchy and block relationships
- [Create From Image](./from-image.md) — Start with an existing image instead of a blank canvas



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support