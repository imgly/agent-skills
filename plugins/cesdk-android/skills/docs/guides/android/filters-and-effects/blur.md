> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Apply Blur](./blur.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-filters-and-effects-blur/BlurEffects.kt reference-only
import android.net.Uri
import ly.img.engine.BlurType
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.nio.ByteBuffer

private const val PAGE_WIDTH = 800F
private const val PAGE_HEIGHT = 600F

data class BlurEffects(
    val pageSupportsBlur: Boolean,
    val imageSupportsBlur: Boolean,
    val imageAllowsBlur: Boolean,
    val radialBlurType: String,
    val radialBlurRadius: Float,
    val radialBlurEnabled: Boolean,
    val disabledState: Boolean,
    val reenabledState: Boolean,
    val pageSharedBlur: DesignBlock,
    val secondarySharedBlur: DesignBlock,
    val pageSharedBlurType: String,
    val secondarySharedBlurType: String,
    val pageSharedBlurEnabled: Boolean,
    val secondarySharedBlurEnabled: Boolean,
    val oldBlur: DesignBlock,
    val replacementBlur: DesignBlock,
    val replacementBlurType: String,
    val replacementBlurRadius: Float,
    val oldBlurValidAfterDestroy: Boolean,
    val previewPng: ByteBuffer,
)

suspend fun blurEffects(engine: Engine): BlurEffects {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = PAGE_WIDTH)
    engine.block.setHeight(page, value = PAGE_HEIGHT)
    engine.block.appendChild(parent = scene, child = page)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock, value = PAGE_WIDTH)
    engine.block.setHeight(imageBlock, value = PAGE_HEIGHT)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("file:///android_asset/imgly-assets/ly.img.image/images/sample_1.jpg"),
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.appendChild(parent = page, child = imageBlock)

    val pageSupportsBlur = engine.block.supportsBlur(page)
    val imageSupportsBlur = engine.block.supportsBlur(imageBlock)
    val imageAllowsBlur = engine.block.isAllowedByScope(imageBlock, "appearance/blur")

    check(imageSupportsBlur) { "The image block must support blur effects." }
    check(imageAllowsBlur) { "The image block must allow blur changes." }

    val radialBlur = engine.block.createBlur(type = BlurType.Radial)

    engine.block.setFloat(block = radialBlur, property = "blur/radial/blurRadius", value = 40F)
    engine.block.setFloat(block = radialBlur, property = "blur/radial/radius", value = 100F)
    engine.block.setFloat(block = radialBlur, property = "blur/radial/gradientRadius", value = 80F)
    engine.block.setFloat(block = radialBlur, property = "blur/radial/x", value = 0.5F)
    engine.block.setFloat(block = radialBlur, property = "blur/radial/y", value = 0.5F)

    engine.block.setBlur(block = imageBlock, blurBlock = radialBlur)
    engine.block.setBlurEnabled(block = imageBlock, enabled = true)

    val appliedBlur = engine.block.getBlur(block = imageBlock)
    val radialBlurType = engine.block.getType(block = appliedBlur)
    val radialBlurRadius = engine.block.getFloat(
        block = appliedBlur,
        property = "blur/radial/blurRadius",
    )
    val radialBlurEnabled = engine.block.isBlurEnabled(block = imageBlock)

    engine.block.setBlurEnabled(block = imageBlock, enabled = false)
    val disabledState = engine.block.isBlurEnabled(block = imageBlock)

    engine.block.setBlurEnabled(block = imageBlock, enabled = true)
    val reenabledState = engine.block.isBlurEnabled(block = imageBlock)

    val previewPng = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = ExportOptions(targetWidth = PAGE_WIDTH, targetHeight = PAGE_HEIGHT),
    )

    val secondaryBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(secondaryBlock, shape = engine.block.createShape(ShapeType.Rect))
    val secondaryFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block = secondaryBlock, fill = secondaryFill)
    engine.block.setFillSolidColor(
        block = secondaryBlock,
        color = Color.fromRGBA(r = 0.1F, g = 0.18F, b = 0.28F, a = 1F),
    )
    engine.block.setWidth(secondaryBlock, value = 160F)
    engine.block.setHeight(secondaryBlock, value = 160F)
    engine.block.setPositionX(secondaryBlock, value = 560F)
    engine.block.setPositionY(secondaryBlock, value = 380F)
    engine.block.appendChild(parent = page, child = secondaryBlock)

    val sharedBlur = engine.block.createBlur(type = BlurType.Uniform)
    engine.block.setFloat(block = sharedBlur, property = "blur/uniform/intensity", value = 0.35F)
    engine.block.setBlur(block = secondaryBlock, blurBlock = sharedBlur)
    engine.block.setBlur(block = page, blurBlock = sharedBlur)
    engine.block.setBlurEnabled(block = secondaryBlock, enabled = true)
    engine.block.setBlurEnabled(block = page, enabled = true)

    val pageSharedBlur = engine.block.getBlur(block = page)
    val secondarySharedBlur = engine.block.getBlur(block = secondaryBlock)

    val oldBlur = engine.block.getBlur(block = imageBlock)
    val linearBlur = engine.block.createBlur(type = BlurType.Linear)
    engine.block.setFloat(block = linearBlur, property = "blur/linear/blurRadius", value = 30F)
    engine.block.setFloat(block = linearBlur, property = "blur/linear/x1", value = 0F)
    engine.block.setFloat(block = linearBlur, property = "blur/linear/y1", value = 0.5F)
    engine.block.setFloat(block = linearBlur, property = "blur/linear/x2", value = 1F)
    engine.block.setFloat(block = linearBlur, property = "blur/linear/y2", value = 0.5F)
    engine.block.setBlur(block = imageBlock, blurBlock = linearBlur)
    engine.block.setBlurEnabled(block = imageBlock, enabled = true)
    val replacementBlur = engine.block.getBlur(block = imageBlock)
    engine.block.destroy(block = oldBlur)
    val oldBlurValidAfterDestroy = engine.block.isValid(block = oldBlur)

    return BlurEffects(
        pageSupportsBlur = pageSupportsBlur,
        imageSupportsBlur = imageSupportsBlur,
        imageAllowsBlur = imageAllowsBlur,
        radialBlurType = radialBlurType,
        radialBlurRadius = radialBlurRadius,
        radialBlurEnabled = radialBlurEnabled,
        disabledState = disabledState,
        reenabledState = reenabledState,
        pageSharedBlur = pageSharedBlur,
        secondarySharedBlur = secondarySharedBlur,
        pageSharedBlurType = engine.block.getType(block = pageSharedBlur),
        secondarySharedBlurType = engine.block.getType(block = secondarySharedBlur),
        pageSharedBlurEnabled = engine.block.isBlurEnabled(block = page),
        secondarySharedBlurEnabled = engine.block.isBlurEnabled(block = secondaryBlock),
        oldBlur = oldBlur,
        replacementBlur = replacementBlur,
        replacementBlurType = engine.block.getType(block = replacementBlur),
        replacementBlurRadius = engine.block.getFloat(block = replacementBlur, property = "blur/linear/blurRadius"),
        oldBlurValidAfterDestroy = oldBlurValidAfterDestroy,
        previewPng = previewPng,
    )
}
```

Apply blur effects to design elements with CE.SDK's dedicated blur API for
softening backgrounds, creating depth, and focusing attention.

![Radial blur applied to an Android Engine scene](https://img.ly/docs/cesdk/android/filters-and-effects/blur-71d642/assets/blur-android-preview.png)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/engine-guides-filters-and-effects-blur)

<EngineReferenceNote {...props} />

Unlike stackable effects, blur is attached through its own block APIs. A block supports at most one blur at a time, but the same blur instance can be assigned to multiple compatible blocks.

This guide covers the built-in editor UI and the Android Engine APIs for applying and managing blur.

## Using the Built-in Blur UI

The CE.SDK editor UI exposes blur through the Blur action when the effective `appearance/blur` editing permission allows it. The inspector bar shows the action for selected image or video fills, and the dock opens the same Blur sheet for the current page.

The Blur sheet uses the `ly.img.blur` appearance library. Users choose a blur type, then open the selected blur's property controls to adjust intensity, gradient size, focus size, and control-point values depending on the active blur type.

> **Note:** For a complete editor setup that includes the standard Android editor UI,
> start with the [Design Editor Starter Kit](../starterkits/design-editor.md).
> `Dock.Button.rememberBlur()` and `InspectorBar.Button.rememberBlur()` create
> button instances; add or reposition them through the list-builder configuration
> described in the [Dock](../user-interface/customization/dock.md) and [Inspector
> Bar](../user-interface/customization/inspector-bar.md) guides.

## Programmatic Blur Application

### Check Blur Support

`supportsBlur()` checks whether the block type can carry a blur. This capability check is separate from the effective `appearance/blur` permission required by `setBlur()`. Check both before applying blur; a denied permission causes `setBlur()` to throw an `EngineException` with code `BLOCK.SCOPE_PERMISSION_DENIED`.

```kotlin highlight-android-check-blur-support
    val pageSupportsBlur = engine.block.supportsBlur(page)
    val imageSupportsBlur = engine.block.supportsBlur(imageBlock)
    val imageAllowsBlur = engine.block.isAllowedByScope(imageBlock, "appearance/blur")

    check(imageSupportsBlur) { "The image block must support blur effects." }
    check(imageAllowsBlur) { "The image block must allow blur changes." }
