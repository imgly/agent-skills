> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Replace Content](./replace-content.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-replace-content/ReplaceContent.kt reference-only
import android.net.Uri
import ly.img.engine.Color
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

suspend fun replaceContent(engine: Engine): ReplaceContentResult {
    val previousVariables = engine.variable.findAll().associateWith { key ->
        engine.variable.get(key)
    }

    return try {
        previousVariables.keys.forEach(engine.variable::remove)

        val scene = engine.scene.create()
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(page, value = 1080F)
        engine.block.setHeight(page, value = 720F)
        engine.block.appendChild(parent = scene, child = page)

        val backgroundFill = engine.block.createFill(FillType.Color)
        engine.block.setFill(block = page, fill = backgroundFill)
        engine.block.setFillSolidColor(
            block = page,
            color = Color.fromHex("#FFF5EDF8"),
        )

        val headline = engine.block.create(DesignBlockType.Text)
        engine.block.setName(headline, name = "campaign-headline")
        engine.block.replaceText(headline, text = "Hello, {{first_name}}")
        engine.block.setPositionX(headline, value = 64F)
        engine.block.setPositionY(headline, value = 64F)
        engine.block.setWidth(headline, value = 540F)
        engine.block.setHeightMode(headline, mode = SizeMode.AUTO)
        engine.block.setTextFontSize(headline, fontSize = 24F)
        engine.block.setTextColor(headline, color = Color.fromHex("#FF1E1B2E"))
        engine.block.appendChild(parent = page, child = headline)

        val subtitle = engine.block.create(DesignBlockType.Text)
        engine.block.setName(subtitle, name = "campaign-subtitle")
        engine.block.replaceText(subtitle, text = "Launching in {{city}}")
        engine.block.setPositionX(subtitle, value = 64F)
        engine.block.setPositionY(subtitle, value = 260F)
        engine.block.setWidth(subtitle, value = 540F)
        engine.block.setHeightMode(subtitle, mode = SizeMode.AUTO)
        engine.block.setTextFontSize(subtitle, fontSize = 18F)
        engine.block.setTextColor(subtitle, color = Color.fromHex("#FF4B445E"))
        engine.block.appendChild(parent = page, child = subtitle)

        val imagePlaceholder = engine.block.create(DesignBlockType.Graphic)
        engine.block.setName(imagePlaceholder, name = "campaign-image")
        engine.block.setShape(imagePlaceholder, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(imagePlaceholder, value = 620F)
        engine.block.setPositionY(imagePlaceholder, value = 64F)
        engine.block.setWidth(imagePlaceholder, value = 396F)
        engine.block.setHeight(imagePlaceholder, value = 560F)
        engine.block.setContentFillMode(imagePlaceholder, mode = ContentFillMode.COVER)

        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setUri(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
        )
        engine.block.setFill(block = imagePlaceholder, fill = imageFill)
        if (engine.block.supportsPlaceholderBehavior(imageFill)) {
            engine.block.setPlaceholderBehaviorEnabled(imageFill, enabled = true)
        }
        engine.block.setPlaceholderEnabled(imagePlaceholder, enabled = true)
        engine.block.appendChild(parent = page, child = imagePlaceholder)

        val templateSceneString = engine.scene.saveToString(scene = scene)

        engine.scene.load(scene = templateSceneString)

        val namedPlaceholder = engine.block.findByName(name = "campaign-image").first()
        val namedPlaceholderName = engine.block.getName(namedPlaceholder)

        val placeholderNames = engine.block.findAllPlaceholders()
            .map { placeholder -> engine.block.getName(placeholder) }

        val placeholderFill = engine.block.getFill(namedPlaceholder)
        val imagePlaceholderSupportsBehavior =
            engine.block.supportsPlaceholderBehavior(placeholderFill)
        val imagePlaceholderEnabled = engine.block.isPlaceholderEnabled(namedPlaceholder)

        engine.variable.set(key = "first_name", value = "Alex")
        engine.variable.set(key = "city", value = "Berlin")

        val firstName = engine.variable.get(key = "first_name")

        engine.variable.set(key = "campaign_tag", value = "summer-2026")
        val variableNames = engine.variable.findAll()
        val campaignTag = engine.variable.get(key = "campaign_tag")
        engine.variable.remove(key = "campaign_tag")
        val campaignTagRemoved = "campaign_tag" !in engine.variable.findAll()

        check(campaignTag == "summer-2026")

        val replacementImageUri = Uri.parse("https://img.ly/static/ubq_samples/sample_2.jpg")
        val replacementFill = engine.block.getFill(namedPlaceholder)
        engine.block.setUri(
            block = replacementFill,
            property = "fill/image/imageFileURI",
            value = replacementImageUri,
        )
        engine.block.resetCrop(namedPlaceholder)

        val replacedImageUri = engine.block.getUri(
            block = replacementFill,
            property = "fill/image/imageFileURI",
        )

        val subtitleBlock = engine.block.findByName(name = "campaign-subtitle").first()
        engine.block.replaceText(subtitleBlock, text = "Built for Android audiences")

        val directSubtitleText = engine.block.getString(subtitleBlock, property = "text/text")

        val records = listOf(
            mapOf(
                "first_name" to "Alex",
                "city" to "Berlin",
                "image_uri" to "https://img.ly/static/ubq_samples/sample_2.jpg",
            ),
            mapOf(
                "first_name" to "Jordan",
                "city" to "Tokyo",
                "image_uri" to "https://img.ly/static/ubq_samples/sample_3.jpg",
            ),
        )

        val generatedDesigns = mutableListOf<GeneratedTemplateDesign>()
        for (record in records) {
            engine.scene.load(scene = templateSceneString)

            engine.variable.set(key = "first_name", value = record.getValue("first_name"))
            engine.variable.set(key = "city", value = record.getValue("city"))

            val imageBlock = engine.block.findByName(name = "campaign-image").first()
            val fill = engine.block.getFill(imageBlock)
            engine.block.setUri(
                block = fill,
                property = "fill/image/imageFileURI",
                value = Uri.parse(record.getValue("image_uri")),
            )
            engine.block.resetCrop(imageBlock)

            val exportPage = engine.scene.getPages().first()
            // Preload resources so remote image fills and text glyphs are ready before export.
            engine.block.forceLoadResources(blocks = listOf(exportPage))
            val pngBuffer = engine.block.export(exportPage, mimeType = MimeType.PNG)
            generatedDesigns += GeneratedTemplateDesign(
                label = record.getValue("first_name"),
                pngBuffer = pngBuffer,
            )
        }

        ReplaceContentResult(
            namedPlaceholder = namedPlaceholderName,
            placeholderNames = placeholderNames,
            imagePlaceholderSupportsBehavior = imagePlaceholderSupportsBehavior,
            imagePlaceholderEnabled = imagePlaceholderEnabled,
            firstNameVariable = firstName,
            variableNamesAfterSet = variableNames,
            campaignTagRemoved = campaignTagRemoved,
            replacedImageUri = replacedImageUri,
            directSubtitleText = directSubtitleText,
            generatedDesigns = generatedDesigns,
        )
    } finally {
        engine.variable.findAll().forEach { key ->
            runCatching { engine.variable.remove(key) }
        }
        previousVariables.forEach(engine.variable::set)
    }
}
```

```kotlin file=@cesdk_android_examples/engine-guides-replace-content/ReplaceContentResult.kt reference-only
import android.net.Uri
import java.nio.ByteBuffer

data class ReplaceContentResult(
    val namedPlaceholder: String,
    val placeholderNames: List<String>,
    val imagePlaceholderSupportsBehavior: Boolean,
    val imagePlaceholderEnabled: Boolean,
    val firstNameVariable: String,
    val variableNamesAfterSet: List<String>,
    val campaignTagRemoved: Boolean,
    val replacedImageUri: Uri,
    val directSubtitleText: String,
    val generatedDesigns: List<GeneratedTemplateDesign>,
)

data class GeneratedTemplateDesign(
    val label: String,
    val pngBuffer: ByteBuffer,
)
```

Dynamically replace content within templates using CE.SDK's placeholder and
variable systems. Find placeholder blocks by name, update text using variables,
and swap image sources programmatically.

![Generated Android template after replacing text variables and the image placeholder.](https://img.ly/docs/cesdk/android/use-templates/replace-content-4c482b/assets/android.hero.png)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-rc.0/engine-guides-replace-content)

<EngineReferenceNote {...props} />

Template content replacement enables dynamic designs by swapping placeholder content programmatically. Templates contain blocks marked as placeholders that can be located by name or discovered in bulk for batch processing. Text replacement uses the variable system with `{{variableName}}` syntax, while images are updated by modifying fill properties.

This guide covers how to find placeholder blocks, replace text using variables, swap image content, and build data-driven template workflows. It assumes you already have a template loaded — see [Templating](../concepts/templating.md) for the model behind variables and placeholders.

## Finding Placeholder Blocks

Locate replaceable content with block discovery APIs. Use `findByName()` when you know the placeholder name, and keep those names stable across template revisions.

```kotlin highlight-android-find-by-name
val namedPlaceholder = engine.block.findByName(name = "campaign-image").first()
val namedPlaceholderName = engine.block.getName(namedPlaceholder)
```

### Discover All Placeholders

Use `findAllPlaceholders()` to discover every placeholder block in a template and iterate through them programmatically.

```kotlin highlight-android-find-all-placeholders
val placeholderNames = engine.block.findAllPlaceholders()
    .map { placeholder -> engine.block.getName(placeholder) }
```

### Query Placeholder State

Graphic blocks keep their replaceable content in a fill, so placeholder behavior is queried on the fill from `getFill()`. The interactive placeholder flag stays on the containing block.

```kotlin highlight-android-query-placeholder-state
val placeholderFill = engine.block.getFill(namedPlaceholder)
val imagePlaceholderSupportsBehavior =
    engine.block.supportsPlaceholderBehavior(placeholderFill)
val imagePlaceholderEnabled = engine.block.isPlaceholderEnabled(namedPlaceholder)
```

## Text Variable Replacement

Replace text content through CE.SDK's variable system. A text block containing `{{first_name}}` or another token updates automatically when you set the matching variable with `engine.variable.set()`.

```kotlin highlight-android-text-variables
        engine.variable.set(key = "first_name", value = "Alex")
        engine.variable.set(key = "city", value = "Berlin")

        val firstName = engine.variable.get(key = "first_name")
```

### Managing Variables

List every variable currently stored on the engine with `findAll()`, read a value with `get()`, and remove values that no longer apply with `remove()`.

```kotlin highlight-android-manage-variables
engine.variable.set(key = "campaign_tag", value = "summer-2026")
val variableNames = engine.variable.findAll()
val campaignTag = engine.variable.get(key = "campaign_tag")
engine.variable.remove(key = "campaign_tag")
val campaignTagRemoved = "campaign_tag" !in engine.variable.findAll()
```

`findAll()` reports variables that have values in the current engine session. It does not scan unresolved `{{...}}` tokens from text blocks.

## Replacing Image Content

Update an image placeholder by modifying the fill's image source. Get the fill block with `getFill()`, then set the new URI on the `fill/image/imageFileURI` property with `setUri()`.

```kotlin highlight-android-replace-image
val replacementImageUri = Uri.parse("https://img.ly/static/ubq_samples/sample_2.jpg")
val replacementFill = engine.block.getFill(namedPlaceholder)
engine.block.setUri(
    block = replacementFill,
    property = "fill/image/imageFileURI",
    value = replacementImageUri,
)
engine.block.resetCrop(namedPlaceholder)
```

Resetting the crop after swapping the image keeps the placeholder framing consistent when source images have different aspect ratios.

## Direct Text Replacement

Replace the full text of a block without the variable system using `replaceText()`. This is useful when your app owns the exact final string and does not need reusable template tokens.

```kotlin highlight-android-direct-text-replacement
val subtitleBlock = engine.block.findByName(name = "campaign-subtitle").first()
engine.block.replaceText(subtitleBlock, text = "Built for Android audiences")
```

## Data-Driven Template Workflows

Build automated template population by iterating over data records. Load a fresh copy of the template for each record, update variables and placeholders, then export the page before processing the next record.

```kotlin highlight-android-data-driven
        val records = listOf(
            mapOf(
                "first_name" to "Alex",
                "city" to "Berlin",
                "image_uri" to "https://img.ly/static/ubq_samples/sample_2.jpg",
            ),
            mapOf(
                "first_name" to "Jordan",
                "city" to "Tokyo",
                "image_uri" to "https://img.ly/static/ubq_samples/sample_3.jpg",
            ),
        )

        val generatedDesigns = mutableListOf<GeneratedTemplateDesign>()
        for (record in records) {
            engine.scene.load(scene = templateSceneString)

            engine.variable.set(key = "first_name", value = record.getValue("first_name"))
            engine.variable.set(key = "city", value = record.getValue("city"))

            val imageBlock = engine.block.findByName(name = "campaign-image").first()
            val fill = engine.block.getFill(imageBlock)
            engine.block.setUri(
                block = fill,
                property = "fill/image/imageFileURI",
                value = Uri.parse(record.getValue("image_uri")),
            )
            engine.block.resetCrop(imageBlock)

            val exportPage = engine.scene.getPages().first()
            // Preload resources so remote image fills and text glyphs are ready before export.
            engine.block.forceLoadResources(blocks = listOf(exportPage))
            val pngBuffer = engine.block.export(exportPage, mimeType = MimeType.PNG)
            generatedDesigns += GeneratedTemplateDesign(
                label = record.getValue("first_name"),
                pngBuffer = pngBuffer,
            )
        }
```

Preload the page resources before export so remote image fills and text glyphs resolve before the offscreen render runs.

## Troubleshooting

### Block Not Found by Name

Verify the exact name string matches what's set in the template. Names are case-sensitive. Use `getName()` to inspect existing block names.

### Variable Not Replacing Text

Ensure the `{{variableName}}` token in the text block matches the key passed to `engine.variable.set()` exactly, including casing.

### Image Not Updating

Confirm the block has an image fill by checking that `getFill()` returns a valid fill block. Verify the URI is reachable and properly formatted.

### Placeholder State Queries Return False

For a graphic block, query `supportsPlaceholderBehavior()` on its fill from `getFill()`, not on the block. Text blocks are queried on the block directly.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.findByName(name=_)` | Find blocks by name identifier. |
| `engine.block.getName(block=_)` | Get the name of a block. |
| `engine.block.findAllPlaceholders()` | Discover all placeholder blocks in the scene. |
| `engine.block.getFill(block=_)` | Get the fill block from a graphic block. |
| `engine.block.supportsPlaceholderBehavior(block=_)` | Verify a fill or text block supports placeholder behavior. |
| `engine.block.isPlaceholderEnabled(block=_)` | Check whether placeholder interaction is enabled on a block. |
| `engine.variable.set(key=_, value=_)` | Set a text variable value for dynamic replacement. |
| `engine.variable.get(key=_)` | Get the current value of a variable. |
| `engine.variable.findAll()` | List variable names that currently have values in the engine session. |
| `engine.variable.remove(key=_)` | Remove a variable value from the engine session. |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Set the image URI on an image fill. |
| `engine.block.resetCrop(block=_)` | Reapply placeholder crop framing after swapping the image. |
| `engine.block.replaceText(block=_, text=_)` | Replace text content directly. |
| `engine.scene.load(scene=_)` | Load a serialized template scene for the next record. |
| `engine.scene.getPages()` | Get the page blocks from the current scene. |
| `engine.block.forceLoadResources(blocks=_)` | Resolve text and media resources before export. |
| `engine.block.export(block=_, mimeType=MimeType.PNG)` | Export the populated page as a PNG. |

## Next Steps

- [Data Merge](../automation/data-merge.md) — Automate filling a template from structured data records.
- [Product Variations](../automation/product-variations.md) — Generate multiple design variations from a single template.
- [Templating](../concepts/templating.md) — Learn the template model behind variables and placeholders.
- [Placeholders](../create-templates/add-dynamic-content/placeholders.md) — Configure placeholder behavior and controls in depth.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support