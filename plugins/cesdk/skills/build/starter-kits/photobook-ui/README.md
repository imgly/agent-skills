# CE.SDK Photobook UI Starterkit

Custom UI for building photo books focusing on theming, page layouts, and managing photo assets. Built with React and [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), this starterkit demonstrates how to build a fully-featured multi-page photobook editor with custom UI components.

## Features

- **Multi-Page Navigation**: Navigate between photobook pages with thumbnail previews
- **Custom Layouts**: Apply pre-designed layouts to pages
- **Custom Stickers**: Add decorative stickers to pages
- **Image Upload & Management**: Upload images and manage them across pages
- **Text Editing**: Add and customize text with fonts, colors, and alignment
- **Shape Tools**: Add and customize shapes with color controls
- **Unsplash Integration**: Search and add images from Unsplash
- **Theme Support**: Apply color themes across the photobook
- **Background Customization**: Change page background colors
- **Undo/Redo**: Full history management
- **Export**: Export photobook pages as images

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- CE.SDK license key (get yours at [img.ly](https://img.ly))

### Installation

1. Clone this repository or download the starterkit
2. Install dependencies:

```bash
npm install
```

3. Set up your CE.SDK license:

```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your license key
VITE_CESDK_LICENSE=your-license-key-here
```

### Development

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── app/                          # Demo application
├── imgly/
│   ├── index.ts                  # Editor initialization function
│   ├── photobook-layouts.ts
│   ├── photobook-stickers.ts
│   └── utils/
│       ├── UnsplashSource.ts
│       ├── apply-layout.ts
│       ├── engine-utils.ts
│       └── loadAssetSourceFromContentJSON.ts
└── index.tsx                 # Application entry point
```

## Key Concepts

### Engine Context

The `EngineProvider` initializes and manages the CE.SDK engine instance. It handles:

- Engine initialization with configuration
- Plugin registration (asset sources, upload, etc.)
- Global settings

### Single Page Mode

The `SinglePageModeProvider` manages the photobook's page-by-page editing experience:

- Shows one page at a time
- Handles page navigation
- Manages zoom and focus
- Provides padding configuration

### Page Previews

The `PagePreviewProvider` generates and manages page thumbnails for navigation.

### Editor Context

The `EditorContext` provides high-level photobook operations:

- Scene loading
- Asset management
- Color palette access

### Selection Management

The `SelectionProvider` ensures only one element is selected at a time, preventing multi-selection issues.

## Customization

### Adding Custom Layouts

Edit `src/imgly/photobook-layouts.ts` to add new layout templates:

```typescript
export const PHOTOBOOK_LAYOUTS = {
  version: '1.0.0',
  id: 'ly.img.layouts',
  assets: [
    {
      id: 'my-layout',
      label: { en: 'My Layout' },
      meta: {
        thumbUri: '/path/to/thumbnail.png',
        uri: '/path/to/layout.scene'
      }
    }
  ]
};
```

### Adding Custom Stickers

Edit `src/imgly/photobook-stickers.ts` to add new stickers.

### Customizing UI

All UI components are in `src/app/ui/` and use CSS modules for styling. Components can be customized by editing their `.module.css` files.

## Asset Sources

The starterkit includes:

- **Upload Sources**: Image, video, and audio uploads
- **Unsplash**: Stock photo integration
- **Custom Layouts**: Pre-designed page layouts
- **Custom Stickers**: Decorative elements
- **Vector Shapes**: Built-in shapes
- **Text & Fonts**: Typography controls
- **Color Palettes**: Theme colors

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check:syntax` - Type check TypeScript
- `npm run check:lint` - Lint code
- `npm run check:format` - Check code formatting
- `npm run fix:all` - Fix linting and formatting issues

## Learn More

- [CE.SDK Documentation](https://img.ly/docs/cesdk)
- [CE.SDK Web API Reference](https://img.ly/docs/cesdk/web/engine/api)
- [More Starterkits](https://img.ly/docs/cesdk/web/starterkits)

## License

This starterkit is provided under the CE.SDK license terms.
