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
├── imgly/                        # CE.SDK glue layer (reusable)
│   ├── constants.ts              # Block names, asset source ids, font subset
│   ├── contexts/                 # Engine, selection, and single-page-mode contexts
│   ├── hooks/                    # Reactive state bridges (UseEditMode, UseHistory, …)
│   │   └── useEditorActions.ts   # Thin hook — binds engine to pure action functions
│   ├── actions/                  # All engine mutations as pure functions
│   │   ├── assets.ts             # findShapes, findStickers, findTypefaces, …
│   │   ├── block.ts              # deleteSelected, setEditMode, resetCrop, …
│   │   ├── export.ts             # exportToPdf (try/finally hardened), downloadBlob
│   │   ├── history.ts            # undo, redo
│   │   ├── pageStyle.ts          # setColorByBlockName, setFontByBlockName, …
│   │   └── text.ts               # addText, replaceFontOnSelection, …
│   ├── utils/                    # ColorUtilities, CreativeEngineUtils, UnsplashSource, ImageColorsSource
│   └── index.ts                  # Public surface
├── app/                          # Postcard UI (application-specific)
│   ├── contexts/                 # EditorContext (template/scene/step), PageSettingsContext
│   ├── components/               # Generic UI primitives (IconButton, Dropdown, …)
│   ├── features/                 # Editor panels grouped by feature
│   │   ├── text/                 # AddTextSecondary, ChangeFontSecondary, …
│   │   ├── image/                # AddImageSecondary, ImageAdjustmentBar, …
│   │   ├── shape/                # AddShapeSecondary, ShapesBar, …
│   │   ├── sticker/              # AddStickerSecondary, StickerBar, …
│   │   └── blocks/               # AddBlockBar, DeleteSelectedButton, BottomControls
│   ├── layout/                   # App shell & chrome
│   │   ├── PostcardUI/           # Root editor shell (switches between steps)
│   │   ├── ProcessNavigation/    # Step navigation (Style → Design → Write)
│   │   └── PageToolbar/          # Front/back page toolbars
│   ├── steps/                    # One screen per wizard step
│   │   └── ChooseTemplateStep/   # The "Style" step (template selection)
│   └── icons/                    # SVG icons (imported as React components)
└── index.tsx                     # Application entry point
```

## Architecture

The codebase is organized into two clearly separated layers.

### `src/imgly/` — CE.SDK glue (reusable)

Encapsulates everything that touches the CE.SDK engine:

- **`contexts/`** — React contexts for engine lifecycle (`EngineContext`), block selection (`SelectionContext`), and single-page-focus mode (`SinglePageModeContext`).
- **`hooks/`** — Reactive state bridges (`UseEditMode`, `UseHistory`, `UseImageUpload`, `UseSelectedProperty`). `useEditorActions()` is a thin ergonomic wrapper that binds the engine from context to the pure action functions below.
- **`actions/`** — All engine **mutations** as plain, testable functions (`addText(engine, …)`, `deleteSelected(engine)`, `exportToPdf(engine, …)`, etc.). Pure functions: no React imports, no context reads — the engine is always an explicit parameter.
- **`utils/`** — Stateless helpers (`ColorUtilities`, `CreativeEngineUtils`) and engine-native asset sources (`UnsplashSource`, `ImageColorsSource`).
- **`constants.ts`** — Shared constants: `BLOCK_NAMES`, `ASSET_SOURCES`, `FONT_SUBSET`.

### `src/app/` — Postcard UI (application-specific)

Owns all React UI that is specific to the postcard use-case:

- **`contexts/`** — Domain state: `EditorContext` (template selection, scene loading, step management) and `PageSettingsContext` (front/back colors, fonts, sizes).
- **`components/`** — Generic, reusable UI primitives (buttons, dropdowns incl. `ColorDropdown`, color pickers, layout primitives). No engine calls.
- **`features/`** — Editor panels grouped feature-first (`text/`, `image/`, `shape/`, `sticker/`, `blocks/`). Each panel reads engine state via `imgly` hooks and triggers changes via `useEditorActions()`.
- **`layout/`** — App shell and chrome: `PostcardUI` (composition root that switches between steps), `ProcessNavigation` (the Style → Design → Write stepper), and `PageToolbar` (front/back page toolbars).
- **`steps/`** — One screen per wizard step (e.g. `ChooseTemplateStep`, the "Style" step). The steps themselves are listed in `ALL_STEPS` in `EditorContext`.

### The golden rule

**UI components never call `engine.*` to mutate state.** They call `imgly/actions` functions via `useEditorActions()`. This keeps mutations testable in isolation (plain functions, no React), and makes it obvious where all engine side-effects live.

### Path aliases

| Alias | Maps to |
| ----- | ------- |
| `@/*` | `src/*` |

### Type checking

```bash
npm run check:syntax  # TypeScript strict-mode type check
```

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
- `npm run check:syntax` - TypeScript strict-mode type checking
- `npm run check:format` - Prettier formatting check
- `npm run check:lint` - ESLint checking
- `npm run check:all` - Run all checks
- `npm run fix:all` - Auto-fix formatting and linting issues

## Demo Assets

The demo assets for this starter kit load from the IMG.LY CDN by default —
nothing to configure. If you want to own them — edit them, meet compliance
requirements, or remove the CDN dependency for production — eject them
(the archive contains only this kit's files):

```bash
# Download this starter kit's demo assets
curl -O https://staticimgly.com/imgly/cesdk-web-examples-data/1.82.0/starterkit-postcard-ui/demo-assets.zip
unzip demo-assets.zip -d demo-assets
rm demo-assets.zip
```

Upload the extracted files to your own server or CDN, then point the app
at them via `.env`:

```bash
VITE_DEMO_ASSETS_BASE_URL=https://cdn.yourdomain.com/demo-assets
```

The default URL is the `DEMO_ASSETS_BASE_URL` constant in `src/app/contexts/EditorContext.tsx` if you
prefer changing it in code.

The demo assets are intended for development and prototyping — replace
them with your own content or licensed stock assets before shipping to
production (see `DEMO-ASSETS-NOTICE.txt` in the download). This applies in
particular to media such as music tracks and stock imagery.

## License

See the main repository LICENSE file.

## Support

For questions and support, visit [img.ly/docs](https://img.ly/docs/cesdk/)
