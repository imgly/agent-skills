> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Create From Scratch](./create-templates/from-scratch.md)

---

Build reusable design templates entirely through code using CE.SDK's programmatic APIs for automation, batch generation, and custom template creation tools.

![Create Templates From Scratch](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-from-scratch-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-from-scratch-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-templates-from-scratch-browser/)

CE.SDK provides a complete API for building design templates through code. Instead of starting from an existing template, you can create a blank scene, define page dimensions, add text and graphic blocks, configure placeholders for swappable media, add text variables for dynamic content, apply editing constraints to protect layout integrity, and save the template for reuse. This approach enables automation workflows, batch template generation, and integration with custom template creation tools.

```typescript file=@cesdk_web_examples/guides-create-templates-from-scratch-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Create Templates From Scratch Guide
 *
 * Demonstrates building a reusable promotional card template entirely in code:
 * - Creating a blank scene with print-ready dimensions (1200x1600)
 * - Adding text blocks with variable tokens and proper font styling
 * - Adding graphic blocks as image placeholders using addImage()
 * - Configuring placeholder behavior for swappable media
 * - Applying editing constraints (scopes) to protect layout integrity
 * - Saving the template in multiple formats
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

    // Template layout constants for a promotional card
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 1000;
    const PADDING = 40;
    const CONTENT_WIDTH = CANVAS_WIDTH - PADDING * 2;

    // Create a blank scene with custom dimensions
    engine.scene.create('Free', {
      page: { size: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } }
    });

    // Set design unit to Pixel for precise coordinate mapping
    engine.scene.setDesignUnit('Pixel');

    // Get the page that was automatically created
    const page = engine.block.findByType('page')[0];

    // Set a gradient background for the template
    const backgroundFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(backgroundFill, 'fill/gradient/colors', [
      { color: { r: 0.4, g: 0.2, b: 0.6, a: 1.0 }, stop: 0 }, // Purple
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 } // Blue
    ]);
    engine.block.setFill(page, backgroundFill);

    // Font URIs for consistent typography
    const FONT_BOLD =
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf';
    const FONT_REGULAR =
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf';

    // Create headline text block with {{title}} variable
    const headline = engine.block.create('text');
    engine.block.replaceText(headline, '{{title}}');

    // Set font with proper typeface for consistent rendering
    engine.block.setFont(headline, FONT_BOLD, {
      name: 'Roboto',
      fonts: [{ uri: FONT_BOLD, subFamily: 'Bold', weight: 'bold' }]
    });
    engine.block.setFloat(headline, 'text/fontSize', 28);
    engine.block.setTextColor(headline, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });

    // Position and size the headline
    engine.block.setWidthMode(headline, 'Absolute');
    engine.block.setHeightMode(headline, 'Auto');
    engine.block.setWidth(headline, CONTENT_WIDTH);
    engine.block.setPositionX(headline, PADDING);
    engine.block.setPositionY(headline, 50);
    engine.block.setEnum(headline, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, headline);

    // Set default value for the title variable
    engine.variable.setString('title', 'Summer Sale');

    // Create subheadline text block with {{subtitle}} variable
    const subheadline = engine.block.create('text');
    engine.block.replaceText(subheadline, '{{subtitle}}');

    engine.block.setFont(subheadline, FONT_REGULAR, {
      name: 'Roboto',
      fonts: [{ uri: FONT_REGULAR, subFamily: 'Regular', weight: 'normal' }]
    });
    engine.block.setFloat(subheadline, 'text/fontSize', 14);
    engine.block.setTextColor(subheadline, { r: 0.9, g: 0.9, b: 0.95, a: 1.0 });

    engine.block.setWidthMode(subheadline, 'Absolute');
    engine.block.setHeightMode(subheadline, 'Auto');
    engine.block.setWidth(subheadline, CONTENT_WIDTH);
    engine.block.setPositionX(subheadline, PADDING);
    engine.block.setPositionY(subheadline, 175);
    engine.block.setEnum(subheadline, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, subheadline);

    engine.variable.setString('subtitle', 'Up to 50% off all items');

    // Create image placeholder in the center of the card
    const imageBlock = engine.block.create('graphic');
    const imageShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, imageShape);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    engine.block.setWidth(imageBlock, CONTENT_WIDTH);
    engine.block.setHeight(imageBlock, 420);
    engine.block.setPositionX(imageBlock, PADDING);
    engine.block.setPositionY(imageBlock, 295);
    engine.block.appendChild(page, imageBlock);

    // Enable placeholder behavior on the image fill
    const fill = engine.block.getFill(imageBlock);
    if (fill !== null && engine.block.supportsPlaceholderBehavior(fill)) {
      engine.block.setPlaceholderBehaviorEnabled(fill, true);
    }
    engine.block.setPlaceholderEnabled(imageBlock, true);

    // Enable visual controls for the placeholder
    engine.block.setPlaceholderControlsOverlayEnabled(imageBlock, true);
    engine.block.setPlaceholderControlsButtonEnabled(imageBlock, true);

    // Create CTA (call-to-action) text block with {{cta}} variable
    const cta = engine.block.create('text');
    engine.block.replaceText(cta, '{{cta}}');

    engine.block.setFont(cta, FONT_BOLD, {
      name: 'Roboto',
      fonts: [{ uri: FONT_BOLD, subFamily: 'Bold', weight: 'bold' }]
    });
    engine.block.setFloat(cta, 'text/fontSize', 8.4);
    engine.block.setTextColor(cta, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });

    engine.block.setWidthMode(cta, 'Absolute');
    engine.block.setHeightMode(cta, 'Auto');
    engine.block.setWidth(cta, CONTENT_WIDTH);
    engine.block.setPositionX(cta, PADDING);
    engine.block.setPositionY(cta, 765);
    engine.block.setEnum(cta, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, cta);

    engine.variable.setString('cta', 'Learn More');

    // Set global scope to 'Defer' for per-block control
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('layer/resize', 'Defer');

    // Lock all text block positions but allow text editing
    const textBlocks = [headline, subheadline, cta];
    textBlocks.forEach((block) => {
      engine.block.setScopeEnabled(block, 'layer/move', false);
      engine.block.setScopeEnabled(block, 'layer/resize', false);
    });

    // Lock image position but allow fill replacement
    engine.block.setScopeEnabled(imageBlock, 'layer/move', false);
    engine.block.setScopeEnabled(imageBlock, 'layer/resize', false);
    engine.block.setScopeEnabled(imageBlock, 'fill/change', true);

    // Register role toggle component for switching between Creator and Adopter
    cesdk.ui.registerComponent('role.toggle', ({ builder }) => {
      const role = engine.editor.getRole();
      builder.ButtonGroup('role-toggle', {
        children: () => {
          builder.Button('creator-btn', {
            label: 'Creator',
            isActive: role === 'Creator',
            onClick: () => engine.editor.setRole('Creator')
          });
          builder.Button('adopter-btn', {
            label: 'Adopter',
            isActive: role === 'Adopter',
            onClick: () => engine.editor.setRole('Adopter')
          });
        }
      });
    });

    // Register button component for saving template as string
    cesdk.ui.registerComponent('save.string', ({ builder }) => {
      builder.Button('save-string-btn', {
        label: 'Save String',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          const templateString = await engine.scene.saveToString();
          console.log(
            'Template saved as string:',
            templateString.substring(0, 100) + '...'
          );
          // Download the string as a file
          const blob = new Blob([templateString], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'template.scene';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    });

    // Register button component for saving template as archive
    cesdk.ui.registerComponent('save.archive', ({ builder }) => {
      builder.Button('save-archive-btn', {
        label: 'Save Archive',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          const templateArchive = await engine.scene.saveToArchive();
          console.log(
            'Template saved as archive:',
            templateArchive.size,
            'bytes'
          );
          // Download the archive as a file
          const url = URL.createObjectURL(templateArchive);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'template.zip';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    });

    // Add role toggle and save buttons to the navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'role.toggle');
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'save.string');
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'save.archive');

    // Enable auto-fit zoom to continuously fit the page with padding
    engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);
  }
}

export default Example;
```

