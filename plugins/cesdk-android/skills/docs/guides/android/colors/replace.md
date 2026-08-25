> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Replace Individual Colors](./replace.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-colors-replace/ColorsReplace.kt reference-only
import android.net.Uri
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.EffectType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

fun colorsReplace(engine: Engine) {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageUri = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg")

    fun addImageBlock(
        x: Float,
        y: Float,
    ): DesignBlock {
        val block = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(block, value = x)
        engine.block.setPositionY(block, value = y)
        engine.block.setWidth(block, value = 200F)
        engine.block.setHeight(block, value = 150F)
        engine.block.appendChild(parent = page, child = block)

        val fill = engine.block.createFill(FillType.Image)
        engine.block.setUri(
            block = fill,
            property = "fill/image/imageFileURI",
            value = imageUri,
        )
        engine.block.setFill(block, fill = fill)

        return block
    }

    val recolorBlock = addImageBlock(x = 50F, y = 50F)
    val recolorEffect = engine.block.createEffect(type = EffectType.Recolor)
    engine.block.setColor(
        block = recolorEffect,
        property = "effect/recolor/fromColor",
        value = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    )
    engine.block.setColor(
        block = recolorEffect,
        property = "effect/recolor/toColor",
        value = Color.fromRGBA(r = 0F, g = 0.5F, b = 1F, a = 1F),
    )
    engine.block.appendEffect(block = recolorBlock, effectBlock = recolorEffect)

    check(engine.block.getEffects(recolorBlock) == listOf(recolorEffect))

    val tolerancesBlock = addImageBlock(x = 300F, y = 50F)
    val tolerancesEffect = engine.block.createEffect(type = EffectType.Recolor)

    engine.block.setColor(
        block = tolerancesEffect,
        property = "effect/recolor/fromColor",
        value = Color.fromRGBA(r = 0.8F, g = 0.6F, b = 0.4F, a = 1F),
    )
    engine.block.setColor(
        block = tolerancesEffect,
        property = "effect/recolor/toColor",
        value = Color.fromRGBA(r = 0.3F, g = 0.7F, b = 0.3F, a = 1F),
    )
    engine.block.setFloat(tolerancesEffect, property = "effect/recolor/colorMatch", value = 0.3F)
    engine.block.setFloat(tolerancesEffect, property = "effect/recolor/brightnessMatch", value = 0.2F)
    engine.block.setFloat(tolerancesEffect, property = "effect/recolor/smoothness", value = 0.1F)
    engine.block.appendEffect(block = tolerancesBlock, effectBlock = tolerancesEffect)

    check(engine.block.getFloat(tolerancesEffect, property = "effect/recolor/colorMatch") == 0.3F)
    check(engine.block.getFloat(tolerancesEffect, property = "effect/recolor/brightnessMatch") == 0.2F)
    check(engine.block.getFloat(tolerancesEffect, property = "effect/recolor/smoothness") == 0.1F)

    val greenScreenBlock = addImageBlock(x = 550F, y = 50F)
    val greenScreenEffect = engine.block.createEffect(type = EffectType.GreenScreen)
    engine.block.setColor(
        block = greenScreenEffect,
        property = "effect/green_screen/fromColor",
        value = Color.fromRGBA(r = 0F, g = 1F, b = 0F, a = 1F),
    )
    engine.block.appendEffect(block = greenScreenBlock, effectBlock = greenScreenEffect)

    check(engine.block.getEffects(greenScreenBlock) == listOf(greenScreenEffect))

    val spillBlock = addImageBlock(x = 50F, y = 250F)
    val spillEffect = engine.block.createEffect(type = EffectType.GreenScreen)

    engine.block.setColor(
        block = spillEffect,
        property = "effect/green_screen/fromColor",
        value = Color.fromRGBA(r = 0.2F, g = 0.8F, b = 0.3F, a = 1F),
    )
    engine.block.setFloat(spillEffect, property = "effect/green_screen/colorMatch", value = 0.4F)
    engine.block.setFloat(spillEffect, property = "effect/green_screen/smoothness", value = 0.2F)
    engine.block.setFloat(spillEffect, property = "effect/green_screen/spill", value = 0.5F)
    engine.block.appendEffect(block = spillBlock, effectBlock = spillEffect)

    check(engine.block.getFloat(spillEffect, property = "effect/green_screen/colorMatch") == 0.4F)
    check(engine.block.getFloat(spillEffect, property = "effect/green_screen/smoothness") == 0.2F)
    check(engine.block.getFloat(spillEffect, property = "effect/green_screen/spill") == 0.5F)

    val stackedBlock = addImageBlock(x = 300F, y = 250F)
    val redToBlue = engine.block.createEffect(type = EffectType.Recolor)
    engine.block.setColor(
        block = redToBlue,
        property = "effect/recolor/fromColor",
        value = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    )
    engine.block.setColor(
        block = redToBlue,
        property = "effect/recolor/toColor",
        value = Color.fromRGBA(r = 0F, g = 0F, b = 1F, a = 1F),
    )
    engine.block.appendEffect(block = stackedBlock, effectBlock = redToBlue)

    val stackedGreenScreen = engine.block.createEffect(type = EffectType.GreenScreen)
    engine.block.setColor(
        block = stackedGreenScreen,
        property = "effect/green_screen/fromColor",
        value = Color.fromRGBA(r = 0F, g = 1F, b = 0F, a = 1F),
    )
    engine.block.appendEffect(block = stackedBlock, effectBlock = stackedGreenScreen)

    val stackedEffects = engine.block.getEffects(stackedBlock)
    check(stackedEffects == listOf(redToBlue, stackedGreenScreen))

    engine.block.setEffectEnabled(effectBlock = stackedEffects[0], enabled = false)
    val isFirstEffectEnabled = engine.block.isEffectEnabled(stackedEffects[0])

    engine.block.removeEffect(block = stackedBlock, index = 1)
    engine.block.destroy(stackedGreenScreen)

    check(!isFirstEffectEnabled)
    check(engine.block.getEffects(stackedBlock) == listOf(redToBlue))

    val batchBlock = addImageBlock(x = 550F, y = 250F)

    val allGraphicBlocks = engine.block.findByType(type = DesignBlockType.Graphic)
    for (block in allGraphicBlocks) {
        if (engine.block.getEffects(block).isNotEmpty()) {
            continue
        }

        val batchRecolor = engine.block.createEffect(type = EffectType.Recolor)
        engine.block.setColor(
            block = batchRecolor,
            property = "effect/recolor/fromColor",
            value = Color.fromRGBA(r = 0.8F, g = 0.7F, b = 0.6F, a = 1F),
        )
        engine.block.setColor(
            block = batchRecolor,
            property = "effect/recolor/toColor",
            value = Color.fromRGBA(r = 0.6F, g = 0.7F, b = 0.9F, a = 1F),
        )
        engine.block.setFloat(batchRecolor, property = "effect/recolor/colorMatch", value = 0.25F)
        engine.block.appendEffect(block = block, effectBlock = batchRecolor)
    }

    check(engine.block.getEffects(batchBlock).size == 1)
}
```

Selectively swap image colors or remove colored backgrounds using CE.SDK's
Recolor and Green Screen effects.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.1-rc.0/engine-guides-colors-replace)

CE.SDK provides two effects for selective color modification. **Recolor** replaces pixels that match a source color with a target color, while **Green Screen** makes pixels that match a source color transparent. Both effects expose tolerance parameters so you can control how closely pixels must match before they are changed.

<EngineReferenceNote {...props} />

This guide covers the built-in Android editor controls and the programmatic block API for applying, tuning, stacking, and batch-processing color replacement effects.

## Using the Built-In Effects UI

The standard Android editor exposes Recolor and Green Screen through the effects controls for supported image or graphic blocks. Users select a block, add the effect, choose the source color, and adjust the available color-match sliders while previewing the result on the canvas.

The same effect properties are available in code. Use the UI when users should make creative choices interactively, and use the engine API when your app needs repeatable color changes, automation, or batch processing.

## Prepare the Scene

The sample creates a scene and page, then uses a small `addImageBlock` helper to create one image-filled graphic block per section so the effects can be configured independently.

```kotlin highlight-android-prepare-scene
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)
```

```kotlin highlight-android-create-image-blocks
    val imageUri = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg")

    fun addImageBlock(
        x: Float,
        y: Float,
    ): DesignBlock {
        val block = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(block, value = x)
        engine.block.setPositionY(block, value = y)
        engine.block.setWidth(block, value = 200F)
        engine.block.setHeight(block, value = 150F)
        engine.block.appendChild(parent = page, child = block)

        val fill = engine.block.createFill(FillType.Image)
        engine.block.setUri(
            block = fill,
            property = "fill/image/imageFileURI",
            value = imageUri,
        )
        engine.block.setFill(block, fill = fill)

        return block
    }
