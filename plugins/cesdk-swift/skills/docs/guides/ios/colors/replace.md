> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Replace Individual Colors](./replace.md)

---

Selectively replace specific colors in images using CE.SDK's Recolor and Green Screen effects.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/engine-guides-colors-replace)

CE.SDK provides two effects for selective color modification: the **Recolor** effect swaps pixels matching a source color for a target color, while the **Green Screen** effect removes pixels matching a specified color to create transparency. Both effects use configurable tolerance parameters to control which pixels are affected, enabling use cases from product color variations to background removal.

```swift file=@cesdk_swift_examples/engine-guides-colors-replace/ColorsReplace.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func colorsReplace(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 450)
  try engine.block.appendChild(to: scene, child: page)

  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  // Create a Recolor effect that swaps red pixels for blue, then attach it to
  // an image block using `appendEffect`.
  let recolorBlock = try engine.block.create(.graphic)
  try engine.block.setShape(recolorBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(recolorBlock, value: 50)
  try engine.block.setPositionY(recolorBlock, value: 50)
  try engine.block.setWidth(recolorBlock, value: 200)
  try engine.block.setHeight(recolorBlock, value: 150)
  try engine.block.appendChild(to: page, child: recolorBlock)

  let recolorFill = try engine.block.createFill(.image)
  try engine.block.setURL(recolorFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(recolorBlock, fill: recolorFill)

  let recolorEffect = try engine.block.createEffect(.recolor)
  try engine.block.setColor(
    recolorEffect,
    property: "effect/recolor/fromColor",
    color: .rgba(r: 1, g: 0, b: 0, a: 1),
  )
  try engine.block.setColor(
    recolorEffect,
    property: "effect/recolor/toColor",
    color: .rgba(r: 0, g: 0.5, b: 1, a: 1),
  )
  try engine.block.appendEffect(recolorBlock, effectID: recolorEffect)

  try await engine.captureGuide(page, label: "after-recolor")

  let tolerancesBlock = try engine.block.create(.graphic)
  try engine.block.setShape(tolerancesBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(tolerancesBlock, value: 300)
  try engine.block.setPositionY(tolerancesBlock, value: 50)
  try engine.block.setWidth(tolerancesBlock, value: 200)
  try engine.block.setHeight(tolerancesBlock, value: 150)
  try engine.block.appendChild(to: page, child: tolerancesBlock)

  let tolerancesFill = try engine.block.createFill(.image)
  try engine.block.setURL(tolerancesFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(tolerancesBlock, fill: tolerancesFill)

  let tolerancesEffect = try engine.block.createEffect(.recolor)
  try engine.block.setFloat(tolerancesEffect, property: "effect/recolor/colorMatch", value: 0.3)
  try engine.block.setFloat(tolerancesEffect, property: "effect/recolor/brightnessMatch", value: 0.2)
  try engine.block.setFloat(tolerancesEffect, property: "effect/recolor/smoothness", value: 0.1)
  try engine.block.setColor(
    tolerancesEffect,
    property: "effect/recolor/fromColor",
    color: .rgba(r: 0.8, g: 0.6, b: 0.4, a: 1),
  )
  try engine.block.setColor(
    tolerancesEffect,
    property: "effect/recolor/toColor",
    color: .rgba(r: 0.3, g: 0.7, b: 0.3, a: 1),
  )
  try engine.block.appendEffect(tolerancesBlock, effectID: tolerancesEffect)

  // Create a Green Screen effect. `fromColor` picks the color to remove; any
  // pixel close enough to that color becomes transparent.
  let greenScreenBlock = try engine.block.create(.graphic)
  try engine.block.setShape(greenScreenBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(greenScreenBlock, value: 550)
  try engine.block.setPositionY(greenScreenBlock, value: 50)
  try engine.block.setWidth(greenScreenBlock, value: 200)
  try engine.block.setHeight(greenScreenBlock, value: 150)
  try engine.block.appendChild(to: page, child: greenScreenBlock)

  let greenScreenFill = try engine.block.createFill(.image)
  try engine.block.setURL(greenScreenFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(greenScreenBlock, fill: greenScreenFill)

  let greenScreenEffect = try engine.block.createEffect(.greenScreen)
  try engine.block.setColor(
    greenScreenEffect,
    property: "effect/green_screen/fromColor",
    color: .rgba(r: 0, g: 1, b: 0, a: 1),
  )
  try engine.block.appendEffect(greenScreenBlock, effectID: greenScreenEffect)

  try await engine.captureGuide(page, label: "after-green-screen")

  let spillBlock = try engine.block.create(.graphic)
  try engine.block.setShape(spillBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(spillBlock, value: 50)
  try engine.block.setPositionY(spillBlock, value: 250)
  try engine.block.setWidth(spillBlock, value: 200)
  try engine.block.setHeight(spillBlock, value: 150)
  try engine.block.appendChild(to: page, child: spillBlock)

  let spillFill = try engine.block.createFill(.image)
  try engine.block.setURL(spillFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(spillBlock, fill: spillFill)

  let spillEffect = try engine.block.createEffect(.greenScreen)
  try engine.block.setFloat(spillEffect, property: "effect/green_screen/colorMatch", value: 0.4)
  try engine.block.setFloat(spillEffect, property: "effect/green_screen/smoothness", value: 0.2)
  try engine.block.setFloat(spillEffect, property: "effect/green_screen/spill", value: 0.5)
  try engine.block.setColor(
    spillEffect,
    property: "effect/green_screen/fromColor",
    color: .rgba(r: 0.2, g: 0.8, b: 0.3, a: 1),
  )
  try engine.block.appendEffect(spillBlock, effectID: spillEffect)

  // Stack multiple Recolor effects on a single block, then toggle individual
  // entries with `setEffectEnabled` without removing them from the stack.
  let stackedBlock = try engine.block.create(.graphic)
  try engine.block.setShape(stackedBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(stackedBlock, value: 300)
  try engine.block.setPositionY(stackedBlock, value: 250)
  try engine.block.setWidth(stackedBlock, value: 200)
  try engine.block.setHeight(stackedBlock, value: 150)
  try engine.block.appendChild(to: page, child: stackedBlock)

  let stackedFill = try engine.block.createFill(.image)
  try engine.block.setURL(stackedFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(stackedBlock, fill: stackedFill)

  let redToBlue = try engine.block.createEffect(.recolor)
  try engine.block.setColor(redToBlue, property: "effect/recolor/fromColor", color: .rgba(r: 1, g: 0, b: 0, a: 1))
  try engine.block.setColor(redToBlue, property: "effect/recolor/toColor", color: .rgba(r: 0, g: 0, b: 1, a: 1))
  try engine.block.appendEffect(stackedBlock, effectID: redToBlue)

  let greenToOrange = try engine.block.createEffect(.recolor)
  try engine.block.setColor(greenToOrange, property: "effect/recolor/fromColor", color: .rgba(r: 0, g: 1, b: 0, a: 1))
  try engine.block.setColor(greenToOrange, property: "effect/recolor/toColor", color: .rgba(r: 1, g: 0.5, b: 0, a: 1))
  try engine.block.appendEffect(stackedBlock, effectID: greenToOrange)

  let stackedEffects = try engine.block.getEffects(stackedBlock)
  print("Number of effects: \(stackedEffects.count)") // 2

  try engine.block.setEffectEnabled(effectID: stackedEffects[0], enabled: false)
  let isEnabled = try engine.block.isEffectEnabled(effectID: stackedEffects[0])
  print("First effect enabled: \(isEnabled)") // false

  // Apply a consistent Recolor effect to every graphic block in the scene.
  // Skip blocks that already carry an effect so existing work isn't overwritten.
  let batchBlock = try engine.block.create(.graphic)
  try engine.block.setShape(batchBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(batchBlock, value: 550)
  try engine.block.setPositionY(batchBlock, value: 250)
  try engine.block.setWidth(batchBlock, value: 200)
  try engine.block.setHeight(batchBlock, value: 150)
  try engine.block.appendChild(to: page, child: batchBlock)

  let batchFill = try engine.block.createFill(.image)
  try engine.block.setURL(batchFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(batchBlock, fill: batchFill)

  let allGraphicBlocks = try engine.block.find(byType: .graphic)
  for blockID in allGraphicBlocks {
    if try engine.block.getEffects(blockID).isEmpty == false {
      continue
    }
    let batchRecolor = try engine.block.createEffect(.recolor)
    try engine.block.setColor(
      batchRecolor,
      property: "effect/recolor/fromColor",
      color: .rgba(r: 0.8, g: 0.7, b: 0.6, a: 1),
    )
    try engine.block.setColor(
      batchRecolor,
      property: "effect/recolor/toColor",
      color: .rgba(r: 0.6, g: 0.7, b: 0.9, a: 1),
    )
    try engine.block.setFloat(batchRecolor, property: "effect/recolor/colorMatch", value: 0.25)
    try engine.block.appendEffect(blockID, effectID: batchRecolor)
  }

  try await engine.captureGuide(page, label: "hero")
}
```

