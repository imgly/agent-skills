> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Split](./split.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-video-split/SplitVideoAndAudio.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DemoAssetSource
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.ShapeType
import ly.img.engine.SplitOptions
import ly.img.engine.addDemoAssetSources
import kotlin.math.abs

data class SplitTiming(
    val originalTrimOffsetBefore: Double,
    val originalTrimLengthBefore: Double,
    val originalTrimOffsetAfter: Double,
    val originalTrimLengthAfter: Double,
    val newBlockTrimOffset: Double,
    val newBlockTrimLength: Double,
)

data class SplitGuideResult(
    val basicSegmentDurations: List<Double>,
    val audioSegmentDurations: List<Double>,
    val playheadSegmentDurations: List<Double>,
    val multiTrackSegmentDurations: List<Double>,
    val splitTiming: SplitTiming,
    val audioSplitTiming: SplitTiming,
    val remainingSegmentCount: Int,
    val validatedSplitCreated: Boolean,
)

suspend fun splitVideoAndAudio(engine: Engine): SplitGuideResult = withContext(Dispatchers.Main) {
    runSplitGuide(engine)
}

private suspend fun runSplitGuide(engine: Engine): SplitGuideResult {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.setDuration(page, duration = 12.0)

    val basicClip = createVideoClip(engine, page, name = "Basic split", videoUri = VIDEO_URI)
    val basicNewClip = splitAtSpecificTime(engine, basicClip)
    checkClose(engine.block.getDuration(basicClip), 5.0, "basic first segment duration")
    checkClose(engine.block.getDuration(basicNewClip), 5.0, "basic second segment duration")

    val audioUri = loadDemoAudioUri(engine)

    val audioClip = createAudioClip(engine, page, name = "Audio split", audioUri = audioUri)
    val audioNewClip = splitAtSpecificTime(engine, audioClip)
    checkClose(engine.block.getDuration(audioClip), 5.0, "audio first segment duration")
    checkClose(engine.block.getDuration(audioNewClip), 5.0, "audio second segment duration")

    val optionsClip = createVideoClip(engine, page, name = "Options split", videoUri = VIDEO_URI)
    splitWithOptions(engine, optionsClip)

    val playheadClip = createVideoClip(
        engine = engine,
        page = page,
        name = "Playhead split",
        videoUri = VIDEO_URI,
        trackOffset = 1.0,
    )
    engine.block.setPlaybackTime(page, time = 5.0)
    val playheadNewClip = splitAtPlayhead(engine, page, playheadClip)
    checkClose(engine.block.getDuration(playheadClip), 4.0, "playhead first segment duration")
    checkClose(engine.block.getDuration(playheadNewClip), 6.0, "playhead second segment duration")

    val multiTrackPage = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = multiTrackPage)
    engine.block.setWidth(multiTrackPage, value = 1280F)
    engine.block.setHeight(multiTrackPage, value = 720F)
    engine.block.setDuration(multiTrackPage, duration = 12.0)
    val multiTrackClipA = createVideoClip(
        engine = engine,
        page = multiTrackPage,
        name = "Track A",
        videoUri = VIDEO_URI,
        trackOffset = 1.0,
    )
    val multiTrackClipB = createVideoClip(
        engine = engine,
        page = multiTrackPage,
        name = "Track B",
        videoUri = VIDEO_URI,
        trackOffset = 2.0,
    )
    val multiTrackNewSegments = splitClipsAcrossTracks(
        engine = engine,
        page = multiTrackPage,
        timelineTime = 4.0,
    )
    check(multiTrackNewSegments.size == 2)
    val multiTrackSegmentDurations = listOf(
        engine.block.getDuration(multiTrackClipA),
        engine.block.getDuration(multiTrackNewSegments[0]),
        engine.block.getDuration(multiTrackClipB),
        engine.block.getDuration(multiTrackNewSegments[1]),
    )
    multiTrackSegmentDurations.forEachIndexed { index, duration ->
        val expected = listOf(3.0, 7.0, 2.0, 8.0)[index]
        checkClose(duration, expected, "multi-track segment $index duration")
    }

    val resultsClip = createVideoClip(engine, page, name = "Results split", videoUri = VIDEO_URI)
    val splitTiming = readSplitTimingAfterSplit(engine, resultsClip)
    checkClose(splitTiming.originalTrimOffsetAfter, splitTiming.originalTrimOffsetBefore, "original trim offset")
    checkClose(splitTiming.originalTrimLengthAfter, 6.0, "original trim length")
    checkClose(splitTiming.newBlockTrimOffset, splitTiming.originalTrimOffsetBefore + 6.0, "new trim offset")
    checkClose(splitTiming.newBlockTrimLength, 4.0, "new trim length")
    val audioResultsClip = createAudioClip(engine, page, name = "Audio results split", audioUri = audioUri)
    val audioSplitTiming = readSplitTimingAfterSplit(engine, audioResultsClip)
    checkClose(audioSplitTiming.originalTrimLengthAfter, 6.0, "audio original trim length")
    checkClose(audioSplitTiming.newBlockTrimOffset, 6.0, "audio new trim offset")
    checkClose(audioSplitTiming.newBlockTrimLength, 4.0, "audio new trim length")

    val deleteClip = createVideoClip(engine, page, name = "Split and delete", videoUri = VIDEO_URI)
    val keptAfterDeletedRange = splitAndDeleteRange(
        engine = engine,
        clipBlock = deleteClip,
        startTime = 2.0,
        endTime = 5.0,
    )
    check(engine.block.isValid(deleteClip))
    check(engine.block.isValid(keptAfterDeletedRange))
    checkClose(engine.block.getDuration(deleteClip), 2.0, "leading segment duration")
    checkClose(engine.block.getDuration(keptAfterDeletedRange), 5.0, "trailing segment duration")
    val remainingSegmentCount = listOf(deleteClip, keptAfterDeletedRange)
        .count { segment -> engine.block.isValid(segment) }

    val validateClip = createVideoClip(engine, page, name = "Validated split", videoUri = VIDEO_URI)
    val validatedSplit = splitWithValidation(
        engine = engine,
        clipBlock = validateClip,
        desiredSplitTime = 4.0,
    )
    val validatedSplitCreated = validatedSplit?.let { splitBlock ->
        engine.block.isValid(splitBlock)
    } == true
    check(validatedSplitCreated)

    return SplitGuideResult(
        basicSegmentDurations = listOf(
            engine.block.getDuration(basicClip),
            engine.block.getDuration(basicNewClip),
        ),
        audioSegmentDurations = listOf(
            engine.block.getDuration(audioClip),
            engine.block.getDuration(audioNewClip),
        ),
        playheadSegmentDurations = listOf(
            engine.block.getDuration(playheadClip),
            engine.block.getDuration(playheadNewClip),
        ),
        multiTrackSegmentDurations = multiTrackSegmentDurations,
        splitTiming = splitTiming,
        audioSplitTiming = audioSplitTiming,
        remainingSegmentCount = remainingSegmentCount,
        validatedSplitCreated = validatedSplitCreated,
    )
}

