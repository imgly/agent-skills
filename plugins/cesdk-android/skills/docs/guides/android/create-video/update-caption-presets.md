> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Update Caption Presets](./update-caption-presets.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-update-caption-presets/UpdateCaptionPresets.kt reference-only
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.net.Uri
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import ly.img.engine.AssetColorProperty
import ly.img.engine.AssetDefinition
import ly.img.engine.AssetPayload
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FindAssetsQuery
import ly.img.engine.SizeMode
import org.json.JSONObject
import java.io.File
import android.graphics.Color as AndroidColor

private const val CaptionPresetSourceId = "ly.img.caption.presets"
private const val CaptionPresetAssetId = "ly.img.caption.presets.neon-glow"
private const val ExistingCaptionPresetAssetId = "ly.img.caption.presets.existing"

private val CaptionPresetContentJson = """
    {
      "version": "3.0.0",
      "id": "ly.img.caption.presets",
      "assets": [
        {
          "id": "ly.img.caption.presets.neon-glow",
          "label": { "en": "Neon Glow" },
          "meta": {
            "uri": "{{base_url}}/ly.img.caption.presets/presets/neon-glow.preset",
            "thumbUri": "{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png",
            "mimeType": "application/ubq-blocks-string"
          },
          "payload": {
            "properties": [
              {
                "type": "Color",
                "property": "fill/solid/color",
                "value": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 1.0 },
                "defaultValue": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 1.0 }
              },
              {
                "type": "Color",
                "property": "dropShadow/color",
                "value": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 0.8 },
                "defaultValue": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 0.8 }
              },
              {
                "type": "Color",
                "property": "backgroundColor/color",
                "value": { "r": 0.0, "g": 0.0, "b": 0.1, "a": 0.7 },
                "defaultValue": { "r": 0.0, "g": 0.0, "b": 0.1, "a": 0.7 }
              }
            ]
          }
        }
      ]
    }
""".trimIndent()

data class CaptionPresetSummary(
    val serializedPresetLength: Int,
    val presetFileUri: String,
    val presetFileLength: Long,
    val loadedPresetCount: Int,
    val loadedPresetId: String,
    val loadedPresetUri: String,
)

fun updateCaptionPresets(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
): Job = CoroutineScope(Dispatchers.Main).launch {
    runUpdateCaptionPresets(license, userId)
}

suspend fun runUpdateCaptionPresets(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
): CaptionPresetSummary {
    val engine = Engine.getInstance(id = "ly.img.engine.update-caption-presets")

    try {
        engine.start(license = license, userId = userId)
        engine.bindOffscreen(width = 1280, height = 720)

        val scene = engine.scene.createForVideo()
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = scene, child = page)
        engine.block.setWidth(page, value = 1280F)
        engine.block.setHeight(page, value = 720F)

        val textBlock = engine.block.create(DesignBlockType.Text)
        engine.block.appendChild(parent = page, child = textBlock)

        engine.block.replaceText(textBlock, text = "NEON GLOW")
        engine.block.setPositionX(textBlock, value = 50F)
        engine.block.setPositionY(textBlock, value = 200F)
        engine.block.setWidth(textBlock, value = 600F)
        engine.block.setHeightMode(textBlock, mode = SizeMode.AUTO)

        val neonCyan = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 1F)
        engine.block.setTextColor(block = textBlock, color = neonCyan)
        engine.block.setFillSolidColor(block = textBlock, color = neonCyan)

        engine.block.setTextFontSize(block = textBlock, fontSize = 48F)

        engine.block.setDropShadowEnabled(block = textBlock, enabled = true)
        engine.block.setDropShadowColor(
            block = textBlock,
            color = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 0.8F),
        )
        engine.block.setDropShadowBlurRadiusX(block = textBlock, blurRadiusX = 20F)
        engine.block.setDropShadowBlurRadiusY(block = textBlock, blurRadiusY = 20F)
        engine.block.setDropShadowOffsetX(block = textBlock, offsetX = 0F)
        engine.block.setDropShadowOffsetY(block = textBlock, offsetY = 0F)

        engine.block.setBackgroundColorEnabled(block = textBlock, enabled = true)
        engine.block.setBackgroundColor(
            block = textBlock,
            color = Color.fromRGBA(r = 0F, g = 0F, b = 0.1F, a = 0.7F),
        )

        val serializedPreset = engine.block.saveToString(
            blocks = listOf(textBlock),
            allowedResourceSchemes = listOf("bundle", "file", "http", "https"),
        )
        check(serializedPreset.isNotBlank()) { "Serialized caption preset was empty." }

        val localPresetSource = createLocalCaptionPresetSource(serializedPreset)
        check(localPresetSource.presetFile.exists()) {
            "Caption preset file was not written."
        }
        check(localPresetSource.presetFile.length() > 0) {
            "Caption preset file was empty."
        }
        check(localPresetSource.presetFile.readText() == serializedPreset) {
            "Caption preset file did not match the serialized preset."
        }

        seedExistingCaptionPresetSource(engine, localPresetSource.baseUri)
        val loadedPresets = loadCaptionPresetSource(
            engine = engine,
            assetsBaseUri = localPresetSource.baseUri,
        )
        check(loadedPresets.loadedPresetId == CaptionPresetAssetId)
        val loadedPresetFile = File(
            checkNotNull(Uri.parse(loadedPresets.loadedPresetUri).path) {
                "Loaded caption preset URI did not resolve to a file path."
            },
        )
        check(loadedPresetFile.canonicalFile == localPresetSource.presetFile.canonicalFile) {
            "Loaded caption preset URI did not point to the generated preset file."
        }
        check(loadedPresetFile.exists() && loadedPresetFile.length() > 0) {
            "Loaded caption preset file was missing or empty."
        }
        val existingPreset = engine.asset.fetchAsset(
            sourceId = CaptionPresetSourceId,
            assetId = ExistingCaptionPresetAssetId,
        )
        check(existingPreset?.id == ExistingCaptionPresetAssetId) {
            "Existing caption preset was removed while loading a custom preset."
        }

        return CaptionPresetSummary(
            serializedPresetLength = serializedPreset.length,
            presetFileUri = localPresetSource.presetUri.toString(),
            presetFileLength = localPresetSource.presetFile.length(),
            loadedPresetCount = loadedPresets.loadedPresetCount,
            loadedPresetId = loadedPresets.loadedPresetId,
            loadedPresetUri = loadedPresets.loadedPresetUri,
        )
    } finally {
        engine.stop()
    }
}

