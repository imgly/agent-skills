> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Inspector Bar](./user-interface/customization/inspector-bar.md)

---

The inspector bar is the contextual toolbar that appears above the canvas when a block is selected. This guide covers inspector bar-specific features like view modes, edit mode contexts, and how the bar adapts to different block types.

![Inspector bar customization showing view modes and edit mode-specific controls](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

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
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-inspector-bar-browser/)

For general component manipulation (reordering, inserting, removing), see the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md).

```typescript file=@cesdk_web_examples/guides-user-interface-customization-inspector-bar-browser/browser.ts reference-only
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

    // Create gradient background
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.42, g: 0.22, b: 0.6, a: 1 }, stop: 0 },
      { color: { r: 0.58, g: 0.35, b: 0.75, a: 1 }, stop: 0.5 },
      { color: { r: 0.35, g: 0.55, b: 0.85, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create a text block for demonstrating text-specific inspector controls
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(titleText, 'Inspector Bar\n\nimg.ly');
    engine.block.setWidth(titleText, pageWidth * 0.8);
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.setPositionX(titleText, pageWidth * 0.1);
    engine.block.setPositionY(titleText, pageHeight * 0.25);
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setFloat(titleText, 'text/fontSize', 24);
    engine.block.setTextColor(titleText, { r: 1, g: 1, b: 1, a: 1 });

    // Deselect all blocks for clean hero image
    engine.block
      .findAllSelected()
      .forEach((block) => engine.block.setSelected(block, false));
    engine.block.select(titleText);

    // Switch between default and advanced view modes
    // 'default' shows the inspector bar above the canvas
    // 'advanced' shows the full inspector panel to the side
    cesdk.ui.setView('default');

    // Set a custom inspector bar order for Text edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
      [
        'ly.img.text.typeFace.inspectorBar',
        'ly.img.text.fontSize.inspectorBar',
        'ly.img.separator',
        'ly.img.text.bold.inspectorBar',
        'ly.img.text.italic.inspectorBar',
        'ly.img.text.alignHorizontal.inspectorBar',
        'ly.img.separator',
        'ly.img.fill.inspectorBar',
        'ly.img.spacer',
        'ly.img.inspectorToggle.inspectorBar'
      ]
    );

    // Set a custom inspector bar order for Crop edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.inspector.bar', when: { editMode: 'Crop' } },
      ['ly.img.cropControls.inspectorBar']
    );

    // Set a simplified Transform mode order with grouped controls
    cesdk.ui.setComponentOrder({ in: 'ly.img.inspector.bar' }, [
      'ly.img.spacer',
      'ly.img.text.typeFace.inspectorBar',
      'ly.img.text.bold.inspectorBar',
      'ly.img.text.italic.inspectorBar',
      'ly.img.text.fontSize.inspectorBar',
      'ly.img.text.alignHorizontal.inspectorBar',
      'ly.img.separator',
      'ly.img.fill.inspectorBar',
      'ly.img.stroke.inspectorBar',
      'ly.img.crop.inspectorBar',
      'ly.img.separator',
      'ly.img.filter.inspectorBar',
      'ly.img.effect.inspectorBar',
      'ly.img.blur.inspectorBar',
      'ly.img.adjustment.inspectorBar',
      'ly.img.separator',
      'ly.img.shadow.inspectorBar',
      'ly.img.opacityOptions.inspectorBar',
      'ly.img.position.inspectorBar',
      'ly.img.spacer',
      'ly.img.separator',
      'ly.img.inspectorToggle.inspectorBar'
    ]);

    // Retrieve and log the current inspector bar order
    const currentOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.inspector.bar'
    });
    console.log('Current inspector bar order:', currentOrder);
  }
}

export default Example;
```

This guide covers switching between view modes, setting up edit mode-specific layouts, understanding how the inspector bar adapts to selected block types, and viewing the default component order.

## Show or Hide the Inspector Bar

Use the Feature API to control inspector bar visibility:

```typescript
// Hide the inspector bar
cesdk.feature.disable('ly.img.inspector.bar');

// Show the inspector bar (default)
cesdk.feature.enable('ly.img.inspector.bar');

// Hide the advanced inspector panel toggle
cesdk.feature.disable('ly.img.inspector.toggle');
```

For more on the Feature API, see [Show/Hide Components](./user-interface/customization/quick-start/show-hide-components.md).

## View Modes

CE.SDK offers two view modes that control how the inspector displays. The `'default'` view shows a compact inspector bar above the canvas, while `'advanced'` shows a full inspector panel to the side. Use `cesdk.ui.setView()` to switch between them.

```typescript highlight=highlight-view-modes
// Switch between default and advanced view modes
// 'default' shows the inspector bar above the canvas
// 'advanced' shows the full inspector panel to the side
cesdk.ui.setView('default');
```

| View Mode | Behavior |
|-----------|----------|
| `'default'` | Compact inspector bar above the canvas |
| `'advanced'` | Full inspector panel to the side of the canvas |

The `ly.img.inspectorToggle.inspectorBar` component provides a button that lets users switch to the advanced view. Include it in your component order to give users access to both views.

## Edit Mode Context

The inspector bar supports different component orders for different edit modes. Use the `when` option in `setComponentOrder` to define layouts that activate only in a specific mode. The following example sets a focused text editing toolbar for Text edit mode and a simplified layout for Crop mode.

