> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Update Caption Presets](./create-video/update-caption-presets.md)

---

Add custom caption presets to CE.SDK's video caption feature. A caption preset is a declarative
style preset: you describe the look as JSON and the engine applies it to a caption block with a
single click.

![Update Caption Presets example showing a styled neon glow caption preset](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-video-update-caption-presets-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-video-update-caption-presets-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.80.0-nightly.20260724/examples/guides-create-video-update-caption-presets-browser/index.html)

CE.SDK ships built-in caption presets so users can restyle their captions in one click, and you can add your own. A preset is just a JSON object that describes the look, so there are no blocks to build or files to serialize. This guide shows how to define a preset, register it at runtime, and host your own set.

```typescript file=@cesdk_web_examples/guides-create-video-update-caption-presets-browser/browser.ts reference-only
import type {
  AssetStylePreset,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
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
import { VideoEditorConfig } from '@cesdk/core-configs-web/video-editor';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Update Caption Presets Guide
 *
 * Demonstrates creating custom caption presets in CE.SDK:
 * - Defining a declarative style preset for a caption look
 * - Registering the preset so it appears in the caption presets panel
 * - Understanding the content.json structure for hosted caption presets
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story',
        color: { r: 0, g: 0, b: 0, a: 1 }
      }
    });

    const engine = cesdk.engine;

    // Describe the look as a declarative style preset. The engine reads this
    // object and applies it to a caption block, so there is no styled block to
    // serialize. Colors are RGB(A) objects in the 0-1 range.
    const neonGlowStylePreset: AssetStylePreset = {
      blockType: '//ly.img.ubq/caption',
      // `replace` resets the properties the preset does not list, so switching
      // presets never stacks leftover decorations.
      mode: 'replace',
      typeface: {
        family: 'Monoton',
        weight: 'normal',
        style: 'normal'
      },
      properties: {
        // Keys without a slash are namespaced to the block (caption/*).
        'caption/horizontalAlignment': 'Center',
        'caption/verticalAlignment': 'Center',
        // Bright cyan text fill.
        'fill/enabled': true,
        'fill/solid/color': { r: 0, g: 1, b: 1, a: 1 },
        // Semi-transparent background so captions stay readable over video.
        'backgroundColor/enabled': true,
        'backgroundColor/color': { r: 0, g: 0, b: 0.1, a: 0.7 },
        // A matching glow built from a soft drop shadow.
        'dropShadow/enabled': true,
        'dropShadow/color': { r: 0, g: 1, b: 1, a: 0.8 },
        'dropShadow/clip': false
      },
      // Keep the background rounding and the glow proportional to the font size
      // instead of baking in fixed pixel values. Each entry sets its property to
      // `ratio * fontSize`.
      scaleWithFontSize: [
        { property: 'backgroundColor/cornerRadius', ratio: 0.2 },
        { property: 'dropShadow/blurRadius/x', ratio: 0.8 },
        { property: 'dropShadow/blurRadius/y', ratio: 0.8 }
      ]
    };

    // Add the preset to the existing caption presets source so it shows up in
    // the caption presets panel next to the built-in presets.
    engine.asset.addAssetToSource('ly.img.caption.presets', {
      id: 'ly.img.caption.presets.neon-glow',
      label: { en: 'Neon Glow' },
      meta: {
        thumbUri: '{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png'
      },
      groups: ['caption'],
      payload: { stylePreset: neonGlowStylePreset }
    });

    // To host the preset instead of registering it at runtime, add the same
    // entry to your content.json. The style preset lives in payload.stylePreset
    // and meta only needs a thumbUri.
    const contentJsonEntry = {
      id: 'ly.img.caption.presets.neon-glow',
      label: { en: 'Neon Glow' },
      meta: {
        thumbUri: '{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png'
      },
      groups: ['caption'],
      payload: { stylePreset: neonGlowStylePreset }
    };

    // eslint-disable-next-line no-console
    console.log('=== content.json Entry ===');
    // eslint-disable-next-line no-console
    console.log('Add this entry to your content.json assets array:');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(contentJsonEntry, null, 2));

    // A complete content.json wraps the preset entries in the assets array.
    const completeContentJson = {
      version: '7.0.0',
      id: 'ly.img.caption.presets',
      assets: [contentJsonEntry]
    };

    // eslint-disable-next-line no-console
    console.log('\n=== Complete content.json Example ===');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(completeContentJson, null, 2));

    // eslint-disable-next-line no-console
    console.log('\n=== Caption Preset Guide ===');
    // eslint-disable-next-line no-console
    console.log(
      'Open the caption presets panel to apply the "Neon Glow" preset to a caption.'
    );
    // eslint-disable-next-line no-console
    console.log('To host this preset:');
    // eslint-disable-next-line no-console
    console.log('1. Add the content.json entry to your assets folder');
    // eslint-disable-next-line no-console
    console.log('2. Create a thumbnail image showing the preset appearance');
    // eslint-disable-next-line no-console
    console.log('3. Configure CE.SDK baseURL to point to your assets location');
  }
}

export default Example;
```

## Define a caption style preset

Describe the look as a plain object. The engine applies it to a caption block, so you never create or serialize a styled block yourself.

