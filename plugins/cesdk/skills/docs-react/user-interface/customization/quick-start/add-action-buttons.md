> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Add Action Buttons](./user-interface/customization/quick-start/add-action-buttons.md)

---

Add interactive save, export, and custom action buttons to your CE.SDK editor using built-in action components.

![Add Action Buttons example showing a navigation bar with custom Save, Export, Share, and Download buttons](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-add-action-buttons-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-customization-quick-start-add-action-buttons-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-quick-start-add-action-buttons-browser/)

CE.SDK provides built-in action button components that you can insert and configure inline without needing to register custom components. There are two main approaches:

1. **Built-in action buttons** like `ly.img.saveScene.navigationBar` that integrate with the Actions API
2. **Custom action buttons** using `ly.img.action.navigationBar` with your own `onClick` handlers

```typescript file=@cesdk_web_examples/guides-user-interface-customization-quick-start-add-action-buttons-browser/browser.ts reference-only
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

    // Add a built-in save button that integrates with the Actions API
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', after: 'ly.img.spacer' },
      { id: 'ly.img.saveScene.navigationBar' }
    );

    // Register the action handler for the save button
    cesdk.actions.register('saveScene', async () => {
      const sceneString = await cesdk.engine.scene.saveToString();
      // eslint-disable-next-line no-console
      console.log('Scene saved via Actions API! Length:', sceneString.length);
      // In production: send sceneString to your backend
      cesdk.ui.showNotification({
        message: 'Scene saved successfully!'
      });
    });

    // Add a custom action button with inline onClick handler
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', after: 'ly.img.saveScene.navigationBar' },
      {
        id: 'ly.img.action.navigationBar',
        key: 'my-custom-action',
        label: 'Custom',
        icon: '@imgly/Settings',
        onClick: async () => {
          // eslint-disable-next-line no-console
          console.log('Custom action clicked!');
          // Your custom logic here
        }
      }
    );

    // Add an Export button with accent styling
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', after: 'ly.img.saveScene.navigationBar' },
      {
        id: 'ly.img.action.navigationBar',
        key: 'my-export',
        label: 'Export',
        icon: '@imgly/Download',
        color: 'accent',
        onClick: async () => {
          // Export to PNG using the utils API
          const { blobs } = await cesdk.utils.export({ mimeType: 'image/png' });
          // eslint-disable-next-line no-console
          console.log('Exported PNG! Size:', blobs[0].size);
          // In production: download or upload the blob
        }
      }
    );

    // Create a dropdown menu with multiple export options
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar' },
      {
        id: 'ly.img.actions.navigationBar',
        label: 'Download',
        icon: '@imgly/Download',
        children: [
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-png',
            label: 'Download as PNG',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'image/png'
              });
              downloadBlob(blobs[0], 'design.png');
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-jpeg',
            label: 'Download as JPEG',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'image/jpeg'
              });
              downloadBlob(blobs[0], 'design.jpg');
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-pdf',
            label: 'Download as PDF',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'application/pdf'
              });
              downloadBlob(blobs[0], 'design.pdf');
            }
          }
        ]
      }
    );

    // Insert multiple buttons at once with a separator between them
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.actions.navigationBar' },
      [
        {
          id: 'ly.img.action.navigationBar',
          key: 'share',
          label: 'Share',
          icon: '@imgly/Share',
          onClick: () => {
            // eslint-disable-next-line no-console
            console.log('Share clicked!');
          }
        },
        'ly.img.separator',
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
    );

    // Use the Utils API for export with built-in loading dialog
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.actions.navigationBar' },
      {
        id: 'ly.img.action.navigationBar',
        key: 'utils-export',
        label: 'Quick Export',
        icon: '@imgly/Download',
        color: 'accent',
        onClick: async () => {
          // cesdk.utils.export() shows a loading dialog automatically
          const { blobs } = await cesdk.utils.export({ mimeType: 'image/png' });
          // Download the exported file to user's device
          await cesdk.utils.downloadFile(blobs[0], 'image/png');
        }
      }
    );

    // eslint-disable-next-line no-console
    console.log('Add Action Buttons example loaded successfully');
  }
}

// Helper function to download a blob as a file
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default Example;
```

This guide covers both approaches, along with button appearance configuration, dropdown menus, and the Utils API for export operations.

## Use Built-in Action Buttons

CE.SDK provides pre-configured action buttons for common operations like saving, exporting, and importing. These buttons have default labels and icons, and they automatically integrate with the Actions API.

