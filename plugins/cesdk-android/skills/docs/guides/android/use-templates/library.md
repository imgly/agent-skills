> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Template Library](./library.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-use-templates-library/TemplateLibrary.kt reference-only
import android.net.Uri
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import ly.img.engine.AssetDefinition
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FindAssetsQuery

suspend fun templateLibrary(
    engine: Engine,
    monitoringScope: CoroutineScope,
    assetBaseUri: Uri,
): TemplateLibraryResult = coroutineScope {
    val templateSourceId = "my.custom.templates"
    val hostedSourceId = "ly.img.templates"

    listOf(templateSourceId, hostedSourceId).forEach { sourceId ->
        if (sourceId in engine.asset.findAllSources()) {
            engine.asset.removeSource(sourceId = sourceId)
        }
    }

    val observedAddedSourceIds = mutableListOf<String>()
    val observedRemovedSourceIds = mutableListOf<String>()
    val sourceMonitorJobs = monitorTemplateSources(
        engine = engine,
        monitoringScope = monitoringScope,
        observedAddedSourceIds = observedAddedSourceIds,
        observedRemovedSourceIds = observedRemovedSourceIds,
    )

    // Create the design scene that selected templates will be applied to.
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    engine.asset.addLocalSource(
        sourceId = templateSourceId,
        supportedMimeTypes = emptyList(),
        applyAsset = { asset ->
            val templateUri = asset.meta?.get("uri")?.let(Uri::parse) ?: return@addLocalSource null
            engine.scene.applyTemplate(templateUri = templateUri)
            null
        },
    )

    val businessCardTemplateUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("templates")
        .appendPath("cesdk_business_card_1.scene")
        .build()
    val businessCardThumbnailUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("thumbnails")
        .appendPath("cesdk_business_card_1.jpg")
        .build()
    val blankTemplateUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("templates")
        .appendPath("cesdk_blank_1.scene")
        .build()
    val blankThumbnailUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("thumbnails")
        .appendPath("cesdk_blank_1.png")
        .build()

    val templates = listOf(
        AssetDefinition(
            id = "business-card",
            label = mapOf("en" to "Business Card"),
            tags = mapOf("en" to listOf("business", "card")),
            groups = listOf("business"),
            meta = mapOf(
                "uri" to businessCardTemplateUri.toString(),
                "thumbUri" to businessCardThumbnailUri.toString(),
            ),
        ),
        AssetDefinition(
            id = "blank-canvas",
            label = mapOf("en" to "Blank Canvas"),
            tags = mapOf("en" to listOf("blank", "canvas")),
            groups = listOf("basics"),
            meta = mapOf(
                "uri" to blankTemplateUri.toString(),
                "thumbUri" to blankThumbnailUri.toString(),
            ),
        ),
    )

    templates.forEach { template ->
        engine.asset.addAsset(sourceId = templateSourceId, asset = template)
    }
    engine.asset.assetSourceContentsChanged(sourceId = templateSourceId)

    val blankTemplate = engine.asset.fetchAsset(
        sourceId = templateSourceId,
        assetId = "blank-canvas",
    ) ?: error("Expected the blank template asset to be registered.")

    val createdBlock = engine.asset.applyAssetSourceAsset(
        sourceId = templateSourceId,
        asset = blankTemplate,
    )
    check(createdBlock == null)

    val contentJsonUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("content.json")
        .build()
    val loadedHostedSourceId = engine.asset.addLocalSourceFromJSON(
        contentUri = contentJsonUri,
        matcher = null,
    )

    val businessTemplates = engine.asset.findAssets(
        sourceId = templateSourceId,
        query = FindAssetsQuery(page = 0, perPage = 20, groups = listOf("business")),
    )
    val allTemplates = engine.asset.findAssets(
        sourceId = templateSourceId,
        query = FindAssetsQuery(page = 0, perPage = 20),
    )
    val groups = engine.asset.getGroups(sourceId = templateSourceId).orEmpty()

    val registeredSources = engine.asset.findAllSources()
    check(templateSourceId in registeredSources)
    check(loadedHostedSourceId in registeredSources)

    engine.asset.removeSource(sourceId = loadedHostedSourceId)

    val result = TemplateLibraryResult(
        templateSourceRegistered = templateSourceId in engine.asset.findAllSources(),
        businessTemplateIds = businessTemplates.assets.map { asset -> asset.id },
        allTemplateCount = allTemplates.total,
        groups = groups,
        hostedSourceId = loadedHostedSourceId,
        hostedSourceRemoved = loadedHostedSourceId !in engine.asset.findAllSources(),
        observedAddedSourceIds = observedAddedSourceIds,
        observedRemovedSourceIds = observedRemovedSourceIds,
        sourceMonitorJobs = sourceMonitorJobs,
        pageCountAfterApply = engine.block.findByType(DesignBlockType.Page).size,
    )
    result
}

fun monitorTemplateSources(
    engine: Engine,
    monitoringScope: CoroutineScope,
    observedAddedSourceIds: MutableList<String>,
    observedRemovedSourceIds: MutableList<String>,
): List<Job> {
    val addedJob = monitoringScope.launch(Dispatchers.Main.immediate) {
        engine.asset.onAssetSourceAdded().collect { sourceId ->
            observedAddedSourceIds += sourceId
        }
    }
    val removedJob = monitoringScope.launch(Dispatchers.Main.immediate) {
        engine.asset.onAssetSourceRemoved().collect { sourceId ->
            observedRemovedSourceIds += sourceId
        }
    }
    return listOf(addedJob, removedJob)
}
```

```kotlin file=@cesdk_android_examples/engine-guides-use-templates-library/TemplateLibraryResult.kt reference-only
import kotlinx.coroutines.Job

data class TemplateLibraryResult(
    val templateSourceRegistered: Boolean,
    val businessTemplateIds: List<String>,
    val allTemplateCount: Int,
    val groups: List<String>,
    val hostedSourceId: String,
    val hostedSourceRemoved: Boolean,
    val observedAddedSourceIds: List<String>,
    val observedRemovedSourceIds: List<String>,
    val sourceMonitorJobs: List<Job>,
    val pageCountAfterApply: Int,
)
```

Configure and populate a Template Library with the Android Engine API so your app can offer predefined design templates that users browse, select, and apply to the current scene.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260830/engine-guides-use-templates-library)

<EngineReferenceNote {...props} />

Templates are pre-designed scenes stored as assets within an asset source. Each template asset keeps the URI of its `.scene` file in `meta.uri`, and the source's apply callback loads that scene when the template is selected. This makes template sources different from image or sticker sources: applying a template updates the current scene instead of creating one block.

This guide covers creating a custom template source, registering template assets, loading a hosted JSON catalog, querying templates, and managing template sources.

## Setup

Create a design scene before applying templates. Applying a template keeps the current scene's design unit and page dimensions, fitting the template content into that target scene.

```kotlin highlight-android-setup
// Create the design scene that selected templates will be applied to.
val scene = engine.scene.create()
val page = engine.block.create(DesignBlockType.Page)
engine.block.setWidth(page, value = 800F)
engine.block.setHeight(page, value = 600F)
engine.block.appendChild(parent = scene, child = page)
```

## Creating Custom Template Sources

Register a local source with `engine.asset.addLocalSource()`. The `applyAsset` callback reads the selected asset's `meta.uri` value and applies that `.scene` file with `engine.scene.applyTemplate(templateUri=_)`. Return `null` because template application mutates the current scene instead of creating a new block.

```kotlin highlight-android-create-source
engine.asset.addLocalSource(
    sourceId = templateSourceId,
    supportedMimeTypes = emptyList(),
    applyAsset = { asset ->
        val templateUri = asset.meta?.get("uri")?.let(Uri::parse) ?: return@addLocalSource null
        engine.scene.applyTemplate(templateUri = templateUri)
        null
    },
)
```

Add template assets with `engine.asset.addAsset()`. Each asset needs a stable `id`, a localized `label`, and metadata for the `.scene` file plus the preview thumbnail. Use the same base URI that your Android integration uses for hosted or bundled assets.

```kotlin highlight-android-add-assets
    val businessCardTemplateUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("templates")
        .appendPath("cesdk_business_card_1.scene")
        .build()
    val businessCardThumbnailUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("thumbnails")
        .appendPath("cesdk_business_card_1.jpg")
        .build()
    val blankTemplateUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("templates")
        .appendPath("cesdk_blank_1.scene")
        .build()
    val blankThumbnailUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("thumbnails")
        .appendPath("cesdk_blank_1.png")
        .build()

    val templates = listOf(
        AssetDefinition(
            id = "business-card",
            label = mapOf("en" to "Business Card"),
            tags = mapOf("en" to listOf("business", "card")),
            groups = listOf("business"),
            meta = mapOf(
                "uri" to businessCardTemplateUri.toString(),
                "thumbUri" to businessCardThumbnailUri.toString(),
            ),
        ),
        AssetDefinition(
            id = "blank-canvas",
            label = mapOf("en" to "Blank Canvas"),
            tags = mapOf("en" to listOf("blank", "canvas")),
            groups = listOf("basics"),
            meta = mapOf(
                "uri" to blankTemplateUri.toString(),
                "thumbUri" to blankThumbnailUri.toString(),
            ),
        ),
    )

    templates.forEach { template ->
        engine.asset.addAsset(sourceId = templateSourceId, asset = template)
    }
    engine.asset.assetSourceContentsChanged(sourceId = templateSourceId)
```

Each template asset uses:

- `id` - Unique identifier for the template.
- `label` - Localized display name.
- `tags` - Localized search terms.
- `groups` - Categories used for filtering.
- `meta.uri` - URI of the `.scene` file loaded by the apply callback.
- `meta.thumbUri` - Thumbnail URI shown by clients that render the source.

When a UI or custom picker selects a template, pass the asset to `engine.asset.applyAssetSourceAsset()`. CE.SDK invokes the source's callback and applies the template to the active scene.

```kotlin highlight-android-apply-template
val createdBlock = engine.asset.applyAssetSourceAsset(
    sourceId = templateSourceId,
    asset = blankTemplate,
)
```

## From Remote URI

For production catalogs, keep template metadata in a hosted `content.json` file and register it with `engine.asset.addLocalSourceFromJSON()`. Android catalogs resolve `{{base_url}}` placeholders, not arbitrary relative URLs: for a catalog at `<base>/<source-id>/content.json`, CE.SDK replaces `{{base_url}}` with `<base>/`, so template and thumbnail entries should include the source folder, such as `{{base_url}}/<source-id>/templates/template.scene`.

```kotlin highlight-android-load-json-source
val contentJsonUri = assetBaseUri.buildUpon()
    .appendPath("ly.img.templates")
    .appendPath("content.json")
    .build()
val loadedHostedSourceId = engine.asset.addLocalSourceFromJSON(
    contentUri = contentJsonUri,
    matcher = null,
)
```

Use `addLocalSource()` plus `addAsset()` when the source needs custom template application behavior. Use `addLocalSourceFromJSON()` when you want to register the catalog metadata from a remote JSON file.

## Querying Templates Programmatically

Search a source with `engine.asset.findAssets()`. Filter by `groups`, search free text with `query`, and page through results with `page` and `perPage`. Read groups with `engine.asset.getGroups()` when your UI needs to build filters from the registered source.

```kotlin highlight-android-query-templates
val businessTemplates = engine.asset.findAssets(
    sourceId = templateSourceId,
    query = FindAssetsQuery(page = 0, perPage = 20, groups = listOf("business")),
)
val allTemplates = engine.asset.findAssets(
    sourceId = templateSourceId,
    query = FindAssetsQuery(page = 0, perPage = 20),
)
val groups = engine.asset.getGroups(sourceId = templateSourceId).orEmpty()
```

The returned `FindAssetsResult` exposes the matching `assets`, the `currentPage`, the `nextPage` (`-1` when there is no further page), and the `total` count across all pages.

## Managing Template Sources

List sources with `engine.asset.findAllSources()` and remove a source with `engine.asset.removeSource()`. This is useful when your app swaps template catalogs for a different workspace, brand, or user role.

```kotlin highlight-android-manage-sources
    val registeredSources = engine.asset.findAllSources()
    check(templateSourceId in registeredSources)
    check(loadedHostedSourceId in registeredSources)

    engine.asset.removeSource(sourceId = loadedHostedSourceId)
```

Subscribe to source lifecycle events when your app needs to refresh a picker or cache after a catalog changes. Launch the collectors on the main dispatcher before adding or removing sources, and cancel the returned jobs with the scope that owns the observer.

```kotlin highlight-android-monitor-sources
fun monitorTemplateSources(
    engine: Engine,
    monitoringScope: CoroutineScope,
    observedAddedSourceIds: MutableList<String>,
    observedRemovedSourceIds: MutableList<String>,
): List<Job> {
    val addedJob = monitoringScope.launch(Dispatchers.Main.immediate) {
        engine.asset.onAssetSourceAdded().collect { sourceId ->
            observedAddedSourceIds += sourceId
        }
    }
    val removedJob = monitoringScope.launch(Dispatchers.Main.immediate) {
        engine.asset.onAssetSourceRemoved().collect { sourceId ->
            observedRemovedSourceIds += sourceId
        }
    }
    return listOf(addedJob, removedJob)
}
```

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Templates do not appear | The source ID is not registered or the catalog has no matching assets | Confirm the ID with `findAllSources()` and query the source with `findAssets()` |
| Template selection does nothing | The source was loaded without an apply callback | Use `addLocalSource()` with `applyAsset` for sources that should apply templates |
| Template fails to load | The asset is missing a valid `.scene` URI in `meta.uri` | Store a reachable `.scene` URI for this `applyTemplate(templateUri=_)` path |
| Thumbnails do not load | `meta.thumbUri` is missing or unreachable | Store a reachable thumbnail URI next to each template asset |

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.create()` | Create the scene that templates are applied to |
| `engine.block.create(blockType=_)` | Create the page used by the setup scene |
| `engine.block.setWidth(block=_, value=_)` | Set the setup page width |
| `engine.block.setHeight(block=_, value=_)` | Set the setup page height |
| `engine.block.appendChild(parent=_, child=_)` | Add the page to the scene |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_, applyAsset=_)` | Register a local template source with custom selection behavior |
| `engine.scene.applyTemplate(templateUri=_)` | Apply a `.scene` template URI to the current scene |
| `engine.asset.addAsset(sourceId=_, asset=_)` | Add a template definition to a local source |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notify listeners that a source's assets changed |
| `engine.asset.fetchAsset(sourceId=_, assetId=_)` | Fetch one template asset from a source |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_)` | Apply one asset through the source's selection callback |
| `engine.asset.addLocalSourceFromJSON(contentUri=_, matcher=_)` | Register a source from a hosted JSON catalog |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query templates with filtering and pagination |
| `engine.asset.getGroups(sourceId=_)` | Read the available groups from a source |
| `engine.asset.findAllSources()` | List registered source IDs |
| `engine.asset.removeSource(sourceId=_)` | Remove a registered source |
| `engine.asset.onAssetSourceAdded()` | Observe source registration events |
| `engine.asset.onAssetSourceRemoved()` | Observe source removal events |

## Next Steps

- [Apply Templates](./apply-template.md) - Apply a template scene to the current design from a string or URI.
- [Asset Sources](../concepts/assets.md) - Understand how asset sources organize and deliver content.
- [Serve Assets](../serve-assets.md) - Host your templates, scenes, and thumbnails for production.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support