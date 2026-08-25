> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Color Basics](./basics.md)

---

```swift file=@cesdk_swift_examples/engine-guides-colors-basics/ColorsBasics.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func colorsBasics(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Create a graphic block with a color fill
  let srgbBlock = try engine.block.create(.graphic)
  try engine.block.setShape(srgbBlock, shape: engine.block.createShape(.rect))
  let srgbFill = try engine.block.createFill(.color)
  try engine.block.setFill(srgbBlock, fill: srgbFill)
  try engine.block.appendChild(to: page, child: srgbBlock)

  // Set fill color using an sRGB color (values 0.0-1.0)
  let srgbColor = Color.rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0)
  try engine.block.setColor(srgbFill, property: "fill/color/value", color: srgbColor)

  // Create another block with a CMYK color
  let cmykBlock = try engine.block.create(.graphic)
  try engine.block.setShape(cmykBlock, shape: engine.block.createShape(.rect))
  let cmykFill = try engine.block.createFill(.color)
  try engine.block.setFill(cmykBlock, fill: cmykFill)
  try engine.block.appendChild(to: page, child: cmykBlock)

  // Set fill color using a CMYK color (values 0.0-1.0, tint controls opacity)
  let cmykColor = Color.cmyk(c: 0.0, m: 0.8, y: 0.95, k: 0.0, tint: 1.0)
  try engine.block.setColor(cmykFill, property: "fill/color/value", color: cmykColor)

  // Define a spot color with an RGB approximation for screen preview
  engine.editor.setSpotColor(name: "MyBrand Red", r: 0.95, g: 0.25, b: 0.21)
  // You can also define a spot color with a CMYK approximation
  engine.editor.setSpotColor(name: "MyBrand Blue", c: 1.0, m: 0.7, y: 0.0, k: 0.1)

  // Create a block and apply the defined spot color
  let spotBlock = try engine.block.create(.graphic)
  try engine.block.setShape(spotBlock, shape: engine.block.createShape(.rect))
  let spotFill = try engine.block.createFill(.color)
  try engine.block.setFill(spotBlock, fill: spotFill)
  try engine.block.appendChild(to: page, child: spotBlock)

  // Reference the spot color by name, with a tint and optional external reference
  let spotColor = Color.spot(name: "MyBrand Red", tint: 1.0, externalReference: "")
  try engine.block.setColor(spotFill, property: "fill/color/value", color: spotColor)

  // Enable stroke and apply a stroke color using sRGB
  try engine.block.setStrokeEnabled(srgbBlock, enabled: true)
  try engine.block.setStrokeWidth(srgbBlock, width: 4)
  try engine.block.setColor(srgbBlock, property: "stroke/color", color: .rgba(r: 0.1, g: 0.2, b: 0.5, a: 1.0))

  // Apply a CMYK stroke color
  try engine.block.setStrokeEnabled(cmykBlock, enabled: true)
  try engine.block.setStrokeWidth(cmykBlock, width: 4)
  let cmykStroke = Color.cmyk(c: 0.0, m: 0.5, y: 0.6, k: 0.2, tint: 1.0)
  try engine.block.setColor(cmykBlock, property: "stroke/color", color: cmykStroke)

  // Apply a spot color stroke with reduced tint
  try engine.block.setStrokeEnabled(spotBlock, enabled: true)
  try engine.block.setStrokeWidth(spotBlock, width: 4)
  try engine.block.setColor(spotBlock, property: "stroke/color", color: .spot(name: "MyBrand Red", tint: 0.7))

  // Read back color values from a property
  let readSrgb: Color = try engine.block.getColor(srgbFill, property: "fill/color/value")
  let readCmyk: Color = try engine.block.getColor(cmykFill, property: "fill/color/value")
  let readSpot: Color = try engine.block.getColor(spotFill, property: "fill/color/value")

  // The returned Color enum indicates the color space through its case
  for color in [readSrgb, readCmyk, readSpot] {
    switch color {
    case let .rgba(r, g, b, a):
      print("sRGB: r=\(r), g=\(g), b=\(b), a=\(a)")
    case let .cmyk(c, m, y, k, tint):
      print("CMYK: c=\(c), m=\(m), y=\(y), k=\(k), tint=\(tint)")
    case let .spot(name, tint, externalReference):
      print("Spot: name=\(name), tint=\(tint), ref=\(externalReference)")
    @unknown default:
      print("Unknown color space")
    }
  }
}
```

Understand the three color spaces in CE.SDK and when to use each for screen or print workflows.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-colors-basics)

