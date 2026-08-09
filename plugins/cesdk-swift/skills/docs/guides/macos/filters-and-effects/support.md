> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Supported Filters and Effects](./support.md)

---

```swift file=@cesdk_swift_examples/engine-guides-supported-filters-and-effects/SupportedFiltersAndEffects.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func supportedFiltersAndEffects(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Resolve sample assets against the bundled asset base URL.
  let baseURL = try engine.guidesBaseURL
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(imageBlock, value: 600)
  try engine.block.setHeight(imageBlock, value: 450)
  try engine.block.setPositionX(imageBlock, value: 100)
  try engine.block.setPositionY(imageBlock, value: 75)
  try engine.block.appendChild(to: page, child: imageBlock)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(imageBlock, fill: imageFill)

  let canHaveEffects = try engine.block.supportsEffects(imageBlock)
  print("Block supports effects: \(canHaveEffects)")

  let duotoneEffect = try engine.block.createEffect(.duotoneFilter)
  try engine.block.appendEffect(imageBlock, effectID: duotoneEffect)

  try engine.block.setColor(
    duotoneEffect,
    property: "effect/duotone_filter/darkColor",
    color: .rgba(r: 0.02, g: 0.04, b: 0.12, a: 1.0),
  )
  try engine.block.setColor(
    duotoneEffect,
    property: "effect/duotone_filter/lightColor",
    color: .rgba(r: 0.5, g: 0.7, b: 1.0, a: 1.0),
  )
  try engine.block.setFloat(duotoneEffect, property: "effect/duotone_filter/intensity", value: 0.8)

  let appliedEffects = try engine.block.getEffects(imageBlock)
  print("Number of applied effects: \(appliedEffects.count)")

  for (index, effect) in appliedEffects.enumerated() {
    let effectType = try engine.block.getType(effect)
    print("Effect \(index): \(effectType)")
  }
}
```

Discover all available filters and effects in CE.SDK and learn how to check
if a block supports them.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-supported-filters-and-effects)

<EngineReferenceNote {...props} />

CE.SDK provides 22 built-in effect types for visual transformations including color adjustments, blur effects, artistic filters, and distortion effects. This reference guide shows how to check effect support and add effects programmatically, followed by detailed property tables for each effect type.

This guide covers checking effect support on blocks, adding effects programmatically, and the complete list of available effect types with their properties. For detailed tutorials on configuring and combining multiple effects, see the [Apply Filters and Effects](./apply.md) guide.

## Check Effect Support

Before applying effects to a block, verify whether it supports them using `supportsEffects(_:)`. Not all block types can have effects applied. The snippet below creates a graphic block with an image fill, then checks support.

```swift highlight-supportedEffects-checkSupport
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(imageBlock, value: 600)
  try engine.block.setHeight(imageBlock, value: 450)
  try engine.block.setPositionX(imageBlock, value: 100)
  try engine.block.setPositionY(imageBlock, value: 75)
  try engine.block.appendChild(to: page, child: imageBlock)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(imageBlock, fill: imageFill)

  let canHaveEffects = try engine.block.supportsEffects(imageBlock)
  print("Block supports effects: \(canHaveEffects)")
```

Effect support is available for:

- **Graphic blocks** — including those displaying images, videos, shapes, or solid colors
- **Page blocks** — to apply an effect to the whole page

Other block types, such as groups, return `false`.

## Add an Effect

Create an effect with `createEffect(_:)` using an `EffectType` value, then attach it to a block's effect stack with `appendEffect(_:effectID:)`.

```swift highlight-supportedEffects-addEffect
let duotoneEffect = try engine.block.createEffect(.duotoneFilter)
try engine.block.appendEffect(imageBlock, effectID: duotoneEffect)
```

## Configure Effect Properties

Configure effect parameters using the typed setter methods. Property paths follow the format `effect/{effect-type}/{property-name}`.

```swift highlight-supportedEffects-configure
try engine.block.setColor(
  duotoneEffect,
  property: "effect/duotone_filter/darkColor",
  color: .rgba(r: 0.02, g: 0.04, b: 0.12, a: 1.0),
)
try engine.block.setColor(
  duotoneEffect,
  property: "effect/duotone_filter/lightColor",
  color: .rgba(r: 0.5, g: 0.7, b: 1.0, a: 1.0),
)
try engine.block.setFloat(duotoneEffect, property: "effect/duotone_filter/intensity", value: 0.8)
```

CE.SDK provides typed setter methods for different parameter types:

- **`setFloat(_:property:value:)`** - For intensity, amount, and decimal values
- **`setInt(_:property:value:)`** - For discrete values like pixel sizes
- **`setString(_:property:value:)`** - For file URIs (LUT files)
- **`setBool(_:property:value:)`** - For enabling or disabling features
- **`setColor(_:property:color:)`** - For color values

## Retrieve Applied Effects

Use `getEffects(_:)` to retrieve all effects applied to a block, in the order they are applied.

```swift highlight-supportedEffects-getEffects
  let appliedEffects = try engine.block.getEffects(imageBlock)
  print("Number of applied effects: \(appliedEffects.count)")

  for (index, effect) in appliedEffects.enumerated() {
    let effectType = try engine.block.getType(effect)
    print("Effect \(index): \(effectType)")
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

## Next Steps

- [Apply Filters and Effects](./apply.md) - Learn how to configure, combine, and manage multiple effects



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support