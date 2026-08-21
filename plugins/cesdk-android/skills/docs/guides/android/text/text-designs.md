> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Text Designs](./text-designs.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-text-text-designs/TextDesigns.kt reference-only
import android.net.Uri
import kotlinx.coroutines.delay
import kotlinx.coroutines.yield
import ly.img.engine.AssetDefinition
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.MimeType
import ly.img.engine.SizeMode
import java.io.File
import java.nio.ByteBuffer

data class TextDesignsResult(
    val componentBlock: DesignBlock,
    val insertedBlock: DesignBlock,
    val sourceId: String,
    val assetCount: Int,
    val contentJson: String,
    val archiveByteCount: Int,
    val thumbnailByteCount: Int,
    val previewPng: ByteBuffer,
)

suspend fun textDesigns(engine: Engine): TextDesignsResult {
    val sourceId = "ly.img.text.components"

    return try {
        val scene = engine.scene.create()
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(page, value = 800F)
        engine.block.setHeight(page, value = 600F)
        engine.block.appendChild(parent = scene, child = page)

        val previewFill = engine.block.createFill(FillType.Color)
        engine.block.setFill(page, fill = previewFill)
        engine.block.setFillSolidColor(block = page, color = Color.fromHex("#FFF1F5F9"))

        val textDesign = engine.block.create(DesignBlockType.Text)
        engine.block.replaceText(textDesign, text = "Launch Day")
        engine.block.setTextFontSize(textDesign, fontSize = 96F)
        engine.block.setTextColor(textDesign, color = Color.fromRGBA(r = 0.14F, g = 0.2F, b = 0.28F, a = 1F))
        engine.block.setPositionX(textDesign, value = 60F)
        engine.block.setPositionY(textDesign, value = 180F)
        engine.block.setWidthMode(textDesign, mode = SizeMode.ABSOLUTE)
        engine.block.setHeightMode(textDesign, mode = SizeMode.ABSOLUTE)
        engine.block.setWidth(textDesign, value = 680F)
        engine.block.setHeight(textDesign, value = 180F)
        engine.block.setClipped(block = textDesign, clipped = true)
        engine.block.setBoolean(textDesign, property = "text/clipLinesOutsideOfFrame", value = true)
        engine.block.setBoolean(textDesign, property = "text/automaticFontSizeEnabled", value = true)
        engine.block.setFloat(textDesign, property = "text/minAutomaticFontSize", value = 28F)
        engine.block.setFloat(textDesign, property = "text/maxAutomaticFontSize", value = 96F)
        engine.block.setScopeEnabled(block = textDesign, key = "text/edit", enabled = true)
        engine.block.setScopeEnabled(block = textDesign, key = "layer/resize", enabled = true)
        engine.block.setScopeEnabled(block = textDesign, key = "layer/rotate", enabled = false)
        engine.block.appendChild(parent = page, child = textDesign)

        engine.block.forceLoadResources(blocks = listOf(textDesign))

        waitForScheduledEngineUpdate()

        engine.block.forceLoadResources(blocks = listOf(textDesign))
        val archiveBuffer = engine.block.saveToArchive(blocks = listOf(textDesign))
        val archiveByteCount = archiveBuffer.remaining()
        val archiveFile = File.createTempFile("brand-title", ".zip").apply {
            outputStream().channel.use { channel ->
                val archiveBytes = archiveBuffer.asReadOnlyBuffer()
                while (archiveBytes.hasRemaining()) {
                    channel.write(archiveBytes)
                }
            }
        }

        val thumbnailBuffer = engine.block.export(
            block = textDesign,
            mimeType = MimeType.PNG,
            options = ExportOptions(targetWidth = 400F, targetHeight = 320F),
        )
        val thumbnailByteCount = thumbnailBuffer.remaining()
        val thumbnailFile = File.createTempFile("brand-title-thumbnail", ".png").apply {
            outputStream().channel.use { channel ->
                val thumbnailBytes = thumbnailBuffer.asReadOnlyBuffer()
                while (thumbnailBytes.hasRemaining()) {
                    channel.write(thumbnailBytes)
                }
            }
        }

        val contentJson = """
            {
              "version": "5.0.0",
              "id": "$sourceId",
              "assets": [
                {
                  "id": "$sourceId.brand-title",
                  "label": { "en": "Brand Title" },
                  "meta": {
                    "uri": "{{base_url}}/data/brand-title/blocks.blocks",
                    "thumbUri": "{{base_url}}/thumbnails/brand-title.png",
                    "mimeType": "application/ubq-blocks-string"
                  }
                }
              ]
            }
        """.trimIndent()

        if (sourceId in engine.asset.findAllSources()) {
            engine.asset.removeSource(sourceId = sourceId)
        }

        engine.asset.addLocalSource(
            sourceId = sourceId,
            supportedMimeTypes = emptyList(),
            applyAsset = { asset ->
                val archiveUri = asset.meta?.get("uri")?.let(Uri::parse)
                    ?: error("Text design asset ${asset.id} is missing meta.uri.")
                val loadedBlock = engine.block.loadFromArchive(archiveUri).first()
                val currentPage = engine.scene.getCurrentPage()
                    ?: error("Text design assets can only be inserted when the scene has a current page.")
                engine.block.appendChild(parent = currentPage, child = loadedBlock)
                loadedBlock
            },
        )

        engine.asset.addAsset(
            sourceId = sourceId,
            asset = AssetDefinition(
                id = "$sourceId.brand-title",
                label = mapOf("en" to "Brand Title"),
                meta = mapOf(
                    "uri" to Uri.fromFile(archiveFile).toString(),
                    "thumbUri" to Uri.fromFile(thumbnailFile).toString(),
                    "mimeType" to "application/ubq-blocks-string",
                ),
            ),
        )
        engine.asset.assetSourceContentsChanged(sourceId = sourceId)

        val queryResult = engine.asset.findAssets(
            sourceId = sourceId,
            query = FindAssetsQuery(page = 0, perPage = 10),
        )
        val textDesignAsset = queryResult.assets.first()
        val insertedBlock = engine.asset.applyAssetSourceAsset(
            sourceId = sourceId,
            asset = textDesignAsset,
        ) ?: error("Applying the text design should insert a block.")
        engine.block.setPositionY(insertedBlock, value = 390F)

        engine.block.forceLoadResources(blocks = listOf(page, textDesign, insertedBlock))
        val previewPng = engine.block.export(
            block = page,
            mimeType = MimeType.PNG,
            options = ExportOptions(targetWidth = 800F, targetHeight = 600F),
        )

        TextDesignsResult(
            componentBlock = textDesign,
            insertedBlock = insertedBlock,
            sourceId = sourceId,
            assetCount = queryResult.total,
            contentJson = contentJson,
            archiveByteCount = archiveByteCount,
            thumbnailByteCount = thumbnailByteCount,
            previewPng = previewPng,
        )
    } finally {
        if (sourceId in engine.asset.findAllSources()) {
            engine.asset.removeSource(sourceId = sourceId)
        }
    }
}

suspend fun registerHostedTextDesigns(
    engine: Engine,
    sourceId: String,
    contentJson: String,
    basePath: String,
): String {
    if (sourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = sourceId)
    }

    val registeredSourceId = engine.asset.addLocalSourceFromJSON(contentJSON = contentJson, basePath = basePath)
    return registeredSourceId
}

