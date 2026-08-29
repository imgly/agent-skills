> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Loop](./loop.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-audio-loop/CreateAudioLoop.kt reference-only
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine

data class CreateAudioLoop(
    val audioDuration: Double,
    val pageDuration: Double,
    val loopingTimeOffset: Double,
    val loopingEnabled: Boolean,
    val loopingDuration: Double,
    val nonLoopingTimeOffset: Double,
    val nonLoopingEnabled: Boolean,
    val nonLoopingDuration: Double,
    val trimmedTimeOffset: Double,
    val trimmedLoopingEnabled: Boolean,
    val trimOffset: Double,
    val trimLength: Double,
    val trimmedDuration: Double,
    val sceneString: String,
)

suspend fun createAudioLoop(engine: Engine): CreateAudioLoop {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)

    val audioUri = "https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a"

    val audioBlock = engine.block.create(DesignBlockType.Audio)
    // Android exposes the audio source as the `audio/fileURI` property key.
    engine.block.setString(block = audioBlock, property = "audio/fileURI", value = audioUri)

    engine.block.forceLoadAVResource(audioBlock)

    val audioDuration = engine.block.getAVResourceTotalDuration(audioBlock)
    println("Audio duration: $audioDuration seconds")

    val loopingTimeOffset = 0.0
    val loopingDuration = audioDuration * 3.0

    val nonLoopingTimeOffset = loopingTimeOffset + loopingDuration + 1.0
    val nonLoopingDuration = audioDuration + 12.0

    val trimmedTimeOffset = nonLoopingTimeOffset + nonLoopingDuration + 1.0
    val trimOffset = 1.0
    val trimLength = 2.0
    val trimmedDuration = trimLength * 4.0

    val pageDuration = maxOf(
        loopingTimeOffset + loopingDuration,
        nonLoopingTimeOffset + nonLoopingDuration,
        trimmedTimeOffset + trimmedDuration,
    )
    engine.block.setDuration(page, duration = pageDuration)

    val loopingAudio = engine.block.duplicate(block = audioBlock, attachToParent = false)
    engine.block.appendChild(parent = page, child = loopingAudio)
    engine.block.setTimeOffset(loopingAudio, offset = loopingTimeOffset)
    engine.block.setLooping(loopingAudio, looping = true)
    engine.block.setDuration(loopingAudio, duration = loopingDuration)

    val isLooping = engine.block.isLooping(loopingAudio)
    println("Is looping: $isLooping")

    val nonLoopingAudio = engine.block.duplicate(block = audioBlock, attachToParent = false)
    engine.block.appendChild(parent = page, child = nonLoopingAudio)
    engine.block.setTimeOffset(nonLoopingAudio, offset = nonLoopingTimeOffset)
    engine.block.setLooping(nonLoopingAudio, looping = false)
    engine.block.setDuration(nonLoopingAudio, duration = nonLoopingDuration)

    val trimmedLoopAudio = engine.block.duplicate(block = audioBlock, attachToParent = false)
    engine.block.appendChild(parent = page, child = trimmedLoopAudio)
    engine.block.setTimeOffset(trimmedLoopAudio, offset = trimmedTimeOffset)

    engine.block.setTrimOffset(trimmedLoopAudio, offset = trimOffset)
    engine.block.setTrimLength(trimmedLoopAudio, length = trimLength)

    engine.block.setLooping(trimmedLoopAudio, looping = true)
    engine.block.setDuration(trimmedLoopAudio, duration = trimmedDuration)

    engine.block.destroy(audioBlock)

    val sceneString = engine.scene.saveToString(scene = scene)
    println("Scene saved (${sceneString.length} characters)")

    return CreateAudioLoop(
        audioDuration = audioDuration,
        pageDuration = engine.block.getDuration(page),
        loopingTimeOffset = engine.block.getTimeOffset(loopingAudio),
        loopingEnabled = isLooping,
        loopingDuration = engine.block.getDuration(loopingAudio),
        nonLoopingTimeOffset = engine.block.getTimeOffset(nonLoopingAudio),
        nonLoopingEnabled = engine.block.isLooping(nonLoopingAudio),
        nonLoopingDuration = engine.block.getDuration(nonLoopingAudio),
        trimmedTimeOffset = engine.block.getTimeOffset(trimmedLoopAudio),
        trimmedLoopingEnabled = engine.block.isLooping(trimmedLoopAudio),
        trimOffset = engine.block.getTrimOffset(trimmedLoopAudio),
        trimLength = engine.block.getTrimLength(trimmedLoopAudio),
        trimmedDuration = engine.block.getDuration(trimmedLoopAudio),
        sceneString = sceneString,
    )
}
```

Control audio looping behavior programmatically for background music, sound
effects, and rhythmic audio segments.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-create-audio-loop)

<EngineReferenceNote {...props} />

Audio looping restarts an audio block from the beginning when playback reaches the end. When you set a block duration longer than the audio length and enable looping, CE.SDK repeats the audio to fill the whole duration.

This guide covers how to enable and disable audio looping, read the current looping state, combine looping with duration settings, and loop trimmed audio segments using the Android Engine API.

## Setting Up the Scene

Start with a video scene and a page that acts as the timeline container. The sample sizes the page after loading audio metadata so the timeline covers every audio block.

```kotlin highlight-android-setup
val scene = engine.scene.createForVideo()
val page = engine.block.create(DesignBlockType.Page)
engine.block.appendChild(parent = scene, child = page)
engine.block.setWidth(page, value = 1280F)
engine.block.setHeight(page, value = 720F)
```

Audio blocks must be children of the page to participate in the timeline. The sample appends playable copies to the page in the sections below.

## Understanding Audio Looping

When looping is enabled on an audio block, CE.SDK repeats the audio content from the beginning each time it reaches the end. This continues until the block's duration is filled. For example, setting a block duration to three times the source duration makes the clip play three complete times.

Loop transitions are immediate. The audio content determines how smooth the result sounds, so files with matching start and end points create the cleanest loops.

## Creating Audio Blocks

### Adding Audio Content

Audio blocks use file URIs to reference audio sources. We create a reusable source block and assign the audio URI with the `audio/fileURI` property.

```kotlin highlight-android-create-audio-block
val audioBlock = engine.block.create(DesignBlockType.Audio)
// Android exposes the audio source as the `audio/fileURI` property key.
engine.block.setString(block = audioBlock, property = "audio/fileURI", value = audioUri)
```

CE.SDK supports common audio formats including MP3, M4A, WAV, and AAC.

## Enabling Audio Looping

### Loading Audio Resources

Before working with audio metadata, load the resource so the engine can read its duration.

```kotlin highlight-android-load-audio-resource
    engine.block.forceLoadAVResource(audioBlock)

    val audioDuration = engine.block.getAVResourceTotalDuration(audioBlock)
    println("Audio duration: $audioDuration seconds")
