> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Headless Mode](./concepts/headless-mode/browser.md)

---

CreativeEditor SDK (CE.SDK) **Headless Mode** allows your web app to control the Engine API without loading the built-in user interface.

Instead of starting the full editor with panels and toolbars, your browser code talks directly to the Engine. That keeps the experience within your own design system—ideal for automation running on the client.

## Common Use Cases

- **Automating workflows:** Merge data into templates or generate variations with no user input.
- **Automated exports:** Render custom images or videos in the browser and hand them off to storage or your backend.
- **Custom interfaces:** Embed the Engine beneath your own UI components.
- **Background actions:** Run batch jobs or event-driven edits without overlaying the default UI.

### When to Use Headless Mode

<HeadlessScenario />

## How Headless Mode Works

The standard editor wires UI events (button clicks, drag interactions) to the Engine under the hood. In headless mode, you call the same Engine APIs yourself.

### Features Available in Headless Mode

In headless mode, you keep access to the CE.SDK features while staying entirely within your app’s DOM lifecycle, such as:

- Scene management
- Asset manipulation
- Rendering and export
- Templates and dynamic content

### Requirements to Run the CreativeEngine in the Client

CE.SDK’s Engine needs a **WebGL-capable environment**. When you ship a headless build in the browser:

- Point the `baseURL` in your config at a publicly reachable asset directory (CDN or self-hosted) so the browser can load fonts and other Engine files—even when you install the npm package.
- Only start the Engine **after the DOM is available** (for example, inside `useEffect`, `mounted`, or `DOMContentLoaded`).
- **Dispose** of the Engine during tear down with `engine.dispose()` to release WebGL resources.
- Ensure iframes or workers that boot the Engine expose `document` and a WebGL context.

## Set Up Headless Mode in a Web App

1. Install the Engine package:

   ```bash
   npm install @cesdk/engine
   ```

````

2. Configure your license and asset location. The global CDN works for prototypes; production apps commonly self-host the asset bundle for faster loads.

   ```ts
   const config = {
     license: '<YOUR_LICENSE_KEY>',
     baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/assets'
   };
   
````

3. Start the Engine from client-side code and reuse the instance across interactions.

> **Tip:** The CreativeEngine doesn’t attach a canvas automatically. If you want a live preview, append `engine.element` onto your own layout.

## Quick Start: Initialize the Engine Headlessly

When you import `@cesdk/engine`, you get the same runtime that powers the full editor. Using the CreativeEngine instead of the CreativeEditor allows you to expose the Engine interface while skipping all UI bootstrapping that comes with the editor.

```js
import CreativeEngine from '@cesdk/engine';

const config = {
  license: '<YOUR_LICENSE_KEY>',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/assets'
};

let engine;

export async function getEngine() {
  if (!engine) {
    engine = await CreativeEngine.init(config);
  }
  return engine;
}
```

Once started, you can trigger Engine operations inside your app logic from:

- Buttons
- Keyboard shortcuts
- Background tasks

## Example: Build and Export a Scene on a Single Click

The workflow below wires the Engine to a button, so the user automatically downloads an edited PNG when clicking on a button:

1. Copy paste the following code (adjust to your stack as needed):

```js
// Grab the button element
const downloadButton = document.querySelector('#download-headless');

// Register an async click handler
downloadButton?.addEventListener('click', async () => {
  // Wait for the Engine
  const engine = await getEngine();
  
  // Build a fresh scene
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  // Attach the page to the scene
  engine.block.appendChild(scene, page);

  // Add an image layer
  const imageBlock = engine.block.create('graphic');
  engine.block.setShape(imageBlock, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  // Load an image fill from the CDN
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(imageBlock, imageFill);
  // Set position and dimensions 
  engine.block.setPosition(imageBlock, 100, 100);
  engine.block.setWidth(imageBlock, 300);
  engine.block.setHeight(imageBlock, 300);
  // Append the image to the page
  engine.block.appendChild(page, imageBlock);
  
  // Add a text layer
  const textBlock = engine.block.create('text');
  // Set the text content
  engine.block.setString(textBlock, 'text/text', 'Hello from Headless Mode!');
  // Set position and dimensions
  engine.block.setPosition(textBlock, 100, 450);
  engine.block.setWidth(textBlock, 600);
  // Append the text to the page
  engine.block.appendChild(page, textBlock);

  // Export the page as a PNG
  const exportResult = await engine.block.export(page, 'image/png');
  // Normalize the result to a blob
  const blob =
    exportResult instanceof Blob
      ? exportResult
      : new Blob([exportResult], { type: 'image/png' });

  triggerDownload(blob, 'headless-output.png');
});

function triggerDownload(blob, filename) {
  // Build a temporary object URL
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  // Start the download on click
  link.click();
  // Revoke the link and URL to release resources
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

2. Add a clickable element with the matching ID somewhere in your page’s markup. For example:

<Tabs>
  <TabItem label="Plain HTML">
    ```js
    <button id="download-headless">Download headless export</button>
    ```
  </TabItem>

  <TabItem label="Component-based setup">
    If you’re in a component-based setup (React, Vue, Svelte, etc.), include the same button inside the component’s render/template:

    ```js
    return (
    <button id="download-headless">
      Download headless export
    </button>
    );
    ```
  </TabItem>
</Tabs>

Once that element is in the DOM, the snippet’s querySelector('#download-headless') finds it and wires up the click handler that runs the export.

<details>
  <summary>See full module</summary>

  ```js
  import CreativeEngine from '@cesdk/engine';

  const config = {
    license: '<YOUR_LICENSE_KEY>',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/$UBQ_VERSION$/assets'
  };

  let engine;

  export async function getEngine() {
    if (!engine) {
      engine = await CreativeEngine.init(config);
    }
    return engine;
  }

  const downloadButton = document.querySelector('#download-headless');

  downloadButton?.addEventListener('click', async () => {
    const engine = await getEngine();

    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setPosition(imageBlock, 100, 100);
    engine.block.setWidth(imageBlock, 300);
    engine.block.setHeight(imageBlock, 300);
    engine.block.appendChild(page, imageBlock);

    const textBlock = engine.block.create('text');
    engine.block.setString(textBlock, 'text/text', 'Hello from Headless Mode!');
    engine.block.setPosition(textBlock, 100, 450);
    engine.block.setWidth(textBlock, 600);
    engine.block.appendChild(page, textBlock);

    const exportResult = await engine.block.export(page, 'image/png');
    const blob =
      exportResult instanceof Blob
        ? exportResult
        : new Blob([exportResult], { type: 'image/png' });

    triggerDownload(blob, 'headless-output.png');
  });

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  ```
</details>

After you add the script to your app and run the dev server:

1. Click the `#download-headless` button in your interface.
2. The Engine assembles the scene in memory and exports it as a PNG.
3. The PNG downloads locally (or you can upload it to your backend).

<Picture src={greetingCard} style={{ width: '85%' }} alt="Greeting Card with image and text" formats={['webp']} />

## Go Further

Need a hybrid approach? [Engine interface guides](./engine-interface.md) show how to combine headless logic with the standard editor UI.



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support