> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Getty Images](./getty-images.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-media-getty-images/GettyImages.kt reference-only
import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
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
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.FindAssetsResult
import ly.img.engine.ShapeType
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

suspend fun gettyImages(
    engine: Engine,
    proxyBaseUrl: String,
    proxyResponseProvider: (suspend (Uri) -> JSONObject)? = null,
): GettyImagesImportResult {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = page, value = 800F)
    engine.block.setHeight(block = page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val source = GettyImagesAssetSource(
        proxyBaseUrl = proxyBaseUrl,
        proxyResponseProvider = proxyResponseProvider,
    )
    if (source.sourceId !in engine.asset.findAllSources()) {
        engine.asset.addSource(source)
    }

    val results = engine.asset.findAssets(
        sourceId = GettyImagesAssetSource.SOURCE_ID,
        query = FindAssetsQuery(query = "architecture", page = 0, perPage = 12),
    )
    val firstBlock = results.assets.firstOrNull()?.let { asset ->
        engine.asset.applyAssetSourceAsset(
            sourceId = GettyImagesAssetSource.SOURCE_ID,
            asset = asset,
        )
    }
    return GettyImagesImportResult(total = results.total, firstBlock = firstBlock)
}

data class GettyImagesImportResult(
    val total: Int,
    val firstBlock: DesignBlock?,
)

@Composable
fun GettyImagesEditorSolution(
    license: String,
    proxyBaseUrl: String,
    onClose: (Throwable?) -> Unit,
) {
    val gettyImagesAssetSource = remember(proxyBaseUrl) {
        GettyImagesAssetSource(proxyBaseUrl = proxyBaseUrl)
    }

    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onLoaded = {
                    val engine = editorContext.engine
                    if (gettyImagesAssetSource.sourceId !in engine.asset.findAllSources()) {
                        engine.asset.addSource(gettyImagesAssetSource)
                    }
                }

                assetLibrary = {
                    remember {
                        val gettyImagesSourceType = AssetSourceType(sourceId = gettyImagesAssetSource.sourceId)
                        val gettyImagesSection = LibraryContent.Section(
                            sourceTypes = listOf(gettyImagesSourceType),
                            assetType = AssetType.Image,
                            expandContent = LibraryContent.Grid(
                                titleRes = R.string.ly_img_editor_asset_library_section_images,
                                sourceType = gettyImagesSourceType,
                                assetType = AssetType.Image,
                                title = "Getty Images",
                            ),
                        )
                        AssetLibrary.getDefault(
                            images = LibraryCategory.Images.addSection(gettyImagesSection),
                        )
                    }
                }
            }
        },
        onClose = onClose,
    )
}

class GettyImagesAssetSource(
    private val proxyBaseUrl: String,
    private val proxyResponseProvider: (suspend (Uri) -> JSONObject)? = null,
) : AssetSource(sourceId = SOURCE_ID) {
    override val supportedMimeTypes = listOf("image/jpeg")

    override val credits = AssetCredits(
        name = "Getty Images",
        uri = Uri.parse("https://www.gettyimages.com/"),
    )

    override val license = AssetLicense(
        name = "Getty Images Content License Agreement",
        uri = Uri.parse("https://www.gettyimages.com/eula"),
    )

    override suspend fun getGroups(): List<String>? = null

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        val proxyResponse = loadGettyImagesResponse(
            uri = buildGettyImagesSearchUri(proxyBaseUrl = proxyBaseUrl, query = query),
            responseProvider = proxyResponseProvider,
        )
        toFindAssetsResult(response = proxyResponse, requestedPage = query.page, perPage = query.perPage)
    }

    companion object {
        const val SOURCE_ID = "ly.img.asset.source.getty.images"
    }
}

fun buildGettyImagesSearchUri(
    proxyBaseUrl: String,
    query: FindAssetsQuery,
): Uri = Uri.parse(proxyBaseUrl).buildUpon()
    .appendQueryParameter("phrase", query.query.orEmpty())
    .appendQueryParameter("page", (query.page + 1).toString())
    .appendQueryParameter("page_size", query.perPage.toString())
    .build()

