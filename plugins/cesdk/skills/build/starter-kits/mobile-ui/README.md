# Mobile UI Starterkit

Easily build custom mobile UIs and provide a seamless design editing experience for your users, on both iOS and Android. Built with [CE.SDK](https://img.ly/creative-sdk) and React by [IMG.LY](https://img.ly), this starterkit demonstrates how to build a complete custom editor interface from scratch with touch-optimized controls and mobile-first design patterns.

## Features

- **Mobile-First Design**: Optimized for touch interactions and mobile viewports
- **Complete Custom UI**: No default CE.SDK UI components - built entirely with React
- **Responsive Layout**: Adapts from mobile to desktop viewports
- **Full Editor Controls**: Text editing, image manipulation, shapes, stickers, and more
- **Touch-Optimized**: Gesture-friendly controls for mobile devices
- **TypeScript Support**: Fully typed for better developer experience

## What's Included

### UI Components
- **Top Bar**: Undo/redo, canvas size, and export controls
- **Bottom Controls**: Context-sensitive adjustment bars for selected elements
- **Inspector Bar**: Property editing for text, images, shapes, and stickers
- **Add Block Bar**: Quick access to add new elements (text, images, shapes, stickers)
- **Modal Dialogs**: Canvas size selection, font picker, color picker
- **Slide-Up Panels**: Secondary controls for detailed adjustments

### Editor Features
- **Text Editing**: Font selection, color, alignment, and formatting
- **Image Management**: Upload, replace, crop, and adjust images
- **Shape Tools**: Add and customize vector shapes with fill colors
- **Sticker Library**: Browse and add stickers from built-in collections
- **Layer Management**: Select, move, resize, and delete elements
- **Undo/Redo**: Full history support with visual feedback

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:5173 to see the editor in action.

### Environment Setup

Create a `.env` file with your CE.SDK license:

```bash
VITE_CESDK_LICENSE=your_license_key_here
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── app/                          # Demo application
├── imgly/
│   ├── ColorUtilities.ts
│   ├── CreativeEngineUtils.ts
│   ├── index.ts                  # Editor initialization function
│   ├── upload.ts
│   └── utils.ts                  # Utility functions
└── index.tsx                 # Application entry point
```

## Key Concepts

### EditorContext

The `EditorContext` provides engine state and functionality throughout the app:

```typescript
const { engine, engineIsLoaded, selectedBlocks, canUndo, canRedo } = useEditor();
```

### Single Page Focus

The `useSinglePageFocus` hook manages viewport zooming and keeps the canvas focused on the active page, especially important for mobile devices with limited screen space.

### Selection Provider

The `SelectionProvider` ensures only one block is selected at a time, optimized for mobile touch interactions.

### Property Editing

The `useSelectedProperty` hook provides a simple way to read and write block properties:

```typescript
const [fontSize, setFontSize] = useSelectedProperty('text/fontSize');
```

## Customization

### Styling

All components use CSS Modules for scoped styling. Modify `.module.css` files to customize appearance.

### Adding New Features

1. Create new components in `src/app/components/`
2. Use hooks from `src/app/hooks/` to interact with CE.SDK
3. Add utilities to `src/imgly/` for reusable engine operations

### Scene Configuration

Modify the default scene by editing `public/social-media.scene` or load a different scene in `EditorContext.tsx`.

## Architecture

This starterkit follows the **Feature-Sliced Design** pattern:

- **`src/app/`**: React application layer (UI, state, hooks)
- **`src/imgly/`**: CE.SDK integration layer (engine utilities, no React dependencies)

This separation ensures the engine integration is reusable and testable independently of the UI.

## Mobile Considerations

### Touch Interactions
- All buttons and controls are sized for finger taps (min 44x44px)
- Slide-up panels for secondary controls minimize screen clutter
- Context-sensitive toolbars show only relevant controls

### Viewport Management
- Automatic zooming keeps the canvas visible when keyboard appears
- Single page focus prevents multiple pages from confusing the mobile experience
- Responsive layout adapts to portrait and landscape orientations

### Performance
- Debounced property updates prevent excessive re-renders during slider adjustments
- Lazy loading for asset libraries (fonts, images, stickers)
- Optimized selection handling for smooth interactions

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check:syntax` - Type check TypeScript
- `npm run check:lint` - Lint code
- `npm run check:format` - Check code formatting
- `npm run fix:all` - Fix linting and formatting issues

## Browser Support

- Modern browsers with ES2020+ support
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android)
- Desktop Chrome, Firefox, Safari, Edge

## Learn More

- [CE.SDK Documentation](https://img.ly/docs/cesdk)
- [CE.SDK Web API Reference](https://img.ly/docs/cesdk/web/api)
- [Feature-Sliced Design](https://feature-sliced.design/)

## License

This starterkit is provided under the same license as CE.SDK. See LICENSE file for details.
