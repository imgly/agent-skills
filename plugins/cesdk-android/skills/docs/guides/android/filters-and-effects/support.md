> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Supported Filters and Effects](./support.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-supported-filters-and-effects/SupportedFiltersAndEffects.kt reference-only
import android.net.Uri
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.EffectType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.nio.ByteBuffer

data class SupportedFiltersAndEffects(
    val sceneSupportsEffects: Boolean,
    val imageBlockSupportsEffects: Boolean,
    val appliedEffectCount: Int,
    val effectType: String,
    val intensity: Float,
    val darkColor: Color,
    val lightColor: Color,
    val previewPng: ByteBuffer,
)

suspend fun supportedFiltersAndEffects(engine: Engine): SupportedFiltersAndEffects {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageBlock, value = 100F)
    engine.block.setPositionY(imageBlock, value = 75F)
    engine.block.setWidth(imageBlock, value = 600F)
    engine.block.setHeight(imageBlock, value = 450F)
    engine.block.appendChild(parent = page, child = imageBlock)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)

    val sceneSupportsEffects = engine.block.supportsEffects(scene)
    val imageBlockSupportsEffects = engine.block.supportsEffects(imageBlock)

    require(!sceneSupportsEffects) { "Scenes do not support effect stacks." }
    require(imageBlockSupportsEffects) { "Image-backed graphic blocks can render effects." }

    val duotoneEffect = engine.block.createEffect(type = EffectType.DuoToneFilter)
    engine.block.appendEffect(block = imageBlock, effectBlock = duotoneEffect)

    val darkColor = Color.fromRGBA(r = 0.02F, g = 0.04F, b = 0.12F, a = 1F)
    val lightColor = Color.fromRGBA(r = 0.5F, g = 0.7F, b = 1F, a = 1F)

    engine.block.setColor(
        block = duotoneEffect,
        property = "effect/duotone_filter/darkColor",
        value = darkColor,
    )
    engine.block.setColor(
        block = duotoneEffect,
        property = "effect/duotone_filter/lightColor",
        value = lightColor,
    )
    engine.block.setFloat(
        block = duotoneEffect,
        property = "effect/duotone_filter/intensity",
        value = 0.8F,
    )

    val appliedEffects = engine.block.getEffects(imageBlock)
    require(appliedEffects == listOf(duotoneEffect)) {
        "Expected one duotone effect on the image block."
    }

    val previewPng = engine.block.export(block = page, mimeType = MimeType.PNG)
    check(previewPng.hasRemaining()) { "The supported filters and effects preview export is empty." }

    return SupportedFiltersAndEffects(
        sceneSupportsEffects = sceneSupportsEffects,
        imageBlockSupportsEffects = imageBlockSupportsEffects,
        appliedEffectCount = appliedEffects.size,
        effectType = engine.block.getType(duotoneEffect),
        intensity = engine.block.getFloat(duotoneEffect, property = "effect/duotone_filter/intensity"),
        darkColor = engine.block.getColor(duotoneEffect, property = "effect/duotone_filter/darkColor"),
        lightColor = engine.block.getColor(duotoneEffect, property = "effect/duotone_filter/lightColor"),
        previewPng = previewPng.asReadOnlyBuffer(),
    )
}
```

Use this reference to find CE.SDK effect types, support checks, and Android
property keys.

![Supported Filters and Effects Android preview showing an image block with a duotone effect](https://img.ly/docs/cesdk/android/filters-and-effects/support-a666dd/assets/android.hero.png)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/engine-guides-supported-filters-and-effects)

<EngineReferenceNote {...props} />

Effects are separate blocks in an ordered effect stack. You create an effect block, append it to a supported design block, then configure that effect through its property keys.

Use this page as a reference for available Android effect types and properties. For a focused walkthrough on adding and managing effects in a scene, see the [Apply a Filter or Effect](./apply.md) guide.

## Check Effect Support

Before applying effects to a block, verify whether it supports them using `supportsEffects()`. Not all block types can have effects applied. The snippet below checks a scene and an image-backed graphic block.

```kotlin highlight-android-check-effect-support
    val sceneSupportsEffects = engine.block.supportsEffects(scene)
    val imageBlockSupportsEffects = engine.block.supportsEffects(imageBlock)

    require(!sceneSupportsEffects) { "Scenes do not support effect stacks." }
    require(imageBlockSupportsEffects) { "Image-backed graphic blocks can render effects." }
