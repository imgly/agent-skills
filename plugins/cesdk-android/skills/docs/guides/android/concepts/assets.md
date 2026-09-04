> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Assets](./assets.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-concepts-assets/ConceptsAssets.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Job
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.withContext
import ly.img.engine.Asset
import ly.img.engine.AssetContext
import ly.img.engine.AssetCredits
import ly.img.engine.AssetDefinition
import ly.img.engine.AssetLicense
import ly.img.engine.AssetSource
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FetchAssetOptions
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.FindAssetsResult
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.util.UUID

suspend fun conceptsAssets(engine: Engine) = withContext(engine.dispatcher) {
    val sourceEventJobs = mutableListOf<Job>()
    val invocationId = UUID.randomUUID()
    val source = BrandedAssetSource(sourceId = "ly.img.asset.source.branded.$invocationId")
    val localSourceId = "my-local-images.$invocationId"
    val registeredGuideSourceIds = mutableListOf<String>()

    try {
        val scene = engine.scene.create()
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = scene, child = page)

        sourceEventJobs += engine.asset.onAssetSourceAdded()
            .onEach { println("Asset source added: $it") }
            .launchIn(this)

        sourceEventJobs += engine.asset.onAssetSourceRemoved()
            .onEach { println("Asset source removed: $it") }
            .launchIn(this)

        sourceEventJobs += engine.asset.onAssetSourceUpdated()
            .onEach { println("Asset source updated: $it") }
            .launchIn(this)

        engine.asset.addSource(source)
        registeredGuideSourceIds += source.sourceId

        val queriedAssets = engine.asset.findAssets(
            sourceId = source.sourceId,
            query = FindAssetsQuery(
                perPage = 10,
                page = 0,
                query = "logo",
                groups = listOf("logos"),
            ),
        )
        val queriedAsset = queriedAssets.assets.first()
        val groups = engine.asset.getGroups(sourceId = source.sourceId)
        println("Found ${queriedAssets.total} assets in groups $groups")

        val appliedBlock = engine.asset.applyAssetSourceAsset(
            sourceId = source.sourceId,
            asset = queriedAsset,
        )
        if (appliedBlock != null) {
            engine.block.setPositionX(appliedBlock, 64F)
            engine.block.setPositionY(appliedBlock, 64F)
        }

        if (appliedBlock != null) {
            engine.block.forceLoadResources(listOf(appliedBlock))
        }

        engine.asset.addLocalSource(
            sourceId = localSourceId,
            supportedMimeTypes = listOf(MimeType.JPEG.key),
        )
        registeredGuideSourceIds += localSourceId

        val localAsset = AssetDefinition(
            id = "sunrise-poster",
            label = mapOf("en" to "Sunrise Poster"),
            tags = mapOf("en" to listOf("poster", "sunrise", "brand")),
            groups = listOf("posters"),
            meta = mapOf(
                "uri" to "https://img.ly/static/ubq_samples/sample_1.jpg",
                "thumbUri" to "https://img.ly/static/ubq_samples/sample_1.jpg",
                "mimeType" to MimeType.JPEG.key,
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1080",
                "height" to "1080",
            ),
        )
        engine.asset.addAsset(sourceId = localSourceId, asset = localAsset)
        engine.asset.assetSourceContentsChanged(sourceId = localSourceId)
    } finally {
        withContext(NonCancellable) {
            try {
                removeRegisteredGuideSources(engine = engine, sourceIds = registeredGuideSourceIds)
            } finally {
                sourceEventJobs.forEach { it.cancel() }
                sourceEventJobs.forEach { it.join() }
            }
        }
    }
}

private fun removeRegisteredGuideSources(
    engine: Engine,
    sourceIds: List<String>,
) {
    var cleanupFailure: Throwable? = null

    sourceIds.asReversed().forEach { sourceId ->
        try {
            engine.asset.removeSource(sourceId)
        } catch (throwable: Throwable) {
            val previousFailure = cleanupFailure
            if (previousFailure == null) {
                cleanupFailure = throwable
            } else {
                previousFailure.addSuppressed(throwable)
            }
        }
    }

    cleanupFailure?.let { throw it }
}

