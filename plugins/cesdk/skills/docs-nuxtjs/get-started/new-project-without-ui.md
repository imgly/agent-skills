> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Nuxt](./get-started/new-project.md)

---

This guide walks you through embedding the **CreativeEditor SDK (CE.SDK) Engine**—without the default UI—into a **Nuxt.js** app. Use this setup to:

- Automate creative tasks entirely in client-side code.
- Build a fully customized editing interface.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Want to create a **custom user interface** instead of using the default CE.SDK editor.
- Need to run CE.SDK in **browser automation workflows** with no visual editor.
- Have completed a **Get Started** guide with CE.SDK in Nuxt.
- Are ready for more **advanced use cases**.

## What You’ll Achieve

- Launch the CE.SDK headless engine in a Nuxt component.
- Programmatically [create and modify a scene](./open-the-editor.md)—including a custom button that reduces the opacity of a sample image by 20% each time it’s clicked.
- (Optional) Render the CE.SDK canvas while still controlling the editor with your own custom UI.

## Prerequisites

Before you begin, make sure you have:

- A **working Nuxt.js project with Nuxt v3 or v4**.
- A **valid CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Install CE.SDK Engine

To use CE.SDK in headless mode within a Nuxt project, install the [`@cesdk/engine`](https://www.npmjs.com/package/@cesdk/engine) package. Use your project’s package manager to run the following in your project’s root directory:

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

Once the CE.SDK engine is installed, create a new Nuxt component by following these steps:

### Create a New Nuxt Component

1. Open your components folder, by default:

- `app/components/` for **Nuxt 4**.
- `components/` for **Nuxt 3**.

2. Create a new file called `CustomEditor.vue` and paste the following code:

```vue title="CustomEditor.vue"
<script setup>
  import { ref, onMounted } from 'vue';
  import CreativeEngine from '@cesdk/engine';

  // DOM reference to hold the CE.SDK canvas
  const canvasRef = ref(null);
  // To keep track of the ID of the added image block
  let imageBlockId = null;
  // To keep track of the CreativeEngine instance
  let engine = null;

  onMounted(async () => {
    // CE.SDK configuration
    const config = {
      license: 'YOUR_LICENSE_KEY', // Replace with your CE.SDK license key
    };

    // Initialize CreativeEngine in headless mode
    engine = await CreativeEngine.init(config);

    // Attach CE.SDK canvas to the DOM (optional)
    if (canvasRef.value) {
      canvasRef.value.appendChild(engine.element);
    }

    // Get or create a new scene
    let scene = engine.scene.get();
    if (!scene) {
      scene = engine.scene.create();
      const page = engine.block.create('page');
      engine.block.appendChild(scene, page);
    }

    // Get the first page block
    const [page] = engine.block.findByType('page');

    // Create a graphic block and set its shape
    imageBlockId = engine.block.create('graphic');
    engine.block.setShape(imageBlockId, engine.block.createShape('rect'));

    // Fill the graphic block with a public image
    const imageFill = engine.block.createFill('image');
    engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
        width: 1024,
        height: 683,
      },
    ]);
    engine.block.setFill(imageBlockId, imageFill);
    engine.block.appendChild(page, imageBlockId);

    // Zoom to fit the page in the canvas
    engine.scene.zoomToBlock(page);
  });

  // Reduce the image opacity by 20% each click
  function changeOpacity() {
    if (engine && imageBlockId != null) {
      // Get the current opacity value of the image
      const currentOpacity = engine.block.getOpacity(imageBlockId);
      // Reduce the image opacity by 20%
      engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
    }
  }
</script>

<template>
  <div style="width: 100vw; height: 100vh; position: relative">
    <div ref="canvasRef" style="width: 100%; height: 100%"></div>
    <div class="button-overlay">
      <div style="position: absolute; top: 20px; left: 20px">
        <button @click="changeOpacity">Reduce Opacity</button>
      </div>
    </div>
  </div>
</template>
```

Once CreativeEngine is initialized, you can access and [edit a scene with full flexibility](./open-the-editor.md). In the preceding code:

- We add a sample image to the canvas.
- We include a button that reduces its opacity.
- Each click reduces the image's opacity by 20%.

In particular, the `changeOpacity()` function:

- Uses the [CE.SDK headless  API](./concepts/blocks.md).
- Fetches the current opacity of the image.
- Updates it dynamically.

> **Note:** Rendering a canvas on the browser is completely optional. The engine also works for **automation only—without any UI**.<details>
>   <summary>Automation Flow Example</summary>
>   For instance, you could:
>
>   1. Adjust image properties (like opacity in memory).
>   2. **Directly export** or process the result without rendering it on screen.
> </details>

### Style the Component

Customize the appearance of your editor, by pasting the following CSS at the end of your `CustomEditor.vue` file:

```vue title="CustomEditor.vue"
<style scoped>
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
    padding: 0.6em 0.6em;
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
    width: 150px;
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
  <summary>See the final `CustomEditor.vue` file</summary>

  ```vue title="CustomEditor.vue"
  <script setup>
    import { ref, onMounted } from 'vue';
    import CreativeEngine from '@cesdk/engine';

    // DOM reference to hold the CE.SDK canvas
    const canvasRef = ref(null);
    // To keep track of the ID of the added image block
    let imageBlockId = null;
    // To keep track of the CreativeEngine instance
    let engine = null;

    onMounted(async () => {
      // CE.SDK configuration
      const config = {
        license: 'YOUR_LICENSE_KEY', // Replace with your CE.SDK license key
      };

      // Initialize CreativeEngine in headless mode
      engine = await CreativeEngine.init(config);

      // Attach CE.SDK canvas to the DOM (optional)
      if (canvasRef.value) {
        canvasRef.value.appendChild(engine.element);
      }

      // Get or create a new scene
      let scene = engine.scene.get();
      if (!scene) {
        scene = engine.scene.create();
        const page = engine.block.create('page');
        engine.block.appendChild(scene, page);
      }

      // Get the first page block
      const [page] = engine.block.findByType('page');

      // Create a graphic block and set its shape
      imageBlockId = engine.block.create('graphic');
      engine.block.setShape(imageBlockId, engine.block.createShape('rect'));

      // Fill the graphic block with a public image
      const imageFill = engine.block.createFill('image');
      engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
        {
          uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
          width: 1024,
          height: 683,
        },
      ]);
      engine.block.setFill(imageBlockId, imageFill);
      engine.block.appendChild(page, imageBlockId);

      // Zoom to fit the page in the canvas
      engine.scene.zoomToBlock(page);
    });

    // Reduce the image opacity by 20% each click
    function changeOpacity() {
      if (engine && imageBlockId != null) {
        // Get the current opacity value on the image
        const currentOpacity = engine.block.getOpacity(imageBlockId);
        // Reduce the image opacity by 20%
        engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
      }
    }
  </script>

  <template>
    <div style="width: 100vw; height: 100vh; position: relative">
      <div ref="canvasRef" style="width: 100%; height: 100%"></div>
      <div class="button-overlay">
        <div style="position: absolute; top: 20px; left: 20px">
          <button @click="changeOpacity">Reduce Opacity</button>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
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
      padding: 0.6em 0.6em;
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
      width: 150px;
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

