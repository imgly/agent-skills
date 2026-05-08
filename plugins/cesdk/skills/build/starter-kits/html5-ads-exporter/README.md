# HTML5 Exporter Starter Kit

A design editor with HTML5 export capabilities including embedded/external format options, text rendering modes, and ZIP download. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), runs entirely in the browser with no server dependencies.

<p>
  <a href="https://img.ly/docs/cesdk/js/starterkits/html5-ads-exporter-h5adx1/">Documentation</a>
</p>

![HTML5 Ads Exporter starter kit showing the design editor with HTML5 export panel](./hero.webp)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-html5-ads-exporter-ts-web.git
cd starterkit-html5-ads-exporter-ts-web
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

### HTML5 Export Panel

The key feature of this starterkit is the custom HTML5 export panel that provides advanced export options:

```typescript
// The export panel is registered as a custom panel
cesdk.ui.registerPanel('//ly.img.panel/html5-export', ({ builder, engine, state }) => {
  // Format selection (Embedded single HTML vs External with separate assets)
  // Text rendering mode (HTML text vs Vectorized)
  // Page index selection for multi-page scenes
});

// Navigation bar button to open the export panel
cesdk.ui.registerComponent(
  'ly.img.html5-export.navigationBar',
  ({ builder }) => {
    builder.Button('html5-export-button', {
      label: 'Export',
      onClick: () => cesdk.ui.openPanel('//ly.img.panel/html5-export')
    });
  }
);
```

### Export Formats

The export panel supports two HTML5 output formats:

- **Embedded** - Single self-contained HTML file with base64-embedded assets (images, fonts)
- **External** - HTML file with separate image and font asset files, downloadable as ZIP

### Text Rendering Modes

- **HTML Text** - Selectable and searchable text rendered with CSS styling
- **Vector** - Pixel-perfect vectorized text (not selectable, but visually identical to the design)

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
│       └── html5-export-panel.ts # HTML5 export panel plugin
└── index.ts
```

## Key Capabilities

- **HTML5 Export** - Export designs as responsive HTML5 output
- **Embedded Format** - Single self-contained HTML file with base64 assets
- **External Format** - HTML with separate asset files, downloadable as ZIP
- **Text Modes** - Choose between selectable HTML text or pixel-perfect vector text
- **Preview** - Preview exported HTML5 in a new browser tab
- **ZIP Download** - Package external exports as downloadable ZIP archives
- **Design Tools** - Full design editor with text, shapes, images, and effects

## Prerequisites

- **Node.js v20+** with npm - [Download](https://nodejs.org/)
- **Supported browsers** - Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Editor doesn't load | Verify assets are accessible at `baseURL` |
| Assets don't appear | Check `public/assets/` directory exists |
| Watermark appears | Add your license key |
| Export fails | Check browser console for CORS or memory errors |
| Preview doesn't open | Ensure pop-ups are not blocked by your browser |

## Documentation

For complete integration guides and API reference, visit the [HTML5 Export Documentation](https://img.ly/docs/cesdk/js/export/to-html5/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-html5-ads-exporter">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-html5-ads-exporter">IMG.LY</a></p>
