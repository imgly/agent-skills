> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [To MP4](./to-mp4.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-export-to-mp4/ExportToMp4.kt reference-only
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportVideoOptions
import ly.img.engine.ExportVideoProgress
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.io.File
import java.nio.ByteBuffer
import kotlin.coroutines.cancellation.CancellationException

data class Mp4ExportResult(
    val outputFile: File,
    val progressEvents: List<ExportVideoProgress>,
    val cancelableExportCanceled: Boolean,
    val configuredExport: ByteBuffer,
    val partialExport: ByteBuffer,
)

suspend fun exportToMp4(engine: Engine): Mp4ExportResult = withContext(Dispatchers.Main) {
    val page = createVideoPage(engine)
    val pageDuration = engine.block.getDuration(page)

    val defaultExport = exportMp4(engine, page, pageDuration)
    val progressEvents = mutableListOf<ExportVideoProgress>()
    val progressExport = exportMp4WithProgress(engine, page, pageDuration, progressEvents)
    val cancelableJob = startCancelableMp4Export(
        scope = this,
        engine = engine,
        page = page,
        pageDuration = pageDuration,
        onProgress = {},
    )
    cancelMp4Export(cancelableJob)
    cancelableJob.join()
    val resolutionExport = exportMp4WithResolutionOptions(engine, page, pageDuration)
    val configuredExport = exportMp4WithBitrateOptions(engine, page, pageDuration)
    val partialExport = exportPartialTimeline(engine, page)

    check(progressExport.hasRemaining()) { "progress MP4 export is empty" }
    check(cancelableJob.isCancelled) { "MP4 export cancellation was not observed" }
    check(resolutionExport.hasRemaining()) { "resolution MP4 export is empty" }

    Mp4ExportResult(
        outputFile = writeMp4ToTempFile(defaultExport),
        progressEvents = progressEvents.toList(),
        cancelableExportCanceled = cancelableJob.isCancelled,
        configuredExport = configuredExport,
        partialExport = partialExport,
    )
}

suspend fun exportMp4(
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
): ByteBuffer {
    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = pageDuration,
        mimeType = MimeType.MP4,
        progressCallback = {},
    )

    check(videoBytes.hasRemaining()) { "MP4 export is empty" }
    return videoBytes
}

suspend fun exportMp4WithProgress(
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
    progressEvents: MutableList<ExportVideoProgress>,
): ByteBuffer {
    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = pageDuration,
        mimeType = MimeType.MP4,
        progressCallback = { progress ->
            progressEvents += progress
            Log.i(
                "ExportToMp4Guide",
                "Encoded ${progress.encodedFrames} of ${progress.totalFrames} frames",
            )
        },
    )

    check(videoBytes.hasRemaining()) { "progress MP4 export is empty" }
    return videoBytes
}

fun startCancelableMp4Export(
    scope: CoroutineScope,
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
    onProgress: (ExportVideoProgress) -> Unit,
): Job = scope.launch(Dispatchers.Main) {
    try {
        val videoBytes = engine.block.exportVideo(
            block = page,
            timeOffset = 0.0,
            duration = pageDuration,
            mimeType = MimeType.MP4,
            progressCallback = onProgress,
        )
        check(videoBytes.hasRemaining()) { "cancelable MP4 export is empty" }
    } catch (exception: CancellationException) {
        Log.i("ExportToMp4Guide", "MP4 export canceled")
        throw exception
    }
}

fun cancelMp4Export(exportJob: Job) {
    exportJob.cancel()
}

suspend fun exportMp4WithResolutionOptions(
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
): ByteBuffer {
    val options = ExportVideoOptions(
        targetWidth = 1280F,
        targetHeight = 720F,
        frameRate = 30F, // Use 30 fps for smooth playback on common mobile targets.
    )

    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = pageDuration,
        mimeType = MimeType.MP4,
        progressCallback = {},
        options = options,
    )

    check(videoBytes.hasRemaining()) { "resolution MP4 export is empty" }
    return videoBytes
}

