> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Shapes](../../shapes.md) > [Create Shapes](./create-shapes.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-shapes/CreateShapes.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GradientColorStop
import ly.img.engine.ShapeType

suspend fun createShapes(engine: Engine): DesignBlock {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 300F)
    engine.block.setHeight(page, value = 200F)
    engine.block.appendChild(parent = scene, child = page)

    val testGraphic = engine.block.create(DesignBlockType.Graphic)
    val graphicSupportsShapes = engine.block.supportsShape(testGraphic)

    val testText = engine.block.create(DesignBlockType.Text)
    val textSupportsShapes = engine.block.supportsShape(testText)
    check(graphicSupportsShapes)
    check(!textSupportsShapes)
    engine.block.destroy(testText)
    engine.block.destroy(testGraphic)

    val rectGraphic = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(rectGraphic, shape = rectShape)

    val redFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(rectGraphic, fill = redFill)
    engine.block.setFillSolidColor(
        block = rectGraphic,
        color = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    )

    engine.block.setWidth(rectGraphic, value = 64F)
    engine.block.setHeight(rectGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = rectGraphic)
    engine.block.setPositionX(rectGraphic, value = 10F)
    engine.block.setPositionY(rectGraphic, value = 10F)
    check(engine.block.getShape(rectGraphic) == rectShape)
    check(engine.block.getFill(rectGraphic) == redFill)

    val ellipseGraphic = engine.block.create(DesignBlockType.Graphic)
    val ellipseShape = engine.block.createShape(ShapeType.Ellipse)
    engine.block.setShape(ellipseGraphic, shape = ellipseShape)

    val gradientFill = engine.block.createFill(FillType.LinearGradient)
    engine.block.setGradientColorStops(
        block = gradientFill,
        property = "fill/gradient/colors",
        colorStops = listOf(
            GradientColorStop(
                stop = 0F,
                color = Color.fromRGBA(r = 0.2F, g = 0.6F, b = 0.9F, a = 1F),
            ),
            GradientColorStop(
                stop = 1F,
                color = Color.fromRGBA(r = 0.9F, g = 0.3F, b = 0.6F, a = 1F),
            ),
        ),
    )
    engine.block.setFill(ellipseGraphic, fill = gradientFill)

    engine.block.setWidth(ellipseGraphic, value = 64F)
    engine.block.setHeight(ellipseGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = ellipseGraphic)
    engine.block.setPositionX(ellipseGraphic, value = 82F)
    engine.block.setPositionY(ellipseGraphic, value = 10F)
    check(engine.block.getGradientColorStops(gradientFill, property = "fill/gradient/colors").size == 2)

    val exampleStarShape = engine.block.createShape(ShapeType.Star)
    val starProperties = engine.block.findAllProperties(exampleStarShape)
    check("shape/star/points" in starProperties)
    engine.block.destroy(exampleStarShape)

    val starGraphic = engine.block.create(DesignBlockType.Graphic)
    val starShape = engine.block.createShape(ShapeType.Star)
    engine.block.setShape(starGraphic, shape = starShape)

    val yellowFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(starGraphic, fill = yellowFill)
    engine.block.setFillSolidColor(
        block = starGraphic,
        color = Color.fromRGBA(r = 1F, g = 0.8F, b = 0F, a = 1F),
    )

    engine.block.setWidth(starGraphic, value = 64F)
    engine.block.setHeight(starGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = starGraphic)
    engine.block.setPositionX(starGraphic, value = 154F)
    engine.block.setPositionY(starGraphic, value = 10F)

    engine.block.setInt(starShape, property = "shape/star/points", value = 5)
    engine.block.setFloat(starShape, property = "shape/star/innerDiameter", value = 0.5F)
    check(engine.block.getInt(starShape, property = "shape/star/points") == 5)
    check(engine.block.getFloat(starShape, property = "shape/star/innerDiameter") == 0.5F)

    val polygonGraphic = engine.block.create(DesignBlockType.Graphic)
    val polygonShape = engine.block.createShape(ShapeType.Polygon)
    engine.block.setShape(polygonGraphic, shape = polygonShape)

    val greenFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(polygonGraphic, fill = greenFill)
    engine.block.setFillSolidColor(
        block = polygonGraphic,
        color = Color.fromRGBA(r = 0.2F, g = 0.8F, b = 0.3F, a = 1F),
    )

    engine.block.setWidth(polygonGraphic, value = 64F)
    engine.block.setHeight(polygonGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = polygonGraphic)
    engine.block.setPositionX(polygonGraphic, value = 226F)
    engine.block.setPositionY(polygonGraphic, value = 10F)

    engine.block.setInt(polygonShape, property = "shape/polygon/sides", value = 8)
    check(engine.block.getInt(polygonShape, property = "shape/polygon/sides") == 8)

    val lineGraphic = engine.block.create(DesignBlockType.Graphic)
    val lineShape = engine.block.createShape(ShapeType.Line)
    engine.block.setShape(lineGraphic, shape = lineShape)

    engine.block.setStrokeColor(
        block = lineGraphic,
        color = Color.fromRGBA(r = 0.6F, g = 0.2F, b = 0.9F, a = 1F),
    )

    engine.block.setWidth(lineGraphic, value = 64F)
    // For line shapes, block height controls the visible line thickness.
    engine.block.setHeight(lineGraphic, value = 10F)
    engine.block.appendChild(parent = page, child = lineGraphic)
    engine.block.setPositionX(lineGraphic, value = 10F)
    engine.block.setPositionY(lineGraphic, value = 109F)

    val vectorPathGraphic = engine.block.create(DesignBlockType.Graphic)
    val vectorPathShape = engine.block.createShape(ShapeType.VectorPath)
    engine.block.setShape(vectorPathGraphic, shape = vectorPathShape)

    engine.block.setString(
        block = vectorPathShape,
        property = "shape/vector_path/path",
        value = "M 0,0 L 100,50 L 0,100 Z",
    )

    val orangeFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(vectorPathGraphic, fill = orangeFill)
    engine.block.setFillSolidColor(
        block = vectorPathGraphic,
        color = Color.fromRGBA(r = 1F, g = 0.5F, b = 0F, a = 1F),
    )

    engine.block.setWidth(vectorPathGraphic, value = 64F)
    engine.block.setHeight(vectorPathGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = vectorPathGraphic)
    engine.block.setPositionX(vectorPathGraphic, value = 82F)
    engine.block.setPositionY(vectorPathGraphic, value = 82F)
    check(engine.block.getString(vectorPathShape, property = "shape/vector_path/path").isNotEmpty())

    val roundedRectGraphic = engine.block.create(DesignBlockType.Graphic)
    val roundedRectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(roundedRectGraphic, shape = roundedRectShape)

    engine.block.setFloat(roundedRectShape, property = "shape/rect/cornerRadiusTL", value = 5F)
    engine.block.setFloat(roundedRectShape, property = "shape/rect/cornerRadiusTR", value = 5F)
    engine.block.setFloat(roundedRectShape, property = "shape/rect/cornerRadiusBL", value = 5F)
    engine.block.setFloat(roundedRectShape, property = "shape/rect/cornerRadiusBR", value = 5F)

    val cyanFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(roundedRectGraphic, fill = cyanFill)
    engine.block.setFillSolidColor(
        block = roundedRectGraphic,
        color = Color.fromRGBA(r = 0F, g = 0.8F, b = 0.8F, a = 1F),
    )

    engine.block.setWidth(roundedRectGraphic, value = 64F)
    engine.block.setHeight(roundedRectGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = roundedRectGraphic)
    engine.block.setPositionX(roundedRectGraphic, value = 154F)
    engine.block.setPositionY(roundedRectGraphic, value = 82F)
    check(engine.block.getFloat(roundedRectShape, property = "shape/rect/cornerRadiusTL") == 5F)

    val currentShape = engine.block.getShape(rectGraphic)
    val currentShapeType = ShapeType.get(engine.block.getType(currentShape))
    check(currentShapeType == ShapeType.Rect)

    val oldShape = engine.block.getShape(rectGraphic)
    val newShape = engine.block.createShape(ShapeType.Ellipse)

    engine.block.setShape(rectGraphic, shape = newShape)
    engine.block.destroy(oldShape)
    check(engine.block.getShape(rectGraphic) == newShape)

    engine.scene.zoomToBlock(
        page,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )

    return page
}
```

Create geometric shapes with the Engine API and combine them with fills so
they appear on the design canvas.

![Android Create Shapes scene preview showing rectangles, ellipses, stars, polygons, lines, and vector paths](https://img.ly/docs/cesdk/android/stickers-and-shapes/create-edit/create-shapes-64acc0/assets/android.hero.png)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260906/engine-guides-create-shapes)

<EngineReferenceNote {...props} />

Shapes define the geometry of a graphic block. Closed shapes use fills for their visible content, such as a solid color, gradient, image, or video. Line shapes render as strokes.

The snippets use a sample page named `page` and focus on the shape, fill, and block API calls. Use the complete Kotlin source linked above when you want the runnable scene setup.

## Understanding Shapes and Graphic Blocks

### What Are Shapes?

Shapes are block-like geometry definitions that stay independent until you attach them to a graphic block. Android exposes the built-in shape kinds through `ShapeType`, so you can create shapes with type-safe values such as `ShapeType.Rect` or `ShapeType.Star`.

Shape and fill are independent. You can replace a rectangle with a star while keeping the same fill, or change a fill while preserving the current shape.

### The Graphic Block System

Graphic blocks bring shapes and fills together. A graphic block can hold:

- **Shape**: Rectangle, ellipse, star, polygon, line, or vector path geometry
- **Fill**: Color, gradient, image, or video content that makes closed shapes visible
- **Stroke**: Outline or line rendering, including the color of `ShapeType.Line`
- **Effects**: Optional filters, blur, or shadows applied to the filled shape
- **Transform**: Position, rotation, and scale values on the graphic block

### Available Shape Types

CE.SDK provides six built-in shape types on Android:

- `ShapeType.Rect`: Rectangles with optional independent corner radii
- `ShapeType.Ellipse`: Circles and ovals
- `ShapeType.Star`: Stars with configurable points and inner diameter
- `ShapeType.Polygon`: Regular polygons with a configurable number of sides
- `ShapeType.Line`: Straight lines spanning the block dimensions
- `ShapeType.VectorPath`: Custom shapes from SVG path data

## Checking Shape Support

Before applying a shape, verify that the target block type supports shapes. Graphic blocks support shapes, while text blocks do not.

```kotlin highlight-android-check-shape-support
    val testGraphic = engine.block.create(DesignBlockType.Graphic)
    val graphicSupportsShapes = engine.block.supportsShape(testGraphic)

    val testText = engine.block.create(DesignBlockType.Text)
    val textSupportsShapes = engine.block.supportsShape(testText)
    check(graphicSupportsShapes)
    check(!textSupportsShapes)
    engine.block.destroy(testText)
    engine.block.destroy(testGraphic)
