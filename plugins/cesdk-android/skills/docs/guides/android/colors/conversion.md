> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Color Conversion](./conversion.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-colors-conversion/ColorConversion.kt reference-only
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.CMYKColor
import ly.img.engine.Color
import ly.img.engine.ColorSpace
import ly.img.engine.Engine
import ly.img.engine.RGBAColor
import ly.img.engine.SpotColor

suspend fun colorConversion(engine: Engine): ColorConversionResult = withContext(Dispatchers.Main) {
    // Define a spot color with an RGB approximation for screen preview.
    engine.editor.setSpotColor(
        name = "Brand Red",
        color = Color.fromRGBA(r = 0.95F, g = 0.25F, b = 0.21F, a = 1F),
    )

    val srgbColor = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 1F)
    val cmykColor = Color.fromCMYK(c = 0F, m = 0.8F, y = 0.95F, k = 0F, tint = 1F)
    val spotColor = Color.fromSpotColor(
        name = "Brand Red",
        tint = 1F,
        externalReference = "",
    )

    val cmykToSrgb = engine.editor.convertColorToColorSpace(
        color = cmykColor,
        colorSpace = ColorSpace.SRGB,
    ) as RGBAColor

    val spotToSrgb = engine.editor.convertColorToColorSpace(
        color = spotColor,
        colorSpace = ColorSpace.SRGB,
    ) as RGBAColor

    println("CMYK converted to sRGB: $cmykToSrgb")
    println("Spot color converted to sRGB: $spotToSrgb")

    val srgbToCmyk = engine.editor.convertColorToColorSpace(
        color = srgbColor,
        colorSpace = ColorSpace.CMYK,
    ) as CMYKColor

    // Add a CMYK approximation before converting the spot color for print output.
    engine.editor.setSpotColor(
        name = "Brand Red",
        color = Color.fromCMYK(c = 0F, m = 0.85F, y = 0.9F, k = 0.05F, tint = 1F),
    )
    val spotToCmyk = engine.editor.convertColorToColorSpace(
        color = spotColor,
        colorSpace = ColorSpace.CMYK,
    ) as CMYKColor

    println("sRGB converted to CMYK: $srgbToCmyk")
    println("Spot color converted to CMYK: $spotToCmyk")

    val detectedTypes = listOf(srgbColor, cmykColor, spotColor).map { color ->
        when (color) {
            is RGBAColor -> "sRGB"
            is CMYKColor -> "CMYK"
            is SpotColor -> "SpotColor"
        }
    }

    val transparentSrgb = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 0.5F)
    val transparentSrgbToCmyk = engine.editor.convertColorToColorSpace(
        color = transparentSrgb,
        colorSpace = ColorSpace.CMYK,
    ) as CMYKColor

    val tintedCmyk = Color.fromCMYK(c = 0F, m = 0.8F, y = 0.95F, k = 0F, tint = 0.5F)
    val tintedCmykPreview = engine.editor.convertColorToColorSpace(
        color = tintedCmyk,
        colorSpace = ColorSpace.SRGB,
    ) as RGBAColor

    val tintedSpotColor = Color.fromSpotColor(
        name = "Brand Red",
        tint = 0.4F,
        externalReference = "",
    )
    val tintedSpotPreview = engine.editor.convertColorToColorSpace(
        color = tintedSpotColor,
        colorSpace = ColorSpace.SRGB,
    ) as RGBAColor
    val tintedSpotToCmyk = engine.editor.convertColorToColorSpace(
        color = tintedSpotColor,
        colorSpace = ColorSpace.CMYK,
    ) as CMYKColor

    val colorFromDesign: Color = spotColor
    val pickerPreviewColor = engine.editor.convertColorToColorSpace(
        color = colorFromDesign,
        colorSpace = ColorSpace.SRGB,
    ) as RGBAColor
    // Display pickerPreviewColor.r, pickerPreviewColor.g, pickerPreviewColor.b, and pickerPreviewColor.a.

    val colorForExport: Color = srgbColor
    val printColor = if (colorForExport is CMYKColor) {
        colorForExport
    } else {
        engine.editor.convertColorToColorSpace(
            color = colorForExport,
            colorSpace = ColorSpace.CMYK,
        ) as CMYKColor
    }

    ColorConversionResult(
        cmykToSrgb = cmykToSrgb,
        spotToSrgb = spotToSrgb,
        srgbToCmyk = srgbToCmyk,
        spotToCmyk = spotToCmyk,
        transparentSrgbToCmyk = transparentSrgbToCmyk,
        tintedCmykPreview = tintedCmykPreview,
        tintedSpotPreview = tintedSpotPreview,
        tintedSpotToCmyk = tintedSpotToCmyk,
        detectedTypes = detectedTypes,
        pickerPreviewColor = pickerPreviewColor,
        printColor = printColor,
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-colors-conversion/ColorConversionResult.kt reference-only
import ly.img.engine.CMYKColor
import ly.img.engine.RGBAColor

data class ColorConversionResult(
    val cmykToSrgb: RGBAColor,
    val spotToSrgb: RGBAColor,
    val srgbToCmyk: CMYKColor,
    val spotToCmyk: CMYKColor,
    val transparentSrgbToCmyk: CMYKColor,
    val tintedCmykPreview: RGBAColor,
    val tintedSpotPreview: RGBAColor,
    val tintedSpotToCmyk: CMYKColor,
    val detectedTypes: List<String>,
    val pickerPreviewColor: RGBAColor,
    val printColor: CMYKColor,
)
```

Convert colors between sRGB, CMYK, and spot color spaces programmatically in CE.SDK.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260824/engine-guides-colors-conversion)

<EngineReferenceNote {...props} />

CE.SDK supports sRGB, CMYK, and SpotColor values. Color conversion is a programmatic Engine API on Android, so use it when you build custom color interfaces, show print values, or prepare colors before export.

This guide covers converting colors to sRGB and CMYK, converting spot colors through their approximations, identifying Android color types, and checking how alpha and tint values are preserved.

## Supported Color Spaces

CE.SDK works with these Android color value types:

| Color Space | Android Type | Use Case |
| --- | --- | --- |
| **sRGB** | `RGBAColor` with `r`, `g`, `b`, `a` components from `0.0` to `1.0` | Screen display and previews |
| **CMYK** | `CMYKColor` with `c`, `m`, `y`, `k`, `tint` components from `0.0` to `1.0` | Print workflows |
| **SpotColor** | `SpotColor` with `name`, `tint`, and `externalReference` | Specialized printing with named inks |

Use `ColorSpace.SRGB` or `ColorSpace.CMYK` as conversion targets. A `SpotColor` can be converted by using the RGB or CMYK approximation registered for its name.

## Setting Up Colors

Before converting a spot color, register an approximation for the spot color name. Android uses the overloaded `setSpotColor(...)` API for both RGB and CMYK approximations.

```kotlin highlight-android-define-spot-color
// Define a spot color with an RGB approximation for screen preview.
engine.editor.setSpotColor(
    name = "Brand Red",
    color = Color.fromRGBA(r = 0.95F, g = 0.25F, b = 0.21F, a = 1F),
)
```

Create color values with the Android `Color` factory methods. The sample uses the same sRGB, CMYK, and spot color values throughout the conversion steps.

```kotlin highlight-android-create-colors
val srgbColor = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 1F)
val cmykColor = Color.fromCMYK(c = 0F, m = 0.8F, y = 0.95F, k = 0F, tint = 1F)
val spotColor = Color.fromSpotColor(
    name = "Brand Red",
    tint = 1F,
    externalReference = "",
)
```

## Converting to sRGB

Use `engine.editor.convertColorToColorSpace(color, ColorSpace.SRGB)` when you need screen-display values. The returned value is a `Color`, so cast it to `RGBAColor` after converting to sRGB.

```kotlin highlight-android-convert-to-srgb
    val cmykToSrgb = engine.editor.convertColorToColorSpace(
        color = cmykColor,
        colorSpace = ColorSpace.SRGB,
    ) as RGBAColor

    val spotToSrgb = engine.editor.convertColorToColorSpace(
        color = spotColor,
        colorSpace = ColorSpace.SRGB,
    ) as RGBAColor

    println("CMYK converted to sRGB: $cmykToSrgb")
    println("Spot color converted to sRGB: $spotToSrgb")
