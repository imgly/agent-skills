> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Serve Assets](./serve-assets.md)

---

Configure CE.SDK to load default and demo assets from your own servers or local filesystem for server-side deployments.

The `@cesdk/node` package bundles the core WASM engine files directly—no additional setup is required to initialize the engine and use its APIs. You only need to configure asset paths if you use `addDefaultAssetSources()` or `addDemoAssetSources()` to populate the asset library.

For rendering-only workflows (loading existing scenes and exporting to PDF, PNG, or video), you can skip asset configuration entirely. The engine loads scene-referenced assets directly from their embedded URLs.

[Download Assets (v$UBQ\_VERSION$)](https://cdn.img.ly/packages/imgly/cesdk-node/$UBQ_VERSION$/imgly-assets.zip)

This guide covers how to self-host default assets when you need them, either from the local filesystem or your own CDN.

## Quick Start

Download and extract the essential assets for your SDK version:

```bash
# Download assets for current SDK version
curl -O https://cdn.img.ly/packages/imgly/cesdk-node/$UBQ_VERSION$/imgly-assets.zip

# Create versioned directory and extract assets
mkdir -p cesdk-assets/$UBQ_VERSION$
unzip imgly-assets.zip -d cesdk-assets/$UBQ_VERSION$/
rm imgly-assets.zip
```

Then configure CE.SDK to use your local assets:

```javascript
import CreativeEngine from '@cesdk/node';
import path from 'path';
import { pathToFileURL } from 'url';

const engine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY'
});

// Point to local assets instead of CDN
engine.addDefaultAssetSources({
  baseURL: pathToFileURL(path.resolve(`./cesdk-assets/${CreativeEngine.version}`)).href + '/'
});
```

> **Caution:** **License validation requires network access**: The engine validates your license key against `api.img.ly` during initialization. Ensure your server environment allows outbound HTTPS connections to this endpoint.

## Understanding Asset Categories

The `imgly-assets.zip` contains directories organized by function:

| Directory                       | Contents                        | Bundled in npm? | When Needed                         |
| ------------------------------- | ------------------------------- | --------------- | ----------------------------------- |
| `core/`                         | WASM engine files               | **Yes**         | Always (bundled)                    |
| `i18n/`                         | Translations                    | **Yes**         | Always (bundled)                    |
| `emoji/`                        | Emoji assets                    | No              | If rendering emojis                 |
| `fonts/`                        | System fonts                    | No              | If using system fonts               |
| `ui/`                           | UI resources                    | No              | Browser only                        |
| `ly.img.sticker/`               | Stickers                        | No              | If using `addDefaultAssetSources()` |
| `ly.img.sticker.misc/`          | Additional stickers             | No              | If using `addDefaultAssetSources()` |
| `ly.img.vectorpath/`            | Shapes and arrows               | No              | If using `addDefaultAssetSources()` |
| `ly.img.typeface/`              | Font definitions                | No              | If using `addDefaultAssetSources()` |
| `ly.img.filter.lut/`            | LUT filter effects              | No              | If using `addDefaultAssetSources()` |
| `ly.img.filter.duotone/`        | Duotone effects                 | No              | If using `addDefaultAssetSources()` |
| `ly.img.effect/`                | Visual effects                  | No              | If using `addDefaultAssetSources()` |
| `ly.img.blur/`                  | Blur presets                    | No              | If using `addDefaultAssetSources()` |
| `ly.img.colors.defaultPalette/` | Color palettes                  | No              | If using `addDefaultAssetSources()` |
| `ly.img.crop.presets/`          | Crop aspect ratios              | No              | If using `addDefaultAssetSources()` |
| `ly.img.page.presets/`          | Page format presets             | No              | If using `addDefaultAssetSources()` |
| `ly.img.page.presets.video/`    | Video page presets              | No              | If using `addDefaultAssetSources()` |
| `ly.img.captionPresets/`        | Caption formatting presets      | No              | If using `addDefaultAssetSources()` |
| `ly.img.animation/`             | Animation presets               | No              | If using `addDefaultAssetSources()` |
| `ly.img.animation.text/`        | Text animation presets          | No              | If using `addDefaultAssetSources()` |
| `ly.img.image/`                 | Sample images (demo content)    | No              | Development only                    |
| `ly.img.video/`                 | Sample videos (demo content)    | No              | Development only                    |
| `ly.img.audio/`                 | Sample audio (demo content)     | No              | Development only                    |
| `ly.img.template/`              | Design templates (demo content) | No              | Development only                    |
| `ly.img.video.template/`        | Video templates (demo content)  | No              | Development only                    |
| `ly.img.textComponents/`        | Text components (demo content)  | No              | Development only                    |

For most server-side integrations, you need the `ly.img.*` asset sources you use.

### Default Asset Sources

Calling `addDefaultAssetSources()` registers these asset sources:

- `ly.img.sticker` - Stickers
- `ly.img.sticker.misc` - Additional stickers
- `ly.img.vectorpath` - Shapes and arrows
- `ly.img.typeface` - Font definitions
- `ly.img.colors.defaultPalette` - Color palettes
- `ly.img.filter.lut` - LUT effects
- `ly.img.filter.duotone` - Duotone effects
- `ly.img.effect` - Visual effects
- `ly.img.blur` - Blur presets
- `ly.img.crop.presets` - Crop aspect ratios
- `ly.img.page.presets` - Page format presets
- `ly.img.page.presets.video` - Video page presets
- `ly.img.captionPresets` - Caption formatting
- `ly.img.animation` - Animation presets
- `ly.img.animation.text` - Text animation presets

## Configuration

### Using Local Filesystem

Use Node.js `pathToFileURL()` to load assets directly from disk:

```javascript
import CreativeEngine from '@cesdk/node';
import path from 'path';
import { pathToFileURL } from 'url';

const engine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY'
});

// Load default assets from local filesystem
engine.addDefaultAssetSources({
  baseURL: pathToFileURL(path.resolve(`./cesdk-assets/${CreativeEngine.version}`)).href + '/'
});

// Use the engine for processing
// ...

// Clean up when done
engine.dispose();
```

The `file://` protocol loads assets directly from the filesystem without network overhead.

### Using Your Own CDN

If you prefer serving assets from your own CDN:

```javascript
import CreativeEngine from '@cesdk/node';

const engine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY'
});

engine.addDefaultAssetSources({
  baseURL: `https://cdn.yourdomain.com/cesdk/${CreativeEngine.version}/`
});
```

### Engine-Level Assets

The engine uses additional assets for font fallback (Unicode character coverage) and emoji rendering. By default, these are loaded from `https://cdn.img.ly/assets/v4`. When you configure the `basePath` setting for your engine, font fallback files and the emoji font are automatically loaded from that location:

