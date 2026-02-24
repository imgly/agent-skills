> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Partial Export](./export-save-publish/export/partial-export.md)

---

Export individual design elements, grouped blocks, or specific pages from your
scene instead of exporting everything at once using CE.SDK's flexible export
API.

![Partial Export example showing multiple blocks and groups being exported individually](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

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
> - [Live demo](https://img.ly/examples/guides-export-save-publish-export-partial-export-browser/)

Understanding how to export specific parts of your scene gives you fine-grained control over output generation. Instead of exporting an entire scene, you can export individual images, text blocks, shapes, grouped elements, or specific pages. This is essential for creating asset libraries, implementing "export selection" features, or generating multiple outputs from a single design.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-partial-export-browser/browser.ts reference-only
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

/**
 * CE.SDK Plugin: Partial Export Guide
 *
 * This example demonstrates:
 * - Exporting individual design blocks
 * - Exporting grouped elements
 * - Exporting with different formats and options
 * - Understanding block hierarchy in exports
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

    // Create a design scene using CE.SDK cesdk method
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page background to light gray
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Sample image URI for demonstrations
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create design elements for demonstration
    // Create first image block
    const imageBlock1 = await engine.block.addImage(imageUri, {
      size: { width: blockWidth, height: blockHeight }
    });
    engine.block.appendChild(page, imageBlock1);

    // Create second image block with different styling
    const imageBlock2 = await engine.block.addImage(imageUri, {
      size: { width: blockWidth, height: blockHeight },
      cornerRadius: 20
    });
    engine.block.appendChild(page, imageBlock2);

    // Create a shape block
    const shapeBlock = engine.block.create('//ly.img.ubq/graphic');
    const shape = engine.block.createShape('star');
    engine.block.setShape(shapeBlock, shape);
    engine.block.setWidth(shapeBlock, blockWidth);
    engine.block.setHeight(shapeBlock, blockHeight);

    // Add a color fill to the shape
    const shapeFill = engine.block.createFill('color');
    engine.block.setFill(shapeBlock, shapeFill);
    engine.block.setColor(shapeFill, 'fill/color/value', {
      r: 1.0,
      g: 0.7,
      b: 0.0,
      a: 1.0
    });
    engine.block.appendChild(page, shapeBlock);

    // Create two shapes for grouping demonstration
    const groupShape1 = engine.block.create('//ly.img.ubq/graphic');
    const rect = engine.block.createShape('rect');
    engine.block.setShape(groupShape1, rect);
    engine.block.setWidth(groupShape1, blockWidth * 0.4);
    engine.block.setHeight(groupShape1, blockHeight * 0.4);
    const groupFill1 = engine.block.createFill('color');
    engine.block.setFill(groupShape1, groupFill1);
    engine.block.setColor(groupFill1, 'fill/color/value', {
      r: 0.3,
      g: 0.6,
      b: 0.9,
      a: 1.0
    });
    engine.block.appendChild(page, groupShape1);

    const groupShape2 = engine.block.create('//ly.img.ubq/graphic');
    const ellipse = engine.block.createShape('ellipse');
    engine.block.setShape(groupShape2, ellipse);
    engine.block.setWidth(groupShape2, blockWidth * 0.4);
    engine.block.setHeight(groupShape2, blockHeight * 0.4);
    const groupFill2 = engine.block.createFill('color');
    engine.block.setFill(groupShape2, groupFill2);
    engine.block.setColor(groupFill2, 'fill/color/value', {
      r: 0.9,
      g: 0.3,
      b: 0.5,
      a: 1.0
    });
    engine.block.appendChild(page, groupShape2);

    // Group the two shapes together
    const group = engine.block.group([groupShape1, groupShape2]);

    // Position all blocks in grid layout for visualization
    const allBlocks = [
      imageBlock1,
      imageBlock2,
      shapeBlock,
      group,
      groupShape1 // Note: groupShape1 is inside group, positioning group will position children
    ];

    allBlocks.forEach((block, index) => {
      if (index < 6) {
        // Only position first 6 blocks (group contains 2)
        const pos = getPosition(index);
        engine.block.setPositionX(block, pos.x);
        engine.block.setPositionY(block, pos.y);
      }
    });

    // Position grouped shapes relative to group
    const groupPos = getPosition(4);
    engine.block.setPositionX(group, groupPos.x);
    engine.block.setPositionY(group, groupPos.y);
    engine.block.setPositionX(groupShape1, 10);
    engine.block.setPositionY(groupShape1, 10);
    engine.block.setPositionX(groupShape2, 60);
    engine.block.setPositionY(groupShape2, 60);

    // Helper function: Download blob and show notification
    const downloadWithNotification = async (
      blob: Blob,
      filename: string,
      mimeType: string,
      exportType: string
    ) => {
      await cesdk.utils.downloadFile(blob, mimeType as any);

      // Show notification after successful download
      cesdk.ui.showNotification({
        message: `Export "${exportType}" completed`,
        type: 'info',
        duration: 'infinite'
      });
    };

    // Override exportDesign action to export selected block or page
    cesdk.actions.register('exportDesign', async () => {
      // eslint-disable-next-line no-console
      console.log('🚀 Export action triggered');

      const selectedBlocks = engine.block.findAllSelected();
      // eslint-disable-next-line no-console
      console.log(`📦 Selected blocks: ${selectedBlocks.length}`);

      let blockToExport: number;
      if (selectedBlocks.length > 0) {
        // Export first selected block (or group them if multiple)
        blockToExport =
          selectedBlocks.length === 1
            ? selectedBlocks[0]
            : engine.block.group(selectedBlocks);
        // eslint-disable-next-line no-console
        console.log(
          `✅ Exporting selected block(s): ${
            selectedBlocks.length === 1 ? 'single block' : 'grouped blocks'
          }`
        );
      } else {
        // No selection - export current page
        const pages = engine.block.findByType('page');
        blockToExport = pages[0];
        // eslint-disable-next-line no-console
        console.log('📄 No selection - exporting current page');
      }

      // eslint-disable-next-line no-console
      console.log(`📸 Exporting block ID: ${blockToExport}`);

      // Export the block with high compression
      const blob = await engine.block.export(blockToExport, {
        mimeType: 'image/png',
        pngCompressionLevel: 9 // Maximum compression for smaller file size
      });

      // eslint-disable-next-line no-console
      console.log(
        `✨ Export complete - size: ${(blob.size / 1024).toFixed(2)} KB`
      );

      // Download the blob
      await downloadWithNotification(blob, 'export.png', 'image/png', 'Design');

      // eslint-disable-next-line no-console
      console.log('💾 Download complete');
    });

    // Helper function: Export individual block
    const exportIndividualBlock = async () => {
      // eslint-disable-next-line no-console
      console.log('🚀 Starting individual block export...');

      // Show loading dialog before export
      const exportDialog = cesdk.utils.showLoadingDialog({
        title: 'Exporting Block',
        message: 'Processing export...',
        progress: 'indeterminate'
      });

      // Find a specific block to export
      const blockToExport = imageBlock1;

      // Export the block as PNG with high compression and target size
      const individualBlob = await engine.block.export(blockToExport, {
        mimeType: 'image/png',
        pngCompressionLevel: 9, // Maximum compression for smaller file size
        targetWidth: 800, // Limit export resolution for faster exports
        targetHeight: 600
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ Individual block exported - size: ${(
          individualBlob.size / 1024
        ).toFixed(2)} KB`
      );

      // Close the export dialog
      exportDialog.close();

      // Download the exported block
      await downloadWithNotification(
        individualBlob,
        'block-export.png',
        'image/png',
        'Block'
      );
    };

    // Helper function: Create and export a group
    const exportGroupExample = async () => {
      // eslint-disable-next-line no-console
      console.log('🚀 Starting group export...');

      // Show loading dialog before export
      const exportDialog = cesdk.utils.showLoadingDialog({
        title: 'Exporting Group',
        message: 'Processing export...',
        progress: 'indeterminate'
      });

      // Group the blocks together (shapes already created above)
      const exportGroup = engine.block.group([groupShape1, groupShape2]);

      // Export the group (includes all children) with high compression and target size
      const groupBlob = await engine.block.export(exportGroup, {
        mimeType: 'image/png',
        pngCompressionLevel: 9, // Maximum compression for smaller file size
        targetWidth: 800, // Limit export resolution for faster exports
        targetHeight: 600
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ Group exported - size: ${(groupBlob.size / 1024).toFixed(2)} KB`
      );

      // Close the export dialog
      exportDialog.close();

      // Download the exported group
      await downloadWithNotification(
        groupBlob,
        'group-export.png',
        'image/png',
        'Group'
      );
    };

    // Helper function: Export current page
    const exportCurrentPage = async () => {
      // Check export limits before exporting
      const maxExportSize = engine.editor.getMaxExportSize();
      const availableMemory = engine.editor.getAvailableMemory();

      // eslint-disable-next-line no-console
      console.log('🚀 Starting page export...');
      // eslint-disable-next-line no-console
      console.log(
        `📊 Export limits - Max size: ${maxExportSize}px, Available memory: ${availableMemory} bytes`
      );

      // Show loading dialog before export
      const exportDialog = cesdk.utils.showLoadingDialog({
        title: 'Exporting Page',
        message: 'Processing export...',
        progress: 'indeterminate'
      });

      // Export the entire page with high compression and target size
      const pageBlob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 9, // Maximum compression for smaller file size
        targetWidth: 800, // Limit export resolution for faster exports
        targetHeight: 600
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ Page exported - size: ${(pageBlob.size / 1024).toFixed(2)} KB`
      );

      // Close the export dialog
      exportDialog.close();

      // Download the exported page
      await downloadWithNotification(
        pageBlob,
        'page-export.png',
        'image/png',
        'Page'
      );
    };

    // Configure navigation bar layout
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        onClick: async () => await exportCurrentPage(),
        key: 'export-page',
        label: 'Export Page',
        icon: '@imgly/Save',
        variant: 'plain',
        color: 'accent'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: async () => await exportGroupExample(),
        key: 'export-group',
        label: 'Export Group',
        icon: '@imgly/Group',
        color: 'accent'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: async () => await exportIndividualBlock(),
        key: 'export-block',
        label: 'Export Block',
        icon: '@imgly/Image',
        variant: 'plain',
        color: 'accent'
      }
    ]);

    // Show notification to guide users
    cesdk.ui.showNotification({
      message:
        'Use the export buttons on the right to try different export options (Export Page, Export Group, Export Block)',
      type: 'info',
      duration: 'infinite'
    });

    // eslint-disable-next-line no-console
    console.log('Partial export examples initialized successfully');
  }
}

export default Example;
```

This guide covers how to export individual blocks, grouped elements, and pages programmatically using the Block API.

## Understanding Block Hierarchy and Export

### How Block Hierarchy Affects Exports

CE.SDK organizes content in a tree structure: Scene → Pages → Groups → Individual Blocks. When you export a block, the export automatically includes all child elements in the hierarchy.

Exporting a page exports every element on that page. Exporting a group exports all blocks within that group. Exporting an individual block (like an image or text) exports only that specific element.

This hierarchical behavior is powerful because you can control export scope by choosing which level of the hierarchy to target. Want just one image? Export the image block. Want a complete layout section? Export the parent group.

### Export Behavior

The export API applies several transformations to ensure consistent output. If the exported block itself is rotated, it will be exported without that rotation—the content appears upright in the output file. Any margin set on the block is included in the export bounds. Outside strokes are included for most block types, though pages handle strokes differently.

> **Note:** Only blocks that belong to the scene hierarchy can be exported. Orphaned blocks
> (created but not added to the page) cannot be exported until they're attached
> to the scene tree.

## Exporting Individual Blocks

### Finding Blocks to Export

Before exporting, we need to identify which block to export. We can find blocks by type using `findByType`, by name if you've assigned custom names, or by ID if you already have a reference.

Once we have a block reference, exporting is straightforward. Pass the block ID to `engine.block.export()` along with export options like format and quality settings.

### Basic Block Export

Here we export a single image block as PNG with compression settings. The export returns a Blob containing the image data.

```typescript highlight-export-individual-block
      // eslint-disable-next-line no-console
      console.log('🚀 Starting individual block export...');

      // Show loading dialog before export
      const exportDialog = cesdk.utils.showLoadingDialog({
        title: 'Exporting Block',
        message: 'Processing export...',
        progress: 'indeterminate'
      });

      // Find a specific block to export
      const blockToExport = imageBlock1;

      // Export the block as PNG with high compression and target size
      const individualBlob = await engine.block.export(blockToExport, {
        mimeType: 'image/png',
        pngCompressionLevel: 9, // Maximum compression for smaller file size
        targetWidth: 800, // Limit export resolution for faster exports
        targetHeight: 600
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ Individual block exported - size: ${(
          individualBlob.size / 1024
        ).toFixed(2)} KB`
      );

      // Close the export dialog
      exportDialog.close();
```

The `mimeType` determines the output format. CE.SDK supports PNG, JPEG, WEBP, and PDF for static exports. Each format has specific options—PNG uses `pngCompressionLevel`, JPEG uses `jpegQuality`, and WEBP uses `webpQuality`.

Different formats serve different purposes. PNG is ideal for graphics requiring transparency, such as UI elements, logos, or illustrations with alpha channels. JPEG works well for photographs where file size matters and transparency isn't needed. WEBP provides better compression than PNG or JPEG for web delivery. PDF preserves vector information and is suited for print workflows.

JPEG exports drop transparency and replace it with a solid background, which may produce unexpected results if your design relies on transparency. Always consider whether your content needs an alpha channel when choosing export formats.

## Exporting Grouped Elements

### Creating and Exporting Groups

Groups let you export multiple elements together as a single output. This is useful for composite graphics like logos with multiple components, complex illustrations made from many shapes, or layout sections that should be exported as a unit.

```typescript highlight-create-and-export-group
      // eslint-disable-next-line no-console
      console.log('🚀 Starting group export...');

      // Show loading dialog before export
      const exportDialog = cesdk.utils.showLoadingDialog({
        title: 'Exporting Group',
        message: 'Processing export...',
        progress: 'indeterminate'
      });

      // Group the blocks together (shapes already created above)
      const exportGroup = engine.block.group([groupShape1, groupShape2]);

      // Export the group (includes all children) with high compression and target size
      const groupBlob = await engine.block.export(exportGroup, {
        mimeType: 'image/png',
        pngCompressionLevel: 9, // Maximum compression for smaller file size
        targetWidth: 800, // Limit export resolution for faster exports
        targetHeight: 600
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ Group exported - size: ${(groupBlob.size / 1024).toFixed(2)} KB`
      );

      // Close the export dialog
      exportDialog.close();
```

When you export a group, CE.SDK renders all children together into a single image. The group's bounding box determines the export dimensions, and relative positioning between children is preserved exactly as designed.

### Exporting Selected Elements

A common workflow is allowing users to select elements and export their selection. Use `findAllSelected()` to get selected blocks, group them temporarily, and export the group.

```typescript
// Get currently selected blocks
const selectedBlocks = engine.block.findAllSelected();

if (selectedBlocks.length === 0) {
  console.log('No blocks selected');
} else if (selectedBlocks.length === 1) {
  // Export single block directly
  const blob = await engine.block.export(selectedBlocks[0], {
    mimeType: 'image/png'
  });
} else {
  // Group and export multiple selected blocks
  const group = engine.block.group(selectedBlocks);
  const blob = await engine.block.export(group, {
    mimeType: 'image/png'
  });
}
```

This pattern enables "Export Selection" functionality in design tools, letting users export precisely what they've chosen without exporting the entire canvas.

## Exporting Pages

When working with multi-page documents, you often want to export pages individually rather than as a complete scene. Exporting the page block directly gives you output for that specific page.

```typescript highlight-export-current-page
      // Check export limits before exporting
      const maxExportSize = engine.editor.getMaxExportSize();
      const availableMemory = engine.editor.getAvailableMemory();

      // eslint-disable-next-line no-console
      console.log('🚀 Starting page export...');
      // eslint-disable-next-line no-console
      console.log(
        `📊 Export limits - Max size: ${maxExportSize}px, Available memory: ${availableMemory} bytes`
      );

      // Show loading dialog before export
      const exportDialog = cesdk.utils.showLoadingDialog({
        title: 'Exporting Page',
        message: 'Processing export...',
        progress: 'indeterminate'
      });

      // Export the entire page with high compression and target size
      const pageBlob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 9, // Maximum compression for smaller file size
        targetWidth: 800, // Limit export resolution for faster exports
        targetHeight: 600
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ Page exported - size: ${(pageBlob.size / 1024).toFixed(2)} KB`
      );

      // Close the export dialog
      exportDialog.close();
```

Page exports include everything on the page—the background, all content blocks, and any page-level effects. The page dimensions determine the output size unless you specify `targetWidth` and `targetHeight` to override the dimensions.

## Export Options and Configuration

### Target Size Control

Sometimes you need exports at specific dimensions regardless of the block's actual size. The `targetWidth` and `targetHeight` options render the block large enough to fill the target size while maintaining aspect ratio.

If you specify a target size that doesn't match the block's aspect ratio, CE.SDK ensures the block fills the target dimensions completely. The output may extend beyond the target size on one axis to preserve the correct proportions—no stretching or distortion occurs.

### Quality and Compression

Each export format offers quality controls that balance output size against visual fidelity.

For PNG, `pngCompressionLevel` ranges from 0 (no compression, fastest) to 9 (maximum compression, slowest). Higher compression takes longer but produces smaller files without affecting image quality—PNG is lossless.

JPEG `jpegQuality` ranges from 0 (lowest quality) to 1 (highest quality). Lower values create smaller files but introduce visible artifacts. Values above 0.9 provide excellent quality for most use cases.

WEBP `webpQuality` also ranges from 0 to 1. A value of 1.0 triggers a special lossless mode that often produces smaller files than equivalent PNG exports.

### Export Size Limits

Before exporting large blocks or requesting high target dimensions, check the platform's export capabilities. `getMaxExportSize()` returns the maximum width or height in pixels that can be exported. Both the width and height of your export must be below or equal to this limit. However, memory constraints may prevent exports that technically fit within size limits—use `getAvailableMemory()` to assess available memory before attempting large exports.

## Export Limitations and Considerations

### Format-Specific Constraints

JPEG drops transparency from the final image, replacing transparent pixels with a solid background (usually white or black depending on implementation). This can cause unexpected results when exporting designs that rely on alpha channels. Always use PNG or WEBP if transparency is required.

PDF export behavior depends on the `exportPdfWithHighCompatibility` option. When set to `true`, images and effects are rasterized according to the scene's DPI setting for broader viewer compatibility. When `false`, PDFs export faster by embedding images directly, but gradients with transparency may not render correctly in Safari or macOS Preview. See the [PDF export guide](./export-save-publish/export/to-pdf.md) for detailed performance guidance.

### Performance Considerations

Exporting is a synchronous operation that blocks the main thread while rendering. For large exports or multiple sequential exports, provide user feedback like progress indicators to prevent the interface from appearing frozen.

Batch exports can be optimized by processing blocks in parallel where possible, though be mindful of memory constraints. Exporting dozens of high-resolution images simultaneously may exhaust available memory. Consider batching in smaller groups with delays between batches.

### Hierarchy Requirements

Only blocks attached to the scene hierarchy can be exported. If you create a block but don't append it to a page, export will fail. Always ensure blocks are children of the page (or nested within groups that are children of the page) before attempting export.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.export()` | Export a block with specified format and quality options |
| `engine.block.findByType()` | Find blocks by type identifier |
| `engine.block.group()` | Group multiple blocks into a single logical unit |
| `engine.scene.getPages()` | Get all pages in the current scene |
| `engine.editor.getMaxExportSize()` | Get maximum export dimension in pixels |
| `engine.editor.getAvailableMemory()` | Get available engine memory in bytes |



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support