```

Use `supportsShape()` when you work with dynamic selections or unknown block types. It lets you skip unsupported blocks before calling `setShape()`.

## Creating Basic Shapes

### Creating a Rectangle

Create a graphic block, attach a rectangle shape, add a color fill, and append the block to the page.

```kotlin highlight-android-create-rectangle
    val rectGraphic = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(rectGraphic, shape = rectShape)

    val redFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(rectGraphic, fill = redFill)
    engine.block.setFillSolidColor(
        block = rectGraphic,
        color = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    )

    engine.block.setWidth(rectGraphic, value = 64F)
    engine.block.setHeight(rectGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = rectGraphic)
    engine.block.setPositionX(rectGraphic, value = 10F)
    engine.block.setPositionY(rectGraphic, value = 10F)
```

Closed shapes remain invisible until the graphic block has both a shape and a fill. The block width, height, and position control the shape's final canvas bounds.

### Creating Other Shape Types

The creation pattern stays the same across closed shape types: create a graphic block, create the shape, attach the shape, apply a fill, then size and place the block. Line shapes use stroke rendering instead of fill rendering.

Ellipse with a linear gradient fill:

```kotlin highlight-android-create-ellipse
    val ellipseGraphic = engine.block.create(DesignBlockType.Graphic)
    val ellipseShape = engine.block.createShape(ShapeType.Ellipse)
    engine.block.setShape(ellipseGraphic, shape = ellipseShape)

    val gradientFill = engine.block.createFill(FillType.LinearGradient)
    engine.block.setGradientColorStops(
        block = gradientFill,
        property = "fill/gradient/colors",
        colorStops = listOf(
            GradientColorStop(
                stop = 0F,
                color = Color.fromRGBA(r = 0.2F, g = 0.6F, b = 0.9F, a = 1F),
            ),
            GradientColorStop(
                stop = 1F,
                color = Color.fromRGBA(r = 0.9F, g = 0.3F, b = 0.6F, a = 1F),
            ),
        ),
    )
    engine.block.setFill(ellipseGraphic, fill = gradientFill)

    engine.block.setWidth(ellipseGraphic, value = 64F)
    engine.block.setHeight(ellipseGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = ellipseGraphic)
    engine.block.setPositionX(ellipseGraphic, value = 82F)
    engine.block.setPositionY(ellipseGraphic, value = 10F)
