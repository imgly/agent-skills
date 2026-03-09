> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Transform](./edit-image/transform.md) > [Rotate](./edit-image/transform/rotate.md)

---

Rotate images to adjust orientation, correct crooked photos, or create creative effects using CE.SDK's rotation APIs.

![Rotate images example showing images at different rotation angles](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-transform-rotate-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-transform-rotate-browser)
>
> - [Live demo](https://img.ly/examples/guides-edit-image-transform-rotate-browser/)

Rotation uses radians where `Math.PI / 2` equals 90°, `Math.PI` equals 180°, and negative values rotate clockwise. Values are relative to the block's center point.

```typescript file=@cesdk_web_examples/guides-edit-image-transform-rotate-browser/browser.ts reference-only
import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
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

class Example implements EditorPlugin {
  name = 'guides-edit-image-transform-rotate-browser';

  version = CreativeEditorSDK.version;

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
      page: { width: 800, height: 500, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Demo 1: Original image (no rotation)
    const originalImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, originalImage);
    engine.block.setPositionX(originalImage, 50);
    engine.block.setPositionY(originalImage, 50);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Original');
    engine.block.setFloat(text1, 'text/fontSize', 24);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 150);
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 210);
    engine.block.appendChild(page, text1);

    // Demo 2: Rotate 45 degrees
    const rotated45Image = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, rotated45Image);
    engine.block.setPositionX(rotated45Image, 225);
    engine.block.setPositionY(rotated45Image, 50);

    // Rotate the block by 45 degrees (π/4 radians)
    engine.block.setRotation(rotated45Image, Math.PI / 4);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', '45°');
    engine.block.setFloat(text2, 'text/fontSize', 24);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 150);
    engine.block.setPositionX(text2, 225);
    engine.block.setPositionY(text2, 210);
    engine.block.appendChild(page, text2);

    // Demo 3: Rotate 90 degrees
    const rotated90Image = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, rotated90Image);
    engine.block.setPositionX(rotated90Image, 400);
    engine.block.setPositionY(rotated90Image, 50);

    // Rotate the block by 90 degrees (π/2 radians)
    engine.block.setRotation(rotated90Image, Math.PI / 2);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', '90°');
    engine.block.setFloat(text3, 'text/fontSize', 24);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 150);
    engine.block.setPositionX(text3, 400);
    engine.block.setPositionY(text3, 210);
    engine.block.appendChild(page, text3);

    // Demo 4: Rotate 180 degrees
    const rotated180Image = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, rotated180Image);
    engine.block.setPositionX(rotated180Image, 575);
    engine.block.setPositionY(rotated180Image, 50);

    // Rotate the block by 180 degrees (π radians)
    engine.block.setRotation(rotated180Image, Math.PI);

    const text4 = engine.block.create('text');
    engine.block.setString(text4, 'text/text', '180°');
    engine.block.setFloat(text4, 'text/fontSize', 24);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text4, 150);
    engine.block.setPositionX(text4, 575);
    engine.block.setPositionY(text4, 210);
    engine.block.appendChild(page, text4);

    // Demo 5: Grouped rotation
    const groupedImage1 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 100, height: 100 }
      }
    );
    engine.block.appendChild(page, groupedImage1);
    engine.block.setPositionX(groupedImage1, 150);
    engine.block.setPositionY(groupedImage1, 300);

    const groupedImage2 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 100, height: 100 }
      }
    );
    engine.block.appendChild(page, groupedImage2);
    engine.block.setPositionX(groupedImage2, 260);
    engine.block.setPositionY(groupedImage2, 300);

    // Group blocks and rotate them together
    const groupId = engine.block.group([groupedImage1, groupedImage2]);
    engine.block.setRotation(groupId, Math.PI / 8);

    const text5 = engine.block.create('text');
    engine.block.setString(text5, 'text/text', 'Grouped');
    engine.block.setFloat(text5, 'text/fontSize', 24);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text5, 200);
    engine.block.setPositionX(text5, 150);
    engine.block.setPositionY(text5, 440);
    engine.block.appendChild(page, text5);

    // Demo 6: Locked rotation
    const lockedImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, lockedImage);
    engine.block.setPositionX(lockedImage, 500);
    engine.block.setPositionY(lockedImage, 300);
    engine.block.setRotation(lockedImage, Math.PI / 6);

    // Lock rotation for a single block
    engine.block.setScopeEnabled(lockedImage, 'layer/rotate', false);

    const text6 = engine.block.create('text');
    engine.block.setString(text6, 'text/text', 'Locked');
    engine.block.setFloat(text6, 'text/fontSize', 24);
    engine.block.setEnum(text6, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text6, 150);
    engine.block.setPositionX(text6, 500);
    engine.block.setPositionY(text6, 460);
    engine.block.appendChild(page, text6);

    // Get current rotation value
    const currentRotation = engine.block.getRotation(rotated45Image);
    console.log('Current rotation (radians):', currentRotation);
    console.log(
      'Current rotation (degrees):',
      (currentRotation * 180) / Math.PI
    );

    // Helpers for degree/radian conversion
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const toDegrees = (radians: number) => (radians * 180) / Math.PI;

    // Example: rotate by 30 degrees using helper
    const targetRadians = toRadians(30);
    console.log('30 degrees in radians:', targetRadians);
    console.log('Converted back to degrees:', toDegrees(targetRadians));
  }
}

export default Example;
```

This guide covers rotating images by specific angles, reading rotation values, converting between degrees and radians, rotating grouped elements together, and locking rotation on blocks.

## Initialize the Editor

Set up the editor with default assets and create a design scene:

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
      page: { width: 800, height: 500, unit: 'Pixel' }
    });
