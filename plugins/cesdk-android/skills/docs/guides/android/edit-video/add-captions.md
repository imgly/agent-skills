> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Add Captions](./add-captions.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-captions/Captions.kt reference-only
import android.net.Uri
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.AnimationType
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.PositionMode
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import java.nio.ByteBuffer

private const val TAG = "CaptionsGuide"

suspend fun editVideoCaptions(engine: Engine): ByteBuffer = withContext(Dispatchers.Main) {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.editor.setSettingBoolean(keypath = "features/videoCaptionsEnabled", value = true)

    engine.block.setDuration(page, duration = 20.0)

    val video = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(video, shape = engine.block.createShape(ShapeType.Rect))
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse(
            "https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
        ),
    )
    engine.block.setFill(video, fill = videoFill)
    engine.block.setDuration(video, duration = 20.0)

    val videoTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = videoTrack)
    engine.block.appendChild(parent = videoTrack, child = video)
    engine.block.fillParent(videoTrack)

    val captionTrack = engine.block.create(DesignBlockType.CaptionTrack)
    engine.block.appendChild(parent = page, child = captionTrack)

    val manageOffsetsAutomatically = false
    engine.block.setBoolean(
        block = captionTrack,
        property = "track/automaticallyManageBlockOffsets",
        value = manageOffsetsAutomatically,
    )

    val caption1 = engine.block.create(DesignBlockType.Caption)
    engine.block.setString(caption1, property = "caption/text", value = "Caption text 1")
    val caption2 = engine.block.create(DesignBlockType.Caption)
    engine.block.setString(caption2, property = "caption/text", value = "Caption text 2")
    engine.block.appendChild(parent = captionTrack, child = caption1)
    engine.block.appendChild(parent = captionTrack, child = caption2)

    engine.block.setDuration(caption1, duration = 3.0)
    engine.block.setDuration(caption2, duration = 5.0)

    engine.block.setTimeOffset(caption1, offset = 0.0)
    engine.block.setTimeOffset(caption2, offset = 3.0)

    // Captions can also be loaded from a caption file, i.e., from SRT and VTT files.
    // The text and timing of the captions are read from the file.
    val captions = engine.block.createCaptionsFromURI("https://img.ly/static/examples/captions.srt")
    for (caption in captions) {
        engine.block.appendChild(parent = captionTrack, child = caption)
    }

    // Position and size sync only with caption blocks under the same caption track.
    engine.block.setPositionX(caption1, 0.05F)
    engine.block.setPositionXMode(caption1, PositionMode.PERCENT)
    engine.block.setPositionY(caption1, 0.8F)
    engine.block.setPositionYMode(caption1, PositionMode.PERCENT)
    engine.block.setHeight(caption1, 0.15F)
    engine.block.setHeightMode(caption1, SizeMode.PERCENT)
    engine.block.setWidth(caption1, 0.9F)
    engine.block.setWidthMode(caption1, SizeMode.PERCENT)

    // Style properties sync only with caption blocks under the same caption track.
    engine.block.setTextColor(caption1, color = Color.fromRGBA(0.9F, 0.9F, 0F, 1F))
    engine.block.setDropShadowEnabled(caption1, enabled = true)
    engine.block.setDropShadowColor(caption1, color = Color.fromRGBA(0F, 0F, 0F, 0.8F))
    engine.block.setBackgroundColorEnabled(caption1, enabled = true)
    engine.block.setBackgroundColor(caption1, color = Color.fromRGBA(0F, 0F, 0F, 0.7F))
    // Use property-keyed setters for caption automatic font sizing properties.
    engine.block.setBoolean(caption1, property = "caption/automaticFontSizeEnabled", value = true)
    engine.block.setFloat(caption1, property = "caption/minAutomaticFontSize", value = 24F)
    engine.block.setFloat(caption1, property = "caption/maxAutomaticFontSize", value = 72F)

    val fadeInAnimation = engine.block.createAnimation(AnimationType.Fade)
    engine.block.setDuration(fadeInAnimation, duration = 0.3)
    engine.block.setInAnimation(caption1, animation = fadeInAnimation)

    // Export page as mp4 video.
    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = engine.block.getDuration(page),
        mimeType = MimeType.MP4,
        progressCallback = {
            Log.i(
                TAG,
                "Rendered ${it.renderedFrames} frames and encoded ${it.encodedFrames} frames out of ${it.totalFrames} frames",
            )
        },
    )

    check(videoBytes.remaining() > 0)
    videoBytes
}
```

Add synchronized captions to video scenes with CE.SDK's caption tracks, caption blocks, subtitle import, styling properties, and video export.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260808/engine-guides-captions)

<EngineReferenceNote {...props} />

Captions in CE.SDK use the same block hierarchy as other video content: a page contains a video track and a caption track, and the caption track contains caption blocks. Each caption block stores text, a time offset, a duration, and styling properties.

This guide focuses on the Android Engine APIs. The sample adds a video clip, overlays captions, and exports the page. If your Android app needs caption-specific controls, wire your own UI to these APIs and keep the scene hierarchy shown below.

## Creating a Video Scene

Create a video scene, add a page, set the page dimensions, and enable video captions before creating caption blocks.

```kotlin highlight-android-setup-scene
val scene = engine.scene.createForVideo()
val page = engine.block.create(DesignBlockType.Page)
engine.block.appendChild(parent = scene, child = page)
engine.block.setWidth(page, value = 1280F)
engine.block.setHeight(page, value = 720F)
engine.editor.setSettingBoolean(keypath = "features/videoCaptionsEnabled", value = true)
```

## Setting Page Duration

The page duration defines the time range where captions can appear. This sample uses a 20 second page.

```kotlin highlight-android-set-page-duration
engine.block.setDuration(page, duration = 20.0)
```

## Adding a Video Clip

Create a graphic block with a video fill, give it the page duration, place it on a normal video track, and fill the page. This gives the captions actual video content to overlay during preview and export.

```kotlin highlight-android-add-video
    val video = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(video, shape = engine.block.createShape(ShapeType.Rect))
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse(
            "https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
        ),
    )
    engine.block.setFill(video, fill = videoFill)
    engine.block.setDuration(video, duration = 20.0)

    val videoTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = videoTrack)
    engine.block.appendChild(parent = videoTrack, child = video)
    engine.block.fillParent(videoTrack)