private suspend fun waitForScheduledEngineUpdate() {
    // Offscreen text layout is resolved on scheduled engine frames before export.
    repeat(3) {
        yield()
        delay(16)
    }
}
```

Create and customize text designs that users can insert from the CE.SDK asset library.

![Android text design example showing a fixed text frame with automatic font sizing](https://img.ly/docs/cesdk/android/text/text-designs-a1b2c3/assets/text-designs-android.png)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-text-text-designs)

<EngineReferenceNote {...props} />

Text designs, also known as text components, are serialized text blocks stored in an asset source. Each asset entry points to a `blocks.blocks` file and a thumbnail so the editor can show the component and insert it into the current scene.

> **Note:** The [Design Editor Starter Kit](../starterkits/design-editor.md) includes the CE.SDK editor UI that displays text design assets. This guide focuses on the Engine asset source behind that UI.

## Content.json Structure

Text design libraries use a `content.json` file with asset metadata. Keep the source ID as `ly.img.text.components` when the assets should appear in the default text components section of the CE.SDK editor UI.

| Property | Purpose |
| --- | --- |
| `version` | Asset source format version. Use `5.0.0` for current text design sources. |
| `id` | Asset source ID. Use `ly.img.text.components` for the built-in text components section. |
| `assets[].id` | Unique asset ID, usually namespaced under the source ID. |
| `assets[].label` | Localized asset label shown in the library. |
| `assets[].meta.uri` | URI of the extracted `blocks.blocks` file. |
| `assets[].meta.thumbUri` | URI of the 400x320 PNG thumbnail. |
| `assets[].meta.mimeType` | MIME type for text components: `application/ubq-blocks-string`. |

## Create a Text Design

Create a text block with a fixed frame before you serialize it as a reusable text design. The sample keeps the frame absolute, clips overflow, enables automatic font sizing, and sets min/max font-size bounds so edited text stays inside the intended layout.

```kotlin highlight-android-create-text-design
val textDesign = engine.block.create(DesignBlockType.Text)
engine.block.replaceText(textDesign, text = "Launch Day")
engine.block.setTextFontSize(textDesign, fontSize = 96F)
engine.block.setTextColor(textDesign, color = Color.fromRGBA(r = 0.14F, g = 0.2F, b = 0.28F, a = 1F))
engine.block.setPositionX(textDesign, value = 60F)
engine.block.setPositionY(textDesign, value = 180F)
engine.block.setWidthMode(textDesign, mode = SizeMode.ABSOLUTE)
engine.block.setHeightMode(textDesign, mode = SizeMode.ABSOLUTE)
engine.block.setWidth(textDesign, value = 680F)
engine.block.setHeight(textDesign, value = 180F)
engine.block.setClipped(block = textDesign, clipped = true)
engine.block.setBoolean(textDesign, property = "text/clipLinesOutsideOfFrame", value = true)
engine.block.setBoolean(textDesign, property = "text/automaticFontSizeEnabled", value = true)
engine.block.setFloat(textDesign, property = "text/minAutomaticFontSize", value = 28F)
engine.block.setFloat(textDesign, property = "text/maxAutomaticFontSize", value = 96F)
engine.block.setScopeEnabled(block = textDesign, key = "text/edit", enabled = true)
engine.block.setScopeEnabled(block = textDesign, key = "layer/resize", enabled = true)
engine.block.setScopeEnabled(block = textDesign, key = "layer/rotate", enabled = false)
engine.block.appendChild(parent = page, child = textDesign)
```

The base font size remains part of the serialized design, while automatic font sizing lets CE.SDK scale the rendered text between the configured bounds when the text changes. Edit and transform scopes control what users can change after insertion.

## Serialize the Design

Use `engine.block.saveToArchive()` for new text design libraries. The archive bundles the `blocks.blocks` file with referenced resources such as fonts and images.

```kotlin highlight-android-save-archive
engine.block.forceLoadResources(blocks = listOf(textDesign))
val archiveBuffer = engine.block.saveToArchive(blocks = listOf(textDesign))
val archiveByteCount = archiveBuffer.remaining()
val archiveFile = File.createTempFile("brand-title", ".zip").apply {
    outputStream().channel.use { channel ->
        val archiveBytes = archiveBuffer.asReadOnlyBuffer()
        while (archiveBytes.hasRemaining()) {
            channel.write(archiveBytes)
        }
    }
}
```

Extract the archive before deployment and host the complete extracted directory. Android can also load the zip archive directly when you provide a custom `applyAsset` callback, as shown below.

### Legacy: Using saveToString()

`engine.block.saveToString()` is still available for older integrations, but it does not bundle resources. Use it only when every referenced resource already has a stable URI that remains accessible wherever the text design is loaded.

## Generate a Thumbnail

Export a 400x320 PNG thumbnail for each text design. The asset library uses the thumbnail to show users what the component looks like before they insert it.

```kotlin highlight-android-export-thumbnail
val thumbnailBuffer = engine.block.export(
    block = textDesign,
    mimeType = MimeType.PNG,
    options = ExportOptions(targetWidth = 400F, targetHeight = 320F),
)
val thumbnailByteCount = thumbnailBuffer.remaining()
val thumbnailFile = File.createTempFile("brand-title-thumbnail", ".png").apply {
    outputStream().channel.use { channel ->
        val thumbnailBytes = thumbnailBuffer.asReadOnlyBuffer()
        while (thumbnailBytes.hasRemaining()) {
            channel.write(thumbnailBytes)
        }
    }
}
```

Store thumbnails next to your extracted text design files so both `uri` and `thumbUri` can use the same base URL.

## Create the content.json File

Add one asset entry per text design. The `uri` and `thumbUri` values can use the `{{base_url}}` placeholder. Pass an explicit `basePath` when registering the source so Android resolves the placeholder to the directory that contains `content.json`.

```kotlin highlight-android-create-content-json
val contentJson = """
    {
      "version": "5.0.0",
      "id": "$sourceId",
      "assets": [
        {
          "id": "$sourceId.brand-title",
          "label": { "en": "Brand Title" },
          "meta": {
            "uri": "{{base_url}}/data/brand-title/blocks.blocks",
            "thumbUri": "{{base_url}}/thumbnails/brand-title.png",
            "mimeType": "application/ubq-blocks-string"
          }
        }
      ]
    }
""".trimIndent()
```

For production hosting, keep this structure:

```text
/ly.img.text.components/
|-- content.json
|-- data/
|   `-- brand-title/
|       `-- blocks.blocks
`-- thumbnails/
    `-- brand-title.png
