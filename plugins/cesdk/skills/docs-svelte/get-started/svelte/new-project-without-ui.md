> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Svelte](./get-started/new-project.md)

---

Learn how to embed the CreativeEditor SDK (CE.SDK) Engine—without the default UI—in a **vanilla Svelte app** (not SvelteKit). This **headless** approach lets you drive the editor through code, and render your customized interface as needed.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Want to design a custom editor UI.
- Need to run CE.SDK in browser automation workflows with no visual editor.
- Have completed a **Getting Started with CE.SDK** in Svelte.
- Are ready for more advanced use cases.

## What You’ll Achieve

- Launch CE.SDK headless engine in a Svelte component.
- Script scene edits.
- Add a custom button that reduces an image’s opacity by 20% each time it’s clicked.
- *(Optional)* Render the CE.SDK canvas while still controlling the editor with your own custom UI.

## Prerequisites

What you need before starting:

- A working Svelte project (without SvelteKit).
- Completed the “*Getting Started with CE.SDK in Svelte*” tutorial.
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Install CE.SDK Engine

To use CE.SDK in headless mode within a Svelte project, install the engine package. Use your project’s package manager to run the following command in your project’s root directory:

<Tabs>
  <TabItem label="npm">
    ```shell
    npm install @cesdk/engine
    ```
  </TabItem>

  <TabItem label="yarn">
    ```shell
    yarn add @cesdk/engine
    ```
  </TabItem>

  <TabItem label="pnpm">
    ```shell
    pnpm add @cesdk/engine
    ```
  </TabItem>
</Tabs>

## Step 2: Define a Custom Editor Component With Headless UI

Once you’ve successfully installed the package, create a new vanilla Svelte component by following these steps:

### Create a New Svelte Component

1. Open your components folder (typically, `src/lib/`).
2. Create **a new file** called `CustomEditor.svelte`
3. Paste the following code into `CustomEditor.svelte`:

> **Warning:** Replace `<YOUR_LICENSE_KEY>` by your valid license key.

```svelte title="CustomEditor.svelte"

<script>
  import { onMount } from 'svelte';
  import CreativeEngine from '@cesdk/engine';

  // To store the DOM container where the CreativeEngine canvas will be attached
  let canvasContainer;
  // To store the CreativeEngine instance
  let engine;
  // To store the ID of the image block added to the scene
  let imageBlockId = null;

  onMount(async () => {
    // Your CE.SDK configurations
    const config = {
      // license: 'YOUR_CESDK_LICENSE_KEY', // Replace this with your CE.SDK license
    };

    // Initialize CreativeEngine in headless mode
    engine = await CreativeEngine.init(config);

    // Append CreativeEngine canvas to the DOM (optional)
    if (canvasContainer && engine.element) {
      canvasContainer.appendChild(engine.element);
    }

    // Get the current scene or create a new one
    let scene = engine.scene.get();
    if (!scene) {
      scene = engine.scene.create();
      const page = engine.block.create('page');
      engine.block.appendChild(scene, page);
    }

    // Get the first page block
    const [page] = engine.block.findByType('page');

    // Append a block to show an image on the page
    const imageBlock = engine.block.create('graphic');
    imageBlockId = imageBlock;
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));

    // Fill the block with an image from a public source
    const imageFill = engine.block.createFill('image');
    engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
        width: 1024,
        height: 683,
      },
    ]);
    engine.block.setFill(imageBlock, imageFill);
    engine.block.appendChild(page, imageBlock);

    // Zoom to fit the page in the editor view
    engine.scene.zoomToBlock(page);
  });

  // Callback to change the opacity of the image
  function changeOpacity() {
    if (engine && imageBlockId != null) {
      // Get the current opacity value of the image
      const currentOpacity = engine.block.getOpacity(imageBlockId);
      // Reduce the opacity of the image by 20% on each click
      engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
    }
  }
</script>

<div class="editor-container">
  <div class="canvas-container" bind:this="{canvasContainer}"></div>
  <div class="button-overlay">
    <button on:click="{changeOpacity}">Reduce Opacity</button>
  </div>
</div>
```

Once CreativeEngine is initialized, you can access and [edit a scene with full flexibility.](./open-the-editor.md). In the preceding code:

- We add a sample image to the canvas.
- We include a button that reduces its opacity.
- Each click reduces the image’s opacity by 20%.

In particular, the `changeOpacity()` function:

- Uses the [CE.SDK headless  API](./concepts/blocks.md)
- Fetches the current opacity of the image
- Updates it dynamically.

> **Note:** Rendering a canvas in the browser is completely optional. The engine also works for **automation only—without any UI**.<details>
>   <summary>Automation Flow Example</summary>
>   For instance, you could: 1. Adjust image properties (like opacity in memory).
>
>   1. **Directly export** or process the result without rendering it on screen.
> </details>

### Style the Component

Customize appearance of your editor, by pasting the following CSS at the end of your `CustomEditor.svelte` file:

```svelte title="CustomEditor.svelte"
//... Component code above
<style>
  .editor-container {
    width: 100vw;
    height: 100vh;
    position: relative;
  }

  .canvas-container {
    width: 100%;
    height: 100%;
  }

  .button-overlay {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .button-overlay button {
    border-radius: 8px;
    border: 1px solid #ccc;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #ffffff;
    color: #1a1a1a;
    cursor: pointer;
    transition:
      border-color 0.25s,
      box-shadow 0.25s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .button-overlay button:hover {
    border-color: #646cff;
    box-shadow: 0 4px 10px rgba(100, 108, 255, 0.2);
  }

  .button-overlay button:focus,
  .button-overlay button:focus-visible {
    outline: 2px solid #646cff;
    outline-offset: 2px;
  }
</style>
```

