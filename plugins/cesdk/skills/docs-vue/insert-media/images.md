> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Insert Media Assets](./insert-media.md) > [Insert Images](./insert-media/images.md)

---

Insert images into your designs programmatically using CE.SDK's engine API.

![Insert Images example showing multiple images placed on a canvas](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-insert-media-images-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-insert-media-images-browser)
>
> - [Live demo](https://img.ly/examples/guides-insert-media-images-browser/)

Images in CE.SDK are graphic blocks with image fills attached. The engine supports multiple image formats including PNG, JPEG, WebP, GIF, and SVG. You can insert images using either the convenience API for quick setup or manual construction for fine-grained control over the image block components.

```typescript file=@cesdk_web_examples/guides-insert-media-images-browser/browser.ts reference-only
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

/**
 * CE.SDK Plugin: Insert Images Guide
 *
 * Demonstrates inserting images into a scene programmatically:
 * - Using the convenience API (addImage)
 * - Manual construction with graphic blocks and image fills
 * - Configuring image sizing, positioning, and content fill mode
 * - Applying corner radius for rounded images
 * - Working with multiple images
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

    // Sample image URL for demonstrations
    const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Add an image using the convenience API
    // This automatically creates a graphic block with rect shape and image fill
    const imageBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 50,
      y: 50
    });
    engine.block.appendChild(page, imageBlock);
    console.log('✓ Added image using convenience API');

    // Manually construct an image block for more control
    const manualBlock = engine.block.create('graphic');

    // Create and attach a rectangular shape
    const shape = engine.block.createShape('rect');
    engine.block.setShape(manualBlock, shape);

    // Create and configure the image fill
    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', imageUrl);
    engine.block.setFill(manualBlock, fill);

    // Set dimensions and position
    engine.block.setWidth(manualBlock, 200);
    engine.block.setHeight(manualBlock, 150);
    engine.block.setPositionX(manualBlock, 300);
    engine.block.setPositionY(manualBlock, 50);
    engine.block.appendChild(page, manualBlock);
    console.log('✓ Added image using manual construction');

    // Set content fill mode to control how images scale within bounds
    // 'Contain' preserves aspect ratio and fits within bounds
    // 'Cover' preserves aspect ratio and fills bounds
    const containBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 550,
      y: 50
    });
    engine.block.appendChild(page, containBlock);

    if (engine.block.supportsContentFillMode(containBlock)) {
      engine.block.setContentFillMode(containBlock, 'Contain');
      console.log('✓ Applied Contain fill mode');
    }

    // Apply corner radius to create rounded corners on an image
    const roundedBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 50,
      y: 250,
      cornerRadius: 20
    });
    engine.block.appendChild(page, roundedBlock);
    console.log('✓ Added image with rounded corners');

    // Insert multiple images with calculated positioning
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      const block = await engine.block.addImage(imageUrls[i], {
        size: { width: 150, height: 100 },
        x: 300 + i * 160,
        y: 250
      });
      engine.block.appendChild(page, block);
    }
    console.log('✓ Added multiple images');

    // Select the first image block to show it in the inspector
    engine.block.setSelected(imageBlock, true);

    // Zoom to show all content
    cesdk.engine.scene.zoomToBlock(page, {
      padding: {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
      }
    });
  }
}

export default Example;
```

This guide covers how to add images using the convenience API, manually construct image blocks, configure content fill modes, apply corner radius, and work with multiple images.

## Initialize CE.SDK

We start by initializing CE.SDK and creating a scene with a page to hold our images.

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

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
```

## Using the Convenience API

The `addImage()` method provides a quick way to insert images. It automatically creates a graphic block with a rect shape and image fill. You can configure size, position, corner radius, and other properties through the options parameter.

```typescript highlight=highlight-convenience-api
// Add an image using the convenience API
// This automatically creates a graphic block with rect shape and image fill
const imageBlock = await engine.block.addImage(imageUrl, {
  size: { width: 200, height: 150 },
  x: 50,
  y: 50
});
engine.block.appendChild(page, imageBlock);
console.log('✓ Added image using convenience API');
```

## Manual Image Construction

For control over individual components, we can manually construct a graphic block with a rect shape and image fill. This approach lets you configure each component separately.

We create a graphic block with `create('graphic')`, attach a rectangular shape with `createShape('rect')`, and create an image fill with `createFill('image')`. The image source is set using `setString()` with the `fill/image/imageFileURI` property.

```typescript highlight=highlight-manual-construction
    // Manually construct an image block for more control
    const manualBlock = engine.block.create('graphic');

    // Create and attach a rectangular shape
    const shape = engine.block.createShape('rect');
    engine.block.setShape(manualBlock, shape);

    // Create and configure the image fill
    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', imageUrl);
    engine.block.setFill(manualBlock, fill);

    // Set dimensions and position
    engine.block.setWidth(manualBlock, 200);
    engine.block.setHeight(manualBlock, 150);
    engine.block.setPositionX(manualBlock, 300);
    engine.block.setPositionY(manualBlock, 50);
    engine.block.appendChild(page, manualBlock);
    console.log('✓ Added image using manual construction');
```

## Set Content Fill Mode

The content fill mode controls how images scale within their bounds. Use `setContentFillMode()` to choose between different scaling behaviors:

- **Contain**: Preserves aspect ratio and fits the image within the bounds
- **Cover**: Preserves aspect ratio and fills the bounds completely
- **Crop**: Allows custom crop area

Check `supportsContentFillMode()` before setting to ensure the block supports this feature.

```typescript highlight=highlight-content-fill-mode
    // Set content fill mode to control how images scale within bounds
    // 'Contain' preserves aspect ratio and fits within bounds
    // 'Cover' preserves aspect ratio and fills bounds
    const containBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 550,
      y: 50
    });
    engine.block.appendChild(page, containBlock);

    if (engine.block.supportsContentFillMode(containBlock)) {
      engine.block.setContentFillMode(containBlock, 'Contain');
      console.log('✓ Applied Contain fill mode');
    }
