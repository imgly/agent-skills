> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide walks you through integrating CreativeEditor SDK (CE.SDK) into a React project using NPM and a custom component. By the end, you'll have a fully functional CE.SDK component running in your React application, ready for customization.

## Who Is This Guide For?

This guide is for developers who:

- Are familiar with React.
- Already have a React project.
- Want to integrate a fully-featured image and video editor into their web application.

## What You’ll Achieve

- Install CE.SDK using NPM.
- Set up CE.SDK in your React project.
- Create a basic creative editor component using the default configurations.

## Prerequisites

Before getting started, make sure you have the following:

- Node.js v20+ and NPM 10+ installed locally. [Download Node.js](https://nodejs.org/download).
- A React 18+ project managed with a [build tool like Vite, Parcel, or RSBuild](https://react.dev/blog/2025/02/14/sunsetting-create-react-app#how-to-migrate-to-a-build-tool).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Install CE.SDK

Add the Creative Editor SDK to your project’s dependencies by installing it via the [`@cesdk/cesdk-js`](https://www.npmjs.com/package/@cesdk/cesdk-js) NPM package:

```bash
npm install @cesdk/cesdk-js
```

## Step 2: Create Your Creative Editor Component

Suppose your current React project has the following file structure from the default [Vite](https://vite.dev/) initialization:

```
your-react-project/
│── .gitignore
│── eslint.config.js
│── index.html
│── package-lock.json
│── package.json
│── README.md
│── vite.config.js
│── ...
│
├── public/
│   └── ...
│
└── src/
    │── App.css
    │── App.jsx
    │── index.css
    │── main.jsx
    │── ...
    │
    └── assets/
        └── ...
```

In the `src/` folder, create a new file named `CreativeEditorSDK.jsx` containing the following component:

> **Warning:** **Important**: You must replace `'YOUR_LICENSE_KEY'` with your actual CE.SDK
> license key. The script will fail with initialization errors without a valid
> license key. [Get a free trial license key](https://img.ly/forms/free-trial).

```jsx
import CreativeEditor from '@cesdk/cesdk-js/react';

// Configure CreativeEditor SDK
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // ⚠️ REPLACE WITH YOUR ACTUAL LICENSE KEY
};

// Initialization function called after SDK instance is created
const init = async cesdk => {
  // Do something with the instance of CreativeEditor SDK (e.g., populate
  // the asset library with default / demo asset sources)
  await Promise.all([
    cesdk.addDefaultAssetSources(),
    cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true,
    }),
  ]);

  // Create a new design scene in the editor
  await cesdk.actions.run('scene.create');
};

export default function CreativeEditorSDKComponent() {
  return (
    <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
  );
}
```

## Step 3: Use the Creative Editor Component

Import `CreativeEditorSDKComponent` in your `App.jsx` file:

```jsx
import { deafult as CreativeEditorSDK } from './CreativeEditorSDK';
```

To use the component and render it on the page, include it in your JSX as follows:

```
<CreativeEditorSDK />
```

`App.jsx` will contain:

```jsx
// Other imports...
import { default as CreativeEditorSDK } from './CreativeEditorSDK';

function App() {
  // State management ...

  return (
    <>
      
      <CreativeEditorSDK />
      
    </>
  );
}

export default App;
```

## Step 4: Serve the Project Locally

Run the project locally by using the development server provided by the bundler configured in your project. In this case, we're using Vite, so run this command:

```bash
npm run dev
```

By default, the React app will be accessible on your localhost at `http://localhost:5173/`.

## Step 5: Test the Integration

1. Open `http://localhost:5173/` in your browser.
2. A fully functional CE.SDK editor should load.

## Troubleshooting & Common Errors

**❌ Error**: `Identifier 'CreativeEditorSDK' has already been declared`

- Ensure that the name of your custom creative editor component function is not `CreativeEditorSDK`, as that is also the name of the class imported from `@cesdk/cesdk-js`.

**❌ Error**: `The following dependencies are imported but could not be resolved: @cesdk/cesdk-js`

- Ensure you've installed CE.SDK correctly via `npm install @cesdk/cesdk-js`.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Verify that your license key is valid and not expired.

**❌ Editor does not load**

- Check the browser console for errors.
- Confirm that your component paths and imports are correct.

## Next Steps

Congratulations! You've successfully integrated CE.SDK into your existing React project. Now, take some time to explore the SDK and move on to the next steps when you're ready:

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