fun splitAtSpecificTime(
    engine: Engine,
    clipBlock: DesignBlock,
): DesignBlock {
    val splitTime = 5.0
    return engine.block.split(block = clipBlock, atTime = splitTime)
}

fun splitWithOptions(
    engine: Engine,
    clipBlock: DesignBlock,
): DesignBlock = engine.block.split(
    block = clipBlock,
    atTime = 4.0,
    options = SplitOptions(
        attachToParent = true,
        createParentTrackIfNeeded = true,
        selectNewBlock = false,
    ),
)

fun splitAtPlayhead(
    engine: Engine,
    page: DesignBlock,
    clipBlock: DesignBlock,
): DesignBlock {
    val playheadTime = engine.block.getPlaybackTime(page)
    val clipStartTime = absoluteTimelineOffset(
        engine = engine,
        timelineRoot = page,
        block = clipBlock,
    )
    val splitTime = playheadTime - clipStartTime
    val clipDuration = engine.block.getDuration(clipBlock)

    require(splitTime > 0.0 && splitTime < clipDuration) {
        "Split time must be inside the clip duration."
    }

    return engine.block.split(block = clipBlock, atTime = splitTime)
}

fun absoluteTimelineOffset(
    engine: Engine,
    timelineRoot: DesignBlock,
    block: DesignBlock,
): Double {
    var timelineOffset = 0.0
    var currentBlock: DesignBlock? = block

    while (currentBlock != null && currentBlock != timelineRoot) {
        if (engine.block.supportsTimeOffset(currentBlock)) {
            timelineOffset += engine.block.getTimeOffset(currentBlock)
        }
        currentBlock = engine.block.getParent(currentBlock)
    }

    return timelineOffset
}

