> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Outlines](./outlines.md) > [Stroke (Outline)](./outlines/strokes.md)

---

Add outlines around shapes, text, and graphics to enhance visual definition and create decorative effects.

![Using Strokes example showing a rectangle with a styled blue dashed stroke](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-outlines-stroke-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-outlines-stroke-browser)
>
> - [Live demo](https://img.ly/examples/guides-outlines-stroke-browser/)

Strokes add visual outlines that define block boundaries. You can customize their color, width, line style (solid, dashed, dotted), position relative to the block edge, and corner treatment. CE.SDK provides both built-in UI controls and programmatic APIs for stroke management.

```typescript file=@cesdk_web_examples/guides-outlines-stroke-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';

class Example implements EditorPlugin {
  name = 'guides-outlines-stroke-browser';
  version = '1.0.0';

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // Create a graphic block with a rectangle shape
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.appendChild(page, block);

    // Position and size the block
    engine.block.setPositionX(block, 200);
    engine.block.setPositionY(block, 150);
    engine.block.setWidth(block, 400);
    engine.block.setHeight(block, 300);

    // Add a fill so the shape is visible
    const solidFill = engine.block.createFill('color');
    engine.block.setFill(block, solidFill);
    engine.block.setColor(solidFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Check if block supports strokes
    const canHaveStroke = engine.block.supportsStroke(block);
    console.log('Block supports stroke:', canHaveStroke);

    if (canHaveStroke) {
      // Enable stroke on the block
      engine.block.setStrokeEnabled(block, true);
      const strokeIsEnabled = engine.block.isStrokeEnabled(block);
      console.log('Stroke enabled:', strokeIsEnabled);

      // Set stroke color to blue
      engine.block.setStrokeColor(block, { r: 0.0, g: 0.4, b: 0.9, a: 1.0 });
      const strokeColor = engine.block.getStrokeColor(block);
      console.log('Stroke color:', strokeColor);

      // Set stroke width
      engine.block.setStrokeWidth(block, 8);
      const strokeWidth = engine.block.getStrokeWidth(block);
      console.log('Stroke width:', strokeWidth);

      // Apply a dashed stroke style
      engine.block.setStrokeStyle(block, 'Dashed');
      const strokeStyle = engine.block.getStrokeStyle(block);
      console.log('Stroke style:', strokeStyle);

      // Set stroke position to outer
      engine.block.setStrokePosition(block, 'Outer');
      const strokePosition = engine.block.getStrokePosition(block);
      console.log('Stroke position:', strokePosition);

      // Set corner geometry to round
      engine.block.setStrokeCornerGeometry(block, 'Round');
      const strokeCornerGeometry = engine.block.getStrokeCornerGeometry(block);
      console.log('Stroke corner geometry:', strokeCornerGeometry);
    }

    // Select the block to show it in the inspector
    engine.block.select(block);
  }
}

export default Example;
```

This guide covers how to use the stroke inspector panel for interactive editing and how to apply and manage strokes programmatically using the block API.

## Using the Built-in Stroke UI

The CE.SDK editor includes a stroke inspector panel for interactive stroke editing. When you select a block that supports strokes, the inspector displays stroke controls:

- **Enable toggle** - Turn strokes on or off for the selected block
- **Color picker** - Choose the stroke color with full RGBA support
- **Width control** - Adjust stroke thickness using a slider or input field
- **Style dropdown** - Select from solid, dashed, or dotted line patterns
- **Position options** - Choose where the stroke renders relative to the block edge (inner, center, or outer)

These controls provide a visual interface for users to customize strokes without writing code.

## Checking Stroke Support

Before applying strokes programmatically, verify the block supports them using `supportsStroke()`. Not all block types have stroke capabilities.

```typescript highlight=highlight-check-support
// Check if block supports strokes
const canHaveStroke = engine.block.supportsStroke(block);
console.log('Block supports stroke:', canHaveStroke);
```

## Enabling Strokes

Enable strokes on a block using `setStrokeEnabled()`. You can check the current state with `isStrokeEnabled()`.

```typescript highlight=highlight-enable-stroke
// Enable stroke on the block
engine.block.setStrokeEnabled(block, true);
const strokeIsEnabled = engine.block.isStrokeEnabled(block);
console.log('Stroke enabled:', strokeIsEnabled);
```

## Setting Stroke Color

Control stroke color using `setStrokeColor()` with an RGBA color object. Color values range from 0.0 to 1.0. Retrieve the current color with `getStrokeColor()`.

```typescript highlight=highlight-stroke-color
// Set stroke color to blue
engine.block.setStrokeColor(block, { r: 0.0, g: 0.4, b: 0.9, a: 1.0 });
const strokeColor = engine.block.getStrokeColor(block);
console.log('Stroke color:', strokeColor);
```

## Setting Stroke Width

Set stroke thickness in design units using `setStrokeWidth()`. Larger values create more prominent outlines. Get the current width with `getStrokeWidth()`.

```typescript highlight=highlight-stroke-width
// Set stroke width
engine.block.setStrokeWidth(block, 8);
const strokeWidth = engine.block.getStrokeWidth(block);
console.log('Stroke width:', strokeWidth);
```

## Stroke Styles

Control the line pattern using `setStrokeStyle()`. Available styles include:

- **Solid** - Continuous line
- **Dashed** - Square-ended dashes with gaps
- **DashedRound** - Round-ended dashes with gaps
- **Dotted** - Circular dots
- **LongDashed** - Longer square-ended dashes
- **LongDashedRound** - Longer round-ended dashes

```typescript highlight=highlight-stroke-style
// Apply a dashed stroke style
engine.block.setStrokeStyle(block, 'Dashed');
const strokeStyle = engine.block.getStrokeStyle(block);
console.log('Stroke style:', strokeStyle);
```

## Stroke Position

Control where the stroke renders relative to the block edge using `setStrokePosition()`:

- **Center** - Stroke centered on the edge (default)
- **Inner** - Stroke rendered inside the block boundary
- **Outer** - Stroke rendered outside the block boundary

Position affects how strokes interact with adjacent elements and overall layout dimensions. Inner strokes stay within the block bounds, while outer strokes extend beyond them.

```typescript highlight=highlight-stroke-position
// Set stroke position to outer
engine.block.setStrokePosition(block, 'Outer');
const strokePosition = engine.block.getStrokePosition(block);
console.log('Stroke position:', strokePosition);
```

## Stroke Corner Geometry

Control how stroke corners are rendered using `setStrokeCornerGeometry()`. This is particularly visible on rectangular shapes:

- **Miter** - Sharp pointed corners (default)
- **Round** - Smoothly curved corners
- **Bevel** - Flat cut corners

```typescript highlight=highlight-stroke-corner
// Set corner geometry to round
engine.block.setStrokeCornerGeometry(block, 'Round');
const strokeCornerGeometry = engine.block.getStrokeCornerGeometry(block);
console.log('Stroke corner geometry:', strokeCornerGeometry);
```

## Troubleshooting

If strokes don't appear as expected, check these common issues:

- **Stroke not visible** - Verify stroke is enabled with `isStrokeEnabled()` and width is greater than 0
- **Stroke color appears wrong** - Ensure color values are in the 0.0-1.0 range, not 0-255
- **Stroke affects layout unexpectedly** - Use Inner position to keep strokes within bounds, or Outer if you want strokes to extend beyond the block
- **Block doesn't support strokes** - Use `supportsStroke()` to verify capability before applying stroke properties

## API Reference

| Method                                       | Description                                    |
| -------------------------------------------- | ---------------------------------------------- |
| `block.supportsStroke(block)`                | Check if a block supports strokes              |
| `block.setStrokeEnabled(block, enabled)`     | Enable or disable stroke on a block            |
| `block.isStrokeEnabled(block)`               | Check if stroke is enabled                     |
| `block.setStrokeColor(block, color)`         | Set stroke color (RGBA, values 0.0-1.0)        |
| `block.getStrokeColor(block)`                | Get current stroke color                       |
| `block.setStrokeWidth(block, width)`         | Set stroke thickness in design units           |
| `block.getStrokeWidth(block)`                | Get current stroke width                       |
| `block.setStrokeStyle(block, style)`         | Set line pattern (Solid, Dashed, Dotted, etc.) |
| `block.getStrokeStyle(block)`                | Get current stroke style                       |
| `block.setStrokePosition(block, position)`   | Set stroke position (Center, Inner, Outer)     |
| `block.getStrokePosition(block)`             | Get current stroke position                    |
| `block.setStrokeCornerGeometry(block, type)` | Set corner rendering (Miter, Round, Bevel)     |
| `block.getStrokeCornerGeometry(block)`       | Get current corner geometry                    |



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support