```

## Creating a Caption Track

A caption track groups caption blocks under the page. Create it before adding manual or imported captions so every caption has the correct parent.

```kotlin highlight-android-create-caption-track
val captionTrack = engine.block.create(DesignBlockType.CaptionTrack)
engine.block.appendChild(parent = page, child = captionTrack)
```

Caption tracks can either keep each caption's explicit time offset or manage offsets automatically from child durations. Keep `track/automaticallyManageBlockOffsets` set to `false` when you import SRT/VTT captions or set custom offsets yourself; set it to `true` when captions should play back sequentially without gaps.

```kotlin highlight-android-manage-caption-offsets
val manageOffsetsAutomatically = false
engine.block.setBoolean(
    block = captionTrack,
    property = "track/automaticallyManageBlockOffsets",
    value = manageOffsetsAutomatically,
)
```

## Adding Captions

### Creating Caption Blocks

Create caption blocks with `DesignBlockType.Caption`, write their text with the `caption/text` property, and append them to the caption track.

```kotlin highlight-android-create-captions
val caption1 = engine.block.create(DesignBlockType.Caption)
engine.block.setString(caption1, property = "caption/text", value = "Caption text 1")
val caption2 = engine.block.create(DesignBlockType.Caption)
engine.block.setString(caption2, property = "caption/text", value = "Caption text 2")
engine.block.appendChild(parent = captionTrack, child = caption1)
engine.block.appendChild(parent = captionTrack, child = caption2)
```

### Importing Captions from Subtitle Files

Use `createCaptionsFromURI` to parse SRT or VTT files. CE.SDK creates caption blocks with the parsed text and timing values.

```kotlin highlight-android-import-captions
// Captions can also be loaded from a caption file, i.e., from SRT and VTT files.
// The text and timing of the captions are read from the file.
val captions = engine.block.createCaptionsFromURI("https://img.ly/static/examples/captions.srt")
for (caption in captions) {
    engine.block.appendChild(parent = captionTrack, child = caption)
}
```

Imported captions are still normal caption blocks, so you can append them to a caption track and style them with the same APIs as manually created captions.

## Modifying Captions

### Timing

With manual offsets, set the duration and time offset on each caption block. Time values are in seconds.

```kotlin highlight-android-set-timing
    engine.block.setDuration(caption1, duration = 3.0)
    engine.block.setDuration(caption2, duration = 5.0)

    engine.block.setTimeOffset(caption1, offset = 0.0)
    engine.block.setTimeOffset(caption2, offset = 3.0)
