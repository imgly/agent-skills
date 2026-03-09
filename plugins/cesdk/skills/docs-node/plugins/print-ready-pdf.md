> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Plugins](./plugins.md) > [Print Ready PDFs](./plugins/print-ready-pdf.md)

---

In this guide, you'll learn how to use the Print Ready PDF plugin with CE.SDK
Engine in Node.js to automate print-ready PDF generation. This is ideal for
batch processing, server-side PDF generation, CI/CD pipelines, and automated
workflows that require PDF/X-3 compliant output.

## What You'll Build

A server-side PDF conversion workflow that:

- Initializes CE.SDK Engine in headless mode
- Loads design scenes from files or APIs
- Exports PDFs using CE.SDK's engine
- Converts to PDF/X-3 with CMYK profiles
- Saves print-ready files to the filesystem
- Supports batch processing multiple files

## Prerequisites

- CE.SDK license with Design Editor features - [Get a free trial](https://img.ly/forms/free-trial)
- Node.js 20+ installed (required by `@cesdk/node`)
- Basic knowledge of Node.js and async/await

## Step 1: Install Dependencies

Add CE.SDK Engine and the Print Ready PDF plugin to your Node.js project:

```bash
npm install @cesdk/node @imgly/plugin-print-ready-pdfs-web@1.0.0
```

**Package details:**

- `@cesdk/node`: CE.SDK Node.js package for server-side rendering (requires Node.js >=20)
- `@imgly/plugin-print-ready-pdfs-web`: Print-ready PDF conversion (works in Node.js despite the name)

The plugin works in Node.js because it's built on WebAssembly, which Node.js supports.

**Try it yourself:**

1. Run `npm install` in your project directory
2. Verify packages appear in `package.json`
3. Check `node_modules` contains both packages

## Step 2: Initialize CE.SDK Engine in Headless Mode

Set up CE.SDK Engine for server-side processing:

```typescript
import CreativeEngine from '@cesdk/node';

const config = {
  license: 'YOUR_CESDK_LICENSE_KEY',
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`,
};

const engine = await CreativeEngine.init(config);
console.log('Engine initialized:', engine.isInitialized());
```

**CE.SDK concepts explained:**

- **`CreativeEngine.init()`**: Initializes the engine in headless mode (no browser required)
- **`license`**: Activates CE.SDK features including PDF export
- **`baseURL`**: Points to the required assets for the engine to function
- **Headless mode**: Runs without UI for automated workflows

**Verify initialization:**

1. Run your Node.js script: `node script.js`
2. Check console shows "Engine initialized: true"
3. No license errors should appear

## Step 3: Load and Export Scenes as PDF

Load design scenes and export them as PDFs:

```typescript
import { readFileSync } from 'fs';

// Load scene from file
const sceneString = readFileSync('design.scene', 'utf-8');
await engine.scene.loadFromString(sceneString);

// Get scene ID
const sceneId = engine.scene.get();

// Export as PDF
const pdfBlob = await engine.block.export(sceneId, 'application/pdf');

console.log('PDF exported:', pdfBlob.size, 'bytes');
```

**CE.SDK export methods in detail:**

- **`engine.scene.loadFromString()`**: Loads a saved CE.SDK scene from JSON string
- **`engine.scene.get()`**: Returns the ID of the currently loaded scene
- **`engine.block.export()`**: Exports a block (the entire scene) as a specified format

The `.scene` file format is CE.SDK's native scene format. You can create these from CE.SDK Editor or generate them programmatically.

**Alternative: Load from URL or API:**

```typescript
// Fetch scene from API
await engine.scene.loadFromURL('https://api.example.com/scenes/123');
```

**Test your implementation:**

- Run script with a valid `.scene` file
- Check console shows PDF size > 0
- No export errors should appear

## Step 4: Convert to Print-Ready Format

Use the plugin to convert CE.SDK's PDF to PDF/X-3:

```typescript
import { convertToPDFX3 } from '@imgly/plugin-print-ready-pdfs-web';

const printReadyPDF = await convertToPDFX3(pdfBlob, {
  outputProfile: 'fogra39',
  title: 'Automated Print Export',
});

console.log('Conversion complete:', printReadyPDF.size, 'bytes');
```

**How this integrates with CE.SDK:**

- CE.SDK Engine exports standard RGB PDF
- Plugin converts to CMYK with ICC profiles
- Adds PDF/X-3:2003 compliance markers
- Flattens transparency for print compatibility

**Color profile selection:**

- **`'fogra39'`**: European offset printing (ISO Coated v2)
- **`'gracol'`**: USA commercial printing (GRACoL 2013)
- **`'srgb'`**: Digital distribution (keeps RGB)
- **`'custom'`**: Use printer-specific ICC profile

**Verify the conversion:**

- Conversion completes in 2-5 seconds
- Output size increased by ~400-500KB (ICC profile)
- No error messages in console

## Step 5: Save to Filesystem

Save the print-ready PDF to disk:

```typescript
import { writeFileSync } from 'fs';

// Convert Blob to Buffer for Node.js filesystem
const buffer = Buffer.from(await printReadyPDF.arrayBuffer());

// Save to file
writeFileSync('output-print-ready.pdf', buffer);

