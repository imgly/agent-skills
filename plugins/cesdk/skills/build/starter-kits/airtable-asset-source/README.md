# Airtable Image Editor Starter Kit

CE.SDK can include assets from third-party libraries accessible via API. Search and browse images from an [Airtable](https://airtable.com/) spreadsheet in the editor. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), runs entirely in the browser with no server dependencies.

<p>
  <a href="https://img.ly/docs/cesdk/js/starterkits/airtable-image-editor-artbl1/">Documentation</a>
</p>

![Airtable Image Editor starter kit showing custom asset source integration](./hero.webp)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-airtable-asset-source-react-web.git
cd starterkit-airtable-asset-source-react-web
```

### Get Your Airtable API Key

1. Sign in to your [Airtable](https://airtable.com/) account
2. Get your API key from [Airtable Account](https://airtable.com/account)
3. Copy `.env.example` to `.env` and add your API key:

```bash
cp .env.example .env
# Edit .env and add your VITE_AIRTABLE_API_KEY
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

### Airtable API Key

Set your API key in one of two ways:

**Environment Variable (Recommended)**

```bash
# In your .env file
VITE_AIRTABLE_API_KEY=your_api_key_here
```

**Programmatically**

```typescript
await initAirtableImageEditor(cesdk, {
  airtableApiKey: 'your_api_key_here'
});
```

### Customize Airtable Integration

```typescript
import { setupAirtableAssetSource } from './imgly/plugins/airtable';

// Add Airtable to an existing CE.SDK instance
setupAirtableAssetSource(cesdk, { apiKey: 'your_api_key' });
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
├── app/                          # Demo application
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
│       └── airtable.ts
└── index.tsx                 # Application entry point
```

## Key Capabilities

- **Airtable Integration** – Browse and search images from your Airtable database
- **Text Editing** – Typography with fonts, styles, and effects
- **Image Placement** – Add, crop, and arrange images from Airtable or uploads
- **Shapes & Graphics** – Vector shapes and design elements
- **Templates** – Start from pre-built design templates
- **Multi-Page** – Create multi-page documents
- **Export** – PNG, JPEG, PDF with quality controls

## Prerequisites

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Airtable API Key** – Get from your [Airtable account](https://airtable.com/account)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Please provide your Airtable API key" alert | Add `VITE_AIRTABLE_API_KEY` to your `.env` file |
| Editor doesn't load | Verify assets are accessible at `baseURL` |
| Assets don't appear | Check `public/assets/` directory exists |
| Watermark appears | Add your license key |

## Documentation

For complete integration guides and API reference, visit the [Airtable Image Editor Documentation](https://img.ly/docs/cesdk/starterkits/airtable-image-editor/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-airtable-image-editor">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-airtable-image-editor">IMG.LY</a></p>