```

## Apply Corner Radius

Add rounded corners to image blocks using the `cornerRadius` option in the convenience API. This creates a visually softer appearance for your images.

```typescript highlight=highlight-corner-radius
// Apply corner radius to create rounded corners on an image
const roundedBlock = await engine.block.addImage(imageUrl, {
  size: { width: 200, height: 150 },
  x: 50,
  y: 250,
  cornerRadius: 20
});
engine.block.appendChild(page, roundedBlock);
console.log('✓ Added image with rounded corners');
```

## Working with Multiple Images

Insert multiple images by iterating over an array of image URLs. Each image gets its own graphic block with calculated positioning to arrange them on the page.

```typescript highlight=highlight-multiple-images
    // Insert multiple images with calculated positioning
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      const block = await engine.block.addImage(imageUrls[i], {
        size: { width: 150, height: 100 },
        x: 300 + i * 160,
        y: 250
      });
      engine.block.appendChild(page, block);
    }
    console.log('✓ Added multiple images');
```

## Next Steps

After inserting an image, you can:

- [Edit and transform](./edit-image.md) the image
- [Apply filters and effects](./filters-and-effects.md)
- [Export your design](./export-save-publish/export.md)

## API Reference

| Method                                          | Description                                                   |
| ----------------------------------------------- | ------------------------------------------------------------- |
| `engine.block.addImage(url, options?)`          | Convenience API to create an image block with automatic setup |
| `engine.block.create('graphic')`                | Create a graphic block container for images                   |
| `engine.block.createShape('rect')`              | Create a rectangular shape for the image                      |
| `engine.block.setShape(block, shape)`           | Attach shape to graphic block                                 |
| `engine.block.createFill('image')`              | Create an image fill                                          |
| `engine.block.setFill(block, fill)`             | Apply fill to block                                           |
| `engine.block.setString(fill, property, value)` | Set image source URI via `fill/image/imageFileURI`            |
| `engine.block.setWidth(block, width)`           | Set block width                                               |
| `engine.block.setHeight(block, height)`         | Set block height                                              |
| `engine.block.setPositionX(block, x)`           | Set horizontal position                                       |
| `engine.block.setPositionY(block, y)`           | Set vertical position                                         |
| `engine.block.supportsContentFillMode(block)`   | Check if block supports content fill mode                     |
| `engine.block.setContentFillMode(block, mode)`  | Set content fill mode (`Contain`, `Cover`, `Crop`)            |
| `engine.block.appendChild(parent, child)`       | Add block to parent                                           |



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support