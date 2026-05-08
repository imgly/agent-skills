# Export Options Editor Starter Kit

Export designs in JPG, PNG, or PDF with custom quality, page ranges, and dimensions using CE.SDK's advanced export features. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), runs entirely in the browser with no server dependencies.

<p>
  <a href="https://img.ly/docs/cesdk/js/starterkits/export-options-expopt/">Documentation</a>
</p>

![Export Options Editor starter kit showing an export panel with format, quality, and resolution settings](./hero.webp)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-export-options-ts-web.git
cd starterkit-export-options-ts-web
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

### Export Panel

The key feature of this starterkit is the custom export panel that provides advanced export options:

```typescript
// The export panel is registered as a custom panel
cesdk.ui.registerPanel('//ly.img.panel/export', ({ builder, engine, state }) => {
  // Format selection (JPEG, PNG, PDF)
  // Quality settings (Low, Medium, High, Very High, Maximum)
  // Resolution settings (Small, Medium, Large, Custom)
  // Page range selection for multi-page documents
});

// Navigation bar button to open the export panel
cesdk.ui.registerComponent(
  'ly.img.export-options-design.navigationBar',
  ({ builder }) => {
    builder.Button('export-design-button', {
      label: 'Export',
      onClick: () => cesdk.ui.openPanel('//ly.img.panel/export')
    });
  }
);
```

### Export Formats

The export panel supports three formats:

- **JPEG** – Shareable web format with quality controls
- **PNG** – Complex images with transparency support
- **PDF** – Best for printing, supports page range selection

### Quality Settings

For JPEG and PNG formats, you can select quality levels:

- Low (0.1) – Smallest file size
- Medium (0.4) – Balanced quality and size
- High (0.7) – Good quality, moderate size
- Very High (0.9) – High quality, larger files
- Maximum (1.0) – Best quality, largest files

### Resolution Settings

Control the output resolution with preset options:

- Small (0.5x) – 50% of original resolution
- Medium (1x) – Original resolution
- Large (2x) – Double resolution for high-DPI displays
- Custom – Enter a custom scale factor

### Page Range Selection

For multi-page documents, export options include:

- **All Pages** – Export all pages in the document
- **Range** – Specify pages using comma-separated values (e.g., "1, 3-5, 7")

### Theming

```typescript
cesdk.ui.setTheme('dark'); // 'light' | 'dark' | 'system'
```

See [Theming](https://img.ly/docs/cesdk/web/ui-styling/theming/) for custom color schemes and styling.

### Localization

```typescript
cesdk.i18n.setTranslations({
  de: { 'common.save': 'Speichern' }
});
cesdk.i18n.setLocale('de');
```

See [Localization](https://img.ly/docs/cesdk/web/ui-styling/localization/) for supported languages and translation keys.

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
│       └── export-design-panel.ts
└── index.ts
```

## Key Capabilities

- **Multi-Format Export** – JPEG, PNG, and PDF export options
- **Quality Control** – Adjust output quality for optimal file size
- **Resolution Settings** – Control output resolution from 0.5x to custom scales
- **Page Range Selection** – Export specific pages from multi-page documents
- **Local Download** – Export directly to the user's device
- **Design Tools** – Full design editor with text, shapes, images, and effects

## Prerequisites

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Editor doesn't load | Verify assets are accessible at `baseURL` |
| Assets don't appear | Check `public/assets/` directory exists |
| Watermark appears | Add your license key |
| Export fails | Check browser console for CORS or memory errors |

## Documentation

For complete integration guides and API reference, visit the [Export Options Editor Documentation](https://img.ly/docs/cesdk/starterkits/export-options-editor/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-export-options-editor">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-export-options-editor">IMG.LY</a></p>
