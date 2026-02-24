> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Create Custom Components](./user-interface/customization/quick-start/create-custom-components.md)

---

Create and place custom UI components in CE.SDK using `registerComponent()` and `insertOrderComponent()`. Build buttons, controls, and multi-element components with the builder API.

![Create Custom Components example showing custom theme toggle in navigation bar and quick actions in dock](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-create-custom-components-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-create-custom-components-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-quick-start-create-custom-components-browser/)

Custom components let you extend CE.SDK's UI beyond built-in action buttons. The workflow has two steps: register the component with `registerComponent()`, then place it with `insertOrderComponent()`.

```typescript file=@cesdk_web_examples/guides-user-interface-customization-quick-start-create-custom-components-browser/browser.ts reference-only
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

    // Register a custom theme toggle button
    cesdk.ui.registerComponent('my.themeToggle', ({ builder }) => {
      const currentTheme = cesdk.ui.getTheme();
      builder.Button('my.themeToggle.button', {
        label: currentTheme === 'light' ? 'Dark Mode' : 'Light Mode',
        icon: '@imgly/Adjustments',
        variant: 'regular',
        onClick: () => {
          cesdk.ui.setTheme(currentTheme === 'light' ? 'dark' : 'light');
        }
      });
    });

    // Place the theme toggle in the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar' },
      'my.themeToggle'
    );

    // Register a quick actions component with multiple buttons
    cesdk.ui.registerComponent('my.quickActions', ({ builder }) => {
      // Zoom to fit button
      builder.Button('my.quickActions.zoomFit', {
        label: 'Fit',
        icon: '@imgly/ZoomIn',
        onClick: () => {
          const pages = cesdk.engine.scene.getPages();
          if (pages.length > 0) {
            cesdk.engine.scene.zoomToBlock(pages[0]);
          }
        }
      });

      // Reset zoom button
      builder.Button('my.quickActions.resetZoom', {
        label: 'Reset',
        icon: '@imgly/Reset',
        onClick: () => {
          cesdk.engine.scene.setZoomLevel(1.0);
        }
      });

      builder.Separator('my.quickActions.separator');

      // Center canvas button
      builder.Button('my.quickActions.center', {
        label: 'Center',
        icon: '@imgly/Position',
        onClick: () => {
          const pages = cesdk.engine.scene.getPages();
          if (pages.length > 0) {
            cesdk.engine.scene.zoomToBlock(pages[0], { padding: 40 });
          }
        }
      });
    });

    // Place quick actions in the dock
    cesdk.ui.insertOrderComponent({ in: 'ly.img.dock' }, [
      'ly.img.spacer',
      'my.quickActions'
    ]);

    // Register a component demonstrating different builder elements
    cesdk.ui.registerComponent('my.controls', ({ builder, state }) => {
      // Use state to track toggle value
      const { value: isEnabled, setValue: setIsEnabled } = state(
        'isEnabled',
        false
      );

      builder.Button('my.controls.toggle', {
        label: isEnabled ? 'Enabled' : 'Disabled',
        icon: '@imgly/Checkmark',
        variant: isEnabled ? 'regular' : 'plain',
        onClick: () => {
          setIsEnabled(!isEnabled);
          // eslint-disable-next-line no-console
          console.log(`Controls ${!isEnabled ? 'enabled' : 'disabled'}`);
        }
      });
    });

    // Place controls in the canvas bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.canvas.bar', at: 'top' },
      'my.controls'
    );

    // eslint-disable-next-line no-console
    console.log('Create Custom Components example loaded successfully');
  }
}

export default Example;
```

This guide covers registering components, placing them in UI areas, using the builder API to create buttons and controls, and managing component state.

## Register a Component

Use `cesdk.ui.registerComponent()` to define a custom component. The function receives a context object with `builder` for creating UI elements and `cesdk` for accessing the SDK.

```typescript highlight=highlight-register-component
// Register a custom theme toggle button
cesdk.ui.registerComponent('my.themeToggle', ({ builder }) => {
  const currentTheme = cesdk.ui.getTheme();
  builder.Button('my.themeToggle.button', {
    label: currentTheme === 'light' ? 'Dark Mode' : 'Light Mode',
    icon: '@imgly/Adjustments',
    variant: 'regular',
    onClick: () => {
      cesdk.ui.setTheme(currentTheme === 'light' ? 'dark' : 'light');
    }
  });
});
```

The component function is called whenever the UI needs to render. In this example, the button label updates based on the current theme since `getTheme()` is called inside the render function.

## Place the Component

Use `insertOrderComponent()` to add your registered component to any UI area.

```typescript highlight=highlight-place-component
// Place the theme toggle in the navigation bar
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar' },
  'my.themeToggle'
);
```

Components can be placed in any UI area:

- `ly.img.navigation.bar` - Top navigation bar
- `ly.img.dock` - Left-side dock panel
- `ly.img.inspector.bar` - Right-side inspector
- `ly.img.canvas.bar` - Canvas toolbar (with `at: 'top'` or `at: 'bottom'`)
- `ly.img.canvas.menu` - Context menu