Modify the styles to fit your application’s design.

<details>
  <summary>Here’s the final `CustomEditor.svelte` file</summary>

  ```svelte title="CustomEditor.svelte"
  <script>
    import { onMount } from 'svelte';
    import CreativeEngine from '@cesdk/engine';

    // To store the DOM container where the CreativeEngine canvas will be attached
    let canvasContainer;
    // To store the CreativeEngine instance
    let engine;
    // To store the ID of the image block added to the scene
    let imageBlockId = null;

    onMount(async () => {
      // Your CE.SDK configurations
      const config = {
        license: '<YOUR_CE_SDK_LICENSE>', // replace this with your CE.SDK license
      };

      // Initialize CreativeEngine in headless mode
      engine = await CreativeEngine.init(config);

      // Append CE.SDK canvas to the DOM (optional)
      if (canvasContainer && engine.element) {
        canvasContainer.appendChild(engine.element);
      }

      // Get the current scene or create a new one
      let scene = engine.scene.get();
      if (!scene) {
        scene = engine.scene.create();
        const page = engine.block.create('page');
        engine.block.appendChild(scene, page);
      }

      // Get the first page block
      const [page] = engine.block.findByType('page');

      // Append a block to show an image on the page
      const imageBlock = engine.block.create('graphic');
      imageBlockId = imageBlock;
      engine.block.setShape(imageBlock, engine.block.createShape('rect'));

      // Fill the block with an image from a public source
      const imageFill = engine.block.createFill('image');
      engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
        {
          uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
          width: 1024,
          height: 683,
        },
      ]);
      engine.block.setFill(imageBlock, imageFill);
      engine.block.appendChild(page, imageBlock);

      // Zoom to fit the page in the editor view
      engine.scene.zoomToBlock(page);
    });

    // Callback to change the opacity of the image
    function changeOpacity() {
      if (engine && imageBlockId != null) {
        // Get the current opacity value of the image
        const currentOpacity = engine.block.getOpacity(imageBlockId);
        // Reduce the opacity of the image by 20% at each click
        engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
      }
    }
  </script>

  <div class="editor-container">
    <div class="canvas-container" bind:this="{canvasContainer}"></div>
    <div class="button-overlay">
      <button on:click="{changeOpacity}">Reduce Opacity</button>
    </div>
  </div>

  <style>
    .editor-container {
      width: 100vw;
      height: 100vh;
      position: relative;
    }

    .canvas-container {
      width: 100%;
      height: 100%;
    }

    .button-overlay {
      position: absolute;
      top: 20px;
      left: 20px;
    }

    .button-overlay button {
      border-radius: 8px;
      border: 1px solid #ccc;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #ffffff;
      color: #1a1a1a;
      cursor: pointer;
      transition:
        border-color 0.25s,
        box-shadow 0.25s;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .button-overlay button:hover {
      border-color: #646cff;
      box-shadow: 0 4px 10px rgba(100, 108, 255, 0.2);
    }

    .button-overlay button:focus,
    .button-overlay button:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }
  </style>
  ```
</details>

## Step 3: Embed the Custom Editor Component

To embed your new Creative Editor component:

1. Choose where you want to render it in your app
2. Go to the `<script>` section of the relevant Svelte component/page (for example, `App.svelte`).
3. Import `CustomEditor`:

```js
import CustomEditor from './lib/CustomEditor.svelte';
```

4. Add the `CustomEditor` component in the template section of your file:

```svelte
<CustomEditor />
```

## Step 4: Test the Custom Editor

1. Run your app locally
2. Navigate to the page containing `<CustomEditor>`
3. Your app should display a sample image displayed on the canvas, along with a “Reduce Opacity” button
4. Click the button to see the image’s opacity decrease by 20% with each click.

## Use Cases

Congratulations! You’ve successfully set the stage for:

- Creating fully customized creative tools using Svelte.
- Automating the creation of graphics and visual assets.
- Dynamically controlling the CE.SDK engine in browser-based workflows.

## Troubleshooting & Common Errors

❌ **Error**: `The following dependencies are imported but could not be resolved:  @cesdk/engine`

- Make sure you’ve installed CreativeEngine correctly using `npm install @cesdk/engine`.

❌ **Error**: CE.SDK canvas doesn’t render

- Ensure you’re appending `engine.element` to a valid HTML element. Then, confirm that the DOM reference exists and is available when the engine is initialized.

❌ **Error**: `Missing license key in config`

- Check that your `config` object includes a `license` property and that it’s set to your CE.SDK license key.

❌ **Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Verify that your license key is valid, hasn’t expired, and is correctly included in your configuration.

❌ **Issue:** The custom editor component doesn’t behave as expected

- Inspect the browser console for errors to help pinpoint the issue.

## Next Steps

This guide sets the foundation for creating a custom UI with Svelte. Next, learn how to:

- [Automate design exports.](./export-save-publish/export/overview.md)
- [Automate design generation and editing.](./automation.md)



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support