> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide shows how to use the vector edit APIs to enter path editing mode, switch between move, bend, add and delete modes, control bezier handle mirroring, and manage anchor points on any shape.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-stickers-and-shapes-vector-edit-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-stickers-and-shapes-vector-edit-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-stickers-and-shapes-vector-edit-browser/)

Vector edit mode lets you modify any shape at the path level. When you enter vector edit mode on a shape, CE.SDK converts it to a vector path and exposes its anchor points and bezier handles for direct manipulation.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-vector-edit-browser/browser.ts reference-only
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

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
    await cesdk.addPlugin(new DesignEditorConfig());

    await cesdk.addPlugin(new BlurAssetSource());
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

    // Enable vector path editing feature
    cesdk.feature.enable('ly.img.shape.edit');

    await cesdk.actions.run('scene.create', {
      page: { width: 100, height: 100, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create a graphic block with a star shape
    const graphic = engine.block.create('graphic');
    const starShape = engine.block.createShape('star');
    engine.block.setShape(graphic, starShape);

    const solidFill = engine.block.createFill('color');
    engine.block.setFill(graphic, solidFill);
    engine.block.setWidth(graphic, 60);
    engine.block.setHeight(graphic, 60);
    engine.block.appendChild(page, graphic);
    engine.block.setPositionX(graphic, 20);
    engine.block.setPositionY(graphic, 20);

    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Select the graphic block and enter vector edit mode.
    // This converts the shape to a vector path so you can
    // manipulate individual anchor points and curves.
    engine.block.select(graphic);
    engine.editor.setEditMode('Vector');

    // Move mode (default): select and drag anchor points.
    // All mode flags start as false — move mode is active
    // when none of the other modes are set.

    // Bend mode: drag path segments to pull out bezier handles.
    engine.editor.setVectorEditBendMode(true);
    engine.editor.getVectorEditBendMode(); // true

    // Add mode: click on a path segment to insert a new anchor point.
    engine.editor.setVectorEditBendMode(false);
    engine.editor.setVectorEditAddMode(true);
    engine.editor.getVectorEditAddMode(); // true

    // Delete mode: click an anchor point to remove it from the path.
    engine.editor.setVectorEditAddMode(false);
    engine.editor.setVectorEditDeleteMode(true);
    engine.editor.getVectorEditDeleteMode(); // true

    // Return to move mode by clearing all flags.
    engine.editor.setVectorEditDeleteMode(false);

    // Mirror mode controls how bezier handles behave when you
    // adjust one side of an anchor point.
    // 0 = None: handles move independently.
    // 1 = Angle & Length: handles mirror both angle and length.
    // 2 = Angle Only: handles mirror angle but keep their own length.
    if (engine.editor.hasSelectedVectorNode()) {
      engine.editor.setSelectedVectorNodeMirrorMode(1);
      engine.editor.getSelectedVectorNodeMirrorMode(); // 1

      // Toggle smooth/sharp for the selected node.
      engine.editor.toggleSelectedVectorNodeSmooth();
    }

    // Query whether any vector anchor node is currently selected.
    engine.editor.hasSelectedVectorNode();

    // Insert a new anchor point at the midpoint of the
    // selected segment (only works in add mode).
    engine.editor.setVectorEditAddMode(true);
    // engine.editor.addVectorNode();

    // Remove the currently selected anchor point from the path.
    // engine.editor.deleteVectorNode();
    engine.editor.setVectorEditAddMode(false);

    // Exit vector edit mode and return to the normal transform mode.
    engine.editor.setEditMode('Transform');
  }
}

export default Example;
```

## Setup

Before using vector edit, enable the `ly.img.shape.edit` feature flag. This flag is disabled by default and must be explicitly enabled. The design editor and video editor starter kits enable it automatically.

```typescript highlight-setup
    await cesdk.addPlugin(new DesignEditorConfig());

    await cesdk.addPlugin(new BlurAssetSource());
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

    // Enable vector path editing feature
    cesdk.feature.enable('ly.img.shape.edit');

    await cesdk.actions.run('scene.create', {
      page: { width: 100, height: 100, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create a graphic block with a star shape
    const graphic = engine.block.create('graphic');
    const starShape = engine.block.createShape('star');
    engine.block.setShape(graphic, starShape);

    const solidFill = engine.block.createFill('color');
    engine.block.setFill(graphic, solidFill);
    engine.block.setWidth(graphic, 60);
    engine.block.setHeight(graphic, 60);
    engine.block.appendChild(page, graphic);
    engine.block.setPositionX(graphic, 20);
    engine.block.setPositionY(graphic, 20);

    await engine.scene.zoomToBlock(page, { padding: 40 });
```

## Entering Vector Edit Mode

Select a block that supports shapes and call `engine.editor.setEditMode('Vector')`. CE.SDK converts the current shape to a vector path so you can manipulate individual anchor points and curves.

```typescript highlight-enterVectorEdit
// Select the graphic block and enter vector edit mode.
// This converts the shape to a vector path so you can
// manipulate individual anchor points and curves.
engine.block.select(graphic);
engine.editor.setEditMode('Vector');
```

## Edit Modes

Vector edit provides four mutually exclusive modes. Only one can be active at a time — setting a new mode clears the others. When all mode flags are `false`, you are in the default **move mode**.

| Mode | Purpose |
| --- | --- |
| Move | Select and drag anchor points and control handles |
| Bend | Drag path segments to pull out bezier handles |
| Add | Click on a path segment to insert a new anchor point |
| Delete | Click an anchor point to remove it from the path |

```typescript highlight-modes
    // Move mode (default): select and drag anchor points.
    // All mode flags start as false — move mode is active
    // when none of the other modes are set.

    // Bend mode: drag path segments to pull out bezier handles.
    engine.editor.setVectorEditBendMode(true);
    engine.editor.getVectorEditBendMode(); // true

    // Add mode: click on a path segment to insert a new anchor point.
    engine.editor.setVectorEditBendMode(false);
    engine.editor.setVectorEditAddMode(true);
    engine.editor.getVectorEditAddMode(); // true

    // Delete mode: click an anchor point to remove it from the path.
    engine.editor.setVectorEditAddMode(false);
    engine.editor.setVectorEditDeleteMode(true);
    engine.editor.getVectorEditDeleteMode(); // true

    // Return to move mode by clearing all flags.
    engine.editor.setVectorEditDeleteMode(false);
```

## Mirror Mode

Mirror mode controls how the two bezier handles of an anchor point behave when you adjust one of them.

| Value | Name | Behavior |
| --- | --- | --- |
| `0` | None | Handles move independently |
| `1` | Angle & Length | Handles mirror both direction and distance |
| `2` | Angle Only | Handles mirror direction but keep independent lengths |

Use `toggleSelectedVectorNodeSmooth()` to quickly switch between a sharp corner (no handles) and a smooth curve.

```typescript highlight-mirrorMode
    // Mirror mode controls how bezier handles behave when you
    // adjust one side of an anchor point.
    // 0 = None: handles move independently.
    // 1 = Angle & Length: handles mirror both angle and length.
    // 2 = Angle Only: handles mirror angle but keep their own length.
    if (engine.editor.hasSelectedVectorNode()) {
      engine.editor.setSelectedVectorNodeMirrorMode(1);
      engine.editor.getSelectedVectorNodeMirrorMode(); // 1

      // Toggle smooth/sharp for the selected node.
      engine.editor.toggleSelectedVectorNodeSmooth();
    }
```

## Node Operations

Use these APIs to query selection state and add or remove anchor points programmatically.

```typescript highlight-nodeOperations
    // Query whether any vector anchor node is currently selected.
    engine.editor.hasSelectedVectorNode();

    // Insert a new anchor point at the midpoint of the
    // selected segment (only works in add mode).
    engine.editor.setVectorEditAddMode(true);
    // engine.editor.addVectorNode();

    // Remove the currently selected anchor point from the path.
    // engine.editor.deleteVectorNode();
    engine.editor.setVectorEditAddMode(false);
```

## Exiting Vector Edit Mode

Call `engine.editor.setEditMode('Transform')` to leave vector edit mode and return to the normal transform controls.

```typescript highlight-exitVectorEdit
// Exit vector edit mode and return to the normal transform mode.
engine.editor.setEditMode('Transform');
```

## Keyboard Shortcuts

In the built-in editor UI, vector edit mode supports keyboard shortcuts:

- **Backspace / Delete** removes the selected anchor point from the path.

## Troubleshooting

### Edit Path Button Not Visible

- Ensure the `ly.img.shape.edit` feature flag is enabled via `cesdk.feature.enable('ly.img.shape.edit')`.
- Verify the selected block supports shapes: `engine.block.supportsShape(block)` must return `true`.

### Shape Not Converting

- Only blocks with a valid shape can enter vector edit mode. If the block has no shape, create and assign one first using `engine.block.createShape()` and `engine.block.setShape()`.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.editor.setEditMode('Vector')` | Mode | Enter vector edit mode |
| `engine.editor.setEditMode('Transform')` | Mode | Exit vector edit mode |
| `engine.editor.setVectorEditBendMode(flag)` | Mode | Enable or disable bend mode |
| `engine.editor.getVectorEditBendMode()` | Mode | Query bend mode state |
| `engine.editor.setVectorEditAddMode(flag)` | Mode | Enable or disable add mode |
| `engine.editor.getVectorEditAddMode()` | Mode | Query add mode state |
| `engine.editor.setVectorEditDeleteMode(flag)` | Mode | Enable or disable delete mode |
| `engine.editor.getVectorEditDeleteMode()` | Mode | Query delete mode state |
| `engine.editor.hasSelectedVectorNode()` | Selection | Check if an anchor is selected |
| `engine.editor.addVectorNode()` | Edit | Insert anchor at segment midpoint |
| `engine.editor.deleteVectorNode()` | Edit | Remove selected anchor |
| `engine.editor.toggleSelectedVectorNodeSmooth()` | Edit | Toggle smooth/sharp anchor |
| `engine.editor.setSelectedVectorNodeMirrorMode(mode)` | Edit | Set handle mirror behavior |
| `engine.editor.getSelectedVectorNodeMirrorMode()` | Edit | Query handle mirror mode |



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support