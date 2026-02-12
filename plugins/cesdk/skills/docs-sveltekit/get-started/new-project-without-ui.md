> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart SvelteKit](./get-started/new-project.md)

---

Learn how to integrate the [CreativeEditor SDK (CE.SDK) Engine](./engine-interface.md)—*without* its built-in UI—into a SvelteKit app. This setup is ideal for:

- Building a custom editing interface.
- Automating creative workflows through code only.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Want to design a **custom UI** instead of using CE.SDK’s default editor.
- Intend to **automate workflows**.
- Need to integrate CE.SDK into server components **without** rendering a **visual editor**.
- Have completed a *“Getting Started with CE.SDK in SvelteKit”* tutorial and are ready to explore more advanced use cases.

## What You’ll Achieve

1. Integrate CE.SDK’s **headless engine** into a SvelteKit component.
2. Add code that creates and modifies a [CE.SDK scene](./concepts/scenes.md).
3. Add a custom button that reduces the opacity of an image on each click.
4. *(Optional)* Render the CE.SDK canvas while still managing the editor with your own UI.

## Prerequisites

Before starting, ensure you have:

- A working SvelteKit project.
- A valid **CE.SDK license key**.

## Step 0: Run the Project Locally

Start your local server at the root of your SvelteKit project. For example:

<Run />

Make sure your SvelteKit app runs without issues before proceeding with this guide.

## Step 1: Install CE.SDK Engine

