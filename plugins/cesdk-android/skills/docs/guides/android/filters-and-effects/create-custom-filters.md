> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Create Custom Filters](./create-custom-filters.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-custom-filters/CreateCustomFilters.kt reference-only
import android.net.Uri
import ly.img.editor.defaultBaseUri
import ly.img.engine.Asset
import ly.img.engine.AssetContext
import ly.img.engine.AssetSource
import ly.img.engine.DesignBlockType
import ly.img.engine.EffectType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.FindAssetsResult
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.nio.ByteBuffer

data class CreateCustomFilters(
    val customSourceId: String,
    val jsonSourceId: String,
    val customFilterCount: Int,
    val warmToneFilterCount: Int,
    val jsonFilterCount: Int,
    val appliedFilterLabel: String,
    val appliedLutUri: String,
    val appliedThumbnailUri: String,
    val jsonThumbnailUri: String,
    val horizontalTileCount: Int,
    val verticalTileCount: Int,
    val intensity: Float,
    val exportedImage: ByteBuffer,
)

private const val CUSTOM_FILTER_SOURCE_ID = "my-custom-filters"
private const val JSON_FILTER_SOURCE_ID = "my-json-filters"

suspend fun createCustomFilters(
    engine: Engine,
    assetBaseUri: Uri = defaultBaseUri,
): CreateCustomFilters {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageBlock, value = 50F)
    engine.block.setPositionY(imageBlock, value = 50F)
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 225F)
    engine.block.appendChild(parent = page, child = imageBlock)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)

    val warmLutUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.filter.lut")
        .appendPath("LUTs")
        .appendPath("imgly_lut_ad1920_5_5_128.png")
        .build()
        .toString()
    val warmThumbnailUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.filter")
        .appendPath("thumbnails")
        .appendPath("imgly_lut_ad1920.jpg")
        .build()
        .toString()
    val monochromeLutUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.filter.lut")
        .appendPath("LUTs")
        .appendPath("imgly_lut_bw_5_5_128.png")
        .build()
        .toString()
    val monochromeThumbnailUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.filter")
        .appendPath("thumbnails")
        .appendPath("imgly_lut_bw.jpg")
        .build()
        .toString()

    val customFilters = listOf(
        Asset(
            id = "vintage-warm",
            context = AssetContext(sourceId = CUSTOM_FILTER_SOURCE_ID),
            label = "Vintage Warm",
            locale = "en",
            tags = listOf("vintage", "warm", "retro"),
            groups = listOf("Warm Tones"),
            meta = mapOf(
                "uri" to warmLutUri,
                "thumbUri" to warmThumbnailUri,
                "horizontalTileCount" to "5",
                "verticalTileCount" to "5",
                "blockType" to EffectType.LutFilter.key,
            ),
        ),
        Asset(
            id = "cool-cinema",
            context = AssetContext(sourceId = CUSTOM_FILTER_SOURCE_ID),
            label = "Cool Cinema",
            locale = "en",
            tags = listOf("cinema", "cool", "film"),
            groups = listOf("Cool Tones"),
            meta = mapOf(
                "uri" to monochromeLutUri,
                "thumbUri" to monochromeThumbnailUri,
                "horizontalTileCount" to "5",
                "verticalTileCount" to "5",
                "blockType" to EffectType.LutFilter.key,
            ),
        ),
        Asset(
            id = "bw-classic",
            context = AssetContext(sourceId = CUSTOM_FILTER_SOURCE_ID),
            label = "B&W Classic",
            locale = "en",
            tags = listOf("black and white", "classic", "monochrome"),
            groups = listOf("Monochrome"),
            meta = mapOf(
                "uri" to monochromeLutUri,
                "thumbUri" to monochromeThumbnailUri,
                "horizontalTileCount" to "5",
                "verticalTileCount" to "5",
                "blockType" to EffectType.LutFilter.key,
            ),
        ),
    )

    val customSource = CustomFilterAssetSource(
        sourceId = CUSTOM_FILTER_SOURCE_ID,
        filters = customFilters,
    )

    if (customSource.sourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = customSource.sourceId)
    }
    engine.asset.addSource(source = customSource)

    if (JSON_FILTER_SOURCE_ID in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = JSON_FILTER_SOURCE_ID)
    }

    val loadedJsonSourceId = engine.asset.addLocalSourceFromJSON(
        contentJSON = """
            {
              "version": "2.0.0",
              "id": "$JSON_FILTER_SOURCE_ID",
              "assets": [
                {
                  "id": "sunset-glow",
                  "label": { "en": "Sunset Glow" },
                  "tags": { "en": ["warm", "sunset", "golden"] },
                  "groups": ["Warm Tones"],
                  "meta": {
                    "uri": "$warmLutUri",
                    "thumbUri": "$warmThumbnailUri",
                    "horizontalTileCount": "5",
                    "verticalTileCount": "5",
                    "blockType": "${EffectType.LutFilter.key}"
                  }
                },
                {
                  "id": "ocean-breeze",
                  "label": { "en": "Ocean Breeze" },
                  "tags": { "en": ["cool", "blue", "ocean"] },
                  "groups": ["Cool Tones"],
                  "meta": {
                    "uri": "$monochromeLutUri",
                    "thumbUri": "$monochromeThumbnailUri",
                    "horizontalTileCount": "5",
                    "verticalTileCount": "5",
                    "blockType": "${EffectType.LutFilter.key}"
                  }
                }
              ]
            }
        """.trimIndent(),
    )
    check(loadedJsonSourceId == JSON_FILTER_SOURCE_ID)

    val customFilterResults = engine.asset.findAssets(
        sourceId = CUSTOM_FILTER_SOURCE_ID,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )

    val warmToneFilters = engine.asset.findAssets(
        sourceId = CUSTOM_FILTER_SOURCE_ID,
        query = FindAssetsQuery(page = 0, perPage = 10, groups = listOf("Warm Tones")),
    )

    val jsonFilterResults = engine.asset.findAssets(
        sourceId = JSON_FILTER_SOURCE_ID,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    check(customFilterResults.total == customFilters.size)
    check(warmToneFilters.assets.map { it.id } == listOf("vintage-warm"))
    check(jsonFilterResults.total == 2)

    val filterAsset = warmToneFilters.assets.first()
    val filterMeta = filterAsset.meta ?: error("Filter asset ${filterAsset.id} is missing metadata.")

    require(engine.block.supportsEffects(imageBlock)) {
        "The selected block must support effects before applying a LUT filter."
    }

    val lutEffect = engine.block.createEffect(type = EffectType.LutFilter)
    engine.block.setString(
        block = lutEffect,
        property = "effect/lut_filter/lutFileURI",
        value = filterMeta["uri"] ?: error("Filter asset ${filterAsset.id} is missing meta.uri."),
    )
    engine.block.setInt(
        block = lutEffect,
        property = "effect/lut_filter/horizontalTileCount",
        value = filterMeta["horizontalTileCount"]?.toInt()
            ?: error("Filter asset ${filterAsset.id} is missing meta.horizontalTileCount."),
    )
    engine.block.setInt(
        block = lutEffect,
        property = "effect/lut_filter/verticalTileCount",
        value = filterMeta["verticalTileCount"]?.toInt()
            ?: error("Filter asset ${filterAsset.id} is missing meta.verticalTileCount."),
    )
    engine.block.setFloat(
        block = lutEffect,
        property = "effect/lut_filter/intensity",
        value = 0.85F,
    )
    engine.block.appendEffect(block = imageBlock, effectBlock = lutEffect)

    val appliedLutUri = engine.block.getString(
        block = lutEffect,
        property = "effect/lut_filter/lutFileURI",
    )
    val appliedThumbnailUri = filterMeta["thumbUri"]
        ?: error("Filter asset ${filterAsset.id} is missing meta.thumbUri.")
    val jsonThumbnailUri = jsonFilterResults.assets.first().meta?.get("thumbUri")
        ?: error("JSON filter asset is missing meta.thumbUri.")
    val horizontalTileCount = engine.block.getInt(
        block = lutEffect,
        property = "effect/lut_filter/horizontalTileCount",
    )
    val verticalTileCount = engine.block.getInt(
        block = lutEffect,
        property = "effect/lut_filter/verticalTileCount",
    )
    val intensity = engine.block.getFloat(
        block = lutEffect,
        property = "effect/lut_filter/intensity",
    )

    val exportedImage = engine.block.export(block = page, mimeType = MimeType.PNG)

    return CreateCustomFilters(
        customSourceId = customSource.sourceId,
        jsonSourceId = loadedJsonSourceId,
        customFilterCount = customFilterResults.total,
        warmToneFilterCount = warmToneFilters.total,
        jsonFilterCount = jsonFilterResults.total,
        appliedFilterLabel = filterAsset.label.orEmpty(),
        appliedLutUri = appliedLutUri,
        appliedThumbnailUri = appliedThumbnailUri,
        jsonThumbnailUri = jsonThumbnailUri,
        horizontalTileCount = horizontalTileCount,
        verticalTileCount = verticalTileCount,
        intensity = intensity,
        exportedImage = exportedImage,
    )
}

