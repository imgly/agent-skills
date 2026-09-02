> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Export Media Assets](./export.md) > [For Social Media](./for-social-media.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-export-for-social-media/ForSocialMedia.kt reference-only
import android.net.Uri
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.ExportVideoOptions
import ly.img.engine.ExportVideoProgress
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.io.File

suspend fun exportForSocialMedia(
    engine: Engine,
    progressObserver: (ExportVideoProgress) -> Unit = {},
): File = withContext(Dispatchers.Main) {
    val scene = engine.scene.createForVideo()
    engine.scene.setDesignUnit(DesignUnit.PIXEL)

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(block = page, value = 1080F)
    engine.block.setHeight(block = page, value = 1920F)

    val clip = createSocialMediaVideoClip(
        engine = engine,
        videoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
    )

    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)
    engine.block.appendChild(parent = track, child = clip.block)
    engine.block.fillParent(track)

    engine.block.forceLoadAVResource(block = clip.fill)
    // Keep this sample compact by exporting at most one second of source media.
    val exportDuration = 1.0.coerceAtMost(engine.block.getAVResourceTotalDuration(block = clip.fill))
    check(exportDuration > 0.0) { "The source video must contain playable media." }
    engine.block.setDuration(block = clip.block, duration = exportDuration)
    engine.block.setDuration(block = page, duration = exportDuration)

    val exportOptions = ExportVideoOptions(
        targetWidth = 1080F,
        targetHeight = 1920F,
        // 30 fps is a common default for short-form vertical video.
        frameRate = 30F,
        // 8 Mbps balances quality and upload size for short-form video.
        videoBitrate = 8_000_000,
    )

    val progressCallback: (ExportVideoProgress) -> Unit = { progress ->
        reportExportProgress(progress)
        progressObserver(progress)
    }

    val videoData = engine.block.exportVideo(
        block = page,
        // Start at the beginning of the page timeline.
        timeOffset = 0.0,
        duration = engine.block.getDuration(block = page),
        mimeType = MimeType.MP4,
        progressCallback = progressCallback,
        options = exportOptions,
    )

    check(videoData.remaining() > 0) { "The exported MP4 data must not be empty." }

    val outputFile = withContext(Dispatchers.IO) {
        val file = File.createTempFile("social-media-export-", ".mp4")
        file.outputStream().use { output ->
            val buffer = videoData.asReadOnlyBuffer()
            while (buffer.hasRemaining()) {
                output.channel.write(buffer)
            }
        }
        file
    }
    check(outputFile.length() > 0L) { "The exported MP4 file must not be empty." }

    outputFile
}

private fun reportExportProgress(progress: ExportVideoProgress) {
    if (progress.totalFrames > 0) {
        val percent = (progress.encodedFrames.toFloat() / progress.totalFrames * 100).toInt()
        Log.i(
            "SocialMediaExport",
            "Encoded $percent% (${progress.encodedFrames}/${progress.totalFrames} frames)",
        )
    }
}

private data class SocialMediaVideoClip(
    val block: DesignBlock,
    val fill: DesignBlock,
)

private fun createSocialMediaVideoClip(
    engine: Engine,
    videoUri: Uri,
): SocialMediaVideoClip {
    val clip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = clip, shape = engine.block.createShape(type = ShapeType.Rect))
    engine.block.setContentFillMode(block = clip, mode = ContentFillMode.COVER)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(block = clip, fill = videoFill)

    return SocialMediaVideoClip(block = clip, fill = videoFill)
}
```

Export vertical video designs for social media platforms with the correct
dimensions, format, and quality settings.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/engine-guides-export-for-social-media)

<EngineReferenceNote {...props} />

Short-form vertical video uses a 9:16 aspect ratio. Instagram Reels, TikTok,
and YouTube Shorts commonly use 1080×1920 pixels for that format. This guide
creates a vertical video scene, exports it as MP4, and tracks frame progress
while the export runs.

## Creating a Scene

Create a video scene and use pixels as the design unit so the page dimensions
match the delivery size. Add a 1080×1920 page, which is the block exported
later.

```kotlin highlight-android-create-scene
    val scene = engine.scene.createForVideo()
    engine.scene.setDesignUnit(DesignUnit.PIXEL)

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(block = page, value = 1080F)
    engine.block.setHeight(block = page, value = 1920F)