fun createCaptionPresetAssetDefinitionWithProperties(
    presetUri: String,
    thumbnailUri: String,
): AssetDefinition = AssetDefinition(
    id = CaptionPresetAssetId,
    label = mapOf("en" to "Neon Glow"),
    meta = mapOf(
        "uri" to presetUri,
        "thumbUri" to thumbnailUri,
        "mimeType" to "application/ubq-blocks-string",
    ),
    payload = AssetPayload(
        properties = listOf(
            AssetColorProperty(
                property = "fill/solid/color",
                value = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 1F),
                defaultValue = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 1F),
            ),
            AssetColorProperty(
                property = "backgroundColor/color",
                value = Color.fromRGBA(r = 0F, g = 0F, b = 0.1F, a = 0.7F),
                defaultValue = Color.fromRGBA(r = 0F, g = 0F, b = 0.1F, a = 0.7F),
            ),
            AssetColorProperty(
                property = "dropShadow/color",
                value = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 0.8F),
                defaultValue = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 0.8F),
            ),
        ),
    ),
)

private data class LocalCaptionPresetSource(
    val baseUri: Uri,
    val presetFile: File,
    val presetUri: Uri,
)

private fun createLocalCaptionPresetSource(serializedPreset: String): LocalCaptionPresetSource {
    val baseDirectory = File.createTempFile("caption-presets", "").apply {
        delete()
        mkdirs()
    }
    val sourceDirectory = File(baseDirectory, CaptionPresetSourceId).apply { mkdirs() }
    File(sourceDirectory, "content.json").writeText(CaptionPresetContentJson)

    val presetsDirectory = File(sourceDirectory, "presets").apply { mkdirs() }
    val presetFile = File(presetsDirectory, "neon-glow.preset")
    presetFile.writeText(serializedPreset)

    val thumbnailsDirectory = File(sourceDirectory, "thumbnails").apply { mkdirs() }
    writeCaptionPresetThumbnail(File(thumbnailsDirectory, "neon-glow.png"))

    return LocalCaptionPresetSource(
        baseUri = Uri.fromFile(baseDirectory),
        presetFile = presetFile,
        presetUri = Uri.fromFile(presetFile),
    )
}

