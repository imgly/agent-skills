> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [Versioning of Assets](./asset-versioning.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-asset-versioning/AssetVersioning.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.Source

data class AssetVersioning(
    val storedUri: Uri,
    val sceneStringLength: Int,
    val archiveSizeBytes: Int,
    val updatedUri: Uri,
    val migratedUris: List<Uri>,
    val migratedSourceSetUris: List<Uri>,
    val migratedSceneStringLength: Int,
    val versionedUrlPatterns: List<String>,
)

suspend fun assetVersioning(engine: Engine): AssetVersioning {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = page, value = 800F)
    engine.block.setHeight(block = page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageUri = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg")
    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(block = imageBlock, value = 50F)
    engine.block.setPositionY(block = imageBlock, value = 50F)
    engine.block.setWidth(block = imageBlock, value = 300F)
    engine.block.setHeight(block = imageBlock, value = 200F)
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = imageUri,
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.appendChild(parent = page, child = imageBlock)

    val secondImageUri = Uri.parse("https://img.ly/static/ubq_samples/sample_3.jpg")
    val secondImageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = secondImageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(block = secondImageBlock, value = 400F)
    engine.block.setPositionY(block = secondImageBlock, value = 50F)
    engine.block.setWidth(block = secondImageBlock, value = 300F)
    engine.block.setHeight(block = secondImageBlock, value = 200F)
    val secondImageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = secondImageFill,
        property = "fill/image/imageFileURI",
        value = secondImageUri,
    )
    engine.block.setSourceSet(
        block = secondImageFill,
        property = "fill/image/sourceSet",
        sourceSet = listOf(
            Source(
                uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_512x341.jpg"),
                width = 512,
                height = 341,
            ),
            Source(
                uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_1024x683.jpg"),
                width = 1024,
                height = 683,
            ),
            Source(
                uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg"),
                width = 2048,
                height = 1366,
            ),
        ),
    )
    engine.block.setFill(block = secondImageBlock, fill = secondImageFill)
    engine.block.appendChild(parent = page, child = secondImageBlock)

    val fill = engine.block.getFill(imageBlock)
    val storedUri = engine.block.getUri(
        block = fill,
        property = "fill/image/imageFileURI",
    )

    check(storedUri == imageUri)

    val sceneString = engine.scene.saveToString(scene = scene)

    val archiveBuffer = engine.scene.saveToArchive(scene = scene)

    val archiveSizeBytes = archiveBuffer.asReadOnlyBuffer().remaining()
    check(sceneString.isNotEmpty())
    check(archiveSizeBytes > 0)

    val loadedScene = engine.scene.load(scene = sceneString, waitForResources = true)
    val loadedPage = engine.scene.getPages().first()
    val loadedImageBlock = engine.block.getChildren(loadedPage).first()
    val loadedFill = engine.block.getFill(loadedImageBlock)
    val updatedUri = Uri.parse("https://img.ly/static/ubq_samples/sample_2.jpg")

    engine.block.setUri(
        block = loadedFill,
        property = "fill/image/imageFileURI",
        value = updatedUri,
    )

    val currentUri = engine.block.getUri(
        block = loadedFill,
        property = "fill/image/imageFileURI",
    )

    check(currentUri == updatedUri)

    val oldAssetPrefix = "https://img.ly/static/ubq_samples"
    val newAssetPrefix = "https://cdn.example.com/assets/v2"
    val migratedUris = mutableListOf<Uri>()
    val migratedSourceSetUris = mutableListOf<Uri>()

    engine.block.findByType(DesignBlockType.Graphic).forEach { block ->
        if (!engine.block.supportsFill(block)) return@forEach

        val blockFill = engine.block.getFill(block)
        if (engine.block.getType(blockFill) != FillType.Image.key) return@forEach

        val previousUri = engine.block.getUri(
            block = blockFill,
            property = "fill/image/imageFileURI",
        )
        if (previousUri.toString().startsWith(oldAssetPrefix)) {
            val migratedUri = Uri.parse(
                previousUri.toString().replace(
                    oldValue = oldAssetPrefix,
                    newValue = newAssetPrefix,
                ),
            )
            engine.block.setUri(
                block = blockFill,
                property = "fill/image/imageFileURI",
                value = migratedUri,
            )
            migratedUris += migratedUri
        }

        var sourceSetChanged = false
        val migratedSourceSet = engine.block.getSourceSet(
            block = blockFill,
            property = "fill/image/sourceSet",
        ).map { source ->
            if (!source.uri.toString().startsWith(oldAssetPrefix)) return@map source

            sourceSetChanged = true
            val migratedSourceUri = Uri.parse(
                source.uri.toString().replace(
                    oldValue = oldAssetPrefix,
                    newValue = newAssetPrefix,
                ),
            )
            migratedSourceSetUris += migratedSourceUri
            source.copy(uri = migratedSourceUri)
        }

        if (sourceSetChanged) {
            engine.block.setSourceSet(
                block = blockFill,
                property = "fill/image/sourceSet",
                sourceSet = migratedSourceSet,
            )
        }
    }

    val migratedSceneString = engine.scene.saveToString(scene = loadedScene)

    check(migratedUris.isNotEmpty())
    check(migratedSceneString.isNotEmpty())

    val pathVersionedUrl = "https://cdn.example.com/assets/v2/logo.png"
    val hashVersionedUrl = "https://cdn.example.com/assets/logo-a1b2c3d4.png"
    val queryVersionedUrl = "https://cdn.example.com/assets/logo.png?v=2"

    return AssetVersioning(
        storedUri = storedUri,
        sceneStringLength = sceneString.length,
        archiveSizeBytes = archiveSizeBytes,
        updatedUri = currentUri,
        migratedUris = migratedUris,
        migratedSourceSetUris = migratedSourceSetUris,
        migratedSceneStringLength = migratedSceneString.length,
        versionedUrlPatterns = listOf(pathVersionedUrl, hashVersionedUrl, queryVersionedUrl),
    )
}
```

Manage how CE.SDK stores and resolves asset URLs in saved designs, keeping designs functional when assets are updated or moved.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-asset-versioning)

<EngineReferenceNote {...props} />

CE.SDK references assets via URLs rather than embedding files directly into
designs. When you save a design with `engine.scene.saveToString()`, asset URLs
are stored as strings. On load, CE.SDK fetches assets from those URLs. This
keeps saved designs small but means URL changes can break existing designs.
This guide explains how CE.SDK stores asset references and strategies for
managing asset URLs over time.

This guide covers how to inspect asset URLs stored in designs, the difference
between scene serialization and archive export, how to programmatically update
asset URLs, and strategies for versioned URL schemes.

## How Asset URLs Are Stored

An asset reference lives on a fill block, not on the graphic block itself. When
you add an image to a design, an image fill stores the source URL in its
`fill/image/imageFileURI` property. Use `engine.block.getFill()` to reach the
fill and `engine.block.getUri()` to inspect the stored URL. Responsive image
variants are stored separately in `fill/image/sourceSet`, so include that
property when a fill uses source sets.

```kotlin highlight-android-how-urls-stored
val fill = engine.block.getFill(imageBlock)
val storedUri = engine.block.getUri(
    block = fill,
    property = "fill/image/imageFileURI",
)
```

The `fill/image/imageFileURI` property contains exactly what gets written to
the saved scene. CE.SDK does not transform or normalize these URLs; they are
stored and loaded as-is.

## Scene Serialization vs Archive Export

CE.SDK provides two approaches for saving designs, each with different
trade-offs for asset handling.

### Saving as a Scene String

The `saveToString()` method serializes the scene structure while keeping asset
references as URLs. This produces a small `String` that loads quickly, but
requires the original assets to remain available at their URLs. Persist the
returned value wherever you store designs.

```kotlin highlight-android-save-scene
val sceneString = engine.scene.saveToString(scene = scene)
```

Use scene strings when:

- Assets are hosted on a stable CDN with reliable URLs.
- You want to keep storage costs low.
- Designs need to load quickly.
- You can guarantee asset availability.

### Saving as an Archive

The `saveToArchive()` method bundles the scene together with all referenced
assets into a self-contained archive. Android returns the archive as a
`ByteBuffer`, which your app can write to storage or upload. Archives work
without network access because every accessible asset is embedded.

```kotlin highlight-android-save-archive
val archiveBuffer = engine.scene.saveToArchive(scene = scene)
```

Archives are useful when:

- Designs need to work offline.
- You migrate designs between environments.
- You cannot guarantee long-term URL availability.
- Portability matters more than file size.

| Approach | Method | Assets | File Size | Portability |
| --- | --- | --- | --- | --- |
| Scene | `saveToString()` | Referenced by URL | Small | Requires URL availability |
| Archive | `saveToArchive()` | Embedded in archive | Larger | Self-contained |

## What Happens When URLs Change

When a design is loaded and an asset URL returns a 404 or is otherwise
unavailable, the affected block appears empty or shows an error state. Other
blocks can still load, so a design may appear partially complete.

CE.SDK does not provide automatic fallbacks or retries for failed asset loads.
A previously fetched copy of the asset may still appear until caches expire,
which can temporarily mask a broken URL.

## Updating Asset URLs Programmatically

When you need to migrate assets to a new location, load the existing scene,
update the URLs, and save the modified scene. Use `engine.block.setUri()` to
point a fill at a new asset.

```kotlin highlight-android-update-url
    val loadedScene = engine.scene.load(scene = sceneString, waitForResources = true)
    val loadedPage = engine.scene.getPages().first()
    val loadedImageBlock = engine.block.getChildren(loadedPage).first()
    val loadedFill = engine.block.getFill(loadedImageBlock)
    val updatedUri = Uri.parse("https://img.ly/static/ubq_samples/sample_2.jpg")

    engine.block.setUri(
        block = loadedFill,
        property = "fill/image/imageFileURI",
        value = updatedUri,
    )

    val currentUri = engine.block.getUri(
        block = loadedFill,
        property = "fill/image/imageFileURI",
    )