private class BrandedAssetSource(
    sourceId: String,
) : AssetSource(sourceId = sourceId) {
    override val supportedMimeTypes = listOf(MimeType.JPEG.key)

    override val credits = AssetCredits(
        name = "IMG.LY",
        uri = Uri.parse("https://img.ly/"),
    )

    override val license = AssetLicense(
        name = "Sample content",
        uri = Uri.parse("https://img.ly/legal/"),
    )

    override suspend fun getGroups(): List<String>? = brandedAssets.flatMap { it.groups.orEmpty() }.distinct()

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult {
        val searchQuery = query.query
        val queryGroups = query.groups.orEmpty()
        val filteredAssets = brandedAssets.filter { asset ->
            val matchesQuery =
                searchQuery.isNullOrBlank() ||
                    buildList {
                        asset.label?.let(::add)
                        addAll(asset.tags.orEmpty())
                    }.any { value ->
                        value.contains(searchQuery, ignoreCase = true)
                    }

            val matchesGroups =
                queryGroups.isEmpty() ||
                    asset.groups.orEmpty().any(queryGroups::contains)

            matchesQuery && matchesGroups
        }
        val startIndex = query.page * query.perPage
        val pageAssets = filteredAssets.drop(startIndex).take(query.perPage)
        val nextPage =
            if (startIndex + pageAssets.size < filteredAssets.size) {
                query.page + 1
            } else {
                -1
            }

        return FindAssetsResult(
            assets = pageAssets,
            currentPage = query.page,
            nextPage = nextPage,
            total = filteredAssets.size,
        )
    }

    override suspend fun fetchAsset(
        id: String,
        options: FetchAssetOptions,
    ): Asset? = brandedAssets.firstOrNull { it.id == id }

    private val brandedAssets = listOf(
        Asset(
            id = "imgly-logo",
            context = AssetContext(sourceId = sourceId),
            label = "IMG.LY Logo",
            locale = "en",
            tags = listOf("logo", "brand", "header"),
            groups = listOf("logos"),
            meta = mapOf(
                "uri" to "https://img.ly/static/ubq_samples/imgly_logo.jpg",
                "thumbUri" to "https://img.ly/static/ubq_samples/imgly_logo.jpg",
                "mimeType" to MimeType.JPEG.key,
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "640",
                "height" to "320",
            ),
        ),
        Asset(
            id = "brand-background",
            context = AssetContext(sourceId = sourceId),
            label = "Brand Background",
            locale = "en",
            tags = listOf("background", "brand", "hero"),
            groups = listOf("backgrounds"),
            meta = mapOf(
                "uri" to "https://img.ly/static/ubq_samples/sample_4.jpg",
                "thumbUri" to "https://img.ly/static/ubq_samples/sample_4.jpg",
                "mimeType" to MimeType.JPEG.key,
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1080",
                "height" to "720",
            ),
        ),
    )
}
```

Understand the asset system on Android, including how CE.SDK models asset data, exposes assets through sources, and turns
those assets into blocks in a scene.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260904/engine-guides-concepts-assets)

<EngineReferenceNote {...props} />

Images, videos, audio, fonts, stickers, and templates are all *assets* in CE.SDK. The Android engine gets access to them
through *asset sources*. When you apply an asset, CE.SDK creates or updates a block so that the asset becomes visible in the
scene.

This guide covers the core concepts of the asset system. For a concrete media workflow, see the [Images](../insert-media/images.md)
guide. For related concepts, see [Blocks](./blocks.md) and [Resources](./resources.md).

## Assets vs Blocks

**Assets** are content definitions with metadata such as URIs, dimensions, tags, and grouping information. They exist outside
the scene tree. **Blocks** are the visual elements in the scene that render or reference that content.

When you apply an asset, CE.SDK creates a block configured from the asset metadata or updates an existing block with new asset
data. Multiple blocks can reuse the same asset definition, and an asset can exist in a source without being used in the scene yet.

## The Asset Data Model

On Android, `findAssets()` returns `Asset` objects and local sources accept `AssetDefinition` objects. They share the same core
ideas: IDs, localized labels, tags, groups, structured payload data, and `meta` entries that describe how the asset should be
handled.

```kotlin highlight-android-concepts-assets-asset-definition
Asset(
    id = "imgly-logo",
    context = AssetContext(sourceId = sourceId),
    label = "IMG.LY Logo",
    locale = "en",
    tags = listOf("logo", "brand", "header"),
    groups = listOf("logos"),
    meta = mapOf(
        "uri" to "https://img.ly/static/ubq_samples/imgly_logo.jpg",
        "thumbUri" to "https://img.ly/static/ubq_samples/imgly_logo.jpg",
        "mimeType" to MimeType.JPEG.key,
        "kind" to "image",
        "blockType" to DesignBlockType.Graphic.key,
        "fillType" to FillType.Image.key,
        "shapeType" to ShapeType.Rect.key,
        "width" to "640",
        "height" to "320",
    ),
),
```

Key properties include:

- `id` for the stable asset identifier.
- `context` for the `sourceId` that produced the asset.
- `label` and `locale` for localized display text.
- `tags` and `groups` for search and filtering.
- `meta` for content-specific fields such as `uri`, `thumbUri`, `mimeType`, `blockType`, `fillType`, `shapeType`, `width`, and `height`.
- `payload` for structured values such as colors, typefaces, source sets, or transform presets when plain string metadata is not enough.

> **Note:** When you load a JSON-backed local source or add assets programmatically, the same metadata keys show up in your asset catalog
> definitions.

## Asset Sources

Asset sources provide assets to the editor and the engine APIs. On Android, a custom source subclasses `AssetSource` and
implements at least `findAssets(query)` and `getGroups()`.

```kotlin highlight-android-concepts-assets-asset-source
    override suspend fun getGroups(): List<String>? = brandedAssets.flatMap { it.groups.orEmpty() }.distinct()

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult {
        val searchQuery = query.query
        val queryGroups = query.groups.orEmpty()
        val filteredAssets = brandedAssets.filter { asset ->
            val matchesQuery =
                searchQuery.isNullOrBlank() ||
                    buildList {
                        asset.label?.let(::add)
                        addAll(asset.tags.orEmpty())
                    }.any { value ->
                        value.contains(searchQuery, ignoreCase = true)
                    }

            val matchesGroups =
                queryGroups.isEmpty() ||
                    asset.groups.orEmpty().any(queryGroups::contains)

            matchesQuery && matchesGroups
        }
        val startIndex = query.page * query.perPage
        val pageAssets = filteredAssets.drop(startIndex).take(query.perPage)
        val nextPage =
            if (startIndex + pageAssets.size < filteredAssets.size) {
                query.page + 1
            } else {
                -1
            }

        return FindAssetsResult(
            assets = pageAssets,
            currentPage = query.page,
            nextPage = nextPage,
            total = filteredAssets.size,
        )
    }

    override suspend fun fetchAsset(
        id: String,
        options: FetchAssetOptions,
    ): Asset? = brandedAssets.firstOrNull { it.id == id }
