> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Images](../edit-image.md) > [Annotation](./annotation.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-annotation/ImageAnnotation.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.StrokeStyle

data class ImageAnnotationResult(
    val page: DesignBlock,
    val highlight: DesignBlock,
    val callout: DesignBlock,
    val underline: DesignBlock,
    val redaction: DesignBlock,
)

fun imageAnnotation(engine: Engine): ImageAnnotationResult {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)

    val imageArea = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageArea, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(imageArea, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = imageArea,
        color = Color.fromRGBA(r = 0.92F, g = 0.94F, b = 0.96F, a = 1F),
    )
    engine.block.setPositionX(imageArea, value = 40F)
    engine.block.setPositionY(imageArea, value = 40F)
    engine.block.setWidth(imageArea, value = 720F)
    engine.block.setHeight(imageArea, value = 520F)
    engine.block.appendChild(parent = page, child = imageArea)

    val highlight = addRectangleAnnotation(engine = engine, page = page)
    val callout = addCircleAnnotation(engine = engine, page = page)
    val underline = addLineAnnotation(engine = engine, page = page)
    val redaction = addRedactionBox(engine = engine, page = page)
    styleRectangleAnnotationAppearance(engine = engine, rectangle = highlight)

    check(engine.block.isValid(highlight))
    check(engine.block.isValid(callout))
    check(engine.block.isValid(underline))
    check(engine.block.isValid(redaction))
    check(engine.block.getOpacity(highlight) == 0.5F)
    check(engine.block.isStrokeEnabled(callout))

    return ImageAnnotationResult(
        page = page,
        highlight = highlight,
        callout = callout,
        underline = underline,
        redaction = redaction,
    )
}

fun addRectangleAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val highlight = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = highlight, shape = rectShape)

    engine.block.setPositionX(highlight, value = 100F)
    engine.block.setPositionY(highlight, value = 100F)
    engine.block.setWidth(highlight, value = 220F)
    engine.block.setHeight(highlight, value = 90F)

    engine.block.setFill(highlight, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = highlight,
        color = Color.fromRGBA(r = 1F, g = 0.82F, b = 0F, a = 0.4F),
    )

    engine.block.appendChild(parent = page, child = highlight)
    return highlight
}

fun addCircleAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val callout = engine.block.create(DesignBlockType.Graphic)
    val ellipseShape = engine.block.createShape(ShapeType.Ellipse)
    engine.block.setShape(block = callout, shape = ellipseShape)

    engine.block.setPositionX(callout, value = 360F)
    engine.block.setPositionY(callout, value = 155F)
    engine.block.setWidth(callout, value = 120F)
    engine.block.setHeight(callout, value = 120F)

    engine.block.setFillEnabled(block = callout, enabled = false)
    engine.block.setStrokeEnabled(block = callout, enabled = true)
    engine.block.setStrokeColor(
        block = callout,
        color = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    )
    engine.block.setStrokeWidth(block = callout, width = 4F)

    engine.block.appendChild(parent = page, child = callout)
    return callout
}

fun addLineAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val underline = engine.block.create(DesignBlockType.Graphic)
    val lineShape = engine.block.createShape(ShapeType.Line)
    engine.block.setShape(block = underline, shape = lineShape)

    engine.block.setPositionX(underline, value = 85F)
    engine.block.setPositionY(underline, value = 430F)
    engine.block.setWidth(underline, value = 320F)
    val lineThickness = 8F
    engine.block.setHeight(underline, value = lineThickness)

    engine.block.setStrokeEnabled(block = underline, enabled = true)
    engine.block.setStrokeColor(
        block = underline,
        color = Color.fromRGBA(r = 0.05F, g = 0.25F, b = 0.95F, a = 1F),
    )
    engine.block.setStrokeWidth(block = underline, width = lineThickness)

    engine.block.appendChild(parent = page, child = underline)
    return underline
}

fun addRedactionBox(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val redaction = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(redaction, shape = engine.block.createShape(ShapeType.Rect))

    engine.block.setPositionX(redaction, value = 500F)
    engine.block.setPositionY(redaction, value = 360F)
    engine.block.setWidth(redaction, value = 180F)
    engine.block.setHeight(redaction, value = 34F)

    engine.block.setFill(redaction, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = redaction,
        color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F),
    )

    engine.block.appendChild(parent = page, child = redaction)
    return redaction
}

