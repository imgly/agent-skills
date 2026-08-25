> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Adjust Volume](./adjust-volume.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-audio-audio-adjust-volume/AdjustVolume.kt reference-only
import android.net.Uri
import android.util.Log
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import kotlin.math.abs

private const val TAG = "AdjustVolumeGuide"

suspend fun adjustVolume(engine: Engine): AdjustVolumeResult {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(block = page, value = 1280F)
    engine.block.setHeight(block = page, value = 720F)
    engine.block.setDuration(block = page, duration = 10.0)

    val voiceoverAudio = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = voiceoverAudio)
    engine.block.setDuration(block = voiceoverAudio, duration = 10.0)

    val voiceoverUri = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a")
    engine.block.setUri(
        block = voiceoverAudio,
        property = "audio/fileURI",
        value = voiceoverUri,
    )

    engine.block.forceLoadAVResource(block = voiceoverAudio)

    engine.block.setVolume(block = voiceoverAudio, volume = 0.8F)
    val foregroundVolume = engine.block.getVolume(block = voiceoverAudio)

    val backgroundMusic = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = backgroundMusic)
    engine.block.setDuration(block = backgroundMusic, duration = 10.0)

    val backgroundUri = Uri.parse("https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a")
    engine.block.setUri(
        block = backgroundMusic,
        property = "audio/fileURI",
        value = backgroundUri,
    )

    engine.block.forceLoadAVResource(block = backgroundMusic)
    engine.block.setVolume(block = backgroundMusic, volume = 0.3F)
    val backgroundVolume = engine.block.getVolume(block = backgroundMusic)

    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block = videoBlock, value = 1280F)
    engine.block.setHeight(block = videoBlock, value = 720F)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    val videoTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = videoTrack)
    engine.block.appendChild(parent = videoTrack, child = videoBlock)
    engine.block.fillParent(block = videoTrack)
    engine.block.forceLoadAVResource(block = videoFill)

    engine.block.setVolume(block = videoFill, volume = 0.5F)
    val videoFillVolume = engine.block.getVolume(block = videoFill)

    engine.block.setMuted(block = voiceoverAudio, muted = true)
    val muted = engine.block.isMuted(block = voiceoverAudio)
    val mutedVolume = engine.block.getVolume(block = voiceoverAudio)

    engine.block.setMuted(block = voiceoverAudio, muted = false)
    val isMutedAfterUnmute = engine.block.isMuted(block = voiceoverAudio)

    val currentVolume = engine.block.getVolume(block = voiceoverAudio)
    val userMuted = engine.block.isMuted(block = voiceoverAudio)
    val forceMuted = engine.block.isForceMuted(block = voiceoverAudio)

    Log.i(TAG, "Audio volume: ${(currentVolume * 100).toInt()}%")
    Log.i(TAG, "Muted by user: $userMuted")
    Log.i(TAG, "Muted by engine: $forceMuted")

    val sliderPercent = 75
    val sliderVolume = sliderPercent / 100F

    engine.block.setVolume(block = voiceoverAudio, volume = sliderVolume)
    val displayedPercent = (engine.block.getVolume(block = voiceoverAudio) * 100).toInt()

    val currentlyMuted = engine.block.isMuted(block = voiceoverAudio)
    engine.block.setMuted(block = voiceoverAudio, muted = !currentlyMuted)

    val volumeIconState = when {
        engine.block.isForceMuted(block = voiceoverAudio) -> "force-muted"
        engine.block.isMuted(block = voiceoverAudio) -> "muted"
        else -> "volume"
    }

    check(abs(foregroundVolume - 0.8F) < 0.001F)
    check(abs(backgroundVolume - 0.3F) < 0.001F)
    check(abs(videoFillVolume - 0.5F) < 0.001F)
    check(muted)
    check(abs(mutedVolume - 0.8F) < 0.001F)
    check(!isMutedAfterUnmute)
    check(displayedPercent == sliderPercent)
    check(volumeIconState == "muted")

    return AdjustVolumeResult(
        foregroundVolume = foregroundVolume,
        backgroundVolume = backgroundVolume,
        videoFillVolume = videoFillVolume,
        mutedVolume = mutedVolume,
        muted = muted,
        isMutedAfterUnmute = isMutedAfterUnmute,
        sliderVolume = sliderVolume,
        sliderPercent = displayedPercent,
        toggledMuted = engine.block.isMuted(block = voiceoverAudio),
        forceMuted = forceMuted,
    )
}
```

Control audio playback volume with CE.SDK's Engine API for Android, from silent
(0.0) to full volume (1.0).

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.1-rc.0/engine-guides-create-audio-audio-adjust-volume)

<EngineReferenceNote {...props} />

Volume control adjusts how loud or quiet audio plays during playback. CE.SDK uses a normalized 0.0-1.0 range where 0.0 is completely silent and 1.0 is full volume. This applies to both audio blocks and video fills with embedded audio. Volume settings are commonly used for balancing multiple audio sources, creating fade effects, and allowing users to adjust playback levels.

The built-in Android editor exposes volume controls for selected audio blocks and video fills through the inspector bar. Timeline clips also indicate muted audio, so users can see when a clip is silent while arranging video projects.

This guide covers how to adjust audio volume programmatically using the Engine API, mute and unmute audio, query volume and mute states, and map custom UI controls to CE.SDK volume values.

## Understanding Volume Concepts

CE.SDK supports volume levels from **0.0** (silent) to **1.0** (full volume), with **1.0** as the default for new audio blocks. Values in between represent proportional volume levels: 0.5 is half volume, and 0.25 is quarter volume.

**Volume vs muting**: Setting volume to 0.0 makes audio silent, but `setMuted()` is preferred when you want to temporarily silence audio without losing the volume setting. Unmuting restores the previous volume level.

**Common use cases**: background music mixing (0.3-0.5 under voiceover), user volume controls, audio balancing for multi-track projects, fade effects, and accessibility features.

## Setting Up Audio for Volume Control

### Loading Audio Files

Create an audio block and load an audio file by setting its `audio/fileURI` property.

```kotlin highlight-android-create-audio
    val voiceoverAudio = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = voiceoverAudio)
    engine.block.setDuration(block = voiceoverAudio, duration = 10.0)

    val voiceoverUri = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a")
    engine.block.setUri(
        block = voiceoverAudio,
        property = "audio/fileURI",
        value = voiceoverUri,
    )

    engine.block.forceLoadAVResource(block = voiceoverAudio)