```

Star with a color fill:

```kotlin highlight-android-create-star
    val starGraphic = engine.block.create(DesignBlockType.Graphic)
    val starShape = engine.block.createShape(ShapeType.Star)
    engine.block.setShape(starGraphic, shape = starShape)

    val yellowFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(starGraphic, fill = yellowFill)
    engine.block.setFillSolidColor(
        block = starGraphic,
        color = Color.fromRGBA(r = 1F, g = 0.8F, b = 0F, a = 1F),
    )

    engine.block.setWidth(starGraphic, value = 64F)
    engine.block.setHeight(starGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = starGraphic)
    engine.block.setPositionX(starGraphic, value = 154F)
    engine.block.setPositionY(starGraphic, value = 10F)
```

Polygon with a color fill:

```kotlin highlight-android-create-polygon
    val polygonGraphic = engine.block.create(DesignBlockType.Graphic)
    val polygonShape = engine.block.createShape(ShapeType.Polygon)
    engine.block.setShape(polygonGraphic, shape = polygonShape)

    val greenFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(polygonGraphic, fill = greenFill)
    engine.block.setFillSolidColor(
        block = polygonGraphic,
        color = Color.fromRGBA(r = 0.2F, g = 0.8F, b = 0.3F, a = 1F),
    )

    engine.block.setWidth(polygonGraphic, value = 64F)
    engine.block.setHeight(polygonGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = polygonGraphic)
    engine.block.setPositionX(polygonGraphic, value = 226F)
    engine.block.setPositionY(polygonGraphic, value = 10F)
