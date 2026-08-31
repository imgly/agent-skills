> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Generate From Template](./generate.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-use-templates-generate/UseTemplatesGenerate.kt reference-only
import android.net.Uri
import ly.img.engine.Color
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.FontUnit
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.nio.ByteBuffer

private val generatedTemplateVariableKeys = listOf("recipientName", "message")

suspend fun useTemplatesGenerate(
    engine: Engine,
    assetBaseUri: Uri,
): UseTemplatesGenerateResult {
    val existingVariableKeys = engine.variable.findAll().toSet()
    val previousVariables = generatedTemplateVariableKeys
        .filter(existingVariableKeys::contains)
        .associateWith(engine.variable::get)

    return try {
        generatedTemplateVariableKeys
            .filter(existingVariableKeys::contains)
            .forEach(engine.variable::remove)

        generateFromTemplate(engine = engine, assetBaseUri = assetBaseUri)
    } finally {
        val currentVariableKeys = engine.variable.findAll().toSet()
        generatedTemplateVariableKeys
            .filter(currentVariableKeys::contains)
            .forEach(engine.variable::remove)
        previousVariables.forEach { (key, value) ->
            engine.variable.set(key = key, value = value)
        }
    }
}

private suspend fun generateFromTemplate(
    engine: Engine,
    assetBaseUri: Uri,
): UseTemplatesGenerateResult {
    val templateString = createGenerateTemplate(engine = engine, assetBaseUri = assetBaseUri)

    engine.scene.load(
        scene = templateString,
        overrideEditorConfig = true,
        waitForResources = true,
    )

    val variableNames = engine.variable.findAll()
    val defaultRecipient = engine.variable.get(key = "recipientName")

    engine.variable.set(key = "recipientName", value = "Avery")
    engine.variable.set(key = "message", value = "Wishing you a wonderful year ahead!")

    val placeholders = engine.block.findAllPlaceholders()
    val imagePlaceholder = engine.block.findByName(name = "Image").first()
    val namedPlaceholder = engine.block.getName(imagePlaceholder)

    val replacementImageUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.image")
        .appendPath("images")
        .appendPath("sample_2.jpg")
        .build()
    val imageFill = engine.block.getFill(imagePlaceholder)
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = replacementImageUri,
    )
    engine.block.resetCrop(block = imagePlaceholder)

    val page = engine.scene.getPages().first()
    engine.block.forceLoadResources(blocks = listOf(page))
    val pngData = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = ExportOptions(targetWidth = 800F, targetHeight = 600F),
    ).asReadOnlyBuffer()

    val scene = requireNotNull(engine.scene.get()) { "No scene loaded for export." }
    val pdfData = engine.block.export(
        block = scene,
        mimeType = MimeType.PDF,
    ).asReadOnlyBuffer()

    val records = listOf(
        "Jordan" to "Congratulations on the new home!",
        "Riley" to "Thank you for everything.",
    )
    val batchExports = mutableListOf<ByteBuffer>()

    for ((recipientName, message) in records) {
        engine.scene.load(
            scene = templateString,
            overrideEditorConfig = true,
            waitForResources = true,
        )
        engine.variable.set(key = "recipientName", value = recipientName)
        engine.variable.set(key = "message", value = message)

        val recordPage = engine.scene.getPages().first()
        engine.block.forceLoadResources(blocks = listOf(recordPage))
        batchExports += engine.block.export(
            block = recordPage,
            mimeType = MimeType.PNG,
        ).asReadOnlyBuffer()
    }

    return UseTemplatesGenerateResult(
        variableNames = variableNames,
        defaultRecipient = defaultRecipient,
        placeholderCount = placeholders.size,
        namedPlaceholder = namedPlaceholder,
        replacementImageUri = replacementImageUri,
        pngData = pngData,
        pdfData = pdfData,
        batchExports = batchExports,
    )
}

