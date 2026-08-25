> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Redaction](./redaction.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-redaction/Redaction.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.BlurType
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.EffectType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

private const val PAGE_WIDTH = 1280F
private const val PAGE_HEIGHT = 720F
private const val SEGMENT_DURATION = 5.0

data class Redaction(
    val pageDuration: Double,
    val fullBlockBlurEnabled: Boolean,
    val partialBlurEnabled: Boolean,
    val partialRedactionX: Float,
    val partialRedactionY: Float,
    val partialRedactionWidth: Float,
    val partialRedactionHeight: Float,
    val partialCropScaleX: Float,
    val partialCropScaleY: Float,
    val partialCropTranslationX: Float,
    val partialCropTranslationY: Float,
    val pixelizationEnabled: Boolean,
    val solidOverlayDuration: Double,
    val timedSourceOffset: Double,
    val timedSourceDuration: Double,
    val timedRedactionOffset: Double,
    val timedRedactionDuration: Double,
    val radialBlurEnabled: Boolean,
)

suspend fun redaction(engine: Engine): Redaction = withContext(Dispatchers.Main) {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = PAGE_WIDTH)
    engine.block.setHeight(page, value = PAGE_HEIGHT)
    engine.block.setDuration(page, duration = SEGMENT_DURATION * 5)

    val videoUris = listOf(
        "https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-8713114.mp4",
        "https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
        "https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-7108793.mp4",
        "https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-7108801.mp4",
        "https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-8713109.mp4",
    )
    val videos = videoUris.map { uri ->
        createRedactionVideoBlock(engine, uri)
    }

    videos.forEachIndexed { index, video ->
        engine.block.setPositionX(video, value = 0F)
        engine.block.setPositionY(video, value = 0F)
        engine.block.setDuration(video, duration = SEGMENT_DURATION)
        engine.block.setTimeOffset(video, offset = index * SEGMENT_DURATION)
        engine.block.appendChild(parent = page, child = video)
    }

    val radialVideo = videos[0]
    val fullBlurVideo = videos[1]
    val pixelVideo = videos[2]
    val partialBlurVideo = videos[3]
    val timedVideo = videos[4]

    if (engine.block.supportsBlur(fullBlurVideo)) {
        val uniformBlur = engine.block.createBlur(type = BlurType.Uniform)
        engine.block.setFloat(
            block = uniformBlur,
            property = "blur/uniform/intensity",
            value = 0.7F,
        )
        engine.block.setBlur(block = fullBlurVideo, blurBlock = uniformBlur)
        engine.block.setBlurEnabled(block = fullBlurVideo, enabled = true)
    }

    var partialBlurEnabled = false

    val partialBlurRedaction = engine.block.duplicate(block = partialBlurVideo)
    if (
        engine.block.supportsBlur(partialBlurRedaction) &&
        engine.block.supportsCrop(partialBlurRedaction)
    ) {
        val redactionX = PAGE_WIDTH * 0.22F
        val redactionY = PAGE_HEIGHT * 0.18F
        val redactionWidth = PAGE_WIDTH * 0.35F
        val redactionHeight = PAGE_HEIGHT * 0.28F

        val cropBlur = engine.block.createBlur(type = BlurType.Uniform)
        engine.block.setFloat(
            block = cropBlur,
            property = "blur/uniform/intensity",
            value = 0.75F,
        )
        engine.block.setBlur(block = partialBlurRedaction, blurBlock = cropBlur)
        engine.block.setBlurEnabled(block = partialBlurRedaction, enabled = true)

        engine.block.setWidth(block = partialBlurRedaction, value = redactionWidth)
        engine.block.setHeight(block = partialBlurRedaction, value = redactionHeight)
        engine.block.setPositionX(block = partialBlurRedaction, value = redactionX)
        engine.block.setPositionY(block = partialBlurRedaction, value = redactionY)

        // The smaller frame bounds the redaction; crop keeps its source pixels aligned.
        engine.block.setCropScaleX(block = partialBlurRedaction, scaleX = PAGE_WIDTH / redactionWidth)
        engine.block.setCropScaleY(block = partialBlurRedaction, scaleY = PAGE_HEIGHT / redactionHeight)
        engine.block.setCropTranslationX(
            block = partialBlurRedaction,
            translationX = -redactionX / redactionWidth,
        )
        engine.block.setCropTranslationY(
            block = partialBlurRedaction,
            translationY = -redactionY / redactionHeight,
        )
        partialBlurEnabled = engine.block.isBlurEnabled(partialBlurRedaction)
    }

    var pixelizationEnabled = false

    if (engine.block.supportsEffects(pixelVideo)) {
        val pixelizeEffect = engine.block.createEffect(type = EffectType.Pixelize)
        engine.block.setInt(
            block = pixelizeEffect,
            property = "effect/pixelize/horizontalPixelSize",
            value = 24,
        )
        engine.block.setInt(
            block = pixelizeEffect,
            property = "effect/pixelize/verticalPixelSize",
            value = 24,
        )
        engine.block.appendEffect(block = pixelVideo, effectBlock = pixelizeEffect)
        engine.block.setEffectEnabled(effectBlock = pixelizeEffect, enabled = true)
        pixelizationEnabled = engine.block.isEffectEnabled(pixelizeEffect)
    }

    val overlay = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(type = ShapeType.Rect)
    engine.block.setShape(block = overlay, shape = rectShape)

    val solidFill = engine.block.createFill(fillType = FillType.Color)
    engine.block.setColor(
        block = solidFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.1F, g = 0.1F, b = 0.1F, a = 1.0F),
    )
    engine.block.setFill(block = overlay, fill = solidFill)

    engine.block.setWidth(overlay, value = PAGE_WIDTH * 0.4F)
    engine.block.setHeight(overlay, value = PAGE_HEIGHT * 0.3F)
    engine.block.setPositionX(overlay, value = PAGE_WIDTH * 0.55F)
    engine.block.setPositionY(overlay, value = PAGE_HEIGHT * 0.65F)
    engine.block.appendChild(parent = page, child = overlay)
    engine.block.setTimeOffset(overlay, offset = 3 * SEGMENT_DURATION)
    engine.block.setDuration(overlay, duration = SEGMENT_DURATION)

    val timedRedaction = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(
        block = timedRedaction,
        shape = engine.block.createShape(type = ShapeType.Rect),
    )

    val timedFill = engine.block.createFill(fillType = FillType.Color)
    engine.block.setColor(
        block = timedFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.05F, g = 0.05F, b = 0.05F, a = 1.0F),
    )
    engine.block.setFill(block = timedRedaction, fill = timedFill)

    engine.block.setWidth(timedRedaction, value = PAGE_WIDTH * 0.35F)
    engine.block.setHeight(timedRedaction, value = PAGE_HEIGHT * 0.22F)
    engine.block.setPositionX(timedRedaction, value = PAGE_WIDTH * 0.32F)
    engine.block.setPositionY(timedRedaction, value = PAGE_HEIGHT * 0.24F)
    engine.block.setTimeOffset(timedRedaction, offset = 4 * SEGMENT_DURATION)
    engine.block.setDuration(timedRedaction, duration = SEGMENT_DURATION)
    engine.block.appendChild(parent = page, child = timedRedaction)

    if (engine.block.supportsBlur(radialVideo)) {
        val radialBlur = engine.block.createBlur(type = BlurType.Radial)
        // Radial blur leaves the radius clear; use it to protect content outside that focus area.
        engine.block.setFloat(radialBlur, property = "blur/radial/blurRadius", value = 50F)
        engine.block.setFloat(radialBlur, property = "blur/radial/radius", value = 75F)
        engine.block.setFloat(radialBlur, property = "blur/radial/gradientRadius", value = 80F)
        engine.block.setFloat(radialBlur, property = "blur/radial/x", value = 0.5F)
        engine.block.setFloat(radialBlur, property = "blur/radial/y", value = 0.45F)
        engine.block.setBlur(block = radialVideo, blurBlock = radialBlur)
        engine.block.setBlurEnabled(block = radialVideo, enabled = true)
    }

    Redaction(
        pageDuration = engine.block.getDuration(page),
        fullBlockBlurEnabled = engine.block.isBlurEnabled(fullBlurVideo),
        partialBlurEnabled = partialBlurEnabled,
        partialRedactionX = engine.block.getPositionX(partialBlurRedaction),
        partialRedactionY = engine.block.getPositionY(partialBlurRedaction),
        partialRedactionWidth = engine.block.getWidth(partialBlurRedaction),
        partialRedactionHeight = engine.block.getHeight(partialBlurRedaction),
        partialCropScaleX = engine.block.getCropScaleX(partialBlurRedaction),
        partialCropScaleY = engine.block.getCropScaleY(partialBlurRedaction),
        partialCropTranslationX = engine.block.getCropTranslationX(partialBlurRedaction),
        partialCropTranslationY = engine.block.getCropTranslationY(partialBlurRedaction),
        pixelizationEnabled = pixelizationEnabled,
        solidOverlayDuration = engine.block.getDuration(overlay),
        timedSourceOffset = engine.block.getTimeOffset(timedVideo),
        timedSourceDuration = engine.block.getDuration(timedVideo),
        timedRedactionOffset = engine.block.getTimeOffset(timedRedaction),
        timedRedactionDuration = engine.block.getDuration(timedRedaction),
        radialBlurEnabled = engine.block.isBlurEnabled(radialVideo),
    )
}

