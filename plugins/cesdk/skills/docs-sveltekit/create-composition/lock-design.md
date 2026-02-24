> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Compositions](./create-composition.md) > [Lock Design](./create-composition/lock-design.md)

---

Protect design elements from unwanted modifications using CE.SDK's scope-based permission system.

![Lock Design Hero](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-composition-lock-design-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-composition-lock-design-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-composition-lock-design-browser/)

CE.SDK uses a two-layer scope system to control editing permissions. Global scopes set defaults for the entire scene, while block-level scopes override when the global setting is `Defer`. This enables flexible permission models from fully locked to selectively editable designs.

```typescript file=@cesdk_web_examples/guides-create-composition-lock-design-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext, Scope } from '@cesdk/cesdk-js';
import packageJson from './package.json';

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

class LockDesign implements EditorPlugin {
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

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // Create sample content to demonstrate different locking techniques
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Column 1: Fully Locked
    const caption1 = engine.block.create('text');
    engine.block.setString(caption1, 'text/text', 'Fully Locked');
    engine.block.setFloat(caption1, 'text/fontSize', 32);
    engine.block.setWidth(caption1, 220);
    engine.block.setHeight(caption1, 50);
    engine.block.setPositionX(caption1, 30);
    engine.block.setPositionY(caption1, 30);
    engine.block.appendChild(page, caption1);

    const imageBlock = await engine.block.addImage(imageUri, {
      x: 30,
      y: 100,
      size: { width: 220, height: 165 }
    });
    engine.block.appendChild(page, imageBlock);

    // Column 2: Text Editing Only
    const caption2 = engine.block.create('text');
    engine.block.setString(caption2, 'text/text', 'Text Editing');
    engine.block.setFloat(caption2, 'text/fontSize', 32);
    engine.block.setWidth(caption2, 220);
    engine.block.setHeight(caption2, 50);
    engine.block.setPositionX(caption2, 290);
    engine.block.setPositionY(caption2, 30);
    engine.block.appendChild(page, caption2);

    const textBlock = engine.block.create('text');
    engine.block.setString(textBlock, 'text/text', 'Edit Me');
    engine.block.setFloat(textBlock, 'text/fontSize', 72);
    engine.block.setWidth(textBlock, 220);
    engine.block.setHeight(textBlock, 165);
    engine.block.setPositionX(textBlock, 290);
    engine.block.setPositionY(textBlock, 100);
    engine.block.appendChild(page, textBlock);

    // Column 3: Image Replace Only
    const caption3 = engine.block.create('text');
    engine.block.setString(caption3, 'text/text', 'Image Replace');
    engine.block.setFloat(caption3, 'text/fontSize', 32);
    engine.block.setWidth(caption3, 220);
    engine.block.setHeight(caption3, 50);
    engine.block.setPositionX(caption3, 550);
    engine.block.setPositionY(caption3, 30);
    engine.block.appendChild(page, caption3);

    const placeholderBlock = await engine.block.addImage(imageUri, {
      x: 550,
      y: 100,
      size: { width: 220, height: 165 }
    });
    engine.block.appendChild(page, placeholderBlock);

    // Lock the entire design by setting all scopes to Deny
    const scopes = engine.editor.findAllScopes();
    for (const scope of scopes) {
      engine.editor.setGlobalScope(scope, 'Deny');
    }

    // Enable selection for specific blocks
    engine.editor.setGlobalScope('editor/select', 'Defer');
    engine.block.setScopeEnabled(textBlock, 'editor/select', true);
    engine.block.setScopeEnabled(placeholderBlock, 'editor/select', true);

    // Enable text editing on the text block
    engine.editor.setGlobalScope('text/edit', 'Defer');
    engine.editor.setGlobalScope('text/character', 'Defer');
    engine.block.setScopeEnabled(textBlock, 'text/edit', true);
    engine.block.setScopeEnabled(textBlock, 'text/character', true);

    // Enable image replacement on the placeholder block
    engine.editor.setGlobalScope('fill/change', 'Defer');
    engine.block.setScopeEnabled(placeholderBlock, 'fill/change', true);

    // Check if operations are permitted on blocks
    const canEditText = engine.block.isAllowedByScope(textBlock, 'text/edit');
    const canMoveImage = engine.block.isAllowedByScope(
      imageBlock,
      'layer/move'
    );
    const canReplacePlaceholder = engine.block.isAllowedByScope(
      placeholderBlock,
      'fill/change'
    );

    console.log('Permission status:');
    console.log('- Can edit text:', canEditText); // true
    console.log('- Can move locked image:', canMoveImage); // false
    console.log('- Can replace placeholder:', canReplacePlaceholder); // true

    // Discover all available scopes
    const allScopes: Scope[] = engine.editor.findAllScopes();
    console.log('Available scopes:', allScopes);

    // Check global scope settings
    const textEditGlobal = engine.editor.getGlobalScope('text/edit');
    const layerMoveGlobal = engine.editor.getGlobalScope('layer/move');
    console.log('Global text/edit:', textEditGlobal); // 'Defer'
    console.log('Global layer/move:', layerMoveGlobal); // 'Deny'

    // Check block-level scope settings
    const textEditEnabled = engine.block.isScopeEnabled(textBlock, 'text/edit');
    console.log('Text block text/edit enabled:', textEditEnabled); // true

    // Select the text block to demonstrate editability
    engine.block.select(textBlock);
  }
}

export default LockDesign;
```

