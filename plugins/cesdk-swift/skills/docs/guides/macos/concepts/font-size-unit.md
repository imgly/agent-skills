> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Font Size Unit](./font-size-unit.md)

---

```swift file=@cesdk_swift_examples/engine-guides-font-size-unit/FontSizeUnit.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func fontSizeUnit(engine: Engine) async throws {
  // Create a default Pixel-based design scene. With designUnit `.px` and no
  // explicit fontSizeUnit, the engine pairs them and uses `.px` for fonts too.
  let scene = try engine.scene.create(designUnit: .px)

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1080)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.appendChild(to: scene, child: page)

  // Read the scene's current font-size unit.
  // For a Pixel-based scene this defaults to `.px`.
  let initialUnit = try engine.scene.getFontSizeUnit()
  print("Initial font-size unit:", initialUnit) // .px

  // Switch the scene-wide default to Point. Existing text keeps its visual
  // size; only the unit used by `setTextFontSize` and `getTextFontSizes`
  // changes.
  try engine.scene.setFontSizeUnit(.pt)
  print("After switch:", try engine.scene.getFontSizeUnit()) // .pt

  // Add a text block to demonstrate how the unit flows through the text APIs.
  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: text)
  try engine.block.setString(text, property: "text/text", value: "Font Size Unit")
  try engine.block.setPositionX(text, value: 80)
  try engine.block.setPositionY(text, value: 480)
  try engine.block.setWidth(text, value: 920)
  try engine.block.setHeight(text, value: 120)

  // The value is interpreted in the scene's `fontSizeUnit`, which is now
  // Point. The engine reads this as 18 pt.
  try engine.block.setTextFontSize(text, fontSize: 18)

  // The float properties `text/fontSize`, `caption/fontSize`, and the
  // matching auto-min/max companions use the same `fontSizeUnit`.
  try engine.block.setFloat(text, property: "text/fontSize", value: 18)

  // The Swift binding does not expose a per-call unit option. To set a font
  // size in a different unit, switch the scene unit, perform the call, then
  // restore it. The engine converts using the scene's DPI so visual sizes
  // stay consistent.
  let savedUnit = try engine.scene.getFontSizeUnit()
  try engine.scene.setFontSizeUnit(.px)
  try engine.block.setTextFontSize(text, fontSize: 24) // interpreted as 24 px
  try engine.scene.setFontSizeUnit(savedUnit)

  // `getTextFontSizes` returns values in the scene's unit (currently Point).
  let sizesInSceneUnit = try engine.block.getTextFontSizes(text)
  print("Sizes (scene unit, pt):", sizesInSceneUnit)

  // `getFloat` reads `text/fontSize` in the same unit as `getTextFontSizes`.
  let propertySize = try engine.block.getFloat(text, property: "text/fontSize")
  print("text/fontSize (scene unit, pt):", propertySize)

  // To read in a different unit, switch the scene unit, read, then restore.
  try engine.scene.setFontSizeUnit(.px)
  let sizesInPixels = try engine.block.getTextFontSizes(text)
  try engine.scene.setFontSizeUnit(savedUnit)
  print("Sizes (px):", sizesInPixels)

  // When you create a scene yourself, you can pair both units explicitly.
  // If `fontSizeUnit` is omitted, the engine pairs it with `designUnit`:
  // `.px` design ⇒ `.px` font, `.mm` and `.in` ⇒ `.pt` font.
  _ = try engine.scene.create(designUnit: .px, fontSizeUnit: .pt)
}
```

Pick the unit your scene uses for `setTextFontSize` and `getTextFontSizes`.
The engine continues to store font sizes in points; this setting only
changes how values are interpreted at the API boundary.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260904/engine-guides-font-size-unit)

A scene's `fontSizeUnit` is the unit `setTextFontSize` and `getTextFontSizes` use to interpret values on text blocks. CE.SDK supports two values: `.pt` (the typographic default) and `.px` (matches Pixel-based design coordinates). The engine still stores font sizes in points internally; the unit only controls the API boundary.

