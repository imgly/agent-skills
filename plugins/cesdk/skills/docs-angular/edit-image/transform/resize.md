> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Transform](./edit-image/transform.md) > [Resize](./edit-image/transform/resize.md)

---

Change image dimensions using absolute pixel values, percentage-based sizing for responsive layouts, or auto-sizing based on content.

![Resize images example showing different sizing modes](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-transform-resize-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-transform-resize-browser)
>
> - [Live demo](https://img.ly/examples/guides-edit-image-transform-resize-browser/)

Image resizing changes actual dimensions rather than applying scale multipliers. Use `engine.block.setWidth()` and `engine.block.setHeight()` for individual dimensions, or `engine.block.setSize()` for both at once.

```typescript file=@cesdk_web_examples/guides-edit-image-transform-resize-browser/browser.ts reference-only
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
  name = 'guides-edit-image-transform-resize-browser';

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

    // Demo 1: Absolute Sizing - Fixed dimensions
    const absoluteImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 180, height: 180 }
      }
    );
    engine.block.appendChild(page, absoluteImage);
    engine.block.setPositionX(absoluteImage, 20);
    engine.block.setPositionY(absoluteImage, 80);

    // Set explicit dimensions using setSize
    engine.block.setSize(absoluteImage, 180, 180, {
      sizeMode: 'Absolute'
    });

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Absolute');
    engine.block.setFloat(text1, 'text/fontSize', 28);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 180);
    engine.block.setPositionX(text1, 20);
    engine.block.setPositionY(text1, 280);
    engine.block.appendChild(page, text1);

    // Demo 2: Percentage Sizing - Responsive layout
    const percentImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 180, height: 180 }
      }
    );
    engine.block.appendChild(page, percentImage);
    engine.block.setPositionX(percentImage, 220);
    engine.block.setPositionY(percentImage, 80);

    // Set size mode to percentage for responsive sizing
    engine.block.setWidthMode(percentImage, 'Percent');
    engine.block.setHeightMode(percentImage, 'Percent');
    // Values 0.0 to 1.0 represent percentage of parent
    engine.block.setWidth(percentImage, 0.225);
    engine.block.setHeight(percentImage, 0.36);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 28);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 180);
    engine.block.setPositionX(text2, 220);
    engine.block.setPositionY(text2, 280);
    engine.block.appendChild(page, text2);

    // Demo 3: Resized with maintainCrop
    const cropImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 180, height: 180 }
      }
    );
    engine.block.appendChild(page, cropImage);
    engine.block.setPositionX(cropImage, 420);
    engine.block.setPositionY(cropImage, 80);

    // Resize while preserving crop settings
    engine.block.setWidth(cropImage, 180, true);
    engine.block.setHeight(cropImage, 180, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Maintain Crop');
    engine.block.setFloat(text3, 'text/fontSize', 28);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 180);
    engine.block.setPositionX(text3, 420);
    engine.block.setPositionY(text3, 280);
    engine.block.appendChild(page, text3);

    // Get current dimensions
    const currentWidth = engine.block.getWidth(absoluteImage);
    const currentHeight = engine.block.getHeight(absoluteImage);
    const widthMode = engine.block.getWidthMode(absoluteImage);
    const heightMode = engine.block.getHeightMode(absoluteImage);
    console.log('Current dimensions:', currentWidth, 'x', currentHeight);
    console.log('Size modes:', widthMode, heightMode);

    // Get calculated frame dimensions after layout
    const frameWidth = engine.block.getFrameWidth(absoluteImage);
    const frameHeight = engine.block.getFrameHeight(absoluteImage);
    console.log('Frame dimensions:', frameWidth, 'x', frameHeight);

    // Title text at top
    const titleText = engine.block.create('text');
    engine.block.setString(titleText, 'text/text', 'Image Resize Examples');
    engine.block.setFloat(titleText, 'text/fontSize', 36);
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleText, 800);
    engine.block.setPositionX(titleText, 0);
    engine.block.setPositionY(titleText, 20);
    engine.block.appendChild(page, titleText);
  }
}

export default Example;
```

This guide covers resizing images with absolute or percentage sizing, configuring size modes, and maintaining crop settings during resize.

## Understanding Size Modes

Size values are interpreted in three modes. 'Absolute' uses fixed design units, 'Percent' uses parent-relative values (0.0-1.0), and 'Auto' sizes based on content. Use `engine.block.getWidth()` for the configured value and `engine.block.getFrameWidth()` for actual rendered size after layout.

## Setting Absolute Dimensions

Set explicit dimensions using `engine.block.setSize()` with absolute pixel values:

```typescript highlight-set-size
// Set explicit dimensions using setSize
engine.block.setSize(absoluteImage, 180, 180, {
  sizeMode: 'Absolute'
});
```

## Percentage Sizing

Use percentage mode for responsive sizing. Values range from 0.0 to 1.0 representing percentage of parent container:

```typescript highlight-percentage-mode
// Set size mode to percentage for responsive sizing
engine.block.setWidthMode(percentImage, 'Percent');
engine.block.setHeightMode(percentImage, 'Percent');
// Values 0.0 to 1.0 represent percentage of parent
engine.block.setWidth(percentImage, 0.225);
engine.block.setHeight(percentImage, 0.36);
```

Percentage sizing adapts automatically when the parent block dimensions change, maintaining relative sizes in responsive designs.

## Maintaining Crop During Resize

Use the `maintainCrop` parameter to preserve existing crop settings when resizing:

```typescript highlight-maintain-crop
// Resize while preserving crop settings
engine.block.setWidth(cropImage, 180, true);
engine.block.setHeight(cropImage, 180, true);
```

Setting `maintainCrop` to `true` automatically adjusts crop values to preserve the visible area.

## Getting Current Dimensions

Read current configured dimensions and size modes:

```typescript highlight-get-dimensions
// Get current dimensions
const currentWidth = engine.block.getWidth(absoluteImage);
const currentHeight = engine.block.getHeight(absoluteImage);
const widthMode = engine.block.getWidthMode(absoluteImage);
const heightMode = engine.block.getHeightMode(absoluteImage);
```

## Getting Frame Dimensions

Get calculated frame dimensions after layout:

```typescript highlight-frame-dimensions
// Get calculated frame dimensions after layout
const frameWidth = engine.block.getFrameWidth(absoluteImage);
const frameHeight = engine.block.getFrameHeight(absoluteImage);
```

The difference between configured values and frame dimensions matters when using percentage or auto sizing modes.

## Troubleshooting

### Image Not Resizing

Check if locked using `engine.block.getBool(block, 'constraints/size/locked')`. Verify size constraints aren't limiting changes. Ensure the block exists and confirm correct units for the size mode.

### Unexpected Size Values

Check mode using `engine.block.getWidthMode()` and `engine.block.getHeightMode()`. Verify absolute (design units) vs percentage (0.0-1.0) values. For percentage mode, review parent block dimensions.

### Image Appears Stretched

Calculate and set both dimensions proportionally. Use `maintainCrop: true` when resizing cropped images. Check `scene/aspectRatioLock` for scenes.

## API Reference

| Method                              | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `engine.block.addImage()`           | Create and size image in one operation   |
| `engine.block.setSize()`            | Set width and height with optional mode  |
| `engine.block.setWidth()`           | Set width value                          |
| `engine.block.setHeight()`          | Set height value                         |
| `engine.block.getWidth()`           | Get current width value                  |
| `engine.block.getHeight()`          | Get current height value                 |
| `engine.block.setWidthMode()`       | Set width interpretation mode            |
| `engine.block.setHeightMode()`      | Set height interpretation mode           |
| `engine.block.getWidthMode()`       | Get width interpretation mode            |
| `engine.block.getHeightMode()`      | Get height interpretation mode           |
| `engine.block.getFrameWidth()`      | Get calculated frame width               |
| `engine.block.getFrameHeight()`     | Get calculated frame height              |



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support