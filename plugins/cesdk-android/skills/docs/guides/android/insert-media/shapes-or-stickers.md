> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Insert Media Assets](../insert-media.md) > [Insert Shapes or Stickers](./shapes-or-stickers.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-insert-media-shapes-or-stickers/InsertMediaShapesOrStickers.kt reference-only
import android.net.Uri
import android.util.Log
import ly.img.editor.defaultBaseUri
import ly.img.engine.AssetDefinition
import ly.img.engine.Color
import ly.img.engine.ContentFillMode
import ly.img.engine.DefaultAssetSource
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.populateAssetSource

private const val TAG = "ShapesOrStickers"
private const val GUIDE_STICKER_SOURCE_ID = "ly.img.guide.sticker"

suspend fun insertMediaShapesOrStickers(engine: Engine): InsertMediaShapesOrStickersResult {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val stickerAssetsBaseUri: Uri = defaultBaseUri

    val graphicBlock = engine.block.create(DesignBlockType.Graphic)
    val graphicSupportsShape = engine.block.supportsShape(graphicBlock)
    Log.i(TAG, "Graphic block supports shapes: $graphicSupportsShape")

    val textBlock = engine.block.create(DesignBlockType.Text)
    val textSupportsShape = engine.block.supportsShape(textBlock)
    Log.i(TAG, "Text block supports shapes: $textSupportsShape")

    engine.block.destroy(textBlock)
    engine.block.destroy(graphicBlock)

    val rectBlock = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = rectBlock, shape = rectShape)

    val rectFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = rectFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.2F, g = 0.5F, b = 0.9F, a = 1F),
    )
    engine.block.setFill(block = rectBlock, fill = rectFill)

    engine.block.setWidth(rectBlock, value = 160F)
    engine.block.setHeight(rectBlock, value = 140F)
    engine.block.appendChild(parent = page, child = rectBlock)

    val roundedBlock = engine.block.create(DesignBlockType.Graphic)
    val roundedShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = roundedBlock, shape = roundedShape)

    engine.block.setFloat(roundedShape, property = "shape/rect/cornerRadiusTL", value = 20F)
    engine.block.setFloat(roundedShape, property = "shape/rect/cornerRadiusTR", value = 20F)
    engine.block.setFloat(roundedShape, property = "shape/rect/cornerRadiusBL", value = 20F)
    engine.block.setFloat(roundedShape, property = "shape/rect/cornerRadiusBR", value = 20F)

    val roundedFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = roundedFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.9F, g = 0.4F, b = 0.2F, a = 1F),
    )
    engine.block.setFill(block = roundedBlock, fill = roundedFill)

    engine.block.setWidth(roundedBlock, value = 160F)
    engine.block.setHeight(roundedBlock, value = 140F)
    engine.block.appendChild(parent = page, child = roundedBlock)

    val ellipseBlock = engine.block.create(DesignBlockType.Graphic)
    val ellipseShape = engine.block.createShape(ShapeType.Ellipse)
    engine.block.setShape(block = ellipseBlock, shape = ellipseShape)

    val ellipseFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = ellipseFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.3F, g = 0.8F, b = 0.4F, a = 1F),
    )
    engine.block.setFill(block = ellipseBlock, fill = ellipseFill)

    engine.block.setWidth(ellipseBlock, value = 160F)
    engine.block.setHeight(ellipseBlock, value = 140F)
    engine.block.appendChild(parent = page, child = ellipseBlock)

    val starBlock = engine.block.create(DesignBlockType.Graphic)
    val starShape = engine.block.createShape(ShapeType.Star)
    engine.block.setShape(block = starBlock, shape = starShape)

    engine.block.setInt(starShape, property = "shape/star/points", value = 5)
    engine.block.setFloat(starShape, property = "shape/star/innerDiameter", value = 0.4F)

    val starFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = starFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 1F, g = 0.8F, b = 0F, a = 1F),
    )
    engine.block.setFill(block = starBlock, fill = starFill)

    engine.block.setWidth(starBlock, value = 160F)
    engine.block.setHeight(starBlock, value = 140F)
    engine.block.appendChild(parent = page, child = starBlock)

    val polygonBlock = engine.block.create(DesignBlockType.Graphic)
    val polygonShape = engine.block.createShape(ShapeType.Polygon)
    engine.block.setShape(block = polygonBlock, shape = polygonShape)

    engine.block.setInt(polygonShape, property = "shape/polygon/sides", value = 6)

    val polygonFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = polygonFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.6F, g = 0.2F, b = 0.8F, a = 1F),
    )
    engine.block.setFill(block = polygonBlock, fill = polygonFill)

    engine.block.setWidth(polygonBlock, value = 160F)
    engine.block.setHeight(polygonBlock, value = 140F)
    engine.block.appendChild(parent = page, child = polygonBlock)

    val lineBlock = engine.block.create(DesignBlockType.Graphic)
    val lineShape = engine.block.createShape(ShapeType.Line)
    engine.block.setShape(block = lineBlock, shape = lineShape)

    engine.block.setStrokeEnabled(lineBlock, enabled = true)
    engine.block.setStrokeWidth(lineBlock, width = 6F)
    engine.block.setStrokeColor(
        block = lineBlock,
        color = Color.fromRGBA(r = 0.9F, g = 0.2F, b = 0.5F, a = 1F),
    )

    engine.block.setWidth(lineBlock, value = 160F)
    // Line shapes use block height as the visible stroke thickness.
    engine.block.setHeight(lineBlock, value = 6F)
    engine.block.appendChild(parent = page, child = lineBlock)

    val vectorPathBlock = engine.block.create(DesignBlockType.Graphic)
    val vectorPathShape = engine.block.createShape(ShapeType.VectorPath)
    engine.block.setShape(block = vectorPathBlock, shape = vectorPathShape)

    val trianglePath = "M 50,0 L 100,100 L 0,100 Z"
    engine.block.setString(
        block = vectorPathShape,
        property = "shape/vector_path/path",
        value = trianglePath,
    )

    val vectorPathFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = vectorPathFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.2F, g = 0.7F, b = 0.7F, a = 1F),
    )
    engine.block.setFill(block = vectorPathBlock, fill = vectorPathFill)

    engine.block.setWidth(vectorPathBlock, value = 160F)
    engine.block.setHeight(vectorPathBlock, value = 140F)
    engine.block.appendChild(parent = page, child = vectorPathBlock)

    val starProperties = engine.block.findAllProperties(starShape)
    Log.i(TAG, "Star shape properties: $starProperties")

    val stickerBlock = engine.block.create(DesignBlockType.Graphic)
    val stickerShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = stickerBlock, shape = stickerShape)

    val stickerFill = engine.block.createFill(FillType.Image)
    val stickerUri = stickerAssetsBaseUri.buildUpon()
        .appendPath(DefaultAssetSource.STICKER.key)
        .appendPath("images")
        .appendPath("emoji")
        .appendPath("emoji_happyface.svg")
        .build()
    engine.block.setUri(
        block = stickerFill,
        property = "fill/image/imageFileURI",
        value = stickerUri,
    )
    engine.block.setFill(block = stickerBlock, fill = stickerFill)

    if (engine.block.supportsContentFillMode(stickerBlock)) {
        engine.block.setContentFillMode(stickerBlock, mode = ContentFillMode.CONTAIN)
    }
    engine.block.setKind(stickerBlock, kind = "sticker")

    engine.block.setWidth(stickerBlock, value = 160F)
    engine.block.setHeight(stickerBlock, value = 140F)
    engine.block.appendChild(parent = page, child = stickerBlock)

    val stickerSourceId = DefaultAssetSource.STICKER.key
    if (stickerSourceId !in engine.asset.findAllSources()) {
        engine.populateAssetSource(
            id = stickerSourceId,
            jsonUri = stickerAssetsBaseUri.buildUpon()
                .appendPath(stickerSourceId)
                .appendPath("content.json")
                .build(),
            replaceBaseUri = stickerAssetsBaseUri,
        )
    }

    var stickerResults = findStickerAssets(engine = engine, sourceId = stickerSourceId)
    var stickerAssetSourceId = stickerSourceId
    if (stickerResults.assets.isEmpty()) {
        try {
            engine.populateAssetSource(
                id = stickerSourceId,
                jsonUri = stickerAssetsBaseUri.buildUpon()
                    .appendPath(stickerSourceId)
                    .appendPath("content.json")
                    .build(),
                replaceBaseUri = stickerAssetsBaseUri,
            )
        } catch (error: Exception) {
            Log.w(TAG, "Could not populate sticker source $stickerSourceId.", error)
        }
        stickerResults = findStickerAssets(engine = engine, sourceId = stickerSourceId)
    }
    if (stickerResults.assets.isEmpty()) {
        stickerAssetSourceId = GUIDE_STICKER_SOURCE_ID
        ensureGuideStickerAssetSource(engine = engine, stickerUri = stickerUri)
        stickerResults = findStickerAssets(engine = engine, sourceId = stickerAssetSourceId)
    }
    Log.i(TAG, "Stickers in emoji category: ${stickerResults.total}")

    val stickerAsset = checkNotNull(stickerResults.assets.firstOrNull()) {
        "No sticker assets found."
    }
    val stickerFromLibrary = checkNotNull(
        engine.asset.applyAssetSourceAsset(sourceId = stickerAssetSourceId, asset = stickerAsset),
    ) {
        "The sticker asset source did not create a block."
    }

    if (engine.block.supportsContentFillMode(stickerFromLibrary)) {
        engine.block.setContentFillMode(stickerFromLibrary, mode = ContentFillMode.CONTAIN)
    }
    engine.block.setWidth(stickerFromLibrary, value = 160F)
    engine.block.setHeight(stickerFromLibrary, value = 140F)

    val shapeBlocks = listOf(
        rectBlock,
        roundedBlock,
        ellipseBlock,
        starBlock,
        polygonBlock,
        lineBlock,
        vectorPathBlock,
    )
    val stickerBlocks = listOf(stickerBlock, stickerFromLibrary)
    val gridBlocks = shapeBlocks + stickerBlocks

    gridBlocks.forEachIndexed { index, block ->
        val column = index % 3
        val row = index / 3
        engine.block.setPositionX(block, value = 130F + column * 190F)
        engine.block.setPositionY(block, value = 60F + row * 170F)
    }

    engine.block.forceLoadResources(blocks = listOf(page) + gridBlocks)
    val pngData = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = ExportOptions(targetWidth = 800F, targetHeight = 600F),
    )
    check(pngData.hasRemaining()) { "shapes and stickers PNG export is empty" }

    return InsertMediaShapesOrStickersResult(
        graphicSupportsShape = graphicSupportsShape,
        textSupportsShape = textSupportsShape,
        starPoints = engine.block.getInt(starShape, property = "shape/star/points"),
        starInnerDiameter = engine.block.getFloat(starShape, property = "shape/star/innerDiameter"),
        polygonSides = engine.block.getInt(polygonShape, property = "shape/polygon/sides"),
        vectorPath = engine.block.getString(vectorPathShape, property = "shape/vector_path/path"),
        starPropertyCount = starProperties.size,
        stickerResultCount = stickerResults.total,
        stickerBlockCount = stickerBlocks.size,
        pngData = pngData.asReadOnlyBuffer(),
    )
}