```

This pattern is useful when a known asset moves to a new permanent location.
The updated scene string now points at the replacement URL.

For batch migrations, scan graphic blocks, keep only image fills, replace the
old CDN prefix in both the image file URL and any source-set entries, then save
the migrated scene.

```kotlin highlight-android-batch-update
    val oldAssetPrefix = "https://img.ly/static/ubq_samples"
    val newAssetPrefix = "https://cdn.example.com/assets/v2"
    val migratedUris = mutableListOf<Uri>()
    val migratedSourceSetUris = mutableListOf<Uri>()

    engine.block.findByType(DesignBlockType.Graphic).forEach { block ->
        if (!engine.block.supportsFill(block)) return@forEach

        val blockFill = engine.block.getFill(block)
        if (engine.block.getType(blockFill) != FillType.Image.key) return@forEach

        val previousUri = engine.block.getUri(
            block = blockFill,
            property = "fill/image/imageFileURI",
        )
        if (previousUri.toString().startsWith(oldAssetPrefix)) {
            val migratedUri = Uri.parse(
                previousUri.toString().replace(
                    oldValue = oldAssetPrefix,
                    newValue = newAssetPrefix,
                ),
            )
            engine.block.setUri(
                block = blockFill,
                property = "fill/image/imageFileURI",
                value = migratedUri,
            )
            migratedUris += migratedUri
        }

        var sourceSetChanged = false
        val migratedSourceSet = engine.block.getSourceSet(
            block = blockFill,
            property = "fill/image/sourceSet",
        ).map { source ->
            if (!source.uri.toString().startsWith(oldAssetPrefix)) return@map source

            sourceSetChanged = true
            val migratedSourceUri = Uri.parse(
                source.uri.toString().replace(
                    oldValue = oldAssetPrefix,
                    newValue = newAssetPrefix,
                ),
            )
            migratedSourceSetUris += migratedSourceUri
            source.copy(uri = migratedSourceUri)
        }

        if (sourceSetChanged) {
            engine.block.setSourceSet(
                block = blockFill,
                property = "fill/image/sourceSet",
                sourceSet = migratedSourceSet,
            )
        }
    }

    val migratedSceneString = engine.scene.saveToString(scene = loadedScene)
