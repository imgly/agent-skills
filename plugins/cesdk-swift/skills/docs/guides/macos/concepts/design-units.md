> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Design Units](./design-units.md)

---

```swift file=@cesdk_swift_examples/engine-guides-design-units/DesignUnits.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func designUnits(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Get the current design unit — defaults to .px for new scenes
  let currentUnit = try engine.scene.getDesignUnit()
  print("Current design unit:", currentUnit) // .px

  // Switch to millimeters for a print workflow
  try engine.scene.setDesignUnit(.mm)

  // Verify the change
  let newUnit = try engine.scene.getDesignUnit()
  print("Design unit changed to:", newUnit) // .mm

  // Set DPI to 300 for print-quality exports
  try engine.block.setFloat(scene, property: "scene/dpi", value: 300)

  // Read back the DPI value
  let dpi = try engine.block.getFloat(scene, property: "scene/dpi")
  print("DPI set to:", dpi) // 300.0

  // Set page to A4 dimensions (210 x 297 mm)
  try engine.block.setWidth(page, value: 210)
  try engine.block.setHeight(page, value: 297)

  let pageWidth = try engine.block.getWidth(page)
  let pageHeight = try engine.block.getHeight(page)
  print("Page dimensions: \(pageWidth)mm x \(pageHeight)mm")

  // Create a text block positioned and sized in millimeters
  let textBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: textBlock)

  // Position at 20 mm from left, 30 mm from top
  try engine.block.setPositionX(textBlock, value: 20)
  try engine.block.setPositionY(textBlock, value: 30)

  // Size: 170 mm wide, 50 mm tall
  try engine.block.setWidth(textBlock, value: 170)
  try engine.block.setHeight(textBlock, value: 50)

  try engine.block.setString(
    textBlock,
    property: "text/text",
    value: "This A4 document uses millimeter units with 300 DPI for print-ready output.",
  )

  // At 300 DPI: 1 inch = 300 pixels, 1 mm ≈ 11.81 pixels
  let a4WidthPixels = 210.0 * (300.0 / 25.4)
  let a4HeightPixels = 297.0 * (300.0 / 25.4)
  print("A4 at 300 DPI exports as \(Int(a4WidthPixels)) x \(Int(a4HeightPixels)) pixels")
}
```

Control measurement systems for precise physical dimensions — create print-ready
documents with millimeter or inch units and configurable DPI for export quality.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/engine-guides-design-units)

Design units determine the coordinate system for all layout values in CE.SDK — positions, sizes, and margins. The engine supports three unit types: **Pixel** for screen-based designs, **Millimeter** for metric print dimensions, and **Inch** for imperial print formats.

This guide covers how to get and set design units, configure DPI for export quality, and set up scenes for specific physical dimensions like A4 paper.

## Understanding Design Units

### Supported Unit Types

CE.SDK supports three design unit types, each suited for different output scenarios:

- **Pixel** (`.px`) — Default unit, ideal for screen-based designs, web graphics, and video content. One unit equals one pixel in the design coordinate space.
- **Millimeter** (`.mm`) — For print designs targeting metric dimensions (A4, A5, business cards). One unit equals one millimeter at the scene's DPI setting.
- **Inch** (`.in`) — For print designs targeting imperial dimensions (letter, legal, US business cards). One unit equals one inch at the scene's DPI setting.

### Design Unit and DPI Relationship

DPI (dots per inch) determines how physical units convert to pixels during export. At 300 DPI, a 1-inch block exports as 300 pixels wide. Higher DPI values produce higher-resolution exports suitable for professional printing.

For pixel-based scenes, DPI primarily affects font size conversions since font sizes are always specified in points.

## Getting the Current Design Unit

Use `engine.scene.getDesignUnit()` to retrieve the current scene's design unit. This returns a `DesignUnit` enum value: `.px`, `.mm`, or `.in`.

```swift highlight-designUnits-getDesignUnit
// Get the current design unit — defaults to .px for new scenes
let currentUnit = try engine.scene.getDesignUnit()
print("Current design unit:", currentUnit) // .px
```

## Setting the Design Unit

Use `engine.scene.setDesignUnit()` to change the measurement system. When you change the design unit, CE.SDK automatically converts existing layout values to maintain visual appearance.