- **Font fallback files** — Used when text contains characters not covered by the selected font. Located at `{basePath}/fonts/font-{index}.ttf`.
- **Emoji font** — The default emoji font (NotoColorEmoji.ttf). Located at `{basePath}/emoji/NotoColorEmoji.ttf`.

The `fonts/` and `emoji/` directories are already included in the `imgly-assets.zip` download. When you set up self-hosted assets and configure `basePath`, ensure these directories are present at your `basePath` location.

## Excluding Unused Asset Sources

If you only need specific assets, exclude the rest to reduce initialization time:

```javascript
engine.addDefaultAssetSources({
  baseURL: pathToFileURL(path.resolve(`./cesdk-assets/${CreativeEngine.version}`)).href + '/',
  excludeAssetSourceIds: [
    'ly.img.sticker',
    'ly.img.page.presets.video'
  ]
});
```

## Troubleshooting

### 404 Errors for Assets

If you see errors loading `content.json` files:

1. Verify the `baseURL` in `addDefaultAssetSources()` is correct
2. Check that asset directories exist at the expected paths
3. For file-based assets, ensure read permissions are set correctly

### File URL Formatting

When using `file://` URLs:

- Use `path.resolve()` to get absolute paths
- URLs must end with a trailing slash for directories
- Always use `pathToFileURL()` from the `url` module instead of string concatenation

## API Reference

| Method/Config | Purpose |
|--------------|---------|
| `CreativeEngine.init(config)` | Initialize engine with configuration |
| `engine.addDefaultAssetSources(options)` | Register default asset sources |
| `engine.addDemoAssetSources(options)` | Register demo asset sources |
| `engine.editor.setSettingString('basePath', url)` | Set base path for resolving relative paths and loading font/emoji assets |
| `CreativeEngine.version` | Get current SDK version string |
| `pathToFileURL(path)` | Convert filesystem path to `file://` URL (Node.js `url` module) |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support