CE.SDK supports three color spaces: **sRGB** for screen display, **CMYK** for print workflows, and **Spot Color** for specialized printing. Each color space is represented as a case of the Swift `Color` enum, and all three work with the unified `setColor()` / `getColor()` API.

This guide covers how to choose the correct color space, define and apply colors using the `Color` enum, and configure spot colors with screen preview approximations.

## Color Spaces Overview

CE.SDK represents colors as cases of the `Color` enum:

- `Color.rgba(r:g:b:a:)` — sRGB color for screen display
- `Color.cmyk(c:m:y:k:tint:)` — CMYK color for print
- `Color.spot(name:tint:externalReference:)` — Named spot color for specialized printing

Use `engine.block.setColor(_:property:color:)` to apply any color type to supported properties.

**Supported color properties:**

- `'fill/color/value'` — Fill color of a block
- `'stroke/color'` — Stroke/outline color
- `'dropShadow/color'` — Drop shadow color
- `'backgroundColor/color'` — Background color
- `'camera/clearColor'` — Canvas clear color

## sRGB Colors

sRGB is the default color space for screen display. Create a `Color.rgba` value with `r`, `g`, `b`, `a` components, each in the range 0.0 to 1.0. The `a` (alpha) component controls transparency.

```swift highlight-colorsBasics-srgb
  // Create a graphic block with a color fill
  let srgbBlock = try engine.block.create(.graphic)
  try engine.block.setShape(srgbBlock, shape: engine.block.createShape(.rect))
  let srgbFill = try engine.block.createFill(.color)
  try engine.block.setFill(srgbBlock, fill: srgbFill)
  try engine.block.appendChild(to: page, child: srgbBlock)

  // Set fill color using an sRGB color (values 0.0-1.0)
  let srgbColor = Color.rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0)
  try engine.block.setColor(srgbFill, property: "fill/color/value", color: srgbColor)
```

sRGB colors are ideal for web and digital content where the output is displayed on screens.

## CMYK Colors

CMYK is the color space for print workflows. Create a `Color.cmyk` value with `c`, `m`, `y`, `k` components (0.0 to 1.0) plus a `tint` value that controls opacity.

```swift highlight-colorsBasics-cmyk
  // Create another block with a CMYK color
  let cmykBlock = try engine.block.create(.graphic)
  try engine.block.setShape(cmykBlock, shape: engine.block.createShape(.rect))
  let cmykFill = try engine.block.createFill(.color)
  try engine.block.setFill(cmykBlock, fill: cmykFill)
  try engine.block.appendChild(to: page, child: cmykBlock)

  // Set fill color using a CMYK color (values 0.0-1.0, tint controls opacity)
  let cmykColor = Color.cmyk(c: 0.0, m: 0.8, y: 0.95, k: 0.0, tint: 1.0)
  try engine.block.setColor(cmykFill, property: "fill/color/value", color: cmykColor)
```

When rendered on screen, CMYK colors are converted to RGB using standard conversion formulas. The `tint` value (0.0 to 1.0) is rendered as transparency.

> **Note:** During PDF export, CMYK colors are currently converted to RGB using the standard conversion. Tint values are retained in the alpha channel.

## Spot Colors

Spot colors are named colors used for specialized printing. Before using a spot color, you must define it with an RGB or CMYK approximation for screen preview.

### Defining Spot Colors

Use `engine.editor.setSpotColor(name:r:g:b:)` or `engine.editor.setSpotColor(name:c:m:y:k:)` to register a spot color with its screen preview approximation.

```swift highlight-colorsBasics-defineSpot
// Define a spot color with an RGB approximation for screen preview
engine.editor.setSpotColor(name: "MyBrand Red", r: 0.95, g: 0.25, b: 0.21)
// You can also define a spot color with a CMYK approximation
engine.editor.setSpotColor(name: "MyBrand Blue", c: 1.0, m: 0.7, y: 0.0, k: 0.1)
```

### Applying Spot Colors

Reference a defined spot color using `Color.spot(name:tint:externalReference:)`. The `tint` controls opacity when rendered on screen.

```swift highlight-colorsBasics-spot
  // Create a block and apply the defined spot color
  let spotBlock = try engine.block.create(.graphic)
  try engine.block.setShape(spotBlock, shape: engine.block.createShape(.rect))
  let spotFill = try engine.block.createFill(.color)
  try engine.block.setFill(spotBlock, fill: spotFill)
  try engine.block.appendChild(to: page, child: spotBlock)

  // Reference the spot color by name, with a tint and optional external reference
  let spotColor = Color.spot(name: "MyBrand Red", tint: 1.0, externalReference: "")
  try engine.block.setColor(spotFill, property: "fill/color/value", color: spotColor)
```