```

CMYK colors convert to `RGBAColor` components. Spot colors use the registered RGB approximation for their spot color name. When the source color has a tint below `1.0`, the returned sRGB color keeps `a = 1.0` and blends its RGB components toward white.

## Converting to CMYK

Use `engine.editor.convertColorToColorSpace(color, ColorSpace.CMYK)` when a print workflow needs CMYK components. For spot colors, register a CMYK approximation before converting to CMYK.

```kotlin highlight-android-convert-to-cmyk
    val srgbToCmyk = engine.editor.convertColorToColorSpace(
        color = srgbColor,
        colorSpace = ColorSpace.CMYK,
    ) as CMYKColor

    // Add a CMYK approximation before converting the spot color for print output.
    engine.editor.setSpotColor(
        name = "Brand Red",
        color = Color.fromCMYK(c = 0F, m = 0.85F, y = 0.9F, k = 0.05F, tint = 1F),
    )
    val spotToCmyk = engine.editor.convertColorToColorSpace(
        color = spotColor,
        colorSpace = ColorSpace.CMYK,
    ) as CMYKColor

    println("sRGB converted to CMYK: $srgbToCmyk")
    println("Spot color converted to CMYK: $spotToCmyk")
```

> **Note:** Color space conversions may not be perfectly reversible. Some sRGB colors cannot be represented exactly in CMYK because the color gamuts differ.

## Identifying Color Types

Android exposes color values as a sealed `Color` hierarchy. Use Kotlin type checks before reading type-specific properties.

```kotlin highlight-android-identify-types
val detectedTypes = listOf(srgbColor, cmykColor, spotColor).map { color ->
    when (color) {
        is RGBAColor -> "sRGB"
        is CMYKColor -> "CMYK"
        is SpotColor -> "SpotColor"
    }
}
```

This lets you branch on `RGBAColor`, `CMYKColor`, and `SpotColor` before reading their component properties.

## Handling Tint and Alpha

On Android, alpha and tint are not simply copied between target fields. Non-black sRGB colors convert to CMYK with `tint = 1.0` even if the source has alpha, while pure black sRGB uses the source alpha as the CMYK tint. Tinted CMYK and spot colors convert to full-opacity sRGB previews, but their RGB components are blended toward white based on the tint. For example, pure CMYK red with `tint = 0.5` converts to a pink preview with `r = 1.0`, `g = 0.5`, `b = 0.5`, and `a = 1.0`.

| Source | Target | Transformation |
| --- | --- | --- |
| sRGB alpha (non-black) | CMYK | The converted CMYK color uses `tint = 1.0` |
| sRGB alpha (pure black) | CMYK | The converted CMYK color uses `tint = source alpha` |
| CMYK tint | sRGB | RGB components blend toward white and `a = 1.0` |
| SpotColor tint | sRGB | RGB components blend toward white and `a = 1.0` |
| SpotColor tint | CMYK | The converted CMYK color uses `tint = source tint` |

The sample below uses a non-black transparent sRGB color, so its converted CMYK color keeps `tint = 1.0`.

```kotlin highlight-android-handle-tint-alpha
    val transparentSrgb = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 0.5F)
    val transparentSrgbToCmyk = engine.editor.convertColorToColorSpace(
        color = transparentSrgb,
        colorSpace = ColorSpace.CMYK,
    ) as CMYKColor

    val tintedCmyk = Color.fromCMYK(c = 0F, m = 0.8F, y = 0.95F, k = 0F, tint = 0.5F)
    val tintedCmykPreview = engine.editor.convertColorToColorSpace(
        color = tintedCmyk,
        colorSpace = ColorSpace.SRGB,
    ) as RGBAColor

    val tintedSpotColor = Color.fromSpotColor(
        name = "Brand Red",
        tint = 0.4F,
        externalReference = "",
    )
    val tintedSpotPreview = engine.editor.convertColorToColorSpace(
        color = tintedSpotColor,
        colorSpace = ColorSpace.SRGB,
    ) as RGBAColor
    val tintedSpotToCmyk = engine.editor.convertColorToColorSpace(
        color = tintedSpotColor,
        colorSpace = ColorSpace.CMYK,
    ) as CMYKColor