private class CustomFilterAssetSource(
    sourceId: String,
    private val filters: List<Asset>,
) : AssetSource(sourceId = sourceId) {
    override suspend fun getGroups(): List<String>? = filters.flatMap { it.groups.orEmpty() }.distinct()

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult {
        val searchQuery = query.query
        val queryGroups = query.groups.orEmpty()

        val filteredAssets = filters.filter { asset ->
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
}
```

Extend CE.SDK with your own LUT filters by creating and registering custom
filter asset sources for brand-specific color grading.

![Android export result with a custom LUT filter applied](https://img.ly/docs/cesdk/android/filters-and-effects/create-custom-filters-c796ba/assets/android.hero.png)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260822/engine-guides-create-custom-filters)

CE.SDK provides built-in LUT filters, but many applications need brand-specific color grading or custom filter collections. Custom filter asset sources let you register your own LUT filters, query them like any other asset source, and apply the selected metadata to an image block.

<EngineReferenceNote {...props} />

This guide covers how to define filter metadata, create a custom asset source, load filters from JSON configuration, query filter assets, and apply a filter to a block.

## Filter Asset Metadata

LUT filters need these properties in the `meta` object:

- **`uri`** - URL to the LUT image file, usually a PNG.
- **`thumbUri`** - URL to a preview thumbnail image, not the tiled LUT atlas.
- **`horizontalTileCount`** - Number of horizontal tiles in the LUT grid.
- **`verticalTileCount`** - Number of vertical tiles in the LUT grid.
- **`blockType`** - `EffectType.LutFilter.key`, which resolves to `//ly.img.ubq/effect/lut_filter`.

The sample builds separate LUT and thumbnail URLs from the SDK asset base URI, then defines three filter assets with localized labels, search tags, groups, and LUT metadata.

```kotlin highlight-android-filter-metadata
val customFilters = listOf(
    Asset(
        id = "vintage-warm",
        context = AssetContext(sourceId = CUSTOM_FILTER_SOURCE_ID),
        label = "Vintage Warm",
        locale = "en",
        tags = listOf("vintage", "warm", "retro"),
        groups = listOf("Warm Tones"),
        meta = mapOf(
            "uri" to warmLutUri,
            "thumbUri" to warmThumbnailUri,
            "horizontalTileCount" to "5",
            "verticalTileCount" to "5",
            "blockType" to EffectType.LutFilter.key,
        ),
    ),
    Asset(
        id = "cool-cinema",
        context = AssetContext(sourceId = CUSTOM_FILTER_SOURCE_ID),
        label = "Cool Cinema",
        locale = "en",
        tags = listOf("cinema", "cool", "film"),
        groups = listOf("Cool Tones"),
        meta = mapOf(
            "uri" to monochromeLutUri,
            "thumbUri" to monochromeThumbnailUri,
            "horizontalTileCount" to "5",
            "verticalTileCount" to "5",
            "blockType" to EffectType.LutFilter.key,
        ),
    ),
    Asset(
        id = "bw-classic",
        context = AssetContext(sourceId = CUSTOM_FILTER_SOURCE_ID),
        label = "B&W Classic",
        locale = "en",
        tags = listOf("black and white", "classic", "monochrome"),
        groups = listOf("Monochrome"),
        meta = mapOf(
            "uri" to monochromeLutUri,
            "thumbUri" to monochromeThumbnailUri,
            "horizontalTileCount" to "5",
            "verticalTileCount" to "5",
            "blockType" to EffectType.LutFilter.key,
        ),
    ),
)
```

## Create a Custom Filter Source

Create an `AssetSource` when you want full control over filtering, pagination, group handling, or remote lookup behavior. The source returns `FindAssetsResult` values from its `findAssets` implementation.

```kotlin highlight-android-custom-source
private class CustomFilterAssetSource(
    sourceId: String,
    private val filters: List<Asset>,
) : AssetSource(sourceId = sourceId) {
    override suspend fun getGroups(): List<String>? = filters.flatMap { it.groups.orEmpty() }.distinct()

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult {
        val searchQuery = query.query
        val queryGroups = query.groups.orEmpty()

        val filteredAssets = filters.filter { asset ->
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
}
```

Register the source with the engine before you query it. The sample removes an existing source with the same ID first so repeated runs stay deterministic.

```kotlin highlight-android-register-source
    val customSource = CustomFilterAssetSource(
        sourceId = CUSTOM_FILTER_SOURCE_ID,
        filters = customFilters,
    )

    if (customSource.sourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = customSource.sourceId)
    }
    engine.asset.addSource(source = customSource)
```

## Load Filters From JSON

For static filter collections, load the same metadata from a JSON string with `addLocalSourceFromJSON`. The JSON format includes a `version`, the source `id`, and an `assets` array containing filter definitions.

```kotlin highlight-android-load-json
    if (JSON_FILTER_SOURCE_ID in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = JSON_FILTER_SOURCE_ID)
    }

    val loadedJsonSourceId = engine.asset.addLocalSourceFromJSON(
        contentJSON = """
            {
              "version": "2.0.0",
              "id": "$JSON_FILTER_SOURCE_ID",
              "assets": [
                {
                  "id": "sunset-glow",
                  "label": { "en": "Sunset Glow" },
                  "tags": { "en": ["warm", "sunset", "golden"] },
                  "groups": ["Warm Tones"],
                  "meta": {
                    "uri": "$warmLutUri",
                    "thumbUri": "$warmThumbnailUri",
                    "horizontalTileCount": "5",
                    "verticalTileCount": "5",
                    "blockType": "${EffectType.LutFilter.key}"
                  }
                },
                {
                  "id": "ocean-breeze",
                  "label": { "en": "Ocean Breeze" },
                  "tags": { "en": ["cool", "blue", "ocean"] },
                  "groups": ["Cool Tones"],
                  "meta": {
                    "uri": "$monochromeLutUri",
                    "thumbUri": "$monochromeThumbnailUri",
                    "horizontalTileCount": "5",
                    "verticalTileCount": "5",
                    "blockType": "${EffectType.LutFilter.key}"
                  }
                }
              ]
            }
        """.trimIndent(),
    )
```

For hosted filter catalogs, call the `contentUri` overload of `addLocalSourceFromJSON`. Use absolute URLs in the JSON or write paths with the `{{base_url}}/...` placeholder so CE.SDK replaces the placeholder with the catalog's base path.

## Query and Apply Filters

Use `findAssets` to query your custom source, group-filtered results, or the source created from JSON.

```kotlin highlight-android-query-filters
    val customFilterResults = engine.asset.findAssets(
        sourceId = CUSTOM_FILTER_SOURCE_ID,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )

    val warmToneFilters = engine.asset.findAssets(
        sourceId = CUSTOM_FILTER_SOURCE_ID,
        query = FindAssetsQuery(page = 0, perPage = 10, groups = listOf("Warm Tones")),
    )

    val jsonFilterResults = engine.asset.findAssets(
        sourceId = JSON_FILTER_SOURCE_ID,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
```

To apply a LUT filter, create `EffectType.LutFilter`, copy the LUT metadata into the effect properties, set the intensity, and append the effect to a block that supports effects.

```kotlin highlight-android-apply-filter
    val filterAsset = warmToneFilters.assets.first()
    val filterMeta = filterAsset.meta ?: error("Filter asset ${filterAsset.id} is missing metadata.")

    require(engine.block.supportsEffects(imageBlock)) {
        "The selected block must support effects before applying a LUT filter."
    }

    val lutEffect = engine.block.createEffect(type = EffectType.LutFilter)
    engine.block.setString(
        block = lutEffect,
        property = "effect/lut_filter/lutFileURI",
        value = filterMeta["uri"] ?: error("Filter asset ${filterAsset.id} is missing meta.uri."),
    )
    engine.block.setInt(
        block = lutEffect,
        property = "effect/lut_filter/horizontalTileCount",
        value = filterMeta["horizontalTileCount"]?.toInt()
            ?: error("Filter asset ${filterAsset.id} is missing meta.horizontalTileCount."),
    )
    engine.block.setInt(
        block = lutEffect,
        property = "effect/lut_filter/verticalTileCount",
        value = filterMeta["verticalTileCount"]?.toInt()
            ?: error("Filter asset ${filterAsset.id} is missing meta.verticalTileCount."),
    )
    engine.block.setFloat(
        block = lutEffect,
        property = "effect/lut_filter/intensity",
        value = 0.85F,
    )
    engine.block.appendEffect(block = imageBlock, effectBlock = lutEffect)
```

## Export the Result

After applying the filter, export the affected page or block with the regular block export API.

```kotlin highlight-android-export
val exportedImage = engine.block.export(block = page, mimeType = MimeType.PNG)
```

## Troubleshooting

### Filters Not Found in Query

- Verify that the source is registered before calling `findAssets`.
- Check that the source ID in `findAssets` matches the ID you registered or loaded from JSON.
- Include labels, tags, and groups that match your search and filtering logic.

### LUT Not Rendering Correctly

- Verify that `horizontalTileCount` and `verticalTileCount` match the actual LUT image grid.
- Confirm that the LUT URI is reachable from the app and from export.
- Store LUT images as PNG files to avoid compression artifacts.

### JSON Source Not Loading

- Verify that the JSON includes `version`, `id`, and `assets`.
- Keep all metadata values as strings.
- Ensure each filter asset includes `uri`, `thumbUri`, tile counts, and `blockType`.

## API Reference

| Method | Description |
| --- | --- |
| `AssetSource.findAssets(query=_)` | Return matching filter assets from a custom source. |
| `AssetSource.getGroups()` | Return the available filter groups for group-based queries. |
| `engine.asset.addSource(source=_)` | Register a custom asset source. |
| `engine.asset.addLocalSourceFromJSON(contentJSON=_)` | Create a local asset source from inline JSON. |
| `engine.asset.addLocalSourceFromJSON(contentUri=_)` | Create a local asset source from a JSON URI. |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query assets from a registered source. |
| `engine.asset.findAllSources()` | Return all registered asset source IDs. |
| `engine.asset.removeSource(sourceId=_)` | Remove a registered asset source by ID. |
| `engine.block.supportsEffects(block=_)` | Check whether a block can render an effect stack. |
| `engine.block.createEffect(type=EffectType.LutFilter)` | Create a LUT filter effect block. |
| `engine.block.setString(block=_, property="effect/lut_filter/lutFileURI", value=_)` | Set the LUT image URI. |
| `engine.block.setInt(block=_, property="effect/lut_filter/horizontalTileCount", value=_)` | Set the horizontal LUT tile count. |
| `engine.block.setInt(block=_, property="effect/lut_filter/verticalTileCount", value=_)` | Set the vertical LUT tile count. |
| `engine.block.setFloat(block=_, property="effect/lut_filter/intensity", value=_)` | Set the filter intensity. |
| `engine.block.appendEffect(block=_, effectBlock=_)` | Attach the configured effect to a block. |
| `engine.block.export(block=_, mimeType=MimeType.PNG)` | Export the filtered result. |

### Key Types

| Type | Purpose |
| --- | --- |
| `Asset` | Represents a filter returned from `findAssets`. |
| `FindAssetsQuery` | Defines pagination, search, and group filters for asset queries. |
| `FindAssetsResult` | Contains the returned assets and pagination metadata. |
| `EffectType.LutFilter` | Type-safe Android effect constant for LUT filters. |

## Next Steps

Now that you understand how to create and register custom filter sources, explore related topics:

- [Apply a Filter or Effect](./apply.md) - Apply, configure, stack, and manage filters and effects.
- [Create a Custom LUT Filter](./create-custom-lut-filter.md) - Understand LUT image format and create your own color grading filters.
- [Blur Effects](./blur.md) - Add blur effects to images and videos.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support