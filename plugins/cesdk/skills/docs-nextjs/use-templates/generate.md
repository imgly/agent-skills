> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Generate From Template](./use-templates/generate.md)

---

Generate finished designs from templates by loading, populating variables, and exporting to images, PDFs, or videos programmatically.

![Generate From Template example showing a personalized greeting card](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-use-templates-generate-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-use-templates-generate-browser)
>
> - [Live demo](https://img.ly/examples/guides-use-templates-generate-browser/)

Template generation transforms templates into finished designs by populating data and exporting to output formats. Load templates with `engine.scene.loadFromURL()`, set variables with `engine.variable.setString()`, and export with `engine.block.export()`. This enables batch processing, personalization systems, and automated design production.

```typescript file=@cesdk_web_examples/guides-use-templates-generate-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Generate From Template Guide
 *
 * Demonstrates how to generate finished designs from templates:
 * - Loading templates from URLs
 * - Populating template variables
 * - Finding and updating placeholder content
 * - Exporting to images and creating downloadable files
 * - Batch generation workflows
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Load a template from URL - this template has visible {{variable}} placeholders
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene'
    );
    console.log(
      'Template loaded - variable placeholders like {{first_name}}, {{city}} are now visible on the canvas'
    );

    // Discover available variables in the template
    const allVariables = engine.variable.findAll();
    console.log('Available variables:', allVariables);

    // Wait 3 seconds so users can see the variable placeholders before population
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Set variable values to replace {{variableName}} placeholders
    engine.variable.setString('first_name', 'Alice');
    engine.variable.setString('last_name', 'Smith');
    engine.variable.setString('city', 'Paris');
    engine.variable.setString('address', '10 Rue de Rivoli');
    console.log('Variables populated - placeholders replaced with values');

    // Find all placeholder blocks in the template
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Found placeholders:', placeholders.length);

    // Find specific blocks by name
    const namedBlocks = engine.block.findByName('Image');
    if (namedBlocks.length > 0) {
      console.log('Found image block by name:', namedBlocks[0]);
    }

    // Update image placeholder content
    const imageBlocks = engine.block.findByName('Image');
    if (imageBlocks.length > 0) {
      const imageBlock = imageBlocks[0];
      const fill = engine.block.getFill(imageBlock);
      engine.block.setString(
        fill,
        'fill/image/imageFileURI',
        'https://img.ly/static/ubq_samples/sample_4.jpg'
      );
      console.log('Image placeholder updated');
    }

    // Export the populated template to PNG
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      const page = pages[0];
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      console.log('Exported to PNG:', blob.size, 'bytes');

      // Create downloadable file
      const url = URL.createObjectURL(blob);
      console.log('Download URL created:', url);
      // In a real application, you would trigger a download:
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'greeting-card.png';
      // link.click();
      // URL.revokeObjectURL(url);
    }

    // Export to PDF format
    const scene = engine.scene.get();
    if (scene !== null) {
      const pdfBlob = await engine.block.export(scene, {
        mimeType: 'application/pdf'
      });
      console.log('Exported to PDF:', pdfBlob.size, 'bytes');
    }

    // Demonstrate batch generation workflow
    // Save template for reuse
    const templateString = await engine.scene.saveToString();
    console.log('Template saved for batch processing');

    // Process multiple data records
    const dataRecords = [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        city: 'Paris',
        address: '10 Rue de Rivoli'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        city: 'London',
        address: '221B Baker Street'
      },
      {
        firstName: 'Carol',
        lastName: 'Williams',
        city: 'Tokyo',
        address: '1-1 Shibuya'
      }
    ];

    for (const record of dataRecords) {
      // Reload template for each record
      await engine.scene.loadFromString(templateString);

      // Populate with record data
      engine.variable.setString('first_name', record.firstName);
      engine.variable.setString('last_name', record.lastName);
      engine.variable.setString('city', record.city);
      engine.variable.setString('address', record.address);

      console.log(
        `Processed record for: ${record.firstName} ${record.lastName}`
      );
      // In a real workflow, you would export here:
      // const blob = await engine.block.export(page, { mimeType: 'image/png' });
    }

    console.log(`Batch processed ${dataRecords.length} records`);

    // Reload the original template for display
    await engine.scene.loadFromString(templateString);
    engine.variable.setString('first_name', 'Alice');
    engine.variable.setString('last_name', 'Smith');
    engine.variable.setString('city', 'Paris');
    engine.variable.setString('address', '10 Rue de Rivoli');

    console.log(
      'Generate from template guide initialized. The template demonstrates loading, variable population, and export workflows.'
    );
  }
}

export default Example;
```

This guide covers how to load templates, populate variables, update placeholder content, and export to various formats including batch generation workflows.

## Loading Templates

Load templates from various sources before populating and exporting. Use `engine.scene.loadFromURL()` for remote templates, `engine.scene.loadFromString()` for serialized data, or `engine.scene.loadFromArchiveURL()` for templates with embedded assets.

```typescript highlight=highlight-load-template
// Load a template from URL - this template has visible {{variable}} placeholders
await engine.scene.loadFromURL(
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene'
);
console.log(
  'Template loaded - variable placeholders like {{first_name}}, {{city}} are now visible on the canvas'
);
```

## Populating Variables

CE.SDK's variable system allows you to set values that replace `{{variableName}}` placeholders throughout the template. Before setting variables, you can discover what variables are available using `engine.variable.findAll()`.

### Discover Available Variables

Find all variables defined in a template to understand what data can be populated.

```typescript highlight=highlight-discover-variables
// Discover available variables in the template
const allVariables = engine.variable.findAll();
console.log('Available variables:', allVariables);
```

### Set Variable Values

Use `engine.variable.setString()` to assign values that automatically replace placeholders in text blocks.

```typescript highlight=highlight-populate-variables
// Set variable values to replace {{variableName}} placeholders
engine.variable.setString('first_name', 'Alice');
engine.variable.setString('last_name', 'Smith');
engine.variable.setString('city', 'Paris');
engine.variable.setString('address', '10 Rue de Rivoli');
console.log('Variables populated - placeholders replaced with values');
```

## Updating Placeholder Content

Beyond variables, templates often contain placeholder blocks for images and other content. Find these blocks using `engine.block.findByName()` or `engine.block.findAllPlaceholders()`.

```typescript highlight=highlight-find-placeholders
    // Find all placeholder blocks in the template
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Found placeholders:', placeholders.length);

    // Find specific blocks by name
    const namedBlocks = engine.block.findByName('Image');
    if (namedBlocks.length > 0) {
      console.log('Found image block by name:', namedBlocks[0]);
    }
```

### Update Image Placeholders

Locate image blocks and modify their fill URI using `engine.block.getFill()` and `engine.block.setString()` on the `'fill/image/imageFileURI'` property.

```typescript highlight=highlight-update-image
// Update image placeholder content
const imageBlocks = engine.block.findByName('Image');
if (imageBlocks.length > 0) {
  const imageBlock = imageBlocks[0];
  const fill = engine.block.getFill(imageBlock);
  engine.block.setString(
    fill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_4.jpg'
  );
  console.log('Image placeholder updated');
}
```

## Exporting to Images

Generate image outputs using `engine.block.export()` with options for format, resolution, and quality. Find the page to export with `engine.block.findByType('page')`.

```typescript highlight=highlight-export-image
    // Export the populated template to PNG
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      const page = pages[0];
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      console.log('Exported to PNG:', blob.size, 'bytes');

      // Create downloadable file
      const url = URL.createObjectURL(blob);
      console.log('Download URL created:', url);
      // In a real application, you would trigger a download:
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'greeting-card.png';
      // link.click();
      // URL.revokeObjectURL(url);
    }
```

You can configure export options including `targetWidth` and `targetHeight` for output resolution, `pngCompressionLevel` for PNG files (0-9), and `jpegQuality` for JPEG files (0-1).

## Exporting to PDF

Use `mimeType: 'application/pdf'` to generate PDF documents from design scenes. For multi-page documents, export the scene block rather than individual pages.

```typescript highlight=highlight-export-pdf
// Export to PDF format
const scene = engine.scene.get();
if (scene !== null) {
  const pdfBlob = await engine.block.export(scene, {
    mimeType: 'application/pdf'
  });
  console.log('Exported to PDF:', pdfBlob.size, 'bytes');
}
```

## Batch Generation Workflows

Process multiple data records through a single template. Save the template once with `engine.scene.saveToString()`, then loop through records—reloading the template with `engine.scene.loadFromString()`, populating variables, and exporting for each iteration.

```typescript highlight=highlight-batch-generation
    // Demonstrate batch generation workflow
    // Save template for reuse
    const templateString = await engine.scene.saveToString();
    console.log('Template saved for batch processing');

    // Process multiple data records
    const dataRecords = [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        city: 'Paris',
        address: '10 Rue de Rivoli'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        city: 'London',
        address: '221B Baker Street'
      },
      {
        firstName: 'Carol',
        lastName: 'Williams',
        city: 'Tokyo',
        address: '1-1 Shibuya'
      }
    ];

    for (const record of dataRecords) {
      // Reload template for each record
      await engine.scene.loadFromString(templateString);

      // Populate with record data
      engine.variable.setString('first_name', record.firstName);
      engine.variable.setString('last_name', record.lastName);
      engine.variable.setString('city', record.city);
      engine.variable.setString('address', record.address);

      console.log(
        `Processed record for: ${record.firstName} ${record.lastName}`
      );
      // In a real workflow, you would export here:
      // const blob = await engine.block.export(page, { mimeType: 'image/png' });
    }

    console.log(`Batch processed ${dataRecords.length} records`);
```

## Troubleshooting

### Template Loading Fails

Verify URL accessibility and scene format version compatibility. Wrap loading calls in try-catch blocks to handle network or parsing errors. Ensure the URL returns valid scene data and not HTML or other content.

### Variables Not Updating

Ensure variable names in text blocks (within `{{}}`) exactly match keys passed to `engine.variable.setString()`. Variable names are case-sensitive. Use `engine.variable.findAll()` to discover available variable names.

### Export Returns Empty or Corrupted Output

Confirm all required assets are accessible before exporting. Check that blocks are attached to the page hierarchy—orphaned blocks won't appear in exports. Verify the page has visible content by checking block visibility states.

### Image Placeholders Not Found

Verify the exact name string matches what's set in the template. Names are case-sensitive. Use `engine.block.findAllPlaceholders()` to discover all placeholder blocks in the scene.

## API Reference

| Method | Description |
|--------|-------------|
| `scene.loadFromURL(url)` | Load template from remote URL |
| `scene.loadFromString(data)` | Load template from serialized string |
| `scene.loadFromArchiveURL(url)` | Load archived template with embedded assets |
| `scene.saveToString()` | Serialize scene for batch processing |
| `variable.setString(name, value)` | Set text variable value |
| `variable.getString(name)` | Retrieve current variable value |
| `variable.findAll()` | List all variable names in scene |
| `block.findByName(name)` | Find blocks by name identifier |
| `block.findByType(type)` | Find blocks by type (e.g., 'page') |
| `block.findAllPlaceholders()` | Discover all placeholder blocks |
| `block.getFill(block)` | Get fill block from graphic block |
| `block.setString(block, property, value)` | Set string properties like image URIs |
| `block.export(block, options)` | Export block to image or PDF blob |



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support