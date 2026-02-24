> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Photo Editor](./starterkits/photo-editor.md)

---

Professional photo editing for your Vue app—crop, filter, adjust, and remove backgrounds. Runs entirely in the browser with no server dependencies.

![Photo Editor starter kit showing a professional photo editing interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-photo-editor-ts-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-photo-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/starterkit-photo-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/examples/starterkit-photo-editor/)

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

    Create a new Vue application with Photo Editor integration.

    ## Step 1: Create a New Project

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm create vue@latest your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm create vue your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn create vue your-project-name
        cd your-project-name
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Clone the Starter Kit

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-photo-editor-ts-web.git
        cp -r starterkit-photo-editor-ts-web/src/imgly ./src/imgly
        rm -rf starterkit-photo-editor-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-photo-editor-ts-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your project structure.

    ## Step 3: Install Dependencies

    Install the required packages for the editor:

    ### Core Editor

    Install the Creative Editor SDK:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js</TerminalTab>
    </TerminalTabs>

    ### Background Removal

    Add AI-powered background removal:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/background-removal onnxruntime-web
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/background-removal onnxruntime-web
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/background-removal onnxruntime-web
      </TerminalTab>
    </TerminalTabs>

    The `onnxruntime-web` package provides the machine learning runtime required for client-side AI processing.

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

    Create a Vue component using the official CE.SDK Vue wrapper (e.g., `PhotoEditor.vue`):

    ```vue
    <template>
      <CreativeEditor
        :config="{ baseURL: '/assets' }"
        :init="initPhotoEditor"
        width="100vw"
        height="100vh"
      />
    </template>

    <script setup lang="ts">
    import { initPhotoEditor } from './imgly';
    import CreativeEditor from '@cesdk/cesdk-js/vue';
    </script>
    ```

    ## Step 6: Use the Component

    Use the component in your app:

    ```vue
    <template>
      <PhotoEditor />
    </template>

    <script setup lang="ts">
    import PhotoEditor from './components/PhotoEditor.vue';
    </script>
    ```

    ## Force Crop

    Require users to crop images to specific dimensions before saving. This is useful for profile pictures, social media posts, or any workflow requiring consistent image sizes.

    Use `applyForceCrop` to enforce a specific aspect ratio on the selected image:

    ```typescript title="src/imgly/config/actions.ts"
    // Get the currently selected image block
    const selectedBlocks = cesdk.engine.block.findAllSelected();
    const imageBlock = selectedBlocks[0];

    // Apply a 1:1 square crop
    await cesdk.ui.applyForceCrop(imageBlock, {
      sourceId: 'ly.img.crop.presets',
      presetId: 'ly.img.crop.presets.fixed-ratio.1_1',
      mode: 'ifNeeded'
    });
    ```

    The `mode` parameter controls how the crop is applied:

    - `silent` – Apply the crop automatically without showing the crop UI
    - `always` – Apply the crop and open the crop UI for user adjustment
    - `ifNeeded` – Only show the crop UI if current dimensions differ from the preset

    **Available preset IDs:**

    - `ly.img.crop.presets.fixed-ratio.free` – Free aspect ratio
    - `ly.img.crop.presets.fixed-ratio.1_1` – Square (1:1)
    - `ly.img.crop.presets.fixed-ratio.9_16` – Portrait (9:16)
    - `ly.img.crop.presets.fixed-ratio.16_9` – Landscape (16:9)
    - `ly.img.crop.presets.fixed-ratio.4_3` – Standard (4:3)
    - `ly.img.crop.presets.fixed-ratio.3_4` – Portrait (3:4)
    - `ly.img.crop.presets.fixed-ratio.4_5` – Portrait (4:5)
    - `ly.img.crop.presets.fixed-ratio.5_4` – Landscape (5:4)

    
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Photo Editor into an existing Vue application. This adds the editor configuration to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">
        cd your-project
      </TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-photo-editor-ts-web.git
        cp -r starterkit-photo-editor-ts-web/src/imgly ./src/imgly
        rm -rf starterkit-photo-editor-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-photo-editor-ts-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your project structure.

    The `imgly/` folder contains the editor configuration:

    ```
    imgly/
    ├── index.ts                  # Editor initialization function
    ├── config/
    │   ├── plugin.ts             # Main configuration plugin
    │   ├── actions.ts            # Export/import actions
    │   ├── features.ts           # Feature toggles
    │   ├── i18n.ts               # Translations
    │   ├── settings.ts           # Engine settings
    │   └── ui/                   # UI customization
    │       ├── index.ts          # Combines UI customization exports
    │       ├── canvas.ts         # Canvas configuration
    │       ├── components.ts     # Custom component registration
    │       ├── dock.ts           # Dock layout configuration
    │       ├── inspectorBar.ts   # Inspector bar layout
    │       ├── navigationBar.ts  # Navigation bar layout
    │       └── panel.ts          # Panel configuration
    └── plugins/
        └── background-removal.ts # Background removal plugin
    ```

    ## Step 2: Install Dependencies

    Install the required packages for the editor:

    ### Core Editor

    Install the Creative Editor SDK:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @cesdk/cesdk-js
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @cesdk/cesdk-js
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @cesdk/cesdk-js
      </TerminalTab>
    </TerminalTabs>

    ### Background Removal

    Add AI-powered background removal:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/background-removal onnxruntime-web
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/background-removal onnxruntime-web
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/background-removal onnxruntime-web
      </TerminalTab>
    </TerminalTabs>

    The `onnxruntime-web` package provides the machine learning runtime required for client-side AI processing.

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `public/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in Step 4: Create the Editor Component.

    ## Step 4: Create the Editor Component

    Create a Vue component that uses the `CreativeEditor` wrapper with the `initPhotoEditor` function from the starterkit:

    ```vue
    <template>
      <CreativeEditor
        :config="{ baseURL: '/assets' }"
        :init="initPhotoEditor"
        width="100vw"
        height="100vh"
      />
    </template>

    <script setup lang="ts">
    import { initPhotoEditor } from './imgly';
    import CreativeEditor from '@cesdk/cesdk-js/vue';
    </script>
    ```

    ## Step 5: Use the Component

    Use the component in your app:

    ```vue
    <template>
      <PhotoEditor />
    </template>

    <script setup>
    import PhotoEditor from './components/PhotoEditor.vue';
    </script>
    ```

    ## Force Crop

    Require users to crop images to specific dimensions before saving. This is useful for profile pictures, social media posts, or any workflow requiring consistent image sizes.

    Use `applyForceCrop` to enforce a specific aspect ratio on the selected image:

    ```typescript title="/imgly/config/actions.ts"
    // Get the currently selected image block
    const selectedBlocks = cesdk.engine.block.findAllSelected();
    const imageBlock = selectedBlocks[0];

    // Apply a 1:1 square crop
    await cesdk.ui.applyForceCrop(imageBlock, {
      sourceId: 'ly.img.crop.presets',
      presetId: 'ly.img.crop.presets.fixed-ratio.1_1',
      mode: 'ifNeeded'
    });
    ```

    The `mode` parameter controls how the crop is applied:

    - `silent` – Apply the crop automatically without showing the crop UI
    - `always` – Apply the crop and open the crop UI for user adjustment
    - `ifNeeded` – Only show the crop UI if current dimensions differ from the preset

    **Available preset IDs:**

    - `ly.img.crop.presets.fixed-ratio.free` – Free aspect ratio
    - `ly.img.crop.presets.fixed-ratio.1_1` – Square (1:1)
    - `ly.img.crop.presets.fixed-ratio.9_16` – Portrait (9:16)
    - `ly.img.crop.presets.fixed-ratio.16_9` – Landscape (16:9)
    - `ly.img.crop.presets.fixed-ratio.4_3` – Standard (4:3)
    - `ly.img.crop.presets.fixed-ratio.3_4` – Portrait (3:4)
    - `ly.img.crop.presets.fixed-ratio.4_5` – Portrait (4:5)
    - `ly.img.crop.presets.fixed-ratio.5_4` – Landscape (5:4)

    
  </TabItem>
</Tabs>

## Set Up a Scene

CE.SDK offers multiple ways to load content into the editor. Choose the method that matches your use case:

```typescript title="src/imgly/index.ts"
// Load from an image URL - creates a new scene with the image
await cesdk.createFromImage('https://example.com/photo.jpg');

