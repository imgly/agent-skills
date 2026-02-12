> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [UI Extensions](./user-interface/ui-extensions.md) > [Create Custom Panel](./user-interface/ui-extensions/create-custom-panel.md)

---

Create custom sidebar panels that integrate with CE.SDK's user interface using the builder system and built-in components.

![Create Custom Panel](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ui-extensions-create-custom-panel-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ui-extensions-create-custom-panel-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-ui-extensions-create-custom-panel-browser/)

Custom panels extend CE.SDK by adding sidebar interfaces that match the editor's design language. The builder system provides pre-built components for forms, buttons, and media display, allowing you to create rich editing experiences without building UI from scratch.

```typescript file=@cesdk_web_examples/guides-user-interface-ui-extensions-create-custom-panel-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

export default class CreateCustomPanelExample implements EditorPlugin {
  name = 'CreateCustomPanelExample';
  version = '1.0.0';

  async initialize(context: EditorPluginContext) {
    const { cesdk } = context;
    if (!cesdk) return;

    await cesdk.createDesignScene();

    cesdk.i18n.setTranslations({
      en: { 'panel.my-settings': 'My Settings Panel' }
    });

    cesdk.ui.registerPanel('my-settings', ({ builder, engine, state }) => {

      const textState = state('text', 'Hello CE.SDK');
      const opacityState = state('opacity', 100);

      builder.Section('settings', {
        title: 'Settings',
        children: () => {

          builder.TextInput('name', {
            inputLabel: 'Name',
            ...textState
          });

          builder.Slider('opacity', {
            inputLabel: 'Opacity',
            min: 0,
            max: 100,
            ...opacityState
          });

          builder.Checkbox('enabled', {
            inputLabel: 'Enable feature',
            value: true,
            setValue: () => {}
          });

          builder.Button('apply', {
            label: 'Apply',
            onClick: () => {

              const page = engine.block.findByType('page')[0];
              engine.block.setOpacity(page, opacityState.value / 100);
            }
          });

          const selected = engine.block.findAllSelected();
          if (selected.length > 0) {
            builder.Text('info', { content: `${selected.length} selected` });
          }
        }
      });
    });

    cesdk.ui.registerComponent('settings-btn', ({ builder }) => {
      builder.Button('toggle', {
        label: 'Settings',
        icon: '@imgly/Settings',
        isActive: cesdk.ui.isPanelOpen('my-settings'),
        onClick: () => cesdk.ui.openPanel('my-settings')
      });
    });

    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }), 'settings-btn']);

    cesdk.ui.openPanel('my-settings');
  }
}
```

This guide covers how to register panels, use builder components, manage local state, respond to engine changes, set panel titles, and integrate panels with the dock.

## Registering a Custom Panel

Register a panel using `cesdk.ui.registerPanel()` with a unique ID and a render function. The render function receives `builder`, `engine`, and `state` as arguments.

```typescript highlight-register-panel
cesdk.ui.registerPanel('my-settings', ({ builder, engine, state }) => {
```

The panel renders whenever the function is called. CE.SDK tracks engine method calls within the render function and re-invokes it when relevant state changes.

## Managing Local State

Use the `state` function to create panel-local state that persists across re-renders. Call `state('key', defaultValue)` to get `value` and `setValue` properties.

```typescript highlight-local-state
const textState = state('text', 'Hello CE.SDK');
const opacityState = state('opacity', 100);
```

State objects integrate directly with input components by spreading the object into the component props.

## Structuring with Sections

Group related components using `builder.Section()`. Sections accept a title and a children function containing nested components.

```typescript highlight-section
builder.Section('settings', {
  title: 'Settings',
  children: () => {
```

Sections provide visual organization and collapsible areas within your panel.

## Using Input Components

### Text Input

Capture text with `builder.TextInput()`. Bind to state using the value and setValue properties.

```typescript highlight-text-input
builder.TextInput('name', {
  inputLabel: 'Name',
  ...textState
});
```

### Slider

Handle numeric ranges with `builder.Slider()`. Configure min, max, and step values.

```typescript highlight-slider
builder.Slider('opacity', {
  inputLabel: 'Opacity',
  min: 0,
  max: 100,
  ...opacityState
});
```

### Checkbox

Toggle boolean values with `builder.Checkbox()`.

```typescript highlight-checkbox
builder.Checkbox('enabled', {
  inputLabel: 'Enable feature',
  value: true,
  setValue: () => {}
});
```

## Adding Buttons

Add interactive buttons with `builder.Button()`. Configure the label, icon, and onClick handler.

```typescript highlight-button
builder.Button('apply', {
  label: 'Apply',
  onClick: () => {
```

## Accessing Engine State

Access engine state within the render function to create reactive panels. The panel re-renders when tracked engine state changes.

```typescript highlight-engine-reactive
const selected = engine.block.findAllSelected();
if (selected.length > 0) {
  builder.Text('info', { content: `${selected.length} selected` });
}
```

## Modifying Engine State

Use engine APIs within event handlers to modify the scene based on panel input.

```typescript highlight-engine-modify
const page = engine.block.findByType('page')[0];
engine.block.setOpacity(page, opacityState.value / 100);
```

## Setting the Panel Title

Set panel titles through i18n translations. The translation key follows the pattern `panel.[panelId]`.

```typescript highlight-set-title
cesdk.i18n.setTranslations({
  en: { 'panel.my-settings': 'My Settings Panel' }
});
```

## Adding a Dock Button

Register a component that renders a button to toggle your panel. Use `cesdk.ui.isPanelOpen()` to track state.

```typescript highlight-register-dock-button
cesdk.ui.registerComponent('settings-btn', ({ builder }) => {
  builder.Button('toggle', {
    label: 'Settings',
    icon: '@imgly/Settings',
    isActive: cesdk.ui.isPanelOpen('my-settings'),
    onClick: () => cesdk.ui.openPanel('my-settings')
  });
});
```

Add the component to the dock order.

```typescript highlight-add-to-dock
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }), 'settings-btn']);
```

## Opening the Panel

Open your custom panel programmatically using `cesdk.ui.openPanel()`.

```typescript highlight-open-panel
cesdk.ui.openPanel('my-settings');
```

> **Note:** To learn how to manage panel lifecycle and positioning, see [Panel](./user-interface/customization/panel.md).

## API Reference

| Method | Description |
|--------|-------------|
| `cesdk.ui.registerPanel(id, renderFn)` | Registers a panel with a unique ID and render function. The render function receives `builder`, `engine`, and `state`. |
| `cesdk.ui.openPanel(id)` | Opens a registered panel by ID. |
| `cesdk.ui.isPanelOpen(id)` | Returns `true` if the panel is currently open. |
| `state(key, defaultValue)` | Creates panel-local state. Returns `{ value, setValue }` for use with input components. |
| `cesdk.i18n.setTranslations(translations)` | Sets translation strings. Use key `panel.[panelId]` for panel titles. |

## Next Steps

[Register New Component](./user-interface/ui-extensions/register-new-component.md) — Create reusable custom components for use across panels.

[Customize UI Behavior](./user-interface/ui-extensions/customize-behaviour.md) — Control UI programmatically with events and notifications.

[Add Action Buttons](./user-interface/customization/quick-start/add-action-buttons.md) — Add buttons to navigation bar, canvas menu, and other UI areas.

[Dock](./user-interface/customization/dock.md) — Configure the editor dock area and component ordering.



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support