> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Start With Blank Canvas](./open-the-editor/blank-canvas.md)

---

Create a new scene from scratch to build designs with complete control over canvas dimensions and initial content.

![Start With Blank Canvas example showing an empty page in the editor](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-blank-canvas-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-blank-canvas-browser)
>
> - [Live demo](https://img.ly/examples/guides-open-the-editor-blank-canvas-browser/)

Starting from a blank canvas lets you build new designs without pre-existing content. The `engine.scene.create()` method creates an empty scene with its own camera, ready for adding pages and content. This differs from loading templates or images, which start with existing content.

> **Other Ways to Create Scenes:** You can also start with existing content:* [Create From Image](./open-the-editor/from-image.md) — Start with an image as the base
> * [Load a Scene](./open-the-editor/load-scene.md) — Resume editing a previously saved design

```typescript file=@cesdk_web_examples/guides-open-the-editor-blank-canvas-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default asset sources for editing
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // ========================================
    // Create an Empty Scene
    // ========================================
    // Create a new empty scene with a page of specific dimensions
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    // Find the page that was automatically created
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // ========================================
    // Enable Auto-Fit Zoom
    // ========================================
    // Enable auto-fit zoom to keep the page visible when resizing
    // This continuously adjusts the zoom level to fit the page horizontally
    engine.scene.zoomToBlock(page);
    engine.scene.enableZoomAutoFit(page, 'Horizontal', 40, 40);
  }
}

export default Example;
```

This guide covers how to create an empty scene with custom page dimensions and configure the viewport for editing.

## Create an Empty Scene

We call `engine.scene.create()` to create a new design scene. We pass the layout type and options parameter to specify page dimensions. The scene includes a page automatically when we provide size options.

```typescript highlight-create-scene
// Create a new empty scene with a page of specific dimensions
engine.scene.create('VerticalStack', {
  page: { size: { width: 800, height: 600 } }
});
```

The first parameter specifies the scene layout. Use `'Free'` for independent page positioning, `'VerticalStack'` or `'HorizontalStack'` for aligned layouts. The options object configures the initial page with a size in design units.

## Enable Auto-Fit Zoom

For interactive editing, we enable auto-fit zoom to keep the page visible when the viewport resizes. This provides a responsive editing experience where the canvas automatically adjusts to the available space.

```typescript highlight-zoom
// Enable auto-fit zoom to keep the page visible when resizing
// This continuously adjusts the zoom level to fit the page horizontally
engine.scene.zoomToBlock(page);
engine.scene.enableZoomAutoFit(page, 'Horizontal', 40, 40);
```

The `enableZoomAutoFit()` method continuously adjusts the zoom level to fit the specified block. Use `'Horizontal'` to fit the width, `'Vertical'` to fit the height, or `'Both'` to fit both dimensions. The padding parameters add space around the content.

For one-time zoom adjustments, use `zoomToBlock()` instead. The editor UI also provides built-in zoom controls that users can access through the canvas toolbar.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.scene.create(layout, options)` | Creates an empty scene with optional page configuration |
| `engine.block.findByType('page')` | Finds all pages in the current scene |
| `engine.scene.enableZoomAutoFit(block, axis, paddingBefore, paddingAfter)` | Continuously adjusts zoom to fit a block |
| `engine.scene.zoomToBlock(block, options)` | One-time zoom adjustment to frame a block |
| `engine.scene.disableZoomAutoFit(block)` | Disables auto-fit zoom |

## Next Steps

Now that you have created a design from a blank canvas, explore related topics:

- [Save](./export-save-publish/save.md) — Persist your design to a file or backend service
- [Blocks](./concepts/blocks.md) — Learn about scene hierarchy and block relationships
- [Create From Image](./open-the-editor/from-image.md) — Start with an existing image instead of a blank canvas



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support