private suspend fun findStickerAssets(
    engine: Engine,
    sourceId: String,
) = engine.asset.findAssets(
    sourceId = sourceId,
    query = FindAssetsQuery(
        query = null,
        page = 0,
        groups = listOf("emoji"),
        perPage = 5,
    ),
)

private suspend fun ensureGuideStickerAssetSource(
    engine: Engine,
    stickerUri: Uri,
) {
    if (GUIDE_STICKER_SOURCE_ID !in engine.asset.findAllSources()) {
        engine.asset.addLocalSource(
            sourceId = GUIDE_STICKER_SOURCE_ID,
            supportedMimeTypes = listOf("image/svg+xml"),
        )
    }
    if (findStickerAssets(engine = engine, sourceId = GUIDE_STICKER_SOURCE_ID).assets.isNotEmpty()) {
        return
    }
    engine.asset.addAsset(
        sourceId = GUIDE_STICKER_SOURCE_ID,
        asset = AssetDefinition(
            id = "guide-emoji-happyface",
            label = mapOf("en" to "Happy Face"),
            tags = mapOf("en" to listOf("emoji", "happy", "face")),
            groups = listOf("emoji"),
            meta = mapOf(
                "uri" to stickerUri.toString(),
                "thumbUri" to stickerUri.toString(),
                "mimeType" to "image/svg+xml",
                "kind" to "sticker",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "512",
                "height" to "512",
            ),
        ),
    )
    engine.asset.assetSourceContentsChanged(sourceId = GUIDE_STICKER_SOURCE_ID)
}
```

```kotlin file=@cesdk_android_examples/engine-guides-insert-media-shapes-or-stickers/InsertMediaShapesOrStickersResult.kt reference-only
import java.nio.ByteBuffer