```

Line with a stroke color. For line shapes, block height controls the visible thickness:

```kotlin highlight-android-create-line
    val lineGraphic = engine.block.create(DesignBlockType.Graphic)
    val lineShape = engine.block.createShape(ShapeType.Line)
    engine.block.setShape(lineGraphic, shape = lineShape)

    engine.block.setStrokeColor(
        block = lineGraphic,
        color = Color.fromRGBA(r = 0.6F, g = 0.2F, b = 0.9F, a = 1F),
    )

    engine.block.setWidth(lineGraphic, value = 64F)
    // For line shapes, block height controls the visible line thickness.
    engine.block.setHeight(lineGraphic, value = 10F)
    engine.block.appendChild(parent = page, child = lineGraphic)
    engine.block.setPositionX(lineGraphic, value = 10F)
    engine.block.setPositionY(lineGraphic, value = 109F)
```

Vector path with SVG path data:

```kotlin highlight-android-create-vector-path
    val vectorPathGraphic = engine.block.create(DesignBlockType.Graphic)
    val vectorPathShape = engine.block.createShape(ShapeType.VectorPath)
    engine.block.setShape(vectorPathGraphic, shape = vectorPathShape)

    engine.block.setString(
        block = vectorPathShape,
        property = "shape/vector_path/path",
        value = "M 0,0 L 100,50 L 0,100 Z",
    )

    val orangeFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(vectorPathGraphic, fill = orangeFill)
    engine.block.setFillSolidColor(
        block = vectorPathGraphic,
        color = Color.fromRGBA(r = 1F, g = 0.5F, b = 0F, a = 1F),
    )

    engine.block.setWidth(vectorPathGraphic, value = 64F)
    engine.block.setHeight(vectorPathGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = vectorPathGraphic)
    engine.block.setPositionX(vectorPathGraphic, value = 82F)
    engine.block.setPositionY(vectorPathGraphic, value = 82F)