suspend fun loadGettyImagesResponse(
    uri: Uri,
    responseProvider: (suspend (Uri) -> JSONObject)? = null,
): JSONObject = responseProvider?.invoke(uri) ?: readGettyImagesJson(uri)

fun readGettyImagesJson(uri: Uri): JSONObject {
    val connection = URL(uri.toString()).openConnection() as HttpURLConnection
    return try {
        require(connection.responseCode in 200 until 300) {
            connection.errorStream?.bufferedReader()?.use { it.readText() }.orEmpty()
        }
        JSONObject(connection.inputStream.bufferedReader().use { it.readText() })
    } finally {
        connection.disconnect()
    }
}

fun toFindAssetsResult(
    response: JSONObject,
    requestedPage: Int,
    perPage: Int,
): FindAssetsResult {
    val images = response.optJSONArray("images")
    val total = response.optInt("result_count", -1)
    val loadedSoFar = (requestedPage + 1) * perPage
    val hasNextPage = images != null && images.length() > 0 && (total < 0 || loadedSoFar < total)
    val assets = if (images == null) {
        emptyList()
    } else {
        (0 until images.length()).map { index ->
            toGettyImagesAsset(images.getJSONObject(index))
        }
    }
    return FindAssetsResult(
        assets = assets,
        currentPage = requestedPage,
        nextPage = if (hasNextPage) requestedPage + 1 else -1,
        total = total,
    )
}

fun toGettyImagesAsset(photo: JSONObject): Asset = Asset(
    id = photo.getString("id"),
    context = AssetContext(sourceId = GettyImagesAssetSource.SOURCE_ID),
    label = photo.optString("title").takeIf { it.isNotBlank() },
    locale = "en",
    meta = toGettyImagesImageMeta(photo),
)

fun toGettyImagesImageMeta(photo: JSONObject): Map<String, String> {
    val sizes = getGettyImagesDisplaySizesByName(photo)
    val fullUri = sizes["comp"] ?: sizes["preview"] ?: sizes.values.firstOrNull().orEmpty()
    val thumbUri = sizes["thumb"] ?: sizes["preview"] ?: fullUri
    val maxDimensions = photo.optJSONObject("max_dimensions")
    return mapOf(
        "uri" to fullUri,
        "thumbUri" to thumbUri,
        "mimeType" to "image/jpeg",
        "blockType" to DesignBlockType.Graphic.key,
        "fillType" to FillType.Image.key,
        "shapeType" to ShapeType.Rect.key,
        "kind" to "image",
        "width" to maxDimensions?.optInt("width")?.takeIf { it > 0 }?.toString().orEmpty(),
        "height" to maxDimensions?.optInt("height")?.takeIf { it > 0 }?.toString().orEmpty(),
    )
}

