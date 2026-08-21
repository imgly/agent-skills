> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Your Server](./your-server.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-media-from-remote-source-your-server/YourServer.kt reference-only
import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.editor.core.R
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.library.AssetLibrary
import ly.img.editor.core.library.AssetType
import ly.img.editor.core.library.LibraryCategory
import ly.img.editor.core.library.LibraryContent
import ly.img.editor.core.library.addSection
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.engine.Asset
import ly.img.engine.AssetContext
import ly.img.engine.AssetSource
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FetchAssetOptions
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.FindAssetsResult
import ly.img.engine.MimeType
import ly.img.engine.ShapeType

data class ServerSourceIds(
    val images: String = "my-server-images",
    val videos: String = "my-server-videos",
    val audio: String = "my-server-audio",
    val stickers: String = "my-server-stickers",
    val templates: String = "my-server-templates",
    val brandStickers: String = "my-server-brand-stickers",
) {
    val all: List<String>
        get() = listOf(images, videos, audio, stickers, templates, brandStickers)
}

data class YourServerResult(
    val sourceIds: ServerSourceIds,
    val imageResults: FindAssetsResult,
    val secondImagePage: FindAssetsResult,
    val taggedImageResults: FindAssetsResult,
    val videoResults: FindAssetsResult,
    val audioResults: FindAssetsResult,
    val stickerResults: FindAssetsResult,
    val templateResults: FindAssetsResult,
    val secondTemplatePage: FindAssetsResult,
    val fetchedTemplateAsset: Asset,
    val appliedTemplateBlock: DesignBlock?,
    val staticJsonSourceId: String,
    val staticJsonResults: FindAssetsResult,
    val assetLibraryTabs: Int,
)

data class ServerAssetPage(
    val assets: List<ServerAsset>,
    val currentPage: Int,
    val nextPage: Int,
    val total: Int,
)

interface ServerAssetBackend {
    suspend fun searchAssets(
        sourceId: String,
        query: FindAssetsQuery,
    ): ServerAssetPage

    suspend fun getAsset(
        sourceId: String,
        assetId: String,
    ): ServerAsset?

    suspend fun getGroups(sourceId: String): List<String>?
}

suspend fun yourServer(
    engine: Engine,
    assetBaseUri: Uri,
): YourServerResult {
    val sourceIds = ServerSourceIds()
    // Replace this factory with your app's API client.
    val backend: ServerAssetBackend = createAppServerBackend(sourceIds, assetBaseUri)

    registerServerAssetSources(
        engine = engine,
        sourceIds = sourceIds,
        backend = backend,
    )
    val staticJsonSourceId = loadStaticJsonAssetSource(engine)
    val imageResults = engine.asset.findAssets(
        sourceId = sourceIds.images,
        query = FindAssetsQuery(perPage = 1, page = 0),
    )
    val secondImagePage = engine.asset.findAssets(
        sourceId = sourceIds.images,
        query = FindAssetsQuery(perPage = 1, page = 1),
    )
    val taggedImageResults = engine.asset.findAssets(
        sourceId = sourceIds.images,
        query = FindAssetsQuery(perPage = 10, page = 0, tags = listOf("sunset")),
    )
    val videoResults = engine.asset.findAssets(
        sourceId = sourceIds.videos,
        query = FindAssetsQuery(perPage = 10, page = 0, query = "surf"),
    )
    val audioResults = engine.asset.findAssets(
        sourceId = sourceIds.audio,
        query = FindAssetsQuery(perPage = 10, page = 0),
    )
    val stickerResults = engine.asset.findAssets(
        sourceId = sourceIds.stickers,
        query = FindAssetsQuery(perPage = 10, page = 0),
    )
    val templateResults = engine.asset.findAssets(
        sourceId = sourceIds.templates,
        query = FindAssetsQuery(perPage = 1, page = 0),
    )
    val secondTemplatePage = engine.asset.findAssets(
        sourceId = sourceIds.templates,
        query = FindAssetsQuery(perPage = 1, page = 1),
    )
    val fetchedTemplateAsset = engine.asset.fetchAsset(
        sourceId = sourceIds.templates,
        assetId = "template-001",
    ) ?: error("Template asset not found.")
    val appliedTemplateBlock = engine.asset.applyAssetSourceAsset(
        sourceId = sourceIds.templates,
        asset = fetchedTemplateAsset,
    )
    val staticJsonResults = engine.asset.findAssets(
        sourceId = staticJsonSourceId,
        query = FindAssetsQuery(perPage = 10, page = 0),
    )
    val assetLibrary = createServerAssetLibrary(sourceIds)

    return YourServerResult(
        sourceIds = sourceIds,
        imageResults = imageResults,
        secondImagePage = secondImagePage,
        taggedImageResults = taggedImageResults,
        videoResults = videoResults,
        audioResults = audioResults,
        stickerResults = stickerResults,
        templateResults = templateResults,
        secondTemplatePage = secondTemplatePage,
        fetchedTemplateAsset = fetchedTemplateAsset,
        appliedTemplateBlock = appliedTemplateBlock,
        staticJsonSourceId = staticJsonSourceId,
        staticJsonResults = staticJsonResults,
        assetLibraryTabs = assetLibrary.tabs().size,
    )
}

private fun createAppServerBackend(
    sourceIds: ServerSourceIds,
    assetBaseUri: Uri,
): ServerAssetBackend {
    // Replace this demo backend with your app's authenticated API client.
    return DemoServerBackend(sourceIds, assetBaseUri)
}

fun registerServerAssetSources(
    engine: Engine,
    sourceIds: ServerSourceIds,
    backend: ServerAssetBackend,
) {
    sourceIds.all
        .filter(engine.asset.findAllSources()::contains)
        .forEach(engine.asset::removeSource)

    val mediaSources = listOf(
        ServerMediaAssetSource(
            sourceId = sourceIds.images,
            supportedMimeTypes = listOf(MimeType.JPEG.key, MimeType.PNG.key),
            backend = backend,
        ),
        ServerMediaAssetSource(
            sourceId = sourceIds.videos,
            supportedMimeTypes = listOf(MimeType.MP4.key),
            backend = backend,
        ),
        ServerMediaAssetSource(
            sourceId = sourceIds.audio,
            supportedMimeTypes = listOf("audio/mpeg", "audio/x-m4a"),
            backend = backend,
        ),
        ServerMediaAssetSource(
            sourceId = sourceIds.stickers,
            supportedMimeTypes = listOf(MimeType.JPEG.key, MimeType.PNG.key, MimeType.SVG.key),
            backend = backend,
        ),
    )

    mediaSources.forEach(engine.asset::addSource)
    engine.asset.addSource(
        ServerTemplateAssetSource(
            engine = engine,
            sourceId = sourceIds.templates,
            backend = backend,
        ),
    )
}

@Composable
fun rememberYourServerEditorConfiguration(assetBaseUri: Uri): EditorConfiguration {
    val sourceIds = remember { ServerSourceIds() }
    val backend = remember(sourceIds, assetBaseUri) { createAppServerBackend(sourceIds, assetBaseUri) }

    return EditorConfiguration.remember {
        onLoaded = {
            registerServerAssetSources(
                engine = editorContext.engine,
                sourceIds = sourceIds,
                backend = backend,
            )
            loadStaticJsonAssetSource(editorContext.engine)
        }
        assetLibrary = {
            createServerAssetLibrary(sourceIds)
        }
    }
}

suspend fun loadStaticJsonAssetSource(engine: Engine): String = engine.asset.addLocalSourceFromJSON(
    contentJSON = STATIC_BRAND_STICKERS_JSON,
    basePath = "https://img.ly/static/ubq_samples",
)

private class ServerMediaAssetSource(
    sourceId: String,
    override val supportedMimeTypes: List<String>,
    private val backend: ServerAssetBackend,
) : AssetSource(sourceId = sourceId) {
    override suspend fun getGroups(): List<String>? = withContext(Dispatchers.IO) {
        backend.getGroups(sourceId)
    }

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        val page = backend.searchAssets(sourceId = sourceId, query = query)
        FindAssetsResult(
            assets = page.assets.map { it.toAsset(sourceId = sourceId) },
            currentPage = page.currentPage,
            nextPage = page.nextPage,
            total = page.total,
        )
    }

    override suspend fun fetchAsset(
        id: String,
        options: FetchAssetOptions,
    ): Asset? = withContext(Dispatchers.IO) {
        backend.getAsset(sourceId = sourceId, assetId = id)?.toAsset(sourceId = sourceId)
    }
}

