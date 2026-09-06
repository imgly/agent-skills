> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Local Source](../from-local-source.md) > [Import Local Asset](./local-asset.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-import-media-local-asset/ImportLocalAsset.kt reference-only
import android.content.Context
import android.graphics.BitmapFactory
import android.media.MediaMetadataRetriever
import android.net.Uri
import ly.img.engine.AssetDefinition
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import java.io.File
import java.util.UUID

private const val LOCAL_ASSET_SOURCE_ID = "ly.img.guide.local-assets"

private val LOCAL_ASSET_MIME_TYPES = listOf(
    "image/*",
    "video/*",
    "audio/*",
)

data class LocalAssetImportResult(
    val sourceId: String,
    val assetId: String,
    val mimeType: String,
    val insertedBlock: DesignBlock?,
)

suspend fun importLocalAsset(
    context: Context,
    engine: Engine,
    fileUri: Uri,
    displayName: String,
    sourceId: String = LOCAL_ASSET_SOURCE_ID,
    thumbnailUri: Uri? = null,
    videoDurationSeconds: Double? = null,
): LocalAssetImportResult {
    if (sourceId !in engine.asset.findAllSources()) {
        engine.asset.addLocalSource(
            sourceId = sourceId,
            supportedMimeTypes = LOCAL_ASSET_MIME_TYPES,
        )
    }

    val mimeType = engine.editor.getMimeType(uri = fileUri)
    val supportedMimeTypes = engine.asset.getSourceSupportedMimeTypes(sourceId = sourceId)
    val acceptsMimeType = supportedMimeTypes.isEmpty() ||
        supportedMimeTypes.any { supportedMimeType ->
            supportedMimeType == "*/*" ||
                supportedMimeType == mimeType ||
                (supportedMimeType.endsWith("/*") && mimeType.startsWith(supportedMimeType.removeSuffix("*")))
        }

    require(acceptsMimeType) {
        "Unsupported local asset MIME type: $mimeType"
    }

    val asset = createLocalAssetDefinition(
        context = context,
        fileUri = fileUri,
        displayName = displayName,
        mimeType = mimeType,
        thumbnailUri = thumbnailUri,
        videoDurationSeconds = videoDurationSeconds,
    )

    engine.asset.addAsset(sourceId = sourceId, asset = asset)

    val importedAsset = engine.asset.fetchAsset(
        sourceId = sourceId,
        assetId = asset.id,
    ) ?: error("Could not fetch imported local asset: ${asset.id}")

    val insertedBlock = engine.asset.defaultApplyAsset(asset = importedAsset)

    return LocalAssetImportResult(
        sourceId = sourceId,
        assetId = asset.id,
        mimeType = mimeType,
        insertedBlock = insertedBlock,
    )
}

data class LocalAssetDimensions(
    val width: Int,
    val height: Int,
)

fun readLocalAssetDimensions(
    context: Context,
    fileUri: Uri,
    mimeType: String,
): LocalAssetDimensions? = when {
    mimeType.startsWith("image/") -> readImageDimensions(context, fileUri)
    mimeType.startsWith("video/") -> readVideoDimensions(context, fileUri)
    else -> null
}

private fun readImageDimensions(
    context: Context,
    fileUri: Uri,
): LocalAssetDimensions {
    val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
    when (fileUri.scheme) {
        "file" -> {
            val file = File(requireNotNull(fileUri.path) { "File URI has no path: $fileUri" })
            file.inputStream().use { input ->
                BitmapFactory.decodeStream(input, null, options)
            }
        }

        else -> {
            context.contentResolver.openInputStream(fileUri)?.use { input ->
                BitmapFactory.decodeStream(input, null, options)
            } ?: error("Could not open local image: $fileUri")
        }
    }

    return requireDimensions(
        width = options.outWidth,
        height = options.outHeight,
        fileUri = fileUri,
    )
}

private fun readVideoDimensions(
    context: Context,
    fileUri: Uri,
): LocalAssetDimensions {
    val retriever = MediaMetadataRetriever()
    return try {
        retriever.setDataSource(context, fileUri)
        val width = retriever
            .extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH)
            ?.toIntOrNull()
        val height = retriever
            .extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT)
            ?.toIntOrNull()
        val rotation = retriever
            .extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)
            ?.toIntOrNull()
        val dimensions = requireDimensions(
            width = width,
            height = height,
            fileUri = fileUri,
        )
        if (rotation == 90 || rotation == 270) {
            LocalAssetDimensions(width = dimensions.height, height = dimensions.width)
        } else {
            dimensions
        }
    } finally {
        runCatching { retriever.release() }
    }
}

