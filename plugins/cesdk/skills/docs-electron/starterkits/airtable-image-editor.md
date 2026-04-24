> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Assets](./starterkits/assets.md) > [Airtable Image Editor](./starterkits/airtable-image-editor.md)

---

CE.SDK can include assets from third-party libraries accessible via API. Search and browse images from an Airtable spreadsheet in the editor.

![Airtable Image Editor starter kit showing Airtable image integration interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-airtable-asset-source-react-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-airtable-asset-source-react-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-airtable-asset-source-react-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-airtable-asset-source/)

***

## Prerequisites

Before you begin, make sure you have the following:

- **Airtable API Key** – Get your API key from your [Airtable account settings](https://support.airtable.com/docs/creating-and-using-api-keys-and-access-tokens)
- **Node.js v20+** and npm installed locally – [Download Node.js](https://nodejs.org/)
- A **supported browser** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list.

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Create a new Electron application with Airtable Image Editor integration.

    ## Step 1: Initialize a New Project

    Create a new Electron app using Vite:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm create vite@latest your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm create vite your-project-name cd your-project-name
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn create vite your-project-name cd your-project-name
      </TerminalTab>
    </TerminalTabs>

    > **Select Electron:** When prompted, select **Others > Electron**.

    ## Step 2: Clone the Starter Kit

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-airtable-asset-source-react-web.git
        cp -r starterkit-airtable-asset-source-react-web/src/imgly ./src/imgly
        rm -rf starterkit-airtable-asset-source-react-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-airtable-asset-source-react-web/src/imgly ./src/imgly npx degit
        imgly/starterkit-airtable-asset-source-react-web/public/assets ./public/assets
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your
    > project structure.

    ## Step 3: Install Dependencies

    ### Core Editor

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### Airtable Integration

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install airtable</TerminalTab>
      <TerminalTab label="pnpm">pnpm add airtable</TerminalTab>
      <TerminalTab label="yarn">yarn add airtable</TerminalTab>
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

    ## Step 5: Add a Container Element

    Add a container element to your renderer HTML where the editor will be mounted:

    ```html
    <div id="cesdk_container" style="width: 100%; height: 100vh;"></div>
    ```

    ## Step 6: Initialize the Editor

    Import and call the initialization function from your renderer entry point:

    ```typescript title="src/index.ts"
    import CreativeEditorSDK from '@cesdk/cesdk-js';
    import { initAirtableImageEditor } from './imgly';

    // Get your API key from your Airtable account settings
    const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY';

    const config = {
      baseURL: '/assets',
    };

    CreativeEditorSDK.create('#cesdk_container', config)
      .then(async cesdk => {
        await initAirtableImageEditor(cesdk, { airtableApiKey: AIRTABLE_API_KEY });
      })
      .catch(error => {
        console.error('Failed to initialize CE.SDK:', error);
      });
    ```

    > **Electron Renderer Process:** CE.SDK runs in the Electron renderer process, which provides a full Chromium
    > browser environment. Ensure your Electron main process creates a
    > `BrowserWindow` and loads the HTML file containing the container element.
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Airtable Image Editor into an existing Electron application.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">cd your-project</TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-airtable-asset-source-react-web.git
        cp -r starterkit-airtable-asset-source-react-web/src/imgly ./src/imgly
        rm -rf starterkit-airtable-asset-source-react-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-airtable-asset-source-react-web/src/imgly ./src/imgly
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
        └── airtable.ts
    ```

    ## Step 2: Install Dependencies

    ### Core Editor

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### Airtable Integration

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install airtable</TerminalTab>
      <TerminalTab label="pnpm">pnpm add airtable</TerminalTab>
      <TerminalTab label="yarn">yarn add airtable</TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    ## Step 4: Add a Container Element

    Add a container element to your renderer HTML:

    ```html
    <div id="cesdk_container" style="width: 100%; height: 100vh;"></div>
    ```

    ## Step 5: Initialize the Editor

    ```typescript title="src/index.ts"
    import CreativeEditorSDK from '@cesdk/cesdk-js';
    import { initAirtableImageEditor } from './imgly';

    // Get your API key from your Airtable account settings
    const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY';

    const config = {
      baseURL: '/assets',
    };

    CreativeEditorSDK.create('#cesdk_container', config)
      .then(async cesdk => {
        await initAirtableImageEditor(cesdk, { airtableApiKey: AIRTABLE_API_KEY });
      })
      .catch(error => {
        console.error('Failed to initialize CE.SDK:', error);
      });
    ```
  </TabItem>
</Tabs>

## Using Airtable Images

The editor provides access to images stored in your Airtable database:

### Via Dock Panel

1. Click the "Airtable" button in the dock (left sidebar)
2. Browse images or use the search bar to find specific images
3. Click any image to add it to your design

### Via Replace

1. Select an image block in the editor
2. Click "Replace" in the context menu
3. Choose an image from Airtable to replace the current image

> **API Key Required:** To use Airtable in production, you need an API key from your [Airtable account
> settings](https://support.airtable.com/docs/creating-and-using-api-keys-and-access-tokens).
> Set it via the `VITE_AIRTABLE_API_KEY` environment variable or pass it to
> `initAirtableImageEditor()`.

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

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading
> methods.

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

Customize UI labels and add support for multiple languages:

```typescript title="src/imgly/config/i18n.ts"
cesdk.i18n.setTranslations({
  en: {
    'libraries.airtable.label': 'My Images',
    'actions.export.image': 'Download Design',
  },
});
```

See [Localization](./user-interface/localization.md) for supported languages and translation key reference.

***

## Key Capabilities

<CapabilityGrid
  features={[
  {
    title: 'Airtable Images',
    description:
      'Access images stored in your Airtable database. Browse and search directly within the editor.',
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
    title: 'Desktop Native',
    description:
      'Full desktop application capabilities with native file system access and offline support.',
    imageId: 'client-side',
  },
]}
/>

<br />

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get
> a license key and remove the watermark.

***

## Troubleshooting

### Editor doesn't load

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from your application

### Airtable images don't load

- **Check your API key**: Ensure you have set a valid Airtable API key
- **Check network requests**: Open DevTools Network tab and look for failed requests

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Asset Source Plugins](./plugins/asset-sources.md) – Custom asset source
  configuration
- [Configuration](./configuration.md) – Complete list of initialization
  options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support