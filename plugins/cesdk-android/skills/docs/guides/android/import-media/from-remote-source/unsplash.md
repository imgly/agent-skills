> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Unsplash](./unsplash.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-custom-asset-source/UnsplashAssetSource.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.editor.core.R
import ly.img.editor.core.library.AssetLibrary
import ly.img.editor.core.library.AssetType
import ly.img.editor.core.library.LibraryCategory
import ly.img.editor.core.library.LibraryContent
import ly.img.editor.core.library.addSection
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.engine.Asset
import ly.img.engine.AssetContext
import ly.img.engine.AssetCredits
import ly.img.engine.AssetDefinition
import ly.img.engine.AssetLicense
import ly.img.engine.AssetSource
import ly.img.engine.AssetUTM
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.FindAssetsResult
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

data class CustomAssetSourceSummary(
    val sourceRegistered: Boolean,
    val sourceCreditsName: String?,
    val sourceLicenseName: String?,
    val localAssetCount: Int,
    val localAssetId: String?,
    val queriedRemoteSource: Boolean,
    val appliedRemoteAsset: Boolean,
)

suspend fun customAssetSource(
    engine: Engine,
    unsplashBaseUrl: String,
    utmSource: String,
    unsplashAssetSource: UnsplashAssetSource? = null,
): CustomAssetSourceSummary {
    runCatching { engine.asset.removeSource(UnsplashAssetSource.SOURCE_ID) }
    runCatching { engine.asset.removeSource(LOCAL_SOURCE_ID) }

    val source = unsplashAssetSource ?: UnsplashAssetSource(
        engine = engine,
        baseUrl = unsplashBaseUrl,
        utmSource = utmSource,
    )
    engine.asset.addSource(source)

    val queriedRemoteSource = unsplashBaseUrl.isNotBlank()
    var appliedRemoteAsset = false

    if (unsplashBaseUrl.isNotBlank()) {
        val popularResults = engine.asset.findAssets(
            sourceId = source.sourceId,
            query = FindAssetsQuery(query = "", page = 0, perPage = 10),
        )
        val searchResults = engine.asset.findAssets(
            sourceId = source.sourceId,
            query = FindAssetsQuery(query = "landscape", page = 0, perPage = 10),
        )

        val assetToApply = searchResults.assets.firstOrNull() ?: popularResults.assets.firstOrNull()
        if (assetToApply != null) {
            appliedRemoteAsset = engine.asset.applyAssetSourceAsset(
                sourceId = source.sourceId,
                asset = assetToApply,
            ) != null
        }
    }

    engine.asset.addLocalSource(
        sourceId = LOCAL_SOURCE_ID,
        supportedMimeTypes = listOf(MimeType.JPEG.key),
    )

    val localAsset = AssetDefinition(
        id = "sample-landscape",
        label = mapOf("en" to "Sample Landscape"),
        tags = mapOf("en" to listOf("landscape", "sample")),
        meta = mapOf(
            "uri" to "https://img.ly/static/ubq_samples/sample_1.jpg",
            "thumbUri" to "https://img.ly/static/ubq_samples/sample_1.jpg",
            "mimeType" to MimeType.JPEG.key,
            "blockType" to DesignBlockType.Graphic.key,
            "fillType" to FillType.Image.key,
            "shapeType" to ShapeType.Rect.key,
            "kind" to "image",
            "width" to "1080",
            "height" to "1080",
        ),
    )
    engine.asset.addAsset(sourceId = LOCAL_SOURCE_ID, asset = localAsset)
    engine.asset.assetSourceContentsChanged(sourceId = LOCAL_SOURCE_ID)

    val localResults = engine.asset.findAssets(
        sourceId = LOCAL_SOURCE_ID,
        query = FindAssetsQuery(query = "landscape", page = 0, perPage = 10),
    )

    return CustomAssetSourceSummary(
        sourceRegistered = source.sourceId in engine.asset.findAllSources(),
        sourceCreditsName = engine.asset.getCredits(source.sourceId)?.name,
        sourceLicenseName = engine.asset.getLicense(source.sourceId)?.name,
        localAssetCount = localResults.assets.size,
        localAssetId = localResults.assets.firstOrNull()?.id,
        queriedRemoteSource = queriedRemoteSource,
        appliedRemoteAsset = appliedRemoteAsset,
    )
}

open class UnsplashAssetSource(
    private val engine: Engine,
    private val baseUrl: String,
    private val utmSource: String,
) : AssetSource(sourceId = "ly.img.asset.source.unsplash") {
    companion object {
        const val SOURCE_ID = "ly.img.asset.source.unsplash"
    }

    override val supportedMimeTypes = listOf(MimeType.JPEG.key)

    override suspend fun getGroups(): List<String>? = null

    override val credits = AssetCredits(
        name = "Unsplash",
        uri = Uri.parse("https://unsplash.com/"),
    )

    override val license = AssetLicense(
        name = "Unsplash license (free)",
        uri = Uri.parse("https://unsplash.com/license"),
    )

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        if (query.query.isNullOrBlank()) {
            query.getPopularList()
        } else {
            query.getSearchList()
        }
    }

    private suspend fun FindAssetsQuery.getPopularList(): FindAssetsResult {
        val requestUrl = "$baseUrl/photos?order_by=popular&page=${page + 1}&per_page=$perPage"
        val assetsArray = getResponseAsString(requestUrl).let(::JSONArray)
        val assets = mutableListOf<Asset>()
        for (index in 0 until assetsArray.length()) {
            assets += assetsArray.getJSONObject(index).toAsset()
        }
        return FindAssetsResult(
            assets = assets,
            currentPage = page,
            nextPage = if (assets.isEmpty()) -1 else page + 1,
            total = Int.MAX_VALUE,
        )
    }

    private suspend fun FindAssetsQuery.getSearchList(): FindAssetsResult {
        val encodedQuery = URLEncoder.encode(query.orEmpty(), Charsets.UTF_8.name())
        val requestUrl = "$baseUrl/search/photos?query=$encodedQuery&page=${page + 1}&per_page=$perPage"
        val response = getResponseAsString(requestUrl).let(::JSONObject)
        val assetsArray = response.getJSONArray("results")
        val assets = mutableListOf<Asset>()
        for (index in 0 until assetsArray.length()) {
            assets += assetsArray.getJSONObject(index).toAsset()
        }

        val total = response.getInt("total")
        val totalPages = response.getInt("total_pages")
        return FindAssetsResult(
            assets = assets,
            currentPage = page,
            nextPage = if (page + 1 >= totalPages) -1 else page + 1,
            total = total,
        )
    }

    override suspend fun applyAsset(asset: Asset): DesignBlock? {
        trackDownloadEvent(asset)
        return engine.asset.defaultApplyAsset(asset)
    }

    override suspend fun applyAsset(
        asset: Asset,
        block: DesignBlock,
    ) {
        trackDownloadEvent(asset)
        engine.asset.defaultApplyAsset(asset, block)
    }

    private suspend fun trackDownloadEvent(asset: Asset) {
        val downloadLocation = asset.meta
            ?.get("downloadLocation")
            ?.takeIf { it.isNotBlank() }
            ?: return

        getResponseAsString(proxiedApiUrl(downloadLocation))
    }

    private suspend fun JSONObject.toAsset() = Asset(
        id = getString("id"),
        locale = "en",
        label = listOf(
            optString("description"),
            optString("alt_description"),
        ).firstOrNull { it.isNotBlank() },
        tags = optJSONArray("tags")
            ?.let { array ->
                (0 until array.length()).mapNotNull { index ->
                    array.optJSONObject(index)?.optString("title")?.takeIf { it.isNotBlank() }
                }
            }
            ?.takeIf { it.isNotEmpty() },
        meta = mapOf(
            "uri" to getJSONObject("urls").getString("regular"),
            "thumbUri" to getJSONObject("urls").getString("thumb"),
            "downloadLocation" to optJSONObject("links")
                ?.optString("download_location")
                .orEmpty(),
            "blockType" to DesignBlockType.Graphic.key,
            "fillType" to FillType.Image.key,
            "shapeType" to ShapeType.Rect.key,
            "kind" to "image",
            "width" to getInt("width").toString(),
            "height" to getInt("height").toString(),
        ),
        context = AssetContext(sourceId = sourceId),
        credits = AssetCredits(
            name = optJSONObject("user")?.optString("name")?.takeIf { it.isNotBlank() } ?: "Unknown photographer",
            uri = optJSONObject("user")
                ?.optJSONObject("links")
                ?.optString("html")
                ?.takeIf { it.isNotBlank() }
                ?.let(Uri::parse),
        ),
        utm = AssetUTM(source = utmSource, medium = "referral"),
    )

    protected open suspend fun getResponseAsString(url: String) = withContext(Dispatchers.IO) {
        val connection = URL(url).openConnection() as HttpURLConnection
        require(connection.responseCode in 200 until 300) {
            connection.errorStream.bufferedReader().use { it.readText() }
        }
        connection.inputStream.bufferedReader().use { it.readText() }
    }

    private fun proxiedApiUrl(url: String): String {
        val parsedUrl = Uri.parse(url)
        if (parsedUrl.scheme == null) {
            val separator = if (url.startsWith("/")) "" else "/"
            return "$baseUrl$separator$url"
        }
        require(parsedUrl.host == "api.unsplash.com") {
            "Expected an Unsplash API URL but received ${parsedUrl.host}"
        }

        val path = parsedUrl.encodedPath.orEmpty()
        val query = parsedUrl.encodedQuery?.let { "?$it" }.orEmpty()
        return "$baseUrl$path$query"
    }
}

