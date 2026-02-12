> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Vanilla JS (Manual)](./get-started/manual-module.md)

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)**
into a Vanilla JS project using a **manual download via CDN**. By the end of
this guide, you’ll have a functional CE.SDK instance running locally and
accessible as a **global variable**.

## Who is This Guide For?

This guide is for developers who:

- Are using **Vanilla JavaScript** (without frameworks like React, Vue, or Angular).
- Prefer **a manual download** via **IMG.LY’s CDN** instead of using a package manager (npm).
- Want to integrate CE.SDK as a **global variable** for easy access.

## What You’ll Achieve

- Load CE.SDK via **IMG.LY’s CDN**.
- Use CE.SDK as a **global variable** in your project.
- Create a basic editor using default configurations.

## Prerequisites

Before getting started, ensure you have the following:

- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Set Up Your Project Structure

Create the following files:

```
/my-cesdk-project
  ├── index.html
  └── index.js
```

### index.html

Modify your `index.html` file to load CE.SDK directly from IMG.LY’s CDN:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CE.SDK Integration</title>
    <style>
      body {
        margin: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="cesdk_container" style="width: 100%; height: 100vh;"></div>

    
    <script src="https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/index.js"></script>
    <script src="./index.js"></script>
  </body>
</html>
```

### index.js

Since CE.SDK is loaded via the **CDN**, it is automatically available as a **global variable** (`window.CreativeEditorSDK`).

```js
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with a valid license key
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${window.CreativeEditorSDK.version}/assets`,
};

// Initialize CE.SDK
window.CreativeEditorSDK.create('#cesdk_container', config).then(
  async editor => {
    await editor.addDefaultAssetSources();
    await editor.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true,
    });
    await editor.createDesignScene();

    // Access the engine globally if needed
    window.editorEngine = editor.engine;

    // Dispose of the editor when done
    // editor.dispose();
  },
);
```

## Step 2: Serve the Project Locally

To serve the **static HTML file**, you can use a simple HTTP server:

```bash
npx serve
```

This will start a local development server available on localhost.

## Step 3: Test the Integration

1. Open `http://localhost:3000/` in your browser.
2. A fully functional CE.SDK editor should load.
3. Use the browser console to test the global variable:

   ```
   window.CreativeEditorSDK
   ```

## Troubleshooting & Common Errors

**❌ Error: `CE.SDK is not defined`**

- Ensure that the **CDN script is fully loaded** before running `index.js`.
- Move `<script src="./index.js"></script>` **below** the CDN script in `index.html`.

**❌ Error: `Invalid license key`**

- Verify that your **license key** is correct and not expired.

**❌ Editor does not load**

- Check your **browser console** for JavaScript errors.
- Ensure that your **internet connection** allows access to `cdn.img.ly`.

## Next Steps

Congratulations you’ve got CE.SDK up and running. Get to know the SDK and dive into the next steps, when you’re ready:

- [Perform Basic Configuration](./user-interface/overview.md)
- [Configure the Callbacks](./actions.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Add Localization](./user-interface/localization.md)
- [Adapt the User Interface](./user-interface/appearance/theming.md)



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support