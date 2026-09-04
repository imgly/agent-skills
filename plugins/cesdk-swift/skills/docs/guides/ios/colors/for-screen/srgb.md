> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Colors](../../colors.md) > [For Screen](../for-screen.md) > [sRGB Colors](./srgb.md)

---

Apply sRGB colors to design elements for screen-based output using RGBA values with red, green, blue, and alpha components.

![A blue rectangle with a red stroke and a semi-transparent black drop shadow](https://img.ly/docs/cesdk/ios/colors/for-screen/srgb-e6f59b/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260904/engine-guides-colors-for-screen-srgb)

sRGB is the standard color space for screen displays. CE.SDK represents sRGB colors with the `Color.rgba` case, where each component uses floating-point values between `0.0` and `1.0` — not the traditional `0`–`255` integer range used in many design tools.

```swift file=@cesdk_swift_examples/engine-guides-colors-for-screen-srgb/SrgbColors.swift reference-only
import IMGLYEngine

@MainActor
func srgbColors(engine: Engine) async throws {
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

  let rgbaBlue = Color.rgba(r: 0.2, g: 0.4, b: 0.9)
  let rgbaRed = Color.rgba(r: 0.85, g: 0.1, b: 0.1, a: 1.0)

  let semiTransparentBlack = Color.rgba(r: 0.0, g: 0.0, b: 0.0, a: 0.5)

  let fill = try engine.block.getFill(block)
  try engine.block.setColor(fill, property: "fill/color/value", color: rgbaBlue)

  try await engine.captureGuide(page, label: "after-fill")

  try engine.block.setStrokeEnabled(block, enabled: true)
  try engine.block.setStrokeWidth(block, width: 8)
  try engine.block.setColor(block, property: "stroke/color", color: rgbaRed)

  try await engine.captureGuide(page, label: "after-stroke")

  try engine.block.setDropShadowEnabled(block, enabled: true)
  try engine.block.setDropShadowOffsetX(block, offsetX: 15)
  try engine.block.setDropShadowOffsetY(block, offsetY: 15)
  try engine.block.setColor(block, property: "dropShadow/color", color: semiTransparentBlack)

  try await engine.captureGuide(page, label: "hero")

  let currentColor: Color = try engine.block.getColor(fill, property: "fill/color/value")
  print("Current fill color: \(currentColor)")

  if case let .rgba(r, g, b, a) = currentColor {
    print("sRGB color - r: \(r), g: \(g), b: \(b), a: \(a)")
  }

  let cmykOrange = Color.cmyk(c: 0.0, m: 0.5, y: 1.0, k: 0.0, tint: 1.0)
  let convertedToSrgb = try engine.editor.convertColorToColorSpace(color: cmykOrange, colorSpace: .sRGB)
  print("CMYK converted to sRGB: \(convertedToSrgb)")
}
```

This guide covers creating RGBA color values, working with transparency, applying them to fills, strokes, and shadows, retrieving colors from elements, identifying RGBA colors, and converting other color spaces to sRGB.

## Creating sRGB Colors Programmatically

Create an sRGB color using `Color.rgba`. All four components (`r`, `g`, `b`, `a`) take floating-point values from `0.0` to `1.0`.

```swift highlight-srgbColors-createRgba
let rgbaBlue = Color.rgba(r: 0.2, g: 0.4, b: 0.9)
let rgbaRed = Color.rgba(r: 0.85, g: 0.1, b: 0.1, a: 1.0)
```

The `a` parameter defaults to `1.0`, so you can omit it for fully opaque colors.

## Working with Transparency

The alpha component controls transparency: `1.0` is fully opaque and `0.0` is fully transparent. Use values in between for overlays and layered effects.

```swift highlight-srgbColors-createTransparent
let semiTransparentBlack = Color.rgba(r: 0.0, g: 0.0, b: 0.0, a: 0.5)
```

## Applying sRGB Colors to Fills

To color a block's fill, first get the fill block with `engine.block.getFill`, then call `engine.block.setColor` with the `"fill/color/value"` property path.

```swift highlight-srgbColors-applyFill
let fill = try engine.block.getFill(block)
try engine.block.setColor(fill, property: "fill/color/value", color: rgbaBlue)
```

The fill is a separate block from the design block. Color properties live on the fill, not on the parent — applying `"fill/color/value"` to the parent throws.

## Applying sRGB Colors to Strokes

Stroke colors are applied directly to the design block using the `"stroke/color"` property path. Enable the stroke first with `setStrokeEnabled`; without it, the color is stored but nothing visible renders.

```swift highlight-srgbColors-applyStroke
try engine.block.setStrokeEnabled(block, enabled: true)
try engine.block.setStrokeWidth(block, width: 8)
try engine.block.setColor(block, property: "stroke/color", color: rgbaRed)
```

Use `setStrokeWidth` to control the line thickness.

## Applying sRGB Colors to Shadows

Drop shadow colors use the `"dropShadow/color"` property on the design block. Enable shadows first with `setDropShadowEnabled`.

```swift highlight-srgbColors-applyShadow
try engine.block.setDropShadowEnabled(block, enabled: true)
try engine.block.setDropShadowOffsetX(block, offsetX: 15)
try engine.block.setDropShadowOffsetY(block, offsetY: 15)
try engine.block.setColor(block, property: "dropShadow/color", color: semiTransparentBlack)
```

Control the shadow position with `setDropShadowOffsetX` and `setDropShadowOffsetY`. A semi-transparent black creates a natural shadow effect.

## Retrieving Colors from Elements

Read a block's current color with `engine.block.getColor`. The return type is `Color` — the same enum used when setting — so a single value carries its color space along with its components.

```swift highlight-srgbColors-getColor
let currentColor: Color = try engine.block.getColor(fill, property: "fill/color/value")
print("Current fill color: \(currentColor)")
```

Swift's overload resolution can't pick between the deprecated `RGBA`-returning overload and the canonical `Color` one without help, so annotate the binding (`let currentColor: Color = ...`).

## Identifying sRGB Colors

Swift's `Color` is an enum with one case per color space. Use pattern matching against `.rgba` to check whether a color is sRGB and read out its components.

```swift highlight-srgbColors-identifyRgba
if case let .rgba(r, g, b, a) = currentColor {
  print("sRGB color - r: \(r), g: \(g), b: \(b), a: \(a)")
}
```

## Converting Colors to sRGB

Use `engine.editor.convertColorToColorSpace` to convert CMYK or spot colors to sRGB for screen display.

```swift highlight-srgbColors-convertToSrgb
let cmykOrange = Color.cmyk(c: 0.0, m: 0.5, y: 1.0, k: 0.0, tint: 1.0)
let convertedToSrgb = try engine.editor.convertColorToColorSpace(color: cmykOrange, colorSpace: .sRGB)
print("CMYK converted to sRGB: \(convertedToSrgb)")
```

Color conversions are approximations because CMYK has a smaller gamut than sRGB, so vibrant colors may appear muted after conversion.

## Troubleshooting

### `getColor` Does Not Compile

Annotate the binding as `Color` so Swift picks the canonical overload instead of the deprecated `RGBA`-returning one: `let currentColor: Color = try engine.block.getColor(fill, property: "fill/color/value")`.

## API Reference

| Method | Description |
|--------|-------------|
| `Color.rgba(r:g:b:a:)` | Create an sRGB color from `0.0`–`1.0` components |
| `engine.block.setColor(_:property:color:)` | Apply a color to a block property |
| `engine.block.getColor(_:property:)` | Read the current color from a block property (annotate as `Color`) |
| `engine.block.getFill(_:)` | Get the fill block of a design block |
| `engine.block.setStrokeEnabled(_:enabled:)` | Enable or disable stroke on a block |
| `engine.block.setStrokeWidth(_:width:)` | Set stroke thickness |
| `engine.block.setDropShadowEnabled(_:enabled:)` | Enable or disable drop shadow on a block |
| `engine.editor.convertColorToColorSpace(color:colorSpace:)` | Convert a color to a different color space |

## Next Steps

- [CMYK Colors](../for-print/cmyk.md) — Work with CMYK for print workflows
- [Spot Colors](../for-print/spot.md) — Use named spot colors for brand consistency
- [Color Conversion](../conversion.md) — Convert colors between sRGB, CMYK, and spot color spaces
- [Apply Colors](../apply.md) — Comprehensive color application guide



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support