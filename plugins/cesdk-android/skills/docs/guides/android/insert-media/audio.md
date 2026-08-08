> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Insert Media Assets](../insert-media.md) > [Insert Audio](./audio.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-insert-media-audio/InsertMediaAudio.kt reference-only
import android.net.Uri
import android.util.Log
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import kotlin.math.abs

private const val TAG = "InsertAudioGuide"

data class InsertMediaAudio(
    val sourceUri: Uri,
    val sourceDurationSeconds: Double,
    val timeOffsetSeconds: Double,
    val durationSeconds: Double,
    val volume: Float,
    val muted: Boolean,
    val unmuted: Boolean,
    val looping: Boolean,
    val audioBlockCountBeforeRemoval: Int,
    val audioBlockCountAfterRemoval: Int,
    val removedBlockValid: Boolean,
)

suspend fun insertMediaAudio(
    engine: Engine,
    assetBaseUri: Uri,
): InsertMediaAudio {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(block = page, value = 1920F)
    engine.block.setHeight(block = page, value = 1080F)
    engine.block.setDuration(block = page, duration = 30.0)

    val audioBlock = engine.block.create(DesignBlockType.Audio)
    val audioUri = assetBaseUri
        .buildUpon()
        .appendPath("ly.img.audio")
        .appendPath("audios")
        .appendPath("far_from_home.m4a")
        .build()
    engine.block.setUri(block = audioBlock, property = "audio/fileURI", value = audioUri)
    engine.block.appendChild(parent = page, child = audioBlock)

    engine.block.forceLoadAVResource(block = audioBlock)
    val sourceDuration = engine.block.getAVResourceTotalDuration(block = audioBlock)

    // This sample uses a 30-second page, so clamp the audio block to that timeline.
    val playbackDuration = sourceDuration.coerceAtMost(30.0)
    engine.block.setTimeOffset(block = audioBlock, offset = 0.0)
    engine.block.setDuration(block = audioBlock, duration = playbackDuration)

    val timeOffset = engine.block.getTimeOffset(block = audioBlock)
    val duration = engine.block.getDuration(block = audioBlock)

    engine.block.setVolume(block = audioBlock, volume = 0.8F)
    val currentVolume = engine.block.getVolume(block = audioBlock)
    Log.i(TAG, "Audio volume: ${(currentVolume * 100).toInt()}%")

    engine.block.setMuted(block = audioBlock, muted = true)
    val muted = engine.block.isMuted(block = audioBlock)

    engine.block.setMuted(block = audioBlock, muted = false)
    val unmuted = !engine.block.isMuted(block = audioBlock)

    engine.block.setLooping(block = audioBlock, looping = true)
    val looping = engine.block.isLooping(block = audioBlock)

    val audioBlocks = engine.block.findByType(DesignBlockType.Audio)
    audioBlocks.forEach { block ->
        val uri = engine.block.getUri(block = block, property = "audio/fileURI")
        val offset = engine.block.getTimeOffset(block = block)
        val blockDuration = engine.block.getDuration(block = block)
        val blockVolume = engine.block.getVolume(block = block)
        Log.i(TAG, "Audio starts at ${offset}s for ${blockDuration}s at ${(blockVolume * 100).toInt()}%: $uri")
    }

    engine.block.destroy(block = audioBlock)
    val removedBlockValid = engine.block.isValid(block = audioBlock)
    val remainingAudioBlocks = engine.block.findByType(DesignBlockType.Audio)

    check(abs(timeOffset - 0.0) < 0.001)
    check(duration > 0.0)
    check(duration <= 30.0)
    check(abs(currentVolume - 0.8F) < 0.001F)
    check(muted)
    check(unmuted)
    check(looping)
    check(audioBlock in audioBlocks)
    check(!removedBlockValid)
    check(audioBlock !in remainingAudioBlocks)

    return InsertMediaAudio(
        sourceUri = audioUri,
        sourceDurationSeconds = sourceDuration,
        timeOffsetSeconds = timeOffset,
        durationSeconds = duration,
        volume = currentVolume,
        muted = muted,
        unmuted = unmuted,
        looping = looping,
        audioBlockCountBeforeRemoval = audioBlocks.size,
        audioBlockCountAfterRemoval = remainingAudioBlocks.size,
        removedBlockValid = removedBlockValid,
    )
}
```

Add audio files to video scenes with CE.SDK audio blocks for background music,
sound effects, and voiceovers.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260808/engine-guides-insert-media-audio)

<EngineReferenceNote {...props} />

Audio blocks are time-based blocks that play sound alongside the rest of a scene. They have no visual canvas representation; they live on the timeline with their own duration, offset, and volume controls, independent of video fills attached to graphic blocks.

This guide covers creating audio blocks, configuring their time-based properties, controlling playback, and managing audio blocks in a scene.

For broader audio workflows, see the [Create and Edit Audio overview](../create-audio/audio.md). For catalog-based music selection and multiple background tracks, continue with [Add Music](../create-audio/audio/add-music.md).

## Insert an Audio File

Create an audio block with `DesignBlockType.Audio`, build or parse a `Uri` for the audio source, then set it with `setUri(block=_, property="audio/fileURI", value=_)` and append the block to a page. Audio blocks must be children of a page to participate in the timeline.

```kotlin highlight-android-create-audio-block
val audioBlock = engine.block.create(DesignBlockType.Audio)
val audioUri = assetBaseUri
    .buildUpon()
    .appendPath("ly.img.audio")
    .appendPath("audios")
    .appendPath("far_from_home.m4a")
    .build()
engine.block.setUri(block = audioBlock, property = "audio/fileURI", value = audioUri)
engine.block.appendChild(parent = page, child = audioBlock)
```

The sample receives an asset base URI from the app and appends the demo audio path, so the URL stays aligned with the SDK asset package or your self-hosted assets. You can also pass a reachable remote URL or a local URI resolved by your app. Common Android audio sources include M4A, MP3, and WAV files.

## Configuring Time Position

Audio blocks have time-based properties that control when and how long they play. Use `setTimeOffset()` for the start position and `setDuration()` for playback length. Call the suspend `forceLoadAVResource()` API first so CE.SDK can read media metadata such as total duration.

```kotlin highlight-android-configure-timeline
    engine.block.forceLoadAVResource(block = audioBlock)
    val sourceDuration = engine.block.getAVResourceTotalDuration(block = audioBlock)

    // This sample uses a 30-second page, so clamp the audio block to that timeline.
    val playbackDuration = sourceDuration.coerceAtMost(30.0)
    engine.block.setTimeOffset(block = audioBlock, offset = 0.0)
    engine.block.setDuration(block = audioBlock, duration = playbackDuration)

    val timeOffset = engine.block.getTimeOffset(block = audioBlock)
    val duration = engine.block.getDuration(block = audioBlock)
```

`getAVResourceTotalDuration()` returns the length of the source audio file in seconds. Use it to clamp the playback duration to the available content or to compute timing relative to the file length.

## Adjusting Volume

Set the audio level with `setVolume()`. Volume is a `Float` between `0.0` for silent playback and `1.0` for full volume, and it applies to both preview playback and exported video output.

```kotlin highlight-android-adjust-volume
engine.block.setVolume(block = audioBlock, volume = 0.8F)
val currentVolume = engine.block.getVolume(block = audioBlock)
Log.i(TAG, "Audio volume: ${(currentVolume * 100).toInt()}%")
```

Read the current level back with `getVolume()`. For a deeper look at mixing and force-mute behavior, see [Adjust Audio Volume](../create-audio/audio/adjust-volume.md).

## Muting Audio

To silence a block without changing its configured volume, use `setMuted()`. Muting preserves the volume value so you can restore the previous level by setting `muted` back to `false`.

```kotlin highlight-android-mute-audio
    engine.block.setMuted(block = audioBlock, muted = true)
    val muted = engine.block.isMuted(block = audioBlock)

    engine.block.setMuted(block = audioBlock, muted = false)
    val unmuted = !engine.block.isMuted(block = audioBlock)
```

Read the current state with `isMuted()`.

## Looping Audio

Enable continuous playback with `setLooping()`. When looping is enabled, the source repeats until the end of the block's timeline duration is reached.

```kotlin highlight-android-loop-audio
engine.block.setLooping(block = audioBlock, looping = true)
val looping = engine.block.isLooping(block = audioBlock)
```

Read the current state with `isLooping()`.

## Finding Audio Blocks

Use `findByType(DesignBlockType.Audio)` to retrieve every audio block in the scene. This is useful for building audio management interfaces or for batch operations such as adjusting levels across all tracks at once.

```kotlin highlight-android-find-audio-blocks
val audioBlocks = engine.block.findByType(DesignBlockType.Audio)
audioBlocks.forEach { block ->
    val uri = engine.block.getUri(block = block, property = "audio/fileURI")
    val offset = engine.block.getTimeOffset(block = block)
    val blockDuration = engine.block.getDuration(block = block)
    val blockVolume = engine.block.getVolume(block = block)
    Log.i(TAG, "Audio starts at ${offset}s for ${blockDuration}s at ${(blockVolume * 100).toInt()}%: $uri")
}
```

For each block, read the source URI with `getUri(block=_, property="audio/fileURI")` and the timeline properties with `getTimeOffset()`, `getDuration()`, and `getVolume()`.

## Removing Audio

Call `destroy()` to remove a block from the scene and free its resources. Destroying a block automatically detaches it from its parent and makes the block handle invalid.

```kotlin highlight-android-remove-audio
engine.block.destroy(block = audioBlock)
val removedBlockValid = engine.block.isValid(block = audioBlock)
val remainingAudioBlocks = engine.block.findByType(DesignBlockType.Audio)
```

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.create(blockType=DesignBlockType.Audio)` | Block | Create a new audio block |
| `assetBaseUri.buildUpon()` | Android | Build a URI for the audio source |
| `engine.block.setUri(block=_, property="audio/fileURI", value=_)` | Block | Set the audio source file |
| `engine.block.getUri(block=_, property="audio/fileURI")` | Block | Get the audio source file |
| `engine.block.appendChild(parent=_, child=_)` | Block | Add audio to a page |
| `engine.block.forceLoadAVResource(block=_)` | Block | Load audio metadata |
| `engine.block.getAVResourceTotalDuration(block=_)` | Block | Get total audio file duration in seconds |
| `engine.block.setTimeOffset(block=_, offset=_)` | Block | Set timeline start position |
| `engine.block.getTimeOffset(block=_)` | Block | Get timeline start position |
| `engine.block.setDuration(block=_, duration=_)` | Block | Set playback duration |
| `engine.block.getDuration(block=_)` | Block | Get playback duration |
| `engine.block.setVolume(block=_, volume=_)` | Block | Set volume from `0.0` to `1.0` |
| `engine.block.getVolume(block=_)` | Block | Get current volume |
| `engine.block.setMuted(block=_, muted=_)` | Block | Mute or unmute audio |
| `engine.block.isMuted(block=_)` | Block | Check if audio is muted |
| `engine.block.setLooping(block=_, looping=_)` | Block | Enable or disable looping |
| `engine.block.isLooping(block=_)` | Block | Check if looping is enabled |
| `engine.block.findByType(type=DesignBlockType.Audio)` | Block | Find all audio blocks |
| `engine.block.destroy(block=_)` | Block | Remove an audio block |
| `engine.block.isValid(block=_)` | Block | Check whether a block handle is still valid |

## Next Steps

- [Adjust Audio Volume](../create-audio/audio/adjust-volume.md) — Fine-tune audio levels and balance multiple sources
- [Loop Audio](../create-audio/audio/loop.md) — Repeat a source for the duration of its audio block
- [Add Sound Effects](../create-audio/audio/add-sound-effects.md) — Generate procedural sound effects from PCM-backed audio buffers
- [Add Music](../create-audio/audio/add-music.md) — Add background music tracks to video projects
- [Export Overview](../export-save-publish/export/overview.md) — Export scenes with audio to MP4



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support