data class InsertMediaShapesOrStickersResult(
    val graphicSupportsShape: Boolean,
    val textSupportsShape: Boolean,
    val starPoints: Int,
    val starInnerDiameter: Float,
    val polygonSides: Int,
    val vectorPath: String,
    val starPropertyCount: Int,
    val stickerResultCount: Int,
    val stickerBlockCount: Int,
    val pngData: ByteBuffer,
)
```

Add vector shapes and sticker assets to a CE.SDK scene on Android. Use the
Engine API to create shape blocks, style them with fills or strokes, and
materialize stickers from an asset source.

![A grid of rectangles, rounded rectangles, ellipses, stars, polygons, lines, vector paths, and sticker graphics.](https://img.ly/docs/cesdk/android/insert-media/shapes-or-stickers-20ac68/assets/android.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260906/engine-guides-insert-media-shapes-or-stickers)

<EngineReferenceNote {...props} />

Shapes are vector graphics created with `engine.block.createShape()` and attached to graphic blocks. CE.SDK supports six Android shape types: `ShapeType.Rect`, `ShapeType.Ellipse`, `ShapeType.Star`, `ShapeType.Polygon`, `ShapeType.Line`, and `ShapeType.VectorPath`. Stickers are graphic blocks that usually use an image fill and the `sticker` block kind.

> **Note:** For a complete editing surface that exposes shapes and stickers through the asset library, see the [Design Editor Starter Kit](../starterkits/design-editor.md). This guide focuses on inserting the same kinds of content with the Android Engine API.For focused deep dives, see [Create Shapes](../stickers-and-shapes/create-edit/create-shapes.md) and [Create Stickers](../stickers-and-shapes/create-edit/create-stickers.md).

This guide covers creating each shape type, configuring shape-specific properties, applying fills, inserting stickers by hand, and querying stickers from the asset library.

## Using the Built-in UI

### Shapes Panel

The CE.SDK editor UI can expose shape entries through the asset library when your Android editor configuration includes a shape source such as `ly.img.vector.shape`. Users can place a shape on the canvas from the panel, then resize, rotate, position, and style the resulting block with the editor controls.

### Stickers Panel

Sticker entries appear in the asset library under their configured categories when your Android editor configuration includes a sticker source such as `ly.img.sticker`. Users can browse the available stickers and add them to the canvas from the panel. Inserted stickers keep their graphic-block behavior, so users can resize, rotate, align, and style them like other design elements.

## Programmatic Shape Creation

### Prepare the Page and Asset Base URI

The snippets below create a scene page for the inserted blocks and resolve sticker assets from a base URI. Use the asset base URI configured for your editor, or replace it with a self-hosted asset bundle URI that contains the `ly.img.sticker` source.

```kotlin highlight-android-setup
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val stickerAssetsBaseUri: Uri = defaultBaseUri
```

### Check Shape Support

Before attaching a shape to a block, confirm the block supports shapes with `supportsShape()`. Graphic blocks return `true`; text blocks return `false`.

```kotlin highlight-android-check-shape-support
    val graphicBlock = engine.block.create(DesignBlockType.Graphic)
    val graphicSupportsShape = engine.block.supportsShape(graphicBlock)
    Log.i(TAG, "Graphic block supports shapes: $graphicSupportsShape")

    val textBlock = engine.block.create(DesignBlockType.Text)
    val textSupportsShape = engine.block.supportsShape(textBlock)
    Log.i(TAG, "Text block supports shapes: $textSupportsShape")

    engine.block.destroy(textBlock)
    engine.block.destroy(graphicBlock)