fun splitClipsAcrossTracks(
    engine: Engine,
    page: DesignBlock,
    timelineTime: Double,
): List<DesignBlock> {
    val splitBlocks = mutableListOf<DesignBlock>()

    engine.block.getChildren(page)
        .filter { child -> engine.block.getType(child) == DesignBlockType.Track.key }
        .forEach { track ->
            engine.block.getChildren(track).forEach { clip ->
                val clipStartTime = absoluteTimelineOffset(
                    engine = engine,
                    timelineRoot = page,
                    block = clip,
                )
                val clipDuration = engine.block.getDuration(clip)
                val splitTime = timelineTime - clipStartTime

                if (splitTime > 0.0 && splitTime < clipDuration) {
                    splitBlocks += engine.block.split(
                        block = clip,
                        atTime = splitTime,
                        options = SplitOptions(selectNewBlock = false),
                    )
                }
            }
        }

    return splitBlocks
}

private fun trimmableTargetForClip(
    engine: Engine,
    clipBlock: DesignBlock,
): DesignBlock {
    val clipType = engine.block.getType(clipBlock)
    val trimTarget = if (clipType == DesignBlockType.Audio.key) {
        clipBlock
    } else {
        engine.block.getFill(clipBlock)
    }

    require(engine.block.supportsTrim(trimTarget)) {
        "Clip does not expose trim properties."
    }

    return trimTarget
}

fun readSplitTimingAfterSplit(
    engine: Engine,
    clipBlock: DesignBlock,
): SplitTiming {
    val originalTrimTarget = trimmableTargetForClip(engine, clipBlock)
    val originalTrimOffset = engine.block.getTrimOffset(originalTrimTarget)
    val originalTrimLength = engine.block.getTrimLength(originalTrimTarget)

    val newBlock = engine.block.split(block = clipBlock, atTime = 6.0)
    val newBlockTrimTarget = trimmableTargetForClip(engine, newBlock)

    return SplitTiming(
        originalTrimOffsetBefore = originalTrimOffset,
        originalTrimLengthBefore = originalTrimLength,
        originalTrimOffsetAfter = engine.block.getTrimOffset(originalTrimTarget),
        originalTrimLengthAfter = engine.block.getTrimLength(originalTrimTarget),
        newBlockTrimOffset = engine.block.getTrimOffset(newBlockTrimTarget),
        newBlockTrimLength = engine.block.getTrimLength(newBlockTrimTarget),
    )
}

fun splitAndDeleteRange(
    engine: Engine,
    clipBlock: DesignBlock,
    startTime: Double,
    endTime: Double,
): DesignBlock {
    val middleSegment = engine.block.split(
        block = clipBlock,
        atTime = startTime,
        options = SplitOptions(selectNewBlock = false),
    )
    val trailingSegment = engine.block.split(
        block = middleSegment,
        atTime = endTime - startTime,
        options = SplitOptions(selectNewBlock = false),
    )

    engine.block.destroy(middleSegment)
    return trailingSegment
}

fun splitWithValidation(
    engine: Engine,
    clipBlock: DesignBlock,
    desiredSplitTime: Double,
): DesignBlock? {
    val blockDuration = engine.block.getDuration(clipBlock)

    return if (desiredSplitTime > 0.0 && desiredSplitTime < blockDuration) {
        engine.block.split(block = clipBlock, atTime = desiredSplitTime)
    } else {
        null
    }
}

suspend fun createVideoClip(
    engine: Engine,
    page: DesignBlock,
    name: String,
    videoUri: String,
    trackOffset: Double = 0.0,
): DesignBlock {
    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)
    engine.block.fillParent(track)
    engine.block.setTimeOffset(block = track, offset = trackOffset)

    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(videoBlock, name)
    engine.block.setShape(videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(videoBlock, value = 320F)
    engine.block.setHeight(videoBlock, value = 180F)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse(videoUri),
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    engine.block.appendChild(parent = track, child = videoBlock)
    engine.block.forceLoadAVResource(videoFill)
    engine.block.setDuration(videoBlock, duration = 10.0)

    return videoBlock
}