suspend fun exportMp4WithBitrateOptions(
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
): ByteBuffer {
    val options = ExportVideoOptions(
        videoBitrate = 8_000_000,
        audioBitrate = 128_000,
    )

    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = pageDuration,
        mimeType = MimeType.MP4,
        progressCallback = {},
        options = options,
    )

    check(videoBytes.hasRemaining()) { "configured MP4 export is empty" }
    return videoBytes
}

suspend fun exportPartialTimeline(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.25, // Start after the first quarter-second to demonstrate offsets.
        duration = 0.5, // Export a short segment so partial exports stay fast.
        mimeType = MimeType.MP4,
        progressCallback = {},
        options = ExportVideoOptions(
            frameRate = 12F, // Lower fps keeps this short preview segment lightweight.
        ),
    )

    check(videoBytes.hasRemaining()) { "partial MP4 export is empty" }
    return videoBytes
}

suspend fun writeMp4ToTempFile(videoBytes: ByteBuffer): File = withContext(Dispatchers.IO) {
    val outputFile = File.createTempFile("export-to-mp4-", ".mp4")
    val videoData = videoBytes.asReadOnlyBuffer()
    outputFile.outputStream().channel.use { channel ->
        while (videoData.hasRemaining()) {
            channel.write(videoData)
        }
    }

    check(outputFile.length() > 0L) { "MP4 output file is empty" }
    outputFile
}

private fun createVideoPage(engine: Engine): DesignBlock {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 640F)
    engine.block.setHeight(page, value = 360F)
    engine.block.setDuration(page, duration = 1.0)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 640F)
    engine.block.setHeight(background, value = 360F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = background,
        color = Color.fromHex("#FF101827"),
    )
    engine.block.appendChild(parent = page, child = background)

    val accent = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(accent, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(accent, value = 320F)
    engine.block.setHeight(accent, value = 180F)
    engine.block.setPositionX(accent, value = 160F)
    engine.block.setPositionY(accent, value = 90F)
    engine.block.setFill(accent, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = accent,
        color = Color.fromHex("#FF42C3A7"),
    )
    engine.block.appendChild(parent = page, child = accent)

    return page
}
```

Export video compositions as MP4 files with H.264 encoding, progress events,
and configurable bitrate and resolution.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/engine-guides-export-to-mp4)

<EngineReferenceNote {...props} />

MP4 is the most widely supported video format. CE.SDK renders the page timeline,
encodes frames with H.264, and muxes audio into the MP4 container on a
background export engine.

This guide covers exporting an existing page block to MP4, tracking progress,
canceling an in-progress export, configuring resolution and bitrate, exporting
a timeline segment, and writing the returned `ByteBuffer` to a file.

> **Caution:** H.264 does not support transparency. Transparent areas in your scene render with
> a black background in the exported MP4.

## Export to MP4

Call `engine.block.exportVideo(...)` with a page block, timeline range, and
`MimeType.MP4`. The method returns a `ByteBuffer` containing the encoded video
data.

```kotlin highlight-android-export-video
suspend fun exportMp4(
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
): ByteBuffer {
    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = pageDuration,
        mimeType = MimeType.MP4,
        progressCallback = {},
    )

    check(videoBytes.hasRemaining()) { "MP4 export is empty" }
    return videoBytes
}
```

Pass the page duration when you want to export the full timeline. The export API
currently supports page blocks for video output.

## Tracking Export Progress

The `progressCallback` receives rendered frames, encoded frames, and total
frames. Use the encoded frame count for user-facing progress because encoding is
usually the slower stage.

```kotlin highlight-android-progress
suspend fun exportMp4WithProgress(
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
    progressEvents: MutableList<ExportVideoProgress>,
): ByteBuffer {
    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = pageDuration,
        mimeType = MimeType.MP4,
        progressCallback = { progress ->
            progressEvents += progress
            Log.i(
                "ExportToMp4Guide",
                "Encoded ${progress.encodedFrames} of ${progress.totalFrames} frames",
            )
        },
    )

    check(videoBytes.hasRemaining()) { "progress MP4 export is empty" }
    return videoBytes
}
```

## Cancel an Export

`engine.block.exportVideo(...)` is a suspending Android API, so cancel the
coroutine that owns the export. Keep the returned `Job` in your UI state or
view model and call `cancel()` when the user cancels the operation.

```kotlin highlight-android-cancel
fun startCancelableMp4Export(
    scope: CoroutineScope,
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
    onProgress: (ExportVideoProgress) -> Unit,
): Job = scope.launch(Dispatchers.Main) {
    try {
        val videoBytes = engine.block.exportVideo(
            block = page,
            timeOffset = 0.0,
            duration = pageDuration,
            mimeType = MimeType.MP4,
            progressCallback = onProgress,
        )
        check(videoBytes.hasRemaining()) { "cancelable MP4 export is empty" }
    } catch (exception: CancellationException) {
        Log.i("ExportToMp4Guide", "MP4 export canceled")
        throw exception
    }
}

