> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Export Media Assets](./export.md) > [Thumbnail Previews](./thumbnail-previews.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-thumbnail-previews/ThumbnailPreviews.kt reference-only
import android.content.res.Resources
import android.graphics.Bitmap
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.cancelAndJoin
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.VideoThumbnailResult
import kotlin.math.roundToInt

/**
 * The engine renders thumbnails at most this large on each side. Larger requests are
 * bilinear-upscaled from that render, so they cost more memory without adding detail.
 */
private const val MAX_THUMBNAIL_RENDER_SIZE = 512

data class Waveform(
    val left: List<Float>,
    val right: List<Float>,
    val chunkCount: Int,
)

data class ThumbnailPreviews(
    val filmstrip: List<Bitmap>,
    val storyboard: List<Bitmap>,
    val previewFrame: Bitmap,
    val waveform: Waveform,
    val framesBeforeCancel: Int,
)

suspend fun thumbnailPreviews(
    engine: Engine,
    assetBaseUri: Uri,
): ThumbnailPreviews {
    val videoUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.video")
        .appendPath("videos")
        .appendPath("pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4")
        .build()
    val audioUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.audio")
        .appendPath("audios")
        .appendPath("far_from_home.m4a")
        .build()

    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.setDuration(page, duration = 10.0)

    val videoTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = videoTrack)

    val clip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(clip, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(clip, value = 1280F)
    engine.block.setHeight(clip, value = 720F)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(clip, fill = videoFill)
    engine.block.appendChild(parent = videoTrack, child = clip)

    val audioTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = audioTrack)

    val audioClip = engine.block.create(DesignBlockType.Audio)
    engine.block.setUri(
        block = audioClip,
        property = "audio/fileURI",
        value = audioUri,
    )
    engine.block.appendChild(parent = audioTrack, child = audioClip)

    engine.block.setDuration(clip, duration = 10.0)
    engine.block.setDuration(audioClip, duration = 10.0)

    // Both APIs wait for the resource on their own, but loading it up front avoids a first
    // request that returns before the media is decodable.
    engine.block.forceLoadAVResource(videoFill)
    engine.block.forceLoadAVResource(audioClip)

    // Video fills are sampled in media time, so measure the source, not the clip.
    val sourceDuration = engine.block.getAVResourceTotalDuration(videoFill)

    return ThumbnailPreviews(
        filmstrip = generateFilmstrip(engine = engine, videoFill = videoFill, sourceDuration = sourceDuration),
        storyboard = generateStoryboard(engine = engine, page = page),
        previewFrame = capturePreviewFrame(engine = engine, page = page, time = 4.0),
        waveform = generateWaveform(engine = engine, block = audioClip, duration = 10.0),
        framesBeforeCancel = cancelFilmstripEarly(engine = engine, videoFill = videoFill, sourceDuration = sourceDuration),
    )
}

// thumbnailHeight is measured in pixels, not dp, so convert your layout height first.
// Clamping to the engine's render cap keeps the request at a size that adds real detail.
fun thumbnailHeightPx(dp: Float): Int {
    val density = Resources.getSystem().displayMetrics.density
    return (dp * density).roundToInt().coerceIn(1, MAX_THUMBNAIL_RENDER_SIZE)
}

suspend fun generateFilmstrip(
    engine: Engine,
    videoFill: DesignBlock,
    sourceDuration: Double,
    numberOfFrames: Int = 8,
): List<Bitmap> {
    // Frames are not guaranteed to arrive in index order, so key them by the reported index.
    val frames = sortedMapOf<Int, VideoThumbnailResult>()

    engine.block.generateVideoThumbnailSequence(
        block = videoFill,
        thumbnailHeight = thumbnailHeightPx(dp = 48F),
        timeBegin = 0.0,
        timeEnd = sourceDuration,
        numberOfFrames = numberOfFrames,
    ).collect { result ->
        frames[result.frameIndex] = result
    }

    // Collection has to happen on the main thread, and the collector must not suspend:
    // the callback channel is bounded, so a slow collector drops frames. Decode after.
    return withContext(Dispatchers.Default) {
        frames.values.map(::videoThumbnailToBitmap)
    }
}