```

Vector paths use SVG path syntax for a single path. For complex multi-path artwork, use an SVG asset through an image fill instead.

## Configuring Shape Properties

### Discovering Properties

Each shape type has its own properties. Use `findAllProperties()` on a shape block when you need to inspect the available property keys.

```kotlin highlight-android-discover-properties
val exampleStarShape = engine.block.createShape(ShapeType.Star)
val starProperties = engine.block.findAllProperties(exampleStarShape)
check("shape/star/points" in starProperties)
engine.block.destroy(exampleStarShape)
```

### Rectangle Corner Radius

Rectangles support independent corner radius values. Set each corner in design units on the shape block.

```kotlin highlight-android-configure-properties
    val roundedRectGraphic = engine.block.create(DesignBlockType.Graphic)
    val roundedRectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(roundedRectGraphic, shape = roundedRectShape)

    engine.block.setFloat(roundedRectShape, property = "shape/rect/cornerRadiusTL", value = 5F)
    engine.block.setFloat(roundedRectShape, property = "shape/rect/cornerRadiusTR", value = 5F)
    engine.block.setFloat(roundedRectShape, property = "shape/rect/cornerRadiusBL", value = 5F)
    engine.block.setFloat(roundedRectShape, property = "shape/rect/cornerRadiusBR", value = 5F)

    val cyanFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(roundedRectGraphic, fill = cyanFill)
    engine.block.setFillSolidColor(
        block = roundedRectGraphic,
        color = Color.fromRGBA(r = 0F, g = 0.8F, b = 0.8F, a = 1F),
    )

    engine.block.setWidth(roundedRectGraphic, value = 64F)
    engine.block.setHeight(roundedRectGraphic, value = 64F)
    engine.block.appendChild(parent = page, child = roundedRectGraphic)
    engine.block.setPositionX(roundedRectGraphic, value = 154F)
    engine.block.setPositionY(roundedRectGraphic, value = 82F)
```

### Star and Polygon Properties

For stars, set `shape/star/points` and `shape/star/innerDiameter`. For polygons, set `shape/polygon/sides`.

```kotlin highlight-android-configure-star-properties
engine.block.setInt(starShape, property = "shape/star/points", value = 5)
engine.block.setFloat(starShape, property = "shape/star/innerDiameter", value = 0.5F)
```

```kotlin highlight-android-configure-polygon-properties
engine.block.setInt(polygonShape, property = "shape/polygon/sides", value = 8)
```

## Combining Shapes with Fills

Closed shapes define geometry but remain invisible without fills. Fills provide the visible content inside the shape, including solid colors, gradients, images, and videos. Line shapes render through their stroke color instead.

The sample uses color fills for most closed shapes, a gradient fill for the ellipse, and a stroke color for the line. For a complete overview of fill types, see the [Fills](../../fills/overview.md) guide.

## Managing Shapes

### Retrieving Shapes

Use `getShape()` to access the shape currently attached to a graphic block. Read the shape type with `getType()` and map it back to `ShapeType`.

```kotlin highlight-android-retrieve-shape
val currentShape = engine.block.getShape(rectGraphic)
val currentShapeType = ShapeType.get(engine.block.getType(currentShape))
```

### Replacing Shapes

When replacing a shape, apply the new shape and then destroy the old shape. `setShape()` does not destroy the previous shape automatically.

```kotlin highlight-android-replace-shape
    val oldShape = engine.block.getShape(rectGraphic)
    val newShape = engine.block.createShape(ShapeType.Ellipse)

    engine.block.setShape(rectGraphic, shape = newShape)
    engine.block.destroy(oldShape)
