> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Outlines](../outlines.md) > [Shadows and Glows](./shadows-and-glows.md)

---

```swift file=@cesdk_swift_examples/engine-guides-shadows-and-glows/ShadowsAndGlows.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func shadowsAndGlows(engine: Engine) async throws {
  let scene = try engine.scene.create(designUnit: .px)

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // A gradient page fill gives the shadows and glows a backdrop to stand out against.
  let gradientFill = try engine.block.createFill(.linearGradient)
  try engine.block.setGradientColorStops(gradientFill, property: "fill/gradient/colors", colors: [
    GradientColorStop(color: .rgba(r: 0.0, g: 0.75, b: 0.85, a: 1.0), stop: 0.0),
    GradientColorStop(color: .rgba(r: 0.95, g: 0.85, b: 0.7, a: 1.0), stop: 0.5),
    GradientColorStop(color: .rgba(r: 0.85, g: 0.55, b: 0.45, a: 1.0), stop: 1.0),
  ])
  try engine.block.setFloat(gradientFill, property: "fill/gradient/linear/startPointX", value: 0)
  try engine.block.setFloat(gradientFill, property: "fill/gradient/linear/startPointY", value: 0)
  try engine.block.setFloat(gradientFill, property: "fill/gradient/linear/endPointX", value: 1)
  try engine.block.setFloat(gradientFill, property: "fill/gradient/linear/endPointY", value: 1)
  try engine.block.setFill(page, fill: gradientFill)

  let baseURL = try engine.guidesBaseURL

  // A title text block to carry the drop shadow.
  let textBlock = try engine.block.create(.text)
  try engine.block.replaceText(textBlock, text: "Shadows & Glows")
  try engine.block.setTextFontSize(textBlock, fontSize: 80)
  try engine.block.setTextColor(textBlock, color: .rgba(r: 1.0, g: 1.0, b: 1.0, a: 1.0))
  try engine.block.setWidthMode(textBlock, mode: .auto)
  try engine.block.setHeightMode(textBlock, mode: .auto)
  try engine.block.setPositionX(textBlock, value: 40)
  try engine.block.setPositionY(textBlock, value: 40)
  try engine.block.appendChild(to: page, child: textBlock)

  let supportsDropShadow = try engine.block.supportsDropShadow(textBlock)
  print("Block supports drop shadow: \(supportsDropShadow)")

  if supportsDropShadow {
    try engine.block.setDropShadowEnabled(textBlock, enabled: true)
    let shadowEnabled = try engine.block.isDropShadowEnabled(textBlock)
    print("Drop shadow enabled: \(shadowEnabled)")

    try engine.block.setDropShadowColor(textBlock, color: .rgba(r: 0.0, g: 0.3, b: 0.4, a: 0.8))
    let shadowColor: Color = try engine.block.getDropShadowColor(textBlock)
    print("Drop shadow color: \(shadowColor)")

    try engine.block.setDropShadowOffsetX(textBlock, offsetX: 6)
    try engine.block.setDropShadowOffsetY(textBlock, offsetY: 6)
    let offsetX = try engine.block.getDropShadowOffsetX(textBlock)
    let offsetY = try engine.block.getDropShadowOffsetY(textBlock)
    print("Drop shadow offset: \(offsetX), \(offsetY)")

    try engine.block.setDropShadowBlurRadiusX(textBlock, blurRadiusX: 12)
    try engine.block.setDropShadowBlurRadiusY(textBlock, blurRadiusY: 12)
    let blurX = try engine.block.getDropShadowBlurRadiusX(textBlock)
    let blurY = try engine.block.getDropShadowBlurRadiusY(textBlock)
    print("Drop shadow blur: \(blurX), \(blurY)")
  }

  try await engine.captureGuide(page, label: "after-drop-shadow")

  // An image block to carry the glow effect.
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(imageBlock, value: 440)
  try engine.block.setPositionY(imageBlock, value: 220)
  try engine.block.setWidth(imageBlock, value: 300)
  try engine.block.setHeight(imageBlock, value: 300)
  try engine.block.appendChild(to: page, child: imageBlock)
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)

  let supportsEffects = try engine.block.supportsEffects(imageBlock)
  print("Block supports effects: \(supportsEffects)")

  if supportsEffects {
    let glow = try engine.block.createEffect(.glow)
    try engine.block.appendEffect(imageBlock, effectID: glow)

    try engine.block.setFloat(glow, property: "effect/glow/size", value: 10)
    try engine.block.setFloat(glow, property: "effect/glow/amount", value: 0.7)
    try engine.block.setFloat(glow, property: "effect/glow/darkness", value: 0.25)
  }

  try await engine.captureGuide(page, label: "after-glow")

  // A second image block to carry both a drop shadow and a glow at once.
  let combinedBlock = try engine.block.create(.graphic)
  try engine.block.setShape(combinedBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(combinedBlock, value: 60)
  try engine.block.setPositionY(combinedBlock, value: 220)
  try engine.block.setWidth(combinedBlock, value: 300)
  try engine.block.setHeight(combinedBlock, value: 300)
  try engine.block.appendChild(to: page, child: combinedBlock)
  let combinedFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    combinedFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_5.jpg"),
  )
  try engine.block.setFill(combinedBlock, fill: combinedFill)

  if try engine.block.supportsDropShadow(combinedBlock) {
    try engine.block.setDropShadowEnabled(combinedBlock, enabled: true)
    try engine.block.setDropShadowColor(combinedBlock, color: .rgba(r: 0.0, g: 0.2, b: 0.3, a: 0.6))
    try engine.block.setDropShadowOffsetX(combinedBlock, offsetX: 8)
    try engine.block.setDropShadowOffsetY(combinedBlock, offsetY: 8)
    try engine.block.setDropShadowBlurRadiusX(combinedBlock, blurRadiusX: 20)
    try engine.block.setDropShadowBlurRadiusY(combinedBlock, blurRadiusY: 20)
    try engine.block.setDropShadowClip(combinedBlock, clip: false)
    let clipsToShape = try engine.block.getDropShadowClip(combinedBlock)
    print("Drop shadow clips to shape: \(clipsToShape)")
  }
  if try engine.block.supportsEffects(combinedBlock) {
    let combinedGlow = try engine.block.createEffect(.glow)
    try engine.block.appendEffect(combinedBlock, effectID: combinedGlow)
    try engine.block.setFloat(combinedGlow, property: "effect/glow/size", value: 8)
    try engine.block.setFloat(combinedGlow, property: "effect/glow/amount", value: 0.5)
    try engine.block.setFloat(combinedGlow, property: "effect/glow/darkness", value: 0.15)
  }

  try await engine.captureGuide(page, label: "hero")

  let shadowWasEnabled = try engine.block.isDropShadowEnabled(textBlock)
  try engine.block.setDropShadowEnabled(textBlock, enabled: false)
  let shadowAfterDisable = try engine.block.isDropShadowEnabled(textBlock)
  try engine.block.setDropShadowEnabled(textBlock, enabled: shadowWasEnabled)
  let shadowAfterRestore = try engine.block.isDropShadowEnabled(textBlock)
  print("Drop shadow toggled off then on: \(shadowAfterDisable) -> \(shadowAfterRestore)")

  let effects = try engine.block.getEffects(imageBlock)
  if let glowEffect = effects.first {
    try engine.block.setEffectEnabled(effectID: glowEffect, enabled: false)
    let glowAfterDisable = try engine.block.isEffectEnabled(effectID: glowEffect)
    try engine.block.setEffectEnabled(effectID: glowEffect, enabled: true)
    let glowAfterRestore = try engine.block.isEffectEnabled(effectID: glowEffect)
    print("Glow toggled off then on: \(glowAfterDisable) -> \(glowAfterRestore)")
  }

  let attachedEffects = try engine.block.getEffects(imageBlock)
  if let glowToRemove = attachedEffects.first {
    try engine.block.removeEffect(imageBlock, index: 0)
    try engine.block.destroy(glowToRemove)
  }
}
```

