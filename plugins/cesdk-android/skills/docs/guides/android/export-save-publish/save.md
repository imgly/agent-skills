> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Save](./save.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-save-designs/SaveDesigns.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.CompressionFormat
import ly.img.engine.CompressionLevel
import ly.img.engine.CompressionOptions
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.SaveToArchiveOptions
import ly.img.engine.SaveToStringOptions
import ly.img.engine.ShapeType
import java.io.File
import java.io.FileOutputStream

suspend fun saveDesigns(
    engine: Engine,
    outputDir: File,
): SaveDesigns {
    withContext(Dispatchers.IO) {
        outputDir.mkdirs()
    }

    val scene = engine.scene.create()
    engine.block.setName(scene, name = "Spring Campaign")

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setName(page, name = "Campaign Cover")
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(background, name = "Background Panel")
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 1080F)
    engine.block.setHeight(background, value = 1080F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(block = background, color = Color.fromHex("#FFF4F7FB"))
    engine.block.appendChild(parent = page, child = background)

    val badge = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(badge, name = "Reusable Badge")
    engine.block.setShape(badge, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(badge, value = 330F)
    engine.block.setPositionY(badge, value = 390F)
    engine.block.setWidth(badge, value = 420F)
    engine.block.setHeight(badge, value = 300F)
    engine.block.setFill(badge, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(block = badge, color = Color.fromHex("#FF2156D9"))
    engine.block.appendChild(parent = page, child = badge)

    val sceneString = engine.scene.saveToString(
        scene = scene,
        allowedResourceSchemes = listOf("bundle", "file", "http", "https"),
    )
    check(sceneString.isNotBlank())

    val sceneArchive = engine.scene.saveToArchive(scene = scene)

    val sceneFile = File(outputDir, "spring-campaign.imgly")
    val sceneArchiveFile = File(outputDir, "spring-campaign-archive.imgly")

    withContext(Dispatchers.IO) {
        sceneFile.bufferedWriter(Charsets.UTF_8).use { writer ->
            writer.write(sceneString)
        }

        FileOutputStream(sceneArchiveFile).channel.use { channel ->
            val archiveBuffer = sceneArchive.asReadOnlyBuffer()
            while (archiveBuffer.hasRemaining()) {
                channel.write(archiveBuffer)
            }
        }
    }
    check(sceneFile.length() > 0L)
    check(sceneArchiveFile.length() > 0L)

    val compressedSceneString = engine.scene.saveToString(
        scene = scene,
        options = SaveToStringOptions(
            allowedResourceSchemes = listOf("bundle", "file", "http", "https"),
            compression = CompressionOptions(
                format = CompressionFormat.ZSTD,
                level = CompressionLevel.DEFAULT,
            ),
        ),
    )
    check(compressedSceneString.isNotBlank())

    val compressedSceneArchive = engine.scene.saveToArchive(
        scene = scene,
        options = SaveToArchiveOptions(
            compression = CompressionOptions(
                format = CompressionFormat.ZSTD,
                level = CompressionLevel.DEFAULT,
            ),
        ),
    )
    check(compressedSceneArchive.hasRemaining())

    val blockString = engine.block.saveToString(blocks = listOf(badge))
    val blockArchive = engine.block.saveToArchive(blocks = listOf(badge))

    val blockArchiveFile = File(outputDir, "reusable-badge.zip")
    withContext(Dispatchers.IO) {
        FileOutputStream(blockArchiveFile).channel.use { channel ->
            val archiveBuffer = blockArchive.asReadOnlyBuffer()
            while (archiveBuffer.hasRemaining()) {
                channel.write(archiveBuffer)
            }
        }
    }
    check(blockString.isNotBlank())
    check(blockArchiveFile.length() > 0L)

    val savedScene = withContext(Dispatchers.IO) {
        sceneFile.readText(Charsets.UTF_8)
    }
    val loadedScene = engine.scene.load(
        scene = savedScene,
        waitForResources = true,
    )
    val loadedSceneName = engine.block.getName(loadedScene)
    check(loadedSceneName == "Spring Campaign")

    engine.scene.load(
        sceneUri = Uri.fromFile(sceneArchiveFile),
        waitForResources = true,
    )
    val loadedArchivePageCount = engine.scene.getPages().size
    check(loadedArchivePageCount == 1)

    val currentPage = engine.scene.getPages().first()
    val loadedStringBlocks = engine.block.loadFromString(blockString)
    val loadedArchiveBlocks = engine.block.loadFromArchive(Uri.fromFile(blockArchiveFile))

    (loadedStringBlocks + loadedArchiveBlocks).forEach { block ->
        engine.block.appendChild(parent = currentPage, child = block)
    }

    val loadedBlockNames = (loadedStringBlocks + loadedArchiveBlocks).map(engine.block::getName)
    check(loadedBlockNames == listOf("Reusable Badge", "Reusable Badge"))

    return SaveDesigns(
        sceneStringLength = sceneString.length,
        compressedSceneStringLength = compressedSceneString.length,
        sceneFile = sceneFile,
        sceneArchiveFile = sceneArchiveFile,
        blockStringLength = blockString.length,
        blockArchiveFile = blockArchiveFile,
        loadedSceneName = loadedSceneName,
        loadedArchivePageCount = loadedArchivePageCount,
        loadedBlockNames = loadedBlockNames,
    )
}

data class SaveDesigns(
    val sceneStringLength: Int,
    val compressedSceneStringLength: Int,
    val sceneFile: File,
    val sceneArchiveFile: File,
    val blockStringLength: Int,
    val blockArchiveFile: File,
    val loadedSceneName: String,
    val loadedArchivePageCount: Int,
    val loadedBlockNames: List<String>,
)
```

Save and serialize designs in CE.SDK for later retrieval, sharing, or storage
using string or archive formats.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/engine-guides-save-designs)

CE.SDK provides two formats for persisting designs. Choose the format based on your storage and portability requirements.

<EngineReferenceNote {...props} />

## Save Format Comparison

| Format  | Method            | Assets            | Best For                     |
| ------- | ----------------- | ----------------- | ---------------------------- |
| String  | `saveToString()`  | Referenced by URL | Database storage, cloud sync |
| Archive | `saveToArchive()` | Embedded in ZIP   | Offline use, file sharing    |

**String format** produces a lightweight serialized string where assets remain as URL references. Use this when asset URLs will remain accessible.

**Archive format** creates a self-contained ZIP with all assets embedded. Use this for portable designs that work offline.

Persist saved files of either format with the `.imgly` extension. The `.scene` and `.zip` extensions also load, and the same `engine.scene.load(sceneUri=_)` call opens either kind.

## Save to String

Serialize the current scene to a string suitable for database storage. Android lets you restrict the resource URI schemes that may stay referenced in the saved scene.

```kotlin highlight-android-save-to-string
val sceneString = engine.scene.saveToString(
    scene = scene,
    allowedResourceSchemes = listOf("bundle", "file", "http", "https"),
)
```

The string contains the complete scene structure but references assets by their original URLs. If a referenced asset uses a scheme outside `allowedResourceSchemes`, the save call fails; upload or rewrite those assets before saving, or include the scheme when it is safe for your app.

## Save to Archive

Create a self-contained ZIP with the scene and all embedded assets.

```kotlin highlight-android-save-to-archive
val sceneArchive = engine.scene.saveToArchive(scene = scene)
```

`saveToArchive()` returns a `ByteBuffer` that includes all pages, elements, and available asset data in a single portable file.

## Write to Disk

Use standard Android file APIs to persist saved designs locally before uploading or syncing them.

```kotlin highlight-android-write-to-disk
    val sceneFile = File(outputDir, "spring-campaign.imgly")
    val sceneArchiveFile = File(outputDir, "spring-campaign-archive.imgly")

    withContext(Dispatchers.IO) {
        sceneFile.bufferedWriter(Charsets.UTF_8).use { writer ->
            writer.write(sceneString)
        }

        FileOutputStream(sceneArchiveFile).channel.use { channel ->
            val archiveBuffer = sceneArchive.asReadOnlyBuffer()
            while (archiveBuffer.hasRemaining()) {
                channel.write(archiveBuffer)
            }
        }
    }
```

Scene strings can be written as UTF-8 text. Archive buffers can be streamed from the returned `ByteBuffer` through file NIO APIs to avoid an additional `ByteArray` copy while writing.

## Compression Options

Saved scenes are compressed with Zstd by default, which makes them much smaller and
speeds up both saving and loading. Pass a format explicitly to change the level, or to turn
compression off.

```kotlin highlight-android-compression
val compressedSceneString = engine.scene.saveToString(
    scene = scene,
    options = SaveToStringOptions(
        allowedResourceSchemes = listOf("bundle", "file", "http", "https"),
        compression = CompressionOptions(
            format = CompressionFormat.ZSTD,
            level = CompressionLevel.DEFAULT,
        ),
    ),
)
```

**Compression Formats:**

- `CompressionFormat.ZSTD` - Zstd compression (default)
- `CompressionFormat.NONE` - No compression

**Compression Levels:**

- `CompressionLevel.FASTEST` - Fastest compression, larger output
- `CompressionLevel.DEFAULT` - Balanced speed and size
- `CompressionLevel.BEST` - Best compression, slower

An archive can compress its scene the same way. Bundled images, video and fonts are stored as they are, because they already are compressed formats.

```kotlin highlight-android-archive-compression
val compressedSceneArchive = engine.scene.saveToArchive(
    scene = scene,
    options = SaveToArchiveOptions(
        compression = CompressionOptions(
            format = CompressionFormat.ZSTD,
            level = CompressionLevel.DEFAULT,
        ),
    ),
)
```

Use the default Zstandard level for most app sync and project persistence workflows.

## Save Blocks

Save specific blocks when your app needs reusable elements, layout presets, or block hierarchies instead of a full scene.

```kotlin highlight-android-save-blocks
val blockString = engine.block.saveToString(blocks = listOf(badge))
val blockArchive = engine.block.saveToArchive(blocks = listOf(badge))
```

Block strings are lightweight and keep external resources as references. Block archives bundle available resources for portable reuse.

## Load Scene from File

Read a previously saved `.scene` file and restore it with `engine.scene.load()`.

```kotlin highlight-android-load-scene
val savedScene = withContext(Dispatchers.IO) {
    sceneFile.readText(Charsets.UTF_8)
}
val loadedScene = engine.scene.load(
    scene = savedScene,
    waitForResources = true,
)
```

Loading a scene replaces the current scene. Scene files are lightweight but require the original asset URLs to remain accessible.

## Load Archive from File

Use `engine.scene.load()` with a local file `Uri` to restore a self-contained archive — the same call that loads scene files, since the engine detects the content automatically.

```kotlin highlight-android-load-archive
engine.scene.load(
    sceneUri = Uri.fromFile(sceneArchiveFile),
    waitForResources = true,
)
```

Archives are portable and work offline since all bundled assets are resolved relative to the archive.

## Load Blocks

Use `engine.block.loadFromString()` or `engine.block.loadFromArchive()` to restore saved blocks. Loaded blocks are not attached automatically, so append them to a page or another parent block.

```kotlin highlight-android-load-blocks
    val currentPage = engine.scene.getPages().first()
    val loadedStringBlocks = engine.block.loadFromString(blockString)
    val loadedArchiveBlocks = engine.block.loadFromArchive(Uri.fromFile(blockArchiveFile))

    (loadedStringBlocks + loadedArchiveBlocks).forEach { block ->
        engine.block.appendChild(parent = currentPage, child = block)
    }
```

This keeps project loading separate from reusable component loading.

## Troubleshooting

- **Save fails before a scene exists:** Create or load a scene first and keep the returned scene block ID. Pass that ID to scene save APIs instead of calling save logic before your editor or engine setup has produced a scene.
- **Assets are missing after loading a string or `.scene` file:** String and `.scene` saves keep assets as URI references. Make sure those URLs are still reachable from the Android app, or use an archive save when the design must work offline.
- **String saves fail because of disallowed resource schemes:** The `allowedResourceSchemes` list controls which asset URI schemes may stay referenced. Upload local or temporary resources to a durable URL before saving, or include only the schemes your app can safely resolve later.
- **Archives are larger than string saves:** Archives bundle available assets, which makes them portable and offline-friendly but increases file size. Use string saves for database sync when referenced assets remain available, and archives for file sharing or offline restore.

## API Reference

| Method                                                                               | Description                                                             |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `engine.scene.saveToString(scene=_, allowedResourceSchemes=_)`                       | Serialize a scene to a string                                           |
| `engine.scene.saveToString(scene=_, options=_)`                                      | Serialize a scene with save options such as compression                 |
| `engine.scene.saveToArchive(scene=_)`                                                | Save a scene with assets as a ZIP `ByteBuffer`                          |
| `engine.scene.load(scene=_, overrideEditorConfig=_, waitForResources=_)`             | Load a scene from a serialized string                                   |
| `engine.scene.load(sceneUri=_, overrideEditorConfig=_, waitForResources=_)`          | Load a scene or archive from a local or remote URI (content detected automatically) |
| `engine.scene.loadArchive(archiveUri=_, overrideEditorConfig=_, waitForResources=_)` | Load a scene archive from a URI |
| `engine.scene.getPages()`                                                            | Return the pages in the current scene                                   |
| `engine.block.saveToString(blocks=_, allowedResourceSchemes=_)`                      | Serialize specific blocks to a string                                   |
| `engine.block.saveToArchive(blocks=_)`                                               | Save specific blocks with assets as a ZIP `ByteBuffer`                  |
| `engine.block.loadFromString(block=_)`                                               | Load blocks from a serialized string                                    |
| `engine.block.loadFromArchive(archiveUri=_)`                                         | Load blocks from a ZIP archive URI                                      |
| `engine.block.loadFromURL(url=_)`                                                    | Load blocks from a `blocks.blocks` URL inside an unzipped block archive |
| `engine.block.appendChild(parent=_, child=_)`                                        | Attach a loaded block to a scene hierarchy                              |

## Next Steps

- [Export Overview](./export/overview.md) - Export designs to image, PDF, and video
  formats
- [Load Scene](../open-the-editor/load-scene.md) - Load scenes from remote URLs and archives
- [Store Custom Metadata](./store-custom-metadata.md) - Attach metadata like tags or version
  info to designs
- [Partial Export](./export/partial-export.md) - Learn how to export specific blocks,
  groups, and page elements instead of entire scenes using CE.SDK's programmatic
  export API.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support