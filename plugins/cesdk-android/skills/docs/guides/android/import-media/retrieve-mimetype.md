> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Retrieve Mimetype](./retrieve-mimetype.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-retrieve-mimetype/RetrieveMimeType.kt reference-only
import android.graphics.Bitmap
import android.graphics.Color
import android.net.Uri
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.nio.channels.Channels

data class ResourceWithMimeType(
    val uri: Uri,
    val size: Int,
    val mimeType: String,
)

data class RetrieveMimeTypeResult(
    val resourcesByType: Map<String, Int>,
    val imageResourceCount: Int,
    val uploadedResourceCount: Int,
    val uploadedFileResourceCount: Int,
    val uploadedBufferResourceCount: Int,
    val remainingTransientResourceCount: Int,
    val externalMimeType: String,
)

suspend fun retrieveMimeType(engine: Engine): RetrieveMimeTypeResult {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 320F)
    engine.block.setHeight(page, value = 180F)
    engine.block.setDuration(page, duration = 1.0)

    val bitmap =
        Bitmap
            .createBitmap(32, 32, Bitmap.Config.ARGB_8888)
            .apply { eraseColor(Color.rgb(52, 118, 235)) }
    val imageBuffer = bitmap.toPngBuffer()
    val imageBufferUri = engine.editor.createBuffer()
    try {
        engine.editor.setBufferData(uri = imageBufferUri, offset = 0, data = imageBuffer)

        val imageBlock = engine.block.create(DesignBlockType.Graphic)
        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setWidth(imageBlock, value = 160F)
        engine.block.setHeight(imageBlock, value = 120F)
        engine.block.setPositionX(imageBlock, value = 80F)
        engine.block.setPositionY(imageBlock, value = 30F)
        engine.block.setUri(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = imageBufferUri,
        )
        engine.block.setFill(block = imageBlock, fill = imageFill)
        engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.COVER)
        engine.block.appendChild(parent = page, child = imageBlock)

        val assetImageUri = Uri.parse("file:///android_asset/webkit-P3.png")
        val assetImageBlock = engine.block.create(DesignBlockType.Graphic)
        val assetImageFill = engine.block.createFill(FillType.Image)
        engine.block.setShape(assetImageBlock, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setWidth(assetImageBlock, value = 80F)
        engine.block.setHeight(assetImageBlock, value = 80F)
        engine.block.setPositionX(assetImageBlock, value = 200F)
        engine.block.setPositionY(assetImageBlock, value = 50F)
        engine.block.setUri(
            block = assetImageFill,
            property = "fill/image/imageFileURI",
            value = assetImageUri,
        )
        engine.block.setFill(block = assetImageBlock, fill = assetImageFill)
        engine.block.setContentFillMode(block = assetImageBlock, mode = ContentFillMode.COVER)
        engine.block.appendChild(parent = page, child = assetImageBlock)
        engine.block.forceLoadResources(blocks = listOf(scene))

        val transientResources = engine.editor.findAllTransientResources()

        check(transientResources.any { (uri, _) -> uri == imageBufferUri })
        check(transientResources.any { (uri, _) -> uri == assetImageUri })

        val resourcesWithMimeType =
            transientResources.map { (uri, size) ->
                ResourceWithMimeType(
                    uri = uri,
                    size = size,
                    mimeType = engine.editor.getMimeType(uri = uri),
                )
            }

        val resourcesByType =
            resourcesWithMimeType
                .groupingBy { it.mimeType }
                .eachCount()

        val imageResources =
            resourcesWithMimeType.filter { resource ->
                resource.mimeType.startsWith("image/")
            }

        check(imageResources.isNotEmpty())

        val uploadedResources =
            imageResources.associate { resource ->
                val uploadedResource = File.createTempFile("cesdk-resource-", ".upload")
                try {
                    FileOutputStream(uploadedResource).channel.use { channel ->
                        engine.editor.getResourceData(
                            uri = resource.uri,
                            chunkSize = 64 * 1024,
                        ) { chunk ->
                            val data = chunk.asReadOnlyBuffer()
                            while (data.hasRemaining()) {
                                channel.write(data)
                            }
                            true
                        }
                    }
                    check(uploadedResource.length() == resource.size.toLong())

                    val permanentUri = uploadTransientResource(
                        uri = resource.uri,
                        file = uploadedResource,
                        mimeType = resource.mimeType,
                    )
                    resource.uri to permanentUri
                } finally {
                    uploadedResource.delete()
                }
            }

        for ((transientUri, permanentUri) in uploadedResources) {
            engine.editor.relocateResource(
                currentUri = transientUri,
                relocatedUri = permanentUri,
            )
        }

        val remainingTransientResources = engine.editor.findAllTransientResources()
        check(remainingTransientResources.none { (uri, _) -> uri in uploadedResources.keys })

        val externalMimeType = engine.editor.getMimeType(
            uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
        )

        return RetrieveMimeTypeResult(
            resourcesByType = resourcesByType,
            imageResourceCount = imageResources.size,
            uploadedResourceCount = uploadedResources.size,
            uploadedFileResourceCount = uploadedResources.keys.count { it.scheme == "file" },
            uploadedBufferResourceCount = uploadedResources.keys.count { it.scheme == "buffer" },
            remainingTransientResourceCount = remainingTransientResources.size,
            externalMimeType = externalMimeType,
        )
    } finally {
        engine.editor.destroyBuffer(uri = imageBufferUri)
    }
}

