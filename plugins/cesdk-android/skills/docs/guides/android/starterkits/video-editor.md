> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Starter Kits](../starterkits.md) > [Video Editor](./video-editor.md)

---

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-video/app/src/main/kotlin/ly/img/starterkit/example/ExampleBaseUri.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorBaseUriScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        baseUri = "file:///android_asset".toUri(), // this points to android assets
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-video/app/src/main/kotlin/ly/img/starterkit/example/ExampleComposeNavigationScreen.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

// onClose should pop screen from the backstack of jetpack compose navigation
@Composable
fun EditorScreen(onClose: (Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-video/app/src/main/kotlin/ly/img/starterkit/example/ExampleRenderTarget.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.engine.EngineRenderTarget

@Composable
fun EditorRenderTargetScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        engineRenderTarget = EngineRenderTarget.SURFACE_VIEW, // EngineRenderTarget.SURFACE_VIEW, EngineRenderTarget.TEXTURE_VIEW
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-video/app/src/main/kotlin/ly/img/starterkit/example/ExampleUIMode.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.EditorUiMode
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorUiModeScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        uiMode = EditorUiMode.SYSTEM, // EditorUiMode.SYSTEM, EditorUiMode.LIGHT, EditorUiMode.DARK
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-video/app/src/main/kotlin/ly/img/starterkit/example/ExampleVideoDurationConstraints.kt reference-only
package ly.img.starterkit.example

import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.event.EditorEvent
import kotlin.time.Duration.Companion.seconds

fun VideoConfigurationBuilder.onLoaded() {
    // Enforce all videos to be between 10 and 20 seconds
    val event = EditorEvent.ApplyVideoDurationConstraints(
        minDuration = 10.seconds,
        maxDuration = 20.seconds,
    )
    editorContext.eventHandler.send(event)
    // Existing body here
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-video/starter-kit/src/main/kotlin/ly/img/editor/configuration/video/EditorActivity.kt reference-only
package ly.img.editor.configuration.video

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import ly.img.editor.Editor
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

/**
 * Encapsulated editor to be used in legacy activity navigation.
 * Delete this file if you are using jetpack compose navigation.
 */
class EditorActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // This is required to remove the default action bar on top.
        setTheme(android.R.style.Theme_Material_Light_NoActionBar)
        // This is required, so that the editor is displayed full screen on relatively older devices.
        enableEdgeToEdge()
        setContent {
            Editor(
                license = null, // pass null or empty for evaluation mode with watermark
                configuration = {
                    EditorConfiguration.remember(::VideoConfigurationBuilder)
                },
                onClose = {
                    // Finish the activity, potentially handle errors.
                    finish()
                },
            )
        }
    }
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-video/starter-kit/src/main/kotlin/ly/img/editor/configuration/video/callback/OnCreate.kt reference-only
@file:OptIn(UnstableEditorApi::class)
@file:Suppress("UnusedReceiverParameter")

package ly.img.editor.configuration.video.callback

import androidx.core.net.toUri
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.UnstableEditorApi
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.editor.core.library.data.SystemGalleryAssetSource
import ly.img.editor.core.library.data.SystemGalleryPermission
import ly.img.engine.Color

/**
 * The callback that is invoked when the editor is created.
 */
suspend fun VideoConfigurationBuilder.onCreate(
    preCreateScene: suspend VideoConfigurationBuilder.() -> Unit = {
        onPreCreateScene()
    },
    createScene: suspend VideoConfigurationBuilder.() -> Unit = {
        onCreateScene()
    },
    loadAssetSources: suspend VideoConfigurationBuilder.() -> Unit = {
        onLoadAssetSources()
    },
    postCreateScene: suspend VideoConfigurationBuilder.() -> Unit = {
        onPostCreateScene()
    },
    finally: suspend VideoConfigurationBuilder.() -> Unit = {
        onCreateFinally()
    },
) {
    try {
        preCreateScene()
        createScene()
        loadAssetSources()
        postCreateScene()
    } finally {
        finally()
    }
}

/**
 * The callback that is invoked before the scene is created.
 */
fun VideoConfigurationBuilder.onPreCreateScene() {
    showLoading = true
    val engine = editorContext.engine
    engine.editor.setSettingEnum(keypath = "touch/pinchAction", value = "Scale")
    engine.editor.setSettingBoolean(
        keypath = "controlGizmo/showRotateHandles",
        value = false,
    )
    engine.editor.setSettingBoolean(
        keypath = "controlGizmo/showScaleHandles",
        value = false,
    )
    engine.editor.setSettingBoolean(keypath = "controlGizmo/showMoveHandles", value = false)
    engine.editor.setSettingBoolean(keypath = "touch/singlePointPanning", value = false)
    engine.editor.setSettingColor(
        keypath = "page/innerBorderColor",
        value = Color.fromRGBA(0.67f, 0.67f, 0.67f, 0.5f),
    )
}

/**
 * The callback that is responsible for creating the scene.
 */
suspend fun VideoConfigurationBuilder.onCreateScene() {
    getOrLoadScene(sceneUri = "file:///android_asset/scene/video.scene".toUri())
}

/**
 * The callback that loads all the required assets sources.
 */
suspend fun VideoConfigurationBuilder.onLoadAssetSources() {
    // Load asset sources in parallel from content.json files
    coroutineScope {
        val baseUri = editorContext.baseUri
        val sourceIds = listOf(
            "ly.img.sticker",
            "ly.img.vector.shape",
            "ly.img.filter",
            "ly.img.color.palette",
            "ly.img.effect",
            "ly.img.blur",
            "ly.img.typeface",
            "ly.img.crop.presets",
            "ly.img.page.presets",
            "ly.img.text",
            "ly.img.text.styles",
            "ly.img.text.curves",
            "ly.img.text.components",
            "ly.img.image",
            "ly.img.audio",
            "ly.img.video",
        )
        sourceIds.forEach { id ->
            launch {
                editorContext.engine.asset.addLocalSourceFromJSON(
                    contentUri = "$baseUri/$id/content.json".toUri(),
                )
            }
        }
    }

    // Load local asset sources
    editorContext.engine.asset.addLocalSource(
        sourceId = "ly.img.image.upload",
        supportedMimeTypes = listOf(
            "image/jpeg",
            "image/png",
            "image/heic",
            "image/heif",
            "image/svg+xml",
            "image/gif",
            "image/apng",
            "image/bmp",
        ),
    )

    editorContext.engine.asset.addLocalSource(
        sourceId = "ly.img.audio.upload",
        supportedMimeTypes = listOf(
            "audio/x-m4a",
            "audio/mp3",
            "audio/mpeg",
        ),
    )
    editorContext.engine.asset.addLocalSource(
        sourceId = "ly.img.video.upload",
        supportedMimeTypes = listOf(
            "video/mp4",
        ),
    )

    // Register gallery asset sources
    listOf(
        AssetSourceType.GalleryAllVisuals,
        AssetSourceType.GalleryImage,
        AssetSourceType.GalleryVideo,
    ).forEach { type ->
        editorContext.engine.asset.addSource(
            source = SystemGalleryAssetSource(
                context = editorContext.engine.applicationContext,
                type = type,
            ),
        )
    }
    SystemGalleryPermission.setMode(systemGalleryConfiguration)
}

/**
 * The callback that is invoked right after [onCreateScene], after the scene is created.
 */
fun VideoConfigurationBuilder.onPostCreateScene() {
    // Do nothing
}

/**
 * The callback that is invoked as the last step of [onCreate].
 * It always runs, no matter success or failure on previous steps.
 */
fun VideoConfigurationBuilder.onCreateFinally() {
    showLoading = false
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-video/starter-kit/src/main/kotlin/ly/img/editor/configuration/video/callback/OnExport.kt reference-only
package ly.img.editor.configuration.video.callback

import kotlinx.coroutines.CancellationException
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.configuration.video.model.ExportStatus
import ly.img.engine.ExportVideoOptions
import ly.img.engine.MimeType
import ly.img.engine.VideoBitrate
import java.nio.ByteBuffer

/**
 * The callback that is invoked when the export button is clicked.
 */
suspend fun VideoConfigurationBuilder.onExport(
    preExport: suspend VideoConfigurationBuilder.() -> Unit = {
        onPreExport()
    },
    exportByteBuffer: suspend VideoConfigurationBuilder.() -> ByteBuffer = {
        onExportByteBuffer()
    },
    postExport: suspend VideoConfigurationBuilder.(ByteBuffer) -> Unit = {
        onPostExport(it)
    },
    error: suspend VideoConfigurationBuilder.(Exception) -> Unit = {
        onExportError(it)
    },
    finally: suspend VideoConfigurationBuilder.() -> Unit = {
        onExportFinally()
    },
) {
    try {
        preExport()
        val result = exportByteBuffer()
        postExport(result)
    } catch (exception: Exception) {
        error(exception)
    } finally {
        finally()
    }
}

/**
 * The callback that is invoked before the export is started.
 */
fun VideoConfigurationBuilder.onPreExport() {
    exportStatus = ExportStatus.Loading(progress = 0F)
}

/**
 * The callback that exports the content of the editor into [ByteBuffer].
 */
suspend fun VideoConfigurationBuilder.onExportByteBuffer(): ByteBuffer {
    val targetDesignBlock = requireNotNull(editorContext.engine.scene.getCurrentPage())
    return editorContext.engine.block.exportVideo(
        block = targetDesignBlock,
        timeOffset = 0.0,
        duration = editorContext.engine.block.getDuration(targetDesignBlock),
        mimeType = MimeType.MP4,
        progressCallback = { progress ->
            val lastExportStatus = exportStatus
            val newProgress = progress.encodedFrames.toFloat() / progress.totalFrames
            // Update export UI whenever the progress changes
            if (lastExportStatus !is ExportStatus.Loading || newProgress >= lastExportStatus.progress + 0.01F) {
                exportStatus = ExportStatus.Loading(progress = newProgress)
            }
        },
        // videoBitrate: VideoBitrate.Auto derives a bounded bitrate from the resolution/framerate.
        options = ExportVideoOptions(videoBitrate = VideoBitrate.Auto),
    )
}

/**
 * The callback that is invoked after [onExportByteBuffer] and handles its output.
 */
suspend fun VideoConfigurationBuilder.onPostExport(byteBuffer: ByteBuffer) {
    val file = writeToFile(byteBuffer = byteBuffer, mimeType = MimeType.MP4)
    exportStatus = ExportStatus.Success(file = file, mimeType = MimeType.MP4)
}

/**
 * The callback that is invoked in case any of the export functions throw an exception.
 */
fun VideoConfigurationBuilder.onExportError(error: Exception) {
    if (error is CancellationException) {
        exportStatus = null
        throw error
    } else {
        exportStatus = ExportStatus.Error(exception = error)
    }
}

/**
 * The callback that is invoked as the last step of [onExportByteBuffer].
 * It always runs, no matter success or failure on previous steps.
 */
fun VideoConfigurationBuilder.onExportFinally() {
    showCancelExportConfirmationDialog = false
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-video/starter-kit/src/main/kotlin/ly/img/editor/configuration/video/component/Dock.kt reference-only
@file:Suppress("UnusedReceiverParameter", "UnusedFlow")
@file:OptIn(ExperimentalCoroutinesApi::class)

package ly.img.editor.configuration.video.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import kotlinx.coroutines.ExperimentalCoroutinesApi
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.EditorTrigger
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberAudiosLibrary
import ly.img.editor.core.component.rememberOverlaysLibrary
import ly.img.editor.core.component.rememberResizeAll
import ly.img.editor.core.component.rememberStickersAndShapesLibrary
import ly.img.editor.core.component.rememberSystemCamera
import ly.img.editor.core.component.rememberSystemGallery
import ly.img.editor.core.component.rememberTextLibrary
import ly.img.editor.core.component.rememberVoiceoverRecord
import ly.img.editor.core.iconpack.AddCameraBackground
import ly.img.editor.core.iconpack.AddGalleryBackground
import ly.img.editor.core.iconpack.IconPack

/**
 * The configuration of the component that is displayed as horizontal list of items at the bottom of the editor.
 */
@Composable
fun VideoConfigurationBuilder.rememberDock() = Dock.remember {
    scope = {
        val activeSceneTrigger by EditorTrigger.remember {
            editorContext.engine.scene.onActiveChanged()
        }
        // Update Dock whenever the active scene changes.
        remember(this, activeSceneTrigger) {
            Dock.Scope(parentScope = this)
        }
    }
    horizontalArrangement = {
        // All buttons should have equal size
        Arrangement.SpaceEvenly
    }
    listBuilder = {
        Dock.ListBuilder.remember {
            add {
                Dock.Button.rememberSystemGallery {
                    vectorIcon = { IconPack.AddGalleryBackground }
                }
            }
            add {
                // As an alternative to the system camera we also provide our own camera tech accessible via [Dock.Button.rememberImglyCamera].
                // In order to make it work the following dependency is required:
                // implementation "ly.img:camera:<same version as editor>".
                Dock.Button.rememberSystemCamera(captureVideo = { true }) {
                    vectorIcon = { IconPack.AddCameraBackground }
                }
            }
            add { Dock.Button.rememberOverlaysLibrary() }
            add { Dock.Button.rememberTextLibrary() }
            add { Dock.Button.rememberStickersAndShapesLibrary() }
            add { Dock.Button.rememberAudiosLibrary() }
            add { Dock.Button.rememberVoiceoverRecord() }
            add { Dock.Button.rememberResizeAll() }
        }
    }
}
```

Professional video editing for your Android app—edit clips, add effects, trim footage, and export to MP4. Runs entirely on the mobile device with no server dependencies.

![Video Editor starter kit screenshot](https://img.ly/cesdk_android_showcases/starter-kits/starter-kit-video/screenshot.png)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-video-editor-android/archive/refs/heads/v1.82.0-nightly.20260821.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-video-editor-android/tree/v1.82.0-nightly.20260821)

***

## Pre-Requisites

This guide assumes basic familiarity with Android and Kotlin. You will need:

- Latest Android Studio
- Kotlin: 1.9.10 or later
- Gradle: 8.4 or later
- Android: 7.0+ (API level 24+)

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Start with a complete, runnable Android starter kit project.

    ### Step 1: Clone the Repository

    ```bash
    git clone -b v1.82.0-nightly.20260821 https://github.com/imgly/starterkit-video-editor-android.git
    cd starterkit-video-editor-android
    ```

    ### Step 2: Open and Run

    [Create and launch](https://developer.android.com/studio/run/managing-avds) a new android emulator or use an existing one or connect a physical device with `USB Debugging` on.

    Open the project in Android Studio, sync gradle via `File -> Sync Project With Gradle Files` and run the `app` module from UI, or use:

    ```bash
    ./gradlew app:installDebug
    ```

    The sample app launches `MainActivity` that has "Launch Editor" button. Clicking it launches `EditorActivity`:

    ```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/video/EditorActivity.kt" highlight-starter-kit-activity-full
    package ly.img.editor.configuration.video

    import android.os.Bundle
    import androidx.activity.ComponentActivity
    import androidx.activity.compose.setContent
    import androidx.activity.enableEdgeToEdge
    import ly.img.editor.Editor
    import ly.img.editor.core.configuration.EditorConfiguration
    import ly.img.editor.core.configuration.remember

    /**
     * Encapsulated editor to be used in legacy activity navigation.
     * Delete this file if you are using jetpack compose navigation.
     */
    class EditorActivity : ComponentActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            // This is required to remove the default action bar on top.
            setTheme(android.R.style.Theme_Material_Light_NoActionBar)
            // This is required, so that the editor is displayed full screen on relatively older devices.
            enableEdgeToEdge()
            setContent {
                Editor(
                    license = null, // pass null or empty for evaluation mode with watermark
                    configuration = {
                        EditorConfiguration.remember(::VideoConfigurationBuilder)
                    },
                    onClose = {
                        // Finish the activity, potentially handle errors.
                        finish()
                    },
                )
            }
        }
    }
    ```
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate only the `starter-kit` library module into your existing Android app.

    ### Step 1: Run the Extraction Script From Your App Root

    Run this from your application root directory:

    ```bash
    repo="starterkit-video-editor-android"
    version="1.82.0-nightly.20260821"
    curl -0 "https://codeload.github.com/imgly/${repo}/tar.gz/refs/heads/v${version}" | tar -xz --strip-components=1 "${repo}-${version}/starter-kit"
    ```

    This extracts the `starter-kit/` library module into your android project.

    ### Step 2: Include the Module

    Declare the newly added android library module in your project:

    ```kotlin title = "settings.gradle.kts"
    include(":starter-kit")
    ```

    ### Step 3: Add Dependency in Your App Module

    Include the starter kit module dependency in your app module:

    ```kotlin title = "app/build.gradle.kts"
    dependencies {
      implementation(project(":starter-kit"))
    }
    ```

    ### Step 4: Include missing plugins

    Include plugins that may be missing in your project's root `build.gradle.kts` file:

    ```kotlin title = "build.gradle.kts"
    plugins {
        // Existing plugins here
        id("org.jetbrains.kotlin.plugin.compose") version "2.1.10" apply false
    }
    ```

    ### Step 5: Add the IMG.LY Maven Repository

    Add `IMG.LY` maven repository path in your project:

    ```kotlin title = "settings.gradle.kts"
    dependencyResolutionManagement {
        repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
        repositories {
            google()
            mavenCentral()
            maven {
                name = "IMG.LY Artifactory"
                url = uri("https://maven.img.ly/maven")
                mavenContent {
                    includeGroup("ly.img")
                }
            }
        }
    }
    ```

    If the project is open in Android Studio, sync gradle via `File -> Sync Project With Gradle Files` in order to make all dependencies available.

    ### Step 6: Launch the Editor From Your UI

    If you use jetpack compose navigation in your app, simply add a new navigation destination and invoke the following composable:

    ```kotlin highlight-starter-kit-composable
    import androidx.compose.runtime.Composable
    import ly.img.editor.Editor
    import ly.img.editor.configuration.video.VideoConfigurationBuilder
    import ly.img.editor.core.configuration.EditorConfiguration
    import ly.img.editor.core.configuration.remember

    // onClose should pop screen from the backstack of jetpack compose navigation
    @Composable
    fun EditorScreen(onClose: (Throwable?) -> Unit) {
        Editor(
            license = null, // pass null or empty for evaluation mode with watermark
            configuration = {
                EditorConfiguration.remember(::VideoConfigurationBuilder)
            },
            onClose = onClose,
        )
    }
    ```

    > **Delete EditorActivity:** You can delete `starter-kit/src/main/kotlin/ly/img/editor/configuration/video/EditorActivity.kt` as it is needed only for legacy navigation.

    If you do not use jetpack compose navigation and use legacy android navigation, the starter kit has a special `EditorActivity` class with full encapsulated logic:

    ```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/video/EditorActivity.kt" highlight-starter-kit-activity-full
    package ly.img.editor.configuration.video

    import android.os.Bundle
    import androidx.activity.ComponentActivity
    import androidx.activity.compose.setContent
    import androidx.activity.enableEdgeToEdge
    import ly.img.editor.Editor
    import ly.img.editor.core.configuration.EditorConfiguration
    import ly.img.editor.core.configuration.remember

    /**
     * Encapsulated editor to be used in legacy activity navigation.
     * Delete this file if you are using jetpack compose navigation.
     */
    class EditorActivity : ComponentActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            // This is required to remove the default action bar on top.
            setTheme(android.R.style.Theme_Material_Light_NoActionBar)
            // This is required, so that the editor is displayed full screen on relatively older devices.
            enableEdgeToEdge()
            setContent {
                Editor(
                    license = null, // pass null or empty for evaluation mode with watermark
                    configuration = {
                        EditorConfiguration.remember(::VideoConfigurationBuilder)
                    },
                    onClose = {
                        // Finish the activity, potentially handle errors.
                        finish()
                    },
                )
            }
        }
    }
    ```

    Simply launch the activity from the activity of your app. Optionally, you can pass parameters to the editor:

    ```kotlin
    import android.content.Intent
    import ly.img.editor.configuration.video.EditorActivity

    fun launchEditor() {
        // "this" is the current activity
        val intent = Intent(this, EditorActivity::class.java).also { 
            // Optionally pass parameters for EditorActivity to consume, i.e. your image/video/scene uri
            it.putExtra("my_param", "my_param_value")
        }
        startActivity(intent)
    }
    ```

    In case you want to consume the parameter in `EditorActivity`:

    ```kotlin
    class EditorActivity : ComponentActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            val param = intent.getStringExtra("my_param") ?: "default"
            ...
        }
    }
    ```
  </TabItem>
</Tabs>

The full implementation of the starter kit lives in the `starter-kit/` folder:

```text
starter-kit/
├── build.gradle.kts                                    # Starter kit library module config, includes ly.img:editor dependency
└── src/main/
    ├── AndroidManifest.xml                             # Starter kit manifest file, may contain permissions
    ├── assets/
    │   └── scene/
    │       └── video.scene                             # Default video scene that should be loaded
    └── kotlin/ly/img/editor/configuration/video/
        ├── EditorActivity.kt                           # Encapsulated editor for legacy navigation. Delete if you use jetpack compose navigation
        ├── VideoConfigurationBuilder.kt                # Editor configuration logic encapsulated in 1 place
        ├── callback/
        │   ├── OnCreate.kt                             # Editor initialization logic
        │   ├── OnExport.kt                             # Export flow and handling
        │   └── OnLoaded.kt                             # Post onCreate logic
        ├── component/
        │   ├── BottomPanel.kt                          # Bottom Panel component configuration
        │   ├── CanvasMenu.kt                           # Canvas Menu component configuration
        │   ├── Dock.kt                                 # Dock component configuration
        │   ├── InspectorBar.kt                         # Inspector Bar component configuration
        │   ├── NavigationBar.kt                        # Navigation Bar component configuration
        │   └── Overlay.kt                              # Overlay component configuration
        ├── iconPack/
        │   ├── CheckCircleOutline.kt                   # Check-circle with outline icon
        │   ├── ErrorOutline.kt                         # Error with outline icon
        │   └── IconPack.kt                             # Icon pack of the starter kit to access all the icons
        └── model/
            └── ExportStatus.kt                         # Export status model used by the overlay
