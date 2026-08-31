> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Create a Custom Importer](./create-custom-importer.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-custom-asset-source/CreateCustomImporter.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Asset
import ly.img.engine.AssetContext
import ly.img.engine.AssetCredits
import ly.img.engine.AssetLicense
import ly.img.engine.AssetSource
import ly.img.engine.AssetUTM
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.FindAssetsResult
import ly.img.engine.MimeType
import ly.img.engine.ShapeType

private const val CUSTOM_IMPORTER_SOURCE_ID = "com.example.media.images"
private const val DEMO_MEDIA_BASE_URI = "https://media.example.com"

data class CreateCustomImporterResult(
    val sourceId: String,
    val assetIds: List<String>,
    val groups: List<String>,
    val nextPage: Int,
    val total: Int,
    val sourceStillRegistered: Boolean,
)

suspend fun createCustomImporter(engine: Engine): CreateCustomImporterResult {
    val source = BackendImageAssetSource(mediaItems = demoMediaItems())

    if (source.sourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(source.sourceId)
    }

    engine.asset.addSource(source)

    val groups = engine.asset.getGroups(sourceId = source.sourceId).orEmpty()
    val result = engine.asset.findAssets(
        sourceId = source.sourceId,
        query = FindAssetsQuery(
            query = "summer",
            page = 0,
            perPage = 2,
            locale = "en",
        ),
    )

    engine.asset.assetSourceContentsChanged(sourceId = source.sourceId)

    return CreateCustomImporterResult(
        sourceId = source.sourceId,
        assetIds = result.assets.map { asset -> asset.id },
        groups = groups,
        nextPage = result.nextPage,
        total = result.total,
        sourceStillRegistered = source.sourceId in engine.asset.findAllSources(),
    )
}

class BackendImageAssetSource(
    private val mediaItems: List<BackendMediaItem>,
) : AssetSource(sourceId = CUSTOM_IMPORTER_SOURCE_ID) {
    override val supportedMimeTypes = listOf(MimeType.JPEG.key)

    override val credits = AssetCredits(
        name = "App media library",
        uri = null,
    )

    override val license = AssetLicense(
        name = "App media license",
        uri = null,
    )

    override suspend fun getGroups(): List<String> = withContext(Dispatchers.IO) {
        mediaItems.flatMap { item -> item.groups }.distinct()
    }

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        val terms = query.query.orEmpty()
            .lowercase()
            .split(" ")
            .filter { term -> term.isNotBlank() }
        val requestedPage = query.page.coerceAtLeast(0)
        val pageSize = query.perPage.coerceAtLeast(1)
        val requestedGroups = query.groups.orEmpty()

        val filteredItems = mediaItems.filter { item ->
            val matchesQuery = terms.isEmpty() ||
                terms.all { term ->
                    item.label.lowercase().contains(term) ||
                        item.tags.any { tag -> tag.lowercase().contains(term) }
                }
            val matchesGroup = requestedGroups.isEmpty() ||
                item.groups.any { group -> group in requestedGroups }
            matchesQuery && matchesGroup
        }

        val start = requestedPage * pageSize
        val pageItems = filteredItems.drop(start).take(pageSize)

        FindAssetsResult(
            assets = pageItems.map { item -> item.toAsset(sourceId = sourceId) },
            currentPage = requestedPage,
            nextPage = if (start + pageSize < filteredItems.size) requestedPage + 1 else -1,
            total = filteredItems.size,
        )
    }

    private fun BackendMediaItem.toAsset(sourceId: String) = Asset(
        id = id,
        context = AssetContext(sourceId = sourceId),
        label = label,
        locale = locale,
        tags = tags,
        groups = groups,
        meta = mapOf(
            "uri" to uri,
            "thumbUri" to thumbUri,
            "mimeType" to mimeType,
            "blockType" to DesignBlockType.Graphic.key,
            "fillType" to FillType.Image.key,
            "shapeType" to ShapeType.Rect.key,
            "kind" to "image",
            "width" to width.toString(),
            "height" to height.toString(),
        ),
        credits = AssetCredits(
            name = authorName,
            uri = authorUri?.let(Uri::parse),
        ),
        license = AssetLicense(
            name = licenseName,
            uri = licenseUri?.let(Uri::parse),
        ),
        utm = AssetUTM(source = "app-media", medium = "importer"),
    )
}

