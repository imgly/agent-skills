> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Templating](./starterkits/templating.md) > [Placeholders](./starterkits/placeholders.md)

---

Ensure staying on brand and simplify the design process by defining placeholders and design constraints.

![Design Editor starter kit showing a professional design editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-placeholders-react-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-placeholders-react-web/tree/v$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-placeholders-react-web/tree/v$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-placeholders/)

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

    Start fresh with a standalone Design Placeholders Editor project. This creates a complete, ready-to-run application.

    ## Step 1: Clone the Repository

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-placeholders-react-web.git
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-placeholders-react-web starterkit-placeholders-react-web
      </TerminalTab>
    </TerminalTabs>

    The `src/` folder contains the editor code:

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
    │   └── index.ts                  # Editor initialization function
    └── index.tsx                 # Application entry point
    ```

    ## Step 2: Install Dependencies

    Install the required packages:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        cd starterkit-placeholders-react-web
        npm install
      </TerminalTab>

      <TerminalTab label="pnpm">
        cd starterkit-placeholders-react-web
        pnpm install
      </TerminalTab>

      <TerminalTab label="yarn">
        cd starterkit-placeholders-react-web
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

    Integrate the Design Placeholders Editor into an existing Electron application. This adds the editor configuration to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">cd your-project</TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-placeholders-react-web.git
        cp -r starterkit-placeholders-react-web/src/imgly ./src/imgly
        rm -rf starterkit-placeholders-react-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-placeholders-react-web/src/imgly ./src/imgly
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
    └── index.ts                  # Editor initialization function
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

    Choose your editing mode and initialize the editor accordingly:

    <Tabs syncKey="editor-mode">
      <TabItem label="Creator">
        ```typescript title="src/index.ts"
        import CreativeEditorSDK from '@cesdk/cesdk-js';

        import { initPlaceholdersCreatorEditor } from './imgly';

        const config = {
          userId: 'your-user-id',
          baseURL: '/assets'
          // license: 'YOUR_LICENSE_KEY',
        };

        CreativeEditorSDK.create('#cesdk_container', config)
          .then(async (cesdk) => {
            await initPlaceholdersCreatorEditor(cesdk);
          })
          .catch((error) => {
            console.error('Failed to initialize CE.SDK:', error);
          });
        ```
      </TabItem>

      <TabItem label="Adopter">
        ```typescript title="src/index.ts"
        import CreativeEditorSDK from '@cesdk/cesdk-js';

        import { initPlaceholdersAdopterEditor } from './imgly';

        const config = {
          userId: 'your-user-id',
          baseURL: '/assets'
          // license: 'YOUR_LICENSE_KEY',
        };

        CreativeEditorSDK.create('#cesdk_container', config)
          .then(async (cesdk) => {
            await initPlaceholdersAdopterEditor(cesdk);
          })
          .catch((error) => {
            console.error('Failed to initialize CE.SDK:', error);
          });
        ```
      </TabItem>
    </Tabs>
  </TabItem>
</Tabs>

## Design Placeholders

The Design Placeholders Editor uses a **Creator/Adopter workflow** for template-based design creation. This workflow separates template design from content filling, enabling scalable design production.

### Creator Mode

Creators design templates with placeholder regions using the Advanced Design Editor configuration:

- **Full editing capabilities** with advanced inspector panel
- **Dark theme** optimized for professional editing workflows
- **Define placeholder regions** for image, text, and graphic content
- **Complete control** over template structure and design

```typescript title="src/imgly/index.ts"
export async function initPlaceholdersCreatorEditor(cesdk: CreativeEditorSDK) {
  // Use advanced design editor for full editing capabilities
  await cesdk.addPlugin(new AdvancedEditorConfig());

  // Dark theme for professional editing
  cesdk.ui.setTheme('dark');

  // Enable placeholder features for template creation
  cesdk.feature.enable('ly.img.placeholder*');
  cesdk.feature.enable('ly.img.inspector');

  // Set the Creator role
  cesdk.engine.editor.setRole('Creator');
}
```

### Adopter Mode

Adopters customize templates by filling placeholders using the simplified Design Editor configuration:

- **Streamlined interface** focused on content replacement
- **Light theme** for content editing workflows
- **Replace placeholder content** while maintaining template structure
- **Limited editing** to preserve design consistency

```typescript title="src/imgly/index.ts"
export async function initPlaceholdersAdopterEditor(cesdk: CreativeEditorSDK) {
  // Use standard design editor for simplified experience
  await cesdk.addPlugin(new DesignEditorConfig());

  // Light theme for content editing
  cesdk.ui.setTheme('light');

  // Set the Adopter role
  cesdk.engine.editor.setRole('Adopter');
}
```

> **Learn More About Placeholders:** See [Placeholders](./create-templates/add-dynamic-content/placeholders.md) for detailed documentation on creating and managing placeholder regions.

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

## Customize Assets

The editor uses asset source plugins to provide built-in libraries for templates, stickers, shapes, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

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
    'actions.export.design': 'Download Design',
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

#### Custom Asset Sources

Connect external asset libraries like Unsplash, Getty Images, or your own content management system. Asset sources let users browse and insert content from any source.

```typescript title="src/imgly/config/plugin.ts"
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
- **AI Integration** – Text-to-image generation and enhancement
- **And more** – Check the repository for the latest additions

***

## Key Capabilities

The Design Placeholders Editor enables template-based design creation at scale.

<CapabilityGrid
  features={[
  {
    title: 'Image Placeholders',
    description:
      'Define swappable image placeholder regions that users or scripts can customize with content.',
    imageId: 'placeholders',
  },
  {
    title: 'Text Placeholders',
    description:
      'Create editable text areas that maintain styling while allowing content changes.',
    imageId: 'text-editing',
  },
  {
    title: 'Creator/Adopter Workflow',
    description:
      'Separate template design from content filling with dedicated Creator and Adopter modes.',
    imageId: 'templating',
  },
  {
    title: 'Scalable Output',
    description:
      'Generate multiple design variations by swapping placeholder content programmatically.',
    imageId: 'automation',
  },
  {
    title: 'Design Export',
    description:
      'Export finished designs in PNG, JPEG, or PDF format with customizable quality settings.',
    imageId: 'client-side',
  },
  {
    title: 'Media Library',
    description:
      'Access built-in media assets or integrate custom asset libraries.',
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
- [Placeholders](./create-templates/add-dynamic-content/placeholders.md) – Create and manage placeholder regions



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support