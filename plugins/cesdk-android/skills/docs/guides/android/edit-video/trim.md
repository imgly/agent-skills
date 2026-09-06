> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Trim](./trim.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-trim/Trim.kt reference-only
import android.net.Uri
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import kotlin.math.abs

data class TrimVideoClipsSummary(
    val sourceDuration: Double,
    val trimOffset: Double,
    val trimLength: Double,
    val blockDuration: Double,
    val audioSourceDuration: Double,
    val audioTrimOffset: Double,
    val audioTrimLength: Double,
    val looping: Boolean,
)

fun trimVideoClips(
    license: String?,
    userId: String,
): Job = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.trim.example")
    try {
        engine.start(license = license, userId = userId)
        engine.bindOffscreen(width = 1280, height = 720)
        trimVideoClips(engine)
    } finally {
        engine.stop()
    }
}

suspend fun trimVideoClips(engine: Engine): TrimVideoClipsSummary = withContext(Dispatchers.Main) {
    val sourceVideoUri =
        Uri.parse(
            "https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/" +
                "pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
        )

    engine.scene.createFromVideo(sourceVideoUri)
    val page = engine.scene.getPages().first()
    val videoBlock = engine.block.findByType(DesignBlockType.Graphic).first()
    val videoFill = engine.block.getFill(videoBlock)

    engine.block.forceLoadAVResource(block = videoFill)
    val sourceDuration = engine.block.getAVResourceTotalDuration(block = videoFill)

    check(sourceDuration >= 8.0) {
        "The sample video must be at least 8 seconds long."
    }

    check(engine.block.supportsTrim(block = videoFill)) {
        "This video fill does not support trim properties."
    }

    engine.block.setTrimOffset(block = videoFill, offset = 2.0)
    engine.block.setTrimLength(block = videoFill, length = 5.0)

    val currentTrimOffset = engine.block.getTrimOffset(block = videoFill)
    val currentTrimLength = engine.block.getTrimLength(block = videoFill)
    check(abs(currentTrimOffset - 2.0) < 0.001)
    check(abs(currentTrimLength - 5.0) < 0.001)

    check(engine.block.supportsDuration(block = videoBlock))
    engine.block.setLooping(block = videoFill, looping = false)
    engine.block.setTrimOffset(block = videoFill, offset = 3.0)
    engine.block.setTrimLength(block = videoFill, length = 5.0)
    engine.block.setDuration(block = videoBlock, duration = 5.0)

    val blockDuration = engine.block.getDuration(block = videoBlock)
    check(abs(blockDuration - 5.0) < 0.001)

    engine.block.setLooping(block = videoFill, looping = true)
    engine.block.setTrimOffset(block = videoFill, offset = 5.0)
    engine.block.setTrimLength(block = videoFill, length = 3.0)
    engine.block.setDuration(block = videoBlock, duration = 9.0)

    val looping = engine.block.isLooping(block = videoFill)
    check(looping)

    // Supply this from your media pipeline; Android does not expose source frame rate through the Engine API.
    val knownFrameRate = 30.0
    val startFrame = 60
    val frameCount = 150
    val frameOffset = startFrame / knownFrameRate
    val frameLength = frameCount / knownFrameRate

    engine.block.setTrimOffset(block = videoFill, offset = frameOffset)
    engine.block.setTrimLength(block = videoFill, length = frameLength)

    val trimmableFills =
        engine.block
            .findByType(DesignBlockType.Graphic)
            .map(engine.block::getFill)
            .filter { fill -> engine.block.supportsTrim(block = fill) }

    val loadedFillDurations =
        coroutineScope {
            trimmableFills
                .map { fill ->
                    async {
                        engine.block.forceLoadAVResource(block = fill)
                        fill to engine.block.getAVResourceTotalDuration(block = fill)
                    }
                }.awaitAll()
        }

    for ((fill, duration) in loadedFillDurations) {
        if (duration >= 4.0) {
            engine.block.setTrimOffset(block = fill, offset = 1.0)
            engine.block.setTrimLength(block = fill, length = 3.0)
        }
    }

    val audioBlock = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = audioBlock)

    // Android exposes the audio source URI through the "audio/fileURI" property key.
    engine.block.setUri(
        block = audioBlock,
        property = "audio/fileURI",
        value =
            Uri.parse(
                "https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a",
            ),
    )
    engine.block.forceLoadAVResource(block = audioBlock)
    val audioSourceDuration = engine.block.getAVResourceTotalDuration(block = audioBlock)
    check(audioSourceDuration >= 9.0) {
        "The sample audio must be at least 9 seconds long."
    }
    check(engine.block.supportsTrim(block = audioBlock))

    engine.block.setTrimOffset(block = audioBlock, offset = 1.0)
    engine.block.setTrimLength(block = audioBlock, length = 8.0)
    engine.block.setTimeOffset(block = audioBlock, offset = 2.0)
    engine.block.setDuration(block = audioBlock, duration = 8.0)
    engine.block.setVolume(block = audioBlock, volume = 0.7F)

    TrimVideoClipsSummary(
        sourceDuration = sourceDuration,
        trimOffset = currentTrimOffset,
        trimLength = currentTrimLength,
        blockDuration = blockDuration,
        audioSourceDuration = audioSourceDuration,
        audioTrimOffset = engine.block.getTrimOffset(block = audioBlock),
        audioTrimLength = engine.block.getTrimLength(block = audioBlock),
        looping = looping,
    )
}
```

Control which part of a video or audio source plays by setting trim offsets
and trim lengths while keeping the original media file unchanged.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260906/engine-guides-trim)

<EngineReferenceNote {...props} />

Trimming works together with block timing. Fill-level trim values choose the
portion of the source media that plays, while block-level timing controls when
that block appears in the video composition and how long it stays active.

The Android [Video Editor starter kit](../starterkits/video-editor.md) exposes trim
handles through its timeline. This guide explains that starter kit surface and
focuses on the Engine APIs for trimming video fills and audio blocks
programmatically.

## Understanding Trim Concepts

### Fill-Level Trimming

Fill-level trimming controls the source media range. Use
`setTrimOffset()` to choose where playback starts inside the media file and
`setTrimLength()` to choose how much media plays from that point.

A trim offset of `2.0` skips the first two seconds of the source. A trim length
of `5.0` then plays five seconds from that offset, so the visible range runs
from second 2 to second 7 of the original media.

### Block-Level Timing

Block-level timing controls placement in the composition timeline.
`setTimeOffset()` moves a block relative to its parent timeline, while
`setDuration()` controls how long the block remains active.

Use trim values for source-media in and out points. Use time offset when you
need to arrange clips or audio blocks in the composition. For non-looping video
fills, changing the trim length can update connected block durations. Treat
`setDuration()` as timeline timing and set fill trim values explicitly when you
change source-media in or out points.

### Common Use Cases

- **Remove unwanted segments** - Skip intro or outro sections without changing the source file.
- **Extract key moments** - Use a short range from longer video or audio.
- **Sync audio and video** - Trim related media independently while keeping their timeline offsets aligned.
- **Create loops** - Trim a short segment and repeat it through the block duration.

## Trimming Video via UI

### Accessing Trim Controls

Use the Android [Video Editor starter kit](../starterkits/video-editor.md) when you want
the built-in timeline UI. Selecting a video clip in that starter kit reveals
trim handles at the clip edges. These handles represent the source range that
plays inside the clip.

### Using Trim Handles

Drag the left handle to move the trim offset forward or backward. Drag the
right handle to shorten or extend the trim length.

The starter kit timeline updates the selected range immediately, so the visible
clip range matches the media section that will play in the composition. For
custom Android editing surfaces, drive equivalent controls with the Engine trim
APIs shown below.

### Preview During Trimming

Scrub or play the timeline after changing trim values. Playback reflects the
current trim offset and trim length, which lets you verify the chosen range
before exporting.

## Programmatic Video Trimming

### Loading Video Resources

Load the audio or video resource before reading duration or trim metadata.
`forceLoadAVResource()` downloads and parses the media resource so the engine can
return reliable duration values.

```kotlin highlight-android-load-resource
engine.block.forceLoadAVResource(block = videoFill)
val sourceDuration = engine.block.getAVResourceTotalDuration(block = videoFill)
```

Use `getAVResourceTotalDuration()` to validate requested trim ranges before
setting them.

### Checking Trim Support

Check trim support before applying trim operations. Video fills and audio blocks
support trimming, but pages, scenes, and many graphic-only blocks do not.

```kotlin highlight-android-check-support
check(engine.block.supportsTrim(block = videoFill)) {
    "This video fill does not support trim properties."
}
```

This check keeps custom editing UI from showing trim controls for unsupported
blocks.

### Trimming Video

Apply the trim offset and trim length to the video fill. The values are seconds
in the media timeline and are scaled by playback rate.

```kotlin highlight-android-apply-trim
engine.block.setTrimOffset(block = videoFill, offset = 2.0)
engine.block.setTrimLength(block = videoFill, length = 5.0)
```

This example skips the first two seconds and plays the following five seconds.

### Getting Current Trim Values

Read trim values when you need to populate UI controls, verify a change, or make
relative adjustments.

```kotlin highlight-android-read-trim-values
val currentTrimOffset = engine.block.getTrimOffset(block = videoFill)
val currentTrimLength = engine.block.getTrimLength(block = videoFill)
check(abs(currentTrimOffset - 2.0) < 0.001)
check(abs(currentTrimLength - 5.0) < 0.001)
```

The getters return seconds, using the same unit as the setter APIs.

## Additional Trimming Techniques

### Trimming Audio Blocks

Audio blocks use the same trim APIs as video fills. After loading the audio
resource, set its trim range, timeline placement, and active duration
separately.

```kotlin highlight-android-trim-audio
    // Android exposes the audio source URI through the "audio/fileURI" property key.
    engine.block.setUri(
        block = audioBlock,
        property = "audio/fileURI",
        value =
            Uri.parse(
                "https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a",
            ),
    )
    engine.block.forceLoadAVResource(block = audioBlock)
    val audioSourceDuration = engine.block.getAVResourceTotalDuration(block = audioBlock)
    check(audioSourceDuration >= 9.0) {
        "The sample audio must be at least 9 seconds long."
    }
    check(engine.block.supportsTrim(block = audioBlock))

    engine.block.setTrimOffset(block = audioBlock, offset = 1.0)
    engine.block.setTrimLength(block = audioBlock, length = 8.0)
    engine.block.setTimeOffset(block = audioBlock, offset = 2.0)
    engine.block.setDuration(block = audioBlock, duration = 8.0)
    engine.block.setVolume(block = audioBlock, volume = 0.7F)
