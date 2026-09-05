> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From IMG.LY Premium Assets](./imgly-premium-assets.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-media-imgly-premium-assets/ImglyPremiumAssets.kt reference-only
import android.net.Uri
import androidx.annotation.StringRes
import ly.img.editor.core.library.AssetType
import ly.img.editor.core.library.LibraryCategory
import ly.img.editor.core.library.LibraryContent
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.engine.Asset
import ly.img.engine.Engine
import ly.img.engine.FindAssetsQuery

private const val PREMIUM_ASSET_SOURCE_ID = "ly.img.templates.premium"

fun imglyPremiumContentUri(premiumAssetsBaseUri: Uri): Uri = premiumAssetsBaseUri.buildUpon()
    .appendPath(PREMIUM_ASSET_SOURCE_ID)
    .appendPath("content.json")
    .build()

fun createImglyPremiumAssetSource(engine: Engine) {
    if (PREMIUM_ASSET_SOURCE_ID in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = PREMIUM_ASSET_SOURCE_ID)
    }

    engine.asset.addLocalSource(
        sourceId = PREMIUM_ASSET_SOURCE_ID,
        supportedMimeTypes = emptyList(),
        applyAsset = { asset: Asset ->
            val archiveUri = asset.meta?.get("uri")?.let(Uri::parse)
                ?: error("Premium template ${asset.id} is missing meta.uri")
            engine.scene.load(
                sceneUri = archiveUri,
                waitForResources = true,
            )
            null
        },
    )
}

suspend fun addImglyPremiumAssetsToSource(
    engine: Engine,
    contentUri: Uri,
    matcher: List<String>? = null,
) {
    val sourceId = engine.asset.addLocalSourceFromJSON(
        contentUri = contentUri,
        matcher = matcher,
    )
    check(sourceId == PREMIUM_ASSET_SOURCE_ID)
}

suspend fun imglyPremiumAssets(
    engine: Engine,
    premiumAssetsBaseUri: Uri,
    matcher: List<String>? = null,
): String {
    val contentUri = imglyPremiumContentUri(premiumAssetsBaseUri)

    createImglyPremiumAssetSource(engine = engine)
    addImglyPremiumAssetsToSource(
        engine = engine,
        contentUri = contentUri,
        matcher = matcher,
    )

    return PREMIUM_ASSET_SOURCE_ID
}

fun imglyPremiumAddCategory(
    @StringRes titleRes: Int,
): LibraryCategory {
    val premiumSourceType = AssetSourceType(sourceId = PREMIUM_ASSET_SOURCE_ID)
    val premiumSection = LibraryContent.Section(
        titleRes = titleRes,
        sourceTypes = listOf(premiumSourceType),
        assetType = AssetType.Image,
    )

    return LibraryCategory.Images.copy(
        tabTitleRes = titleRes,
        content = LibraryContent.Sections(
            titleRes = titleRes,
            sections = listOf(premiumSection),
        ),
    )
}