private fun createRedactionVideoBlock(
    engine: Engine,
    uri: String,
): DesignBlock {
    val video = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(video, shape = engine.block.createShape(ShapeType.Rect))
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse(uri),
    )
    engine.block.setFill(video, fill = videoFill)
    engine.block.setWidth(video, value = PAGE_WIDTH)
    engine.block.setHeight(video, value = PAGE_HEIGHT)
    return video
}
```

Redact sensitive video content using blur, pixelization, or solid overlays for privacy protection.

> **Reading time:** 12 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260825/engine-guides-redaction)

<EngineReferenceNote {...props} />

The Android [Video Editor starter kit](../starterkits/video-editor.md) is the recommended starting point for UI-based video editing workflows. Use the Engine APIs in this guide when you need to prepare redacted video content programmatically, automate privacy edits, or apply redactions before export.

CE.SDK applies effects to blocks themselves, not as overlays affecting content beneath. This means full-block redaction applies the effect directly to the video block, while partial redaction uses a duplicated video block that is resized and positioned as a bounded patch. Crop values align the duplicate's source pixels with the original video inside that patch.

This guide covers the built-in Android editor controls for blur and pixelization, then shows how to create full-block, partial, solid, and time-based redactions programmatically with the CreativeEngine.

## Understanding Redaction in CE.SDK

### How Effects Work

Effects in CE.SDK modify the block's appearance directly rather than creating transparent overlays that affect content beneath. When you blur a video block, the entire block becomes blurred.

### Choosing a Redaction Technique

Select your technique based on privacy requirements and visual impact:

- **Full-block blur**: Complete obscuration for backgrounds or placeholder content
- **Partial blur**: A duplicated video patch that is resized, positioned, blurred, and crop-aligned over one sensitive region
- **Radial blur**: Circular blur patterns that keep a focus region clear while obscuring surrounding content
- **Pixelization**: Clearly intentional censoring that is faster to render than heavy blur
- **Solid overlays**: Complete blocking for highly sensitive information like documents or credentials

## Using the Built-in UI

### Accessing Blur Controls

In the Android editor, select a video block and open the blur controls from the block options. The editor exposes blur presets such as uniform, radial, linear, and mirrored blur, with adjustment controls for the selected blur type.

Uniform blur applies consistent intensity across the entire block. Higher intensity creates stronger privacy protection but increases rendering work.

### Accessing Pixelization Controls

Select a video block, open the effects controls, and choose the pixelize effect. Adjust the horizontal and vertical pixel sizes to control the mosaic block dimensions.

Larger pixel sizes create stronger obscuration but are more visually disruptive. Values between 15 and 30 pixels work well for standard redaction scenarios.

### Creating Partial Redactions

For face, license-plate, or screen-detail redaction, duplicate the original video block first. Apply blur or pixelization to the duplicate, resize and position its frame over the sensitive region, then adjust crop values so the duplicate shows the same source area as the original underneath.

## Programmatic Redaction

### Full-Block Blur

When the entire video needs obscuring, apply blur directly to the original block without duplication. Check that the block supports blur, create a uniform blur, configure its intensity, attach it to the video block, and enable it.

```kotlin highlight-android-full-block-blur
if (engine.block.supportsBlur(fullBlurVideo)) {
    val uniformBlur = engine.block.createBlur(type = BlurType.Uniform)
    engine.block.setFloat(
        block = uniformBlur,
        property = "blur/uniform/intensity",
        value = 0.7F,
    )
    engine.block.setBlur(block = fullBlurVideo, blurBlock = uniformBlur)
    engine.block.setBlurEnabled(block = fullBlurVideo, enabled = true)
}
```

The uniform blur intensity ranges from 0.0 to 1.0. Higher values create stronger blur.

### Partial Blur

When only one region needs obscuring, duplicate the original video block and apply blur to the duplicate. Then resize and position the duplicate as the redaction rectangle, and use crop scale and translation values to keep the source pixels aligned with the original video.

```kotlin highlight-android-partial-blur
    val partialBlurRedaction = engine.block.duplicate(block = partialBlurVideo)
    if (
        engine.block.supportsBlur(partialBlurRedaction) &&
        engine.block.supportsCrop(partialBlurRedaction)
    ) {
        val redactionX = PAGE_WIDTH * 0.22F
        val redactionY = PAGE_HEIGHT * 0.18F
        val redactionWidth = PAGE_WIDTH * 0.35F
        val redactionHeight = PAGE_HEIGHT * 0.28F

        val cropBlur = engine.block.createBlur(type = BlurType.Uniform)
        engine.block.setFloat(
            block = cropBlur,
            property = "blur/uniform/intensity",
            value = 0.75F,
        )
        engine.block.setBlur(block = partialBlurRedaction, blurBlock = cropBlur)
        engine.block.setBlurEnabled(block = partialBlurRedaction, enabled = true)

        engine.block.setWidth(block = partialBlurRedaction, value = redactionWidth)
        engine.block.setHeight(block = partialBlurRedaction, value = redactionHeight)
        engine.block.setPositionX(block = partialBlurRedaction, value = redactionX)
        engine.block.setPositionY(block = partialBlurRedaction, value = redactionY)

        // The smaller frame bounds the redaction; crop keeps its source pixels aligned.
        engine.block.setCropScaleX(block = partialBlurRedaction, scaleX = PAGE_WIDTH / redactionWidth)
        engine.block.setCropScaleY(block = partialBlurRedaction, scaleY = PAGE_HEIGHT / redactionHeight)
        engine.block.setCropTranslationX(
            block = partialBlurRedaction,
            translationX = -redactionX / redactionWidth,
        )
        engine.block.setCropTranslationY(
            block = partialBlurRedaction,
            translationY = -redactionY / redactionHeight,
        )
        partialBlurEnabled = engine.block.isBlurEnabled(partialBlurRedaction)
    }
