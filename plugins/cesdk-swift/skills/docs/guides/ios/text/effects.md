> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Text Effects](./effects.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-effects/TextEffects.swift reference-only
import IMGLYEngine

@MainActor
func textEffects(engine: Engine) async throws {
  // Demo scaffolding: an 800×500 page with a light off-white background so the
  // dark shadow and the blue outline both stay readable. Creating the scene
  // with `designUnit: .px` pairs the font-size unit to Pixel, so the literal
  // `setTextFontSize` values below render at the dimensions the layout
  // positions assume.
  let scene = try engine.scene.create(designUnit: .px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 500)
  try engine.block.appendChild(to: scene, child: page)

  let background = try engine.block.create(.graphic)
  try engine.block.setShape(background, shape: engine.block.createShape(.rect))
  try engine.block.setFill(background, fill: engine.block.createFill(.color))
  let backgroundFill = try engine.block.getFill(background)
  try engine.block.setColor(
    backgroundFill,
    property: "fill/color/value",
    color: .rgba(r: 0.969, g: 0.973, b: 0.984, a: 1.0),
  )
  try engine.block.setWidth(background, value: 800)
  try engine.block.setHeight(background, value: 500)
  try engine.block.appendChild(to: page, child: background)

  let shadowText = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: shadowText)
  try engine.block.replaceText(shadowText, text: "Drop Shadow")
  try engine.block.setTextFontSize(shadowText, fontSize: 90)
  try engine.block.setWidthMode(shadowText, mode: .auto)
  try engine.block.setHeightMode(shadowText, mode: .auto)
  try engine.block.setPositionX(shadowText, value: 50)
  try engine.block.setPositionY(shadowText, value: 50)

  guard try engine.block.supportsDropShadow(shadowText) else { return }
  try engine.block.setDropShadowEnabled(shadowText, enabled: true)
  try engine.block.setDropShadowColor(shadowText, color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 0.6))
  try engine.block.setDropShadowOffsetX(shadowText, offsetX: 5)
  try engine.block.setDropShadowOffsetY(shadowText, offsetY: 5)
  try engine.block.setDropShadowBlurRadiusX(shadowText, blurRadiusX: 10)
  try engine.block.setDropShadowBlurRadiusY(shadowText, blurRadiusY: 10)

  try await engine.captureGuide(page, label: "after-drop-shadow")

  let isDropShadowEnabled = try engine.block.isDropShadowEnabled(shadowText)
  let dropShadowColor: Color = try engine.block.getDropShadowColor(shadowText)
  let dropShadowOffsetX = try engine.block.getDropShadowOffsetX(shadowText)
  let dropShadowOffsetY = try engine.block.getDropShadowOffsetY(shadowText)
  print("Drop shadow enabled:", isDropShadowEnabled)
  print("Drop shadow color:", dropShadowColor)
  print("Drop shadow offset:", dropShadowOffsetX, dropShadowOffsetY)

  let outlineText = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: outlineText)
  try engine.block.replaceText(outlineText, text: "Outline")
  try engine.block.setTextFontSize(outlineText, fontSize: 90)
  try engine.block.setWidthMode(outlineText, mode: .auto)
  try engine.block.setHeightMode(outlineText, mode: .auto)
  try engine.block.setPositionX(outlineText, value: 50)
  try engine.block.setPositionY(outlineText, value: 250)

  guard try engine.block.supportsStroke(outlineText) else { return }
  try engine.block.setStrokeEnabled(outlineText, enabled: true)
  try engine.block.setStrokeWidth(outlineText, width: 2)
  try engine.block.setStrokeColor(outlineText, color: .rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0))
  try engine.block.setStrokeStyle(outlineText, style: .solid)
  try engine.block.setStrokePosition(outlineText, position: .center)

  let isStrokeEnabled = try engine.block.isStrokeEnabled(outlineText)
  let strokeWidth = try engine.block.getStrokeWidth(outlineText)
  let strokeColor: Color = try engine.block.getStrokeColor(outlineText)
  let strokeStyle = try engine.block.getStrokeStyle(outlineText)
  let strokePosition = try engine.block.getStrokePosition(outlineText)
  print("Stroke enabled:", isStrokeEnabled)
  print("Stroke width:", strokeWidth)
  print("Stroke color:", strokeColor)
  print("Stroke style is solid:", strokeStyle == .solid)
  print("Stroke position is center:", strokePosition == .center)

  try await engine.captureGuide(page, label: "hero")
}
```

Add visual depth and interest to text blocks using drop shadows and stroke outlines.

![Two text blocks on a light background, one with a soft drop shadow and one with a blue stroke outline](https://img.ly/docs/cesdk/ios/text/effects-2dc9fc/assets/swift-based.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/engine-guides-text-effects)

<EngineReferenceNote {...props} />

Text effects that apply directly to text blocks include drop shadows for depth and stroke outlines for text borders. These visual effects are distinct from text styling properties like colors, fonts, and backgrounds.

This guide covers how to apply text effects programmatically using the Block API.

## Drop Shadows

Drop shadows add depth and emphasis to text. Configure shadow color, position, and blur softness with the dedicated drop shadow API on the text block.

```swift highlight-textEffects-dropShadow
guard try engine.block.supportsDropShadow(shadowText) else { return }
try engine.block.setDropShadowEnabled(shadowText, enabled: true)
try engine.block.setDropShadowColor(shadowText, color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 0.6))
try engine.block.setDropShadowOffsetX(shadowText, offsetX: 5)
try engine.block.setDropShadowOffsetY(shadowText, offsetY: 5)
try engine.block.setDropShadowBlurRadiusX(shadowText, blurRadiusX: 10)
try engine.block.setDropShadowBlurRadiusY(shadowText, blurRadiusY: 10)
```

The offset values position the shadow relative to the text, while the blur radius controls shadow softness. Horizontal and vertical blur can be configured independently for asymmetric effects.

### Reading Shadow Values

Query the current drop shadow values from the text block. Annotate `getDropShadowColor` with `: Color` so the compiler picks the non-deprecated overload.

```swift highlight-textEffects-readDropShadow
let isDropShadowEnabled = try engine.block.isDropShadowEnabled(shadowText)
let dropShadowColor: Color = try engine.block.getDropShadowColor(shadowText)
let dropShadowOffsetX = try engine.block.getDropShadowOffsetX(shadowText)
let dropShadowOffsetY = try engine.block.getDropShadowOffsetY(shadowText)
print("Drop shadow enabled:", isDropShadowEnabled)
print("Drop shadow color:", dropShadowColor)
print("Drop shadow offset:", dropShadowOffsetX, dropShadowOffsetY)
```

## Stroke Outlines

Stroke outlines add a colored border around text. Enable stroke with `setStrokeEnabled(_:enabled:)`, then configure width, color, style, and position.

```swift highlight-textEffects-stroke
guard try engine.block.supportsStroke(outlineText) else { return }
try engine.block.setStrokeEnabled(outlineText, enabled: true)
try engine.block.setStrokeWidth(outlineText, width: 2)
try engine.block.setStrokeColor(outlineText, color: .rgba(r: 0.2, g: 0.4, b: 0.9, a: 1.0))
try engine.block.setStrokeStyle(outlineText, style: .solid)
try engine.block.setStrokePosition(outlineText, position: .center)
```

The stroke width is specified in the scene's design unit. Text blocks support `StrokePosition.center`, `StrokePosition.inner`, and `StrokePosition.outer` via `setStrokePosition(_:position:)`. Stroke styles include `StrokeStyle.solid`, `StrokeStyle.dashed`, `StrokeStyle.dotted`, and other line patterns.

### Reading Stroke Values

Query the current stroke values from the text block. As with drop shadow, annotate `getStrokeColor` with `: Color` to select the canonical overload.

```swift highlight-textEffects-readStroke
let isStrokeEnabled = try engine.block.isStrokeEnabled(outlineText)
let strokeWidth = try engine.block.getStrokeWidth(outlineText)
let strokeColor: Color = try engine.block.getStrokeColor(outlineText)
let strokeStyle = try engine.block.getStrokeStyle(outlineText)
let strokePosition = try engine.block.getStrokePosition(outlineText)
print("Stroke enabled:", isStrokeEnabled)
print("Stroke width:", strokeWidth)
print("Stroke color:", strokeColor)
print("Stroke style is solid:", strokeStyle == .solid)
print("Stroke position is center:", strokePosition == .center)
```

## Other Effects

Text blocks do not support the blur or effect-stack APIs. Use `supportsBlur(_:)` and `supportsEffects(_:)` before applying those APIs to other block types, and see [Filters & Effects Overview](../filters-and-effects/overview.md) for generic block effects.

## API Reference

### Drop Shadow Methods

| Method | Description |
| --- | --- |
| `engine.block.supportsDropShadow(_:)` | Check whether a block supports drop shadows |
| `engine.block.setDropShadowEnabled(_:enabled:)` | Enable or disable the drop shadow |
| `engine.block.isDropShadowEnabled(_:)` | Check whether the drop shadow is enabled |
| `engine.block.setDropShadowColor(_:color:)` | Set the shadow color |
| `engine.block.getDropShadowColor(_:)` | Get the shadow color (annotate return as `Color`) |
| `engine.block.setDropShadowOffsetX(_:offsetX:)` | Set the horizontal shadow offset |
| `engine.block.getDropShadowOffsetX(_:)` | Get the horizontal shadow offset |
| `engine.block.setDropShadowOffsetY(_:offsetY:)` | Set the vertical shadow offset |
| `engine.block.getDropShadowOffsetY(_:)` | Get the vertical shadow offset |
| `engine.block.setDropShadowBlurRadiusX(_:blurRadiusX:)` | Set the horizontal blur radius |
| `engine.block.getDropShadowBlurRadiusX(_:)` | Get the horizontal blur radius |
| `engine.block.setDropShadowBlurRadiusY(_:blurRadiusY:)` | Set the vertical blur radius |
| `engine.block.getDropShadowBlurRadiusY(_:)` | Get the vertical blur radius |

### Stroke Methods

| Method | Description |
| --- | --- |
| `engine.block.supportsStroke(_:)` | Check whether a block supports strokes |
| `engine.block.setStrokeEnabled(_:enabled:)` | Enable or disable the stroke |
| `engine.block.isStrokeEnabled(_:)` | Check whether the stroke is enabled |
| `engine.block.setStrokeWidth(_:width:)` | Set the stroke width |
| `engine.block.getStrokeWidth(_:)` | Get the stroke width |
| `engine.block.setStrokeColor(_:color:)` | Set the stroke color |
| `engine.block.getStrokeColor(_:)` | Get the stroke color (annotate return as `Color`) |
| `engine.block.setStrokeStyle(_:style:)` | Set the stroke line pattern |
| `engine.block.getStrokeStyle(_:)` | Get the stroke line pattern |
| `engine.block.setStrokePosition(_:position:)` | Set the stroke position relative to the text edge |
| `engine.block.getStrokePosition(_:)` | Get the stroke position |

## Troubleshooting

### Drop Shadow Not Visible

Ensure `setDropShadowEnabled(_:enabled:)` is called with `true`. Verify `supportsDropShadow(_:)` returns `true` for the text block, then adjust the shadow color, offset, and blur so the shadow is visible against the background.

### Stroke Not Visible

Ensure `setStrokeEnabled(_:enabled:)` is called with `true` and the stroke width is greater than `0`.

### Stroke Too Thick or Thin

Adjust the value passed to `setStrokeWidth(_:width:)` to control outline thickness.

## Next Steps

- [Text Styling](./styling.md) — Configure fonts, colors, alignment, and other styling options.
- [Using Strokes](../outlines/strokes.md) — Work with stroke controls beyond text outlines.
- [Filters & Effects Overview](../filters-and-effects/overview.md) — Explore visual effects such as blur, duotone, LUTs, and chroma keying.
- [Apply a Filter or Effect](../filters-and-effects/apply.md) — Apply effects to graphic blocks.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support