## Step 3: Ensure Client-Side Rendering (Avoid SSR)

Because the CE.SDK engine relies on browser-specific features like `document`, the `CustomEditor` component must be rendered only on the client side. To do so, you’ll need to wrap it in Nuxt’s `<ClientOnly>` component.

Create a wrapper component `CustomEditorNoSSR.vue` in your `components/` directory that imports the `CustomEditor.vue` component within `<ClientOnly>`:

```vue title="CustomEditorNoSSR.vue"
<script setup>
import CustomEditor from './CustomEditor.vue';
</script>

<template>
  <ClientOnly>
    <CustomEditor />
  </ClientOnly>
</template>
```

## Step 4: Embed the Custom Editor Component

To embed your new custom Creative Editor component:

1. Choose where you want to render it in your app.
2. Go to the `<script setup>` section of the relevant Nuxt component/page (for example, `app.vue`).
3. Import `CustomEditorNoSSR` like this:

```vue title="app.vue"
import CustomEditorNoSSR from './components/CustomEditorNoSSR.vue';
```

4. Add the `CustomEditorNoSSR` component in the `<template>` section of your file:

```vue
<CustomEditorNoSSR />
```

## Step 5: Test the Custom Editor

1. Run your app locally.
2. Navigate to the page containing `<CustomEditor />`.
3. Your app should display a sample image displayed on the canvas, along with a “Reduce Opacity” button.
4. Click the button to see the image’s opacity decrease by 20% on each click.

## Use Cases

Congratulations! You’ve successfully set the stage for:

- Building fully customized UIs using Nuxt.js components alongside the CE.SDK canvas.
- Automating the creation of graphics or marketing materials directly in the browser.
- Integrating CE.SDK into rich, multi-step creative browser workflows using programmatic logic.

## Troubleshooting & Common Errors

❌ **Error**: `The following dependencies are imported but could not be resolved:  @cesdk/engine`

- Make sure you’ve installed CreativeEngine correctly using `npm install @cesdk/engine` or the equivalent in your package manager.

❌ **Error**: CE.SDK canvas doesn’t render

- Ensure you’re appending `engine.element` to a valid HTML element. Then, confirm that the DOM reference exists and is available when the engine is initialized.

❌ **Error**: `Missing license key in config`

- Check that your `config` object includes a `license` property and that it’s set to your CE.SDK license key.

❌ **Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Verify that your license key is valid, hasn’t expired, and is correctly included in your configuration.

❌ **Issue**: The custom editor component doesn’t behave as expected

- Inspect the browser console for errors to help pinpoint the issue.

## Next Steps

This guide sets the foundation for creating a custom UI with Nuxt. Next, learn how to:

- [Automate design exports](./export-save-publish/export/overview.md)
- [Automate design generation and editing](./automation.md)



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support