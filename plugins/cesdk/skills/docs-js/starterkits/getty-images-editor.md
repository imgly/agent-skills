> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Assets](./starterkits/assets.md) > [Getty Images Editor](./starterkits/getty-images-editor.md)

---

CE.SDK can include assets from third-party libraries accessible via API. Search and browse images from Getty Images in the editor.

![Getty Images Editor starter kit showing stock photo integration](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-getty-asset-source-ts-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-getty-asset-source-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-getty-asset-source-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.81.0-nightly.20260802/examples/starterkit-getty-asset-source/index.html)

***

## Prerequisites

Before you begin, make sure you have the following:

- **Node.js v22+** and npm installed locally – [Download Node.js](https://nodejs.org/)
- **Getty Images API Proxy** – A server-side proxy that handles Getty Images API authentication and returns data in CE.SDK format
- A **supported browser** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list.

> **Why a Proxy?:** Getty Images API requires server-side authentication with API credentials. The proxy server handles this securely and transforms the response into CE.SDK's `AssetsQueryResult` format.

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Run the Getty Images Editor starter kit directly with Vite.

    ## Step 1: Clone the Starter Kit

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-getty-asset-source-ts-web.git
        cd starterkit-getty-asset-source-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-getty-asset-source-ts-web my-project
        cd my-project
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Configure Getty Images API Proxy

    Copy the example environment file and add your Getty Images API proxy URL:

    <TerminalTabs>
      <TerminalTab label="bash">
        cp .env.example .env

        # Edit .env and add your VITE\_GETTY\_IMAGES\_PROXY\_URL
      </TerminalTab>
    </TerminalTabs>

    Your proxy server should accept `query`, `page`, and `perPage` parameters and return data in CE.SDK's `AssetsQueryResult` format.

    ## Step 3: Install Dependencies

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install</TerminalTab>
      <TerminalTab label="pnpm">pnpm install</TerminalTab>
      <TerminalTab label="yarn">yarn install</TerminalTab>
    </TerminalTabs>

    ## Step 4: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `public/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    ## Step 5: Run the Development Server

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm run dev</TerminalTab>
      <TerminalTab label="pnpm">pnpm dev</TerminalTab>
      <TerminalTab label="yarn">yarn dev</TerminalTab>
    </TerminalTabs>

    Open `http://localhost:5173` in your browser. Click "Getty Images" in the dock to search and browse stock photos.
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Getty Images Editor into an existing vanilla JavaScript/TypeScript project. This adds the editor configuration and Getty Images asset source to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">
        cd your-project
      </TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-getty-asset-source-ts-web.git
        cp -r starterkit-getty-asset-source-ts-web/src/imgly ./src/imgly
        rm -rf starterkit-getty-asset-source-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-getty-asset-source-ts-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your project structure.

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
        └── getty-images.ts
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

    > **No Additional Dependencies:** The Getty Images integration uses the built-in fetch API—no additional packages are needed beyond CE.SDK.

    ## Step 3: Configure Getty Images API Proxy

    Set your Getty Images API proxy URL in one of two ways:

    **Environment Variable (Recommended)**

    ```bash
    # In your .env file
    VITE_GETTY_IMAGES_PROXY_URL=https://your-proxy-server.com/getty-api
    ```

    **Programmatically**

    ```typescript
    await initGettyImagesEditor(cesdk, {
      gettyProxyUrl: 'https://your-proxy-server.com/getty-api'
    });
    ```

    ## Step 4: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `public/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in Step 5: Add a Container Element.

    ## Step 5: Add a Container Element

    Add a container element to your HTML where the editor will be mounted:

    ```html
    <div id="cesdk_container" style="width: 100%; height: 100vh;"></div>
    ```

    ## Step 6: Initialize the Editor

    Import and call the initialization function from your entry point:

    ```typescript title="src/index.ts"
    import CreativeEditorSDK from '@cesdk/cesdk-js';
    import { initGettyImagesEditor } from './imgly';

    // Set your Getty Images API proxy URL
    const GETTY_PROXY_URL = 'https://your-proxy-server.com/getty-api';

    const config = {
      baseURL: '/assets'
    };

    CreativeEditorSDK.create('#cesdk_container', config)
      .then(async (cesdk) => {
        await initGettyImagesEditor(cesdk, { gettyProxyUrl: GETTY_PROXY_URL });
      })
      .catch((error) => {
        console.error('Failed to initialize CE.SDK:', error);
      });
    ```
  </TabItem>
</Tabs>

## Using Getty Images

The editor integrates Getty Images as the primary image source, replacing the default image library.

### Browsing Photos

1. Click the "Getty Images" button in the dock (left sidebar)
2. The Getty Images library opens showing curated photos
3. Click any photo to add it to your design

### Searching Photos

1. Open the Getty Images library
2. Use the search bar at the top of the panel
3. Type your search query and press Enter
4. Browse results and click to add photos

### Replacing Images

1. Select an existing image in your design
2. Click "Replace" in the inspector
3. The Getty Images library opens automatically
4. Select a new photo to replace the current one

> **Getty Images License:** All photos from Getty Images are subject to the [Getty Images Content License Agreement](https://www.gettyimages.com/eula). Ensure your usage complies with Getty's terms.

## Set Up a Scene

CE.SDK offers multiple ways to load content into the editor. Choose the method that matches your use case:

```typescript title="src/index.ts"
// Create a blank design canvas - starts with an empty design scene
await cesdk.actions.run('scene.create');

// Load from a template archive - restores a previously saved project
await cesdk.load('https://example.com/template.zip');

// Load from an image URL - creates a new scene with the image
await cesdk.createFromImage('https://example.com/image.jpg');

// Load from a scene file - restores a scene from JSON
await cesdk.load('https://example.com/scene.json');
```

The `createDesignScene()` method is ideal for design workflows, as it creates a blank canvas ready for content.

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading methods.

## Customize the Getty Images Integration

The Getty Images asset source plugin can be customized by modifying `src/imgly/plugins/getty-images.ts`:

```typescript title="src/imgly/plugins/getty-images.ts"
export class GettyImagesAssetSourcePlugin implements EditorPlugin {
  name = 'cesdk-getty-images-asset-source';
  version = CreativeEditorSDK.version;

  private options: GettyImagesAssetSourcePluginOptions;

  constructor(options: GettyImagesAssetSourcePluginOptions = {}) {
    this.options = options;
  }

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    // Use proxy URL from options
    const proxyUrl = this.options.proxyUrl ?? '';

    // Create and add the asset source
    const gettyImagesAssetSource = createGettyImagesAssetSource(proxyUrl);
    cesdk.engine.asset.addSource(gettyImagesAssetSource);

    // Configure dock to show Getty Images instead of default images
    const currentDockOrder = cesdk.ui.getDockOrder();
    cesdk.ui.setDockOrder(
      currentDockOrder.map((component) => {
        if (component.key === 'ly.img.image') {
          return {
            id: 'ly.img.assetLibrary.dock',
            key: 'gettyImages',
            label: 'libraries.gettyImages.label',
            entries: ['gettyImagesImageAssets']
          };
        }
        return component;
      })
    );
  }
}
```

> **Asset Source Plugins:** See [Asset Source Plugins](./plugins/asset-sources.md) for building your own asset integrations.

## Proxy Server Response Format

Your proxy server must return data in CE.SDK's `AssetsQueryResult` format:

```typescript
interface AssetsQueryResult {
  assets: AssetResult[];
  total: number;
  currentPage: number;
  nextPage: number | undefined;
}

interface AssetResult {
  id: string;
  meta: {
    thumbUri: string;
    uri: string;
    width: number;
    height: number;
    mimeType: string;
  };
  credits?: {
    name: string;
    url: string;
  };
}
```

The proxy should accept these query parameters:

- `query` – Search query string
- `page` – Page number (1-based)
- `perPage` – Number of results per page

## Configure Actions

Actions are functions that handle user interactions like exporting designs, saving scenes, and importing files. CE.SDK provides built-in actions that you can run directly or override with custom implementations.

**Key built-in actions:**

- `exportDesign` – Export the current design to PNG, JPEG, PDF, or other formats
- `saveScene` – Save the scene as a JSON string for later editing
- `importScene` – Import a previously saved scene (`.imgly` or `.scene`)
- `exportScene` – Export the scene as an `.imgly` file, either the scene alone or an archive with all assets
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
    'libraries.gettyImages.label': 'Stock Photos',
    'actions.export.image': 'Download Design',
    'common.cancel': 'Cancel',
    'common.apply': 'Apply'
  }
});

