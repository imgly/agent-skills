> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Filters and Effects](./filters-and-effects.md) > [Apply Custom LUT Filter](./filters-and-effects/create-custom-lut-filter.md)

---

Apply custom LUT (Look-Up Table) filters to achieve brand-consistent color grading directly through CE.SDK's effect API.

![Create Custom LUT Filter example showing an image with a custom LUT color grade applied](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-filters-and-effects-create-custom-lut-filter-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-filters-and-effects-create-custom-lut-filter-browser)
>
> - [Live demo](https://img.ly/examples/guides-filters-and-effects-create-custom-lut-filter-browser/)

LUT filters remap colors through a predefined transformation table, enabling cinematic color grading and consistent brand aesthetics. This guide shows how to apply your own LUT files directly to design elements using the effect API. For organizing collections of filters through asset sources, see [Create Custom Filters](./filters-and-effects/create-custom-filters.md).

```typescript file=@cesdk_web_examples/guides-filters-and-effects-create-custom-lut-filter-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Create Custom LUT Filter Guide
 *
 * Demonstrates applying custom LUT filters directly using the effect API:
 * - Creating a lut_filter effect
 * - Configuring the LUT file URI and tile dimensions
 * - Setting filter intensity
 * - Toggling the effect on and off
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load default assets
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const pageWidth = 800;
    const pageHeight = 600;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Create a gradient background for the page
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.15, g: 0.1, b: 0.25, a: 1 }, stop: 0 },
      { color: { r: 0.3, g: 0.15, b: 0.4, a: 1 }, stop: 0.5 },
      { color: { r: 0.2, g: 0.1, b: 0.35, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create a centered title text
    const titleText = engine.block.create('text');
    engine.block.setString(titleText, 'text/text', 'Custom LUT Filter');
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setTextFontSize(titleText, 96);
    engine.block.setTextColor(titleText, { r: 1, g: 1, b: 1, a: 1 });
    engine.block.setWidthMode(titleText, 'Auto');
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.appendChild(page, titleText);

    // Create a subtext below the title
    const subText = engine.block.create('text');
    engine.block.setString(subText, 'text/text', 'img.ly');
    engine.block.setEnum(subText, 'text/horizontalAlignment', 'Center');
    engine.block.setTextFontSize(subText, 64);
    engine.block.setTextColor(subText, { r: 0.8, g: 0.8, b: 0.8, a: 1 });
    engine.block.setWidthMode(subText, 'Auto');
    engine.block.setHeightMode(subText, 'Auto');
    engine.block.appendChild(page, subText);

    // Get text dimensions for centering calculations
    const titleWidth = engine.block.getFrameWidth(titleText);
    const titleHeight = engine.block.getFrameHeight(titleText);
    const subTextWidth = engine.block.getFrameWidth(subText);
    const subTextHeight = engine.block.getFrameHeight(subText);

    // Image dimensions (smaller)
    const imageWidth = 200;
    const imageHeight = 150;

    // Calculate total content height and vertical centering
    const textGap = 8;
    const imagePadding = 60;
    const totalContentHeight =
      titleHeight + textGap + subTextHeight + imagePadding + imageHeight;
    const startY = (pageHeight - totalContentHeight) / 2;

    // Position title centered
    engine.block.setPositionX(titleText, (pageWidth - titleWidth) / 2);
    engine.block.setPositionY(titleText, startY);

    // Position subtext below title
    engine.block.setPositionX(subText, (pageWidth - subTextWidth) / 2);
    engine.block.setPositionY(subText, startY + titleHeight + textGap);

    // Add an image block to apply the LUT filter
    const imageY = startY + titleHeight + textGap + subTextHeight + imagePadding;
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      x: (pageWidth - imageWidth) / 2,
      y: imageY,
      size: { width: imageWidth, height: imageHeight }
    });
    engine.block.appendChild(page, imageBlock);

    // Create a LUT filter effect
    const lutEffect = engine.block.createEffect('//ly.img.ubq/effect/lut_filter');

    // Configure the LUT file URI - this is a tiled PNG containing the color lookup table
    const lutUrl =
      'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png';
    engine.block.setString(lutEffect, 'effect/lut_filter/lutFileURI', lutUrl);

    // Set the tile grid dimensions - must match the LUT image structure
    engine.block.setInt(lutEffect, 'effect/lut_filter/horizontalTileCount', 5);
    engine.block.setInt(lutEffect, 'effect/lut_filter/verticalTileCount', 5);

    // Set filter intensity (0.0 = no effect, 1.0 = full effect)
    engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.8);

    // Apply the effect to the image block
    engine.block.appendEffect(imageBlock, lutEffect);

    // Register a custom button component to toggle the LUT filter
    cesdk.ui.registerComponent('lut.toggle', ({ builder }) => {
      const isEnabled = engine.block.isEffectEnabled(lutEffect);
      builder.Button('toggle-lut', {
        label: 'LUT Filter',
        icon: isEnabled ? '@imgly/ToggleIconOn' : '@imgly/ToggleIconOff',
        isActive: isEnabled,
        onClick: () => {
          engine.block.setEffectEnabled(lutEffect, !isEnabled);
        }
      });
    });

    // Add the toggle button to the navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'lut.toggle');

    // Retrieve all effects on the block
    const effects = engine.block.getEffects(imageBlock);
    // eslint-disable-next-line no-console
    console.log('Number of effects:', effects.length); // 1

    // Check if block supports effects
    const supportsEffects = engine.block.supportsEffects(imageBlock);
    // eslint-disable-next-line no-console
    console.log('Supports effects:', supportsEffects); // true

    // Select the image to show it in the editor
    engine.block.select(imageBlock);

    // eslint-disable-next-line no-console
    console.log('Custom LUT filter applied successfully.');
  }
}

export default Example;
```

## Understanding LUT Image Format

CE.SDK uses a tiled PNG format where a 3D color cube is laid out as a 2D grid. Each tile represents a slice of the color cube along the blue axis.

The LUT image requires two configuration values:

- **`horizontalTileCount`** - Number of tiles across the image width
- **`verticalTileCount`** - Number of tiles down the image height

CE.SDK supports these tile configurations:

- 5×5 tiles with 128px cube size
- 8×8 tiles with 512px cube size

Standard `.cube` files must be converted to this tiled PNG format using image processing tools.

## Creating LUT PNG Images

### Obtaining LUT Files

LUT files are available from multiple sources:

- **Color grading software** - Adobe Photoshop, DaVinci Resolve, and Affinity Photo can export 3D LUT files in `.cube` format
- **Online LUT libraries** - Many free and commercial LUT packs are available for download
- **LUT generators** - Tools that create custom color transformations from reference images

### Converting .cube to Tiled PNG

CE.SDK requires LUTs in a specific tiled PNG format where each tile represents a slice of the 3D color cube along the blue axis. To convert a standard `.cube` file:

1. **Parse the .cube file** - Read the 3D color lookup table data
2. **Arrange slices as tiles** - Each blue channel value becomes a separate tile containing the red-green color plane
3. **Export as PNG** - Save the grid as a PNG image

CE.SDK's built-in LUTs follow a naming convention: `imgly_lut_{name}_{h}_{v}_{cubeSize}.png` where `h` and `v` are tile counts and `cubeSize` indicates the LUT precision.

### Using Python for Conversion

You can write a Python script using PIL/Pillow and NumPy to convert `.cube` files:

```python
# Pseudocode for .cube to tiled PNG conversion
# 1. Parse the .cube file to extract the 3D LUT data
# 2. Reshape data into (blue_slices, height, width, 3) array
# 3. Arrange slices in a grid matching tile configuration
# 4. Save as PNG with Image.fromarray()
```

### Using CE.SDK's Built-in LUTs

The simplest approach is to use CE.SDK's existing LUT assets as a starting point. The built-in filters use pre-generated tiled PNGs that you can reference for format verification. Check the filter extension at `ly.img.cesdk.filters.lut` for examples of properly formatted LUT images.

## Hosting LUT Files

LUT images must be served from an accessible URL. For production deployments, use HTTPS and enable CORS headers for cross-origin requests in browser environments.

## Creating the LUT Effect

Create a `lut_filter` effect instance using the effect API:

```typescript highlight-create-effect
// Create a LUT filter effect
const lutEffect = engine.block.createEffect('//ly.img.ubq/effect/lut_filter');
```

This creates an effect that can be configured and applied to image blocks.

## Configuring LUT Properties

Set the LUT file URL and tile dimensions to match your LUT image:

```typescript highlight-configure-lut
    // Configure the LUT file URI - this is a tiled PNG containing the color lookup table
    const lutUrl =
      'https://cdn.img.ly/assets/v4/ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png';
    engine.block.setString(lutEffect, 'effect/lut_filter/lutFileURI', lutUrl);

    // Set the tile grid dimensions - must match the LUT image structure
    engine.block.setInt(lutEffect, 'effect/lut_filter/horizontalTileCount', 5);
    engine.block.setInt(lutEffect, 'effect/lut_filter/verticalTileCount', 5);
```

The tile counts must match the actual LUT image grid structure. Using incorrect values produces distorted colors.

## Setting Filter Intensity

Control the strength of the color transformation with intensity:

```typescript highlight-set-intensity
// Set filter intensity (0.0 = no effect, 1.0 = full effect)
engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.8);
```

Values range from 0.0 (no effect) to 1.0 (full effect). Use intermediate values for subtle color grading.

## Applying the Effect

Attach the configured effect to an image block:

```typescript highlight-apply-effect
// Apply the effect to the image block
engine.block.appendEffect(imageBlock, lutEffect);
```

The effect renders immediately after being applied.

## Toggling the Effect

Add a toggle button to the navigation bar for enabling and disabling the filter:

```typescript highlight-toggle-effect
    // Register a custom button component to toggle the LUT filter
    cesdk.ui.registerComponent('lut.toggle', ({ builder }) => {
      const isEnabled = engine.block.isEffectEnabled(lutEffect);
      builder.Button('toggle-lut', {
        label: 'LUT Filter',
        icon: isEnabled ? '@imgly/ToggleIconOn' : '@imgly/ToggleIconOff',
        isActive: isEnabled,
        onClick: () => {
          engine.block.setEffectEnabled(lutEffect, !isEnabled);
        }
      });
    });

    // Add the toggle button to the navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'lut.toggle');
```

The `registerComponent` function creates a custom UI component that tracks the effect's enabled state. The `insertOrderComponent` method adds it to the navigation bar. Clicking the button toggles the effect while preserving all settings.

## Managing Effects

Retrieve and inspect effects applied to a block:

```typescript highlight-manage-effects
    // Retrieve all effects on the block
    const effects = engine.block.getEffects(imageBlock);
    // eslint-disable-next-line no-console
    console.log('Number of effects:', effects.length); // 1

    // Check if block supports effects
    const supportsEffects = engine.block.supportsEffects(imageBlock);
    // eslint-disable-next-line no-console
    console.log('Supports effects:', supportsEffects); // true
```

Use `getEffects()` to access all effects on a block and `supportsEffects()` to verify compatibility before applying.

## Troubleshooting

### LUT Not Rendering

- Verify the LUT image URL is accessible and CORS-enabled
- Confirm the image uses PNG format
- Check that tile count values match the actual image grid

### Colors Look Wrong

- Verify tile counts match the LUT image structure
- Ensure the LUT was generated with sRGB color space

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.createEffect('//ly.img.ubq/effect/lut_filter')` | Create a LUT filter effect instance |
| `engine.block.setString(effect, 'effect/lut_filter/lutFileURI', uri)` | Set the LUT image URL |
| `engine.block.setInt(effect, 'effect/lut_filter/horizontalTileCount', count)` | Set horizontal tile count |
| `engine.block.setInt(effect, 'effect/lut_filter/verticalTileCount', count)` | Set vertical tile count |
| `engine.block.setFloat(effect, 'effect/lut_filter/intensity', value)` | Set filter intensity (0.0-1.0) |
| `engine.block.appendEffect(block, effect)` | Apply effect to a block |
| `engine.block.getEffects(block)` | Get all effects on a block |
| `engine.block.setEffectEnabled(effect, enabled)` | Enable or disable an effect |
| `engine.block.isEffectEnabled(effect)` | Check if effect is enabled |
| `engine.block.removeEffect(block, index)` | Remove effect at index |
| `engine.block.destroy(effect)` | Destroy an effect instance |
| `engine.block.supportsEffects(block)` | Check if block supports effects |
| `cesdk.ui.registerComponent(id, renderFn)` | Register a custom UI component |
| `cesdk.ui.insertOrderComponent(options, component)` | Add a component to the navigation bar |

## Next Steps

- [Create Custom Filters](./filters-and-effects/create-custom-filters.md) - Register custom LUT filters as asset sources
- [Apply Filters and Effects](./filters-and-effects/apply.md) - Learn more about the effects system
- [Duotone Effects](./filters-and-effects/duotone.md) - Create two-color artistic treatments



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support