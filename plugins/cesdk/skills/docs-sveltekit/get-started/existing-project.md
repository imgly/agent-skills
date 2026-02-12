> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart SvelteKit](./get-started/new-project.md)

---

This guide shows you how to integrate CreativeEditor SDK (CE.SDK) in an
existing **SvelteKit** app. You can follow these steps to get a **SvelteKit
app** with a fully functional CE.SDK custom component, ready for editing,
templating, or further customization.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Are familiar with SvelteKit.
- Already have a SvelteKit project set up.
- Want to integrate a powerful image and video editing component into their SvelteKit app.

## What You’ll Achieve

- Install CE.SDK.
- Set up CE.SDK within your SvelteKit project.
- Create a creative editor component using CE.SDK.
- Render the custom CE.SDK component.

## Prerequisites

Before you begin, make sure you have:

- Node.js **v20+**. [Download the latest LTS version of Node.js](https://nodejs.org/en/download).
- A package manager (npm, yarn, pnpm)
- A **SvelteKit v2** project created using the Svelte CLI.
- A valid **CE.SDK license key**.

## Step 1: Install CE.SDK

Add CreativeEditor SDK to your project’s dependencies by installing the [@cesdk/cesdk-js](https://www.npmjs.com/package/@cesdk/cesdk-js) package:

<Install />

## Step 2: Define the Creative Editor Svelte Component

If you used the Svelte CLI to create your SvelteKit project, it should have the following structure:

```
your-sveltekit-app/
│
├── src
│   ├── app.html
│   ├── lib
│   │   └── ...
│   └── routes
│       └── ...
│
├── static
│   └── ...
│
├── .gitignore
├── .npmrc
├── jsconfig.json
├── package-lock.json
├── package.json
├── README.md
├── svelte.config.js
└── vite.config.js
```

To start creating your custom CE.SDK component, follow these steps:

1. Navigate to `src/lib/` folder of your project.
2. Create a new file named `CreativeEditorSDK.svelte`.
3. Paste the following code into `CreativeEditorSDK.svelte`:

<Tabs>
  <TabItem label="JavaScript">
    > **Note:** Replace `<YOUR_LICENSE_KEY>` with your valid CE.SDK **license key**.

    ```svelte title="CreativeEditorSDK.svelte"
    <script>
      import CreativeEditorSDK from '@cesdk/cesdk-js';
      import { onDestroy, onMount } from 'svelte';

      // Reference to the container HTML element where CE.SDK will be initialized
      let container;
      // Where to keep track of the CE.SDK instance
      let cesdk = null;

      // Default CreativeEditor SDK configuration
      const defaultConfig = {
        // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with a valid CE.SDK license key
        // Other default configs...
      };

      // Accessing the component's props
      const { el, children, class: _, config, ...props } = $props();

      // Hook to initialize the CreativeEditorSDK component
      onMount(() => {
        // Integrate the configs read from props with the default ones
        const ceSDKConfig = {
          ...defaultConfig,
          ...config,
        };

        try {
          // Initialize the CreativeEditorSDK instance in the container element
          // using the given config
          CreativeEditorSDK.create(container, ceSDKConfig).then(async instance => {
            cesdk = instance;

            // Do something with the instance of CreativeEditor SDK (e.g., populate
            // the asset library with default / demo asset sources)
            await Promise.all([
              cesdk.addDefaultAssetSources(),
              cesdk.addDemoAssetSources({ sceneMode: 'Design' }),
            ]);

            // Create a new design scene in the editor
            await cesdk.createDesignScene();
          });
        } catch (err) {
          console.warn(`CreativeEditor SDK failed to mount.`, { err });
        }
      });

      // Hook to clean up when the component unmounts
      onDestroy(() => {
        try {
          // Dispose of the CE.SDK instance if it exists
          if (cesdk) {
            cesdk.dispose();
            cesdk = null;
          }
        } catch (err) {
          // Log error if CreativeEditor SDK fails to unmount
          console.warn(`CreativeEditor SDK failed to unmount.`, { err });
        }
      });
    </script>

    
    <div id="cesdk_container" bind:this="{container}"></div>

    <style>
      /* Styling for the CE.SDK container element to take full viewport size */
      #cesdk_container {
        height: 100vh;
        width: 100vw;
      }
    </style>
    ```
  </TabItem>

  <TabItem label="TypeScript">
    > **Note:** Replace `<YOUR_LICENSE_KEY>` with your valid CE.SDK **license key**.

    ```svelte title="CreativeEditorSDK.svelte"
    <script>
      import CreativeEditorSDK from '@cesdk/cesdk-js';
      import { onDestroy, onMount } from 'svelte';

      // Reference to the container HTML element where CE.SDK will be initialized
      /** @type {HTMLDivElement | null} */
      let container = null;
      // Where to keep track of the CE.SDK instance
      /** @type {any}*/
      let cesdk = null;

      // Default CreativeEditor SDK configuration
      /** @type {Record<string, any>}*/
      export let config = {};

      /** @type {'local'}*/
      const ON_UPLOAD = 'local';
      const defaultConfig = {
        // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with a valid CE.SDK license key
        callbacks: { onUpload: ON_UPLOAD }, // Enable local file uploads in the Asset Library
        // Other default configs...
      };

      // Hook to initialize the CreativeEditorSDK component
      onMount(() => {
        // Integrate the configs read from props with the default ones
        const ceSDKConfig = {
          ...defaultConfig,
          ...config,
        };

        if (!container) return;

        try {
          // Initialize the CreativeEditorSDK instance in the container element
          // using the given config
          CreativeEditorSDK.create(container, ceSDKConfig).then(async instance => {
            cesdk = instance;

            // Do something with the instance of CreativeEditor SDK (e.g., populate
            // the asset library with default / demo asset sources)
            await Promise.all([
              cesdk.addDefaultAssetSources(),
              cesdk.addDemoAssetSources({ sceneMode: 'Design' }),
            ]);

            // Create a new design scene in the editor
            await cesdk.createDesignScene();
          });
        } catch (err) {
          console.warn(`CreativeEditor SDK failed to mount.`, { err });
        }
      });

      // Hook to clean up when the component unmounts
      onDestroy(() => {
        try {
          // Dispose of the CE.SDK instance if it exists
          if (cesdk) {
            cesdk.dispose();
            cesdk = null;
          }
        } catch (err) {
          // Log error if CreativeEditor SDK fails to unmount
          console.warn(`CreativeEditor SDK failed to unmount.`, { err });
        }
      });
    </script>

    
    <div id="cesdk_container" bind:this="{container}"></div>

    <style>
      /* Styling for the CE.SDK container element to take full viewport size */
      #cesdk_container {
        height: 100vh;
        width: 100vw;
      }
    </style>
    ```
  </TabItem>
</Tabs>

This Svelte component:

- Initializes the CreativeEditor SDK inside the component’s `<div>` container.
- Disposes of the SDK instance on unmount to free resources.

### Optional: Export Component Using the Module System

If you organize your SvelteKit project’s components in a single `src/lib/index.js` file, add the following line to `index.js`:

```js title="index.js"
export { default as CreativeEditorSDK } from './CreativeEditorSDK.svelte';
```

## Step 3: Use the Creative Editor Component

CreativeEditor SDK only runs on the client. To handle client-side rendering, you have to:

1. Import the component in a route file.
2. Render the component on a page withing your project.

### Import the CreativeEditorSDK Component

Dynamically import `CreativeEditorSDK` component as follows:

1. Open the relevant **SSR route file**, where you want to embed the component (for example, `src/routes/+page.svelte`).
2. Navigate to the `<script>` section.
3. Paste this code to **dynamically import** the `CreativeEditorSDK` component:

<Tabs>
  <TabItem label="JavaScript">
    ```svelte title="+page.svelte"
    import { browser } from '$app/environment'; // True only if the app is running in the browser
    // Use the browser flag to conditionally render client-side components
    let isClient = browser;

    let CreativeEditorSDK;
    if (isClient) {
      // Dynamically import the CreativeEditorSDK component only in the browser
      import('$lib/CreativeEditorSDK.svelte').then(module => {
        CreativeEditorSDK = module.default;
      });
    }
    ```
  </TabItem>

  <TabItem label="TypeScript">
    ```svelte title="+page.svelte"
    <script lang="ts">
    import type { ComponentType } from 'svelte';
    import { browser } from '$app/environment'; // True only if the app is running in the browser
    // Use the browser flag to conditionally render client-side components
    let isClient = browser;

    let CreativeEditorSDK: ComponentType | null = null;
    if (isClient) {
      // Dynamically import the CreativeEditorSDK component only in the browser
      import('$lib/CreativeEditorSDK.svelte').then(module => {
        CreativeEditorSDK = module.default;
      });
    }
    </script>

    {#if isClient && CreativeEditorSDK}
      <CreativeEditorSDK
        config={{
          // Your custom configs here
        }}
      />
    {/if}
    ```
  </TabItem>
</Tabs>

<br />

> **Note:** The ’browser’ flag in `$app/environment` identifies code that runs in the
> browser. For more information, visit[SvelteKit docs](https://svelte.dev/docs/kit/$app-environment#browser).

### Optional: Import Components Using the Module System

If you [exported  in](./get-started/existing-project-x7678d/#using-the-module-system-for-exports.md), you can simplify the dynamic import:

```svelte title="+page.svelte"
import('$lib').then(module => {
  CreativeEditorSDK = module.CreativeEditorSDK;
});
```

### Render the CreativeEditorSDK Component

Now, make sure that your app renders the video editor component only on the client side. Add this to the template section of your SvelteKit route:

<Tabs>
  <TabItem label="Default Configs">
    ```svelte title="+page.svelte"
    {#if isClient && CreativeEditorSDK}
    <CreativeEditorSDK />
    {/if}

    ```
  </TabItem>

  <TabItem label="Custom Configs">
    ```svelte title="+page.svelte"
    {#if isClient && CreativeEditorSDK}
      <CreativeEditorSDK
        config={{
          // Your custom configs here
        }}
      />
    {/if}
    ```
  </TabItem>
</Tabs>

Your **final `src/routes/+page.svelte` file** should look like this:

<Tabs>
  <TabItem label="Default Configs">
    ```svelte title="+page.svelte"
    <script>
      // Other imports...

      import { browser } from "$app/environment"; // True only if the app is running in the browser
      // Use the browser flag to conditionally render client-side components
      let isClient = browser;

      let CreativeEditorSDK;
      if (isClient) {
        // Dynamically import the CreativeEditorSDK component only in the browser
        import("$lib/CreativeEditorSDK.svelte").then(module => {
          CreativeEditorSDK = module.default;
        });
      }
    </script>

    <main>
      
      {#if isClient && CreativeEditorSDK}
        <CreativeEditorSDK />
      {/if}
      
    </main>

    <style>
      /* Custom styling... */
    </style>
    ```
  </TabItem>

  <TabItem label="Custom Configs">
    ```svelte title="+page.svelte"
    <script>
      // Other imports...

      import { browser } from "$app/environment"; // True only if the app is running in the browser
      // Use the browser flag to conditionally render client-side components
      let isClient = browser;

      let CreativeEditorSDK;
      if (isClient) {
        // Dynamically import the CreativeEditorSDK component only in the browser
        import("$lib/CreativeEditorSDK.svelte").then(module => {
          CreativeEditorSDK = module.default;
        });
      }
    </script>

    <main>
      
      {#if isClient && CreativeEditorSDK}
        <CreativeEditorSDK
          config={{
            // Custom configs...
          }}
        />
      {/if}
      
    </main>

    <style>
      /* Custom styling... */
    </style>
    ```
  </TabItem>
</Tabs>

## Step 4: Serve the SvelteKit Project Locally

Start your SvelteKit project locally with the run command. Basic ones are:

<Run />

## Step 5: Test the Integration

By default, Vite serves your app on your localhost. To test the integration:

1. Open `http://localhost:5173/` in your browser.
2. A fully functional CE.SDK editor should load.

## Troubleshooting & Common Errors

**❌ Error**: `Cannot find module '@cesdk/cesdk-js'`

- Check that you’ve installed CE.SDK with `npm install @cesdk/cesdk-js`.

**❌ Error**: `The $props rune is only available inside .svelte and .svelte.js/ts files`

1. Open `CreativeEditorSDK.svelte`.
2. Check the **top level** of the `<script>` section.
3. Make sure you’re using `$props()` at this level, rather than inside `onMount()` or other lifecycle methods.

**❌ Error**: `Error when evaluating SSR module /src/routes/+page.svelte: document is not defined`

- In `/src/routes/+page.svelte`, make sure `CreativeEditorSDK` is:

  - Dynamically imported.
  - Only rendered on the client side.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Verify that your CE.SDK license key is correct and hasn’t expired.

**❌ Editor doesn’t load**

- Check the browser console for any errors.
- Ensure that component and library imports are correct.

## Next Steps

Congratulations! You’ve successfully integrated CE.SDK into an existing SvelteKit project. Now, feel free to explore the SDK and proceed to the next steps whenever you’re ready:

- [Configure the Creative Editor](./user-interface/overview.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Create and use a license key](./licensing.md)
- [Configure callbacks](./actions.md)
- [Customize interface labels and translations](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support