```

Use `setTimeOffset()` when the audio should start later in the composition.
Match `setDuration()` to the trim length when the selected audio range should
play once, and use `setVolume()` when the trimmed clip needs a different level.

### Trimming with Block Duration

Trim length and block duration work together, but they are not interchangeable.
For non-looping video fills, call `setTrimLength()` on the fill to choose the
source segment; the Engine updates connected block durations from that trim
length. Use `setDuration()` on the block when you need to control how long the
block stays active in the composition, and read back both values when custom
controls expose them side by side.

```kotlin highlight-android-trim-with-duration
    check(engine.block.supportsDuration(block = videoBlock))
    engine.block.setLooping(block = videoFill, looping = false)
    engine.block.setTrimOffset(block = videoFill, offset = 3.0)
    engine.block.setTrimLength(block = videoFill, length = 5.0)
    engine.block.setDuration(block = videoBlock, duration = 5.0)

    val blockDuration = engine.block.getDuration(block = videoBlock)
    check(abs(blockDuration - 5.0) < 0.001)
```

In this example the trim length and block duration are both set to five seconds,
so the trimmed segment plays once. To keep a longer block duration than the trim
length, enable looping before setting the longer duration.

### Trimming with Looping

Enable looping when a trimmed segment should repeat until the block duration is
filled.

```kotlin highlight-android-trim-with-looping
    engine.block.setLooping(block = videoFill, looping = true)
    engine.block.setTrimOffset(block = videoFill, offset = 5.0)
    engine.block.setTrimLength(block = videoFill, length = 3.0)
    engine.block.setDuration(block = videoBlock, duration = 9.0)

    val looping = engine.block.isLooping(block = videoFill)
    check(looping)
