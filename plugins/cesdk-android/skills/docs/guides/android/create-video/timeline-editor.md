> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Timeline Editor](./timeline-editor.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-timeline-editor/TimelineEditor.kt reference-only
import android.net.Uri
import kotlinx.coroutines.flow.toList
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType

data class TimelineEditor(
    val pageDuration: Double,
    val primaryClipDuration: Double,
    val overlayStartTime: Double,
    val videoThumbnailCount: Int,
    val audioWaveformChunkCount: Int,
    val exportedVideoDuration: Double,
    val exportedVideoBytes: Int,
)

suspend fun timelineEditor(engine: Engine): TimelineEditor {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.setDuration(page, duration = 10.0)

    val primaryTrack = engine.block.create(DesignBlockType.Track)
    val overlayTrack = engine.block.create(DesignBlockType.Track)
    val audioTrack = engine.block.create(DesignBlockType.Track)

    engine.block.appendChild(parent = page, child = primaryTrack)
    engine.block.appendChild(parent = page, child = overlayTrack)
    engine.block.appendChild(parent = page, child = audioTrack)

    // No type-safe Android helper exists for this track property yet.
    engine.block.setBoolean(
        block = overlayTrack,
        property = "track/automaticallyManageBlockOffsets",
        value = false,
    )

    val primaryClip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(primaryClip, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(primaryClip, value = 0F)
    engine.block.setPositionY(primaryClip, value = 0F)
    engine.block.setWidth(primaryClip, value = 1280F)
    engine.block.setHeight(primaryClip, value = 720F)

    val primaryFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = primaryFill,
        property = "fill/video/fileURI",
        value = Uri.parse(
            "https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
        ),
    )
    engine.block.setFill(primaryClip, fill = primaryFill)
    engine.block.appendChild(parent = primaryTrack, child = primaryClip)

    val overlayClip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(overlayClip, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(overlayClip, value = 820F)
    engine.block.setPositionY(overlayClip, value = 80F)
    engine.block.setWidth(overlayClip, value = 360F)
    engine.block.setHeight(overlayClip, value = 220F)

    val overlayFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = overlayFill,
        property = "fill/video/fileURI",
        value = Uri.parse(
            "https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-kampus-production-8154913.mp4",
        ),
    )
    engine.block.setFill(overlayClip, fill = overlayFill)
    engine.block.appendChild(parent = overlayTrack, child = overlayClip)

    val audioClip = engine.block.create(DesignBlockType.Audio)
    engine.block.setUri(
        block = audioClip,
        property = "audio/fileURI",
        value = Uri.parse(
            "https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a",
        ),
    )
    engine.block.appendChild(parent = audioTrack, child = audioClip)

    engine.block.forceLoadAVResource(primaryFill)
    engine.block.forceLoadAVResource(overlayFill)
    engine.block.forceLoadAVResource(audioClip)

    engine.block.setDuration(primaryClip, duration = 8.0)
    engine.block.setTrimOffset(primaryFill, offset = 2.0)
    engine.block.setTrimLength(primaryFill, length = 8.0)
    engine.block.setLooping(primaryFill, looping = false)
    engine.block.setMuted(primaryFill, muted = true)

    engine.block.setTimeOffset(overlayClip, offset = 3.0)
    engine.block.setDuration(overlayClip, duration = 4.0)
    engine.block.setTimeOffset(audioClip, offset = 0.0)
    engine.block.setDuration(audioClip, duration = 10.0)

    engine.block.setPlaybackTime(page, time = 3.5)
    check(engine.block.isVisibleAtCurrentPlaybackTime(overlayClip))

    engine.block.setPlaying(page, enabled = true)
    check(engine.block.isPlaying(page))
    engine.block.setPlaying(page, enabled = false)

    val videoThumbnails = engine.block.generateVideoThumbnailSequence(
        block = primaryFill,
        thumbnailHeight = 72,
        timeBegin = 0.0,
        timeEnd = 8.0,
        numberOfFrames = 4,
    ).toList()

    val audioWaveformChunks = engine.block.generateAudioThumbnailSequence(
        block = audioClip,
        samplesPerChunk = 40,
        timeBegin = 0.0,
        timeEnd = 10.0,
        numberOfSamples = 160,
        numberOfChannels = 2,
    ).toList()

    val exportDuration = engine.block.getDuration(page)
    val videoBytes = engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = exportDuration,
        mimeType = MimeType.MP4,
        progressCallback = { progress ->
            println("Encoded ${progress.encodedFrames} of ${progress.totalFrames} frames")
        },
    )

    return TimelineEditor(
        pageDuration = engine.block.getDuration(page),
        primaryClipDuration = engine.block.getDuration(primaryClip),
        overlayStartTime = engine.block.getTimeOffset(overlayClip),
        videoThumbnailCount = videoThumbnails.size,
        audioWaveformChunkCount = audioWaveformChunks.size,
        exportedVideoDuration = exportDuration,
        exportedVideoBytes = videoBytes.remaining(),
    )
}
```

Build Android video timelines with CE.SDK by arranging tracks, clips, trim ranges, playback controls, thumbnails, and MP4 export from Kotlin.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-timeline-editor)

<EngineReferenceNote {...props} />

The Android [Video Editor starter kit](../starterkits/video-editor.md) already renders the built-in `Timeline` component in its bottom panel. Use the Engine APIs in this guide when you need to prepare a video scene programmatically, build a custom timeline surface, or automate timeline edits before opening or exporting the scene.

## Timeline Hierarchy

CE.SDK represents video timelines through the same block hierarchy that the editor UI renders:

```text
Scene
└── Page
    ├── Track
    │   ├── Clip
    │   └── Clip
    ├── Overlay track
    └── Audio track