```typescript highlight-define-style-preset
// Describe the look as a declarative style preset. The engine reads this
// object and applies it to a caption block, so there is no styled block to
// serialize. Colors are RGB(A) objects in the 0-1 range.
const neonGlowStylePreset: AssetStylePreset = {
  blockType: '//ly.img.ubq/caption',
  // `replace` resets the properties the preset does not list, so switching
  // presets never stacks leftover decorations.
  mode: 'replace',
  typeface: {
    family: 'Monoton',
    weight: 'normal',
    style: 'normal'
  },
  properties: {
    // Keys without a slash are namespaced to the block (caption/*).
    'caption/horizontalAlignment': 'Center',
    'caption/verticalAlignment': 'Center',
    // Bright cyan text fill.
    'fill/enabled': true,
    'fill/solid/color': { r: 0, g: 1, b: 1, a: 1 },
    // Semi-transparent background so captions stay readable over video.
    'backgroundColor/enabled': true,
    'backgroundColor/color': { r: 0, g: 0, b: 0.1, a: 0.7 },
    // A matching glow built from a soft drop shadow.
    'dropShadow/enabled': true,
    'dropShadow/color': { r: 0, g: 1, b: 1, a: 0.8 },
    'dropShadow/clip': false
  },
  // Keep the background rounding and the glow proportional to the font size
  // instead of baking in fixed pixel values. Each entry sets its property to
  // `ratio * fontSize`.
  scaleWithFontSize: [
    { property: 'backgroundColor/cornerRadius', ratio: 0.2 },
    { property: 'dropShadow/blurRadius/x', ratio: 0.8 },
    { property: 'dropShadow/blurRadius/y', ratio: 0.8 }
  ]
};
```

The fields:

- `blockType`: the target block. Use `'//ly.img.ubq/caption'`.
- `mode`: `'replace'` (the default) clears anything the preset omits, so presets never stack. `'merge'` layers the preset on top and keeps untouched properties.
- `typeface`: the font, resolved by `family` with optional `weight` and `style`.
- `properties`: a flat map of property paths to values. Keys without a slash are namespaced to the block (for example `caption/horizontalAlignment`); colors are RGB(A) objects in the 0-1 range. Common paths are `fill/solid/color`, `backgroundColor/color`, `dropShadow/color`, and `caption/horizontalAlignment`.
- `scaleWithFontSize` (optional): keeps a decoration proportional to the font size. Each `{ property, ratio }` entry sets `property` to `ratio × fontSize`. Supported for `stroke/width`, the `dropShadow` offset and blur radius, and `backgroundColor/cornerRadius`.

## Register the preset

CE.SDK already includes the `ly.img.caption.presets` source. Add your preset to it so it appears in the caption presets panel:

```typescript highlight-register-preset
// Add the preset to the existing caption presets source so it shows up in
// the caption presets panel next to the built-in presets.
engine.asset.addAssetToSource('ly.img.caption.presets', {
  id: 'ly.img.caption.presets.neon-glow',
  label: { en: 'Neon Glow' },
  meta: {
    thumbUri: '{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png'
  },
  groups: ['caption'],
  payload: { stylePreset: neonGlowStylePreset }
});
```

Users apply it from the panel like any built-in preset. To apply it in code, use `engine.asset.applyToBlock('ly.img.caption.presets', asset, captionBlockId)`.

## Host your own presets

To serve presets from your own server instead of registering them at runtime, host a `content.json` and point the engine's `baseURL` at it. The source needs only the index file and a thumbnails folder:

```
assets/v7/ly.img.caption.presets/
├── content.json
└── thumbnails/
    └── neon-glow.png
```

Each asset carries its look inline in `payload.stylePreset` and a preview in `meta.thumbUri`. There are no separate preset files:

```json
{
  "version": "7.0.0",
  "id": "ly.img.caption.presets",
  "assets": [
    {
      "id": "ly.img.caption.presets.neon-glow",
      "label": { "en": "Neon Glow" },
      "meta": {
        "thumbUri": "{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png"
      },
      "groups": ["caption"],
      "payload": {
        "stylePreset": {
          "blockType": "//ly.img.ubq/caption",
          "mode": "replace",
          "typeface": { "family": "Monoton", "weight": "normal" },
          "properties": {
            "fill/enabled": true,
            "fill/solid/color": { "r": 0, "g": 1, "b": 1, "a": 1 }
          }
        }
      }
    }
  ]
}
```

CE.SDK loads `ly.img.caption.presets/content.json` relative to `baseURL`, so your presets replace the defaults automatically:

```typescript
const cesdk = await CreativeEditorSDK.create('#cesdk_container', {
  baseURL: 'https://your-server.com/assets/'
});
```

## Troubleshooting

- **Preset not loading**: confirm `content.json` is reachable with no 404 or CORS errors, and that `version` is `7.0.0`.
- **Styles not applying**: set `blockType` to `'//ly.img.ubq/caption'` and check the property paths. `mode: 'replace'` drops anything the preset omits, so switch to `'merge'` to layer on top.
- **Color or decoration missing**: use RGB(A) values in the 0-1 range, and enable a decoration before coloring it (for example `dropShadow/enabled: true` alongside `dropShadow/color`).
- **Thumbnail blank**: verify the `thumbUri` path resolves and the image is a PNG.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.asset.addAssetToSource(sourceId, asset)` | Register a custom preset in an asset source |
| `engine.asset.applyToBlock(sourceId, asset, block)` | Apply a preset to a caption block |
| `CreativeEditorSDK.create(container, config)` | Initialize the editor with a `baseURL` |



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support