This guide covers how to apply and manage color replacement effects programmatically using the block API.

## Setup

We start with a scene and a page. Each example in this guide adds its own image block so the effects can be compared side-by-side.

```swift highlight-colorsReplace-setup
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 450)
  try engine.block.appendChild(to: scene, child: page)

  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
```

## Programmatic Color Replacement

Effects are themselves design blocks: create one with `createEffect`, configure its properties, then attach it to a target block with `appendEffect`.

### Creating a Recolor Effect

The Recolor effect replaces pixels matching a source color with a target color. Use `createEffect(.recolor)`, then set the `fromColor` and `toColor` properties with `setColor`.

```swift highlight-colorsReplace-createRecolor
  // Create a Recolor effect that swaps red pixels for blue, then attach it to
  // an image block using `appendEffect`.
  let recolorBlock = try engine.block.create(.graphic)
  try engine.block.setShape(recolorBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(recolorBlock, value: 50)
  try engine.block.setPositionY(recolorBlock, value: 50)
  try engine.block.setWidth(recolorBlock, value: 200)
  try engine.block.setHeight(recolorBlock, value: 150)
  try engine.block.appendChild(to: page, child: recolorBlock)

  let recolorFill = try engine.block.createFill(.image)
  try engine.block.setURL(recolorFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(recolorBlock, fill: recolorFill)

  let recolorEffect = try engine.block.createEffect(.recolor)
  try engine.block.setColor(
    recolorEffect,
    property: "effect/recolor/fromColor",
    color: .rgba(r: 1, g: 0, b: 0, a: 1),
  )
  try engine.block.setColor(
    recolorEffect,
    property: "effect/recolor/toColor",
    color: .rgba(r: 0, g: 0.5, b: 1, a: 1),
  )
  try engine.block.appendEffect(recolorBlock, effectID: recolorEffect)
```