private const val LOCAL_SOURCE_ID = "sample-local-images"

fun unsplashAssetLibrary(): AssetLibrary {
    val unsplashSourceType = AssetSourceType(sourceId = UnsplashAssetSource.SOURCE_ID)
    val unsplashSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_section_images,
        sourceTypes = listOf(unsplashSourceType),
        assetType = AssetType.Image,
        expandContent = LibraryContent.Grid(
            titleRes = R.string.ly_img_editor_asset_library_section_images,
            sourceType = unsplashSourceType,
            assetType = AssetType.Image,
        ),
    )

    return AssetLibrary.getDefault(
        images = LibraryCategory.Images.addSection(unsplashSection),
    )
}
```

Browse Unsplash's library of royalty-free photos from inside the editor by
registering a custom asset source. The engine calls your `findAssets`
implementation as users search and scroll, so results stream in from the
Unsplash API on demand.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260826/engine-guides-custom-asset-source)

<EngineReferenceNote {...props} />

CE.SDK lets you plug external image providers — like Unsplash or your own backend — into the engine as custom asset sources. This guide builds an Unsplash source, maps its REST responses to the engine's asset format, handles attribution, surfaces the source in the asset library, and shows the engine-managed local-source alternative.

## Prerequisites

- An Unsplash API access key from the [Unsplash Developer portal](https://unsplash.com/developers).
- A proxy that forwards requests to the Unsplash API. The sample expects a proxy base URL such as `https://your-api.example.com/unsplash`; do not embed an Unsplash access key in the Android app.
- A UTM source value that identifies your app in links back to Unsplash. Follow the [Unsplash API Guidelines](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines) for current attribution, hotlinking, and download-tracking requirements.
- A running CE.SDK `Engine` with an active scene when you apply returned assets to the canvas.