```

## Starter Kit as a Dynamic Feature

Since `starter-kit` folder is an android library module, it is possible to turn it into a [dynamic feature](https://developer.android.com/guide/playcore/feature-delivery). This can be helpful if you want to lazy load the editor in order to reduce the download size of your app.

See [Bundle Size](../bundle-size.md) for more details.

## Configuring the Starter Kit

The starter kit that we provide contains a very generic structure and behavior, however we understand that every customer wants to configure it according to their needs. The good thing is that the starter kit implementation is part of your codebase and you can configure, add/remove/modify functionality as you wish.
In addition, you may want to configure the editor based on your business logic, i.e. restore the scene file from previous edits, display different dock items for different users etc.

This example demonstrates on how to pass, store and use external parameters in the starter kit.
First, declare a new property to the builder class:

```kotlin
...
import android.net.Uri

@Stable
class VideoConfigurationBuilder : BasicConfigurationBuilder() {
    /**
     * The scene uri that should be loaded in onCreate if not null.
     * Note that editorContext.mutableStateOf is used to store mutable objects in the editor scope that survive configuration changes.
     */
    var sceneUri: Uri? by editorContext.mutableStateOf(
        key = "your.package.name.state.sceneUri",
        initial = null,
    )
    ...
}
```

Next, read your external parameter from activity intent extras (or jetpack compose screen arguments) and assign to the property of the builder:

```kotlin
import androidx.core.net.toUri

class EditorActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ...
        val sceneUri = intent.getStringExtra("sceneUri")?.toUri()
        Editor(
            license = null, // pass null or empty for evaluation mode with watermark
            configuration = {
                EditorConfiguration.remember(::VideoConfigurationBuilder) {
                    sceneUri = sceneUri
                }
            },
            onClose = {
                // Finish the activity, ignore any errors.
                finish()
            },
        )
    }
}
```

Finally, make use of the property. The scene loading logic is located at `OnCreate.kt` file, as part of `onCreate` implementation (see next section for more details). We modify this function to load the `sceneUri` instead if the value is not null:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/video/callback/OnCreate.kt"
suspend fun VideoConfigurationBuilder.onCreateScene() {
    sceneUri?.let { safeSceneUri ->
        // Load the sceneUri if it's not null
        getOrLoadScene(sceneUri = safeSceneUri)
    } ?: run {
        // Otherwise stick to the default behavior of the starter kit
        getOrLoadScene(sceneUri = "file:///android_asset/scene/video.scene".toUri())
    }
}
```

## Set Up a Scene

The scene setup logic is located at `OnCreate.kt` file, as part of `onCreate` implementation:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/video/callback/OnCreate.kt" highlight-starter-kit-on-create-scene
suspend fun VideoConfigurationBuilder.onCreateScene() {
    getOrLoadScene(sceneUri = "file:///android_asset/scene/video.scene".toUri())
}
```

`getOrLoadScene` is a helper that loads an existing scene if available, or initializes one from `file:///android_asset/scene/video.scene` when no scene is active.

