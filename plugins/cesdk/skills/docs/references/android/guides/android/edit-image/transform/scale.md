> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Images](../../edit-image.md) > [Transform](../transform.md) > [Scale](./scale.md)

---

Scaling lets users enlarge or shrink a block directly on the canvas. In CE.SDK, scaling is a transform property that applies uniformly to most block types. This guide shows how to scale images using CE.SDK in your Android app using Kotlin. You'll learn how to scale image blocks proportionally, scale groups, and apply scaling constraints to protect template structure.

The standard UI already supports pinch-to-zoom and on-screen scale handles. Scaling programmatically gives you finer control. This is ideal for automation, custom UI, or template-driven apps.

When you want to scale the image **inside** the block and leave the block dimensions unchanged, you'll use [crop scale](./crop.md) instead.

## What You'll Learn

- Scale images programmatically using Kotlin.
- Scale images proportionally or non-uniformly.
- Scale grouped elements.
- Enable or disable scaling via pinch gestures or gizmo handles.

## When to Use

Use image scaling when your UI needs to:

- Let users zoom artwork smoothly without cropping
- Enforce a canonical image size in templates
- Support controls like sliders instead of gestures
- Scale multiple elements together (logos, product bundles, captions)

## Scaling Basics

On Android, you scale blocks using the **block API**. The main pieces you'll use are:

- `engine.block.scale(block: Int, scaleX: Float, scaleY: Float, anchorX: Float = 0f, anchorY: Float = 0f)`
- `width` / `height` and their modes (`setWidthMode`, `setHeightMode`)
- crop-related functions like `setCropScaleX`, `setCropScaleY`, and `setCropTranslationX` / `Y`

Control the size with the following scale values:

- `1.0f`: represents the **original** size.
- Larger than `1.0f`:  **increases** the size.
- Smaller than `1.0f`: **shrinks** the size.

> **Note:** The examples below use image blocks, but this same approach works for shapes, text, stickers, and groups as long as you have their block ID.

## Scale an Image Uniformly

Uniform scaling uses the `scale()` function. A scale value of `1.0f` is the original scale. Values larger than `1.0f` increase the scale of the block and values lower than `1.0f` scale the block smaller. A value of `2.0f`, for example makes the block twice as large.

This scales the image to 150% of its original size. Because the default anchor point is the top-left corner, the block grows outward from that corner.

```kotlin
import ly.img.engine.Engine

engine.block.scale(imageBlock, scaleX = 1.5f, scaleY = 1.5f)
```