```

`engine.scene.createForVideo()` enables timeline behavior for the scene.
`engine.scene.setDesignUnit(DesignUnit.PIXEL)` makes the width and height values
line up with the requested social video resolution.

## Adding a Video

Each video clip is a graphic block with a rectangle shape and a video fill. Use
`ContentFillMode.COVER` when the source video should fill the clip frame,
cropping edges if needed.

```kotlin highlight-android-create-video-clip-helper
private data class SocialMediaVideoClip(
    val block: DesignBlock,
    val fill: DesignBlock,
)

private fun createSocialMediaVideoClip(
    engine: Engine,
    videoUri: Uri,
): SocialMediaVideoClip {
    val clip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = clip, shape = engine.block.createShape(type = ShapeType.Rect))
    engine.block.setContentFillMode(block = clip, mode = ContentFillMode.COVER)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(block = clip, fill = videoFill)

    return SocialMediaVideoClip(block = clip, fill = videoFill)
}
```

Add the clip to a track and make the track fill the page.

```kotlin highlight-android-add-video
    val clip = createSocialMediaVideoClip(
        engine = engine,
        videoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
    )

    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)
    engine.block.appendChild(parent = track, child = clip.block)
    engine.block.fillParent(track)
```

For groups and tracks, `fillParent(...)` also sizes child graphics against the
nearest non-group, non-track parent, so the unsized clip fills the page frame.

## Loading Media and Setting Duration

Load the media resource before export so duration metadata is available. The
sample exports one second of video and applies the same duration to the clip and
the page.

```kotlin highlight-android-load-media
engine.block.forceLoadAVResource(block = clip.fill)
// Keep this sample compact by exporting at most one second of source media.
val exportDuration = 1.0.coerceAtMost(engine.block.getAVResourceTotalDuration(block = clip.fill))
check(exportDuration > 0.0) { "The source video must contain playable media." }
engine.block.setDuration(block = clip.block, duration = exportDuration)
engine.block.setDuration(block = page, duration = exportDuration)
```

## Configuring Export Options

`ExportVideoOptions` controls the encoded output. For short-form vertical video,
export to 1080×1920 at 30 frames per second with an 8 Mbps video bitrate.

```kotlin highlight-android-export-options
val exportOptions = ExportVideoOptions(
    targetWidth = 1080F,
    targetHeight = 1920F,
    // 30 fps is a common default for short-form vertical video.
    frameRate = 30F,
    // 8 Mbps balances quality and upload size for short-form video.
    videoBitrate = 8_000_000,
)
```

Key video export settings:

- **targetWidth / targetHeight**: Output resolution, 1080×1920 for vertical
  video.
- **frameRate**: Target export frame rate in Hz, commonly 30 for social video.
- **videoBitrate**: Video bitrate in bits per second; 8 Mbps balances quality
  and upload size for short-form video.

Higher bitrates can improve quality but increase the file size. Set
`videoBitrate` to `0` when you want CE.SDK to choose a bitrate automatically.

## Exporting Videos

Export the page with `engine.block.exportVideo(...)`. Use `MimeType.MP4` for
broad platform compatibility, pass the full page duration, and attach the export
options. The callback reports each progress event before forwarding it to the
caller's observer, so observing progress does not replace the reporting path.

```kotlin highlight-android-export-video
    val progressCallback: (ExportVideoProgress) -> Unit = { progress ->
        reportExportProgress(progress)
        progressObserver(progress)
    }

    val videoData = engine.block.exportVideo(
        block = page,
        // Start at the beginning of the page timeline.
        timeOffset = 0.0,
        duration = engine.block.getDuration(block = page),
        mimeType = MimeType.MP4,
        progressCallback = progressCallback,
        options = exportOptions,
    )

    check(videoData.remaining() > 0) { "The exported MP4 data must not be empty." }
