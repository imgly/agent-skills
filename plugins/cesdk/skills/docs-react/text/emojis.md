> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Emojis](./text/emojis.md)

---

Configure emoji rendering in CE.SDK text blocks using a dedicated emoji font for consistent cross-platform display.

![Emojis example showing text blocks with various emoji types](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-text-emojis-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-text-emojis-browser)
>
> - [Live demo](https://img.ly/examples/guides-text-emojis-browser/)

Emojis are Unicode characters representing pictographic symbols. They can be single code points (😀), multi-character sequences (flags like 🇩🇪), ZWJ-joined combinations (👨‍👩‍👧), or skin tone variants (👋🏽). CE.SDK renders text to canvas for precise layout control, which bypasses browser font fallback. This means CE.SDK must explicitly provide an emoji font—it uses Noto Color Emoji by default.

```typescript file=@cesdk_web_examples/guides-text-emojis-browser/browser.ts reference-only
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
 * CE.SDK Plugin: Emojis Guide
 *
 * Demonstrates emoji rendering configuration:
 * - Understanding the default emoji font (Noto Color Emoji)
 * - Getting and setting the emoji font URI
 * - Creating text blocks with emojis
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

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // CE.SDK uses Noto Color Emoji by default for consistent cross-platform rendering
    // Get the current emoji font URI
    const defaultEmojiFontUri = engine.editor.getSetting(
      'defaultEmojiFontFileUri'
    );
    console.log('Default emoji font URI:', defaultEmojiFontUri);

    // You can set a custom emoji font if needed
    // engine.editor.setSetting(
    //   'defaultEmojiFontFileUri',
    //   'https://your-cdn.com/fonts/CustomEmoji.ttf'
    // );

    // For this guide, we use the default Noto Color Emoji font
    // which is already configured in CE.SDK

    // Create a text block with emoji content
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Set text content with emojis
    engine.block.replaceText(textBlock, 'Hello World! 🎉🚀✨');

    // Configure text appearance
    engine.block.setTextFontSize(textBlock, 64);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');

    // Position the text block
    engine.block.setPositionX(textBlock, 50);
    engine.block.setPositionY(textBlock, 100);

    // Create additional text blocks demonstrating various emoji types

    // Single emoji characters
    const singleEmojis = engine.block.create('text');
    engine.block.appendChild(page, singleEmojis);
    engine.block.replaceText(singleEmojis, 'Single emojis: 😀 👍 ❤️ ⭐');
    engine.block.setTextFontSize(singleEmojis, 36);
    engine.block.setWidthMode(singleEmojis, 'Auto');
    engine.block.setHeightMode(singleEmojis, 'Auto');
    engine.block.setPositionX(singleEmojis, 50);
    engine.block.setPositionY(singleEmojis, 200);

    // Flag emojis (multi-character sequences)
    const flagEmojis = engine.block.create('text');
    engine.block.appendChild(page, flagEmojis);
    engine.block.replaceText(flagEmojis, 'Flags: 🇩🇪 🇺🇸 🇯🇵 🇬🇧');
    engine.block.setTextFontSize(flagEmojis, 36);
    engine.block.setWidthMode(flagEmojis, 'Auto');
    engine.block.setHeightMode(flagEmojis, 'Auto');
    engine.block.setPositionX(flagEmojis, 50);
    engine.block.setPositionY(flagEmojis, 270);

    // ZWJ (Zero Width Joiner) sequences
    const familyEmojis = engine.block.create('text');
    engine.block.appendChild(page, familyEmojis);
    engine.block.replaceText(familyEmojis, 'Families: 👨‍👩‍👧 👨‍👩‍👦‍👦 👩‍👦');
    engine.block.setTextFontSize(familyEmojis, 36);
    engine.block.setWidthMode(familyEmojis, 'Auto');
    engine.block.setHeightMode(familyEmojis, 'Auto');
    engine.block.setPositionX(familyEmojis, 50);
    engine.block.setPositionY(familyEmojis, 340);

    // Skin tone variants
    const skinToneEmojis = engine.block.create('text');
    engine.block.appendChild(page, skinToneEmojis);
    engine.block.replaceText(skinToneEmojis, 'Skin tones: 👋 👋🏻 👋🏽 👋🏿');
    engine.block.setTextFontSize(skinToneEmojis, 36);
    engine.block.setWidthMode(skinToneEmojis, 'Auto');
    engine.block.setHeightMode(skinToneEmojis, 'Auto');
    engine.block.setPositionX(skinToneEmojis, 50);
    engine.block.setPositionY(skinToneEmojis, 410);

    // Zoom to show all content
    engine.scene.zoomToBlock(page, { padding: 40 });

    // Select the main text block to show it in the inspector
    engine.block.setSelected(textBlock, true);
  }
}

export default Example;
```

This guide covers understanding the default emoji font, configuring a custom emoji font, and adding text with emojis programmatically.

## Default Emoji Font

CE.SDK uses Noto Color Emoji (~9.9 MB, PNG-based) from `https://cdn.img.ly/assets/v5/emoji/NotoColorEmoji.ttf` by default. This ensures identical emoji rendering across all platforms and browsers—designs created on macOS look the same on Windows or Android. No configuration is needed; emoji rendering works out of the box.

We retrieve the current emoji font URI using `engine.editor.getSetting()`:

```typescript highlight-default-emoji-font
// CE.SDK uses Noto Color Emoji by default for consistent cross-platform rendering
// Get the current emoji font URI
const defaultEmojiFontUri = engine.editor.getSetting(
  'defaultEmojiFontFileUri'
);
console.log('Default emoji font URI:', defaultEmojiFontUri);
```

## Configuring the Emoji Font

We can change the emoji font using `engine.editor.setSetting()`. The URI can point to any accessible URL, CDN, or local file containing an emoji font.

```typescript highlight-configure-emoji-font
    // You can set a custom emoji font if needed
    // engine.editor.setSetting(
    //   'defaultEmojiFontFileUri',
    //   'https://your-cdn.com/fonts/CustomEmoji.ttf'
    // );

    // For this guide, we use the default Noto Color Emoji font
    // which is already configured in CE.SDK
```

## Adding Emojis to Text Blocks

We create text blocks and add emoji content using `engine.block.replaceText()`. Emojis are inserted directly as Unicode characters:

```typescript highlight-create-text-with-emojis
    // Create a text block with emoji content
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Set text content with emojis
    engine.block.replaceText(textBlock, 'Hello World! 🎉🚀✨');

    // Configure text appearance
    engine.block.setTextFontSize(textBlock, 64);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');

    // Position the text block
    engine.block.setPositionX(textBlock, 50);
    engine.block.setPositionY(textBlock, 100);
```

CE.SDK handles all emoji types automatically—single characters, flag sequences, ZWJ combinations, and skin tone variants:

```typescript highlight-emoji-examples
    // Create additional text blocks demonstrating various emoji types

    // Single emoji characters
    const singleEmojis = engine.block.create('text');
    engine.block.appendChild(page, singleEmojis);
    engine.block.replaceText(singleEmojis, 'Single emojis: 😀 👍 ❤️ ⭐');
    engine.block.setTextFontSize(singleEmojis, 36);
    engine.block.setWidthMode(singleEmojis, 'Auto');
    engine.block.setHeightMode(singleEmojis, 'Auto');
    engine.block.setPositionX(singleEmojis, 50);
    engine.block.setPositionY(singleEmojis, 200);

    // Flag emojis (multi-character sequences)
    const flagEmojis = engine.block.create('text');
    engine.block.appendChild(page, flagEmojis);
    engine.block.replaceText(flagEmojis, 'Flags: 🇩🇪 🇺🇸 🇯🇵 🇬🇧');
    engine.block.setTextFontSize(flagEmojis, 36);
    engine.block.setWidthMode(flagEmojis, 'Auto');
    engine.block.setHeightMode(flagEmojis, 'Auto');
    engine.block.setPositionX(flagEmojis, 50);
    engine.block.setPositionY(flagEmojis, 270);

    // ZWJ (Zero Width Joiner) sequences
    const familyEmojis = engine.block.create('text');
    engine.block.appendChild(page, familyEmojis);
    engine.block.replaceText(familyEmojis, 'Families: 👨‍👩‍👧 👨‍👩‍👦‍👦 👩‍👦');
    engine.block.setTextFontSize(familyEmojis, 36);
    engine.block.setWidthMode(familyEmojis, 'Auto');
    engine.block.setHeightMode(familyEmojis, 'Auto');
    engine.block.setPositionX(familyEmojis, 50);
    engine.block.setPositionY(familyEmojis, 340);

    // Skin tone variants
    const skinToneEmojis = engine.block.create('text');
    engine.block.appendChild(page, skinToneEmojis);
    engine.block.replaceText(skinToneEmojis, 'Skin tones: 👋 👋🏻 👋🏽 👋🏿');
    engine.block.setTextFontSize(skinToneEmojis, 36);
    engine.block.setWidthMode(skinToneEmojis, 'Auto');
    engine.block.setHeightMode(skinToneEmojis, 'Auto');
    engine.block.setPositionX(skinToneEmojis, 50);
    engine.block.setPositionY(skinToneEmojis, 410);
```

## The `forceSystemEmojis` Setting

CE.SDK has a `forceSystemEmojis` setting (default: `true`). Despite its name, this setting has no practical effect on web because regular text fonts don't contain emoji glyphs and canvas rendering cannot access browser emoji fallback. CE.SDK always uses `defaultEmojiFontFileUri` for emoji characters. The setting exists for cross-platform compatibility.

## Troubleshooting

**Emojis look different than expected**: CE.SDK uses Noto Color Emoji by default. To use a different emoji style, change `defaultEmojiFontFileUri` to another emoji font.

**Missing emojis**: The emoji font may not support all Unicode emoji characters. Ensure your custom emoji font has comprehensive Unicode coverage.

**Large initial download**: The default Noto Color Emoji font is ~9.9 MB. Consider preloading it or showing a loading indicator for your users.

**Want browser-native emojis**: This is not possible with canvas rendering. CE.SDK requires an explicit emoji font file for consistent cross-platform results.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.editor.getSetting('defaultEmojiFontFileUri')` | Get the current emoji font URI |
| `engine.editor.setSetting('defaultEmojiFontFileUri', uri)` | Set a custom emoji font URI |
| `engine.block.create('text')` | Create a text block |
| `engine.block.replaceText(id, text)` | Set text content including emojis |



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support