```

Effect support is available for:

- **Graphic blocks** - including image fills, video fills, shapes, and solid colors
- **Page blocks** - effects apply to the page fill or background, not its child blocks

Other block types, such as scenes and groups, return `false`.

## Add an Effect

Create an effect with `createEffect()` using an `EffectType` value, then attach it to a block's effect stack with `appendEffect()`.

```kotlin highlight-android-add-effect
val duotoneEffect = engine.block.createEffect(type = EffectType.DuoToneFilter)
engine.block.appendEffect(block = imageBlock, effectBlock = duotoneEffect)
```

## Configure Effect Properties

Configure effect parameters using typed setter methods. Property paths follow the format `effect/{effect-type}/{property-name}`.

```kotlin highlight-android-configure-effect
    val darkColor = Color.fromRGBA(r = 0.02F, g = 0.04F, b = 0.12F, a = 1F)
    val lightColor = Color.fromRGBA(r = 0.5F, g = 0.7F, b = 1F, a = 1F)

    engine.block.setColor(
        block = duotoneEffect,
        property = "effect/duotone_filter/darkColor",
        value = darkColor,
    )
    engine.block.setColor(
        block = duotoneEffect,
        property = "effect/duotone_filter/lightColor",
        value = lightColor,
    )
    engine.block.setFloat(
        block = duotoneEffect,
        property = "effect/duotone_filter/intensity",
        value = 0.8F,
    )
```

CE.SDK provides setter methods for different parameter types:

- **`setFloat()`** - For intensity, amount, and decimal values
- **`setInt()`** - For discrete values like pixel sizes
- **`setUri()`** - For file URIs, such as LUT files
- **`setString()`** - For string values, such as LUT filter IDs
- **`setColor()`** - For color values

The property tables list `effect/enabled` for completeness. Use `setEffectEnabled()` and `isEffectEnabled()` to disable, enable, and query an effect block.

## Retrieve Applied Effects

Use `getEffects()` to retrieve all effects applied to a block, in the order they are applied.

```kotlin highlight-android-retrieve-effects
val appliedEffects = engine.block.getEffects(imageBlock)
require(appliedEffects == listOf(duotoneEffect)) {
    "Expected one duotone effect on the image block."
}
```

## Effects

The following tables document all available effect types and their configurable properties.

## Adjustments Type

An effect block for basic image adjustments.

This section describes the properties available for the **Adjustments Type** (`//ly.img.ubq/effect/adjustments`) block type.

| Property                         | Type    | Default | Description                          |
| -------------------------------- | ------- | ------- | ------------------------------------ |
| `effect/adjustments/blacks`      | `Float` | `0`     | Adjustment of only the blacks.       |
| `effect/adjustments/brightness`  | `Float` | `0`     | Adjustment of the brightness.        |
| `effect/adjustments/clarity`     | `Float` | `0`     | Adjustment of the detail.            |
| `effect/adjustments/contrast`    | `Float` | `0`     | Adjustment of the contrast.          |
| `effect/adjustments/exposure`    | `Float` | `0`     | Adjustment of the exposure.          |
| `effect/adjustments/gamma`       | `Float` | `0`     | Gamma correction, non-linear.        |
| `effect/adjustments/highlights`  | `Float` | `0`     | Adjustment of only the highlights.   |
| `effect/adjustments/saturation`  | `Float` | `0`     | Adjustment of the saturation.        |
| `effect/adjustments/shadows`     | `Float` | `0`     | Adjustment of only the shadows.      |
| `effect/adjustments/sharpness`   | `Float` | `0`     | Adjustment of the sharpness.         |
| `effect/adjustments/temperature` | `Float` | `0`     | Adjustment of the color temperature. |
| `effect/adjustments/whites`      | `Float` | `0`     | Adjustment of only the whites.       |
| `effect/enabled`                 | `Bool`  | `true`  | Whether the effect is enabled.       |

