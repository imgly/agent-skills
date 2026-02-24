> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [UI Extensions](./user-interface/ui-extensions.md) > [Customize Behaviour](./user-interface/ui-extensions/customize-behaviour.md)

---

Control CE.SDK's interface programmatically at runtime through event subscriptions, panel operations, notifications, and dynamic feature management.

![Customize UI Behavior](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ui-extensions-customize-behaviour-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-ui-extensions-customize-behaviour-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-ui-extensions-customize-behaviour-browser/)

UI behavior customization enables responsive, context-aware editing experiences. You can listen for user interactions, manipulate UI state dynamically based on application logic, integrate CE.SDK with external workflows, and build custom behavior that responds to editing events.

```typescript file=@cesdk_web_examples/guides-user-interface-ui-extensions-customize-behaviour-browser/browser.ts reference-only
import type {
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import type { BlockEvent } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';
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

export default class CustomizeBehaviorExample implements EditorPlugin {
  name = 'CustomizeBehaviorExample';
  version = '1.0.0';

  async initialize({ cesdk, engine }: EditorPluginContext) {
    if (!cesdk) {
      throw new Error('CE.SDK not available');
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

    // Load a simple scene for demonstration
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Show welcome dialog first, then run demonstrations after user confirms
    this.demonstrateDialogs(cesdk, engine);
  }

  private demonstrateEventSubscription(
    engine: CreativeEngine,
    cesdk: any
  ): void {
    // Subscribe to all block events
    const unsubscribe = engine.event.subscribe([], (events: BlockEvent[]) => {
      events.forEach((event) => {
        // eslint-disable-next-line no-console
        console.log(`Block event: ${event.type} on block ${event.block}`);

        // Show notification when blocks are created
        if (event.type === 'Created') {
          cesdk.ui.showNotification({
            message: `Block created: ${event.block}`,
            type: 'info',
            duration: 'short'
          });
        }
      });
    });

    // Store unsubscribe function for cleanup
    (window as any).unsubscribeEvents = unsubscribe;
  }

  private demonstratePanelManagement(cesdk: any): void {
    // Check if inspector panel is open
    const isInspectorOpen = cesdk.ui.isPanelOpen('//ly.img.panel/inspector');
    // eslint-disable-next-line no-console
    console.log('Inspector panel open:', isInspectorOpen);

    // Open panel conditionally
    if (!isInspectorOpen) {
      cesdk.ui.openPanel('//ly.img.panel/inspector');
    }

    // Close panel after delay (for demonstration)
    setTimeout(() => {
      cesdk.ui.closePanel('//ly.img.panel/inspector');
      // eslint-disable-next-line no-console
      console.log('Inspector panel closed');
    }, 2000);

    // Find all available panels
    const allPanels = cesdk.ui.findAllPanels();
    // eslint-disable-next-line no-console
    console.log('Available panels:', allPanels);
  }

  private demonstrateNotifications(cesdk: any): void {
    // Show simple notification
    const notificationId = cesdk.ui.showNotification('Welcome to CE.SDK!');
    // eslint-disable-next-line no-console
    console.log('Notification ID:', notificationId);

    // Show notification with configuration
    setTimeout(() => {
      cesdk.ui.showNotification({
        message: 'This is a success message',
        type: 'success',
        duration: 'medium'
      });
    }, 1000);

    // Show error notification
    setTimeout(() => {
      cesdk.ui.showNotification({
        message: 'This is an error notification',
        type: 'error',
        duration: 'long'
      });
    }, 2000);
  }

  private demonstrateDialogs(
    cesdk: CreativeEditorSDK,
    engine: CreativeEngine
  ): void {
    // Show welcome dialog immediately
    cesdk.ui.showDialog({
      type: 'info',
      content: {
        title: 'Welcome to CE.SDK UI Behavior Customization',
        message:
          "This example demonstrates how to programmatically control CE.SDK's interface through event subscriptions, panel management, notifications, dialogs, custom actions, and theme controls. Click 'Confirm' to start the demonstration."
      },
      actions: [
        {
          label: 'Cancel',
          onClick: (context) => {
            // eslint-disable-next-line no-console
            console.log('User cancelled demonstration');
            cesdk.ui.closeDialog(context.id);
          }
        },
        {
          label: 'Confirm',
          onClick: (context) => {
            // eslint-disable-next-line no-console
            console.log('User confirmed - starting demonstrations');
            cesdk.ui.closeDialog(context.id);

            // Run all demonstrations after user confirms
            this.demonstrateEventSubscription(engine, cesdk);
            this.demonstratePanelManagement(cesdk);
            this.demonstrateNotifications(cesdk);
            this.demonstrateCustomActions(cesdk);
            this.demonstrateThemeControl(cesdk);
            this.demonstrateFeatureManagement(cesdk);
          }
        }
      ]
    });
  }

  private demonstrateCustomActions(cesdk: any): void {
    // Register a custom download action
    cesdk.actions.register(
      'downloadFile',
      async (blob: Blob, mimeType: string) => {
        // eslint-disable-next-line no-console
        console.log('Custom download action called:', { blob, mimeType });

        // Custom download logic
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `export.${mimeType.split('/')[1]}`;
        link.click();
        URL.revokeObjectURL(url);

        cesdk.ui.showNotification({
          message: 'File downloaded successfully!',
          type: 'success'
        });
      }
    );

    // List all registered actions
    const actions = cesdk.actions.list();
    // eslint-disable-next-line no-console
    console.log('Registered actions:', actions);

    // Check if specific action exists
    const downloadAction = cesdk.actions.get('downloadFile');
    // eslint-disable-next-line no-console
    console.log('Download action registered:', !!downloadAction);
  }

  private demonstrateThemeControl(cesdk: any): void {
    // Get current theme
    const currentTheme = cesdk.ui.getTheme();
    // eslint-disable-next-line no-console
    console.log('Current theme:', currentTheme);

    // Toggle theme after delay
    setTimeout(() => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      cesdk.ui.setTheme(newTheme);
      // eslint-disable-next-line no-console
      console.log('Theme changed to:', newTheme);

      cesdk.ui.showNotification({
        message: `Theme switched to ${newTheme} mode`,
        type: 'info'
      });
    }, 5000);

    // Get current scale
    const currentScale = cesdk.ui.getScale();
    // eslint-disable-next-line no-console
    console.log('Current scale:', currentScale);
  }

  private demonstrateFeatureManagement(cesdk: any): void {
    // Check if feature is enabled
    const isUndoEnabled = cesdk.feature.isEnabled('ly.img.undo');
    // eslint-disable-next-line no-console
    console.log('Undo feature enabled:', isUndoEnabled);

    // Disable feature conditionally
    setTimeout(() => {
      // Example: Disable undo for demonstration
      // cesdk.feature.disable('ly.img.undo');
      // eslint-disable-next-line no-console
      console.log('Feature management demonstrated (undo not disabled)');
    }, 6000);

    // List features matching pattern
    const allFeatures = cesdk.feature.list({ matcher: 'ly.img.*' });
    // eslint-disable-next-line no-console
    console.log('Available features:', allFeatures.slice(0, 10));
  }

  async demonstrateExternalIntegration(
    engine: CreativeEngine,
    cesdk: any
  ): Promise<void> {
    // Example: Integrate with external state management
    const externalState = {
      selectedBlockCount: 0,
      lastEventType: ''
    };

    // Subscribe to events and update external state
    engine.event.subscribe([], (events: BlockEvent[]) => {
      events.forEach((event) => {
        externalState.lastEventType = event.type;
        // eslint-disable-next-line no-console
        console.log('External state updated:', externalState);
      });
    });

    // Listen for external changes and update UI
    // In a real app, this would connect to Redux, MobX, etc.
    setInterval(() => {
      const selectedBlocks = engine.block.findAllSelected();
      if (selectedBlocks.length !== externalState.selectedBlockCount) {
        externalState.selectedBlockCount = selectedBlocks.length;
        // eslint-disable-next-line no-console
        console.log('Selection changed:', externalState.selectedBlockCount);

        // Show panel when blocks are selected
        if (selectedBlocks.length > 0) {
          cesdk.ui.openPanel('//ly.img.panel/inspector');
        }
      }
    }, 1000);
  }

  private demonstrateContextAwareWorkflow(
    engine: CreativeEngine,
    cesdk: any
  ): void {
    // Create context-aware workflow
    engine.event.subscribe([], (events: BlockEvent[]) => {
      events.forEach((event) => {
        if (event.type === 'Created') {
          // Show notification for new blocks
          cesdk.ui.showNotification({
            message: 'New block created - Opening inspector',
            type: 'info'
          });

          // Open inspector panel
          cesdk.ui.openPanel('//ly.img.panel/inspector');
        }

        if (event.type === 'Destroyed') {
          // Check if any blocks remain
          const allBlocks = engine.block.findAll();
          if (allBlocks.length === 0) {
            cesdk.ui.showNotification({
              message: 'All blocks removed',
              type: 'info'
            });
          }
        }
      });
    });
  }
}
```