```

### Create Rectangle

Create rectangles with `createShape(ShapeType.Rect)` and attach them to a graphic block with `setShape()`. Apply a color fill to make the shape visible.

```kotlin highlight-android-create-rectangle
    val rectBlock = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = rectBlock, shape = rectShape)

    val rectFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = rectFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.2F, g = 0.5F, b = 0.9F, a = 1F),
    )
    engine.block.setFill(block = rectBlock, fill = rectFill)

    engine.block.setWidth(rectBlock, value = 160F)
    engine.block.setHeight(rectBlock, value = 140F)
    engine.block.appendChild(parent = page, child = rectBlock)
```

A graphic block needs both a shape and a fill before it renders as a visible filled shape.

### Create Rounded Rectangle

Rectangles support per-corner radii. Set each corner individually with `setFloat()` using `shape/rect/cornerRadiusTL`, `shape/rect/cornerRadiusTR`, `shape/rect/cornerRadiusBL`, and `shape/rect/cornerRadiusBR`.

```kotlin highlight-android-create-rounded-rectangle
    val roundedBlock = engine.block.create(DesignBlockType.Graphic)
    val roundedShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = roundedBlock, shape = roundedShape)

    engine.block.setFloat(roundedShape, property = "shape/rect/cornerRadiusTL", value = 20F)
    engine.block.setFloat(roundedShape, property = "shape/rect/cornerRadiusTR", value = 20F)
    engine.block.setFloat(roundedShape, property = "shape/rect/cornerRadiusBL", value = 20F)
    engine.block.setFloat(roundedShape, property = "shape/rect/cornerRadiusBR", value = 20F)

    val roundedFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = roundedFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.9F, g = 0.4F, b = 0.2F, a = 1F),
    )
    engine.block.setFill(block = roundedBlock, fill = roundedFill)

    engine.block.setWidth(roundedBlock, value = 160F)
    engine.block.setHeight(roundedBlock, value = 140F)
    engine.block.appendChild(parent = page, child = roundedBlock)
