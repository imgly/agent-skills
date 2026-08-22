> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Asset Library](../asset-library.md) > [Refresh Assets](./refresh-assets.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-media-asset-library-refresh-assets/RefreshAssets.kt reference-only
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import kotlinx.coroutines.CoroutineStart
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.take
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.withTimeout
import kotlinx.coroutines.yield
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
import ly.img.engine.AssetSource
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.FindAssetsResult
import ly.img.engine.MimeType
import ly.img.engine.ShapeType

private const val EXTERNAL_IMAGE_SOURCE_ID = "my-external-images"

@Composable
fun RefreshAssetsEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    val externalSource = remember { createExternalImageAssetSource() }

    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onLoaded = {
                    val engine = editorContext.engine
                    if (externalSource.sourceId !in engine.asset.findAllSources()) {
                        engine.asset.addSource(externalSource)
                    }
                }

                assetLibrary = {
                    remember {
                        val externalSourceType = AssetSourceType(sourceId = EXTERNAL_IMAGE_SOURCE_ID)
                        val externalImagesSection = LibraryContent.Section(
                            sourceTypes = listOf(externalSourceType),
                            assetType = AssetType.Image,
                            expandContent = LibraryContent.Grid(
                                titleRes = R.string.ly_img_editor_asset_library_section_images,
                                sourceType = externalSourceType,
                                assetType = AssetType.Image,
                                title = "External images",
                            ),
                        )
                        AssetLibrary.getDefault(
                            images = LibraryCategory.Images.addSection(externalImagesSection),
                        )
                    }
                }
            }
        },
        onClose = onClose,
    )
}

suspend fun refreshAssets(
    engine: Engine,
    awaitEngineEvents: suspend () -> Unit = {},
): RefreshAssetsResult = coroutineScope {
    val externalSource = createExternalImageAssetSource()

    if (externalSource.sourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = externalSource.sourceId)
    }

    try {
        engine.asset.addSource(externalSource)
        // The smoke test pumps the offscreen engine so native asset events are delivered deterministically.
        awaitEngineEvents()

        val initialAssets = engine.asset.findAssets(
            sourceId = externalSource.sourceId,
            query = FindAssetsQuery(page = 0, perPage = 20),
        )
        check(initialAssets.total == 2)

        val sourceUpdates = engine.asset.onAssetSourceUpdated()
        val refreshEvents = async(start = CoroutineStart.UNDISPATCHED) {
            sourceUpdates
                .take(1)
                .toList()
        }
        // Give callbackFlow a turn to register the native subscription before the first smoke-test refresh.
        yield()

        externalSource.assets = externalSource.assets + listOf(
            externalImageAsset(
                id = "winter-lookbook",
                label = "Winter Lookbook",
                tags = listOf("lookbook", "winter"),
                uri = "https://img.ly/static/ubq_samples/sample_3.jpg",
            ),
        )
        engine.asset.assetSourceContentsChanged(sourceId = externalSource.sourceId)
        // Pump the offscreen smoke-test engine after each refresh notification.
        awaitEngineEvents()

        val afterUploadAssets = engine.asset.findAssets(
            sourceId = externalSource.sourceId,
            query = FindAssetsQuery(page = 0, perPage = 20),
        )

        externalSource.assets = externalSource.assets.map { asset ->
            if (asset.id == "spring-poster") {
                asset.copy(label = "Spring Launch Poster")
            } else {
                asset
            }
        }
        engine.asset.assetSourceContentsChanged(sourceId = externalSource.sourceId)
        // Pump the offscreen smoke-test engine after each refresh notification.
        awaitEngineEvents()

        val renamedAssetLabel = engine.asset.findAssets(
            sourceId = externalSource.sourceId,
            query = FindAssetsQuery(page = 0, perPage = 20),
        ).assets.firstOrNull { asset -> asset.id == "spring-poster" }?.label

        externalSource.assets = externalSource.assets.filterNot { asset ->
            asset.id == "winter-lookbook"
        }
        engine.asset.assetSourceContentsChanged(sourceId = externalSource.sourceId)
        // Pump the offscreen smoke-test engine after each refresh notification.
        awaitEngineEvents()

        val remainingAssetIds = engine.asset.findAssets(
            sourceId = externalSource.sourceId,
            query = FindAssetsQuery(page = 0, perPage = 20),
        ).assets.map { asset -> asset.id }

        val refreshEventSourceIds = awaitRefreshEvents(refreshEvents, awaitEngineEvents)

        RefreshAssetsResult(
            sourceId = externalSource.sourceId,
            initialTotal = initialAssets.total,
            afterUploadTotal = afterUploadAssets.total,
            renamedAssetLabel = renamedAssetLabel,
            remainingAssetIds = remainingAssetIds,
            refreshEventSourceIds = refreshEventSourceIds,
        )
    } finally {
        if (externalSource.sourceId in engine.asset.findAllSources()) {
            engine.asset.removeSource(sourceId = externalSource.sourceId)
        }
    }
}

