> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Batch Processing](./batch-processing.md)

---

Batch processing lets your app automatically generate scores of assets from a single design template. For example, you might create 100 personalized posters or social posts from a JSON file of names and photos, without opening the editor for each one. CE.SDK's headless engine makes this possible entirely in Kotlin.

This guide shows you how to do that in Kotlin for Android. You'll learn how to load a saved design, substitute text and images, and export each variation as an asset file. The same techniques apply to more complex outputs like PDFs or videos.

## What You'll Learn

- How to start CE.SDK's **headless engine** without a UI editor.
- How to **load a template** from an archive or URL and attach it to a new scene.
- How to **replace variables and images** for each record in your data.
- How to **export** each generated design as a common format like PNG, JPEG or PDF.

## When You'll Use This

Headless batch generation is ideal for tasks that need automation, not user interaction. Use it to mass-produce:

- Branded materials
- Social media graphics
- Dynamic thumbnails
- Personalized certificates
- Product cards at scale

Because you're not displaying the editor UI, it works well for background processing and server-side workflows.

## Headless Engine

At the center of CE.SDK is the `Engine`, a lightweight rendering system you can use without the prebuilt editors. It can run in the background, respond to coroutines, and render scenes directly to image data.

```kotlin
import ly.img.engine.Engine
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

fun startHeadlessEngine(license: String, userId: String) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.batch")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)
}
```

For automation, you'll typically create one `Engine` instance for the full batch run.

- **On mobile**, a single-engine, sequential approach is safest.
- **On more powerful hardware or servers**, you can explore modest parallelism, as each instance of `Engine` is independent.

## Loading Templates

The template defines the design you'll use for all generated images. You can:

1. Create a template in the CE.SDK editor.
2. Save it as an archive or scene file.
3. Bundle that file with your app in the assets folder or host it at a URL for the batch to use.

```kotlin
import android.net.Uri

val templateUri = Uri.parse("file:///android_asset/templates/badge_template.scene")
```

**Archives** are self-contained ZIP files that include:

- Your layout
- Text
- All linked assets

They're ideal for predictable batch exports. You can also save templates as scene JSON files, but in those cases, the URI of every asset must resolve correctly at runtime.

Once loaded, always validate the structure before using it.

```kotlin
import android.net.Uri
import ly.img.engine.DesignBlock
import ly.img.engine.Engine

suspend fun loadTemplate(engine: Engine, uri: Uri): DesignBlock {
    val scene = engine.scene.load(sceneUri = uri)
    return scene
}
```

This ensures that missing or corrupt templates don't interrupt your batch.

`engine.scene.load()` loads the template and returns the scene root block, which you can then render, modify, and export.

## Supplying Data from JSON

Every batch needs a list of records. Each record holds the values to apply to the template. A common pattern is:

1. Store them as a JSON array.
2. Decode them during the batch.

A record might have these properties:

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Record(
    val id: String,
    val variables: Map<String, String>,
    val outputFileName: String,
    val images: Map<String, String>? = null // optional blockName → image URI
)
```

Then decode any JSON using kotlinx.serialization or Gson:

```kotlin
import android.content.Context
import kotlinx.serialization.json.Json
import kotlinx.serialization.decodeFromString
import java.io.IOException

fun loadRecords(context: Context): List<Record> {
    return try {
        val jsonString = context.assets.open("records.json")
            .bufferedReader()
            .use { it.readText() }
        Json.decodeFromString<List<Record>>(jsonString)
    } catch (e: IOException) {
        emptyList()
    }
}
```

Example `records.json`:

```json
[
  {
    "id": "001",
    "variables": { "name": "Ruth", "tagline": "Ship great apps" },
    "outputFileName": "badge-ruth"
  },
  {
    "id": "002",
    "variables": { "name": "Chris", "tagline": "Move fast, polish later" },
    "outputFileName": "badge-chris"
  }
]
```

In a production environment, you'll load data from an API or database instead of bundled assets. If your dataset is large, consider streaming it in chunks instead of loading everything at once.

## Templates and Variables

Templates often include placeholders, or variables, that you can update with real data at runtime. In CE.SDK (Android), template variables follow a key/value pattern and are **always stored as strings**. Your app can convert them into types like numbers or colors when needed. For text blocks, CE.SDK automatically matches placeholders in the template with variable names. Displaying `\{\{username\}\}` as the text in a text box becomes the variable `username` you can replace with a person's name before exporting.

```kotlin
import ly.img.engine.Engine

// All variables are set via (key:String, value:String)
engine.variable.set(key = "name", value = "Chris") // text
engine.variable.set(key = "price", value = "9.99") // number encoded as string
engine.variable.set(key = "brandColor", value = "#FFD60A") // color as hex string
engine.variable.set(key = "isFeatured", value = "true") // boolean as "true" / "false"
engine.variable.set(key = "imageURL", value = "https://example.com/image.jpg") // URL as string
```

Discover the available variable keys at runtime to validate a template using:

```kotlin
val keys = engine.variable.findAll()
// assert or log missing keys before a long batch run
```

## Applying Data to the Template

Once the engine loads the template, you can fill in variables. These correspond to the placeholders you set in your CE.SDK scene, like `\{\{name\}\}` or `\{\{tagline\}\}`.

```kotlin
import ly.img.engine.Engine

