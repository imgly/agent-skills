> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Record Reaction](./record-reaction.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-record-reaction/RecordReaction.kt reference-only
import android.graphics.RectF
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.runtime.Composable
import ly.img.camera.core.CameraLayoutMode
import ly.img.camera.core.CameraMode
import ly.img.camera.core.CameraResult
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.EngineConfiguration
import ly.img.camera.core.Recording
import ly.img.camera.core.Video
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import kotlin.time.DurationUnit

data class ReactionSceneComposition(
    val page: DesignBlock,
    val baseVideoBlock: DesignBlock,
    val reactionTrack: DesignBlock,
    val reactionBlocks: List<DesignBlock>,
    val durationSeconds: Double,
)

private fun handleReactionCameraResult(
    result: CameraResult?,
    onReactionReady: (CameraResult.Reaction) -> Unit,
    onDismissed: () -> Unit,
) {
    when (result) {
        null -> onDismissed()
        is CameraResult.Reaction -> onReactionReady(result)
        else -> Unit
    }
}

@Composable
fun rememberRecordReactionLauncher(
    baseVideoUri: Uri,
    license: String?,
    userId: String?,
    onReactionReady: (CameraResult.Reaction) -> Unit,
    onDismissed: () -> Unit = {},
): () -> Unit {
    val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
        handleReactionCameraResult(result, onReactionReady, onDismissed)
    }

    return {
        val input = CaptureMedia.Input(
            engineConfiguration = EngineConfiguration(
                license = license,
                userId = userId,
            ),
            cameraMode = CameraMode.Reaction(
                video = baseVideoUri,
                cameraLayoutMode = CameraLayoutMode.Vertical,
                positionsSwapped = false,
            ),
        )
        cameraLauncher.launch(input)
    }
}

suspend fun createReactionVideoScene(
    engine: Engine,
    cameraResult: CameraResult.Reaction,
): ReactionSceneComposition {
    val firstReactionVideo = cameraResult.reaction
        .firstNotNullOfOrNull { recording -> recording.videos.firstOrNull() }
        ?: error("Reaction result does not contain a recorded video.")

    check(engine.scene.get() == null) { "Call this before loading another scene." }
    engine.scene.createFromVideo(cameraResult.video.uri)

    val page = checkNotNull(engine.scene.getCurrentPage())
    val sceneFrame = RectF(cameraResult.video.rect).apply {
        union(firstReactionVideo.rect)
    }
    setFrame(engine = engine, designBlock = page, rect = sceneFrame)

    val baseVideoBlock = engine.block.findByType(DesignBlockType.Graphic).first()
    setFrame(engine = engine, designBlock = baseVideoBlock, rect = cameraResult.video.rect)

    val reactionTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = reactionTrack)

    val baseFill = engine.block.getFill(baseVideoBlock)
    engine.block.forceLoadAVResource(baseFill)
    val baseDurationSeconds = engine.block.getAVResourceTotalDuration(baseFill)

    val reactionBlocks = mutableListOf<DesignBlock>()
    var reactionOffsetSeconds = 0.0
    for (recording in cameraResult.reaction) {
        val remainingSeconds = baseDurationSeconds - reactionOffsetSeconds
        if (remainingSeconds <= 0.0) break

        val reactionVideo = recording.videos.firstOrNull() ?: continue
        val reactionBlock = addReactionRecording(
            engine = engine,
            recording = recording,
            reactionVideo = reactionVideo,
            parent = reactionTrack,
        )

        val recordingDurationSeconds = recording.duration.toDouble(DurationUnit.SECONDS)
        val clipDurationSeconds = minOf(recordingDurationSeconds, remainingSeconds)
        if (clipDurationSeconds < recordingDurationSeconds) {
            engine.block.setDuration(reactionBlock, duration = clipDurationSeconds)
        }

        reactionOffsetSeconds += clipDurationSeconds
        reactionBlocks += reactionBlock
    }

    val finalDurationSeconds = minOf(reactionOffsetSeconds, baseDurationSeconds)
    engine.block.setTrimOffset(baseFill, offset = 0.0)
    engine.block.setTrimLength(baseFill, length = finalDurationSeconds)
    engine.block.setDuration(baseVideoBlock, duration = finalDurationSeconds)

    return ReactionSceneComposition(
        page = page,
        baseVideoBlock = baseVideoBlock,
        reactionTrack = reactionTrack,
        reactionBlocks = reactionBlocks,
        durationSeconds = finalDurationSeconds,
    )
}