private suspend fun createGenerateTemplate(
    engine: Engine,
    assetBaseUri: Uri,
): String {
    val scene = engine.scene.create(
        designUnit = DesignUnit.PIXEL,
        fontSizeUnit = FontUnit.PIXEL,
    )
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val pageFill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block = page, fill = pageFill)
    engine.block.setFillSolidColor(
        block = page,
        color = Color.fromHex("#F7F4EE"),
    )

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(imageBlock, name = "Image")
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageBlock, value = 50F)
    engine.block.setPositionY(imageBlock, value = 140F)
    engine.block.setWidth(imageBlock, value = 320F)
    engine.block.setHeight(imageBlock, value = 320F)
    engine.block.setContentFillMode(imageBlock, mode = ContentFillMode.COVER)

    val imageFill = engine.block.createFill(FillType.Image)
    val initialImageUri = assetBaseUri.buildUpon()
        .appendPath("ly.img.image")
        .appendPath("images")
        .appendPath("sample_1.jpg")
        .build()
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = initialImageUri,
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)
    engine.block.setPlaceholderEnabled(block = imageBlock, enabled = true)
    engine.block.appendChild(parent = page, child = imageBlock)

    val greetingBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(greetingBlock, text = "Dear {{recipientName}},")
    engine.block.setTextFontSize(greetingBlock, fontSize = 44F)
    engine.block.setTextColor(greetingBlock, color = Color.fromHex("#25211D"))
    engine.block.setPositionX(greetingBlock, value = 420F)
    engine.block.setPositionY(greetingBlock, value = 180F)
    engine.block.setWidth(greetingBlock, value = 330F)
    engine.block.setHeight(greetingBlock, value = 90F)
    engine.block.appendChild(parent = page, child = greetingBlock)

    val messageBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(messageBlock, text = "{{message}}")
    engine.block.setTextFontSize(messageBlock, fontSize = 28F)
    engine.block.setTextColor(messageBlock, color = Color.fromHex("#5D534B"))
    engine.block.setPositionX(messageBlock, value = 420F)
    engine.block.setPositionY(messageBlock, value = 280F)
    engine.block.setWidth(messageBlock, value = 320F)
    engine.block.setHeight(messageBlock, value = 160F)
    engine.block.appendChild(parent = page, child = messageBlock)

    engine.variable.set(key = "recipientName", value = "Friend")
    engine.variable.set(key = "message", value = "Best wishes")
    engine.block.forceLoadResources(blocks = listOf(page))

    return engine.scene.saveToString(scene = scene)
}
```

Turn templates into finished designs with the Android Engine API. Load a
template, populate its variables and image placeholders with your own data,
and export the result to a PNG or PDF.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260831/engine-guides-use-templates-generate)

<EngineReferenceNote {...props} />

Template generation transforms a reusable template into a finished design by populating data and exporting the result. Load a template with `engine.scene.load()`, replace its variables and placeholders with the Variable and Block APIs, then export it with `engine.block.export()`.

This guide covers loading templates, populating variables, updating placeholder content, exporting to images and PDFs, and running batch generation. To merge a template into an existing scene while keeping its canvas size, see [Apply Templates](./apply-template.md). For a deeper look at replacing content, see [Replace Content](./replace-content.md).

## Loading Templates

Load a template as the active scene before populating and exporting it. Pass a serialized string from your storage to `engine.scene.load(scene=_)`, use `engine.scene.load(sceneUri=_)` for a remote or bundled `.scene` file, or call `engine.scene.loadArchive(archiveUri=_)` for an archive that includes its assets.

Set `overrideEditorConfig = true` to import the template's registered variables and settings. The example builds and serializes an inline template for a self-contained sample; production templates normally come from your storage or a template authoring workflow.

```kotlin highlight-android-generate-load
engine.scene.load(
    scene = templateString,
    overrideEditorConfig = true,
    waitForResources = true,
)
```

## Populating Variables

Templates reference variables with `{{variableName}}` tokens in their text blocks. Setting a variable replaces every matching token throughout the scene.

### Discover Available Variables

Use `engine.variable.findAll()` to list the variables a template registers, then read a current value with `engine.variable.get()`. Variable names are case-sensitive.

```kotlin highlight-android-generate-discover-variables
val variableNames = engine.variable.findAll()
val defaultRecipient = engine.variable.get(key = "recipientName")
```

### Set Variable Values

Assign a value with `engine.variable.set()`. The matching text tokens update immediately.

```kotlin highlight-android-generate-populate-variables
engine.variable.set(key = "recipientName", value = "Avery")
engine.variable.set(key = "message", value = "Wishing you a wonderful year ahead!")
```

## Updating Placeholder Content

Templates can contain placeholder blocks for images and other content. Discover them with `engine.block.findAllPlaceholders()`, or find a known slot by its stable name with `engine.block.findByName()`.

```kotlin highlight-android-generate-find-placeholders
val placeholders = engine.block.findAllPlaceholders()
val imagePlaceholder = engine.block.findByName(name = "Image").first()
val namedPlaceholder = engine.block.getName(imagePlaceholder)
```

### Update Image Placeholders

Read the placeholder's fill with `engine.block.getFill()`, then update its image URI with `engine.block.setUri()`. The sample receives `assetBaseUri` from the host app so the URI can follow your bundled or self-hosted asset configuration.

```kotlin highlight-android-generate-update-image
val replacementImageUri = assetBaseUri.buildUpon()
    .appendPath("ly.img.image")
    .appendPath("images")
    .appendPath("sample_2.jpg")
    .build()