## Cross Cut Type

An effect that distorts the image with horizontal slices.

This section describes the properties available for the **Cross Cut Type** (`//ly.img.ubq/effect/cross_cut`) block type.

| Property                  | Type    | Default | Description                    |
| ------------------------- | ------- | ------- | ------------------------------ |
| `effect/cross_cut/offset` | `Float` | `0.07`  | Horizontal offset per slice.   |
| `effect/cross_cut/slices` | `Float` | `5`     | Number of horizontal slices.   |
| `effect/cross_cut/speedV` | `Float` | `0.5`   | Vertical slice position.       |
| `effect/cross_cut/time`   | `Float` | `1`     | Randomness input.              |
| `effect/enabled`          | `Bool`  | `true`  | Whether the effect is enabled. |

## Dot Pattern Type

An effect that displays the image using a dot matrix.

This section describes the properties available for the **Dot Pattern Type** (`//ly.img.ubq/effect/dot_pattern`) block type.

| Property                  | Type    | Default | Description                    |
| ------------------------- | ------- | ------- | ------------------------------ |
| `effect/dot_pattern/blur` | `Float` | `0.3`   | Global blur.                   |
| `effect/dot_pattern/dots` | `Float` | `30`    | Number of dots.                |
| `effect/dot_pattern/size` | `Float` | `0.5`   | Size of an individual dot.     |
| `effect/enabled`          | `Bool`  | `true`  | Whether the effect is enabled. |

## Duotone Filter Type

An effect that applies a two-tone color mapping.

This section describes the properties available for the **Duotone Filter Type** (`//ly.img.ubq/effect/duotone_filter`) block type.

| Property                           | Type    | Default                     | Description                                                                       |
| ---------------------------------- | ------- | --------------------------- | --------------------------------------------------------------------------------- |
| `effect/duotone_filter/darkColor`  | `Color` | `{"r":0,"g":0,"b":0,"a":0}` | The darker of the two colors. Negative filter intensities emphasize this color.   |
| `effect/duotone_filter/intensity`  | `Float` | `0`                         | The mixing weight of the two colors in the range \[-1, 1].                         |
| `effect/duotone_filter/lightColor` | `Color` | `{"r":0,"g":0,"b":0,"a":0}` | The brighter of the two colors. Positive filter intensities emphasize this color. |
| `effect/enabled`                   | `Bool`  | `true`                      | Whether the effect is enabled.                                                    |

## Extrude Blur Type

An effect that applies a radial extrude blur.

This section describes the properties available for the **Extrude Blur Type** (`//ly.img.ubq/effect/extrude_blur`) block type.

| Property                     | Type    | Default | Description                    |
| ---------------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`             | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/extrude_blur/amount` | `Float` | `0.2`   | Blur intensity.                |

## Glow Type

An effect that applies an artificial glow.

This section describes the properties available for the **Glow Type** (`//ly.img.ubq/effect/glow`) block type.

| Property               | Type    | Default | Description                    |
| ---------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`       | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/glow/amount`   | `Float` | `0.5`   | Glow brightness.               |
| `effect/glow/darkness` | `Float` | `0.3`   | Glow darkness.                 |
| `effect/glow/size`     | `Float` | `4`     | Intensity of the glow.         |

## Green Screen Type

An effect that replaces a specific color with transparency.

This section describes the properties available for the **Green Screen Type** (`//ly.img.ubq/effect/green_screen`) block type.