fun videoThumbnailToBitmap(result: VideoThumbnailResult): Bitmap {
    val bitmap = Bitmap.createBitmap(result.width, result.height, Bitmap.Config.ARGB_8888)
    bitmap.copyPixelsFromBuffer(result.imageData)

    // copyPixelsFromBuffer leaves the buffer position at its limit. Rewind it, or converting
    // the same result again throws "Buffer not large enough for pixels".
    result.imageData.rewind()

    return bitmap
}

suspend fun generateStoryboard(
    engine: Engine,
    page: DesignBlock,
    numberOfFrames: Int = 6,
): List<Bitmap> {
    val frames = sortedMapOf<Int, VideoThumbnailResult>()

    engine.block.generateVideoThumbnailSequence(
        block = page,
        thumbnailHeight = thumbnailHeightPx(dp = 96F),
        timeBegin = 0.0,
        timeEnd = engine.block.getDuration(page),
        numberOfFrames = numberOfFrames,
    ).collect { result ->
        frames[result.frameIndex] = result
    }

    return withContext(Dispatchers.Default) {
        frames.values.map(::videoThumbnailToBitmap)
    }
}

suspend fun capturePreviewFrame(
    engine: Engine,
    page: DesignBlock,
    time: Double,
): Bitmap {
    // A one-frame request over a zero-length range samples exactly `time`.
    val result = engine.block.generateVideoThumbnailSequence(
        block = page,
        thumbnailHeight = MAX_THUMBNAIL_RENDER_SIZE,
        timeBegin = time,
        timeEnd = time,
        numberOfFrames = 1,
    ).first()

    return withContext(Dispatchers.Default) {
        videoThumbnailToBitmap(result)
    }
}

suspend fun generateWaveform(
    engine: Engine,
    block: DesignBlock,
    duration: Double,
    numberOfSamples: Int = 240,
    samplesPerChunk: Int = 60,
    numberOfChannels: Int = 2,
): Waveform {
    val chunks = sortedMapOf<Int, List<Float>>()

    engine.block.generateAudioThumbnailSequence(
        block = block,
        samplesPerChunk = samplesPerChunk,
        timeBegin = 0.0,
        timeEnd = duration,
        numberOfSamples = numberOfSamples,
        numberOfChannels = numberOfChannels,
    ).collect { chunk ->
        // `samples` is a List<Float>, not a FloatArray, and every value already sits in 0..1.
        chunks[chunk.chunkIndex] = chunk.samples
    }

    val left = ArrayList<Float>(numberOfSamples)
    val right = ArrayList<Float>(numberOfSamples)
    chunks.values.forEach { samples ->
        // Stereo chunks interleave left-then-right, and the last chunk may be short.
        samples.chunked(numberOfChannels).forEach { frame ->
            left += frame.first()
            right += frame.last()
        }
    }

    return Waveform(left = left, right = right, chunkCount = chunks.size)
}

