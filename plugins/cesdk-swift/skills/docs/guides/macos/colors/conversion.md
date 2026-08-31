> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Color Conversion](./conversion.md)

---

```swift file=@cesdk_swift_examples/engine-guides-color-conversion/ColorConversion.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func colorConversion(engine: Engine) async throws {
  engine.editor.setSpotColor(name: "Brand Red", r: 0.8, g: 0.1, b: 0.1)
  engine.editor.setSpotColor(name: "Brand Red", c: 0.0, m: 0.95, y: 0.95, k: 0.1)

  let cmykCyan = Color.cmyk(c: 1.0, m: 0.0, y: 0.0, k: 0.0, tint: 1.0)
  let cyanAsSrgb = try engine.editor.convertColorToColorSpace(color: cmykCyan, colorSpace: .sRGB)
  print("CMYK cyan as sRGB: \(cyanAsSrgb)")

  let srgbRed = Color.rgba(r: 1.0, g: 0.0, b: 0.0, a: 1.0)
  let redAsCmyk = try engine.editor.convertColorToColorSpace(color: srgbRed, colorSpace: .cmyk)
  print("sRGB red as CMYK: \(redAsCmyk)")

  let spot = Color.spot(name: "Brand Red", tint: 1.0, externalReference: "")
  let spotAsSrgb = try engine.editor.convertColorToColorSpace(color: spot, colorSpace: .sRGB)
  let spotAsCmyk = try engine.editor.convertColorToColorSpace(color: spot, colorSpace: .cmyk)
  print("Spot 'Brand Red' as sRGB: \(spotAsSrgb)")
  print("Spot 'Brand Red' as CMYK: \(spotAsCmyk)")

  let unknown: Color = redAsCmyk
  switch unknown {
  case let .rgba(r, g, b, a):
    print("sRGB: r=\(r), g=\(g), b=\(b), a=\(a)")
  case let .cmyk(c, m, y, k, tint):
    print("CMYK: c=\(c), m=\(m), y=\(y), k=\(k), tint=\(tint)")
  case let .spot(name, tint, externalReference):
    print("Spot: name=\(name), tint=\(tint), ref=\(externalReference)")
  @unknown default:
    print("Unknown color space")
  }

  let space: ColorSpace = unknown.colorSpace
  print("Color space: \(space)")

  // Build display values for a custom color picker. The input would normally
  // come from `engine.block.getColor`; here a literal stands in for a real
  // block color.
  let pickerInput: Color = .cmyk(c: 0.5, m: 0.0, y: 1.0, k: 0.0, tint: 1.0)
  let pickerSrgb = try engine.editor.convertColorToColorSpace(color: pickerInput, colorSpace: .sRGB)
  if case let .rgba(r, g, b, _) = pickerSrgb {
    print("R: \(Int(r * 255)), G: \(Int(g * 255)), B: \(Int(b * 255))")
  }

  // Before PDF export, ensure each color is in CMYK. Skip conversion when it
  // already is.
  let exportInput: Color = .rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0)
  if case .cmyk = exportInput {
    print("Already CMYK: \(exportInput)")
  } else {
    let cmyk = try engine.editor.convertColorToColorSpace(color: exportInput, colorSpace: .cmyk)
    print("Converted to CMYK: \(cmyk)")
  }
}
```

Convert colors between sRGB, CMYK, and spot color spaces programmatically in CE.SDK.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-color-conversion)

CE.SDK supports three color spaces: sRGB, CMYK, and Spot Color. When building color interfaces or preparing designs for export, you may need to convert colors between these spaces. The engine handles the mathematical conversion automatically through the `convertColorToColorSpace(color:colorSpace:)` API.

This guide covers how to convert colors between sRGB and CMYK, handle spot color conversions, identify color types with enum pattern matching, and understand how tint and alpha values are preserved during conversion.

## Supported Color Spaces

CE.SDK supports conversion between three color spaces. Each is represented as a case of the `Color` enum:

| Color Space | Swift Case | Use Case |
|-------------|------------|----------|
| **sRGB** | `Color.rgba(r:g:b:a:)` (0.0-1.0) | Screen display |
| **CMYK** | `Color.cmyk(c:m:y:k:tint:)` (0.0-1.0) | Print workflows |
| **Spot Color** | `Color.spot(name:tint:externalReference:)` | Specialized printing |

The `ColorSpace` enum identifies the target of a conversion. Its cases are `.sRGB`, `.cmyk`, and `.spotColor`.

## Setting Up Colors

Construct a color value directly with the appropriate `Color` enum case:

- An sRGB color uses `Color.rgba(r:g:b:a:)`, where alpha controls transparency.
- A CMYK color uses `Color.cmyk(c:m:y:k:tint:)`, where tint controls intensity.
- A spot color uses `Color.spot(name:tint:externalReference:)` and references a name defined on the editor.

Before converting a spot color, define its RGB or CMYK approximation. The approximation is also used when the spot color is rendered on screen.

```swift highlight-colorConversion-defineSpot
engine.editor.setSpotColor(name: "Brand Red", r: 0.8, g: 0.1, b: 0.1)
engine.editor.setSpotColor(name: "Brand Red", c: 0.0, m: 0.95, y: 0.95, k: 0.1)
```

You can call both overloads of `setSpotColor` for the same name so the spot color converts cleanly into either target space.

## Converting to sRGB

Use `engine.editor.convertColorToColorSpace(color:colorSpace:)` with `colorSpace: .sRGB` to convert any color to sRGB. The method throws if the conversion fails.

```swift highlight-colorConversion-toSrgb
let cmykCyan = Color.cmyk(c: 1.0, m: 0.0, y: 0.0, k: 0.0, tint: 1.0)
let cyanAsSrgb = try engine.editor.convertColorToColorSpace(color: cmykCyan, colorSpace: .sRGB)
print("CMYK cyan as sRGB: \(cyanAsSrgb)")
```

When converting CMYK or spot colors to sRGB, the engine returns a `Color.rgba` value. The tint value from CMYK or spot colors becomes the alpha value in the returned sRGB color.

## Converting to CMYK

Use `engine.editor.convertColorToColorSpace(color:colorSpace:)` with `colorSpace: .cmyk` to convert any color to CMYK. This is essential for print workflows where colors must be in the correct space before export.

```swift highlight-colorConversion-toCmyk
let srgbRed = Color.rgba(r: 1.0, g: 0.0, b: 0.0, a: 1.0)
let redAsCmyk = try engine.editor.convertColorToColorSpace(color: srgbRed, colorSpace: .cmyk)
print("sRGB red as CMYK: \(redAsCmyk)")
```

When converting sRGB colors to CMYK, the alpha value becomes the tint value of the returned CMYK color. For spot colors, define a CMYK approximation with `setSpotColor(name:c:m:y:k:)` before converting.

> **Note:** Color space conversions may not be perfectly reversible. Some sRGB colors cannot be exactly represented in CMYK due to different color gamuts.

Spot colors convert into both target spaces using the approximations you registered above:

```swift highlight-colorConversion-spotConvert
let spot = Color.spot(name: "Brand Red", tint: 1.0, externalReference: "")
let spotAsSrgb = try engine.editor.convertColorToColorSpace(color: spot, colorSpace: .sRGB)
let spotAsCmyk = try engine.editor.convertColorToColorSpace(color: spot, colorSpace: .cmyk)
print("Spot 'Brand Red' as sRGB: \(spotAsSrgb)")
print("Spot 'Brand Red' as CMYK: \(spotAsCmyk)")
```

## Identifying Color Types

Before converting a color, you may need to know which color space it currently uses. Swift's enum pattern matching makes this straightforward — use a `switch` statement to handle each `Color` case, or check the `colorSpace` property when you only need the type.

