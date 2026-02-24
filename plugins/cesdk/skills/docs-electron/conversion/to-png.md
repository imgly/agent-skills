> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Conversion](./conversion.md) > [To PNG](./conversion/to-png.md)

---

Export designs to PNG format with lossless quality and optional transparency support.

![Export to PNG example showing CE.SDK with PNG export buttons](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-conversion-to-png-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-conversion-to-png-browser)
>
> - [Live demo](https://img.ly/examples/guides-conversion-to-png-browser/)

PNG is a lossless image format that preserves image quality and supports transparency. It's ideal for designs requiring pixel-perfect fidelity, logos, graphics with transparent backgrounds, and any content where quality cannot be compromised.

```typescript file=@cesdk_web_examples/guides-conversion-to-png-browser/browser.ts reference-only
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

    const engine = cesdk.engine;

    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');
    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Export programmatically using the engine API
    const exportProgrammatically = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png'
      });
      await cesdk.utils.downloadFile(blob, 'image/png');
    };

    // Export with compression level (0-9)
    // Higher values produce smaller files but take longer
    const exportWithCompression = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 9
      });
      await cesdk.utils.downloadFile(blob, 'image/png');
    };

    // Export with target dimensions
    // The block scales to fill the target while maintaining aspect ratio
    const exportWithDimensions = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      await cesdk.utils.downloadFile(blob, 'image/png');
    };

    // Trigger the built-in export action
    const triggerExportAction = async () => {
      await cesdk.actions.run('exportDesign', {
        mimeType: 'image/png'
      });
    };

    // Override the default export action to customize behavior
    cesdk.actions.register('exportDesign', async (options) => {
      // Use the utils API to export with a loading dialog
      const { blobs, options: exportOptions } =
        await cesdk.utils.export(options);

      // Custom logic: log the export details
      console.log(
        `Exported ${blobs.length} file(s) as ${exportOptions.mimeType}`
      );

      // Download the exported file
      await cesdk.utils.downloadFile(blobs[0], exportOptions.mimeType);
    });

    // Add export dropdown to navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-png',
          label: 'Export PNG',
          icon: '@imgly/Save',
          onClick: exportProgrammatically
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-png-action',
          label: 'Export PNG (action)',
          icon: '@imgly/Save',
          onClick: triggerExportAction
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-png-compressed',
          label: 'Export PNG (compressed)',
          icon: '@imgly/Save',
          onClick: exportWithCompression
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-png-hd',
          label: 'Export PNG (HD)',
          icon: '@imgly/Save',
          onClick: exportWithDimensions
        }
      ]
    });
  }
}

export default Example;
```

This guide covers how to export designs to PNG, configure export options, and integrate with the built-in export action.

## Export to PNG

Use `engine.block.export()` to export a design block to PNG. The method returns a Blob containing the image data.

```typescript highlight=highlight-export-programmatic
// Export programmatically using the engine API
const exportProgrammatically = async () => {
  const blob = await engine.block.export(page, {
    mimeType: 'image/png'
  });
  await cesdk.utils.downloadFile(blob, 'image/png');
};
```

## Compression Level

Control the file size versus export speed tradeoff using `pngCompressionLevel`. Valid values are 0-9, where higher values produce smaller files but take longer to export. Since PNG is lossless, image quality remains unchanged.

```typescript highlight=highlight-options-compression
// Export with compression level (0-9)
// Higher values produce smaller files but take longer
const exportWithCompression = async () => {
  const blob = await engine.block.export(page, {
    mimeType: 'image/png',
    pngCompressionLevel: 9
  });
  await cesdk.utils.downloadFile(blob, 'image/png');
};
```

The default compression level is 5, providing a good balance between file size and export speed.

## Target Dimensions

Resize the output by setting `targetWidth` and `targetHeight`. The block scales to fill the target dimensions while maintaining its aspect ratio.

```typescript highlight=highlight-options-dimensions
// Export with target dimensions
// The block scales to fill the target while maintaining aspect ratio
const exportWithDimensions = async () => {
  const blob = await engine.block.export(page, {
    mimeType: 'image/png',
    targetWidth: 1920,
    targetHeight: 1080
  });
  await cesdk.utils.downloadFile(blob, 'image/png');
};
```

## Trigger the Export Action

The built-in `exportDesign` action triggers the default export workflow with a loading dialog and automatically downloads the file.

```typescript highlight=highlight-export-action
// Trigger the built-in export action
const triggerExportAction = async () => {
  await cesdk.actions.run('exportDesign', {
    mimeType: 'image/png'
  });
};
```

## Override the Export Action

Register a custom handler for the `exportDesign` action to customize behavior. This allows you to add custom logic such as uploading to a server or processing the exported file.

```typescript highlight=highlight-override-action
    // Override the default export action to customize behavior
    cesdk.actions.register('exportDesign', async (options) => {
      // Use the utils API to export with a loading dialog
      const { blobs, options: exportOptions } =
        await cesdk.utils.export(options);

      // Custom logic: log the export details
      console.log(
        `Exported ${blobs.length} file(s) as ${exportOptions.mimeType}`
      );

      // Download the exported file
      await cesdk.utils.downloadFile(blobs[0], exportOptions.mimeType);
    });
```

The `cesdk.utils.export()` method handles the export with a loading dialog, while `cesdk.utils.downloadFile()` triggers the browser download.

## API Reference

| API | Description |
| --- | --- |
| `engine.block.export(block, options)` | Exports a block to a Blob with the specified options |
| `cesdk.actions.run('exportDesign', options)` | Triggers the default export workflow |
| `cesdk.actions.register('exportDesign', handler)` | Overrides the default export action |
| `cesdk.utils.export(options)` | Exports with a loading dialog, returns `{ blobs, options }` |
| `cesdk.utils.downloadFile(blob, mimeType)` | Downloads a Blob as a file |

## Next Steps

- [Conversion Overview](./conversion/overview.md) - Learn about other export formats
- [Export Overview](./export-save-publish/export/overview.md) - Understand the full export workflow
- [To PDF](./conversion/to-pdf.md) - Export designs to PDF format



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support