suspend fun cancelFilmstripEarly(
    engine: Engine,
    videoFill: DesignBlock,
    sourceDuration: Double,
): Int = coroutineScope {
    var received = 0

    // In an app this is viewModelScope or lifecycleScope — both dispatch on the main thread,
    // which is where the Flow requires you to collect.
    val job = launch {
        engine.block.generateVideoThumbnailSequence(
            block = videoFill,
            thumbnailHeight = thumbnailHeightPx(dp = 48F),
            timeBegin = 0.0,
            timeEnd = sourceDuration,
            numberOfFrames = 120,
        ).collect { received += 1 }
    }

    delay(timeMillis = 250)

    // There is no cancel method on the API. Cancelling the collecting Job closes the Flow,
    // which cancels the native request. Do this before requesting a new sequence for the
    // same block, otherwise the new request waits for the old one to finish.
    job.cancelAndJoin()

    received
}
```

Build timeline scrubbers, filmstrips, page storyboards, and waveform lanes from a Kotlin `Flow` that emits each preview as soon as the engine renders it.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260901/engine-guides-thumbnail-previews)

<EngineReferenceNote {...props} />

CE.SDK exposes two preview APIs on `engine.block`. `generateVideoThumbnailSequence` returns image frames sampled across a time range, and `generateAudioThumbnailSequence` returns a waveform as chunks of float samples. Both return a cold `Flow` that emits as results become ready, so you can paint a scrubber while the rest of it still renders.

Both are built for previews, so they render at most 512 px per side. Ask for more and you still get the size you asked for, but the extra pixels are stretched, not sharper.

For full-resolution still images, see [Create Thumbnail](./create-thumbnail.md).

## Size Requests in Pixels

`thumbnailHeight` is measured in pixels, not dp. Convert your layout height with the display density before passing it in, otherwise thumbnails come out soft on high-density screens. The width is derived from the aspect ratio and reported back on each result.

```kotlin highlight=highlight-android-density
// thumbnailHeight is measured in pixels, not dp, so convert your layout height first.
// Clamping to the engine's render cap keeps the request at a size that adds real detail.
fun thumbnailHeightPx(dp: Float): Int {
    val density = Resources.getSystem().displayMetrics.density
    return (dp * density).roundToInt().coerceIn(1, MAX_THUMBNAIL_RENDER_SIZE)
}
```

Clamping to 512 is optional but worth doing: above that, the engine renders at 512 and upscales, so the extra pixels only cost memory.

## Generate a Video Filmstrip

The runnable example starts with a video fill and an audio block already attached to a page. Loading them up front is optional because both preview APIs wait for their media, but doing so keeps the first request from waiting on the download.

```kotlin highlight=highlight-android-media
    // Both APIs wait for the resource on their own, but loading it up front avoids a first
    // request that returns before the media is decodable.
    engine.block.forceLoadAVResource(videoFill)
    engine.block.forceLoadAVResource(audioClip)

    // Video fills are sampled in media time, so measure the source, not the clip.
    val sourceDuration = engine.block.getAVResourceTotalDuration(videoFill)