private fun demoMediaItems() = listOf(
    BackendMediaItem(
        id = "summer-card",
        label = "Summer card",
        tags = listOf("summer", "card", "campaign"),
        groups = listOf("campaigns"),
        path = "summer-card.jpg",
        thumbPath = "summer-card-thumb.jpg",
        width = 1600,
        height = 1200,
        authorName = "Design Team",
    ),
    BackendMediaItem(
        id = "summer-banner",
        label = "Summer banner",
        tags = listOf("summer", "banner", "product"),
        groups = listOf("products"),
        path = "summer-banner.jpg",
        thumbPath = "summer-banner-thumb.jpg",
        width = 1920,
        height = 1080,
        authorName = "Design Team",
    ),
    BackendMediaItem(
        id = "summer-square",
        label = "Summer square",
        tags = listOf("summer", "square", "social"),
        groups = listOf("campaigns"),
        path = "summer-square.jpg",
        thumbPath = "summer-square-thumb.jpg",
        width = 1200,
        height = 1200,
        authorName = "Content Team",
    ),
)

data class BackendMediaItem(
    val id: String,
    val label: String,
    val tags: List<String>,
    val groups: List<String>,
    val path: String,
    val thumbPath: String,
    val width: Int,
    val height: Int,
    val authorName: String,
    val locale: String = "en",
    val mimeType: String = MimeType.JPEG.key,
    val licenseName: String = "App media license",
    val authorUri: String? = null,
    val licenseUri: String? = null,
) {
    val uri = "$DEMO_MEDIA_BASE_URI/$path"
    val thumbUri = "$DEMO_MEDIA_BASE_URI/thumbnails/$thumbPath"
}
```

Create a custom media importer by connecting your app's backend to CE.SDK's
asset system with an Android `AssetSource`.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-rc.0/engine-guides-custom-asset-source)

<EngineReferenceNote {...props} />

A custom importer is an asset source that translates media from your app into CE.SDK asset results. The source receives search and pagination requests from the Engine, fetches or filters media in your own data layer, and returns `Asset` objects with enough metadata for CE.SDK to preview and apply them.

This guide uses a deterministic in-memory media list to keep the sample runnable without network access. In production, replace that list with your API client and return permanent HTTPS URLs for the media and thumbnail fields.

## Define an Asset Source

Extend `AssetSource` with a stable `sourceId`. The source also declares the MIME types it can provide and optional source-level credits or license information.

```kotlin highlight-android-source-definition
class BackendImageAssetSource(
    private val mediaItems: List<BackendMediaItem>,
) : AssetSource(sourceId = CUSTOM_IMPORTER_SOURCE_ID) {
    override val supportedMimeTypes = listOf(MimeType.JPEG.key)

    override val credits = AssetCredits(
        name = "App media library",
        uri = null,
    )

    override val license = AssetLicense(
        name = "App media license",
        uri = null,
    )

    override suspend fun getGroups(): List<String> = withContext(Dispatchers.IO) {
        mediaItems.flatMap { item -> item.groups }.distinct()
    }
```

`findAssets` and `getGroups` are the required callbacks. CE.SDK calls them when the asset library, your app, or any other Engine workflow needs to browse this source.

## Return Paginated Results

Implement `findAssets` by translating the incoming `FindAssetsQuery` into your backend query. Return only the requested page and set `nextPage` to `-1` when there are no more results.

```kotlin highlight-android-find-assets
    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        val terms = query.query.orEmpty()
            .lowercase()
            .split(" ")
            .filter { term -> term.isNotBlank() }
        val requestedPage = query.page.coerceAtLeast(0)
        val pageSize = query.perPage.coerceAtLeast(1)
        val requestedGroups = query.groups.orEmpty()

        val filteredItems = mediaItems.filter { item ->
            val matchesQuery = terms.isEmpty() ||
                terms.all { term ->
                    item.label.lowercase().contains(term) ||
                        item.tags.any { tag -> tag.lowercase().contains(term) }
                }
            val matchesGroup = requestedGroups.isEmpty() ||
                item.groups.any { group -> group in requestedGroups }
            matchesQuery && matchesGroup
        }

        val start = requestedPage * pageSize
        val pageItems = filteredItems.drop(start).take(pageSize)

        FindAssetsResult(
            assets = pageItems.map { item -> item.toAsset(sourceId = sourceId) },
            currentPage = requestedPage,
            nextPage = if (start + pageSize < filteredItems.size) requestedPage + 1 else -1,
            total = filteredItems.size,
        )
    }