## Setting Up the Unsplash API Client

The Android sample wraps Unsplash REST calls in an `AssetSource` class. The class receives the current `Engine` for apply-time behavior, stores your proxy base URL and app-specific UTM source, declares JPEG support, and leaves groups empty because the guide queries search and popular images directly.

```kotlin highlight-android-source-definition
open class UnsplashAssetSource(
    private val engine: Engine,
    private val baseUrl: String,
    private val utmSource: String,
) : AssetSource(sourceId = "ly.img.asset.source.unsplash") {
    companion object {
        const val SOURCE_ID = "ly.img.asset.source.unsplash"
    }

    override val supportedMimeTypes = listOf(MimeType.JPEG.key)

    override suspend fun getGroups(): List<String>? = null
```

## Creating the Unsplash Asset Source Definition

Register the source with `engine.asset.addSource(...)`. Every Asset API call then refers to the source by its unique `sourceId`.

```kotlin highlight-android-register-source
engine.asset.addSource(source)
```

## Implementing Search and Discovery

The `findAssets` callback is the core of the integration. CE.SDK passes the current search string and pagination values; the source chooses the Unsplash endpoint and returns a `FindAssetsResult`.

```kotlin highlight-android-find-assets
override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
    if (query.query.isNullOrBlank()) {
        query.getPopularList()
    } else {
        query.getSearchList()
    }
}
```

The query carries:

- `query.query` - the current search term from the asset library search field.
- `query.page` - the zero-based page index requested by CE.SDK. The sample adds `1` when calling Unsplash because Unsplash pages start at `1`.
- `query.perPage` - the number of assets to return for this request.

### Search with Query

When users enter a search term, call Unsplash's `/search/photos` endpoint with the encoded query string and page controls.

