> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Outlines](./outlines.md) > [Shadows and Glows](./outlines/shadows-and-glows.md)

---

Add visual depth and emphasis to design elements using drop shadows and glow effects in CE.SDK.

![Shadows and Glows example showing text with drop shadow, image with glow effect, and shape with both](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-outlines-shadows-and-glows-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-outlines-shadows-and-glows-browser)
>
> - [Live demo](https://img.ly/examples/guides-outlines-shadows-and-glows-browser/)

Drop shadows create the illusion of elements floating above the canvas, while glow effects add luminous halos that make elements stand out. CE.SDK provides two approaches: **drop shadows** as native block properties and **glow effects** through the effects system. Both can be applied to graphic blocks, text, and shapes.

```typescript file=@cesdk_web_examples/guides-outlines-shadows-and-glows-browser/browser.ts reference-only
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
  name = 'guides-outlines-shadows-and-glows-browser';
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

    // Add a gradient background that complements the beach image
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setFill(page, gradientFill);
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.0, g: 0.75, b: 0.85, a: 1.0 }, stop: 0.0 }, // Turquoise
      { color: { r: 0.95, g: 0.85, b: 0.7, a: 1.0 }, stop: 0.5 }, // Sandy
      { color: { r: 0.85, g: 0.55, b: 0.45, a: 1.0 }, stop: 1.0 } // Coral
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);

    // Create a title text block to demonstrate drop shadow
    const textBlock = engine.block.create('text');
    engine.block.replaceText(textBlock, 'Shadows & Glows');
    engine.block.setTextFontSize(textBlock, 80);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setPositionX(textBlock, 40);
    engine.block.setPositionY(textBlock, 40);
    engine.block.appendChild(page, textBlock);

    // Set text color to white for contrast
    const textFill = engine.block.getFill(textBlock);
    engine.block.setColor(textFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Check if block supports drop shadows
    const canHaveDropShadow = engine.block.supportsDropShadow(textBlock);
    console.log('Block supports drop shadow:', canHaveDropShadow);

    if (canHaveDropShadow) {
      // Enable drop shadow on the block
      engine.block.setDropShadowEnabled(textBlock, true);
      const shadowIsEnabled = engine.block.isDropShadowEnabled(textBlock);
      console.log('Drop shadow enabled:', shadowIsEnabled);

      // Set drop shadow color to a deep teal
      engine.block.setDropShadowColor(textBlock, {
        r: 0.0,
        g: 0.3,
        b: 0.4,
        a: 0.8
      });
      const shadowColor = engine.block.getDropShadowColor(textBlock);
      console.log('Drop shadow color:', shadowColor);

      // Set shadow offset (positive values move right/down)
      engine.block.setDropShadowOffsetX(textBlock, 6);
      engine.block.setDropShadowOffsetY(textBlock, 6);
      const offsetX = engine.block.getDropShadowOffsetX(textBlock);
      const offsetY = engine.block.getDropShadowOffsetY(textBlock);
      console.log('Drop shadow offset:', offsetX, offsetY);

      // Set blur radius for soft shadow edges
      engine.block.setDropShadowBlurRadiusX(textBlock, 12);
      engine.block.setDropShadowBlurRadiusY(textBlock, 12);
      const blurX = engine.block.getDropShadowBlurRadiusX(textBlock);
      const blurY = engine.block.getDropShadowBlurRadiusY(textBlock);
      console.log('Drop shadow blur:', blurX, blurY);
    }

    // Create an image block to demonstrate glow effect
    const imageUri = 'https://img.ly/static/ubq_samples/sample_4.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      x: 450,
      y: 150,
      size: { width: 300, height: 300 }
    });

    // Check if block supports effects (including glow)
    const canHaveEffects = engine.block.supportsEffects(imageBlock);
    console.log('Block supports effects:', canHaveEffects);

    if (canHaveEffects) {
      // Create and apply a glow effect
      const glowEffect = engine.block.createEffect('glow');
      engine.block.appendEffect(imageBlock, glowEffect);

      // Configure glow parameters
      engine.block.setFloat(glowEffect, 'effect/glow/size', 25);
      engine.block.setFloat(glowEffect, 'effect/glow/amount', 0.7);
      engine.block.setFloat(glowEffect, 'effect/glow/darkness', 0.25);
      console.log('Glow effect applied');
    }

    // Create a second image block to demonstrate combining shadow and glow
    const secondImageUri = 'https://img.ly/static/ubq_samples/sample_5.jpg';
    const combinedBlock = await engine.block.addImage(secondImageUri, {
      x: 50,
      y: 180,
      size: { width: 300, height: 300 }
    });

    // Apply both drop shadow and glow to the same block
    if (engine.block.supportsDropShadow(combinedBlock)) {
      engine.block.setDropShadowEnabled(combinedBlock, true);
      engine.block.setDropShadowColor(combinedBlock, {
        r: 0.0,
        g: 0.2,
        b: 0.3,
        a: 0.6
      });
      engine.block.setDropShadowOffsetX(combinedBlock, 8);
      engine.block.setDropShadowOffsetY(combinedBlock, 8);
      engine.block.setDropShadowBlurRadiusX(combinedBlock, 20);
      engine.block.setDropShadowBlurRadiusY(combinedBlock, 20);
    }

    if (engine.block.supportsEffects(combinedBlock)) {
      const combinedGlow = engine.block.createEffect('glow');
      engine.block.appendEffect(combinedBlock, combinedGlow);
      engine.block.setFloat(combinedGlow, 'effect/glow/size', 15);
      engine.block.setFloat(combinedGlow, 'effect/glow/amount', 0.5);
      engine.block.setFloat(combinedGlow, 'effect/glow/darkness', 0.15);
    }
    console.log('Combined shadow and glow applied');

    // Toggle drop shadow visibility
    const wasEnabled = engine.block.isDropShadowEnabled(textBlock);
    engine.block.setDropShadowEnabled(textBlock, false);
    console.log(
      'Shadow disabled:',
      !engine.block.isDropShadowEnabled(textBlock)
    );
    engine.block.setDropShadowEnabled(textBlock, wasEnabled);
    console.log(
      'Shadow re-enabled:',
      engine.block.isDropShadowEnabled(textBlock)
    );

    // Toggle glow effect visibility
    const effects = engine.block.getEffects(imageBlock);
    if (effects.length > 0) {
      const glowEffect = effects[0];
      engine.block.setEffectEnabled(glowEffect, false);
      console.log('Glow disabled:', !engine.block.isEffectEnabled(glowEffect));
      engine.block.setEffectEnabled(glowEffect, true);
      console.log('Glow re-enabled:', engine.block.isEffectEnabled(glowEffect));
    }

    // Select the text block to show it in the inspector
    engine.block.select(textBlock);
  }
}

export default Example;
```

This guide covers configuring drop shadows with dedicated API methods and applying glow effects through the effects system.

## Using the Built-in UI

The CE.SDK editor provides shadow controls in the inspector panel when you select a supported block. The UI includes:

- **Enable toggle** - Turn shadows on or off
- **Color picker** - Choose shadow color with RGBA support
- **Offset controls** - Adjust horizontal and vertical shadow position
- **Blur controls** - Set shadow softness

Select any text, shape, or image block and access the shadow settings through the inspector panel.

## Drop Shadow Configuration

Drop shadows are native block properties configured directly through dedicated API methods.

### Check Support and Enable

Before configuring drop shadows, verify the block supports them using `supportsDropShadow()`. Enable the shadow with `setDropShadowEnabled()`.

```typescript highlight=highlight-setup
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
```

Use `supportsDropShadow()` to check if the block supports shadows:

```typescript highlight=highlight-check-drop-shadow-support
// Check if block supports drop shadows
const canHaveDropShadow = engine.block.supportsDropShadow(textBlock);
console.log('Block supports drop shadow:', canHaveDropShadow);
```

Once verified, enable the drop shadow:

```typescript highlight=highlight-enable-drop-shadow
// Enable drop shadow on the block
engine.block.setDropShadowEnabled(textBlock, true);
const shadowIsEnabled = engine.block.isDropShadowEnabled(textBlock);
console.log('Drop shadow enabled:', shadowIsEnabled);
```

### Set Shadow Color

Configure the shadow color using `setDropShadowColor()` with an RGBA color object. Color values range from 0.0 to 1.0.

```typescript highlight=highlight-set-drop-shadow-color
// Set drop shadow color to a deep teal
engine.block.setDropShadowColor(textBlock, {
  r: 0.0,
  g: 0.3,
  b: 0.4,
  a: 0.8
});
const shadowColor = engine.block.getDropShadowColor(textBlock);
console.log('Drop shadow color:', shadowColor);
```

### Set Shadow Position

Control horizontal and vertical offset using `setDropShadowOffsetX()` and `setDropShadowOffsetY()`. Positive values move the shadow right and down, negative values move left and up.

```typescript highlight=highlight-set-drop-shadow-offset
// Set shadow offset (positive values move right/down)
engine.block.setDropShadowOffsetX(textBlock, 6);
engine.block.setDropShadowOffsetY(textBlock, 6);
const offsetX = engine.block.getDropShadowOffsetX(textBlock);
const offsetY = engine.block.getDropShadowOffsetY(textBlock);
console.log('Drop shadow offset:', offsetX, offsetY);
```

### Configure Blur Radius

Set shadow softness with `setDropShadowBlurRadiusX()` and `setDropShadowBlurRadiusY()`. Higher values create softer shadows.

```typescript highlight=highlight-set-drop-shadow-blur
// Set blur radius for soft shadow edges
engine.block.setDropShadowBlurRadiusX(textBlock, 12);
engine.block.setDropShadowBlurRadiusY(textBlock, 12);
const blurX = engine.block.getDropShadowBlurRadiusX(textBlock);
const blurY = engine.block.getDropShadowBlurRadiusY(textBlock);
console.log('Drop shadow blur:', blurX, blurY);
```

## Glow Effect Configuration

Glow effects are created through the effects system and attached to blocks that support effects.

### Check Support and Create Glow

Verify the block supports effects using `supportsEffects()`, then create a glow effect with `createEffect('glow')` and attach it using `appendEffect()`.

```typescript highlight=highlight-check-glow-support
// Check if block supports effects (including glow)
const canHaveEffects = engine.block.supportsEffects(imageBlock);
console.log('Block supports effects:', canHaveEffects);
```

Create the glow effect and attach it to the block:

```typescript highlight=highlight-create-glow-effect
// Create and apply a glow effect
const glowEffect = engine.block.createEffect('glow');
engine.block.appendEffect(imageBlock, glowEffect);
```

### Configure Glow Parameters

Adjust glow appearance using `setFloat()` with glow-specific properties:

- `effect/glow/size` - Controls the spread of the glow
- `effect/glow/amount` - Controls glow intensity (0.0 to 1.0)
- `effect/glow/darkness` - Controls the darkness/opacity of the glow

```typescript highlight=highlight-configure-glow
// Configure glow parameters
engine.block.setFloat(glowEffect, 'effect/glow/size', 25);
engine.block.setFloat(glowEffect, 'effect/glow/amount', 0.7);
engine.block.setFloat(glowEffect, 'effect/glow/darkness', 0.25);
console.log('Glow effect applied');
```

## Combining Shadows and Glows

Drop shadows and glow effects can both be applied to the same block. Drop shadows render independently of the effects stack, so both appear simultaneously.

```typescript highlight=highlight-combine-shadow-glow
    // Apply both drop shadow and glow to the same block
    if (engine.block.supportsDropShadow(combinedBlock)) {
      engine.block.setDropShadowEnabled(combinedBlock, true);
      engine.block.setDropShadowColor(combinedBlock, {
        r: 0.0,
        g: 0.2,
        b: 0.3,
        a: 0.6
      });
      engine.block.setDropShadowOffsetX(combinedBlock, 8);
      engine.block.setDropShadowOffsetY(combinedBlock, 8);
      engine.block.setDropShadowBlurRadiusX(combinedBlock, 20);
      engine.block.setDropShadowBlurRadiusY(combinedBlock, 20);
    }

    if (engine.block.supportsEffects(combinedBlock)) {
      const combinedGlow = engine.block.createEffect('glow');
      engine.block.appendEffect(combinedBlock, combinedGlow);
      engine.block.setFloat(combinedGlow, 'effect/glow/size', 15);
      engine.block.setFloat(combinedGlow, 'effect/glow/amount', 0.5);
      engine.block.setFloat(combinedGlow, 'effect/glow/darkness', 0.15);
    }
    console.log('Combined shadow and glow applied');
```

## Managing Shadow and Glow State

### Toggle Drop Shadows

Enable or disable drop shadows with `setDropShadowEnabled()`. Query the current state with `isDropShadowEnabled()`.

```typescript highlight=highlight-toggle-shadow
// Toggle drop shadow visibility
const wasEnabled = engine.block.isDropShadowEnabled(textBlock);
engine.block.setDropShadowEnabled(textBlock, false);
console.log(
  'Shadow disabled:',
  !engine.block.isDropShadowEnabled(textBlock)
);
engine.block.setDropShadowEnabled(textBlock, wasEnabled);
console.log(
  'Shadow re-enabled:',
  engine.block.isDropShadowEnabled(textBlock)
);
```

### Toggle Glow Effects

Enable or disable glow effects with `setEffectEnabled()`. Query the state with `isEffectEnabled()`.

```typescript highlight=highlight-toggle-glow
// Toggle glow effect visibility
const effects = engine.block.getEffects(imageBlock);
if (effects.length > 0) {
  const glowEffect = effects[0];
  engine.block.setEffectEnabled(glowEffect, false);
  console.log('Glow disabled:', !engine.block.isEffectEnabled(glowEffect));
  engine.block.setEffectEnabled(glowEffect, true);
  console.log('Glow re-enabled:', engine.block.isEffectEnabled(glowEffect));
}
```

## Troubleshooting

### Shadow Not Visible

- Verify the block supports drop shadows using `supportsDropShadow()`
- Check that drop shadow is enabled with `isDropShadowEnabled()`
- Ensure offset values are non-zero to see the shadow
- Verify the shadow color has sufficient opacity (alpha channel)

### Glow Not Appearing

- Verify the block supports effects using `supportsEffects()`
- Check that the effect is enabled with `isEffectEnabled()`
- Ensure glow amount and size are greater than 0

### Performance Issues

- Limit the number of effects per block on mobile devices
- Consider disabling shadows/glows during intensive editing operations
- Use reasonable blur radius values to maintain performance

## API Reference

| Method                                             | Description                         |
| -------------------------------------------------- | ----------------------------------- |
| `block.supportsDropShadow(block)`                  | Check if block supports drop shadows |
| `block.setDropShadowEnabled(block, enabled)`       | Enable or disable drop shadow       |
| `block.isDropShadowEnabled(block)`                 | Check if drop shadow is enabled     |
| `block.setDropShadowColor(block, color)`           | Set shadow color (RGBA)             |
| `block.getDropShadowColor(block)`                  | Get current shadow color            |
| `block.setDropShadowOffsetX(block, offset)`        | Set horizontal shadow offset        |
| `block.setDropShadowOffsetY(block, offset)`        | Set vertical shadow offset          |
| `block.getDropShadowOffsetX(block)`                | Get horizontal offset               |
| `block.getDropShadowOffsetY(block)`                | Get vertical offset                 |
| `block.setDropShadowBlurRadiusX(block, radius)`    | Set horizontal blur radius          |
| `block.setDropShadowBlurRadiusY(block, radius)`    | Set vertical blur radius            |
| `block.getDropShadowBlurRadiusX(block)`            | Get horizontal blur radius          |
| `block.getDropShadowBlurRadiusY(block)`            | Get vertical blur radius            |
| `block.supportsEffects(block)`                     | Check if block supports effects     |
| `block.createEffect('glow')`                       | Create a glow effect instance       |
| `block.appendEffect(block, effect)`                | Attach glow to a block              |
| `block.setFloat(effect, property, value)`          | Set glow parameters                 |
| `block.setEffectEnabled(effect, enabled)`          | Enable or disable glow              |
| `block.isEffectEnabled(effect)`                    | Check if glow is enabled            |
| `block.getEffects(block)`                          | Get all effects on a block          |

## Next Steps

[Using Strokes](./outlines/strokes.md) - Add border outlines to elements

[Apply Filters and Effects](./filters-and-effects/apply.md) - Explore additional visual effects

[Blur Effects](./filters-and-effects/blur.md) - Apply blur effects to elements



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support