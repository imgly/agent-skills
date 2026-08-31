> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Adjust Colors](./adjust.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-colors-adjust/ColorsAdjust.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlockType
import ly.img.engine.EffectType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import kotlin.math.abs

data class ColorsAdjust(
    val brightness: Float,
    val contrast: Float,
    val saturation: Float,
    val propertyCount: Int,
    val disabledState: Boolean,
    val enabledState: Boolean,
    val moodySaturation: Float,
    val orderedStackMatches: Boolean,
    val sharpness: Float,
    val resetSucceeded: Boolean,
    val removed: Boolean,
)

suspend fun colorsAdjust(engine: Engine): ColorsAdjust {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageGraphicBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageGraphicBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageGraphicBlock, value = 100F)
    engine.block.setPositionY(imageGraphicBlock, value = 50F)
    engine.block.setWidth(imageGraphicBlock, value = 300F)
    engine.block.setHeight(imageGraphicBlock, value = 300F)
    engine.block.appendChild(parent = page, child = imageGraphicBlock)

    val fill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = fill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )
    engine.block.setFill(imageGraphicBlock, fill = fill)

    val sceneSupportsEffects = engine.block.supportsEffects(scene)
    val pageSupportsEffects = engine.block.supportsEffects(page)
    val imageGraphicSupportsEffects = engine.block.supportsEffects(imageGraphicBlock)

    require(!sceneSupportsEffects) { "Scenes do not support effect stacks." }
    require(pageSupportsEffects) { "Pages can expose effect stacks." }
    require(imageGraphicSupportsEffects) { "Image-backed graphic blocks can render adjustments." }

    val adjustmentsEffect = engine.block.createEffect(type = EffectType.Adjustments)
    engine.block.appendEffect(block = imageGraphicBlock, effectBlock = adjustmentsEffect)

    check(engine.block.getEffects(imageGraphicBlock).contains(adjustmentsEffect))

    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/brightness", value = 0.2F)
    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/contrast", value = 0.15F)
    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/saturation", value = 0.3F)

    val brightness = engine.block.getFloat(adjustmentsEffect, property = "effect/adjustments/brightness")
    val contrast = engine.block.getFloat(adjustmentsEffect, property = "effect/adjustments/contrast")
    val saturation = engine.block.getFloat(adjustmentsEffect, property = "effect/adjustments/saturation")
    val availableProperties = engine.block.findAllProperties(adjustmentsEffect)

    check(abs(brightness - 0.2F) < 0.0001F)
    check(abs(contrast - 0.15F) < 0.0001F)
    check(abs(saturation - 0.3F) < 0.0001F)
    check(availableProperties.any { it.startsWith("effect/adjustments/") })

    engine.block.setEffectEnabled(effectBlock = adjustmentsEffect, enabled = false)
    val disabledState = engine.block.isEffectEnabled(adjustmentsEffect)

    engine.block.setEffectEnabled(effectBlock = adjustmentsEffect, enabled = true)
    val enabledState = engine.block.isEffectEnabled(adjustmentsEffect)

    check(!disabledState)
    check(enabledState)

    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/brightness", value = -0.1F)
    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/contrast", value = 0.35F)
    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/saturation", value = -0.25F)
    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/temperature", value = -0.2F)

    val moodySaturation = engine.block.getFloat(adjustmentsEffect, property = "effect/adjustments/saturation")
    check(abs(moodySaturation - -0.25F) < 0.0001F)

    val pixelizeEffect = engine.block.createEffect(type = EffectType.Pixelize)
    engine.block.insertEffect(block = imageGraphicBlock, effectBlock = pixelizeEffect, index = 1)

    val orderedEffects = engine.block.getEffects(imageGraphicBlock)

    val orderedStackMatches = orderedEffects == listOf(adjustmentsEffect, pixelizeEffect)
    check(orderedStackMatches)

    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/sharpness", value = 0.3F)
    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/clarity", value = 0.25F)
    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/highlights", value = -0.15F)
    engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/shadows", value = 0.2F)

    val sharpness = engine.block.getFloat(adjustmentsEffect, property = "effect/adjustments/sharpness")
    check(abs(sharpness - 0.3F) < 0.0001F)

    val adjustmentProperties = engine.block
        .findAllProperties(adjustmentsEffect)
        .filter { it.startsWith("effect/adjustments/") }
    check(adjustmentProperties.isNotEmpty())

    adjustmentProperties.forEach { property ->
        engine.block.setFloat(adjustmentsEffect, property = property, value = 0F)
    }

    val resetSucceeded = adjustmentProperties.all { property ->
        abs(engine.block.getFloat(adjustmentsEffect, property = property)) < 0.0001F
    }
    check(resetSucceeded)

    val effects = engine.block.getEffects(imageGraphicBlock)
    val adjustmentIndex = effects.indexOf(adjustmentsEffect)

    require(adjustmentIndex >= 0) { "The adjustments effect must be attached before it can be removed." }
    engine.block.removeEffect(block = imageGraphicBlock, index = adjustmentIndex)
    engine.block.destroy(adjustmentsEffect)

    val removed = engine.block.getEffects(imageGraphicBlock).none { it == adjustmentsEffect }
    check(removed)

    val pixelizeIndex = engine.block.getEffects(imageGraphicBlock).indexOf(pixelizeEffect)
    if (pixelizeIndex >= 0) {
        engine.block.removeEffect(block = imageGraphicBlock, index = pixelizeIndex)
    }
    engine.block.destroy(pixelizeEffect)

    return ColorsAdjust(
        brightness = brightness,
        contrast = contrast,
        saturation = saturation,
        propertyCount = adjustmentProperties.size,
        disabledState = disabledState,
        enabledState = enabledState,
        moodySaturation = moodySaturation,
        orderedStackMatches = orderedStackMatches,
        sharpness = sharpness,
        resetSucceeded = resetSucceeded,
        removed = removed,
    )
}
```

Fine-tune image-backed graphic blocks on Android by applying CE.SDK adjustment effects for brightness, contrast, saturation, and tonal refinement.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-rc.0/engine-guides-colors-adjust)

Color adjustments modify the visual appearance of image-backed graphic blocks by changing properties like brightness, contrast, saturation, and color temperature. CE.SDK represents these changes as an `EffectType.Adjustments` block that you attach to a compatible design block.

This guide covers the default Android adjustments UI and the engine APIs you can use when your app needs to apply the same changes programmatically.

<EngineReferenceNote {...props} />

## Using the Built-in Adjustments UI

The default Android editor exposes adjustments through its built-in dock and inspector controls when the current selection allows appearance adjustments. Users can open the adjustments sheet, move sliders, and preview the result immediately.

The built-in sheet uses the same adjustments effect shown below: it creates the effect when needed, attaches it to the selected block, and writes float properties on that effect block.

## Check Block Compatibility

Before applying adjustments, verify that the target block supports effects. Scene blocks do not expose effect stacks. Pages and image-backed graphic blocks both support effects; choose the graphic block when the adjustment should affect image content rather than the entire page background.

```kotlin highlight-android-check-support
    val sceneSupportsEffects = engine.block.supportsEffects(scene)
    val pageSupportsEffects = engine.block.supportsEffects(page)
    val imageGraphicSupportsEffects = engine.block.supportsEffects(imageGraphicBlock)

    require(!sceneSupportsEffects) { "Scenes do not support effect stacks." }
    require(pageSupportsEffects) { "Pages can expose effect stacks." }
    require(imageGraphicSupportsEffects) { "Image-backed graphic blocks can render adjustments." }
