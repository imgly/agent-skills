> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Plugins](./starterkits/plugins.md) > [Perfectly Clear Editor](./starterkits/perfectly-clear-editor.md)

---

One-click image enhancement using the Perfectly Clear (eyeQ) plugin — scene-aware correction running entirely in-browser via WebAssembly.

![Perfectly Clear Editor starter kit showing Image enhancement interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-perfectlyclear-editor-ts-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-perfectlyclear-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-perfectlyclear-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.81.0-nightly.20260805/examples/starterkit-perfectlyclear-editor/index.html)

***

## Prerequisites

Before you begin, make sure you have the following:

- **Node.js v22+** and npm installed locally – [Download Node.js](https://nodejs.org/)
- A **supported browser** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list.
- A **Perfectly Clear (eyeQ) API key** authorized for the origin you'll run on (the runtime validates the page hostname). Contact your Perfectly Clear account manager or see the [Perfectly Clear plugin guide](./plugins/perfectly-clear.md).

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Create a new Svelte application with Perfectly Clear Editor integration.

    ## Step 1: Create a New Project

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm create vite@latest your-project-name -- --template svelte-ts
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm create vite your-project-name --template svelte-ts
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn create vite your-project-name --template svelte-ts
        cd your-project-name
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Clone the Starter Kit

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-perfectlyclear-editor-ts-web.git
        cp -r starterkit-perfectlyclear-editor-ts-web/src/imgly ./src/imgly
        rm -rf starterkit-perfectlyclear-editor-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-perfectlyclear-editor-ts-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Install Dependencies

    ### Core Editor

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### Perfectly Clear Plugin

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @imgly/plugin-perfectlyclear-web@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @imgly/plugin-perfectlyclear-web@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @imgly/plugin-perfectlyclear-web@$UBQ\_VERSION$</TerminalTab>
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

    Create `src/lib/PerfectlyClearEditor.svelte`:

    ```svelte
    <script lang="ts">
      import { onMount, onDestroy } from 'svelte';
      import CreativeEditorSDK from '@cesdk/cesdk-js';
      import { initPerfectlyClearEditor } from '../imgly';

      let container: HTMLDivElement;
      let cesdk: CreativeEditorSDK | null = null;

      onMount(async () => {
        cesdk = await CreativeEditorSDK.create(container, {
          baseURL: '/assets',
        });
        await initPerfectlyClearEditor(cesdk, { perfectlyClear: { apiKey: 'YOUR_PFC_API_KEY' } });
      });

      onDestroy(() => {
        cesdk?.dispose();
      });
    </script>

    <div bind:this={container} style="width: 100%; height: 100vh;"></div>
    ```

    ## Step 6: Use the Component

    Use the component in `App.svelte`:

    ```svelte
    <script lang="ts">
      import PerfectlyClearEditor from './lib/PerfectlyClearEditor.svelte';
    </script>

    <PerfectlyClearEditor />
    ```
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Perfectly Clear Editor into an existing Svelte application.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">
        cd your-project
      </TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-perfectlyclear-editor-ts-web.git
        cp -r starterkit-perfectlyclear-editor-ts-web/src/imgly ./src/imgly
        rm -rf starterkit-perfectlyclear-editor-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-perfectlyclear-editor-ts-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Install Dependencies

    ### Core Editor

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### Perfectly Clear Plugin

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @imgly/plugin-perfectlyclear-web@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @imgly/plugin-perfectlyclear-web@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @imgly/plugin-perfectlyclear-web@$UBQ\_VERSION$</TerminalTab>
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

    Create a Svelte component for the editor as shown in the "New Project" tab above.
  </TabItem>
</Tabs>

## Using Image Enhancement

The editor provides two ways to generate Image enhancements:

### Via Dock Panel

1. Click the "Enhance" button in the canvas menu (left sidebar)
2. The selected block enters a pending state while the WebAssembly runtime processes the image
3. Enter your URL or text content
4. Customize colors and size
5. Click "Generate" to add the Image enhancement to your design

### Via Canvas Menu

1. Right-click on the canvas
2. Select "Enhance" from the canvas menu
3. The selected block enters a pending state while the WebAssembly runtime processes the image

## Customize Assets

The Perfectly Clear Editor uses asset source plugins to provide built-in libraries for templates, stickers, shapes, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

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
- `importScene` – Import a previously saved scene (`.imgly` or `.scene`)
- `exportScene` – Export the scene as an `.imgly` file, either the scene alone or an archive with all assets
- `uploadFile` – Handle file uploads with progress tracking

Use `cesdk.actions.run()` to execute any action:

```typescript
// Run a built-in action
await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
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
```

See [Dock](./user-interface/customization/dock.md), [Inspector Bar](./user-interface/customization/inspector-bar.md), [Navigation Bar](./user-interface/customization/navigation-bar.md), [Canvas Menu](./user-interface/customization/canvas-menu.md), and [Canvas](./user-interface/customization/canvas.md) for detailed layout customization options.

***

## Key Capabilities

<CapabilityGrid
  features={[
  {
    title: 'Image Enhancement',
    description:
      'Generate customizable Image enhancements with custom colors, sizes, and content. Add them to any design with a single click.',
    imageId: 'transform',
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
    title: 'Privacy-First',
    description:
      'All processing happens locally in the browser. No data is sent to external servers.',
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

- **Check the container binding exists**: Ensure `bind:this` is properly set
- **Verify the baseURL**: Assets must be accessible from your self-hosted location

### Image enhancement panel doesn't open

- **Check plugin installation**: Ensure `@imgly/plugin-perfectlyclear-web` is installed (and that you pass a valid `apiKey`)
- **Verify plugin setup**: Check that `setupPerfectlyClearPlugin(cesdk, { apiKey })` is called with a non-empty key during initialization

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

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support