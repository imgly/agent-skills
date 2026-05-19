# CE.SDK Photo UI Starterkit

Photo UI is equipped with advanced photo editing options while remaining easy and intuitive to use. Try the demo and see for yourself. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), featuring a mobile-optimized interface with crop, filters, and adjustments.

## Features

- **Crop & Transform**: Crop, rotate, flip, and straighten photos
- **Filters**: Apply LUT-based filters with intensity control
- **Adjustments**: Fine-tune brightness, contrast, saturation, and more
- **Mobile-Optimized**: Touch-friendly interface with responsive layout
- **Image Upload**: Replace images with your own photos
- **Undo/Redo**: Full history support

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A CE.SDK license (optional for development)

### Installation

```bash
npm install
```

### Development

```bash
# Start development server
npm run dev

# Start with local CE.SDK build (for monorepo development)
npm run dev:local
```

The application will be available at `http://localhost:5173`.

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/                          # Demo application
├── imgly/
│   ├── engine-utils.ts
│   ├── hooks/
│   │   ├── useSelectedProperty.ts
│   │   └── useSinglePageFocus.ts
│   ├── index.ts                  # Editor initialization function
│   └── upload.ts
└── index.tsx                 # Application entry point
```

## Architecture

This starterkit follows a Feature-Sliced Design approach:

- **`src/app/`**: UI components and React-specific code
  - Uses React hooks and contexts
  - Imports from `src/imgly/` for CE.SDK operations
  - Self-contained UI components with CSS modules

- **`src/imgly/`**: CE.SDK operations and utilities
  - Self-contained, no imports from `src/app/`
  - Reusable across different UI implementations
  - Type-safe TypeScript interfaces

## Key Components

### EditorContext

The `EditorContext` manages the CE.SDK engine instance and scene state:

- Engine initialization and lifecycle
- Scene setup (photo editing scene)
- Edit mode state (Transform, Crop)
- Image selection and replacement
- Single-page focus utilities

### PhotoUI

The main UI component that orchestrates:

- Top bar (undo, redo, download)
- Canvas rendering
- Bottom controls (crop, adjust, filter)
- Loading states

### Bottom Controls

Tabbed interface with secondary bars:

- **Crop**: Straighten, scale, flip, rotate tools
- **Adjust**: Brightness, contrast, saturation, etc.
- **Filter**: LUT-based filter gallery

## Configuration

### License

Set your CE.SDK license in a `.env` file:

```bash
VITE_CESDK_LICENSE=your-license-key-here
```

### Sample Images

Sample images are located in `public/images/`. You can replace them with your own photos.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:local` | Start with local CE.SDK build |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check:all` | Run all checks (syntax, format, lint) |
| `npm run fix:all` | Fix formatting and linting issues |

## Learn More

- [CE.SDK Documentation](https://img.ly/docs/cesdk/)
- [CE.SDK Web API Reference](https://img.ly/docs/cesdk/web/engine/)
- [More Starterkits](https://img.ly/docs/cesdk/starterkits/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
