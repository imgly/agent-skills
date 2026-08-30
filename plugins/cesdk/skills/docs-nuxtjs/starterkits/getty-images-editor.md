> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Assets](./starterkits/assets.md) > [Getty Images Editor](./starterkits/getty-images-editor.md)

---

CE.SDK can include assets from third-party libraries accessible via API. Search and browse images from Getty Images in the editor.

![Getty Images Editor starter kit showing Getty Images stock photo integration interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

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
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.83.0-nightly.20260830/examples/starterkit-getty-asset-source/index.html)

***

## Prerequisites

Before you begin, make sure you have the following:

- **Getty Images API Access** – Access to Getty Images API requires a Getty Images account and credentials
- **Proxy Server** – A server endpoint to handle Getty Images API authentication (see [Server-Side Auth](./browser-support.md))
- **Node.js v22+** and npm installed locally – [Download Node.js](https://nodejs.org/)
- A **supported browser** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list.

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Create a new Nuxt.js application with Getty Images Editor integration.

    ## Step 1: Create a New Project

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npx nuxi@latest init your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm dlx nuxi@latest init your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn dlx nuxi@latest init your-project-name
        cd your-project-name
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Clone the Starter Kit

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-getty-asset-source-ts-web.git
        cp -r starterkit-getty-asset-source-ts-web/app/imgly ./app/imgly
        rm -rf starterkit-getty-asset-source-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-getty-asset-source-ts-web/app/imgly ./app/imgly
        npx degit imgly/starterkit-getty-asset-source-ts-web/public/assets ./public/assets
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./app/imgly`. Adjust the path to match your project structure.

    ## Step 3: Install Dependencies

    ### Core Editor

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ## Step 4: Download Assets

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    ## Step 5: Create the Editor Component

    Create a client-only Vue component using the `.client.vue` suffix (e.g., `GettyImagesEditor.client.vue`):

    ```vue
    <script setup lang="ts">
    import { initGettyImagesEditor } from '~/imgly';
    import CreativeEditor from '@cesdk/cesdk-js/vue';

    // Set your Getty Images proxy server URL
    const GETTY_PROXY_URL = 'YOUR_GETTY_IMAGES_PROXY_URL';

    // Wrapper to pass proxy URL to initialization
    const initWithProxyUrl = (cesdk: any) => initGettyImagesEditor(cesdk, { gettyProxyUrl: GETTY_PROXY_URL });
    </script>

    <template>
      <CreativeEditor
        :config="{ baseURL: '/assets' }"
        :init="initWithProxyUrl"
        width="100vw"
        height="100vh"
      />
    </template>
    ```

    Save this file as `components/GettyImagesEditor.client.vue` to ensure it only renders on the client.

    ## Step 6: Use the Component

    Import and use the component in your page:

    ```vue
    <template>
      <GettyImagesEditor />
    </template>

    <script setup lang="ts">
    import GettyImagesEditor from '~/components/GettyImagesEditor.client.vue';
    </script>
    ```

    ### SSR Error

    If you encounter the error `window is not defined`, it means the component is being rendered on the server. CE.SDK requires browser APIs and must run client-side only.

    Use either the `.client.vue` suffix (shown above) or wrap the component with `<ClientOnly>`:

    ```vue
    <template>
      <ClientOnly>
        <GettyImagesEditor />
      </ClientOnly>
    </template>
    ```
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Getty Images Editor into an existing Nuxt.js application.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">
        cd your-project
      </TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-getty-asset-source-ts-web.git
        cp -r starterkit-getty-asset-source-ts-web/app/imgly ./app/imgly
        rm -rf starterkit-getty-asset-source-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-getty-asset-source-ts-web/app/imgly ./app/imgly
      </TerminalTab>
    </TerminalTabs>

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

    ### Core Editor

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    ## Step 4: Create the Editor Component

    ```vue
    <script setup lang="ts">
    import { initGettyImagesEditor } from '~/imgly';
    import CreativeEditor from '@cesdk/cesdk-js/vue';

    // Set your Getty Images proxy server URL
    const GETTY_PROXY_URL = 'YOUR_GETTY_IMAGES_PROXY_URL';

    // Wrapper to pass proxy URL to initialization
    const initWithProxyUrl = (cesdk: any) => initGettyImagesEditor(cesdk, { gettyProxyUrl: GETTY_PROXY_URL });
    </script>

    <template>
      <CreativeEditor
        :config="{ baseURL: '/assets' }"
        :init="initWithProxyUrl"
        width="100vw"
        height="100vh"
      />
    </template>
    ```

    Save as `components/GettyImagesEditor.client.vue`.

    ## Step 5: Use the Component

    ```vue
    <template>
      <GettyImagesEditor />
    </template>

    <script setup lang="ts">
    import GettyImagesEditor from '~/components/GettyImagesEditor.client.vue';
    </script>
    ```
  </TabItem>
</Tabs>

## Using Getty Images Stock Photos

The editor provides access to millions of premium stock photos from Getty Images:

### Via Dock Panel

1. Click the "Getty Images" button in the dock (left sidebar)
2. Browse curated photos or use the search bar to find specific images
3. Click any photo to add it to your design

### Via Replace

1. Select an image block in the editor
2. Click "Replace" in the context menu
3. Choose a photo from Getty Images to replace the current image

> **Proxy Server Required:** To use Getty Images in production, you need a proxy server endpoint that handles Getty Images API authentication. Set it via the `VITE_GETTY_IMAGES_PROXY_URL` environment variable or pass it to `initGettyImagesEditor()`.

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

## Customize Assets

The Getty Images Editor uses asset source plugins to provide built-in libraries for templates, stickers, shapes, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

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
- `importScene` – Import a previously saved scene (`.imgly` or `.scene`)
- `exportScene` – Export the scene as an `.imgly` file, either the scene alone or an archive with all assets
- `uploadFile` – Handle file uploads with progress tracking

Use `cesdk.actions.run()` to execute any action:

```typescript
// Run a built-in action
await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
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
import { convertToPDFX } from '@imgly/plugin-print-ready-pdfs-web';

// Export the current page and convert it into a print-ready PDF/X file
const [page] = cesdk.engine.block.findByType('page');
const pdfBlob = await cesdk.engine.block.export(page, {
  mimeType: 'application/pdf'
});
const printReadyPDF = await convertToPDFX(pdfBlob, {
  outputProfile: 'fogra39'
});
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

<CapabilityGrid
  features={[
  {
    title: 'Getty Images Stock Photos',
    description:
      'Access millions of premium, high-quality stock photos from Getty Images. Search and browse directly within the editor.',
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
    title: 'Asset Libraries',
    description:
      'Access built-in collections of templates, stickers, shapes, and graphics, plus import custom assets.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Server-Side Auth',
    description:
      'Getty Images authentication is handled securely through a proxy server, keeping credentials safe.',
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

### Editor doesn't load

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location

### SSR Error: "window is not defined"

CE.SDK requires browser APIs and cannot run during server-side rendering. Use the `.client.vue` suffix or wrap your component with `<ClientOnly>`.

### Getty Images photos don't load

- **Check your proxy server**: Ensure you have set a valid Getty Images proxy server URL via `VITE_GETTY_IMAGES_PROXY_URL` or passed it to `initGettyImagesEditor()`
- **Check network requests**: Open DevTools Network tab and look for requests to your proxy server endpoint
- **Verify proxy credentials**: Ensure your proxy server is properly configured with Getty Images API credentials

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support