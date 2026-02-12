> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Vanilla JS (Manual)](./get-started/manual-module.md)

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)**
into a Vanilla JS project using a **manual download via CDN** and an **ES
module import**. By the end of this guide, you’ll have a functional CE.SDK
instance running locally, imported as a **JavaScript module**.

## Who is This Guide For?

This guide is for developers who:

- Are using **Vanilla JavaScript** (without frameworks like React, Vue, or Angular).
- Prefer **a manual download** via **IMG.LY’s CDN** instead of using a package manager (npm).
- Want to integrate CE.SDK using an **ES module import** rather than a global variable.

## What You’ll Achieve

- Load CE.SDK via **IMG.LY’s CDN**.
- Import CE.SDK as a **JavaScript module**.
- Create a basic editor using default configurations.

## Prerequisites

Before getting started, ensure you have the following:

- A modern web browser that supports **ES modules** (Chrome, Edge, Firefox, Safari).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Set Up Your Project Structure

Create the following files:

```bash
/my-cesdk-project
  ├── index.html
  └── index.js
```

### index.html

Modify your `index.html` file to load CE.SDK as an **ES module**:

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

    
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

### index.js

Since CE.SDK is loaded via the **CDN**, you must import it explicitly as a module:

```js
import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/index.js';

const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with a valid license key
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
};

// Initialize CE.SDK
CreativeEditorSDK.create('#cesdk_container', config).then(async editor => {
  await editor.addDefaultAssetSources();
  await editor.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true,
  });
  await editor.createDesignScene();

  // Access the engine if needed
  const engine = editor.engine;

  // Dispose of the editor when done
  // editor.dispose();
});
```

## Step 2: Serve the Project Locally

To serve the project, you will need an HTTP server that supports **ES modules**. Run the following command:

```bash
npx serve
```

This will start a local development server available on localhost.

## Step 3: Test the Integration

1. Open `http://localhost:3000/` in your browser.
2. A fully functional CE.SDK editor should load.
3. Open the browser console and verify that the editor is initialized without errors.

## Troubleshooting & Common Errors

**❌ Error: `Cannot use import statement outside a module`**

- Ensure that your **index.js** file is being loaded with `type="module"` in **index.html**.
- Use a local server (`npx serve`) instead of opening the file directly.

**❌ Error: `Invalid license key`**

- Verify that your **license key** is correct and not expired.

**❌ Editor does not load**

- Check your **browser console** for JavaScript errors.
- Ensure that your **internet connection** allows access to `cdn.img.ly`.

***

## Next Steps

Congratulations! You’ve got CE.SDK up and running. Get to know the SDK and dive into the next steps when you’re ready:

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