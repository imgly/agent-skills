> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Insert Dynamic Content](./create-templates/add-dynamic-content.md) > [Placeholders](./create-templates/add-dynamic-content/placeholders.md)

---

Placeholders turn design blocks into drop-zones that users can swap content into while maintaining full control over layout and styling.

![Placeholders example showing various configurations of placeholder behavior, controls, and interaction modes](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-dynamic-content-placeholders-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-dynamic-content-placeholders-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-templates-dynamic-content-placeholders-browser/)

```typescript file=@cesdk_web_examples/guides-create-templates-dynamic-content-placeholders-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Dynamic Content Placeholders
 *
 * This example demonstrates three different placeholder configurations:
 * 1. All placeholder controls enabled (all scopes + behavior + controls)
 * 2. Fill properties only (fill scopes + behavior + controls)
 * 3. No placeholder features (default state)
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDemoAssetSources();
    await cesdk.addDefaultAssetSources();

    // Create a design scene using CE.SDK method
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    engine.editor.setRole('Adopter');

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page dimensions for horizontal layout
    const pageWidth = 1200;
    const pageHeight = 800;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Set page background to light gray
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Layout configuration for 3 blocks horizontally
    const blockWidth = 300;
    const blockHeight = 300;
    const spacing = 50;
    const startX = (pageWidth - blockWidth * 3 - spacing * 2) / 2;
    const blockY = (pageHeight - blockHeight) / 2 + 40; // Offset for labels
    const labelY = blockY - 50;

    // Sample images
    const imageUri1 = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageUri2 = 'https://img.ly/static/ubq_samples/sample_2.jpg';
    const imageUri3 = 'https://img.ly/static/ubq_samples/sample_3.jpg';

    // Define ALL available scopes for reference
    const allScopes: Array<
      | 'text/edit'
      | 'text/character'
      | 'fill/change'
      | 'fill/changeType'
      | 'stroke/change'
      | 'shape/change'
      | 'layer/move'
      | 'layer/resize'
      | 'layer/rotate'
      | 'layer/flip'
      | 'layer/crop'
      | 'layer/opacity'
      | 'layer/blendMode'
      | 'layer/visibility'
      | 'layer/clipping'
      | 'appearance/adjustments'
      | 'appearance/filter'
      | 'appearance/effect'
      | 'appearance/blur'
      | 'appearance/shadow'
      | 'appearance/animation'
      | 'lifecycle/destroy'
      | 'lifecycle/duplicate'
      | 'editor/add'
      | 'editor/select'
    > = [
      'text/edit',
      'text/character',
      'fill/change',
      'fill/changeType',
      'stroke/change',
      'shape/change',
      'layer/move',
      'layer/resize',
      'layer/rotate',
      'layer/flip',
      'layer/crop',
      'layer/opacity',
      'layer/blendMode',
      'layer/visibility',
      'layer/clipping',
      'appearance/adjustments',
      'appearance/filter',
      'appearance/effect',
      'appearance/blur',
      'appearance/shadow',
      'appearance/animation',
      'lifecycle/destroy',
      'lifecycle/duplicate',
      'editor/add',
      'editor/select'
    ];

    // Block 1: All Placeholder Controls Enabled
    const block1 = await engine.block.addImage(imageUri1, {
      size: {
        width: blockWidth,
        height: blockHeight
      }
    });
    engine.block.appendChild(page, block1);
    engine.block.setPositionX(block1, startX);
    engine.block.setPositionY(block1, blockY);

    // Step 1: Explicitly disable ALL scopes first
    allScopes.forEach((scope) => {
      engine.block.setScopeEnabled(block1, scope, false);
    });

    // Step 2: Enable specific scopes for full placeholder functionality
    // General/Layer options
    engine.block.setScopeEnabled(block1, 'layer/opacity', true);
    engine.block.setScopeEnabled(block1, 'layer/blendMode', true);
    engine.block.setScopeEnabled(block1, 'lifecycle/duplicate', true);
    engine.block.setScopeEnabled(block1, 'lifecycle/destroy', true);

    // Arrange scopes
    engine.block.setScopeEnabled(block1, 'layer/move', true);
    engine.block.setScopeEnabled(block1, 'layer/resize', true);
    engine.block.setScopeEnabled(block1, 'layer/rotate', true);
    engine.block.setScopeEnabled(block1, 'layer/flip', true);

    // Fill scopes (for image replacement and cropping)
    engine.block.setScopeEnabled(block1, 'fill/change', true);
    engine.block.setScopeEnabled(block1, 'fill/changeType', true);
    engine.block.setScopeEnabled(block1, 'layer/crop', true);

    // Appearance scopes
    engine.block.setScopeEnabled(block1, 'appearance/adjustments', true);
    engine.block.setScopeEnabled(block1, 'appearance/filter', true);
    engine.block.setScopeEnabled(block1, 'appearance/effect', true);
    engine.block.setScopeEnabled(block1, 'appearance/blur', true);
    engine.block.setScopeEnabled(block1, 'appearance/shadow', true);
    engine.block.setScopeEnabled(block1, 'appearance/animation', true);
    engine.block.setScopeEnabled(block1, 'editor/select', true);

    // Step 3: Enable placeholder behavior ("Act as a placeholder")
    // This makes the block interactive in Adopter mode
    engine.block.setPlaceholderEnabled(block1, true);

    // Step 4: Check if block/fill supports placeholder features
    const fill1 = engine.block.getFill(block1);
    const supportsBehavior = engine.block.supportsPlaceholderBehavior(fill1);
    const supportsControls = engine.block.supportsPlaceholderControls(block1);

    // Enable placeholder behavior on the fill (for graphic blocks)
    if (supportsBehavior) {
      engine.block.setPlaceholderBehaviorEnabled(fill1, true);
    }

    // Enable placeholder overlay pattern
    if (supportsControls) {
      engine.block.setPlaceholderControlsOverlayEnabled(block1, true);
    }

    // Enable placeholder button
    if (supportsControls) {
      engine.block.setPlaceholderControlsButtonEnabled(block1, true);
    }

    // Complete "Act as Placeholder" setup
    const fillForConfig = engine.block.getFill(block1);
    if (engine.block.supportsPlaceholderBehavior(fillForConfig)) {
      engine.block.setPlaceholderBehaviorEnabled(fillForConfig, true);
    }
    if (supportsControls) {
      engine.block.setPlaceholderControlsOverlayEnabled(block1, true);
      engine.block.setPlaceholderControlsButtonEnabled(block1, true);
    }

    // Block 2: Fill Properties Only
    const block2 = await engine.block.addImage(imageUri2, {
      size: {
        width: blockWidth,
        height: blockHeight
      }
    });
    engine.block.appendChild(page, block2);
    engine.block.setPositionX(block2, startX + blockWidth + spacing);
    engine.block.setPositionY(block2, blockY);

    // Batch operation: Apply settings to multiple blocks
    const graphicBlocks = [block1, block2];
    graphicBlocks.forEach((block) => {
      // Enable placeholder for each block
      engine.block.setPlaceholderEnabled(block, true);

      const fill = engine.block.getFill(block);
      if (engine.block.supportsPlaceholderBehavior(fill)) {
        engine.block.setPlaceholderBehaviorEnabled(fill, true);
      }
    });

    // Step 1: Explicitly disable ALL scopes first
    allScopes.forEach((scope) => {
      engine.block.setScopeEnabled(block2, scope, false);
    });

    // Step 2: Enable ONLY fill-related scopes
    engine.block.setScopeEnabled(block2, 'fill/change', true);
    engine.block.setScopeEnabled(block2, 'fill/changeType', true);
    engine.block.setScopeEnabled(block2, 'layer/crop', true);
    engine.block.setScopeEnabled(block2, 'editor/select', true);

    // Step 3: Enable placeholder behavior ("Act as a placeholder")
    engine.block.setPlaceholderEnabled(block2, true);

    // Step 4: Enable fill-based placeholder behavior and visual controls
    const fill2 = engine.block.getFill(block2);
    if (engine.block.supportsPlaceholderBehavior(fill2)) {
      engine.block.setPlaceholderBehaviorEnabled(fill2, true);
    }

    if (engine.block.supportsPlaceholderControls(block2)) {
      engine.block.setPlaceholderControlsOverlayEnabled(block2, true);
      engine.block.setPlaceholderControlsButtonEnabled(block2, true);
    }

    // Block 3: No Placeholder Features (Default State)
    const block3 = await engine.block.addImage(imageUri3, {
      size: {
        width: blockWidth,
        height: blockHeight
      }
    });
    engine.block.appendChild(page, block3);
    engine.block.setPositionX(block3, startX + (blockWidth + spacing) * 2);
    engine.block.setPositionY(block3, blockY);

    // Explicitly disable ALL scopes to ensure default state
    allScopes.forEach((scope) => {
      engine.block.setScopeEnabled(block3, scope, false);
    });

    // No placeholder behavior enabled - this block remains non-interactive

    // Add descriptive labels above each block
    const labelConfig = {
      height: 40,
      fontSize: 34,
      fontUri:
        'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf',
      fontFamily: 'Roboto'
    };

    // Label for Block 1
    const label1 = engine.block.create('text');
    engine.block.appendChild(page, label1);
    engine.block.setPositionX(label1, startX);
    engine.block.setPositionY(label1, labelY);
    engine.block.setWidth(label1, blockWidth);
    engine.block.setHeight(label1, labelConfig.height);
    engine.block.replaceText(label1, 'All Controls');
    engine.block.setTextColor(label1, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFont(label1, labelConfig.fontUri, {
      name: labelConfig.fontFamily,
      fonts: [
        {
          uri: labelConfig.fontUri,
          subFamily: 'Bold'
        }
      ]
    });
    engine.block.setFloat(label1, 'text/fontSize', labelConfig.fontSize);
    engine.block.setEnum(label1, 'text/horizontalAlignment', 'Center');

    // Label for Block 2
    const label2 = engine.block.create('text');
    engine.block.appendChild(page, label2);
    engine.block.setPositionX(label2, startX + blockWidth + spacing);
    engine.block.setPositionY(label2, labelY);
    engine.block.setWidth(label2, blockWidth);
    engine.block.setHeight(label2, labelConfig.height);
    engine.block.replaceText(label2, 'Fill Only');
    engine.block.setTextColor(label2, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFont(label2, labelConfig.fontUri, {
      name: labelConfig.fontFamily,
      fonts: [
        {
          uri: labelConfig.fontUri,
          subFamily: 'Bold'
        }
      ]
    });
    engine.block.setFloat(label2, 'text/fontSize', labelConfig.fontSize);
    engine.block.setEnum(label2, 'text/horizontalAlignment', 'Center');

    // Label for Block 3
    const label3 = engine.block.create('text');
    engine.block.appendChild(page, label3);
    engine.block.setPositionX(label3, startX + (blockWidth + spacing) * 2);
    engine.block.setPositionY(label3, labelY);
    engine.block.setWidth(label3, blockWidth);
    engine.block.setHeight(label3, labelConfig.height);
    engine.block.replaceText(label3, 'Disabled');
    engine.block.setTextColor(label3, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFont(label3, labelConfig.fontUri, {
      name: labelConfig.fontFamily,
      fonts: [
        {
          uri: labelConfig.fontUri,
          subFamily: 'Bold'
        }
      ]
    });
    engine.block.setFloat(label3, 'text/fontSize', labelConfig.fontSize);
    engine.block.setEnum(label3, 'text/horizontalAlignment', 'Center');

    // Verify configurations
    // eslint-disable-next-line no-console
    console.log('Block 1 - All Controls:');
    // eslint-disable-next-line no-console
    console.log(
      '  Placeholder enabled:',
      engine.block.isPlaceholderEnabled(block1)
    );
    // eslint-disable-next-line no-console
    console.log('  Scopes enabled:');
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/move:',
      engine.block.isScopeEnabled(block1, 'layer/move')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/resize:',
      engine.block.isScopeEnabled(block1, 'layer/resize')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - fill/change:',
      engine.block.isScopeEnabled(block1, 'fill/change')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/crop:',
      engine.block.isScopeEnabled(block1, 'layer/crop')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - appearance/adjustments:',
      engine.block.isScopeEnabled(block1, 'appearance/adjustments')
    );

    // eslint-disable-next-line no-console
    console.log('\nBlock 2 - Fill Only:');
    // eslint-disable-next-line no-console
    console.log(
      '  Placeholder enabled:',
      engine.block.isPlaceholderEnabled(block2)
    );
    // eslint-disable-next-line no-console
    console.log('  Scopes enabled:');
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/move:',
      engine.block.isScopeEnabled(block2, 'layer/move')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - fill/change:',
      engine.block.isScopeEnabled(block2, 'fill/change')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - fill/changeType:',
      engine.block.isScopeEnabled(block2, 'fill/changeType')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/crop:',
      engine.block.isScopeEnabled(block2, 'layer/crop')
    );

    // eslint-disable-next-line no-console
    console.log('\nBlock 3 - Disabled:');
    // eslint-disable-next-line no-console
    console.log(
      '  Placeholder enabled:',
      engine.block.isPlaceholderEnabled(block3)
    );
    // eslint-disable-next-line no-console
    console.log('  Scopes enabled:');
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/move:',
      engine.block.isScopeEnabled(block3, 'layer/move')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - fill/change:',
      engine.block.isScopeEnabled(block3, 'fill/change')
    );

    // eslint-disable-next-line no-console
    console.log('\nPlaceholder configurations initialized successfully');
  }
}

export default Example;
```

