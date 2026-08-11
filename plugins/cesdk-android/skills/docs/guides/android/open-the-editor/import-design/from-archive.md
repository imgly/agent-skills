> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Open the Editor](../../open-the-editor.md) > [Import a Design](../import-design.md) > [From Archive](./from-archive.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-design-from-archive/ImportDesignFromArchive.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer

data class ImportDesignFromArchiveResult(
    val archiveFile: File,
    val archiveByteCount: Int,
    val loadedScene: DesignBlock,
    val updatedTextBlock: DesignBlock,
)

suspend fun importDesignFromArchive(
    engine: Engine,
    outputDir: File,
): ImportDesignFromArchiveResult {
    val sourceScene = createArchiveSourceScene(engine)
    val archive = createArchiveForTransfer(engine, sourceScene)
    val archiveFile = writeArchiveToFile(
        archive = archive,
        archiveFile = File(outputDir, "portable-design.imgly"),
    )
    val loadedScene = loadArchiveFromUri(
        engine = engine,
        archiveUri = Uri.fromFile(archiveFile),
    )
    val updatedTextBlock = modifyLoadedArchive(engine)

    return ImportDesignFromArchiveResult(
        archiveFile = archiveFile,
        archiveByteCount = archive.remaining(),
        loadedScene = loadedScene,
        updatedTextBlock = updatedTextBlock,
    )
}

suspend fun createArchiveForTransfer(
    engine: Engine,
    scene: DesignBlock,
): ByteBuffer {
    val archive = engine.scene.saveToArchive(scene = scene)
    check(archive.hasRemaining()) { "Archive is empty" }
    return archive.asReadOnlyBuffer()
}

suspend fun writeArchiveToFile(
    archive: ByteBuffer,
    archiveFile: File,
): File = withContext(Dispatchers.IO) {
    archiveFile.parentFile?.mkdirs()

    val readableArchive = archive.asReadOnlyBuffer()
    FileOutputStream(archiveFile).channel.use { channel ->
        while (readableArchive.hasRemaining()) {
            channel.write(readableArchive)
        }
    }

    check(archiveFile.length() > 0L) { "Saved archive is empty" }
    archiveFile
}

suspend fun loadArchiveFromUri(
    engine: Engine,
    archiveUri: Uri,
): DesignBlock = engine.scene.load(
    sceneUri = archiveUri,
    waitForResources = true,
)

fun modifyLoadedArchive(engine: Engine): DesignBlock {
    val textBlock = engine.block.findByType(DesignBlockType.Text).first()
    engine.block.replaceText(
        block = textBlock,
        text = "Archived design loaded",
    )
    return textBlock
}

private fun createArchiveSourceScene(engine: Engine): DesignBlock {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 1080F)
    engine.block.setHeight(background, value = 1080F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(background, color = Color.fromHex("#FFF6F8FB"))
    engine.block.appendChild(parent = page, child = background)

    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = textBlock)
    engine.block.replaceText(textBlock, text = "Portable archive")
    engine.block.setWidthMode(textBlock, mode = SizeMode.AUTO)
    engine.block.setHeightMode(textBlock, mode = SizeMode.AUTO)
    engine.block.setTextFontSize(textBlock, fontSize = 64F)
    engine.block.setPositionX(textBlock, value = 96F)
    engine.block.setPositionY(textBlock, value = 96F)

    return scene
}
```

Import archived CE.SDK scenes that bundle the design structure together with all fonts, images, and assets in a single portable file.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260811/engine-guides-import-design-from-archive)

Scene files reference assets by URL, so they can break when those URLs become unavailable. Archives solve this by packaging the scene together with every accessible font, image, video, and audio resource into one file — saved with the `.imgly` extension (the `.zip` extension also works). Use archives when a design must be moved between environments, shared with another user, or stored long term.

<EngineReferenceNote {...props} />

## Understanding CE.SDK Archives

A CE.SDK archive is a ZIP container created with `engine.scene.saveToArchive(scene=_)` — save it with the `.imgly` extension. It contains the serialized scene and the resources referenced by that scene. During saving, CE.SDK rewrites those resource references to archive-local paths so the imported design does not depend on the original asset URLs.

Archives typically contain a serialized scene entry plus resource folders derived from the bundled MIME types:

```text
archive.zip
|-- scene.scene
|-- images/
|-- fonts/
|-- videos/
`-- audios/
```

The exact filenames are managed by CE.SDK. Your app should treat the archive as an opaque file and load it through the scene API instead of editing the ZIP contents directly.

## Create an Archive for Loading

The runnable sample creates an archive first so the Android loading path can be tested end to end. In production, this archive usually comes from your backend, app storage, or a user-selected document.

