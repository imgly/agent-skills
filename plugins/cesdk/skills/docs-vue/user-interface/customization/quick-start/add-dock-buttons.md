> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Add Dock Buttons](./user-interface/customization/quick-start/add-dock-buttons.md)

---

Add asset library buttons to the CE.SDK dock using the built-in `ly.img.assetLibrary.dock` component with custom entries, labels, icons, and click handlers.

![Add Dock Buttons example showing a dock with custom Media, Elements, Text, and Upload buttons](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-add-dock-buttons-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-add-dock-buttons-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-quick-start-add-dock-buttons-browser/)

CE.SDK provides the `ly.img.assetLibrary.dock` component for adding buttons to the dock that open the asset library panel. This is the fastest way to give users access to specific asset categories without registering custom components.

```typescript file=@cesdk_web_examples/guides-user-interface-customization-quick-start-add-dock-buttons-browser/browser.ts reference-only
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

    // First, clear the default dock to demonstrate our custom dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, []);

    // Add a Media button combining images and videos
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'media',
        entries: ['ly.img.image', 'ly.img.video'],
        label: 'Media',
        icon: '@imgly/Image'
      }
    );

    // Add an Elements button for shapes and stickers
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'elements',
        entries: ['ly.img.sticker', 'ly.img.vectorpath'],
        label: 'Elements',
        icon: '@imgly/Shapes'
      }
    );

    // Add a Text button
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'text',
        entries: ['ly.img.text'],
        label: 'Text',
        icon: '@imgly/Text'
      }
    );

    // Add an Upload button with custom onClick handler
    cesdk.ui.insertOrderComponent({ in: 'ly.img.dock' }, [
      'ly.img.spacer', // Push upload to bottom
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'upload',
        entries: ['ly.img.upload'],
        label: 'Upload',
        icon: '@imgly/Upload',
        onClick: () => {
          // Custom behavior instead of opening asset library
          // eslint-disable-next-line no-console
          console.log('Custom upload action triggered!');
          // In production: open your custom upload dialog
          alert('Custom upload dialog would open here!');
        }
      }
    ]);

    // Insert a separator between Elements and Text
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', after: { key: 'elements' } },
      'ly.img.separator'
    );

    // Insert a button at the beginning of the dock
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', position: 'start' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'templates',
        entries: ['ly.img.template'],
        label: 'Templates',
        icon: '@imgly/Template'
      }
    );

    // eslint-disable-next-line no-console
    console.log('Add Dock Buttons example loaded successfully');
  }
}

export default Example;
```

This guide covers adding single dock buttons, combining multiple asset categories, configuring button appearance, adding custom click handlers, and organizing buttons with separators and spacers.

## Add a Single Dock Button

Use `insertOrderComponent()` with the asset library dock component and inline configuration to add a button to the dock. The `entries` array specifies which asset library entries open when the button is clicked.

```typescript highlight=highlight-single-button
// Add a Media button combining images and videos
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.dock' },
  {
    id: 'ly.img.assetLibrary.dock',
    key: 'media',
    entries: ['ly.img.image', 'ly.img.video'],
    label: 'Media',
    icon: '@imgly/Image'
  }
);
```

When clicked, this button opens the asset library panel showing both images and videos. The `key` property must be unique when using multiple dock buttons with the same component ID.

## Configure Button Appearance

The `ly.img.assetLibrary.dock` component accepts these configuration properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Must be `'ly.img.assetLibrary.dock'` |
| `key` | `string` | Unique identifier (required when using multiple dock buttons) |
| `entries` | `string[]` | Asset library entry IDs to show when clicked |
| `label` | `string` | Button text label (supports i18n keys) |
| `icon` | `string` | Icon identifier (e.g., `'@imgly/Image'`, `'@imgly/Shapes'`) |
| `onClick` | `() => void` | Custom click handler (overrides default panel behavior) |
| `selected` | `boolean` | Override the selected state |
| `disabled` | `boolean` | Whether button is disabled |
| `size` | `'normal' \| 'large'` | Button size |
| `variant` | `'regular' \| 'plain'` | Button style variant |
| `color` | `string` | Button color |

```typescript highlight=highlight-button-config
// Add an Elements button for shapes and stickers
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.dock' },
  {
    id: 'ly.img.assetLibrary.dock',
    key: 'elements',
    entries: ['ly.img.sticker', 'ly.img.vectorpath'],
    label: 'Elements',
    icon: '@imgly/Shapes'
  }
);
```