```

### Position and Size

Caption position and size are synchronized between caption blocks that share the same caption track, so set the shared layout on one caption per track.

```kotlin highlight-android-position-size
// Position and size sync only with caption blocks under the same caption track.
engine.block.setPositionX(caption1, 0.05F)
engine.block.setPositionXMode(caption1, PositionMode.PERCENT)
engine.block.setPositionY(caption1, 0.8F)
engine.block.setPositionYMode(caption1, PositionMode.PERCENT)
engine.block.setHeight(caption1, 0.15F)
engine.block.setHeightMode(caption1, SizeMode.PERCENT)
engine.block.setWidth(caption1, 0.9F)
engine.block.setWidthMode(caption1, SizeMode.PERCENT)
```

Percentage modes keep the caption box proportional when the output resolution changes.

### Styling

Caption styling properties are also synchronized between caption blocks that share the same caption track. The sample changes text color, background, and drop shadow with dedicated styling setters, then uses property-keyed setters for caption automatic font sizing properties.

```kotlin highlight-android-style-captions
// Style properties sync only with caption blocks under the same caption track.
engine.block.setTextColor(caption1, color = Color.fromRGBA(0.9F, 0.9F, 0F, 1F))
engine.block.setDropShadowEnabled(caption1, enabled = true)
engine.block.setDropShadowColor(caption1, color = Color.fromRGBA(0F, 0F, 0F, 0.8F))
engine.block.setBackgroundColorEnabled(caption1, enabled = true)
engine.block.setBackgroundColor(caption1, color = Color.fromRGBA(0F, 0F, 0F, 0.7F))
// Use property-keyed setters for caption automatic font sizing properties.
engine.block.setBoolean(caption1, property = "caption/automaticFontSizeEnabled", value = true)
engine.block.setFloat(caption1, property = "caption/minAutomaticFontSize", value = 24F)
engine.block.setFloat(caption1, property = "caption/maxAutomaticFontSize", value = 72F)
```

If your app registers a caption-preset asset source, you can query it with `engine.asset.findAssets(...)` and apply a returned asset with `engine.asset.applyAssetSourceAsset(...)`. The compiled sample uses direct block properties so it does not depend on a particular preset source being registered.

## Caption Animations

Caption blocks support the same animation APIs as other animatable blocks. Create an animation and assign it as an in, loop, or out animation.

```kotlin highlight-android-add-animation
val fadeInAnimation = engine.block.createAnimation(AnimationType.Fade)
engine.block.setDuration(fadeInAnimation, duration = 0.3)
engine.block.setInAnimation(caption1, animation = fadeInAnimation)
```

Use entry animations sparingly for captions; timing and readability usually matter more than motion.

## Exporting Videos with Captions

Exporting the page as MP4 burns captions into the rendered video frames. The returned `ByteBuffer` contains the encoded MP4 data with caption pixels at the time offsets defined on each caption block.

```kotlin highlight-android-export-video
// Export page as mp4 video.
val videoBytes = engine.block.exportVideo(
    block = page,
    timeOffset = 0.0,
    duration = engine.block.getDuration(page),
    mimeType = MimeType.MP4,
    progressCallback = {
        Log.i(
            TAG,
            "Rendered ${it.renderedFrames} frames and encoded ${it.encodedFrames} frames out of ${it.totalFrames} frames",
        )
    },
)
```

The export callback reports render and encode progress. Changes made after export starts are not reflected in the exported file because CE.SDK freezes the scene state for that export.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Captions are not visible | The caption is not under a caption track on the page | Check the hierarchy: page, caption track, caption block |
| Caption appears at the wrong time | The time offset or duration is wrong, or automatic offset management is enabled when custom offsets are expected | Read back `getTimeOffset(...)` and `getDuration(...)`, then check `track/automaticallyManageBlockOffsets` on the caption track |
| Subtitle import fails | The URI does not resolve to a valid SRT or VTT file | Verify the URI is reachable from the Android app and that the file format is valid |
| Styling is not applied | The property key is not a caption or text property | Use caption properties such as `caption/text`, `caption/automaticFontSizeEnabled`, and text styling properties |

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.createForVideo()` | Create a video scene |
| `engine.editor.setSettingBoolean(keypath="features/videoCaptionsEnabled", value=_)` | Enable caption editing features |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create the page that contains the video and caption tracks |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create a block for the video clip |
| `engine.block.createShape(type=ShapeType.Rect)` | Create a rectangular shape for the video block |
| `engine.block.setShape(block=_, shape=_)` | Assign the shape to the video block |
| `engine.block.createFill(fillType=FillType.Video)` | Create a video fill |
| `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)` | Set the video file URI |
| `engine.block.setFill(block=_, fill=_)` | Assign the video fill to the video block |
| `engine.block.create(blockType=DesignBlockType.Track)` | Create a video track |
| `engine.block.create(blockType=DesignBlockType.CaptionTrack)` | Create a caption track |
| `engine.block.setBoolean(block=_, property="track/automaticallyManageBlockOffsets", value=_)` | Enable or disable automatic caption offset management |
| `engine.block.create(blockType=DesignBlockType.Caption)` | Create a caption block |
| `engine.block.createCaptionsFromURI(uri=_)` | Import SRT or VTT captions |
| `engine.block.appendChild(parent=_, child=_)` | Add tracks and blocks to the hierarchy |
| `engine.block.fillParent(block=_)` | Size a track to the page |
| `engine.block.setString(block=_, property="caption/text", value=_)` | Set caption text |
| `engine.block.setTimeOffset(block=_, offset=_)` | Set when a caption appears |
| `engine.block.setDuration(block=_, duration=_)` | Set page, video, caption, or animation duration |
| `engine.block.getTimeOffset(block=_)` | Read when a caption appears |
| `engine.block.getDuration(block=_)` | Read a page, video, caption, or animation duration |
| `engine.block.setPositionX(block=_, value=_)` | Set the caption box x position |
| `engine.block.setPositionXMode(block=_, mode=_)` | Set the caption box x position mode |
| `engine.block.setPositionY(block=_, value=_)` | Set the caption box y position |
| `engine.block.setPositionYMode(block=_, mode=_)` | Set the caption box y position mode |
| `engine.block.setWidth(block=_, value=_)` | Set the page width or caption box width |
| `engine.block.setWidthMode(block=_, mode=_)` | Set the caption box width mode |
| `engine.block.setHeight(block=_, value=_)` | Set the page height or caption box height |
| `engine.block.setHeightMode(block=_, mode=_)` | Set the caption box height mode |
| `engine.block.setTextColor(block=_, color=_)` | Set caption text color |
| `engine.block.setDropShadowEnabled(block=_, enabled=_)` | Enable the caption drop shadow |
| `engine.block.setDropShadowColor(block=_, color=_)` | Set caption drop shadow color |
| `engine.block.setBackgroundColorEnabled(block=_, enabled=_)` | Enable the caption background |
| `engine.block.setBackgroundColor(block=_, color=_)` | Set caption background color |
| `engine.block.setBoolean(block=_, property="caption/automaticFontSizeEnabled", value=_)` | Enable automatic caption font sizing |
| `engine.block.setFloat(block=_, property="caption/minAutomaticFontSize", value=_)` | Set the minimum automatic font size |
| `engine.block.setFloat(block=_, property="caption/maxAutomaticFontSize", value=_)` | Set the maximum automatic font size |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query registered caption preset assets |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_, block=_)` | Apply a preset asset to an existing caption block |
| `engine.block.createAnimation(type=_)` | Create an animation block |
| `engine.block.setInAnimation(block=_, animation=_)` | Assign an entry animation |
| `engine.block.setLoopAnimation(block=_, animation=_)` | Assign a looping animation |
| `engine.block.setOutAnimation(block=_, animation=_)` | Assign an exit animation |
| `engine.block.exportVideo(block=_, timeOffset=_, duration=_, mimeType=_, progressCallback=_)` | Export the page with burned-in captions |

## Next Steps

- [Trim](./trim.md) — Documentation for Trim
- [Join and Arrange Video Clips](./join-and-arrange.md) - Combine multiple video clips into sequences and organize them on the timeline using tracks and time offsets in CE.SDK.
- [Video Timeline Overview](../create-video/timeline-editor.md) - Use the timeline editor to arrange and edit video clips, audio, and animations frame by frame.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support