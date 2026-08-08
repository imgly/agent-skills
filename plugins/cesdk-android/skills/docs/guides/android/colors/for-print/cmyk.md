> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Colors](../../colors.md) > [For Print](../for-print.md) > [CMYK Colors](./cmyk.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-colors-for-print-cmyk/CMYKColors.kt reference-only
import ly.img.engine.CMYKColor
import ly.img.engine.Color
import ly.img.engine.ColorSpace
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GradientColorStop
import ly.img.engine.RGBAColor
import ly.img.engine.ShapeType

data class CMYKColors(
    val fillColor: CMYKColor,
    val tintedColor: CMYKColor,
    val strokeColor: CMYKColor,
    val shadowColor: CMYKColor,
    val readColor: CMYKColor,
    val convertedCmyk: CMYKColor,
    val convertedSrgb: RGBAColor,
    val gradientStops: List<GradientColorStop>,
)

fun cmykColors(engine: Engine): CMYKColors {
    // CMYK components (c, m, y, k) and tint all range from 0F to 1F.
    val cmykCyan = Color.fromCMYK(c = 1F, m = 0F, y = 0F, k = 0F, tint = 1F)
    val cmykMagenta = Color.fromCMYK(c = 0F, m = 1F, y = 0F, k = 0F, tint = 1F)
    val cmykYellow = Color.fromCMYK(c = 0F, m = 0F, y = 1F, k = 0F, tint = 1F)
    val cmykBlack = Color.fromCMYK(c = 0F, m = 0F, y = 0F, k = 1F, tint = 1F)

    val fillBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(fillBlock, shape = engine.block.createShape(ShapeType.Rect))

    val fill = engine.block.createFill(FillType.Color)
    engine.block.setFill(fillBlock, fill = fill)

    // Color fill values currently use the generic color property key.
    engine.block.setColor(fill, property = "fill/color/value", value = cmykCyan)

    // Tint scales the color intensity without changing the CMYK components.
    val cmykHalfMagenta = Color.fromCMYK(c = 0F, m = 1F, y = 0F, k = 0F, tint = 0.5F)
    val tintedBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(tintedBlock, shape = engine.block.createShape(ShapeType.Rect))
    val tintedFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(tintedBlock, fill = tintedFill)
    engine.block.setColor(tintedFill, property = "fill/color/value", value = cmykHalfMagenta)

    val strokeBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(strokeBlock, shape = engine.block.createShape(ShapeType.Rect))

    engine.block.setStrokeEnabled(strokeBlock, enabled = true)
    engine.block.setStrokeWidth(strokeBlock, width = 8F)

    val cmykStrokeColor = Color.fromCMYK(c = 0.8F, m = 0.2F, y = 0F, k = 0.1F, tint = 1F)
    engine.block.setStrokeColor(strokeBlock, color = cmykStrokeColor)

    val shadowBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(shadowBlock, shape = engine.block.createShape(ShapeType.Rect))

    engine.block.setDropShadowEnabled(shadowBlock, enabled = true)
    engine.block.setDropShadowOffsetX(shadowBlock, offsetX = 8F)
    engine.block.setDropShadowOffsetY(shadowBlock, offsetY = 8F)
    engine.block.setDropShadowBlurRadiusX(shadowBlock, blurRadiusX = 12F)
    engine.block.setDropShadowBlurRadiusY(shadowBlock, blurRadiusY = 12F)

    val cmykShadowColor = cmykBlack
    engine.block.setDropShadowColor(shadowBlock, color = cmykShadowColor)

    val readBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(readBlock, shape = engine.block.createShape(ShapeType.Rect))
    val readFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(readBlock, fill = readFill)
    val cmykOrange = Color.fromCMYK(c = 0F, m = 0.5F, y = 1F, k = 0F, tint = 1F)
    engine.block.setColor(readFill, property = "fill/color/value", value = cmykOrange)

    val retrievedColor = engine.block.getColor(readFill, property = "fill/color/value")
    val retrievedCmyk = when (retrievedColor) {
        is CMYKColor -> retrievedColor
        else -> error("Expected a CMYK color, got $retrievedColor")
    }
    println(
        "CMYK Color - C: ${retrievedCmyk.c}, M: ${retrievedCmyk.m}, " +
            "Y: ${retrievedCmyk.y}, K: ${retrievedCmyk.k}, Tint: ${retrievedCmyk.tint}",
    )

    val rgbBlue = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 1F)
    val convertedCmyk = engine.editor.convertColorToColorSpace(
        color = rgbBlue,
        colorSpace = ColorSpace.CMYK,
    )

    val cmykGreen = Color.fromCMYK(c = 0.7F, m = 0F, y = 1F, k = 0.2F, tint = 1F)
    val convertedSrgb = engine.editor.convertColorToColorSpace(
        color = cmykGreen,
        colorSpace = ColorSpace.SRGB,
    )

    val gradientBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(gradientBlock, shape = engine.block.createShape(ShapeType.Rect))

    val gradientFill = engine.block.createFill(FillType.LinearGradient)
    engine.block.setFill(gradientBlock, fill = gradientFill)

    val gradientStops = listOf(
        GradientColorStop(stop = 0F, color = cmykCyan),
        GradientColorStop(stop = 0.5F, color = cmykMagenta),
        GradientColorStop(stop = 1F, color = cmykYellow),
    )
    // Gradient fills currently expose their stops through the generic property key.
    engine.block.setGradientColorStops(
        gradientFill,
        property = "fill/gradient/colors",
        colorStops = gradientStops,
    )

    return CMYKColors(
        fillColor = engine.block.getColor(fill, property = "fill/color/value") as CMYKColor,
        tintedColor = engine.block.getColor(tintedFill, property = "fill/color/value") as CMYKColor,
        strokeColor = engine.block.getStrokeColor(strokeBlock) as CMYKColor,
        shadowColor = engine.block.getDropShadowColor(shadowBlock) as CMYKColor,
        readColor = retrievedCmyk,
        convertedCmyk = convertedCmyk as CMYKColor,
        convertedSrgb = convertedSrgb as RGBAColor,
        gradientStops = engine.block.getGradientColorStops(
            gradientFill,
            property = "fill/gradient/colors",
        ),
    )
}
```

Work with CMYK colors in CE.SDK for professional print production workflows with support for color space conversion and tint control.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260808/engine-guides-colors-for-print-cmyk)

<EngineReferenceNote {...props} />

CMYK (Cyan, Magenta, Yellow, Key/Black) is the standard color model for print production. Unlike sRGB, which is additive and designed for screens, CMYK uses subtractive color mixing to represent how inks combine on paper. Android represents CMYK values with `CMYKColor`, so the same color APIs can work with sRGB, CMYK, and spot colors.

This guide covers how to create CMYK colors, apply them to fills, strokes, and drop shadows, use the `tint` value, read colors back, convert between color spaces, and use CMYK in gradients.

## Understanding CMYK Colors

### When to Use CMYK

Use CMYK colors when preparing designs for print workflows or when a print service provider gives you CMYK values. Screen previews convert CMYK to sRGB for display, so use proofing from your production print workflow when exact output appearance matters.

A CMYK color in CE.SDK has five properties:

- `c` (Cyan): `0F` to `1F`
- `m` (Magenta): `0F` to `1F`
- `y` (Yellow): `0F` to `1F`
- `k` (Key/Black): `0F` to `1F`
- `tint`: `0F` to `1F` (controls overall color intensity)

## Creating CMYK Colors

Create a CMYK color with `Color.fromCMYK()`. Every component ranges from `0F` to `1F`.

```kotlin highlight-android-create-cmyk
// CMYK components (c, m, y, k) and tint all range from 0F to 1F.
val cmykCyan = Color.fromCMYK(c = 1F, m = 0F, y = 0F, k = 0F, tint = 1F)
val cmykMagenta = Color.fromCMYK(c = 0F, m = 1F, y = 0F, k = 0F, tint = 1F)
val cmykYellow = Color.fromCMYK(c = 0F, m = 0F, y = 1F, k = 0F, tint = 1F)
val cmykBlack = Color.fromCMYK(c = 0F, m = 0F, y = 0F, k = 1F, tint = 1F)
```

## Applying CMYK Colors to Fills

Apply a CMYK color to a color fill with `engine.block.setColor()` on the fill's `"fill/color/value"` property. Create the fill with `FillType.Color`, assign it to a block, then set the CMYK value.

```kotlin highlight-android-apply-fill
    val fillBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(fillBlock, shape = engine.block.createShape(ShapeType.Rect))

    val fill = engine.block.createFill(FillType.Color)
    engine.block.setFill(fillBlock, fill = fill)

    // Color fill values currently use the generic color property key.
    engine.block.setColor(fill, property = "fill/color/value", value = cmykCyan)