## Build Multi-Button Components

A single registered component can render multiple builder elements. This example creates a "Quick Actions" component with zoom controls.

```typescript highlight=highlight-quick-actions
    // Register a quick actions component with multiple buttons
    cesdk.ui.registerComponent('my.quickActions', ({ builder }) => {
      // Zoom to fit button
      builder.Button('my.quickActions.zoomFit', {
        label: 'Fit',
        icon: '@imgly/ZoomIn',
        onClick: () => {
          const pages = cesdk.engine.scene.getPages();
          if (pages.length > 0) {
            cesdk.engine.scene.zoomToBlock(pages[0]);
          }
        }
      });

      // Reset zoom button
      builder.Button('my.quickActions.resetZoom', {
        label: 'Reset',
        icon: '@imgly/Reset',
        onClick: () => {
          cesdk.engine.scene.setZoomLevel(1.0);
        }
      });

      builder.Separator('my.quickActions.separator');

      // Center canvas button
      builder.Button('my.quickActions.center', {
        label: 'Center',
        icon: '@imgly/Position',
        onClick: () => {
          const pages = cesdk.engine.scene.getPages();
          if (pages.length > 0) {
            cesdk.engine.scene.zoomToBlock(pages[0], { padding: 40 });
          }
        }
      });
    });

    // Place quick actions in the dock
    cesdk.ui.insertOrderComponent({ in: 'ly.img.dock' }, [
      'ly.img.spacer',
      'my.quickActions'
    ]);
```

The component is placed in the dock after a spacer, pushing it toward the bottom. Each button performs a specific action when clicked.

## Use Component State

The builder context provides a `state` function for managing local component state. State persists across re-renders and triggers updates when changed.

```typescript highlight=highlight-builder-elements
    // Register a component demonstrating different builder elements
    cesdk.ui.registerComponent('my.controls', ({ builder, state }) => {
      // Use state to track toggle value
      const { value: isEnabled, setValue: setIsEnabled } = state(
        'isEnabled',
        false
      );

      builder.Button('my.controls.toggle', {
        label: isEnabled ? 'Enabled' : 'Disabled',
        icon: '@imgly/Checkmark',
        variant: isEnabled ? 'regular' : 'plain',
        onClick: () => {
          setIsEnabled(!isEnabled);
          // eslint-disable-next-line no-console
          console.log(`Controls ${!isEnabled ? 'enabled' : 'disabled'}`);
        }
      });
    });

    // Place controls in the canvas bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.canvas.bar', at: 'top' },
      'my.controls'
    );
```

The `state` function takes an ID and default value, returning the current value and a setter. When `setValue` is called, the component re-renders with the new value.

## Builder Elements Reference

Common builder methods for creating UI elements:

| Method | Purpose | Key Options |
|--------|---------|-------------|
| `builder.Button()` | Clickable button | `label`, `icon`, `onClick`, `variant` |
| `builder.Separator()` | Visual divider | None |
| `builder.Checkbox()` | Toggle control | `value`, `setValue`, `inputLabel` |
| `builder.Select()` | Dropdown selector | `values`, `value`, `setValue` |
| `builder.Slider()` | Range input | `min`, `max`, `value`, `setValue` |

For the complete builder API, see [Register New Component](./user-interface/ui-extensions/register-new-component.md).

## Component Registration Timing

Components must be registered before they can be placed. Call `registerComponent()` before `insertOrderComponent()`. In the plugin pattern, both calls happen inside `initialize()`, ensuring the correct order. If registering outside a plugin, register components during the `onCreate` callback or immediately after initialization.

## Naming Conventions

Follow these patterns for component IDs:

- Use a unique prefix: `my.`, `company.`, `app.`
- Follow the pattern: `[prefix].[feature]` (e.g., `my.themeToggle`)
- Use dot notation for child elements: `my.themeToggle.button`

## Troubleshooting

**Component not appearing** - Ensure `registerComponent()` is called before `insertOrderComponent()`. Components must be registered first.

**Duplicate component error** - Each component ID must be unique. Don't register the same ID twice.

**State not updating** - Verify you're calling `setValue()` from the state function, not modifying the value directly.

**Builder elements not rendering** - Check for JavaScript errors in the component function. The render function must complete without throwing.

## API Reference

| Method | Purpose |
|--------|---------|
| `cesdk.ui.registerComponent()` | Register a custom component |
| `cesdk.ui.insertOrderComponent()` | Place a component in a UI area |
| `builder.Button()` | Create a button element |
| `builder.Separator()` | Create a visual separator |
| `state()` | Manage component-local state |

## Next Steps

[Register New Component](./user-interface/ui-extensions/register-new-component.md) - Full builder API documentation with all element types

[Component Order API](./user-interface/customization/reference/component-order-api.md) - All placement options and matchers

[Add Action Buttons](./user-interface/customization/quick-start/add-action-buttons.md) - Built-in action buttons without registration



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support