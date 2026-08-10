> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.81.0-nightly.20260810/examples/starterkit-getty-asset-source/index.html)

***

## Prerequisites

Before you begin, make sure you have the following:

- **Getty Images API Proxy** – A server-side proxy that handles Getty Images API authentication and returns data in CE.SDK format
- **Node.js v22+** and npm installed locally – [Download Node.js](https://nodejs.org/)
- A **supported browser** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list.

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Create a new Angular application with Getty Images Editor integration.

    ## Step 1: Create a New Project

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        ng new your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="pnpm">
        ng new your-project-name --package-manager pnpm
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="yarn">
        ng new your-project-name --package-manager yarn
        cd your-project-name
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Clone the Starter Kit

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-getty-asset-source-ts-web.git
        cp -r starterkit-getty-asset-source-ts-web/src/app/imgly ./src/app/imgly
        rm -rf starterkit-getty-asset-source-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-getty-asset-source-ts-web/src/app/imgly ./src/app/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/app/imgly`. Adjust the path to match your project structure.

    ## Step 3: Install Dependencies

    Install the required packages for the editor:

    ### Core Editor

    Install the Creative Editor SDK:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### Getty Images Integration

    No additional dependencies are required beyond `@cesdk/cesdk-js`. The Getty Images integration is included in the starter kit and connects to your proxy server for stock photos.

    ### Configure Bundle Budgets

    CE.SDK requires adjusting Angular's default bundle size limits. Update the `budgets` array in your `angular.json` under `architect.build.configurations.production`:

    ```json
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "3MB",
        "maximumError": "5MB"
      },
      {
        "type": "anyComponentStyle",
        "maximumWarning": "4kB",
        "maximumError": "8kB"
      }
    ]
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

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in Step 5: Create the Editor Component.

    ## Step 5: Create the Editor Component

    Create an Angular component using the official CE.SDK Angular wrapper (e.g., `getty-images-editor.component.ts`):

    ```typescript
    import { Component } from '@angular/core';
    import { CreativeEditor } from '@cesdk/cesdk-js/angular';
    import { initGettyImagesEditor } from './imgly';

    @Component({
      selector: 'app-getty-images-editor',
      standalone: true,
      imports: [CreativeEditor],
      template: `
        <creative-editor
          [config]="{ baseURL: '/assets' }"
          [init]="initGettyImagesEditor"
          width="100vw"
          height="100vh"
        />
      `
    })
    export class GettyImagesEditorComponent {
      initGettyImagesEditor = initGettyImagesEditor;
    }
    ```

    ## Step 6: Use the Component

    Use the component in your app:

    ```typescript
    import { Component } from '@angular/core';
    import { GettyImagesEditorComponent } from './getty-images-editor.component';

    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [GettyImagesEditorComponent],
      template: '<app-getty-images-editor />'
    })
    export class AppComponent {}
    ```
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Getty Images Editor into an existing Angular application. This adds the editor configuration to your current project structure.

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
        cp -r starterkit-getty-asset-source-ts-web/src/app/imgly ./src/app/imgly
        rm -rf starterkit-getty-asset-source-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-getty-asset-source-ts-web/src/app/imgly ./src/app/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/app/imgly`. Adjust the path to match your project structure.

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
      <TerminalTab label="npm">
        npm install @cesdk/cesdk-js@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @cesdk/cesdk-js@$UBQ\_VERSION$
      </TerminalTab>
    </TerminalTabs>

    ### Getty Images Integration

    No additional dependencies are required beyond `@cesdk/cesdk-js`. The Getty Images integration is included in the starter kit and connects to your proxy server for stock photos.

    ### Configure Bundle Budgets

    CE.SDK requires adjusting Angular's default bundle size limits. Update the `budgets` array in your `angular.json` under `architect.build.configurations.production`:

    ```json
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "3MB",
        "maximumError": "5MB"
      },
      {
        "type": "anyComponentStyle",
        "maximumWarning": "4kB",
        "maximumError": "8kB"
      }
    ]
    ```

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. For Angular projects, place these in your `public/` directory which is served automatically.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in Step 4: Create the Editor Component.

    ## Step 4: Create the Editor Component

    Create an Angular component using the official CE.SDK Angular wrapper (e.g., `getty-images-editor.component.ts`):

    ```typescript
    import { Component } from '@angular/core';
    import { CreativeEditor } from '@cesdk/cesdk-js/angular';
    import { initGettyImagesEditor } from './imgly';

    @Component({
      selector: 'app-getty-images-editor',
      standalone: true,
      imports: [CreativeEditor],
      template: `
        <creative-editor
          [config]="{ baseURL: '/assets' }"
          [init]="initGettyImagesEditor"
          width="100vw"
          height="100vh"
        />
      `
    })
    export class GettyImagesEditorComponent {
      initGettyImagesEditor = initGettyImagesEditor;
    }
    ```

    ## Step 5: Use the Component

    Use the component in your app:

    ```typescript
    import { Component } from '@angular/core';
    import { GettyImagesEditorComponent } from './getty-images-editor.component';

    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [GettyImagesEditorComponent],
      template: '<app-getty-images-editor />'
    })
    export class AppComponent {}
    ```
  </TabItem>
</Tabs>

## Set Up a Scene

CE.SDK offers multiple ways to load content into the editor. Choose the method that matches your use case:

```typescript title="src/app/imgly/index.ts"
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