fun cancelMp4Export(exportJob: Job) {
    exportJob.cancel()
}
```

Let `CancellationException` propagate after cleanup or logging so structured
concurrency can finish the canceled job correctly. The Android binding stops
the background export engine when the suspending export exits.

## Configure Video Encoding

Pass `ExportVideoOptions` to control the target box, framerate, and bitrate.

### Resolution and Framerate

Set `targetWidth`, `targetHeight`, and `frameRate` when you need a target box
for video output and a predictable playback cadence. CE.SDK renders the page
large enough to fill the target box while preserving its aspect ratio, so the
encoded frame may exceed one requested axis when the page and target box use
different aspect ratios.

```kotlin highlight-android-resolution
suspend fun exportMp4WithResolutionOptions(
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
): ByteBuffer {
    val options = ExportVideoOptions(
        targetWidth = 1280F,
        targetHeight = 720F,
        frameRate = 30F, // Use 30 fps for smooth playback on common mobile targets.
    )

    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = pageDuration,
        mimeType = MimeType.MP4,
        progressCallback = {},
        options = options,
    )

    check(videoBytes.hasRemaining()) { "resolution MP4 export is empty" }
    return videoBytes
}
```

### Video and Audio Bitrate

Set `videoBitrate` and `audioBitrate` in bits per second to control file size
and compression quality. Use `0` when you want the engine to choose a bitrate
automatically.

```kotlin highlight-android-bitrate
suspend fun exportMp4WithBitrateOptions(
    engine: Engine,
    page: DesignBlock,
    pageDuration: Double,
): ByteBuffer {
    val options = ExportVideoOptions(
        videoBitrate = 8_000_000,
        audioBitrate = 128_000,
    )

    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = pageDuration,
        mimeType = MimeType.MP4,
        progressCallback = {},
        options = options,
    )

    check(videoBytes.hasRemaining()) { "configured MP4 export is empty" }
    return videoBytes
}
```

### Export Parameters and Options

| Parameter or option | Default | Description |
| --- | --- | --- |
| `mimeType` | Required | Use `MimeType.MP4` for MP4 video output. |
| `timeOffset` | Required | Start time in seconds on the page timeline. |
| `duration` | Required | Length in seconds to export. Pass the page duration for the full timeline. |
| `progressCallback` | Required | Receives `ExportVideoProgress` with rendered, encoded, and total frame counts. |
| `targetWidth` | `null` | Optional target-box width in pixels. Use with `targetHeight`; the final width may be larger when aspect ratios differ. |
| `targetHeight` | `null` | Optional target-box height in pixels. Use with `targetWidth`; the final height may be larger when aspect ratios differ. |
| `frameRate` | `30F` | Target framerate in Hz. |
| `videoBitrate` | `0` | Video bitrate in bits per second. `0` enables automatic selection. |
| `audioBitrate` | `0` | Audio bitrate in bits per second. `0` enables automatic selection. |
| `allowTextOverhang` | `false` | Includes text bounds that account for glyph overhangs. |

## Export a Partial Timeline

Use `timeOffset` and `duration` to export a segment without changing the scene.
Both values use seconds relative to the page timeline.

```kotlin highlight-android-partial
suspend fun exportPartialTimeline(
    engine: Engine,
    page: DesignBlock,
): ByteBuffer {
    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.25, // Start after the first quarter-second to demonstrate offsets.
        duration = 0.5, // Export a short segment so partial exports stay fast.
        mimeType = MimeType.MP4,
        progressCallback = {},
        options = ExportVideoOptions(
            frameRate = 12F, // Lower fps keeps this short preview segment lightweight.
        ),
    )

    check(videoBytes.hasRemaining()) { "partial MP4 export is empty" }
    return videoBytes
}
```

## Handle Export Results

The returned `ByteBuffer` stays in memory. Write it to app storage, upload it to
your backend, or pass it to another Android API without copying it into an
intermediate array.

```kotlin highlight-android-write-file
suspend fun writeMp4ToTempFile(videoBytes: ByteBuffer): File = withContext(Dispatchers.IO) {
    val outputFile = File.createTempFile("export-to-mp4-", ".mp4")
    val videoData = videoBytes.asReadOnlyBuffer()
    outputFile.outputStream().channel.use { channel ->
        while (videoData.hasRemaining()) {
            channel.write(videoData)
        }
    }

    check(outputFile.length() > 0L) { "MP4 output file is empty" }
    outputFile
}
```

Delete temporary files after your app finishes sharing, uploading, or processing
the exported video.

## Troubleshooting

- **Export fails or hangs**: Make sure the scene and media assets are fully
  loaded before starting the export. Check `engine.editor.getAvailableMemory()`
  before large exports and reduce the requested size or framerate on low-memory
  devices.
- **Poor video quality**: Increase `videoBitrate` and keep source media at
  least as large as the target size.
- **Slow exports**: Lower `targetWidth`, `targetHeight`, `frameRate`, or
  bitrate. Clamp requested dimensions with `engine.editor.getMaxExportSize()` so
  the app does not offer unsupported output sizes.
- **Playback issues on devices**: Lower the requested size, framerate, or
  bitrate, and test the generated MP4 on the devices your app supports.

## API Reference

| API | Description |
| --- | --- |
| `engine.block.exportVideo(block=_, timeOffset=_, duration=_, mimeType=_, progressCallback=_, options=_, onPreExport=_, uriResolver=_)` | Exports a page timeline to a video `ByteBuffer` and reports rendering and encoding progress. |
| `CoroutineScope.launch(context=_)` | Starts a coroutine that can own a long-running export operation. |
| `Job.cancel()` | Requests cancellation of the coroutine running the export. |
| `engine.editor.getAvailableMemory()` | Returns available memory in bytes so apps can avoid starting large exports on low-memory devices. |
| `engine.editor.getMaxExportSize()` | Returns the maximum export dimension in pixels for constraining requested output width and height. |
| `ExportVideoOptions(targetWidth=_, targetHeight=_, frameRate=_, videoBitrate=_, audioBitrate=_, allowTextOverhang=_)` | Configures the MP4 target box, framerate, bitrate, and text overhang behavior. |

## Next Steps

- [Export Overview](./overview.md) - Compare all supported export formats
- [Size Limits](./size-limits.md) - Understand and configure limits on exported file dimensions or data size.
- [Export Audio](./audio.md) - Export audio tracks separately
- [Partial Export](./partial-export.md) - Learn how to export specific blocks, groups, and page elements instead of entire scenes using CE.SDK's programmatic export API.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support