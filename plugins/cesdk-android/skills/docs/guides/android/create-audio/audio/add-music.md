> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Add Music](./add-music.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-audio-add-music/AddMusic.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FindAssetsQuery
import kotlin.math.abs

data class AddMusic(
    val pageWidth: Float,
    val pageHeight: Float,
    val pageDurationSeconds: Double,
    val musicUri: Uri,
    val timeOffsetSeconds: Double,
    val durationSeconds: Double,
    val computedMusicDurationSeconds: Double,
    val volume: Float,
    val availableAssetCount: Int,
    val secondTrackUri: Uri,
    val secondTrackTimeOffsetSeconds: Double,
    val secondTrackDurationSeconds: Double,
    val secondTrackVolume: Float,
    val audioBlockCountAfterCleanup: Int,
)

suspend fun addMusic(engine: Engine): AddMusic {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1920F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.setDuration(page, duration = 30.0)

    val music = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = music)

    val musicUri = Uri.parse("https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a")
    engine.block.setString(block = music, property = "audio/fileURI", value = musicUri.toString())

    check(engine.block.getString(block = music, property = "audio/fileURI") == musicUri.toString())

    engine.block.forceLoadAVResource(block = music)
    val sourceDuration = engine.block.getAVResourceTotalDuration(block = music)
    val musicDuration = minOf(sourceDuration, 30.0)

    engine.block.setTimeOffset(block = music, offset = 0.0)
    engine.block.setDuration(block = music, duration = musicDuration)

    engine.block.setVolume(block = music, volume = 0.8F)
    val musicVolume = engine.block.getVolume(block = music)

    check(abs(musicVolume - 0.8F) < 0.001F)

    val audioSourceId = "ly.img.audio"
    val demoAssetsBaseUri = Uri.parse("https://cdn.img.ly/assets/demo/v3")
    if (audioSourceId !in engine.asset.findAllSources()) {
        engine.asset.addLocalSourceFromJSON(
            contentUri = demoAssetsBaseUri.buildUpon()
                .appendPath(audioSourceId)
                .appendPath("content.json")
                .build(),
        )
    }

    val audioAssets = engine.asset.findAssets(
        sourceId = audioSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    val secondAudioAsset = audioAssets.assets.first { it.id.endsWith("dance_harder") }
    val secondAudioUri = Uri.parse(requireNotNull(secondAudioAsset.meta?.get("uri")))

    val secondAudio = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = secondAudio)
    engine.block.setString(block = secondAudio, property = "audio/fileURI", value = secondAudioUri.toString())

    engine.block.forceLoadAVResource(block = secondAudio)
    val secondAudioDuration = engine.block.getAVResourceTotalDuration(block = secondAudio)

    // Start the secondary track inside the 30-second page so it is audible in this Android sample.
    engine.block.setTimeOffset(block = secondAudio, offset = 10.0)
    val secondAudioTimeOffset = engine.block.getTimeOffset(secondAudio)
    engine.block.setDuration(block = secondAudio, duration = minOf(secondAudioDuration, 15.0))
    val secondAudioPlaybackDuration = engine.block.getDuration(secondAudio)
    engine.block.setVolume(block = secondAudio, volume = 0.5F)
    val secondAudioVolume = engine.block.getVolume(secondAudio)

    val audioBlocks = engine.block.findByType(DesignBlockType.Audio)
    audioBlocks.forEach { audioBlock ->
        println(
            "Audio starts at ${engine.block.getTimeOffset(audioBlock)}s " +
                "with volume ${engine.block.getVolume(audioBlock)}",
        )
    }

    engine.block.destroy(secondAudio)
    val remainingAudioBlocks = engine.block.findByType(DesignBlockType.Audio)

    check(music in remainingAudioBlocks)
    check(secondAudio !in remainingAudioBlocks)

    return AddMusic(
        pageWidth = engine.block.getWidth(page),
        pageHeight = engine.block.getHeight(page),
        pageDurationSeconds = engine.block.getDuration(page),
        musicUri = musicUri,
        timeOffsetSeconds = engine.block.getTimeOffset(music),
        durationSeconds = engine.block.getDuration(music),
        computedMusicDurationSeconds = musicDuration,
        volume = musicVolume,
        availableAssetCount = audioAssets.total,
        secondTrackUri = secondAudioUri,
        secondTrackTimeOffsetSeconds = secondAudioTimeOffset,
        secondTrackDurationSeconds = secondAudioPlaybackDuration,
        secondTrackVolume = secondAudioVolume,
        audioBlockCountAfterCleanup = remainingAudioBlocks.size,
    )
}
```

Add background music and audio tracks to video projects using CE.SDK audio
blocks.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260906/engine-guides-create-audio-add-music)

<EngineReferenceNote {...props} />

Audio blocks are standalone time-based blocks that play alongside video content, independent of video fills. You can set an audio source URI, position the block in the timeline, configure volume, query audio assets, and layer multiple audio blocks in the same video scene.

This guide focuses on the Android Engine API. It assumes you already have an `Engine` instance and want to add music to an existing or newly created video scene.

For a shorter URI-to-block introduction, see [Insert Audio](../../insert-media/audio.md). Continue here for an end-to-end music workflow that also covers asset queries and multiple tracks.

## Creating a Video Scene

Create a video scene with a page that owns the timeline. The page duration defines the composition length that audio blocks play within.

```kotlin highlight-android-create-scene
val scene = engine.scene.createForVideo()
val page = engine.block.create(DesignBlockType.Page)
engine.block.appendChild(parent = scene, child = page)
engine.block.setWidth(page, value = 1920F)
engine.block.setHeight(page, value = 1080F)
engine.block.setDuration(page, duration = 30.0)
```

Audio blocks must be children of a page. Set a page duration before adding audio so the timeline has a clear playback range.

## Programmatic Audio Creation

### Create Audio Block

Create an audio block with `DesignBlockType.Audio`, append it to the page, and assign the source file URI through the `audio/fileURI` property.

```kotlin highlight-android-create-audio-block
    val music = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = music)

    val musicUri = Uri.parse("https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a")
    engine.block.setString(block = music, property = "audio/fileURI", value = musicUri.toString())
