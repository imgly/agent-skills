> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Audio](./audio.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-audio-audio/Audio.kt reference-only
import android.net.Uri
import android.util.Log
import kotlinx.coroutines.flow.toList
import ly.img.engine.AudioFromVideoOptions
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import java.io.ByteArrayOutputStream
import kotlin.math.abs

private const val TAG = "AudioGuide"

suspend fun audio(engine: Engine): String {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.setDuration(page, duration = 12.0)

    val audioBlock = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = audioBlock)
    engine.block.setUri(
        block = audioBlock,
        property = "audio/fileURI",
        value = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a"),
    )

    engine.block.forceLoadAVResource(audioBlock)
    val resourceDuration = engine.block.getAVResourceTotalDuration(audioBlock)

    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse("https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-kampus-production-8154913.mp4"),
    )
    engine.block.setFill(videoBlock, fill = videoFill)
    engine.block.appendChild(parent = page, child = videoBlock)

    engine.block.forceLoadAVResource(videoFill)

    val trackCountBeforeExtraction = engine.block.getAudioTrackCountFromVideo(videoFill)
    check(trackCountBeforeExtraction > 0) {
        "Video source must contain an audio track."
    }
    val extractedAudioBlock = engine.block.createAudioFromVideo(
        videoFill = videoFill,
        trackIndex = 0,
        options = AudioFromVideoOptions(
            keepTrimSettings = true,
            muteOriginalVideo = true,
        ),
    )
    engine.block.appendChild(parent = page, child = extractedAudioBlock)

    val allExtractedAudioBlocks = engine.block.createAudiosFromVideo(
        videoFill = videoFill,
        options = AudioFromVideoOptions(
            keepTrimSettings = true,
            muteOriginalVideo = true,
        ),
    )
    allExtractedAudioBlocks.forEach { audio ->
        engine.block.appendChild(parent = page, child = audio)
    }

    val audioTrackCount = engine.block.getAudioTrackCountFromVideo(videoFill)
    Log.i(TAG, "Video has $audioTrackCount audio track(s).")

    engine.block.setPlaybackTime(page, time = 3.0)
    val playbackTime = engine.block.getPlaybackTime(page)

    engine.block.setPlaying(page, enabled = true)
    val playing = engine.block.isPlaying(page)
    engine.block.setPlaying(page, enabled = false)
    val paused = !engine.block.isPlaying(page)

    engine.block.setVolume(audioBlock, volume = 0.7F)
    val volume = engine.block.getVolume(audioBlock)

    engine.block.setMuted(audioBlock, muted = true)
    val muted = engine.block.isMuted(audioBlock)

    engine.block.setPlaybackSpeed(audioBlock, speed = 1.25F)
    val playbackSpeed = engine.block.getPlaybackSpeed(audioBlock)

    engine.block.setSoloPlaybackEnabled(audioBlock, enabled = true)
    val soloPlaybackEnabled = engine.block.isSoloPlaybackEnabled(audioBlock)
    engine.block.setSoloPlaybackEnabled(audioBlock, enabled = false)
    val soloPlaybackDisabled = !engine.block.isSoloPlaybackEnabled(audioBlock)

    engine.block.setPlaybackSpeed(audioBlock, speed = 1.0F)
    engine.block.setTimeOffset(audioBlock, offset = 2.0)
    val timeOffset = engine.block.getTimeOffset(audioBlock)

    engine.block.setDuration(audioBlock, duration = 8.0)

    engine.block.setTrimOffset(audioBlock, offset = 1.0)
    val trimOffset = engine.block.getTrimOffset(audioBlock)

    engine.block.setLooping(audioBlock, looping = true)
    val looping = engine.block.isLooping(audioBlock)

    engine.block.setTrimLength(audioBlock, length = 6.0)
    val trimLength = engine.block.getTrimLength(audioBlock)

    val blockDuration = engine.block.getDuration(audioBlock)

    val waveformChunks = engine.block.generateAudioThumbnailSequence(
        block = audioBlock,
        samplesPerChunk = 4,
        timeBegin = 0.0,
        timeEnd = 4.0,
        numberOfSamples = 16,
        numberOfChannels = 1,
    ).toList()

    val waveformSampleCount = waveformChunks.sumOf { chunk -> chunk.samples.size }

    val transientAudioResources = engine.editor.findAllTransientResources()
    transientAudioResources.forEach { (transientUri, _) ->
        val resourceBytes = ByteArrayOutputStream()
        engine.editor.getResourceData(
            uri = transientUri,
            chunkSize = 64 * 1024,
        ) { chunk ->
            val copy = chunk.duplicate()
            val bytes = ByteArray(copy.remaining())
            copy.get(bytes)
            resourceBytes.write(bytes)
            true
        }

        val permanentUri = uploadTransientAudioResource(
            sourceUri = transientUri,
            data = resourceBytes.toByteArray(),
        )
        engine.editor.relocateResource(
            currentUri = transientUri,
            relocatedUri = permanentUri,
        )
    }

    val remainingTransientAudioResources = engine.editor.findAllTransientResources()
    val savedScene = engine.scene.saveToString(
        scene = scene,
        allowedResourceSchemes = listOf("http", "https"),
    )

    check(audioBlock != extractedAudioBlock)
    check(audioTrackCount > 0)
    check(allExtractedAudioBlocks.size == audioTrackCount)
    check(abs(playbackTime - 3.0) < 0.001)
    check(playing)
    check(paused)
    check(abs(volume - 0.7F) < 0.001F)
    check(muted)
    check(abs(playbackSpeed - 1.25F) < 0.001F)
    check(soloPlaybackEnabled)
    check(soloPlaybackDisabled)
    check(abs(timeOffset - 2.0) < 0.001)
    check(abs(blockDuration - 8.0) < 0.001)
    check(abs(trimOffset - 1.0) < 0.001)
    check(abs(trimLength - 6.0) < 0.001)
    check(looping)
    check(resourceDuration > 0.0)
    check(waveformChunks.isNotEmpty())
    check(waveformSampleCount > 0)
    check(transientAudioResources.isNotEmpty())
    check(remainingTransientAudioResources.isEmpty())
    check(savedScene.isNotBlank())

    return savedScene
}

