> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To HTML5](./export-save-publish/export/to-html5.md) > [Plugins](./plugins.md) > [HTML5 Export](./export-save-publish/export/to-html5.md)

---

Export CE.SDK designs as HTML5 bundles containing HTML, images and fonts — ready for distribution as display ads or interactive web content.

![Export to HTML5](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-to-html5-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-export-to-html5-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-export-save-publish-export-to-html5-browser/)

The `@imgly/html-exporter` package converts a CE.SDK scene page into an HTML5 bundle using `exportHtml(engine, options)`. The result is a `FileMap` — a standard `Map` extended with a `toZip()` method — that you can inspect, customize with additional files and scripts, then package as a ZIP for delivery.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-html5-browser/browser.ts reference-only
import type {
  CreativeEngine,
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

import { exportHtml, injectGsapPlayer } from '@imgly/html-exporter';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load the video editor config (provides full UI: navigation, dock, inspector, canvas, panels)
    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins (populates editor panels with content)
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
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

    // Create a video scene (enables animation timeline)
    await cesdk.actions.run('scene.create', { mode: 'Video' });

    const engine = cesdk.engine;

    // Register an "Export HTML5" button in the navigation bar
    let isExporting = false;

    cesdk.ui.registerComponent(
      'ly.img.html5-export.navigationBar',
      ({ builder }) => {
        builder.Button('html5-export-preview', {
          color: 'accent',
          variant: 'regular',
          label: 'Export and Preview HTML5',
          isLoading: isExporting,
          isDisabled: isExporting,
          onClick: async () => {
            if (isExporting) return;
            isExporting = true;
            try {
              await previewHtml5(engine);
            } finally {
              isExporting = false;
            }
          }
        });
        builder.Button('html5-export-download', {
          variant: 'regular',
          label: 'Download ZIP',
          isLoading: isExporting,
          isDisabled: isExporting,
          onClick: async () => {
            if (isExporting) return;
            isExporting = true;
            try {
              await downloadHtml5Zip(engine);
            } finally {
              isExporting = false;
            }
          }
        });
      }
    );

    // Add the export buttons to the navigation bar
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      'ly.img.html5-export.navigationBar'
    ]);
  }
}

async function previewHtml5(engine: CreativeEngine) {
  // Export as a single self-contained HTML file (base64-embedded assets)
  const embeddedResult = await exportHtml(engine, {
    format: 'embedded',
    pageIndex: 0
  });

  // Inject the GSAP library to make animations playable
  const htmlFile = embeddedResult.files.get('index.html');
  const htmlContent =
    typeof htmlFile!.content === 'string'
      ? htmlFile!.content
      : new TextDecoder().decode(htmlFile!.content);

  const playableHtml = injectGsapPlayer(htmlContent);

  // Open a preview in a new browser tab
  const previewBlob = new Blob([playableHtml], { type: 'text/html' });
  window.open(URL.createObjectURL(previewBlob), '_blank');
}

async function downloadHtml5Zip(engine: CreativeEngine) {
  const page = engine.block.findByType('page')[0];

  // Export the first page as an external HTML5 bundle (HTML + separate assets)
  const externalResult = await exportHtml(engine, {
    format: 'external',
    pageIndex: 0
  });

  // The result contains a FileMap with all generated files
  console.log('External export files:');
  for (const [path] of externalResult.files) {
    console.log(`  ${path}`);
  }

  // Check for warnings or errors during export
  if (externalResult.messages && externalResult.messages.length > 0) {
    for (const msg of externalResult.messages) {
      console.log(`[${msg.type}] ${msg.message}`);
    }
  }

  // Read the index.html from the external export and inject metadata
  let html = externalResult.files.get('index.html')!.content as string;

  // Inject an ad.size meta tag into the <head>
  const pageWidth = Math.round(engine.block.getWidth(page));
  const pageHeight = Math.round(engine.block.getHeight(page));
  html = html.replace(
    '</head>',
    `  <meta name="ad.size" content="width=${pageWidth},height=${pageHeight}">\n</head>`
  );

  // Inject a click-tracking script before </body>
  const clickScript = `
<script>
  var clickTag = "https://example.com";
  document.addEventListener("click", function() {
    window.open(clickTag, "_blank");
  });
</script>`;
  html = html.replace('</body>', clickScript + '\n</body>');

  // Write the modified HTML back to the FileMap
  externalResult.files.set('index.html', {
    content: html,
    mimeType: 'text/html'
  });

  // Add a manifest.json describing the bundle
  externalResult.files.set('manifest.json', {
    content: JSON.stringify(
      {
        version: '1.0',
        title: 'My Creative',
        width: pageWidth,
        height: pageHeight,
        source: 'index.html'
      },
      null,
      2
    ),
    mimeType: 'application/json'
  });

  // Generate a static backup image and add it to the bundle
  const backupBlob = await engine.block.export(page, {
    mimeType: 'image/jpeg',
    jpegQuality: 0.8,
    targetWidth: pageWidth,
    targetHeight: pageHeight
  });
  const backupBytes = new Uint8Array(await backupBlob.arrayBuffer());
  externalResult.files.set('backup.jpg', {
    content: backupBytes,
    mimeType: 'image/jpeg'
  });

  // Package all files as a ZIP and trigger a browser download
  const zip = await externalResult.files.toZip();
  const downloadBlob = new Blob([zip.buffer as ArrayBuffer], {
    type: 'application/zip'
  });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(downloadBlob);
  a.download = 'html5-export.zip';
  a.click();
}

