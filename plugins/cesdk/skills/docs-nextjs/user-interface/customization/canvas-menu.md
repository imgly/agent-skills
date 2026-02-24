> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Canvas Menu](./user-interface/customization/canvas-menu.md)

---

The canvas menu is the floating toolbar that appears when a block is selected on the canvas. This guide covers canvas menu-specific features like edit mode context, custom actions, the options submenu, and how the menu adapts to different block types.

![Canvas menu customization showing edit mode menus and custom actions](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

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
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-canvas-menu-browser/)

For general component manipulation (reordering, inserting, removing), see the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md).

```typescript file=@cesdk_web_examples/guides-user-interface-customization-canvas-menu-browser/browser.ts reference-only
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

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create a text block to demonstrate text edit mode menu
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(
      titleText,
      'Canvas Menu\n\nRight-click or select to see the menu'
    );
    engine.block.setWidth(titleText, pageWidth * 0.7);
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.setPositionX(titleText, pageWidth * 0.15);
    engine.block.setPositionY(titleText, pageHeight * 0.2);
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setFloat(titleText, 'text/fontSize', 22);

    // Create a shape block to demonstrate Transform mode menu
    const rect = engine.block.create('graphic');
    engine.block.appendChild(page, rect);
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(rect, rectShape);
    engine.block.setWidth(rect, pageWidth * 0.3);
    engine.block.setHeight(rect, pageHeight * 0.2);
    engine.block.setPositionX(rect, pageWidth * 0.35);
    engine.block.setPositionY(rect, pageHeight * 0.6);
    const rectFill = engine.block.createFill('color');
    engine.block.setFill(rect, rectFill);
    engine.block.setColor(rectFill, 'fill/color/value', {
      r: 0.2,
      g: 0.5,
      b: 0.9,
      a: 1
    });

    // Select the shape so the canvas menu is visible
    engine.block
      .findAllSelected()
      .forEach((block) => engine.block.setSelected(block, false));
    engine.block.select(rect);

    // Hide the canvas menu
    cesdk.feature.disable('ly.img.canvas.menu');

    // Show the canvas menu (default)
    cesdk.feature.enable('ly.img.canvas.menu');

    // Set a custom canvas menu for Text edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.canvas.menu', when: { editMode: 'Text' } },
      [
        'ly.img.text.color.canvasMenu',
        'ly.img.separator',
        'ly.img.text.bold.canvasMenu',
        'ly.img.text.italic.canvasMenu',
        'ly.img.separator',
        'ly.img.text.variables.canvasMenu'
      ]
    );

    // Set a custom canvas menu for Transform mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.canvas.menu', when: { editMode: 'Transform' } },
      [
        'ly.img.text.edit.canvasMenu',
        'ly.img.replace.canvasMenu',
        'ly.img.separator',
        'ly.img.bringForward.canvasMenu',
        'ly.img.sendBackward.canvasMenu',
        'ly.img.separator',
        'ly.img.duplicate.canvasMenu',
        'ly.img.delete.canvasMenu',
        'ly.img.separator',
        'ly.img.options.canvasMenu'
      ]
    );

    // Add a custom action button to the canvas menu
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.canvas.menu', after: 'ly.img.duplicate.canvasMenu' },
      {
        id: 'ly.img.action.canvasMenu',
        key: 'copy-style',
        label: 'Copy Style',
        icon: '@imgly/Copy',
        onClick: () => {
          const selected = engine.block.findAllSelected()[0];
          if (selected != null) {
            console.log('Copying style from block:', selected);
          }
        }
      }
    );

    // Configure the options submenu children using updateOrderComponent
    // This modifies only the children of an existing dropdown without replacing the entire menu
    cesdk.ui.updateOrderComponent(
      { in: 'ly.img.canvas.menu', match: { id: 'ly.img.options.canvasMenu' } },
      {
        children: [
          'ly.img.flipX.canvasMenu',
          'ly.img.flipY.canvasMenu',
          'ly.img.separator',
          'ly.img.copy.canvasMenu',
          'ly.img.paste.canvasMenu'
        ]
      }
    );

    // Retrieve and log the current canvas menu order
    const currentOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.menu'
    });
    console.log('Current canvas menu order:', currentOrder);
  }
}

export default Example;
```