```

The same `setColor()` method accepts `RGBAColor`, `CMYKColor`, and `SpotColor` values, so you do not need a separate code path for each color space.

## Using the Tint Property

The `tint` value scales the color's intensity without changing its CMYK components. A tint of `1F` applies the full color; `0.5F` scales it down.

```kotlin highlight-android-tint
// Tint scales the color intensity without changing the CMYK components.
val cmykHalfMagenta = Color.fromCMYK(c = 0F, m = 1F, y = 0F, k = 0F, tint = 0.5F)
val tintedBlock = engine.block.create(DesignBlockType.Graphic)
engine.block.setShape(tintedBlock, shape = engine.block.createShape(ShapeType.Rect))
val tintedFill = engine.block.createFill(FillType.Color)
engine.block.setFill(tintedBlock, fill = tintedFill)
engine.block.setColor(tintedFill, property = "fill/color/value", value = cmykHalfMagenta)
```

> **Note:** On Android, screen conversion applies tint by blending the CMYK color toward
> white and returns an opaque sRGB preview. Android PDF export currently writes
> DeviceRGB output because `ExportOptions` does not expose
> `exportPdfWithDeviceCMYK`.

## Applying CMYK to Strokes

Enable the stroke and set its width, then assign a CMYK color with `engine.block.setStrokeColor()`.

```kotlin highlight-android-stroke
    val strokeBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(strokeBlock, shape = engine.block.createShape(ShapeType.Rect))

    engine.block.setStrokeEnabled(strokeBlock, enabled = true)
    engine.block.setStrokeWidth(strokeBlock, width = 8F)

    val cmykStrokeColor = Color.fromCMYK(c = 0.8F, m = 0.2F, y = 0F, k = 0.1F, tint = 1F)
    engine.block.setStrokeColor(strokeBlock, color = cmykStrokeColor)