```

## Programmatic Color Replacement

Effects are design blocks. Create an effect with `createEffect`, configure its properties, then attach it to a target block with `appendEffect`.

### Creating a Recolor Effect

The Recolor effect replaces pixels matching a source color with a target color. Use `EffectType.Recolor`, then set `effect/recolor/fromColor` and `effect/recolor/toColor`.

```kotlin highlight-android-create-recolor
val recolorBlock = addImageBlock(x = 50F, y = 50F)
val recolorEffect = engine.block.createEffect(type = EffectType.Recolor)
engine.block.setColor(
    block = recolorEffect,
    property = "effect/recolor/fromColor",
    value = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
)
engine.block.setColor(
    block = recolorEffect,
    property = "effect/recolor/toColor",
    value = Color.fromRGBA(r = 0F, g = 0.5F, b = 1F, a = 1F),
)
engine.block.appendEffect(block = recolorBlock, effectBlock = recolorEffect)
```

`fromColor` selects the color to match in the image. `toColor` defines the replacement color. `Color.fromRGBA` accepts either Float components in the `0F` to `1F` range or Int components in the 0 to 255 range.

### Configuring Color Matching Precision

Adjust the tolerance parameters with `setFloat` to fine-tune which pixels are affected.

```kotlin highlight-android-configure-recolor
    val tolerancesBlock = addImageBlock(x = 300F, y = 50F)
    val tolerancesEffect = engine.block.createEffect(type = EffectType.Recolor)

    engine.block.setColor(
        block = tolerancesEffect,
        property = "effect/recolor/fromColor",
        value = Color.fromRGBA(r = 0.8F, g = 0.6F, b = 0.4F, a = 1F),
    )
    engine.block.setColor(
        block = tolerancesEffect,
        property = "effect/recolor/toColor",
        value = Color.fromRGBA(r = 0.3F, g = 0.7F, b = 0.3F, a = 1F),
    )
    engine.block.setFloat(tolerancesEffect, property = "effect/recolor/colorMatch", value = 0.3F)
    engine.block.setFloat(tolerancesEffect, property = "effect/recolor/brightnessMatch", value = 0.2F)
    engine.block.setFloat(tolerancesEffect, property = "effect/recolor/smoothness", value = 0.1F)
    engine.block.appendEffect(block = tolerancesBlock, effectBlock = tolerancesEffect)
