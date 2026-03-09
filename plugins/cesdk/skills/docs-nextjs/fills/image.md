> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Fills](./fills.md) > [Image](./fills/image.md)

---

Fill shapes, text, and design blocks with photos and images from URLs,
uploads, or asset libraries using CE.SDK's versatile image fill system.

![Image Fills example showing multiple images applied to design blocks with different fill modes](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-fills-image-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-fills-image-browser)
>
> - [Live demo](https://img.ly/examples/guides-fills-image-browser/)

Image fills paint design blocks with raster or vector image content, supporting various formats including PNG, JPEG, WebP, and SVG. You can load images from remote URLs, local files, data URIs, and asset libraries, with built-in support for responsive images through source sets and multiple content fill modes for flexible positioning.

```typescript file=@cesdk_web_examples/guides-fills-image-browser/browser.ts reference-only
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

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Fill features are enabled by default in CE.SDK
    // You can check and control fill feature availability:
    const isFillEnabled = cesdk.feature.isEnabled('ly.img.fill', {
      engine: cesdk.engine
    });
    console.log('Fill feature enabled:', isFillEnabled);
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

    // Calculate responsive grid layout for demonstrations
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 7);
    const { blockWidth, blockHeight, getPosition } = layout;

    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const blockSize = { width: blockWidth, height: blockHeight };

    // ===== Section 1: Check Fill Support =====
    // Check if a block supports fills before accessing fill APIs
    const testBlock = engine.block.create('graphic');
    const canHaveFill = engine.block.supportsFill(testBlock);
    console.log('Block supports fills:', canHaveFill);
    engine.block.destroy(testBlock);

    // ===== Section 2: Create and Apply Image Fill =====
    // Create a new image fill using the convenience API
    const coverImageBlock = await engine.block.addImage(imageUri, {
      size: blockSize
    });
    engine.block.appendChild(page, coverImageBlock);

    // Or create manually for more control
    const manualBlock = engine.block.create('graphic');
    engine.block.setShape(manualBlock, engine.block.createShape('rect'));
    engine.block.setWidth(manualBlock, blockWidth);
    engine.block.setHeight(manualBlock, blockHeight);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_2.jpg'
    );
    engine.block.setFill(manualBlock, imageFill);
    engine.block.appendChild(page, manualBlock);

    // Get the current fill from a block
    const currentFill = engine.block.getFill(coverImageBlock);
    const fillType = engine.block.getType(currentFill);
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/image'

    // ===== Section 3: Content Fill Modes =====
    // Cover mode: Fill entire block, may crop image
    const coverBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: blockSize
      }
    );
    engine.block.appendChild(page, coverBlock);
    engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');

    // Contain mode: Fit entire image, may leave empty space
    const containBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      {
        size: blockSize
      }
    );
    engine.block.appendChild(page, containBlock);
    engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');

    // Get current fill mode
    const currentMode = engine.block.getEnum(containBlock, 'contentFill/mode');
    console.log('Current fill mode:', currentMode);

    // ===== Section 4: Source Sets (Responsive Images) =====
    // Use source sets for responsive images
    const responsiveBlock = engine.block.create('graphic');
    engine.block.setShape(responsiveBlock, engine.block.createShape('rect'));
    engine.block.setWidth(responsiveBlock, blockWidth);
    engine.block.setHeight(responsiveBlock, blockHeight);

    const responsiveFill = engine.block.createFill('image');
    engine.block.setSourceSet(responsiveFill, 'fill/image/sourceSet', [
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        width: 512,
        height: 341
      },
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        width: 1024,
        height: 683
      },
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        width: 2048,
        height: 1366
      }
    ]);
    engine.block.setFill(responsiveBlock, responsiveFill);
    engine.block.appendChild(page, responsiveBlock);

    // Get current source set
    const sourceSet = engine.block.getSourceSet(
      responsiveFill,
      'fill/image/sourceSet'
    );
    console.log('Source set entries:', sourceSet.length);

    // ===== Section 5: Data URI / Base64 Images =====
    // Use data URI for embedded images (small SVG example)
    const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#4CAF50"/>
        <text x="50" y="55" text-anchor="middle" fill="white" font-size="20" font-weight="bold">SVG</text>
      </svg>`;
    const svgDataUri = `data:image/svg+xml;base64,${btoa(svgContent)}`;

    const dataUriBlock = engine.block.create('graphic');
    engine.block.setShape(dataUriBlock, engine.block.createShape('rect'));
    engine.block.setWidth(dataUriBlock, blockWidth);
    engine.block.setHeight(dataUriBlock, blockHeight);

    const dataUriFill = engine.block.createFill('image');
    engine.block.setString(dataUriFill, 'fill/image/imageFileURI', svgDataUri);
    engine.block.setFill(dataUriBlock, dataUriFill);
    engine.block.appendChild(page, dataUriBlock);

    // ===== Section 6: Opacity =====
    // Control opacity for transparency effects
    const opacityBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: blockSize
      }
    );
    engine.block.appendChild(page, opacityBlock);
    engine.block.setFloat(opacityBlock, 'opacity', 0.6);

    // ===== Position all blocks in grid layout =====
    const blocks = [
      coverImageBlock, // Position 0
      manualBlock, // Position 1
      coverBlock, // Position 2
      containBlock, // Position 3
      responsiveBlock, // Position 4
      dataUriBlock, // Position 5
      opacityBlock // Position 6
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Zoom to show all content
    await engine.scene.zoomToBlock(page);
  }
}

