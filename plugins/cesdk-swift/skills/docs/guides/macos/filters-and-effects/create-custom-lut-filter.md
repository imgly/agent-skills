> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Filters and Effects](../filters-and-effects.md) > [Apply Custom LUT Filter](./create-custom-lut-filter.md)

---

```swift file=@cesdk_swift_examples/engine-guides-custom-lut-filter/CustomLUTFilter.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func customLutFilter(engine: Engine) async throws {
  // Demo scaffolding: a scene, a page, and an image block to grade. In your
  // app this is whatever image block the user is editing.
  let scene = try engine.scene.create()
  let baseURL = try engine.guidesBaseURL

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(imageBlock, value: 800)
  try engine.block.setHeight(imageBlock, value: 600)
  try engine.block.appendChild(to: page, child: imageBlock)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)

  // The URL of your hosted (or app-bundled) tiled-PNG LUT image.
  let lutURL = baseURL.appendingPathComponent("ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png")

  try await engine.captureGuide(page, label: "before-lut")

  let lutEffect = try engine.block.createEffect(.lutFilter)

  try engine.block.setURL(lutEffect, property: "effect/lut_filter/lutFileURI", value: lutURL)
  try engine.block.setInt(lutEffect, property: "effect/lut_filter/horizontalTileCount", value: 5)
  try engine.block.setInt(lutEffect, property: "effect/lut_filter/verticalTileCount", value: 5)

  try engine.block.setFloat(lutEffect, property: "effect/lut_filter/intensity", value: 0.9)

  try engine.block.appendEffect(imageBlock, effectID: lutEffect)

  try await engine.captureGuide(page, label: "hero")

  try engine.block.setEffectEnabled(effectID: lutEffect, enabled: false)
  let isEnabled = try engine.block.isEffectEnabled(effectID: lutEffect)
  print("LUT filter enabled: \(isEnabled)")
  try engine.block.setEffectEnabled(effectID: lutEffect, enabled: true)

  let supportsEffects = try engine.block.supportsEffects(imageBlock)
  let effects = try engine.block.getEffects(imageBlock)
  print("Supports effects: \(supportsEffects), count: \(effects.count)")
}
```

Apply custom LUT (Look-Up Table) filters to achieve brand-consistent color grading directly through CE.SDK's effect API.

