> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Apply Colors](./apply.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-colors/Colors.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.CMYKColor
import ly.img.engine.Color
import ly.img.engine.ColorSpace
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.RGBAColor
import ly.img.engine.ShapeType

fun colors(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)

    try {
        val scene = engine.scene.create()

        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(page, value = 800F)
        engine.block.setHeight(page, value = 600F)
        engine.block.appendChild(parent = scene, child = page)

        val block = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(block, value = 350F)
        engine.block.setPositionY(block, value = 400F)
        engine.block.setWidth(block, value = 100F)
        engine.block.setHeight(block, value = 100F)
        engine.block.appendChild(parent = page, child = block)

        val fill = engine.block.createFill(FillType.Color)
        engine.block.setFill(block, fill = fill)

        val rgbaBlue = Color.fromRGBA(r = 0F, g = 0F, b = 1F, a = 1F)
        val cmykRed = Color.fromCMYK(c = 0F, m = 1F, y = 1F, k = 0F, tint = 1F)
        val cmykPartialRed = Color.fromCMYK(c = 0F, m = 1F, y = 1F, k = 0F, tint = 0.5F)

        val spotPinkFlamingo = Color.fromSpotColor(
            name = "Pink-Flamingo",
            tint = 1F,
            externalReference = "Brand-Colors",
        )
        val spotPartialYellow = Color.fromSpotColor(name = "Yellow", tint = 0.3F)

        engine.editor.setSpotColor(
            name = "Pink-Flamingo",
            Color.fromRGBA(r = 0.988F, g = 0.455F, b = 0.992F),
        )
        engine.editor.setSpotColor(name = "Yellow", Color.fromCMYK(c = 0F, m = 0F, y = 1F, k = 0F))

        val colorFill = engine.block.getFill(block)
        // Fill colors use the generic color property path for RGB, CMYK, and spot colors.
        engine.block.setColor(
            colorFill,
            property = "fill/color/value",
            value = rgbaBlue,
        )
        engine.block.setColor(
            colorFill,
            property = "fill/color/value",
            value = cmykRed,
        )
        engine.block.setColor(
            colorFill,
            property = "fill/color/value",
            value = spotPinkFlamingo,
        )
        val currentFillColor = engine.block.getColor(
            colorFill,
            property = "fill/color/value",
        )

        check(currentFillColor == spotPinkFlamingo)

        engine.block.setStrokeEnabled(block, enabled = true)
        engine.block.setStrokeWidth(block, width = 8F)
        engine.block.setStrokeColor(block, color = cmykPartialRed)
        val currentStrokeColor = engine.block.getStrokeColor(block)

        check(currentStrokeColor == cmykPartialRed)

        engine.block.setDropShadowEnabled(block, enabled = true)
        engine.block.setDropShadowOffsetX(block, offsetX = 12F)
        engine.block.setDropShadowOffsetY(block, offsetY = 12F)
        engine.block.setDropShadowColor(block, color = spotPartialYellow)
        val currentShadowColor = engine.block.getDropShadowColor(block)

        check(currentShadowColor == spotPartialYellow)

        val cmykBlueConverted = engine.editor.convertColorToColorSpace(
            color = rgbaBlue,
            colorSpace = ColorSpace.CMYK,
        )
        val rgbaPinkFlamingoConverted = engine.editor.convertColorToColorSpace(
            color = spotPinkFlamingo,
            colorSpace = ColorSpace.SRGB,
        )

        check(cmykBlueConverted is CMYKColor)
        check(rgbaPinkFlamingoConverted is RGBAColor)

        val definedSpotColors = engine.editor.findAllSpotColors()

        check("Pink-Flamingo" in definedSpotColors)
        check("Yellow" in definedSpotColors)

        engine.editor.setSpotColor("Yellow", Color.fromCMYK(c = 0.2F, m = 0F, y = 1F, k = 0F))
        val updatedYellow = engine.editor.getSpotColorCMYK("Yellow")

        check(updatedYellow.c == 0.2F)

        engine.editor.removeSpotColor("Yellow")

        check("Yellow" !in engine.editor.findAllSpotColors())
    } finally {
        engine.stop()
    }
}
```

Apply solid colors to design elements like shapes, text, and backgrounds using
CE.SDK's Android Engine API.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-colors)

<EngineReferenceNote {...props} />

Colors in CE.SDK are applied to block properties like fill, stroke, and shadow. The Android Engine API supports sRGB for screen display, CMYK for print production, and spot colors for specialized printing workflows.

This guide covers how to create Android color objects, apply them to fill, stroke, and shadow properties, manage spot color definitions, and convert colors to sRGB or CMYK.

## Create Color Objects

CE.SDK represents each color space with a dedicated Android color type. Create RGB, CMYK, and spot color values that match the target output.

```kotlin highlight-android-create-colors
        val rgbaBlue = Color.fromRGBA(r = 0F, g = 0F, b = 1F, a = 1F)
        val cmykRed = Color.fromCMYK(c = 0F, m = 1F, y = 1F, k = 0F, tint = 1F)
        val cmykPartialRed = Color.fromCMYK(c = 0F, m = 1F, y = 1F, k = 0F, tint = 0.5F)

        val spotPinkFlamingo = Color.fromSpotColor(
            name = "Pink-Flamingo",
            tint = 1F,
            externalReference = "Brand-Colors",
        )
        val spotPartialYellow = Color.fromSpotColor(name = "Yellow", tint = 0.3F)
