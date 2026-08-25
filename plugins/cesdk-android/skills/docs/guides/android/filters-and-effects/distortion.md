> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Distortion](./distortion.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-distortion/Distortion.kt reference-only
import android.net.Uri
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.EffectType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.nio.ByteBuffer

data class Distortion(
    val liquidAmount: Float,
    val mirrorSide: Int,
    val shifterAmount: Float,
    val radialPixelRadius: Float,
    val tvGlitchDistortion: Float,
    val combinedEffectCount: Int,
    val disabledState: Boolean,
    val removed: Boolean,
    val liquidProperties: List<String>,
    val previewPng: ByteBuffer,
)

suspend fun distortion(engine: Engine): Distortion {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1180F)
    engine.block.setHeight(page, value = 620F)
    engine.block.appendChild(parent = scene, child = page)

    val imageCells =
        listOf(
            30F to 30F,
            410F to 30F,
            790F to 30F,
            30F to 320F,
            410F to 320F,
            790F to 320F,
        ).map { (x, y) ->
            val cell = engine.block.create(DesignBlockType.Graphic)
            engine.block.setShape(cell, shape = engine.block.createShape(ShapeType.Rect))
            engine.block.setWidth(cell, value = 360F)
            engine.block.setHeight(cell, value = 270F)
            engine.block.setPositionX(cell, value = x)
            engine.block.setPositionY(cell, value = y)

            val fill = engine.block.createFill(FillType.Image)
            engine.block.setUri(
                block = fill,
                property = "fill/image/imageFileURI",
                value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
            )
            engine.block.setFill(cell, fill = fill)
            engine.block.setContentFillMode(block = cell, mode = ContentFillMode.COVER)
            engine.block.appendChild(parent = page, child = cell)

            cell
        }

    val liquidBlock = imageCells[1]
    val mirrorBlock = imageCells[2]
    val shifterBlock = imageCells[3]
    val radialPixelBlock = imageCells[4]
    val tvGlitchBlock = imageCells[5]

    require(engine.block.supportsEffects(liquidBlock)) {
        "Image-backed graphic blocks can render distortion effects."
    }
    val liquid = engine.block.createEffect(type = EffectType.Liquid)
    engine.block.setFloat(liquid, property = "effect/liquid/amount", value = 0.5F)
    engine.block.setFloat(liquid, property = "effect/liquid/scale", value = 1.0F)
    engine.block.appendEffect(block = liquidBlock, effectBlock = liquid)

    val liquidAmount = engine.block.getFloat(liquid, property = "effect/liquid/amount")
    check(liquidAmount == 0.5F)

    val mirror = engine.block.createEffect(type = EffectType.Mirror)
    engine.block.setInt(mirror, property = "effect/mirror/side", value = 0)
    engine.block.appendEffect(block = mirrorBlock, effectBlock = mirror)

    val mirrorSide = engine.block.getInt(mirror, property = "effect/mirror/side")
    check(mirrorSide == 0)

    val shifter = engine.block.createEffect(type = EffectType.Shifter)
    engine.block.setFloat(shifter, property = "effect/shifter/amount", value = 0.3F)
    engine.block.setFloat(shifter, property = "effect/shifter/angle", value = 0.785F)
    engine.block.appendEffect(block = shifterBlock, effectBlock = shifter)

    val shifterAmount = engine.block.getFloat(shifter, property = "effect/shifter/amount")
    check(shifterAmount == 0.3F)

    val radialPixel = engine.block.createEffect(type = EffectType.RadialPixel)
    engine.block.setFloat(radialPixel, property = "effect/radial_pixel/radius", value = 0.5F)
    engine.block.setFloat(radialPixel, property = "effect/radial_pixel/segments", value = 0.5F)
    engine.block.appendEffect(block = radialPixelBlock, effectBlock = radialPixel)

    val radialPixelRadius = engine.block.getFloat(radialPixel, property = "effect/radial_pixel/radius")
    check(radialPixelRadius == 0.5F)

    val tvGlitch = engine.block.createEffect(type = EffectType.TvGlitch)
    engine.block.setFloat(tvGlitch, property = "effect/tv_glitch/distortion", value = 0.4F)
    engine.block.setFloat(tvGlitch, property = "effect/tv_glitch/distortion2", value = 0.2F)
    engine.block.setFloat(tvGlitch, property = "effect/tv_glitch/speed", value = 0.5F)
    engine.block.setFloat(tvGlitch, property = "effect/tv_glitch/rollSpeed", value = 0.5F)
    engine.block.appendEffect(block = tvGlitchBlock, effectBlock = tvGlitch)

    val tvGlitchDistortion = engine.block.getFloat(tvGlitch, property = "effect/tv_glitch/distortion")
    check(tvGlitchDistortion == 0.4F)

    val previewPng = engine.block.export(block = page, mimeType = MimeType.PNG)

    val extraShifter = engine.block.createEffect(type = EffectType.Shifter)
    engine.block.setFloat(extraShifter, property = "effect/shifter/amount", value = 0.2F)
    engine.block.appendEffect(block = liquidBlock, effectBlock = extraShifter)

    val combinedEffects = engine.block.getEffects(liquidBlock)

    check(combinedEffects == listOf(liquid, extraShifter))

    engine.block.setEffectEnabled(effectBlock = extraShifter, enabled = false)
    val disabledState = engine.block.isEffectEnabled(extraShifter)

    check(!disabledState)

    engine.block.removeEffect(block = liquidBlock, index = 1)
    engine.block.destroy(extraShifter)

    val removed = engine.block.getEffects(liquidBlock) == listOf(liquid)
    check(removed)

    val liquidProperties = engine.block.findAllProperties(liquid)

    check("effect/liquid/amount" in liquidProperties)

    return Distortion(
        liquidAmount = liquidAmount,
        mirrorSide = mirrorSide,
        shifterAmount = shifterAmount,
        radialPixelRadius = radialPixelRadius,
        tvGlitchDistortion = tvGlitchDistortion,
        combinedEffectCount = combinedEffects.size,
        disabledState = disabledState,
        removed = removed,
        liquidProperties = liquidProperties,
        previewPng = previewPng,
    )
}
```

Apply distortion effects to warp, shift, and transform images and videos for dynamic artistic visuals using CE.SDK's effect system.

![A grid showing the same photo unaltered alongside the liquid, mirror, shifter, radial pixel, and TV glitch distortion effects](https://img.ly/docs/cesdk/android/filters-and-effects/distortion-5b5a66/assets/android.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.1-rc.0/engine-guides-distortion)

<EngineReferenceNote {...props} />

Distortion effects differ from color filters because they change the geometry and spatial arrangement of pixels rather than only changing color values. CE.SDK provides several distortion effect types: liquid warping, mirror reflections, color channel shifting, radial pixelation, and TV glitch.

This guide covers the built-in Android workflow and how to apply and configure each distortion effect programmatically, combine multiple effects on a single block, and manage the effect stack with the block API. To compare the effects side by side, the example places six copies of the same image in a grid and applies one effect to each cell.

## Using the Built-in Distortion UI

The Android Base Editor exposes distortion effects for supported image and video blocks:

1. Select a supported image or video block on the canvas.
2. Open **Effect** in the inspector bar and browse the available distortion effects.
3. Choose Liquid, Mirror, Shifter, Radial Pixel, or TV Glitch. Select the applied effect again to open its controls, then adjust the values.
4. Preview the result directly on the canvas as you change the controls.

> **Note:** For a complete ready-to-use editor surface, see the [Design Editor Starter Kit](../starterkits/design-editor.md).

## Apply Liquid Effect

The liquid effect creates organic, flowing distortions that warp the image as if viewed through water. Verify the block supports effects, create the effect with `EffectType.Liquid`, configure its properties with `setFloat()`, then attach it with `appendEffect()`.

```kotlin highlight-android-liquid-effect
require(engine.block.supportsEffects(liquidBlock)) {
    "Image-backed graphic blocks can render distortion effects."
}
val liquid = engine.block.createEffect(type = EffectType.Liquid)
engine.block.setFloat(liquid, property = "effect/liquid/amount", value = 0.5F)
engine.block.setFloat(liquid, property = "effect/liquid/scale", value = 1.0F)
engine.block.appendEffect(block = liquidBlock, effectBlock = liquid)
```

The liquid effect properties:

- `effect/liquid/amount` (`0.0` to `1.0`) - Intensity of the warping.
- `effect/liquid/scale` (`0.0` to `1.0`) - Scale of the liquid pattern.
- `effect/liquid/time` (`0.0` to `1.0`) - Fixed variation and randomness input for the liquid pattern. This property does not animate the effect automatically.

## Apply Mirror Effect

The mirror effect reflects the image along a configurable side, creating symmetrical compositions.

```kotlin highlight-android-mirror-effect
val mirror = engine.block.createEffect(type = EffectType.Mirror)
engine.block.setInt(mirror, property = "effect/mirror/side", value = 0)
engine.block.appendEffect(block = mirrorBlock, effectBlock = mirror)
```

The `effect/mirror/side` property is an integer: `0` (Left), `1` (Right), `2` (Top), or `3` (Bottom). Set it with `setInt()`.

## Apply Shifter Effect

The shifter effect displaces color channels at an angle, creating chromatic aberration commonly seen in glitch art and retro visuals.

```kotlin highlight-android-shifter-effect
val shifter = engine.block.createEffect(type = EffectType.Shifter)
engine.block.setFloat(shifter, property = "effect/shifter/amount", value = 0.3F)
engine.block.setFloat(shifter, property = "effect/shifter/angle", value = 0.785F)
engine.block.appendEffect(block = shifterBlock, effectBlock = shifter)
```

The shifter effect properties:

- `effect/shifter/amount` (`0.0` to `1.0`) - Displacement distance.
- `effect/shifter/angle` - Direction of the shift in radians.

## Apply Radial Pixel Effect

The radial pixel effect pixelates the image in a circular pattern from the center, useful for focus effects or stylized treatments.

```kotlin highlight-android-radial-pixel-effect
val radialPixel = engine.block.createEffect(type = EffectType.RadialPixel)
engine.block.setFloat(radialPixel, property = "effect/radial_pixel/radius", value = 0.5F)
engine.block.setFloat(radialPixel, property = "effect/radial_pixel/segments", value = 0.5F)
engine.block.appendEffect(block = radialPixelBlock, effectBlock = radialPixel)
```

The radial pixel effect properties:

- `effect/radial_pixel/radius` - Radius of each row of pixels, relative to the image.
- `effect/radial_pixel/segments` - Proportional size of a pixel in each row.

## Apply TV Glitch Effect

The TV glitch effect simulates analog television interference with horizontal distortion and rolling effects.

```kotlin highlight-android-tv-glitch-effect
val tvGlitch = engine.block.createEffect(type = EffectType.TvGlitch)
engine.block.setFloat(tvGlitch, property = "effect/tv_glitch/distortion", value = 0.4F)
engine.block.setFloat(tvGlitch, property = "effect/tv_glitch/distortion2", value = 0.2F)
engine.block.setFloat(tvGlitch, property = "effect/tv_glitch/speed", value = 0.5F)
engine.block.setFloat(tvGlitch, property = "effect/tv_glitch/rollSpeed", value = 0.5F)
engine.block.appendEffect(block = tvGlitchBlock, effectBlock = tvGlitch)
```

The TV glitch effect properties:

- `effect/tv_glitch/distortion` - Primary horizontal distortion intensity.
- `effect/tv_glitch/distortion2` - Secondary distortion layer.
- `effect/tv_glitch/speed` - Fixed variance input for the glitch pattern. This property does not animate the effect automatically.
- `effect/tv_glitch/rollSpeed` - Fixed vertical offset for the TV bands.

## Combine Multiple Distortion Effects

Stack multiple distortion effects on a single block. Effects render in the order they appear in the block's effect list, from bottom to top, so the liquid warp is applied first and the shifter then displaces color channels on the already-warped result.

```kotlin highlight-android-combine-effects
val extraShifter = engine.block.createEffect(type = EffectType.Shifter)
engine.block.setFloat(extraShifter, property = "effect/shifter/amount", value = 0.2F)
engine.block.appendEffect(block = liquidBlock, effectBlock = extraShifter)
```

Use `appendEffect()` to add an effect to the end of the list, or `insertEffect()` when an effect must occupy a specific stack index.

## List Applied Effects

Retrieve every effect attached to a block with `getEffects()`. It returns an ordered list of effect block IDs.

```kotlin highlight-android-list-effects
val combinedEffects = engine.block.getEffects(liquidBlock)
```

Use the list when you need to inspect effect order, find an effect before toggling it, or remove an effect by index.

## Enable and Disable Effects

Toggle an effect on and off without removing it using `setEffectEnabled()`, and query its state with `isEffectEnabled()`. A disabled effect stays attached and keeps its parameters, but the engine skips it during rendering.

```kotlin highlight-android-toggle-effect
engine.block.setEffectEnabled(effectBlock = extraShifter, enabled = false)
val disabledState = engine.block.isEffectEnabled(extraShifter)
```

This is useful for before/after comparisons or temporarily reducing rendering cost.

## Remove Effects

Remove an effect from a block by index with `removeEffect()`, then call `destroy()` on the detached effect block when you no longer need it.

```kotlin highlight-android-remove-effect
engine.block.removeEffect(block = liquidBlock, index = 1)
engine.block.destroy(extraShifter)
```

## Discover Effect Properties

Use `findAllProperties()` to discover every property available on an effect. The distortion properties shown here are numeric, so use `setFloat()` and `getFloat()` or `setInt()` and `getInt()` according to each property type.

```kotlin highlight-android-effect-properties
val liquidProperties = engine.block.findAllProperties(liquid)
```

## Troubleshooting

### Effect Not Visible

Confirm the block supports effects with `supportsEffects()` and that the effect
is enabled with `isEffectEnabled()`. Effects apply to graphic blocks with image
or video fills, not to scene blocks.

### Unexpected Results

Verify each parameter against its accepted range:

| Effect | Accepted Values |
| --- | --- |
| Liquid | `amount`, `scale`, and `time`: `0.0`–`1.0` |
| Mirror | `side`: `0`–`3` |
| Shifter | `amount`: `0.0`–`1.0`; `angle`: `0.0`–`6.3` |
| Radial Pixel | `radius`: `0.05`–`1.0`; `segments`: `0.01`–`1.0` |
| TV Glitch | `distortion`: `0.0`–`10.0`; `distortion2`: `0.0`–`5.0`; `speed`: `0.0`–`5.0`; `rollSpeed`: `0.0`–`3.0` |

### Performance

Distortion effects are GPU-intensive. Limit the number of stacked effects on a
single block, especially on mobile devices, and disable effects you are not
actively rendering.

## API Reference

| API | Description |
| --- | --- |
| `engine.block.supportsEffects(block=_)` | Checks whether a design block can render effects |
| `engine.block.createEffect(type=EffectType.Liquid)` | Creates a liquid distortion effect block |
| `engine.block.createEffect(type=EffectType.Mirror)` | Creates a mirror effect block |
| `engine.block.createEffect(type=EffectType.Shifter)` | Creates a shifter effect block |
| `engine.block.createEffect(type=EffectType.RadialPixel)` | Creates a radial pixel effect block |
| `engine.block.createEffect(type=EffectType.TvGlitch)` | Creates a TV glitch effect block |
| `engine.block.appendEffect(block=_, effectBlock=_)` | Adds the effect to the end of a block's effect stack |
| `engine.block.insertEffect(block=_, effectBlock=_, index=_)` | Inserts an effect at a specific stack index |
| `engine.block.getEffects(block=_)` | Returns the ordered effects attached to a block |
| `engine.block.removeEffect(block=_, index=_)` | Removes the effect at the specified stack index |
| `engine.block.setEffectEnabled(effectBlock=_, enabled=_)` | Enables or disables an effect block |
| `engine.block.isEffectEnabled(effectBlock=_)` | Returns whether an effect block is enabled |
| `engine.block.findAllProperties(block=_)` | Lists the properties available on an effect block |
| `engine.block.setFloat(block=_, property="effect/liquid/amount", value=_)` | Writes a liquid effect float property |
| `engine.block.getFloat(block=_, property="effect/liquid/amount")` | Reads a liquid effect float property |
| `engine.block.setFloat(block=_, property="effect/liquid/scale", value=_)` | Writes the liquid pattern scale |
| `engine.block.getFloat(block=_, property="effect/liquid/scale")` | Reads the liquid pattern scale |
| `engine.block.setFloat(block=_, property="effect/liquid/time", value=_)` | Writes the liquid pattern variation input |
| `engine.block.getFloat(block=_, property="effect/liquid/time")` | Reads the liquid pattern variation input |
| `engine.block.setInt(block=_, property="effect/mirror/side", value=_)` | Writes the mirror side property |
| `engine.block.getInt(block=_, property="effect/mirror/side")` | Reads the mirror side property |
| `engine.block.setFloat(block=_, property="effect/shifter/amount", value=_)` | Writes a shifter effect float property |
| `engine.block.getFloat(block=_, property="effect/shifter/amount")` | Reads a shifter effect float property |
| `engine.block.setFloat(block=_, property="effect/shifter/angle", value=_)` | Writes the shifter direction in radians |
| `engine.block.getFloat(block=_, property="effect/shifter/angle")` | Reads the shifter direction in radians |
| `engine.block.setFloat(block=_, property="effect/radial_pixel/radius", value=_)` | Writes a radial pixel effect float property |
| `engine.block.getFloat(block=_, property="effect/radial_pixel/radius")` | Reads a radial pixel effect float property |
| `engine.block.setFloat(block=_, property="effect/radial_pixel/segments", value=_)` | Writes the radial pixel segment size |
| `engine.block.getFloat(block=_, property="effect/radial_pixel/segments")` | Reads the radial pixel segment size |
| `engine.block.setFloat(block=_, property="effect/tv_glitch/distortion", value=_)` | Writes a TV glitch effect float property |
| `engine.block.getFloat(block=_, property="effect/tv_glitch/distortion")` | Reads a TV glitch effect float property |
| `engine.block.setFloat(block=_, property="effect/tv_glitch/distortion2", value=_)` | Writes the secondary TV glitch distortion |
| `engine.block.getFloat(block=_, property="effect/tv_glitch/distortion2")` | Reads the secondary TV glitch distortion |
| `engine.block.setFloat(block=_, property="effect/tv_glitch/speed", value=_)` | Writes the TV glitch variance input |
| `engine.block.getFloat(block=_, property="effect/tv_glitch/speed")` | Reads the TV glitch variance input |
| `engine.block.setFloat(block=_, property="effect/tv_glitch/rollSpeed", value=_)` | Writes the TV glitch vertical offset |
| `engine.block.getFloat(block=_, property="effect/tv_glitch/rollSpeed")` | Reads the TV glitch vertical offset |
| `engine.block.destroy(block=_)` | Destroys a detached or unused effect block |

## Available Distortion Effects

| Effect | `EffectType` | Description | Key Properties |
| --- | --- | --- | --- |
| Liquid | `EffectType.Liquid` | Flowing, organic warping | `amount`, `scale`, `time` |
| Mirror | `EffectType.Mirror` | Reflection along a side | `side` (0=Left, 1=Right, 2=Top, 3=Bottom) |
| Shifter | `EffectType.Shifter` | Chromatic aberration | `amount`, `angle` |
| Radial Pixel | `EffectType.RadialPixel` | Circular pixelation | `radius`, `segments` |
| TV Glitch | `EffectType.TvGlitch` | Analog TV interference | `distortion`, `distortion2`, `speed`, `rollSpeed` |

## Next Steps

- [Apply a Filter or Effect](./apply.md) - Learn the foundational effect APIs.
- [Blur Effects](./blur.md) - Apply blur techniques for depth and focus effects.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support