private fun requireDimensions(
    width: Int?,
    height: Int?,
    fileUri: Uri,
): LocalAssetDimensions {
    require(width != null && width > 0 && height != null && height > 0) {
        "Could not read dimensions for local asset: $fileUri"
    }
    return LocalAssetDimensions(width = width, height = height)
}

fun createLocalAssetDefinition(
    context: Context,
    fileUri: Uri,
    displayName: String,
    mimeType: String,
    thumbnailUri: Uri? = null,
    videoDurationSeconds: Double? = null,
    dimensions: LocalAssetDimensions? = null,
): AssetDefinition {
    val metadata = mutableMapOf(
        "uri" to fileUri.toString(),
        "mimeType" to mimeType,
    )
    val mediaDimensions = dimensions ?: readLocalAssetDimensions(
        context = context,
        fileUri = fileUri,
        mimeType = mimeType,
    )
    mediaDimensions?.let {
        metadata["width"] = it.width.toString()
        metadata["height"] = it.height.toString()
    }

    when {
        mimeType.startsWith("image/") -> {
            metadata["kind"] = "image"
            metadata["thumbUri"] = (thumbnailUri ?: fileUri).toString()
            metadata["blockType"] = DesignBlockType.Graphic.key
            metadata["fillType"] = FillType.Image.key
            metadata["shapeType"] = ShapeType.Rect.key
        }

        mimeType.startsWith("video/") -> {
            val duration = requireNotNull(videoDurationSeconds) {
                "Video assets require duration metadata in seconds."
            }
            metadata["kind"] = "video"
            thumbnailUri?.let { metadata["thumbUri"] = it.toString() }
            metadata["duration"] = duration.toString()
            metadata["blockType"] = DesignBlockType.Graphic.key
            metadata["fillType"] = FillType.Video.key
            metadata["shapeType"] = ShapeType.Rect.key
        }

        mimeType.startsWith("audio/") -> {
            metadata["kind"] = "audio"
            metadata["blockType"] = DesignBlockType.Audio.key
        }

        else -> error("Unsupported local asset MIME type: $mimeType")
    }

    return AssetDefinition(
        id = UUID.randomUUID().toString(),
        label = mapOf("en" to displayName),
        tags = mapOf("en" to listOf("local", "device")),
        meta = metadata,
    )
}
```

Register a local asset source, add a file `Uri` from the user's device, and
optionally insert the imported asset into the active scene.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260906/engine-guides-import-media-local-asset)

<EngineReferenceNote {...props} />

Local asset sources are useful when your app already has access to files on the device. The file can come from Android's system document picker, your app's private storage, or a file that your app copied into its sandbox.

This guide starts from a `Uri` that your app already resolved. If you receive a `content://` URI from `ActivityResultContracts.OpenDocument` and need access after the current session, call `takePersistableUriPermission` in your app before handing the URI to CE.SDK.

## Register a Local Source

Create one stable source ID for the imported files. The example registers the source only once, then stores the supported MIME types on the source so later validation uses the same allow list.

```kotlin highlight-android-register-source
if (sourceId !in engine.asset.findAllSources()) {
    engine.asset.addLocalSource(
        sourceId = sourceId,
        supportedMimeTypes = LOCAL_ASSET_MIME_TYPES,
    )
}
```

Use a dedicated source ID for each logical bucket of app-managed files. For example, keep user documents separate from bundled brand assets when they should appear in different library sections.

## Validate the Picked File

Detect the MIME type through the engine and compare it with the source's supported types before adding the asset. This catches unsupported files before the asset library or apply flow tries to use them.

```kotlin highlight-android-validate-file
    val mimeType = engine.editor.getMimeType(uri = fileUri)
    val supportedMimeTypes = engine.asset.getSourceSupportedMimeTypes(sourceId = sourceId)
    val acceptsMimeType = supportedMimeTypes.isEmpty() ||
        supportedMimeTypes.any { supportedMimeType ->
            supportedMimeType == "*/*" ||
                supportedMimeType == mimeType ||
                (supportedMimeType.endsWith("/*") && mimeType.startsWith(supportedMimeType.removeSuffix("*")))
        }

    require(acceptsMimeType) {
        "Unsupported local asset MIME type: $mimeType"
    }
```