```

## Create and Apply Adjustments Effect

Create an `EffectType.Adjustments` block and append it to the image-backed graphic block. A block should only have one adjustments effect in its effect stack. That effect stores all color adjustment properties for the block.

```kotlin highlight-android-create-adjustments
val adjustmentsEffect = engine.block.createEffect(type = EffectType.Adjustments)
engine.block.appendEffect(block = imageGraphicBlock, effectBlock = adjustmentsEffect)
```

## Modify Adjustment Properties

Set individual adjustment values with `setFloat()` on the adjustments effect block. Each adjustment property uses the `effect/adjustments/` prefix followed by the property name.

```kotlin highlight-android-set-properties
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/brightness", value = 0.2F)
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/contrast", value = 0.15F)
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/saturation", value = 0.3F)
```

CE.SDK provides these adjustment properties:

| Property | Description |
| --- | --- |
| `brightness` | Overall lightness; positive values lighten and negative values darken |
| `contrast` | Tonal range; positive values increase separation between light and dark |
| `saturation` | Color intensity; positive values increase vibrancy and negative values desaturate |
| `exposure` | Exposure compensation |
| `gamma` | Midtone brightness through the gamma curve |
| `highlights` | Bright area intensity |
| `shadows` | Dark area intensity |
| `whites` | White point adjustment |
| `blacks` | Black point adjustment |
| `temperature` | Warm/cool color cast; positive for warmer, negative for cooler tones |
| `sharpness` | Edge sharpness; positive values sharpen and negative values soften edges |
| `clarity` | Midtone contrast |

The built-in editor sliders use `-1F` to `1F` for these adjustment properties, while `setFloat()` writes the float values you provide. Validate custom controls and presets before writing them.

## Read Adjustment Values

Read current adjustment values with `getFloat()` and the same property paths. Use `findAllProperties()` when you need to inspect which properties are available on the effect block.

```kotlin highlight-android-read-values
val brightness = engine.block.getFloat(adjustmentsEffect, property = "effect/adjustments/brightness")
val contrast = engine.block.getFloat(adjustmentsEffect, property = "effect/adjustments/contrast")
val saturation = engine.block.getFloat(adjustmentsEffect, property = "effect/adjustments/saturation")
val availableProperties = engine.block.findAllProperties(adjustmentsEffect)
```

This is useful for custom controls, synchronization, or persisting adjustment settings in your app.

## Enable and Disable Adjustments

Toggle the adjustments effect when you need a before/after preview without losing the configured values.

```kotlin highlight-android-enable-disable
    engine.block.setEffectEnabled(effectBlock = adjustmentsEffect, enabled = false)
    val disabledState = engine.block.isEffectEnabled(adjustmentsEffect)

    engine.block.setEffectEnabled(effectBlock = adjustmentsEffect, enabled = true)
    val enabledState = engine.block.isEffectEnabled(adjustmentsEffect)