fun getGettyImagesDisplaySizesByName(photo: JSONObject): Map<String, String> {
    val displaySizes = photo.optJSONArray("display_sizes") ?: return emptyMap()
    return (0 until displaySizes.length())
        .mapNotNull { index ->
            val size = displaySizes.optJSONObject(index) ?: return@mapNotNull null
            val name = size.optString("name").takeIf { it.isNotBlank() } ?: return@mapNotNull null
            val uri = size.optString("uri").takeIf { it.isNotBlank() } ?: return@mapNotNull null
            name to uri
        }
        .toMap()
}
```

Integrate Getty Images stock photography into your Android app by routing search requests through a secure proxy and
exposing the results as a CE.SDK asset source.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260905/engine-guides-import-media-getty-images)

<EngineReferenceNote {...props} />

Getty Images requires authenticated server-side access. The Android app should call your proxy, and the proxy should hold the
Getty Images API key and secret, forward search requests to Getty Images, and return Getty Images' raw `searchimages` JSON.

This guide covers the Android client side: registering a custom `AssetSource`, parsing your proxy response into CE.SDK assets,
applying a Getty Images result programmatically, and exposing the source in the CE.SDK editor asset library.

## Prerequisites

Before integrating Getty Images, make sure you have:

- Getty Images API credentials from the [Getty Images API Portal](https://developer.gettyimages.com/).
- A server-side proxy that stores `GETTY_IMAGES_API_KEY` and `GETTY_IMAGES_API_SECRET` outside the Android app.
- An Android-accessible proxy URL, for example from `local.properties`, `BuildConfig`, remote configuration, or your own secrets layer.
- A Getty Images license agreement that covers how your users preview, license, and export content.

Never ship the Getty Images API key or secret in the Android app. The app should only know the proxy URL. The example expects a
thin pass-through proxy: it forwards the query to Getty Images and returns the Getty Images `searchimages` response unchanged.

## Understand the Proxy Requirement

The request flow is:

**Android app (CE.SDK)** -> **Your proxy server** -> **Getty Images API**

The proxy validates app requests, authenticates with Getty Images, forwards CE.SDK's page request to Getty Images, and returns
the Getty Images response unchanged. Because CE.SDK uses zero-based pages on Android and Getty Images uses one-based pages, the
Android source adds one to `FindAssetsQuery.page` before calling the proxy.

The example sends these query parameters to the proxy:

| Parameter | Purpose |
| --------- | ------- |
| `phrase` | Search text from `FindAssetsQuery.query`. |
| `page` | One-based Getty Images page number. |
| `page_size` | Number of results requested for the page. |

Your proxy should forward those values to Getty Images' `searchimages` endpoint and return a response with fields such as
`result_count`, `images`, `display_sizes`, and `max_dimensions`. The Android client decodes that Getty Images shape and
translates it into CE.SDK assets.

## Create the Asset Source

On Android, a custom remote provider is an `AssetSource` subclass. The complete declaration below shows every member that
`GettyImagesAssetSource` overrides: source metadata, optional groups, and the proxy-backed search callback.

```kotlin highlight-android-source-definition
class GettyImagesAssetSource(
    private val proxyBaseUrl: String,
    private val proxyResponseProvider: (suspend (Uri) -> JSONObject)? = null,
) : AssetSource(sourceId = SOURCE_ID) {
    override val supportedMimeTypes = listOf("image/jpeg")

    override val credits = AssetCredits(
        name = "Getty Images",
        uri = Uri.parse("https://www.gettyimages.com/"),
    )

    override val license = AssetLicense(
        name = "Getty Images Content License Agreement",
        uri = Uri.parse("https://www.gettyimages.com/eula"),
    )

    override suspend fun getGroups(): List<String>? = null

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = withContext(Dispatchers.IO) {
        val proxyResponse = loadGettyImagesResponse(
            uri = buildGettyImagesSearchUri(proxyBaseUrl = proxyBaseUrl, query = query),
            responseProvider = proxyResponseProvider,
        )
        toFindAssetsResult(response = proxyResponse, requestedPage = query.page, perPage = query.perPage)
    }

    companion object {
        const val SOURCE_ID = "ly.img.asset.source.getty.images"
    }
}
```

- `supportedMimeTypes`, `credits`, and `license` describe the source and apply to all of its results.
- `getGroups()` returns `null` because this source does not expose additional group filters.
- `findAssets(query)` moves the network request to `Dispatchers.IO`, then translates the Getty Images response into a
  `FindAssetsResult`.

Per-asset `credits` can still name the photographer or contributor when your proxy includes that data.

## Query the Proxy

The `findAssets(query)` override calls two focused helpers: one builds the search URI and the other loads the proxy response.
Keep network work on `Dispatchers.IO` because the engine invokes asset source callbacks from the engine thread.

### Build the Search Request

Build the proxy request from `FindAssetsQuery`. The sample sends `phrase`, `page`, and `page_size`; add any app-specific filters
or license controls on the proxy side.

```kotlin highlight-android-build-search-uri
fun buildGettyImagesSearchUri(
    proxyBaseUrl: String,
    query: FindAssetsQuery,
): Uri = Uri.parse(proxyBaseUrl).buildUpon()
    .appendQueryParameter("phrase", query.query.orEmpty())
    .appendQueryParameter("page", (query.page + 1).toString())
    .appendQueryParameter("page_size", query.perPage.toString())
    .build()
