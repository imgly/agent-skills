> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Photobook Editor](./starterkits/photobook-editor.md)

---

A complete photobook editor with a layouts library, photo auto-fill, live design validation, and export to print-ready PDF/X-4.

![Photobook Editor starter kit showing a photobook spread with the layouts library and validation sidebar](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 15 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-photobook-editor-react-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-photobook-editor-react-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.83.0-rc.2/examples/starterkit-photobook-editor/index.html)

***

## Pre-requisites

This guide assumes basic familiarity with SvelteKit and TypeScript.

- **Node.js v22+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Start fresh with a standalone Photobook Editor project. This creates a complete, ready-to-run SvelteKit application with a start screen, an editor, and an export pipeline.

    ## Step 1: Create a New Project

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npx sv create your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm dlx sv create your-project-name
        cd your-project-name
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn dlx sv create your-project-name
        cd your-project-name
      </TerminalTab>
    </TerminalTabs>

    ## Step 2: Copy the Editor Logic

    Copy the kit's editor logic into the project you just created:

    <TerminalTabs>
      <TerminalTab label="degit">
        npx degit imgly/starterkit-photobook-editor-react-web/src/client/src/imgly ./src/lib/imgly
      </TerminalTab>

      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-photobook-editor-react-web.git
        cp -r starterkit-photobook-editor-react-web/src/client/src/imgly ./src/lib/imgly
        rm -rf starterkit-photobook-editor-react-web
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/lib/imgly`. Adjust the path to match your project structure.

    ## Step 3: Install Dependencies

    Install the required packages for the editor:

    ### Core Editor

    Install the Creative Editor SDK:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
      <TerminalTab label="yarn">yarn add @cesdk/cesdk-js@$UBQ\_VERSION$</TerminalTab>
    </TerminalTabs>

    ### Print Ready PDF

    Add the PDF/X conversion used by the export:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">npm install @imgly/plugin-print-ready-pdfs-web</TerminalTab>
      <TerminalTab label="pnpm">pnpm add @imgly/plugin-print-ready-pdfs-web</TerminalTab>
      <TerminalTab label="yarn">yarn add @imgly/plugin-print-ready-pdfs-web</TerminalTab>
    </TerminalTabs>

    ## Step 4: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `static/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d static/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The editor loads assets from `/assets`. If you place them elsewhere, update
    > the `baseURL` in Step 5: Create the Editor Component.

    ## Step 5: Create the Editor Component

    Create the editor and hand it to `initPhotobookEditor` with the scene to open:

    ```svelte title="src/routes/+page.svelte"
    <script lang="ts">
      import { browser } from '$app/environment';
      import { onDestroy, onMount } from 'svelte';
      import type CreativeEditorSDK from '@cesdk/cesdk-js';

      import { initPhotobookEditor } from '$lib/imgly';

      let container: HTMLDivElement;
      let cesdk: CreativeEditorSDK | undefined;

      onMount(async () => {
        if (!browser) return;
        const { default: CreativeEditorSDK } = await import('@cesdk/cesdk-js');
        cesdk = await CreativeEditorSDK.create(container, {
          userId: 'your-user-id',
          baseURL: '/assets'
        });
        await initPhotobookEditor(
          cesdk,
          'https://your-server.example.com/photobook-assets/style-playful-portrait.imgly'
        );
      });

      onDestroy(() => cesdk?.dispose());
    </script>

    <div bind:this={container} style="width: 100vw; height: 100vh"></div>
    ```

    `initPhotobookEditor` takes a scene and nothing else. It configures the editor, loads the scene, and reads the rest — the page format and the asset root — from the scene itself.

    Filling the book with photos is your app's job, not the kit's. See [Set Up a Scene](#set-up-a-scene) for the calls that do it.

    ## Step 6: Use the Component

    The editor component above is already the route page at `src/routes/+page.svelte`, so no extra wiring is needed.
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Add the photobook editor to a web application that already uses CE.SDK. You take the editor logic, install the packages it needs, point it at your asset host, and decide whether you want an export server.

    ## Step 1: Copy the Editor Logic

    <TerminalTabs>
      <TerminalTab label="Navigate">
        cd your-project
      </TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor logic into your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-photobook-editor-react-web.git
        cp -r starterkit-photobook-editor-react-web/src/client/src/imgly ./src/lib/imgly
        rm -rf starterkit-photobook-editor-react-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-photobook-editor-react-web/src/client/src/imgly ./src/lib/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/lib/imgly`. Adjust the path to match your project structure.

    The `imgly/` folder holds the layouts library, the auto-fill, the validation checks, and the editor configuration, with no dependency on the demo application:

    ```
    imgly/
    ├── index.ts                  # Editor initialization function
    ├── photobook.ts              # Sizes, styles, and the scene each starts from
    ├── photos.ts                 # Upload asset source for the reader's photos
    ├── autofill.ts               # Places photos and captions into placeholders
    ├── placeholders.ts           # What counts as unfilled placeholder content
    ├── photo-stash.ts            # Holds photos that a smaller layout cannot fit
    ├── preview-mode.ts           # Page-spread preview
    ├── block-utils.ts            # Engine helpers shared across the kit
    ├── constants.ts              # Shared identifiers and panel helpers
    ├── plugins/layouts/
    │   └── layout.ts             # Layouts asset source and layout switching
    ├── validation.ts             # The print validation checks
    ├── validation-types.ts       # Validation result types
    ├── validation-utils.ts       # Validation helpers
    └── config/
        ├── plugin.ts             # Main configuration plugin
        ├── actions.ts            # Export/import actions
        ├── features.ts           # Feature toggles
        ├── i18n.ts               # Translations
        ├── settings.ts           # Engine settings
        ├── keyboard/             # Keyboard shortcut catalog
        └── ui/                   # UI customization
    ```

    Validation runs on its own: the checks in `imgly/validation.ts` report every problem they find without further setup. The user-facing names and descriptions for those reports are presentation, and the kit keeps them in `src/client/src/app/validation-config.ts`. That file is not required for validation to run — copy it if you want its wording, or write your own labels in your UI.

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

    ### Print Ready PDF

    Add the PDF/X conversion used by the export pipeline:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @imgly/plugin-print-ready-pdfs-web
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @imgly/plugin-print-ready-pdfs-web
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @imgly/plugin-print-ready-pdfs-web
      </TerminalTab>
    </TerminalTabs>

    This plugin runs in the browser. See [Print Ready PDF](./plugins/print-ready-pdf.md) for its options.

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `static/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d static/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** Set `baseURL` to where you serve these files in Step 4: Create the Editor Component.

    The kit's layout and style scenes are a separate bundle. Host it yourself and serve the scene from that same root: the kit derives the asset root from the scene URL you pass.

    ## Step 4: Create the Editor Component

    Create the editor and hand it to `initPhotobookEditor` with the scene to open:

    ```svelte title="src/routes/+page.svelte"
    <script lang="ts">
      import { browser } from '$app/environment';
      import { onDestroy, onMount } from 'svelte';
      import type CreativeEditorSDK from '@cesdk/cesdk-js';

      import { initPhotobookEditor } from '$lib/imgly';

      let container: HTMLDivElement;
      let cesdk: CreativeEditorSDK | undefined;

      onMount(async () => {
        if (!browser) return;
        const { default: CreativeEditorSDK } = await import('@cesdk/cesdk-js');
        cesdk = await CreativeEditorSDK.create(container, {
          userId: 'your-user-id',
          baseURL: '/assets'
        });
        await initPhotobookEditor(
          cesdk,
          'https://your-server.example.com/photobook-assets/style-playful-portrait.imgly'
        );
      });

      onDestroy(() => cesdk?.dispose());
    </script>

    <div bind:this={container} style="width: 100vw; height: 100vh"></div>
    ```

    `initPhotobookEditor` takes a scene and nothing else. It configures the editor, loads the scene, and reads the rest — the page format and the asset root — from the scene itself.

    Filling the book with photos is your app's job, not the kit's. See [Set Up a Scene](#set-up-a-scene) for the calls that do it.

    ## Step 5 (Optional): Offload Rendering to a Node Server

    Keep browser-side export and you are done — nothing else is required.

    Rendering a long book on a low-powered device is the case for moving the work off the reader's machine. Copy the bundled server. It is five files:

    ```
    src/server/index.ts        # Composition root: wires the exporter in, listens on 8080, graceful shutdown
    src/server/http/routes.ts  # The five routes, size and rate limits, job wiring, JSON error handler
    src/server/imgly/export.ts # Renders the scene archive with @cesdk/node-native
    src/server/jobs/store.ts   # In-memory job store, limits, and the expiry sweep
    src/shared/export-api.ts   # Wire types shared with the client
    ```

    `@cesdk/node-native` is a native binary, so it runs where its platform build does: Linux x64 with glibc 2.39 or newer, macOS on ARM or x64, and Windows x64. Check that against your base image before you build.

    Install what the server needs:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @cesdk/node-native@$UBQ\_VERSION$ express dotenv
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @cesdk/node-native@$UBQ\_VERSION$ express dotenv
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @cesdk/node-native@$UBQ\_VERSION$ express dotenv
      </TerminalTab>
    </TerminalTabs>

    To render on a backend you already run instead, implement the same contract. Match the wire types in `src/shared/export-api.ts` and these routes:

    | Route | Purpose |
    | --- | --- |
    | `POST /api/export` | Upload the scene archive, receive a job id |
    | `GET /api/export/:id` | Poll the job status |
    | `GET /api/export/:id/file` | Download the rendered PDF |
    | `DELETE /api/export/:id` | Discard a job the client no longer needs |
    | `GET /api/health` | Readiness probe |

    The client calls these as relative paths, so serve them on the same origin or proxy them. Set `VITE_USE_SERVER=true` to route exports through the server.

    Only rendering moves to the server. The PDF/X conversion always runs in the browser, so the server never needs `@imgly/plugin-print-ready-pdfs-web`.

    ## Exporting Print-Ready PDFs

    Export produces a **PDF/X-4** file with a **FOGRA39** output intent.

    In your own project this is a second step, not something export does for you. It needs `@imgly/plugin-print-ready-pdfs-web` from [Print Ready PDF](#print-ready-pdf) above. Copy `toPrintReadyPDF` from the kit's `src/client/src/app/print-ready-pdf.ts`, then export the scene to a PDF and convert it:

    ```typescript title="src/export.ts"
    const pdf = await cesdk.engine.block.export(page, { mimeType: 'application/pdf' });
    const printReady = await toPrintReadyPDF(pdf);
    ```

    Pass an `AbortSignal` as the second argument to cancel the conversion. This step stays in the browser whether or not you added the server.
  </TabItem>
</Tabs>

***

## What the Kit Offers

<WhatTheKitOffers {...props} />

## Set Up a Scene

<SetUpAScene {...props} />

***

## Customize

### Layouts

<CustomizeLayouts {...props} />

### Validation

<CustomizeValidation {...props} />

### Print Export

<CustomizePrintExport {...props} />

### Theming and Localization

<CustomizeTheming {...props} />

***

## Key Capabilities

<KeyCapabilities {...props} />

***

## Troubleshooting

### Editor doesn't load

<TroubleshootingEditor {...props} />

### Layouts or example photos don't appear

<TroubleshootingAssets {...props} />

### Layouts don't fill with photos

<TroubleshootingFill {...props} />

### Export is slow or blocks the editor

<TroubleshootingExport {...props} />

### Watermark appears in production

<TroubleshootingWatermark {...props} />

***

## API Reference

<ApiReference {...props} />

***

## Next Steps

<NextSteps {...props} />



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support