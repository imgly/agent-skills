> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Record Video](./record-video.md)

---

```groovy file=@cesdk_android_examples/engine-guides-using-camera/build.gradle reference-only
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace "ly.img.editor.camera"
    compileSdk 36

    defaultConfig {
        applicationId "ly.img.editor.camera"
        minSdk 24
        targetSdk 36
        versionCode 1
        versionName "1.0"
        ndk {
            abiFilters "arm64-v8a", "armeabi-v7a", "x86_64", "x86"
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation "ly.img:engine-camera:1.81.0"
    implementation "androidx.camera:camera-core:1.5.0-alpha04"
    implementation "androidx.camera:camera-camera2:1.5.0-alpha04"
    implementation "androidx.camera:camera-view:1.5.0-alpha04"
    implementation "androidx.camera:camera-lifecycle:1.5.0-alpha04"
    implementation "androidx.camera:camera-video:1.5.0-alpha04"
    implementation "ly.img:engine:1.81.0"
    implementation "androidx.activity:activity:1.7.0"
    implementation "androidx.appcompat:appcompat:1.6.0"
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3"
}
```

```kotlin file=@cesdk_android_examples/engine-guides-using-camera/src/main/java/ly/img/editor/camera/UsingCamera.kt reference-only
package ly.img.editor.camera

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.Uri
import android.util.Log
import android.util.Size
import android.view.SurfaceView
import androidx.activity.ComponentActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.MirrorMode
import androidx.camera.core.Preview
import androidx.camera.core.resolutionselector.AspectRatioStrategy
import androidx.camera.core.resolutionselector.ResolutionSelector
import androidx.camera.core.resolutionselector.ResolutionStrategy
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.core.content.ContextCompat
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.EffectType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.camera.setCameraPreview
import java.io.File
import java.io.IOException

private const val TAG = "UsingCamera"

suspend fun recordVideoFromCamera(
    engine: Engine,
    activity: ComponentActivity,
    surfaceView: SurfaceView,
    cameraProvider: ProcessCameraProvider,
) = withContext(Dispatchers.Main.immediate) {
    val cameraSelector = CameraSelector.Builder()
        .requireLensFacing(CameraSelector.LENS_FACING_FRONT)
        .build()
    val previewSize = Size(1920, 1080)
    val resolutionSelector = ResolutionSelector.Builder()
        .setResolutionStrategy(
            ResolutionStrategy(
                previewSize,
                ResolutionStrategy.FALLBACK_RULE_CLOSEST_HIGHER_THEN_LOWER,
            ),
        )
        .setAspectRatioStrategy(AspectRatioStrategy.RATIO_16_9_FALLBACK_AUTO_STRATEGY)
        .build()
    val preview = Preview.Builder()
        .setResolutionSelector(resolutionSelector)
        .build()
    val qualitySelector = QualitySelector.from(Quality.FHD)
    val recorder = Recorder.Builder()
        .setQualitySelector(qualitySelector)
        .build()
    val videoCapture = VideoCapture.Builder(recorder)
        .setMirrorMode(MirrorMode.MIRROR_MODE_ON_FRONT_ONLY)
        .build()

    cameraProvider.bindToLifecycle(activity, cameraSelector, preview, videoCapture)

    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    // Request a 16:9 FHD preview target. CameraX may choose the closest supported size.
    val cameraWidth = 1920F
    val cameraHeight = 1080F
    engine.block.setWidth(block = scene, value = cameraWidth)
    engine.block.setHeight(block = scene, value = cameraHeight)
    engine.block.setWidth(block = page, value = cameraWidth)
    engine.block.setHeight(block = page, value = cameraHeight)

    val pixelStreamFill = engine.block.createFill(FillType.PixelStream)
    engine.block.setFill(block = page, fill = pixelStreamFill)
    engine.setCameraPreview(pixelStreamFill, preview, mirrored = true)
    engine.block.appendEffect(
        block = page,
        effectBlock = engine.block.createEffect(EffectType.HalfTone),
    )
    engine.scene.zoomToBlock(
        block = page,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )

    val recordingFile = File(surfaceView.context.filesDir, "temp.mp4")
    val fileOutputOptions = FileOutputOptions.Builder(recordingFile).build()
    val finalizeEvent = CompletableDeferred<VideoRecordEvent.Finalize>()
    var recording: Recording? = null
    var recordingStopped = false
    val finalizedRecording = try {
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.RECORD_AUDIO) !=
            PackageManager.PERMISSION_GRANTED
        ) {
            throw SecurityException("Grant RECORD_AUDIO before enabling audio recording.")
        }
        recording = videoCapture.output
            .prepareRecording(activity, fileOutputOptions)
            .withAudioEnabled()
            .start(ContextCompat.getMainExecutor(surfaceView.context)) { event: VideoRecordEvent ->
                if (event !is VideoRecordEvent.Finalize) return@start
                finalizeEvent.complete(event)
            }
        // Stop after five seconds for this sample. Replace this with your app's own recording controls.
        delay(5000L)
        recordingStopped = true
        recording.stop()
        finalizeEvent.await()
    } finally {
        withContext(NonCancellable) {
            try {
                recording?.let {
                    if (!recordingStopped) {
                        recordingStopped = true
                        it.stop()
                    }
                    finalizeEvent.await()
                }
            } finally {
                cameraProvider.unbind(preview, videoCapture)
            }
        }
    }

    if (finalizedRecording.hasError()) {
        val exception = IllegalStateException(
            "CameraX recording failed with error ${finalizedRecording.error}",
            finalizedRecording.cause,
        )
        Log.e(TAG, "CameraX recording failed with error ${finalizedRecording.error}", exception)
        throw exception
    }

    val recordingUri = finalizedRecording.outputResults.outputUri
    requireNonEmptyRecording(surfaceView.context, recordingUri)
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setFill(block = page, fill = videoFill)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = recordingUri,
    )
}

private suspend fun requireNonEmptyRecording(
    context: Context,
    uri: Uri,
) = withContext(Dispatchers.IO) {
    val hasData = try {
        context.contentResolver.openInputStream(uri)?.use { input ->
            input.read() != -1
        } ?: false
    } catch (exception: IOException) {
        throw IllegalStateException("CameraX finalized recording is not readable: $uri", exception)
    }

    check(hasData) { "CameraX finalized recording is missing or empty: $uri" }
}
```

