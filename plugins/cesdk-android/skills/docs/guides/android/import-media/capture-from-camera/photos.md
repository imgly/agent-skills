> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Access Photos](./photos.md)

---

```kotlin file=@cesdk_android_examples/camera-guides-photos/PhotosCamera.kt reference-only
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import ly.img.camera.core.CameraConfiguration
import ly.img.camera.core.CameraResult
import ly.img.camera.core.Capture
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.CaptureType
import ly.img.camera.core.EngineConfiguration

private const val TAG = "PhotosCamera"

fun photoCameraInput(): CaptureMedia.Input = CaptureMedia.Input(
    engineConfiguration = EngineConfiguration(
        license = null, // Use your production license for release builds.
        userId = "<your unique user id>",
    ),
    cameraConfiguration = CameraConfiguration(
        captureType = CaptureType.Photo,
    ),
)

@Composable
fun PhotosCameraButton() {
    val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
        handlePhotoCameraResult(result)
    }

    Button(onClick = { cameraLauncher.launch(photoCameraInput()) }) {
        Text(text = "Open Camera")
    }
}

fun handlePhotoCameraResult(result: CameraResult?) {
    result ?: run {
        Log.i(TAG, "Camera returned no successful result")
        return
    }

    when (result) {
        is CameraResult.Captures -> {
            result.captures.filterIsInstance<Capture.Photo>().forEach { photo ->
                Log.i(TAG, "Photo URI: ${photo.uri}; clip duration: ${photo.clipDuration}")
            }
        }

        is CameraResult.Reaction -> {
            Log.i(TAG, "Reaction mode does not return photo captures")
        }

        else -> {
            Log.i(TAG, "Unhandled camera result: $result")
        }
    }
}

fun mixedCameraInput(): CaptureMedia.Input = CaptureMedia.Input(
    engineConfiguration = EngineConfiguration(
        license = null,
        userId = "<your unique user id>",
    ),
    cameraConfiguration = CameraConfiguration(
        captureType = CaptureType.Mixed,
    ),
)

fun handleMixedCameraResult(result: CameraResult?) {
    result ?: return

    if (result !is CameraResult.Captures) return

    result.captures.forEach { capture ->
        when (capture) {
            is Capture.Photo -> {
                Log.i(TAG, "Photo URI: ${capture.uri}; clip duration: ${capture.clipDuration}")
            }

            is Capture.Video -> {
                Log.i(TAG, "Video duration: ${capture.recording.duration}")
            }
        }
    }
}
```

Read still-photo captures returned by the IMG.LY Camera and understand the
lifetime of their app-local files.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/camera-guides-photos)

This guide assumes that you already use the standalone camera contract from
[Integrate Mobile Camera](./integrate.md). It focuses on the result
payload from photo and mixed capture sessions, not on camera permissions or
general camera UI setup.

## Configure Photo Capture

Create a `CaptureMedia.Input` with a `CameraConfiguration` whose `captureType`
is `CaptureType.Photo`. The default `CameraMode.Standard` supports photo
capture; reaction mode supports video capture only.

```kotlin highlight-android-configure-photo-capture
fun photoCameraInput(): CaptureMedia.Input = CaptureMedia.Input(
    engineConfiguration = EngineConfiguration(
        license = null, // Use your production license for release builds.
        userId = "<your unique user id>",
    ),
    cameraConfiguration = CameraConfiguration(
        captureType = CaptureType.Photo,
    ),
)
```

Use that input with `CaptureMedia` through the Activity Result API. The button
below calls the configuration helper and forwards the camera result to the
photo handler shown in the next section.

```kotlin highlight-android-launch-photo-capture
@Composable
fun PhotosCameraButton() {
    val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
        handlePhotoCameraResult(result)
    }

    Button(onClick = { cameraLauncher.launch(photoCameraInput()) }) {
        Text(text = "Open Camera")
    }
}
```

## Read Photo Results

The `CaptureMedia` callback receives `CameraResult?`. A `null` value means the
contract did not receive a successful `RESULT_OK` payload. This can represent
user cancellation, another result code, or missing result data. A successful
standard photo session returns `CameraResult.Captures`.

