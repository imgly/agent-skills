> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Blend Modes](./create-composition/blend-modes.md)

---

Control how design blocks visually blend with underlying layers using CE.SDK's
blend mode system for professional layered compositions.

![Blend Modes example showing layered images with blend effects applied](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-composition-blend-modes-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-composition-blend-modes-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-composition-blend-modes-browser/)

Blend modes control how a block's colors combine with underlying layers, similar to blend modes in Photoshop or other design tools. CE.SDK provides 27 blend modes organized into categories: Normal, Darken, Lighten, Contrast, Inversion, and Component. Each category serves different compositing needs—darken modes make images darker, lighten modes make them brighter, and contrast modes increase midtone contrast.

```typescript file=@cesdk_web_examples/guides-create-composition-blend-modes-browser/browser.ts reference-only
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
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Blend Modes Guide
 *
 * This example demonstrates:
 * - Checking if a block supports blend modes
 * - Setting blend modes on overlay layers
 * - Getting the current blend mode of a block
 * - Working with opacity values
 * - Available blend mode values
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;
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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const page = engine.block.findByType('page')[0];

    // Grid configuration: 3 columns x 2 rows
    const cols = 3;
    const rows = 2;
    const cellWidth = 280;
    const cellHeight = 210;
    const padding = 20;
    const pageWidth = cols * cellWidth + (cols + 1) * padding;
    const pageHeight = rows * cellHeight + (rows + 1) * padding;

    // Set page dimensions
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Base and overlay image URLs
    const baseImageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const overlayImageUrl = 'https://img.ly/static/ubq_samples/sample_2.jpg';

    // Six commonly used blend modes to demonstrate
    const blendModes: Array<
      'Multiply' | 'Screen' | 'Overlay' | 'Darken' | 'Lighten' | 'ColorBurn'
    > = ['Multiply', 'Screen', 'Overlay', 'Darken', 'Lighten', 'ColorBurn'];

    // Create 6 image pairs in a grid layout
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        const x = padding + col * (cellWidth + padding);
        const y = padding + row * (cellHeight + padding);

        // Create a background image block as the base layer
        const backgroundBlock = engine.block.create('graphic');
        const backgroundShape = engine.block.createShape('rect');
        engine.block.setShape(backgroundBlock, backgroundShape);
        engine.block.setWidth(backgroundBlock, cellWidth);
        engine.block.setHeight(backgroundBlock, cellHeight);
        engine.block.setPositionX(backgroundBlock, x);
        engine.block.setPositionY(backgroundBlock, y);

        // Set the image fill for the background
        const backgroundFill = engine.block.createFill('image');
        engine.block.setString(
          backgroundFill,
          'fill/image/imageFileURI',
          baseImageUrl
        );
        engine.block.setFill(backgroundBlock, backgroundFill);
        engine.block.setContentFillMode(backgroundBlock, 'Cover');
        engine.block.appendChild(page, backgroundBlock);

        // Create a second image block on top for blending
        const overlayBlock = engine.block.create('graphic');
        const overlayShape = engine.block.createShape('rect');
        engine.block.setShape(overlayBlock, overlayShape);
        engine.block.setWidth(overlayBlock, cellWidth);
        engine.block.setHeight(overlayBlock, cellHeight);
        engine.block.setPositionX(overlayBlock, x);
        engine.block.setPositionY(overlayBlock, y);

        // Set a different image fill for the overlay
        const overlayFill = engine.block.createFill('image');
        engine.block.setString(
          overlayFill,
          'fill/image/imageFileURI',
          overlayImageUrl
        );
        engine.block.setFill(overlayBlock, overlayFill);
        engine.block.setContentFillMode(overlayBlock, 'Cover');
        engine.block.appendChild(page, overlayBlock);

        // Check if the block supports blend modes before applying
        if (engine.block.supportsBlendMode(overlayBlock)) {

          // Apply a different blend mode to each overlay
          const blendMode = blendModes[index];
          engine.block.setBlendMode(overlayBlock, blendMode);

          // Retrieve and log the current blend mode
          const currentMode = engine.block.getBlendMode(overlayBlock);
          // eslint-disable-next-line no-console
          console.log(`Cell ${index + 1} blend mode:`, currentMode);
        }

        // Check if the block supports opacity
        if (engine.block.supportsOpacity(overlayBlock)) {
          // Set the opacity to 80% for clear visibility
          engine.block.setOpacity(overlayBlock, 0.8);
        }

        // Retrieve and log the opacity value
        const opacity = engine.block.getOpacity(overlayBlock);
        // eslint-disable-next-line no-console
        console.log(`Cell ${index + 1} opacity:`, opacity);
      }
    }

    // Zoom to fit the composition
    await engine.scene.zoomToBlock(page, {
      padding: {
        left: 40,
        top: 40,
        right: 40,
        bottom: 40
      }
    });
  }
}

export default Example;
```

This guide covers how to check blend mode support, apply blend modes programmatically, understand the available blend mode options, and combine blend modes with opacity for fine control over layer compositing.

## Checking Blend Mode Support

Before applying a blend mode, verify that the block supports it using `supportsBlendMode()`. Most graphic blocks support blend modes, but always check to avoid errors.

```typescript highlight-check-support
// Check if the block supports blend modes before applying
if (engine.block.supportsBlendMode(overlayBlock)) {
```

