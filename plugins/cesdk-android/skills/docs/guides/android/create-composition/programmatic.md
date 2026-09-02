> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Programmatic Creation](./programmatic.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-composition-programmatic/CreateCompositionProgrammatic.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.Font
import ly.img.engine.FontStyle
import ly.img.engine.FontWeight
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import ly.img.engine.Typeface
import java.io.File
import java.util.UUID

suspend fun exportProgrammaticComposition(engine: Engine): File = withContext(engine.dispatcher) {
    buildProgrammaticComposition(engine)
}

private suspend fun buildProgrammaticComposition(engine: Engine): File {
    val robotoBase = "https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Roboto"
    val robotoTypeface = Typeface(
        name = "Roboto",
        fonts = listOf(
            Font(
                uri = Uri.parse("$robotoBase/Roboto-Regular.ttf"),
                subFamily = "Regular",
                weight = FontWeight.NORMAL,
                style = FontStyle.NORMAL,
            ),
            Font(
                uri = Uri.parse("$robotoBase/Roboto-Bold.ttf"),
                subFamily = "Bold",
                weight = FontWeight.BOLD,
                style = FontStyle.NORMAL,
            ),
            Font(
                uri = Uri.parse("$robotoBase/Roboto-Italic.ttf"),
                subFamily = "Italic",
                weight = FontWeight.NORMAL,
                style = FontStyle.ITALIC,
            ),
            Font(
                uri = Uri.parse("$robotoBase/Roboto-BoldItalic.ttf"),
                subFamily = "Bold Italic",
                weight = FontWeight.BOLD,
                style = FontStyle.ITALIC,
            ),
        ),
    )
    val robotoRegular = robotoTypeface.fonts.first {
        it.weight == FontWeight.NORMAL && it.style == FontStyle.NORMAL
    }

    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    val backgroundFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block = page, fill = backgroundFill)
    engine.block.setFillSolidColor(
        block = page,
        color = Color.fromRGBA(r = 0.94F, g = 0.93F, b = 0.98F, a = 1F),
    )

    val headline = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(headline, text = "Integrate\nCreative Editing\ninto your App")
    engine.block.setFont(headline, fontFileUri = robotoRegular.uri, typeface = robotoTypeface)
    engine.block.setTextLineHeight(headline, lineHeight = 0.78F)

    if (engine.block.canToggleBoldFont(headline)) {
        engine.block.toggleBoldFont(headline)
    }
    engine.block.setTextColor(headline, color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F))

    engine.block.setWidthMode(headline, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(headline, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(headline, value = 960F)
    engine.block.setHeight(headline, value = 300F)
    // The Android binding has no typed helper for this text option yet.
    engine.block.setBoolean(headline, property = "text/automaticFontSizeEnabled", value = true)

    engine.block.setPositionX(headline, value = 60F)
    engine.block.setPositionY(headline, value = 80F)
    engine.block.appendChild(parent = page, child = headline)

    val tagline = engine.block.create(DesignBlockType.Text)
    val taglineText = "in hours,\nnot months."
    engine.block.replaceText(tagline, text = taglineText)
    engine.block.setFont(tagline, fontFileUri = robotoRegular.uri, typeface = robotoTypeface)
    engine.block.setTextLineHeight(tagline, lineHeight = 0.78F)

    engine.block.setTextColor(
        tagline,
        color = Color.fromRGBA(r = 0.2F, g = 0.2F, b = 0.8F, a = 1F),
        from = 0,
        to = 9,
    )
    if (engine.block.canToggleItalicFont(tagline, from = 0, to = 9)) {
        engine.block.toggleItalicFont(tagline, from = 0, to = 9)
    }

    engine.block.setTextColor(
        tagline,
        color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F),
        from = 10,
        to = 21,
    )
    if (engine.block.canToggleBoldFont(tagline, from = 10, to = 21)) {
        engine.block.toggleBoldFont(tagline, from = 10, to = 21)
    }

    engine.block.setWidthMode(tagline, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(tagline, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(tagline, value = 960F)
    engine.block.setHeight(tagline, value = 220F)
    // The Android binding has no typed helper for this text option yet.
    engine.block.setBoolean(tagline, property = "text/automaticFontSizeEnabled", value = true)
    engine.block.setPositionX(tagline, value = 60F)
    engine.block.setPositionY(tagline, value = 551F)
    engine.block.appendChild(parent = page, child = tagline)

    val ctaTitle = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(ctaTitle, text = "Start a Free Trial")
    engine.block.setFont(ctaTitle, fontFileUri = robotoRegular.uri, typeface = robotoTypeface)
    engine.block.setTextFontSize(ctaTitle, fontSize = 80F)
    engine.block.setTextLineHeight(ctaTitle, lineHeight = 1F)

    if (engine.block.canToggleBoldFont(ctaTitle)) {
        engine.block.toggleBoldFont(ctaTitle)
    }
    engine.block.setTextColor(ctaTitle, color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F))
    engine.block.setWidthMode(ctaTitle, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(ctaTitle, mode = SizeMode.AUTO)
    engine.block.setWidth(ctaTitle, value = 664.6F)
    engine.block.setPositionX(ctaTitle, value = 64F)
    engine.block.setPositionY(ctaTitle, value = 952F)
    engine.block.appendChild(parent = page, child = ctaTitle)

    val ctaUrl = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(ctaUrl, text = "www.img.ly")
    engine.block.setFont(ctaUrl, fontFileUri = robotoRegular.uri, typeface = robotoTypeface)
    engine.block.setTextFontSize(ctaUrl, fontSize = 80F)
    engine.block.setTextLineHeight(ctaUrl, lineHeight = 1F)
    engine.block.setTextColor(ctaUrl, color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F))
    engine.block.setWidthMode(ctaUrl, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(ctaUrl, mode = SizeMode.AUTO)
    engine.block.setWidth(ctaUrl, value = 664.6F)
    engine.block.setPositionX(ctaUrl, value = 64F)
    engine.block.setPositionY(ctaUrl, value = 1006F)
    engine.block.appendChild(parent = page, child = ctaUrl)

    val dividerLine = engine.block.create(DesignBlockType.Graphic)
    val lineShape = engine.block.createShape(ShapeType.Line)
    engine.block.setShape(block = dividerLine, shape = lineShape)

    val lineFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block = dividerLine, fill = lineFill)
    engine.block.setFillSolidColor(
        block = dividerLine,
        color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F),
    )

    engine.block.setWidth(dividerLine, value = 418F)
    // Line shapes use block height as the visible stroke thickness.
    engine.block.setHeight(dividerLine, value = 11.3F)
    engine.block.setPositionX(dividerLine, value = 64F)
    engine.block.setPositionY(dividerLine, value = 460F)
    engine.block.appendChild(parent = page, child = dividerLine)

    val logo = engine.block.create(DesignBlockType.Graphic)
    val logoShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = logo, shape = logoShape)

    val logoFill = engine.block.createFill(FillType.Image)
    // Image fills currently expose their URI through the generic property API.
    engine.block.setUri(
        block = logoFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/imgly_logo.jpg"),
    )
    engine.block.setFill(block = logo, fill = logoFill)

    engine.block.setContentFillMode(logo, mode = ContentFillMode.CONTAIN)
    engine.block.setWidth(logo, value = 200F)
    engine.block.setHeight(logo, value = 65F)
    engine.block.setPositionX(logo, value = 820F)
    engine.block.setPositionY(logo, value = 960F)
    engine.block.appendChild(parent = page, child = logo)

    val exportOptions = ExportOptions(targetWidth = 1080F, targetHeight = 1080F)
    // Ensure remote font files and the image fill are ready before the offscreen export.
    engine.block.forceLoadResources(listOf(page, headline, tagline, ctaTitle, ctaUrl, logo))
    val blob = engine.block.export(page, mimeType = MimeType.PNG, options = exportOptions)

    return withContext(Dispatchers.IO) {
        val outputFile = File.createTempFile("composition-${UUID.randomUUID()}", ".png")
        val data = blob.asReadOnlyBuffer()
        outputFile.outputStream().channel.use { channel ->
            while (data.hasRemaining()) {
                channel.write(data)
            }
        }
        outputFile
    }
}
```

Build compositions entirely through code using the CE.SDK Engine for automation, batch processing, and headless rendering.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/engine-guides-create-composition-programmatic)

<EngineReferenceNote {...props} />

CE.SDK provides a complete Engine API for building designs through code. Instead of relying on user interactions through an editor UI, you can create scenes, add blocks like text, images, and shapes, and position them programmatically. This approach enables automation workflows, batch processing, headless rendering, and integration with custom interfaces.

This guide covers how to create a scene structure with social media dimensions, set background colors, add text with mixed styling, line shapes, images, and export the finished composition.

The page dimensions and `ExportOptions(targetWidth = 1080F, targetHeight = 1080F)` shown later control the exported PNG dimensions.

## Create Scene Structure

We create the foundation of the composition with social media dimensions (1080x1080 pixels for Instagram). A scene contains one or more pages, and pages contain the design blocks.

```kotlin highlight-android-create-scene
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)
```

`engine.scene.create()` returns a scene handle. Create a page with `engine.block.create(DesignBlockType.Page)`, set its dimensions with `setWidth()` and `setHeight()`, then attach it to the scene with `appendChild()`.

## Set Page Background

We set the page background using a color fill. This demonstrates how to create and assign fills to blocks.

```kotlin highlight-android-add-background
val backgroundFill = engine.block.createFill(FillType.Color)
engine.block.setFill(block = page, fill = backgroundFill)
engine.block.setFillSolidColor(
    block = page,
    color = Color.fromRGBA(r = 0.94F, g = 0.93F, b = 0.98F, a = 1F),
)
```

We create a color fill using `createFill(FillType.Color)`, assign it to the page with `setFill()`, then set the solid fill color on the target block via `setFillSolidColor(block=_, color=_)`.

## Add Text Blocks

Text blocks allow you to add and style text content. We demonstrate three different approaches to text sizing and styling.

### Select the Font Variant

Before styling text, define a `Typeface` with the variants the sample needs and select the regular font by weight and style. The bold and italic toggles can only apply variants that exist in this typeface.

```kotlin highlight-android-font-setup
val robotoBase = "https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Roboto"
val robotoTypeface = Typeface(
    name = "Roboto",
    fonts = listOf(
        Font(
            uri = Uri.parse("$robotoBase/Roboto-Regular.ttf"),
            subFamily = "Regular",
            weight = FontWeight.NORMAL,
            style = FontStyle.NORMAL,
        ),
        Font(
            uri = Uri.parse("$robotoBase/Roboto-Bold.ttf"),
            subFamily = "Bold",
            weight = FontWeight.BOLD,
            style = FontStyle.NORMAL,
        ),
        Font(
            uri = Uri.parse("$robotoBase/Roboto-Italic.ttf"),
            subFamily = "Italic",
            weight = FontWeight.NORMAL,
            style = FontStyle.ITALIC,
        ),
        Font(
            uri = Uri.parse("$robotoBase/Roboto-BoldItalic.ttf"),
            subFamily = "Bold Italic",
            weight = FontWeight.BOLD,
            style = FontStyle.ITALIC,
        ),
    ),
)
val robotoRegular = robotoTypeface.fonts.first {
    it.weight == FontWeight.NORMAL && it.style == FontStyle.NORMAL
}
```

### Create Text and Set Content

Create a text block, set its content with `replaceText()`, then bind the selected Roboto font and typeface:

```kotlin highlight-android-text-create
val headline = engine.block.create(DesignBlockType.Text)
engine.block.replaceText(headline, text = "Integrate\nCreative Editing\ninto your App")
engine.block.setFont(headline, fontFileUri = robotoRegular.uri, typeface = robotoTypeface)
engine.block.setTextLineHeight(headline, lineHeight = 0.78F)
```

### Style Entire Text Block

Apply styling to the entire text block using `toggleBoldFont()` and `setTextColor()`:

```kotlin highlight-android-text-style-block
if (engine.block.canToggleBoldFont(headline)) {
    engine.block.toggleBoldFont(headline)
}
engine.block.setTextColor(headline, color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F))
```

### Enable Automatic Font Sizing

Configure the text block to automatically scale its font size to fit within fixed dimensions:

```kotlin highlight-android-text-auto-size
engine.block.setWidthMode(headline, mode = SizeMode.ABSOLUTE)
engine.block.setHeightMode(headline, mode = SizeMode.ABSOLUTE)
engine.block.setWidth(headline, value = 960F)
engine.block.setHeight(headline, value = 300F)
// The Android binding has no typed helper for this text option yet.
engine.block.setBoolean(headline, property = "text/automaticFontSizeEnabled", value = true)
```

Android exposes the block sizing modes through typed APIs. The automatic font-size switch uses the generic Boolean property API because no public typed Android setter exists for `text/automaticFontSizeEnabled` yet.

### Range-based Text Styling

Apply different styles to specific character ranges within a single text block:

```kotlin highlight-android-text-range-style
    engine.block.setTextColor(
        tagline,
        color = Color.fromRGBA(r = 0.2F, g = 0.2F, b = 0.8F, a = 1F),
        from = 0,
        to = 9,
    )
    if (engine.block.canToggleItalicFont(tagline, from = 0, to = 9)) {
        engine.block.toggleItalicFont(tagline, from = 0, to = 9)
    }

    engine.block.setTextColor(
        tagline,
        color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F),
        from = 10,
        to = 21,
    )
    if (engine.block.canToggleBoldFont(tagline, from = 10, to = 21)) {
        engine.block.toggleBoldFont(tagline, from = 10, to = 21)
    }
