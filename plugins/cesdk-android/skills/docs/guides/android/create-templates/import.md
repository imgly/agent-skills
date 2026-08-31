> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Import Templates](./import.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-templates/ImportTemplates.kt reference-only
import android.net.Uri
import ly.img.editor.defaultBaseUri
import ly.img.engine.Engine
import java.io.File
import kotlin.math.abs

private const val CURRENT_PAGE_WIDTH = 1080F
private const val CURRENT_PAGE_HEIGHT = 1350F
private const val PAGE_SIZE_TOLERANCE = 0.01F

private val templateSceneUri: Uri
    get() = defaultBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("templates")
        .appendPath("cesdk_business_card_1.scene")
        .build()

data class ImportTemplatesResult(
    val loadedPageCount: Int,
    val appliedFromUriPageSize: PageSize,
    val appliedFromStringPageSize: PageSize,
)

data class PageSize(
    val width: Float,
    val height: Float,
)

suspend fun importTemplates(engine: Engine): ImportTemplatesResult {
    val sceneUri = templateSceneUri
    val archiveFile = File.createTempFile("imported-template", ".imgly")

    try {
        val sceneFromUrl = engine.scene.load(
            sceneUri = sceneUri,
            waitForResources = true,
        )

        val templateString = engine.scene.saveToString(scene = sceneFromUrl)
        val archiveBuffer = engine.scene.saveToArchive(scene = sceneFromUrl)
        archiveBuffer.rewind()
        archiveFile.outputStream().channel.use { channel ->
            while (archiveBuffer.hasRemaining()) {
                channel.write(archiveBuffer)
            }
        }
        val archiveUri = Uri.fromFile(archiveFile)

        engine.scene.load(
            sceneUri = archiveUri,
            waitForResources = true,
        )

        engine.scene.load(
            scene = templateString,
            waitForResources = true,
        )

        val loadedScene = requireNotNull(engine.scene.get()) {
            "Template scene was not loaded."
        }
        val pages = engine.scene.getPages()
        check(pages.isNotEmpty()) { "Template did not contain any pages." }

        val currentPage = pages.first()
        engine.block.setFloat(
            block = loadedScene,
            property = "scene/pageDimensions/width",
            value = CURRENT_PAGE_WIDTH,
        )
        engine.block.setFloat(
            block = loadedScene,
            property = "scene/pageDimensions/height",
            value = CURRENT_PAGE_HEIGHT,
        )
        engine.block.setWidth(block = currentPage, value = CURRENT_PAGE_WIDTH)
        engine.block.setHeight(block = currentPage, value = CURRENT_PAGE_HEIGHT)

        engine.scene.applyTemplate(templateUri = sceneUri)

        val appliedFromUriPage = engine.scene.getPages().first()
        val appliedFromUriPageSize = PageSize(
            width = engine.block.getWidth(appliedFromUriPage),
            height = engine.block.getHeight(appliedFromUriPage),
        )
        check(abs(appliedFromUriPageSize.width - CURRENT_PAGE_WIDTH) < PAGE_SIZE_TOLERANCE) {
            "Applied URI template width ${appliedFromUriPageSize.width} did not preserve $CURRENT_PAGE_WIDTH."
        }
        check(abs(appliedFromUriPageSize.height - CURRENT_PAGE_HEIGHT) < PAGE_SIZE_TOLERANCE) {
            "Applied URI template height ${appliedFromUriPageSize.height} did not preserve $CURRENT_PAGE_HEIGHT."
        }

        engine.scene.applyTemplate(template = templateString)

        val appliedFromStringPage = engine.scene.getPages().first()
        val appliedFromStringPageSize = PageSize(
            width = engine.block.getWidth(appliedFromStringPage),
            height = engine.block.getHeight(appliedFromStringPage),
        )
        check(abs(appliedFromStringPageSize.width - CURRENT_PAGE_WIDTH) < PAGE_SIZE_TOLERANCE) {
            "Applied string template width ${appliedFromStringPageSize.width} did not preserve $CURRENT_PAGE_WIDTH."
        }
        check(abs(appliedFromStringPageSize.height - CURRENT_PAGE_HEIGHT) < PAGE_SIZE_TOLERANCE) {
            "Applied string template height ${appliedFromStringPageSize.height} did not preserve $CURRENT_PAGE_HEIGHT."
        }

        val currentScene = requireNotNull(engine.scene.get()) {
            "Applied template scene was not available."
        }
        engine.scene.zoomToBlock(
            block = currentScene,
            paddingLeft = 40F,
            paddingTop = 40F,
            paddingRight = 40F,
            paddingBottom = 40F,
        )

        return ImportTemplatesResult(
            loadedPageCount = pages.size,
            appliedFromUriPageSize = appliedFromUriPageSize,
            appliedFromStringPageSize = appliedFromStringPageSize,
        )
    } finally {
        archiveFile.delete()
    }
}
```

Load design templates into CE.SDK from archive URIs, scene URLs, and
serialized strings in Android apps.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260831/engine-guides-import-templates)

<EngineReferenceNote {...props} />

Templates are pre-designed scenes that provide starting points for user projects. On Android, the Scene API can replace the current scene with a scene file, a self-contained archive, or serialized scene content.

This guide covers how to load templates from archives, URLs, and strings, and how to inspect the loaded scene.

## Load from Archive

Load an archive with `engine.scene.load(sceneUri = ...)` — the same call that loads scene files, since the engine detects the content automatically. Archives bundle the scene with its assets, which makes them portable and suitable for offline or self-hosted template delivery; they use the `.imgly` extension (the `.zip` extension also works).

```kotlin highlight-android-load-from-archive
engine.scene.load(
    sceneUri = archiveUri,
    waitForResources = true,
)
```

The sample prepares `archiveUri` from a saved archive so the guide can run without a backend. In production, use a `Uri` that points to your stored template archive, such as a local file or your app's own download URL.

## Load from URL

Load a remote `.scene` file with `engine.scene.load(sceneUri = ...)`. Scene files are JSON-based and can reference assets by URL, so the referenced assets must remain reachable when the scene loads.

```kotlin highlight-android-load-from-url
val sceneFromUrl = engine.scene.load(
    sceneUri = sceneUri,
    waitForResources = true,
)
```

## Load from String

For templates stored in databases or received from APIs, load the serialized scene string with `engine.scene.load(scene = ...)`. The string should come from content previously saved with `engine.scene.saveToString(scene = ...)`.

```kotlin highlight-android-load-from-string
engine.scene.load(
    scene = templateString,
    waitForResources = true,
)
```

## Apply to the Current Scene

Loading a template replaces the current scene with the template scene. Applying a template keeps the current scene, design unit, and page dimensions, then adapts the template page content to fit those dimensions.

Use `engine.scene.applyTemplate` when your app already created the target scene or page size and only wants to import the template contents. Android supports applying scene templates from a `Uri` or from serialized scene-string content. Keep archive inputs on `engine.scene.load(...)`; `applyTemplate(templateUri = ...)` is for scene-file URIs, not scene archives.

### Apply from a Scene URI

Apply a remote or local `.scene` template with `engine.scene.applyTemplate(templateUri = ...)`.

```kotlin highlight-android-apply-template-uri
engine.scene.applyTemplate(templateUri = sceneUri)
```

### Apply from a Scene String

Apply serialized template content with `engine.scene.applyTemplate(template = ...)` when the template was already read from storage or returned by an API.

```kotlin highlight-android-apply-template-string
engine.scene.applyTemplate(template = templateString)
```

## Working with the Loaded Scene

After loading a template, retrieve the active scene, inspect its pages, and adjust the viewport when your integration renders the engine output.

### Verify the Scene

Use `engine.scene.get()` to retrieve the current scene block. Pair it with `engine.scene.getPages()` to confirm the template contains pages before you continue with edits or exports.

```kotlin highlight-android-get-scene
val loadedScene = requireNotNull(engine.scene.get()) {
    "Template scene was not loaded."
}
val pages = engine.scene.getPages()
check(pages.isNotEmpty()) { "Template did not contain any pages." }
```

### Zoom to Content

Fit the loaded template in the viewport with `engine.scene.zoomToBlock`. The padding parameters add screen-pixel spacing around the focused block.

```kotlin highlight-android-zoom-to-scene
val currentScene = requireNotNull(engine.scene.get()) {
    "Applied template scene was not available."
}
engine.scene.zoomToBlock(
    block = currentScene,
    paddingLeft = 40F,
    paddingTop = 40F,
    paddingRight = 40F,
    paddingBottom = 40F,
)
```

## Handle Loading Failures

Template loading calls are suspend functions and can throw when the URI is unreachable, the file is not a valid scene or archive, or referenced assets cannot be resolved. Catch those exceptions at your app boundary and show a retry or fallback template instead of continuing with a missing scene.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.scene.load(sceneUri=_, waitForResources=_)` | Load a scene or archive from a URI (content detected automatically) |
| `engine.scene.loadArchive(archiveUri=_, waitForResources=_)` | Load a scene archive from a URI |
| `engine.scene.load(scene=_, waitForResources=_)` | Load a scene from serialized scene content |
| `engine.scene.applyTemplate(templateUri=_)` | Apply a `.scene` template URI to the current scene while preserving the current page dimensions |
| `engine.scene.applyTemplate(template=_)` | Apply serialized template scene content to the current scene while preserving the current page dimensions |
| `engine.scene.saveToString(scene=_)` | Serialize a scene so it can be stored or loaded again later |
| `engine.scene.saveToArchive(scene=_)` | Serialize a scene with its assets into an archive buffer |
| `engine.scene.get()` | Get the current scene block, or `null` when no scene is loaded |
| `engine.scene.getPages()` | Get the sorted pages in the current scene |
| `engine.scene.zoomToBlock(block=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Focus the viewport on the loaded scene or another block |

## Next Steps

- [From Scene File](./import/from-scene-file.md) — Load and import design templates from scene files in CE.SDK
- [Apply a Template](../use-templates/apply-template.md) - Apply template scenes via API while preserving page dimensions



---

## Related Pages

- [Import Templates from Scene Files](./import/from-scene-file.md) - Load and import design templates from scene files in Android applications.


---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support