```

Use a video scene for time-based playback. A page defines the composition duration, tracks group parallel lanes, and each clip controls its own duration, trim range, and time offset.

## Create a Video Scene

Start with `engine.scene.createForVideo()`, then add a page with the final frame size and duration. The page is the block you play, scrub, and export.

```kotlin highlight-android-create-video-scene
val scene = engine.scene.createForVideo()
val page = engine.block.create(DesignBlockType.Page)
engine.block.appendChild(parent = scene, child = page)
engine.block.setWidth(page, value = 1280F)
engine.block.setHeight(page, value = 720F)
engine.block.setDuration(page, duration = 10.0)
```

## Create Tracks

Tracks organize clips into timeline lanes. The primary track can keep automatic offset management so clips play one after another, while overlay tracks often disable automatic offsets so you can position clips freely in time.

```kotlin highlight-android-create-tracks
    val primaryTrack = engine.block.create(DesignBlockType.Track)
    val overlayTrack = engine.block.create(DesignBlockType.Track)
    val audioTrack = engine.block.create(DesignBlockType.Track)

    engine.block.appendChild(parent = page, child = primaryTrack)
    engine.block.appendChild(parent = page, child = overlayTrack)
    engine.block.appendChild(parent = page, child = audioTrack)

    // No type-safe Android helper exists for this track property yet.
    engine.block.setBoolean(
        block = overlayTrack,
        property = "track/automaticallyManageBlockOffsets",
        value = false,
    )
