> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [UI Extensions](./user-interface/ui-extensions.md) > [Notifications](./user-interface/ui-extensions/notifications.md)

---

Give users non-blocking feedback during editing with notifications from
CE.SDK's UI API.

![Notifications example showing a success notification and a notification with an action button in the CE.SDK editor](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-1.85.0-nightly.20261009.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-1.85.0-nightly.20261009/guides-user-interface-ui-extensions-notifications-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v1.85.0-nightly.20261009/guides-user-interface-ui-extensions-notifications-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.85.0-nightly.20261009/examples/guides-user-interface-ui-extensions-notifications-browser/index.html)

Notifications are temporary messages that appear in the lower right corner of the editor. They report status and results without interrupting the user's workflow, and most dismiss themselves after the time the user chose. When the user must make a decision before continuing, use a [dialog](./user-interface/ui-extensions/dialogs.md) instead.

```typescript file=@cesdk_web_examples/guides-user-interface-ui-extensions-notifications-browser/browser.ts reference-only
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

    // Register the notification demo buttons in the navigation bar
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
              onDismiss: () => {
                console.log('Notification was dismissed');
              }
            });
          }
        });
      }
    );

    // Add the demo buttons to the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      'ly.img.notifications.demo.navigationBar'
    );
  }
}

export default Example;
```

This guide covers how to create notifications, choose their type and duration, add an action button, and update or dismiss them programmatically.

## Creating Notifications

Use `cesdk.ui.showNotification()` to display a notification. Pass a string for a simple message or a configuration object for full control. The method returns a unique ID for managing the notification.

```typescript highlight-show-notification
cesdk.ui.showNotification('Welcome to CE.SDK!');
```

## Notification Types

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

## Notification Duration

Every notification stays on screen for the same time: 5 seconds by default. Users change it from the notification itself (5, 10 or 20 seconds, or never), and the editor remembers their choice.

A few notifications stay until the user closes them:

- `error` notifications
- notifications with an `action`
- notifications with `duration: 'infinite'`

Every other `duration` value uses the chosen time, so updating a notification from `'infinite'` to `'medium'` lets it dismiss itself again.

## Adding Actions to Notifications

Include an `action` object to add a clickable button. The action's `onClick` callback receives an object with the notification ID, allowing self-dismissal or other operations.

```typescript highlight-notification-action
cesdk.ui.showNotification({
  message: 'New template available',
  type: 'info',
  action: {
    label: 'View',
    onClick: ({ id }) => {
      console.log('Action clicked on notification:', id);
      cesdk.ui.dismissNotification(id);
    }
  }
});
```

## Loading Notifications

For operations with unknown completion time, create a loading notification with `infinite` duration. Update or dismiss it when the operation completes.

```typescript highlight-loading-notification
const loadingId = cesdk.ui.showNotification({
  message: 'Processing your request...',
  type: 'loading',
  duration: 'infinite'
});
```

## Updating Notifications

Modify an existing notification with `cesdk.ui.updateNotification()`. Pass the ID and a partial notification object with updated properties. This is useful for changing a loading notification to a success message when an operation completes.

```typescript highlight-update-notification
cesdk.ui.updateNotification(loadingId, {
  type: 'success',
  message: 'Processing complete!',
  duration: 'medium'
});
```

## Dismissing Notifications

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

## Handling Dismiss Callbacks

Use the `onDismiss` callback to run code when a notification closes because its duration ran out or the user closed it. Calling `cesdk.ui.dismissNotification()` removes the notification without running `onDismiss`, so run any cleanup yourself when you dismiss programmatically.

```typescript highlight-ondismiss-callback
cesdk.ui.showNotification({
  message: 'Dismiss me to see the callback',
  type: 'info',
  onDismiss: () => {
    console.log('Notification was dismissed');
  }
});
```

## Troubleshooting

### Notification Not Visible

Check that the `ly.img.notifications` feature is enabled, because the editor renders no notifications while it is disabled. Verify the duration hasn't expired before you could observe the notification. Ensure the editor UI is initialized before you call notification methods.

### Dismiss Callback Not Firing

`onDismiss` runs only when the duration runs out or the user closes the notification. A call to `cesdk.ui.dismissNotification()` skips it. Check for JavaScript errors in the callback code.

## API Reference

| Method                           | Description                               |
| -------------------------------- | ----------------------------------------- |
| `cesdk.ui.showNotification()`    | Display a non-blocking notification       |
| `cesdk.ui.updateNotification()`  | Update notification content or properties |
| `cesdk.ui.dismissNotification()` | Remove a notification by ID               |

## Next Steps

- [Dialogs](./user-interface/ui-extensions/dialogs.md) — Show modal dialogs for confirmations, alerts, and progress.
- [Register a New Component](./user-interface/ui-extensions/register-new-component.md) — Build custom UI components like the notification buttons in this example.



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support