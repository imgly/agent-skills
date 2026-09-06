> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Pexels](./pexels.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-from-pexels/ImportFromPexels.kt reference-only
import android.net.Uri
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.editor.Editor
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
import ly.img.engine.AssetCredits
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
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

data class PexelsImportResult(
    val curatedTotal: Int,
    val searchTotal: Int,
    val firstBlock: DesignBlock?,
)

suspend fun importFromPexels(
    engine: Engine,
    apiKey: String = "YOUR_PEXELS_API_KEY",
    client: PexelsClient = HttpPexelsClient(apiKey = apiKey),
): PexelsImportResult {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = page, value = 1080F)
    engine.block.setHeight(block = page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    val source = PexelsAssetSource(client = client)
    if (source.sourceId !in engine.asset.findAllSources()) {
        engine.asset.addSource(source)
    }
    val curated = engine.asset.findAssets(
        sourceId = source.sourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )

    val search = engine.asset.findAssets(
        sourceId = source.sourceId,
        query = FindAssetsQuery(page = 0, perPage = 10, query = "workspace"),
    )

    val firstBlock = (search.assets.firstOrNull() ?: curated.assets.firstOrNull())?.let { asset ->
        engine.asset.applyAssetSourceAsset(
            sourceId = source.sourceId,
            asset = asset,
        )
    }

    return PexelsImportResult(
        curatedTotal = curated.total,
        searchTotal = search.total,
        firstBlock = firstBlock,
    )
}

@Composable
fun PexelsEditorSolution(
    license: String,
    apiKey: String,
    client: PexelsClient? = null,
    onClose: (Throwable?) -> Unit,
) {
    val pexelsClient = remember(apiKey, client) {
        client ?: HttpPexelsClient(apiKey = apiKey)
    }

    val pexelsAssetSource = remember(pexelsClient) {
        PexelsAssetSource(client = pexelsClient)
    }

    Column(modifier = Modifier.fillMaxSize().statusBarsPadding()) {
        PexelsProviderLink()

        Box(modifier = Modifier.weight(1F)) {
            Editor(
                license = license,
                configuration = {
                    EditorConfiguration.remember {
                        onLoaded = {
                            val engine = editorContext.engine
                            if (pexelsAssetSource.sourceId !in engine.asset.findAllSources()) {
                                engine.asset.addSource(pexelsAssetSource)
                            }
                        }

                        assetLibrary = {
                            remember {
                                val pexelsSourceType = AssetSourceType(sourceId = pexelsAssetSource.sourceId)
                                val pexelsSection = LibraryContent.Section(
                                    sourceTypes = listOf(pexelsSourceType),
                                    assetType = AssetType.Image,
                                    expandContent = LibraryContent.Grid(
                                        titleRes = R.string.ly_img_editor_asset_library_section_images,
                                        sourceType = pexelsSourceType,
                                        assetType = AssetType.Image,
                                        title = "Pexels",
                                    ),
                                )
                                AssetLibrary.getDefault(
                                    images = LibraryCategory.Images.addSection(pexelsSection),
                                )
                            }
                        }
                    }
                },
                onClose = onClose,
            )
        }
    }
}

const val PEXELS_PROVIDER_URI = "https://www.pexels.com/?utm_source=cesdk-android&utm_medium=referral"

@Composable
fun PexelsProviderLink(onOpenUri: ((Uri) -> Unit)? = null) {
    val uriHandler = LocalUriHandler.current
    val providerUri = remember { Uri.parse(PEXELS_PROVIDER_URI) }
    TextButton(
        onClick = {
            onOpenUri?.invoke(providerUri) ?: uriHandler.openUri(providerUri.toString())
        },
    ) {
        Text("Photos provided by Pexels")
    }
}

interface PexelsClient {
    suspend fun searchPhotos(
        query: String,
        page: Int,
        perPage: Int,
    ): PexelsResponse

    suspend fun curatedPhotos(
        page: Int,
        perPage: Int,
    ): PexelsResponse
}

const val PEXELS_CONNECT_TIMEOUT_MILLIS = 10_000
const val PEXELS_READ_TIMEOUT_MILLIS = 30_000

data class PexelsHttpRequest(
    val uri: Uri,
    val headers: Map<String, String>,
    val connectTimeoutMillis: Int = PEXELS_CONNECT_TIMEOUT_MILLIS,
    val readTimeoutMillis: Int = PEXELS_READ_TIMEOUT_MILLIS,
)

data class PexelsHttpResponse(
    val statusCode: Int,
    val body: String,
)

fun interface PexelsTransport {
    suspend fun execute(request: PexelsHttpRequest): PexelsHttpResponse
}

fun configurePexelsHttpConnection(
    connection: HttpURLConnection,
    request: PexelsHttpRequest,
) {
    connection.connectTimeout = request.connectTimeoutMillis
    connection.readTimeout = request.readTimeoutMillis
    request.headers.forEach { (key, value) ->
        connection.setRequestProperty(key, value)
    }
}

object UrlConnectionPexelsTransport : PexelsTransport {
    override suspend fun execute(request: PexelsHttpRequest): PexelsHttpResponse = withContext(Dispatchers.IO) {
        val connection = URL(request.uri.toString()).openConnection() as HttpURLConnection
        try {
            configurePexelsHttpConnection(connection = connection, request = request)
            val statusCode = connection.responseCode
            val stream = if (statusCode in 200..299) connection.inputStream else connection.errorStream
            PexelsHttpResponse(
                statusCode = statusCode,
                body = stream?.bufferedReader()?.use { it.readText() }.orEmpty(),
            )
        } finally {
            connection.disconnect()
        }
    }
}

class HttpPexelsClient(
    private val apiKey: String,
    private val transport: PexelsTransport = UrlConnectionPexelsTransport,
) : PexelsClient {
    override suspend fun searchPhotos(
        query: String,
        page: Int,
        perPage: Int,
    ): PexelsResponse = requestPexels(
        apiKey = apiKey,
        transport = transport,
        endpoint = "search",
        queryParameters = mapOf(
            "query" to query,
            "page" to page.toString(),
            "per_page" to perPage.toString(),
        ),
    )

    override suspend fun curatedPhotos(
        page: Int,
        perPage: Int,
    ): PexelsResponse = requestPexels(
        apiKey = apiKey,
        transport = transport,
        endpoint = "curated",
        queryParameters = mapOf(
            "page" to page.toString(),
            "per_page" to perPage.toString(),
        ),
    )
}

suspend fun requestPexels(
    apiKey: String,
    transport: PexelsTransport,
    endpoint: String,
    queryParameters: Map<String, String>,
): PexelsResponse {
    val uriBuilder = Uri.parse("https://api.pexels.com/v1")
        .buildUpon()
        .appendPath(endpoint)
    queryParameters.forEach { (key, value) ->
        uriBuilder.appendQueryParameter(key, value)
    }

    val response = transport.execute(
        PexelsHttpRequest(
            uri = uriBuilder.build(),
            headers = mapOf("Authorization" to apiKey),
        ),
    )
    require(response.statusCode == HttpURLConnection.HTTP_OK) {
        response.body.ifBlank { "Pexels request failed with HTTP ${response.statusCode}." }
    }
    return PexelsResponse.fromJson(JSONObject(response.body))
}

data class PexelsResponse(
    val photos: List<PexelsPhoto>,
    val totalResults: Int?,
    val hasNextPage: Boolean,
) {
    companion object {
        fun fromJson(json: JSONObject): PexelsResponse {
            val photosJson = json.getJSONArray("photos")
            val photos = (0 until photosJson.length()).map { index ->
                PexelsPhoto.fromJson(photosJson.getJSONObject(index))
            }
            return PexelsResponse(
                photos = photos,
                totalResults = if (json.has("total_results")) json.getInt("total_results") else null,
                hasNextPage = photos.isNotEmpty() && getNullableJsonString(json, "next_page")?.isNotBlank() == true,
            )
        }
    }
}

data class PexelsPhoto(
    val id: Int,
    val width: Int,
    val height: Int,
    val url: String,
    val photographer: String,
    val photographerUrl: String?,
    val alt: String?,
    val src: PexelsPhotoSource,
) {
    companion object {
        fun fromJson(json: JSONObject): PexelsPhoto {
            val src = json.getJSONObject("src")
            return PexelsPhoto(
                id = json.getInt("id"),
                width = json.getInt("width"),
                height = json.getInt("height"),
                url = json.getString("url"),
                photographer = json.getString("photographer"),
                photographerUrl = getNullableJsonString(json, "photographer_url"),
                alt = getNullableJsonString(json, "alt"),
                src = PexelsPhotoSource(
                    original = src.getString("original"),
                    medium = src.getString("medium"),
                ),
            )
        }
    }
}

data class PexelsPhotoSource(
    val original: String,
    val medium: String,
)

fun getNullableJsonString(
    json: JSONObject,
    name: String,
): String? = if (json.has(name) && !json.isNull(name)) json.getString(name) else null

class PexelsAssetSource(
    private val client: PexelsClient,
) : AssetSource(sourceId = SOURCE_ID) {
    override suspend fun getGroups(): List<String>? = null

    override val supportedMimeTypes = listOf(MimeType.JPEG.key, MimeType.PNG.key)
    override val credits = AssetCredits(
        name = "Pexels",
        uri = Uri.parse("https://www.pexels.com/"),
    )

    override val license = AssetLicense(
        name = "Pexels license (free)",
        uri = Uri.parse("https://www.pexels.com/license/"),
    )

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        findPexelsAssets(
            client = client,
            sourceId = sourceId,
            query = query,
        )
    }

    companion object {
        const val SOURCE_ID = "ly.img.asset.source.pexels"
    }
}