This guide covers placeholder fundamentals, checking support, enabling behavior, and configuring visual controls for graphic and text blocks.

## Placeholder Fundamentals

Placeholders convert design blocks into interactive drop-zones where users can swap content while maintaining layout and styling control.

### Two Distinct Features

**Placeholder behavior** enables drag-and-drop replacement and exposes scope checks for content validation.

**Placeholder controls** provide visual affordances: an overlay pattern and a "Replace" button for guided interaction.

### Block-Level vs Fill-Level Behavior

The key distinction in placeholder implementation depends on block type:

**For graphic blocks** (images/videos): Placeholder behavior is enabled on the **fill**, while controls are enabled on the **block**. This pattern reflects how graphic blocks contain fills that can be replaced.

**For text blocks**: Placeholder behavior and controls are both enabled directly on the **block**.

We can check support with `supportsPlaceholderBehavior()` for both blocks and fills, and `supportsPlaceholderControls()` for blocks.

## Checking Placeholder Support

Before enabling placeholder features, check if a block supports them:

```typescript highlight-check-support
// Step 4: Check if block/fill supports placeholder features
const fill1 = engine.block.getFill(block1);
const supportsBehavior = engine.block.supportsPlaceholderBehavior(fill1);
const supportsControls = engine.block.supportsPlaceholderControls(block1);
```

