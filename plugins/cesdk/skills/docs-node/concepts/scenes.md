> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Scenes](./concepts/scenes.md)

---

Scenes are the root container for all designs in CE.SDK. They hold pages, blocks, and configuration for how your design is structured—and the engine manages only one active scene at a time.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-concepts-scenes-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-concepts-scenes-server-js)

Every design you create starts with a scene. Scenes contain pages, and pages contain the visible design elements—text, images, shapes, and other blocks. Understanding how scenes work is essential for building, saving, and restoring user designs.

```typescript file=@cesdk_web_examples/guides-concepts-scenes-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Example: Scenes Guide
 *
 * Demonstrates the complete scene lifecycle in CE.SDK:
 * - Creating scenes with different layouts
 * - Managing pages within scenes
 * - Configuring scene properties
 * - Saving and loading scenes
 * - Exporting scenes to files
 */
async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
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
    console.log('Scene design unit:', currentUnit);

    // Get the scene layout
    const layout = engine.scene.getLayout();
    console.log('Scene layout:', layout);

    // Check scene mode (Design or Video)
    const mode = engine.scene.getMode();
    console.log('Scene mode:', mode);

    // Access pages within the scene
    const pages = engine.scene.getPages();
    console.log('Number of pages:', pages.length);

    // Save the scene to a string for persistence
    const sceneString = await engine.scene.saveToString();
    console.log('Scene saved successfully. String length:', sceneString.length);

    // Demonstrate loading the scene from the saved string
    // This replaces the current scene with the saved version
    await engine.scene.loadFromString(sceneString);
    console.log('Scene loaded from saved string');

    // Export the first page to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const loadedPages = engine.scene.getPages();
    const blob = await engine.block.export(loadedPages[0], {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/scenes-page1.png`, buffer);
    console.log('Exported to output/scenes-page1.png');

    console.log('Scenes guide completed successfully.');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers how to create scenes from scratch, manage pages within scenes, configure scene properties, save and load designs, and export pages to image files.

## Scene Hierarchy

Scenes form the root of CE.SDK's design structure. The hierarchy works as follows:

- **Scene** — The root container holding all design content
- **Pages** — Direct children of scenes, arranged according to the scene's layout
- **Blocks** — Design elements (text, images, shapes) that belong to pages

Only blocks attached to pages within the active scene are rendered when exported. Use `engine.scene.get()` to retrieve the current scene and `engine.scene.getPages()` to access its pages.

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
    console.log('Scene design unit:', currentUnit);

    // Get the scene layout
    const layout = engine.scene.getLayout();
    console.log('Scene layout:', layout);

    // Check scene mode (Design or Video)
    const mode = engine.scene.getMode();
    console.log('Scene mode:', mode);
```

Supported units are `'Pixel'`, `'Millimeter'`, and `'Inch'`. For more details, see the [Design Units](./concepts/design-units.md) guide.

### Scene Mode

Scenes operate in either Design mode or Video mode, determined at creation time. Use `engine.scene.getMode()` to check which mode is active:

- **Design** — For static designs like posters, social media graphics, and print materials
- **Video** — For timeline-based editing with animations and video clips

### Scene Layout

Control how pages are arranged using `engine.scene.getLayout()` and `engine.scene.setLayout()`. The layout affects how pages are organized in multi-page designs.

## Page Navigation

Access pages within your scene using these methods:

```typescript highlight-page-navigation
// Access pages within the scene
const pages = engine.scene.getPages();
console.log('Number of pages:', pages.length);
```

Use `engine.scene.getPages()` to get all pages in the scene. In server-side processing, you typically iterate through pages to export or modify each one.

## Saving Scenes

### Saving to String

Use `engine.scene.saveToString()` to serialize the current scene. This captures the complete scene structure—pages, blocks, and their properties—as a string you can store.

```typescript highlight-save-scene
// Save the scene to a string for persistence
const sceneString = await engine.scene.saveToString();
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
console.log('Scene loaded from saved string');
```

Loading a new scene replaces any existing scene. The engine only holds one active scene at a time.

### Loading from URL

Use `engine.scene.loadFromURL()` to load a scene directly from a remote location:

```typescript
await engine.scene.loadFromURL('https://example.com/design.scene');
```

## Exporting Scenes

In server-side workflows, you typically export scenes to files for further processing or delivery:

```typescript highlight-export
    // Export the first page to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const loadedPages = engine.scene.getPages();
    const blob = await engine.block.export(loadedPages[0], {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/scenes-page1.png`, buffer);
    console.log('Exported to output/scenes-page1.png');
```

Use `engine.block.export()` to render pages to PNG, JPEG, or PDF format. The exported blob can be saved to the file system or uploaded to cloud storage.

## Engine Cleanup

Always dispose of the engine when finished to free resources:

```typescript highlight-cleanup
engine.dispose();
```

Use a `try/finally` block to ensure cleanup happens even if an error occurs during processing.

## Troubleshooting

### Blocks Not Visible in Export

Ensure blocks are attached to pages, and pages are attached to the scene. Orphaned blocks that aren't part of the scene hierarchy won't appear in exports.

### Scene Not Loading

Check that the scene URL or string is valid. If assets fail to load, consider using the `waitForResources` option to ensure everything loads before exporting.

### Export Fails

Verify the page exists and is part of the active scene. Check that the output directory exists before writing files.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support