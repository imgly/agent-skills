> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Font Size Unit](./concepts/font-size-unit.md)

---

Pick the unit your scene uses for `setTextFontSize` / `getTextFontSizes`.
The engine continues to store font sizes in points; this setting only
changes how values are interpreted at the API boundary, with optional
per-call overrides when you need them.

![A CE.SDK editor with a text block whose font size is being controlled by the scene's font-size unit](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-concepts-font-size-unit-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-font-size-unit-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-concepts-font-size-unit-browser/)

A scene's `fontSizeUnit` is the unit `setTextFontSize` and `getTextFontSizes` use when the caller doesn't specify one. CE.SDK supports two values: `'Point'` (the typographic default) and `'Pixel'` (matches Pixel-based design coordinates). The engine still stores font sizes in points internally; the unit only controls the API boundary.

```typescript file=@cesdk_web_examples/guides-concepts-font-size-unit-browser/browser.ts reference-only
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
  TextComponentAssetSource,
  TypefaceAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Font Size Unit Guide
 *
 * Demonstrates working with the scene's font-size unit:
 * - Reading the scene's current `fontSizeUnit`
 * - Switching the unit between `'Pixel'` and `'Point'` at runtime
 * - Setting and reading font sizes that follow the scene unit
 * - Overriding the unit on a per-call basis with `TextFontSizeOptions`
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins so the editor has its standard panels.
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new DemoAssetSources());
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());

    // Create a default Pixel-based design scene.
    await cesdk.actions.run('scene.create', {
      page: { width: 1080, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Read the scene's current font-size unit.
    // For a Pixel-based scene this defaults to 'Pixel'.
    const initialUnit = engine.scene.getFontSizeUnit();
    console.log('Initial font-size unit:', initialUnit); // 'Pixel'

    // Switch the scene-wide default to Point. Existing text keeps its visual
    // size; only the unit used by `setTextFontSize` / `getTextFontSizes`
    // (when no `unit` option is passed) changes.
    engine.scene.setFontSizeUnit('Point');
    console.log('After switch:', engine.scene.getFontSizeUnit()); // 'Point'

    // Add a text block to demonstrate how the unit flows through the text APIs.
    const page = engine.block.findByType('page')[0];
    const text = engine.block.create('text');
    engine.block.appendChild(page, text);
    engine.block.setString(text, 'text/text', 'Font Size Unit');
    engine.block.setPositionX(text, 80);
    engine.block.setPositionY(text, 480);
    engine.block.setWidth(text, 920);
    engine.block.setHeight(text, 120);

    // No `unit` option: the value is interpreted in the scene's `fontSizeUnit`,
    // which we set to 'Point' above. The engine reads this as 18 pt.
    engine.block.setTextFontSize(text, 18);

    // Override the unit for a single call. CE.SDK converts the supplied
    // value into the scene's unit using the scene's DPI, so the same text
    // can be sized in pixels even though the scene default is points.
    engine.block.setTextFontSize(text, 24, { unit: 'Pixel' });

    // Without `unit`, the returned values are in the scene's unit (Point).
    const sizesInSceneUnit = engine.block.getTextFontSizes(text);
    console.log('Sizes (scene unit, pt):', sizesInSceneUnit);

    // Pass `{ unit }` to read the same sizes in a different unit.
    const sizesInPixels = engine.block.getTextFontSizes(text, {
      unit: 'Pixel'
    });
    console.log('Sizes (px):', sizesInPixels);
  }
}

export default Example;
```

This guide covers reading and changing the scene's font-size unit, how that default flows through the text APIs, how to override the unit per call, and how to pair the unit with the design unit at scene creation.

## Reading the Current Font-Size Unit

Use `engine.scene.getFontSizeUnit()` to retrieve the unit the current scene uses for font size APIs. New scenes default to `'Pixel'` when `designUnit` is `'Pixel'`, and to `'Point'` for `'Millimeter'` or `'Inch'`. Loaded scenes from before the setting was introduced default to `'Point'` to preserve historic behavior.

```typescript highlight-get-font-size-unit
// Read the scene's current font-size unit.
// For a Pixel-based scene this defaults to 'Pixel'.
const initialUnit = engine.scene.getFontSizeUnit();
console.log('Initial font-size unit:', initialUnit); // 'Pixel'
```

## Setting the Font-Size Unit

`engine.scene.setFontSizeUnit('Point' | 'Pixel')` switches the scene-wide default. Existing text retains its visual size: the engine still stores values in points and converts on the way in and out. Only subsequent `setTextFontSize` / `getTextFontSizes` calls (without an explicit `unit` option) use the new unit.

```typescript highlight-set-font-size-unit
// Switch the scene-wide default to Point. Existing text keeps its visual
// size; only the unit used by `setTextFontSize` / `getTextFontSizes`
// (when no `unit` option is passed) changes.
engine.scene.setFontSizeUnit('Point');
console.log('After switch:', engine.scene.getFontSizeUnit()); // 'Point'
```

`setDesignUnit` does not change `fontSizeUnit`, so a deliberate font-unit choice survives changes to the design coordinate system.

## Setting Font Sizes Without a Unit Option

When you call `setTextFontSize(text, value)` without a `unit` option, the value is interpreted in the scene's `fontSizeUnit`. The same applies to the float properties `text/fontSize`, `caption/fontSize`, and the matching auto-min/max companions accessed through `setFloat` / `getFloat`.

```typescript highlight-implicit-set
// No `unit` option: the value is interpreted in the scene's `fontSizeUnit`,
// which we set to 'Point' above. The engine reads this as 18 pt.
engine.block.setTextFontSize(text, 18);
```

## Overriding the Unit Per Call

Pass `{ unit: 'Point' }` or `{ unit: 'Pixel' }` in `TextFontSizeOptions` to override the scene default for a single call. CE.SDK converts between the caller's unit and the scene's unit using the scene's DPI. Use this when your application has its own unit convention that differs from the scene's preference.

```typescript highlight-explicit-set
// Override the unit for a single call. CE.SDK converts the supplied
// value into the scene's unit using the scene's DPI, so the same text
// can be sized in pixels even though the scene default is points.
engine.block.setTextFontSize(text, 24, { unit: 'Pixel' });
```

## Reading Font Sizes

`getTextFontSizes` returns values in the scene's `fontSizeUnit` by default and accepts the same `{ unit }` override. The same conversion applies on the way out, so you can read the same text in either unit without changing the scene.

```typescript highlight-read-sizes
    // Without `unit`, the returned values are in the scene's unit (Point).
    const sizesInSceneUnit = engine.block.getTextFontSizes(text);
    console.log('Sizes (scene unit, pt):', sizesInSceneUnit);

    // Pass `{ unit }` to read the same sizes in a different unit.
    const sizesInPixels = engine.block.getTextFontSizes(text, {
      unit: 'Pixel'
    });
    console.log('Sizes (px):', sizesInPixels);
```

## Pairing Units at Scene Creation

`engine.scene.create('Free', { designUnit, fontSizeUnit })` accepts both options. When `fontSizeUnit` is omitted, CE.SDK pairs it with `designUnit` (`'Pixel'` ⇒ `'Pixel'`, `'Millimeter'` and `'Inch'` ⇒ `'Point'`). Pass both explicitly when you want to mix them, for example a Pixel design with Point-based typography.

```typescript
const pixelDesignPointFonts = engine.scene.create('Free', {
  designUnit: 'Pixel',
  fontSizeUnit: 'Point'
});
```

`engine.scene.createFromImage()` and `engine.scene.createFromVideo()` use a hardcoded `'Pixel'` design unit but leave `fontSizeUnit` at the default `'Point'` so existing callers keep point-based font sizes. Call `engine.scene.setFontSizeUnit('Pixel')` after creation if you want the font-size unit to match the pixel-based design coordinates.

## Next Steps

- [Design Units](./concepts/design-units.md) covers the broader unit system that determines layout coordinates and DPI.



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support