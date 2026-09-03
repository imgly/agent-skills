> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Integrate Mobile Camera](./integrate.md)

---

```kotlin file=@cesdk_android_examples/camera-guides-quickstart/CameraActivity.kt reference-only
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import ly.img.camera.core.CameraResult
import ly.img.camera.core.Capture
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.EngineConfiguration

private const val TAG = "CameraActivity"

private fun handleCameraResult(result: CameraResult?) {
    result ?: run {
        Log.i(TAG, "Camera dismissed")
        return
    }
    when (result) {
        is CameraResult.Captures -> {
            result.captures.forEach { capture ->
                when (capture) {
                    is Capture.Photo -> {
                        Log.i(TAG, "Captured photo: ${capture.uri}")
                    }
                    is Capture.Video -> {
                        val videoUris = capture.recording.videos.map { it.uri }
                        Log.i(TAG, "Recorded video: $videoUris")
                    }
                }
            }
        }

        else -> {
            Log.i(TAG, "Unhandled result: $result")
        }
    }
}

class CameraActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val cameraInput = CaptureMedia.Input(
            engineConfiguration = EngineConfiguration(
                license = "YOUR_CESDK_LICENSE_KEY",
                userId = "<your unique user id>",
            ),
        )

        setContent {
            val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
                handleCameraResult(result)
            }

            Button(
                onClick = {
                    cameraLauncher.launch(cameraInput)
                },
            ) {
                Text(text = "Open Camera")
            }
        }
    }
}
```

Add the CE.SDK mobile camera to an Android app, launch it through the
Activity Result API, and handle captured photo or video results.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/camera-guides-quickstart/)

The mobile camera is provided by the `ly.img:camera` package. It opens a camera Activity, requests the required runtime permissions, and returns captured media to your app as a `CameraResult`.

## Add the Camera Package

Add the IMG.LY Maven repository to `settings.gradle` so Gradle can resolve the camera artifact:

```groovy
maven {
    name "IMG.LY Artifactory"
    url "https://maven.img.ly/maven"
    mavenContent {
        includeGroup("ly.img")
    }
}
```

Then add the camera dependency to your app module:

```groovy
implementation "ly.img:camera:1.83.0-nightly.20260903"
```

Use the same CE.SDK version for the camera package and any other `ly.img` packages in your app. If your project already uses Jetpack Compose dependencies, keep the Compose BOM at `2023.05.01` or newer.

## Meet Android Requirements

The mobile camera requires an Android app module with these settings:

| Requirement | Value |
| --- | --- |
| Minimum SDK | `minSdk 24` or higher |
| UI toolkit | Jetpack Compose enabled with `buildFeatures { compose true }` |
| Kotlin | `1.9.10` or higher |
| Supported ABIs | `arm64-v8a`, `armeabi-v7a`, `x86_64`, and `x86` |

The camera package contributes `android.permission.CAMERA` and `android.permission.RECORD_AUDIO` through its manifest. At runtime, the camera UI checks and requests the permissions it needs; photo-only sessions request camera access only, while video and mixed sessions also need microphone access.

## Configure the Camera Input

Create a `CaptureMedia.Input` before launching the camera. The input carries the `EngineConfiguration` used by the camera's internal engine instance.

```kotlin highlight-android-create-input
val cameraInput = CaptureMedia.Input(
    engineConfiguration = EngineConfiguration(
        license = "YOUR_CESDK_LICENSE_KEY",
        userId = "<your unique user id>",
    ),
)
```

Use a CE.SDK license key from your IMG.LY dashboard. You can request a trial license at [img.ly/forms/contact-sales](https://img.ly/forms/contact-sales). The optional `userId` helps count monthly active users accurately when signed-in users work across multiple devices.

## Register the Camera Launcher

Register the `CaptureMedia` contract inside your Compose content. The contract returns `null` when the user dismisses the camera and a `CameraResult` when they finish capturing media.

```kotlin highlight-android-register-launcher
val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
    handleCameraResult(result)
}
```

## Launch the Camera

Start the camera from your own UI by passing the input to the launcher.

```kotlin highlight-android-launch-camera
cameraLauncher.launch(cameraInput)
```

The default `CaptureMedia.Input` opens the standard camera in video mode. To start with photo capture, mixed photo/video capture, or duration limits, pass a `CameraConfiguration` to the input. To launch reaction mode and handle `CameraResult.Reaction`, follow the [Record Reaction](./record-reaction.md) guide.

## Handle Captured Media

Handle `CameraResult.Captures` to receive the ordered capture stack. Each entry is either a `Capture.Photo` with a file URI or a `Capture.Video` with one or more recorded video tracks.

```kotlin highlight-android-handle-result
private fun handleCameraResult(result: CameraResult?) {
    result ?: run {
        Log.i(TAG, "Camera dismissed")
        return
    }
    when (result) {
        is CameraResult.Captures -> {
            result.captures.forEach { capture ->
                when (capture) {
                    is Capture.Photo -> {
                        Log.i(TAG, "Captured photo: ${capture.uri}")
                    }
                    is Capture.Video -> {
                        val videoUris = capture.recording.videos.map { it.uri }
                        Log.i(TAG, "Recorded video: $videoUris")
                    }
                }
            }
        }

        else -> {
            Log.i(TAG, "Unhandled result: $result")
        }
    }
}
```

Captured files are written to your app's storage. Copy any URI that must survive beyond the current app-owned cache or files lifecycle into your own persistent storage before inserting it into a scene or uploading it.

If you integrate the camera into the CE.SDK editor UI, the editor's camera dock button uses the same `CaptureMedia` contract internally and inserts `CameraResult.Captures` into the active scene. Add `ly.img:camera` next to the editor dependency so that button can open the mobile camera.

## Test on Android Devices

The Android Emulator can verify that the Activity launches and permission flow appears, but hardware camera behavior, focus, audio capture, and orientation handling should be tested on a physical device. Guard app-specific fallback flows for emulators when your product requires real camera input.

## Key APIs

| API | Purpose |
| --- | --- |
| `CaptureMedia()` | Activity Result contract that opens the CE.SDK mobile camera. |
| `CaptureMedia.Input(engineConfiguration=_, cameraConfiguration=_, cameraMode=_)` | Defines the engine setup, optional camera behavior, and optional camera mode for one launch. |
| `EngineConfiguration(license=_, userId=_)` | Provides the camera engine license and optional user identifier. |

## Key Types

| Type | Purpose |
| --- | --- |
| `CameraResult.Captures` | Result case for standard photo, video, or mixed capture sessions. |
| `Capture.Photo` | A still photo capture with a file URI and clip duration. |
| `Capture.Video` | A video capture that wraps one recording. |

## Next Steps

- [Mobile Camera Configuration](./camera-configuration.md) - Set up camera permissions and behavior when capturing within CE.SDK.
- [Take Photo](./take-photo.md) - Learn how to capture a photo with the Mobile Camera.
- [Record Video](./record-video.md) - Display live camera feeds inside CE.SDK using PixelStreamFill.
- [Access Recordings](./recordings.md) - Manage access to recorded videos or reactions.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support