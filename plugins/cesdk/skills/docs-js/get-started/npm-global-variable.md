> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)**
into a Vanilla JS project using NPM and a global variable setup. By the end of
this guide, you’ll have a functional CE.SDK instance running locally and ready
for customization.

## Who is This Guide For?

This guide is for developers who:

- Are using **Vanilla JavaScript** (without frameworks like React, Vue or Angular).
- Prefer **global variable** integration instead of module-based imports.
- Want a quick, no-fuss setup using **NPM**.

## What You'll Achieve

- Install and configure CE.SDK via NPM.
- Set up CE.SDK as a **global variable** for easy access.
- Create a basic editor using default configurations.
- Serve and test your project locally using **Vite**.

## Prerequisites

Before getting started, ensure you have the following:

- **Node.js** (v20 or higher) and **NPM** installed. [Download Node.js](https://nodejs.org/).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Install CE.SDK

First, create a new project folder (e.g. "my-cesdk-project"):

```bash
mkdir my-cesdk-project
```

Navigate into it:

```bash
cd my-cesdk-project
```

Initialize the project with a default `package.json` file:

```bash
npm init -y
```

Install the SDK via NPM:

```bash
npm install @cesdk/cesdk-js
```

## Step 2: Set Up Your Project Structure

Create your `index.html` and `index.js` files:

```bash
/my-cesdk-project
  ├── index.html
  ├── index.js
  ├── package.json
```

### index.html

Reference `index.js` inside `index.html` as a module:

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

Import CE.SDK, attach it to the global scope and initialize it:

```javascript
import CreativeEditorSDK from '@cesdk/cesdk-js';

// Expose CE.SDK globally
window.CreativeEditorSDK = CreativeEditorSDK;

const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with a valid license key
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/assets',
};

// Initialize CE.SDK
window.CreativeEditorSDK.create('#cesdk_container', config).then(
  async editor => {
    await editor.addDefaultAssetSources();
    await editor.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true,
    });
    await editor.actions.run('scene.create');

    // Access the engine via global variable
    window.editorEngine = editor.engine;

    // Dispose of the editor when done
    // editor.dispose();
  },
);
```

## Step 3: Serve the Project Locally

Now you can serve and build your project locally using your preferred bundler such as Webpack, Rollup, Parcel or Vite. In this example we’ll use [Vite](https://vite.dev/).

### Serve with Vite

Install Vite as a development dependency:

```bash
npm install -D vite
```

Add the following to your `package.json`:

```bash
"scripts": {
    "dev": "vite"
  }
```

Now start the Vite server with:

```bash
npm run dev
```

By default, the app will be available on localhost.

## Step 4: Test the Integration

1. Open `http://localhost:5173/` in your browser.
2. A fully functional CE.SDK editor should load.
3. Use the browser console to test the global variable:

```javascript
window.CreativeEditorSDK;
```

![CE.SDK Vanilla JS Test Integration](https://img.ly/docs/cesdk/vanilla-js-test-integration-1.55.1.png)

## Troubleshooting & Common Errors

**❌ Error: `Module not found`**

- Ensure you’ve installed CE.SDK correctly via `npm install @cesdk/cesdk-js`.

**❌ Error: `Invalid license key`**

- Verify that your license key is valid and not expired.

**❌ Editor does not load**

- Check the browser console for errors.
- Confirm that your script paths are correct.

## Next Steps

Congratulations you’ve got CE.SDK up and running. Get to know the SDK and dive into the next steps, when you’re ready:

- [Perform Basic Configuration](./user-interface/overview.md)
- [Configure the Callbacks](./actions.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Add Localization](./user-interface/localization.md)
- [Adapt the User Interface](./user-interface/appearance/theming.md)



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support