CE.SDK offers multiple ways to load scene into the editor. Choose the method that matches your use case:

```kotlin
// Load from an image uri - creates a new scene with the image
editorContext.engine.scene.createFromImage(imageUri = "https://example.com/photo.jpg".toUri())

// Load from a video uri - creates a new scene with the video
editorContext.engine.scene.createFromVideo(videoUri = "https://example.com/video.mp4".toUri())

// Load from a template archive - restores a previously saved project
editorContext.engine.scene.load(sceneUri = "https://example.com/template.zip".toUri())

// Create a blank canvas - starts with an empty video scene
editorContext.engine.scene.createForVideo()

// Load from a scene file - restores a scene from .scene file
editorContext.engine.scene.load(sceneUri = "https://example.com/saved.scene".toUri())
```

> **More Loading Options:** See [Open the Editor](../open-the-editor.md) for all available loading methods.

## Video Duration Constraints

Video duration constraints can be configured in the starter kit examples to enforce minimum and maximum clip durations.
Send `EditorEvent.ApplyVideoDurationConstraints` event before or after the existing logic of `onLoaded`:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/video/callback/OnLoaded.kt" highlight-starter-kit-constraints
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.event.EditorEvent
import kotlin.time.Duration.Companion.seconds

fun VideoConfigurationBuilder.onLoaded() {
    // Enforce all videos to be between 10 and 20 seconds
    val event = EditorEvent.ApplyVideoDurationConstraints(
        minDuration = 10.seconds,
        maxDuration = 20.seconds,
    )
    editorContext.eventHandler.send(event)
    // Existing body here
}
```

## Enable IMG.LY Camera

Instead of the system camera it is possible to use the camera feature provided by IMG.LY:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/video/component/Dock.kt" highlight-starter-kit-imgly-camera
Dock.ListBuilder.remember {
    add {
        Dock.Button.rememberSystemGallery {
            vectorIcon = { IconPack.AddGalleryBackground }
        }
    }
    add {
        // As an alternative to the system camera we also provide our own camera tech accessible via [Dock.Button.rememberImglyCamera].
        // In order to make it work the following dependency is required:
        // implementation "ly.img:camera:<same version as editor>".
        Dock.Button.rememberSystemCamera(captureVideo = { true }) {
            vectorIcon = { IconPack.AddCameraBackground }
        }
    }
    add { Dock.Button.rememberOverlaysLibrary() }
    add { Dock.Button.rememberTextLibrary() }
    add { Dock.Button.rememberStickersAndShapesLibrary() }
    add { Dock.Button.rememberAudiosLibrary() }
    add { Dock.Button.rememberVoiceoverRecord() }
    add { Dock.Button.rememberResizeAll() }
}
```