```

Here the three-second trimmed segment repeats to fill the nine-second block
duration.

### Frame-Accurate Trimming

When your app works from known frame numbers, convert those frame values to
seconds before setting the trim APIs.

```kotlin highlight-android-frame-accurate-trim
    // Supply this from your media pipeline; Android does not expose source frame rate through the Engine API.
    val knownFrameRate = 30.0
    val startFrame = 60
    val frameCount = 150
    val frameOffset = startFrame / knownFrameRate
    val frameLength = frameCount / knownFrameRate

    engine.block.setTrimOffset(block = videoFill, offset = frameOffset)
    engine.block.setTrimLength(block = videoFill, length = frameLength)
```

The Android trim APIs accept seconds. Keep the frame rate value tied to the
source media you are trimming.

### Batch Processing Multiple Videos

For repeated trim settings, collect trimmable video fills, start resource-load
coroutines for each fill, and apply the same range to every compatible fill
after the durations are known.

```kotlin highlight-android-batch-trim-videos
    val trimmableFills =
        engine.block
            .findByType(DesignBlockType.Graphic)
            .map(engine.block::getFill)
            .filter { fill -> engine.block.supportsTrim(block = fill) }

    val loadedFillDurations =
        coroutineScope {
            trimmableFills
                .map { fill ->
                    async {
                        engine.block.forceLoadAVResource(block = fill)
                        fill to engine.block.getAVResourceTotalDuration(block = fill)
                    }
                }.awaitAll()
        }

    for ((fill, duration) in loadedFillDurations) {
        if (duration >= 4.0) {
            engine.block.setTrimOffset(block = fill, offset = 1.0)
            engine.block.setTrimLength(block = fill, length = 3.0)
        }
    }
