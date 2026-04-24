> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Plugins](./starterkits/plugins.md) > [QR Code Editor](./starterkits/qr-code-editor.md)

---

Easily generate and customize QR codes within CE.SDK.

![QR Code Editor starter kit showing QR code generation interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-qr-code-editor-ts-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-qr-code-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-qr-code-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-qr-code-editor/)

***

## Prerequisites

Before you begin, make sure you have the following:

- **Node.js v20+** and npm installed locally – [Download Node.js](https://nodejs.org/)
- Basic familiarity with Electron's main and renderer process architecture

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Create a new Electron application with QR Code Editor integration.

    ## Step 1: Create a New Project

    Use electron-vite for a modern Electron development experience:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm create @quick-start/electron your-project-name -- --template vanilla-ts
        cd your-project-name npm install
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm create @quick-start/electron your-project-name --template vanilla-ts cd
        your-project-name pnpm install
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn create @quick-start/electron your-project-name --template vanilla-ts cd
        your-project-name yarn install
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Clone the Starter Kit

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-qr-code-editor-ts-web.git
        cp -r starterkit-qr-code-editor-ts-web/src/imgly ./src/renderer/imgly
        rm -rf starterkit-qr-code-editor-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-qr-code-editor-ts-web/src/imgly ./src/renderer/imgly
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Install Dependencies

    ### Core Editor

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### QR Code Plugin

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @imgly/plugin-qr-code-web@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @imgly/plugin-qr-code-web@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @imgly/plugin-qr-code-web@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ## Step 4: Download Assets

    Download and extract assets to the `resources/` directory for bundling with the app:

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d resources/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    ## Step 5: Configure Asset Serving

    Update your main process to serve assets. In `src/main/index.ts`:

    ```typescript
    import { app, BrowserWindow, protocol } from 'electron';
    import { join } from 'path';

    // Register protocol for serving assets
    app.whenReady().then(() => {
      protocol.registerFileProtocol('cesdk', (request, callback) => {
        const url = request.url.replace('cesdk://', '');
        const filePath = join(app.getAppPath(), 'resources', 'assets', url);
        callback({ path: filePath });
      });
    });
    ```

    ## Step 6: Initialize the Editor

    Update the renderer process (`src/renderer/index.ts`):

    ```typescript
    import CreativeEditorSDK from '@cesdk/cesdk-js';
    import { initQRCodeEditor } from './imgly';

    const config = {
      baseURL: 'cesdk://assets',
    };

    CreativeEditorSDK.create('#cesdk_container', config)
      .then(async cesdk => {
        await initQRCodeEditor(cesdk);
      })
      .catch(console.error);
    ```

    Update `src/renderer/index.html` to include the container:

    ```html
    <div id="cesdk_container" style="width: 100%; height: 100vh;"></div>
    ```

    ## Step 7: Run the Application

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm run dev</TerminalTab>
      <TerminalTab label="pnpm">pnpm dev</TerminalTab>
      <TerminalTab label="yarn">yarn dev</TerminalTab>
    </TerminalTabs>
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the QR Code Editor into an existing Electron application.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">cd your-project</TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-qr-code-editor-ts-web.git
        cp -r starterkit-qr-code-editor-ts-web/src/imgly ./src/renderer/imgly
        rm -rf starterkit-qr-code-editor-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-qr-code-editor-ts-web/src/imgly ./src/renderer/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** Adjust the destination path to match your Electron project's renderer
    > directory structure.

    ## Step 2: Install Dependencies

    ### Core Editor

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### QR Code Plugin

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @imgly/plugin-qr-code-web@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @imgly/plugin-qr-code-web@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @imgly/plugin-qr-code-web@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d resources/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    ## Step 4: Configure Asset Serving

    Follow the asset serving configuration from the "New Project" tab to set up protocol handling in your main process.
  </TabItem>
</Tabs>

## Using QR Code Generation

The editor provides two ways to generate QR codes:

### Via Dock Panel

1. Click the "QR Code" button in the dock (left sidebar)
2. The QR Code panel opens with generation options
3. Enter your URL or text content
4. Customize colors and size
5. Click "Generate" to add the QR code to your design

### Via Canvas Menu

1. Right-click on the canvas
2. Select "Generate QR Code" from the context menu
3. The QR Code panel opens for customization

## Packaging for Distribution

When packaging your Electron app, ensure the assets are included:

```javascript
// electron-builder.config.js
module.exports = {
  extraResources: [
    {
      from: 'resources/assets',
      to: 'assets',
    },
  ],
};
```

## Customize Assets

The QR Code Editor uses asset source plugins to provide built-in libraries for templates, stickers, shapes, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

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

> **Available Asset Sources:** See [Asset Source Plugins](./plugins/asset-sources.md) for the complete list of
> available sources.

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

#### Export and Save

```typescript title="src/imgly/config/actions.ts"
// Register export action that downloads the edited design
cesdk.actions.register('exportDesign', async exportOptions => {
  const { blobs, options } = await cesdk.utils.export(exportOptions);
  await cesdk.utils.downloadFile(blobs[0], options.mimeType);
});
```

> **Learn More:** See [Actions](./actions.md) for the full list of built-in actions,
> how to run them, and how to register custom actions.

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
    'common.apply': 'Apply',
  },
});

// Add a new language
cesdk.i18n.setTranslations({
  de: {
    'actions.export.image': 'Design herunterladen',
  },
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
  'after',
);

// Rearrange dock items
cesdk.ui.setDockOrder([
  'ly.img.assetLibrary.dock',
  'ly.img.separator',
  'my-custom-dock-item',
]);
```

See [Dock](./user-interface/customization/dock.md), [Inspector Bar](./user-interface/customization/inspector-bar.md), [Navigation Bar](./user-interface/customization/navigation-bar.md), [Canvas Menu](./user-interface/customization/canvas-menu.md), and [Canvas](./user-interface/customization/canvas.md) for detailed layout customization options.

***

## Key Capabilities

<CapabilityGrid
  features={[
  {
    title: 'QR Code Generation',
    description:
      'Generate customizable QR codes with custom colors, sizes, and content. Add them to any design with a single click.',
    imageId: 'transform',
  },
  {
    title: 'Cross-Platform Desktop',
    description:
      'Build native desktop apps for Windows, macOS, and Linux with full offline support.',
    imageId: 'extendible',
  },
  {
    title: 'Professional Filters',
    description:
      'Apply color grading with LUT filters, duotone effects, and customizable image adjustments.',
    imageId: 'filters',
  },
  {
    title: 'Text & Typography',
    description:
      'Add styled text with comprehensive typography controls, fonts, and visual effects.',
    imageId: 'text-editing',
  },
  {
    title: 'Offline Support',
    description:
      'All assets can be bundled with your app for fully offline functionality.',
    imageId: 'client-side',
  },
  {
    title: 'Export Options',
    description:
      'Export to multiple formats including PNG, JPEG, and PDF with quality and size controls.',
    imageId: 'transform',
  },
]}
/>

<br />

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get
> a license key and remove the watermark.

***

## Troubleshooting

### Assets not loading

- **Check protocol registration**: Ensure the custom protocol is registered in the main process
- **Verify asset paths**: Check that assets are in the correct `resources/` directory
- **Check extraResources config**: Ensure electron-builder is configured to include assets

### QR code panel doesn't open

- **Check plugin installation**: Ensure `@imgly/plugin-qr-code-web` is installed
- **Verify plugin setup**: Check that `setupQRCodePlugin(cesdk)` is called during initialization

### Watermark appears

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](./configuration.md) – Complete list of initialization
  options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support