This guide covers how to lock entire designs, selectively enable specific editing capabilities, and check permissions programmatically.

## Understanding the Scope Permission Model

Scopes control what operations users can perform on design elements. CE.SDK combines global scope settings with block-level settings to determine the final permission.

| Global Scope | Block Scope | Result    |
| ------------ | ----------- | --------- |
| `Allow`      | any         | Permitted |
| `Deny`       | any         | Blocked   |
| `Defer`      | enabled     | Permitted |
| `Defer`      | disabled    | Blocked   |

Global scopes have three possible values:

- **`Allow`**: The operation is always permitted, regardless of block-level settings
- **`Deny`**: The operation is always blocked, regardless of block-level settings
- **`Defer`**: The permission depends on the block-level scope setting

Block-level scopes are binary: enabled or disabled. They only take effect when the global scope is set to `Defer`.

## Locking an Entire Design

To lock all editing operations, iterate through all available scopes and set each to `Deny`. We use `engine.editor.findAllScopes()` to discover all scope names dynamically.

```typescript highlight=highlight-lock-entire-design
// Lock the entire design by setting all scopes to Deny
const scopes = engine.editor.findAllScopes();
for (const scope of scopes) {
  engine.editor.setGlobalScope(scope, 'Deny');
}
```

When all scopes are set to `Deny`, users cannot modify any aspect of the design. This includes selecting, moving, editing text, or changing any visual properties.

## Enabling Selection for Interactive Blocks

Before users can interact with any block, you must enable the `editor/select` scope. Without selection, users cannot click on or access any blocks, even if other editing capabilities are enabled.

```typescript highlight=highlight-enable-selection
// Enable selection for specific blocks
engine.editor.setGlobalScope('editor/select', 'Defer');
engine.block.setScopeEnabled(textBlock, 'editor/select', true);
engine.block.setScopeEnabled(placeholderBlock, 'editor/select', true);
```

Setting the global `editor/select` scope to `Defer` delegates the decision to each block. We then enable selection only on the specific blocks users should be able to interact with.

## Selective Locking Patterns

Lock everything first, then selectively enable specific capabilities on chosen blocks. This pattern provides fine-grained control over what users can modify.

### Text-Only Editing

To allow users to edit text content while protecting everything else, enable the `text/edit` scope. For text styling changes like font, size, and color, also enable `text/character`.