When rendered on screen, the spot color uses its RGB or CMYK approximation. During PDF export, spot colors are saved as a [Separation Color Space](https://opensource.adobe.com/dc-acrobat-sdk-docs/pdfstandards/pdfreference1.6.pdf#G9.1850648) that preserves print information.

> **Note:** If a block references an undefined spot color, CE.SDK displays magenta (RGB: 1, 0, 1) as a fallback.

## Applying Stroke Colors

Strokes support all three color spaces. Enable the stroke, set its width, then apply a color using the `'stroke/color'` property.

```swift highlight-colorsBasics-stroke
  // Enable stroke and apply a stroke color using sRGB
  try engine.block.setStrokeEnabled(srgbBlock, enabled: true)
  try engine.block.setStrokeWidth(srgbBlock, width: 4)
  try engine.block.setColor(srgbBlock, property: "stroke/color", color: .rgba(r: 0.1, g: 0.2, b: 0.5, a: 1.0))

  // Apply a CMYK stroke color
  try engine.block.setStrokeEnabled(cmykBlock, enabled: true)
  try engine.block.setStrokeWidth(cmykBlock, width: 4)
  let cmykStroke = Color.cmyk(c: 0.0, m: 0.5, y: 0.6, k: 0.2, tint: 1.0)
  try engine.block.setColor(cmykBlock, property: "stroke/color", color: cmykStroke)

  // Apply a spot color stroke with reduced tint
  try engine.block.setStrokeEnabled(spotBlock, enabled: true)
  try engine.block.setStrokeWidth(spotBlock, width: 4)
  try engine.block.setColor(spotBlock, property: "stroke/color", color: .spot(name: "MyBrand Red", tint: 0.7))
```

## Reading Color Values

Use `engine.block.getColor(_:property:)` to retrieve the current color value from a property. The returned `Color` enum indicates the color space through its case.

```swift highlight-colorsBasics-getColor
  // Read back color values from a property
  let readSrgb: Color = try engine.block.getColor(srgbFill, property: "fill/color/value")
  let readCmyk: Color = try engine.block.getColor(cmykFill, property: "fill/color/value")
  let readSpot: Color = try engine.block.getColor(spotFill, property: "fill/color/value")

  // The returned Color enum indicates the color space through its case
  for color in [readSrgb, readCmyk, readSpot] {
    switch color {
    case let .rgba(r, g, b, a):
      print("sRGB: r=\(r), g=\(g), b=\(b), a=\(a)")
    case let .cmyk(c, m, y, k, tint):
      print("CMYK: c=\(c), m=\(m), y=\(y), k=\(k), tint=\(tint)")
    case let .spot(name, tint, externalReference):
      print("Spot: name=\(name), tint=\(tint), ref=\(externalReference)")
    @unknown default:
      print("Unknown color space")
    }
  }
```

## Choosing the Right Color Space

| Color Space | Use Case | Output |
|-------------|----------|--------|
| **sRGB** | Web, digital, screen display | PNG, JPEG, WebP |
| **CMYK** | Print workflows (converts to RGB) | PDF (converted) |
| **Spot Color** | Specialized printing, brand colors | PDF (Separation Color Space) |

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.setColor(_:property:color:)` | Set a color property on a block. Pass a `Color.rgba`, `Color.cmyk`, or `Color.spot` value. |
| `engine.block.getColor(_:property:)` | Get the current color value from a property. Returns a `Color` enum value. |
| `engine.editor.setSpotColor(name:r:g:b:)` | Define a spot color with an RGB approximation for screen preview. Components range from 0.0 to 1.0. |
| `engine.editor.setSpotColor(name:c:m:y:k:)` | Define a spot color with a CMYK approximation for screen preview. Components range from 0.0 to 1.0. |

| Type | Properties | Description |
|------|------------|-------------|
| `Color.rgba` | `r`, `g`, `b`, `a` (0.0-1.0) | sRGB color for screen display. Alpha controls transparency. |
| `Color.cmyk` | `c`, `m`, `y`, `k`, `tint` (0.0-1.0) | CMYK color for print. Tint controls opacity. |
| `Color.spot` | `name`, `tint`, `externalReference` | Named color for specialized printing. |

## Next Steps

- [Apply Colors](./apply.md) — Apply colors to design elements programmatically
- [CMYK Colors](./for-print/cmyk.md) — Work with CMYK for print workflows
- [Spot Colors](./for-print/spot.md) — Define and manage spot colors for specialized printing



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support