> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Canvas Bar](./user-interface/customization/canvas.md)

---

The canvas bar is the floating toolbar that appears above or below the canvas. This guide covers canvas bar-specific features like the dual-position system, edit mode context, layout helpers, and the default component order.

![Canvas bar customization showing top and bottom position layouts](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

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
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-canvas-browser/)

For general component manipulation (reordering, inserting, removing), see the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md).

```typescript file=@cesdk_web_examples/guides-user-interface-customization-canvas-browser/browser.ts reference-only
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

    // Hide the canvas bar
    cesdk.feature.disable('ly.img.canvas.bar');

    // Show the canvas bar (default)
    cesdk.feature.enable('ly.img.canvas.bar');

    // Configure the top position with settings and add page
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' }, [
      'ly.img.settings.canvasBar',
      'ly.img.separator',
      'ly.img.page.add.canvasBar'
    ]);

    // Configure the bottom position independently
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'bottom' }, [
      'ly.img.spacer',
      'ly.img.page.add.canvasBar'
    ]);

    // Set a text formatting toolbar for Text edit mode at the top position
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.canvas.bar', at: 'top', when: { editMode: 'Text' } },
      [
        'ly.img.text.bold.canvasBar',
        'ly.img.text.italic.canvasBar',
        'ly.img.separator',
        'ly.img.settings.canvasBar'
      ]
    );

    // Use spacers and separators to control layout
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'bottom' }, [
      'ly.img.settings.canvasBar',
      'ly.img.separator',
      'ly.img.spacer',
      'ly.img.page.add.canvasBar',
      'ly.img.spacer'
    ]);

    // Retrieve and log the current canvas bar order for each position
    const topOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.bar',
      at: 'top'
    });
    console.log('Current top canvas bar order:', topOrder);

    const bottomOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.bar',
      at: 'bottom'
    });
    console.log('Current bottom canvas bar order:', bottomOrder);
  }
}

export default Example;
```

This guide covers showing and hiding the canvas bar, configuring the dual-position system, setting edit mode-specific layouts, using layout helper components, and viewing the default component order.

## Show or Hide the Canvas Bar

Use the Feature API to control canvas bar visibility:

```typescript highlight=highlight-show-hide
    // Hide the canvas bar
    cesdk.feature.disable('ly.img.canvas.bar');

    // Show the canvas bar (default)
    cesdk.feature.enable('ly.img.canvas.bar');
```

For more on the Feature API, see [Show/Hide Components](./user-interface/customization/quick-start/show-hide-components.md).

## Position System

Unlike other UI areas, the canvas bar has two independent positions: `'top'` and `'bottom'`. All Component Order API calls require the `at` option to specify which position to configure.

```typescript highlight=highlight-position-system
    // Configure the top position with settings and add page
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' }, [
      'ly.img.settings.canvasBar',
      'ly.img.separator',
      'ly.img.page.add.canvasBar'
    ]);

    // Configure the bottom position independently
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'bottom' }, [
      'ly.img.spacer',
      'ly.img.page.add.canvasBar'
    ]);
```

Each position maintains its own component order. Changes to the top position do not affect the bottom position and vice versa.

## Edit Mode Context

The canvas bar supports different component orders for different edit modes. Use the `when` option combined with `at` to define layouts that activate only in a specific mode.

```typescript highlight=highlight-edit-mode-context
// Set a text formatting toolbar for Text edit mode at the top position
cesdk.ui.setComponentOrder(
  { in: 'ly.img.canvas.bar', at: 'top', when: { editMode: 'Text' } },
  [
    'ly.img.text.bold.canvasBar',
    'ly.img.text.italic.canvasBar',
    'ly.img.separator',
    'ly.img.settings.canvasBar'
  ]
);
```

Available edit modes: `'Transform'` (default), `'Text'`, `'Crop'`, `'Trim'`, or any custom value. Edit modes without specific configurations fall back to the Transform mode order. See the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md) for details on the `when` context.

## Layout Components

The canvas bar uses two layout helper components to organize content:

```typescript highlight=highlight-layout-components
// Use spacers and separators to control layout
cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'bottom' }, [
  'ly.img.settings.canvasBar',
  'ly.img.separator',
  'ly.img.spacer',
  'ly.img.page.add.canvasBar',
  'ly.img.spacer'
]);
```

| Component ID | Description |
|--------------|-------------|
| `ly.img.separator` | Vertical divider line with smart rendering (hides when adjacent to edges or spacers) |
| `ly.img.spacer` | Flexible space that distributes remaining horizontal space evenly |

Multiple spacers share available space proportionally, allowing you to center or push components to specific positions.

## Default Component Order

Retrieve the current canvas bar order with `getComponentOrder` to inspect the default layout. The `at` option is required. For detailed descriptions of each component ID, see the [Component Reference](./user-interface/customization/reference/component-reference.md).

```typescript highlight=highlight-default-order
    // Retrieve and log the current canvas bar order for each position
    const topOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.bar',
      at: 'top'
    });
    console.log('Current top canvas bar order:', topOrder);

    const bottomOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.bar',
      at: 'bottom'
    });
    console.log('Current bottom canvas bar order:', bottomOrder);
```

### Top Position

The top position is empty by default.

### Bottom Position (Default)

| Component ID | Description |
|--------------|-------------|
| `ly.img.settings.canvasBar` | Opens settings panel |
| `ly.img.spacer` | Flexible space |
| `ly.img.page.add.canvasBar` | Adds new page |
| `ly.img.spacer` | Flexible space |

### Text Edit Mode Components

| Component ID | Description |
|--------------|-------------|
| `ly.img.text.bold.canvasBar` | Toggle bold |
| `ly.img.text.italic.canvasBar` | Toggle italic |

## Troubleshooting

- **Component Order API fails** - Ensure you include the required `at: 'top'` or `at: 'bottom'` option. The canvas bar is the only UI area that requires a position.
- **Edit mode order not applying** - Check that the `when: { editMode: '...' }` value matches exactly (case-sensitive).
- **Canvas bar not visible** - Ensure `cesdk.feature.disable('ly.img.canvas.bar')` hasn't been called elsewhere.

## Next Steps

- [Reorder Components](./user-interface/customization/quick-start/reorder-components.md) - Quick start for rearranging canvas bar controls
- [Component Order API](./user-interface/customization/reference/component-order-api.md) - Full API documentation with `at` and `when` options
- [Component Reference](./user-interface/customization/reference/component-reference.md) - All canvas bar component IDs
- [Inspector Bar](./user-interface/customization/inspector-bar.md) - Another area with edit mode context



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support