```kotlin highlight-android-search-query
    private suspend fun FindAssetsQuery.getSearchList(): FindAssetsResult {
        val encodedQuery = URLEncoder.encode(query.orEmpty(), Charsets.UTF_8.name())
        val requestUrl = "$baseUrl/search/photos?query=$encodedQuery&page=${page + 1}&per_page=$perPage"
        val response = getResponseAsString(requestUrl).let(::JSONObject)
        val assetsArray = response.getJSONArray("results")
        val assets = mutableListOf<Asset>()
        for (index in 0 until assetsArray.length()) {
            assets += assetsArray.getJSONObject(index).toAsset()
        }

        val total = response.getInt("total")
        val totalPages = response.getInt("total_pages")
        return FindAssetsResult(
            assets = assets,
            currentPage = page,
            nextPage = if (page + 1 >= totalPages) -1 else page + 1,
            total = total,
        )
    }
```

Map the response to `FindAssetsResult`. Use `-1` for `nextPage` when there are no more pages so CE.SDK stops requesting more results.

### Popular Images

When no search term is present, call the `/photos` endpoint to return popular images. The endpoint does not return a stable total count, so the sample loads sequential pages until Unsplash returns an empty page.

```kotlin highlight-android-popular-list
private suspend fun FindAssetsQuery.getPopularList(): FindAssetsResult {
    val requestUrl = "$baseUrl/photos?order_by=popular&page=${page + 1}&per_page=$perPage"
    val assetsArray = getResponseAsString(requestUrl).let(::JSONArray)
    val assets = mutableListOf<Asset>()
    for (index in 0 until assetsArray.length()) {
        assets += assetsArray.getJSONObject(index).toAsset()
    }
    return FindAssetsResult(
        assets = assets,
        currentPage = page,
        nextPage = if (assets.isEmpty()) -1 else page + 1,
        total = Int.MAX_VALUE,
    )
}
```

## Translating Unsplash Data to CE.SDK Format

Each Unsplash photo becomes an `Asset`. The `id` is mandatory and must be unique within the source; the metadata tells CE.SDK which block, fill, and shape to create when the asset is applied.

```kotlin highlight-android-translate-asset
private suspend fun JSONObject.toAsset() = Asset(
    id = getString("id"),
    locale = "en",
    label = listOf(
        optString("description"),
        optString("alt_description"),
    ).firstOrNull { it.isNotBlank() },
    tags = optJSONArray("tags")
        ?.let { array ->
            (0 until array.length()).mapNotNull { index ->
                array.optJSONObject(index)?.optString("title")?.takeIf { it.isNotBlank() }
            }
        }
        ?.takeIf { it.isNotEmpty() },
    meta = mapOf(
        "uri" to getJSONObject("urls").getString("regular"),
        "thumbUri" to getJSONObject("urls").getString("thumb"),
        "downloadLocation" to optJSONObject("links")
            ?.optString("download_location")
            .orEmpty(),
        "blockType" to DesignBlockType.Graphic.key,
        "fillType" to FillType.Image.key,
        "shapeType" to ShapeType.Rect.key,
        "kind" to "image",
        "width" to getInt("width").toString(),
        "height" to getInt("height").toString(),
    ),
    context = AssetContext(sourceId = sourceId),
    credits = AssetCredits(
        name = optJSONObject("user")?.optString("name")?.takeIf { it.isNotBlank() } ?: "Unknown photographer",
        uri = optJSONObject("user")
            ?.optJSONObject("links")
            ?.optString("html")
            ?.takeIf { it.isNotBlank() }
            ?.let(Uri::parse),
    ),
    utm = AssetUTM(source = utmSource, medium = "referral"),
)
```

The important fields are:

- `id`, `locale`, `label`, and `tags` identify and describe the asset in the asset library.
- `meta["uri"]` is the image URL CE.SDK should display or apply, while `meta["thumbUri"]` is the preview image.
- `meta["downloadLocation"]` preserves the Unsplash event endpoint for apply-time tracking.
- `meta["blockType"]`, `meta["fillType"]`, and `meta["shapeType"]` use typed Android constants so CE.SDK can create an image graphic without inferring the type from the file.
- `context` records the source ID for the returned asset.
- `credits` and `utm` carry the photographer attribution and link-tracking metadata. Set the UTM source to the app name you registered with Unsplash.

## Handling Attribution Requirements

Unsplash requires photographer attribution. Set per-asset credits from the photo's `user` object, and set source-level credits and license information once on the source.

```kotlin highlight-android-credits-license
    override val credits = AssetCredits(
        name = "Unsplash",
        uri = Uri.parse("https://unsplash.com/"),
    )

    override val license = AssetLicense(
        name = "Unsplash license (free)",
        uri = Uri.parse("https://unsplash.com/license"),
    )
```

