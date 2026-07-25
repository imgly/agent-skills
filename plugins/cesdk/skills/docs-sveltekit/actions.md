> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Actions](./actions.md)

---

The Actions API provides a centralized way to manage and customize actions for various user interactions in CE.SDK.

> **Note:** The Actions API is available after CE.SDK initialization through
> `cesdk.actions`. Actions are also available in headless mode via the
> `@cesdk/engine` package.

## Two Layers of Actions

CE.SDK exposes actions through two related registries:

- **`cesdk.actions`** — the **host actions** (`saveScene`, `exportDesign`, `uploadFile`, and the rest documented below). These are convenience actions registered by the prebuilt editor.
- **The engine action registry** — every editor command the engine ships (undo, delete, group, text formatting, zoom, pan, and many more) lives here as a named, overridable action, available wherever the engine runs (including headless via `@cesdk/engine`). `cesdk.actions` writes to this same underlying registry.

Because both write to one registry, re-registering an id from either side overrides whatever was there before.

> **Tip:** CE.SDK also provides a Utils API (`cesdk.utils`) with utility
> functions for common operations like exporting, file handling, and UI dialogs.
> These utilities can be used directly or within your custom actions.

## The Action Registry

An action is a named function stored under a string id, such as `history.undo`, `text.toggleBold`, or `zoom`. You run actions by id, override what a built-in id does, add your own, or list what is available.

### Running an Action

Call `run(id, ...args)` to execute an action. It returns a `Promise` that resolves to the action's result — most engine defaults resolve to `true` or `false` (changed or no-change), a few to `null`.

```ts
// Undo the last change.
await cesdk.actions.run('history.undo');

// Nudge the current selection 10px to the right.
await cesdk.actions.run('nudge', { dx: 10, dy: 0 });

// Set the fill color of the selected blocks.
await cesdk.actions.run('fill.color', { color: { r: 1, g: 0, b: 0, a: 1 } });
```

Selection verbs act on the current selection (`cesdk.engine.block.findAllSelected()`); explicitly targeted actions take ids in their arguments.

### Registering and Overriding

Call `register(id, fn)` to add a new action or replace an existing one. Re-registering a default id overrides its behavior everywhere that id is used — including toolbar buttons, keyboard shortcuts, and the engine's own dispatches.

```ts
// Add your own command.
cesdk.actions.register('myCompany.report', async (payload) => {
  await sendAnalytics(payload);
  return { ok: true };
});

// Override a built-in: confirm before deleting.
cesdk.actions.register('selection.delete', async () => {
  if (await confirmDialog('Delete the selection?')) {
    cesdk.engine.block
      .findAllSelected()
      .forEach((id) => cesdk.engine.block.destroy(id));
  }
});
```

On the web, an action you register runs directly in JavaScript, so arguments and results pass by reference — non-serializable values such as `File`, `Blob`, or callbacks work. The engine's own dispatches and any cross-thread calls go through a JSON boundary, so values that cross it must be JSON-serializable.

### Listing and Inspecting

Call `list(options?)` to discover registered actions. It returns an array of `{ id, enabled, argSchema }` objects. Pass a `matcher` glob to filter by id.

```ts
// Every registered action.
const all = cesdk.actions.list();

// Just the engine defaults under the `text.` namespace.
const textActions = cesdk.actions.list({ matcher: 'text.*' });
// => [{ id: 'text.toggleBold', enabled: true, argSchema: '…' }, …]
```

Use `has(id)` to test for an action, `unregister(id)` to remove a custom action or revert an overridden built-in to its default, and — on the web — `get(id)` to read back a function you registered so you can call it synchronously (it returns `undefined` for engine-default native actions; use `run` for those).

```ts
cesdk.actions.has('zoom'); // true
const report = cesdk.actions.get('myCompany.report'); // the raw fn, web only
```

> **Tip:** Actions can be bound to keyboard shortcuts. See the [Keyboard
> Shortcuts](./user-interface/keyboard.md) guide to bind, rebind, or scope shortcuts to actions.

## API Methods

The Actions API provides four methods:

- `register(actionId, handler)` - Register an action function for a specific event
- `get(actionId)` - Retrieve a registered action function
- `run(actionId, ...args)` - Execute a registered action with the provided arguments (throws if not registered)
- `list(matcher)` - Lists registered action IDs, optionally filtered by wildcard pattern

## Getting Started

