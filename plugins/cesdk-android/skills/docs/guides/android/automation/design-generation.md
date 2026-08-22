> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Design Generation](./design-generation.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-design-generation/DesignGeneration.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.FontUnit
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer

data class DesignGenerationResult(
    val referencedVariableKeys: Set<String>,
    val populatedVariables: Map<String, String>,
    val namedImageBlockCount: Int,
    val imageFillType: String,
    val storedImageUri: Uri,
    val exportedPng: ByteBuffer,
    val outputFile: File,
)

data class DesignGenerationFixture(
    val templateFile: File,
    val replacementImageUri: Uri,
    val outputFile: File,
)

suspend fun designGeneration(
    engine: Engine,
    templateUri: Uri,
    replacementImageUri: Uri,
    outputFile: File,
): DesignGenerationResult = withContext(engine.dispatcher) {
    engine.scene.load(
        sceneUri = templateUri,
        overrideEditorConfig = true,
        waitForResources = true,
    )
    val page = checkNotNull(engine.scene.getPages().singleOrNull()) {
        "The template must contain exactly one page."
    }

    data class DesignRecord(
        val firstName: String,
        val lastName: String,
        val address: String,
        val city: String,
        val imageUri: Uri,
    )

    val record = DesignRecord(
        firstName = "John",
        lastName = "Doe",
        address = "123 Main St.",
        city = "Anytown",
        imageUri = replacementImageUri,
    )
    val requiredVariableKeys = setOf("first_name", "last_name", "address", "city")
    val textBlocks = engine.block.findByType(DesignBlockType.Text)
    check(textBlocks.any { textBlock -> engine.block.referencesAnyVariables(block = textBlock) }) {
        "Template text blocks must reference at least one variable."
    }
    val variableTokenPattern = Regex("""\{\{\s*([^{}]+?)\s*\}\}""")
    val referencedVariableKeys = textBlocks
        .flatMap { textBlock ->
            variableTokenPattern.findAll(engine.block.getString(block = textBlock, property = "text/text"))
                .map { match -> match.groupValues[1].trim() }
                .toList()
        }
        .toSet()
    val missingVariableKeys = requiredVariableKeys - referencedVariableKeys
    check(missingVariableKeys.isEmpty()) {
        "Template text is missing variable references: ${missingVariableKeys.sorted().joinToString()}"
    }

    val imageBlockName = "profile-photo"
    val imageBlocks = engine.block.findByName(name = imageBlockName)
    val imageBlock = checkNotNull(imageBlocks.singleOrNull()) {
        "Template must contain exactly one block named '$imageBlockName'."
    }
    val imageFill = engine.block.getFill(block = imageBlock)
    val imageFillType = engine.block.getType(block = imageFill)
    check(imageFillType == FillType.Image.key) {
        "Block '$imageBlockName' must use an image fill."
    }

    engine.variable.set(key = "first_name", value = record.firstName)
    engine.variable.set(key = "last_name", value = record.lastName)
    engine.variable.set(key = "address", value = record.address)
    engine.variable.set(key = "city", value = record.city)

    val imageUriProperty = "fill/image/imageFileURI"
    engine.block.setUri(
        block = imageFill,
        property = imageUriProperty,
        value = record.imageUri,
    )
    engine.block.resetCrop(block = imageBlock)
    val storedImageUri = engine.block.getUri(block = imageFill, property = imageUriProperty)

    engine.block.forceLoadResources(blocks = listOf(page))
    val exportedPng = engine.block.export(block = page, mimeType = MimeType.PNG).apply {
        rewind()
    }

    withContext(Dispatchers.IO) {
        FileOutputStream(outputFile).channel.use { channel ->
            val readablePng = exportedPng.asReadOnlyBuffer()
            while (readablePng.hasRemaining()) {
                channel.write(readablePng)
            }
        }
    }

    DesignGenerationResult(
        referencedVariableKeys = referencedVariableKeys,
        populatedVariables = mapOf(
            "first_name" to engine.variable.get(key = "first_name"),
            "last_name" to engine.variable.get(key = "last_name"),
            "address" to engine.variable.get(key = "address"),
            "city" to engine.variable.get(key = "city"),
        ),
        namedImageBlockCount = imageBlocks.size,
        imageFillType = imageFillType,
        storedImageUri = storedImageUri,
        exportedPng = exportedPng.asReadOnlyBuffer(),
        outputFile = outputFile,
    )
}

// Deterministic serialized template used by the Android smoke test.
suspend fun createDesignGenerationFixture(
    engine: Engine,
    directory: File,
): DesignGenerationFixture = withContext(engine.dispatcher) {
    val previousVariables = engine.variable.findAll().associateWith { key ->
        engine.variable.get(key = key)
    }

    val templateString = try {
        previousVariables.keys.forEach { key -> engine.variable.remove(key = key) }

        val scene = engine.scene.create(designUnit = DesignUnit.PIXEL, fontSizeUnit = FontUnit.PIXEL)
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(block = page, value = 900F)
        engine.block.setHeight(block = page, value = 600F)
        engine.block.appendChild(parent = scene, child = page)

        engine.block.setFillSolidColor(
            block = page,
            color = Color.fromHex("#F6F7F9"),
        )

        val accent = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block = accent, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(block = accent, value = 0F)
        engine.block.setPositionY(block = accent, value = 0F)
        engine.block.setWidth(block = accent, value = 52F)
        engine.block.setHeight(block = accent, value = 600F)
        engine.block.setFill(block = accent, fill = engine.block.createFill(FillType.Color))
        engine.block.setFillSolidColor(
            block = accent,
            color = Color.fromHex("#146C5A"),
        )
        engine.block.appendChild(parent = page, child = accent)

        val name = engine.block.create(DesignBlockType.Text)
        engine.block.replaceText(block = name, text = "{{first_name}} {{last_name}}")
        engine.block.setTextFontSize(block = name, fontSize = 48F)
        engine.block.setTextColor(block = name, color = Color.fromHex("#17212B"))
        engine.block.setPositionX(block = name, value = 96F)
        engine.block.setPositionY(block = name, value = 104F)
        engine.block.setWidth(block = name, value = 380F)
        engine.block.setHeight(block = name, value = 92F)
        engine.block.appendChild(parent = page, child = name)

        val address = engine.block.create(DesignBlockType.Text)
        engine.block.replaceText(block = address, text = "{{address}}\n{{city}}")
        engine.block.setTextFontSize(block = address, fontSize = 28F)
        engine.block.setTextColor(block = address, color = Color.fromHex("#40505F"))
        engine.block.setPositionX(block = address, value = 96F)
        engine.block.setPositionY(block = address, value = 224F)
        engine.block.setWidth(block = address, value = 350F)
        engine.block.setHeight(block = address, value = 140F)
        engine.block.appendChild(parent = page, child = address)

        val imageBlock = engine.block.create(DesignBlockType.Graphic)
        engine.block.setName(block = imageBlock, name = "profile-photo")
        engine.block.setShape(block = imageBlock, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(block = imageBlock, value = 520F)
        engine.block.setPositionY(block = imageBlock, value = 72F)
        engine.block.setWidth(block = imageBlock, value = 308F)
        engine.block.setHeight(block = imageBlock, value = 456F)
        engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.COVER)
        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setUri(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = Uri.parse("file:///android_asset/imgly-assets/ly.img.image/images/sample_1.jpg"),
        )
        engine.block.setFill(block = imageBlock, fill = imageFill)
        engine.block.appendChild(parent = page, child = imageBlock)

        engine.variable.set(key = "first_name", value = "First")
        engine.variable.set(key = "last_name", value = "Last")
        engine.variable.set(key = "address", value = "Address")
        engine.variable.set(key = "city", value = "City")
        engine.block.forceLoadResources(blocks = listOf(page))
        engine.scene.saveToString(scene = scene)
    } finally {
        engine.variable.findAll().forEach { key -> engine.variable.remove(key = key) }
        previousVariables.forEach { (key, value) -> engine.variable.set(key = key, value = value) }
    }

    withContext(Dispatchers.IO) {
        val templateFile = File.createTempFile("design-generation-template-", ".imgly", directory).apply {
            writeText(templateString)
        }
        val outputFile = File.createTempFile("design-generation-output-", ".png", directory)
        DesignGenerationFixture(
            templateFile = templateFile,
            replacementImageUri = Uri.parse(
                "file:///android_asset/imgly-assets/ly.img.image/images/sample_2.jpg",
            ),
            outputFile = outputFile,
        )
    }
}
```

Populate a reusable template from application data and export the finished design with CE.SDK's Android Engine API.

![A personalized design showing John Doe and 123 Main St., Anytown beside a kitten photo.](https://img.ly/docs/cesdk/android/automation/design-generation-98a99e/assets/android.hero.webp)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260822/engine-guides-design-generation)

<EngineReferenceNote {...props} />

Each generation job starts from a pristine template and resolves its current block IDs before applying one record. This keeps template state isolated without turning the mobile workflow into a batch-processing service.

## Load a Template

Load a bundled or remote `.scene` through Android's `Uri` type. `overrideEditorConfig = true` imports serialized settings and merges the template's variables into the Engine, replacing matching keys without clearing unrelated variables. `waitForResources = true` waits for initial resources before returning. The sample receives an initialized `Engine` and runs Engine calls on `engine.dispatcher`, which uses the Engine's main-thread dispatcher.

```kotlin highlight-android-load-template
engine.scene.load(
    sceneUri = templateUri,
    overrideEditorConfig = true,
    waitForResources = true,
)
val page = checkNotNull(engine.scene.getPages().singleOrNull()) {
    "The template must contain exactly one page."
}
```

Resolve the export page and all other block IDs after each load. IDs from an earlier scene do not remain valid for a newly loaded template.

## Map and Validate Data

Map one native record to the template contract before changing the scene. Read each loaded text block's `text/text` property and extract its `{{token}}` keys; `findAll()` is engine-wide and can still contain variables from a previously loaded scene.

```kotlin highlight-android-map-and-validate-data
    data class DesignRecord(
        val firstName: String,
        val lastName: String,
        val address: String,
        val city: String,
        val imageUri: Uri,
    )

    val record = DesignRecord(
        firstName = "John",
        lastName = "Doe",
        address = "123 Main St.",
        city = "Anytown",
        imageUri = replacementImageUri,
    )
    val requiredVariableKeys = setOf("first_name", "last_name", "address", "city")
    val textBlocks = engine.block.findByType(DesignBlockType.Text)
    check(textBlocks.any { textBlock -> engine.block.referencesAnyVariables(block = textBlock) }) {
        "Template text blocks must reference at least one variable."
    }
    val variableTokenPattern = Regex("""\{\{\s*([^{}]+?)\s*\}\}""")
    val referencedVariableKeys = textBlocks
        .flatMap { textBlock ->
            variableTokenPattern.findAll(engine.block.getString(block = textBlock, property = "text/text"))
                .map { match -> match.groupValues[1].trim() }
                .toList()
        }
        .toSet()
    val missingVariableKeys = requiredVariableKeys - referencedVariableKeys
    check(missingVariableKeys.isEmpty()) {
        "Template text is missing variable references: ${missingVariableKeys.sorted().joinToString()}"
    }

    val imageBlockName = "profile-photo"
    val imageBlocks = engine.block.findByName(name = imageBlockName)
    val imageBlock = checkNotNull(imageBlocks.singleOrNull()) {
        "Template must contain exactly one block named '$imageBlockName'."
    }
    val imageFill = engine.block.getFill(block = imageBlock)
    val imageFillType = engine.block.getType(block = imageFill)
    check(imageFillType == FillType.Image.key) {
        "Block '$imageBlockName' must use an image fill."
    }
```

The validation confirms every required text reference and that exactly one block named `profile-photo` owns an image fill. Variable names and block names are case-sensitive, so failing before mutation makes a changed or incomplete template easier to diagnose.

## Populate Text Variables

Set each string value with the variable API. Text blocks that reference `{{first_name}}`, `{{last_name}}`, `{{address}}`, and `{{city}}` use these values when CE.SDK renders the page.

```kotlin highlight-android-populate-text-variables
engine.variable.set(key = "first_name", value = record.firstName)
engine.variable.set(key = "last_name", value = record.lastName)
engine.variable.set(key = "address", value = record.address)
engine.variable.set(key = "city", value = record.city)
```

Use `get()` for preflight checks or readback and `remove()` only when restoring values that your application owns. Do not clear unrelated variables from a shared Engine session.

## Replace a Named Image

Reuse the image fill supplied by the template and update its `fill/image/imageFileURI` property with `setUri()`. Resetting the crop reframes replacement images whose dimensions differ from the original.

```kotlin highlight-android-replace-named-image
val imageUriProperty = "fill/image/imageFileURI"
engine.block.setUri(
    block = imageFill,
    property = imageUriProperty,
    value = record.imageUri,
)
engine.block.resetCrop(block = imageBlock)
val storedImageUri = engine.block.getUri(block = imageFill, property = imageUriProperty)
```

Creating a new fill here would hide a broken template contract, so the sample rejects missing blocks, duplicate names, and non-image fills instead.

## Export the Design

Force the page's changed resources to load before exporting it. The PNG export remains a `ByteBuffer`; the sample rewinds it and streams it to a file on `Dispatchers.IO` without creating an intermediate byte array.

```kotlin highlight-android-export-design
    engine.block.forceLoadResources(blocks = listOf(page))
    val exportedPng = engine.block.export(block = page, mimeType = MimeType.PNG).apply {
        rewind()
    }

    withContext(Dispatchers.IO) {
        FileOutputStream(outputFile).channel.use { channel ->
            val readablePng = exportedPng.asReadOnlyBuffer()
            while (readablePng.hasRemaining()) {
                channel.write(readablePng)
            }
        }
    }
```

Use `MimeType.JPEG` with a `.jpeg` file or `MimeType.PDF` with a `.pdf` file when those formats better match your delivery workflow. For multiple records, start each job from the original template input and resolve fresh IDs; use the dedicated data merge workflow for orchestration.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.load(sceneUri=_, overrideEditorConfig=_, waitForResources=_)` | Load a `.scene` template from an Android `Uri` |
| `engine.scene.getPages()` | Resolve pages from the currently loaded scene |
| `engine.variable.findAll()` | List engine-wide variable keys; this is not a per-template inventory |
| `engine.variable.set(key=_, value=_)` | Set a string variable value |
| `engine.variable.get(key=_)` | Read a variable value |
| `engine.variable.remove(key=_)` | Remove an application-owned variable value |
| `engine.block.findByType(type=DesignBlockType.Text)` | Resolve text blocks with the type-safe overload |
| `engine.block.referencesAnyVariables(block=_)` | Confirm that template text references variables |
| `engine.block.getString(block=_, property="text/text")` | Read text content to validate its exact variable keys |
| `engine.block.findByName(name=_)` | Find blocks by their stable template name |
| `engine.block.getFill(block=_)` | Read the fill attached to a block |
| `engine.block.getType(block=_)` | Read the fill's type for validation |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Set the current image URI |
| `engine.block.getUri(block=_, property="fill/image/imageFileURI")` | Read back the current image URI |
| `engine.block.resetCrop(block=_)` | Reframe replaced media to cover its block |
| `engine.block.forceLoadResources(blocks=_)` | Wait for changed page resources |
| `engine.block.export(block=_, mimeType=MimeType.PNG)` | Export the populated page as a `ByteBuffer` |

## Next Steps

- [Use Templates](../use-templates/overview.md) — Prepare and load reusable templates.
- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) — Work with variable-backed text.
- [Data Merge](./data-merge.md) — Process structured records and media placeholders.
- [Export](../export-save-publish/export.md) — Configure output formats and quality.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support