suspend fun applyFirstImglyPremiumTemplate(
    engine: Engine,
    sourceId: String,
) {
    val templates = engine.asset.findAssets(
        sourceId = sourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    val firstTemplate = templates.assets.firstOrNull()
        ?: error("No premium templates are available in $sourceId.")

    val createdBlock = engine.asset.applyAssetSourceAsset(
        sourceId = sourceId,
        asset = firstTemplate,
    )
    check(createdBlock == null)
}

```

Host IMG.LY premium templates on your infrastructure and register them as an
Android asset source.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260905/engine-guides-import-media-imgly-premium-assets)

<EngineReferenceNote {...props} />

IMG.LY premium templates are delivered as a licensed asset package. Contact [IMG.LY sales](https://img.ly/forms/contact-sales) to obtain the package, then extract it and host its contents on your server or CDN. CE.SDK can query the hosted manifest, show template thumbnails, and load an individual template's `.zip` archive into the scene.

This guide covers locating the hosted `content.json`, creating a local source with archive loading support, loading asset definitions from JSON, and applying a template through the Asset API.

## Prerequisites

Before integrating premium assets, make sure you have:

- The licensed IMG.LY premium asset package, available from [IMG.LY sales](https://img.ly/forms/contact-sales).
- A server or CDN that hosts the extracted package contents over HTTPS.
- An existing CE.SDK `Engine` instance.
- Network access from your Android app to the hosted asset files.

## Premium Asset Package Structure

The extracted package keeps `content.json` inside the `ly.img.templates.premium` folder. Individual template `.zip` archives and thumbnails are stored separately below `ly.img.templates.premium/templates/<group>/` and `ly.img.templates.premium/thumbnails/<group>/`.

```json
{
  "version": "5.0.0",
  "id": "ly.img.templates.premium",
  "assets": [
    {
      "id": "ly.img.templates.premium.e-commerce.e-commerce_retro_story_n99",
      "groups": ["e-commerce"],
      "label": { "en": "70s Retro Sale" },
      "tags": { "en": ["70s", "retro", "fashion", "online-store"] },
      "meta": {
        "uri": "{{base_url}}/ly.img.templates.premium/templates/e-commerce/e-commerce_retro_story_n99.zip",
        "thumbUri": "{{base_url}}/ly.img.templates.premium/thumbnails/e-commerce/e-commerce_retro_story_n99.jpg",
        "mimeType": "scene/zip"
      }
    }
  ]
}
```

The `{{base_url}}` placeholder points to the parent URL that contains `ly.img.templates.premium`.

## Hosting Premium Assets

Extract the licensed package, then upload its contents without flattening or renaming the `ly.img.templates.premium` tree. For example, if the parent asset root is `https://cdn.example.com/assets`, the manifest URL is `https://cdn.example.com/assets/ly.img.templates.premium/content.json`, template archives stay under `https://cdn.example.com/assets/ly.img.templates.premium/templates/...`, and thumbnails stay under `https://cdn.example.com/assets/ly.img.templates.premium/thumbnails/...`.

Keep the parent asset root in your app configuration and derive the manifest URI from it.

## Configuring Asset Sources

Register premium templates as a local asset source. Local sources are suited for finite collections because CE.SDK manages searching, grouping, and pagination after you add the asset definitions.

### Build the Manifest URI

Build the `content.json` URI from the parent asset root. The Android JSON loader uses this URI to load the manifest and resolve `{{base_url}}` placeholders.

```kotlin highlight-android-content-uri
private const val PREMIUM_ASSET_SOURCE_ID = "ly.img.templates.premium"

fun imglyPremiumContentUri(premiumAssetsBaseUri: Uri): Uri = premiumAssetsBaseUri.buildUpon()
    .appendPath(PREMIUM_ASSET_SOURCE_ID)
    .appendPath("content.json")
    .build()
```

### Create a Local Source

Create the source with `engine.asset.addLocalSource()`. Premium templates are distributed as `.zip` archives, so the `applyAsset` callback reads `meta.uri`, calls `engine.scene.load()`, and returns `null` because applying a template replaces the scene instead of inserting a new design block.

```kotlin highlight-android-create-local-source
fun createImglyPremiumAssetSource(engine: Engine) {
    if (PREMIUM_ASSET_SOURCE_ID in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = PREMIUM_ASSET_SOURCE_ID)
    }

    engine.asset.addLocalSource(
        sourceId = PREMIUM_ASSET_SOURCE_ID,
        supportedMimeTypes = emptyList(),
        applyAsset = { asset: Asset ->
            val archiveUri = asset.meta?.get("uri")?.let(Uri::parse)
                ?: error("Premium template ${asset.id} is missing meta.uri")
            engine.scene.load(
                sceneUri = archiveUri,
                waitForResources = true,
            )
            null
        },
    )
}
```

Loading the archive replaces the active scene with the selected template and waits for resources to resolve before the callback returns.

### Process and Add Assets

Load the manifest with `engine.asset.addLocalSourceFromJSON()`. The Android loader reads the asset definitions, applies `{{base_url}}` replacement, preserves fields such as `meta.mimeType`, and can filter IDs with `matcher`.

```kotlin highlight-android-process-assets
suspend fun addImglyPremiumAssetsToSource(
    engine: Engine,
    contentUri: Uri,
    matcher: List<String>? = null,
) {
    val sourceId = engine.asset.addLocalSourceFromJSON(
        contentUri = contentUri,
        matcher = matcher,
    )
    check(sourceId == PREMIUM_ASSET_SOURCE_ID)
}
```

### Register the Source

Combine the previous steps into a single setup function. The manifest `id` becomes the asset source ID used by queries, UI configuration, and template application.

```kotlin highlight-android-register-source
suspend fun imglyPremiumAssets(
    engine: Engine,
    premiumAssetsBaseUri: Uri,
    matcher: List<String>? = null,
): String {
    val contentUri = imglyPremiumContentUri(premiumAssetsBaseUri)

    createImglyPremiumAssetSource(engine = engine)
    addImglyPremiumAssetsToSource(
        engine = engine,
        contentUri = contentUri,
        matcher = matcher,
    )

    return PREMIUM_ASSET_SOURCE_ID
}
```

## Displaying Templates in the Asset Library

The source is queryable as soon as registration completes. To show its thumbnails, create a dedicated category containing a `LibraryContent.Section`, an `AssetSourceType` for the returned source ID, and `AssetType.Image` as the thumbnail presentation type.

```kotlin highlight-android-premium-library-category
fun imglyPremiumAddCategory(
    @StringRes titleRes: Int,
): LibraryCategory {
    val premiumSourceType = AssetSourceType(sourceId = PREMIUM_ASSET_SOURCE_ID)
    val premiumSection = LibraryContent.Section(
        titleRes = titleRes,
        sourceTypes = listOf(premiumSourceType),
        assetType = AssetType.Image,
    )

    return LibraryCategory.Images.copy(
        tabTitleRes = titleRes,
        content = LibraryContent.Sections(
            titleRes = titleRes,
            sections = listOf(premiumSection),
        ),
    )
}
```

Pass your app's “Premium Templates” string resource as `titleRes`. Expose this category only from a dedicated add action, such as a dock button that opens `SheetType.LibraryAdd`. Selecting a thumbnail then runs this guide's `applyAsset` callback and replaces the scene.

Do not assign this source to an `AssetLibrary` category reused by `SheetType.LibraryReplace`. Replacement sheets call the source's block-targeted apply path, but this source intentionally defines `applyAsset` only and does not define `applyAssetToBlock`. See [Customize](../asset-library/customize.md) for the Android category and dock configuration pattern.

## Testing the Integration

Query the source to verify that the manifest loaded and assets are available. To test the full path, apply one asset, confirm that no insertable block is returned, and verify that the template archive loads into the scene.

```kotlin highlight-android-query-and-apply
suspend fun applyFirstImglyPremiumTemplate(
    engine: Engine,
    sourceId: String,
) {
    val templates = engine.asset.findAssets(
        sourceId = sourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    val firstTemplate = templates.assets.firstOrNull()
        ?: error("No premium templates are available in $sourceId.")

    val createdBlock = engine.asset.applyAssetSourceAsset(
        sourceId = sourceId,
        asset = firstTemplate,
    )
    check(createdBlock == null)
}
```

If your manifest contains groups, pass them through `FindAssetsQuery(groups=_)` to validate the same categories that your asset library UI displays.

## Optimization

Use long-lived CDN cache headers for thumbnail `.jpg` files and template `.zip` archives. Keep `content.json` cache duration shorter if you expect to add or remove templates without app updates.

For authenticated access, put signed or pre-signed `meta.uri` and `thumbUri` values in the manifest. Their lifetime must cover both browsing thumbnails and applying a template. The URI-based APIs shown here do not accept request headers; bearer-token or custom-header authentication requires app-owned networking and URI resolution plus an authenticated thumbnail image loader, which is outside this guide's flow.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Source query throws `ASSET.SOURCE_NOT_EXISTS` | No source is registered under the supplied ID | Use the `id` from `content.json` and finish registration before calling `findAssets(sourceId=_, query=_)` |
| A registered source returns no templates | The manifest contains no assets or the query and `matcher` filter out every asset | Inspect the registered manifest and relax the query groups or `matcher` patterns |
| Template fails to load | `meta.uri` does not point to a valid `.zip` archive | Verify that the archive path under `ly.img.templates.premium/templates/...` is reachable and load it with `engine.scene.load(sceneUri=_)` |
| Thumbnails are missing | `thumbUri` still contains `{{base_url}}` or points to the wrong folder | Keep thumbnails under `ly.img.templates.premium/thumbnails/...` and load the source with `engine.asset.addLocalSourceFromJSON(contentUri=_)` |
| UI does not show the source | The source was registered but not added to the editor's `AssetLibrary` configuration | Add the source ID through `AssetSourceType(sourceId=_)` in the relevant library section |
| Hosted files fail on device | The device cannot reach the server or the signed URLs have expired | Verify HTTPS access, authentication, signed URL lifetime, and cache headers from a real device build |

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.findAllSources()` | Check whether the premium source is already registered |
| `engine.asset.removeSource(sourceId=_)` | Remove an existing source before recreating it |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_, applyAsset=_)` | Register a local source with custom archive-loading behavior |
| `engine.scene.load(sceneUri=_, waitForResources=_)` | Load a `.zip` scene archive from the selected template asset |
| `engine.asset.addLocalSourceFromJSON(contentUri=_, matcher=_)` | Load template definitions from the hosted premium asset manifest |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query registered premium template assets |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_)` | Apply a selected asset through the source's `applyAsset` callback |

### Related Types

| Type | Purpose |
| --- | --- |
| `LibraryContent.Section` | Define the premium template thumbnail section. |
| `AssetSourceType` | Connect the section to `ly.img.templates.premium`. |
| `AssetType.Image` | Render the source assets with the verified image-thumbnail presentation. |
| `SheetType.LibraryAdd` | Open the dedicated add-only category without exposing it to replacement sheets. |

## Next Steps

- [From Unsplash](./unsplash.md) — Browse and import royalty-free images from Unsplash into the editor.
- [Customize](../asset-library/customize.md) — Adapt the asset library UI and behavior to your application's structure and user needs.
- [Basics](../asset-library/basics.md) — Explore the core functionality of the asset library and how users browse, search, and insert media.
- [Asset Concepts](../concepts.md) — Understand key asset concepts like sources, formats, metadata, and how assets are integrated into designs.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support