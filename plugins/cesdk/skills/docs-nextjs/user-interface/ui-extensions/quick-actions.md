> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [UI Extensions](./user-interface/ui-extensions.md) > [Quick Actions](./user-interface/ui-extensions/quick-actions.md)

---

Extend CE.SDK with one-click editing actions using official plugins for background removal, vectorization, QR codes, and cutouts.

![Quick Actions example showing background removal, vectorize, and cutout buttons](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ui-extensions-quick-actions-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ui-extensions-quick-actions-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-ui-extensions-quick-actions-browser/)

Quick actions are single-click operations that appear in the canvas menu when users select a block. CE.SDK provides official plugins that add image processing capabilities like background removal, vectorization, and QR code generation. These plugins integrate directly with the editor UI and execute their operations immediately when clicked.

```typescript file=@cesdk_web_examples/guides-user-interface-ui-extensions-quick-actions-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal-web';
import VectorizerPlugin from '@imgly/plugin-vectorizer-web';
import CutoutLibraryPlugin from '@imgly/plugin-cutout-library-web';
import QRCodePlugin from '@imgly/plugin-qr-code-web';

export default class QuickActionsExample implements EditorPlugin {
  name = 'QuickActionsExample';
  version = '1.0.0';

  async initialize({ cesdk }: EditorPluginContext) {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Add background removal plugin with canvas menu button
    await cesdk.addPlugin(
      BackgroundRemovalPlugin({
        ui: {
          locations: ['canvasMenu']
        }
      })
    );

    // Add vectorizer plugin with canvas menu button
    await cesdk.addPlugin(
      VectorizerPlugin({
        ui: {
          locations: 'canvasMenu'
        }
      })
    );

    // Add cutout library plugin for print workflows (dock only, no canvas menu)
    await cesdk.addPlugin(CutoutLibraryPlugin());

    // Add cutout library to the dock for easy access
    const cutoutAssetEntry = cesdk.ui.getAssetLibraryEntry('ly.img.cutout.entry');
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      {
        id: 'ly.img.assetLibrary.dock',
        label: 'Cutout',
        key: 'ly.img.assetLibrary.dock',
        icon: cutoutAssetEntry?.icon,
        entries: ['ly.img.cutout.entry']
      },
    ]);

    // Add QR code plugin (adds canvas menu button automatically)
    await cesdk.addPlugin(QRCodePlugin());

    // Add QR code generator to the dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      'ly.img.generate-qr.dock'
    ]);

    // Create scene with gradient background and text
    await cesdk.createDesignScene();

    const page = engine.block.findByType('page')[0];
    const pageWidth = 800;
    const pageHeight = 600;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Add gradient background to the page
    const pageFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(pageFill, 'fill/gradient/colors', [
      { stop: 0, color: { r: 0.18, g: 0.1, b: 0.4, a: 1 } },
      { stop: 1, color: { r: 0.55, g: 0.25, b: 0.6, a: 1 } }
    ]);
    engine.block.setFloat(pageFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(pageFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(pageFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(pageFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, pageFill);

    // Add main title text with auto height
    const titleBlock = engine.block.create('text');
    engine.block.setString(titleBlock, 'text/text', 'Explore Quick Actions');
    engine.block.setFloat(titleBlock, 'text/fontSize', 100);
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleBlock, pageWidth);
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);

    // Set title text color to white
    engine.block.setTextColor(titleBlock, { r: 1, g: 1, b: 1, a: 1 });

    // Add subtitle text with auto height
    const subtitleBlock = engine.block.create('text');
    engine.block.setString(subtitleBlock, 'text/text', 'IMG.LY');
    engine.block.setFloat(subtitleBlock, 'text/fontSize', 64);
    engine.block.setEnum(subtitleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(subtitleBlock, pageWidth);
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.appendChild(page, subtitleBlock);

    // Set subtitle text color to white
    engine.block.setTextColor(subtitleBlock, { r: 1, g: 1, b: 1, a: 1 });

    // Add a sample image to demonstrate quick actions
    const imageBlock = engine.block.create('graphic');

    // Set shape for the graphic block
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    // Set image fill
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    const imageSize = 250;
    engine.block.setWidth(imageBlock, imageSize);
    engine.block.setHeight(imageBlock, imageSize);
    engine.block.appendChild(page, imageBlock);

    // Position all elements - text at top, image below
    const titleHeight = engine.block.getFrameHeight(titleBlock);
    const subtitleHeight = engine.block.getFrameHeight(subtitleBlock);
    const textSpacing = 10;
    const imageGap = 80;

    // Position content vertically centered with offset
    const totalHeight =
      titleHeight + textSpacing + subtitleHeight + imageGap + imageSize;
    const startY = (pageHeight - totalHeight) / 2 + 40;

    engine.block.setPositionX(titleBlock, 0);
    engine.block.setPositionY(titleBlock, startY);
    engine.block.setPositionX(subtitleBlock, 0);
    engine.block.setPositionY(subtitleBlock, startY + titleHeight + textSpacing);
    engine.block.setPositionX(imageBlock, (pageWidth - imageSize) / 2);
    engine.block.setPositionY(
      imageBlock,
      startY + titleHeight + textSpacing + subtitleHeight + imageGap
    );

    // Select the image to show the canvas menu with quick actions
    engine.block.select(imageBlock);

    // Open the cutout library panel
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.cutout.entry'],
        title: 'Cutout'
      }
    });
  }
}
```

