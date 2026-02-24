> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Plugins](./plugins.md) > [Print Ready PDFs](./plugins/print-ready-pdf.md)

---

In this guide, you'll learn how to use the Print Ready PDF plugin to transform
CE.SDK's standard RGB PDF exports into PDF/X-3 compliant, CMYK-based files
suitable for professional commercial printing. We'll add a custom export
button that handles color space conversion, ICC profile embedding, and PDF/X
compliance—all client-side without any backend infrastructure.

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/plugins-print-ready-pdf-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/plugins-print-ready-pdf-browser)
>
> - [Live demo](https://img.ly/examples/plugins-print-ready-pdf-browser/)

## What You'll Build

A complete print-ready PDF export workflow that:

- Adds a custom "Export Print-Ready PDF" button to CE.SDK
- Exports designs as standard PDFs using CE.SDK's engine
- Converts RGB PDFs to CMYK with professional ICC profiles
- Adds PDF/X-3:2003 compliance for commercial printing
- Handles transparency flattening automatically
- Downloads print-ready files directly in the browser

## Prerequisites

- Modern browser with WebAssembly support (Chrome 90+, Firefox 88+, Safari 14+)
- Basic knowledge of JavaScript/TypeScript and CE.SDK
- Optional: CE.SDK license to remove watermark - [Get a free trial](https://img.ly/forms/free-trial)

## Step 1: Install the Plugin

First, add the Print Ready PDF plugin to your project alongside CE.SDK:

```bash
npm install @cesdk/cesdk-js @imgly/plugin-print-ready-pdfs-web@1.0.0
```

The plugin is a standalone npm package that works with any CE.SDK integration.

**Package details:**

- `@cesdk/cesdk-js`: CE.SDK core library
- `@imgly/plugin-print-ready-pdfs-web`: Print-ready PDF conversion plugin

**Try it yourself:**

1. Run `npm install` in your project
2. Verify packages appear in `package.json`
3. Check node\_modules contains both packages

## Step 2: Set Up CE.SDK with Custom Export Button

Initialize CE.SDK and add a custom export button to the navigation bar:

```typescript
// Initialize CE.SDK
const cesdk = await CreativeEditorSDK.create('#cesdk-container', config);

// Add custom export button to navigation bar
cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
  id: 'ly.img.actions.navigationBar',
  children: [
    {
      key: 'export-print-ready-pdf',
      id: 'ly.img.action.navigationBar',
      label: 'Export Print-Ready PDF',
      iconName: '@imgly/Download',
      onClick: async () => {
        await exportPrintReadyPDF();
      },
    },
  ],
});
```

**CE.SDK concepts explained:**

- **`insertOrderComponent()`**: Dynamically adds UI components to the navigation bar
- **`position: 'end'`**: Position for the button (can be `'first'`, `'last'`, or after specific components)
- **`iconName`**: Uses CE.SDK's built-in icon library (`@imgly/icons/`)
- **`onClick`**: Function executed when button is clicked

The custom action button integrates seamlessly with CE.SDK's UI, appearing alongside built-in export options.

**Verify the integration:**

1. Start your development server
2. Open CE.SDK in the browser
3. Look for "Export Print-Ready PDF" button in the navigation bar
4. Button should be clickable (even if export isn't implemented yet)

## Step 3: Export PDF from CE.SDK

Now implement the export logic to get the PDF from CE.SDK's engine:

```typescript
// Get current scene ID
const scene = cesdk.engine.scene.get();

// Get all pages in the scene
const pages = cesdk.engine.block.findByType('page');

// Export first page as PDF
const pdfBlob = await cesdk.engine.block.export(pages[0], {
  mimeType: 'application/pdf',
});
```

**CE.SDK export methods in detail:**

- **`engine.scene.get()`**: Returns the ID of the current scene (the design being edited)
- **`engine.block.export()`**: Exports a specific block (in this case, the entire scene) as a Blob
- **`'application/pdf'`**: MIME type specifying PDF format output

The `engine.block.export()` method is the recommended approach for PDF export. CE.SDK handles all PDF generation internally.

**Test your implementation:**

- Open CE.SDK and create a simple design
- Click the custom export button
- Check browser console shows no errors
- Verify PDF blob has `size > 0`

## Step 4: Convert to Print-Ready Format

Use the plugin to convert CE.SDK's RGB PDF to CMYK PDF/X-3 format:

```typescript
// Convert to print-ready PDF/X-3 format
const printReadyPDF = await convertToPDFX3(pdfBlob, {
  outputProfile: 'fogra39', // European printing standard
  title: 'Print-Ready Export',
});
```

**How this integrates with CE.SDK:**

- CE.SDK exports standard RGB PDF (optimized for screens)
- Plugin intercepts the PDF blob
- Converts RGB colors to CMYK using professional ICC profiles
- Adds PDF/X-3:2003 compliance markers
- Embeds color profile for consistent printing

**Color profile selection:**

The `outputProfile` parameter determines the color space and printing standard:

- **`'fogra39'`**: European offset printing (ISO Coated v2 ECI)
- **`'gracol'`**: USA commercial printing (GRACoL 2013)
- **`'srgb'`**: Digital distribution (keeps RGB)
- **`'custom'`**: Use your own ICC profile file

Choose the profile that matches your print region or vendor requirements.

**Verify the conversion:**

1. Conversion should complete in 2-5 seconds
2. Output PDF is larger than input (~400-500KB for ICC profile)
3. No error messages in console
4. Blob size increased indicates successful conversion

## Step 5: Download Print-Ready PDF

Trigger the browser download for the converted PDF:

```typescript
// Download the print-ready PDF
const url = URL.createObjectURL(printReadyPDF);
const link = document.createElement('a');
link.href = url;
link.download = 'design-print-ready.pdf';
link.click();
URL.revokeObjectURL(url);
```

**Browser download pattern explained:**

- **`URL.createObjectURL()`**: Creates temporary URL for the Blob
- **`document.createElement('a')`**: Creates download link element
- **`link.click()`**: Triggers browser's download dialog
- **`URL.revokeObjectURL()`**: Cleans up temporary URL (prevents memory leaks)

This pattern works in all modern browsers without requiring server endpoints.

**Test the complete workflow:**

1. Create a design in CE.SDK
2. Click "Export Print-Ready PDF" button
3. Browser should prompt to save file
4. Downloaded PDF should open in PDF viewers
5. Check file properties for PDF/X-3:2003 compliance

## Complete Implementation

Here's the full integration combining all steps:

```typescript file=@cesdk_web_examples/plugins-print-ready-pdf-browser/src/index.ts reference-only
import CreativeEditorSDK from '@cesdk/cesdk-js';
// @ts-expect-error - Plugin types will be available in future release
import { convertToPDFX3 } from '@imgly/plugin-print-ready-pdfs-web';

let cesdk: CreativeEditorSDK;

const config = {
  // By default, CE.SDK runs with a watermark.
  // Get a free trial license at https://img.ly/forms/free-trial to remove it.
  // Uncomment the line below and add your license key:
  // license: 'your-license-key-here',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...((import.meta as any).env?.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  })
};

async function init() {
  // Initialize CE.SDK
  cesdk = await CreativeEditorSDK.create('#cesdk-container', config);

  cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
    id: 'ly.img.actions.navigationBar',
    children: [
      {
        key: 'export-print-ready-pdf',
        id: 'ly.img.action.navigationBar',
        label: 'Export Print-Ready PDF',
        iconName: '@imgly/Download',
        onClick: async () => {
          await exportPrintReadyPDF();
        }
      }
    ]
  });

  // Load default scene
  await cesdk.actions.run('scene.create', { page: { sourceId: 'ly.img.page.presets', assetId: 'ly.img.page.presets.print.iso.a6.landscape' } });
  await cesdk.addDefaultAssetSources();
  await cesdk.addDemoAssetSources();
}

async function exportPrintReadyPDF() {
  try {
    // Check if CE.SDK is initialized
    if (!cesdk) {
      throw new Error('CE.SDK not initialized');
    }

    // Get current scene ID
    const scene = cesdk.engine.scene.get();

    if (scene == null) {
      throw new Error('No scene loaded');
    }

    // Get all pages in the scene
    const pages = cesdk.engine.block.findByType('page');

    if (pages.length === 0) {
      throw new Error('No pages found in scene');
    }

    // Export first page as PDF
    const pdfBlob = await cesdk.engine.block.export(pages[0], {
      mimeType: 'application/pdf'
    });

    // Convert to print-ready PDF/X-3 format
    const printReadyPDF = await convertToPDFX3(pdfBlob, {
      outputProfile: 'fogra39', // European printing standard
      title: 'Print-Ready Export'
    });

    // Download the print-ready PDF
    const url = URL.createObjectURL(printReadyPDF);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design-print-ready.pdf';
    link.click();
    URL.revokeObjectURL(url);

    console.log('Print-ready PDF exported successfully!');
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export print-ready PDF. Please try again.');
  }
}

// Initialize when page loads
init().catch((error) => {
  console.error('Failed to initialize CE.SDK:', error);
});
```

This implementation adds a complete print-ready PDF export workflow to CE.SDK with just a few lines of code.

Find the complete working example in the [GitHub repository](https://github.com/imgly/cesdk-web-examples/tree/main/plugins-print-ready-pdf-browser).

## Transparency Handling

PDF/X-3:2003 is based on PDF 1.3 which does not support transparency. By default, the plugin flattens all transparency to ensure compliance.

**Why Flattening is Required:**

Transparency flattening is mandatory for PDF/X-3 compliance—this is a requirement of the standard itself, not a limitation of the tooling. Any PDF with transparency must have those elements composited into opaque equivalents before it can be a valid PDF/X-3 file.

**What happens during flattening:**

- Pages without transparency → Preserved as vectors (text, shapes remain editable)
- Pages with transparency → Rasterized to bitmaps during conversion
- Mixed content → Only transparent elements are rasterized

### Known Issue: Black Backgrounds During Flattening

During the flattening process, certain elements with transparency may render with black backgrounds instead of their intended appearance. Affected elements include:

- Gradients that fade to transparent
- PNG images with alpha channels (e.g., stickers, icons)
- Text with emoji characters
- Overlapping semi-transparent elements

### Workaround: Preserve Transparency

If visual fidelity is more important than strict PDF/X-3 compliance, you can disable transparency flattening:

```typescript
// Preserve transparency for better visual fidelity
const printReadyPDF = await convertToPDFX3(pdfBlob, {
  outputProfile: 'fogra39',
  title: 'Visual Fidelity Preserved',
  flattenTransparency: false, // Preserves appearance but may not be strictly PDF/X-3 compliant
});
```

### Trade-offs

| Setting | Visual Fidelity | PDF/X-3 Compliance |
|---------|----------------|-------------------|
| `flattenTransparency: true` (default) | May have artifacts | Strictly compliant |
| `flattenTransparency: false` | Preserved | May not validate if transparency exists |

### Designing for Print Compatibility

To ensure best results with PDF/X-3, design without transparency:

- Use 100% opacity for all elements
- Avoid PNG images with alpha channels
- Use solid fills instead of gradients with opacity
- Avoid gradients that fade to transparent
- Export without blend modes

## Advanced: Custom ICC Profiles

Use printer-specific ICC profiles:

```typescript
// Load custom ICC profile from your server
const customProfile = await fetch('/path/to/custom.icc').then(r => r.blob());

const printReadyPDF = await convertToPDFX3(pdfBlob, {
  outputProfile: 'custom',
  customProfile: customProfile,
  title: 'Custom Profile Export',
  outputConditionIdentifier: 'Custom_CMYK_Profile',
  outputCondition: 'Custom profile for specialized printing',
});
```

This allows you to meet specific print vendor requirements that may not be covered by standard profiles.

## Troubleshooting

### "Input must be a Blob" Error

**Problem:** Plugin reports invalid input type

**Solution:** Ensure CE.SDK export returns a Blob:

```typescript
const blob = await cesdk.engine.block.export(sceneId, 'application/pdf');
console.log(blob instanceof Blob); // Should be true
console.log(blob.size); // Should be > 0
```

If `blob.size === 0`, the CE.SDK export failed. Check for scene errors.

### Converted PDF is Much Larger

**Problem:** Output file is significantly larger than input

**Solution:** This is expected behavior:

- ICC profiles add ~400-500KB (FOGRA39/GRACoL)
- Transparency flattening may rasterize content
- For smaller files, use `srgb` profile (digital-only)
- Disable transparency flattening if no transparency exists: `flattenTransparency: false`

### Text Becomes Rasterized

**Problem:** Text appears pixelated or blurry in output

**Solution:** Transparency flattening converts transparent pages to bitmaps. See [Transparency Handling](#transparency-handling) for details.

- Avoid transparency in CE.SDK designs (use 100% opacity)
- Don't use alpha channel PNG images
- Use solid fills instead of gradients with opacity
- Or disable flattening: `flattenTransparency: false` if visual fidelity is more important than strict compliance

### Colors Look Different

**Problem:** Colors appear different in exported PDF

**Solution:** This is expected when converting RGB to CMYK:

- CMYK has a smaller color gamut than RGB
- Some bright RGB colors cannot be reproduced in CMYK
- Preview in CMYK-capable viewer (Adobe Acrobat) for accurate representation
- For color-critical work, use CMYK values directly in CE.SDK designs

### Custom Button Doesn't Appear

**Problem:** Export button not visible in UI

**Solution:** Verify your button insertion code:

```typescript
cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
  id: 'ly.img.actions.navigationBar',
  children: [
    {
      key: 'export-print-ready-pdf',
      id: 'ly.img.action.navigationBar',
      label: 'Export Print-Ready PDF',
      iconName: '@imgly/Download',
      onClick: async () => {
        /* ... */
      },
    },
  ],
});
```

Check browser console for configuration errors. Ensure the button is added after CE.SDK initialization completes.

## Validating PDF/X-3 Compliance

Verify your exported PDFs meet print standards:

**Adobe Acrobat Pro:**

1. Open converted PDF
2. File → Properties → Description
3. Should show "PDF version: 1.3 (PDF/X-3:2003)"
4. File → Properties → Advanced
5. Should show OutputIntent with ICC profile name

**Free online validators:**

- [PDF/A-X Validator](https://www.pdf-online.com/osa/validate.aspx) - Upload and validate compliance
- Check for PDF/X-3:2003 standard confirmation

**Command-line verification:**

```bash
# Check PDF version
pdfinfo output.pdf | grep "PDF version"

# Validate structure
qpdf --check output.pdf

# Search for PDF/X markers
grep -a "PDF/X-3" output.pdf
```



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support