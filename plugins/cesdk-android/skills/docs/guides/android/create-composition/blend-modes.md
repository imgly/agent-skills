> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Blend Modes](./blend-modes.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-blend-modes/BlendModes.kt reference-only
import kotlinx.coroutines.withContext
import ly.img.engine.BlendMode
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.RGBAColor
import ly.img.engine.ShapeType

suspend fun blendModes(engine: Engine) = withContext(engine.dispatcher) {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    fun addColorBlock(
        x: Float,
        y: Float,
        width: Float,
        height: Float,
        color: RGBAColor,
    ): DesignBlock {
        val block = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(block, value = x)
        engine.block.setPositionY(block, value = y)
        engine.block.setWidth(block, value = width)
        engine.block.setHeight(block, value = height)

        val fill = engine.block.createFill(FillType.Color)
        engine.block.setFill(block, fill = fill)
        engine.block.setFillSolidColor(block = block, color = color)
        engine.block.appendChild(parent = page, child = block)

        return block
    }

    // Create a base block first so the top block has content below it to blend with.
    addColorBlock(
        x = 80F,
        y = 80F,
        width = 420F,
        height = 320F,
        color = Color.fromRGBA(r = 0.12F, g = 0.35F, b = 0.95F, a = 1F),
    )
    val topBlock = addColorBlock(
        x = 240F,
        y = 180F,
        width = 420F,
        height = 320F,
        color = Color.fromRGBA(r = 1F, g = 0.55F, b = 0.08F, a = 1F),
    )

    // Scope checks use engine scope key strings.
    val canSetBlendMode =
        engine.block.supportsBlendMode(topBlock) &&
            engine.block.isAllowedByScope(topBlock, key = "layer/blendMode")
    println("Can set blend mode: $canSetBlendMode")

    if (canSetBlendMode) {
        engine.block.setBlendMode(topBlock, blendMode = BlendMode.MULTIPLY)
    }

    val currentBlendMode = engine.block.getBlendMode(topBlock)
    println("Current blend mode: $currentBlendMode")
    check(currentBlendMode == BlendMode.MULTIPLY)

    val canSetOpacity =
        engine.block.supportsOpacity(topBlock) &&
            engine.block.isAllowedByScope(topBlock, key = "layer/opacity")
    if (canSetOpacity) {
        engine.block.setOpacity(topBlock, value = 0.7F)
    }

    val currentOpacity = engine.block.getOpacity(topBlock)
    println("Current opacity: $currentOpacity")
    check(currentOpacity == 0.7F)
}
```

Control how design blocks visually blend with underlying layers using CE.SDK's
blend mode system for professional layered compositions.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260811/engine-guides-blend-modes)

<EngineReferenceNote {...props} />

Blend modes control how a block's colors combine with underlying layers, similar to blend modes in Photoshop or other design tools. CE.SDK provides 27 blend modes organized into categories: Normal, Darken, Lighten, Contrast, Inversion, and Component.

This guide covers how to check blend mode support, apply blend modes programmatically, understand the available blend mode options, and combine blend modes with opacity for fine control over layer compositing.

## Checking Blend Mode Support

Before applying a blend mode, verify that the block supports the property and allows writing it. `supportsBlendMode()` checks whether the block has a blend mode, while `isAllowedByScope(block, "layer/blendMode")` checks whether scoped content permits the setter.

```kotlin highlight-android-check-support
// Scope checks use engine scope key strings.
val canSetBlendMode =
    engine.block.supportsBlendMode(topBlock) &&
        engine.block.isAllowedByScope(topBlock, key = "layer/blendMode")
println("Can set blend mode: $canSetBlendMode")
```

Blend mode support is available for pages, groups, text blocks, and graphic blocks such as graphics with image, video, color, or shape content. Android represents shapes as `DesignBlockType.Graphic` blocks with a `ShapeType`, so check the exact block with `supportsBlendMode()` before setting a mode.

## Setting and Getting Blend Modes

Apply a blend mode with `setBlendMode()` and retrieve the current mode with `getBlendMode()`. Most blocks, including the graphic block in this sample, default to `BlendMode.NORMAL`, which displays the block without any blending effect. Groups default to `BlendMode.PASS_THROUGH` so their children can blend with layers below the group.

```kotlin highlight-android-set-blend-mode
if (canSetBlendMode) {
    engine.block.setBlendMode(topBlock, blendMode = BlendMode.MULTIPLY)
}
```

After setting a blend mode, confirm the change by reading it back:

```kotlin highlight-android-get-blend-mode
val currentBlendMode = engine.block.getBlendMode(topBlock)
println("Current blend mode: $currentBlendMode")
check(currentBlendMode == BlendMode.MULTIPLY)
```

## Available Blend Modes

CE.SDK provides 27 blend modes organized into categories, each producing different visual results:

### Normal Modes

- **`BlendMode.PASS_THROUGH`** - Allows children of a group to blend with layers below the group
- **`BlendMode.NORMAL`** - Default mode with no blending effect

### Darken Modes

These modes darken the result by comparing the base and blend colors:

- **`BlendMode.DARKEN`** - Selects the darker of the base and blend colors
- **`BlendMode.MULTIPLY`** - Multiplies colors, producing darker results (great for shadows)
- **`BlendMode.COLOR_BURN`** - Darkens base color by increasing contrast
- **`BlendMode.LINEAR_BURN`** - Darkens base color by decreasing brightness
- **`BlendMode.DARKEN_COLOR`** - Selects the darker color based on luminosity

### Lighten Modes

These modes lighten the result by comparing colors:

- **`BlendMode.LIGHTEN`** - Selects the lighter of the base and blend colors
- **`BlendMode.SCREEN`** - Multiplies the inverse of colors, producing lighter results (great for highlights)
- **`BlendMode.COLOR_DODGE`** - Lightens base color by decreasing contrast
- **`BlendMode.LINEAR_DODGE`** - Lightens base color by increasing brightness
- **`BlendMode.LIGHTEN_COLOR`** - Selects the lighter color based on luminosity

### Contrast Modes

These modes increase midtone contrast:

- **`BlendMode.OVERLAY`** - Combines Multiply and Screen based on the base color
- **`BlendMode.SOFT_LIGHT`** - Similar to Overlay but with a softer effect
- **`BlendMode.HARD_LIGHT`** - Similar to Overlay but based on the blend color
- **`BlendMode.VIVID_LIGHT`** - Burns or dodges colors based on the blend color
- **`BlendMode.LINEAR_LIGHT`** - Increases or decreases brightness based on blend color
- **`BlendMode.PIN_LIGHT`** - Replaces colors based on the blend color
- **`BlendMode.HARD_MIX`** - Reduces colors to white, black, or primary colors

### Inversion Modes

These modes create inverted or subtracted effects:

- **`BlendMode.DIFFERENCE`** - Subtracts the darker from the lighter color
- **`BlendMode.EXCLUSION`** - Similar to Difference with lower contrast
- **`BlendMode.SUBTRACT`** - Subtracts blend color from base color
- **`BlendMode.DIVIDE`** - Divides base color by blend color

### Component Modes

These modes affect specific color components:

- **`BlendMode.HUE`** - Uses the hue of the blend color with base saturation and luminosity
- **`BlendMode.SATURATION`** - Uses the saturation of the blend color
- **`BlendMode.COLOR`** - Uses the hue and saturation of the blend color
- **`BlendMode.LUMINOSITY`** - Uses the luminosity of the blend color

## Combining Blend Modes with Opacity

For finer control over compositing, combine blend modes with opacity. Opacity reduces overall visibility while the blend mode affects color interaction with underlying layers. Check `supportsOpacity()` and the `layer/opacity` scope before calling `setOpacity()`, because support only confirms that the block has an opacity property.

```kotlin highlight-android-set-opacity
val canSetOpacity =
    engine.block.supportsOpacity(topBlock) &&
        engine.block.isAllowedByScope(topBlock, key = "layer/opacity")
if (canSetOpacity) {
    engine.block.setOpacity(topBlock, value = 0.7F)
}
```

Read back the current opacity value to confirm changes or inspect existing state:

```kotlin highlight-android-get-opacity
val currentOpacity = engine.block.getOpacity(topBlock)
println("Current opacity: $currentOpacity")
check(currentOpacity == 0.7F)
```

> **Tip:** Start with full opacity (1.0) when experimenting with blend modes, then reduce
> opacity to soften the effect. Common values are 0.5-0.7 for subtle blending
> effects.

## Troubleshooting

### Blend Mode Has No Visible Effect

- Ensure the block has visible content, such as a color or image fill.
- Place visible blocks below the blended block; blend modes composite with underlying content.
- Read back the active mode with `getBlendMode()` to confirm it was applied to the expected block.

### Cannot Set Blend Mode

- Check `supportsBlendMode()` before calling `setBlendMode()`.
- Confirm `isAllowedByScope(block, "layer/blendMode")` returns `true`; locked template or editor content can support blend modes but deny writes.
- Make sure the `DesignBlock` still exists in the scene when you set the mode.
- Pass one of the Android `BlendMode` enum values listed above.

### Cannot Set Opacity

- Check `supportsOpacity()` before calling `setOpacity()`.
- Confirm `isAllowedByScope(block, "layer/opacity")` returns `true`; scoped content can expose opacity but block the setter.

### Unexpected Blending Results

- Verify the block order: only content below the block contributes to the blend result.
- Match the mode category to the intended effect, such as Darken, Lighten, or Contrast.
- Adjust opacity after setting the blend mode to soften strong results.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.supportsBlendMode(block=_)` | Check if a block supports blend modes |
| `engine.block.isAllowedByScope(block=_, key="layer/blendMode")` | Check if the current scopes allow `setBlendMode()` |
| `engine.block.setBlendMode(block=_, blendMode=_)` | Set the blend mode for a block |
| `engine.block.getBlendMode(block=_)` | Get the current blend mode of a block |
| `engine.block.supportsOpacity(block=_)` | Check if a block supports opacity |
| `engine.block.isAllowedByScope(block=_, key="layer/opacity")` | Check if the current scopes allow `setOpacity()` |
| `engine.block.setOpacity(block=_, value=_)` | Set the opacity for a block (0-1) |
| `engine.block.getOpacity(block=_)` | Get the current opacity of a block |

## Next Steps

- [Layer Management](./layer-management.md) - Control z-order and visibility of blocks
- [Add a Background](./add-background.md) - Add backgrounds to designs using fills for pages and shapes, and the background color property for text blocks.
- [Grouping](./group-and-ungroup.md) - Combine blocks to apply blend modes to groups



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support