export default Example;
```

This guide covers how to create and apply image fills programmatically, configure content fill modes, work with responsive images, and load images from different sources.

## Understanding Image Fills

Image fills are one of the fundamental fill types in CE.SDK, identified by the type `'//ly.img.ubq/fill/image'` or simply `'image'`. Unlike color fills that provide solid colors or gradient fills that create color transitions, image fills paint blocks with photographic or graphic content from image files.

CE.SDK supports common image formats including PNG, JPEG, JPG, GIF, WebP, SVG, and BMP, with transparency support in formats like PNG, WebP, and SVG. The image fill system handles content scaling, positioning, and optimization automatically while giving you full programmatic control when needed.

## Checking Image Fill Support

Before working with fills, we should verify that a block supports fill operations. Not all blocks in CE.SDK can have fills—for example, scenes and pages typically don't support fills, while graphic blocks, shapes, and text blocks do.

```typescript highlight-check-fill-support
// Check if a block supports fills before accessing fill APIs
const testBlock = engine.block.create('graphic');
const canHaveFill = engine.block.supportsFill(testBlock);
console.log('Block supports fills:', canHaveFill);
engine.block.destroy(testBlock);
```

The `supportsFill()` method returns `true` if the block can have a fill assigned to it. Always check this before attempting to access fill APIs to avoid errors.

## Creating Image Fills

CE.SDK provides two approaches for creating image fills: a convenience API for quick block creation, and manual creation for more control over the fill configuration.

### Using the Convenience API

The fastest way to create a block with an image fill is using the `addImage()` method, which creates a graphic block, configures the image fill, and adds it to the scene in one operation:

```typescript highlight-create-image-fill
// Create a new image fill using the convenience API
const coverImageBlock = await engine.block.addImage(imageUri, {
  size: blockSize
});
engine.block.appendChild(page, coverImageBlock);
```

This convenience method handles all the underlying setup automatically, including creating the graphic block, shape, fill, and positioning.

### Manual Image Fill Creation

For more control over the fill configuration or to apply fills to existing blocks, you can create fills manually:

```typescript highlight-manual-fill-creation
    // Or create manually for more control
    const manualBlock = engine.block.create('graphic');
    engine.block.setShape(manualBlock, engine.block.createShape('rect'));
    engine.block.setWidth(manualBlock, blockWidth);
    engine.block.setHeight(manualBlock, blockHeight);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_2.jpg'
    );
    engine.block.setFill(manualBlock, imageFill);
    engine.block.appendChild(page, manualBlock);