export default Example;
```

This guide covers exporting scenes as HTML5, choosing between external and embedded formats, injecting GSAP for animated playback, and customizing the output with click tracking, metadata, and extra files.

## Getting Started

Install the `@imgly/html-exporter` package and import `exportHtml` and optionally `injectGsapPlayer`.

```typescript highlight=highlight-import
import { exportHtml, injectGsapPlayer } from '@imgly/html-exporter';
```

## Exporting a Scene Page

Call `exportHtml()` with the engine instance and an options object. The `pageIndex` option (0-based) selects which page to export. Each call exports one page.

```typescript highlight=highlight-export-external
  // Export the first page as an external HTML5 bundle (HTML + separate assets)
  const externalResult = await exportHtml(engine, {
    format: 'external',
    pageIndex: 0
  });

  // The result contains a FileMap with all generated files
  console.log('External export files:');
  for (const [path] of externalResult.files) {
    console.log(`  ${path}`);
  }

  // Check for warnings or errors during export
  if (externalResult.messages && externalResult.messages.length > 0) {
    for (const msg of externalResult.messages) {
      console.log(`[${msg.type}] ${msg.message}`);
    }
  }
```

The returned `ExportHtmlResult` contains `files` (a `FileMap` of generated files) and `messages` (an array of `LogMessage` objects with any warnings or errors from the export process).

### Export Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `'external' \| 'embedded'` | `'external'` | Output format |
| `pageIndex` | `number` | (required) | 0-based page index |
| `quality` | `number` | `90` | WebP image quality 0–100 |
| `animated` | `boolean \| 'auto'` | `'auto'` | Generate GSAP animation timeline |
| `insertExplicitLineBreaks` | `boolean` | `true` | Insert `<br>` at CE.SDK line breaks |
| `useSyntheticIds` | `boolean` | `false` | Stable deterministic element IDs |
| `abortSignal` | `AbortSignal` | — | Cancel the export |

## Choosing a Format: External vs Embedded

The **external** format (default) writes `index.html` plus separate image and font files. Use this for production delivery — each file is individually cacheable and the total size is transparent for validation.

The **embedded** format inlines all assets as base64 data URLs into a single `index.html`. Use this for in-browser preview or sharing a single file.

```typescript highlight=highlight-export-embedded
// Export as a single self-contained HTML file (base64-embedded assets)
const embeddedResult = await exportHtml(engine, {
  format: 'embedded',
  pageIndex: 0
});
```

## Animated Exports and GSAP Injection

When `animated` is `'auto'` (the default), the exporter checks the scene mode and generates a GSAP animation timeline for video scenes. The timeline is embedded as an inline script in the HTML output. To make it playable, inject the GSAP library from a CDN using `injectGsapPlayer()`.

```typescript highlight=highlight-gsap-injection
  // Inject the GSAP library to make animations playable
  const htmlFile = embeddedResult.files.get('index.html');
  const htmlContent =
    typeof htmlFile!.content === 'string'
      ? htmlFile!.content
      : new TextDecoder().decode(htmlFile!.content);

  const playableHtml = injectGsapPlayer(htmlContent);

  // Open a preview in a new browser tab
  const previewBlob = new Blob([playableHtml], { type: 'text/html' });
  window.open(URL.createObjectURL(previewBlob), '_blank');