Beyond pre-recorded video, you can pipe a live CameraX feed into the engine
with a `PixelStreamFill`. The feed composes with the rest of your scene, so
the engine's effects apply to the live preview in real time. When recording
finishes, swap the fill for a `VideoFill` to play the captured file back.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260826/engine-guides-using-camera)

<EngineReferenceNote {...props} />

On Android, if you want IMG.LY's ready-made camera Activity instead of wiring
your own capture pipeline, see [Integrate Mobile Camera](./integrate.md).
This guide takes the engine-level path.

A `PixelStreamFill` accepts raw camera frames, so you can drive it from any
camera pipeline. The sample uses the `engine-camera` extension to bridge
CameraX preview frames into CE.SDK, applies an effect to the preview, records
with CameraX `VideoCapture`, and swaps in a `VideoFill` for playback once
recording stops.

## Create a Video Scene with a Camera Fill

Create a video scene with a single page, assign a `PixelStreamFill` to the page,
and append an effect to confirm that the live preview composes with the engine's
rendering. The sample sizes the page to the same 16:9 FHD target used by
CameraX so the feed is not stretched.

```kotlin highlight-android-create-preview
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    // Request a 16:9 FHD preview target. CameraX may choose the closest supported size.
    val cameraWidth = 1920F
    val cameraHeight = 1080F
    engine.block.setWidth(block = scene, value = cameraWidth)
    engine.block.setHeight(block = scene, value = cameraHeight)
    engine.block.setWidth(block = page, value = cameraWidth)
    engine.block.setHeight(block = page, value = cameraHeight)

    val pixelStreamFill = engine.block.createFill(FillType.PixelStream)
    engine.block.setFill(block = page, fill = pixelStreamFill)
    engine.setCameraPreview(pixelStreamFill, preview, mirrored = true)
    engine.block.appendEffect(
        block = page,
        effectBlock = engine.block.createEffect(EffectType.HalfTone),
    )
    engine.scene.zoomToBlock(
        block = page,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )
```

The `engine.setCameraPreview(...)` helper connects a CameraX `Preview` to the
pixel stream fill and updates the fill as frames arrive.

## Control Feed Orientation

Transforming every frame manually is wasteful. Instead, `PixelStreamFill`
exposes a `fill/pixelStream/orientation` property that the GPU applies during
rendering. Pass `mirrored = true` to `setCameraPreview(...)` for a front-facing
preview; the extension combines that flag with CameraX transformation
information.

Supported orientation values are:

| Value | Effect |
| --- | --- |
| `Up` | No rotation (default) |
| `Down` | 180 degree rotation |
| `Left` | 90 degree counter-clockwise |
| `Right` | 90 degree clockwise |
| `UpMirrored` | Horizontal flip |
| `DownMirrored` | 180 degree rotation plus horizontal flip |
| `LeftMirrored` | 90 degree counter-clockwise plus horizontal flip |
| `RightMirrored` | 90 degree clockwise plus horizontal flip |