```

### Create Blur

Create a blur block with the type-safe `BlurType.Uniform`, `BlurType.Linear`, `BlurType.Mirrored`, or `BlurType.Radial` constants.

```kotlin highlight-android-create-blur
val radialBlur = engine.block.createBlur(type = BlurType.Radial)
```

### Configure Blur Parameters

Each blur type stores its adjustable values as float properties on the blur block. This example configures a radial blur with a clear center point and a soft transition around it.

```kotlin highlight-android-configure-blur
engine.block.setFloat(block = radialBlur, property = "blur/radial/blurRadius", value = 40F)
engine.block.setFloat(block = radialBlur, property = "blur/radial/radius", value = 100F)
engine.block.setFloat(block = radialBlur, property = "blur/radial/gradientRadius", value = 80F)
engine.block.setFloat(block = radialBlur, property = "blur/radial/x", value = 0.5F)
engine.block.setFloat(block = radialBlur, property = "blur/radial/y", value = 0.5F)
```

### Apply Blur to a Block

Attach the configured blur to the target block with `setBlur()`, then enable it. The blur renders only while it is enabled on that block.

```kotlin highlight-android-apply-blur
engine.block.setBlur(block = imageBlock, blurBlock = radialBlur)
engine.block.setBlurEnabled(block = imageBlock, enabled = true)
```

## Managing Blur

### Access Existing Blur

Use `getBlur()` to retrieve the blur block currently assigned to a block. You can then read its type and property values with the same block APIs used for other design blocks.

```kotlin highlight-android-read-blur
val appliedBlur = engine.block.getBlur(block = imageBlock)
val radialBlurType = engine.block.getType(block = appliedBlur)
val radialBlurRadius = engine.block.getFloat(
    block = appliedBlur,
    property = "blur/radial/blurRadius",
)
val radialBlurEnabled = engine.block.isBlurEnabled(block = imageBlock)
```

### Enable or Disable Blur

Toggle blur with `setBlurEnabled()` when you want a before/after state without losing the configured blur parameters.

```kotlin highlight-android-toggle-blur
    engine.block.setBlurEnabled(block = imageBlock, enabled = false)
    val disabledState = engine.block.isBlurEnabled(block = imageBlock)

    engine.block.setBlurEnabled(block = imageBlock, enabled = true)
    val reenabledState = engine.block.isBlurEnabled(block = imageBlock)