```

Disabling the effect keeps it attached to the block. Re-enable it to render the same adjustment values again.

## Applying Different Adjustment Styles

Combine several adjustment properties to create a specific look. This example creates a cooler, moodier result with lower brightness, higher contrast, reduced saturation, and lower temperature.

```kotlin highlight-android-combine-effects
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/brightness", value = -0.1F)
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/contrast", value = 0.35F)
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/saturation", value = -0.25F)
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/temperature", value = -0.2F)
```

Use the same pattern for warm, vibrant, or high-contrast styles.

## Combine Adjustments with Other Effects

Effect stacks render in order, so add effects in the order you want them to render, or use `insertEffect()` when a new effect needs a specific index. This example inserts a pixelize effect after the adjustments effect and reads the stack back to confirm the order.

```kotlin highlight-android-stack-order
    val pixelizeEffect = engine.block.createEffect(type = EffectType.Pixelize)
    engine.block.insertEffect(block = imageGraphicBlock, effectBlock = pixelizeEffect, index = 1)

    val orderedEffects = engine.block.getEffects(imageGraphicBlock)
```

Use `appendEffect()` when a new effect can render after the existing stack, `insertEffect()` when it must occupy a specific index, and `getEffects()` when you need to inspect the current stack.

## Refinement Adjustments

Refinement properties help tune detail and tonal balance after the basic color correction is in place.

```kotlin highlight-android-refinement-adjustments
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/sharpness", value = 0.3F)
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/clarity", value = 0.25F)
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/highlights", value = -0.15F)
engine.block.setFloat(adjustmentsEffect, property = "effect/adjustments/shadows", value = 0.2F)
```

The refinement properties are useful for photo enhancement:

- **Sharpness**: Enhances edge definition.
- **Clarity**: Increases local midtone contrast.
- **Highlights**: Controls bright image areas.
- **Shadows**: Controls dark image areas.

## Reset Adjustments

Reset adjustments by writing `0F` to each property. This keeps the effect attached while returning it to its neutral state.

```kotlin highlight-android-reset-adjustments
    val adjustmentProperties = engine.block
        .findAllProperties(adjustmentsEffect)
        .filter { it.startsWith("effect/adjustments/") }
    check(adjustmentProperties.isNotEmpty())

    adjustmentProperties.forEach { property ->
        engine.block.setFloat(adjustmentsEffect, property = property, value = 0F)
    }