```

The Android code sends `page + 1` because Getty Images expects one-based pages. Your proxy receives a one-based `page`
parameter from this client and should forward it unchanged to Getty Images.

### Load the Proxy Response

Load the JSON through your app's networking layer. The sample uses `HttpURLConnection` and also accepts a response provider so
the same source can be exercised without live Getty Images credentials.

```kotlin highlight-android-load-proxy-response
suspend fun loadGettyImagesResponse(
    uri: Uri,
    responseProvider: (suspend (Uri) -> JSONObject)? = null,
): JSONObject = responseProvider?.invoke(uri) ?: readGettyImagesJson(uri)

fun readGettyImagesJson(uri: Uri): JSONObject {
    val connection = URL(uri.toString()).openConnection() as HttpURLConnection
    return try {
        require(connection.responseCode in 200 until 300) {
            connection.errorStream?.bufferedReader()?.use { it.readText() }.orEmpty()
        }
        JSONObject(connection.inputStream.bufferedReader().use { it.readText() })
    } finally {
        connection.disconnect()
    }
}
```

`readGettyImagesJson()` accepts successful HTTP status codes, parses the response as JSON, and always disconnects the
connection.

## Parse Proxy Responses

### Build the Paginated Result

Translate the response-level count and image array into a `FindAssetsResult`. `nextPage` advances until the loaded result count
reaches Getty Images' reported total, or until Getty Images returns an empty page.

```kotlin highlight-android-response-pagination
fun toFindAssetsResult(
    response: JSONObject,
    requestedPage: Int,
    perPage: Int,
): FindAssetsResult {
    val images = response.optJSONArray("images")
    val total = response.optInt("result_count", -1)
    val loadedSoFar = (requestedPage + 1) * perPage
    val hasNextPage = images != null && images.length() > 0 && (total < 0 || loadedSoFar < total)
    val assets = if (images == null) {
        emptyList()
    } else {
        (0 until images.length()).map { index ->
            toGettyImagesAsset(images.getJSONObject(index))
        }
    }
    return FindAssetsResult(
        assets = assets,
        currentPage = requestedPage,
        nextPage = if (hasNextPage) requestedPage + 1 else -1,
        total = total,
    )
}
```

### Map Photos to Assets

Translate each Getty Images photo into CE.SDK's Android `Asset` model. The `meta` map carries the image URL and default block
creation hints that `defaultApplyAsset()` uses when the asset is inserted.

```kotlin highlight-android-response-asset
fun toGettyImagesAsset(photo: JSONObject): Asset = Asset(
    id = photo.getString("id"),
    context = AssetContext(sourceId = GettyImagesAssetSource.SOURCE_ID),
    label = photo.optString("title").takeIf { it.isNotBlank() },
    locale = "en",
    meta = toGettyImagesImageMeta(photo),
)