```

| Property | Range | Description |
| --- | --- | --- |
| `effect/recolor/colorMatch` | 0-1 | Hue tolerance. Higher values include more color variations around the source color. |
| `effect/recolor/brightnessMatch` | 0-1 | Brightness weighting. Lower values let brighter or darker pixels match; higher values require brightness closer to the source color. |
| `effect/recolor/smoothness` | 0-1 | Edge blending. Higher values create softer transitions at the boundaries of affected areas. |

### Creating a Green Screen Effect

The Green Screen effect removes pixels matching a specified color, making those pixels transparent. Use `EffectType.GreenScreen` and set `effect/green_screen/fromColor`.

```kotlin highlight-android-create-green-screen
val greenScreenBlock = addImageBlock(x = 550F, y = 50F)
val greenScreenEffect = engine.block.createEffect(type = EffectType.GreenScreen)
engine.block.setColor(
    block = greenScreenEffect,
    property = "effect/green_screen/fromColor",
    value = Color.fromRGBA(r = 0F, g = 1F, b = 0F, a = 1F),
)
engine.block.appendEffect(block = greenScreenBlock, effectBlock = greenScreenEffect)
```

Use this effect for workflows such as removing a solid-color background from a product or subject image.

### Configuring Green Screen Parameters

Green Screen exposes precision parameters for the color match, cutout edge, and color-spill reduction.

```kotlin highlight-android-configure-green-screen
    val spillBlock = addImageBlock(x = 50F, y = 250F)
    val spillEffect = engine.block.createEffect(type = EffectType.GreenScreen)

    engine.block.setColor(
        block = spillEffect,
        property = "effect/green_screen/fromColor",
        value = Color.fromRGBA(r = 0.2F, g = 0.8F, b = 0.3F, a = 1F),
    )
    engine.block.setFloat(spillEffect, property = "effect/green_screen/colorMatch", value = 0.4F)
    engine.block.setFloat(spillEffect, property = "effect/green_screen/smoothness", value = 0.2F)
    engine.block.setFloat(spillEffect, property = "effect/green_screen/spill", value = 0.5F)
    engine.block.appendEffect(block = spillBlock, effectBlock = spillEffect)