```

If the archive contains fonts or images, extract and host those subdirectories beside `blocks.blocks`.

## Register the Asset Source

For app-local sources or test fixtures, register a local source and provide a custom `applyAsset` callback. The snippet replaces the default text component source before registering it, then loads the saved archive and appends the inserted block to the current page.

```kotlin highlight-android-register-local-source
        if (sourceId in engine.asset.findAllSources()) {
            engine.asset.removeSource(sourceId = sourceId)
        }

        engine.asset.addLocalSource(
            sourceId = sourceId,
            supportedMimeTypes = emptyList(),
            applyAsset = { asset ->
                val archiveUri = asset.meta?.get("uri")?.let(Uri::parse)
                    ?: error("Text design asset ${asset.id} is missing meta.uri.")
                val loadedBlock = engine.block.loadFromArchive(archiveUri).first()
                val currentPage = engine.scene.getCurrentPage()
                    ?: error("Text design assets can only be inserted when the scene has a current page.")
                engine.block.appendChild(parent = currentPage, child = loadedBlock)
                loadedBlock
            },
        )

        engine.asset.addAsset(
            sourceId = sourceId,
            asset = AssetDefinition(
                id = "$sourceId.brand-title",
                label = mapOf("en" to "Brand Title"),
                meta = mapOf(
                    "uri" to Uri.fromFile(archiveFile).toString(),
                    "thumbUri" to Uri.fromFile(thumbnailFile).toString(),
                    "mimeType" to "application/ubq-blocks-string",
                ),
            ),
        )
        engine.asset.assetSourceContentsChanged(sourceId = sourceId)

        val queryResult = engine.asset.findAssets(
            sourceId = sourceId,
            query = FindAssetsQuery(page = 0, perPage = 10),
        )
        val textDesignAsset = queryResult.assets.first()
        val insertedBlock = engine.asset.applyAssetSourceAsset(
            sourceId = sourceId,
            asset = textDesignAsset,
        ) ?: error("Applying the text design should insert a block.")
        engine.block.setPositionY(insertedBlock, value = 390F)
