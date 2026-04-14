> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Enable and configure grid overlays, snap-to-grid behavior, and canvas rulers so users can position and align elements with precision in your CE.SDK editor.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-grid-and-rulers-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-grid-and-rulers-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-grid-and-rulers-browser/)

CE.SDK provides a configurable grid overlay and canvas rulers to help users align design elements. The grid renders evenly spaced lines across the page, and snap-to-grid constrains element movement to grid intersections. Rulers display along the top and left edges of the canvas showing measurement units.

```typescript file=@cesdk_web_examples/guides-grid-and-rulers-browser/browser.ts reference-only
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
import { AdvancedEditorConfig } from './advanced-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Grid & Rulers Guide
 *
 * Demonstrates how to configure grid overlay, snap-to-grid,
 * and canvas rulers for precise element alignment.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new AdvancedEditorConfig());

    // Add asset source plugins
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

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Show the grid overlay on the canvas
    engine.editor.setSettingBool('grid/enabled', true);

    // Enable snapping so elements align to grid lines
    engine.editor.setSettingBool('grid/snapEnabled', true);

    // Set horizontal and vertical grid spacing in design units
    engine.editor.setSettingFloat('grid/spacingX', 20);
    engine.editor.setSettingFloat('grid/spacingY', 20);

    // Set a custom grid color with transparency
    engine.editor.setSettingColor('grid/color', {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 0.3
    });

    // Rulers are controlled through the editor's UI store.
    // The AdvancedEditorConfig plugin enables the 'ly.img.rulers'
    // feature flag, which makes rulers available in the UI.
    // Rulers are visible by default when the feature flag is enabled.

    // Add a sample block so the grid and rulers are visible in context
    const page = engine.block.findByType('page')[0];
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setFill(block, engine.block.createFill('color'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 100);
    engine.block.setPositionY(block, 100);
    engine.block.appendChild(page, block);

    console.log('Grid & Rulers guide initialized.');
  }
}

export default Example;
```

## Enable the Grid

Toggle the grid overlay using the `grid/enabled` setting. When enabled, the engine draws a grid of lines across each page based on the configured spacing and color.

```typescript highlight=highlight-enable-grid
// Show the grid overlay on the canvas
engine.editor.setSettingBool('grid/enabled', true);
```

The grid is a visual aid rendered at the engine level. It does not affect the scene content or export output.

## Enable Snap-to-Grid

Snap-to-grid constrains element movement so blocks align to grid lines. Enable it with the `grid/snapEnabled` setting.

```typescript highlight=highlight-snap-to-grid
// Enable snapping so elements align to grid lines
engine.editor.setSettingBool('grid/snapEnabled', true);
```

When snap-to-grid is active, dragging or resizing a block snaps its edges to the nearest grid line. This works independently of the grid overlay visibility, so you can snap to an invisible grid if needed.

## Configure Grid Spacing

Set the horizontal and vertical distance between grid lines using `grid/spacingX` and `grid/spacingY`. Values are in design units (the unit configured for the scene).

```typescript highlight=highlight-grid-spacing
// Set horizontal and vertical grid spacing in design units
engine.editor.setSettingFloat('grid/spacingX', 20);
engine.editor.setSettingFloat('grid/spacingY', 20);
```

Smaller spacing values produce a finer grid. The default spacing is 32 design units in both directions.

## Configure Grid Color

Change the grid line color using `grid/color`. The color supports an alpha channel, so you can make the grid more or less prominent.

```typescript highlight=highlight-grid-color
// Set a custom grid color with transparency
engine.editor.setSettingColor('grid/color', {
  r: 0.2,
  g: 0.4,
  b: 0.8,
  a: 0.3
});
```

## Enable Rulers

Rulers are managed through the `ly.img.rulers` feature flag and the editor's UI store. The Advanced Editor and Video Editor plugins enable rulers by default.

```typescript highlight=highlight-enable-rulers
// Rulers are controlled through the editor's UI store.
// The AdvancedEditorConfig plugin enables the 'ly.img.rulers'
// feature flag, which makes rulers available in the UI.
// Rulers are visible by default when the feature flag is enabled.
```

Rulers display along the top and left edges of the canvas. They show tick marks and labels in the scene's design unit, and they update as the user pans and zooms.

## Editor Plugin Defaults

Different editor plugins configure grid and rulers with different defaults:

| Plugin | Grid Visible | Snap-to-Grid | Rulers |
|--------|-------------|--------------|--------|
| Advanced Editor | Yes | Yes | Yes |
| Video Editor | Yes | Yes | Yes |
| Design Editor | No | No | No |
| Photo Editor | No | No | No |

To add grid and ruler support to an editor that doesn't enable them by default, set the settings and feature flag manually as shown in the examples above.

## API Reference

| API | Type | Default | Description |
|-----|------|---------|-------------|
| `grid/enabled` | Bool | `false` | Show or hide the grid overlay |
| `grid/snapEnabled` | Bool | `false` | Enable snapping to grid lines |
| `grid/spacingX` | Float | `32` | Horizontal spacing between grid lines (design units) |
| `grid/spacingY` | Float | `32` | Vertical spacing between grid lines (design units) |
| `grid/color` | Color | `{ r: 0, g: 0, b: 0, a: 0.12 }` | Grid line color with alpha |



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support