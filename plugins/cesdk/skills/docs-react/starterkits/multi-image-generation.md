> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Creative Automation](./starterkits/creative-automation.md) > [Multi Image Generation](./starterkits/multi-image-generation.md)

---

Generate multiple image variants for a single data point.

![Design Editor starter kit showing a professional design editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-multi-image-generation-react-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-multi-image-generation-react-web/tree/v$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-multi-image-generation-react-web/tree/v$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-multi-image-generation/)

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

    Start fresh with a standalone Multi Image Generation project. This creates a complete, ready-to-run application.

    ## Step 1: Clone the Repository

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-multi-image-generation-react-web.git
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-multi-image-generation-react-web starterkit-multi-image-generation-react-web
      </TerminalTab>
    </TerminalTabs>

    The `src/` folder contains the application:

    ```
    src/
    ├── app/                          # Demo application
    ├── imgly/
    │   ├── config/
    │   │   ├── advanced-design-editor/
    │   │   │   ├── actions.ts                # Export/import actions
    │   │   │   ├── features.ts               # Feature toggles
    │   │   │   ├── i18n.ts                   # Translations
    │   │   │   ├── plugin.ts                 # Main configuration plugin
    │   │   │   ├── settings.ts               # Engine settings
    │   │   │   └── ui/
    │   │   │       ├── canvas.ts                 # Canvas configuration
    │   │   │       ├── components.ts             # Custom component registration
    │   │   │       ├── dock.ts                   # Dock layout configuration
    │   │   │       ├── index.ts                  # Combines UI customization exports
    │   │   │       ├── inspectorBar.ts           # Inspector bar layout
    │   │   │       ├── navigationBar.ts          # Navigation bar layout
    │   │   │       └── panel.ts                  # Panel configuration
    │   │   └── design-editor/         # Same structure as advanced-design-editor/
    │   ├── generation.ts             # Design generation logic
    │   ├── index.ts                  # Editor initialization function
    │   ├── types.ts                  # TypeScript type definitions
    │   └── utils.ts                  # Utility functions
    └── index.tsx                 # Application entry point
    ```

    ## Step 2: Install Dependencies

    Install the required packages:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        cd starterkit-multi-image-generation-react-web
        npm install
      </TerminalTab>

      <TerminalTab label="pnpm">
        cd starterkit-multi-image-generation-react-web
        pnpm install
      </TerminalTab>

      <TerminalTab label="yarn">
        cd starterkit-multi-image-generation-react-web
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

    Integrate the Multi Image Generation into an existing React application. This adds the editor configuration to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">cd your-project</TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-multi-image-generation-react-web.git
        cp -r starterkit-multi-image-generation-react-web/src/imgly ./src/imgly
        rm -rf starterkit-multi-image-generation-react-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-multi-image-generation-react-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your
    > project structure.

    The `imgly/` folder contains the editor configuration:

    ```
    imgly/
    ├── config/
    │   ├── advanced-design-editor/
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
    │   └── design-editor/         # Same structure as advanced-design-editor/
    ├── generation.ts             # Design generation logic
    ├── index.ts                  # Editor initialization function
    ├── types.ts                  # TypeScript type definitions
    └── utils.ts                  # Utility functions
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
        import { initMultiImageGenerationDesignEditor } from './imgly';

        export default function DesignEditor() {
          return (
            <CreativeEditor
              config={{ baseURL: '/assets' }}
              init={initMultiImageGenerationDesignEditor}
              width="100vw"
              height="100vh"
            />
          );
        }
        ```
      </TabItem>

      <TabItem label="Advanced Design Editor">
        ```tsx
        import CreativeEditor from '@cesdk/cesdk-js/react';
        import { initMultiImageGenerationAdvancedDesignEditor } from './imgly';

        export default function DesignEditor() {
          return (
            <CreativeEditor
              config={{ baseURL: '/assets' }}
              init={initMultiImageGenerationAdvancedDesignEditor}
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

## Using the Starterkit

The `imgly/` module provides a unified API for editor initialization, headless rendering, and batch generation. Import what you need from the single entry point:

```typescript title="src/imgly/index.ts"
import {
  // Editor Initialization
  initMultiImageGenerationDesignEditor,          // Adopter mode (light theme, standard editing)
  initMultiImageGenerationAdvancedDesignEditor,  // Creator mode (dark theme, full template design)

  // Configuration Plugins (for direct use)
  DesignEditorConfig,
  AdvancedDesignEditorConfig,

  // Headless Engine
  initMultiImageGenerationHeadlessEngine,        // Initialize engine without UI
  renderSceneToImage,        // Load scene and export as image

  // Generation Utilities
  fillTemplate,              // Fill template with data
  generateAssets,            // Batch generate multiple assets
  applyRestaurantColors,     // Apply brand colors to loaded scene

  // Helper Utilities
  hexToRgba,                 // Convert hex color to RGBA
  replaceImageByName,        // Replace image block by name
  exportSceneAsImage         // Export current scene as image
} from './imgly';
```

### Editor Initialization

Use `initMultiImageGenerationDesignEditor` or `initMultiImageGenerationAdvancedDesignEditor` to configure the editor with all necessary plugins and asset sources:

```typescript title="src/your-component.tsx"
import CreativeEditor from '@cesdk/cesdk-js/react';
import { initMultiImageGenerationDesignEditor, initMultiImageGenerationAdvancedDesignEditor } from './imgly';