```

Android's range-based overloads take start-inclusive and end-exclusive UTF-16 code unit indices (`[from, to)`):

- `setTextColor(block, color, from, to)` - apply color to a specific UTF-16 range
- `canToggleBoldFont(block, from, to)` / `toggleBoldFont(block, from, to)` - toggle bold styling for a range
- `canToggleItalicFont(block, from, to)` / `toggleItalicFont(block, from, to)` - toggle italic styling for a range

### Fixed Font Size

Set an explicit font size with `setTextFontSize()` instead of using automatic sizing:

```kotlin highlight-android-text-fixed-size
val ctaTitle = engine.block.create(DesignBlockType.Text)
engine.block.replaceText(ctaTitle, text = "Start a Free Trial")
engine.block.setFont(ctaTitle, fontFileUri = robotoRegular.uri, typeface = robotoTypeface)
engine.block.setTextFontSize(ctaTitle, fontSize = 80F)
engine.block.setTextLineHeight(ctaTitle, lineHeight = 1F)
```

## Add Shapes

We create shapes using graphic blocks. CE.SDK supports `Rect`, `Line`, `Ellipse`, `Polygon`, `Star`, and `VectorPath` shapes through `ShapeType` object constants.

### Create a Shape Block

Create a graphic block and assign a shape to it:

```kotlin highlight-android-shape-create
val dividerLine = engine.block.create(DesignBlockType.Graphic)
val lineShape = engine.block.createShape(ShapeType.Line)
engine.block.setShape(block = dividerLine, shape = lineShape)
```

### Apply Fill to Shape

Create a color fill, assign it to the graphic block, then set the line color with `setFillSolidColor(block=_, color=_)`:

```kotlin highlight-android-shape-fill
val lineFill = engine.block.createFill(FillType.Color)
engine.block.setFill(block = dividerLine, fill = lineFill)
engine.block.setFillSolidColor(
    block = dividerLine,
    color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 1F),
)
```

## Add Images

We add images using graphic blocks with image fills.

### Create an Image Block

Create a graphic block with a rect shape and an image fill:

```kotlin highlight-android-image-create
    val logo = engine.block.create(DesignBlockType.Graphic)
    val logoShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = logo, shape = logoShape)

    val logoFill = engine.block.createFill(FillType.Image)
    // Image fills currently expose their URI through the generic property API.
    engine.block.setUri(
        block = logoFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/imgly_logo.jpg"),
    )
    engine.block.setFill(block = logo, fill = logoFill)
