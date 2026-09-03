> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Data Merge](./data-merge.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-data-merge/DataMergeGuide.kt reference-only
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import java.nio.ByteBuffer

data class MergeRecord(
    val fullName: String,
    val jobTitle: String,
    val email: String,
    val photoUri: String,
)

data class MergedCard(
    val fileName: String,
    val pngData: ByteBuffer,
)

private val dataMergeVariableKeys = listOf("full_name", "job_title", "email")

suspend fun mergeBusinessCards(engine: Engine): List<MergedCard> = withContext(engine.dispatcher) {
    val currentVariableKeys = engine.variable.findAll().toSet()
    val previousVariables = dataMergeVariableKeys
        .filter(currentVariableKeys::contains)
        .associateWith(engine.variable::get)

    try {
        mergeBusinessCardsWithTemporaryVariables(engine)
    } finally {
        val variablesToRemove = engine.variable.findAll().toSet()
        dataMergeVariableKeys.filter(variablesToRemove::contains).forEach(engine.variable::remove)
        previousVariables.forEach { (key, value) -> engine.variable.set(key = key, value = value) }
    }
}

private suspend fun mergeBusinessCardsWithTemporaryVariables(engine: Engine): List<MergedCard> {
    val records = listOf(
        MergeRecord(
            fullName = "Alex Rivera",
            jobTitle = "Senior Product Designer",
            email = "alex.rivera@example.com",
            photoUri = "https://img.ly/static/ubq_samples/sample_1.jpg",
        ),
        MergeRecord(
            fullName = "Jordan Lee",
            jobTitle = "Lifecycle Marketing Lead",
            email = "jordan.lee@example.com",
            photoUri = "https://img.ly/static/ubq_samples/sample_2.jpg",
        ),
    )

    val templateScene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1050F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = templateScene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    val backgroundFill = engine.block.createFill(FillType.Color)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(background, fill = backgroundFill)
    engine.block.appendChild(parent = page, child = background)
    engine.block.fillParent(background)
    engine.block.setColor(
        block = backgroundFill,
        property = "fill/color/value",
        value = Color.fromHex("#FFF7F0"),
    )

    val photoBlock = engine.block.create(DesignBlockType.Graphic)
    val placeholderFill = engine.block.createFill(FillType.Image)
    engine.block.setName(photoBlock, name = "profile-photo")
    engine.block.setShape(photoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(photoBlock, value = 48F)
    engine.block.setPositionY(photoBlock, value = 48F)
    engine.block.setWidth(photoBlock, value = 280F)
    engine.block.setHeight(photoBlock, value = 504F)
    engine.block.setEnum(photoBlock, property = "contentFill/mode", value = "Cover")
    engine.block.setString(
        block = placeholderFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(photoBlock, fill = placeholderFill)
    engine.block.appendChild(parent = page, child = photoBlock)

    val nameText = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(nameText, text = "{{full_name}}")
    engine.block.setPositionX(nameText, value = 368F)
    engine.block.setPositionY(nameText, value = 110F)
    engine.block.setWidth(nameText, value = 620F)
    engine.block.setHeightMode(nameText, mode = SizeMode.AUTO)
    engine.block.setTextFontSize(nameText, fontSize = 56F)
    engine.block.setTextColor(nameText, color = Color.fromHex("#211B17"))
    engine.block.appendChild(parent = page, child = nameText)

    val detailsText = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(detailsText, text = "{{job_title}}\n{{email}}")
    engine.block.setPositionX(detailsText, value = 368F)
    engine.block.setPositionY(detailsText, value = 214F)
    engine.block.setWidth(detailsText, value = 580F)
    engine.block.setHeightMode(detailsText, mode = SizeMode.AUTO)
    engine.block.setTextFontSize(detailsText, fontSize = 28F)
    engine.block.setTextColor(detailsText, color = Color.fromHex("#5D5248"))
    engine.block.appendChild(parent = page, child = detailsText)

    val templateSceneString = engine.scene.saveToString(scene = templateScene)

    engine.block.forceLoadResources(listOf(photoBlock, nameText, detailsText))

    val mergedCards = mutableListOf<MergedCard>()

    for (record in records) {
        val currentVariableKeys = engine.variable.findAll().toSet()
        dataMergeVariableKeys.filter(currentVariableKeys::contains).forEach(engine.variable::remove)

        engine.scene.load(scene = templateSceneString)
        val exportPage = engine.scene.getPages().first()

        engine.variable.set(key = "full_name", value = record.fullName)
        engine.variable.set(key = "job_title", value = record.jobTitle)
        engine.variable.set(key = "email", value = record.email)

        val variableNames = engine.variable.findAll()
        check(variableNames.containsAll(listOf("full_name", "job_title", "email")))

        val variableBlocks = engine.block.findByType(DesignBlockType.Text).filter { block ->
            engine.block.referencesAnyVariables(block)
        }
        check(variableBlocks.isNotEmpty())

        val profilePhoto = engine.block.findByName("profile-photo").first()
        val profileFill = engine.block.getFill(profilePhoto)
        engine.block.setString(
            block = profileFill,
            property = "fill/image/imageFileURI",
            value = record.photoUri,
        )
        engine.block.resetCrop(profilePhoto)

        engine.block.forceLoadResources(listOf(exportPage))

        val pngData = engine.block.export(exportPage, mimeType = MimeType.PNG).asReadOnlyBuffer()
        mergedCards += MergedCard(
            fileName = record.fullName.lowercase().replace(" ", "-") + ".png",
            pngData = pngData,
        )
    }

    return mergedCards
}
```

Generate personalized designs at scale using CE.SDK's headless Android engine to batch process templates with external data.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/engine-guides-data-merge)

<EngineReferenceNote {...props} />

Data merge generates multiple personalized designs from a single template by replacing variable content with external data. On Android, this works best as an engine-only workflow: build a reusable scene once, load it for each record, set variable values, update named placeholder blocks, and export the result.

This guide covers how to prepare data, build templates with variables, and process multiple records in a batch workflow.

## Prepare Data Records

Data typically comes from a CSV file, database query, or API response. Here we define sample records with the fields we want to merge into the template.

```kotlin highlight-android-sample-data
val records = listOf(
    MergeRecord(
        fullName = "Alex Rivera",
        jobTitle = "Senior Product Designer",
        email = "alex.rivera@example.com",
        photoUri = "https://img.ly/static/ubq_samples/sample_1.jpg",
    ),
    MergeRecord(
        fullName = "Jordan Lee",
        jobTitle = "Lifecycle Marketing Lead",
        email = "jordan.lee@example.com",
        photoUri = "https://img.ly/static/ubq_samples/sample_2.jpg",
    ),
)
```

Each record contains field names that map to template variables and the named placeholder block that holds the profile image.

## Build the Template

We build a reusable business-card layout with one named image placeholder and two text blocks that contain variable placeholders. The scene is then serialized once so the loop can reload it for every record.

```kotlin highlight-android-create-template
    val templateScene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 1050F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = templateScene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    val backgroundFill = engine.block.createFill(FillType.Color)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setFill(background, fill = backgroundFill)
    engine.block.appendChild(parent = page, child = background)
    engine.block.fillParent(background)
    engine.block.setColor(
        block = backgroundFill,
        property = "fill/color/value",
        value = Color.fromHex("#FFF7F0"),
    )

    val photoBlock = engine.block.create(DesignBlockType.Graphic)
    val placeholderFill = engine.block.createFill(FillType.Image)
    engine.block.setName(photoBlock, name = "profile-photo")
    engine.block.setShape(photoBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(photoBlock, value = 48F)
    engine.block.setPositionY(photoBlock, value = 48F)
    engine.block.setWidth(photoBlock, value = 280F)
    engine.block.setHeight(photoBlock, value = 504F)
    engine.block.setEnum(photoBlock, property = "contentFill/mode", value = "Cover")
    engine.block.setString(
        block = placeholderFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(photoBlock, fill = placeholderFill)
    engine.block.appendChild(parent = page, child = photoBlock)

    val nameText = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(nameText, text = "{{full_name}}")
    engine.block.setPositionX(nameText, value = 368F)
    engine.block.setPositionY(nameText, value = 110F)
    engine.block.setWidth(nameText, value = 620F)
    engine.block.setHeightMode(nameText, mode = SizeMode.AUTO)
    engine.block.setTextFontSize(nameText, fontSize = 56F)
    engine.block.setTextColor(nameText, color = Color.fromHex("#211B17"))
    engine.block.appendChild(parent = page, child = nameText)

    val detailsText = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(detailsText, text = "{{job_title}}\n{{email}}")
    engine.block.setPositionX(detailsText, value = 368F)
    engine.block.setPositionY(detailsText, value = 214F)
    engine.block.setWidth(detailsText, value = 580F)
    engine.block.setHeightMode(detailsText, mode = SizeMode.AUTO)
    engine.block.setTextFontSize(detailsText, fontSize = 28F)
    engine.block.setTextColor(detailsText, color = Color.fromHex("#5D5248"))
    engine.block.appendChild(parent = page, child = detailsText)

    val templateSceneString = engine.scene.saveToString(scene = templateScene)
```

Using `setName()` for the image placeholder keeps later updates predictable and avoids depending on transient block handles.

## Batch Processing Loop

We iterate through each data record, clear previously assigned variables, and load a fresh copy of the template scene before applying the next merge payload.

```kotlin highlight-android-batch-loop
    for (record in records) {
        val currentVariableKeys = engine.variable.findAll().toSet()
        dataMergeVariableKeys.filter(currentVariableKeys::contains).forEach(engine.variable::remove)

        engine.scene.load(scene = templateSceneString)
        val exportPage = engine.scene.getPages().first()
```

Loading the serialized template for each record keeps the block hierarchy stable while isolating changes between exports.

## Set Variable Values

Android uses `engine.variable.set(key =, value =)` to assign text values. Once the keys are set, text blocks that reference `{{full_name}}`, `{{job_title}}`, or `{{email}}` update automatically during export.

```kotlin highlight-android-set-variables
engine.variable.set(key = "full_name", value = record.fullName)
engine.variable.set(key = "job_title", value = record.jobTitle)
engine.variable.set(key = "email", value = record.email)
```

Variable values persist on the engine until you overwrite or remove them, which is why the batch loop clears them before loading the next scene copy.

## Verify Variables

On Android, `engine.variable.findAll()` reports the variable keys that currently have values stored in the engine. Pair it with `engine.block.referencesAnyVariables()` to confirm that your text blocks still reference variable placeholders in the loaded template.

```kotlin highlight-android-check-variables
        val variableNames = engine.variable.findAll()
        check(variableNames.containsAll(listOf("full_name", "job_title", "email")))

        val variableBlocks = engine.block.findByType(DesignBlockType.Text).filter { block ->
            engine.block.referencesAnyVariables(block)
        }
        check(variableBlocks.isNotEmpty())
```

This is useful for validating that your data model and template stay aligned before exporting a larger batch.

## Find and Update Placeholder Blocks

Use `engine.block.findByName()` to locate the named placeholder block, then update its image fill URI before the export.

```kotlin highlight-android-find-by-name
val profilePhoto = engine.block.findByName("profile-photo").first()
val profileFill = engine.block.getFill(profilePhoto)
engine.block.setString(
    block = profileFill,
    property = "fill/image/imageFileURI",
    value = record.photoUri,
)
engine.block.resetCrop(profilePhoto)
```

Resetting the crop after swapping the image keeps the placeholder framing consistent when source images have different aspect ratios.

## Export Each Design

After merging one record into the loaded scene, export the personalized card as a PNG and store the bytes with a record-specific filename.

```kotlin highlight-android-export
val pngData = engine.block.export(exportPage, mimeType = MimeType.PNG).asReadOnlyBuffer()
mergedCards += MergedCard(
    fileName = record.fullName.lowercase().replace(" ", "-") + ".png",
    pngData = pngData,
)
```

You can switch the `MimeType` to JPEG, PNG, or PDF if your batch job targets different delivery channels.

## Troubleshooting

### Variables Not Rendering

If placeholder text appears in the export instead of merged data:

- Verify the variable keys match the placeholders exactly, including case.
- Confirm `engine.variable.findAll()` contains the keys you expected to set for the current record.
- Check that the text blocks still return `true` from `engine.block.referencesAnyVariables()`.

### Placeholder Block Not Found

If `findByName("profile-photo")` returns an empty list:

- Make sure the template uses `engine.block.setName()` before it is serialized.
- Keep the placeholder name stable across template revisions so the batch loop does not need special cases.
- Reload a fresh template scene instead of mutating one scene indefinitely between records.

### Export Failures

If one record fails to export:

- Validate that the current scene still has a page block before calling `engine.block.export()`.
- Check that the image URI assigned to the placeholder is reachable on the device.
- Keep the loop sequential on Android and write the exported bytes out before moving to the next record.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.variable.set(key, value)` | Set a text variable value for the current engine session |
| `engine.variable.get(key)` | Read back a previously assigned variable value |
| `engine.variable.findAll()` | List the variable keys that currently have values stored in the engine |
| `engine.variable.remove(key)` | Remove a previously assigned variable value |
| `engine.block.setName(block, name)` | Assign a stable semantic name to a block |
| `engine.block.findByName(name)` | Find blocks by their semantic name |
| `engine.block.findByType(type)` | Find blocks by design-block type |
| `engine.block.referencesAnyVariables(block)` | Check whether a block still contains variable placeholders |
| `engine.block.getFill(block)` | Get the fill block attached to a design block |
| `engine.block.setString(block, property, value)` | Update string-backed properties such as image file URIs |
| `engine.block.export(block, mimeType)` | Export a block to an image format |
| `engine.scene.create()` | Create a new scene for the template |
| `engine.scene.getPages()` | Get the page blocks from the currently loaded scene |
| `engine.scene.saveToString(scene)` | Serialize the template scene so it can be reloaded for each record |
| `engine.scene.load(scene)` | Load a serialized scene into the active engine |

## Next Steps

- [Batch Processing](./batch-processing.md) — Automate generation of multiple designs from a template in a loop.
- [Templating](../concepts/templating.md) — Templates enable dynamic, reusable designs with text variables and placeholder media. Learn to create, load, and personalize templates programmatically.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support