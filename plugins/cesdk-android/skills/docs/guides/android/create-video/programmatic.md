> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Programmatic Creation](./programmatic.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-video-programmatic/CreateVideoProgrammatic.kt reference-only
import android.net.Uri
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportVideoOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.VideoBitrate
import java.io.File

suspend fun createVideoProgrammatic(engine: Engine): File = withContext(Dispatchers.Main) {
    val scene = engine.scene.createForVideo()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.appendChild(parent = scene, child = page)

    val introClip = createVideoClip(
        engine,
        Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
    )
    val detailClip = createVideoClip(
        engine,
        Uri.parse("https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-kampus-production-8154913.mp4"),
    )

    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)
    engine.block.appendChild(parent = track, child = introClip.block)
    engine.block.appendChild(parent = track, child = detailClip.block)
    engine.block.fillParent(track)

    // Keep the guide export short; use the clip length your app needs.
    val sampleClipDurationSeconds = 2.0

    engine.block.forceLoadAVResource(introClip.fill)
    val introDuration = sampleClipDurationSeconds.coerceAtMost(engine.block.getAVResourceTotalDuration(introClip.fill))
    check(introDuration > 0.0) { "The intro video must contain playable media." }
    engine.block.setDuration(introClip.block, duration = introDuration)

    engine.block.forceLoadAVResource(detailClip.fill)
    val detailDuration = sampleClipDurationSeconds.coerceAtMost(engine.block.getAVResourceTotalDuration(detailClip.fill))
    check(detailDuration > 0.0) { "The detail video must contain playable media." }
    engine.block.setDuration(detailClip.block, duration = detailDuration)

    val pageDuration = introDuration + detailDuration
    engine.block.setDuration(page, duration = pageDuration)

    val logTag = "CreateVideoGuide"
    // Export a compact preview file; use your delivery size and frame rate in production.
    val previewExportWidth = 640F
    val previewExportHeight = 360F
    val previewFrameRate = 15F

    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = engine.block.getDuration(page),
        mimeType = MimeType.MP4,
        progressCallback = { progress ->
            Log.i(
                logTag,
                "Rendered ${progress.renderedFrames} frames and encoded ${progress.encodedFrames} " +
                    "frames out of ${progress.totalFrames} frames",
            )
        },
        options = ExportVideoOptions(
            // VideoBitrate.Auto derives a bounded bitrate from the resolution/framerate,
            // consistent across platforms. Pass VideoBitrate.Custom(bitsPerSecond) instead
            // for an explicit bitrate.
            videoBitrate = VideoBitrate.Auto,
            targetWidth = previewExportWidth,
            targetHeight = previewExportHeight,
            frameRate = previewFrameRate,
        ),
    )

    val outputFile = withContext(Dispatchers.IO) {
        val outputFile = File.createTempFile("programmatic-video-", ".mp4")
        val bytes = ByteArray(videoBytes.remaining())
        videoBytes.get(bytes)
        outputFile.outputStream().use { output ->
            output.write(bytes)
        }
        outputFile
    }
    check(outputFile.length() > 0L) { "The exported MP4 file must not be empty." }

    outputFile
}

private data class VideoClip(
    val block: DesignBlock,
    val fill: DesignBlock,
)

private fun createVideoClip(
    engine: Engine,
    videoUri: Uri,
): VideoClip {
    val clip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(clip, shape = engine.block.createShape(ShapeType.Rect))

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        // Video fills read their media source from this Engine property key.
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(clip, fill = videoFill)

    return VideoClip(block = clip, fill = videoFill)
}

suspend fun createSingleSourceVideoScene(engine: Engine): DesignBlock {
    val videoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4")
    val scene = engine.scene.createFromVideo(videoUri)

    return scene
}
```

Create a video scene entirely through code, add clips to a track, set
durations, and export the result as an MP4 file.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260821/engine-guides-create-video-programmatic)

<EngineReferenceNote {...props} />

CE.SDK video scenes can be built without opening the editor UI. This is useful
for automation, template-driven rendering, and app flows that create media from
known inputs.

This guide uses the Android Engine API to create a video scene, arrange clips on
a track, load media metadata, set durations, and export the page as MP4.
Use [Programmatic Editing](../edit-video/programmatic.md) when you need trim, split,
timed overlay, or other edit recipes after the initial scene is created.

For Engine initialization and offscreen rendering setup, see [Headless Mode](../concepts/headless-mode.md).

## Create a Video Scene

Create a timeline-enabled scene with `engine.scene.createForVideo()`. A page
holds the video composition and defines the canvas dimensions.

```kotlin highlight-android-create-scene
    val scene = engine.scene.createForVideo()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.appendChild(parent = scene, child = page)
