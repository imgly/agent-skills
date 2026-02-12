> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Fills](./fills.md) > [Solid Color](./fills/color.md)

---

Apply uniform solid colors to shapes, text, and design blocks using CE.SDK's
comprehensive color fill system with support for multiple color spaces.

![Color Fills example showing various colored shapes with RGB, CMYK, and Spot Colors](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-fills-color-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-fills-color-browser)
>
> - [Live demo](https://img.ly/examples/guides-fills-color-browser/)

Color fills are one of the fundamental fill types in CE.SDK, allowing you to paint design blocks with solid, uniform colors. Unlike gradient fills that transition between colors or image fills that display photo content, color fills apply a single color across the entire block. The color fill system supports multiple color spaces including RGB for screen display, CMYK for print workflows, and Spot Colors for brand consistency.

```typescript file=@cesdk_web_examples/guides-fills-color-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Color Fills Guide
 *
 * This example demonstrates:
 * - Creating and applying color fills
 * - Working with RGB, CMYK, and Spot Colors
 * - Managing fill properties
 * - Enabling/disabling fills
 * - Sharing fills between blocks
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Create a design scene using CE.SDK cesdk method
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Set page background to light gray
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.96,
      g: 0.96,
      b: 0.96,
      a: 1.0
    });

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 12);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Helper function to create a shape with a fill
    const createShapeWithFill = (
      shapeType: 'rect' | 'ellipse' | 'polygon' | 'star' = 'rect'
    ): { block: number; fill: number } => {
      const block = engine.block.create('graphic');
      const shape = engine.block.createShape(shapeType);
      engine.block.setShape(block, shape);

      // Set size
      engine.block.setWidth(block, blockWidth);
      engine.block.setHeight(block, blockHeight);

      // Append to page
      engine.block.appendChild(page, block);

      // Check if block supports fills
      const canHaveFill = engine.block.supportsFill(block);
      if (!canHaveFill) {
        throw new Error('Block does not support fills');
      }

      // Create a color fill
      const colorFill = engine.block.createFill('color');

      // Apply the fill to the block
      engine.block.setFill(block, colorFill);

      return { block, fill: colorFill };
    };

    // Example 1: RGB Color Fill (Red)
    const { block: rgbBlock, fill: rgbFill } = createShapeWithFill();
    engine.block.setColor(rgbFill, 'fill/color/value', {
      r: 1.0, // Red (0.0 to 1.0)
      g: 0.0, // Green
      b: 0.0, // Blue
      a: 1.0 // Alpha (opacity)
    });

    // Example 2: RGB Color Fill (Green with transparency)
    const { block: transparentBlock, fill: transparentFill } =
      createShapeWithFill();
    engine.block.setColor(transparentFill, 'fill/color/value', {
      r: 0.0,
      g: 0.8,
      b: 0.2,
      a: 0.5 // 50% opacity
    });

    // Example 3: RGB Color Fill (Blue)
    const { block: blueBlock, fill: blueFill } = createShapeWithFill();
    engine.block.setColor(blueFill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1.0
    });

    // Get the current fill from a block
    const currentFill = engine.block.getFill(blueBlock);
    const fillType = engine.block.getType(currentFill);
    // eslint-disable-next-line no-console
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/color'

    // Get the current color value
    const currentColor = engine.block.getColor(blueFill, 'fill/color/value');
    // eslint-disable-next-line no-console
    console.log('Current color:', currentColor);

    // Example 4: CMYK Color Fill (Magenta)
    const { block: cmykBlock, fill: cmykFill } = createShapeWithFill('ellipse');
    engine.block.setColor(cmykFill, 'fill/color/value', {
      c: 0.0, // Cyan (0.0 to 1.0)
      m: 1.0, // Magenta
      y: 0.0, // Yellow
      k: 0.0, // Key/Black
      tint: 1.0 // Tint value (0.0 to 1.0)
    });

    // Example 5: Print-Ready CMYK Color
    const { block: printBlock, fill: printFill } =
      createShapeWithFill('ellipse');
    engine.block.setColor(printFill, 'fill/color/value', {
      c: 0.0,
      m: 0.85,
      y: 1.0,
      k: 0.0,
      tint: 1.0
    });

    // Example 6: Spot Color (Brand Color)
    // First define the spot color globally
    engine.editor.setSpotColorRGB('BrandRed', 0.9, 0.1, 0.1);
    engine.editor.setSpotColorRGB('BrandBlue', 0.1, 0.3, 0.9);

    // Then apply to fill
    const { block: spotBlock, fill: spotFill } = createShapeWithFill('ellipse');
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'BrandRed',
      tint: 1.0,
      externalReference: '' // Optional reference system
    });

    // Example 7: Brand Color Application
    // Apply brand color to multiple elements
    const { block: headerBlock, fill: headerFill } =
      createShapeWithFill('star');
    const brandColor = { name: 'BrandBlue', tint: 1.0, externalReference: '' };
    engine.block.setColor(headerFill, 'fill/color/value', brandColor);

    // Example 8: Second element with same brand color
    const { block: buttonBlock, fill: buttonFill } =
      createShapeWithFill('star');
    engine.block.setColor(buttonFill, 'fill/color/value', brandColor);

    // Example 9: Toggle fill visibility
    const { block: toggleBlock, fill: toggleFill } =
      createShapeWithFill('star');
    engine.block.setColor(toggleFill, 'fill/color/value', {
      r: 1.0,
      g: 0.5,
      b: 0.0,
      a: 1.0
    });

    // Check fill state
    const isEnabled = engine.block.isFillEnabled(toggleBlock);
    // eslint-disable-next-line no-console
    console.log('Fill enabled:', isEnabled); // true

    // Example 10: Shared Fill
    const block1 = engine.block.create('graphic');
    const shape1 = engine.block.createShape('rect');
    engine.block.setShape(block1, shape1);
    engine.block.setWidth(block1, blockWidth);
    engine.block.setHeight(block1, blockHeight / 2);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    const shape2 = engine.block.createShape('rect');
    engine.block.setShape(block2, shape2);
    engine.block.setWidth(block2, blockWidth);
    engine.block.setHeight(block2, blockHeight / 2);
    engine.block.appendChild(page, block2);

    // Create one fill
    const sharedFill = engine.block.createFill('color');
    engine.block.setColor(sharedFill, 'fill/color/value', {
      r: 0.5,
      g: 0.0,
      b: 0.5,
      a: 1.0
    });

    // Apply to both blocks
    engine.block.setFill(block1, sharedFill);
    engine.block.setFill(block2, sharedFill);

    // Example 11: Yellow Star
    const { block: replaceBlock, fill: replaceFill } =
      createShapeWithFill('star');
    engine.block.setColor(replaceFill, 'fill/color/value', {
      r: 0.9,
      g: 0.9,
      b: 0.1,
      a: 1.0
    });

    // Example 12: Color Space Conversion (for demonstration)
    const rgbColor = { r: 1.0, g: 0.0, b: 0.0, a: 1.0 };

    // Convert to CMYK
    const cmykColor = engine.editor.convertColorToColorSpace(rgbColor, 'CMYK');
    // eslint-disable-next-line no-console
    console.log('Converted CMYK color:', cmykColor);

    // ===== Position all blocks in grid layout =====
    const blocks = [
      rgbBlock, // Position 0
      transparentBlock, // Position 1
      blueBlock, // Position 2
      cmykBlock, // Position 3
      printBlock, // Position 4
      spotBlock, // Position 5
      headerBlock, // Position 6
      buttonBlock, // Position 7
      toggleBlock, // Position 8
      block1, // Position 9
      block2, // Position 10
      replaceBlock // Position 11
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Zoom to fit all content
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

This guide demonstrates how to create, apply, and modify color fills programmatically, work with different color spaces, and manage fill properties for various design elements.

## Understanding Color Fills

### What is a Color Fill?

A color fill is a fill object identified by the type `'//ly.img.ubq/fill/color'` (or its shorthand `'color'`) that paints a design block with a single, uniform color. Color fills are part of the broader fill system in CE.SDK and contain a `fill/color/value` property that defines the actual color using various color space formats.

Color fills differ from other fill types available in CE.SDK:

- **Color fills**: Solid, uniform color across the entire block
- **Gradient fills**: Color transitions (linear, radial, conical)
- **Image fills**: Photo or raster content
- **Video fills**: Animated video content

### Supported Color Spaces

CE.SDK's color fill system supports multiple color spaces to accommodate different design and production workflows:

- **RGB/sRGB**: Red, Green, Blue with alpha channel (standard for screen display)
- **CMYK**: Cyan, Magenta, Yellow, Key (black) with tint (for print production)
- **Spot Colors**: Named colors with RGB/CMYK approximations (for brand consistency)

Each color space serves specific use cases—use RGB for digital designs, CMYK for print-ready content, and Spot Colors to maintain brand standards across projects.

## Checking Color Fill Support

### Verifying Block Compatibility

Before applying color fills to a block, verify that the block type supports fills. Not all block types can have fills—for example, scene and page blocks typically don't support fills.

```typescript highlight-check-fill-support
// Check if block supports fills
const canHaveFill = engine.block.supportsFill(block);
if (!canHaveFill) {
  throw new Error('Block does not support fills');
}
```

Graphic blocks, shapes, and text blocks typically support fills. Always check `supportsFill()` before accessing fill APIs to avoid runtime errors and ensure smooth operation.

## Creating Color Fills

### Creating a New Color Fill

Create a new color fill instance using the `createFill()` method with the type `'color'` or the full type name `'//ly.img.ubq/fill/color'`.

```typescript highlight-create-fill
// Create a color fill
const colorFill = engine.block.createFill('color');
```

The `createFill()` method returns a numeric fill ID. The fill exists independently until you attach it to a block using `setFill()`. If you create a fill but don't attach it to a block, you must destroy it manually to prevent memory leaks.

### Default Color Fill Properties

New color fills have default properties—typically white or transparent. You can discover all available properties using `findAllProperties()`:

```typescript
const properties = engine.block.findAllProperties(colorFillId);
console.log(properties); // ["fill/color/value", "type"]
```

## Applying Color Fills

### Setting a Fill on a Block

Once you've created a color fill, attach it to a block using `setFill()`:

```typescript highlight-apply-fill
// Apply the fill to the block
engine.block.setFill(block, colorFill);
```

This example creates a graphic block with a rectangle shape and applies the color fill to it. The block will now render with the fill's color.

### Getting the Current Fill

Retrieve the current fill attached to a block using `getFill()` and inspect its type:

```typescript highlight-get-fill
// Get the current fill from a block
const currentFill = engine.block.getFill(blueBlock);
const fillType = engine.block.getType(currentFill);
// eslint-disable-next-line no-console
console.log('Fill type:', fillType); // '//ly.img.ubq/fill/color'
```

## Modifying Color Fill Properties

### Setting RGB Colors

Set the fill color using RGB values with the `setColor()` method. RGB values are normalized floats from 0.0 to 1.0, and the alpha channel controls opacity.

```typescript highlight-set-rgb
const { block: rgbBlock, fill: rgbFill } = createShapeWithFill();
engine.block.setColor(rgbFill, 'fill/color/value', {
  r: 1.0, // Red (0.0 to 1.0)
  g: 0.0, // Green
  b: 0.0, // Blue
  a: 1.0 // Alpha (opacity)
});
```

The alpha channel (a) controls opacity: 1.0 is fully opaque, 0.0 is fully transparent. This allows you to create semi-transparent overlays and layered color effects.

### Setting CMYK Colors

For print workflows, use CMYK color space with the `setColor()` method. CMYK values are also normalized from 0.0 to 1.0, and include a tint value for partial color application.

```typescript highlight-set-cmyk
const { block: cmykBlock, fill: cmykFill } = createShapeWithFill('ellipse');
engine.block.setColor(cmykFill, 'fill/color/value', {
  c: 0.0, // Cyan (0.0 to 1.0)
  m: 1.0, // Magenta
  y: 0.0, // Yellow
  k: 0.0, // Key/Black
  tint: 1.0 // Tint value (0.0 to 1.0)
});
```

The tint value allows partial application of the color, useful for creating lighter variations without changing the base CMYK values.

### Setting Spot Colors

Spot colors are named colors that must be defined before use. They're ideal for maintaining brand consistency and can have both RGB and CMYK approximations for different output scenarios.

```typescript highlight-set-spot
    // First define the spot color globally
    engine.editor.setSpotColorRGB('BrandRed', 0.9, 0.1, 0.1);
    engine.editor.setSpotColorRGB('BrandBlue', 0.1, 0.3, 0.9);

    // Then apply to fill
    const { block: spotBlock, fill: spotFill } = createShapeWithFill('ellipse');
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'BrandRed',
      tint: 1.0,
      externalReference: '' // Optional reference system
    });