val imageFill = engine.block.getFill(imagePlaceholder)
engine.block.setUri(
    block = imageFill,
    property = "fill/image/imageFileURI",
    value = replacementImageUri,
)
engine.block.resetCrop(block = imagePlaceholder)
```

## Exporting to Images

Find the populated page and export it to PNG with `engine.block.export()`. `ExportOptions` controls the target dimensions and format-specific options.

```kotlin highlight-android-generate-export-image
val page = engine.scene.getPages().first()
engine.block.forceLoadResources(blocks = listOf(page))
val pngData = engine.block.export(
    block = page,
    mimeType = MimeType.PNG,
    options = ExportOptions(targetWidth = 800F, targetHeight = 600F),
).asReadOnlyBuffer()
```

## Exporting to PDF

Export the scene block with `MimeType.PDF` to include every page in a multi-page document.

```kotlin highlight-android-generate-export-pdf
val scene = requireNotNull(engine.scene.get()) { "No scene loaded for export." }
val pdfData = engine.block.export(
    block = scene,
    mimeType = MimeType.PDF,
).asReadOnlyBuffer()
```

## Batch Generation Workflows

Drive one template with multiple data records. Serialize the template once, then reload it with `overrideEditorConfig = true` for each record before setting variables and exporting. Reloading restores the template's registered defaults so values do not leak between records.

```kotlin highlight-android-generate-batch
    val records = listOf(
        "Jordan" to "Congratulations on the new home!",
        "Riley" to "Thank you for everything.",
    )
    val batchExports = mutableListOf<ByteBuffer>()

    for ((recipientName, message) in records) {
        engine.scene.load(
            scene = templateString,
            overrideEditorConfig = true,
            waitForResources = true,
        )
        engine.variable.set(key = "recipientName", value = recipientName)
        engine.variable.set(key = "message", value = message)

        val recordPage = engine.scene.getPages().first()
        engine.block.forceLoadResources(blocks = listOf(recordPage))
        batchExports += engine.block.export(
            block = recordPage,
            mimeType = MimeType.PNG,
        ).asReadOnlyBuffer()
    }
```

## Troubleshooting

### Template Fails to Load

Confirm that the input contains valid scene data and is compatible with your SDK version. For URI-based templates, verify that the URI is reachable and use `loadArchive()` instead of `load()` for archive files.

### Variables Not Updating

Ensure the key passed to `engine.variable.set()` exactly matches the `{{token}}` in the template. Use `engine.variable.findAll()` to inspect registered variable names.

### Export Returns Empty Output

Confirm that every referenced asset is reachable and that all blocks are attached to the page hierarchy. Call `engine.block.forceLoadResources()` before exporting content with remote images or fonts.

### Image Placeholder Not Found

Verify that the name passed to `engine.block.findByName()` matches the block name exactly. Use `engine.block.findAllPlaceholders()` to discover every placeholder in the scene.

## API Reference

| Method                                                | Category | Purpose                                      |
| ----------------------------------------------------- | -------- | -------------------------------------------- |
| `engine.scene.load(scene=_)`                          | Scene    | Load a template from a serialized string     |
| `engine.scene.load(sceneUri=_)`                       | Scene    | Load a template from a remote or bundled URI |
| `engine.scene.loadArchive(archiveUri=_)`              | Scene    | Load a template archive with embedded assets |
| `engine.scene.saveToString(scene=_)`                  | Scene    | Serialize a template for batch processing    |
| `engine.scene.get()`                                  | Scene    | Get the active scene block                   |
| `engine.scene.getPages()`                             | Scene    | Get the pages in the active scene            |
| `engine.variable.findAll()`                           | Variable | List every registered variable               |
| `engine.variable.set(key=_, value=_)`                 | Variable | Set and register a variable value            |
| `engine.variable.get(key=_)`                          | Variable | Read a variable value                        |
| `engine.block.findByName(name=_)`                     | Block    | Find blocks by name                          |
| `engine.block.findAllPlaceholders()`                  | Block    | Discover all placeholder blocks              |
| `engine.block.getName(block=_)`                       | Block    | Read a block's stable name                   |
| `engine.block.getFill(block=_)`                       | Block    | Get a block's fill                           |
| `engine.block.setUri(block=_, property=_, value=_)`   | Block    | Set an image fill URI                        |
| `engine.block.resetCrop(block=_)`                     | Block    | Recalculate crop after replacing an image    |
| `engine.block.export(block=_, mimeType=_, options=_)` | Block    | Export a block to PNG, JPEG, or PDF          |

## Next Steps

- [Templates Overview](./overview.md) — Understand how templates work in
  CE.SDK
- [Apply Templates](./apply-template.md) — Merge a template into an existing scene
  while preserving its dimensions
- [Replace Content](./replace-content.md) — Update variables and placeholders in
  depth
- [Use Templates Programmatically](./programmatic.md) — Build and personalize
  templates entirely in code



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support