suspend fun createAudioClip(
    engine: Engine,
    page: DesignBlock,
    name: String,
    audioUri: String,
): DesignBlock {
    val audioBlock = engine.block.create(DesignBlockType.Audio)
    engine.block.setName(audioBlock, name)
    engine.block.setUri(
        block = audioBlock,
        property = "audio/fileURI",
        value = Uri.parse(audioUri),
    )
    engine.block.appendChild(parent = page, child = audioBlock)
    engine.block.forceLoadAVResource(audioBlock)
    engine.block.setDuration(audioBlock, duration = 10.0)

    return audioBlock
}

private suspend fun loadDemoAudioUri(engine: Engine): String {
    val audioSourceId = DemoAssetSource.AUDIO.key
    if (audioSourceId !in engine.asset.findAllSources()) {
        engine.addDemoAssetSources(exclude = DemoAssetSource.values().toSet() - DemoAssetSource.AUDIO)
    }

    val audioAsset = engine.asset.fetchAsset(
        sourceId = audioSourceId,
        assetId = "far_from_home",
    ) ?: engine.asset.findAssets(
        sourceId = audioSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    ).assets.first { it.id.endsWith("far_from_home") }

    return requireNotNull(audioAsset.meta?.get("uri")) {
        "The demo audio asset does not provide a URI."
    }
}

private fun checkClose(
    actual: Double,
    expected: Double,
    label: String,
) {
    check(abs(actual - expected) < 0.001) {
        "$label expected $expected but was $actual"
    }
}

