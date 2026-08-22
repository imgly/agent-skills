> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Shapes](../../shapes.md) > [Edit Shapes](./edit-shapes.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-edit-shapes/EditShapes.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.RGBAColor
import ly.img.engine.ShapeType
import kotlin.math.PI
import kotlin.math.abs

suspend fun editShapes(engine: Engine): EditShapesResult {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val graphic = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(graphic, shape = rectShape)

    val initialFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(graphic, fill = initialFill)
    engine.block.setColor(
        block = initialFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.93F, g = 0.94F, b = 0.96F, a = 1F),
    )

    engine.block.setWidth(graphic, value = 240F)
    engine.block.setHeight(graphic, value = 160F)
    engine.block.setPositionX(graphic, value = 80F)
    engine.block.setPositionY(graphic, value = 80F)
    engine.block.appendChild(parent = page, child = graphic)

    val supportsGraphicShape = engine.block.supportsShape(block = graphic)
    val text = engine.block.create(DesignBlockType.Text)
    val supportsTextShape = engine.block.supportsShape(block = text)

    val currentShape = engine.block.getShape(block = graphic)
    val initialShapeType = engine.block.getType(block = currentShape)
    check(supportsGraphicShape)
    check(!supportsTextShape)
    check(initialShapeType == ShapeType.Rect.key)
    engine.block.destroy(text)

    engine.block.setFloat(block = currentShape, property = "shape/rect/cornerRadiusTL", value = 24F)
    engine.block.setFloat(block = currentShape, property = "shape/rect/cornerRadiusTR", value = 24F)
    engine.block.setFloat(block = currentShape, property = "shape/rect/cornerRadiusBR", value = 24F)
    engine.block.setFloat(block = currentShape, property = "shape/rect/cornerRadiusBL", value = 24F)
    val cornerRadiusTopLeft = engine.block.getFloat(block = currentShape, property = "shape/rect/cornerRadiusTL")
    check(abs(cornerRadiusTopLeft - 24F) < 0.001F)

    val starShape = engine.block.createShape(type = ShapeType.Star)
    engine.block.setShape(block = graphic, shape = starShape)
    engine.block.destroy(block = currentShape)

    val replacementShapeType = engine.block.getType(block = engine.block.getShape(block = graphic))
    check(replacementShapeType == ShapeType.Star.key)

    val starProperties = engine.block.findAllProperties(block = starShape)
    engine.block.setInt(block = starShape, property = "shape/star/points", value = 6)
    engine.block.setFloat(block = starShape, property = "shape/star/innerDiameter", value = 0.45F)
    val starPoints = engine.block.getInt(block = starShape, property = "shape/star/points")
    val starInnerDiameter = engine.block.getFloat(block = starShape, property = "shape/star/innerDiameter")
    check("shape/star/points" in starProperties)
    check(starPoints == 6)
    check(abs(starInnerDiameter - 0.45F) < 0.001F)

    val fill = engine.block.getFill(block = graphic)
    val fillColor = Color.fromRGBA(r = 0.1F, g = 0.46F, b = 0.85F, a = 1F)
    engine.block.setColor(block = fill, property = "fill/color/value", value = fillColor)
    val appliedFillColor = engine.block.getColor(block = fill, property = "fill/color/value") as RGBAColor
    check(appliedFillColor == fillColor)

    engine.block.setPositionX(block = graphic, value = 160F)
    engine.block.setPositionY(block = graphic, value = 120F)
    engine.block.setWidth(block = graphic, value = 320F)
    engine.block.setHeight(block = graphic, value = 220F)
    val positionX = engine.block.getPositionX(block = graphic)
    val positionY = engine.block.getPositionY(block = graphic)
    val width = engine.block.getWidth(block = graphic)
    val height = engine.block.getHeight(block = graphic)

    val rotationRadians = (15F * PI / 180F).toFloat()
    engine.block.setRotation(block = graphic, radians = rotationRadians)
    val rotation = engine.block.getRotation(block = graphic)
    check(abs(positionX - 160F) < 0.001F)
    check(abs(positionY - 120F) < 0.001F)
    check(abs(width - 320F) < 0.001F)
    check(abs(height - 220F) < 0.001F)
    check(abs(rotation - rotationRadians) < 0.001F)

    val previewPngData = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = ExportOptions(targetWidth = 640F, targetHeight = 480F),
    )
    check(previewPngData.hasRemaining()) { "edit shapes preview export is empty" }

    return EditShapesResult(
        supportsGraphicShape = supportsGraphicShape,
        supportsTextShape = supportsTextShape,
        initialShapeType = initialShapeType,
        cornerRadiusTopLeft = cornerRadiusTopLeft,
        replacementShapeType = replacementShapeType,
        starProperties = starProperties,
        starPoints = starPoints,
        starInnerDiameter = starInnerDiameter,
        fillColor = appliedFillColor,
        positionX = positionX,
        positionY = positionY,
        width = width,
        height = height,
        rotation = rotation,
        previewPngData = previewPngData,
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-edit-shapes/EditShapesResult.kt reference-only
import ly.img.engine.RGBAColor
import java.nio.ByteBuffer

data class EditShapesResult(
    val supportsGraphicShape: Boolean,
    val supportsTextShape: Boolean,
    val initialShapeType: String,
    val cornerRadiusTopLeft: Float,
    val replacementShapeType: String,
    val starProperties: List<String>,
    val starPoints: Int,
    val starInnerDiameter: Float,
    val fillColor: RGBAColor,
    val positionX: Float,
    val positionY: Float,
    val width: Float,
    val height: Float,
    val rotation: Float,
    val previewPngData: ByteBuffer,
)
```

Edit graphic block shapes by replacing their geometry, changing shape-specific
properties, updating fills, and transforming the block.

![Edited star shape preview](https://img.ly/docs/cesdk/android/stickers-and-shapes/create-edit/edit-shapes-d67cfb/assets/edit-shapes-android.png)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260822/engine-guides-edit-shapes)

<EngineReferenceNote {...props} />

The snippets use an existing `graphic` block with a rectangle shape and color fill. Shape APIs operate on the shape block attached to the graphic block, while size, position, rotation, and fills remain properties of the graphic block itself.

## Accessing Shapes

Check whether a block supports shape editing before reading or replacing its shape. Graphic blocks support shapes, while blocks such as text do not.

```kotlin highlight-android-access-shapes
    val supportsGraphicShape = engine.block.supportsShape(block = graphic)
    val text = engine.block.create(DesignBlockType.Text)
    val supportsTextShape = engine.block.supportsShape(block = text)

    val currentShape = engine.block.getShape(block = graphic)
    val initialShapeType = engine.block.getType(block = currentShape)
```

Use the returned shape handle with normal block APIs such as `getType()` and `findAllProperties()`.

## Editing Shape Geometry

Rectangle corner radius is stored on the attached rectangle shape. Set each corner explicitly when you need rounded corners.

```kotlin highlight-android-rounded-corners
engine.block.setFloat(block = currentShape, property = "shape/rect/cornerRadiusTL", value = 24F)
engine.block.setFloat(block = currentShape, property = "shape/rect/cornerRadiusTR", value = 24F)
engine.block.setFloat(block = currentShape, property = "shape/rect/cornerRadiusBR", value = 24F)
engine.block.setFloat(block = currentShape, property = "shape/rect/cornerRadiusBL", value = 24F)
```

To replace the geometry, create another shape type and assign it with `setShape()`. The previous shape is not destroyed automatically after replacement, so destroy it when you no longer need it.

```kotlin highlight-android-replace-shape
    val starShape = engine.block.createShape(type = ShapeType.Star)
    engine.block.setShape(block = graphic, shape = starShape)
    engine.block.destroy(block = currentShape)

    val replacementShapeType = engine.block.getType(block = engine.block.getShape(block = graphic))
```

## Editing Shape Properties

Different shape types expose different property keys. Use `findAllProperties()` to discover the available keys, then use the setter that matches the property type.

```kotlin highlight-android-shape-properties
val starProperties = engine.block.findAllProperties(block = starShape)
engine.block.setInt(block = starShape, property = "shape/star/points", value = 6)
engine.block.setFloat(block = starShape, property = "shape/star/innerDiameter", value = 0.45F)
```

For example, star shapes expose `shape/star/points` and `shape/star/innerDiameter`, while rectangle shapes expose one corner-radius property per corner.

## Editing Fill Color

Shape color comes from the graphic block's fill. Read the fill block, then set the `fill/color/value` color property.

```kotlin highlight-android-fill-color
val fill = engine.block.getFill(block = graphic)
val fillColor = Color.fromRGBA(r = 0.1F, g = 0.46F, b = 0.85F, a = 1F)
engine.block.setColor(block = fill, property = "fill/color/value", value = fillColor)
```

Use normalized RGBA components from `0F` to `1F` when creating colors with `Color.fromRGBA()`.

## Moving and Resizing Shapes

Move, resize, and rotate the graphic block rather than the attached shape block. Position and dimensions use design units; rotation uses radians.

```kotlin highlight-android-transform-shape
    engine.block.setPositionX(block = graphic, value = 160F)
    engine.block.setPositionY(block = graphic, value = 120F)
    engine.block.setWidth(block = graphic, value = 320F)
    engine.block.setHeight(block = graphic, value = 220F)
    val positionX = engine.block.getPositionX(block = graphic)
    val positionY = engine.block.getPositionY(block = graphic)
    val width = engine.block.getWidth(block = graphic)
    val height = engine.block.getHeight(block = graphic)

    val rotationRadians = (15F * PI / 180F).toFloat()
    engine.block.setRotation(block = graphic, radians = rotationRadians)
```

## Troubleshooting

### Shape Not Changing

- Verify `supportsShape()` returns `true` for the block you are editing.
- Call `setShape()` on the graphic block, not on the shape block.
- Destroy the previous shape only after the new shape is assigned if you do not need to reuse it.

### Property Update Not Applying

- Use `findAllProperties()` on the current shape block to confirm the property key exists.
- Match the setter to the property type, for example `setInt()` for `shape/star/points` and `setFloat()` for corner radius values.
- Remember that shape-specific properties change when you replace one shape type with another.

### Fill or Transform Looks Wrong

- Update `fill/color/value` on the fill block returned by `getFill()`.
- Apply size, position, and rotation to the graphic block.
- Make sure the graphic block is attached to a page before relying on rendered output.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.create(blockType=_)` | Create a design block such as a graphic or text block |
| `engine.block.supportsShape(block=_)` | Check whether a block has an editable shape |
| `engine.block.getShape(block=_)` | Get the shape block attached to a graphic block |
| `engine.block.getType(block=_)` | Read the type key of a block or shape block |
| `engine.block.findAllProperties(block=_)` | List the property keys exposed by a block or shape |
| `engine.block.createShape(type=_)` | Create a shape block such as `ShapeType.Rect` or `ShapeType.Star` |
| `engine.block.setShape(block=_, shape=_)` | Attach a shape block to a graphic block |
| `engine.block.destroy(block=_)` | Destroy an unused block or detached shape |
| `engine.block.setFloat(block=_, property="shape/rect/cornerRadiusTL", value=_)` | Set float shape properties such as rectangle corner radius |
| `engine.block.getFloat(block=_, property="shape/rect/cornerRadiusTL")` | Read float shape properties |
| `engine.block.setInt(block=_, property="shape/star/points", value=_)` | Set integer shape properties |
| `engine.block.getInt(block=_, property="shape/star/points")` | Read integer shape properties |
| `engine.block.getFill(block=_)` | Get the fill block attached to a graphic block |
| `Color.fromRGBA(r=_, g=_, b=_, a=_)` | Create an RGBA color from normalized channel values |
| `engine.block.setColor(block=_, property="fill/color/value", value=_)` | Set the color value on a color fill |
| `engine.block.getColor(block=_, property="fill/color/value")` | Read the color value from a color fill |
| `engine.block.setPositionX(block=_, value=_)` | Set the graphic block's x position |
| `engine.block.getPositionX(block=_)` | Read the graphic block's x position |
| `engine.block.setPositionY(block=_, value=_)` | Set the graphic block's y position |
| `engine.block.getPositionY(block=_)` | Read the graphic block's y position |
| `engine.block.setWidth(block=_, value=_)` | Set the graphic block's width |
| `engine.block.getWidth(block=_)` | Read the graphic block's width |
| `engine.block.setHeight(block=_, value=_)` | Set the graphic block's height |
| `engine.block.getHeight(block=_)` | Read the graphic block's height |
| `engine.block.setRotation(block=_, radians=_)` | Rotate the graphic block around its center |
| `engine.block.getRotation(block=_)` | Read the graphic block's rotation |

## Next Steps

- [Create Shapes](./create-shapes.md) — Create and configure geometric shapes programmatically.
- [Edit Stickers](./edit-stickers.md) — Edit existing sticker blocks by changing their image fill and transforms.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support