suspend fun findPexelsAssets(
    client: PexelsClient,
    sourceId: String,
    query: FindAssetsQuery,
): FindAssetsResult {
    val pexelsPage = query.page + 1
    val searchQuery = query.query?.takeIf { it.isNotBlank() }
    val response =
        if (searchQuery == null) {
            client.curatedPhotos(page = pexelsPage, perPage = query.perPage)
        } else {
            client.searchPhotos(
                query = searchQuery,
                page = pexelsPage,
                perPage = query.perPage,
            )
        }

    val assets = response.photos.map { photo ->
        toPexelsAsset(photo = photo, sourceId = sourceId)
    }
    return FindAssetsResult(
        assets = assets,
        currentPage = query.page,
        nextPage = if (response.hasNextPage) query.page + 1 else -1,
        total = response.totalResults ?: -1,
    )
}

fun getPexelsMimeType(uri: String): String? {
    val extension = Uri.parse(uri).lastPathSegment?.substringAfterLast('.', missingDelimiterValue = "")?.lowercase()
    return when (extension) {
        "jpg", "jpeg" -> MimeType.JPEG.key
        "png" -> MimeType.PNG.key
        else -> null
    }
}

fun toPexelsAsset(
    photo: PexelsPhoto,
    sourceId: String,
) = Asset(
    id = photo.id.toString(),
    context = AssetContext(sourceId = sourceId),
    label = photo.alt?.takeIf { it.isNotBlank() },
    locale = "en",
    meta = buildMap {
        put("uri", photo.src.original)
        put("thumbUri", photo.src.medium)
        getPexelsMimeType(photo.src.original)?.let { put("mimeType", it) }
        put("blockType", DesignBlockType.Graphic.key)
        put("fillType", FillType.Image.key)
        put("shapeType", ShapeType.Rect.key)
        put("kind", "image")
        put("width", photo.width.toString())
        put("height", photo.height.toString())
    },
    credits = AssetCredits(
        name = photo.photographer,
        uri = Uri.parse(photo.url),
    ),
    utm = AssetUTM(
        source = "cesdk-android",
        medium = "referral",
    ),
)
```

Connect CE.SDK to Pexels so Android users can browse, search, and add
royalty-free stock photos without leaving the editor.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260906/engine-guides-import-from-pexels)

<EngineReferenceNote {...props} />

Pexels accepts an API key in the `Authorization` request header. In production, the Android app should call your backend proxy,
and the proxy should hold the key, forward curated or search requests to Pexels, and return the Pexels JSON response.

This guide covers the Android client side: registering a custom `AssetSource`, querying and translating Pexels responses,
applying a result programmatically, exposing Pexels in the editor asset library, and preserving provider and photographer
attribution.

## Prerequisites

Before integrating Pexels, make sure you have:

- A Pexels API key from the [Pexels API documentation](https://www.pexels.com/api/documentation/).
- For production Android apps, a backend proxy or secrets layer appropriate for your deployment.
- An integration that follows Pexels' [API guidelines](https://www.pexels.com/api/documentation/#guidelines), provider-link and
  photographer-credit guidance, and rate limits.
- A plan for displaying Pexels provider and photographer attribution in your app-owned UI.

The sample accepts an API key parameter and calls Pexels directly so you can inspect the complete request flow.

> **Warning:** The direct request is for a runnable development sample only. Do not ship the Pexels API key in your Android application
> binary. Route production requests through a backend proxy and add the `Authorization` header there.

## Protect the API Key in Production

The recommended request flow for an Android production app is:

**Android app (CE.SDK)** -> **Your backend proxy** -> **Pexels API**

The production implementation of `PexelsClient` sends the search text, page, and page size to your proxy. The proxy validates
the app request, authenticates to Pexels with the API key, calls either the curated or search endpoint, and returns the Pexels
response. Because CE.SDK uses zero-based pages on Android and Pexels uses one-based pages, the source adds one to
`FindAssetsQuery.page` before making the provider request.

The sample uses these Pexels request values:

| Value | Purpose |
| ----- | ------- |
| `query` | Search text from `FindAssetsQuery.query`; omitted for curated browsing. |
| `page` | One-based Pexels page number. |
| `per_page` | Number of results requested for the page. |
| `Authorization` | Pexels API key. Add this header on the proxy in production. |

Keep the Pexels response shape intact when possible. The Android client maps fields such as `photos`, `total_results`,
`next_page`, image dimensions and URLs, the public photo page, and photographer information into CE.SDK assets.

## Create the Asset Source

On Android, a custom remote provider is an `AssetSource` subclass. Give the Pexels source a stable ID, declare its supported
image formats, and provide source-level credits and licensing metadata.

```kotlin highlight-android-source-metadata
class PexelsAssetSource(
    private val client: PexelsClient,
) : AssetSource(sourceId = SOURCE_ID) {
    override suspend fun getGroups(): List<String>? = null

    override val supportedMimeTypes = listOf(MimeType.JPEG.key, MimeType.PNG.key)
    override val credits = AssetCredits(
        name = "Pexels",
        uri = Uri.parse("https://www.pexels.com/"),
    )

    override val license = AssetLicense(
        name = "Pexels license (free)",
        uri = Uri.parse("https://www.pexels.com/license/"),
    )

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        findPexelsAssets(
            client = client,
            sourceId = sourceId,
            query = query,
        )
    }

    companion object {
        const val SOURCE_ID = "ly.img.asset.source.pexels"
    }
}
```

- `supportedMimeTypes`, `credits`, and `license` describe the source and apply to all results.
- `getGroups()` returns `null` because this source does not expose another grouping layer.
- `findAssets(query)` moves the complete request, decoding, mapping, and pagination path to `Dispatchers.IO`.

Per-asset credits identify the photographer and link to the public Pexels photo page.

## Query Pexels

The sample client separates endpoint selection from request execution. Keep request and response processing off the engine
thread; `PexelsAssetSource.findAssets()` runs the complete path on `Dispatchers.IO`, while the included `HttpURLConnection`
transport uses finite timeouts and always disconnects.

### Build the Pexels Request

Use `/v1/curated` when the asset query has no search text and `/v1/search` for a non-empty query. Both requests carry the
one-based page and page size.

```kotlin highlight-android-api-client-implementation
class HttpPexelsClient(
    private val apiKey: String,
    private val transport: PexelsTransport = UrlConnectionPexelsTransport,
) : PexelsClient {
    override suspend fun searchPhotos(
        query: String,
        page: Int,
        perPage: Int,
    ): PexelsResponse = requestPexels(
        apiKey = apiKey,
        transport = transport,
        endpoint = "search",
        queryParameters = mapOf(
            "query" to query,
            "page" to page.toString(),
            "per_page" to perPage.toString(),
        ),
    )

    override suspend fun curatedPhotos(
        page: Int,
        perPage: Int,
    ): PexelsResponse = requestPexels(
        apiKey = apiKey,
        transport = transport,
        endpoint = "curated",
        queryParameters = mapOf(
            "page" to page.toString(),
            "per_page" to perPage.toString(),
        ),
    )
}
```

In a production integration, inject a `PexelsClient` implementation that calls your proxy instead of `HttpPexelsClient`. The
proxy-backed client sends only your app's request parameters; the proxy chooses or validates the upstream endpoint and adds the
Pexels credential.

### Load the Pexels Response

Build the URI, add the `Authorization` header, reject unsuccessful responses, and decode the response body. The sample accepts
a transport dependency so tests can exercise the same client without live credentials.

```kotlin highlight-android-api-request
suspend fun requestPexels(
    apiKey: String,
    transport: PexelsTransport,
    endpoint: String,
    queryParameters: Map<String, String>,
): PexelsResponse {
    val uriBuilder = Uri.parse("https://api.pexels.com/v1")
        .buildUpon()
        .appendPath(endpoint)
    queryParameters.forEach { (key, value) ->
        uriBuilder.appendQueryParameter(key, value)
    }

    val response = transport.execute(
        PexelsHttpRequest(
            uri = uriBuilder.build(),
            headers = mapOf("Authorization" to apiKey),
        ),
    )
    require(response.statusCode == HttpURLConnection.HTTP_OK) {
        response.body.ifBlank { "Pexels request failed with HTTP ${response.statusCode}." }
    }
    return PexelsResponse.fromJson(JSONObject(response.body))
}
```

The runnable sample sends the key from Android for transparency. In production, omit that provider credential from the app
request and let your backend add it when calling Pexels.

## Parse Pexels Responses

### Decode the Response

Decode the photo array together with Pexels' documented `total_results` and optional `next_page` fields.

```kotlin highlight-android-response-decoding
fun fromJson(json: JSONObject): PexelsResponse {
    val photosJson = json.getJSONArray("photos")
    val photos = (0 until photosJson.length()).map { index ->
        PexelsPhoto.fromJson(photosJson.getJSONObject(index))
    }
    return PexelsResponse(
        photos = photos,
        totalResults = if (json.has("total_results")) json.getInt("total_results") else null,
        hasNextPage = photos.isNotEmpty() && getNullableJsonString(json, "next_page")?.isNotBlank() == true,
    )
}
```

The sample keeps `totalResults` nullable as defensive handling for an unexpected response that omits the documented field.
`hasNextPage` requires both a non-empty photo page and a usable `next_page` value, matching the iOS integration's defensive
pagination behavior.

### Build the Paginated Result

Translate CE.SDK's zero-based page to Pexels' one-based page, select curated or search behavior from the query text, and return
the mapped page as a `FindAssetsResult`.

```kotlin highlight-android-find-assets
suspend fun findPexelsAssets(
    client: PexelsClient,
    sourceId: String,
    query: FindAssetsQuery,
): FindAssetsResult {
    val pexelsPage = query.page + 1
    val searchQuery = query.query?.takeIf { it.isNotBlank() }
    val response =
        if (searchQuery == null) {
            client.curatedPhotos(page = pexelsPage, perPage = query.perPage)
        } else {
            client.searchPhotos(
                query = searchQuery,
                page = pexelsPage,
                perPage = query.perPage,
            )
        }

    val assets = response.photos.map { photo ->
        toPexelsAsset(photo = photo, sourceId = sourceId)
    }
    return FindAssetsResult(
        assets = assets,
        currentPage = query.page,
        nextPage = if (response.hasNextPage) query.page + 1 else -1,
        total = response.totalResults ?: -1,
    )
}
```

`nextPage` is `-1` when Pexels omits `next_page`. The response's `total_results` becomes `FindAssetsResult.total`; the
sample uses `-1` only as a defensive fallback.

### Map Photos to Assets

Derive MIME metadata from the full-resolution image URL and omit it when the extension is unknown:

```kotlin highlight-android-mime-type
fun getPexelsMimeType(uri: String): String? {
    val extension = Uri.parse(uri).lastPathSegment?.substringAfterLast('.', missingDelimiterValue = "")?.lowercase()
    return when (extension) {
        "jpg", "jpeg" -> MimeType.JPEG.key
        "png" -> MimeType.PNG.key
        else -> null
    }
}
```

Map each Pexels photo to CE.SDK's Android `Asset` model:

```kotlin highlight-android-translate
fun toPexelsAsset(
    photo: PexelsPhoto,
    sourceId: String,
) = Asset(
    id = photo.id.toString(),
    context = AssetContext(sourceId = sourceId),
    label = photo.alt?.takeIf { it.isNotBlank() },
    locale = "en",
    meta = buildMap {
        put("uri", photo.src.original)
        put("thumbUri", photo.src.medium)
        getPexelsMimeType(photo.src.original)?.let { put("mimeType", it) }
        put("blockType", DesignBlockType.Graphic.key)
        put("fillType", FillType.Image.key)
        put("shapeType", ShapeType.Rect.key)
        put("kind", "image")
        put("width", photo.width.toString())
        put("height", photo.height.toString())
    },
    credits = AssetCredits(
        name = photo.photographer,
        uri = Uri.parse(photo.url),
    ),
    utm = AssetUTM(
        source = "cesdk-android",
        medium = "referral",
    ),
)
```

The mapping provides:

- `uri` and `thumbUri` from Pexels' original and medium-size image URLs.
- Image dimensions and the block, fill, shape, and kind hints used by `defaultApplyAsset()`.
- Photographer credits linked to the public Pexels photo page.
- `AssetContext.sourceId` so CE.SDK retains source provenance.
- Referral metadata through `AssetUTM`.

## Create a Scene for Applying Assets

`engine.asset.applyAssetSourceAsset()` inserts the returned asset into the active scene. The sample creates a square page
before querying Pexels; in your app, you can use any active scene that already contains a page.

```kotlin highlight-android-scene-setup
val scene = engine.scene.create()
val page = engine.block.create(DesignBlockType.Page)
engine.block.setWidth(block = page, value = 1080F)
engine.block.setHeight(block = page, value = 1080F)
engine.block.appendChild(parent = scene, child = page)
```

## Query and Apply Images Programmatically

Create and register the source on an existing `Engine`. Check the registered IDs first so repeated setup does not add the same
source twice.

```kotlin highlight-android-programmatic-register
val source = PexelsAssetSource(client = client)
if (source.sourceId !in engine.asset.findAllSources()) {
    engine.asset.addSource(source)
}
```

An empty query loads curated photos. A non-empty query searches Pexels:

```kotlin highlight-android-query-source
    val curated = engine.asset.findAssets(
        sourceId = source.sourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )

    val search = engine.asset.findAssets(
        sourceId = source.sourceId,
        query = FindAssetsQuery(page = 0, perPage = 10, query = "workspace"),
    )
