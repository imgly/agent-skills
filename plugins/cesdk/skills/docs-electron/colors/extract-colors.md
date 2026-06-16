> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [Extract Dominant Colors](./colors/extract-colors.md)

---

Read the most prominent colors out of a block directly from the engine. The result reflects what is actually rendered on the canvas, so crops, color adjustments, and effects are all taken into account.

`engine.block.getDominantColors()` analyzes the rendered appearance of a block and returns its most prominent colors, sorted from most to least dominant. It works on any visible block — an image fill, a solid graphic, or a whole page — and runs entirely inside the engine, so the same call behaves identically on the web, in Node.js, and on mobile.

## Extracting Dominant Colors

Pass a block and await the result. By default you get up to five colors, ordered by how much of the rendered block they cover.

```typescript
const [block] = engine.block.findAllSelected();

const colors = await engine.block.getDominantColors(block);

for (const { r, g, b, weight } of colors) {
  console.log(`rgb(${r}, ${g}, ${b}) covers ${Math.round(weight * 100)}%`);
}
```

The call is asynchronous because the engine first resolves the block's final layout. If the block still has assets loading — for example an image fill whose source has not finished downloading — the call waits for them to settle instead of returning an empty result.

## Understanding the Result

Each entry is a `DominantColor` describing one extracted color:

| Property | Type     | Description                                                                 |
| -------- | -------- | --------------------------------------------------------------------------- |
| `r`      | `number` | Red component in sRGB, normalized to `0`–`1`.                               |
| `g`      | `number` | Green component in sRGB, normalized to `0`–`1`.                             |
| `b`      | `number` | Blue component in sRGB, normalized to `0`–`1`.                              |
| `weight` | `number` | Share of analyzed pixels this color represents, from `0` to `1`.            |

Colors are sorted by `weight` in descending order, so `colors[0]` is always the most dominant. The weights of a single call sum to `1`, which lets you treat them as percentages of the block's visible surface.

Because the components use the `0`–`1` range that the rest of the CE.SDK color APIs expect, you can feed a result straight back into the engine — for example to apply the dominant color to a block that has a solid color fill:

```typescript
const [source] = engine.block.findAllSelected();
const [dominant] = await engine.block.getDominantColors(source);

const fill = engine.block.getFill(target);
engine.block.setColor(fill, 'fill/color/value', {
  colorSpace: 'sRGB',
  r: dominant.r,
  g: dominant.g,
  b: dominant.b,
  a: 1,
});
```

To display the colors in your own UI, convert each one to a hex string:

```typescript
const toHex = (value: number) =>
  Math.round(value * 255)
    .toString(16)
    .padStart(2, '0');

const hexColors = colors.map(({ r, g, b }) => `#${toHex(r)}${toHex(g)}${toHex(b)}`);
```

## Configuring the Analysis

The optional second argument controls how many colors you get back and whether near-white pixels are considered.

```typescript
const colors = await engine.block.getDominantColors(block, {
  count: 3,
  ignoreWhite: true,
});
```

| Option        | Type      | Default | Description                                                                                                                            |
| ------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `count`       | `number`  | `5`     | Number of colors to extract. The palette may contain fewer entries for images with little variation, and is empty when `count` is `0`. |
| `ignoreWhite` | `boolean` | `false` | When `true`, near-white pixels are skipped. Useful for product shots on white backgrounds so the background does not dominate.          |

## What the Colors Reflect

The analysis runs on the block's rendered output, not its source file. That means:

- **Crops, adjustments, and effects are included.** If you crop an image, lower its saturation, or apply a filter, the returned palette reflects the result, not the original asset.
- **Transparent pixels are skipped.** Fully or mostly transparent areas are excluded, so a logo on a transparent background returns the logo's colors rather than blending in the empty space.
- **The block must be visible.** It has to be attached to a scene and render visible content. Analyzing a detached or fully transparent block returns no colors.

## Building a Palette from a Scene

You can combine results from several blocks to build a palette for an entire design. Extract colors per block, then merge and re-sort them:

```typescript
const blocks = engine.block.findByType('graphic');

const swatches = new Map<string, number>();
for (const block of blocks) {
  const colors = await engine.block.getDominantColors(block, { ignoreWhite: true });
  for (const { r, g, b, weight } of colors) {
    const key = `${r.toFixed(3)},${g.toFixed(3)},${b.toFixed(3)}`;
    swatches.set(key, (swatches.get(key) ?? 0) + weight);
  }
}

const palette = [...swatches.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([key]) => key);
```

The built-in editor uses this same API to power the **Image Colors** section of the color picker. See [Asset Source Plugins](./plugins/asset-sources.md) for the `ImageColorsAssetSource` plugin that wires it up.

## Troubleshooting

### The call never resolves

`getDominantColors()` waits for pending assets to finish loading. Make sure the block's resources are reachable — a broken image URI keeps the asset in a pending state. Confirm the URI resolves and that your scene is connected to the engine.

### The result is empty

- Check that `count` is greater than `0`.
- Confirm the block is attached to a scene and renders visible content.
- A fully transparent block, or one whose only color is filtered out by `ignoreWhite`, returns no colors.

### The colors look different from the source image

This is expected. The palette is taken from the rendered block, so any crop, color adjustment, filter, or opacity applied to the block changes the result.

## API Reference

| Method                                          | Description                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `engine.block.getDominantColors(block, options)` | Returns a promise resolving to the block's dominant colors, sorted by weight. |

| Type                    | Properties                    | Description                                  |
| ----------------------- | ----------------------------- | -------------------------------------------- |
| `DominantColor`         | `r`, `g`, `b`, `weight`       | A single extracted color and its prominence. |
| `DominantColorsOptions` | `count`, `ignoreWhite`        | Options controlling the analysis.            |

## Next Steps

- [Color Basics](./colors/basics.md) — Review the three color spaces CE.SDK supports and when to use each
- [Apply Colors](./colors/apply.md) — Apply colors to design elements programmatically
- [Create a Color Palette](./colors/create-color-palette.md) — Build reusable color palettes for the color picker



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support