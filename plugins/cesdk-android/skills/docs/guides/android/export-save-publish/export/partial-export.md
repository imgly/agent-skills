> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [Partial Export](./partial-export.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-partial-export/PartialExport.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.nio.ByteBuffer

data class PartialExport(
    val individualGraphic: ByteBuffer,
    val groupedElements: ByteBuffer,
    val selection: ByteBuffer,
    val currentPage: ByteBuffer,
    val allPages: List<ByteBuffer>,
    val resizedPage: ByteBuffer,
    val jpegPage: ByteBuffer,
    val pdfPage: ByteBuffer,
    val maxExportSize: Int,
    val availableMemory: Long,
) {
    val pngExports: List<ByteBuffer>
        get() = listOf(individualGraphic, groupedElements, selection, currentPage, resizedPage) + allPages
}

suspend fun partialExport(engine: Engine): PartialExport {
    // Demo scaffolding: the guide snippets operate on an existing scene. This
    // source file builds a deterministic two-page scene so the smoke test can
    // verify every export path with real renderable blocks.
    val scene = engine.scene.create()

    val page1 = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page1, value = 800F)
    engine.block.setHeight(page1, value = 600F)
    engine.block.appendChild(parent = scene, child = page1)

    val rectangle = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(rectangle, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(rectangle, value = 220F)
    engine.block.setHeight(rectangle, value = 220F)
    engine.block.setPositionX(rectangle, value = 80F)
    engine.block.setPositionY(rectangle, value = 100F)
    engine.block.setName(rectangle, "background-rect")
    engine.block.setFill(rectangle, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = rectangle,
        color = Color.fromHex("#FF3366CC"),
    )
    engine.block.appendChild(parent = page1, child = rectangle)

    val ellipse = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(ellipse, shape = engine.block.createShape(ShapeType.Ellipse))
    engine.block.setWidth(ellipse, value = 220F)
    engine.block.setHeight(ellipse, value = 220F)
    engine.block.setPositionX(ellipse, value = 340F)
    engine.block.setPositionY(ellipse, value = 100F)
    engine.block.setFill(ellipse, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = ellipse,
        color = Color.fromHex("#FFF4C542"),
    )
    engine.block.appendChild(parent = page1, child = ellipse)

    val star = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(star, shape = engine.block.createShape(ShapeType.Star))
    engine.block.setWidth(star, value = 220F)
    engine.block.setHeight(star, value = 220F)
    engine.block.setPositionX(star, value = 210F)
    engine.block.setPositionY(star, value = 350F)
    engine.block.setFill(star, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = star,
        color = Color.fromHex("#FFE54B4B"),
    )
    engine.block.appendChild(parent = page1, child = star)

    val graphicBlocks = engine.block.findByType(DesignBlockType.Graphic)
    val namedBlocks = engine.block.findByName("background-rect")
    check(graphicBlocks.contains(rectangle))
    check(namedBlocks.single() == rectangle)
    engine.block.forceLoadResources(listOf(page1, rectangle, ellipse, star))

    val firstGraphic = engine.block.findByType(DesignBlockType.Graphic).first()
    val pngOptions = ExportOptions(pngCompressionLevel = 5)
    val blockData = engine.block.export(
        block = firstGraphic,
        mimeType = MimeType.PNG,
        options = pngOptions,
    )
    check(blockData.hasRemaining()) { "individual graphic export is empty" }

    val groupBlocks = engine.block.findByType(DesignBlockType.Graphic).take(2)
    val group = engine.block.group(groupBlocks)
    val groupData = engine.block.export(
        block = group,
        mimeType = MimeType.PNG,
    )
    check(groupData.hasRemaining()) { "group export is empty" }

    // In a real app the user selects blocks in the editor UI and the export
    // action reads it. The smoke test sets one block selected here so the
    // highlighted findAllSelected() snippet is deterministic offscreen.
    engine.block.setSelected(star, selected = true)
    val selectedBlocks = engine.block.findAllSelected()
    val selectionData = when {
        selectedBlocks.size == 1 -> engine.block.export(
            block = selectedBlocks.single(),
            mimeType = MimeType.PNG,
        )
        selectedBlocks.size > 1 && engine.block.isGroupable(selectedBlocks) -> {
            val selectionGroup = engine.block.group(selectedBlocks)
            try {
                engine.block.export(
                    block = selectionGroup,
                    mimeType = MimeType.PNG,
                )
            } finally {
                engine.block.ungroup(selectionGroup)
                selectedBlocks.forEach { block ->
                    engine.block.setSelected(block, selected = true)
                }
            }
        }
        else -> null
    }
    checkNotNull(selectionData) { "no exportable selection" }
    check(selectionData.hasRemaining()) { "selection export is empty" }

    val currentPage = engine.scene.getCurrentPage()
    val currentPageData = currentPage?.let { page ->
        engine.block.export(
            block = page,
            mimeType = MimeType.PNG,
        )
    }
    checkNotNull(currentPageData) { "scene has no current page" }
    check(currentPageData.hasRemaining()) { "current page export is empty" }

    val page = engine.scene.getCurrentPage() ?: error("Scene has no current page")
    val resizedOptions = ExportOptions(
        targetWidth = 1200F,
        targetHeight = 900F,
    )
    val resizedData = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = resizedOptions,
    )
    check(resizedData.hasRemaining()) { "resized page export is empty" }

    val jpegPage = engine.scene.getCurrentPage() ?: error("Scene has no current page")
    val jpegOptions = ExportOptions(jpegQuality = 0.8F)
    val jpegData = engine.block.export(
        block = jpegPage,
        mimeType = MimeType.JPEG,
        options = jpegOptions,
    )
    check(jpegData.hasRemaining()) { "JPEG export is empty" }

    val maxExportSize = engine.editor.getMaxExportSize()
    val availableMemory = engine.editor.getAvailableMemory()

    val pdfPage = engine.scene.getCurrentPage() ?: error("Scene has no current page")
    val pdfOptions = ExportOptions(exportPdfWithHighCompatibility = true)
    val pdfData = engine.block.export(
        block = pdfPage,
        mimeType = MimeType.PDF,
        options = pdfOptions,
    )
    check(pdfData.hasRemaining()) { "PDF export is empty" }

    val page2 = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page2, value = 800F)
    engine.block.setHeight(page2, value = 600F)
    engine.block.appendChild(parent = scene, child = page2)

    val page2Graphic = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(page2Graphic, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(page2Graphic, value = 400F)
    engine.block.setHeight(page2Graphic, value = 300F)
    engine.block.setPositionX(page2Graphic, value = 200F)
    engine.block.setPositionY(page2Graphic, value = 150F)
    engine.block.setFill(page2Graphic, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = page2Graphic,
        color = Color.fromHex("#FF35A66B"),
    )
    engine.block.appendChild(parent = page2, child = page2Graphic)

    val pages = engine.scene.getPages()
    val pageData = engine.block.export(
        blocks = pages,
        mimeType = MimeType.PNG,
    )
    check(pageData.size == pages.size)
    pageData.forEachIndexed { index, data ->
        check(data.hasRemaining()) { "page ${index + 1} export is empty" }
    }

    return PartialExport(
        individualGraphic = blockData.copyForVerification(),
        groupedElements = groupData.copyForVerification(),
        selection = selectionData.copyForVerification(),
        currentPage = currentPageData.copyForVerification(),
        allPages = pageData.map(ByteBuffer::copyForVerification),
        resizedPage = resizedData.copyForVerification(),
        jpegPage = jpegData.copyForVerification(),
        pdfPage = pdfData.copyForVerification(),
        maxExportSize = maxExportSize,
        availableMemory = availableMemory,
    )
}

