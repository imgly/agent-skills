> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Automate Workflows](./automation.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-automate-workflows/AutomateWorkflows.kt reference-only
package ly.img.editor.examples

import android.app.Application
import android.content.Context
import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import ly.img.editor.defaultBaseUri
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import java.io.File
import ly.img.engine.Color as EngineColor

private data class AutomationJob(
    val fileStem: String,
    val headline: String,
    val subline: String,
    val cta: String,
    val heroImageUri: String,
)

private val automationVariableKeys = listOf("headline", "subline", "cta")
private val automationAssetSourceIds = listOf("ly.img.color.palette", "ly.img.typeface")
private val automationEngineMutex = Mutex()

data class AutomationResult(
    val variableKeys: List<String>,
    val tokenizedBlockNames: List<String>,
    val exportedFiles: List<File>,
)

private sealed interface AutomationUiState {
    object Loading : AutomationUiState

    data class Success(
        val result: AutomationResult,
    ) : AutomationUiState

    data class Error(
        val message: String,
    ) : AutomationUiState
}

@Composable
fun AutomateWorkflowsScreen(license: String) {
    val context = LocalContext.current.applicationContext
    var uiState by remember { mutableStateOf<AutomationUiState>(AutomationUiState.Loading) }

    LaunchedEffect(context, license) {
        uiState = runCatching { runStandaloneAutomationWorkflow(context, license) }
            .fold(
                onSuccess = { AutomationUiState.Success(it) },
                onFailure = { AutomationUiState.Error(it.message ?: "Unknown automation error.") },
            )
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
    ) {
        when (val state = uiState) {
            AutomationUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center,
                ) {
                    CircularProgressIndicator()
                }
            }

            is AutomationUiState.Error -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(
                        text = "Automation failed",
                        style = MaterialTheme.typography.headlineSmall,
                    )
                    Text(
                        text = state.message,
                        style = MaterialTheme.typography.bodyLarge,
                    )
                }
            }

            is AutomationUiState.Success -> {
                val scrollState = rememberScrollState()
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(scrollState)
                        .padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                ) {
                    Text(
                        text = "Automate Workflows",
                        style = MaterialTheme.typography.headlineSmall,
                    )
                    Text(
                        text = "Variable store: ${state.result.variableKeys.joinToString()}",
                        style = MaterialTheme.typography.bodyMedium,
                    )
                    Text(
                        text = "Tokenized blocks: ${state.result.tokenizedBlockNames.joinToString()}",
                        style = MaterialTheme.typography.bodyMedium,
                    )
                    state.result.exportedFiles.forEach { file ->
                        val bitmap = remember(file.absolutePath) {
                            BitmapFactory.decodeFile(file.absolutePath)?.asImageBitmap()
                        }
                        Text(
                            text = file.name,
                            style = MaterialTheme.typography.titleMedium,
                        )
                        if (bitmap != null) {
                            Image(
                                bitmap = bitmap,
                                contentDescription = file.name,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .aspectRatio(4f / 5f),
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }
        }
    }
}

private suspend fun runStandaloneAutomationWorkflow(
    context: Context,
    license: String,
): AutomationResult = withContext(Dispatchers.Main) {
    automationEngineMutex.withLock {
        val application = context.applicationContext as Application
        Engine.init(application)
        val engine = Engine.getInstance(id = "ly.img.engine.automateWorkflows")
        var engineStarted = false

        try {
            engineStarted = engine.start(
                license = license,
                userId = "automation-guide",
            )
            check(engineStarted) { "Unable to start the automation guide Engine." }

            engine.bindOffscreen(width = 1080, height = 1350)
            runAutomationWorkflow(engine = engine, context = context)
        } finally {
            if (engineStarted) {
                withContext(NonCancellable) {
                    engine.stop()
                }
            }
        }
    }
}