## Adding Download Tracking

Unsplash's API guidelines ask you to call a photo's download endpoint when the image is used. Search and list results should not trigger that endpoint. The sample keeps `links.download_location` in `meta["downloadLocation"]` and calls it only from the custom apply path.

```kotlin highlight-android-download-tracking
    private suspend fun trackDownloadEvent(asset: Asset) {
        val downloadLocation = asset.meta
            ?.get("downloadLocation")
            ?.takeIf { it.isNotBlank() }
            ?: return

        getResponseAsString(proxiedApiUrl(downloadLocation))
    }
```

Override `applyAsset(...)` so asset-library selection and programmatic `applyAssetSourceAsset(...)` calls both track the chosen image before CE.SDK applies it to the scene.

```kotlin highlight-android-apply-and-track
    override suspend fun applyAsset(asset: Asset): DesignBlock? {
        trackDownloadEvent(asset)
        return engine.asset.defaultApplyAsset(asset)
    }

    override suspend fun applyAsset(
        asset: Asset,
        block: DesignBlock,
    ) {
        trackDownloadEvent(asset)
        engine.asset.defaultApplyAsset(asset, block)
    }
```

## Requesting Through Your Proxy

Search, list, and tracking calls all go through the same small networking helpers. `proxiedApiUrl(...)` keeps relative paths on your proxy, rewrites Unsplash API URLs back through that proxy, and rejects unexpected hosts so the Android app never needs the access key.

```kotlin highlight-android-networking-helpers
    protected open suspend fun getResponseAsString(url: String) = withContext(Dispatchers.IO) {
        val connection = URL(url).openConnection() as HttpURLConnection
        require(connection.responseCode in 200 until 300) {
            connection.errorStream.bufferedReader().use { it.readText() }
        }
        connection.inputStream.bufferedReader().use { it.readText() }
    }

    private fun proxiedApiUrl(url: String): String {
        val parsedUrl = Uri.parse(url)
        if (parsedUrl.scheme == null) {
            val separator = if (url.startsWith("/")) "" else "/"
            return "$baseUrl$separator$url"
        }
        require(parsedUrl.host == "api.unsplash.com") {
            "Expected an Unsplash API URL but received ${parsedUrl.host}"
        }

        val path = parsedUrl.encodedPath.orEmpty()
        val query = parsedUrl.encodedQuery?.let { "?$it" }.orEmpty()
        return "$baseUrl$path$query"
    }
```

## Configuring the Asset Library UI

Once the source is registered, add an image section that points at `UnsplashAssetSource.SOURCE_ID`. The section also defines the grid that opens when users expand it. Use the returned `AssetLibrary` from your editor configuration's `assetLibrary` callback to show the Unsplash section in the Images tab.

```kotlin highlight-android-asset-library-ui
fun unsplashAssetLibrary(): AssetLibrary {
    val unsplashSourceType = AssetSourceType(sourceId = UnsplashAssetSource.SOURCE_ID)
    val unsplashSection = LibraryContent.Section(
        titleRes = R.string.ly_img_editor_asset_library_section_images,
        sourceTypes = listOf(unsplashSourceType),
        assetType = AssetType.Image,
        expandContent = LibraryContent.Grid(
            titleRes = R.string.ly_img_editor_asset_library_section_images,
            sourceType = unsplashSourceType,
            assetType = AssetType.Image,
        ),
    )

    return AssetLibrary.getDefault(
        images = LibraryCategory.Images.addSection(unsplashSection),
    )
}
```

The [Customize Asset Library](../asset-library/customize.md) guide covers broader Android editor UI patterns, including custom tabs and replacing default sections.

## Testing the Integration

After your proxy URL is configured and the editor has an active scene, query the source and apply one returned asset to the scene with `engine.asset.applyAssetSourceAsset(...)`.

```kotlin highlight-android-query-and-apply
    if (unsplashBaseUrl.isNotBlank()) {
        val popularResults = engine.asset.findAssets(
            sourceId = source.sourceId,
            query = FindAssetsQuery(query = "", page = 0, perPage = 10),
        )
        val searchResults = engine.asset.findAssets(
            sourceId = source.sourceId,
            query = FindAssetsQuery(query = "landscape", page = 0, perPage = 10),
        )

        val assetToApply = searchResults.assets.firstOrNull() ?: popularResults.assets.firstOrNull()
        if (assetToApply != null) {
            appliedRemoteAsset = engine.asset.applyAssetSourceAsset(
                sourceId = source.sourceId,
                asset = assetToApply,
            ) != null
        }
    }
```

