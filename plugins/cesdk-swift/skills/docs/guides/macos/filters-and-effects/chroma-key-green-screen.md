> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Apply Chroma Key (Green Screen)](./chroma-key-green-screen.md)

---

```swift file=@cesdk_swift_examples/engine-guides-chroma-key-green-screen/ChromaKeyGreenScreen.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func chromaKeyGreenScreen(engine: Engine) async throws {
  // Demo scaffolding: a scene with one page, plus synthesized green-screen
  // footage — an astronaut sticker flattened onto a uniform green backdrop,
  // exported into an engine buffer — so the example has a keyable frame to work with.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let baseURL = try engine.guidesBaseURL

  let backdrop = try engine.block.create(.graphic)
  try engine.block.setShape(backdrop, shape: engine.block.createShape(.rect))
  let backdropFill = try engine.block.createFill(.color)
  try engine.block.setColor(backdropFill, property: "fill/color/value", color: .rgba(r: 0, g: 0.8, b: 0.25, a: 1))
  try engine.block.setFill(backdrop, fill: backdropFill)
  try engine.block.setWidth(backdrop, value: 800)
  try engine.block.setHeight(backdrop, value: 600)
  try engine.block.setPositionX(backdrop, value: 0)
  try engine.block.setPositionY(backdrop, value: 0)
  try engine.block.appendChild(to: page, child: backdrop)

  let subject = try engine.block.create(.graphic)
  try engine.block.setShape(subject, shape: engine.block.createShape(.rect))
  let subjectFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    subjectFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.sticker/images/3Dstickers/3d_stickers_astronaut.png"),
  )
  try engine.block.setFill(subject, fill: subjectFill)
  try engine.block.setWidth(subject, value: 360)
  try engine.block.setHeight(subject, value: 400)
  try engine.block.setPositionX(subject, value: 220)
  try engine.block.setPositionY(subject, value: 130)
  try engine.block.appendChild(to: page, child: subject)

  let frameData = try await engine.block.export(page, mimeType: .png)
  // Keep the buffer alive while the image fill references it.
  // Destroy it when the fill is no longer needed.
  let frameURL = engine.editor.createBuffer()
  try engine.editor.setBufferData(url: frameURL, offset: 0, data: frameData)
  try engine.block.destroy(backdrop)
  try engine.block.destroy(subject)

  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: frameURL)
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.setWidth(imageBlock, value: 600)
  try engine.block.setHeight(imageBlock, value: 450)
  try engine.block.setPositionX(imageBlock, value: 100)
  try engine.block.setPositionY(imageBlock, value: 75)
  try engine.block.appendChild(to: page, child: imageBlock)

  try await engine.captureGuide(page, label: "before-key")

  let greenScreenEffect = try engine.block.createEffect(.greenScreen)
  try engine.block.appendEffect(imageBlock, effectID: greenScreenEffect)

  try engine.block.setColor(
    greenScreenEffect,
    property: "effect/green_screen/fromColor",
    color: .rgba(r: 0, g: 0.8, b: 0.25, a: 1),
  )

  try await engine.captureGuide(page, label: "after-color")

  try engine.block.setFloat(greenScreenEffect, property: "effect/green_screen/colorMatch", value: 0.26)

  try engine.block.setFloat(greenScreenEffect, property: "effect/green_screen/smoothness", value: 0.15)

  try engine.block.setFloat(greenScreenEffect, property: "effect/green_screen/spill", value: 0.4)

  try await engine.captureGuide(page, label: "after-tuning")

  let backgroundBlock = try engine.block.create(.graphic)
  try engine.block.setShape(backgroundBlock, shape: engine.block.createShape(.rect))
  let backgroundFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    backgroundFill,
    property: "fill/color/value",
    color: .rgba(r: 0.2, g: 0.4, b: 0.8, a: 1),
  )
  try engine.block.setFill(backgroundBlock, fill: backgroundFill)
  try engine.block.setWidth(backgroundBlock, value: 800)
  try engine.block.setHeight(backgroundBlock, value: 600)
  try engine.block.setPositionX(backgroundBlock, value: 0)
  try engine.block.setPositionY(backgroundBlock, value: 0)
  try engine.block.appendChild(to: page, child: backgroundBlock)
  try engine.block.sendToBack(backgroundBlock)
  try engine.block.bringToFront(imageBlock)

  try await engine.captureGuide(page, label: "hero")

  let isEnabled = try engine.block.isEffectEnabled(effectID: greenScreenEffect)
  print("Green screen effect enabled: \(isEnabled)")

  try engine.block.setEffectEnabled(effectID: greenScreenEffect, enabled: !isEnabled)

  let blockSupportsEffects = try engine.block.supportsEffects(imageBlock)
  print("Block supports effects: \(blockSupportsEffects)")

  let effects = try engine.block.getEffects(imageBlock)
  print("Number of effects: \(effects.count)")

  if let effectIndex = effects.firstIndex(of: greenScreenEffect) {
    try engine.block.removeEffect(imageBlock, index: effectIndex)
  }
  try engine.block.destroy(greenScreenEffect)
}
```

