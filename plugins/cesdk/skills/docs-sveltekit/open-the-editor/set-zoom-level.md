> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Set Zoom Level](./open-the-editor/set-zoom-level.md)

---

Control the canvas zoom level programmatically using CE.SDK. Learn how to use
the zoom APIs to set specific levels, enable auto-fit, and zoom to blocks. You
can also customize the navigation bar with your own zoom controls.

![Set Zoom Level example showing canvas with zoom controls](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-set-zoom-level-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-set-zoom-level-browser)
>
> - [Live demo](https://img.ly/examples/guides-open-the-editor-set-zoom-level-browser/)

The zoom level is a ratio where 1.0 equals one design pixel per screen pixel. A zoom level of 2.0 makes content appear twice as large on screen, while 0.5 makes it appear half as large.

```typescript file=@cesdk_web_examples/guides-open-the-editor-set-zoom-level-browser/src/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from '../package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.actions.run('scene.create', { page: { sourceId: 'ly.img.page.presets', assetId: 'ly.img.page.presets.print.iso.a6.landscape' } });

    const page = engine.block.findByType('page')[0];

    // Set a specific zoom level (value 0.15 = 15%, 1.0 = 100%)
    engine.scene.setZoomLevel(0.15);

    // Enable auto-fit to keep content visible within the viewport
    // Parameters: block, fitMode, paddingTop, paddingRight, paddingBottom, paddingLeft
    engine.scene.enableZoomAutoFit(page, 'Both', 20, 20, 20, 20);

    // Configure navigation bar with custom zoom buttons
    // This replaces the default zoom controls
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        key: 'zoom-15',
        label: 'Zoom 15%',
        icon: '@imgly/ZoomOut',
        onClick: () => {
          engine.scene.setZoomLevel(0.15);
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'zoom-42',
        label: 'Zoom 42%',
        icon: '@imgly/Zoom',
        onClick: () => {
          engine.scene.setZoomLevel(0.42);
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'zoom-90',
        label: 'Zoom 90%',
        icon: '@imgly/ZoomIn',
        onClick: () => {
          engine.scene.setZoomLevel(0.9);
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'zoom-auto-fit',
        label: 'Auto-Fit',
        icon: '@imgly/Fit',
        onClick: () => {
          engine.scene.enableZoomAutoFit(page, 'Both', 20, 20, 20, 20);
        }
      }
    ]);

    // Zoom to show a specific block with smooth animation
    await engine.scene.zoomToBlock(page, {
      padding: 40,
      animate: { duration: 0.3, easing: 'EaseOut' }
    });
  }
}

export default Example;
```

## Understanding the Zoom APIs

CE.SDK provides three main approaches for controlling the zoom level.

### Set Zoom Level

Use `engine.scene.setZoomLevel()` to set a specific zoom level. The value is a ratio where:

- `0.15` = 15% zoom (zoomed out)
- `1.0` = 100% zoom (1:1 pixel ratio)
- `2.0` = 200% zoom (zoomed in)

```typescript highlight-set-zoom-level
// Set a specific zoom level (value 0.15 = 15%, 1.0 = 100%)
engine.scene.setZoomLevel(0.15);
```

### Auto-Fit Zoom

Use `engine.scene.enableZoomAutoFit()` to continuously adjust zoom to fit a block in the viewport. The parameters are:

- **blockOrScene**: The block ID to fit
- **axis**: `'Both'`, `'Horizontal'`, or `'Vertical'`
- **padding values**: Space around the block in screen pixels (top, right, bottom, left)

```typescript highlight-auto-fit
// Enable auto-fit to keep content visible within the viewport
// Parameters: block, fitMode, paddingTop, paddingRight, paddingBottom, paddingLeft
engine.scene.enableZoomAutoFit(page, 'Both', 20, 20, 20, 20);
```

When auto-fit is enabled, the viewport automatically adjusts when the block changes size. Calling `setZoomLevel()` or `zoomToBlock()` disables auto-fit.

### Zoom to Block

Use `engine.scene.zoomToBlock()` to focus the viewport on a specific block with animation:

```typescript highlight-zoom-to-block
// Zoom to show a specific block with smooth animation
await engine.scene.zoomToBlock(page, {
  padding: 40,
  animate: { duration: 0.3, easing: 'EaseOut' }
});
```

## Built-in Zoom Controls

CE.SDK includes a built-in zoom component that provides a complete zoom interface out of the box. The `ly.img.zoom.navigationBar` component includes:

- Zoom in and zoom out buttons
- Auto-fit button
- Fit-to-page option
- Preset zoom levels (200%, 100%, 50%)
- A dropdown with a numeric input for custom zoom values

This component appears in the navigation bar by default. For most use cases, the built-in zoom controls provide everything users need without any additional code.

## Customizing the Navigation Bar

If you need custom zoom behavior beyond what the built-in component provides, use `cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, order)` to replace or extend the navigation bar controls.

```typescript highlight-navigation-bar-buttons
// Configure navigation bar with custom zoom buttons
// This replaces the default zoom controls
cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
  'ly.img.spacer',
  {
    id: 'ly.img.action.navigationBar',
    key: 'zoom-15',
    label: 'Zoom 15%',
    icon: '@imgly/ZoomOut',
    onClick: () => {
      engine.scene.setZoomLevel(0.15);
    }
  },
  {
    id: 'ly.img.action.navigationBar',
    key: 'zoom-42',
    label: 'Zoom 42%',
    icon: '@imgly/Zoom',
    onClick: () => {
      engine.scene.setZoomLevel(0.42);
    }
  },
  {
    id: 'ly.img.action.navigationBar',
    key: 'zoom-90',
    label: 'Zoom 90%',
    icon: '@imgly/ZoomIn',
    onClick: () => {
      engine.scene.setZoomLevel(0.9);
    }
  },
  {
    id: 'ly.img.action.navigationBar',
    key: 'zoom-auto-fit',
    label: 'Auto-Fit',
    icon: '@imgly/Fit',
    onClick: () => {
      engine.scene.enableZoomAutoFit(page, 'Both', 20, 20, 20, 20);
    }
  }
]);
```

Each action button requires:

- **id**: Use `'ly.img.action.navigationBar'` for action buttons
- **key**: Unique identifier for the button
- **label**: Display text
- **icon**: Icon from the `@imgly/` icon set
- **onClick**: Handler function

By defining your own order, you can remove default controls, add custom action buttons, and reorder existing components.

## Troubleshooting

### Zoom Level Doesn't Change

- Check that no UI component is overriding zoom
- Ensure a scene exists before calling zoom methods
- Verify zoom clamping isn't limiting the range

### Auto-Fit Not Working

- Only one block can have auto-fit enabled at a time
- Calling `setZoomLevel()` or `zoomToBlock()` disables auto-fit
- Pass a valid block ID that exists in the scene

### Custom Buttons Not Appearing

- Ensure `setComponentOrder()` is called after the scene is created
- Check that button keys are unique
- Verify the icon name is correct

## API Reference

| Method                                | Description                       |
| ------------------------------------- | --------------------------------- |
| `engine.scene.getZoomLevel()`         | Get current zoom level            |
| `engine.scene.setZoomLevel()`         | Set zoom level directly           |
| `engine.scene.zoomToBlock()`          | Zoom and pan to show a block      |
| `engine.scene.enableZoomAutoFit()`    | Enable continuous zoom adjustment |
| `engine.scene.disableZoomAutoFit()`   | Disable auto-fit                  |
| `engine.scene.isZoomAutoFitEnabled()` | Query auto-fit state              |
| `engine.scene.onZoomLevelChanged()`   | Subscribe to zoom changes         |
| `cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, order)` | Customize navigation bar layout   |



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support