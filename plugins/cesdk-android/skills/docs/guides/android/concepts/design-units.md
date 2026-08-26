> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Design Units](./design-units.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-design-units/DesignUnits.kt reference-only
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import kotlin.math.roundToInt

suspend fun designUnits(engine: Engine): DesignBlock = withContext(engine.dispatcher) {
    val page = configureDesignUnits(engine)
    engine.scene.zoomToBlock(page)
    engine.block.forceLoadResources(listOf(page))
    page
}

internal fun configureDesignUnits(engine: Engine): DesignBlock {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)
    // Get the current design unit. New scenes default to PIXEL.
    val currentUnit = engine.scene.getDesignUnit()
    println("Current design unit: $currentUnit") // PIXEL

    // Switch to millimeters for a print workflow.
    engine.scene.setDesignUnit(DesignUnit.MILLIMETER)

    // Verify the change.
    val newUnit = engine.scene.getDesignUnit()
    println("Design unit changed to: $newUnit") // MILLIMETER

    // Set DPI to 300 for print-quality exports.
    engine.block.setFloat(scene, property = "scene/dpi", value = 300F)

    // Read back the DPI value.
    val dpi = engine.block.getFloat(scene, property = "scene/dpi")
    println("DPI set to: $dpi") // 300.0

    // Set the page to A4 dimensions (210 x 297 mm).
    engine.block.setWidth(page, value = 210F)
    engine.block.setHeight(page, value = 297F)

    val pageWidth = engine.block.getWidth(page)
    val pageHeight = engine.block.getHeight(page)
    println("Page dimensions: ${pageWidth}mm x ${pageHeight}mm")

    // Create a text block positioned and sized in millimeters.
    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = textBlock)

    // Position at 20 mm from left, 30 mm from top.
    engine.block.setPositionX(textBlock, value = 20F)
    engine.block.setPositionY(textBlock, value = 30F)

    // Size: 170 mm wide, 50 mm tall.
    engine.block.setWidth(textBlock, value = 170F)
    engine.block.setHeight(textBlock, value = 50F)

    engine.block.setString(
        textBlock,
        property = "text/text",
        value = "This A4 document uses millimeter units with 300 DPI for print-ready output.",
    )
    // Font sizes stay in points even when the scene uses millimeters.
    engine.block.setTextFontSize(textBlock, fontSize = 24F)

    // At 300 DPI: 1 inch = 300 pixels, 1 mm ~= 11.81 pixels.
    val a4WidthPixels = 210.0 * (300.0 / 25.4)
    val a4HeightPixels = 297.0 * (300.0 / 25.4)
    println("A4 at 300 DPI exports as ${a4WidthPixels.roundToInt()} x ${a4HeightPixels.roundToInt()} pixels")

    return page
}
```

Control measurement systems for precise physical dimensions - create print-ready
documents with millimeter or inch units and configurable DPI for export quality.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260826/engine-guides-design-units)

<EngineReferenceNote {...props} />

Design units determine the coordinate system for all layout values in CE.SDK - positions, sizes, and margins. The engine supports three unit types: **Pixel** for screen-based designs, **Millimeter** for metric print dimensions, and **Inch** for imperial print formats.

This guide covers how to get and set design units, configure DPI for export quality, and set up scenes for specific physical dimensions like A4 paper.

## Understanding Design Units

### Supported Unit Types

CE.SDK supports three design unit types, each suited for different output scenarios:

- **Pixel** (`DesignUnit.PIXEL`) - Default unit, ideal for screen-based designs, web graphics, and video content. One unit equals one pixel in the design coordinate space.
- **Millimeter** (`DesignUnit.MILLIMETER`) - For print designs targeting metric dimensions (A4, A5, business cards). One unit equals one millimeter at the scene's DPI setting.
- **Inch** (`DesignUnit.INCH`) - For print designs targeting imperial dimensions (letter, legal, US business cards). One unit equals one inch at the scene's DPI setting.

### Design Unit and DPI Relationship

DPI (dots per inch) determines how physical units convert to pixels during export. At 300 DPI, a 1-inch block exports as 300 pixels wide. Higher DPI values produce higher-resolution exports suitable for professional printing.

For pixel-based scenes, DPI primarily affects font size conversions since font sizes are always specified in points.

## Getting the Current Design Unit

Use `engine.scene.getDesignUnit()` to retrieve the current scene's design unit. This returns a `DesignUnit` enum value: `DesignUnit.PIXEL`, `DesignUnit.MILLIMETER`, or `DesignUnit.INCH`.

```kotlin highlight-android-design-units-get-design-unit
// Get the current design unit. New scenes default to PIXEL.
val currentUnit = engine.scene.getDesignUnit()
println("Current design unit: $currentUnit") // PIXEL
```

## Setting the Design Unit

Use `engine.scene.setDesignUnit()` to change the measurement system. When you change the design unit, CE.SDK automatically converts existing layout values to maintain visual appearance.

```kotlin highlight-android-design-units-set-design-unit
    // Switch to millimeters for a print workflow.
    engine.scene.setDesignUnit(DesignUnit.MILLIMETER)

    // Verify the change.
    val newUnit = engine.scene.getDesignUnit()
    println("Design unit changed to: $newUnit") // MILLIMETER
