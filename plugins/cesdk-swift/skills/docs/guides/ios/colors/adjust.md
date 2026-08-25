> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Adjust Colors](./adjust.md)

---

Fine-tune images and graphics programmatically using CE.SDK's color adjustments system to control brightness, contrast, saturation, and other visual properties.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-colors-adjust)

Color adjustments modify the visual appearance of images and graphics by changing properties like brightness, contrast, saturation, and color temperature. CE.SDK implements color adjustments as an `adjustments` effect type that attaches to compatible blocks.

```swift file=@cesdk_swift_examples/engine-guides-colors-adjust/ColorsAdjust.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func colorsAdjust(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Resolve sample assets against the bundled asset base URL.
  let baseURL = try engine.guidesBaseURL
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(imageBlock, value: 400)
  try engine.block.setHeight(imageBlock, value: 300)
  try engine.block.setPositionX(imageBlock, value: 200)
  try engine.block.setPositionY(imageBlock, value: 150)
  try engine.block.appendChild(to: page, child: imageBlock)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(imageBlock, fill: imageFill)

  // Not every block type supports effects. Pages return false, while image and
  // graphic blocks return true.
  let supportsEffects = try engine.block.supportsEffects(imageBlock)
  print("Block supports effects: \(supportsEffects)")

  // Create an adjustments effect and attach it to the image block. A block can
  // hold one adjustments effect in its effect stack; it exposes every color
  // adjustment property through a single effect instance.
  let adjustmentsEffect = try engine.block.createEffect(.adjustments)
  try engine.block.appendEffect(imageBlock, effectID: adjustmentsEffect)

  // Each adjustment property uses the "effect/adjustments/" prefix followed by
  // the property name.
  try engine.block.setFloat(adjustmentsEffect, property: "effect/adjustments/brightness", value: 0.4)
  try engine.block.setFloat(adjustmentsEffect, property: "effect/adjustments/contrast", value: 0.35)
  try engine.block.setFloat(adjustmentsEffect, property: "effect/adjustments/saturation", value: 0.5)
  try engine.block.setFloat(adjustmentsEffect, property: "effect/adjustments/temperature", value: 0.25)

  // Read a single adjustment value with getFloat, or list every property on the
  // adjustments effect with findAllProperties.
  let brightness = try engine.block.getFloat(adjustmentsEffect, property: "effect/adjustments/brightness")
  print("Current brightness: \(brightness)")

  let allProperties = try engine.block.findAllProperties(adjustmentsEffect)
  print("Available adjustment properties: \(allProperties)")

  // Toggle the adjustments effect without removing it. The values remain
  // attached; only rendering is suppressed while disabled.
  try engine.block.setEffectEnabled(effectID: adjustmentsEffect, enabled: false)
  let isEnabled = try engine.block.isEffectEnabled(effectID: adjustmentsEffect)
  print("Adjustments enabled: \(isEnabled)")

  try engine.block.setEffectEnabled(effectID: adjustmentsEffect, enabled: true)

  // Combine adjustments to create a distinct visual style. Here we build a
  // moody look with darker brightness, higher contrast, and lower saturation.
  let secondImageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(secondImageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(secondImageBlock, value: 200)
  try engine.block.setHeight(secondImageBlock, value: 150)
  try engine.block.setPositionX(secondImageBlock, value: 50)
  try engine.block.setPositionY(secondImageBlock, value: 50)
  try engine.block.appendChild(to: page, child: secondImageBlock)
  let secondFill = try engine.block.createFill(.image)
  try engine.block.setURL(secondFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(secondImageBlock, fill: secondFill)

  let combinedAdjustments = try engine.block.createEffect(.adjustments)
  try engine.block.appendEffect(secondImageBlock, effectID: combinedAdjustments)
  try engine.block.setFloat(combinedAdjustments, property: "effect/adjustments/brightness", value: -0.15)
  try engine.block.setFloat(combinedAdjustments, property: "effect/adjustments/contrast", value: 0.4)
  try engine.block.setFloat(combinedAdjustments, property: "effect/adjustments/saturation", value: -0.3)

  let effects = try engine.block.getEffects(secondImageBlock)
  print("Effects on second image: \(effects.count)")

  // Refinement properties target image detail and tonal balance rather than
  // global color shifts.
  let tempBlock = try engine.block.create(.graphic)
  try engine.block.setShape(tempBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(tempBlock, value: 150)
  try engine.block.setHeight(tempBlock, value: 100)
  try engine.block.setPositionX(tempBlock, value: 550)
  try engine.block.setPositionY(tempBlock, value: 50)
  try engine.block.appendChild(to: page, child: tempBlock)
  let tempFill = try engine.block.createFill(.image)
  try engine.block.setURL(tempFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(tempBlock, fill: tempFill)

  let refinementEffect = try engine.block.createEffect(.adjustments)
  try engine.block.appendEffect(tempBlock, effectID: refinementEffect)
  try engine.block.setFloat(refinementEffect, property: "effect/adjustments/sharpness", value: 0.4)
  try engine.block.setFloat(refinementEffect, property: "effect/adjustments/clarity", value: 0.35)
  try engine.block.setFloat(refinementEffect, property: "effect/adjustments/highlights", value: -0.2)
  try engine.block.setFloat(refinementEffect, property: "effect/adjustments/shadows", value: 0.3)

  // Remove an effect by its index in the stack, then destroy the returned
  // effect block to free its resources.
  let tempEffects = try engine.block.getEffects(tempBlock)
  if let effectIndex = tempEffects.firstIndex(of: refinementEffect) {
    try engine.block.removeEffect(tempBlock, index: effectIndex)
  }
  try engine.block.destroy(refinementEffect)
}
```

