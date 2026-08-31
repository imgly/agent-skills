> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Colors](../../colors.md) > [For Print](../for-print.md) > [CMYK Colors](./cmyk.md)

---

```swift file=@cesdk_swift_examples/engine-guides-colors-for-print-cmyk/CMYKColors.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func cmykColors(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // CMYK components (c, m, y, k) and tint all range from 0.0 to 1.0.
  let cmykCyan = Color.cmyk(c: 1.0, m: 0.0, y: 0.0, k: 0.0, tint: 1.0)
  let cmykMagenta = Color.cmyk(c: 0.0, m: 1.0, y: 0.0, k: 0.0, tint: 1.0)
  let cmykYellow = Color.cmyk(c: 0.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0)
  let cmykBlack = Color.cmyk(c: 0.0, m: 0.0, y: 0.0, k: 1.0, tint: 1.0)

  // Create a graphic block, attach a color fill, then assign a CMYK color.
  // The same setColor call works for any CMYK value.
  for cmykColor in [cmykCyan, cmykMagenta, cmykYellow, cmykBlack] {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(block, value: 150)
    try engine.block.setHeight(block, value: 150)
    try engine.block.appendChild(to: page, child: block)

    let fill = try engine.block.createFill(.color)
    try engine.block.setFill(block, fill: fill)
    try engine.block.setColor(fill, property: "fill/color/value", color: cmykColor)
  }

  // The tint value scales color intensity without changing the CMYK components.
  // On screen, a tint below 1.0 is rendered as transparency.
  let tintedBlock = try engine.block.create(.graphic)
  try engine.block.setShape(tintedBlock, shape: engine.block.createShape(.rect))
  try engine.block.appendChild(to: page, child: tintedBlock)
  let tintedFill = try engine.block.createFill(.color)
  try engine.block.setFill(tintedBlock, fill: tintedFill)

  let cmykHalfMagenta = Color.cmyk(c: 0.0, m: 1.0, y: 0.0, k: 0.0, tint: 0.5)
  try engine.block.setColor(tintedFill, property: "fill/color/value", color: cmykHalfMagenta)

  // Enable the stroke and set its width before applying a CMYK color.
  let strokeBlock = try engine.block.create(.graphic)
  try engine.block.setShape(strokeBlock, shape: engine.block.createShape(.rect))
  try engine.block.appendChild(to: page, child: strokeBlock)

  try engine.block.setStrokeEnabled(strokeBlock, enabled: true)
  try engine.block.setStrokeWidth(strokeBlock, width: 8)
  let cmykStrokeColor = Color.cmyk(c: 0.8, m: 0.2, y: 0.0, k: 0.1, tint: 1.0)
  try engine.block.setColor(strokeBlock, property: "stroke/color", color: cmykStrokeColor)

  // Enable the drop shadow before applying a CMYK color.
  let shadowBlock = try engine.block.create(.graphic)
  try engine.block.setShape(shadowBlock, shape: engine.block.createShape(.rect))
  try engine.block.appendChild(to: page, child: shadowBlock)

  try engine.block.setDropShadowEnabled(shadowBlock, enabled: true)
  let cmykShadowColor = Color.cmyk(c: 0.0, m: 0.0, y: 0.0, k: 0.6, tint: 0.8)
  try engine.block.setColor(shadowBlock, property: "dropShadow/color", color: cmykShadowColor)

  // getColor returns a Color enum. Use pattern matching to inspect the CMYK components.
  let readBlock = try engine.block.create(.graphic)
  try engine.block.setShape(readBlock, shape: engine.block.createShape(.rect))
  try engine.block.appendChild(to: page, child: readBlock)
  let readFill = try engine.block.createFill(.color)
  try engine.block.setFill(readBlock, fill: readFill)

  let cmykOrange = Color.cmyk(c: 0.0, m: 0.5, y: 1.0, k: 0.0, tint: 1.0)
  try engine.block.setColor(readFill, property: "fill/color/value", color: cmykOrange)

  let retrievedColor: Color = try engine.block.getColor(readFill, property: "fill/color/value")
  if case let .cmyk(c, m, y, k, tint) = retrievedColor {
    print("CMYK Color - C: \(c), M: \(m), Y: \(y), K: \(k), Tint: \(tint)")
  }

  // Convert between sRGB and CMYK using the editor API. Conversions are not
  // perfectly reversible because the color gamuts differ.
  let rgbBlue = Color.rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0)
  let convertedCmyk = try engine.editor.convertColorToColorSpace(color: rgbBlue, colorSpace: .cmyk)
  print("RGB to CMYK conversion: \(convertedCmyk)")

  let cmykGreen = Color.cmyk(c: 0.7, m: 0.0, y: 1.0, k: 0.2, tint: 1.0)
  let convertedRgb = try engine.editor.convertColorToColorSpace(color: cmykGreen, colorSpace: .sRGB)
  print("CMYK to RGB conversion: \(convertedRgb)")

  // CMYK colors can be used in any gradient color stop.
  let gradientBlock = try engine.block.create(.graphic)
  try engine.block.setShape(gradientBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(gradientBlock, value: 320)
  try engine.block.setHeight(gradientBlock, value: 150)
  try engine.block.appendChild(to: page, child: gradientBlock)

  let gradientFill = try engine.block.createFill(.linearGradient)
  try engine.block.setFill(gradientBlock, fill: gradientFill)

  try engine.block.setGradientColorStops(
    gradientFill,
    property: "fill/gradient/colors",
    colors: [
      GradientColorStop(color: .cmyk(c: 1.0, m: 0.0, y: 0.0, k: 0.0, tint: 1.0), stop: 0.0),
      GradientColorStop(color: .cmyk(c: 0.0, m: 1.0, y: 0.0, k: 0.0, tint: 1.0), stop: 0.5),
      GradientColorStop(color: .cmyk(c: 0.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0), stop: 1.0),
    ],
  )
}
```

