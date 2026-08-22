> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Adjust Speed](./adjust-speed.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-audio-adjust-speed/CreateAudioAdjustSpeed.kt reference-only
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine

suspend fun createAudioAdjustSpeed(engine: Engine) {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(block = page, value = 1280F)
    engine.block.setHeight(block = page, value = 720F)
    engine.block.setDuration(block = page, duration = 45.0)

    val normalSpeedAudio = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = normalSpeedAudio)

    // audio/fileURI is the standard Engine property key for an audio block's source URI.
    engine.block.setString(
        block = normalSpeedAudio,
        property = "audio/fileURI",
        value = "https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a",
    )
    engine.block.forceLoadAVResource(block = normalSpeedAudio)
    engine.block.setDuration(block = normalSpeedAudio, duration = 10.0)
    val normalDuration = engine.block.getDuration(block = normalSpeedAudio)

    engine.block.setPlaybackSpeed(block = normalSpeedAudio, speed = 1.0F)

    val currentSpeed = engine.block.getPlaybackSpeed(block = normalSpeedAudio)
    check(currentSpeed == 1.0F)

    val slowMotionAudio = engine.block.duplicate(block = normalSpeedAudio)
    engine.block.setTimeOffset(block = slowMotionAudio, offset = 11.0)
    engine.block.forceLoadAVResource(block = slowMotionAudio)
    engine.block.setDuration(block = slowMotionAudio, duration = normalDuration)
    engine.block.setPlaybackSpeed(block = slowMotionAudio, speed = 0.5F)

    val slowMotionDuration = engine.block.getDuration(block = slowMotionAudio)
    check(engine.block.getPlaybackSpeed(block = slowMotionAudio) == 0.5F)
    check(slowMotionDuration > normalDuration)

    val maximumSpeedAudio = engine.block.duplicate(block = normalSpeedAudio)
    engine.block.setTimeOffset(block = maximumSpeedAudio, offset = 32.0)
    engine.block.forceLoadAVResource(block = maximumSpeedAudio)
    engine.block.setDuration(block = maximumSpeedAudio, duration = normalDuration)
    engine.block.setPlaybackSpeed(block = maximumSpeedAudio, speed = 3.0F)

    val maximumSpeedDuration = engine.block.getDuration(block = maximumSpeedAudio)
    check(engine.block.getPlaybackSpeed(block = maximumSpeedAudio) == 3.0F)
    check(maximumSpeedDuration < normalDuration)

    val doubleSpeedAudio = engine.block.duplicate(block = normalSpeedAudio)
    engine.block.setTimeOffset(block = doubleSpeedAudio, offset = 37.0)
    engine.block.forceLoadAVResource(block = doubleSpeedAudio)
    engine.block.setDuration(block = doubleSpeedAudio, duration = normalDuration)

    val durationBeforeSpeedChange = engine.block.getDuration(block = doubleSpeedAudio)
    engine.block.setPlaybackSpeed(block = doubleSpeedAudio, speed = 2.0F)
    val durationAfterSpeedChange = engine.block.getDuration(block = doubleSpeedAudio)

    check(durationAfterSpeedChange < durationBeforeSpeedChange)

    val sceneString = engine.scene.saveToString(scene = scene)
    check(sceneString.isNotBlank())
}
```

Control audio playback speed programmatically using CE.SDK's Android Engine API,
from quarter-speed (0.25x) to triple-speed (3.0x).

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260822/engine-guides-create-audio-adjust-speed)

<EngineReferenceNote {...props} />

Playback speed adjustment changes how fast or slow audio plays in the timeline. A speed multiplier of 1.0 represents normal speed, values below 1.0 slow down playback, and values above 1.0 speed it up.

This guide shows how to load an audio block, set and read playback speed, compare common speed presets, and serialize the resulting scene.

## Understanding Speed Concepts

CE.SDK supports playback speeds from **0.25x** (quarter speed) to **3.0x** (triple speed) for audio blocks, with **1.0x** as the default normal speed.

**Speed and Duration**: Adjusting speed automatically changes the block's duration with an inverse relationship: `perceived_duration = original_duration / speed_multiplier`. A 10-second block at 2.0x speed plays in 5 seconds; at 0.5x speed it takes 20 seconds.

**Common use cases**: Podcast playback controls, accessibility features, time-compressed narration, dramatic slow-motion audio effects, transcription work, and music tempo adjustments.

## Create a Video Scene

Audio blocks need a timeline. Start with a video scene, add a page, and give the page enough duration to contain the speed examples.

```kotlin highlight-android-create-video-scene
val scene = engine.scene.createForVideo()
val page = engine.block.create(DesignBlockType.Page)
engine.block.appendChild(parent = scene, child = page)
engine.block.setWidth(block = page, value = 1280F)
engine.block.setHeight(block = page, value = 720F)
engine.block.setDuration(block = page, duration = 45.0)
```

The page duration in this sample is intentionally longer than the first audio block because the slower duplicate takes more time on the timeline.

## Setting Up Audio for Speed Adjustment

### Loading Audio Files

Create an audio block, assign its `audio/fileURI` property, and force-load the resource before reading duration or changing speed.

```kotlin highlight-android-load-audio
    val normalSpeedAudio = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = normalSpeedAudio)

    // audio/fileURI is the standard Engine property key for an audio block's source URI.
    engine.block.setString(
        block = normalSpeedAudio,
        property = "audio/fileURI",
        value = "https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a",
    )
    engine.block.forceLoadAVResource(block = normalSpeedAudio)
    engine.block.setDuration(block = normalSpeedAudio, duration = 10.0)
    val normalDuration = engine.block.getDuration(block = normalSpeedAudio)
