> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Engine](./engine-interface.md)

---

Access CE.SDK's cross-platform C++ engine programmatically for client-side automation, custom UIs, and headless workflows in the browser.

CE.SDK is built on a layered architecture where a cross-platform C++ core engine powers all creative operations. The Editor UI and your programmatic code access identical capabilities through the same underlying engine.

## Web SDK Packages

CE.SDK offers three npm packages:

**@cesdk/cesdk-js**: Full package with Editor UI and Engine. Initialize with `CreativeEditorSDK.create()` and access the Engine via `cesdk.engine`. Use this when users edit designs visually while your code automates tasks like validation, auto-save, and thumbnail generation.

```javascript
import CreativeEditorSDK from '@cesdk/cesdk-js';

const cesdk = await CreativeEditorSDK.create('#container', {
  // license: 'YOUR_CESDK_LICENSE_KEY',
});

const engine = cesdk.engine;
```

**@cesdk/engine**: Engine-only package without UI. Smaller bundle size. Initialize with `CreativeEngine.init()`. Use for browser automation, custom UIs, or hidden Engine instances.

**@cesdk/node**: Node.js package for server-side processing, compiled for the Node.js runtime. The API matches `@cesdk/engine` except that `block.exportVideo()` throws, and browser-only surface such as `engine.shortcuts` and `engine.element` is absent.

## Engine API Namespaces

The Engine organizes its functionality into eight namespaces:

- **engine.block**: Create, modify, and export design elements (shapes, text, images, videos)
- **engine.scene**: Load, save, and manage scenes and pages
- **engine.asset**: Register and query asset sources (images, templates, fonts)
- **engine.editor**: Configure editor settings, manage edit modes, handle undo/redo
- **engine.variable**: Define and update template variables for data merge
- **engine.event**: Subscribe to engine events (selection changes, state updates)
- **engine.actions**: Register, run, and look up named actions such as `ly.img.undo`
- **engine.shortcuts**: Map keyboard shortcuts to actions. Not available on `@cesdk/node`

## Combining UI and Engine Access

The Editor UI calls Engine APIs internally. When you use `cesdk.engine`, you're accessing the same APIs. Most applications combine both: users interact with the visual editor while your code automates supporting tasks.

Common patterns:

- **Template loading**: Load scenes when users select templates
- **Validation**: Check for empty placeholders before export
- **Auto-save**: Serialize scenes with `engine.scene.saveToString()`
- **Thumbnails**: Generate previews with `engine.block.export()`

## Hidden Engine Instances

Run a second, invisible Engine alongside your main UI to keep automation isolated from the interactive session:

```javascript
import CreativeEditorSDK from '@cesdk/cesdk-js';
import CreativeEngine from '@cesdk/engine';

// Main editor with UI
const cesdk = await CreativeEditorSDK.create('#container', {
  // license: 'YOUR_CESDK_LICENSE_KEY',
});

// Isolated engine with its own scene, selection, and undo history
const isolatedEngine = await CreativeEngine.init({
  // license: 'YOUR_CESDK_LICENSE_KEY',
  featureFlags: { exportWorker: true },
});

async function generateThumbnail(sceneData) {
  await isolatedEngine.scene.load(sceneData);
  const page = isolatedEngine.scene.getPages()[0];
  return await isolatedEngine.block.export(page, {
    mimeType: 'image/jpeg',
    targetWidth: 200,
    targetHeight: 200,
  });
}
```

`targetWidth` and `targetHeight` need each other: set both, or neither applies. They define a box the render fills while keeping the block's aspect ratio, so the result can exceed one of the two values.

A hidden instance gives you **isolation, not parallelism**. It keeps its own scene, selection, and undo history, so its work never disturbs what the user edits. Both Engines still run on the browser's main thread, which is why the example enables `exportWorker`: without that flag, a `block.export()` on the hidden instance freezes the editor while it renders.

With the flag on, each `block.export()` serializes the scene, starts a Web Worker with its own Engine, and renders there. That costs a worker startup and another Engine in memory per call, so it buys responsiveness rather than throughput. Video and audio exports already use a worker without the flag. See the [Performance guide](./performance.md) for the trade-off, or `@cesdk/node` when volume matters more than latency.

## Memory Management

Each Engine instance consumes memory. Dispose instances when done:

```javascript
isolatedEngine.dispose();
```

For resource-intensive tasks like high-resolution exports, consider server-side processing with `@cesdk/node`.

## Troubleshooting

**Engine not initialized**: Ensure `CreativeEditorSDK.create()` or `CreativeEngine.init()` completes before accessing `engine`.

**Hidden instance freezes the UI during export**: A second Engine shares the main thread. Set `featureFlags: { exportWorker: true }` to render static exports in a Web Worker, or move the work server-side with `@cesdk/node`.

**Memory issues**: Dispose unused instances with `engine.dispose()`.

## Next Steps

- [Node.js SDK](#broken-link-n1234a) for server-side processing
- [Automation Overview](./automation/overview.md) for workflow examples



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support