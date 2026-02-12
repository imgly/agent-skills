> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Dock](./user-interface/customization/dock.md)

---

The dock is the vertical sidebar containing buttons that open asset library
panels. This guide covers dock-specific features like appearance settings,
edit mode contexts, and the asset source relationship.

![Dock customization example showing large icons, hidden labels, and a custom settings button](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

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
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-dock-browser/)

For adding and configuring dock buttons, see [Add Dock Buttons](./user-interface/customization/quick-start/add-dock-buttons.md). For general component manipulation (reordering, inserting, removing), see the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md).

```typescript file=@cesdk_web_examples/guides-user-interface-customization-dock-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create gradient background
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.18, g: 0.42, b: 0.71, a: 1 }, stop: 0 },
      { color: { r: 0.31, g: 0.58, b: 0.8, a: 1 }, stop: 0.5 },
      { color: { r: 0.13, g: 0.7, b: 0.67, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create centered text
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(titleText, 'Dock\n\nimg.ly');
    engine.block.setWidth(titleText, pageWidth);
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.setPositionX(titleText, 0);
    engine.block.setPositionY(titleText, pageHeight * 0.35);
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setFloat(titleText, 'text/fontSize', 24);
    engine.block.setTextColor(titleText, { r: 1, g: 1, b: 1, a: 1 });

    // Deselect all blocks for clean hero image
    engine.block
      .findAllSelected()
      .forEach((block) => engine.block.setSelected(block, false));
    engine.block.select(page);

    // Configure dock to use large icons and hide text labels
    cesdk.engine.editor.setSetting('dock/iconSize', 'large');
    cesdk.engine.editor.setSetting('dock/hideLabels', true);

    // Set a simplified dock for Text edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.dock', when: { editMode: 'Text' } },
      [
        {
          id: 'ly.img.assetLibrary.dock',
          key: 'ly.img.text',
          icon: '@imgly/Text',
          label: 'libraries.ly.img.text.label',
          entries: ['ly.img.text']
        }
      ]
    );

    // Add a custom asset source, create an entry for it, and add a dock button
    // Step 1: Create the asset source (stores/provides assets)
    cesdk.engine.asset.addLocalSource('my.brand.assets');

    // Step 2: Create an asset library entry (UI representation of the source)
    cesdk.ui.addAssetLibraryEntry({
      id: 'my.brand.entry',
      sourceIds: ['my.brand.assets'],
      previewLength: 3,
      gridColumns: 3,
      gridItemHeight: 'square'
    });

    // Step 3: Add a dock button that opens the entry
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', position: 'end' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'brand',
        entries: ['my.brand.entry'],
        label: 'Brand',
        icon: '@imgly/Favorite'
      }
    );

    // Register a custom component and add it to the dock bottom
    cesdk.ui.registerComponent('my.settings.button', ({ builder }) => {
      builder.Button('settings', {
        label: 'Settings',
        icon: '@imgly/Settings',
        onClick: () => {
          cesdk.ui.showNotification({
            message: 'Settings panel would open here',
            type: 'info',
            duration: 'short'
          });
        }
      });
    });

    cesdk.ui.insertOrderComponent({ in: 'ly.img.dock', position: 'end' }, [
      'ly.img.spacer',
      'my.settings.button'
    ]);

    // Retrieve and log the current dock order for reference
    const currentOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.dock'
    });
    console.log('Current dock order:', currentOrder);
  }
}

export default Example;
```

This guide covers configuring dock appearance settings, setting up edit mode-specific layouts, understanding the relationship between dock entries and asset sources, adding custom registered components, and viewing the default component order.

## Show or Hide the Dock

Use the Feature API to control dock visibility:

```typescript
// Hide the dock
cesdk.feature.disable('ly.img.dock');

// Show the dock (default)
cesdk.feature.enable('ly.img.dock');
```

For more on the Feature API, see [Show/Hide Components](./user-interface/customization/quick-start/show-hide-components.md).

## Dock Appearance Settings

Two editor settings control how dock buttons look. Set `dock/iconSize` to `'large'` for 24px icons or `'normal'` for the default 16px. Set `dock/hideLabels` to `true` to show icons only.. When hidden, labels appear as tooltips on hover.

```typescript highlight=highlight-appearance-settings
// Configure dock to use large icons and hide text labels
cesdk.engine.editor.setSetting('dock/iconSize', 'large');
cesdk.engine.editor.setSetting('dock/hideLabels', true);
```

| Setting           | Values                  | Description                       |
| ----------------- | ----------------------- | --------------------------------- |
| `dock/iconSize`   | `'normal'` | `'large'` | Button icon size (16px or 24px)   |
| `dock/hideLabels` | `boolean`               | Hide text labels, show icons only |

## Edit Mode Context