```

## Configuring DPI

Access DPI through the scene's `scene/dpi` property. For print workflows, 300 DPI is the standard for high-quality output.

```kotlin highlight-android-design-units-configure-dpi
    // Set DPI to 300 for print-quality exports.
    engine.block.setFloat(scene, property = "scene/dpi", value = 300F)

    // Read back the DPI value.
    val dpi = engine.block.getFloat(scene, property = "scene/dpi")
    println("DPI set to: $dpi") // 300.0
```

DPI affects different aspects depending on the design unit:

- **Physical units (mm, in)**: DPI determines the pixel resolution of exported files.
- **Pixel units**: DPI only affects the conversion of font sizes from points to pixels.

## Setting Up Print-Ready Designs

For print workflows, combine `engine.scene.setDesignUnit(DesignUnit.MILLIMETER)` with appropriate DPI and page dimensions. Here's how to set up an A4 document ready for print export:

```kotlin highlight-android-design-units-set-page-dimensions
    // Set the page to A4 dimensions (210 x 297 mm).
    engine.block.setWidth(page, value = 210F)
    engine.block.setHeight(page, value = 297F)

    val pageWidth = engine.block.getWidth(page)
    val pageHeight = engine.block.getHeight(page)
    println("Page dimensions: ${pageWidth}mm x ${pageHeight}mm")
```

## Font Sizes and Design Units

Font sizes are always specified in points (`pt`), regardless of the scene's design unit. On Android, call `engine.block.setTextFontSize()` with point values even when the scene uses `DesignUnit.MILLIMETER` or `DesignUnit.INCH`.

```kotlin highlight-android-design-units-create-text-block
    // Create a text block positioned and sized in millimeters.
    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = textBlock)

    // Position at 20 mm from left, 30 mm from top.
    engine.block.setPositionX(textBlock, value = 20F)
    engine.block.setPositionY(textBlock, value = 30F)

    // Size: 170 mm wide, 50 mm tall.
    engine.block.setWidth(textBlock, value = 170F)
    engine.block.setHeight(textBlock, value = 50F)

    engine.block.setString(
        textBlock,
        property = "text/text",
        value = "This A4 document uses millimeter units with 300 DPI for print-ready output.",
    )
    // Font sizes stay in points even when the scene uses millimeters.
    engine.block.setTextFontSize(textBlock, fontSize = 24F)
```

When DPI changes, text blocks automatically adjust their rendered size to maintain visual consistency.

## Understanding Export Resolution

The relationship between design units and export resolution is important for print workflows:

```kotlin highlight-android-design-units-compare-units
// At 300 DPI: 1 inch = 300 pixels, 1 mm ~= 11.81 pixels.
val a4WidthPixels = 210.0 * (300.0 / 25.4)
val a4HeightPixels = 297.0 * (300.0 / 25.4)
println("A4 at 300 DPI exports as ${a4WidthPixels.roundToInt()} x ${a4HeightPixels.roundToInt()} pixels")
```

At 300 DPI:

- An A4 page (210 x 297 mm) exports as 2480 x 3508 pixels.
- A letter page (8.5 x 11 in) exports as 2550 x 3300 pixels.

## Troubleshooting

### Exported Dimensions Don't Match Expected Size

Verify that DPI is set correctly for physical units. At 300 DPI, 1 inch becomes 300 pixels. Check that your design unit matches your target output format.

### Text Appears Wrong Size After Unit Change

Font sizes in points auto-adjust based on DPI. If text looks incorrect, verify the DPI setting matches your workflow requirements.

### Blocks Shift Position After Unit Change

CE.SDK preserves visual appearance during unit conversion. If positions seem unexpected, check the original coordinate values - the numeric values change but visual positions should remain stable.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.getDesignUnit()` | Get the current design unit of the scene. |
| `engine.scene.setDesignUnit(designUnit)` | Set the design unit for the scene. |
| `engine.block.getFloat(scene, property = "scene/dpi")` | Get the DPI value of a scene. |
| `engine.block.setFloat(scene, property = "scene/dpi", value = 300F)` | Set the DPI value of a scene. |
| `engine.block.setWidth(block, value = 210F)` | Set block width in the current design unit. |
| `engine.block.setHeight(block, value = 297F)` | Set block height in the current design unit. |

## Next Steps

- [Scenes](./scenes.md) - Learn about scene structure and management.
- [Blocks](./blocks.md) - Understand block types and properties.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support