> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Fade In and Out](./fade.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-audio-audio-fade/Fade.kt reference-only
import android.net.Uri
import android.util.Log
import ly.img.engine.AnimationEasingType
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import kotlin.math.abs

private const val TAG = "FadeGuide"

suspend fun fadeAudio(engine: Engine): FadeResult {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(block = page, value = 1280F)
    engine.block.setHeight(block = page, value = 720F)
    engine.block.setDuration(block = page, duration = 15.0)

    val narration = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = narration)
    engine.block.setDuration(block = narration, duration = 10.0)

    engine.block.setUri(
        block = narration,
        property = "audio/fileURI",
        value = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a"),
    )

    engine.block.forceLoadAVResource(block = narration)
    engine.block.setVolume(block = narration, volume = 0.8F)

    engine.block.setAudioFadeIn(block = narration, duration = 2.0)

    engine.block.setAudioFadeOut(block = narration, duration = 3.0)

    val backgroundMusic = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = backgroundMusic)
    engine.block.setDuration(block = backgroundMusic, duration = 15.0)

    engine.block.setUri(
        block = backgroundMusic,
        property = "audio/fileURI",
        value = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a"),
    )

    engine.block.forceLoadAVResource(block = backgroundMusic)
    engine.block.setVolume(block = backgroundMusic, volume = 0.3F)

    engine.block.setAudioFadeIn(
        block = backgroundMusic,
        duration = 4.0,
        easing = AnimationEasingType.EASE_IN_OUT,
    )
    engine.block.setAudioFadeOut(
        block = backgroundMusic,
        duration = 4.0,
        easing = AnimationEasingType.EASE_OUT,
    )

    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block = videoBlock, value = 1280F)
    engine.block.setHeight(block = videoBlock, value = 720F)

    val videoTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = videoTrack)
    engine.block.appendChild(parent = videoTrack, child = videoBlock)
    engine.block.fillParent(block = videoTrack)

    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    engine.block.forceLoadAVResource(block = videoFill)

    // The audio of a video clip lives on its video fill, so the fade goes on the fill
    // and not on the graphic block that owns it.
    engine.block.setAudioFadeIn(block = videoFill, duration = 1.0)
    engine.block.setAudioFadeOut(
        block = videoFill,
        duration = 1.5,
        easing = AnimationEasingType.EASE_OUT,
    )

    val fadeInDuration = engine.block.getDouble(block = narration, property = "playback/fadeIn/duration")
    val fadeInEasing = engine.block.getEnum(block = narration, property = "playback/fadeIn/easing")
    val fadeOutDuration = engine.block.getDouble(block = narration, property = "playback/fadeOut/duration")
    val fadeOutEasing = engine.block.getEnum(block = narration, property = "playback/fadeOut/easing")

    Log.i(TAG, "Fade in: $fadeInDuration s ($fadeInEasing)")
    Log.i(TAG, "Fade out: $fadeOutDuration s ($fadeOutEasing)")

    engine.block.setAudioFadeIn(block = narration, duration = 0.0)
    val removedFadeInDuration = engine.block.getDouble(block = narration, property = "playback/fadeIn/duration")

    val musicFadeInDuration = engine.block.getDouble(block = backgroundMusic, property = "playback/fadeIn/duration")
    val musicFadeInEasing = engine.block.getEnum(block = backgroundMusic, property = "playback/fadeIn/easing")
    val videoFillFadeInDuration = engine.block.getDouble(block = videoFill, property = "playback/fadeIn/duration")
    val videoFillFadeOutEasing = engine.block.getEnum(block = videoFill, property = "playback/fadeOut/easing")

    check(abs(fadeInDuration - 2.0) < 0.001)
    check(fadeInEasing == AnimationEasingType.LINEAR.key)
    check(abs(fadeOutDuration - 3.0) < 0.001)
    check(fadeOutEasing == AnimationEasingType.LINEAR.key)
    check(abs(musicFadeInDuration - 4.0) < 0.001)
    check(musicFadeInEasing == AnimationEasingType.EASE_IN_OUT.key)
    check(abs(videoFillFadeInDuration - 1.0) < 0.001)
    check(videoFillFadeOutEasing == AnimationEasingType.EASE_OUT.key)
    check(removedFadeInDuration == 0.0)

    return FadeResult(
        fadeInDuration = fadeInDuration,
        fadeInEasing = fadeInEasing,
        fadeOutDuration = fadeOutDuration,
        fadeOutEasing = fadeOutEasing,
        musicFadeInDuration = musicFadeInDuration,
        musicFadeInEasing = musicFadeInEasing,
        videoFillFadeInDuration = videoFillFadeInDuration,
        videoFillFadeOutEasing = videoFillFadeOutEasing,
        removedFadeInDuration = removedFadeInDuration,
    )
}
```

Ramp audio up at the start of a clip and down at the end instead of cutting in
and out abruptly.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260831/engine-guides-create-audio-audio-fade)

<EngineReferenceNote {...props} />

An audio fade ramps the volume of a clip between silence and its configured volume over a fixed duration. Use `setAudioFadeIn()` for the start of a clip and `setAudioFadeOut()` for the end. Both take a duration in seconds and an optional easing curve. A duration of `0` — the default — means no fade.

This guide covers setting fade-in and fade-out durations, choosing an easing curve, reading the configuration back through block properties, removing a fade, and fading the audio of a video fill.

## Understanding Audio Fades

### How the Fade Gain Is Applied

The fade produces a gain between `0.0` and `1.0` that is multiplied with the block's volume. A fade-in on a block at 50% volume therefore ramps from silence to 50%, not to 100%. Fades also combine with page volume, muting, and clip transitions.

### Fades Are Anchored to the Timeline

The fade-in window starts at the beginning of the block and the fade-out window ends at the end of the block, both measured against the block's timeline duration. Trimming or resizing a clip keeps the fade-in at the audible start and the fade-out at the audible end.

## Setting Up an Audio Clip

Create an audio block, load its file, and give it a duration and a volume. The fade ramps towards this volume rather than towards full scale.

```kotlin highlight-android-create-audio
    val narration = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = narration)
    engine.block.setDuration(block = narration, duration = 10.0)

    engine.block.setUri(
        block = narration,
        property = "audio/fileURI",
        value = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a"),
    )

    engine.block.forceLoadAVResource(block = narration)
    engine.block.setVolume(block = narration, volume = 0.8F)