```

First, define the spot color globally using `setSpotColorRGB()` or `setSpotColorCMYK()`, then apply it to your fill using the color name. The tint value controls intensity from 0.0 to 1.0.

### Getting Current Color Value

Retrieve the current color value from a fill using `getColor()`:

```typescript highlight-get-color
// Get the current color value
const currentColor = engine.block.getColor(blueFill, 'fill/color/value');
// eslint-disable-next-line no-console
console.log('Current color:', currentColor);
```

## Enabling and Disabling Color Fills

### Toggle Fill Visibility

You can temporarily disable a fill without removing it from the block. This preserves all fill properties while making the block transparent:

```typescript highlight-toggle-fill
    const { block: toggleBlock, fill: toggleFill } =
      createShapeWithFill('star');
    engine.block.setColor(toggleFill, 'fill/color/value', {
      r: 1.0,
      g: 0.5,
      b: 0.0,
      a: 1.0
    });

    // Check fill state
    const isEnabled = engine.block.isFillEnabled(toggleBlock);
    // eslint-disable-next-line no-console
    console.log('Fill enabled:', isEnabled); // true
```

Disabling fills is useful for creating stroke-only designs or for temporarily hiding fills during interactive editing sessions. The fill properties remain intact and can be re-enabled at any time.

## Additional Techniques

### Sharing Color Fills

You can share a single fill instance between multiple blocks. Changes to the shared fill affect all blocks using it:

```typescript highlight-share-fill
    const block1 = engine.block.create('graphic');
    const shape1 = engine.block.createShape('rect');
    engine.block.setShape(block1, shape1);
    engine.block.setWidth(block1, blockWidth);
    engine.block.setHeight(block1, blockHeight / 2);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    const shape2 = engine.block.createShape('rect');
    engine.block.setShape(block2, shape2);
    engine.block.setWidth(block2, blockWidth);
    engine.block.setHeight(block2, blockHeight / 2);
    engine.block.appendChild(page, block2);

    // Create one fill
    const sharedFill = engine.block.createFill('color');
    engine.block.setColor(sharedFill, 'fill/color/value', {
      r: 0.5,
      g: 0.0,
      b: 0.5,
      a: 1.0
    });

    // Apply to both blocks
    engine.block.setFill(block1, sharedFill);
    engine.block.setFill(block2, sharedFill);