| Property                         | Type    | Default                     | Description                                                                                          |
| -------------------------------- | ------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `effect/enabled`                 | `Bool`  | `true`                      | Whether the effect is enabled.                                                                       |
| `effect/green_screen/colorMatch` | `Float` | `0.4`                       | Threshold between the source color and the from color.                                               |
| `effect/green_screen/fromColor`  | `Color` | `{"r":0,"g":1,"b":0,"a":1}` | The color to be replaced.                                                                            |
| `effect/green_screen/smoothness` | `Float` | `0.08`                      | Controls the rate at which the color transition increases when the similarity threshold is exceeded. |
| `effect/green_screen/spill`      | `Float` | `0`                         | Controls the desaturation of the source color to reduce color spill.                                 |

## Half Tone Type

An effect that overlays a halftone pattern.

This section describes the properties available for the **Half Tone Type** (`//ly.img.ubq/effect/half_tone`) block type.

| Property                 | Type    | Default | Description                    |
| ------------------------ | ------- | ------- | ------------------------------ |
| `effect/enabled`         | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/half_tone/angle` | `Float` | `0`     | Angle of pattern.              |
| `effect/half_tone/scale` | `Float` | `0.5`   | Scale of pattern.              |

## Linocut Type

An effect that overlays a linocut pattern.

This section describes the properties available for the **Linocut Type** (`//ly.img.ubq/effect/linocut`) block type.

| Property               | Type    | Default | Description                    |
| ---------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`       | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/linocut/scale` | `Float` | `0.5`   | Scale of pattern.              |

## Liquid Type

An effect that applies a liquefy distortion.

This section describes the properties available for the **Liquid Type** (`//ly.img.ubq/effect/liquid`) block type.

| Property               | Type    | Default | Description                     |
| ---------------------- | ------- | ------- | ------------------------------- |
| `effect/enabled`       | `Bool`  | `true`  | Whether the effect is enabled.  |
| `effect/liquid/amount` | `Float` | `0.06`  | Severity of the applied effect. |
| `effect/liquid/scale`  | `Float` | `0.62`  | Global scale.                   |
| `effect/liquid/time`   | `Float` | `0.5`   | Continuous randomness input.    |

## Lut Filter Type

An effect that applies a color lookup table (LUT).

This section describes the properties available for the **Lut Filter Type** (`//ly.img.ubq/effect/lut_filter`) block type.

| Property                                | Type     | Default | Description                                                |
| --------------------------------------- | -------- | ------- | ---------------------------------------------------------- |
| `effect/enabled`                        | `Bool`   | `true`  | Whether the effect is enabled.                             |
| `effect/lut_filter/filterId`            | `String` | `""`    | The unique identifier of the filter.                       |
| `effect/lut_filter/horizontalTileCount` | `Int`    | `5`     | The horizontal number of tiles contained in the LUT image. |
| `effect/lut_filter/intensity`           | `Float`  | `1`     | A value in the range of \[0, 1]. Defaults to 1.0.           |
| `effect/lut_filter/lutFileURI`          | `String` | `""`    | The URI to a LUT PNG file.                                 |
| `effect/lut_filter/verticalTileCount`   | `Int`    | `5`     | The vertical number of tiles contained in the LUT image.   |

## Mirror Type

An effect that mirrors the image along a central axis.

This section describes the properties available for the **Mirror Type** (`//ly.img.ubq/effect/mirror`) block type.

| Property             | Type   | Default | Description                    |
| -------------------- | ------ | ------- | ------------------------------ |
| `effect/enabled`     | `Bool` | `true`  | Whether the effect is enabled. |
| `effect/mirror/side` | `Int`  | `1`     | Axis to mirror along.          |

## Outliner Type

An effect that highlights the outlines in an image.

This section describes the properties available for the **Outliner Type** (`//ly.img.ubq/effect/outliner`) block type.