```

Audio blocks store the file URI directly on the block. `forceLoadAVResource` makes CE.SDK load the audio metadata so duration and playback speed calculations are based on the resource.

## Adjusting Playback Speed

### Setting Normal Speed

Set speed to 1.0 to keep the original playback rate or reset a block after other speed changes.

```kotlin highlight-android-set-normal-speed
engine.block.setPlaybackSpeed(block = normalSpeedAudio, speed = 1.0F)
```

Normal speed is a useful baseline when you generate several variants from the same audio source.

### Querying Current Speed

Read the current multiplier with `getPlaybackSpeed` when you need to populate controls, validate a change, or base a relative adjustment on the existing speed.

```kotlin highlight-android-query-current-speed
val currentSpeed = engine.block.getPlaybackSpeed(block = normalSpeedAudio)
check(currentSpeed == 1.0F)
```

The value is returned as a `Float`, using the same multiplier scale that `setPlaybackSpeed` accepts.

## Common Speed Presets

### Slow Motion Audio (0.5x)

Slowing audio to half speed creates a slow-motion effect for careful listening or transcription.

```kotlin highlight-android-set-slow-motion
    val slowMotionAudio = engine.block.duplicate(block = normalSpeedAudio)
    engine.block.setTimeOffset(block = slowMotionAudio, offset = 11.0)
    engine.block.forceLoadAVResource(block = slowMotionAudio)
    engine.block.setDuration(block = slowMotionAudio, duration = normalDuration)
    engine.block.setPlaybackSpeed(block = slowMotionAudio, speed = 0.5F)

    val slowMotionDuration = engine.block.getDuration(block = slowMotionAudio)
    check(engine.block.getPlaybackSpeed(block = slowMotionAudio) == 0.5F)
    check(slowMotionDuration > normalDuration)
```

At 0.5x speed, a 10-second audio block takes about 20 seconds to play. The sample checks that the duration grows after the slower speed is applied.

### Maximum Speed (3.0x)

The maximum supported audio speed is 3.0x, three times the normal playback rate.

```kotlin highlight-android-set-maximum-speed
    val maximumSpeedAudio = engine.block.duplicate(block = normalSpeedAudio)
    engine.block.setTimeOffset(block = maximumSpeedAudio, offset = 32.0)
    engine.block.forceLoadAVResource(block = maximumSpeedAudio)
    engine.block.setDuration(block = maximumSpeedAudio, duration = normalDuration)
    engine.block.setPlaybackSpeed(block = maximumSpeedAudio, speed = 3.0F)

    val maximumSpeedDuration = engine.block.getDuration(block = maximumSpeedAudio)
    check(engine.block.getPlaybackSpeed(block = maximumSpeedAudio) == 3.0F)
    check(maximumSpeedDuration < normalDuration)