```

`injectGsapPlayer()` accepts optional overrides:

- **`gsapUrl`** — Custom GSAP CDN URL (default: jsDelivr 3.x). Some platforms whitelist specific CDN URLs and exempt them from file-size limits.
- **`splitTextUrl`** — Custom SplitText CDN URL, or `false` to disable auto-injection.
- **`autoplay`** — Whether to inject the autoplay loop script (default: `true`).

## Customizing the Output

The `FileMap` returned by `exportHtml()` is a standard `Map<string, ExportFile>` extended with `toZip()`. Use `files.get()`, `files.set()`, and `files.delete()` to read, add, or remove files before packaging. Each `ExportFile` has a `content` property (`string` or `Uint8Array`) and an optional `mimeType`.

### Modifying the HTML

We read the `index.html` content as a string, use `String.replace()` to inject an `ad.size` meta tag before `</head>` and a click-tracking script before `</body>`, then write it back with `files.set()`.

```typescript highlight=highlight-customize-html
  // Read the index.html from the external export and inject metadata
  let html = externalResult.files.get('index.html')!.content as string;

  // Inject an ad.size meta tag into the <head>
  const pageWidth = Math.round(engine.block.getWidth(page));
  const pageHeight = Math.round(engine.block.getHeight(page));
  html = html.replace(
    '</head>',
    `  <meta name="ad.size" content="width=${pageWidth},height=${pageHeight}">\n</head>`
  );

  // Inject a click-tracking script before </body>
  const clickScript = `
<script>
  var clickTag = "https://example.com";
  document.addEventListener("click", function() {
    window.open(clickTag, "_blank");
  });
</script>`;
  html = html.replace('</body>', clickScript + '\n</body>');

  // Write the modified HTML back to the FileMap
  externalResult.files.set('index.html', {
    content: html,
    mimeType: 'text/html'
  });
```

The same pattern works for injecting any content — tracking pixels, analytics beacons, platform SDK scripts, or additional stylesheets.

### Adding Extra Files

We add a `manifest.json` describing the bundle dimensions and entry point, then generate a static JPEG backup image using `engine.block.export()` and include it in the bundle.

```typescript highlight=highlight-add-files
  // Add a manifest.json describing the bundle
  externalResult.files.set('manifest.json', {
    content: JSON.stringify(
      {
        version: '1.0',
        title: 'My Creative',
        width: pageWidth,
        height: pageHeight,
        source: 'index.html'
      },
      null,
      2
    ),
    mimeType: 'application/json'
  });

  // Generate a static backup image and add it to the bundle
  const backupBlob = await engine.block.export(page, {
    mimeType: 'image/jpeg',
    jpegQuality: 0.8,
    targetWidth: pageWidth,
    targetHeight: pageHeight
  });
  const backupBytes = new Uint8Array(await backupBlob.arrayBuffer());
  externalResult.files.set('backup.jpg', {
    content: backupBytes,
    mimeType: 'image/jpeg'
  });
```

You can add any file to the bundle this way — data feed templates, custom fonts, or platform-specific configuration files.

## Packaging and Downloading

After all customizations, call `files.toZip()` to produce a `Uint8Array` containing the ZIP archive. We wrap it in a `Blob` and trigger a browser download.

```typescript highlight=highlight-download-zip
  // Package all files as a ZIP and trigger a browser download
  const zip = await externalResult.files.toZip();
  const downloadBlob = new Blob([zip.buffer as ArrayBuffer], {
    type: 'application/zip'
  });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(downloadBlob);
  a.download = 'html5-export.zip';
  a.click();
```

## Troubleshooting

**Exported HTML is blank** — Verify `pageIndex` is within bounds by checking `engine.block.findByType('page').length`. Review `result.messages` for warnings about unsupported blocks.

**Animations do not play** — Ensure the scene mode is `'Video'` or set `animated: true` explicitly. Call `injectGsapPlayer()` on the HTML string before opening it in a browser. Verify the GSAP CDN URL is reachable.

**Bundle rejected for file size** — Use the external format instead of embedded, which inflates size through base64 encoding. Reduce the `quality` option for smaller image assets. Remove unused files from the `FileMap` before calling `toZip()`.

**Missing click tracking or metadata** — Inject the click-tracking script required by your target platform before `</body>`. Add required meta tags to `<head>` and include a `manifest.json` if the platform requires one.

## API Reference

| Method / Type | Description |
|---------------|-------------|
| `exportHtml(engine, options)` | Export a scene page as HTML5 |
| `injectGsapPlayer(html, options?)` | Inject GSAP CDN and autoplay script |
| `FileMap` | Map of export files extending `Map<string, ExportFile>` |
| `FileMap.prototype.toZip()` | Package all files as a ZIP (`Uint8Array`) |
| `ExportHtmlOptions` | Options interface for `exportHtml()` |
| `ExportHtmlResult` | Result with `files` and `messages` |
| `ExportFile` | File entry with `content` and optional `mimeType` |
| `LogMessage` | Export message with `message` and `type` |
| `engine.block.export(block, options)` | Export a block as an image |
| `engine.block.findByType('page')` | Find all pages in the scene |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) — Compare all available export formats
- [Export to MP4](./export-save-publish/export/to-mp4.md) — Export animations as video
- [Export to PNG](./export-save-publish/export/to-png.md) — Export as a static image
- [Compress Exports](./export-save-publish/export/compress.md) — Optimize file sizes



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support