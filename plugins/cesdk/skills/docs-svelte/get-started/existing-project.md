> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Integrate CreativeEditor SDK (CE.SDK) into your Svelte project with a custom
component. This guide shows you how to embed a working CE.SDK component in
your app, and prepare it for customization.

<CesdkOverview />

## Who Is This Guide For?

This tutorial is for developers who:

- Work with Svelte.
- Maintain a vanilla Svelte project (not SvelteKit).
- Want to integrate a full-featured image and video editor into their app.

## What You’ll Achieve

- Install CE.SDK in your project.
- Set up CE.SDK within your Svelte project.
- Render the custom CE.SDK Svelte component in your app.

## Prerequisites

Make sure your system has the following before you start:

- Node.js v20+ installed locally [Download the latest LTS version of Node.js](https://nodejs.org/en/download).
- A Svelte 5+ project, managed with a [build tool like Vite, Parcel, or RSBuild](https://react.dev/blog/2025/02/14/sunsetting-create-react-app#how-to-migrate-to-a-build-tool).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Install CE.SDK

First, add CreativeEditor SDK to your project’s dependencies using your project’s package manager. Run the following command in your project’s repository to install it:

<Install />

## Step 2: Create Your Creative Editor Svelte Component

The examples assume a vanilla Svelte project with the default [Vite](https://vite.dev/guide/) file structure, adapt as needed for other layouts. A typical Svelte project structure looks like this:

```
your-svelte-app/
│
├── public
│   └── ...
│
└── src
│   ├── assets
│   │   └── ...
│   │
│   ├── lib
│   │   └── ...
│   │
│   ├── app.css
│   ├── App.svelte
│   ├── main.js
│   └── vite-env.d.ts
│
├── .gitignore
├── index.html
├── jsconfig.json
├── package.json
├── README.md
├── svelte.config.js
└── vite.config.js
```

You create a new component by adding a file in your project’s components folder. In a typical Vite setup, this folder is `src/lib/`. Adjust the location if your project uses a different structure, then:

1. Create a file named `CreativeEditorSDK.svelte`.
2. Paste the following code into `CreativeEditorSDK.svelte` to define a custom image and video component.
3. Replace `<YOUR_LICENSE_KEY>` with **your CE.SDK license key**.

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
    // license: 'YOUR_CESDK_LICENSE_KEY', // Replace it with a valid CE.SDK license key
    callbacks: { onUpload: 'local' }, // Enable local file uploads in the Asset Library
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
        await cesdk.actions.run('scene.create');
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

This Svelte component:

- Initializes a CreativeEditor SDK instance.
- Applies a basic configuration and attaches it to a `<div>` container in the HTML section.
- Disposes of the CE.SDK instance on unmount to free resources.

## Step 3: Render the Creative Editor Component

Import the `CreativeEditorSDK` component into a Svelte file where you want to use it. For example, add the following line in the `<script>` section of `App.svelte`:

```svelte
import CreativeEditorSDK from './lib/CreativeEditorSDK.svelte';
```

You can now render the CreativeEditorSDK component in the template section of `App.svelte` as follows:

<Tabs>
  <TabItem value="with-custom-props" label="With Custom Properties">
    ```svelte
    <CreativeEditorSDK
      config={
        {
          // custom configs ...
        }
      }
    />

    ```
  </TabItem>

  <TabItem value="without-custom-props" label="Without Custom Properties">
    Or, without custom properties:

    ```svelte
    <CreativeEditorSDK />
    ```
  </TabItem>
</Tabs>

Your `App.svelte` should now look like this:

```svelte title="App.svelte"
<script>
  // Other imports...
  import CreativeEditorSDK from "./lib/CreativeEditorSDK.svelte";
</script>

<main>
  
  <CreativeEditorSDK
    config={{
      // Custom configs ...
    }}
  />
  
</main>

<style>
  /* Custom stylying... */
</style>
```

## Step 4: Serve the Project

Run the project locally using the bundler configured in your project. This example uses Vite with the following command:

<Tabs>
  <TabItem label="npm">
    ```shell
    npm run dev
    ```
  </TabItem>

  <TabItem label="yarn">
    ```shell
    yarn dev
    ```
  </TabItem>

  <TabItem label="pnpm">
    ```shell
    pnpm run dev
    ```
  </TabItem>
</Tabs>

By default, the Svelte local app is available on your localhost at `http://localhost:5173/`.

## Step 5: Test the Integration

1. Open `http://localhost:5173/` in your browser.
2. A fully functional CE.SDK editor should load on the page where you integrated it.

## Troubleshooting & Common Errors

**❌ Error**: `The following dependencies are imported but could not be resolved: @cesdk/cesdk-js`

- Verify that you’ve correctly [installed CE.SDK](./get-started/existing-project-u4345a/#step-1-install-cesdk.md).

**❌ Error**: `The $props rune is only available inside .svelte and .svelte.js/ts files`

- Calling `$props()` in the wrong place causes this error. To fix it:

  1. Use `$props()` only in the top-level `<script>` section of your Svelte component.
  2. Don’t call it inside `onMount()` or any other lifecycle function.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Double-check that your license key is valid and hasn’t expired.

**❌ Editor doesn’t load**

- Check the browser console for any errors.
- Verify that your component paths and imports are correct.

## Next Steps

Congratulations! You’ve successfully integrated CE.SDK into your existing Svelte project. Now, take some time to explore the SDK and move on to the next steps whenever you’re ready:

- [Configure the Creative Editor](./user-interface/overview.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Create and use a license key](./licensing.md)
- [Configure callbacks](./actions.md)
- [Customize interface labels and translations](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support