```

`duplicate()` keeps the copy on top of the original block. The duplicate's frame bounds the visible redaction area; crop scale and translation align the duplicated video content inside that smaller frame. The same bounded-duplicate workflow also works with pixelization.

### Pixelization

Pixelization creates a mosaic effect that is clearly intentional. Use the effect system rather than the blur system for pixelization.

```kotlin highlight-android-pixelization
if (engine.block.supportsEffects(pixelVideo)) {
    val pixelizeEffect = engine.block.createEffect(type = EffectType.Pixelize)
    engine.block.setInt(
        block = pixelizeEffect,
        property = "effect/pixelize/horizontalPixelSize",
        value = 24,
    )
    engine.block.setInt(
        block = pixelizeEffect,
        property = "effect/pixelize/verticalPixelSize",
        value = 24,
    )
    engine.block.appendEffect(block = pixelVideo, effectBlock = pixelizeEffect)
    engine.block.setEffectEnabled(effectBlock = pixelizeEffect, enabled = true)
    pixelizationEnabled = engine.block.isEffectEnabled(pixelizeEffect)
}
```

Check `supportsEffects()` before creating the pixelize effect. The horizontal and vertical pixel sizes control the mosaic block dimensions.

### Solid Overlays

For complete blocking without any visual hint of the underlying content, create an opaque shape overlay. This approach does not require video block duplication.

```kotlin highlight-android-solid-overlay
    val overlay = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(type = ShapeType.Rect)
    engine.block.setShape(block = overlay, shape = rectShape)

    val solidFill = engine.block.createFill(fillType = FillType.Color)
    engine.block.setColor(
        block = solidFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.1F, g = 0.1F, b = 0.1F, a = 1.0F),
    )
    engine.block.setFill(block = overlay, fill = solidFill)

    engine.block.setWidth(overlay, value = PAGE_WIDTH * 0.4F)
    engine.block.setHeight(overlay, value = PAGE_HEIGHT * 0.3F)
    engine.block.setPositionX(overlay, value = PAGE_WIDTH * 0.55F)
    engine.block.setPositionY(overlay, value = PAGE_HEIGHT * 0.65F)
    engine.block.appendChild(parent = page, child = overlay)