private class ServerTemplateAssetSource(
    private val engine: Engine,
    sourceId: String,
    private val backend: ServerAssetBackend,
) : AssetSource(sourceId = sourceId) {
    override val supportedMimeTypes: List<String> = listOf("application/ubq-template-string")

    override suspend fun getGroups(): List<String>? = withContext(Dispatchers.IO) {
        backend.getGroups(sourceId)
    }

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        val page = backend.searchAssets(sourceId = sourceId, query = query)
        FindAssetsResult(
            assets = page.assets.map { it.toAsset(sourceId = sourceId) },
            currentPage = page.currentPage,
            nextPage = page.nextPage,
            total = page.total,
        )
    }

    override suspend fun fetchAsset(
        id: String,
        options: FetchAssetOptions,
    ): Asset? = withContext(Dispatchers.IO) {
        backend.getAsset(sourceId = sourceId, assetId = id)?.toAsset(sourceId = sourceId)
    }

    override suspend fun applyAsset(asset: Asset): DesignBlock? {
        val templateUri = asset.meta?.get("uri")?.let(Uri::parse) ?: return null
        engine.scene.load(sceneUri = templateUri)
        return null
    }
}

fun createServerAssetLibrary(sourceIds: ServerSourceIds): AssetLibrary {
    val serverImageSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_section_images,
        sourceTypes = listOf(AssetSourceType(sourceId = sourceIds.images)),
        assetType = AssetType.Image,
    )
    val serverVideoSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_section_videos,
        sourceTypes = listOf(AssetSourceType(sourceId = sourceIds.videos)),
        assetType = AssetType.Video,
    )
    val serverAudioSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_section_audio,
        sourceTypes = listOf(AssetSourceType(sourceId = sourceIds.audio)),
        assetType = AssetType.Audio,
    )
    val serverStickerSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_title_stickers,
        sourceTypes = listOf(
            AssetSourceType(sourceId = sourceIds.stickers),
            AssetSourceType(sourceId = sourceIds.brandStickers),
        ),
        assetType = AssetType.Sticker,
    )

    return AssetLibrary.getDefault(
        includeAVResources = true,
        images = LibraryCategory.Images.addSection(serverImageSection),
        videos = LibraryCategory.Video.addSection(serverVideoSection),
        audios = LibraryCategory.Audio.addSection(serverAudioSection),
        stickers = LibraryCategory.Stickers.addSection(serverStickerSection),
    )
}

