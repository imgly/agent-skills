> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Colors](./colors.md) > [For Print](./colors/for-print.md) > [Spot Colors](./colors/for-print/spot.md)

---

Define and manage spot colors programmatically for professional print workflows with exact color matching through premixed inks.

![Spot Colors example showing blocks with various spot color fills and tints](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-colors-for-print-spot-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-colors-for-print-spot-browser)
>
> - [Live demo](https://img.ly/examples/guides-colors-for-print-spot-browser/)

Spot colors are named colors reproduced using premixed inks in print production, providing exact color matching that CMYK process colors cannot guarantee. CE.SDK maintains a registry of spot color definitions at the editor level, where each spot color has a name and screen approximations (RGB and/or CMYK) for display purposes. The actual premixed ink is used during printing based on the color name.

```typescript file=@cesdk_web_examples/guides-colors-for-print-spot-browser/browser.ts reference-only
import type {
  EditorPlugin,
  EditorPluginContext,
  SpotColor
} from '@cesdk/cesdk-js';
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

// Type guard to check if a color is a SpotColor
// Color can be RGBAColor, CMYKColor, or SpotColor
const isSpotColor = (color: unknown): color is SpotColor => {
  return (
    typeof color === 'object' &&
    color !== null &&
    'name' in color &&
    'tint' in color &&
    'externalReference' in color
  );
};

/**
 * CE.SDK Plugin: Spot Colors Guide
 *
 * This example demonstrates:
 * - Defining spot colors with RGB and CMYK approximations
 * - Applying spot colors to fills, strokes, and shadows
 * - Using tints for lighter color variations
 * - Querying and updating spot color definitions
 * - Removing spot colors and handling the magenta fallback
 * - Assigning spot colors to cutout types
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

    // Create a design scene using CE.SDK convenience method
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

    // Set page background to light gray for visibility
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Helper function to create a graphic block with a color fill
    const createColorBlock = (
      x: number,
      y: number,
      width: number,
      height: number,
      shape: 'rect' | 'ellipse' = 'rect'
    ): { block: number; fill: number } => {
      const block = engine.block.create('graphic');
      const blockShape = engine.block.createShape(shape);
      engine.block.setShape(block, blockShape);
      engine.block.setWidth(block, width);
      engine.block.setHeight(block, height);
      engine.block.setPositionX(block, x);
      engine.block.setPositionY(block, y);
      engine.block.appendChild(page, block);

      const colorFill = engine.block.createFill('color');
      engine.block.setFill(block, colorFill);

      return { block, fill: colorFill };
    };

    // Define a spot color with RGB approximation
    // RGB values range from 0.0 to 1.0
    engine.editor.setSpotColorRGB('Brand-Primary', 0.8, 0.1, 0.2);

    // Add CMYK approximation for the same spot color
    // This provides print-accurate preview in addition to screen display
    engine.editor.setSpotColorCMYK('Brand-Primary', 0.05, 0.95, 0.85, 0.0);

    // Define another spot color with both approximations
    engine.editor.setSpotColorRGB('Brand-Accent', 0.2, 0.4, 0.8);
    engine.editor.setSpotColorCMYK('Brand-Accent', 0.75, 0.5, 0.0, 0.0);

    // Apply spot colors to fills using SpotColor objects
    // The tint property (0.0 to 1.0) controls color intensity
    // The externalReference field stores metadata like color system origin
    const brandPrimary: SpotColor = {
      name: 'Brand-Primary',
      tint: 1.0,
      externalReference: ''
    };

    // Create a block and apply the Brand-Primary spot color
    const { fill: primaryFill } = createColorBlock(50, 50, 150, 150);
    engine.block.setColor(primaryFill, 'fill/color/value', brandPrimary);

    // Apply Brand-Accent to another block
    const brandAccent: SpotColor = {
      name: 'Brand-Accent',
      tint: 1.0,
      externalReference: ''
    };
    const { fill: accentFill } = createColorBlock(220, 50, 150, 150);
    engine.block.setColor(accentFill, 'fill/color/value', brandAccent);

    // Use tints for lighter variations without defining new spot colors
    // Tint of 0.5 gives 50% color intensity
    const brandPrimaryHalfTint: SpotColor = {
      name: 'Brand-Primary',
      tint: 0.5,
      externalReference: ''
    };
    const { fill: tintedFill } = createColorBlock(390, 50, 150, 150, 'ellipse');
    engine.block.setColor(tintedFill, 'fill/color/value', brandPrimaryHalfTint);

    // Create a gradient of tints
    const brandAccentLightTint: SpotColor = {
      name: 'Brand-Accent',
      tint: 0.3,
      externalReference: ''
    };
    const { fill: lightTintFill } = createColorBlock(560, 50, 150, 150);
    engine.block.setColor(
      lightTintFill,
      'fill/color/value',
      brandAccentLightTint
    );

    // Apply spot colors to strokes and shadows
    const { block: strokeBlock, fill: strokeBlockFill } = createColorBlock(
      50,
      220,
      150,
      150
    );
    // Set fill to white
    engine.block.setColor(strokeBlockFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Enable stroke and apply spot color
    engine.block.setStrokeEnabled(strokeBlock, true);
    engine.block.setStrokeWidth(strokeBlock, 8);
    const strokeColor: SpotColor = {
      name: 'Brand-Primary',
      tint: 1.0,
      externalReference: ''
    };
    engine.block.setColor(strokeBlock, 'stroke/color', strokeColor);

    // Apply spot color to drop shadow
    const { block: shadowBlock, fill: shadowBlockFill } = createColorBlock(
      220,
      220,
      150,
      150
    );
    engine.block.setColor(shadowBlockFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    engine.block.setDropShadowEnabled(shadowBlock, true);
    engine.block.setDropShadowOffsetX(shadowBlock, 10);
    engine.block.setDropShadowOffsetY(shadowBlock, 10);
    engine.block.setDropShadowBlurRadiusX(shadowBlock, 15);
    engine.block.setDropShadowBlurRadiusY(shadowBlock, 15);
    const shadowColor: SpotColor = {
      name: 'Brand-Accent',
      tint: 0.8,
      externalReference: ''
    };
    engine.block.setColor(shadowBlock, 'dropShadow/color', shadowColor);

    // Query all defined spot colors
    const spotColors = engine.editor.findAllSpotColors();
    // eslint-disable-next-line no-console
    console.log('Defined spot colors:', spotColors);

    // Query RGB approximation for a spot color
    const rgbaApprox = engine.editor.getSpotColorRGBA('Brand-Primary');
    // eslint-disable-next-line no-console
    console.log('Brand-Primary RGB approximation:', rgbaApprox);

    // Query CMYK approximation for a spot color
    const cmykApprox = engine.editor.getSpotColorCMYK('Brand-Primary');
    // eslint-disable-next-line no-console
    console.log('Brand-Primary CMYK approximation:', cmykApprox);

    // Read back the color from a block and check if it's a spot color
    const retrievedColor = engine.block.getColor(
      primaryFill,
      'fill/color/value'
    );
    if (isSpotColor(retrievedColor)) {
      // eslint-disable-next-line no-console
      console.log(
        `Retrieved SpotColor - Name: ${retrievedColor.name}, Tint: ${retrievedColor.tint}`
      );
    }

    // Update an existing spot color's approximation
    // This changes how the color appears on screen without affecting the color name
    engine.editor.setSpotColorRGB('Brand-Accent', 0.3, 0.5, 0.9);
    // eslint-disable-next-line no-console
    console.log('Updated Brand-Accent RGB approximation');

    // Show the updated color in a new block
    const { fill: updatedFill } = createColorBlock(390, 220, 150, 150);
    const updatedAccent: SpotColor = {
      name: 'Brand-Accent',
      tint: 1.0,
      externalReference: ''
    };
    engine.block.setColor(updatedFill, 'fill/color/value', updatedAccent);

    // Define a temporary spot color
    engine.editor.setSpotColorRGB('Temporary-Color', 0.5, 0.8, 0.3);

    // Create a block using the temporary color
    const { fill: tempFill } = createColorBlock(560, 220, 150, 150);
    const tempColor: SpotColor = {
      name: 'Temporary-Color',
      tint: 1.0,
      externalReference: ''
    };
    engine.block.setColor(tempFill, 'fill/color/value', tempColor);

    // Remove the spot color definition
    // Blocks using this color will display magenta (default fallback)
    engine.editor.removeSpotColor('Temporary-Color');

    // eslint-disable-next-line no-console
    console.log('Removed Temporary-Color - block now shows magenta fallback');

    // Verify the color is no longer defined
    const remainingSpotColors = engine.editor.findAllSpotColors();
    // eslint-disable-next-line no-console
    console.log('Remaining spot colors:', remainingSpotColors);

    // Assign spot colors to cutout types for die-cutting operations
    // First define a spot color for the die line
    engine.editor.setSpotColorRGB('DieLine', 1.0, 0.0, 1.0);
    engine.editor.setSpotColorCMYK('DieLine', 0.0, 1.0, 0.0, 0.0);

    // Associate the spot color with a cutout type
    // CutoutType can be 'Solid' or 'Dashed'
    engine.editor.setSpotColorForCutoutType('Solid', 'DieLine');

    // Query the assigned spot color
    const cutoutSpotColor = engine.editor.getSpotColorForCutoutType('Solid');
    // eslint-disable-next-line no-console
    console.log('Cutout type Solid uses spot color:', cutoutSpotColor);

    // Create a legend block with text
    const textBlock = engine.block.create('text');
    engine.block.replaceText(textBlock, 'Spot Colors Demo');
    engine.block.setTextFontSize(textBlock, 36);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setPositionX(textBlock, 50);
    engine.block.setPositionY(textBlock, 400);
    engine.block.appendChild(page, textBlock);

    // Create smaller label texts
    const labels = [
      { text: 'Brand-Primary', x: 50, y: 205 },
      { text: 'Brand-Accent', x: 220, y: 205 },
      { text: 'Primary 50%', x: 390, y: 205 },
      { text: 'Accent 30%', x: 560, y: 205 },
      { text: 'Stroke', x: 50, y: 375 },
      { text: 'Shadow', x: 220, y: 375 },
      { text: 'Updated', x: 390, y: 375 },
      { text: 'Removed', x: 560, y: 375 }
    ];

    for (const label of labels) {
      const labelBlock = engine.block.create('text');
      engine.block.replaceText(labelBlock, label.text);
      engine.block.setTextFontSize(labelBlock, 14);
      engine.block.setWidthMode(labelBlock, 'Auto');
      engine.block.setHeightMode(labelBlock, 'Auto');
      engine.block.setPositionX(labelBlock, label.x);
      engine.block.setPositionY(labelBlock, label.y);
      engine.block.appendChild(page, labelBlock);
    }

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

This guide covers how to define spot colors with RGB and CMYK approximations, apply them to design elements with varying tints, query and update definitions, and assign spot colors to cutout types for die-cutting operations.

## Understanding Spot Colors

Spot colors differ from CMYK process colors in several important ways:

- **Exact color matching** - Premixed inks guarantee consistent color reproduction across print runs
- **Brand consistency** - Essential for logos and brand colors (e.g., Pantone colors)
- **Specialty effects** - Enable metallic, fluorescent, and other specialty inks
- **Color gamut** - Some colors are unreproducible with CMYK process inks

In CE.SDK, spot colors have three components:

- **Name** - The identifier used in print output (e.g., "Pantone-485-C")
- **Approximations** - RGB and/or CMYK values for screen display
- **Tint** - A value from 0.0 to 1.0 controlling color intensity

## Define Spot Colors

### RGB Approximation

We register spot colors using `engine.editor.setSpotColorRGB()`. This creates a new spot color if the name doesn't exist, or updates the approximation if it does.

```typescript highlight-define-spot-rgb
// Define a spot color with RGB approximation
// RGB values range from 0.0 to 1.0
engine.editor.setSpotColorRGB('Brand-Primary', 0.8, 0.1, 0.2);
```

RGB approximations display the spot color on screen during editing. The values range from 0.0 to 1.0 for each channel.

### CMYK Approximation

We can add a CMYK approximation using `engine.editor.setSpotColorCMYK()`. This provides print-accurate previews alongside the RGB screen display.

```typescript highlight-define-spot-cmyk
    // Add CMYK approximation for the same spot color
    // This provides print-accurate preview in addition to screen display
    engine.editor.setSpotColorCMYK('Brand-Primary', 0.05, 0.95, 0.85, 0.0);

    // Define another spot color with both approximations
    engine.editor.setSpotColorRGB('Brand-Accent', 0.2, 0.4, 0.8);
    engine.editor.setSpotColorCMYK('Brand-Accent', 0.75, 0.5, 0.0, 0.0);
```

For best results, provide both RGB and CMYK approximations for each spot color. RGB displays on screen while CMYK enables accurate print preview.

## Apply Spot Colors to Design Elements

We apply spot colors to blocks using `engine.block.setColor()` with a SpotColor object containing `name`, `tint`, and `externalReference`.

```typescript highlight-apply-spot-fill
    // Apply spot colors to fills using SpotColor objects
    // The tint property (0.0 to 1.0) controls color intensity
    // The externalReference field stores metadata like color system origin
    const brandPrimary: SpotColor = {
      name: 'Brand-Primary',
      tint: 1.0,
      externalReference: ''
    };

    // Create a block and apply the Brand-Primary spot color
    const { fill: primaryFill } = createColorBlock(50, 50, 150, 150);
    engine.block.setColor(primaryFill, 'fill/color/value', brandPrimary);
```

The SpotColor object has these properties:

- **name** - Must match a defined spot color exactly (case-sensitive)
- **tint** - Controls intensity from 0.0 (transparent) to 1.0 (full strength)
- **externalReference** - Optional metadata like the color system origin (e.g., "Pantone")

> **Note:** The spot color must be defined before applying it to blocks. Undefined spot colors display as magenta—the default fallback color.

### Using Tints

Tints create lighter variations without defining separate spot colors for each shade. A tint of 0.5 gives 50% color intensity.

```typescript highlight-tint
    // Use tints for lighter variations without defining new spot colors
    // Tint of 0.5 gives 50% color intensity
    const brandPrimaryHalfTint: SpotColor = {
      name: 'Brand-Primary',
      tint: 0.5,
      externalReference: ''
    };
    const { fill: tintedFill } = createColorBlock(390, 50, 150, 150, 'ellipse');
    engine.block.setColor(tintedFill, 'fill/color/value', brandPrimaryHalfTint);

    // Create a gradient of tints
    const brandAccentLightTint: SpotColor = {
      name: 'Brand-Accent',
      tint: 0.3,
      externalReference: ''
    };
    const { fill: lightTintFill } = createColorBlock(560, 50, 150, 150);
    engine.block.setColor(
      lightTintFill,
      'fill/color/value',
      brandAccentLightTint
    );
```

Use tints for:

- Color variations in design systems
- Lighter backgrounds using brand colors
- Gradient-like effects with consistent spot color names

### Strokes and Shadows

Spot colors work with any color property, including strokes and drop shadows.

```typescript highlight-stroke-shadow
    // Apply spot colors to strokes and shadows
    const { block: strokeBlock, fill: strokeBlockFill } = createColorBlock(
      50,
      220,
      150,
      150
    );
    // Set fill to white
    engine.block.setColor(strokeBlockFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Enable stroke and apply spot color
    engine.block.setStrokeEnabled(strokeBlock, true);
    engine.block.setStrokeWidth(strokeBlock, 8);
    const strokeColor: SpotColor = {
      name: 'Brand-Primary',
      tint: 1.0,
      externalReference: ''
    };
    engine.block.setColor(strokeBlock, 'stroke/color', strokeColor);

    // Apply spot color to drop shadow
    const { block: shadowBlock, fill: shadowBlockFill } = createColorBlock(
      220,
      220,
      150,
      150
    );
    engine.block.setColor(shadowBlockFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    engine.block.setDropShadowEnabled(shadowBlock, true);
    engine.block.setDropShadowOffsetX(shadowBlock, 10);
    engine.block.setDropShadowOffsetY(shadowBlock, 10);
    engine.block.setDropShadowBlurRadiusX(shadowBlock, 15);
    engine.block.setDropShadowBlurRadiusY(shadowBlock, 15);
    const shadowColor: SpotColor = {
      name: 'Brand-Accent',
      tint: 0.8,
      externalReference: ''
    };
    engine.block.setColor(shadowBlock, 'dropShadow/color', shadowColor);
```

The `stroke/color` and `dropShadow/color` properties accept the same SpotColor objects as fill colors.

## Query Spot Color Definitions

### List Defined Spot Colors

We retrieve all defined spot colors with `engine.editor.findAllSpotColors()`.

```typescript highlight-query-spot
    // Query all defined spot colors
    const spotColors = engine.editor.findAllSpotColors();
    // eslint-disable-next-line no-console
    console.log('Defined spot colors:', spotColors);

    // Query RGB approximation for a spot color
    const rgbaApprox = engine.editor.getSpotColorRGBA('Brand-Primary');
    // eslint-disable-next-line no-console
    console.log('Brand-Primary RGB approximation:', rgbaApprox);

    // Query CMYK approximation for a spot color
    const cmykApprox = engine.editor.getSpotColorCMYK('Brand-Primary');
    // eslint-disable-next-line no-console
    console.log('Brand-Primary CMYK approximation:', cmykApprox);

    // Read back the color from a block and check if it's a spot color
    const retrievedColor = engine.block.getColor(
      primaryFill,
      'fill/color/value'
    );
    if (isSpotColor(retrievedColor)) {
      // eslint-disable-next-line no-console
      console.log(
        `Retrieved SpotColor - Name: ${retrievedColor.name}, Tint: ${retrievedColor.tint}`
      );
    }
```

This returns an array of spot color names currently registered in the editor.

### Get Color Approximations

Query individual color approximations with `engine.editor.getSpotColorRGBA()` or `engine.editor.getSpotColorCMYK()`.

Querying an undefined spot color returns magenta values—use this to detect missing definitions.

### Read Colors from Blocks

When reading a color back from a block, `engine.block.getColor()` can return an `RGBAColor`, `CMYKColor`, or `SpotColor`. Use a type guard to check if it's a SpotColor:

```typescript
const isSpotColor = (color: unknown): color is SpotColor => {
  return (
    typeof color === 'object' &&
    color !== null &&
    'name' in color &&
    'tint' in color &&
    'externalReference' in color
  );
};

const retrievedColor = engine.block.getColor(fill, 'fill/color/value');
if (isSpotColor(retrievedColor)) {
  console.log(`Name: ${retrievedColor.name}, Tint: ${retrievedColor.tint}`);
}
```

## Update and Remove Spot Colors

### Update Approximations

We update spot colors by calling the set methods again with the same name. This changes how the color appears on screen without affecting the color name in the print output.

```typescript highlight-update-spot
    // Update an existing spot color's approximation
    // This changes how the color appears on screen without affecting the color name
    engine.editor.setSpotColorRGB('Brand-Accent', 0.3, 0.5, 0.9);
    // eslint-disable-next-line no-console
    console.log('Updated Brand-Accent RGB approximation');

    // Show the updated color in a new block
    const { fill: updatedFill } = createColorBlock(390, 220, 150, 150);
    const updatedAccent: SpotColor = {
      name: 'Brand-Accent',
      tint: 1.0,
      externalReference: ''
    };
    engine.block.setColor(updatedFill, 'fill/color/value', updatedAccent);
```

Existing blocks using that spot color automatically reflect the updated approximation.

### Remove Spot Colors

We remove spot colors with `engine.editor.removeSpotColor()` when they're no longer needed.

```typescript highlight-remove-spot
    // Define a temporary spot color
    engine.editor.setSpotColorRGB('Temporary-Color', 0.5, 0.8, 0.3);

    // Create a block using the temporary color
    const { fill: tempFill } = createColorBlock(560, 220, 150, 150);
    const tempColor: SpotColor = {
      name: 'Temporary-Color',
      tint: 1.0,
      externalReference: ''
    };
    engine.block.setColor(tempFill, 'fill/color/value', tempColor);

    // Remove the spot color definition
    // Blocks using this color will display magenta (default fallback)
    engine.editor.removeSpotColor('Temporary-Color');

    // eslint-disable-next-line no-console
    console.log('Removed Temporary-Color - block now shows magenta fallback');

    // Verify the color is no longer defined
    const remainingSpotColors = engine.editor.findAllSpotColors();
    // eslint-disable-next-line no-console
    console.log('Remaining spot colors:', remainingSpotColors);
```

Removing a spot color doesn't affect blocks already using it—they display magenta until redefined or until you apply a different color.

## Spot Colors for Cutouts

CE.SDK supports assigning spot colors to cutout types for die-cutting, embossing, and other print finishing operations.

```typescript highlight-cutout
    // Assign spot colors to cutout types for die-cutting operations
    // First define a spot color for the die line
    engine.editor.setSpotColorRGB('DieLine', 1.0, 0.0, 1.0);
    engine.editor.setSpotColorCMYK('DieLine', 0.0, 1.0, 0.0, 0.0);

    // Associate the spot color with a cutout type
    // CutoutType can be 'Solid' or 'Dashed'
    engine.editor.setSpotColorForCutoutType('Solid', 'DieLine');

    // Query the assigned spot color
    const cutoutSpotColor = engine.editor.getSpotColorForCutoutType('Solid');
    // eslint-disable-next-line no-console
    console.log('Cutout type Solid uses spot color:', cutoutSpotColor);
```

Use `engine.editor.setSpotColorForCutoutType()` to associate a spot color with a specific cutout type. Available cutout types are `'Solid'` and `'Dashed'`, representing different die-line styles used in print finishing. All cutout blocks of that type automatically use the assigned spot color in the output. Query the assignment with `engine.editor.getSpotColorForCutoutType()`.

## Best Practices

**Define early** - Register spot colors at initialization before applying them to blocks. Undefined colors display as magenta, which can confuse users.

**Use descriptive names** - Match your print vendor's reference (e.g., "Pantone-485-C") to ensure correct ink matching in production.

**Provide both approximations** - RGB for screen display, CMYK for print-accurate previews. This gives designers the best experience across different workflows.

**Use tints sparingly** - Prefer tints (0.0-1.0) for lighter variations rather than defining separate spot colors for each shade. This keeps your spot color list manageable.

**Validate before export** - Query `findAllSpotColors()` to verify all expected spot colors are defined before exporting for print.

## Troubleshooting

### Spot Color Displays as Magenta

The spot color hasn't been defined. Call `setSpotColorRGB()` or `setSpotColorCMYK()` with the color name before applying it to blocks.

### Color Approximation Looks Wrong

Update the approximation values using `setSpotColorRGB()` or `setSpotColorCMYK()`. Remember that RGB values are for screen display while CMYK values are for print preview.

### Spot Color Not in Output

Verify the spot color name matches exactly (names are case-sensitive). Check that the block is using a SpotColor object, not an RGB or CMYK color value.

### Can't Remove Spot Color

Ensure you're using the exact name string. Note that removing a spot color doesn't update existing blocks—they'll show magenta until redefined or replaced with a different color.

## API Reference

| Method                                            | Description                                      |
| ------------------------------------------------- | ------------------------------------------------ |
| `engine.editor.setSpotColorRGB(name, r, g, b)`    | Define/update spot color with RGB approximation  |
| `engine.editor.setSpotColorCMYK(name, c, m, y, k)` | Define/update spot color with CMYK approximation |
| `engine.editor.findAllSpotColors()`               | Get array of all defined spot color names        |
| `engine.editor.getSpotColorRGBA(name)`            | Query RGB approximation for a spot color         |
| `engine.editor.getSpotColorCMYK(name)`            | Query CMYK approximation for a spot color        |
| `engine.editor.removeSpotColor(name)`             | Remove a spot color from the registry            |
| `engine.editor.setSpotColorForCutoutType(type, color)` | Assign spot color to a cutout type          |
| `engine.editor.getSpotColorForCutoutType(type)`   | Get spot color assigned to a cutout type         |
| `engine.block.setColor(block, property, color)`   | Apply color (including SpotColor) to a property  |
| `engine.block.getColor(block, property)`          | Read color from a block property                 |

## Next Steps

- [Export for Printing](./export-save-publish/for-printing.md) - Export designs with spot colors for professional print production
- [Apply Colors](./colors/apply.md) - Apply colors to fills, strokes, and shadows
- [CMYK Colors](./colors/for-print/cmyk.md) - Work with CMYK process colors



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support