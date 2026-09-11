# CE.SDK Apparel UI Starterkit

Custom, mobile apparel UI for creating print-ready design. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly), this starterkit provides a complete custom React UI for designing apparel products like t-shirts, hoodies, and other garments with a streamlined editor experience.

## Features

- Custom React UI for apparel design
- Product catalog with customizable templates
- Image upload and positioning
- Text editing with font selection
- Shape and sticker library
- Color palette customization
- Live preview mode
- Export functionality

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── app/                          # Demo application
├── imgly/
│   ├── ColorUtilities.ts
│   ├── CreativeEngineUtils.ts
│   ├── UnsplashSource.ts
│   ├── UseEditMode.ts
│   ├── UseHistory.ts
│   ├── UseImageUpload.ts
│   ├── UseSelectedProperty.ts
│   └── index.ts                  # Editor initialization function
└── index.tsx                 # Application entry point
```

## Architecture

This starterkit follows the **Feature-Sliced Design** pattern with a clear separation between UI logic (`src/app/`) and CE.SDK operations (`src/imgly/`).

### Key Principles

- **Self-contained**: The starterkit is completely standalone and runnable
- **React-based**: Modern React with TypeScript
- **CSS Modules**: Scoped styling without external dependencies
- **Type-safe**: Full TypeScript coverage

### CE.SDK Integration

The `src/imgly/` directory contains all CE.SDK-specific operations and must remain self-contained (no imports from `../app/`). This separation ensures:

- Clear separation of concerns
- Easier testing and maintenance
- Reusable CE.SDK operations

## License

This starterkit is part of the CE.SDK ecosystem. See the main CE.SDK license for details.