private fun createExternalImageAssetSource() = ExternalImageAssetSource(
    initialAssets = listOf(
        externalImageAsset(
            id = "spring-poster",
            label = "Spring Poster",
            tags = listOf("poster", "spring"),
            uri = "https://img.ly/static/ubq_samples/sample_1.jpg",
        ),
        externalImageAsset(
            id = "summer-poster",
            label = "Summer Poster",
            tags = listOf("poster", "summer"),
            uri = "https://img.ly/static/ubq_samples/sample_2.jpg",
        ),
    ),
)

private fun externalImageAsset(
    id: String,
    label: String,
    tags: List<String>,
    uri: String,
) = Asset(
    id = id,
    context = AssetContext(sourceId = EXTERNAL_IMAGE_SOURCE_ID),
    label = label,
    locale = "en",
    tags = tags,
    groups = listOf("campaign-assets"),
    meta = mapOf(
        "uri" to uri,
        "thumbUri" to uri,
        "mimeType" to MimeType.JPEG.key,
        "kind" to "image",
        "blockType" to DesignBlockType.Graphic.key,
        "fillType" to FillType.Image.key,
        "shapeType" to ShapeType.Rect.key,
        "width" to "1080",
        "height" to "1080",
    ),
)

private class ExternalImageAssetSource(
    initialAssets: List<Asset>,
) : AssetSource(sourceId = EXTERNAL_IMAGE_SOURCE_ID) {
    var assets = initialAssets

    override val supportedMimeTypes = listOf(MimeType.JPEG.key)

    override suspend fun getGroups(): List<String>? = listOf("campaign-assets")

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = FindAssetsResult(
        assets = assets,
        currentPage = query.page,
        nextPage = -1,
        total = assets.size,
    )
}