This guide demonstrates the core behavior customization APIs: notifications and dialogs for user feedback, custom action registration, dynamic theme and scale control, feature management, and external state integration. For detailed event handling and panel management, see the dedicated guides linked in each section.

## Listening to Editing Events

Subscribe to block events to react to changes in your scene. The event system delivers batched updates for Created, Updated, and Destroyed events.

```typescript
const unsubscribe = engine.event.subscribe([], (events: BlockEvent[]) => {
  events.forEach((event) => {
    if (event.type === 'Created') {
      cesdk.ui.showNotification({ message: 'Block created', type: 'info' });
    }
  });
});
```

For comprehensive event handling patterns including selection tracking and state synchronization, see the Event Subscriptions guide.

## Programmatic Panel Management

Control panel visibility dynamically using the UI API. Open, close, and query panel state to adapt your interface to user actions.

```typescript
if (!cesdk.ui.isPanelOpen('//ly.img.panel/inspector')) {
  cesdk.ui.openPanel('//ly.img.panel/inspector');
}
```

For complete panel management including custom panel registration and advanced patterns, see the Custom Panels guide.

## Showing Notifications and Dialogs

### Displaying Notifications

Show temporary feedback using `cesdk.ui.showNotification()`. Configure the notification's message, type (`info`, `success`, `error`), and duration (`short`, `medium`, `long`).