```

After adding assets, call `engine.asset.assetSourceContentsChanged()` so the asset library and queries see the new entries.

## Host the Source for Production

After uploading the extracted files and `content.json`, load the JSON and register the hosted source with an explicit base path. The snippet removes an existing `ly.img.text.components` source first, then registers the replacement source. Use the directory that contains `content.json` as `basePath`, and keep asset paths in the JSON relative to that directory.

```kotlin highlight-android-register-hosted-source
    if (sourceId in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = sourceId)
    }

    val registeredSourceId = engine.asset.addLocalSourceFromJSON(contentJSON = contentJson, basePath = basePath)
```

When this source uses the `ly.img.text.components` ID, the CE.SDK editor UI can display its assets in the text components section.

## Troubleshooting

**Components do not appear**: Check that the source ID is `ly.img.text.components`, the source is registered, and `mimeType` is `application/ubq-blocks-string`.

**The component fails to load**: Verify that `meta.uri` points to the extracted `blocks.blocks` file, or use `loadFromArchive()` when your callback receives a zip archive.

**Thumbnails do not load**: Confirm that `thumbUri` resolves to a 400x320 PNG and that your server allows the app to fetch it.

**Fonts are missing after insertion**: Prefer `saveToArchive()` and host every extracted font file next to the extracted `blocks.blocks` file.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.block.create(blockType=_)` | Create the text block that becomes the reusable design. |
| `engine.block.replaceText(block=_, text=_)` | Set the text content. |
| `engine.block.setTextFontSize(block=_, fontSize=_)` | Set the base font size. |
| `engine.block.setTextColor(block=_, color=_)` | Set the text color. |
| `engine.block.setPositionX(block=_, value=_)` | Set the block's x position. |
| `engine.block.setPositionY(block=_, value=_)` | Set the block's y position. |
| `engine.block.setWidthMode(block=_, mode=_)` | Set the block width mode. |
| `engine.block.setHeightMode(block=_, mode=_)` | Set the block height mode. |
| `engine.block.setWidth(block=_, value=_)` | Set the fixed text frame width. |
| `engine.block.setHeight(block=_, value=_)` | Set the fixed text frame height. |
| `engine.block.setClipped(block=_, clipped=_)` | Clip rendered contents to the block frame. |
| `engine.block.setBoolean(block=_, property="text/clipLinesOutsideOfFrame", value=_)` | Hide overflowing text lines outside the fixed frame. |
| `engine.block.setBoolean(block=_, property="text/automaticFontSizeEnabled", value=_)` | Enable automatic font sizing for a bounded text frame. |
| `engine.block.setFloat(block=_, property="text/minAutomaticFontSize", value=_)` | Set the minimum automatic font size. |
| `engine.block.setFloat(block=_, property="text/maxAutomaticFontSize", value=_)` | Set the maximum automatic font size. |
| `engine.block.setScopeEnabled(block=_, key=_, enabled=_)` | Configure block-level editing scopes. |
| `engine.block.forceLoadResources(blocks=_)` | Load resources before serialization. |
| `engine.block.saveToArchive(blocks=_)` | Save text design blocks and resources to an archive. |
| `engine.block.saveToString(blocks=_, allowedResourceSchemes=_)` | Legacy string serialization without bundled resources. |
| `engine.block.export(block=_, mimeType=_, options=_)` | Export the text design thumbnail. |
| `engine.block.loadFromArchive(archiveUri=_)` | Load text design blocks from a saved archive. |
| `engine.scene.getCurrentPage()` | Read the current page before appending a loaded text design. |
| `engine.block.appendChild(parent=_, child=_)` | Attach the loaded text design to the current page. |
| `engine.asset.findAllSources()` | Check whether the default text component source is already registered. |
| `engine.asset.removeSource(sourceId=_)` | Remove an existing source before replacing it with custom text designs. |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_, applyAsset=_)` | Register a local source with custom insertion behavior. |
| `engine.asset.addAsset(sourceId=_, asset=_)` | Add a text design asset to the local source. |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notify the asset system after source content changes. |
| `engine.asset.findAssets(sourceId=_, query=_)` | Query text design assets from the source. |
| `engine.asset.applyAssetSourceAsset(sourceId=_, asset=_)` | Apply a selected text design asset to the scene. |
| `engine.asset.addLocalSourceFromJSON(contentJSON=_, basePath=_)` | Register a hosted `content.json` source with an explicit base path. |

## Next Steps

- [Serve Assets](../serve-assets.md) - Configure CE.SDK to load engine and content assets from your own servers instead of the IMG.LY CDN for production deployments.
- [Customize Fonts](./custom-fonts.md) — Load and manage custom fonts to match brand guidelines or user preferences.
- [Text Styling](./styling.md) - Apply fonts, colors, alignment, and other styling options to customize text appearance.
- [Auto-Size](./auto-size.md) - Configure text blocks to automatically adapt their dimensions or font size for dynamic content.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support