Replace specific colors with transparency using CE.SDK's green screen effect
for video compositing and virtual background applications.

![An astronaut subject composited over a solid blue background after the green backdrop of the source frame was keyed out with the green screen effect](https://img.ly/docs/cesdk/macos/filters-and-effects/chroma-key-green-screen-1e3e99/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-rc.0/engine-guides-chroma-key-green-screen)

<EngineReferenceNote {...props} />

The green screen effect (chroma key) replaces a specified color with transparency, enabling compositing workflows where foreground subjects appear over different backgrounds. While green is the most common key color due to its contrast with skin tones, the effect works with any solid color—blue screens, white backgrounds, or custom colors. CE.SDK processes chroma keying in real-time using GPU-accelerated shaders.

This guide covers how to apply the green screen effect programmatically, configure color selection and keying parameters, composite with background layers, and manage effects on blocks. The example applies the effect to a graphic block whose image fill holds a frame of green-screen footage — a subject in front of a uniform green backdrop — and keys out the backdrop.

## Apply the Green Screen Effect

Create a green screen effect instance with `createEffect(_:)` and attach it to a block with `appendEffect(_:effectID:)`, which adds the effect to the block's effect list. The effect immediately processes the target color, making matching pixels transparent.

```swift highlight-chromaKey-createEffect
let greenScreenEffect = try engine.block.createEffect(.greenScreen)
try engine.block.appendEffect(imageBlock, effectID: greenScreenEffect)
```

`imageBlock` is the example's graphic block with an image fill; the same calls work on the block types that support effects — graphic blocks and pages. Video content also lives on a graphic block, with a video fill instead of an image fill, so the same workflow applies.

## Configure Color Selection

The green screen effect targets a specific color to key out. Set this color using `setColor(_:property:color:)` with the `effect/green_screen/fromColor` property. The effect defaults to pure green, and the color's alpha channel is ignored.

```swift highlight-chromaKey-configureColor
try engine.block.setColor(
  greenScreenEffect,
  property: "effect/green_screen/fromColor",
  color: .rgba(r: 0, g: 0.8, b: 0.25, a: 1),
)
```

The example sets the key color to the exact green of its footage's backdrop. For blue screen footage, set the color to blue instead — any solid color works. Match the exact color you want to remove for best results.

## Adjust Color Matching Tolerance

The `colorMatch` parameter controls how closely pixels must match the target color to be keyed out. Adjust it with `setFloat(_:property:value:)`.

```swift highlight-chromaKey-colorMatch
try engine.block.setFloat(greenScreenEffect, property: "effect/green_screen/colorMatch", value: 0.26)
```

Higher values (closer to `1.0`) key out a wider range of similar colors, which is useful for footage with uneven lighting or color variations in the background. Lower values create more precise keying for well-lit footage with uniform backgrounds. The parameter ranges from `0.0` to `1.0` and defaults to `0.4`.

## Control Edge Smoothness

The `smoothness` parameter controls the transition between opaque and transparent areas. This affects how sharp or soft the edges appear around keyed subjects.

```swift highlight-chromaKey-smoothness
try engine.block.setFloat(greenScreenEffect, property: "effect/green_screen/smoothness", value: 0.15)
```

Higher smoothness values create softer edges that blend naturally with new backgrounds, reducing harsh outlines. Lower values produce sharper edges, which may be preferable for high-contrast composites or when preserving fine detail.

## Remove Color Spill

Color spill occurs when the key color reflects onto the foreground subject, creating a green or blue tint on edges. The `spill` parameter desaturates the remaining traces of the key color.

```swift highlight-chromaKey-spill
try engine.block.setFloat(greenScreenEffect, property: "effect/green_screen/spill", value: 0.4)
```

Increase the spill value when you notice the key color appearing on subject edges or reflective surfaces. This is common with shiny hair, glasses, or metallic objects near the screen. Spill removal is off by default (`0.0`).

## Composite with Background Layers

After keying, layer the transparent content over backgrounds using block ordering. Create a background block and use `sendToBack(_:)` to place it behind the keyed image.

```swift highlight-chromaKey-composite
let backgroundBlock = try engine.block.create(.graphic)
try engine.block.setShape(backgroundBlock, shape: engine.block.createShape(.rect))
let backgroundFill = try engine.block.createFill(.color)
try engine.block.setColor(
  backgroundFill,
  property: "fill/color/value",
  color: .rgba(r: 0.2, g: 0.4, b: 0.8, a: 1),
)
try engine.block.setFill(backgroundBlock, fill: backgroundFill)
try engine.block.setWidth(backgroundBlock, value: 800)
try engine.block.setHeight(backgroundBlock, value: 600)
try engine.block.setPositionX(backgroundBlock, value: 0)
try engine.block.setPositionY(backgroundBlock, value: 0)
try engine.block.appendChild(to: page, child: backgroundBlock)
try engine.block.sendToBack(backgroundBlock)
try engine.block.bringToFront(imageBlock)
```

The background appears through the transparent areas where the key color was removed. You can use image or video fills instead of solid colors for more dynamic backgrounds.

## Toggle the Effect

Check whether an effect is enabled using `isEffectEnabled(effectID:)`.

```swift highlight-chromaKey-checkEnabled
let isEnabled = try engine.block.isEffectEnabled(effectID: greenScreenEffect)
print("Green screen effect enabled: \(isEnabled)")
```

To toggle the effect on or off, use `setEffectEnabled(effectID:enabled:)`. This preserves the effect configuration while temporarily removing its visual impact — here the effect is flipped relative to the state read above.

```swift highlight-chromaKey-setEnabled
try engine.block.setEffectEnabled(effectID: greenScreenEffect, enabled: !isEnabled)
```

Toggling effects is useful for before/after comparisons or conditional processing without removing and recreating the effect.

## Manage the Effect

Beyond toggling, you can query, remove, and clean up effects. Use `supportsEffects(_:)` to check if a block can have effects, `getEffects(_:)` to list all applied effects, `removeEffect(_:index:)` to detach an effect from a block, and `destroy(_:)` to free the effect's resources.

```swift highlight-chromaKey-manageEffects
  let blockSupportsEffects = try engine.block.supportsEffects(imageBlock)
  print("Block supports effects: \(blockSupportsEffects)")

  let effects = try engine.block.getEffects(imageBlock)
  print("Number of effects: \(effects.count)")

  if let effectIndex = effects.firstIndex(of: greenScreenEffect) {
    try engine.block.removeEffect(imageBlock, index: effectIndex)
  }
  try engine.block.destroy(greenScreenEffect)
```

When removing an effect, find its position in the list returned by `getEffects(_:)` and pass that index to `removeEffect(_:index:)`. Removing an effect detaches it from the block but keeps the instance alive — call `destroy(_:)` on the effect to release its resources.

## Troubleshooting

### Keying Results Appear Rough or Incomplete

- Increase the `colorMatch` value to capture more color variations
- Ensure source footage has even lighting on the screen
- Check that the target color accurately matches the screen color

### Edges Have Color Fringing

- Increase the `spill` value to remove color cast
- Adjust `smoothness` to soften hard edges
- Increase `colorMatch` if the fringe consists of leftover key-color pixels that fall just outside the matching threshold

### Transparent Areas Appear in Wrong Places

- Decrease `colorMatch` to be more selective about which colors are keyed
- Verify the `fromColor` matches only the intended background color
- Check that foreground subjects don't contain colors similar to the key color

## API Reference

### Methods

| Method                                       | Description                                                        |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `engine.block.createEffect(_:)`              | Create an effect instance from an `EffectType` such as `.greenScreen` |
| `engine.block.appendEffect(_:effectID:)`     | Add an effect to the end of a block's effect list                  |
| `engine.block.setColor(_:property:color:)`   | Set the color to key out                                           |
| `engine.block.setFloat(_:property:value:)`   | Set a keying parameter such as tolerance, smoothness, or spill     |
| `engine.block.isEffectEnabled(effectID:)`    | Check whether an effect is enabled                                 |
| `engine.block.setEffectEnabled(effectID:enabled:)` | Enable or disable an effect                                  |
| `engine.block.supportsEffects(_:)`           | Check whether a block supports effects                             |
| `engine.block.getEffects(_:)`                | Get all effects applied to a block                                 |
| `engine.block.removeEffect(_:index:)`        | Remove the effect at the given position from a block               |
| `engine.block.destroy(_:)`                   | Destroy an effect instance                                         |

### Properties

| Property                          | Type  | Description                                                                 |
| --------------------------------- | ----- | --------------------------------------------------------------------------- |
| `effect/green_screen/fromColor`   | Color | The color to replace with transparency; defaults to pure green, alpha is ignored |
| `effect/green_screen/colorMatch`  | Float | Color matching tolerance (`0.0`–`1.0`, default `0.4`)                       |
| `effect/green_screen/smoothness`  | Float | Edge smoothness (`0.0`–`1.0`, default `0.08`)                               |
| `effect/green_screen/spill`       | Float | Spill removal intensity (`0.0`–`1.0`, default `0.0`)                        |

## Next Steps

- [Apply a Filter or Effect](./apply.md) — Apply, configure, stack, and manage filters and effects with the Engine API.
- [Blur Effects](./blur.md) — Soften backgrounds and create depth with the blur API.
- [Duotone](./duotone.md) — Map image tones to two colors for stylized or vintage treatments.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support