```

## Practical Use Cases

### Building a Color Picker

When a custom color picker needs screen preview values, convert the design color to sRGB and display the returned `RGBAColor` components.

```kotlin highlight-android-color-picker
val colorFromDesign: Color = spotColor
val pickerPreviewColor = engine.editor.convertColorToColorSpace(
    color = colorFromDesign,
    colorSpace = ColorSpace.SRGB,
) as RGBAColor
// Display pickerPreviewColor.r, pickerPreviewColor.g, pickerPreviewColor.b, and pickerPreviewColor.a.
```

### Export Preparation

Before a print-oriented export, check whether the color is already CMYK. Convert non-CMYK colors to `ColorSpace.CMYK` before showing or storing print values.

```kotlin highlight-android-print-preparation
val colorForExport: Color = srgbColor
val printColor = if (colorForExport is CMYKColor) {
    colorForExport
} else {
    engine.editor.convertColorToColorSpace(
        color = colorForExport,
        colorSpace = ColorSpace.CMYK,
    ) as CMYKColor
}
```

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Spot color converts to an unexpected value | The spot color has no approximation for the target color space | Call `setSpotColor(...)` with an `RGBAColor` or `CMYKColor` before conversion |
| Colors differ after round-tripping | Color conversion is not always lossless | Avoid assuming that converting sRGB to CMYK and back returns the exact original value |
| Type-specific properties are unavailable | `convertColorToColorSpace(...)` returns the base `Color` type | Cast after converting, or check the type with Kotlin `is` checks |

## API Reference

| API | Purpose |
| --- | --- |
| `engine.editor.convertColorToColorSpace(color=_, colorSpace=_)` | Converts a color to `ColorSpace.SRGB` or `ColorSpace.CMYK` |
| `engine.editor.setSpotColor(name=_, color=Color.fromRGBA(r=_, g=_, b=_, a=_))` | Defines or updates an RGB approximation for a spot color |
| `engine.editor.setSpotColor(name=_, color=Color.fromCMYK(c=_, m=_, y=_, k=_, tint=_))` | Defines or updates a CMYK approximation for a spot color |
| `Color.fromRGBA(r=_, g=_, b=_, a=_)` | Creates an sRGB color value |
| `Color.fromCMYK(c=_, m=_, y=_, k=_, tint=_)` | Creates a CMYK color value |
| `Color.fromSpotColor(name=_, tint=_, externalReference=_)` | Creates a spot color reference that uses the registered approximation for its name |



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support