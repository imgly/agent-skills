> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Electron](./get-started/electron/new-project.md)

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)**
into an **existing Electron project**. It provides optional methods to load
CE.SDK either directly in the main window, or by clicking a button on an
existing page.

## Who Is This Guide For?

This guide is for developers who:

- Already have an **existing Electron desktop app**.
- Want to **embed CE.SDK** into their app, either in the main window or through user interaction.
- Prefer a **minimal and flexible integration** without major project reconfiguration.

## What You’ll Achieve

- Add CE.SDK to an existing Electron project.
- Load CE.SDK either in the main window or via a button click.
- Use ES module syntax for compatibility with modern Electron setups.

## Prerequisites

Ensure you have:

- **Node.js v20+**.
- **npm** or **yarn**.
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Install CE.SDK

Install the CE.SDK package via npm:

<Install />

This installs the CE.SDK as an ES module, which is compatible with most modern Electron projects.

## Step 2: Add CE.SDK to an Existing Page

### Option A: Load CE.SDK Directly in the Main Window

If your app already loads a main `index.html` file, you can directly embed CE.SDK in that file.

Open your `index.html` and add the following script at the bottom of the `<body>`:

```html title="index.html"

<div id="cesdk_container" style="width: 100%; height: 100vh;"></div>

<script type="module">
  import CreativeEditorSDK from '@cesdk/cesdk-js';

  window.addEventListener('DOMContentLoaded', async () => {
    const config = {
      // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
      baseURL:
        'https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/assets',
    };

    // Initialize and mount the editor
    const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true,
    });
    await cesdk.createDesignScene();
  });
</script>
```

### Option B: Load CE.SDK via a Button Click

If you want to load CE.SDK only when a user clicks a button (for example, in an existing UI), you can do so by adding a button and a script that initializes the editor on click.

#### 1. Add a Button to Your HTML

In your existing `index.html` or other HTML file where you want the editor to appear, add a button:

```html title="index.html"
<button id="open-editor">Open Editor</button>
<div
  id="cesdk_container"
  style="width: 100%; height: 100vh; display: none;"
></div>
```

#### 2. Add the CE.SDK Script

Add the following script to your HTML file, either in a `<script type="module">` block or in an external JS file:

```html
<script type="module">
  import CreativeEditorSDK from '@cesdk/cesdk-js';

  document.getElementById('open-editor').addEventListener('click', async () => {
    const container = document.getElementById('cesdk_container');
    container.style.display = 'block';

    const config = {
      // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
      baseURL:
        'https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/assets',
      callbacks: {
        onUpload: 'local',
      },
    };

    // Initialize and mount the editor
    const instance = await CreativeEditorSDK.create('#cesdk_container', config);

    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    await instance.createDesignScene();
  });
</script>
```

> **Warning:** For convenience, CE.SDK serves assets (e.g., images, stickers, fonts) from
> IMG.LY’s CDN by default. In production, you should serve assets from your own
> server.

## Step 3: Start Your Electron App

Run your Electron app to see the CE.SDK in action:

<Run />

If you used **Option A**, the editor will load automatically in the main window. If you used **Option B**, click the **Open Editor** button to launch it.

***

## Troubleshooting & Common Errors

❌ **`CreativeEditorSDK.create is not a function`**

- Ensure you're using `<script type="module">` and not `require()` or `import` in a non-module context.
- Make sure `@cesdk/cesdk-js` is correctly installed.

❌ **Invalid license key**

- Use a valid [trial or production license key](https://img.ly/forms/free-trial).

❌ **Blank screen or editor fails to load**

- Ensure that `index.html` is correctly referenced in your `main.ts` or `main.js` file.
- Make sure that the container element (`#cesdk_container`) exists in the DOM before the script runs.

## Next Steps

Congratulations! You now have a fully working Electron app with CE.SDK integrated using ES module syntax. When you’re ready, take some time to explore CE.SDK further:

- [Configure CE.SDK with your own assets](./serve-assets.md)
- [Customize the UI or localize the editor](./user-interface/localization.md)



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support