```

## Applying CMYK to Drop Shadows

Enable the drop shadow, configure its offset and blur radius, then assign a CMYK color with `engine.block.setDropShadowColor()`.

```kotlin highlight-android-shadow
    val shadowBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(shadowBlock, shape = engine.block.createShape(ShapeType.Rect))

    engine.block.setDropShadowEnabled(shadowBlock, enabled = true)
    engine.block.setDropShadowOffsetX(shadowBlock, offsetX = 8F)
    engine.block.setDropShadowOffsetY(shadowBlock, offsetY = 8F)
    engine.block.setDropShadowBlurRadiusX(shadowBlock, blurRadiusX = 12F)
    engine.block.setDropShadowBlurRadiusY(shadowBlock, blurRadiusY = 12F)

    val cmykShadowColor = cmykBlack
    engine.block.setDropShadowColor(shadowBlock, color = cmykShadowColor)
```

## Reading CMYK Colors

`engine.block.getColor()` returns the shared `Color` type. Use Kotlin type checking to handle `CMYKColor` values and read their components.

```kotlin highlight-android-read
    val readBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(readBlock, shape = engine.block.createShape(ShapeType.Rect))
    val readFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(readBlock, fill = readFill)
    val cmykOrange = Color.fromCMYK(c = 0F, m = 0.5F, y = 1F, k = 0F, tint = 1F)
    engine.block.setColor(readFill, property = "fill/color/value", value = cmykOrange)

    val retrievedColor = engine.block.getColor(readFill, property = "fill/color/value")
    val retrievedCmyk = when (retrievedColor) {
        is CMYKColor -> retrievedColor
        else -> error("Expected a CMYK color, got $retrievedColor")
    }
    println(
        "CMYK Color - C: ${retrievedCmyk.c}, M: ${retrievedCmyk.m}, " +
            "Y: ${retrievedCmyk.y}, K: ${retrievedCmyk.k}, Tint: ${retrievedCmyk.tint}",
    )