This guide covers how to create a blank scene, add text blocks with variables, add image placeholders, apply editing constraints, and save the template.

## Initialize CE.SDK

We start by initializing CE.SDK and loading the asset sources. The `cesdk.addDefaultAssetSources()` and `cesdk.addDemoAssetSources()` methods provide access to fonts, images, and other assets.

```typescript highlight=highlight-setup
    // Initialize CE.SDK with Design mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;
```

## Create a Blank Scene

We create the foundation of our template with custom page dimensions. The `engine.scene.create()` method accepts page options to set width, height, and background color.

```typescript highlight=highlight-create-scene
    // Template layout constants for a promotional card
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 1000;
    const PADDING = 40;
    const CONTENT_WIDTH = CANVAS_WIDTH - PADDING * 2;

    // Create a blank scene with custom dimensions
    engine.scene.create('Free', {
      page: { size: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } }
    });

    // Set design unit to Pixel for precise coordinate mapping
    engine.scene.setDesignUnit('Pixel');
```

The scene creation method accepts a layout mode (`'Free'` for design mode) and optional page configuration. When options are provided, the scene automatically includes a page with the specified dimensions.

## Set Page Background

We set a light background color to give the template a consistent base appearance.

```typescript highlight=highlight-add-background
// Set a gradient background for the template
const backgroundFill = engine.block.createFill('gradient/linear');
engine.block.setGradientColorStops(backgroundFill, 'fill/gradient/colors', [
  { color: { r: 0.4, g: 0.2, b: 0.6, a: 1.0 }, stop: 0 }, // Purple
  { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 } // Blue
]);
engine.block.setFill(page, backgroundFill);
```

