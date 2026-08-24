> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Use Templates](../../create-templates.md) > [Import Templates](../import.md) > [From Scene File](./from-scene-file.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-templates-import-from-scene-file/ImportTemplatesFromSceneFile.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.MimeType
import ly.img.engine.SceneLayout
import java.io.File

suspend fun importTemplatesFromSceneFile(engine: Engine): ImportedTemplateSummary {
    val cdnAssetsBaseUri = ly.img.editor.defaultBaseUri
    engine.editor.setSettingString("basePath", cdnAssetsBaseUri.toString())

    val sceneUri = Uri.parse(
        "$cdnAssetsBaseUri/ly.img.templates/templates/cesdk_business_card_1.scene",
    )

    val sceneFromUrl = engine.scene.load(
        sceneUri = sceneUri,
        waitForResources = true,
    )

    val sceneUrlPageCount = engine.scene.getPages().size

    val templateString = engine.scene.saveToString(scene = sceneFromUrl)
    val sceneFromString = engine.scene.load(
        scene = templateString,
        waitForResources = true,
    )

    check(engine.scene.get() == sceneFromString)
    val stringPageCount = engine.scene.getPages().size

    val templateArchiveFile = File.createTempFile("template", ".imgly")
    val templateArchive = engine.scene.saveToArchive(scene = sceneFromString)
    withContext(Dispatchers.IO) {
        templateArchiveFile.outputStream().use { output ->
            val archiveBuffer = templateArchive.asReadOnlyBuffer()
            val channel = output.channel
            while (archiveBuffer.hasRemaining()) {
                channel.write(archiveBuffer)
            }
        }
    }

    val archiveUri = Uri.fromFile(templateArchiveFile)
    val sceneFromArchive = engine.scene.load(
        sceneUri = archiveUri,
        waitForResources = true,
    )

    check(engine.scene.get() == sceneFromArchive)
    val archivePageCount = engine.scene.getPages().size

    val existingScene = engine.scene.create(
        designUnit = DesignUnit.PIXEL,
        sceneLayout = SceneLayout.FREE,
    )
    engine.block.setBoolean(block = existingScene, property = "scene/aspectRatioLock", value = false)
    engine.block.setFloat(block = existingScene, property = "scene/pageDimensions/width", value = 1920F)
    engine.block.setFloat(block = existingScene, property = "scene/pageDimensions/height", value = 1080F)

    engine.scene.applyTemplate(templateUri = sceneUri)

    val appliedPage = engine.scene.getPages().first()
    val appliedPageWidth = engine.block.getWidth(appliedPage)
    val appliedPageHeight = engine.block.getHeight(appliedPage)

    val previewPngData = engine.block.export(
        block = appliedPage,
        mimeType = MimeType.PNG,
    )

    val activeScene = requireNotNull(engine.scene.get())
    val appliedPageCount = engine.scene.getPages().size
    val designUnit = engine.scene.getDesignUnit()

    engine.scene.zoomToBlock(
        block = activeScene,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )

    return ImportedTemplateSummary(
        sceneUrlPageCount = sceneUrlPageCount,
        stringPageCount = stringPageCount,
        archivePageCount = archivePageCount,
        appliedPageCount = appliedPageCount,
        appliedPageWidth = appliedPageWidth,
        appliedPageHeight = appliedPageHeight,
        designUnit = designUnit,
        previewPngData = previewPngData,
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-create-templates-import-from-scene-file/ImportedTemplateSummary.kt reference-only
import ly.img.engine.DesignUnit
import java.nio.ByteBuffer

data class ImportedTemplateSummary(
    val sceneUrlPageCount: Int,
    val stringPageCount: Int,
    val archivePageCount: Int,
    val appliedPageCount: Int,
    val appliedPageWidth: Float,
    val appliedPageHeight: Float,
    val designUnit: DesignUnit,
    val previewPngData: ByteBuffer,
)
```

Load complete design templates from scene files in Android applications with
CE.SDK.

![Android preview of the applied business card template imported from a scene file](https://img.ly/docs/cesdk/android/create-templates/import/from-scene-file-52a01e/assets/android-template-preview.png)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0/engine-guides-create-templates-import-from-scene-file)

<EngineReferenceNote {...props} />

Scene files are portable templates that preserve the design structure, pages, blocks, assets, styles, and layout. This guide covers how to load templates from scene URLs, serialized strings, and archives, then apply template content while preserving the current page dimensions.

## Scene File Formats

CE.SDK supports two scene file formats for importing templates.

### Scene Format (.scene)

Scene files are JSON-based representations of design structures. They are lightweight because referenced assets stay outside the file and must remain reachable through their stored URIs.

**When to use:**

- Templates stored in databases
- Templates with hosted assets
- Lightweight transfer between your backend and app

### Archive Format (.archive or .zip)

Archive files bundle the scene structure with referenced assets in a ZIP file. Use archives when templates must remain portable or work when the original asset URLs are not available.

**When to use:**

- Template distribution
- Offline-capable templates
- Complete portability
- Self-contained handoff between systems

## Load Scene from URL

Use `engine.scene.load(sceneUri=_)` to load a `.scene` file from a remote or local URI. This replaces the active scene and adopts the template's page dimensions.

Set `basePath` to `ly.img.editor.defaultBaseUri` before loading this sample scene so relative resources in the scene file resolve against the CE.SDK Android package asset CDN on the IMG.LY CDN.

```kotlin highlight-android-template-source
    val cdnAssetsBaseUri = ly.img.editor.defaultBaseUri
    engine.editor.setSettingString("basePath", cdnAssetsBaseUri.toString())

    val sceneUri = Uri.parse(
        "$cdnAssetsBaseUri/ly.img.templates/templates/cesdk_business_card_1.scene",
    )
```

```kotlin highlight-android-load-from-url
val sceneFromUrl = engine.scene.load(
    sceneUri = sceneUri,
    waitForResources = true,
)
```

Scene files reference external assets by URI. If those images, fonts, videos, or other assets are no longer reachable, the scene can load but appear incomplete.

## Load Scene from String

Use `engine.scene.load(scene=_)` when your app already has the serialized scene content, for example from a database or API response. The string should come from a scene previously saved with `engine.scene.saveToString(scene=_)`.

```kotlin highlight-android-load-from-string
val templateString = engine.scene.saveToString(scene = sceneFromUrl)
val sceneFromString = engine.scene.load(
    scene = templateString,
    waitForResources = true,
)
```

This path is useful for lightweight storage, but it has the same external asset requirement as a `.scene` URL.

## Load Scene from Archive

Use `engine.scene.loadArchive(archiveUri=_)` for self-contained templates. The archive URI can point to a ZIP file from your backend, Android content URI, local app asset, or a file created from `engine.scene.saveToArchive(scene=_)`.

This sample creates a local archive file from the previously loaded scene so the archive load is version-stable and does not depend on a package CDN URL.

```kotlin highlight-android-prepare-archive-uri
val templateArchiveFile = File.createTempFile("template", ".imgly")
val templateArchive = engine.scene.saveToArchive(scene = sceneFromString)
withContext(Dispatchers.IO) {
    templateArchiveFile.outputStream().use { output ->
        val archiveBuffer = templateArchive.asReadOnlyBuffer()
        val channel = output.channel
        while (archiveBuffer.hasRemaining()) {
            channel.write(archiveBuffer)
        }
    }
}
```

Load the archive URI with `engine.scene.loadArchive(archiveUri=_)`.

```kotlin highlight-android-load-from-archive
val archiveUri = Uri.fromFile(templateArchiveFile)
val sceneFromArchive = engine.scene.load(
    sceneUri = archiveUri,
    waitForResources = true,
)
```

When you load from an archive:

- CE.SDK extracts the ZIP file.
- The scene structure becomes the active scene.
- Embedded assets are resolved from the archive contents.
- The returned `DesignBlock` is the loaded scene.

## Apply Template vs Load Scene

CE.SDK provides two approaches for working with templates.

### Load Scene

When you use `engine.scene.load(sceneUri=_)`, `engine.scene.load(scene=_)`, or `engine.scene.loadArchive(archiveUri=_)`, CE.SDK:

- Replaces the active scene.
- Uses the template's page dimensions and design unit.
- Loads the template content as authored.

This is appropriate when starting a new project from a template.

### Apply Template

When you use `engine.scene.applyTemplate(templateUri=_)` or `engine.scene.applyTemplate(template=_)`, CE.SDK:

- Keeps the current scene's design unit.
- Preserves the current page dimensions.
- Adjusts template content to fit the existing page.

This is useful when your app needs a fixed output size and only wants to import the template content.

Set the scene-level `scene/pageDimensions/width` and `scene/pageDimensions/height` properties before applying the template so the imported content is fitted to the intended output size.

```kotlin highlight-android-apply-template
    val existingScene = engine.scene.create(
        designUnit = DesignUnit.PIXEL,
        sceneLayout = SceneLayout.FREE,
    )
    engine.block.setBoolean(block = existingScene, property = "scene/aspectRatioLock", value = false)
    engine.block.setFloat(block = existingScene, property = "scene/pageDimensions/width", value = 1920F)
    engine.block.setFloat(block = existingScene, property = "scene/pageDimensions/height", value = 1080F)

    engine.scene.applyTemplate(templateUri = sceneUri)

    val appliedPage = engine.scene.getPages().first()
    val appliedPageWidth = engine.block.getWidth(appliedPage)
    val appliedPageHeight = engine.block.getHeight(appliedPage)
```

## Get Scene Information

After loading or applying a template, use the scene APIs to retrieve the active scene, count pages, inspect the design unit, or fit the scene into the viewport.

```kotlin highlight-android-inspect-scene
    val activeScene = requireNotNull(engine.scene.get())
    val appliedPageCount = engine.scene.getPages().size
    val designUnit = engine.scene.getDesignUnit()

    engine.scene.zoomToBlock(
        block = activeScene,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )
```

## Error Handling

Template imports can fail for the same reasons as other scene loads:

- **Network errors:** the URL is unreachable or the device has no network access.
- **Invalid scene data:** the `.scene` string or archive contents cannot be parsed.
- **Missing assets:** a `.scene` file loads, but referenced assets are unavailable.

Prefer archives for templates that must be portable. Wrap loading calls with your app's normal coroutine error handling, show a user-facing fallback, and keep a blank or default scene available when remote templates cannot load.

## Performance Considerations

Archive size directly affects loading time because CE.SDK downloads or reads the ZIP and resolves its assets before the scene is ready. Show loading state for medium and large templates, and avoid loading several unrelated templates sequentially on the main user path.

## URL Access Considerations

Android does not enforce browser CORS rules, but the engine still needs reachable URLs. Host scene files and archives over HTTPS, keep referenced asset URLs stable, and use archives when assets should travel with the template instead of being fetched from their original locations.

## API Reference

| Method                                                                                            | Description                                                                     |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `engine.editor.setSettingString(keypath="basePath", value=_)`                                     | Configure the asset base URI used by resources referenced from scene files.     |
| `engine.scene.loadArchive(archiveUri=_, waitForResources=_)`                                      | Load a scene archive from a URI.                                                     |
| `engine.scene.load(sceneUri=_, waitForResources=_)`                                               | Load a scene or archive from a local or remote URI (content detected automatically). |
| `engine.scene.load(scene=_, waitForResources=_)`                                                  | Load a scene from serialized scene content.                                     |
| `engine.scene.applyTemplate(templateUri=_)`                                                       | Apply a template scene from a URI while preserving the current page dimensions. |
| `engine.scene.applyTemplate(template=_)`                                                          | Apply serialized template content while preserving the current page dimensions. |
| `engine.scene.create(designUnit=_, sceneLayout=_)`                                                | Create a new scene, which then receives the applied template content.           |
| `engine.scene.saveToString(scene=_)`                                                              | Serialize a scene to a string for storage or transport.                         |
| `engine.scene.saveToArchive(scene=_)`                                                             | Serialize a scene and its reachable assets into a ZIP archive.                  |
| `engine.scene.get()`                                                                              | Return the active scene block, or `null` when no scene is loaded.               |
| `engine.scene.getPages()`                                                                         | Return the pages in the active scene.                                           |
| `engine.scene.getDesignUnit()`                                                                    | Return the active scene's design unit.                                          |
| `engine.scene.zoomToBlock(block=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Fit a scene or block into the viewport with padding.                            |
| `engine.block.setBoolean(block=_, property="scene/aspectRatioLock", value=_)`                     | Control whether scene-level page dimensions keep their current aspect ratio.    |
| `engine.block.setFloat(block=_, property="scene/pageDimensions/width", value=_)`                  | Set the scene-level page width used by applied templates.                       |
| `engine.block.setFloat(block=_, property="scene/pageDimensions/height", value=_)`                 | Set the scene-level page height used by applied templates.                      |
| `engine.block.getWidth(block=_)`                                                                  | Read back the page width after applying a template.                             |
| `engine.block.getHeight(block=_)`                                                                 | Read back the page height after applying a template.                            |

## Next Steps

- [Create From Scratch](../from-scratch.md) — Build reusable design templates
  programmatically using CE.SDK's APIs
- [Apply a Template](../../use-templates/apply-template.md) — Apply template scenes via API while
  preserving page dimensions
- [Save](../../export-save-publish/save.md) — Save design progress locally or to a backend service
  for later editing or publishing



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support