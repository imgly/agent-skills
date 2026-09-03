> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Stickers](../stickers.md) > [Create Cutout](./create-cutout.md)

---

```swift file=@cesdk_swift_examples/engine-guides-cutouts/Cutouts.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func cutouts(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let circle = try engine.block.createCutoutFromPath("M 0,25 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 Z")
  try engine.block.appendChild(to: page, child: circle)

  try engine.block.setEnum(circle, property: "cutout/type", value: "Dashed")

  try engine.block.setFloat(circle, property: "cutout/offset", value: 3.0)

  try engine.block.setFloat(circle, property: "cutout/smoothing", value: 2.0)

  let square = try engine.block.createCutoutFromPath("M 0,0 H 50 V 50 H 0 Z")
  try engine.block.setFloat(square, property: "cutout/offset", value: 6.0)
  try engine.block.appendChild(to: page, child: square)

  let union = try engine.block.createCutoutFromOperation(
    containing: [circle, square],
    cutoutOperation: .union,
  )
  try engine.block.appendChild(to: page, child: union)
  try engine.block.destroy(circle)
  try engine.block.destroy(square)

  engine.editor.setSpotColor(name: "CutContour", r: 0.0, g: 0.0, b: 1.0)
  engine.editor.setSpotColor(name: "PerfCutContour", r: 1.0, g: 0.5, b: 0.0)

  let graphic = try engine.block.create(.graphic)
  try engine.block.setShape(graphic, shape: engine.block.createShape(.rect))
  let fill = try engine.block.createFill(.color)
  try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0, g: 0, b: 0))
  try engine.block.setFill(graphic, fill: fill)
  try engine.block.setWidth(graphic, value: 100)
  try engine.block.setHeight(graphic, value: 100)
  try engine.block.appendChild(to: page, child: graphic)

  let traced = try engine.block.createCutoutFromBlocks(
    ids: [graphic],
    vectorizeDistanceThreshold: 2,
    simplifyDistanceThreshold: 4,
    useExistingShapeInformation: true,
  )
  try engine.block.appendChild(to: page, child: traced)
}
```

Create cutout paths for cutting printers to produce die-cut stickers, iron-on
decals, and custom-shaped prints programmatically.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260903/engine-guides-cutouts)

<EngineReferenceNote {...props} />

Cutouts define outline paths that cutting printers cut with a blade rather than print with ink. CE.SDK supports creating cutouts from SVG paths, generating them from block contours, and combining them with boolean operations.

This guide covers creating cutouts programmatically from SVG paths and existing blocks, configuring cutout type, offset, and smoothing, combining cutouts with boolean operations, and customizing spot colors for printer compatibility.

## Understanding Cutouts

Cutouts are special blocks of type `//ly.img.ubq/cutout` that contain SVG paths interpreted by cutting printers as cut lines. Printers recognize cutouts through specially named spot colors: `CutContour` for solid continuous cuts and `PerfCutContour` for dashed perforated cuts.

