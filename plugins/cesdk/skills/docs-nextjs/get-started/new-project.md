> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Next.js](./get-started/new-project.md)

---

This guide shows you how to set up a **new Next.js project**, and integrate
the CreativeEditor SDK (CE.SDK) using the official React wrapper component.
You'll learn how to install CE.SDK via npm, create a reusable editor
component, and embed it cleanly into your app, ready for customization.

## Who Is This Guide For?

This guide is for developers who:

- Have basic experience with Next.js.
- Want to start a new Next.js project.
- Want to build a page in their app that includes a fully featured image and video editor client-side component.

## What You’ll Achieve

- Initialize a new Next.js project using `create-next-app`.
- Install the CreativeEditor SDK (CE.SDK) via **npm**.
- Create a custom Creative Editor **component** with default settings using the official React wrapper.
- Use CE.SDK in your Next.js pages.

## Prerequisites

Before getting started, make sure you have the following prerequisites:

- Node.js v20.12+ and npm 10+ installed on your machine. [Download the latest LTS version of Node.js and npm](https://nodejs.org/en/download).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Set Up a New Next.js Project

To create a new blank Next.js project called `my-nextjs-app`, run the following command:

```bash
npx create-next-app@latest my-nextjs-app
```

The CLI prompts you with a few questions. Choose:

- Default options.
- **JavaScript** as programming language instead of TypeScript.

The CLI creates a new Next.js project in the `my-nextjs-app` folder. Navigate into the project folder in the terminal:

```bash
cd my-nextjs-app
```

Below is the file structure the Next.js project folder should contain:

```
my-nextjs-app/
├── app/                # Application source code
│   ├── favicon.ico     # Application favicon
│   ├── globals.css     # Global styles
│   ├── layout.js       # Main layout component
│   └── page.js         # Main page component
│
├── public/              # Static assets
│   ├── file.svg        # Sample SVG file
│   ├── globe.svg       # Globe SVG asset
│   ├── next.svg        # Next.js logo SVG
│   ├── vercel.svg      # Vercel logo SVG
│   └── window.svg      # Window SVG asset
│
├── .gitignore          # Git ignore file
├── jsconfig.json       # JavaScript configuration file
├── next.config.mjs     # Next.js configuration file
├── package-lock.json   # Lock file for package dependencies
├── package.json        # Project dependencies and scripts
├── postcss.config.mjs  # PostCSS configuration file
└── README.md           # Project README file
```

Install dependencies with:

```bash
npm install
```

## Step 2: Install CE.SDK

Install the CreativeEditor SDK by adding the [`@cesdk/cesdk-js`](https://www.npmjs.com/package/@cesdk/cesdk-js) npm package to your project’s dependencies:

```bash
npm install @cesdk/cesdk-js
```

## Step 3: Run the Next.js Project Locally

Run your project locally by starting the development server with:

```bash
npm run dev
```

Navigate to `http://localhost:3000/` to see the starter Next.js app in your browser.

## Step 4: Create Your Creative Editor Component

In your new codebase, add a `components/` folder to the `app/` folder of your new Next.js project:

```
app/
 ├── components/ # the new folder
 ├── ...
 └── page.js
```

Inside the `components/` folder, create a new file named `CreativeEditorSDK.js` defining the following component:

```jsx title="CreativeEditorSDK.js"
'use client';

import CreativeEditor from '@cesdk/cesdk-js/react';

// Configure CreativeEditor SDK
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // replace with a valid CE.SDK license key
};

// initialization function called after SDK instance is created
const init = async cesdk => {
  // do something with the instance of CreativeEditor SDK (e.g., populate
  // the asset library with default / demo asset sources)
  await Promise.all([
    cesdk.addDefaultAssetSources(),
    cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true,
    }),
  ]);

  // create a new design scene in the editor
  await cesdk.createDesignScene();
};

export default function CreativeEditorSDKComponent() {
  return (
    // The CreativeEditor wrapper component
    <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
  );
}
```

> **Note:** Always add [`"use
>   client"`](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
> directive at the top of your custom Creative Editor component. It runs in the
> browser and uses React hooks to initialize the SDK.

## Step 5: Use the Creative Editor Component

Import `CreativeEditorSDKComponent` in your `page.js` file and use it in your page:

```jsx title="page.js"
import CreativeEditorSDKComponent from './components/CreativeEditorSDK';

export default function Home() {
  return (
    <>
      
      <CreativeEditorSDKComponent />
      
    </>
  );
}
```

## Step 6: Test the Integration

1. Open `http://localhost:3000/` in your browser.
2. A fully functional CE.SDK editor should appear.

## Troubleshooting & Common Errors

**❌ Error**: `Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.`

- This error only occurs during development due to how the local Turbopack development server works and how CreativeEditor SDK dynamically manipulates the DOM to mount the editor in the browser. In production, this error won't appear, so you can either safely ignore it or suppress it with [`suppressHydrationWarning`](https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning).

**❌ Error**: `Identifier 'CreativeEditorSDK' has already been declared`

- Ensure that the name of your custom creative editor component function in `CreativeEditorSDK.js` isn't `CreativeEditor`, as that conflicts with the component imported from `@cesdk/cesdk-js/react`.

**❌ Error**: `The following dependencies are imported but could not be resolved: @cesdk/cesdk-js`

- Verify that you've correctly installed CE.SDK using `npm install @cesdk/cesdk-js`.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Double-check that your license key is valid and hasn't expired.

**❌ Editor doesn't load**

- Check the browser console for any errors.
- Make sure that your component paths and imports are correct.

## Next Steps

Congratulations! You've successfully integrated CE.SDK into a new Next.js project. Now take a moment to explore what the SDK offers, and move on to the next steps whenever you're ready:

- [Configure the Creative Editor](./user-interface/overview.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Create and use a license key](./licensing.md)
- [Configure callbacks](./actions.md)
- [Customize interface labels and translation](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support