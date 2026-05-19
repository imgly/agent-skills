> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Text Enumerations](./text/enumerations.md)

---

Apply bullet lists and numbered lists to text blocks programmatically using per-paragraph list styles and nesting levels.

![CE.SDK editor showing a text block with three paragraphs selected, ready for list style formatting](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-text-enumerations-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-text-enumerations-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-text-enumerations-browser/)

CE.SDK represents list formatting as per-paragraph properties on a text block. Each paragraph independently holds a list style (`'None'`, `'Unordered'`, or `'Ordered'`) and a zero-based nesting level. A single call to `setTextListStyle()` targets either one paragraph or all paragraphs at once, making it straightforward to build structured lists without iterating manually.

```typescript file=@cesdk_web_examples/guides-text-enumerations-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from "@cesdk/cesdk-js";
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
  VectorShapeAssetSource,
} from "@cesdk/cesdk-js/plugins";
import { DesignEditorConfig } from "@cesdk/core-configs-web/design-editor";
import packageJson from "./package.json";

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error("CE.SDK instance is required for this plugin");
    }

    // DesignEditorConfig uses settings not yet in the published package when this guide
    // was authored. Guarded so the text block renders in both local and published contexts.
    try {
      await cesdk.addPlugin(new DesignEditorConfig());
    } catch {
      // noop — proceeds with asset sources and the enumeration example below
    }
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
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

    // Create a new design scene with an 800×600 canvas
    await cesdk.actions.run("scene.create", {
      page: { width: 800, height: 600, unit: "Pixel" },
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType("page")[0];

    // Create a text block and populate it with three paragraphs
    const textBlock = engine.block.create("text");
    engine.block.appendChild(page, textBlock);
    engine.block.replaceText(textBlock, "First item\nSecond item\nThird item");
    engine.block.setTextFontSize(textBlock, 36);
    engine.block.setWidthMode(textBlock, "Auto");
    engine.block.setHeightMode(textBlock, "Auto");
    engine.block.setPositionX(textBlock, 80);
    engine.block.setPositionY(textBlock, 80);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const block = engine.block as any;

    // Apply ordered list style to all paragraphs (paragraphIndex defaults to -1 = all)
    block.setTextListStyle(textBlock, "Ordered");

    // Override the third paragraph (index 2) to unordered
    block.setTextListStyle(textBlock, "Unordered", 2);

    // Set the second paragraph (index 1) to nesting level 1 (one indent deep)
    block.setTextListLevel(textBlock, 1, 1);

    // Read back the nesting level to confirm
    const level = block.getTextListLevel(textBlock, 1);
    console.log("Second paragraph nesting level:", level); // 1

    // Atomically set both list style and nesting level in one call
    // Sets paragraph 0 to ordered style at nesting level 0 (outermost)
    block.setTextListStyle(textBlock, "Ordered", 0, 0);

    // Get all paragraph indices in the text block
    const allIndices: number[] = block.getTextParagraphIndices(textBlock);
    console.log("All paragraph indices:", allIndices); // [0, 1, 2]

    // Get indices overlapping a specific grapheme range
    const rangeIndices = block.getTextParagraphIndices(textBlock, 0, 10);
    console.log("Indices for range [0, 10):", rangeIndices); // [0]

    // Read back the list style and nesting level for each paragraph
    const styles = allIndices.map((i) => block.getTextListStyle(textBlock, i));
    const levels = allIndices.map((i) => block.getTextListLevel(textBlock, i));
    console.log("Paragraph styles:", styles); // ['Ordered', 'Ordered', 'Unordered']
    console.log("Paragraph levels:", levels); // [0, 1, 0]

    engine.scene.zoomToBlock(textBlock, { padding: 40 });
    engine.block.setSelected(textBlock, true);
  }
}

export default Example;
```

This guide covers applying list styles, managing nesting levels, performing atomic style-and-level assignments, and resolving paragraph indices from text ranges.

## Applying List Styles

We start by creating a new design scene, then add a text block to it with three paragraphs separated by newlines. These paragraphs are the targets for all subsequent list operations.

```typescript highlight-setup
    // Create a new design scene with an 800×600 canvas
    await cesdk.actions.run("scene.create", {
      page: { width: 800, height: 600, unit: "Pixel" },
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType("page")[0];

    // Create a text block and populate it with three paragraphs
    const textBlock = engine.block.create("text");
    engine.block.appendChild(page, textBlock);
    engine.block.replaceText(textBlock, "First item\nSecond item\nThird item");
    engine.block.setTextFontSize(textBlock, 36);
    engine.block.setWidthMode(textBlock, "Auto");
    engine.block.setHeightMode(textBlock, "Auto");
    engine.block.setPositionX(textBlock, 80);
    engine.block.setPositionY(textBlock, 80);
```

