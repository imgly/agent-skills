> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Create a new vanilla **Svelte** project using Vite, and integrate
**CreativeEditor SDK** (CE.SDK) with a custom component. Follow this guide to
get a fully functional CE.SDK component running in your Svelte app, ready for
customization.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Have basic experience with Svelte.
- Want to set up a new vanilla Svelte project.
- Want to include a fully featured image and video editor component in their app.

## What You’ll Achieve

- Create a new Svelte project using Vite.
- Install CE.SDK via **npm**.
- Create a Svelte component containing a basic image and video creative editor.
- Render the custom CE.SDK Svelte component in your app.

## Prerequisites

To follow this guide, you need:

- Node.js v20+ and npm 10+ installed locally. [Download the latest LTS version of Node.js and npm](https://nodejs.org/en/download).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

You don’t need Vite installed on your machine; npm already executes the package without needing to install it globally.

## Step 1: Set Up a New Svelte Project

This tutorial uses [Vite](https://vite.dev/) to create a new Svelte project.

Create a new vanilla Svelte project by running this command:

```shell
npm create vite@latest my-svelte-app -- --template svelte
```

This command creates a new Svelte project in `/my-svelte-app` directory. Navigate at the root of the directory by running:

```shell
cd my-svelte-app
```

The Svelte project structure should look like this:

```
my-svelte-app/
├── .vscode               # VS Code settings for your project
│   └── extensions.json   # Recommended extensions
│
├── public                # Static assets folder
│   └── vite.svg          # Default Vite logo
│
└── src                   # Source code of the app
│   ├── assets            # Static assets used by the app
│   │   └── svelte.svg    # Svelte logo
│   │
│   ├── lib               # Reusable components or libraries
│   │   └── Counter.svelte # A sample component
│   │
│   ├── app.css           # Global styles
│   ├── App.svelte        # Main Svelte component
│   ├── main.js           # JavaScript entry point
│   └── vite-env.d.ts     # Type definitions for Vite
│
├── .gitignore            # Files to ignore in Git
├── index.html            # Main HTML file
├── jsconfig.json         # JS config (helps with IntelliSense)
├── package.json          # Project metadata, dependencies, scripts
├── README.md             # Project documentation
├── svelte.config.js      # Svelte project config
└── vite.config.js        # Vite build tool config
```

To install the project dependencies, execute:

```shell
npm install
```

Run the development server with:

```shell
npm run dev
```

Navigate to `http://localhost:5173/` in your browser to see the default Svelte app running.

## Step 2: Install CE.SDK

Add CreativeEditor SDK to your project’s dependencies by installing the [`@cesdk/cesdk-js`](https://www.npmjs.com/package/@cesdk/cesdk-js) npm package:

```shell
npm install @cesdk/cesdk-js
```

## Step 3: Create Your Creative Editor Svelte Component

In the `src/lib/` folder of your new Svelte project, create a new file named `CreativeEditorSDK.svelte`. Add the following code to create the component.

> **Note:** Replace `<YOUR_LICENSE_KEY>` with your valid CE.SDK license key.

```svelte title="CreativeEditorSDK.svelte"
<script>
  import CreativeEditorSDK from "@cesdk/cesdk-js";
  import { onDestroy, onMount } from "svelte";

  // Reference to the container HTML element where CE.SDK will be initialized
  let container;
  // Where to keep track of the CE.SDK instance
  let cesdk = null;

  // Default CreativeEditor SDK configuration
  const defaultConfig = {
    license: "<YOUR_LICENSE_KEY>", // Replace it with a valid CE.SDK license key
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
    }

    try {
      // Initialize the CreativeEditorSDK instance in the container element
      // Using the given config
      CreativeEditorSDK.create(container, ceSDKConfig).then(async (instance) => {
        cesdk = instance;

        // Do something with the instance of CreativeEditor SDK (e.g., populate
        // The asset library with default / demo asset sources)
        await Promise.all([
          cesdk.addDefaultAssetSources(),
          cesdk.addDemoAssetSources({ sceneMode: "Design", withUploadAssetSources: true }),
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

<div id="cesdk_container" bind:this={container}></div>

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
- Sets basic configuration for the component inside a `<div>` container element.
- Disposes the CE.SDK instance to free up resources when the component unmounts.

## Step 4: Use the Creative Editor Component

Import the `CreativeEditorSDK` component in your `App.svelte` file by adding the following line in the `<script>` section:

```svelte title="App.svelte"
import CreativeEditorSDK from './lib/CreativeEditorSDK.svelte'
```

To display the component on your homepage, add it like this to `App.svelte`:

<Tabs>
  <TabItem label="Default Configuration">
    ```svelte title="App.svelte"
    <CreativeEditorSDK />
    ```
  </TabItem>

  <TabItem label="Custom Configuration">
    To [customize the Creative Editor](./user-interface/overview.md), pass the `config` prop to the `CreativeEditorSDK` component:

    ```svelte title="App.svelte"

    <script>
    // Other imports... import CreativeEditorSDK from
    "./lib/CreativeEditorSDK.svelte"
    </script>

    <main>
    
    <CreativeEditorSDK
      config={{
        // Custom configs ...
      }}
    />
    
    </main>

    <style>/* Custom styling... */</style>

    ```
  </TabItem>
</Tabs>

The `App.svelte` file should contain something like:

```svelte title="App.svelte"
<script>
// Other imports...
import CreativeEditorSDK from "./lib/CreativeEditorSDK.svelte";
</script>

<main>

<CreativeEditorSDK
  config={{
    // custom configs ...
  }}
/>

</main>

<style>
/* Custom styling... */
</style>
```

## Step 5: Test the Integration

1. Open `http://localhost:5173/` in your browser.
2. A fully functional CE.SDK editor should load.

## Troubleshooting & Common Errors

**❌ Error**: `The $props rune is only available inside .svelte and .svelte.js/ts files`

- Make sure to load the `CreativeEditorSDK.svelte` component’s props using `$props()` in the top-level `<script>` section, not inside `onMount()` or other lifecycle functions.

**❌ Error**: The following dependencies are imported but could not be resolved: `@cesdk/cesdk-js`

- Verify that you’ve correctly installed CE.SDK via `npm install @cesdk/cesdk-js`.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Double-check that your license key is valid and hasn’t expired.

**❌ Editor does not load**

- Check the browser console for any errors.
- Verify that your component paths and imports are correct.

## Next Steps

Congratulations! You’ve successfully integrated CE.SDK into your new Svelte project. Now, take some time to explore the SDK and move on to the next steps:

- [Configure the Creative Editor](./user-interface/overview.md)
- [Configure the Callbacks](./actions.md)
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