This guide covers how to apply color adjustments programmatically using the block API on iOS, macOS, and Mac Catalyst.

## Setup

We start with a scene, a page, and an image block that we will adjust. The image is supplied as a remote URI on the fill; the engine fetches it on render.

```swift highlight-colorsAdjust-setup
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(imageBlock, value: 400)
  try engine.block.setHeight(imageBlock, value: 300)
  try engine.block.setPositionX(imageBlock, value: 200)
  try engine.block.setPositionY(imageBlock, value: 150)
  try engine.block.appendChild(to: page, child: imageBlock)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(imageBlock, fill: imageFill)
```

## Check Block Compatibility

Before applying adjustments, we verify the block supports effects. Page blocks don't support effects directly, while image and graphic blocks do.

```swift highlight-colorsAdjust-checkSupport
// Not every block type supports effects. Pages return false, while image and
// graphic blocks return true.
let supportsEffects = try engine.block.supportsEffects(imageBlock)
print("Block supports effects: \(supportsEffects)")
```

## Create and Apply Adjustments Effect

Once we've confirmed a block supports effects, we create an adjustments effect with `createEffect(.adjustments)` and attach it to the block using `appendEffect`.

```swift highlight-colorsAdjust-createAdjustments
// Create an adjustments effect and attach it to the image block. A block can
// hold one adjustments effect in its effect stack; it exposes every color
// adjustment property through a single effect instance.
let adjustmentsEffect = try engine.block.createEffect(.adjustments)
try engine.block.appendEffect(imageBlock, effectID: adjustmentsEffect)
```

Each block can have one adjustments effect in its effect stack. The adjustments effect exposes every color adjustment property through a single effect instance.

## Modify Adjustment Properties

We set individual adjustment values using `setFloat` with the effect block ID and a property path. Each property uses the `effect/adjustments/` prefix followed by the property name.

```swift highlight-colorsAdjust-setProperties
// Each adjustment property uses the "effect/adjustments/" prefix followed by
// the property name.
try engine.block.setFloat(adjustmentsEffect, property: "effect/adjustments/brightness", value: 0.4)
try engine.block.setFloat(adjustmentsEffect, property: "effect/adjustments/contrast", value: 0.35)
try engine.block.setFloat(adjustmentsEffect, property: "effect/adjustments/saturation", value: 0.5)
try engine.block.setFloat(adjustmentsEffect, property: "effect/adjustments/temperature", value: 0.25)
```

CE.SDK provides the following adjustment properties:

| Property | Description |
|----------|-------------|
| `brightness` | Overall lightness—positive values lighten, negative values darken |
| `contrast` | Tonal range—increases or decreases the difference between light and dark |
| `saturation` | Color intensity—positive values increase vibrancy, negative values desaturate |
| `exposure` | Exposure compensation—simulates camera exposure adjustments |
| `gamma` | Gamma curve—adjusts midtone brightness |
| `highlights` | Bright area intensity—controls the lightest parts of the image |
| `shadows` | Dark area intensity—controls the darkest parts of the image |
| `whites` | White point—adjusts the brightest pixels |
| `blacks` | Black point—adjusts the darkest pixels |
| `temperature` | Warm/cool color cast—positive for warmer, negative for cooler tones |
| `sharpness` | Edge sharpness—enhances or softens edges |
| `clarity` | Midtone contrast—increases local contrast for more definition |

All properties accept `Float` values. Experiment with different values to achieve the desired visual result.

## Read Adjustment Values

We read current adjustment values using `getFloat` with the same property paths. Use `findAllProperties` to discover every property available on an adjustments effect.

```swift highlight-colorsAdjust-readValues
  // Read a single adjustment value with getFloat, or list every property on the
  // adjustments effect with findAllProperties.
  let brightness = try engine.block.getFloat(adjustmentsEffect, property: "effect/adjustments/brightness")
  print("Current brightness: \(brightness)")

  let allProperties = try engine.block.findAllProperties(adjustmentsEffect)
  print("Available adjustment properties: \(allProperties)")
```

This is useful when building custom controls or syncing adjustment values across your application.

## Enable and Disable Adjustments

CE.SDK allows you to toggle adjustments on and off without removing them from the block. This is useful for before/after comparisons or conditional processing.

```swift highlight-colorsAdjust-enableDisable
  // Toggle the adjustments effect without removing it. The values remain
  // attached; only rendering is suppressed while disabled.
  try engine.block.setEffectEnabled(effectID: adjustmentsEffect, enabled: false)
  let isEnabled = try engine.block.isEffectEnabled(effectID: adjustmentsEffect)
  print("Adjustments enabled: \(isEnabled)")

  try engine.block.setEffectEnabled(effectID: adjustmentsEffect, enabled: true)
```

When you disable an adjustments effect, it remains attached to the block but is not rendered until you re-enable it. All adjustment values are preserved.

## Applying Different Adjustment Styles

You can apply different adjustment combinations to create distinct visual styles. The example below builds a moody look using negative brightness, high contrast, and desaturation.

```swift highlight-colorsAdjust-combineEffects
  // Combine adjustments to create a distinct visual style. Here we build a
  // moody look with darker brightness, higher contrast, and lower saturation.
  let secondImageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(secondImageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(secondImageBlock, value: 200)
  try engine.block.setHeight(secondImageBlock, value: 150)
  try engine.block.setPositionX(secondImageBlock, value: 50)
  try engine.block.setPositionY(secondImageBlock, value: 50)
  try engine.block.appendChild(to: page, child: secondImageBlock)
  let secondFill = try engine.block.createFill(.image)
  try engine.block.setURL(secondFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(secondImageBlock, fill: secondFill)

  let combinedAdjustments = try engine.block.createEffect(.adjustments)
  try engine.block.appendEffect(secondImageBlock, effectID: combinedAdjustments)
  try engine.block.setFloat(combinedAdjustments, property: "effect/adjustments/brightness", value: -0.15)
  try engine.block.setFloat(combinedAdjustments, property: "effect/adjustments/contrast", value: 0.4)
  try engine.block.setFloat(combinedAdjustments, property: "effect/adjustments/saturation", value: -0.3)

  let effects = try engine.block.getEffects(secondImageBlock)
  print("Effects on second image: \(effects.count)")
```

By combining different adjustment properties, you can create warm and vibrant looks, cool and desaturated styles, or high-contrast dramatic effects.

## Refinement Adjustments

Beyond basic color corrections, CE.SDK provides refinement adjustments for fine-tuning image detail and tonal balance.