```

| Property | Description |
| --- | --- |
| `effect/green_screen/colorMatch` | Tolerance for matching the background color. |
| `effect/green_screen/smoothness` | Edge softness for cleaner cutouts around subjects. |
| `effect/green_screen/spill` | Reduces color bleed from the removed background onto subject edges. |

## Managing Multiple Effects

A block can hold multiple effects. Use `getEffects` to read the stack, `appendEffect` or `insertEffect` to place effects, `setEffectEnabled` to toggle an effect without removing it, and `removeEffect` to detach an effect by index.

```kotlin highlight-android-manage-effects
    val stackedBlock = addImageBlock(x = 300F, y = 250F)
    val redToBlue = engine.block.createEffect(type = EffectType.Recolor)
    engine.block.setColor(
        block = redToBlue,
        property = "effect/recolor/fromColor",
        value = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    )
    engine.block.setColor(
        block = redToBlue,
        property = "effect/recolor/toColor",
        value = Color.fromRGBA(r = 0F, g = 0F, b = 1F, a = 1F),
    )
    engine.block.appendEffect(block = stackedBlock, effectBlock = redToBlue)

    val stackedGreenScreen = engine.block.createEffect(type = EffectType.GreenScreen)
    engine.block.setColor(
        block = stackedGreenScreen,
        property = "effect/green_screen/fromColor",
        value = Color.fromRGBA(r = 0F, g = 1F, b = 0F, a = 1F),
    )
    engine.block.appendEffect(block = stackedBlock, effectBlock = stackedGreenScreen)

    val stackedEffects = engine.block.getEffects(stackedBlock)
    check(stackedEffects == listOf(redToBlue, stackedGreenScreen))

    engine.block.setEffectEnabled(effectBlock = stackedEffects[0], enabled = false)
    val isFirstEffectEnabled = engine.block.isEffectEnabled(stackedEffects[0])

    engine.block.removeEffect(block = stackedBlock, index = 1)
    engine.block.destroy(stackedGreenScreen)
```

The snippet adds Recolor and Green Screen effects to show stack order, disables the first effect without removing it, reads its enabled state, and removes the second effect by index. Destroy detached effect blocks when your app no longer needs them.

## Batch Processing

Apply the same color replacement configuration to every graphic block in a scene. Use `findByType(DesignBlockType.Graphic)` to locate targets, and skip blocks that already have effects when you need to preserve existing edits.

```kotlin highlight-android-batch-processing
    val allGraphicBlocks = engine.block.findByType(type = DesignBlockType.Graphic)
    for (block in allGraphicBlocks) {
        if (engine.block.getEffects(block).isNotEmpty()) {
            continue
        }

        val batchRecolor = engine.block.createEffect(type = EffectType.Recolor)
        engine.block.setColor(
            block = batchRecolor,
            property = "effect/recolor/fromColor",
            value = Color.fromRGBA(r = 0.8F, g = 0.7F, b = 0.6F, a = 1F),
        )
        engine.block.setColor(
            block = batchRecolor,
            property = "effect/recolor/toColor",
            value = Color.fromRGBA(r = 0.6F, g = 0.7F, b = 0.9F, a = 1F),
        )
        engine.block.setFloat(batchRecolor, property = "effect/recolor/colorMatch", value = 0.25F)
        engine.block.appendEffect(block = block, effectBlock = batchRecolor)
    }