private const val VIDEO_URI = "https://img.ly/static/ubq_video_samples/bbb.mp4"
```

Split video and audio clips at specific time points using CE.SDK's timeline UI
and programmatic split API to create independent segments.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260905/engine-guides-create-video-split)

<EngineReferenceNote {...props} />

Clip splitting divides one block into two at a specified time. The original block ends at the split point, and the new block starts there. Both blocks reference the same source media with independent timing. This differs from trimming, which adjusts a single block's playback range without creating new blocks.

This guide covers how to use the built-in timeline UI for visual splitting and how to split clips programmatically using the Engine API.

## Splitting Clips via the UI

When a user selects a video or audio clip on the CE.SDK editor timeline, CE.SDK shows the Split control in the inspector bar. The user positions the playhead at the desired point and applies the split action there to divide the selected clip.

CE.SDK creates two independent timeline segments from the selected clip. If the playhead is outside the clip or too close to either edge, CE.SDK shows an out-of-range or short-duration error and no split is created.

For a complete interactive timeline surface, see the [Video Editor Starter Kit](../starterkits/video-editor.md). This guide keeps the implementation focus on the Engine API used by that UI.

## Programmatic Splitting

For automation, batch editing, or custom controls, use `engine.block.split()` with the block you want to divide. The split time is measured in seconds relative to the clip block.

### Basic Splitting at a Specific Time

Split a video or audio block by providing the block ID and the split time in seconds. The method returns the newly created second segment.

```kotlin highlight-android-basic-split
fun splitAtSpecificTime(
    engine: Engine,
    clipBlock: DesignBlock,
): DesignBlock {
    val splitTime = 5.0
    return engine.block.split(block = clipBlock, atTime = splitTime)
}
```

The original block becomes the first segment before the split point. The returned block is the segment after the split point.

### Configuring Split Options

Use `SplitOptions` to control how CE.SDK attaches and selects the new segment.

- `attachToParent` (default: `true`) keeps the new block under the same parent as the original.
- `createParentTrackIfNeeded` (default: `false`) creates a track structure when the block needs one, but only when `attachToParent` is `true`.
- `selectNewBlock` (default: `true`) controls whether the returned segment becomes selected.

```kotlin highlight-android-split-options
fun splitWithOptions(
    engine: Engine,
    clipBlock: DesignBlock,
): DesignBlock = engine.block.split(
    block = clipBlock,
    atTime = 4.0,
    options = SplitOptions(
        attachToParent = true,
        createParentTrackIfNeeded = true,
        selectNewBlock = false,
    ),
)
```

Set `selectNewBlock` to `false` when you split multiple clips programmatically and do not want each split to change the current selection.

### Splitting at the Current Playhead Position

To split like the built-in inspector bar action, read the page playback time and convert it to a time relative to the clip. Time offsets are relative to each block's parent, so sum the clip and ancestor offsets up to the page before subtracting that start time from the playhead.

```kotlin highlight-android-absolute-timeline-offset
fun absoluteTimelineOffset(
    engine: Engine,
    timelineRoot: DesignBlock,
    block: DesignBlock,
): Double {
    var timelineOffset = 0.0
    var currentBlock: DesignBlock? = block

    while (currentBlock != null && currentBlock != timelineRoot) {
        if (engine.block.supportsTimeOffset(currentBlock)) {
            timelineOffset += engine.block.getTimeOffset(currentBlock)
        }
        currentBlock = engine.block.getParent(currentBlock)
    }

    return timelineOffset
}
```

Use that absolute timeline offset when calculating the split time for the selected clip.

```kotlin highlight-android-split-at-playhead
fun splitAtPlayhead(
    engine: Engine,
    page: DesignBlock,
    clipBlock: DesignBlock,
): DesignBlock {
    val playheadTime = engine.block.getPlaybackTime(page)
    val clipStartTime = absoluteTimelineOffset(
        engine = engine,
        timelineRoot = page,
        block = clipBlock,
    )
    val splitTime = playheadTime - clipStartTime
    val clipDuration = engine.block.getDuration(clipBlock)

    require(splitTime > 0.0 && splitTime < clipDuration) {
        "Split time must be inside the clip duration."
    }

    return engine.block.split(block = clipBlock, atTime = splitTime)
}
```

Validate the calculated time before splitting. The split point must be greater than `0` and lower than the clip duration.

### Splitting Clips Across Multiple Tracks

To split every track at the same timeline position, iterate the page's tracks with `getChildren()`, inspect each clip's time range, and split only clips that contain the target time.

```kotlin highlight-android-split-multiple-tracks
fun splitClipsAcrossTracks(
    engine: Engine,
    page: DesignBlock,
    timelineTime: Double,
): List<DesignBlock> {
    val splitBlocks = mutableListOf<DesignBlock>()

    engine.block.getChildren(page)
        .filter { child -> engine.block.getType(child) == DesignBlockType.Track.key }
        .forEach { track ->
            engine.block.getChildren(track).forEach { clip ->
                val clipStartTime = absoluteTimelineOffset(
                    engine = engine,
                    timelineRoot = page,
                    block = clip,
                )
                val clipDuration = engine.block.getDuration(clip)
                val splitTime = timelineTime - clipStartTime

                if (splitTime > 0.0 && splitTime < clipDuration) {
                    splitBlocks += engine.block.split(
                        block = clip,
                        atTime = splitTime,
                        options = SplitOptions(selectNewBlock = false),
                    )
                }
            }
        }

    return splitBlocks
}
```

This leaves clips that do not span the timeline position unchanged.

## Understanding Split Results

After a split operation, CE.SDK updates the timing of the original and returned blocks.

### Trim Properties After Split

For video graphic blocks, read the trim values on the media fill to inspect how the source media range changed. Audio blocks store trim values on the audio block itself, so call the trim APIs with the audio block ID instead of calling `getFill()`.

```kotlin highlight-android-split-results
private fun trimmableTargetForClip(
    engine: Engine,
    clipBlock: DesignBlock,
): DesignBlock {
    val clipType = engine.block.getType(clipBlock)
    val trimTarget = if (clipType == DesignBlockType.Audio.key) {
        clipBlock
    } else {
        engine.block.getFill(clipBlock)
    }

    require(engine.block.supportsTrim(trimTarget)) {
        "Clip does not expose trim properties."
    }

    return trimTarget
}

