> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Shapes](./shapes.md) > [Insert QR Code](./stickers-and-shapes/insert-qr-code.md)

---

Add scannable QR codes to designs programmatically using image fills.

![QR code demonstration showing image fill approach](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-insert-qr-code-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-insert-qr-code-browser)
>
> - [Live demo](https://img.ly/examples/guides-stickers-and-shapes-insert-qr-code-browser/)

QR codes encode URLs that mobile devices can scan, making them useful for marketing materials, business cards, event posters, and product packaging. This guide shows how to generate QR codes as images and add them to CE.SDK designs.

> **Note:** For a simpler integration, consider using the official [@imgly/plugin-qr-code-web](https://www.npmjs.com/package/@imgly/plugin-qr-code-web) plugin which provides ready-to-use QR code functionality.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-insert-qr-code-browser/browser.ts reference-only
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
import { generateQRCodeDataURL } from './qr-utils';

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
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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

    const qrSize = 200;

    // ===== Demonstration: QR Code as Image Fill =====
    // Generate QR code as data URL image with custom colors
    const qrImageUrl = await generateQRCodeDataURL('https://img.ly', {
      width: 256,
      color: { dark: '#1a5fb4', light: '#ffffff' }
    });

    // Create graphic block with rectangle shape and image fill
    const imageQrBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageQrBlock, rectShape);

    // Create image fill with QR code data URL
    const imageFill = engine.block.createFill('image');
    engine.block.setString(imageFill, 'fill/image/imageFileURI', qrImageUrl);
    engine.block.setFill(imageQrBlock, imageFill);

    // Set dimensions and position for image-based QR code
    engine.block.setWidth(imageQrBlock, qrSize);
    engine.block.setHeight(imageQrBlock, qrSize);
    engine.block.setPositionX(imageQrBlock, 300);
    engine.block.setPositionY(imageQrBlock, 200);

    // Add to page
    engine.block.appendChild(page, imageQrBlock);

    // Add label for the QR code
    const textBlock = engine.block.create('text');
    engine.block.replaceText(textBlock, 'Image Fill');
    engine.block.setFloat(textBlock, 'text/fontSize', 69);
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(textBlock, 300);
    engine.block.setPositionX(textBlock, 250);
    engine.block.setPositionY(textBlock, 420);
    engine.block.appendChild(page, textBlock);

    // Zoom to fit all content
    await engine.scene.zoomToBlock(page, { padding: 40 });
  }
}

export default Example;
```

## Generating QR Code Images

Use a QR code library like `qrcode` to generate QR codes as data URLs with custom colors.

```typescript highlight-generate-image
// Generate QR code as data URL image with custom colors
const qrImageUrl = await generateQRCodeDataURL('https://img.ly', {
  width: 256,
  color: { dark: '#1a5fb4', light: '#ffffff' }
});
```

The `toDataURL` method creates a base64-encoded image that works directly with CE.SDK's image fill. You can customize the colors at generation time.

## Creating a QR Code Block

Create a graphic block with a rectangle shape and apply the QR code as an image fill.

```typescript highlight-create-image-block
    // Create graphic block with rectangle shape and image fill
    const imageQrBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageQrBlock, rectShape);

    // Create image fill with QR code data URL
    const imageFill = engine.block.createFill('image');
    engine.block.setString(imageFill, 'fill/image/imageFileURI', qrImageUrl);
    engine.block.setFill(imageQrBlock, imageFill);
```

Image fills use a rectangle shape with the QR code as the fill content. This approach is straightforward and supports color customization at generation time.

## Positioning and Sizing

Set the QR code dimensions and position on the page.

```typescript highlight-position-image
    // Set dimensions and position for image-based QR code
    engine.block.setWidth(imageQrBlock, qrSize);
    engine.block.setHeight(imageQrBlock, qrSize);
    engine.block.setPositionX(imageQrBlock, 300);
    engine.block.setPositionY(imageQrBlock, 200);

    // Add to page
    engine.block.appendChild(page, imageQrBlock);
```

Maintain a square aspect ratio by setting equal width and height. For reliable scanning, keep QR codes at least 100x100 pixels.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.create('graphic')` | Creation | Create graphic block for QR code |
| `engine.block.createShape('rect')` | Shapes | Create rectangle shape |
| `engine.block.setShape(id, shape)` | Shapes | Apply shape to graphic block |
| `engine.block.createFill('image')` | Fills | Create image fill |
| `engine.block.setString(id, 'fill/image/imageFileURI', uri)` | Fills | Set image data URL |
| `engine.block.setFill(id, fill)` | Fills | Apply fill to block |
| `engine.block.setWidth(id, width)` | Transform | Set QR code width |
| `engine.block.setHeight(id, height)` | Transform | Set QR code height |
| `engine.block.setPositionX(id, x)` | Transform | Set horizontal position |
| `engine.block.setPositionY(id, y)` | Transform | Set vertical position |
| `engine.block.appendChild(parent, child)` | Hierarchy | Add QR code to page |



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support