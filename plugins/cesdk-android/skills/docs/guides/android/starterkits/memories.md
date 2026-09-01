> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Starter Kits](../starterkits.md) > [Memories](./memories.md)

---

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-memories/app/src/main/kotlin/ly/img/starterkit/MainActivity.kt reference-only
package ly.img.starterkit

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.Surface
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import ly.img.editor.configuration.memories.MemoriesApp
import ly.img.editor.configuration.memories.MemoriesViewModel
import ly.img.editor.core.theme.EditorTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Enable immersive mode compatibility
        WindowCompat.setDecorFitsSystemWindows(window, false)

        setContent {
            val viewModel: MemoriesViewModel = viewModel()
            val isFullscreen by viewModel.isFullscreen.collectAsState()

            // Handle fullscreen state changes
            LaunchedEffect(isFullscreen) {
                val windowInsetsController = WindowCompat.getInsetsController(window, window.decorView)
                if (isFullscreen) {
                    // Hide system UI (status bar and navigation bar)
                    windowInsetsController.hide(
                        WindowInsetsCompat.Type.statusBars() or WindowInsetsCompat.Type.navigationBars(),
                    )
                    windowInsetsController.systemBarsBehavior =
                        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                } else {
                    // Show system UI
                    windowInsetsController.show(
                        WindowInsetsCompat.Type.statusBars() or WindowInsetsCompat.Type.navigationBars(),
                    )
                }
            }

            EditorTheme {
                Surface {
                    MemoriesApp(
                        license = null, // pass your license, or null for evaluation mode (watermark)
                        onExit = { finish() },
                        viewModel = viewModel,
                    )
                }
            }
        }
    }
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-memories/starter-kit/src/main/kotlin/ly/img/editor/configuration/memories/MemoriesConfiguration.kt reference-only
package ly.img.editor.configuration.memories

import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import ly.img.editor.BasicConfigurationBuilder
import ly.img.editor.configuration.memories.callback.onCreateConfiguration
import ly.img.editor.configuration.memories.callback.onExport
import ly.img.editor.configuration.memories.component.bottomPanelConfiguration
import ly.img.editor.configuration.memories.component.dockConfiguration
import ly.img.editor.configuration.memories.component.navigationBarConfiguration
import ly.img.editor.configuration.memories.component.rememberOverlay
import ly.img.editor.configuration.memories.model.ExportStatus

