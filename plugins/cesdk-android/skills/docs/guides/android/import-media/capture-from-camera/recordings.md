> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Access Recordings](./recordings.md)

---

```kotlin file=@cesdk_android_examples/camera-guides-recordings/RecordingsCameraActivity.kt reference-only
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.camera.core.CameraResult
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.EngineConfiguration
import ly.img.camera.core.videos
import java.io.File
import java.util.UUID

private const val TAG = "RecordingsCameraActivity"

class RecordingsCameraActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val cameraInput = CaptureMedia.Input(
            engineConfiguration = EngineConfiguration(
                license = null, // pass null or empty for evaluation mode with watermark
                userId = "<your unique user id>",
            ),
        )

        setContent {
            CameraLaunchButton(cameraInput = cameraInput)
        }
    }
}

private object RecordingPersistence {
    // This process-owned scope outlives Compose and Activity instances.
    // Use WorkManager for copies that must survive process termination.
    val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
}

@Composable
private fun CameraLaunchButton(cameraInput: CaptureMedia.Input) {
    val applicationContext = LocalContext.current.applicationContext
    val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
        handleCameraResult(
            context = applicationContext,
            result = result,
            persistenceScope = RecordingPersistence.applicationScope,
        )
    }

    Button(
        onClick = {
            cameraLauncher.launch(cameraInput)
        },
    ) {
        Text(text = "Open Camera")
    }
}

private fun handleCameraResult(
    context: Context,
    result: CameraResult?,
    persistenceScope: CoroutineScope,
) {
    if (result == null) {
        Log.i(TAG, "Camera returned no successful result (canceled or failed)")
        return
    }

    when (result) {
        is CameraResult.Captures -> {
            for ((recordingIndex, recording) in result.captures.videos.withIndex()) {
                Log.i(TAG, "Recording $recordingIndex duration: ${recording.duration}")
                for ((videoIndex, video) in recording.videos.withIndex()) {
                    Log.i(TAG, "Video $videoIndex uri: ${video.uri}, rect: ${video.rect}")
                    persistenceScope.launch {
                        val persistedUri = persistRecordingVideo(
                            context = context,
                            sourceUri = video.uri,
                            fileName = "recording-$recordingIndex-$videoIndex-${UUID.randomUUID()}.mp4",
                        )
                        if (persistedUri != null) {
                            Log.i(TAG, "Persisted video $videoIndex uri: $persistedUri")
                        } else {
                            Log.i(TAG, "Unable to persist video $videoIndex from ${video.uri}")
                        }
                    }
                }
            }
        }

        is CameraResult.Reaction -> {
            Log.i(TAG, "Reacted-to video uri: ${result.video.uri}, rect: ${result.video.rect}")
            for ((reactionIndex, recording) in result.reaction.withIndex()) {
                Log.i(TAG, "Reaction $reactionIndex duration: ${recording.duration}")
                for ((videoIndex, video) in recording.videos.withIndex()) {
                    Log.i(TAG, "Reaction video $videoIndex uri: ${video.uri}, rect: ${video.rect}")
                    persistenceScope.launch {
                        val persistedUri = persistRecordingVideo(
                            context = context,
                            sourceUri = video.uri,
                            fileName = "reaction-$reactionIndex-$videoIndex-${UUID.randomUUID()}.mp4",
                        )
                        if (persistedUri != null) {
                            Log.i(TAG, "Persisted reaction video $videoIndex uri: $persistedUri")
                        } else {
                            Log.i(TAG, "Unable to persist reaction video $videoIndex from ${video.uri}")
                        }
                    }
                }
            }
        }

        else -> {
            Log.i(TAG, "Unhandled camera result")
        }
    }
}

private suspend fun persistRecordingVideo(
    context: Context,
    sourceUri: Uri,
    fileName: String,
): Uri? = withContext(Dispatchers.IO) {
    val recordingsDir = File(context.filesDir, "camera-recordings").apply { mkdirs() }
    val destinationFile = File(recordingsDir, fileName)

    val inputStream = context.contentResolver.openInputStream(sourceUri) ?: return@withContext null
    inputStream.use { input ->
        destinationFile.outputStream().use { output ->
            input.copyTo(output)
        }
    }

    Uri.fromFile(destinationFile)
}
```

Read video recordings returned by the IMGLY Mobile Camera so your app can
preview, upload, persist, or hand them to an editing workflow.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260904/camera-guides-recordings)