```

Run this kind of migration before decommissioning the old asset host. Keep the old URLs available until every saved design that depends on them has been migrated.

## Strategies for Versioned Asset URLs

Designing your URL scheme to support versioning prevents accidental overwrites
and makes migrations easier.

```kotlin highlight-android-versioned-urls
val pathVersionedUrl = "https://cdn.example.com/assets/v2/logo.png"
val hashVersionedUrl = "https://cdn.example.com/assets/logo-a1b2c3d4.png"
val queryVersionedUrl = "https://cdn.example.com/assets/logo.png?v=2"
```

### Path-Based Versioning

Put the version in the path, such as `https://cdn.example.com/assets/v2/logo.png`. Old designs can keep using the `v1` path while new designs point to `v2`.

### Hash-Based Filenames

Put a content hash in the filename, such as `logo-a1b2c3d4.png`. The URL changes whenever the file changes, which makes the URL safe to cache for a long time.

### Query Parameter Versioning

Add the version as a query parameter, such as `logo.png?v=2`. This keeps the path stable, but you must verify that your CDN includes query parameters in its cache key.

## Best Practices

When managing asset URLs in production:

- **Use immutable URLs**: Content-addressed or versioned paths prevent accidental overwrites.
- **Keep old assets available**: Do not delete assets that may be referenced by saved designs.
- **Use archives for portability**: Export as an archive when designs need to work offline or across environments.
- **Plan CDN migrations carefully**: Update saved designs before decommissioning old URLs.
- **Set appropriate cache headers**: Balance performance with freshness requirements.
- **Document your URL scheme**: Make the versioning strategy clear for your team.

