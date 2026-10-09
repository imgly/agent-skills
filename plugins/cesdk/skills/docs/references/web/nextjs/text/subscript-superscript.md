> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Subscript and Superscript](./text/subscript-superscript.md)

---

Format ranges of text as subscript or superscript for prices, formulas, footnotes, and technical notation.

![Subscript and superscript demonstration showing a price with raised cents, a chemical formula, and an exponent](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-1.85.0-nightly.20261009.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-1.85.0-nightly.20261009/guides-text-subscript-superscript-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v1.85.0-nightly.20261009/guides-text-subscript-superscript-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.85.0-nightly.20261009/examples/guides-text-subscript-superscript-browser/index.html)

CE.SDK formats superscript and subscript synthetically: the affected range is scaled down to 58.3% of its font size and shifted up or down by 33.3% of the unscaled font size. These defaults match common design applications, so the feature works with every font, and block properties let you adjust the scale and shift. Lines grow automatically when a shifted range needs more room, and exports include the shifted glyphs. Superscript and subscript combine with text decorations, text on a path, and text animations.

```typescript file=@cesdk_web_examples/guides-text-subscript-superscript-browser/browser.ts reference-only
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
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Subscript and Superscript Guide
 *
 * Demonstrates subscript and superscript text formatting:
 * - Applying superscript and subscript to character ranges
 * - Querying the script styles of a range
 * - Reading the script style of each text run
 * - Resetting text back to normal
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

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
    const page = engine.block.findByType('page')[0];

    // Create a text block to demonstrate subscript and superscript
    const text = engine.block.create('text');
    engine.block.appendChild(page, text);
    engine.block.setPositionX(text, 100);
    engine.block.setPositionY(text, 100);
    engine.block.setWidthMode(text, 'Auto');
    engine.block.setHeightMode(text, 'Auto');
    engine.block.setFloat(text, 'text/fontSize', 64);
    engine.block.replaceText(text, '$1999 H2O E=mc2');

    // Raise the cents of the price above the rest of the line, using UTF-16 indices.
    // Superscript text is scaled down and raised automatically.
    engine.block.setTextScriptStyle(text, 'Superscript', 3, 5);

    // Raise the exponent of the formula
    engine.block.setTextScriptStyle(text, 'Superscript', 14, 15);

    // Lower the "2" of the water formula below the rest of the line
    engine.block.setTextScriptStyle(text, 'Subscript', 7, 8);

    // Query the unique script styles in a range, in document order
    const scriptStyles = engine.block.getTextScriptStyles(text);
    // e.g. ['Normal', 'Superscript', 'Subscript']

    // Query a specific range
    const centsScriptStyle = engine.block.getTextScriptStyles(text, 3, 5);
    // ['Superscript']

    // Each text run reports its script style
    const runs = engine.block.getTextRuns(text);
    // e.g. runs[1].scriptStyle === 'Superscript'

    // Adjust the size and position of shifted text for the whole block.
    // The scale is a factor of the font size. The shift is a fraction of
    // the unscaled font size.
    engine.block.setFloat(text, 'text/superscriptFontScale', 0.65);
    engine.block.setFloat(text, 'text/superscriptVerticalShift', 0.4);
    engine.block.setFloat(text, 'text/subscriptFontScale', 0.65);
    engine.block.setFloat(text, 'text/subscriptVerticalShift', 0.25);

    // Reset a range back to regular text
    engine.block.setTextScriptStyle(text, 'Superscript', 0, 1);
    engine.block.setTextScriptStyle(text, 'Normal', 0, 1);

    // Select the text block to show it in the inspector
    engine.block.setSelected(text, true);

    // Suppress unused variable warnings
    void scriptStyles;
    void centsScriptStyle;
    void runs;
  }
}

export default Example;
```

This guide covers applying superscript and subscript to character ranges, querying the current script styles, reading the script style of each text run, and resetting text back to normal.

## Create a Text Block

We create a text block whose content mixes a price, a chemical formula, and a mathematical expression.