This guide covers reading and changing the scene's font-size unit, how that default flows through the text APIs, how to override the unit for a specific call, and how to pair the unit with the design unit at scene creation.

## Reading the Current Font-Size Unit

Use `engine.scene.getFontSizeUnit()` to retrieve the font unit the current scene uses for the font size APIs. This sample creates the scene with `engine.scene.create(designUnit: .px)`, so the unit-aware overload pairs the font-size unit with the design unit and returns `.px`.

When the unit-aware `engine.scene.create(designUnit:fontSizeUnit:sceneLayout:)` overload receives `fontSizeUnit: nil`, CE.SDK pairs the font-size unit with the design unit: `.px` uses `.px`, while `.mm` and `.in` use `.pt`. Loaded scenes saved before `fontSizeUnit` existed return `.pt` for compatibility.

```swift highlight-fontSizeUnit-getUnit
// Read the scene's current font-size unit.
// For a Pixel-based scene this defaults to `.px`.
let initialUnit = try engine.scene.getFontSizeUnit()
print("Initial font-size unit:", initialUnit) // .px
```

## Setting the Font-Size Unit

`engine.scene.setFontSizeUnit(_:)` switches the scene-wide default. Existing text retains its visual size — the engine still stores values in points and converts on the way in and out. Only subsequent `setTextFontSize` and `getTextFontSizes` calls use the new unit.

```swift highlight-fontSizeUnit-setUnit
// Switch the scene-wide default to Point. Existing text keeps its visual
// size; only the unit used by `setTextFontSize` and `getTextFontSizes`
// changes.
try engine.scene.setFontSizeUnit(.pt)
print("After switch:", try engine.scene.getFontSizeUnit()) // .pt
```

`setDesignUnit(_:)` does not change `fontSizeUnit`, so a deliberate font-unit choice survives changes to the design coordinate system.

## Setting Font Sizes Without a Unit Option

The Swift binding does not accept a unit option on `setTextFontSize`. Values passed in are always interpreted in the scene's `fontSizeUnit`. The same applies to the float properties `text/fontSize`, `caption/fontSize`, and the matching auto-min/max companions accessed through `setFloat(_:property:value:)` and `getFloat(_:property:)`.

```swift highlight-fontSizeUnit-implicitSet
  // The value is interpreted in the scene's `fontSizeUnit`, which is now
  // Point. The engine reads this as 18 pt.
  try engine.block.setTextFontSize(text, fontSize: 18)

  // The float properties `text/fontSize`, `caption/fontSize`, and the
  // matching auto-min/max companions use the same `fontSizeUnit`.
  try engine.block.setFloat(text, property: "text/fontSize", value: 18)
```

## Overriding the Unit Per Call

The Swift binding does not expose a per-call unit option. To set or read a font size in a different unit than the scene default, toggle the scene's `fontSizeUnit`, perform the call, and restore it. CE.SDK converts between units using the scene's DPI, so the text's visual size stays consistent.

```swift highlight-fontSizeUnit-overridePerCall
// The Swift binding does not expose a per-call unit option. To set a font
// size in a different unit, switch the scene unit, perform the call, then
// restore it. The engine converts using the scene's DPI so visual sizes
// stay consistent.
let savedUnit = try engine.scene.getFontSizeUnit()
try engine.scene.setFontSizeUnit(.px)
try engine.block.setTextFontSize(text, fontSize: 24) // interpreted as 24 px
try engine.scene.setFontSizeUnit(savedUnit)
```

## Reading Font Sizes

`getTextFontSizes` returns values in the scene's `fontSizeUnit`. Use the same toggle pattern when you need values in a different unit; the conversion applies on the way out, so the same text reads consistently in either unit without changing the underlying size.

