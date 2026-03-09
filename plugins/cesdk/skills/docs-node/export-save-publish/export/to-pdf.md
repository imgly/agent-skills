> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To PDF](./export-save-publish/export/to-pdf.md)

---

Export your designs as PDF documents with high compatibility mode and underlayer support for special media printing.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-to-pdf-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-to-pdf-server-js)

PDF provides a universal document format for sharing and printing designs. CE.SDK exports PDF files that preserve vector graphics, support multi-page documents, and include options for print compatibility. You can configure high compatibility mode to ensure consistent rendering across different PDF viewers, and generate underlayers for special media printing like fabric, glass, or DTF transfers.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-pdf-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';

config();

// Helper function to prompt for user input
function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Display export options menu
console.log('=== PDF Export Options ===\n');
console.log('1. Default PDF');
console.log('2. High Compatibility PDF');
console.log('3. PDF with Underlayer');
console.log('4. A4 @ 300 DPI PDF');
console.log('5. All formats\n');

const choice = (await prompt('Select export option (1-5): ')) || '5';

console.log('\n⏳ Initializing engine...');

const engine = await CreativeEngine.init({
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`
});

try {
  await engine.addDefaultAssetSources();
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  // Get the scene block for PDF export (includes all pages)
  const scene = engine.scene.get();
  if (!scene) throw new Error('No scene found');

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('⏳ Exporting...\n');

  if (choice === '1' || choice === '5') {
    // Export scene as PDF (includes all pages)
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design.pdf`, buffer);
    console.log(
      `✓ Default PDF: ${outputDir}/design.pdf (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '2' || choice === '5') {
    // Enable high compatibility mode for consistent rendering across PDF viewers
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-high-compatibility.pdf`, buffer);
    console.log(
      `✓ High Compatibility PDF: ${outputDir}/design-high-compatibility.pdf (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '3' || choice === '5') {
    engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

    // Export with underlayer for special media printing
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true,
      exportPdfWithUnderlayer: true,
      underlayerSpotColorName: 'RDG_WHITE',
      underlayerOffset: -2.0
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-with-underlayer.pdf`, buffer);
    console.log(
      `✓ PDF with Underlayer: ${outputDir}/design-with-underlayer.pdf (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '4' || choice === '5') {
    // Export with specific dimensions for print output
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      targetWidth: 2480,
      targetHeight: 3508
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-a4.pdf`, buffer);
    console.log(
      `✓ A4 PDF: ${outputDir}/design-a4.pdf (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  console.log('\n✓ Export completed');
} finally {
  engine.dispose();
}
```

This guide covers exporting designs to PDF format, configuring high compatibility mode, generating underlayers with spot colors, and controlling output dimensions.

## Export to PDF

Call `engine.block.export()` with `mimeType: 'application/pdf'` to export any block as a PDF document. The method returns a Blob containing the PDF data.

```typescript highlight=highlight-export-pdf
// Export scene as PDF (includes all pages)
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf'
});
```

Pass the scene ID from `engine.scene.get()` to export all pages as a multi-page PDF. You can also pass a single page ID from `engine.scene.getCurrentPage()` if you only need to export one page.

## Configure High Compatibility Mode

Enable `exportPdfWithHighCompatibility` to rasterize complex elements like gradients with transparency at the scene's DPI. This ensures consistent rendering across all PDF viewers.

```typescript highlight=highlight-high-compatibility
// Enable high compatibility mode for consistent rendering across PDF viewers
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true
});
```

Use high compatibility mode when:

- Designs contain gradients with transparency
- Effects or blend modes render inconsistently across viewers
- Maximum compatibility matters more than vector precision

High compatibility mode increases file size because complex elements are converted to raster images rather than remaining as vectors.

## Generate Underlayers for Special Media

Underlayers provide a base ink layer (typically white) for printing on transparent or non-white substrates like fabric, glass, or acrylic. The underlayer sits behind your design elements and provides opacity on transparent materials.

### Define the Underlayer Spot Color

Before exporting, define a spot color that represents the underlayer ink. The RGB values provide a preview representation in PDF viewers.

```typescript highlight=highlight-spot-color
engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);
```

The spot color name (e.g., `'RDG_WHITE'`) must match your print provider's requirements. Common names include `RDG_WHITE` for Roland DG printers and `White` for other systems.

### Export with Underlayer Options

Configure the underlayer spot color name and optional offset. The `underlayerOffset` adjusts the underlayer size in design units—negative values shrink it inward to prevent visible edges from print misalignment (trapping).

```typescript highlight=highlight-underlayer
// Export with underlayer for special media printing
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  exportPdfWithHighCompatibility: true,
  exportPdfWithUnderlayer: true,
  underlayerSpotColorName: 'RDG_WHITE',
  underlayerOffset: -2.0
});
```

The underlayer is generated automatically from the contours of all design elements on the page. Elements with transparency will have proportionally reduced underlayer opacity.

## Export at Target Dimensions

Use `targetWidth` and `targetHeight` to control the exported PDF dimensions in pixels. The block renders large enough to fill the target size while maintaining aspect ratio.

```typescript highlight=highlight-target-size
// Export with specific dimensions for print output
const blob = await engine.block.export(scene, {
  mimeType: 'application/pdf',
  targetWidth: 2480,
  targetHeight: 3508
});
```

For print output, calculate the target dimensions based on your desired DPI:

- A4 at 300 DPI: 2480 × 3508 pixels
- Letter at 300 DPI: 2550 × 3300 pixels

## PDF Export Options

| Option | Description |
| ------ | ----------- |
| `mimeType` | Output format. Must be `'application/pdf'`. |
| `exportPdfWithHighCompatibility` | Rasterize complex elements at scene DPI for consistent rendering. Defaults to `true`. |
| `exportPdfWithUnderlayer` | Generate an underlayer from design contours. Defaults to `false`. |
| `underlayerSpotColorName` | Spot color name for the underlayer ink. Required when `exportPdfWithUnderlayer` is true. |
| `underlayerOffset` | Size adjustment in design units. Negative values shrink the underlayer inward. |
| `targetWidth` | Target output width in pixels. Must be used with `targetHeight`. |
| `targetHeight` | Target output height in pixels. Must be used with `targetWidth`. |
| `abortSignal` | Signal to cancel the export operation. |

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.export(blockId, options)` | Export a block as PDF with format and compatibility options |
| `engine.editor.setSpotColorRGB(name, r, g, b)` | Define a spot color for underlayer ink |
| `engine.scene.get()` | Get the scene for multi-page PDF export |
| `engine.scene.getCurrentPage()` | Get the current page for single-page export |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Compare all supported export formats
- [Export for Printing](./export-save-publish/for-printing.md) - Print workflows with DPI and color management
- [Spot Colors](./colors/for-print/spot.md) - Define and use spot colors in designs
- [Export Size Limits](./export-save-publish/export/size-limits.md) - Check device limits before exporting large designs



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support