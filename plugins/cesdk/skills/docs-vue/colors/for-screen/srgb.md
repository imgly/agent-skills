> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [For Screen](./colors/for-screen.md) > [sRGB Colors](./colors/for-screen/srgb.md)

---

Apply sRGB colors to design elements for screen-based output using RGBA color values with red, green, blue, and alpha components.

![sRGB Colors example showing colored shapes with fills, strokes, shadows, and transparency](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-colors-for-screen-srgb-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-colors-for-screen-srgb-browser)
>
> - [Live demo](https://img.ly/examples/guides-colors-for-screen-srgb-browser/)

sRGB is the standard color space for screen displays. CE.SDK represents sRGB colors as RGBA objects where each component (red, green, blue, alpha) uses floating-point values between 0.0 and 1.0. This differs from the traditional 0-255 integer range used in many design tools.

```typescript file=@cesdk_web_examples/guides-colors-for-screen-srgb-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import { isRGBAColor } from '@cesdk/engine';
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
 * CE.SDK Plugin: sRGB Colors Guide
 *
 * This example demonstrates:
 * - Creating sRGB/RGBA colors
 * - Applying sRGB colors to fills, strokes, and shadows
 * - Retrieving colors from design elements
 * - Converting colors to sRGB
 * - Working with alpha transparency
 * - Using type guards to identify RGBA colors
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

    // Create a design scene using CE.SDK
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Create RGBA color objects for sRGB color space
    // Values are floating-point numbers between 0.0 and 1.0
    const blueColor = { r: 0.2, g: 0.4, b: 0.9, a: 1.0 };
    const redColor = { r: 0.9, g: 0.2, b: 0.2, a: 1.0 };
    const greenColor = { r: 0.2, g: 0.8, b: 0.3, a: 1.0 };

    // Create semi-transparent colors using the alpha channel
    // Alpha of 0.5 means 50% opacity
    const semiTransparentPurple = { r: 0.6, g: 0.2, b: 0.8, a: 0.5 };
    const semiTransparentOrange = { r: 1.0, g: 0.5, b: 0.0, a: 0.7 };

    // Create blocks to demonstrate color application
    const block1 = engine.block.create('graphic');
    engine.block.setShape(block1, engine.block.createShape('rect'));
    engine.block.setWidth(block1, 150);
    engine.block.setHeight(block1, 150);
    engine.block.setPositionX(block1, 50);
    engine.block.setPositionY(block1, 50);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    engine.block.setShape(block2, engine.block.createShape('ellipse'));
    engine.block.setWidth(block2, 150);
    engine.block.setHeight(block2, 150);
    engine.block.setPositionX(block2, 250);
    engine.block.setPositionY(block2, 50);
    engine.block.appendChild(page, block2);

    const block3 = engine.block.create('graphic');
    engine.block.setShape(block3, engine.block.createShape('rect'));
    engine.block.setWidth(block3, 150);
    engine.block.setHeight(block3, 150);
    engine.block.setPositionX(block3, 450);
    engine.block.setPositionY(block3, 50);
    engine.block.appendChild(page, block3);

    // Apply sRGB colors to block fills
    // First create a color fill, then set its color value
    const fill1 = engine.block.createFill('color');
    engine.block.setFill(block1, fill1);
    engine.block.setColor(fill1, 'fill/color/value', blueColor);

    const fill2 = engine.block.createFill('color');
    engine.block.setFill(block2, fill2);
    engine.block.setColor(fill2, 'fill/color/value', redColor);

    const fill3 = engine.block.createFill('color');
    engine.block.setFill(block3, fill3);
    engine.block.setColor(fill3, 'fill/color/value', greenColor);

    // Create blocks for stroke demonstration
    const strokeBlock = engine.block.create('graphic');
    engine.block.setShape(strokeBlock, engine.block.createShape('rect'));
    engine.block.setWidth(strokeBlock, 150);
    engine.block.setHeight(strokeBlock, 150);
    engine.block.setPositionX(strokeBlock, 50);
    engine.block.setPositionY(strokeBlock, 250);
    engine.block.appendChild(page, strokeBlock);

    const strokeFill = engine.block.createFill('color');
    engine.block.setFill(strokeBlock, strokeFill);
    engine.block.setColor(strokeFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Apply sRGB color to stroke
    engine.block.setStrokeEnabled(strokeBlock, true);
    engine.block.setStrokeWidth(strokeBlock, 5);
    engine.block.setColor(strokeBlock, 'stroke/color', {
      r: 0.1,
      g: 0.1,
      b: 0.5,
      a: 1.0
    });

    // Create block for drop shadow demonstration
    const shadowBlock = engine.block.create('graphic');
    engine.block.setShape(shadowBlock, engine.block.createShape('rect'));
    engine.block.setWidth(shadowBlock, 150);
    engine.block.setHeight(shadowBlock, 150);
    engine.block.setPositionX(shadowBlock, 250);
    engine.block.setPositionY(shadowBlock, 250);
    engine.block.appendChild(page, shadowBlock);

    const shadowFill = engine.block.createFill('color');
    engine.block.setFill(shadowBlock, shadowFill);
    engine.block.setColor(shadowFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Apply sRGB color to drop shadow
    engine.block.setDropShadowEnabled(shadowBlock, true);
    engine.block.setDropShadowBlurRadiusX(shadowBlock, 10);
    engine.block.setDropShadowBlurRadiusY(shadowBlock, 10);
    engine.block.setDropShadowOffsetX(shadowBlock, 5);
    engine.block.setDropShadowOffsetY(shadowBlock, 5);
    engine.block.setColor(shadowBlock, 'dropShadow/color', {
      r: 0.0,
      g: 0.0,
      b: 0.0,
      a: 0.4
    });

    // Create blocks for transparency demonstration
    const transparentBlock1 = engine.block.create('graphic');
    engine.block.setShape(transparentBlock1, engine.block.createShape('rect'));
    engine.block.setWidth(transparentBlock1, 150);
    engine.block.setHeight(transparentBlock1, 150);
    engine.block.setPositionX(transparentBlock1, 450);
    engine.block.setPositionY(transparentBlock1, 250);
    engine.block.appendChild(page, transparentBlock1);

    const transparentFill1 = engine.block.createFill('color');
    engine.block.setFill(transparentBlock1, transparentFill1);
    engine.block.setColor(
      transparentFill1,
      'fill/color/value',
      semiTransparentPurple
    );

    // Overlapping block to show transparency
    const transparentBlock2 = engine.block.create('graphic');
    engine.block.setShape(
      transparentBlock2,
      engine.block.createShape('ellipse')
    );
    engine.block.setWidth(transparentBlock2, 150);
    engine.block.setHeight(transparentBlock2, 150);
    engine.block.setPositionX(transparentBlock2, 500);
    engine.block.setPositionY(transparentBlock2, 300);
    engine.block.appendChild(page, transparentBlock2);

    const transparentFill2 = engine.block.createFill('color');
    engine.block.setFill(transparentBlock2, transparentFill2);
    engine.block.setColor(
      transparentFill2,
      'fill/color/value',
      semiTransparentOrange
    );

    // Retrieve the current color from a design element
    const currentColor = engine.block.getColor(fill1, 'fill/color/value');
    console.log('Current color:', currentColor);

    // Use type guard to check if color is RGBA (sRGB)
    if (isRGBAColor(currentColor)) {
      console.log('Color is sRGB/RGBA');
      console.log('Red:', currentColor.r);
      console.log('Green:', currentColor.g);
      console.log('Blue:', currentColor.b);
      console.log('Alpha:', currentColor.a);
    }

    // Convert a CMYK color to sRGB
    const cmykColor = { c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0 };
    const convertedToSrgb = engine.editor.convertColorToColorSpace(
      cmykColor,
      'sRGB'
    );
    console.log('Converted to sRGB:', convertedToSrgb);

    // Zoom to fit content
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

This guide covers creating RGBA color objects, applying them to fills, strokes, and shadows, retrieving colors from elements, converting colors to sRGB, and working with transparency.

## Using the Built-in Color Picker UI

The built-in color picker allows users to select sRGB colors visually. Users can pick colors from a gradient, enter hex values, or adjust RGB sliders. The color picker automatically handles value conversion between hex and floating-point formats.

The UI includes:

- Color picker gradient and hue slider
- Hex value input field
- RGB component sliders
- Opacity/alpha slider for transparency control

## Creating sRGB Colors Programmatically

We first set up a design scene and get a reference to the page.

```typescript highlight=highlight-setup
    // Create a design scene using CE.SDK
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }
```

We create RGBA color objects by specifying r, g, b, and a properties. All four components are required and use values from 0.0 to 1.0.

```typescript highlight=highlight-create-rgba
// Create RGBA color objects for sRGB color space
// Values are floating-point numbers between 0.0 and 1.0
const blueColor = { r: 0.2, g: 0.4, b: 0.9, a: 1.0 };
const redColor = { r: 0.9, g: 0.2, b: 0.2, a: 1.0 };
const greenColor = { r: 0.2, g: 0.8, b: 0.3, a: 1.0 };
```

The alpha channel controls transparency. A value of 1.0 is fully opaque, while 0.0 is fully transparent.

```typescript highlight=highlight-create-transparent
// Create semi-transparent colors using the alpha channel
// Alpha of 0.5 means 50% opacity
const semiTransparentPurple = { r: 0.6, g: 0.2, b: 0.8, a: 0.5 };
const semiTransparentOrange = { r: 1.0, g: 0.5, b: 0.0, a: 0.7 };
```

## Applying sRGB Colors to Fills

We use `engine.block.setColor()` to apply colors to block properties. For fills, we first create a color fill and then set its color value.

```typescript highlight=highlight-apply-fill
    // Apply sRGB colors to block fills
    // First create a color fill, then set its color value
    const fill1 = engine.block.createFill('color');
    engine.block.setFill(block1, fill1);
    engine.block.setColor(fill1, 'fill/color/value', blueColor);

    const fill2 = engine.block.createFill('color');
    engine.block.setFill(block2, fill2);
    engine.block.setColor(fill2, 'fill/color/value', redColor);

    const fill3 = engine.block.createFill('color');
    engine.block.setFill(block3, fill3);
    engine.block.setColor(fill3, 'fill/color/value', greenColor);
