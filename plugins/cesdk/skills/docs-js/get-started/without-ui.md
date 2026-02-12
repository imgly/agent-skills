> This is one page of the CE.SDK Vanilla JS documentation. For a complete overview, see the [Vanilla JS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Vanilla JS (Manual)](./get-started/manual-module.md)

---

This guide walks you through integrating CE.SDK’s **headless engine** into a
JavaScript project for **programmatic image and video editing**. By the end of
this guide, you’ll have a functional CE.SDK instance running locally, allowing
you to manipulate design elements **without a UI**.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Need to **perform image and video editing operations** programmatically without a UI.
- Want to use **CE.SDK’s headless engine** for batch processing or creative automation.
- Require **a script-based approach** for design generation.

## What You’ll Achieve

- Install and configure **CE.SDK Engine**.
- Use **the headless API** to manipulate design elements.
- Generate graphics or videos without rendering a UI.

## Prerequisites

Before getting started, ensure you have:

- Completed a previous **CE.SDK Vanilla JS integration guide** (for example, [Integrate CE.SDK as module](./get-started/manual-module.md)).
- **Node.js installed**, including **npm** (or **npx**) to run command-line tools.
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Set Up Your Project Structure

Create the following folder and files:

```
/my-cesdk-project
  ├── index.html
  └── index.js
```

### index.html

Create a basic HTML file that loads your JavaScript module:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CE.SDK Headless</title>
    <style>
      body {
        margin: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

### index.js

This is where you’ll place your CE.SDK headless logic (no UI rendering) in the steps below.

## Step 2: Integrate Into Your Application

In your `index.js`, you first need to import the `CreativeEngine` module and initialize it with the appropriate configuration.

### Import and Configure

Use the following code to import the CE.SDK CreativeEngine from the IMG.LY CDN and configure it with your license key and asset base URL:

```js
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/index.js';

const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
  baseURL:
    'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/assets',
};
```

### Initialize the Engine

Call the `init()` method on `CreativeEngine` to initialize the SDK:

```js
CreativeEngine.init(config).then(async engine => {
  console.log('CE.SDK Engine initialized');

  // You can now use the engine to perform creative operations...
});
```

## Step 3: Perform a Basic Operation

Once initialized, you can use the engine’s API to create and manipulate scenes. Below is a breakdown of a basic example that demonstrates core operations.

### 1. Create a Scene

Scenes are the root containers for all creative content. In headless mode, no visual editor is shown—everything is controlled programmatically:

```js
const scene = engine.scene.create();
```

### 2. Add a Page

Pages represent visual containers (like canvases) within the scene. You must add at least one to define a workspace:

```js
const page = engine.block.create('page');
engine.block.appendChild(scene, page);
```

### 3. Add a Rectangle Shape

You can create graphic blocks and assign shapes to them. In this case, a rectangle:

```js
const rect = engine.block.create('graphic');
engine.block.setShape(rect, engine.block.createShape('rect'));
engine.block.appendChild(page, rect);
```

### 4. Export the Scene

To generate an image output, export the scene as a PNG:

```js
const blob = await engine.block.export(scene, { mimeType: 'image/png' });
console.log('Export complete', blob);
```

### 5. Clean Up

Always dispose of the engine once you’re finished to release resources:

```js
engine.dispose();
```

## Step 4: Run the Project Locally

Since you are using **ES modules**, you need an HTTP server that supports them. Run the following command:

```bash
npx serve
```

This will start a local development server available on localhost.

## Step 5: Test the Integration

1. Open `http://localhost:3000/` in your browser.
2. The script will initialize the CE.SDK Engine and **programmatically generate and export a scene** without UI interaction.
3. Check the console for messages indicating a **successful scene export**.

## Using the Headless API for Advanced Editing

### 1. Adding an Image Block

```js
const imageBlock = engine.block.create('graphic');
const imageFill = engine.block.createFill('image');
engine.block.setFill(imageBlock, imageFill);
engine.block.setString(
  imageFill,
  'fill/image/imageFileURI',
  'https://img.ly/static/ubq_samples/imgly_logo.jpg',
);
engine.block.appendChild(page, imageBlock);
```

### 2. Adding Text to the Scene

```js
const textBlock = engine.block.create('text');
engine.block.setString(textBlock, 'text/content', 'Hello, CE.SDK!');
engine.block.appendChild(page, textBlock);
```

### 3. Exporting the Scene as an Image

```js
const exportedImage = await engine.block.export(scene, {
  mimeType: 'image/png',
});
console.log('Image Exported:', exportedImage);
```

### 4. Editing Videos in Headless Mode

```js
const videoBlock = engine.block.create('graphic');
const videoFill = engine.block.createFill('video');
engine.block.setFill(videoBlock, videoFill);
engine.block.setString(
  videoFill,
  'fill/video/fileURI',
  'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-kampus-production-8154913.mp4',
);
engine.block.appendChild(page, videoBlock);
```

## Troubleshooting & Common Errors

**❌ Error: `Module not found`**

- Ensure you're using `type="module"` in **index.html**.

**❌ Error: `Invalid license key`**

- Verify that your **license key** is correct and not expired.

**❌ Error: `CE.SDK Engine is not defined`**

- Ensure the **CDN script** is loaded before calling `CreativeEngine.init()`.

## Next Steps

Congratulations! You’ve successfully integrated **CE.SDK Engine in headless mode**. Next, explore advanced features:

- [Automate Workflows - Design Generation](./prebuilt-solutions/design-generation.md):
  See an example of an end-to-end creative automation workflow.
- [Insert Media into Scenes](./import-media.md): Get an overview
  of different media types and how to programmatically insert them into scenes.



---

## More Resources

- **[Vanilla JS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support