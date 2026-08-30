> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Blend Modes](./blend-modes.md)

---

```swift file=@cesdk_swift_examples/engine-guides-blend-modes/BlendModes.swift reference-only
import IMGLYEngine

@MainActor
func blendModes(engine: Engine) async throws {
  // Set up a scene with a page and two overlapping graphic blocks
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Create a background graphic block (base layer)
  let background = try engine.block.create(.graphic)
  try engine.block.setShape(background, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(background, value: 400)
  try engine.block.setHeight(background, value: 400)
  try engine.block.setPositionX(background, value: 200)
  try engine.block.setPositionY(background, value: 100)
  let backgroundFill = try engine.block.createFill(.color)
  try engine.block.setColor(backgroundFill, property: "fill/color/value", color: .rgba(r: 1.0, g: 0.5, b: 0.0, a: 1.0))
  try engine.block.setFill(background, fill: backgroundFill)
  try engine.block.appendChild(to: page, child: background)

  // Create a top graphic block to blend with the background
  let overlay = try engine.block.create(.graphic)
  try engine.block.setShape(overlay, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(overlay, value: 400)
  try engine.block.setHeight(overlay, value: 400)
  try engine.block.setPositionX(overlay, value: 200)
  try engine.block.setPositionY(overlay, value: 100)
  let overlayFill = try engine.block.createFill(.color)
  try engine.block.setColor(overlayFill, property: "fill/color/value", color: .rgba(r: 0.0, g: 0.5, b: 1.0, a: 1.0))
  try engine.block.setFill(overlay, fill: overlayFill)
  try engine.block.appendChild(to: page, child: overlay)

  // Verify the block supports blend modes before applying one
  let supportsBlend = try engine.block.supportsBlendMode(overlay)
  print("Supports blend mode:", supportsBlend) // true

  // Apply the Multiply blend mode to the top block
  if supportsBlend {
    try engine.block.setBlendMode(overlay, mode: .multiply)
  }

  // Retrieve the current blend mode to confirm the change
  let currentMode = try engine.block.getBlendMode(overlay)
  print("Current blend mode:", currentMode) // BlendMode.multiply

  // Combine the blend mode with reduced opacity for a softer effect
  if try engine.block.supportsOpacity(overlay) {
    try engine.block.setOpacity(overlay, value: 0.7)
  }

  // Read back the current opacity value
  let currentOpacity = try engine.block.getOpacity(overlay)
  print("Current opacity:", currentOpacity) // 0.7
}
```

Control how design blocks visually blend with underlying layers using CE.SDK's
blend mode system for professional layered compositions.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260830/engine-guides-blend-modes)

Blend modes control how a block's colors combine with underlying layers, similar to blend modes in Photoshop or other design tools. CE.SDK provides 27 blend modes organized into categories: Normal, Darken, Lighten, Contrast, Inversion, and Component. Each category serves different compositing needs — darken modes make images darker, lighten modes make them brighter, and contrast modes increase midtone contrast.

This guide covers how to check blend mode support, apply blend modes programmatically, understand the available blend mode options, and combine blend modes with opacity for fine control over layer compositing.

## Checking Blend Mode Support

Before applying a blend mode, verify that the block supports it using `supportsBlendMode(_:)`. Most graphic blocks support blend modes, but checking avoids runtime errors.

```swift highlight-blendModes-checkSupport
// Verify the block supports blend modes before applying one
let supportsBlend = try engine.block.supportsBlendMode(overlay)
print("Supports blend mode:", supportsBlend) // true
```

Blend mode support is available for graphic blocks with image or color fills, shape blocks, and text blocks. Page and scene blocks do not support blend modes directly.

## Setting and Getting Blend Modes

Apply a blend mode with `setBlendMode(_:mode:)` and retrieve the current mode with `getBlendMode(_:)`. The default blend mode is `.normal`, which displays the block without any blending effect.

```swift highlight-blendModes-setBlendMode
// Apply the Multiply blend mode to the top block
if supportsBlend {
  try engine.block.setBlendMode(overlay, mode: .multiply)
}
```