## Troubleshooting

| Issue | Cause | Fix |
| --- | --- | --- |
| Asset shows an old version | Cached copy of the asset | Use a cache-busting or versioned URL |
| Asset does not load | URL changed or deleted | Verify URL accessibility, update the scene |
| Design partially loads | Some assets unavailable | Check all asset URLs, consider an archive export |
| Archive is large | Archive embeds referenced assets | Optimize media before archiving or use scene strings |

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.getFill(block=_)` | Get the fill block that stores the media URL |
| `engine.block.getUri(block=_, property="fill/image/imageFileURI")` | Read an image fill URL |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Replace an image fill URL |
| `engine.block.getSourceSet(block=_, property="fill/image/sourceSet")` | Read responsive image source URLs |
| `engine.block.setSourceSet(block=_, property="fill/image/sourceSet", sourceSet=_)` | Replace responsive image source URLs |
| `engine.block.getChildren(block=_)` | Read child blocks from the loaded page |
| `engine.block.findByType(type=_)` | Find blocks to inspect or migrate |
| `engine.block.supportsFill(block=_)` | Skip blocks that cannot have fills |
| `engine.block.getType(block=_)` | Check whether a fill is an image fill |
| `engine.scene.saveToString(scene=_)` | Save a scene with URI references |
| `engine.scene.load(scene=_, waitForResources=_)` | Load a saved scene string |
| `engine.scene.getPages()` | Get pages from the loaded scene |
| `engine.scene.saveToArchive(scene=_)` | Save a self-contained archive as a `ByteBuffer` |
| `engine.scene.load(sceneUri=_, waitForResources=_)` | Load an archive saved to a URI |

## Next Steps

- [Serve Assets From Your Server](../../serve-assets.md) - Configure self-hosted assets.
- [Save Designs](../../export-save-publish/save.md) - Save and serialize designs.
- [Export Overview](../../export-save-publish/export/overview.md) - Review export options including archives.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support