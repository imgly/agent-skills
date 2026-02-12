> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Conversion](./conversion.md) > [To PDF](./conversion/to-pdf.md)

---

The CE.SDK allows you to convert JPEG, PNG, WebP, BMP and SVG images into PDFs directly in the browser—no server-side processing required. You can perform this conversion programmatically or through the user interface.

![To PDF](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-conversion-to-pdf-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-conversion-to-pdf-browser)
>
> - [Live demo](https://img.ly/examples/guides-conversion-to-pdf-browser/)

The CE.SDK supports converting single or multiple images to PDF while allowing transformations such as cropping, rotating, and adding text before exporting. You can also customize PDF output settings, including resolution, compatibility and underlayer.

```typescript file=@cesdk_web_examples/guides-conversion-to-pdf-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: To PDF Guide
 *
 * This example demonstrates:
 * - Exporting designs as PDF documents
 * - Configuring PDF output settings (DPI, compatibility, underlayer)
 * - Adding a custom PDF export button to the navigation bar
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) throw new Error('CE.SDK instance is required');

    const engine = cesdk.engine;

    // Load a template scene
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage()!;
    await engine.scene.zoomToBlock(page);

    // Add PDF export buttons to the navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-pdf',
          label: 'PDF',
          icon: '@imgly/Download',
          onClick: async () => {
            // Export scene as PDF (includes all pages)
            const scene = engine.scene.get()!;
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf'
            });

            // Download using CE.SDK utils
            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');

            cesdk.ui.showNotification({
              message: 'PDF exported successfully',
              type: 'success'
            });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-high-compat',
          label: 'High Compat',
          icon: '@imgly/Download',
          onClick: async () => {
            const scene = engine.scene.get()!;

            // Enable high compatibility mode for consistent rendering across PDF viewers
            // This rasterizes complex elements like gradients with transparency at scene DPI
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf',
              exportPdfWithHighCompatibility: true
            });

            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
            cesdk.ui.showNotification({
              message: 'High compatibility PDF exported',
              type: 'success'
            });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-underlayer',
          label: 'Underlayer',
          icon: '@imgly/Download',
          onClick: async () => {
            const scene = engine.scene.get()!;

            // Define the underlayer spot color before export
            // RGB values (0.8, 0.8, 0.8) provide a preview representation
            engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

            // Export with underlayer for special media printing
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf',
              exportPdfWithHighCompatibility: true,
              exportPdfWithUnderlayer: true,
              underlayerSpotColorName: 'RDG_WHITE',
              // Negative offset shrinks underlayer to prevent visible edges
              underlayerOffset: -2.0
            });

            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
            cesdk.ui.showNotification({
              message: 'PDF with underlayer exported',
              type: 'success'
            });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-dpi',
          label: 'Custom DPI',
          icon: '@imgly/Download',
          onClick: async () => {
            const scene = engine.scene.get()!;

            // Adjust the scene DPI for print-ready output
            // Higher DPI = better quality but larger file size
            engine.block.setFloat(scene, 'scene/dpi', 150);

            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf'
            });

            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
            cesdk.ui.showNotification({
              message: 'PDF exported at 150 DPI',
              type: 'success'
            });
          }
        }
      ]
    });
  }
}

export default Example;
```

This guide covers exporting designs as PDF documents, configuring output settings like DPI and compatibility, adding underlayers for specialty printing, and integrating PDF export into the user interface.

## Convert to PDF Programmatically

You can use the CE.SDK to load an image, apply basic edits, and export it as a PDF programmatically. The following examples demonstrate how to convert a single image and how to merge multiple images into a single PDF.

### Convert a Single Image to PDF

The example below loads an image, applies transformations, and exports it as a PDF.

```ts
// Prepare an image URL
const imageURL = 'https://img.ly/static/ubq_samples/sample_4.jpg';

// Create a new scene by loading the image immediately
await cesdk.createFromImage(imageURL);

// Find the automatically added graphic block with an image fill
const block = engine.block.findByType('graphic')[0];

// Apply crop with a scale ratio of 2.0
engine.block.setCropScaleRatio(block, 2.0);

// Export as PDF Blob
const page = engine.scene.getCurrentPage()!;
const blob = await engine.block.export(page, { mimeType: 'application/pdf' });
// You can now save it or display it in your application
```

### Combine Multiple Images into a Single PDF

The example below demonstrates how to merge multiple images into a single PDF document.

```ts
// Prepare image URLs
const images = [
  'https://img.ly/static/ubq_samples/sample_1.jpg',
  'https://img.ly/static/ubq_samples/sample_2.jpg',
  'https://img.ly/static/ubq_samples/sample_3.jpg',
];

// Create an empty scene with a 'VerticalStack' layout
const scene = engine.scene.create('VerticalStack');
const [stack] = engine.block.findByType('stack');

// Load all images as pages
for (const image of images) {
  // Append the new page to the stack
  const page = engine.block.create('page');
  engine.block.appendChild(stack, page);
  // Set the image as the fill of the page
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', image);
  engine.block.setFill(page, imageFill);
}

// Export all images as a single PDF blob
const blob = await engine.block.export(scene, { mimeType: 'application/pdf' });
// You can now save it or display it in your application
```

## Export a Page as PDF

Use `engine.block.export()` to export a design block as a PDF. The method accepts a block ID and export options including the MIME type.

```typescript highlight=highlight-export-pdf
// Export scene as PDF (includes all pages)
const scene = engine.scene.get()!;
const pdfBlob = await engine.block.export(scene, {
  mimeType: 'application/pdf'
});
```

Export returns a Blob containing the PDF data. You can export a single page for a single-page PDF, or export the entire scene to include all pages in a multi-page PDF document.

## Download the PDF

Use `cesdk.utils.downloadFile()` to save the exported PDF to the user's device.

```typescript highlight=highlight-download
// Download using CE.SDK utils
await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
```

The utility handles creating a download link and triggering the browser's save dialog with the appropriate file extension.

## PDF Conversion via the User Interface

The CE.SDK allows you to enable PDF conversion directly from the user interface. You can customize the UI to include a "Convert to PDF" button, allowing users to trigger conversion to PDF after they [upload images](./insert-media/images.md) and perform any edits or adjustments.

### Add a PDF Export Button

Integrate PDF export into the CE.SDK interface by adding a custom button to the navigation bar.

```typescript highlight=highlight-export-button
    // Add PDF export buttons to the navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-pdf',
          label: 'PDF',
          icon: '@imgly/Download',
          onClick: async () => {
            // Export scene as PDF (includes all pages)
            const scene = engine.scene.get()!;
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf'
            });

            // Download using CE.SDK utils
            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');

            cesdk.ui.showNotification({
              message: 'PDF exported successfully',
              type: 'success'
            });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-high-compat',
          label: 'High Compat',
          icon: '@imgly/Download',
          onClick: async () => {
            const scene = engine.scene.get()!;

            // Enable high compatibility mode for consistent rendering across PDF viewers
            // This rasterizes complex elements like gradients with transparency at scene DPI
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf',
              exportPdfWithHighCompatibility: true
            });

            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
            cesdk.ui.showNotification({
              message: 'High compatibility PDF exported',
              type: 'success'
            });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-underlayer',
          label: 'Underlayer',
          icon: '@imgly/Download',
          onClick: async () => {
            const scene = engine.scene.get()!;

            // Define the underlayer spot color before export
            // RGB values (0.8, 0.8, 0.8) provide a preview representation
            engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

            // Export with underlayer for special media printing
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf',
              exportPdfWithHighCompatibility: true,
              exportPdfWithUnderlayer: true,
              underlayerSpotColorName: 'RDG_WHITE',
              // Negative offset shrinks underlayer to prevent visible edges
              underlayerOffset: -2.0
            });

            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
            cesdk.ui.showNotification({
              message: 'PDF with underlayer exported',
              type: 'success'
            });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-dpi',
          label: 'Custom DPI',
          icon: '@imgly/Download',
          onClick: async () => {
            const scene = engine.scene.get()!;

            // Adjust the scene DPI for print-ready output
            // Higher DPI = better quality but larger file size
            engine.block.setFloat(scene, 'scene/dpi', 150);

            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf'
            });

            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
            cesdk.ui.showNotification({
              message: 'PDF exported at 150 DPI',
              type: 'success'
            });
          }
        }
      ]
    });
```

The button triggers the export workflow when clicked, providing users with a convenient way to download their designs as PDF documents.

### Alternative: Register a Custom Component

You can also use `ui.registerComponent` to create a more customized button with full control over styling and behavior.

```ts
// Register a custom button component
cesdk.ui.registerComponent(
  'convert.nav',
  ({ builder: { Button }, engine }) => {
    Button('convert-to-pdf', {
      label: 'Convert To PDF',
      icon: '@imgly/Download',
      color: 'accent',
      onClick: async () => {
        // Export the current scene as a PDF blob
        const scene = engine.scene.get()!;
        const blob = await engine.block.export(scene, {
          mimeType: 'application/pdf',
        });
        // Trigger download of the PDF blob
        const element = document.createElement('a');
        element.setAttribute('href', window.URL.createObjectURL(blob));
        element.setAttribute('download', 'converted.pdf');
        element.style.display = 'none';
        element.click();
        element.remove();
      },
    });
  },
);

// Add the custom button at the end of the navigation bar
cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
  ...cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' }),
  'convert.nav',
]);
```

For more details on customizing the UI, see the [User Interface Configuration Guide](./user-interface/customization.md).

## Configure PDF Output Settings

The SDK provides various options for customizing PDF exports. You can control resolution, compatibility, and underlayer settings.

### Available PDF Output Settings

- **Resolution:** Adjust the DPI (dots per inch) to create print-ready PDFs with the desired level of detail.
- **Page Size:** Define custom dimensions in pixels for the output PDF. If specified, the block will scale to fully cover the target size while maintaining its aspect ratio.
- **Compatibility:** Enable this setting to improve compatibility with various PDF viewers. When enabled, images and effects are rasterized based on the scene's DPI instead of being embedded as vector elements.
- **Underlayer:** Add an underlayer beneath the image content to optimize printing on non-white or specialty media (e.g., fabric, glass). The ink type is defined in `ExportOptions` using a spot color. You can also apply a positive or negative offset, in design units, to adjust the underlayer's scale.

### Adjust DPI for Print Quality

Control the output resolution by setting the scene's DPI property before export.

```typescript highlight=highlight-dpi
// Adjust the scene DPI for print-ready output
// Higher DPI = better quality but larger file size
engine.block.setFloat(scene, 'scene/dpi', 150);
```

Higher DPI values produce better quality output but result in larger file sizes. The default is 300 DPI, which is suitable for most print applications.

### Enable High Compatibility Mode

Enable high compatibility mode for consistent rendering across different PDF viewers.

```typescript highlight=highlight-high-compatibility
// Enable high compatibility mode for consistent rendering across PDF viewers
// This rasterizes complex elements like gradients with transparency at scene DPI
const pdfBlob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true
});
```

When enabled, complex elements like gradients with transparency are rasterized at the scene's DPI setting instead of being embedded as native PDF objects. This ensures consistent appearance in viewers like Safari and macOS Preview but increases file size.

### PDF Performance Optimization

The `exportPdfWithHighCompatibility` flag significantly impacts PDF export performance, especially for high-DPI content:

**When `true` (default - safer but slower):**

- Rasterizes images and gradients at the scene's DPI setting
- Maximum compatibility with all PDF viewers including Safari and macOS Preview
- Slower performance (4-10x slower for high-DPI content)
- Larger file sizes

**When `false` (faster but needs testing):**

- Embeds images and gradients directly as native PDF objects
- 6-15x faster export performance for high-DPI content
- Smaller file sizes (typically 30-40% reduction)
- May have rendering issues in Safari/macOS Preview with gradients that use transparency

```typescript
const scene = engine.scene.get()!;

// For maximum performance (test with your print workflow first)
engine.block.setFloat(scene, 'scene/dpi', 150); // Reduce from default 300
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: false, // Much faster
});
```

**Before using `exportPdfWithHighCompatibility: false` in production:**

- Test generated PDFs with your actual print vendor/equipment
- Verify rendering in Safari and macOS Preview if end-users will view PDFs in those applications
- Check that gradients with transparency render correctly
- Confirm your content renders properly in Adobe Acrobat and Chrome (these typically work fine)

**Safe to use `false` when:**

- PDFs go directly to professional printing (not viewed in Safari/Preview)
- Content is primarily photos and solid colors (minimal gradients with transparency)
- Performance is critical for batch processing workflows

**Keep `true` when:**

- Users view PDFs in Safari or macOS Preview
- Maximum compatibility is required
- Content has complex gradients with transparency
- You cannot test with your print workflow before production

### Add an Underlayer for Specialty Printing

Add an underlayer for printing on non-white or transparent media like fabric or glass.

```typescript highlight=highlight-spot-color
// Define the underlayer spot color before export
// RGB values (0.8, 0.8, 0.8) provide a preview representation
engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);
```

First define the spot color that will be used for the underlayer. The RGB values provide a preview representation in the editor.

```typescript highlight=highlight-underlayer
// Export with underlayer for special media printing
const pdfBlob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true,
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: 'RDG_WHITE',
  // Negative offset shrinks underlayer to prevent visible edges
  underlayerOffset: -2.0
});
```

The underlayer creates a solid background behind your design content. The negative offset shrinks the underlayer slightly to prevent visible edges around the printed output.

### Customizing PDF Output

You can configure all PDF settings together when exporting.

```ts
const scene = engine.scene.get()!;

// Adjust the DPI to 72
engine.block.setFloat(scene, 'scene/dpi', 72);

// Set spot color to be used as underlayer
engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  // Set target width and height in pixels
  targetWidth: 800,
  targetHeight: 600,
  // Increase compatibility with different PDF viewers
  exportPdfWithHighCompatibility: true,
  // Add an underlayer beneath the image content
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: 'RDG_WHITE',
  underlayerOffset: -2.0,
});
```

## Troubleshooting

**PDF file size too large** — Reduce the scene DPI or disable high compatibility mode. Use JPEG compression for embedded images where quality loss is acceptable.

**Gradients look different in some viewers** — Enable `exportPdfWithHighCompatibility` to rasterize gradients at the scene's DPI setting for consistent appearance across all PDF viewers.

**Underlayer not visible in print** — Verify the spot color name matches your print vendor's configuration exactly. Check that the PDF wasn't flattened during post-processing.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.export(block, options)` | Export a block to a Blob with format options (`mimeType`, `exportPdfWithHighCompatibility`, `exportPdfWithUnderlayer`, `underlayerSpotColorName`, `underlayerOffset`, `targetWidth`, `targetHeight`) |
| `engine.block.setFloat(block, property, value)` | Set a float property on a block (use `scene/dpi` to control PDF resolution) |
| `engine.editor.setSpotColorRGB(name, r, g, b)` | Define a spot color for underlayer printing |
| `engine.scene.get()` | Get the current scene block ID |
| `engine.scene.getCurrentPage()` | Get the currently active page block |
| `cesdk.utils.downloadFile(blob, mimeType)` | Download a Blob as a file |

## Next Steps

- [Export Options](./export-save-publish/export/overview.md) — Explore all available export formats and configuration
- [Size Limits](./export-save-publish/export/size-limits.md) — Handle large exports and memory constraints
- [Export for Printing](./export-save-publish/for-printing.md) — Learn more about print-specific export settings



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support