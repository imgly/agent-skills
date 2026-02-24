> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Navigation Bar](./user-interface/customization/navigation-bar.md)

---

The navigation bar is the horizontal toolbar at the top of the editor containing buttons for back navigation, undo/redo, zoom controls, and action buttons. This guide covers navigation bar-specific features like the actions dropdown, back/close buttons, and callback integration.

![Navigation Bar Hero](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

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
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-navigation-bar-browser/)

Actions that affect browser navigation (e.g., going back or closing the editor), have global effects on the scene (e.g., undo/redo and zoom), or process the scene in some way (e.g., saving and exporting) belong in the navigation bar.

For general component manipulation (reordering, inserting, removing), see the [Component Order API Reference](./user-interface/customization/reference/component-order-api.md). For a complete list of navigation bar component IDs, see the [Component Reference](./user-interface/customization/reference/component-reference.md).

```typescript file=@cesdk_web_examples/guides-user-interface-customization-navigation-bar-browser/browser.ts reference-only
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
      { color: { r: 0.388, g: 0.4, b: 0.945, a: 1 }, stop: 0 },
      { color: { r: 0.545, g: 0.361, b: 0.965, a: 1 }, stop: 0.5 },
      { color: { r: 0.024, g: 0.714, b: 0.831, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create centered text
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(titleText, 'Navigation Bar\n\nimg.ly');
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

    // Hide undo/redo using the Feature API
    cesdk.feature.disable('ly.img.navigation.undoRedo');

    // Insert a back button at the start of the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'start' },
      {
        id: 'ly.img.back.navigationBar',
        onClick: () => {
          console.log('Back button clicked');
          window.history.back();
        }
      }
    );

    // Insert a close button at the end of the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.close.navigationBar',
        onClick: () => {
          console.log('Close button clicked');
        }
      }
    );

    // Add a standalone action button with accent styling
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.close.navigationBar' },
      {
        id: 'ly.img.action.navigationBar',
        key: 'share',
        label: 'Share',
        icon: '@imgly/Share',
        color: 'accent',
        onClick: async () => {
          cesdk.ui.showNotification({
            message: 'Share dialog would open here',
            type: 'info',
            duration: 'short'
          });
        }
      }
    );

    // Add buttons demonstrating different style variants
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.close.navigationBar' },
      [
        // Regular variant (default) - standard button appearance
        {
          id: 'ly.img.action.navigationBar',
          key: 'preview',
          label: 'Preview',
          icon: '@imgly/EyeOpen',
          variant: 'regular' as const,
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Opening preview...',
              type: 'info',
              duration: 'short'
            });
          }
        },
        // Plain variant - subtle/borderless appearance
        {
          id: 'ly.img.action.navigationBar',
          key: 'reset',
          label: 'Reset',
          icon: '@imgly/Reset',
          variant: 'plain' as const,
          color: 'danger' as const,
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Reset would clear all changes',
              type: 'warning',
              duration: 'short'
            });
          }
        }
      ]
    );

    // Insert the actions dropdown with export options
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.close.navigationBar' },
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          {
            id: 'ly.img.saveScene.navigationBar',
            onClick: async () => {
              const scene = await cesdk.engine.scene.saveToString();
              console.log('Scene saved:', scene.length, 'characters');
              cesdk.ui.showNotification({
                message: 'Scene saved to console',
                type: 'success',
                duration: 'short'
              });
            }
          },
          {
            id: 'ly.img.exportImage.navigationBar',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'image/png'
              });
              cesdk.utils.downloadFile(blobs[0], 'image/png');
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'print',
            label: 'Print',
            icon: '@imgly/Print',
            onClick: () => {
              window.print();
            }
          }
        ]
      }
    );

    // Register a custom callback
    cesdk.actions.register('saveScene', async () => {
      const scene = await cesdk.engine.scene.saveToString();
      console.log('Custom save callback:', scene.length, 'characters');
      cesdk.ui.showNotification({
        message: 'Scene saved via custom callback',
        type: 'success',
        duration: 'short'
      });
    });
  }
}

export default Example;
```