```typescript highlight=highlight-edit-mode-context
    // Set a custom inspector bar order for Text edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
      [
        'ly.img.text.typeFace.inspectorBar',
        'ly.img.text.fontSize.inspectorBar',
        'ly.img.separator',
        'ly.img.text.bold.inspectorBar',
        'ly.img.text.italic.inspectorBar',
        'ly.img.text.alignHorizontal.inspectorBar',
        'ly.img.separator',
        'ly.img.fill.inspectorBar',
        'ly.img.spacer',
        'ly.img.inspectorToggle.inspectorBar'
      ]
    );

    // Set a custom inspector bar order for Crop edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.inspector.bar', when: { editMode: 'Crop' } },
      ['ly.img.cropControls.inspectorBar']
    );
```

Available edit modes: `'Transform'` (default), `'Text'`, `'Crop'`, `'Trim'`, or any custom value. Edit modes without specific configurations fall back to the Transform mode order. All Component Order API methods accept an optional `when` context. See the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md) for details.

## Custom Transform Order

Replace the default Transform mode order with a simplified layout. The following example groups text controls, appearance settings, and visual effects into logical sections separated by dividers.

```typescript highlight=highlight-custom-transform-order
// Set a simplified Transform mode order with grouped controls
cesdk.ui.setComponentOrder({ in: 'ly.img.inspector.bar' }, [
  'ly.img.spacer',
  'ly.img.text.typeFace.inspectorBar',
  'ly.img.text.bold.inspectorBar',
  'ly.img.text.italic.inspectorBar',
  'ly.img.text.fontSize.inspectorBar',
  'ly.img.text.alignHorizontal.inspectorBar',
  'ly.img.separator',
  'ly.img.fill.inspectorBar',
  'ly.img.stroke.inspectorBar',
  'ly.img.crop.inspectorBar',
  'ly.img.separator',
  'ly.img.filter.inspectorBar',
  'ly.img.effect.inspectorBar',
  'ly.img.blur.inspectorBar',
  'ly.img.adjustment.inspectorBar',
  'ly.img.separator',
  'ly.img.shadow.inspectorBar',
  'ly.img.opacityOptions.inspectorBar',
  'ly.img.position.inspectorBar',
  'ly.img.spacer',
  'ly.img.separator',
  'ly.img.inspectorToggle.inspectorBar'
]);
```

Components that don't apply to the selected block type are automatically hidden. For example, text controls only render when a text block is selected.

## Block-Type Specific Components

The inspector bar automatically shows and hides components based on the selected block's capabilities. Components only render when their associated controls are relevant.

| Block Type | Relevant Components |
|------------|---------------------|
| Text | Typography, font size, bold, italic, alignment, text background |
| Image | Fill, crop, filters, adjustments, effects, blur |
| Video | Fill, trim, volume, crop, playback speed |
| Shape | Shape options, fill, stroke, shadow |
| Audio | Trim, volume, replace |
| Cutout | Cutout type, offset, smoothing |
| Group | Group, ungroup |

This means a single component order can include controls for all block types. When a text block is selected, only text-relevant components appear. When an image is selected, only image-relevant components appear.

## Default Component Order

Retrieve the current inspector bar order with `getComponentOrder` to inspect the default layout. For detailed descriptions of each component ID, see the [Component Reference](./user-interface/customization/reference/component-reference.md).

```typescript highlight=highlight-default-order
// Retrieve and log the current inspector bar order
const currentOrder = cesdk.ui.getComponentOrder({
  in: 'ly.img.inspector.bar'
});
console.log('Current inspector bar order:', currentOrder);
```

### Common Controls

| Component ID | Description |
|--------------|-------------|
| `ly.img.fill.inspectorBar` | Fill color/type controls |
| `ly.img.stroke.inspectorBar` | Stroke/border controls |
| `ly.img.shadow.inspectorBar` | Drop shadow controls |
| `ly.img.opacityOptions.inspectorBar` | Opacity and blend mode |
| `ly.img.position.inspectorBar` | Position and alignment |
| `ly.img.crop.inspectorBar` | Enter crop mode |
| `ly.img.adjustment.inspectorBar` | Image adjustments |
| `ly.img.filter.inspectorBar` | Image filters |
| `ly.img.effect.inspectorBar` | Image effects |
| `ly.img.blur.inspectorBar` | Blur effects |
| `ly.img.inspectorToggle.inspectorBar` | Toggle advanced inspector |

### Text Controls

| Component ID | Description |
|--------------|-------------|
| `ly.img.text.typeFace.inspectorBar` | Font family selector |
| `ly.img.text.fontSize.inspectorBar` | Font size input |
| `ly.img.text.bold.inspectorBar` | Bold toggle |
| `ly.img.text.italic.inspectorBar` | Italic toggle |
| `ly.img.text.alignHorizontal.inspectorBar` | Horizontal alignment |

### Layout

| Component ID | Description |
|--------------|-------------|
| `ly.img.spacer` | Flexible space between groups |
| `ly.img.separator` | Visual divider between groups |

## Troubleshooting

- **Components not changing for edit mode** - Verify the `when: { editMode: '...' }` value matches exactly (case-sensitive).
- **View mode toggle not working** - Ensure `ly.img.inspectorToggle.inspectorBar` is included in the component order.
- **Component not appearing for block type** - The component may not be applicable to the selected block type. Inspector bar components only render when relevant.
- **Inspector bar hidden unexpectedly** - Check if `cesdk.feature.disable('ly.img.inspector.bar')` was called elsewhere.

## Next Steps

- [Component Order API](./user-interface/customization/reference/component-order-api.md) - Full API documentation with `when` context
- [Component Reference](./user-interface/customization/reference/component-reference.md) - All inspector bar component IDs
- [Canvas Bar](./user-interface/customization/canvas.md) - Another area with edit mode context



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support