The `supportsPlaceholderBehavior()` method indicates whether a block can become a drop-zone. The `supportsPlaceholderControls()` method shows if visual controls (overlay and button) are available.

## Enabling Placeholder Behavior

To convert a block into a placeholder drop-zone, enable placeholder behavior. The approach differs based on block type.

### For Graphic Blocks (Images/Videos)

For graphic blocks, placeholder behavior must be enabled on the **fill**, not the block itself:

```typescript highlight-enable-behavior
// Enable placeholder behavior on the fill (for graphic blocks)
if (supportsBehavior) {
  engine.block.setPlaceholderBehaviorEnabled(fill1, true);
}
```

This pattern is critical: `setPlaceholderBehaviorEnabled()` is called on the fill obtained from `block.getFill()`. This reflects the underlying architecture where graphic blocks contain replaceable fills.

### For Text Blocks

For text blocks, placeholder behavior is enabled directly on the block, as text blocks don't use fills in the same way.

We can verify placeholder behavior state with `isPlaceholderBehaviorEnabled()` on the appropriate target (fill for graphics, block for text).

## Enabling Adopter Mode Interaction

Placeholder behavior alone isn't enough - blocks must also be enabled for interaction in Adopter mode:

```typescript highlight-enable-adopter-mode
// Step 3: Enable placeholder behavior ("Act as a placeholder")
// This makes the block interactive in Adopter mode
engine.block.setPlaceholderEnabled(block1, true);
```