```typescript highlight=highlight-builtin-button
    // Add a built-in save button that integrates with the Actions API
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', after: 'ly.img.spacer' },
      { id: 'ly.img.saveScene.navigationBar' }
    );

    // Register the action handler for the save button
    cesdk.actions.register('saveScene', async () => {
      const sceneString = await cesdk.engine.scene.saveToString();
      // eslint-disable-next-line no-console
      console.log('Scene saved via Actions API! Length:', sceneString.length);
      // In production: send sceneString to your backend
      cesdk.ui.showNotification({
        message: 'Scene saved successfully!'
      });
    });
```

When you insert a built-in button like `ly.img.saveScene.navigationBar`, clicking it automatically calls the registered `saveScene` action. You provide the implementation by registering your handler with `cesdk.actions.register()`.

> **Tip:** Built-in buttons use the Actions API under the hood. The button
> `ly.img.saveScene.navigationBar` triggers `cesdk.actions.run('saveScene')`. See
> the [Actions API guide](./actions.md) for all available actions.

**Available built-in action buttons:**

| Component ID                         | Triggers Action | Default Label   |
| ------------------------------------ | --------------- | --------------- |
| `ly.img.saveScene.navigationBar`     | `saveScene`     | Save            |
| `ly.img.shareScene.navigationBar`    | `shareScene`    | Share           |
| `ly.img.exportImage.navigationBar`   | `exportDesign`  | Export as Image |
| `ly.img.exportPDF.navigationBar`     | `exportDesign`  | Export as PDF   |
| `ly.img.exportVideo.navigationBar`   | `exportDesign`  | Export as Video |
| `ly.img.exportScene.navigationBar`   | `exportScene`   | Export Scene    |
| `ly.img.exportArchive.navigationBar` | `exportScene`   | Export Archive  |
| `ly.img.importScene.navigationBar`   | `importScene`   | Import Scene    |
| `ly.img.importArchive.navigationBar` | `importScene`   | Import Archive  |

## Add a Custom Action Button

When you need full control over button behavior, use `ly.img.action.navigationBar` with a custom `onClick` handler. The `key` property must be unique across all action buttons in the editor.

```typescript highlight=highlight-single-action
// Add a custom action button with inline onClick handler
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', after: 'ly.img.saveScene.navigationBar' },
  {
    id: 'ly.img.action.navigationBar',
    key: 'my-custom-action',
    label: 'Custom',
    icon: '@imgly/Settings',
    onClick: async () => {
      // eslint-disable-next-line no-console
      console.log('Custom action clicked!');
      // Your custom logic here
    }
  }
);
```

The `onClick` handler can be synchronous or asynchronous. In this example, we serialize the scene and log the result. In production, you would send this data to your backend.

## Configure Button Appearance

Action buttons support several configuration options to customize their appearance and behavior.

```typescript highlight=highlight-button-config
// Add an Export button with accent styling
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', after: 'ly.img.saveScene.navigationBar' },
  {
    id: 'ly.img.action.navigationBar',
    key: 'my-export',
    label: 'Export',
    icon: '@imgly/Download',
    color: 'accent',
    onClick: async () => {
      // Export to PNG using the utils API
      const { blobs } = await cesdk.utils.export({ mimeType: 'image/png' });
      // eslint-disable-next-line no-console
      console.log('Exported PNG! Size:', blobs[0].size);
      // In production: download or upload the blob
    }
  }
);
```

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Must be `'ly.img.action.navigationBar'` |
| `key` | `string` | Unique identifier (required) |
| `label` | `string` | Button text label (required) |
| `onClick` | `() => void \| Promise<void>` | Click handler function |
| `icon` | `string` | Icon identifier (e.g., `'@imgly/Download'`) |
| `color` | `'accent' \| 'danger'` | Button color variant |
| `variant` | `'regular' \| 'plain'` | Button style variant |
| `isDisabled` | `boolean` | Whether button is disabled |
| `isLoading` | `boolean` | Whether to show loading state |

## Create a Dropdown Menu

Use `ly.img.actions.navigationBar` with a `children` array to create a dropdown menu containing multiple actions. This is useful when you have related actions that should be grouped together.

