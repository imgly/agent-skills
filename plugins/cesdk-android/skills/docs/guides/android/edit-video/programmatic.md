> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Programmatic Editing](./programmatic.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-video-edit-programmatic/EditVideoProgrammatically.kt reference-only
@file:Suppress("ktlint:standard:filename")

import android.net.Uri
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportVideoOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SplitOptions
import java.nio.ByteBuffer

suspend fun editVideoProgrammatically(engine: Engine): ProgrammaticVideoEditResult = exportProgrammaticVideoEdit(engine)

suspend fun exportProgrammaticVideoEdit(engine: Engine): ProgrammaticVideoEditResult = withContext(engine.dispatcher) {
    buildProgrammaticVideoEdit(engine)
}

private suspend fun buildProgrammaticVideoEdit(engine: Engine): ProgrammaticVideoEditResult {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.setDuration(page, duration = 4.0)

    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)
    engine.block.fillParent(track)

    val firstClip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(firstClip, shape = engine.block.createShape(ShapeType.Rect))
    val firstVideoFill = engine.block.createFill(FillType.Video)
    // Video fill sources use the generic property-keyed URI setter.
    engine.block.setUri(
        block = firstVideoFill,
        property = "fill/video/fileURI",
        value = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
    )
    engine.block.setFill(block = firstClip, fill = firstVideoFill)
    engine.block.setContentFillMode(firstClip, mode = ContentFillMode.COVER)

    val secondClip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(secondClip, shape = engine.block.createShape(ShapeType.Rect))
    val secondVideoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = secondVideoFill,
        property = "fill/video/fileURI",
        value = Uri.parse(
            "https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
        ),
    )
    engine.block.setFill(block = secondClip, fill = secondVideoFill)
    engine.block.setContentFillMode(secondClip, mode = ContentFillMode.COVER)

    engine.block.appendChild(parent = track, child = firstClip)
    engine.block.appendChild(parent = track, child = secondClip)

    engine.block.forceLoadAVResource(block = firstVideoFill)
    engine.block.forceLoadAVResource(block = secondVideoFill)

    check(engine.block.getAVResourceTotalDuration(firstVideoFill) >= 3.0)
    engine.block.setDuration(block = firstClip, duration = 2.0)
    engine.block.setDuration(block = secondClip, duration = 2.0)
    engine.block.setTrimOffset(block = firstVideoFill, offset = 1.0)
    engine.block.setTrimLength(block = firstVideoFill, length = 2.0)

    val secondSegment = engine.block.split(
        block = secondClip,
        atTime = 1.0,
        options = SplitOptions(selectNewBlock = false),
    )

    val overlay = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(overlay, shape = engine.block.createShape(ShapeType.Rect))
    val overlayFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block = overlay, fill = overlayFill)
    engine.block.setFillSolidColor(
        block = overlay,
        color = Color.fromRGBA(r = 1F, g = 0.82F, b = 0.1F, a = 0.85F),
    )
    engine.block.setWidth(overlay, value = 1280F)
    engine.block.setHeight(overlay, value = 72F)
    engine.block.setPositionY(overlay, value = 648F)
    engine.block.setTimeOffset(block = overlay, offset = 1.25)
    engine.block.setDuration(block = overlay, duration = 1.5)
    engine.block.appendChild(parent = page, child = overlay)

    val editedVideo = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = engine.block.getDuration(page),
        mimeType = MimeType.MP4,
        progressCallback = { progress ->
            println(
                "Rendered ${progress.renderedFrames} of ${progress.totalFrames} frames",
            )
        },
        options = ExportVideoOptions(
            videoBitrate = 8_000_000,
            audioBitrate = 128_000,
            frameRate = 30F,
            targetWidth = 1280F,
            targetHeight = 720F,
        ),
    )
    check(editedVideo.remaining() > 0)

    return ProgrammaticVideoEditResult(
        exportedVideo = editedVideo,
        pageDuration = engine.block.getDuration(page),
        firstClipTrimOffset = engine.block.getTrimOffset(firstVideoFill),
        firstClipTrimLength = engine.block.getTrimLength(firstVideoFill),
        splitSegmentDuration = engine.block.getDuration(secondSegment),
        overlayTimeOffset = engine.block.getTimeOffset(overlay),
    )
}