This guide covers:

- Showing or hiding the navigation bar and sub-components
- Configuring the actions dropdown with grouped actions
- Adding back and close buttons with handlers
- Customizing button styles and variants
- Integrating with the Callbacks API

## Show or Hide the Navigation Bar

Use the Feature API to control navigation bar visibility. The Feature API hides features globally across the entire editor.

```typescript highlight=highlight-hide-subcomponents
// Hide undo/redo using the Feature API
cesdk.feature.disable('ly.img.navigation.undoRedo');
```

The following feature keys control navigation bar sub-components:

| Feature Key | Controls |
|-------------|----------|
| `ly.img.navigation.bar` | Entire navigation bar |
| `ly.img.navigation.undoRedo` | Undo/redo buttons |
| `ly.img.navigation.zoom` | Zoom controls |
| `ly.img.navigation.preview` | Preview toggle |

For more visibility control options, see [Show/Hide Components](./user-interface/customization/quick-start/show-hide-components.md).

## Add Back and Close Buttons

Back and close buttons only appear when explicitly inserted with an `onClick` handler. Use `insertOrderComponent` with explicit positioning to place them at the start and end of the navigation bar.

Add a back button at the start using `position: 'start'`:

```typescript highlight=highlight-back-button
// Insert a back button at the start of the navigation bar
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', position: 'start' },
  {
    id: 'ly.img.back.navigationBar',
    onClick: () => {
      console.log('Back button clicked');
      window.history.back();
    }
  }
);
```

Add a close button at the end using `position: 'end'`:

```typescript highlight=highlight-close-button
// Insert a close button at the end of the navigation bar
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', position: 'end' },
  {
    id: 'ly.img.close.navigationBar',
    onClick: () => {
      console.log('Close button clicked');
    }
  }
);
```

Both buttons require an `onClick` handler. Without one, the button will not render.

## Configure the Actions Dropdown

The `ly.img.actions.navigationBar` component groups multiple actions into a dropdown menu. The first child appears as a prominent button, while additional children appear in the overflow dropdown.

The actions dropdown is not in the navigation bar by default. Use `insertOrderComponent` to add it with your own actions:

```typescript highlight=highlight-actions-dropdown
// Insert the actions dropdown with export options
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', before: 'ly.img.close.navigationBar' },
  {
    id: 'ly.img.actions.navigationBar',
    children: [
      {
        id: 'ly.img.saveScene.navigationBar',
        onClick: async () => {
          const scene = await cesdk.engine.scene.saveToString();
          console.log('Scene saved:', scene.length, 'characters');
          cesdk.ui.showNotification({
            message: 'Scene saved to console',
            type: 'success',
            duration: 'short'
          });
        }
      },
      {
        id: 'ly.img.exportImage.navigationBar',
        onClick: async () => {
          const { blobs } = await cesdk.utils.export({
            mimeType: 'image/png'
          });
          cesdk.utils.downloadFile(blobs[0], 'image/png');
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'print',
        label: 'Print',
        icon: '@imgly/Print',
        onClick: () => {
          window.print();
        }
      }
    ]
  }
);
```

Children can be built-in action buttons (referenced by ID like `ly.img.saveScene.navigationBar`) or custom actions with a unique `key`. Each child needs an `onClick` handler to define its behavior.

## Button Styles and Variants

Custom action buttons support different visual styles through the `variant` and `color` properties.

```typescript highlight=highlight-button-styles
// Add buttons demonstrating different style variants
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', before: 'ly.img.close.navigationBar' },
  [
    // Regular variant (default) - standard button appearance
    {
      id: 'ly.img.action.navigationBar',
      key: 'preview',
      label: 'Preview',
      icon: '@imgly/EyeOpen',
      variant: 'regular' as const,
      onClick: () => {
        cesdk.ui.showNotification({
          message: 'Opening preview...',
          type: 'info',
          duration: 'short'
        });
      }
    },
    // Plain variant - subtle/borderless appearance
    {
      id: 'ly.img.action.navigationBar',
      key: 'reset',
      label: 'Reset',
      icon: '@imgly/Reset',
      variant: 'plain' as const,
      color: 'danger' as const,
      onClick: () => {
        cesdk.ui.showNotification({
          message: 'Reset would clear all changes',
          type: 'warning',
          duration: 'short'
        });
      }
    }
  ]
);
```