## Troubleshooting

**Rate limiting** - Unsplash enforces hourly request limits. Cache results and avoid re-querying on every keystroke to stay within them.

**Authentication failures** - If requests fail with an authentication error, verify your proxy forwards the Unsplash access key and supports the `/photos`, `/search/photos`, and download-tracking paths.

**Missing attribution** - Confirm the per-asset `credits` and the source-level `credits` and `license` are populated; the editor uses them to display attribution.

**Images not loading** - Check that the mapped `uri` resolves over HTTPS and that the apply-time tracking request succeeds through your proxy.

## Local Asset Sources

When you already have a finite set of assets, you can skip implementing a query callback and let the engine manage search and pagination. Create a local source with `addLocalSource(...)` and a unique ID you reference later.

```kotlin highlight-android-add-local-source
engine.asset.addLocalSource(
    sourceId = LOCAL_SOURCE_ID,
    supportedMimeTypes = listOf(MimeType.JPEG.key),
)
```

Add assets with `addAsset(...)`. The engine stores them and returns matching items from queries, in insertion order. Call `assetSourceContentsChanged(...)` when the source contents change after registration.

```kotlin highlight-android-add-asset-to-source
val localAsset = AssetDefinition(
    id = "sample-landscape",
    label = mapOf("en" to "Sample Landscape"),
    tags = mapOf("en" to listOf("landscape", "sample")),
    meta = mapOf(
        "uri" to "https://img.ly/static/ubq_samples/sample_1.jpg",
        "thumbUri" to "https://img.ly/static/ubq_samples/sample_1.jpg",
        "mimeType" to MimeType.JPEG.key,
        "blockType" to DesignBlockType.Graphic.key,
        "fillType" to FillType.Image.key,
        "shapeType" to ShapeType.Rect.key,
        "kind" to "image",
        "width" to "1080",
        "height" to "1080",
    ),
)
engine.asset.addAsset(sourceId = LOCAL_SOURCE_ID, asset = localAsset)
engine.asset.assetSourceContentsChanged(sourceId = LOCAL_SOURCE_ID)
```

## API Reference

| Method | Description |
| --- | --- |
| `AssetSource(sourceId=_)` | Create a custom source with a stable source ID. |
| `AssetSource.findAssets(query=_)` | Return a page of assets for the current query. |
| `AssetSource.applyAsset(asset=_)` | Run source-specific apply logic before creating a block. |
| `AssetSource.applyAsset(asset=_, block=_)` | Run source-specific apply logic when replacing an existing block. |
| `AssetSource.getGroups()` | Return source groups, or `null` when the source has no group filters. |
| `engine.asset.addSource(source=_)` | Register a custom source such as Unsplash. |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query a registered source for a page of results. |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_)` | Add a queried asset to the active scene as a design block. |
| `engine.asset.defaultApplyAsset(asset=_)` | Apply an asset with CE.SDK's standard block creation behavior. |
| `engine.asset.defaultApplyAsset(asset=_, block=_)` | Apply an asset to an existing block with CE.SDK's standard behavior. |
| `AssetSourceType(sourceId=_)` | Reference a registered asset source from Android asset-library UI configuration. |
| `LibraryContent.Section(titleRes=_, sourceTypes=_, assetType=_, expandContent=_)` | Create an asset-library section for one or more source types. |
| `LibraryContent.Grid(titleRes=_, sourceType=_, assetType=_)` | Configure the expanded grid that displays assets from one source. |
| `LibraryCategory.Images.addSection(section=_)` | Add a custom section to the Images category. |
| `AssetLibrary.getDefault(images=_)` | Build the default asset library while replacing the Images category configuration. |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Create an engine-managed local asset source. |
| `engine.asset.addAsset(sourceId=_, asset=_)` | Add an asset definition to a local source. |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notify CE.SDK that a source's results changed. |

## Next Steps

- [Customize Asset Library](../asset-library/customize.md) — Configure asset panels and surface custom sources in the editor UI.
- [Basics](../asset-library/basics.md) — Explore the core functionality of the asset library and how users browse, search, and insert media.
- [From IMG.LY Premium Assets](./imgly-premium-assets.md) — Access a curated set of premium IMG.LY media assets for use in designs.
- [Asset Concepts](../concepts.md) — Learn the core asset and import model.




---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support