private fun seedExistingCaptionPresetSource(
    engine: Engine,
    assetsBaseUri: Uri,
) {
    if (engine.asset.findAllSources().contains(CaptionPresetSourceId)) {
        engine.asset.removeAsset(
            sourceId = CaptionPresetSourceId,
            assetId = ExistingCaptionPresetAssetId,
        )
    } else {
        engine.asset.addLocalSource(CaptionPresetSourceId, emptyList())
    }

    val sourceBaseUri = assetsBaseUri
        .buildUpon()
        .appendPath(CaptionPresetSourceId)
        .build()

    engine.asset.addAsset(
        sourceId = CaptionPresetSourceId,
        asset = AssetDefinition(
            id = ExistingCaptionPresetAssetId,
            label = mapOf("en" to "Existing Caption Preset"),
            meta = mapOf(
                "uri" to sourceBaseUri
                    .buildUpon()
                    .appendPath("presets")
                    .appendPath("neon-glow.preset")
                    .build()
                    .toString(),
                "thumbUri" to sourceBaseUri
                    .buildUpon()
                    .appendPath("thumbnails")
                    .appendPath("neon-glow.png")
                    .build()
                    .toString(),
                "mimeType" to "application/ubq-blocks-string",
            ),
        ),
    )
}

private fun writeCaptionPresetThumbnail(outputFile: File) {
    val bitmap = Bitmap.createBitmap(320, 180, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    canvas.drawColor(AndroidColor.rgb(4, 8, 20))

    val glowPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = AndroidColor.CYAN
        textAlign = Paint.Align.CENTER
        textSize = 48F
        setShadowLayer(18F, 0F, 0F, AndroidColor.CYAN)
    }
    val baseline = (bitmap.height - glowPaint.descent() - glowPaint.ascent()) / 2F
    canvas.drawText("NEON GLOW", bitmap.width / 2F, baseline, glowPaint)

    outputFile.outputStream().use { stream ->
        check(bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)) {
            "Failed to write caption preset thumbnail."
        }
    }
    check(outputFile.length() > 0) { "Caption preset thumbnail was empty." }
}

data class LoadedCaptionPresets(
    val loadedPresetCount: Int,
    val loadedPresetId: String,
    val loadedPresetUri: String,
)