```

Use the same value for every corner to create a uniformly rounded rectangle, or use different values for asymmetric rounding.

### Create Ellipse

Create circles and ovals with `createShape(ShapeType.Ellipse)`. The block's width and height determine the rendered shape: equal values render a circle, and unequal values render an oval.

```kotlin highlight-android-create-ellipse
    val ellipseBlock = engine.block.create(DesignBlockType.Graphic)
    val ellipseShape = engine.block.createShape(ShapeType.Ellipse)
    engine.block.setShape(block = ellipseBlock, shape = ellipseShape)

    val ellipseFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = ellipseFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.3F, g = 0.8F, b = 0.4F, a = 1F),
    )
    engine.block.setFill(block = ellipseBlock, fill = ellipseFill)

    engine.block.setWidth(ellipseBlock, value = 160F)
    engine.block.setHeight(ellipseBlock, value = 140F)
    engine.block.appendChild(parent = page, child = ellipseBlock)
```

### Create Star

Create stars with `createShape(ShapeType.Star)`. Configure the point count with `shape/star/points` and the inner-to-outer diameter ratio with `shape/star/innerDiameter`.

```kotlin highlight-android-create-star
    val starBlock = engine.block.create(DesignBlockType.Graphic)
    val starShape = engine.block.createShape(ShapeType.Star)
    engine.block.setShape(block = starBlock, shape = starShape)

    engine.block.setInt(starShape, property = "shape/star/points", value = 5)
    engine.block.setFloat(starShape, property = "shape/star/innerDiameter", value = 0.4F)

    val starFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = starFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 1F, g = 0.8F, b = 0F, a = 1F),
    )
    engine.block.setFill(block = starBlock, fill = starFill)

    engine.block.setWidth(starBlock, value = 160F)
    engine.block.setHeight(starBlock, value = 140F)
    engine.block.appendChild(parent = page, child = starBlock)
```

Lower `innerDiameter` values produce thinner points, while higher values move the inner vertices closer to the outer radius.

### Create Polygon

Create regular polygons with `createShape(ShapeType.Polygon)`. Set the number of sides with `shape/polygon/sides` to render triangles (`3`), pentagons (`5`), hexagons (`6`), and beyond.

```kotlin highlight-android-create-polygon
    val polygonBlock = engine.block.create(DesignBlockType.Graphic)
    val polygonShape = engine.block.createShape(ShapeType.Polygon)
    engine.block.setShape(block = polygonBlock, shape = polygonShape)

    engine.block.setInt(polygonShape, property = "shape/polygon/sides", value = 6)

    val polygonFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = polygonFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.6F, g = 0.2F, b = 0.8F, a = 1F),
    )
    engine.block.setFill(block = polygonBlock, fill = polygonFill)

    engine.block.setWidth(polygonBlock, value = 160F)
    engine.block.setHeight(polygonBlock, value = 140F)
    engine.block.appendChild(parent = page, child = polygonBlock)
