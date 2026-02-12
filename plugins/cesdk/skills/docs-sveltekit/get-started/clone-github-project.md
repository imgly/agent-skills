> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart SvelteKit](./get-started/new-project.md)

---

Learn how to download and run a **pre-configured SvelteKit project** for
CE.SDK from GitHub. This approach provides a ready-made environment,
eliminating the need for initial setup.

<CesdkOverview />

## Who Is This Guide For?

This guide is for developers who:

- Want to skip setting up a custom environment to test CE.SDK.
- Prefer to use a **pre-built** SvelteKit template or sample project.
- Are comfortable using **Git** and **SvelteKit** to set up local development environments.

## What You’ll Achieve

Follow this guide to:

- **Clone** the project from GitHub.
- **Install** dependencies.
- **Run** the project locally.
- **Access** a fully functional editor in your browser.

## Prerequisites

Before you start, ensure you have the following:

- A **cloning tool** (Git, GitHub CLI, or `npx`).
- **The latest LTS version of Node.js and npm**: Needed to install dependencies and run the local server. [Download Node.js](https://nodejs.org/).
- A valid **CE.SDK license key**.

## Step 1: Clone the GitHub Repository

Begin by cloning the CE.SDK examples repository from GitHub:

> **Note:** Since this is a large repository, the cloning process can be **slow**
> depending on your network. The following steps include **alternative** methods
> to clone faster.

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

    Then, navigate to the SvelteKit folder:

    ```bash
    cd cesdk-web-examples/integrate-with-angular
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
      gh repo clone imgly/cesdk-web-examples -- --depth=1 --branch main --single-branch
      ```
    </details>

    Then navigate to the SvelteKit folder:

    ```bash
    cd cesdk-web-examples/integrate-with-angular
    ```
  </TabItem>

  <TabItem label="npx">
    Use `npx degit` to clone only the Angular integration example:

    ```bash
    npx degit https://github.com/imgly/cesdk-web-examples/integrate-with-sveltekit
    ```
  </TabItem>
</Tabs>

## Step 2: Install the Dependencies

At the root of the project directory, install the required dependencies using **npm**:

```bash
npm install
```

This downloads and installs all the packages specified in the project’s `package.json` file.

## Step 3: Add Your License Key

Next, add your license key to the project:

1. Open `/src/lib/CreativeEditorSDK.svelte`.
2. Replace the placeholder license key with your valid key:

```svelte title="CreativeEditorSDK.svelte"
const defaultConfig = {
  // license: "<YOUR_CE_SDK_LICENSE>", // Replace with your CE.SDK license key
  // ...
};
```

## Step 4: Run the Project

Launch the development server by running:

```bash
npm run dev
```

By default, the SvelteKit app runs on port `5173`.

1. Navigate to `http://localhost:5173/` in your browser.
2. Access a fully functional video and image editor in your browser.

## Troubleshooting & Common Issues

❌ **Issue**: `Module not found` or missing packages

- Ensure you’ve run `npm install` and that it **completed** without any issues.

❌ **Error**: `'vite' is not recognized as an internal or external command, operable program or batch file.`

- The install step also installs Vite, which the project requires to run locally. Double-check that you’ve run the following commands in the correct order:

  1. `npm install`.
  2. `npm run dev`.

❌ **Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Verify that your CE.SDK license key:

  - Is valid.
  - Hasn’t expired.
  - Is correctly added to the `defaultConfig` object.

❌ **Issue**: The editor doesn’t appear.

- Look for any server-side errors in the terminal.
- Check the browser console for detailed error messages.

## Next Steps

Congratulations! You’ve successfully integrated CE.SDK into SvelteKit. When you’re ready, explore the SDK, and proceed to the next steps:

- [Configure the Creative Editor](./user-interface/overview.md)
- [Configure the Callbacks](./actions.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Customize interface labels and translations](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support