suspend fun loadCaptionPresetSource(
    engine: Engine,
    assetsBaseUri: Uri,
): LoadedCaptionPresets {
    val contentJsonUri = assetsBaseUri
        .buildUpon()
        .appendPath(CaptionPresetSourceId)
        .appendPath("content.json")
        .build()
    val customPresetIds = JSONObject(CaptionPresetContentJson)
        .getJSONArray("assets")
        .let { assets ->
            (0 until assets.length()).map { index ->
                assets.getJSONObject(index).getString("id")
            }
        }

    val sourceExists = engine.asset.findAllSources().contains(CaptionPresetSourceId)
    if (sourceExists) {
        // Remove every preset defined by this manifest before reloading it.
        // Other presets in the same source stay available.
        customPresetIds.forEach { assetId ->
            engine.asset.removeAsset(
                sourceId = CaptionPresetSourceId,
                assetId = assetId,
            )
        }
    }

    engine.asset.addLocalSourceFromJSON(contentUri = contentJsonUri)

    val presets = engine.asset.findAssets(
        sourceId = CaptionPresetSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    val loadedPresetAssets = customPresetIds.map { assetId ->
        checkNotNull(
            engine.asset.fetchAsset(
                sourceId = CaptionPresetSourceId,
                assetId = assetId,
            ),
        ) { "Caption preset $assetId was not loaded." }
    }
    val loadedPreset = loadedPresetAssets.first()
    val loadedPresetUri = checkNotNull(loadedPreset.meta?.get("uri")) {
        "Loaded caption preset was missing a preset URI."
    }

    return LoadedCaptionPresets(
        loadedPresetCount = presets.assets.size,
        loadedPresetId = loadedPreset.id,
        loadedPresetUri = loadedPresetUri,
    )
}
```

Extend CE.SDK video captions with custom preset files by styling a text block,
serializing it, and publishing a caption preset content.json manifest.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-update-caption-presets)

Caption presets are serialized text or caption blocks plus metadata that points
to a thumbnail and optional customizable properties. Android can create the
preset file and load the asset definitions for your app code; the built-in
Android editor UI does not currently include a caption presets panel.

<EngineReferenceNote {...props} />

This guide covers the caption presets folder structure, how to create a styled
text block, how to serialize it as a preset file, how to define customizable
colors in content.json, and how to load the custom asset source on Android.

## Understanding the Caption Presets Structure

### Folder Organization

Caption presets use an asset source folder that contains a manifest, serialized
preset files, and thumbnails. Host the folder that contains
`ly.img.caption.presets/` and pass that folder as the base URI when loading the
asset source.

```text
assets/v5/ly.img.caption.presets/
├── content.json
├── presets/
│   └── neon-glow.preset
└── thumbnails/
    └── neon-glow.png
```

The `content.json` file lists the preset IDs and metadata. The `presets/`
folder stores the string returned by `engine.block.saveToString()`, and the
`thumbnails/` folder stores preview images for your picker UI.

### content.json Format

The manifest needs a version, the caption presets source ID, and one asset entry
per preset. Use `{{base_url}}` in URI fields so the Android loader can replace
it with the base URI you provide.

```json file=@cesdk_android_examples/engine-guides-update-caption-presets/assets/ly.img.caption.presets/content.json
{
  "version": "3.0.0",
  "id": "ly.img.caption.presets",
  "assets": [
    {
      "id": "ly.img.caption.presets.neon-glow",
      "label": { "en": "Neon Glow" },
      "meta": {
        "uri": "{{base_url}}/ly.img.caption.presets/presets/neon-glow.preset",
        "thumbUri": "{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png",
        "mimeType": "application/ubq-blocks-string"
      },
      "payload": {
        "properties": [
          {
            "type": "Color",
            "property": "fill/solid/color",
            "value": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 1.0 },
            "defaultValue": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 1.0 }
          },
          {
            "type": "Color",
            "property": "dropShadow/color",
            "value": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 0.8 },
            "defaultValue": { "r": 0.0, "g": 1.0, "b": 1.0, "a": 0.8 }
          },
          {
            "type": "Color",
            "property": "backgroundColor/color",
            "value": { "r": 0.0, "g": 0.0, "b": 0.1, "a": 0.7 },
            "defaultValue": { "r": 0.0, "g": 0.0, "b": 0.1, "a": 0.7 }
          }
        ]
      }
    }
  ]
}
```

Each asset entry needs a stable ID, localized label, preset URI, thumbnail URI,
and `application/ubq-blocks-string` mime type. The optional
`payload.properties` array describes which colors your own preset UI can expose
for customization.

## Creating Custom Caption Presets

### Designing a Caption Style

Start with a video scene, a page, and a text block because caption presets are
based on text styling. The sample positions the block in a video-sized scene so
the serialized preset has a real block frame and sample caption text.

```kotlin highlight-android-create-text-block
        val scene = engine.scene.createForVideo()
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = scene, child = page)
        engine.block.setWidth(page, value = 1280F)
        engine.block.setHeight(page, value = 720F)

        val textBlock = engine.block.create(DesignBlockType.Text)
        engine.block.appendChild(parent = page, child = textBlock)

        engine.block.replaceText(textBlock, text = "NEON GLOW")
        engine.block.setPositionX(textBlock, value = 50F)
        engine.block.setPositionY(textBlock, value = 200F)
        engine.block.setWidth(textBlock, value = 600F)
        engine.block.setHeightMode(textBlock, mode = SizeMode.AUTO)
