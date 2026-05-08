# Export Using Renderer Starter Kit

The Renderer brings CE.SDK's design engine to your backend with fast, compliant, enterprise-ready export for images, PDFs, and video, enabling organizations to generate media at scale with full fidelity and predictable performance. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), this starterkit demonstrates how to export videos using the CE.SDK Renderer service for server-side rendering.

<p>
  <a href="https://img.ly/docs/cesdk/js/starterkits/export-using-renderer-exprnd/">Documentation</a>
</p>

![Export Using Renderer starter kit showing a video editing interface with server-side rendering export](./hero.webp)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-export-using-renderer-ts-web.git
cd starterkit-export-using-renderer-ts-web
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

### Renderer URL

Configure the CE.SDK Renderer endpoint for server-side video rendering:

```typescript
import { getRendererURL, DEFAULT_RENDERER_URL } from './imgly';

// Default renderer URL (cloud-hosted)
const rendererUrl = DEFAULT_RENDERER_URL;

// Or use a custom renderer endpoint
const customRendererUrl = 'https://your-renderer.example.com/api/render';
```

### Loading Content

Load content into the editor using one of these methods:

```typescript
// Create a blank video scene
await cesdk.createVideoScene();

// Load from a template archive
await cesdk.loadFromArchiveURL('https://example.com/video-template.zip');

// Load from a scene file
await cesdk.loadFromURL('https://example.com/scene.json');

// Load from a video URL
await cesdk.createFromVideo('https://example.com/video.mp4');
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
│   └── renderer.ts
└── index.ts
```

## Key Capabilities

- **Server-Side Rendering** – Export videos using CE.SDK Renderer service
- **Video Editing** – Full video editing capabilities with timeline
- **Custom Export Actions** – New Design, New Video, and Export using Renderer buttons
- **Multi-Track Timeline** – Layer video, audio, and graphics tracks
- **Professional Export** – High-quality video rendering on the server

## Prerequisites

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+
- **CE.SDK Renderer** – Server-side rendering service (cloud-hosted or self-hosted)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Editor doesn't load | Verify assets are accessible at `baseURL` |
| Assets don't appear | Check `public/assets/` directory exists |
| Export fails | Verify renderer URL is correct and accessible |
| Watermark appears | Add your license key |

## Documentation

For complete integration guides and API reference, visit the [Export Using Renderer Documentation](https://img.ly/docs/cesdk/starterkits/export-using-renderer/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-export-using-renderer">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-export-using-renderer">IMG.LY</a></p>
