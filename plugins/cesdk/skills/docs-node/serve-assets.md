> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Serve Assets](./serve-assets.md)

---

Configure CE.SDK to load engine assets from your own servers or local filesystem for server-side deployments.

The `@cesdk/node` package bundles the core WASM engine files directly. No additional setup is required to initialize the engine and use its APIs.

For rendering-only workflows (loading existing scenes and exporting to PDF, PNG, or video), the engine loads scene-referenced assets directly from their embedded URLs. You only need to configure asset paths if you want to self-host font fallback files or emoji assets.

[Download Assets (v$UBQ\_VERSION$)](https://cdn.img.ly/packages/imgly/cesdk-node/$UBQ_VERSION$/imgly-assets.zip)

## Understanding Asset Categories

The `imgly-assets.zip` contains directories organized by function:

| Directory                       | Contents                        | Bundled in npm? | When Needed                         |
| ------------------------------- | ------------------------------- | --------------- | ----------------------------------- |
| `core/`                         | WASM engine files               | **Yes**         | Always (bundled)                    |
| `i18n/`                         | Translations                    | **Yes**         | Always (bundled)                    |
| `emoji/`                        | Emoji assets                    | No              | If rendering emojis                 |
| `fonts/`                        | System fonts                    | No              | If using system fonts               |

> **Note:** Asset source directories (`ly.img.sticker/`, `ly.img.filter/`, etc.) are only used in browser builds. The server package does not use asset source plugins.

## Engine-Level Assets

The engine uses additional assets for font fallback (Unicode character coverage) and emoji rendering. By default, these are loaded from `https://cdn.img.ly/assets/v4`. When you configure the `basePath` setting for your engine, font fallback files and the emoji font are automatically loaded from that location:

- **Font fallback files** — Used when text contains characters not covered by the selected font. Located at `{basePath}/fonts/font-{index}.ttf`.
- **Emoji font** — The default emoji font (NotoColorEmoji.ttf). Located at `{basePath}/emoji/NotoColorEmoji.ttf`.

The `fonts/` and `emoji/` directories are already included in the `imgly-assets.zip` download. When you set up self-hosted assets and configure `basePath`, ensure these directories are present at your `basePath` location.

## Self-Hosting Assets

### Using Local Filesystem

Use Node.js `pathToFileURL()` to load assets directly from disk:

```javascript
import CreativeEngine from '@cesdk/node';
import path from 'path';
import { pathToFileURL } from 'url';

const engine = await CreativeEngine.init({
  license: 'YOUR_CESDK_LICENSE_KEY',
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
  license: 'YOUR_CESDK_LICENSE_KEY',
  baseURL: `https://cdn.yourdomain.com/cesdk/${CreativeEngine.version}/`
});
```

## Troubleshooting

### File URL Formatting

When using `file://` URLs:

- Use `path.resolve()` to get absolute paths
- URLs must end with a trailing slash for directories
- Always use `pathToFileURL()` from the `url` module instead of string concatenation

> **Caution:** **License validation requires network access**: The engine validates your license key against `api.img.ly` during initialization. Ensure your server environment allows outbound HTTPS connections to this endpoint.

## API Reference

| Method/Config | Purpose |
|--------------|---------|
| `CreativeEngine.init(config)` | Initialize engine with configuration |
| `engine.editor.setSettingString('basePath', url)` | Set base path for resolving relative paths and loading font/emoji assets |
| `CreativeEngine.version` | Get current SDK version string |
| `pathToFileURL(path)` | Convert filesystem path to `file://` URL (Node.js `url` module) |



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support