```

When creating fills manually, the fill exists independently until you attach it to a block using `setFill()`. If you create a fill but don't attach it to a block, you must destroy it manually to avoid memory leaks.

### Getting the Current Fill

You can retrieve the fill from any block and inspect its type to verify it's an image fill:

```typescript highlight-get-current-fill
// Get the current fill from a block
const currentFill = engine.block.getFill(coverImageBlock);
const fillType = engine.block.getType(currentFill);
console.log('Fill type:', fillType); // '//ly.img.ubq/fill/image'
```

The `getFill()` method returns the fill's block ID, which you can then use to query the fill's type and properties.

## Configuring Content Fill Modes

Content fill modes control how images scale and position within their containing blocks. CE.SDK provides two primary modes: Cover and Contain, each optimized for different use cases.

### Cover Mode

Cover mode ensures the image fills the entire block while maintaining its aspect ratio. Parts of the image may be cropped if the aspect ratios don't match, but there will never be empty space in the block:

```typescript highlight-fill-mode-cover
// Cover mode: Fill entire block, may crop image
const coverBlock = await engine.block.addImage(
  'https://img.ly/static/ubq_samples/sample_3.jpg',
  {
    size: blockSize
  }
);
engine.block.appendChild(page, coverBlock);
engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');
```

Cover mode is ideal for backgrounds, hero images, and photo frames where you want the block completely filled with image content. The image is scaled to cover the entire area, and any overflow is cropped.

### Contain Mode

Contain mode fits the entire image within the block while maintaining its aspect ratio. This may leave empty space if the aspect ratios don't match, but the entire image will always be visible:

```typescript highlight-fill-mode-contain
// Contain mode: Fit entire image, may leave empty space
const containBlock = await engine.block.addImage(
  'https://img.ly/static/ubq_samples/sample_4.jpg',
  {
    size: blockSize
  }
);
engine.block.appendChild(page, containBlock);
engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');
```

Contain mode is best for logos, product images, and situations where preserving the complete image visibility is more important than filling the entire block.

### Getting the Current Fill Mode

You can query the current fill mode to understand how the image is being displayed:

```typescript highlight-get-fill-mode
// Get current fill mode
const currentMode = engine.block.getEnum(containBlock, 'contentFill/mode');
console.log('Current fill mode:', currentMode);
```

This returns either `'Cover'` or `'Contain'` depending on the current configuration.

## Working with Source Sets

Source sets enable responsive images by providing multiple resolutions of the same image. The engine automatically selects the most appropriate size based on the current display context, optimizing both performance and visual quality.

### Setting Up a Source Set

A source set is an array of image sources, each with a URI and dimensions:

```typescript highlight-source-set
    // Use source sets for responsive images
    const responsiveBlock = engine.block.create('graphic');
    engine.block.setShape(responsiveBlock, engine.block.createShape('rect'));
    engine.block.setWidth(responsiveBlock, blockWidth);
    engine.block.setHeight(responsiveBlock, blockHeight);

    const responsiveFill = engine.block.createFill('image');
    engine.block.setSourceSet(responsiveFill, 'fill/image/sourceSet', [
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        width: 512,
        height: 341
      },
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        width: 1024,
        height: 683
      },
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        width: 2048,
        height: 1366
      }
    ]);
    engine.block.setFill(responsiveBlock, responsiveFill);
    engine.block.appendChild(page, responsiveBlock);