private fun Bitmap.toPngBuffer(): ByteBuffer {
    val pngFile = File.createTempFile("cesdk-buffer-image-", ".png")
    try {
        FileOutputStream(pngFile).channel.use { channel ->
            val output = Channels.newOutputStream(channel)
            check(compress(Bitmap.CompressFormat.PNG, 100, output))
            output.flush()
        }

        return FileInputStream(pngFile).channel.use { channel ->
            val size = channel.size()
            check(size <= Int.MAX_VALUE) { "PNG buffer is too large." }

            ByteBuffer.allocateDirect(size.toInt()).apply {
                while (hasRemaining() && channel.read(this) != -1) {
                    // Keep reading until the direct buffer contains the full PNG file.
                }
                flip()
            }
        }
    } finally {
        recycle()
        pngFile.delete()
    }
}

private fun uploadTransientResource(
    uri: Uri,
    file: File,
    mimeType: String,
): Uri {
    check(file.length() > 0) { "Cannot upload an empty resource." }

    // Replace this with your app's storage client and use mimeType as the upload content type.
    val extension =
        when (mimeType) {
            "image/jpeg" -> "jpg"
            "image/png" -> "png"
            "image/webp" -> "webp"
            else -> "bin"
        }
    val sourceName = uri.lastPathSegment?.takeIf { it.isNotBlank() } ?: "resource"
    val storageKey =
        sourceName
            .substringBeforeLast(delimiter = ".", missingDelimiterValue = sourceName)
            .ifBlank { "resource" }
    return Uri.parse("https://your-storage.example/uploads/$storageKey.$extension")
}
```

Detect the content type of CE.SDK resources before you upload, filter, or
serialize them.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.1/engine-guides-retrieve-mimetype)

<EngineReferenceNote {...props} />

CE.SDK resources can be referenced by `https://`, `file://`, `buffer://`, and other resource Uris. Do not infer whether a resource needs relocation from the URI scheme alone. Use `engine.editor.findAllTransientResources()` as the source of truth, then call `engine.editor.getMimeType()` for the returned Uris before deciding how to upload, filter, or persist them.

The Android sample creates a transient PNG image buffer, loads a packaged Android asset image, detects their MIME types, streams each resource's data, relocates the resources to permanent Uris, and validates an external image Uri before import.

## Finding Transient Resources

Transient resources are resources whose data would be lost during scene export or serialization unless you relocate them first. Use `findAllTransientResources()` to list the resource Uris and their byte sizes.

```kotlin highlight-android-find-transient-resources
val transientResources = engine.editor.findAllTransientResources()
```

Each pair contains the resource `Uri` and the size in bytes. Treat this list as the relocation checklist for the current scene, regardless of whether a returned Uri uses `buffer://`, `file://`, or another scheme.

## Retrieving the MIME Type

Call `getMimeType()` for each resource Uri to detect the underlying file format. The method is suspendable because the engine may need to fetch or decode the resource before it can identify the type.

```kotlin highlight-android-get-mime-type
        val resourcesWithMimeType =
            transientResources.map { (uri, size) ->
                ResourceWithMimeType(
                    uri = uri,
                    size = size,
                    mimeType = engine.editor.getMimeType(uri = uri),
                )
            }

        val resourcesByType =
            resourcesWithMimeType
                .groupingBy { it.mimeType }
                .eachCount()
```

Common return values include:

- `image/jpeg` for JPEG images
- `image/png` for PNG images
- `image/webp` for WebP images
- `font/ttf` for TrueType fonts
- `font/woff2` for WOFF2 fonts

## Filtering Resources by Type

Use the MIME type prefix to route resources through the right handling path. For example, image uploads can use image-specific previews and extensions while fonts can go through a separate font-storage pipeline.

```kotlin highlight-android-filter-images
val imageResources =
    resourcesWithMimeType.filter { resource ->
        resource.mimeType.startsWith("image/")
    }
```

This keeps resource processing data-driven instead of relying on file names or URI suffixes.

## Reading Resource Data