data class ServerAsset(
    val id: String,
    val label: String,
    val uri: String,
    val thumbUri: String,
    val mimeType: String,
    val blockType: DesignBlockType,
    val fillType: FillType? = null,
    val shapeType: ShapeType? = null,
    val kind: String? = null,
    val width: Int? = null,
    val height: Int? = null,
    val duration: Double? = null,
    val tags: List<String> = emptyList(),
    val groups: List<String> = emptyList(),
) {
    fun toAsset(sourceId: String) = Asset(
        id = id,
        context = AssetContext(sourceId = sourceId),
        label = label,
        locale = "en",
        tags = tags,
        groups = groups,
        meta = buildMap {
            put("uri", uri)
            put("thumbUri", thumbUri)
            put("mimeType", mimeType)
            put("blockType", blockType.key)
            fillType?.let { put("fillType", it.key) }
            shapeType?.let { put("shapeType", it.key) }
            kind?.let { put("kind", it) }
            width?.let { put("width", it.toString()) }
            height?.let { put("height", it.toString()) }
            duration?.let { put("duration", it.toString()) }
        },
    )
}

private fun createServerAssets(
    sourceIds: ServerSourceIds,
    assetBaseUri: Uri,
): Map<String, List<ServerAsset>> = mapOf(
    sourceIds.images to imageServerAssets(),
    sourceIds.videos to videoServerAssets(),
    sourceIds.audio to audioServerAssets(assetBaseUri),
    sourceIds.stickers to stickerServerAssets(),
    sourceIds.templates to templateServerAssets(assetBaseUri),
)

private fun imageServerAssets(): List<ServerAsset> = listOf(
    ServerAsset(
        id = "img-001",
        label = "Mountain Landscape",
        uri = "https://img.ly/static/ubq_samples/sample_1.jpg",
        thumbUri = "https://img.ly/static/ubq_samples/sample_1.jpg",
        mimeType = MimeType.JPEG.key,
        blockType = DesignBlockType.Graphic,
        fillType = FillType.Image,
        shapeType = ShapeType.Rect,
        kind = "image",
        width = 1920,
        height = 1280,
        tags = listOf("mountain", "landscape"),
        groups = listOf("photos"),
    ),
    ServerAsset(
        id = "img-002",
        label = "Ocean Sunset",
        uri = "https://img.ly/static/ubq_samples/sample_2.jpg",
        thumbUri = "https://img.ly/static/ubq_samples/sample_2.jpg",
        mimeType = MimeType.JPEG.key,
        blockType = DesignBlockType.Graphic,
        fillType = FillType.Image,
        shapeType = ShapeType.Rect,
        kind = "image",
        width = 1920,
        height = 1280,
        tags = listOf("ocean", "sunset"),
        groups = listOf("photos"),
    ),
)

private fun videoServerAssets(): List<ServerAsset> = listOf(
    ServerAsset(
        id = "vid-001",
        label = "Surf Promo",
        uri = "https://img.ly/static/ubq_video_samples/bbb.mp4",
        thumbUri = "https://img.ly/static/ubq_samples/sample_1.jpg",
        mimeType = MimeType.MP4.key,
        blockType = DesignBlockType.Graphic,
        fillType = FillType.Video,
        shapeType = ShapeType.Rect,
        kind = "video",
        width = 640,
        height = 360,
        duration = 634.694,
        tags = listOf("surf", "promo"),
        groups = listOf("videos"),
    ),
)

private fun audioServerAssets(assetBaseUri: Uri): List<ServerAsset> = listOf(
    ServerAsset(
        id = "audio-001",
        label = "Background Track",
        uri = assetBaseUri
            .buildUpon()
            .appendPath("ly.img.audio")
            .appendPath("audios")
            .appendPath("far_from_home.m4a")
            .build()
            .toString(),
        thumbUri = "https://img.ly/static/ubq_samples/sample_2.jpg",
        mimeType = "audio/x-m4a",
        blockType = DesignBlockType.Audio,
        duration = 98.716,
        tags = listOf("music", "background"),
        groups = listOf("audio"),
    ),
)