```

We set the image URL with `setUri()` and pass the image URI to the `fill/image/imageFileURI` property. Image fills currently expose this URI through the generic property API instead of a dedicated typed setter.

## Position and Size Blocks

All blocks use the same positioning and sizing APIs:

```kotlin highlight-android-block-position
engine.block.setContentFillMode(logo, mode = ContentFillMode.CONTAIN)
engine.block.setWidth(logo, value = 200F)
engine.block.setHeight(logo, value = 65F)
engine.block.setPositionX(logo, value = 820F)
engine.block.setPositionY(logo, value = 960F)
engine.block.appendChild(parent = page, child = logo)
```

- `setWidth()` / `setHeight()` - set block dimensions
- `setPositionX()` / `setPositionY()` - set block position
- `setContentFillMode()` - control how content fills the block (`ContentFillMode.CONTAIN`, `ContentFillMode.COVER`, `ContentFillMode.CROP`)
- `appendChild()` - add the block to the page hierarchy

## Export the Composition

We export the finished composition using the engine API.

### Export Using the Engine API

`engine.block.export()` returns the rendered bytes as a `ByteBuffer`:

```kotlin highlight-android-export-api
val exportOptions = ExportOptions(targetWidth = 1080F, targetHeight = 1080F)
// Ensure remote font files and the image fill are ready before the offscreen export.
engine.block.forceLoadResources(listOf(page, headline, tagline, ctaTitle, ctaUrl, logo))
val blob = engine.block.export(page, mimeType = MimeType.PNG, options = exportOptions)
```

The sample preloads the page and resource-bearing text and image blocks before export, so remote font files and image fills are resolved before the offscreen renderer captures the PNG.

### Write to File System

Write the returned `ByteBuffer` to disk from an IO dispatcher. The sample streams a read-only view of the remaining bytes directly through a file channel, writes them to a temporary PNG file, and returns that file for verification.

```kotlin highlight-android-export-file
return withContext(Dispatchers.IO) {
    val outputFile = File.createTempFile("composition-${UUID.randomUUID()}", ".png")
    val data = blob.asReadOnlyBuffer()
    outputFile.outputStream().channel.use { channel ->
        while (data.hasRemaining()) {
            channel.write(data)
        }
    }
    outputFile
}
```

## API Reference

| API | Category | Purpose |
| --- | --- | --- |
| `engine.scene.create()` | Scene | Create a scene for programmatic composition. |
| `engine.block.create(blockType=_)` | Block | Create pages, text blocks, and graphic blocks. |
| `engine.block.appendChild(parent=_, child=_)` | Block | Attach a block to the scene or page hierarchy. |
| `engine.block.setWidth(block=_, value=_)` | Layout | Set a block width. |
| `engine.block.setHeight(block=_, value=_)` | Layout | Set a block height. |
| `engine.block.setWidthMode(block=_, mode=_)` | Layout | Set how a block's width is resolved. |
| `engine.block.setHeightMode(block=_, mode=_)` | Layout | Set how a block's height is resolved. |
| `engine.block.setPositionX(block=_, value=_)` | Layout | Set a block's horizontal position. |
| `engine.block.setPositionY(block=_, value=_)` | Layout | Set a block's vertical position. |
| `engine.block.createFill(fillType=_)` | Fill | Create a color or image fill. |
| `engine.block.setFill(block=_, fill=_)` | Fill | Assign a fill to a block. |
| `engine.block.setFillSolidColor(block=_, color=_)` | Fill | Set a solid fill color on a block. |
| `engine.block.createShape(type=_)` | Shape | Create a shape for a graphic block. |
| `engine.block.setShape(block=_, shape=_)` | Shape | Assign a shape to a graphic block. |
| `engine.block.replaceText(block=_, text=_)` | Text | Set text content. |
| `engine.block.setFont(block=_, fontFileUri=_, typeface=_)` | Text | Bind a typeface and font file to a text block. |
| `engine.block.setTextFontSize(block=_, fontSize=_)` | Text | Set a fixed font size. |
| `engine.block.setTextLineHeight(block=_, lineHeight=_)` | Text | Set the line height multiplier for text paragraphs. |
| `engine.block.setTextColor(block=_, color=_)` | Text | Set text color for the full text block. |
| `engine.block.setTextColor(block=_, color=_, from=_, to=_)` | Text | Set text color for a character range. |
| `engine.block.setBoolean(block=_, property="text/automaticFontSizeEnabled", value=_)` | Text | Enable or disable automatic font sizing through the generic property API. |
| `engine.block.canToggleBoldFont(block=_)` | Text | Check whether bold styling can be toggled. |
| `engine.block.toggleBoldFont(block=_)` | Text | Toggle bold styling for the full text block. |
| `engine.block.canToggleBoldFont(block=_, from=_, to=_)` | Text | Check whether bold styling can be toggled for a range. |
| `engine.block.toggleBoldFont(block=_, from=_, to=_)` | Text | Toggle bold styling for a character range. |
| `engine.block.canToggleItalicFont(block=_, from=_, to=_)` | Text | Check whether italic styling can be toggled for a range. |
| `engine.block.toggleItalicFont(block=_, from=_, to=_)` | Text | Toggle italic styling for a character range. |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Image | Set the image URI on an image fill. |
| `engine.block.setContentFillMode(block=_, mode=_)` | Image | Control how image content fits the block. |
| `engine.block.forceLoadResources(blocks=_)` | Export | Resolve referenced fonts and image fills before exporting. |
| `engine.block.export(block=_, mimeType=_, options=_)` | Export | Export the page to image bytes. |

## Troubleshooting

- **Blocks not appearing**: Verify that `appendChild()` attaches blocks to the page. Blocks must be part of the scene hierarchy to render.
- **Text styling not applied**: Verify ranges are correct for range-based APIs. Android uses start-inclusive and end-exclusive UTF-16 code unit indices for the selected range.
- **Image stretched**: Use `setContentFillMode(block, ContentFillMode.CONTAIN)` to maintain the image's aspect ratio.
- **Export fails**: Verify that page dimensions are set before export. The export requires valid dimensions.
- **Typeface missing variants**: If `canToggleBoldFont()` or `canToggleItalicFont()` returns `false`, check that the configured `Typeface` includes the matching weight or style.

## Next Steps

- [Layer Management](./layer-management.md) - Control block stacking and organization
- [Positioning and Alignment](./position-and-align.md) - Precise block placement
- [Group and Ungroup](./group-and-ungroup.md) - Group blocks for unified transforms
- [Export](../export-save-publish/export.md) - Export options and formats



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support