> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Apply Chroma Key (Green Screen)](./chroma-key-green-screen.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-filters-and-effects-chroma-key-green-screen/ChromaKeyGreenScreen.kt reference-only
import android.net.Uri
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.EffectType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType

private const val TAG = "ChromaKeyGuide"

suspend fun chromaKeyGreenScreen(
    engine: Engine,
    assetBaseUri: Uri,
): ChromaKeyGreenScreenResult = withContext(Dispatchers.Main) {
    // Demo scaffolding: a scene with one page, plus synthesized green-screen
    // footage — an astronaut sticker flattened onto a uniform green backdrop,
    // exported into an engine buffer — so the example has a keyable frame to work with.
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val backdrop = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(backdrop, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(block = backdrop, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(block = backdrop, color = Color.fromRGBA(r = 0F, g = 0.8F, b = 0.25F, a = 1F))
    engine.block.setWidth(backdrop, value = 800F)
    engine.block.setHeight(backdrop, value = 600F)
    engine.block.setPositionX(backdrop, value = 0F)
    engine.block.setPositionY(backdrop, value = 0F)
    engine.block.appendChild(parent = page, child = backdrop)

    val subject = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(subject, shape = engine.block.createShape(ShapeType.Rect))
    val subjectFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = subjectFill,
        property = "fill/image/imageFileURI",
        value = assetBaseUri.buildUpon()
            .appendPath("ly.img.sticker")
            .appendPath("images")
            .appendPath("3Dstickers")
            .appendPath("3d_stickers_astronaut.png")
            .build(),
    )
    engine.block.setFill(block = subject, fill = subjectFill)
    engine.block.setWidth(subject, value = 360F)
    engine.block.setHeight(subject, value = 400F)
    engine.block.setPositionX(subject, value = 220F)
    engine.block.setPositionY(subject, value = 130F)
    engine.block.appendChild(parent = page, child = subject)

    val frameData = engine.block.export(page, mimeType = MimeType.PNG)
    // Keep the buffer alive while the image fill references it.
    // Destroy it when the fill is no longer needed.
    val frameBufferUri = engine.editor.createBuffer()
    engine.editor.setBufferData(uri = frameBufferUri, offset = 0, data = frameData)
    engine.block.destroy(backdrop)
    engine.block.destroy(subject)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = frameBufferUri,
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.setWidth(imageBlock, value = 600F)
    engine.block.setHeight(imageBlock, value = 450F)
    engine.block.setPositionX(imageBlock, value = 100F)
    engine.block.setPositionY(imageBlock, value = 75F)
    engine.block.appendChild(parent = page, child = imageBlock)

    val greenScreenEffect = engine.block.createEffect(type = EffectType.GreenScreen)
    engine.block.appendEffect(block = imageBlock, effectBlock = greenScreenEffect)

    engine.block.setColor(
        greenScreenEffect,
        property = "effect/green_screen/fromColor",
        value = Color.fromRGBA(r = 0F, g = 0.8F, b = 0.25F, a = 1F),
    )

    engine.block.setFloat(greenScreenEffect, property = "effect/green_screen/colorMatch", value = 0.26F)

    engine.block.setFloat(greenScreenEffect, property = "effect/green_screen/smoothness", value = 0.15F)

    engine.block.setFloat(greenScreenEffect, property = "effect/green_screen/spill", value = 0.4F)

    val colorMatch = engine.block.getFloat(greenScreenEffect, property = "effect/green_screen/colorMatch")
    val smoothness = engine.block.getFloat(greenScreenEffect, property = "effect/green_screen/smoothness")
    val spill = engine.block.getFloat(greenScreenEffect, property = "effect/green_screen/spill")

    // A full-page background block with a solid color fill for the composite.
    val backgroundBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(backgroundBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(block = backgroundBlock, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(block = backgroundBlock, color = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.8F, a = 1F))
    engine.block.setWidth(backgroundBlock, value = 800F)
    engine.block.setHeight(backgroundBlock, value = 600F)
    engine.block.setPositionX(backgroundBlock, value = 0F)
    engine.block.setPositionY(backgroundBlock, value = 0F)

    engine.block.appendChild(parent = page, child = backgroundBlock)
    engine.block.sendToBack(backgroundBlock)
    engine.block.bringToFront(imageBlock)

    val heroPng = engine.block.export(page, mimeType = MimeType.PNG)

    val isEnabled = engine.block.isEffectEnabled(greenScreenEffect)
    Log.i(TAG, "Green screen effect enabled: $isEnabled")

    engine.block.setEffectEnabled(effectBlock = greenScreenEffect, enabled = !isEnabled)

    val enabledAfterToggle = engine.block.isEffectEnabled(greenScreenEffect)

    val blockSupportsEffects = engine.block.supportsEffects(imageBlock)
    Log.i(TAG, "Block supports effects: $blockSupportsEffects")

    val effects = engine.block.getEffects(imageBlock)
    Log.i(TAG, "Number of effects: ${effects.size}")

    val effectIndex = effects.indexOf(greenScreenEffect)
    if (effectIndex >= 0) {
        engine.block.removeEffect(block = imageBlock, index = effectIndex)
    }
    engine.block.destroy(greenScreenEffect)

    val removed = engine.block.getEffects(imageBlock).none { effect -> effect == greenScreenEffect }

    ChromaKeyGreenScreenResult(
        blockSupportsEffects = blockSupportsEffects,
        colorMatch = colorMatch,
        smoothness = smoothness,
        spill = spill,
        enabledAfterToggle = enabledAfterToggle,
        removed = removed,
        heroPng = heroPng,
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-filters-and-effects-chroma-key-green-screen/ChromaKeyGreenScreenResult.kt reference-only
import java.nio.ByteBuffer

data class ChromaKeyGreenScreenResult(
    val blockSupportsEffects: Boolean,
    val colorMatch: Float,
    val smoothness: Float,
    val spill: Float,
    val enabledAfterToggle: Boolean,
    val removed: Boolean,
    val heroPng: ByteBuffer,
)
```

Replace specific colors with transparency using CE.SDK's green screen effect
for video compositing and virtual background applications.

![An astronaut subject composited over a solid blue background after the green backdrop of the source frame was keyed out with the green screen effect](https://img.ly/docs/cesdk/android/filters-and-effects/chroma-key-green-screen-1e3e99/assets/android.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260810/engine-guides-filters-and-effects-chroma-key-green-screen)

<EngineReferenceNote {...props} />

While green is the most common key color due to its contrast with skin tones, the effect works with any solid color—blue screens, white backgrounds, or custom colors. CE.SDK processes chroma keying in real-time using GPU-accelerated shaders.

This guide covers how to apply the green screen effect programmatically, configure color selection and keying parameters, composite with background layers, and manage effects on blocks. The example applies the effect to a graphic block whose image fill holds a frame of green-screen footage — a subject in front of a uniform green backdrop — and keys out the backdrop.

> **Note:** The CE.SDK editor UI lists Green Screen alongside the other effects in its appearance controls, with sheet controls for the key color, color match, smoothness, and spill parameters. The [Photo Editor Starter Kit](../starterkits/photo-editor.md) and [Design Editor Starter Kit](../starterkits/design-editor.md) provide complete editor surfaces with these controls built in; use the Engine API in this guide when your app needs automation, presets, batch processing, or custom controls.

## Apply the Green Screen Effect

Create a green screen effect instance with `createEffect()` and attach it to a block with `appendEffect()`, which adds the effect to the block's effect stack. The effect immediately processes the target color, making matching pixels transparent.

```kotlin highlight-android-apply-green-screen
val greenScreenEffect = engine.block.createEffect(type = EffectType.GreenScreen)
engine.block.appendEffect(block = imageBlock, effectBlock = greenScreenEffect)
```

`imageBlock` is the example's graphic block with an image fill; the same calls work on the block types that support effects — graphic blocks and pages. Video content also lives on a graphic block, with a video fill instead of an image fill, so the same workflow applies.

## Configure Color Selection

The green screen effect targets a specific color to key out. Set this color using `setColor()` with the `effect/green_screen/fromColor` property. The effect defaults to pure green, and the color's alpha channel is ignored.

```kotlin highlight-android-set-key-color
engine.block.setColor(
    greenScreenEffect,
    property = "effect/green_screen/fromColor",
    value = Color.fromRGBA(r = 0F, g = 0.8F, b = 0.25F, a = 1F),
)
```

The example sets the key color to the exact green of its footage's backdrop. For blue screen footage, set the color to blue instead — any solid color works. Match the exact color you want to remove for best results.

## Adjust Color Matching Tolerance

The `colorMatch` parameter controls how closely pixels must match the target color to be keyed out. Adjust it with `setFloat()`.

```kotlin highlight-android-color-match
engine.block.setFloat(greenScreenEffect, property = "effect/green_screen/colorMatch", value = 0.26F)
```

Higher values (closer to `1.0`) key out a wider range of similar colors, which is useful for footage with uneven lighting or color variations in the background. Lower values create more precise keying for well-lit footage with uniform backgrounds. The parameter ranges from `0.0` to `1.0` and defaults to `0.4`.

## Control Edge Smoothness

The `smoothness` parameter controls the transition between opaque and transparent areas. This affects how sharp or soft the edges appear around keyed subjects.

```kotlin highlight-android-smoothness
engine.block.setFloat(greenScreenEffect, property = "effect/green_screen/smoothness", value = 0.15F)
```

Higher smoothness values create softer edges that blend naturally with new backgrounds, reducing harsh outlines. Lower values produce sharper edges, which may be preferable for high-contrast composites or when preserving fine detail.

## Remove Color Spill

Color spill occurs when the key color reflects onto the foreground subject, creating a green or blue tint on edges. The `spill` parameter desaturates the remaining traces of the key color.

```kotlin highlight-android-spill
engine.block.setFloat(greenScreenEffect, property = "effect/green_screen/spill", value = 0.4F)
```

Increase the spill value when you notice the key color appearing on subject edges or reflective surfaces. This is common with shiny hair, glasses, or metallic objects near the screen. Spill removal is off by default (`0.0`).

## Composite with Background Layers

After keying, layer the transparent content over backgrounds using block ordering. The example prepares a background block with a solid color fill sized to cover the page; append it to the page, place it behind the keyed image with `sendToBack()`, and keep the keyed image on top with `bringToFront()`.

```kotlin highlight-android-composite-background
engine.block.appendChild(parent = page, child = backgroundBlock)
engine.block.sendToBack(backgroundBlock)
engine.block.bringToFront(imageBlock)
```

The background appears through the transparent areas where the key color was removed. You can use image or video fills instead of solid colors for more dynamic backgrounds.

## Toggle the Effect

Check whether an effect is enabled using `isEffectEnabled()`.

```kotlin highlight-android-check-enabled
val isEnabled = engine.block.isEffectEnabled(greenScreenEffect)
Log.i(TAG, "Green screen effect enabled: $isEnabled")
```

To toggle the effect on or off, use `setEffectEnabled()`. This preserves the effect configuration while temporarily removing its visual impact — here the effect is flipped relative to the state read above.

```kotlin highlight-android-toggle-green-screen
engine.block.setEffectEnabled(effectBlock = greenScreenEffect, enabled = !isEnabled)
```

Toggling effects is useful for before/after comparisons or conditional processing without removing and recreating the effect.

## Manage the Effect

Beyond toggling, you can query, remove, and clean up effects. Use `supportsEffects()` to check if a block can have effects, `getEffects()` to list all applied effects, `removeEffect()` to detach an effect from a block, and `destroy()` to free the effect's resources.

```kotlin highlight-android-manage-green-screen
    val blockSupportsEffects = engine.block.supportsEffects(imageBlock)
    Log.i(TAG, "Block supports effects: $blockSupportsEffects")

    val effects = engine.block.getEffects(imageBlock)
    Log.i(TAG, "Number of effects: ${effects.size}")

    val effectIndex = effects.indexOf(greenScreenEffect)
    if (effectIndex >= 0) {
        engine.block.removeEffect(block = imageBlock, index = effectIndex)
    }
    engine.block.destroy(greenScreenEffect)
```

When removing an effect, find its position in the list returned by `getEffects()` and pass that index to `removeEffect()`. Removing an effect detaches it from the block but keeps the instance alive — call `destroy()` on the effect to release its resources.

## Troubleshooting

### Keying Results Appear Rough or Incomplete

- Increase the `colorMatch` value to capture more color variations
- Ensure source footage has even lighting on the screen
- Check that the target color accurately matches the screen color

### Edges Have Color Fringing

- Increase the `spill` value to remove color cast
- Adjust `smoothness` to soften hard edges
- Increase `colorMatch` if the fringe consists of leftover key-color pixels that fall just outside the matching threshold

### Transparent Areas Appear in Wrong Places

- Decrease `colorMatch` to be more selective about which colors are keyed
- Verify the `fromColor` matches only the intended background color
- Check that foreground subjects don't contain colors similar to the key color

## API Reference

### Methods

| API | Description |
| --- | --- |
| `engine.block.createEffect(type=EffectType.GreenScreen)` | Creates a green screen effect block |
| `engine.block.appendEffect(block=_, effectBlock=_)` | Adds an effect to the end of a block's effect stack |
| `engine.block.setColor(block=_, property="effect/green_screen/fromColor", value=_)` | Sets the color to key out |
| `engine.block.setFloat(block=_, property="effect/green_screen/colorMatch", value=_)` | Sets the color matching tolerance |
| `engine.block.setFloat(block=_, property="effect/green_screen/smoothness", value=_)` | Sets the edge smoothness |
| `engine.block.setFloat(block=_, property="effect/green_screen/spill", value=_)` | Sets the spill removal intensity |
| `engine.block.getColor(block=_, property="effect/green_screen/fromColor")` | Reads the configured key color |
| `engine.block.getFloat(block=_, property="effect/green_screen/colorMatch")` | Reads the color matching tolerance |
| `engine.block.getFloat(block=_, property="effect/green_screen/smoothness")` | Reads the edge smoothness |
| `engine.block.getFloat(block=_, property="effect/green_screen/spill")` | Reads the spill removal intensity |
| `engine.block.isEffectEnabled(effectBlock=_)` | Returns whether an effect block is enabled |
| `engine.block.setEffectEnabled(effectBlock=_, enabled=_)` | Enables or disables an effect block |
| `engine.block.supportsEffects(block=_)` | Checks whether a block can render effects |
| `engine.block.getEffects(block=_)` | Returns the ordered effects attached to a block |
| `engine.block.appendChild(parent=_, child=_)` | Appends a block as the last child of a parent |
| `engine.block.sendToBack(block=_)` | Moves a block behind its siblings |
| `engine.block.bringToFront(block=_)` | Moves a block in front of its siblings |
| `engine.block.removeEffect(block=_, index=_)` | Removes the effect at a stack index |
| `engine.block.destroy(block=_)` | Destroys an unused effect block |
| `Color.fromRGBA(r=_, g=_, b=_, a=_)` | Creates a color value for color effect properties |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `effect/green_screen/fromColor` | Color | The color to replace with transparency; defaults to pure green, alpha is ignored |
| `effect/green_screen/colorMatch` | Float | Color matching tolerance (`0.0`–`1.0`, default `0.4`) |
| `effect/green_screen/smoothness` | Float | Edge smoothness (`0.0`–`1.0`, default `0.08`) |
| `effect/green_screen/spill` | Float | Spill removal intensity (`0.0`–`1.0`, default `0.0`) |

## Next Steps

- [Apply a Filter or Effect](./apply.md) — Apply, configure, stack, and manage filters and effects with the CE.SDK Engine API.
- [Blur Effects](./blur.md) — Apply blur effects to soften backgrounds or create depth and focus in your designs.
- [Duotone](./duotone.md) — Apply duotone effects to images, mapping tones to two colors for stylized visuals, vintage aesthetics, or brand-specific treatments.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support