We create a color fill using `engine.block.createFill('color')`, set the color via `engine.block.setColor()` with the `fill/color/value` property, then assign the fill to the page using `engine.block.setFill()`.

## Add Text Blocks

Text blocks allow you to add styled text content. We create a headline that includes a variable token for dynamic content.

```typescript highlight=highlight-add-text
    // Create headline text block with {{title}} variable
    const headline = engine.block.create('text');
    engine.block.replaceText(headline, '{{title}}');

    // Set font with proper typeface for consistent rendering
    engine.block.setFont(headline, FONT_BOLD, {
      name: 'Roboto',
      fonts: [{ uri: FONT_BOLD, subFamily: 'Bold', weight: 'bold' }]
    });
    engine.block.setFloat(headline, 'text/fontSize', 28);
    engine.block.setTextColor(headline, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });

    // Position and size the headline
    engine.block.setWidthMode(headline, 'Absolute');
    engine.block.setHeightMode(headline, 'Auto');
    engine.block.setWidth(headline, CONTENT_WIDTH);
    engine.block.setPositionX(headline, PADDING);
    engine.block.setPositionY(headline, 50);
    engine.block.setEnum(headline, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, headline);
```

We create a text block using `engine.block.create('text')`, set its content with `engine.block.replaceText()`, configure dimensions and position, and append it to the page using `engine.block.appendChild()`.

## Add Text Variables

Text variables enable data-driven personalization. By using `{{variableName}}` tokens in text blocks, you can populate content programmatically.

```typescript highlight=highlight-add-variable
// Set default value for the title variable
engine.variable.setString('title', 'Summer Sale');
```

The `engine.variable.setString()` method sets the default value for the variable. When the template is used, this value can be changed to personalize the content.

## Add Graphic Blocks

Graphic blocks serve as containers for images. We create an image block that will become a placeholder for swappable media.

```typescript highlight=highlight-add-graphic
    // Create image placeholder in the center of the card
    const imageBlock = engine.block.create('graphic');
    const imageShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, imageShape);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    engine.block.setWidth(imageBlock, CONTENT_WIDTH);
    engine.block.setHeight(imageBlock, 420);
    engine.block.setPositionX(imageBlock, PADDING);
    engine.block.setPositionY(imageBlock, 295);
    engine.block.appendChild(page, imageBlock);
```

We create a graphic block with `engine.block.create('graphic')`, assign a rectangle shape using `engine.block.createShape('rect')` and `engine.block.setShape()`, create an image fill with `engine.block.createFill('image')`, set the image URI via `engine.block.setString()`, and position it on the page.

## Configure Placeholders

Placeholders turn design blocks into drop-zones where users can swap content while maintaining layout integrity. We enable placeholder behavior on the image fill and configure visual controls.

```typescript highlight=highlight-configure-placeholder
    // Enable placeholder behavior on the image fill
    const fill = engine.block.getFill(imageBlock);
    if (fill !== null && engine.block.supportsPlaceholderBehavior(fill)) {
      engine.block.setPlaceholderBehaviorEnabled(fill, true);
    }
    engine.block.setPlaceholderEnabled(imageBlock, true);

    // Enable visual controls for the placeholder
    engine.block.setPlaceholderControlsOverlayEnabled(imageBlock, true);
    engine.block.setPlaceholderControlsButtonEnabled(imageBlock, true);
```

Placeholder behavior is enabled on the fill (not the block) for graphic blocks. We also enable the overlay pattern and replace button for visual guidance.

## Apply Editing Constraints

Editing constraints protect template elements by restricting what users can modify. We use scopes to lock position and size while allowing content changes.