Blend mode support is available for graphic blocks with image or video fills, shape blocks, and text blocks. Page blocks and scene blocks typically do not support blend modes directly.

## Setting and Getting Blend Modes

Apply a blend mode with `setBlendMode()` and retrieve the current mode with `getBlendMode()`. The default blend mode is `'Normal'`, which displays the block without any blending effect.

```typescript highlight-set-blend-mode
// Apply a different blend mode to each overlay
const blendMode = blendModes[index];
engine.block.setBlendMode(overlayBlock, blendMode);
```

After setting a blend mode, you can confirm the change by retrieving the current value:

```typescript highlight-get-blend-mode
// Retrieve and log the current blend mode
const currentMode = engine.block.getBlendMode(overlayBlock);
// eslint-disable-next-line no-console
console.log(`Cell ${index + 1} blend mode:`, currentMode);
```

## Available Blend Modes

CE.SDK provides 27 blend modes organized into categories, each producing different visual results:

### Normal Modes

- **`PassThrough`** - Allows children of a group to blend with layers below the group
- **`Normal`** - Default mode with no blending effect

### Darken Modes

These modes darken the result by comparing the base and blend colors:

- **`Darken`** - Selects the darker of the base and blend colors
- **`Multiply`** - Multiplies colors, producing darker results (great for shadows)
- **`ColorBurn`** - Darkens base color by increasing contrast
- **`LinearBurn`** - Darkens base color by decreasing brightness
- **`DarkenColor`** - Selects the darker color based on luminosity

### Lighten Modes

These modes lighten the result by comparing colors:

- **`Lighten`** - Selects the lighter of the base and blend colors
- **`Screen`** - Multiplies the inverse of colors, producing lighter results (great for highlights)
- **`ColorDodge`** - Lightens base color by decreasing contrast
- **`LinearDodge`** - Lightens base color by increasing brightness
- **`LightenColor`** - Selects the lighter color based on luminosity

### Contrast Modes

These modes increase midtone contrast:

- **`Overlay`** - Combines Multiply and Screen based on the base color
- **`SoftLight`** - Similar to Overlay but with a softer effect
- **`HardLight`** - Similar to Overlay but based on the blend color
- **`VividLight`** - Burns or dodges colors based on the blend color
- **`LinearLight`** - Increases or decreases brightness based on blend color
- **`PinLight`** - Replaces colors based on the blend color
- **`HardMix`** - Reduces colors to white, black, or primary colors

### Inversion Modes

These modes create inverted or subtracted effects:

- **`Difference`** - Subtracts the darker from the lighter color
- **`Exclusion`** - Similar to Difference with lower contrast
- **`Subtract`** - Subtracts blend color from base color
- **`Divide`** - Divides base color by blend color

### Component Modes

These modes affect specific color components:

- **`Hue`** - Uses the hue of the blend color with base saturation and luminosity
- **`Saturation`** - Uses the saturation of the blend color
- **`Color`** - Uses the hue and saturation of the blend color
- **`Luminosity`** - Uses the luminosity of the blend color

## Combining Blend Modes with Opacity

For finer control over compositing, combine blend modes with opacity. Opacity reduces overall visibility while the blend mode affects color interaction with underlying layers.

```typescript highlight-set-opacity
// Check if the block supports opacity
if (engine.block.supportsOpacity(overlayBlock)) {
  // Set the opacity to 80% for clear visibility
  engine.block.setOpacity(overlayBlock, 0.8);
}
```

You can retrieve the current opacity value to confirm changes or read existing state:

```typescript highlight-get-opacity
// Retrieve and log the opacity value
const opacity = engine.block.getOpacity(overlayBlock);
// eslint-disable-next-line no-console
console.log(`Cell ${index + 1} opacity:`, opacity);
```

> **Tip:** Start with full opacity (1.0) when experimenting with blend modes, then reduce
> opacity to soften the effect. Common values are 0.5-0.7 for subtle blending
> effects.

## Troubleshooting

### Blend Mode Has No Visible Effect

If a blend mode doesn't produce visible changes:

- Ensure there are underlying layers for the block to blend with. Blend modes only affect compositing with content below.
- Verify the blend mode is applied to the correct block using `getBlendMode()`.
- Check that the block has visible content (fill or image) to blend.

### Cannot Set Blend Mode

If `setBlendMode()` throws an error:

- Check that `supportsBlendMode()` returns `true` for the block.
- Verify the block ID is valid and the block exists in the scene.
- Ensure you're passing a valid blend mode string from the available options.

### Unexpected Blending Results

If the visual result doesn't match expectations:

- Verify the blend mode category matches your intent (darken vs lighten vs contrast).
- Check the stacking order of blocks—blend modes affect content below the block.
- Experiment with different blend modes from the same category to find the best visual match.

## API Reference

| Method                                   | Description                                       |
| ---------------------------------------- | ------------------------------------------------- |
| `engine.block.supportsBlendMode(id)`     | Check if a block supports blend modes             |
| `engine.block.setBlendMode(id, mode)`    | Set the blend mode for a block                    |
| `engine.block.getBlendMode(id)`          | Get the current blend mode of a block             |
| `engine.block.supportsOpacity(id)`       | Check if a block supports opacity                 |
| `engine.block.setOpacity(id, opacity)`   | Set the opacity for a block (0-1)                 |
| `engine.block.getOpacity(id)`            | Get the current opacity of a block                |



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support