```kotlin highlight-android-create-archive
suspend fun createArchiveForTransfer(
    engine: Engine,
    scene: DesignBlock,
): ByteBuffer {
    val archive = engine.scene.saveToArchive(scene = scene)
    check(archive.hasRemaining()) { "Archive is empty" }
    return archive.asReadOnlyBuffer()
}
```

`saveToArchive(scene=_)` returns a `ByteBuffer`. The buffer contains the ZIP archive bytes and can be written to app storage, uploaded, or passed to your own persistence layer.

## Store the Archive as a File

Android scene archive loading accepts a `Uri`, so persist downloaded or generated archive bytes to an app-controlled file when you need a local import path. This is also a reliable pattern after receiving a document from the Android Storage Access Framework.

```kotlin highlight-android-write-archive-file
suspend fun writeArchiveToFile(
    archive: ByteBuffer,
    archiveFile: File,
): File = withContext(Dispatchers.IO) {
    archiveFile.parentFile?.mkdirs()

    val readableArchive = archive.asReadOnlyBuffer()
    FileOutputStream(archiveFile).channel.use { channel ->
        while (readableArchive.hasRemaining()) {
            channel.write(readableArchive)
        }
    }

    check(archiveFile.length() > 0L) { "Saved archive is empty" }
    archiveFile
}
```

Use your own storage location and retention policy. The sample writes to a temporary file so it can immediately load the same archive back into the engine.

## Load the Archive

Pass the archive location to `engine.scene.load(sceneUri=_)` — the same call that loads scene files, since the engine detects the content automatically. The URI can point to an app file, a user-selected document that your app can still read, or a remote `https://` archive.

```kotlin highlight-android-load-archive
suspend fun loadArchiveFromUri(
    engine: Engine,
    archiveUri: Uri,
): DesignBlock = engine.scene.load(
    sceneUri = archiveUri,
    waitForResources = true,
)
```

Loading is asynchronous and replaces the active scene. The sample sets `waitForResources=true` so the coroutine resumes after bundled resources are ready.

## Modify the Loaded Scene

After the archive loads, the scene is editable like any other CE.SDK scene. Locate blocks with the block API and update them normally.

```kotlin highlight-android-modify-loaded-archive
fun modifyLoadedArchive(engine: Engine): DesignBlock {
    val textBlock = engine.block.findByType(DesignBlockType.Text).first()
    engine.block.replaceText(
        block = textBlock,
        text = "Archived design loaded",
    )
    return textBlock
}
```

Bundled assets resolve from inside the archive, so text, image, video, and audio resources remain available even if the original URLs are gone.

## Archives vs Scene Files

CE.SDK offers two save formats that handle assets differently:

- **Scene files** store the design structure and reference assets by their original URLs. Use them when those URLs remain reachable and you want the smallest file.
- **Archives** bundle the scene and accessible referenced assets into one package. Use them when portability, offline loading, or long-term reliability matter more than file size.

Both kinds are saved with the `.imgly` extension; `.scene` and `.zip` files also load. Load either with the same `engine.scene.load(sceneUri=_)` call — the engine detects the content automatically. See [Load a Scene](../load-scene.md) for the scene-file path.

## Asset Availability and Portability

A scene file only loads correctly while every referenced asset stays at its original URL. Moving assets, expiring access tokens, or losing network access can break it. Archives remove that dependency by bundling the assets inside the ZIP, which makes a design environment-independent, offline-capable, and easier to share without coordinating asset access.

## Troubleshooting

**The archive fails to load** - Confirm it was created with `engine.scene.saveToArchive(scene=_)`, because CE.SDK archives use an internal structure that an arbitrary ZIP file does not have. Check that the file is not corrupted and that the URI remains readable for the duration of the load.

**Assets are missing after loading** - Verify the archive was not edited by hand, which can break relative references. Also confirm that the asset formats and codecs are supported on the target Android device.

**Large archives take time** - Loading is asynchronous because CE.SDK reads and extracts the archive before the scene is ready. Show a progress indicator in your app when archive files are large.

## API Reference

| API | Purpose |
| --- | --- |
| `engine.scene.load(sceneUri=_, overrideEditorConfig=_, waitForResources=_)` | Load a scene file or archive from a URI (content detected automatically) |
| `engine.scene.saveToArchive(scene=_)` | Create an archive as a `ByteBuffer` with the scene and accessible referenced assets |
| `engine.scene.loadArchive(archiveUri=_, overrideEditorConfig=_, waitForResources=_)` | Load a scene archive from a URI |
| `engine.block.findByType(type=_)` | Find blocks by type in the loaded scene |
| `engine.block.replaceText(block=_, text=_)` | Replace all text inside a loaded text block |

## Next Steps

- [Save a Scene](../../export-save-publish/save.md) - Create archives and scene files from the current design.
- [Load a Scene](../load-scene.md) - Load a scene file when assets are referenced by URL.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support