private fun stickerServerAssets(): List<ServerAsset> = listOf(
    ServerAsset(
        id = "sticker-001",
        label = "Camera Badge",
        uri = "https://img.ly/static/ubq_samples/imgly_logo.jpg",
        thumbUri = "https://img.ly/static/ubq_samples/imgly_logo.jpg",
        mimeType = MimeType.JPEG.key,
        blockType = DesignBlockType.Graphic,
        fillType = FillType.Image,
        shapeType = ShapeType.Rect,
        kind = "sticker",
        width = 1980,
        height = 720,
        tags = listOf("camera", "badge"),
        groups = listOf("stickers"),
    ),
)

private fun templateServerAssets(assetBaseUri: Uri): List<ServerAsset> = listOf(
    ServerAsset(
        id = "template-001",
        label = "Launch Story",
        uri = assetBaseUri
            .buildUpon()
            .appendPath("ly.img.templates")
            .appendPath("templates")
            .appendPath("cesdk_postcard_1.scene")
            .build()
            .toString(),
        thumbUri = assetBaseUri
            .buildUpon()
            .appendPath("ly.img.templates")
            .appendPath("thumbnails")
            .appendPath("cesdk_postcard_1.jpg")
            .build()
            .toString(),
        mimeType = "application/ubq-template-string",
        blockType = DesignBlockType.Scene,
        kind = "scene",
        tags = listOf("launch", "story"),
        groups = listOf("templates"),
    ),
    ServerAsset(
        id = "template-002",
        label = "Product Promo",
        uri = assetBaseUri
            .buildUpon()
            .appendPath("ly.img.templates")
            .appendPath("templates")
            .appendPath("cesdk_postcard_2.scene")
            .build()
            .toString(),
        thumbUri = assetBaseUri
            .buildUpon()
            .appendPath("ly.img.templates")
            .appendPath("thumbnails")
            .appendPath("cesdk_postcard_2.jpg")
            .build()
            .toString(),
        mimeType = "application/ubq-template-string",
        blockType = DesignBlockType.Scene,
        kind = "scene",
        tags = listOf("product", "promo"),
        groups = listOf("templates"),
    ),
)

private class DemoServerBackend(
    sourceIds: ServerSourceIds,
    assetBaseUri: Uri,
) : ServerAssetBackend {
    private val assetsBySource = createServerAssets(sourceIds, assetBaseUri)

    override suspend fun searchAssets(
        sourceId: String,
        query: FindAssetsQuery,
    ): ServerAssetPage {
        val searchWords = query.query
            ?.split(" ")
            ?.map(String::trim)
            ?.filter(String::isNotEmpty)
            .orEmpty()
        val requestedTags = query.tags.orEmpty()
        val requestedGroups = query.groups.orEmpty()

        val matchingAssets = assetsBySource.getValue(sourceId)
            .filter { asset ->
                val matchesQuery =
                    searchWords.isEmpty() ||
                        searchWords.all { word ->
                            asset.label.contains(word, ignoreCase = true) ||
                                asset.tags.any { it.contains(word, ignoreCase = true) }
                        }
                val matchesGroups =
                    requestedGroups.isEmpty() ||
                        asset.groups.any(requestedGroups::contains)
                val matchesTags =
                    requestedTags.isEmpty() ||
                        requestedTags.all(asset.tags::contains)

                matchesQuery && matchesGroups && matchesTags
            }
        val startIndex = query.page * query.perPage
        val pageAssets = matchingAssets.drop(startIndex).take(query.perPage)
        val nextPage = if (startIndex + pageAssets.size < matchingAssets.size) query.page + 1 else -1

        return ServerAssetPage(
            assets = pageAssets,
            currentPage = query.page,
            nextPage = nextPage,
            total = matchingAssets.size,
        )
    }

    override suspend fun getAsset(
        sourceId: String,
        assetId: String,
    ): ServerAsset? = assetsBySource[sourceId]?.firstOrNull { it.id == assetId }

    override suspend fun getGroups(sourceId: String): List<String>? = assetsBySource[sourceId]
        ?.flatMap(ServerAsset::groups)
        ?.distinct()
}

