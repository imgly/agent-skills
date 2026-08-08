> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Distortion](./distortion.md)

---

```swift file=@cesdk_swift_examples/engine-guides-distortion/Distortion.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func distortion(engine: Engine) async throws {
  // Demo scaffolding: a comparison grid of six copies of the same image. The
  // teaching sections below apply one distortion effect to each cell so the
  // effects can be seen side by side; the top-left cell is left unaltered as a
  // reference.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1180)
  try engine.block.setHeight(page, value: 620)
  try engine.block.appendChild(to: scene, child: page)

  let baseURL = try engine.guidesBaseURL
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  func makeImageCell(x: Float, y: Float) throws -> DesignBlockID {
    let cell = try engine.block.create(.graphic)
    try engine.block.setShape(cell, shape: engine.block.createShape(.rect))
    try engine.block.setWidth(cell, value: 360)
    try engine.block.setHeight(cell, value: 270)
    try engine.block.setPositionX(cell, value: x)
    try engine.block.setPositionY(cell, value: y)
    let fill = try engine.block.createFill(.image)
    try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: imageURL)
    try engine.block.setFill(cell, fill: fill)
    try engine.block.setEnum(cell, property: "contentFill/mode", value: "Cover")
    try engine.block.appendChild(to: page, child: cell)
    return cell
  }

  _ = try makeImageCell(x: 30, y: 30) // original, no effect
  let liquidBlock = try makeImageCell(x: 410, y: 30)
  let mirrorBlock = try makeImageCell(x: 790, y: 30)
  let shifterBlock = try makeImageCell(x: 30, y: 320)
  let radialPixelBlock = try makeImageCell(x: 410, y: 320)
  let tvGlitchBlock = try makeImageCell(x: 790, y: 320)

  let canHaveEffects = try engine.block.supportsEffects(liquidBlock)
  print("Block supports effects: \(canHaveEffects)")

  let liquid = try engine.block.createEffect(.liquid)
  try engine.block.setFloat(liquid, property: "effect/liquid/amount", value: 0.5)
  try engine.block.setFloat(liquid, property: "effect/liquid/scale", value: 1.0)
  try engine.block.appendEffect(liquidBlock, effectID: liquid)

  let mirror = try engine.block.createEffect(.mirror)
  try engine.block.setInt(mirror, property: "effect/mirror/side", value: 0)
  try engine.block.appendEffect(mirrorBlock, effectID: mirror)

  let shifter = try engine.block.createEffect(.shifter)
  try engine.block.setFloat(shifter, property: "effect/shifter/amount", value: 0.3)
  try engine.block.setFloat(shifter, property: "effect/shifter/angle", value: 0.785)
  try engine.block.appendEffect(shifterBlock, effectID: shifter)

  let radialPixel = try engine.block.createEffect(.radialPixel)
  try engine.block.setFloat(radialPixel, property: "effect/radial_pixel/radius", value: 0.5)
  try engine.block.setFloat(radialPixel, property: "effect/radial_pixel/segments", value: 0.5)
  try engine.block.appendEffect(radialPixelBlock, effectID: radialPixel)

  let tvGlitch = try engine.block.createEffect(.tvGlitch)
  try engine.block.setFloat(tvGlitch, property: "effect/tv_glitch/distortion", value: 0.4)
  try engine.block.setFloat(tvGlitch, property: "effect/tv_glitch/distortion2", value: 0.2)
  try engine.block.setFloat(tvGlitch, property: "effect/tv_glitch/speed", value: 0.5)
  try engine.block.setFloat(tvGlitch, property: "effect/tv_glitch/rollSpeed", value: 0.5)
  try engine.block.appendEffect(tvGlitchBlock, effectID: tvGlitch)

  try await engine.captureGuide(page, label: "hero")

  let extraShifter = try engine.block.createEffect(.shifter)
  try engine.block.setFloat(extraShifter, property: "effect/shifter/amount", value: 0.2)
  try engine.block.appendEffect(liquidBlock, effectID: extraShifter)

  try await engine.captureGuide(liquidBlock, label: "after-combine")

  let effects = try engine.block.getEffects(liquidBlock)
  print("Applied effects: \(effects.count)")

  try engine.block.setEffectEnabled(effectID: extraShifter, enabled: false)
  let shifterEnabled = try engine.block.isEffectEnabled(effectID: extraShifter)
  print("Shifter enabled: \(shifterEnabled)")

  try engine.block.removeEffect(liquidBlock, index: 1)
  try engine.block.destroy(extraShifter)

  let liquidProperties = try engine.block.findAllProperties(liquid)
  print("Liquid effect properties: \(liquidProperties)")
}
```

Apply distortion effects to warp, shift, and transform images and videos for dynamic artistic visuals using CE.SDK's effect system.