```

The `FindAssetsQuery` object contains paging, text search, sorting, tag, and group filters, plus the structured `filter`
predicates and the requested `facets` paths. Your source responds with a `FindAssetsResult` that contains the assets for the
requested page, the total match count, `nextPage`, which is `-1` when there are no more results, and a `facets` map when the
query requests distributions.

Sources can also expose `supportedMimeTypes`, `credits`, `license`, `fetchAsset()`, and custom `applyAsset()` behavior when you
need more than the default block creation logic.

## Querying Assets

Use `engine.asset.findAssets()` to search a source. Android pages are zero-based, so the first request uses `page = 0`.

```kotlin highlight-android-concepts-assets-query-assets
val queriedAssets = engine.asset.findAssets(
    sourceId = source.sourceId,
    query = FindAssetsQuery(
        perPage = 10,
        page = 0,
        query = "logo",
        groups = listOf("logos"),
    ),
)
val queriedAsset = queriedAssets.assets.first()
val groups = engine.asset.getGroups(sourceId = source.sourceId)
println("Found ${queriedAssets.total} assets in groups $groups")
```

This is the point where you typically combine free-text search with `groups`, `tags`, or sorting. You can also call
`engine.asset.getGroups()` to inspect the filters that a source exposes before you build your own asset browser UI.

The optional `filter` parameter narrows a query with structured `AssetFilter` predicates (`Equals` and `Contains` on a property
path, combined with `And`, `Or`, and `Not`). The optional `facets` parameter requests value distributions for `tags`, `groups`,
or `meta.<key>` paths over the matched set—for example to populate a filter dropdown. Each distribution is ordered by count
descending and returned in `FindAssetsResult.facets`; combine `facets` with `perPage = 0` to enumerate available values without
fetching assets.

## Applying Assets

Use `engine.asset.applyAssetSourceAsset()` when you want the source's custom apply behavior. If the source does not override
`applyAsset()`, CE.SDK falls back to `defaultApplyAsset()` and creates a block from the asset's `meta` fields.

```kotlin highlight-android-concepts-assets-apply-asset
val appliedBlock = engine.asset.applyAssetSourceAsset(
    sourceId = source.sourceId,
    asset = queriedAsset,
)
if (appliedBlock != null) {
    engine.block.setPositionX(appliedBlock, 64F)
    engine.block.setPositionY(appliedBlock, 64F)
}
```

That block can then be positioned, resized, or otherwise modified through the regular block APIs.

## Local Asset Sources

Local asset sources keep their assets in memory and are ideal for uploads, generated media, or app-specific catalogs that you
construct at runtime.

```kotlin highlight-android-concepts-assets-local-source
        engine.asset.addLocalSource(
            sourceId = localSourceId,
            supportedMimeTypes = listOf(MimeType.JPEG.key),
        )
        registeredGuideSourceIds += localSourceId

        val localAsset = AssetDefinition(
            id = "sunrise-poster",
            label = mapOf("en" to "Sunrise Poster"),
            tags = mapOf("en" to listOf("poster", "sunrise", "brand")),
            groups = listOf("posters"),
            meta = mapOf(
                "uri" to "https://img.ly/static/ubq_samples/sample_1.jpg",
                "thumbUri" to "https://img.ly/static/ubq_samples/sample_1.jpg",
                "mimeType" to MimeType.JPEG.key,
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1080",
                "height" to "1080",
            ),
        )
        engine.asset.addAsset(sourceId = localSourceId, asset = localAsset)
        engine.asset.assetSourceContentsChanged(sourceId = localSourceId)