```

`getAVResourceTotalDuration()` returns the source audio duration in seconds. Use it when you need to calculate how many repetitions fit into a block duration.

### Sizing the Timeline

Derive block durations from the loaded source duration instead of assuming a fixed clip length. The sample also sets the page duration to the latest block end time, including each block's `timeOffset + duration`.

```kotlin highlight-android-size-timeline
    val loopingTimeOffset = 0.0
    val loopingDuration = audioDuration * 3.0

    val nonLoopingTimeOffset = loopingTimeOffset + loopingDuration + 1.0
    val nonLoopingDuration = audioDuration + 12.0

    val trimmedTimeOffset = nonLoopingTimeOffset + nonLoopingDuration + 1.0
    val trimOffset = 1.0
    val trimLength = 2.0
    val trimmedDuration = trimLength * 4.0

    val pageDuration = maxOf(
        loopingTimeOffset + loopingDuration,
        nonLoopingTimeOffset + nonLoopingDuration,
        trimmedTimeOffset + trimmedDuration,
    )
    engine.block.setDuration(page, duration = pageDuration)
```

The looping block spans three full source-length passes. The non-looping block lasts one source duration plus 12 seconds, so playback stops after the source ends and the rest remains silent.

### Setting Looping State

Enable looping by calling `setLooping()` with `true`. When the block duration is longer than the audio length, the audio repeats until that duration is filled.

```kotlin highlight-android-enable-looping
val loopingAudio = engine.block.duplicate(block = audioBlock, attachToParent = false)
engine.block.appendChild(parent = page, child = loopingAudio)
engine.block.setTimeOffset(loopingAudio, offset = loopingTimeOffset)
engine.block.setLooping(loopingAudio, looping = true)
engine.block.setDuration(loopingAudio, duration = loopingDuration)
```

In this example, the block duration is calculated as `audioDuration * 3.0`, so the loaded source loops three times.

## Querying and Controlling Looping

### Checking Looping State

Read the current looping state whenever your app manages multiple audio tracks or needs to reflect state in custom controls.

```kotlin highlight-android-query-looping-state
val isLooping = engine.block.isLooping(loopingAudio)
println("Is looping: $isLooping")
```

The returned Boolean reports whether the block is configured to restart from the beginning during playback.

### Disabling Looping

Set looping to `false` when an audio block should play once.

```kotlin highlight-android-non-looping-audio
val nonLoopingAudio = engine.block.duplicate(block = audioBlock, attachToParent = false)
engine.block.appendChild(parent = page, child = nonLoopingAudio)
engine.block.setTimeOffset(nonLoopingAudio, offset = nonLoopingTimeOffset)
engine.block.setLooping(nonLoopingAudio, looping = false)
engine.block.setDuration(nonLoopingAudio, duration = nonLoopingDuration)
```

With looping disabled and a duration longer than the source audio, playback stops after the source audio ends and leaves silence for the remaining block duration.

## Looping with Trim Settings

### Trimming Looped Audio

Combine trim settings with looping to repeat a short segment from a longer audio file.

```kotlin highlight-android-looping-with-trim
    val trimmedLoopAudio = engine.block.duplicate(block = audioBlock, attachToParent = false)
    engine.block.appendChild(parent = page, child = trimmedLoopAudio)
    engine.block.setTimeOffset(trimmedLoopAudio, offset = trimmedTimeOffset)

    engine.block.setTrimOffset(trimmedLoopAudio, offset = trimOffset)
    engine.block.setTrimLength(trimmedLoopAudio, length = trimLength)

    engine.block.setLooping(trimmedLoopAudio, looping = true)
    engine.block.setDuration(trimmedLoopAudio, duration = trimmedDuration)
