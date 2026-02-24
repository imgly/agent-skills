> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Reorder Components](./user-interface/customization/quick-start/reorder-components.md)

---

Rearrange UI components using `getComponentOrder()` to inspect the current layout and `setComponentOrder()` to define custom arrangements.

![Reorder Components example showing a customized editor interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-reorder-components-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-reorder-components-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-quick-start-reorder-components-browser/)

The Component Order API lets you customize the layout of all five UI areas by getting and setting the component order array. Each area maintains an ordered list of components that determines their visual arrangement.

```typescript file=@cesdk_web_examples/guides-user-interface-customization-quick-start-reorder-components-browser/browser.ts reference-only
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

    // Get the current order of components in the navigation bar
    const defaultOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.navigation.bar'
    });
    console.log('Default navigation bar order:', defaultOrder);

    // Set a custom order with title centered and actions grouped
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.back.navigationBar',
      'ly.img.spacer',
      'ly.img.title.navigationBar',
      'ly.img.spacer',
      'ly.img.undoRedo.navigationBar',
      'ly.img.actions.navigationBar'
    ]);
    console.log('Navigation bar reordered with centered title');

    // Canvas bar requires the 'at' option for top or bottom positioning
    const canvasBarOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.bar',
      at: 'top'
    });
    console.log('Canvas bar (top) order:', canvasBarOrder);

    // Set a custom canvas bar order
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' }, [
      'ly.img.page.add.canvasBar',
      'ly.img.spacer',
      'ly.img.zoom.canvasBar'
    ]);

    // Use component objects for inline configuration
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.spacer',
      {
        id: 'ly.img.assetLibrary.dock',
        entries: ['ly.img.image', 'ly.img.text', 'ly.img.shape']
      }
    ]);
    console.log('Dock reordered with custom asset library entries');

    // Set different orders for specific edit modes
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
      [
        'ly.img.text.typeFace.inspectorBar',
        'ly.img.text.fontSize.inspectorBar',
        'ly.img.separator',
        'ly.img.text.bold.inspectorBar',
        'ly.img.text.italic.inspectorBar'
      ]
    );
    console.log('Inspector bar customized for Text edit mode');

    // Move a specific component to the beginning
    const navOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.navigation.bar'
    });
    const actionsIndex = navOrder.findIndex(
      (c) => c.id === 'ly.img.actions.navigationBar'
    );

    if (actionsIndex > 0) {
      const [actions] = navOrder.splice(actionsIndex, 1);
      navOrder.unshift(actions);
      cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, navOrder);
      console.log('Moved actions to the beginning of navigation bar');
    }

    // eslint-disable-next-line no-console
    console.log('Reorder Components example loaded successfully');
  }
}

export default Example;
```

This guide covers how to get the current component order, set a custom order, use component objects for inline configuration, set edit mode-specific orders, and move individual components programmatically.

## UI Areas

CE.SDK provides five customizable UI areas.

| Area | Location | Purpose |
|------|----------|---------|
| `'ly.img.navigation.bar'` | Top | Navigation and actions |
| `'ly.img.dock'` | Side | Asset library access |
| `'ly.img.inspector.bar'` | Side | Property controls |
| `'ly.img.canvas.menu'` | Canvas | Context menu |
| `'ly.img.canvas.bar'` | Above/below canvas | Contextual controls |

The canvas bar requires the `at` option specifying `'top'` or `'bottom'`.

## Get Current Order

Use `getComponentOrder()` to inspect the current arrangement of components in any UI area.

```typescript highlight=highlight-get-order
// Get the current order of components in the navigation bar
const defaultOrder = cesdk.ui.getComponentOrder({
  in: 'ly.img.navigation.bar'
});
console.log('Default navigation bar order:', defaultOrder);
```

The method returns an array of component objects, each with an `id` property and optional configuration. This is useful for understanding the default layout before making changes.

## Set Custom Order

