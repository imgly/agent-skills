> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Next.js](./get-started/new-project.md)

---

Learn how to use the CreativeEditor SDK (CE.SDK) Engine to build a **custom
editing interface**, and automate design workflow entirely through code—no
visual editor required.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who, instead of using the default CE.SDK editor interface:

- Want to build a **custom UI**.
- Need to **automate design tasks** without a visual interface.
- Have already completed a “*Getting Started with CE.SDK in Next.js*” tutorial, and are ready to explore more advanced use cases.

## What You’ll Achieve

- Create a client-side Next.js component that initializes the CE.SDK **headless engine**.
- Programmatically create and edit a scene
- Include **a custom button** that reduces the opacity of a sample image by 20% each time it’s clicked.
- *(Optional)* Render the CE.SDK canvas for visual feedback—while keeping full control through your custom UI.

## Prerequisites

Before you begin, make sure you have:

- A working Next.js project.
- Completed the “*Getting Started with CE.SDK in Next.js*” guide.
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Install CE.SDK Engine

To use CE.SDK in headless mode, install the SDK via the [`@cesdk/engine`](https://www.npmjs.com/package/@cesdk/engine) npm package:

```bash
npm install @cesdk/engine
```

## Step 2: Define a Custom Component for Your Headless CE.SDK Integration

Inside your Next.js `/components` folder, create a new file according to the project’s language:

> **Note:** Replace `<YOUR_CESDK_LICENSE>` with a **valid license key**.

<Tabs>
  <TabItem label="JavaScript">
    Create a file named `CustomEditor.js`, and add the following code to it:

    ```js title="CustomEditor.js"
    'use client';

    import CreativeEngine from '@cesdk/engine';
    import { useEffect, useRef, useCallback } from 'react';

    export default function CustomEditor() {
      // Reference to store the DOM container where the CreativeEngine canvas will be attached
      const canvasRef = useRef(null);
      // Reference to store the CreativeEngine instance
      const engineRef = useRef(null);
      // Reference to store the the ID of the image block added to the scene
      const imageBlockIdRef = useRef(null);

      useEffect(() => {
        // Your CE.SDK configurations
        const config = {
          license: '<YOUR_CESDK_LICENSE>', // Replace with your license key
        };

        // Initialize CreativeEngine in headless mode
        CreativeEngine.init(config).then(engine => {
          // To avoid initializing CreativeEngine twice in strict mode
          if (!engineRef.current) {
            engineRef.current = engine;

            // Append CE.SDK canvas to the DOM
            if (canvasRef.current) {
              canvasRef.current.appendChild(engine.element);
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
            const imageBlockId = engine.block.create('graphic');
            imageBlockIdRef.current = imageBlockId;
            engine.block.setShape(imageBlockId, engine.block.createShape('rect'));

            // Fill the block with an image from a public source
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

            // Zoom to fit the page in the editor view
            engine.scene.zoomToBlock(page);
          }
        });
      }, []);

      const changeOpacity = useCallback(() => {
        const engine = engineRef.current;
        const imageBlockId = imageBlockIdRef.current;

        if (engine && imageBlockId != null) {
          // Get the current opacity value of the image
          const currentOpacity = engine.block.getOpacity(imageBlockId);
          // Reduce the opacity image by 20% at each click
          engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
        }
      }, [engineRef, imageBlockIdRef]);

      return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          <div style={{ position: 'fixed', top: 20, left: 20 }}>
            <button onClick={changeOpacity}>Reduce Opacity</button>
          </div>
        </div>
      );
    }
    ```
  </TabItem>

  <TabItem label="TypeScript">
    Create a file named `CustomEditor.tsx`, and add the following code to it:

    ```tsx title="CustomEditor.tsx"
    'use client';

    import CreativeEngine from '@cesdk/engine';
    import { useEffect, useRef, useCallback } from 'react';

    export default function CustomEditor() {
      // Reference to store the DOM container where the CreativeEngine canvas will be attached
      const canvasRef = useRef<HTMLDivElement | null>(null);
      // Reference to store the CreativeEngine instance
      const engineRef = useRef<CreativeEngine | null>(null);
      // Reference to store the the ID of the image block added to the scene
      const imageBlockIdRef = useRef<number | null>(null);

      useEffect(() => {
        // Your CE.SDK configurations
        const config = {
          // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your license key
        };

        // Initialize CreativeEngine in headless mode
        CreativeEngine.init(config).then(engine => {
          // To avoid initializing CreativeEngine twice in strict mode
          if (!engineRef.current) {
            engineRef.current = engine;

            // Append CE.SDK canvas to the DOM
            if (canvasRef.current) {
              canvasRef.current.appendChild(engine.element);
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
            const imageBlockId = engine.block.create('graphic');
            imageBlockIdRef.current = imageBlockId;
            engine.block.setShape(imageBlockId, engine.block.createShape('rect'));

            // Fill the block with an image from a public source
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

            // Zoom to fit the page in the editor view
            engine.scene.zoomToBlock(page);
          }
        });
      }, []);

      const changeOpacity = useCallback(() => {
        const engine = engineRef.current;
        const imageBlockId = imageBlockIdRef.current;

        if (engine && imageBlockId != null) {
          // Get the current opacity value of the image
          const currentOpacity = engine.block.getOpacity(imageBlockId);
          // Reduce the opacity image by 20% at each click
          engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
        }
      }, [engineRef, imageBlockIdRef]);

      return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', top: 20, left: 20 }}>
            <button type="button" onClick={changeOpacity}>
              Reduce Opacity
            </button>
          </div>
        </div>
      );
    }
    ```
  </TabItem>
</Tabs>

⚠️ Always include [`"use client"`](https://nextjs.org/docs/app/building-your-application/rendering/client-components) with your component, which uses React hooks and **browser** APIs.

Once your app initializes CreativeEngine, it allows you to programmatically create and manipulate the scene. In this example, the component includes:

- a sample image
- a ”Reduce Opacity” button
- every click of the button reduces the image’s opacity by 20%

”Reduce Opacity” uses:

- a `changeOpacity()` callback on every click
- [CE.SDK  API](./concepts/blocks.md) to dynamically reduce
  the image’s opacity

**Note**: Visual rendering is completely optional. You can also run the engine purely in headless mode—for automation tasks like:

- Modifying graphics
- Generating exports

## Step 3: Create a Client-Side Editor Component

If you attach it to the canvas, CreativeEngine requires:

- **Browser-specific features** like `document`
- Dynamic DOM manipulation

Because of that, the `CustomEditor`:

- must only run on the client.
- should never be server-side rendered (SSR).

To ensure that, load it dynamically using [Next.js’s `dynamic` import with `ssr: false`](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr).

To **avoid repeating this dynamic import** in every file where you use the component, create a wrapper component named `CustomEditorNoSSR` inside your components folder.

<Tabs>
  <TabItem label="JavaScript">
    Create a file named `CustomEditorNoSSR.js`, and add the following code in it:

    ```js title="CustomEditorNoSSR.js"
    'use client';

    import dynamic from 'next/dynamic';

    const CustomEditorNoSSR = dynamic(() => import('./CustomEditor'), {
      ssr: false,
    });

    export default CustomEditorNoSSR;
    ```
  </TabItem>

  <TabItem label="TypeScript">
    Create a file named `CustomEditorNoSSR.tsx`, and add the following code to it:

    ```tsx title="CustomEditorNoSSR.tsx"
    'use client';

    import dynamic from 'next/dynamic';

    const CustomEditorNoSSR = dynamic(() => import('./CustomEditor'), {
      ssr: false,
    });

    export default CustomEditorNoSSR;
    ```
  </TabItem>
</Tabs>

This wrapper exports the `CustomEditor` component with SSR deactivated.

## Step 4: Use the Creative Editor Component

You can import the non-SSR version of your editor like this:

```js
import { default as CustomEditor } from './components/CustomEditorNoSSR';
```

Then, render it on the client by adding it to your JSX:

```html
<CustomEditor />
```

Next:

1. Start your Next.js app locally.
2. Navigate to the page where you’ve included `<CustomEditor>`.
3. See the a sample image in the canvas.
4. Use the “Reduce Opacity” button to adjust the image’s opacity by 20% with each click.

## Use Cases

Congratulations! You’ve just unlocked the foundation for more advanced use cases, such as:

- Building fully custom user interfaces using Next.js components alongside the CE.SDK canvas.
- Automating the generation of graphics or marketing assets directly in the browser.
- Integrating CE.SDK into complex, multi-step creative workflows using programmatic logic.
- Creating server-side image or video processing features with [`@cesdk/node`](https://www.npmjs.com/package/@cesdk/node), as covered in “*Getting Started with CE.SDK in Node.js*” guide.

## Troubleshooting & Common Errors

**❌ Error**: `Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.`

- This warning appears only during development and **doesn’t affect production**. It’s linked to how Turbopack serves your app locally, and how CE.SDK dynamically mounts DOM elements. You can safely ignore this or suppress it by adding [`suppressHydrationWarning`](https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning) to the affected component.

**❌ Error**: `document is not defined`

- This means CE.SDK tried to access the browser `document` object on the server. To avoid that, ensure your app imports `CustomEditor` dynamically with `next/dynamic` and `ssr: false`, using the [wrapper](./get-started/new-project-without-ui-k4f45q/#step-3-create-a-client-side-editor-component.md).

**❌ Error**: The CE.SDK canvas is rendered twice

- Although `useEffect(..., [])` is designed to execute only once, [React might trigger a re-render in strict mode](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactStrictMode), causing the engine to load twice. Add an additional check (`if (!engineRef.current) { ... }`) to initialize the engine only if it hasn’t been loaded already.

**❌ Error**: CE.SDK canvas doesn’t render

- Make sure that you’re appending `engine.element` to a valid DOM reference. Double-check that the reference is valid and is properly attached to the DOM element.

**❌ Error**: `Module not found: Can't resolve '@cesdk/engine``'`

- Verify that you’ve correctly installed the CE.SDK Engine using the command `npm install @cesdk/engine`.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Double-check that your license key is valid, hasn’t expired, and is correctly set.

**❌ The component doesn’t behave as expected**

- Verify that your component paths and imports are correct.
- See if `use client` is declared at the top of client components.
- Check the browser console for specific errors.

## Next Steps

This guide lays the foundation for:

- [Creating a full custom UI with Next.js](./user-interface/appearance/theming.md)
- [Exporting scenes programmatically](./export-save-publish/export/overview.md)
- [Batch processing graphics or template content](./automation.md)



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support