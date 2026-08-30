> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Apply Custom LUT Filter](./create-custom-lut-filter.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-custom-lut-filter/CustomLUTFilter.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.EffectType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

data class CustomLUTFilterResult(
    val imageBlock: DesignBlock,
    val lutFilter: DesignBlock,
    val appliedEffects: List<DesignBlock>,
    val effectEnabled: Boolean,
)

suspend fun customLUTFilter(engine: Engine): CustomLUTFilterResult {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageBlock, value = 100F)
    engine.block.setPositionY(imageBlock, value = 50F)
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 300F)
    engine.block.appendChild(parent = page, child = imageBlock)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        imageFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )
    engine.block.setFill(imageBlock, fill = imageFill)

    val lutFilter = engine.block.createEffect(EffectType.LutFilter)

    val bundledAssetBaseUri = "file:///android_asset/imgly-assets"
    val lutUri = Uri.parse(
        "$bundledAssetBaseUri/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png",
    )

    engine.block.setUri(
        lutFilter,
        property = "effect/lut_filter/lutFileURI",
        value = lutUri,
    )
    engine.block.setInt(lutFilter, property = "effect/lut_filter/verticalTileCount", value = 5)
    engine.block.setInt(lutFilter, property = "effect/lut_filter/horizontalTileCount", value = 5)

    engine.block.setFloat(lutFilter, property = "effect/lut_filter/intensity", value = 0.9F)

    val supportsEffects = engine.block.supportsEffects(imageBlock)
    require(supportsEffects) { "The image block must support effects." }

    engine.block.appendEffect(block = imageBlock, effectBlock = lutFilter)
    val appliedEffects = engine.block.getEffects(imageBlock)

    check(appliedEffects == listOf(lutFilter))

    engine.block.setEffectEnabled(effectBlock = lutFilter, enabled = false)
    val disabledState = engine.block.isEffectEnabled(lutFilter)

    engine.block.setEffectEnabled(effectBlock = lutFilter, enabled = true)
    val effectEnabled = engine.block.isEffectEnabled(lutFilter)

    check(!disabledState)
    check(effectEnabled)

    return CustomLUTFilterResult(
        imageBlock = imageBlock,
        lutFilter = lutFilter,
        appliedEffects = appliedEffects,
        effectEnabled = effectEnabled,
    )
}