```

`AssetDefinition` uses localized `label` and `tags` maps, while `meta` carries the URI, MIME type, and block creation hints that
`defaultApplyAsset()` needs later on.

## Source Events

The asset API exposes `Flow<String>` streams for source lifecycle changes. These are useful when your UI needs to refresh its
filters or grid contents after sources are added, removed, or updated.

```kotlin highlight-android-concepts-assets-source-events
        sourceEventJobs += engine.asset.onAssetSourceAdded()
            .onEach { println("Asset source added: $it") }
            .launchIn(this)

        sourceEventJobs += engine.asset.onAssetSourceRemoved()
            .onEach { println("Asset source removed: $it") }
            .launchIn(this)

        sourceEventJobs += engine.asset.onAssetSourceUpdated()
            .onEach { println("Asset source updated: $it") }
            .launchIn(this)
```

After mutating a source, call `engine.asset.assetSourceContentsChanged(sourceId)` so subscribers know they should re-query the
source.

## Next Steps

- [Basics](../import-media/asset-library/basics.md) - Explore how the asset library connects sources, categories, and dock buttons
- [Asset Library](../user-interface/ui-extensions/asset-library.md) — Customize the asset library panel to show user uploads, remote assets, or categories.
- [Blocks](./blocks.md) - Learn about design blocks that display assets
- [Resources](./resources.md) - Understand how CE.SDK loads external files



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support