`Dock.Button.rememberSystemCamera` should be replaced by `Dock.Button.rememberImglyCamera`.

In addition, IMG.LY camera dependency should be added:

```kotlin title = "starter-kit/build.gradle.kts"
implementation "ly.img:camera:1.82.0-nightly.20260821"
```

> **IMG.LY Camera Version:** Note that the version of the camera dependency must match with the editor version in order to avoid interoperability issues.

## Customize Assets

The asset source setup is located in `OnCreate.kt` as part of `onCreate` implementation. Enable or disable individual sources:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/video/callback/OnCreate.kt" highlight-starter-kit-on-load-asset-sources
suspend fun VideoConfigurationBuilder.onLoadAssetSources() {
    // Load asset sources in parallel from content.json files
    coroutineScope {
        val baseUri = editorContext.baseUri
        val sourceIds = listOf(
            "ly.img.sticker",
            "ly.img.vector.shape",
            "ly.img.filter",
            "ly.img.color.palette",
            "ly.img.effect",
            "ly.img.blur",
            "ly.img.typeface",
            "ly.img.crop.presets",
            "ly.img.page.presets",
            "ly.img.text",
            "ly.img.text.styles",
            "ly.img.text.curves",
            "ly.img.text.components",
            "ly.img.image",
            "ly.img.audio",
            "ly.img.video",
        )
        sourceIds.forEach { id ->
            launch {
                editorContext.engine.asset.addLocalSourceFromJSON(
                    contentUri = "$baseUri/$id/content.json".toUri(),
                )
            }
        }
    }

    // Load local asset sources
    editorContext.engine.asset.addLocalSource(
        sourceId = "ly.img.image.upload",
        supportedMimeTypes = listOf(
            "image/jpeg",
            "image/png",
            "image/heic",
            "image/heif",
            "image/svg+xml",
            "image/gif",
            "image/apng",
            "image/bmp",
        ),
    )

    editorContext.engine.asset.addLocalSource(
        sourceId = "ly.img.audio.upload",
        supportedMimeTypes = listOf(
            "audio/x-m4a",
            "audio/mp3",
            "audio/mpeg",
        ),
    )
    editorContext.engine.asset.addLocalSource(
        sourceId = "ly.img.video.upload",
        supportedMimeTypes = listOf(
            "video/mp4",
        ),
    )

    // Register gallery asset sources
    listOf(
        AssetSourceType.GalleryAllVisuals,
        AssetSourceType.GalleryImage,
        AssetSourceType.GalleryVideo,
    ).forEach { type ->
        editorContext.engine.asset.addSource(
            source = SystemGalleryAssetSource(
                context = editorContext.engine.applicationContext,
                type = type,
            ),
        )
    }
    SystemGalleryPermission.setMode(systemGalleryConfiguration)
}
```

> **More Asses Sources:** See [Import Media](../import-media.md) for all available assets and loading mechanisms.

For production deployments, self-hosting assets is required—the IMG.LY CDN is intended for development only. See [Serve Assets](../serve-assets.md) for downloading assets, configuring `baseUri` and excluding unused sources to optimize load times.

## Customize Export Functionality

Export handling logic is located in `OnExport.kt` as part of `onExport` callback.

`onExportByteBuffer` controls what should be exported from the scene. It can be a scene or set of design blocks.
For video editor, it makes sense to export the scene to an MP4 content:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/video/callback/OnExport.kt" highlight-starter-kit-on-export-byte-buffer
suspend fun VideoConfigurationBuilder.onExportByteBuffer(): ByteBuffer {
    val targetDesignBlock = requireNotNull(editorContext.engine.scene.getCurrentPage())
    return editorContext.engine.block.exportVideo(
        block = targetDesignBlock,
        timeOffset = 0.0,
        duration = editorContext.engine.block.getDuration(targetDesignBlock),
        mimeType = MimeType.MP4,
        progressCallback = { progress ->
            val lastExportStatus = exportStatus
            val newProgress = progress.encodedFrames.toFloat() / progress.totalFrames
            // Update export UI whenever the progress changes
            if (lastExportStatus !is ExportStatus.Loading || newProgress >= lastExportStatus.progress + 0.01F) {
                exportStatus = ExportStatus.Loading(progress = newProgress)
            }
        },
        // videoBitrate: VideoBitrate.Auto derives a bounded bitrate from the resolution/framerate.
        options = ExportVideoOptions(videoBitrate = VideoBitrate.Auto),
    )
}
```