```kotlin highlight-android-read-photo-results
fun handlePhotoCameraResult(result: CameraResult?) {
    result ?: run {
        Log.i(TAG, "Camera returned no successful result")
        return
    }

    when (result) {
        is CameraResult.Captures -> {
            result.captures.filterIsInstance<Capture.Photo>().forEach { photo ->
                Log.i(TAG, "Photo URI: ${photo.uri}; clip duration: ${photo.clipDuration}")
            }
        }

        is CameraResult.Reaction -> {
            Log.i(TAG, "Reaction mode does not return photo captures")
        }

        else -> {
            Log.i(TAG, "Unhandled camera result: $result")
        }
    }
}
```

`CameraResult.Captures.captures` preserves the order in which the user captured
items. Each `Capture.Photo` exposes:

- `uri` - the JPEG file written by the camera.
- `clipDuration` - the duration assigned to that photo when the capture stack is
  later treated as editor clips.

## Handle Mixed Capture

Use `CaptureType.Mixed` when the same session can return both photos and
videos. The result still uses `CameraResult.Captures`, so branch on each
`Capture` entry and keep video handling close to your recordings workflow.

```kotlin highlight-android-handle-mixed-captures
fun mixedCameraInput(): CaptureMedia.Input = CaptureMedia.Input(
    engineConfiguration = EngineConfiguration(
        license = null,
        userId = "<your unique user id>",
    ),
    cameraConfiguration = CameraConfiguration(
        captureType = CaptureType.Mixed,
    ),
)

fun handleMixedCameraResult(result: CameraResult?) {
    result ?: return

    if (result !is CameraResult.Captures) return

    result.captures.forEach { capture ->
        when (capture) {
            is Capture.Photo -> {
                Log.i(TAG, "Photo URI: ${capture.uri}; clip duration: ${capture.clipDuration}")
            }

            is Capture.Video -> {
                Log.i(TAG, "Video duration: ${capture.recording.duration}")
            }
        }
    }
}
```

This guide only extracts still photos from the mixed stack. For video and
reaction result handling, continue with [Access Recordings](./recordings.md).

## Understand Photo File Lifetime

The Android camera writes each JPEG directly into your application's
`Application.filesDir`. A successful result therefore already points to
persistent app-internal storage: the file survives the camera session and
normal process restarts. Copying it to another path under the same `filesDir`
does not make it more durable.

The file remains private to your app and is removed if your app deletes it, the
user clears app data, or the app is uninstalled. If the photo needs a different
lifetime or owner, copy or upload it to a genuinely different destination, such
as user-selected document storage, `MediaStore`, or your backend. Perform that
I/O outside the Activity Result callback's main-thread work.

## Handle Dismissal and Capture Problems

A `null` Activity Result means no successful camera result was returned. It can
represent user cancellation, a non-`RESULT_OK` result, or missing result data,
so handle it as a no-result outcome without claiming that the user necessarily
dismissed the camera.

The camera library declares its required permission and presents the Android
permission UI. If no camera view appears, confirm that camera access is granted
and that the device exposes a compatible camera. If a shutter attempt does not
produce a new `Capture.Photo`, keep the previous result state unchanged and let
the user retry; do not invent a URI or persist a missing capture. Use Android
logs to investigate CameraX image-capture or device-capability failures.

## Result Fields

| Field | Purpose |
| ----- | ------- |
| `CameraResult.Captures.captures` | Ordered list of captures from photo, video, or mixed standard camera sessions. |
| `Capture.Photo.uri` | URI of the captured JPEG image. |
| `Capture.Photo.clipDuration` | Duration assigned to the photo when CE.SDK treats it as a clip later. |
| `Capture.Video.recording` | Video entry returned alongside photos when `CaptureType.Mixed` is enabled. |

## API Reference

| API | Purpose |
| --- | ------- |
| `CaptureMedia()` | Activity Result contract that launches the IMG.LY Camera and returns `CameraResult?`. |
| `CaptureMedia.Input(engineConfiguration=_, cameraConfiguration=_)` | Input object passed to the camera contract. |
| `EngineConfiguration(license=_, userId=_)` | Basic engine configuration used by the standalone camera. |
| `CameraConfiguration(captureType=_)` | Chooses whether the camera captures photos, videos, or both. |
| `rememberLauncherForActivityResult(contract=_)` | Registers the camera contract from Compose and receives the result callback. |
| `cameraLauncher.launch(_)` | Starts the camera with the configured `CaptureMedia.Input`. |

## Next Steps

- [Mobile Camera Configuration](./camera-configuration.md) - Configure capture type, capture count, preview behavior, and other camera options.
- [Access Recordings](./recordings.md) - Read video and reaction recordings returned by the camera.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support