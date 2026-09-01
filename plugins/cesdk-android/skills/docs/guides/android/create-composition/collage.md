> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Create a Collage](./collage.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-collage/Collage.kt reference-only
import android.net.Uri
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GlobalScope
import ly.img.engine.ShapeType
import kotlin.math.roundToInt

suspend fun collage(engine: Engine) = withContext(engine.dispatcher) {
    createAndApplyCollage(engine = engine)
}

private suspend fun createAndApplyCollage(engine: Engine) {
    val scene = engine.scene.create()
    val page = createCollagePage(engine = engine, width = 1080F, height = 1080F)
    engine.block.appendChild(parent = scene, child = page)

    addImageSlot(
        engine = engine,
        page = page,
        uri = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
        x = 32F,
        y = 32F,
        width = 480F,
        height = 480F,
    )
    addImageSlot(
        engine = engine,
        page = page,
        uri = Uri.parse("https://img.ly/static/ubq_samples/sample_2.jpg"),
        x = 568F,
        y = 32F,
        width = 480F,
        height = 480F,
    )
    addTextBlock(
        engine = engine,
        page = page,
        text = "Weekend trip",
        x = 64F,
        y = 830F,
    )

    val layoutBlocksString = createCollagePage(engine = engine, width = 1080F, height = 1080F).let { layoutPage ->
        try {
            addImageSlot(engine = engine, page = layoutPage, x = 32F, y = 32F, width = 1016F, height = 496F)
            addImageSlot(engine = engine, page = layoutPage, x = 32F, y = 560F, width = 492F, height = 360F)
            addImageSlot(engine = engine, page = layoutPage, x = 556F, y = 560F, width = 492F, height = 360F)
            addTextBlock(engine = engine, page = layoutPage, text = "Title", x = 64F, y = 952F)
            engine.block.saveToString(blocks = listOf(layoutPage))
        } finally {
            engine.block.destroy(layoutPage)
        }
    }

    val collagePage = applyCollageLayout(
        engine = engine,
        currentPage = page,
        layoutBlocksString = layoutBlocksString,
        addUndoStep = true,
    )

    engine.scene.zoomToBlock(
        block = collagePage,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )
}

suspend fun applyCollageLayout(
    engine: Engine,
    currentPage: DesignBlock,
    layoutBlocksString: String,
    addUndoStep: Boolean = true,
): DesignBlock = withContext(engine.dispatcher) {
    val previousDestroyScope = engine.editor.getGlobalScope("lifecycle/destroy")
    engine.editor.setGlobalScope(key = "lifecycle/destroy", globalScope = GlobalScope.ALLOW)

    try {
        engine.block.findAllSelected().forEach { selectedBlock ->
            engine.block.setSelected(block = selectedBlock, selected = false)
        }

        var oldPage: DesignBlock? = null
        var loadedLayoutPage: DesignBlock? = null

        try {
            oldPage = engine.block.duplicate(block = currentPage, attachToParent = false)
            loadedLayoutPage = engine.block.loadFromString(layoutBlocksString).first()

            engine.block.getChildren(currentPage).forEach(engine.block::destroy)
            engine.block.getChildren(loadedLayoutPage).forEach { child ->
                engine.block.insertChild(parent = currentPage, child = child, index = engine.block.getChildren(currentPage).size)
            }

            transferCollageContent(engine = engine, fromPage = oldPage, toPage = currentPage)
        } finally {
            loadedLayoutPage?.let { engine.block.destroy(it) }
            oldPage?.let { engine.block.destroy(it) }
        }

        if (addUndoStep) {
            engine.editor.addUndoStep()
        }
        currentPage
    } finally {
        engine.editor.setGlobalScope(key = "lifecycle/destroy", globalScope = previousDestroyScope)
    }
}

private fun transferCollageContent(
    engine: Engine,
    fromPage: DesignBlock,
    toPage: DesignBlock,
) {
    val sourceBlocks = visuallySortedBlocks(
        engine = engine,
        rootPage = fromPage,
        blocks = collectChildrenTree(engine = engine, parent = fromPage),
    )
    val targetBlocks = visuallySortedBlocks(
        engine = engine,
        rootPage = toPage,
        blocks = collectChildrenTree(engine = engine, parent = toPage),
    )

    val sourceImages = sourceBlocks.filter { isImageBlock(engine = engine, designBlock = it) }
    val targetImages = targetBlocks.filter { isImageBlock(engine = engine, designBlock = it) }
    sourceImages.zip(targetImages).forEach { (sourceImage, targetImage) ->
        copyImageContent(engine = engine, sourceImage = sourceImage, targetImage = targetImage)
    }

    val sourceTexts = sourceBlocks.filter { engine.block.getType(it) == DesignBlockType.Text.key }
    val targetTexts = targetBlocks.filter { engine.block.getType(it) == DesignBlockType.Text.key }
    sourceTexts.zip(targetTexts).forEach { (sourceText, targetText) ->
        copyTextContent(engine = engine, sourceText = sourceText, targetText = targetText)
    }
}

private fun collectChildrenTree(
    engine: Engine,
    parent: DesignBlock,
): List<DesignBlock> = engine.block.getChildren(parent).flatMap { child ->
    listOf(child) + collectChildrenTree(engine = engine, parent = child)
}

private data class UntransformedPagePosition(
    val x: Float,
    val y: Float,
)

private data class PositionedBlock(
    val block: DesignBlock,
    val position: UntransformedPagePosition,
)

private fun visuallySortedBlocks(
    engine: Engine,
    rootPage: DesignBlock,
    blocks: List<DesignBlock>,
): List<DesignBlock> = blocks
    .map { designBlock ->
        PositionedBlock(
            block = designBlock,
            position = untransformedPagePosition(engine = engine, rootPage = rootPage, designBlock = designBlock),
        )
    }
    .sortedWith(
        compareBy<PositionedBlock> { it.position.y.roundToInt() }
            .thenBy { it.position.x.roundToInt() },
    )
    .map { it.block }

private fun untransformedPagePosition(
    engine: Engine,
    rootPage: DesignBlock,
    designBlock: DesignBlock,
): UntransformedPagePosition {
    var x = engine.block.getPositionX(designBlock)
    var y = engine.block.getPositionY(designBlock)
    var parent = engine.block.getParent(designBlock)

    // This local-offset sort is for unrotated and unscaled layout slots.
    while (parent != null && parent != rootPage) {
        x += engine.block.getPositionX(parent)
        y += engine.block.getPositionY(parent)
        parent = engine.block.getParent(parent)
    }

    return UntransformedPagePosition(x = x, y = y)
}

private fun copyImageContent(
    engine: Engine,
    sourceImage: DesignBlock,
    targetImage: DesignBlock,
) {
    val sourceFill = engine.block.getFill(sourceImage)
    val targetFill = engine.block.getFill(targetImage)

    // Image fills use a generic property key, but Android keeps the value typed as Uri.
    engine.block.setUri(
        block = targetFill,
        property = "fill/image/imageFileURI",
        value = engine.block.getUri(sourceFill, property = "fill/image/imageFileURI"),
    )
    engine.block.setSourceSet(
        block = targetFill,
        property = "fill/image/sourceSet",
        sourceSet = engine.block.getSourceSet(sourceFill, property = "fill/image/sourceSet"),
    )
    if (engine.block.supportsPlaceholderBehavior(sourceImage)) {
        engine.block.setPlaceholderBehaviorEnabled(
            block = targetImage,
            enabled = engine.block.isPlaceholderBehaviorEnabled(sourceImage),
        )
    }
    engine.block.resetCrop(targetImage)
}

private fun copyTextContent(
    engine: Engine,
    sourceText: DesignBlock,
    targetText: DesignBlock,
) {
    // Reading plain text still uses property access; replaceText keeps the write type-safe.
    engine.block.replaceText(
        block = targetText,
        text = engine.block.getString(sourceText, property = "text/text"),
    )
    runCatching {
        engine.block.setFont(
            block = targetText,
            fontFileUri = engine.block.getUri(sourceText, property = "text/fontFileUri"),
            typeface = engine.block.getTypeface(sourceText),
        )
    }
    engine.block.getTextColors(sourceText).firstOrNull()?.let { color ->
        engine.block.setTextColor(block = targetText, color = color)
    }
}

private fun isImageBlock(
    engine: Engine,
    designBlock: DesignBlock,
): Boolean = engine.block.supportsFill(designBlock) && engine.block.getType(engine.block.getFill(designBlock)) == FillType.Image.key

private fun createCollagePage(
    engine: Engine,
    width: Float,
    height: Float,
): DesignBlock {
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = width)
    engine.block.setHeight(page, value = height)
    return page
}

