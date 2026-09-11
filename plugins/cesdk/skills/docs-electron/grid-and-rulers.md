> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-grid-and-rulers-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-grid-and-rulers-browser/)

CE.SDK provides a configurable grid overlay and canvas rulers to help users align design elements. The grid renders evenly spaced lines across the page, and snap-to-grid constrains element movement to grid intersections. Rulers display along the top and left edges of the canvas showing measurement units.

```typescript file=@cesdk_web_examples/guides-grid-and-rulers-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
import { AdvancedEditorConfig } from '@cesdk/core-configs-web/advanced-editor';
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
    await cesdk.addPlugin(new ImageColorsAssetSource());
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

## Per-Page Grid Overrides

Each page in the scene can override the document-level grid configuration through the `page/guides/*` block properties. Setting `page/guides/source` to `'Custom'` switches that page onto its own values; leaving it at `'Document'` keeps the page on the engine-wide defaults. Ruler visibility remains document-level only — there is no per-page ruler override.

Per-page grids are **session-only** — they are not persisted when the scene is saved. Opening the scene again starts every page back on the document-level grid.

```typescript
// Opt a specific page into its own grid configuration.
engine.block.setEnum(pageId, 'page/guides/source', 'Custom');
engine.block.setBool(pageId, 'page/guides/gridEnabled', true);
engine.block.setFloat(pageId, 'page/guides/gridSpacingX', 20);
engine.block.setFloat(pageId, 'page/guides/gridSpacingY', 20);
engine.block.setColor(pageId, 'page/guides/gridColor', {
  colorSpace: 'sRGB',
  r: 0.2,
  g: 0.4,
  b: 0.9,
  a: 0.5
});
engine.block.setBool(pageId, 'page/guides/gridSnapEnabled', true);

// Revert the page to the document defaults.
engine.block.setEnum(pageId, 'page/guides/source', 'Document');
```

In the default Advanced Editor UI, grid controls live only in the Page Inspector — selecting a page shows a "Grid" section that writes to that page's `page/guides/*` properties. The Document Inspector exposes only the "Show Rulers" toggle; the global `grid/*` settings are still used as the fallback for pages in `Document` mode, but have no UI of their own. When users add a new page, the editor seeds its grid from the immediately previous page when that page is in `Custom` mode, so the grid they were just working with carries over without re-entry. If the previous page is in `Document` mode, the new page also uses `Document` — new pages never revive older per-page overrides.

## API Reference

| API | Type | Default | Description |
|-----|------|---------|-------------|
| `grid/enabled` | Bool | `false` | Show or hide the grid overlay |
| `grid/snapEnabled` | Bool | `false` | Enable snapping to grid lines |
| `grid/spacingX` | Float | `32` | Horizontal spacing between grid lines (design units) |
| `grid/spacingY` | Float | `32` | Vertical spacing between grid lines (design units) |
| `grid/color` | Color | `{ r: 0, g: 0, b: 0, a: 0.12 }` | Grid line color with alpha |
| `page/guides/source` | Enum (`'Document'` / `'Custom'`) | `'Document'` | Per-page resolution source; `Document` falls back to the `grid/*` settings |
| `page/guides/gridEnabled` | Bool | `false` | Per-page override of `grid/enabled` (applied when source is `Custom`) |
| `page/guides/gridSnapEnabled` | Bool | `false` | Per-page override of `grid/snapEnabled` |
| `page/guides/gridSpacingX` | Float | `10` | Per-page override of `grid/spacingX` |
| `page/guides/gridSpacingY` | Float | `10` | Per-page override of `grid/spacingY` |
| `page/guides/gridColor` | Color | neutral gray | Per-page override of `grid/color` |



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support