data class ProgrammaticVideoEditResult(
    val exportedVideo: ByteBuffer,
    val pageDuration: Double,
    val firstClipTrimOffset: Double,
    val firstClipTrimLength: Double,
    val splitSegmentDuration: Double,
    val overlayTimeOffset: Double,
)
```

Edit video scenes with CE.SDK Engine APIs when your app needs automation,
custom controls, or template-driven video output.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260901/engine-guides-create-video-edit-programmatic)

<EngineReferenceNote {...props} />

Programmatic editing works directly on the Engine scene graph instead of the
built-in timeline UI. The Android [Video Editor Starter Kit](../starterkits/video-editor.md)
already includes a timeline UI, and the [Timeline Editor](../create-video/timeline-editor.md)
guide covers timeline-focused UI and Engine concepts. Use the programmatic
approach when your app needs to create or modify video timelines from code, for
example when generating variants, applying a known edit recipe, or exporting a
scene without opening the editor.

This guide builds a compact two-clip montage, trims the first clip, splits the second clip, adds a timed graphic overlay, and exports the edited page as MP4.

## Understand the Video Timeline

A video scene contains one or more pages. A page owns tracks and timed blocks, and each track arranges its child clips in sequence. In a typical video timeline:

- The scene is created in video mode with `engine.scene.createForVideo()`.
- A page defines the canvas size and the exported playback duration.
- A track contains graphic clip blocks with video fills.
- Audio blocks or overlay blocks can sit on the page timeline beside the track.
- Audio-only media uses `DesignBlockType.Audio`; video fills and audio blocks can both be muted or mixed with volume controls.

Timeline values are measured in seconds. `setDuration()` controls how long a block is active, `setTimeOffset()` controls when a block starts within its parent timeline, and trim values control which source-media segment plays.

## Create a Video Scene

Create a video scene, add a page, set the page size, and set the page duration. The page is the block exported later.

```kotlin highlight-android-create-video-scene
val scene = engine.scene.createForVideo()
val page = engine.block.create(DesignBlockType.Page)
engine.block.appendChild(parent = scene, child = page)
engine.block.setWidth(page, value = 1280F)
engine.block.setHeight(page, value = 720F)
engine.block.setDuration(page, duration = 4.0)
```

`createForVideo()` enables timeline behavior. The page duration here is `4.0` seconds, so the export renders the first four seconds of the edited page.

## Add and Arrange Clips

Create a track, attach it to the page, and append two graphic blocks with video fills. The track uses the child order to play clips sequentially.

```kotlin highlight-android-add-clips
    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)
    engine.block.fillParent(track)

    val firstClip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(firstClip, shape = engine.block.createShape(ShapeType.Rect))
    val firstVideoFill = engine.block.createFill(FillType.Video)
    // Video fill sources use the generic property-keyed URI setter.
    engine.block.setUri(
        block = firstVideoFill,
        property = "fill/video/fileURI",
        value = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
    )
    engine.block.setFill(block = firstClip, fill = firstVideoFill)
    engine.block.setContentFillMode(firstClip, mode = ContentFillMode.COVER)

    val secondClip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(secondClip, shape = engine.block.createShape(ShapeType.Rect))
    val secondVideoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = secondVideoFill,
        property = "fill/video/fileURI",
        value = Uri.parse(
            "https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
        ),
    )
    engine.block.setFill(block = secondClip, fill = secondVideoFill)
    engine.block.setContentFillMode(secondClip, mode = ContentFillMode.COVER)

    engine.block.appendChild(parent = track, child = firstClip)
    engine.block.appendChild(parent = track, child = secondClip)
