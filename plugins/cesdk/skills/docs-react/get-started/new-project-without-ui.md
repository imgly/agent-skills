> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart React](./get-started/new-project.md)

---

This guide takes you through integrating CreativeEditor SDK (CE.SDK) Engine
into a React application in ”headless mode” - without the default user
interface. You’ll use the powerful CE.SDK Engine directly to programmatically
create and manipulate designs.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Want to build a custom UI instead of using CE.SDK’s default interface.
- Need to use CE.SDK in automation workflows, without displaying a user-facing editor.
- Have already followed one of the [Getting Started with CE.SDK in React](./get-started/new-project.md) tutorials and want to extend their integration.

## What You’ll Achieve

- Initialize CE.SDK’s headless engine inside a React component.
- Programmatically create and manipulate a scene.
- (Optionally) attach the CE.SDK canvas for rendering visuals while using your own controls.

## Prerequisites

Before you begin, ensure you meet these prerequisites:

- Having completed the [React getting started guide](./get-started/new-project.md).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Set Up a New React Project

Using a [build tool like Vite, Parcel, or RSBuild](https://react.dev/blog/2025/02/14/sunsetting-create-react-app#how-to-migrate-to-a-build-tool) is the recommended way to initialize a new React project. In this guide, you’ll use [Vite](https://vite.dev/).

Run the following Vite command to create a new blank React project called `my-react-app`:

```shell
npm create vite@latest my-react-app -- --template react
```

A new React project will be created in the `my-react-app` folder. Move into the project folder in the terminal:

```shell
cd my-react-app
```

This is the file structure it should contain:

```
my-react-app/
├── public/                # Static assets
│   └── vite.svg           # Default Vite logo
│
├── src/                   # Source code
│   ├── assets/            # Additional static assets
│   │   └── react.svg      # React logo
│   │
│   ├── App.css            # Styles for the main App component
│   ├── App.jsx            # Main React component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point for the React app
│
├── .gitignore             # Git ignore rules
├── eslint.config.js       # ESLint configuration
├── index.html             # Main HTML file (Vite entry point)
├── package.json           # Project dependencies and scripts
├── README.md              # Project documentation
└── vite.config.js         # Vite configuration
```

Install the project’s dependencies via NPM with:

```shell
npm install
```

## Step 2: Install the `cesdk/engine` package

Add CreativeEditor SDK to your project’s dependencies by installing the [`@cesdk/engine`](https://www.npmjs.com/package/@cesdk/engine) NPM package:

```shell
npm install @cesdk/engine
```

## Step 3: Create Your Custom Editor Component

In the `src/` folder of your new React project, create a new file named `CustomEditor.jsx` defining the following component:

> **Warning:** **Important**: You must replace `'YOUR_LICENSE_KEY'` with your actual CE.SDK
> license key. The script will fail with initialization errors without a valid
> license key. [Get a free trial license key](https://img.ly/forms/free-trial).

```jsx title="CustomEditor.jsx"
import CreativeEngine from '@cesdk/engine';
import { useCallback, useEffect, useRef } from 'react';

const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // ⚠️ REPLACE WITH YOUR ACTUAL LICENSE KEY
};

export default function CustomEditor() {
  // Reference to store the DOM container where the CreativeEngine canvas will be attached
  const canvasRef = useRef(null);
  // Reference to store the CreativeEngine instance
  const engineRef = useRef(null);
  // Reference to store the the ID of the image block added to the scene
  const imageBlockIdRef = useRef(null);

  useEffect(() => {
    CreativeEngine.init(config).then(engine => {
      // Avoid initializing CreativeEngine twice in strict mode
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

    // Dispose of the CreativeEngine instance when the component unmounts
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const changeOpacity = useCallback(() => {
    const engine = engineRef.current;
    const imageBlockId = imageBlockIdRef.current;

    if (engine && imageBlockId != null) {
      const currentOpacity = engine.block.getOpacity(imageBlockId);
      engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
    }
  }, [engineRef, imageBlockIdRef]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <button onClick={changeOpacity}>Reduce Opacity</button>
      </div>
    </div>
  );
}
```

## Step 4: Use the Custom Editor Component

Import `CustomEditor` in the `App.jsx` file:

```jsx title="App.jsx"
import { default as CustomEditor } from './CustomEditor';
```

Then, you can render the component on the page by adding it to the JSX as follows:

```jsx
<CustomEditor />
```

`App.jsx` will contain:

```jsx title="App.jsx"
import { default as CustomEditor } from './CustomEditor';

function App() {
  // state management ...

  return (
    <>
      
      <CustomEditor />
      
    </>
  );
}

export default App;
```

## Step 5: Serve the React Project Locally

Run the project locally using the development server provided by Vite. Starting the local server with the following command:

```shell
npm run dev
```

By default, the React app will be accessible on your localhost at `http://localhost:5173/`.

## Step 6: Test the Integration

1. Open `http://localhost:5173/` in your browser.
2. You should see:
   - A canvas showing the programmatically created image
   - A ”Reduce Opacity” button in the top-left corner (your custom UI)
   - No default editor interface or toolbars (this is headless mode)
3. Click the ”Reduce Opacity” button to test programmatic manipulation.

## Troubleshooting & Common Errors

**❌ Error**: `The requested module '/src/CustomEditor.jsx' does not provide an export named 'CustomEditor'`

- Make sure that `CustomEditor` is [imported directly or as a default import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#forms_of_import_declarations), not with a named import. That’s required because the `CreativeEditorSDK.jsx` file doesn’t define a named export.

**❌ Error**: `The following dependencies are imported but could not be resolved: @cesdk/engine`

- Check that you’ve correctly installed CE.SDK using `npm install @cesdk/engine`.

**❌ Error**: `The License Key (API Key) you are using to access the IMG.LY SDK is invalid.`

- Double-check that your CE.SDK license key is valid and hasn’t expired.

**❌ Editor does not load**

- Check the browser console for any errors.
- Verify that your component paths and imports are correct.

## Next Steps

Congratulations! You’ve successfully integrated CE.SDK into a new React project. Now, take some time to explore the SDK and proceed to the next steps whenever you’re ready:

- [Configure the Creative Editor](./configuration.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Create and use a license key](./licensing.md)
- [Configure callbacks](./actions.md)
- [Customize interface labels and translations](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support