```

The overlay uses absolute page coordinates for positioning. Set the alpha channel to 1.0 for complete opacity.

### Time-Based Redaction

Redactions can appear only during specific portions of the video. Use a separate redaction layer, then call `setTimeOffset()` and `setDuration()` on that layer so the source video timing stays intact.

```kotlin highlight-android-time-based-redaction
    val timedRedaction = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(
        block = timedRedaction,
        shape = engine.block.createShape(type = ShapeType.Rect),
    )

    val timedFill = engine.block.createFill(fillType = FillType.Color)
    engine.block.setColor(
        block = timedFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.05F, g = 0.05F, b = 0.05F, a = 1.0F),
    )
    engine.block.setFill(block = timedRedaction, fill = timedFill)

    engine.block.setWidth(timedRedaction, value = PAGE_WIDTH * 0.35F)
    engine.block.setHeight(timedRedaction, value = PAGE_HEIGHT * 0.22F)
    engine.block.setPositionX(timedRedaction, value = PAGE_WIDTH * 0.32F)
    engine.block.setPositionY(timedRedaction, value = PAGE_HEIGHT * 0.24F)
    engine.block.setTimeOffset(timedRedaction, offset = 4 * SEGMENT_DURATION)
    engine.block.setDuration(timedRedaction, duration = SEGMENT_DURATION)
    engine.block.appendChild(parent = page, child = timedRedaction)
