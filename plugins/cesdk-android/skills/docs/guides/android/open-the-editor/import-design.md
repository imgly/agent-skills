> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Import a Design](./import-design.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-design/ImportDesign.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.MimeType
import java.io.File

suspend fun importDesign(
    engine: Engine,
    assetBaseUri: Uri,
): ImportDesignResult {
    val sceneUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("templates")
        .appendPath("cesdk_postcard_1.scene")
        .build()
    val imageUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates.premium")
        .appendPath("thumbnails")
        .appendPath("e-commerce")
        .appendPath("e-commerce_modern_square_n1.jpg")
        .build()
    val videoUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.video")
        .appendPath("videos")
        .appendPath("pexels-tony-schnagl-5528015.mp4")
        .build()

    val remoteScene = engine.scene.load(sceneUri = sceneUri, waitForResources = true)

    val sceneString = engine.scene.saveToString(scene = remoteScene)
    val stringScene = engine.scene.load(scene = sceneString, waitForResources = true)

    val archiveBytes = engine.scene.saveToArchive(scene = stringScene)
    val archiveFile = withContext(Dispatchers.IO) {
        val file = File.createTempFile("import-design-", ".imgly")
        val archiveBuffer = archiveBytes.asReadOnlyBuffer()
        file.outputStream().channel.use { channel ->
            while (archiveBuffer.hasRemaining()) {
                channel.write(archiveBuffer)
            }
        }
        file
    }
    val archiveScene = engine.scene.load(
        sceneUri = Uri.fromFile(archiveFile),
        waitForResources = true,
    )

    val imageScene = engine.scene.createFromImage(imageUri = imageUri)

    val previewPngData = engine.block.export(
        block = engine.scene.getPages().first(),
        mimeType = MimeType.PNG,
    )

    val videoScene = engine.scene.createFromVideo(videoUri = videoUri)

    engine.scene.load(sceneUri = sceneUri, waitForResources = true)
    val textBlock = engine.block.findByType(DesignBlockType.Text).first()
    engine.block.setOpacity(block = textBlock, value = 0.85F)

    return ImportDesignResult(
        remoteScene = remoteScene,
        stringScene = stringScene,
        archiveScene = archiveScene,
        imageScene = imageScene,
        videoScene = videoScene,
        textOpacity = engine.block.getOpacity(textBlock),
        pageCount = engine.scene.getPages().size,
        previewPngData = previewPngData,
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-import-design/ImportDesignResult.kt reference-only
import ly.img.engine.DesignBlock
import java.nio.ByteBuffer

data class ImportDesignResult(
    val remoteScene: DesignBlock,
    val stringScene: DesignBlock,
    val archiveScene: DesignBlock,
    val imageScene: DesignBlock,
    val videoScene: DesignBlock,
    val textOpacity: Float,
    val pageCount: Int,
    val previewPngData: ByteBuffer,
)
```

Open existing designs in CE.SDK for Android by loading saved scenes, restoring archives, or creating editable scenes from images and videos.

![Image import rendered from the Android Engine sample](https://img.ly/docs/cesdk/android/open-the-editor/import-design-73b9c5/assets/android.import-design.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-import-design)

<EngineReferenceNote {...props} />

CE.SDK supports several ways to open a design beyond starting from a blank canvas. Each load or create call replaces the active scene, so the imported design becomes the scene your app edits and exports.

The sample receives your app's configured asset base URI and appends one saved scene, one image, and one video resource:

```kotlin highlight-android-source-uris
val sceneUri = assetBaseUri.buildUpon()
    .appendPath("ly.img.templates")
    .appendPath("templates")
    .appendPath("cesdk_postcard_1.scene")
    .build()
val imageUri = assetBaseUri.buildUpon()
    .appendPath("ly.img.templates.premium")
    .appendPath("thumbnails")
    .appendPath("e-commerce")
    .appendPath("e-commerce_modern_square_n1.jpg")
    .build()
val videoUri = assetBaseUri.buildUpon()
    .appendPath("ly.img.video")
    .appendPath("videos")
    .appendPath("pexels-tony-schnagl-5528015.mp4")
    .build()
```

## Understanding Import Methods

CE.SDK provides three Android import approaches, each suited to a different source:

- **Scene files** store design structure, layout, and properties while referencing assets such as images and fonts by URI. They are lightweight, but those asset URIs must stay reachable.
- **Archives** bundle the scene file with accessible referenced assets and use relative references. They are larger, but self-contained and portable. For details on creating archives, see [Import Design from Archive](./import-design/from-archive.md).
- **Media-based scenes** build an editable design directly from a source image or video.

Scene files and archives both use the `.imgly` extension — `.scene` and `.zip` files also load — and the same `engine.scene.load(sceneUri=_)` call opens either kind.

## Import from Other Design Tools

Photoshop (`.psd`) and InDesign (`.idml`) importers run in browser and Node.js environments, not on device in the Android SDK. Convert Photoshop files with the [Node.js PSD importer](./import-design/from-photoshop.md) and InDesign files with the [Node.js IDML importer](./import-design/from-indesign.md), then load the resulting CE.SDK scene or archive on Android with `engine.scene.load()`.

## Load Saved CE.SDK Scenes

Load a previously saved scene to resume editing. The Android Engine API accepts a `Uri`, a serialized scene string, or an archive URI.

### From a URI

Use `engine.scene.load(sceneUri=_)` for a remote HTTPS scene or a local file URI. This fits cloud-based editing where your app receives the scene location from your backend.

```kotlin highlight-android-load-from-uri
val remoteScene = engine.scene.load(sceneUri = sceneUri, waitForResources = true)
```

The engine fetches the scene and replaces the current scene. Passing `waitForResources=true` waits for referenced assets before the sample continues to render, edit, or export the design.

### From a String

Use `engine.scene.load(scene=_)` when your app already has the serialized scene content in memory, such as a value from a database or the result of `engine.scene.saveToString()`. Pass `waitForResources=true` when the next step depends on images, fonts, or other referenced resources being ready.

```kotlin highlight-android-load-from-string
val sceneString = engine.scene.saveToString(scene = remoteScene)
val stringScene = engine.scene.load(scene = sceneString, waitForResources = true)
```

This approach works well for custom storage systems that return scene data as text.

### From an Archive

Use `engine.scene.load(sceneUri=_)` for self-contained scene archives — the same call that loads scene files, since the engine detects the content automatically. Archive creation and temporary-file setup are sample scaffolding; the import call loads the archive URI back into the engine.

```kotlin highlight-android-load-from-archive
val archiveScene = engine.scene.load(
    sceneUri = Uri.fromFile(archiveFile),
    waitForResources = true,
)
```

Archives are useful when original asset URIs might move, expire, or become unavailable. Passing `waitForResources=true` keeps the loaded archive resource-ready for immediate editing or export.

## Create Scenes from Media

Build an editable scene directly from a source image or video instead of loading a saved CE.SDK design.

### From an Image

Use `engine.scene.createFromImage(imageUri=_)` to create a single-page design scene around an image.

```kotlin highlight-android-create-from-image
val imageScene = engine.scene.createFromImage(imageUri = imageUri)
```

The scene is ready for editing, so you can add text, shapes, effects, and other design elements on top of the image.

### From a Video

Use `engine.scene.createFromVideo(videoUri=_)` to create a video scene with the video as the page content.

```kotlin highlight-android-create-from-video
val videoScene = engine.scene.createFromVideo(videoUri = videoUri)
```

The scene is set up for timeline-based editing with the source video as the initial content.

## Choosing the Right Import Method

Pick the method that matches your source and portability requirements:

- **Resuming saved work?** Use `engine.scene.load(sceneUri=_)` or `engine.scene.load(scene=_)` for scenes you previously saved.
- **Assets might be unavailable?** Use `engine.scene.load(sceneUri=_)` with an archive for a self-contained scene with bundled assets.
- **Coming from design tools?** Convert PSD or IDML files outside Android first, then load the converted scene or archive.
- **Starting from media?** Use `engine.scene.createFromImage(imageUri=_)` or `engine.scene.createFromVideo(videoUri=_)`.

## Asset Availability Considerations

When you load a scene file rather than an archive, the referenced assets must stay reachable at their original URIs. Scene files store those references, so an image saved at a remote HTTPS URL must still be served there when the scene loads.

Archives avoid this by bundling assets inside the ZIP and using relative references. Use archives for portable files, offline handoff, or imported designs whose original assets should not be fetched again.

## Working with Loaded Scenes

After importing, the design becomes the active scene. Query and modify its blocks immediately with the block APIs.

```kotlin highlight-android-modify-loaded-scene
engine.scene.load(sceneUri = sceneUri, waitForResources = true)
val textBlock = engine.block.findByType(DesignBlockType.Text).first()
engine.block.setOpacity(block = textBlock, value = 0.85F)
```

## Troubleshooting

**Scene loads with missing images or fonts**

- Confirm every asset URI referenced in the scene is still reachable.
- Use an archive instead of a scene file when assets might move or become unavailable.

**Archive fails to load**

- Ensure the archive was created with `engine.scene.saveToArchive()`.
- Confirm the archive URI is reachable and the file was not truncated during transfer.

**Image or video fails to load**

- Confirm the media URI is reachable and returns the expected file.
- Confirm the media is in a supported image or video format.

**Converted PSD or IDML content is incomplete**

- Check the conversion logs from the browser or Node.js importer that produced the scene or archive.
- Load the converted archive on Android only after conversion succeeds.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.load(sceneUri=_, waitForResources=true)` | Load a scene or archive from a remote or local URI (content detected automatically) and wait for referenced resources |
| `engine.scene.load(scene=_, waitForResources=true)` | Load a scene from serialized scene content and wait for referenced resources |
| `engine.scene.loadArchive(archiveUri=_, waitForResources=true)` | Load a scene archive from a URI |
| `engine.scene.saveToString(scene=_)` | Serialize a scene to a string for later loading |
| `engine.scene.saveToArchive(scene=_)` | Save a scene and its assets as an archive (persist it with the `.imgly` extension) |
| `engine.scene.createFromImage(imageUri=_)` | Create an editable design scene from an image URI |
| `engine.scene.createFromVideo(videoUri=_)` | Create a video scene from a video URI |
| `engine.block.export(block=_, mimeType=MimeType.PNG)` | Export the imported scene preview used by the guide asset |
| `engine.block.findByType(type=DesignBlockType.Text)` | Find text blocks in the active scene |
| `engine.block.setOpacity(block=_, value=_)` | Change block opacity after loading a scene |



---

## Related Pages

- [From InDesign](./import-design/from-indesign.md) - Load a CE.SDK archive converted from an Adobe InDesign IDML file into an Android app.
- [From Photoshop](./import-design/from-photoshop.md) - Load a CE.SDK archive converted from an Adobe Photoshop PSD file into an Android app.
- [Import Design from Archive](./import-design/from-archive.md) - Load self-contained CE.SDK archive files that bundle scene structure with all referenced assets for portable, reliable design imports.


---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support