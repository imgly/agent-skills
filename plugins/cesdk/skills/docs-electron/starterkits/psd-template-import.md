> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Extensibility](./starterkits/extensibility.md) > [PSD Template Import](./starterkits/psd-template-import.md)

---

Transform your existing Photoshop templates for use in the CE.SDK with our Importer. Preserve design elements and streamline the transition between platforms.

![Design Editor starter kit showing a professional design editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-psd-template-import-react-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-psd-template-import-react-web/tree/v$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-psd-template-import-react-web/tree/v$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-psd-template-import/)

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

    Start fresh with a standalone Photoshop Template Import project. This creates a complete, ready-to-run application.

    ## Step 1: Clone the Repository

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-psd-template-import-react-web.git
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-psd-template-import-react-web starterkit-psd-template-import-react-web
      </TerminalTab>
    </TerminalTabs>

    The `src/` folder contains the application code:

    ```
    src/
    ├── app/                          # Demo application
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
    │       └── psd-importer.ts
    └── index.tsx                 # Application entry point
    ```

    ## Step 2: Install Dependencies

    Install the required packages:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        cd starterkit-psd-template-import-react-web
        npm install
      </TerminalTab>

      <TerminalTab label="pnpm">
        cd starterkit-psd-template-import-react-web
        pnpm install
      </TerminalTab>

      <TerminalTab label="yarn">
        cd starterkit-psd-template-import-react-web
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

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in `src/index.ts`.

    ```typescript title="src/index.ts"
    const config = {
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

    Integrate the Photoshop Template Import into an existing Electron application. This adds the editor configuration to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">cd your-project</TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-psd-template-import-react-web.git
        cp -r starterkit-psd-template-import-react-web/src/imgly ./src/imgly
        rm -rf starterkit-psd-template-import-react-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-psd-template-import-react-web/src/imgly ./src/imgly
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
    └── plugins/
        └── psd-importer.ts
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

    ### Import Plugin

    Add file format import support:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/psd-importer
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/psd-importer
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/psd-importer
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. For Electron projects, place these in your `public/` directory which is served automatically.

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

    ## Step 4: Add a Container Element

    Add a container element to your renderer HTML where the editor will be mounted:

    ```html
    <div id="cesdk_container" style="width: 100%; height: 100vh;"></div>
    ```

    ## Step 5: Initialize the Editor

    Import and call the initialization function from your renderer entry point:

    ```typescript title="src/renderer/index.ts"
    import CreativeEditorSDK from '@cesdk/cesdk-js';
    import { initPsdTemplateImportEditor } from './imgly';

    const config = {
      baseURL: '/assets'
    };

    CreativeEditorSDK.create('#cesdk_container', config)
      .then(async (cesdk) => {
        await initPsdTemplateImportEditor(cesdk);
      })
      .catch((error) => {
        console.error('Failed to initialize CE.SDK:', error);
      });
    ```

    > **Electron Renderer Process:** CE.SDK runs in the Electron renderer process, which provides a full Chromium
    > browser environment. Ensure your Electron main process creates a
    > `BrowserWindow` and loads the HTML file containing the container element.
  </TabItem>
</Tabs>

## Understanding the PSD Importer

The PSD importer parses Adobe Photoshop files and converts them to editable CE.SDK scenes. It supports:

- **Layer Preservation**: Maintains the original layer structure from Photoshop
- **Text Layers**: Converts text layers to editable CE.SDK text blocks
- **Image Layers**: Imports raster layers with proper positioning and transformations
- **Smart Objects**: Handles embedded smart objects as image blocks
- **Blend Modes**: Preserves common blend modes and opacity settings

### Import Result Structure

```typescript
interface PsdImportResult {
  imageUrl: string;       // Object URL for preview image
  sceneArchiveUrl: string; // Object URL for CE.SDK scene archive
  messages: LogMessage[];  // Import warnings and info messages
  fileName: string;        // Original file name
}
```

### Handling Import Messages

The importer logs messages for layers it couldn't fully convert or features not supported:

```typescript
const result = await importPsdFile(psdBlob, 'design.psd');

// Check for any import warnings
result.messages.forEach((msg) => {
  if (msg.type === 'warning') {
    console.warn(`Import warning: ${msg.message}`);
  }
});
```

***

## Set Up a Scene

CE.SDK offers multiple ways to load content into the editor. For Photoshop import, you can load PSD files directly:

```typescript title="src/index.ts"
// Import a Photoshop file from URL
await cesdk.loadFromURL('https://example.com/template.psd');

// Create a blank design canvas - starts with an empty design scene
await cesdk.actions.run('scene.create');

// Load from a template archive - restores a previously saved project
await cesdk.loadFromArchiveURL('https://example.com/template.zip');
```

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading methods.

## Customize Assets

The editor uses asset source plugins to provide built-in libraries for templates, stickers, shapes, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

Asset sources are added via plugins in `src/index.ts`. Enable or disable individual sources:

```typescript title="src/index.ts"
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
// Let users open Photoshop files from their device
cesdk.actions.register('importImage', async () => {
  const blobURL = await cesdk.utils.loadFile({
    accept: '.psd,image/*',
    returnType: 'objectURL'
  });
  await cesdk.loadFromURL(blobURL);
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

// Set the active locale
cesdk.i18n.setLocale('en');
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
```

See [Dock](./user-interface/customization/dock.md), [Inspector Bar](./user-interface/customization/inspector-bar.md), [Navigation Bar](./user-interface/customization/navigation-bar.md), [Canvas Menu](./user-interface/customization/canvas-menu.md), and [Canvas](./user-interface/customization/canvas.md) for detailed layout customization options.

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

***

## Key Capabilities

The Photoshop Template Import starter kit enables professional image template workflows.

<CapabilityGrid
  features={[
  {
    title: 'PSD File Import',
    description:
      'Import Adobe Photoshop files directly into the editor with full layer support.',
    imageId: 'transform',
  },
  {
    title: 'Layer Preservation',
    description:
      'Maintain the original layer structure, blend modes, and effects from Photoshop.',
    imageId: 'templating',
  },
  {
    title: 'Text Layer Editing',
    description:
      'Edit imported text layers with comprehensive typography controls and font management.',
    imageId: 'text-editing',
  },
  {
    title: 'Effects Support',
    description:
      'Preserve and edit layer effects including shadows, glows, and overlays.',
    imageId: 'effects',
  },
  {
    title: 'Export Options',
    description:
      'Export edited designs to PNG, JPEG, PDF, or save as CE.SDK scene files.',
    imageId: 'client-side',
  },
  {
    title: 'Image Workflows',
    description:
      'Build image template systems using imported Photoshop assets.',
    imageId: 'asset-libraries',
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

### PSD file doesn't import correctly

- **Check file format**: Ensure the PSD file is in a supported format
- **Check file size**: Large files may take longer to process
- **Check console errors**: Look for parsing or memory errors
- **Review import messages**: Check the `messages` array in the import result for warnings

### Assets don't appear

- **Check network requests**: Open DevTools Network tab and look for failed requests to `cdn.img.ly`
- **Self-host assets for production**: See [Serve Assets](./serve-assets.md) to host assets on your infrastructure

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows
- [Import from InDesign](./starterkits/indesign-template-import.md) – Import Adobe InDesign templates



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support