```typescript highlight-create-text-block
// Create a text block to demonstrate subscript and superscript
const text = engine.block.create('text');
engine.block.appendChild(page, text);
engine.block.setPositionX(text, 100);
engine.block.setPositionY(text, 100);
engine.block.setWidthMode(text, 'Auto');
engine.block.setHeightMode(text, 'Auto');
engine.block.setFloat(text, 'text/fontSize', 64);
engine.block.replaceText(text, '$1999 H2O E=mc2');
```

## Apply Superscript

We raise a range above the rest of the line using `engine.block.setTextScriptStyle()` with `'Superscript'` and UTF-16 indices `[from, to)`. Without a range, the whole text or the current selection is changed.

```typescript highlight-superscript
    // Raise the cents of the price above the rest of the line, using UTF-16 indices.
    // Superscript text is scaled down and raised automatically.
    engine.block.setTextScriptStyle(text, 'Superscript', 3, 5);

    // Raise the exponent of the formula
    engine.block.setTextScriptStyle(text, 'Superscript', 14, 15);
```

## Apply Subscript

We lower a range below the rest of the line with `'Subscript'`.

```typescript highlight-subscript
// Lower the "2" of the water formula below the rest of the line
engine.block.setTextScriptStyle(text, 'Subscript', 7, 8);
```

## Query Script Styles

We query the script styles using `engine.block.getTextScriptStyles()`. It returns the ordered list of unique values in the range: `'Normal'`, `'Superscript'`, or `'Subscript'`.

```typescript highlight-query-scriptStyles
    // Query the unique script styles in a range, in document order
    const scriptStyles = engine.block.getTextScriptStyles(text);
    // e.g. ['Normal', 'Superscript', 'Subscript']

    // Query a specific range
    const centsScriptStyle = engine.block.getTextScriptStyles(text, 3, 5);
    // ['Superscript']
```

## Text Runs

Each entry returned by `engine.block.getTextRuns()` reports the `scriptStyle` of that run alongside its other formatting properties.

```typescript highlight-text-runs
// Each text run reports its script style
const runs = engine.block.getTextRuns(text);
// e.g. runs[1].scriptStyle === 'Superscript'
```

## Adjust Size and Position

Four block properties control how superscript and subscript are rendered. The font scale is a factor of the font size, the vertical shift is a fraction of the unscaled font size. The properties apply to all shifted ranges in the block.

```typescript highlight-adjust
// Adjust the size and position of shifted text for the whole block.
// The scale is a factor of the font size. The shift is a fraction of
// the unscaled font size.
engine.block.setFloat(text, 'text/superscriptFontScale', 0.65);
engine.block.setFloat(text, 'text/superscriptVerticalShift', 0.4);
engine.block.setFloat(text, 'text/subscriptFontScale', 0.65);
engine.block.setFloat(text, 'text/subscriptVerticalShift', 0.25);
```

## Reset to Normal

We reset a range back to regular text with `'Normal'`.

```typescript highlight-reset
// Reset a range back to regular text
engine.block.setTextScriptStyle(text, 'Superscript', 0, 1);
engine.block.setTextScriptStyle(text, 'Normal', 0, 1);
```

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.setTextScriptStyle()` | Set the script style for entire text or range |
| `engine.block.getTextScriptStyles()` | Get ordered list of unique script styles in range |
| `engine.block.getTextRuns()` | Read the `scriptStyle` of each text run |
| `text/superscriptFontScale` | Font scale of superscript text, default `0.583` |
| `text/superscriptVerticalShift` | Upward shift of superscript text, default `0.333` |
| `text/subscriptFontScale` | Font scale of subscript text, default `0.583` |
| `text/subscriptVerticalShift` | Downward shift of subscript text, default `0.333` |

## Troubleshooting

**Shifted text looks too small**: Raise `text/superscriptFontScale` or `text/subscriptFontScale` with `engine.block.setFloat()`, or increase the font size of the range with `engine.block.setTextFontSize()`.

**Lines move apart after applying superscript**: This is intended. A line grows when a raised or lowered range needs more room, so shifted glyphs do not overlap neighboring lines.



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support