```

Unlike video or image blocks which use fills, audio blocks store the file URI directly on the block itself. `forceLoadAVResource()` ensures CE.SDK has downloaded the audio file and loaded its metadata before you manipulate it.

## Adjusting Volume

### Setting Volume

Set volume using `setVolume()` with a `Float` value between `0.0` and `1.0`.

```kotlin highlight-android-set-volume
engine.block.setVolume(block = voiceoverAudio, volume = 0.8F)
val foregroundVolume = engine.block.getVolume(block = voiceoverAudio)
```

Setting volume to 0.8 (80%) is useful when you want prominent audio that is not at maximum level, leaving headroom for other audio sources or preventing distortion.

### Setting Low Volume for Background Audio

For background music that should be audible but not prominent, use lower volume levels.

```kotlin highlight-android-set-low-volume
    val backgroundMusic = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = backgroundMusic)
    engine.block.setDuration(block = backgroundMusic, duration = 10.0)

    val backgroundUri = Uri.parse("https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a")
    engine.block.setUri(
        block = backgroundMusic,
        property = "audio/fileURI",
        value = backgroundUri,
    )

    engine.block.forceLoadAVResource(block = backgroundMusic)
    engine.block.setVolume(block = backgroundMusic, volume = 0.3F)
    val backgroundVolume = engine.block.getVolume(block = backgroundMusic)
```

At 0.3 (30%) volume, the audio remains clearly audible but stays in the background. This is a common level for background music under voiceover or dialogue.

### Volume on Video Fills

Video fills use the same volume API. Set volume on the video fill block to control the embedded audio track.

```kotlin highlight-android-video-fill-volume
    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block = videoBlock, value = 1280F)
    engine.block.setHeight(block = videoBlock, value = 720F)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    val videoTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = videoTrack)
    engine.block.appendChild(parent = videoTrack, child = videoBlock)
    engine.block.fillParent(block = videoTrack)
    engine.block.forceLoadAVResource(block = videoFill)

    engine.block.setVolume(block = videoFill, volume = 0.5F)
    val videoFillVolume = engine.block.getVolume(block = videoFill)
```

Use this when a video clip should stay visible but its embedded audio needs to sit below other tracks, or when you replace the clip's audio with a separate audio block.

## Muting Audio

### Mute and Unmute

Use `setMuted()` to mute audio without changing its volume setting. This is useful for toggle controls.

```kotlin highlight-android-mute-audio
    engine.block.setMuted(block = voiceoverAudio, muted = true)
    val muted = engine.block.isMuted(block = voiceoverAudio)
    val mutedVolume = engine.block.getVolume(block = voiceoverAudio)

    engine.block.setMuted(block = voiceoverAudio, muted = false)
    val isMutedAfterUnmute = engine.block.isMuted(block = voiceoverAudio)
