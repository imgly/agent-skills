> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Text on a Path](./text-on-path.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-on-path/TextOnPath.swift reference-only
import IMGLYEngine

@MainActor
func textOnPath(engine: Engine) async throws {
  // Demo scaffolding: a square page that frames the curved text for the
  // captures below. Creating the scene with `designUnit: .px` pairs the
  // font-size unit to Pixel, so the `setTextFontSize` value below renders at
  // the scale the SVG path's local coordinates assume. `setTextOnPath` sizes
  // the block to span about 7 font heights of the curve's larger dimension,
  // so the page needs to be generous relative to the font size below or the
  // curve renders larger than the page (and the capture goes blank).
  let scene = try engine.scene.create(designUnit: .px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 480)
  try engine.block.setHeight(page, value: 480)
  try engine.block.appendChild(to: scene, child: page)

  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: text)
  try engine.block.replaceText(text, text: "TEXT ON A PATH")
  try engine.block.setTextFontSize(text, fontSize: 48)

  let circlePath = "M 60,119.5 A 59.5,59.5 0 1,1 60.01,119.5 Z"
  try engine.block.setTextOnPath(text, svgPath: circlePath)

  // Demo scaffolding: setTextOnPath resizes the block to the path's aspect
  // ratio, so center it on the page now that its size is known.
  let width = try engine.block.getWidth(text)
  let height = try engine.block.getHeight(text)
  try engine.block.setPositionX(text, value: (480 - width) / 2)
  try engine.block.setPositionY(text, value: (480 - height) / 2)

  try await engine.captureGuide(page, label: "after-place-on-path")

  try engine.block.setEnum(text, property: "text/verticalAlignment", value: "Center")

  try await engine.captureGuide(page, label: "after-vertical-position")

  try engine.block.setTextOnPathOffset(text, offset: 0.05)
  let pathOffset = try engine.block.getTextOnPathOffset(text)
  print("Path offset:", pathOffset)

  try await engine.captureGuide(page, label: "hero")

  try engine.block.setTextOnPathFlipped(text, flipped: true)
  let isFlipped = try engine.block.getTextOnPathFlipped(text)
  print("Flipped:", isFlipped)

  try await engine.captureGuide(page, label: "after-flip")

  let currentPath = try engine.block.getTextOnPath(text)
  print("Text on path:", currentPath ?? "none")

  try engine.block.setTextOnPath(text, svgPath: nil)

  try await engine.captureGuide(page, label: "after-clear")
}
```

Curve a text block so its characters follow an SVG path — an arch, a full circle, or any custom curve — instead of a straight baseline.

![The words TEXT ON A PATH curving along the left arc of a circular path, with vertical alignment Center and a slight offset along the path](https://img.ly/docs/cesdk/macos/text/text-on-path-e3b8a2/assets/swift-based.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/engine-guides-text-on-path)

<EngineReferenceNote {...props} />

Text on a path makes a text block's baseline follow an SVG curve instead of a straight line — useful for badges, circular seals, and arched headlines. It applies to text blocks only and disables word wrapping while a path is active: explicit line breaks in the text collapse to spaces. Setting a path resizes the block to match the path's aspect ratio.

## Using the Built-in Path UI

On iOS, CE.SDK's prebuilt editor lets users curve text interactively: select a text block and a **Path** button appears in the inspector bar. Tapping it opens a sheet of curve tiles, and **None** removes the path and restores the straight baseline. The tiles — **Circle**, **Arch**, **Wave**, and **Elevate** by default — are defined by the `ly.img.text.curves` asset source rather than the app, so the set can change with future asset versions or your own presets. Each tile is a style preset, so tapping one does more than bend the baseline: it also replaces the block's text content and horizontal alignment with the preset's own values — expect a typed headline to be overwritten when a tile is applied. While a path is active — whether applied from a tile or set programmatically with a custom SVG string — the sheet shows **Path Position** (Top, Center, Bottom), **Direction** (Forward, Reversed), and an **Offset** slider below the tiles.

The rest of this guide covers the Engine API behind that experience, which applies text on a path programmatically on every Apple platform.

## Applying Curved Text Presets from the Asset Library

The same **Curved Text** presets shown in the Path sheet also surface in the asset library's text section, and you can query the source directly with `engine.asset.findAssets(sourceID:query:)`. Applying one from either place is the same operation: it sets the block's path, offset, and vertical alignment together in one step and, because each tile is a style preset, replaces the block's text content and horizontal alignment with the preset's own values.

## Creating the Text Block

We create a text block, give it a short headline, and set a font size. Creating and styling text in depth is covered in [Add Text](./add.md) and [Text Styling](./styling.md).

```swift highlight-textOnPath-createText
let text = try engine.block.create(.text)
try engine.block.appendChild(to: page, child: text)
try engine.block.replaceText(text, text: "TEXT ON A PATH")
try engine.block.setTextFontSize(text, fontSize: 48)
```

The block starts out with a normal, straight baseline.

## Placing Text on the Path

We curve the text onto a circle with `setTextOnPath(_:svgPath:)`, passing an SVG path string in the block's local coordinate space. The path must contain exactly one subpath (a single leading `M`); the block resizes to match the path's aspect ratio and word wrapping turns off.

```swift highlight-textOnPath-placeOnPath
let circlePath = "M 60,119.5 A 59.5,59.5 0 1,1 60.01,119.5 Z"
try engine.block.setTextOnPath(text, svgPath: circlePath)
```

The characters now follow the circle instead of a straight line.

## Positioning the Text Vertically

We set where the text sits relative to the path with `setEnum(_:property:value:)` on the `text/verticalAlignment` property — `Top`, `Center`, or `Bottom`.

```swift highlight-textOnPath-verticalPosition
try engine.block.setEnum(text, property: "text/verticalAlignment", value: "Center")
```

`Center` runs the baseline through the middle of the glyphs, while `Top` and `Bottom` sit the text on the inner or outer edge of the curve.

## Offsetting Along the Path

We slide the text along the path with `setTextOnPathOffset(_:offset:)`, a proportional value in the range `[-1, 1]` centered at zero, and read it back with `getTextOnPathOffset(_:)`. The same value is exposed as the generic `text/pathOffset` float property. Both ends of the range wrap back to the same position as `0`, so `1` and `-1` don't move the text further than a value just short of them.

```swift highlight-textOnPath-offset
try engine.block.setTextOnPathOffset(text, offset: 0.05)
let pathOffset = try engine.block.getTextOnPathOffset(text)
print("Path offset:", pathOffset)
```

Positive values move the text forward along the path; negative values move it back.

## Flipping the Direction

We flip the text to the other side of the curve — reversing its direction — with `setTextOnPathFlipped(_:flipped:)`, and read whether it's flipped back with `getTextOnPathFlipped(_:)`.

```swift highlight-textOnPath-direction
try engine.block.setTextOnPathFlipped(text, flipped: true)
let isFlipped = try engine.block.getTextOnPathFlipped(text)
print("Flipped:", isFlipped)
```

Flipping is what turns the bottom half of a circular badge right-side up.

## Reading and Clearing the Path

We read the block's current path with `getTextOnPath(_:)`, which returns the SVG string or `nil`. To remove the curve and restore a straight, auto-sized baseline, pass `nil` to `setTextOnPath(_:svgPath:)`.

```swift highlight-textOnPath-readAndClear
  let currentPath = try engine.block.getTextOnPath(text)
  print("Text on path:", currentPath ?? "none")

  try engine.block.setTextOnPath(text, svgPath: nil)