The available properties for action buttons are:

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique identifier (required for custom actions) |
| `label` | `string` | Text label or i18n key |
| `icon` | `string` | Icon from the Essentials set or custom icon via `addIconSet` |
| `variant` | `'regular' \| 'plain'` | Button style (default: `'regular'`) |
| `color` | `'accent' \| 'danger'` | Button color for emphasis |
| `onClick` | `() => void \| Promise<void>` | Click handler (shows spinner if returning a promise) |
| `isDisabled` | `boolean` | Disable the button |
| `isLoading` | `boolean` | Show loading state |

## Integration with Callbacks API

Action buttons can trigger registered callbacks. Register a callback using `cesdk.actions.register()`, then reference it by inserting a built-in action button that maps to that callback name.

```typescript highlight=highlight-callbacks-api
// Register a custom callback
cesdk.actions.register('saveScene', async () => {
  const scene = await cesdk.engine.scene.saveToString();
  console.log('Custom save callback:', scene.length, 'characters');
  cesdk.ui.showNotification({
    message: 'Scene saved via custom callback',
    type: 'success',
    duration: 'short'
  });
});
```

When you insert a built-in action button by its ID (e.g., `ly.img.saveScene.navigationBar`), it will call the registered callback with the matching name. You can also override the default behavior by providing a custom `onClick` handler directly on the button.

### Default Callback Behaviors

When using built-in action button IDs without registering a custom callback, the default behavior is triggered:

| Component ID | Callback | Default Behavior |
|--------------|----------|------------------|
| `ly.img.saveScene.navigationBar` | `saveScene` | Downloads `.scene` file |
| `ly.img.importScene.navigationBar` | `importScene` | Opens file picker for `.scene` |
| `ly.img.exportImage.navigationBar` | `exportDesign` | Exports and downloads image |
| `ly.img.exportPDF.navigationBar` | `exportDesign` | Exports and downloads PDF |
| `ly.img.exportVideo.navigationBar` | `exportDesign` | Exports and downloads video |
| `ly.img.shareScene.navigationBar` | `shareScene` | Requires callback registration |

## Standalone Action Buttons

In addition to the actions dropdown, you can insert standalone action buttons directly into the navigation bar. This is useful for frequently-used actions that should always be visible.

```typescript highlight=highlight-custom-action
// Add a standalone action button with accent styling
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', before: 'ly.img.close.navigationBar' },
  {
    id: 'ly.img.action.navigationBar',
    key: 'share',
    label: 'Share',
    icon: '@imgly/Share',
    color: 'accent',
    onClick: async () => {
      cesdk.ui.showNotification({
        message: 'Share dialog would open here',
        type: 'info',
        duration: 'short'
      });
    }
  }
);
```

Standalone buttons appear alongside the other navigation bar components. Use the `before` and `after` position options to control placement relative to other components.

## Troubleshooting

- **Back/close button not appearing** — These require an explicit `onClick` handler when inserted.
- **Actions not showing children** — Ensure `children` array contains valid action components with unique `key` values.
- **Sub-component still visible after disable** — Verify exact Feature API key spelling.

## Next Steps

- [Component Order API Reference](./user-interface/customization/reference/component-order-api.md) — Full API for component manipulation
- [Component Reference](./user-interface/customization/reference/component-reference.md) — All navigation bar component IDs
- [Add Action Buttons](./user-interface/customization/quick-start/add-action-buttons.md) — Quick start for adding simple buttons
- [Register New Component](./user-interface/ui-extensions/register-new-component.md) — Create fully custom components



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support