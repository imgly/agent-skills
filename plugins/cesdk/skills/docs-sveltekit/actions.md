> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Actions](./actions.md)

---

The Actions API provides a centralized way to manage and customize actions for various user interactions in CE.SDK.

> **Note:** The Actions API is available after CE.SDK initialization through
> `cesdk.actions`.

> **Tip:** CE.SDK also provides a Utils API (`cesdk.utils`) with utility functions for
> common operations like exporting, file handling, and UI dialogs. These
> utilities can be used directly or within your custom actions.

## API Methods

The Actions API provides four methods:

- `register(actionId, handler)` - Register an action function for a specific event
- `get(actionId)` - Retrieve a registered action function
- `run(actionId, ...args)` - Execute a registered action with the provided arguments (throws if not registered)
- `list(matcher)` - Lists registered action IDs, optionally filtered by wildcard pattern

## Getting Started

Register actions after initializing CE.SDK:

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

CE.SDK automatically registers the following default actions:

### Action Handlers

- `saveScene` - Saves the current scene (default: downloads scene file)
- `shareScene` - Shares the current scene (no default implementation)
- `exportDesign` - Exports design in various formats (default: downloads the exported file)
- `importScene` - Imports scene or archive files (default: opens file picker)
- `exportScene` - Exports scene or archive (default: downloads the file)
- `uploadFile` - Uploads files to asset sources (default: local upload for development)
- `onUnsupportedBrowser` - Handles unsupported browsers (no default implementation)
- `video.decode.checkSupport` - Checks video decoding/playback support (shows blocking dialog if unsupported)
- `video.encode.checkSupport` - Checks video encoding/export support (shows warning dialog if unsupported)

### Zoom Actions

- `zoom.toBlock` - Zoom to a specific block with configurable padding
- `zoom.toPage` - Zoom to the current page with auto-fit support
- `zoom.toSelection` - Zoom to currently selected blocks
- `zoom.in` - Zoom in by one step with configurable maximum
- `zoom.out` - Zoom out by one step with configurable minimum
- `zoom.toLevel` - Set zoom to a specific level

### Scroll Actions

- `scroll.toPage` - Scroll the viewport to center on a specific page with optional animation

### Video Timeline Zoom Actions

- `timeline.zoom.in` - Zoom in the video timeline by one step
- `timeline.zoom.out` - Zoom out the video timeline by one step
- `timeline.zoom.fit` - Fit the video timeline to show all content
- `timeline.zoom.toLevel` - Set the video timeline zoom to a specific level
- `timeline.zoom.reset` - Reset the video timeline zoom to default (1.0)

> **Note:** The `shareScene` and `onUnsupportedBrowser` actions do not have default
> implementations and must be registered manually.

> **Tip:** CE.SDK provides both an Actions API for handling user actions and a Utils API
> for utility functions. See the Utils API section below for details on
> available utilities.

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
    // await cesdk.engine.scene.loadFromArchiveURL(archive);
  } else {
    console.log('Scene import requested');

    // Production:
    // const scene = await yourAPI.loadScene();
    // await cesdk.engine.scene.loadFromString(scene);
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
await cesdk.engine.scene.loadFromURL(videoSceneUrl);

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

#### Available Zoom Actions

- `zoom.toBlock` - Zoom to a specific block with configurable padding
- `zoom.toPage` - Zoom to the current page (or a specified page)
- `zoom.toSelection` - Zoom to the currently selected blocks
- `zoom.in` - Zoom in by one step
- `zoom.out` - Zoom out by one step
- `zoom.toLevel` - Set zoom to a specific level

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
  returnType: 'File', // 'dataURL', 'text', 'blob', 'arrayBuffer', or 'File'
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
  await cesdk.engine.scene.loadFromURL(videoSceneUrl);
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

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support