> **More Export Options:** See [Export](../export-save-publish/export.md) and [Save](../export-save-publish/save.md) guides for all available export and scene calls.

`onPostExport` controls what should happen to the exported `ByteBuffer` content. You can upload the result to your server, save it to the device gallery
or simply close the editor via `editorContext.eventHandler.send(EditorEvent.CloseEditor())`. Check `writeToFile`, `shareFile` and `shareUri` helper functions for potential implementations:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/video/callback/OnExport.kt" highlight-starter-kit-on-post-export
suspend fun VideoConfigurationBuilder.onPostExport(byteBuffer: ByteBuffer) {
    val file = writeToFile(byteBuffer = byteBuffer, mimeType = MimeType.MP4)
    exportStatus = ExportStatus.Success(file = file, mimeType = MimeType.MP4)
}
```

***

## Customize (Optional)

### Base Uri

The starter kit does not make any `baseUri` configuration, which means it points to `https://cdn.img.ly/packages/imgly/cesdk-engine/1.82.0-nightly.20260821/assets`. If you want to store them in your own CDN or locally, assets can be accessed via [zip file](https://cdn.img.ly/packages/imgly/cesdk-engine/1.82.0-nightly.20260821/imgly-assets.zip). For example, if you want to store them locally, unzip the content and place at `starter-kit/src/main/assets`:

