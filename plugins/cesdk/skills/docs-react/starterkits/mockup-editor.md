> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Creative Automation](./starterkits/creative-automation.md) > [Mockup Editor](./starterkits/mockup-editor.md)

---

Easily visualize the final product with the Mockup Editor. Suitable for apparel, postcards, posters, business cards, and social media product designs.

![Design Editor starter kit showing a professional design editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-product-preview-react-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-product-preview-react-web/tree/v$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-product-preview-react-web/tree/v$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-product-preview/)

***

## Prerequisites

Before you begin, make sure you have the following:

- **Node.js v20+** and npm installed locally – [Download Node.js](https://nodejs.org/)
- A **supported browser** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list.

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Start fresh with a standalone Mockup Editor project. This creates a complete, ready-to-run React application.

    ## Step 1: Clone the Repository

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-product-preview-react-web.git
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-product-preview-react-web starterkit-product-preview-react-web
      </TerminalTab>
    </TerminalTabs>

    The `src/` folder contains the editor code:

    ```
    src/
    ├── app/                          # Demo application
    ├── constants.ts              # Configuration constants
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
    │   ├── mockup.ts                 # Mockup rendering utilities
    │   └── types.ts                  # TypeScript type definitions
    └── index.tsx                 # Application entry point
    ```

    ## Step 2: Install Dependencies

    Install the required packages:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        cd starterkit-product-preview-react-web
        npm install
      </TerminalTab>

      <TerminalTab label="pnpm">
        cd starterkit-product-preview-react-web
        pnpm install
      </TerminalTab>

      <TerminalTab label="yarn">
        cd starterkit-product-preview-react-web
        yarn
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `public/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in `src/index.tsx`.

    ```typescript title="src/index.tsx"
    const config: Configuration = {
      // ...
      baseURL: '/assets'
      // ...
    };
    ```

    ## Step 4: Run the Development Server

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm run dev
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm run dev
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn dev
      </TerminalTab>
    </TerminalTabs>

    Open `http://localhost:5173` in your browser.
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Mockup Editor into an existing React application. This adds the editor configuration to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">cd your-project</TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-product-preview-react-web.git
        cp -r starterkit-product-preview-react-web/src/imgly ./src/imgly
        rm -rf starterkit-product-preview-react-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-product-preview-react-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your
    > project structure.

    The `imgly/` folder contains the editor configuration:

    ```
    imgly/
    ├── config/
    │   ├── actions.ts                # Export/import actions
    │   ├── features.ts               # Feature toggles
    │   ├── i18n.ts                   # Translations
    │   ├── plugin.ts                 # Main configuration plugin
    │   ├── settings.ts               # Engine settings
    │   └── ui/
    │       ├── canvas.ts                 # Canvas configuration
    │       ├── components.ts             # Custom component registration
    │       ├── dock.ts                   # Dock layout configuration
    │       ├── index.ts                  # Combines UI customization exports
    │       ├── inspectorBar.ts           # Inspector bar layout
    │       ├── navigationBar.ts          # Navigation bar layout
    │       └── panel.ts                  # Panel configuration
    ├── index.ts                  # Editor initialization function
    ├── mockup.ts                 # Mockup rendering utilities
    └── types.ts                  # TypeScript type definitions
    ```

    ## Step 2: Install Dependencies

    Install the required packages for the editor:

    ### Core Editor

    Install the Creative Editor SDK:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### Headless Engine

    Install the headless engine for server-side and batch processing:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/engine@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/engine@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/engine@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. For React projects, place these in your `public/` directory which is served automatically.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place
    > assets in a different location, update the `baseURL` in Step 4: Create the
    > Editor Component.

    ## Step 4: Create the Editor Component

    Choose your editing mode and initialize the editor accordingly:

    <Tabs syncKey="editor-mode">
      <TabItem label="Design Editor">
        ```tsx
        import CreativeEditor from '@cesdk/cesdk-js/react';
        import { initProductPreviewDesignEditor } from './imgly';

        export default function DesignEditor() {
          return (
            <CreativeEditor
              config={{ baseURL: '/assets' }}
              init={initProductPreviewDesignEditor}
              width="100vw"
              height="100vh"
            />
          );
        }
        ```
      </TabItem>

      <TabItem label="Mockup Scene Editor">
        ```tsx
        import CreativeEditor from '@cesdk/cesdk-js/react';
        import { initProductPreviewSceneEditor } from './imgly';

        export default function DesignEditor() {
          return (
            <CreativeEditor
              config={{ baseURL: '/assets' }}
              init={initProductPreviewSceneEditor}
              width="100vw"
              height="100vh"
            />
          );
        }
        ```
      </TabItem>
    </Tabs>
  </TabItem>
</Tabs>

***

## Dual-Engine Architecture

The Mockup Editor uses a unique dual-engine architecture for real-time mockup rendering:

```
┌─────────────────────────┐     ┌─────────────────────────┐
│   Design Editor SDK     │     │   Headless Engine       │
│   (User Interface)      │     │   (Background Render)   │
├─────────────────────────┤     ├─────────────────────────┤
│ • User edits designs    │     │ • Loads mockup scene    │
│ • Full editing UI       │ ──► │ • Composites designs    │
│ • History management    │     │ • Exports final mockup  │
└─────────────────────────┘     └─────────────────────────┘
```

**How it works:**

1. Users edit their design in the main CE.SDK editor
2. On each change, design pages are exported as PNG blobs
3. The `renderMockup` function composites designs onto the mockup scene
4. The rendered mockup is displayed as a preview

This architecture keeps the user's editing session uninterrupted while rendering mockups in the background.

```typescript title="src/imgly/mockup.ts"
import { renderMockup, CLEAR_IMAGE } from './imgly';

// Render designs onto mockup scene
const result = await renderMockup(
  engine,                              // Headless CreativeEngine
  'https://example.com/mockup.scene',  // Scene URL or { sceneString }
  {
    'Image 1': designBlob,             // Placeholder name → Blob or URL
    'Image 2': CLEAR_IMAGE             // Clear unused placeholders
  }
);

// result.mockupUrl - Blob URL of rendered mockup
// result.sceneString - Serialized scene for editing
// result.blobUrls - URLs to revoke when done
```

***

## Set Up a Scene

CE.SDK offers multiple ways to load content into the editor. Choose the method that matches your use case:

```typescript title="src/index.tsx"
// Create a blank design canvas - starts with an empty design scene
await cesdk.actions.run('scene.create');

// Load from a template archive - restores a previously saved project
await cesdk.loadFromArchiveURL('https://example.com/template.zip');

// Load from an image URL - creates a new scene with the image
await cesdk.createFromImage('https://example.com/image.jpg');

// Load from a scene file - restores a scene from JSON
await cesdk.loadFromURL('https://example.com/scene.json');
```

The `createDesignScene()` method is ideal for design workflows, as it creates a blank canvas ready for content.

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading methods.

## Customize Assets

The Mockup Editor uses asset source plugins to provide built-in libraries for templates, stickers, shapes, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

Asset sources are added via plugins in `src/imgly/index.ts`. Enable or disable individual sources:

```typescript title="src/imgly/index.ts"
import {
  FiltersAssetSource,
  StickerAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  EffectsAssetSource,
  // ...
} from '@cesdk/cesdk-js/plugins';

// Add only the sources you need
await cesdk.addPlugin(new FiltersAssetSource());
await cesdk.addPlugin(new StickerAssetSource());
await cesdk.addPlugin(new TextAssetSource());
await cesdk.addPlugin(new VectorShapeAssetSource());
await cesdk.addPlugin(new EffectsAssetSource());
// ...
```

> **Available Asset Sources:** See [Asset Source Plugins](./plugins/asset-sources.md) for the complete list of available sources.

For production deployments, self-hosting assets is required—the IMG.LY CDN is intended for development only. See [Serve Assets](./serve-assets.md) for downloading assets, configuring `baseURL`, and excluding unused sources to optimize load times.

## Configure Actions

Actions are functions that handle user interactions like exporting designs, saving scenes, and importing files. CE.SDK provides built-in actions that you can run directly or override with custom implementations.

**Key built-in actions:**

- `exportDesign` – Export the current design to PNG, JPEG, PDF, or other formats
- `saveScene` – Save the scene as a JSON string for later editing
- `importScene` – Import a previously saved scene (supports `.scene` and `.cesdk` formats)
- `exportScene` – Export the scene as a JSON file or `.cesdk` archive with all assets
- `uploadFile` – Handle file uploads with progress tracking

Use `cesdk.actions.run()` to execute any action:

```typescript
// Run a built-in action
await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
```

#### Import from File Picker

```typescript title="src/imgly/config/actions.ts"
// Let users open images from their device
cesdk.actions.register('importImage', async () => {
  const blobURL = await cesdk.utils.loadFile({
    accept: 'image/*',
    returnType: 'objectURL'
  });
  await cesdk.createFromImage(blobURL);
});
```

#### Export and Save

```typescript title="src/imgly/config/actions.ts"
// Register export action that downloads the edited design
cesdk.actions.register('exportDesign', async (exportOptions) => {
  const { blobs, options } = await cesdk.utils.export(exportOptions);
  await cesdk.utils.downloadFile(blobs[0], options.mimeType);
});
```

#### Upload to Your Backend

```typescript title="src/imgly/config/actions.ts"
// Override the built-in exportDesign action to send to your server
cesdk.actions.register('exportDesign', async (exportOptions) => {
  const { blobs } = await cesdk.utils.export(exportOptions);

  const formData = new FormData();
  formData.append('design', blobs[0], 'design.png');

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const { url } = await response.json();
  console.log('Uploaded to:', url);
});
```

> **Learn More:** See [Actions](./actions.md) for the full list of built-in actions, how to run them, and how to register custom actions.

***

## Customize (Optional)

### Theming

CE.SDK supports light and dark themes out of the box, plus automatic system preference detection. Switch between themes programmatically:

```typescript title="src/imgly/config/settings.ts"
// 'light' | 'dark' | 'system' | (() => 'light' | 'dark')
cesdk.ui.setTheme('dark');
```

See [Theming](./user-interface/appearance/theming.md) for custom color schemes, CSS variables, and advanced styling options.

### Localization

Customize UI labels and add support for multiple languages. The i18n system supports translation keys for all UI elements:

```typescript title="src/imgly/config/i18n.ts"
// Override specific labels
cesdk.i18n.setTranslations({
  en: {
    'actions.export.image': 'Download Design',
    'common.cancel': 'Cancel',
    'common.apply': 'Apply'
  }
});

// Add a new language
cesdk.i18n.setTranslations({
  de: {
    'actions.export.image': 'Design herunterladen'
  }
});

// Set the active locale
cesdk.i18n.setLocale('de');
```

See [Localization](./user-interface/localization.md) for supported languages, translation key reference, and right-to-left language support.

### UI Layout

![CE.SDK Editor UI Areas](https://img.ly/docs/cesdk/../_shared/assets/CESDK-UI.png)

Customize the editor interface by modifying the dock, inspector bar, navigation bar, and canvas menu. CE.SDK provides Order APIs to control which components appear and in what sequence.

```typescript title="src/imgly/config/ui/navigationBar.ts"
// Get current navigation bar components
const navOrder = cesdk.ui.getNavigationBarOrder();

// Add a custom button to the navigation bar
cesdk.ui.insertNavigationBarOrderComponent(
  'ly.img.spacer',
  { id: 'my-custom-action' },
  'after'
);

// Rearrange dock items
cesdk.ui.setDockOrder([
  'ly.img.assetLibrary.dock',
  'ly.img.separator',
  'my-custom-dock-item'
]);

// Customize the inspector bar
cesdk.ui.setInspectorBarOrder([
  'ly.img.fill.inspectorBar',
  'ly.img.separator',
  'ly.img.filter.inspectorBar'
]);
```

The Order API methods follow a consistent pattern across all UI areas:

- `get*Order()` – Retrieve the current component order
- `set*Order()` – Replace the entire order
- `insert*OrderComponent()` – Add components relative to existing ones

See [Dock](./user-interface/customization/dock.md), [Inspector Bar](./user-interface/customization/inspector-bar.md), [Navigation Bar](./user-interface/customization/navigation-bar.md), [Canvas Menu](./user-interface/customization/canvas-menu.md), and [Canvas](./user-interface/customization/canvas.md) for detailed layout customization options.

### Custom Components

Build custom UI components using the builder system and integrate them in the editor. Custom components receive reactive state updates and can interact with the engine API.

```typescript title="src/imgly/config/ui/components.ts"
// Register a custom component
cesdk.ui.registerComponent('my-custom-button', ({ builder, engine }) => {
  const selectedBlocks = engine.block.findAllSelected();

  builder.Button('apply-effect', {
    label: 'Apply Effect',
    isDisabled: selectedBlocks.length === 0,
    onClick: () => {
      // Apply custom logic to selected blocks
    }
  });
});

// Add the component to the navigation bar
cesdk.ui.insertNavigationBarOrderComponent(
  'ly.img.spacer',
  'my-custom-button',
  'after'
);
```

Custom components automatically re-render when the engine state they depend on changes—no manual subscription management required.

See [Register New Component](./user-interface/ui-extensions/register-new-component.md) for the complete builder API and component patterns.

### Settings & Features

Fine-tune editor behavior through settings and features.

**Settings** configure core engine behavior—rendering, input handling, and history management:

```typescript title="src/imgly/config/settings.ts"
cesdk.engine.editor.setSettingBool('page/dimOutOfPageAreas', true);
cesdk.engine.editor.setSettingBool('mouse/enableZoomControl', true);
cesdk.engine.editor.setSettingBool('features/undoHistory', true);
```

**Features** toggle which editing tools and panels appear in the UI:

```typescript title="src/imgly/config/features.ts"
// Toggle editor features
cesdk.feature.enable('ly.img.crop', true);
cesdk.feature.enable('ly.img.filter', true);
cesdk.feature.enable('ly.img.adjustment', true);
```

See [Settings](./settings.md) and [Features](./user-interface/customization/disable-or-enable.md) for the complete reference.

### Explore Plugins

CE.SDK has a rich plugin ecosystem that extends the editor with powerful capabilities. Plugins can add new features, integrate third-party services, or customize editor behavior.

#### Background Removal

Add AI-powered background removal that runs entirely client-side. The background removal plugin processes images directly in the browser without sending data to external servers.

```typescript title="src/imgly/index.ts"
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal';

// Add background removal capability
await cesdk.addPlugin(BackgroundRemovalPlugin());
```

See [Background Removal](./edit-image/remove-bg.md) for setup instructions and configuration options.

#### Print Ready PDF

Export print-ready PDF/X-3 files with CMYK color profiles for professional printing workflows.

```typescript title="src/imgly/index.ts"
import PrintReadyPDFPlugin from '@imgly/plugin-print-ready-pdf';

// Add print-ready PDF export capability
await cesdk.addPlugin(PrintReadyPDFPlugin());
```

See [Print Ready PDF](./plugins/print-ready-pdf.md) for setup instructions and configuration options.

#### Custom Asset Sources

Connect external asset libraries like Unsplash, Getty Images, or your own content management system. Asset sources let users browse and insert content from any source.

```typescript title="src/imgly/index.ts"
import UnsplashAssetSource from '@imgly/plugin-unsplash';

// Add Unsplash integration
await cesdk.addPlugin(UnsplashAssetSource({
  accessKey: 'your-unsplash-access-key'
}));
```

See [Custom Asset Sources](./import-media/from-remote-source/unsplash.md) for integration patterns.

#### Discover More Plugins

Explore the full plugin ecosystem in the [IMG.LY plugins repository](https://github.com/imgly/plugins). Available plugins include:

- **Vectorizer** – Convert raster images to vectors
- **Design Presets** – Pre-built design templates
- **Social Media Templates** – Platform-specific sizing
- **And more** – Check the repository for the latest additions

***

## Key Capabilities

The Mockup Editor includes everything needed for professional mockup rendering.

<CapabilityGrid
  features={[
  {
    title: 'Real-Time Preview',
    description:
      'See designs rendered on product mockups instantly as you edit, with automatic refresh on changes.',
    imageId: 'transform',
  },
  {
    title: 'Multiple Products',
    description:
      'Switch between product types like business cards, posters, apparel, and more with dedicated mockup scenes.',
    imageId: 'filters',
  },
  {
    title: 'Mockup Editing',
    description:
      'Customize mockup scenes—adjust backgrounds, reposition designs, and fine-tune the final presentation.',
    imageId: 'green-screen',
  },
  {
    title: 'Text & Typography',
    description:
      'Add styled text with comprehensive typography controls, fonts, and visual effects.',
    imageId: 'text-editing',
  },
  {
    title: 'Asset Libraries',
    description:
      'Access built-in collections of templates, stickers, shapes, and graphics, plus import custom assets.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Export Options',
    description:
      'Export mockups to multiple formats including PNG, JPEG, and PDF with quality and size controls.',
    imageId: 'client-side',
  },
]}
/>

<br />

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

***

## Troubleshooting

### Editor doesn't load

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check console errors**: Look for CORS or network errors in browser developer tools

### Assets don't appear

- **Check network requests**: Open DevTools Network tab and look for failed requests to `cdn.img.ly`
- **Self-host assets for production**: See [Serve Assets](./serve-assets.md) to host assets on your infrastructure

### Mockup doesn't update

- **Check engine initialization**: Ensure both the design SDK and headless engine are initialized
- **Verify scene loading**: The mockup scene must load successfully before rendering
- **Check placeholder names**: Placeholders in mockup scenes must match the naming pattern (e.g., "Image 1", "Image 2")

### Export fails or produces blank images

- **Wait for content to load**: Ensure images are fully loaded before exporting
- **Check CORS on images**: Remote images must allow cross-origin access

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](./user-interface/localization.md) – Add translations and language support



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support