To use CE.SDK in headless mode in SvelteKit, install the library via the [`@cesdk/engine`](https://www.npmjs.com/package/@cesdk/engine) package:

<Tabs>
  <TabItem label="npm">
    ```bash
    npm install @cesdk/engine
    ```
  </TabItem>

  <TabItem label="yarn">
    ```bash
    yarn add @cesdk/engine
    ```
  </TabItem>

  <TabItem label="pnpm">
    ```bash
    pnpm add @cesdk/engine
    ```
  </TabItem>
</Tabs>

## Step 2: Create a Custom Component

Create a custom editor component that runs headless:

1. Open the `src/lib/` folder.
2. Create a file named `CustomEditor.svelte`.
3. Paste this code into your file:

<Tabs>
  <TabItem label="JavaScript">
    > **Note:** Replace `YOUR_LICENSE_KEY` with your **license key**.

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
        // Your CE.SDK configuration
        const config = {
          license: '<YOUR_CE_SDK_LICENSE>', // Replace with your CE.SDK license key
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
    ```
  </TabItem>

  <TabItem label="TypeScript">
    > **Note:** Replace `YOUR_LICENSE_KEY` with your **license key**.

    ```svelte title="CustomEditor.svelte"
    <script>
      import { onMount } from 'svelte';
      import CreativeEngine from '@cesdk/engine';

      /** @type {HTMLDivElement | null} */
        // Your CE.SDK configuration
      // To store the DOM container where the CreativeEngine canvas will be attached
      let canvasContainer = null;
      // To store the CreativeEngine instance
        /** @type {any} */
      let engine = null;
      // To store the ID of the image block added to the scene
      /** @type {number | null} */
      let imageBlockId = null;

      onMount(async () => {
        // Your CE.SDK configuration
        const config = {
          // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
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

    ```
  </TabItem>
</Tabs>

Once you’ve initialized CreativeEngine, you can:

- Access the scene.
- Programmatically create elements.
- Update the elements’ properties.

### Understand the Component

In this example, you do the following:

1. Add a sample image to the scene.
2. Create a button that decreases the image’s opacity.
3. With each click of the button, decrease the image’s opacity by 20%.

The `changeOpacity()` function uses the **headless [CE.SDK  API](./concepts/blocks.md)** to:

- Retrieve the image’s current opacity
- Adjust it dynamically.

> **Note:** Rendering the CE.SDK canvas on the front end is **optional**. You can use the engine entirely for automated processing in the browser—no UI required. For example, you could:1) Reduce the opacity of an image in memory.
> 2) Export it **without ever rendering it on screen**.

### Style the Component

Consider styling your custom component with:

```svelte title="CustomEditor.svelte"
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

<details>
  <summary>Final `CustomEditor.svelte` file</summary>

  <br />

  <Tabs>
    <TabItem label="JavaScript">
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
          // Your CE.SDK configuration
          const config = {
            license: '<YOUR_CE_SDK_LICENSE>', // Replace with your CE.SDK license key
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
    </TabItem>

    <TabItem label="TypeScript">
      ```svelte title="CustomEditor.svelte"
      <script>
        import { onMount } from 'svelte';
        import CreativeEngine from '@cesdk/engine';

        /** @type {HTMLDivElement | null} */
          // Your CE.SDK configuration
        // To store the DOM container where the CreativeEngine canvas will be attached
        let canvasContainer = null;
        // To store the CreativeEngine instance
          /** @type {any} */
        let engine = null;
        // To store the ID of the image block added to the scene
        /** @type {number | null} */
        let imageBlockId = null;

        onMount(async () => {
          // Your CE.SDK configuration
          const config = {
            // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
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
    </TabItem>
  </Tabs>
</details>

### Optional: Export Component Using the Module System

If you organize your SvelteKit project’s components in a single `src/lib/index.js` file, add the following line to `index.js`:

```js title="index.js"
export { default as CustomEditor } from './CustomEditor.svelte';
```

## Step 3: Use the Custom Editor Component

CreativeEngine only operates in the browser. To handle client-side rendering, you need to:

1. Import the component in a route file.
2. Render the component on a page when the app is running in the browser.

### Import the CustomEditor Component

Dynamically import and render the `CustomEditor` component as follows:

1. Open the relevant **SSR route file**, which should contain the component (for example, `src/routes/+page.svelte`).
2. Navigate to the `<script>` section.
3. Paste this code to **dynamically import** the `CustomEditor` component:

<Tabs>
  <TabItem label="JavaScript">
    ```svelte title="+page.svelte"
    <script>
      import { browser } from "$app/environment"; // True only if the app is running in the browser
      // Use the browser flag to conditionally render client-side components
      let isClient = browser;

      let CustomEditor;
      if (isClient) {
        // Dynamically import the CustomEditor component only in the browser
        import("$components/CustomEditor.svelte").then(module => {
          CustomEditor = module.default;
        });
      }

    </script>
    ```
  </TabItem>

  <TabItem label="TypeScript">
    ```svelte title="+page.svelte"
    <script lang="ts">
      import { browser } from "$app/environment"; // True only if the app is running in the browser
      // Use the browser flag to conditionally render client-side components
      let isClient = browser;

      import type { ComponentType } from "svelte";
      let CustomEditor: ComponentType | null = null;
      if (isClient) {
        // Dynamically import the CustomEditor component only in the browser
        import("$components/CustomEditor.svelte").then(module => {
          CustomEditor = module.default;
        });
      }
         </script>

    ```
  </TabItem>
</Tabs>

<br />

> **Note:** The `browser` flag in `$app/environment` identifies code that only runs in the browser. For more information, visit [SvelteKit docs](https://svelte.dev/docs/kit/$app-environment#browser).

### Optional: Import Components Using the Module System

If you exported `CustomEditor` from `src/lib/index.js`, you can simplify the dynamic import:

```svelte title="+page.svelte"
import("$lib").then(module => {
CustomEditor = module.CustomEditor;
});
```

### Render the CreativeEditorSDK Component

Render the component only on the client::

1. Navigate to the **template section** of your SvelteKit route or component
2. **Wrap** the component like this:

```svelte title="+page.svelte"

    // </script>
    {#if isClient && CustomEditor}
      <CustomEditor />
    {/if}
```

<details>
  <summary>Final `+page.svelte` file</summary>

  <br />

  <Tabs>
    <TabItem label="JavaScript">
      ```svelte title="+page.svelte"
      <script>
        import { browser } from "$app/environment"; // True only if the app is running in the browser
        // Use the browser flag to conditionally render client-side components
        let isClient = browser;

        let CustomEditor;
        if (isClient) {
          // Dynamically import the CustomEditor component only in the browser
          import("$components/CustomEditor.svelte").then(module => {
            CustomEditor = module.default;
          });
        }

      </script>

      {#if isClient && CustomEditor}
        <CustomEditor />
      {/if}
      ```
    </TabItem>

    <TabItem label="TypeScript">
      ```svelte title="+page.svelte"
      <script lang="ts">
        import { browser } from "$app/environment"; // True only if the app is running in the browser
        // Use the browser flag to conditionally render client-side components
        let isClient = browser;

        import type { ComponentType } from "svelte";
        let CustomEditor: ComponentType | null = null;
        if (isClient) {
          // Dynamically import the CustomEditor component only in the browser
          import("$components/CustomEditor.svelte").then(module => {
            CustomEditor = module.default;
          });
        }

      </script>

      {#if isClient && CustomEditor}

      <CustomEditor />
      {/if}

      ```
    </TabItem>
  </Tabs>
</details>

Verify the integration works:

1. Navigate to the page containing `<CustomEditor>`.
2. Check the existence of a sample image on the canvas, along with a “Reduce Opacity” button.
3. Click the button to reduce the image’s opacity by 20% each time.

## Use Cases

Congratulations! You’ve laid the groundwork for:

- Building **fully customized creative tools** with SvelteKit.
- **Automating** the generation of graphics and visual content.
- Managing the CE.SDK engine **through code** in browser-based workflows.
- Developing **server-side image or video manipulation** features using `@cesdk/node`.

## Troubleshooting & Common Errors

❌ **Error**: `Error when evaluating SSR module /src/routes/+page.svelte: document is not defined`

- Verify that you integrate the `CustomEditor` component using:

- Dynamic import in `/src/routes/+page.svelte`.

- Client side rendering only.

❌ **Error**: CE.SDK canvas doesn’t render

- Make sure you append `engine.element` to an HTML element that already exists in the page.
- Double-check that the container element:

1. Exists in the DOM when you call `appendChild`.
2. Renders or mounts before the code initializes the engine.

❌ **Error**: `Internal server error: Failed to resolve import "@cesdk/engine" from "src/lib/CustomEditor.svelte". Does the file exist?`

- Confirm that you’ve installed CreativeEngine using the [install command](./get-started/new-project-without-ui-we2f7c/#step-1-install-cesdk.md).

❌ **Error**: `Missing license key in config`

- Ensure your `config` object:

1. Includes a **`license` property**.
2. You’ve set the `license` property to your CE.SDK license key.

❌ **Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Verify that your **license key is correct**, hasn’t expired, and is properly added to the configuration.

❌ **Issue:** The component doesn’t behave as expected

- Double-check your component paths and import statements.
- Open the browser console and inspect any runtime errors that might help identify the issue.

## Next Steps

This guide has set the stage for:

- [Creating a full custom UI with SvelteKit.](./user-interface/build-your-own-ui.md)
- [Automating the export of scenes.](./export-save-publish/export/overview.md)
- [Batch processing graphics or template content.](./automation.md)



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support