```

The text block is the preset source. When you save the preset string, CE.SDK
keeps its text, frame, and style properties.

### Styling with Colors and Font Size

Set the text range color and the preset fill color to the same cyan value. The
manifest lists the customizable fill as `fill/solid/color` because it stores
engine property paths.

```kotlin highlight-android-style-text-color
val neonCyan = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 1F)
engine.block.setTextColor(block = textBlock, color = neonCyan)
engine.block.setFillSolidColor(block = textBlock, color = neonCyan)
```

Set the font size on the text range so captions that use the preset have the
same typography.

```kotlin highlight-android-style-font
engine.block.setTextFontSize(block = textBlock, fontSize = 48F)
```

### Adding Visual Effects

Drop shadow creates the neon glow. The sample uses the same cyan value as the
text color and increases the blur radius while keeping the offset at zero.

```kotlin highlight-android-style-drop-shadow
engine.block.setDropShadowEnabled(block = textBlock, enabled = true)
engine.block.setDropShadowColor(
    block = textBlock,
    color = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 0.8F),
)
engine.block.setDropShadowBlurRadiusX(block = textBlock, blurRadiusX = 20F)
engine.block.setDropShadowBlurRadiusY(block = textBlock, blurRadiusY = 20F)
engine.block.setDropShadowOffsetX(block = textBlock, offsetX = 0F)
engine.block.setDropShadowOffsetY(block = textBlock, offsetY = 0F)
```

Add a semi-transparent background color when the caption needs contrast against
busy video frames.

```kotlin highlight-android-style-background
engine.block.setBackgroundColorEnabled(block = textBlock, enabled = true)
engine.block.setBackgroundColor(
    block = textBlock,
    color = Color.fromRGBA(r = 0F, g = 0F, b = 0.1F, a = 0.7F),
)
```

### Serializing the Preset

Serialize the styled block with `engine.block.saveToString()`. Save the returned
string as the file referenced by `meta.uri`, for example
`presets/neon-glow.preset`.

```kotlin highlight-android-serialize-preset
val serializedPreset = engine.block.saveToString(
    blocks = listOf(textBlock),
    allowedResourceSchemes = listOf("bundle", "file", "http", "https"),
)
check(serializedPreset.isNotBlank()) { "Serialized caption preset was empty." }
```

The serialized string contains the block properties and references to allowed
resource schemes. Keep the preset file and thumbnail reachable from the same
base folder as `content.json`.

## Defining Customizable Properties

### Color Properties

The `payload.properties` array describes the color controls your integration can
show for a preset. Each color property includes the engine property path plus
the current and default RGBA values in the 0-1 range.

Use these property paths for caption color customization:

- `fill/solid/color`: Text fill color
- `backgroundColor/color`: Background color behind the text
- `dropShadow/color`: Drop shadow color
- `stroke/color`: Stroke or outline color

Android's generic asset source loader preserves preset labels and metadata from
content.json. It does not map `payload.properties` into
`AssetDefinition.payload.properties`, so parse that section in your app when
loading a JSON manifest. If you add preset entries yourself, construct the same
metadata with `AssetColorProperty` values:

```kotlin highlight-android-manual-color-properties
fun createCaptionPresetAssetDefinitionWithProperties(
    presetUri: String,
    thumbnailUri: String,
): AssetDefinition = AssetDefinition(
    id = CaptionPresetAssetId,
    label = mapOf("en" to "Neon Glow"),
    meta = mapOf(
        "uri" to presetUri,
        "thumbUri" to thumbnailUri,
        "mimeType" to "application/ubq-blocks-string",
    ),
    payload = AssetPayload(
        properties = listOf(
            AssetColorProperty(
                property = "fill/solid/color",
                value = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 1F),
                defaultValue = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 1F),
            ),
            AssetColorProperty(
                property = "backgroundColor/color",
                value = Color.fromRGBA(r = 0F, g = 0F, b = 0.1F, a = 0.7F),
                defaultValue = Color.fromRGBA(r = 0F, g = 0F, b = 0.1F, a = 0.7F),
            ),
            AssetColorProperty(
                property = "dropShadow/color",
                value = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 0.8F),
                defaultValue = Color.fromRGBA(r = 0F, g = 1F, b = 1F, a = 0.8F),
            ),
        ),
    ),
)
```

## Updating the content.json File

### Adding a New Preset Entry

Add one object to the `assets` array for every preset. Keep the ID unique within
the `ly.img.caption.presets` namespace and make the URI fields point to the
serialized preset file and thumbnail.

The complete example above adds the `ly.img.caption.presets.neon-glow` preset
with customizable text, shadow, and background colors. Use the same structure
for additional caption styles.

### Complete content.json Example

Use the `content.json` file shown earlier in this guide as a starting point for
your hosted manifest.

## Hosting and Serving Custom Presets

### Server Setup

Prepare the asset folder on your server or in your Android app assets:

1. Create a folder that contains `ly.img.caption.presets/content.json`.
2. Save each serialized preset string in `ly.img.caption.presets/presets/`.
3. Save each PNG thumbnail in `ly.img.caption.presets/thumbnails/`.
4. Serve remote files over HTTP or HTTPS.
5. If the same manifest is shared with the Web SDK, configure CORS headers for
   browser access.

### Verifying File Access

Before loading the source, make sure `content.json`, each preset file, and each
thumbnail URL returns the expected file. If you bundle the files in Android
assets, use a `file:///android_asset` base URI.

