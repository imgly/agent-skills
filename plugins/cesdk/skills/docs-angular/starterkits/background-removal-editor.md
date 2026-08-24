> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Plugins](./starterkits/plugins.md) > [Background Removal Editor](./starterkits/background-removal-editor.md)

---

Effortlessly remove background from images directly in the browser with no additional costs and privacy concerns.

![Background Removal Editor starter kit showing AI-powered background removal interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-background-removal-editor-ts-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-background-removal-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-background-removal-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.81.0/examples/starterkit-background-removal-editor/index.html)

***

## Prerequisites

Before you begin, make sure you have the following:

- **Node.js v22+** and npm installed locally – [Download Node.js](https://nodejs.org/)
- A **supported browser** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list.

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Create a new Angular application with Background Removal Editor integration.

    ## Step 1: Create a New Project

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npx @angular/cli new your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm dlx @angular/cli new your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn dlx @angular/cli new your-project-name
        cd your-project-name
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Clone the Starter Kit

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-background-removal-editor-ts-web.git
        cp -r starterkit-background-removal-editor-ts-web/src/imgly ./src/imgly
        rm -rf starterkit-background-removal-editor-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-background-removal-editor-ts-web/src/imgly ./src/imgly
        npx degit imgly/starterkit-background-removal-editor-ts-web/public/assets ./public/assets
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your project structure.

    ## Step 3: Install Dependencies

    Install the required packages for the editor:

    ### Core Editor

    Install the Creative Editor SDK:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### Background Removal

    Add AI-powered background removal:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/plugin-background-removal-web@$UBQ\_VERSION$ @imgly/background-removal onnxruntime-web
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/plugin-background-removal-web@$UBQ\_VERSION$ @imgly/background-removal onnxruntime-web
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/plugin-background-removal-web@$UBQ\_VERSION$ @imgly/background-removal onnxruntime-web
      </TerminalTab>
    </TerminalTabs>

    - `@imgly/plugin-background-removal-web` – CE.SDK plugin that integrates background removal into the editor UI (canvas menu)
    - `@imgly/background-removal` – AI-powered image segmentation library (~30MB model download on first use, then cached)
    - `onnxruntime-web` – Machine learning runtime that executes the AI model in the browser

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

    Create an Angular component using the CE.SDK imperative API (e.g., `background-removal-editor.component.ts`):

    ```typescript
    import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
    import CreativeEditorSDK from '@cesdk/cesdk-js';
    import { initBackgroundRemovalEditor } from '../imgly';

    @Component({
      selector: 'app-background-removal-editor',
      standalone: true,
      template: `<div #container style="width: 100vw; height: 100vh;"></div>`
    })
    export class BackgroundRemovalEditorComponent implements OnInit, OnDestroy {
      @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
      private cesdk: CreativeEditorSDK | null = null;

      async ngOnInit() {
        this.cesdk = await CreativeEditorSDK.create(this.container.nativeElement, {
          baseURL: '/assets'
        });
        await initBackgroundRemovalEditor(this.cesdk);
      }

      ngOnDestroy() {
        this.cesdk?.dispose();
      }
    }
    ```

    ## Step 6: Use the Component

    Import and use the Background Removal Editor component in your app:

    ```typescript
    import { Component } from '@angular/core';
    import { BackgroundRemovalEditorComponent } from './background-removal-editor/background-removal-editor.component';

    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [BackgroundRemovalEditorComponent],
      template: `<app-background-removal-editor />`
    })
    export class AppComponent {}
    ```
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Background Removal Editor into an existing Angular application. This adds the editor configuration to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">
        cd your-project
      </TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-background-removal-editor-ts-web.git
        cp -r starterkit-background-removal-editor-ts-web/src/imgly ./src/imgly
        rm -rf starterkit-background-removal-editor-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-background-removal-editor-ts-web/src/imgly ./src/imgly
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
        └── background-removal.ts
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

    ### Background Removal

    Add AI-powered background removal:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/plugin-background-removal-web@$UBQ\_VERSION$ @imgly/background-removal onnxruntime-web
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/plugin-background-removal-web@$UBQ\_VERSION$ @imgly/background-removal onnxruntime-web
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/plugin-background-removal-web@$UBQ\_VERSION$ @imgly/background-removal onnxruntime-web
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. For Angular projects, place these in your `public/` directory which is served automatically.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    ## Step 4: Create the Editor Component

    Create an Angular component using the CE.SDK imperative API:

    ```typescript
    import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
    import CreativeEditorSDK from '@cesdk/cesdk-js';
    import { initBackgroundRemovalEditor } from '../imgly';

    @Component({
      selector: 'app-background-removal-editor',
      standalone: true,
      template: `<div #container style="width: 100vw; height: 100vh;"></div>`
    })
    export class BackgroundRemovalEditorComponent implements OnInit, OnDestroy {
      @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
      private cesdk: CreativeEditorSDK | null = null;

      async ngOnInit() {
        this.cesdk = await CreativeEditorSDK.create(this.container.nativeElement, {
          baseURL: '/assets'
        });
        await initBackgroundRemovalEditor(this.cesdk);
      }

      ngOnDestroy() {
        this.cesdk?.dispose();
      }
    }
    ```

    ## Step 5: Use the Component

    Import and use the component in your app:

    ```typescript
    import { Component } from '@angular/core';
    import { BackgroundRemovalEditorComponent } from './background-removal-editor/background-removal-editor.component';

    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [BackgroundRemovalEditorComponent],
      template: `<app-background-removal-editor />`
    })
    export class AppComponent {}
    ```
  </TabItem>
</Tabs>

## Using Background Removal

To remove a background:

1. Select an image in the editor
2. The canvas menu appears with a "BG Removal" button
3. Click the button to AI-remove the background

> **First Use:** The first time you use background removal, it downloads the AI models (~30MB). Subsequent uses are instant as the models are cached by the browser.

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

***

## Key Capabilities

<CapabilityGrid
  features={[
  {
    title: 'AI Background Removal',
    description:
      'Remove backgrounds with one click. Uses ONNX Runtime for client-side AI processing—no server needed.',
    imageId: 'green-screen',
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

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check console errors**: Look for CORS or network errors in browser developer tools

### Background removal is slow on first use

- **This is expected**: The first use downloads AI models (~30MB). Subsequent uses are instant as models are cached by the browser.

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Background Removal Plugin](./edit-image/remove-bg.md) – Detailed plugin configuration options
- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance



---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support