```swift highlight-fontSizeUnit-readSizes
  // `getTextFontSizes` returns values in the scene's unit (currently Point).
  let sizesInSceneUnit = try engine.block.getTextFontSizes(text)
  print("Sizes (scene unit, pt):", sizesInSceneUnit)

  // `getFloat` reads `text/fontSize` in the same unit as `getTextFontSizes`.
  let propertySize = try engine.block.getFloat(text, property: "text/fontSize")
  print("text/fontSize (scene unit, pt):", propertySize)

  // To read in a different unit, switch the scene unit, read, then restore.
  try engine.scene.setFontSizeUnit(.px)
  let sizesInPixels = try engine.block.getTextFontSizes(text)
  try engine.scene.setFontSizeUnit(savedUnit)
  print("Sizes (px):", sizesInPixels)
```

## Pairing Units at Scene Creation

`engine.scene.create(designUnit:fontSizeUnit:sceneLayout:)` accepts both options. When `fontSizeUnit` is `nil`, CE.SDK pairs it with `designUnit` (`.px` ⇒ `.px`, `.mm` and `.in` ⇒ `.pt`). Pass both explicitly when you want to mix them — for example, a Pixel design with Point-based typography.

```swift highlight-fontSizeUnit-createWithUnits
// When you create a scene yourself, you can pair both units explicitly.
// If `fontSizeUnit` is omitted, the engine pairs it with `designUnit`:
// `.px` design ⇒ `.px` font, `.mm` and `.in` ⇒ `.pt` font.
_ = try engine.scene.create(designUnit: .px, fontSizeUnit: .pt)
```

Auto-pairing only applies to the unit-aware overload above. The layout-only `engine.scene.create(sceneLayout:)` overload creates a Pixel scene with `.pt`. `engine.scene.createVideo()`, `engine.scene.create(fromImage:dpi:pixelScaleFactor:sceneLayout:)`, and `engine.scene.create(fromVideo:)` also keep `.pt` for compatibility. Call `engine.scene.setFontSizeUnit(.px)` after creation if you want font sizes to match Pixel-based coordinates.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.getFontSizeUnit()` | Get the current scene's font-size unit. |
| `engine.scene.setFontSizeUnit(_:)` | Set the current scene's font-size unit. |
| `engine.scene.create(designUnit:fontSizeUnit:sceneLayout:)` | Create a scene whose font-size unit is paired automatically with the design unit, or set explicitly. |
| `engine.scene.create(sceneLayout:)` | Create a Pixel scene with the compatibility font-size unit `.pt`. |
| `engine.scene.createVideo()` | Create a video scene with the compatibility font-size unit `.pt`. |
| `engine.scene.create(fromImage:dpi:pixelScaleFactor:sceneLayout:)` | Create an image scene with the compatibility font-size unit `.pt`. |
| `engine.scene.create(fromVideo:)` | Create a scene from a video URL with the compatibility font-size unit `.pt`. |
| `engine.block.setTextFontSize(_:fontSize:in:)` | Set a text block's font size, or a text subrange, in the scene unit. |
| `engine.block.getTextFontSizes(_:in:)` | Read a text block's font sizes, or a text subrange, in the scene unit. |
| `engine.block.setFloat(_:property:value:)` / `engine.block.getFloat(_:property:)` with `text/fontSize` | Set or read the main text font-size property in the scene unit. |
| `engine.block.setFloat(_:property:value:)` / `engine.block.getFloat(_:property:)` with `text/minAutomaticFontSize` | Set or read the text auto-resize minimum in the scene unit. |
| `engine.block.setFloat(_:property:value:)` / `engine.block.getFloat(_:property:)` with `text/maxAutomaticFontSize` | Set or read the text auto-resize maximum in the scene unit. |
| `engine.block.setFloat(_:property:value:)` / `engine.block.getFloat(_:property:)` with `caption/fontSize` | Set or read the caption font-size property in the scene unit. |
| `engine.block.setFloat(_:property:value:)` / `engine.block.getFloat(_:property:)` with `caption/minAutomaticFontSize` | Set or read the caption auto-resize minimum in the scene unit. |
| `engine.block.setFloat(_:property:value:)` / `engine.block.getFloat(_:property:)` with `caption/maxAutomaticFontSize` | Set or read the caption auto-resize maximum in the scene unit. |

## Next Steps

- [Design Units](./design-units.md) — Configure pixels, millimeters, or inches and DPI for the scene's coordinate system.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support