Override `fill/pixelStream/orientation` with `engine.block.setEnum(...)` only
when your app owns a fixed-orientation camera pipeline and intentionally
bypasses CameraX orientation updates.

## Access the Camera

Add the `engine-camera` extension together with the CameraX modules used for
preview and recording. Keep `engine` and `engine-camera` on the same CE.SDK
version.

```groovy highlight-android-dependencies
implementation "ly.img:engine-camera:1.81.0"
implementation "androidx.camera:camera-core:1.5.0-alpha04"
implementation "androidx.camera:camera-camera2:1.5.0-alpha04"
implementation "androidx.camera:camera-view:1.5.0-alpha04"
implementation "androidx.camera:camera-lifecycle:1.5.0-alpha04"
implementation "androidx.camera:camera-video:1.5.0-alpha04"
implementation "ly.img:engine:1.81.0"
implementation "androidx.activity:activity:1.7.0"
implementation "androidx.appcompat:appcompat:1.6.0"
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3"
```

Build a CameraX front-camera selector, a `Preview` use case, and a
`VideoCapture` use case. CameraX may choose the closest supported preview size
for the device, while the matching aspect ratio keeps the CE.SDK page aligned
with the feed.

```kotlin highlight-android-setup-camera
    val cameraSelector = CameraSelector.Builder()
        .requireLensFacing(CameraSelector.LENS_FACING_FRONT)
        .build()
    val previewSize = Size(1920, 1080)
    val resolutionSelector = ResolutionSelector.Builder()
        .setResolutionStrategy(
            ResolutionStrategy(
                previewSize,
                ResolutionStrategy.FALLBACK_RULE_CLOSEST_HIGHER_THEN_LOWER,
            ),
        )
        .setAspectRatioStrategy(AspectRatioStrategy.RATIO_16_9_FALLBACK_AUTO_STRATEGY)
        .build()
    val preview = Preview.Builder()
        .setResolutionSelector(resolutionSelector)
        .build()
    val qualitySelector = QualitySelector.from(Quality.FHD)
    val recorder = Recorder.Builder()
        .setQualitySelector(qualitySelector)
        .build()
    val videoCapture = VideoCapture.Builder(recorder)
        .setMirrorMode(MirrorMode.MIRROR_MODE_ON_FRONT_ONLY)
        .build()

    cameraProvider.bindToLifecycle(activity, cameraSelector, preview, videoCapture)
```

The sample uses `MirrorMode.MIRROR_MODE_ON_FRONT_ONLY` so the recorded front
camera video matches the natural selfie orientation.

## Update the Fill with Video Frames

`setCameraPreview(...)` receives CameraX preview frames and writes them into the
`PixelStreamFill`. Because the feed is a regular fill, engine features such as
effects apply to the live preview just as they would to any other block.

Call the sample's suspending entry point from an Activity- or Fragment-owned
coroutine scope so cancellation follows the visible camera surface. The sample
switches to `Dispatchers.Main.immediate` before touching CameraX or Engine APIs.

## Stop and Play Back the Recording

Start CameraX recording with `VideoCapture.output.prepareRecording(...)`,
enable audio, and wait for CameraX to finalize the file before unbinding the
camera use cases.

```kotlin highlight-android-record-video
    val recordingFile = File(surfaceView.context.filesDir, "temp.mp4")
    val fileOutputOptions = FileOutputOptions.Builder(recordingFile).build()
    val finalizeEvent = CompletableDeferred<VideoRecordEvent.Finalize>()
    var recording: Recording? = null
    var recordingStopped = false
    val finalizedRecording = try {
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.RECORD_AUDIO) !=
            PackageManager.PERMISSION_GRANTED
        ) {
            throw SecurityException("Grant RECORD_AUDIO before enabling audio recording.")
        }
        recording = videoCapture.output
            .prepareRecording(activity, fileOutputOptions)
            .withAudioEnabled()
            .start(ContextCompat.getMainExecutor(surfaceView.context)) { event: VideoRecordEvent ->
                if (event !is VideoRecordEvent.Finalize) return@start
                finalizeEvent.complete(event)
            }
        // Stop after five seconds for this sample. Replace this with your app's own recording controls.
        delay(5000L)
        recordingStopped = true
        recording.stop()
        finalizeEvent.await()
    } finally {
        withContext(NonCancellable) {
            try {
                recording?.let {
                    if (!recordingStopped) {
                        recordingStopped = true
                        it.stop()
                    }
                    finalizeEvent.await()
                }
            } finally {
                cameraProvider.unbind(preview, videoCapture)
            }
        }
    }

    if (finalizedRecording.hasError()) {
        val exception = IllegalStateException(
            "CameraX recording failed with error ${finalizedRecording.error}",
            finalizedRecording.cause,
        )
        Log.e(TAG, "CameraX recording failed with error ${finalizedRecording.error}", exception)
        throw exception
    }

    val recordingUri = finalizedRecording.outputResults.outputUri
    requireNonEmptyRecording(surfaceView.context, recordingUri)
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setFill(block = page, fill = videoFill)
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = recordingUri,
    )
}

private suspend fun requireNonEmptyRecording(
    context: Context,
    uri: Uri,
) = withContext(Dispatchers.IO) {
    val hasData = try {
        context.contentResolver.openInputStream(uri)?.use { input ->
            input.read() != -1
        } ?: false
    } catch (exception: IOException) {
        throw IllegalStateException("CameraX finalized recording is not readable: $uri", exception)
    }

    check(hasData) { "CameraX finalized recording is missing or empty: $uri" }
}
```

