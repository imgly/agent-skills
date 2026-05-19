# Getty Images Editor Starter Kit

CE.SDK can include assets from third-party libraries accessible via API. Search and browse images from [Getty Images](https://www.gettyimages.com/) in the editor. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), runs entirely in the browser with no server dependencies (except for the Getty Images API proxy).

<p>
  <a href="https://img.ly/docs/cesdk/js/starterkits/getty-images-editor-gtyie1/">Documentation</a>
</p>

![Getty Images Editor starter kit showing stock photo integration](./hero.webp)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-getty-asset-source-ts-web.git
cd starterkit-getty-asset-source-ts-web
```

### Set Up Getty Images API Proxy

Getty Images API requires authentication that should be handled server-side. You'll need to set up a proxy server that:

1. Handles Getty Images API authentication securely
2. Accepts query parameters: `query`, `page`, `perPage`
3. Returns data in CE.SDK `AssetsQueryResult` format

Copy `.env.example` to `.env` and add your proxy URL:

```bash
cp .env.example .env
# Edit .env and add your VITE_GETTY_IMAGES_PROXY_URL
```

### Install Dependencies

```bash
npm install
```

### Download Assets

CE.SDK requires engine assets (fonts, icons, UI elements) served from your `public/` directory.

```bash
curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/imgly-assets.zip
unzip imgly-assets.zip -d public/
rm imgly-assets.zip
```

### Run the Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Configuration

### Getty Images Proxy URL

Set your proxy URL in one of two ways:

**Environment Variable (Recommended)**

```bash
# In your .env file
VITE_GETTY_IMAGES_PROXY_URL=https://your-proxy-server.com/getty-api
```

**Programmatically**

```typescript
await initGettyImagesEditor(cesdk, {
  gettyProxyUrl: 'https://your-proxy-server.com/getty-api'
});
```

### Customize Getty Images Integration

```typescript
import { setupGettyImagesAssetSource } from './imgly/plugins/getty-images';

// Add Getty Images to an existing CE.SDK instance
setupGettyImagesAssetSource(cesdk, { proxyUrl: 'https://your-proxy-server.com/getty-api' });
```

### Proxy Server Response Format

Your proxy server should return data in the CE.SDK `AssetsQueryResult` format:

```typescript
interface AssetsQueryResult {
  assets: AssetResult[];
  total: number;
  currentPage: number;
  nextPage: number | undefined;
}

interface AssetResult {
  id: string;
  meta: {
    thumbUri: string;
    uri: string;
    width: number;
    height: number;
    mimeType: string;
  };
  credits?: {
    name: string;
    url: string;
  };
}
```

### Loading Content

Load content into the editor using one of these methods:

```typescript
// Create a blank design canvas
await cesdk.createDesignScene();

// Load from a template archive
await cesdk.loadFromArchiveURL('https://example.com/template.zip');

// Load from a scene file
await cesdk.loadFromURL('https://example.com/scene.json');

// Load from an image
await cesdk.createFromImage('https://example.com/image.jpg');
```

See [Open the Editor](https://img.ly/docs/cesdk/web/guides/open-editor/) for all loading methods.

### Theming

```typescript
cesdk.ui.setTheme('dark'); // 'light' | 'dark' | 'system'
```

See [Theming](https://img.ly/docs/cesdk/web/ui-styling/theming/) for custom color schemes and styling.

## Architecture

```
src/
├── imgly/
│   ├── config/
│   │   ├── actions.ts                # Export/import actions
│   │   ├── features.ts               # Feature toggles
│   │   ├── i18n.ts                   # Translations
│   │   ├── plugin.ts                 # Main configuration plugin
│   │   ├── settings.ts               # Engine settings
│   │   └── ui/
│   │       ├── canvas.ts                 # Canvas configuration
│   │       ├── components.ts             # Custom component registration
│   │       ├── dock.ts                   # Dock layout configuration
│   │       ├── index.ts                  # Combines UI customization exports
│   │       ├── inspectorBar.ts           # Inspector bar layout
│   │       ├── navigationBar.ts          # Navigation bar layout
│   │       └── panel.ts                  # Panel configuration
│   ├── index.ts                  # Editor initialization function
│   └── plugins/
│       └── getty-images.ts
└── index.ts
```

## Key Capabilities

- **Getty Images Integration** – Search and browse premium stock photos via API proxy
- **Text Editing** – Typography with fonts, styles, and effects
- **Image Placement** – Add, crop, and arrange images from Getty Images or uploads
- **Shapes & Graphics** – Vector shapes and design elements
- **Templates** – Start from pre-built design templates
- **Multi-Page** – Create multi-page documents
- **Export** – PNG, JPEG, PDF with quality controls

## Prerequisites

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Getty Images API Proxy** – Server-side proxy for Getty Images API authentication
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Please provide your Getty Images API proxy URL" alert | Add `VITE_GETTY_IMAGES_PROXY_URL` to your `.env` file |
| Editor doesn't load | Verify assets are accessible at `baseURL` |
| Assets don't appear | Check `public/assets/` directory exists |
| Watermark appears | Add your license key |
| Getty Images not loading | Check proxy server is running and accessible |

## Documentation

For complete integration guides and API reference, visit the [Getty Images Editor Documentation](https://img.ly/docs/cesdk/starterkits/getty-images-editor/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-getty-images-editor">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-getty-images-editor">IMG.LY</a></p>