```

The Android API returns a `ByteBuffer` containing the encoded MP4 data. The
sample verifies that the buffer is non-empty before saving it.

## Tracking Export Progress

Video exports run across multiple engine update iterations. The callback
receives `ExportVideoProgress` with these frame counts:

- **renderedFrames**: Frames rendered by the engine.
- **encodedFrames**: Frames written by the encoder.
- **totalFrames**: Total frames expected for the export.

The reporting function calculates progress from `encodedFrames / totalFrames`
and guards against `totalFrames == 0` before dividing.

```kotlin highlight-android-report-progress
private fun reportExportProgress(progress: ExportVideoProgress) {
    if (progress.totalFrames > 0) {
        val percent = (progress.encodedFrames.toFloat() / progress.totalFrames * 100).toInt()
        Log.i(
            "SocialMediaExport",
            "Encoded $percent% (${progress.encodedFrames}/${progress.totalFrames} frames)",
        )
    }
}
```

Use the forwarded observer to update your app's progress UI or collect export
metrics while preserving the same reporting path.

## Saving the Exported Video

Write a read-only view of the returned `ByteBuffer` to an `.mp4` file when your
app needs to hand the result to a share sheet, upload pipeline, or media storage
flow.

```kotlin highlight-android-save-file
val outputFile = withContext(Dispatchers.IO) {
    val file = File.createTempFile("social-media-export-", ".mp4")
    file.outputStream().use { output ->
        val buffer = videoData.asReadOnlyBuffer()
        while (buffer.hasRemaining()) {
            output.channel.write(buffer)
        }
    }
    file
}
check(outputFile.length() > 0L) { "The exported MP4 file must not be empty." }
```

For uploads, stream the same buffer data to your app's storage client instead of
writing a temporary file first. The sample returns ownership of its temporary
file to the caller. Persist it if it must outlive the current operation, and
delete it after sharing or uploading.

## API Reference

| Android API                                                                                                                            | Purpose                                               |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `engine.scene.createForVideo()`                                                                                                        | Create a scene with timeline support.                 |
| `engine.scene.setDesignUnit(designUnit=_)`                                                                                             | Set the scene unit used by page dimensions.           |
| `engine.block.create(blockType=_)`                                                                                                     | Create page, track, and graphic blocks.               |
| `engine.block.createShape(type=_)`                                                                                                     | Create the rectangular clip shape.                    |
| `engine.block.setShape(block=_, shape=_)`                                                                                              | Assign the shape to the video graphic.                |
| `engine.block.setContentFillMode(block=_, mode=_)`                                                                                     | Control how the video fills the graphic frame.        |
| `engine.block.createFill(fillType=_)`                                                                                                  | Create the video fill.                                |
| `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)`                                                                 | Set the source URI on the video fill.                 |
| `engine.block.setFill(block=_, fill=_)`                                                                                                | Attach the video fill to the graphic.                 |
| `engine.block.appendChild(parent=_, child=_)`                                                                                          | Attach scene, page, track, and clip blocks.           |
| `engine.block.fillParent(block=_)`                                                                                                     | Resize a block to its parent frame.                   |
| `engine.block.setWidth(block=_, value=_)`                                                                                              | Set the page width.                                   |
| `engine.block.setHeight(block=_, value=_)`                                                                                             | Set the page height.                                  |
| `engine.block.forceLoadAVResource(block=_)`                                                                                            | Load video metadata before duration reads and export. |
| `engine.block.getAVResourceTotalDuration(block=_)`                                                                                     | Read the source media duration in seconds.            |
| `engine.block.setDuration(block=_, duration=_)`                                                                                        | Set clip and page playback duration in seconds.       |
| `engine.block.getDuration(block=_)`                                                                                                    | Read the page duration passed to export.              |
| `engine.block.exportVideo(block=_, timeOffset=_, duration=_, mimeType=_, progressCallback=_, options=_, onPreExport=_, uriResolver=_)` | Export a page timeline as MP4 bytes.                  |

### Export Options (Videos)

| Option              | Type      | Description                                                         |
| ------------------- | --------- | ------------------------------------------------------------------- |
| `targetWidth`       | `Float?`  | Output width in pixels when used with `targetHeight`.               |
| `targetHeight`      | `Float?`  | Output height in pixels when used with `targetWidth`.               |
| `frameRate`         | `Float`   | Target export frame rate in Hz.                                     |
| `videoBitrate`      | `Int`     | Video bitrate in bits per second, or `0` for automatic selection.   |
| `audioBitrate`      | `Int`     | Audio bitrate in bits per second, or `0` for automatic selection.   |
| `allowTextOverhang` | `Boolean` | Include glyph overhang bounds to avoid clipping text during export. |

## Next Steps

- [Options](./export/overview.md) — Explore export options, supported formats, and
  configuration features for sharing or rendering output.
- [To MP4](./export/to-mp4.md) — Export video compositions as MP4 files with configurable
  encoding options, progress tracking, and resolution control.
- [Compress Exports](./export/compress.md) — Tune format-specific compression settings
  to reduce export file sizes.
- [Size Limits](./export/size-limits.md) — Understand and configure limits on exported
  file dimensions or data size.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support