```

At 3.0x speed, a 10-second audio block finishes in about 3.33 seconds. This is useful for rapid review workflows, but validate app controls so they stay within the supported range.

## Speed and Block Duration

### Understanding Duration Changes

When you change playback speed, CE.SDK updates the block duration to reflect the new playback time.

```kotlin highlight-android-speed-and-duration
    val doubleSpeedAudio = engine.block.duplicate(block = normalSpeedAudio)
    engine.block.setTimeOffset(block = doubleSpeedAudio, offset = 37.0)
    engine.block.forceLoadAVResource(block = doubleSpeedAudio)
    engine.block.setDuration(block = doubleSpeedAudio, duration = normalDuration)

    val durationBeforeSpeedChange = engine.block.getDuration(block = doubleSpeedAudio)
    engine.block.setPlaybackSpeed(block = doubleSpeedAudio, speed = 2.0F)
    val durationAfterSpeedChange = engine.block.getDuration(block = doubleSpeedAudio)

    check(durationAfterSpeedChange < durationBeforeSpeedChange)
```

The before and after durations show the inverse relationship: increasing speed shortens the block, while decreasing speed lengthens it. This keeps audio timing aligned with other timeline content.

## Exporting Results

After adjusting audio speeds, serialize the scene to preserve the audio blocks and their speed settings.

```kotlin highlight-android-export
val sceneString = engine.scene.saveToString(scene = scene)
check(sceneString.isNotBlank())
```

The returned scene string can be loaded later for further editing or used as a template in automated processing workflows.

## Troubleshooting

- **Speed is not applied**: Call `forceLoadAVResource` before setting speed so the audio metadata is available.
- **Duration looks unchanged**: Read duration again after `setPlaybackSpeed`; speed changes update the block duration automatically.
- **Speed input is outside the supported range**: Validate controls before calling `setPlaybackSpeed`; Android audio blocks support 0.25x through 3.0x, and values outside that range throw an `EngineException` instead of being clamped.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.createForVideo()` | Create a scene with video timeline support. |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create the page that hosts the audio blocks. |
| `engine.block.setWidth(block=_, value=_)` | Set the page width in scene units. |
| `engine.block.setHeight(block=_, value=_)` | Set the page height in scene units. |
| `engine.block.create(blockType=DesignBlockType.Audio)` | Create an audio block. |
| `engine.block.appendChild(parent=_, child=_)` | Add pages and audio blocks to the scene hierarchy. |
| `engine.block.setString(block=_, property="audio/fileURI", value=_)` | Set the source audio URI. |
| `engine.block.forceLoadAVResource(block=_)` | Load audio resource metadata before duration and speed operations. |
| `engine.block.setDuration(block=_, duration=_)` | Set the block's timeline duration in seconds. |
| `engine.block.getDuration(block=_)` | Read the block's timeline duration in seconds. |
| `engine.block.setTimeOffset(block=_, offset=_)` | Position an audio block on the timeline. |
| `engine.block.duplicate(block=_, attachToParent=_)` | Duplicate an audio block for another speed preset. |
| `engine.block.setPlaybackSpeed(block=_, speed=_)` | Set the speed multiplier. Valid range \[0.25, 3.0] for audio blocks. Also adjusts the block's trim and duration. |
| `engine.block.getPlaybackSpeed(block=_)` | Read the current speed multiplier. |
| `engine.scene.saveToString(scene=_)` | Serialize the scene with its audio speed settings. |

## Next Steps

- [Adjust Audio Volume](./adjust-volume.md) — Learn how to adjust audio volume in CE.SDK to control playback levels, mute audio, and balance multiple audio sources in video projects.
- [Loop Audio](./loop.md) — Create seamless repeating audio playback for background music and sound effects using CE.SDK's audio looping system.
- [Add Music](./add-music.md) — Add background music and audio tracks to video projects using CE.SDK's audio block system.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support