fun readSplitTimingAfterSplit(
    engine: Engine,
    clipBlock: DesignBlock,
): SplitTiming {
    val originalTrimTarget = trimmableTargetForClip(engine, clipBlock)
    val originalTrimOffset = engine.block.getTrimOffset(originalTrimTarget)
    val originalTrimLength = engine.block.getTrimLength(originalTrimTarget)

    val newBlock = engine.block.split(block = clipBlock, atTime = 6.0)
    val newBlockTrimTarget = trimmableTargetForClip(engine, newBlock)

    return SplitTiming(
        originalTrimOffsetBefore = originalTrimOffset,
        originalTrimLengthBefore = originalTrimLength,
        originalTrimOffsetAfter = engine.block.getTrimOffset(originalTrimTarget),
        originalTrimLengthAfter = engine.block.getTrimLength(originalTrimTarget),
        newBlockTrimOffset = engine.block.getTrimOffset(newBlockTrimTarget),
        newBlockTrimLength = engine.block.getTrimLength(newBlockTrimTarget),
    )
}
```

The original block keeps its trim offset unchanged, but its trim length is reduced to the split point. The new block advances its trim offset by the split time and uses the remaining trim length. Both blocks continue to reference the same source media, so splitting is non-destructive.

### Timeline Positioning

The original block keeps its `getTimeOffset()`. When `attachToParent` is `true`, the returned block is attached next to the original under the same parent. Use `createParentTrackIfNeeded` when CE.SDK should create a track structure for the split result.

## Split and Delete Workflow

Remove a middle section by splitting at both boundaries and deleting the segment between them.

```kotlin highlight-android-split-and-delete
fun splitAndDeleteRange(
    engine: Engine,
    clipBlock: DesignBlock,
    startTime: Double,
    endTime: Double,
): DesignBlock {
    val middleSegment = engine.block.split(
        block = clipBlock,
        atTime = startTime,
        options = SplitOptions(selectNewBlock = false),
    )
    val trailingSegment = engine.block.split(
        block = middleSegment,
        atTime = endTime - startTime,
        options = SplitOptions(selectNewBlock = false),
    )

    engine.block.destroy(middleSegment)
    return trailingSegment
}
```

This workflow is useful for removing pauses, mistakes, or unwanted sections while keeping the leading and trailing segments.

## Validating Split Time

Always validate that the split time is within the block duration before calling `split()`.

```kotlin highlight-android-validate-split-time
fun splitWithValidation(
    engine: Engine,
    clipBlock: DesignBlock,
    desiredSplitTime: Double,
): DesignBlock? {
    val blockDuration = engine.block.getDuration(clipBlock)

    return if (desiredSplitTime > 0.0 && desiredSplitTime < blockDuration) {
        engine.block.split(block = clipBlock, atTime = desiredSplitTime)
    } else {
        null
    }
}
```

Splitting at the beginning, end, or outside the duration can fail because CE.SDK cannot create two valid segments from that time.

## Troubleshooting

### Split Returns Unexpected Block

The returned block is the second segment after the split point. The original block remains the first segment.

### Split Time Out of Range

Use `getDuration()` and validate that the split time is greater than `0` and lower than the block duration before calling `split()`.

### Clip Not Splitting

Check that the target supports trimming with `supportsTrim()`. For video fills and audio blocks, load the media resource with `forceLoadAVResource()` before reading duration or trim metadata.

## API Reference

| API | Purpose |
| --- | --- |
| `engine.block.split(block=_, atTime=_, options=_)` | Splits a block and returns the new second segment |
| `engine.block.getTimeOffset(block=_)` | Returns the block's timeline offset relative to its parent |
| `engine.block.getDuration(block=_)` | Returns the playback duration in seconds |
| `engine.block.getPlaybackTime(block=_)` | Returns the current playback time for a page or playable block |
| `engine.block.getChildren(block=_)` | Returns a block's direct children, such as tracks under a page |
| `engine.block.getParent(block=_)` | Returns the block's parent or `null` for a root block |
| `engine.block.getType(block=_)` | Returns the block type key, such as a track type |
| `engine.block.supportsTimeOffset(block=_)` | Checks whether a block exposes a timeline offset |
| `engine.block.getFill(block=_)` | Returns the fill block of a graphic block |
| `engine.block.getTrimOffset(block=_)` | Returns the media trim offset in seconds |
| `engine.block.getTrimLength(block=_)` | Returns the active media trim length in seconds |
| `engine.block.supportsTrim(block=_)` | Checks whether the block supports trim properties |
| `engine.block.forceLoadAVResource(block=_)` | Loads audio or video metadata before duration and trim reads |
| `engine.block.destroy(block=_)` | Removes a block from the scene |

## Next Steps

- [Trim Video and Audio](./trim.md) - Control playback range without splitting.
- [Join and Arrange Video Clips](./join-and-arrange.md) - Combine multiple video clips into sequences and organize them on the timeline using tracks and time offsets in CE.SDK.
- [Timeline Editor](../create-video/timeline-editor.md) - Use the timeline editor to arrange and edit video clips, audio, and animations frame by frame.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support