![Original image and scaled image](https://img.ly/docs/cesdk/android/edit-image/transform/mobile-assets/scale-example-1.png)

By default, the anchor point for the image when scaling is the origin point on the top left. The scale function has two optional parameters to move the anchor point in the x and y direction. They can have values between `0.0f` and `1.0f`

This scales the image to 150% of its original size. The origin anchor point is 0.5, 0.5 so the image expands from the center.

```kotlin
engine.block.scale(imageBlock, scaleX = 1.5f, scaleY = 1.5f, anchorX = 0.5f, anchorY = 0.5f)
```

![Original image placed over the scaled image, aligned on the center anchor point](https://img.ly/docs/cesdk/android/edit-image/transform/mobile-assets/scale-example-2.png)

## Scale Non-Uniformly

To stretch or compress only one axis, thus distorting an image, use this combination:

- The crop scale function
- The width or height function

How you decide to make the adjustment will have different results. Below are three examples of scaling the original image in the x direction only.

![Allowing the engine to scale the image as you adjust the width of the block](https://img.ly/docs/cesdk/android/edit-image/transform/mobile-assets/scale-example-3.png)

```kotlin
import ly.img.engine.Engine
import ly.img.engine.SizeMode

engine.block.setWidthMode(imageBlock, mode = SizeMode.AUTO)
val newWidth = engine.block.getWidth(imageBlock) * 1.5f
engine.block.setWidth(imageBlock, value = newWidth)
```

The image continues respecting its fill mode (usually `.COVER`), so the content scales automatically as the frame widens.

![Using crop scale for the horizontal axis and adjusting the width of the block](https://img.ly/docs/cesdk/android/edit-image/transform/mobile-assets/scale-example-4.png)

```kotlin
engine.block.setCropScaleX(imageBlock, scaleX = 1.5f)
engine.block.setWidthMode(imageBlock, mode = SizeMode.AUTO)
val newWidth = engine.block.getWidth(imageBlock) * 1.5f
engine.block.setWidth(imageBlock, value = newWidth)
```

This uses crop scale to scale the image in a single direction and then adjusts the block's width to match the change. The change in width does not take the crop into account and so distorts the image as it's scaling the scaled image.

![Using crop scale for the horizontal axis and using the maintainCrop property when changing the width](https://img.ly/docs/cesdk/android/edit-image/transform/mobile-assets/scale-example-5.png)

```kotlin
engine.block.setCropScaleX(imageBlock, scaleX = 1.5f)
engine.block.setWidthMode(imageBlock, mode = SizeMode.AUTO)
val newWidth = engine.block.getWidth(imageBlock) * 1.5f
engine.block.setWidth(imageBlock, value = newWidth, maintainCrop = true)
```

By setting the `maintainCrop` parameter to true, expanding the width of the image by the scale factor respects the crop scale and the image is less distorted.

## Scale Images with Built-In Gestures or Gizmos

The CE.SDK UI supports these interactions automatically:

### Pinch to Zoom

Enabled by default:

```kotlin
import ly.img.engine.Engine

engine.editor.setSettingBoolean("touch/pinchAction", value = true)
```

Setting this to false disables pinch scaling entirely. For environments with keyboard and mouse a similar property exists:

```kotlin
engine.editor.setSettingBoolean("mouse/enableZoom", value = true)
```

### Gizmo Scale Handles

The UI can show corner handles for drag-scaling:

```kotlin
engine.editor.setSettingBoolean("controlGizmo/showScaleHandles", value = true)
```

This mirrors the behavior of native editors.

> **Note:** Changing these settings affects how the CE.SDK interprets user input. It doesn't prevent you from scaling blocks programmatically with `scale()`.

## Scale Multiple Elements Together

If you combine multiple blocks into a group, scaling the group scales every member:

```kotlin
import ly.img.engine.Engine

val groupId = engine.block.group(listOf(imageBlock, textBlock))
engine.block.scale(groupId, scaleX = 0.75f, scaleY = 0.75f)
```

This scales the entire group to 75%.

## Lock Scaling

When working with templates, you can lock a block from scaling by setting its scope. The [guide on locking](../../create-templates/lock.md) provides more information.

```kotlin
import ly.img.engine.Engine

engine.block.setScopeEnabled(imageBlock, key = "layer/resize", enabled = false)
```

To prevent users from applying **any** transform to a block:

```kotlin
engine.block.setTransformLocked(imageBlock, locked = true)
```

## Complete Scaling Example

Here's a complete example showing different scaling operations in a single function:

```kotlin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

fun scaleImageExample(
    license: String,
    userId: String
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.scale")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)
    
    // Create scene and page
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    
    // Create an image block
    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg"
    )
    engine.block.setFill(imageBlock, fill = imageFill)
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 300F)
    engine.block.appendChild(parent = page, child = imageBlock)
    
    // Example 1: Scale uniformly from top-left
    engine.block.scale(imageBlock, scaleX = 1.5f, scaleY = 1.5f)
    
    // Example 2: Scale uniformly from center
    engine.block.scale(
        imageBlock,
        scaleX = 0.75f,
        scaleY = 0.75f,
        anchorX = 0.5f,
        anchorY = 0.5f
    )
    
    // Example 3: Non-uniform scaling with crop
    engine.block.setCropScaleX(imageBlock, scaleX = 1.5f)
    engine.block.setWidthMode(imageBlock, mode = SizeMode.AUTO)
    val newWidth = engine.block.getWidth(imageBlock) * 1.5f
    engine.block.setWidth(imageBlock, value = newWidth, maintainCrop = true)
    
    // Example 4: Lock scaling
    engine.block.setScopeEnabled(imageBlock, key = "layer/resize", enabled = false)
    
    engine.stop()
}
```

## Troubleshooting

|Symptom|Likely Cause|Fix|
|---|---|---|
|"Property not found: transform/scale/x"|Using old spec property names that no longer exist.|Replace with `engine.block.scale()` for uniform scale. See [Crop](./crop.md) for more on how crop scale affects scaling results.|
|Image changes size but looks oddly distorted|Combining crop and width changes in a surprising way.|Use a simpler pattern: either change width alone, or use a controlled crop/scaleX + width approach and test with sample images.|
|Pinch does nothing on canvas|Pinch scaling disabled|Ensure "touch/pinchAction" is true (or not overridden in settings).|
|Scale handles don't appear|Gizmo handles disabled in editor settings|Set `controlGizmo/showScaleHandles` to true.|
|Image won't scale at all|Block is transform-locked or scope-locked|Check `transformLocked` and any related scopes like "layer/resize". Unlock or re-enable scope if needed.|

## Next Steps

Once you're comfortable scaling images, explore the other transform tools:

- [Resize](./resize.md) for changing the size of a block's frame.
- [Crop](./crop.md) for changing what part of the image is visible.
- [Rotate](./rotate.md) for rotating images around an anchor.
- [Flip](./flip.md) to mirror images horizontally or vertically.
- [Move](./move.md) to reposition blocks on the canvas.

Together, these guides give you a complete picture of how to position and transform images in CE.SDK on Android.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support