## Loading Custom Presets into CE.SDK

### Base URI Configuration

Load the manifest with `engine.asset.addLocalSourceFromJSON()`. Point `contentUri`
at the `content.json` inside your `ly.img.caption.presets/` folder; the loader
resolves `{{base_url}}` placeholders relative to that file's parent directory.

```kotlin highlight-android-load-custom-presets
    val contentJsonUri = assetsBaseUri
        .buildUpon()
        .appendPath(CaptionPresetSourceId)
        .appendPath("content.json")
        .build()
    val customPresetIds = JSONObject(CaptionPresetContentJson)
        .getJSONArray("assets")
        .let { assets ->
            (0 until assets.length()).map { index ->
                assets.getJSONObject(index).getString("id")
            }
        }

    val sourceExists = engine.asset.findAllSources().contains(CaptionPresetSourceId)
    if (sourceExists) {
        // Remove every preset defined by this manifest before reloading it.
        // Other presets in the same source stay available.
        customPresetIds.forEach { assetId ->
            engine.asset.removeAsset(
                sourceId = CaptionPresetSourceId,
                assetId = assetId,
            )
        }
    }

    engine.asset.addLocalSourceFromJSON(contentUri = contentJsonUri)

    val presets = engine.asset.findAssets(
        sourceId = CaptionPresetSourceId,
        query = FindAssetsQuery(page = 0, perPage = 10),
    )
    val loadedPresetAssets = customPresetIds.map { assetId ->
        checkNotNull(
            engine.asset.fetchAsset(
                sourceId = CaptionPresetSourceId,
                assetId = assetId,
            ),
        ) { "Caption preset $assetId was not loaded." }
    }
```