```

Always load each fill before reading its duration because source media can have
different lengths.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Trim values have no visible effect | Await `forceLoadAVResource()` before setting or reading trim properties. |
| Trim starts at the wrong point | Use `setTrimOffset()` for the source-media start point and `setTimeOffset()` for timeline placement. |
| Playback continues longer than expected | Check whether looping is enabled, then read back `getDuration()` and `getTrimLength()` after changing trim or duration controls. |
| Audio and video drift out of sync | Apply coordinated trim offsets and timeline offsets to both media blocks. |

## API Reference

| API | Description |
| --- | --- |
| `engine.block.findByType(type=_)` | Finds blocks of a specific Android `DesignBlockType` |
| `engine.block.getFill(block=_)` | Gets the fill block attached to a graphic block |
| `engine.block.setUri(block=_, property="audio/fileURI", value=_)` | Assigns an audio source URI to an audio block |
| `engine.block.getUri(block=_, property="audio/fileURI")` | Reads the audio source URI assigned to an audio block |
| `engine.block.forceLoadAVResource(block=_)` | Loads audio or video metadata before trim and duration access |
| `engine.block.getAVResourceTotalDuration(block=_)` | Returns the source media duration in seconds |
| `engine.block.supportsTrim(block=_)` | Checks whether a block or fill supports trim properties |
| `engine.block.setTrimOffset(block=_, offset=_)` | Sets the source-media playback start in seconds |
| `engine.block.getTrimOffset(block=_)` | Reads the current trim offset in seconds |
| `engine.block.setTrimLength(block=_, length=_)` | Sets how much source media plays from the trim offset |
| `engine.block.getTrimLength(block=_)` | Reads the current trim length in seconds |
| `engine.block.supportsDuration(block=_)` | Checks whether a block supports playback duration |
| `engine.block.setDuration(block=_, duration=_)` | Sets how long the block is active in the composition |
| `engine.block.getDuration(block=_)` | Reads the block duration in seconds |
| `engine.block.supportsTimeOffset(block=_)` | Checks whether a block supports timeline placement |
| `engine.block.setTimeOffset(block=_, offset=_)` | Sets when the block becomes active in its parent timeline |
| `engine.block.getTimeOffset(block=_)` | Reads when the block becomes active in its parent timeline |
| `engine.block.setLooping(block=_, looping=_)` | Enables or disables looping for the media block or fill |
| `engine.block.isLooping(block=_)` | Reads whether looping is enabled |
| `engine.block.supportsPlaybackControl(block=_)` | Checks whether a block supports playback controls such as volume |
| `engine.block.setVolume(block=_, volume=_)` | Sets audio volume from `0.0F` to `1.0F` |
| `engine.block.getVolume(block=_)` | Reads audio volume from `0.0F` to `1.0F` |

## Next Steps

- [Split Video and Audio](./split.md) - Learn how to split video and audio clips at specific time points in CE.SDK, creating two independent segments from a single clip.
- [Control Audio and Video](../create-video/control.md) - Master playback controls, volume, and muting.
- [Timeline Editor](../create-video/timeline-editor.md) - Understand the complete timeline editing model.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support