```typescript highlight=highlight-dropdown-menu
// Create a dropdown menu with multiple export options
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar' },
  {
    id: 'ly.img.actions.navigationBar',
    label: 'Download',
    icon: '@imgly/Download',
    children: [
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-png',
        label: 'Download as PNG',
        onClick: async () => {
          const { blobs } = await cesdk.utils.export({
            mimeType: 'image/png'
          });
          downloadBlob(blobs[0], 'design.png');
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-jpeg',
        label: 'Download as JPEG',
        onClick: async () => {
          const { blobs } = await cesdk.utils.export({
            mimeType: 'image/jpeg'
          });
          downloadBlob(blobs[0], 'design.jpg');
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'export-pdf',
        label: 'Download as PDF',
        onClick: async () => {
          const { blobs } = await cesdk.utils.export({
            mimeType: 'application/pdf'
          });
          downloadBlob(blobs[0], 'design.pdf');
        }
      }
    ]
  }
);
```

Each child in the `children` array follows the same configuration pattern as single action buttons. The dropdown automatically manages its open/close state and displays the children in a menu when clicked.

## Add Multiple Buttons at Once

You can insert multiple buttons in a single call by passing an array. This is more efficient than making multiple `insertOrderComponent()` calls and ensures the buttons appear together in the specified order.

```typescript highlight=highlight-multiple-buttons
// Insert multiple buttons at once with a separator between them
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', before: 'ly.img.actions.navigationBar' },
  [
    {
      id: 'ly.img.action.navigationBar',
      key: 'share',
      label: 'Share',
      icon: '@imgly/Share',
      onClick: () => {
        // eslint-disable-next-line no-console
        console.log('Share clicked!');
      }
    },
    'ly.img.separator',
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
);
```

The array can contain both component objects and string component IDs (like `'ly.img.separator'`). This allows you to mix action buttons with layout components.

## Available Icons

Common icon identifiers for action buttons:

- `@imgly/Download` - Download/export
- `@imgly/Save` - Save
- `@imgly/Share` - Share
- `@imgly/Upload` - Upload/import
- `@imgly/Copy` - Copy
- `@imgly/Trash` - Delete
- `@imgly/Settings` - Settings

## Use Utils API for Export

The Utils API (`cesdk.utils`) provides helper functions for common export and file operations. These are useful when implementing custom export buttons.

```typescript highlight=highlight-utils-export
// Use the Utils API for export with built-in loading dialog
cesdk.ui.insertOrderComponent(
  { in: 'ly.img.navigation.bar', before: 'ly.img.actions.navigationBar' },
  {
    id: 'ly.img.action.navigationBar',
    key: 'utils-export',
    label: 'Quick Export',
    icon: '@imgly/Download',
    color: 'accent',
    onClick: async () => {
      // cesdk.utils.export() shows a loading dialog automatically
      const { blobs } = await cesdk.utils.export({ mimeType: 'image/png' });
      // Download the exported file to user's device
      await cesdk.utils.downloadFile(blobs[0], 'image/png');
    }
  }
);
```

**Key Utils API methods:**

| Method                                | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| `cesdk.utils.export(options)`         | Export with automatic loading dialog and progress    |
| `cesdk.utils.downloadFile(blob, mime)`| Download a file to the user's device                 |
| `cesdk.utils.showLoadingDialog(opts)` | Show a progress dialog for long operations           |
| `cesdk.utils.loadFile(options)`       | Open a file picker to load user files                |

The `export()` method automatically displays a loading dialog with progress tracking for video exports. For more control, use `cesdk.engine.block.export()` directly with a custom loading dialog.

> **Note:** For comprehensive coverage of the Actions API and Utils API, see the [Actions API guide](./actions.md).

## Troubleshooting

**Button not appearing** - Ensure `key` is unique when using multiple `ly.img.action.navigationBar` components. Duplicate keys will cause only one button to appear.

**onClick not firing** - Check for JavaScript errors in the console. Ensure the handler is a function, not a function call.

**Icon not showing** - Verify the icon identifier is correct (case-sensitive). Icons use the `@imgly/` prefix.

## API Reference

| Method | Purpose |
|--------|---------|
| `cesdk.ui.insertOrderComponent()` | Insert action buttons into UI areas |
| `cesdk.actions.register()` | Register custom action handlers |
| `cesdk.utils.export()` | Export with built-in loading dialog |
| `cesdk.utils.downloadFile()` | Download file to user's device |
| `cesdk.engine.block.export()` | Export blocks/scenes for download |
| `cesdk.engine.scene.saveToString()` | Serialize scene for saving |

## Next Steps

[Actions API](./actions.md) - Learn about the Actions API and all available actions

[Create Custom Components](./user-interface/customization/quick-start/create-custom-components.md) - Build fully custom buttons with the Builder API

[Component Order API](./user-interface/customization/reference/component-order-api.md) - Full API reference for UI manipulation

[Navigation Bar](./user-interface/customization/navigation-bar.md) - Area-specific configuration options



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support