The spot color RGB approximation affects on-screen rendering but not printer behavior. By default, both solid and dashed cutouts render as magenta — set their spot color RGB approximations via [Customizing Spot Colors](./create-cutout.md#customizing-spot-colors) to differentiate them visually on the canvas.

> **Note:** Cutouts export to PDF format with spot color information preserved. Cutting
> printers read the spot colors to identify cut paths.

## Setup the Scene

Create a new scene with a page to host the cutouts.

```swift highlight-setup
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)
```

## Creating Cutouts from SVG Paths

Create cutouts using `engine.block.createCutoutFromPath(_:)` with standard SVG path syntax. The path coordinates define the cutout dimensions.

```swift highlight-create-cutout-from-path
let circle = try engine.block.createCutoutFromPath("M 0,25 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 Z")
try engine.block.appendChild(to: page, child: circle)
```

The method accepts standard SVG path commands: `M` (move), `L` (line), `H` (horizontal), `V` (vertical), `C` (cubic curve), `Q` (quadratic curve), `A` (arc), and `Z` (close path). Append the cutout to the page hierarchy so it participates in layout and export.

## Configuring Cutout Type

Set the cutout type with `engine.block.setEnum(_:property:value:)` on `cutout/type`. The value is the string key `"Solid"` (default) for a continuous cut line or `"Dashed"` for a perforated cut line.

```swift highlight-configure-cutout-type
try engine.block.setEnum(circle, property: "cutout/type", value: "Dashed")
```

`"Solid"` uses the `CutContour` spot color, while `"Dashed"` uses `PerfCutContour` for tear-away edges.

## Configuring Cutout Offset

Adjust the distance between the cutout line and the source path with `engine.block.setFloat(_:property:value:)` on `cutout/offset`. The value is in the scene's design units.

```swift highlight-configure-cutout-offset
try engine.block.setFloat(circle, property: "cutout/offset", value: 3.0)
```

Positive offset values expand the cutout outward from the path. Use offset to add bleed or margin around designs for cleaner cuts.

## Configuring Cutout Smoothing

Round out sharp corners in the cutout path with `engine.block.setFloat(_:property:value:)` on `cutout/smoothing`. The value is a pixel threshold for corner rounding.

```swift highlight-configure-cutout-smoothing
try engine.block.setFloat(circle, property: "cutout/smoothing", value: 2.0)
```

Smoothing is useful when generating cutouts from blocks with angular contours that would otherwise produce jagged cut lines.

## Creating Multiple Cutouts

Create additional cutouts with independent properties to demonstrate combining them later. Each cutout carries its own type and offset.

```swift highlight-create-square-cutout
let square = try engine.block.createCutoutFromPath("M 0,0 H 50 V 50 H 0 Z")
try engine.block.setFloat(square, property: "cutout/offset", value: 6.0)
try engine.block.appendChild(to: page, child: square)
```

## Combining Cutouts with Boolean Operations

Combine multiple cutouts into compound shapes with `engine.block.createCutoutFromOperation(containing:cutoutOperation:)`. The `CutoutOperation` enum exposes `.union`, `.difference`, `.intersection`, and `.xor`.

```swift highlight-combine-cutouts
let union = try engine.block.createCutoutFromOperation(
  containing: [circle, square],
  cutoutOperation: .union,
)
try engine.block.appendChild(to: page, child: union)
try engine.block.destroy(circle)
try engine.block.destroy(square)
```

The combined cutout inherits the type from the first cutout in the array and has an offset of 0. Destroy the original cutouts after combining to avoid duplicate cuts during printing.

> **Note:** When using `.difference`, the first cutout is the base that the others
> subtract from. For other operations, the order affects which cutout's type is
> inherited.

## Customizing Spot Colors

Modify the spot color RGB approximation with `engine.editor.setSpotColor(name:r:g:b:)` to change how cutouts render without affecting printer behavior. An overload accepting CMYK components is also available for print workflows.

```swift highlight-customize-spot-color
engine.editor.setSpotColor(name: "CutContour", r: 0.0, g: 0.0, b: 1.0)
engine.editor.setSpotColor(name: "PerfCutContour", r: 1.0, g: 0.5, b: 0.0)
```

Spot color names (`CutContour`, `PerfCutContour`) are what printers recognize. Adjust the names with `engine.editor.setSpotColor` if your printer uses different conventions.

## Creating Cutouts from Blocks

Generate cutouts automatically from existing block contours with `engine.block.createCutoutFromBlocks(ids:...)`. The method vectorizes block appearances or reuses existing vector paths.

```swift highlight-create-cutout-from-blocks
  let graphic = try engine.block.create(.graphic)
  try engine.block.setShape(graphic, shape: engine.block.createShape(.rect))
  let fill = try engine.block.createFill(.color)
  try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0, g: 0, b: 0))
  try engine.block.setFill(graphic, fill: fill)
  try engine.block.setWidth(graphic, value: 100)
  try engine.block.setHeight(graphic, value: 100)
  try engine.block.appendChild(to: page, child: graphic)

  let traced = try engine.block.createCutoutFromBlocks(
    ids: [graphic],
    vectorizeDistanceThreshold: 2,
    simplifyDistanceThreshold: 4,
    useExistingShapeInformation: true,
  )
  try engine.block.appendChild(to: page, child: traced)
```

| Parameter | Purpose |
|---|---|
| `vectorizeDistanceThreshold` | Maximum number of pixels by which the cutout path can deviate from the original contour during vectorization. |
| `simplifyDistanceThreshold` | Maximum number of pixels by which the simplified path can deviate from the vectorized contour. Pass `0` to disable simplification. |
| `useExistingShapeInformation` | When `true`, reuses the existing vector paths of the provided blocks. When `false`, generates new shape information. |

## Troubleshooting

### Cutout Not Visible

Cutouts render using spot color RGB approximations. Verify the cutout is appended to the page hierarchy with `engine.block.appendChild(to:child:)` and positioned within the visible canvas area.

### Printer Not Cutting

Check that spot color names match your printer's requirements. Some printers need specific names like `CutContour` or `Thru-cut`. Consult your printer documentation.

### Combined Cutout Has Wrong Type

Combined cutouts inherit the type from the first cutout in the array. Reorder the array passed to `createCutoutFromOperation(containing:cutoutOperation:)` or set the type explicitly after combination.

### Cutout Path Too Complex

Use `createCutoutFromBlocks(ids:...)` with a higher `simplifyDistanceThreshold` to reduce the number of points in the path. Complex paths may cause performance issues or printer errors.

## API Reference

| Method | Category | Purpose |
|---|---|---|
| `engine.block.createCutoutFromPath(_:)` | Cutout | Create cutout from SVG path string |
| `engine.block.createCutoutFromBlocks(ids:...)` | Cutout | Create cutout from block contours |
| `engine.block.createCutoutFromOperation(containing:cutoutOperation:)` | Cutout | Combine cutouts with boolean operation |
| `engine.block.setEnum(_:property:value:)` on `cutout/type` | Property | Set cutout type (`"Solid"` / `"Dashed"`) |
| `engine.block.setFloat(_:property:value:)` on `cutout/offset` | Property | Set cutout offset distance |
| `engine.block.setFloat(_:property:value:)` on `cutout/smoothing` | Property | Set corner smoothing threshold |
| `engine.block.appendChild(to:child:)` | Hierarchy | Add cutout to scene |
| `engine.block.destroy(_:)` | Lifecycle | Remove cutout from scene |
| `engine.editor.setSpotColor(name:r:g:b:)` | Editor | Customize spot color rendering (RGB) |
| `engine.editor.setSpotColor(name:c:m:y:k:)` | Editor | Customize spot color rendering (CMYK) |

## Next Steps

- [Combine Shapes](./combine.md) — Boolean operations on graphic blocks
- [Create Shapes](./create-edit/create-shapes.md) — Create geometric shapes programmatically
- [Export for Printing](../export-save-publish/for-printing.md) — Export print-ready PDFs with spot colors



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support