Use `setComponentOrder()` to define a new component arrangement. Pass an array of component IDs or component objects.

```typescript highlight=highlight-set-order
// Set a custom order with title centered and actions grouped
cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
  'ly.img.back.navigationBar',
  'ly.img.spacer',
  'ly.img.title.navigationBar',
  'ly.img.spacer',
  'ly.img.undoRedo.navigationBar',
  'ly.img.actions.navigationBar'
]);
console.log('Navigation bar reordered with centered title');
```

The component array completely replaces the existing order. Components not included in the array will not appear in that area.

## Canvas Bar Positioning

The canvas bar is unique in requiring a position parameter. Use `at: 'top'` or `at: 'bottom'` for both get and set operations.

```typescript highlight=highlight-canvas-bar
    // Canvas bar requires the 'at' option for top or bottom positioning
    const canvasBarOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.bar',
      at: 'top'
    });
    console.log('Canvas bar (top) order:', canvasBarOrder);

    // Set a custom canvas bar order
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' }, [
      'ly.img.page.add.canvasBar',
      'ly.img.spacer',
      'ly.img.zoom.canvasBar'
    ]);
```

## Using Component Objects

Pass component objects instead of string IDs when you need inline configuration. This is useful for components like the asset library that accept additional options.

```typescript highlight=highlight-component-objects
// Use component objects for inline configuration
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  'ly.img.spacer',
  {
    id: 'ly.img.assetLibrary.dock',
    entries: ['ly.img.image', 'ly.img.text', 'ly.img.shape']
  }
]);
console.log('Dock reordered with custom asset library entries');
```

The `entries` property specifies which asset categories appear in the dock's asset library button.

## Edit Mode Specific Orders

Set different orders for specific edit modes using the `when` context. This lets you show different controls based on what the user is editing.

```typescript highlight=highlight-edit-mode
// Set different orders for specific edit modes
cesdk.ui.setComponentOrder(
  { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
  [
    'ly.img.text.typeFace.inspectorBar',
    'ly.img.text.fontSize.inspectorBar',
    'ly.img.separator',
    'ly.img.text.bold.inspectorBar',
    'ly.img.text.italic.inspectorBar'
  ]
);
console.log('Inspector bar customized for Text edit mode');
```

Common edit modes include `Transform`, `Crop`, `Trim`, and `Text`. The order only applies when the specified edit mode is active.

## Moving Components

Combine `getComponentOrder()` and `setComponentOrder()` to move individual components. Get the current order, modify the array, and set it back.

```typescript highlight=highlight-move-component
    // Move a specific component to the beginning
    const navOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.navigation.bar'
    });
    const actionsIndex = navOrder.findIndex(
      (c) => c.id === 'ly.img.actions.navigationBar'
    );

    if (actionsIndex > 0) {
      const [actions] = navOrder.splice(actionsIndex, 1);
      navOrder.unshift(actions);
      cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, navOrder);
      console.log('Moved actions to the beginning of navigation bar');
    }
```

Use standard array methods like `splice`, `unshift`, and `push` to rearrange components.

## Troubleshooting

**Components not rendering** — Ensure all component IDs in the array are valid and registered. Invalid IDs are silently ignored.

**Canvas bar error** — Remember to include `at: 'top'` or `at: 'bottom'` for canvas bar operations.

**Order not persisting** — Component orders are in-memory only. Persist to your own storage if needed across sessions.

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `cesdk.ui.getComponentOrder()` | UI | Get current component order for an area |
| `cesdk.ui.setComponentOrder()` | UI | Set complete component order for an area |

## Next Steps

- [Add Action Buttons](./user-interface/customization/quick-start/add-action-buttons.md) — Add new buttons to the order
- [Component Order API](./user-interface/customization/reference/component-order-api.md) — Full API documentation
- [Component Reference](./user-interface/customization/reference/component-reference.md) — Find component IDs



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support