Asset sources are added via plugins in `src/app/imgly/index.ts`. Enable or disable individual sources:

```typescript title="src/app/imgly/index.ts"
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
- `importScene` – Import a previously saved scene (`.imgly` or `.scene`)
- `exportScene` – Export the scene as an `.imgly` file, either the scene alone or an archive with all assets
- `uploadFile` – Handle file uploads with progress tracking

Use `cesdk.actions.run()` to execute any action:

```typescript
// Run a built-in action
await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
```

#### Import from File Picker

```typescript title="src/app/imgly/config/actions.ts"
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

```typescript title="src/app/imgly/config/actions.ts"
// Register export action that downloads the edited design
cesdk.actions.register('exportDesign', async (exportOptions) => {
  const { blobs, options } = await cesdk.utils.export(exportOptions);
  await cesdk.utils.downloadFile(blobs[0], options.mimeType);
});
```

#### Upload to Your Backend

```typescript title="src/app/imgly/config/actions.ts"
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

## Getty Images Integration

The Getty Images Editor provides access to millions of premium stock photos from Getty Images.

### How It Works

The integration uses a custom asset source to fetch images from Getty Images through a proxy server you control. The proxy handles authentication and returns data in CE.SDK's asset format.

```typescript title="src/app/imgly/index.ts"
// Add Getty Images stock photo integration
// Requires: A proxy server for Getty Images API authentication
// Configure: Pass gettyProxyUrl option or set VITE_GETTY_IMAGES_PROXY_URL env var
await cesdk.addPlugin(new GettyImagesAssetSourcePlugin({
  proxyUrl: options.gettyProxyUrl
}));
```

### Search and Browse

Users can search Getty Images' library or browse curated collections:

- **Search**: Type keywords to find specific photos
- **Browse**: Explore curated collections when no search query is entered
- **Pagination**: Automatically loads more results as users scroll

***

## Set Up Getty Images Proxy

For production use, you must proxy Getty Images API requests through your server. This keeps authentication secure and prevents exposing credentials in client-side code.

### Why a Proxy?

- **Security**: API keys should never be in frontend code
- **Authentication**: Getty Images requires server-side authentication
- **Rate limiting**: Control and monitor API usage from your backend

### Proxy Implementation

Create a proxy endpoint that authenticates with Getty Images. The starter kit includes a complete example at `api/getty-images-proxy-example.ts`:

```typescript title="api/getty-images-proxy.ts"
// Example serverless function (Vercel, AWS Lambda, etc.)
export default async function handler(req, res) {
  const apiKey = process.env.GETTY_IMAGES_API_KEY;
  const apiSecret = process.env.GETTY_IMAGES_API_SECRET;

  const response = await fetch(`https://api.gettyimages.com${req.url}`, {
    headers: {
      'Api-Key': apiKey,
      // Additional headers and auth as required by Getty Images
    }
  });

  const data = await response.json();
  res.json(data);
}
```

> **Complete Proxy Example:** See `api/getty-images-proxy-example.ts` in the starter kit for a full implementation with authentication, CORS handling, and error management.

### Configure the Proxy URL

Set the environment variable to point to your proxy:

```bash title=".env"
VITE_GETTY_IMAGES_PROXY_URL=https://your-domain.com/api/getty-images
```

Then pass it to the init function:

```typescript title="src/app/main.ts"
await initGettyImagesEditor(cesdk, {
  gettyProxyUrl: import.meta.env.VITE_GETTY_IMAGES_PROXY_URL
});
```

> **Demo Proxy Limitations:** The demo proxy is for development only and has rate limits. Set up your own proxy for production use.

***

## Customize (Optional)

### Theming

CE.SDK supports light and dark themes out of the box, plus automatic system preference detection. Switch between themes programmatically:

```typescript title="src/app/imgly/config/settings.ts"
// 'light' | 'dark' | 'system' | (() => 'light' | 'dark')
cesdk.ui.setTheme('dark');
```

See [Theming](./user-interface/appearance/theming.md) for custom color schemes, CSS variables, and advanced styling options.

### Localization

Customize UI labels and add support for multiple languages. The i18n system supports translation keys for all UI elements:

```typescript title="src/app/imgly/config/i18n.ts"
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

