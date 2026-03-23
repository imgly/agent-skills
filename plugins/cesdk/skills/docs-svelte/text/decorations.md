> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Text Decorations](./text/decorations.md)

---

Add underline, strikethrough, and overline decorations to text blocks with configurable styles, colors, and thickness.

![Text decorations demonstration showing underline, strikethrough, and overline styles](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-decorations-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-text-decorations-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-text-decorations-browser/)

CE.SDK supports three types of text decorations: underline, strikethrough, and overline. We can toggle decorations on and off, customize them with different line styles, and apply them to specific character ranges. All active decoration lines share the same style and thickness settings.

```typescript file=@cesdk_web_examples/guides-text-decorations-browser/browser.ts reference-only
import type { EditorPlugin,EditorPluginContext } from "@cesdk/cesdk-js";

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
import packageJson from "./package.json";

/**
 * CE.SDK Plugin: Text Decorations Guide
 *
 * Demonstrates text decoration capabilities:
 * - Toggling underline, strikethrough, and overline
 * - Querying current decorations
 * - Setting custom decoration styles, colors, and thickness
 * - Applying decorations to character ranges
 * - Combining multiple decoration types
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error("CE.SDK instance is required for this plugin");
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ["ly.img.image.upload"] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          "ly.img.templates.blank.*",
          "ly.img.templates.presentation.*",
          "ly.img.templates.print.*",
          "ly.img.templates.social.*",
          "ly.img.image.*",
        ],
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

    await cesdk.actions.run("scene.create", {
      page: { width: 800, height: 600, unit: "Pixel" },
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType("page")[0];

    // Create a text block to demonstrate decorations
    const text = engine.block.create("text");
    engine.block.appendChild(page, text);
    engine.block.setPositionX(text, 100);
    engine.block.setPositionY(text, 100);
    engine.block.setWidthMode(text, "Auto");
    engine.block.setHeightMode(text, "Auto");
    engine.block.replaceText(text, "Hello CE.SDK");

    // Toggle underline on the entire text
    engine.block.toggleTextDecorationUnderline(text);

    // Toggle strikethrough on the entire text
    engine.block.toggleTextDecorationStrikethrough(text);

    // Toggle overline on the entire text
    engine.block.toggleTextDecorationOverline(text);

    // Calling toggle again removes the decoration
    engine.block.toggleTextDecorationOverline(text);
    // Query the current decoration configurations
    // Returns a list of unique TextDecorationConfig objects in the range
    const decorations = engine.block.getTextDecorations(text);
    // Each config contains: lines, style, underlineColor, underlineThickness, underlineOffset, skipInk

    // Set a specific decoration style
    // Available styles: 'Solid', 'Double', 'Dotted', 'Dashed', 'Wavy'
    engine.block.setTextDecoration(text, {
      lines: ["Underline"],
      style: "Dashed",
    });

    // Set a custom underline color (only applies to underlines)
    // Strikethrough and overline always use the text color
    engine.block.setTextDecoration(text, {
      lines: ["Underline"],
      underlineColor: { r: 1, g: 0, b: 0, a: 1 },
    });

    // Adjust the underline thickness
    // Default is 1.0, values above 1.0 make the line thicker
    engine.block.setTextDecoration(text, {
      lines: ["Underline"],
      underlineThickness: 2.0,
    });

    // Adjust the underline position relative to the font default
    // 0 = font default, positive values move further from baseline, negative values move closer
    engine.block.setTextDecoration(text, {
      lines: ["Underline"],
      underlineOffset: 0.1,
    });

    // Apply decorations to a specific character range using UTF-16 indices
    // Toggle underline on characters 0-5 ("Hello")
    engine.block.toggleTextDecorationUnderline(text, 0, 5);

    // Set strikethrough on characters 6-12 ("CE.SDK")
    engine.block.setTextDecoration(text, { lines: ["Strikethrough"] }, 6, 12);

    // Query decorations in a specific range
    const subrangeDecorations = engine.block.getTextDecorations(text, 0, 5);

    // Combine multiple decoration lines on the same text
    // All active lines share the same style and thickness
    engine.block.setTextDecoration(text, {
      lines: ["Underline", "Strikethrough"],
      style: "Solid",
    });

    // Remove all decorations
    engine.block.setTextDecoration(text, { lines: ["None"] });

    // Select the text block to show it in the inspector
    engine.block.setSelected(text, true);

    // Suppress unused variable warnings
    void decorations;
    void subrangeDecorations;
  }
}

export default Example;
```

This guide covers toggling decorations, querying current state, setting custom styles, adjusting color and thickness, and applying decorations to character subranges.

## Toggle Decorations

We toggle decorations using `engine.block.toggleTextDecorationUnderline()`, `engine.block.toggleTextDecorationStrikethrough()`, and `engine.block.toggleTextDecorationOverline()`. If all characters in the range already have the decoration, it is removed; otherwise, it is added to all.