<Tabs syncKey="actions-layer">
  <TabItem label="Default Actions">
    Register actions after initializing the editor:

    ```javascript
    import CreativeEditorSDK from '@cesdk/cesdk-js';

    const cesdk = await CreativeEditorSDK.create(container, {
      // license: 'YOUR_CESDK_LICENSE_KEY',
    });

    // Register an action
    cesdk.actions.register('actionType', async (...args) => {
      // Your custom implementation
      return result;
    });

    // Execute a registered action
    await cesdk.actions.run('actionType', arg1, arg2);

    // Or retrieve an action to call it later
    const action = cesdk.actions.get('actionType');

    // List all registered actions
    const allActions = cesdk.actions.list();

    // List actions matching a pattern
    const exportActions = cesdk.actions.list({ matcher: 'export*' });
    ```

    ## Default Actions

    In the prebuilt editor, both the host actions and every engine-default action
    are available — the engine runs inside the editor, so its full command
    vocabulary is registered too. The sections below document each default action.

    > **Note:** The `shareScene` and `onUnsupportedBrowser` actions do not have default
    > implementations and must be registered manually.

    ### Scene Creation

    #### `scene.create`

    Creates a new scene with configurable mode, layout and page sizes. Returns the scene block ID.

    ```javascript
    // Create a scene
    await cesdk.actions.run('scene.create');
    ```

    **Options:**

    | Option | Type | Default | Description |
    | ------ | ---- | ------- | ----------- |
    | `layout` | `SceneLayout` | `'VerticalStack'` | The scene layout. |
    | `page` | `PageSpec` | — | A single page specification. Cannot be used together with `pages`. |
    | `pageCount` | `number` | `1` | Number of pages to create from the single `page` spec. Ignored when `pages` is used. |
    | `pages` | `PageSpec[]` | — | An array of page specifications, one page per entry. Cannot be used together with `page`. |

    #### Page Specification

    Pages can be specified in three ways:

    **1. Direct dimensions**

    Specify width, height, and unit directly:

    ```javascript
    await cesdk.actions.run('scene.create', {
      page: { width: 1080, height: 1920, unit: 'Pixel' }
    });

    // With fixed orientation (prevents rotation from swapping dimensions)
    await cesdk.actions.run('scene.create', {
      page: { width: 1080, height: 1920, unit: 'Pixel', fixedOrientation: true }
    });
    ```

    **2. Asset source reference**

    Reference a page preset from an asset source by its source and asset IDs:

    ```javascript
    // Use an Instagram Story preset
    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }
    });
    ```

    **3. Asset object**

    Pass an asset object directly, for example one returned by `engine.asset.findAssets()`:

    ```javascript
    const result = await cesdk.engine.asset.findAssets('ly.img.page.presets', {
      query: ''
    });
    await cesdk.actions.run('scene.create', {
      page: result.assets[0]
    });
    ```

    #### Multiple Pages

    Create scenes with multiple pages:

    ```javascript
    // Multiple pages with different sizes
    await cesdk.actions.run('scene.create', {
      pages: [
        { width: 1080, height: 1920, unit: 'Pixel' },
        { width: 1920, height: 1080, unit: 'Pixel' }
      ]
    });

    // Multiple identical pages using pageCount
    await cesdk.actions.run('scene.create', {
      page: { width: 1080, height: 1080, unit: 'Pixel' },
      pageCount: 3
    });
    ```

    > **Tip:** When no `page` or `pages` option is provided, `scene.create` creates a single
    > page with the default format from the configured page preset asset sources.

    ### Scene Management Actions

    #### `saveScene`

    Handles saving the current scene. Default implementation downloads the scene file.

    ```javascript
    // Basic implementation
    cesdk.actions.register('saveScene', async () => {
      const scene = await cesdk.engine.scene.saveToString();
      console.log('Scene saved:', scene.length, 'characters');

      // Production:
      // await yourAPI.saveScene(scene);

      cesdk.ui.showNotification('Scene saved successfully');
    });

    // With loading dialog
    cesdk.actions.register('saveScene', async () => {
      const dialogController = cesdk.utils.showLoadingDialog({
        title: 'Saving Scene',
        message: 'Please wait...',
        progress: 'indeterminate',
      });

      try {
        const scene = await cesdk.engine.scene.saveToString();
        console.log('Scene saved:', scene.length, 'characters');

        // Production:
        // await yourAPI.saveScene(scene);

        dialogController.showSuccess({
          title: 'Saved',
          message: 'Scene saved successfully',
        });
      } catch (error) {
        dialogController.showError({
          title: 'Save Failed',
          message: 'Could not save the scene',
        });
        throw error;
      }
    });
    ```

    #### `shareScene`

    Handles scene sharing. No default implementation.

    ```javascript
    // Register share functionality
    cesdk.actions.register('shareScene', async () => {
      const scene = await cesdk.engine.scene.saveToString();
      const shareUrl = 'https://example.com/shared-scene-placeholder';
      console.log('Scene ready to share:', scene.length, 'characters');

      // Production:
      // const shareUrl = await yourAPI.createShareableLink(scene);

      await navigator.share({ url: shareUrl });
    });
    ```

    #### `importScene` and `exportScene`

    Handle scene import/export operations with support for both scene files and archives.

    ```javascript
    // Import scene or archive
    cesdk.actions.register('importScene', async ({ format }) => {
      if (format === 'archive') {
        console.log('Archive import requested');

        // Production:
        // const archive = await yourAPI.loadArchive();
        // await cesdk.engine.scene.load(archive);
      } else {
        console.log('Scene import requested');

        // Production:
        // const scene = await yourAPI.loadScene();
        // await cesdk.engine.scene.load(scene);
      }
    });

    // Export scene or archive
    cesdk.actions.register('exportScene', async ({ format }) => {
      if (format === 'archive') {
        const archive = await cesdk.engine.scene.saveToArchive();
        console.log('Archive ready for export:', archive.length, 'bytes');

        // Production:
        // await yourAPI.uploadArchive(archive);
      } else {
        const scene = await cesdk.engine.scene.saveToString();
        console.log('Scene ready for export:', scene.length, 'characters');

        // Production:
        // await yourAPI.uploadScene(scene);
      }
    });
    ```

    ### Export Operations

    #### `exportDesign`

    Handles all export operations (images, PDFs, videos). Default implementation downloads the exported file.

    ```javascript
    // Basic implementation
    cesdk.actions.register('exportDesign', async options => {
      // Use the utils API to perform the export with loading dialog
      const { blobs, options: exportOptions } = await cesdk.utils.export(options);
      console.log('Exported', blobs.length, 'files');
      blobs.forEach((blob, i) => console.log(`File ${i + 1}:`, blob.size, 'bytes'));

      // Production:
      // await Promise.all(blobs.map(blob => yourCDN.upload(blob)));

      cesdk.ui.showNotification('Export completed successfully');
    });

    // Direct engine export with custom loading dialog (bypassing utils)
    cesdk.actions.register('exportDesign', async options => {
      const dialogController = cesdk.utils.showLoadingDialog({
        title: 'Exporting',
        message: 'Processing your export...',
      });

      try {
        const page = cesdk.engine.scene.getCurrentPage();
        if (page === null) {
          throw new Error('No page selected for export');
        }
        let result;

        if (options?.mimeType?.startsWith('video/')) {
          // Video export with progress
          result = await cesdk.engine.block.exportVideo(page, {
            ...options,
            onProgress: (rendered, encoded, total) => {
              dialogController.updateProgress({
                value: rendered,
                max: total,
              });
            },
          });
        } else {
          // Static export (image/PDF)
          result = await cesdk.engine.block.export(page, options);
        }

        console.log('File ready for export:', result.size, 'bytes');

        // Production:
        // await yourCDN.upload(result);

        dialogController.showSuccess({
          title: 'Export Complete',
          message: 'Files uploaded successfully',
        });
      } catch (error) {
        dialogController.showError({
          title: 'Export Failed',
          message: 'Could not complete the export',
        });
        throw error;
      }
    });
    ```

    ### File Upload Action

    #### `uploadFile`

    Handles file uploads to asset sources. Default implementation uses local upload for development.

    ```javascript
    // Register production upload handler
    cesdk.actions.register('uploadFile', async (file, onProgress, context) => {
      console.log('Uploading file:', file.name, file.size, 'bytes');
      onProgress(50); // Simulate progress
      await new Promise(resolve => setTimeout(resolve, 500));
      onProgress(100);

      // Production:
      // const asset = await yourStorageService.upload(file, {
      //   onProgress: (percent) => onProgress(percent),
      //   context
      // });

      // Return AssetDefinition
      return {
        id: 'local-' + Date.now(),
        label: { en: file.name },
        meta: {
          uri: URL.createObjectURL(file),
          thumbUri: URL.createObjectURL(file),
          kind: 'image',
          width: 1920,
          height: 1080,
          // Production:
          // uri: asset.url,
          // thumbUri: asset.thumbnailUrl,
          // width: asset.width,
          // height: asset.height
        },
      };
    });
    ```

    You can control which file types users can upload by setting the `upload/supportedMimeTypes` setting:

    ```javascript
    // Example 1: Only allow images
    cesdk.engine.editor.setSettingString(
      'upload/supportedMimeTypes',
      'image/png,image/jpeg,image/gif,image/svg+xml',
    );

    // Example 2: Allow images and videos
    cesdk.engine.editor.setSettingString(
      'upload/supportedMimeTypes',
      'image/png,image/jpeg,image/gif,video/mp4,video/quicktime',
    );

    // Example 3: Allow specific document types
    cesdk.engine.editor.setSettingString(
      'upload/supportedMimeTypes',
      'application/pdf,image/png,image/jpeg',
    );
    ```

    > **Caution:** The default `uploadFile` implementation uses local upload for development
    > only. Always register a proper upload handler for production.

    ### Asset Library Actions

    #### `asset.delete`

    Invoked when the user deletes an asset from an asset source via the asset library card. The default implementation opens a confirmation dialog and, on confirm, removes the asset from its source. Register a custom implementation to replace the dialog content, swap in your own dialog, or change the deletion behavior entirely.

    The handler receives the source id and the full `AssetResult`, so you can derive per-asset context such as metadata or a page number for your custom UI.

    ```javascript
    cesdk.actions.register('asset.delete', async ({ sourceId, asset }) => {
      const pageNumber = asset.meta?.pageNumber;

      cesdk.ui.showDialog({
        type: 'error',
        content: {
          title: `Delete page ${pageNumber}?`,
          message: 'This will also remove the page from your design.',
        },
        actions: [
          {
            color: 'danger',
            label: 'Delete',
            onClick: ({ id }) => {
              cesdk.engine.asset.removeAssetFromSource(sourceId, asset.id);
              cesdk.engine.asset.assetSourceContentsChanged(sourceId);
              cesdk.ui.closeDialog(id);
            },
          },
        ],
        cancel: {
          variant: 'plain',
          label: 'Cancel',
          onClick: ({ id }) => cesdk.ui.closeDialog(id),
        },
      });
    });
    ```

    > **Note:** A custom handler is responsible for the deletion itself. To preserve the
    > default behavior, call `cesdk.engine.asset.removeAssetFromSource(sourceId,
    >   asset.id)` followed by
    > `cesdk.engine.asset.assetSourceContentsChanged(sourceId)`.

    ### Unsupported Browser Action

    #### `onUnsupportedBrowser`

    Handles unsupported browser detection. No default implementation is provided.

    ```javascript
    // Register handler for unsupported browsers
    cesdk.actions.register('onUnsupportedBrowser', () => {
      // Redirect to a custom compatibility page
      window.location.href = '/browser-not-supported';
    });
    ```

    ### Video Support Actions

    CE.SDK provides actions to detect video capabilities at runtime. These actions help you handle browsers and platforms that lack required video codecs, particularly Linux browsers and Firefox.

    #### `video.decode.checkSupport`

    Checks if the browser supports video decoding and playback via the WebCodecs API. If unsupported, displays a blocking error dialog that users cannot dismiss.

    Returns `true` if video decoding is supported, `false` otherwise.

    ```javascript
    // Check video decode support before loading video content
    const isSupported = cesdk.actions.run('video.decode.checkSupport');

    if (!isSupported) {
      // A blocking error dialog is shown automatically
      // The user cannot proceed with video editing
      return;
    }

    // Safe to proceed with video content
    await cesdk.engine.scene.load(videoSceneUrl);

    // You can also disable the dialog and handle feedback yourself:
    const supportedSilently = cesdk.actions.run('video.decode.checkSupport', {
      dialog: false
    });
    ```

    **Options:**

    | Option | Type | Default | Description |
    | ------ | ---- | ------- | ----------- |
    | `dialog` | `boolean \| { show: boolean; backdrop?: 'transparent' \| 'opaque' }` | `true` (backdrop: `'opaque'`) | Controls dialog display. Use `false` to disable, or an object for fine-grained control. |

    > **Caution:** The `video.decode.checkSupport` action shows a blocking dialog with no dismiss option
    > when video is not supported. Only call this action when you intend to work
    > with video content.

    #### `video.encode.checkSupport`

    Checks if the browser supports video encoding/export (H.264 video and AAC audio encoding). If unsupported, displays a warning dialog that users can dismiss to continue editing.

    Returns a `Promise<boolean>` - `true` if video encoding is supported, `false` otherwise.

    ```javascript
    // Check video encode support before attempting export
    const canExport = await cesdk.actions.run('video.encode.checkSupport');

    if (!canExport) {
      // A warning dialog is shown automatically
      // User can dismiss and continue editing
      // Consider offering server-side export as alternative
      console.log('Video export unavailable - consider server-side rendering');
    }

    // You can also disable the dialog and handle feedback yourself:
    const canExportSilently = await cesdk.actions.run('video.encode.checkSupport', {
      dialog: false
    });
    ```

    **Options:**

    | Option | Type | Default | Description |
    | ------ | ---- | ------- | ----------- |
    | `dialog` | `boolean \| { show: boolean; backdrop?: 'transparent' \| 'opaque' }` | `true` (backdrop: `'transparent'`) | Controls dialog display. Use `false` to disable, or an object for fine-grained control. |

    > **Tip:** For platforms that don't support client-side video export (Linux, Firefox),
    > consider using [CE.SDK Renderer](#broken-link-7f3e9a)
    > for server-side video rendering.

    #### Platform Support

    | Platform | Video Import | Video Export |
    | -------- | ------------ | ------------ |
    | Chrome/Edge (Windows, macOS) | ✅ | ✅ |
    | Safari (macOS) | ✅ | ✅ |
    | Chrome (Linux) | ❌ | ❌ |
    | Firefox (all platforms) | ❌ | ❌ |

    ### Zoom Actions

    CE.SDK provides built-in zoom actions for controlling the viewport zoom level and focus. These actions are automatically registered and can be customized or called programmatically.

    #### `zoom.toBlock`

    Zooms the viewport to fit a specific block.

    ```javascript
    // Zoom to a block with default settings
    await cesdk.actions.run('zoom.toBlock', blockId);

    // Zoom with custom padding and animation
    await cesdk.actions.run('zoom.toBlock', blockId, {
      padding: 50, // Uniform padding on all sides
      animate: true,
      autoFit: false
    });

    // Different padding for each side
    await cesdk.actions.run('zoom.toBlock', blockId, {
      padding: { top: 20, bottom: 20, left: 40, right: 40 },
      animate: {
        duration: 0.3,
        easing: 'EaseInOut'
      }
    });
    ```

    #### `zoom.toPage`

    Zooms to the current page or a specified page. If no options are provided, defaults to the current page.

    ```javascript
    // Zoom to current page with auto-fit
    await cesdk.actions.run('zoom.toPage', {
      autoFit: true,
      animate: false
    });

    // Zoom with custom padding
    await cesdk.actions.run('zoom.toPage', {
      padding: { x: 40, y: 80 },
      animate: true
    });
    ```

    #### `zoom.toSelection`

    Zooms to fit all currently selected blocks in the viewport.

    ```javascript
    // Zoom to selection with animation
    await cesdk.actions.run('zoom.toSelection', {
      padding: 40,
      animate: true
    });

    // Auto-fit to selection
    await cesdk.actions.run('zoom.toSelection', {
      autoFit: true,
      padding: { x: 20, y: 20 }
    });
    ```

    #### `zoom.in` and `zoom.out`

    Step-based zoom controls with configurable limits.

    ```javascript
    // Zoom in with default settings
    await cesdk.actions.run('zoom.in');

    // Zoom in with custom maximum
    await cesdk.actions.run('zoom.in', {
      maxZoom: 4, // Maximum zoom level
      animate: true
    });

    // Zoom out with custom minimum
    await cesdk.actions.run('zoom.out', {
      minZoom: 0.25, // Minimum zoom level
      animate: {
        duration: 0.2,
        easing: 'EaseOut'
      }
    });
    ```

    #### `zoom.toLevel`

    Sets the zoom to a specific level.

    ```javascript
    // Set zoom to 100%
    await cesdk.actions.run('zoom.toLevel', 1.0);

    // Set zoom to 200% with animation
    await cesdk.actions.run('zoom.toLevel', 2.0, {
      animate: true,
      minZoom: 0.125,
      maxZoom: 32
    });

    // Fit to width (50% zoom)
    await cesdk.actions.run('zoom.toLevel', 0.5, {
      animate: {
        duration: 0.3,
        easing: 'EaseInOut'
      }
    });
    ```

    #### Padding Options

    Padding can be specified in multiple ways:

    ```javascript
    // Uniform padding on all sides
    { padding: 20 }

    // Different horizontal and vertical padding
    { padding: { x: 40, y: 20 } }

    // Individual padding for each side
    { padding: { top: 10, bottom: 20, left: 30, right: 40 } }
    ```

    #### Animation Options

    Animation can be a boolean or an object with detailed settings:

    ```javascript
    // Simple animation toggle
    { animate: true }  // Uses default duration and easing
    { animate: false } // No animation

    // Detailed animation configuration
    {
      animate: {
        duration: 0.3,        // Duration in seconds
        easing: 'EaseInOut',  // 'Linear', 'EaseIn', 'EaseOut', or 'EaseInOut'
        interruptible: true   // Whether the animation can be interrupted
      }
    }
    ```

    #### Auto-Fit Mode

    The `autoFit` option enables automatic zoom adjustment when the viewport resizes:

    ```javascript
    // Enable auto-fit to maintain proper framing
    await cesdk.actions.run('zoom.toPage', {
      autoFit: true,
      padding: { x: 40, y: 80 }
    });
    ```

    When auto-fit is enabled, the zoom level will automatically adjust to keep the target properly framed when the viewport size changes.

    #### Custom Zoom Action Example

    You can override the default zoom actions with custom implementations:

    ```javascript
    // Custom zoom to page with analytics
    cesdk.actions.register('zoom.toPage', async (options) => {
      // Track zoom event
      console.log('User zoomed to page');

      // Get current page
      const currentPage = cesdk.engine.scene.getCurrentPage();
      if (!currentPage) return;

      // Apply custom zoom logic
      await cesdk.engine.scene.zoomToBlock(currentPage, {
        padding: options?.padding ?? { x: 50, y: 100 },
        animate: options?.animate ?? true
      });

      // Custom post-zoom behavior
      cesdk.ui.showNotification('Zoomed to page');
    });
    ```

    ### Video Timeline Zoom Actions

    The video timeline has its own set of zoom controls for managing the timeline view. These actions are registered when the video timeline component is active and provide instant zoom without animation.

    #### `timeline.zoom.in`

    Zooms in the video timeline by one step (multiplies current zoom level by 1.25).

    ```javascript
    // Zoom in the timeline
    await cesdk.actions.run('timeline.zoom.in');
    ```

    #### `timeline.zoom.out`

    Zooms out the video timeline by one step (divides current zoom level by 1.25).

    ```javascript
    // Zoom out the timeline
    await cesdk.actions.run('timeline.zoom.out');
    ```

    #### `timeline.zoom.fit`

    Automatically adjusts the timeline zoom to fit all content in the visible area.

    ```javascript
    // Fit timeline to show all content
    await cesdk.actions.run('timeline.zoom.fit');
    ```

    #### `timeline.zoom.toLevel`

    Sets the timeline zoom to a specific level.

    ```javascript
    // Set timeline zoom to 100%
    await cesdk.actions.run('timeline.zoom.toLevel', 1.0);

    // Set timeline zoom to 150%
    await cesdk.actions.run('timeline.zoom.toLevel', 1.5);

    // Set timeline zoom to 50%
    await cesdk.actions.run('timeline.zoom.toLevel', 0.5);
    ```

    #### `timeline.zoom.reset`

    Resets the timeline zoom to the default level (1.0 or 100%).

    ```javascript
    // Reset timeline zoom to default
    await cesdk.actions.run('timeline.zoom.reset');
    ```

    ### Scroll Actions

    CE.SDK provides a scroll action for panning the viewport to different pages without changing the zoom level. This is useful for multi-page navigation where you want to maintain the current zoom.

    #### `scroll.toPage`

    Scrolls the viewport to center on a specific page without changing the zoom level.

    ```javascript
    // Scroll to current page without animation
    await cesdk.actions.run('scroll.toPage');

    // Scroll to current page with smooth animation
    await cesdk.actions.run('scroll.toPage', {
      animate: true
    });

    // Scroll to a specific page
    await cesdk.actions.run('scroll.toPage', {
      pageId: myPageId,
      animate: true
    });
    ```

    #### Parameters

    The `scroll.toPage` action accepts an optional options object:

    - `pageId` (optional): The ID of the page to scroll to. If not provided, scrolls to the current page.
    - `animate` (optional): Whether to animate the scroll transition. Default is `false`.

    #### Scroll vs Zoom

    The key difference between `scroll.toPage` and `zoom.toPage`:

    - **`scroll.toPage`**: Pans the viewport to center on the page while maintaining the current zoom level
    - **`zoom.toPage`**: Adjusts the zoom level to fit the page within the viewport with padding

    Use `scroll.toPage` when you want to navigate between pages in a multi-page document while keeping the same zoom level. Use `zoom.toPage` when you want to frame a page properly within the viewport.

    ### Clipboard Actions

    - `copy` - Copy the current selection
    - `cut` - Copy the current selection, then delete it
    - `paste` - Paste the clipboard contents

    ### Selection & Navigation Actions

    - `selection.parentOrDeselect` - Select the parent group, or deselect if none
    - `group.enterOrExit` - Enter the selected group, or exit the current group
    - `vectorPath.deleteNodeOrPoint` - Delete the selected vector node or control point

    ### Movement Actions

    - `selection.nudgeUp` / `selection.nudgeDown` / `selection.nudgeLeft` / `selection.nudgeRight` - Nudge the selection by one step
    - `selection.nudgeUpExtended` / `selection.nudgeDownExtended` / `selection.nudgeLeftExtended` / `selection.nudgeRightExtended` - Nudge the selection by a larger step

    ### Rotation Actions

    - `selection.rotateCW` / `selection.rotateCCW` - Rotate the selection clockwise / counter-clockwise by one step
    - `selection.rotateCWExtended` / `selection.rotateCCWExtended` - Rotate the selection by a larger step

    ### Resize Actions

    - `selection.resizeWidthGrow` / `selection.resizeWidthShrink` - Grow / shrink the selection's width by one step
    - `selection.resizeHeightGrow` / `selection.resizeHeightShrink` - Grow / shrink the selection's height by one step
    - `selection.resizeWidthGrowFromLeft` / `selection.resizeWidthShrinkFromLeft` - Resize the width from the opposite (left) edge
    - `selection.resizeHeightGrowFromTop` / `selection.resizeHeightShrinkFromTop` - Resize the height from the opposite (top) edge
    - Each resize action has an `…Extended` variant that applies a larger step

    ### Crop Nudge Actions

    - `crop.nudgeUp` / `crop.nudgeDown` / `crop.nudgeLeft` / `crop.nudgeRight` - Move the image inside its crop frame by one step
    - `crop.nudgeUpExtended` / `crop.nudgeDownExtended` / `crop.nudgeLeftExtended` / `crop.nudgeRightExtended` - Move the image inside its crop frame by a larger step

    ### Text Formatting Actions

    - `text.toggleBold` - Toggle bold on the selected text
    - `text.toggleItalic` - Toggle italic on the selected text
    - `text.toggleUnderline` - Toggle underline on the selected text
    - `text.toggleStrikethrough` - Toggle strikethrough on the selected text

    ### Editor & UI Actions

    - `toggleUserInterfaceVisibility` - Show or hide the editor UI
    - `zoom.toFit` - Zoom to fit the current page
    - `scroll.toBlock` - Scroll the viewport to center on a block
    - `editor.checkBrowserSupport` - Check whether the current browser is supported
    - `timeline.collapse` - Collapse the video timeline
    - `timeline.expand` - Expand the video timeline

    ### Timeline Keyboard Actions

    The keyboard alternative to dragging clips, trim handles, and the playhead in the video timeline. Each acts on every selected clip.

    - `timeline.clip.moveEarlier` / `timeline.clip.moveLater` - Move the selected clips earlier / later in time by one step
    - `timeline.clip.moveEarlierExtended` / `timeline.clip.moveLaterExtended` - Move the selected clips by a larger step
    - `timeline.clip.insertPushEarlier` / `timeline.clip.insertPushLater` - Move earlier / later, pushing overlapping neighbors aside to make room
    - `timeline.clip.moveToTrackAbove` / `timeline.clip.moveToTrackBelow` - Move the selected clips to the track above / below, keeping their time offset (a new track is created when there is no room)
    - `timeline.clip.newTrackAbove` / `timeline.clip.newTrackBelow` - Move the selected clips onto a brand-new track above / below
    - `timeline.skim.back` / `timeline.skim.forward` - Move the playhead back / forward by one step
    - `timeline.skim.toStart` / `timeline.skim.toEnd` - Move the playhead to the start / end
    - `trim.moveOutEarlier` / `trim.moveOutLater` - Move the selected clips' out point (end) earlier / later
    - `trim.moveInEarlier` / `trim.moveInLater` - Move the selected clips' in point (start) earlier / later

    ### History

    - `history.undo` - Undo the last change
    - `history.redo` - Redo the last undone change

    ### Lifecycle / selection

    - `selection.delete` - Delete the selected blocks
    - `selection.duplicate` - Duplicate the selected blocks
    - `selection.group` - Group the selected blocks
    - `selection.ungroup` - Ungroup the selected group
    - `group.enter` - Enter the selected group for editing
    - `group.exit` - Exit the current group
    - `select` - Select blocks by id (dispatched by the engine on click)
    - `selection.all` - Select all blocks on the current page
    - `select.byType` - Select all blocks of a given type
    - `selection.parentOrDeselect` - Select the parent group, or deselect if none
    - `rename` - Rename the selected block
    - `lock.toggle` - Toggle the lock state of the selected blocks

    ### Transform / arrange

    - `nudge` - Move the selection by a pixel delta (`{ dx, dy }`)
    - `transform` - Apply position/size/rotation to blocks
    - `resize` - Resize the selection by a delta or scale
    - `scale` - Scale the selection around an anchor
    - `rotate` - Rotate the selection by degrees (absolute or relative)
    - `flip.horizontal` - Flip the selection horizontally
    - `flip.vertical` - Flip the selection vertically
    - `align.horizontal` - Align the selection horizontally (left/center/right)
    - `align.vertical` - Align the selection vertically (top/center/bottom)
    - `distribute.horizontal` - Distribute the selection horizontally
    - `distribute.vertical` - Distribute the selection vertically
    - `matchSize` - Match the size of the selection to a reference block
    - `bringToFront` - Bring the selection to the front
    - `bringForward` - Bring the selection forward one step
    - `sendBackward` - Send the selection backward one step
    - `sendToBack` - Send the selection to the back
    - `reorder.moveToIndex` - Move the selection to a specific layer index
    - `reparent` - Move the selection under a new parent

    ### Appearance

    - `opacity` - Set the opacity of the selection
    - `visibility.toggle` - Toggle visibility of the selection
    - `blendMode` - Set the blend mode of the selection
    - `fill.color` - Set the solid fill color
    - `fill.toggle` - Toggle the fill on or off
    - `contentFillMode` - Set the content fill mode (crop/cover/contain)
    - `stroke.toggle` - Toggle the stroke on or off
    - `stroke.color` - Set the stroke color
    - `stroke.width` - Set the stroke width
    - `dropShadow.toggle` - Toggle the drop shadow on or off
    - `dropShadow.color` - Set the drop shadow color
    - `dropShadow.offset` - Set the drop shadow offset
    - `dropShadow.blur` - Set the drop shadow blur
    - `blur.toggle` - Toggle the block blur on or off
    - `blur.set` - Set the block blur type
    - `effect.append` - Append an effect to the selection
    - `effect.remove` - Remove an effect by index
    - `effect.clear` - Remove all effects from the selection

    ### Crop / edit mode

    - `crop.enter` - Enter crop mode (dispatched by the engine on double-click)
    - `crop.reset` - Reset the crop to its default
    - `crop.fillFrame` - Fill the frame with the cropped content
    - `editmode.exit` - Exit the current edit mode
    - `text.edit` - Enter text editing (dispatched by the engine on double-click)

    ### Text

    - `text.toggleBold` - Toggle bold on the selected text
    - `text.toggleItalic` - Toggle italic on the selected text
    - `text.fontSize` - Set the font size
    - `text.align` - Set the text alignment (left/center/right)
    - `text.case` - Set the text case (normal/upper/lower/title)
    - `text.color` - Set the text color
    - `text.lineHeight` - Set the line height
    - `text.letterSpacing` - Set the letter spacing
    - `text.list` - Set the list style (none/unordered/ordered)
    - `text.typeface` - Set the typeface

    ### Pages

    - `page.add` - Add a new page
    - `page.selectNext` - Scroll to the next page
    - `page.selectPrevious` - Scroll to the previous page
    - `page.remove` - Remove a page
    - `page.duplicate` - Duplicate a page
    - `page.size` - Set a page's size
    - `page.background.toggle` - Toggle a page's background fill
    - `page.title.edit` - Edit a page's title (dispatched by the engine)

    ### Scene / view

    - `scene.layout` - Set the scene layout (free/stacks)
    - `scene.size` - Set the scene size
    - `zoom` - Set the zoom level/factor around a pivot
    - `zoom.autoFit.toggle` - Toggle auto-fit zoom on an axis
    - `pan` - Pan the viewport by a delta

    ### Video / timeline / playback

    - `selection.split` - Split the selected clip at the playhead
    - `addClip` - Add a clip to the timeline
    - `video.playPause` - Toggle playback of the current page
    - `playback.seek` - Seek playback to a time
    - `duration` - Set the duration of the selection
    - `trim.offset` - Set the trim offset of the selection
    - `trim.length` - Set the trim length of the selection
    - `playbackSpeed` - Set the playback speed of the selection
    - `volume` - Set the volume of the selection
    - `mute.toggle` - Toggle mute on the selection
    - `loop.toggle` - Toggle looping on the selection
    - `timeOffset` - Set the time offset of the selection
    - `animation.in` / `animation.in.remove` - Set or remove the in animation
    - `animation.out` / `animation.out.remove` - Set or remove the out animation
    - `animation.loop` / `animation.loop.remove` - Set or remove the loop animation

    ### Canvas interaction primitives

    - `drag.begin` - Begin a drag gesture on blocks
    - `drag.end` - End a drag gesture on blocks
    - `secondaryAction` - The secondary (context) action at a position
  </TabItem>

  <TabItem label="Headless Actions">
    Register actions after initializing the headless engine:

    ```javascript
    import CreativeEngine from '@cesdk/engine';

    const engine = await CreativeEngine.init({
      // license: 'YOUR_CESDK_LICENSE_KEY',
    });

    // Register an action
    engine.actions.register('actionType', async (...args) => {
      // Your custom implementation
      return result;
    });

    // Execute a registered action
    await engine.actions.run('actionType', arg1, arg2);

    // Or retrieve an action to call it later
    const action = engine.actions.get('actionType');

    // List all registered actions
    const allActions = engine.actions.list();

    // List actions matching a pattern
    const exportActions = engine.actions.list({ matcher: 'text.*' });
    ```

    ## Engine-Default Actions

    The engine seeds its registry with the editor's command vocabulary. These run wherever the engine runs, including headless mode via `@cesdk/engine`. Run any of them by id, override them, or bind them to a keyboard shortcut. The full set is discoverable at runtime:

    ### History

    - `history.undo` - Undo the last change
    - `history.redo` - Redo the last undone change

    ### Lifecycle / selection

    - `selection.delete` - Delete the selected blocks
    - `selection.duplicate` - Duplicate the selected blocks
    - `selection.group` - Group the selected blocks
    - `selection.ungroup` - Ungroup the selected group
    - `group.enter` - Enter the selected group for editing
    - `group.exit` - Exit the current group
    - `select` - Select blocks by id (dispatched by the engine on click)
    - `selection.all` - Select all blocks on the current page
    - `select.byType` - Select all blocks of a given type
    - `selection.parentOrDeselect` - Select the parent group, or deselect if none
    - `rename` - Rename the selected block
    - `lock.toggle` - Toggle the lock state of the selected blocks

    ### Transform / arrange

    - `nudge` - Move the selection by a pixel delta (`{ dx, dy }`)
    - `transform` - Apply position/size/rotation to blocks
    - `resize` - Resize the selection by a delta or scale
    - `scale` - Scale the selection around an anchor
    - `rotate` - Rotate the selection by degrees (absolute or relative)
    - `flip.horizontal` - Flip the selection horizontally
    - `flip.vertical` - Flip the selection vertically
    - `align.horizontal` - Align the selection horizontally (left/center/right)
    - `align.vertical` - Align the selection vertically (top/center/bottom)
    - `distribute.horizontal` - Distribute the selection horizontally
    - `distribute.vertical` - Distribute the selection vertically
    - `matchSize` - Match the size of the selection to a reference block
    - `bringToFront` - Bring the selection to the front
    - `bringForward` - Bring the selection forward one step
    - `sendBackward` - Send the selection backward one step
    - `sendToBack` - Send the selection to the back
    - `reorder.moveToIndex` - Move the selection to a specific layer index
    - `reparent` - Move the selection under a new parent

    ### Appearance

    - `opacity` - Set the opacity of the selection
    - `visibility.toggle` - Toggle visibility of the selection
    - `blendMode` - Set the blend mode of the selection
    - `fill.color` - Set the solid fill color
    - `fill.toggle` - Toggle the fill on or off
    - `contentFillMode` - Set the content fill mode (crop/cover/contain)
    - `stroke.toggle` - Toggle the stroke on or off
    - `stroke.color` - Set the stroke color
    - `stroke.width` - Set the stroke width
    - `dropShadow.toggle` - Toggle the drop shadow on or off
    - `dropShadow.color` - Set the drop shadow color
    - `dropShadow.offset` - Set the drop shadow offset
    - `dropShadow.blur` - Set the drop shadow blur
    - `blur.toggle` - Toggle the block blur on or off
    - `blur.set` - Set the block blur type
    - `effect.append` - Append an effect to the selection
    - `effect.remove` - Remove an effect by index
    - `effect.clear` - Remove all effects from the selection

    ### Crop / edit mode

    - `crop.enter` - Enter crop mode (dispatched by the engine on double-click)
    - `crop.reset` - Reset the crop to its default
    - `crop.fillFrame` - Fill the frame with the cropped content
    - `editmode.exit` - Exit the current edit mode
    - `text.edit` - Enter text editing (dispatched by the engine on double-click)

    ### Text

    - `text.toggleBold` - Toggle bold on the selected text
    - `text.toggleItalic` - Toggle italic on the selected text
    - `text.fontSize` - Set the font size
    - `text.align` - Set the text alignment (left/center/right)
    - `text.case` - Set the text case (normal/upper/lower/title)
    - `text.color` - Set the text color
    - `text.lineHeight` - Set the line height
    - `text.letterSpacing` - Set the letter spacing
    - `text.list` - Set the list style (none/unordered/ordered)
    - `text.typeface` - Set the typeface

    ### Pages

    - `page.add` - Add a new page
    - `page.selectNext` - Scroll to the next page
    - `page.selectPrevious` - Scroll to the previous page
    - `page.remove` - Remove a page
    - `page.duplicate` - Duplicate a page
    - `page.size` - Set a page's size
    - `page.background.toggle` - Toggle a page's background fill
    - `page.title.edit` - Edit a page's title (dispatched by the engine)

    ### Scene / view

    - `scene.layout` - Set the scene layout (free/stacks)
    - `scene.size` - Set the scene size
    - `zoom` - Set the zoom level/factor around a pivot
    - `zoom.autoFit.toggle` - Toggle auto-fit zoom on an axis
    - `pan` - Pan the viewport by a delta

    ### Video / timeline / playback

    - `selection.split` - Split the selected clip at the playhead
    - `addClip` - Add a clip to the timeline
    - `video.playPause` - Toggle playback of the current page
    - `playback.seek` - Seek playback to a time
    - `duration` - Set the duration of the selection
    - `trim.offset` - Set the trim offset of the selection
    - `trim.length` - Set the trim length of the selection
    - `playbackSpeed` - Set the playback speed of the selection
    - `volume` - Set the volume of the selection
    - `mute.toggle` - Toggle mute on the selection
    - `loop.toggle` - Toggle looping on the selection
    - `timeOffset` - Set the time offset of the selection
    - `animation.in` / `animation.in.remove` - Set or remove the in animation
    - `animation.out` / `animation.out.remove` - Set or remove the out animation
    - `animation.loop` / `animation.loop.remove` - Set or remove the loop animation

    ### Canvas interaction primitives

    - `drag.begin` - Begin a drag gesture on blocks
    - `drag.end` - End a drag gesture on blocks
    - `secondaryAction` - The secondary (context) action at a position

    ## Overriding Engine Defaults Safely

    Some actions are dispatched by the engine itself in response to user input — for example `select` (on click), `crop.enter` and `text.edit` (on double-click), and `page.title.edit`. The engine reads the result of these within the same update, so an override of one of them must apply its effect **synchronously**.

    ```ts
    // Synchronous override — runs in the same tick, so the engine sees the result.
    cesdk.actions.register('select', ({ ids }) => {
      applyMySelection(ids);
    });
    ```

    > **Caution:** When you override a self-dispatched action (`select`, `crop.enter`,
    > `text.edit`, `page.title.edit`), apply the effect synchronously. An override
    > that defers its work (for example by `await`-ing before applying it) lands a
    > microtask too late for the engine's same-tick read, so the result is ignored
    > for that input. Overriding actions you trigger yourself with `run` has no such
    > constraint.
  </TabItem>
</Tabs>

## Utils API

CE.SDK provides a Utils API with utility functions for common operations. These utilities are available through `cesdk.utils`:

### Loading Dialogs

```javascript
// Create and manage loading dialogs
const dialogController = cesdk.utils.showLoadingDialog({
  title: 'Processing...',
  message: 'Please wait', // Can also be an array of strings
  progress: 0, // Initial progress value or 'indeterminate'
  cancelLabel: 'Cancel',
  abortTitle: 'Abort Operation?',
  abortMessage: 'Are you sure you want to abort?',
  abortLabel: 'Abort',
  size: 'large', // 'regular' or 'large'
  clickOutsideToClose: false,
  onAbort: () => console.log('User cancelled'),
  onDone: () => console.log('Dialog closed'),
});

// Update progress
dialogController.updateProgress({ value: 50, max: 100 });

// Show success or error
dialogController.showSuccess({
  title: 'Done!',
  message: 'Operation completed',
});
dialogController.showError({ title: 'Error', message: 'Something went wrong' });

// Close dialog
dialogController.close();
```

### Export Utility

The export utility automatically handles both static (images, PDFs) and video exports:

```javascript
// Export image or PDF
const { blobs, options } = await cesdk.utils.export({
  mimeType: 'image/png',
  pngCompressionLevel: 7,
});

// Export video (automatically detected by MIME type)
const { blobs, options } = await cesdk.utils.export({
  mimeType: 'video/mp4',
  onProgress: (rendered, encoded, total) => {
    console.log(`Progress: ${rendered}/${total} frames`);
  },
});
```

### File Operations

```javascript
// Load file from user
const file = await cesdk.utils.loadFile({
  accept: 'image/*',
  returnType: 'File', // 'dataURL', 'objectURL', 'text', 'blob', 'arrayBuffer', or 'File'
});

// Download file to user's device
await cesdk.utils.downloadFile(blob, 'image/png');

// Local upload (development only)
const asset = await cesdk.utils.localUpload(file, context);
```

### Video Support Detection

Check browser video capabilities before working with video content:

```javascript
// Check if video decoding/playback is supported
if (cesdk.utils.supportsVideoDecode()) {
  // Safe to load and play video content
  await cesdk.engine.scene.load(videoSceneUrl);
} else {
  // Show fallback UI or message
  console.log('Video playback not available in this browser');
}

// Check if video encoding/export is supported (async)
if (await cesdk.utils.supportsVideoEncode()) {
  // Video export is available
  const blob = await cesdk.engine.block.exportVideo(page);
} else {
  // Suggest server-side rendering alternative
  console.log('Video export not available - consider using CE.SDK Renderer');
}
```

These utilities provide the same checks as the `video.decode.checkSupport` and `video.encode.checkSupport` actions, but without showing dialogs. Use them when you want to check support silently and handle the UI yourself.

## Implementation Examples

### Environment-Based Upload Strategy

```javascript
// Use local upload in development, CDN in production
cesdk.actions.register('uploadFile', async (file, onProgress, context) => {
  if (process.env.NODE_ENV === 'development') {
    // Use utils for local upload
    return await cesdk.utils.localUpload(file, context);
  } else {
    console.log('Production upload for:', file.name);
    onProgress(100);

    // Production:
    // const asset = await yourCDNService.upload(file, {
    //   onProgress: onProgress
    // });

    return {
      id: 'prod-' + Date.now(),
      label: { en: file.name },
      meta: {
        uri: URL.createObjectURL(file),
        thumbUri: URL.createObjectURL(file),
        // Production:
        // uri: asset.url,
        // thumbUri: asset.thumbnailUrl
      },
    };
  }
});
```

### Combining Utils with Custom Logic

```javascript
// Use utils for heavy lifting, add custom business logic
cesdk.actions.register('exportDesign', async options => {
  console.log('Export started:', { format: options?.mimeType });

  // Production:
  // analytics.track('export_started', { format: options?.mimeType });

  // Use utils to handle the export with loading dialog
  const { blobs, options: exportOptions } = await cesdk.utils.export(options);

  // Custom post-processing
  if (exportOptions.mimeType === 'application/pdf') {
    console.log('PDF ready for watermarking:', blobs[0].size, 'bytes');

    // Production:
    // const watermarkedBlob = await addWatermark(blobs[0]);
    // await cesdk.utils.downloadFile(watermarkedBlob, 'application/pdf');

    await cesdk.utils.downloadFile(blobs[0], 'application/pdf');
  } else {
    // Direct download for other formats
    await cesdk.utils.downloadFile(blobs[0], exportOptions.mimeType);
  }

  console.log('Export completed:', { format: exportOptions.mimeType });

  // Production:
  // analytics.track('export_completed', { format: exportOptions.mimeType });
});
```

## Registering Custom Actions with Custom IDs

Beyond the predefined action types, you can register actions with custom IDs for your own application-specific needs:

```javascript
// Register a custom action
cesdk.actions.register('myCustomAction', async data => {
  console.log('Custom action triggered with:', data);
  return { success: true, processedData: data };
});

// Execute the custom action using run
const result = await cesdk.actions.run('myCustomAction', { someData: 'value' });

// Or retrieve it for conditional execution
const customAction = cesdk.actions.get('myCustomAction');
if (customAction) {
  const result = await customAction({ someData: 'value' });
}
```

## Discovering Registered Actions

Use `list()` to get all registered action IDs or find actions matching a pattern:

```javascript
// Get all registered action IDs
const registeredActions = cesdk.actions.list();
console.log('Available actions:', registeredActions);

// Find actions matching a pattern
const exportActions = cesdk.actions.list({ matcher: 'export*' });
console.log('Export actions:', exportActions);
```

## Using Actions with Navigation Actions

The navigation bar actions in CE.SDK automatically use the registered actions:

### Default Navigation Bar Actions

The default navigation bar actions map to actions:

- Save action → `saveScene` action
- Share action → `shareScene` action
- Export actions → `exportDesign` action
- Import scene/archive → `importScene` action
- Export scene/archive → `exportScene` action



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support