fun styleRectangleAnnotationAppearance(
    engine: Engine,
    rectangle: DesignBlock,
) {
    engine.block.setOpacity(block = rectangle, value = 0.5F)

    val shape = engine.block.getShape(rectangle)
    engine.block.setFloat(shape, property = "shape/rect/cornerRadiusTL", value = 10F)
    engine.block.setFloat(shape, property = "shape/rect/cornerRadiusTR", value = 10F)
    engine.block.setFloat(shape, property = "shape/rect/cornerRadiusBL", value = 10F)
    engine.block.setFloat(shape, property = "shape/rect/cornerRadiusBR", value = 10F)

    engine.block.setStrokeEnabled(block = rectangle, enabled = true)
    engine.block.setStrokeStyle(block = rectangle, style = StrokeStyle.DASHED)
    engine.block.setStrokeWidth(block = rectangle, width = 3F)
    engine.block.setStrokeColor(
        block = rectangle,
        color = Color.fromRGBA(r = 0.9F, g = 0.35F, b = 0F, a = 1F),
    )
}
```

Add rectangles, circles, lines, and redaction boxes on top of images or
designs with shape blocks.

![Shape annotations on Android](https://img.ly/docs/cesdk/android/edit-image/annotation-142604/assets/annotation-android.png)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/engine-guides-annotation)

<EngineReferenceNote {...props} />

Annotations in CE.SDK are graphic blocks with shape geometry. Use them to highlight important areas, circle details, underline content, hide sensitive information, or add visual review marks on top of existing page content.

The examples below append annotations to an existing page. Position and dimensions are set on the graphic block, while rectangle-specific properties such as corner radius are set on the attached shape block.

## Add Rectangle Annotation

Create a graphic block, attach a rectangle shape, position it, and give it a semi-transparent color fill. A transparent fill keeps the underlying image or design visible while drawing attention to a region.

```kotlin highlight-android-rectangle-annotation
fun addRectangleAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val highlight = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = highlight, shape = rectShape)

    engine.block.setPositionX(highlight, value = 100F)
    engine.block.setPositionY(highlight, value = 100F)
    engine.block.setWidth(highlight, value = 220F)
    engine.block.setHeight(highlight, value = 90F)

    engine.block.setFill(highlight, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = highlight,
        color = Color.fromRGBA(r = 1F, g = 0.82F, b = 0F, a = 0.4F),
    )

    engine.block.appendChild(parent = page, child = highlight)
    return highlight
}
```

## Add Circle Annotation

Use an ellipse shape for circles and callouts. Disable the fill and enable a stroke when the annotation should outline an item without covering it.

```kotlin highlight-android-circle-annotation
fun addCircleAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val callout = engine.block.create(DesignBlockType.Graphic)
    val ellipseShape = engine.block.createShape(ShapeType.Ellipse)
    engine.block.setShape(block = callout, shape = ellipseShape)

    engine.block.setPositionX(callout, value = 360F)
    engine.block.setPositionY(callout, value = 155F)
    engine.block.setWidth(callout, value = 120F)
    engine.block.setHeight(callout, value = 120F)

    engine.block.setFillEnabled(block = callout, enabled = false)
    engine.block.setStrokeEnabled(block = callout, enabled = true)
    engine.block.setStrokeColor(
        block = callout,
        color = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    )
    engine.block.setStrokeWidth(block = callout, width = 4F)

    engine.block.appendChild(parent = page, child = callout)
    return callout
}
```

Use equal width and height for a circle. Different values produce an ellipse.

## Add Line Annotation

Use a line shape for underlines, separators, and simple markup strokes. The block width controls the line length.

```kotlin highlight-android-line-annotation
fun addLineAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val underline = engine.block.create(DesignBlockType.Graphic)
    val lineShape = engine.block.createShape(ShapeType.Line)
    engine.block.setShape(block = underline, shape = lineShape)

    engine.block.setPositionX(underline, value = 85F)
    engine.block.setPositionY(underline, value = 430F)
    engine.block.setWidth(underline, value = 320F)
    val lineThickness = 8F
    engine.block.setHeight(underline, value = lineThickness)

    engine.block.setStrokeEnabled(block = underline, enabled = true)
    engine.block.setStrokeColor(
        block = underline,
        color = Color.fromRGBA(r = 0.05F, g = 0.25F, b = 0.95F, a = 1F),
    )
    engine.block.setStrokeWidth(block = underline, width = lineThickness)

    engine.block.appendChild(parent = page, child = underline)
    return underline
}
```

Line shapes use stroke width for the visible thickness. Keep the block height in sync with the stroke width so the line bounds match the rendered stroke.

## Add a Visual Redaction Overlay

To visually cover content in flattened image output, place a solid rectangle over the sensitive area. Use an opaque fill so the covered content is not visible in the final flattened export.

The original block remains underneath the overlay in the editable CE.SDK scene and in layered or reusable outputs. For sensitive content, remove, crop, or replace the source content before sharing an editable scene.

```kotlin highlight-android-redaction-box
fun addRedactionBox(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val redaction = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(redaction, shape = engine.block.createShape(ShapeType.Rect))

    engine.block.setPositionX(redaction, value = 500F)
    engine.block.setPositionY(redaction, value = 360F)
    engine.block.setWidth(redaction, value = 180F)
    engine.block.setHeight(redaction, value = 34F)

    engine.block.setFill(redaction, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = redaction,
        color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F),
    )

    engine.block.appendChild(parent = page, child = redaction)
    return redaction
}
```

## Style Annotation Appearance

Common rectangle styling changes include opacity, rounded corners, and dashed strokes. Apply opacity and stroke settings to the graphic block, then update rectangle-specific corner geometry on the attached shape block.

```kotlin highlight-android-style-appearance
fun styleRectangleAnnotationAppearance(
    engine: Engine,
    rectangle: DesignBlock,
) {
    engine.block.setOpacity(block = rectangle, value = 0.5F)

    val shape = engine.block.getShape(rectangle)
    engine.block.setFloat(shape, property = "shape/rect/cornerRadiusTL", value = 10F)
    engine.block.setFloat(shape, property = "shape/rect/cornerRadiusTR", value = 10F)
    engine.block.setFloat(shape, property = "shape/rect/cornerRadiusBL", value = 10F)
    engine.block.setFloat(shape, property = "shape/rect/cornerRadiusBR", value = 10F)

    engine.block.setStrokeEnabled(block = rectangle, enabled = true)
    engine.block.setStrokeStyle(block = rectangle, style = StrokeStyle.DASHED)
    engine.block.setStrokeWidth(block = rectangle, width = 3F)
    engine.block.setStrokeColor(
        block = rectangle,
        color = Color.fromRGBA(r = 0.9F, g = 0.35F, b = 0F, a = 1F),
    )
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Shape not visible | Check that the block is appended to the page and that fill or stroke is enabled. |
| Shape positioned incorrectly | Verify x and y positions on the graphic block, not the shape block. |
| Stroke not showing | Enable stroke and set a stroke width greater than `0F`. |
| Rounded corners not changing | Set the corner radius properties on the rectangle shape returned by `getShape()`. |
| Shape covers too much content | Lower block opacity or use a stroke-only annotation. |

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.create(blockType=_)` | Create a design block such as a graphic block. |
| `engine.block.createShape(type=_)` | Create a shape block such as `ShapeType.Rect`, `ShapeType.Ellipse`, or `ShapeType.Line`. |
| `engine.block.setShape(block=_, shape=_)` | Attach a shape block to a graphic block. |
| `engine.block.setPositionX(block=_, value=_)` | Set the graphic block's x position. |
| `engine.block.setPositionY(block=_, value=_)` | Set the graphic block's y position. |
| `engine.block.setWidth(block=_, value=_)` | Set the graphic block's width. |
| `engine.block.setHeight(block=_, value=_)` | Set the graphic block's height. |
| `engine.block.createFill(fillType=_)` | Create a fill block such as `FillType.Color`. |
| `engine.block.setFill(block=_, fill=_)` | Assign a fill to a graphic block. |
| `engine.block.setFillSolidColor(block=_, color=_)` | Set the solid color of a graphic block's fill. |
| `engine.block.setFillEnabled(block=_, enabled=_)` | Enable or disable the graphic block's fill. |
| `engine.block.setStrokeEnabled(block=_, enabled=_)` | Enable or disable the graphic block's stroke. |
| `engine.block.setStrokeColor(block=_, color=_)` | Set the graphic block's stroke color. |
| `engine.block.setStrokeWidth(block=_, width=_)` | Set the graphic block's stroke width. |
| `engine.block.setStrokeStyle(block=_, style=_)` | Set a stroke style such as `StrokeStyle.DASHED`. |
| `engine.block.setOpacity(block=_, value=_)` | Set block opacity from `0F` to `1F`. |
| `engine.block.getShape(block=_)` | Get the shape block attached to a graphic block. |
| `engine.block.setFloat(block=_, property="shape/rect/cornerRadiusTL", value=_)` | Set float shape properties such as rectangle corner radius. |
| `Color.fromRGBA(r=_, g=_, b=_, a=_)` | Create a normalized RGBA color. |
| `engine.block.appendChild(parent=_, child=_)` | Add the annotation block to a page or container. |

## Next Steps

- [Transform Images](./transform.md) - Crop, resize, rotate, scale, or flip image content.
- [Edit Shapes](../stickers-and-shapes/create-edit/edit-shapes.md) - Modify shape geometry, color, size, position, and corner radius.
- [Grouping](../create-composition/group-and-ungroup.md) - Group multiple annotations together.
- [Layer Management](../create-composition/layer-management.md) - Control annotation stacking order.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support