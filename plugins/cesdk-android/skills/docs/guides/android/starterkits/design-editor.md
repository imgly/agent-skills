> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Starter Kits](../starterkits.md) > [Design Editor](./design-editor.md)

---

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-design/app/src/main/kotlin/ly/img/starterkit/example/ExampleBaseUri.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorBaseUriScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        baseUri = "file:///android_asset".toUri(), // this points to android assets
        configuration = {
            EditorConfiguration.remember(::DesignConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-design/app/src/main/kotlin/ly/img/starterkit/example/ExampleComposeNavigationScreen.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

// onClose should pop screen from the backstack of jetpack compose navigation
@Composable
fun EditorScreen(onClose: (Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember(::DesignConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-design/app/src/main/kotlin/ly/img/starterkit/example/ExampleRenderTarget.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.engine.EngineRenderTarget

@Composable
fun EditorRenderTargetScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        engineRenderTarget = EngineRenderTarget.SURFACE_VIEW, // EngineRenderTarget.SURFACE_VIEW, EngineRenderTarget.TEXTURE_VIEW
        configuration = {
            EditorConfiguration.remember(::DesignConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-design/app/src/main/kotlin/ly/img/starterkit/example/ExampleUIMode.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.EditorUiMode
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorUiModeScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        uiMode = EditorUiMode.SYSTEM, // EditorUiMode.SYSTEM, EditorUiMode.LIGHT, EditorUiMode.DARK
        configuration = {
            EditorConfiguration.remember(::DesignConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-design/starter-kit/src/main/kotlin/ly/img/editor/configuration/design/EditorActivity.kt reference-only
package ly.img.editor.configuration.design

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
                    EditorConfiguration.remember(::DesignConfigurationBuilder)
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

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-design/starter-kit/src/main/kotlin/ly/img/editor/configuration/design/callback/OnCreate.kt reference-only
package ly.img.editor.configuration.design.callback

import androidx.core.net.toUri
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.editor.core.library.data.SystemGalleryAssetSource
import ly.img.editor.core.library.data.SystemGalleryPermission
import ly.img.engine.DesignBlockType

/**
 * The callback that is invoked when the editor is created.
 */
suspend fun DesignConfigurationBuilder.onCreate(
    preCreateScene: suspend DesignConfigurationBuilder.() -> Unit = {
        onPreCreateScene()
    },
    createScene: suspend DesignConfigurationBuilder.() -> Unit = {
        onCreateScene()
    },
    loadAssetSources: suspend DesignConfigurationBuilder.() -> Unit = {
        onLoadAssetSources()
    },
    postCreateScene: suspend DesignConfigurationBuilder.() -> Unit = {
        onPostCreateScene()
    },
    finally: suspend DesignConfigurationBuilder.() -> Unit = {
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
fun DesignConfigurationBuilder.onPreCreateScene() {
    showLoading = true
    // Enable horizontal sliding between pages
    editorContext.engine.editor.setSettingBoolean(
        keypath = "features/pageCarouselEnabled",
        value = true,
    )
}

/**
 * The callback that is responsible for creating the scene.
 */
suspend fun DesignConfigurationBuilder.onCreateScene() {
    getOrLoadScene(sceneUri = "file:///android_asset/scene/design.scene".toUri())
}

/**
 * The callback that loads all the required assets sources.
 */
suspend fun DesignConfigurationBuilder.onLoadAssetSources() {
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
fun DesignConfigurationBuilder.onPostCreateScene() {
    editorContext.engine.block
        .findByType(DesignBlockType.Stack)
        .firstOrNull()
        ?.let {
            // Display all pages in a horizontal stack.
            editorContext.engine.block.setEnum(
                block = it,
                property = "stack/axis",
                value = "Horizontal",
            )
        }
}

/**
 * The callback that is invoked as the last step of [onCreate].
 * It always runs, no matter success or failure on previous steps.
 */
fun DesignConfigurationBuilder.onCreateFinally() {
    showLoading = false
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-design/starter-kit/src/main/kotlin/ly/img/editor/configuration/design/callback/OnExport.kt reference-only
package ly.img.editor.configuration.design.callback

import kotlinx.coroutines.CancellationException
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.engine.MimeType
import java.nio.ByteBuffer

/**
 * The callback that is invoked when the export button is clicked.
 */
suspend fun DesignConfigurationBuilder.onExport(
    preExport: suspend DesignConfigurationBuilder.() -> Unit = {
        onPreExport()
    },
    exportByteBuffer: suspend DesignConfigurationBuilder.() -> ByteBuffer = {
        onExportByteBuffer()
    },
    postExport: suspend DesignConfigurationBuilder.(ByteBuffer) -> Unit = {
        onPostExport(it)
    },
    error: suspend DesignConfigurationBuilder.(Exception) -> Unit = {
        onExportError(it)
    },
    finally: suspend DesignConfigurationBuilder.() -> Unit = {
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
fun DesignConfigurationBuilder.onPreExport() {
    showLoading = true
}

/**
 * The callback that exports the content of the editor into [ByteBuffer].
 */
suspend fun DesignConfigurationBuilder.onExportByteBuffer(): ByteBuffer = export(
    block = requireNotNull(editorContext.engine.scene.get()),
    mimeType = MimeType.PDF,
)

/**
 * The callback that is invoked after [onExportByteBuffer] and handles its output.
 */
suspend fun DesignConfigurationBuilder.onPostExport(byteBuffer: ByteBuffer) {
    val file = writeToFile(byteBuffer = byteBuffer, mimeType = MimeType.PDF)
    shareFile(file = file, mimeType = MimeType.PDF)
}

/**
 * The callback that is invoked in case any of the export functions throw an exception.
 */
fun DesignConfigurationBuilder.onExportError(error: Exception) {
    if (error is CancellationException) {
        throw error
    }
    this.error = error
}

/**
 * The callback that is invoked as the last step of [onExportByteBuffer].
 * It always runs, no matter success or failure on previous steps.
 */
fun DesignConfigurationBuilder.onExportFinally() {
    showLoading = false
}
```

Professional design editing for your Android app—create graphics, templates, and multi-page documents. Runs entirely on the mobile device with no server dependencies.

![Design Editor starter kit screenshot](https://img.ly/cesdk_android_showcases/starter-kits/starter-kit-design/screenshot.png)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-design-editor-android/archive/refs/heads/v1.82.0-nightly.20260826.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-design-editor-android/tree/v1.82.0-nightly.20260826)

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
    git clone -b v1.82.0-nightly.20260826 https://github.com/imgly/starterkit-design-editor-android.git
    cd starterkit-design-editor-android
    ```

    ### Step 2: Open and Run

    [Create and launch](https://developer.android.com/studio/run/managing-avds) a new android emulator or use an existing one or connect a physical device with `USB Debugging` on.

    Open the project in Android Studio, sync gradle via `File -> Sync Project With Gradle Files` and run the `app` module from UI, or use:

    ```bash
    ./gradlew app:installDebug
    ```

    The sample app launches `MainActivity` that has "Launch Editor" button. Clicking it launches `EditorActivity`:

    ```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/design/EditorActivity.kt" highlight-starter-kit-activity-full
    package ly.img.editor.configuration.design

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
                        EditorConfiguration.remember(::DesignConfigurationBuilder)
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
    repo="starterkit-design-editor-android"
    version="1.82.0-nightly.20260826"
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
    import ly.img.editor.configuration.design.DesignConfigurationBuilder
    import ly.img.editor.core.configuration.EditorConfiguration
    import ly.img.editor.core.configuration.remember

    // onClose should pop screen from the backstack of jetpack compose navigation
    @Composable
    fun EditorScreen(onClose: (Throwable?) -> Unit) {
        Editor(
            license = null, // pass null or empty for evaluation mode with watermark
            configuration = {
                EditorConfiguration.remember(::DesignConfigurationBuilder)
            },
            onClose = onClose,
        )
    }
    ```

    > **Delete EditorActivity:** You can delete `starter-kit/src/main/kotlin/ly/img/editor/configuration/design/EditorActivity.kt` as it is needed only for legacy navigation.

    If you do not use jetpack compose navigation and use legacy android navigation, the starter kit has a special `EditorActivity` class with full encapsulated logic:

    ```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/design/EditorActivity.kt" highlight-starter-kit-activity-full
    package ly.img.editor.configuration.design

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
                        EditorConfiguration.remember(::DesignConfigurationBuilder)
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
    import ly.img.editor.configuration.design.EditorActivity

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
    │       └── design.scene                            # Default design scene that should be loaded
    └── kotlin/ly/img/editor/configuration/design/
        ├── DesignConfigurationBuilder.kt               # Editor configuration logic encapsulated in 1 place
        ├── EditorActivity.kt                           # Encapsulated editor for legacy navigation. Delete if you use jetpack compose navigation
        ├── callback/
        │   ├── OnCreate.kt                             # Editor initialization logic
        │   ├── OnExport.kt                             # Export flow and handling
        │   └── OnLoaded.kt                             # Post onCreate logic
        └── component/
            ├── CanvasMenu.kt                           # Canvas Menu component configuration
            ├── Dock.kt                                 # Dock component configuration
            ├── InspectorBar.kt                         # Inspector Bar component configuration
            ├── NavigationBar.kt                        # Navigation Bar component configuration
            └── Overlay.kt                              # Overlay component configuration
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
class DesignConfigurationBuilder : BasicConfigurationBuilder() {
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
                EditorConfiguration.remember(::DesignConfigurationBuilder) {
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

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/design/callback/OnCreate.kt"
suspend fun DesignConfigurationBuilder.onCreateScene() {
    sceneUri?.let { safeSceneUri ->
        // Load the sceneUri if it's not null
        getOrLoadScene(sceneUri = safeSceneUri)
    } ?: run {
        // Otherwise stick to the default behavior of the starter kit
        getOrLoadScene(sceneUri = "file:///android_asset/scene/design.scene".toUri())
    }
}
```

## Set Up a Scene

The scene setup logic is located at `OnCreate.kt` file, as part of `onCreate` implementation:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/design/callback/OnCreate.kt" highlight-starter-kit-on-create-scene
suspend fun DesignConfigurationBuilder.onCreateScene() {
    getOrLoadScene(sceneUri = "file:///android_asset/scene/design.scene".toUri())
}
```

`getOrLoadScene` is a helper that loads an existing scene if available, or initializes one from `file:///android_asset/scene/design.scene` when no scene is active.

CE.SDK offers multiple ways to load scene into the editor. Choose the method that matches your use case:

```kotlin
// Load from an image uri - creates a new scene with the image
editorContext.engine.scene.createFromImage(imageUri = "https://example.com/photo.jpg".toUri())

// Load from a template archive - restores a previously saved project
editorContext.engine.scene.load(sceneUri = "https://example.com/template.zip".toUri())

// Create a blank canvas - starts with an empty design scene
editorContext.engine.scene.create()

// Load from a scene file - restores a scene from .scene file
editorContext.engine.scene.load(sceneUri = "https://example.com/saved.scene".toUri())
```

> **More Loading Options:** See [Open the Editor](../open-the-editor.md) for all available loading methods.

## Customize Assets

The asset source setup is located in `OnCreate.kt` as part of `onCreate` implementation. Enable or disable individual sources:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/design/callback/OnCreate.kt" highlight-starter-kit-on-load-asset-sources
suspend fun DesignConfigurationBuilder.onLoadAssetSources() {
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
For design editor, it makes sense to export the scene to a PDF content. `export` is a helper function that calls `editorContext.engine.block.export` under the hood:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/design/callback/OnExport.kt" highlight-starter-kit-on-export-byte-buffer
suspend fun DesignConfigurationBuilder.onExportByteBuffer(): ByteBuffer = export(
    block = requireNotNull(editorContext.engine.scene.get()),
    mimeType = MimeType.PDF,
)
```

> **More Export Options:** See [Export](../export-save-publish/export.md) and [Save](../export-save-publish/save.md) guides for all available export and scene calls.

`onPostExport` controls what should happen to the exported `ByteBuffer` content. You can upload the result to your server, save it to the device gallery
or simply close the editor via `editorContext.eventHandler.send(EditorEvent.CloseEditor())`. Check `writeToFile`, `shareFile` and `shareUri` helper functions for potential implementations:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/design/callback/OnExport.kt" highlight-starter-kit-on-post-export
suspend fun DesignConfigurationBuilder.onPostExport(byteBuffer: ByteBuffer) {
    val file = writeToFile(byteBuffer = byteBuffer, mimeType = MimeType.PDF)
    shareFile(file = file, mimeType = MimeType.PDF)
}
```

***

## Customize (Optional)

### Base Uri

The starter kit does not make any `baseUri` configuration, which means it points to `https://cdn.img.ly/packages/imgly/cesdk-engine/1.82.0-nightly.20260826/assets`. If you want to store them in your own CDN or locally, assets can be accessed via [zip file](https://cdn.img.ly/packages/imgly/cesdk-engine/1.82.0-nightly.20260826/imgly-assets.zip). For example, if you want to store them locally, unzip the content and place at `starter-kit/src/main/assets`:

```kotlin highlight-starter-kit-base-uri
import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorBaseUriScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        baseUri = "file:///android_asset".toUri(), // this points to android assets
        configuration = {
            EditorConfiguration.remember(::DesignConfigurationBuilder)
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
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorUiModeScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        uiMode = EditorUiMode.SYSTEM, // EditorUiMode.SYSTEM, EditorUiMode.LIGHT, EditorUiMode.DARK
        configuration = {
            EditorConfiguration.remember(::DesignConfigurationBuilder)
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
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.engine.EngineRenderTarget

@Composable
fun EditorRenderTargetScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        engineRenderTarget = EngineRenderTarget.SURFACE_VIEW, // EngineRenderTarget.SURFACE_VIEW, EngineRenderTarget.TEXTURE_VIEW
        configuration = {
            EditorConfiguration.remember(::DesignConfigurationBuilder)
        },
        onClose = onClose,
    )
}
```

### Localization

See [Localization](../user-interface/localization.md) for supported languages, adding support to new languages and replacing existing keys.

### UI Layout

All the configurable components are located at `starter-kit/src/main/kotlin/ly/img/editor/configuration/design/component`:

- `CanvasMenu.kt` - see [Canvas Menu](../user-interface/customization/canvas-menu.md) for full configuration options.
- `Dock.kt` - see [Dock](../user-interface/customization/dock.md) for full configuration options.
- `InspectorBar.kt` - see [Inspector Bar](../user-interface/customization/inspector-bar.md) for full configuration options.
- `NavigationBar.kt` - see [Navigation Bar](../user-interface/customization/navigation-bar.md) for full configuration options.
- `Overlay.kt` - see [Overlay](../user-interface/appearance/overlay.md) for full configuration options.

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