For gallery-wide imports, use the Android photo-roll flow instead of this local-source pattern. For files that must move to backend storage before use, run the upload first and register the permanent URI.

## Read Media Dimensions

For image and video assets, read the intrinsic dimensions before creating the asset definition. CE.SDK uses this metadata when it creates the visual block, so non-square media keeps its aspect ratio when inserted.

```kotlin highlight-android-read-dimensions
data class LocalAssetDimensions(
    val width: Int,
    val height: Int,
)

fun readLocalAssetDimensions(
    context: Context,
    fileUri: Uri,
    mimeType: String,
): LocalAssetDimensions? = when {
    mimeType.startsWith("image/") -> readImageDimensions(context, fileUri)
    mimeType.startsWith("video/") -> readVideoDimensions(context, fileUri)
    else -> null
}

private fun readImageDimensions(
    context: Context,
    fileUri: Uri,
): LocalAssetDimensions {
    val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
    when (fileUri.scheme) {
        "file" -> {
            val file = File(requireNotNull(fileUri.path) { "File URI has no path: $fileUri" })
            file.inputStream().use { input ->
                BitmapFactory.decodeStream(input, null, options)
            }
        }

        else -> {
            context.contentResolver.openInputStream(fileUri)?.use { input ->
                BitmapFactory.decodeStream(input, null, options)
            } ?: error("Could not open local image: $fileUri")
        }
    }

    return requireDimensions(
        width = options.outWidth,
        height = options.outHeight,
        fileUri = fileUri,
    )
}

private fun readVideoDimensions(
    context: Context,
    fileUri: Uri,
): LocalAssetDimensions {
    val retriever = MediaMetadataRetriever()
    return try {
        retriever.setDataSource(context, fileUri)
        val width = retriever
            .extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH)
            ?.toIntOrNull()
        val height = retriever
            .extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT)
            ?.toIntOrNull()
        val rotation = retriever
            .extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)
            ?.toIntOrNull()
        val dimensions = requireDimensions(
            width = width,
            height = height,
            fileUri = fileUri,
        )
        if (rotation == 90 || rotation == 270) {
            LocalAssetDimensions(width = dimensions.height, height = dimensions.width)
        } else {
            dimensions
        }
    } finally {
        runCatching { retriever.release() }
    }
}

private fun requireDimensions(
    width: Int?,
    height: Int?,
    fileUri: Uri,
): LocalAssetDimensions {
    require(width != null && width > 0 && height != null && height > 0) {
        "Could not read dimensions for local asset: $fileUri"
    }
    return LocalAssetDimensions(width = width, height = height)
}
```

## Build the Asset Definition

An `AssetDefinition` stores the URI and the metadata CE.SDK needs to present and apply the asset. The sample supports images, videos, and audio; image and video assets use typed block and fill constants plus `width` and `height` metadata, while audio assets use the audio block type. For videos, pass the clip duration in seconds so the inserted block matches the local file length.

```kotlin highlight-android-define-asset
fun createLocalAssetDefinition(
    context: Context,
    fileUri: Uri,
    displayName: String,
    mimeType: String,
    thumbnailUri: Uri? = null,
    videoDurationSeconds: Double? = null,
    dimensions: LocalAssetDimensions? = null,
): AssetDefinition {
    val metadata = mutableMapOf(
        "uri" to fileUri.toString(),
        "mimeType" to mimeType,
    )
    val mediaDimensions = dimensions ?: readLocalAssetDimensions(
        context = context,
        fileUri = fileUri,
        mimeType = mimeType,
    )
    mediaDimensions?.let {
        metadata["width"] = it.width.toString()
        metadata["height"] = it.height.toString()
    }

    when {
        mimeType.startsWith("image/") -> {
            metadata["kind"] = "image"
            metadata["thumbUri"] = (thumbnailUri ?: fileUri).toString()
            metadata["blockType"] = DesignBlockType.Graphic.key
            metadata["fillType"] = FillType.Image.key
            metadata["shapeType"] = ShapeType.Rect.key
        }

        mimeType.startsWith("video/") -> {
            val duration = requireNotNull(videoDurationSeconds) {
                "Video assets require duration metadata in seconds."
            }
            metadata["kind"] = "video"
            thumbnailUri?.let { metadata["thumbUri"] = it.toString() }
            metadata["duration"] = duration.toString()
            metadata["blockType"] = DesignBlockType.Graphic.key
            metadata["fillType"] = FillType.Video.key
            metadata["shapeType"] = ShapeType.Rect.key
        }

        mimeType.startsWith("audio/") -> {
            metadata["kind"] = "audio"
            metadata["blockType"] = DesignBlockType.Audio.key
        }

        else -> error("Unsupported local asset MIME type: $mimeType")
    }

    return AssetDefinition(
        id = UUID.randomUUID().toString(),
        label = mapOf("en" to displayName),
        tags = mapOf("en" to listOf("local", "device")),
        meta = metadata,
    )
}
```