private val STATIC_BRAND_STICKERS_JSON = """
{
  "version": "1.0.0",
  "id": "my-server-brand-stickers",
  "assets": [
    {
      "id": "brand-badge",
      "label": { "en": "Brand Badge" },
      "tags": { "en": ["brand", "badge"] },
      "groups": ["stickers"],
      "meta": {
        "uri": "{{base_url}}/imgly_logo.jpg",
        "thumbUri": "{{base_url}}/imgly_logo.jpg",
        "mimeType": "${MimeType.JPEG.key}",
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
        "shapeType": "//ly.img.ubq/shape/rect",
        "kind": "sticker",
        "width": 1980,
        "height": 720
      }
    }
  ]
}
"""
```

Load media from your backend into CE.SDK by exposing your catalog as Android
asset sources.

> **Reading time:** 9 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-import-media-from-remote-source-your-server)

<EngineReferenceNote {...props} />

CE.SDK uses asset sources to discover media and apply selected assets to a scene. Use a custom `AssetSource` for dynamic server-backed libraries such as user uploads, DAM entries, or CMS media. Use JSON asset sources for static catalogs that you can publish as manifest files next to their thumbnails and original assets.

This guide shows both patterns and the Android editor configuration handoff that makes media sources visible in the asset library UI. Template sources use a custom `applyAsset()` path because they load scenes rather than media blocks.

## Understanding Asset Source Types

CE.SDK supports two practical patterns for loading server assets.

**Custom asset sources** work best for dynamic content. Your Android source receives a `FindAssetsQuery`, forwards search, pagination, tags, and groups to your backend client, and returns a `FindAssetsResult`.

**JSON asset sources** work best for static content. Host a `content.json` manifest on your CDN or app server, then load it with `engine.asset.addLocalSourceFromJSON(...)`. URLs in the manifest can use `{{base_url}}` so the same file works after moving the asset folder.

## Creating a Custom Asset Source

Create an `AssetSource` subclass for each server catalog you want CE.SDK to query. The source ID must stay stable because the Engine API and editor library UI both refer to sources by ID.

```kotlin highlight-android-backend-setup
data class ServerSourceIds(
    val images: String = "my-server-images",
    val videos: String = "my-server-videos",
    val audio: String = "my-server-audio",
    val stickers: String = "my-server-stickers",
    val templates: String = "my-server-templates",
    val brandStickers: String = "my-server-brand-stickers",
) {
    val all: List<String>
        get() = listOf(images, videos, audio, stickers, templates, brandStickers)
}
```

Define the backend contract your app implements. The guide sample uses a local implementation of this contract, but production code should return your API client from the setup function.

```kotlin highlight-android-backend-contract
data class ServerAssetPage(
    val assets: List<ServerAsset>,
    val currentPage: Int,
    val nextPage: Int,
    val total: Int,
)

interface ServerAssetBackend {
    suspend fun searchAssets(
        sourceId: String,
        query: FindAssetsQuery,
    ): ServerAssetPage

    suspend fun getAsset(
        sourceId: String,
        assetId: String,
    ): ServerAsset?

