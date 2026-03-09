> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide walks you through how to integrate CreativeEditor SDK (CE.SDK) into
a Next.js project using npm and the official React wrapper component. By the
end, you'll have a fully operational CE.SDK component embedded in your Next.js
app, ready for further customization.

## Who Is This Guide For?

This guide is for developers who:

- Have experience with Next.js.
- Already have an existing Next.js project.
- Want to integrate a powerful image and video editor into their full-stack web app.

## What You'll Achieve

- Install CreativeEditor SDK (CE.SDK) in your project using npm.
- Set up CE.SDK in your Next.js app using the official React wrapper component with default configurations.
- Render CE.SDK on your Next.js pages using the official React wrapper.

## Prerequisites

Before getting started, make sure you meet the following prerequisites:

- Node.js v20.12+ and npm 10+ installed on your machine. [Download the latest LTS version of Node.js and npm](https://nodejs.org/en/download).
- A Next.js 14+ project created with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Launch the Next.js Project Locally

Start the local development server powered by [Turbopack](https://nextjs.org/docs/pages/api-reference/turbopack) by running the following command:

<Run />

By default, the Next.js app listens at your localhost on `http://localhost:3000/`. Open it on your browser and ensure everything works properly before proceeding.

## Step 2: Install CE.SDK

Install CreativeEditor SDK by adding the [`@cesdk/cesdk-js`](https://www.npmjs.com/package/@cesdk/cesdk-js) npm package to your project’s dependencies:

<Install />

## Step 3: Create Your Creative Editor Component

If you created your Next.js project using `create-next-app`, your folder structure should look like this, with components stored in the `/app/components/` directory:

```
your-nextjs-app/
├── app/
│   ├── components/
│   │   └── ...
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── public/
│   └── ...
│
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── README.md
```

Inside the `components/` folder, create a new component using your project’s programming language:

<Tabs syncKey="code-language">
  <TabItem label="JavaScript">
    Create a new file called `CreativeEditorSDK.js` and define the following component inside it:

    ```jsx title="CreativeEditorSDK.js"
    'use client';

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
        // The CreativeEditor wrapper component
        <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
      );
    }
    ```
  </TabItem>

  <TabItem label="TypeScript">
    Create a new file called `CreativeEditorSDK.tsx` and define the following component inside it:

    ```tsx title="CreativeEditorSDK.tsx"
    'use client';

    import CreativeEditor from '@cesdk/cesdk-js/react';

    // Configure CreativeEditor SDK
    const config = {
    // license: 'YOUR_CESDK_LICENSE_KEY', // ⚠️ REPLACE WITH YOUR ACTUAL LICENSE KEY
    };

    // Initialization function called after SDK instance is created
    const init = async (cesdk) => {
    // Do something with the instance of CreativeEditor SDK (e.g., populate
    // the asset library with default / demo asset sources)
    await Promise.all([
    cesdk.addDefaultAssetSources(),
    cesdk.addDemoAssetSources({ sceneMode: 'Design', withUploadAssetSources: true }),
    ]);

    // Create a new design scene in the editor
    await cesdk.actions.run('scene.create');
    };

    export default function CreativeEditorSDKComponent() {
      return (
        // The CreativeEditor wrapper component
        <CreativeEditor
          config={config}
          init={init}
          width="100vw"
          height="100vh"
        />
      );
    }
      
    ```
  </TabItem>
</Tabs>

Always add the [`'use client'`](https://nextjs.org/docs/app/building-your-application/rendering/client-components) directive at the top of the Creative Editor component. The component runs in the browser and uses React hooks to initialize CreativeEditor SDK.

> **Note:** If your project doesn't use a `components/` folder or you store components
> elsewhere, you can place the `CreativeEditorSDK` file in the appropriate
> directory. Remember to **adjust your import paths accordingly in the next
> steps**.

## Step 4: Use the Creative Editor Component

Import the `CreativeEditorSDKComponent` in your pages. For example, a `page.js`/`page.tsx` that integrates the Creative Editor component might contain:

<Tabs syncKey="code-language">
  <TabItem label="JavaScript">
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
  </TabItem>

  <TabItem label="TypeScript">
    ```tsx title="page.tsx"
    import CreativeEditorSDKComponent from './components/CreativeEditorSDK';

    export default function Home() {
      return (
        <>
          
          <CreativeEditorSDKComponent />
          
        </>
      );
    }
    ```
  </TabItem>
</Tabs>

## Step 5: Test the Integration

1. Open `http://localhost:3000/` in your browser.
2. A fully functional CE.SDK editor should appear.

## Troubleshooting & Common Errors

**❌ Error**: `Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.`

- This issue appears during development because Turbopack pre-renders pages on the server before the browser executes any client-side logic. It doesn't affect production builds. You can safely ignore it or suppress it using [`suppressHydrationWarning`](https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning).

**❌ Error**: `Identifier 'CreativeEditorSDK' has already been declared`

- Ensure that the name of your custom creative editor component function isn't `CreativeEditor`, as that conflicts with the component imported from `@cesdk/cesdk-js/react`.

**❌ Error**: `The following dependencies are imported but could not be resolved: @cesdk/cesdk-js`

- Check that the CE.SDK package is properly installed by running `npm install @cesdk/cesdk-js`.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Ensure that your license key is valid and hasn't expired.

**❌ Editor does not load**

- Open the browser console and inspect any error messages.
- Double-check your import paths and component locations for typos or incorrect structure.

## Next Steps

Congratulations! You’ve successfully added CE.SDK to your Next.js project! Take a moment to explore its features, then move on to the next steps whenever you’re ready:

- [Perform Basic Configuration](./user-interface/overview.md)
- [Configure the Callbacks](./actions.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Create and use a license key](./licensing.md)
- [Configure callbacks](./actions.md)
- [Add Localization](./user-interface/localization.md)
- [Adapt the User Interface](./user-interface/appearance/theming.md)



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support