```

This trims the audio to a 2-second segment from 1.0s to 3.0s of the source. The 8-second block duration repeats that segment four times, and the page duration includes the trimmed block's offset plus its duration.

### Choosing Loop Points

For smoother loops, choose trim points where the audio flows naturally from end to beginning. Consistent rhythm, tone, and volume at trim boundaries reduce audible transitions.

## Exporting the Scene

After configuring audio looping, save the scene for storage, later editing, or rendering in another CE.SDK environment.

```kotlin highlight-android-export
val sceneString = engine.scene.saveToString(scene = scene)
println("Scene saved (${sceneString.length} characters)")
```

The serialized scene preserves the audio blocks, timing, trim values, and looping configuration.

## Troubleshooting

**Audio not looping**: Verify `isLooping()` returns `true` and that the block duration exceeds the source audio or trimmed segment length.

**Audible gaps at loop points**: Choose trim points where the end of the segment can flow back into the beginning. Matching volume and rhythm at both boundaries creates smoother loops.

**Resource metadata unavailable**: Call `forceLoadAVResource()` before reading source duration or changing trim values.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.createForVideo()` | Create a video scene for timeline audio |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create the timeline page |
| `engine.block.create(blockType=DesignBlockType.Audio)` | Create an audio block |
| `engine.block.appendChild(parent=_, child=_)` | Add a block to the scene hierarchy |
| `engine.block.setWidth(block=_, value=_)` | Set the page width |
| `engine.block.setHeight(block=_, value=_)` | Set the page height |
| `engine.block.setString(block=_, property="audio/fileURI", value=_)` | Set the audio source URI |
| `engine.block.forceLoadAVResource(block=_)` | Load audio metadata |
| `engine.block.getAVResourceTotalDuration(block=_)` | Read the source audio duration |
| `engine.block.duplicate(block=_, attachToParent=false)` | Reuse the loaded audio source for another block |
| `engine.block.setTimeOffset(block=_, offset=_)` | Set when audio starts on the timeline |
| `engine.block.setLooping(block=_, looping=_)` | Enable or disable audio looping |
| `engine.block.isLooping(block=_)` | Check whether audio is set to loop |
| `engine.block.setDuration(block=_, duration=_)` | Set playback duration in seconds |
| `engine.block.getDuration(block=_)` | Read playback duration in seconds |
| `engine.block.setTrimOffset(block=_, offset=_)` | Set the start of the trimmed source segment |
| `engine.block.setTrimLength(block=_, length=_)` | Set the trimmed segment length |
| `engine.block.destroy(block=_)` | Remove a temporary block |
| `engine.scene.saveToString(scene=_)` | Serialize the scene with audio settings |

## Next Steps

- [Add Music](./add-music.md) — Add background music and audio tracks to video projects using CE.SDK's audio block system.
- [Adjust Audio Volume](./adjust-volume.md) — Learn how to adjust audio volume in CE.SDK to control playback levels, mute audio, and balance multiple audio sources in video projects.
- [Adjust Audio Playback Speed](./adjust-speed.md) — Learn how to adjust audio playback speed in CE.SDK to create slow-motion, time-stretched, and fast-forward audio effects.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support