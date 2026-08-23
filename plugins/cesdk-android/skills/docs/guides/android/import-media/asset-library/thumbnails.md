> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Asset Library](../asset-library.md) > [Thumbnails](./thumbnails.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-asset-library-thumbnails/AssetLibraryThumbnailsSummary.kt reference-only
import ly.img.engine.Asset
import ly.img.engine.AssetContext
import ly.img.engine.AssetDefinition
import ly.img.engine.AssetSource
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.FindAssetsResult
import ly.img.engine.ShapeType

private const val ASSET_BASE_URI = "https://cdn.img.ly/packages/imgly/cesdk-android/1.81.0/assets"
private const val IMAGE_SOURCE_ID = "ly.img.guides.asset-library-thumbnails.images"
private const val AUDIO_SOURCE_ID = "ly.img.guides.asset-library-thumbnails.audio"
private const val REMOTE_SOURCE_ID = "ly.img.guides.asset-library-thumbnails.remote"

data class AssetLibraryThumbnailsSummary(
    val imageThumbUri: String,
    val audioThumbUri: String,
    val audioPreviewUri: String,
    val remoteAssetCount: Int,
    val remoteThumbUris: List<String>,
)

suspend fun assetLibraryThumbnails(engine: Engine): AssetLibraryThumbnailsSummary {
    listOf(IMAGE_SOURCE_ID, AUDIO_SOURCE_ID, REMOTE_SOURCE_ID).forEach { sourceId ->
        if (sourceId in engine.asset.findAllSources()) {
            engine.asset.removeSource(sourceId)
        }
    }

    val remoteSource = ThumbnailAssetSource()
    try {
        engine.asset.addLocalSource(
            sourceId = IMAGE_SOURCE_ID,
            supportedMimeTypes = listOf("image/jpeg"),
        )

        val imageAsset = AssetDefinition(
            id = "sample-landscape",
            label = mapOf("en" to "Landscape Photo"),
            tags = mapOf("en" to listOf("landscape", "thumbnail")),
            meta = mapOf(
                "uri" to "$ASSET_BASE_URI/ly.img.image/images/sample_1.jpg",
                "thumbUri" to "$ASSET_BASE_URI/ly.img.image/thumbnails/sample_1.jpg",
                "mimeType" to "image/jpeg",
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1767",
                "height" to "1178",
            ),
        )
        engine.asset.addAsset(sourceId = IMAGE_SOURCE_ID, asset = imageAsset)
        engine.asset.assetSourceContentsChanged(sourceId = IMAGE_SOURCE_ID)

        engine.asset.addLocalSource(
            sourceId = AUDIO_SOURCE_ID,
            supportedMimeTypes = listOf("audio/x-m4a"),
        )

        val audioAsset = AssetDefinition(
            id = "short-audio-preview",
            label = mapOf("en" to "Short Audio Preview"),
            meta = mapOf(
                "uri" to "$ASSET_BASE_URI/ly.img.audio/audios/far_from_home.m4a",
                "thumbUri" to "$ASSET_BASE_URI/ly.img.audio/thumbnails/audio-wave.png",
                "previewUri" to "$ASSET_BASE_URI/ly.img.audio/audios/far_from_home.m4a",
                "mimeType" to "audio/x-m4a",
                "blockType" to DesignBlockType.Audio.key,
                "duration" to "98.716009",
            ),
        )
        engine.asset.addAsset(sourceId = AUDIO_SOURCE_ID, asset = audioAsset)
        engine.asset.assetSourceContentsChanged(sourceId = AUDIO_SOURCE_ID)

        engine.asset.addSource(remoteSource)

        val queriedImage = engine.asset.findAssets(
            sourceId = IMAGE_SOURCE_ID,
            query = FindAssetsQuery(perPage = 1, page = 0),
        ).assets.first()
        val queriedAudio = engine.asset.findAssets(
            sourceId = AUDIO_SOURCE_ID,
            query = FindAssetsQuery(perPage = 1, page = 0),
        ).assets.first()
        val remoteAssets = engine.asset.findAssets(
            sourceId = REMOTE_SOURCE_ID,
            query = FindAssetsQuery(perPage = 10, page = 0),
        )

        return AssetLibraryThumbnailsSummary(
            imageThumbUri = queriedImage.meta?.get("thumbUri").orEmpty(),
            audioThumbUri = queriedAudio.meta?.get("thumbUri").orEmpty(),
            audioPreviewUri = queriedAudio.meta?.get("previewUri").orEmpty(),
            remoteAssetCount = remoteAssets.total,
            remoteThumbUris = remoteAssets.assets.mapNotNull { it.meta?.get("thumbUri") },
        )
    } finally {
        listOf(IMAGE_SOURCE_ID, AUDIO_SOURCE_ID, REMOTE_SOURCE_ID).forEach { sourceId ->
            if (sourceId in engine.asset.findAllSources()) {
                engine.asset.removeSource(sourceId)
            }
        }
    }
}

private class ThumbnailAssetSource : AssetSource(sourceId = REMOTE_SOURCE_ID) {
    override val supportedMimeTypes = listOf("image/jpeg")

    override suspend fun getGroups(): List<String> = listOf("remote")

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult {
        val pageAssets = remotePhotos.drop(query.page * query.perPage).take(query.perPage)

        return FindAssetsResult(
            assets = pageAssets.map { photo ->
                Asset(
                    id = photo.id,
                    context = AssetContext(sourceId = sourceId),
                    label = photo.label,
                    locale = "en",
                    groups = listOf("remote"),
                    meta = mapOf(
                        "uri" to photo.fullSizeUri,
                        "thumbUri" to photo.thumbnailUri,
                        "mimeType" to "image/jpeg",
                        "kind" to "image",
                        "blockType" to DesignBlockType.Graphic.key,
                        "fillType" to FillType.Image.key,
                        "shapeType" to ShapeType.Rect.key,
                        "width" to photo.width.toString(),
                        "height" to photo.height.toString(),
                    ),
                )
            },
            currentPage = query.page,
            nextPage = if ((query.page + 1) * query.perPage < remotePhotos.size) query.page + 1 else -1,
            total = remotePhotos.size,
        )
    }

    private val remotePhotos = listOf(
        RemotePhoto(
            id = "remote-landscape",
            label = "Remote Landscape",
            fullSizeUri = "$ASSET_BASE_URI/ly.img.image/images/sample_4.jpg",
            thumbnailUri = "$ASSET_BASE_URI/ly.img.image/thumbnails/sample_4.jpg",
            width = 1178,
            height = 1767,
        ),
        RemotePhoto(
            id = "remote-water",
            label = "Remote Water",
            fullSizeUri = "$ASSET_BASE_URI/ly.img.image/images/sample_5.jpg",
            thumbnailUri = "$ASSET_BASE_URI/ly.img.image/thumbnails/sample_5.jpg",
            width = 1767,
            height = 1262,
        ),
    )
}

private data class RemotePhoto(
    val id: String,
    val label: String,
    val fullSizeUri: String,
    val thumbnailUri: String,
    val width: Int,
    val height: Int,
)
```

Configure the thumbnail metadata that the CE.SDK Android asset library uses to
show image, video, audio, and remote-source assets.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/engine-guides-asset-library-thumbnails)

<EngineReferenceNote {...props} />

Thumbnails make asset sources easier to browse before users add content to a scene. On Android, the editor UI reads thumbnail metadata from each asset result; asset source and metadata configuration happen through the Engine Asset API.

## Understanding thumbUri vs previewUri

Three URI fields can appear in an asset's `meta` map:

| Property | Purpose | Android Behavior |
| --- | --- | --- |
| `thumbUri` | Image used as the asset card thumbnail | Displayed in the asset library UI; falls back to `uri` when omitted |
| `previewUri` | Lightweight preview resource | Used by audio asset cards for playback; image assets can also copy it to image fill preview data |
| `uri` | Final asset resource | Used when the asset is applied to the scene |

Use `thumbUri` for images, videos, and audio waveforms. Use `previewUri` for audio assets when the full `uri` is too large for quick preview playback. The Android editor UI falls back to `uri` if an audio asset has no `previewUri`.

## Thumbnail Configuration

### Basic Thumbnails

Add `thumbUri` to the asset metadata before adding the asset to a local source. Use a thumbnail around 512px wide so the same source looks sharp in grid cards without loading the full-resolution asset.

```kotlin highlight-android-basic-thumbnails
        engine.asset.addLocalSource(
            sourceId = IMAGE_SOURCE_ID,
            supportedMimeTypes = listOf("image/jpeg"),
        )

        val imageAsset = AssetDefinition(
            id = "sample-landscape",
            label = mapOf("en" to "Landscape Photo"),
            tags = mapOf("en" to listOf("landscape", "thumbnail")),
            meta = mapOf(
                "uri" to "$ASSET_BASE_URI/ly.img.image/images/sample_1.jpg",
                "thumbUri" to "$ASSET_BASE_URI/ly.img.image/thumbnails/sample_1.jpg",
                "mimeType" to "image/jpeg",
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1767",
                "height" to "1178",
            ),
        )
        engine.asset.addAsset(sourceId = IMAGE_SOURCE_ID, asset = imageAsset)
        engine.asset.assetSourceContentsChanged(sourceId = IMAGE_SOURCE_ID)
```

Call `assetSourceContentsChanged` after changing a source that may already be visible so the editor UI can refresh its asset list.

### Preview URIs for Audio

Audio assets should include a visual thumbnail and a previewable audio resource. The `thumbUri` points to an image such as a waveform, while `previewUri` points to the short audio clip the Android asset card plays.

```kotlin highlight-android-audio-preview-uri
        engine.asset.addLocalSource(
            sourceId = AUDIO_SOURCE_ID,
            supportedMimeTypes = listOf("audio/x-m4a"),
        )

        val audioAsset = AssetDefinition(
            id = "short-audio-preview",
            label = mapOf("en" to "Short Audio Preview"),
            meta = mapOf(
                "uri" to "$ASSET_BASE_URI/ly.img.audio/audios/far_from_home.m4a",
                "thumbUri" to "$ASSET_BASE_URI/ly.img.audio/thumbnails/audio-wave.png",
                "previewUri" to "$ASSET_BASE_URI/ly.img.audio/audios/far_from_home.m4a",
                "mimeType" to "audio/x-m4a",
                "blockType" to DesignBlockType.Audio.key,
                "duration" to "98.716009",
            ),
        )
        engine.asset.addAsset(sourceId = AUDIO_SOURCE_ID, asset = audioAsset)
        engine.asset.assetSourceContentsChanged(sourceId = AUDIO_SOURCE_ID)
```

The `uri` remains the full asset used when the audio is inserted. If the preview and final audio are the same file, keep both fields explicit so the source can later switch to a shorter preview without changing the asset shape.

### Custom Asset Source Thumbnails

For remote sources, map your backend response into CE.SDK asset results in `findAssets`. The important part is to return `meta.thumbUri` next to the full `meta.uri` for every visual asset.

```kotlin highlight-android-custom-source-thumbnails
    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult {
        val pageAssets = remotePhotos.drop(query.page * query.perPage).take(query.perPage)

        return FindAssetsResult(
            assets = pageAssets.map { photo ->
                Asset(
                    id = photo.id,
                    context = AssetContext(sourceId = sourceId),
                    label = photo.label,
                    locale = "en",
                    groups = listOf("remote"),
                    meta = mapOf(
                        "uri" to photo.fullSizeUri,
                        "thumbUri" to photo.thumbnailUri,
                        "mimeType" to "image/jpeg",
                        "kind" to "image",
                        "blockType" to DesignBlockType.Graphic.key,
                        "fillType" to FillType.Image.key,
                        "shapeType" to ShapeType.Rect.key,
                        "width" to photo.width.toString(),
                        "height" to photo.height.toString(),
                    ),
                )
            },
            currentPage = query.page,
            nextPage = if ((query.page + 1) * query.perPage < remotePhotos.size) query.page + 1 else -1,
            total = remotePhotos.size,
        )
    }
```

The sample keeps the remote data local, but the same mapping applies when `findAssets` calls your backend, cache, or storage service.

## Display Customization

The Android asset library applies thumbnail layout from the asset type:

- Image, video, filter, effect, and similar visual assets render as cropped grid cards.
- Audio assets render as rows with a thumbnail, label, and play control.
- Text and typeface assets use text-focused rows rather than image grids.

Entry-level layout properties such as `gridBackgroundType`, `previewBackgroundType`, `cardBackgroundPreferences`, `gridColumns`, and `gridItemHeight` are not public Android APIs. To change which sources appear in tabs and sheets, configure the [Asset Library](./customize.md); thumbnail rendering itself is handled by the CE.SDK editor UI.

## Best Practices

- Use image files for `thumbUri`; a 512px-wide thumbnail is a good default for quality and memory use.
- Use JPEG for photos and PNG when the thumbnail needs transparency or waveform-style graphics.
- Include `mimeType`, `blockType`, and the relevant type metadata so applying assets does not require MIME sniffing.
- Use `previewUri` for audio preview playback; do not use it as an alternate thumbnail format.
- Keep thumbnail URLs cacheable and stable, especially for remote asset sources.

## Troubleshooting

**Thumbnails do not appear**

Verify that `meta.thumbUri` points to an image URL that Android can load. If `thumbUri` is missing, the editor falls back to `meta.uri`, which may be a large file or a non-image media type.

**Audio preview does not play**

Check that the asset appears in an audio library section, has an audio `mimeType`, and provides either `previewUri` or `uri` for playback.

**The card crop is not what you expected**

Android chooses thumbnail scaling from the asset type. If you need different sections, tabs, or source grouping, customize the asset library configuration rather than relying on unsupported entry layout fields.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Create a local source that can hold `AssetDefinition` entries with thumbnail metadata. |
| `engine.asset.addAsset(sourceId=_, asset=_)` | Add an asset definition, including `meta.thumbUri` and optional `meta.previewUri`, to a local source. |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notify CE.SDK that a source changed after assets were added or updated. |
| `engine.asset.addSource(source=_)` | Register a custom `AssetSource` that returns thumbnail-ready asset results. |
| `AssetSource.findAssets(query=_)` | Map remote or generated data into `FindAssetsResult` pages. |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query a source and inspect the returned asset metadata. |

## Next Steps

- [Customize Asset Library](./customize.md) - Configure the Android asset library structure.
- [Asset Concepts](../concepts.md) - Understand asset sources and metadata.
- [Unsplash Integration](../from-remote-source/unsplash.md) - Map remote image results into CE.SDK assets.
- [Source Sets](../source-sets.md) - Provide multiple asset resolutions for drawing and export.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support