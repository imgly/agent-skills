> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Colors](../colors.md) > [Extract Dominant Colors](./extract-colors.md)

---

Read the most prominent colors out of a block directly from the engine. The result reflects what is actually rendered on the canvas, so crops, color adjustments, and effects are all taken into account.

<EngineReferenceNote {...props} />

`engine.block.getDominantColors(_:options:)` analyzes the rendered appearance of a block and returns its most prominent colors, sorted from most to least dominant. It works on any visible block — an image fill, a solid graphic, or a whole page — and runs entirely inside the engine.

## Extracting Dominant Colors

Pass a block and await the result. By default you get up to five colors, ordered by how much of the rendered block they cover.

```swift
let block = try engine.block.find(byType: .graphic).first!

let colors = try await engine.block.getDominantColors(block)

for color in colors {
  let percent = Int((color.weight * 100).rounded())
  print("rgb(\(color.r), \(color.g), \(color.b)) covers \(percent)%")
}
```

The method is asynchronous because the engine first resolves the block's final layout. If the block still has assets loading — for example an image fill whose source has not finished downloading — the call waits for them to settle instead of returning an empty result.

## Understanding the Result

Each entry is a `DominantColor` describing one extracted color:

| Property | Type    | Description                                                      |
| -------- | ------- | ---------------------------------------------------------------- |
| `r`      | `Float` | Red component in sRGB, normalized to `0`–`1`.                    |
| `g`      | `Float` | Green component in sRGB, normalized to `0`–`1`.                  |
| `b`      | `Float` | Blue component in sRGB, normalized to `0`–`1`.                   |
| `weight` | `Float` | Share of analyzed pixels this color represents, from `0` to `1`. |

Colors are sorted by `weight` in descending order, so the first entry is always the most dominant. The weights of a single call sum to `1`, which lets you treat them as percentages of the block's visible surface.

Because the components use the same `0`–`1` range as the rest of the CE.SDK color APIs, you can map a result straight into a SwiftUI `Color`:

```swift
let swatches = colors.map { color in
  Color(red: Double(color.r), green: Double(color.g), blue: Double(color.b))
}
```

## Configuring the Analysis

The optional `options` argument controls how many colors you get back and whether near-white pixels are considered.

```swift
let colors = try await engine.block.getDominantColors(
  block,
  options: .init(count: 3, ignoreWhite: true)
)
```

| Option        | Type   | Default | Description                                                                                                                            |
| ------------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `count`       | `Int`  | `5`     | Number of colors to extract. The palette may contain fewer entries for images with little variation, and is empty when `count` is `0`. |
| `ignoreWhite` | `Bool` | `false` | When `true`, near-white pixels are skipped. Useful for product shots on white backgrounds so the background does not dominate.          |

## What the Colors Reflect

The analysis runs on the block's rendered output, not its source file. That means:

- **Crops, adjustments, and effects are included.** If you crop an image, lower its saturation, or apply a filter, the returned palette reflects the result, not the original asset.
- **Transparent pixels are skipped.** Fully or mostly transparent areas are excluded, so a logo on a transparent background returns the logo's colors rather than blending in the empty space.
- **The block must be visible.** It has to be attached to a scene and render visible content. Analyzing a detached or fully transparent block returns no colors.

## Troubleshooting

### The call never resolves

`getDominantColors(_:options:)` waits for pending assets to finish loading. Make sure the block's resources are reachable — a broken image URI keeps the asset in a pending state.

### The result is empty

- Check that `count` is greater than `0`.
- Confirm the block is attached to a scene and renders visible content.
- A fully transparent block, or one whose only color is filtered out by `ignoreWhite`, returns no colors.

### The colors look different from the source image

This is expected. The palette is taken from the rendered block, so any crop, color adjustment, filter, or opacity applied to the block changes the result.

## API Reference

| Method                                            | Description                                                                  |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `engine.block.getDominantColors(_:options:)`      | Returns the block's dominant colors, sorted by weight. Marked `async throws`. |

| Type                    | Properties              | Description                                  |
| ----------------------- | ----------------------- | -------------------------------------------- |
| `DominantColor`         | `r`, `g`, `b`, `weight` | A single extracted color and its prominence. |
| `DominantColorsOptions` | `count`, `ignoreWhite`  | Options controlling the analysis.            |

## Next Steps

- [Color Basics](./basics.md) — Review the three color spaces CE.SDK supports and when to use each
- [Apply Colors](./apply.md) — Apply colors to design elements programmatically



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support