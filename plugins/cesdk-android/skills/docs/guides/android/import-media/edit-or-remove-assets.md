> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Edit or Remove Assets](./edit-or-remove-assets.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-media-edit-or-remove-assets/EditOrRemoveAssets.kt reference-only
import android.net.Uri
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancelAndJoin
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import ly.img.editor.defaultBaseUri
import ly.img.engine.AssetDefinition
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.MimeType
import ly.img.engine.ShapeType

private const val TAG = "EditOrRemoveAssets"

suspend fun editOrRemoveAssets(
    engine: Engine,
    assetBaseUri: Uri = defaultBaseUri,
): EditOrRemoveAssetsResult = coroutineScope {
    val sourceId = "my-local-images"
    val temporarySourceId = "temporary-session-images"
    val assetSourceLifecycleScope = this
    val sourceObserverJob = observeAssetSourceUpdates(
        engine = engine,
        sourceId = sourceId,
        assetSourceLifecycleScope = assetSourceLifecycleScope,
    )

    try {
        listOf(sourceId, temporarySourceId).forEach { staleSourceId ->
            if (staleSourceId in engine.asset.findAllSources()) {
                engine.asset.removeSource(sourceId = staleSourceId)
            }
        }

        engine.asset.addLocalSource(
            sourceId = sourceId,
            supportedMimeTypes = listOf(MimeType.JPEG.key, MimeType.PNG.key),
        )

        val logoUri = assetBaseUri.buildUpon()
            .appendPath("ly.img.image")
            .appendPath("images")
            .appendPath("sample_1.jpg")
            .build()
        val logoThumbnailUri = assetBaseUri.buildUpon()
            .appendPath("ly.img.image")
            .appendPath("thumbnails")
            .appendPath("sample_1.jpg")
            .build()
        val backgroundUri = assetBaseUri.buildUpon()
            .appendPath("ly.img.image")
            .appendPath("images")
            .appendPath("sample_4.jpg")
            .build()
        val backgroundThumbnailUri = assetBaseUri.buildUpon()
            .appendPath("ly.img.image")
            .appendPath("thumbnails")
            .appendPath("sample_4.jpg")
            .build()

        val logoAsset = AssetDefinition(
            id = "brand-logo",
            label = mapOf("en" to "Brand Logo"),
            tags = mapOf("en" to listOf("logo", "brand")),
            groups = listOf("brand"),
            meta = mapOf(
                "uri" to logoUri.toString(),
                "thumbUri" to logoThumbnailUri.toString(),
                "mimeType" to MimeType.JPEG.key,
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1080",
                "height" to "720",
            ),
        )
        val backgroundAsset = AssetDefinition(
            id = "campaign-background",
            label = mapOf("en" to "Campaign Background"),
            tags = mapOf("en" to listOf("campaign", "background")),
            groups = listOf("campaign"),
            meta = mapOf(
                "uri" to backgroundUri.toString(),
                "thumbUri" to backgroundThumbnailUri.toString(),
                "mimeType" to MimeType.JPEG.key,
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1080",
                "height" to "1440",
            ),
        )

        engine.asset.addAsset(sourceId = sourceId, asset = logoAsset)
        engine.asset.addAsset(sourceId = sourceId, asset = backgroundAsset)

        val queryResult = engine.asset.findAssets(
            sourceId = sourceId,
            query = FindAssetsQuery(
                page = 0,
                perPage = 100,
                query = "logo",
                locale = "en",
            ),
        )
        val assetToEdit = queryResult.assets.firstOrNull { asset -> asset.id == "brand-logo" }
            ?: error("Expected brand-logo in $sourceId.")

        val initialAssetIds = engine.asset.findAssets(
            sourceId = sourceId,
            query = FindAssetsQuery(page = 0, perPage = 100),
        ).assets.map { asset -> asset.id }

        val updatedLogoAsset = logoAsset.copy(
            label = mapOf("en" to "Primary Brand Logo"),
            tags = mapOf("en" to listOf("logo", "brand", "primary")),
        )

        engine.asset.removeAsset(sourceId = sourceId, assetId = assetToEdit.id)
        engine.asset.addAsset(sourceId = sourceId, asset = updatedLogoAsset)

        val updatedAsset = engine.asset.findAssets(
            sourceId = sourceId,
            query = FindAssetsQuery(page = 0, perPage = 10, query = "primary", locale = "en"),
        ).assets.firstOrNull { asset -> asset.id == updatedLogoAsset.id }
            ?: error("Expected updated logo asset in $sourceId.")

        engine.asset.removeAsset(
            sourceId = sourceId,
            assetId = "campaign-background",
        )

        val remainingAssetIds = engine.asset.findAssets(
            sourceId = sourceId,
            query = FindAssetsQuery(page = 0, perPage = 100),
        ).assets.map { asset -> asset.id }

        engine.asset.addLocalSource(
            sourceId = temporarySourceId,
            supportedMimeTypes = listOf(MimeType.JPEG.key),
        )

        // Use this after changing backing data outside addAsset/removeAsset.
        engine.asset.assetSourceContentsChanged(sourceId = temporarySourceId)

        engine.asset.removeSource(sourceId = temporarySourceId)

        val temporarySourceExistsAfterRemoval = temporarySourceId in engine.asset.findAllSources()
        val removedAssetWasPresent = remainingAssetIds.contains("campaign-background")

        engine.asset.removeSource(sourceId = sourceId)
        val managedSourcesCleanedUp = listOf(sourceId, temporarySourceId).none { managedSourceId ->
            managedSourceId in engine.asset.findAllSources()
        }

        EditOrRemoveAssetsResult(
            queriedAssetId = assetToEdit.id,
            initialAssetIds = initialAssetIds,
            updatedLabel = updatedAsset.label,
            remainingAssetIds = remainingAssetIds,
            removedAssetWasPresent = removedAssetWasPresent,
            temporarySourceExistsAfterRemoval = temporarySourceExistsAfterRemoval,
            managedSourcesCleanedUp = managedSourcesCleanedUp,
        )
    } finally {
        listOf(sourceId, temporarySourceId).forEach { managedSourceId ->
            if (managedSourceId in engine.asset.findAllSources()) {
                engine.asset.removeSource(sourceId = managedSourceId)
            }
        }
        sourceObserverJob.cancelAndJoin()
    }
}

fun observeAssetSourceUpdates(
    engine: Engine,
    sourceId: String,
    assetSourceLifecycleScope: CoroutineScope,
): Job {
    return engine.asset.onAssetSourceUpdated()
        .onEach { updatedSourceId ->
            if (updatedSourceId == sourceId) {
                Log.i(TAG, "Asset source updated: $updatedSourceId")
            }
        }
        .launchIn(assetSourceLifecycleScope)
}
```

```kotlin file=@cesdk_android_examples/engine-guides-import-media-edit-or-remove-assets/EditOrRemoveAssetsResult.kt reference-only
data class EditOrRemoveAssetsResult(
    val queriedAssetId: String,
    val initialAssetIds: List<String>,
    val updatedLabel: String?,
    val remainingAssetIds: List<String>,
    val removedAssetWasPresent: Boolean,
    val temporarySourceExistsAfterRemoval: Boolean,
    val managedSourcesCleanedUp: Boolean,
)
```

Manage assets in Android local asset sources by updating metadata, removing individual assets, or deleting entire sources.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/engine-guides-import-media-edit-or-remove-assets)

<EngineReferenceNote {...props} />

Assets in local sources can change after users import or generate media. CE.SDK lets you query those assets, replace their metadata by removing and re-adding them, remove stale entries, and notify subscribers when a source changes.

This guide assumes your app already owns a populated local asset source. For the source setup pattern, see [Import Local Asset](./from-local-source/local-asset.md). Creating upload UI and remote source backends are separate topics.

## Finding Assets in a Source

Use `engine.asset.findAssets()` before editing or removing an item. Android query pages are zero-based, and `locale` controls which localized labels and tags are searched.

```kotlin highlight-android-find-assets
val queryResult = engine.asset.findAssets(
    sourceId = sourceId,
    query = FindAssetsQuery(
        page = 0,
        perPage = 100,
        query = "logo",
        locale = "en",
    ),
)
val assetToEdit = queryResult.assets.firstOrNull { asset -> asset.id == "brand-logo" }
    ?: error("Expected brand-logo in $sourceId.")
```

The returned `FindAssetsResult` includes the matching `assets`, the `total` count, the requested `currentPage`, and `nextPage` when another page is available.

## Updating Asset Metadata

Android local sources do not expose a direct update method. Remove the existing asset, then add an updated `AssetDefinition` with the same ID.

```kotlin highlight-android-update-metadata
        val updatedLogoAsset = logoAsset.copy(
            label = mapOf("en" to "Primary Brand Logo"),
            tags = mapOf("en" to listOf("logo", "brand", "primary")),
        )

        engine.asset.removeAsset(sourceId = sourceId, assetId = assetToEdit.id)
        engine.asset.addAsset(sourceId = sourceId, asset = updatedLogoAsset)
```

Reusing the ID keeps your app-level references stable while changing the label, tags, URI, thumbnail, or other metadata stored in the source.

## Removing an Asset From a Source

Remove a single entry with `engine.asset.removeAsset()`. This deletes the asset from the source catalog, but it does not delete blocks that were already created from that asset.

```kotlin highlight-android-remove-asset
engine.asset.removeAsset(
    sourceId = sourceId,
    assetId = "campaign-background",
)
```

Use this for user-driven deletion, cleanup of temporary imports, or removing outdated generated assets from a local collection.

## Notifying After Out-of-Band Changes

Calls to `engine.asset.addAsset()` and `engine.asset.removeAsset()` already notify source subscribers. Call `engine.asset.assetSourceContentsChanged()` only after your app changes source backing data outside the local asset API, so asset-library UI and other subscribers know to re-query the source.

```kotlin highlight-android-notify-source
// Use this after changing backing data outside addAsset/removeAsset.
engine.asset.assetSourceContentsChanged(sourceId = temporarySourceId)
```

When you change several backing files or metadata records outside CE.SDK, call it once after the batch instead of once per item.

## Removing an Entire Asset Source

Remove a complete source with `engine.asset.removeSource()`. This removes the source registration and all assets stored in that local source.

```kotlin highlight-android-remove-source
engine.asset.removeSource(sourceId = temporarySourceId)
```

Use this when a temporary session ends or when your app deletes an entire user-managed asset category. If you need to create and populate local sources first, follow the source setup in [Import Local Asset](./from-local-source/local-asset.md).

## Listening to Asset Source Events

The asset API exposes `Flow<String>` streams for source additions, removals, and content updates. Collect these flows in the lifecycle scope that owns your asset library UI or background workflow, then cancel the returned `Job` when that owner is disposed.

```kotlin highlight-android-source-events
return engine.asset.onAssetSourceUpdated()
    .onEach { updatedSourceId ->
        if (updatedSourceId == sourceId) {
            Log.i(TAG, "Asset source updated: $updatedSourceId")
        }
    }
    .launchIn(assetSourceLifecycleScope)
```

Use the same pattern with `onAssetSourceAdded()` or `onAssetSourceRemoved()` when you need to react to source registration or cleanup events.

## Best Practices

- **Query before mutating**: Use `findAssets()` to verify the asset ID before removing or replacing it.
- **Notify only for out-of-band changes**: `addAsset()` and `removeAsset()` already notify subscribers; reserve `assetSourceContentsChanged()` for backing data changes made outside those APIs.
- **Scope event subscriptions**: Collect source event flows in the owning lifecycle scope and cancel the job when that owner is disposed.
- **Use source-specific IDs**: Keep persistent, temporary, and generated sources clearly separated.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Asset not found | The ID, query, locale, tags, or groups do not match the source contents | Query the source with a wider `FindAssetsQuery` before mutating |
| Source updates are not visible | Subscribers have not been notified after an external or batched backing-data change | Call `assetSourceContentsChanged(sourceId=_)` after the external mutation completes |
| Cannot remove assets | The source is not a local source or the custom source does not implement removal support | Manage assets through a local source or implement removal behavior on the custom `AssetSource` |
| Source remains available | Cleanup only removed individual assets | Call `removeSource(sourceId=_)` when the whole catalog should disappear |

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addAsset(sourceId=_, asset=_)` | Re-add an updated `AssetDefinition` to a local source |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query assets from a source with paging, search, locale, tags, and groups |
| `engine.asset.removeAsset(sourceId=_, assetId=_)` | Remove one asset from a local source |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notify subscribers after backing data changes outside local asset API calls |
| `engine.asset.removeSource(sourceId=_)` | Remove an entire asset source and its local assets |
| `engine.asset.onAssetSourceAdded()` | Observe source registration events |
| `engine.asset.onAssetSourceUpdated()` | Observe source content update events |
| `engine.asset.onAssetSourceRemoved()` | Observe source removal events |

## Next Steps

- [Import Local Asset](./from-local-source/local-asset.md) - Import files directly from the user's device and insert them into the design canvas.
- [From User Upload](./from-local-source/user-upload.md) — Enable file picker uploads from end users for use in the editor.
- [Customize](./asset-library/customize.md) - Adapt the asset library UI and behavior to suit your application's structure and user needs.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support