This example adds an Elements button that opens shapes and stickers when clicked.

## Add a Custom Click Handler

Override the default panel-opening behavior with a custom action using the `onClick` property. This is useful when you want a dock button to trigger custom functionality instead of opening the asset library.

```typescript highlight=highlight-custom-onclick
// Add an Upload button with custom onClick handler
cesdk.ui.insertOrderComponent({ in: 'ly.img.dock' }, [
  'ly.img.spacer', // Push upload to bottom
  {
    id: 'ly.img.assetLibrary.dock',
    key: 'upload',
    entries: ['ly.img.upload'],
    label: 'Upload',
    icon: '@imgly/Upload',
    onClick: () => {
      // Custom behavior instead of opening asset library
      // eslint-disable-next-line no-console
      console.log('Custom upload action triggered!');
      // In production: open your custom upload dialog
      alert('Custom upload dialog would open here!');
    }
  }
]);
```

The `onClick` handler completely replaces the default behavior. In this example, clicking Upload triggers a custom dialog instead of opening the asset library panel. The `ly.img.spacer` component pushes the Upload button to the bottom of the dock.

## Built-in Asset Entry IDs

Common asset library entry identifiers to use in the `entries` array:

| Entry ID | Description |
|----------|-------------|
| `ly.img.image` | Image assets |
| `ly.img.video` | Video assets |
| `ly.img.audio` | Audio assets |
| `ly.img.text` | Text presets |
| `ly.img.vectorpath` | Shape assets |
| `ly.img.sticker` | Sticker assets |
| `ly.img.template` | Templates |
| `ly.img.upload` | Upload functionality |

## Using Separators and Spacers

Organize dock buttons with visual separators and flexible spacers.

```typescript highlight=highlight-multiple-buttons
// Insert a separator between Elements and Text
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.dock', after: { key: 'elements' } },
  'ly.img.separator'
);
```

You can insert separators between existing components using positional matchers like `after: { key: 'elements' }`.

**Separator rendering rules:**

- Adjacent separators collapse to one
- Separators at dock edges are hidden
- Separators above a spacer are hidden

## Positioning Dock Buttons

Control where dock buttons are inserted using positional matchers.

```typescript highlight=highlight-positioning
// Insert a button at the beginning of the dock
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.dock', position: 'start' },
  {
    id: 'ly.img.assetLibrary.dock',
    key: 'templates',
    entries: ['ly.img.template'],
    label: 'Templates',
    icon: '@imgly/Template'
  }
);
```

The `before` and `after` options accept `'first'`, `'last'`, or a matcher object. Matcher objects can target components by `key` or `id`. See the [Component Order API](./user-interface/customization/reference/component-order-api.md) for all available matcher options.

## Available Icons

Common icon identifiers for dock buttons:

- `@imgly/Image` - Images/photos
- `@imgly/Camera` - Camera/capture
- `@imgly/Video` - Video content
- `@imgly/Audio` - Audio/music
- `@imgly/Text` - Text/typography
- `@imgly/Shapes` - Shapes/elements
- `@imgly/Sticker` - Stickers
- `@imgly/Upload` - Upload
- `@imgly/Template` - Templates

## Troubleshooting

**Button not appearing** - Verify the asset source exists for the entry IDs. Buttons only show if matching sources are registered.

**Duplicate keys error** - Ensure each `ly.img.assetLibrary.dock` instance has a unique `key`.

**Icon not showing** - Verify icon identifier is correct (case-sensitive).

**Wrong panel opening** - Check that `entries` array contains the correct asset source IDs.

**onClick not firing** - Check that the function is defined and not throwing errors.

## API Reference

| Method | Purpose |
|--------|---------|
| `cesdk.ui.insertOrderComponent()` | Insert dock buttons into the dock |
| `cesdk.ui.removeOrderComponent()` | Remove dock buttons |
| `cesdk.ui.setComponentOrder()` | Replace entire dock order |

## Next Steps

[Dock](./user-interface/customization/dock.md) - Appearance settings, edit mode context, and custom registered components

[Component Order API](./user-interface/customization/reference/component-order-api.md) - Full API reference for matchers and positioning

[Create Custom Components](./user-interface/customization/quick-start/create-custom-components.md) - Build fully custom dock buttons with the Builder API



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support