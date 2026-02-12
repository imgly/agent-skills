> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [For Printing](./export-save-publish/for-printing.md)

---

Export print-ready PDFs from CE.SDK with options for high compatibility mode,
underlayers for special media like fabric or glass, and configurable output
resolution.

![Export for Printing example showing PDF export options](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-for-printing-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-for-printing-browser)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-for-printing-browser/)

CE.SDK exports designs as PDFs, but professional print workflows require specific configurations beyond standard export. This guide covers PDF export options for print, including high compatibility mode for complex designs, underlayers for printing on special media, and output resolution settings.

```typescript file=@cesdk_web_examples/guides-export-save-publish-for-printing-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Export for Printing Guide
 *
 * This example demonstrates:
 * - Exporting designs as print-ready PDFs
 * - Configuring high compatibility mode for complex designs
 * - Generating underlayers for special media (DTF, fabric, glass)
 * - Setting scene DPI for print resolution
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load a template scene - this will be our print design
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Get the scene and page
    const scene = engine.scene.get();
    if (!scene) {
      throw new Error('No scene found');
    }
    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Set print resolution (DPI) on the scene
    // 300 DPI is standard for high-quality print output
    engine.block.setFloat(scene, 'scene/dpi', 300);

    // Helper function to download blob
    const downloadBlob = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    };

    // Export PDF with high compatibility mode
    const exportWithHighCompatibility = async () => {
      // Enable high compatibility mode for consistent rendering across PDF viewers
      // This rasterizes complex elements like gradients with transparency at the scene's DPI
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: true
      });

      downloadBlob(pdfBlob, 'print-high-compatibility.pdf');
      cesdk.ui.showNotification({
        message: `PDF exported with high compatibility (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export PDF without high compatibility (faster, smaller files)
    const exportStandardPdf = async () => {
      // Disable high compatibility for faster exports when targeting modern PDF viewers
      // Complex elements remain as vectors but may render differently across viewers
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: false
      });

      downloadBlob(pdfBlob, 'print-standard.pdf');
      cesdk.ui.showNotification({
        message: `Standard PDF exported (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Define underlayer spot color and export with underlayer
    const exportWithUnderlayer = async () => {
      // Define the underlayer spot color before export
      // This creates a named spot color that will be used for the underlayer ink
      // The RGB values (0.8, 0.8, 0.8) provide a preview representation
      engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

      // Export with underlayer enabled for DTF or special media printing
      // The underlayer generates a shape behind design elements filled with the spot color
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: true,
        exportPdfWithUnderlayer: true,
        underlayerSpotColorName: 'RDG_WHITE',
        // Negative offset shrinks the underlayer inward to prevent visible edges
        underlayerOffset: -2.0
      });

      downloadBlob(pdfBlob, 'print-with-underlayer.pdf');
      cesdk.ui.showNotification({
        message: `PDF exported with underlayer (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export with custom target size
    const exportWithTargetSize = async () => {
      // Export with specific dimensions for print output
      // targetWidth and targetHeight control the exported PDF dimensions in pixels
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: true,
        targetWidth: 2480, // A4 at 300 DPI (210mm)
        targetHeight: 3508 // A4 at 300 DPI (297mm)
      });

      downloadBlob(pdfBlob, 'print-a4-300dpi.pdf');
      cesdk.ui.showNotification({
        message: `A4 PDF exported (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Configure navigation bar with export buttons
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithHighCompatibility,
        key: 'export-high-compat',
        label: 'High Compat PDF',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportStandardPdf,
        key: 'export-standard',
        label: 'Standard PDF',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithUnderlayer,
        key: 'export-underlayer',
        label: 'With Underlayer',
        icon: '@imgly/Save',
        variant: 'plain',
        color: 'accent'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithTargetSize,
        key: 'export-a4',
        label: 'A4 @ 300 DPI',
        icon: '@imgly/Save',
        variant: 'plain'
      }
    ]);

    cesdk.ui.showNotification({
      message:
        'Use the export buttons to export print-ready PDFs with different options',
      type: 'info',
      duration: 'infinite'
    });
  }
}

export default Example;
```

## Default PDF Color Behavior

CE.SDK exports PDFs in RGB color space. CMYK or spot colors defined in your design convert to RGB during standard export. For CMYK output with ICC profiles, use the **Print Ready PDF plugin**.

The base `engine.block.export()` method provides print compatibility options, but full CMYK workflow requires the plugin.

## Setting Up for Print Export

Before exporting, configure your scene with appropriate print settings. Set the scene's DPI to control print resolution—300 DPI is standard for high-quality print output.

```typescript highlight-setup
    // Load a template scene - this will be our print design
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Get the scene and page
    const scene = engine.scene.get();
    if (!scene) {
      throw new Error('No scene found');
    }
    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Set print resolution (DPI) on the scene
    // 300 DPI is standard for high-quality print output
    engine.block.setFloat(scene, 'scene/dpi', 300);
```

## PDF Export Options for Print

Export a page as PDF using `engine.block.export()` with `mimeType: 'application/pdf'`.

### High Compatibility Mode

The `exportPdfWithHighCompatibility` option rasterizes complex elements like gradients with transparency at the scene's DPI. Enable this when:

- Designs use gradients with transparency
- Effects or blend modes render inconsistently across PDF viewers
- Maximum compatibility across print RIPs matters more than vector precision

```typescript highlight-export-high-compatibility
// Enable high compatibility mode for consistent rendering across PDF viewers
// This rasterizes complex elements like gradients with transparency at the scene's DPI
const pdfBlob = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true
});
```

Disabling high compatibility produces faster exports with smaller file sizes but may cause rendering inconsistencies in some PDF viewers.

### Standard PDF Export

When targeting modern PDF viewers where file size and export speed matter more than universal compatibility:

```typescript highlight-export-standard-pdf
// Disable high compatibility for faster exports when targeting modern PDF viewers
// Complex elements remain as vectors but may render differently across viewers
const pdfBlob = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: false
});
```

## Underlayers for Special Media

Underlayers provide a base ink layer (typically white) for printing on:

- Transparent or non-white substrates
- DTF (Direct-to-Film) transfers
- Fabric, glass, or dark materials

### Define the Underlayer Spot Color

Before exporting with an underlayer, define the spot color that represents the underlayer ink. Use `engine.editor.setSpotColorRGB()` to create a named spot color with RGB preview values.

```typescript highlight-define-spot-color
// Define the underlayer spot color before export
// This creates a named spot color that will be used for the underlayer ink
// The RGB values (0.8, 0.8, 0.8) provide a preview representation
engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);
```

### Export with Underlayer

Enable `exportPdfWithUnderlayer` and specify the `underlayerSpotColorName` to generate an underlayer from design contours. The underlayer offset controls the size adjustment—negative values shrink the underlayer inward to prevent visible edges from print misalignment.

```typescript highlight-export-with-underlayer
// Export with underlayer enabled for DTF or special media printing
// The underlayer generates a shape behind design elements filled with the spot color
const pdfBlob = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true,
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: 'RDG_WHITE',
  // Negative offset shrinks the underlayer inward to prevent visible edges
  underlayerOffset: -2.0
});
```

### Underlayer Offset

The `underlayerOffset` option adjusts the underlayer size in design units. Negative values shrink the underlayer inward, which prevents visible white edges when the print layers don't align perfectly. Start with values like `-1.0` to `-3.0` and adjust based on your print equipment's alignment accuracy.

## Export with Target Size

Control the exported PDF dimensions using `targetWidth` and `targetHeight`. These values are in pixels and work together with the scene's DPI setting to determine physical print size.

```typescript highlight-export-target-size
// Export with specific dimensions for print output
// targetWidth and targetHeight control the exported PDF dimensions in pixels
const pdfBlob = await engine.block.export(page, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true,
  targetWidth: 2480, // A4 at 300 DPI (210mm)
  targetHeight: 3508 // A4 at 300 DPI (297mm)
});
```

## CMYK PDFs with ICC Profiles

For CMYK color space and ICC profile embedding, use the **Print Ready PDF plugin**. This plugin post-processes exports to convert RGB to CMYK with embedded ICC profiles.

See the [Print Ready PDF Plugin](./plugins/print-ready-pdf.md) for setup and usage.

## Troubleshooting

### PDF Not Opening Correctly in Print Software

Enable `exportPdfWithHighCompatibility: true` to rasterize complex elements that may not render correctly in prepress software.

### Underlayer Not Visible in PDF Viewer

Standard PDF viewers may not display spot colors. Use professional print software like Adobe Acrobat Pro or prepress tools to verify the underlayer separation.

### Colors Look Different After Printing

Standard export uses RGB. Use the Print Ready PDF plugin with appropriate ICC profiles for accurate CMYK reproduction.

### White Edges on Special Media

Increase the negative `underlayerOffset` value to shrink the underlayer further from design edges. Try values like `-2.0` or `-3.0` depending on your equipment's alignment tolerance.

## API Reference

| Method/Option | Purpose |
|---------------|---------|
| `engine.block.export(block, options)` | Export block to PDF |
| `mimeType: 'application/pdf'` | Specify PDF output format |
| `targetWidth` | Target width for exported PDF in pixels |
| `targetHeight` | Target height for exported PDF in pixels |
| `exportPdfWithHighCompatibility` | Rasterize bitmap images and gradients at scene DPI (default: `true`) |
| `exportPdfWithUnderlayer` | Generate underlayer from contours (default: `false`) |
| `underlayerSpotColorName` | Spot color name for underlayer ink |
| `underlayerOffset` | Size adjustment in design units (negative shrinks) |
| `engine.editor.setSpotColorRGB(name, r, g, b)` | Define spot color for underlayer |
| `engine.block.setFloat(scene, 'scene/dpi', value)` | Set scene DPI for print resolution |

## Next Steps

- [Print Ready PDF Plugin](./plugins/print-ready-pdf.md) - CMYK PDFs with ICC profiles
- [CMYK Colors](./colors/for-print/cmyk.md) - Configure CMYK colors
- [Spot Colors](./colors/for-print/spot.md) - Define and use spot colors
- [Export to PDF](./export-save-publish/export/to-pdf.md) - General PDF export options



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support