fun applyVariables(engine: Engine, values: Map<String, String>) {
    for ((key, value) in values) {
        engine.variable.set(key = key, value = value)
    }
}
```

You can also swap out placeholder images at runtime. The simplest method is to find the block by its name and update its image fill.

```kotlin
import ly.img.engine.Engine

fun replaceNamedImage(engine: Engine, blockName: String, imageUri: String) {
    val matches = engine.block.findByName(blockName)
    if (matches.isNotEmpty()) {
        val imageBlock = matches.first()
        val fill = engine.block.getFill(imageBlock)
        engine.block.setString(fill, property = "fill/image/imageFileURI", value = imageUri)
        engine.block.setFill(imageBlock, fill = fill)
        engine.block.setKind(imageBlock, kind = "image")
    }
}
```

This snippet looks up a block named `productImage` and replaces its image fill with the URI of the new image.

> **Note:** Using block names keeps your automation readable and less fragile than referencing IDs.

## Create Thumbnails

You can generate previews by exporting a scaled version of each result:

```kotlin
import android.content.Context
import kotlinx.coroutines.withContext
import kotlinx.coroutines.Dispatchers
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.MimeType
import java.io.File

suspend fun exportThumbnail(
    engine: Engine,
    context: Context,
    fileName: String,
    scale: Float = 0.25f
): File {
    val scene = requireNotNull(engine.scene.get()) { "No scene loaded" }
    val width = engine.block.getFrameWidth(scene) * scale
    val height = engine.block.getFrameHeight(scene) * scale
    
    val options = ExportOptions(
        jpegQuality = 0.7f,
        targetWidth = width,
        targetHeight = height
    )
    val exportData = engine.block.export(scene, mimeType = MimeType.JPEG, options = options)
    
    val outputDir = context.filesDir
    val thumbFile = File(outputDir, "thumb_$fileName.jpg")
    
    withContext(Dispatchers.IO) {
        thumbFile.outputStream().channel.use { channel ->
            channel.write(exportData)
        }
    }
    
    return thumbFile
}
```

## Exporting to Multiple Formats

Exports can target different output types. Just switch the mime type you pass:

```kotlin
import ly.img.engine.ExportOptions
import ly.img.engine.MimeType

val pngData = engine.block.export(scene, mimeType = MimeType.PNG, options = ExportOptions(targetHeight = 1080f))
val pdfData = engine.block.export(scene, mimeType = MimeType.PDF)
```

|Format|MimeType|Typical Use|
|---|---|---|
|PNG|`MimeType.PNG`|Lossless images with transparency|
|JPEG|`MimeType.JPEG`|Photos and smaller files|
|PDF|`MimeType.PDF`|Printable designs|
|MP4|`MimeType.MP4`|Animated or timed templates|

Use an `ExportOptions` instance to tune output quality, size and other properties of the export. You can get the details in the [Export](../export-save-publish/export.md) guides.

If you need multiple formats at once, run several export calls back-to-back using the same engine and scene.

## Managing Memory and Resources

Each export involves GPU textures, image buffers, and temporary files. To keep your app responsive:

- Reuse a single engine for sequential jobs.
- Clean up temporary directories between batches.
- Call `engine.stop()` when completely done to free resources.

## Performance Tuning Checklist

- Use JPEG quality 0.8–0.9 to balance file size and speed.
- Keep templates simple. Avoid unnecessary effects or large images.
- Chunk data into smaller groups for large datasets.
- Limit concurrency to 2–3 parallel tasks if attempting parallel processing.
- Profile on the lowest device you support.

## Error Handling and Retries

Batch jobs can fail for network hiccups or invalid data. Use Kotlin's try/catch blocks to retry a few times before giving up.

```kotlin
import kotlinx.coroutines.delay

suspend fun processRecordWithRetry(record: Record, maxAttempts: Int = 3) {
    var attempts = 0
    while (attempts < maxAttempts) {
        try {
            exportRecord(record)
            break
        } catch (e: Exception) {
            attempts++
            if (attempts >= maxAttempts) {
                throw e
            }
            delay((attempts * 500L)) // exponential backoff
        }
    }
}
```

You can also log each attempt for easier debugging.

## Logging and Monitoring Progress

Adding logging helps track how long each export takes:

```kotlin
import android.util.Log

const val TAG = "BatchProcessing"