```

This pattern is useful for product variations, template personalization, and other automated image-processing workflows.

## Troubleshooting

**Colors not matching as expected**: Increase `colorMatch` for a broader selection, or decrease it when the source color should match more precisely. Check that your source color is close to the actual color in the image.

**Harsh edges around replaced areas**: Increase `smoothness` to soften transitions at the boundaries of affected pixels.

**Color spill on Green Screen subjects**: Increase `spill` to reduce tint from the removed background on subject edges.

**Effect not visible**: Verify that the effect is enabled with `isEffectEnabled` and that the effect was attached to the target block with `appendEffect`.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.create()` | Create the scene used by the sample. |
| `engine.block.create(blockType=_)` | Create page and graphic blocks. |
| `engine.block.setWidth(block=_, value=_)` | Set page or block width. |
| `engine.block.setHeight(block=_, value=_)` | Set page or block height. |
| `engine.block.appendChild(parent=_, child=_)` | Add a page or graphic block to its parent. |
| `engine.block.createShape(type=ShapeType.Rect)` | Create a rectangular shape for a graphic block. |
| `engine.block.setShape(block=_, shape=_)` | Assign a shape to a graphic block. |
| `engine.block.setPositionX(block=_, value=_)` | Set a block's horizontal position. |
| `engine.block.setPositionY(block=_, value=_)` | Set a block's vertical position. |
| `engine.block.createFill(fillType=FillType.Image)` | Create an image fill. |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Set the image URI on an image fill. |
| `engine.block.setFill(block=_, fill=_)` | Assign the image fill to a graphic block. |
| `engine.block.createEffect(type=EffectType.Recolor)` | Create a Recolor effect block. |
| `engine.block.createEffect(type=EffectType.GreenScreen)` | Create a Green Screen effect block. |
| `engine.block.appendEffect(block=_, effectBlock=_)` | Add an effect to a block's effect stack. |
| `engine.block.insertEffect(block=_, effectBlock=_, index=_)` | Add an effect at a specific stack index. |
| `engine.block.getEffects(block=_)` | Read the effects applied to a block. |
| `engine.block.removeEffect(block=_, index=_)` | Detach an effect by stack index. |
| `engine.block.destroy(block=_)` | Destroy a detached effect block that is no longer needed. |
| `engine.block.setEffectEnabled(effectBlock=_, enabled=_)` | Enable or disable an effect without removing it. |
| `engine.block.isEffectEnabled(effectBlock=_)` | Check whether an effect is enabled. |
| `Color.fromRGBA(r=_, g=_, b=_, a=_)` | Create source and target RGBA colors for effect properties. |
| `engine.block.setColor(block=_, property="effect/recolor/fromColor", value=_)` | Set the source color matched by Recolor. |
| `engine.block.setColor(block=_, property="effect/recolor/toColor", value=_)` | Set the replacement color used by Recolor. |
| `engine.block.setColor(block=_, property="effect/green_screen/fromColor", value=_)` | Set the color removed by Green Screen. |
| `engine.block.setFloat(block=_, property="effect/recolor/colorMatch", value=_)` | Set Recolor hue tolerance. |
| `engine.block.setFloat(block=_, property="effect/recolor/brightnessMatch", value=_)` | Set Recolor brightness tolerance. |
| `engine.block.setFloat(block=_, property="effect/recolor/smoothness", value=_)` | Set Recolor edge blending. |
| `engine.block.setFloat(block=_, property="effect/green_screen/colorMatch", value=_)` | Set Green Screen color-match tolerance. |
| `engine.block.setFloat(block=_, property="effect/green_screen/smoothness", value=_)` | Set Green Screen edge softness. |
| `engine.block.setFloat(block=_, property="effect/green_screen/spill", value=_)` | Set Green Screen spill reduction. |
| `engine.block.findByType(type=DesignBlockType.Graphic)` | Find graphic blocks for batch processing. |

## Next Steps

- [Apply Colors](./apply.md) - Apply solid colors to shapes, backgrounds, and other design elements.
- [Apply a Filter or Effect](../filters-and-effects/apply.md) - Apply, configure, stack, and manage filters and effects.
- [Export Overview](../export-save-publish/export/overview.md) - Export processed images in various formats.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support