console.log('File saved: output-print-ready.pdf');
```

**Node.js file handling explained:**

- **`Blob.arrayBuffer()`**: Gets raw binary data from Blob
- **`Buffer.from()`**: Converts ArrayBuffer to Node.js Buffer
- **`writeFileSync()`**: Writes Buffer to filesystem synchronously

For production systems, use `writeFile()` (async) instead of `writeFileSync()`.

**Test the complete workflow:**

1. Run your script: `node script.js`
2. Check `output-print-ready.pdf` exists
3. Open PDF in viewer (Adobe Acrobat, Preview, etc.)
4. Verify file properties show PDF/X-3:2003 compliance

## Complete Implementation

Here's a full server-side PDF conversion script:

```typescript
import CreativeEngine from '@cesdk/node';
import { convertToPDFX3 } from '@imgly/plugin-print-ready-pdfs-web';
import { readFileSync, writeFileSync } from 'fs';

async function convertToPrintReady() {
  // Initialize CE.SDK Engine
  const engine = await CreativeEngine.init({
    license: 'YOUR_CESDK_LICENSE_KEY',
    baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`,
  });

  // Load scene from file
  const sceneString = readFileSync('design.scene', 'utf-8');
  await engine.scene.loadFromString(sceneString);

  // Export as PDF
  const sceneId = engine.scene.get();
  const pdfBlob = await engine.block.export(sceneId, 'application/pdf');

  // Convert to print-ready
  const printReadyPDF = await convertToPDFX3(pdfBlob, {
    outputProfile: 'fogra39',
    title: 'Automated Print Export',
  });

  // Save to disk
  const buffer = Buffer.from(await printReadyPDF.arrayBuffer());
  writeFileSync('output-print-ready.pdf', buffer);

  console.log('Print-ready PDF created successfully');

  // Don't forget to dispose when done
  engine.dispose();
}

convertToPrintReady().catch(console.error);
```

This implementation provides a complete automated workflow for generating print-ready PDFs from CE.SDK scenes.

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

## Advanced: Batch Processing Multiple Files

Process multiple scenes in a batch:

```typescript
import { readdirSync } from 'fs';

async function batchConvert() {
  const engine = await CreativeEngine.init({
    license: 'YOUR_CESDK_LICENSE_KEY',
    baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`,
  });

  // Find all .scene files
  const sceneFiles = readdirSync('.').filter(f => f.endsWith('.scene'));

  console.log(`Processing ${sceneFiles.length} files...`);

  for (const file of sceneFiles) {
    console.log(`Converting ${file}...`);

    // Load scene
    const sceneString = readFileSync(file, 'utf-8');
    await engine.scene.loadFromString(sceneString);

    // Export and convert
    const sceneId = engine.scene.get();
    const pdfBlob = await engine.block.export(sceneId, 'application/pdf');
    const printReadyPDF = await convertToPDFX3(pdfBlob, {
      outputProfile: 'fogra39',
      title: file.replace('.scene', ''),
    });

    // Save with print-ready suffix
    const outputName = file.replace('.scene', '-print-ready.pdf');
    const buffer = Buffer.from(await printReadyPDF.arrayBuffer());
    writeFileSync(outputName, buffer);

    console.log(`✓ Saved ${outputName}`);
  }

  console.log('Batch processing complete!');
}

batchConvert().catch(console.error);
```

This processes all `.scene` files in a directory and generates print-ready PDFs for each.

## Troubleshooting

### "Cannot find module" Error

**Problem:** Import errors for CE.SDK or plugin

**Solution:** Verify package installation:

```bash
npm list @cesdk/node @imgly/plugin-print-ready-pdfs-web
```

If missing, reinstall:

```bash
npm install @cesdk/node @imgly/plugin-print-ready-pdfs-web@1.0.0
```

### Memory Issues with Large Files

**Problem:** Node.js crashes with "out of memory" errors

**Solution:** Increase Node.js memory limit:

```bash
node --max-old-space-size=4096 script.js
```

Or use streaming for large batch operations:

```typescript
// Process files sequentially instead of in parallel
for (const file of sceneFiles) {
  await processFile(file);
  // Allow garbage collection between files
  await new Promise(resolve => setTimeout(resolve, 100));
}
```

### AGPL License Concerns

**Problem:** Worried about AGPL compliance for server-side processing

**Solution:** Consult legal counsel if:

- You're modifying the plugin's WASM binaries
- You're offering PDF conversion as a network service
- You're bundling the plugin in closed-source server software

For most use cases (internal automation, CI/CD, batch processing), server-side execution is acceptable. The plugin uses Ghostscript under AGPL-3.0.

## Validating Output

Verify generated PDFs meet print standards:

```typescript
import { execSync } from 'child_process';

// Check PDF version
const version = execSync(
  'pdfinfo output-print-ready.pdf | grep "PDF version"',
).toString();
console.log(version); // Should show PDF 1.3 (PDF/X-3:2003)

// Validate structure
execSync('qpdf --check output-print-ready.pdf');
console.log('PDF structure is valid');
```

Or use Adobe Acrobat Pro:

1. Open PDF → File → Properties → Description
2. Should show "PDF/X-3:2003"
3. Check Advanced tab for OutputIntent with ICC profile



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support