```

Pass the selected source ID explicitly when applying an asset:

```kotlin highlight-android-apply-asset
val firstBlock = (search.assets.firstOrNull() ?: curated.assets.firstOrNull())?.let { asset ->
    engine.asset.applyAssetSourceAsset(
        sourceId = source.sourceId,
        asset = asset,
    )
}
```

`applyAssetSourceAsset()` returns the created block when CE.SDK can materialize the asset. Check for `null` before positioning
or resizing the result.

## Add Pexels to the Asset Library UI

To expose Pexels in the CE.SDK editor UI, keep one source instance across recompositions, register it after the editor has
loaded, and add a section for that source to the Images asset library. For a complete editor surface, see the
[Design Editor Starter Kit](../../starterkits/design-editor.md).

Create the source outside the configuration builder so recomposition does not replace it:

```kotlin highlight-android-editor-source-create
val pexelsAssetSource = remember(pexelsClient) {
    PexelsAssetSource(client = pexelsClient)
}
```

Register the source from `onLoaded`. The duplicate check keeps repeated setup safe:

```kotlin highlight-android-editor-source-register
onLoaded = {
    val engine = editorContext.engine
    if (pexelsAssetSource.sourceId !in engine.asset.findAllSources()) {
        engine.asset.addSource(pexelsAssetSource)
    }
}
```

The asset library section points at the same source ID and expands into a searchable image grid. Starting with
`AssetLibrary.getDefault()` preserves the other default library categories:

```kotlin highlight-android-asset-library-ui
assetLibrary = {
    remember {
        val pexelsSourceType = AssetSourceType(sourceId = pexelsAssetSource.sourceId)
        val pexelsSection = LibraryContent.Section(
            sourceTypes = listOf(pexelsSourceType),
            assetType = AssetType.Image,
            expandContent = LibraryContent.Grid(
                titleRes = R.string.ly_img_editor_asset_library_section_images,
                sourceType = pexelsSourceType,
                assetType = AssetType.Image,
                title = "Pexels",
            ),
        )
        AssetLibrary.getDefault(
            images = LibraryCategory.Images.addSection(pexelsSection),
        )
    }
}
```

An empty query shows curated photos, while entering text in the grid switches the same source to Pexels search.

## Handle Licensing and Attribution

The [Pexels license](https://www.pexels.com/license/) does not require attribution, but the Pexels API guidelines require a
prominent Pexels link and ask integrations to credit photographers when possible. Preserve both levels of attribution:

- Source-level `credits` and `license` identify Pexels and link to its terms.
- Per-asset `credits` identify the photographer and link to the public photo page.
- `AssetUTM` adds the recommended referral parameters to outgoing credit links.

CE.SDK can surface asset credit metadata in asset details. Keep the provider link in app-owned UI so it stays visible without a
custom dock or editor configuration builder:

```kotlin highlight-android-provider-link
const val PEXELS_PROVIDER_URI = "https://www.pexels.com/?utm_source=cesdk-android&utm_medium=referral"