```typescript title="src/app/imgly/config/ui/navigationBar.ts"
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

```typescript title="src/app/imgly/config/ui/components.ts"
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

```typescript title="src/app/imgly/config/settings.ts"
cesdk.engine.editor.setSettingBool('page/dimOutOfPageAreas', true);
cesdk.engine.editor.setSettingBool('mouse/enableZoomControl', true);
cesdk.engine.editor.setSettingBool('features/undoHistory', true);
```

**Features** toggle which editing tools and panels appear in the UI:

```typescript title="src/app/imgly/config/features.ts"
// Toggle editor features
cesdk.feature.enable('ly.img.crop', true);
cesdk.feature.enable('ly.img.filter', true);
cesdk.feature.enable('ly.img.adjustment', true);
```

See [Settings](./settings.md) and [Features](./user-interface/customization/disable-or-enable.md) for the complete reference.

### Explore Plugins

CE.SDK has a rich plugin ecosystem that extends the editor with powerful capabilities. Plugins can add new features, integrate third-party services, or customize editor behavior.

#### Background Removal

Add AI-powered background removal that runs entirely in the browser without sending data to external servers.

```typescript title="src/app/imgly/config/plugin.ts"
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal';

// Add background removal capability
await cesdk.addPlugin(BackgroundRemovalPlugin());
```

See [Background Removal](./edit-image/remove-bg.md) for setup instructions and configuration options.

#### Print Ready PDF

Export print-ready PDF/X-4 and PDF/X-3 files with CMYK color profiles for professional printing workflows.

```typescript title="src/app/imgly/config/plugin.ts"
import PrintReadyPDFPlugin from '@imgly/plugin-print-ready-pdf';

// Add print-ready PDF export capability
await cesdk.addPlugin(PrintReadyPDFPlugin());
```

See [Print Ready PDF](./plugins/print-ready-pdf.md) for setup instructions and configuration options.

#### AI Integration

Extend the editor with generative AI capabilities for text-to-image generation, image enhancement, and intelligent editing features. CE.SDK integrates with various AI providers.

```typescript title="src/app/imgly/config/plugin.ts"
import AIPlugin from '@imgly/plugin-ai-generation';

// Configure AI generation
await cesdk.addPlugin(AIPlugin({
  provider: 'your-ai-provider',
  apiKey: 'your-api-key'
}));
```

See [AI Integration](./user-interface/ai-integration.md) for provider setup and supported AI features.

#### Discover More Plugins

Explore the full plugin ecosystem in the [IMG.LY plugins repository](https://github.com/imgly/plugins). Available plugins include:

- **Vectorizer** – Convert raster images to vectors
- **Design Presets** – Pre-built design templates
- **Social Media Templates** – Platform-specific sizing
- **And more** – Check the repository for the latest additions

***

## Key Capabilities

The Getty Images Editor combines professional design tools with premium stock photography.

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
      'Apply color grading with LUT filters, duotone effects, and image adjustments.',
    imageId: 'filters',
  },
  {
    title: 'Text & Typography',
    description:
      'Add styled text with typography controls, fonts, and visual effects.',
    imageId: 'text-editing',
  },
  {
    title: 'Multi-Page Documents',
    description:
      'Create presentations, brochures, and multi-page designs.',
    imageId: 'transform',
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
      'Export to PNG, JPEG, and PDF with quality and size controls.',
    imageId: 'transform',
  },
]}
/>

<br />

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

***

## Troubleshooting

### Getty Images photos don't load

- **Check your proxy server**: Verify your proxy is running and returning valid responses
- **Check CORS configuration**: Ensure your proxy allows requests from your domain
- **Test the proxy directly**: Make a direct request to your proxy URL to verify it works
- **Check console errors**: Look for network errors or authentication issues

### "Getty Images proxy URL not configured" warning

- **Set environment variable**: Set `VITE_GETTY_IMAGES_PROXY_URL` in your `.env` file
- **Pass to init function**: Pass `gettyProxyUrl` to `initGettyImagesEditor()`
- **For development**: The demo proxy is used automatically if no URL is provided

### Editor doesn't load

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check console errors**: Look for CORS or network errors in browser developer tools

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Custom Asset Sources](./import-media/from-remote-source/unsplash.md) – Learn how asset sources work
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](./user-interface/localization.md) – Add translations
- [Actions](./actions.md) – Build custom export workflows



---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support