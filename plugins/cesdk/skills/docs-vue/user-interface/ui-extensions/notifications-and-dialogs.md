> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [UI Extensions](./user-interface/ui-extensions.md) > [Notifications and Dialogs](./user-interface/ui-extensions/notifications-and-dialogs.md)

---

Display notifications and dialogs to communicate with users during the editing
experience using CE.SDK's UI API.

![Notifications and Dialogs example showing the CE.SDK editor with notification and dialog UI](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ui-extensions-notifications-and-dialogs-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ui-extensions-notifications-and-dialogs-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-ui-extensions-notifications-and-dialogs-browser/)

Notifications and dialogs are essential for communicating with users during the editing experience. Notifications appear as temporary, non-blocking messages at the edge of the editor for status updates and feedback. Dialogs are modal overlays that interrupt the workflow to present information or collect user decisions. Both are created and controlled through the `cesdk.ui` API.

```typescript file=@cesdk_web_examples/guides-user-interface-ui-extensions-notifications-and-dialogs-browser/browser.ts reference-only
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

    // Register a notifications dropdown in the navigation bar
    cesdk.ui.registerComponent(
      'ly.img.notifications.demo.navigationBar',
      ({ builder }) => {
        // Display a simple notification with a string message
        builder.Button('simple-notification', {
          label: 'Simple',
          onClick: () => {
            cesdk.ui.showNotification('Welcome to CE.SDK!');
          }
        });

        // Display notifications with different types
        builder.Button('info-notification', {
          label: 'Info',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'This is an info notification',
              type: 'info'
            });
          }
        });

        builder.Button('success-notification', {
          label: 'Success',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Operation completed successfully',
              type: 'success'
            });
          }
        });

        builder.Button('warning-notification', {
          label: 'Warning',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Please check your input',
              type: 'warning'
            });
          }
        });

        builder.Button('error-notification', {
          label: 'Error',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Something went wrong',
              type: 'error'
            });
          }
        });

        // Add an action button to a notification
        builder.Button('action-notification', {
          label: 'With Action',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'New template available',
              type: 'info',
              duration: 'long',
              action: {
                label: 'View',
                onClick: ({ id }) => {
                  console.log('Action clicked on notification:', id);
                  cesdk.ui.dismissNotification(id);
                }
              }
            });
          }
        });

        // Create a loading notification that updates to success
        builder.Button('loading-notification', {
          label: 'Loading → Success',
          onClick: () => {
            const loadingId = cesdk.ui.showNotification({
              message: 'Processing your request...',
              type: 'loading',
              duration: 'infinite'
            });

            // Simulate async operation completing
            setTimeout(() => {
              cesdk.ui.updateNotification(loadingId, {
                type: 'success',
                message: 'Processing complete!',
                duration: 'medium'
              });
            }, 2000);
          }
        });

        // Show a notification that can be dismissed
        builder.Button('dismiss-notification', {
          label: 'Auto-Dismiss',
          onClick: () => {
            const notificationId = cesdk.ui.showNotification({
              message: 'This will be dismissed in 2 seconds',
              type: 'info',
              duration: 'infinite'
            });

            setTimeout(() => {
              cesdk.ui.dismissNotification(notificationId);
            }, 2000);
          }
        });

        // Handle notification dismiss events
        builder.Button('ondismiss-notification', {
          label: 'With Callback',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Dismiss me to see the callback',
              type: 'info',
              duration: 'long',
              onDismiss: () => {
                console.log('Notification was dismissed');
              }
            });
          }
        });
      }
    );

    // Register a dialogs dropdown in the navigation bar
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
                  'Notifications and dialogs help communicate with users during the editing workflow.',
                  'Use notifications for non-blocking feedback and dialogs for important decisions.'
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
      }
    );

    // Add the demo dropdowns to the navigation bar
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.navigationBar.position.left',
      'ly.img.navigationBar.position.center',
      'ly.img.navigationBar.position.right',
      'ly.img.notifications.demo.navigationBar',
      'ly.img.dialogs.demo.navigationBar'
    ]);
  }
}

export default Example;
```

## Displaying Notifications

Notifications provide non-blocking feedback without interrupting the user's workflow. They appear in the lower right corner of the editor and automatically dismiss after a set duration.

### Creating Notifications

Use `cesdk.ui.showNotification()` to display a notification. Pass a string for a simple message or a configuration object for full control. The method returns a unique ID for managing the notification.

```typescript highlight-show-notification
cesdk.ui.showNotification('Welcome to CE.SDK!');
```

### Notification Types

Configure the visual appearance with the `type` property. Available types convey different levels of importance:

- `info` — General information (default)
- `success` — Positive confirmations
- `warning` — Cautions requiring attention
- `error` — Errors or failures
- `loading` — Operations in progress with a spinner

```typescript highlight-notification-types
cesdk.ui.showNotification({
  message: 'This is an info notification',
  type: 'info'
});
```

### Notification Duration

Control how long notifications remain visible using the `duration` property:

- `short` — Brief display for quick updates
- `medium` — Standard duration (default)
- `long` — Extended display for important messages
- `infinite` — Persists until dismissed programmatically
- A number for custom millisecond duration

### Adding Actions to Notifications

Include an `action` object to add a clickable button. The action's `onClick` callback receives an object with the notification ID, allowing self-dismissal or other operations.

```typescript highlight-notification-action
cesdk.ui.showNotification({
  message: 'New template available',
  type: 'info',
  duration: 'long',
  action: {
    label: 'View',
    onClick: ({ id }) => {
      console.log('Action clicked on notification:', id);
      cesdk.ui.dismissNotification(id);
    }
  }
});
```

