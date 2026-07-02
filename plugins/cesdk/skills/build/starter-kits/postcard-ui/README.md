# Postcard UI - CE.SDK Starterkit

Built to facilitate optimal post- and greeting-card design, from changing accent colors and selecting fonts to custom messages and pictures. Built with [CE.SDK](https://img.ly/creative-sdk) and React by [IMG.LY](https://img.ly), featuring a step-by-step workflow for creating personalized greeting cards.

## Features

- **Three-Step Workflow**:
  - **Style**: Choose from pre-designed postcard templates
  - **Design**: Customize colors, images, and layout on the front
  - **Write**: Compose your message and customize typography on the back

- **Template Library**: Four beautiful pre-designed templates (Thank You, Merry Christmas, Bonjour Paris, Wish You Were Here)
- **Custom UI Components**: 50+ React components for a tailored editing experience
- **Asset Integration**: Unsplash integration, upload support, stickers, and shapes
- **Real-time Preview**: See your changes instantly in the canvas
- **Dual-Page Editing**: Separate front and back page customization

## Getting Started

### Prerequisites

- Node.js 22+ and npm
- CE.SDK license key (set in `.env` as `VITE_CESDK_LICENSE`)

### Installation

```bash
npm install
```

### Development

```bash
# Start development server
npm run dev

# Start with local CE.SDK assets (monorepo only)
npm run dev:local
```

### Build

```bash
# Production build
npm run build

# Build with local CE.SDK assets (monorepo only)
npm run build:local
```

## Project Structure

```
src/
├── app/                          # Demo application
├── imgly/
│   ├── CreativeEditor.tsx
│   ├── CreativeEngine.tsx
│   ├── contexts/
│   │   ├── EngineContext.tsx
│   │   ├── SelectionContext.tsx
│   │   └── SinglePageModeContext.tsx
│   ├── createApplyLayoutAsset.js
│   ├── hooks/
│   │   ├── UseEditMode.ts
│   │   ├── UseHistory.ts
│   │   ├── UseImageUpload.ts
│   │   ├── UseSelectedProperty.ts
│   │   └── UseSinglePageFocus.ts
│   ├── index.ts                  # Editor initialization function
│   ├── loadAssetSourceFromContentJSON.ts
│   ├── localDownload.ts
│   ├── postcard-catalog.ts
│   └── utils/
│       ├── ColorUtilities.ts
│       ├── CreativeEngineUtils.js
│       └── UnsplashSource.ts
└── index.tsx                 # Application entry point
```

## Architecture

This starterkit follows a clear separation of concerns:

- **`src/app/`**: React components and application logic
  - Self-contained UI components with CSS modules
  - Application-specific contexts for editor state and page settings

- **`src/imgly/`**: CE.SDK integration layer
  - Engine initialization and configuration
  - Reusable hooks and utilities
  - Asset source configuration

The `src/imgly/` directory is designed to be self-contained and reusable across different projects.

## Key Components

### Contexts

- **EditorContext**: Manages template selection, scene loading, step navigation, and asset discovery
- **PageSettingsContext**: Controls front/back page customization (colors, fonts, sizes)
- **EngineContext**: Wraps CE.SDK engine initialization
- **SinglePageModeContext**: Handles single-page focus mode with scroll support
- **SelectionContext**: Tracks currently selected blocks

### UI Components

The starterkit includes 50+ UI components organized by function:

- **Bottom Controls**: Main editing toolbar (AddImage, AddText, AddShape, AddSticker, etc.)
- **Secondary Toolbars**: Context-aware property panels
- **Dropdowns**: Color picker, font selector, text size selector
- **Canvas**: CE.SDK canvas wrapper
- **Navigation**: Process step navigation, undo/redo
- **Export**: PDF/PNG export functionality

## Customization

### Adding New Templates

Edit `src/imgly/postcard-catalog.ts`:

```typescript
export const POSTCARD_TEMPLATES: Record<string, PostcardTemplate> = {
  my_template: {
    name: 'My Template',
    colors: ['#FF0000', '#FFFFFF', '#000000'],
    preview: '/templates/my_template.png',
    scene: '/templates/my_template.scene',
    keyword: 'Search keyword for Unsplash'
  }
};
```

### Customizing the Workflow

Modify `ALL_STEPS` in `src/app/contexts/EditorContext.tsx` to add or remove steps:

```typescript
export const ALL_STEPS = ['Style', 'Design', 'Write', 'Review'] as const;
```

### Styling

All components use CSS modules for scoped styling. Global styles are defined in `index.html`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run check:syntax` - TypeScript type checking
- `npm run check:format` - Prettier formatting check
- `npm run check:lint` - ESLint checking
- `npm run check:all` - Run all checks
- `npm run fix:all` - Auto-fix formatting and linting issues

## License

See the main repository LICENSE file.

## Support

For questions and support, visit [img.ly/docs](https://img.ly/docs/cesdk/)