This guide covers showing and hiding the canvas menu, configuring edit mode-specific menus, adding custom actions, configuring the options submenu, and viewing the default component order.

## Show or Hide the Canvas Menu

Use the Feature API to control canvas menu visibility:

```typescript highlight=highlight-show-hide
    // Hide the canvas menu
    cesdk.feature.disable('ly.img.canvas.menu');

    // Show the canvas menu (default)
    cesdk.feature.enable('ly.img.canvas.menu');
```

For more on the Feature API, see [Show/Hide Components](./user-interface/customization/quick-start/show-hide-components.md).

## Edit Mode Context

The canvas menu supports different component orders for different edit modes. Use the `when` option in `setComponentOrder` to define layouts that activate only in a specific mode. The following example sets a text formatting toolbar for Text edit mode and a simplified action layout for Transform mode.

```typescript highlight=highlight-edit-mode-context
    // Set a custom canvas menu for Text edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.canvas.menu', when: { editMode: 'Text' } },
      [
        'ly.img.text.color.canvasMenu',
        'ly.img.separator',
        'ly.img.text.bold.canvasMenu',
        'ly.img.text.italic.canvasMenu',
        'ly.img.separator',
        'ly.img.text.variables.canvasMenu'
      ]
    );

    // Set a custom canvas menu for Transform mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.canvas.menu', when: { editMode: 'Transform' } },
      [
        'ly.img.text.edit.canvasMenu',
        'ly.img.replace.canvasMenu',
        'ly.img.separator',
        'ly.img.bringForward.canvasMenu',
        'ly.img.sendBackward.canvasMenu',
        'ly.img.separator',
        'ly.img.duplicate.canvasMenu',
        'ly.img.delete.canvasMenu',
        'ly.img.separator',
        'ly.img.options.canvasMenu'
      ]
    );
```

Available edit modes: `'Transform'` (default), `'Text'`, `'Crop'`, `'Trim'`, or any custom value. Edit modes without specific configurations fall back to the Transform mode order. All Component Order API methods accept an optional `when` context. See the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md) for details.

## Custom Context Menu Actions

Add custom actions to the canvas menu using `ly.img.action.canvasMenu`. Each action requires a unique `key`, a `label`, and an `onClick` handler. Use `insertOrderComponent` to place the action at a specific position.

```typescript highlight=highlight-custom-action
// Add a custom action button to the canvas menu
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.canvas.menu', after: 'ly.img.duplicate.canvasMenu' },
  {
    id: 'ly.img.action.canvasMenu',
    key: 'copy-style',
    label: 'Copy Style',
    icon: '@imgly/Copy',
    onClick: () => {
      const selected = engine.block.findAllSelected()[0];
      if (selected != null) {
        console.log('Copying style from block:', selected);
      }
    }
  }
);
```

Custom actions support optional properties like `icon`, `variant`, `isDisabled`, and `shortcut` for keyboard shortcut display.

## Options Submenu

The `ly.img.options.canvasMenu` component is a dropdown for additional actions. Since it's already in the canvas menu by default, use `updateOrderComponent` to modify its children without replacing the entire menu order.

```typescript highlight=highlight-options-submenu
// Configure the options submenu children using updateOrderComponent
// This modifies only the children of an existing dropdown without replacing the entire menu
cesdk.ui.updateOrderComponent(
  { in: 'ly.img.canvas.menu', match: { id: 'ly.img.options.canvasMenu' } },
  {
    children: [
      'ly.img.flipX.canvasMenu',
      'ly.img.flipY.canvasMenu',
      'ly.img.separator',
      'ly.img.copy.canvasMenu',
      'ly.img.paste.canvasMenu'
    ]
  }
);
```

