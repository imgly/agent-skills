> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Control Audio and Video](./control.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-control-av/ControlAudioVideo.kt reference-only
import android.net.Uri
import android.util.Log
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

private const val TAG = "ControlAudioVideo"
private const val SAMPLE_VIDEO_URI = "https://img.ly/static/ubq_video_samples/bbb.mp4"

suspend fun controlAudioVideo(engine: Engine) {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1920F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)

    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(videoBlock, value = 1920F)
    engine.block.setHeight(videoBlock, value = 1080F)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse(SAMPLE_VIDEO_URI),
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)

    engine.block.appendChild(parent = track, child = videoBlock)
    engine.block.setDuration(videoBlock, duration = 10.0)

    engine.block.forceLoadAVResource(videoFill)

    val videoWidth = engine.block.getVideoWidth(videoFill)
    val videoHeight = engine.block.getVideoHeight(videoFill)
    val totalDuration = engine.block.getAVResourceTotalDuration(videoFill)
    Log.i(TAG, "Video dimensions: ${videoWidth}x$videoHeight")
    Log.i(TAG, "Total duration: ${totalDuration}s")

    if (engine.block.supportsPlaybackTime(page)) {
        engine.block.setPlaying(block = page, enabled = true)
        Log.i(TAG, "Is playing: ${engine.block.isPlaying(page)}")
        engine.block.setPlaying(block = page, enabled = false)
        Log.i(TAG, "Is playing after pause: ${engine.block.isPlaying(page)}")
    }

    if (engine.block.supportsPlaybackTime(page)) {
        engine.block.setPlaybackTime(block = page, time = 1.0)
        Log.i(TAG, "Playback time: ${engine.block.getPlaybackTime(page)}s")
    }

    Log.i(
        TAG,
        "Visible at current time: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock)}",
    )

    if (engine.block.supportsPlaybackTime(videoFill)) {
        engine.block.setSoloPlaybackEnabled(block = videoFill, enabled = true)
        Log.i(TAG, "Solo enabled: ${engine.block.isSoloPlaybackEnabled(videoFill)}")
        engine.block.setSoloPlaybackEnabled(block = videoFill, enabled = false)
    }
}
```

Play, pause, seek, and preview audio and video content programmatically using CE.SDK's playback control APIs.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-control-av)

<EngineReferenceNote {...props} />

CE.SDK provides playback control for audio and video through the Block API. Playback state, seeking, and solo preview are controlled programmatically. Resources must be loaded before accessing metadata like duration and dimensions.

This guide covers how to play and pause media, seek to specific positions, preview individual blocks with solo mode, check visibility at playback time, and access video resource metadata.

## Force Loading Resources

Media resource metadata is unavailable until the resource is loaded. Call `forceLoadAVResource()` on a video fill or audio block before reading duration, dimensions, or trim values.

```kotlin highlight-android-force-load
engine.block.forceLoadAVResource(videoFill)
```

Without loading the resource first, accessing properties like duration, dimensions, or trim values throws an error.

## Getting Video Metadata

Once the resource is loaded, query the video dimensions and total source duration.

```kotlin highlight-android-get-metadata
val videoWidth = engine.block.getVideoWidth(videoFill)
val videoHeight = engine.block.getVideoHeight(videoFill)
val totalDuration = engine.block.getAVResourceTotalDuration(videoFill)
Log.i(TAG, "Video dimensions: ${videoWidth}x$videoHeight")
Log.i(TAG, "Total duration: ${totalDuration}s")
```

`getVideoWidth()` and `getVideoHeight()` return the original video dimensions in pixels. `getAVResourceTotalDuration()` returns the full duration of the source media in seconds.

## Playing and Pausing

Check if the block supports playback time using `supportsPlaybackTime()`, then start or stop playback with `setPlaying()`.

```kotlin highlight-android-playback-control
if (engine.block.supportsPlaybackTime(page)) {
    engine.block.setPlaying(block = page, enabled = true)
    Log.i(TAG, "Is playing: ${engine.block.isPlaying(page)}")
    engine.block.setPlaying(block = page, enabled = false)
    Log.i(TAG, "Is playing after pause: ${engine.block.isPlaying(page)}")
}
```

`isPlaying()` returns the current playback state for the same block.

## Seeking

To jump to a specific playback position, use `setPlaybackTime()`. First, check if the block supports playback time with `supportsPlaybackTime()`.

```kotlin highlight-android-seeking
if (engine.block.supportsPlaybackTime(page)) {
    engine.block.setPlaybackTime(block = page, time = 1.0)
    Log.i(TAG, "Playback time: ${engine.block.getPlaybackTime(page)}s")
}
```

Playback time is specified in seconds. `getPlaybackTime()` returns the current position.

## Visibility at Current Time

Check if a block is visible at the current playback position using `isVisibleAtCurrentPlaybackTime()`. This is useful when blocks have different time offsets or durations.

```kotlin highlight-android-visibility
Log.i(
    TAG,
    "Visible at current time: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock)}",
)
```

## Solo Playback

Solo playback allows you to preview an individual video fill or audio block while the rest of the scene stays frozen. Check `supportsPlaybackTime()` before changing the solo playback state.

```kotlin highlight-android-solo-playback
if (engine.block.supportsPlaybackTime(videoFill)) {
    engine.block.setSoloPlaybackEnabled(block = videoFill, enabled = true)
    Log.i(TAG, "Solo enabled: ${engine.block.isSoloPlaybackEnabled(videoFill)}")
    engine.block.setSoloPlaybackEnabled(block = videoFill, enabled = false)
}
```

Enabling solo on one block automatically disables it on all others. Disable solo playback again when returning to full-scene playback.

## Troubleshooting

### Properties Unavailable Before Resource Load

**Symptom**: Accessing duration, dimensions, or trim values throws an error.

**Cause**: Media resource not yet loaded.

**Solution**: Always call `engine.block.forceLoadAVResource()` before accessing these properties.

### Block Not Playing

**Symptom**: Calling `setPlaying(true)` has no effect.

**Cause**: The block does not support playback time, or the scene is not in active playback.

**Solution**: Check that `supportsPlaybackTime()` returns `true` before setting playback state.

### Solo Playback Not Working

**Symptom**: Enabling solo does not isolate the block.

**Cause**: Solo playback was applied to an unsupported block type or to a block that is not visible at the current playback time.

**Solution**: Apply solo playback to a video fill or audio block and ensure the block is active at the current playback time.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.setPlaying(block=_, enabled=_)` | Playback | Enable or disable block playback |
| `engine.block.isPlaying(block=_)` | Playback | Check if a block is playing |
| `engine.block.setSoloPlaybackEnabled(block=_, enabled=_)` | Playback | Enable or disable solo playback mode |
| `engine.block.isSoloPlaybackEnabled(block=_)` | Playback | Check if solo playback is enabled |
| `engine.block.supportsPlaybackTime(block=_)` | Playback | Check support for play/pause, solo playback, and seeking |
| `engine.block.setPlaybackTime(block=_, time=_)` | Seeking | Set the current playback position in seconds |
| `engine.block.getPlaybackTime(block=_)` | Seeking | Get the current playback position in seconds |
| `engine.block.isVisibleAtCurrentPlaybackTime(block=_)` | Visibility | Check if a block is visible at the current time |
| `engine.block.supportsPlaybackControl(block=_)` | Support | Check support for looping, muting, volume, and playback speed |
| `engine.block.forceLoadAVResource(block=_)` | Resource | Load audio or video resource metadata |
| `engine.block.getAVResourceTotalDuration(block=_)` | Resource | Get source media duration in seconds |
| `engine.block.getVideoWidth(videoFill=_)` | Resource | Get video width in pixels |
| `engine.block.getVideoHeight(videoFill=_)` | Resource | Get video height in pixels |

## Next Steps

- [Trim](../edit-video/trim.md) — Documentation for Trim
- [Loop Audio](../create-audio/audio/loop.md) — Create seamless repeating audio playback for background music and sound effects using CE.SDK's audio looping system.
- [Adjust Audio Volume](../create-audio/audio/adjust-volume.md) — Learn how to adjust audio volume in CE.SDK to control playback levels, mute audio, and balance multiple audio sources in video projects.
- [Adjust Audio Playback Speed](../create-audio/audio/adjust-speed.md) - Learn how to adjust audio playback speed in CE.SDK to create slow-motion, time-stretched, and fast-forward audio effects.
- [Timeline Editor](./timeline-editor.md) - Use the timeline editor to arrange and edit video clips, audio, and animations frame by frame.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support