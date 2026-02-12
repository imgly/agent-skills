> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Engine](./engine-interface.md)

---

Access CE.SDK's cross-platform C++ engine programmatically for client-side automation, background processing, and custom workflows in the browser.

CE.SDK is built on a layered architecture where a cross-platform C++ core engine powers all creative operations. The Editor UI and your programmatic code access identical capabilities through the same underlying engine.

## Web SDK Packages

CE.SDK offers three npm packages:

**@cesdk/cesdk-js**: Full package with Editor UI and Engine. Initialize with `CreativeEditorSDK.create()` and access the Engine via `cesdk.engine`. Use this when users edit designs visually while your code handles background tasks.

```javascript
import CreativeEditorSDK from '@cesdk/cesdk-js';

const cesdk = await CreativeEditorSDK.create('#container', {
  // license: 'YOUR_CESDK_LICENSE_KEY',
});

const engine = cesdk.engine;
```

**@cesdk/engine**: Engine-only package without UI. Smaller bundle size. Initialize with `CreativeEngine.init()`. Use for browser automation, custom UIs, or hidden Engine instances.

**@cesdk/node**: Node.js package for server-side processing. Same API, compiled for Node.js runtime.

## Engine API Namespaces

The Engine organizes its functionality into six namespaces:

- **engine.block**: Create, modify, and export design elements (shapes, text, images, videos)
- **engine.scene**: Load, save, and manage scenes and pages
- **engine.asset**: Register and query asset sources (images, templates, fonts)
- **engine.editor**: Configure editor settings, manage edit modes, handle undo/redo
- **engine.variable**: Define and update template variables for data merge
- **engine.event**: Subscribe to engine events (selection changes, state updates)

## Combining UI and Engine Access

The Editor UI calls Engine APIs internally. When you use `cesdk.engine`, you're accessing the same APIs. Most applications combine both: users interact with the visual editor while your code automates background tasks.

Common patterns:

- **Template loading**: Load scenes when users select templates
- **Validation**: Check for empty placeholders before export
- **Auto-save**: Serialize scenes with `engine.scene.saveToString()`
- **Thumbnails**: Generate previews with `engine.block.export()`

## Hidden Engine Instances

Run a second, invisible Engine alongside your main UI for background processing:

```javascript
import CreativeEngine from '@cesdk/engine';

// Main editor with UI
const cesdk = await CreativeEditorSDK.create('#container', config);

// Hidden engine for background work
const backgroundEngine = await CreativeEngine.init({
  // license: 'YOUR_CESDK_LICENSE_KEY',
});

async function generateThumbnail(sceneData) {
  await backgroundEngine.scene.loadFromString(sceneData);
  const page = backgroundEngine.scene.getPages()[0];
  return await backgroundEngine.block.export(page, 'image/jpeg', {
    targetWidth: 200,
    targetHeight: 200,
  });
}
```

## Memory Management

Each Engine instance consumes memory. Dispose instances when done:

```javascript
backgroundEngine.dispose();
```

For resource-intensive tasks like high-resolution exports, consider server-side processing with `@cesdk/node`.

## Troubleshooting

**Engine not initialized**: Ensure `CreativeEditorSDK.create()` or `CreativeEngine.init()` completes before accessing `engine`.

**Hidden instance blocking UI**: Heavy operations can impact browser performance. Move resource-intensive tasks to server-side.

**Memory issues**: Dispose unused instances with `engine.dispose()`.

## Next Steps

- [Node.js SDK](./what-is-cesdk.md) for server-side processing
- [Automation Overview](./automation/overview.md) for workflow examples



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support