```

### Create Line

Create lines with `createShape(ShapeType.Line)`. Lines render through their stroke, so enable the stroke, set the color with `setStrokeColor()`, and set the thickness with `setStrokeWidth()`.

```kotlin highlight-android-create-line
    val lineBlock = engine.block.create(DesignBlockType.Graphic)
    val lineShape = engine.block.createShape(ShapeType.Line)
    engine.block.setShape(block = lineBlock, shape = lineShape)

    engine.block.setStrokeEnabled(lineBlock, enabled = true)
    engine.block.setStrokeWidth(lineBlock, width = 6F)
    engine.block.setStrokeColor(
        block = lineBlock,
        color = Color.fromRGBA(r = 0.9F, g = 0.2F, b = 0.5F, a = 1F),
    )

    engine.block.setWidth(lineBlock, value = 160F)
    // Line shapes use block height as the visible stroke thickness.
    engine.block.setHeight(lineBlock, value = 6F)
    engine.block.appendChild(parent = page, child = lineBlock)
```

The sample sets the block height to the same value as the stroke width so the line's bounding box matches the visible stroke.

### Create Vector Path

Create custom shapes with `createShape(ShapeType.VectorPath)`. Set the SVG path with `setString()` using the `shape/vector_path/path` property. Path coordinates scale proportionally with the block's width and height.

```kotlin highlight-android-create-vector-path
    val vectorPathBlock = engine.block.create(DesignBlockType.Graphic)
    val vectorPathShape = engine.block.createShape(ShapeType.VectorPath)
    engine.block.setShape(block = vectorPathBlock, shape = vectorPathShape)

    val trianglePath = "M 50,0 L 100,100 L 0,100 Z"
    engine.block.setString(
        block = vectorPathShape,
        property = "shape/vector_path/path",
        value = trianglePath,
    )

    val vectorPathFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = vectorPathFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.2F, g = 0.7F, b = 0.7F, a = 1F),
    )
    engine.block.setFill(block = vectorPathBlock, fill = vectorPathFill)

    engine.block.setWidth(vectorPathBlock, value = 160F)
    engine.block.setHeight(vectorPathBlock, value = 140F)
    engine.block.appendChild(parent = page, child = vectorPathBlock)
```

The example draws a triangle by moving to the top center, then to the bottom-right and bottom-left corners. CE.SDK accepts the SVG path subset supported by its parser; validate complex paths before shipping them.

### Discover Shape Properties

Use `findAllProperties()` to list every configurable property for a given shape. This helps when exploring an unfamiliar shape type or building generic editing tools.

```kotlin highlight-android-discover-shape-properties
val starProperties = engine.block.findAllProperties(starShape)
Log.i(TAG, "Star shape properties: $starProperties")
```

Each shape type exposes its own set of properties:

- **Rectangle**: `shape/rect/cornerRadiusTL`, `shape/rect/cornerRadiusTR`, `shape/rect/cornerRadiusBL`, `shape/rect/cornerRadiusBR`
- **Star**: `shape/star/points`, `shape/star/innerDiameter`, `shape/star/cornerRadius`
- **Polygon**: `shape/polygon/sides`, `shape/polygon/cornerRadius`
- **Vector Path**: `shape/vector_path/path`, `shape/vector_path/width`, `shape/vector_path/height`, `shape/vector_path/cornerRadius`, `shape/vector_path/fillRule`

## Programmatic Sticker Insertion

### Insert a Sticker

A sticker is a graphic block with a rect shape and an image fill. Set the fill's `fill/image/imageFileURI` property to the sticker URI, then tag the block as a sticker with `setKind()` so the editor categorizes it correctly.

```kotlin highlight-android-sticker-manual-construction
    val stickerBlock = engine.block.create(DesignBlockType.Graphic)
    val stickerShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = stickerBlock, shape = stickerShape)

    val stickerFill = engine.block.createFill(FillType.Image)
    val stickerUri = stickerAssetsBaseUri.buildUpon()
        .appendPath(DefaultAssetSource.STICKER.key)
        .appendPath("images")
        .appendPath("emoji")
        .appendPath("emoji_happyface.svg")
        .build()
    engine.block.setUri(
        block = stickerFill,
        property = "fill/image/imageFileURI",
        value = stickerUri,
    )
    engine.block.setFill(block = stickerBlock, fill = stickerFill)

    if (engine.block.supportsContentFillMode(stickerBlock)) {
        engine.block.setContentFillMode(stickerBlock, mode = ContentFillMode.CONTAIN)
    }
    engine.block.setKind(stickerBlock, kind = "sticker")

    engine.block.setWidth(stickerBlock, value = 160F)
    engine.block.setHeight(stickerBlock, value = 140F)
    engine.block.appendChild(parent = page, child = stickerBlock)