```

The time offset specifies when the overlay appears in seconds from the start of its parent timeline, and the duration controls how long it remains visible. If you need blurred or pixelized partial redaction instead of an opaque block, use the same timing pattern on a bounded duplicate video layer.

### Radial Blur

Radial blur keeps the center region unblurred and increases blur outside that focus area. Use it when the content to protect is around the focus region, not when the sensitive subject is centered. To obscure a centered face, license plate, or document area, use pixelization, uniform blur on a duplicate crop, or a solid overlay.

```kotlin highlight-android-radial-blur
if (engine.block.supportsBlur(radialVideo)) {
    val radialBlur = engine.block.createBlur(type = BlurType.Radial)
    // Radial blur leaves the radius clear; use it to protect content outside that focus area.
    engine.block.setFloat(radialBlur, property = "blur/radial/blurRadius", value = 50F)
    engine.block.setFloat(radialBlur, property = "blur/radial/radius", value = 75F)
    engine.block.setFloat(radialBlur, property = "blur/radial/gradientRadius", value = 80F)
    engine.block.setFloat(radialBlur, property = "blur/radial/x", value = 0.5F)
    engine.block.setFloat(radialBlur, property = "blur/radial/y", value = 0.45F)
    engine.block.setBlur(block = radialVideo, blurBlock = radialBlur)
    engine.block.setBlurEnabled(block = radialVideo, enabled = true)
}
```

Radial blur properties control the focus center (`x`, `y` from 0.0 to 1.0), the unblurred center area (`radius` from 0.0 to 100.0), the blur transition zone (`gradientRadius` from 0.0 to 100.0), and the blur strength outside the focus region (`blurRadius` from 0.0 to 100.0).

## Performance Considerations

Different redaction techniques have different performance impacts:

- **Solid overlays**: Minimal impact, and you can create many without significant overhead
- **Pixelization**: Faster than blur, with larger pixel sizes adding little extra work
- **Blur effects**: Higher intensity and radius values increase rendering time

For complex scenes with multiple redactions, use solid overlays where blur is not necessary, or reduce blur intensity to maintain smooth processing.

## Troubleshooting

### Redaction Not Visible

If your redaction does not appear, verify that:

- The overlay is attached to the page with `appendChild()`
- Blur is enabled with `setBlurEnabled()` after assigning it with `setBlur()`
- Effects are enabled with `setEffectEnabled()` after appending them with `appendEffect()`
- Partial redactions resize and position the duplicate frame before using crop values for source alignment

### Performance Issues

Reduce blur intensity, use pixelization instead of heavy blur, or switch to solid overlays for redactions that do not need the underlying content to remain recognizable.

## Best Practices

- **Preview thoroughly**: Scrub the timeline to verify that all sensitive content is covered.
- **Add safety margins**: Make redaction regions slightly larger than the sensitive area.
- **Test at export resolution**: Higher resolutions may need stronger blur or larger pixel sizes.
- **Archive originals**: Exported redactions are permanent and cannot be reversed.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.supportsBlur(block=_)` | Check whether a block supports blur |
| `engine.block.createBlur(type=BlurType.Uniform)` | Create a blur block |
| `engine.block.setFloat(block=_, property="blur/uniform/intensity", value=_)` | Set the uniform blur intensity |
| `engine.block.setFloat(block=_, property="blur/radial/blurRadius", value=_)` | Set the radial blur strength outside the focus region |
| `engine.block.setFloat(block=_, property="blur/radial/radius", value=_)` | Set the unblurred center radius for radial blur |
| `engine.block.setFloat(block=_, property="blur/radial/gradientRadius", value=_)` | Set the radial blur transition radius |
| `engine.block.setFloat(block=_, property="blur/radial/x", value=_)` | Set the radial blur center x coordinate |
| `engine.block.setFloat(block=_, property="blur/radial/y", value=_)` | Set the radial blur center y coordinate |
| `engine.block.setBlur(block=_, blurBlock=_)` | Apply a blur block to a design block |
| `engine.block.setBlurEnabled(block=_, enabled=_)` | Enable or disable a block's blur |
| `engine.block.duplicate(block=_, attachToParent=_)` | Duplicate a video block for partial redaction |
| `engine.block.supportsCrop(block=_)` | Check whether a block supports crop properties |
| `engine.block.setCropScaleX(block=_, scaleX=_)` | Scale source video content inside the redaction frame |
| `engine.block.setCropScaleY(block=_, scaleY=_)` | Scale source video content inside the redaction frame |
| `engine.block.setCropTranslationX(block=_, translationX=_)` | Align the source content horizontally inside the redaction frame |
| `engine.block.setCropTranslationY(block=_, translationY=_)` | Align the source content vertically inside the redaction frame |
| `engine.block.supportsEffects(block=_)` | Check whether a block supports effects |
| `engine.block.createEffect(type=EffectType.Pixelize)` | Create an effect block |
| `engine.block.setInt(block=_, property="effect/pixelize/horizontalPixelSize", value=_)` | Set the horizontal pixelization block size |
| `engine.block.setInt(block=_, property="effect/pixelize/verticalPixelSize", value=_)` | Set the vertical pixelization block size |
| `engine.block.appendEffect(block=_, effectBlock=_)` | Add an effect block to a design block |
| `engine.block.setEffectEnabled(effectBlock=_, enabled=_)` | Enable or disable an effect |
| `engine.block.setTimeOffset(block=_, offset=_)` | Set when a block appears on its parent timeline |
| `engine.block.setDuration(block=_, duration=_)` | Set how long a block remains active |
| `engine.block.getDuration(block=_)` | Read a block's active duration |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create a graphic block |
| `engine.block.appendChild(parent=_, child=_)` | Add a block to a scene, page, or parent block |
| `engine.block.createShape(type=ShapeType.Rect)` | Create a rectangle shape |
| `engine.block.setShape(block=_, shape=_)` | Apply a shape to a graphic block |
| `engine.block.createFill(fillType=FillType.Color)` | Create a fill block |
| `engine.block.setFill(block=_, fill=_)` | Apply a fill to a block |
| `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)` | Set a video fill source URI |
| `engine.block.setColor(block=_, property="fill/color/value", value=_)` | Set a color property |
| `engine.block.setWidth(block=_, value=_)` | Set a block width |
| `engine.block.setHeight(block=_, value=_)` | Set a block height |
| `engine.block.setPositionX(block=_, value=_)` | Set a block's x position |
| `engine.block.setPositionY(block=_, value=_)` | Set a block's y position |
| `engine.block.isBlurEnabled(block=_)` | Check whether blur is enabled on a block |
| `engine.block.isEffectEnabled(effectBlock=_)` | Check whether an effect block is enabled |
| `engine.block.getTimeOffset(block=_)` | Read when a block appears on its parent timeline |

## Next Steps

- [Apply a Filter or Effect](../filters-and-effects/apply.md) - Apply, configure, stack, and manage filters and effects.
- [Create and Edit Shapes](../shapes.md) - Create shape blocks for solid redaction overlays
- [Transform](./transform.md) - Position and resize video blocks before adding redactions
- [To MP4](../export-save-publish/export/to-mp4.md) - Export video compositions as MP4 files with configurable encoding options, progress tracking, and resolution control.
- [Control Audio and Video](../create-video/control.md) - Control timing, duration, and playback for media blocks
- [Trim](./trim.md) — Documentation for Trim



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support