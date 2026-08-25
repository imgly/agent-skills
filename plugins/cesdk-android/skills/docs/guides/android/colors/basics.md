> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Color Basics](./basics.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-colors-basics/ColorsBasics.kt reference-only
import android.util.Log
import ly.img.engine.CMYKColor
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.RGBAColor
import ly.img.engine.ShapeType
import ly.img.engine.SpotColor

private const val TAG = "ColorsBasics"

suspend fun colorsBasics(engine: Engine) {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val srgbBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(srgbBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(srgbBlock, value = 80F)
    engine.block.setPositionY(srgbBlock, value = 120F)
    engine.block.setWidth(srgbBlock, value = 160F)
    engine.block.setHeight(srgbBlock, value = 160F)

    val srgbFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(srgbBlock, fill = srgbFill)
    engine.block.appendChild(parent = page, child = srgbBlock)

    val srgbColor = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 1F)
    engine.block.setColor(srgbFill, property = "fill/color/value", value = srgbColor)
    check(engine.block.getColor(srgbFill, property = "fill/color/value") == srgbColor)

    val cmykBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(cmykBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(cmykBlock, value = 320F)
    engine.block.setPositionY(cmykBlock, value = 120F)
    engine.block.setWidth(cmykBlock, value = 160F)
    engine.block.setHeight(cmykBlock, value = 160F)

    val cmykFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(cmykBlock, fill = cmykFill)
    engine.block.appendChild(parent = page, child = cmykBlock)

    val cmykColor = Color.fromCMYK(c = 0F, m = 0.8F, y = 0.95F, k = 0F, tint = 1F)
    engine.block.setColor(cmykFill, property = "fill/color/value", value = cmykColor)
    check(engine.block.getColor(cmykFill, property = "fill/color/value") == cmykColor)

    engine.editor.setSpotColor(
        name = "MyBrand Red",
        // RGB spot-color approximations are stored as opaque colors; apply tint on the
        // SpotColor reference.
        color = Color.fromRGBA(r = 0.95F, g = 0.25F, b = 0.21F, a = 1F),
    )
    engine.editor.setSpotColor(
        name = "MyBrand Blue",
        color = Color.fromCMYK(c = 1F, m = 0.7F, y = 0F, k = 0.1F),
    )
    val storedBrandRed = engine.editor.getSpotColorRGB("MyBrand Red")
    val storedBrandBlue = engine.editor.getSpotColorCMYK("MyBrand Blue")
    check(storedBrandRed == Color.fromRGBA(r = 0.95F, g = 0.25F, b = 0.21F, a = 1F))
    check(storedBrandBlue == Color.fromCMYK(c = 1F, m = 0.7F, y = 0F, k = 0.1F))

    val spotBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(spotBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(spotBlock, value = 560F)
    engine.block.setPositionY(spotBlock, value = 120F)
    engine.block.setWidth(spotBlock, value = 160F)
    engine.block.setHeight(spotBlock, value = 160F)

    val spotFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(spotBlock, fill = spotFill)
    engine.block.appendChild(parent = page, child = spotBlock)

    val spotColor = Color.fromSpotColor(
        name = "MyBrand Red",
        tint = 1F,
        externalReference = "brand-palette-v1",
    )
    engine.block.setColor(spotFill, property = "fill/color/value", value = spotColor)
    val appliedSpotColor = engine.block.getColor(spotFill, property = "fill/color/value")
    check(appliedSpotColor is SpotColor)
    check(appliedSpotColor.name == spotColor.name)
    check(appliedSpotColor.tint == spotColor.tint)

    if (engine.block.supportsStroke(srgbBlock)) {
        engine.block.setStrokeEnabled(srgbBlock, enabled = true)
        engine.block.setStrokeWidth(srgbBlock, width = 4F)
        engine.block.setStrokeColor(
            srgbBlock,
            color = Color.fromRGBA(r = 0.1F, g = 0.2F, b = 0.5F, a = 1F),
        )
    }

    val cmykStroke = Color.fromCMYK(c = 0F, m = 0.5F, y = 0.6F, k = 0.2F, tint = 1F)
    if (engine.block.supportsStroke(cmykBlock)) {
        engine.block.setStrokeEnabled(cmykBlock, enabled = true)
        engine.block.setStrokeWidth(cmykBlock, width = 4F)
        engine.block.setStrokeColor(cmykBlock, color = cmykStroke)
    }

    if (engine.block.supportsStroke(spotBlock)) {
        engine.block.setStrokeEnabled(spotBlock, enabled = true)
        engine.block.setStrokeWidth(spotBlock, width = 4F)
        engine.block.setStrokeColor(
            spotBlock,
            color = Color.fromSpotColor(name = "MyBrand Red", tint = 0.7F),
        )
    }

    val readSrgb = engine.block.getColor(srgbFill, property = "fill/color/value")
    val readCmyk = engine.block.getColor(cmykFill, property = "fill/color/value")
    val readSpot = engine.block.getColor(spotFill, property = "fill/color/value")
    val readStroke = engine.block.getStrokeColor(cmykBlock)

    for (color in listOf(readSrgb, readCmyk, readSpot, readStroke)) {
        when (color) {
            is RGBAColor -> Log.i(TAG, "sRGB: r=${color.r}, g=${color.g}, b=${color.b}, a=${color.a}")
            is CMYKColor -> Log.i(
                TAG,
                "CMYK: c=${color.c}, m=${color.m}, y=${color.y}, k=${color.k}, tint=${color.tint}",
            )
            is SpotColor -> Log.i(
                TAG,
                "Spot: name=${color.name}, tint=${color.tint}, ref=${color.externalReference}",
            )
        }
    }
    check(readSrgb is RGBAColor)
    check(readCmyk is CMYKColor)
    check(readSpot is SpotColor)
    check(readStroke == cmykStroke)
}
```

Understand the three color spaces in CE.SDK and when to use each for screen or print workflows.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.1-rc.0/engine-guides-colors-basics)

<EngineReferenceNote {...props} />

CE.SDK supports three color spaces: **sRGB** for screen display, **CMYK** for print workflows, and **Spot Color** for specialized printing. On Android, create color values with the `Color` factory functions and apply them with typed block APIs where available.

This guide covers how to choose the correct color space, apply colors to supported properties, and define spot colors with screen preview approximations.

## Color Spaces Overview

CE.SDK represents Android colors as `Color` values:

- `Color.fromRGBA(r=_, g=_, b=_, a=_)` - sRGB color for screen display
- `Color.fromCMYK(c=_, m=_, y=_, k=_, tint=_)` - CMYK color for print workflows
- `Color.fromSpotColor(name=_, tint=_, externalReference=_)` - named spot color for specialized printing

Use `engine.block.setColor()` for generic color properties such as fill colors, and use typed helpers such as `engine.block.setStrokeColor()` or `engine.block.setDropShadowColor()` when Android exposes one for the property.

**Supported color properties:**

- `'fill/color/value'` - Fill color of a color fill
- `'stroke/color'` - Stroke or outline color
- `'dropShadow/color'` - Drop shadow color
- `'backgroundColor/color'` - Background color

Canvas clear color is a setting, not a regular block color property. On Android, color settings accept `RGBAColor` values only, so use `engine.editor.setSettingColor(keypath = "clearColor", value = Color.fromRGBA(...))` instead of the deprecated `'camera/clearColor'` property.

## sRGB Colors

sRGB is the default color space for screen display. Create an `RGBAColor` with `Color.fromRGBA()`, using components in the range 0.0 to 1.0. The `a` value controls alpha transparency.

```kotlin highlight-android-srgb-color
val srgbColor = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 1F)
engine.block.setColor(srgbFill, property = "fill/color/value", value = srgbColor)
```

sRGB colors are best for digital outputs such as PNG, JPEG, WebP, and screen-only editor previews.

## CMYK Colors

CMYK is the color space for print workflows. Create a `CMYKColor` with `Color.fromCMYK()`, using `c`, `m`, `y`, `k`, and `tint` values in the range 0.0 to 1.0. The `tint` value blends the converted screen preview toward white; it does not change alpha transparency.

```kotlin highlight-android-cmyk-color
val cmykColor = Color.fromCMYK(c = 0F, m = 0.8F, y = 0.95F, k = 0F, tint = 1F)
engine.block.setColor(cmykFill, property = "fill/color/value", value = cmykColor)
```

When CE.SDK renders CMYK colors on screen, it converts them to RGB using standard conversion formulas and applies tint to that converted preview.

> **Note:** In standard PDF export, direct CMYK colors are converted to RGB using the standard conversion. Tint is applied to the opaque RGB preview; it is not exported as alpha.

## Spot Colors

Spot colors are named colors used for specialized printing. Before using a spot color on a block, register the name with an RGB or CMYK approximation so CE.SDK can preview it on screen.

### Defining Spot Colors

Use `engine.editor.setSpotColor()` with either an `RGBAColor` or a `CMYKColor` approximation. RGB approximations are stored as opaque colors, so `getSpotColorRGB()` always returns alpha `1.0`; apply print tint with `Color.fromSpotColor(..., tint=_)`.

```kotlin highlight-android-define-spot-color
engine.editor.setSpotColor(
    name = "MyBrand Red",
    // RGB spot-color approximations are stored as opaque colors; apply tint on the
    // SpotColor reference.
    color = Color.fromRGBA(r = 0.95F, g = 0.25F, b = 0.21F, a = 1F),
)
engine.editor.setSpotColor(
    name = "MyBrand Blue",
    color = Color.fromCMYK(c = 1F, m = 0.7F, y = 0F, k = 0.1F),
)
val storedBrandRed = engine.editor.getSpotColorRGB("MyBrand Red")
val storedBrandBlue = engine.editor.getSpotColorCMYK("MyBrand Blue")
check(storedBrandRed == Color.fromRGBA(r = 0.95F, g = 0.25F, b = 0.21F, a = 1F))
check(storedBrandBlue == Color.fromCMYK(c = 1F, m = 0.7F, y = 0F, k = 0.1F))
```

### Applying Spot Colors

Reference a registered spot color by name with `Color.fromSpotColor()`. The `tint` blends the preview approximation toward white, and `externalReference` can store the source of the spot color.

```kotlin highlight-android-spot-color
val spotColor = Color.fromSpotColor(
    name = "MyBrand Red",
    tint = 1F,
    externalReference = "brand-palette-v1",
)
engine.block.setColor(spotFill, property = "fill/color/value", value = spotColor)
```

When rendered on screen, the spot color uses its RGB or CMYK approximation. During PDF export, CE.SDK saves spot colors as [Separation Color Space](https://opensource.adobe.com/dc-acrobat-sdk-docs/pdfstandards/pdfreference1.6.pdf#G9.1850648) output that preserves print information.

> **Note:** If a block references an undefined spot color, CE.SDK displays magenta (RGB: 1, 0, 1) as a fallback.

## Applying Stroke Colors

Strokes support all three color spaces. Check `engine.block.supportsStroke()` before changing arbitrary blocks, then enable the stroke, set its width, and apply a color with `engine.block.setStrokeColor()`.

```kotlin highlight-android-stroke-color
    if (engine.block.supportsStroke(srgbBlock)) {
        engine.block.setStrokeEnabled(srgbBlock, enabled = true)
        engine.block.setStrokeWidth(srgbBlock, width = 4F)
        engine.block.setStrokeColor(
            srgbBlock,
            color = Color.fromRGBA(r = 0.1F, g = 0.2F, b = 0.5F, a = 1F),
        )
    }

    val cmykStroke = Color.fromCMYK(c = 0F, m = 0.5F, y = 0.6F, k = 0.2F, tint = 1F)
    if (engine.block.supportsStroke(cmykBlock)) {
        engine.block.setStrokeEnabled(cmykBlock, enabled = true)
        engine.block.setStrokeWidth(cmykBlock, width = 4F)
        engine.block.setStrokeColor(cmykBlock, color = cmykStroke)
    }

    if (engine.block.supportsStroke(spotBlock)) {
        engine.block.setStrokeEnabled(spotBlock, enabled = true)
        engine.block.setStrokeWidth(spotBlock, width = 4F)
        engine.block.setStrokeColor(
            spotBlock,
            color = Color.fromSpotColor(name = "MyBrand Red", tint = 0.7F),
        )
    }
```

## Reading Color Values

Use `engine.block.getColor()` to retrieve generic color properties, and use `engine.block.getStrokeColor()` for stroke colors. The returned `Color` subtype tells you whether the value is an `RGBAColor`, `CMYKColor`, or `SpotColor`.

```kotlin highlight-android-get-color
    val readSrgb = engine.block.getColor(srgbFill, property = "fill/color/value")
    val readCmyk = engine.block.getColor(cmykFill, property = "fill/color/value")
    val readSpot = engine.block.getColor(spotFill, property = "fill/color/value")
    val readStroke = engine.block.getStrokeColor(cmykBlock)

    for (color in listOf(readSrgb, readCmyk, readSpot, readStroke)) {
        when (color) {
            is RGBAColor -> Log.i(TAG, "sRGB: r=${color.r}, g=${color.g}, b=${color.b}, a=${color.a}")
            is CMYKColor -> Log.i(
                TAG,
                "CMYK: c=${color.c}, m=${color.m}, y=${color.y}, k=${color.k}, tint=${color.tint}",
            )
            is SpotColor -> Log.i(
                TAG,
                "Spot: name=${color.name}, tint=${color.tint}, ref=${color.externalReference}",
            )
        }
    }
```

For drop shadows, prefer the type-safe Android helpers `engine.block.setDropShadowColor()` and `engine.block.getDropShadowColor()` after confirming support with `engine.block.supportsDropShadow()`.

## Choosing the Right Color Space

| Color Space | Use Case | Output |
| --- | --- | --- |
| **sRGB** | Web, digital, screen display | PNG, JPEG, WebP |
| **CMYK** | Print workflows and print color values | Standard PDF export converts to RGB |
| **Spot Color** | Specialized printing and brand colors | PDF Separation Color Space |

## API Reference

| Method | Description |
| --- | --- |
| `Color.fromRGBA(r=_, g=_, b=_, a=_)` | Create an `RGBAColor`. Components range from 0.0 to 1.0. |
| `Color.fromCMYK(c=_, m=_, y=_, k=_, tint=_)` | Create a `CMYKColor`. Components and tint range from 0.0 to 1.0. |
| `Color.fromSpotColor(name=_, tint=_, externalReference=_)` | Create a `SpotColor` reference to a registered spot color name. |
| `engine.block.setColor(block=_, property="fill/color/value", value=_)` | Set a color property on a block or fill. |
| `engine.block.getColor(block=_, property="fill/color/value")` | Get the current color value from a property. |
| `engine.editor.setSettingColor(keypath="clearColor", value=_)` | Set the canvas clear color through the settings API. Pass an `RGBAColor`, for example `Color.fromRGBA(...)`. |
| `engine.editor.getSettingColor(keypath="clearColor")` | Get the current canvas clear color as an `RGBAColor`. |
| `engine.block.supportsStroke(block=_)` | Check whether a block supports stroke properties. |
| `engine.block.setStrokeEnabled(block=_, enabled=_)` | Enable or disable a block stroke. |
| `engine.block.isStrokeEnabled(block=_)` | Check whether a block stroke is enabled. |
| `engine.block.setStrokeWidth(block=_, width=_)` | Set the stroke width before applying a stroke color. |
| `engine.block.getStrokeWidth(block=_)` | Get the current stroke width. |
| `engine.block.setStrokeColor(block=_, color=_)` | Set the stroke color with the type-safe Android stroke API. |
| `engine.block.getStrokeColor(block=_)` | Get the stroke color with the type-safe Android stroke API. |
| `engine.block.supportsDropShadow(block=_)` | Check whether a block supports drop shadow properties. |
| `engine.block.setDropShadowColor(block=_, color=_)` | Set the drop shadow color with the type-safe Android drop-shadow API. |
| `engine.block.getDropShadowColor(block=_)` | Get the drop shadow color with the type-safe Android drop-shadow API. |
| `engine.editor.setSpotColor(name=_, color=_)` | Define or update a spot color with an RGB or CMYK screen preview approximation. |
| `engine.editor.findAllSpotColors()` | List registered spot color names. |
| `engine.editor.getSpotColorRGB(name=_)` | Get the RGB approximation for a spot color. The returned alpha is always `1.0`. |
| `engine.editor.getSpotColorCMYK(name=_)` | Get the CMYK approximation for a spot color. |
| `engine.editor.removeSpotColor(name=_)` | Remove a spot color from the registry. |

| Type | Properties | Description |
| --- | --- | --- |
| `RGBAColor` | `r`, `g`, `b`, `a` (0.0-1.0) | sRGB color for screen display. Alpha controls transparency. |
| `CMYKColor` | `c`, `m`, `y`, `k`, `tint` (0.0-1.0) | CMYK color for print workflows. Tint blends the preview toward white. |
| `SpotColor` | `name`, `tint`, `externalReference` | Named color for specialized printing. Tint blends the preview toward white. |

## Next Steps

- [Apply Colors](./apply.md) - Apply colors to design elements programmatically
- [CMYK Colors](./for-print/cmyk.md) — Work with CMYK colors in CE.SDK for professional print production workflows with support for color space conversion and tint control.
- [Spot Colors](./for-print/spot.md) - Define and manage spot colors for specialized printing



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support