private fun uploadTransientAudioResource(
    sourceUri: Uri,
    data: ByteArray,
): Uri {
    check(data.isNotEmpty()) { "Cannot persist an empty audio resource." }

    // Replace this with your app's storage client and return its permanent URI.
    // Transient buffer URIs do not carry stable file names, so the app owns the storage key.
    val sourceId = sourceUri.toString().hashCode().toString(radix = 16)
    val fileName = "extracted-audio-$sourceId-${data.size}.m4a"
    return Uri.parse("https://your-storage.example/audio/$fileName")
}
```

Add audio to video scenes, extract audio from video fills, control playback,
and generate waveform data with CE.SDK for Android.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260822/engine-guides-create-audio-audio)

<EngineReferenceNote {...props} />

Audio blocks let you add background music, voice-overs, sound effects, and other standalone audio to video scenes. CE.SDK also exposes video audio track counts, playback controls, trim controls, and waveform generation through the Engine block API.

Playback examples require an Engine instance created with `AudioContext.AUTO`, which is the default. Engines created with `AudioContext.NONE` can still edit and export scenes, but they do not play audio.

## Use Cases

Use CE.SDK audio APIs when you need to add or manage:

- Background music
- Voice-overs
- Sound effects
- Podcast or narration tracks

## How Audio Works in CE.SDK

CE.SDK represents standalone audio as `DesignBlockType.Audio` blocks. Audio blocks are attached to a page, reference their media through `audio/fileURI`, and use the same timeline properties as other time-based blocks.

Each audio block can have:

- A source URI for standalone audio files
- Playback properties such as volume, mute state, playback time, and speed
- Timeline properties such as offset, duration, trim offset, and trim length
- Waveform sample data for custom timeline UIs

Extraction APIs create separate audio blocks from video fill tracks instead of changing an existing audio block's source.

### What Are the Time-Based Properties

Audio timing is expressed in seconds:

- **Offset**: when the audio block starts relative to its parent.
- **Duration**: how long the block stays active on the timeline.
- **Trim offset**: where playback starts inside the source audio.
- **Trim length**: how much of the source audio is used before it loops or stops. Use the looping APIs to choose that behavior.

### What Are Waveforms

Waveforms are sampled audio amplitudes that you can render in a custom UI. On Android, `generateAudioThumbnailSequence()` returns a `Flow` of `AudioThumbnailResult` chunks. Each chunk contains normalized samples in the range from 0 to 1. Stereo requests interleave left and right samples.

### When to Create vs. Extract Audio

Create an audio block when the source is an external audio file such as background music or a voice-over. Extract audio when the sound already exists inside a video fill and you need a separate audio block for editing, trimming, or muting the original video.

## Examples

The snippets below use a video scene with an existing page. Audio APIs run on the main thread through the same Engine instance as the rest of your scene edits.

### Create Audio

Create a standalone audio block, attach it to the page, set its source URI, and load the resource before reading media metadata.

```kotlin highlight-android-create-audio
    val audioBlock = engine.block.create(DesignBlockType.Audio)
    engine.block.appendChild(parent = page, child = audioBlock)
    engine.block.setUri(
        block = audioBlock,
        property = "audio/fileURI",
        value = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a"),
    )

    engine.block.forceLoadAVResource(audioBlock)
    val resourceDuration = engine.block.getAVResourceTotalDuration(audioBlock)
