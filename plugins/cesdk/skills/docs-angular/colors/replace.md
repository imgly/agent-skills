> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [Replace Individual Colors](./colors/replace.md)

---

Selectively replace specific colors in images using CE.SDK's Recolor and Green Screen effects.

![Replace Colors Hero](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-colors-replace-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-colors-replace-browser)
>
> - [Live demo](https://img.ly/examples/guides-colors-replace-browser/)

CE.SDK provides two specialized effects for color replacement: the **Recolor** effect swaps pixels matching a source color with a target color, while the **Green Screen** effect removes pixels matching a specified color to create transparency. Both effects use configurable tolerance parameters to control which pixels are affected, enabling use cases from product color variations to background removal.

```typescript file=@cesdk_web_examples/guides-colors-replace-browser/browser.ts reference-only
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
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Replace Colors Guide
 *
 * Demonstrates color replacement using Recolor and Green Screen effects:
 * - Using the built-in effects UI
 * - Creating and applying Recolor effects
 * - Creating and applying Green Screen effects
 * - Configuring effect properties
 * - Managing multiple effects
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

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
    const page = engine.block.findByType('page')[0];

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Enable effects in the inspector panel using the Feature API
    cesdk.feature.enable('ly.img.effect');

    // Calculate responsive grid layout for 6 examples
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Use sample images for demonstrations
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const blockSize = { width: blockWidth, height: blockHeight };

    // Create a Recolor effect to swap red colors to blue
    const block1 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block1);

    const recolorEffect = engine.block.createEffect('recolor');
    engine.block.setColor(recolorEffect, 'effect/recolor/fromColor', {
      r: 1.0,
      g: 0.0,
      b: 0.0,
      a: 1.0
    }); // Red source color
    engine.block.setColor(recolorEffect, 'effect/recolor/toColor', {
      r: 0.0,
      g: 0.5,
      b: 1.0,
      a: 1.0
    }); // Blue target color
    engine.block.appendEffect(block1, recolorEffect);

    // Select this block to show the effects panel
    engine.block.setSelected(block1, true);

    // Configure color matching precision for Recolor effect
    const block2 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block2);

    const recolorEffect2 = engine.block.createEffect('recolor');
    engine.block.setColor(recolorEffect2, 'effect/recolor/fromColor', {
      r: 0.8,
      g: 0.6,
      b: 0.4,
      a: 1.0
    }); // Skin tone source
    engine.block.setColor(recolorEffect2, 'effect/recolor/toColor', {
      r: 0.3,
      g: 0.7,
      b: 0.3,
      a: 1.0
    }); // Green tint
    // Adjust color match tolerance (0-1, higher = more inclusive)
    engine.block.setFloat(recolorEffect2, 'effect/recolor/colorMatch', 0.3);
    // Adjust brightness match tolerance
    engine.block.setFloat(
      recolorEffect2,
      'effect/recolor/brightnessMatch',
      0.2
    );
    // Adjust edge smoothness
    engine.block.setFloat(recolorEffect2, 'effect/recolor/smoothness', 0.1);
    engine.block.appendEffect(block2, recolorEffect2);

    // Create a Green Screen effect to remove green backgrounds
    const block3 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block3);

    const greenScreenEffect = engine.block.createEffect('green_screen');
    // Specify the color to remove (green)
    engine.block.setColor(greenScreenEffect, 'effect/green_screen/fromColor', {
      r: 0.0,
      g: 1.0,
      b: 0.0,
      a: 1.0
    });
    engine.block.appendEffect(block3, greenScreenEffect);

    // Fine-tune Green Screen removal parameters
    const block4 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block4);

    const greenScreenEffect2 = engine.block.createEffect('green_screen');
    engine.block.setColor(greenScreenEffect2, 'effect/green_screen/fromColor', {
      r: 0.2,
      g: 0.8,
      b: 0.3,
      a: 1.0
    }); // Specific green shade
    // Adjust color match tolerance
    engine.block.setFloat(
      greenScreenEffect2,
      'effect/green_screen/colorMatch',
      0.4
    );
    // Adjust edge smoothness for cleaner removal
    engine.block.setFloat(
      greenScreenEffect2,
      'effect/green_screen/smoothness',
      0.2
    );
    // Reduce color spill from green background
    engine.block.setFloat(greenScreenEffect2, 'effect/green_screen/spill', 0.5);
    engine.block.appendEffect(block4, greenScreenEffect2);

    // Demonstrate managing multiple effects on a block
    const block5 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block5);

    // Add multiple effects to the same block
    const recolor1 = engine.block.createEffect('recolor');
    engine.block.setColor(recolor1, 'effect/recolor/fromColor', {
      r: 1.0,
      g: 0.0,
      b: 0.0,
      a: 1.0
    });
    engine.block.setColor(recolor1, 'effect/recolor/toColor', {
      r: 0.0,
      g: 0.0,
      b: 1.0,
      a: 1.0
    });
    engine.block.appendEffect(block5, recolor1);

    const recolor2 = engine.block.createEffect('recolor');
    engine.block.setColor(recolor2, 'effect/recolor/fromColor', {
      r: 0.0,
      g: 1.0,
      b: 0.0,
      a: 1.0
    });
    engine.block.setColor(recolor2, 'effect/recolor/toColor', {
      r: 1.0,
      g: 0.5,
      b: 0.0,
      a: 1.0
    });
    engine.block.appendEffect(block5, recolor2);

    // Get all effects on the block
    const effects = engine.block.getEffects(block5);
    // eslint-disable-next-line no-console
    console.log('Number of effects:', effects.length); // 2

    // Disable the first effect without removing it
    engine.block.setEffectEnabled(effects[0], false);

    // Check if effect is enabled
    const isEnabled = engine.block.isEffectEnabled(effects[0]);
    // eslint-disable-next-line no-console
    console.log('First effect enabled:', isEnabled); // false

    // Apply consistent color replacement across multiple blocks
    const block6 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block6);

    // Find all image blocks in the scene
    const allBlocks = engine.block.findByType('//ly.img.ubq/graphic');

    // Apply a consistent recolor effect to each block
    allBlocks.forEach((blockId) => {
      // Skip if block already has effects
      if (engine.block.getEffects(blockId).length > 0) {
        return;
      }

      const batchRecolor = engine.block.createEffect('recolor');
      engine.block.setColor(batchRecolor, 'effect/recolor/fromColor', {
        r: 0.8,
        g: 0.7,
        b: 0.6,
        a: 1.0
      });
      engine.block.setColor(batchRecolor, 'effect/recolor/toColor', {
        r: 0.6,
        g: 0.7,
        b: 0.9,
        a: 1.0
      });
      engine.block.setFloat(batchRecolor, 'effect/recolor/colorMatch', 0.25);
      engine.block.appendEffect(blockId, batchRecolor);
    });

    // Position all blocks in a grid layout
    const blocks = [block1, block2, block3, block4, block5, block6];
    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Zoom to show all blocks
    engine.block.setSelected(block1, true);
    cesdk.engine.scene.zoomToBlock(page);
  }
}

export default Example;
```

This guide covers how to enable the built-in effects panel for interactive editing and how to apply and manage color replacement effects programmatically using the Block API.

## Using the Built-in Effects UI

The CE.SDK editor provides a visual effects panel where users can add and configure Recolor and Green Screen effects interactively. Enable the effects feature using the Feature API, then users can access effects through the inspector panel.

To enable effects in your editor configuration:

```typescript highlight=highlight-enable-effects-panel
// Enable effects in the inspector panel using the Feature API
cesdk.feature.enable('ly.img.effect');
```

With effects enabled, users can:

- Select an image block and open the effects panel
- Add Recolor or Green Screen effects from the available options
- Use visual color pickers to select source and target colors
- Adjust tolerance sliders for color match, brightness match, and smoothness
- See changes applied in real-time on the canvas

## Programmatic Color Replacement

For automation workflows or custom implementations, you can create and apply color replacement effects programmatically using the Block API. Effects are created as blocks, configured with properties, and appended to target blocks.

### Creating a Recolor Effect

The Recolor effect replaces pixels matching a source color with a target color. Use `engine.block.createEffect('recolor')` to create the effect, then set the `fromColor` and `toColor` properties using `engine.block.setColor()`.

```typescript highlight=highlight-create-recolor-effect
    // Create a Recolor effect to swap red colors to blue
    const block1 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block1);

    const recolorEffect = engine.block.createEffect('recolor');
    engine.block.setColor(recolorEffect, 'effect/recolor/fromColor', {
      r: 1.0,
      g: 0.0,
      b: 0.0,
      a: 1.0
    }); // Red source color
    engine.block.setColor(recolorEffect, 'effect/recolor/toColor', {
      r: 0.0,
      g: 0.5,
      b: 1.0,
      a: 1.0
    }); // Blue target color
    engine.block.appendEffect(block1, recolorEffect);

    // Select this block to show the effects panel
    engine.block.setSelected(block1, true);
```

The `fromColor` specifies which color to match in the image, and `toColor` defines the replacement color. Colors use RGBA format with values from 0 to 1.

### Configuring Color Matching Precision

Fine-tune which pixels are affected by adjusting the tolerance parameters with `engine.block.setFloat()`:

```typescript highlight=highlight-configure-recolor-matching
    // Configure color matching precision for Recolor effect
    const block2 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block2);

    const recolorEffect2 = engine.block.createEffect('recolor');
    engine.block.setColor(recolorEffect2, 'effect/recolor/fromColor', {
      r: 0.8,
      g: 0.6,
      b: 0.4,
      a: 1.0
    }); // Skin tone source
    engine.block.setColor(recolorEffect2, 'effect/recolor/toColor', {
      r: 0.3,
      g: 0.7,
      b: 0.3,
      a: 1.0
    }); // Green tint
    // Adjust color match tolerance (0-1, higher = more inclusive)
    engine.block.setFloat(recolorEffect2, 'effect/recolor/colorMatch', 0.3);
    // Adjust brightness match tolerance
    engine.block.setFloat(
      recolorEffect2,
      'effect/recolor/brightnessMatch',
      0.2
    );
    // Adjust edge smoothness
    engine.block.setFloat(recolorEffect2, 'effect/recolor/smoothness', 0.1);
    engine.block.appendEffect(block2, recolorEffect2);
```

The Recolor effect has three precision parameters:

- **colorMatch** (0-1): Controls hue tolerance. Higher values include more color variations around the source color.
- **brightnessMatch** (0-1): Controls luminance tolerance. Higher values include pixels with different brightness levels.
- **smoothness** (0-1): Controls edge blending. Higher values create softer transitions at the boundaries of affected areas.

### Creating a Green Screen Effect

The Green Screen effect removes pixels matching a specified color, making them transparent. This is commonly used for background removal.

```typescript highlight=highlight-create-green-screen-effect
    // Create a Green Screen effect to remove green backgrounds
    const block3 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block3);

    const greenScreenEffect = engine.block.createEffect('green_screen');
    // Specify the color to remove (green)
    engine.block.setColor(greenScreenEffect, 'effect/green_screen/fromColor', {
      r: 0.0,
      g: 1.0,
      b: 0.0,
      a: 1.0
    });
    engine.block.appendEffect(block3, greenScreenEffect);
```

Set the `fromColor` property to specify which color to remove. The effect will make matching pixels transparent.

### Configuring Green Screen Parameters

Control the precision of color removal using these parameters:

```typescript highlight=highlight-configure-green-screen
    // Fine-tune Green Screen removal parameters
    const block4 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block4);

    const greenScreenEffect2 = engine.block.createEffect('green_screen');
    engine.block.setColor(greenScreenEffect2, 'effect/green_screen/fromColor', {
      r: 0.2,
      g: 0.8,
      b: 0.3,
      a: 1.0
    }); // Specific green shade
    // Adjust color match tolerance
    engine.block.setFloat(
      greenScreenEffect2,
      'effect/green_screen/colorMatch',
      0.4
    );
    // Adjust edge smoothness for cleaner removal
    engine.block.setFloat(
      greenScreenEffect2,
      'effect/green_screen/smoothness',
      0.2
    );
    // Reduce color spill from green background
    engine.block.setFloat(greenScreenEffect2, 'effect/green_screen/spill', 0.5);
    engine.block.appendEffect(block4, greenScreenEffect2);
```

The Green Screen effect parameters:

- **colorMatch**: Tolerance for matching the background color
- **smoothness**: Edge softness for cleaner cutouts around subjects
- **spill**: Reduces color bleed from the removed background onto the subject, useful when the background color reflects onto edges

## Managing Multiple Effects

A single block can have multiple effects applied. Use the effect management APIs to list, toggle, and remove effects.

```typescript highlight=highlight-manage-effects
    // Demonstrate managing multiple effects on a block
    const block5 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block5);

    // Add multiple effects to the same block
    const recolor1 = engine.block.createEffect('recolor');
    engine.block.setColor(recolor1, 'effect/recolor/fromColor', {
      r: 1.0,
      g: 0.0,
      b: 0.0,
      a: 1.0
    });
    engine.block.setColor(recolor1, 'effect/recolor/toColor', {
      r: 0.0,
      g: 0.0,
      b: 1.0,
      a: 1.0
    });
    engine.block.appendEffect(block5, recolor1);

    const recolor2 = engine.block.createEffect('recolor');
    engine.block.setColor(recolor2, 'effect/recolor/fromColor', {
      r: 0.0,
      g: 1.0,
      b: 0.0,
      a: 1.0
    });
    engine.block.setColor(recolor2, 'effect/recolor/toColor', {
      r: 1.0,
      g: 0.5,
      b: 0.0,
      a: 1.0
    });
    engine.block.appendEffect(block5, recolor2);

    // Get all effects on the block
    const effects = engine.block.getEffects(block5);
    // eslint-disable-next-line no-console
    console.log('Number of effects:', effects.length); // 2

    // Disable the first effect without removing it
    engine.block.setEffectEnabled(effects[0], false);

    // Check if effect is enabled
    const isEnabled = engine.block.isEffectEnabled(effects[0]);
    // eslint-disable-next-line no-console
    console.log('First effect enabled:', isEnabled); // false
```

Key effect management methods:

- `engine.block.getEffects(blockId)`: Returns an array of all effect IDs attached to a block
- `engine.block.setEffectEnabled(effectId, enabled)`: Toggle an effect on/off without removing it
- `engine.block.isEffectEnabled(effectId)`: Check whether an effect is currently active
- `engine.block.removeEffect(blockId, index)`: Remove an effect by its index in the effects array

Stacking multiple Recolor effects enables complex color transformations, such as replacing multiple colors in a single image or creating variations.

## Troubleshooting

**Colors not matching as expected**: Increase the `colorMatch` tolerance for broader selection, or decrease it for more precise matching. Check that your source color closely matches the actual color in the image.

**Harsh edges around replaced areas**: Increase the `smoothness` value to create softer transitions at the boundaries of affected pixels.

**Color spill on Green Screen subjects**: Increase the `spill` value to reduce the green tint that often appears on edges when removing green backgrounds.

**Effect not visible**: Verify that the effect is enabled using `isEffectEnabled()` and that it has been appended to the block using `appendEffect()`.



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support