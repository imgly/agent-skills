> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [With a Color Mask](./export-save-publish/export/with-color-mask.md)

---

Remove specific colors from exported images and generate alpha masks using
CE.SDK's color mask export API for print workflows, transparency creation, and
compositing pipelines.

![Export with Color Mask example showing color removal and alpha mask generation](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-export-with-color-mask-browser/)

When exporting, CE.SDK can remove specific RGB colors by replacing matching pixels with transparency. The export generates two files: the masked image with transparent areas and an alpha mask showing removed pixels.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-with-color-mask-browser/browser.ts reference-only
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

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create a single image with registration marks
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: pageWidth * 0.8, height: pageHeight * 0.8 }
    });
    engine.block.appendChild(page, imageBlock);

    // Center the image on the page
    const imageWidth = engine.block.getWidth(imageBlock);
    const imageHeight = engine.block.getHeight(imageBlock);
    engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
    engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

    // Add registration marks at the corners (pure red for demonstration)
    const markSize = 30;
    const imageX = engine.block.getPositionX(imageBlock);
    const imageY = engine.block.getPositionY(imageBlock);

    const markPositions = [
      { x: imageX - markSize - 10, y: imageY - markSize - 10 }, // Top-left
      { x: imageX + imageWidth + 10, y: imageY - markSize - 10 }, // Top-right
      { x: imageX - markSize - 10, y: imageY + imageHeight + 10 }, // Bottom-left
      { x: imageX + imageWidth + 10, y: imageY + imageHeight + 10 } // Bottom-right
    ];

    markPositions.forEach((pos) => {
      const mark = engine.block.create('//ly.img.ubq/graphic');
      engine.block.setShape(
        mark,
        engine.block.createShape('//ly.img.ubq/shape/rect')
      );
      const redFill = engine.block.createFill('//ly.img.ubq/fill/color');
      engine.block.setColor(redFill, 'fill/color/value', {
        r: 1.0,
        g: 0.0,
        b: 0.0,
        a: 1.0
      });
      engine.block.setFill(mark, redFill);
      engine.block.setWidth(mark, markSize);
      engine.block.setHeight(mark, markSize);
      engine.block.setPositionX(mark, pos.x);
      engine.block.setPositionY(mark, pos.y);
      engine.block.appendChild(page, mark);
    });

    // Override the default image export action to use color mask export
    cesdk.actions.register('exportDesign', async () => {
      const currentPage = engine.scene.getCurrentPage();
      if (!currentPage) return;

      // Export with color mask - removes pure red pixels (registration marks)
      const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
        currentPage,
        1.0, // Red component
        0.0, // Green component
        0.0, // Blue component (RGB: pure red)
        { mimeType: 'image/png' }
      );

      // Download masked image using CE.SDK utils
      await cesdk.utils.downloadFile(maskedImage, 'image/png');

      // Download alpha mask
      await cesdk.utils.downloadFile(alphaMask, 'image/png');

      console.log('Color mask export completed:', {
        maskedSize: maskedImage.size,
        maskSize: alphaMask.size
      });
    });

    // Add export button to navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.actions.navigationBar',
        children: ['ly.img.exportImage.navigationBar']
      }
    );

    // Log completion
    console.log('Export with Color Mask example loaded successfully');
    console.log(
      'Click the export button in the navigation bar to export with color mask'
    );
  }
}

export default Example;
```

Color mask exports work through exact RGB color matching—pixels that precisely match your specified color values (0.0-1.0 range) are removed. This is useful for print workflows (removing registration marks), transparency creation (removing background colors), or generating alpha masks for compositing tools.

## Exporting with Color Masks

We export blocks with color masking using the `exportWithColorMask` method. This method removes specific RGB colors from the rendered output and generates both a masked image and an alpha mask.

```typescript highlight-export-with-color-mask
// Export with color mask - removes pure red pixels (registration marks)
const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
  currentPage,
  1.0, // Red component
  0.0, // Green component
  0.0, // Blue component (RGB: pure red)
  { mimeType: 'image/png' }
);
```

The method accepts the block to export, three RGB color components (0.0-1.0 range), and optional export options like MIME type. This example uses pure red `(1.0, 0.0, 0.0)` to identify and remove registration marks from the design.

The export operation returns a Promise that resolves to an array containing two Blobs. The first Blob is the masked image with transparency applied where the specified color was found. The second Blob is the alpha mask—a black and white image showing which pixels were removed (black) and which remained (white).

We then download both files using `cesdk.utils.downloadFile()`, which triggers browser downloads with appropriate file naming.

### Specifying RGB Color Values

RGB color components in CE.SDK use floating-point values from 0.0 to 1.0, not the 0-255 integer values common in design tools:

- Pure red: `(1.0, 0.0, 0.0)` - Common for registration marks
- Pure magenta: `(1.0, 0.0, 1.0)` - Distinctive marker color
- Pure cyan: `(0.0, 1.0, 1.0)` - Alternative marker color
- Pure yellow: `(1.0, 1.0, 0.0)` - Useful for exclusion zones

When converting from standard 0-255 RGB values, divide each component by 255. For example, RGB(255, 128, 0) becomes `(1.0, 0.502, 0.0)`.

## How to Export with Color Masks

We override the default export action to apply color masking when users click the export button. This integrates color mask functionality into your editor's workflow without requiring additional UI.

```typescript highlight-register-export-action
    // Override the default image export action to use color mask export
    cesdk.actions.register('exportDesign', async () => {
      const currentPage = engine.scene.getCurrentPage();
      if (!currentPage) return;

      // Export with color mask - removes pure red pixels (registration marks)
      const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
        currentPage,
        1.0, // Red component
        0.0, // Green component
        0.0, // Blue component (RGB: pure red)
        { mimeType: 'image/png' }
      );

      // Download masked image using CE.SDK utils
      await cesdk.utils.downloadFile(maskedImage, 'image/png');

      // Download alpha mask
      await cesdk.utils.downloadFile(alphaMask, 'image/png');

      console.log('Color mask export completed:', {
        maskedSize: maskedImage.size,
        maskSize: alphaMask.size
      });
    });
```

The custom action registers as `'exportDesign'`, replacing the default export behavior. When triggered, it exports the current page with pure red `(1.0, 0.0, 0.0)` as the mask color, then downloads both the masked image and alpha mask files using `cesdk.utils.downloadFile()`.

## API Reference

| Method                                          | Description                                               |
| ----------------------------------------------- | --------------------------------------------------------- |
| `cesdk.actions.register()`                      | Registers a custom action that can be triggered by UI elements |
| `cesdk.ui.insertOrderComponent()`               | Adds UI components to the editor's navigation bar         |
| `cesdk.utils.downloadFile()`                    | Triggers a browser download for a file blob               |
| `engine.scene.getCurrentPage()`                 | Gets the currently active page in the scene               |
| `engine.block.exportWithColorMask()`            | Exports a block with specific RGB color removed, generating masked image and alpha mask |
| `engine.block.addImage()`                       | Adds an image block to the scene                          |
| `engine.block.create()`                         | Creates a new block of the specified type                 |
| `engine.block.setShape()`                       | Sets the shape for a graphic block                        |
| `engine.block.createShape()`                    | Creates a shape definition for graphic blocks             |
| `engine.block.createFill()`                     | Creates a fill definition for blocks                      |
| `engine.block.setColor()`                       | Sets the color value for a fill                           |
| `engine.block.setFill()`                        | Applies a fill to a block                                 |
| `engine.block.appendChild()`                    | Adds a block as a child of another block                  |



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support