```

### Extract or Count Video Audio

Create a video fill and wait for the suspend `forceLoadAVResource()` API to complete before extracting or counting video audio. The tabs below use this loaded `videoFill`.

```kotlin highlight-android-video-fill-setup
    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = Uri.parse("https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-kampus-production-8154913.mp4"),
    )
    engine.block.setFill(videoBlock, fill = videoFill)
    engine.block.appendChild(parent = page, child = videoBlock)

    engine.block.forceLoadAVResource(videoFill)
```

<Tabs>
  <TabItem label="Extract Audio From Video">
    Check that the loaded source contains audio, and extract the first track into a new audio block. `AudioFromVideoOptions` keeps the trim settings and mutes the source video fill.

    ```kotlin highlight-android-extract-audio
    val trackCountBeforeExtraction = engine.block.getAudioTrackCountFromVideo(videoFill)
    check(trackCountBeforeExtraction > 0) {
        "Video source must contain an audio track."
    }
    val extractedAudioBlock = engine.block.createAudioFromVideo(
        videoFill = videoFill,
        trackIndex = 0,
        options = AudioFromVideoOptions(
            keepTrimSettings = true,
            muteOriginalVideo = true,
        ),
    )
    engine.block.appendChild(parent = page, child = extractedAudioBlock)
    ```
  </TabItem>

  <TabItem label="Extract All Tracks">
    Use `createAudiosFromVideo()` when the source may contain multiple audio tracks and each track should become its own audio block.

    ```kotlin highlight-android-extract-all-audio
    val allExtractedAudioBlocks = engine.block.createAudiosFromVideo(
        videoFill = videoFill,
        options = AudioFromVideoOptions(
            keepTrimSettings = true,
            muteOriginalVideo = true,
        ),
    )
    allExtractedAudioBlocks.forEach { audio ->
        engine.block.appendChild(parent = page, child = audio)
    }
    ```
  </TabItem>

  <TabItem label="Count Tracks">
    Use `getAudioTrackCountFromVideo()` before extraction when your loaded source may be silent or contain multiple audio tracks.
    When your app needs to choose a track by metadata, call `getAudioInfoFromVideo()` after the same load step to read each track's `AudioTrackInfo`, including audio codec, channel count, sample rate, audio duration, packet and frame counts, track name, container track index, and ISO 639-2T language. Pass the returned list position to `createAudioFromVideo(trackIndex=...)`; this parameter is the zero-based audio-track ordinal. Do not pass `AudioTrackInfo.trackIndex` directly, because that value is the original container track index and may not match the list position.

    

    ```kotlin highlight-android-track-info
    val audioTrackCount = engine.block.getAudioTrackCountFromVideo(videoFill)
    Log.i(TAG, "Video has $audioTrackCount audio track(s).")
    ```
  </TabItem>
</Tabs>

### Control Audio Playback

Playback time and play or pause state are usually controlled on the page so all time-based blocks stay synchronized. Volume, mute state, and playback speed are set on the audio block itself.

```kotlin highlight-android-playback-control
    engine.block.setPlaybackTime(page, time = 3.0)
    val playbackTime = engine.block.getPlaybackTime(page)

    engine.block.setPlaying(page, enabled = true)
    val playing = engine.block.isPlaying(page)
    engine.block.setPlaying(page, enabled = false)
    val paused = !engine.block.isPlaying(page)

    engine.block.setVolume(audioBlock, volume = 0.7F)
    val volume = engine.block.getVolume(audioBlock)

    engine.block.setMuted(audioBlock, muted = true)
    val muted = engine.block.isMuted(audioBlock)

    engine.block.setPlaybackSpeed(audioBlock, speed = 1.25F)
    val playbackSpeed = engine.block.getPlaybackSpeed(audioBlock)

    engine.block.setSoloPlaybackEnabled(audioBlock, enabled = true)
    val soloPlaybackEnabled = engine.block.isSoloPlaybackEnabled(audioBlock)
    engine.block.setSoloPlaybackEnabled(audioBlock, enabled = false)
    val soloPlaybackDisabled = !engine.block.isSoloPlaybackEnabled(audioBlock)