```

With shared fills, modifying the fill's color updates all blocks simultaneously. The fill is only destroyed when the last block referencing it is destroyed.

### Color Space Conversion

Convert colors between different color spaces using `convertColorToColorSpace()`:

```typescript highlight-convert-color
    const rgbColor = { r: 1.0, g: 0.0, b: 0.0, a: 1.0 };

    // Convert to CMYK
    const cmykColor = engine.editor.convertColorToColorSpace(rgbColor, 'CMYK');
    // eslint-disable-next-line no-console
    console.log('Converted CMYK color:', cmykColor);
```

This is useful when you need to ensure color consistency across different output mediums (screen vs. print).

## Common Use Cases

### Brand Color Application

Define and apply brand colors as spot colors to maintain consistency across all design elements:

```typescript highlight-brand-colors
// Apply brand color to multiple elements
const { block: headerBlock, fill: headerFill } =
  createShapeWithFill('star');
const brandColor = { name: 'BrandBlue', tint: 1.0, externalReference: '' };
engine.block.setColor(headerFill, 'fill/color/value', brandColor);
```

Using spot colors ensures brand consistency and makes it easy to update all instances of a brand color by modifying the spot color definition.

### Transparency Effects

Create semi-transparent overlays and visual effects by adjusting the alpha channel:

```typescript highlight-transparency
const { block: transparentBlock, fill: transparentFill } =
  createShapeWithFill();