const config = {
  baseURL: '/assets/',
  license: 'YOUR_CESDK_LICENSE_KEY'
};

// Adopter mode: Light theme, standard editing features
<CreativeEditor
  config={config}
  init={async (cesdk) => {
    await initMultiImageGenerationDesignEditor(cesdk);
    await cesdk.engine.scene.loadFromString(sceneString);
  }}
/>

// Creator mode: Dark theme, full template design
<CreativeEditor
  config={config}
  init={async (cesdk) => {
    await initMultiImageGenerationAdvancedDesignEditor(cesdk);
    await cesdk.actions.run('scene.create');
  }}
/>
```

### Generation Functions

For batch image generation, use the headless engine with generation utilities:

```typescript title="src/generate.ts"
import {
  initMultiImageGenerationHeadlessEngine,
  fillTemplate,
  generateAssets
} from './imgly';
import type { Restaurant, Template, GeneratedAsset } from './app/types';

// Initialize headless engine (no UI)
const engine = await initMultiImageGenerationHeadlessEngine();

// Fill a single template with restaurant data
await fillTemplate(engine, 'instagram-square', restaurant);
const imageUrl = await exportSceneAsImage(engine);

// Or generate multiple assets at once
const templates: Template[] = [
  { sceneKey: 'instagram-square', label: 'Instagram Square' },
  { sceneKey: 'facebook-cover', label: 'Facebook Cover' },
  { sceneKey: 'twitter-header', label: 'Twitter Header' }
];

await generateAssets(engine, templates, restaurant, (index, asset) => {
  // Called for each generated asset
  console.log(`Generated ${asset.label}:`, asset.src);
});

// Clean up when done
engine.dispose();
```

***

## Set Up a Scene

CE.SDK offers multiple ways to load content into the editor. Choose the method that matches your use case:

```typescript title="src/index.ts"
// Create a blank design canvas - starts with an empty design scene
await cesdk.actions.run('scene.create');

// Load from a template archive - restores a previously saved project
await cesdk.loadFromArchiveURL('https://example.com/template.zip');

// Load from an image URL - creates a new scene with the image
await cesdk.createFromImage('https://example.com/image.jpg');

// Load from a scene file - restores a scene from JSON
await cesdk.loadFromURL('https://example.com/scene.json');
```

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading methods.

***

## Key Capabilities

The Multi Image Generation starter kit enables batch creation of on-brand design variations.

<CapabilityGrid
  features={[
  {
    title: 'Batch Generation',
    description:
      'Generate multiple image variations from a single template with different data inputs.',
    imageId: 'automation',
  },
  {
    title: 'Data-Driven Design',
    description:
      'Connect external data sources to dynamically populate design elements.',
    imageId: 'templating',
  },
  {
    title: 'Template System',
    description:
      'Create reusable templates with placeholders for text, images, and other content.',
    imageId: 'placeholders',
  },
  {
    title: 'Multi-Format Export',
    description:
      'Export designs in multiple formats and sizes for different platforms.',
    imageId: 'size-presets',
  },
  {
    title: 'Real-Time Preview',
    description:
      'Preview generated designs instantly before exporting.',
    imageId: 'client-side',
  },
  {
    title: 'Asset Libraries',
    description:
      'Access built-in collections of templates, graphics, and fonts.',
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
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](./user-interface/localization.md) – Add translations and language support



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support