```

When disabled, the blur remains attached to the block but does not render until it is enabled again.

### Share Blur Across Blocks

A single blur instance can be assigned to more than one compatible block. Changes to that shared blur block affect every block that uses it.

```kotlin highlight-android-share-blur
    val sharedBlur = engine.block.createBlur(type = BlurType.Uniform)
    engine.block.setFloat(block = sharedBlur, property = "blur/uniform/intensity", value = 0.35F)
    engine.block.setBlur(block = secondaryBlock, blurBlock = sharedBlur)
    engine.block.setBlur(block = page, blurBlock = sharedBlur)
    engine.block.setBlurEnabled(block = secondaryBlock, enabled = true)
    engine.block.setBlurEnabled(block = page, enabled = true)

    val pageSharedBlur = engine.block.getBlur(block = page)
    val secondarySharedBlur = engine.block.getBlur(block = secondaryBlock)
```

### Replace Blur

To change blur type, create a new blur block and assign it with `setBlur()`. Destroy the old blur only when you know no other block should use it.

```kotlin highlight-android-replace-blur
val oldBlur = engine.block.getBlur(block = imageBlock)
val linearBlur = engine.block.createBlur(type = BlurType.Linear)
engine.block.setFloat(block = linearBlur, property = "blur/linear/blurRadius", value = 30F)
engine.block.setFloat(block = linearBlur, property = "blur/linear/x1", value = 0F)
engine.block.setFloat(block = linearBlur, property = "blur/linear/y1", value = 0.5F)
engine.block.setFloat(block = linearBlur, property = "blur/linear/x2", value = 1F)
engine.block.setFloat(block = linearBlur, property = "blur/linear/y2", value = 0.5F)
engine.block.setBlur(block = imageBlock, blurBlock = linearBlur)
engine.block.setBlurEnabled(block = imageBlock, enabled = true)
val replacementBlur = engine.block.getBlur(block = imageBlock)
engine.block.destroy(block = oldBlur)
val oldBlurValidAfterDestroy = engine.block.isValid(block = oldBlur)
```

## Blur Types and Properties

CE.SDK provides four blur types. Coordinates use relative values from `0.0` to `1.0`, where `0,0` is the top-left of the block and `1,1` is the bottom-right.

| Blur Type | Property | Default | Description |
| --- | --- | --- | --- |
| `BlurType.Uniform` | `blur/uniform/intensity` | `0.5` | Uniform blur strength from `0.0` to `1.0` |
| `BlurType.Linear` | `blur/linear/blurRadius` | `30` | Linear blur intensity |
| `BlurType.Linear` | `blur/linear/x1`, `blur/linear/y1` | `0`, `0.5` | Linear blur start point |
| `BlurType.Linear` | `blur/linear/x2`, `blur/linear/y2` | `1`, `0.5` | Linear blur end point |
| `BlurType.Mirrored` | `blur/mirrored/blurRadius` | `30` | Mirrored blur intensity |
| `BlurType.Mirrored` | `blur/mirrored/gradientSize` | `50` | Width of the transition zones |
| `BlurType.Mirrored` | `blur/mirrored/size` | `75` | Width of the clear focus band |
| `BlurType.Mirrored` | `blur/mirrored/x1`, `blur/mirrored/y1`, `blur/mirrored/x2`, `blur/mirrored/y2` | `0`, `0.5`, `1`, `0.5` | Mirrored blur axis points |
| `BlurType.Radial` | `blur/radial/blurRadius` | `30` | Radial blur intensity |
| `BlurType.Radial` | `blur/radial/radius` | `75` | Size of the sharp center |
| `BlurType.Radial` | `blur/radial/gradientRadius` | `50` | Width of the transition band |
| `BlurType.Radial` | `blur/radial/x`, `blur/radial/y` | `0.5`, `0.5` | Radial blur center point |

Use `getFloat()` to read any property after setting it when your app needs to persist or compare blur state.

## Troubleshooting

| Symptom | Cause | Solution |
| --- | --- | --- |
| Blur does not appear | The block does not support blur, or blur is disabled | Check `supportsBlur()` before applying and `isBlurEnabled()` after enabling |
| `setBlur()` throws `EngineException` with `BLOCK.SCOPE_PERMISSION_DENIED` | The effective `appearance/blur` permission is denied | Check `isAllowedByScope()` separately from `supportsBlur()` and only change the scope when your editing rules allow it |
| Setting a property throws `EngineException`, typically with `BLOCK.PROPERTY_NOT_FOUND` | The property path is unknown or does not match the blur type | Use an exact property path for the active `BlurType`; inspect the block's available properties when needed |
| Blur appears off-center | Radial, linear, or mirrored control points are outside the intended area | Keep coordinate properties in the `0.0` to `1.0` range |
| Replacing blur changes other blocks | The old blur block is shared | Destroy an old blur only when no other block should keep using it |

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.supportsBlur(block=_)` | Check whether a block supports blur |
| `engine.block.isAllowedByScope(block=_, key="appearance/blur")` | Check whether the effective blur editing permission allows changes |
| `engine.block.createBlur(type=_)` | Create a blur block from a `BlurType` |
| `engine.block.setFloat(block=_, property="blur/radial/blurRadius", value=_)` | Set the radial blur intensity |
| `engine.block.getFloat(block=_, property="blur/radial/blurRadius")` | Read the radial blur intensity |
| `engine.block.setFloat(block=_, property="blur/radial/radius", value=_)` | Set the radial blur's sharp center size |
| `engine.block.getFloat(block=_, property="blur/radial/radius")` | Read the radial blur's sharp center size |
| `engine.block.setFloat(block=_, property="blur/radial/gradientRadius", value=_)` | Set the radial blur transition width |
| `engine.block.getFloat(block=_, property="blur/radial/gradientRadius")` | Read the radial blur transition width |
| `engine.block.setFloat(block=_, property="blur/radial/x", value=_)` | Set the radial blur center's x-coordinate |
| `engine.block.getFloat(block=_, property="blur/radial/x")` | Read the radial blur center's x-coordinate |
| `engine.block.setFloat(block=_, property="blur/radial/y", value=_)` | Set the radial blur center's y-coordinate |
| `engine.block.getFloat(block=_, property="blur/radial/y")` | Read the radial blur center's y-coordinate |
| `engine.block.setFloat(block=_, property="blur/uniform/intensity", value=_)` | Set the uniform blur intensity |
| `engine.block.getFloat(block=_, property="blur/uniform/intensity")` | Read the uniform blur intensity |
| `engine.block.setFloat(block=_, property="blur/linear/blurRadius", value=_)` | Set the linear blur intensity |
| `engine.block.getFloat(block=_, property="blur/linear/blurRadius")` | Read the linear blur intensity |
| `engine.block.setFloat(block=_, property="blur/linear/x1", value=_)` | Set the linear blur start point's x-coordinate |
| `engine.block.getFloat(block=_, property="blur/linear/x1")` | Read the linear blur start point's x-coordinate |
| `engine.block.setFloat(block=_, property="blur/linear/y1", value=_)` | Set the linear blur start point's y-coordinate |
| `engine.block.getFloat(block=_, property="blur/linear/y1")` | Read the linear blur start point's y-coordinate |
| `engine.block.setFloat(block=_, property="blur/linear/x2", value=_)` | Set the linear blur end point's x-coordinate |
| `engine.block.getFloat(block=_, property="blur/linear/x2")` | Read the linear blur end point's x-coordinate |
| `engine.block.setFloat(block=_, property="blur/linear/y2", value=_)` | Set the linear blur end point's y-coordinate |
| `engine.block.getFloat(block=_, property="blur/linear/y2")` | Read the linear blur end point's y-coordinate |
| `engine.block.setBlur(block=_, blurBlock=_)` | Assign a blur block to a design block |
| `engine.block.getBlur(block=_)` | Retrieve the blur block assigned to a design block |
| `engine.block.setBlurEnabled(block=_, enabled=_)` | Enable or disable blur rendering for a design block |
| `engine.block.isBlurEnabled(block=_)` | Check whether blur rendering is enabled |
| `engine.block.getType(block=_)` | Read the engine type identifier of a blur block |
| `engine.block.destroy(block=_)` | Destroy an unused blur block |
| `engine.block.isValid(block=_)` | Check whether a destroyed blur block is still valid |

## Next Steps

- [Apply a Filter or Effect](./apply.md) - Stack visual effects such as adjustments, LUT filters, and duotone alongside blur.
- [Distortion Effects](./distortion.md) — Apply distortion effects to warp, shift, and transform design elements for dynamic artistic visuals in CE.SDK.
- [Filters & Effects Overview](./overview.md) - Browse every filter and effect CE.SDK provides.
- [Modify Properties](../concepts/blocks.md) - Understand block properties and how to modify them.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support