![A grid showing the same photo unaltered alongside the liquid, mirror, shifter, radial pixel, and TV glitch distortion effects](https://img.ly/docs/cesdk/macos/filters-and-effects/distortion-5b5a66/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/engine-guides-distortion)

<EngineReferenceNote {...props} />

Distortion effects differ from color filters in that they modify the geometry and spatial arrangement of pixels rather than their color values. CE.SDK provides several distortion effect types: liquid warping, mirror reflections, color channel shifting, radial pixelation, and TV glitch. Each effect offers configurable parameters to control the intensity and style of the distortion.

This guide covers how to apply and configure each distortion effect programmatically, combine multiple effects on a single block, and manage the effect stack with the block API. To compare the effects side by side, the example places six copies of the same image in a grid and applies one effect to each — `liquidBlock`, `mirrorBlock`, and so on are the individual image cells.

## Check Effect Support

Before applying distortion effects, verify the block supports them with `engine.block.supportsEffects`. Graphic blocks with image or video fills support effects, while scene blocks do not.

```swift highlight-distortion-checkSupport
let canHaveEffects = try engine.block.supportsEffects(liquidBlock)
print("Block supports effects: \(canHaveEffects)")
```

## Apply Liquid Effect

The liquid effect creates organic, flowing distortions that warp the image as if viewed through water. Create the effect with `engine.block.createEffect(.liquid)`, configure its properties with `engine.block.setFloat`, then attach it with `engine.block.appendEffect`.

```swift highlight-distortion-liquid
let liquid = try engine.block.createEffect(.liquid)
try engine.block.setFloat(liquid, property: "effect/liquid/amount", value: 0.5)
try engine.block.setFloat(liquid, property: "effect/liquid/scale", value: 1.0)
try engine.block.appendEffect(liquidBlock, effectID: liquid)
```

The liquid effect properties:

- `effect/liquid/amount` (`0.0` to `1.0`) — Intensity of the warping.
- `effect/liquid/scale` — Scale of the liquid pattern.
- `effect/liquid/time` — Animation time offset for animated liquid distortions.

## Apply Mirror Effect

The mirror effect reflects the image along a configurable side, creating symmetrical compositions.

```swift highlight-distortion-mirror
let mirror = try engine.block.createEffect(.mirror)
try engine.block.setInt(mirror, property: "effect/mirror/side", value: 0)
try engine.block.appendEffect(mirrorBlock, effectID: mirror)
```

The `effect/mirror/side` property is an integer: `0` (Left), `1` (Right), `2` (Top), or `3` (Bottom). Set it with `engine.block.setInt`.

## Apply Shifter Effect

The shifter effect displaces color channels at an angle, creating chromatic aberration commonly seen in glitch art and retro visuals.

```swift highlight-distortion-shifter
let shifter = try engine.block.createEffect(.shifter)
try engine.block.setFloat(shifter, property: "effect/shifter/amount", value: 0.3)
try engine.block.setFloat(shifter, property: "effect/shifter/angle", value: 0.785)
try engine.block.appendEffect(shifterBlock, effectID: shifter)
```

The shifter effect properties:

- `effect/shifter/amount` (`0.0` to `1.0`) — Displacement distance.
- `effect/shifter/angle` — Direction of the shift in radians.

## Apply Radial Pixel Effect

The radial pixel effect pixelates the image in a circular pattern emanating from the center, useful for focus effects or stylized treatments.

```swift highlight-distortion-radialPixel
let radialPixel = try engine.block.createEffect(.radialPixel)
try engine.block.setFloat(radialPixel, property: "effect/radial_pixel/radius", value: 0.5)
try engine.block.setFloat(radialPixel, property: "effect/radial_pixel/segments", value: 0.5)
try engine.block.appendEffect(radialPixelBlock, effectID: radialPixel)
```

The radial pixel effect properties:

- `effect/radial_pixel/radius` (up to `1.0`) — Radius of each row of pixels, relative to the image.
- `effect/radial_pixel/segments` (up to `1.0`) — Proportional size of a pixel in each row.

## Apply TV Glitch Effect

The TV glitch effect simulates analog television interference with horizontal distortion and rolling effects, popular for retro and digital aesthetics.

```swift highlight-distortion-tvGlitch
let tvGlitch = try engine.block.createEffect(.tvGlitch)
try engine.block.setFloat(tvGlitch, property: "effect/tv_glitch/distortion", value: 0.4)
try engine.block.setFloat(tvGlitch, property: "effect/tv_glitch/distortion2", value: 0.2)
try engine.block.setFloat(tvGlitch, property: "effect/tv_glitch/speed", value: 0.5)
try engine.block.setFloat(tvGlitch, property: "effect/tv_glitch/rollSpeed", value: 0.5)
try engine.block.appendEffect(tvGlitchBlock, effectID: tvGlitch)
```

The TV glitch effect properties:

- `effect/tv_glitch/distortion` — Primary horizontal distortion intensity.
- `effect/tv_glitch/distortion2` — Secondary distortion layer.
- `effect/tv_glitch/speed` — Animation speed for the glitch effect.
- `effect/tv_glitch/rollSpeed` — Vertical roll speed simulating signal sync issues.

## Combine Multiple Distortion Effects

Stack multiple distortion effects on a single block. Here a shifter is added to `liquidBlock`, which already carries the liquid effect. Effects render in the order they appear in the block's effect list, from bottom to top, so the liquid warp is applied first and the shifter then displaces color channels on the already-warped result. Use `engine.block.appendEffect` to add an effect to the end of the list, or `engine.block.insertEffect` to place it at a specific index.

```swift highlight-distortion-combine
let extraShifter = try engine.block.createEffect(.shifter)
try engine.block.setFloat(extraShifter, property: "effect/shifter/amount", value: 0.2)
try engine.block.appendEffect(liquidBlock, effectID: extraShifter)
```

## List Applied Effects

Retrieve every effect attached to a block with `engine.block.getEffects`. It returns an ordered array of effect IDs.

```swift highlight-distortion-getEffects
let effects = try engine.block.getEffects(liquidBlock)
print("Applied effects: \(effects.count)")
```

## Enable and Disable Effects

Toggle an effect on and off without removing it using `engine.block.setEffectEnabled`, and query its state with `engine.block.isEffectEnabled`. A disabled effect stays attached and keeps its parameters, but the engine skips it during rendering — useful for before/after comparisons or performance tuning.

```swift highlight-distortion-toggle
try engine.block.setEffectEnabled(effectID: extraShifter, enabled: false)
let shifterEnabled = try engine.block.isEffectEnabled(effectID: extraShifter)
print("Shifter enabled: \(shifterEnabled)")
```

## Remove Effects

Remove an effect from a block by index with `engine.block.removeEffect`, then call `engine.block.destroy` on the removed effect to free its instance.

```swift highlight-distortion-remove
try engine.block.removeEffect(liquidBlock, index: 1)
try engine.block.destroy(extraShifter)
```

## Discover Effect Properties

Use `engine.block.findAllProperties` to discover every property available on an effect. The returned property paths work with `engine.block.setFloat`, `engine.block.setInt`, and `engine.block.setEnum`.

```swift highlight-distortion-properties
let liquidProperties = try engine.block.findAllProperties(liquid)
print("Liquid effect properties: \(liquidProperties)")
```

## Troubleshooting

### Effect Not Visible

Confirm the block supports effects with `supportsEffects` and that the effect is enabled with `isEffectEnabled`. Effects apply to graphic blocks with image or video fills, not to scene blocks.

### Unexpected Results

Verify parameter values fall within their expected ranges. Many distortion parameters are normalized to `0.0`–`1.0`, but some use wider ranges — the TV glitch intensities and the shifter angle, for example. Values outside the expected range can produce extreme or unintended distortion.

### Performance

Distortion effects are GPU-intensive. Limit the number of stacked effects on a single block, especially on mobile devices, and disable effects you aren't actively rendering.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.supportsEffects(_:)` | Check if a block supports effects |
| `engine.block.createEffect(_:)` | Create a new effect instance from an `EffectType` |
| `engine.block.appendEffect(_:effectID:)` | Add an effect to the end of a block's effect list |
| `engine.block.insertEffect(_:effectID:index:)` | Insert an effect at a specific position |
| `engine.block.getEffects(_:)` | Get all effects applied to a block |
| `engine.block.removeEffect(_:index:)` | Remove an effect at a specific index |
| `engine.block.setEffectEnabled(effectID:enabled:)` | Enable or disable an effect |
| `engine.block.isEffectEnabled(effectID:)` | Check if an effect is enabled |
| `engine.block.findAllProperties(_:)` | Discover all properties of an effect |
| `engine.block.setFloat(_:property:value:)` | Set a float property value |
| `engine.block.setInt(_:property:value:)` | Set an integer property value |
| `engine.block.setEnum(_:property:value:)` | Set an enum property value |
| `engine.block.destroy(_:)` | Destroy an effect instance to free memory |

## Available Distortion Effects

| Effect | `EffectType` | Description | Key Properties |
|--------|--------------|-------------|----------------|
| Liquid | `.liquid` | Flowing, organic warping | `amount`, `scale`, `time` |
| Mirror | `.mirror` | Reflection along a side | `side` (0=Left, 1=Right, 2=Top, 3=Bottom) |
| Shifter | `.shifter` | Chromatic aberration | `amount`, `angle` |
| Radial Pixel | `.radialPixel` | Circular pixelation | `radius`, `segments` |
| TV Glitch | `.tvGlitch` | Analog TV interference | `distortion`, `distortion2`, `speed`, `rollSpeed` |

## Next Steps

- [Apply Filters and Effects](./apply.md) — Learn the foundational effect APIs.
- [Blur Effects](./blur.md) — Apply blur techniques for depth and focus effects.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support