This guide starts after you have integrated the standalone camera with the Android Activity Result APIs. If you still need the camera dependency, permissions, or base launcher setup, complete [Integrate Mobile Camera](./integrate.md) first.

> **Note:** This guide covers the standalone camera. The camera built into the [Video Editor](../../starterkits/video-editor.md) adds captures to the editor session through its upload asset sources.

The camera library declares the camera and microphone permissions in its manifest and presents its own permission prompts the first time it opens. The sample uses evaluation mode with `license = null`; pass your production license and user ID through `EngineConfiguration` in your app.

The Activity Result callback returns one of three values:

| Result | When it appears |
| --- | --- |
| `CameraResult.Captures` | Standard video, photo, or mixed capture sessions. Use `result.captures.videos` to extract only video recordings. |
| `CameraResult.Reaction` | Reaction camera sessions launched with `CameraMode.Reaction`. It includes the source video and the recorded reaction segments. |
| `null` | The contract did not receive a successful camera result. This includes cancellation, any non-`RESULT_OK` outcome, and a successful result code without result data. |

## Create the Camera Launcher

Create a `CaptureMedia.Input` with your engine configuration. Then register a `CaptureMedia` Activity Result launcher in your UI and launch it with the same input object.

```kotlin highlight-android-create-input
val cameraInput = CaptureMedia.Input(
    engineConfiguration = EngineConfiguration(
        license = null, // pass null or empty for evaluation mode with watermark
        userId = "<your unique user id>",
    ),
)
```

```kotlin highlight-android-camera-launch-button
private object RecordingPersistence {
    // This process-owned scope outlives Compose and Activity instances.
    // Use WorkManager for copies that must survive process termination.
    val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
}

@Composable
private fun CameraLaunchButton(cameraInput: CaptureMedia.Input) {
    val applicationContext = LocalContext.current.applicationContext
    val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
        handleCameraResult(
            context = applicationContext,
            result = result,
            persistenceScope = RecordingPersistence.applicationScope,
        )
    }

    Button(
        onClick = {
            cameraLauncher.launch(cameraInput)
        },
    ) {
        Text(text = "Open Camera")
    }
}
```

The callback delegates result processing to `handleCameraResult`, which keeps the launcher setup separate from the recording access code. It passes the application context and a process-owned persistence scope, so an in-progress copy is not canceled when Compose removes the button or destroys its Activity. To produce a `CameraResult.Reaction`, launch the same Activity Result contract with `CameraMode.Reaction` and a base video URI from your app. For scene composition, continue with [Record Reaction](../../create-video/record-reaction.md) in the video-creation guides.

## Handle Camera Results

Handle `null` first because the contract has no successful result to inspect. `CaptureMedia` also returns `null` for non-`RESULT_OK` outcomes or missing result data, so it cannot distinguish user cancellation from a camera failure. When the user cancels, the camera deletes captures produced during that session.

```kotlin highlight-android-handle-no-result
if (result == null) {
    Log.i(TAG, "Camera returned no successful result (canceled or failed)")
    return
}
```

## Read Captured Videos

For a standard video session, handle `CameraResult.Captures`. The `captures` list can contain photos in photo or mixed sessions, so use `result.captures.videos` when this guide only needs the video recordings.

Each `Recording` is one segment from the session: one recording per shutter press. On Android, each recording contains one `Video`. Read `Recording.duration`, then iterate `Recording.videos` to access each returned `Video.uri` and preview `Video.rect`.

```kotlin highlight-android-read-captured-videos
is CameraResult.Captures -> {
    for ((recordingIndex, recording) in result.captures.videos.withIndex()) {
        Log.i(TAG, "Recording $recordingIndex duration: ${recording.duration}")
        for ((videoIndex, video) in recording.videos.withIndex()) {
            Log.i(TAG, "Video $videoIndex uri: ${video.uri}, rect: ${video.rect}")
            persistenceScope.launch {
                val persistedUri = persistRecordingVideo(
                    context = context,
                    sourceUri = video.uri,
                    fileName = "recording-$recordingIndex-$videoIndex-${UUID.randomUUID()}.mp4",
                )
                if (persistedUri != null) {
                    Log.i(TAG, "Persisted video $videoIndex uri: $persistedUri")
                } else {
                    Log.i(TAG, "Unable to persist video $videoIndex from ${video.uri}")
                }
            }
        }
    }
}
```

## Read Reaction Recordings

