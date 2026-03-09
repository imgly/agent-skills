> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Scenes](./concepts/scenes.md)

---

Scenes are the root container for all designs in CE.SDK. They hold pages, blocks, and the camera that controls what you see in the canvas—and the engine manages only one active scene at a time.

![Scenes example showing a two-page design with different shapes on each page](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-concepts-scenes-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-concepts-scenes-browser)
>
> - [Live demo](https://img.ly/examples/guides-concepts-scenes-browser/)

Every design you create starts with a scene. Scenes contain pages, and pages contain the visible design elements—text, images, shapes, and other blocks. Understanding how scenes work is essential for building, saving, and restoring user designs.

```typescript file=@cesdk_web_examples/guides-concepts-scenes-browser/browser.ts reference-only
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

/**
 * CE.SDK Plugin: Scenes Guide
 *
 * Demonstrates the complete scene lifecycle in CE.SDK:
 * - Creating scenes with different layouts
 * - Managing pages within scenes
 * - Configuring scene properties
 * - Saving and loading scenes
 * - Camera control and zoom
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Create a new design scene with VerticalStack layout
    // The layout controls how pages are arranged in the canvas
    engine.scene.create('VerticalStack');

    // Get the stack container and add spacing between pages
    const stack = engine.block.findByType('stack')[0];
    engine.block.setFloat(stack, 'stack/spacing', 20);
    engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

    // Create the first page
    const page1 = engine.block.create('page');
    engine.block.setWidth(page1, 800);
    engine.block.setHeight(page1, 600);
    engine.block.appendChild(stack, page1);

    // Create a second page
    const page2 = engine.block.create('page');
    engine.block.setWidth(page2, 800);
    engine.block.setHeight(page2, 600);
    engine.block.appendChild(stack, page2);

    // Add a shape to the first page
    const graphic1 = engine.block.create('graphic');
    engine.block.setShape(graphic1, engine.block.createShape('rect'));
    const fill1 = engine.block.createFill('color');
    engine.block.setColor(fill1, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    engine.block.setFill(graphic1, fill1);
    engine.block.setWidth(graphic1, 400);
    engine.block.setHeight(graphic1, 300);
    engine.block.setPositionX(graphic1, 200);
    engine.block.setPositionY(graphic1, 150);
    engine.block.appendChild(page1, graphic1);

    // Add a different shape to the second page
    const graphic2 = engine.block.create('graphic');
    engine.block.setShape(graphic2, engine.block.createShape('ellipse'));
    const fill2 = engine.block.createFill('color');
    engine.block.setColor(fill2, 'fill/color/value', {
      r: 0.9,
      g: 0.3,
      b: 0.2,
      a: 1
    });
    engine.block.setFill(graphic2, fill2);
    engine.block.setWidth(graphic2, 350);
    engine.block.setHeight(graphic2, 350);
    engine.block.setPositionX(graphic2, 225);
    engine.block.setPositionY(graphic2, 125);
    engine.block.appendChild(page2, graphic2);

    // Query scene properties
    const currentUnit = engine.scene.getDesignUnit();
    // eslint-disable-next-line no-console
    console.log('Scene design unit:', currentUnit);

    // Get the scene layout
    const layout = engine.scene.getLayout();
    // eslint-disable-next-line no-console
    console.log('Scene layout:', layout);

    // Check scene mode (Design or Video)
    const mode = engine.scene.getMode();
    // eslint-disable-next-line no-console
    console.log('Scene mode:', mode);

    // Access pages within the scene
    const pages = engine.scene.getPages();
    // eslint-disable-next-line no-console
    console.log('Number of pages:', pages.length);

    // Get the current page (nearest to viewport center)
    const currentPage = engine.scene.getCurrentPage();
    // eslint-disable-next-line no-console
    console.log('Current page ID:', currentPage);

    // Zoom to show all pages in the scene
    const scene = engine.scene.get();
    if (scene) {
      await engine.scene.zoomToBlock(scene, { padding: 50 });
    }

    // Get the current zoom level
    const zoomLevel = engine.scene.getZoomLevel();
    // eslint-disable-next-line no-console
    console.log('Current zoom level:', zoomLevel);

    // Save the scene to a string for persistence
    const sceneString = await engine.scene.saveToString();
    // eslint-disable-next-line no-console
    console.log('Scene saved successfully. String length:', sceneString.length);

    // Demonstrate loading the scene from the saved string
    // This replaces the current scene with the saved version
    await engine.scene.loadFromString(sceneString);
    // eslint-disable-next-line no-console
    console.log('Scene loaded from saved string');

    // Zoom to show all loaded pages
    const loadedScene = engine.scene.get();
    if (loadedScene) {
      await engine.scene.zoomToBlock(loadedScene, { padding: 50 });
    }

    // eslint-disable-next-line no-console
    console.log('Scenes guide initialized successfully.');
  }
}

export default Example;
```

This guide covers how to create scenes from scratch, manage pages within scenes, configure scene properties, save and load designs, and control the camera's zoom and position.

## Scene Hierarchy

Scenes form the root of CE.SDK's design structure. The hierarchy works as follows:

- **Scene** — The root container holding all design content
- **Pages** — Direct children of scenes, arranged according to the scene's layout
- **Blocks** — Design elements (text, images, shapes) that belong to pages

Only blocks attached to pages within the active scene are rendered in the canvas. Use `engine.scene.get()` to retrieve the current scene and `engine.scene.getPages()` to access its pages.

## Creating Scenes

### Creating an Empty Scene

Use `engine.scene.create()` to create a new design scene with a configurable page layout. The layout parameter controls how pages are arranged in the canvas.

```typescript highlight-create-scene
    // Create a new design scene with VerticalStack layout
    // The layout controls how pages are arranged in the canvas
    engine.scene.create('VerticalStack');

    // Get the stack container and add spacing between pages
    const stack = engine.block.findByType('stack')[0];
    engine.block.setFloat(stack, 'stack/spacing', 20);
    engine.block.setBool(stack, 'stack/spacingInScreenspace', true);
```

Available layouts include:

- `VerticalStack` — Pages stacked vertically
- `HorizontalStack` — Pages arranged horizontally
- `DepthStack` — Pages layered on top of each other
- `Free` — Manual positioning

### Creating for Video Editing

For video projects, use `engine.scene.createVideo()` which configures the scene for timeline-based editing:

```typescript
const videoScene = engine.scene.createVideo({
  page: { size: { width: 1920, height: 1080 } }
});
```

### Adding Pages

After creating a scene, add pages using `engine.block.create('page')`. Configure the page dimensions and append it to the scene's stack container.

```typescript highlight-create-page
    // Create the first page
    const page1 = engine.block.create('page');
    engine.block.setWidth(page1, 800);
    engine.block.setHeight(page1, 600);
    engine.block.appendChild(stack, page1);

    // Create a second page
    const page2 = engine.block.create('page');
    engine.block.setWidth(page2, 800);
    engine.block.setHeight(page2, 600);
    engine.block.appendChild(stack, page2);
```

### Adding Blocks

With pages in place, add design elements like shapes, text, or images. Create a graphic block, configure its shape and fill, then append it to a page.

```typescript highlight-create-block
    // Add a shape to the first page
    const graphic1 = engine.block.create('graphic');
    engine.block.setShape(graphic1, engine.block.createShape('rect'));
    const fill1 = engine.block.createFill('color');
    engine.block.setColor(fill1, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    engine.block.setFill(graphic1, fill1);
    engine.block.setWidth(graphic1, 400);
    engine.block.setHeight(graphic1, 300);
    engine.block.setPositionX(graphic1, 200);
    engine.block.setPositionY(graphic1, 150);
    engine.block.appendChild(page1, graphic1);

    // Add a different shape to the second page
    const graphic2 = engine.block.create('graphic');
    engine.block.setShape(graphic2, engine.block.createShape('ellipse'));
    const fill2 = engine.block.createFill('color');
    engine.block.setColor(fill2, 'fill/color/value', {
      r: 0.9,
      g: 0.3,
      b: 0.2,
      a: 1
    });
    engine.block.setFill(graphic2, fill2);
    engine.block.setWidth(graphic2, 350);
    engine.block.setHeight(graphic2, 350);
    engine.block.setPositionX(graphic2, 225);
    engine.block.setPositionY(graphic2, 125);
    engine.block.appendChild(page2, graphic2);
```

## Scene Properties

### Design Units

Query or configure how measurements are interpreted using `engine.scene.getDesignUnit()` and `engine.scene.setDesignUnit()`. This is useful for print workflows where precise physical dimensions matter.

```typescript highlight-scene-properties
    // Query scene properties
    const currentUnit = engine.scene.getDesignUnit();
    // eslint-disable-next-line no-console
    console.log('Scene design unit:', currentUnit);

    // Get the scene layout
    const layout = engine.scene.getLayout();
    // eslint-disable-next-line no-console
    console.log('Scene layout:', layout);

    // Check scene mode (Design or Video)
    const mode = engine.scene.getMode();
    // eslint-disable-next-line no-console
    console.log('Scene mode:', mode);
```

Supported units are `'Pixel'`, `'Millimeter'`, and `'Inch'`. For more details, see the [Design Units](./concepts/design-units.md) guide.

### Scene Mode

Scenes operate in either Design mode or Video mode, determined at creation time. Use `engine.scene.getMode()` to check which mode is active:

- **Design** — For static designs like posters, social media graphics, and print materials
- **Video** — For timeline-based editing with animations and video clips

### Scene Layout

Control how pages are arranged using `engine.scene.getLayout()` and `engine.scene.setLayout()`. The layout affects how users navigate between pages in multi-page designs.

## Page Navigation

Access pages within your scene using these methods:

```typescript highlight-page-navigation
    // Access pages within the scene
    const pages = engine.scene.getPages();
    // eslint-disable-next-line no-console
    console.log('Number of pages:', pages.length);

    // Get the current page (nearest to viewport center)
    const currentPage = engine.scene.getCurrentPage();
    // eslint-disable-next-line no-console
    console.log('Current page ID:', currentPage);
```

The `getCurrentPage()` method returns the page nearest to the viewport center—useful for determining which page the user is currently viewing.

## Camera and Zoom

### Zoom to Block

Use `engine.scene.zoomToBlock()` to frame a specific block in the viewport with padding. Pass the scene block to show all pages:

```typescript highlight-camera-zoom
    // Zoom to show all pages in the scene
    const scene = engine.scene.get();
    if (scene) {
      await engine.scene.zoomToBlock(scene, { padding: 50 });
    }

    // Get the current zoom level
    const zoomLevel = engine.scene.getZoomLevel();
    // eslint-disable-next-line no-console
    console.log('Current zoom level:', zoomLevel);
```

### Zoom Level

Get and set the zoom level directly with `engine.scene.getZoomLevel()` and `engine.scene.setZoomLevel()`. A zoom level of 1.0 means one design unit equals one screen pixel.

### Auto-Fit Zoom

For continuous auto-framing, use `engine.scene.enableZoomAutoFit()` to automatically keep a block centered as the viewport resizes.

## Saving Scenes

### Saving to String

Use `engine.scene.saveToString()` to serialize the current scene. This captures the complete scene structure—pages, blocks, and their properties—as a string you can store.

```typescript highlight-save-scene
// Save the scene to a string for persistence
const sceneString = await engine.scene.saveToString();
// eslint-disable-next-line no-console
console.log('Scene saved successfully. String length:', sceneString.length);
```

The serialized string references external assets by URL rather than embedding them. For complete portability including assets, use `engine.scene.saveToArchive()`.

## Loading Scenes

### Loading from String

Use `engine.scene.loadFromString()` to restore a scene from a saved string:

```typescript highlight-load-scene
    // Demonstrate loading the scene from the saved string
    // This replaces the current scene with the saved version
    await engine.scene.loadFromString(sceneString);
    // eslint-disable-next-line no-console
    console.log('Scene loaded from saved string');

    // Zoom to show all loaded pages
    const loadedScene = engine.scene.get();
    if (loadedScene) {
      await engine.scene.zoomToBlock(loadedScene, { padding: 50 });
    }
```

Loading a new scene replaces any existing scene. The engine only holds one active scene at a time.

### Loading from URL

Use `engine.scene.loadFromURL()` to load a scene directly from a remote location:

```typescript
await engine.scene.loadFromURL('https://example.com/design.scene');
```

## Troubleshooting

### Blocks Not Visible

Ensure blocks are attached to pages, and pages are attached to the scene. Orphaned blocks that aren't part of the scene hierarchy won't render.

### Scene Not Loading

Check that the scene URL or string is valid. If assets fail to load, consider using the `waitForResources` option to ensure everything loads before rendering.

### Zoom Not Working

Verify the scene has a valid camera. Some UI configurations may override programmatic zoom controls.



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support