Work with CMYK colors in CE.SDK for professional print production workflows with support for color space conversion and tint control.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-rc.0/engine-guides-colors-for-print-cmyk)

CMYK (Cyan, Magenta, Yellow, Key/Black) is the standard color model for print production. Unlike sRGB, which is additive and designed for screens, CMYK uses subtractive color mixing to represent how inks combine on paper. CE.SDK represents CMYK as a case of the `Color` enum, so the same `setColor` and `getColor` APIs work across all color spaces.

This guide covers how to create CMYK colors, apply them to fills, strokes, and drop shadows, use the `tint` value, read colors back, convert between color spaces, and use CMYK in gradients.

## Understanding CMYK Colors

### When to Use CMYK

Use CMYK colors when preparing designs for commercial printing or when print service providers require CMYK values. Screen displays convert CMYK to RGB for preview, but exported PDFs preserve CMYK information for accurate print reproduction.

A CMYK color in CE.SDK has five properties:

- `c` (Cyan): 0.0 to 1.0
- `m` (Magenta): 0.0 to 1.0
- `y` (Yellow): 0.0 to 1.0
- `k` (Key/Black): 0.0 to 1.0
- `tint`: 0.0 to 1.0 (controls overall color intensity, rendered as transparency on screen)

## Creating CMYK Colors

Create a CMYK color with `Color.cmyk(c:m:y:k:tint:)`. Every component ranges from 0.0 to 1.0.

```swift highlight-cmykColors-create
// CMYK components (c, m, y, k) and tint all range from 0.0 to 1.0.
let cmykCyan = Color.cmyk(c: 1.0, m: 0.0, y: 0.0, k: 0.0, tint: 1.0)
let cmykMagenta = Color.cmyk(c: 0.0, m: 1.0, y: 0.0, k: 0.0, tint: 1.0)
let cmykYellow = Color.cmyk(c: 0.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0)
let cmykBlack = Color.cmyk(c: 0.0, m: 0.0, y: 0.0, k: 1.0, tint: 1.0)
```

## Applying CMYK Colors to Fills

Apply a CMYK color to a color fill using `engine.block.setColor(_:property:color:)` on the fill with the `"fill/color/value"` property path.