### Loading Notifications

For operations with unknown completion time, create a loading notification with `infinite` duration. Update or dismiss it when the operation completes.

```typescript highlight-loading-notification
const loadingId = cesdk.ui.showNotification({
  message: 'Processing your request...',
  type: 'loading',
  duration: 'infinite'
});
```

### Updating Notifications

Modify an existing notification with `cesdk.ui.updateNotification()`. Pass the ID and a partial notification object with updated properties. This is useful for changing a loading notification to a success message when an operation completes.

```typescript highlight-update-notification
cesdk.ui.updateNotification(loadingId, {
  type: 'success',
  message: 'Processing complete!',
  duration: 'medium'
});
```

### Dismissing Notifications

Use `cesdk.ui.dismissNotification()` with the notification ID to remove it programmatically. This is useful for canceling loading notifications when operations complete or when you need to clear notifications based on user actions.

```typescript highlight-dismiss-notification
            const notificationId = cesdk.ui.showNotification({
              message: 'This will be dismissed in 2 seconds',
              type: 'info',
              duration: 'infinite'
            });

            setTimeout(() => {
              cesdk.ui.dismissNotification(notificationId);
            }, 2000);
```

### Handling Dismiss Callbacks

Use the `onDismiss` callback to execute code when a notification is dismissed, whether by timeout, user action, or programmatic dismissal.

```typescript highlight-ondismiss-callback
cesdk.ui.showNotification({
  message: 'Dismiss me to see the callback',
  type: 'info',
  duration: 'long',
  onDismiss: () => {
    console.log('Notification was dismissed');
  }
});
```

## Displaying Dialogs

Dialogs present modal content requiring user attention or decisions. They overlay the editor and block interaction until dismissed.

### Creating Dialogs

Use `cesdk.ui.showDialog()` to display a dialog. Pass a string for a simple message or a configuration object for full control. The method returns a unique ID for managing the dialog.

```typescript highlight-show-dialog
cesdk.ui.showDialog('This is a simple dialog message');
```

### Closing Dialogs

Use `cesdk.ui.closeDialog()` with the dialog ID to close it programmatically.

```typescript highlight-close-dialog
const dialogId = cesdk.ui.showDialog(
  'This dialog will close in 2 seconds'
);
setTimeout(() => {
  cesdk.ui.closeDialog(dialogId);
}, 2000);
```

### Dialog Types and Actions

Configure the visual style with the `type` property. Available types are `regular` (default), `info`, `success`, `warning`, `error`, and `loading`. Add action buttons with the `actions` array and a cancel button with the `cancel` property.

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

### Progress Indicators

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
  clickOutsideToClose: false
});
```

### Updating Dialogs

Modify an existing dialog with `cesdk.ui.updateDialog()`. Pass the ID and a partial dialog object. This is useful for updating progress indicators or changing dialog content during operations.

```typescript highlight-update-dialog
cesdk.ui.updateDialog(progressDialogId, {
  progress: { value: progress, max: 100 },
  content: {
    title: 'Exporting',
    message: `Processing... ${progress}%`
  }
});
```

### Dialog Content

Set content as a string for simple messages or an object with `title` and `message` properties. The message can be a string or an array of strings for multiple paragraphs. Use the `size` property to control dialog dimensions (`regular` or `large`).

```typescript highlight-dialog-content
cesdk.ui.showDialog({
  type: 'info',
  size: 'large',
  content: {
    title: 'About This Feature',
    message: [
      'Notifications and dialogs help communicate with users during the editing workflow.',
      'Use notifications for non-blocking feedback and dialogs for important decisions.'
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

### Handling Close Callbacks

Use the `onClose` callback to execute cleanup code when a dialog closes, whether by action, cancel, clicking outside, or programmatic closure.

```typescript highlight-dialog-onclose
cesdk.ui.showDialog({
  type: 'info',
  content: 'Close this dialog to see the callback',
  onClose: () => {
    console.log('Dialog was closed');
  }
});
```

### Click Outside Behavior

Control whether clicking outside the dialog closes it with the `clickOutsideToClose` property. It defaults to `true`. Set to `false` for mandatory interactions like loading dialogs.

## Troubleshooting

### Notification Not Visible

Verify the notification was created with a valid message string or configuration object. Check that the duration hasn't expired before you could observe it. Ensure the editor UI is properly initialized before calling notification methods.

### Dialog Not Closing

Confirm you're calling `cesdk.ui.closeDialog()` with the correct dialog ID. Check that action callbacks properly close the dialog. If `clickOutsideToClose` is `false`, ensure an action or cancel button is provided.

### Callback Not Firing

Ensure the callback function is properly defined in the notification or dialog configuration. Verify the notification or dialog hasn't already been dismissed before the callback could fire. Check for JavaScript errors in callback code.

### Progress Not Updating

Confirm you're using `cesdk.ui.updateDialog()` with the correct dialog ID. Verify the progress value is in the expected format (number, `indeterminate`, or object with `value` and `max`).

## API Reference

| Method                          | Description                              |
| ------------------------------- | ---------------------------------------- |
| `cesdk.ui.showNotification()`   | Display a non-blocking notification      |
| `cesdk.ui.dismissNotification()`| Remove a notification by ID              |
| `cesdk.ui.updateNotification()` | Update notification content or properties|
| `cesdk.ui.showDialog()`         | Display a modal dialog                   |
| `cesdk.ui.closeDialog()`        | Close a dialog by ID                     |
| `cesdk.ui.updateDialog()`       | Update dialog content or properties      |



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support