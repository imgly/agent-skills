> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Resources](./resources.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-resources/Resources.kt reference-only
import android.graphics.Bitmap
import android.graphics.Color
import android.net.Uri
import kotlinx.coroutines.withContext
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import java.io.OutputStream
import java.nio.ByteBuffer

suspend fun resources(engine: Engine): List<String> = withContext(engine.dispatcher) {
    val logLines = mutableListOf<String>()

    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 680F)
    engine.block.setHeight(page, value = 260F)
    engine.block.setDuration(page, duration = 1.0)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageBlock, value = 30F)
    engine.block.setPositionY(imageBlock, value = 30F)
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 200F)

    val imageUri = Uri.parse(
        "https://img.ly/static/ubq_samples/sample_4.jpg?cesdk-resources-guide=source",
    )
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = imageUri,
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.COVER)
    engine.block.appendChild(parent = page, child = imageBlock)

    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setShape(videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(videoBlock, value = 350F)
    engine.block.setPositionY(videoBlock, value = 30F)
    engine.block.setWidth(videoBlock, value = 300F)
    engine.block.setHeight(videoBlock, value = 200F)
    val videoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4")
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    engine.block.setContentFillMode(block = videoBlock, mode = ContentFillMode.COVER)
    engine.block.appendChild(parent = page, child = videoBlock)

    engine.block.forceLoadAVResource(block = videoFill)

    val duration = engine.block.getAVResourceTotalDuration(block = videoFill)
    val videoWidth = engine.block.getVideoWidth(videoFill = videoFill)
    val videoHeight = engine.block.getVideoHeight(videoFill = videoFill)

    val transientBitmap =
        Bitmap
            .createBitmap(32, 32, Bitmap.Config.ARGB_8888)
            .apply {
                eraseColor(Color.rgb(255, 196, 0))
            }
    val transientImageBuffer =
        DirectByteBufferOutputStream().use { output ->
            check(transientBitmap.compress(Bitmap.CompressFormat.PNG, 100, output))
            output.toByteBuffer()
        }
    transientBitmap.recycle()
    val transientImageSize = transientImageBuffer.remaining()
    val transientImageBufferUri = engine.editor.createBuffer()
    var transientImageBlockToDestroy: DesignBlock? = null
    var transientImageFillToDestroy: DesignBlock? = null
    var transientImageRelocated = false
    try {
        engine.editor.setBufferData(
            uri = transientImageBufferUri,
            offset = 0,
            data = transientImageBuffer,
        )
        check(engine.editor.getBufferLength(uri = transientImageBufferUri) == transientImageSize)

        val transientImageBlock = engine.block.create(DesignBlockType.Graphic)
        transientImageBlockToDestroy = transientImageBlock
        val transientImageFill = engine.block.createFill(FillType.Image)
        transientImageFillToDestroy = transientImageFill
        engine.block.setShape(transientImageBlock, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(transientImageBlock, value = 600F)
        engine.block.setPositionY(transientImageBlock, value = 20F)
        engine.block.setWidth(transientImageBlock, value = 48F)
        engine.block.setHeight(transientImageBlock, value = 48F)
        engine.block.setUri(
            block = transientImageFill,
            property = "fill/image/imageFileURI",
            value = transientImageBufferUri,
        )
        engine.block.setFill(block = transientImageBlock, fill = transientImageFill)
        engine.block.appendChild(parent = page, child = transientImageBlock)

        // Preload every resource referenced by the scene and its children.
        engine.block.forceLoadResources(blocks = listOf(scene))

        // Or preload only guide-owned blocks whose resources are needed next.
        val graphics = listOf(imageBlock, videoBlock, transientImageBlock)
        engine.block.forceLoadResources(blocks = graphics)

        // No preload call is required; this inspects resource references that cannot be serialized.
        val transientResources = engine.editor.findAllTransientResources()
            .filter { (uri, _) -> uri == transientImageBufferUri }

        val mediaUris = engine.editor.findAllMediaURIs()
        val persistentMediaUris = mediaUris.filter { it.scheme in listOf("http", "https", "file") }

        val unusedBlock = engine.block.create(DesignBlockType.Graphic)
        val unusedBlocks = engine.block.findAllUnused()
        check(unusedBlock in unusedBlocks)
        engine.block.destroy(unusedBlock)

        val mimeType = engine.editor.getMimeType(uri = imageUri)

        val relocatedImageUri = Uri.parse(
            "https://img.ly/static/ubq_samples/sample_1.jpg?cesdk-resources-guide=relocated",
        )
        engine.editor.relocateResource(
            currentUri = imageUri,
            relocatedUri = relocatedImageUri,
        )

        val relocatedResources =
            transientResources.map { (transientUri, resourceSize) ->
                val resourceData = ByteBuffer.allocateDirect(resourceSize)
                engine.editor.getResourceData(
                    uri = transientUri,
                    chunkSize = 64 * 1024,
                ) { chunk ->
                    resourceData.put(chunk.asReadOnlyBuffer())
                    true
                }
                resourceData.flip()

                val permanentUri =
                    uploadTransientResourceToPermanentStorage(
                        sourceUri = transientUri,
                        data = resourceData.asReadOnlyBuffer(),
                    )
                engine.editor.relocateResource(
                    currentUri = transientUri,
                    relocatedUri = permanentUri,
                )
                transientImageRelocated = true
                transientUri to permanentUri
            }

        val remainingTransientResources = engine.editor.findAllTransientResources()
            .filter { (uri, _) -> uri == transientImageBufferUri }
        val sceneString =
            engine.scene.saveToString(
                scene = scene,
                allowedResourceSchemes = listOf("http", "https"),
            )

        logLines +=
            "Created an image block for $imageUri. The resource loads on-demand when rendered or exported."
        logLines += "Preloaded resources for the scene and ${graphics.size} guide-owned graphic blocks."
        logLines += "Video metadata: ${duration}s, ${videoWidth}x$videoHeight."
        transientResources.forEach { (uri, size) ->
            logLines += "Transient resource: $uri ($size bytes)."
        }
        mediaUris.forEach { uri ->
            logLines += "Media URI: $uri"
        }
        logLines += "Persistent media URI count: ${persistentMediaUris.size}."
        logLines += "Found ${unusedBlocks.size} unused blocks and destroyed the guide-owned block."
        logLines += "MIME type for $imageUri: $mimeType"
        relocatedResources.forEach { (transientUri, permanentUri) ->
            logLines += "Relocated $transientUri to $permanentUri."
        }
        logLines += "Relocated image resource to $relocatedImageUri."
        logLines += "Transient resources after relocation: ${remainingTransientResources.size}."
        logLines += "Saved scene string (${sceneString.length} characters)."

        logLines
    } finally {
        if (!transientImageRelocated) {
            transientImageBlockToDestroy
                ?.takeIf(engine.block::isValid)
                ?.let(engine.block::destroy)
            transientImageFillToDestroy
                ?.takeIf(engine.block::isValid)
                ?.let(engine.block::destroy)
        }
        engine.editor.destroyBuffer(uri = transientImageBufferUri)
    }
}

private suspend fun uploadTransientResourceToPermanentStorage(
    sourceUri: Uri,
    data: ByteBuffer,
): Uri {
    check(data.hasRemaining()) { "Cannot upload an empty resource." }

    // Upload the bytes with your app's storage client here, then return its permanent URI.
    // This sample only creates a placeholder URL so the guide can focus on the CE.SDK flow.
    val fileName =
        sourceUri
            .lastPathSegment
            ?.takeIf { it.isNotBlank() }
            ?: "transient-resource-${data.remaining()}"
    return Uri.parse("https://your-storage.example/uploads/$fileName")
}

private class DirectByteBufferOutputStream(
    initialCapacity: Int = 4 * 1024,
) : OutputStream() {
    private var buffer = ByteBuffer.allocateDirect(initialCapacity)

    override fun write(value: Int) {
        ensureCapacity(1)
        buffer.put(value.toByte())
    }

    fun toByteBuffer(): ByteBuffer {
        val data = buffer.asReadOnlyBuffer()
        data.flip()
        return data.slice().asReadOnlyBuffer()
    }

    private fun ensureCapacity(additionalBytes: Int) {
        if (buffer.remaining() >= additionalBytes) return

        val expanded = ByteBuffer.allocateDirect(
            maxOf(buffer.capacity() * 2, buffer.position() + additionalBytes),
        )
        buffer.flip()
        expanded.put(buffer)
        buffer = expanded
    }
}
```

Manage external media files—images, videos, audio, and fonts—that blocks
reference via URIs in CE.SDK.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260809/engine-guides-resources)

<EngineReferenceNote {...props} />

Resources are external media files that blocks reference through URI properties like `fill/image/imageFileURI` or `fill/video/fileURI`. CE.SDK loads resources automatically when needed, but you can preload them for better performance. When working with transient resources whose data would be lost during serialization, upload their data and relocate them to permanent URLs before saving. If resource URLs change, you can update the mappings without modifying scene data.

This guide covers on-demand and preloaded resource loading, identifying transient resources, relocating them to permanent URLs before serialization, and discovering all media URIs in a scene.

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.forceLoadResources(blocks=_)` | Preloading | Load resources for blocks and their children |
| `engine.block.forceLoadAVResource(block=_)` | Preloading | Load audio or video resource data for a block |
| `engine.block.getAVResourceTotalDuration(block=_)` | Properties | Get the duration of an audio or video resource |
| `engine.block.getVideoWidth(videoFill=_)` | Properties | Get the width of a loaded video resource |
| `engine.block.getVideoHeight(videoFill=_)` | Properties | Get the height of a loaded video resource |
| `engine.editor.findAllTransientResources()` | Discovery | Find resources whose data would be lost during serialization |
| `engine.editor.getResourceData(uri=_, chunkSize=_, onData=_)` | Discovery | Read resource bytes in chunks before uploading |
| `engine.editor.findAllMediaURIs()` | Discovery | List serializable media URIs referenced in the scene |
| `engine.block.findAllUnused()` | Cleanup | Find detached blocks before relocating or destroying resources |
| `engine.editor.getMimeType(uri=_)` | Discovery | Detect the MIME type of a resource |
| `engine.editor.relocateResource(currentUri=_, relocatedUri=_)` | Management | Update URI mappings after assets move |
| `engine.scene.saveToString(scene=_, allowedResourceSchemes=_)` | Serialization | Save the scene after transient resources are relocated |

## On-Demand Loading

The engine fetches resources automatically when rendering blocks or preparing exports. This approach requires no extra code but may delay the first render while assets download.

```kotlin highlight-android-on-demand-loading
    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageBlock, value = 30F)
    engine.block.setPositionY(imageBlock, value = 30F)
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 200F)

    val imageUri = Uri.parse(
        "https://img.ly/static/ubq_samples/sample_4.jpg?cesdk-resources-guide=source",
    )
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = imageUri,
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.COVER)
    engine.block.appendChild(parent = page, child = imageBlock)
```

When you create a graphic block with an image fill, the engine downloads that image only when the block is needed for rendering or export.

## Preloading Resources

Load resources before they are needed with `forceLoadResources()`. Pass the scene to preload everything in that scene, or pass a smaller set of blocks to control the load order. An empty list loads every resource currently known to the engine, so reserve that form for workflows that intentionally own the engine's complete resource set.

```kotlin highlight-android-preload-resources
        // Preload every resource referenced by the scene and its children.
        engine.block.forceLoadResources(blocks = listOf(scene))

        // Or preload only guide-owned blocks whose resources are needed next.
        val graphics = listOf(imageBlock, videoBlock, transientImageBlock)
        engine.block.forceLoadResources(blocks = graphics)
```

Use this when you want a scene fully ready before showing it to users or before starting an export workflow.

## Preloading Audio and Video

Audio and video resources require `forceLoadAVResource()` for full metadata access. The engine needs to download and parse the media file before you query properties like duration or dimensions.

```kotlin highlight-android-preload-av
    val videoBlock = engine.block.create(DesignBlockType.Graphic)
    val videoFill = engine.block.createFill(FillType.Video)
    engine.block.setShape(videoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(videoBlock, value = 350F)
    engine.block.setPositionY(videoBlock, value = 30F)
    engine.block.setWidth(videoBlock, value = 300F)
    engine.block.setHeight(videoBlock, value = 200F)
    val videoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4")
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(block = videoBlock, fill = videoFill)
    engine.block.setContentFillMode(block = videoBlock, mode = ContentFillMode.COVER)
    engine.block.appendChild(parent = page, child = videoBlock)

    engine.block.forceLoadAVResource(block = videoFill)

    val duration = engine.block.getAVResourceTotalDuration(block = videoFill)
    val videoWidth = engine.block.getVideoWidth(videoFill = videoFill)
    val videoHeight = engine.block.getVideoHeight(videoFill = videoFill)
```

Without preloading, methods like `getAVResourceTotalDuration()`, `getVideoWidth()`, and `getVideoHeight()` may return zero or incomplete values.

## Finding Transient Resources

Transient resources are scene resources whose data would be lost during scene serialization. Use `findAllTransientResources()` to discover them before saving.

```kotlin highlight-android-find-transient
// No preload call is required; this inspects resource references that cannot be serialized.
val transientResources = engine.editor.findAllTransientResources()
    .filter { (uri, _) -> uri == transientImageBufferUri }
```

Each pair contains the resource `Uri` and its size in bytes. In this example, a generated image fill uses a buffer URI, so the scene reports a transient resource that must be uploaded or otherwise persisted.

## Finding Media URIs

Get all serializable media URIs referenced in the scene with `findAllMediaURIs()`. This returns a deduplicated list of valid `http://`, `https://`, and `file://` media URIs from image, video, audio, and other media sources.

```kotlin highlight-android-find-media-uris
val mediaUris = engine.editor.findAllMediaURIs()
val persistentMediaUris = mediaUris.filter { it.scheme in listOf("http", "https", "file") }
```

Transient buffer resources are intentionally excluded, which makes this API useful for building a manifest of assets that already exist in persistent storage.

## Finding Unused Blocks

Once a scene has gone through several edits, it can accumulate blocks that are no longer attached to any scene. These dangling blocks still hold references to images, videos, and audio resources. Use `findAllUnused` to enumerate them so you can free the memory or skip relocating their resources.

```kotlin highlight-android-find-unused-blocks
val unusedBlock = engine.block.create(DesignBlockType.Graphic)
val unusedBlocks = engine.block.findAllUnused()
check(unusedBlock in unusedBlocks)
engine.block.destroy(unusedBlock)
```

Pair this with `findAllMediaURIs()` to skip relocating resources for blocks that are no longer reachable. Review ownership before calling `destroy()`: the sample destroys only the detached block it created, rather than every unused block reported by a potentially shared engine.

## Detecting MIME Types

Determine a resource's content type with `getMimeType()`. The engine downloads the resource if it is not already cached.

```kotlin highlight-android-detect-mime-type
val mimeType = engine.editor.getMimeType(uri = imageUri)
```

Common return values include `image/jpeg`, `image/png`, `video/mp4`, and `audio/mpeg`.

## Relocating Resources

Update URL mappings when resources move with `relocateResource()`. This changes the URI associated with a resource so the scene can keep working after you upload data to a CDN or migrate assets between storage locations.

```kotlin highlight-android-relocate
val relocatedImageUri = Uri.parse(
    "https://img.ly/static/ubq_samples/sample_1.jpg?cesdk-resources-guide=relocated",
)
engine.editor.relocateResource(
    currentUri = imageUri,
    relocatedUri = relocatedImageUri,
)
```

Relocation lets you keep working with the existing scene graph while switching resource access over to permanent URLs. It updates every reference to the current URI in the engine, so use a URI owned by the workflow when the engine is shared.

## Persisting Transient Resources

Android exposes `saveToString()` with `allowedResourceSchemes`. Persist transient resources by reading their bytes with `getResourceData()`, uploading those bytes, calling `relocateResource()` with the returned permanent URI, and then serializing the scene with only the schemes you want to allow.

```kotlin highlight-android-persist-transient
        val relocatedResources =
            transientResources.map { (transientUri, resourceSize) ->
                val resourceData = ByteBuffer.allocateDirect(resourceSize)
                engine.editor.getResourceData(
                    uri = transientUri,
                    chunkSize = 64 * 1024,
                ) { chunk ->
                    resourceData.put(chunk.asReadOnlyBuffer())
                    true
                }
                resourceData.flip()

                val permanentUri =
                    uploadTransientResourceToPermanentStorage(
                        sourceUri = transientUri,
                        data = resourceData.asReadOnlyBuffer(),
                    )
                engine.editor.relocateResource(
                    currentUri = transientUri,
                    relocatedUri = permanentUri,
                )
                transientImageRelocated = true
                transientUri to permanentUri
            }

        val remainingTransientResources = engine.editor.findAllTransientResources()
            .filter { (uri, _) -> uri == transientImageBufferUri }
        val sceneString =
            engine.scene.saveToString(
                scene = scene,
                allowedResourceSchemes = listOf("http", "https"),
            )
```

The sample upload helper stands in for your app's storage client and must return the URI of the uploaded bytes.

```kotlin highlight-android-upload-helper
private suspend fun uploadTransientResourceToPermanentStorage(
    sourceUri: Uri,
    data: ByteBuffer,
): Uri {
    check(data.hasRemaining()) { "Cannot upload an empty resource." }

    // Upload the bytes with your app's storage client here, then return its permanent URI.
    // This sample only creates a placeholder URL so the guide can focus on the CE.SDK flow.
    val fileName =
        sourceUri
            .lastPathSegment
            ?.takeIf { it.isNotBlank() }
            ?: "transient-resource-${data.remaining()}"
    return Uri.parse("https://your-storage.example/uploads/$fileName")
}
```

If any transient URI remains in the scene, `saveToString()` throws because the serialized scene would reference data that cannot be restored later.

## Troubleshooting

- **Slow initial render**: Preload resources with `forceLoadResources()` before showing the scene or starting an export.
- **Video metadata returns `0`**: Load the video resource with `forceLoadAVResource()` before querying duration or dimensions.
- **Unexpected transient resources**: Call `findAllTransientResources()` after paste, capture, or buffer workflows to see what still needs persistence.
- **`saveToString()` fails**: Relocate every transient URI to a supported scheme such as `https` before serializing the scene.

## Next Steps

- [Buffers](./buffers.md) — Work with in-memory data
- [Scenes](./scenes.md) — Understand scene serialization and persistence
- [Export](../export-save-publish/export.md) — Explore export options, supported formats, and configuration features for sharing or rendering output.
- [Assets](./assets.md) — Learn how assets provide external content to CE.SDK designs and how asset sources make them available programmatically.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support