```swift highlight-cmykColors-applyFill
  // Create a graphic block, attach a color fill, then assign a CMYK color.
  // The same setColor call works for any CMYK value.
  for cmykColor in [cmykCyan, cmykMagenta, cmykYellow, cmykBlack] {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(block, value: 150)
    try engine.block.setHeight(block, value: 150)
    try engine.block.appendChild(to: page, child: block)

    let fill = try engine.block.createFill(.color)
    try engine.block.setFill(block, fill: fill)
    try engine.block.setColor(fill, property: "fill/color/value", color: cmykColor)
  }
```

The same method works for any `Color` case — `.rgba`, `.cmyk`, or `.spot` — so you do not need a separate code path for each color space.

## Using the Tint Property

The `tint` value scales the color's intensity without changing its CMYK components. A tint of 1.0 applies the full color; 0.5 scales it down.

```swift highlight-cmykColors-tint
  // The tint value scales color intensity without changing the CMYK components.
  // On screen, a tint below 1.0 is rendered as transparency.
  let tintedBlock = try engine.block.create(.graphic)
  try engine.block.setShape(tintedBlock, shape: engine.block.createShape(.rect))
  try engine.block.appendChild(to: page, child: tintedBlock)
  let tintedFill = try engine.block.createFill(.color)
  try engine.block.setFill(tintedBlock, fill: tintedFill)

  let cmykHalfMagenta = Color.cmyk(c: 0.0, m: 1.0, y: 0.0, k: 0.0, tint: 0.5)
  try engine.block.setColor(tintedFill, property: "fill/color/value", color: cmykHalfMagenta)
```

> **Note:** When rendered on screen, the tint is applied as transparency. During PDF export, CMYK colors are currently converted to RGB and the tint is retained in the alpha channel.

## Applying CMYK to Strokes

Enable the stroke and set its width, then assign a CMYK color to the `"stroke/color"` property on the block.

```swift highlight-cmykColors-stroke
  // Enable the stroke and set its width before applying a CMYK color.
  let strokeBlock = try engine.block.create(.graphic)
  try engine.block.setShape(strokeBlock, shape: engine.block.createShape(.rect))
  try engine.block.appendChild(to: page, child: strokeBlock)

  try engine.block.setStrokeEnabled(strokeBlock, enabled: true)
  try engine.block.setStrokeWidth(strokeBlock, width: 8)
  let cmykStrokeColor = Color.cmyk(c: 0.8, m: 0.2, y: 0.0, k: 0.1, tint: 1.0)
  try engine.block.setColor(strokeBlock, property: "stroke/color", color: cmykStrokeColor)
```

## Applying CMYK to Drop Shadows

Enable the drop shadow, then assign a CMYK color to the `"dropShadow/color"` property. Configure offset and blur radius with the usual drop shadow APIs as needed.

```swift highlight-cmykColors-shadow
  // Enable the drop shadow before applying a CMYK color.
  let shadowBlock = try engine.block.create(.graphic)
  try engine.block.setShape(shadowBlock, shape: engine.block.createShape(.rect))
  try engine.block.appendChild(to: page, child: shadowBlock)

  try engine.block.setDropShadowEnabled(shadowBlock, enabled: true)
  let cmykShadowColor = Color.cmyk(c: 0.0, m: 0.0, y: 0.0, k: 0.6, tint: 0.8)
  try engine.block.setColor(shadowBlock, property: "dropShadow/color", color: cmykShadowColor)
```

## Reading CMYK Colors

`engine.block.getColor(_:property:)` returns a `Color` enum value. Use pattern matching to extract the CMYK components.

```swift highlight-cmykColors-read
  // getColor returns a Color enum. Use pattern matching to inspect the CMYK components.
  let readBlock = try engine.block.create(.graphic)
  try engine.block.setShape(readBlock, shape: engine.block.createShape(.rect))
  try engine.block.appendChild(to: page, child: readBlock)
  let readFill = try engine.block.createFill(.color)
  try engine.block.setFill(readBlock, fill: readFill)

  let cmykOrange = Color.cmyk(c: 0.0, m: 0.5, y: 1.0, k: 0.0, tint: 1.0)
  try engine.block.setColor(readFill, property: "fill/color/value", color: cmykOrange)

  let retrievedColor: Color = try engine.block.getColor(readFill, property: "fill/color/value")
  if case let .cmyk(c, m, y, k, tint) = retrievedColor {
    print("CMYK Color - C: \(c), M: \(m), Y: \(y), K: \(k), Tint: \(tint)")
  }
```