A `uri` is required for these media assets. The sample also stores the detected `mimeType`, avoiding another MIME lookup during insertion. Add intrinsic dimensions for visual assets. Include user-facing labels and tags so asset search can find the item later. For videos shown in a visual grid, pass a generated poster image as `thumbnailUri`.

## Add the Asset

Add the definition to the local source. `addAsset` indexes the asset and notifies subscribers, so any asset library or custom UI displaying the source can refresh automatically.

```kotlin highlight-android-add-asset
engine.asset.addAsset(sourceId = sourceId, asset = asset)
```

Call `assetSourceContentsChanged` only after an out-of-band change that the engine cannot observe, such as replacing files in a custom source's backing store without calling `addAsset` or `removeAsset`.

To expose this source in the CE.SDK editor UI, include an `AssetSourceType(sourceId)` entry in the relevant asset library category. The [Asset Library](../asset-library.md) guide covers how to configure the visible library sections.

## Insert the Asset Immediately

If your import button should place the file on the canvas right away, fetch the imported asset by its generated ID and pass it to `defaultApplyAsset`. Skip this step when you only want the file to appear in the asset library for later selection.

```kotlin highlight-android-insert-asset
    val importedAsset = engine.asset.fetchAsset(
        sourceId = sourceId,
        assetId = asset.id,
    ) ?: error("Could not fetch imported local asset: ${asset.id}")

    val insertedBlock = engine.asset.defaultApplyAsset(asset = importedAsset)
```

`defaultApplyAsset` returns the new block when the asset type can be inserted into the active scene. Make sure an active scene exists before calling it.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| CE.SDK cannot read a picked file | The app no longer has permission to access its `content://` URI | Persist the read permission returned by `ActivityResultContracts.OpenDocument`, or copy the file into app-managed storage |
| An inserted image or video has the wrong aspect ratio | Its `AssetDefinition` is missing valid `width` and `height` metadata | Read the intrinsic dimensions before adding the asset and store both values in `meta` |
| A video import fails while building the definition | The sample did not receive the clip duration | Read the duration from the local file and pass it in seconds as `videoDurationSeconds` |
| Adding an asset fails with a duplicate-ID error | The source already contains an asset with the generated ID | Generate a unique ID for each definition, or remove the existing asset before adding it again |

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.asset.findAllSources()` | Check whether the local source is already registered |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Register a mutable local asset source |
| `engine.editor.getMimeType(uri=_)` | Resolve the MIME type for a local `Uri` |
| `engine.asset.getSourceSupportedMimeTypes(sourceId=_)` | Read the MIME allow list stored on the source |
| `engine.asset.addAsset(sourceId=_, asset=_)` | Add an `AssetDefinition` to a local source |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notify subscribers after an out-of-band source change |
| `engine.asset.fetchAsset(sourceId=_, assetId=_)` | Fetch the newly added asset by its generated ID |
| `engine.asset.defaultApplyAsset(asset=_)` | Insert the asset into the active scene using CE.SDK's default behavior |

## Key Types

| Type | Purpose |
| --- | --- |
| `AssetDefinition` | Stores the asset ID, localized labels and tags, and metadata such as `uri`, `mimeType`, `width`, `height`, `duration`, `kind`, and block creation hints |
| `DesignBlockType` | Supplies typed block keys for graphic and audio assets |
| `FillType` | Supplies typed fill keys for image and video assets |
| `ShapeType` | Supplies the typed rectangle shape used for visual assets |

## Next Steps

- [From Photo Roll](./photo-roll.md) — Select and import photos from the device's media library
- [From User Upload](./user-upload.md) — Enable file picker uploads from end users for use in the editor
- [Edit or Remove Assets](../edit-or-remove-assets.md) — Update metadata or remove assets and local sources
- [Asset Library](../asset-library.md) — Configure which asset sources appear in the editor UI
- [File Format Support](../file-format-support.md) — Check supported media formats before adding local files



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support