private fun addImageSlot(
    engine: Engine,
    page: DesignBlock,
    uri: Uri? = null,
    x: Float,
    y: Float,
    width: Float,
    height: Float,
): DesignBlock {
    val image = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(image, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(image, value = x)
    engine.block.setPositionY(image, value = y)
    engine.block.setWidth(image, value = width)
    engine.block.setHeight(image, value = height)

    val fill = engine.block.createFill(FillType.Image)
    if (uri != null) {
        // Image fills use a generic property key, but Android keeps the value typed as Uri.
        engine.block.setUri(block = fill, property = "fill/image/imageFileURI", value = uri)
    }
    engine.block.setFill(block = image, fill = fill)
    engine.block.appendChild(parent = page, child = image)
    return image
}

private fun addTextBlock(
    engine: Engine,
    page: DesignBlock,
    text: String,
    x: Float,
    y: Float,
): DesignBlock {
    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(block = textBlock, text = text)
    engine.block.setPositionX(textBlock, value = x)
    engine.block.setPositionY(textBlock, value = y)
    engine.block.setWidth(textBlock, value = 640F)
    engine.block.setHeight(textBlock, value = 80F)
    engine.block.setTextColor(
        block = textBlock,
        color = Color.fromRGBA(r = 0.08F, g = 0.08F, b = 0.08F, a = 1F),
    )
    engine.block.appendChild(parent = page, child = textBlock)
    return textBlock
}
```

Create a collage on Android by loading a layout page and transferring existing images and text into the new structure.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260901/engine-guides-collage)

Layouts are predefined page structures that arrange images and text in a composition. Unlike templates, which usually replace the whole scene, this workflow keeps the user's content and maps it into a new layout.

The Android example uses the Engine directly. You can call the same layout application function from your own Compose UI, an asset source callback, or any other Android workflow that lets users choose a layout.

<EngineReferenceNote {...props} />

## What You'll Learn

In this guide, you will learn how to:

- Define a layout page that contains image slots and text placeholders.
- Load the layout from a saved block string.
- Replace the current page structure while preserving existing image and text content.
- Sort blocks visually so content maps top-to-bottom and left-to-right.

## When to Use Layouts

Use layout-based collages when your app needs to keep the current content but change its arrangement. Common examples include:

- Photo collages
- Grid layouts
- Magazine spreads
- Social media posts

## Difference Between Layouts and Templates

Layouts can be represented as [custom assets](../import-media/concepts.md), but the apply behavior is different from a full template load:

- **Templates** load a complete design and replace the current scene.
- **Layouts** provide a new page structure while your code transfers the current content into matching slots.

Preserving assets while changing the layout is app logic. CE.SDK provides the block, fill, text, and scene APIs you need to implement that logic.

## How Collages Work

When a user chooses a collage layout, your app performs this sequence:

1. Load a layout page from a saved block string.
2. Duplicate the current page as a temporary content source.
3. Replace the current page's children with the layout's children.
4. Copy images and text from the old page into the new layout in visual order.
5. Clean up temporary blocks and add an undo step.

Visual order is important. The sample sorts simple, untransformed layout slots by their accumulated page coordinates so content maps predictably between the old page and the new layout.

## Create Page Helpers

The sample uses small helpers to create pages, image slots, and text blocks. The page helper only sets page dimensions.

```kotlin highlight-android-create-page-helper
private fun createCollagePage(
    engine: Engine,
    width: Float,
    height: Float,
): DesignBlock {
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = width)
    engine.block.setHeight(page, value = height)
    return page
}
```

Image slots use graphic blocks with rectangular shapes and image fills. In your app, the `Uri` values can come from local resources, remote media, or user-selected files.

```kotlin highlight-android-image-slot-helper
private fun addImageSlot(
    engine: Engine,
    page: DesignBlock,
    uri: Uri? = null,
    x: Float,
    y: Float,
    width: Float,
    height: Float,
): DesignBlock {
    val image = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(image, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(image, value = x)
    engine.block.setPositionY(image, value = y)
    engine.block.setWidth(image, value = width)
    engine.block.setHeight(image, value = height)

    val fill = engine.block.createFill(FillType.Image)
    if (uri != null) {
        // Image fills use a generic property key, but Android keeps the value typed as Uri.
        engine.block.setUri(block = fill, property = "fill/image/imageFileURI", value = uri)
    }
    engine.block.setFill(block = image, fill = fill)
    engine.block.appendChild(parent = page, child = image)
    return image
}
```

Text blocks keep the layout example readable by isolating the text creation and initial color setup.

```kotlin highlight-android-text-block-helper
private fun addTextBlock(
    engine: Engine,
    page: DesignBlock,
    text: String,
    x: Float,
    y: Float,
): DesignBlock {
    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(block = textBlock, text = text)
    engine.block.setPositionX(textBlock, value = x)
    engine.block.setPositionY(textBlock, value = y)
    engine.block.setWidth(textBlock, value = 640F)
    engine.block.setHeight(textBlock, value = 80F)
    engine.block.setTextColor(
        block = textBlock,
        color = Color.fromRGBA(r = 0.08F, g = 0.08F, b = 0.08F, a = 1F),
    )
    engine.block.appendChild(parent = page, child = textBlock)
    return textBlock
}
```

## Define a Layout

A layout is a page with positioned image slots and optional text blocks. In production, save these pages as scene or block files and load them from your app bundle, backend, or asset source.

```kotlin highlight-android-define-layout
val layoutBlocksString = createCollagePage(engine = engine, width = 1080F, height = 1080F).let { layoutPage ->
    try {
        addImageSlot(engine = engine, page = layoutPage, x = 32F, y = 32F, width = 1016F, height = 496F)
        addImageSlot(engine = engine, page = layoutPage, x = 32F, y = 560F, width = 492F, height = 360F)
        addImageSlot(engine = engine, page = layoutPage, x = 556F, y = 560F, width = 492F, height = 360F)
        addTextBlock(engine = engine, page = layoutPage, text = "Title", x = 64F, y = 952F)
        engine.block.saveToString(blocks = listOf(layoutPage))
    } finally {
        engine.block.destroy(layoutPage)
    }
}
```

The example saves the layout page with `block.saveToString()` and later restores it with `block.loadFromString()`. The same pattern works when the string comes from a remote layout file.

## Apply the Collage

Call the app-owned layout helper with the current page, the Engine instance, and the saved layout data. Pass `addUndoStep = true` when the action should become a single undoable editor operation.

```kotlin highlight-android-apply-layout
val collagePage = applyCollageLayout(
    engine = engine,
    currentPage = page,
    layoutBlocksString = layoutBlocksString,
    addUndoStep = true,
)
```

The function returns the page that now contains the collage structure and transferred content.

## Replace the Page Structure

Applying a layout temporarily allows block deletion, clears the current selection, duplicates the old page, loads the layout page, and moves the layout children into the current page.

```kotlin highlight-android-layout-workflow
suspend fun applyCollageLayout(
    engine: Engine,
    currentPage: DesignBlock,
    layoutBlocksString: String,
    addUndoStep: Boolean = true,
): DesignBlock = withContext(engine.dispatcher) {
    val previousDestroyScope = engine.editor.getGlobalScope("lifecycle/destroy")
    engine.editor.setGlobalScope(key = "lifecycle/destroy", globalScope = GlobalScope.ALLOW)

    try {
        engine.block.findAllSelected().forEach { selectedBlock ->
            engine.block.setSelected(block = selectedBlock, selected = false)
        }

        var oldPage: DesignBlock? = null
        var loadedLayoutPage: DesignBlock? = null

        try {
            oldPage = engine.block.duplicate(block = currentPage, attachToParent = false)
            loadedLayoutPage = engine.block.loadFromString(layoutBlocksString).first()

            engine.block.getChildren(currentPage).forEach(engine.block::destroy)
            engine.block.getChildren(loadedLayoutPage).forEach { child ->
                engine.block.insertChild(parent = currentPage, child = child, index = engine.block.getChildren(currentPage).size)
            }

            transferCollageContent(engine = engine, fromPage = oldPage, toPage = currentPage)
        } finally {
            loadedLayoutPage?.let { engine.block.destroy(it) }
            oldPage?.let { engine.block.destroy(it) }
        }

        if (addUndoStep) {
            engine.editor.addUndoStep()
        }
        currentPage
    } finally {
        engine.editor.setGlobalScope(key = "lifecycle/destroy", globalScope = previousDestroyScope)
    }
}
```

Key details:

- Store and restore the previous `lifecycle/destroy` scope so the surrounding editor state remains unchanged.
- Keep the duplicate backup unattached so it cannot leak into the scene if transfer fails.
- Destroy the temporary old and layout pages in cleanup after transfer.

## Transfer Content

Collect all descendants from the old page and the new page, sort both lists by visual position, then pair source and target blocks by type.

```kotlin highlight-android-transfer-content
private fun transferCollageContent(
    engine: Engine,
    fromPage: DesignBlock,
    toPage: DesignBlock,
) {
    val sourceBlocks = visuallySortedBlocks(
        engine = engine,
        rootPage = fromPage,
        blocks = collectChildrenTree(engine = engine, parent = fromPage),
    )
    val targetBlocks = visuallySortedBlocks(
        engine = engine,
        rootPage = toPage,
        blocks = collectChildrenTree(engine = engine, parent = toPage),
    )

    val sourceImages = sourceBlocks.filter { isImageBlock(engine = engine, designBlock = it) }
    val targetImages = targetBlocks.filter { isImageBlock(engine = engine, designBlock = it) }
    sourceImages.zip(targetImages).forEach { (sourceImage, targetImage) ->
        copyImageContent(engine = engine, sourceImage = sourceImage, targetImage = targetImage)
    }

    val sourceTexts = sourceBlocks.filter { engine.block.getType(it) == DesignBlockType.Text.key }
    val targetTexts = targetBlocks.filter { engine.block.getType(it) == DesignBlockType.Text.key }
    sourceTexts.zip(targetTexts).forEach { (sourceText, targetText) ->
        copyTextContent(engine = engine, sourceText = sourceText, targetText = targetText)
    }
}
```

If the source has more images than the layout has slots, extra images are ignored. If the layout has more slots, the remaining slots keep their placeholder content.

## Sort Blocks Visually

Block positions are local to their parent. For unrotated and unscaled layout slots, the example accumulates each block's ancestor offsets, rounds those coordinates, then sorts by Y before X. If your layout slots live under rotated or scaled parents, use the Engine's global bounding-box APIs for the sort instead of this local-offset helper.

```kotlin highlight-android-visual-sort
private fun collectChildrenTree(
    engine: Engine,
    parent: DesignBlock,
): List<DesignBlock> = engine.block.getChildren(parent).flatMap { child ->
    listOf(child) + collectChildrenTree(engine = engine, parent = child)
}

private data class UntransformedPagePosition(
    val x: Float,
    val y: Float,
)

private data class PositionedBlock(
    val block: DesignBlock,
    val position: UntransformedPagePosition,
)

private fun visuallySortedBlocks(
    engine: Engine,
    rootPage: DesignBlock,
    blocks: List<DesignBlock>,
): List<DesignBlock> = blocks
    .map { designBlock ->
        PositionedBlock(
            block = designBlock,
            position = untransformedPagePosition(engine = engine, rootPage = rootPage, designBlock = designBlock),
        )
    }
    .sortedWith(
        compareBy<PositionedBlock> { it.position.y.roundToInt() }
            .thenBy { it.position.x.roundToInt() },
    )
    .map { it.block }

private fun untransformedPagePosition(
    engine: Engine,
    rootPage: DesignBlock,
    designBlock: DesignBlock,
): UntransformedPagePosition {
    var x = engine.block.getPositionX(designBlock)
    var y = engine.block.getPositionY(designBlock)
    var parent = engine.block.getParent(designBlock)

    // This local-offset sort is for unrotated and unscaled layout slots.
    while (parent != null && parent != rootPage) {
        x += engine.block.getPositionX(parent)
        y += engine.block.getPositionY(parent)
        parent = engine.block.getParent(parent)
    }

    return UntransformedPagePosition(x = x, y = y)
}
```

Keep layout slots in distinct positions when possible. Blocks with the same accumulated Y position map left-to-right.

## Copy Images

Copy the image URI with Android's `Uri` property APIs and copy the source set from the old image fill to the new image fill. Resetting the crop lets the image fit the new slot dimensions.

```kotlin highlight-android-copy-images
private fun copyImageContent(
    engine: Engine,
    sourceImage: DesignBlock,
    targetImage: DesignBlock,
) {
    val sourceFill = engine.block.getFill(sourceImage)
    val targetFill = engine.block.getFill(targetImage)

    // Image fills use a generic property key, but Android keeps the value typed as Uri.
    engine.block.setUri(
        block = targetFill,
        property = "fill/image/imageFileURI",
        value = engine.block.getUri(sourceFill, property = "fill/image/imageFileURI"),
    )
    engine.block.setSourceSet(
        block = targetFill,
        property = "fill/image/sourceSet",
        sourceSet = engine.block.getSourceSet(sourceFill, property = "fill/image/sourceSet"),
    )
    if (engine.block.supportsPlaceholderBehavior(sourceImage)) {
        engine.block.setPlaceholderBehaviorEnabled(
            block = targetImage,
            enabled = engine.block.isPlaceholderBehaviorEnabled(sourceImage),
        )
    }
    engine.block.resetCrop(targetImage)
}
```

The placeholder behavior calls preserve placeholder state when the source block supports it.

## Identify Image Slots

The transfer code treats a graphic block with an image fill as an image slot. This keeps the mapping independent from custom metadata or asset-source IDs.

```kotlin highlight-android-image-slot-check
private fun isImageBlock(
    engine: Engine,
    designBlock: DesignBlock,
): Boolean = engine.block.supportsFill(designBlock) && engine.block.getType(engine.block.getFill(designBlock)) == FillType.Image.key
```

## Copy Text

Text transfer reads the source string, writes it with `replaceText()`, and copies the first text color with the typed text color APIs. Reading plain text still uses property access because Android does not expose a dedicated text getter. Typeface and font file URI preservation is best-effort so unresolved fonts do not block the text content transfer.

```kotlin highlight-android-copy-text
private fun copyTextContent(
    engine: Engine,
    sourceText: DesignBlock,
    targetText: DesignBlock,
) {
    // Reading plain text still uses property access; replaceText keeps the write type-safe.
    engine.block.replaceText(
        block = targetText,
        text = engine.block.getString(sourceText, property = "text/text"),
    )
    runCatching {
        engine.block.setFont(
            block = targetText,
            fontFileUri = engine.block.getUri(sourceText, property = "text/fontFileUri"),
            typeface = engine.block.getTypeface(sourceText),
        )
    }
    engine.block.getTextColors(sourceText).firstOrNull()?.let { color ->
        engine.block.setTextColor(block = targetText, color = color)
    }
}
```

Use the same visual pairing rule for text as for images so captions and titles stay in their expected order.

## Connect It to Your UI

The Engine workflow is UI-agnostic. A typical Android integration stores each layout with:

| Field | Purpose |
| --- | --- |
| `id` | Stable layout identifier for your app |
| `label` | Display name in your own layout picker |
| `uri` | Scene or block file containing the layout page |
| `thumbnailUri` | Preview image shown in your UI |

When a user selects a layout, load its file, pass the saved block string into your app's `applyCollageLayout(engine = ...)` helper, and keep the UI code separate from the content transfer logic.

## Troubleshooting

| Issue | What to Check |
| --- | --- |
| Layout does not apply | Verify the saved layout string loads with `engine.block.loadFromString(block=_)` and returns a page block before moving children into the current page. |
| Content maps to the wrong slots | Keep the sortable image and text slots unrotated and unscaled, and check the accumulated coordinates used by visual sorting. Blocks with the same accumulated Y coordinate map left-to-right, so keep slots distinct enough for predictable ordering. |
| Images stay empty or lose variants | Ensure both source and target blocks use image fills, then copy the image URI with `getUri()` / `setUri()` and copy `fill/image/sourceSet` before calling `engine.block.resetCrop(block=_)`. |
| Text copies without its expected font | Treat font transfer as best-effort. Copy the text string first, then wrap `engine.block.setFont(block=_, fontFileUri=_, typeface=_)` so unresolved font URIs do not block the collage update. |
| Undo or cleanup behaves unexpectedly | Restore the previous `lifecycle/destroy` scope in a `finally` block, destroy temporary duplicate/layout pages, and add the undo step only after transfer completes. |
| Slot counts do not match | Pair source and target blocks with `zip`. Extra source content is ignored, and extra layout slots keep their placeholder content. |

## API Reference

| API | Category | Purpose |
| --- | --- | --- |
| `engine.block.saveToString(blocks=_)` | Layout data | Serialize a layout page so it can be stored as a layout asset or file. |
| `engine.block.loadFromString(block=_)` | Layout data | Load a saved layout page before moving its children into the current page. |
| `engine.block.duplicate(block=_, attachToParent=_)` | Backup | Copy the current page without attaching the duplicate to the scene. |
| `engine.block.getChildren(block=_)` | Hierarchy | Read child blocks before clearing or moving a page structure. |
| `engine.block.insertChild(parent=_, child=_, index=_)` | Hierarchy | Move layout children into the current page in order. |
| `engine.block.destroy(block=_)` | Lifecycle | Remove old children and temporary pages during cleanup. |
| `engine.editor.getGlobalScope(key="lifecycle/destroy")` | Lifecycle | Store the current deletion scope before the layout swap. |
| `engine.editor.setGlobalScope(key="lifecycle/destroy", globalScope=_)` | Lifecycle | Temporarily allow block deletion, then restore the previous scope. |
| `engine.block.findAllSelected()` | Selection | Find selected blocks so the layout change can clear selection first. |
| `engine.block.setSelected(block=_, selected=_)` | Selection | Deselect blocks before replacing the page structure. |
| `engine.block.getFill(block=_)` | Images | Access the image fill that stores URI and source-set properties. |
| `engine.block.getUri(block=_, property="fill/image/imageFileURI")` | Images | Read the source image URI from an image fill. |
| `engine.block.setUri(block=_, property="fill/image/imageFileURI", value=_)` | Images | Copy the image URI to the target fill. |
| `engine.block.getSourceSet(block=_, property="fill/image/sourceSet")` | Images | Read responsive image variants from the source fill. |
| `engine.block.setSourceSet(block=_, property="fill/image/sourceSet", sourceSet=_)` | Images | Preserve responsive image variants on the target fill. |
| `engine.block.resetCrop(block=_)` | Images | Refit the transferred image inside the new slot. |
| `engine.block.supportsPlaceholderBehavior(block=_)` | Placeholders | Check whether placeholder state can be copied. |
| `engine.block.setPlaceholderBehaviorEnabled(block=_, enabled=_)` | Placeholders | Apply the source placeholder behavior to the target image block. |
| `engine.block.getString(block=_, property="text/text")` | Text | Read text content from the source block. Android exposes typed text write and style APIs, but not a dedicated plain-text getter. |
| `engine.block.replaceText(block=_, text=_)` | Text | Copy text content into the target block. |
| `engine.block.setFont(block=_, fontFileUri=_, typeface=_)` | Text | Preserve the source font when the URI and typeface resolve. |
| `engine.block.getTextColors(block=_)` | Text | Read the source text colors. |
| `engine.block.setTextColor(block=_, color=_)` | Text | Apply the source text color to the target block. |
| `engine.block.getParent(block=_)` | Sorting | Walk ancestors while accumulating untransformed page coordinates. |
| `engine.block.getPositionX(block=_)` | Sorting | Read local X positions while calculating left-to-right ordering. |
| `engine.block.getPositionY(block=_)` | Sorting | Read local Y positions while calculating top-to-bottom ordering. |
| `engine.editor.addUndoStep()` | Undo | Commit the completed layout swap as one undoable operation. |

## Next Steps

Now that you can create collages with layouts, explore these related guides:

- [Templates Overview](../create-templates/overview.md) - Work with templates instead of layouts
- [Basics](../import-media/asset-library/basics.md) - Explore how the asset library connects sources, categories, and dock buttons
- [Insert Images](../insert-media/images.md) - Manage image blocks and fills
- [Load a Scene](../open-the-editor/load-scene.md) - Load and save scenes



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support