```

`setContentFillMode()` with `ContentFillMode.CONTAIN` preserves the sticker's aspect ratio inside the block bounds. Guard the call with `supportsContentFillMode()` because not every block configuration exposes content fill modes.

### Query Stickers From the Asset Library

Populate the sticker asset source with the `ly.img.sticker` manifest when it is not already registered. Once the source is available, browse the catalog with `findAssets()`.

```kotlin highlight-android-query-stickers
    val stickerSourceId = DefaultAssetSource.STICKER.key
    if (stickerSourceId !in engine.asset.findAllSources()) {
        engine.populateAssetSource(
            id = stickerSourceId,
            jsonUri = stickerAssetsBaseUri.buildUpon()
                .appendPath(stickerSourceId)
                .appendPath("content.json")
                .build(),
            replaceBaseUri = stickerAssetsBaseUri,
        )
    }

    var stickerResults = findStickerAssets(engine = engine, sourceId = stickerSourceId)
    var stickerAssetSourceId = stickerSourceId
    if (stickerResults.assets.isEmpty()) {
        try {
            engine.populateAssetSource(
                id = stickerSourceId,
                jsonUri = stickerAssetsBaseUri.buildUpon()
                    .appendPath(stickerSourceId)
                    .appendPath("content.json")
                    .build(),
                replaceBaseUri = stickerAssetsBaseUri,
            )
        } catch (error: Exception) {
            Log.w(TAG, "Could not populate sticker source $stickerSourceId.", error)
        }
        stickerResults = findStickerAssets(engine = engine, sourceId = stickerSourceId)
    }
    if (stickerResults.assets.isEmpty()) {
        stickerAssetSourceId = GUIDE_STICKER_SOURCE_ID
        ensureGuideStickerAssetSource(engine = engine, stickerUri = stickerUri)
        stickerResults = findStickerAssets(engine = engine, sourceId = stickerAssetSourceId)
    }
    Log.i(TAG, "Stickers in emoji category: ${stickerResults.total}")
```

The `query` parameter accepts a fuzzy search string; `groups` narrows the result to a single category. Omit `query` to remove the fuzzy-search filter for the selected group, or omit `groups` to retrieve stickers from the full source. For vector-based shape assets, use `"ly.img.vector.shape"` as the source ID.

### Apply a Sticker From the Library

`applyAssetSourceAsset()` returns a nullable block. A non-null result is already attached to the current scene and includes metadata such as shape, image fill, kind, and dimensions. Check for `null` before resizing or positioning the block because an asset source can decline to materialize a specific asset.

```kotlin highlight-android-apply-sticker
    val stickerAsset = checkNotNull(stickerResults.assets.firstOrNull()) {
        "No sticker assets found."
    }
    val stickerFromLibrary = checkNotNull(
        engine.asset.applyAssetSourceAsset(sourceId = stickerAssetSourceId, asset = stickerAsset),
    ) {
        "The sticker asset source did not create a block."
    }

    if (engine.block.supportsContentFillMode(stickerFromLibrary)) {
        engine.block.setContentFillMode(stickerFromLibrary, mode = ContentFillMode.CONTAIN)
    }
    engine.block.setWidth(stickerFromLibrary, value = 160F)
    engine.block.setHeight(stickerFromLibrary, value = 140F)