```

## Rotate an Image

Rotate blocks using `engine.block.setRotation()` with angle values in radians. Use `Math.PI` for 180° or divide for smaller increments:

```typescript highlight=highlight-rotate-45
// Rotate the block by 45 degrees (π/4 radians)
engine.block.setRotation(rotated45Image, Math.PI / 4);
```

## Rotate by 90 Degrees

Rotate a block by 90 degrees using `Math.PI / 2`:

```typescript highlight=highlight-rotate-90
// Rotate the block by 90 degrees (π/2 radians)
engine.block.setRotation(rotated90Image, Math.PI / 2);
```

## Rotate by 180 Degrees

Flip a block upside down by rotating 180 degrees using `Math.PI`:

```typescript highlight=highlight-rotate-180
// Rotate the block by 180 degrees (π radians)
engine.block.setRotation(rotated180Image, Math.PI);
```

## Get Current Rotation

Read the current rotation value using `engine.block.getRotation()`. The returned value is in radians:

```typescript highlight=highlight-get-rotation
// Get current rotation value
const currentRotation = engine.block.getRotation(rotated45Image);
console.log('Current rotation (radians):', currentRotation);
console.log(
  'Current rotation (degrees):',
  (currentRotation * 180) / Math.PI
);
```

## Convert Between Degrees and Radians

Create helper functions to convert between degrees and radians for more intuitive angle values:

```typescript highlight=highlight-convert-radians
    // Helpers for degree/radian conversion
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const toDegrees = (radians: number) => (radians * 180) / Math.PI;

    // Example: rotate by 30 degrees using helper
    const targetRadians = toRadians(30);
    console.log('30 degrees in radians:', targetRadians);
    console.log('Converted back to degrees:', toDegrees(targetRadians));
```

## Rotate Groups Together

Group multiple blocks and rotate them as a unit to maintain their relative positions:

```typescript highlight=highlight-rotate-group
// Group blocks and rotate them together
const groupId = engine.block.group([groupedImage1, groupedImage2]);
engine.block.setRotation(groupId, Math.PI / 8);
```

## Lock Rotation

Disable rotation for a specific block using `engine.block.setScopeEnabled()` with the `layer/rotate` scope:

```typescript highlight=highlight-lock-rotation
// Lock rotation for a single block
engine.block.setScopeEnabled(lockedImage, 'layer/rotate', false);
```

## Troubleshooting

### Rotation Has No Effect

Ensure the block exists and is appended to a page before calling `setRotation()`. Verify the block ID is valid using `engine.block.isValid()`.

### Unexpected Rotation Direction

Positive values rotate counterclockwise, negative values rotate clockwise. Double-check your angle calculation if the rotation appears inverted.

### Block Appears Skewed After Rotation

Rotation uses the block's center as the pivot point. If the block appears off-center, check that no unexpected scaling or positioning was applied.

### Locked Block Won't Rotate

Check if the block's `layer/rotate` scope is disabled using `engine.block.isScopeEnabled()`. Re-enable with `engine.block.setScopeEnabled(block, 'layer/rotate', true)`.

## API Reference

| Method                             | Description                                |
| ---------------------------------- | ------------------------------------------ |
| `engine.block.setRotation()`       | Set rotation angle in radians              |
| `engine.block.getRotation()`       | Get current rotation angle in radians      |
| `engine.block.group()`             | Group blocks for collective transforms     |
| `engine.block.setScopeEnabled()`   | Enable or disable specific block scopes    |
| `engine.block.isScopeEnabled()`    | Check if a scope is enabled for a block    |



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support