> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Starter Kits](../starterkits.md) > [Custom Built UIs](./custom-built-uis.md) > [Memories UI](./memories.md)

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
 * The persistent, single-purpose tracks of the slideshow, bottom-to-top in render order. The media
 * track that carries every clip is created later (in [createMainImageSequence]) and stacks on top.
 */
internal data class TrackReferences(
    val textTrack: DesignBlock,
    val backgroundTrack: DesignBlock,
    val backgroundBlock: DesignBlock,
)

internal fun setupTracks(
    engine: Engine,
    page: DesignBlock,
): TrackReferences {
    // background = per-style backdrop, hidden by default. Appended first → it renders behind the
    // media. The text (title) track sits just above it; the media track is appended on top later.
    val backgroundTrack = engine.block.create(DesignBlockType.Track)
    val textTrack = engine.block.create(DesignBlockType.Track)

    // Tags let the rest of the kit re-locate tracks by role instead of retaining stale block ids.
    tagSlideshowTracks(engine, textTrack = textTrack, backgroundTrack = backgroundTrack)

    engine.block.appendChild(parent = page, child = backgroundTrack)
    engine.block.appendChild(parent = page, child = textTrack)

    val backgroundBlock = fullPageBlock(engine, page)
    engine.block.setVisible(backgroundBlock, false)
    engine.block.appendChild(parent = backgroundTrack, child = backgroundBlock)

    return TrackReferences(textTrack, backgroundTrack, backgroundBlock)
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

import ly.img.editor.configuration.memories.scene.TransitionSpec
import ly.img.editor.configuration.memories.util.OVERLAP_DURATION
import ly.img.engine.Color
import ly.img.engine.TransitionType

/**
 * Catalog of the video styles offered in the Styles sheet.
 *
 * This is the single source of truth for a style: its name, typeface, preferred font
 * weights, the image-filter adjustments, the scene background and media scale, the title
 * text color, and the transition between slides all live here. To add, remove, or tune a
 * style, edit [VideoStyles.ALL] below — nothing else needs to change. The generic
 * application logic lives in [StyleApplier].
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
    /**
     * How one slide becomes the next. A style's transition is as much of its character as its
     * filter is, so each one blends differently — see [VideoStyles.ALL].
     */
    val transition: TransitionSpec = TransitionSpec(TransitionType.CrossFade),
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
     * A looping clip behind the media, supplied by the [STYLE_SOURCE_ID] asset source.
     * [assetId] is the id of the backdrop asset in that source (e.g. "hologram").
     *
     * Named for the **fill** it uses, not the file it points at: the engine plays a Lottie the same
     * way it plays an MP4, through a video fill, so both work here. The shipped backdrops are Lottie
     * — see `content.json` and `tools/generate_style_lotties.py`.
     *
     * [opacity] dims the clip so it reads as a backdrop instead of competing with the photos.
     * It blends against the page's black fill, so a lower value is darker, not lighter.
     */
    data class Video(
        val assetId: String,
        val opacity: Float = 0.5f,
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
        // A long, unhurried dissolve — the slideshow default that gets out of the way.
        transition = TransitionSpec(
            type = TransitionType.CrossFade,
            duration = OVERLAP_DURATION,
        ),
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
        // Cutting through black is the film-editorial move, and it reads as intent rather than
        // accident against the white backdrop.
        transition = TransitionSpec(
            type = TransitionType.FadeToBlack,
            duration = 1.8,
        ),
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
        // A short warp, so the slides look like they are being retransmitted rather than dissolved.
        transition = TransitionSpec(
            type = TransitionType.CrossWarp,
            duration = 1.2,
            configure = { engine, transition ->
                engine.block.setFloat(transition, "transition/cross-warp/zoom", 0.85f)
            },
        ),
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
        // A pink wipe sweeping up: the playful, hard-edged counterpart to a dissolve.
        transition = TransitionSpec(
            type = TransitionType.ColorWipe,
            duration = 1.0,
            configure = { engine, transition ->
                engine.block.setEnum(transition, "transition/color-wipe/direction", "Up")
                engine.block.setColor(transition, "transition/color-wipe/color", Color.fromHex("#FF4FA3"))
            },
        ),
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
 * The custom **local** asset source that supplies the bundled style assets — the looping backdrops
 * and every style's picker thumbnail. The files stay local (in `src/main/assets`) and are
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

/** The backdrop clip's URI for a style, read from its [STYLE_SOURCE_ID] asset (null if absent). */
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

```kotlin file=@cesdk_android_examples/../cesdk_android_showcases/starter-kits/starter-kit-memories/starter-kit/src/main/kotlin/ly/img/editor/configuration/memories/util/Animations.kt reference-only
package ly.img.editor.configuration.memories.util

import ly.img.engine.AnimationType
import ly.img.engine.Engine

/**
 * The slide animations for the Memories slideshow — **this is the file to edit**.
 *
 * A slide's motion is one move that runs the whole clip: a slow Ken Burns drift the viewer barely
 * notices. The blend into the next slide is the style's transition, not an animation, so a slide
 * needs no out-animation to leave on — [AnimationPair.createOut] is null unless a recipe wants a
 * second move. The kit picks one pair at random per slide ([getRandomAnimationPair]).
 *
 * An [AnimationPair] is a *recipe*, not a pair of engine blocks: [AnimationPair.createIn] /
 * [AnimationPair.createOut] build a **fresh** engine animation each time they are called. Engine
 * animations are single-owner (1:1 with a design block), so every slide must own its own animation
 * instances — assigning one pooled animation block to several slides corrupts the scene (the engine
 * re-points the animation to the newest block only) and later crashes: destroying a slide auto-
 * destroys the shared animation, leaving every other slide holding a dangling id. [applySlideAnimation]
 * calls these builders per slide so each clip gets its own blocks.
 *
 * To change the motion, edit the list in [createAnimationPairs] — add, remove, or tweak entries, or
 * write a whole new recipe. The low-level builders below wrap the engine calls so the list stays
 * readable.
 */
data class AnimationPair(
    val createIn: (Engine) -> Int,
    /** A second move as the slide leaves. Null when the one move covers the whole clip. */
    val createOut: ((Engine) -> Int)? = null,
)

object Animations {
    /** The pool of animations a slide can use. Edit this list to change the slideshow's motion. */
    fun createAnimationPairs(): List<AnimationPair> = listOf(
        kenBurnsDrift(),
    )

    /** Pick a random pair for the next slide. */
    fun getRandomAnimationPair(animationPairs: List<AnimationPair>): AnimationPair = animationPairs.random()

    // ---- Low-level builders (you usually don't need to touch these) --------------------------

    /**
     * One slow Ken Burns across the whole clip: a gentle push in with a little drift, at a constant
     * rate. Linear is the Ken Burns choice — an eased curve spends its speed early or late, which
     * over a whole clip reads as the photo lurching and then crawling.
     *
     * Ken Burns is a pure transform while its `animation/ken_burns/fade` property stays at its
     * `false` default — leave it there. Blur, which this replaced, ramps the clip's alpha too, but
     * its `animation/blur/fade` defaults to `true`: set that to `false` and it is a pure transform
     * as well. Leaving it on is what made the incoming clip semi-transparent through the whole
     * transition overlap, so the backdrop showed through the blend.
     */
    private fun kenBurnsDrift(): AnimationPair = AnimationPair(
        createIn = { engine ->
            engine.block.createAnimation(AnimationType.KenBurns).also { animation ->
                // The whole clip, so the move is slow enough to read as life rather than motion.
                engine.block.setDuration(animation, IMAGE_DURATION)
                engine.block.setFloat(animation, "animation/ken_burns/zoomIntensity", 0.2f)
                // A full crop-length of travel reads as the photo sliding past; a third of it reads
                // as drift.
                engine.block.setFloat(animation, "animation/ken_burns/travelDistanceRatio", 0.3f)
                engine.block.setEnum(animation, "animationEasing", "Linear")
            }
        },
    )
}
```

Turn a set of photos and video clips into a shareable memory montage on Android. The kit picks up
media from the gallery, arranges it on a timeline with transitions and title cards, applies styled
looks, layers in audio, and exports an MP4—entirely on the device with no server dependencies.

![Memories starter kit screenshot](https://img.ly/docs/cesdk/android/starterkits/memories-mmrs01/assets/android.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-memories-editor-android/archive/refs/heads/v1.84.0-rc.0.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-memories-editor-android/tree/v1.84.0-rc.0)

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
    git clone -b v1.84.0-rc.0 https://github.com/imgly/starterkit-memories-editor-android.git
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
    version="1.84.0-rc.0"
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
│       └── animations/               # hologram.json, bubblegum.json (looping Lottie backdrops)
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
    │   ├── Timeline.kt               # Lays every clip on one media track, in slot order
    │   ├── Transitions.kt            # TransitionSpec + wiring a style's blend onto every boundary
    │   ├── TrackEditor.kt            # Reads/writes the tracks and applies in-place edits
    │   ├── Title.kt                  # Title card + burst-image intro
    │   └── Playback.kt               # Loop / volume helpers
    ├── style/                        # The styled looks + their custom asset source
    │   ├── VideoStyle.kt             # Style catalog (filter, backdrop, transition, typeface) referencing assets by id
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
video scene, lays out the persistent background and text tracks, then `scene/Timeline.kt` appends
every photo and clip to a single media track in slot order.

The clips are siblings on that one track because a transition belongs to the **outgoing** clip and
blends it into its neighbour—which only works between siblings. The track's own time offset holds
the title gap; everything inside it is positioned by the engine.

## Transitions and Slide Motion

Two things move in a Memories montage, and each has one job:

| | What moves | Who owns it |
| --- | --- | --- |
| **Between** two slides | The blend from one clip to the next | The style's transition, applied by the engine |
| **Within** one slide | A slow Ken Burns across the clip's full duration | `util/Animations.kt` |

Keeping them apart is what lets both stay simple. Assigning a transition overlaps the pair and pulls
every later clip earlier, so the engine—not the kit—owns the timeline: there is no start-time
arithmetic anywhere in `scene/`. The engine also clamps each overlap to half of the shorter
neighbour, so a clip shorter than the requested duration needs no special case. A 4s video between
8s photos simply gets 2s blends on either side.

> **A slide animation must not touch alpha:** The transition blends the two clips against each other. An animation that *also* ramps the clip's
> opacity leaves both of them semi-transparent for the whole overlap, and the backdrop shows through
> the blend. `AnimationType.Blur` and `CropZoom` both ramp alpha unless you turn it off, with
> `animation/blur/fade` and `animation/crop_zoom/fade` respectively—both default to `true`. Ken
> Burns has the same switch in `animation/ken_burns/fade`, but it defaults to `false`, so it is a
> pure transform out of the box, which is why the kit uses it.

Because the transition does the leaving, a slide needs no out-animation. `AnimationPair.createOut`
is nullable and defaults to `null`, and the shipped recipe is a single Ken Burns spanning the whole
clip with `Linear` easing—an eased curve spends its speed early or late, which over eight seconds
reads as the photo lurching and then crawling.

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/memories/util/Animations.kt" highlight-starter-kit-ken-burns-drift
private fun kenBurnsDrift(): AnimationPair = AnimationPair(
    createIn = { engine ->
        engine.block.createAnimation(AnimationType.KenBurns).also { animation ->
            // The whole clip, so the move is slow enough to read as life rather than motion.
            engine.block.setDuration(animation, IMAGE_DURATION)
            engine.block.setFloat(animation, "animation/ken_burns/zoomIntensity", 0.2f)
            // A full crop-length of travel reads as the photo sliding past; a third of it reads
            // as drift.
            engine.block.setFloat(animation, "animation/ken_burns/travelDistanceRatio", 0.3f)
            engine.block.setEnum(animation, "animationEasing", "Linear")
        }
    },
)
```

### A Transition Per Style

A transition is as much a style's character as its filter is, so each one blends differently:

| Style | Transition | Overlap |
| --- | --- | --- |
| Default | `CrossFade` | 3.2s |
| Noir | `FadeToBlack` | 1.8s |
| Hologram | `CrossWarp` | 1.2s |
| Bubblegum | `ColorWipe`, pink, sweeping up | 1.0s |

A style declares one as a `TransitionSpec`: the type, how long the clips overlap, and a `configure`
lambda for the type's own properties, which live under `transition/{type}/{property}` keypaths. Call
`findAllProperties` on a created transition to see what a type exposes.

```kotlin title = "starter-kit/src/main/kotlin/ly/img/editor/configuration/memories/style/VideoStyle.kt" highlight-starter-kit-transition-spec
transition = TransitionSpec(
    type = TransitionType.ColorWipe,
    duration = 1.0,
    configure = { engine, transition ->
        engine.block.setEnum(transition, "transition/color-wipe/direction", "Up")
        engine.block.setColor(transition, "transition/color-wipe/color", Color.fromHex("#FF4FA3"))
    },
),
```

Because styles overlap by different amounts, choosing one changes how long the montage runs.
`style/StyleApplier.kt` re-wires every boundary, reads the new end back off the engine, and
re-stretches the backdrop to match—so nothing predicts a duration it can measure.

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
  "uri": "{{base_url}}/ly.img.memories.style/animations/hologram.json",
  "thumbUri": "{{base_url}}/ly.img.memories.style/thumbnails/hologram.png"
}
```

The two animated backdrops are **Lottie**, not video. A video fill plays either—the engine picks its
decoder from the asset's `mimeType`, so `application/json` routes the file through its Lottie
renderer and `video/mp4` through the video decoder. `StyleBackground.Video` is named for the fill,
not the file. Vector costs a fraction of the bytes for this kind of abstract motion: the two
backdrops here are 25 KB together, against 25 MB as MP4.

> **Keep a vector backdrop cheap:** A Lottie backdrop is rasterized on the main thread every frame, so its cost tracks how much
> geometry it draws, not its file size. On a mid-range phone a full-frame gradient renders faster
> than the MP4 it replaces, and roughly 40 stroked paths still match it—but a few hundred paths, or
> several full-frame blurs, will stall playback. The shipped backdrops use two and three shapes.
> `tools/generate_style_lotties.py` regenerates them.

To add a look, drop its thumbnail (and backdrop, if any) into the `assets` folder, add an entry to
`content.json`, and add the matching `VideoStyle` in `style/VideoStyle.kt`.

## Where to Change Things

The starter kit ships a generic structure and behavior, but every part of it is in your codebase and
meant to be customized. The most common edit points:

- **Slide motion** — `util/Animations.kt`. Add, remove, or tune the animation recipes a slide can
  use. Keep them alpha-free, for the reason above.
- **Transitions** — the `transition` field on each `VideoStyle`, wired by `scene/Transitions.kt`.
- **Looks / filters (styles)** — `style/VideoStyle.kt`. Each style bundles a filter, backdrop,
  transition, and title typeface, referencing the bundled assets by id (see above).
- **Timing, page size, title** — `util/Constants.kt` (clip duration, the default transition
  overlap, canvas size, title duration).
- **Timeline assembly** — `scene/SceneSetup.kt`, `scene/Timeline.kt`, and `scene/Title.kt`.

## Customize Export Functionality

Export handling lives in `callback/OnExport.kt`. The montage is rendered to an MP4 `ByteBuffer`; from
there you can upload it to your server, save it to the device gallery, or share it. Closing the
editor is driven by the `onCloseEditor` callback passed into `MemoriesEditor` (wired to the
navigation-bar close button via `rememberCloseEditor` in `component/NavigationBar.kt`).

> **More Export Options:** See [Export](../export-save-publish/export.md) and [Save](../export-save-publish/save.md) for all available export and scene calls.

***

## Troubleshooting

> **Get a License:** [Contact us](https://img.ly/forms/contact-sales/) to get a license key and remove the watermark.

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