The `setPlaceholderEnabled()` method controls whether the placeholder is interactive for users in Adopter role. CE.SDK distinguishes Creator (full access) and Adopter (replace-only) roles.

### Automatic Management

In practice, `setPlaceholderEnabled()` is typically managed automatically by the editor: when you enable relevant scopes (like `fill/change` for graphics or `text/edit` for text), the placeholder interaction is automatically enabled. When all scopes are disabled, placeholder interaction is automatically disabled. This automatic behavior simplifies template creation workflows.

## Configuring Visual Feedback

Placeholders can display visual indicators to guide users through the replacement workflow.

### Combined Setup: The "Act as Placeholder" Pattern

In the CE.SDK UI, the "Act as Placeholder" checkbox enables placeholder behavior and both visual controls simultaneously. This combined pattern is the recommended approach:

```typescript highlight-full-configuration
// Complete "Act as Placeholder" setup
const fillForConfig = engine.block.getFill(block1);
if (engine.block.supportsPlaceholderBehavior(fillForConfig)) {
  engine.block.setPlaceholderBehaviorEnabled(fillForConfig, true);
}
if (supportsControls) {
  engine.block.setPlaceholderControlsOverlayEnabled(block1, true);
  engine.block.setPlaceholderControlsButtonEnabled(block1, true);
}
```