`fromColor` specifies which color to match in the image, and `toColor` defines the replacement color. Colors use RGBA components in the `0...1` range.

### Configuring Color Matching Precision

Adjust the tolerance parameters with `setFloat` to fine-tune which pixels are affected:

```swift highlight-colorsReplace-configureRecolor
let tolerancesEffect = try engine.block.createEffect(.recolor)
try engine.block.setFloat(tolerancesEffect, property: "effect/recolor/colorMatch", value: 0.3)
try engine.block.setFloat(tolerancesEffect, property: "effect/recolor/brightnessMatch", value: 0.2)
try engine.block.setFloat(tolerancesEffect, property: "effect/recolor/smoothness", value: 0.1)
```

The Recolor effect exposes three precision parameters:

| Property | Range | Description |
|----------|-------|-------------|
| `effect/recolor/colorMatch` | 0–1 | Hue tolerance. Higher values include more color variations around the source color. |
| `effect/recolor/brightnessMatch` | 0–1 | Luminance tolerance. Higher values include pixels with different brightness levels. |
| `effect/recolor/smoothness` | 0–1 | Edge blending. Higher values create softer transitions at the boundaries of affected areas. |

### Creating a Green Screen Effect

The Green Screen effect removes pixels matching a specified color, making them transparent. This is commonly used for background removal.