```typescript highlight=highlight-apply-constraints
    // Set global scope to 'Defer' for per-block control
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('layer/resize', 'Defer');

    // Lock all text block positions but allow text editing
    const textBlocks = [headline, subheadline, cta];
    textBlocks.forEach((block) => {
      engine.block.setScopeEnabled(block, 'layer/move', false);
      engine.block.setScopeEnabled(block, 'layer/resize', false);
    });

    // Lock image position but allow fill replacement
    engine.block.setScopeEnabled(imageBlock, 'layer/move', false);
    engine.block.setScopeEnabled(imageBlock, 'layer/resize', false);
    engine.block.setScopeEnabled(imageBlock, 'fill/change', true);
```

Setting global scope to `'Defer'` enables per-block control. We then disable movement and resizing for both blocks while enabling fill changes for the image placeholder.

## Save the Template

We persist the template in two formats: a lightweight string for CDN-hosted assets and a self-contained archive with embedded assets.

```typescript highlight=highlight-save-template
    // Register button component for saving template as string
    cesdk.ui.registerComponent('save.string', ({ builder }) => {
      builder.Button('save-string-btn', {
        label: 'Save String',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          const templateString = await engine.scene.saveToString();
          console.log(
            'Template saved as string:',
            templateString.substring(0, 100) + '...'
          );
          // Download the string as a file
          const blob = new Blob([templateString], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'template.scene';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    });

    // Register button component for saving template as archive
    cesdk.ui.registerComponent('save.archive', ({ builder }) => {
      builder.Button('save-archive-btn', {
        label: 'Save Archive',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          const templateArchive = await engine.scene.saveToArchive();
          console.log(
            'Template saved as archive:',
            templateArchive.size,
            'bytes'
          );
          // Download the archive as a file
          const url = URL.createObjectURL(templateArchive);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'template.zip';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    });

    // Add role toggle and save buttons to the navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'role.toggle');
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'save.string');
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'save.archive');
```

The `engine.scene.saveToString()` method creates a compact string format suitable for storage when assets are hosted externally. The `engine.scene.saveToArchive()` method creates a ZIP bundle containing all assets, ideal for offline use or distribution.

## Troubleshooting

- **Blocks not appearing**: Verify that `engine.block.appendChild()` attaches blocks to the page. Blocks must be part of the scene hierarchy to render.
- **Variables not resolving**: Verify the variable name in the text matches exactly, including curly braces syntax `{{variableName}}`.
- **Placeholder not interactive**: Ensure `engine.block.setPlaceholderEnabled()` is called on the block and the appropriate scope (`fill/change`) is enabled.
- **Constraints not enforced**: Verify `engine.editor.setGlobalScope()` is set to `'Defer'` before setting per-block scopes.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.create()` | Create a new design scene with optional page size |
| `engine.scene.setDesignUnit()` | Set the design unit (Pixel, Millimeter, Inch) |
| `engine.scene.saveToString()` | Save scene to string format |
| `engine.scene.saveToArchive()` | Save scene to ZIP archive |
| `engine.block.create()` | Create a design block (page, text, graphic) |
| `engine.block.appendChild()` | Append a child block to a parent |
| `engine.block.findByType()` | Find blocks by their type |
| `engine.block.createFill()` | Create a fill (color, image, etc.) |
| `engine.block.setFill()` | Assign a fill to a block |
| `engine.block.getFill()` | Get the fill of a block |
| `engine.block.createShape()` | Create a shape (rect, ellipse, etc.) |
| `engine.block.setShape()` | Assign a shape to a graphic block |
| `engine.block.setString()` | Set a string property on a block |
| `engine.block.setColor()` | Set a color property |
| `engine.block.replaceText()` | Set text content |
| `engine.block.setFont()` | Set font with typeface |
| `engine.block.setPlaceholderBehaviorEnabled()` | Enable placeholder behavior on fill |
| `engine.block.setPlaceholderEnabled()` | Enable placeholder interaction on block |
| `engine.block.setPlaceholderControlsOverlayEnabled()` | Enable overlay visual control |
| `engine.block.setPlaceholderControlsButtonEnabled()` | Enable button visual control |
| `engine.variable.setString()` | Set a text variable value |
| `engine.editor.setGlobalScope()` | Set global scope permission |
| `engine.block.setScopeEnabled()` | Enable/disable scope on a block |

## Next Steps

- [Placeholders](./create-templates/add-dynamic-content/placeholders.md) - Configure placeholder behavior and visual controls in depth
- [Text Variables](./create-templates/add-dynamic-content/text-variables.md) - Implement dynamic text personalization with variables
- [Set Editing Constraints](./create-templates/add-dynamic-content/set-editing-constraints.md) - Lock layout properties to protect design integrity
- [Add to Template Library](./create-templates/add-to-template-library.md) - Register templates in the asset library for users to discover



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support