This pattern ensures placeholder behavior is enabled on the appropriate target (fill for graphics, block for text) along with both visual controls on the block.

### Individual Control Options

Visual controls can also be managed independently if needed:

**Overlay Pattern** - The overlay shows a dotted surface indicating a drop-zone:

```typescript highlight-enable-overlay
// Enable placeholder overlay pattern
if (supportsControls) {
  engine.block.setPlaceholderControlsOverlayEnabled(block1, true);
}
```

**Replace Button** - The button provides a single-tap entry point for touch devices:

```typescript highlight-enable-button
// Enable placeholder button
if (supportsControls) {
  engine.block.setPlaceholderControlsButtonEnabled(block1, true);
}
```

Individual control is useful when you want specific visual feedback without the full placeholder workflow.

## Scope Requirements and Dependencies

Placeholders depend on specific scopes being enabled to function correctly. Understanding these dependencies prevents common configuration errors.

For graphic blocks (images/videos), the `fill/change` scope must be enabled before placeholder behavior will work. When you disable `fill/change`, the editor automatically disables placeholder behavior and controls to maintain consistency.

For text blocks, the `text/edit` scope must be enabled before placeholder behavior can function.

**Optional related scopes** that enhance placeholder functionality:

- `fill/changeType` - Allows changing between image, video, and solid color fills
- `layer/crop` - Enables cropping replacement images
- `text/character` - Allows font and character formatting for text placeholders

## Working with Multiple Placeholders

When creating templates with multiple placeholders, apply settings systematically:

```typescript highlight-batch-operation
    // Batch operation: Apply settings to multiple blocks
    const graphicBlocks = [block1, block2];
    graphicBlocks.forEach((block) => {
      // Enable placeholder for each block
      engine.block.setPlaceholderEnabled(block, true);

      const fill = engine.block.getFill(block);
      if (engine.block.supportsPlaceholderBehavior(fill)) {
        engine.block.setPlaceholderBehaviorEnabled(fill, true);
      }
    });
```

This pattern works well for collage templates, product showcases, or any layout requiring multiple content slots.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.supportsPlaceholderBehavior()` | Checks whether the block supports placeholder behavior |
| `engine.block.setPlaceholderBehaviorEnabled()` | Enables or disables placeholder behavior for a block |
| `engine.block.isPlaceholderBehaviorEnabled()` | Queries whether placeholder behavior is enabled |
| `engine.block.setPlaceholderEnabled()` | Enables or disables placeholder interaction in Adopter mode |
| `engine.block.isPlaceholderEnabled()` | Queries whether placeholder interaction is enabled |
| `engine.block.supportsPlaceholderControls()` | Checks whether the block supports placeholder controls |
| `engine.block.setPlaceholderControlsOverlayEnabled()` | Enables or disables the placeholder overlay pattern |
| `engine.block.isPlaceholderControlsOverlayEnabled()` | Queries whether the overlay pattern is shown |
| `engine.block.setPlaceholderControlsButtonEnabled()` | Enables or disables the placeholder button |
| `engine.block.isPlaceholderControlsButtonEnabled()` | Queries whether the placeholder button is shown |

## Next Steps

- [Lock the Template](./create-templates/lock.md) - Restrict editing access to specific elements or properties to enforce design rules
- [Text Variables](./create-templates/add-dynamic-content/text-variables.md) - Define dynamic text elements that can be populated with custom values



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support