```

Audio blocks support common audio formats including M4A, MP3, and WAV. The source URI can point to a network resource or a URI your app can resolve.

### Configure Time Position

Load the audio resource before reading its metadata. Then set the block's time offset and duration in seconds.

```kotlin highlight-android-configure-timeline
    engine.block.forceLoadAVResource(block = music)
    val sourceDuration = engine.block.getAVResourceTotalDuration(block = music)
    val musicDuration = minOf(sourceDuration, 30.0)

    engine.block.setTimeOffset(block = music, offset = 0.0)
    engine.block.setDuration(block = music, duration = musicDuration)
```

`setTimeOffset()` controls when the music starts relative to the page timeline. `setDuration()` controls how long the block remains active during playback.

### Configure Volume

Set volume on the audio block with a value from 0.0 for silent playback to 1.0 for full volume.

```kotlin highlight-android-configure-volume
engine.block.setVolume(block = music, volume = 0.8F)
val musicVolume = engine.block.getVolume(block = music)
```

Volume changes affect preview and export. Use lower values for background music when other audio remains important.

## Working with Audio Assets

### Query Audio Assets

Use the Asset API to query the demo audio source. The sample registers the `ly.img.audio` source with `engine.asset.addLocalSourceFromJSON(...)` before querying it, which is the same source the editor uses for demo music.

```kotlin highlight-android-query-audio-assets
    val audioSourceId = "ly.img.audio"
    val demoAssetsBaseUri = Uri.parse("https://cdn.img.ly/assets/demo/v3")
    if (audioSourceId !in engine.asset.findAllSources()) {
        engine.asset.addLocalSourceFromJSON(
            contentUri = demoAssetsBaseUri.buildUpon()
                .appendPath(audioSourceId)
                .appendPath("content.json")
                .build(),
        )
    }

    val audioAssets = engine.asset.findAssets(
        sourceId = audioSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    val secondAudioAsset = audioAssets.assets.first { it.id.endsWith("dance_harder") }
    val secondAudioUri = Uri.parse(requireNotNull(secondAudioAsset.meta?.get("uri")))
```

Each asset can carry metadata such as a URI, duration, MIME type, and tags. Use that metadata to build a custom picker or to select music programmatically.

## Add Multiple Music Tracks

Create another audio block for each additional music track. The example selects a second catalog result, attaches it to the existing page, and configures its timing and volume independently.

```kotlin highlight-android-add-second-track
    val secondAudio = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = secondAudio)
    engine.block.setString(block = secondAudio, property = "audio/fileURI", value = secondAudioUri.toString())

    engine.block.forceLoadAVResource(block = secondAudio)
    val secondAudioDuration = engine.block.getAVResourceTotalDuration(block = secondAudio)

    // Start the secondary track inside the 30-second page so it is audible in this Android sample.
    engine.block.setTimeOffset(block = secondAudio, offset = 10.0)
    val secondAudioTimeOffset = engine.block.getTimeOffset(secondAudio)
    engine.block.setDuration(block = secondAudio, duration = minOf(secondAudioDuration, 15.0))
    val secondAudioPlaybackDuration = engine.block.getDuration(secondAudio)
    engine.block.setVolume(block = secondAudio, volume = 0.5F)
    val secondAudioVolume = engine.block.getVolume(secondAudio)