```typescript highlight-toggle-decorations
    // Toggle underline on the entire text
    engine.block.toggleTextDecorationUnderline(text);

    // Toggle strikethrough on the entire text
    engine.block.toggleTextDecorationStrikethrough(text);

    // Toggle overline on the entire text
    engine.block.toggleTextDecorationOverline(text);

    // Calling toggle again removes the decoration
    engine.block.toggleTextDecorationOverline(text);
```

## Query Decorations

We query the current decorations using `engine.block.getTextDecorations()`. It returns an ordered list of unique `TextDecorationConfig` objects. Each config includes the active lines, style, optional underline color, thickness multiplier, underline offset, and skip-ink setting.

```typescript highlight-query-decorations
// Query the current decoration configurations
// Returns a list of unique TextDecorationConfig objects in the range
const decorations = engine.block.getTextDecorations(text);
// Each config contains: lines, style, underlineColor, underlineThickness, underlineOffset, skipInk
```

## Custom Decoration Styles

We set a specific decoration style using `engine.block.setTextDecoration()` with a `TextDecorationConfig`. Available styles are `'Solid'` (default), `'Double'`, `'Dotted'`, `'Dashed'`, and `'Wavy'`.

```typescript highlight-custom-style
// Set a specific decoration style
// Available styles: 'Solid', 'Double', 'Dotted', 'Dashed', 'Wavy'
engine.block.setTextDecoration(text, {
  lines: ["Underline"],
  style: "Dashed",
});
```

## Underline Color

We set a custom underline color that differs from the text color. The `underlineColor` property only applies to underlines; strikethrough and overline always use the text color.

```typescript highlight-underline-color
// Set a custom underline color (only applies to underlines)
// Strikethrough and overline always use the text color
engine.block.setTextDecoration(text, {
  lines: ["Underline"],
  underlineColor: { r: 1, g: 0, b: 0, a: 1 },
});
```

## Decoration Thickness

We adjust the underline thickness using the `underlineThickness` property. The default is `1.0`. Values above `1.0` make the underline thicker.

```typescript highlight-thickness
// Adjust the underline thickness
// Default is 1.0, values above 1.0 make the line thicker
engine.block.setTextDecoration(text, {
  lines: ["Underline"],
  underlineThickness: 2.0,
});
```

## Underline Offset

We adjust the underline position using the `underlineOffset` property, which acts as a relative multiplier on the font-default distance. The actual position is computed as `fontDefault * (1 + underlineOffset)`. The default is `0`, which uses the font's default underline position. Positive values move the underline proportionally further from the baseline, negative values move it proportionally closer.

```typescript highlight-offset
// Adjust the underline position relative to the font default
// 0 = font default, positive values move further from baseline, negative values move closer
engine.block.setTextDecoration(text, {
  lines: ["Underline"],
  underlineOffset: 0.1,
});
```

## Subrange Decorations

We apply decorations to specific character ranges using UTF-16 indices `[from, to)`. Both toggle and set operations accept range parameters.

```typescript highlight-subrange
    // Apply decorations to a specific character range using UTF-16 indices
    // Toggle underline on characters 0-5 ("Hello")
    engine.block.toggleTextDecorationUnderline(text, 0, 5);

    // Set strikethrough on characters 6-12 ("CE.SDK")
    engine.block.setTextDecoration(text, { lines: ["Strikethrough"] }, 6, 12);

    // Query decorations in a specific range
    const subrangeDecorations = engine.block.getTextDecorations(text, 0, 5);
```

## Combine Decorations

We combine multiple decoration types by passing an array of lines to `setTextDecoration()`. All active lines share the same style and thickness.

```typescript highlight-combine
// Combine multiple decoration lines on the same text
// All active lines share the same style and thickness
engine.block.setTextDecoration(text, {
  lines: ["Underline", "Strikethrough"],
  style: "Solid",
});
```

## Remove Decorations

We remove all decorations by setting the lines to `['None']`.

```typescript highlight-remove
// Remove all decorations
engine.block.setTextDecoration(text, { lines: ["None"] });
```

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.toggleTextDecorationUnderline()` | Toggle underline on entire text or range |
| `engine.block.toggleTextDecorationStrikethrough()` | Toggle strikethrough on entire text or range |
| `engine.block.toggleTextDecorationOverline()` | Toggle overline on entire text or range |
| `engine.block.getTextDecorations()` | Get ordered list of decoration configs in range |
| `engine.block.setTextDecoration()` | Set decoration config for entire text or range |

## Troubleshooting

**Decoration not visible**: Ensure the text block has content and the decoration lines are not set to `'None'`.

**Underline color not changing**: The `underlineColor` property only applies to underlines. Strikethrough and overline always use the text color.

**Toggle not adding decoration**: If all characters in the range already have the decoration, toggle removes it instead of adding it.



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support