When finalization succeeds, use the URI from
`Finalize.outputResults.outputUri`. The CameraX main-executor callback only
completes `finalizeEvent`; it does not perform file I/O or mutate the Engine.
After `finalizeEvent.await()` returns, the sample opens the URI through
`ContentResolver` on `Dispatchers.IO` and reads one byte to verify that the
finalized artifact is both readable and non-empty. It then returns to the
caller's main context, creates a `VideoFill`, assigns it to the page, and points
it at the recording.

After awaiting the event and unbinding the camera use cases, the sample checks
`Finalize.hasError()` and validates the artifact. A CameraX finalize error, an
unreadable URI, or an empty artifact throws an exception to the suspending
caller, and the `VideoFill` is not assigned. Handle that exception in your UI
instead of trying to play the invalid recording.

The file lives in your app's local `filesDir`; move it to a genuinely different
long-term destination or upload it if the recording needs another durability
boundary.

## The Camera Helper

The sample keeps the CameraX setup in the same guide file. Drop the helper code
into your app alongside the engine code above, or replace it with your own
CameraX pipeline as long as it provides a `Preview` for `setCameraPreview(...)`
and a finalized file URI for the playback `VideoFill`.

## Permissions

Capturing video and audio requires both manifest declarations and runtime
permissions on Android. Request camera and microphone access before binding the
CameraX use cases.

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Troubleshooting

**No preview appears** — Verify that the Engine is running, is bound to the same
`SurfaceView`, and that the app has camera permission before binding the CameraX
use cases.

**No audio is recorded** — Verify that the app declares and has runtime access
to `RECORD_AUDIO` before calling `withAudioEnabled()`.

**The feed is mirrored or rotated incorrectly** — Check the `mirrored` argument
passed to `setCameraPreview(...)` first, then override
`fill/pixelStream/orientation` only when your app owns a fixed camera
orientation.

**The recording does not play back** — Handle the exception from
`finalizeEvent.await()`. CameraX finalize errors, unreadable URIs, and empty
artifacts all fail before the sample replaces the preview with a `VideoFill`.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.createForVideo()` | Create a timeline-enabled scene for camera preview and video playback |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create the page that displays the camera feed |
| `engine.block.appendChild(parent=_, child=_)` | Add the page to the video scene |
| `engine.block.setWidth(block=_, value=_)` | Set the scene and page width to match the camera preview target |
| `engine.block.setHeight(block=_, value=_)` | Set the scene and page height to match the camera preview target |
| `engine.block.createFill(fillType=FillType.PixelStream)` | Create a fill that accepts live pixel data |
| `engine.block.setFill(block=_, fill=_)` | Assign the pixel stream or video fill to a block |
| `engine.setCameraPreview(pixelStreamFill=_, preview=_, mirrored=_, onFirstFrameAvailable=_)` | Connect a CameraX `Preview` to a `PixelStreamFill` |
| `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)` | Point the playback `VideoFill` at the recorded file URI |
| `engine.block.setEnum(block=_, property="fill/pixelStream/orientation", value=_)` | Set the orientation for mirroring or rotation |
| `engine.block.createEffect(type=_)` | Create an effect for real-time processing |
| `engine.block.appendEffect(block=_, effectBlock=_)` | Apply an effect to the block |
| `engine.scene.zoomToBlock(block=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Fit the page in the viewport |

## Next Steps

- [Integrate Mobile Camera](./integrate.md) - Add the ready-made CE.SDK camera capture flow.
- [Create Video](../../create-video.md) - Work with prerecorded video scenes.
- [Filters and Effects](../../filters-and-effects.md) - Apply visual effects to camera or video content.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support