```

## Converting Between Color Spaces

Use `engine.editor.convertColorToColorSpace()` with `ColorSpace.CMYK` or `ColorSpace.SRGB` to convert between color spaces.

```kotlin highlight-android-convert
    val rgbBlue = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 1F)
    val convertedCmyk = engine.editor.convertColorToColorSpace(
        color = rgbBlue,
        colorSpace = ColorSpace.CMYK,
    )

    val cmykGreen = Color.fromCMYK(c = 0.7F, m = 0F, y = 1F, k = 0.2F, tint = 1F)
    val convertedSrgb = engine.editor.convertColorToColorSpace(
        color = cmykGreen,
        colorSpace = ColorSpace.SRGB,
    )
```

Conversions may not be perfectly reversible because sRGB and CMYK have different gamuts. Some sRGB colors cannot be represented exactly in CMYK and vice versa.

## Using CMYK in Gradients

CMYK colors work in gradient color stops. Create a linear gradient fill and pass `GradientColorStop` values whose `color` is a CMYK color.

```kotlin highlight-android-gradient
    val gradientBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(gradientBlock, shape = engine.block.createShape(ShapeType.Rect))

    val gradientFill = engine.block.createFill(FillType.LinearGradient)
    engine.block.setFill(gradientBlock, fill = gradientFill)

    val gradientStops = listOf(
        GradientColorStop(stop = 0F, color = cmykCyan),
        GradientColorStop(stop = 0.5F, color = cmykMagenta),
        GradientColorStop(stop = 1F, color = cmykYellow),
    )
    // Gradient fills currently expose their stops through the generic property key.
    engine.block.setGradientColorStops(
        gradientFill,
        property = "fill/gradient/colors",
        colorStops = gradientStops,
    )
```

## Troubleshooting

### Colors Look Different on Screen vs. Print

Screen previews convert CMYK to sRGB using a standard conversion. Android PDF export currently writes DeviceRGB output, so use calibrated proofing from your print workflow when exact print appearance matters.

### Tint Not Having the Expected Effect

The `tint` value must be between `0F` and `1F`. On Android, values below `1F` do not lower alpha; the sRGB preview blends the color toward white and stays opaque.

## API Reference

| Method | Description |
|--------|-------------|
| `Color.fromCMYK(c=_, m=_, y=_, k=_, tint=_)` | Create a CMYK color with normalized components and tint. |
| `engine.block.setColor(block=_, property="fill/color/value", value=_)` | Set a color property on a fill. Accepts any `Color` type. |
| `engine.block.getColor(block=_, property="fill/color/value")` | Get the current color value from a property. Returns `Color`. |
| `engine.editor.convertColorToColorSpace(color=_, colorSpace=_)` | Convert a color between `ColorSpace.SRGB` and `ColorSpace.CMYK`. |
| `engine.block.createFill(fillType=_)` | Create a fill. Use `FillType.Color` for solid fills or `FillType.LinearGradient`, `FillType.RadialGradient`, or `FillType.ConicalGradient` for gradients. |
| `engine.block.setFill(block=_, fill=_)` | Assign a fill to a block. |
| `engine.block.setStrokeColor(block=_, color=_)` | Set the stroke color on a block. |
| `engine.block.setDropShadowColor(block=_, color=_)` | Set the drop shadow color on a block. |
| `engine.block.setGradientColorStops(block=_, property="fill/gradient/colors", colorStops=_)` | Set color stops on a gradient fill. |

| Type | Description |
|------|-------------|
| `CMYKColor` | CMYK color for print workflows. Components and tint range from `0F` to `1F`. |
| `ColorSpace.CMYK` / `ColorSpace.SRGB` | Target color space for `convertColorToColorSpace()`. |
| `GradientColorStop` | Gradient stop with a `color: Color` and a `stop: Float` position. |

## Next Steps

- [Spot Colors](./spot.md) - Work with named spot colors for brand consistency and specialized printing
- [Color Conversion](../conversion.md) - Convert colors between sRGB, CMYK, and spot color spaces
- [Apply Colors](../apply.md) - Apply colors to design elements programmatically



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support