The options submenu typically contains flip, copy, and paste actions. Use `updateOrderComponent` with `match: { id: '...' }` to target existing components and modify their properties like `children`.

## Block-Type Specific Behavior

The canvas menu automatically shows and hides components based on the selected block type. Components only render when their associated controls are relevant.

| Block Type | Relevant Components |
|------------|---------------------|
| Text | Text edit, text color, bold, italic, variables |
| Image/Shape | Replace, flip, bring forward, send backward |
| Group | Enter group, select group |
| Page | Move page up, move page down |

This means a single component order can include controls for all block types. When a text block is selected, only text-relevant components appear. When a shape is selected, only shape-relevant components appear.

## Default Component Order

Retrieve the current canvas menu order with `getComponentOrder` to inspect the default layout. For detailed descriptions of each component ID, see the [Component Reference](./user-interface/customization/reference/component-reference.md).

```typescript highlight=highlight-default-order
// Retrieve and log the current canvas menu order
const currentOrder = cesdk.ui.getComponentOrder({
  in: 'ly.img.canvas.menu'
});
console.log('Current canvas menu order:', currentOrder);
```

### Block Actions

| Component ID | Description |
|--------------|-------------|
| `ly.img.delete.canvasMenu` | Delete selected block |
| `ly.img.duplicate.canvasMenu` | Duplicate selected block |
| `ly.img.replace.canvasMenu` | Replace block content |
| `ly.img.placeholder.canvasMenu` | Placeholder toggle |

### Edit Actions

| Component ID | Description |
|--------------|-------------|
| `ly.img.copy.canvasMenu` | Copy to clipboard |
| `ly.img.paste.canvasMenu` | Paste from clipboard |
| `ly.img.flipX.canvasMenu` | Flip horizontally |
| `ly.img.flipY.canvasMenu` | Flip vertically |

### Layer Ordering

| Component ID | Description |
|--------------|-------------|
| `ly.img.bringForward.canvasMenu` | Bring forward one layer |
| `ly.img.sendBackward.canvasMenu` | Send backward one layer |

### Text Actions (Text Edit Mode)

| Component ID | Description |
|--------------|-------------|
| `ly.img.text.edit.canvasMenu` | Enter text edit mode |
| `ly.img.text.color.canvasMenu` | Text color picker |
| `ly.img.text.bold.canvasMenu` | Toggle bold |
| `ly.img.text.italic.canvasMenu` | Toggle italic |
| `ly.img.text.variables.canvasMenu` | Insert variable |

### Group & Page Actions

| Component ID | Description |
|--------------|-------------|
| `ly.img.group.enter.canvasMenu` | Enter group for editing |
| `ly.img.group.select.canvasMenu` | Select parent group |
| `ly.img.page.moveUp.canvasMenu` | Move page up |
| `ly.img.page.moveDown.canvasMenu` | Move page down |

### Layout & Containers

| Component ID | Description |
|--------------|-------------|
| `ly.img.separator` | Visual divider between groups |
| `ly.img.options.canvasMenu` | Options dropdown submenu |

## Troubleshooting

- **Menu not appearing** - Ensure a block is selected and `cesdk.feature.disable('ly.img.canvas.menu')` hasn't been called elsewhere.
- **Custom action not showing** - Verify the `key` is unique and the action was inserted at a valid position.
- **Edit mode actions missing** - Check that the `when: { editMode: '...' }` value matches exactly (case-sensitive).
- **Options submenu empty** - Ensure the `children` array contains valid component IDs.

## Next Steps

- [Reorder Components](./user-interface/customization/quick-start/reorder-components.md) - Quick start for rearranging canvas menu controls
- [Component Order API](./user-interface/customization/reference/component-order-api.md) - Full API documentation with `when` context
- [Component Reference](./user-interface/customization/reference/component-reference.md) - All canvas menu component IDs
- [Inspector Bar](./user-interface/customization/inspector-bar.md) - Another area with edit mode context



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support