```swift highlight-colorsReplace-createGreenScreen
  // Create a Green Screen effect. `fromColor` picks the color to remove; any
  // pixel close enough to that color becomes transparent.
  let greenScreenBlock = try engine.block.create(.graphic)
  try engine.block.setShape(greenScreenBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(greenScreenBlock, value: 550)
  try engine.block.setPositionY(greenScreenBlock, value: 50)
  try engine.block.setWidth(greenScreenBlock, value: 200)
  try engine.block.setHeight(greenScreenBlock, value: 150)
  try engine.block.appendChild(to: page, child: greenScreenBlock)

  let greenScreenFill = try engine.block.createFill(.image)
  try engine.block.setURL(greenScreenFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(greenScreenBlock, fill: greenScreenFill)

  let greenScreenEffect = try engine.block.createEffect(.greenScreen)
  try engine.block.setColor(
    greenScreenEffect,
    property: "effect/green_screen/fromColor",
    color: .rgba(r: 0, g: 1, b: 0, a: 1),
  )
  try engine.block.appendEffect(greenScreenBlock, effectID: greenScreenEffect)
```

Set the `fromColor` property to specify which color to remove. Matching pixels become transparent.

### Configuring Green Screen Parameters

Control removal precision with the Green Screen tolerance parameters:

```swift highlight-colorsReplace-configureGreenScreen
let spillEffect = try engine.block.createEffect(.greenScreen)
try engine.block.setFloat(spillEffect, property: "effect/green_screen/colorMatch", value: 0.4)
try engine.block.setFloat(spillEffect, property: "effect/green_screen/smoothness", value: 0.2)
try engine.block.setFloat(spillEffect, property: "effect/green_screen/spill", value: 0.5)
```

| Property | Description |
|----------|-------------|
| `effect/green_screen/colorMatch` | Tolerance for matching the background color. |
| `effect/green_screen/smoothness` | Edge softness for cleaner cutouts around subjects. |
| `effect/green_screen/spill` | Reduces color bleed from the removed background onto the subject, useful when the background color reflects onto edges. |

## Managing Multiple Effects

A single block can have multiple effects applied. Use the effect management APIs to list, toggle, and remove effects.

```swift highlight-colorsReplace-manageEffects
  // Stack multiple Recolor effects on a single block, then toggle individual
  // entries with `setEffectEnabled` without removing them from the stack.
  let stackedBlock = try engine.block.create(.graphic)
  try engine.block.setShape(stackedBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(stackedBlock, value: 300)
  try engine.block.setPositionY(stackedBlock, value: 250)
  try engine.block.setWidth(stackedBlock, value: 200)
  try engine.block.setHeight(stackedBlock, value: 150)
  try engine.block.appendChild(to: page, child: stackedBlock)

  let stackedFill = try engine.block.createFill(.image)
  try engine.block.setURL(stackedFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(stackedBlock, fill: stackedFill)

  let redToBlue = try engine.block.createEffect(.recolor)
  try engine.block.setColor(redToBlue, property: "effect/recolor/fromColor", color: .rgba(r: 1, g: 0, b: 0, a: 1))
  try engine.block.setColor(redToBlue, property: "effect/recolor/toColor", color: .rgba(r: 0, g: 0, b: 1, a: 1))
  try engine.block.appendEffect(stackedBlock, effectID: redToBlue)

  let greenToOrange = try engine.block.createEffect(.recolor)
  try engine.block.setColor(greenToOrange, property: "effect/recolor/fromColor", color: .rgba(r: 0, g: 1, b: 0, a: 1))
  try engine.block.setColor(greenToOrange, property: "effect/recolor/toColor", color: .rgba(r: 1, g: 0.5, b: 0, a: 1))
  try engine.block.appendEffect(stackedBlock, effectID: greenToOrange)

  let stackedEffects = try engine.block.getEffects(stackedBlock)
  print("Number of effects: \(stackedEffects.count)") // 2

  try engine.block.setEffectEnabled(effectID: stackedEffects[0], enabled: false)
  let isEnabled = try engine.block.isEffectEnabled(effectID: stackedEffects[0])
  print("First effect enabled: \(isEnabled)") // false
```