```

`forceLoadAVResource()` makes sure CE.SDK has downloaded the file and read its metadata before you configure playback on the block.

## Fading Audio In

Set a fade-in with `setAudioFadeIn()`. The audio ramps up from silence over the given number of seconds at the start of the block.

```kotlin highlight-android-fade-in
engine.block.setAudioFadeIn(block = narration, duration = 2.0)
```

Durations are in seconds and accept fractional values. Negative durations and `NaN` are clamped to `0`, which leaves the block without a fade-in instead of failing.

## Fading Audio Out

Set a fade-out with `setAudioFadeOut()`. The audio ramps down to silence over the last seconds of the block.

```kotlin highlight-android-fade-out
engine.block.setAudioFadeOut(block = narration, duration = 3.0)
```

If the fade-out is longer than the clip, the window is clamped to the block, so the clip already starts partly faded out. Shorten the fade or lengthen the clip when that is not what you want.

## Choosing an Easing Curve

Both methods take an optional `AnimationEasingType` as their third argument, defaulting to `AnimationEasingType.LINEAR`. `LINEAR` changes the gain at a constant rate. `EASE_IN`, `EASE_OUT`, and `EASE_IN_OUT` bias the ramp towards the start, the end, or both. The full set of curves is the same one used by block animations.

```kotlin highlight-android-fade-easing
    val backgroundMusic = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = backgroundMusic)
    engine.block.setDuration(block = backgroundMusic, duration = 15.0)

    engine.block.setUri(
        block = backgroundMusic,
        property = "audio/fileURI",
        value = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a"),
    )

    engine.block.forceLoadAVResource(block = backgroundMusic)
    engine.block.setVolume(block = backgroundMusic, volume = 0.3F)

    engine.block.setAudioFadeIn(
        block = backgroundMusic,
        duration = 4.0,
        easing = AnimationEasingType.EASE_IN_OUT,
    )
    engine.block.setAudioFadeOut(
        block = backgroundMusic,
        duration = 4.0,
        easing = AnimationEasingType.EASE_OUT,
    )
```

An eased fade-in works well for background music that should swell in gradually under a voiceover, while a linear fade is easier to reason about when you need a predictable ramp.

## Fading Video Audio

Video audio lives on the video fill, not on the graphic block that displays it. Resolve the fill with `getFill()`, or reuse the fill you created, and set the fade on it — exactly as with `setVolume()`.

```kotlin highlight-android-video-fill-fade
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4"),
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    engine.block.forceLoadAVResource(block = videoFill)

    // The audio of a video clip lives on its video fill, so the fade goes on the fill
    // and not on the graphic block that owns it.
    engine.block.setAudioFadeIn(block = videoFill, duration = 1.0)
    engine.block.setAudioFadeOut(
        block = videoFill,
        duration = 1.5,
        easing = AnimationEasingType.EASE_OUT,
    )