// Load from a template archive - restores a previously saved project
await cesdk.loadFromArchiveURL('https://example.com/template.zip');

// Create a blank canvas - starts with an empty design scene
await cesdk.actions.run('scene.create');

// Load from a scene file - restores a scene from JSON
await cesdk.loadFromURL('https://example.com/scene.json');
```

The `createFromImage()` method is ideal for photo editing workflows, as it automatically creates a scene sized to the image dimensions.

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading methods.

## Customize Assets

The Photo Editor uses asset source plugins to provide built-in libraries for filters, effects, stickers, shapes, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

Asset sources are added via plugins in `src/imgly/index.ts`. Enable or disable individual sources:

```typescript title="src/imgly/index.ts"
import {
  FiltersAssetSource,
  StickerAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  // ...
} from '@cesdk/cesdk-js/plugins';

// Add only the sources you need
await cesdk.addPlugin(new FiltersAssetSource());
await cesdk.addPlugin(new StickerAssetSource());
await cesdk.addPlugin(new TextAssetSource());
await cesdk.addPlugin(new VectorShapeAssetSource());
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
// Register export action that downloads the edited photo
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
  formData.append('image', blobs[0], 'edited-photo.png');

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
    'actions.export.image': 'Download Photo',
    'common.cancel': 'Cancel',
    'common.apply': 'Apply'
  }
});

// Add a new language
cesdk.i18n.setTranslations({
  de: {
    'actions.export.image': 'Foto herunterladen'
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

```typescript title="src/imgly/config/plugin.ts"
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal';

// Add background removal capability
await cesdk.addPlugin(BackgroundRemovalPlugin());
```

See [Background Removal](./edit-image/remove-bg.md) for setup instructions and configuration options.

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
- **Design Presets** – Pre-built design templates
- **Social Media Templates** – Platform-specific sizing
- **And more** – Check the repository for the latest additions

***

## Key Capabilities

The Photo Editor includes everything needed for professional image editing.

<CapabilityGrid
  features={[
  {
    title: 'Transform Operations',
    description:
      'Crop, rotate, resize, and flip images with precision controls and visual feedback.',
    imageId: 'transform',
  },
  {
    title: 'Professional Filters',
    description:
      'Apply color grading with LUT filters, duotone effects, and customizable image adjustments.',
    imageId: 'filters',
  },
  {
    title: 'Background Removal',
    description:
      'AI-powered background removal that runs entirely in the browser without server dependencies.',
    imageId: 'green-screen',
  },
  {
    title: 'Text Overlays',
    description:
      'Add styled text with comprehensive typography controls, fonts, and visual effects.',
    imageId: 'text-editing',
  },
  {
    title: 'Asset Libraries',
    description:
      'Access built-in collections of stickers, shapes, and graphics, plus import custom assets.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Export Options',
    description:
      'Export to multiple formats including PNG, JPEG, and PDF with quality and size controls.',
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

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support