private suspend fun awaitRefreshEvents(
    refreshEvents: Deferred<List<String>>,
    awaitEngineEvents: suspend () -> Unit,
): List<String> {
    // The offscreen smoke test drives engine updates manually until the native event flow emits a refresh signal.
    withTimeout(5_000) {
        while (!refreshEvents.isCompleted) {
            awaitEngineEvents()
            yield()
        }
    }
    return refreshEvents.await()
}
```

```kotlin file=@cesdk_android_examples/engine-guides-import-media-asset-library-refresh-assets/RefreshAssetsResult.kt reference-only
data class RefreshAssetsResult(
    val sourceId: String,
    val initialTotal: Int,
    val afterUploadTotal: Int,
    val renamedAssetLabel: String?,
    val remainingAssetIds: List<String>,
    val refreshEventSourceIds: List<String>,
)
```

Keep an open Android Editor asset library in sync after your app changes an external asset catalog.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260822/engine-guides-import-media-asset-library-refresh-assets)

<EngineReferenceNote {...props} />

When an external upload flow, backend job, or sync process changes a custom asset source, update the backing catalog and any cache first. Then call `engine.asset.assetSourceContentsChanged(sourceId=_)` with that source's exact ID.

After the engine starts, the Android Editor observes this notification automatically. If an open library category is currently showing a `LibraryContent.Grid` for that source, or `LibraryContent.Sections` containing that source, the Editor clears and re-queries the visible content in place. Users do not need to close and reopen the library.

This guide configures a custom `AssetSource` in the Editor, shows provider-neutral external upload, update, and delete examples, and keeps the engine update flow as an optional integration signal.

## When to Use Asset Refresh

The Editor's in-place response is automatic after the engine receives a source-change notification. Sending that notification is only necessary for changes that CE.SDK cannot observe directly.

**No manual notification** is needed for source operations that already notify the engine, such as CE.SDK-managed upload and delete handlers.

**Manual notification** is needed when another system changes the source data:

- An external upload component stores a new file and updates your app catalog.
- A backend process changes asset labels, tags, thumbnails, or metadata.
- A sync message tells the app that another user added or removed assets.
- A polling job detects that the source's remote version changed.

## Registering a Custom Asset Source

Start with a stable source ID. This is the same value you pass to `assetSourceContentsChanged(sourceId=_)` later.

```kotlin highlight-android-source-id
private const val EXTERNAL_IMAGE_SOURCE_ID = "my-external-images"
```

The sample uses a small helper to create image assets with metadata that CE.SDK can read from the source.

```kotlin highlight-android-asset-helper
private fun externalImageAsset(
    id: String,
    label: String,
    tags: List<String>,
    uri: String,
) = Asset(
    id = id,
    context = AssetContext(sourceId = EXTERNAL_IMAGE_SOURCE_ID),
    label = label,
    locale = "en",
    tags = tags,
    groups = listOf("campaign-assets"),
    meta = mapOf(
        "uri" to uri,
        "thumbUri" to uri,
        "mimeType" to MimeType.JPEG.key,
        "kind" to "image",
        "blockType" to DesignBlockType.Graphic.key,
        "fillType" to FillType.Image.key,
        "shapeType" to ShapeType.Rect.key,
        "width" to "1080",
        "height" to "1080",
    ),
)
```

Define a source whose `findAssets(query=_)` reads from your current catalog. The source can implement filtering, paging, and remote loading as needed; this guide keeps the source shape minimal so the refresh calls stay visible.

```kotlin highlight-android-custom-source
private class ExternalImageAssetSource(
    initialAssets: List<Asset>,
) : AssetSource(sourceId = EXTERNAL_IMAGE_SOURCE_ID) {
    var assets = initialAssets

    override val supportedMimeTypes = listOf(MimeType.JPEG.key)

    override suspend fun getGroups(): List<String>? = listOf("campaign-assets")

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = FindAssetsResult(
        assets = assets,
        currentPage = query.page,
        nextPage = -1,
        total = assets.size,
    )
}
```

The sample source keeps its catalog in memory so the refresh behavior is easy to verify. In production, `findAssets(query=_)` usually reads from your database, cache, or app repository.

Create the source instance with the initial assets. The engine-only helper used by the smoke test does this directly:

```kotlin highlight-android-create-source
val externalSource = createExternalImageAssetSource()
```

The engine-only helper registers that source directly before observing update signals:

```kotlin highlight-android-register-source
engine.asset.addSource(externalSource)
```

## Configure the Source in the Editor

Create one source instance, register it in `EditorConfiguration.onLoaded`, and add the same stable source ID to the asset-library configuration.

```kotlin highlight-android-editor-configuration
@Composable
fun RefreshAssetsEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    val externalSource = remember { createExternalImageAssetSource() }

    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onLoaded = {
                    val engine = editorContext.engine
                    if (externalSource.sourceId !in engine.asset.findAllSources()) {
                        engine.asset.addSource(externalSource)
                    }
                }

                assetLibrary = {
                    remember {
                        val externalSourceType = AssetSourceType(sourceId = EXTERNAL_IMAGE_SOURCE_ID)
                        val externalImagesSection = LibraryContent.Section(
                            sourceTypes = listOf(externalSourceType),
                            assetType = AssetType.Image,
                            expandContent = LibraryContent.Grid(
                                titleRes = R.string.ly_img_editor_asset_library_section_images,
                                sourceType = externalSourceType,
                                assetType = AssetType.Image,
                                title = "External images",
                            ),
                        )
                        AssetLibrary.getDefault(
                            images = LibraryCategory.Images.addSection(externalImagesSection),
                        )
                    }
                }
            }
        },
        onClose = onClose,
    )
}
```

`onLoaded` runs with a started engine, so the custom source can be registered through `editorContext.engine`. The `AssetSourceType` used by both the section and its expanded grid has the same `EXTERNAL_IMAGE_SOURCE_ID` as the source itself and as every later refresh call.

When the Images category is open at its sections view, a change to this source refreshes those visible sections. When the external-images grid is open, the same notification refreshes that grid in place.

## Refresh Scope

The Editor refreshes narrowly to avoid unnecessary source queries:

- Only active, open library categories are eligible for immediate refresh.
- Only the currently displayed grid or sections are checked.
- A grid refreshes only when its source ID exactly matches the emitted ID.
- Sections refresh when at least one displayed section references the emitted source ID.
- Content showing unrelated source IDs and inactive or closed content is not immediately re-queried.

Closed content reads the current source data through its normal query path when the user opens it later. No close-and-reopen workaround is needed for content that is already visible and references the changed source.

## Observe the Engine Signal (Optional)

`onAssetSourceUpdated()` returns a `Flow<String>` of updated source IDs. The Editor already collects this flow for its asset library, so applications do not need a second collector to enable UI refresh. Collect it from an app-owned coroutine scope only when other application state also needs to react.

Multiple refreshes for the same source can be coalesced before the next engine update. Treat each event as a signal that the source changed rather than as a receipt for one specific call.

```kotlin highlight-android-observe-refresh
val sourceUpdates = engine.asset.onAssetSourceUpdated()
```

## Refreshing After External Uploads

The next snippets mutate the sample's in-memory catalog directly. In production, replace those assignments with the upload, database, cache, or sync operation that changes your source data.

When an upload completes outside CE.SDK, make the uploaded file and its catalog entry available, update or invalidate the cache used by `findAssets(query=_)`, and then call `assetSourceContentsChanged(sourceId=_)` once for the affected source.

```kotlin highlight-android-refresh-upload
externalSource.assets = externalSource.assets + listOf(
    externalImageAsset(
        id = "winter-lookbook",
        label = "Winter Lookbook",
        tags = listOf("lookbook", "winter"),
        uri = "https://img.ly/static/ubq_samples/sample_3.jpg",
    ),
)
engine.asset.assetSourceContentsChanged(sourceId = externalSource.sourceId)
```

If the source is visible in the Editor, the notification causes an immediate in-place query. Calling it before the external write or cache update finishes can therefore reload stale data.

## Refreshing After External Modifications

Use the same ordering after changing asset metadata such as labels, tags, thumbnails, or dimensions: update the backing catalog and cache first, then notify the exact source ID.

```kotlin highlight-android-refresh-modification
externalSource.assets = externalSource.assets.map { asset ->
    if (asset.id == "spring-poster") {
        asset.copy(label = "Spring Launch Poster")
    } else {
        asset
    }
}
engine.asset.assetSourceContentsChanged(sourceId = externalSource.sourceId)
```

Batch related metadata changes together when possible, then call `assetSourceContentsChanged(sourceId=_)` once after the batch completes.

## Refreshing After External Deletions

After removing an asset from your external catalog and cache, notify CE.SDK so the visible library query removes the stale entry in place.

```kotlin highlight-android-refresh-deletion
externalSource.assets = externalSource.assets.filterNot { asset ->
    asset.id == "winter-lookbook"
}
engine.asset.assetSourceContentsChanged(sourceId = externalSource.sourceId)
```

This prevents users from selecting an asset that your backend or app repository no longer serves.

## Integration Patterns

Use the refresh call at the boundary where your app knows the external catalog changed:

| Pattern | When to Refresh |
| --- | --- |
| Upload callback | After the uploaded file, catalog entry, and cache update are complete |
| Backend sync | After applying the confirmed add, update, or delete to local backing data |
| Polling | After a version check detects a change and the local cache is updated |
| Batch import | Once after all imported assets and metadata have been written |

Avoid refreshing after every item in a large batch. One notification after the batch gives observers a single source update instead of forcing repeated queries.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Visible assets do not update | The notification ID differs from the ID in the displayed `AssetSourceType` | Use the exact same stable source ID for registration, library content, assets, and notification |
| No immediate library query occurs | The category is closed or inactive, or its currently displayed content references another source | This is expected; only visible active content referencing the changed source refreshes immediately |
| Query still returns old data | The external operation or cache update had not finished when the notification was sent | Update the backing catalog and cache before calling `assetSourceContentsChanged(sourceId=_)` |
| Source still returns stale assets | `findAssets(query=_)` serves a cache that was not invalidated | Invalidate or update that cache before sending the notification |
| Refresh throws | The source is not registered anymore | Confirm the source exists with `findAllSources()` before refreshing optional sources |

## Key Types

| Type | Purpose |
| --- | --- |
| `AssetSource` | Base class for a custom Android asset source |
| `EditorConfiguration` | Registers the source after engine start and configures Editor behavior |
| `AssetLibrary` | Defines the categories shown in the Editor asset library |
| `AssetSourceType` | Connects displayed library content to an exact engine source ID |
| `LibraryContent` | Defines the grid or sections that can be refreshed in place |
| `Asset` | Asset result returned from `findAssets(query=_)` |
| `FindAssetsQuery` | Search, paging, tag, and group filters for a source query |
| `FindAssetsResult` | Paged result returned by a source query |

## API Reference

| Method | Description |
| --- | --- |
| `EditorConfiguration.onLoaded` | Register a custom source after the Editor engine starts |
| `engine.asset.addSource(source=_)` | Register a custom asset source |
| `AssetSource.findAssets(query=_)` | Return the current assets for a query |
| `AssetSource.getGroups()` | Return the groups exposed by the source |
| `engine.asset.findAllSources()` | List registered source IDs before optional refresh or cleanup |
| `engine.asset.onAssetSourceUpdated()` | Optionally observe source IDs emitted by refresh notifications |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notify CE.SDK after a source's backing data and cache have changed |

## Next Steps

- [Assets](../../concepts/assets.md) — Understand the asset system, custom sources, and source events.
- [From Unsplash](../from-remote-source/unsplash.md) — See a complete custom source backed by remote data.
- [Customize Asset Library](./customize.md) — Configure which asset sources appear in the editor UI.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support