suspend fun runAutomationWorkflow(
    engine: Engine,
    context: Context,
): AutomationResult = withContext(engine.dispatcher) {
    val currentVariableKeys = engine.variable.findAll().toSet()
    val previousVariables = automationVariableKeys
        .filter(currentVariableKeys::contains)
        .associateWith(engine.variable::get)

    val originalAssetSources = engine.asset.findAllSources().toSet()
    try {
        val existingAssetSources = engine.asset.findAllSources().toSet()
        val addedAssetSources = automationAssetSourceIds.filterNot(existingAssetSources::contains)
        addedAssetSources.forEach { assetSource ->
            engine.asset.addLocalSourceFromJSON(
                contentUri = defaultBaseUri.buildUpon()
                    .appendPath(assetSource)
                    .appendPath("content.json")
                    .build(),
            )
        }

        runAutomationWorkflowWithTemporaryState(engine = engine, context = context)
    } finally {
        val variablesToRemove = engine.variable.findAll().toSet()
        automationVariableKeys.filter(variablesToRemove::contains).forEach(engine.variable::remove)
        previousVariables.forEach { (key, value) -> engine.variable.set(key = key, value = value) }

        automationAssetSourceIds.filterNot(originalAssetSources::contains).asReversed().forEach { sourceId ->
            if (sourceId in engine.asset.findAllSources()) {
                engine.asset.removeSource(sourceId)
            }
        }
    }
}

private suspend fun runAutomationWorkflowWithTemporaryState(
    engine: Engine,
    context: Context,
): AutomationResult {
    val outputDirectory = withContext(Dispatchers.IO) {
        File(context.cacheDir, "automate-workflows").apply {
            mkdirs()
            listFiles()?.forEach(File::delete)
        }
    }
    val templateScene = createTemplateScene(engine)
    val tokenizedBlockNames = discoverTokenizedBlocks(engine)
    val jobs = listOf(
        AutomationJob(
            fileStem = "summer-sale",
            headline = "Summer Sale",
            subline = "Save 25% on the launch collection.",
            cta = "Shop Now",
            heroImageUri = "https://img.ly/static/ubq_samples/sample_1.jpg",
        ),
        AutomationJob(
            fileStem = "autumn-launch",
            headline = "Autumn Launch",
            subline = "New arrivals for cozy desk setups.",
            cta = "Explore",
            heroImageUri = "https://img.ly/static/ubq_samples/sample_4.jpg",
        ),
    )

    val exportedFiles = jobs.map { job ->
        exportAutomationJob(
            engine = engine,
            templateScene = templateScene,
            job = job,
            outputDirectory = outputDirectory,
        )
    }

    return AutomationResult(
        variableKeys = automationVariableKeys.sorted(),
        tokenizedBlockNames = tokenizedBlockNames,
        exportedFiles = exportedFiles,
    )
}

