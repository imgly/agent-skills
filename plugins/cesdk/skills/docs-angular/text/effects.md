> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Text](./text.md) > [Text Effects](./text/effects.md)

---

Add visual depth and interest to text blocks using drop shadows and stroke outlines.

![Text Effects example showing text blocks with drop shadow and stroke outline](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-text-effects-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-text-effects-browser)
>
> - [Live demo](https://img.ly/examples/guides-text-effects-browser/)

Text effects in CE.SDK include drop shadows for depth and stroke outlines for text borders. These visual effects are distinct from text styling properties like colors, fonts, and backgrounds.

```typescript file=@cesdk_web_examples/guides-text-effects-browser/browser.ts reference-only
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
 * CE.SDK Plugin: Text Effects Guide
 *
 * Demonstrates applying visual effects to text blocks:
 * - Drop shadows for depth
 * - Outline effect for text borders
 * - Glow effect for luminous aura
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
      page: { width: 800, height: 500, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create a text block with drop shadow
    const shadowText = engine.block.create('//ly.img.ubq/text');
    engine.block.replaceText(shadowText, 'Drop Shadow');
    engine.block.setTextFontSize(shadowText, 90);
    engine.block.setWidthMode(shadowText, 'Auto');
    engine.block.setHeightMode(shadowText, 'Auto');
    engine.block.setPositionX(shadowText, 50);
    engine.block.setPositionY(shadowText, 50);
    engine.block.appendChild(page, shadowText);

    // Enable and configure drop shadow
    engine.block.setDropShadowEnabled(shadowText, true);
    engine.block.setDropShadowColor(shadowText, {
      r: 0,
      g: 0,
      b: 0,
      a: 0.6
    });
    engine.block.setDropShadowOffsetX(shadowText, 5);
    engine.block.setDropShadowOffsetY(shadowText, 5);
    engine.block.setDropShadowBlurRadiusX(shadowText, 10);
    engine.block.setDropShadowBlurRadiusY(shadowText, 10);

    // Create a text block with stroke outline
    const outlineText = engine.block.create('//ly.img.ubq/text');
    engine.block.replaceText(outlineText, 'Outline');
    engine.block.setTextFontSize(outlineText, 90);
    engine.block.setWidthMode(outlineText, 'Auto');
    engine.block.setHeightMode(outlineText, 'Auto');
    engine.block.setPositionX(outlineText, 50);
    engine.block.setPositionY(outlineText, 180);
    engine.block.appendChild(page, outlineText);

    // Enable and configure stroke
    engine.block.setStrokeEnabled(outlineText, true);
    engine.block.setStrokeWidth(outlineText, 2);
    engine.block.setStrokeColor(outlineText, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1.0
    });
    engine.block.setStrokeStyle(outlineText, 'Solid');
    engine.block.setStrokePosition(outlineText, 'Center');

    // Select the first text block
    engine.block.select(shadowText);
  }
}

export default Example;
```

This guide covers how to apply drop shadows and stroke outlines to text blocks programmatically using the Block API.

## Drop Shadows

Drop shadows add depth and emphasis to text. CE.SDK provides dedicated APIs for configuring shadow properties on text blocks.

```typescript highlight-drop-shadow
    // Create a text block with drop shadow
    const shadowText = engine.block.create('//ly.img.ubq/text');
    engine.block.replaceText(shadowText, 'Drop Shadow');
    engine.block.setTextFontSize(shadowText, 90);
    engine.block.setWidthMode(shadowText, 'Auto');
    engine.block.setHeightMode(shadowText, 'Auto');
    engine.block.setPositionX(shadowText, 50);
    engine.block.setPositionY(shadowText, 50);
    engine.block.appendChild(page, shadowText);

    // Enable and configure drop shadow
    engine.block.setDropShadowEnabled(shadowText, true);
    engine.block.setDropShadowColor(shadowText, {
      r: 0,
      g: 0,
      b: 0,
      a: 0.6
    });
    engine.block.setDropShadowOffsetX(shadowText, 5);
    engine.block.setDropShadowOffsetY(shadowText, 5);
    engine.block.setDropShadowBlurRadiusX(shadowText, 10);
    engine.block.setDropShadowBlurRadiusY(shadowText, 10);
```

The drop shadow API provides control over color, position, and blur. The offset values position the shadow relative to the text, while the blur radius controls shadow softness. Horizontal and vertical blur can be configured independently for asymmetric effects.

## Stroke Outlines

Stroke outlines add a colored border around text. We enable stroke with `setStrokeEnabled()`, then configure width, color, style, and position.

```typescript highlight-stroke
    // Create a text block with stroke outline
    const outlineText = engine.block.create('//ly.img.ubq/text');
    engine.block.replaceText(outlineText, 'Outline');
    engine.block.setTextFontSize(outlineText, 90);
    engine.block.setWidthMode(outlineText, 'Auto');
    engine.block.setHeightMode(outlineText, 'Auto');
    engine.block.setPositionX(outlineText, 50);
    engine.block.setPositionY(outlineText, 180);
    engine.block.appendChild(page, outlineText);

    // Enable and configure stroke
    engine.block.setStrokeEnabled(outlineText, true);
    engine.block.setStrokeWidth(outlineText, 2);
    engine.block.setStrokeColor(outlineText, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1.0
    });
    engine.block.setStrokeStyle(outlineText, 'Solid');
    engine.block.setStrokePosition(outlineText, 'Center');
```

The stroke width is specified in pixels. Text blocks use centered stroke positioning. Stroke styles include `'Solid'`, `'Dashed'`, `'Dotted'`, and other line patterns.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.supportsDropShadow()` | Check if block supports drop shadows |
| `engine.block.setDropShadowEnabled()` | Enable or disable drop shadow |
| `engine.block.setDropShadowColor()` | Set shadow color |
| `engine.block.setDropShadowOffsetX()` | Set horizontal shadow offset |
| `engine.block.setDropShadowOffsetY()` | Set vertical shadow offset |
| `engine.block.setDropShadowBlurRadiusX()` | Set horizontal blur radius |
| `engine.block.setDropShadowBlurRadiusY()` | Set vertical blur radius |
| `engine.block.setStrokeEnabled()` | Enable or disable stroke |
| `engine.block.setStrokeWidth()` | Set stroke width in pixels |
| `engine.block.setStrokeColor()` | Set stroke color |
| `engine.block.setStrokeStyle()` | Set stroke style (Solid, Dashed, etc.) |

## Troubleshooting

**Drop shadow not visible**: Ensure `setDropShadowEnabled()` is called after configuring properties. Verify `supportsDropShadow()` returns true for the block.

**Stroke not visible**: Ensure `setStrokeEnabled()` is called with `true` and stroke width is greater than 0.

**Stroke too thick or thin**: Adjust the value passed to `setStrokeWidth()` to control outline thickness.



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support