fun removeCustomLUTFilter(
    engine: Engine,
    imageBlock: DesignBlock,
    lutFilter: DesignBlock,
) {
    val lutFilterIndex = engine.block.getEffects(imageBlock).indexOf(lutFilter)
    require(lutFilterIndex >= 0) { "The LUT filter must be attached before it can be removed." }

    engine.block.removeEffect(block = imageBlock, index = lutFilterIndex)
    engine.block.destroy(lutFilter)
}
```

Apply custom LUT (Look-Up Table) filters to image blocks with CE.SDK's
Android Engine API.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260830/engine-guides-custom-lut-filter)

<EngineReferenceNote {...props} />

LUT filters remap colors through a predefined transformation table, making them useful for repeatable color grading and brand-aligned image treatments. This guide shows how to configure a tiled PNG LUT, apply it to an image-backed graphic block, and manage the effect after it is attached.

For organizing collections of custom filters through asset sources, see [Create Custom Filters](./create-custom-filters.md).

## Understanding LUT Image Format

CE.SDK uses a tiled PNG format where a 3D color cube is laid out as a 2D grid. Each tile represents a slice of the color cube along the blue axis.

The LUT image requires two configuration values:

- **`horizontalTileCount`** - Number of tiles across the image width
- **`verticalTileCount`** - Number of tiles down the image height

CE.SDK supports these tile configurations:

- 5 x 5 tiles with 128px cube size
- 8 x 8 tiles with 512px cube size

Standard `.cube` files must be converted to this tiled PNG format before you use them with `EffectType.LutFilter`.

## Creating LUT PNG Images

### Starting From the Identity LUT

The fastest way to author a custom LUT filter is to edit the identity LUT: a neutral 8 x 8 tiled PNG that produces no color change when applied. Any color adjustments you make to the image are recorded as the filter transformation, and the exported PNG can be used directly with the LUT filter effect.

<img src="content-assets/6e3f49/identity.png" alt="Identity LUT" />

To author a new filter from the identity LUT:

1. [Download the identity LUT](https://img.ly/docs/cesdk/android/filters-and-effects/create-custom-lut-filter-6e3f49/content-assets/6e3f49/identity.png)
2. Open it in an image editor that applies adjustments to the whole image
3. Apply color adjustments such as curves, levels, hue, saturation, or color balance
4. Export the edited image as PNG and include that file in your app or serve it from a URL

Do not crop, rotate, resize, or otherwise change the geometry of the image. Each pixel in the identity LUT is a specific color sample, so reorganizing pixels breaks the color mapping.

> **WARNING:** Save the edited LUT as PNG. Lossy formats can introduce compression artifacts that produce visible color banding.

### Converting .cube to Tiled PNG

If you already have a `.cube` LUT, convert it to CE.SDK's tiled PNG layout before applying it on Android:

1. Parse the `.cube` file to read the 3D color lookup table data
2. Arrange each blue-channel slice as a tile containing the red-green color plane
3. Export the tile grid as PNG

CE.SDK's built-in LUTs follow the naming pattern `imgly_lut_{name}_{h}_{v}_{cubeSize}.png`, where `h` and `v` are tile counts and `cubeSize` identifies the LUT precision.

### Using CE.SDK's Built-In LUTs

Built-in LUT assets are useful as format-verified references. The filter extension at `ly.img.filter/LUTs` contains tiled PNGs you can inspect to confirm tile counts, cube size, and layout when authoring or converting your own filters.

## Hosting LUT Files

The Android Engine needs a URI it can load. Use an HTTPS URL for remotely hosted LUTs, or package the PNG with your app and pass a URI that resolves to the bundled file.

Make sure the values you pass for `horizontalTileCount` and `verticalTileCount` match the actual PNG grid. Incorrect tile counts usually render as distorted colors.

## Prepare the Scene

The sample starts with a design scene and page. Your app can use an existing scene instead; the important part is that the target block supports effects.

```kotlin highlight-android-prepare-scene
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)
```

## Add an Image Block

Create a graphic block with an image fill. The LUT effect is attached to the graphic block, not to the fill block.

```kotlin highlight-android-create-image-block
    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageBlock, value = 100F)
    engine.block.setPositionY(imageBlock, value = 50F)
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 300F)
    engine.block.appendChild(parent = page, child = imageBlock)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        imageFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )
    engine.block.setFill(imageBlock, fill = imageFill)
```

## Create the LUT Effect

Create a LUT effect with the type-safe `EffectType.LutFilter` constant.

```kotlin highlight-android-create-effect
val lutFilter = engine.block.createEffect(EffectType.LutFilter)
```

## Configure LUT Properties

Set the LUT image URI and tile counts on the effect block. The sample uses a bundled LUT file with a 5 x 5 tile layout.

```kotlin highlight-android-configure-lut
    val bundledAssetBaseUri = "file:///android_asset/imgly-assets"
    val lutUri = Uri.parse(
        "$bundledAssetBaseUri/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png",
    )

    engine.block.setUri(
        lutFilter,
        property = "effect/lut_filter/lutFileURI",
        value = lutUri,
    )
    engine.block.setInt(lutFilter, property = "effect/lut_filter/verticalTileCount", value = 5)
    engine.block.setInt(lutFilter, property = "effect/lut_filter/horizontalTileCount", value = 5)
```

## Set Filter Intensity

Control the strength of the color transformation with `effect/lut_filter/intensity`.

```kotlin highlight-android-set-intensity
engine.block.setFloat(lutFilter, property = "effect/lut_filter/intensity", value = 0.9F)
```

Values range from `0.0` for no effect to `1.0` for full strength. Intermediate values are useful for subtle color grading.

## Apply the Effect

Check that the target block supports effects, then attach the configured LUT effect with `appendEffect`.

```kotlin highlight-android-apply-effect
    val supportsEffects = engine.block.supportsEffects(imageBlock)
    require(supportsEffects) { "The image block must support effects." }

    engine.block.appendEffect(block = imageBlock, effectBlock = lutFilter)
    val appliedEffects = engine.block.getEffects(imageBlock)
