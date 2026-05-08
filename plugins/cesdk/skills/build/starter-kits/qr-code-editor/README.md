# QR Code Editor Starter Kit

Easily generate and customize QR codes within CE.SDK. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), runs entirely in the browser with no server dependencies.

<p>
  <a href="https://img.ly/docs/cesdk/js/starterkits/qr-code-editor-qrcde1/">Documentation</a>
</p>

![QR Code Editor starter kit showing a graphic design interface](./hero.webp)

## Features

- **QR Code Generation** - Generate QR codes with customizable content:
  - **Canvas Menu**: Right-click in the canvas and select "Generate QR Code"
  - **Dock Panel**: Click the "QR Code" button in the dock to open the generator panel
- **Text Editing** - Typography with fonts, styles, and effects
- **Image Placement** - Add, crop, and arrange images
- **Shapes & Graphics** - Vector shapes and design elements
- **Export** - PNG, PDF with quality controls

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-qr-code-editor-ts-web.git
cd starterkit-qr-code-editor-ts-web
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

## Usage

### Via Canvas Menu
1. Right-click anywhere in the canvas
2. Select "Generate QR Code" from the context menu
3. Enter the URL or text content for your QR code
4. The QR code will be added to your design

### Via Dock Panel
1. Click the "QR Code" button in the dock (left sidebar, bottom)
2. The QR Code Generator panel will open
3. Enter your content and customize the QR code
4. Click to add it to your design

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
│       └── qr-code.ts
└── index.ts
```

**Note:** The demo scene is loaded from the public IMG.LY showcases URL.

## Prerequisites

- **Node.js v20+** with npm - [Download](https://nodejs.org/)
- **Supported browsers** - Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Editor doesn't load | Verify assets are accessible at `baseURL` |
| Assets don't appear | Check `public/assets/` directory exists |
| Watermark appears | Add your license key |
| QR Code panel missing | Ensure `@imgly/plugin-qr-code-web` is installed |

## Documentation

For complete integration guides and API reference, visit the [QR Code Plugin Documentation](https://img.ly/docs/cesdk/js/plugins/qr-code/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-qr-code-editor">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-qr-code-editor">IMG.LY</a></p>