![An image block with a custom LUT color grade applied through the effect API](https://img.ly/docs/cesdk/macos/filters-and-effects/create-custom-lut-filter-6e3f49/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-custom-lut-filter)

<EngineReferenceNote {...props} />

LUT filters remap colors through a predefined transformation table, enabling cinematic color grading and consistent brand aesthetics. This guide shows how to apply your own LUT files directly to design elements using the effect API. To organize collections of filters as reusable assets, see [Create Custom Filters](./create-custom-filters.md) for registering them as custom asset sources.

This guide covers CE.SDK's tiled-PNG LUT format, hosting your LUT image, creating and configuring a `lut_filter` effect, applying it to an image block, and toggling and inspecting effects after they're applied.

## Understanding LUT Image Format

CE.SDK uses a tiled PNG format where a 3D color cube is laid out as a 2D grid. Each tile represents a slice of the color cube along the blue axis.

The LUT image requires two configuration values:

- **`horizontalTileCount`** - Number of tiles across the image width
- **`verticalTileCount`** - Number of tiles down the image height

CE.SDK supports these tile configurations:

- 5×5 tiles with 128px cube size
- 8×8 tiles with 512px cube size

Standard `.cube` files must be converted to this tiled PNG format using image processing tools.

## Creating LUT PNG Images

### Starting from the Identity LUT

The fastest way to author a custom LUT filter is to edit the **identity LUT**: a neutral 8×8 tiled PNG (512px cube size) that produces no color change when applied. Any color adjustments you make to this image are recorded as the filter's transformation, and the resulting PNG can be used directly with the `lut_filter` effect.

<img src="content-assets/6e3f49/identity.png" alt="Identity LUT" />

To author a new filter from this identity LUT:

1. [Download the identity LUT](https://img.ly/docs/cesdk/macos/filters-and-effects/create-custom-lut-filter-6e3f49/content-assets/6e3f49/identity.png)
2. Open it in an image editor that operates on the whole image (Adobe Photoshop, Affinity Photo, GIMP, Pixelmator Pro)
3. Apply color adjustments — curves, levels, hue/saturation, color balance, channel mixer — to the entire image
4. Export the result as PNG; the exported file is your custom LUT

Do not crop, rotate, resize, or otherwise change the geometry of the image. Each pixel in the identity LUT is a specific color sample; reorganizing pixels breaks the color mapping.

> **WARNING:** Save the edited LUT as PNG. JPEG and other lossy formats introduce compression artifacts that produce visible color banding when the filter is applied.

### Obtaining LUT Files

LUT files are also available from multiple sources:

- **Color grading software** - Adobe Photoshop, DaVinci Resolve, and Affinity Photo can export 3D LUT files in `.cube` format
- **Online LUT libraries** - Many free and commercial LUT packs are available for download
- **LUT generators** - Tools that create custom color transformations from reference images

### Converting .cube to Tiled PNG

CE.SDK requires LUTs in a specific tiled PNG format where each tile represents a slice of the 3D color cube along the blue axis. To convert a standard `.cube` file:

1. **Parse the .cube file** - Read the 3D color lookup table data
2. **Arrange slices as tiles** - Each blue channel value becomes a separate tile containing the red-green color plane
3. **Export as PNG** - Save the grid as a PNG image

CE.SDK's built-in LUTs follow a naming convention: `imgly_lut_{name}_{h}_{v}_{cubeSize}.png` where `h` and `v` are tile counts and `cubeSize` indicates the LUT precision.

### Using a Script for Conversion

You can write a script using image-processing libraries (for example Python with Pillow and NumPy) to convert `.cube` files:

```python
# Pseudocode for .cube to tiled PNG conversion
# 1. Parse the .cube file to extract the 3D LUT data
# 2. Reshape data into (blue_slices, height, width, 3) array
# 3. Arrange slices in a grid matching tile configuration
# 4. Save as PNG with Image.fromarray()
```

### Using CE.SDK's Built-in LUTs

You can also reference CE.SDK's built-in LUT assets as format-verified examples. The filter extension at `ly.img.filter.lut/LUTs` contains pre-generated tiled PNGs you can inspect to confirm tile counts, cube size, and overall layout when authoring or converting your own LUTs.

## Hosting LUT Files

The LUT image must be reachable from the device at the URL you pass to the effect. Bundle it with your app for offline access, or serve it from your own host over HTTPS for production deployments.

## Creating the LUT Effect

Create a `lut_filter` effect instance with `createEffect(_:)`.

```swift highlight-customLutFilter-createEffect
let lutEffect = try engine.block.createEffect(.lutFilter)
```

This creates an effect that can be configured and applied to image blocks.

## Configuring LUT Properties

Point the effect at your LUT image with `setURL(_:property:value:)` on the `effect/lut_filter/lutFileURI` property, and set the tile dimensions with `setInt(_:property:value:)`. Here `lutURL` is the URL of your tiled-PNG LUT image.

```swift highlight-customLutFilter-configure
try engine.block.setURL(lutEffect, property: "effect/lut_filter/lutFileURI", value: lutURL)
try engine.block.setInt(lutEffect, property: "effect/lut_filter/horizontalTileCount", value: 5)
try engine.block.setInt(lutEffect, property: "effect/lut_filter/verticalTileCount", value: 5)
```

The tile counts must match the actual LUT image grid structure. Using incorrect values produces distorted colors.

## Setting Filter Intensity

Control the strength of the color transformation with `setFloat(_:property:value:)` on the `effect/lut_filter/intensity` property.

```swift highlight-customLutFilter-intensity
try engine.block.setFloat(lutEffect, property: "effect/lut_filter/intensity", value: 0.9)
```

Values range from `0.0` (no effect) to `1.0` (full effect). Use intermediate values for subtle color grading.

## Applying the Effect

Attach the configured effect to an image block with `appendEffect(_:effectID:)`.

```swift highlight-customLutFilter-apply
try engine.block.appendEffect(imageBlock, effectID: lutEffect)
```

The effect renders as soon as it is applied.

## Toggling the Effect

Enable or disable the effect without removing it using `setEffectEnabled(effectID:enabled:)`, and read the current state with `isEffectEnabled(effectID:)`.

```swift highlight-customLutFilter-toggle
try engine.block.setEffectEnabled(effectID: lutEffect, enabled: false)
let isEnabled = try engine.block.isEffectEnabled(effectID: lutEffect)
print("LUT filter enabled: \(isEnabled)")
try engine.block.setEffectEnabled(effectID: lutEffect, enabled: true)
```

Disabling preserves all effect settings while temporarily removing the visual transformation.

## Managing Effects

Retrieve and inspect the effects applied to a block. Use `getEffects(_:)` to access all effects on a block and `supportsEffects(_:)` to verify compatibility before applying.

```swift highlight-customLutFilter-manage
let supportsEffects = try engine.block.supportsEffects(imageBlock)
let effects = try engine.block.getEffects(imageBlock)
print("Supports effects: \(supportsEffects), count: \(effects.count)")
```

To remove an effect, call `removeEffect(_:index:)` with its index in the list, then `destroy(_:)` to free the effect instance.

## Troubleshooting

### LUT Not Rendering

- Verify the LUT image URL is reachable from the device
- Confirm the image uses PNG format
- Check that tile count values match the actual image grid

### Colors Look Wrong

- Verify tile counts match the LUT image structure
- Ensure the LUT was generated with sRGB color space

### Effect Not Visible

- Verify the effect is enabled with `isEffectEnabled(effectID:)`
- Ensure the effect was appended to the block, not just created
- Check the block supports effects with `supportsEffects(_:)`

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.createEffect(_:)` | Create an effect instance for an `EffectType` such as `.lutFilter` |
| `engine.block.appendEffect(_:effectID:)` | Apply an effect to a block |
| `engine.block.getEffects(_:)` | Get all effects on a block |
| `engine.block.setEffectEnabled(effectID:enabled:)` | Enable or disable an effect |
| `engine.block.isEffectEnabled(effectID:)` | Check whether an effect is enabled |
| `engine.block.removeEffect(_:index:)` | Remove the effect at an index |
| `engine.block.destroy(_:)` | Destroy an effect instance |
| `engine.block.supportsEffects(_:)` | Check whether a block supports effects |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `effect/lut_filter/lutFileURI` | URL | URL of the tiled-PNG LUT image |
| `effect/lut_filter/horizontalTileCount` | Int | Number of tiles across the image width |
| `effect/lut_filter/verticalTileCount` | Int | Number of tiles down the image height |
| `effect/lut_filter/intensity` | Float | Filter intensity, from `0.0` to `1.0` |

## Next Steps

- [Apply Filters and Effects](./apply.md) - Learn more about the effects system
- [Create Custom Filters](./create-custom-filters.md) - Register custom LUT filters as asset sources for brand-specific color grading and filter collections.
- [Duotone](./duotone.md) - Apply duotone effects to images, mapping tones to two colors for stylized visuals, vintage aesthetics, or brand-specific treatments.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support