> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Join and Arrange](./join-and-arrange.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-join-and-arrange-video/JoinAndArrangeVideo.kt reference-only
import android.net.Uri
import kotlinx.coroutines.withContext
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

data class TrackClipState(
    val name: String,
    val timeOffset: Double,
    val duration: Double,
)

data class JoinAndArrangeVideoResult(
    val initialTrackClips: List<TrackClipState>,
    val reorderedTrackClips: List<TrackClipState>,
    val pageDuration: Double,
    val mainTrackDuration: Double,
    val overlayTrackOffset: Double,
    val overlayTrackDuration: Double,
    val overlayClipCount: Int,
)

suspend fun joinAndArrangeVideoClips(engine: Engine): JoinAndArrangeVideoResult = withContext(engine.dispatcher) {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1920F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.setDuration(page, duration = 15.0)

    val videoUri = Uri.parse(
        "https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/" +
            "pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    )

    val clipA = createVideoClip(
        engine = engine,
        name = "Clip A",
        videoUri = videoUri,
        width = 1920F,
        height = 1080F,
    )
    val clipB = createVideoClip(
        engine = engine,
        name = "Clip B",
        videoUri = videoUri,
        width = 1920F,
        height = 1080F,
    )
    val clipC = createVideoClip(
        engine = engine,
        name = "Clip C",
        videoUri = videoUri,
        width = 1920F,
        height = 1080F,
    )

    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)
    engine.block.setBoolean(
        block = track,
        property = "track/automaticallyManageBlockOffsets",
        value = false,
    )

    engine.block.appendChild(parent = track, child = clipA)
    engine.block.appendChild(parent = track, child = clipB)
    engine.block.appendChild(parent = track, child = clipC)

    engine.block.fillParent(track)
    val initialTrackChildren = engine.block.getChildren(track)
    check(initialTrackChildren == listOf(clipA, clipB, clipC))

    engine.block.setDuration(clipA, duration = 5.0)
    engine.block.setDuration(clipB, duration = 5.0)
    engine.block.setDuration(clipC, duration = 5.0)
    engine.block.setDuration(track, duration = 15.0)

    engine.block.setTimeOffset(clipA, offset = 0.0)
    engine.block.setTimeOffset(clipB, offset = 5.0)
    engine.block.setTimeOffset(clipC, offset = 10.0)
    val initialTrackDuration = engine.block.getDuration(track)
    check(initialTrackDuration == 15.0)

    val initialClipStates = engine.block.getChildren(track).map { clip ->
        TrackClipState(
            name = engine.block.getName(clip),
            timeOffset = engine.block.getTimeOffset(clip),
            duration = engine.block.getDuration(clip),
        )
    }

    engine.block.insertChild(parent = track, child = clipC, index = 0)
    engine.block.setTimeOffset(clipC, offset = 0.0)
    engine.block.setTimeOffset(clipA, offset = 5.0)
    engine.block.setTimeOffset(clipB, offset = 10.0)
    val reorderedTrackDuration = engine.block.getDuration(track)
    check(reorderedTrackDuration == 15.0)

    val reorderedClipStates = engine.block.getChildren(track).map { clip ->
        TrackClipState(
            name = engine.block.getName(clip),
            timeOffset = engine.block.getTimeOffset(clip),
            duration = engine.block.getDuration(clip),
        )
    }

    val finalClipOrder = engine.block.getChildren(track).map { clip ->
        engine.block.getName(clip)
    }
    val finalClipOffsets = engine.block.getChildren(track).map { clip ->
        engine.block.getTimeOffset(clip)
    }
    check(finalClipOrder == listOf("Clip C", "Clip A", "Clip B"))
    check(finalClipOffsets == listOf(0.0, 5.0, 10.0))

    val overlayTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = overlayTrack)
    engine.block.setTimeOffset(overlayTrack, offset = 2.0)

    val overlayClip = createVideoClip(
        engine = engine,
        name = "Overlay Clip",
        videoUri = videoUri,
        width = 1920F / 4F,
        height = 1080F / 4F,
    )
    engine.block.setDuration(overlayClip, duration = 5.0)
    engine.block.appendChild(parent = overlayTrack, child = overlayClip)
    engine.block.setPositionX(overlayClip, value = 1920F - 1920F / 4F - 40F)
    engine.block.setPositionY(overlayClip, value = 1080F - 1080F / 4F - 40F)

    JoinAndArrangeVideoResult(
        initialTrackClips = initialClipStates,
        reorderedTrackClips = reorderedClipStates,
        pageDuration = engine.block.getDuration(page),
        mainTrackDuration = reorderedTrackDuration,
        overlayTrackOffset = engine.block.getTimeOffset(overlayTrack),
        overlayTrackDuration = engine.block.getDuration(overlayTrack),
        overlayClipCount = engine.block.getChildren(overlayTrack).size,
    )
}