    suspend fun getGroups(sourceId: String): List<String>?
}
```

Return your app-owned backend client from the setup function. The sample factory returns a local demo backend so the guide can run without a network service.

The runnable sample passes its configured SDK asset base URI to that demo backend so bundled media stays version-aligned. A production backend should return URLs from your own service instead.

```kotlin highlight-android-backend-client
private fun createAppServerBackend(
    sourceIds: ServerSourceIds,
    assetBaseUri: Uri,
): ServerAssetBackend {
    // Replace this demo backend with your app's authenticated API client.
    return DemoServerBackend(sourceIds, assetBaseUri)
}
```

```kotlin highlight-android-create-backend
val sourceIds = ServerSourceIds()
// Replace this factory with your app's API client.
val backend: ServerAssetBackend = createAppServerBackend(sourceIds, assetBaseUri)
```

```kotlin highlight-android-dynamic-source
private class ServerMediaAssetSource(
    sourceId: String,
    override val supportedMimeTypes: List<String>,
    private val backend: ServerAssetBackend,
) : AssetSource(sourceId = sourceId) {
    override suspend fun getGroups(): List<String>? = withContext(Dispatchers.IO) {
        backend.getGroups(sourceId)
    }

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        val page = backend.searchAssets(sourceId = sourceId, query = query)
        FindAssetsResult(
            assets = page.assets.map { it.toAsset(sourceId = sourceId) },
            currentPage = page.currentPage,
            nextPage = page.nextPage,
            total = page.total,
        )
    }

    override suspend fun fetchAsset(
        id: String,
        options: FetchAssetOptions,
    ): Asset? = withContext(Dispatchers.IO) {
        backend.getAsset(sourceId = sourceId, assetId = id)?.toAsset(sourceId = sourceId)
    }
}
```

`findAssets()` runs asynchronously, so forward the query to your app's backend client from an IO dispatcher. Return `nextPage = -1` when there are no more results.

Register the sources before your code or UI queries them:

```kotlin highlight-android-register-sources
fun registerServerAssetSources(
    engine: Engine,
    sourceIds: ServerSourceIds,
    backend: ServerAssetBackend,
) {
    sourceIds.all
        .filter(engine.asset.findAllSources()::contains)
        .forEach(engine.asset::removeSource)

    val mediaSources = listOf(
        ServerMediaAssetSource(
            sourceId = sourceIds.images,
            supportedMimeTypes = listOf(MimeType.JPEG.key, MimeType.PNG.key),
            backend = backend,
        ),
        ServerMediaAssetSource(
            sourceId = sourceIds.videos,
            supportedMimeTypes = listOf(MimeType.MP4.key),
            backend = backend,
        ),
        ServerMediaAssetSource(
            sourceId = sourceIds.audio,
            supportedMimeTypes = listOf("audio/mpeg", "audio/x-m4a"),
            backend = backend,
        ),
        ServerMediaAssetSource(
            sourceId = sourceIds.stickers,
            supportedMimeTypes = listOf(MimeType.JPEG.key, MimeType.PNG.key, MimeType.SVG.key),
            backend = backend,
        ),
    )

    mediaSources.forEach(engine.asset::addSource)
    engine.asset.addSource(
        ServerTemplateAssetSource(
            engine = engine,
            sourceId = sourceIds.templates,
            backend = backend,
        ),
    )
}
```

The sample registers separate sources for images, videos, audio, stickers, and templates. Media sources can be placed in editor library sections, while template sources are applied through the custom template asset source.

## Serving Different Media Types

Each returned `Asset` needs enough metadata for CE.SDK to create the right block when the asset is applied. Use Android's typed keys for block, fill, and shape types, then store their `.key` values in `meta`.

```kotlin highlight-android-media-metadata
data class ServerAsset(
    val id: String,
    val label: String,
    val uri: String,
    val thumbUri: String,
    val mimeType: String,
    val blockType: DesignBlockType,
    val fillType: FillType? = null,
    val shapeType: ShapeType? = null,
    val kind: String? = null,
    val width: Int? = null,
    val height: Int? = null,
    val duration: Double? = null,
    val tags: List<String> = emptyList(),
    val groups: List<String> = emptyList(),
) {
    fun toAsset(sourceId: String) = Asset(
        id = id,
        context = AssetContext(sourceId = sourceId),
        label = label,
        locale = "en",
        tags = tags,
        groups = groups,
        meta = buildMap {
            put("uri", uri)
            put("thumbUri", thumbUri)
            put("mimeType", mimeType)
            put("blockType", blockType.key)
            fillType?.let { put("fillType", it.key) }
            shapeType?.let { put("shapeType", it.key) }
            kind?.let { put("kind", it) }
            width?.let { put("width", it.toString()) }
            height?.let { put("height", it.toString()) }
            duration?.let { put("duration", it.toString()) }
        },
    )
}
```

### Image Assets

Images use a graphic block with an image fill. Include `width`, `height`, `mimeType`, `blockType`, `fillType`, and `shapeType` so CE.SDK does not need to infer the asset type from the remote file.

```kotlin highlight-android-image-metadata
ServerAsset(
    id = "img-001",
    label = "Mountain Landscape",
    uri = "https://img.ly/static/ubq_samples/sample_1.jpg",
    thumbUri = "https://img.ly/static/ubq_samples/sample_1.jpg",
    mimeType = MimeType.JPEG.key,
    blockType = DesignBlockType.Graphic,
    fillType = FillType.Image,
    shapeType = ShapeType.Rect,
    kind = "image",
    width = 1920,
    height = 1280,
    tags = listOf("mountain", "landscape"),
    groups = listOf("photos"),
),
```

### Video Assets

Videos also use a graphic block, but with `FillType.Video`. Include `duration` when your backend already knows it so the asset library and timeline can show accurate timing without loading the full video first.

```kotlin highlight-android-video-metadata
ServerAsset(
    id = "vid-001",
    label = "Surf Promo",
    uri = "https://img.ly/static/ubq_video_samples/bbb.mp4",
    thumbUri = "https://img.ly/static/ubq_samples/sample_1.jpg",
    mimeType = MimeType.MP4.key,
    blockType = DesignBlockType.Graphic,
    fillType = FillType.Video,
    shapeType = ShapeType.Rect,
    kind = "video",
    width = 640,
    height = 360,
    duration = 634.694,
    tags = listOf("surf", "promo"),
    groups = listOf("videos"),
),
```

### Audio Assets

Audio assets use `DesignBlockType.Audio`. Include `mimeType` and `duration`; audio sources do not need image fill or shape metadata.

```kotlin highlight-android-audio-metadata
ServerAsset(
    id = "audio-001",
    label = "Background Track",
    uri = assetBaseUri
        .buildUpon()
        .appendPath("ly.img.audio")
        .appendPath("audios")
        .appendPath("far_from_home.m4a")
        .build()
        .toString(),
    thumbUri = "https://img.ly/static/ubq_samples/sample_2.jpg",
    mimeType = "audio/x-m4a",
    blockType = DesignBlockType.Audio,
    duration = 98.716,
    tags = listOf("music", "background"),
    groups = listOf("audio"),
),
```

### Sticker Assets

Stickers are image assets with `kind = "sticker"`. They still use a graphic block with an image fill, but the `kind` value lets editor UI treat them as stickers rather than regular images.

```kotlin highlight-android-sticker-metadata
ServerAsset(
    id = "sticker-001",
    label = "Camera Badge",
    uri = "https://img.ly/static/ubq_samples/imgly_logo.jpg",
    thumbUri = "https://img.ly/static/ubq_samples/imgly_logo.jpg",
    mimeType = MimeType.JPEG.key,
    blockType = DesignBlockType.Graphic,
    fillType = FillType.Image,
    shapeType = ShapeType.Rect,
    kind = "sticker",
    width = 1980,
    height = 720,
    tags = listOf("camera", "badge"),
    groups = listOf("stickers"),
),
```

### Template Assets

Templates replace the current scene instead of adding a media block. Provide a custom `applyAsset()` implementation that loads the `.scene` URL from your asset metadata.

```kotlin highlight-android-template-metadata
ServerAsset(
    id = "template-001",
    label = "Launch Story",
    uri = assetBaseUri
        .buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("templates")
        .appendPath("cesdk_postcard_1.scene")
        .build()
        .toString(),
    thumbUri = assetBaseUri
        .buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("thumbnails")
        .appendPath("cesdk_postcard_1.jpg")
        .build()
        .toString(),
    mimeType = "application/ubq-template-string",
    blockType = DesignBlockType.Scene,
    kind = "scene",
    tags = listOf("launch", "story"),
    groups = listOf("templates"),
),
```

```kotlin highlight-android-template-source
private class ServerTemplateAssetSource(
    private val engine: Engine,
    sourceId: String,
    private val backend: ServerAssetBackend,
) : AssetSource(sourceId = sourceId) {
    override val supportedMimeTypes: List<String> = listOf("application/ubq-template-string")

    override suspend fun getGroups(): List<String>? = withContext(Dispatchers.IO) {
        backend.getGroups(sourceId)
    }

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        val page = backend.searchAssets(sourceId = sourceId, query = query)
        FindAssetsResult(
            assets = page.assets.map { it.toAsset(sourceId = sourceId) },
            currentPage = page.currentPage,
            nextPage = page.nextPage,
            total = page.total,
        )
    }

    override suspend fun fetchAsset(
        id: String,
        options: FetchAssetOptions,
    ): Asset? = withContext(Dispatchers.IO) {
        backend.getAsset(sourceId = sourceId, assetId = id)?.toAsset(sourceId = sourceId)
    }

    override suspend fun applyAsset(asset: Asset): DesignBlock? {
        val templateUri = asset.meta?.get("uri")?.let(Uri::parse) ?: return null
        engine.scene.load(sceneUri = templateUri)
        return null
    }
}
```

Use `engine.scene.load(sceneUri = _)` for both scene files and archives; the engine detects the content automatically.

## Loading Assets from JSON

For static catalogs, publish a JSON manifest with `id`, `version`, and `assets` fields. The Android API can load a manifest from a JSON string or directly from a hosted URI.

```kotlin highlight-android-json-source
suspend fun loadStaticJsonAssetSource(engine: Engine): String = engine.asset.addLocalSourceFromJSON(
    contentJSON = STATIC_BRAND_STICKERS_JSON,
    basePath = "https://img.ly/static/ubq_samples",
)
```

The `contentJSON` overload is useful for bundled or generated manifests. Use `engine.asset.addLocalSourceFromJSON(contentUri = _)` when your CDN serves `content.json` next to the assets.

## Displaying Assets in the UI

After the Engine knows about your media sources, reference their IDs from the Android asset library configuration. The editor library uses `AssetSourceType(sourceId = _)` inside `LibraryContent.Section` entries for images, videos, audio, and stickers. The sticker section can combine your dynamic sticker source with the static JSON catalog loaded from your backend.

```kotlin highlight-android-editor-library
fun createServerAssetLibrary(sourceIds: ServerSourceIds): AssetLibrary {
    val serverImageSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_section_images,
        sourceTypes = listOf(AssetSourceType(sourceId = sourceIds.images)),
        assetType = AssetType.Image,
    )
    val serverVideoSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_section_videos,
        sourceTypes = listOf(AssetSourceType(sourceId = sourceIds.videos)),
        assetType = AssetType.Video,
    )
    val serverAudioSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_section_audio,
        sourceTypes = listOf(AssetSourceType(sourceId = sourceIds.audio)),
        assetType = AssetType.Audio,
    )
    val serverStickerSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_title_stickers,
        sourceTypes = listOf(
            AssetSourceType(sourceId = sourceIds.stickers),
            AssetSourceType(sourceId = sourceIds.brandStickers),
        ),
        assetType = AssetType.Sticker,
    )

    return AssetLibrary.getDefault(
        includeAVResources = true,
        images = LibraryCategory.Images.addSection(serverImageSection),
        videos = LibraryCategory.Video.addSection(serverVideoSection),
        audios = LibraryCategory.Audio.addSection(serverAudioSection),
        stickers = LibraryCategory.Stickers.addSection(serverStickerSection),
    )
}
```

Assign the returned `AssetLibrary` to `EditorConfiguration.assetLibrary` in the Base Editor configuration. Register the server sources and load the static JSON catalog in `onLoaded` so the default scene creation path still runs before the library opens.

```kotlin highlight-android-editor-configuration
@Composable
fun rememberYourServerEditorConfiguration(assetBaseUri: Uri): EditorConfiguration {
    val sourceIds = remember { ServerSourceIds() }
    val backend = remember(sourceIds, assetBaseUri) { createAppServerBackend(sourceIds, assetBaseUri) }

    return EditorConfiguration.remember {
        onLoaded = {
            registerServerAssetSources(
                engine = editorContext.engine,
                sourceIds = sourceIds,
                backend = backend,
            )
            loadStaticJsonAssetSource(editorContext.engine)
        }
        assetLibrary = {
            createServerAssetLibrary(sourceIds)
        }
    }
}
```

Keep templates on the custom `AssetSource.applyAsset()` path shown above unless your app adds its own template browser. If you need a complete editor surface around this configuration, start from the [Design Editor Starter Kit](../../starterkits/design-editor.md) and add this configuration to your editor setup.

## Server Architecture Considerations

Backend configuration determines how reliable your asset source feels in production.

- **Network access and CORS**: Android loads asset, thumbnail, and manifest URLs through native networking, so browser CORS headers do not control Android requests. Use reachable HTTPS URLs, valid authentication or signed URLs, and app network security settings that allow your backend. Configure CORS only for web editors that reuse the same backend.
- **Authentication**: Send tokens from your backend client inside `findAssets()`, or return short-lived signed URLs in `meta.uri` and `meta.thumbUri`.
- **Thumbnails**: Generate thumbnails server-side and return them through `thumbUri`. Keep thumbnails smaller than the original asset to make library grids responsive.
- **Pagination**: Return stable totals and a `nextPage` value only while more results exist. Android uses `-1` to mark the end of the result set.
- **Caching**: Use long cache lifetimes for immutable thumbnails and shorter lifetimes for dynamic search responses.

## Troubleshooting

**Assets do not appear**: Confirm that the source is registered before you query it and that `findAssets()` returns a non-empty `assets` list with `currentPage`, `nextPage`, and `total`.

**Search returns the same results**: Forward `FindAssetsQuery.query`, `tags`, `groups`, `page`, and `perPage` to your backend instead of ignoring the query object.

**Media applies as the wrong type**: Check `meta.blockType`, `meta.fillType`, `meta.shapeType`, and `meta.mimeType`. Missing metadata forces CE.SDK to infer the type from the remote resource.

**Static JSON URLs resolve incorrectly**: Use `{{base_url}}` in the manifest and pass either the hosted manifest URI or an explicit `basePath` when loading JSON from a string.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.asset.findAllSources()` | List currently registered source IDs before replacing guide-owned sources |
| `engine.asset.removeSource(sourceId=_)` | Remove an existing source by ID before registering an updated source |
| `engine.asset.addSource(source=_)` | Register a custom Android asset source |
| `AssetSource.getGroups()` | Return the groups available for filtering in a custom source |
| `AssetSource.findAssets(query=_)` | Return paginated assets for the current search query |
| `AssetSource.fetchAsset(id=_, options=_)` | Resolve a single asset by ID when direct fetching is needed |
| `AssetSource.applyAsset(asset=_)` | Override how a selected asset is applied, such as loading a template scene |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query an asset source programmatically |
| `Asset(id=_, context=_, label=_, locale=_, tags=_, groups=_, meta=_)` | Build an asset result with metadata returned from your backend |
| `AssetContext(sourceId=_)` | Associate an asset result with the source that returned it |
| `FindAssetsResult(assets=_, currentPage=_, nextPage=_, total=_)` | Return a paginated result from `findAssets()` |
| `engine.asset.addLocalSourceFromJSON(contentJSON=_, basePath=_, matcher=_)` | Load a static source from a JSON string |
| `engine.asset.addLocalSourceFromJSON(contentUri=_, matcher=_)` | Load a hosted `content.json` manifest |
| `engine.scene.load(sceneUri=_, overrideEditorConfig=_, waitForResources=_)` | Load a scene or archive template asset (content detected automatically) |
| `EditorConfiguration.remember(builder=_)` | Create a Base Editor configuration that registers sources and supplies the asset library |
| `EditorConfigurationBuilder.onLoaded` | Register server sources after the default scene has loaded |
| `EditorConfigurationBuilder.assetLibrary` | Assign the editor asset library built from server source IDs |
| `AssetLibrary.getDefault(includeAVResources=_, images=_, videos=_, audios=_, stickers=_)` | Build an Android editor asset library from source-backed categories |
| `LibraryContent.Section(titleRes=_, sourceTypes=_, assetType=_)` | Create a library section that points at one or more asset sources |
| `AssetSourceType(sourceId=_)` | Reference a registered source from an Android editor library section |
| `LibraryCategory.addSection(section=_)` | Add a server-backed section to an existing library category |

