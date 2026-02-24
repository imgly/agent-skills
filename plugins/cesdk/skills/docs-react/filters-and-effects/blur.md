> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Filters and Effects](./filters-and-effects.md) > [Apply Blur](./filters-and-effects/blur.md)

---

Apply blur effects to design elements using CE.SDK's dedicated blur system for creating depth, focus, and atmospheric effects.

![Blur Effects example showing an image with radial blur applied](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-filters-and-effects-blur-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-filters-and-effects-blur-browser)
>
> - [Live demo](https://img.ly/examples/guides-filters-and-effects-blur-browser/)

Unlike general effects that stack on elements, blur is a dedicated feature with its own API methods. Each block supports exactly one blur at a time, though the same blur instance can be shared across multiple blocks. CE.SDK provides four blur types: **uniform** for consistent softening, **linear** and **mirrored** for gradient-based effects along axes, and **radial** for circular focal points.

```typescript file=@cesdk_web_examples/guides-filters-and-effects-blur-browser/browser.ts reference-only
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

class BlurPlugin implements EditorPlugin {
  name = 'BlurPlugin';

  version = '1.0.0';

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

    await cesdk.actions.run('scene.create', { page: { sourceId: 'ly.img.page.presets', assetId: 'ly.img.page.presets.print.iso.a6.landscape' } });

    const page = engine.block.findByType('page')[0];

    // Get page dimensions to position content correctly
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    if (!engine.block.supportsBlur(page)) {
      console.log('Block does not support blur');
      return;
    }

    // Create an image block
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );

    // Position image to fill the page
    engine.block.setWidth(imageBlock, pageWidth);
    engine.block.setHeight(imageBlock, pageHeight);
    engine.block.setPositionX(imageBlock, 0);
    engine.block.setPositionY(imageBlock, 0);

    engine.block.appendChild(page, imageBlock);

    const blur = engine.block.createBlur('//ly.img.ubq/blur/radial');

    engine.block.setFloat(blur, 'blur/radial/blurRadius', 40);
    engine.block.setFloat(blur, 'blur/radial/radius', 100);
    engine.block.setFloat(blur, 'blur/radial/gradientRadius', 80);
    engine.block.setFloat(blur, 'blur/radial/x', 0.5);
    engine.block.setFloat(blur, 'blur/radial/y', 0.5);

    engine.block.setBlur(imageBlock, blur);
    engine.block.setBlurEnabled(imageBlock, true);

    const appliedBlur = engine.block.getBlur(imageBlock);
    const isEnabled = engine.block.isBlurEnabled(imageBlock);
    const blurType = engine.block.getType(appliedBlur);
    console.log('Blur type:', blurType, 'Enabled:', isEnabled);

    engine.block.setBlurEnabled(imageBlock, false);
    const nowEnabled = engine.block.isBlurEnabled(imageBlock);
    console.log('Blur now enabled:', nowEnabled);
    engine.block.setBlurEnabled(imageBlock, true);
  }
}

export default BlurPlugin;
```

This guide covers how to apply blur effects programmatically using the block API.

## Programmatic Blur Application

### Check Blur Support

Before applying blur to a block, verify it supports blur effects. Graphic blocks with shapes and pages support blur.

```typescript highlight-check-blur-support
if (!engine.block.supportsBlur(page)) {
  console.log('Block does not support blur');
  return;
}
```

Always check support before creating and applying blur to avoid errors.

### Create and Apply Blur

Create a blur instance using `createBlur()` with a blur type, then attach it to a block using `setBlur()`. Enable the blur with `setBlurEnabled()`.

```typescript highlight-create-blur
const blur = engine.block.createBlur('//ly.img.ubq/blur/radial');
```

CE.SDK provides four blur types:

- **`//ly.img.ubq/blur/uniform`** - Even softening across the entire element
- **`//ly.img.ubq/blur/linear`** - Gradient blur along a line defined by two control points
- **`//ly.img.ubq/blur/mirrored`** - Band of focus with blur on both sides (tilt-shift style)
- **`//ly.img.ubq/blur/radial`** - Circular blur pattern from a center point

> **Note:** Omitting the prefix is also accepted, e.g., `'radial'` instead of `'//ly.img.ubq/blur/radial'`.

### Configure Blur Parameters

Each blur type has specific parameters to control its appearance. Configure them using `setFloat()`.

```typescript highlight-configure-blur
engine.block.setFloat(blur, 'blur/radial/blurRadius', 40);
engine.block.setFloat(blur, 'blur/radial/radius', 100);
engine.block.setFloat(blur, 'blur/radial/gradientRadius', 80);
engine.block.setFloat(blur, 'blur/radial/x', 0.5);
engine.block.setFloat(blur, 'blur/radial/y', 0.5);
```

**Radial blur parameters:**

- `blur/radial/blurRadius` - Blur intensity (default: 30)
- `blur/radial/radius` - Size of the non-blurred center area (default: 75)
- `blur/radial/gradientRadius` - Size of the blur transition zone (default: 50)
- `blur/radial/x` - Center point x-value, 0.0 to 1.0 (default: 0.5)
- `blur/radial/y` - Center point y-value, 0.0 to 1.0 (default: 0.5)

**Uniform blur parameters:**

- `blur/uniform/intensity` - Blur strength, 0.0 to 1.0 (default: 0.5)

**Linear blur parameters:**

- `blur/linear/blurRadius` - Blur intensity (default: 30)
- `blur/linear/x1`, `blur/linear/y1` - Control point 1 (default: 0, 0.5)
- `blur/linear/x2`, `blur/linear/y2` - Control point 2 (default: 1, 0.5)

**Mirrored blur parameters:**

- `blur/mirrored/blurRadius` - Blur intensity (default: 30)
- `blur/mirrored/gradientSize` - Hardness of gradient transition (default: 50)
- `blur/mirrored/size` - Size of the blurred area (default: 75)
- `blur/mirrored/x1`, `blur/mirrored/y1` - Control point 1 (default: 0, 0.5)
- `blur/mirrored/x2`, `blur/mirrored/y2` - Control point 2 (default: 1, 0.5)

### Apply Blur to Block

After configuring the blur, apply it to the target block and enable it.

```typescript highlight-apply-blur
engine.block.setBlur(imageBlock, blur);
engine.block.setBlurEnabled(imageBlock, true);
```

The blur takes effect immediately once enabled. You can modify parameters at any time and changes apply in real-time.

## Managing Blur

### Access Existing Blur

Retrieve the blur applied to a block using `getBlur()`. You can then read or modify its properties.

```typescript highlight-read-blur
const appliedBlur = engine.block.getBlur(imageBlock);
const isEnabled = engine.block.isBlurEnabled(imageBlock);
const blurType = engine.block.getType(appliedBlur);
console.log('Blur type:', blurType, 'Enabled:', isEnabled);
```

### Enable/Disable Blur

Toggle blur on and off without removing it using `setBlurEnabled()`. This preserves all blur parameters for quick before/after comparisons.

```typescript highlight-toggle-blur
engine.block.setBlurEnabled(imageBlock, false);
const nowEnabled = engine.block.isBlurEnabled(imageBlock);
console.log('Blur now enabled:', nowEnabled);
engine.block.setBlurEnabled(imageBlock, true);
```

When disabled, the blur remains attached to the block but doesn't render until re-enabled.

### Share Blur Across Blocks

A single blur instance can be applied to multiple blocks. Create the blur once, then assign it to each block with `setBlur()`.

```typescript
const sharedBlur = engine.block.createBlur('//ly.img.ubq/blur/uniform');
engine.block.setFloat(sharedBlur, 'blur/uniform/intensity', 0.4);

engine.block.setBlur(block1, sharedBlur);
engine.block.setBlur(block2, sharedBlur);
engine.block.setBlurEnabled(block1, true);
engine.block.setBlurEnabled(block2, true);
```

Changes to the shared blur affect all blocks using it.

### Replace Blur

To change the blur type on a block, create a new blur and assign it with `setBlur()`. The previous blur association is automatically removed.

```typescript
const newBlur = engine.block.createBlur('//ly.img.ubq/blur/linear');
engine.block.setBlur(block, newBlur);
engine.block.setBlurEnabled(block, true);
```

If the old blur isn't used elsewhere, destroy it with `engine.block.destroy(oldBlur)`.

## Troubleshooting

### Blur Not Visible

If blur doesn't appear after applying:

- Check the block supports blur with `supportsBlur()`
- Verify blur is enabled with `isBlurEnabled()`
- Ensure the blur instance is valid

### Blur Appears on Wrong Area

For radial, linear, and mirrored blurs:

- Verify control point coordinates are within 0.0 to 1.0 range
- Check that x/y values match your intended focus area

### Blur Too Subtle or Too Strong

- Increase or decrease `blurRadius` or `intensity` values
- For radial blur, adjust `gradientRadius` to control the transition softness

## API Reference

| Method                             | Description                        |
| ---------------------------------- | ---------------------------------- |
| `block.createBlur(type)`           | Create new blur instance           |
| `block.supportsBlur(block)`        | Check if block supports blur       |
| `block.setBlur(block, blur)`       | Apply blur to block                |
| `block.getBlur(block)`             | Get blur from block                |
| `block.setBlurEnabled(block, enabled)` | Enable or disable blur         |
| `block.isBlurEnabled(block)`       | Check if blur is enabled           |
| `block.setFloat(blur, property, value)` | Set blur float property       |
| `block.getFloat(blur, property)`   | Get blur float property            |
| `block.getType(blur)`              | Get blur type identifier           |
| `block.destroy(blur)`              | Destroy unused blur instance       |



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support