```

## Applying sRGB Colors to Strokes

We can apply sRGB colors to strokes using the `'stroke/color'` property path.

```typescript highlight=highlight-apply-stroke
// Apply sRGB color to stroke
engine.block.setStrokeEnabled(strokeBlock, true);
engine.block.setStrokeWidth(strokeBlock, 5);
engine.block.setColor(strokeBlock, 'stroke/color', {
  r: 0.1,
  g: 0.1,
  b: 0.5,
  a: 1.0
});
```

## Applying sRGB Colors to Shadows

Drop shadows also support sRGB colors. We use the `'dropShadow/color'` property path. A semi-transparent black creates a natural shadow effect.

```typescript highlight=highlight-apply-shadow
// Apply sRGB color to drop shadow
engine.block.setDropShadowEnabled(shadowBlock, true);
engine.block.setDropShadowBlurRadiusX(shadowBlock, 10);
engine.block.setDropShadowBlurRadiusY(shadowBlock, 10);
engine.block.setDropShadowOffsetX(shadowBlock, 5);
engine.block.setDropShadowOffsetY(shadowBlock, 5);
engine.block.setColor(shadowBlock, 'dropShadow/color', {
  r: 0.0,
  g: 0.0,
  b: 0.0,
  a: 0.4
});
```

## Retrieving Colors from Elements

We use `engine.block.getColor()` to read the current color from a design element. The returned color could be RGBA, CMYK, or a spot color depending on what was set.

```typescript highlight=highlight-get-color
// Retrieve the current color from a design element
const currentColor = engine.block.getColor(fill1, 'fill/color/value');
console.log('Current color:', currentColor);
```

## Identifying sRGB Colors

We use the `isRGBAColor()` type guard to check if a color is sRGB. This is useful when working with colors that could be from any supported color space.

```typescript highlight=highlight-identify-rgba
// Use type guard to check if color is RGBA (sRGB)
if (isRGBAColor(currentColor)) {
  console.log('Color is sRGB/RGBA');
  console.log('Red:', currentColor.r);
  console.log('Green:', currentColor.g);
  console.log('Blue:', currentColor.b);
  console.log('Alpha:', currentColor.a);
}
```

## Converting Colors to sRGB

We use `engine.editor.convertColorToColorSpace()` to convert CMYK or spot colors to sRGB for screen display.

```typescript highlight=highlight-convert-to-srgb
// Convert a CMYK color to sRGB
const cmykColor = { c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0 };
const convertedToSrgb = engine.editor.convertColorToColorSpace(
  cmykColor,
  'sRGB'
);
console.log('Converted to sRGB:', convertedToSrgb);
```

## API Reference

| Method                                   | Description                                    |
| ---------------------------------------- | ---------------------------------------------- |
| `createFill('color')`                    | Create a new color fill object                 |
| `setFill(block, fill)`                   | Assign fill to a block                         |
| `setColor(block, property, color)`       | Set color value (RGBA)                         |
| `getColor(block, property)`              | Get current color value                        |
| `setStrokeEnabled(block, enabled)`       | Enable or disable stroke rendering             |
| `setStrokeWidth(block, width)`           | Set stroke width                               |
| `setDropShadowEnabled(block, enabled)`   | Enable or disable drop shadow                  |
| `convertColorToColorSpace(color, space)` | Convert color to specified color space         |
| `isRGBAColor(color)`                     | Type guard to check if color is RGBA           |

## Troubleshooting

**Colors appear incorrect:** Verify values are in the 0.0-1.0 range, not 0-255. A value of 255 would be clamped to 1.0.

**Color not visible:** Check that the alpha value is not 0.0 and that the fill or stroke is enabled on the block.

**Type errors:** Ensure all four components (r, g, b, a) are provided for RGBA colors. Omitting alpha will cause validation errors.



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support