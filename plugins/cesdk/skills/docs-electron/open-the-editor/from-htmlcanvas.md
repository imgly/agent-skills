> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Create From HTMLCanvas](./open-the-editor/from-htmlcanvas.md)

---

Create a CE.SDK scene from an HTMLCanvas element's rendered content, enabling editing of canvas-based graphics.

![Create From HTMLCanvas example showing canvas content loaded in CE.SDK](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-from-htmlcanvas-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-from-htmlcanvas-browser)
>
> - [Live demo](https://img.ly/examples/guides-open-the-editor-from-htmlcanvas-browser/)

You can capture any graphics rendered to a canvas—2D drawings, WebGL content, or programmatically generated visuals—and use them as the starting point for editing in CE.SDK. The workflow extracts canvas content as a data URL and passes it to the scene API.

```typescript file=@cesdk_web_examples/guides-open-the-editor-from-htmlcanvas-browser/browser.ts reference-only
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

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
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

    const engine = cesdk.engine;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      throw new Error('Could not get 2D context');
    }

    // Draw a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#4158D0');
    gradient.addColorStop(0.5, '#C850C0');
    gradient.addColorStop(1, '#FFCC70');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Draw "img.ly" text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('img.ly', 256, 256);

    const dataURL = canvas.toDataURL();

    // Second parameter is DPI: 72 for screen, 300 for print (default)
    await engine.scene.createFromImage(dataURL);

    // Enable auto-fit zoom on the page
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      engine.scene.enableZoomAutoFit(pages[0], 'Both', 40, 40, 40, 40);
    }
  }
}

export default Example;
```

This guide covers how to create a canvas element, draw content to it, extract that content as a data URL, and create an editable CE.SDK scene from the result.

## Create the Canvas

Start by creating a canvas element with specific dimensions. These dimensions determine the resulting scene size.

```typescript highlight=highlight-setup
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
```

The canvas `width` and `height` attributes set the actual pixel dimensions, not CSS styling.

## Get the Drawing Context

Obtain the 2D rendering context from the canvas to draw content.

```typescript highlight=highlight-draw-canvas
const ctx = canvas.getContext('2d');
if (ctx == null) {
  throw new Error('Could not get 2D context');
}
```

Use the context to render any graphics—2D drawings, chart visualizations, or programmatic visuals.

## Extract as Data URL

Extract the canvas content as a base64-encoded data URL using `toDataURL()`.

```typescript highlight=highlight-extract-data-url
const dataURL = canvas.toDataURL();
```

The default format is PNG. For JPEG with compression, use `canvas.toDataURL('image/jpeg', 0.9)`.

## Create Scene from Data URL

Pass the data URL to `engine.scene.createFromImage()` to create an editable scene. The page dimensions automatically match the source image.

```typescript highlight=highlight-create-scene
// Second parameter is DPI: 72 for screen, 300 for print (default)
await engine.scene.createFromImage(dataURL);
```

The second parameter controls DPI: use 72 for screen display or 300 (default) for print output.

## Common Canvas Sources

The `createFromImage()` method accepts any valid image data URL, making it compatible with various canvas sources:

- **Chart Libraries** — D3.js, Chart.js, and Plotly render visualizations to canvas
- **WebGL Content** — 3D renders, games, and complex visualizations
- **Drawing Applications** — Capture user-created sketches and annotations
- **QR Code Generators** — Libraries like `qrcode.js` render directly to canvas
- **Generative Art** — p5.js and Processing.js output to canvas elements
- **Video Frames** — Draw video frames to canvas with `drawImage(video, 0, 0)`

Each source follows the same pattern: render to canvas, extract with `toDataURL()`, and pass to CE.SDK.

## Troubleshooting

**Canvas content not appearing**

Verify the canvas has content before calling `toDataURL()`. Async rendering can produce blank exports. For WebGL canvases, set `preserveDrawingBuffer: true` in the context options.

**Tainted canvas errors**

Cross-origin images drawn to the canvas taint it, preventing `toDataURL()` calls. Use `crossOrigin="anonymous"` when loading images, and ensure the server sends proper CORS headers.

**Scene dimensions incorrect**

Canvas `width` and `height` attributes determine the actual pixel dimensions, not CSS styling. The data URL captures attribute dimensions, not the displayed size.

**WebGL context lost**

WebGL contexts can be lost due to GPU resource limits. Listen for the `webglcontextlost` event and handle gracefully by recreating the context or notifying the user.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.scene.createFromImage(url, dpi?, pixelScaleFactor?)` | Creates a scene from an image URL or data URL. Default DPI is 300. |
| `engine.scene.get()` | Returns the current scene block ID, or `null` if no scene exists. |
| `engine.scene.enableZoomAutoFit(id, axis, ...padding)` | Enables automatic zoom to fit the specified block. |
| `engine.block.findByType(type)` | Finds all blocks of the specified type. |
| `canvas.toDataURL(type?, quality?)` | Exports canvas content as a base64 data URL. Default type is `image/png`. |
| `canvas.getContext('2d')` | Returns the 2D rendering context for drawing operations. |

## Next Steps

[Create From Image](./open-the-editor/from-image.md) shows how to load scenes from image URLs directly.

[Start With Blank Canvas](./open-the-editor/blank-canvas.md) covers starting with an empty scene for new designs.

[Save a Scene](./export-save-publish/save.md) explains how to save your edited scene for later use.

[Load a Scene](./open-the-editor/load-scene.md) demonstrates loading previously saved scenes.



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support