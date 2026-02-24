> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Download and run a prebuilt vanilla Svelte project from GitHub, with
CreativeEditor SDK (CE.SDK) already integrated. It’s the fastest way to get
started with CE.SDK—no need to set up the app from scratch.

<CesdkOverview />

## Who Is This Guide For?

This guide is ideal for developers who:

- Want to test quickly CE.SDK.
- Prefer working with a pre-configured Svelte sample project (without SvelteKit).
- Are familiar with Git and Node.js on local environments.

## What You’ll Achieve

- Clone the CE.SDK Svelte project from GitHub.
- Install dependencies and run the project locally.
- Launch a fully functional image and video editor directly in your browser.

## Prerequisites

Before getting started, make sure you have the following:

- **Git**: Required to clone the project from GitHub. [Download Git](https://git-scm.com/downloads).
- **The latest LTS version of Node.js and npm**: Needed to install dependencies and run the local server. [Download Node.js](https://nodejs.org/).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Clone the GitHub Repository

First, clone the CE.SDK examples repository from GitHub:

> **Note:** Since this is a large repository, the cloning process can be slow depending on
> your network. The following steps include alternative methods to clone faster.

<Tabs>
  <TabItem label="Git">
    ```bash
    git clone https://github.com/imgly/cesdk-web-examples.git
    ```

    <details>
      <summary>Clone taking too long?</summary>

      Try a shallow clone instead:

      ```bash
      git clone --depth=1 --branch main --single-branch https://github.com/imgly/cesdk-web-examples.git
      ```
    </details>

    Then navigate to the Angular integration folder:

    ```bash
    cd cesdk-web-examples/integrate-with-svelte
    ```
  </TabItem>

  <TabItem label="GitHub CLI">
    ```bash
    gh repo clone imgly/cesdk-web-examples
    ```

    <details>
      <summary>Clone taking too long?</summary>

      Try a shallow clone instead:

      ```bash
      gh repo clone imgly/cesdk-web-examples -- --depth=1 --branch main --single-branch imgly/cesdk-web-examples
      ```
    </details>

    Then navigate to the Angular integration folder:

    ```bash
    cd cesdk-web-examples/integrate-with-svelte
    ```
  </TabItem>

  <TabItem label="npx">
    Use `npx degit` to clone only the Angular integration example:

    ```bash
    npx degit https://github.com/imgly/cesdk-web-examples/integrate-with-svelte
    ```
  </TabItem>
</Tabs>

## Step 2: Install the Dependencies

Install the project’s dependencies via npm:

```bash
npm install
```

## Step 3: Add Your License Key

1. Open the project in your IDE.
2. Open the CE.SDK editor component file: `/src/lib/CreativeEditorSDK.svelte`.
3. Replace the placeholder license key with your own:

```svelte title="CreativeEditorSDK.svelte"
const defaultConfig = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
  // ...
};
```

## Step 4: Run the Project

Start the local [Vite](https://vite.dev/) development server by running:

```bash
npm run dev
```

By default, the Svelte application runs on localhost on `http://localhost:5173/`. Open that URL in your browser to see the creative editor in action.

## Troubleshooting & Common Issues

**❌ Issue**: `Module not found` or missing packages

- Ensure you ran `npm install` and that it completed successfully without errors.

**❌ Error**: `'vite' is not recognized as an internal or external command, operable program or batch file.`

- Double-check that you ran `npm install` to install Vite **before** executing `npm run dev`. The project requires Vite to run locally.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Confirm that your CE.SDK license key is valid, hasn’t expired, and is correctly added to the `defaultConfig` object.

**❌ Issue**: The editor doesn’t appear

- Check the browser console for any specific error messages that might help you troubleshoot.

## Next Steps

Congratulations! You’ve successfully set up CE.SDK in Svelte. When you’re ready, dive deeper into the SDK and proceed with the next steps:

- [Configure the Creative Editor](./user-interface/overview.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Customize interface labels and translations](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support