> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Images](./edit-image.md) > [Remove Background](./edit-image/remove-bg.md)

---

Remove image backgrounds to isolate subjects for compositing, product photography, or creating transparent overlays.

![Remove Background example showing an image with its background removed](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-remove-bg-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-edit-image-remove-bg-browser)
>
> - [Live demo](https://img.ly/examples/guides-edit-image-remove-bg-browser/)

The `@imgly/plugin-background-removal-web` plugin adds AI-powered background removal directly to the CE.SDK editor. Processing runs locally in the browser using WebAssembly and WebGPU, ensuring privacy since images never leave the client.

```typescript file=@cesdk_web_examples/guides-edit-image-remove-bg-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal-web';
import packageJson from './package.json';

/**
 * CE.SDK Browser Guide: Remove Background with Plugin
 *
 * Demonstrates adding and configuring the background removal plugin
 * for the CE.SDK editor with various UI placement options.
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true,
    });
    await cesdk.createDesignScene();

    // Get page and set dimensions
    const page = engine.block.findByType('page')[0];
    const pageWidth = 800;
    const pageHeight = 600;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Add the background removal plugin with canvas menu button
    await cesdk.addPlugin(
      BackgroundRemovalPlugin({
        ui: {
          locations: ['canvasMenu'],
        },
      })
    );

    // Create a gradient background (deep teal to soft purple)
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { stop: 0, color: { r: 0.08, g: 0.22, b: 0.35, a: 1 } }, // Deep teal
      { stop: 1, color: { r: 0.35, g: 0.2, b: 0.45, a: 1 } }, // Soft purple
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create centered title text
    const titleBlock = engine.block.create('text');
    engine.block.setString(titleBlock, 'text/text', 'Remove Background');
    engine.block.setFloat(titleBlock, 'text/fontSize', 140);
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleBlock, pageWidth);
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);
    engine.block.setTextColor(titleBlock, { r: 1, g: 1, b: 1, a: 1 });

    // Create image block with a portrait photo
    const imageBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_4.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setContentFillMode(imageBlock, 'Cover');

    const imageWidth = 202;
    const imageHeight = 230;
    engine.block.setWidth(imageBlock, imageWidth);
    engine.block.setHeight(imageBlock, imageHeight);
    engine.block.appendChild(page, imageBlock);

    // Create img.ly logo at bottom center
    const logoBlock = engine.block.create('graphic');
    const logoShape = engine.block.createShape('rect');
    engine.block.setShape(logoBlock, logoShape);

    const logoFill = engine.block.createFill('image');
    engine.block.setString(
      logoFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    engine.block.setFill(logoBlock, logoFill);
    engine.block.setContentFillMode(logoBlock, 'Contain');

    const logoWidth = 72;
    const logoHeight = 45;
    engine.block.setWidth(logoBlock, logoWidth);
    engine.block.setHeight(logoBlock, logoHeight);
    engine.block.setOpacity(logoBlock, 0.9);
    engine.block.appendChild(page, logoBlock);

    // Position elements
    const titleHeight = engine.block.getFrameHeight(titleBlock);
    const imageGap = 30;
    const padding = 20;

    // Calculate vertical layout - title and image centered
    const totalContentHeight = titleHeight + imageGap + imageHeight;
    const startY = (pageHeight - totalContentHeight) / 2;

    // Position title at top of content area
    engine.block.setPositionX(titleBlock, 0);
    engine.block.setPositionY(titleBlock, startY);

    // Position image centered below title
    engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
    engine.block.setPositionY(imageBlock, startY + titleHeight + imageGap);

    // Position logo at bottom center
    engine.block.setPositionX(logoBlock, (pageWidth - logoWidth) / 2);
    engine.block.setPositionY(logoBlock, pageHeight - logoHeight - padding);

    // Select the image to show the canvas menu with BG Removal button
    engine.block.select(imageBlock);

    // Zoom to fit
    await engine.scene.zoomToBlock(page, { padding: 40 });
    engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);
  }
}

export default Example;
```

This guide covers installing the plugin, configuring UI placement, and customizing the background removal process.

## Installing the Plugin

Install the background removal plugin and its ONNX runtime peer dependency:

```bash
npm install @imgly/plugin-background-removal-web onnxruntime-web@1.21.0
```

Import the plugin in your application:

```typescript highlight-import
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal-web';
```

## Initializing the Editor

Set up the CE.SDK editor with asset sources before adding the plugin:

```typescript highlight-setup
await cesdk.addDefaultAssetSources();
await cesdk.addDemoAssetSources({
  sceneMode: 'Design',
  withUploadAssetSources: true,
});
await cesdk.createDesignScene();
```

## Adding the Plugin

Add the plugin to the editor using `cesdk.addPlugin()`. The `ui.locations` option controls where the background removal button appears:

```typescript highlight-add-plugin
// Add the background removal plugin with canvas menu button
await cesdk.addPlugin(
  BackgroundRemovalPlugin({
    ui: {
      locations: ['canvasMenu'],
    },
  })
);
```

When a user selects an image and clicks the button, the plugin handles the entire workflow: exporting the image, processing it through the AI model, and applying the result back to the scene.

![A BG Removal button added to the Canvas Menu](https://img.ly/docs/cesdk/./screenshot-bg-removal-button-v1.43.0.gif)

> **Note:** The plugin requires a correctly configured upload setting. 'local' works for testing but production requires stable storage. See the [Upload Images](./import-media/from-local-source/user-upload.md) guide for details.

## UI Placement Options

The plugin supports multiple UI locations:

| Location | Description |
| --- | --- |
| `'canvasMenu'` | Context menu when selecting an image on canvas |
| `'dock'` | Panel in the left dock sidebar |
| `'inspectorBar'` | Top bar of the inspector panel |
| `'navigationBar'` | Main navigation bar |
| `'canvasBarTop'` | Top bar above the canvas |
| `'canvasBarBottom'` | Bottom bar below the canvas |

You can specify a single location or an array:

```typescript
BackgroundRemovalPlugin({
  ui: { locations: ['canvasMenu', 'dock'] }
})
```

## Provider Configuration

Configure the underlying background removal library through the `provider` option:

```typescript
BackgroundRemovalPlugin({
  ui: { locations: ['canvasMenu'] },
  provider: {
    type: '@imgly/background-removal',
    configuration: {
      model: 'medium', // 'small' | 'medium' | 'large'
      output: {
        format: 'image/png',
        quality: 0.9
      }
    }
  }
})
```

| Option | Type | Description |
| --- | --- | --- |
| `model` | `'small'` | `'medium'` | `'large'` | Model size for quality/speed trade-off |
| `output.format` | string | Output format: `'image/png'`, `'image/webp'` |
| `output.quality` | number | Quality for lossy formats (0-1) |

The `'medium'` model provides the best balance of quality and speed. Use `'small'` for faster processing or `'large'` for maximum edge quality.

## Custom Provider

For advanced use cases, implement a custom background removal provider:

```typescript
BackgroundRemovalPlugin({
  provider: {
    type: 'custom',
    processImageFileURI: async (imageFileURI: string) => {
      // Call your own background removal service
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: imageFileURI })
      });
      const { processedUrl } = await response.json();
      return processedUrl;
    },
    processSourceSet: async (sourceSet) => {
      // Handle multi-resolution source sets
      // Process the highest resolution and resize for others
      return sourceSet;
    }
  }
})
```

## Creating an Image Block

Add an image to the scene for background removal:

```typescript highlight-create-image
    // Create image block with a portrait photo
    const imageBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_4.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setContentFillMode(imageBlock, 'Cover');

    const imageWidth = 202;
    const imageHeight = 230;
    engine.block.setWidth(imageBlock, imageWidth);
    engine.block.setHeight(imageBlock, imageHeight);
    engine.block.appendChild(page, imageBlock);
```

Select the image block to display the canvas menu with the background removal button.

## Performance Considerations

The first background removal operation downloads AI models (~40MB) which are then cached:

- **Model caching**: First run fetches models; subsequent runs use the cache
- **GPU acceleration**: WebGPU provides faster processing than WebGL fallback
- **CORS headers**: For optimal performance, configure these headers on your server:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Model download slow | First run fetches models; subsequent runs use cache |
| Poor edge quality | Use higher resolution input or 'medium'/'large' model |
| Out of memory | Reduce image size before processing |
| WebGL errors | Check browser WebGL support; try different device setting |
| Plugin not showing | Verify plugin added and UI location configured |
| Result not transparent | Ensure export uses PNG format (JPEG doesn't support transparency) |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Export options for images with transparency
- [Vectorize Images](./edit-image/vectorize.md) - Convert images to vector graphics
- [Replace Colors](./edit-image/replace-colors.md) - Replace specific colors in images



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support