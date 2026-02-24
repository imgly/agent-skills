> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide walks you through downloading and running a prebuilt CreativeEditor
SDK (CE.SDK) React integration project from GitHub. That’s the quickest way to
get started with CE.SDK, as there’s no need to build anything from scratch.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)

<CesdkOverview />

## Who is This Guide For?

This guide is for developers who:

- Want to explore CE.SDK without the hassle of configuring a custom environment.
- Prefer starting with a ready-made React template or sample project.
- Are familiar with using Git and Node.js to set up local development environments.

## What You’ll Achieve

- Clone a ready-to-use CE.SDK React integration project from GitHub.
- Install the necessary dependencies and start the project locally.
- Open a fully functional editor directly in your browser.

## Prerequisites

Before you begin, make sure you have the following:

- **Git**: Needed to clone the project from GitHub. [Download Git](https://git-scm.com/downloads).
- **The latest LTS version of Node.js and npm**: Required to install dependencies and run the local server. [Download Node.js](https://nodejs.org/).
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## Step 1: Clone the GitHub Repository

Start by cloning the CE.SDK examples repository from GitHub:

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
    cd cesdk-web-examples/integrate-with-react
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
    cd cesdk-web-examples/integrate-with-react
    ```
  </TabItem>

  <TabItem label="npx">
    Use `npx degit` to clone only the Angular integration example:

    ```bash
    npx degit https://github.com/imgly/cesdk-web-examples/integrate-with-react
    ```
  </TabItem>
</Tabs>

## Step 2: Install Dependencies

Once inside the project folder, install the dependencies with npm:

```bash
npm install
```

This command installs all packages listed in the `package.json` file.

## Step 3: Add Your License Key

Open the CE.SDK editor component file (located at `/src/CreativeEditorSDK.jsx`), and replace the placeholder license key with your own:

```js title="CreativeEditorSDK.jsx"
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY', // ⚠️ REPLACE WITH YOUR ACTUAL LICENSE KEY
  // ...
};
```

## Step 4: Run the Project

Launch the local [Vite](https://vite.dev/) development server using the following command:

```bash
npm run start
```

By default, the React application will be available on your localhost at `http://localhost:5173/`. Visit that URL in your browser to see the editor in action.

## Troubleshooting & Common Issues

**❌ Issue**: `Module not found**` or missing packages

- Make sure you ran `npm install` and that it completed without any errors.

**❌ Error**: `'vite' is not recognized as an internal or external command, operable program or batch file.`

- Double-check that you ran `npm install` before running `npm run start`. This step also installs Vite, which is required to launch the project locally.

**❌ Error**: `Editor engine could not be loaded: The License Key (API Key) you are using to access CE.SDK is invalid`

- Ensure your CE.SDK license key is valid, hasn’t expired, and you correctly added it to the `config` object.

**❌ The editor doesn’t appear**

- Check the browser console for any detailed error messages.

## Next Steps

Congratulations! You’ve successfully set up CE.SDK in React. When you’re ready, explore the SDK and move on to the next steps:

- [Configure the Creative Editor](./configuration.md)
- [Serve assets from your own servers](./serve-assets.md)
- [Customize interface labels and translations](./user-interface/localization.md)
- [Edit colors and appearance with themes](./user-interface/appearance/theming.md)



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support