```

Each entry in the source set specifies a URI and the image's width and height in pixels. The engine calculates the current drawing size and selects the source with the closest size that exceeds the required dimensions.

> **Note:** Source sets are particularly valuable for optimizing bandwidth usage during
> preview while ensuring high-resolution output during export. The engine
> automatically uses the highest resolution available when exporting.

### Retrieving Source Sets

You can get the current source set from a fill to inspect or modify it:

```typescript highlight-get-source-set
// Get current source set
const sourceSet = engine.block.getSourceSet(
  responsiveFill,
  'fill/image/sourceSet'
);
console.log('Source set entries:', sourceSet.length);
```

## Loading Images from Different Sources

CE.SDK's image fills support multiple image source types, giving you flexibility in how you provide image content to your designs.

### Data URIs and Base64

You can embed image data directly using data URIs, which is particularly useful for small images, icons, or dynamically generated graphics:

```typescript highlight-data-uri
    // Use data URI for embedded images (small SVG example)
    const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#4CAF50"/>
        <text x="50" y="55" text-anchor="middle" fill="white" font-size="20" font-weight="bold">SVG</text>
      </svg>`;
    const svgDataUri = `data:image/svg+xml;base64,${btoa(svgContent)}`;

    const dataUriBlock = engine.block.create('graphic');
    engine.block.setShape(dataUriBlock, engine.block.createShape('rect'));
    engine.block.setWidth(dataUriBlock, blockWidth);
    engine.block.setHeight(dataUriBlock, blockHeight);

    const dataUriFill = engine.block.createFill('image');
    engine.block.setString(dataUriFill, 'fill/image/imageFileURI', svgDataUri);
    engine.block.setFill(dataUriBlock, dataUriFill);
    engine.block.appendChild(page, dataUriBlock);
```

Data URIs embed the entire image within the URI string itself, eliminating the need for network requests. However, this increases the scene file size, so it's best reserved for smaller images or cases where you need guaranteed availability without network dependencies.

## Additional Techniques

### Controlling Opacity

You can control the overall opacity of blocks with image fills, affecting the entire block including its fill:

```typescript highlight-opacity
// Control opacity for transparency effects
const opacityBlock = await engine.block.addImage(
  'https://img.ly/static/ubq_samples/sample_6.jpg',
  {
    size: blockSize
  }
);
engine.block.appendChild(page, opacityBlock);
engine.block.setFloat(opacityBlock, 'opacity', 0.6);
```

The opacity value ranges from 0 (fully transparent) to 1 (fully opaque). This affects the entire block, including the image fill. For transparency within the image itself, use image formats that support alpha channels like PNG, WebP, or SVG.

> **Note:** Opacity is a block property, not a fill property. It affects the entire block
> including any strokes, effects, or other visual properties applied to the
> block.

## API Reference

### Core Methods

| Method                                  | Description                                        |
| --------------------------------------- | -------------------------------------------------- |
| `createFill('image')`                   | Create a new image fill object                     |
| `setFill(block, fill)`                  | Assign an image fill to a block                    |
| `getFill(block)`                        | Get the fill ID from a block                       |
| `setString(fill, property, value)`      | Set the image URI                                  |
| `getString(fill, property)`             | Get the current image URI                          |
| `setSourceSet(fill, property, sources)` | Set responsive image sources                       |
| `getSourceSet(fill, property)`          | Get current source set                             |
| `setEnum(block, property, value)`       | Set content fill mode                              |
| `getEnum(block, property)`              | Get current fill mode                              |
| `supportsFill(block)`                   | Check if block supports fills                      |
| `addImage(url, options)`                | Convenience method to create image block with fill |

### Image Fill Properties

| Property                  | Type        | Description                                       |
| ------------------------- | ----------- | ------------------------------------------------- |
| `fill/image/imageFileURI` | String      | Single image URI (URL, data URI, or file path)    |
| `fill/image/sourceSet`    | SourceSet\[] | Array of responsive image sources with dimensions |

### Content Fill Properties

| Property           | Type | Values             | Description                           |
| ------------------ | ---- | ------------------ | ------------------------------------- |
| `contentFill/mode` | Enum | 'Cover', 'Contain' | How the image scales within its block |

### SourceSet Interface

```typescript
interface SourceSetEntry {
  uri: string; // Image URI
  width: number; // Image width in pixels
  height: number; // Image height in pixels
}
```



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support