```

Video fill sources use the generic property-keyed `setUri()` API because there is no convenience method dedicated to `fill/video/fileURI`. The rest of the sample uses typed constants such as `DesignBlockType.Track`, `DesignBlockType.Graphic`, `FillType.Video`, and `ShapeType.Rect`.

The sample sets `ContentFillMode.COVER` so each clip fills the page frame. Pick the mode that matches how the source video should fit into the graphic block:

| Mode | Effect |
| --- | --- |
| `ContentFillMode.CROP` | Uses manual crop positioning. |
| `ContentFillMode.COVER` | Scales content to cover the full block frame and can crop the edges. |
| `ContentFillMode.CONTAIN` | Scales content to fit inside the block frame and can leave empty space. |

## Change Timing and Trim

Load AV metadata before changing trim values or reading duration metadata. Then set each clip's timeline duration and trim the first fill to start one second into its source media.

```kotlin highlight-android-change-timing-trim
    engine.block.forceLoadAVResource(block = firstVideoFill)
    engine.block.forceLoadAVResource(block = secondVideoFill)

    check(engine.block.getAVResourceTotalDuration(firstVideoFill) >= 3.0)
    engine.block.setDuration(block = firstClip, duration = 2.0)
    engine.block.setDuration(block = secondClip, duration = 2.0)
    engine.block.setTrimOffset(block = firstVideoFill, offset = 1.0)
    engine.block.setTrimLength(block = firstVideoFill, length = 2.0)