Swift's exhaustive enum matching replaces the type-guard helpers used on other platforms. The associated values are available directly inside the matched case.

## Converting Between Color Spaces

Use `engine.editor.convertColorToColorSpace(color:colorSpace:)` with `ColorSpace.cmyk` or `ColorSpace.sRGB` to convert between color spaces.

```swift highlight-cmykColors-convert
  // Convert between sRGB and CMYK using the editor API. Conversions are not
  // perfectly reversible because the color gamuts differ.
  let rgbBlue = Color.rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0)
  let convertedCmyk = try engine.editor.convertColorToColorSpace(color: rgbBlue, colorSpace: .cmyk)
  print("RGB to CMYK conversion: \(convertedCmyk)")

  let cmykGreen = Color.cmyk(c: 0.7, m: 0.0, y: 1.0, k: 0.2, tint: 1.0)
  let convertedRgb = try engine.editor.convertColorToColorSpace(color: cmykGreen, colorSpace: .sRGB)
  print("CMYK to RGB conversion: \(convertedRgb)")
```

Conversions may not be perfectly reversible because RGB and CMYK have different color gamuts. Some sRGB colors cannot be represented exactly in CMYK and vice versa.

## Using CMYK in Gradients

CMYK colors work in gradient color stops. Create a linear gradient fill and pass `GradientColorStop` values whose `color` is a `Color.cmyk` case.

```swift highlight-cmykColors-gradient
  // CMYK colors can be used in any gradient color stop.
  let gradientBlock = try engine.block.create(.graphic)
  try engine.block.setShape(gradientBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(gradientBlock, value: 320)
  try engine.block.setHeight(gradientBlock, value: 150)
  try engine.block.appendChild(to: page, child: gradientBlock)

  let gradientFill = try engine.block.createFill(.linearGradient)
  try engine.block.setFill(gradientBlock, fill: gradientFill)

  try engine.block.setGradientColorStops(
    gradientFill,
    property: "fill/gradient/colors",
    colors: [
      GradientColorStop(color: .cmyk(c: 1.0, m: 0.0, y: 0.0, k: 0.0, tint: 1.0), stop: 0.0),
      GradientColorStop(color: .cmyk(c: 0.0, m: 1.0, y: 0.0, k: 0.0, tint: 1.0), stop: 0.5),
      GradientColorStop(color: .cmyk(c: 0.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0), stop: 1.0),
    ],
  )
```

## Troubleshooting

### Colors Look Different on Screen vs. Print

Screen previews convert CMYK to RGB using a standard conversion. For accurate color proofing, use calibrated monitors and print proofs from your production workflow.

### Tint Not Having the Expected Effect

The `tint` value must be between 0.0 and 1.0. On screen, it is rendered as transparency, so values below 1.0 make the color appear more translucent rather than lighter.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.setColor(_:property:color:)` | Set a color property on a block. Accepts any `Color` case. |
| `engine.block.getColor(_:property:)` | Get the current color value from a property. Returns a `Color` enum. |
| `engine.editor.convertColorToColorSpace(color:colorSpace:)` | Convert a color between `ColorSpace.sRGB` and `ColorSpace.cmyk`. |
| `engine.block.createFill(_:)` | Create a fill. Use `.color` for solid fills or `.linearGradient` for gradients. |
| `engine.block.setFill(_:fill:)` | Assign a fill to a block. |
| `engine.block.setGradientColorStops(_:property:colors:)` | Set color stops on a gradient fill. |

| Type | Description |
|------|-------------|
| `Color.cmyk(c:m:y:k:tint:)` | CMYK color for print. Components and tint range 0.0–1.0. |
| `ColorSpace.cmyk` / `ColorSpace.sRGB` | Target color space for `convertColorToColorSpace`. |
| `GradientColorStop` | Gradient stop with a `color: Color` and a `stop: Float` position. |

## Next Steps

- [Spot Colors](./spot.md) — Work with named spot colors for brand consistency and specialized printing
- [Color Conversion](../conversion.md) — Convert colors between sRGB, CMYK, and spot color spaces
- [Apply Colors](../apply.md) — Apply colors to design elements programmatically



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support