```

Clearing the path returns the block to a normal, straight text block with automatic sizing.

## Configuring Availability

On iOS, the Path sheet is gated as a whole through its inspector-bar button — pass `isVisible: { _ in false }` to `InspectorBar.Buttons.textOnPath(action:title:icon:isEnabled:isVisible:)` to remove it, or `isEnabled: { _ in false }` to keep it visible but inactive. There's no separate control for hiding only the offset slider or only the curve tiles, and the button's closures don't affect the other surfaces that list the same `ly.img.text.curves` presets — the text-presets sheet and the asset library's text section. See Disable or Enable Features for the general `isVisible`/`isEnabled` pattern used across dock, inspector bar, and canvas menu buttons.

## Troubleshooting

- **The path string is rejected**: `setTextOnPath(_:svgPath:)` throws an `EngineError` whose `catalogCode` is `EngineErrorCode.blockTextOnPathInvalidSvgPath` when the value isn't a valid SVG path — check the `d` attribute.
- **The path has multiple subpaths**: throws with `catalogCode` `EngineErrorCode.blockTextOnPathMultipleSubpaths` — supply a single continuous contour with one leading `M`.
- **The path has no measurable length**: throws with `catalogCode` `EngineErrorCode.blockTextOnPathNoMeasurableContour` — a lone `M` has zero length; give the path drawable length.
- **Text runs off the end of the path**: the block isn't grown to fit the text, so text longer than the path overflows. Shorten the text or enlarge the block.
- **The Path button doesn't appear**: on iOS, the selection isn't a text block, or its `text/character` scope isn't allowed (all scopes are allowed under the default Creator role).

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.create(_:)` | Create the text block to curve |
| `engine.block.replaceText(_:text:in:)` | Set the block's text content |
| `engine.block.setTextFontSize(_:fontSize:in:)` | Set the block's font size |
| `engine.block.setTextOnPath(_:svgPath:)` | Curve a text block along an SVG path (single subpath); pass `nil` to clear |
| `engine.block.getTextOnPath(_:)` | Get the block's current path SVG string, or `nil` |
| `engine.block.setTextOnPathOffset(_:offset:)` | Set the proportional offset (`[-1, 1]`) of the text along the path |
| `engine.block.getTextOnPathOffset(_:)` | Get the current path offset |
| `engine.block.setTextOnPathFlipped(_:flipped:)` | Flip the text to the other side of the path (reverse direction) |
| `engine.block.getTextOnPathFlipped(_:)` | Get whether the text is flipped |
| `engine.block.setEnum(_:property:value:)` | Set `text/verticalAlignment` (`Top`/`Center`/`Bottom`) relative to the path |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `text/verticalAlignment` | String enum | Position relative to the path — `Top`, `Center`, or `Bottom` (default `Top`); set with `setEnum(_:property:value:)` |
| `text/pathOffset` | Float | Equivalent to `setTextOnPathOffset(_:offset:)` — the proportional offset (`[-1, 1]`) along the path |

## Next Steps

- [Text Styling](./styling.md) — fonts, sizing, color, and alignment for the curved text
- [Text Effects](./effects.md) — add shadows and effects to the text
- Disable or Enable Features — on iOS, gate the Path button and other editor components with the `isVisible`/`isEnabled` pattern



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support