| Property                      | Type    | Default | Description                                  |
| ----------------------------- | ------- | ------- | -------------------------------------------- |
| `effect/enabled`              | `Bool`  | `true`  | Whether the effect is enabled.               |
| `effect/outliner/amount`      | `Float` | `0.5`   | Intensity of edge highlighting.              |
| `effect/outliner/passthrough` | `Float` | `0.5`   | Visibility of input image in non-edge areas. |

## Pixelize Type

An effect that pixelizes the image.

This section describes the properties available for the **Pixelize Type** (`//ly.img.ubq/effect/pixelize`) block type.

| Property                              | Type   | Default | Description                         |
| ------------------------------------- | ------ | ------- | ----------------------------------- |
| `effect/enabled`                      | `Bool` | `true`  | Whether the effect is enabled.      |
| `effect/pixelize/horizontalPixelSize` | `Int`  | `20`    | The number of pixels on the x-axis. |
| `effect/pixelize/verticalPixelSize`   | `Int`  | `20`    | The number of pixels on the y-axis. |

## Posterize Type

An effect that reduces the number of colors in the image.

This section describes the properties available for the **Posterize Type** (`//ly.img.ubq/effect/posterize`) block type.

| Property                  | Type    | Default | Description                    |
| ------------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`          | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/posterize/levels` | `Float` | `3`     | Number of color levels.        |

## Radial Pixel Type

An effect that reduces the image into radial pixel rows.

This section describes the properties available for the **Radial Pixel Type** (`//ly.img.ubq/effect/radial_pixel`) block type.

| Property                       | Type    | Default | Description                                                   |
| ------------------------------ | ------- | ------- | ------------------------------------------------------------- |
| `effect/enabled`               | `Bool`  | `true`  | Whether the effect is enabled.                                |
| `effect/radial_pixel/radius`   | `Float` | `0.1`   | Radius of an individual row of pixels, relative to the image. |
| `effect/radial_pixel/segments` | `Float` | `0.01`  | Proportional size of a pixel in each row.                     |

## Recolor Type

An effect that replaces one color with another.

This section describes the properties available for the **Recolor Type** (`//ly.img.ubq/effect/recolor`) block type.

| Property                         | Type    | Default                     | Description                                                                                          |
| -------------------------------- | ------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `effect/enabled`                 | `Bool`  | `true`                      | Whether the effect is enabled.                                                                       |
| `effect/recolor/brightnessMatch` | `Float` | `1`                         | Affects the weight of brightness when calculating color similarity.                                  |
| `effect/recolor/colorMatch`      | `Float` | `0.4`                       | Threshold between the source color and the from color.                                               |
| `effect/recolor/fromColor`       | `Color` | `{"r":1,"g":1,"b":1,"a":1}` | The color to be replaced.                                                                            |
| `effect/recolor/smoothness`      | `Float` | `0.08`                      | Controls the rate at which the color transition increases when the similarity threshold is exceeded. |
| `effect/recolor/toColor`         | `Color` | `{"r":0,"g":0,"b":1,"a":1}` | The color to replace with.                                                                           |

## Sharpie Type

Cartoon-like effect.

This section describes the properties available for the **Sharpie Type** (`//ly.img.ubq/effect/sharpie`) block type.

| Property         | Type   | Default | Description                    |
| ---------------- | ------ | ------- | ------------------------------ |
| `effect/enabled` | `Bool` | `true`  | Whether the effect is enabled. |

## Shifter Type

An effect that shifts individual color channels.

This section describes the properties available for the **Shifter Type** (`//ly.img.ubq/effect/shifter`) block type.

| Property                | Type    | Default | Description                    |
| ----------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`        | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/shifter/amount` | `Float` | `0.05`  | Intensity of the shift.        |
| `effect/shifter/angle`  | `Float` | `0.3`   | Shift direction.               |

## Tilt Shift Type

An effect that applies a tilt-shift blur.

This section describes the properties available for the **Tilt Shift Type** (`//ly.img.ubq/effect/tilt_shift`) block type.