This makes the preset entries discoverable through `engine.asset.findAssets()`.
When reloading your manifest, remove every custom preset asset ID from that
manifest before adding it again so existing presets in the same source stay
available. Use the result in your own Android caption preset picker or share
the same hosted manifest with platforms that provide a built-in preset UI.

## Troubleshooting

### Preset Not Loading

- Verify `content.json` is reachable at
  `{baseUri}/ly.img.caption.presets/content.json`.
- Confirm `meta.mimeType` is `application/ubq-blocks-string`.
- Use `{{base_url}}` only in URI fields that should be resolved from the base
  URI.

### Preset Styles Not Applying

- Serialize a text block or caption block; other block types are not caption
  preset sources.
- Save the exact string returned by `engine.block.saveToString()`.
- Keep property paths in `payload.properties` aligned with real caption or text
  block properties.

### Thumbnail Not Displaying

- Check that `meta.thumbUri` points to an existing PNG file.
- Keep the thumbnail under the same hosted or bundled base folder as
  `content.json`.

### Custom Colors Not Working

- Make each customizable property use `type: "Color"`.
- Store `value` and `defaultValue` with `r`, `g`, `b`, and `a` values from 0 to
  1\.
- Apply those values from your custom UI to caption blocks with the matching
  engine property paths.

## API Reference

| Method                                                                 | Category | Purpose                                      |
| ---------------------------------------------------------------------- | -------- | -------------------------------------------- |
| `engine.block.create(blockType=DesignBlockType.Text)`                  | Block    | Create the text block used as preset source  |
| `engine.block.replaceText(block=_, text=_)`                            | Block    | Set the sample caption text                  |
| `engine.block.setTextColor(block=_, color=_)`                          | Block    | Set the text fill color                      |
| `engine.block.setFillSolidColor(block=_, color=_)`                     | Block    | Set the customizable fill color              |
| `engine.block.setTextFontSize(block=_, fontSize=_)`                    | Block    | Set the caption font size                    |
| `engine.block.setDropShadowEnabled(block=_, enabled=_)`                | Block    | Enable a glow or shadow effect               |
| `engine.block.setDropShadowColor(block=_, color=_)`                    | Block    | Set the shadow color                         |
| `engine.block.setDropShadowBlurRadiusX(block=_, blurRadiusX=_)`       | Block    | Set the shadow blur on the x axis            |
| `engine.block.setDropShadowBlurRadiusY(block=_, blurRadiusY=_)`       | Block    | Set the shadow blur on the y axis            |
| `engine.block.setDropShadowOffsetX(block=_, offsetX=_)`                | Block    | Set the shadow x offset                      |
| `engine.block.setDropShadowOffsetY(block=_, offsetY=_)`                | Block    | Set the shadow y offset                      |
| `engine.block.setBackgroundColorEnabled(block=_, enabled=_)`           | Block    | Enable a background behind the text          |
| `engine.block.setBackgroundColor(block=_, color=_)`                    | Block    | Set the background color                     |
| `engine.block.saveToString(blocks=_, allowedResourceSchemes=_)`        | Block    | Serialize the styled block as preset data    |
| `engine.asset.removeAsset(sourceId=_, assetId=_)`                      | Asset    | Reload custom presets without clearing source |
| `engine.asset.addLocalSourceFromJSON(contentUri=_)`                    | Asset    | Load preset asset definitions from JSON      |
| `engine.asset.findAssets(sourceId=_, query=_)`                         | Asset    | Read loaded preset entries                   |
| `engine.asset.fetchAsset(sourceId=_, assetId=_)`                       | Asset    | Verify one preset entry by ID                |

## Next Steps

- [Add Captions](../edit-video/add-captions.md) - Add captions to videos and understand caption tracks
- [Import Remote Assets](../import-media/from-remote-source/remote-asset.md) - Load asset definitions from remote JSON files hosted on CDNs or servers into CE.SDK's asset library with filtering and custom base URLs.
- [Text Styling](../text/styling.md) - Apply fonts, colors, alignment, and other styling options to customize text appearance



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support