```

Use these APIs for different timing layers:

| API | Effect |
| --- | --- |
| `engine.block.setDuration(block=_, duration=_)` | Sets how long the block is active on the timeline. |
| `engine.block.setTimeOffset(block=_, offset=_)` | Sets when the block starts within its parent timeline. |
| `engine.block.setTrimOffset(block=_, offset=_)` | Sets where source media playback starts. |
| `engine.block.setTrimLength(block=_, length=_)` | Sets how much source media is used for playback. |

## Split a Clip

Split the second clip at one second. The original block becomes the first segment, and `split()` returns the new second segment.

```kotlin highlight-android-split-clip
val secondSegment = engine.block.split(
    block = secondClip,
    atTime = 1.0,
    options = SplitOptions(selectNewBlock = false),
)
```

The sample passes `SplitOptions(selectNewBlock = false)` because a headless workflow does not need to change editor selection after the split.

`SplitOptions` controls how CE.SDK attaches and selects the new segment:

| Field | Default | Effect |
| --- | --- | --- |
| `attachToParent` | `true` | Attaches the returned segment to the same parent as the original block. |
| `createParentTrackIfNeeded` | `false` | Creates a parent track when the split block needs one and `attachToParent` is enabled. |
| `selectNewBlock` | `true` | Selects the returned segment after splitting. |

## Apply a Timed Overlay

Add a short graphic overlay directly to the page timeline. Its `timeOffset` and `duration` make it appear only for part of the exported video.

```kotlin highlight-android-timed-overlay
val overlay = engine.block.create(DesignBlockType.Graphic)
engine.block.setShape(overlay, shape = engine.block.createShape(ShapeType.Rect))
val overlayFill = engine.block.createFill(FillType.Color)
engine.block.setFill(block = overlay, fill = overlayFill)
engine.block.setFillSolidColor(
    block = overlay,
    color = Color.fromRGBA(r = 1F, g = 0.82F, b = 0.1F, a = 0.85F),
)
engine.block.setWidth(overlay, value = 1280F)
engine.block.setHeight(overlay, value = 72F)
engine.block.setPositionY(overlay, value = 648F)
engine.block.setTimeOffset(block = overlay, offset = 1.25)
engine.block.setDuration(block = overlay, duration = 1.5)
engine.block.appendChild(parent = page, child = overlay)
```

This same pattern works for other programmatic edits: create or find the target block, set its timing, then apply the specific block or fill properties your workflow needs.

## Export the Edited Video

Export the page as MP4 with `exportVideo()`. The progress callback reports rendered and total frame counts while the export runs, and `ExportVideoOptions` controls output size, frame rate, and bitrate.

```kotlin highlight-android-export-video
val editedVideo = engine.block.exportVideo(
    block = page,
    timeOffset = 0.0,
    duration = engine.block.getDuration(page),
    mimeType = MimeType.MP4,
    progressCallback = { progress ->
        println(
            "Rendered ${progress.renderedFrames} of ${progress.totalFrames} frames",
        )
    },
    options = ExportVideoOptions(
        videoBitrate = 8_000_000,
        audioBitrate = 128_000,
        frameRate = 30F,
        targetWidth = 1280F,
        targetHeight = 720F,
    ),
)
check(editedVideo.remaining() > 0)
```

The backing sample asserts that the returned `ByteBuffer` is non-empty so the automated check verifies a real export result.

`ExportVideoOptions` exposes these public fields:

| Field | Purpose |
| --- | --- |
| `h264Profile` | Selects the H.264 encoder profile. |
| `h264Level` | Selects the H.264 encoder level, for example `52` for level 5.2. |
| `videoBitrate` | Sets video bitrate in bits per second, or a named mode via the `VideoBitrate` constructor overload: `VideoBitrate.System` (default) and `VideoBitrate.Auto`, which on Android resolve to the same bounded, resolution-aware formula. The raw sentinels `0` and `-1` remain valid. |
| `audioBitrate` | Sets audio bitrate in bits per second, or `0` for automatic selection. |
| `frameRate` | Sets the target export frame rate in Hz. |
| `targetWidth` | Sets the target output width when used with `targetHeight`. |
| `targetHeight` | Sets the target output height when used with `targetWidth`. |
| `allowTextOverhang` | Includes glyph overhang bounds to avoid clipping text during export. |

## API Reference

| Android API | Purpose |
| --- | --- |
| `engine.scene.createForVideo()` | Create a scene in video mode. |
| `engine.block.create(blockType=_)` | Create pages, tracks, graphics, audio-only timeline blocks, and other blocks. |
| `engine.block.createFill(fillType=_)` | Create video or color fills. |
| `engine.block.createShape(type=_)` | Create a shape for a graphic block. |
| `engine.block.appendChild(parent=_, child=_)` | Add pages, tracks, clips, and overlays to the hierarchy. |
| `engine.block.fillParent(block=_)` | Resize a block to fill its parent frame. |
| `engine.block.setShape(block=_, shape=_)` | Assign a shape to a graphic block. |
| `engine.block.setFill(block=_, fill=_)` | Assign a fill to a graphic block. |
| `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)` | Set the source URI on a video fill. |
| `engine.block.setContentFillMode(block=_, mode=_)` | Control how video content fits inside the graphic block. |
| `engine.block.setFillSolidColor(block=_, color=_)` | Set the color value on a color fill. |
| `engine.block.setWidth(block=_, value=_)` | Set a block's width in scene units. |
| `engine.block.setHeight(block=_, value=_)` | Set a block's height in scene units. |
| `engine.block.setPositionY(block=_, value=_)` | Set a block's vertical position in scene units. |
| `engine.block.setDuration(block=_, duration=_)` | Set page or block playback duration in seconds. |
| `engine.block.getDuration(block=_)` | Read a block's playback duration in seconds. |
| `engine.block.setTimeOffset(block=_, offset=_)` | Set when a block starts in its parent timeline. |
| `engine.block.forceLoadAVResource(block=_)` | Load audio or video metadata before trim and duration queries. |
| `engine.block.getAVResourceTotalDuration(block=_)` | Read the loaded media duration. |
| `engine.block.setTrimOffset(block=_, offset=_)` | Set the source media start offset. |
| `engine.block.setTrimLength(block=_, length=_)` | Set the source media playback length. |
| `engine.block.split(block=_, atTime=_, options=_)` | Split a timed block and return the second segment. |
| `engine.block.setMuted(block=_, muted=_)` | Mute audio on a video fill or audio block. |
| `engine.block.setVolume(block=_, volume=_)` | Set audio volume from `0F` to `1F` on a video fill or audio block. |
| `engine.block.exportVideo(block=_, timeOffset=_, duration=_, mimeType=_, progressCallback=_, options=_, onPreExport=_, uriResolver=_)` | Export one edited page as video bytes. |
| `engine.block.exportVideo(blocks=_, timeOffset=_, duration=_, mimeType=_, progressCallback=_, options=_, onPreExport=_, uriResolver=_)` | Export multiple pages sequentially while reusing one worker engine. |

## Next Steps

- [Split Video and Audio](./split.md) - Learn how to split video and audio clips at specific time points in CE.SDK, creating two independent segments from a single clip.
- [Trim Video and Audio](./trim.md) - Control playback range without splitting.
- [Join and Arrange Video Clips](./join-and-arrange.md) - Combine multiple video clips into sequences and organize them on the timeline using tracks and time offsets in CE.SDK.
- [Control Audio and Video](../create-video/control.md) - Learn to play, pause, seek, and preview audio and video content in CE.SDK using playback controls and solo mode.
- [Export](../export-save-publish/export.md) - Explore export options, supported formats, and configuration features for sharing or rendering output.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support