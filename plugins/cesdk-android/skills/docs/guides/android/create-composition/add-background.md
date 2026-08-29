> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Add a Background](./add-background.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-add-background/AddBackground.kt reference-only
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GradientColorStop
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

suspend fun addBackground(engine: Engine) = withContext(engine.dispatcher) {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    if (engine.block.supportsFill(page)) {
        val gradientFill = engine.block.createFill(FillType.LinearGradient)
        engine.block.setGradientColorStops(
            block = gradientFill,
            property = "fill/gradient/colors",
            colorStops = listOf(
                GradientColorStop(
                    color = Color.fromRGBA(r = 0.85F, g = 0.75F, b = 0.95F, a = 1F),
                    stop = 0F,
                ),
                GradientColorStop(
                    color = Color.fromRGBA(r = 0.7F, g = 0.9F, b = 0.95F, a = 1F),
                    stop = 1F,
                ),
            ),
        )
        engine.block.setFill(page, fill = gradientFill)
    }

    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(textBlock, text = "Backgrounds")
    engine.block.setTextFontSize(block = textBlock, fontSize = 48F)
    engine.block.setWidth(textBlock, value = 280F)
    engine.block.setHeightMode(textBlock, mode = SizeMode.AUTO)
    engine.block.setPositionX(textBlock, value = 66F)
    engine.block.setPositionY(textBlock, value = 280F)
    engine.block.appendChild(parent = page, child = textBlock)

    if (engine.block.supportsBackgroundColor(textBlock)) {
        engine.block.setBackgroundColorEnabled(textBlock, enabled = true)
        engine.block.setBackgroundColor(
            block = textBlock,
            color = Color.fromRGBA(r = 1F, g = 1F, b = 1F, a = 1F),
        )
        engine.block.setFloat(textBlock, property = "backgroundColor/paddingLeft", value = 16F)
        engine.block.setFloat(textBlock, property = "backgroundColor/paddingRight", value = 16F)
        engine.block.setFloat(textBlock, property = "backgroundColor/paddingTop", value = 10F)
        engine.block.setFloat(textBlock, property = "backgroundColor/paddingBottom", value = 10F)
        engine.block.setFloat(textBlock, property = "backgroundColor/cornerRadius", value = 8F)
    }

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(imageBlock, shape = rectShape)
    engine.block.setWidth(imageBlock, value = 340F)
    engine.block.setHeight(imageBlock, value = 400F)
    engine.block.setPositionX(imageBlock, value = 420F)
    engine.block.setPositionY(imageBlock, value = 100F)
    engine.block.appendChild(parent = page, child = imageBlock)

    if (engine.block.supportsFill(imageBlock)) {
        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setString(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = "https://img.ly/static/ubq_samples/sample_1.jpg",
        )
        engine.block.setFill(imageBlock, fill = imageFill)
    }

    engine.block.forceLoadResources(listOf(textBlock, imageBlock))
}
```

Add backgrounds to designs using fills for pages and shapes, and the background color property for text blocks.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-add-background)

<EngineReferenceNote {...props} />

CE.SDK provides two approaches for adding backgrounds to design elements. Use fills for pages and graphic blocks, and use the background color API for text blocks that need padding and rounded corners behind their text.

## Setup

Create a scene with a page where we'll apply backgrounds.

```kotlin highlight-android-setup
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)
```

## Fills

Fills are visual content applied to pages and graphic blocks. Supported fill types include solid colors, linear gradients, radial gradients, conical gradients, images, videos, and pixel streams.

### Check Fill Support

Before applying a fill, verify the block supports it with `supportsFill()`. Pages and graphic blocks typically support fills, while text blocks use text-specific APIs for their visible content.

### Apply a Gradient Fill

Create a fill with `createFill()` specifying the type, configure its color stops, then apply it with `setFill()`. The example below creates a linear gradient with two color stops transitioning from pastel purple to light cyan.

```kotlin highlight-android-page-fill
if (engine.block.supportsFill(page)) {
    val gradientFill = engine.block.createFill(FillType.LinearGradient)
    engine.block.setGradientColorStops(
        block = gradientFill,
        property = "fill/gradient/colors",
        colorStops = listOf(
            GradientColorStop(
                color = Color.fromRGBA(r = 0.85F, g = 0.75F, b = 0.95F, a = 1F),
                stop = 0F,
            ),
            GradientColorStop(
                color = Color.fromRGBA(r = 0.7F, g = 0.9F, b = 0.95F, a = 1F),
                stop = 1F,
            ),
        ),
    )
    engine.block.setFill(page, fill = gradientFill)
}
```

### Apply an Image Fill

Image fills display images within the block's shape bounds. Create an image fill, set its URI, and apply it to a graphic block.

```kotlin highlight-android-shape-fill
if (engine.block.supportsFill(imageBlock)) {
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(imageBlock, fill = imageFill)
}
```

Image fills automatically scale to cover the shape area.

## Background Color

Background color is a dedicated property available specifically on text blocks. Unlike fills, background colors include configurable padding and corner radius, creating highlighted text effects without additional graphic blocks.

### Apply Background Color

Verify support with `supportsBackgroundColor()`, enable the background color with `setBackgroundColorEnabled()`, then configure its color, padding, and corner radius.

```kotlin highlight-android-background-color
if (engine.block.supportsBackgroundColor(textBlock)) {
    engine.block.setBackgroundColorEnabled(textBlock, enabled = true)
    engine.block.setBackgroundColor(
        block = textBlock,
        color = Color.fromRGBA(r = 1F, g = 1F, b = 1F, a = 1F),
    )
    engine.block.setFloat(textBlock, property = "backgroundColor/paddingLeft", value = 16F)
    engine.block.setFloat(textBlock, property = "backgroundColor/paddingRight", value = 16F)
    engine.block.setFloat(textBlock, property = "backgroundColor/paddingTop", value = 10F)
    engine.block.setFloat(textBlock, property = "backgroundColor/paddingBottom", value = 10F)
    engine.block.setFloat(textBlock, property = "backgroundColor/cornerRadius", value = 8F)
}
```

The padding properties (`backgroundColor/paddingLeft`, `backgroundColor/paddingRight`, `backgroundColor/paddingTop`, `backgroundColor/paddingBottom`) control the space between the text and the background edge. The `backgroundColor/cornerRadius` property rounds the corners.

## Troubleshooting

### Fill Not Visible

If a fill doesn't appear:

- Ensure all color components (r, g, b) are between 0 and 1
- Check that the alpha component is greater than 0
- Verify the block supports fills with `supportsFill()`

### Background Color Not Appearing

If a background color doesn't appear:

- Confirm the block supports it with `supportsBackgroundColor()`
- Verify `setBackgroundColorEnabled(block, true)` was called
- Check that the color's alpha value is greater than 0

### Image Not Loading

If an image fill doesn't display:

- Verify the image URI is accessible to the Android app
- Ensure the app has permission to read local `content://` or file-backed URIs
- Ensure the image format is supported, such as PNG, JPEG, or WebP

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.supportsFill(block=_)` | Check if a block supports fills |
| `engine.block.createFill(fillType=FillType.LinearGradient)` | Create a linear gradient fill for page or shape backgrounds |
| `engine.block.createFill(fillType=FillType.Image)` | Create an image fill for graphic blocks |
| `engine.block.setGradientColorStops(block=_, property="fill/gradient/colors", colorStops=_)` | Set gradient color stops on a gradient fill |
| `engine.block.setString(block=_, property="fill/image/imageFileURI", value=_)` | Set the image URI on an image fill |
| `engine.block.setFill(block=_, fill=_)` | Apply a fill to a block |
| `engine.block.getFill(block=_)` | Get the fill applied to a block |
| `engine.block.supportsBackgroundColor(block=_)` | Check if a block supports background color |
| `engine.block.setBackgroundColorEnabled(block=_, enabled=_)` | Enable or disable background color |
| `engine.block.isBackgroundColorEnabled(block=_)` | Check if background color is enabled |
| `engine.block.setBackgroundColor(block=_, color=_)` | Set the background color |
| `engine.block.setFloat(block=_, property="backgroundColor/paddingLeft", value=_)` | Set the left padding for the background color |
| `engine.block.setFloat(block=_, property="backgroundColor/paddingRight", value=_)` | Set the right padding for the background color |
| `engine.block.setFloat(block=_, property="backgroundColor/paddingTop", value=_)` | Set the top padding for the background color |
| `engine.block.setFloat(block=_, property="backgroundColor/paddingBottom", value=_)` | Set the bottom padding for the background color |
| `engine.block.setFloat(block=_, property="backgroundColor/cornerRadius", value=_)` | Set the corner radius for the background color |

## Next Steps

- [Apply Colors](../colors/apply.md) — Work with RGB, CMYK, and spot colors
- [Fills Overview](../fills/overview.md) — Learn about all fill types in depth



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support