```typescript
cesdk.ui.showNotification({
  message: 'Operation completed successfully',
  type: 'success',
  duration: 'medium'
});
```

### Creating Confirmation Dialogs

Present user decisions with `cesdk.ui.showDialog()`. Define `onClick` handlers for action buttons that receive a `context` parameter containing the dialog ID.

```typescript
cesdk.ui.showDialog({
  type: 'info',
  content: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?'
  },
  actions: [
    {
      label: 'Cancel',
      onClick: (context) => cesdk.ui.closeDialog(context.id)
    },
    {
      label: 'Confirm',
      onClick: (context) => {
        cesdk.ui.closeDialog(context.id);
        // Your action logic here
      }
    }
  ]
});
```

## Registering Custom Actions

Register custom action handlers to intercept UI events like export, load, and download. The editor calls your action when users trigger the corresponding UI event.

```typescript
cesdk.actions.register('downloadFile', async (blob: Blob, mimeType: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `export.${mimeType.split('/')[1]}`;
  link.click();
  URL.revokeObjectURL(url);
});
```

## Dynamic Theme and Scale Control

Control the editor's theme and UI scale at runtime. Set theme to `'light'`, `'dark'`, or `'system'`, and scale to `'normal'` or `'large'`.

```typescript
// Toggle theme
const currentTheme = cesdk.ui.getTheme();
cesdk.ui.setTheme(currentTheme === 'dark' ? 'light' : 'dark');

// Set scale
cesdk.ui.setScale('large');
```