```

For a one-source video scene, use `engine.scene.createFromVideo(videoUri)` as a
shortcut. The main sample uses `createForVideo()` because it shows tracks,
multiple clips, and export timing.

```kotlin highlight-android-create-from-video
suspend fun createSingleSourceVideoScene(engine: Engine): DesignBlock {
    val videoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4")
    val scene = engine.scene.createFromVideo(videoUri)

    return scene
}
```

## Add Video Clips

Each clip is a graphic block with a rectangular shape and a video fill. The
helper returns both handles because later timing APIs operate on the graphic
block, while media metadata APIs operate on the video fill.

```kotlin highlight-android-create-video-clip-helper
private data class VideoClip(
    val block: DesignBlock,
    val fill: DesignBlock,
)

private fun createVideoClip(
    engine: Engine,
    videoUri: Uri,
): VideoClip {
    val clip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(clip, shape = engine.block.createShape(ShapeType.Rect))

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        // Video fills read their media source from this Engine property key.
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(clip, fill = videoFill)

    return VideoClip(block = clip, fill = videoFill)
}
```

Create the clips from source URLs:

```kotlin highlight-android-add-video-clips
val introClip = createVideoClip(
    engine,
    Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
)
val detailClip = createVideoClip(
    engine,
    Uri.parse("https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-kampus-production-8154913.mp4"),
)
```

## Arrange Clips on a Track

Append the clips to a `DesignBlockType.Track` in playback order. The track
sequences its children from their durations, and `fillParent(track)` sizes the
track block to its parent page. For groups and tracks, `fillParent(...)` also
fills their child blocks against the nearest parent that is not a group or
track, so the unsized clip graphics in this sample fill the page frame before
the track is sized.

```kotlin highlight-android-arrange-track
val track = engine.block.create(DesignBlockType.Track)
engine.block.appendChild(parent = page, child = track)
engine.block.appendChild(parent = track, child = introClip.block)
engine.block.appendChild(parent = track, child = detailClip.block)
engine.block.fillParent(track)
```

## Load Media and Set Durations

Load each video resource before reading metadata. Duration values use seconds.

```kotlin highlight-android-load-media-and-timing
    // Keep the guide export short; use the clip length your app needs.
    val sampleClipDurationSeconds = 2.0

    engine.block.forceLoadAVResource(introClip.fill)
    val introDuration = sampleClipDurationSeconds.coerceAtMost(engine.block.getAVResourceTotalDuration(introClip.fill))
    check(introDuration > 0.0) { "The intro video must contain playable media." }
    engine.block.setDuration(introClip.block, duration = introDuration)

    engine.block.forceLoadAVResource(detailClip.fill)
    val detailDuration = sampleClipDurationSeconds.coerceAtMost(engine.block.getAVResourceTotalDuration(detailClip.fill))
    check(detailDuration > 0.0) { "The detail video must contain playable media." }
    engine.block.setDuration(detailClip.block, duration = detailDuration)

    val pageDuration = introDuration + detailDuration
    engine.block.setDuration(page, duration = pageDuration)
```

The sample derives safe clip durations from the source media duration and sets
the page duration to the combined clip length.

## Export the Video

Export the page with `engine.block.exportVideo(...)`. The sample exports MP4,
reports encoding progress, and uses export options to produce a smaller
verification file while keeping the page at 1280x720. It also sets
`VideoBitrate.Auto`, a bounded bitrate derived from the resolution
and frame rate that stays consistent across platforms.

```kotlin highlight-android-export-video
    val logTag = "CreateVideoGuide"
    // Export a compact preview file; use your delivery size and frame rate in production.
    val previewExportWidth = 640F
    val previewExportHeight = 360F
    val previewFrameRate = 15F

    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = engine.block.getDuration(page),
        mimeType = MimeType.MP4,
        progressCallback = { progress ->
            Log.i(
                logTag,
                "Rendered ${progress.renderedFrames} frames and encoded ${progress.encodedFrames} " +
                    "frames out of ${progress.totalFrames} frames",
            )
        },
        options = ExportVideoOptions(
            // VideoBitrate.Auto derives a bounded bitrate from the resolution/framerate,
            // consistent across platforms. Pass VideoBitrate.Custom(bitsPerSecond) instead
            // for an explicit bitrate.
            videoBitrate = VideoBitrate.Auto,
            targetWidth = previewExportWidth,
            targetHeight = previewExportHeight,
            frameRate = previewFrameRate,
        ),
    )