@Composable
fun PexelsProviderLink(onOpenUri: ((Uri) -> Unit)? = null) {
    val uriHandler = LocalUriHandler.current
    val providerUri = remember { Uri.parse(PEXELS_PROVIDER_URI) }
    TextButton(
        onClick = {
            onOpenUri?.invoke(providerUri) ?: uriHandler.openUri(providerUri.toString())
        },
    ) {
        Text("Photos provided by Pexels")
    }
}
```

Review Pexels' current API guidelines and rate limits before shipping.

## Troubleshooting

- **Authentication errors:** Confirm the proxy adds the Pexels API key in the `Authorization` header. For the direct sample,
  confirm the configured development key is present.
- **Rate limiting:** Handle HTTP 429 on the proxy, cache results where permitted, and back off before retrying.
- **Empty results:** Confirm an empty CE.SDK query calls `/curated`, a non-empty query calls `/search`, and the response includes
  a `photos` array.
- **Repeated or skipped pages:** Confirm CE.SDK's zero-based page is converted to Pexels' one-based page exactly once.
- **Images fail to insert:** Verify `src.original` and `src.medium` are reachable from the device and the mapped asset contains
  the image block metadata shown above.
- **Missing provider link:** Keep the app-owned provider action visible whenever Pexels API content is available.
- **Missing photographer credit:** Confirm the Pexels response contains `photographer` and `url` and that both are mapped to the
  asset's `credits`.
- **Missing default library content:** Start with `AssetLibrary.getDefault()` and add the Pexels section to its Images category.

## API Reference

| Method | Purpose |
| ------ | ------- |
| `engine.asset.addSource(source=_)` | Register the Pexels `AssetSource`. |
| `engine.asset.findAllSources()` | Check whether the source is already registered. |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query curated or searched Pexels results. |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_)` | Insert a returned Pexels asset through its source. |
| `AssetSource.findAssets(query=_)` | Implement Pexels-backed browsing and search. |
| `AssetSource.getGroups()` | Return optional source groups, or `null` when none exist. |
| `engine.scene.create()` | Create the active scene used by the programmatic apply call. |
| `engine.block.create(blockType=_)` | Create the page used by the sample scene. |
| `engine.block.setWidth(block=_, value=_)` | Set the sample page width. |
| `engine.block.setHeight(block=_, value=_)` | Set the sample page height. |
| `engine.block.appendChild(parent=_, child=_)` | Attach the page to the scene. |
| `EditorConfiguration.remember(builder=_)` | Configure source registration and asset library UI. |
| `AssetLibrary.getDefault(images=_)` | Keep the default asset library and customize Images. |
| `LibraryCategory.Images.addSection(section=_)` | Append the Pexels preview to the Images category. |
| `LibraryContent.Section(sourceTypes=_, assetType=_, expandContent=_)` | Define the compact Pexels preview. |
| `LibraryContent.Grid(titleRes=_, sourceType=_, assetType=_, title=_)` | Define the paginated Pexels image grid. |
| `AssetSourceType(sourceId=_)` | Connect library content to the Pexels source. |

## Related Types

| Type | Purpose |
| ---- | ------- |
| `AssetSource` | Base class for custom Android asset providers. |
| `FindAssetsQuery` | Search text, paging, and filter data from CE.SDK. |
| `FindAssetsResult` | Paginated asset response returned to CE.SDK. |
| `Asset` | One mapped Pexels photo in CE.SDK's Android asset model. |
| `AssetContext` | Source provenance associated with an asset. |
| `AssetCredits` | Provider-level or photographer-level credit metadata. |
| `AssetLibrary` | Editor UI asset library configuration. |
| `LibraryCategory` | A category such as the default Images library. |
| `LibraryContent.Section` | A preview section inside an asset library category. |

## Next Steps

- [Customize Asset Library](../asset-library/customize.md) - Configure asset panels and UI
- [Asset Library Basics](../asset-library/basics.md) - Understand asset sources
- [Integrate Unsplash Images](./unsplash.md) - Add another stock image source
- [From Remote Source](../from-remote-source.md) - Explore other remote asset integrations
- [Import Media Concepts](../concepts.md) - Learn core import concepts



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support