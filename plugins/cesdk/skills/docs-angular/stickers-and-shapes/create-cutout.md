> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Stickers](./stickers.md) > [Create Cutout](./stickers-and-shapes/create-cutout.md)

---

Create cutout paths for cutting printers to produce die-cut stickers, iron-on decals, and custom-shaped prints programmatically.

![Cutout paths demonstration showing circular and square cutouts combined](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-create-cutout-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-stickers-and-shapes-create-cutout-browser)
>
> - [Live demo](https://img.ly/examples/guides-stickers-and-shapes-create-cutout-browser/)

Cutouts define outline paths that cutting printers cut with a blade rather than print with ink. CE.SDK supports creating cutouts from SVG paths, generating them from block contours, and combining them with boolean operations.

```typescript file=@cesdk_web_examples/guides-stickers-and-shapes-create-cutout-browser/browser.ts reference-only
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
import CutoutLibraryPlugin from '@imgly/plugin-cutout-library-web';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene
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

    // Add cutout library plugin for UI-based cutout creation
    await cesdk.addPlugin(
      CutoutLibraryPlugin({
        ui: { locations: ['canvasMenu'] }
      })
    );

    // Add cutout library to dock as the last entry
    const cutoutAssetEntry = cesdk.ui.getAssetLibraryEntry(
      'ly.img.cutout.entry'
    );
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui
        .getComponentOrder({ in: 'ly.img.dock' })
        .filter(({ key }) => key !== 'ly.img.template'),
      {
        id: 'ly.img.assetLibrary.dock',
        label: 'Cutouts',
        key: 'ly.img.assetLibrary.dock',
        icon: cutoutAssetEntry?.icon,
        entries: ['ly.img.cutout.entry']
      }
    ]);

    // Open cutout library panel on startup
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.cutout.entry']
      }
    });

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create a circular cutout from SVG path (scaled up for visibility)
    const circle = engine.block.createCutoutFromPath(
      'M 0,75 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0 Z'
    );
    engine.block.appendChild(page, circle);
    engine.block.setPositionX(circle, 200);
    engine.block.setPositionY(circle, 225);

    // Set cutout type to Dashed for perforated cut line
    engine.block.setEnum(circle, 'cutout/type', 'Dashed');

    // Set cutout offset distance from source path
    engine.block.setFloat(circle, 'cutout/offset', 5.0);

    // Create a square cutout with solid type (scaled up for visibility)
    const square = engine.block.createCutoutFromPath('M 0,0 H 150 V 150 H 0 Z');
    engine.block.appendChild(page, square);
    engine.block.setPositionX(square, 450);
    engine.block.setPositionY(square, 225);
    engine.block.setFloat(square, 'cutout/offset', 8.0);

    // Combine cutouts using Union operation
    const combined = engine.block.createCutoutFromOperation(
      [circle, square],
      'Union'
    );
    engine.block.appendChild(page, combined);
    engine.block.setPositionX(combined, 200);
    engine.block.setPositionY(combined, 225);

    // Destroy original cutouts to avoid duplicate cuts
    engine.block.destroy(circle);
    engine.block.destroy(square);

    // Customize spot color RGB for rendering (bright blue for visibility)
    engine.editor.setSpotColorRGB('CutContour', 0.0, 0.4, 0.9);

    // Zoom to fit all cutouts
    await engine.scene.zoomToBlock(page, { padding: 40 });
  }
}

export default Example;
```

This guide covers creating cutouts programmatically from SVG paths, configuring cutout types and offsets, combining cutouts with boolean operations, customizing spot colors for printer compatibility, and integrating the cutout library plugin for interactive creation.

## Understanding Cutouts

Cutouts are special blocks that contain SVG paths interpreted by cutting printers as cut lines. Printers recognize cutouts through specially named spot colors: `CutContour` for solid continuous cuts and `PerfCutContour` for dashed perforated cuts.

The spot color RGB values affect on-screen rendering but not printer behavior. By default, solid cutouts render as magenta and dashed cutouts render as green.

> **Note:** Cutouts export to PDF format with spot color information preserved. Cutting printers read the spot colors to identify cut paths.

## Creating Cutouts from SVG Paths

Create cutouts using `engine.block.createCutoutFromPath(path)` with standard SVG path syntax. The path coordinates define the cutout dimensions.

```typescript highlight-create-cutout-from-path
// Create a circular cutout from SVG path (scaled up for visibility)
const circle = engine.block.createCutoutFromPath(
  'M 0,75 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0 Z'
);
engine.block.appendChild(page, circle);
engine.block.setPositionX(circle, 200);
engine.block.setPositionY(circle, 225);
```

The method accepts standard SVG path commands: `M` (move), `L` (line), `H` (horizontal), `V` (vertical), `C` (cubic curve), `Q` (quadratic curve), `A` (arc), and `Z` (close path).

## Configuring Cutout Type

Set the cutout type using `engine.block.setEnum()` to control whether the printer creates a continuous or perforated cut line.

```typescript highlight-configure-cutout-type
// Set cutout type to Dashed for perforated cut line
engine.block.setEnum(circle, 'cutout/type', 'Dashed');
```

`Solid` creates a continuous cutting line (default), while `Dashed` creates a perforated cutting line for tear-away edges.

## Configuring Cutout Offset

Adjust the distance between the cutout line and the source path using `engine.block.setFloat()`.

```typescript highlight-configure-cutout-offset
// Set cutout offset distance from source path
engine.block.setFloat(circle, 'cutout/offset', 5.0);
```

Positive offset values expand the cutout outward from the path. Use offset to add bleed or margin around designs for cleaner cuts.

## Creating Multiple Cutouts

Create additional cutouts with different properties to demonstrate various shapes and configurations.

```typescript highlight-create-square-cutout
// Create a square cutout with solid type (scaled up for visibility)
const square = engine.block.createCutoutFromPath('M 0,0 H 150 V 150 H 0 Z');
engine.block.appendChild(page, square);
engine.block.setPositionX(square, 450);
engine.block.setPositionY(square, 225);
engine.block.setFloat(square, 'cutout/offset', 8.0);
```

Each cutout can have independent type and offset settings based on your production requirements.

## Combining Cutouts with Boolean Operations

Combine multiple cutouts into compound shapes using `engine.block.createCutoutFromOperation(ids, operation)`. Available operations are `Union`, `Difference`, `Intersection`, and `XOR`.

```typescript highlight-combine-cutouts
    // Combine cutouts using Union operation
    const combined = engine.block.createCutoutFromOperation(
      [circle, square],
      'Union'
    );
    engine.block.appendChild(page, combined);
    engine.block.setPositionX(combined, 200);
    engine.block.setPositionY(combined, 225);

    // Destroy original cutouts to avoid duplicate cuts
    engine.block.destroy(circle);
    engine.block.destroy(square);
```

The combined cutout inherits the type from the first cutout in the array and has an offset of 0. Destroy the original cutouts after combining to avoid duplicate cuts.

> **Note:** When using `Difference`, the first cutout is the base that others subtract from. For other operations, the order affects which cutout's type is inherited.

## Customizing Spot Colors

Modify the spot color RGB approximation using `engine.editor.setSpotColorRGB()` to change how cutouts render without affecting printer behavior.

```typescript highlight-customize-spot-color
// Customize spot color RGB for rendering (bright blue for visibility)
engine.editor.setSpotColorRGB('CutContour', 0.0, 0.4, 0.9);
```

Spot color names (`CutContour`, `PerfCutContour`) are what printers recognize. Adjust the names if your printer uses different conventions.

## Using the Cutout Library Plugin

The `@imgly/plugin-cutout-library-web` plugin provides an interactive UI for creating cutouts directly in the editor. Users can add rectangular or elliptical cutouts from the asset library dock, or generate cutouts from selected shapes via the canvas menu.

Install the plugin:

<Tabs syncKey="package-manager">
  <TabItem label="npm">
    ```bash
    npm install @imgly/plugin-cutout-library-web

    ```
  </TabItem>

  <TabItem label="yarn">
    ```bash
    yarn add @imgly/plugin-cutout-library-web

    ```
  </TabItem>

  <TabItem label="pnpm">
    ```bash
    pnpm add @imgly/plugin-cutout-library-web

    ```
  </TabItem>
</Tabs>

Import and register the plugin:

```typescript highlight-plugin-import
import CutoutLibraryPlugin from '@imgly/plugin-cutout-library-web';
```

Add the plugin to your editor instance with canvas menu support:

```typescript highlight-plugin-add
// Add cutout library plugin for UI-based cutout creation
await cesdk.addPlugin(
  CutoutLibraryPlugin({
    ui: { locations: ['canvasMenu'] }
  })
);
```

Configure the dock to display the cutout library and open it by default:

```typescript highlight-dock-config
    // Add cutout library to dock as the last entry
    const cutoutAssetEntry = cesdk.ui.getAssetLibraryEntry(
      'ly.img.cutout.entry'
    );
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui
        .getComponentOrder({ in: 'ly.img.dock' })
        .filter(({ key }) => key !== 'ly.img.template'),
      {
        id: 'ly.img.assetLibrary.dock',
        label: 'Cutouts',
        key: 'ly.img.assetLibrary.dock',
        icon: cutoutAssetEntry?.icon,
        entries: ['ly.img.cutout.entry']
      }
    ]);

    // Open cutout library panel on startup
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.cutout.entry']
      }
    });
```

The `setComponentOrder` method adds a "Cutouts" entry to the dock panel with the plugin's icon. The `openPanel` call displays the cutout library immediately when the editor loads, giving users instant access to cutout creation tools.

> **Note:** The plugin provides three cutout options: generate from selection (creates cutout from selected blocks), rectangle, and circle. The canvas menu button appears when blocks are selected for quick cutout generation.

## Troubleshooting

### Cutout Not Visible

Cutouts render using spot color RGB approximations. Verify the cutout is appended to the page hierarchy and positioned within the visible canvas area.

### Printer Not Cutting

Check that spot color names match your printer's requirements. Some printers need specific names like `CutContour` or `Thru-cut`. Consult your printer documentation.

### Combined Cutout Has Wrong Type

Combined cutouts inherit the type from the first cutout in the array. Reorder the array or set the type explicitly after combination.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `cesdk.addPlugin(CutoutLibraryPlugin(config))` | Plugin | Register cutout library plugin |
| `cesdk.ui.getAssetLibraryEntry(id)` | UI | Get asset library entry for dock |
| `cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, entries)` | UI | Configure dock panel order |
| `cesdk.ui.openPanel(id, options)` | UI | Open panel programmatically |
| `engine.block.createCutoutFromPath(path)` | Cutout | Create cutout from SVG path string |
| `engine.block.createCutoutFromBlocks(ids, vThresh, sThresh, useShape)` | Cutout | Create cutout from block contours |
| `engine.block.createCutoutFromOperation(ids, op)` | Cutout | Combine cutouts with boolean operation |
| `engine.block.setEnum(id, 'cutout/type', value)` | Property | Set cutout type (Solid/Dashed) |
| `engine.block.setFloat(id, 'cutout/offset', value)` | Property | Set cutout offset distance |
| `engine.block.setFloat(id, 'cutout/smoothing', value)` | Property | Set corner smoothing threshold |
| `engine.block.appendChild(parent, child)` | Hierarchy | Add cutout to scene |
| `engine.block.setPositionX/Y(id, value)` | Transform | Position cutout on canvas |
| `engine.block.destroy(id)` | Lifecycle | Remove cutout from scene |
| `engine.editor.setSpotColorRGB(name, r, g, b)` | Editor | Customize spot color rendering |

## Next Steps

- **[Combine Shapes](./stickers-and-shapes/combine.md)** - Boolean operations on graphic blocks
- **[Create Shapes](./stickers-and-shapes/create-edit/create-shapes.md)** - Create geometric shapes programmatically
- **[Export for Printing](./export-save-publish/for-printing.md)** - Export print-ready PDFs with spot colors



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support