This guide demonstrates how to install and configure quick action plugins, add asset libraries to the dock, and optimize plugin loading for production use.

## Plugin Overview

This guide covers four official plugins that extend CE.SDK with quick actions:

| Plugin | Use Case |
|--------|----------|
| Background Removal | Remove backgrounds from product photos |
| Vectorizer | Convert logos to scalable vectors |
| QR Code | Generate trackable QR codes for marketing |
| Cutout Library | Add die-cut shapes for print production |

## Adding Quick Action Plugins

Each plugin adds a button to the canvas menu that appears when users select compatible blocks. Install the plugin package, then call `cesdk.addPlugin()` to register it with the editor.

### Installing the Plugins

The background removal plugin requires `onnxruntime-web` for its machine learning model. The vectorizer and QR code plugins have no additional dependencies.

<Tabs>
  <TabItem label="npm">
    ```sh
    npm install @imgly/plugin-background-removal-web @imgly/plugin-vectorizer-web @imgly/plugin-qr-code-web onnxruntime-web@1.21.0
    ```
  </TabItem>

  <TabItem label="yarn">
    ```sh
    yarn add @imgly/plugin-background-removal-web @imgly/plugin-vectorizer-web @imgly/plugin-qr-code-web onnxruntime-web@1.21.0
    ```
  </TabItem>

  <TabItem label="pnpm">
    ```sh
    pnpm add @imgly/plugin-background-removal-web @imgly/plugin-vectorizer-web @imgly/plugin-qr-code-web onnxruntime-web@1.21.0
    ```
  </TabItem>
</Tabs>

### Background Removal

Removes backgrounds from images using AI-powered segmentation. Runs entirely in-browser via WebAssembly.

```typescript highlight=highlight-add-bg-removal
// Add background removal plugin with canvas menu button
await cesdk.addPlugin(
  BackgroundRemovalPlugin({
    ui: {
      locations: ['canvasMenu']
    }
  })
);
```

> **Note:** See the [Remove Background](./edit-image/remove-bg.md) guide for model selection and performance tuning.

### Vectorization

Converts raster images to scalable vector graphics. Useful for logos and illustrations that need to scale without quality loss.

```typescript highlight=highlight-add-vectorizer
// Add vectorizer plugin with canvas menu button
await cesdk.addPlugin(
  VectorizerPlugin({
    ui: {
      locations: 'canvasMenu'
    }
  })
);
```

> **Note:** See the [Vectorize](./edit-image/vectorize.md) guide for timeout and grouping threshold settings.