Log.i(TAG, "Starting batch processing for ${records.size} records")
records.forEachIndexed { index, record ->
    val startTime = System.currentTimeMillis()
    try {
        processRecord(record)
        val duration = System.currentTimeMillis() - startTime
        Log.i(TAG, "Exported ${record.outputFileName} in ${duration}ms [${index + 1}/${records.size}]")
    } catch (e: Exception) {
        Log.e(TAG, "Failed to export ${record.outputFileName}", e)
    }
}
```

Wrap your entire run in timestamps to measure throughput and display progress in your UI.

## Batch Workflow

Batch processing isn't limited to mobile apps. The same logic can run on backends or web services using CE.SDK for Web or Node. If your workload scales beyond device limits, consider:

1. Migrating automation to a server workflow.
2. Sending results back to the app.

An example batch process, below, calls `processRecord()` for each record in the dataset. The record is processed by:

1. Loading the template
2. Setting variables
3. Replacing images
4. Exporting the result

```kotlin
import android.content.Context
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlock
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.MimeType
import java.io.File

suspend fun processRecord(
    engine: Engine,
    context: Context,
    record: Record,
    templateUri: Uri
): File {
    // Load the template
    val scene = engine.scene.load(sceneUri = templateUri)
    
    // Apply variables
    applyVariables(engine, record.variables)
    
    // Replace images if specified
    record.images?.forEach { (blockName, imageUri) ->
        replaceNamedImage(engine, blockName, imageUri)
    }
    
    // Export the result
    val exportData = engine.block.export(
        scene,
        mimeType = MimeType.JPEG,
        options = ExportOptions(jpegQuality = 0.9f)
    )
    
    // Save to file
    val outputDir = context.filesDir
    val outputFile = File(outputDir, "${record.outputFileName}.jpg")
    
    withContext(Dispatchers.IO) {
        outputFile.outputStream().channel.use { channel ->
            channel.write(exportData)
        }
    }
    
    return outputFile
}

suspend fun runBatch(
    context: Context,
    license: String,
    userId: String,
    records: List<Record>
) {
    val engine = Engine.getInstance(id = "ly.img.engine.batch")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)
    
    val templateUri = Uri.parse("file:///android_asset/templates/badge_template.scene")
    
    for (record in records) {
        try {
            processRecord(engine, context, record, templateUri)
        } catch (e: Exception) {
            Log.e("Batch", "Failed to process ${record.id}", e)
        }
    }
    
    engine.stop()
}
```

Use modest parallelism for faster processing on capable devices:

```kotlin
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope

suspend fun runBatchParallel(
    context: Context,
    license: String,
    userId: String,
    records: List<Record>,
    maxConcurrent: Int = 3
) = coroutineScope {
    val templateUri = Uri.parse("file:///android_asset/templates/badge_template.scene")
    
    records.chunked(maxConcurrent).forEach { chunk ->
        chunk.map { record ->
            async(Dispatchers.Main) {
                // Create a separate engine instance for each parallel task
                val engine = Engine.getInstance(id = "ly.img.engine.batch.${record.id}")
                try {
                    engine.start(license = license, userId = userId)
                    engine.bindOffscreen(width = 1080, height = 1920)
                    processRecord(engine, context, record, templateUri)
                } finally {
                    engine.stop()
                }
            }
        }.awaitAll()
    }
}
```

## Troubleshooting

**❌ Your exports appear blank**:

- Verify that the scene loaded successfully with `engine.scene.get()`.
- Check that all asset URIs are reachable (network or local).
- Ensure the page has content before exporting.

**❌ Text variables don't update**:

- Confirm variable names match the template's tokens exactly (case-sensitive).
- Use `engine.variable.findAll()` to see what variables exist in the template.
- Verify that `engine.variable.set()` is called with the correct key.

**❌ Your image placeholder doesn't update**:

- Ensure you're setting the image URI on an image fill.
- Verify that the fill is applied to the target block with `engine.block.setFill()`.
- Check that the URI is valid and reachable (add INTERNET permission for remote URLs).
- Confirm the block's kind is set to `"image"` after applying the new fill.

**❌ The batch job becomes sluggish**:

- Performance issues are rare in sequential runs, but if you attempt parallel exports:
  - Limit concurrency to a few simultaneous tasks (2-3 on mobile).
  - Ensure each engine instance is properly stopped after use.
  - Monitor memory usage and reduce batch size if needed.

**❌ Network errors when loading remote templates or images**:

- Add `<uses-permission android:name="android.permission.INTERNET" />` to AndroidManifest.xml.
- Verify URLs are using HTTPS.
- Test URLs in a browser to confirm they're accessible.

## Next Steps

Continue learning about automation and export workflows with these related guides:

- Use Templates to [generate content](../use-templates/generate.md).
- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) & [Placeholders](../create-templates/add-dynamic-content/placeholders.md) for dynamic content.
- [Export assets](../export-save-publish/export.md) in different formats.
- Generate [multiple assets](./multi-image-generation.md) from a single record.
- Create [Preview Thumbnails](../export-save-publish/create-thumbnail.md).

These guides expand on how to prepare templates, manage variable data, and optimize export pipelines for larger-scale automation.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support