```

Write the returned `ByteBuffer` to an MP4 file and check that the export is
non-empty before returning it.

```kotlin highlight-android-write-file
val outputFile = withContext(Dispatchers.IO) {
    val outputFile = File.createTempFile("programmatic-video-", ".mp4")
    val bytes = ByteArray(videoBytes.remaining())
    videoBytes.get(bytes)
    outputFile.outputStream().use { output ->
        output.write(bytes)
    }
    outputFile
}
check(outputFile.length() > 0L) { "The exported MP4 file must not be empty." }
```

## API Reference

| API | Category | Purpose |
| --- | --- | --- |
| `engine.scene.createForVideo()` | Scene | Create an empty video scene with timeline support. |
| `engine.scene.createFromVideo(videoUri=_)` | Scene | Create a one-source video scene from a `Uri`. |
| `engine.block.create(blockType=_)` | Block | Create pages, tracks, graphics, and other blocks. |
| `engine.block.createShape(type=_)` | Shape | Create a shape for a graphic block. |
| `engine.block.setShape(block=_, shape=_)` | Shape | Assign a shape to a graphic block. |
| `engine.block.createFill(fillType=_)` | Fill | Create a video fill. |
| `engine.block.setFill(block=_, fill=_)` | Fill | Assign a fill to a block. |
| `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)` | Fill | Set the source URI on a video fill. |
| `engine.block.appendChild(parent=_, child=_)` | Hierarchy | Attach scene, page, track, and clip blocks. |
| `engine.block.fillParent(block=_)` | Layout | Resize and position the passed block to fill its parent; for groups and tracks, fill child blocks against the nearest non-group/non-track parent first. |
| `engine.block.setWidth(block=_, value=_)` | Layout | Set a block width. |
| `engine.block.setHeight(block=_, value=_)` | Layout | Set a block height. |
| `engine.block.setDuration(block=_, duration=_)` | Timing | Set clip or page duration in seconds. |
| `engine.block.getDuration(block=_)` | Timing | Read the page duration passed to the video export. |
| `engine.block.forceLoadAVResource(block=_)` | Media | Load a video fill before reading metadata. |
| `engine.block.getAVResourceTotalDuration(block=_)` | Media | Read the source media duration in seconds. |
| `engine.block.exportVideo(block=_, timeOffset=_, duration=_, mimeType=_, progressCallback=_, options=_, onPreExport=_, uriResolver=_)` | Export | Export a page timeline as video bytes. |

## Troubleshooting

- **Engine reference is unavailable**: Initialize CE.SDK and obtain an `Engine`
  instance before running the scene creation code; the Engine reference note
  above links to the setup flow.
- **Clip not visible**: Verify that the graphic block has a shape and fill, and
  that it is appended to a track or page.
- **Source duration is zero**: Call `forceLoadAVResource(...)` on the video
  fill before metadata APIs.
- **Export is empty**: Set a positive page duration and pass the same duration
  to `exportVideo(...)`.
- **Remote media does not load**: Check that the URL is reachable and that the
  device runtime supports the media format.

## Next Steps

- [Create Videos Overview](./overview.md) - Understand video scenes and time-based editing
- [Programmatic Editing](../edit-video/programmatic.md) - Modify timelines with trim, split, and timed overlay recipes
- [Timeline Editor](./timeline-editor.md) - Build interactive video timelines
- [Join and Arrange Video Clips](../edit-video/join-and-arrange.md) - Combine multiple video clips into sequences and organize them on the timeline using tracks and time offsets in CE.SDK.
- [Trim](../edit-video/trim.md) — Documentation for Trim
- [Control Audio and Video](./control.md) - Configure playback, trim, and resource control
- [Export](../export-save-publish/export.md) - Export images, videos, and other output formats



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support