### QR Code Generation

Generates QR codes with customizable content and styling.

```sh
npm install @imgly/plugin-qr-code-web
```

Register the plugin:

```typescript highlight=highlight-add-qr-code
// Add QR code plugin (adds canvas menu button automatically)
await cesdk.addPlugin(QRCodePlugin());
```

Add the generator panel to the dock for creating new codes:

```typescript highlight=highlight-qr-dock
// Add QR code generator to the dock
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
  'ly.img.spacer',
  'ly.img.generate-qr.dock'
]);
```

## Adding Cutout Library to Dock

Provides die-cut shapes for print production workflows like stickers, packaging, and labels.

```sh
npm install @imgly/plugin-cutout-library-web
```

Register the plugin to load the cutout asset source:

```typescript highlight=highlight-add-cutout
// Add cutout library plugin for print workflows (dock only, no canvas menu)
await cesdk.addPlugin(CutoutLibraryPlugin());
```

Add the library to the dock using `setComponentOrder()` with the entry's icon from `getAssetLibraryEntry()`:

```typescript highlight=highlight-cutout-dock
// Add cutout library to the dock for easy access
const cutoutAssetEntry = cesdk.ui.getAssetLibraryEntry('ly.img.cutout.entry');
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
  {
    id: 'ly.img.assetLibrary.dock',
    label: 'Cutout',
    key: 'ly.img.assetLibrary.dock',
    icon: cutoutAssetEntry?.icon,
    entries: ['ly.img.cutout.entry']
  },
]);
```

Users can add rectangular or elliptical cutouts, or create custom shapes from paths. Cutout boundaries export as die-cut lines in PDF output.

## Performance Best Practices

Plugins that use machine learning models download their model files on first use. Consider these optimizations when adding multiple plugins:

- **Lazy load plugins** - Use dynamic `import()` to defer loading until the user needs the feature. This reduces initial bundle size and speeds up editor startup.
- **Preload models during idle time** - Call `requestIdleCallback()` to initialize plugins after the editor renders. The models cache locally for subsequent operations.
- **Register plugins in priority order** - The canvas menu displays buttons in registration order. Add frequently-used plugins first so their buttons appear in prominent positions.
- **Track initialization state** - Maintain a boolean flag to prevent adding the same plugin multiple times if your initialization code can run more than once.

## Troubleshooting

**Canvas menu button missing** - Verify that `addPlugin()` completes before the scene loads. Plugins register their UI components during initialization.

**Background removal slow on first use** - The plugin downloads approximately 30MB of model data on first use. Subsequent operations use the cached model.

**Cutout shapes not appearing in export** - Cutout paths only render in PDF exports. Check that your export configuration includes the PDF format.

**Dock entry not visible** - Ensure `setComponentOrder()` runs after the plugin initializes. The asset library entry must exist before it can be added to the dock.

## API Reference

| Method | Description |
|--------|-------------|
| `cesdk.addPlugin(plugin)` | Registers a plugin and runs its initialization |
| `cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, order)` | Sets which components appear in the dock sidebar |
| `cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })` | Returns the current dock component configuration |
| `cesdk.ui.getAssetLibraryEntry(id)` | Retrieves an asset library entry by its ID |
| `cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, order)` | Sets which components appear in the canvas menu |
| `cesdk.ui.getComponentOrder({ in: 'ly.img.canvas.menu' })` | Returns the current canvas menu configuration |

## Next Steps

- [Remove Background](./edit-image/remove-bg.md) - Configure background removal model and processing options
- [Vectorize](./edit-image/vectorize.md) - Adjust vectorization accuracy and performance settings
- [Add a Custom Panel](./user-interface/ui-extensions/create-custom-panel.md) - Build panels for operations that need configuration
- [Register a New Component](./user-interface/ui-extensions/register-new-component.md) - Create custom UI components for the canvas menu
- [Add a Custom Feature](./user-interface/ui-extensions/add-custom-feature.md) - Package functionality into reusable plugins



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support