```

This is the recommended path when the sticker URL comes from the asset library. Manual construction is useful when your app already knows the sticker URI.

## Troubleshooting

### Shape Not Visible

If a shape does not appear after creation:

- **Verify a fill is applied.** Shapes without fills are invisible. Create a fill with `createFill()` and apply it with `setFill()`.
- **Check the block is added to the page.** Call `appendChild()` to attach the block to the scene hierarchy.
- **Ensure dimensions are set.** Call `setWidth()` and `setHeight()` to give the shape a size.

### Line Not Visible

Lines render through their stroke, not a fill. Enable the stroke with `setStrokeEnabled()` and set a stroke width before expecting the line to appear.

### Sticker Appears Cropped

Set `setContentFillMode()` to `ContentFillMode.CONTAIN` to preserve the sticker's aspect ratio inside the block bounds. Check `supportsContentFillMode()` before calling it.

### Invalid Shape Type

Use the Android `ShapeType` values instead of deprecated string-based shape creation. Valid values are `ShapeType.Rect`, `ShapeType.Ellipse`, `ShapeType.Star`, `ShapeType.Polygon`, `ShapeType.Line`, and `ShapeType.VectorPath`.

### No Assets Found

Confirm that the expected source ID appears in `findAllSources()` and that its `content.json` URI is reachable. If you self-host the bundle, pass the corresponding base URI when populating the source.

### Asset Does Not Create a Block

Treat the return value of `applyAssetSourceAsset()` as nullable. A `null` result means the source did not create a scene block for the selected asset.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.create()` | Create a scene that owns the page and inserted blocks |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create a graphic block to host a shape or sticker |
| `engine.block.createShape(type=ShapeType.Rect)` | Create a shape of the specified `ShapeType` |
| `engine.block.supportsShape(block=_)` | Check whether a block supports shapes |
| `engine.block.setShape(block=_, shape=_)` | Attach a shape to a graphic block |
| `engine.block.findAllProperties(block=_)` | List every configurable property of a block |
| `engine.block.setInt(block=_, property="shape/star/points", value=_)` | Set an integer property, such as star points or polygon sides |
| `engine.block.setFloat(block=_, property="shape/star/innerDiameter", value=_)` | Set a float property, such as corner radius or star inner diameter |
| `engine.block.setString(block=_, property="shape/vector_path/path", value=_)` | Set a string property, such as an SVG vector path |
| `engine.block.createFill(fillType=FillType.Color)` | Create a fill of the specified `FillType` |
| `engine.block.setFill(block=_, fill=_)` | Apply a fill to a block |
| `engine.block.setColor(block=_, property="fill/color/value", value=_)` | Set a color property on a fill |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Set a URI property on an image fill |
| `engine.block.setKind(block=_, kind=_)` | Set a block's kind for categorization |
| `engine.block.setContentFillMode(block=_, mode=ContentFillMode.CONTAIN)` | Set how image content fits within the block bounds |
| `engine.block.supportsContentFillMode(block=_)` | Check whether the block supports content fill modes |
| `engine.block.setStrokeEnabled(block=_, enabled=_)` | Enable or disable a block's stroke |
| `engine.block.setStrokeWidth(block=_, width=_)` | Set the stroke thickness |
| `engine.block.setStrokeColor(block=_, color=_)` | Set the stroke color |
| `engine.block.setWidth(block=_, value=_)` | Set the block width |
| `engine.block.setHeight(block=_, value=_)` | Set the block height |
| `engine.block.appendChild(parent=_, child=_)` | Attach a block to a parent |
| `engine.block.destroy(block=_)` | Destroy a temporary or no longer needed block |
| `engine.populateAssetSource(id=_, jsonUri=_, replaceBaseUri=_)` | Populate a default asset source from a `content.json` URI |
| `engine.asset.findAllSources()` | List registered asset source IDs before populating a source |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query assets from a registered source |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_)` | Materialize a nullable block from an asset result |

## Next Steps

- [Asset Library Basics](../import-media/asset-library/basics.md) — Understand sources, groups, and asset metadata
- [Customize Asset Library](../import-media/asset-library/customize.md) — Control which sources and categories users can browse
- [Colors](../colors.md) - Work with colors, fills, and gradients
- [Filters and Effects](../filters-and-effects.md) - Apply visual effects to design elements
- [Position and Align](../create-composition/position-and-align.md) - Position elements precisely on the canvas



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support