```

Destroy any unused shape blocks you create. When you destroy a graphic block, CE.SDK also destroys the shape attached to that block.

## Troubleshooting

If a shape does not appear, check these common causes:

- **Missing fill or stroke**: For closed shapes, call `setFill()` with a color, gradient, image, or video fill after attaching the shape. For line shapes, set a stroke color.
- **Missing shape**: Call `setShape()` before expecting the graphic block to render shape geometry.
- **Zero size**: Set non-zero width and height on the graphic block.
- **Unsupported block**: Guard unknown blocks with `supportsShape()` before calling `setShape()`.
- **Replaced shape still allocated**: Destroy the old shape after a successful replacement.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create a graphic block that can hold a shape and fill. |
| `engine.block.createShape(type=_)` | Create a shape block using a `ShapeType` value. |
| `engine.block.supportsShape(block=_)` | Check whether a block can hold a shape. |
| `engine.block.setShape(block=_, shape=_)` | Attach a shape block to a graphic block. |
| `engine.block.getShape(block=_)` | Get the shape block currently attached to a graphic block. |
| `engine.block.getType(block=_)` | Read a block type key, including shape type keys. |
| `ShapeType.get(key=_)` | Convert a shape type key into a `ShapeType` value. |
| `engine.block.findAllProperties(block=_)` | List available property keys for a shape block. |
| `engine.block.createFill(fillType=_)` | Create a fill block, such as `FillType.Color` or `FillType.LinearGradient`. |
| `engine.block.setFill(block=_, fill=_)` | Attach a fill block to a graphic block. |
| `engine.block.getFill(block=_)` | Get the fill block currently attached to a graphic block. |
| `engine.block.setFillSolidColor(block=_, color=_)` | Set the solid color for the color fill attached to a graphic block. |
| `engine.block.setGradientColorStops(block=_, property="fill/gradient/colors", colorStops=_)` | Set gradient color stops on a gradient fill. |
| `engine.block.getGradientColorStops(block=_, property="fill/gradient/colors")` | Read gradient color stops from a gradient fill. |
| `engine.block.setStrokeColor(block=_, color=_)` | Set the visible color of a line shape or other stroked block. |
| `engine.block.setFloat(block=_, property="shape/rect/cornerRadiusTL", value=_)` | Set the top-left corner radius for a rectangle shape. |
| `engine.block.setFloat(block=_, property="shape/rect/cornerRadiusTR", value=_)` | Set the top-right corner radius for a rectangle shape. |
| `engine.block.setFloat(block=_, property="shape/rect/cornerRadiusBL", value=_)` | Set the bottom-left corner radius for a rectangle shape. |
| `engine.block.setFloat(block=_, property="shape/rect/cornerRadiusBR", value=_)` | Set the bottom-right corner radius for a rectangle shape. |
| `engine.block.setInt(block=_, property="shape/star/points", value=_)` | Set the number of points on a star shape. |
| `engine.block.setFloat(block=_, property="shape/star/innerDiameter", value=_)` | Set the inner diameter ratio for a star shape. |
| `engine.block.setInt(block=_, property="shape/polygon/sides", value=_)` | Set the number of sides on a polygon shape. |
| `engine.block.setString(block=_, property="shape/vector_path/path", value=_)` | Set vector path SVG path data. |
| `engine.block.getString(block=_, property="shape/vector_path/path")` | Read vector path SVG path data. |
| `engine.block.setWidth(block=_, value=_)` | Set the graphic block width. |
| `engine.block.setHeight(block=_, value=_)` | Set the graphic block height. |
| `engine.block.setPositionX(block=_, value=_)` | Set the graphic block x-position. |
| `engine.block.setPositionY(block=_, value=_)` | Set the graphic block y-position. |
| `engine.block.appendChild(parent=_, child=_)` | Add the graphic block to a page or scene hierarchy. |
| `engine.block.destroy(block=_)` | Destroy an unused shape, fill, or block. |

### Related Types

| Type | Values | Description |
| --- | --- | --- |
| `ShapeType` | `Rect`, `Ellipse`, `Star`, `Polygon`, `Line`, `VectorPath` | Type-safe shape identifiers exposed by the Android binding. |
| `FillType` | `Color`, `LinearGradient`, `RadialGradient`, `ConicalGradient`, `Image`, `Video`, `PixelStream` | Fill kinds that can make a shape visible. |
| `GradientColorStop` | `stop`, `color` | Describes one color stop in a gradient fill. |

## Next Steps

- [Edit Shapes](./edit-shapes.md) - Modify shape properties and transforms
- [Combine Shapes](../combine.md) - Use boolean operations for complex shapes
- [Create and Edit Shapes](../../shapes.md) - Explore the shape guide family
- [Color Fills](../../fills/color.md) — Get to know all available fill types and their properties
- [Gradient](../../fills/gradient.md) — Documentation for Gradients
- [Image Fills](../../fills/image.md) — Documentation for Image Fills
- [Fills](../../fills/overview.md) - Add solid colors, gradients, images, or videos inside shapes
- [Create Stickers](./create-stickers.md) — Create stickers in CE.SDK using image fills for icons, logos, emoji, and multi-color graphics



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support