```

## Add Video and Audio Clips

Video clips are graphic blocks with a video fill. Audio clips use `DesignBlockType.Audio` and can live on their own track so the timeline UI can present them as an audio lane.

```kotlin highlight-android-add-video-clips
    val primaryClip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(primaryClip, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(primaryClip, value = 0F)
    engine.block.setPositionY(primaryClip, value = 0F)
    engine.block.setWidth(primaryClip, value = 1280F)
    engine.block.setHeight(primaryClip, value = 720F)

    val primaryFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = primaryFill,
        property = "fill/video/fileURI",
        value = Uri.parse(
            "https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
        ),
    )
    engine.block.setFill(primaryClip, fill = primaryFill)
    engine.block.appendChild(parent = primaryTrack, child = primaryClip)

    val overlayClip = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(overlayClip, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(overlayClip, value = 820F)
    engine.block.setPositionY(overlayClip, value = 80F)
    engine.block.setWidth(overlayClip, value = 360F)
    engine.block.setHeight(overlayClip, value = 220F)

    val overlayFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = overlayFill,
        property = "fill/video/fileURI",
        value = Uri.parse(
            "https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-kampus-production-8154913.mp4",
        ),
    )
    engine.block.setFill(overlayClip, fill = overlayFill)
    engine.block.appendChild(parent = overlayTrack, child = overlayClip)
```

```kotlin highlight-android-add-audio
val audioClip = engine.block.create(DesignBlockType.Audio)
engine.block.setUri(
    block = audioClip,
    property = "audio/fileURI",
    value = Uri.parse(
        "https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a",
    ),
)
engine.block.appendChild(parent = audioTrack, child = audioClip)
```

## Trim and Position Clips

Load media resources before reading source durations or setting trim ranges. `setTrimOffset()` chooses where playback starts inside the source file, `setTrimLength()` chooses how much source media is used, and `setTimeOffset()` places the clip on the page timeline.

```kotlin highlight-android-trim-and-position
    engine.block.forceLoadAVResource(primaryFill)
    engine.block.forceLoadAVResource(overlayFill)
    engine.block.forceLoadAVResource(audioClip)

    engine.block.setDuration(primaryClip, duration = 8.0)
    engine.block.setTrimOffset(primaryFill, offset = 2.0)
    engine.block.setTrimLength(primaryFill, length = 8.0)
    engine.block.setLooping(primaryFill, looping = false)
    engine.block.setMuted(primaryFill, muted = true)

    engine.block.setTimeOffset(overlayClip, offset = 3.0)
    engine.block.setDuration(overlayClip, duration = 4.0)
    engine.block.setTimeOffset(audioClip, offset = 0.0)
    engine.block.setDuration(audioClip, duration = 10.0)
```

In this sample, the primary video skips the first two seconds, uses an eight-second source range, and does not loop after that range. It also mutes the primary video fill so the source audio does not compete with the dedicated audio track. The overlay clip starts three seconds into the page timeline.

## Control Playback

Use page playback time for scrubbing and `setPlaying()` for preview playback. After seeking, `isVisibleAtCurrentPlaybackTime()` lets a custom timeline or preview UI confirm whether a clip is active at the playhead, while `isPlaying()` reports whether the page is currently in active playback.

```kotlin highlight-android-playback
    engine.block.setPlaybackTime(page, time = 3.5)
    check(engine.block.isVisibleAtCurrentPlaybackTime(overlayClip))

    engine.block.setPlaying(page, enabled = true)
    check(engine.block.isPlaying(page))
    engine.block.setPlaying(page, enabled = false)
```

## Generate Timeline Thumbnails

Generate video thumbnails from a video fill or block and waveform data from an audio block. Video thumbnail data is returned as RGBA pixel buffers; audio waveform samples are returned as channel-interleaved float values.

```kotlin highlight-android-thumbnails
    val videoThumbnails = engine.block.generateVideoThumbnailSequence(
        block = primaryFill,
        thumbnailHeight = 72,
        timeBegin = 0.0,
        timeEnd = 8.0,
        numberOfFrames = 4,
    ).toList()

    val audioWaveformChunks = engine.block.generateAudioThumbnailSequence(
        block = audioClip,
        samplesPerChunk = 40,
        timeBegin = 0.0,
        timeEnd = 10.0,
        numberOfSamples = 160,
        numberOfChannels = 2,
    ).toList()
