> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Rules](../rules.md) > [Moderate Content](./moderate-content.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-moderate-content/ModerateContent.kt reference-only
import android.net.Uri
import androidx.annotation.MainThread
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.Source
import java.nio.ByteBuffer
import java.util.concurrent.ConcurrentHashMap

enum class ModerationSeverity(
    val rank: Int,
) {
    SUCCESS(rank = 0),
    WARNING(rank = 1),
    FAILED(rank = 2),
}

data class ModerationCategory(
    val name: String,
    val confidence: Float,
    val state: ModerationSeverity,
)

data class ModerationImageBlock(
    val block: DesignBlock,
    val uri: Uri,
    val name: String,
)

data class ModerationTextBlock(
    val block: DesignBlock,
    val text: String,
    val name: String,
)

data class ModerationResult(
    val id: String,
    val block: DesignBlock,
    val blockName: String,
    val contentKind: String,
    val state: ModerationSeverity,
    val categories: List<ModerationCategory>,
)

data class ModerationCache(
    val imageCategoriesByUri: MutableMap<String, List<ModerationCategory>> = ConcurrentHashMap(),
    val textCategoriesByContent: MutableMap<String, List<ModerationCategory>> = ConcurrentHashMap(),
)

data class ModerationSummary(
    val results: List<ModerationResult>,
    val groupedResults: Map<ModerationSeverity, List<ModerationResult>>,
    val detectedImageUris: List<Uri>,
    val selectedBlock: DesignBlock?,
    val selectedAfterInteractiveSelect: Boolean,
    val exportedImage: ByteBuffer?,
)

@MainThread
fun getImageUrl(
    engine: Engine,
    block: DesignBlock,
): Uri? {
    if (!engine.block.supportsFill(block)) return null

    val fill = runCatching { engine.block.getFill(block) }.getOrNull() ?: return null
    if (engine.block.getType(fill) != FillType.Image.key) return null

    val sourceSetUri = runCatching {
        engine.block.getSourceSet(block = fill, property = "fill/image/sourceSet")
            .firstOrNull { it.uri.toString().isNotBlank() }
            ?.uri
    }.getOrNull()

    return sourceSetUri ?: runCatching {
        engine.block.getUri(block = fill, property = "fill/image/imageFileURI")
    }.getOrNull()?.takeIf { it.toString().isNotBlank() }
}

suspend fun checkAllImages(
    engine: Engine,
    moderationCache: ModerationCache,
): List<ModerationResult> = withContext(engine.dispatcher) {
    val imageBlocks = engine.block.findByType(DesignBlockType.Graphic).mapNotNull { block ->
        val uri = getImageUrl(engine = engine, block = block) ?: return@mapNotNull null
        ModerationImageBlock(
            block = block,
            uri = uri,
            name = engine.block.getName(block).ifBlank { "Image $block" },
        )
    }

    val categoriesByUri = imageBlocks
        .distinctBy { it.uri.toString() }
        .map { imageBlock ->
            async {
                imageBlock.uri.toString() to checkImageContentAPI(
                    image = imageBlock,
                    imageCache = moderationCache.imageCategoriesByUri,
                )
            }
        }
        .awaitAll()
        .toMap()

    imageBlocks.map { imageBlock ->
        val categories = categoriesByUri.getValue(imageBlock.uri.toString())
        ModerationResult(
            id = "image:${imageBlock.block}",
            block = imageBlock.block,
            blockName = imageBlock.name,
            contentKind = "image",
            state = categories.maxByOrNull { it.state.rank }?.state ?: ModerationSeverity.SUCCESS,
            categories = categories,
        )
    }
}

@MainThread
fun getTextContent(
    engine: Engine,
    block: DesignBlock,
): String? = engine.block
    .getString(block = block, property = "text/text")
    .trim()
    .takeIf(String::isNotEmpty)

suspend fun checkAllText(
    engine: Engine,
    moderationCache: ModerationCache,
): List<ModerationResult> = withContext(engine.dispatcher) {
    val textBlocks = engine.block.findByType(DesignBlockType.Text).mapNotNull { block ->
        val text = getTextContent(engine = engine, block = block) ?: return@mapNotNull null
        ModerationTextBlock(
            block = block,
            text = text,
            name = engine.block.getName(block).ifBlank { "Text $block" },
        )
    }

    val categoriesByText = textBlocks
        .distinctBy(ModerationTextBlock::text)
        .map { textBlock ->
            async {
                textBlock.text to checkTextContentAPI(
                    text = textBlock,
                    textCache = moderationCache.textCategoriesByContent,
                )
            }
        }
        .awaitAll()
        .toMap()

    textBlocks.map { textBlock ->
        val categories = categoriesByText.getValue(textBlock.text)
        ModerationResult(
            id = "text:${textBlock.block}",
            block = textBlock.block,
            blockName = textBlock.name,
            contentKind = "text",
            state = categories.maxByOrNull { it.state.rank }?.state ?: ModerationSeverity.SUCCESS,
            categories = categories,
        )
    }
}

suspend fun checkImageContentAPI(
    image: ModerationImageBlock,
    imageCache: MutableMap<String, List<ModerationCategory>>,
): List<ModerationCategory> {
    val cacheKey = image.uri.toString()
    imageCache[cacheKey]?.let { cachedCategories -> return cachedCategories }

    val categories = withContext(Dispatchers.IO) {
        // Replace this block with a request to your backend moderation endpoint.
        listOf(
            ModerationCategory(
                name = "adult-content",
                confidence = 0.16F,
                state = severityFor(confidence = 0.16F),
            ),
            ModerationCategory(
                name = "violence",
                confidence = 0.08F,
                state = severityFor(confidence = 0.08F),
            ),
        )
    }
    imageCache[cacheKey] = categories

    return categories
}

suspend fun checkTextContentAPI(
    text: ModerationTextBlock,
    textCache: MutableMap<String, List<ModerationCategory>>,
): List<ModerationCategory> {
    textCache[text.text]?.let { cachedCategories -> return cachedCategories }

    val categories = withContext(Dispatchers.IO) {
        // Replace this block with a request to your backend moderation endpoint.
        listOf(
            ModerationCategory(
                name = "profanity",
                confidence = 0.12F,
                state = severityFor(confidence = 0.12F),
            ),
            ModerationCategory(
                name = "policy-review",
                confidence = if (text.text.contains("review", ignoreCase = true)) 0.46F else 0.18F,
                state = severityFor(
                    confidence = if (text.text.contains("review", ignoreCase = true)) 0.46F else 0.18F,
                ),
            ),
        )
    }
    textCache[text.text] = categories

    return categories
}

fun severityFor(confidence: Float): ModerationSeverity = when {
    confidence > 0.8F -> ModerationSeverity.FAILED
    confidence > 0.4F -> ModerationSeverity.WARNING
    else -> ModerationSeverity.SUCCESS
}

fun summarizeModerationResults(results: List<ModerationResult>): Map<ModerationSeverity, List<ModerationResult>> =
    results.groupBy(ModerationResult::state)

fun resultsByPriority(results: List<ModerationResult>): List<ModerationResult> = results.sortedWith(
    compareByDescending<ModerationResult> { it.state.rank }
        .thenBy { it.contentKind }
        .thenBy { it.blockName },
)

suspend fun selectModerationResult(
    engine: Engine,
    result: ModerationResult,
) = withContext(engine.dispatcher) {
    if (!engine.block.isValid(result.block)) return@withContext

    engine.block.findAllSelected().forEach { selectedBlock ->
        engine.block.setSelected(block = selectedBlock, selected = false)
    }
    engine.block.setSelected(block = result.block, selected = true)
}

suspend fun validateBeforeExport(
    engine: Engine,
    targetBlock: DesignBlock,
    moderationCache: ModerationCache,
): ByteBuffer? {
    val imageResults = checkAllImages(engine = engine, moderationCache = moderationCache)
    val textResults = checkAllText(engine = engine, moderationCache = moderationCache)
    val violations = (imageResults + textResults).filter { it.state == ModerationSeverity.FAILED }

    if (violations.isNotEmpty()) {
        return null
    }

    return withContext(engine.dispatcher) {
        if (!engine.block.isValid(targetBlock)) return@withContext null
        engine.block.export(block = targetBlock, mimeType = MimeType.PNG)
    }
}

suspend fun moderateContent(engine: Engine): ModerationSummary = withContext(engine.dispatcher) {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(imageBlock, name = "Campaign image")
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(imageBlock, value = 80F)
    engine.block.setPositionY(imageBlock, value = 80F)
    engine.block.setWidth(imageBlock, value = 320F)
    engine.block.setHeight(imageBlock, value = 220F)
    engine.block.appendChild(parent = page, child = imageBlock)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )
    engine.block.setFill(block = imageBlock, fill = imageFill)

    val sourceSetImageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setName(sourceSetImageBlock, name = "Responsive campaign image")
    engine.block.setShape(sourceSetImageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(sourceSetImageBlock, value = 430F)
    engine.block.setPositionY(sourceSetImageBlock, value = 80F)
    engine.block.setWidth(sourceSetImageBlock, value = 280F)
    engine.block.setHeight(sourceSetImageBlock, value = 220F)
    engine.block.appendChild(parent = page, child = sourceSetImageBlock)

    val sourceSetImageFill = engine.block.createFill(FillType.Image)
    engine.block.setSourceSet(
        block = sourceSetImageFill,
        property = "fill/image/sourceSet",
        sourceSet = listOf(
            Source(
                uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1_512x341.jpg"),
                width = 512,
                height = 341,
            ),
        ),
    )
    engine.block.setFill(block = sourceSetImageBlock, fill = sourceSetImageFill)

    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.setName(textBlock, name = "Campaign headline")
    engine.block.setPositionX(textBlock, value = 80F)
    engine.block.setPositionY(textBlock, value = 340F)
    engine.block.setWidth(textBlock, value = 520F)
    engine.block.setHeight(textBlock, value = 80F)
    engine.block.setString(
        block = textBlock,
        property = "text/text",
        value = "Needs manual review before publishing",
    )
    engine.block.appendChild(parent = page, child = textBlock)

    val moderationCache = ModerationCache()
    val imageResults = checkAllImages(engine = engine, moderationCache = moderationCache)
    val textResults = checkAllText(engine = engine, moderationCache = moderationCache)
    val results = resultsByPriority(imageResults + textResults)
    val selectedResult = results.firstOrNull()
    if (selectedResult != null) {
        selectModerationResult(engine = engine, result = selectedResult)
    }

    ModerationSummary(
        results = results,
        groupedResults = summarizeModerationResults(results),
        detectedImageUris = engine.block.findByType(DesignBlockType.Graphic).mapNotNull { block ->
            getImageUrl(engine = engine, block = block)
        },
        selectedBlock = selectedResult?.block,
        selectedAfterInteractiveSelect = selectedResult?.let { engine.block.findAllSelected().contains(it.block) } ?: false,
        exportedImage = validateBeforeExport(
            engine = engine,
            targetBlock = page,
            moderationCache = moderationCache,
        ),
    )
}
```

Use CE.SDK's Engine API to extract images and text from designs, then
integrate third-party moderation services to detect inappropriate content.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260825/engine-guides-moderate-content)

<EngineReferenceNote {...props} />

CE.SDK does not provide prebuilt content moderation workflows. Instead, it provides engine APIs that extract images and text from designs for moderation by third-party services of your choice. This is intentional: moderation requirements are specific to each business, including which categories to check, what thresholds to apply, and which services to use.

Content moderation helps maintain quality standards and comply with content policies. Unlike built-in validation rules that check technical aspects like resolution or layout, content moderation relies on external AI services (Sightengine, AWS Rekognition, OpenAI Moderation API) to analyze visual content and textual content.

The sample uses these small value types to carry extracted content, per-category confidence scores, and the block IDs that let your app make moderation findings actionable:

```kotlin highlight-android-models
enum class ModerationSeverity(
    val rank: Int,
) {
    SUCCESS(rank = 0),
    WARNING(rank = 1),
    FAILED(rank = 2),
}

data class ModerationCategory(
    val name: String,
    val confidence: Float,
    val state: ModerationSeverity,
)

data class ModerationImageBlock(
    val block: DesignBlock,
    val uri: Uri,
    val name: String,
)

data class ModerationTextBlock(
    val block: DesignBlock,
    val text: String,
    val name: String,
)

data class ModerationResult(
    val id: String,
    val block: DesignBlock,
    val blockName: String,
    val contentKind: String,
    val state: ModerationSeverity,
    val categories: List<ModerationCategory>,
)

data class ModerationCache(
    val imageCategoriesByUri: MutableMap<String, List<ModerationCategory>> = ConcurrentHashMap(),
    val textCategoriesByContent: MutableMap<String, List<ModerationCategory>> = ConcurrentHashMap(),
)
```

## Finding Content in Designs

Locate image and text blocks, then extract the data your moderation backend needs.

**Images**: Use `findByType(DesignBlockType.Graphic)` to find graphic blocks, then keep only blocks whose fill is an image fill. `getFill()` returns the fill block and `getType()` verifies `FillType.Image`. The helper prefers the highest-resolution non-empty source from `fill/image/sourceSet`, matching the Engine's source-set precedence, then falls back to `fill/image/imageFileURI`:

```kotlin highlight-android-get-image-url
@MainThread
fun getImageUrl(
    engine: Engine,
    block: DesignBlock,
): Uri? {
    if (!engine.block.supportsFill(block)) return null

    val fill = runCatching { engine.block.getFill(block) }.getOrNull() ?: return null
    if (engine.block.getType(fill) != FillType.Image.key) return null

    val sourceSetUri = runCatching {
        engine.block.getSourceSet(block = fill, property = "fill/image/sourceSet")
            .firstOrNull { it.uri.toString().isNotBlank() }
            ?.uri
    }.getOrNull()

    return sourceSetUri ?: runCatching {
        engine.block.getUri(block = fill, property = "fill/image/imageFileURI")
    }.getOrNull()?.takeIf { it.toString().isNotBlank() }
}
```

Process every image by checking each unique URI against the moderation service. Repeated image fills reuse the same result from the workflow-owned `ModerationCache`. The extraction phase switches to `engine.dispatcher` before accessing Engine APIs, then the backend checks run concurrently:

```kotlin highlight-android-check-all-images
suspend fun checkAllImages(
    engine: Engine,
    moderationCache: ModerationCache,
): List<ModerationResult> = withContext(engine.dispatcher) {
    val imageBlocks = engine.block.findByType(DesignBlockType.Graphic).mapNotNull { block ->
        val uri = getImageUrl(engine = engine, block = block) ?: return@mapNotNull null
        ModerationImageBlock(
            block = block,
            uri = uri,
            name = engine.block.getName(block).ifBlank { "Image $block" },
        )
    }

    val categoriesByUri = imageBlocks
        .distinctBy { it.uri.toString() }
        .map { imageBlock ->
            async {
                imageBlock.uri.toString() to checkImageContentAPI(
                    image = imageBlock,
                    imageCache = moderationCache.imageCategoriesByUri,
                )
            }
        }
        .awaitAll()
        .toMap()

    imageBlocks.map { imageBlock ->
        val categories = categoriesByUri.getValue(imageBlock.uri.toString())
        ModerationResult(
            id = "image:${imageBlock.block}",
            block = imageBlock.block,
            blockName = imageBlock.name,
            contentKind = "image",
            state = categories.maxByOrNull { it.state.rank }?.state ?: ModerationSeverity.SUCCESS,
            categories = categories,
        )
    }
}
```

Engine URIs can use app-local schemes such as `file`, `content`, `bundle`, or `buffer`. When your moderation provider requires a public URL, upload or proxy that resource through your authenticated backend before calling the provider.

**Text**: Use `findByType(DesignBlockType.Text)` to find text blocks, then read the visible content from the `text/text` property:

```kotlin highlight-android-get-text-content
@MainThread
fun getTextContent(
    engine: Engine,
    block: DesignBlock,
): String? = engine.block
    .getString(block = block, property = "text/text")
    .trim()
    .takeIf(String::isNotEmpty)
```

Process every text block the same way, deduplicating repeated strings before launching backend requests:

```kotlin highlight-android-check-all-text
suspend fun checkAllText(
    engine: Engine,
    moderationCache: ModerationCache,
): List<ModerationResult> = withContext(engine.dispatcher) {
    val textBlocks = engine.block.findByType(DesignBlockType.Text).mapNotNull { block ->
        val text = getTextContent(engine = engine, block = block) ?: return@mapNotNull null
        ModerationTextBlock(
            block = block,
            text = text,
            name = engine.block.getName(block).ifBlank { "Text $block" },
        )
    }

    val categoriesByText = textBlocks
        .distinctBy(ModerationTextBlock::text)
        .map { textBlock ->
            async {
                textBlock.text to checkTextContentAPI(
                    text = textBlock,
                    textCache = moderationCache.textCategoriesByContent,
                )
            }
        }
        .awaitAll()
        .toMap()

    textBlocks.map { textBlock ->
        val categories = categoriesByText.getValue(textBlock.text)
        ModerationResult(
            id = "text:${textBlock.block}",
            block = textBlock.block,
            blockName = textBlock.name,
            contentKind = "text",
            state = categories.maxByOrNull { it.state.rank }?.state ?: ModerationSeverity.SUCCESS,
            categories = categories,
        )
    }
}
```

## Integrating Moderation APIs

Integrate external AI services such as Sightengine, AWS Rekognition, or the OpenAI Moderation API through your backend. Do not ship moderation provider credentials in the Android app.

**Image Moderation** - The example uses a simulated backend response and stores results by URI in the workflow-owned cache. Replace the marked block with your own backend request:

```kotlin highlight-android-image-moderation-api
suspend fun checkImageContentAPI(
    image: ModerationImageBlock,
    imageCache: MutableMap<String, List<ModerationCategory>>,
): List<ModerationCategory> {
    val cacheKey = image.uri.toString()
    imageCache[cacheKey]?.let { cachedCategories -> return cachedCategories }

    val categories = withContext(Dispatchers.IO) {
        // Replace this block with a request to your backend moderation endpoint.
        listOf(
            ModerationCategory(
                name = "adult-content",
                confidence = 0.16F,
                state = severityFor(confidence = 0.16F),
            ),
            ModerationCategory(
                name = "violence",
                confidence = 0.08F,
                state = severityFor(confidence = 0.08F),
            ),
        )
    }
    imageCache[cacheKey] = categories

    return categories
}
```

**Text Moderation** - Text checks follow the same shape and store results by text content in the same cache:

```kotlin highlight-android-text-moderation-api
suspend fun checkTextContentAPI(
    text: ModerationTextBlock,
    textCache: MutableMap<String, List<ModerationCategory>>,
): List<ModerationCategory> {
    textCache[text.text]?.let { cachedCategories -> return cachedCategories }

    val categories = withContext(Dispatchers.IO) {
        // Replace this block with a request to your backend moderation endpoint.
        listOf(
            ModerationCategory(
                name = "profanity",
                confidence = 0.12F,
                state = severityFor(confidence = 0.12F),
            ),
            ModerationCategory(
                name = "policy-review",
                confidence = if (text.text.contains("review", ignoreCase = true)) 0.46F else 0.18F,
                state = severityFor(
                    confidence = if (text.text.contains("review", ignoreCase = true)) 0.46F else 0.18F,
                ),
            ),
        )
    }
    textCache[text.text] = categories

    return categories
}
```

**Processing Results** - Map confidence scores to severity levels: failed above `0.8F`, warning above `0.4F`, and success at or below `0.4F`:

```kotlin highlight-android-threshold-mapping
fun severityFor(confidence: Float): ModerationSeverity = when {
    confidence > 0.8F -> ModerationSeverity.FAILED
    confidence > 0.4F -> ModerationSeverity.WARNING
    else -> ModerationSeverity.SUCCESS
}
```

## Displaying Validation Results

Group results by severity in your own UI, and sort them so failed or warning items appear first:

```kotlin highlight-android-display-results
fun summarizeModerationResults(results: List<ModerationResult>): Map<ModerationSeverity, List<ModerationResult>> =
    results.groupBy(ModerationResult::state)

fun resultsByPriority(results: List<ModerationResult>): List<ModerationResult> = results.sortedWith(
    compareByDescending<ModerationResult> { it.state.rank }
        .thenBy { it.contentKind }
        .thenBy { it.blockName },
)
```

Make results actionable by selecting the corresponding block when the user picks a finding. This helps them locate problematic content on the canvas. The helper switches to the Engine dispatcher and ignores findings whose block was removed while moderation was running:

```kotlin highlight-android-interactive-results
suspend fun selectModerationResult(
    engine: Engine,
    result: ModerationResult,
) = withContext(engine.dispatcher) {
    if (!engine.block.isValid(result.block)) return@withContext

    engine.block.findAllSelected().forEach { selectedBlock ->
        engine.block.setSelected(block = selectedBlock, selected = false)
    }
    engine.block.setSelected(block = result.block, selected = true)
}
```

## Integration Points

Run validation at the point that fits your workflow. The most common gate is export: validate the design and refuse to render it when violations exist. The example checks image and text results, then exports the target block to PNG only when no failed result remains:

```kotlin highlight-android-export-validation
suspend fun validateBeforeExport(
    engine: Engine,
    targetBlock: DesignBlock,
    moderationCache: ModerationCache,
): ByteBuffer? {
    val imageResults = checkAllImages(engine = engine, moderationCache = moderationCache)
    val textResults = checkAllText(engine = engine, moderationCache = moderationCache)
    val violations = (imageResults + textResults).filter { it.state == ModerationSeverity.FAILED }

    if (violations.isNotEmpty()) {
        return null
    }

    return withContext(engine.dispatcher) {
        if (!engine.block.isValid(targetBlock)) return@withContext null
        engine.block.export(block = targetBlock, mimeType = MimeType.PNG)
    }
}
```

Other integration points follow the same pattern:

- **Pre-upload validation**: Check content before allowing uploads to your platform.
- **Review queue**: Flag designs with warnings for manual review.
- **Batch validation**: Check all content on demand when the user requests it.

## Best Practices

**Security**: Proxy moderation requests through your backend to protect credentials. Apply rate limiting, require authentication, and log checks for compliance.

**Performance**: Keep a `ModerationCache` for the workflow and pass it to both content checks and export validation. This deduplicates repeated image URIs and text content, preserves results between validation passes, and processes unique moderation requests concurrently.

**User Experience**: Run checks asynchronously so the editor stays responsive. Provide clear messages and let users jump to flagged blocks. In an interactive export flow, pause edits while moderation runs or restart validation when the design changes.

**Timing**: Validate at export time for the best balance between policy enforcement and creative freedom.

## Troubleshooting

**Checks not running**: Verify that the engine is initialized, a scene is loaded, content exists, your backend endpoint is reachable, and moderation credentials are valid on the server.

**Content not found**: Find image content by scanning graphic blocks and filtering for `FillType.Image`. A block's kind is free-form and may be unset, so fill type is the dependable image check. For text, skip empty `text/text` values.

**API errors**: Check backend authentication, endpoint URLs, image URL accessibility, rate limits, and provider-specific error codes.

**Inconsistent results**: Verify cache keys, threshold values, API response parsing, and confidence score ranges.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.findByType(type=DesignBlockType.Graphic)` | Find graphic blocks that may contain image fills |
| `engine.block.findByType(type=DesignBlockType.Text)` | Find text blocks |
| `engine.dispatcher` | Switch coroutine work to the Engine thread before accessing Engine APIs |
| `engine.block.supportsFill(block=_)` | Check whether a block can have a fill |
| `engine.block.getFill(block=_)` | Get the fill block attached to a design block |
| `engine.block.getType(block=_)` | Read a block or fill type string, such as `FillType.Image.key` |
| `engine.block.getUri(block=_, property="fill/image/imageFileURI")` | Read the fallback image URI when no source set is available |
| `engine.block.getSourceSet(block=_, property="fill/image/sourceSet")` | Read responsive image sources in highest-resolution-first order |
| `engine.block.getString(block=_, property="text/text")` | Read a text block's content |
| `engine.block.getName(block=_)` | Read a block display name for result labels |
| `engine.block.findAllSelected()` | Get currently selected blocks |
| `engine.block.isValid(block=_)` | Check that a moderated block still exists before selecting or exporting it |
| `engine.block.setSelected(block=_, selected=_)` | Select or deselect a block |
| `engine.block.export(block=_, mimeType=MimeType.PNG)` | Render a block to PNG after validation passes |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `fill/image/imageFileURI` | `Uri` | Fallback image URI when no source set is available |
| `fill/image/sourceSet` | `List<Source>` | Preferred responsive image sources with URIs and pixel dimensions |
| `text/text` | `String` | Text content of a text block |

## Next Steps

Now that you understand content moderation, explore related validation features:

- [Rules Overview](./overview.md) — Understand the scopes and permission model behind CE.SDK rules



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support