> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [UI Extensions](./user-interface/ui-extensions.md) > [Dialogs](./user-interface/ui-extensions/dialogs.md)

---

Present information and collect user decisions during editing with modal
dialogs from CE.SDK's UI API.

![Dialogs example showing a warning dialog with Save, Don't Save and Cancel buttons in the CE.SDK editor](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-1.83.0.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-1.83.0/guides-user-interface-ui-extensions-dialogs-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v1.83.0/guides-user-interface-ui-extensions-dialogs-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.84.0-nightly.20261002/examples/guides-user-interface-ui-extensions-dialogs-browser/index.html)

Dialogs are modal overlays that block interaction with the editor until the user responds or the dialog closes. Use them for confirmations, important alerts, and long-running operations that the user has to wait for. For feedback that doesn't need a decision, use a [notification](./user-interface/ui-extensions/notifications.md) instead.

```typescript file=@cesdk_web_examples/guides-user-interface-ui-extensions-dialogs-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
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
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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

    // Register the dialog demo buttons in the navigation bar
    cesdk.ui.registerComponent(
      'ly.img.dialogs.demo.navigationBar',
      ({ builder }) => {
        // Display a simple dialog with a string message
        builder.Button('simple-dialog', {
          label: 'Simple',
          onClick: () => {
            cesdk.ui.showDialog('This is a simple dialog message');
          }
        });

        // Show a dialog and close it programmatically
        builder.Button('close-dialog', {
          label: 'Auto-Close',
          onClick: () => {
            const dialogId = cesdk.ui.showDialog(
              'This dialog will close in 2 seconds'
            );
            setTimeout(() => {
              cesdk.ui.closeDialog(dialogId);
            }, 2000);
          }
        });

        // Display a warning dialog with actions
        builder.Button('warning-dialog', {
          label: 'Warning',
          onClick: () => {
            cesdk.ui.showDialog({
              type: 'warning',
              content: {
                title: 'Unsaved Changes',
                message:
                  'You have unsaved changes. Do you want to save before leaving?'
              },
              actions: [
                {
                  label: 'Save',
                  color: 'accent',
                  onClick: ({ id }) => {
                    console.log('Save clicked');
                    cesdk.ui.closeDialog(id);
                  }
                },
                {
                  label: "Don't Save",
                  variant: 'plain',
                  onClick: ({ id }) => {
                    console.log('Discard clicked');
                    cesdk.ui.closeDialog(id);
                  }
                }
              ],
              cancel: {
                label: 'Cancel',
                onClick: ({ id }) => cesdk.ui.closeDialog(id)
              }
            });
          }
        });

        // Create a loading dialog with progress indicator
        builder.Button('progress-dialog', {
          label: 'Progress',
          onClick: () => {
            const progressDialogId = cesdk.ui.showDialog({
              type: 'loading',
              content: {
                title: 'Exporting',
                message: 'Preparing your export...'
              },
              progress: 'indeterminate',
              actions: [],
              clickOutsideToClose: false
            });

            // Simulate progress updates
            let progress = 0;
            const progressInterval = setInterval(() => {
              progress += 20;
              cesdk.ui.updateDialog(progressDialogId, {
                progress: { value: progress, max: 100 },
                content: {
                  title: 'Exporting',
                  message: `Processing... ${progress}%`
                }
              });

              if (progress >= 100) {
                clearInterval(progressInterval);
                cesdk.ui.updateDialog(progressDialogId, {
                  type: 'success',
                  content: {
                    title: 'Export Complete',
                    message: 'Your file has been exported successfully.'
                  },
                  progress: undefined,
                  actions: [
                    {
                      label: 'Done',
                      color: 'accent',
                      onClick: ({ id }) => cesdk.ui.closeDialog(id)
                    }
                  ],
                  clickOutsideToClose: true
                });
              }
            }, 500);
          }
        });

        // Dialog with multi-paragraph content and large size
        builder.Button('content-dialog', {
          label: 'Large Content',
          onClick: () => {
            cesdk.ui.showDialog({
              type: 'info',
              size: 'large',
              content: {
                title: 'About This Feature',
                message: [
                  "Dialogs ask for the user's attention before they continue editing.",
                  'Use a large dialog when the content needs more room.'
                ]
              },
              actions: [
                {
                  label: 'Got It',
                  color: 'accent',
                  onClick: ({ id }) => cesdk.ui.closeDialog(id)
                }
              ]
            });
          }
        });

        // Handle dialog close events
        builder.Button('onclose-dialog', {
          label: 'With Callback',
          onClick: () => {
            cesdk.ui.showDialog({
              type: 'info',
              content: 'Close this dialog to see the callback',
              onClose: () => {
                console.log('Dialog was closed');
              }
            });
          }
        });

        // Hide the editor completely behind the dialog
        builder.Button('opaque-backdrop-dialog', {
          label: 'Opaque Backdrop',
          onClick: () => {
            cesdk.ui.showDialog({
              type: 'info',
              backdrop: 'opaque',
              content: {
                title: 'Opaque Backdrop',
                message: 'The editor stays hidden until this dialog closes.'
              }
            });
          }
        });
      }
    );

    // Add the demo buttons to the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      'ly.img.dialogs.demo.navigationBar'
    );
  }
}

export default Example;
```

This guide covers how to create and close dialogs, configure their type, actions, content, size, and backdrop, show progress, and react when a dialog closes.

## Creating Dialogs

Use `cesdk.ui.showDialog()` to display a dialog. Pass a string for a simple message or a configuration object for full control. The method returns a unique ID for managing the dialog. Without an `actions` property, the dialog shows a single Close button.

```typescript highlight-show-dialog
cesdk.ui.showDialog('This is a simple dialog message');
```

The editor shows one dialog at a time. When you call `showDialog()` while another dialog is open, the new dialog appears after the open one closes.

## Closing Dialogs

Use `cesdk.ui.closeDialog()` with the dialog ID to close it programmatically.

```typescript highlight-close-dialog
const dialogId = cesdk.ui.showDialog(
  'This dialog will close in 2 seconds'
);
setTimeout(() => {
  cesdk.ui.closeDialog(dialogId);
}, 2000);
```

## Dialog Types and Actions

Configure the visual style with the `type` property. Available types are `regular` (default), `info`, `success`, `warning`, `error`, and `loading`. Add action buttons with the `actions` property, which takes a single action or an array, and a cancel button with the `cancel` property.

```typescript highlight-dialog-types
cesdk.ui.showDialog({
  type: 'warning',
  content: {
    title: 'Unsaved Changes',
    message:
      'You have unsaved changes. Do you want to save before leaving?'
  },
  actions: [
    {
      label: 'Save',
      color: 'accent',
      onClick: ({ id }) => {
        console.log('Save clicked');
        cesdk.ui.closeDialog(id);
      }
    },
    {
      label: "Don't Save",
      variant: 'plain',
      onClick: ({ id }) => {
        console.log('Discard clicked');
        cesdk.ui.closeDialog(id);
      }
    }
  ],
  cancel: {
    label: 'Cancel',
    onClick: ({ id }) => cesdk.ui.closeDialog(id)
  }
});
```

Each action object includes:

- `label` — Button text
- `variant` — `regular` (default) or `plain` for a text-only button
- `color` — `accent` for primary actions or `danger` for destructive actions
- `onClick` — Callback receiving the dialog ID for closing or other operations

Action buttons don't close the dialog on their own. Call `cesdk.ui.closeDialog()` in the `onClick` callback when the action is done.

## Progress Indicators

Display progress in loading dialogs with the `progress` property:

- `indeterminate` — For unknown duration
- A number (0-100) — For percentage progress
- An object with `value` and `max` — For custom progress ranges

```typescript highlight-dialog-progress
const progressDialogId = cesdk.ui.showDialog({
  type: 'loading',
  content: {
    title: 'Exporting',
    message: 'Preparing your export...'
  },
  progress: 'indeterminate',
  actions: [],
  clickOutsideToClose: false
});
```

## Updating Dialogs

Modify an existing dialog with `cesdk.ui.updateDialog()`. Pass the ID and a partial dialog object, or a function that receives the current dialog and returns the properties to change. This is useful for updating progress indicators or changing dialog content during operations.

```typescript highlight-update-dialog
cesdk.ui.updateDialog(progressDialogId, {
  progress: { value: progress, max: 100 },
  content: {
    title: 'Exporting',
    message: `Processing... ${progress}%`
  }
});
```

## Dialog Content

Set content as a string for simple messages or an object with `title` and `message` properties. The message can be a string or an array of strings for multiple paragraphs. Use the `size` property to control dialog dimensions (`regular` or `large`).

```typescript highlight-dialog-content
cesdk.ui.showDialog({
  type: 'info',
  size: 'large',
  content: {
    title: 'About This Feature',
    message: [
      "Dialogs ask for the user's attention before they continue editing.",
      'Use a large dialog when the content needs more room.'
    ]
  },
  actions: [
    {
      label: 'Got It',
      color: 'accent',
      onClick: ({ id }) => cesdk.ui.closeDialog(id)
    }
  ]
});
```

## Handling Close Callbacks

Use the `onClose` callback to run cleanup code when a dialog closes. It runs on every call to `cesdk.ui.closeDialog()`, which also covers clicking outside the dialog, pressing Escape, and the default Close button.

```typescript highlight-dialog-onclose
cesdk.ui.showDialog({
  type: 'info',
  content: 'Close this dialog to see the callback',
  onClose: () => {
    console.log('Dialog was closed');
  }
});
```

## Click Outside Behavior

Control whether clicking outside the dialog closes it with the `clickOutsideToClose` property. It defaults to `true`. Set it to `false` for dialogs the user shouldn't dismiss by accident, like loading dialogs. Pressing Escape still closes the dialog. To show no buttons at all, pass `actions: []`, because a dialog without `actions` gets the default Close button.

## Backdrop

Control what the user sees behind the dialog with the `backdrop` property. The default, `transparent`, dims the editor but keeps it visible. Set it to `opaque` to hide the editor completely while the dialog is open.

```typescript highlight-dialog-backdrop
cesdk.ui.showDialog({
  type: 'info',
  backdrop: 'opaque',
  content: {
    title: 'Opaque Backdrop',
    message: 'The editor stays hidden until this dialog closes.'
  }
});
```

## Troubleshooting

### Dialog Not Closing

Confirm you're calling `cesdk.ui.closeDialog()` with the correct dialog ID. Check that action callbacks close the dialog, because clicking an action button doesn't close it automatically. If `clickOutsideToClose` is `false`, ensure an action or cancel button is provided.

### Dialog Not Appearing

Check whether another dialog is still open. The editor shows one dialog at a time, and the new dialog appears only after the open one closes.

### Close Callback Not Firing

Ensure the `onClose` callback is defined in the dialog configuration. `onClose` runs when the dialog closes through `cesdk.ui.closeDialog()`, so an action that never calls it leaves the dialog open and the callback unused.

### Progress Not Updating

Confirm you're using `cesdk.ui.updateDialog()` with the correct dialog ID. Verify the progress value is in the expected format (number, `indeterminate`, or object with `value` and `max`).

## API Reference

| Method                    | Description                         |
| ------------------------- | ----------------------------------- |
| `cesdk.ui.showDialog()`   | Display a modal dialog              |
| `cesdk.ui.updateDialog()` | Update dialog content or properties |
| `cesdk.ui.closeDialog()`  | Close a dialog by ID                |

## Next Steps

- [Notifications](./user-interface/ui-extensions/notifications.md) — Show short, non-blocking status messages at the edge of the editor.
- [Register a New Component](./user-interface/ui-extensions/register-new-component.md) — Build custom UI components like the dialog buttons in this example.



---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support