```swift highlight-colorsAdjust-refinementAdjustments
  // Refinement properties target image detail and tonal balance rather than
  // global color shifts.
  let tempBlock = try engine.block.create(.graphic)
  try engine.block.setShape(tempBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(tempBlock, value: 150)
  try engine.block.setHeight(tempBlock, value: 100)
  try engine.block.setPositionX(tempBlock, value: 550)
  try engine.block.setPositionY(tempBlock, value: 50)
  try engine.block.appendChild(to: page, child: tempBlock)
  let tempFill = try engine.block.createFill(.image)
  try engine.block.setURL(tempFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(tempBlock, fill: tempFill)

  let refinementEffect = try engine.block.createEffect(.adjustments)
  try engine.block.appendEffect(tempBlock, effectID: refinementEffect)
  try engine.block.setFloat(refinementEffect, property: "effect/adjustments/sharpness", value: 0.4)
  try engine.block.setFloat(refinementEffect, property: "effect/adjustments/clarity", value: 0.35)
  try engine.block.setFloat(refinementEffect, property: "effect/adjustments/highlights", value: -0.2)
  try engine.block.setFloat(refinementEffect, property: "effect/adjustments/shadows", value: 0.3)
```

Refinement properties include:

- **Sharpness** — Enhances edge definition for crisper details
- **Clarity** — Increases mid-tone contrast for more depth and definition
- **Highlights** — Controls the intensity of bright areas
- **Shadows** — Controls the intensity of dark areas

These adjustments are particularly useful for enhancing photos or preparing images for print.

## Remove Adjustments

When you no longer need adjustments, remove them from the effect stack and free their resources. Always call `destroy` on effects that are no longer in use to prevent memory leaks.

```swift highlight-colorsAdjust-removeAdjustments
// Remove an effect by its index in the stack, then destroy the returned
// effect block to free its resources.
let tempEffects = try engine.block.getEffects(tempBlock)
if let effectIndex = tempEffects.firstIndex(of: refinementEffect) {
  try engine.block.removeEffect(tempBlock, index: effectIndex)
}
try engine.block.destroy(refinementEffect)
```

The `removeEffect` method takes an index position. After removal, destroy the effect instance to ensure proper cleanup.

To reset all adjustments to their defaults, either set each property to `0.0` with `setFloat`, or remove the adjustments effect and create a new one. Setting properties to `0.0` is typically more efficient.

## Troubleshooting

### Adjustments Not Visible

If adjustments don't appear after applying them:

- Verify the block supports effects using `supportsEffects`
- Check that the effect is enabled with `isEffectEnabled`
- Ensure the adjustments effect was appended to the block, not just created
- Confirm adjustment values are non-zero

### Unexpected Results

If adjustments produce unexpected visual results:

- Check the effect stack order—adjustments applied before or after other effects may produce different results
- Verify property paths include the `effect/adjustments/` prefix
- Use `findAllProperties` to verify correct property names

### Property Not Found

If you encounter property not found errors:

- Use `findAllProperties` to list every available property
- Ensure property paths use the correct `effect/adjustments/` prefix format

## API Reference

| Method | Description |
|--------|-------------|
| `block.supportsEffects(_:)` | Check if a block supports effects |
| `block.createEffect(.adjustments)` | Create an adjustments effect |
| `block.appendEffect(_:effectID:)` | Add effect to the end of the effect stack |
| `block.insertEffect(_:effectID:index:)` | Insert effect at a specific position |
| `block.getEffects(_:)` | Get all effects applied to a block |
| `block.removeEffect(_:index:)` | Remove effect at the specified index |
| `block.setEffectEnabled(effectID:enabled:)` | Enable or disable an effect |
| `block.isEffectEnabled(effectID:)` | Check if an effect is enabled |
| `block.setFloat(_:property:value:)` | Set a float property value |
| `block.getFloat(_:property:)` | Get a float property value |
| `block.findAllProperties(_:)` | List all properties of an effect |
| `block.destroy(_:)` | Destroy an effect and free resources |

## Next Steps

- [Apply Colors](./apply.md) — Apply colors to fills, strokes, and shadows
- [Apply a Filter or Effect](../filters-and-effects/apply.md) — Apply LUT filters, duotone effects, and more
- [Color Conversion](./conversion.md) — Convert between color spaces



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support