## Feature Management at Runtime

Control feature availability based on user permissions or application state. Enable, disable, and query features dynamically.

```typescript
// Check and toggle features
if (cesdk.feature.isEnabled('ly.img.undo')) {
  cesdk.feature.disable('ly.img.undo');
} else {
  cesdk.feature.enable('ly.img.undo');
}

// List available features
const features = cesdk.feature.list({ matcher: 'ly.img.*' });
```

## Integrating with External State

Connect CE.SDK events to Redux, MobX, or other state systems for bidirectional synchronization.

```typescript
// Subscribe to CE.SDK events and update external state
engine.event.subscribe([], (events: BlockEvent[]) => {
  events.forEach((event) => {
    // Dispatch to your state management system
    dispatch({ type: 'CESDK_EVENT', payload: event });
  });
});

// Listen to external state changes and update CE.SDK UI
store.subscribe(() => {
  const state = store.getState();
  if (state.shouldShowInspector) {
    cesdk.ui.openPanel('//ly.img.panel/inspector');
  }
});
```

## Troubleshooting

### Event Subscriptions Not Firing

Verify the engine is initialized and blocks exist before subscribing. Event subscriptions only fire for changes after subscription - you won't receive events for existing state. Check that your callback function executes without errors, as exceptions are logged but don't prevent future events.

### Panel Operations Failing

Check panel ID spelling and registration status. Panel IDs are case-sensitive and must match exactly. Verify the panel is registered before attempting to open it. Custom panels must be registered through plugins before they become available for panel operations.

### Actions Not Executing

Ensure the action is registered before calling `cesdk.actions.run()`. The method throws an error if the action doesn't exist. Register actions during plugin initialization or before they're needed. Check that action names match exactly when registering and executing.

### Memory Leaks from Event Subscriptions

Always call the unsubscribe cleanup function when you no longer need event listeners. Store the return value from `engine.event.subscribe()` and call it when your component unmounts or the feature is disabled. Failing to unsubscribe causes memory leaks and unnecessary callback executions.

### UI Not Updating After State Changes

Verify event handlers execute without errors. Check the browser console for exceptions thrown in callbacks. Ensure your UI update logic runs after async operations complete. Theme and feature changes apply immediately, so check that you're querying the correct state after modifications.

### Theme or Scale Changes Not Applying

Check if function-based configs are evaluated correctly. For theme functions, ensure they return valid values (`'light'` or `'dark'`). For scale functions, verify the container width calculation is correct. Function-based configs re-evaluate on each access, so ensure your logic accounts for this behavior.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.event.subscribe()` | Subscribe to block lifecycle events |
| `cesdk.ui.openPanel()` | Open a specific panel programmatically |
| `cesdk.ui.closePanel()` | Close a panel by ID or pattern |
| `cesdk.ui.isPanelOpen()` | Check if panel is currently open |
| `cesdk.ui.findAllPanels()` | Find all available panels with filtering |
| `cesdk.ui.showNotification()` | Display temporary notification message |
| `cesdk.ui.showDialog()` | Show confirmation or custom dialog |
| `cesdk.ui.closeDialog()` | Close dialog by ID |
| `cesdk.actions.register()` | Register custom action handler |
| `cesdk.actions.get()` | Retrieve registered action function |
| `cesdk.actions.run()` | Execute registered action |
| `cesdk.actions.list()` | List all registered action IDs |
| `cesdk.ui.setTheme()` | Change editor theme at runtime |
| `cesdk.ui.getTheme()` | Get current resolved theme |
| `cesdk.ui.setScale()` | Control UI density and sizing |
| `cesdk.ui.getScale()` | Get current resolved scale |
| `cesdk.feature.enable()` | Enable feature dynamically |
| `cesdk.feature.disable()` | Disable feature dynamically |
| `cesdk.feature.isEnabled()` | Check if feature is enabled |
| `cesdk.feature.list()` | List features matching pattern |



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support