```

Run network or database work off the main dispatcher. The callback itself is `suspend`, so you can call your repository, cache, or HTTP client and then return a `FindAssetsResult`.

## Map Backend Media to Assets

Each backend item becomes an `Asset`. The required field is `id`, but media importers should also include labels, tags, groups, thumbnail URLs, content URLs, and type hints.

```kotlin highlight-android-map-asset
private fun BackendMediaItem.toAsset(sourceId: String) = Asset(
    id = id,
    context = AssetContext(sourceId = sourceId),
    label = label,
    locale = locale,
    tags = tags,
    groups = groups,
    meta = mapOf(
        "uri" to uri,
        "thumbUri" to thumbUri,
        "mimeType" to mimeType,
        "blockType" to DesignBlockType.Graphic.key,
        "fillType" to FillType.Image.key,
        "shapeType" to ShapeType.Rect.key,
        "kind" to "image",
        "width" to width.toString(),
        "height" to height.toString(),
    ),
    credits = AssetCredits(
        name = authorName,
        uri = authorUri?.let(Uri::parse),
    ),
    license = AssetLicense(
        name = licenseName,
        uri = licenseUri?.let(Uri::parse),
    ),
    utm = AssetUTM(source = "app-media", medium = "importer"),
)
```

The `meta` map drives the default apply behavior:

| Key | Purpose |
| --- | --- |
| `uri` | Permanent URL for the media file. |
| `thumbUri` | Preview image shown by asset browsing UI. |
| `mimeType` | MIME type used before CE.SDK loads the asset data. |
| `blockType` | Design block type to create when the asset is applied. |
| `fillType` | Fill type used for graphic media. |
| `shapeType` | Shape type attached to the graphic block. |
| `kind` | App-facing category stored on the resulting block. |
| `width` / `height` | Original media dimensions when known. |

The sample uses `DesignBlockType.Graphic.key`, `FillType.Image.key`, and `ShapeType.Rect.key` so CE.SDK can create an image graphic without guessing from the file.

## Register and Query the Source

Register the source once on the Engine before querying it or exposing it through an asset library entry.

```kotlin highlight-android-register-source
engine.asset.addSource(source)
```

You can then query the registered source directly. This is the same path CE.SDK uses when UI surfaces browse the source.

```kotlin highlight-android-query-source
val groups = engine.asset.getGroups(sourceId = source.sourceId).orEmpty()
val result = engine.asset.findAssets(
    sourceId = source.sourceId,
    query = FindAssetsQuery(
        query = "summer",
        page = 0,
        perPage = 2,
        locale = "en",
    ),
)
```

When your backend changes outside CE.SDK, notify the Engine so subscribers and UI surfaces can refresh their cached source contents.

```kotlin highlight-android-refresh-source
engine.asset.assetSourceContentsChanged(sourceId = source.sourceId)
```

## API Reference

| Method | Purpose |
| --- | --- |
| `AssetSource(sourceId=_)` | Defines a custom asset source with a stable source identifier. |
| `AssetSource.findAssets(query=_)` | Returns one page of assets for a search, group filter, locale, and pagination request. |
| `AssetSource.getGroups()` | Lists the groups exposed by the source. |
| `engine.asset.addSource(source=_)` | Registers the custom source with the Engine. |
| `engine.asset.findAssets(sourceId=_, query=_)` | Queries a registered source directly. |
| `engine.asset.getGroups(sourceId=_)` | Reads the groups exposed by a registered source. |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notifies CE.SDK that external source contents changed. |

## Key Types

| Type | Purpose |
| --- | --- |
| `FindAssetsQuery` | Search text, locale, group filters, sort options, page, and page size. |
| `FindAssetsResult` | Returned assets plus `currentPage`, `nextPage`, and `total`. |
| `Asset` | One result in a source, including labels, tags, groups, metadata, credits, and license data. |
| `AssetContext` | Connects an asset result to the source that produced it. |
| `DesignBlockType`, `FillType`, `ShapeType` | Type-safe constants for metadata values that drive default insertion. |

## Next Steps

- [Asset Concepts](./concepts.md) - Understand how sources, assets, metadata, and UI surfaces fit together.
- [From Your Server](./from-remote-source/your-server.md) — Load images, videos, and audio from your backend servers into CE.SDK for integration with CMS, DAM, or custom asset management systems.
- [Thumbnails](./asset-library/thumbnails.md) — Configure thumbnail images for assets in CE.SDK's asset library with proper sizing, preview URIs for audio, and customized UI display.
- [Customize](./asset-library/customize.md) - Add custom sources to the Android asset library UI.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support