After setting a blend mode, confirm the change by reading it back:

```swift highlight-blendModes-getBlendMode
// Retrieve the current blend mode to confirm the change
let currentMode = try engine.block.getBlendMode(overlay)
print("Current blend mode:", currentMode) // BlendMode.multiply
```

## Available Blend Modes

CE.SDK provides 27 blend modes organized into categories, each producing different visual results:

### Normal Modes

- **`.passThrough`** — Allows children of a group to blend with layers below the group
- **`.normal`** — Default mode with no blending effect

### Darken Modes

These modes darken the result by comparing the base and blend colors:

- **`.darken`** — Selects the darker of the base and blend colors
- **`.multiply`** — Multiplies colors, producing darker results (great for shadows)
- **`.colorBurn`** — Darkens base color by increasing contrast
- **`.linearBurn`** — Darkens base color by decreasing brightness
- **`.darkenColor`** — Selects the darker color based on luminosity

### Lighten Modes

These modes lighten the result by comparing colors:

- **`.lighten`** — Selects the lighter of the base and blend colors
- **`.screen`** — Multiplies the inverse of colors, producing lighter results (great for highlights)
- **`.colorDodge`** — Lightens base color by decreasing contrast
- **`.linearDodge`** — Lightens base color by increasing brightness
- **`.lightenColor`** — Selects the lighter color based on luminosity

### Contrast Modes

These modes increase midtone contrast:

- **`.overlay`** — Combines Multiply and Screen based on the base color
- **`.softLight`** — Similar to Overlay but with a softer effect
- **`.hardLight`** — Similar to Overlay but based on the blend color
- **`.vividLight`** — Burns or dodges colors based on the blend color
- **`.linearLight`** — Increases or decreases brightness based on blend color
- **`.pinLight`** — Replaces colors based on the blend color
- **`.hardMix`** — Reduces colors to white, black, or primary colors

### Inversion Modes

These modes create inverted or subtracted effects:

- **`.difference`** — Subtracts the darker from the lighter color
- **`.exclusion`** — Similar to Difference with lower contrast
- **`.subtract`** — Subtracts blend color from base color
- **`.divide`** — Divides base color by blend color

### Component Modes

These modes affect specific color components:

- **`.hue`** — Uses the hue of the blend color with base saturation and luminosity
- **`.saturation`** — Uses the saturation of the blend color
- **`.color`** — Uses the hue and saturation of the blend color
- **`.luminosity`** — Uses the luminosity of the blend color

## Combining Blend Modes with Opacity

For finer control over compositing, combine blend modes with opacity. Opacity reduces overall visibility while the blend mode affects color interaction with underlying layers.

```swift highlight-blendModes-setOpacity
// Combine the blend mode with reduced opacity for a softer effect
if try engine.block.supportsOpacity(overlay) {
  try engine.block.setOpacity(overlay, value: 0.7)
}
```

Read back the current opacity value to confirm changes or inspect existing state:

```swift highlight-blendModes-getOpacity
// Read back the current opacity value
let currentOpacity = try engine.block.getOpacity(overlay)
print("Current opacity:", currentOpacity) // 0.7
```

> **Tip:** Start with full opacity (1.0) when experimenting with blend modes, then reduce
> opacity to soften the effect. Common values are 0.5–0.7 for subtle blending
> effects.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.supportsBlendMode(_:)` | Check if a block supports blend modes |
| `engine.block.setBlendMode(_:mode:)` | Set the blend mode for a block |
| `engine.block.getBlendMode(_:)` | Get the current blend mode of a block |
| `engine.block.supportsOpacity(_:)` | Check if a block supports opacity |
| `engine.block.setOpacity(_:value:)` | Set the opacity for a block (0–1) |
| `engine.block.getOpacity(_:)` | Get the current opacity of a block |

## Next Steps

- [Layer Management](./layer-management.md) — Control z-order and visibility of blocks
- [Add a Background](./add-background.md) — Set page backgrounds that blend modes composite against
- [Grouping](./group-and-ungroup.md) — Combine blocks to apply blend modes to groups



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support