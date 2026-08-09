> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Take Photo](./take-photo.md)

---

```kotlin file=@cesdk_android_examples/camera-guides-take-photo/TakePhotoActivity.kt reference-only
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import ly.img.camera.core.CameraConfiguration
import ly.img.camera.core.CameraResult
import ly.img.camera.core.Capture
import ly.img.camera.core.CaptureCount
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.CaptureType
import ly.img.camera.core.EngineConfiguration
import kotlin.time.Duration.Companion.seconds

private const val TAG = "TakePhotoActivity"

class TakePhotoActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val singlePhotoInput = CaptureMedia.Input(
            engineConfiguration = EngineConfiguration(
                license = null, // pass null or empty for evaluation mode with watermark
                userId = "<your unique user id>",
            ),
            cameraConfiguration = CameraConfiguration(
                captureType = CaptureType.Photo,
                captureCount = CaptureCount.Single,
            ),
        )

        val multiPhotoInput = CaptureMedia.Input(
            engineConfiguration = EngineConfiguration(
                license = null,
                userId = "<your unique user id>",
            ),
            cameraConfiguration = CameraConfiguration(
                captureType = CaptureType.Photo,
                captureCount = CaptureCount.Multi,
                photoClipDuration = 4.seconds,
                showsPhotoPreview = false,
            ),
        )

        setContent {
            val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
                handlePhotoResult(result)
            }

            Column {
                Button(
                    onClick = {
                        cameraLauncher.launch(singlePhotoInput)
                    },
                ) {
                    Text(text = "Take Photo")
                }

                Button(
                    onClick = {
                        cameraLauncher.launch(multiPhotoInput)
                    },
                ) {
                    Text(text = "Take Multiple Photos")
                }
            }
        }
    }
}

private fun handlePhotoResult(result: CameraResult?) {
    result ?: run {
        Log.i(TAG, "Camera dismissed")
        return
    }

    when (result) {
        is CameraResult.Captures -> {
            val photos = result.captures.filterIsInstance<Capture.Photo>()
            for (photo in photos) {
                // Copy the file behind photo.uri to app-owned storage here if the image must persist.
                Log.i(TAG, "Captured photo: ${photo.uri}, clip duration: ${photo.clipDuration}")
            }
        }

        else -> {
            Log.i(TAG, "Unhandled result")
        }
    }
}
```

Capture a still photo with the IMGLY Mobile Camera. Configure the camera for photo mode, launch it, and receive the captured photo so your app can edit, upload, or store it.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260809/camera-guides-take-photo)

This guide uses the IMGLY Mobile Camera in photo mode. For adding the camera to your app, see [Integrate Mobile Camera](./integrate.md); for the full set of camera options, see [Mobile Camera Configuration](./camera-configuration.md).

The camera declares the required permissions in its library manifest and presents its own permission prompt the first time it opens; photo mode does not request the microphone. This sample uses evaluation mode with `license = null`; pass your production license and user ID through `EngineConfiguration` in your app.

## Configure Photo Capture

Set `captureType = CaptureType.Photo` on `CameraConfiguration` so the camera shoots still images instead of videos. Use `CaptureCount.Single` when the camera should return after one confirmed photo.

```kotlin highlight-android-single-photo-input
val singlePhotoInput = CaptureMedia.Input(
    engineConfiguration = EngineConfiguration(
        license = null, // pass null or empty for evaluation mode with watermark
        userId = "<your unique user id>",
    ),
    cameraConfiguration = CameraConfiguration(
        captureType = CaptureType.Photo,
        captureCount = CaptureCount.Single,
    ),
)
```

`CaptureMedia.Input` combines the engine configuration with the camera behavior for this launch. The photo is returned through the Activity Result callback as part of a `CameraResult.Captures` value.

### Capture Multiple Photos

Use `CaptureCount.Multi` when the user can take several photos before leaving the camera. Set `showsPhotoPreview = false` if every photo should be committed immediately without the confirm or discard preview.

```kotlin highlight-android-multi-photo-input
val multiPhotoInput = CaptureMedia.Input(
    engineConfiguration = EngineConfiguration(
        license = null,
        userId = "<your unique user id>",
    ),
    cameraConfiguration = CameraConfiguration(
        captureType = CaptureType.Photo,
        captureCount = CaptureCount.Multi,
        photoClipDuration = 4.seconds,
        showsPhotoPreview = false,
    ),
)
```

`photoClipDuration` sets the duration stamped on each still photo: the photo occupies that much of the camera's recording-segments ring and counts toward `maxTotalDuration`, and the editor uses it as the clip length if the photo is later placed on a timeline. It does not change the JPEG file itself.

## Launch the Camera

Register the `CaptureMedia` Activity Result contract and launch the input that matches the flow you want. The callback receives `null` whenever the camera closes without completing the session, including when the user discards photos they already captured.

```kotlin highlight-android-launch-photo-camera
            val cameraLauncher = rememberLauncherForActivityResult(contract = CaptureMedia()) { result ->
                handlePhotoResult(result)
            }

            Column {
                Button(
                    onClick = {
                        cameraLauncher.launch(singlePhotoInput)
                    },
                ) {
                    Text(text = "Take Photo")
                }

                Button(
                    onClick = {
                        cameraLauncher.launch(multiPhotoInput)
                    },
                ) {
                    Text(text = "Take Multiple Photos")
                }
            }
```

## Handle Captured Photos

Photo sessions return `CameraResult.Captures`. Filter the capture stack for `Capture.Photo` entries, then read each photo's `uri` and `clipDuration`.

```kotlin highlight-android-handle-photo-result
private fun handlePhotoResult(result: CameraResult?) {
    result ?: run {
        Log.i(TAG, "Camera dismissed")
        return
    }

    when (result) {
        is CameraResult.Captures -> {
            val photos = result.captures.filterIsInstance<Capture.Photo>()
            for (photo in photos) {
                // Copy the file behind photo.uri to app-owned storage here if the image must persist.
                Log.i(TAG, "Captured photo: ${photo.uri}, clip duration: ${photo.clipDuration}")
            }
        }

        else -> {
            Log.i(TAG, "Unhandled result")
        }
    }
}
```

Each `Capture.Photo.uri` points to a JPEG written to your app's files directory. Copy the file to a permanent location before relying on it outside the immediate camera or editor workflow. See [Access Photos](./photos.md) for accessing and persisting captured media.

## API Reference

| API | Purpose |
| --- | --- |
| `CaptureMedia()` | Creates the Activity Result contract that opens the Mobile Camera. |
| `CaptureMedia.Input(engineConfiguration=_, cameraConfiguration=_, cameraMode=_)` | Supplies the engine and camera configuration for one camera launch. |
| `EngineConfiguration(license=_, userId=_)` | Provides the license and optional user identifier used by the camera engine. |
| `CameraConfiguration(captureType=_, captureCount=_, photoClipDuration=_, showsPhotoPreview=_)` | Chooses photo capture, single or multi capture behavior, per-photo clip duration, and photo preview behavior. |
| `CameraResult.Captures.captures` | Returns the ordered capture stack from a standard camera session. |
| `Capture.Photo.uri` | Returns the URI of the captured JPEG image. |
| `Capture.Photo.clipDuration` | Returns the timeline duration assigned to the photo capture. |

## Next Steps

- [Integrate Mobile Camera](./integrate.md) - Add the camera dependency and Activity Result setup.
- [Mobile Camera Configuration](./camera-configuration.md) - Configure capture behavior, durations, and camera UI options.
- [Access Photos](./photos.md) - Handle camera result objects for captured media.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support