```swift highlight-designUnits-setDesignUnit
  // Switch to millimeters for a print workflow
  try engine.scene.setDesignUnit(.mm)

  // Verify the change
  let newUnit = try engine.scene.getDesignUnit()
  print("Design unit changed to:", newUnit) // .mm
```

## Configuring DPI

Access DPI through the scene's `scene/dpi` property. For print workflows, 300 DPI is the standard for high-quality output.

```swift highlight-designUnits-configureDpi
  // Set DPI to 300 for print-quality exports
  try engine.block.setFloat(scene, property: "scene/dpi", value: 300)

  // Read back the DPI value
  let dpi = try engine.block.getFloat(scene, property: "scene/dpi")
  print("DPI set to:", dpi) // 300.0
```

DPI affects different aspects depending on the design unit:

- **Physical units (mm, in)**: DPI determines the pixel resolution of exported files
- **Pixel units**: DPI only affects the conversion of font sizes from points to pixels

## Setting Up Print-Ready Designs

For print workflows, combine `setDesignUnit(.mm)` with appropriate DPI and page dimensions. Here's how to set up an A4 document ready for print export:

```swift highlight-designUnits-setPageDimensions
  // Set page to A4 dimensions (210 x 297 mm)
  try engine.block.setWidth(page, value: 210)
  try engine.block.setHeight(page, value: 297)

  let pageWidth = try engine.block.getWidth(page)
  let pageHeight = try engine.block.getHeight(page)
  print("Page dimensions: \(pageWidth)mm x \(pageHeight)mm")
```

## Font Sizes and Design Units

Font sizes are always specified in points (`pt`), regardless of the scene's design unit. The DPI setting affects how points convert to pixels for rendering.

```swift highlight-designUnits-createTextBlock
  // Create a text block positioned and sized in millimeters
  let textBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: textBlock)

  // Position at 20 mm from left, 30 mm from top
  try engine.block.setPositionX(textBlock, value: 20)
  try engine.block.setPositionY(textBlock, value: 30)

  // Size: 170 mm wide, 50 mm tall
  try engine.block.setWidth(textBlock, value: 170)
  try engine.block.setHeight(textBlock, value: 50)

  try engine.block.setString(
    textBlock,
    property: "text/text",
    value: "This A4 document uses millimeter units with 300 DPI for print-ready output.",
  )
```

When DPI changes, text blocks automatically adjust their rendered size to maintain visual consistency.

## Understanding Export Resolution

The relationship between design units and export resolution is important for print workflows:

```swift highlight-designUnits-compareUnits
// At 300 DPI: 1 inch = 300 pixels, 1 mm ≈ 11.81 pixels
let a4WidthPixels = 210.0 * (300.0 / 25.4)
let a4HeightPixels = 297.0 * (300.0 / 25.4)
print("A4 at 300 DPI exports as \(Int(a4WidthPixels)) x \(Int(a4HeightPixels)) pixels")
```

At 300 DPI:

- An A4 page (210 x 297 mm) exports as 2480 x 3508 pixels
- A letter page (8.5 x 11 in) exports as 2550 x 3300 pixels

## Troubleshooting

### Exported Dimensions Don't Match Expected Size

Verify that DPI is set correctly for physical units. At 300 DPI, 1 inch becomes 300 pixels. Check that your design unit matches your target output format.

### Text Appears Wrong Size After Unit Change

Font sizes in points auto-adjust based on DPI. If text looks incorrect, verify the DPI setting matches your workflow requirements.

### Blocks Shift Position After Changing Units

CE.SDK preserves visual appearance during unit conversion. If positions seem unexpected, check the original coordinate values — the numeric values change but visual positions should remain stable.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.getDesignUnit()` | Get the current design unit of the scene |
| `engine.scene.setDesignUnit(_ designUnit:)` | Set the design unit for the scene |
| `engine.block.getFloat(_:property: "scene/dpi")` | Get the DPI value of a scene |
| `engine.block.setFloat(_:property: "scene/dpi", value:)` | Set the DPI value of a scene |
| `engine.block.setWidth(_:value:)` | Set block width in current design unit |
| `engine.block.setHeight(_:value:)` | Set block height in current design unit |

## Next Steps

- [Scenes](./scenes.md) — Learn about scene structure and management
- [Blocks](./blocks.md) — Understand block types and properties



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support