private fun ByteBuffer.copyForVerification(): ByteBuffer {
    val duplicate = asReadOnlyBuffer()
    val bytes = ByteArray(duplicate.remaining())
    duplicate.get(bytes)
    return ByteBuffer.wrap(bytes).asReadOnlyBuffer()
}
```

Export individual design elements, grouped blocks, or specific pages from your
scene instead of exporting everything at once using CE.SDK's export API.

![Android partial export preview showing the exported page with a rectangle, ellipse, and star.](https://img.ly/docs/cesdk/android/export-save-publish/export/partial-export-89aaf6/assets/android-partial-export-preview.png)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-partial-export)

Partial export gives you fine-grained control over what leaves the scene. Instead
of rendering the entire composition, you can target a single graphic, a logical group
of blocks, or one page out of a multi-page document. This is the foundation for asset-library
generation, "export selection" features, page-by-page previews, and per-element output
pipelines.

<EngineReferenceNote {...props} />

This guide covers exporting individual blocks, grouped elements, and pages with `engine.block.export(...)`, plus the format and sizing options that shape each output.

## Understanding Block Hierarchy and Export

### How Block Hierarchy Affects Exports

CE.SDK organizes content as a tree: Scene -> Pages -> Groups -> Individual Blocks. When you export a block, the export automatically includes every descendant of that block.

Exporting a page exports every element on that page. Exporting a group exports the group and all of its children. Exporting an individual block, such as a graphic or text block, exports only that block. The level of the hierarchy you target determines the scope of the output: choose the page for a complete layout, the group for a composite asset, or the block itself for a single element.

### Export Behavior

The export pipeline normalizes a few things automatically. If the exported block itself is rotated, it is exported without that rotation so the content appears upright in the file. Any margin set on the block is included in the export bounds. Outside strokes are included for most block types; pages handle strokes differently.

> **Note:** Only blocks that belong to the scene hierarchy can be exported. A block
> created with `engine.block.create(...)` but never appended to a parent already
> attached to the scene cannot be exported until it is added to the tree.

## Exporting Individual Blocks

### Finding Blocks to Export

Before exporting, locate the block. The most common entry points are `findByType(...)`, which returns every block of a given `DesignBlockType`, and `findByName(...)`, which returns blocks you have tagged with `engine.block.setName(...)`. If the caller already holds a `DesignBlock` reference from a creation call or a tap handler, you can pass it directly.

```kotlin highlight-android-find-blocks
val graphicBlocks = engine.block.findByType(DesignBlockType.Graphic)
val namedBlocks = engine.block.findByName("background-rect")
```

`findByType(DesignBlockType.Graphic)` returns every graphic block in the scene regardless of fill content. Filter further by inspecting the block's fill or kind if you need a specific subset.

### Basic Block Export

`engine.block.export(...)` is a suspending call that returns a `ByteBuffer`. Pass the block ID, the desired `MimeType`, and an optional `ExportOptions` instance configured for that format. Your app can write the returned buffer to local storage, upload it, share it, or decode image exports with Android platform APIs.

```kotlin highlight-android-export-individual-block
val firstGraphic = engine.block.findByType(DesignBlockType.Graphic).first()
val pngOptions = ExportOptions(pngCompressionLevel = 5)
val blockData = engine.block.export(
    block = firstGraphic,
    mimeType = MimeType.PNG,
    options = pngOptions,
)
```

Common static partial export choices on Android include `MimeType.PNG`, `MimeType.JPEG`, and `MimeType.PDF`. Android also exposes `MimeType.SVG`, `MimeType.TGA`, and `MimeType.BINARY` for workflows that need those block export targets. PNG is ideal for graphics that need transparency such as UI elements, logos, or illustrations with alpha channels. JPEG produces smaller files for photographs but drops transparency, replacing it with a solid background. PDF preserves vector information for print and document workflows.

## Exporting Grouped Elements

### Creating and Exporting Groups

Groups are useful when several blocks should leave the scene as a single output: a logo with multiple components, a composite illustration, or any layout section that should not be split. `engine.block.group(...)` takes a list of `DesignBlock` values, returns the new group's ID, and you export that ID like any other block.

```kotlin highlight-android-create-and-export-group
val groupBlocks = engine.block.findByType(DesignBlockType.Graphic).take(2)
val group = engine.block.group(groupBlocks)
val groupData = engine.block.export(
    block = group,
    mimeType = MimeType.PNG,
)
```

When a group is exported, CE.SDK renders all children together into one file. The group's bounding box determines the export dimensions, and the relative positioning of children is preserved exactly as designed.

### Exporting Selected Elements

A common product workflow is to export whatever the user has selected. `engine.block.findAllSelected()` returns the selected block IDs for an editor action; pass those IDs into the export logic, export a single block directly, and group several blocks when `engine.block.isGroupable(...)` allows it.

```kotlin highlight-android-export-selected
val selectedBlocks = engine.block.findAllSelected()
val selectionData = when {
    selectedBlocks.size == 1 -> engine.block.export(
        block = selectedBlocks.single(),
        mimeType = MimeType.PNG,
    )
    selectedBlocks.size > 1 && engine.block.isGroupable(selectedBlocks) -> {
        val selectionGroup = engine.block.group(selectedBlocks)
        try {
            engine.block.export(
                block = selectionGroup,
                mimeType = MimeType.PNG,
            )
        } finally {
            engine.block.ungroup(selectionGroup)
            selectedBlocks.forEach { block ->
                engine.block.setSelected(block, selected = true)
            }
        }
    }
    else -> null
}
```

This lets a single "Export Selection" action handle both cases without branching in the UI layer. In an editor app the user provides the selection through the canvas. The Android sample sets a deterministic selection before this snippet so the smoke test can verify the same export logic without depending on interactive editor state.

## Exporting Pages

`engine.scene.getCurrentPage()` returns the active page as a nullable `DesignBlock`. Use a null check before exporting. To produce previews for every page in a multi-page document, walk `engine.scene.getPages()` instead.

```kotlin highlight-android-export-current-page
val currentPage = engine.scene.getCurrentPage()
val currentPageData = currentPage?.let { page ->
    engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
    )
}
```

Page exports include the page background, every element on the page, and any page-level effects. The page's own dimensions become the output dimensions unless `targetWidth` and `targetHeight` override them.

For multi-page documents, pass the page list from `engine.scene.getPages()` to the `blocks` overload. CE.SDK exports the batch with one worker and returns the buffers in the same order as the page list, so you can preserve document order while saving previews or thumbnails.

```kotlin highlight-android-export-all-pages
val pages = engine.scene.getPages()
val pageData = engine.block.export(
    blocks = pages,
    mimeType = MimeType.PNG,
)
```

Use sequential numbering when writing the buffers so files are easy to recombine. PNG suits image previews and per-page thumbnails. If you switch the batch to `MimeType.PDF`, the list overload still returns one PDF buffer per page; use the [Export to PDF](./to-pdf.md) guide when downstream consumers expect a single multi-page document.

## Export Options and Configuration

### Target Size Control

`ExportOptions(targetWidth = ..., targetHeight = ...)` requests output at a specific size while preserving the block's aspect ratio. The block is rendered large enough to fill the target completely; if the requested size has a different aspect than the block, one axis may extend past the target so proportions stay correct.

```kotlin highlight-android-target-size
val page = engine.scene.getCurrentPage() ?: error("Scene has no current page")
val resizedOptions = ExportOptions(
    targetWidth = 1200F,
    targetHeight = 900F,
)
val resizedData = engine.block.export(
    block = page,
    mimeType = MimeType.PNG,
    options = resizedOptions,
)
```

`targetWidth` and `targetHeight` are pixel values regardless of the scene's design unit, which makes them useful for thumbnails, social-media presets, and platform-imposed dimensions.

### Quality and Compression

Each export format reads the options that apply to that encoder. Use them to trade output size against visual fidelity.

```kotlin highlight-android-quality-options
val jpegPage = engine.scene.getCurrentPage() ?: error("Scene has no current page")
val jpegOptions = ExportOptions(jpegQuality = 0.8F)
val jpegData = engine.block.export(
    block = jpegPage,
    mimeType = MimeType.JPEG,
    options = jpegOptions,
)
```

| Field                            | Range                              | Behavior                                                                                                     |
| -------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `pngCompressionLevel`            | `0`-`9` (default `5`)              | Higher values produce smaller files at the cost of encoding time. PNG is lossless, so quality is unaffected. |
| `jpegQuality`                    | `(0, 1]` (default `0.9`)           | Higher values produce larger, sharper files. Values above `0.9` are visually transparent for most content.   |
| `exportPdfWithHighCompatibility` | `true` or `false` (default `true`) | Rasterizes bitmap content and some effects at the scene DPI for broader PDF viewer compatibility.            |

### Export Size Limits

Before requesting a very large export, query the device's reported limits. `getMaxExportSize()` returns the maximum dimension in pixels, or `Int.MAX_VALUE` when the limit is unknown. Both width and height of the export must stay below or equal to this value. `getAvailableMemory()` returns free engine memory in bytes; an export that fits within `getMaxExportSize()` may still fail if memory is tight.

```kotlin highlight-android-check-limits
val maxExportSize = engine.editor.getMaxExportSize()
val availableMemory = engine.editor.getAvailableMemory()
```

Use these values to gate user-facing presets, warn on requests that exceed the device limit, or pick a smaller `targetWidth` and `targetHeight` automatically when memory is constrained.

## Export Limitations and Considerations

### Format-Specific Constraints

JPEG drops transparency from the output, replacing transparent pixels with a solid background. Designs that rely on alpha channels should export to PNG instead.

PDF behavior depends on `ExportOptions.exportPdfWithHighCompatibility`. With `true` (the default), bitmap content and effects are rasterized at the scene DPI for broader viewer compatibility. With `false`, PDFs export faster by embedding images directly, but gradients with transparency may not render correctly in Safari or macOS Preview. See the [Export to PDF](./to-pdf.md) guide for detailed performance guidance.

```kotlin highlight-android-export-pdf
val pdfPage = engine.scene.getCurrentPage() ?: error("Scene has no current page")
val pdfOptions = ExportOptions(exportPdfWithHighCompatibility = true)
val pdfData = engine.block.export(
    block = pdfPage,
    mimeType = MimeType.PDF,
    options = pdfOptions,
)
```

### Performance Considerations

`engine.block.export(...)` runs on a worker engine and is suspendable, so the caller can keep the UI responsive. The operation still takes time proportional to the rendered area. Show progress for large exports, and prefer the list overload when batching because it reuses one worker across the batch.

### Hierarchy Requirements

Only blocks attached to the scene can be exported. Always append blocks to a page, or to a parent that is itself in the tree, before calling `export(...)`. Graphic blocks additionally need both a shape and a fill set; `engine.block.create(DesignBlockType.Graphic)` produces an empty placeholder until `setShape(...)` and `setFill(...)` are applied.

## API Reference

| API                                                     | Description                                                                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `engine.block.export(block=_, mimeType=_, options=_)`   | Exports a single block as a `ByteBuffer`.                                                                                                        |
| `engine.block.export(blocks=_, mimeType=_, options=_)`  | Exports several blocks and returns one `ByteBuffer` per ID in input order.                                                                       |
| `engine.block.findByType(type=DesignBlockType.Graphic)` | Returns every block matching the provided `DesignBlockType`.                                                                                     |
| `engine.block.findByName(name=_)`                       | Returns blocks tagged with `setName(...)`.                                                                                                       |
| `engine.block.findAllSelected()`                        | Returns the currently selected blocks.                                                                                                           |
| `engine.block.setSelected(block=_, selected=_)`         | Updates selection state when preparing or restoring an export selection.                                                                         |
| `engine.block.isGroupable(blocks=_)`                    | Checks whether a selection can be grouped before export.                                                                                         |
| `engine.block.group(blocks=_)`                          | Groups multiple blocks under a new parent and returns its ID.                                                                                    |
| `engine.block.ungroup(block=_)`                         | Removes a temporary group after exporting a multi-block selection.                                                                               |
| `engine.scene.getCurrentPage()`                         | Returns the active page as `DesignBlock?`.                                                                                                       |
| `engine.scene.getPages()`                               | Returns every page in scene order.                                                                                                               |
| `engine.editor.getMaxExportSize()`                      | Returns the device's maximum export dimension in pixels.                                                                                         |
| `engine.editor.getAvailableMemory()`                    | Returns free engine memory in bytes.                                                                                                             |
| `ExportOptions(...)`                                    | Configures per-format options such as `pngCompressionLevel`, `jpegQuality`, `targetWidth`, `targetHeight`, and `exportPdfWithHighCompatibility`. |

## Next Steps

- [Export Overview](./overview.md) — Fundamentals of exporting from CE.SDK
- [Export to PDF](./to-pdf.md) — Multi-page PDF output and print-ready
  settings
- [To JPEG](./to-jpeg.md) — Export CE.SDK designs to JPEG format with configurable
  quality settings for photographs, web images, and social media content.
- [Size Limits](./size-limits.md) — Understand and configure limits on exported
  file dimensions or data size.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support