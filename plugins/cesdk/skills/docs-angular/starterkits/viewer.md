> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Design Viewer](./starterkits/viewer.md)

---

Lightweight design viewing for your web app—pan, zoom, and navigate multi-page designs. Runs entirely in the browser with no server dependencies.

![Viewer starter kit showing a lightweight content display interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-design-viewer-ts-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-design-viewer-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/starterkit-design-viewer-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/examples/starterkit-design-viewer/)

***

## Pre-requisites

This guide assumes basic familiarity with JavaScript or TypeScript.

- **Node.js v20+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Start fresh with a standalone Design Viewer project. This creates a complete, ready-to-run application.

    ## Step 1: Clone the Repository

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-design-viewer-ts-web.git
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-design-viewer-ts-web starterkit-design-viewer-ts-web
      </TerminalTab>
    </TerminalTabs>

    The `src/` folder contains the viewer code:

    ```
    src/
    ├── index.ts                      # Application entry point
    └── imgly/
        ├── index.ts                  # Viewer initialization function
        └── config/
            ├── plugin.ts             # Main configuration plugin
            ├── features.ts           # Feature toggles
            ├── i18n.ts               # Translations
            ├── settings.ts           # Engine settings
            └── ui/                   # UI customization
                ├── index.ts          # Combines UI customization exports
                ├── canvas.ts         # Canvas configuration
                └── navigationBar.ts  # Navigation bar layout
    ```

    ## Step 2: Install Dependencies

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        cd starterkit-design-viewer-ts-web
        npm install
      </TerminalTab>

      <TerminalTab label="pnpm">
        cd starterkit-design-viewer-ts-web
        pnpm install
      </TerminalTab>

      <TerminalTab label="yarn">
        cd starterkit-design-viewer-ts-web
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

    The `baseURL` in your configuration should point to this location:

    ```typescript title="src/index.ts"
    const config = {
      // ...
      baseURL: '/assets'
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

    Integrate the Design Viewer into an existing web application. This adds the viewer configuration to your current project structure.

    ## Step 1: Copy Viewer Configuration

    <TerminalTabs>
      <TerminalTab label="Navigate">
        cd your-project
      </TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the viewer configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-design-viewer-ts-web.git
        cp -r starterkit-design-viewer-ts-web/src/imgly ./src/imgly
        rm -rf starterkit-design-viewer-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-design-viewer-ts-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your project structure.

    The `imgly/` folder contains the viewer configuration:

    ```
    imgly/
    ├── index.ts                  # Viewer initialization function
    └── config/
        ├── plugin.ts             # Main configuration plugin
        ├── features.ts           # Feature toggles
        ├── i18n.ts               # Translations
        ├── settings.ts           # Engine settings
        └── ui/                   # UI customization
            ├── index.ts          # Combines UI customization exports
            ├── canvas.ts         # Canvas configuration
            └── navigationBar.ts  # Navigation bar layout
    ```

    ## Step 2: Install Dependencies

    The Design Viewer requires one core package:

    ### Core Editor

    The Creative Editor SDK package provides all viewing functionality.

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

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `public/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    The `baseURL` in your configuration should point to this location:

    ```typescript title="src/index.ts"
    const config = {
      // ...
      baseURL: '/assets'
    };
    ```

    ## Step 4: Add a Container Element

    Add a container element to your HTML where the viewer will be mounted:

    ```html
    <div id="cesdk_container" style="width: 100%; height: 100vh;"></div>
    ```

    ## Step 5: Initialize the Viewer

    Import and call the initialization function from your application's entry point:

    ```typescript title="src/index.ts"
    import CreativeEditorSDK from '@cesdk/cesdk-js';

    import { initDesignViewer } from './imgly';

    const config = {
      userId: 'your-user-id',
      baseURL: '/assets'
      // license: 'YOUR_LICENSE_KEY',
    };

    CreativeEditorSDK.create('#cesdk_container', config)
      .then(async (cesdk) => {
        await initDesignViewer(cesdk);
      })
      .catch((error) => {
        console.error('Failed to initialize CE.SDK:', error);
      });
    ```
  </TabItem>
</Tabs>

## Set Up a Scene

CE.SDK offers multiple ways to load content into the viewer. Choose the method that matches your use case:

```typescript title="src/index.ts"
// Load from a template archive - loads a previously saved project
await cesdk.loadFromArchiveURL('https://example.com/design.zip');

// Load from a scene file - restores a scene from JSON
await cesdk.loadFromURL('https://example.com/scene.json');

// Zoom to fit the content
await cesdk.actions.run('zoom.toPage', {
  page: 'first',
  autoFit: true,
  padding: 24
});
```

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading methods.

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
    'common.zoomIn': 'Zoom In',
    'common.zoomOut': 'Zoom Out'
  }
});

// Add a new language
cesdk.i18n.setTranslations({
  de: {
    'common.zoomIn': 'Vergrößern'
  }
});

// Set the active locale
cesdk.i18n.setLocale('de');
```

See [Localization](./user-interface/localization.md) for supported languages, translation key reference, and right-to-left language support.

***

## Key Capabilities

The Design Viewer includes everything needed for design viewing.

<CapabilityGrid
  features={[
  {
    title: 'Pan & Zoom',
    description:
      'Navigate designs with intuitive pan and zoom controls.',
    imageId: 'transform',
  },
  {
    title: 'Page Navigation',
    description:
      'Navigate between pages in multi-page designs and presentations.',
    imageId: 'filters',
  },
  {
    title: 'Zoom Controls',
    description:
      'Zoom in and out of the canvas with fit-to-screen options.',
    imageId: 'green-screen',
  },
  {
    title: 'Read-Only Mode',
    description:
      'Display design content without editing capabilities for preview and approval workflows.',
    imageId: 'text-editing',
  },
  {
    title: 'Approval Workflows',
    description:
      'Review and approve designs without the risk of accidental modifications.',
    imageId: 'asset-libraries',
  },
  {
    title: 'Lightweight Interface',
    description:
      'Minimal UI focused on viewing experience without editing distractions.',
    imageId: 'client-side',
  },
]}
/>

<br />

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

***

## Troubleshooting

### Viewer doesn't load

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check console errors**: Look for CORS or network errors in browser developer tools

### Content doesn't appear

- **Check network requests**: Open DevTools Network tab and look for failed requests to `cdn.img.ly`
- **Self-host assets for production**: See [Serve Assets](./serve-assets.md) to host assets on your infrastructure

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](./user-interface/localization.md) – Add translations and language support



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support