```swift highlight-colorConversion-identify
  let unknown: Color = redAsCmyk
  switch unknown {
  case let .rgba(r, g, b, a):
    print("sRGB: r=\(r), g=\(g), b=\(b), a=\(a)")
  case let .cmyk(c, m, y, k, tint):
    print("CMYK: c=\(c), m=\(m), y=\(y), k=\(k), tint=\(tint)")
  case let .spot(name, tint, externalReference):
    print("Spot: name=\(name), tint=\(tint), ref=\(externalReference)")
  @unknown default:
    print("Unknown color space")
  }

  let space: ColorSpace = unknown.colorSpace
  print("Color space: \(space)")
```

The `colorSpace` property returns a `ColorSpace` enum value (`.sRGB`, `.cmyk`, or `.spotColor`) without unpacking the underlying components.

## Handling Tint and Alpha

The tint and alpha values represent transparency in different color spaces:

| Source | Target | Transformation |
|--------|--------|----------------|
| sRGB (alpha) | CMYK | Alpha becomes tint |
| CMYK (tint) | sRGB | Tint becomes alpha |
| Spot (tint) | sRGB | Tint becomes alpha |
| Spot (tint) | CMYK | Tint is preserved |

## Practical Use Cases

### Building a Color Picker

When displaying a color value retrieved from a block with `engine.block.getColor(_:property:)`, convert it to sRGB to show RGB components in a custom picker. Pattern-matching on the returned `.rgba` case unpacks the components for display.

```swift highlight-colorConversion-colorPicker
// Build display values for a custom color picker. The input would normally
// come from `engine.block.getColor`; here a literal stands in for a real
// block color.
let pickerInput: Color = .cmyk(c: 0.5, m: 0.0, y: 1.0, k: 0.0, tint: 1.0)
let pickerSrgb = try engine.editor.convertColorToColorSpace(color: pickerInput, colorSpace: .sRGB)
if case let .rgba(r, g, b, _) = pickerSrgb {
  print("R: \(Int(r * 255)), G: \(Int(g * 255)), B: \(Int(b * 255))")
}
```

### Export Preparation

Before PDF export for print, check the current color space and convert to CMYK only when needed. Skipping the conversion for colors that are already CMYK avoids unnecessary gamut shifts.

```swift highlight-colorConversion-exportPrep
// Before PDF export, ensure each color is in CMYK. Skip conversion when it
// already is.
let exportInput: Color = .rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0)
if case .cmyk = exportInput {
  print("Already CMYK: \(exportInput)")
} else {
  let cmyk = try engine.editor.convertColorToColorSpace(color: exportInput, colorSpace: .cmyk)
  print("Converted to CMYK: \(cmyk)")
}
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Spot color converts to unexpected values | Spot color not defined | Call `setSpotColor(name:r:g:b:)` or `setSpotColor(name:c:m:y:k:)` before conversion |
| Colors look different after conversion | Color gamut differences | Some sRGB colors cannot be exactly represented in CMYK |
| Mixing up `Color` cases | Direct property access on the wrong case | Use a `switch` statement or `if case` pattern matching to safely unpack components |

## API Reference

| Method | Description |
|--------|-------------|
| `engine.editor.convertColorToColorSpace(color:colorSpace:)` | Convert a color to the target color space. Returns a `Color` enum value matching the requested space. |
| `engine.editor.setSpotColor(name:r:g:b:)` | Define a spot color with an RGB approximation. Components range from 0.0 to 1.0. |
| `engine.editor.setSpotColor(name:c:m:y:k:)` | Define a spot color with a CMYK approximation. Components range from 0.0 to 1.0. |

| Type | Description |
|------|-------------|
| `Color.rgba(r:g:b:a:)` | sRGB color for screen display. Alpha controls transparency. |
| `Color.cmyk(c:m:y:k:tint:)` | CMYK color for print. Tint controls opacity. |
| `Color.spot(name:tint:externalReference:)` | Named color for specialized printing. |
| `ColorSpace` | Enum with cases `.sRGB`, `.cmyk`, and `.spotColor`. |



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support