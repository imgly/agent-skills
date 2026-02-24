> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Fills](./fills.md) > [Gradient](./filters-and-effects/gradients.md)

---

Create smooth color transitions in shapes, text, and design blocks using
CE.SDK's gradient fill system with support for linear, radial, and conical
gradients.

![Gradient Fills example showing linear, radial, and conical gradient transitions](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 20 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-fills-gradient-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-fills-gradient-browser)
>
> - [Live demo](https://img.ly/examples/guides-fills-gradient-browser/)

Gradient fills are one of the fundamental fill types in CE.SDK, allowing you to paint design blocks with smooth color transitions. Unlike solid color fills that apply a uniform color or image fills that display photo content, gradient fills create dynamic visual effects with depth and visual interest. The gradient fill system supports three types: linear gradients that transition along a straight line, radial gradients that emanate from a center point, and conical gradients that rotate around a center point like a color wheel.

```typescript file=@cesdk_web_examples/guides-fills-gradient-browser/browser.ts reference-only
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
 * CE.SDK Plugin: Gradient Fills Guide
 *
 * This example demonstrates:
 * - Creating linear, radial, and conical gradient fills
 * - Configuring gradient color stops
 * - Positioning gradients
 * - Using different color spaces in gradients
 * - Advanced gradient techniques
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

    // Fill features are enabled by default in CE.SDK
    // You can check and control fill feature availability:
    const engine = cesdk.engine;
    const isFillEnabled = cesdk.feature.isEnabled('ly.img.fill', { engine });
    console.log('Fill feature enabled:', isFillEnabled);

    // Create a design scene using CE.SDK cesdk method
    await cesdk.actions.run('scene.create', {
      page: { width: 1200, height: 900, unit: 'Pixel' }
    });

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page background to light gray
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 15);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Helper function to create a shape with a fill
    const createShapeWithFill = (
      fillType: 'gradient/linear' | 'gradient/radial' | 'gradient/conical'
    ): { block: number; fill: number } => {
      const block = engine.block.create('graphic');
      const shape = engine.block.createShape('rect');
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

      // Create gradient fill
      const gradientFill = engine.block.createFill(fillType);

      // Apply the fill to the block
      engine.block.setFill(block, gradientFill);

      return { block, fill: gradientFill };
    };

    // =============================================================================
    // Example 1: Linear Gradient (Vertical)
    // =============================================================================
    const { block: linearVerticalBlock, fill: linearVertical } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(linearVertical, 'fill/gradient/colors', [
      { color: { r: 1.0, g: 0.8, b: 0.2, a: 1.0 }, stop: 0 },
      { color: { r: 0.3, g: 0.4, b: 0.7, a: 1.0 }, stop: 1 }
    ]);

    // Set vertical gradient (top to bottom)
    engine.block.setFloat(
      linearVertical,
      'fill/gradient/linear/startPointX',
      0.5
    );
    engine.block.setFloat(
      linearVertical,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(
      linearVertical,
      'fill/gradient/linear/endPointX',
      0.5
    );
    engine.block.setFloat(linearVertical, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 2: Linear Gradient (Horizontal)
    // =============================================================================
    const { block: linearHorizontalBlock, fill: linearHorizontal } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      linearHorizontal,
      'fill/gradient/colors',
      [
        { color: { r: 0.8, g: 0.2, b: 0.4, a: 1.0 }, stop: 0 },
        { color: { r: 0.2, g: 0.8, b: 0.6, a: 1.0 }, stop: 1 }
      ]
    );

    // Set horizontal gradient (left to right)
    engine.block.setFloat(
      linearHorizontal,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      linearHorizontal,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(
      linearHorizontal,
      'fill/gradient/linear/endPointX',
      1
    );
    engine.block.setFloat(
      linearHorizontal,
      'fill/gradient/linear/endPointY',
      0.5
    );

    // =============================================================================
    // Example 3: Linear Gradient (Diagonal)
    // =============================================================================
    const { block: linearDiagonalBlock, fill: linearDiagonal } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(linearDiagonal, 'fill/gradient/colors', [
      { color: { r: 0.5, g: 0.2, b: 0.8, a: 1.0 }, stop: 0 },
      { color: { r: 0.9, g: 0.6, b: 0.2, a: 1.0 }, stop: 1 }
    ]);

    // Set diagonal gradient (top-left to bottom-right)
    engine.block.setFloat(
      linearDiagonal,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      linearDiagonal,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(linearDiagonal, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(linearDiagonal, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 4: Multi-Stop Linear Gradient (Aurora Effect)
    // =============================================================================
    const { block: auroraGradientBlock, fill: auroraGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(auroraGradient, 'fill/gradient/colors', [
      { color: { r: 0.4, g: 0.1, b: 0.8, a: 1 }, stop: 0 },
      { color: { r: 0.8, g: 0.2, b: 0.6, a: 1 }, stop: 0.3 },
      { color: { r: 1.0, g: 0.5, b: 0.3, a: 1 }, stop: 0.6 },
      { color: { r: 1.0, g: 0.8, b: 0.2, a: 1 }, stop: 1 }
    ]);

    engine.block.setFloat(
      auroraGradient,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      auroraGradient,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(auroraGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(
      auroraGradient,
      'fill/gradient/linear/endPointY',
      0.5
    );

    // =============================================================================
    // Example 5: Radial Gradient (Centered)
    // =============================================================================
    const { block: radialCenteredBlock, fill: radialCentered } =
      createShapeWithFill('gradient/radial');

    engine.block.setGradientColorStops(radialCentered, 'fill/gradient/colors', [
      { color: { r: 1.0, g: 1.0, b: 1.0, a: 0.3 }, stop: 0 },
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 }
    ]);

    // Set center point (middle of block)
    engine.block.setFloat(
      radialCentered,
      'fill/gradient/radial/centerPointX',
      0.5
    );
    engine.block.setFloat(
      radialCentered,
      'fill/gradient/radial/centerPointY',
      0.5
    );
    engine.block.setFloat(radialCentered, 'fill/gradient/radial/radius', 0.8);

    // =============================================================================
    // Example 6: Radial Gradient (Top-Left Highlight)
    // =============================================================================
    const { block: radialHighlightBlock, fill: radialHighlight } =
      createShapeWithFill('gradient/radial');

    engine.block.setGradientColorStops(
      radialHighlight,
      'fill/gradient/colors',
      [
        { color: { r: 1.0, g: 1.0, b: 1.0, a: 0.3 }, stop: 0 },
        { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 }
      ]
    );

    // Set top-left highlight
    engine.block.setFloat(
      radialHighlight,
      'fill/gradient/radial/centerPointX',
      0
    );
    engine.block.setFloat(
      radialHighlight,
      'fill/gradient/radial/centerPointY',
      0
    );
    engine.block.setFloat(radialHighlight, 'fill/gradient/radial/radius', 1.0);

    // =============================================================================
    // Example 7: Radial Gradient (Vignette Effect)
    // =============================================================================
    const { block: radialVignetteBlock, fill: radialVignette } =
      createShapeWithFill('gradient/radial');

    engine.block.setGradientColorStops(radialVignette, 'fill/gradient/colors', [
      { color: { r: 0.9, g: 0.9, b: 0.9, a: 1.0 }, stop: 0 },
      { color: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 }, stop: 1 }
    ]);

    // Centered vignette
    engine.block.setFloat(
      radialVignette,
      'fill/gradient/radial/centerPointX',
      0.5
    );
    engine.block.setFloat(
      radialVignette,
      'fill/gradient/radial/centerPointY',
      0.5
    );
    engine.block.setFloat(radialVignette, 'fill/gradient/radial/radius', 0.6);

    // =============================================================================
    // Example 8: Conical Gradient (Color Wheel)
    // =============================================================================
    const { block: conicalColorWheelBlock, fill: conicalColorWheel } =
      createShapeWithFill('gradient/conical');

    engine.block.setGradientColorStops(
      conicalColorWheel,
      'fill/gradient/colors',
      [
        { color: { r: 1.0, g: 0.0, b: 0.0, a: 1 }, stop: 0 },
        { color: { r: 1.0, g: 1.0, b: 0.0, a: 1 }, stop: 0.25 },
        { color: { r: 0.0, g: 1.0, b: 0.0, a: 1 }, stop: 0.5 },
        { color: { r: 0.0, g: 0.0, b: 1.0, a: 1 }, stop: 0.75 },
        { color: { r: 1.0, g: 0.0, b: 0.0, a: 1 }, stop: 1 }
      ]
    );

    // Set center point (middle of block)
    engine.block.setFloat(
      conicalColorWheel,
      'fill/gradient/conical/centerPointX',
      0.5
    );
    engine.block.setFloat(
      conicalColorWheel,
      'fill/gradient/conical/centerPointY',
      0.5
    );

    // =============================================================================
    // Example 9: Conical Gradient (Loading Spinner)
    // =============================================================================
    const { block: conicalSpinnerBlock, fill: conicalSpinner } =
      createShapeWithFill('gradient/conical');

    engine.block.setGradientColorStops(conicalSpinner, 'fill/gradient/colors', [
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1 }, stop: 0 },
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 0 }, stop: 0.75 },
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1 }, stop: 1 }
    ]);

    engine.block.setFloat(
      conicalSpinner,
      'fill/gradient/conical/centerPointX',
      0.5
    );
    engine.block.setFloat(
      conicalSpinner,
      'fill/gradient/conical/centerPointY',
      0.5
    );

    // =============================================================================
    // Example 10: Gradient with CMYK Colors
    // =============================================================================
    const { block: cmykGradientBlock, fill: cmykGradient } =
      createShapeWithFill('gradient/linear');

    // CMYK color stops for print
    engine.block.setGradientColorStops(cmykGradient, 'fill/gradient/colors', [
      { color: { c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0 }, stop: 0 },
      { color: { c: 1.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0 }, stop: 1 }
    ]);

    engine.block.setFloat(cmykGradient, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(
      cmykGradient,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(cmykGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(cmykGradient, 'fill/gradient/linear/endPointY', 0.5);

    // =============================================================================
    // Example 11: Gradient with Spot Colors
    // =============================================================================
    // First define spot colors
    engine.editor.setSpotColorRGB('BrandPrimary', 0.2, 0.4, 0.8);
    engine.editor.setSpotColorRGB('BrandSecondary', 1.0, 0.6, 0.0);

    const { block: spotGradientBlock, fill: spotGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(spotGradient, 'fill/gradient/colors', [
      {
        color: { name: 'BrandPrimary', tint: 1.0, externalReference: '' },
        stop: 0
      },
      {
        color: { name: 'BrandSecondary', tint: 1.0, externalReference: '' },
        stop: 1
      }
    ]);

    engine.block.setFloat(spotGradient, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(spotGradient, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(spotGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(spotGradient, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 12: Transparency Overlay Gradient
    // =============================================================================
    const { block: overlayGradientBlock, fill: overlayGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      overlayGradient,
      'fill/gradient/colors',
      [
        { color: { r: 0.0, g: 0.0, b: 0.0, a: 0 }, stop: 0 },
        { color: { r: 0.0, g: 0.0, b: 0.0, a: 0.7 }, stop: 1 }
      ]
    );

    engine.block.setFloat(
      overlayGradient,
      'fill/gradient/linear/startPointX',
      0.5
    );
    engine.block.setFloat(
      overlayGradient,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(
      overlayGradient,
      'fill/gradient/linear/endPointX',
      0.5
    );
    engine.block.setFloat(overlayGradient, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 13: Duotone Gradient
    // =============================================================================
    const { block: duotoneGradientBlock, fill: duotoneGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      duotoneGradient,
      'fill/gradient/colors',
      [
        { color: { r: 0.8, g: 0.2, b: 0.9, a: 1 }, stop: 0 },
        { color: { r: 0.2, g: 0.9, b: 0.8, a: 1 }, stop: 1 }
      ]
    );

    engine.block.setFloat(
      duotoneGradient,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      duotoneGradient,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(duotoneGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(duotoneGradient, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 14: Shared Gradient Fill
    // =============================================================================
    const block1 = engine.block.create('graphic');
    const shape1 = engine.block.createShape('rect');
    engine.block.setShape(block1, shape1);
    engine.block.setWidth(block1, blockWidth);
    engine.block.setHeight(block1, blockHeight / 2 - 5);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    const shape2 = engine.block.createShape('rect');
    engine.block.setShape(block2, shape2);
    engine.block.setWidth(block2, blockWidth);
    engine.block.setHeight(block2, blockHeight / 2 - 5);
    engine.block.appendChild(page, block2);

    // Create one gradient fill
    const sharedGradient = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(sharedGradient, 'fill/gradient/colors', [
      { color: { r: 1, g: 0, b: 0, a: 1 }, stop: 0 },
      { color: { r: 0, g: 0, b: 1, a: 1 }, stop: 1 }
    ]);

    engine.block.setFloat(
      sharedGradient,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      sharedGradient,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(sharedGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(
      sharedGradient,
      'fill/gradient/linear/endPointY',
      0.5
    );

    // Apply to both blocks
    engine.block.setFill(block1, sharedGradient);
    engine.block.setFill(block2, sharedGradient);

    // Change gradient after a delay to show it affects both
    setTimeout(() => {
      engine.block.setGradientColorStops(
        sharedGradient,
        'fill/gradient/colors',
        [
          { color: { r: 0, g: 1, b: 0, a: 1 }, stop: 0 },
          { color: { r: 1, g: 1, b: 0, a: 1 }, stop: 1 }
        ]
      );
    }, 2000);

    // =============================================================================
    // Example 15: Get Gradient Properties
    // =============================================================================
    const { block: inspectGradientBlock, fill: inspectGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      inspectGradient,
      'fill/gradient/colors',
      [
        { color: { r: 0.6, g: 0.3, b: 0.7, a: 1.0 }, stop: 0 },
        { color: { r: 0.3, g: 0.7, b: 0.6, a: 1.0 }, stop: 1 }
      ]
    );

    // Get current fill from block
    const fillId = engine.block.getFill(block1);
    const fillType = engine.block.getType(fillId);
    // eslint-disable-next-line no-console
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/gradient/linear'

    // Get gradient color stops
    const colorStops = engine.block.getGradientColorStops(
      inspectGradient,
      'fill/gradient/colors'
    );
    // eslint-disable-next-line no-console
    console.log('Color stops:', colorStops);

    // Get linear gradient position
    const startX = engine.block.getFloat(
      inspectGradient,
      'fill/gradient/linear/startPointX'
    );
    const startY = engine.block.getFloat(
      inspectGradient,
      'fill/gradient/linear/startPointY'
    );
    const endX = engine.block.getFloat(
      inspectGradient,
      'fill/gradient/linear/endPointX'
    );
    const endY = engine.block.getFloat(
      inspectGradient,
      'fill/gradient/linear/endPointY'
    );
    // eslint-disable-next-line no-console
    console.log('Linear gradient position:', { startX, startY, endX, endY });

    // ===== Position all blocks in grid layout =====
    const blocks = [
      linearVerticalBlock, // Position 0
      linearHorizontalBlock, // Position 1
      linearDiagonalBlock, // Position 2
      auroraGradientBlock, // Position 3
      radialCenteredBlock, // Position 4
      radialHighlightBlock, // Position 5
      radialVignetteBlock, // Position 6
      conicalColorWheelBlock, // Position 7
      conicalSpinnerBlock, // Position 8
      cmykGradientBlock, // Position 9
      spotGradientBlock, // Position 10
      overlayGradientBlock, // Position 11
      duotoneGradientBlock, // Position 12
      block1, // Position 13 (top half)
      inspectGradientBlock // Position 14
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Position block2 below block1 in the same grid cell
    const block1Pos = getPosition(13);
    engine.block.setPositionX(block2, block1Pos.x);
    engine.block.setPositionY(block2, block1Pos.y + blockHeight / 2 + 5);

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

This guide demonstrates how to create, apply, and configure gradient fills programmatically, work with color stops, position gradients, and create modern visual effects like aurora gradients and button highlights.

## Understanding Gradient Fills

### What is a Gradient Fill?

A gradient fill is a fill object that paints a design block with smooth color transitions. Gradient fills are part of the broader fill system in CE.SDK and come in three types, each identified by a unique type string:

- **Linear**: `'//ly.img.ubq/fill/gradient/linear'` or `'gradient/linear'`
- **Radial**: `'//ly.img.ubq/fill/gradient/radial'` or `'gradient/radial'`
- **Conical**: `'//ly.img.ubq/fill/gradient/conical'` or `'gradient/conical'`

Each gradient type contains color stops that define colors at specific positions and positioning properties that control the gradient's direction and coverage.

### Gradient Types Comparison

#### Linear Gradients

Linear gradients transition colors along a straight line defined by start and end points. They're the most common gradient type and create clean, modern looks. Common use cases include hero sections, call-to-action buttons, headers, and banners.

```typescript highlight-linear-gradient
    const { block: linearVerticalBlock, fill: linearVertical } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(linearVertical, 'fill/gradient/colors', [
      { color: { r: 1.0, g: 0.8, b: 0.2, a: 1.0 }, stop: 0 },
      { color: { r: 0.3, g: 0.4, b: 0.7, a: 1.0 }, stop: 1 }
    ]);
```

#### Radial Gradients

Radial gradients emanate from a central point outward, creating circular or elliptical color transitions. They add depth and create focal points or spotlight effects. Common use cases include button highlights, card shadows, vignettes, and circular badges.

```typescript highlight-radial-gradient
engine.block.setGradientColorStops(radialCentered, 'fill/gradient/colors', [
  { color: { r: 1.0, g: 1.0, b: 1.0, a: 0.3 }, stop: 0 },
  { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 }
]);
```

#### Conical Gradients

Conical gradients transition colors around a center point like a color wheel, starting at the top (12 o'clock) and rotating clockwise. Colors are specified by position rather than angle. Common use cases include pie charts, loading spinners, circular progress indicators, and color picker wheels.

```typescript highlight-conical-gradient
engine.block.setGradientColorStops(
  conicalColorWheel,
  'fill/gradient/colors',
  [
    { color: { r: 1.0, g: 0.0, b: 0.0, a: 1 }, stop: 0 },
    { color: { r: 1.0, g: 1.0, b: 0.0, a: 1 }, stop: 0.25 },
    { color: { r: 0.0, g: 1.0, b: 0.0, a: 1 }, stop: 0.5 },
    { color: { r: 0.0, g: 0.0, b: 1.0, a: 1 }, stop: 0.75 },
    { color: { r: 1.0, g: 0.0, b: 0.0, a: 1 }, stop: 1 }
  ]
);
```

### Gradient vs Other Fill Types

Understanding how gradients differ from other fill types helps you choose the right fill for your design:

- **Gradient fills**: Smooth color transitions (linear, radial, conical)
- **Color fills**: Solid, uniform color
- **Image fills**: Photo or raster content
- **Video fills**: Animated video content

### Color Stops Explained

Color stops define the colors at specific positions in the gradient. Each stop consists of:

- `color`: An RGB, CMYK, or Spot color value
- `stop`: Position value between 0.0 and 1.0 (0% to 100%)

A gradient requires a minimum of two color stops. You can add multiple stops to create complex color transitions. Color stops can use any color space supported by CE.SDK, including RGB for screen display, CMYK for print, and Spot Colors for brand consistency.

```typescript highlight-color-stops
engine.block.setGradientColorStops(auroraGradient, 'fill/gradient/colors', [
  { color: { r: 0.4, g: 0.1, b: 0.8, a: 1 }, stop: 0 },
  { color: { r: 0.8, g: 0.2, b: 0.6, a: 1 }, stop: 0.3 },
  { color: { r: 1.0, g: 0.5, b: 0.3, a: 1 }, stop: 0.6 },
  { color: { r: 1.0, g: 0.8, b: 0.2, a: 1 }, stop: 1 }
]);
```

## Using the Built-in Gradient UI

CE.SDK provides built-in UI controls for working with gradients through the **inspector bar** and **advanced inspector**. Users can switch between solid color and gradient fills, select gradient type (linear, radial, conical), add and remove color stops visually, adjust individual stop colors, and drag gradient control points for positioning.

**Note**: Currently, only **linear gradients** are fully supported in the built-in UI. Radial and conical gradients are available programmatically.

### Enabling Fill Features

Gradient controls are part of the fill feature system. You can check if the fill feature is enabled and control it programmatically:

```typescript highlight-enable-fill-feature
// Fill features are enabled by default in CE.SDK
// You can check and control fill feature availability:
const engine = cesdk.engine;
const isFillEnabled = cesdk.feature.isEnabled('ly.img.fill', { engine });
console.log('Fill feature enabled:', isFillEnabled);
```

## Checking Gradient Fill Support

### Verifying Block Compatibility

Before applying gradient fills, verify that the block type supports fills. Not all blocks support fills—for example, scenes and pages typically don't.

```typescript highlight-check-fill-support
// Check if block supports fills
const canHaveFill = engine.block.supportsFill(block);
if (!canHaveFill) {
  throw new Error('Block does not support fills');
}
```

Always check `supportsFill()` before accessing fill APIs. Graphic blocks, shapes, and text typically support fills.

## Creating Gradient Fills

### Creating a New Linear Gradient

Create a new linear gradient fill using the `createFill()` method with the type `'gradient/linear'`:

```typescript highlight-create-linear
const { block: linearVerticalBlock, fill: linearVertical } =
  createShapeWithFill('gradient/linear');
```

### Creating a Radial Gradient

Create a radial gradient using the type `'gradient/radial'`:

```typescript highlight-create-radial
const { block: radialCenteredBlock, fill: radialCentered } =
  createShapeWithFill('gradient/radial');
```

### Creating a Conical Gradient

Create a conical gradient using the type `'gradient/conical'`:

```typescript highlight-create-conical
const { block: conicalColorWheelBlock, fill: conicalColorWheel } =
  createShapeWithFill('gradient/conical');
```

The `createFill()` method returns a numeric fill ID. The fill exists independently until you attach it to a block. If you create a fill but don't attach it to a block, you must destroy it manually to prevent memory leaks.

## Applying Gradient Fills

### Setting a Gradient Fill on a Block

Once you've created a gradient fill, attach it to a block using `setFill()`:

```typescript highlight-apply-gradient
      // Create gradient fill
      const gradientFill = engine.block.createFill(fillType);

      // Apply the fill to the block
      engine.block.setFill(block, gradientFill);
```

### Getting the Current Fill

Retrieve the current fill attached to a block and inspect its type:

```typescript highlight-get-fill
    const { block: inspectGradientBlock, fill: inspectGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      inspectGradient,
      'fill/gradient/colors',
      [
        { color: { r: 0.6, g: 0.3, b: 0.7, a: 1.0 }, stop: 0 },
        { color: { r: 0.3, g: 0.7, b: 0.6, a: 1.0 }, stop: 1 }
      ]
    );

    // Get current fill from block
    const fillId = engine.block.getFill(block1);
    const fillType = engine.block.getType(fillId);
    // eslint-disable-next-line no-console
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/gradient/linear'
```

## Configuring Gradient Color Stops

### Setting Color Stops

Set color stops using the `setGradientColorStops()` method with an array of color and position pairs:

```typescript highlight-set-color-stops
engine.block.setGradientColorStops(linearVertical, 'fill/gradient/colors', [
  { color: { r: 1.0, g: 0.8, b: 0.2, a: 1.0 }, stop: 0 },
  { color: { r: 0.3, g: 0.4, b: 0.7, a: 1.0 }, stop: 1 }
]);
```

RGB values are normalized floats from 0.0 to 1.0. Stop positions are normalized where 0.0 represents the start and 1.0 represents the end. The alpha channel controls opacity per color stop.

### Getting Color Stops

Retrieve the current color stops from a gradient fill:

```typescript highlight-get-color-stops
// Get gradient color stops
const colorStops = engine.block.getGradientColorStops(
  inspectGradient,
  'fill/gradient/colors'
);
// eslint-disable-next-line no-console
console.log('Color stops:', colorStops);
```

### Using Different Color Spaces

Gradient color stops support multiple color spaces:

```typescript highlight-color-spaces
    const { block: cmykGradientBlock, fill: cmykGradient } =
      createShapeWithFill('gradient/linear');

    // CMYK color stops for print
    engine.block.setGradientColorStops(cmykGradient, 'fill/gradient/colors', [
      { color: { c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0 }, stop: 0 },
      { color: { c: 1.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0 }, stop: 1 }
    ]);

    engine.block.setFloat(cmykGradient, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(
      cmykGradient,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(cmykGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(cmykGradient, 'fill/gradient/linear/endPointY', 0.5);
```

## Positioning Linear Gradients

### Setting Start and End Points

Linear gradients are positioned using start and end points with normalized coordinates (0.0 to 1.0) relative to block dimensions:

```typescript highlight-linear-position
// Set vertical gradient (top to bottom)
engine.block.setFloat(
  linearVertical,
  'fill/gradient/linear/startPointX',
  0.5
);
engine.block.setFloat(
  linearVertical,
  'fill/gradient/linear/startPointY',
  0
);
engine.block.setFloat(
  linearVertical,
  'fill/gradient/linear/endPointX',
  0.5
);
engine.block.setFloat(linearVertical, 'fill/gradient/linear/endPointY', 1);
```

Coordinates are normalized where (0, 0) represents the top-left corner and (1, 1) represents the bottom-right corner.

### Common Linear Gradient Directions

**Horizontal (Left to Right):**

```typescript
engine.block.setFloat(linearGradient, 'fill/gradient/linear/startPointX', 0);
engine.block.setFloat(linearGradient, 'fill/gradient/linear/startPointY', 0.5);
engine.block.setFloat(linearGradient, 'fill/gradient/linear/endPointX', 1);
engine.block.setFloat(linearGradient, 'fill/gradient/linear/endPointY', 0.5);
```

**Diagonal (Top-Left to Bottom-Right):**

```typescript
engine.block.setFloat(linearGradient, 'fill/gradient/linear/startPointX', 0);
engine.block.setFloat(linearGradient, 'fill/gradient/linear/startPointY', 0);
engine.block.setFloat(linearGradient, 'fill/gradient/linear/endPointX', 1);
engine.block.setFloat(linearGradient, 'fill/gradient/linear/endPointY', 1);
```

### Getting Current Position

Retrieve the current position values:

```typescript highlight-get-linear-position
// Get linear gradient position
const startX = engine.block.getFloat(
  inspectGradient,
  'fill/gradient/linear/startPointX'
);
const startY = engine.block.getFloat(
  inspectGradient,
  'fill/gradient/linear/startPointY'
);
const endX = engine.block.getFloat(
  inspectGradient,
  'fill/gradient/linear/endPointX'
);
const endY = engine.block.getFloat(
  inspectGradient,
  'fill/gradient/linear/endPointY'
);
// eslint-disable-next-line no-console
console.log('Linear gradient position:', { startX, startY, endX, endY });
```

## Positioning Radial Gradients

### Setting Center Point and Radius

Radial gradients are positioned using a center point and radius:

```typescript highlight-radial-position
// Set center point (middle of block)
engine.block.setFloat(
  radialCentered,
  'fill/gradient/radial/centerPointX',
  0.5
);
engine.block.setFloat(
  radialCentered,
  'fill/gradient/radial/centerPointY',
  0.5
);
engine.block.setFloat(radialCentered, 'fill/gradient/radial/radius', 0.8);
```

The `centerPointX/Y` properties use normalized coordinates (0.0 to 1.0) relative to block dimensions. The `radius` property is relative to the smaller side of the block frame, where 1.0 equals full coverage. Default values are centerX = 0.0, centerY = 0.0, and radius = 1.0.

### Common Radial Patterns

**Centered Circle:**

```typescript
engine.block.setFloat(radialGradient, 'fill/gradient/radial/centerPointX', 0.5);
engine.block.setFloat(radialGradient, 'fill/gradient/radial/centerPointY', 0.5);
engine.block.setFloat(radialGradient, 'fill/gradient/radial/radius', 0.7);
```

**Top-Left Highlight:**

```typescript
engine.block.setFloat(radialGradient, 'fill/gradient/radial/centerPointX', 0);
engine.block.setFloat(radialGradient, 'fill/gradient/radial/centerPointY', 0);
engine.block.setFloat(radialGradient, 'fill/gradient/radial/radius', 1.0);
```

**Bottom-Right Vignette:**

```typescript
engine.block.setFloat(radialGradient, 'fill/gradient/radial/centerPointX', 1);
engine.block.setFloat(radialGradient, 'fill/gradient/radial/centerPointY', 1);
engine.block.setFloat(radialGradient, 'fill/gradient/radial/radius', 1.5);
```

## Positioning Conical Gradients

### Setting Center Point

Conical gradients are positioned using a center point. The rotation starts at the top (12 o'clock) and proceeds clockwise:

```typescript highlight-conical-position
// Set center point (middle of block)
engine.block.setFloat(
  conicalColorWheel,
  'fill/gradient/conical/centerPointX',
  0.5
);
engine.block.setFloat(
  conicalColorWheel,
  'fill/gradient/conical/centerPointY',
  0.5
);
```

The `centerPointX/Y` properties use normalized coordinates (0.0 to 1.0) relative to block dimensions. There is no separate rotation or angle property—the gradient always starts at the top. Default values are centerX = 0.0 and centerY = 0.0.

## Additional Techniques

### Sharing Gradient Fills

You can share a single gradient fill between multiple blocks. Changes to the shared gradient affect all blocks using it:

```typescript highlight-share-gradient
    const block1 = engine.block.create('graphic');
    const shape1 = engine.block.createShape('rect');
    engine.block.setShape(block1, shape1);
    engine.block.setWidth(block1, blockWidth);
    engine.block.setHeight(block1, blockHeight / 2 - 5);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    const shape2 = engine.block.createShape('rect');
    engine.block.setShape(block2, shape2);
    engine.block.setWidth(block2, blockWidth);
    engine.block.setHeight(block2, blockHeight / 2 - 5);
    engine.block.appendChild(page, block2);

    // Create one gradient fill
    const sharedGradient = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(sharedGradient, 'fill/gradient/colors', [
      { color: { r: 1, g: 0, b: 0, a: 1 }, stop: 0 },
      { color: { r: 0, g: 0, b: 1, a: 1 }, stop: 1 }
    ]);

    engine.block.setFloat(
      sharedGradient,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      sharedGradient,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(sharedGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(
      sharedGradient,
      'fill/gradient/linear/endPointY',
      0.5
    );

    // Apply to both blocks
    engine.block.setFill(block1, sharedGradient);
    engine.block.setFill(block2, sharedGradient);

    // Change gradient after a delay to show it affects both
    setTimeout(() => {
      engine.block.setGradientColorStops(
        sharedGradient,
        'fill/gradient/colors',
        [
          { color: { r: 0, g: 1, b: 0, a: 1 }, stop: 0 },
          { color: { r: 1, g: 1, b: 0, a: 1 }, stop: 1 }
        ]
      );
    }, 2000);
```

### Duplicating Gradient Fills

When you duplicate a block, its gradient fill is automatically duplicated, creating an independent copy. Each duplicate has its own fill instance that can be modified independently without affecting the original.

## Common Use Cases

### Modern Hero Background (Aurora Effect)

Create dreamy multi-color gradient backgrounds for hero sections:

```typescript highlight-aurora-gradient
    const { block: auroraGradientBlock, fill: auroraGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(auroraGradient, 'fill/gradient/colors', [
      { color: { r: 0.4, g: 0.1, b: 0.8, a: 1 }, stop: 0 },
      { color: { r: 0.8, g: 0.2, b: 0.6, a: 1 }, stop: 0.3 },
      { color: { r: 1.0, g: 0.5, b: 0.3, a: 1 }, stop: 0.6 },
      { color: { r: 1.0, g: 0.8, b: 0.2, a: 1 }, stop: 1 }
    ]);

    engine.block.setFloat(
      auroraGradient,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      auroraGradient,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(auroraGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(
      auroraGradient,
      'fill/gradient/linear/endPointY',
      0.5
    );
```

### Button Highlight Effect

Use radial gradients to add depth and highlight effects to buttons:

```typescript highlight-button-gradient
    const { block: radialHighlightBlock, fill: radialHighlight } =
      createShapeWithFill('gradient/radial');

    engine.block.setGradientColorStops(
      radialHighlight,
      'fill/gradient/colors',
      [
        { color: { r: 1.0, g: 1.0, b: 1.0, a: 0.3 }, stop: 0 },
        { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 }
      ]
    );

    // Set top-left highlight
    engine.block.setFloat(
      radialHighlight,
      'fill/gradient/radial/centerPointX',
      0
    );
    engine.block.setFloat(
      radialHighlight,
      'fill/gradient/radial/centerPointY',
      0
    );
    engine.block.setFloat(radialHighlight, 'fill/gradient/radial/radius', 1.0);
```

### Loading Spinner (Conical)

Create circular progress indicators and loading animations with conical gradients:

```typescript highlight-spinner-gradient
    const { block: conicalSpinnerBlock, fill: conicalSpinner } =
      createShapeWithFill('gradient/conical');

    engine.block.setGradientColorStops(conicalSpinner, 'fill/gradient/colors', [
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1 }, stop: 0 },
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 0 }, stop: 0.75 },
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1 }, stop: 1 }
    ]);

    engine.block.setFloat(
      conicalSpinner,
      'fill/gradient/conical/centerPointX',
      0.5
    );
    engine.block.setFloat(
      conicalSpinner,
      'fill/gradient/conical/centerPointY',
      0.5
    );
```

### Transparency Overlay

Create smooth transparency effects with alpha channel transitions:

```typescript highlight-overlay-gradient
    const { block: overlayGradientBlock, fill: overlayGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      overlayGradient,
      'fill/gradient/colors',
      [
        { color: { r: 0.0, g: 0.0, b: 0.0, a: 0 }, stop: 0 },
        { color: { r: 0.0, g: 0.0, b: 0.0, a: 0.7 }, stop: 1 }
      ]
    );

    engine.block.setFloat(
      overlayGradient,
      'fill/gradient/linear/startPointX',
      0.5
    );
    engine.block.setFloat(
      overlayGradient,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(
      overlayGradient,
      'fill/gradient/linear/endPointX',
      0.5
    );
    engine.block.setFloat(overlayGradient, 'fill/gradient/linear/endPointY', 1);
```

### Duotone Effect

Create modern two-color gradient overlays:

```typescript highlight-duotone-gradient
    const { block: duotoneGradientBlock, fill: duotoneGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      duotoneGradient,
      'fill/gradient/colors',
      [
        { color: { r: 0.8, g: 0.2, b: 0.9, a: 1 }, stop: 0 },
        { color: { r: 0.2, g: 0.9, b: 0.8, a: 1 }, stop: 1 }
      ]
    );

    engine.block.setFloat(
      duotoneGradient,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      duotoneGradient,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(duotoneGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(duotoneGradient, 'fill/gradient/linear/endPointY', 1);
```

## Troubleshooting

### Gradient Not Visible

If your gradient doesn't appear:

- Check if fill is enabled: `engine.block.isFillEnabled(block)`
- Verify color stops have visible colors (check alpha channels)
- Ensure block has valid dimensions (width and height > 0)
- Confirm block is in the scene hierarchy
- Check if color stops are properly ordered by stop position

### Gradient Looks Different Than Expected

If the gradient doesn't look right:

- Verify color stop positions are between 0.0 and 1.0
- Check gradient direction and positioning properties
- Ensure correct gradient type is used (linear vs radial vs conical)
- Review color space (RGB vs CMYK) for output medium
- Confirm alpha values for transparency effects

### Gradient Direction Wrong

If the gradient direction is incorrect:

- For linear gradients, check `startPointX/Y` and `endPointX/Y` values
- Remember coordinates are normalized (0.0 to 1.0), not pixels
- Verify the block's coordinate system and transformations
- Test with simple horizontal or vertical gradients first

### Memory Leaks

To prevent memory leaks:

- Always destroy replaced gradients: `engine.block.destroy(oldFill)`
- Don't create gradient fills without attaching them to blocks
- Clean up shared gradients when no longer needed

### Cannot Apply Gradient to Block

If you can't apply a gradient fill:

- Verify block supports fills: `engine.block.supportsFill(block)`
- Check if block has a shape: Some blocks require shapes
- Ensure gradient fill object is valid and not already destroyed

### Color Stops Not Updating

If color stops don't update:

- Verify you're calling `setGradientColorStops()` not `setColor()`
- Ensure property name is exactly `'fill/gradient/colors'`
- Check that color stop array is properly formatted
- Confirm fill ID is correct and still valid

## API Reference

### Core Methods

| Method                                         | Description                             |
| ---------------------------------------------- | --------------------------------------- |
| `createFill('gradient/linear')`                | Create a new linear gradient fill       |
| `createFill('gradient/radial')`                | Create a new radial gradient fill       |
| `createFill('gradient/conical')`               | Create a new conical gradient fill      |
| `setFill(block, fill)`                         | Assign gradient fill to a block         |
| `getFill(block)`                               | Get the fill ID from a block            |
| `setGradientColorStops(fill, property, stops)` | Set gradient color stops array          |
| `getGradientColorStops(fill, property)`        | Get current gradient color stops        |
| `setFloat(fill, property, value)`              | Set gradient position/radius properties |
| `getFloat(fill, property)`                     | Get gradient position/radius values     |
| `setFillEnabled(block, enabled)`               | Enable or disable fill rendering        |
| `isFillEnabled(block)`                         | Check if fill is enabled                |
| `supportsFill(block)`                          | Check if block supports fills           |

### Linear Gradient Properties

| Property                           | Type                | Default | Description               |
| ---------------------------------- | ------------------- | ------- | ------------------------- |
| `fill/gradient/colors`             | GradientColorStop\[] | -       | Array of color stops      |
| `fill/gradient/linear/startPointX` | Float (0.0-1.0)     | 0.5     | Horizontal start position |
| `fill/gradient/linear/startPointY` | Float (0.0-1.0)     | 0.0     | Vertical start position   |
| `fill/gradient/linear/endPointX`   | Float (0.0-1.0)     | 0.5     | Horizontal end position   |
| `fill/gradient/linear/endPointY`   | Float (0.0-1.0)     | 1.0     | Vertical end position     |

### Radial Gradient Properties

| Property                            | Type                | Default | Description                     |
| ----------------------------------- | ------------------- | ------- | ------------------------------- |
| `fill/gradient/colors`              | GradientColorStop\[] | -       | Array of color stops            |
| `fill/gradient/radial/centerPointX` | Float (0.0-1.0)     | 0.0     | Horizontal center position      |
| `fill/gradient/radial/centerPointY` | Float (0.0-1.0)     | 0.0     | Vertical center position        |
| `fill/gradient/radial/radius`       | Float               | 1.0     | Radius relative to smaller side |

### Conical Gradient Properties

| Property                             | Type                | Default | Description                |
| ------------------------------------ | ------------------- | ------- | -------------------------- |
| `fill/gradient/colors`               | GradientColorStop\[] | -       | Array of color stops       |
| `fill/gradient/conical/centerPointX` | Float (0.0-1.0)     | 0.0     | Horizontal center position |
| `fill/gradient/conical/centerPointY` | Float (0.0-1.0)     | 0.0     | Vertical center position   |

**Note**: Conical gradients rotate clockwise starting from the top (12 o'clock). There is no rotation or angle property.

### GradientColorStop Interface

```typescript
interface GradientColorStop {
  color: Color; // RGB, CMYK, or Spot color
  stop: number; // Position (0.0 to 1.0)
}

// Color formats supported:
type Color =
  | { r: number; g: number; b: number; a: number } // RGB
  | { c: number; m: number; y: number; k: number; tint: number } // CMYK
  | { name: string; tint: number; externalReference: string }; // Spot
```

## Next Steps

Now that you understand gradient fills, explore other fill types and color management features:

- Learn about Color Fills for solid colors
- Explore Image Fills for photo content
- Understand Fill Overview for the comprehensive fill system
- Review Apply Colors for color management across properties
- Study Blocks Concept for understanding the block system



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support