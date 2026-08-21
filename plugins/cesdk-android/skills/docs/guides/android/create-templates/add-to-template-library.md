> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Add to Template Library](./add-to-template-library.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-templates-add-to-template-library/AddToTemplateLibrary.kt reference-only
import android.net.Uri
import ly.img.engine.AssetDefinition
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FindAssetsQuery
import ly.img.engine.assetBaseUri

@Suppress("DEPRECATION")
suspend fun addToTemplateLibrary(
    engine: Engine,
    assetBaseUri: Uri = Engine.assetBaseUri,
) {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    val headline = engine.block.create(DesignBlockType.Text)
    engine.block.setString(headline, property = "text/text", value = "Seasonal Sale")
    engine.block.setPositionX(headline, value = 120F)
    engine.block.setPositionY(headline, value = 180F)
    engine.block.setWidth(headline, value = 840F)
    engine.block.setHeight(headline, value = 140F)
    engine.block.appendChild(parent = page, child = headline)

    val currentScene = engine.scene.get() ?: error("Create or load a scene before saving it.")
    val templateString = engine.scene.saveToString(scene = currentScene)
    check(templateString.isNotBlank())

    val templateArchive = engine.scene.saveToArchive(scene = currentScene)
    val savedArchiveBytes = templateArchive.remaining()
    check(savedArchiveBytes > 0)

    val templateSourceId = "my-templates"
    if (templateSourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = templateSourceId)
    }
    engine.asset.addLocalSource(
        sourceId = templateSourceId,
        supportedMimeTypes = emptyList(),
        applyAsset = { asset ->
            val templateUri = asset.meta?.get("uri")?.let(Uri::parse)
                ?: error("Template asset ${asset.id} is missing meta.uri")
            engine.scene.applyTemplate(templateUri = templateUri)
            null
        },
    )

    val postcardTemplateUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("templates")
        .appendPath("cesdk_postcard_1.scene")
        .build()
    val postcardThumbnailUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("thumbnails")
        .appendPath("cesdk_postcard_1.jpg")
        .build()
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
    val templates = listOf(
        AssetDefinition(
            id = "template-postcard",
            label = mapOf("en" to "Postcard"),
            meta = mapOf(
                "uri" to postcardTemplateUri.toString(),
                "thumbUri" to postcardThumbnailUri.toString(),
            ),
        ),
        AssetDefinition(
            id = "template-business-card",
            label = mapOf("en" to "Business Card"),
            meta = mapOf(
                "uri" to businessCardTemplateUri.toString(),
                "thumbUri" to businessCardThumbnailUri.toString(),
            ),
        ),
    )

    templates.forEach { template ->
        engine.asset.addAsset(sourceId = templateSourceId, asset = template)
    }
    engine.asset.assetSourceContentsChanged(sourceId = templateSourceId)

    val postcardAsset = engine.asset.fetchAsset(
        sourceId = templateSourceId,
        assetId = "template-postcard",
    ) ?: error("Template asset not found.")
    val createdBlock = engine.asset.applyAssetSourceAsset(
        sourceId = templateSourceId,
        asset = postcardAsset,
    )
    check(createdBlock == null)
    check(engine.scene.get() != null)
    check(engine.block.findByType(DesignBlockType.Page).isNotEmpty())

    val jsonSourceId = "my-json-templates"
    if (jsonSourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = jsonSourceId)
    }
    val loadedJsonSourceId = engine.asset.addLocalSourceFromJSON(
        contentJSON = """
            {
              "version": "2.0.0",
              "id": "$jsonSourceId",
              "assets": [
                {
                  "id": "template-flyer",
                  "label": { "en": "Flyer" },
                  "meta": {
                    "uri": "$postcardTemplateUri",
                    "thumbUri": "$postcardThumbnailUri"
                  }
                }
              ]
            }
        """.trimIndent(),
        basePath = null,
        matcher = null,
    )
    check(loadedJsonSourceId == jsonSourceId)

    val sources = engine.asset.findAllSources()
    check(templateSourceId in sources)

    val queryResult = engine.asset.findAssets(
        sourceId = templateSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )

    engine.asset.removeAsset(sourceId = templateSourceId, assetId = "template-business-card")
    engine.asset.assetSourceContentsChanged(sourceId = templateSourceId)

    val remainingTemplateIds = engine.asset.findAssets(
        sourceId = templateSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    ).assets.map { asset -> asset.id }

    check(queryResult.total == templates.size)
    check(remainingTemplateIds == listOf("template-postcard"))
}
```

Create a template library that stores reusable CE.SDK templates in a local
Android asset source.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-create-templates-add-to-template-library)

<EngineReferenceNote {...props} />

Templates in CE.SDK are stored and accessed through the asset system. A template library is a local asset source that holds template definitions, including the template URI, thumbnail URI, and localized label.

This guide covers how to save scenes as templates, create a template asset source, add template metadata, load a JSON catalog, and manage the registered templates.

## Saving Templates

Save the scene you want to reuse before you register it as a template. CE.SDK supports lightweight string templates and self-contained archive templates.

### String Format

Use `engine.scene.saveToString()` when the template can keep referencing external resources by URI. This is the most compact format for templates whose assets are already hosted by your app or CDN.

```kotlin highlight-android-save-string
val currentScene = engine.scene.get() ?: error("Create or load a scene before saving it.")
val templateString = engine.scene.saveToString(scene = currentScene)
```

### Archive Format

Use `engine.scene.saveToArchive()` when the template should include its referenced assets. Persist the returned archive bytes in your app storage or upload them to your backend. The template source below applies `.scene` URIs; archive exports need a separate archive-loading callback instead of this `applyTemplate(templateUri=_)` path.

```kotlin highlight-android-save-archive
val templateArchive = engine.scene.saveToArchive(scene = currentScene)
```

## Creating a Template Asset Source

Register a local asset source with `engine.asset.addLocalSource()`. The `applyAsset` callback reads the selected asset's `meta.uri` value and applies that template to the current scene.

```kotlin highlight-android-create-source
val templateSourceId = "my-templates"
if (templateSourceId in engine.asset.findAllSources()) {
    engine.asset.removeSource(sourceId = templateSourceId)
}
engine.asset.addLocalSource(
    sourceId = templateSourceId,
    supportedMimeTypes = emptyList(),
    applyAsset = { asset ->
        val templateUri = asset.meta?.get("uri")?.let(Uri::parse)
            ?: error("Template asset ${asset.id} is missing meta.uri")
        engine.scene.applyTemplate(templateUri = templateUri)
        null
    },
)
```

The Android scene API exposes template loading as `engine.scene.applyTemplate(templateUri=_)` for URI-based templates and `engine.scene.applyTemplate(template=_)` for serialized strings. Because applying a template updates the active scene instead of creating a block, the callback returns `null`.

## Adding Templates to the Source

Add template definitions with `engine.asset.addAsset()`. Each template asset needs a stable `id`, a localized `label`, and `meta` values that point to the `.scene` template file and thumbnail. Build those URIs from the asset base URI used by your Android integration so the sample follows the installed SDK version.

```kotlin highlight-android-add-templates
    val postcardTemplateUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("templates")
        .appendPath("cesdk_postcard_1.scene")
        .build()
    val postcardThumbnailUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.templates")
        .appendPath("thumbnails")
        .appendPath("cesdk_postcard_1.jpg")
        .build()
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
    val templates = listOf(
        AssetDefinition(
            id = "template-postcard",
            label = mapOf("en" to "Postcard"),
            meta = mapOf(
                "uri" to postcardTemplateUri.toString(),
                "thumbUri" to postcardThumbnailUri.toString(),
            ),
        ),
        AssetDefinition(
            id = "template-business-card",
            label = mapOf("en" to "Business Card"),
            meta = mapOf(
                "uri" to businessCardTemplateUri.toString(),
                "thumbUri" to businessCardThumbnailUri.toString(),
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
- `meta.uri` - URI of the `.scene` template loaded by this source's `applyAsset` callback.
- `meta.thumbUri` - URI of the preview image shown by clients that render the source.

## Applying a Template

Fetch a template asset from the source and pass it to `engine.asset.applyAssetSourceAsset()`. This invokes the source's `applyAsset` callback and applies the template to the active scene.

```kotlin highlight-android-apply-template
val postcardAsset = engine.asset.fetchAsset(
    sourceId = templateSourceId,
    assetId = "template-postcard",
) ?: error("Template asset not found.")
val createdBlock = engine.asset.applyAssetSourceAsset(
    sourceId = templateSourceId,
    asset = postcardAsset,
)
```

For template sources, a `null` return value is expected because no new design block is created.

## Loading Templates from JSON

Use `engine.asset.addLocalSourceFromJSON()` when you keep template metadata in a JSON catalog. This creates a local source from the JSON definition; use `addLocalSource()` plus `addAsset()` when the source needs a custom `applyAsset` callback.

```kotlin highlight-android-json-source
val jsonSourceId = "my-json-templates"
if (jsonSourceId in engine.asset.findAllSources()) {
    engine.asset.removeSource(sourceId = jsonSourceId)
}
val loadedJsonSourceId = engine.asset.addLocalSourceFromJSON(
    contentJSON = """
        {
          "version": "2.0.0",
          "id": "$jsonSourceId",
          "assets": [
            {
              "id": "template-flyer",
              "label": { "en": "Flyer" },
              "meta": {
                "uri": "$postcardTemplateUri",
                "thumbUri": "$postcardThumbnailUri"
              }
            }
          ]
        }
    """.trimIndent(),
    basePath = null,
    matcher = null,
)
```

The JSON format contains a `version`, an `id` for the asset source, and an `assets` array with the same fields you would pass through `AssetDefinition`.

## Managing Templates

After registration, query, remove, and refresh templates through the asset API.

```kotlin highlight-android-manage-templates
    val sources = engine.asset.findAllSources()
    check(templateSourceId in sources)

    val queryResult = engine.asset.findAssets(
        sourceId = templateSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )

    engine.asset.removeAsset(sourceId = templateSourceId, assetId = "template-business-card")
    engine.asset.assetSourceContentsChanged(sourceId = templateSourceId)

    val remainingTemplateIds = engine.asset.findAssets(
        sourceId = templateSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    ).assets.map { asset -> asset.id }
```

Use `engine.asset.findAllSources()` to confirm that the source exists. Query templates with `engine.asset.findAssets()`, remove stale entries with `engine.asset.removeAsset()`, and call `engine.asset.assetSourceContentsChanged()` after mutating the source so listeners can refresh their view of the catalog.

## Troubleshooting

| Issue                                       | Cause                                                           | Solution                                                                           |
| ------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Query returns no templates                  | The source ID is wrong or assets were not added before querying | Confirm the ID with `findAllSources()` and call `addAsset()` before `findAssets()` |
| Template fails to apply                     | The asset is missing a valid `.scene` URI in `meta.uri`         | Store a reachable `.scene` URI for this `applyTemplate(templateUri=_)` callback    |
| Apply callback is not triggered             | The source was loaded from JSON without a custom callback       | Use `addLocalSource()` for sources that need custom template application behavior  |
| Source updates are not visible to listeners | The source changed without a refresh notification               | Call `assetSourceContentsChanged(sourceId=_)` after adding or removing assets      |

## API Reference

| Method                                                                        | Description                                                                 |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `engine.scene.get()`                                                          | Return the active scene before saving it                                    |
| `engine.scene.saveToString(scene=_)`                                          | Serialize a scene to a lightweight string template                          |
| `engine.scene.saveToArchive(scene=_)`                                         | Save a scene with its accessible assets as an archive for storage or upload |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_, applyAsset=_)` | Register a local template source with custom selection behavior             |
| `engine.scene.applyTemplate(templateUri=_)`                                   | Apply a template from a URI to the current scene                            |
| `engine.scene.applyTemplate(template=_)`                                      | Apply a template from a serialized scene string                             |
| `engine.asset.addAsset(sourceId=_, asset=_)`                                  | Add a template definition to a local source                                 |
| `engine.asset.fetchAsset(sourceId=_, assetId=_)`                              | Fetch one template asset from a source                                      |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_)`                     | Apply one asset through the source's selection callback                     |
| `engine.asset.addLocalSourceFromJSON(contentJSON=_, basePath=_, matcher=_)`   | Create a local source from a JSON asset catalog                             |
| `engine.asset.findAllSources()`                                               | List registered asset source IDs                                            |
| `engine.asset.findAssets(sourceId=_, query=_)`                                | Query templates from a source                                               |
| `engine.asset.removeAsset(sourceId=_, assetId=_)`                             | Remove one template definition from a source                                |
| `engine.asset.removeSource(sourceId=_)`                                       | Remove a local source before recreating it                                  |
| `engine.asset.assetSourceContentsChanged(sourceId=_)`                         | Notify listeners that source contents changed                               |

## Next Steps

- [Create From Scratch](./from-scratch.md) - Build reusable templates programmatically
  with the Engine API.
- [Text Variables](./add-dynamic-content/text-variables.md) - Add dynamic text content to templates.
- [Placeholders](./add-dynamic-content/placeholders.md) - Create editable image and video areas.
- [Customize Asset Library](../import-media/asset-library/customize.md) - Configure asset library appearance.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support