```

RGB colors use red, green, blue, and alpha values from `0.0` to `1.0`. CMYK colors use cyan, magenta, yellow, black, and tint values from `0.0` to `1.0`. Spot colors reference a named spot color definition and can include an external reference for the color source.

## Define Spot Colors

Before applying a spot color, define its screen preview approximation. The engine needs this approximation because spot colors represent inks that cannot be rendered directly on screen.

```kotlin highlight-android-define-spot
engine.editor.setSpotColor(
    name = "Pink-Flamingo",
    Color.fromRGBA(r = 0.988F, g = 0.455F, b = 0.992F),
)
engine.editor.setSpotColor(name = "Yellow", Color.fromCMYK(c = 0F, m = 0F, y = 1F, k = 0F))
```

Use `engine.editor.setSpotColor()` with either `Color.fromRGBA()` or `Color.fromCMYK()` to define the approximation. Reuse the same name to update an existing spot color definition.

## Apply Fill Colors

To set a block's fill color, get the fill block with `engine.block.getFill()`, then set `"fill/color/value"` on that fill block.

```kotlin highlight-android-apply-fill
val colorFill = engine.block.getFill(block)
// Fill colors use the generic color property path for RGB, CMYK, and spot colors.
engine.block.setColor(
    colorFill,
    property = "fill/color/value",
    value = rgbaBlue,
)
engine.block.setColor(
    colorFill,
    property = "fill/color/value",
    value = cmykRed,
)
engine.block.setColor(
    colorFill,
    property = "fill/color/value",
    value = spotPinkFlamingo,
)
val currentFillColor = engine.block.getColor(
    colorFill,
    property = "fill/color/value",
)
```

The fill is a separate block from the graphic block. Use `engine.block.getColor()` with the same property path when you need to read the current fill color.

## Apply Stroke Colors

Stroke colors are applied directly to the design block. Enable the stroke first, set its width, and then set the stroke color.

```kotlin highlight-android-apply-stroke
engine.block.setStrokeEnabled(block, enabled = true)
engine.block.setStrokeWidth(block, width = 8F)
engine.block.setStrokeColor(block, color = cmykPartialRed)
val currentStrokeColor = engine.block.getStrokeColor(block)
```

The Android API exposes typed helpers for stroke color, so this path does not need a raw property string.

## Apply Shadow Colors

Drop shadow colors are also applied directly to the design block. Enable the shadow and configure its offset before setting the color.

```kotlin highlight-android-apply-shadow
engine.block.setDropShadowEnabled(block, enabled = true)
engine.block.setDropShadowOffsetX(block, offsetX = 12F)
engine.block.setDropShadowOffsetY(block, offsetY = 12F)
engine.block.setDropShadowColor(block, color = spotPartialYellow)
val currentShadowColor = engine.block.getDropShadowColor(block)
```

Spot colors work with shadows the same way they work with fills and strokes.

## Convert Between Color Spaces

Use `engine.editor.convertColorToColorSpace()` when you need a color value in sRGB or CMYK.

```kotlin highlight-android-convert-color
val cmykBlueConverted = engine.editor.convertColorToColorSpace(
    color = rgbaBlue,
    colorSpace = ColorSpace.CMYK,
)
val rgbaPinkFlamingoConverted = engine.editor.convertColorToColorSpace(
    color = spotPinkFlamingo,
    colorSpace = ColorSpace.SRGB,
)
```

Pass the source color and either `ColorSpace.SRGB` or `ColorSpace.CMYK` as the target. `ColorSpace.SPOT_COLOR` is not a valid conversion target. Spot colors can still be source colors; the engine converts them from their registered approximation to sRGB or CMYK. Color conversions are approximations because RGB, CMYK, and spot colors use different color models and may not represent the same colors exactly. Some vibrant sRGB colors may appear muted when converted to CMYK.

## List Defined Spot Colors

Query all spot colors currently registered in the engine with `engine.editor.findAllSpotColors()`.

```kotlin highlight-android-list-spot
val definedSpotColors = engine.editor.findAllSpotColors()
```

The returned list contains the spot color names defined through `engine.editor.setSpotColor()`.

## Update Spot Color Definitions

Redefine a spot color by calling `engine.editor.setSpotColor()` with the same name and a new approximation.

```kotlin highlight-android-update-spot
engine.editor.setSpotColor("Yellow", Color.fromCMYK(c = 0.2F, m = 0F, y = 1F, k = 0F))
val updatedYellow = engine.editor.getSpotColorCMYK("Yellow")
```

Blocks that reference that spot color use the updated approximation the next time they render.

## Remove Spot Color Definitions

Remove a spot color definition with `engine.editor.removeSpotColor()`.

```kotlin highlight-android-remove-spot
engine.editor.removeSpotColor("Yellow")
```

Blocks that still reference the removed spot color fall back to the default magenta approximation.

## Troubleshooting

### Spot Color Appears Magenta

The spot color was not defined before use. Call `engine.editor.setSpotColor()` with the exact spot color name before applying it to blocks.

### Stroke or Shadow Color Is Not Visible

The effect is not enabled. Call `engine.block.setStrokeEnabled(block, true)` or `engine.block.setDropShadowEnabled(block, true)` before setting the color.

### Color Looks Different After Conversion

Color space conversions are approximations. CMYK has a smaller gamut than sRGB, so vibrant colors can appear muted after conversion.

### Fill Color Does Not Change

Apply colors to the fill block returned by `engine.block.getFill()`, not to the parent design block.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.setColor(block=_, property="fill/color/value", value=_)` | Set a fill color that can preserve RGB, CMYK, or spot color values |
| `engine.block.getColor(block=_, property="fill/color/value")` | Read a color property from a fill block |
| `engine.block.getFill(block=_)` | Get the fill block of a design block |
| `engine.block.setStrokeEnabled(block=_, enabled=_)` | Enable or disable stroke on a design block |
| `engine.block.setStrokeWidth(block=_, width=_)` | Set the stroke width |
| `engine.block.setStrokeColor(block=_, color=_)` | Set the stroke color |
| `engine.block.getStrokeColor(block=_)` | Read the stroke color |
| `engine.block.setDropShadowEnabled(block=_, enabled=_)` | Enable or disable the drop shadow |
| `engine.block.setDropShadowOffsetX(block=_, offsetX=_)` | Set the drop shadow x offset |
| `engine.block.setDropShadowOffsetY(block=_, offsetY=_)` | Set the drop shadow y offset |
| `engine.block.setDropShadowColor(block=_, color=_)` | Set the drop shadow color |
| `engine.block.getDropShadowColor(block=_)` | Read the drop shadow color |
| `engine.editor.setSpotColor(name=_, color=_)` | Define or update a spot color approximation |
| `engine.editor.findAllSpotColors()` | List all defined spot color names |
| `engine.editor.getSpotColorCMYK(name=_)` | Read a spot color's CMYK approximation |
| `engine.editor.removeSpotColor(name=_)` | Remove a spot color definition |
| `engine.editor.convertColorToColorSpace(color=_, colorSpace=_)` | Convert a color to `ColorSpace.SRGB` or `ColorSpace.CMYK`; `ColorSpace.SPOT_COLOR` is not supported as a target |



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support