| Property                     | Type    | Default | Description                    |
| ---------------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`             | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/tilt_shift/amount`   | `Float` | `0.016` | Blur intensity.                |
| `effect/tilt_shift/position` | `Float` | `0.4`   | Horizontal position in image.  |

## Tv Glitch Type

An effect that mimics TV banding and distortion.

This section describes the properties available for the **Tv Glitch Type** (`//ly.img.ubq/effect/tv_glitch`) block type.

| Property                       | Type    | Default | Description                        |
| ------------------------------ | ------- | ------- | ---------------------------------- |
| `effect/enabled`               | `Bool`  | `true`  | Whether the effect is enabled.     |
| `effect/tv_glitch/distortion`  | `Float` | `3`     | Rough horizontal distortion.       |
| `effect/tv_glitch/distortion2` | `Float` | `1`     | Fine horizontal distortion.        |
| `effect/tv_glitch/rollSpeed`   | `Float` | `1`     | Vertical offset.                   |
| `effect/tv_glitch/speed`       | `Float` | `2`     | Number of changes per time change. |

## Vignette Type

An effect that adds a vignette (darkened corners).

This section describes the properties available for the **Vignette Type** (`//ly.img.ubq/effect/vignette`) block type.

| Property                   | Type    | Default | Description                    |
| -------------------------- | ------- | ------- | ------------------------------ |
| `effect/enabled`           | `Bool`  | `true`  | Whether the effect is enabled. |
| `effect/vignette/darkness` | `Float` | `1`     | Brightness of vignette.        |
| `effect/vignette/offset`   | `Float` | `1`     | Radial offset.                 |

## API Reference

| Method                                                                                  | Category | Purpose                                  |
| --------------------------------------------------------------------------------------- | -------- | ---------------------------------------- |
| `engine.block.supportsEffects(block=_)`                                                 | Block    | Check if a block supports effects        |
| `engine.block.createEffect(type=_)`                                                     | Block    | Create a new effect instance             |
| `engine.block.appendEffect(block=_, effectBlock=_)`                                     | Block    | Add an effect to a block stack           |
| `engine.block.getEffects(block=_)`                                                      | Block    | Get all effects attached to a block      |
| `engine.block.setFloat(block=_, property="effect/duotone_filter/intensity", value=_)`   | Block    | Set a float effect property              |
| `engine.block.getFloat(block=_, property="effect/duotone_filter/intensity")`            | Block    | Get a float effect property              |
| `engine.block.setInt(block=_, property="effect/pixelize/horizontalPixelSize", value=_)` | Block    | Set an integer effect property           |
| `engine.block.getInt(block=_, property="effect/pixelize/horizontalPixelSize")`          | Block    | Get an integer effect property           |
| `engine.block.setUri(block=_, property="effect/lut_filter/lutFileURI", value=_)`        | Block    | Set a URI effect property                |
| `engine.block.getUri(block=_, property="effect/lut_filter/lutFileURI")`                 | Block    | Get a URI effect property                |
| `engine.block.setString(block=_, property="effect/lut_filter/filterId", value=_)`       | Block    | Set a string effect property             |
| `engine.block.getString(block=_, property="effect/lut_filter/filterId")`                | Block    | Get a string effect property             |
| `engine.block.setColor(block=_, property="effect/duotone_filter/darkColor", value=_)`   | Block    | Set a color effect property              |
| `engine.block.getColor(block=_, property="effect/duotone_filter/darkColor")`            | Block    | Get a color effect property              |
| `engine.block.setEffectEnabled(effectBlock=_, enabled=_)`                               | Block    | Enable or disable an effect block        |
| `engine.block.isEffectEnabled(effectBlock=_)`                                           | Block    | Check whether an effect block is enabled |

## Next Steps

- [Apply a Filter or Effect](./apply.md) - Apply, configure, stack, and
  manage filters and effects



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support