Add visual depth and emphasis to design elements using drop shadows and glow
effects with the CE.SDK Engine API. Drop shadows make elements appear to float
above the canvas, while glow effects add luminous halos that draw attention.

![A page with a white title that casts a teal drop shadow, an image with a luminous glow, and a second image combining both a drop shadow and a glow.](https://img.ly/docs/cesdk/ios/outlines/shadows-and-glows-6610fa/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260903/engine-guides-shadows-and-glows)

<EngineReferenceNote {...props} />

CE.SDK exposes two distinct approaches. **Drop shadows** are native block properties, configured directly on supported blocks with dedicated `setDropShadow*(_:)` methods. **Glow effects** are created through the effects system with `createEffect(_:)` and tuned with property setters. Drop shadows apply to graphic, text, and shape blocks. Glow effects apply to blocks that support effects, such as graphic and shape blocks; text blocks don't support effects.

## Using the Built-in UI

On iOS, the CE.SDK editor provides no built-in controls for drop shadows, so configure them with the Engine APIs below. Glow effects can be exposed to users through the effects sheet, depending on which effect sources your editor configuration registers. On macOS and Mac Catalyst there is no editor UI, so use the Engine APIs directly.

## Drop Shadow Configuration

Drop shadows are native block properties configured through dedicated API methods.

### Check Support and Enable

Verify a block supports drop shadows with `supportsDropShadow(_:)` before configuring one.

```swift highlight-shadowsAndGlows-checkDropShadowSupport
let supportsDropShadow = try engine.block.supportsDropShadow(textBlock)
print("Block supports drop shadow: \(supportsDropShadow)")
```

Once verified, enable the shadow with `setDropShadowEnabled(_:enabled:)` and read the current state back with `isDropShadowEnabled(_:)`.

```swift highlight-shadowsAndGlows-enableDropShadow
try engine.block.setDropShadowEnabled(textBlock, enabled: true)
let shadowEnabled = try engine.block.isDropShadowEnabled(textBlock)
print("Drop shadow enabled: \(shadowEnabled)")
```

### Set Shadow Color

Set the shadow color with `setDropShadowColor(_:color:)`, passing a `Color`. The color's alpha controls shadow opacity. `getDropShadowColor(_:)` returns the current color.

```swift highlight-shadowsAndGlows-setColor
try engine.block.setDropShadowColor(textBlock, color: .rgba(r: 0.0, g: 0.3, b: 0.4, a: 0.8))
let shadowColor: Color = try engine.block.getDropShadowColor(textBlock)
print("Drop shadow color: \(shadowColor)")
```

### Set Shadow Position

Control the horizontal and vertical offset with `setDropShadowOffsetX(_:offsetX:)` and `setDropShadowOffsetY(_:offsetY:)`. Positive values move the shadow right and down; negative values move it left and up.

```swift highlight-shadowsAndGlows-setOffset
try engine.block.setDropShadowOffsetX(textBlock, offsetX: 6)
try engine.block.setDropShadowOffsetY(textBlock, offsetY: 6)
let offsetX = try engine.block.getDropShadowOffsetX(textBlock)
let offsetY = try engine.block.getDropShadowOffsetY(textBlock)
print("Drop shadow offset: \(offsetX), \(offsetY)")
```

### Configure Blur Radius

Set the shadow softness with `setDropShadowBlurRadiusX(_:blurRadiusX:)` and `setDropShadowBlurRadiusY(_:blurRadiusY:)`. Higher values produce softer, more diffuse edges.

```swift highlight-shadowsAndGlows-setBlur
try engine.block.setDropShadowBlurRadiusX(textBlock, blurRadiusX: 12)
try engine.block.setDropShadowBlurRadiusY(textBlock, blurRadiusY: 12)
let blurX = try engine.block.getDropShadowBlurRadiusX(textBlock)
let blurY = try engine.block.getDropShadowBlurRadiusY(textBlock)
print("Drop shadow blur: \(blurX), \(blurY)")
```

## Glow Effect Configuration

Glow effects are created through the effects system and attached to blocks that support effects.

### Check Support and Create Glow

Verify a block supports effects with `supportsEffects(_:)`.

```swift highlight-shadowsAndGlows-checkGlowSupport
let supportsEffects = try engine.block.supportsEffects(imageBlock)
print("Block supports effects: \(supportsEffects)")
```

Create the glow with `createEffect(.glow)` and attach it with `appendEffect(_:effectID:)`.

```swift highlight-shadowsAndGlows-createGlow
let glow = try engine.block.createEffect(.glow)
try engine.block.appendEffect(imageBlock, effectID: glow)
```

### Configure Glow Parameters

Tune the glow's appearance with `setFloat(_:property:value:)` using these properties:

- `effect/glow/size` — The spread of the glow around the block.
- `effect/glow/amount` — The intensity of the glow.
- `effect/glow/darkness` — How dark the glow's falloff renders.

```swift highlight-shadowsAndGlows-configureGlow
try engine.block.setFloat(glow, property: "effect/glow/size", value: 10)
try engine.block.setFloat(glow, property: "effect/glow/amount", value: 0.7)
try engine.block.setFloat(glow, property: "effect/glow/darkness", value: 0.25)
```

## Combining Shadows and Glows

A drop shadow and a glow can both apply to the same block. Drop shadows render independently of the effects stack, so a block can carry both at once for layered depth and emphasis. Because this block is a shape, `setDropShadowClip(_:clip:)` controls whether the shadow is clipped out of the shape's own area: `clip: true` keeps the shadow strictly outside the shape, while `clip: false` (the default, used here) lets the shadow render behind the block and show through wherever the fill is not fully opaque. Clipping applies to shape blocks only, and `getDropShadowClip(_:)` reads the setting back.

```swift highlight-shadowsAndGlows-combine
if try engine.block.supportsDropShadow(combinedBlock) {
  try engine.block.setDropShadowEnabled(combinedBlock, enabled: true)
  try engine.block.setDropShadowColor(combinedBlock, color: .rgba(r: 0.0, g: 0.2, b: 0.3, a: 0.6))
  try engine.block.setDropShadowOffsetX(combinedBlock, offsetX: 8)
  try engine.block.setDropShadowOffsetY(combinedBlock, offsetY: 8)
  try engine.block.setDropShadowBlurRadiusX(combinedBlock, blurRadiusX: 20)
  try engine.block.setDropShadowBlurRadiusY(combinedBlock, blurRadiusY: 20)
  try engine.block.setDropShadowClip(combinedBlock, clip: false)
  let clipsToShape = try engine.block.getDropShadowClip(combinedBlock)
  print("Drop shadow clips to shape: \(clipsToShape)")
}
if try engine.block.supportsEffects(combinedBlock) {
  let combinedGlow = try engine.block.createEffect(.glow)
  try engine.block.appendEffect(combinedBlock, effectID: combinedGlow)
  try engine.block.setFloat(combinedGlow, property: "effect/glow/size", value: 8)
  try engine.block.setFloat(combinedGlow, property: "effect/glow/amount", value: 0.5)
  try engine.block.setFloat(combinedGlow, property: "effect/glow/darkness", value: 0.15)
}
```

## Managing Shadow and Glow State

### Toggle Drop Shadows

Show or hide a drop shadow with `setDropShadowEnabled(_:enabled:)` without discarding its color, offset, or blur. `isDropShadowEnabled(_:)` reports the current state.

```swift highlight-shadowsAndGlows-toggleShadow
let shadowWasEnabled = try engine.block.isDropShadowEnabled(textBlock)
try engine.block.setDropShadowEnabled(textBlock, enabled: false)
let shadowAfterDisable = try engine.block.isDropShadowEnabled(textBlock)
try engine.block.setDropShadowEnabled(textBlock, enabled: shadowWasEnabled)
let shadowAfterRestore = try engine.block.isDropShadowEnabled(textBlock)
print("Drop shadow toggled off then on: \(shadowAfterDisable) -> \(shadowAfterRestore)")
```

### Toggle Glow Effects

Show or hide a glow with `setEffectEnabled(effectID:enabled:)`, and query it with `isEffectEnabled(effectID:)`. Use `getEffects(_:)` to retrieve a block's attached effects.

```swift highlight-shadowsAndGlows-toggleGlow
let effects = try engine.block.getEffects(imageBlock)
if let glowEffect = effects.first {
  try engine.block.setEffectEnabled(effectID: glowEffect, enabled: false)
  let glowAfterDisable = try engine.block.isEffectEnabled(effectID: glowEffect)
  try engine.block.setEffectEnabled(effectID: glowEffect, enabled: true)
  let glowAfterRestore = try engine.block.isEffectEnabled(effectID: glowEffect)
  print("Glow toggled off then on: \(glowAfterDisable) -> \(glowAfterRestore)")
}
```

### Remove Glow Effects

To remove a glow permanently, detach it from the block with `removeEffect(_:index:)`, then release the instance with `destroy(_:)`.

```swift highlight-shadowsAndGlows-removeGlow
let attachedEffects = try engine.block.getEffects(imageBlock)
if let glowToRemove = attachedEffects.first {
  try engine.block.removeEffect(imageBlock, index: 0)
  try engine.block.destroy(glowToRemove)
}
```

## Troubleshooting

### Shadow Not Visible

- Confirm the block supports drop shadows with `supportsDropShadow(_:)`.
- Confirm the shadow is enabled with `isDropShadowEnabled(_:)`.
- Use a non-zero offset or blur radius so the shadow extends past the block.
- Give the shadow color enough alpha to be visible.

### Glow Not Appearing

- Confirm the block supports effects with `supportsEffects(_:)`.
- Confirm the effect is enabled with `isEffectEnabled(effectID:)`.
- Use non-zero `effect/glow/size` and `effect/glow/amount` values.

### Performance Considerations

- Keep the number of effects per block small on lower-end devices.
- Use moderate blur radius and glow size values to limit render cost.

## API Reference

| Method                                                                                                            | Description                                 |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `engine.block.supportsDropShadow(_:)`                                                                             | Check if a block supports drop shadows      |
| `engine.block.setDropShadowEnabled(_:enabled:)`                                                                   | Enable or disable the drop shadow           |
| `engine.block.isDropShadowEnabled(_:)`                                                                            | Query whether the drop shadow is enabled    |
| `engine.block.setDropShadowColor(_:color:)`                                                                       | Set the shadow color                        |
| `engine.block.getDropShadowColor(_:)`                                                                             | Get the current shadow color                |
| `engine.block.setDropShadowOffsetX(_:offsetX:)` / `engine.block.setDropShadowOffsetY(_:offsetY:)`                 | Set the horizontal and vertical offset      |
| `engine.block.getDropShadowOffsetX(_:)` / `engine.block.getDropShadowOffsetY(_:)`                                 | Get the horizontal and vertical offset      |
| `engine.block.setDropShadowBlurRadiusX(_:blurRadiusX:)` / `engine.block.setDropShadowBlurRadiusY(_:blurRadiusY:)` | Set the horizontal and vertical blur radius |
| `engine.block.getDropShadowBlurRadiusX(_:)` / `engine.block.getDropShadowBlurRadiusY(_:)`                         | Get the horizontal and vertical blur radius |
| `engine.block.setDropShadowClip(_:clip:)`                                                                         | Set shadow clipping (shape blocks only)     |
| `engine.block.getDropShadowClip(_:)`                                                                              | Get the shadow clipping setting             |
| `engine.block.supportsEffects(_:)`                                                                                | Check if a block supports effects           |
| `engine.block.createEffect(_:)`                                                                                   | Create an effect instance, such as `.glow`  |
| `engine.block.appendEffect(_:effectID:)`                                                                          | Attach an effect to a block                 |
| `engine.block.getEffects(_:)`                                                                                     | Get all effects on a block                  |
| `engine.block.setFloat(_:property:value:)`                                                                        | Set a glow parameter                        |
| `engine.block.setEffectEnabled(effectID:enabled:)`                                                                | Enable or disable an effect                 |
| `engine.block.isEffectEnabled(effectID:)`                                                                         | Query whether an effect is enabled          |
| `engine.block.removeEffect(_:index:)`                                                                             | Detach an effect from a block               |
| `engine.block.destroy(_:)`                                                                                        | Release an effect instance                  |

## Next Steps

[Using Strokes](./strokes.md) - Add border outlines to elements

[Apply a Filter or Effect](../filters-and-effects/apply.md) - Explore additional visual effects

[Blur Effects](../filters-and-effects/blur.md) - Apply blur effects to elements



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support