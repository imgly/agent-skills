> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Insert Media Assets](../insert-media.md) > [Insert Videos](./videos.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-insert-media-videos/InsertMediaVideos.kt reference-only
import android.net.Uri
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import kotlin.math.abs

suspend fun insertMediaVideos(engine: Engine): InsertMediaVideosResult {
    val scene = engine.scene.createForVideo()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.appendChild(parent = scene, child = page)

    val videoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4")

    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = videoBlock, shape = engine.block.createShape(ShapeType.Rect))

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    engine.block.appendChild(parent = page, child = videoBlock)

    engine.block.setWidth(block = videoBlock, value = 720F)
    engine.block.setHeight(block = videoBlock, value = 405F)
    engine.block.setPositionX(block = videoBlock, value = 280F)
    engine.block.setPositionY(block = videoBlock, value = 150F)
    engine.block.setContentFillMode(block = videoBlock, mode = ContentFillMode.COVER)

    engine.block.forceLoadAVResource(block = videoFill)
    val sourceDuration = engine.block.getAVResourceTotalDuration(block = videoFill)

    val trimOffset = 2.0
    require(sourceDuration > trimOffset) { "The source video must be longer than the trim offset." }
    // Keep the demo clip short while clamping to the loaded source duration.
    val trimLength = (sourceDuration - trimOffset).coerceAtMost(5.0).coerceAtLeast(0.1)

    engine.block.setTrimOffset(block = videoFill, offset = trimOffset)
    engine.block.setTrimLength(block = videoFill, length = trimLength)
    engine.block.setDuration(block = videoBlock, duration = trimLength)

    val fillType = engine.block.getType(videoFill)
    val actualTrimOffset = engine.block.getTrimOffset(videoFill)
    val actualTrimLength = engine.block.getTrimLength(videoFill)
    val blockDuration = engine.block.getDuration(videoBlock)

    val videoBlocks = engine.block.findByType(DesignBlockType.Graphic)
        .filter { block ->
            runCatching {
                val fill = engine.block.getFill(block)
                engine.block.getType(fill) == FillType.Video.key
            }.getOrDefault(false)
        }

    val currentFill = engine.block.getFill(videoBlocks.first())
    val currentVideoUri = engine.block.getUri(
        block = currentFill,
        property = "fill/video/fileURI",
    )

    check(currentVideoUri == videoUri)
    check(fillType == FillType.Video.key)
    check(abs(actualTrimOffset - trimOffset) < 0.001)
    check(abs(actualTrimLength - trimLength) < 0.001)
    check(abs(blockDuration - trimLength) < 0.001)

    val exportedImage = engine.block.export(block = page, mimeType = MimeType.PNG)

    engine.block.destroy(block = videoBlocks.first())

    val remainingVideoBlocks = engine.block.findByType(DesignBlockType.Graphic)
        .filter { block ->
            runCatching {
                val fill = engine.block.getFill(block)
                engine.block.getType(fill) == FillType.Video.key
            }.getOrDefault(false)
        }

    check(exportedImage.hasRemaining()) { "The exported video preview is empty." }

    return InsertMediaVideosResult(
        videoUri = currentVideoUri,
        fillType = fillType,
        sourceDuration = sourceDuration,
        trimOffset = actualTrimOffset,
        trimLength = actualTrimLength,
        blockDuration = blockDuration,
        videoBlockCount = videoBlocks.size,
        remainingVideoBlockCount = remainingVideoBlocks.size,
        exportedImage = exportedImage.asReadOnlyBuffer(),
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-insert-media-videos/InsertMediaVideosResult.kt reference-only
import android.net.Uri
import java.nio.ByteBuffer

data class InsertMediaVideosResult(
    val videoUri: Uri,
    val fillType: String,
    val sourceDuration: Double,
    val trimOffset: Double,
    val trimLength: Double,
    val blockDuration: Double,
    val videoBlockCount: Int,
    val remainingVideoBlockCount: Int,
    val exportedImage: ByteBuffer,
)
```

Add videos to CE.SDK scenes on Android by creating a graphic block, attaching a
video fill, and configuring its source, trim range, size, and position.

![Android insert videos preview showing the exported scene with a video block on the page](https://img.ly/docs/cesdk/android/insert-media/videos-a5fa03/assets/android.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-rc.0/engine-guides-insert-media-videos)

<EngineReferenceNote {...props} />

Videos in CE.SDK are graphic blocks with a video fill. The graphic block defines
the scene placement and shape; the video fill stores the source URI and trim
metadata.

For a complete timeline editor UI, use the [Video Editor
Starter Kit](../starterkits/video-editor.md). This guide focuses on CreativeEngine APIs for inserting and
configuring video blocks programmatically.

## Creating a Video Block

Create a graphic block with `create()`, attach a rectangular shape with
`setShape()`, then create a video fill with `createFill()`. Set the source with
`setUri()` using the `fill/video/fileURI` property and append the block to the
page.

```kotlin highlight-android-create-video-block
    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = videoBlock, shape = engine.block.createShape(ShapeType.Rect))

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    engine.block.appendChild(parent = page, child = videoBlock)
```

Use a remote, local, bundled, or app-provided `Uri` as the source. MP4 with H.264
encoding is the safest default across Android devices; other codecs depend on
the target device's media support.

## Positioning and Sizing

Set width and height on the graphic block, then move it with `setPositionX()` and
`setPositionY()`. Use a content fill mode when you need predictable framing
inside the block's rectangle.

```kotlin highlight-android-position-and-size
engine.block.setWidth(block = videoBlock, value = 720F)
engine.block.setHeight(block = videoBlock, value = 405F)
engine.block.setPositionX(block = videoBlock, value = 280F)
engine.block.setPositionY(block = videoBlock, value = 150F)
engine.block.setContentFillMode(block = videoBlock, mode = ContentFillMode.COVER)
```

All values use the scene's design unit. Positive X moves the frame right, and
positive Y moves it down from the page's top-left origin.

## Configuring Trim

Load the video fill before reading duration or applying trim values. Trim is set
on the fill, while the graphic block's duration controls how long the block stays
active on the timeline in a video scene.

```kotlin highlight-android-configure-trim
    engine.block.forceLoadAVResource(block = videoFill)
    val sourceDuration = engine.block.getAVResourceTotalDuration(block = videoFill)

    val trimOffset = 2.0
    require(sourceDuration > trimOffset) { "The source video must be longer than the trim offset." }
    // Keep the demo clip short while clamping to the loaded source duration.
    val trimLength = (sourceDuration - trimOffset).coerceAtMost(5.0).coerceAtLeast(0.1)

    engine.block.setTrimOffset(block = videoFill, offset = trimOffset)
    engine.block.setTrimLength(block = videoFill, length = trimLength)
    engine.block.setDuration(block = videoBlock, duration = trimLength)
```

`setTrimOffset()` skips into the source media, and `setTrimLength()` controls how
much of that source plays from the offset. Matching `setDuration()` to the trim
length keeps the timeline block visible for the same time span as the trimmed
content.

## Finding Video Blocks

Find graphic blocks and filter them by the type of their attached fill. This is
useful when your app needs to inspect existing scene content or build a custom
media list.

```kotlin highlight-android-find-video-blocks
    val videoBlocks = engine.block.findByType(DesignBlockType.Graphic)
        .filter { block ->
            runCatching {
                val fill = engine.block.getFill(block)
                engine.block.getType(fill) == FillType.Video.key
            }.getOrDefault(false)
        }

    val currentFill = engine.block.getFill(videoBlocks.first())
    val currentVideoUri = engine.block.getUri(
        block = currentFill,
        property = "fill/video/fileURI",
    )
```

`getType()` returns the Engine type key for the fill. Compare it with
`FillType.Video.key`, then read `fill/video/fileURI` from the fill with
`getUri()`.

## Removing Videos

Destroy the graphic block when you want to remove the inserted video from the
scene. The block is detached from its parent page and the attached video fill is
released with it.

```kotlin highlight-android-remove-video
    engine.block.destroy(block = videoBlocks.first())

    val remainingVideoBlocks = engine.block.findByType(DesignBlockType.Graphic)
        .filter { block ->
            runCatching {
                val fill = engine.block.getFill(block)
                engine.block.getType(fill) == FillType.Video.key
            }.getOrDefault(false)
        }
```

## Troubleshooting

### Video Not Visible

- Verify that the `Uri` is reachable from the app, or resolve it with your app's
  URI resolver before assigning `fill/video/fileURI`.
- Use a device-supported video format. MP4 with H.264 is the safest Android
  default, but codec support still depends on the target device.
- Make sure the graphic block is appended to a page and has non-zero width and
  height.

### Trim Metadata Not Available

- Call `forceLoadAVResource()` on the video fill before reading duration or
  clamping trim values.
- Apply `setTrimOffset()` and `setTrimLength()` to the video fill, not the
  graphic block.
- Keep `trimOffset + trimLength` within `getAVResourceTotalDuration()`, then set
  the graphic block duration to the clip length when the timeline should match
  the trim.

## API Reference

| API | Description |
| --- | --- |
| `engine.scene.createForVideo()` | Create a video scene where block durations control timeline playback and video export. |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create a graphic block that can host a video fill. |
| `engine.block.createShape(type=_)` | Create the shape that clips the video fill. |
| `engine.block.setShape(block=_, shape=_)` | Attach a shape to the graphic block. |
| `engine.block.createFill(fillType=FillType.Video)` | Create a video fill object. |
| `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)` | Assign a video source URI. |
| `engine.block.setFill(block=_, fill=_)` | Attach a fill to a block. |
| `engine.block.appendChild(parent=_, child=_)` | Attach a block to the scene hierarchy. |
| `engine.block.setWidth(block=_, value=_)` | Set the block width in design units. |
| `engine.block.setHeight(block=_, value=_)` | Set the block height in design units. |
| `engine.block.setPositionX(block=_, value=_)` | Set the horizontal position. |
| `engine.block.setPositionY(block=_, value=_)` | Set the vertical position. |
| `engine.block.setContentFillMode(block=_, mode=_)` | Set Cover, Contain, or Crop behavior. |
| `engine.block.forceLoadAVResource(block=_)` | Load video metadata before reading duration or trimming. |
| `engine.block.getAVResourceTotalDuration(block=_)` | Read the loaded source duration in seconds. |
| `engine.block.setTrimOffset(block=_, offset=_)` | Set where playback starts within the source video. |
| `engine.block.setTrimLength(block=_, length=_)` | Set how much source video plays from the trim offset. |
| `engine.block.setDuration(block=_, duration=_)` | Set how long the block is active on the timeline. |
| `engine.block.findByType(type=DesignBlockType.Graphic)` | Find graphic blocks in the current scene. |
| `engine.block.getFill(block=_)` | Read the fill attached to a graphic block. |
| `engine.block.getType(block=_)` | Read a block or fill type key. |
| `engine.block.getUri(block=_, property="fill/video/fileURI")` | Read the assigned video source URI. |
| `engine.block.destroy(block=_)` | Remove a block from the scene. |

## Next Steps

- [Video Fills](../fills/video.md) - Configure video fill properties beyond trim and source URL
- [Create Videos Overview](../create-video/overview.md) - Choose the right guide for creating and editing a video project
- [Apply a Filter or Effect](../filters-and-effects/apply.md) — Apply, stack, and manage effects on a video block
- [Export Overview](../export-save-publish/export/overview.md) - Render scenes with video to MP4 or image formats



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support