After identifying a transient resource, stream its data with `getResourceData()`. This works for every Uri returned by `findAllTransientResources()`, including `buffer://` resources and `file://` Android asset resources. Use the MIME type as the upload content type or to choose a file extension.

```kotlin highlight-android-read-resource-data
        val uploadedResources =
            imageResources.associate { resource ->
                val uploadedResource = File.createTempFile("cesdk-resource-", ".upload")
                try {
                    FileOutputStream(uploadedResource).channel.use { channel ->
                        engine.editor.getResourceData(
                            uri = resource.uri,
                            chunkSize = 64 * 1024,
                        ) { chunk ->
                            val data = chunk.asReadOnlyBuffer()
                            while (data.hasRemaining()) {
                                channel.write(data)
                            }
                            true
                        }
                    }
                    check(uploadedResource.length() == resource.size.toLong())

                    val permanentUri = uploadTransientResource(
                        uri = resource.uri,
                        file = uploadedResource,
                        mimeType = resource.mimeType,
                    )
                    resource.uri to permanentUri
                } finally {
                    uploadedResource.delete()
                }
            }
```

The sample upload helper stands in for your app's storage client. Replace it with the code that uploads the streamed data and returns a permanent Uri.

```kotlin highlight-android-upload-helper
private fun uploadTransientResource(
    uri: Uri,
    file: File,
    mimeType: String,
): Uri {
    check(file.length() > 0) { "Cannot upload an empty resource." }

    // Replace this with your app's storage client and use mimeType as the upload content type.
    val extension =
        when (mimeType) {
            "image/jpeg" -> "jpg"
            "image/png" -> "png"
            "image/webp" -> "webp"
            else -> "bin"
        }
    val sourceName = uri.lastPathSegment?.takeIf { it.isNotBlank() } ?: "resource"
    val storageKey =
        sourceName
            .substringBeforeLast(delimiter = ".", missingDelimiterValue = sourceName)
            .ifBlank { "resource" }
    return Uri.parse("https://your-storage.example/uploads/$storageKey.$extension")
}
```

## Relocating Resources

After upload, call `relocateResource()` to update scene references from each transient resource Uri to a permanent Uri.

```kotlin highlight-android-relocate-resources
for ((transientUri, permanentUri) in uploadedResources) {
    engine.editor.relocateResource(
        currentUri = transientUri,
        relocatedUri = permanentUri,
    )
}
```

Relocation lets the current scene keep working while making future serialization independent of resources that would otherwise be omitted.

## Verifying Relocation

Call `findAllTransientResources()` again before saving or exporting. Any remaining transient resource still needs to be uploaded or otherwise persisted.

```kotlin highlight-android-verify-relocation
val remainingTransientResources = engine.editor.findAllTransientResources()
check(remainingTransientResources.none { (uri, _) -> uri in uploadedResources.keys })
```

When the list no longer contains the relocated Uris, scene serialization can reference permanent resources instead of transient data.

## Validating External Uris

`getMimeType()` also accepts external Uris. The engine downloads the resource if needed, so you can check an incoming file before importing or routing it through a processing pipeline.

```kotlin highlight-android-validate-external-uri
val externalMimeType = engine.editor.getMimeType(
    uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
)
```

Wrap this call with your normal error handling when the Uri comes from user input or a remote service.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.editor.findAllTransientResources()` | Discovery | Return transient resource Uris and sizes for the current scene |
| `engine.editor.getMimeType(uri=_)` | Discovery | Detect the MIME type of a resource Uri |
| `engine.editor.getResourceData(uri=_, chunkSize=_, onData=_)` | Resource Data | Stream resource data in chunks for any transient resource Uri |
| `engine.editor.relocateResource(currentUri=_, relocatedUri=_)` | Resource Management | Update scene references from one resource Uri to another |

## Troubleshooting

**No transient resources are found**

Verify that the scene is loaded and that media resources have been loaded before calling `findAllTransientResources()`. Some `file://` resources, including Android asset Uris, can still appear in this list, so rely on the API result instead of filtering by scheme.

**MIME type detection fails**

Confirm that the Uri is valid and that the resource can be fetched. For external Uris, handle network or authorization failures around the suspend call. If the engine can fetch the resource but cannot classify its bytes, `getMimeType()` can return the literal string `"unknown"`; treat that result like a fallback path.

**Resource bytes are missing after serialization**

Transient data is not included in the exported scene. Stream the data to persistent storage and call `relocateResource()` for each Uri returned by `findAllTransientResources()` before saving a scene that must load in a future session.

## Next Steps

- [Import Design from Archive](../open-the-editor/import-design/from-archive.md) — Load self-contained CE.SDK archive files that bundle scene structure with all referenced assets for portable, reliable design imports.
- [Export Options](../export-save-publish/export/overview.md) — Export scenes and work with the resulting resource data.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support