private fun addReactionRecording(
    engine: Engine,
    recording: Recording,
    reactionVideo: Video,
    parent: DesignBlock,
): DesignBlock {
    val reactionBlock = engine.block.create(DesignBlockType.Graphic)
    val shape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = reactionBlock, shape = shape)
    setFrame(engine = engine, designBlock = reactionBlock, rect = reactionVideo.rect)

    val fill = engine.block.createFill(FillType.Video)
    // Point the video fill at the recorded reaction segment.
    engine.block.setUri(
        block = fill,
        property = "fill/video/fileURI",
        value = reactionVideo.uri,
    )
    engine.block.setFill(block = reactionBlock, fill = fill)
    engine.block.setDuration(reactionBlock, duration = recording.duration.toDouble(DurationUnit.SECONDS))
    engine.block.appendChild(parent = parent, child = reactionBlock)

    return reactionBlock
}

private fun setFrame(
    engine: Engine,
    designBlock: DesignBlock,
    rect: RectF,
) {
    engine.block.setWidth(block = designBlock, value = rect.width())
    engine.block.setHeight(block = designBlock, value = rect.height())
    engine.block.setPositionX(block = designBlock, value = rect.left)
    engine.block.setPositionY(block = designBlock, value = rect.top)
}
```

Launch the CE.SDK mobile camera in Reaction mode and collect the base video
plus every recorded reaction clip.

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260821/editor-guides-record-reaction)

This guide uses the CE.SDK mobile camera in Reaction mode. For adding the
camera to your app and the permissions it requires, see
[Integrate Mobile Camera](./integrate.md); for the full set of camera
options, see [Mobile Camera Configuration](./camera-configuration.md). To compose
the returned recordings into an editable picture-in-picture video scene,
continue with [Record Reaction](../../create-video/record-reaction.md) in the video-creation
guides.

Reaction mode plays a provided video while the front camera and microphone
record the user's response. The camera returns the base video separately from
one or more reaction recordings — the source clips rather than an automatically
composited export — so your app can decide whether to persist the files, place
the reaction as a picture-in-picture clip, or process the clips in another
workflow. Android exposes `CameraMode.Standard` and `CameraMode.Reaction`; dual
camera is not available in the Android camera API.

## Launch Reaction Mode

Register `CaptureMedia` with `rememberLauncherForActivityResult`, then launch it
with `CameraMode.Reaction`. The `video` parameter is the base video that plays
while the user records.

```kotlin highlight-android-launch-reaction
@Composable
fun rememberRecordReactionLauncher(
    baseVideoUri: Uri,
    license: String?,
    userId: String?,
    onReactionReady: (CameraResult.Reaction) -> Unit,
    onDismissed: () -> Unit = {},
): () -> Unit {
    val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
        handleReactionCameraResult(result, onReactionReady, onDismissed)
    }

    return {
        val input = CaptureMedia.Input(
            engineConfiguration = EngineConfiguration(
                license = license,
                userId = userId,
            ),
            cameraMode = CameraMode.Reaction(
                video = baseVideoUri,
                cameraLayoutMode = CameraLayoutMode.Vertical,
                positionsSwapped = false,
            ),
        )
        cameraLauncher.launch(input)
    }
}
```

The session starts on the front camera so the user's face is in frame right
away. Recording is capped at the base video's duration —
`CameraConfiguration.maxTotalDuration` is ignored in Reaction mode, so a
reaction can never run longer than the video it responds to.

Reaction mode supports video capture only. `CaptureMedia.Input` validates the
selected `cameraMode` against the configured capture type and rejects unsupported
combinations, such as photo capture with `CameraMode.Reaction`.

## Choose the Layout

`cameraLayoutMode` takes a `CameraLayoutMode`: `Vertical` stacks the two feeds
on top of each other, `Horizontal` places them side by side. The base video
plays in the top or left half and the camera preview fills the other half. Pass
`positionsSwapped = true` to start the session with the two positions
exchanged.

## Handle the Result

`CaptureMedia` returns `null` when the user dismisses the camera. A successful
Reaction session returns `CameraResult.Reaction`; other result cases belong to
Standard or mixed capture flows and can be ignored here.

```kotlin highlight-android-handle-result
private fun handleReactionCameraResult(
    result: CameraResult?,
    onReactionReady: (CameraResult.Reaction) -> Unit,
    onDismissed: () -> Unit,
) {
    when (result) {
        null -> onDismissed()
        is CameraResult.Reaction -> onReactionReady(result)
        else -> Unit
    }
}
```

The result separates the base video from the reaction recordings:

| Value | Meaning |
| ----- | ------- |
| `CameraResult.Reaction.video` | The base `Video` that was played during recording. |
| `CameraResult.Reaction.reaction` | A list of `Recording` segments captured from the front camera and microphone. |
| `Recording.videos` | The videos inside each segment. Reaction recordings contain a single video. |
| `CameraResult.Reaction.video.uri` | The original base video URI passed to `CameraMode.Reaction`. |
| `Recording.videos.first().uri` | The app-local URI for a generated reaction recording file. |
| `Video.rect` | The preview rectangle used by the camera layout. |

Reaction recording file URIs point to app-local files. Copy those generated
files into your own storage location if you need them after the camera session,
especially before passing them to a background upload or long-running editor
workflow. The base video URI remains the URI your app passed into
`CameraMode.Reaction`. See [Access Recordings](./recordings.md) for the
general recording result shape.

To turn the result into an editable scene, hand the base video and reaction
recordings to the editor and compose the picture-in-picture layout there —
[Record Reaction](../../create-video/record-reaction.md) in the video-creation guides walks
through that flow.

## Troubleshooting

### Incomplete Reaction Clips

A pause/resume session produces multiple reaction recordings. Process the whole
`reaction` list instead of reading only the first entry.

### Audio Echo

The base video's audio can be picked up by the microphone. Lower the playback
volume in your camera experience or suggest headphones when echo would hurt the
recording.

## Related Types

| Type | Purpose |
| ---- | ------- |
| `CameraMode.Reaction` | Configures Reaction mode with a base video, layout mode, and optional swapped positions. |
| `CameraResult.Reaction` | Returns the base video and the reaction recordings. |
| `Recording` | Describes one captured segment and its duration. |
| `Video` | Describes a video URI and preview rectangle. |

## API Reference

| API | Purpose |
| --- | ------- |
| `CaptureMedia()` | Creates the Activity Result contract for the CE.SDK camera. |
| `CaptureMedia.Input(engineConfiguration=_, cameraConfiguration=_, cameraMode=_)` | Configures the camera launch request; `cameraConfiguration` carries the capture type validated against the mode. |
| `EngineConfiguration(license=_, userId=_)` | Supplies license and user identity information to the camera engine. |
| `CameraMode.Reaction(video=_, cameraLayoutMode=_, positionsSwapped=_)` | Starts Reaction mode with the base video and layout settings. |
| `rememberLauncherForActivityResult(contract=_, onResult=_)` | Registers the launcher that opens the camera and receives `CameraResult?`. |

## Next Steps

- [Record Reaction](../../create-video/record-reaction.md) - Compose the base video and reaction clips into an editable picture-in-picture video scene.
- [Integrate Mobile Camera](./integrate.md) - Add the mobile camera to your Android app.
- [Mobile Camera Configuration](./camera-configuration.md) - Configure capture behavior, duration limits, and camera UI options.
- [Access Recordings](./recordings.md) - Read and persist captured video recordings.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support