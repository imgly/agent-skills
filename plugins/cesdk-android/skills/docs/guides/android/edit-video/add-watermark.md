> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Add Watermark](./add-watermark.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-video-add-watermark/AddWatermark.kt reference-only
import android.net.Uri
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.BlendMode
import ly.img.engine.Color
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.HorizontalAlignment
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

fun addWatermark(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.add.watermark.example")
    try {
        engine.start(license = license, userId = userId)
        engine.bindOffscreen(width = 1280, height = 720)

        val videoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4")
        engine.scene.createFromVideo(videoUri)

        val page = requireNotNull(engine.scene.getCurrentPage()) {
            "Expected createFromVideo() to create a page."
        }
        val pageWidth = engine.block.getWidth(page)
        val pageHeight = engine.block.getHeight(page)
        val videoDuration = engine.block.getDuration(page)

        val textWatermark = engine.block.create(DesignBlockType.Text)

        engine.block.setWidthMode(block = textWatermark, mode = SizeMode.AUTO)
        engine.block.setHeightMode(block = textWatermark, mode = SizeMode.AUTO)
        engine.block.replaceText(block = textWatermark, text = "All rights reserved 2025")

        val textPadding = 20F
        engine.block.setPositionX(block = textWatermark, value = textPadding)
        engine.block.setPositionY(block = textWatermark, value = pageHeight - textPadding - 28F)

        engine.block.setTextFontSize(block = textWatermark, fontSize = 20F)
        engine.block.setTextColor(block = textWatermark, color = Color.fromRGBA(1F, 1F, 1F, 1F))
        engine.block.setTextHorizontalAlignment(block = textWatermark, alignment = HorizontalAlignment.Left)
        engine.block.setOpacity(block = textWatermark, value = 0.7F)

        engine.block.setDropShadowEnabled(block = textWatermark, enabled = true)
        engine.block.setDropShadowColor(block = textWatermark, color = Color.fromRGBA(0F, 0F, 0F, 0.8F))
        engine.block.setDropShadowOffsetX(block = textWatermark, offsetX = 2F)
        engine.block.setDropShadowOffsetY(block = textWatermark, offsetY = 2F)
        engine.block.setDropShadowBlurRadiusX(block = textWatermark, blurRadiusX = 4F)
        engine.block.setDropShadowBlurRadiusY(block = textWatermark, blurRadiusY = 4F)

        engine.block.setDuration(block = textWatermark, duration = videoDuration)
        engine.block.setTimeOffset(block = textWatermark, offset = 0.0)
        engine.block.appendChild(parent = page, child = textWatermark)

        val logoWatermark = engine.block.create(DesignBlockType.Graphic)
        val rectShape = engine.block.createShape(ShapeType.Rect)
        engine.block.setShape(block = logoWatermark, shape = rectShape)

        val imageFill = engine.block.createFill(FillType.Image)
        val logoUri = Uri.parse("https://img.ly/static/ubq_samples/imgly_logo.jpg")
        engine.block.setUri(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = logoUri,
        )
        engine.block.setFill(block = logoWatermark, fill = imageFill)
        engine.block.setContentFillMode(block = logoWatermark, mode = ContentFillMode.CONTAIN)

        val logoSize = 80F
        val logoPadding = 20F
        engine.block.setWidth(block = logoWatermark, value = logoSize)
        engine.block.setHeight(block = logoWatermark, value = logoSize)
        engine.block.setPositionX(block = logoWatermark, value = pageWidth - logoSize - logoPadding)
        engine.block.setPositionY(block = logoWatermark, value = logoPadding)

        engine.block.setOpacity(block = logoWatermark, value = 0.6F)
        engine.block.setBlendMode(block = logoWatermark, blendMode = BlendMode.NORMAL)

        engine.block.setDuration(block = logoWatermark, duration = videoDuration)
        engine.block.setTimeOffset(block = logoWatermark, offset = 0.0)
        engine.block.appendChild(parent = page, child = logoWatermark)

        check(videoDuration > 0.0) { "Expected the page duration to match the source video." }
        check(engine.block.getDuration(textWatermark) == videoDuration)
        check(engine.block.getDuration(logoWatermark) == videoDuration)
    } finally {
        engine.stop()
    }
}
```

Add text and image watermarks to video content for copyright protection, branding, and content attribution using CE.SDK's time-aware block system.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260810/engine-guides-create-video-add-watermark)

<EngineReferenceNote {...props} />

Video watermarks in CE.SDK are design blocks positioned over video content. Text watermarks display copyright notices, URLs, or branding text, while image watermarks show logos or graphics. Both watermark types need their duration set so they remain visible throughout video playback.

This guide shows how to create text and image watermarks with the Android Engine API, position them on the page, style them for visibility, and configure their timing to span the full video.

## Creating the Scene

Start from a video scene and read the page dimensions and duration. The dimensions drive placement calculations, while the duration is reused for each watermark block.

```kotlin highlight-android-create-video-scene
        val videoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4")
        engine.scene.createFromVideo(videoUri)

        val page = requireNotNull(engine.scene.getCurrentPage()) {
            "Expected createFromVideo() to create a page."
        }
        val pageWidth = engine.block.getWidth(page)
        val pageHeight = engine.block.getHeight(page)
        val videoDuration = engine.block.getDuration(page)
```

`createFromVideo()` creates the scene and current page from the source video. `getDuration()` returns the page duration in seconds, which the sample applies to both watermark blocks.

## Creating a Text Watermark

Text watermarks are regular text blocks. We create one, let it size itself to its content, then place it near the bottom-left corner with padding from the page edges.

```kotlin highlight-android-create-text-watermark
        val textWatermark = engine.block.create(DesignBlockType.Text)

        engine.block.setWidthMode(block = textWatermark, mode = SizeMode.AUTO)
        engine.block.setHeightMode(block = textWatermark, mode = SizeMode.AUTO)
        engine.block.replaceText(block = textWatermark, text = "All rights reserved 2025")

        val textPadding = 20F
        engine.block.setPositionX(block = textWatermark, value = textPadding)
        engine.block.setPositionY(block = textWatermark, value = pageHeight - textPadding - 28F)
```

Auto width and height keep the watermark frame tied to its text, so the sample only needs position values.

## Styling Text Watermarks

Style the text for readability across changing video backgrounds.

```kotlin highlight-android-style-text-watermark
engine.block.setTextFontSize(block = textWatermark, fontSize = 20F)
engine.block.setTextColor(block = textWatermark, color = Color.fromRGBA(1F, 1F, 1F, 1F))
engine.block.setTextHorizontalAlignment(block = textWatermark, alignment = HorizontalAlignment.Left)
engine.block.setOpacity(block = textWatermark, value = 0.7F)
```

The sample uses white text, left alignment, and 70% opacity. `setTextFontSize()` applies the font size through the typed Android text API.

## Adding Drop Shadow for Visibility

Drop shadows help the text stay legible over both light and dark frames.

```kotlin highlight-android-text-drop-shadow
engine.block.setDropShadowEnabled(block = textWatermark, enabled = true)
engine.block.setDropShadowColor(block = textWatermark, color = Color.fromRGBA(0F, 0F, 0F, 0.8F))
engine.block.setDropShadowOffsetX(block = textWatermark, offsetX = 2F)
engine.block.setDropShadowOffsetY(block = textWatermark, offsetY = 2F)
engine.block.setDropShadowBlurRadiusX(block = textWatermark, blurRadiusX = 4F)
engine.block.setDropShadowBlurRadiusY(block = textWatermark, blurRadiusY = 4F)
```

The black shadow uses 80% alpha, 2 px offsets, and 4 px blur radii to add contrast without making the watermark dominate the video.

## Setting Text Watermark Duration

Set the text block duration to match the page duration and start it at the beginning of the timeline.

```kotlin highlight-android-text-timeline
engine.block.setDuration(block = textWatermark, duration = videoDuration)
engine.block.setTimeOffset(block = textWatermark, offset = 0.0)
engine.block.appendChild(parent = page, child = textWatermark)
```

`setDuration()` controls how long the block is active during playback. `setTimeOffset()` starts the watermark at 0 seconds, and `appendChild()` places it above the video content on the page.

## Creating an Image Watermark

Image watermarks use a graphic block with a shape and image fill.

```kotlin highlight-android-create-image-watermark
        val logoWatermark = engine.block.create(DesignBlockType.Graphic)
        val rectShape = engine.block.createShape(ShapeType.Rect)
        engine.block.setShape(block = logoWatermark, shape = rectShape)

        val imageFill = engine.block.createFill(FillType.Image)
        val logoUri = Uri.parse("https://img.ly/static/ubq_samples/imgly_logo.jpg")
        engine.block.setUri(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = logoUri,
        )
        engine.block.setFill(block = logoWatermark, fill = imageFill)
        engine.block.setContentFillMode(block = logoWatermark, mode = ContentFillMode.CONTAIN)
```

The image URI is assigned to the fill through the `fill/image/imageFileURI` property. `ContentFillMode.CONTAIN` keeps the logo inside its frame without cropping.

## Positioning Image Watermarks

Position logos where they do not cover important content.

```kotlin highlight-android-position-image-watermark
val logoSize = 80F
val logoPadding = 20F
engine.block.setWidth(block = logoWatermark, value = logoSize)
engine.block.setHeight(block = logoWatermark, value = logoSize)
engine.block.setPositionX(block = logoWatermark, value = pageWidth - logoSize - logoPadding)
engine.block.setPositionY(block = logoWatermark, value = logoPadding)
```

The sample sizes the logo to 80 x 80 units and places it in the top-right corner with 20 units of padding.

## Configuring Opacity and Blend Mode

Control how the logo integrates with the video.

```kotlin highlight-android-image-opacity-blend
engine.block.setOpacity(block = logoWatermark, value = 0.6F)
engine.block.setBlendMode(block = logoWatermark, blendMode = BlendMode.NORMAL)
```

The logo uses 60% opacity for a visible but subtle overlay. `BlendMode.NORMAL` displays the logo without additional compositing effects.

## Setting Image Watermark Duration

Image watermarks need the same timeline configuration as text watermarks.

```kotlin highlight-android-image-timeline
engine.block.setDuration(block = logoWatermark, duration = videoDuration)
engine.block.setTimeOffset(block = logoWatermark, offset = 0.0)
engine.block.appendChild(parent = page, child = logoWatermark)
```

Matching the page duration keeps the logo visible for the full video. A time offset of 0 seconds starts it with the first frame.

## Watermark Positioning Strategies

Choose positions based on the watermark purpose:

- Bottom-right corner: common for copyright notices and less intrusive branding.
- Top-right corner: useful for logos that should stay visible but avoid typical lower-third content.
- Bottom-left corner: a good alternative for text when the opposite corner contains important content.
- Center: strongest protection for drafts or previews, but it obstructs the video.

Calculate positions from the current page dimensions so the same code works across video aspect ratios.

## Best Practices

### Visibility

- Use drop shadows on text watermarks for contrast against changing backgrounds.
- Keep opacity between 50-70% for visible but unobtrusive branding.
- Test watermark placement against representative video frames.

### Time Management

- Match watermark duration to the page duration for full-video coverage.
- Use a 0-second time offset for watermarks that should appear from the start.
- For time-based variations, create separate watermark blocks with different offsets and durations.

### Performance

- Use appropriately sized logo assets instead of scaling very large source images.
- Keep the number of watermark blocks low when rendering many videos.
- Reuse the same watermark creation logic for batch workflows.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.createFromVideo(videoUri=_)` | Create a video scene from a URI |
| `engine.scene.getCurrentPage()` | Get the page created for the video scene |
| `engine.block.getWidth(block=_)` | Read the page width for placement calculations |
| `engine.block.getHeight(block=_)` | Read the page height for placement calculations |
| `engine.block.getDuration(block=_)` | Read the page or watermark duration in seconds |
| `engine.block.create(blockType=DesignBlockType.Text)` | Create a text watermark block |
| `engine.block.setWidthMode(block=_, mode=SizeMode.AUTO)` | Let a text block size itself to its content |
| `engine.block.setHeightMode(block=_, mode=SizeMode.AUTO)` | Let a text block size itself to its content |
| `engine.block.replaceText(block=_, text=_)` | Set text watermark content |
| `engine.block.setTextFontSize(block=_, fontSize=_)` | Set text size |
| `engine.block.setTextColor(block=_, color=_)` | Set text color |
| `engine.block.setTextHorizontalAlignment(block=_, alignment=_)` | Set paragraph alignment |
| `engine.block.setDropShadowEnabled(block=_, enabled=_)` | Enable or disable drop shadow |
| `engine.block.setDropShadowColor(block=_, color=_)` | Set shadow color and alpha |
| `engine.block.setDropShadowOffsetX(block=_, offsetX=_)` | Set horizontal shadow offset |
| `engine.block.setDropShadowOffsetY(block=_, offsetY=_)` | Set vertical shadow offset |
| `engine.block.setDropShadowBlurRadiusX(block=_, blurRadiusX=_)` | Set horizontal shadow blur |
| `engine.block.setDropShadowBlurRadiusY(block=_, blurRadiusY=_)` | Set vertical shadow blur |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create an image watermark block |
| `engine.block.createShape(type=ShapeType.Rect)` | Create a rectangular graphic shape |
| `engine.block.setShape(block=_, shape=_)` | Apply the rectangular shape to the graphic block |
| `engine.block.createFill(fillType=FillType.Image)` | Create an image fill for a logo |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Set the logo image URI |
| `engine.block.setFill(block=_, fill=_)` | Apply the image fill to the graphic block |
| `engine.block.setContentFillMode(block=_, mode=ContentFillMode.CONTAIN)` | Fit the logo inside its frame |
| `engine.block.setWidth(block=_, value=_)` | Set watermark width |
| `engine.block.setHeight(block=_, value=_)` | Set watermark height |
| `engine.block.setPositionX(block=_, value=_)` | Set horizontal position |
| `engine.block.setPositionY(block=_, value=_)` | Set vertical position |
| `engine.block.setOpacity(block=_, value=_)` | Set watermark transparency |
| `engine.block.setBlendMode(block=_, blendMode=_)` | Set image watermark blend mode |
| `engine.block.setDuration(block=_, duration=_)` | Set timeline duration |
| `engine.block.setTimeOffset(block=_, offset=_)` | Set timeline start time |
| `engine.block.appendChild(parent=_, child=_)` | Add the watermark to the page |

## Next Steps

- [Lock the Template](../create-templates/lock.md) - Restrict editing access to watermark elements or properties in templates
- [To MP4](../export-save-publish/export/to-mp4.md) - Export video compositions as MP4 files with configurable encoding options, progress tracking, and resolution control.
- [Timeline Editor](../create-video/timeline-editor.md) - Arrange and edit video clips, audio, and animations frame by frame
- [Text Styling](../text/styling.md) - Apply fonts, colors, alignment, and other styling options to customize text appearance



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support