engine.block.setColor(transparentFill, 'fill/color/value', {
  r: 0.0,
  g: 0.8,
  b: 0.2,
  a: 0.5 // 50% opacity
});
```

### Print-Ready Colors

Use CMYK color space for designs destined for print production:

```typescript highlight-print-colors
const { block: printBlock, fill: printFill } =
  createShapeWithFill('ellipse');
engine.block.setColor(printFill, 'fill/color/value', {
  c: 0.0,
  m: 0.85,
  y: 1.0,
  k: 0.0,
  tint: 1.0
});
```

## Troubleshooting

### Fill Not Visible

If your fill doesn't appear:

- Check if fill is enabled: `engine.block.isFillEnabled(block)`
- Verify alpha channel is not 0: Check the `a` property in RGBA colors
- Ensure block has valid dimensions (width and height > 0)
- Confirm block is in the scene hierarchy

### Color Looks Different Than Expected

If colors don't match expectations:

- Verify you're using the correct color space (RGB vs CMYK)
- Check if spot color is properly defined before use
- Review tint values (should be 0.0-1.0)
- Consider color space conversion for your output medium

### Memory Leaks

To prevent memory leaks:

- Always destroy replaced fills: `engine.block.destroy(oldFill)`
- Don't create fills without attaching them to blocks
- Clean up shared fills when they're no longer needed

### Cannot Apply Color to Block

If you can't apply a color fill:

- Verify block supports fills: `engine.block.supportsFill(block)`
- Check if block has a shape: Some blocks require shapes before fills work
- Ensure fill object is valid and not already destroyed

## API Reference

| Method                                   | Description                               |
| ---------------------------------------- | ----------------------------------------- |
| `createFill('color')`                    | Create a new color fill object            |
| `setFill(block, fill)`                   | Assign fill to a block                    |
| `getFill(block)`                         | Get the fill ID from a block              |
| `setColor(fill, property, color)`        | Set color value (RGB, CMYK, or Spot)      |
| `getColor(fill, property)`               | Get current color value                   |
| `setFillEnabled(block, enabled)`         | Enable or disable fill rendering          |
| `isFillEnabled(block)`                   | Check if fill is enabled                  |
| `supportsFill(block)`                    | Check if block supports fills             |
| `findAllProperties(fill)`                | List all properties of the fill           |
| `convertColorToColorSpace(color, space)` | Convert between color spaces              |
| `setSpotColorRGB(name, r, g, b)`         | Define spot color with RGB approximation  |
| `setSpotColorCMYK(name, c, m, y, k)`     | Define spot color with CMYK approximation |

## Next Steps

Now that you understand color fills, explore other fill types and color management features:

- Learn about Gradient Fills for color transitions
- Explore Image Fills for photo content
- Understand Fill Overview for the comprehensive fill system
- Review Apply Colors for color management across properties
- Study Blocks Concept for understanding the block system



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support