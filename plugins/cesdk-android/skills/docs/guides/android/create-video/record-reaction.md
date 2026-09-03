> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Record Reaction](./record-reaction.md)

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

Record the user while a base video plays, then compose the base video and the
reaction clips into an editable picture-in-picture video scene.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/editor-guides-record-reaction)

<EngineReferenceNote {...props} />

Reaction mode is a camera workflow. Before launching it, add the `implementation "ly.img:camera:1.83.0-nightly.20260903"` dependency to your application module and complete [Integrate Mobile Camera](../import-media/capture-from-camera/integrate.md).

CE.SDK returns the original video and the recorded reaction segments; your app then places those assets in the video editor.

| Android type | Purpose |
| --- | --- |
| `CameraMode.Reaction` | Opens the camera while playing the video the user reacts to. |
| `CameraResult.Reaction` | Returns the base `Video` and one or more reaction `Recording` segments. |
| `Recording` | Stores segment duration and its recorded `Video` entries. |
| `Video` | Stores the recorded URI and the preview `rect` used by the camera layout. |

## Launch Reaction Mode

Create a launcher with the `CaptureVideo` Activity Result contract. The sample receives a base video URI from your app, delegates the camera result to the handler below and starts `CameraMode.Reaction` with a vertical preview layout.

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

Use `cameraLayoutMode` to switch between vertical and horizontal previews. Set `positionsSwapped` when the reaction camera should take the base video's preview position.

## Handle the Reaction Result

When the user finishes recording, handle the `CameraResult.Reaction` branch in the Activity Result callback. The `Record` branch is included for exhaustiveness, but a launcher started in Reaction mode should call `onReactionReady` with the reaction result. Pass that result to your editor flow; the following sections use it as `cameraResult`.

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

The result contains `video`, which is the base video, and `reaction`, which is the list of recorded reaction segments. A segment list can contain multiple entries when the user pauses and resumes recording.

## Preserve Preview Rects

The camera stores each preview position as an Android `RectF`. Pass the `Engine`, target block and rect to the helper, then map the rect to CE.SDK block size and position to preserve the camera preview layout in the editor.

```kotlin highlight-android-rect-frame
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

## Build the Editable Video Scene

Use the editor `Engine` to create a video scene from the base video URI. The sample reads the first reaction video used for the page bounds, sizes the page to include both preview rectangles, positions the base video block at its recorded rect and creates a separate track for reaction clips.

```kotlin highlight-android-build-scene
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
```

Call this after the camera returns and before loading another scene.

## Add Reaction Clips

Each reaction segment becomes a graphic block with a rectangle shape and a video fill. The helper receives the `Engine`, `Recording`, reaction `Video` and parent track explicitly so copied code has all required inputs.

```kotlin highlight-android-add-reaction-clips
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
```

Android has no typed public binding for this video fill URI key today, so the sample passes `"fill/video/fileURI"` to `engine.block.setUri(...)` and keeps the value URI-typed.

## Keep Timing Synchronized

Force-load the base video fill before reading its duration. The sample trims any reaction segment that would exceed the base video, then applies the final duration to the base fill and base video block.

```kotlin highlight-android-sync-duration
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
```

This keeps the final composition no longer than the video the user reacted to. Tracks place the reaction segments one after another based on the block durations.

## Persist Reaction Files

The base video URI is the URI your app passed into Reaction mode. Reaction clip URIs are files created by the camera in app-local storage, so copy those reaction files to your app's long-term storage if you need them after the current editing workflow.

For lower-level access to durations, URIs and rects, see the [Access Recordings](../import-media/capture-from-camera/recordings.md) guide.

## Next Steps

- [Integrate Mobile Camera](../import-media/capture-from-camera/integrate.md) - Add CE.SDK camera capture to your Android app.
- [Mobile Camera Configuration](../import-media/capture-from-camera/camera-configuration.md) - Lock camera modes and configure capture behavior.
- [Access Recordings](../import-media/capture-from-camera/recordings.md) - Inspect recorded durations, URIs and preview rects.
- [Trim](../edit-video/trim.md) — Documentation for Trim
- [Timeline Editor](./timeline-editor.md) - Arrange video clips, audio and timeline content in the editor.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support