The dock supports different component orders for different edit modes. Use the `when` option in `setComponentOrder` to define a layout that activates only in a specific mode. The following example sets a simplified dock that appears only when the user enters Text edit mode.

```typescript highlight=highlight-edit-mode-context
// Set a simplified dock for Text edit mode
cesdk.ui.setComponentOrder(
  { in: 'ly.img.dock', when: { editMode: 'Text' } },
  [
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.text',
      icon: '@imgly/Text',
      label: 'libraries.ly.img.text.label',
      entries: ['ly.img.text']
    }
  ]
);
```

Available edit modes: `'Transform'` (default), `'Text'`, `'Crop'`, `'Trim'`, or any custom value. All Component Order API methods accept an optional `when` context. See the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md) for details.

## Relationship with Asset Sources

Asset sources, asset library entries, and dock buttons work together in three steps:

1. **Create an asset source** — Register a source with the engine that stores and provides assets
2. **Create an asset library entry** — Define a UI entry that references the source via `sourceIds`
3. **Add a dock button** — Insert a button that opens the entry via the `entries` array

```typescript highlight=highlight-asset-source-relationship
    // Add a custom asset source, create an entry for it, and add a dock button
    // Step 1: Create the asset source (stores/provides assets)
    cesdk.engine.asset.addLocalSource('my.brand.assets');

    // Step 2: Create an asset library entry (UI representation of the source)
    cesdk.ui.addAssetLibraryEntry({
      id: 'my.brand.entry',
      sourceIds: ['my.brand.assets'],
      previewLength: 3,
      gridColumns: 3,
      gridItemHeight: 'square'
    });

    // Step 3: Add a dock button that opens the entry
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', position: 'end' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'brand',
        entries: ['my.brand.entry'],
        label: 'Brand',
        icon: '@imgly/Favorite'
      }
    );
```

The `entries` array on the dock button takes **entry IDs**, not source IDs. If the entry ID doesn't exist, the button won't appear.

## Adding Custom Registered Components

Register fully custom components and add them to the dock. Use `cesdk.ui.registerComponent()` to define a component with the builder pattern, then insert it into the dock order. A spacer pushes the custom button to the bottom of the dock.

```typescript highlight=highlight-custom-component
    // Register a custom component and add it to the dock bottom
    cesdk.ui.registerComponent('my.settings.button', ({ builder }) => {
      builder.Button('settings', {
        label: 'Settings',
        icon: '@imgly/Settings',
        onClick: () => {
          cesdk.ui.showNotification({
            message: 'Settings panel would open here',
            type: 'info',
            duration: 'short'
          });
        }
      });
    });

    cesdk.ui.insertOrderComponent({ in: 'ly.img.dock', position: 'end' }, [
      'ly.img.spacer',
      'my.settings.button'
    ]);
```

For the complete builder API documentation, see [Register a New Component](./user-interface/ui-extensions/register-new-component.md).

## Default Component Order

Retrieve the current dock order with `getComponentOrder` to inspect the default layout. For detailed descriptions of each component ID, see the [Component Reference](./user-interface/customization/reference/component-reference.md).

```typescript highlight=highlight-default-order
// Retrieve and log the current dock order for reference
const currentOrder = cesdk.ui.getComponentOrder({
  in: 'ly.img.dock'
});
console.log('Current dock order:', currentOrder);
```

### Asset Library Buttons

| Component ID               | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| `ly.img.assetLibrary.dock` | Asset library button (configurable with `key`, `label`, `icon`, `entries`) |

### Layout

| Component ID       | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `ly.img.spacer`    | Flexible space (pushes components below to the bottom) |
| `ly.img.separator` | Visual divider between groups of buttons               |

## Troubleshooting

- **Dock button not appearing** - Verify you created an asset library entry (via `addAssetLibraryEntry`) that references your source, and that the dock button's `entries` array uses the entry ID.
- **Edit mode dock not changing** - Verify the `when: { editMode: '...' }` value matches exactly (case-sensitive).
- **Dock hidden unexpectedly** - Check if `cesdk.feature.disable('ly.img.dock')` was called elsewhere.
- **Appearance settings not applying** - Ensure `setSetting` is called after CE.SDK initialization completes.

## Next Steps

- [Add Dock Buttons](./user-interface/customization/quick-start/add-dock-buttons.md) - Quick start for adding asset
  library buttons
- [Component Order API](./user-interface/customization/reference/component-order-api.md) - Full API documentation with
  `when` context
- [Register a New Component](./user-interface/ui-extensions/register-new-component.md) - Create fully custom
  components
- [Component Reference](./user-interface/customization/reference/component-reference.md) - All dock component IDs
- [Asset Library](./user-interface/ui-extensions/asset-library.md) - Configure and register asset sources



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support