```

`getAVResourceTotalDuration` measures the video source because a video fill is sampled in **media time**, not page time. Pass that duration with the video fill, the thumbnail height, and the number of frames you want. Collect the `Flow` and key each result by its reported `frameIndex` — frames are not guaranteed to arrive in order.

```kotlin highlight=highlight-android-filmstrip
suspend fun generateFilmstrip(
    engine: Engine,
    videoFill: DesignBlock,
    sourceDuration: Double,
    numberOfFrames: Int = 8,
): List<Bitmap> {
    // Frames are not guaranteed to arrive in index order, so key them by the reported index.
    val frames = sortedMapOf<Int, VideoThumbnailResult>()

    engine.block.generateVideoThumbnailSequence(
        block = videoFill,
        thumbnailHeight = thumbnailHeightPx(dp = 48F),
        timeBegin = 0.0,
        timeEnd = sourceDuration,
        numberOfFrames = numberOfFrames,
    ).collect { result ->
        frames[result.frameIndex] = result
    }

    // Collection has to happen on the main thread, and the collector must not suspend:
    // the callback channel is bounded, so a slow collector drops frames. Decode after.
    return withContext(Dispatchers.Default) {
        frames.values.map(::videoThumbnailToBitmap)
    }
}
```

Two threading rules make this code the shape it is:

- **Collect on the main thread.** The `Flow` calls `require(Looper.myLooper() === looper)` when collection starts, so collecting from `Dispatchers.IO` throws `IllegalArgumentException: Should be invoked on the main thread.` Use `viewModelScope` or `lifecycleScope`.
- **Do not suspend inside the collector.** The engine delivers frames through a bounded channel. If the collector is suspended when that buffer fills, frames are dropped, and because the stream ends after exactly `numberOfFrames` emissions, a dropped frame means it never ends at all. Gather the results first, then move the pixel work off the main thread.

The `Flow` is cold, so every `collect` starts a new native request, and it completes on its own once `numberOfFrames` results have arrived. Engine failures surface as a thrown `EngineException` from the collector, not as a value in the stream.

### Choosing the block: video fill vs. design block

The same method behaves differently depending on what you pass, and this is the single most important thing to get right:

| | Video fill | Page or design block |
| --- | --- | --- |
| Source | Real decoded frames from the media file | The composed scene, re-rendered |
| Frame times | Evenly spaced, including the first and last moment of the range | Spread across the range, but never exactly the first or last moment |
| Time base | Media time in the source file — trim, time offset, speed, and looping are ignored | Relative to the block's own time offset on the page timeline |
| Speed | Slower, because each frame is decoded on its own | Faster, because several frames render together |

A design block must be a page or a descendant of a page. A detached block or the scene block fails with `MEDIA.BLOCK_NOT_PAGE_OR_CHILD`. Fills other than video, along with shapes, effects, and animations, fail with `MEDIA.OPERATION_UNSUPPORTED_FOR_BLOCK`.

### Convert frames to Bitmaps

`VideoThumbnailResult` carries `width`, `height`, and `imageData`, a fresh direct `ByteBuffer` of 8-bit RGBA per emission. It is safe to retain, but its position is stateful.

```kotlin highlight=highlight-android-bitmap
fun videoThumbnailToBitmap(result: VideoThumbnailResult): Bitmap {
    val bitmap = Bitmap.createBitmap(result.width, result.height, Bitmap.Config.ARGB_8888)
    bitmap.copyPixelsFromBuffer(result.imageData)

    // copyPixelsFromBuffer leaves the buffer position at its limit. Rewind it, or converting
    // the same result again throws "Buffer not large enough for pixels".
    result.imageData.rewind()

    return bitmap
}
```

`copyPixelsFromBuffer` reads the buffer to its limit and leaves the position there. Without the `rewind()`, converting the same result a second time throws `"Buffer not large enough for pixels"`. No channel swizzling is needed — `Bitmap.Config.ARGB_8888` matches the layout the engine hands you.

## Storyboard a Page

Passing a page renders the composed scene at several points along its timeline, which is what you want for a page storyboard or a chapter strip.

```kotlin highlight=highlight-android-storyboard
suspend fun generateStoryboard(
    engine: Engine,
    page: DesignBlock,
    numberOfFrames: Int = 6,
): List<Bitmap> {
    val frames = sortedMapOf<Int, VideoThumbnailResult>()

    engine.block.generateVideoThumbnailSequence(
        block = page,
        thumbnailHeight = thumbnailHeightPx(dp = 96F),
        timeBegin = 0.0,
        timeEnd = engine.block.getDuration(page),
        numberOfFrames = numberOfFrames,
    ).collect { result ->
        frames[result.frameIndex] = result
    }

    return withContext(Dispatchers.Default) {
        frames.values.map(::videoThumbnailToBitmap)
    }
}
```

Two things change here. Blocks render without their animations, so you see them in their resting state. And video inside the composition comes from a small set of cached frames rather than a fresh decode, so a page storyboard shows video content only approximately. When you need accurate frames from a clip, ask its video fill instead.

## Capture a Single Preview Frame

For a poster frame, ask for one frame and give the same value for the start and the end of the range. That gives you exactly the moment you asked for.

```kotlin highlight=highlight-android-single-frame
suspend fun capturePreviewFrame(
    engine: Engine,
    page: DesignBlock,
    time: Double,
): Bitmap {
    // A one-frame request over a zero-length range samples exactly `time`.
    val result = engine.block.generateVideoThumbnailSequence(
        block = page,
        thumbnailHeight = MAX_THUMBNAIL_RENDER_SIZE,
        timeBegin = time,
        timeEnd = time,
        numberOfFrames = 1,
    ).first()

    return withContext(Dispatchers.Default) {
        videoThumbnailToBitmap(result)
    }
}
```

`Flow.first()` collects the single emission and closes the stream.

## Draw an Audio Waveform

`generateAudioThumbnailSequence` accepts an audio block or a video fill. A page or a graphic is rejected. `numberOfSamples` is counted **per channel**, and each chunk carries `samplesPerChunk * numberOfChannels` floats, interleaved left-then-right for stereo.

```kotlin highlight=highlight-android-waveform
suspend fun generateWaveform(
    engine: Engine,
    block: DesignBlock,
    duration: Double,
    numberOfSamples: Int = 240,
    samplesPerChunk: Int = 60,
    numberOfChannels: Int = 2,
): Waveform {
    val chunks = sortedMapOf<Int, List<Float>>()

    engine.block.generateAudioThumbnailSequence(
        block = block,
        samplesPerChunk = samplesPerChunk,
        timeBegin = 0.0,
        timeEnd = duration,
        numberOfSamples = numberOfSamples,
        numberOfChannels = numberOfChannels,
    ).collect { chunk ->
        // `samples` is a List<Float>, not a FloatArray, and every value already sits in 0..1.
        chunks[chunk.chunkIndex] = chunk.samples
    }

    val left = ArrayList<Float>(numberOfSamples)
    val right = ArrayList<Float>(numberOfSamples)
    chunks.values.forEach { samples ->
        // Stereo chunks interleave left-then-right, and the last chunk may be short.
        samples.chunked(numberOfChannels).forEach { frame ->
            left += frame.first()
            right += frame.last()
        }
    }

    return Waveform(left = left, right = right, chunkCount = chunks.size)
}
```

`samples` is a `List<Float>`, not a `FloatArray`. You receive `numberOfSamples / samplesPerChunk` emissions, rounded up, and the last one can be shorter than the rest — so do not assume a fixed size when you split the channels.

### What the numbers mean

The engine analyzes the audio for you. Every value is a loudness between `0.0` and `1.0`, never negative, and already smoothed — so these are numbers you can draw straight away, not raw audio data.

That keeps the drawing code simple: mirror each value around a horizontal center line to get a bar height. You do not need to find peaks or rescale anything. Very quiet audio reads as `0.0`, and a range past the end of the media returns zeros instead of an error.

A WAV file produces its waveform almost immediately. A long MP3 or AAC file arrives over several moments.

## Cancel Generation

There is no cancel method on the Android API. You cancel by cancelling the coroutine that is collecting, which closes the `Flow` and cancels the underlying native request.

```kotlin highlight=highlight-android-cancel
suspend fun cancelFilmstripEarly(
    engine: Engine,
    videoFill: DesignBlock,
    sourceDuration: Double,
): Int = coroutineScope {
    var received = 0

    // In an app this is viewModelScope or lifecycleScope — both dispatch on the main thread,
    // which is where the Flow requires you to collect.
    val job = launch {
        engine.block.generateVideoThumbnailSequence(
            block = videoFill,
            thumbnailHeight = thumbnailHeightPx(dp = 48F),
            timeBegin = 0.0,
            timeEnd = sourceDuration,
            numberOfFrames = 120,
        ).collect { received += 1 }
    }

    delay(timeMillis = 250)

    // There is no cancel method on the API. Cancelling the collecting Job closes the Flow,
    // which cancels the native request. Do this before requesting a new sequence for the
    // same block, otherwise the new request waits for the old one to finish.
    job.cancelAndJoin()

    received
}
```

In a timeline UI this is the same pattern production uses: keep the collecting `Job` in a field, and `job?.cancel()` before starting the next request for that clip.

Always cancel before you request the same block again. A block handles one request at a time, and a second request waits instead of failing. Requests for different blocks also run one after another, so several strips started at once wait for each other.

A cancel takes effect a moment later, so one or two frames can still arrive. Nothing arrives to tell you the cancel happened — the frames simply stop. Cancelling twice, cancelling after the request finished, or cancelling a failed request are all safe.

How much a cancel actually stops depends on which sequence you started:

| Sequence | Cancel before the first result | Cancel mid-flight |
| --- | --- | --- |
| Video fill | Stops it — nothing is emitted | **No effect.** The remaining frames are still emitted |
| Page or design block | Stops it | Stops it |
| Audio waveform | Stops it | Stops it |

Plan around the first row. Once the engine starts decoding a video fill, a cancel no longer reaches it. Cancelling the `Job` does stop your collector from seeing those frames, so your UI stays correct — but the engine keeps working, and that work delays your next request. Keep video fill strips short, eight frames rather than a hundred, so an abandoned request finishes quickly.

## Performance and Limits

| Limit | Detail |
| --- | --- |
| Size | At most 512 px per side; larger requests are stretched, not sharper |
| Per block | One request at a time; a second request waits instead of failing |
| Order | Requests run one after another, so several strips started at once wait for each other |
| Speed | Video fills are slower than pages, because each frame is decoded on its own |
| Playback | Previews keep arriving while the page is playing |

Keep strips short and heights small. A scrubber only needs enough frames to fill its width, and asking for more makes it slower.

## Troubleshooting

| Symptom | Likely cause | Solution |
| --- | --- | --- |
| `IllegalArgumentException: Should be invoked on the main thread.` | The `Flow` is collected from a background dispatcher | Collect in `viewModelScope` or `lifecycleScope`; move only the `Bitmap` decode off the main thread |
| `"Buffer not large enough for pixels"` | `imageData` was read twice without rewinding | Call `imageData.rewind()` after `copyPixelsFromBuffer` |
| Frames appear out of order | Emissions are not ordered by index | Key results by `frameIndex` instead of appending in arrival order |
| A new request seems to hang | An earlier request for the same block is still running | Cancel the previous collecting `Job` before requesting again |
| The `Flow` never completes | The collector paused and missed frames | Do not suspend inside the collector; do the `Bitmap` work after collecting |
| `MEDIA.OPERATION_UNSUPPORTED_FOR_BLOCK` | The block is not a video fill or a design block, for example an image fill, a shape, or an effect | Pass a video fill, an audio block, a page, or a block on a page |
| `MEDIA.BLOCK_NOT_PAGE_OR_CHILD` | The block is not on a page yet, or you passed the scene | Pass a page or a block that sits on one |
| Waveform is flat | The range is past the end of the audio, or the audio is very quiet | Clamp the range to `getAVResourceTotalDuration` and check the source level |
| Thumbnails look soft | You asked for more than 512 px | Request a `thumbnailHeight` of 512 or less |

## API Reference

| Method | Description |
| --- | --- |
| `generateVideoThumbnailSequence(block: DesignBlock, thumbnailHeight: Int, timeBegin: Double, timeEnd: Double, numberOfFrames: Int): Flow<VideoThumbnailResult>` | Stream image frames across a time range from a video fill or a design block. |
| `generateAudioThumbnailSequence(block: DesignBlock, samplesPerChunk: Int, timeBegin: Double, timeEnd: Double, numberOfSamples: Int, numberOfChannels: Int): Flow<AudioThumbnailResult>` | Stream waveform chunks from an audio block or a video fill. `numberOfChannels` must be 1 or 2. |
| `VideoThumbnailResult(frameIndex: Int, width: Int, height: Int, imageData: ByteBuffer)` | One rendered frame. `imageData` is a direct buffer of 8-bit RGBA. |
| `AudioThumbnailResult(chunkIndex: Int, samples: List<Float>)` | One chunk of the waveform, interleaved by channel, each value in `0.0..1.0`. |
| `engine.block.forceLoadAVResource(block: DesignBlock)` | Load the audio-video resource before requesting previews. |
| `engine.block.getAVResourceTotalDuration(block: DesignBlock): Double` | Read the source media duration for a video fill or audio block. |
| `engine.block.getDuration(block: DesignBlock): Double` | Read a page or block's duration for the storyboard time range. |

## Next Steps

- For static preview images produced by the export API, see [Create Thumbnail](./create-thumbnail.md).
- To build the timeline these previews feed, see [Timeline Editor](../create-video/timeline-editor.md).
- For more on trimming and positioning the clips you preview, see [Video Fills](../fills/video.md).



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support