```

Audio speed supports values from 0.25 to 3.0 for audio blocks. Changing speed also changes how long the block takes on the timeline.

### Manage Audio Timing

Use offset and duration to place the audio block on the scene timeline. Use trim offset and trim length to choose which part of the source file plays, and set looping when the trimmed source should repeat while the block remains active.

```kotlin highlight-android-timing
    engine.block.setPlaybackSpeed(audioBlock, speed = 1.0F)
    engine.block.setTimeOffset(audioBlock, offset = 2.0)
    val timeOffset = engine.block.getTimeOffset(audioBlock)

    engine.block.setDuration(audioBlock, duration = 8.0)

    engine.block.setTrimOffset(audioBlock, offset = 1.0)
    val trimOffset = engine.block.getTrimOffset(audioBlock)

    engine.block.setLooping(audioBlock, looping = true)
    val looping = engine.block.isLooping(audioBlock)

    engine.block.setTrimLength(audioBlock, length = 6.0)
    val trimLength = engine.block.getTrimLength(audioBlock)

    val blockDuration = engine.block.getDuration(audioBlock)
```

Load the audio resource before trimming so CE.SDK can read the source duration and metadata.

### Generate Audio Thumbnails

Waveform generation emits a `Flow` of chunks. Choose `samplesPerChunk`, a time range, the total number of samples, and the number of channels you want to render.

```kotlin highlight-android-waveform
    val waveformChunks = engine.block.generateAudioThumbnailSequence(
        block = audioBlock,
        samplesPerChunk = 4,
        timeBegin = 0.0,
        timeEnd = 4.0,
        numberOfSamples = 16,
        numberOfChannels = 1,
    ).toList()

    val waveformSampleCount = waveformChunks.sumOf { chunk -> chunk.samples.size }
```

Render the returned sample values in your own timeline or waveform component.

### Save Audio Scenes

The current Android binding does not expose an audio-only export method. Persist audio edits by saving the scene, or export a video page with audio through the video export APIs when you need an MP4 result.

Extracted audio can reference a transient `buffer://` resource. Before calling `saveToString()`, read each transient resource, store it with your app's storage client, then call `relocateResource()` so the scene contains durable URIs only. The default `allowedResourceSchemes` list is `blob`, `bundle`, `file`, `http`, and `https`; `buffer://` is always transient. The sample narrows the list to `http` and `https`, so saving fails if any extracted `buffer://` resource or local `blob`, `bundle`, or `file` resource remains instead of being relocated.

```kotlin highlight-android-save-scene
    val transientAudioResources = engine.editor.findAllTransientResources()
    transientAudioResources.forEach { (transientUri, _) ->
        val resourceBytes = ByteArrayOutputStream()
        engine.editor.getResourceData(
            uri = transientUri,
            chunkSize = 64 * 1024,
        ) { chunk ->
            val copy = chunk.duplicate()
            val bytes = ByteArray(copy.remaining())
            copy.get(bytes)
            resourceBytes.write(bytes)
            true
        }

        val permanentUri = uploadTransientAudioResource(
            sourceUri = transientUri,
            data = resourceBytes.toByteArray(),
        )
        engine.editor.relocateResource(
            currentUri = transientUri,
            relocatedUri = permanentUri,
        )
    }

    val remainingTransientAudioResources = engine.editor.findAllTransientResources()
    val savedScene = engine.scene.saveToString(
        scene = scene,
        allowedResourceSchemes = listOf("http", "https"),
    )
```

