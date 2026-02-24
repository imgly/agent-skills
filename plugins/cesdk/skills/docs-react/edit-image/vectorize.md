> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Vectorize](./edit-image/vectorize.md)

---

Convert raster images into scalable vector graphics that resize without quality loss using CE.SDK's vectorizer plugin.

![Vectorize Images example showing an image ready for vectorization](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-vectorize-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-vectorize-browser)
>
> - [Live demo](https://img.ly/examples/guides-edit-image-vectorize-browser/)

Vectorization transforms pixel-based images into vector paths that can be scaled to any size without losing quality. The `@imgly/plugin-vectorizer-web` plugin provides one-click UI conversion directly in the canvas menu. Common use cases include converting logos for scalable branding, creating cutout outlines from photographs, and extracting editable paths from illustrations.

```typescript file=@cesdk_web_examples/guides-edit-image-vectorize-browser/browser.ts reference-only
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
import VectorizerPlugin from '@imgly/plugin-vectorizer-web';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Vectorize Images Guide
 *
 * Demonstrates converting raster images to vector graphics:
 * - Using the vectorizer plugin for UI-based conversion
 * - Programmatically vectorizing with createCutoutFromBlocks()
 * - Configuring threshold parameters for quality control
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Add the vectorizer plugin with configuration options
    await cesdk.addPlugin(
      VectorizerPlugin({
        // Display the vectorize button in the canvas menu
        ui: { locations: 'canvasMenu' },
        // Set processing timeout to 30 seconds
        timeout: 30000,
        // Combine paths into a single shape when exceeding 500 paths
        groupingThreshold: 500
      })
    );

    // Show only the vectorizer button in the canvas menu
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, ['@imgly/plugin-vectorizer-web.canvasMenu']);

    // Create a design scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Create an image block to vectorize
    const imageBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    // Load a sample image with clear contours for vectorization
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setContentFillMode(imageBlock, 'Contain');

    // Center the image on the page
    const imageWidth = 400;
    const imageHeight = 300;
    engine.block.setWidth(imageBlock, imageWidth);
    engine.block.setHeight(imageBlock, imageHeight);
    engine.block.setPositionX(imageBlock, (800 - imageWidth) / 2);
    engine.block.setPositionY(imageBlock, (600 - imageHeight) / 2);
    engine.block.appendChild(page, imageBlock);

    // Select the image to reveal the vectorize button in the canvas menu
    engine.block.select(imageBlock);

    // Zoom to fit the page in view
    await engine.scene.zoomToBlock(page, { padding: 40 });
    engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);
  }
}

export default Example;
```

This guide covers how to install and configure the vectorizer plugin, customize the canvas menu, and troubleshoot common vectorization issues.

## Using the Vectorizer Plugin

The `@imgly/plugin-vectorizer-web` plugin adds a vectorize button to the canvas menu when you select an image block. Processing runs entirely in the browser using the [@imgly/vectorizer](https://www.npmjs.com/package/@imgly/vectorizer) library.

### Installation

Install the plugin via npm or yarn:

```sh
yarn add @imgly/plugin-vectorizer-web
npm install @imgly/plugin-vectorizer-web
```

### Adding the Plugin

We register the plugin using `cesdk.addPlugin()` with the `ui.locations` option to display the vectorize button in the canvas menu. To show only the vectorizer button, we use `setComponentOrder({ in: 'ly.img.canvas.menu' }, order)` to filter out other menu items.

```typescript highlight-add-plugin
    // Add the vectorizer plugin with configuration options
    await cesdk.addPlugin(
      VectorizerPlugin({
        // Display the vectorize button in the canvas menu
        ui: { locations: 'canvasMenu' },
        // Set processing timeout to 30 seconds
        timeout: 30000,
        // Combine paths into a single shape when exceeding 500 paths
        groupingThreshold: 500
      })
    );

    // Show only the vectorizer button in the canvas menu
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, ['@imgly/plugin-vectorizer-web.canvasMenu']);
```

### Configuration Options

You can customize the plugin behavior with two configuration options:

- **timeout**: Processing time limit in milliseconds (default: 30000). Increase this for complex images that take longer to process.
- **groupingThreshold**: Maximum path count before combining into a single shape (default: 500). Lower values combine paths earlier, reducing selectable elements.

## Programmatic Vectorization

For automation workflows, you can create cutout blocks from source blocks using `engine.block.createCutoutFromBlocks()`. This method traces rasterized content or extracts existing vector paths.

### Threshold Parameters

The `createCutoutFromBlocks()` method accepts three parameters that control vectorization quality:

- **vectorizeDistanceThreshold** (default: 2): Maximum contour deviation during tracing. Lower values increase accuracy but produce more complex paths.
- **simplifyDistanceThreshold** (default: 4): Maximum deviation for path smoothing. Set to 0 to disable smoothing entirely.
- **useExistingShapeInformation** (default: true): When true, extracts existing vector paths from shapes and SVGs without re-tracing.

### Threshold Recommendations

Start with the default values (2, 4) and adjust based on your source content:

| Content Type | vectorizeDistanceThreshold | simplifyDistanceThreshold |
|--------------|----------------------------|---------------------------|
| Photographs | 4-8 | 6-10 |
| Logos and icons | 1-2 | 2-4 |
| Illustrations | 2-4 | 4-6 |

Lower thresholds increase path complexity and processing time. For photographs with many details, higher thresholds reduce the number of paths while maintaining overall shape recognition.

## Troubleshooting

Common issues and solutions:

- **Processing timeout**: Increase the `timeout` option or use higher threshold values to reduce complexity.
- **Jagged edges**: Increase `simplifyDistanceThreshold` to smooth the paths.
- **Lost details**: Decrease both threshold values to capture finer contours.
- **Vectorize button not appearing**: Verify `ui: { locations: 'canvasMenu' }` is set and that you've selected an image block.
- **Memory issues with complex images**: Increase `groupingThreshold` to combine more paths into single shapes.

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `cesdk.addPlugin(VectorizerPlugin(options))` | Plugin | Register the vectorizer plugin |
| `cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, ids)` | UI | Control which items appear in the canvas menu |
| `engine.block.createCutoutFromBlocks(ids, vectorizeDistanceThreshold?, simplifyDistanceThreshold?, useExistingShapeInformation?)` | Block | Create a cutout from block contours |



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support