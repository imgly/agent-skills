# Video Player Starter Kit

Lightweight video playback for your web app — play, pause, and navigate video content. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), runs entirely in the browser with no server dependencies.

<p>
  <a href="https://img.ly/docs/cesdk/js/starterkits/player-6sjm1w/">Documentation</a>
</p>

![Video Player starter kit showing a video playback interface](./hero.webp)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-video-player-ts-web.git
cd starterkit-video-player-ts-web
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

### Loading Content

Load content into the player using one of these methods:

```typescript
// Load from a template archive
await cesdk.loadFromArchiveURL('https://example.com/video.zip');

// Load from a scene file
await cesdk.loadFromURL('https://example.com/scene.json');

// Zoom to fit the content
await cesdk.actions.run('zoom.toPage', {
  page: 'first',
  autoFit: true,
  padding: 24
});
```

See [Open the Editor](https://img.ly/docs/cesdk/web/guides/open-editor/) for all loading methods.

### Theming

```typescript
cesdk.ui.setTheme('dark'); // 'light' | 'dark' | 'system'
```

See [Theming](https://img.ly/docs/cesdk/web/ui-styling/theming/) for custom color schemes and styling.

### Localization

```typescript
cesdk.i18n.setTranslations({
  de: { 'common.play': 'Video abspielen' }
});
cesdk.i18n.setLocale('de');
```

See [Localization](https://img.ly/docs/cesdk/web/ui-styling/localization/) for supported languages and translation keys.

## Architecture

```
starterkit-video-player-ts-web/
├── src/
│   ├── index.ts              # Application entry point
│   └── imgly/
│       ├── index.ts          # Player initialization
│       └── config/
│           ├── plugin.ts         # Main plugin orchestration
│           ├── actions.ts        # Actions configuration
│           ├── features.ts       # Feature toggles
│           ├── settings.ts       # Engine behavior
│           ├── i18n.ts           # Internationalization
│           └── ui/               # UI layout configuration
├── public/                   # Static assets
├── package.json
└── vite.config.ts
```

## Key Capabilities

- **Playback Controls** – Play, pause, and seek through video content
- **Timeline Navigation** – Scrub through the timeline to preview any point
- **Zoom Controls** – Zoom in/out with fit-to-screen options
- **Page Navigation** – Navigate multi-page video projects
- **Read-Only Mode** – Display content without editing capabilities
- **Lightweight Interface** – Minimal UI focused on playback

## Prerequisites

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Player doesn't load | Verify assets are accessible at `baseURL` |
| Content doesn't appear | Check `public/assets/` directory exists |
| Video doesn't play | Check browser autoplay policies and video format (MP4, WebM) |
| Watermark appears | Add your license key |

## Documentation

For complete integration guides and API reference, visit the [Video Player Documentation](https://img.ly/docs/cesdk/starterkits/player/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-video-player">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-video-player">IMG.LY</a></p>