The upload helper represents your app storage layer. Replace it with a real upload or local persistence implementation that returns a URI your app can load later.

```kotlin highlight-android-upload-helper
private fun uploadTransientAudioResource(
    sourceUri: Uri,
    data: ByteArray,
): Uri {
    check(data.isNotEmpty()) { "Cannot persist an empty audio resource." }

    // Replace this with your app's storage client and return its permanent URI.
    // Transient buffer URIs do not carry stable file names, so the app owns the storage key.
    val sourceId = sourceUri.toString().hashCode().toString(radix = 16)
    val fileName = "extracted-audio-$sourceId-${data.size}.m4a"
    return Uri.parse("https://your-storage.example/audio/$fileName")
}
```

## API Reference

The table below lists the Android APIs used in the examples above.

| Category | API | Purpose |
| --- | --- | --- |
| Engine audio context | `Engine.getInstance(id=_, audioContext=AudioContext.AUTO)` | Create an Engine instance that can play audio |
| Create blocks | `engine.block.create(blockType=DesignBlockType.Audio)` | Create a standalone audio block |
| Create blocks | `engine.block.create(blockType=DesignBlockType.Graphic)` | Create a block that can display the video fill |
| Create blocks | `engine.block.createShape(type=_)` | Create the video block shape |
| Create blocks | `engine.block.createFill(fillType=_)` | Create a video fill for extraction |
| Scene hierarchy | `engine.block.appendChild(parent=_, child=_)` | Attach audio, video, or extracted blocks to the scene hierarchy |
| Assign sources | `engine.block.setUri(block=_, property="audio/fileURI", value=_)` | Attach an audio file URI to an audio block |
| Assign sources | `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)` | Attach a video file URI to a video fill |
| Video fill setup | `engine.block.setShape(block=_, shape=_)` | Assign a shape to the video block |
| Video fill setup | `engine.block.setFill(block=_, fill=_)` | Assign the loaded video fill to the video block |
| Extract video audio | `engine.block.createAudioFromVideo(videoFill=_, trackIndex=_, options=_)` | Extract one audio track by zero-based audio-track ordinal from a video fill |
| Extract video audio | `engine.block.createAudiosFromVideo(videoFill=_, options=_)` | Extract every audio track from a video fill |
| Count video audio | `engine.block.getAudioTrackCountFromVideo(videoFill=_)` | Count audio tracks in a video fill |
| Inspect video audio | `engine.block.getAudioInfoFromVideo(videoFill=_)` | Read `AudioTrackInfo` metadata; use the returned list position for extraction because `AudioTrackInfo.trackIndex` is the container track index |
| Playback | `engine.block.setPlaying(block=_, enabled=_)` | Start or stop playback for a page or playable block |
| Playback | `engine.block.isPlaying(block=_)` | Read the current play or pause state |
| Playback | `engine.block.supportsPlaybackControl(block=_)` | Check whether playback control APIs are supported for a block |
| Playback | `engine.block.setPlaybackTime(block=_, time=_)` | Move playback to a timeline position |
| Playback | `engine.block.getPlaybackTime(block=_)` | Read the current playback time |
| Playback | `engine.block.supportsPlaybackTime(block=_)` | Check whether a block exposes a playback time cursor |
| Playback | `engine.block.setVolume(block=_, volume=_)` | Set volume from 0.0 to 1.0 |
| Playback | `engine.block.getVolume(block=_)` | Read the current volume |
| Playback | `engine.block.setMuted(block=_, muted=_)` | Mute or unmute audio |
| Playback | `engine.block.isMuted(block=_)` | Read whether audio is muted |
| Playback | `engine.block.setPlaybackSpeed(block=_, speed=_)` | Set audio speed from 0.25x to 3.0x |
| Playback | `engine.block.getPlaybackSpeed(block=_)` | Read the current playback speed |
| Playback | `engine.block.setSoloPlaybackEnabled(block=_, enabled=_)` | Preview one block while the rest of the scene stays paused |
| Playback | `engine.block.isSoloPlaybackEnabled(block=_)` | Read whether solo playback is enabled for a block |
| Timing | `engine.block.supportsTimeOffset(block=_)` | Check whether a block can be positioned on its parent's timeline |
| Timing | `engine.block.setTimeOffset(block=_, offset=_)` | Move the audio block on the timeline |
| Timing | `engine.block.getTimeOffset(block=_)` | Read where the audio block starts on the timeline |
| Timing | `engine.block.supportsDuration(block=_)` | Check whether a block exposes an active timeline duration |
| Timing | `engine.block.setDuration(block=_, duration=_)` | Set the active block duration |
| Timing | `engine.block.getDuration(block=_)` | Read the active block duration |
| Timing | `engine.block.supportsTrim(block=_)` | Check whether a block or fill exposes trim controls |
| Timing | `engine.block.setTrimOffset(block=_, offset=_)` | Start inside the source audio |
| Timing | `engine.block.getTrimOffset(block=_)` | Read the source trim start |
| Timing | `engine.block.setTrimLength(block=_, length=_)` | Limit the source range used for playback |
| Timing | `engine.block.getTrimLength(block=_)` | Read the source trim length |
| Timing | `engine.block.setLooping(block=_, looping=_)` | Loop the trimmed source while the block is active |
| Timing | `engine.block.isLooping(block=_)` | Read whether the source loops or stops |
| Resources | `engine.block.forceLoadAVResource(block=_)` | Load audio or video metadata before querying it |
| Resources | `engine.block.getAVResourceTotalDuration(block=_)` | Read the loaded audio or video source duration |
| Waveforms | `engine.block.generateAudioThumbnailSequence(block=_, samplesPerChunk=_, timeBegin=_, timeEnd=_, numberOfSamples=_, numberOfChannels=_)` | Generate waveform sample chunks |
| Persistence | `engine.editor.findAllTransientResources()` | Find extracted `buffer://` resources that must be persisted before saving |
| Persistence | `engine.editor.getResourceData(uri=_, chunkSize=_, onData=_)` | Read transient resource bytes for app storage |
| Persistence | `engine.editor.relocateResource(currentUri=_, relocatedUri=_)` | Replace a transient URI with a durable URI |
| Persistence | `engine.scene.saveToString(scene=_, allowedResourceSchemes=_)` | Serialize only scenes whose resources use allowed durable schemes |