```

## Remove Adjustments

When you no longer need the adjustments effect, remove it from the block's effect stack and destroy the effect block when it is no longer used.

```kotlin highlight-android-remove-adjustments
    val effects = engine.block.getEffects(imageGraphicBlock)
    val adjustmentIndex = effects.indexOf(adjustmentsEffect)

    require(adjustmentIndex >= 0) { "The adjustments effect must be attached before it can be removed." }
    engine.block.removeEffect(block = imageGraphicBlock, index = adjustmentIndex)
    engine.block.destroy(adjustmentsEffect)
```

`removeEffect()` takes the effect index within the block's effect stack, so read the stack before removing the effect.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Adjustments are not visible | Check `supportsEffects()` on the target block, verify the effect is enabled, and make sure it was appended to the block. |
| Values have no visible effect | Confirm the values are non-zero, the block contains image content, and the effect stack order is correct when multiple effects are attached. |
| Property lookup fails | Use `findAllProperties()` on the adjustments effect and verify the `effect/adjustments/` prefix. |

## API Reference

| API | Description |
| --- | --- |
| `engine.block.supportsEffects(block=_)` | Checks whether a design block can render effects |
| `engine.block.createEffect(type=EffectType.Adjustments)` | Creates an adjustments effect block |
| `engine.block.createEffect(type=EffectType.Pixelize)` | Creates a second effect used to demonstrate effect stack order |
| `engine.block.appendEffect(block=_, effectBlock=_)` | Adds the effect to the end of a block's effect stack |
| `engine.block.insertEffect(block=_, effectBlock=_, index=_)` | Inserts an effect at a specific stack index |
| `engine.block.getEffects(block=_)` | Returns the effects attached to a block |
| `engine.block.removeEffect(block=_, index=_)` | Removes the effect at the specified stack index |
| `engine.block.setEffectEnabled(effectBlock=_, enabled=_)` | Enables or disables an effect block |
| `engine.block.isEffectEnabled(effectBlock=_)` | Returns whether an effect block is enabled |
| `engine.block.setFloat(block=_, property="effect/adjustments/brightness", value=_)` | Writes a float adjustment value |
| `engine.block.getFloat(block=_, property="effect/adjustments/brightness")` | Reads a float adjustment value |
| `engine.block.findAllProperties(block=_)` | Lists the properties available on a block |
| `engine.block.destroy(block=_)` | Destroys an unused effect block |

## Next Steps

- [Apply Colors](./apply.md) - Apply colors to fills, strokes, and shadows.
- [Apply a Filter or Effect](../filters-and-effects/apply.md) - Apply, configure, stack, and manage filters and effects.
- [Color Conversion](./conversion.md) - Convert between color spaces.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support