Key effect management methods:

- `getEffects(_:)` returns every effect ID attached to a block.
- `setEffectEnabled(effectID:enabled:)` toggles an effect on or off without removing it.
- `isEffectEnabled(effectID:)` checks whether an effect is currently active.
- `removeEffect(_:index:)` removes an effect by its position in the effect stack.

Stacking multiple Recolor effects enables complex color transformations, such as replacing several colors in a single image.

## Batch Processing

Apply the same color replacement configuration to every graphic block in a scene. Use `find(byType:)` to locate the target blocks and skip any that already carry effects so existing work isn't overwritten.

```swift highlight-colorsReplace-batchProcessing
  // Apply a consistent Recolor effect to every graphic block in the scene.
  // Skip blocks that already carry an effect so existing work isn't overwritten.
  let batchBlock = try engine.block.create(.graphic)
  try engine.block.setShape(batchBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(batchBlock, value: 550)
  try engine.block.setPositionY(batchBlock, value: 250)
  try engine.block.setWidth(batchBlock, value: 200)
  try engine.block.setHeight(batchBlock, value: 150)
  try engine.block.appendChild(to: page, child: batchBlock)

  let batchFill = try engine.block.createFill(.image)
  try engine.block.setURL(batchFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(batchBlock, fill: batchFill)

  let allGraphicBlocks = try engine.block.find(byType: .graphic)
  for blockID in allGraphicBlocks {
    if try engine.block.getEffects(blockID).isEmpty == false {
      continue
    }
    let batchRecolor = try engine.block.createEffect(.recolor)
    try engine.block.setColor(
      batchRecolor,
      property: "effect/recolor/fromColor",
      color: .rgba(r: 0.8, g: 0.7, b: 0.6, a: 1),
    )
    try engine.block.setColor(
      batchRecolor,
      property: "effect/recolor/toColor",
      color: .rgba(r: 0.6, g: 0.7, b: 0.9, a: 1),
    )
    try engine.block.setFloat(batchRecolor, property: "effect/recolor/colorMatch", value: 0.25)
    try engine.block.appendEffect(blockID, effectID: batchRecolor)
  }
```

## Troubleshooting

**Colors not matching as expected**: Increase the `colorMatch` tolerance for broader selection, or decrease it for more precise matching. Check that your source color closely matches the actual color in the image.

**Harsh edges around replaced areas**: Increase the `smoothness` value to create softer transitions at the boundaries of affected pixels.

**Color spill on Green Screen subjects**: Increase the `spill` value to reduce the green tint that often appears on edges when removing green backgrounds.

**Effect not visible**: Verify that the effect is enabled with `isEffectEnabled(effectID:)` and has been appended to the block with `appendEffect(_:effectID:)`.

## API Reference

| Method | Description |
|--------|-------------|
| `block.createEffect(.recolor)` | Create a new Recolor effect block. |
| `block.createEffect(.greenScreen)` | Create a new Green Screen effect block. |
| `block.appendEffect(_:effectID:)` | Add an effect to a block's effect stack. |
| `block.getEffects(_:)` | Get all effects applied to a block. |
| `block.removeEffect(_:index:)` | Remove an effect at a specific index. |
| `block.setEffectEnabled(effectID:enabled:)` | Enable or disable an effect. |
| `block.isEffectEnabled(effectID:)` | Check if an effect is enabled. |
| `block.setColor(_:property:color:)` | Set a color property on an effect. |
| `block.setFloat(_:property:value:)` | Set a float property on an effect. |
| `block.find(byType:)` | Find blocks by type for batch processing. |

## Next Steps

- [Apply Colors](./apply.md) — Apply solid colors, gradients, and fills to blocks
- [Apply a Filter or Effect](../filters-and-effects/apply.md) — Explore other image effects like filters and adjustments
- [Export Overview](../export-save-publish/export/overview.md) — Export processed images in various formats



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support