## Next Steps

- [CE.SDK API Reference](https://img.ly/docs/cesdk/android/api-reference/overview-8f24e1/) - Review the full API surface.
- [Add Music](./audio/add-music.md) — Add background music and audio tracks to video projects using CE.SDK's audio block system.
- [Adjust Audio Volume](./audio/adjust-volume.md) — Learn how to adjust audio volume in CE.SDK to control playback levels, mute audio, and balance multiple audio sources in video projects.
- [Loop Audio](./audio/loop.md) — Create seamless repeating audio playback for background music and sound effects using CE.SDK's audio looping system.
- [Adjust Audio Playback Speed](./audio/adjust-speed.md) - Learn how to adjust audio playback speed in CE.SDK to create slow-motion, time-stretched, and fast-forward audio effects.



---

## Related Pages

- [Add Sound Effects](./audio/add-sound-effects.md) - Learn how to use buffers with arbitrary data to generate sound effects programmatically.
- [Add Music](./audio/add-music.md) - Add background music and audio tracks to Android video scenes using CE.SDK audio blocks.
- [Record Voiceover](./audio/record-voiceover.md) - Let users record voiceover clips directly in the Android editor UI.
- [Adjust Audio Volume](./audio/adjust-volume.md) - Learn how to adjust audio volume in CE.SDK for Android to control playback levels, mute audio, and balance multiple audio sources in video projects.
- [Fade Audio In and Out](./audio/fade.md) - Learn how to fade audio in and out in CE.SDK for Android, choose an easing curve, read the fade configuration back, and fade the audio of a video fill.
- [Adjust Audio Playback Speed](./audio/adjust-speed.md) - Control audio playback speed from quarter-speed (0.25x) to triple-speed (3.0x) using the CE.SDK Android Engine API.
- [Loop Audio](./audio/loop.md) - Control audio looping behavior programmatically using CE.SDK's Android Engine API for audio processing and automated content workflows.


---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support