private suspend fun createVideoClip(
    engine: Engine,
    name: String,
    videoUri: Uri,
    width: Float,
    height: Float,
): DesignBlock {
    val clip = engine.block.create(DesignBlockType.Graphic)
    var videoFill: DesignBlock? = null

    try {
        engine.block.setName(clip, name)
        engine.block.setShape(clip, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setWidth(clip, value = width)
        engine.block.setHeight(clip, value = height)

        val fill = engine.block.createFill(FillType.Video)
        videoFill = fill
        // The Android binding has no typed property helper for video fill URIs yet.
        engine.block.setUri(block = fill, property = "fill/video/fileURI", value = videoUri)
        engine.block.setFill(block = clip, fill = fill)
        engine.block.setContentFillMode(block = clip, mode = ContentFillMode.COVER)
        engine.block.forceLoadAVResource(block = fill)

        return clip
    } catch (error: Throwable) {
        runCatching {
            if (engine.block.isValid(clip)) engine.block.destroy(clip)
        }
        videoFill?.let { fill ->
            runCatching {
                if (engine.block.isValid(fill)) engine.block.destroy(fill)
            }
        }
        throw error
    }
}
```

Combine multiple video clips into a sequence and organize them in the
composition using CE.SDK tracks, durations, and time offsets on Android.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/engine-guides-join-and-arrange-video)

<EngineReferenceNote {...props} />

Video compositions in CE.SDK use a **Scene > Page > Track > Clip** hierarchy.
Tracks group clips for timed playback. This guide sets clip durations and time
offsets explicitly so the sequence is deterministic and mirrors the Node.js
guide flow.

This guide covers the built-in timeline behavior at a high level, then uses the
CreativeEngine API to build a three-clip montage, reorder it, and add an overlay
track for a picture-in-picture composition.

## Joining Clips via UI

CE.SDK's Android video editor includes timeline controls for arranging clips.
Start from the [Video Editor starter kit](../starterkits/video-editor.md) when you need
an interactive timeline UI. Use the Engine API sections below when you need to
prepare scenes programmatically.

### Adding Clips to Timeline

Users add clips from the asset library to the timeline. Adding a clip to an
existing track joins it to that sequence; adding it to an empty area creates a
separate track.

The timeline displays clip duration visually, so longer clips take more
horizontal space and the sequence is easy to scan.

### Reordering Clips

Users can drag clips within a track to reorder them. The timeline updates the
sequence and its time offsets so clips remain packed without gaps.

### Creating Additional Tracks

Additional tracks create layered compositions. Tracks later in the page's child
order render on top, which enables overlays, titles, and picture-in-picture
layouts.

## Programmatic Clip Joining

### Creating the Scene

Create a video scene, add a page, set a 16:9 frame, and make the page long
enough for three 5-second clips.

```kotlin highlight-android-create-scene
val scene = engine.scene.createForVideo()
val page = engine.block.create(DesignBlockType.Page)
engine.block.appendChild(parent = scene, child = page)
engine.block.setWidth(page, value = 1920F)
engine.block.setHeight(page, value = 1080F)
engine.block.setDuration(page, duration = 15.0)
```

### Creating Video Clips

Create each video clip by building the block structure directly: a graphic
block, a rectangle shape, and a video fill. The helper loads the video resource
before returning the clip.

```kotlin highlight-android-create-video-helper
private suspend fun createVideoClip(
    engine: Engine,
    name: String,
    videoUri: Uri,
    width: Float,
    height: Float,
): DesignBlock {
    val clip = engine.block.create(DesignBlockType.Graphic)
    var videoFill: DesignBlock? = null

    try {
        engine.block.setName(clip, name)
        engine.block.setShape(clip, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setWidth(clip, value = width)
        engine.block.setHeight(clip, value = height)

        val fill = engine.block.createFill(FillType.Video)
        videoFill = fill
        // The Android binding has no typed property helper for video fill URIs yet.
        engine.block.setUri(block = fill, property = "fill/video/fileURI", value = videoUri)
        engine.block.setFill(block = clip, fill = fill)
        engine.block.setContentFillMode(block = clip, mode = ContentFillMode.COVER)
        engine.block.forceLoadAVResource(block = fill)

        return clip
    } catch (error: Throwable) {
        runCatching {
            if (engine.block.isValid(clip)) engine.block.destroy(clip)
        }
        videoFill?.let { fill ->
            runCatching {
                if (engine.block.isValid(fill)) engine.block.destroy(fill)
            }
        }
        throw error
    }
}
```

Then create the three clips with the same 1920 x 1080 size used by the montage.
The next section assigns their playback duration.

```kotlin highlight-android-create-clips
val clipA = createVideoClip(
    engine = engine,
    name = "Clip A",
    videoUri = videoUri,
    width = 1920F,
    height = 1080F,
)
val clipB = createVideoClip(
    engine = engine,
    name = "Clip B",
    videoUri = videoUri,
    width = 1920F,
    height = 1080F,
)
val clipC = createVideoClip(
    engine = engine,
    name = "Clip C",
    videoUri = videoUri,
    width = 1920F,
    height = 1080F,
)
```

### Creating Tracks

Create a track, attach it to the page, and disable automatic offset management
because this sample writes the clip offsets directly.

```kotlin highlight-android-create-track
val track = engine.block.create(DesignBlockType.Track)
engine.block.appendChild(parent = page, child = track)
engine.block.setBoolean(
    block = track,
    property = "track/automaticallyManageBlockOffsets",
    value = false,
)
```

### Adding Clips to Track

Append the clips to the track so they share a timeline container. Calling
`fillParent()` on the track after appending the clips fills the child clips
against the page frame first, then resizes and positions the track itself.

```kotlin highlight-android-add-clips-to-track
    engine.block.appendChild(parent = track, child = clipA)
    engine.block.appendChild(parent = track, child = clipB)
    engine.block.appendChild(parent = track, child = clipC)

    engine.block.fillParent(track)
    val initialTrackChildren = engine.block.getChildren(track)
    check(initialTrackChildren == listOf(clipA, clipB, clipC))
```

After appending, `getChildren()` verifies that the clips are attached. The next
section sets their playback offsets.

### Setting Clip Durations

Set each clip duration in seconds. The track duration covers the full 15-second
sequence.

```kotlin highlight-android-set-clip-durations
engine.block.setDuration(clipA, duration = 5.0)
engine.block.setDuration(clipB, duration = 5.0)
engine.block.setDuration(clipC, duration = 5.0)
engine.block.setDuration(track, duration = 15.0)
```

## Arranging Clips

### Time Offsets

Time offsets control when each block becomes active relative to its parent. In a
manual sequence, set each child clip's offset from the cumulative duration of
the preceding clips.

```kotlin highlight-android-time-offsets
    engine.block.setTimeOffset(clipA, offset = 0.0)
    engine.block.setTimeOffset(clipB, offset = 5.0)
    engine.block.setTimeOffset(clipC, offset = 10.0)
    val initialTrackDuration = engine.block.getDuration(track)
    check(initialTrackDuration == 15.0)

    val initialClipStates = engine.block.getChildren(track).map { clip ->
        TrackClipState(
            name = engine.block.getName(clip),
            timeOffset = engine.block.getTimeOffset(clip),
            duration = engine.block.getDuration(clip),
        )
    }
```

Clip A starts at 0 seconds, Clip B at 5 seconds, and Clip C at 10 seconds. With
5-second durations, this creates a continuous 15-second sequence.

### Reordering Clips

Use `insertChild()` to move an existing clip to a specific index. The track
child order changes immediately. Update the time offsets after the move so
playback follows the new order without gaps.

```kotlin highlight-android-reorder-clips
    engine.block.insertChild(parent = track, child = clipC, index = 0)
    engine.block.setTimeOffset(clipC, offset = 0.0)
    engine.block.setTimeOffset(clipA, offset = 5.0)
    engine.block.setTimeOffset(clipB, offset = 10.0)
    val reorderedTrackDuration = engine.block.getDuration(track)
    check(reorderedTrackDuration == 15.0)

    val reorderedClipStates = engine.block.getChildren(track).map { clip ->
        TrackClipState(
            name = engine.block.getName(clip),
            timeOffset = engine.block.getTimeOffset(clip),
            duration = engine.block.getDuration(clip),
        )
    }
```

Moving Clip C to index 0 changes the order from A-B-C to C-A-B. The resulting
offsets are C at 0 seconds, A at 5 seconds, and B at 10 seconds.

### Querying Track Children

Use `getChildren()` to inspect track hierarchy and rendering order while
debugging a custom timeline. Pair that readback with `getTimeOffset()` to
persist the playback sequence.

```kotlin highlight-android-query-track-children
val finalClipOrder = engine.block.getChildren(track).map { clip ->
    engine.block.getName(clip)
}
val finalClipOffsets = engine.block.getChildren(track).map { clip ->
    engine.block.getTimeOffset(clip)
}
check(finalClipOrder == listOf("Clip C", "Clip A", "Clip B"))
check(finalClipOffsets == listOf(0.0, 5.0, 10.0))
```

## Multi-Track Compositions

### Adding Multiple Tracks

Create layered compositions by adding more tracks to the page. This sample adds
an overlay track that starts at 2 seconds and contains a smaller clip in the
bottom-right corner.

```kotlin highlight-android-multi-track
    val overlayTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = overlayTrack)
    engine.block.setTimeOffset(overlayTrack, offset = 2.0)

    val overlayClip = createVideoClip(
        engine = engine,
        name = "Overlay Clip",
        videoUri = videoUri,
        width = 1920F / 4F,
        height = 1080F / 4F,
    )
    engine.block.setDuration(overlayClip, duration = 5.0)
    engine.block.appendChild(parent = overlayTrack, child = overlayClip)
    engine.block.setPositionX(overlayClip, value = 1920F - 1920F / 4F - 40F)
    engine.block.setPositionY(overlayClip, value = 1080F - 1080F / 4F - 40F)
```

### Track Rendering Order

CE.SDK renders page children in order. The first track appears behind later
tracks, so add background video first and overlays or titles later.

- **Background layers**: Full-frame clips on the first track.
- **Overlays**: Smaller clips positioned on later tracks.
- **Titles**: Text or graphics added above the video tracks.

## Troubleshooting

### Clips Not Appearing

Verify that every clip is attached to a track and that the track is attached to
the page. `engine.block.getParent()` and `engine.block.getChildren()` are the
quickest checks for hierarchy issues.

### Wrong Playback Order

Check the track child order first. Default Android tracks automatically pack
child offsets from that order and each clip's duration. When you manage timing
manually, disable `track/automaticallyManageBlockOffsets` and write the offsets
with `setTimeOffset()`. CE.SDK still prevents overlaps inside a single track;
use separate tracks for overlapping or layered clips.

### Video Not Loading

Check that the video URL is reachable and uses a supported format. For Android
samples that use explicit video fills, call `engine.block.forceLoadAVResource()`
on the video fill before you depend on media metadata.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.createForVideo()` | Create a scene configured for video playback. |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create the page that holds the video composition. |
| `engine.block.create(blockType=DesignBlockType.Track)` | Create a track for sequential or layered clips. |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create the graphic block used as a video clip. |
| `engine.block.createFill(fillType=FillType.Video)` | Create the video fill attached to a clip block. |
| `engine.block.appendChild(parent=_, child=_)` | Add a clip to a track or a track to a page hierarchy. |
| `engine.block.insertChild(parent=_, child=_, index=_)` | Move or insert a child at a specific rendering-order index. |
| `engine.block.getChildren(block=_)` | Read child blocks in rendering order. |
| `engine.block.setDuration(block=_, duration=_)` | Set a page, track, or clip duration in seconds. |
| `engine.block.getDuration(block=_)` | Read a block duration in seconds. |
| `engine.block.setTimeOffset(block=_, offset=_)` | Set when a block starts relative to its parent. |
| `engine.block.getTimeOffset(block=_)` | Read a block's time offset in seconds. |
| `engine.block.setBoolean(block=_, property="track/automaticallyManageBlockOffsets", value=_)` | Switch a track between automatic and manual child offset management. |
| `engine.block.forceLoadAVResource(block=_)` | Load audio or video metadata for a video fill or audio block. |
| `engine.block.fillParent(block=_)` | Resize and position a block to fill its parent frame; when the block is a group or track, child blocks are filled against the enclosing frame first. |

## Next Steps

Now that you can join and arrange clips, continue with related video editing
features:

- [Trim](./trim.md) — Documentation for Trim
- [Control Audio and Video](../create-video/control.md) - Master playback timing and audio mixing
- [Timeline Editor](../create-video/timeline-editor.md) - Understand the complete timeline editing system



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support