// Add a new language
cesdk.i18n.setTranslations({
  de: {
    'libraries.gettyImages.label': 'Stockfotos',
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
```

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

```typescript title="src/imgly/config/plugin.ts"
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal';

// Add background removal capability
await cesdk.addPlugin(BackgroundRemovalPlugin());
```

See [Background Removal](./edit-image/remove-bg.md) for setup instructions and configuration options.

#### Print Ready PDF

Export print-ready PDF/X-4 and PDF/X-3 files with CMYK color profiles for professional printing workflows.

```typescript title="src/imgly/config/plugin.ts"
import PrintReadyPDFPlugin from '@imgly/plugin-print-ready-pdf';

// Add print-ready PDF export capability
await cesdk.addPlugin(PrintReadyPDFPlugin());
```

See [Print Ready PDF](./plugins/print-ready-pdf.md) for setup instructions and configuration options.

#### AI Integration

Extend the editor with generative AI capabilities for text-to-image generation, image enhancement, and intelligent editing features. CE.SDK integrates with various AI providers.

```typescript title="src/imgly/config/plugin.ts"
import AIPlugin from '@imgly/plugin-ai-generation';

// Configure AI generation
await cesdk.addPlugin(AIPlugin({
  provider: 'your-ai-provider',
  apiKey: 'your-api-key'
}));
```

See [AI Integration](./user-interface/ai-integration.md) for provider setup and supported AI features.

***

## Key Capabilities

The Getty Images Editor includes premium stock photo integration plus full design editing capabilities.

<CapabilityGrid
  features={[
  {
    title: 'Getty Images Integration',
    description:
      'Search and browse millions of premium stock photos from Getty Images. Add photos to your designs with one click.',
    imageId: 'asset-libraries',
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
    title: 'Design Templates',
    description:
      'Start from pre-built templates or create designs from scratch with a full-featured canvas.',
    imageId: 'templating',
  },
  {
    title: 'Server-Side Auth',
    description:
      'Getty Images API authentication handled securely through your proxy server.',
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

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

***

## Troubleshooting

### "Please provide your Getty Images API proxy URL" alert

- **Set your proxy URL**: Add `VITE_GETTY_IMAGES_PROXY_URL` to your `.env` file or pass it to `initGettyImagesEditor()`
- **Verify proxy is running**: Ensure your proxy server is accessible from the browser

### Editor doesn't load

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check console errors**: Look for CORS or network errors in browser developer tools

### Assets don't appear

- **Check network requests**: Open DevTools Network tab and look for failed requests to `cdn.img.ly`
- **Self-host assets for production**: See [Serve Assets](./serve-assets.md) to host assets on your infrastructure

### Getty Images photos don't load

- **Verify your proxy server**: Make sure your proxy is running and returning valid responses
- **Check CORS configuration**: Ensure your proxy allows requests from your domain
- **Test the proxy directly**: Make a direct request to your proxy URL to verify it works
- **Check network requests**: Look for 401, 403, or 500 errors in the Network tab

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Asset Source Plugins](./plugins/asset-sources.md) – Build your own asset integrations
- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](./user-interface/localization.md) – Add translations and language support



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support