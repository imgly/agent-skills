> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [Import Remote Asset](./remote-asset.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-remote-asset/RemoteAsset.kt reference-only
package ly.img.editor.showcase

import android.net.Uri
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.MimeType

data class RemoteAsset(
    val remoteSourceId: String,
    val stringSourceId: String,
    val hostedSourceId: String,
    val remoteAssetLoaded: Boolean,
    val stringAssetCount: Int,
    val appliedBlock: DesignBlock?,
    val appliedBlockType: String?,
    val registeredSources: List<String>,
    val hostedSourceRemoved: Boolean,
    val invalidJsonRejected: Boolean,
)

suspend fun remoteAsset(
    engine: Engine,
    assetBaseUri: Uri,
): RemoteAsset {
    listOf("my.remote.images.uri", "my.remote.images", "my.remote.images.hosted").forEach { sourceId ->
        if (sourceId in engine.asset.findAllSources()) {
            engine.asset.removeSource(sourceId = sourceId)
        }
    }

    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val remoteAssetsBaseUri = assetBaseUri
    val imageManifestUri = remoteAssetsBaseUri.buildUpon()
        .appendPath("my.remote.images.uri")
        .appendPath("content.json")
        .build()

    val sampleImageUri = remoteAssetsBaseUri.buildUpon()
        .appendPath("imgly-assets")
        .appendPath("ly.img.image")
        .appendPath("images")
        .appendPath("sample_1.jpg")
        .build()

    val imageSourceId = engine.asset.addLocalSourceFromJSON(
        contentUri = imageManifestUri,
        matcher = listOf("sample_1"),
    )

    val manifestJSON = """
        {
          "version": "2.0.0",
          "id": "my.remote.images",
          "assets": [
            {
              "id": "sample_image",
              "label": { "en": "Sample Image" },
              "meta": {
                "uri": "$sampleImageUri",
                "thumbUri": "$sampleImageUri",
                "kind": "image",
                "fillType": "${FillType.Image.key}",
                "mimeType": "${MimeType.JPEG.key}",
                "width": 2500,
                "height": 1667
              }
            }
          ]
        }
    """.trimIndent()
    val stringSourceId = engine.asset.addLocalSourceFromJSON(
        contentJSON = manifestJSON,
        basePath = null,
        matcher = null,
    )

    val hostedManifestJSON = """
        {
          "version": "2.0.0",
          "id": "my.remote.images.hosted",
          "assets": [
            {
              "id": "hosted_sample_image",
              "label": { "en": "Hosted Sample Image" },
              "meta": {
                "uri": "{{base_url}}/imgly-assets/ly.img.image/images/sample_1.jpg",
                "thumbUri": "{{base_url}}/imgly-assets/ly.img.image/images/sample_1.jpg",
                "kind": "image",
                "fillType": "${FillType.Image.key}",
                "mimeType": "${MimeType.JPEG.key}",
                "width": 2500,
                "height": 1667
              }
            }
          ]
        }
    """.trimIndent()
    val hostedSourceId = engine.asset.addLocalSourceFromJSON(
        contentJSON = hostedManifestJSON,
        basePath = remoteAssetsBaseUri.toString(),
        matcher = null,
    )

    val remoteAssets = engine.asset.findAssets(
        sourceId = imageSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    val remoteAsset = engine.asset.fetchAsset(
        sourceId = imageSourceId,
        assetId = "sample_1",
    )
    val stringAssets = engine.asset.findAssets(
        sourceId = stringSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    check(remoteAssets.total > 0)

    val hostedAssets = engine.asset.findAssets(
        sourceId = hostedSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    val appliedBlock = hostedAssets.assets.firstOrNull()?.let { asset ->
        engine.asset.defaultApplyAsset(asset = asset)
    }

    val registeredSources = engine.asset.findAllSources()

    engine.asset.removeSource(sourceId = hostedSourceId)

    val invalidJsonRejected = try {
        engine.asset.addLocalSourceFromJSON(
            contentJSON = "{ not valid json }",
            basePath = null,
            matcher = null,
        )
        false
    } catch (_: Exception) {
        true
    }

    return RemoteAsset(
        remoteSourceId = imageSourceId,
        stringSourceId = stringSourceId,
        hostedSourceId = hostedSourceId,
        remoteAssetLoaded = remoteAsset != null,
        stringAssetCount = stringAssets.assets.size,
        appliedBlock = appliedBlock,
        appliedBlockType = appliedBlock?.let(engine.block::getType),
        registeredSources = registeredSources,
        hostedSourceRemoved = hostedSourceId !in engine.asset.findAllSources(),
        invalidJsonRejected = invalidJsonRejected,
    )
}
```

Load asset definitions from remote JSON files hosted on a CDN or server into CE.SDK's asset library.

![Remote image asset loaded into CE.SDK on Android](https://img.ly/docs/cesdk/android/import-media/from-remote-source/remote-asset-484685/assets/android.remote-asset.jpg)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260831/engine-guides-remote-asset)

<EngineReferenceNote {...props} />

Remote asset loading lets you host asset definitions outside your Android app and register them at runtime. This keeps asset management separate from your app release cycle, while the asset metadata still flows through the standard CE.SDK asset APIs.

This guide covers how to load remote asset manifests, load JSON content that you already have in memory, resolve `{{base_url}}` placeholders, query the loaded assets, and apply them to a scene.

## Setup

Create a scene and a page before applying image assets. The remote asset APIs only register asset data; applying an image later needs an active scene.

```kotlin highlight-android-setup
val scene = engine.scene.create()
val page = engine.block.create(DesignBlockType.Page)
engine.block.setWidth(page, value = 800F)
engine.block.setHeight(page, value = 600F)
engine.block.appendChild(parent = scene, child = page)
```

## JSON Manifest Structure

A manifest declares a `version`, an asset source `id`, and an `assets` array. Each asset has an `id`, localized labels, and a `meta` object with the URIs and apply hints that CE.SDK needs when the asset is applied.

```json
{
  "version": "2.0.0",
  "id": "my.remote.images.uri",
  "assets": [
    {
      "id": "sample_1",
      "label": { "en": "Sample Image" },
      "meta": {
        "uri": "{{base_url}}/my.remote.images.uri/images/sample.jpg",
        "thumbUri": "{{base_url}}/my.remote.images.uri/thumbnails/sample.jpg",
        "kind": "image",
        "fillType": "//ly.img.ubq/fill/image",
        "mimeType": "image/jpeg",
        "width": 2500,
        "height": 1667
      }
    }
  ]
}
```

The manifest `id` becomes the source ID for later calls. `uri` points to the media file, `thumbUri` points to a preview image, and the media metadata tells CE.SDK how to apply the asset.

When you load a manifest from `<assetBaseUri>/<sourceId>/content.json`, `{{base_url}}` resolves to the asset root, `<assetBaseUri>/`. Include the source folder in placeholder-based media paths, such as `{{base_url}}/my.remote.images.uri/images/sample.jpg`.

## Loading Assets From a Remote URL

Build the manifest and media URIs from the root folder that hosts your asset sources. In production, provide your own HTTPS server or CDN root, for example `Uri.parse("https://cdn.example.com/cesdk-assets")`.

```kotlin highlight-android-remote-uris
    val remoteAssetsBaseUri = assetBaseUri
    val imageManifestUri = remoteAssetsBaseUri.buildUpon()
        .appendPath("my.remote.images.uri")
        .appendPath("content.json")
        .build()

    val sampleImageUri = remoteAssetsBaseUri.buildUpon()
        .appendPath("imgly-assets")
        .appendPath("ly.img.image")
        .appendPath("images")
        .appendPath("sample_1.jpg")
        .build()
```

Pass the manifest URI to `engine.asset.addLocalSourceFromJSON()`. The method fetches the JSON, creates a local asset source, and returns the manifest's source ID. Use source IDs your app owns, and remove or reload those sources intentionally when their manifest changes. Android also accepts an optional `matcher` list so you can load only asset IDs that match specific strings or wildcard patterns.

```kotlin highlight-android-load-from-uri
val imageSourceId = engine.asset.addLocalSourceFromJSON(
    contentUri = imageManifestUri,
    matcher = listOf("sample_1"),
)
```

When the URI-loaded manifest uses `{{base_url}}`, CE.SDK resolves it against the asset root that contains the source folders. For a manifest at `https://cdn.example.com/cesdk-assets/my.remote.images.uri/content.json`, a media path such as `{{base_url}}/my.remote.images.uri/images/sample_1.jpg` resolves to `https://cdn.example.com/cesdk-assets/my.remote.images.uri/images/sample_1.jpg`.

## Loading Assets From a JSON String

Use the string overload when your app already has the manifest content, for example from an API response or embedded configuration. If the manifest contains absolute URLs, you can leave `basePath` as `null`.

```kotlin highlight-android-load-from-string
val manifestJSON = """
    {
      "version": "2.0.0",
      "id": "my.remote.images",
      "assets": [
        {
          "id": "sample_image",
          "label": { "en": "Sample Image" },
          "meta": {
            "uri": "$sampleImageUri",
            "thumbUri": "$sampleImageUri",
            "kind": "image",
            "fillType": "${FillType.Image.key}",
            "mimeType": "${MimeType.JPEG.key}",
            "width": 2500,
            "height": 1667
          }
        }
      ]
    }
""".trimIndent()
val stringSourceId = engine.asset.addLocalSourceFromJSON(
    contentJSON = manifestJSON,
    basePath = null,
    matcher = null,
)
```

## Customizing the Base Path

When a string manifest contains `{{base_url}}` placeholders, pass `basePath` to define the hosting location for relative asset files.

```kotlin highlight-android-base-path
val hostedManifestJSON = """
    {
      "version": "2.0.0",
      "id": "my.remote.images.hosted",
      "assets": [
        {
          "id": "hosted_sample_image",
          "label": { "en": "Hosted Sample Image" },
          "meta": {
            "uri": "{{base_url}}/imgly-assets/ly.img.image/images/sample_1.jpg",
            "thumbUri": "{{base_url}}/imgly-assets/ly.img.image/images/sample_1.jpg",
            "kind": "image",
            "fillType": "${FillType.Image.key}",
            "mimeType": "${MimeType.JPEG.key}",
            "width": 2500,
            "height": 1667
          }
        }
      ]
    }
""".trimIndent()
val hostedSourceId = engine.asset.addLocalSourceFromJSON(
    contentJSON = hostedManifestJSON,
    basePath = remoteAssetsBaseUri.toString(),
    matcher = null,
)
```

Use this pattern when your backend returns a manifest separately from the CDN or server path that hosts the referenced media.

## Verifying Loaded Assets

Query a source with `engine.asset.findAssets()` to inspect loaded assets, and fetch a known asset ID to confirm the manifest entry is available. Android uses zero-based pages, so the first page is `page = 0`.

```kotlin highlight-android-verify-assets
val remoteAssets = engine.asset.findAssets(
    sourceId = imageSourceId,
    query = FindAssetsQuery(page = 0, perPage = 10),
)
val remoteAsset = engine.asset.fetchAsset(
    sourceId = imageSourceId,
    assetId = "sample_1",
)
val stringAssets = engine.asset.findAssets(
    sourceId = stringSourceId,
    query = FindAssetsQuery(page = 0, perPage = 10),
)
```

## Applying Remote Assets

Use `engine.asset.defaultApplyAsset()` to turn a queried asset into a block in the active scene. CE.SDK reads the asset's `meta` fields and downloads the referenced media when the block needs it.

```kotlin highlight-android-apply-asset
val hostedAssets = engine.asset.findAssets(
    sourceId = hostedSourceId,
    query = FindAssetsQuery(page = 0, perPage = 10),
)
val appliedBlock = hostedAssets.assets.firstOrNull()?.let { asset ->
    engine.asset.defaultApplyAsset(asset = asset)
}
```

If you need custom apply behavior, use a custom `AssetSource` instead. JSON-backed local sources are a good fit when the manifest metadata already describes how the asset should become a block.

## Listing Asset Sources

Call `engine.asset.findAllSources()` to inspect the currently registered source IDs.

```kotlin highlight-android-list-sources
val registeredSources = engine.asset.findAllSources()
```

## Removing Asset Sources

Remove a source when your app no longer needs its assets or before reloading the same manifest ID with updated content.

```kotlin highlight-android-remove-source
engine.asset.removeSource(sourceId = hostedSourceId)
```

## Error Handling

Wrap manifest loading in `try`/`catch` so your app can handle network errors, missing files, or invalid JSON.

```kotlin highlight-android-error-handling
val invalidJsonRejected = try {
    engine.asset.addLocalSourceFromJSON(
        contentJSON = "{ not valid json }",
        basePath = null,
        matcher = null,
    )
    false
} catch (_: Exception) {
    true
}
```

Common issues include:

- **Network failures**: Check connectivity and whether the manifest URL is reachable from the device.
- **Invalid JSON**: Confirm the manifest contains a `version`, an `id`, and an `assets` array.
- **Base path issues**: Make sure `{{base_url}}` resolves to reachable media and thumbnail URLs.
- **Source ID conflicts**: Use source IDs your app owns, and avoid removing built-in sources such as `ly.img.image`.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.create()` | Create the scene that receives applied assets. |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create a page for the scene. |
| `engine.block.setWidth(block=_, value=_)` | Set the page width. |
| `engine.block.setHeight(block=_, value=_)` | Set the page height. |
| `engine.block.appendChild(parent=_, child=_)` | Add the page to the scene. |
| `Uri.buildUpon()` | Build manifest and media URIs from a remote asset base URI. |
| `engine.asset.addLocalSourceFromJSON(contentUri=_, matcher=_)` | Load an asset source from a JSON file URI, optionally filtering asset IDs. |
| `engine.asset.addLocalSourceFromJSON(contentJSON=_, basePath=_, matcher=_)` | Load an asset source from JSON content, optionally resolving `{{base_url}}` with `basePath`. |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query assets from a loaded source. |
| `engine.asset.fetchAsset(sourceId=_, assetId=_)` | Fetch a specific loaded asset by ID. |
| `engine.asset.defaultApplyAsset(asset=_)` | Apply an asset to the active scene using its metadata. |
| `engine.asset.findAllSources()` | List registered asset source IDs. |
| `engine.asset.removeSource(sourceId=_)` | Remove an asset source and its loaded assets. |

## Next Steps

- [Assets](../../concepts/assets.md) - How asset sources and assets fit together.
- [Serve Assets From Your Server](../../serve-assets.md) - Host asset files and manifests on your own server or CDN.
- [Integrate Unsplash Stock Images](./unsplash.md) - See a complete custom `AssetSource` implementation backed by a remote API.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support