```kotlin highlight-starter-kit-base-uri
import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorBaseUriScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        baseUri = "file:///android_asset".toUri(), // this points to android assets
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

### UI Mode

CE.SDK supports light and dark ui modes out of the box, plus automatic system preference detection. Switch between themes programmatically:

```kotlin highlight-starter-kit-ui-mode
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.EditorUiMode
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorUiModeScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        uiMode = EditorUiMode.SYSTEM, // EditorUiMode.SYSTEM, EditorUiMode.LIGHT, EditorUiMode.DARK
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

See [Theming](../user-interface/appearance/theming.md) for more details.

### Native Android Canvas

CE.SDK supports rendering on two of the most popular native android views that allow GPU rendering: [TextureView](https://developer.android.com/reference/android/view/TextureView) and [SurfaceView](https://developer.android.com/reference/android/view/SurfaceView):

```kotlin highlight-starter-kit-engine-render-target
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.engine.EngineRenderTarget

@Composable
fun EditorRenderTargetScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        engineRenderTarget = EngineRenderTarget.SURFACE_VIEW, // EngineRenderTarget.SURFACE_VIEW, EngineRenderTarget.TEXTURE_VIEW
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

### Localization

See [Localization](../user-interface/localization.md) for supported languages, adding support to new languages and replacing existing keys.

### UI Layout

All the configurable components are located at `starter-kit/src/main/kotlin/ly/img/editor/configuration/video/component`:

- `BottomPanel.kt` - `Timeline` component is added here.
- `CanvasMenu.kt` - see [Canvas Menu](../user-interface/customization/canvas-menu.md) for full configuration options.
- `Dock.kt` - see [Dock](../user-interface/customization/dock.md) for full configuration options.
- `InspectorBar.kt` - see [Inspector Bar](../user-interface/customization/inspector-bar.md) for full configuration options.
- `NavigationBar.kt` - see [Navigation Bar](../user-interface/customization/navigation-bar.md) for full configuration options.
- `Overlay.kt` - see [Overlay](../user-interface/appearance/overlay.md) for full configuration options. Video export content is rendered here via `VideoOverlay` composable function.

***

## Troubleshooting

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

### Editor doesn't load

- **Check onCreate**: Ensure `onCreate` callback loads a scene and no coroutine is stuck infinitly
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check logcat errors**: Look for error in Android logcat

### Assets don't appear

- **Check network requests**: Make sure the device/emulator is connected to the internet
- **Self-host assets for production**: See [Serve Assets](../serve-assets.md) to host assets on your infrastructure
- **Check logcat errors**: Look for error in Android logcat

### Export fails or produces blank images

- **Wait for content to load**: Ensure images are fully loaded before exporting
- **Check logcat errors**: Look for error in Android logcat

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](../configuration.md) – Complete list of initialization options
- [Serve Assets](../serve-assets.md) – Self-host engine assets for production
- [Theming](../user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](../user-interface/localization.md) – Add translations and language support



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support