When the camera is launched in Reaction mode, handle `CameraResult.Reaction`. The `video` property is the source video the user reacted to, and `reaction` contains the recorded reaction segments.

The reaction recordings use the same `Recording` and `Video` shape as standard captures, so the duration, URI, and rect handling stays the same.

```kotlin highlight-android-read-reaction-recordings
is CameraResult.Reaction -> {
    Log.i(TAG, "Reacted-to video uri: ${result.video.uri}, rect: ${result.video.rect}")
    for ((reactionIndex, recording) in result.reaction.withIndex()) {
        Log.i(TAG, "Reaction $reactionIndex duration: ${recording.duration}")
        for ((videoIndex, video) in recording.videos.withIndex()) {
            Log.i(TAG, "Reaction video $videoIndex uri: ${video.uri}, rect: ${video.rect}")
            persistenceScope.launch {
                val persistedUri = persistRecordingVideo(
                    context = context,
                    sourceUri = video.uri,
                    fileName = "reaction-$reactionIndex-$videoIndex-${UUID.randomUUID()}.mp4",
                )
                if (persistedUri != null) {
                    Log.i(TAG, "Persisted reaction video $videoIndex uri: $persistedUri")
                } else {
                    Log.i(TAG, "Unable to persist reaction video $videoIndex from ${video.uri}")
                }
            }
        }
    }
}
```

## Persist Returned Files

Returned `Uri` values point to files produced by the camera workflow in your app's files directory. The camera removes captures when the user cancels the session, and your app owns any long-term persistence after a successful result. Copy or move any file that must survive beyond the immediate handoff into app-managed storage, and do that work from your own storage layer or a background task when recordings may be large.

The sample's process-owned scope outlives the Compose and Activity lifecycles, and it captures `applicationContext` instead of an Activity. It does not survive app process termination. Use `WorkManager` or your app's durable job system when a copy must finish after process death.

The result handler launches persistence work from that scope and passes each returned `video.uri` to this helper with a UUID-based file name. The helper performs the file copy on `Dispatchers.IO` so large videos do not block the Activity Result callback on the main thread.

```kotlin highlight-android-persist-returned-file
private suspend fun persistRecordingVideo(
    context: Context,
    sourceUri: Uri,
    fileName: String,
): Uri? = withContext(Dispatchers.IO) {
    val recordingsDir = File(context.filesDir, "camera-recordings").apply { mkdirs() }
    val destinationFile = File(recordingsDir, fileName)

    val inputStream = context.contentResolver.openInputStream(sourceUri) ?: return@withContext null
    inputStream.use { input ->
        destinationFile.outputStream().use { output ->
            input.copyTo(output)
        }
    }

    Uri.fromFile(destinationFile)
}
```

## API Reference

| API | Purpose |
| --- | --- |
| `CaptureMedia()` | Creates the Activity Result contract that opens the IMGLY Mobile Camera. |
| `CaptureMedia.Input(engineConfiguration=_, cameraConfiguration=_, cameraMode=_)` | Configures the standalone camera launch. |
| `EngineConfiguration(license=_, userId=_)` | Provides the license and optional user identifier used by the camera engine. |
| `CameraMode.Reaction(video=_, cameraLayoutMode=_, positionsSwapped=_)` | Starts the camera in reaction mode with the video the user reacts to. |
| `rememberLauncherForActivityResult(contract=_, onResult=_)` | Registers the Activity Result callback that receives `CameraResult?`. |
| `ActivityResultLauncher.launch(input=_)` | Starts the standalone camera with a `CaptureMedia.Input`. |
| `CameraResult.Captures.captures` | Reads the heterogeneous capture stack returned by standard camera sessions. |
| `List<Capture>.videos` | Extracts `List<Recording>` from video entries in a capture stack. |
| `Recording.duration` | Reads the duration of one recorded segment. |
| `Recording.videos` | Reads the `Video` entries that belong to one segment. |
| `Video.uri` | Reads the file URI for a returned video. |
| `Video.rect` | Reads the video preview rectangle from the camera layout. |
| `CameraResult.Reaction.video` | Reads the source video used for a reaction session. |
| `CameraResult.Reaction.reaction` | Reads the recorded reaction segments. |

## Next Steps

- [Integrate Mobile Camera](./integrate.md) - Add CE.SDK camera capture to your Android app.
- [Mobile Camera Configuration](./camera-configuration.md) - Configure capture behavior and camera modes.
- [Record Reaction](../../create-video/record-reaction.md) - Turn reaction recordings into an editable video scene.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support