```

Balance multiple tracks by keeping the primary track louder and lowering secondary tracks when they should sit behind it.

## Managing Audio Blocks

### List Audio Blocks

Use `findByType(DesignBlockType.Audio)` to retrieve all audio blocks in the scene.

```kotlin highlight-android-list-audio-blocks
val audioBlocks = engine.block.findByType(DesignBlockType.Audio)
audioBlocks.forEach { audioBlock ->
    println(
        "Audio starts at ${engine.block.getTimeOffset(audioBlock)}s " +
            "with volume ${engine.block.getVolume(audioBlock)}",
    )
}
```

Listing audio blocks is useful for custom timeline controls, validation, or batch changes across a composition.

### Remove Audio

Destroy audio blocks that are no longer part of the composition.

```kotlin highlight-android-remove-audio
engine.block.destroy(secondAudio)
val remainingAudioBlocks = engine.block.findByType(DesignBlockType.Audio)
```

Destroyed blocks are detached from the scene and no longer participate in playback or export.

## Troubleshooting

**No catalog results:** Confirm that `ly.img.audio` is registered and that its `content.json` URI is reachable from the app.

**Selected music does not play:** Verify that the audio block is appended to a page and that the page duration covers the block's time offset and duration.

**Duration is unavailable:** Call `forceLoadAVResource()` before reading `getAVResourceTotalDuration()`.

**Volume sounds wrong after export:** Set volume on each audio block before exporting the page, and keep values in the 0.0 to 1.0 range.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.createForVideo()` | Create a video scene for time-based playback |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create a page for the video scene |
| `engine.block.create(blockType=DesignBlockType.Audio)` | Create a new audio block |
| `engine.block.appendChild(parent=_, child=_)` | Attach a page or audio block to its parent |
| `engine.block.setWidth(block=_, value=_)` | Set the page width |
| `engine.block.getWidth(block=_)` | Read the page width |
| `engine.block.setHeight(block=_, value=_)` | Set the page height |
| `engine.block.getHeight(block=_)` | Read the page height |
| `engine.block.setString(block=_, property="audio/fileURI", value=_)` | Set the audio source URI |
| `engine.block.getString(block=_, property="audio/fileURI")` | Read the audio source URI |
| `engine.block.forceLoadAVResource(block=_)` | `suspend`; load audio metadata before reading duration |
| `engine.block.getAVResourceTotalDuration(block=_)` | Read the source audio duration in seconds |
| `engine.block.setTimeOffset(block=_, offset=_)` | Set when the audio starts on the page timeline |
| `engine.block.getTimeOffset(block=_)` | Read when the audio starts on the page timeline |
| `engine.block.setDuration(block=_, duration=_)` | Set how long the audio block plays |
| `engine.block.getDuration(block=_)` | Read how long a page or audio block plays |
| `engine.block.setVolume(block=_, volume=_)` | Set volume from 0.0 to 1.0 |
| `engine.block.getVolume(block=_)` | Read the current volume |
| `engine.asset.findAllSources()` | List registered asset source IDs |
| `engine.asset.addLocalSourceFromJSON(contentUri=_)` | `suspend`; register an audio asset source from a content JSON file |
| `engine.asset.findAssets(sourceId=_, query=_)` | `suspend`; query audio assets |
| `engine.block.findByType(type=DesignBlockType.Audio)` | Find all audio blocks in the scene |
| `engine.block.destroy(block=_)` | Remove an audio block |

## Next Steps

- [Adjust Audio Volume](./adjust-volume.md) — Learn how to adjust audio volume in CE.SDK to control playback levels, mute audio, and balance multiple audio sources in video projects.
- [Add Sound Effects](./add-sound-effects.md) — Learn how to add custom sound effects using audio buffers and raw PCM data
- [Loop Audio](./loop.md) — Create seamless repeating audio playback for background music and sound effects using CE.SDK's audio looping system.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support