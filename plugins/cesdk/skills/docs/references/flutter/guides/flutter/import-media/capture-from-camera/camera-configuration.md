> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/flutter/guides-8d8b00/) > [Import Media Assets](https://img.ly/docs/cesdk/flutter/import-media-4e3703/) > [Capture From Camera](https://img.ly/docs/cesdk/flutter/import-media/capture-from-camera-92f388/) > [Camera Configuration](./camera-configuration.md)

---

```dart file=@cesdk_flutter_examples/camera-guides-configuration/camera_configuration_solution.dart reference-only
import "package:imgly_camera/imgly_camera.dart";

class CameraConfigurationSolution {
  /// Opens the camera.
  void openCamera() async {
    final settings = CameraSettings(
        license:
            "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
        userId:
            "YOUR_USER_ID"); // A unique string to identify your user/session

    final _ = await IMGLYCamera.openCamera(
      settings,
      // Optional, if you want to react to a video
      video: 'https://img.ly/static/ubq_video_samples/test30.mp4',
    );
  }
}
```

```swift file=@cesdk_flutter_examples/../ios/Runner/Guides/ConfigurationGuide.swift reference-only
import imgly_camera
import imgly_editor
import SwiftUI

func useCustomEditor() {
  IMGLYEditorPlugin.builderClosure = { _, metadata in
    // Make decisions based on your own metadata.
    if metadata?["use_custom_editor"] as? Bool == true {
      // Return your custom editor.
      EditorBuilder.custom { settings, _, _, result in
        CustomEditor(settings: settings, result: result)
      }
    } else {
      // Return a custom or prebuilt editor.
      EditorBuilder.design()
    }
  }
}

private struct CustomEditor: View {
  init(settings _: EditorSettings, result _: @escaping EditorBuilder.EditorBuilderResult) {}

  var body: some View {
    Text("Custom Editor")
  }
}

func configureCamera() {
  IMGLYCameraPlugin.builderClosure = { metadata in
    // Make decisions based on your own metadata.
    if metadata?["use_custom_camera"] as? Bool == true {
      // Return your custom camera.
      CameraBuilder.custom { settings, url, metadata, result in
        CustomCamera(settings: settings, url: url, metadata: metadata, result: result)
      }
    } else {
      // Return a custom or prebuilt camera.
      CameraBuilder.default()
    }
  }
}

private struct CustomCamera: View {
  init(
    settings _: CameraSettings,
    url _: URL?,
    metadata _: [String: Any]?,
    result _: @escaping CameraBuilder.CameraBuilderResult,
  ) {}

  var body: some View {
    Text("Custom Camera")
  }
}

```

```kotlin file=@cesdk_flutter_examples/../android/app/src/main/kotlin/ly/img/editor/flutter/showcases/guides/ConfigurationGuide.kt reference-only
package ly.img.editor.flutter.showcases.guides

import androidx.compose.runtime.Composable
import ly.img.camera.core.CameraLayoutMode
import ly.img.camera.core.CameraMode
import ly.img.camera.core.CameraResult
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.videos
import ly.img.camera.flutter.plugin.IMGLYCameraPlugin
import ly.img.editor.flutter.plugin.IMGLYEditorPlugin
import ly.img.editor.flutter.plugin.builder.EditorBuilder
import ly.img.editor.flutter.plugin.builder.EditorBuilderResult
import ly.img.editor.flutter.plugin.model.EditorSettings

private fun useCustomEditor() {
    IMGLYEditorPlugin.builderClosure = { _, metadata ->
        if (metadata?.get("custom") == true) {
            EditorBuilder.custom { settings, _, _, result, onClose ->
                @Composable {
                    CustomEditor(settings, result, onClose)
                }
            }
        } else {
            EditorBuilder.design()
        }
    }
}

private fun customizeCamera() {
    // Configure the [CaptureMedia.Input].
    IMGLYCameraPlugin.configurationClosure = {
        /*
         * This closure requires returning a [CaptureMedia.Input].
         *
         * You can access the following parameters:
         * - "cameraSettings": The CameraSettings passed from the Flutter side.
         * - "engineConfiguration": The EngineConfiguration that includes your license.
         * - "metadata": Metadata passed from the Flutter side.
         * - "videoUri": The video reaction URL passed from Flutter, or null.
         */

        if (metadata["is_reactions"] == true) {
            CaptureMedia.Input(
                engineConfiguration = engineConfiguration,
                cameraMode = CameraMode.Reaction(
                    videoUri ?: throw RuntimeException("Missing video URL."),
                    cameraLayoutMode = CameraLayoutMode.Horizontal,
                    positionsSwapped = false,
                ),
            )
        } else {
            // Simply return null to use the default camera configuration.
            null
        }
    }

    // Adding custom metadata to the CameraResult.
    IMGLYCameraPlugin.resultClosure = {
        /*
         * This closure allows you to add custom metadata of type [Map<String, Any?>] to the CameraResult.
         * You can access the following values:
         * - "cameraResult": The native CameraResult returned by the camera.
         * - "inputMetadata": Metadata passed from the Flutter side when the camera was opened.
         *
         * The return value must be a [Map<String, Any?>], which will be passed to the Dart-side
         * representation of the CameraResult.
         *
         * Notes:
         * - Use `mapOf<String, Any?>()` to return key-value pairs.
         * - Return `null` if no metadata should be added.
         */

        // Example: Read the result data...
        val recordings = when (val result = cameraResult) {
            is CameraResult.Captures -> result.captures.videos
            is CameraResult.Reaction -> result.reaction
            else -> emptyList()
        }

        // Return a custom metadata map
        mapOf(
            "MY_CUSTOM_KEY" to "MY_CUSTOM_VALUE",
        )
    }
}

@Composable
private fun CustomEditor(
    settings: EditorSettings,
    result: EditorBuilderResult,
    onClose: (Throwable?) -> Unit,
) {
}
```

The `@imgly/camera-flutter` Flutter module is built on top of the native Android and iOS UI implementation and has no dedicated Flutter UI.
However, you still have access to the same customization options as for iOS and an interface for Android.
To use them you need to configure them natively for both platforms.
Further, the most important settings can be set from Flutter directly.

## Flutter Customization

From within Flutter directly, you can modify the most important camera behavior settings.

### CameraSettings

All the basic configuration settings are part of the `EngineSettings` which are required to initialize the camera.

- `license` – the license to activate the Engine with.
- `userID` – an optional unique ID tied to your application's user. This helps us accurately calculate monthly active users (MAU). Especially useful when one person uses the app on multiple devices with a sign-in feature, ensuring they're counted once. Providing this aids in better data accuracy. The default value is `nil`.

```dart highlight-configuration-dart
final settings = CameraSettings(
    license:
        "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
    userId:
        "YOUR_USER_ID"); // A unique string to identify your user/session
```

### Capture Type and Count

The `configuration` field on `CameraSettings` lets you opt the camera into photo or mixed capture sessions:

- `captureType`: `CaptureType.video` (default), `CaptureType.photo`, or `CaptureType.mixed`. In `.mixed` mode the camera shows a photo/video toggle.
- `captureCount`: `CaptureCount.multi` (default) lets the user stack multiple captures into one session; `CaptureCount.single` returns after a single capture.
- `photoClipDuration`: the duration in seconds stamped on each captured photo. Defaults to `5`.

```dart
const settings = CameraSettings(
  license: 'YOUR_LICENSE_KEY',
  configuration: CameraConfiguration(
    captureType: CaptureType.photo,
    captureCount: CaptureCount.single,
  ),
);

final result = await IMGLYCamera.openCamera(settings);
// result.capture?.captures: List<Capture> (each carries `photo` or `video`).
```

### Reactions

You can optionally provide a `video` parameter which lets the user react to that video.

```dart highlight-camera-call-dart
final _ = await IMGLYCamera.openCamera(
  settings,
  // Optional, if you want to react to a video
  video: 'https://img.ly/static/ubq_video_samples/test30.mp4',
);
```

## Native Customization

In order to fully utilize the natively available customizations, the module comes with native interfaces for both iOS and Android.

### iOS

The customization layer for iOS is written in **Swift** and available via the `IMGLYCameraPlugin` class.
The camera that is opened via the plugin can be completely customized and exchanged.
For this to work you can use the static `IMGLYCameraPlugin.builderClosure` which provides optional `metadata`
with which you can provide any prebuilt or custom camera view. The `metadata` parameter of the `openCamera` function can be utilized
to provide customization details from the Dart side of your app to the native side:

You can either use the `CameraBuilder.default` implementation or in case you want a completely custom UI, you can use the `CameraBuilder.custom` function that allows you to return a custom `View` based on a given `CameraSettings`, `URL`, `metadata` and an `CameraBuilderResult`:

```swift highlight-camera-configuration-swift
func configureCamera() {
  IMGLYCameraPlugin.builderClosure = { metadata in
    // Make decisions based on your own metadata.
    if metadata?["use_custom_camera"] as? Bool == true {
      // Return your custom camera.
      CameraBuilder.custom { settings, url, metadata, result in
        CustomCamera(settings: settings, url: url, metadata: metadata, result: result)
      }
    } else {
      // Return a custom or prebuilt camera.
      CameraBuilder.default()
    }
  }
}

private struct CustomCamera: View {
  init(
    settings _: CameraSettings,
    url _: URL?,
    metadata _: [String: Any]?,
    result _: @escaping CameraBuilder.CameraBuilderResult,
  ) {}

  var body: some View {
    Text("Custom Camera")
  }
}
```

### Android

On Android, the module comes with two interfaces for modifications:

#### CameraInputClosure

The `CameraInputClosure` can be used to provide a custom `CaptureMedia.Input` based on given `metadata`.
It is accessible via the `IMGLYCameraPlugin.configurationClosure`.

```kotlin highlight-camera-configuration-closure-kotlin
    // Configure the [CaptureMedia.Input].
    IMGLYCameraPlugin.configurationClosure = {
        /*
         * This closure requires returning a [CaptureMedia.Input].
         *
         * You can access the following parameters:
         * - "cameraSettings": The CameraSettings passed from the Flutter side.
         * - "engineConfiguration": The EngineConfiguration that includes your license.
         * - "metadata": Metadata passed from the Flutter side.
         * - "videoUri": The video reaction URL passed from Flutter, or null.
         */

        if (metadata["is_reactions"] == true) {
            CaptureMedia.Input(
                engineConfiguration = engineConfiguration,
                cameraMode = CameraMode.Reaction(
                    videoUri ?: throw RuntimeException("Missing video URL."),
                    cameraLayoutMode = CameraLayoutMode.Horizontal,
                    positionsSwapped = false,
                ),
            )
        } else {
            // Simply return null to use the default camera configuration.
            null
        }
    }
```

#### CameraResultClosure

The `CameraResultClosure` can be used to return a custom `CameraResult` based on the result returned by the camera.
It is accessible via the `IMGLYCameraPlugin.resultClosure`.

```kotlin highlight-camera-result-closure-kotlin
    // Adding custom metadata to the CameraResult.
    IMGLYCameraPlugin.resultClosure = {
        /*
         * This closure allows you to add custom metadata of type [Map<String, Any?>] to the CameraResult.
         * You can access the following values:
         * - "cameraResult": The native CameraResult returned by the camera.
         * - "inputMetadata": Metadata passed from the Flutter side when the camera was opened.
         *
         * The return value must be a [Map<String, Any?>], which will be passed to the Dart-side
         * representation of the CameraResult.
         *
         * Notes:
         * - Use `mapOf<String, Any?>()` to return key-value pairs.
         * - Return `null` if no metadata should be added.
         */

        // Example: Read the result data...
        val recordings = when (val result = cameraResult) {
            is CameraResult.Captures -> result.captures.videos
            is CameraResult.Reaction -> result.reaction
            else -> emptyList()
        }

        // Return a custom metadata map
        mapOf(
            "MY_CUSTOM_KEY" to "MY_CUSTOM_VALUE",
        )
    }
```

## Full Code

Here's the code for all three files:

### camera\_configuration\_solution.dart

```dart file=@cesdk_flutter_examples/camera-guides-configuration/camera_configuration_solution.dart
import "package:imgly_camera/imgly_camera.dart";

class CameraConfigurationSolution {
  /// Opens the camera.
  void openCamera() async {
    final settings = CameraSettings(
        license:
            "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
        userId:
            "YOUR_USER_ID"); // A unique string to identify your user/session

    final _ = await IMGLYCamera.openCamera(
      settings,
      // Optional, if you want to react to a video
      video: 'https://img.ly/static/ubq_video_samples/test30.mp4',
    );
  }
}
```

### ConfigurationGuide.swift

```swift file=@cesdk_flutter_examples/../ios/Runner/Guides/ConfigurationGuide.swift
import imgly_camera
import imgly_editor
import SwiftUI

func useCustomEditor() {
  IMGLYEditorPlugin.builderClosure = { _, metadata in
    // Make decisions based on your own metadata.
    if metadata?["use_custom_editor"] as? Bool == true {
      // Return your custom editor.
      EditorBuilder.custom { settings, _, _, result in
        CustomEditor(settings: settings, result: result)
      }
    } else {
      // Return a custom or prebuilt editor.
      EditorBuilder.design()
    }
  }
}

private struct CustomEditor: View {
  init(settings _: EditorSettings, result _: @escaping EditorBuilder.EditorBuilderResult) {}

  var body: some View {
    Text("Custom Editor")
  }
}

func configureCamera() {
  IMGLYCameraPlugin.builderClosure = { metadata in
    // Make decisions based on your own metadata.
    if metadata?["use_custom_camera"] as? Bool == true {
      // Return your custom camera.
      CameraBuilder.custom { settings, url, metadata, result in
        CustomCamera(settings: settings, url: url, metadata: metadata, result: result)
      }
    } else {
      // Return a custom or prebuilt camera.
      CameraBuilder.default()
    }
  }
}

private struct CustomCamera: View {
  init(
    settings _: CameraSettings,
    url _: URL?,
    metadata _: [String: Any]?,
    result _: @escaping CameraBuilder.CameraBuilderResult,
  ) {}

  var body: some View {
    Text("Custom Camera")
  }
}

```

### ConfigurationGuide.kt

```kotlin file=@cesdk_flutter_examples/../android/app/src/main/kotlin/ly/img/editor/flutter/showcases/guides/ConfigurationGuide.kt
package ly.img.editor.flutter.showcases.guides

import androidx.compose.runtime.Composable
import ly.img.camera.core.CameraLayoutMode
import ly.img.camera.core.CameraMode
import ly.img.camera.core.CameraResult
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.videos
import ly.img.camera.flutter.plugin.IMGLYCameraPlugin
import ly.img.editor.flutter.plugin.IMGLYEditorPlugin
import ly.img.editor.flutter.plugin.builder.EditorBuilder
import ly.img.editor.flutter.plugin.builder.EditorBuilderResult
import ly.img.editor.flutter.plugin.model.EditorSettings

private fun useCustomEditor() {
    IMGLYEditorPlugin.builderClosure = { _, metadata ->
        if (metadata?.get("custom") == true) {
            EditorBuilder.custom { settings, _, _, result, onClose ->
                @Composable {
                    CustomEditor(settings, result, onClose)
                }
            }
        } else {
            EditorBuilder.design()
        }
    }
}

private fun customizeCamera() {
    // Configure the [CaptureMedia.Input].
    IMGLYCameraPlugin.configurationClosure = {
        /*
         * This closure requires returning a [CaptureMedia.Input].
         *
         * You can access the following parameters:
         * - "cameraSettings": The CameraSettings passed from the Flutter side.
         * - "engineConfiguration": The EngineConfiguration that includes your license.
         * - "metadata": Metadata passed from the Flutter side.
         * - "videoUri": The video reaction URL passed from Flutter, or null.
         */

        if (metadata["is_reactions"] == true) {
            CaptureMedia.Input(
                engineConfiguration = engineConfiguration,
                cameraMode = CameraMode.Reaction(
                    videoUri ?: throw RuntimeException("Missing video URL."),
                    cameraLayoutMode = CameraLayoutMode.Horizontal,
                    positionsSwapped = false,
                ),
            )
        } else {
            // Simply return null to use the default camera configuration.
            null
        }
    }

    // Adding custom metadata to the CameraResult.
    IMGLYCameraPlugin.resultClosure = {
        /*
         * This closure allows you to add custom metadata of type [Map<String, Any?>] to the CameraResult.
         * You can access the following values:
         * - "cameraResult": The native CameraResult returned by the camera.
         * - "inputMetadata": Metadata passed from the Flutter side when the camera was opened.
         *
         * The return value must be a [Map<String, Any?>], which will be passed to the Dart-side
         * representation of the CameraResult.
         *
         * Notes:
         * - Use `mapOf<String, Any?>()` to return key-value pairs.
         * - Return `null` if no metadata should be added.
         */

        // Example: Read the result data...
        val recordings = when (val result = cameraResult) {
            is CameraResult.Captures -> result.captures.videos
            is CameraResult.Reaction -> result.reaction
            else -> emptyList()
        }

        // Return a custom metadata map
        mapOf(
            "MY_CUSTOM_KEY" to "MY_CUSTOM_VALUE",
        )
    }
}

@Composable
private fun CustomEditor(
    settings: EditorSettings,
    result: EditorBuilderResult,
    onClose: (Throwable?) -> Unit,
) {
}
```



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support