class MemoriesConfiguration(
    private val viewModel: MemoriesViewModel,
) : BasicConfigurationBuilder() {
    /** Drives the export progress overlay; null when no export is running. */
    var exportStatus: ExportStatus? by editorContext.mutableStateOf(key = KEY_EXPORT_STATUS, initial = null)

    init {
        onCreate = onCreateConfiguration(viewModel)
        dock = dockConfiguration(viewModel)
        bottomPanel = bottomPanelConfiguration(viewModel)
        navigationBar = navigationBarConfiguration(viewModel)
        overlay = { rememberOverlay(viewModel) }
        onExport = { onExport() }
        // If onCreate (or any editor step) fails, never leave the loading overlay stuck: dismiss it
        // and surface the failure through the standard error dialog (BasicConfigurationBuilder.Overlay).
        onError = {
            viewModel.setEditorLoading(false)
            error = it
        }
    }

    private companion object {
        const val KEY_EXPORT_STATUS = "ly.img.editor.configuration.memories.exportStatus"
    }
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-memories/starter-kit/src/main/kotlin/ly/img/editor/configuration/memories/MemoriesApp.kt reference-only
package ly.img.editor.configuration.memories

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import ly.img.editor.configuration.memories.screen.ImageSelectionScreen

enum class AppScreen {
    ImageSelection,
    VideoEditor,
}

/**
 * The complete Memories experience: photo picker (device images and videos) →
 * loading/analysis → cinematic slideshow editor.
 *
 * This is the single entry point used by every host — the standalone app, the examples app, and
 * the showcases app — so the flow is identical everywhere.
 *
 * @param license CE.SDK license key, or null for evaluation mode (adds a watermark).
 * @param onExit invoked when the user navigates back from the picker (the root of the flow) —
 * e.g. finish the activity (standalone) or pop the back stack (demo apps).
 */
@Composable
fun MemoriesApp(
    license: String?,
    onExit: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: MemoriesViewModel = viewModel(),
) {
    val context = LocalContext.current
    var currentScreen by rememberSaveable { mutableStateOf(AppScreen.ImageSelection) }

    LaunchedEffect(viewModel) {
        viewModel.setContext(context)
        // After process death the saved screen can restore to the editor while the ViewModel is
        // recreated empty — don't land in the editor with no media; return to the picker instead.
        if (currentScreen == AppScreen.VideoEditor && viewModel.selectedImages.value.isEmpty()) {
            currentScreen = AppScreen.ImageSelection
        }
    }

    when (currentScreen) {
        AppScreen.ImageSelection -> {
            // Back from the picker leaves the flow. ImageSelectionScreen registers its own
            // (higher-priority) BackHandler for multi-select mode, so this only fires otherwise.
            BackHandler { onExit() }
            Scaffold { paddingValues ->
                ImageSelectionScreen(
                    viewModel = viewModel,
                    onProceedToEditor = {
                        viewModel.setEditorLoading(true)
                        currentScreen = AppScreen.VideoEditor
                    },
                    modifier = modifier.padding(paddingValues),
                )
            }
        }
        AppScreen.VideoEditor -> {
            MemoriesEditor(
                license = license,
                viewModel = viewModel,
                onCloseEditor = { currentScreen = AppScreen.ImageSelection },
                modifier = modifier,
            )
        }
    }
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-memories/starter-kit/src/main/kotlin/ly/img/editor/configuration/memories/scene/SceneSetup.kt reference-only
package ly.img.editor.configuration.memories.scene

import ly.img.editor.configuration.memories.util.PAGE_HEIGHT
import ly.img.editor.configuration.memories.util.PAGE_WIDTH
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

/** Build the slideshow scene in code (no serialized blob): a video scene with one sized page. */
internal fun createSlideshowScene(engine: Engine): DesignBlock {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, PAGE_WIDTH)
    engine.block.setHeight(page, PAGE_HEIGHT)

    val fill = engine.block.createFill(FillType.Color)
    engine.block.setColor(fill, "fill/color/value", Color.fromRGBA(0f, 0f, 0f, 1f))
    engine.block.setFill(page, fill)
    return page
}

/**
 * The persistent, single-purpose tracks of the slideshow, bottom-to-top in render order. The per-
 * slide media tracks are created later (in [createMainImageSequence]) and stack on top of these.
 */
internal data class TrackReferences(
    val textTrack: DesignBlock,
    val backgroundTrack: DesignBlock,
    val backgroundBlock: DesignBlock,
    val matteTrack: DesignBlock,
    val matteBlock: DesignBlock,
)

internal fun setupTracks(
    engine: Engine,
    page: DesignBlock,
): TrackReferences {
    // background = per-style backdrop (hidden by default); matte = black rectangle so a crossfade
    // fades to black instead of revealing the backdrop. Appended first → they render behind the
    // media. The text (title) track sits just above them; the media tracks are appended on top later.
    val backgroundTrack = engine.block.create(DesignBlockType.Track)
    val matteTrack = engine.block.create(DesignBlockType.Track)
    val textTrack = engine.block.create(DesignBlockType.Track)

    // Tags let the rest of the kit re-locate tracks by role instead of retaining stale block ids.
    tagSlideshowTracks(engine, textTrack = textTrack, backgroundTrack = backgroundTrack, matteTrack = matteTrack)

    engine.block.appendChild(parent = page, child = backgroundTrack)
    engine.block.appendChild(parent = page, child = matteTrack)
    engine.block.appendChild(parent = page, child = textTrack)

    val backgroundBlock = fullPageBlock(engine, page)
    engine.block.setVisible(backgroundBlock, false)
    engine.block.appendChild(parent = backgroundTrack, child = backgroundBlock)

    val matteBlock = fullPageBlock(engine, page)
    val matteFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(matteFill, "fill/color/value", Color.fromRGBA(0f, 0f, 0f, 1f))
    engine.block.setFill(matteBlock, matteFill)
    engine.block.appendChild(parent = matteTrack, child = matteBlock)

    return TrackReferences(textTrack, backgroundTrack, backgroundBlock, matteTrack, matteBlock)
}

private fun fullPageBlock(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setScopeEnabled(block, "editor/select", false)
    engine.block.setShape(block, engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block, engine.block.getWidth(page))
    engine.block.setHeight(block, engine.block.getHeight(page))
    return block
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-memories/starter-kit/src/main/kotlin/ly/img/editor/configuration/memories/style/VideoStyle.kt reference-only
package ly.img.editor.configuration.memories.style

/**
 * Catalog of the video styles offered in the Styles sheet.
 *
 * This is the single source of truth for a style: its name, typeface, preferred font
 * weights, the image-filter adjustments, the scene background and media scale, and the title
 * text color all live here. To add, remove, or tune a style, edit [VideoStyles.ALL] below —
 * nothing else needs to change. The generic application logic lives in [StyleApplier].
 *
 * The bundled files a style needs — its looping backdrop [StyleBackground.Video] and its picker
 * thumbnail — are supplied by the [STYLE_SOURCE_ID] custom local asset source (see
 * [StyleAssetSource]). A style references them by [id], never by a hard-coded `file://` path.
 */
data class VideoStyle(
    /** Stable lowercase identifier used as the key everywhere (e.g. "noir"). */
    val id: String,
    /** Human-facing name shown in the sheet (e.g. "Noir"). */
    val displayName: String,
    /** Typeface name as it appears in the "ly.img.typeface" asset source. */
    val typeface: String,
    /** Preferred font sub-families, most-preferred first; falls back to the first available. */
    val fontWeights: List<String>,
    /** Adjustment effect properties, e.g. ("effect/adjustments/saturation", -1.0f). Empty = no adjustments. */
    val adjustments: List<Pair<String, Float>> = emptyList(),
    /** How much of the page the media fills. 1.0 = full-bleed; < 1.0 reveals the [background]. */
    val mediaScale: Float = 1f,
    /** The backdrop shown behind the (scaled-down) media. */
    val background: StyleBackground = StyleBackground.None,
    /** Title text color for this style (hex). White reads on the dark/video backdrops; Noir uses black. */
    val titleTextColorHex: String = "#FFFFFF",
    /** Opaque ARGB color for the picker tile (shown behind the icon / as a placeholder). */
    val previewBackground: Long,
)

/** The backdrop a style paints behind the media once the media is scaled below full-bleed. */
sealed interface StyleBackground {
    /** No backdrop: the media fills the whole page (used by the unstyled default). */
    object None : StyleBackground

    /** A flat color fill behind the media (e.g. white for Noir). [colorHex] is an "#RRGGBB" string. */
    data class Solid(
        val colorHex: String,
    ) : StyleBackground

    /**
     * A looping video behind the media, supplied by the [STYLE_SOURCE_ID] asset source.
     * [assetId] is the id of the backdrop asset in that source (e.g. "hologram").
     */
    data class Video(
        val assetId: String,
    ) : StyleBackground
}

object VideoStyles {
    /** Neutral, unstyled: clean modern sans, full-bleed media, no filter or backdrop. */
    val DEFAULT = VideoStyle(
        id = "default",
        displayName = "Default",
        typeface = "Montserrat",
        fontWeights = listOf("SemiBold", "Medium", "Regular"),
        previewBackground = 0xFFEFEBE9,
    )

    /** Professional black & white on a clean white backdrop, with black title type. */
    val NOIR = VideoStyle(
        id = "noir",
        displayName = "Noir",
        typeface = "Playfair Display",
        fontWeights = listOf("Bold", "SemiBold"),
        adjustments = listOf(
            "effect/adjustments/saturation" to -1.0f,
            "effect/adjustments/contrast" to 0.15f,
            "effect/adjustments/clarity" to 0.1f,
        ),
        mediaScale = 0.8f,
        background = StyleBackground.Solid(colorHex = "#FFFFFF"),
        titleTextColorHex = "#000000",
        previewBackground = 0xFF222222,
    )

    /** Futuristic cool cast over a looping hologram backdrop. A blue temperature shift cools the media. */
    val HOLOGRAM = VideoStyle(
        id = "hologram",
        displayName = "Hologram",
        typeface = "VT323",
        fontWeights = listOf("Regular"),
        adjustments = listOf(
            "effect/adjustments/temperature" to -0.4f,
            "effect/adjustments/contrast" to 0.1f,
        ),
        mediaScale = 0.8f,
        background = StyleBackground.Video(assetId = "hologram"),
        previewBackground = 0xFFE1F5FE,
    )

    /** Playful, poppy filter over a looping bubblegum backdrop: punchy saturation, bright tones. */
    val BUBBLEGUM = VideoStyle(
        id = "bubblegum",
        displayName = "Bubblegum",
        typeface = "Lobster Two",
        fontWeights = listOf("Bold", "Regular"),
        adjustments = listOf(
            "effect/adjustments/saturation" to 0.5f,
            "effect/adjustments/brightness" to 0.05f,
            "effect/adjustments/contrast" to 0.1f,
        ),
        mediaScale = 0.8f,
        background = StyleBackground.Video(assetId = "bubblegum"),
        previewBackground = 0xFFFCE4EC,
    )

    /** All styles, in the order they appear in the Styles sheet. */
    val ALL = listOf(DEFAULT, NOIR, HOLOGRAM, BUBBLEGUM)

    /** Resolves a style by its [id] (case-insensitive), falling back to [DEFAULT]. */
    fun byId(id: String): VideoStyle = ALL.firstOrNull { it.id.equals(id, ignoreCase = true) } ?: DEFAULT
}
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-memories/starter-kit/src/main/kotlin/ly/img/editor/configuration/memories/style/StyleAssetSource.kt reference-only
package ly.img.editor.configuration.memories.style

import androidx.core.net.toUri
import ly.img.engine.Engine
import ly.img.engine.FindAssetsQuery

/**
 * The custom **local** asset source that supplies the bundled style assets — the looping backdrop
 * videos and every style's picker thumbnail. The files stay local (in `src/main/assets`) and are
 * described by `assets/ly.img.memories.style/content.json`; the engine loads them through
 * [addLocalSourceFromJSON][ly.img.engine.AssetApi.addLocalSourceFromJSON], exactly like the default
 * IMG.LY sources. Keeping them behind an asset source means the style catalog references assets by
 * id ([VideoStyle]) instead of hard-coding `file:///android_asset/...` paths across the kit.
 */
const val STYLE_SOURCE_ID = "ly.img.memories.style"

/** The bundled `content.json` describing [STYLE_SOURCE_ID], resolved as an `android_asset` URI. */
private const val STYLE_SOURCE_CONTENT_URI = "file:///android_asset/$STYLE_SOURCE_ID/content.json"

/**
 * Register [STYLE_SOURCE_ID] from its bundled `content.json` (idempotent). Call once while loading
 * the other asset sources, before any style is applied or the Styles picker is shown.
 */
suspend fun Engine.registerStyleAssetSource() {
    if (STYLE_SOURCE_ID !in asset.findAllSources()) {
        asset.addLocalSourceFromJSON(contentUri = STYLE_SOURCE_CONTENT_URI.toUri())
    }
}

/**
 * The picker thumbnail URI for each style, keyed by style id, read from [STYLE_SOURCE_ID]. Styles
 * without a bundled asset (e.g. the unstyled default) are simply absent from the map.
 */
suspend fun Engine.loadStyleThumbnails(): Map<String, String> = asset.findAssets(
    sourceId = STYLE_SOURCE_ID,
    query = FindAssetsQuery(page = 0, perPage = 100),
).assets.mapNotNull { asset ->
    asset.meta?.get("thumbUri")?.let { asset.id to it }
}.toMap()

/** The backdrop video URI for a style, read from its [STYLE_SOURCE_ID] asset (null if absent). */
suspend fun Engine.styleBackgroundVideoUri(assetId: String): String? =
    asset.fetchAsset(sourceId = STYLE_SOURCE_ID, assetId = assetId)?.meta?.get("uri")
```

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-memories/starter-kit/src/main/kotlin/ly/img/editor/configuration/memories/callback/OnExport.kt reference-only
package ly.img.editor.configuration.memories.callback

import kotlinx.coroutines.CancellationException
import ly.img.editor.configuration.memories.MemoriesConfiguration
import ly.img.editor.configuration.memories.model.ExportStatus
import ly.img.engine.MimeType
import java.nio.ByteBuffer

/**
 * Render the slideshow page to an MP4, reporting progress through [MemoriesConfiguration.exportStatus]
 * so the overlay can show a progress circle, then a share button on success.
 */
suspend fun MemoriesConfiguration.onExport() {
    try {
        exportStatus = ExportStatus.Loading(progress = 0f)
        val buffer = exportSlideshow()
        val file = writeToFile(byteBuffer = buffer, mimeType = MimeType.MP4)
        exportStatus = ExportStatus.Success(file = file, mimeType = MimeType.MP4)
    } catch (cancellation: CancellationException) {
        exportStatus = null
        throw cancellation
    } catch (exception: Exception) {
        exportStatus = ExportStatus.Error(exception)
    }
}

private suspend fun MemoriesConfiguration.exportSlideshow(): ByteBuffer {
    val engine = editorContext.engine
    val page = requireNotNull(engine.scene.getCurrentPage())
    return engine.block.exportVideo(
        block = page,
        timeOffset = 0.0,
        duration = engine.block.getDuration(page),
        mimeType = MimeType.MP4,
        progressCallback = { progress ->
            if (progress.totalFrames > 0) {
                val fraction = progress.encodedFrames.toFloat() / progress.totalFrames
                val current = exportStatus
                // Only push a new state on a visible (~1%) change to avoid churning recomposition.
                if (current !is ExportStatus.Loading || fraction >= current.progress + 0.01f) {
                    exportStatus = ExportStatus.Loading(progress = fraction)
                }
            }
        },
    )
}
```

Turn a set of photos and video clips into a shareable memory montage on Android. The kit picks up
media from the gallery, arranges it on a timeline with crossfades and title cards, applies styled
looks, layers in audio, and exports an MP4—entirely on the device with no server dependencies.

![Memories starter kit screenshot](https://img.ly/docs/cesdk/android/starterkits/memories-mmrs01/assets/android.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-memories-editor-android/archive/refs/heads/v1.83.0-nightly.20260901.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-memories-editor-android/tree/v1.83.0-nightly.20260901)

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
    git clone -b v1.83.0-nightly.20260901 https://github.com/imgly/starterkit-memories-editor-android.git
    cd starterkit-memories-editor-android
    ```

    ### Step 2: Open and Run

    [Create and launch](https://developer.android.com/studio/run/managing-avds) a new android emulator or use an existing one, or connect a physical device with `USB Debugging` on.

    Open the project in Android Studio, sync gradle via `File -> Sync Project With Gradle Files` and run the `app` module from the UI, or use:

    ```bash
    ./gradlew app:installDebug
    ```

    The sample app launches `MainActivity`, which displays the full Memories flow: a photo picker that hands the selected media to the slideshow editor.
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate only the `starter-kit` library module into your existing Android app.

    ### Step 1: Run the Extraction Script From Your App Root

    Run this from your application root directory:

    ```bash
    repo="starterkit-memories-editor-android"
    version="1.83.0-nightly.20260901"
    curl -0 "https://codeload.github.com/imgly/${repo}/tar.gz/refs/heads/v${version}" | tar -xz --strip-components=1 "${repo}-${version}/starter-kit" "${repo}-${version}/starter-kit-dependencies.gradle"
    ```

    This extracts two things into your project, side by side: the `starter-kit/` library module and its `starter-kit-dependencies.gradle`. The dependencies file lists the extra libraries the kit needs (Coil, ExifInterface, and a few Compose artifacts); `starter-kit/build.gradle.kts` applies it from right next to the module, so keep the two as siblings.

    ### Step 2: Include the Module

    Declare the newly added Android library module in your project:

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

    ### Step 4: Add the IMG.LY Maven Repository

    Add the `IMG.LY` maven repository path in your project:

    ```kotlin title = "settings.gradle.kts"
    dependencyResolutionManagement {
        repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
        repositories {
            google()
            mavenCentral()
            maven {
                name = "IMG.LY Artifactory"
                url = uri("https://artifactory.img.ly/artifactory/maven")
                mavenContent {
                    includeGroup("ly.img")
                }
            }
        }
    }
    ```

    If the project is open in Android Studio, sync gradle via `File -> Sync Project With Gradle Files` to make all dependencies available.
  </TabItem>
</Tabs>

The full implementation of the starter kit lives in the `starter-kit/` folder:

```text
starter-kit/src/main/
├── assets/
│   └── ly.img.memories.style/        # The kit's own local asset source (backdrops + picker thumbnails)
│       ├── content.json              # Describes the style assets; URIs use the {{base_url}} placeholder
│       ├── thumbnails/               # noir.png, hologram.png, bubblegum.png
│       └── videos/                   # hologram.mp4, bubblegum.mp4 (looping style backdrops)
└── kotlin/ly/img/editor/configuration/memories/
    ├── MemoriesConfiguration.kt      # Wires the editor's onCreate / dock / bottomPanel / navigationBar / overlay / onExport slots
    ├── MemoriesApp.kt                # The full flow: photo picker → slideshow editor
    ├── MemoriesEditor.kt             # Hosts the editor with the loading overlay and back handling
    ├── MemoriesViewModel.kt          # Editor + montage state
    ├── callback/
    │   ├── OnCreate.kt               # Builds the scene, registers asset sources, wires event subscriptions
    │   └── OnExport.kt               # Export flow and handling (MP4)
    ├── component/                    # Editor UI slots: Dock, BottomPanel, NavigationBar, Overlay, ExportOverlay
    ├── scene/                        # Timeline assembly (the tracks are the source of truth)
    │   ├── SceneSetup.kt             # Builds the video scene and its tracks in code
    │   ├── Timeline.kt               # Lays each photo/clip on its own track for the crossfade montage
    │   ├── TrackEditor.kt            # Reads/writes the tracks and applies in-place edits
    │   ├── Title.kt                  # Title card + burst-image intro
    │   └── Playback.kt               # Loop / volume helpers
    ├── style/                        # The styled looks + their custom asset source
    │   ├── VideoStyle.kt             # Style catalog (filter, backdrop, matte, typeface) referencing assets by id
    │   ├── StyleAssetSource.kt       # Registers ly.img.memories.style via addLocalSourceFromJSON
    │   └── StyleApplier.kt           # Applies a style to the slideshow
    ├── screen/                       # ImageSelectionScreen (picker) + LoadingScreen
    ├── sheet/                        # Styles and Volume bottom sheets
    ├── widget/                       # Reusable composables (grid, timeline strip, video thumbnail, …)
    ├── iconPack/                     # Compose vector icons
    ├── model/                        # Small data models (ImageItem, TimelineImage, ExportStatus)
    └── util/
        ├── Animations.kt             # The slide animations (edit this to change the motion)
        └── Constants.kt              # Timing, page size, title knobs
```

## Set Up a Scene

The Memories scene is built in code (no serialized scene file). The setup logic lives in
`scene/SceneSetup.kt` and runs from the editor's `onCreate` (`callback/OnCreate.kt`): it creates a
video scene, lays out the persistent background / matte / text tracks, then `scene/Timeline.kt`
places one track per photo or clip so consecutive slides overlap for the crossfade while a later
slide always renders above the earlier one.

## Styles From a Custom Asset Source

The styled looks (Noir, Hologram, Bubblegum) get their **backdrops and picker thumbnails from the
kit's own local asset source**, `ly.img.memories.style`, rather than hard-coded paths. The assets
stay bundled under `starter-kit/src/main/assets/ly.img.memories.style/` and are described by
`content.json`, which `style/StyleAssetSource.kt` registers with
`engine.asset.addLocalSourceFromJSON(...)`—exactly like the default IMG.LY sources.

`style/VideoStyle.kt` then references each backdrop and thumbnail **by asset id**, and
`style/StyleApplier.kt` resolves the actual URI from the source at apply time. Because the asset
URIs in `content.json` use the portable `{{base_url}}` placeholder (which the engine substitutes
with the `basePath` the source is registered against) instead of an absolute
`file:///android_asset/...` path, the same source definition also works if you reuse it on iOS or
Web.

```json title="starter-kit/src/main/assets/ly.img.memories.style/content.json"
{
  "uri": "{{base_url}}/ly.img.memories.style/videos/hologram.mp4",
  "thumbUri": "{{base_url}}/ly.img.memories.style/thumbnails/hologram.png"
}
```

To add a look, drop its thumbnail (and backdrop, if any) into the `assets` folder, add an entry to
`content.json`, and add the matching `VideoStyle` in `style/VideoStyle.kt`.

## Where to Change Things

The starter kit ships a generic structure and behavior, but every part of it is in your codebase and
meant to be customized. The most common edit points:

- **Slide animations** — `util/Animations.kt`. Add, remove, or tune the in/out animation pairs a
  slide can use.
- **Looks / filters (styles)** — `style/VideoStyle.kt`. Each style bundles a filter, backdrop,
  matte, and title typeface, referencing the bundled assets by id (see above).
- **Timing, page size, title** — `util/Constants.kt` (clip duration, crossfade overlap, canvas
  size, title duration).
- **Timeline assembly** — `scene/SceneSetup.kt`, `scene/Timeline.kt`, and `scene/Title.kt`.

## Customize Export Functionality

Export handling lives in `callback/OnExport.kt`. The montage is rendered to an MP4 `ByteBuffer`; from
there you can upload it to your server, save it to the device gallery, or share it. Closing the
editor is driven by the `onCloseEditor` callback passed into `MemoriesEditor` (wired to the
navigation-bar close button via `rememberCloseEditor` in `component/NavigationBar.kt`).

> **More Export Options:** See [Export](../export-save-publish/export.md) and [Save](../export-save-publish/save.md) for all available export and scene calls.

***

## Troubleshooting

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

### Editor doesn't load

- **Check onCreate**: Ensure the `onCreate` callback finishes building the scene and no coroutine is stuck.
- **Verify the baseURL**: Assets must be reachable from the CDN or your self-hosted location.
- **Check logcat errors**: Look for errors in Android logcat.

### Export fails or produces blank output

- **Wait for content to load**: Ensure media is fully loaded before exporting.
- **Check logcat errors**: Look for errors in Android logcat.

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