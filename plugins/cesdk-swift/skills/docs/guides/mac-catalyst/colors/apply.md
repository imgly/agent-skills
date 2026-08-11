> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Apply Colors](./apply.md)

---

Apply solid colors to design elements like shapes, text, and backgrounds using CE.SDK's color system with support for RGB, CMYK, and spot colors.

![A rectangular block with a blue fill, red stroke, and pink drop shadow](https://img.ly/docs/cesdk/mac-catalyst/colors/apply-2211e3/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260811/engine-guides-colors-apply)

Colors in CE.SDK are applied to block properties like fill, stroke, and shadow using `engine.block.setColor`. The engine supports three color spaces: sRGB for screen display, CMYK for print production, and spot colors for specialized printing requirements.

```swift file=@cesdk_swift_examples/engine-guides-colors-apply/ApplyColors.swift reference-only
import IMGLYEngine

@MainActor
func applyColors(engine: Engine) async throws {
  // Demo scaffolding: a scene with a page and a single graphic block to recolor.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.rect))
  try engine.block.setFill(block, fill: engine.block.createFill(.color))
  try engine.block.setWidth(block, value: 400)
  try engine.block.setHeight(block, value: 300)
  try engine.block.setPositionX(block, value: 200)
  try engine.block.setPositionY(block, value: 150)
  try engine.block.appendChild(to: page, child: block)

  let rgbaBlue = Color.rgba(r: 0.0, g: 0.0, b: 1.0, a: 1.0)
  let cmykRed = Color.cmyk(c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0)
  let spotPink = Color.spot(name: "Pink-Flamingo", tint: 1.0, externalReference: "Brand-Colors")

  engine.editor.setSpotColor(name: "Pink-Flamingo", r: 1.0, g: 0.41, b: 0.71)
  engine.editor.setSpotColor(name: "Corporate-Blue", c: 1.0, m: 0.5, y: 0.0, k: 0.2)

  let fill = try engine.block.getFill(block)
  try engine.block.setColor(fill, property: "fill/color/value", color: rgbaBlue)

  try await engine.captureGuide(page, label: "after-fill")

  let currentFillColor: Color = try engine.block.getColor(fill, property: "fill/color/value")
  print("Current fill color: \(currentFillColor)")

  try engine.block.setStrokeEnabled(block, enabled: true)
  try engine.block.setStrokeWidth(block, width: 4)
  try engine.block.setColor(block, property: "stroke/color", color: cmykRed)

  try await engine.captureGuide(page, label: "after-stroke")

  try engine.block.setDropShadowEnabled(block, enabled: true)
  try engine.block.setDropShadowOffsetX(block, offsetX: 5)
  try engine.block.setDropShadowOffsetY(block, offsetY: 5)
  try engine.block.setColor(block, property: "dropShadow/color", color: spotPink)

  try await engine.captureGuide(page, label: "hero")

  let cmykFromRgb = try engine.editor.convertColorToColorSpace(color: rgbaBlue, colorSpace: .cmyk)
  let rgbFromCmyk = try engine.editor.convertColorToColorSpace(color: cmykRed, colorSpace: .sRGB)
  print("CMYK from RGB: \(cmykFromRgb)")
  print("RGB from CMYK: \(rgbFromCmyk)")

  let allSpotColors = engine.editor.findAllSpotColors()
  print("Defined spot colors: \(allSpotColors)")

  engine.editor.setSpotColor(name: "Pink-Flamingo", r: 1.0, g: 0.6, b: 0.8)

  try engine.editor.removeSpotColor(name: "Corporate-Blue")
}
```

This guide covers how to create color values in different color spaces, apply colors to fill, stroke, and shadow properties, work with spot colors including defining and managing them, and convert colors between color spaces.

## Create Color Objects

CE.SDK represents colors as a single `Color` enum with three cases — one per color space. Pick the case that matches your target output: `.rgba` for screens, `.cmyk` for print, or `.spot` for precise color matching.

```swift highlight-applyColors-createColors
let rgbaBlue = Color.rgba(r: 0.0, g: 0.0, b: 1.0, a: 1.0)
let cmykRed = Color.cmyk(c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0)
let spotPink = Color.spot(name: "Pink-Flamingo", tint: 1.0, externalReference: "Brand-Colors")
```

RGB colors use `r`, `g`, `b`, and `a` (alpha) values from `0.0` to `1.0`. CMYK colors take `c`, `m`, `y`, `k`, and a `tint` that controls overall intensity. Spot colors reference a definition by `name`, with optional `tint` and `externalReference` fields.

## Define Spot Colors

Before applying a spot color, define its screen preview approximation. The engine needs to know how to display the color since spot colors represent inks that can't be directly rendered on screens.

```swift highlight-applyColors-defineSpot
engine.editor.setSpotColor(name: "Pink-Flamingo", r: 1.0, g: 0.41, b: 0.71)
engine.editor.setSpotColor(name: "Corporate-Blue", c: 1.0, m: 0.5, y: 0.0, k: 0.2)
```

`engine.editor.setSpotColor(name:r:g:b:)` registers the RGB approximation; `engine.editor.setSpotColor(name:c:m:y:k:)` registers the CMYK approximation. A spot color can have both approximations defined at once. Neither method throws — they create the spot color if it doesn't yet exist or update it in place.

## Apply Fill Colors

To set a block's fill color, first get the fill block using `engine.block.getFill`, then apply the color using `engine.block.setColor` with the `"fill/color/value"` property path.

```swift highlight-applyColors-applyFill
let fill = try engine.block.getFill(block)
try engine.block.setColor(fill, property: "fill/color/value", color: rgbaBlue)
```

The fill is a separate block from the design block. Color properties live on the fill, not on the parent — applying `"fill/color/value"` to the parent throws.

## Read a Block's Current Color

Retrieve a block's current color using `engine.block.getColor`. The return type is `Color` — the same enum used when setting — so a single value carries its color space along with its components.

```swift highlight-applyColors-readColor
let currentFillColor: Color = try engine.block.getColor(fill, property: "fill/color/value")
print("Current fill color: \(currentFillColor)")
```

Swift's overload resolution can't pick between the deprecated `RGBA`-returning overload and the canonical `Color` one without help, so annotate the binding (`let currentFillColor: Color = ...`).

## Apply Stroke Colors

Stroke colors are applied directly to the design block using the `"stroke/color"` property. Enable the stroke first with `engine.block.setStrokeEnabled`; without it, the color is set but nothing visible renders.

```swift highlight-applyColors-applyStroke
try engine.block.setStrokeEnabled(block, enabled: true)
try engine.block.setStrokeWidth(block, width: 4)
try engine.block.setColor(block, property: "stroke/color", color: cmykRed)
```

The stroke renders around the edges of the block in the specified color. Use `engine.block.setStrokeWidth` to control the line thickness.

## Apply Shadow Colors

Drop shadow colors use the `"dropShadow/color"` property on the design block. Enable shadows first using `engine.block.setDropShadowEnabled`.

```swift highlight-applyColors-applyShadow
try engine.block.setDropShadowEnabled(block, enabled: true)
try engine.block.setDropShadowOffsetX(block, offsetX: 5)
try engine.block.setDropShadowOffsetY(block, offsetY: 5)
try engine.block.setColor(block, property: "dropShadow/color", color: spotPink)
```

Control the shadow position with `setDropShadowOffsetX` and `setDropShadowOffsetY`. Spot colors work with shadows just like RGB or CMYK colors.

## Convert Between Color Spaces

Use `engine.editor.convertColorToColorSpace` to convert any color to a different color space. The target `ColorSpace` enum has `.sRGB`, `.cmyk`, and `.spotColor` cases.

```swift highlight-applyColors-convertColor
let cmykFromRgb = try engine.editor.convertColorToColorSpace(color: rgbaBlue, colorSpace: .cmyk)
let rgbFromCmyk = try engine.editor.convertColorToColorSpace(color: cmykRed, colorSpace: .sRGB)
print("CMYK from RGB: \(cmykFromRgb)")
print("RGB from CMYK: \(rgbFromCmyk)")
```

Spot colors convert to their defined approximation in the target space. Color conversions are approximations — CMYK has a smaller gamut than sRGB, so vibrant colors may appear muted after conversion.

## List Defined Spot Colors

Query every spot color currently defined in the editor using `engine.editor.findAllSpotColors`. The method returns the spot color names as an array of strings.

```swift highlight-applyColors-listSpot
let allSpotColors = engine.editor.findAllSpotColors()
print("Defined spot colors: \(allSpotColors)")
```

This is useful for building color pickers or validating that required spot colors are defined before export.

## Update Spot Color Definitions

Redefine a spot color's approximation by calling `setSpotColor` again with the same name. All blocks referencing that spot color automatically update their rendered appearance.

```swift highlight-applyColors-updateSpot
engine.editor.setSpotColor(name: "Pink-Flamingo", r: 1.0, g: 0.6, b: 0.8)
```

This lets you adjust how a spot color appears on screen without touching every block that uses it.

## Remove Spot Color Definitions

Remove a spot color definition using `engine.editor.removeSpotColor`. Blocks still referencing that color fall back to the default magenta approximation, which is a visual cue that something is missing.

```swift highlight-applyColors-removeSpot
try engine.editor.removeSpotColor(name: "Corporate-Blue")
```

This is useful when cleaning up unused spot colors or signaling that a spot color is no longer valid.

## Troubleshooting

### Spot Color Appears Magenta

The spot color wasn't defined before use. Call `setSpotColor(name:r:g:b:)` or `setSpotColor(name:c:m:y:k:)` with the exact spot color name before applying it to a block.

### Stroke or Shadow Color Not Visible

The effect isn't enabled. Call `setStrokeEnabled(_:enabled:)` or `setDropShadowEnabled(_:enabled:)` before setting the color.

### Color Looks Different After Conversion

Color space conversions are approximations. CMYK has a smaller gamut than sRGB, so vibrant colors may appear muted after conversion.

### Can't Apply Color to Fill

Apply colors to the fill block returned from `getFill`, not the parent design block. The fill is a separate block with its own `"fill/color/value"` property.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.setColor(_:property:color:)` | Set a color property on a block |
| `engine.block.getColor(_:property:)` | Get a color property from a block (annotate return as `Color`) |
| `engine.block.getFill(_:)` | Get the fill block of a design block |
| `engine.block.setStrokeEnabled(_:enabled:)` | Enable or disable stroke on a block |
| `engine.block.setStrokeWidth(_:width:)` | Set stroke thickness |
| `engine.block.setDropShadowEnabled(_:enabled:)` | Enable or disable drop shadow on a block |
| `engine.editor.setSpotColor(name:r:g:b:)` | Define a spot color with RGB approximation |
| `engine.editor.setSpotColor(name:c:m:y:k:)` | Define a spot color with CMYK approximation |
| `engine.editor.findAllSpotColors()` | List every defined spot color |
| `engine.editor.removeSpotColor(name:)` | Remove a spot color definition |
| `engine.editor.convertColorToColorSpace(color:colorSpace:)` | Convert a color to a different color space |



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support