We apply list styles with `engine.block.setTextListStyle()`. Omitting `paragraphIndex` (or passing `-1`) applies the style to all paragraphs simultaneously. Passing a non-negative index targets a single paragraph.

```typescript highlight-apply-list-styles
    // Apply ordered list style to all paragraphs (paragraphIndex defaults to -1 = all)
    block.setTextListStyle(textBlock, "Ordered");

    // Override the third paragraph (index 2) to unordered
    block.setTextListStyle(textBlock, "Unordered", 2);
```

After these two calls, paragraphs 0 and 1 are ordered (numbered) and paragraph 2 is unordered (bulleted).

## Managing Nesting Levels

We control the visual depth of list items with `engine.block.setTextListLevel()`. The `listLevel` parameter is zero-based: `0` is the outermost item and `1` is one indent deeper. Nesting has no visual effect when the list style is `'None'`. We read the current level back with `engine.block.getTextListLevel()`.

```typescript highlight-manage-nesting
    // Set the second paragraph (index 1) to nesting level 1 (one indent deep)
    block.setTextListLevel(textBlock, 1, 1);

    // Read back the nesting level to confirm
    const level = block.getTextListLevel(textBlock, 1);
    console.log("Second paragraph nesting level:", level); // 1
```

## Atomic Style and Level Assignment

We set both list style and nesting level in a single call by passing the optional `listLevel` parameter to `setTextListStyle()`. This saves a separate `setTextListLevel()` call when both properties need to change together.

```typescript highlight-atomic
// Atomically set both list style and nesting level in one call
// Sets paragraph 0 to ordered style at nesting level 0 (outermost)
block.setTextListStyle(textBlock, "Ordered", 0, 0);
```

## Resolving Paragraph Indices from Text Ranges

When working with a text selection or a known grapheme range, `engine.block.getTextParagraphIndices()` returns the 0-based paragraph indices that overlap the range. Passing negative values for `from` and `to` (the defaults) returns all indices in the block. This is useful before targeted per-paragraph operations.

```typescript highlight-paragraph-indices
    // Get all paragraph indices in the text block
    const allIndices: number[] = block.getTextParagraphIndices(textBlock);
    console.log("All paragraph indices:", allIndices); // [0, 1, 2]

    // Get indices overlapping a specific grapheme range
    const rangeIndices = block.getTextParagraphIndices(textBlock, 0, 10);
    console.log("Indices for range [0, 10):", rangeIndices); // [0]
```

## Querying List Styles

We read back the current list style and nesting level for each paragraph using `engine.block.getTextListStyle()` and `engine.block.getTextListLevel()`. Both getters require a non-negative `paragraphIndex`—use `getTextParagraphIndices()` to discover valid indices.

```typescript highlight-query-list-styles
// Read back the list style and nesting level for each paragraph
const styles = allIndices.map((i) => block.getTextListStyle(textBlock, i));
const levels = allIndices.map((i) => block.getTextListLevel(textBlock, i));
console.log("Paragraph styles:", styles); // ['Ordered', 'Ordered', 'Unordered']
console.log("Paragraph levels:", levels); // [0, 1, 0]
```

The logged output confirms styles `['Ordered', 'Ordered', 'Unordered']` and levels `[0, 1, 0]` across the three paragraphs.

## Troubleshooting

- **List markers not visible**: Verify the `text/character` scope is enabled on the text block before calling setters.
- **`getTextListStyle()` throws**: The `paragraphIndex` must be non-negative for getters. Use `getTextParagraphIndices()` to retrieve valid indices.
- **Nesting level has no effect**: Check that the list style is not `'None'`—nesting only applies when a list style is active.
- **Numbered list restarting unexpectedly**: Ordered numbering is calculated per-paragraph across the entire block. A `'None'` paragraph between ordered items may reset the counter depending on the renderer.

## API Reference

| Method | Purpose |
|--------|---------|
| <code>engine.block.<wbr />setTextListStyle()</code> | Apply list style to one or all paragraphs, optionally setting nesting level atomically |
| <code>engine.block.<wbr />getTextListStyle()</code> | Get the list style of a specific paragraph |
| <code>engine.block.<wbr />setTextListLevel()</code> | Set the nesting level of one or all paragraphs |
| <code>engine.block.<wbr />getTextListLevel()</code> | Get the nesting level of a specific paragraph |
| <code>engine.block.<wbr />getTextParagraphIndices()</code> | Get 0-based paragraph indices overlapping a grapheme range |



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support