```

When an audio block is muted, the volume setting is preserved. Unmuting later with `setMuted(block = voiceoverAudio, muted = false)` restores playback at the same volume level.

### Querying Volume and Mute States

Query current volume and mute states at any time.

```kotlin highlight-android-query-volume
    val currentVolume = engine.block.getVolume(block = voiceoverAudio)
    val userMuted = engine.block.isMuted(block = voiceoverAudio)
    val forceMuted = engine.block.isForceMuted(block = voiceoverAudio)

    Log.i(TAG, "Audio volume: ${(currentVolume * 100).toInt()}%")
    Log.i(TAG, "Muted by user: $userMuted")
    Log.i(TAG, "Muted by engine: $forceMuted")
```

Use `getVolume()` to read the current volume level, `isMuted()` to check if the block is muted by the user, and `isForceMuted()` to check if the engine has automatically muted the block due to playback rules.

## Mixing Multiple Audio Sources

### Balancing Tracks

When working with multiple audio sources, use different volume levels to create a balanced mix. A common approach is to keep voiceover or dialogue at higher levels (0.8-1.0) and background music at lower levels (0.3-0.5).

### Common Mixing Patterns

**Voiceover prominent**: set background music to 0.3 and voiceover to 1.0 for clear narration with musical accompaniment.

**Balanced dialogue and music**: set both to 0.6-0.7 when both elements are equally important.

**Sound effects as accents**: set sound effects to 0.5-0.8 depending on how prominent they should be in the mix.

## Building Volume Controls

### Volume Slider

When building a volume slider, map the slider value directly to the 0.0-1.0 range. Display percentages from 0-100% for user-friendly labels.

```kotlin highlight-android-volume-slider
    val sliderPercent = 75
    val sliderVolume = sliderPercent / 100F

    engine.block.setVolume(block = voiceoverAudio, volume = sliderVolume)
    val displayedPercent = (engine.block.getVolume(block = voiceoverAudio) * 100).toInt()
```

Android's built-in volume sheet uses the same 0.0-1.0 value range, so custom controls can write the slider value directly to the selected audio block or video fill.

### Mute Toggle

Implement mute buttons using `setMuted()` and indicate the current state using `isMuted()`. Show a separate state when `isForceMuted()` returns `true` to indicate the engine has automatically muted the audio.

```kotlin highlight-android-mute-toggle
    val currentlyMuted = engine.block.isMuted(block = voiceoverAudio)
    engine.block.setMuted(block = voiceoverAudio, muted = !currentlyMuted)

    val volumeIconState = when {
        engine.block.isForceMuted(block = voiceoverAudio) -> "force-muted"
        engine.block.isMuted(block = voiceoverAudio) -> "muted"
        else -> "volume"
    }
```

This keeps temporary mute state separate from the saved volume value, which makes toggles reversible.

## Troubleshooting

### Volume Changes Not Audible

Check if the block is muted with `isMuted()` or force muted with `isForceMuted()`. Verify the audio resource has loaded successfully with `forceLoadAVResource()`.

### Force Muted State

Video fills running faster than 3.0x are automatically force muted by the engine. Reduce the playback speed to 3.0x or below to restore audio output.

### Volume Not Persisting

Ensure you are setting volume on the correct block ID. Volume settings are block-specific and do not propagate to duplicates or other instances.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.setVolume(block=_, volume=_)` | Block | Set volume level from 0.0 to 1.0 |
| `engine.block.getVolume(block=_)` | Block | Get the current volume level |
| `engine.block.setMuted(block=_, muted=_)` | Block | Mute or unmute audio |
| `engine.block.isMuted(block=_)` | Block | Check if audio is muted by the user |
| `engine.block.isForceMuted(block=_)` | Block | Check if the engine has force muted audio |

## Next Steps

- [Add Music](./add-music.md) — Add background music and audio tracks to video projects using CE.SDK's audio block system.
- [Add Sound Effects](./add-sound-effects.md) — Learn how to add custom sound effects using audio buffers and raw PCM data
- [Adjust Audio Playback Speed](./adjust-speed.md) — Learn how to adjust audio playback speed in CE.SDK to create slow-motion, time-stretched, and fast-forward audio effects.
- [Loop Audio](./loop.md) — Create seamless repeating audio playback for background music and sound effects using CE.SDK's audio looping system.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support