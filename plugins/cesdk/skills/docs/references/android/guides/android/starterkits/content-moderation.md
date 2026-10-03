> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Starter Kits](../starterkits.md) > [Extensibility](./extensibility.md) > [Content Moderation](./content-moderation.md)

---

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/app/src/main/kotlin/ly/img/starterkit/example/ExampleBaseUri.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorBaseUriScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        baseUri = "file:///android_asset".toUri(), // this points to android assets
        configuration = {
            EditorConfiguration.remember(
                builderFactory = {
                    ContentModerationConfigurationBuilder(
                        moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                    )
                },
            )
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/app/src/main/kotlin/ly/img/starterkit/example/ExampleComposeNavigationScreen.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

// onClose should pop screen from the backstack of jetpack compose navigation
@Composable
fun EditorScreen(onClose: (Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember(
                builderFactory = {
                    ContentModerationConfigurationBuilder(
                        moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                    )
                },
            )
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/app/src/main/kotlin/ly/img/starterkit/example/ExampleRenderTarget.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.engine.EngineRenderTarget

@Composable
fun EditorRenderTargetScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        engineRenderTarget = EngineRenderTarget.SURFACE_VIEW, // EngineRenderTarget.SURFACE_VIEW, EngineRenderTarget.TEXTURE_VIEW
        configuration = {
            EditorConfiguration.remember(
                builderFactory = {
                    ContentModerationConfigurationBuilder(
                        moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                    )
                },
            )
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/app/src/main/kotlin/ly/img/starterkit/example/ExampleUIMode.kt reference-only
package ly.img.starterkit.example

import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.EditorUiMode
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorUiModeScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        uiMode = EditorUiMode.SYSTEM, // EditorUiMode.SYSTEM, EditorUiMode.LIGHT, EditorUiMode.DARK
        configuration = {
            EditorConfiguration.remember(
                builderFactory = {
                    ContentModerationConfigurationBuilder(
                        moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                    )
                },
            )
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/EditorActivity.kt reference-only
package ly.img.editor.configuration.contentmoderation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import ly.img.editor.Editor
import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
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
                    EditorConfiguration.remember(
                        builderFactory = {
                            // The content moderation backend lives behind the [ContentModerationProvider]
                            // interface. Replace [GatewayModerationProvider] with your own
                            // implementation to plug in a different moderation service.
                            ContentModerationConfigurationBuilder(
                                moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                            )
                        },
                    )
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

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/callback/OnCreate.kt reference-only
package ly.img.editor.configuration.contentmoderation.callback

import androidx.core.net.toUri
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.editor.core.library.data.SystemGalleryAssetSource
import ly.img.editor.core.library.data.SystemGalleryPermission
import ly.img.engine.DesignBlockType

/**
 * The callback that is invoked when the editor is created.
 */
suspend fun ContentModerationConfigurationBuilder.onCreate(
    preCreateScene: suspend ContentModerationConfigurationBuilder.() -> Unit = {
        onPreCreateScene()
    },
    createScene: suspend ContentModerationConfigurationBuilder.() -> Unit = {
        onCreateScene()
    },
    loadAssetSources: suspend ContentModerationConfigurationBuilder.() -> Unit = {
        onLoadAssetSources()
    },
    postCreateScene: suspend ContentModerationConfigurationBuilder.() -> Unit = {
        onPostCreateScene()
    },
    finally: suspend ContentModerationConfigurationBuilder.() -> Unit = {
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
fun ContentModerationConfigurationBuilder.onPreCreateScene() {
    showLoading = true
    // Enable horizontal sliding between pages
    editorContext.engine.editor.setSettingBoolean(
        keypath = "features/pageCarouselEnabled",
        value = true,
    )
}

/**
 * The callback that is responsible for creating the scene.
 *
 * The bundled scene references remote images so that the moderation service, which fetches images
 * by URL, has content it can actually check out of the box.
 */
suspend fun ContentModerationConfigurationBuilder.onCreateScene() {
    getOrLoadScene(sceneUri = "file:///android_asset/scene/content-moderation.scene".toUri())
}

/**
 * The callback that loads all the required assets sources.
 */
suspend fun ContentModerationConfigurationBuilder.onLoadAssetSources() {
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
fun ContentModerationConfigurationBuilder.onPostCreateScene() {
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
fun ContentModerationConfigurationBuilder.onCreateFinally() {
    showLoading = false
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/callback/OnExport.kt reference-only
package ly.img.editor.configuration.contentmoderation.callback

import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CompletableDeferred
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.configuration.contentmoderation.ModerationExportPrompt
import ly.img.editor.configuration.contentmoderation.moderation.ModerationState
import ly.img.engine.MimeType
import java.nio.ByteBuffer

/**
 * The callback that is invoked when the export button is clicked.
 *
 * Before exporting, the last moderation check is consulted. If it flagged anything, or if the scene
 * has changes it never covered, the user is asked to confirm via a dialog and can either export
 * anyway or cancel.
 */
suspend fun ContentModerationConfigurationBuilder.onExport(
    preExport: suspend ContentModerationConfigurationBuilder.() -> Unit = {
        onPreExport()
    },
    moderate: suspend ContentModerationConfigurationBuilder.() -> Boolean = {
        onModerateBeforeExport()
    },
    exportByteBuffer: suspend ContentModerationConfigurationBuilder.() -> ByteBuffer = {
        onExportByteBuffer()
    },
    postExport: suspend ContentModerationConfigurationBuilder.(ByteBuffer) -> Unit = {
        onPostExport(it)
    },
    error: suspend ContentModerationConfigurationBuilder.(Exception) -> Unit = {
        onExportError(it)
    },
    finally: suspend ContentModerationConfigurationBuilder.() -> Unit = {
        onExportFinally()
    },
) {
    try {
        preExport()
        // Gate the export on content moderation; bail out if the user declines.
        if (!moderate()) return
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
fun ContentModerationConfigurationBuilder.onPreExport() {
    showLoading = true
}

/**
 * Consults the last check and asks for confirmation when the scene is flagged or has unchecked
 * changes. This does not call the moderation service — it only reads the cached report, which is
 * present only when a previous run covered the whole, unchanged scene.
 *
 * @return `true` to proceed with the export, `false` to cancel it. When content is flagged, this
 * suspends until the user resolves the confirmation dialog rendered by the overlay.
 */
suspend fun ContentModerationConfigurationBuilder.onModerateBeforeExport(): Boolean {
    // A cached report exists only when a previous run covered the whole, unchanged scene, so
    // "moderated" means exactly that: the current scene has a complete, still-valid result.
    val cached = cachedResults.takeIf { resultsFresh }
    val moderated = cached != null
    val flagged = cached?.results?.filter { it.category.state != ModerationState.SUCCESS }.orEmpty()

    // Skip the warning ONLY when we know the current scene is clean: a fresh check with no issues
    // and nothing changed since. Otherwise warn — either the last check found issues, or the scene
    // has changes that were never checked (a freshly loaded scene may already contain restricted
    // content, so an empty history is not assumed to be safe).
    if (moderated && flagged.isEmpty()) return true

    // Hide the export spinner while the confirmation dialog is visible.
    showLoading = false
    val decision = CompletableDeferred<Boolean>()
    moderationExportPrompt = ModerationExportPrompt(flagged = flagged, moderated = moderated, decision = decision)
    val proceed = try {
        decision.await()
    } finally {
        moderationExportPrompt = null
    }
    if (proceed) showLoading = true
    return proceed
}

/**
 * The callback that exports the content of the editor into [ByteBuffer].
 */
suspend fun ContentModerationConfigurationBuilder.onExportByteBuffer(): ByteBuffer = export(
    block = requireNotNull(editorContext.engine.scene.get()),
    mimeType = MimeType.PDF,
)

/**
 * The callback that is invoked after [onExportByteBuffer] and handles its output.
 */
suspend fun ContentModerationConfigurationBuilder.onPostExport(byteBuffer: ByteBuffer) {
    val file = writeToFile(byteBuffer = byteBuffer, mimeType = MimeType.PDF)
    shareFile(file = file, mimeType = MimeType.PDF)
}

/**
 * The callback that is invoked in case any of the export functions throw an exception.
 */
fun ContentModerationConfigurationBuilder.onExportError(error: Exception) {
    if (error is CancellationException) {
        throw error
    }
    this.error = error
}

/**
 * The callback that is invoked as the last step of [onExport].
 * It always runs, no matter success or failure on previous steps.
 */
fun ContentModerationConfigurationBuilder.onExportFinally() {
    showLoading = false
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/component/NavigationBar.kt reference-only
@file:Suppress("UnusedReceiverParameter")

package ly.img.editor.configuration.contentmoderation.component

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.configuration.contentmoderation.iconPack.IconPack
import ly.img.editor.configuration.contentmoderation.iconPack.ShieldAlert
import ly.img.editor.configuration.contentmoderation.iconPack.ShieldAlertFilled
import ly.img.editor.configuration.contentmoderation.iconPack.ShieldCheck
import ly.img.editor.configuration.contentmoderation.iconPack.ShieldCheckFilled
import ly.img.editor.core.component.Button
import ly.img.editor.core.component.EditorComponentId
import ly.img.editor.core.component.EditorTrigger
import ly.img.editor.core.component.NavigationBar
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberCloseEditor
import ly.img.editor.core.component.rememberExport
import ly.img.editor.core.component.rememberRedo
import ly.img.editor.core.component.rememberUndo
import ly.img.editor.core.event.EditorEvent

/**
 * The configuration of the component that is displayed as horizontal list of items at the top of the editor.
 */
@Composable
fun ContentModerationConfigurationBuilder.rememberNavigationBar() = NavigationBar.remember {
    scope = {
        val historyTrigger by EditorTrigger.remember {
            editorContext.engine.editor.onHistoryUpdated()
        }
        // Update NavigationBar whenever the editor history changes
        remember(this, historyTrigger) {
            NavigationBar.Scope(parentScope = this)
        }
    }
    listBuilder = {
        NavigationBar.ListBuilder.remember {
            aligned(alignment = Alignment.Start) {
                add { NavigationBar.Button.rememberCloseEditor() }
            }
            aligned(alignment = Alignment.End) {
                add { NavigationBar.Button.rememberUndo() }
                add { NavigationBar.Button.rememberRedo() }
                // The moderation button sits directly to the left of the export/share button.
                add { NavigationBar.Button.rememberModerate(builder = this@rememberNavigationBar) }
                add { NavigationBar.Button.rememberExport() }
            }
        }
    }
}

/**
 * A navigation bar button that runs content moderation on the scene and opens the results bottom sheet.
 *
 * @param builder the configuration builder, used to reach the [ContentModerationProvider].
 */
@Composable
fun NavigationBar.Button.rememberModerate(builder: ContentModerationConfigurationBuilder): Button<NavigationBar.ItemScope> =
    NavigationBar.Button.remember {
        id = { EditorComponentId("ly.img.contentmoderation.navigationBar.button.moderate") }
        // Reflect the last completed check (a warning persists across edits until a clean
        // re-check), and fill the icon while the moderation sheet is open.
        vectorIcon = {
            val flagged = builder.lastModerationHadIssues
            val open = builder.isModerationSheetOpen
            when {
                flagged && open -> IconPack.ShieldAlertFilled
                flagged -> IconPack.ShieldAlert
                open -> IconPack.ShieldCheckFilled
                else -> IconPack.ShieldCheck
            }
        }
        contentDescription = { "Content moderation" }
        onClick = {
            // Toggle: tapping the icon while the sheet is open closes it.
            if (builder.isModerationSheetOpen) {
                editorContext.eventHandler.send(EditorEvent.Sheet.Close(animate = true))
            } else {
                editorContext.eventHandler.send(createModerationSheetOpenEvent(builder = builder))
            }
        }
    }
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/moderation/ContentModerationProvider.kt reference-only
package ly.img.editor.configuration.contentmoderation.moderation

/**
 * The single extension point for content moderation.
 *
 * The default implementation is [GatewayModerationProvider], which talks to the IMG.LY gateway. To
 * use your own moderation service, implement this interface and pass it to
 * [ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder] in
 * [ly.img.editor.configuration.contentmoderation.EditorActivity].
 *
 * The rest of the starter kit (the scene scan, the moderation button, the results panel and the
 * export warning) depends only on this interface and on [ModerationCategory], so swapping the
 * backend never requires touching the UI or the engine glue.
 */
fun interface ContentModerationProvider {
    /**
     * Classifies a single image or piece of text into moderation categories.
     *
     * The content arrives as a [ModerationContent.ImageUrl] the service can fetch itself, as
     * [ModerationContent.ImageBytes] when the fill is local, or as [ModerationContent.Text] for a
     * text block. Implementations decide their own categories, descriptions and thresholds.
     *
     * @param content the image or text to classify.
     * @return the list of categories with the [ModerationState] assigned to each.
     */
    suspend fun moderate(content: ModerationContent): List<ModerationCategory>
}
```

Add automatic content moderation to your Android editor—check the images and the text in a scene against a moderation service and flag content that might violate your guidelines, right on the mobile device.

![Content Moderation Editor starter kit screenshot](https://img.ly/cesdk_android_showcases/starter-kits/starter-kit-contentmoderation/screenshot.png)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-content-moderation-editor-android/archive/refs/heads/v1.84.0.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-content-moderation-editor-android/tree/v1.84.0)

***

## Pre-Requisites

This guide assumes basic familiarity with Android and Kotlin. You will need:

- Latest Android Studio
- Kotlin: 1.9.10 or later
- Gradle: 8.4 or later
- Android: 7.0+ (API level 24+)
- An IMG.LY Gateway API key, used to moderate the images and text in the scene

### Set Your Gateway API Key

The kit moderates images and text with the `imgly/detection` model on the [IMG.LY Gateway](https://img.ly/dashboard). Keys use the `sk_` prefix, and model access and credit budgets are configured per key in the Dashboard, so the key you use must have access to `imgly/detection` and a credit balance to spend.

> **Note:** You can acquire an API key at [img.ly/dashboard](https://img.ly/dashboard). Register, generate the API key and contact IMG.LY support to credit the balance for Gateway usage. You can top up an existing key at [img.ly/dashboard/credit-balance](https://img.ly/dashboard/credit-balance).

Paste the key into `GATEWAY_API_KEY`:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/moderation/GatewayModerationProvider.kt"
const val GATEWAY_API_KEY = "sk_live_..."
```

Every screen in the kit reads the key from this one constant. The Gateway API key is separate from your CE.SDK license key, so set both. Until the key is set, running a check reports a missing-key error instead of results, and the moderation sheet surfaces a rejected key or an empty balance there too.

> **Keep the key out of your production app:** A key compiled into an app can be extracted from it. For production, route moderation through a backend you control and implement `ContentModerationProvider` against it, as described in [Use Your Own Moderation Service](#use-your-own-moderation-service).

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Start with a complete, runnable Android starter kit project.

    ### Step 1: Clone the Repository

    ```bash
    git clone -b v1.84.0 https://github.com/imgly/starterkit-content-moderation-editor-android.git
    cd starterkit-content-moderation-editor-android
    ```

    ### Step 2: Open and Run

    [Create and launch](https://developer.android.com/studio/run/managing-avds) a new android emulator or use an existing one or connect a physical device with `USB Debugging` on.

    Open the project in Android Studio, sync gradle via `File -> Sync Project With Gradle Files` and run the `app` module from UI, or use:

    ```bash
    ./gradlew app:installDebug
    ```

    The sample app launches `MainActivity` that has "Launch Editor" button. Clicking it launches `EditorActivity`:

    ```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/EditorActivity.kt" highlight-starter-kit-activity-full
    package ly.img.editor.configuration.contentmoderation

    import android.os.Bundle
    import androidx.activity.ComponentActivity
    import androidx.activity.compose.setContent
    import androidx.activity.enableEdgeToEdge
    import ly.img.editor.Editor
    import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
    import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
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
                        EditorConfiguration.remember(
                            builderFactory = {
                                // The content moderation backend lives behind the [ContentModerationProvider]
                                // interface. Replace [GatewayModerationProvider] with your own
                                // implementation to plug in a different moderation service.
                                ContentModerationConfigurationBuilder(
                                    moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                                )
                            },
                        )
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
    repo="starterkit-content-moderation-editor-android"
    version="1.84.0"
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
    import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
    import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
    import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
    import ly.img.editor.core.configuration.EditorConfiguration
    import ly.img.editor.core.configuration.remember

    // onClose should pop screen from the backstack of jetpack compose navigation
    @Composable
    fun EditorScreen(onClose: (Throwable?) -> Unit) {
        Editor(
            license = null, // pass null or empty for evaluation mode with watermark
            configuration = {
                EditorConfiguration.remember(
                    builderFactory = {
                        ContentModerationConfigurationBuilder(
                            moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                        )
                    },
                )
            },
            onClose = onClose,
        )
    }
    ```

    > **Delete EditorActivity:** You can delete `starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/EditorActivity.kt` as it is needed only for legacy navigation.

    If you do not use jetpack compose navigation and use legacy android navigation, the starter kit has a special `EditorActivity` class with full encapsulated logic:

    ```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/EditorActivity.kt" highlight-starter-kit-activity-full
    package ly.img.editor.configuration.contentmoderation

    import android.os.Bundle
    import androidx.activity.ComponentActivity
    import androidx.activity.compose.setContent
    import androidx.activity.enableEdgeToEdge
    import ly.img.editor.Editor
    import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
    import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
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
                        EditorConfiguration.remember(
                            builderFactory = {
                                // The content moderation backend lives behind the [ContentModerationProvider]
                                // interface. Replace [GatewayModerationProvider] with your own
                                // implementation to plug in a different moderation service.
                                ContentModerationConfigurationBuilder(
                                    moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                                )
                            },
                        )
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
    import ly.img.editor.configuration.contentmoderation.EditorActivity

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
    │       └── content-moderation.scene               # Default scene with remote images that should be loaded
    └── kotlin/ly/img/editor/configuration/contentmoderation/
        ├── ContentModerationConfigurationBuilder.kt   # Editor configuration logic encapsulated in 1 place
        ├── EditorActivity.kt                          # Encapsulated editor for legacy navigation. Delete if you use jetpack compose navigation
        ├── callback/
        │   ├── OnCreate.kt                            # Editor initialization logic
        │   ├── OnExport.kt                            # Export flow, including the moderation warning
        │   └── OnLoaded.kt                            # Post onCreate logic
        ├── component/
        │   ├── CanvasMenu.kt                          # Canvas Menu component configuration
        │   ├── Dock.kt                                # Dock component configuration
        │   ├── InspectorBar.kt                        # Inspector Bar component configuration
        │   ├── ModerationSheet.kt                     # Bottom sheet that lists the moderation results
        │   ├── NavigationBar.kt                       # Navigation Bar component configuration, including the moderation button
        │   └── Overlay.kt                             # Overlay component configuration, including the export warning dialog
        ├── iconPack/
        │   ├── IconPack.kt                            # Icon pack accessor for the starter kit
        │   ├── ShieldCheck.kt                         # Moderation button (clean) and moderation sheet shield
        │   ├── ShieldCheckFilled.kt                   # Moderation button (clean) while the sheet is open
        │   ├── ShieldAlert.kt                         # Moderation button when content is flagged
        │   ├── ShieldAlertFilled.kt                   # Moderation button (flagged) while the sheet is open
        │   └── WarningTriangle.kt                     # Export warning dialog icon
        └── moderation/
            ├── ContentModerationProvider.kt           # Swappable interface for the moderation backend
            ├── ModerationEngine.kt                    # Scans image and text blocks and runs them through the provider
            ├── ModerationModels.kt                    # Category, state and result data types
            └── GatewayModerationProvider.kt           # Default provider talking to the IMG.LY gateway
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
class ContentModerationConfigurationBuilder(
    val moderationProvider: ContentModerationProvider,
) : BasicConfigurationBuilder() {
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
                EditorConfiguration.remember(
                    builderFactory = {
                        ContentModerationConfigurationBuilder(
                            moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                        )
                    },
                ) {
                    this.sceneUri = sceneUri
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

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/callback/OnCreate.kt"
suspend fun ContentModerationConfigurationBuilder.onCreateScene() {
    sceneUri?.let { safeSceneUri ->
        // Load the sceneUri if it's not null
        getOrLoadScene(sceneUri = safeSceneUri)
    } ?: run {
        // Otherwise stick to the default behavior of the starter kit
        getOrLoadScene(sceneUri = "file:///android_asset/scene/content-moderation.scene".toUri())
    }
}
```

## Set Up a Scene

The scene setup logic is located at `OnCreate.kt` file, as part of `onCreate` implementation:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/callback/OnCreate.kt" highlight-starter-kit-on-create-scene
suspend fun ContentModerationConfigurationBuilder.onCreateScene() {
    getOrLoadScene(sceneUri = "file:///android_asset/scene/content-moderation.scene".toUri())
}
```

`getOrLoadScene` is a helper that loads an existing scene if available, or initializes one from `file:///android_asset/scene/content-moderation.scene` when no scene is active. The bundled scene references remote images so the moderation service, which fetches images by URL, has content it can check out of the box.

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

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/callback/OnCreate.kt" highlight-starter-kit-on-load-asset-sources
suspend fun ContentModerationConfigurationBuilder.onLoadAssetSources() {
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

> **More Asset Sources:** See [Import Media](../import-media.md) for all available assets and loading mechanisms.

For production deployments, self-hosting assets is required—the IMG.LY CDN is intended for development only. See [Serve Assets](../serve-assets.md) for downloading assets, configuring `baseUri` and excluding unused sources to optimize load times.

## Customize Export Functionality

Export handling logic is located in `OnExport.kt` as part of `onExport` callback.

`onExportByteBuffer` controls what should be exported from the scene. It can be a scene or set of design blocks.
For this editor, it makes sense to export the scene to a PDF content. `export` is a helper function that calls `editorContext.engine.block.export` under the hood:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/callback/OnExport.kt" highlight-starter-kit-on-export-byte-buffer
suspend fun ContentModerationConfigurationBuilder.onExportByteBuffer(): ByteBuffer = export(
    block = requireNotNull(editorContext.engine.scene.get()),
    mimeType = MimeType.PDF,
)
```

> **More Export Options:** See [Export](../export-save-publish/export.md) and [Save](../export-save-publish/save.md) guides for all available export and scene calls.

`onPostExport` controls what should happen to the exported `ByteBuffer` content. You can upload the result to your server, save it to the device gallery
or simply close the editor via `editorContext.eventHandler.send(EditorEvent.CloseEditor())`. Check `writeToFile`, `shareFile` and `shareUri` helper functions for potential implementations:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/callback/OnExport.kt" highlight-starter-kit-on-post-export
suspend fun ContentModerationConfigurationBuilder.onPostExport(byteBuffer: ByteBuffer) {
    val file = writeToFile(byteBuffer = byteBuffer, mimeType = MimeType.PDF)
    shareFile(file = file, mimeType = MimeType.PDF)
}
```

***

## Content Moderation

The kit adds a **Content Moderation** button to the navigation bar — a shield-check that becomes a shield-alert once a check flags content, and stays an alert across edits until a later check comes back clean. The icon fills while the sheet is open, and tapping it again closes the sheet. Tapping it opens a bottom sheet that first prompts the user to **Run Moderation**; the sheet then shows a loading state and finally the flagged categories. When nothing is flagged, the sheet says so and the user is good to go. Results are grouped by block: each flagged block gets one heading and one "Select" action that jumps to it on the canvas, with its categories listed underneath, each carrying a severity dot — red for *Certain*, orange for *Likely*. A block that violates several categories at once therefore takes one row, not several. The header counts both, for example `6 issues · 4 blocks`. Exporting is gated too: the export warning is skipped only when a fresh check of the unchanged scene found nothing; otherwise a confirmation dialog asks whether to export anyway — because the last check flagged content, or because the scene has unchecked changes (a freshly loaded scene is never assumed to be safe).

The navigation bar button is configured in `NavigationBar.kt` and sends an event that opens the moderation sheet:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/component/NavigationBar.kt" highlight-starter-kit-moderate-button

/**
 * A navigation bar button that runs content moderation on the scene and opens the results bottom sheet.
 *
 * @param builder the configuration builder, used to reach the [ContentModerationProvider].
 */
@Composable
fun NavigationBar.Button.rememberModerate(builder: ContentModerationConfigurationBuilder): Button<NavigationBar.ItemScope> =
    NavigationBar.Button.remember {
        id = { EditorComponentId("ly.img.contentmoderation.navigationBar.button.moderate") }
        // Reflect the last completed check (a warning persists across edits until a clean
        // re-check), and fill the icon while the moderation sheet is open.
        vectorIcon = {
            val flagged = builder.lastModerationHadIssues
            val open = builder.isModerationSheetOpen
            when {
                flagged && open -> IconPack.ShieldAlertFilled
                flagged -> IconPack.ShieldAlert
                open -> IconPack.ShieldCheckFilled
                else -> IconPack.ShieldCheck
            }
        }
        contentDescription = { "Content moderation" }
        onClick = {
            // Toggle: tapping the icon while the sheet is open closes it.
            if (builder.isModerationSheetOpen) {
                editorContext.eventHandler.send(EditorEvent.Sheet.Close(animate = true))
            } else {
                editorContext.eventHandler.send(createModerationSheetOpenEvent(builder = builder))
            }
        }
    }
```

Every image block **and every text block** in the scene is checked. A fill that already points at a public `http(s)` URL is handed to the service as that URL, so it fetches the image itself. Every other fill—a gallery upload, a bundled asset—is rendered by the engine and uploaded first, so user-added photos are covered too. Text blocks are sent as their text; blank ones are skipped.

Rendered images are capped at a 1024-pixel target, because the classifier does not need the full resolution of a 12-megapixel gallery photo and the upload runs over a phone connection. If you would rather send the image as-is, drop `targetWidth`/`targetHeight` from the `ExportOptions` in `ModerationEngine.kt`. Note that the engine renders the block large enough to *fill* the target, so a small block is scaled up to it rather than down. When a check cannot run—for example the service is unavailable or no API key is set—the sheet shows a clear error state instead of any results.

A text result is labelled with a short quote of the offending text rather than the block name, because a text block's name defaults to "Text" and would not tell the user which caption was flagged. The bundled demo scene ships two captions written to trip the text categories, so the feature is exercisable out of the box.

### Content Categories

The `imgly/detection` model scores images and text against two separate category sets. The kit maps each score to a severity with the same two thresholds, both constructor parameters on `GatewayModerationProvider`: above 80% is reported as *Certain*, above 40% as *Likely*.

Images:

| Category | Covers |
|---|---|
| **Nudity** | Raw or partial nudity, sexual acts, and suggestive content |
| **Weapons** | Handguns, rifles, machine guns, threatening knives |
| **Recreational Drugs** | Cannabis and other recreational drugs |
| **Medical** | Pills, syringes, medical devices, and other medical imagery |
| **Alcohol** | Wine, beer, cocktails, champagne |
| **Offensive Symbols** | Hate symbols, extremist imagery, and offensive gestures |
| **Gore** | Blood, wounds, corpses, and other graphic imagery |

Text:

| Category | Covers |
|---|---|
| **Toxic Language** | Language likely to make someone leave the conversation |
| **Insulting Language** | Insults, name-calling, and demeaning remarks |
| **Discriminatory Language** | Language that demeans a group or protected characteristic |
| **Violent Language** | Threats of violence and calls to harm someone |
| **Sexual Language** | Sexually explicit or suggestive wording |
| **Self-Harm** | References to suicide, self-injury, or eating disorders |

The two sets are disjoint, so one lookup table in the provider covers both. A category the model scores that the provider has no copy for is still reported, named from its id, so a category added to the model later is never silently dropped.

To save on API usage, the results are cached: running it again without editing the scene reuses the previous results instead of calling the service, and exporting an unchanged scene that a fresh check found clean skips the warning. Any undo, redo or edit invalidates the cache, so the next check reflects the current content and export warns again until it is re-checked.

A block whose request fails is reported as unchecked instead of being dropped, so a partial run shows as *Incomplete check* and names how many blocks could not be checked. An incomplete check is never cached, so the export warning is never skipped until a run covers the whole scene.

A check keeps at most four requests in flight at a time, otherwise a scene with many text blocks opens one connection per block at once and the service rate-limits it.

### Use Your Own Moderation Service

The moderation backend sits behind a single `ContentModerationProvider` interface. The default `GatewayModerationProvider` calls the `imgly/detection` model on the IMG.LY gateway, which scores images and text against separate category sets (see [Content Categories](#content-categories)). A category the model scores but the provider has no copy for is still reported, named from its id, so a category added to the model later is never silently dropped. To use a different service, plug in your own implementation:

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/moderation/ContentModerationProvider.kt" highlight-starter-kit-provider-interface
fun interface ContentModerationProvider {
    /**
     * Classifies a single image or piece of text into moderation categories.
     *
     * The content arrives as a [ModerationContent.ImageUrl] the service can fetch itself, as
     * [ModerationContent.ImageBytes] when the fill is local, or as [ModerationContent.Text] for a
     * text block. Implementations decide their own categories, descriptions and thresholds.
     *
     * @param content the image or text to classify.
     * @return the list of categories with the [ModerationState] assigned to each.
     */
    suspend fun moderate(content: ModerationContent): List<ModerationCategory>
}
```

Implement the interface with your backend and pass it to the builder in `EditorActivity`—nothing else needs to change, since the scene scan and every UI component depend only on the interface:

```kotlin
import ly.img.editor.configuration.contentmoderation.moderation.ContentModerationProvider
import ly.img.editor.configuration.contentmoderation.moderation.ModerationCategory
import ly.img.editor.configuration.contentmoderation.moderation.ModerationContent
import ly.img.editor.configuration.contentmoderation.moderation.ModerationState

class MyModerationProvider : ContentModerationProvider {
    override suspend fun moderate(content: ModerationContent): List<ModerationCategory> {
        // Call your own moderation service and map the response to categories.
        val response = when (content) {
            is ModerationContent.ImageUrl -> myBackend.classifyUrl(content.url)
            is ModerationContent.ImageBytes -> myBackend.classifyBytes(content.bytes, content.mimeType)
            is ModerationContent.Text -> myBackend.classifyText(content.text)
        }
        return listOf(
            ModerationCategory(
                id = "weapon",
                displayName = "Weapons",
                description = "Handguns, rifles, machine guns, threatening knives...",
                state = if (response.weapon > 0.8) ModerationState.FAILED else ModerationState.SUCCESS,
            ),
            // ... your remaining categories
        )
    }
}

// In EditorActivity:
EditorConfiguration.remember(
    builderFactory = { ContentModerationConfigurationBuilder(moderationProvider = MyModerationProvider()) },
)
```

A custom provider fully controls its own categories, descriptions and thresholds—the results sheet simply renders whatever it returns. The `content` it receives is a `ModerationContent.ImageUrl` the service can fetch itself, `ModerationContent.ImageBytes` for a fill with no public URL, or `ModerationContent.Text` for a text block.

***

## Customize (Optional)

### Base Uri

The starter kit does not make any `baseUri` configuration, which means it points to `https://cdn.img.ly/packages/imgly/cesdk-engine/1.84.0/assets`. If you want to store them in your own CDN or locally, assets can be accessed via [zip file](https://cdn.img.ly/packages/imgly/cesdk-engine/1.84.0/imgly-assets.zip). For example, if you want to store them locally, unzip the content and place at `starter-kit/src/main/assets`:

```kotlin highlight-starter-kit-base-uri
import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorBaseUriScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        baseUri = "file:///android_asset".toUri(), // this points to android assets
        configuration = {
            EditorConfiguration.remember(
                builderFactory = {
                    ContentModerationConfigurationBuilder(
                        moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                    )
                },
            )
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
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorUiModeScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        uiMode = EditorUiMode.SYSTEM, // EditorUiMode.SYSTEM, EditorUiMode.LIGHT, EditorUiMode.DARK
        configuration = {
            EditorConfiguration.remember(
                builderFactory = {
                    ContentModerationConfigurationBuilder(
                        moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                    )
                },
            )
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
import ly.img.editor.configuration.contentmoderation.ContentModerationConfigurationBuilder
import ly.img.editor.configuration.contentmoderation.moderation.GATEWAY_API_KEY
import ly.img.editor.configuration.contentmoderation.moderation.GatewayModerationProvider
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.engine.EngineRenderTarget

@Composable
fun EditorRenderTargetScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        engineRenderTarget = EngineRenderTarget.SURFACE_VIEW, // EngineRenderTarget.SURFACE_VIEW, EngineRenderTarget.TEXTURE_VIEW
        configuration = {
            EditorConfiguration.remember(
                builderFactory = {
                    ContentModerationConfigurationBuilder(
                        moderationProvider = GatewayModerationProvider(apiKey = GATEWAY_API_KEY),
                    )
                },
            )
        },
        onClose = onClose,
    )
}
```

### Localization

See [Localization](../user-interface/localization.md) for supported languages, adding support to new languages and replacing existing keys.

### UI Layout

All the configurable components are located at `starter-kit/src/main/kotlin/ly/img/editor/configuration/contentmoderation/component`:

- `CanvasMenu.kt` - see [Canvas Menu](../user-interface/customization/canvas-menu.md) for full configuration options.
- `Dock.kt` - see [Dock](../user-interface/customization/dock.md) for full configuration options.
- `InspectorBar.kt` - see [Inspector Bar](../user-interface/customization/inspector-bar.md) for full configuration options.
- `NavigationBar.kt` - see [Navigation Bar](../user-interface/customization/navigation-bar.md) for full configuration options.
- `Overlay.kt` - see [Overlay](../user-interface/appearance/overlay.md) for full configuration options.

***

## Troubleshooting

> **Get a License:** [Contact us](https://img.ly/forms/contact-sales/) to get a license key and remove the watermark.

### Editor doesn't load

- **Check onCreate**: Ensure `onCreate` callback loads a scene and no coroutine is stuck infinitly
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check logcat errors**: Look for error in Android logcat

### Moderation results don't appear

- **Set your API key**: Paste your IMG.LY Gateway key into `GATEWAY_API_KEY` in `GatewayModerationProvider.kt`; without it every check reports a missing-key error
- **Credit the balance**: `Insufficient credits` means the key is valid but the account has no Gateway balance—top up at [img.ly/dashboard/credit-balance](https://img.ly/dashboard/credit-balance)
- **Read the sheet's error state**: A rejected key, an empty balance or an unreachable service is reported there rather than as empty results
- **Check logcat errors**: Look for error in Android logcat

### Export fails or produces blank images

- **Wait for content to load**: Ensure images are fully loaded before exporting
- **Check logcat errors**: Look for error in Android logcat

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Get a license**: Contact us at [img.ly/forms/contact-sales/](https://img.ly/forms/contact-sales/)

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