```

The fade window still follows the graphic block's position and duration on the timeline. Setting a fade on the graphic block itself throws, because only audio blocks and video fills support audio fades.

## Reading and Removing Fades

Fades are exposed as block properties, so `getDouble()` and `getEnum()` read the current configuration back to drive UI controls such as sliders and curve pickers. `getEnum()` returns the easing key, for example `Linear` or `EaseInOut`.

| Property                    | Type   |
| --------------------------- | ------ |
| `playback/fadeIn/duration`  | Double |
| `playback/fadeIn/easing`    | Enum   |
| `playback/fadeOut/duration` | Double |
| `playback/fadeOut/easing`   | Enum   |

```kotlin highlight-android-read-fade
    val fadeInDuration = engine.block.getDouble(block = narration, property = "playback/fadeIn/duration")
    val fadeInEasing = engine.block.getEnum(block = narration, property = "playback/fadeIn/easing")
    val fadeOutDuration = engine.block.getDouble(block = narration, property = "playback/fadeOut/duration")
    val fadeOutEasing = engine.block.getEnum(block = narration, property = "playback/fadeOut/easing")

    Log.i(TAG, "Fade in: $fadeInDuration s ($fadeInEasing)")
    Log.i(TAG, "Fade out: $fadeOutDuration s ($fadeOutEasing)")
```

Setting a duration of `0` removes a fade again. The easing value stays on the block, so restoring a non-zero duration brings back the same curve.

```kotlin highlight-android-remove-fade
engine.block.setAudioFadeIn(block = narration, duration = 0.0)
val removedFadeInDuration = engine.block.getDouble(block = narration, property = "playback/fadeIn/duration")
```

## Fades, Trimming, and Splitting

Because the windows are anchored to the block's timeline duration, shortening a clip moves the fade-out along with the new end rather than leaving it stranded inside the clip.

Splitting a clip keeps only the outer fades: the first half keeps its fade-in and the second half keeps its fade-out. The audio therefore does not dip at the cut.

## Troubleshooting

### Fade Is Not Audible

Check that the block is not muted and that its volume is above `0`. The fade gain is multiplied with the volume, so a muted or silent block stays silent through the whole ramp.

### Setting a Fade Fails

Fades apply only to audio blocks and video fills. Pass the video fill, not the graphic block that owns it.

### Fade Disappeared After Splitting

This is intentional. Each half keeps only the fade at its outer edge, so playback does not dip at the cut.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.setAudioFadeIn(block=_, duration=_, easing=_)` | Block | Ramp audio up at the start of the block |
| `engine.block.setAudioFadeOut(block=_, duration=_, easing=_)` | Block | Ramp audio down at the end of the block |
| `engine.block.getDouble(block=_, property="playback/fadeIn/duration")` | Block | Read a fade duration |
| `engine.block.getEnum(block=_, property="playback/fadeIn/easing")` | Block | Read a fade easing curve |
| `engine.block.setVolume(block=_, volume=_)` | Block | Set the volume the fade ramps towards |
| `engine.block.forceLoadAVResource(block=_)` | Block | Load the audio resource and its metadata |
| `engine.block.create(blockType=_)` | Block | Create an audio or graphic block |
| `engine.block.appendChild(parent=_, child=_)` | Block | Attach a block to the page or a track |
| `engine.block.setDuration(block=_, duration=_)` | Block | Set the timeline duration the fades are anchored to |
| `engine.block.setUri(block=_, property=_, value=_)` | Block | Point a block or fill at a media file |
| `engine.block.createFill(fillType=_)` | Block | Create the video fill that carries the audio |
| `engine.block.setFill(block=_, fill=_)` | Block | Attach the video fill to a graphic block |

## Next Steps

- [Adjust Audio Volume](./adjust-volume.md) — Set the level a fade ramps towards.
- [Add Music](./add-music.md) — Add background music and audio tracks to video projects.
- [Apply Transitions](../../create-video/apply-transitions.md) — Cross-fade between clips on a track.
- [Split Video and Audio](../../edit-video/split.md) — Split clips on the timeline.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support