```

Use the emitted frame and chunk indices as stable positions in your custom timeline cache. Start a new request when the zoom range, clip trim, or visible time window changes.

## Export the Timeline

Export the page with `engine.block.exportVideo()`. Use the page duration when you want to encode the complete timeline, and use the progress callback to update your UI while frames are rendered and encoded. Pass `options` for H.264 profile, level, bitrate, frame rate, and target dimensions. Use `onPreExport` for export-time setup on the background engine and `uriResolver` when bundled or relative URIs need rewriting before export.

```kotlin highlight-android-export
val exportDuration = engine.block.getDuration(page)
val videoBytes = engine.block.exportVideo(
    block = page,
    timeOffset = 0.0,
    duration = exportDuration,
    mimeType = MimeType.MP4,
    progressCallback = { progress ->
        println("Encoded ${progress.encodedFrames} of ${progress.totalFrames} frames")
    },
)
```

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.createForVideo()` | Creates a video-mode scene with timeline playback support. |
| `engine.block.create(blockType=_)` | Creates pages, tracks, graphics, and audio blocks. |
| `engine.block.createFill(fillType=_)` | Creates a video fill for a graphic clip. |
| `engine.block.appendChild(parent=_, child=_)` | Adds pages, tracks, and clips to the timeline hierarchy. |
| `engine.block.setDuration(block=_, duration=_)` | Sets how long a page or clip is active in seconds. |
| `engine.block.setTimeOffset(block=_, offset=_)` | Places a clip on its parent timeline in seconds. |
| `engine.block.forceLoadAVResource(block=_)` | Loads a video fill or audio block before duration, trim, or thumbnail queries. |
| `engine.block.setTrimOffset(block=_, offset=_)` | Sets the source-media start position for playback. |
| `engine.block.setTrimLength(block=_, length=_)` | Sets the length of source media used by the clip. |
| `engine.block.setPlaybackTime(block=_, time=_)` | Moves the playhead for a page or other playback-time block. |
| `engine.block.setPlaying(block=_, enabled=_)` | Starts or pauses playback for a page or media block. |
| `engine.block.isVisibleAtCurrentPlaybackTime(block=_)` | Returns whether a block should be visible at the current playhead position. |
| `engine.block.isPlaying(block=_)` | Returns whether a page or media block is currently in active playback. |
| `engine.block.generateVideoThumbnailSequence(block=_, thumbnailHeight=_, timeBegin=_, timeEnd=_, numberOfFrames=_)` | Emits frame thumbnails for timeline strips. |
| `engine.block.generateAudioThumbnailSequence(block=_, samplesPerChunk=_, timeBegin=_, timeEnd=_, numberOfSamples=_, numberOfChannels=_)` | Emits waveform chunks for audio lanes. |
| `engine.block.exportVideo(block=_, timeOffset=_, duration=_, mimeType=_, progressCallback=_, options=_, onPreExport=_, uriResolver=_)` | Exports a page timeline to MP4 with optional encoder settings, background-engine setup, and URI rewriting. |

## Troubleshooting

- **Trim calls fail:** call `forceLoadAVResource()` on the video fill or audio block before setting trim offset or length.
- **Clips ignore manual offsets:** disable `"track/automaticallyManageBlockOffsets"` on tracks where clips need gaps or overlaps.
- **Export is blank near the end:** make sure the page duration does not exceed the end time of the visible clips unless blank frames are intentional.
- **Thumbnail generation stalls during playback:** pause playback before regenerating dense thumbnail or waveform ranges.

## Next Steps

- [Trim](../edit-video/trim.md) — Documentation for Trim
- [Control Audio and Video](./control.md) - Learn to play, pause, seek, and preview audio and video content in CE.SDK using playback controls and solo mode.
- [Compress Exports for Smaller Files](../export-save-publish/export/compress.md) - Learn how to reduce file sizes during export from CE.SDK for Android by tuning format-specific compression settings in Kotlin.




---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support