```typescript highlight=highlight-text-editing
// Enable text editing on the text block
engine.editor.setGlobalScope('text/edit', 'Defer');
engine.editor.setGlobalScope('text/character', 'Defer');
engine.block.setScopeEnabled(textBlock, 'text/edit', true);
engine.block.setScopeEnabled(textBlock, 'text/character', true);
```

Users can now type new text content in the designated text block but cannot move, resize, or delete it.

### Image Replacement

To allow users to swap images while protecting layout and position, enable the `fill/change` scope on placeholder blocks.

```typescript highlight=highlight-image-replacement
// Enable image replacement on the placeholder block
engine.editor.setGlobalScope('fill/change', 'Defer');
engine.block.setScopeEnabled(placeholderBlock, 'fill/change', true);
```

Users can replace the image content but the block's position, dimensions, and other properties remain locked.

## Checking Permissions

Verify whether operations are permitted using `engine.block.isAllowedByScope()`. This method evaluates both global and block-level settings to return the effective permission state.

```typescript highlight=highlight-check-permissions
    // Check if operations are permitted on blocks
    const canEditText = engine.block.isAllowedByScope(textBlock, 'text/edit');
    const canMoveImage = engine.block.isAllowedByScope(
      imageBlock,
      'layer/move'
    );
    const canReplacePlaceholder = engine.block.isAllowedByScope(
      placeholderBlock,
      'fill/change'
    );

    console.log('Permission status:');
    console.log('- Can edit text:', canEditText); // true
    console.log('- Can move locked image:', canMoveImage); // false
    console.log('- Can replace placeholder:', canReplacePlaceholder); // true
```

The distinction between checking methods is:

- `isAllowedByScope()` returns the **effective permission** after evaluating all scope levels
- `isScopeEnabled()` returns only the **block-level setting**
- `getGlobalScope()` returns only the **global setting**

## Discovering Available Scopes

To work with scopes programmatically, you can discover all available scope names and check their current settings.

```typescript highlight=highlight-get-scopes
    // Discover all available scopes
    const allScopes: Scope[] = engine.editor.findAllScopes();
    console.log('Available scopes:', allScopes);

    // Check global scope settings
    const textEditGlobal = engine.editor.getGlobalScope('text/edit');
    const layerMoveGlobal = engine.editor.getGlobalScope('layer/move');
    console.log('Global text/edit:', textEditGlobal); // 'Defer'
    console.log('Global layer/move:', layerMoveGlobal); // 'Deny'

    // Check block-level scope settings
    const textEditEnabled = engine.block.isScopeEnabled(textBlock, 'text/edit');
    console.log('Text block text/edit enabled:', textEditEnabled); // true
```

## Available Scopes Reference

| Scope                    | Description                             |
| ------------------------ | --------------------------------------- |
| `layer/move`             | Move block position                     |
| `layer/resize`           | Resize block dimensions                 |
| `layer/rotate`           | Rotate block                            |
| `layer/flip`             | Flip block horizontally or vertically   |
| `layer/crop`             | Crop block content                      |
| `layer/opacity`          | Change block opacity                    |
| `layer/blendMode`        | Change blend mode                       |
| `layer/visibility`       | Toggle block visibility                 |
| `layer/clipping`         | Change clipping behavior                |
| `fill/change`            | Change fill content                     |
| `fill/changeType`        | Change fill type                        |
| `stroke/change`          | Change stroke properties                |
| `shape/change`           | Change shape type                       |
| `text/edit`              | Edit text content                       |
| `text/character`         | Change text styling (font, size, color) |
| `appearance/adjustments` | Change color adjustments                |
| `appearance/filter`      | Apply or change filters                 |
| `appearance/effect`      | Apply or change effects                 |
| `appearance/blur`        | Apply or change blur                    |
| `appearance/shadow`      | Apply or change shadows                 |
| `appearance/animation`   | Apply or change animations              |
| `lifecycle/destroy`      | Delete the block                        |
| `lifecycle/duplicate`    | Duplicate the block                     |
| `editor/add`             | Add new blocks                          |
| `editor/select`          | Select blocks                           |



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support