```

The effect renders as part of the block's effect stack.

## Toggle the Effect

Disable and enable the LUT effect without removing it from the block.

```kotlin highlight-android-toggle-effect
    engine.block.setEffectEnabled(effectBlock = lutFilter, enabled = false)
    val disabledState = engine.block.isEffectEnabled(lutFilter)

    engine.block.setEffectEnabled(effectBlock = lutFilter, enabled = true)
    val effectEnabled = engine.block.isEffectEnabled(lutFilter)
```

This preserves the LUT URI, tile counts, and intensity while temporarily removing the visual transformation.

## Remove the Effect Later

When your app no longer needs the LUT effect, read the block's effect list, remove the effect by index, and destroy the detached effect block.

```kotlin highlight-android-remove-effect
    val lutFilterIndex = engine.block.getEffects(imageBlock).indexOf(lutFilter)
    require(lutFilterIndex >= 0) { "The LUT filter must be attached before it can be removed." }

    engine.block.removeEffect(block = imageBlock, index = lutFilterIndex)
    engine.block.destroy(lutFilter)
```

The runnable sample keeps the LUT attached so the final scene still shows the color grade. Use this cleanup path only after you are done with the effect.

## Troubleshooting

### LUT Not Rendering

- Verify the LUT URI is reachable from the Android app
- Confirm the LUT file is a PNG
- Check that the effect is attached to a block with `appendEffect`
- Verify that the target block returns `true` from `supportsEffects`

### Colors Look Wrong

- Match `horizontalTileCount` and `verticalTileCount` to the actual tiled PNG
- Confirm that the LUT was generated for the sRGB color space
- Make sure the image was not resized, cropped, or saved with lossy compression

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.create()` | Create the scene used by the sample. |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create the page block. |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create the image-backed graphic block. |
| `engine.block.setWidth(block=_, value=_)` | Set page or block width. |
| `engine.block.setHeight(block=_, value=_)` | Set page or block height. |
| `engine.block.setPositionX(block=_, value=_)` | Set the graphic block's horizontal position. |
| `engine.block.setPositionY(block=_, value=_)` | Set the graphic block's vertical position. |
| `engine.block.appendChild(parent=_, child=_)` | Add a page or graphic block to its parent. |
| `engine.block.createShape(type=ShapeType.Rect)` | Create a rectangular shape for the graphic block. |
| `engine.block.setShape(block=_, shape=_)` | Assign the rectangle shape to the graphic block. |
| `engine.block.createFill(fillType=FillType.Image)` | Create an image fill. |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Set the image URI on the image fill. |
| `engine.block.setFill(block=_, fill=_)` | Assign the image fill to the graphic block. |
| `engine.block.createEffect(type=EffectType.LutFilter)` | Create a LUT filter effect block. |
| `engine.block.setUri(block=_, property="effect/lut_filter/lutFileURI", value=_)` | Set the LUT PNG URI. |
| `engine.block.setInt(block=_, property="effect/lut_filter/verticalTileCount", value=_)` | Set the number of vertical LUT tiles. |
| `engine.block.setInt(block=_, property="effect/lut_filter/horizontalTileCount", value=_)` | Set the number of horizontal LUT tiles. |
| `engine.block.setFloat(block=_, property="effect/lut_filter/intensity", value=_)` | Set LUT filter intensity. |
| `engine.block.supportsEffects(block=_)` | Check whether the target block supports effects. |
| `engine.block.appendEffect(block=_, effectBlock=_)` | Add the LUT effect to the target block. |
| `engine.block.getEffects(block=_)` | Read the effects applied to a block. |
| `engine.block.setEffectEnabled(effectBlock=_, enabled=_)` | Enable or disable the LUT effect without removing it. |
| `engine.block.isEffectEnabled(effectBlock=_)` | Check whether the LUT effect is enabled. |
| `engine.block.removeEffect(block=_, index=_)` | Detach an effect from a block by stack index. |
| `engine.block.destroy(block=_)` | Destroy the detached effect block. |

## Next Steps

- [Create Custom Filters](./create-custom-filters.md) - Extend CE.SDK with custom LUT filter asset sources for brand-specific color grading and filter collections.
- [Apply a Filter or Effect](./apply.md) - Apply, configure, stack, and manage filters and effects with the Engine API.
- [Duotone](./duotone.md) - Apply duotone effects to images with two-color treatments.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support