private suspend fun createTemplateScene(engine: Engine): String {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1350F)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    val backgroundFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = backgroundFill,
        property = "fill/color/value",
        value = EngineColor.fromRGBA(r = 0.96F, g = 0.94F, b = 0.90F, a = 1F),
    )
    engine.block.setFill(background, fill = backgroundFill)
    engine.block.setWidth(background, value = 1080F)
    engine.block.setHeight(background, value = 1350F)
    engine.block.appendChild(parent = page, child = background)

    val heroImage = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(heroImage, name = "hero-image")
    engine.block.setShape(heroImage, shape = engine.block.createShape(ShapeType.Rect))
    val heroFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = heroFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_2.jpg",
    )
    engine.block.setFill(heroImage, fill = heroFill)
    engine.block.setWidth(heroImage, value = 860F)
    engine.block.setHeight(heroImage, value = 720F)
    engine.block.setPositionX(heroImage, value = 110F)
    engine.block.setPositionY(heroImage, value = 100F)
    engine.block.appendChild(parent = page, child = heroImage)

    val copyPanel = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(copyPanel, shape = engine.block.createShape(ShapeType.Rect))
    val copyPanelFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = copyPanelFill,
        property = "fill/color/value",
        value = EngineColor.fromRGBA(r = 1F, g = 1F, b = 1F, a = 0.92F),
    )
    engine.block.setFill(copyPanel, fill = copyPanelFill)
    engine.block.setWidth(copyPanel, value = 860F)
    engine.block.setHeight(copyPanel, value = 360F)
    engine.block.setPositionX(copyPanel, value = 110F)
    engine.block.setPositionY(copyPanel, value = 860F)
    engine.block.appendChild(parent = page, child = copyPanel)

    val headline = engine.block.create(DesignBlockType.Text)
    engine.block.setName(headline, name = "headline-copy")
    engine.block.setString(headline, property = "text/text", value = "{{headline}}")
    engine.block.setTextFontSize(headline, fontSize = 14F)
    engine.block.setTextColor(
        headline,
        color = EngineColor.fromRGBA(r = 0.12F, g = 0.10F, b = 0.15F, a = 1F),
    )
    engine.block.setWidth(headline, value = 700F)
    engine.block.setWidthMode(headline, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(headline, mode = SizeMode.AUTO)
    engine.block.setBoolean(headline, property = "text/clipLinesOutsideOfFrame", value = false)
    engine.block.setPositionX(headline, value = 160F)
    engine.block.setPositionY(headline, value = 915F)
    engine.block.appendChild(parent = page, child = headline)

    val subline = engine.block.create(DesignBlockType.Text)
    engine.block.setName(subline, name = "subline-copy")
    engine.block.setString(subline, property = "text/text", value = "{{subline}}")
    engine.block.setTextFontSize(subline, fontSize = 8F)
    engine.block.setTextColor(
        subline,
        color = EngineColor.fromRGBA(r = 0.28F, g = 0.24F, b = 0.32F, a = 1F),
    )
    engine.block.setWidth(subline, value = 700F)
    engine.block.setWidthMode(subline, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(subline, mode = SizeMode.AUTO)
    engine.block.setBoolean(subline, property = "text/clipLinesOutsideOfFrame", value = false)
    engine.block.setPositionX(subline, value = 160F)
    engine.block.setPositionY(subline, value = 1000F)
    engine.block.appendChild(parent = page, child = subline)

    val cta = engine.block.create(DesignBlockType.Text)
    engine.block.setName(cta, name = "cta-copy")
    engine.block.setString(cta, property = "text/text", value = "{{cta}}")
    engine.block.setTextFontSize(cta, fontSize = 9F)
    engine.block.setTextColor(
        cta,
        color = EngineColor.fromRGBA(r = 0.16F, g = 0.29F, b = 0.82F, a = 1F),
    )
    engine.block.setWidth(cta, value = 700F)
    engine.block.setWidthMode(cta, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(cta, mode = SizeMode.AUTO)
    engine.block.setBoolean(cta, property = "text/clipLinesOutsideOfFrame", value = false)
    engine.block.setPositionX(cta, value = 160F)
    engine.block.setPositionY(cta, value = 1090F)
    engine.block.appendChild(parent = page, child = cta)

    val serializedTemplate = engine.scene.saveToString(scene = scene)

    engine.block.forceLoadResources(listOf(heroImage, headline, subline, cta))

    return serializedTemplate
}

private fun discoverTokenizedBlocks(engine: Engine): List<String> {
    return engine.block.findAll()
        .filter { block -> engine.block.referencesAnyVariables(block) }
        .map { block -> engine.block.getName(block) }
        .filter(String::isNotBlank)
        .sorted()
}

private suspend fun exportAutomationJob(
    engine: Engine,
    templateScene: String,
    job: AutomationJob,
    outputDirectory: File,
): File {
    engine.scene.load(
        scene = templateScene,
        waitForResources = true,
    )
    engine.variable.set(key = "headline", value = job.headline)
    engine.variable.set(key = "subline", value = job.subline)
    engine.variable.set(key = "cta", value = job.cta)

    val heroImage = engine.block.findByName(name = "hero-image").first()
    val heroFill = engine.block.getFill(heroImage)
    engine.block.setString(
        block = heroFill,
        property = "fill/image/imageFileURI",
        value = job.heroImageUri,
    )
    engine.block.resetCrop(heroImage)

    val page = requireNotNull(engine.scene.getCurrentPage()) { "Expected a page in the automation template." }
    engine.block.forceLoadResources(listOf(page))

    val exportData = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
    )
    val outputFile = File(outputDirectory, "${job.fileStem}.png")
    withContext(Dispatchers.IO) {
        outputFile.outputStream().channel.use { channel ->
            while (exportData.hasRemaining()) {
                channel.write(exportData)
            }
        }
    }

    return outputFile
}
```

Automate repetitive exports by keeping the editor UI out of the loop. On Android, you start the Engine headlessly, apply data to a reusable scene contract, and export each result sequentially on the main thread.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/engine-guides-automate-workflows)

<EngineReferenceNote {...props} />

## What You'll Learn

- Decide whether a workflow should stay on-device, pause for approval, or hand off to a backend runtime.
- Build a reusable template contract with tokenized text and named media slots.
- Populate that contract with record data and export variants sequentially.
- Keep Android-specific constraints in mind when you scale up a workflow.

## Choose a Workflow Pattern

| Pattern | Android does | Use it when |
| --- | --- | --- |
| Client-only | Load a scene, set variables, export, and save the file locally. | The batch is short, assets already live on-device or on your CDN, and the user expects an immediate result. |
| Hybrid approval | Generate a populated scene first, then hand that scene to an editor flow for review or touch-ups. | Automation prepares most of the design, but a person still approves the final output. |
| Backend handoff | Assemble the job payload, template identifier, and record data, then let another runtime render the assets. | The batch is large, long-running, or better handled outside the device lifecycle. |

Android is the client runtime in these flows. If a job needs background orchestration, queueing, or server-triggered rendering, keep the same scene contract and move the rendering step to your backend runtime.

## Define the Batch Input

Keep each export job small and explicit. The example uses one record per output file, carrying the file name, text variables, and replacement media URI.

```kotlin highlight-android-record
private data class AutomationJob(
    val fileStem: String,
    val headline: String,
    val subline: String,
    val cta: String,
    val heroImageUri: String,
)
```

## Load Required Asset Sources

Load only the asset sources the workflow needs. The example follows the Android Starter Kit pattern and uses `engine.asset.addLocalSourceFromJSON(...)` instead of the deprecated `addDefaultAssetSources(...)` helper.

```kotlin highlight-android-asset-sources
val existingAssetSources = engine.asset.findAllSources().toSet()
val addedAssetSources = automationAssetSourceIds.filterNot(existingAssetSources::contains)
addedAssetSources.forEach { assetSource ->
    engine.asset.addLocalSourceFromJSON(
        contentUri = defaultBaseUri.buildUpon()
            .appendPath(assetSource)
            .appendPath("content.json")
            .build(),
    )
}
```

- Engine operations stay on the main thread. Use `withContext(Dispatchers.IO)` only for file I/O after export.
- The sample checks which CE.SDK default asset sources are already registered and only adds missing sources, so revisiting the screen does not add the same palette and font assets twice.

## Build a Reusable Scene Contract

The example creates its template scene in code so the workflow stays self-contained. In production, you would usually load the same structure from a saved `.scene` or archive instead.

```kotlin highlight-android-template
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1350F)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    val backgroundFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = backgroundFill,
        property = "fill/color/value",
        value = EngineColor.fromRGBA(r = 0.96F, g = 0.94F, b = 0.90F, a = 1F),
    )
    engine.block.setFill(background, fill = backgroundFill)
    engine.block.setWidth(background, value = 1080F)
    engine.block.setHeight(background, value = 1350F)
    engine.block.appendChild(parent = page, child = background)

    val heroImage = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(heroImage, name = "hero-image")
    engine.block.setShape(heroImage, shape = engine.block.createShape(ShapeType.Rect))
    val heroFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = heroFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_2.jpg",
    )
    engine.block.setFill(heroImage, fill = heroFill)
    engine.block.setWidth(heroImage, value = 860F)
    engine.block.setHeight(heroImage, value = 720F)
    engine.block.setPositionX(heroImage, value = 110F)
    engine.block.setPositionY(heroImage, value = 100F)
    engine.block.appendChild(parent = page, child = heroImage)

    val copyPanel = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(copyPanel, shape = engine.block.createShape(ShapeType.Rect))
    val copyPanelFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = copyPanelFill,
        property = "fill/color/value",
        value = EngineColor.fromRGBA(r = 1F, g = 1F, b = 1F, a = 0.92F),
    )
    engine.block.setFill(copyPanel, fill = copyPanelFill)
    engine.block.setWidth(copyPanel, value = 860F)
    engine.block.setHeight(copyPanel, value = 360F)
    engine.block.setPositionX(copyPanel, value = 110F)
    engine.block.setPositionY(copyPanel, value = 860F)
    engine.block.appendChild(parent = page, child = copyPanel)

    val headline = engine.block.create(DesignBlockType.Text)
    engine.block.setName(headline, name = "headline-copy")
    engine.block.setString(headline, property = "text/text", value = "{{headline}}")
    engine.block.setTextFontSize(headline, fontSize = 14F)
    engine.block.setTextColor(
        headline,
        color = EngineColor.fromRGBA(r = 0.12F, g = 0.10F, b = 0.15F, a = 1F),
    )
    engine.block.setWidth(headline, value = 700F)
    engine.block.setWidthMode(headline, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(headline, mode = SizeMode.AUTO)
    engine.block.setBoolean(headline, property = "text/clipLinesOutsideOfFrame", value = false)
    engine.block.setPositionX(headline, value = 160F)
    engine.block.setPositionY(headline, value = 915F)
    engine.block.appendChild(parent = page, child = headline)

    val subline = engine.block.create(DesignBlockType.Text)
    engine.block.setName(subline, name = "subline-copy")
    engine.block.setString(subline, property = "text/text", value = "{{subline}}")
    engine.block.setTextFontSize(subline, fontSize = 8F)
    engine.block.setTextColor(
        subline,
        color = EngineColor.fromRGBA(r = 0.28F, g = 0.24F, b = 0.32F, a = 1F),
    )
    engine.block.setWidth(subline, value = 700F)
    engine.block.setWidthMode(subline, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(subline, mode = SizeMode.AUTO)
    engine.block.setBoolean(subline, property = "text/clipLinesOutsideOfFrame", value = false)
    engine.block.setPositionX(subline, value = 160F)
    engine.block.setPositionY(subline, value = 1000F)
    engine.block.appendChild(parent = page, child = subline)

    val cta = engine.block.create(DesignBlockType.Text)
    engine.block.setName(cta, name = "cta-copy")
    engine.block.setString(cta, property = "text/text", value = "{{cta}}")
    engine.block.setTextFontSize(cta, fontSize = 9F)
    engine.block.setTextColor(
        cta,
        color = EngineColor.fromRGBA(r = 0.16F, g = 0.29F, b = 0.82F, a = 1F),
    )
    engine.block.setWidth(cta, value = 700F)
    engine.block.setWidthMode(cta, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(cta, mode = SizeMode.AUTO)
    engine.block.setBoolean(cta, property = "text/clipLinesOutsideOfFrame", value = false)
    engine.block.setPositionX(cta, value = 160F)
    engine.block.setPositionY(cta, value = 1090F)
    engine.block.appendChild(parent = page, child = cta)

    val serializedTemplate = engine.scene.saveToString(scene = scene)
```

This template contract does two important things:

- Text blocks contain `{{headline}}`, `{{subline}}`, and `{{cta}}` tokens. Those tokens resolve against the Engine’s variable store at render time.
- The hero image block is named `hero-image`, giving the automation step a stable handle for media replacement.
- A dedicated footer panel reserves readable copy space below the image, so the exported variants stay legible on-device even in evaluation mode.

## Validate What the Template Exposes

On Android, `engine.variable.findAll()` only lists keys that are already present in the variable store. It does not discover `{{token}}` references directly from the scene. Before you run a batch, keep the expected variable keys in your own app contract and use block inspection to verify which named blocks still reference variables.

```kotlin highlight-android-discover-slots
return engine.block.findAll()
    .filter { block -> engine.block.referencesAnyVariables(block) }
    .map { block -> engine.block.getName(block) }
    .filter(String::isNotBlank)
    .sorted()
```

This gives you a lightweight structure check without mutating the scene. It is especially useful when designers iterate on a template and you want a fast sanity check before exporting a larger batch.

## Apply Record Data and Replace Media

For each record, reload the reusable template, set the variable values, then update the named media slot.

```kotlin highlight-android-apply-data
    engine.scene.load(
        scene = templateScene,
        waitForResources = true,
    )
    engine.variable.set(key = "headline", value = job.headline)
    engine.variable.set(key = "subline", value = job.subline)
    engine.variable.set(key = "cta", value = job.cta)

    val heroImage = engine.block.findByName(name = "hero-image").first()
    val heroFill = engine.block.getFill(heroImage)
    engine.block.setString(
        block = heroFill,
        property = "fill/image/imageFileURI",
        value = job.heroImageUri,
    )
    engine.block.resetCrop(heroImage)
```

- Reloading the serialized template keeps each export isolated from the previous record.
- Variable keys are case-sensitive. Treat them like part of your API contract between the template and your app.
- `resetCrop()` reapplies the placeholder framing after a new image URI is assigned.

## Export Sequentially on Android

Export the current page, write the buffer to disk, and move on to the next record. Keeping the pipeline sequential avoids unnecessary memory pressure on the device.

```kotlin highlight-android-export
val exportData = engine.block.export(
    block = page,
    mimeType = MimeType.PNG,
)
val outputFile = File(outputDirectory, "${job.fileStem}.png")
withContext(Dispatchers.IO) {
    outputFile.outputStream().channel.use { channel ->
        while (exportData.hasRemaining()) {
            channel.write(exportData)
        }
    }
}
```

The sample exports PNG previews because they are easy to inspect in-app. The same pattern works with `MimeType.JPEG` or `MimeType.PDF` when your downstream workflow expects a different output format.

To process more than one record, keep the Engine alive and run the same steps in order:

```kotlin highlight-android-batch
val exportedFiles = jobs.map { job ->
    exportAutomationJob(
        engine = engine,
        templateScene = templateScene,
        job = job,
        outputDirectory = outputDirectory,
    )
}
```

## Add a Human Approval Step

If a design still needs review, stop after populating the scene instead of exporting immediately. Serialize that populated scene with `engine.scene.saveToString(...)`, then open the saved scene in an editor flow. This keeps one template contract for both automated generation and manual approval.

## Next Steps

- [Headless Mode](./concepts/headless-mode.md) – use the Engine directly when no prebuilt UI is needed.
- [Batch Processing](./automation/batch-processing.md) – repeat the same automation flow across many records.
- [Create Templates](./create-templates/overview.md) – design the reusable scenes your workflow populates.
- [Text Variables](./create-templates/add-dynamic-content/text-variables.md) – manage the variable store and tokenized text safely.



---

## Related Pages

- [Overview](./automation/overview.md) - Automate repetitive editing tasks using CE.SDK’s headless APIs to generate assets at scale.
- [Batch Processing](./automation/batch-processing.md) - Documentation for Batch Processing
- [Auto-Resize Blocks in Android (Kotlin)](./automation/auto-resize.md) - Configure absolute, percent, and auto sizing modes to build responsive, content-driven layouts with the CE.SDK block API on Android.
- [Data Merge](./automation/data-merge.md) - Generate personalized designs from a single template by merging external data into CE.SDK scenes with variables and named placeholder blocks.
- [Product Variations](./automation/product-variations.md) - Generate multiple product variants from a single template by swapping text, images and styles programmatically.
- [Automate Design Generation](./automation/design-generation.md) - Generate personalized designs programmatically from reusable templates with CE.SDK's Android Engine API.
- [Multiple Image Generation](./automation/multi-image-generation.md) - Create many image variants from structured data by interpolating content into reusable design templates.


---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support