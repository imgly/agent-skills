> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Store Custom Metadata](./store-custom-metadata.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-store-metadata/StoreMetadata.kt reference-only
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ShapeType
import org.json.JSONObject

data class StoreMetadata(
    val externalId: String?,
    val metadataEntries: Map<String, String>,
    val generationModel: String,
    val hasUploadedByAfterRemoval: Boolean,
    val remainingKeys: List<String>,
    val persistedExternalId: String,
)

suspend fun storeCustomMetadata(engine: Engine): StoreMetadata {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val trackedBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(trackedBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(trackedBlock, value = 400F)
    engine.block.setHeight(trackedBlock, value = 300F)
    engine.block.setPositionX(trackedBlock, value = 200F)
    engine.block.setPositionY(trackedBlock, value = 150F)
    engine.block.appendChild(parent = page, child = trackedBlock)

    engine.block.setMetadata(trackedBlock, key = "externalId", value = "asset-12345")
    engine.block.setMetadata(trackedBlock, key = "source", value = "user-upload")
    engine.block.setMetadata(trackedBlock, key = "uploadedBy", value = "designer@example.com")

    val externalId = if (engine.block.hasMetadata(trackedBlock, key = "externalId")) {
        engine.block.getMetadata(trackedBlock, key = "externalId")
    } else {
        null
    }

    val metadataEntries = engine.block
        .findAllMetadata(trackedBlock)
        .associateWith { key -> engine.block.getMetadata(trackedBlock, key = key) }

    val generationInfo = JSONObject()
        .put("source", "internal-generator")
        .put("model", "image-model-v1")
        .put("appVersion", "2026.1")

    engine.block.setMetadata(
        trackedBlock,
        key = "generationInfo",
        value = generationInfo.toString(),
    )

    val decodedInfo = JSONObject(engine.block.getMetadata(trackedBlock, key = "generationInfo"))
    val generationModel = decodedInfo.getString("model")

    if (engine.block.hasMetadata(trackedBlock, key = "uploadedBy")) {
        engine.block.removeMetadata(trackedBlock, key = "uploadedBy")
    }

    val hasUploadedByAfterRemoval = engine.block.hasMetadata(trackedBlock, key = "uploadedBy")
    val remainingKeys = engine.block.findAllMetadata(trackedBlock)

    val savedScene = engine.scene.saveToString(scene = scene)
    engine.scene.load(scene = savedScene)

    val reloadedBlock = engine.block.findByType(DesignBlockType.Graphic).first()
    val persistedExternalId = engine.block.getMetadata(reloadedBlock, key = "externalId")

    return StoreMetadata(
        externalId = externalId,
        metadataEntries = metadataEntries,
        generationModel = generationModel,
        hasUploadedByAfterRemoval = hasUploadedByAfterRemoval,
        remainingKeys = remainingKeys,
        persistedExternalId = persistedExternalId,
    )
}
```

Attach custom key-value metadata to design blocks for tracking asset origins,
storing application state, or linking blocks to external systems.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260809/engine-guides-store-metadata)

<EngineReferenceNote {...props} />

Metadata lets you store string key-value pairs on any design block. The data is invisible to end users, but it is saved with the scene and restored when the scene is loaded again.

This guide covers how to set, retrieve, list, remove, and persist metadata on blocks. The snippets use a block named `trackedBlock`; in your app, pass the block you want to tag.

## Set Metadata

Use `engine.block.setMetadata()` to attach a key-value pair to a block. Both the key and value are strings. If the key already exists, the new value replaces the old one.

```kotlin highlight-android-set-metadata
engine.block.setMetadata(trackedBlock, key = "externalId", value = "asset-12345")
engine.block.setMetadata(trackedBlock, key = "source", value = "user-upload")
engine.block.setMetadata(trackedBlock, key = "uploadedBy", value = "designer@example.com")
```

You can attach multiple metadata entries to the same block. Each entry is independent and can be read, updated, or removed by key.

## Get Metadata

Use `engine.block.hasMetadata()` before `engine.block.getMetadata()` when the key may be absent. `getMetadata()` fails if the key does not exist, so the guard keeps optional reads explicit.

```kotlin highlight-android-get-metadata
val externalId = if (engine.block.hasMetadata(trackedBlock, key = "externalId")) {
    engine.block.getMetadata(trackedBlock, key = "externalId")
} else {
    null
}
```

This pattern is useful when metadata comes from user-generated templates, imported scenes, or older scene versions.

## List All Metadata Keys

Use `engine.block.findAllMetadata()` to list every metadata key stored on a block. The sample turns those keys into a map so the app can inspect or sync the current metadata state.

```kotlin highlight-android-find-all-metadata
val metadataEntries = engine.block
    .findAllMetadata(trackedBlock)
    .associateWith { key -> engine.block.getMetadata(trackedBlock, key = key) }
```

For blocks without metadata, `engine.block.findAllMetadata()` returns an empty list.

## Store Structured Data

Metadata values are strings. To store structured data, serialize the object first and parse it again after reading the value.

```kotlin highlight-android-store-structured-data
    val generationInfo = JSONObject()
        .put("source", "internal-generator")
        .put("model", "image-model-v1")
        .put("appVersion", "2026.1")

    engine.block.setMetadata(
        trackedBlock,
        key = "generationInfo",
        value = generationInfo.toString(),
    )

    val decodedInfo = JSONObject(engine.block.getMetadata(trackedBlock, key = "generationInfo"))
    val generationModel = decodedInfo.getString("model")
```

This works for app-owned configuration, generation parameters, creator details, or any small payload that can be represented as a string.

## Remove Metadata

Use `engine.block.removeMetadata()` to delete a key-value pair. Guard with `engine.block.hasMetadata()` when the key may not be present.

```kotlin highlight-android-remove-metadata
if (engine.block.hasMetadata(trackedBlock, key = "uploadedBy")) {
    engine.block.removeMetadata(trackedBlock, key = "uploadedBy")
}
```

After removal, read the metadata state again when your app needs to update UI, sync state, or verify a cleanup step.

```kotlin highlight-android-verify-removal
val hasUploadedByAfterRemoval = engine.block.hasMetadata(trackedBlock, key = "uploadedBy")
val remainingKeys = engine.block.findAllMetadata(trackedBlock)
```

## Metadata Persistence

Metadata is preserved when you save scene data with `saveToString()` or `saveToArchive()`. Reload either kind with `engine.scene.load()`: pass the scene string directly, or write the archive to a URI first and pass that.

```kotlin highlight-android-metadata-persistence
    val savedScene = engine.scene.saveToString(scene = scene)
    engine.scene.load(scene = savedScene)

    val reloadedBlock = engine.block.findByType(DesignBlockType.Graphic).first()
    val persistedExternalId = engine.block.getMetadata(reloadedBlock, key = "externalId")
```

> **Note:** Metadata only travels with scene data. Exporting to final output formats such
> as PNG, JPEG, PDF, or MP4 writes the exported asset, not the editable scene
> structure or its metadata.

## Troubleshooting

### getMetadata Fails

If `getMetadata()` fails, the key is not set on the block. Check with `hasMetadata()` before retrieving optional metadata.

### Metadata Is Missing After Reloading

Confirm that your app saves editable scene data and reloads it with `engine.scene.load()`: pass strings from `engine.scene.saveToString()` directly, and write archives from `engine.scene.saveToArchive()` to a URI first. Image, video, and PDF exports do not preserve editable block metadata.

### Metadata Values Are Large

Keep metadata values small. For large payloads, store a stable external ID or URL in metadata and keep the full data in your app backend or local storage.

## API Reference

| Method                                                  | Description                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| `engine.block.setMetadata(block=_, key=_, value=_)`     | Set or replace a metadata value on a block                       |
| `engine.block.getMetadata(block=_, key=_)`              | Read the metadata value for a key                                |
| `engine.block.hasMetadata(block=_, key=_)`              | Check whether a block has a metadata key                         |
| `engine.block.findAllMetadata(block=_)`                 | List all metadata keys stored on a block                         |
| `engine.block.removeMetadata(block=_, key=_)`           | Remove a metadata key from a block                               |
| `engine.scene.saveToString(scene=_)`                    | Serialize the editable scene data as a string                    |
| `engine.scene.saveToArchive(scene=_)`                   | Serialize the editable scene and referenced assets as an archive |
| `engine.scene.load(scene=_)`                            | Load a scene from a serialized scene string                      |
| `engine.scene.loadArchive(archiveUri=_)`                | Load a scene archive from a URI |
| `engine.block.findByType(type=DesignBlockType.Graphic)` | Find blocks of a specific type after loading                     |

## Next Steps

- [Save](./save.md) — Save editable scenes and blocks as strings or self-contained
  archives.
- [Load Scene](../open-the-editor/load-scene.md) — Load scenes from remote URLs, serialized
  strings, and archives.
- [Blocks](../concepts/blocks.md) — Understand the block types and hierarchy that
  custom metadata attaches to.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support