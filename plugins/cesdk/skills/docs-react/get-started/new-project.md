> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart React](./get-started/new-project.md)

---

This guide takes you through the process of creating a React project from
scratch and integrating CreativeEditor SDK (CE.SDK) using npm and a custom
component. By the end, you'll have a fully functional CE.SDK component running
in your new React application, ready for customization.

## Who Is This Guide For?

This guide is for developers who:

- Have some experience with React.
- Want to set up a new React project.
- Want to build a React application with a fully featured image and video editor component.

## What You’ll Achieve

- Initialize a new React project using Vite.
- Install CE.SDK via npm.
- Integrate CE.SDK into your new React project.
- Use CE.SDK to build a basic creative editor React component with default settings.

## Prerequisites

Before you begin, ensure you meet these prerequisites:

- Node.js v20+ and npm 10+ installed locally. [Download the latest LTS version of Node.js and npm](https://nodejs.org/download).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Set Up a New React Project

Using a [build tool like Vite, Parcel, or Rsbuild](https://react.dev/blog/2025/02/14/sunsetting-create-react-app#how-to-migrate-to-a-build-tool) is the recommended way to initialize a new React project. In this guide, you’ll use [Vite](https://vite.dev/).

Run the following Vite command to create a new blank React project:

```shell
npm create vite@latest my-react-app -- --template react
```

This command creates a new React project in the `my-react-app` folder. Navigate to the root of this folder in your terminal:

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

Install the project’s dependencies via npm with:

```shell
npm install
```

## Step 2: Install CE.SDK

Add CreativeEditor SDK to your project’s dependencies by installing the [`@cesdk/cesdk-js`](https://www.npmjs.com/package/@cesdk/cesdk-js) npm package:

```shell
npm install @cesdk/cesdk-js
```

## Step 3: Serve the React Project Locally

Run the project locally using the development server provided by Vite. Start the local server with the following command:

```shell
npm run dev
```

By default, the React app runs on localhost at `http://localhost:5173/`. Open it in your browser to see the React starter page.

## Step 4: Create Your Creative Editor Component

In the `src/` folder of your new React project, create a new file named `CreativeEditorSDK.jsx` defining the following component:

> **Warning:** **Important**: You must replace `'YOUR_LICENSE_KEY'` with your actual CE.SDK
> license key. The script fails with initialization errors without a valid
> license key. [Get a free trial license key](https://img.ly/forms/free-trial).

```jsx title="CreativeEditorSDK.jsx"
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
  await cesdk.createDesignScene();
};

export default function CreativeEditorSDKComponent() {
  return (
    // The CreativeEditor wrapper component
    <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
  );
}
```

## Step 5: Use the Creative Editor Component

Import `CreativeEditorSDKComponent` in the `App.jsx` file:

```jsx title="App.jsx"
import { default as CreativeEditorSDK } from './CreativeEditorSDK';
```

Then, you can render the component on the page by adding it to the JSX as follows:

```jsx title="App.jsx"
<CreativeEditorSDK />
```

`App.jsx` should look like this:

```jsx time="App.jsx"
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

## Step 6: Test the Integration

1. Visit `http://localhost:5173/` in your browser.
2. A fully functional CE.SDK editor should appear.

## Troubleshooting & Common Errors

**❌ Error**: `Identifier 'CreativeEditorSDK' has already been declared`

- Ensure that the name of your custom creative editor component function isn't `CreativeEditorSDK`, as it conflicts with the class imported from `@cesdk/cesdk-js`.

**❌ Error**: `The requested module '/src/CreativeEditorSDK.jsx' does not provide an export named 'CreativeEditorSDKComponent'`

- Import `CreativeEditorSDKComponent` [directly or as a default import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#forms_of_import_declarations), not as a named import, because the `CreativeEditorSDK.jsx` file doesn’t define a named export.

**❌ Error**: `The following dependencies are imported but could not be resolved: @cesdk/cesdk-js`

- Check that you've correctly installed CE.SDK using `npm install @cesdk/cesdk-js`.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Double-check that your CE.SDK license key is valid and hasn't expired.

**❌ Editor doesn't load**

- Check the browser console for any errors.
- Verify that your component paths and imports are correct.

## Next Steps

Congratulations! You've successfully integrated CE.SDK into a new React project. Now, take some time to explore the SDK and proceed to the next steps whenever you're ready:

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