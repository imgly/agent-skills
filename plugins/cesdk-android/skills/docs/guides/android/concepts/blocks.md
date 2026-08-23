> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Blocks](./blocks.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-concepts-blocks/ConceptsBlocks.kt reference-only
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.HorizontalAlignment
import ly.img.engine.ShapeType

suspend fun conceptsBlocks(engine: Engine) = withContext(engine.dispatcher) {
    var selectionObserver: Job? = null
    var stateObserver: Job? = null

    try {
        val scene = engine.scene.create()

        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(page, value = 800F)
        engine.block.setHeight(page, value = 600F)
        engine.block.appendChild(parent = scene, child = page)

        engine.scene.zoomToBlock(
            page,
            paddingLeft = 40F,
            paddingTop = 40F,
            paddingRight = 40F,
            paddingBottom = 40F,
        )
        val pages = engine.block.findByType(DesignBlockType.Page)
        val firstPage = pages.first()

        val pageType = engine.block.getType(firstPage)
        println("Page block type: $pageType")

        engine.block.setKind(firstPage, kind = "main-canvas")
        val pageKind = engine.block.getKind(firstPage)
        println("Page kind: $pageKind")

        val mainCanvasBlocks = engine.block.findByKind("main-canvas")
        println("Blocks with kind 'main-canvas': ${mainCanvasBlocks.size}")

        val graphic = engine.block.create(DesignBlockType.Graphic)

        val graphicCopy = engine.block.duplicate(graphic)
        engine.block.destroy(graphicCopy)

        val isOriginalValid = engine.block.isValid(graphic)
        val isCopyValid = engine.block.isValid(graphicCopy)
        println("Original valid: $isOriginalValid")
        println("Copy valid after destroy: $isCopyValid")

        val rectShape = engine.block.createShape(ShapeType.Rect)
        engine.block.setShape(graphic, shape = rectShape)

        engine.block.setPositionX(graphic, value = 200F)
        engine.block.setPositionY(graphic, value = 100F)
        engine.block.setWidth(graphic, value = 400F)
        engine.block.setHeight(graphic, value = 300F)

        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setString(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = "https://img.ly/static/ubq_samples/sample_1.jpg",
        )
        engine.block.setFill(graphic, fill = imageFill)

        engine.block.setContentFillMode(graphic, ContentFillMode.COVER)

        engine.block.appendChild(parent = page, child = graphic)

        val graphicParent = engine.block.getParent(graphic)
        println("Graphic parent is page: ${graphicParent == page}")

        val pageChildren = engine.block.getChildren(page)
        println("Page has children: ${pageChildren.size}")

        val textBlock = engine.block.create(DesignBlockType.Text)
        engine.block.appendChild(parent = page, child = textBlock)

        engine.block.setPositionX(textBlock, value = 200F)
        engine.block.setPositionY(textBlock, value = 450F)
        engine.block.setWidth(textBlock, value = 400F)
        engine.block.setHeight(textBlock, value = 80F)

        engine.block.setString(
            block = textBlock,
            property = "text/text",
            value = "Blocks are the building units of CE.SDK designs",
        )
        engine.block.setTextFontSize(textBlock, fontSize = 24F)
        engine.block.setTextHorizontalAlignment(textBlock, alignment = HorizontalAlignment.Center)

        val textType = engine.block.getType(textBlock)
        println("Text block type: $textType")

        val graphicProperties = engine.block.findAllProperties(graphic)
        println("Graphic block has ${graphicProperties.size} properties")

        val opacityType = engine.block.getPropertyType("opacity")
        println("Opacity property type: $opacityType")

        val isOpacityReadable = engine.block.isPropertyReadable("opacity")
        val isOpacityWritable = engine.block.isPropertyWritable("opacity")
        println("Opacity readable: $isOpacityReadable writable: $isOpacityWritable")

        engine.block.setFloat(block = graphic, property = "opacity", value = 0.9F)
        val opacity = engine.block.getFloat(block = graphic, property = "opacity")
        println("Graphic opacity: $opacity")

        engine.block.setBoolean(block = page, property = "page/marginEnabled", value = false)
        val marginEnabled = engine.block.getBoolean(block = page, property = "page/marginEnabled")
        println("Page margin enabled: $marginEnabled")

        val blendModes = engine.block.getEnumValues("blend/mode")
        println("Available blend modes: ${blendModes.take(3).joinToString()} ...")

        engine.block.setEnum(block = graphic, property = "blend/mode", value = "Multiply")
        val blendMode = engine.block.getEnum(block = graphic, property = "blend/mode")
        println("Graphic blend mode: $blendMode")

        val graphicUUID = engine.block.getUUID(graphic)
        println("Graphic UUID: $graphicUUID")

        engine.block.setName(graphic, name = "Hero Image")
        engine.block.setName(textBlock, name = "Caption")

        val graphicName = engine.block.getName(graphic)
        println("Graphic name: $graphicName")

        val namedBlocks = engine.block.findByName("Hero Image")
        println("Blocks named Hero Image: ${namedBlocks.size}")

        selectionObserver = launch {
            engine.block.onSelectionChanged().collect {
                val selected = engine.block.findAllSelected()
                println("Selection changed, now selected: ${selected.size} blocks")
            }
        }

        engine.block.select(graphic)
        val isGraphicSelected = engine.block.isSelected(graphic)
        println("Graphic is selected: $isGraphicSelected")

        engine.block.setSelected(textBlock, selected = true)
        val selectedBlocks = engine.block.findAllSelected()
        println("Selected blocks count: ${selectedBlocks.size}")

        engine.block.setVisible(graphic, visible = true)
        val isVisible = engine.block.isVisible(graphic)
        println("Graphic is visible: $isVisible")

        engine.block.setIncludedInExport(graphic, enabled = true)
        val inExport = engine.block.isIncludedInExport(graphic)
        println("Graphic included in export: $inExport")

        engine.block.setClipped(graphic, clipped = false)
        val isClipped = engine.block.isClipped(graphic)
        println("Graphic is clipped: $isClipped")

        val graphicState = engine.block.getState(graphic)
        println("Graphic state: $graphicState")

        stateObserver = launch {
            engine.block.onStateChanged(listOf(graphic)).collect { changedBlocks ->
                changedBlocks.forEach { changedBlock ->
                    val state = engine.block.getState(changedBlock)
                    println("Block $changedBlock state changed to: $state")
                }
            }
        }

        val savedString = engine.block.saveToString(blocks = listOf(graphic, textBlock))
        println("Blocks saved to string, length: ${savedString.length}")

        // Alternatively, blocks can be saved with their assets in an archive:
        // val savedArchive = engine.block.saveToArchive(blocks = listOf(graphic, textBlock))

        val loadedBlocks = engine.block.loadFromString(savedString)
        println("Loaded blocks from string: ${loadedBlocks.size}")

        // Alternatively, blocks can be loaded from an archive or an extracted archive directory:
        // val loadedArchiveBlocks = engine.block.loadFromArchive(Uri.parse("file:///path/to/blocks.zip"))
        // val loadedUrlBlocks = engine.block.loadFromURL(Uri.parse("file:///path/to/blocks.blocks"))

        loadedBlocks.forEach { loadedBlock ->
            engine.block.destroy(loadedBlock)
        }

        engine.block.forceLoadResources(listOf(graphic, textBlock))

        println("Blocks guide initialized successfully.")
        println("Created graphic and text blocks, then exercised hierarchy and state APIs.")
    } finally {
        selectionObserver?.cancel()
        stateObserver?.cancel()
    }
}
```

Work with blocks, the fundamental building units for all visual elements in
CE.SDK designs.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/engine-guides-concepts-blocks)

<EngineReferenceNote {...props} />

Every visual element in CE.SDK, including images, text, shapes, and audio, is represented as a block. Blocks are organized in a tree structure within scenes and pages, where parent-child relationships determine rendering order and visibility. Each block has properties you can read and modify, a `Type` that defines its core behavior, and an optional `Kind` for custom categorization.

This guide focuses on engine APIs. The standalone sample creates a small offscreen scene so the snippets can run in isolation; the highlighted code is the block logic you would apply to your own scene or editor workflow.

## Block Types

CE.SDK provides several block types, each designed for specific content:

- **`DesignBlockType.Graphic`** (`//ly.img.ubq/graphic`): Visual blocks for images, shapes, and graphics
- **`DesignBlockType.Text`** (`//ly.img.ubq/text`): Text content with typography controls
- **`DesignBlockType.Audio`** (`//ly.img.ubq/audio`): Audio content for video scenes
- **`DesignBlockType.Page`** (`//ly.img.ubq/page`): Container blocks representing canvases or artboards
- **`DesignBlockType.Cutout`** (`//ly.img.ubq/cutout`): Blocks for masking operations

Query a block's type using `getType()` and find blocks of a specific type with `findByType()`:

```kotlin highlight-android-block-types
        val pages = engine.block.findByType(DesignBlockType.Page)
        val firstPage = pages.first()

        val pageType = engine.block.getType(firstPage)
        println("Page block type: $pageType")
```

Block types are immutable. Once created, a block's type cannot change. This is what distinguishes `Type` from `Kind`.

## Type vs Kind

Type and kind serve different purposes. The **type** is determined at creation and defines core behavior. The **kind** is a custom string label you assign for application-specific categorization.

```kotlin highlight-android-type-vs-kind
        engine.block.setKind(firstPage, kind = "main-canvas")
        val pageKind = engine.block.getKind(firstPage)
        println("Page kind: $pageKind")

        val mainCanvasBlocks = engine.block.findByKind("main-canvas")
        println("Blocks with kind 'main-canvas': ${mainCanvasBlocks.size}")
```

Use kind to tag blocks for your application's logic. Set it with `setKind()`, query it with `getKind()`, and find blocks by kind with `findByKind()`.

## Block Hierarchy

Blocks form a tree structure where scenes contain pages, and pages contain design elements.

```kotlin highlight-android-block-hierarchy
        engine.block.appendChild(parent = page, child = graphic)

        val graphicParent = engine.block.getParent(graphic)
        println("Graphic parent is page: ${graphicParent == page}")

        val pageChildren = engine.block.getChildren(page)
        println("Page has children: ${pageChildren.size}")
```

Only blocks that are direct or indirect children of a page block are rendered. A scene without any page children will not show content in the editor or in offscreen exports. Use `appendChild()` to attach blocks, `getParent()` to inspect the hierarchy, and `getChildren()` to read a block's render-order children.

## Block Lifecycle

Create new blocks with `create()`, duplicate existing blocks with `duplicate()`, and remove blocks with `destroy()`. After destroying a block, `isValid()` returns `false` for that block handle.

```kotlin highlight-android-block-lifecycle
        val graphic = engine.block.create(DesignBlockType.Graphic)

        val graphicCopy = engine.block.duplicate(graphic)
        engine.block.destroy(graphicCopy)

        val isOriginalValid = engine.block.isValid(graphic)
        val isCopyValid = engine.block.isValid(graphicCopy)
        println("Original valid: $isOriginalValid")
        println("Copy valid after destroy: $isCopyValid")
```

When duplicating a block, all children are included, and the duplicate receives a new UUID.

## Working with Shapes

Graphic blocks need a shape before they can render. Create a shape, attach it to the graphic block, and then size or position the graphic block in the scene.

```kotlin highlight-android-shape
        val rectShape = engine.block.createShape(ShapeType.Rect)
        engine.block.setShape(graphic, shape = rectShape)

        engine.block.setPositionX(graphic, value = 200F)
        engine.block.setPositionY(graphic, value = 100F)
        engine.block.setWidth(graphic, value = 400F)
        engine.block.setHeight(graphic, value = 300F)
```

## Working with Fills

Graphic blocks display content through fills. After a graphic block has a shape, create a fill, attach it to the block, and configure its source.

```kotlin highlight-android-fill
        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setString(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = "https://img.ly/static/ubq_samples/sample_1.jpg",
        )
        engine.block.setFill(graphic, fill = imageFill)

        engine.block.setContentFillMode(graphic, ContentFillMode.COVER)
```

CE.SDK supports several fill types including image, video, color, and gradient fills. See the [Fills guide](../fills/overview.md) for details on available fill types.

## Creating Text Blocks

Text blocks display formatted text content. Create a text block, position it, and set its content and styling.

```kotlin highlight-android-text-block
        val textBlock = engine.block.create(DesignBlockType.Text)
        engine.block.appendChild(parent = page, child = textBlock)

        engine.block.setPositionX(textBlock, value = 200F)
        engine.block.setPositionY(textBlock, value = 450F)
        engine.block.setWidth(textBlock, value = 400F)
        engine.block.setHeight(textBlock, value = 80F)

        engine.block.setString(
            block = textBlock,
            property = "text/text",
            value = "Blocks are the building units of CE.SDK designs",
        )
        engine.block.setTextFontSize(textBlock, fontSize = 24F)
        engine.block.setTextHorizontalAlignment(textBlock, alignment = HorizontalAlignment.Center)

        val textType = engine.block.getType(textBlock)
        println("Text block type: $textType")
```

Text blocks support extensive typography controls covered in the [Text guides](../text.md).

## Block Properties

The reflection system lets you discover and manipulate any block property dynamically. Use `findAllProperties()` to get all available properties for a block. Property names are prefixed by category, for example `shape/star/points` or `text/fontSize`.

```kotlin highlight-android-block-properties
        val graphicProperties = engine.block.findAllProperties(graphic)
        println("Graphic block has ${graphicProperties.size} properties")

        val opacityType = engine.block.getPropertyType("opacity")
        println("Opacity property type: $opacityType")

        val isOpacityReadable = engine.block.isPropertyReadable("opacity")
        val isOpacityWritable = engine.block.isPropertyWritable("opacity")
        println("Opacity readable: $isOpacityReadable writable: $isOpacityWritable")
```

Query property types with `getPropertyType()`. Android returns `PropertyType` enum values such as `BOOL`, `INT`, `FLOAT`, `DOUBLE`, `STRING`, `COLOR`, `ENUM`, `STRUCT`, and `SOURCESET`. For enum properties, use `getEnumValues()` to get the allowed string values.

### Property Accessors

Use type-specific getters and setters that match the property's `PropertyType`:

```kotlin highlight-android-property-accessors
        engine.block.setFloat(block = graphic, property = "opacity", value = 0.9F)
        val opacity = engine.block.getFloat(block = graphic, property = "opacity")
        println("Graphic opacity: $opacity")

        engine.block.setBoolean(block = page, property = "page/marginEnabled", value = false)
        val marginEnabled = engine.block.getBoolean(block = page, property = "page/marginEnabled")
        println("Page margin enabled: $marginEnabled")

        val blendModes = engine.block.getEnumValues("blend/mode")
        println("Available blend modes: ${blendModes.take(3).joinToString()} ...")

        engine.block.setEnum(block = graphic, property = "blend/mode", value = "Multiply")
        val blendMode = engine.block.getEnum(block = graphic, property = "blend/mode")
        println("Graphic blend mode: $blendMode")
```

Using the wrong accessor type causes an error. Check `getPropertyType()` first if you are not sure which accessor to use, and use `isPropertyReadable()` or `isPropertyWritable()` before building generic editors.

## UUID, Names, and Identity

Each block has a UUID and an optional mutable name for organization.

```kotlin highlight-android-uuid-identity
        val graphicUUID = engine.block.getUUID(graphic)
        println("Graphic UUID: $graphicUUID")

        engine.block.setName(graphic, name = "Hero Image")
        engine.block.setName(textBlock, name = "Caption")

        val graphicName = engine.block.getName(graphic)
        println("Graphic name: $graphicName")

        val namedBlocks = engine.block.findByName("Hero Image")
        println("Blocks named Hero Image: ${namedBlocks.size}")
```

Use `getUUID()` when you need a stable identifier for a block while it exists in the current scene. Android's `loadFromString()`, `loadFromArchive()`, and `loadFromURL()` APIs create new block instances with new UUIDs, so keep your own mapping if you need to reconcile originals with loaded copies.

Use `findByName()` when you need to look up blocks by an application-assigned name, for example after naming imported template elements.

## Selection

Control which blocks are selected programmatically. Use `select()` to select a single block and deselect others, or `setSelected()` to change one block's selection state without clearing the rest.

```kotlin highlight-android-selection
        selectionObserver = launch {
            engine.block.onSelectionChanged().collect {
                val selected = engine.block.findAllSelected()
                println("Selection changed, now selected: ${selected.size} blocks")
            }
        }

        engine.block.select(graphic)
        val isGraphicSelected = engine.block.isSelected(graphic)
        println("Graphic is selected: $isGraphicSelected")

        engine.block.setSelected(textBlock, selected = true)
        val selectedBlocks = engine.block.findAllSelected()
        println("Selected blocks count: ${selectedBlocks.size}")
```

Subscribe to selection changes with `onSelectionChanged()`, which returns a `Flow<Unit>` you collect from a coroutine that stays alive while you need selection updates.

## Visibility

Control whether blocks appear on the canvas and whether they are included in exports.

```kotlin highlight-android-visibility
        engine.block.setVisible(graphic, visible = true)
        val isVisible = engine.block.isVisible(graphic)
        println("Graphic is visible: $isVisible")

        engine.block.setIncludedInExport(graphic, enabled = true)
        val inExport = engine.block.isIncludedInExport(graphic)
        println("Graphic included in export: $inExport")
```

A block with `isVisible()` returning `true` may still not appear if it has not been attached to a parent, its parent is hidden, or another block obscures it.

### Clipping

Clipping determines whether a block's content is constrained to its own bounds.

```kotlin highlight-android-clipping
engine.block.setClipped(graphic, clipped = false)
val isClipped = engine.block.isClipped(graphic)
println("Graphic is clipped: $isClipped")
```

When clipping is enabled, content outside the block's frame is hidden. When clipping is disabled, the content can render beyond the block's bounds.

## Block State

Blocks track loading progress and error conditions through a state system with three possible states:

- `BlockState.Ready`: Normal state, no pending operations
- `BlockState.Pending(progress)`: Operation in progress with a progress value in the range `0..1`
- `BlockState.Error(type)`: Operation failed with `AUDIO_DECODING`, `IMAGE_DECODING`, `FILE_FETCH`, `VIDEO_DECODING`, or `UNKNOWN`

```kotlin highlight-android-block-state
        val graphicState = engine.block.getState(graphic)
        println("Graphic state: $graphicState")

        stateObserver = launch {
            engine.block.onStateChanged(listOf(graphic)).collect { changedBlocks ->
                changedBlocks.forEach { changedBlock ->
                    val state = engine.block.getState(changedBlock)
                    println("Block $changedBlock state changed to: $state")
                }
            }
        }
```

Subscribe to state changes with `onStateChanged(listOf(block))` when you want to drive loading indicators or error UI from asynchronous resource loading.

## Serialization

Save blocks to strings for persistence and restore them later.

```kotlin highlight-android-serialization
        val savedString = engine.block.saveToString(blocks = listOf(graphic, textBlock))
        println("Blocks saved to string, length: ${savedString.length}")

        // Alternatively, blocks can be saved with their assets in an archive:
        // val savedArchive = engine.block.saveToArchive(blocks = listOf(graphic, textBlock))

        val loadedBlocks = engine.block.loadFromString(savedString)
        println("Loaded blocks from string: ${loadedBlocks.size}")

        // Alternatively, blocks can be loaded from an archive or an extracted archive directory:
        // val loadedArchiveBlocks = engine.block.loadFromArchive(Uri.parse("file:///path/to/blocks.zip"))
        // val loadedUrlBlocks = engine.block.loadFromURL(Uri.parse("file:///path/to/blocks.blocks"))

        loadedBlocks.forEach { loadedBlock ->
            engine.block.destroy(loadedBlock)
        }
```

Use `saveToString()` for lightweight serialization or `saveToArchive()` to include referenced assets. Load archived data back with `loadFromArchive()` or point `loadFromURL()` at a `blocks.blocks` file inside an extracted archive directory.

Loaded blocks are not attached to the scene automatically. Parent them with `appendChild()` if you want them to render.

## Troubleshooting

- Block is not visible: ensure it is appended to a page, and that the page is appended to the scene.
- Property writes fail: verify the property name with `findAllProperties()` and the accessor with `getPropertyType()`.
- Selection or state callbacks never fire: collect the returned `Flow` from a coroutine that stays active while the observer is needed.
- Loaded blocks do not appear after deserialization: append them back into the scene hierarchy after `loadFromString()`, `loadFromArchive()`, or `loadFromURL()`.

## Next Steps

- [Scenes](./scenes.md) — Understand the root container that holds every block.
- [Pages](./pages.md) — Learn how pages group blocks into discrete canvases.
- [Events](./events.md) — Subscribe to block creation, update, and deletion.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support