| Metadata Property | Purpose |
| --- | --- |
| `meta.uri` | Full media, scene, or archive URL used when the asset is applied |
| `meta.thumbUri` | Thumbnail shown in the asset library |
| `meta.mimeType` | MIME type used for filtering, previews, and type inference |
| `meta.blockType` | Block type to create, such as `DesignBlockType.Graphic.key` |
| `meta.fillType` | Fill type for graphic media, such as `FillType.Image.key` or `FillType.Video.key` |
| `meta.shapeType` | Shape for graphic assets, commonly `ShapeType.Rect.key` |
| `meta.kind` | Asset kind, such as `image`, `video`, `sticker`, or `scene` |
| `meta.duration` | Duration for audio and video assets |
| `meta.width` / `meta.height` | Intrinsic media dimensions for layout and aspect ratio handling |

## Next Steps

- [From User Upload](../from-local-source/user-upload.md) - Enable file picker uploads from end users for use in the editor.
- [Asset Concepts](../concepts.md) - Asset sources and metadata architecture
- [Thumbnails](../asset-library/thumbnails.md) - Configure thumbnail images for assets in CE.SDK's asset library with proper sizing, preview URIs for audio, and customized UI display.
- [Customize Asset Library](../asset-library/customize.md) - UI customization options



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support