fun toGettyImagesImageMeta(photo: JSONObject): Map<String, String> {
    val sizes = getGettyImagesDisplaySizesByName(photo)
    val fullUri = sizes["comp"] ?: sizes["preview"] ?: sizes.values.firstOrNull().orEmpty()
    val thumbUri = sizes["thumb"] ?: sizes["preview"] ?: fullUri
    val maxDimensions = photo.optJSONObject("max_dimensions")
    return mapOf(
        "uri" to fullUri,
        "thumbUri" to thumbUri,
        "mimeType" to "image/jpeg",
        "blockType" to DesignBlockType.Graphic.key,
        "fillType" to FillType.Image.key,
        "shapeType" to ShapeType.Rect.key,
        "kind" to "image",
        "width" to maxDimensions?.optInt("width")?.takeIf { it > 0 }?.toString().orEmpty(),
        "height" to maxDimensions?.optInt("height")?.takeIf { it > 0 }?.toString().orEmpty(),
    )
}
```

The sample fills in these image defaults:

- `mimeType` defaults to `image/jpeg`.
- `blockType` defaults to `DesignBlockType.Graphic.key`.
- `fillType` defaults to `FillType.Image.key`.
- `shapeType` defaults to `ShapeType.Rect.key`.
- `kind` defaults to `image`.
- `context.sourceId` is set to the Getty Images source ID so CE.SDK can route apply calls back to the same source.

### Choose Getty Images Display Sizes

Index Getty Images' named `display_sizes` once so the asset mapping can select the most appropriate URLs.

```kotlin highlight-android-response-sizes
fun getGettyImagesDisplaySizesByName(photo: JSONObject): Map<String, String> {
    val displaySizes = photo.optJSONArray("display_sizes") ?: return emptyMap()
    return (0 until displaySizes.length())
        .mapNotNull { index ->
            val size = displaySizes.optJSONObject(index) ?: return@mapNotNull null
            val name = size.optString("name").takeIf { it.isNotBlank() } ?: return@mapNotNull null
            val uri = size.optString("uri").takeIf { it.isNotBlank() } ?: return@mapNotNull null
            name to uri
        }
        .toMap()
}
```

The sample prefers `comp` for the imported asset, with `preview` or the first available size as a fallback. It prefers `thumb`
for the asset library thumbnail.

## Create a Scene for Applying Assets

`engine.asset.applyAssetSourceAsset()` inserts the returned asset into the active scene. The sample creates a minimal scene and
page before querying Getty Images; in your app, you can use any active scene that already contains a page.

```kotlin highlight-android-scene-setup
val scene = engine.scene.create()
val page = engine.block.create(DesignBlockType.Page)
engine.block.setWidth(block = page, value = 800F)
engine.block.setHeight(block = page, value = 600F)
engine.block.appendChild(parent = scene, child = page)
```

## Query and Apply Images Programmatically

Register the source on an existing `Engine`, query it with `engine.asset.findAssets()`, and apply a returned asset with
`engine.asset.applyAssetSourceAsset()`.

```kotlin highlight-android-programmatic-register
val source = GettyImagesAssetSource(
    proxyBaseUrl = proxyBaseUrl,
    proxyResponseProvider = proxyResponseProvider,
)
if (source.sourceId !in engine.asset.findAllSources()) {
    engine.asset.addSource(source)
}
```

```kotlin highlight-android-query-and-apply
val results = engine.asset.findAssets(
    sourceId = GettyImagesAssetSource.SOURCE_ID,
    query = FindAssetsQuery(query = "architecture", page = 0, perPage = 12),
)
val firstBlock = results.assets.firstOrNull()?.let { asset ->
    engine.asset.applyAssetSourceAsset(
        sourceId = GettyImagesAssetSource.SOURCE_ID,
        asset = asset,
    )
}
return GettyImagesImportResult(total = results.total, firstBlock = firstBlock)
```

`applyAssetSourceAsset()` returns the created block when CE.SDK can materialize the asset. Check for `null` before positioning
or resizing the result.

## Add Getty Images to the Asset Library UI

To expose Getty Images in the CE.SDK editor UI, register the same `AssetSource` after the editor has loaded and add a section
for that source to the Images asset library. For a complete editor surface, see the
[Design Editor Starter Kit](../../starterkits/design-editor.md).

```kotlin highlight-android-editor-source-create
val gettyImagesAssetSource = remember(proxyBaseUrl) {
    GettyImagesAssetSource(proxyBaseUrl = proxyBaseUrl)
}
```

Register the source from `onLoaded` so the editor keeps its default scene creation behavior.

```kotlin highlight-android-editor-source-register
onLoaded = {
    val engine = editorContext.engine
    if (gettyImagesAssetSource.sourceId !in engine.asset.findAllSources()) {
        engine.asset.addSource(gettyImagesAssetSource)
    }
}
```

The asset library section points at the Getty Images source ID and expands into an image grid. The sample keeps the default
asset library tabs and only appends the Getty Images section to `LibraryCategory.Images`.

```kotlin highlight-android-asset-library-ui
assetLibrary = {
    remember {
        val gettyImagesSourceType = AssetSourceType(sourceId = gettyImagesAssetSource.sourceId)
        val gettyImagesSection = LibraryContent.Section(
            sourceTypes = listOf(gettyImagesSourceType),
            assetType = AssetType.Image,
            expandContent = LibraryContent.Grid(
                titleRes = R.string.ly_img_editor_asset_library_section_images,
                sourceType = gettyImagesSourceType,
                assetType = AssetType.Image,
                title = "Getty Images",
            ),
        )
        AssetLibrary.getDefault(
            images = LibraryCategory.Images.addSection(gettyImagesSection),
        )
    }
}
```

## Handle Licensing and Attribution

Getty Images content is premium content, not royalty-free stock media. Your integration should:

- Use Getty Images credentials and licensing terms that match your product.
- Keep credential handling and download/licensing actions on the proxy server.
- Preserve provider attribution through source-level `credits` and `license`.
- Preserve photographer or contributor attribution through per-asset `credits` when your proxy exposes it.
- Review Getty Images usage restrictions before enabling export or commercial workflows.

## Troubleshooting

- **Authentication errors:** Verify the API key and secret exist on the proxy server and are valid for the Getty Images API.
- **Network or proxy failures:** Allow the Android app's requests at the proxy layer and verify the device can reach the proxy URL.
- **Empty results:** Confirm the proxy returns Getty Images' `images` array and that each image includes usable `display_sizes`.
- **Pagination repeats or skips results:** Check the zero-based CE.SDK page to one-based Getty Images page conversion.
- **Images fail to insert:** Confirm the Getty Images response contains a `comp`, `preview`, or other `display_sizes` URL the device can load.

## API Reference

| Method                                                | Purpose                                                        |
| ----------------------------------------------------- | -------------------------------------------------------------- |
| `engine.asset.addSource(source=_)`                    | Register the Getty Images `AssetSource`.                       |
| `engine.asset.findAllSources()`                       | Check whether the source is already registered.                |
| `engine.asset.findAssets(sourceId=_, query=_)`        | Query Getty Images results through the registered source.       |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_)` | Insert a returned Getty Images asset into the current scene. |
| `AssetSource.findAssets(query=_)`                     | Implement the proxy-backed search callback for the source.      |
| `AssetSource.getGroups()`                             | Return optional source group filters, or `null` when none exist. |
| `engine.scene.create()`                               | Create the active scene used by the apply call.                 |
| `engine.block.create(blockType=_)`                    | Create the page used by the sample scene.                       |
| `engine.block.setWidth(block=_, value=_)`             | Set the sample page width.                                      |
| `engine.block.setHeight(block=_, value=_)`            | Set the sample page height.                                     |
| `engine.block.appendChild(parent=_, child=_)`         | Attach the page to the scene.                                   |
| `EditorConfiguration.remember(builder=_)`             | Configure the editor callbacks and asset library UI.            |
| `AssetLibrary.getDefault(images=_)`                   | Keep the default asset library and override the Images content. |
| `LibraryCategory.Images.addSection(section=_)`        | Add the Getty Images section to the Images asset library.       |
| `LibraryContent.Section(sourceTypes=_, assetType=_, expandContent=_)` | Define the Getty Images preview section.             |
| `LibraryContent.Grid(titleRes=_, sourceType=_, assetType=_, title=_)` | Expand the Getty Images section into an image grid.  |
| `AssetSourceType(sourceId=_)`                         | Connect the UI section to the Getty Images source ID.           |

## Related Types

| Type                     | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `AssetSource`            | Base class for custom Android asset providers.             |
| `FindAssetsQuery`        | Search text, paging, and filter data from CE.SDK.          |
| `FindAssetsResult`       | Paginated asset response returned to CE.SDK.               |
| `Asset`                  | One Getty Images result in CE.SDK's Android asset model.   |
| `AssetLibrary`           | Editor UI asset library configuration.                     |
| `LibraryContent.Section` | One section inside an asset library category.              |

## Next Steps

- [Customize Asset Library](../asset-library/customize.md) - Configure asset panels and UI
- [Basics](../asset-library/basics.md) — Explore the core functionality of the asset library and how users browse, search, and insert media.
- [Integrate Unsplash Images](./unsplash.md) - Add another stock image source
- [From Pexels](./pexels.md) — Connect CE.SDK to Pexels API to search, browse, and add royalty-free stock photos directly to designs.
- [Import Media Concepts](../concepts.md) - Learn core import concepts



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support